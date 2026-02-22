"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Grid from "./Grid";
import Character from "./Character";
import Modal from "./Modal";
import { CharacterType } from "@/types/characterType";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Characters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const inspirationId = searchParams.get("inspiration");

  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [gender, setGender] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [newInspiration, setNewInspiration] = useState("");
  const [inspirationLocation, setInspirationLocation] = useState("");
  const [inspirationMarkers, setInspirationMarkers] = useState<string[]>([]);

  useEffect(() => {
    if (inspirationId) {
      const fetchData = async () => {
        const { data } = await supabase.from("inspirations").select("*").eq("id", inspirationId).single();
        if (data) {
          setInspiration(data.name);
          setInspirationLocation(data.location);
          setInspirationMarkers(data.markers);
        }
      }
      fetchData();
      setOpen(true);
    }
  }, [inspirationId]);

  useEffect(() => {
      const fetchData = async () => {
        const { data: characters } = await supabase.from("fantasy_characters").select("*, inspirations(name)").order("name", { ascending: true });
        setCharacters(characters ?? []);
        const { data: inspirations } = await supabase.from("inspirations").select("name").order("name", { ascending: true });
        setInspirations(inspirations?.map(i => i.name) ?? []);
      }
      fetchData();
  }, []);

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
    gender: {
      label: "Gender",
      value: gender,
      setValue: setGender,
      options: ["Male", "Female"],
      defaultOption: "Select Gender"
    },
    inspiration: {
      label: "Inspiration",
      value: inspiration,
      setValue: setInspiration,
      options: inspirations,
      defaultOption: "Select Inspiration"
    },
    newInspiration: {
      label: "New Inspiration",
      value: newInspiration,
      setValue: setNewInspiration
    },
    inspirationLocation: {
      label: "Inspiration Location",
      value: inspirationLocation,
      setValue: setInspirationLocation
    },
    inspirationMarkers: {
      label: "Inspiration Markers",
      value: inspirationMarkers,
      setValue: setInspirationMarkers,
      options: ["Deity", "Demigod", "Nymph", "Seer", "Prophet"],
    }
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let inspirationId: number | null = null;
    if (inspiration !== "" || newInspiration !== "") {
      const { data } = await supabase.from("inspirations").upsert({
        name: inspiration ? inspiration : newInspiration.trim(),
        location: inspirationLocation.trim(),
        markers: inspirationMarkers
      }, { onConflict: "name"}).select().single();
      if (data) {
        inspirationId = data.id;
      }
    }
    await supabase.from("fantasy_characters").insert({
      name: name.trim(),
      pronunciation: pronunciation.trim(),
      gender: gender,
      markers: [],
      inspiration_id: inspirationId
    });
    setName("");
    setPronunciation("");
    setGender("");
    setInspiration("");
    setNewInspiration("");
    setInspirationLocation("");
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
      data={characters}
      dataComponent={Character}>
      <Modal
        heading="Add Character"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={name.trim() === "" || gender === ""}
      />
    </Grid>
  );
}