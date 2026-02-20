"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Kingdom from "@/components/Kingdom";
import { King } from "@/types/king";
import Grid from "@/components/Grid";
import Modal from "@/components/Modal";

export default function Kingdoms() {

  const [open, setOpen] = useState(false);
  const [kingdoms, setKingdoms] = useState<King[]>([]);
  const [name, setName] = useState("");
  const [crest, setCrest] = useState("");
  const [government, setGovernment] = useState("");
  const [greek, setGreek] = useState("");
  const [greekFounder, setGreekFounder] = useState("");
  const [greekLocation, setGreekLocation] = useState("");
  const [medieval, setMedieval] = useState("");
  const [medievalFounder, setMedievalFounder] = useState("");
  const [medievalLocation, setMedievalLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("kingdoms").select(`*, counterparts(*)`).order("name", { ascending: true });
      setKingdoms(data ?? []);
    }
    fetchData();
  }, []);

  const elements = {
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
    },
    greek: {
      label: "Greek",
      value: greek,
      setValue: setGreek
    },
    medieval: {
      label: "Medieval",
      value: medieval,
      setValue: setMedieval
    },
    greekFounder: {
      label: "Founder",
      value: greekFounder,
      setValue: setGreekFounder
    },
    greekLocation: {
      label: "Location",
      value: greekLocation,
      setValue: setGreekLocation
    },
    medievalFounder: {
      label: "Founder",
      value: medievalFounder,
      setValue: setMedievalFounder
    },
    medievalLocation: {
      label: "Location",
      value: medievalLocation,
      setValue: setMedievalLocation
    }
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { data: kingdom } = await supabase.from("kingdoms").insert({ name: name.trim(), crest: crest.trim(), government: government.trim() }).select().single();
    await supabase.from("counterparts").insert({ name: greek.trim(), type: "Greek", founder: greekFounder.trim(), location: greekLocation.trim(), kingdom_id: kingdom?.id ?? 0 }).select().single();
    await supabase.from("counterparts").insert({ name: medieval.trim(), type: "Medieval", founder: medievalFounder.trim(), location: medievalLocation.trim(), kingdom_id: kingdom?.id ?? 0 }).select().single();
    setName("");
    setCrest("");
    setGovernment("");
    setGreek("");
    setGreekFounder("");
    setGreekLocation("");
    setMedieval("");
    setMedievalFounder("");
    setMedievalLocation("");
    setOpen(false);
  }

  return (
    <Grid
      title="Realms & Echoes"
      quote="History does not repeat itself, but it rhymes. See how the great city-states of old have been reborn in steel and stone."
      button={{ label: "Add Kingdom", onClick: () => setOpen(true) }}
      gridStyle=""
      data={kingdoms}
      dataComponent={Kingdom}>
        <Modal
          heading="Add New Kingdom"
          open={open}
          setOpen={setOpen}
          elements={elements}
          handleSubmit={handleSubmit}
          disabled={name.trim() === ""}
        />
    </Grid>
  );
}

/*
<>
  <div className="mt-16 text-center">
    <h2>Realms & Echoes</h2>
    <p className="italic mt-4 font-semibold font-serif">"History does not repeat itself, but it rhymes. See how the great city-states of old have been reborn in steel and stone."</p>
  </div>
  <article className="space-y-8">
  </article>
</>
*/