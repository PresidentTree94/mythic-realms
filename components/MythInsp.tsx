import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MythType } from "@/types/mythType";
import Modal from "./Modal";
import { MARKERS } from "@/utils/markers";

export default function MythInsp({ data }: { data: MythType["myth_insp"][0] }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.inspirations.name);
  const [location, setLocation] = useState(data.inspirations.location);
  const [markers, setMarkers] = useState(data.inspirations.markers);
  const [contribution, setContribution] = useState(data.contribution);

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    location: {
      label: "Location",
      value: location,
      setValue: setLocation
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
    await supabase.from("inspirations").update({ name: name.trim(), location: location.trim(), markers: markers }).eq("id", data.inspirations.id);
    await supabase.from("myth_insp").update({ contribution: contribution.trim() }).eq("myth_id", data.myth_id).eq("inspiration_id", data.inspirations.id);
    setName("");
    setLocation("");
    setMarkers([]);
    setContribution("");
    setOpen(false);
  }

  const handleDelete = async () => {
    await supabase.from("myth_insp").delete().eq("myth_id", data.myth_id).eq("inspiration_id", data.inspirations.id);
    const { data: characters } = await supabase.from("fantasy_characters").select("*").eq("inspiration_id", data.inspirations.id);
    const { data: myths } = await supabase.from("myth_insp").select("*").eq("inspiration_id", data.inspirations.id);
    if ((characters && characters.length === 0) && (myths && myths.length === 0)) {
      await supabase.from("inspirations").delete().eq("id", data.inspirations.id);
    }
    window.location.reload();
  }

  return (
    <>
      <div className="card p-0 overflow-hidden flex flex-col">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="p-6 flex flex-col justify-between gap-4 flex-1">
          <div>
            <div className="flex justify-between items-center">
              <h4>{data.inspirations.name}</h4>
              <div className="flex gap-1">
                {data.inspirations.markers.map(marker => {
                  const Icon = marker !== "" ? MARKERS[marker] : null;
                  return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
                })}
              </div>
            </div>
            <p className="text-xs font-body italic mb-2">{data.inspirations.location}</p>
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
        handleDelete={handleDelete}
        disabled={name.trim() === ""}
      />
    </>
  );
}