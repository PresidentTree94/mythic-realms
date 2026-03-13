"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MythInsp from "@/components/mythComps/MythInsp";
import Modal from "@/components/Modal";
import useMythData from "./useMythData";

export default function MythPage() {

  const { slug } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { myth, inspirations, mythForm, handleMythSubmit, contributionForm, handleContributionSubmit } = useMythData(Number(slug));

  useEffect(() => {
    if (myth) {
      mythForm.updateMany({
        title: myth.title,
        subtitle: myth.subtitle,
        summary: myth.summary
      });
    }
  }, [myth]);

  
  useEffect(() => {
    if (contributionForm.form.name) {
      const inspiration = inspirations.find(i => i.name === contributionForm.form.name);
      contributionForm.updateMany({
        tagline: inspiration?.tagline ?? "",
        location: inspiration?.location ?? "",
        markers: inspiration?.markers ?? []
      });
    } else {
      contributionForm.updateMany({
        tagline: "",
        location: "",
        markers: []
      });
    }
  }, [contributionForm.form.name, inspirations]);

  return (
    <>
      <h2 className="mt-16 text-center">{myth?.title}</h2>
      <div className="card text-center space-y-2">
        <p className="text-sm font-body italic">{myth?.subtitle}</p>
        <p className="font-serif">{myth?.summary}</p>
      </div>
      <div className="flex gap-4 justify-center flex-wrap">
        <button onClick={() => setOpenModal("myth")} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Edit Myth</button>
        <button onClick={() => setOpenModal("contribution")} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Contribution</button>
      </div>
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myth?.myth_insp.map((mythInsp) => 
          <MythInsp key={mythInsp.inspirations.id} data={mythInsp} />
        )}
      </article>
      <Modal
        heading="Edit Myth"
        open={openModal === "myth"}
        setOpen={setOpenModal}
        elements={mythForm.elements}
        reset={mythForm.reset}
        handleSubmit={handleMythSubmit}
      />
      <Modal
        heading="Add Contribution"
        open={openModal === "contribution"}
        setOpen={setOpenModal}
        elements={contributionForm.elements}
        reset={contributionForm.reset}
        handleSubmit={handleContributionSubmit}
      />
    </>
  );
}