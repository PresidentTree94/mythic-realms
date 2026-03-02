import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function useNotes({ table, id, existingNotes }: Readonly<{table: string, id: number, existingNotes: string[] }>) {
  const [note, setNote] = useState("");

  const handleNoteSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      await supabase.from(table).update({ notes: [...existingNotes, note.trim()] }).eq("id", id);
      setNote("");
    }
  
  const handleNoteDelete = async (index: number) => {
    const updatedNotes = [...existingNotes];
    updatedNotes.splice(index, 1);
    await supabase.from(table).update({ notes: updatedNotes }).eq("id", id);
    window.location.reload();
  }

  return { note, setNote, handleNoteSubmit, handleNoteDelete };
}