import { CharacterType } from "@/types/characterType";
import { PANTHEON_MARKERS } from "@/utils/markers";
import Link from "next/link";

export default function Character({ data }: { data: CharacterType }) {
  return (
    <Link href={`/characters/${data.id}`} className="relative rounded-xl overflow-hidden aspect-21/32 shadow group">
      <img src="/warrior.png" className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 scale-105 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-between p-6">
        <div className="w-full flex justify-end gap-1">
          {data.markers.map(marker => {
            const Icon = PANTHEON_MARKERS[marker];
            return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
          })}
        </div>
        <div>
          <h3 className="text-white text-2xl">{data.name}</h3>
          <p className="font-body text-secondary italic text-sm border-l-2 border-secondary pl-2">Inspired by {data.inspiration_id === null ?"???" : data.inspirations.name}</p>
        </div>
      </div>
    </Link>
  );
}