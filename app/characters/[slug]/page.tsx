"use client";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { CharacterType } from "@/types/characterType";
import { TerritoryType } from "@/types/territoryType";
import { MythType } from "@/types/mythType";
import { RelationType } from "@/types/relationType";
import { Book, Users, ScrollText } from "lucide-react";
import Relation from "@/components/characterComps/Relation";
import MythSum from "@/components/MythSum";
import Modal from "@/components/Modal";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";

export default function CharacterPage() {

  const { slug } = useParams();
  const [characterOpen, setCharacterOpen] = useState(false);
  const [relationOpen, setRelationOpen] = useState(false);

  const [character, setCharacter] = useState<CharacterType>();
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [relatives, setRelatives] = useState<CharacterType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [myths, setMyths] = useState<MythType[]>([]);
  const [relationships, setRelationships] = useState<RelationType[]>([]);

  const initialForm = {
    name: "",
    pronunciation: "",
    gender: "",
    markers: [] as string[],
    homeland: "",
    status: "",
    father: "",
    mother: ""
  };

  const [characterForm, setCharacterForm] = useState(initialForm);
  const updateCharacter = (key: string, value: any) => setCharacterForm(prev => ({ ...prev, [key]: value }));

  const [relationForm, setRelationForm] = useState({ relationName: "", relationType: "" });
  const updateRelation = (key: string, value: any) => setRelationForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    const fetchData = async () => {
      const [
        { data: char },
        { data: characters },
        { data: relatives },
        { data: territories },
        { data: myths },
        { data: relationships }
      ] = await Promise.all([
        supabase.from("fantasy_characters").select("*, inspirations(*)").eq("id", slug).single(),
        supabase.from("fantasy_characters").select("*, inspirations(*)").order("name", { ascending: true }),
        supabase.from("fantasy_characters").select("*").neq("id", slug),
        supabase.from("territories").select("*, kingdoms(name)").order("name", { ascending: true }),
        supabase.from("myths").select("*, myth_insp!inner(*, inspirations (*))").eq("myth_insp.inspiration_id", character?.inspirations.id),
        supabase.from("relationships").select("*").or(`first_character.eq.${slug},second_character.eq.${slug}`)
      ]);
      setCharacter(char);
      setCharacters(characters ?? []);
      setRelatives(relatives ?? []);
      setTerritories(territories ?? []);
      setMyths(myths ?? []);
      setRelationships(relationships ?? []);
    }
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (character && territories.length > 0) {
      setCharacterForm({
        name: character.name,
        pronunciation: character.pronunciation,
        gender: character.gender,
        status: character.status,
        markers: character.markers,
        homeland: territories.find(t => t.id === character.territory_id)?.name ?? "",
        father: character.father,
        mother: character.mother
      });
    }
  }, [character, territories]);

  const characterElements = {
    name: {
      label: "Name", 
      value: characterForm.name, 
      setValue: (value: string) => updateCharacter("name", value)
    },
    pronunciation: {
      label: "Pronunciation",
      value: characterForm.pronunciation,
      setValue: (value: string) => updateCharacter("pronunciation", value)
    },
    gender: {
      label: "Gender",
      value: characterForm.gender,
      setValue: (value: string) => updateCharacter("gender", value),
      options: ["Male", "Female"],
      defaultOption: "Select Gender"
    },
    markers: {
      label: "Markers",
      value: characterForm.markers,
      setValue: (value: string[]) => updateCharacter("markers", value),
      options: Object.keys(PANTHEON_MARKERS)
    },
    homeland: {
      label: "Homeland",
      value: characterForm.homeland,
      setValue: (value: string) => updateCharacter("homeland", value),
      options: territories.map(t => t.name),
      defaultOption: "Select Homeland"
    },
    status: {
      label: "Status",
      value: characterForm.status,
      setValue: (value: string) => updateCharacter("status", value),
      options: characterForm.gender === "Male" ? ["King", "Prince", "Citizen"] : ["Queen", "Princess", "Citizen"],
      defaultOption: "Select Status"
    },
    father: {
      label: "Father",
      value: characterForm.father,
      setValue: (value: string) => updateCharacter("father", value)
    },
    mother: {
      label: "Mother",
      value: characterForm.mother,
      setValue: (value: string) => updateCharacter("mother", value)
    }
  }

  const handleCharacterSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("fantasy_characters").update({
      name: characterForm.name.trim(),
      pronunciation: characterForm.pronunciation.trim(),
      gender: characterForm.gender.trim(),
      status: characterForm.status,
      markers: characterForm.markers,
      territory_id: territories.find(t => t.name === characterForm.homeland)?.id,
      father: characterForm.father.trim(),
      mother: characterForm.mother.trim()
    }).eq("id", slug);
    setCharacterForm(initialForm);
    setCharacterOpen(false);
  }

  const relationList = useMemo(() => {
    const list: {id: number, name: string, relation: string}[] = [];
    relatives.forEach(relative => {
      if (relative.name === characterForm.father && characterForm.father) {
        list.push({id: relative.id, name: relative.name, relation: "Father"});
      }
      if (relative.name === characterForm.mother && characterForm.mother) {
        list.push({id: relative.id, name: relative.name, relation: "Mother"});
      }
      if ((relative.father === characterForm.father && characterForm.father) || (relative.mother === characterForm.mother && characterForm.mother)) {
        list.push({id: relative.id, name: relative.name, relation: relative.gender === "Male"? "Brother" : "Sister"});
      }
      if ((relative.father === characterForm.name && characterForm.father) || (relative.mother === characterForm.name && characterForm.mother)) {
        list.push({id: relative.id, name: relative.name, relation: relative.gender === "Male" ? "Son" : "Daughter"});
      }
    });
    list.push(...relationships.map(rel => {
      const relativeId = rel.first_character === character?.id ? rel.second_character : rel.first_character;
      const relative = characters.find(c => c.id === relativeId);
      const marriage = rel.type === "Spouse" ? relative?.gender === "Male" ? "Husband" : "Wife" : rel.type;
      return {id: relativeId, name: relative?.name ?? "", relation: marriage};
    }));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [relatives, relationships, character, characters, characterForm]);

  const relationElements = {
    relationName: {
      label: "Name",
      value: relationForm.relationName,
      setValue: (value: string) => updateRelation("relationName", value),
      options: characters.filter(c => c.id !== Number(slug)).filter(c => !relationList.some(r => r.id === c.id)).map(c => c.name),
      defaultOption: "Select Character"
    },
    relationType: {
      label: "Type",
      value: relationForm.relationType,
      setValue: (value: string) => updateRelation("relationType", value),
      options: ["Spouse", "Lover"],
      defaultOption: "Select Type"
    }
  }

  const handleRelationSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("relationships").insert({
      first_character: character?.id,
      second_character: characters.find(c => c.name === relationForm.relationName)?.id,
      type: relationForm.relationType
    });
    setRelationForm({ relationName: "", relationType: "" });
    setRelationOpen(false);
  }

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

  return (
    <>
      <h2 className="mt-16 text-center">{character?.name}</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setCharacterOpen(true)}>Edit Character</button>
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setRelationOpen(true)}>Add Relation</button>
      </div>
      <section className="@container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Book className="h-8 w-auto" />Legend</h3>
        <article className="card grid grid-cols-1 @sm:grid-cols-[auto_1fr] @2xl:grid-cols-[auto_1fr_auto_1fr] items-center gap-4 text-center @sm:text-left font-body mt-8">
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
          {relationList.map(relative => (
            <Relation key={relative.name} data={relative} />
          ))}
        </article>
      </section>
      {character?.inspiration_id && <section className="space-y-8 @container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><ScrollText className="h-8 w-auto" />Inspiration</h3>
        <h3 className="text-center">{character?.inspirations.name}</h3>
        <article className="card grid grid-cols-1 @sm:grid-cols-[auto_1fr] @2xl:grid-cols-[auto_1fr_auto_1fr] items-center gap-4 text-center @sm:text-left font-body">
          {inspirationCategories.map(category => (
            <React.Fragment key={category.label}>
              <span className="font-semibold font-serif">{category.label}</span>
              <span className="flex justify-center @sm:justify-start">{category.value}</span>
            </React.Fragment>
          ))}
        </article>
        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myths.map(myth => (
            <MythSum key={myth.id} data={myth} />
          ))}
        </article>
      </section>}
      <Modal
        heading="Edit Character"
        open={characterOpen}
        setOpen={setCharacterOpen}
        elements={characterElements}
        handleSubmit={handleCharacterSubmit}
        disabled={characterForm.name.trim() === ""}
      />
      <Modal
        heading="Add Relation"
        open={relationOpen}
        setOpen={setRelationOpen}
        elements={relationElements}
        handleSubmit={handleRelationSubmit}
        disabled={relationForm.relationName === "" || relationForm.relationType === ""}
      />
    </>
  );
}