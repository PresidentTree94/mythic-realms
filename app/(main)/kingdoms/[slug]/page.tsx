"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { KingdomType } from "@/types/kingdomType";
import { TerritoryType } from "@/types/territoryType";
import { CharacterType } from "@/types/characterType";
import { DeityType } from "@/types/deityType";
import { Landmark, Users, MapPinned, Map } from "lucide-react";
import Territory from "@/components/kingdomComps/Territory";
import Counterpart from "@/components/kingdomComps/Counterpart";
import Overview from "@/components/Overview";
import Modal from "@/components/Modal";
import Relation from "@/components/characterComps/Relation";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function KingdomPage() {

  const { slug } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [kingdom, setKingdom] = useState<KingdomType>();
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [deities, setDeities] = useState<DeityType[]>([]);

  const kingdomForm = useFormState({ name: "", crest: "", government: "", deity: "" });
  const territoryForm = useFormState({ name: "", counterpart: "" });

  useEffect(() => {
    const fetchData = async () => {
      const { data: kingdom } = await supabase.from("kingdoms").select(`*, counterparts(*), deities(*)`).eq("id", slug).single();
      setKingdom(kingdom);
      const { data: territories } = await supabase.from("territories").select("*").eq("kingdom_id", slug).order("name", { ascending: true });
      setTerritories(territories ?? []);
      const { data: characters } = await supabase.from("fantasy_characters").select("*").in("territory_id", territories?.map(t => t.id) ?? []).order("name", { ascending: true });
      setCharacters(characters ?? []);
      const { data: deities } = await supabase.from("deities").select("*").order("patron", { ascending: true });
      setDeities(deities ?? []);
    }
    fetchData();
  }, [slug]);
  console.log(kingdom);

  const greek = kingdom?.counterparts.find(counterpart => counterpart.type === "Greek");
  const medieval = kingdom?.counterparts.find(counterpart => counterpart.type === "Medieval");

  const kingdomElements = buildFormElements(kingdomForm.form, kingdomForm.update, {
    name: { label: "Name" },
    crest: { label: "Crest" },
    government: { label: "Government" },
    deity: {
      label: "Deity",
      options: deities.map(d => d.patron),
      defaultOption: "Select Deity"
    }
  });

  useEffect(() => {
    if (kingdom) {
      kingdomForm.setForm({
        name: kingdom.name,
        crest: kingdom.crest,
        government: kingdom.government,
        deity: kingdom.deities?.patron
      });
    }
  }, [kingdom]);

  const handleKingdomSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("kingdoms").update({
      name: kingdomForm.form.name.trim(),
      crest: kingdomForm.form.crest.trim(),
      government: kingdomForm.form.government.trim(),
      deity_id: deities.find(d => d.patron === kingdomForm.form.deity)?.id ?? null
    }).eq("id", slug);
    kingdomForm.reset();
    setOpenModal(null);
  }

  const territoryElements = buildFormElements(territoryForm.form, territoryForm.update, {
    name: { label: "Name" },
    counterpart: { label: "Counterpart" }
  });

  const handleTerritorySubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("territories").insert({
      name: territoryForm.form.name.trim(),
      counterpart: territoryForm.form.counterpart.trim(),
      kingdom_id: slug
    });
    territoryForm.reset();
    setOpenModal(null);
  }

  const categories = [
    {label: "Crest", value: kingdom?.crest},
    {label: "Government", value: kingdom?.government},
    {label: "Patron", value: kingdom?.deities?.patron},
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
            <Relation key={character.id} data={{id: character.id, name: character.name, relation: character.status}} />
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
        elements={kingdomElements}
        handleSubmit={handleKingdomSubmit}
        disabled={kingdomForm.form.name.trim() === ""}
      />
      <Modal
        heading="Add Territory"
        open={openModal === "territory"}
        setOpen={setOpenModal}
        elements={territoryElements}
        handleSubmit={handleTerritorySubmit}
        disabled={territoryForm.form.name.trim() === "" || territoryForm.form.counterpart.trim() === ""}
      />
    </>
  );
}