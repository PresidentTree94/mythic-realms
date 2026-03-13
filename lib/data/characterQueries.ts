import { supabase } from "@/lib/supabaseClient";

export async function getCharacters() {
  const { data, error } = await supabase.from("fantasy_characters").select("*, inspirations(*)").order("name", { ascending: true });
  if (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
  return data ?? [];
}

export async function getCharactersByKingdom(territoryIds: number[]) {
  const { data, error } = await supabase.from("fantasy_characters").select("*").or(`homeland_id.in.(${territoryIds}),residence_id.in.(${territoryIds})`).order("name", { ascending: true });
  if (error) {
    console.error("Error fetching characters by kingdom:", error);
    return [];
  }
  return data ?? [];
}