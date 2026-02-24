"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { KingdomType } from "@/types/kingdomType";
import { TerritoryType } from "@/types/territoryType";
import { CharacterType } from "@/types/characterType";
import { Users, MapPinned, Map } from "lucide-react";
import Territory from "@/components/kingdomComps/Territory";
import Counterpart from "@/components/kingdomComps/Counterpart";
import Modal from "@/components/Modal";
import Relation from "@/components/characterComps/Relation";

export default function KingdomPage() {

  const { slug } = useParams();
  const [kingdomOpen, setKingdomOpen] = useState(false);
  const [territoryOpen, setTerritoryOpen] = useState(false);
  const [kingdom, setKingdom] = useState<KingdomType>();
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [name, setName] = useState("");
  const [crest, setCrest] = useState("");
  const [government, setGovernment] = useState("");
  const [territoryName, setTerritoryName] = useState("");
  const [territoryCounterpart, setTerritoryCounterpart] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: kingdom } = await supabase.from("kingdoms").select(`*, counterparts(*)`).eq("id", slug).single();
      setKingdom(kingdom);
      const { data: territories } = await supabase.from("territories").select("*").eq("kingdom_id", slug).order("name", { ascending: true });
      setTerritories(territories ?? []);
      const { data: characters } = await supabase.from("fantasy_characters").select("*").in("territory_id", territories?.map(t => t.id) ?? []).order("name", { ascending: true });
      setCharacters(characters ?? []);
    }
    fetchData();
  }, [slug]);

  const greek = kingdom?.counterparts.find(counterpart => counterpart.type === "Greek");
  const medieval = kingdom?.counterparts.find(counterpart => counterpart.type === "Medieval");

  const kingdomElements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    crest: {
      label: "Crest",
      value: crest,
      setValue: setCrest
    },
    government: {
      label: "Government",
      value: government,
      setValue: setGovernment
    }
  };

  useEffect(() => {
    if (kingdom) {
      setName(kingdom.name);
      setCrest(kingdom.crest);
      setGovernment(kingdom.government);
    }
  }, [kingdom]);

  const handleKingdomSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("kingdoms").update({
      name: name.trim(),
      crest: crest.trim(),
      government: government.trim()
    }).eq("id", slug);
    setName("");
    setCrest("");
    setGovernment("");
    setKingdomOpen(false);
  }

  const territoryElements = {
    name: {
      label: "Name",
      value: territoryName,
      setValue: setTerritoryName
    },
    counterpart: {
      label: "Counterpart",
      value: territoryCounterpart,
      setValue: setTerritoryCounterpart
    }
  };

  const handleTerritorySubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("territories").insert({
      name: territoryName.trim(),
      counterpart: territoryCounterpart.trim(),
      kingdom_id: slug
    });
    setTerritoryName("");
    setTerritoryCounterpart("");
    setTerritoryOpen(false);
  }

  return (
    <>
      <h2 className="mt-16 text-center">{kingdom?.name}</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setKingdomOpen(true)}>Edit Kingdom</button>
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setTerritoryOpen(true)}>Add Territory</button>
      </div>
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
        open={kingdomOpen}
        setOpen={setKingdomOpen}
        elements={kingdomElements}
        handleSubmit={handleKingdomSubmit}
        disabled={name.trim() === ""}
      />
      <Modal
        heading="Add Territory"
        open={territoryOpen}
        setOpen={setTerritoryOpen}
        elements={territoryElements}
        handleSubmit={handleTerritorySubmit}
        disabled={territoryName.trim() === "" || territoryCounterpart.trim() === ""}
      />
    </>
  );
}