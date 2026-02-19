"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Character from "@/components/Character";
import { Char } from "@/types/char";

export default function Characters() {

  const [open, setOpen] = useState(false);
  const [characters, setCharacters] = useState<Char[]>([]);
  const [name, setName] = useState("");
  const [inspiration, setInspiration] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("characters").select("*").order("name", { ascending: true });
      setCharacters(data ?? []);
    }
    fetchData();
  }, []);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("characters").insert({ name: name.trim(), inspiration: inspiration.trim() });
    setName("");
    setInspiration("");
    setOpen(false);
  }

  return (
    <>
      <div className="mt-16 text-center">
        <h2>Dramatis Personae</h2>
        <p className="italic mt-4 font-semibold font-serif">"Heroes are not born; they are forged in the fires of tragedy and triumph."</p>
      </div>
      <div className="text-center">
        <button onClick={() => setOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Character</button>
      </div>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-0">
        {characters.map(char => (
          <Character key={char.id} data={char} />
        ))}
      </article>
      <div className={`fixed inset-0 bg-black/50 z-3 ${open ? "flex" : "hidden"} justify-center items-center`}>
        <div className="card m-8 max-w-sm">
          <h3 className="text-center">Add New Character</h3>
          <form className="grid grid-cols-[auto_1fr] gap-4 items-center mt-4 font-body" onSubmit={handleSubmit}>
            <label>Character Name:</label>
            <input type="text" className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Inspiration:</label>
            <input type="text" className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary" value={inspiration} onChange={(e) => setInspiration(e.target.value)} />
            <div className="col-span-2 grid grid-cols-2 gap-4 mt-6">
              <button type="submit" className="bg-primary text-background px-4 py-2 font-heading font-medium cursor-pointer">Submit</button>
              <button type="button" onClick={() => setOpen(false)} className="bg-secondary text-background px-4 py-2 font-heading font-medium cursor-pointer">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}