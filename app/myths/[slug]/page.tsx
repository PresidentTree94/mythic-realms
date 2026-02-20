"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { My } from "@/types/my";
import Modal from "@/components/Modal";
import MyCh from "@/components/MyCh";
import { MyChar } from "@/types/myChar";
import Grid from "@/components/Grid";

export default function MythPage() {

  const { slug } = useParams();

  const [contributionOpen, setContributionOpen] = useState(false);
  const [inspiration, setInspiration] = useState("");
  const [contribution, setContribution] = useState("");

  const [mythOpen, setMythOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const [myth, setMyth] = useState<My>();
  const [mythChars, setMythChars] = useState<MyChar[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("myths").select("*").eq("id", slug).single();
      setMyth(data);
      const { data: chars } = await supabase.from("myth_chars").select(`*, characters (id, inspiration)`).eq("myth_id", slug);
      const sorted = (chars ?? []).sort((a, b) => a.characters.inspiration.localeCompare(b.characters.inspiration) );
      setMythChars(sorted);
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (myth) {
      setTitle(myth.title);
      setSummary(myth.summary);
    }
  }, [myth]);

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

  const handleMythSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("myths").update({ title: title.trim(), summary: summary.trim() }).eq("id", slug);
    setTitle("");
    setSummary("");
    setMythOpen(false);
  }

  const contributionElements = {
    inspiration: {
      label: "Inspiration",
      value: inspiration,
      setValue: setInspiration
    },
    contribution: {
      label: "Contribution",
      value: contribution,
      setValue: setContribution
    }
  }

  const handleContributionSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let { data: character } = await supabase.from("characters").select("*").eq("inspiration", inspiration).single();
    if (!character) {
      const { data: newChar } = await supabase.from("characters").insert({ inspiration: inspiration.trim() }).select("*").single();
      character = newChar;
    }
    await supabase.from("myth_chars").insert({ myth_id: slug, character_id: character.id, contribution: contribution.trim() });

    setInspiration("");
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
        {mythChars.map((myChar) => 
          <MyCh key={myChar.myth_id + "0" + myChar.character_id} data={myChar} />
        )}
      </article>
      <Modal
        heading="Add New Contribution"
        open={contributionOpen}
        setOpen={setContributionOpen}
        elements={contributionElements}
        handleSubmit={handleContributionSubmit}
        disabled={inspiration.trim() === ""}
      />
      <Modal
        heading="Edit Myth"
        open={mythOpen}
        setOpen={setMythOpen}
        elements={mythElements}
        handleSubmit={handleMythSubmit}
        disabled={title.trim() === ""}
      />
    </>
  );
}