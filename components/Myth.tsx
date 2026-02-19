import { My } from "@/types/my";
import { Char } from "@/types/char";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Myth({ data }: { data: My }) {

  const [characters, setCharacters] = useState<Char[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data: chars } = await supabase.from("myth_chars").select("*").eq("myth_id", data.id);
      const charIds = chars?.map(c => c.char_id) ?? [];
      const { data: characters } = await supabase.from("characters").select("*").in("id", charIds);
      setCharacters(characters ?? []);
    }
    fetchData();
  }, [data.id]);

  return (
    <Link href={`/myths/${data.id}`} className="card p-0 overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="p-6">
        <h3>{data.title}</h3>
        <p className="font-serif mt-2">{data.summary}.</p>
        <div className="border-t border-border/50 pt-4 mt-4 font-body">
          <p className="text-xs font-bold uppercase tracking-widest">Key Figures</p>
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            {characters.map(c => (
              c.name ? <Link key={c.id} href={`/characters`} className="px-2 py-1 bg-secondary/20 rounded">{c.name}</Link> : <Link key={c.id} href={`/characters?inspiration=${c.inspiration}`} className="px-2 py-1 bg-primary/20 rounded">{c.inspiration}</Link>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}