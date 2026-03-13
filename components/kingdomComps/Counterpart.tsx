import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { KingdomType } from "@/types/kingdomType";
import Modal from "../Modal";
import { useForm } from "@presidenttree94/form-utils";

export default function Counterpart({ data }: { data: KingdomType["counterparts"][0] }) {

  const [openModal, setOpenModal] = useState<string | null>(null);
  const counterpartForm = useForm(
    {
      name: data.name,
      founder: data.founder,
      location: data.location,
      primary_gov: data.primary_gov,
      secondary_gov: data.secondary_gov,
      economy: data.economy,
      religion: data.religion
    },
    {
      name: { label: "Name", required: true },
      founder: { label: "Founder" },
      location: { label: "Location" },
      primary_gov: { label: "Primary Gov." },
      secondary_gov: { label: "Secondary Gov." },
      economy: { label: "Economy" },
      religion: { label: "Religion" }
    }
  );

  const handleSubmit = async () => {
    await supabase.from("counterparts").update({
      name: counterpartForm.form.name.trim(),
      founder: counterpartForm.form.founder.trim(),
      location: counterpartForm.form.location.trim(),
      primary_gov: counterpartForm.form.primary_gov.trim(),
      secondary_gov: counterpartForm.form.secondary_gov.trim(),
      economy: counterpartForm.form.economy.trim(),
      religion: counterpartForm.form.religion.trim()
    }).eq("id", data.id);
  }

  const categories = [
    {label: "Founder", value: data.founder},
    {label: "Location", value: data.location},
    {label: "Primary Gov.", value: data.primary_gov},
    {label: "Secondary Gov.", value: data.secondary_gov},
    {label: "Economy", value: data.economy},
    {label: "Religion", value: data.religion}
  ];

  return (
    <>
      <div className="card font-body flex flex-col justify-between @container">
        <div>
          <h4>{data.name}</h4>
          <div className="grid grid-cols-1 @sm:grid-cols-[auto_1fr] gap-4 my-4">
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <span className="font-semibold font-serif">{category.label}</span>
                <span>{category.value}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <button className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full" onClick={() => setOpenModal("counterpart")}>Edit</button>
      </div>
      <Modal
        heading="Edit Counterpart"
        open={openModal === "counterpart"}
        setOpen={setOpenModal}
        elements={counterpartForm.elements}
        reset={counterpartForm.reset}
        handleSubmit={handleSubmit}
      />
    </>
  );
}