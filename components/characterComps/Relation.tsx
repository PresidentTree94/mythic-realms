import { User } from "lucide-react";
import Link from "next/link";

export default function Relation({ data }: { data: { id: number, name: string; relation: string } }) {
  return (
    <Link href={`/characters/${data.id}`} className="card flex gap-4">
      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
        <User className="h-5 w-auto text-primary" />
      </div>
      <div>
        <h4>{data.name}</h4>
        <p className="text-secondary uppercase font-bold text-xs tracking-widest font-body">{data.relation}</p>
      </div>
    </Link>
  );
}