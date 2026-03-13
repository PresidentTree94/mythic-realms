import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";
import { TerritoryType } from "@/types/territoryType";
import Modal from "../Modal";
import { useForm } from "@presidenttree94/form-utils";

export default function Territory({ data }: { data: TerritoryType }) {

  const router = useRouter();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const territoryForm = useForm(
    {
      name: data.name,
      counterpart: data.counterpart
    },
    {
      name: { label: "Name", required: true },
      counterpart: { label: "Counterpart", required: true }
    }
  );

  const handleSubmit = async () => {
    await supabase.from("territories").update({
      name: territoryForm.form.name.trim(),
      counterpart: territoryForm.form.counterpart.trim()
    }).eq("id", data.id);
  }

  const handleDelete = async () => {
    await supabase.from("fantasy_characters").update({ homeland_id: null }).eq("homeland_id", data.id);
    await supabase.from("fantasy_characters").update({ residence_id: null }).eq("residence_id", data.id);
    await supabase.from("territories").delete().eq("id", data.id);
    router.refresh();
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
        elements={territoryForm.elements}
        reset={territoryForm.reset}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
      />
    </>
  );
}