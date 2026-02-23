import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MythType } from "@/types/mythType";
import Link from "next/link";
import { CharacterType } from "@/types/characterType";

export default function Myth({ data }: { data: MythType }) {

  const keyFigures = data.myth_insp.map(i => i.inspiration_id);
  const [characters, setCharacters] = useState<CharacterType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: characters } = await supabase.from("fantasy_characters").select("*").in("inspiration_id", keyFigures);
      setCharacters(characters ?? []);
    }
    fetchData();
  }, []);

  return (
    <Link href={`/myths/${data.id}`} className="card p-0 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="p-6">
        <h4>{data.title}</h4>
        <p className="font-serif mt-2 line-clamp-3">{data.summary}</p>
        <div className="border-t border-border/50 pt-4 mt-4 font-body">
          <p className="text-xs font-bold uppercase tracking-widest">Key Figures ({data.myth_insp.length})</p>
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            {data.myth_insp.map(c => (
              characters.some(i => i.inspiration_id === c.inspirations.id) ? <Link key={c.inspirations.id} href={`/characters`} className="px-2 py-1 bg-secondary/20 rounded">{c.inspirations.name}</Link> : <Link href={`characters?inspiration=${c.inspirations.id}`} key={c.inspirations.id} className="px-2 py-1 bg-primary/20 rounded">{c.inspirations.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}