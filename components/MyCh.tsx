"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MyChar } from "../types/myChar";

export default function MyCh({ data }: { data: MyChar }) {

  const [inspiration, setInspiration] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const { data: character } = await supabase.from("characters").select("*").eq("id", data.char_id).single();
      setInspiration(character?.inspiration ?? "");
    }
    fetchData();
  }, [data.char_id]);

  return (
    <div className="card pt-0 overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <h3 className="mt-6">{inspiration}</h3>
      <p className="font-serif">{data.contribution}</p>
    </div>
  );
}