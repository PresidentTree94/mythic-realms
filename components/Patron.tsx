import { BookMarked, BowArrow, Flame, Sun, Hourglass, Compass, Moon, Scale, Wheat } from "lucide-react";

export default function Patron() {
  return (
    <div className="card flex flex-col items-center text-center">
      <BookMarked className="h-12 w-auto text-secondary mb-2"/>
      <h3>Patron Name</h3>
      <p className="text-xs font-serif italic mb-2">Patron of Kingdom</p>
      <p className="font-serif">Blank, Blank, Blank, Blank</p>
    </div>
  );
}