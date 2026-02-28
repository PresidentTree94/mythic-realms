"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Grid from "@/components/Grid";
import { DeityType } from "@/types/deityType";
import Patron from "@/components/Patron";
import Modal from "@/components/Modal";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Pantheon() {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [deities, setDeities] = useState<DeityType[]>([]);

  const deityForm = useFormState({ patron: "", representations: "", blessing: "", description: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("deities").select("*").order("patron", { ascending: true });
      setDeities(data ?? []);
    }
    fetchData();
  }, []);

  const elements = buildFormElements(deityForm.form, deityForm.update, {
    patron: { label: "Patron" },
    representations: { label: "Representations" },
    blessing: { label: "Blessing" },
    description: { label: "Description" }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("deities").insert({
      patron: deityForm.form.patron.trim(),
      representations: deityForm.form.representations.trim(),
      blessing: deityForm.form.blessing.trim(),
      description: deityForm.form.description.trim()
    })
    deityForm.reset();
    setOpenModal(null);
  };

  return (
    <Grid
      title="Pantheon"
      quote="Thrones in the heavens, shadows on the earth. Each kingdom a reflection of a divine will."
      button={{label: "Add Deity", onClick: () => setOpenModal("deity")}}
      gridStyle="sm:grid-cols-2 lg:grid-cols-3"
      data={deities}
      dataComponent={Patron}>
      <Modal
        heading="Add Deity"
        open={openModal === "deity"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={deityForm.form.patron.trim() === ""}
      />
    </Grid>
  );
}