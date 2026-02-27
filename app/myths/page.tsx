"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Myth from "@/components/mythComps/Myth";
import { MythType } from "@/types/mythType";
import Modal from "@/components/Modal";
import Grid from "@/components/Grid";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Myths() {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [myths, setMyths] = useState<MythType[]>([]);
  
  const mythForm = useFormState({ title: "", summary: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: myths } = await supabase.from("myths").select("*, myth_insp(inspiration_id, inspirations (id, name) )").order("title", { ascending: true });
      const sorted = myths?.map(myth => ({...myth,
        myth_insp: myth.myth_insp.sort((a: any, b: any) => a.inspirations.name.localeCompare(b.inspirations.name))
      })).sort((a, b) => a.title.localeCompare(b.title));
      setMyths(sorted ?? []);
    }
    fetchData();
  }, []);

  const elements = buildFormElements(mythForm.form, mythForm.update, {
    title: { label: "Title" },
    summary: { label: "Summary" }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("myths").insert({ title: mythForm.form.title.trim(), summary: mythForm.form.summary.trim() });
    mythForm.reset();
    setOpenModal(null);
  }

  return (
    <Grid
      title="The Chronicles"
      quote="Legends are but truths that time has forgotten."
      button={{ label: "Add Myth", onClick: () => setOpenModal("myth") }}
      gridStyle="md:grid-cols-2 lg:grid-cols-3"
      data={myths}
      dataComponent={Myth}>
      <Modal
        heading="Add Myth"
        open={openModal === "myth"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={mythForm.form.title.trim() === ""}
      />
    </Grid>
  );
}