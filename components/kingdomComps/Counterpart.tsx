import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { KingdomType } from "@/types/kingdomType";
import Modal from "../Modal";

export default function Counterpart({ data }: { data: KingdomType["counterparts"][0] }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name);
  const [founder, setFounder] = useState(data.founder);
  const [location, setLocation] = useState(data.location);
  const [primaryGov, setPrimaryGov] = useState(data.primary_gov);
  const [secondaryGov, setSecondaryGov] = useState(data.secondary_gov);
  const [economy, setEconomy] = useState(data.economy);
  const [religion, setReligion] = useState(data.religion);

  const categories = [
    {label: "Founder", value: data.founder},
    {label: "Location", value: data.location},
    {label: "Primary Gov.", value: data.primary_gov},
    {label: "Secondary Gov.", value: data.secondary_gov},
    {label: "Economy", value: data.economy},
    {label: "Religion", value: data.religion}
  ];

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    founder: {
      label: "Founder",
      value: founder,
      setValue: setFounder
    },
    location: {
      label: "Location",
      value: location,
      setValue: setLocation
    },
    primaryGov: {
      label: "Primary Gov.",
      value: primaryGov,
      setValue: setPrimaryGov
    },
    secondaryGov: {
      label: "Secondary Gov.",
      value: secondaryGov,
      setValue: setSecondaryGov
    },
    economy: {
      label: "Economy",
      value: economy,
      setValue: setEconomy
    },
    religion: {
      label: "Religion",
      value: religion,
      setValue: setReligion
    }
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("counterparts").update({
      name: name.trim(),
      founder: founder.trim(),
      location: location.trim(),
      primary_gov: primaryGov.trim(),
      secondary_gov: secondaryGov.trim(),
      economy: economy.trim(),
      religion: religion.trim()
    }).eq("id", data.id);
    setName("");
    setFounder("");
    setLocation("");
    setPrimaryGov("");
    setSecondaryGov("");
    setEconomy("");
    setReligion("");
    setOpen(false);
  }

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
        <button className="bg-secondary text-background font-medium font-heading px-4 py-2 cursor-pointer w-full" onClick={() => setOpen(true)}>Edit</button>
      </div>
      <Modal
        heading="Edit Counterpart"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={name.trim() === "" || location.trim() === ""}
      />
    </>
  );
}