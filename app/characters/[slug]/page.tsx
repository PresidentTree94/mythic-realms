"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { CharacterType } from "@/types/characterType";
import { TerritoryType } from "@/types/territoryType";
import { Book, Users, ScrollText } from "lucide-react";
import Relation from "@/components/characterComps/Relation";
import Modal from "@/components/Modal";
import { PANTHEON_MARKERS } from "@/utils/markers";

export default function CharacterPage() {

  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [relatives, setRelatives] = useState<CharacterType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);

  const [character, setCharacter] = useState<CharacterType>();
  const [name, setName] = useState<string>("");
  const [pronunciation, setPronunciation] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [markers, setMarkers] = useState<string[]>([]);
  const [homeland, setHomeland] = useState<string>();
  const [father, setFather] = useState<string>("");
  const [mother, setMother] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: character } = await supabase.from("fantasy_characters").select("*").eq("id", slug).single();
      setCharacter(character);
      const { data: relatives } = await supabase.from("fantasy_characters").select("*").neq("id", slug);
      setRelatives(relatives ?? []);
      const { data: territories } = await supabase.from("territories").select("*, kingdoms(name)").order("name", { ascending: true });
      setTerritories(territories ?? []);
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
      markers: markers,
      territory_id: territories.find(t => t.name === homeland)?.id,
      father: father.trim(),
      mother: mother.trim()
    }).eq("id", slug);
    setName("");
    setPronunciation("");
    setGender("");
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
      setMarkers(character.markers);
      setHomeland(territories.find(t => t.id === character.territory_id)?.name);
      setFather(character.father);
      setMother(character.mother);
    }
  }, [character, territories]);

  const categories = [
    {label: "Pronunciation", value: character?.pronunciation},
    {label: "Meaning", value: ""},
    {label: "Gender", value: character?.gender},
    {label: "Markers", value: character?.markers.map(marker => {
      const Icon = PANTHEON_MARKERS[marker];
      return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
    })},
    {label: "Homeland", value: `${territories.find(t => t.id === character?.territory_id)?.name ?? ""}, ${territories.find(t => t.id === character?.territory_id)?.kingdoms.name ?? ""}`},
    {label: "Occupation", value: ""}
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
          {categories.map(category => (
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
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><ScrollText className="h-8 w-auto" />Inspiration</h3>
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