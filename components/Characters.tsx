"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Character from "@/components/Character";
import { Char } from "@/types/char";
import Modal from "@/components/Modal";
import Grid from "./Grid";
import { useRouter } from "next/navigation";

export default function Characters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<Char[]>([]);
  const [name, setName] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [newInspiration, setNewInspiration] = useState("");
  const [inspirationMarkers, setInspirationMarkers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("characters").select("*");
      setCharacters(data ?? []);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const inspiration = searchParams.get("inspiration");
    if (inspiration) {
      setInspiration(inspiration);
      const fetchData = async () => {
        const { data } = await supabase.from("characters").select("inspiration_markers").eq("inspiration", inspiration).single();
        setInspirationMarkers(data?.inspiration_markers);
      };
      fetchData();
      setOpen(true);
    }
  }, [searchParams]);

  const namedCharacters = characters.filter(char => char.name !== "").sort((a, b) => a.name.localeCompare(b.name));
  const unnamedCharacters = characters.filter(char => char.name === "").map(c => c.inspiration).sort((a, b) => a.localeCompare(b));

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
      setValue: setInspiration,
      options: unnamedCharacters,
      defaultOption: "Select Inspiration",
      isMulti: false
    },
    newInspiration: {
      label: "New Inspiration",
      value: newInspiration,
      setValue: setNewInspiration
    },
    inspirationMarkers: {
      label: "Inspiration Markers",
      value: inspirationMarkers,
      setValue: setInspirationMarkers,
      options: ["Deity", "Demigod", "Nymph", "Seer", "Prophet"],
      defaultOption: "Select Markers",
      isMulti: true
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("characters").upsert({
      name: name.trim(),
      pronunciation: pronunciation.trim(),
      inspiration: inspiration.trim() === "" ? newInspiration.trim() : inspiration.trim(),
      inspiration_markers: inspirationMarkers.filter(marker => marker !== "")
    }, { onConflict: "inspiration" });
    setName("");
    setPronunciation("");
    setInspiration("");
    setNewInspiration("");
    setInspirationMarkers([]);
    setOpen(false);
    router.replace("/characters");
  }

  return (
    <Grid
      title="Dramatis Personae"
      quote="Heroes are not born; they are forged in the fires of tragedy and triumph."
      button={{ label: "Add Character", onClick: () => setOpen(true) }}
      gridStyle="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      data={namedCharacters}
      dataComponent={Character}>
      <Modal
        heading="Add New Character"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={inspiration.trim() === "" && newInspiration.trim() === ""}
      />
    </Grid>
  );
}

/*
<>
  <div className="mt-16 text-center">
    <h2>Dramatis Personae</h2>
    <p className="italic mt-4 font-semibold font-serif">"Heroes are not born; they are forged in the fires of tragedy and triumph."</p>
  </div>
  <div className="text-center">
    <button onClick={() => setOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Character</button>
  </div>
  <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {namedCharacters.map(char => (
      <Character key={char.id} data={char} />
    ))}
  </article>
  <Modal
    heading="Add New Character"
    open={open}
    setOpen={setOpen}
    elements={elements}
    handleSubmit={handleSubmit}
    disabled={inspiration.trim() === "" && newInspiration.trim() === ""}
  />
</>
*/