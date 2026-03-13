import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { CharacterType } from "@/types/characterType";
import { TerritoryType } from "@/types/territoryType";
import { MythType } from "@/types/mythType";
import { getCharacters } from "@/lib/data/characterQueries";
import { getTerritories } from "@/lib/data/territoryQueries";
import { getMythsByInspiration } from "@/lib/data/mythQueries";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";
import useRelationList from "@/hooks/useRelationList";
import { useForm } from "@presidenttree94/form-utils";

export default function useCharacterData(slug: number) {
  
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterType>();
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [myths, setMyths] = useState<MythType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const characterData = await getCharacters();
      const territoryData = await getTerritories();
      setCharacters(characterData);
      setCharacter(characterData.find(c => c.id === Number(slug)));
      setTerritories(territoryData);
    }
    fetchData();
  }, [slug]);
  
  useEffect(() => {
    const fetchData = async () => {
      const mythData = await getMythsByInspiration(character?.inspiration_id);
      setMyths(mythData);
    }
    fetchData();
  }, [character]);

  /*---CHARACTER FORM---*/
  const characterForm = useForm(
    {
      name: character?.name ?? "",
      pronunciation: character?.pronunciation ?? "",
      meaning: character?.meaning ?? "",
      gender: character?.gender ?? "",
      status: character?.status ?? "",
      markers: character?.markers ?? [],
      homeland: territories.find(t => t.id === character?.homeland_id)?.name ?? "",
      residence: territories.find(t => t.id === character?.residence_id)?.name ?? "",
      father: character?.father ?? "",
      mother: character?.mother ?? ""
    },
    {
      name: { label: "Name", required: true },
      pronunciation: { label: "Pronunciation" },
      meaning: { label: "Meaning" },
      gender: {
        label: "Gender",
        options: ["Male", "Female"],
        defaultOption: "Select Gender",
        required: true
      },
      markers: {
        label: "Markers",
        options: Object.keys(PANTHEON_MARKERS),
        multi: true
      },
      homeland: {
        label: "Homeland",
        options: ["", ...territories.map(t => t.name)],
      },
      residence: {
        label: "Residence",
        options: ["", ...territories.map(t => t.name)],
      },
      status: {
        label: "Status",
        options: character?.gender === "Male" ? ["King", "Prince", "Citizen"] : ["Queen", "Princess", "Citizen"],
        defaultOption: "Select Status",
        required: true
      },
      father: { label: "Father" },
      mother: { label: "Mother" }
    }
  );

  const handleCharacterSubmit = async () => {
    await supabase.from("fantasy_characters").update({
      name: characterForm.form.name.trim(),
      pronunciation: characterForm.form.pronunciation.trim(),
      meaning: characterForm.form.meaning.trim(),
      gender: characterForm.form.gender,
      status: characterForm.form.status,
      markers: characterForm.form.markers,
      homeland_id: territories.find(t => t.name === characterForm.form.homeland)?.id,
      residence_id: territories.find(t => t.name === characterForm.form.residence)?.id,
      father: characterForm.form.father.trim(),
      mother: characterForm.form.mother.trim()
    }).eq("id", character?.id);
  }
    
  const handleCharacterDelete = async () => {
    await supabase.from("relationships").delete().or(`first_character.eq.${character?.id},second_character.eq.${character?.id}`);
    await supabase.from("fantasy_characters").delete().eq("id", character?.id);
    router.replace("/characters");
  }

  /*---RELATION FORM---*/
  const relationList = useRelationList(character, characterForm.form);

  const relationForm = useForm(
    {
      relationName: "",
      relationType: ""
    },
    {
      relationName: {
        label: "Name",
        options: characters.filter(c => c.id !== Number(slug)).filter(c => !relationList.some(r => r.id === c.id)).map(c => c.name),
        defaultOption: "Select Character",
        required: true
      },
      relationType: {
        label: "Type",
        options: ["Spouse", "Lover"],
        defaultOption: "Select Type",
        required: true
      }
    }
  );

  const handleRelationSubmit = async () => {
    await supabase.from("relationships").insert({
      first_character: character?.id,
      second_character: characters.find(c => c.name === relationForm.form.relationName)?.id,
      type: relationForm.form.relationType
    });
  }

  /*---INSPIRATION FORM---*/
  const inspirationForm = useForm(
    {
      name: character?.inspirations.name ?? "",
      meaning: character?.inspirations.meaning ?? "",
      tagline: character?.inspirations.tagline ?? "",
      location: character?.inspirations.location ?? "",
      markers: character?.inspirations.markers ?? []
    },
    {
      name: { label: "Name", required: true },
      meaning: { label: "Meaning" },
      tagline: { label: "Tagline" },
      location: { label: "Location" },
      markers: {
        label: "Markers",
        options: Object.keys(INSPIRATION_MARKERS),
        multi: true
      }
    }
  );

  const handleInspirationSubmit = async () => {
    await supabase.from("inspirations").update({
      name: inspirationForm.form.name.trim(),
      meaning: inspirationForm.form.meaning.trim(),
      tagline: inspirationForm.form.tagline.trim(),
      location: inspirationForm.form.location,
      markers: inspirationForm.form.markers
    }).eq("id", character?.inspiration_id);
  }

  return { character, territories, myths, characterForm, handleCharacterSubmit, handleCharacterDelete, relationForm, relationList, handleRelationSubmit, inspirationForm, handleInspirationSubmit };
}