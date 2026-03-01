import { CharacterType } from "@/types/characterType";
import { TerritoryType } from "@/types/territoryType";
import { PANTHEON_MARKERS } from "@/utils/markers";
import Link from "next/link";

export default function Character({ data }: { data: { character: CharacterType, homeland: TerritoryType, residence: TerritoryType } }) {
  return (
    <Link href={`/characters/${data.character.id}`} className="relative rounded-xl overflow-hidden aspect-21/32 shadow group">
      <img src="/warrior.png" className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 scale-105 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-between p-6">
        <div className="w-full flex justify-end gap-1">
          {data.character.markers.map(marker => {
            const Icon = PANTHEON_MARKERS[marker];
            return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
          })}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap font-semibold font-body text-xs uppercase tracking-tighter mb-2">
            {data.homeland && <span className="bg-background/80 text-primary px-2 py-1 backdrop-blur-sm">{data.homeland.name}, {data.homeland.kingdoms.name}</span>}
            {data.residence && <span className="bg-secondary/80 text-[hsl(25,30%,15%)] px-2 py-1 backdrop-blur-sm">{data.residence.name}, {data.residence.kingdoms.name}</span>}
          </div>
          <h3 className="text-white text-2xl">{data.character.name}</h3>
          <p className="font-body text-secondary italic text-sm border-l-2 border-secondary pl-2">Inspired by {data.character.inspiration_id === null ?"???" : data.character.inspirations.name}</p>
        </div>
      </div>
    </Link>
  );
}