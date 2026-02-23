"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { KingdomType } from "@/types/kingdomType";
import { Users, MapPin, Map } from "lucide-react";
import Counterpart from "@/components/Counterpart";
import Modal from "@/components/Modal";

export default function KingdomPage() {

  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [kingdom, setKingdom] = useState<KingdomType>();
  const [name, setName] = useState("");
  const [crest, setCrest] = useState("");
  const [government, setGovernment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("kingdoms").select(`*, counterparts(*)`).eq("id", slug).single();
      setKingdom(data);
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
    setOpen(false);
  }

  return (
    <>
      <h2 className="mt-16 text-center">{kingdom?.name}</h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer" onClick={() => setOpen(true)}>Edit Kingdom</button>
        <button className="bg-primary text-background text-lg font-medium font-heading px-8 py-4 cursor-pointer">Add Territory</button>
      </div>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Users className="h-8" />Notable Residents</h3>
      </section>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><MapPin className="h-8" />Key Locations</h3>
      </section>
      <section>
        <h3 className="font-medium border-b-2 border-primary pb-2 flex items-center gap-2"><Map className="h-8" />Counterparts</h3>
        <article className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {greek && <Counterpart data={greek} />}
          {medieval && <Counterpart data={medieval} />}
        </article>
      </section>
      <Modal
        heading="Edit Kingdom"
        open={open}
        setOpen={setOpen}
        elements={kingdomElements}
        handleSubmit={handleKingdomSubmit}
        disabled={name.trim() === ""}
      />
    </>
  );
}