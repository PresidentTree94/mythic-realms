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

export default function Characters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const inspirationId = searchParams.get("inspiration");
  const [open, setOpen] = useState(false);

  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);

  const [form, setForm] = useState({
    name: "",
    markers: [] as string[],
    inspiration: "",
    newInspiration: "",
    inspirationLocation: "",
    inspirationMarkers: [] as string[]
  });
  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

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
        updateForm("inspiration", data.name);
        updateForm("inspirationLocation", data.location);
        updateForm("inspirationMarkers", data.markers);
      }
      setOpen(true);
    }
  }, [inspirationId, inspirations]);

  const elements: Record<string, any> = {};
  elements.name = {
    label: "Name",
    value: form.name,
    setValue: (value: string) => updateForm("name", value)
  };
  elements.markers = {
    label: "Markers",
    value: form.markers,
    setValue: (value: string[]) => updateForm("markers", value),
    options: Object.keys(PANTHEON_MARKERS),
  };
  elements.inspiration = {
    label: "Inspiration",
    value: form.inspiration,
    setValue: (value: string) => updateForm("inspiration", value),
    options: inspirations.map(i => i.name),
    defaultOption: "Select Inspiration"
  };
  if (!inspirationId) {
    elements.newInspiration = {
      label: "New Inspiration",
      value: form.newInspiration,
      setValue: (value: string) => updateForm("newInspiration", value)
    }
  }
  elements.inspirationLocation = {
    label: "Inspiration Location",
    value: form.inspirationLocation,
    setValue: (value: string) => updateForm("inspirationLocation", value)
  };
  elements.inspirationMarkers = {
    label: "Inspiration Markers",
    value: form.inspirationMarkers,
    setValue: (value: string[]) => updateForm("inspirationMarkers", value),
    options: Object.keys(INSPIRATION_MARKERS),
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let inspirationId: number | null = null;
    if (form.inspiration !== "" || form.newInspiration !== "") {
      const { data } = await supabase.from("inspirations").upsert({
        name: form.inspiration ? form.inspiration : form.newInspiration.trim(),
        location: form.inspirationLocation.trim(),
        markers: form.inspirationMarkers
      }, { onConflict: "name"}).select().single();
      if (data) {
        inspirationId = data.id;
      }
    }
    await supabase.from("fantasy_characters").insert({
      name: form.name.trim(),
      markers: form.markers,
      inspiration_id: inspirationId
    })
    updateForm("name", "");
    updateForm("markers", []);
    updateForm("inspiration", "");
    updateForm("newInspiration", "");
    updateForm("inspirationLocation", "");
    updateForm("inspirationMarkers", []);
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
        disabled={form.name.trim() === ""}
      />
    </Grid>
  );
}