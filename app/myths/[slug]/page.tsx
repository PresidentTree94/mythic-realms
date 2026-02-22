"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { MythType } from "@/types/mythType";
import { InspirationType } from "@/types/inspirationType";
import MythInsp from "@/components/MythInsp";
import Modal from "@/components/Modal";

export default function MythPage() {

  const { slug } = useParams();
  const [myth, setMyth] = useState<MythType>();
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);

  const [mythOpen, setMythOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const [contributionOpen, setContributionOpen] = useState(false);
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [location, setLocation] = useState("");
  const [markers, setMarkers] = useState<string[]>([]);
  const [contribution, setContribution] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: myths } = await supabase.from("myths").select("*, myth_insp( contribution, inspirations (*) )").eq("id", slug).single();
      const sorted = myths ? {...myths,
        myth_insp: myths.myth_insp.sort((a: any, b: any) => a.inspirations.name.localeCompare(b.inspirations.name))
      }: null;
      setMyth(sorted);
      const { data: inspirations } = await supabase.from("inspirations").select("*").order("name", { ascending: true });
      setInspirations(inspirations ?? []);
    };
    fetchData();
  }, [slug]);

  const mythElements = {
    title: {
      label: "Title",
      value: title,
      setValue: setTitle
    },
    summary: {
      label: "Summary",
      value: summary,
      setValue: setSummary
    }
  }

  useEffect(() => {
    if (myth) {
      setTitle(myth.title);
      setSummary(myth.summary);
    }
  }, [myth]);

  const handleMythSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("myths").update({ title: title.trim(), summary: summary.trim() }).eq("id", slug);
    setTitle("");
    setSummary("");
    setMythOpen(false);
  }

  const contributionElements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName,
      options: inspirations.map(i => i.name),
      defaultOption: "Select Inspiration"
    },
    newName: {
      label: "New Name",
      value: newName,
      setValue: setNewName
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
      options: ["Deity", "Demigod", "Nymph", "Seer", "Prophet"],
    },
    contribution: {
      label: "Contribution",
      value: contribution,
      setValue: setContribution
    }
  }

  useEffect(() => {
    if (name) {
      const inspiration = inspirations.find(i => i.name === name);
      setLocation(inspiration?.location ?? "");
      setMarkers(inspiration?.markers ?? []);
    } else {
      setMarkers([]);
      setLocation("");
    }
  }, [name, inspirations]);

  const handleContributionSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { data } = await supabase.from("inspirations").upsert({
      name: name ? name : newName.trim(),
      location: location.trim(),
      markers: markers
    }, { onConflict: "name" }).select().single();
    if (data) {
      await supabase.from("myth_insp").insert({ myth_id: slug, inspiration_id: data.id, contribution: contribution.trim() });
    }
    setName("");
    setNewName("");
    setLocation("");
    setMarkers([]);
    setContribution("");
    setContributionOpen(false);
  }

  return (
    <>
      <h2 className="mt-16 text-center">{myth?.title}</h2>
      <p className="card font-serif">{myth?.summary}</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={() => setMythOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Edit Myth</button>
        <button onClick={() => setContributionOpen(true)} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Contribution</button>
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myth?.myth_insp.map((mythInsp) => 
          <MythInsp key={mythInsp.inspirations.id} data={mythInsp} />
        )}
      </article>
      <Modal
        heading="Edit Myth"
        open={mythOpen}
        setOpen={setMythOpen}
        elements={mythElements}
        handleSubmit={handleMythSubmit}
        disabled={title.trim() === ""}
      />
      <Modal
        heading="Add Contribution"
        open={contributionOpen}
        setOpen={setContributionOpen}
        elements={contributionElements}
        handleSubmit={handleContributionSubmit}
        disabled={name.trim() === "" && newName.trim() === ""}
      />
    </>
  );
}