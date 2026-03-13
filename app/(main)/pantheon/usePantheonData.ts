import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DeityType } from "@/types/deityType";
import { useForm } from "@presidenttree94/form-utils";

export default function usePantheonData() {

  const [deities, setDeities] = useState<DeityType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("deities").select("*").order("patron", { ascending: true });
      setDeities(data ?? []);
    }
    fetchData();
  }, []);

  const deityForm = useForm(
    {
      patron: "",
      representations: "",
      blessing: "",
      description: ""
    },
    {
      patron: { label: "Patron", required: true },
      representations: { label: "Representations" },
      blessing: { label: "Blessing" },
      description: { label: "Description" }
    }
  );

  const handleSubmit = async () => {
    await supabase.from("deities").insert({
      patron: deityForm.form.patron.trim(),
      representations: deityForm.form.representations.trim(),
      blessing: deityForm.form.blessing.trim(),
      description: deityForm.form.description.trim()
    })
  };

  return { deities, deityForm, handleSubmit };
}