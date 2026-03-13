import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { CharacterType } from "@/types/characterType";
import { InspirationType } from "@/types/inspirationType";
import { TerritoryType } from "@/types/territoryType";
import { getCharacters } from "@/lib/data/characterQueries";
import { getInspirations } from "@/lib/data/inspirationQueries";
import { getTerritories } from "@/lib/data/territoryQueries";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";
import { useForm } from "@presidenttree94/form-utils";

export default function useCharacterForms() {

  const router = useRouter();
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const characterData = await getCharacters();
      const inspirationData = await getInspirations();
      const territoryData = await getTerritories();
      setCharacters(characterData);
      setInspirations(inspirationData);
      setTerritories(territoryData);
    }
    fetchData();
  }, []);

  /*---CHARACTER FORM---*/
  const characterForm = useForm(
    {
      name: "",
      markers: [] as string[],
      inspiration: "",
      newInspiration: "",
      inspirationLocation: "",
      inspirationMarkers: [] as string[]
    },
    {
      name: {
        label: "Name",
        required: true
      },
      markers: {
        label: "Markers",
        options: Object.keys(PANTHEON_MARKERS),
        multi: true
      },
      inspiration: {
        label: "Inspiration",
        options: ["", ...inspirations.map(i => i.name)],
      },
      newInspiration: { label: "New Inspiration" },
      inspirationLocation: { label: "Inspiration Location" },
      inspirationMarkers: {
        label: "Inspiration Markers",
        options: Object.keys(INSPIRATION_MARKERS),
        multi: true
      }
    }
  );

  const handleSubmit = async () => {
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
    });
    router.replace("/characters");
  }

  /*---FILTER FORM---*/
  const filterForm = useForm(
    {
      kingdom: "All",
      homeland: "All",
      residence: "All"
    },
    {
      kingdom: {
        label: "Kingdom",
        options: ["All", ...[...new Set(territories.map(t => t.kingdoms.name))].sort()]
      },
      homeland: {
        label: "Homeland",
        options: ["All", ...[...new Set(territories.map(t => t.name))]]
      },
      residence: {
        label: "Residence",
        options: ["All", ...[...new Set(territories.map(t => t.name))]]
      }
    }
  );

  return { characters, inspirations, territories, characterForm, handleSubmit, filterForm };
}