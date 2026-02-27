"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Kingdom from "@/components/kingdomComps/Kingdom";
import { KingdomType } from "@/types/kingdomType";
import Grid from "@/components/Grid";
import Modal from "@/components/Modal";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Kingdoms() {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [kingdoms, setKingdoms] = useState<KingdomType[]>([]);

  const kingdomForm = useFormState({
    name: "",
    crest: "",
    government: "",
    greek: "",
    greekLocation: "",
    medieval: "",
    medievalLocation: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("kingdoms").select(`*, counterparts(*)`).order("name", { ascending: true });
      setKingdoms(data ?? []);
    }
    fetchData();
  }, []);

  const elements = buildFormElements(kingdomForm.form, kingdomForm.update, {
    name: { label: "Name" },
    crest: { label: "Crest" },
    government: { label: "Government" },
    greek: { label: "Greek" },
    greekLocation: { label: "Greek Location" },
    medieval: { label: "Medieval" },
    medievalLocation: { label: "Medieval Location" }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { data: kingdom } = await supabase.from("kingdoms").insert({ name: kingdomForm.form.name.trim(), crest: kingdomForm.form.crest.trim(), government: kingdomForm.form.government.trim() }).select().single();
    await supabase.from("counterparts").insert({ name: kingdomForm.form.greek.trim(), type: "Greek", location: kingdomForm.form.greekLocation.trim(), kingdom_id: kingdom?.id ?? 0 }).select().single();
    await supabase.from("counterparts").insert({ name: kingdomForm.form.medieval.trim(), type: "Medieval", location: kingdomForm.form.medievalLocation.trim(), kingdom_id: kingdom?.id ?? 0 }).select().single();
    kingdomForm.reset();
    setOpenModal(null);
  }

  return (
    <Grid
      title="Realms & Echoes"
      quote="History does not repeat itself, but it rhymes. See how the great city-states of old have been reborn in steel and stone."
      button={{ label: "Add Kingdom", onClick: () => setOpenModal("kingdom") }}
      gridStyle=""
      data={kingdoms}
      dataComponent={Kingdom}>
        <Modal
          heading="Add Kingdom"
          open={openModal === "kingdom"}
          setOpen={setOpenModal}
          elements={elements}
          handleSubmit={handleSubmit}
          disabled={kingdomForm.form.name.trim() === ""}
        />
    </Grid>
  );
}