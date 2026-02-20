"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MyChar } from "../types/myChar";
import Modal from "./Modal";

export default function MyCh({ data }: { data: MyChar }) {

  const [open, setOpen] = useState(false);
  const [inspiration, setInspiration] = useState("");
  const [contribution, setContribution] = useState(data.contribution);

  useEffect(() => {
    const fetchData = async () => {
      const { data: character } = await supabase.from("characters").select("*").eq("id", data.character_id).single();
      setInspiration(character?.inspiration ?? "");
    }
    fetchData();
  }, [data.character_id]);

  const elements = {
    inspiration: {
      label: "Inspiration",
      value: inspiration,
      setValue: setInspiration
    },
    contribution: {
      label: "Contribution",
      value: contribution,
      setValue: setContribution
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("characters").update({ inspiration: inspiration.trim() }).eq("id", data.character_id);
    await supabase.from("myth_chars").update({ contribution: contribution.trim() }).eq("myth_id", data.myth_id).eq("character_id", data.character_id);
    setInspiration("");
    setContribution("");
    setOpen(false);
  }

  return (
    <>
      <div className="card p-0 overflow-hidden flex flex-col">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div>
            <h3>{inspiration}</h3>
            <p className="font-serif">{data.contribution}</p>
          </div>
          <button onClick={() => setOpen(true)} className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full">Edit</button>
        </div>
      </div>
      <Modal
        heading="Edit Contribution"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={inspiration.trim() === ""}
       />
    </>
  );
}