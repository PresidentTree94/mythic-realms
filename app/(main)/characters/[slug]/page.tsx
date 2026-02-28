"use client";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { redirect, useParams } from "next/navigation";
import { CharacterType } from "@/types/characterType";
import { TerritoryType } from "@/types/territoryType";
import { MythType } from "@/types/mythType";
import { RelationType } from "@/types/relationType";
import { Book, Users, File, ScrollText, Send, Trash } from "lucide-react";
import Relation from "@/components/characterComps/Relation";
import MythSum from "@/components/MythSum";
import Modal from "@/components/Modal";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";
import { refresh } from "next/cache";

export default function CharacterPage() {

  const { slug } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const [character, setCharacter] = useState<CharacterType>();
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [relatives, setRelatives] = useState<CharacterType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);
  const [myths, setMyths] = useState<MythType[]>([]);
  const [relationships, setRelationships] = useState<RelationType[]>([]);

  const characterForm = useFormState({
    name: "",
    pronunciation: "",
    meaning: "",
    gender: "",
    markers: [] as string[],
    homeland: "",
    status: "",
    father: "",
    mother: "",
    notes: [] as string[]
  });
  const relation = useFormState({ relationName: "", relationType: "" });
  const inspiration = useFormState({ name: "", meaning: "", location: "", markers: [] as string[] });

  useEffect(() => {
    const fetchData = async () => {
      const [
        { data: characters },
        { data: relatives },
        { data: territories },
        { data: relationships }
      ] = await Promise.all([
        supabase.from("fantasy_characters").select("*, inspirations(*)").order("name", { ascending: true }),
        supabase.from("fantasy_characters").select("*").neq("id", slug),
        supabase.from("territories").select("*, kingdoms(name)").order("name", { ascending: true }),
        supabase.from("relationships").select("*").or(`first_character.eq.${slug},second_character.eq.${slug}`)
      ]);
      setCharacters(characters ?? []);
      setCharacter(characters?.find(c => c.id === Number(slug)));
      setRelatives(relatives ?? []);
      setTerritories(territories ?? []);
      setMyths(myths ?? []);
      setRelationships(relationships ?? []);
    }
    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: myths } = await supabase.from("myths").select("*, myth_insp!inner(*, inspirations (*))").eq("myth_insp.inspiration_id", character?.inspirations.id).order("title", { ascending: true });
      setMyths(myths ?? []);
    }
    fetchData();
  }, [character]);

  useEffect(() => {
    if (character) {
      characterForm.setForm({
        name: character.name,
        pronunciation: character.pronunciation,
        meaning: character.meaning,
        gender: character.gender,
        status: character.status,
        markers: character.markers,
        homeland: territories.find(t => t.id === character.territory_id)?.name ?? "",
        father: character.father,
        mother: character.mother,
        notes: character.notes
      });
      inspiration.setForm({
        name: character.inspirations.name,
        meaning: character.inspirations.meaning,
        location: character.inspirations.location,
        markers: character.inspirations.markers
      });
    }
  }, [character, territories]);

  const characterElements = buildFormElements(characterForm.form, characterForm.update, {
    name: { label: "Name" },
    pronunciation: { label: "Pronunciation" },
    meaning: { label: "Meaning" },
    gender: {
      label: "Gender",
      options: ["Male", "Female"],
      defaultOption: "Select Gender"
    },
    markers: {
      label: "Markers",
      options: Object.keys(PANTHEON_MARKERS)
    },
    homeland: {
      label: "Homeland",
      options: territories.map(t => t.name),
      defaultOption: "Select Homeland"
    },
    status: {
      label: "Status",
      options: characterForm.form.gender === "Male" ? ["King", "Prince", "Citizen"] : ["Queen", "Princess", "Citizen"],
      defaultOption: "Select Status"
    },
    father: { label: "Father" },
    mother: { label: "Mother" }
  });

  const handleCharacterSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("fantasy_characters").update({
      name: characterForm.form.name.trim(),
      pronunciation: characterForm.form.pronunciation.trim(),
      meaning: '"' + characterForm.form.meaning.trim() + '"',
      gender: characterForm.form.gender,
      status: characterForm.form.status,
      markers: characterForm.form.markers,
      territory_id: territories.find(t => t.name === characterForm.form.homeland)?.id,
      father: characterForm.form.father.trim(),
      mother: characterForm.form.mother.trim()
    }).eq("id", slug);
    characterForm.reset();
    setOpenModal(null);
  }

  const relationList = useMemo(() => {
    const list: {id: number, name: string, relation: string}[] = [];
    relatives.forEach(relative => {
      if (relative.name === characterForm.form.father && characterForm.form.father) {
        list.push({id: relative.id, name: relative.name, relation: "Father"});
      }
      if (relative.name === characterForm.form.mother && characterForm.form.mother) {
        list.push({id: relative.id, name: relative.name, relation: "Mother"});
      }
      if ((relative.father === characterForm.form.father && characterForm.form.father) || (relative.mother === characterForm.form.mother && characterForm.form.mother)) {
        list.push({id: relative.id, name: relative.name, relation: relative.gender === "Male"? "Brother" : "Sister"});
      }
      if (((relative.father === characterForm.form.name) || relative.mother === characterForm.form.name) && characterForm.form.name) {
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
  }, [relatives, relationships, character, characters, characterForm.form]);

  const relationElements = buildFormElements(relation.form, relation.update, {
    relationName: {
      label: "Name",
      options: characters.filter(c => c.id !== Number(slug)).filter(c => !relationList.some(r => r.id === c.id)).map(c => c.name),
      defaultOption: "Select Character"
    },
    relationType: {
      label: "Type",
      options: ["Spouse", "Lover"],
      defaultOption: "Select Type"
    }
  });

  const handleRelationSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("relationships").insert({
      first_character: character?.id,
      second_character: characters.find(c => c.name === relation.form.relationName)?.id,
      type: relation.form.relationType
    });
    relation.reset();
    setOpenModal(null);
  }

  const inspirationElements = buildFormElements(inspiration.form, inspiration.update, {
    name: { label: "Name" },
    meaning: { label: "Meaning" },
    location: { label: "Location" },
    markers: {
      label: "Markers",
      options: Object.keys(INSPIRATION_MARKERS)
    }
  });

  const handleInspirationSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("inspirations").update({
      name: inspiration.form.name.trim(),
      meaning: inspiration.form.meaning.trim(),
      location: inspiration.form.location,
      markers: inspiration.form.markers
    }).eq("id", character?.inspiration_id);
    inspiration.reset();
    setOpenModal(null);
  }

  const handleNotesSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await supabase.from("fantasy_characters").update({
      notes: [...(character?.notes ?? []), note.trim()]
    }).eq("id", slug);
    setNote("");
    window.location.reload();
  }

  const handleNoteDelete = async (index: number) => {
    if (character) {
      const updatedNotes = [...character.notes];
      updatedNotes.splice(index, 1);
      await supabase.from("fantasy_characters").update({
        notes: updatedNotes
      }).eq("id", slug);
    }
    window.location.reload();
  }

  const characterCategories = [
    {label: "Pronunciation", value: character?.pronunciation},
    {label: "Meaning", value: character?.meaning},
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
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setOpenModal("character")}>Edit Character</button>
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setOpenModal("relation")}>Add Relation</button>
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
      <section className="font-body">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><File className="h-8 w-auto" />Notes</h3>
        <form className="flex items-center gap-2 my-8" onSubmit={handleNotesSubmit}>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a character note..." className="flex-1 card px-4 py-2 outline-none focus:border-secondary" />
          <button className="bg-primary flex justify-center items-center h-10 w-10 cursor-pointer"><Send className="h-4 w-auto text-background" /></button>
        </form>
        <div className="space-y-4">
          {character?.notes.map((note, index) => (
            <p key={index} className="card p-4 flex items-center justify-between gap-2">{note}<Trash className="h-4 w-auto shrink-0 cursor-pointer" onClick={() => handleNoteDelete(index)}/></p>
          ))}
        </div>
      </section>
      {character?.inspiration_id && <section className="space-y-8 @container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><ScrollText className="h-8 w-auto" />Inspiration</h3>
        <h3 className="text-center">{character?.inspirations.name}</h3>
        <div className="text-center">
          <button className="bg-primary text-background text-lg font-medium font-heading px-4 py-2 cursor-pointer" onClick={() => setOpenModal("inspiration")}>Edit Inspiration</button>
        </div>
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
        open={openModal === "character"}
        setOpen={setOpenModal}
        elements={characterElements}
        handleSubmit={handleCharacterSubmit}
        disabled={characterForm.form.name.trim() === ""}
      />
      <Modal
        heading="Add Relation"
        open={openModal === "relation"}
        setOpen={setOpenModal}
        elements={relationElements}
        handleSubmit={handleRelationSubmit}
        disabled={relation.form.relationName === "" || relation.form.relationType === ""}
      />
      <Modal
        heading="Edit Inspiration"
        open={openModal === "inspiration"}
        setOpen={setOpenModal}
        elements={inspirationElements}
        handleSubmit={handleInspirationSubmit}
        disabled={inspiration.form.name.trim() === ""}
      />
    </>
  );
}