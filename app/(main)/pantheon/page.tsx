"use client";
import { useState } from "react";
import Grid from "@/components/Grid";
import Patron from "@/components/Patron";
import Modal from "@/components/Modal";
import usePantheonData from "./usePantheonData";

export default function Pantheon() {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const { deities, deityForm, handleSubmit } = usePantheonData();

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
        elements={deityForm.elements}
        reset={deityForm.reset}
        handleSubmit={handleSubmit}
      />
    </Grid>
  );
}