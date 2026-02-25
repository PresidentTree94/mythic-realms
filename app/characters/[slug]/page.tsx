"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { CharacterType } from "@/types/characterType";
import { TerritoryType } from "@/types/territoryType";
import { MythType } from "@/types/mythType";
import { Book, Users, ScrollText } from "lucide-react";
import Relation from "@/components/characterComps/Relation";
import MythSum from "@/components/MythSum";
import Modal from "@/components/Modal";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";

export default function CharacterPage() {

  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [relatives, setRelatives] = useState<CharacterType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [myths, setMyths] = useState<MythType[]>([]);

  const [character, setCharacter] = useState<CharacterType>();
  const [name, setName] = useState<string>("");
  const [pronunciation, setPronunciation] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [markers, setMarkers] = useState<string[]>([]);
  const [homeland, setHomeland] = useState<string>();
  const [status, setStatus] = useState<string>("");
  const [father, setFather] = useState<string>("");
  const [mother, setMother] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: character } = await supabase.from("fantasy_characters").select("*, inspirations(*)").eq("id", slug).single();
      setCharacter(character);
      const { data: relatives } = await supabase.from("fantasy_characters").select("*").neq("id", slug);
      setRelatives(relatives ?? []);
      const { data: territories } = await supabase.from("territories").select("*, kingdoms(name)").order("name", { ascending: true });
      setTerritories(territories ?? []);
      const { data: myths } = await supabase.from("myths").select("*, myth_insp!inner(*, inspirations (*))").eq("myth_insp.inspiration_id", character?.inspirations.id);
      setMyths(myths ?? []);
    }
    fetchData();
  }, [slug]);

  const elements = {
    name: {
      label: "Name",
      value: name,
      setValue: setName
    },
    pronunciation: {
      label: "Pronunciation",
      value: pronunciation,
      setValue: setPronunciation
    },
    gender: {
      label: "Gender",
      value: gender,
      setValue: setGender,
      options: ["Male", "Female"],
      defaultOption: "Select Gender"
    },
    markers: {
      label: "Markers",
      value: markers,
      setValue: setMarkers,
      options: Object.keys(PANTHEON_MARKERS)
    },
    homeland: {
      label: "Homeland",
      value: homeland,
      setValue: setHomeland,
      options: territories.map(t => t.name),
      defaultOption: "Select Homeland"
    },
    status: {
      label: "Status",
      value: status,
      setValue: setStatus,
      options: gender === "Male" ? ["King", "Prince", "Citizen"] : ["Queen", "Princess", "Citizen"],
      defaultOption: "Select Status"
    },
    father: {
      label: "Father",
      value: father,
      setValue: setFather
    },
    mother: {
      label: "Mother",
      value: mother,
      setValue: setMother
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("fantasy_characters").update({
      name: name.trim(),
      pronunciation: pronunciation.trim(),
      gender: gender.trim(),
      status: status,
      markers: markers,
      territory_id: territories.find(t => t.name === homeland)?.id,
      father: father.trim(),
      mother: mother.trim()
    }).eq("id", slug);
    setName("");
    setPronunciation("");
    setGender("");
    setStatus("");
    setMarkers([]);
    setHomeland("");
    setFather("");
    setMother("");
    setOpen(false);
  }

  useEffect(() => {
    if (character && territories.length > 0) {
      setName(character.name);
      setPronunciation(character.pronunciation);
      setGender(character.gender);
      setStatus(character.status);
      setMarkers(character.markers);
      setHomeland(territories.find(t => t.id === character.territory_id)?.name);
      setFather(character.father);
      setMother(character.mother);
    }
  }, [character, territories]);

  const characterCategories = [
    {label: "Pronunciation", value: character?.pronunciation},
    {label: "Meaning", value: ""},
    {label: "Gender", value: character?.gender},
    {label: "Markers", value: character?.markers.map(marker => {
      const Icon = PANTHEON_MARKERS[marker];
      return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
    })},
    {label: "Homeland", value: `${territories.find(t => t.id === character?.territory_id)?.name ?? ""}, ${territories.find(t => t.id === character?.territory_id)?.kingdoms.name ?? ""}`},
    {label: "Status", value: character?.status}
  ];

  const inspirationCategories = [
    {label: "Meaning", value: ""},
    {label: "Location", value: character?.inspirations.location},
    {label: "Markers", value: character?.inspirations.markers.map(marker => {
      const Icon = INSPIRATION_MARKERS[marker];
      return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
    })},
    {label: "Myths", value: myths.length}
  ];

  const relativeList: {id: number, name: string, relation: string}[] = [];
  relatives.forEach(relative => {
    if (relative.name === father && father !== "") {
      relativeList.push({id: relative.id, name: relative.name, relation: "Father"});
    }
    if (relative.name === mother && mother !== "") {
      relativeList.push({id: relative.id, name: relative.name, relation: "Mother"});
    }
    if ((relative.father === father && father !== "") || (relative.mother === mother && mother !== "")) {
      relativeList.push({id: relative.id, name: relative.name, relation: relative.gender === "Male"? "Brother" : "Sister"});
    }
    if ((relative.father === name && relative.father !== "") || (relative.mother === name && relative.mother !== "")) {
      if (relative.gender === "Male") {
        relativeList.push({id: relative.id, name: relative.name, relation: "Son"});
      } else if (relative.gender === "Female") {
        relativeList.push({id: relative.id, name: relative.name, relation: "Daughter"});
      }
    }
  });
  relativeList.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <h2 className="mt-16 text-center">{character?.name}</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setOpen(true)}>Edit Character</button>
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Relation</button>
      </div>
      <section className="@container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Book className="h-8 w-auto" />Legend</h3>
        <article className="card grid grid-cols-1 @sm:grid-cols-[auto_1fr] @2xl:grid-cols-[auto_1fr_auto_1fr] gap-4 text-center @sm:text-left font-body mt-8">
          {characterCategories.map(category => (
            <React.Fragment key={category.label}>
              <span className="font-semibold font-serif">{category.label}</span>
              <span className="flex justify-center @sm:justify-start">{category.value}</span>
            </React.Fragment>
          ))}
        </article>
      </section>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Users className="h-8 w-auto" />Lineage & Kin</h3>
        <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {relativeList.map(relative => (
            <Relation key={relative.name} data={relative} />
          ))}
        </article>
      </section>
      <section className="space-y-8 @container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><ScrollText className="h-8 w-auto" />Inspiration</h3>
        <h3 className="text-center">{character?.inspirations.name}</h3>
        <article className="card grid grid-cols-1 @sm:grid-cols-[auto_1fr] @2xl:grid-cols-[auto_1fr_auto_1fr] gap-4 text-center @sm:text-left font-body">
          {inspirationCategories.map(category => (
            <React.Fragment key={category.label}>
              <span className="font-semibold font-serif">{category.label}</span>
              <span className="flex">{category.value}</span>
            </React.Fragment>
          ))}
        </article>
        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myths.map(myth => (
            <MythSum key={myth.id} data={myth} />
          ))}
        </article>
      </section>
      <Modal
        heading="Edit Character"
        open={open}
        setOpen={setOpen}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={name.trim() === ""}
      />
    </>
  );
}