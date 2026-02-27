"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Grid from "../Grid";
import Character from "./Character";
import Modal from "../Modal";
import { CharacterType } from "@/types/characterType";
import { InspirationType } from "@/types/inspirationType";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Characters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const inspirationId = searchParams.get("inspiration");
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);

  const characterForm = useFormState({
    name: "",
    markers: [] as string[],
    inspiration: "",
    newInspiration: "",
    inspirationLocation: "",
    inspirationMarkers: [] as string[]
  });

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: characters }, { data: inspirations }] = await Promise.all([
        supabase.from("fantasy_characters").select("*, inspirations(name)").order("name", { ascending: true }),
        supabase.from("inspirations").select("*").order("name", { ascending: true })
      ]);
      setCharacters(characters ?? []);
      setInspirations(inspirations ?? []);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (inspirationId && inspirations.length > 0) {
      const data = inspirations.find(i => i.id === Number(inspirationId)); 
      if (data) {
        characterForm.setForm({
          name: "",
          markers: [],
          inspiration: data.name,
          newInspiration: "",
          inspirationLocation: data.location,
          inspirationMarkers: data.markers
        });
      }
      setOpenModal("character");
    }
  }, [inspirationId, inspirations]);

  const elements = buildFormElements(characterForm.form, characterForm.update, {
    name: { label: "Name" },
    markers: {
      label: "Markers",
      options: Object.keys(PANTHEON_MARKERS)
    },
    inspiration: {
      label: "Inspiration",
      options: inspirations.map(i => i.name),
      defaultOption: "Select Inspiration"
    },
    newInspiration: { label: "New Inspiration" },
    inspirationLocation: { label: "Inspiration Location" },
    inspirationMarkers: {
      label: "Inspiration Markers",
      options: Object.keys(INSPIRATION_MARKERS)
    }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let inspirationId: number | null = null;
    if (characterForm.form.inspiration !== "" || characterForm.form.newInspiration !== "") {
      const { data } = await supabase.from("inspirations").upsert({
        name: characterForm.form.inspiration ? characterForm.form.inspiration : characterForm.form.newInspiration.trim(),
        location: characterForm.form.inspirationLocation.trim(),
        markers: characterForm.form.inspirationMarkers
      }, { onConflict: "name"}).select().single();
      if (data) {
        inspirationId = data.id;
      }
    }
    await supabase.from("fantasy_characters").insert({
      name: characterForm.form.name.trim(),
      markers: characterForm.form.markers,
      inspiration_id: inspirationId
    })
    characterForm.reset();
    setOpenModal(null);
    router.replace("/characters");
  }

  return (
    <Grid
      title="Dramatis Personae"
      quote="Heroes are not born; they are forged in the fires of tragedy and triumph."
      button={{ label: "Add Character", onClick: () => setOpenModal("character") }}
      gridStyle="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      data={characters}
      dataComponent={Character}>
      <Modal
        heading="Add Character"
        open={openModal === "character"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={characterForm.form.name.trim() === ""}
      />
    </Grid>
  );
}