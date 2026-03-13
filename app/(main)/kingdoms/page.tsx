"use client";
import { useState } from "react";
import Kingdom from "@/components/kingdomComps/Kingdom";
import Grid from "@/components/Grid";
import Modal from "@/components/Modal";
import useKingdomData from "./useKingdomData";

export default function Kingdoms() {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const { kingdoms, kingdomForm, handleSubmit } = useKingdomData();

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
          elements={kingdomForm.elements}
          reset={kingdomForm.reset}
          handleSubmit={handleSubmit}
        />
    </Grid>
  );
}