"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { MythType } from "@/types/mythType";
import { InspirationType } from "@/types/inspirationType";
import MythInsp from "@/components/mythComps/MythInsp";
import Modal from "@/components/Modal";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function MythPage() {

  const { slug } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [myth, setMyth] = useState<MythType>();
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);

  const mythForm = useFormState({ title: "", summary: "" });
  const contributionForm = useFormState({ name: "", newName: "", location: "", markers: [] as string[], contribution: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: myths } = await supabase.from("myths").select("*, myth_insp( myth_id, contribution, inspirations (*) )").eq("id", slug).single();
      const sorted = myths ? {...myths,
        myth_insp: myths.myth_insp.sort((a: any, b: any) => a.inspirations.name.localeCompare(b.inspirations.name))
      }: null;
      setMyth(sorted);
      const { data: inspirations } = await supabase.from("inspirations").select("*").order("name", { ascending: true });
      setInspirations(inspirations ?? []);
    };
    fetchData();
  }, [slug]);

  const mythElements = buildFormElements(mythForm.form, mythForm.update, {
    title: { label: "Title" },
    summary: { label: "Summary" }
  });

  useEffect(() => {
    if (myth) {
      mythForm.setForm({
        title: myth.title,
        summary: myth.summary
      });
    }
  }, [myth]);

  const handleMythSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("myths").update({ title: mythForm.form.title.trim(), summary: mythForm.form.summary.trim() }).eq("id", slug);
    mythForm.reset();
    setOpenModal(null);
  }

  const contributionElements = buildFormElements(contributionForm.form, contributionForm.update, {
    name: {
      label: "Name",
      options: inspirations.map(i => i.name),
      defaultOption: "Select Inspiration"
    },
    newName: { label: "New Name" },
    location: { label: "Location" },
    markers: {
      label: "Markers",
      options: ["Deity", "Demigod", "Nymph", "Seer", "Prophet"],
    },
    contribution: { label: "Contribution" }
  });

  useEffect(() => {
    if (contributionForm.form.name) {
      const inspiration = inspirations.find(i => i.name === contributionForm.form.name);
      contributionForm.setForm({
        ...contributionForm.form,
        location: inspiration?.location ?? "",
        markers: inspiration?.markers ?? []
      });
    } else {
      contributionForm.setForm({
        ...contributionForm.form,
        location: "",
        markers: []
      });
    }
  }, [contributionForm.form.name, inspirations]);

  const handleContributionSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { data } = await supabase.from("inspirations").upsert({
      name: contributionForm.form.name ? contributionForm.form.name : contributionForm.form.newName.trim(),
      location: contributionForm.form.location.trim(),
      markers: contributionForm.form.markers
    }, { onConflict: "name" }).select().single();
    if (data) {
      await supabase.from("myth_insp").insert({ myth_id: slug, inspiration_id: data.id, contribution: contributionForm.form.contribution.trim() });
    }
    contributionForm.reset();
    setOpenModal(null);
  }

  return (
    <>
      <h2 className="mt-16 text-center">{myth?.title}</h2>
      <p className="card font-serif">{myth?.summary}</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={() => setOpenModal("myth")} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Edit Myth</button>
        <button onClick={() => setOpenModal("contribution")} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Contribution</button>
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myth?.myth_insp.map((mythInsp) => 
          <MythInsp key={mythInsp.inspirations.id} data={mythInsp} />
        )}
      </article>
      <Modal
        heading="Edit Myth"
        open={openModal === "myth"}
        setOpen={setOpenModal}
        elements={mythElements}
        handleSubmit={handleMythSubmit}
        disabled={mythForm.form.title.trim() === ""}
      />
      <Modal
        heading="Add Contribution"
        open={openModal === "contribution"}
        setOpen={setOpenModal}
        elements={contributionElements}
        handleSubmit={handleContributionSubmit}
        disabled={contributionForm.form.name.trim() === "" && contributionForm.form.newName.trim() === ""}
      />
    </>
  );
}