import { supabase } from "@/lib/supabaseClient";

export async function getTerritories() {
  const { data, error } = await supabase.from("territories").select("*, kingdoms(name)").order("name", { ascending: true });
  if (error) {
    console.error("Error fetching territories:", error);
    return [];
  }
  return data ?? [];
}

export async function getTerritoriesByKingdom(kingdomId: number) {
  const { data, error } = await supabase.from("territories").select("*").eq("kingdom_id", kingdomId).order("name", { ascending: true });
  if (error) {
    console.error("Error fetching territories by kingdom:", error);
    return [];
  }
  return data ?? [];
}