"use client";
import { useState } from "react";
import Myth from "@/components/mythComps/Myth";
import Modal from "@/components/Modal";
import Grid from "@/components/Grid";
import useMythData from "./useMythData";

export default function Myths() {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const { myths, mythForm, handleSubmit } = useMythData();

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
        elements={mythForm.elements}
        reset={mythForm.reset}
        handleSubmit={handleSubmit}
      />
    </Grid>
  );
}