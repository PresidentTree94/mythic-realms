import { supabase } from "@/lib/supabaseClient";

export async function getKingdomById(id: number) {
  const { data, error } = await supabase.from("kingdoms").select("*, counterparts(*), deities(*)").eq("id", id).single();
  if (error) {
    console.error("Error fetching kingdom:", error);
    return null;
  }
  return data ?? null;
}

export async function getKingdoms() {
  const { data, error } = await supabase.from("kingdoms").select(`*, counterparts(*)`).order("name", { ascending: true });
  if (error) {
    console.error("Error fetching kingdoms:", error);
    return [];
  }
  return data ?? [];
}