"use client";
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import Grid from "../Grid";
import Character from "./Character";
import Modal from "../Modal";
import { CharacterType } from "@/types/characterType";
import { KingdomType } from "@/types/kingdomType";
import { TerritoryType } from "@/types/territoryType";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { MARKERS } from "@/utils/markers";

export default function Characters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const inspirationId = searchParams.get("inspiration");

  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [kingdoms, setKingdoms] = useState<KingdomType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [filteredTerritories, setFilteredTerritories] = useState<TerritoryType[]>([]);
  const [inspirations, setInspirations] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [territory, setTerritory] = useState("");
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
        const { data: kingdoms } = await supabase.from("kingdoms").select("*").order("name", { ascending: true });
        setKingdoms(kingdoms ?? []);
        const { data: territories } = await supabase.from("territories").select("*").order("name", { ascending: true });
        setTerritories(territories ?? []);
      }
      fetchData();
  }, []);

  useEffect(() => {
    if (kingdom) {
      const filteredTerritories = territories.filter(t => t.kingdom_id === kingdoms.find(k => k.name === kingdom)?.id);
      setFilteredTerritories(filteredTerritories);
    } else {
      setFilteredTerritories([]);
    }
  }, [kingdom]);

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    kingdom: {
      label: "Kingdom",
      value: kingdom,
      setValue: setKingdom,
      options: kingdoms.map(k => k.name),
      defaultOption: "Select Kingdom"
    },
    territory: {
      label: "Territory",
      value: territory,
      setValue: setTerritory,
      options: filteredTerritories.map(t => t.name),
      defaultOption: "Select Territory"
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
      options: Object.keys(MARKERS),
    }
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let inspirationId: number | null = null;
    let character_id: number | null = null;

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

    const { data: character } = await supabase.from("fantasy_characters").insert({
      name: name.trim(),
      markers: [],
      inspiration_id: inspirationId
    }).select().single();
    if (character) {
      character_id = character.id;
    }

    await supabase.from("terr_char").insert({
      kingdom_id: kingdoms.find(k => k.name === kingdom)?.id ?? null,
      territory_id: territories.find(t => t.name === territory)?.id ?? null,
      character_id: character_id
    });
    setName("");
    setKingdom("");
    setTerritory("");
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
        disabled={name.trim() === ""}
      />
    </Grid>
  );
}