import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";
import { TerritoryType } from "@/types/territoryType";
import Modal from "../Modal";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Territory({ data }: { data: TerritoryType }) {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const territoryForm = useFormState({
    name: data.name,
    counterpart: data.counterpart
  });

  const elements = buildFormElements(territoryForm.form, territoryForm.update, {
    name: { label: "Name" },
    counterpart: { label: "Counterpart" }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("territories").update({
      name: territoryForm.form.name.trim(),
      counterpart: territoryForm.form.counterpart.trim()
    }).eq("id", data.id);
  }

  return (
    <>
      <div className="card flex flex-col items-center text-center">
        <MapPin className="h-8 w-auto text-secondary mb-2" />
        <h4>{data.name}</h4>
        <p className="text-xs mb-4 font-body">{data.counterpart}</p>
        <button onClick={() => setOpenModal("territory")} className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full">Edit</button>
      </div>
      <Modal
        heading="Edit Territory"
        open={openModal === "territory"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={territoryForm.form.name.trim() === "" || territoryForm.form.counterpart.trim() === ""}
      />
    </>
  );
}