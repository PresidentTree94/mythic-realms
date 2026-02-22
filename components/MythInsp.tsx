import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star, Sparkle, Droplet, Eye, ChessBishop, LucideIcon } from "lucide-react";
import { MythType } from "@/types/mythType";
import Modal from "./Modal";

const MARKERS: Record<string, LucideIcon> = {
  "Deity": Star,
  "Demigod": Sparkle,
  "Nymph": Droplet,
  "Seer": Eye,
  "Prophet": ChessBishop
}

export default function MythInsp({ data }: { data: MythType["myth_insp"][0] }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.inspirations.name);
  const [markers, setMarkers] = useState(data.inspirations.markers);
  const [contribution, setContribution] = useState(data.contribution);

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    markers: {
      label: "Markers",
      value: markers,
      setValue: setMarkers,
      options: Object.keys(MARKERS)
    },
    contribution: {
      label: "Contribution",
      value: contribution,
      setValue: setContribution
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("inspirations").update({ name: name.trim(), markers: markers }).eq("id", data.inspirations.id);
    await supabase.from("myth_insp").update({ contribution: contribution.trim() }).eq("myth_id", data.myth_id).eq("inspiration_id", data.inspirations.id);
    setName(name.trim());
    setMarkers(markers);
    setContribution(contribution.trim());
    setOpen(false);
  }

  return (
    <>
      <div className="card p-0 overflow-hidden flex flex-col">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3>{data.inspirations.name}</h3>
              <div className="flex gap-1">
                {data.inspirations.markers.map(marker => {
                  const Icon = marker !== "" ? MARKERS[marker] : null;
                  return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
                })}
              </div>
            </div>
            <p className="font-serif">{data.contribution}</p>
          </div>
          <button onClick={() => setOpen(true)} className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full">Edit</button>
        </div>
      </div>
      <Modal
        heading="Edit Contribution"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={true}
      />
    </>
  );
}