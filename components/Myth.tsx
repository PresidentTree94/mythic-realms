import { MythType } from "@/types/mythType";
import Link from "next/link";

export default function Myth({ data }: { data: MythType }) {
  return (
    <Link href={`/myths/${data.id}`} className="card p-0 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="p-6">
        <h3>{data.title}</h3>
        <p className="font-serif mt-2 line-clamp-3">{data.summary}</p>
        <div className="border-t border-border/50 pt-4 mt-4 font-body">
          <p className="text-xs font-bold uppercase tracking-widest">Key Figures</p>
          <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
            {data.myth_insp.map(c => (
              <Link key={c.inspirations.id} href={`/characters`} className="px-2 py-1 bg-secondary/20 rounded">{c.inspirations.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}