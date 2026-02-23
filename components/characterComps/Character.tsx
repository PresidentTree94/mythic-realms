import { CharacterType } from "@/types/characterType";

export default function Character({ data }: { data: CharacterType }) {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-21/32 shadow group">
      <img src="/warrior.png" className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 scale-105 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-white">{data.name}</h3>
        <p className="font-body text-secondary italic text-sm border-l-2 border-secondary pl-2">Inspired by {data.inspiration_id === null ?"???" : data.inspirations.name}</p>
      </div>
    </div>
  );
}