"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { My } from "@/types/my";
import { Char } from "@/types/char";
import Modal from "@/components/Modal";
import MyCh from "@/components/MyCh";
import { MyChar } from "@/types/myChar";

export default function MythPage() {

  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [inspiration, setInspiration] = useState("");
  const [contribution, setContribution] = useState("");
  const [myth, setMyth] = useState<My>();
  const [mythChars, setMythChars] = useState<MyChar[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("myths").select("*").eq("id", slug).single();
      setMyth(data);
      const { data: chars } = await supabase.from("myth_chars").select("*").eq("myth_id", slug);
      setMythChars(chars ?? []);
    };
    fetchData();
  }, [slug]);

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
    let { data: character } = await supabase.from("characters").select("*").eq("inspiration", inspiration).single();
    if (!character) {
      const { data: newChar } = await supabase.from("characters").insert({ inspiration: inspiration.trim() }).select("*").single();
      character = newChar;
    }
    await supabase.from("myth_chars").insert({ myth_id: slug, char_id: character.id, contribution: contribution.trim() });

    setInspiration("");
    setContribution("");
    setOpen(false);
  }

  return (
    <>
      <h2 className="mt-16 text-center">{myth?.title}</h2>
      <p className="card font-serif">{myth?.summary}</p>
       <div className="text-center">
        <button onClick={() => setOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Contribution</button>
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mythChars.map((myChar) => 
          <MyCh key={myChar.id} data={myChar} />
        )}
      </article>
      <Modal
        heading="Add New Contribution"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
       />
    </>
  );
}