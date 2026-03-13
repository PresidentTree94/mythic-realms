import { supabase } from "@/lib/supabaseClient";

export async function getMythsByInspiration(inspirationId: number | undefined) {
  const { data, error } = await supabase.from("myths").select("*, myth_insp!inner(*, inspirations (*))").eq("myth_insp.inspiration_id", inspirationId).order("title", { ascending: true });
  if (error) {
    console.error("Error fetching myths:", error);
    return [];
  }
  return data ?? [];
}

export async function getMythById(id: number) {
  const { data, error } = await supabase.from("myths").select("*, myth_insp(*, inspirations (*))").eq("id", id).single();
  if (error) {
    console.error("Error fetching myth:", error);
    return null;
  }
  return data ?? null;
}

export async function getMyths() {
  const { data, error } = await supabase.from("myths").select("*, myth_insp(*, inspirations (*))").order("title", { ascending: true });
  if (error) {
    console.error("Error fetching myths:", error);
    return [];
  }
  return data ?? [];
}