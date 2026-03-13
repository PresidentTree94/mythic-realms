import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { KingdomType } from "@/types/kingdomType";
import { TerritoryType } from "@/types/territoryType";
import { CharacterType } from "@/types/characterType";
import { DeityType } from "@/types/deityType";
import { getKingdomById } from "@/lib/data/kingdomQueries";
import { getTerritoriesByKingdom } from "@/lib/data/territoryQueries";
import { getCharactersByKingdom } from "@/lib/data/characterQueries";
import { getDeities } from "@/lib/data/deityQueries";
import { useForm } from "@presidenttree94/form-utils";

export default function useKingdomData(slug: number) {

  const router = useRouter();
  const [kingdom, setKingdom] = useState<KingdomType>();
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [deities, setDeities] = useState<DeityType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const kingdomData = await getKingdomById(slug);
      const territoryData = await getTerritoriesByKingdom(slug);
      const characterData = await getCharactersByKingdom(territoryData.map(t => t.id));
      const deityData = await getDeities();
      setKingdom(kingdomData);
      setTerritories(territoryData);
      setCharacters(characterData);
      setDeities(deityData);
    }
    fetchData();
  }, [slug]);

  /*---KINGDOM FORM---*/
  const kingdomForm = useForm(
    {
      name: kingdom?.name ?? "",
      crest: kingdom?.crest ?? "",
      government: kingdom?.government ?? "",
      deity: kingdom?.deities?.patron ?? "",
    },
    {
      name: { label: "Name", required: true },
      crest: { label: "Crest" },
      government: { label: "Government" },
      deity: {
        label: "Deity",
        options: ["", ...deities.map(d => d.patron)],
      }
    }
  );

  const handleKingdomSubmit = async () => {
    await supabase.from("kingdoms").update({
      name: kingdomForm.form.name.trim(),
      crest: kingdomForm.form.crest.trim(),
      government: kingdomForm.form.government.trim(),
      deity_id: deities.find(d => d.patron === kingdomForm.form.deity)?.id ?? null
    }).eq("id", slug);
  }
    
  const handleKingdomDelete = async () => {
    const territoryIds = territories.map(t => t.id);
    await supabase.from("fantasy_characters").update({ homeland_id: null }).in("homeland_id", territoryIds);
    await supabase.from("fantasy_characters").update({ residence_id: null }).in("residence_id", territoryIds);
    await supabase.from("territories").delete().eq("kingdom_id", slug);
    await supabase.from("counterparts").delete().eq("kingdom_id", slug);
    await supabase.from("kingdoms").delete().eq("id", slug);
    router.replace("/kingdoms");
  }

  /*---TERRITORY FORM---*/
  const territoryForm = useForm(
    {
      name: "",
      counterpart: ""
    },
    {
      name: { label: "Name", required: true },
      counterpart: { label: "Counterpart", required: true }
    }
  );

  const handleTerritorySubmit = async () => {
    await supabase.from("territories").insert({
      name: territoryForm.form.name.trim(),
      counterpart: territoryForm.form.counterpart.trim(),
      kingdom_id: slug
    });
  }

  return {
    kingdom,
    territories,
    characters,
    deities,
    kingdomForm,
    handleKingdomSubmit,
    handleKingdomDelete,
    territoryForm,
    handleTerritorySubmit
  };
}