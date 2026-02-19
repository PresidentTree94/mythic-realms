"use client";
export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Character from "@/components/Character";
import { Char } from "@/types/char";
import Modal from "@/components/Modal";

export default function Characters() {

  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<Char[]>([]);
  const [name, setName] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [inspiration, setInspiration] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("characters").select("*").neq("name", "").order("name", { ascending: true });
      setCharacters(data ?? []);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const inspiration = searchParams.get("inspiration");
    if (inspiration) {
      setInspiration(inspiration);
      setOpen(true);
    }
  }, [searchParams]);

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    pronunciation: {
      label: "Pronunciation",
      value: pronunciation,
      setValue: setPronunciation
    },
    inspiration: {
      label: "Inspiration",
      value: inspiration,
      setValue: setInspiration
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("characters").upsert({ name: name.trim(), pronunciation: pronunciation.trim(), inspiration: inspiration.trim() });
    setName("");
    setPronunciation("");
    setInspiration("");
    setOpen(false);
  }

  return (
    <>
      <div className="mt-16 text-center">
        <h2>Dramatis Personae</h2>
        <p className="italic mt-4 font-semibold font-serif">"Heroes are not born; they are forged in the fires of tragedy and triumph."</p>
      </div>
      <div className="text-center">
        <button onClick={() => setOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Character</button>
      </div>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {characters.map(char => (
          <Character key={char.id} data={char} />
        ))}
      </article>
      <Modal
        heading="Add New Character"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
      />
    </>
  );
}