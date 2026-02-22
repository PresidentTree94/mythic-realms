"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Myth from "@/components/Myth";
import { MythType } from "@/types/mythType";
import Modal from "@/components/Modal";
import Grid from "@/components/Grid";

export default function Myths() {

  const [open, setOpen] = useState(false);
  const [myths, setMyths] = useState<MythType[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: myths } = await supabase.from("myths").select("*, myth_insp( inspirations (id, name) )").order("title", { ascending: true });
      const sorted = myths?.map(myth => ({...myth,
        myth_insp: myth.myth_insp.sort((a: any, b: any) => a.inspirations.name.localeCompare(b.inspirations.name))
      })).sort((a, b) => a.title.localeCompare(b.title));
      setMyths(sorted ?? []);
    }
    fetchData();
  }, []);

  const elements = {
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

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("myths").insert({ title: title.trim(), summary: summary.trim() });
    setTitle("");
    setSummary("");
    setOpen(false);
  }

  return (
    <Grid
      title="The Chronicles"
      quote="Legends are but truths that time has forgotten."
      button={{ label: "Add Myth", onClick: () => setOpen(true) }}
      gridStyle="md:grid-cols-2 lg:grid-cols-3"
      data={myths}
      dataComponent={Myth}>
      <Modal
        heading="Add Myth"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={title.trim() === ""}
      />
    </Grid>
  );
}