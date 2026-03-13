import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { File, Trash, Send } from "lucide-react";
import { CharacterType } from "@/types/characterType";
import { KingdomType } from "@/types/kingdomType";

function useNotes({ table, id, existingNotes }: Readonly<{table: string, id: number, existingNotes: string[] }>) {
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

export default function Notes({
  table, id, data
}:Readonly<{
  table: string;
  id: number;
  data: CharacterType | KingdomType | undefined;
}>) {

  const { note, setNote, handleNoteSubmit, handleNoteDelete } = useNotes({
    table,
    id,
    existingNotes: data?.notes ?? []
  });

  return (
    <section className="font-body">
      <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><File className="h-8 w-auto" />Notes</h3>
      <form className="flex items-center gap-2 my-8" onSubmit={handleNoteSubmit}>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="flex-1 card px-4 py-2 outline-none focus:border-secondary" />
        <button className="bg-primary flex justify-center items-center h-10 w-10 cursor-pointer"><Send className="h-4 w-auto text-background" /></button>
      </form>
      <div className="space-y-4">
        {data?.notes.map((note: string, index: number) => (
          <p key={index} className="card p-4 flex items-center justify-between gap-2">{note}<Trash className="h-4 w-auto shrink-0 cursor-pointer" onClick={() => handleNoteDelete(index)}/></p>
        ))}
      </div>
    </section>
  );
}