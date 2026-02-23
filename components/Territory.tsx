import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";
import { KingdomType } from "@/types/kingdomType";
import Modal from "./Modal";

export default function Territory({ data }: { data: KingdomType["territories"][0] }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [counterpart, setCounterpart] = useState("");

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    counterpart: {
      label: "Counterpart",
      value: counterpart,
      setValue: setCounterpart
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("territories").update({
      name: name.trim(),
      counterpart: counterpart.trim()
    }).eq("id", data.id);
  }

  return (
    <>
      <div className="card flex flex-col items-center text-center">
        <MapPin className="h-8 w-auto text-secondary mb-2" />
        <h4>{data.name}</h4>
        <p className="text-xs mb-4">{data.counterpart}</p>
        <button onClick={() => setOpen(true)} className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full">Edit</button>
      </div>
      <Modal
        heading="Edit Territory"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={name.trim() === "" || counterpart.trim() === ""}
      />
    </>
  );
}