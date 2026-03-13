"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Landmark, Users, MapPinned, Map } from "lucide-react";
import Territory from "@/components/kingdomComps/Territory";
import Counterpart from "@/components/kingdomComps/Counterpart";
import Overview from "@/components/Overview";
import Modal from "@/components/Modal";
import Relation from "@/components/characterComps/Relation";
import Notes from "@/components/Notes";
import { PANTHEON_MARKERS } from "@/utils/markers";
import useKingdomData from "./useKingdomData";

export default function KingdomPage() {

  const { slug } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const {
    kingdom,
    territories,
    characters,
    kingdomForm,
    handleKingdomSubmit,
    handleKingdomDelete,
    territoryForm,
    handleTerritorySubmit
  } = useKingdomData(Number(slug));

  const greek = kingdom?.counterparts.find(counterpart => counterpart.type === "Greek");
  const medieval = kingdom?.counterparts.find(counterpart => counterpart.type === "Medieval");

  useEffect(() => {
    if (kingdom) {
      kingdomForm.updateMany({
        name: kingdom.name,
        crest: kingdom.crest,
        government: kingdom.government,
        deity: kingdom.deities?.patron
      });
    }
  }, [kingdom]);

  const Icon = kingdom?.deities?.patron ? PANTHEON_MARKERS[kingdom.deities.patron] : null;
  const categories = [
    {label: "Crest", value: kingdom?.crest},
    {label: "Government", value: kingdom?.government},
    {label: "Patron", value: Icon ? <Icon className="h-5 w-auto text-secondary" /> : kingdom?.deities?.patron},
    {label: "Territories", value: territories.length}
  ];

  return (
    <>
      <h2 className="mt-16 text-center">{kingdom?.name}</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setOpenModal("kingdom")}>Edit Kingdom</button>
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setOpenModal("territory")}>Add Territory</button>
      </div>
      <section className="@container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Landmark className="h-8 w-auto" />Vision</h3>
        <Overview categories={categories} />
      </section>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Users className="h-8 w-auto" />Notable Residents</h3>
        <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {characters.map(character => (
            <Relation key={character.id} data={{id: character.id, name: character.name, relation: territories.map(t => t.id).includes(character.homeland_id) ? "Native" : "Foreign"}} />
          ))}
        </article>
      </section>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><MapPinned className="h-8 w-auto" />Key Locations</h3>
        <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {territories.map(territory => (
            <Territory key={territory.id} data={territory} />
          ))}
        </article>
      </section>
      <Notes table="kingdoms" id={Number(slug)} data={kingdom} />
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Map className="h-8 w-auto" />Counterparts</h3>
        <article className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {greek && <Counterpart data={greek} />}
          {medieval && <Counterpart data={medieval} />}
        </article>
      </section>
      <Modal
        heading="Edit Kingdom"
        open={openModal === "kingdom"}
        setOpen={setOpenModal}
        elements={kingdomForm.elements}
        reset={kingdomForm.reset}
        handleSubmit={handleKingdomSubmit}
        handleDelete={handleKingdomDelete}
      />
      <Modal
        heading="Add Territory"
        open={openModal === "territory"}
        setOpen={setOpenModal}
        elements={territoryForm.elements}
        reset={territoryForm.reset}
        handleSubmit={handleTerritorySubmit}
      />
    </>
  );
}