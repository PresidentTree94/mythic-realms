import { KingdomType } from "@/types/kingdomType";
import Link from "next/link";

export default function Kingdom({ data }: { data: KingdomType }) {

  const greek = data.counterparts.find(c => c.type === "Greek");
  const medieval = data.counterparts.find(c => c.type === "Medieval");

  return (
    <Link href={`/kingdoms/${data.id}`} className="card space-y-4">
      <h2 className="text-center text-3xl">{data.name}</h2>
      <div className="grid grid-cols-[1fr_3rem_1fr] items-center gap-4 font-serif text-xs uppercase tracking-widest">
        <span className="text-right">Legacy</span>
        <span className="w-12 h-[1px] bg-border"></span>
        <span>Successor</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="text-center md:text-right space-y-4">
          <h4>{greek?.name}</h4>
          <p className="font-body italic text-sm">Founded by {greek?.founder}.</p>
          <p className="font-body italic text-sm">Located in {greek?.location}.</p>
        </div>
        <div className="text-center md:text-left space-y-4">
          <h4>{medieval?.name}</h4>
          <p className="font-body italic text-sm">Founded by {medieval?.founder}.</p>
          <p className="font-body italic text-sm">Located in {medieval?.location}.</p>
        </div>
      </div>
    </Link>
  );
}