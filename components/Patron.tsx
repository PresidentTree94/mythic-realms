import { DeityType } from "@/types/deityType";
import { PANTHEON_MARKERS } from "@/utils/markers";
import { Sparkles } from "lucide-react";

export default function Patron({ data }:Readonly<{ data: DeityType }>) {

  const Icon = PANTHEON_MARKERS[data.patron];

  return (
    <div className="card flex flex-col items-center text-center font-body">
      <div className="bg-background/80 border border-border/50 rounded-full shadow-sm h-12 w-12 flex items-center justify-center">
        {Icon && <Icon className="h-6 w-auto text-secondary"/>}
      </div>
      <h3 className="mt-4 mb-2">{data.patron}</h3>
      <p className="font-serif italic">Patron of {data.representations}</p>
      <div className="flex items-center gap-2 text-secondary mt-4 mb-2">
        <Sparkles className="h-4 w-auto" />
        <span className="uppercase font-bold text-xs">Divine blessing</span>
      </div>
      <p className="bg-primary/5 border border-primary/10 p-3 rounded-lg text-sm">{data.blessing}: {data.description}.</p>
    </div>
  );
}