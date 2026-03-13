import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MythType } from "@/types/mythType";
import { InspirationType } from "@/types/inspirationType";
import { getMythById } from "@/lib/data/mythQueries";
import { getInspirations } from "@/lib/data/inspirationQueries";
import { useForm } from "@presidenttree94/form-utils";

export default function useMythData(slug: number) {

  const [myth, setMyth] = useState<MythType>();
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const mythData = await getMythById(slug);
      const sorted = mythData ? {...mythData,
        myth_insp: mythData.myth_insp.sort((a: any, b: any) => a.inspirations.name.localeCompare(b.inspirations.name))
      }: null;
      setMyth(sorted);
      const inspirationData = await getInspirations();
      setInspirations(inspirationData);
    };
    fetchData();
  }, [slug]);

  /*---MYTH FORM---*/
  const mythForm = useForm(
    {
      title: myth?.title ?? "",
      subtitle: myth?.subtitle ?? "",
      summary: myth?.summary ?? "",
    },
    {
      title: { label: "Title", required: true },
      subtitle: { label: "Subtitle" },
      summary: { label: "Summary" }
    }
  );

  const handleMythSubmit = async () => {
    await supabase.from("myths").update({ title: mythForm.form.title.trim(), subtitle: mythForm.form.subtitle.trim(), summary: mythForm.form.summary.trim() }).eq("id", slug);
    mythForm.reset();
  }

  /*---CONTRIBUTION FORM---*/
  const contributionForm = useForm(
    {
      name: "",
      newName: "",
      tagline: "",
      location: "",
      markers: [] as string[],
      contribution: ""
    },
    {
      name: {
        label: "Name",
        options: ["", ...inspirations.map(i => i.name)],
      },
      newName: { label: "New Name" },
      tagline: { label: "Tagline" },
      location: { label: "Location" },
      markers: {
        label: "Markers",
        options: ["Deity", "Demigod", "Nymph", "Seer", "Prophet"],
        multi: true
      },
      contribution: { label: "Contribution", required: true}
    }
  );

  const handleContributionSubmit = async () => {
    const { data } = await supabase.from("inspirations").upsert({
      name: contributionForm.form.name ? contributionForm.form.name : contributionForm.form.newName.trim(),
      tagline: contributionForm.form.tagline.trim(),
      location: contributionForm.form.location.trim(),
      markers: contributionForm.form.markers
    }, { onConflict: "name" }).select().single();
    if (data) {
      await supabase.from("myth_insp").insert({ myth_id: slug, inspiration_id: data.id, contribution: contributionForm.form.contribution.trim() });
    }
    contributionForm.reset();
  }

  return { myth, inspirations, mythForm, handleMythSubmit, contributionForm, handleContributionSubmit };
}