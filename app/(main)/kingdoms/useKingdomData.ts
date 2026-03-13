import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { KingdomType } from "@/types/kingdomType";
import { getKingdoms } from "@/lib/data/kingdomQueries";
import { useForm } from "@presidenttree94/form-utils";

export default function useKingdomData() {

  const [kingdoms, setKingdoms] = useState<KingdomType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const kingdomData = await getKingdoms();
      setKingdoms(kingdomData);
    }
    fetchData();
  }, []);

  const kingdomForm = useForm(
    {
      name: "",
      crest: "",
      government: "",
      greek: "",
      greekLocation: "",
      medieval: "",
      medievalLocation: ""
    },
    {
      name: { label: "Name", required: true },
      crest: { label: "Crest" },
      government: { label: "Government" },
      greek: { label: "Greek", required: true },
      greekLocation: { label: "Greek Location" },
      medieval: { label: "Medieval", required: true },
      medievalLocation: { label: "Medieval Location" }
    }
  );

  const handleSubmit = async () => {
    const { data: kingdom } = await supabase.from("kingdoms").insert({
      name: kingdomForm.form.name.trim(),
      crest: kingdomForm.form.crest.trim(),
      government: kingdomForm.form.government.trim()
    }).select().single();
    await supabase.from("counterparts").insert({
      name: kingdomForm.form.greek.trim(),
      type: "Greek",
      location: kingdomForm.form.greekLocation.trim(),
      kingdom_id: kingdom?.id ?? 0
    }).select().single();
    await supabase.from("counterparts").insert({
      name: kingdomForm.form.medieval.trim(),
      type: "Medieval",
      location: kingdomForm.form.medievalLocation.trim(),
      kingdom_id: kingdom?.id ?? 0
    }).select().single();
  }

  return { kingdoms, kingdomForm, handleSubmit };
}