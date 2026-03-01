"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Funnel } from "lucide-react";
import Character from "./Character";
import Modal from "../Modal";
import { CharacterType } from "@/types/characterType";
import { InspirationType } from "@/types/inspirationType";
import { TerritoryType } from "@/types/territoryType";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PANTHEON_MARKERS, INSPIRATION_MARKERS } from "@/utils/markers";
import useFormState from "@/hooks/useFormState";
import buildFormElements from "@/utils/buildFormElements";

export default function Characters() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const inspirationId = searchParams.get("inspiration");
  const [openModal, setOpenModal] = useState<string | null>(null);

  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [inspirations, setInspirations] = useState<InspirationType[]>([]);
  const [territories, setTerritories] = useState<TerritoryType[]>([]);

  const characterForm = useFormState({
    name: "",
    markers: [] as string[],
    inspiration: "",
    newInspiration: "",
    inspirationLocation: "",
    inspirationMarkers: [] as string[]
  });

  const filterForm = useFormState({
    search: "",
    kingdom: "All",
    homeland: "All",
    residence: "All"
  });

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: characters }, { data: inspirations }, { data: territories }] = await Promise.all([
        supabase.from("fantasy_characters").select("*, inspirations(name)").order("name", { ascending: true }),
        supabase.from("inspirations").select("*").order("name", { ascending: true }),
        supabase.from("territories").select("*, kingdoms(name)").order("name", { ascending: true })
      ]);
      setCharacters(characters ?? []);
      setInspirations(inspirations ?? []);
      setTerritories(territories ?? []);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (inspirationId && inspirations.length > 0) {
      const data = inspirations.find(i => i.id === Number(inspirationId)); 
      if (data) {
        characterForm.setForm({
          name: "",
          markers: [],
          inspiration: data.name,
          newInspiration: "",
          inspirationLocation: data.location,
          inspirationMarkers: data.markers
        });
      }
      setOpenModal("character");
    }
  }, [inspirationId, inspirations]);

  const elements = buildFormElements(characterForm.form, characterForm.update, {
    name: { label: "Name" },
    markers: {
      label: "Markers",
      options: Object.keys(PANTHEON_MARKERS)
    },
    inspiration: {
      label: "Inspiration",
      options: inspirations.map(i => i.name),
      defaultOption: "Select Inspiration"
    },
    newInspiration: { label: "New Inspiration" },
    inspirationLocation: { label: "Inspiration Location" },
    inspirationMarkers: {
      label: "Inspiration Markers",
      options: Object.keys(INSPIRATION_MARKERS)
    }
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let inspirationId: number | null = null;
    if (characterForm.form.inspiration !== "" || characterForm.form.newInspiration !== "") {
      const { data } = await supabase.from("inspirations").upsert({
        name: characterForm.form.inspiration ? characterForm.form.inspiration : characterForm.form.newInspiration.trim(),
        location: characterForm.form.inspirationLocation.trim(),
        markers: characterForm.form.inspirationMarkers
      }, { onConflict: "name"}).select().single();
      if (data) {
        inspirationId = data.id;
      }
    }
    await supabase.from("fantasy_characters").insert({
      name: characterForm.form.name.trim(),
      markers: characterForm.form.markers,
      inspiration_id: inspirationId
    })
    characterForm.reset();
    setOpenModal(null);
    router.replace("/characters");
  }

  const filters = buildFormElements(filterForm.form, filterForm.update, {
    kingdom: { label: "Kingdom", options: ["All", ...[...new Set(territories.map(t => t.kingdoms.name))].sort()] },
    homeland: { label: "Homeland", options: ["All", ...[...new Set(territories.map(t => t.name))]] },
    residence: { label: "Residence", options: ["All", ...[...new Set(territories.map(t => t.name))]] }
  });

  const filteredCharacters = characters
    .filter(c => c.name.toLowerCase().includes(filterForm.form.search.toLowerCase()) || c.inspirations.name.toLowerCase().includes(filterForm.form.search.toLowerCase()))
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
        <input type="text" placeholder="Search by name or inspiration..." value={filterForm.form.search} onChange={(e) => filterForm.update("search", e.target.value)} className="w-full bg-background px-2 py-1 border border-border outline-none focus:border-secondary" />
        <details className="relative group">
          <summary className="flex items-center gap-2 bg-secondary text-background px-4 py-2 text-sm font-heading font-medium cursor-pointer group-open:bg-base"><Funnel className="h-4 w-auto" />Filter</summary>
          <div className="absolute right-0 top-13 z-1 card w-60 font-body space-y-4">
            {Object.entries(filters).map(([key, filter]) => (
              <fieldset key={key} className="flex flex-col">
                <label className="font-serif font-semibold">{filter.label}</label>
                <select value={filter.value} onChange={(e) => filterForm.update(key as keyof typeof filterForm.form, e.target.value)} className="bg-background px-2 py-1 border border-border outline-none focus:border-secondary appearance-none">
                  {filter.options.map((option: string) => (
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
          <Character key={character.id} data={character} />
        ))}
      </article>
      <Modal
        heading="Add Character"
        open={openModal === "character"}
        setOpen={setOpenModal}
        elements={elements}
        handleSubmit={handleSubmit}
        disabled={characterForm.form.name.trim() === ""}
        />
    </>
  );
}