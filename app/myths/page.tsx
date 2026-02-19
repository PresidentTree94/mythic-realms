"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Myth from "@/components/Myth";
import { My } from "@/types/my";
import Modal from "@/components/Modal";

export default function Myths() {

  const [open, setOpen] = useState(false);
  const [myths, setMyths] = useState<My[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("myths").select("*").order("title", { ascending: true });
      setMyths(data ?? []);
    }
    fetchData();
  }, []);

  const elements = {
    title: {
      label: "Title",
      value: title,
      setValue: setTitle
    },
    summary: {
      label: "Summary",
      value: summary,
      setValue: setSummary
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("myths").insert({ title: title.trim(), summary: summary.trim() });
    setTitle("");
    setSummary("");
    setOpen(false);
  }

  return (
    <>
      <div className="mt-16 text-center">
        <h2>The Chronicles</h2>
        <p className="italic mt-4 font-semibold font-serif">"Legends are but truths that time has forgotten."</p>
      </div>
      <div className="text-center">
        <button onClick={() => setOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Myth</button>
      </div>
      <article className="columns-1 md:columns-2 lg:columns-3 space-y-8 gap-8 break-inside-avoid">
        {myths.map((myth) => (
          <Myth key={myth.id} data={myth} />
        ))}
      </article>
      <Modal
        heading="Add New Myth"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
      />
    </>
  );
}