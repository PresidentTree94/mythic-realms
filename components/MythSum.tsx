import { MythType } from "@/types/mythType";
import Link from "next/link";

export default function MythSum({ data }: { data: MythType }) {
  return (
    <Link href={`/myths/${data.id}`} className="card p-0 overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="p-6">
        <h4>{data.title}</h4>
        <p className="mt-2">{data.myth_insp[0].contribution}</p>
      </div>
    </Link>
  );
}