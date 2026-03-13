"use client";
import { useState, useEffect } from "react";
import { Funnel } from "lucide-react";
import Character from "./Character";
import Modal from "../Modal";
import { useSearchParams } from "next/navigation";
import useCharacterData from "./useCharacterData";

export default function Characters() {

  const searchParams = useSearchParams();
  const inspirationId = searchParams.get("inspiration");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { characters, inspirations, territories, characterForm, handleSubmit, filterForm } = useCharacterData();

  useEffect(() => {
    if (inspirationId && inspirations.length > 0) {
      const data = inspirations.find(i => i.id === Number(inspirationId)); 
      if (data) {
        characterForm.updateMany({
          inspiration: data.name,
          inspirationLocation: data.location,
          inspirationMarkers: data.markers
        });
      }
      setOpenModal("character");
    }
  }, [inspirationId, inspirations]);

  const filteredCharacters = characters
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.inspirations.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => filterForm.form.kingdom === "All" ? true : territories.find(t => t.id === item.homeland_id)?.kingdoms.name === filterForm.form.kingdom || territories.find(t => t.id === item.residence_id)?.kingdoms.name === filterForm.form.kingdom)
    .filter(item => filterForm.form.homeland === "All" ? true : territories.find(t => t.id === item.homeland_id)?.name === filterForm.form.homeland)
    .filter(item => filterForm.form.residence === "All" ? true : territories.find(t => t.id === item.residence_id)?.name === filterForm.form.residence);

  return (
    <>
      <div className="mt-16 text-center">
        <h2>Dramatis Personae</h2>
        <p className="italic mt-4 font-semibold font-serif">"Heroes are not born; they are forged in the fires of tragedy and triumph."</p>
      </div>
      <div className="text-center">
        <button onClick={() => setOpenModal("character")} className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Character</button>
      </div>
      <div className="flex items-center gap-4">
        <input type="text" placeholder="Search by name or inspiration..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-background px-2 py-1 border border-border outline-none focus:border-secondary" />
        <details className="relative group">
          <summary className="flex items-center gap-2 bg-secondary text-background px-4 py-2 text-sm font-heading font-medium cursor-pointer group-open:bg-base"><Funnel className="h-4 w-auto" />Filter</summary>
          <div className="absolute right-0 top-13 z-1 card w-60 font-body space-y-4">
            {Object.entries(filterForm.elements).map(([key, filter]) => (
              <fieldset key={key} className="flex flex-col">
                <label className="font-serif font-semibold">{filter.label}</label>
                <select value={filter.value} onChange={(e) => filter.setValue(e.target.value)} className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary appearance-none">
                  {filter.options?.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </fieldset>
            ))}
          </div>
        </details>
      </div>
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredCharacters.map(character => (
          <Character key={character.id} data={{character, homeland: territories.find(t => t.id === character.homeland_id) ?? null, residence: territories.find(t => t.id === character.residence_id) ?? null}} />
        ))}
      </article>
      <Modal
        heading="Add Character"
        open={openModal === "character"}
        setOpen={setOpenModal}
        elements={characterForm.elements}
        reset={characterForm.reset}
        handleSubmit={handleSubmit}
        />
    </>
  );
}