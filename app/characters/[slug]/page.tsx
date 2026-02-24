"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { CharacterType } from "@/types/characterType";
import { Book, Users, ScrollText } from "lucide-react";
import Relation from "@/components/characterComps/Relation";
import Modal from "@/components/Modal";

export default function CharacterPage() {

  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [relatives, setRelatives] = useState<CharacterType[]>([]);

  const [character, setCharacter] = useState<CharacterType>();
  const [name, setName] = useState<string>("");
  const [pronunciation, setPronunciation] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [markers, setMarkers] = useState<string[]>([]);
  const [homeland, setHomeland] = useState<string>("");
  const [father, setFather] = useState<string>("");
  const [mother, setMother] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: character } = await supabase.from("fantasy_characters").select("*, inspirations(*)").eq("id", slug).single();
      setCharacter(character);
      const { data: relatives } = await supabase.from("fantasy_characters").select("*").neq("id", slug);
      setRelatives(relatives ?? []);
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
      father: father.trim(),
      mother: mother.trim()
    }).eq("id", slug);
    setName("");
    setPronunciation("");
    setGender("");
    setFather("");
    setMother("");
    setOpen(false);
  }

  useEffect(() => {
    if (character) {
      setName(character.name);
      setPronunciation(character.pronunciation);
      setGender(character.gender);
      setFather(character.father);
      setMother(character.mother);
    }
  }, [character]);

  const categories = [
    {label: "Pronunciation", value: character?.pronunciation},
    {label: "Meaning", value: ""},
    {label: "Gender", value: character?.gender},
    {label: "Markers", value: character?.markers.join(", ")},
    {label: "Homeland", value: ""},
    {label: "Parents", value: `${character?.father}${character?.father && character?.mother ? " & " : ""}${character?.mother}`}
  ];

  const relativeList: {name: string, relation: string}[] = [];
  relatives.forEach(relative => {
    if (relative.name.includes(father) && father !== "") {
      relativeList.push({name: relative.name, relation: "Father"});
    }
    if (relative.name.includes(mother) && mother !== "") {
      relativeList.push({name: relative.name, relation: "Mother"});
    }
    if (relative.father === father && relative.mother === mother && father !== "" && mother !== "") {
      relativeList.push({name: relative.name, relation: relative.gender === "Male"? "Brother" : "Sister"});
    }
    if ((name.includes(relative.father) || name.includes(relative.mother)) && (relative.father !== "" || relative.mother !== "")) {
      if (relative.gender === "Male") {
        relativeList.push({name: relative.name, relation: "Son"});
      } else if (relative.gender === "Female") {
        relativeList.push({name: relative.name, relation: "Daughter"});
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
              <span>{category.value}</span>
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