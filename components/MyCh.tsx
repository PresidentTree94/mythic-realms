"use client";
import { useState, useEffect } from "react";
import { Star, Sparkle, Droplet, Eye, ChessBishop, LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { MyChar } from "../types/myChar";
import Modal from "./Modal";

const MARKERS: Record<string, LucideIcon> = {
  "Deity": Star,
  "Demigod": Sparkle,
  "Nymph": Droplet,
  "Seer": Eye,
  "Prophet": ChessBishop
}

export default function MyCh({ data }: { data: MyChar }) {

  const [open, setOpen] = useState(false);
  const [inspiration, setInspiration] = useState("");
  const [contribution, setContribution] = useState(data.contribution);
  const [inspirationMarkers, setInspirationMarkers] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data: character } = await supabase.from("characters").select("*").eq("id", data.character_id).single();
      setInspiration(character?.inspiration ?? "");
      setInspirationMarkers(character?.inspiration_markers ?? []);
    }
    fetchData();
  }, [data.character_id]);

  const elements = {
    inspiration: {
      label: "Inspiration",
      value: inspiration,
      setValue: setInspiration
    },
    inspirationMarkers: {
      label: "Inspiration Markers",
      value: inspirationMarkers,
      setValue: setInspirationMarkers,
      options: ["Deity", "Demigod", "Nymph", "Seer", "Prophet"],
      defaultOption: "Select Markers",
      isMulti: true
    },
    contribution: {
      label: "Contribution",
      value: contribution,
      setValue: setContribution
    }
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("characters").update({
      inspiration: inspiration.trim(),
      inspiration_markers: inspirationMarkers.filter(marker => marker !== "")
    }).eq("id", data.character_id);
    await supabase.from("myth_chars").update({ contribution: contribution.trim() }).eq("myth_id", data.myth_id).eq("character_id", data.character_id);
    setInspiration("");
    setInspirationMarkers([]);
    setContribution("");
    setOpen(false);
  }

  return (
    <>
      <div className="card p-0 overflow-hidden flex flex-col">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3>{inspiration}</h3>
              <div className="flex gap-1">
                {inspirationMarkers.map(marker => {
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
        disabled={inspiration.trim() === ""}
       />
    </>
  );
}