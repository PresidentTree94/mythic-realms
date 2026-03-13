import { supabase } from "@/lib/supabaseClient";

export async function getDeities() {
  const { data, error } = await supabase.from("deities").select("*").order("patron", { ascending: true });
  if (error) {
    console.error("Error fetching deities:", error);
    return [];
  }
  return data ?? [];
}