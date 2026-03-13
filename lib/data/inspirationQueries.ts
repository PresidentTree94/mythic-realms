import { supabase } from "@/lib/supabaseClient";

export async function getInspirations() {
  const { data, error } = await supabase.from("inspirations").select("*").order("name", { ascending: true });
  if (error) {
    console.error("Error fetching inspirations:", error);
    return [];
  }
  return data ?? [];
}