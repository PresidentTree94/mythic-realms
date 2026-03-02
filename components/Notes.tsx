import { File, Trash, Send } from "lucide-react";
import { CharacterType } from "@/types/characterType";
import { KingdomType } from "@/types/kingdomType";

export default function Notes({
  data, note, setNote, handleSubmit, handleDelete
}:Readonly<{
  data: CharacterType | KingdomType | undefined;
  note: string;
  setNote: (note: string) => void;
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  handleDelete: (index: number) => void;
}>) {
  return (
    <section className="font-body">
      <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><File className="h-8 w-auto" />Notes</h3>
      <form className="flex items-center gap-2 my-8" onSubmit={handleSubmit}>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="flex-1 card px-4 py-2 outline-none focus:border-secondary" />
        <button className="bg-primary flex justify-center items-center h-10 w-10 cursor-pointer"><Send className="h-4 w-auto text-background" /></button>
      </form>
      <div className="space-y-4">
        {data?.notes.map((note: string, index: number) => (
          <p key={index} className="card p-4 flex items-center justify-between gap-2">{note}<Trash className="h-4 w-auto shrink-0 cursor-pointer" onClick={() => handleDelete(index)}/></p>
        ))}
      </div>
    </section>
  );
}