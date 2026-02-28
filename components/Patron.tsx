import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DeityType } from "@/types/deityType";
import { PANTHEON_MARKERS } from "@/utils/markers";
import { Sparkles } from "lucide-react";
import Modal from "./Modal";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Patron({ data }:Readonly<{ data: DeityType }>) {

  const Icon = PANTHEON_MARKERS[data.patron];
  const [openModal, setOpenModal] = useState<string | null>(null);

  const deityForm = useFormState({
    patron: data.patron,
    representations: data.representations,
    blessing: data.blessing,
    description: data.description
  });

  const elements = buildFormElements(deityForm.form, deityForm.update, {
    patron: { label: "Patron" },
    representations: { label: "Representations" },
    blessing: { label: "Blessing" },
    description: { label: "Description" }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("deities").update({
      patron: deityForm.form.patron.trim(),
      representations: deityForm.form.representations.trim(),
      blessing: deityForm.form.blessing.trim(),
      description: deityForm.form.description.trim()
    }).eq("id", data.id);
    deityForm.reset();
    setOpenModal(null);
  };

  return (
    <>
      <div className="card flex flex-col gap-4 text-center font-body">
        <div className="flex flex-col items-center flex-1">
          <div className="bg-background/80 border border-border/50 rounded-full shadow-sm h-12 w-12 flex items-center justify-center">
            {Icon && <Icon className="h-6 w-auto text-secondary"/>}
          </div>
          <h3 className="mt-4 mb-2">{data.patron}</h3>
          <p className="font-serif italic">Patron of {data.representations}</p>
          <div className="flex items-center gap-2 text-secondary mt-4 mb-2">
            <Sparkles className="h-4 w-auto" />
            <span className="uppercase font-bold text-xs">Divine blessing</span>
          </div>
          <p className="bg-primary/5 border border-primary/10 p-3 rounded-lg text-sm w-full flex-1 flex items-center justify-center">{data.blessing}: {data.description}.</p>
        </div>
        <button onClick={() => setOpenModal("deity")} className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full">Edit</button>
      </div>
      <Modal
        heading="Edit Deity"
        open={openModal === "deity"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={deityForm.form.patron.trim() === ""}
      />
    </>
  );
}