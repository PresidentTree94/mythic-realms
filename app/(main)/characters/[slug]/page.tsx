"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Book, Users, ScrollText } from "lucide-react";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";
import Relation from "@/components/characterComps/Relation";
import MythSum from "@/components/mythComps/MythSum";
import Overview from "@/components/Overview";
import Notes from "@/components/Notes";
import Modal from "@/components/Modal";
import useCharacterData from "./useCharacterData";

export default function CharacterPage() {

  const { slug } = useParams();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const {
    character,
    territories,
    myths,
    characterForm,
    handleCharacterSubmit,
    handleCharacterDelete,
    relationForm,
    relationList,
    handleRelationSubmit,
    inspirationForm,
    handleInspirationSubmit
  } = useCharacterData(Number(slug));

  useEffect(() => {
    if (character) {
      characterForm.updateMany({
        name: character.name,
        pronunciation: character.pronunciation,
        meaning: character.meaning,
        gender: character.gender,
        status: character.status,
        markers: character.markers,
        homeland: territories.find(t => t.id === character.homeland_id)?.name ?? "",
        residence: territories.find(t => t.id === character.residence_id)?.name ?? "",
        father: character.father,
        mother: character.mother,
      });
      inspirationForm.updateMany({
        name: character.inspirations.name,
        meaning: character.inspirations.meaning,
        tagline: character.inspirations.tagline,
        location: character.inspirations.location,
        markers: character.inspirations.markers
      });
    }
  }, [character, territories]);

  const characterCategories = [
    {label: "Pronunciation", value: character?.pronunciation},
    {label: "Meaning", value: character?.meaning},
    {label: "Gender", value: character?.gender},
    {label: "Markers", value: character?.markers.map(marker => {
      const Icon = PANTHEON_MARKERS[marker];
      return Icon ? <Icon key={marker} className="h-5 w-auto text-secondary" /> : null;
    })},
    {label: "Homeland", value: `${territories.find(t => t.id === character?.homeland_id)?.name ?? ""}, ${territories.find(t => t.id === character?.homeland_id)?.kingdoms.name ?? ""}`},
    {label: "Residence", value: `${territories.find(t => t.id === character?.residence_id)?.name ?? ""}, ${territories.find(t => t.id === character?.residence_id)?.kingdoms.name ?? ""}`},
    {label: "Status", value: character?.status},
    {label: "Relationships", value: relationList.length}
  ];

  const inspirationCategories = [
    {label: "Meaning", value: character?.inspirations.meaning},
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
        <Overview categories={characterCategories} />
      </section>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Users className="h-8 w-auto" />Lineage & Kin</h3>
        <article className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {relationList.map(relative => (
            <Relation key={relative.name} data={relative} />
          ))}
        </article>
      </section>
      <Notes table="characters" id={Number(slug)} data={character} />
      {character?.inspiration_id && <section className="space-y-8 @container">
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><ScrollText className="h-8 w-auto" />Inspiration</h3>
        <h3 className="text-center">{character?.inspirations.name}</h3>
        <div className="text-center">
          <button className="bg-primary text-background text-lg font-medium font-heading px-4 py-2 cursor-pointer" onClick={() => setOpenModal("inspiration")}>Edit Inspiration</button>
        </div>
        {character.inspirations.tagline && <p className="card font-serif italic text-center">{character?.inspirations.tagline}</p>}
        <Overview categories={inspirationCategories} />
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
        elements={characterForm.elements}
        reset={characterForm.reset}
        handleSubmit={handleCharacterSubmit}
        handleDelete={handleCharacterDelete}
      />
      <Modal
        heading="Add Relation"
        open={openModal === "relation"}
        setOpen={setOpenModal}
        elements={relationForm.elements}
        reset={relationForm.reset}
        handleSubmit={handleRelationSubmit}
      />
      <Modal
        heading="Edit Inspiration"
        open={openModal === "inspiration"}
        setOpen={setOpenModal}
        elements={inspirationForm.elements}
        reset={inspirationForm.reset}
        handleSubmit={handleInspirationSubmit}
      />
    </>
  );
}