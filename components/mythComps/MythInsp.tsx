import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MythType } from "@/types/mythType";
import Modal from "../Modal";
import { INSPIRATION_MARKERS } from "@/utils/markers";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function MythInsp({ data }: { data: MythType["myth_insp"][0] }) {

  const [openModal, setOpenModal] = useState<string | null>(null);

  const contributionForm = useFormState({
    name: data.inspirations.name,
    tagline: data.inspirations.tagline,
    location: data.inspirations.location,
    markers: data.inspirations.markers,
    contribution: data.contribution
  });

  const elements = buildFormElements(contributionForm.form, contributionForm.update, {
    name: { label: "Name" },
    tagline: { label: "Tagline" },
    location: { label: "Location" },
    markers: { label: "Markers", options: Object.keys(INSPIRATION_MARKERS) },
    contribution: { label: "Contribution" }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("inspirations").update({ name: contributionForm.form.name.trim(), tagline: contributionForm.form.tagline.trim(), location: contributionForm.form.location.trim(), markers: contributionForm.form.markers }).eq("id", data.inspirations.id);
    await supabase.from("myth_insp").update({ contribution: contributionForm.form.contribution.trim() }).eq("myth_id", data.myth_id).eq("inspiration_id", data.inspirations.id);
    contributionForm.reset();
    setOpenModal(null);
  }

  const handleDelete = async () => {
    await supabase.from("myth_insp").delete().eq("myth_id", data.myth_id).eq("inspiration_id", data.inspirations.id);
    const { data: characters } = await supabase.from("fantasy_characters").select("*").eq("inspiration_id", data.inspirations.id);
    const { data: myths } = await supabase.from("myth_insp").select("*").eq("inspiration_id", data.inspirations.id);
    if ((characters && characters.length === 0) && (myths && myths.length === 0)) {
      await supabase.from("inspirations").delete().eq("id", data.inspirations.id);
    }
    window.location.reload();
  }

  return (
    <>
      <div className="card p-0 overflow-hidden flex flex-col">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div>
            <div className="flex justify-between items-center">
              <h4>{data.inspirations.name}</h4>
              <div className="flex gap-1">
                {data.inspirations.markers.map(marker => {
                  const Icon = INSPIRATION_MARKERS[marker];
                  return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
                })}
              </div>
            </div>
            <p className="text-xs font-body italic mb-2">{data.inspirations.location}</p>
            <p className="font-serif italic mb-2">{data.inspirations.tagline}</p>
            <p className="font-serif">{data.contribution}</p>
          </div>
          <button onClick={() => setOpenModal("contribution")} className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full">Edit</button>
        </div>
      </div>
      <Modal
        heading="Edit Contribution"
        open={openModal === "contribution"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        disabled={contributionForm.form.name.trim() === ""}
      />
    </>
  );
}