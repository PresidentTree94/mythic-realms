import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MythType } from "@/types/mythType";
import { getMyths } from "@/lib/data/mythQueries";
import { useForm } from "@presidenttree94/form-utils";

export default function useMythData() {

  const [myths, setMyths] = useState<MythType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const mythData = await getMyths();
      const sorted = mythData?.map(myth => ({...myth,
        myth_insp: myth.myth_insp.sort((a: any, b: any) => a.inspirations.name.localeCompare(b.inspirations.name))
      })).sort((a, b) => a.title.localeCompare(b.title));
      setMyths(sorted);
    }
    fetchData();
  }, []);

  const mythForm = useForm(
    { 
      title: "",
      subtitle: "",
      summary: ""
    },
    {
      title: { label: "Title", required: true },
      subtitle: { label: "Subtitle" },
      summary: { label: "Summary" }
    }
  );
  
  const handleSubmit = async () => {
    await supabase.from("myths").insert({ title: mythForm.form.title.trim(), subtitle: mythForm.form.subtitle.trim(), summary: mythForm.form.summary.trim() });
  }

  return { myths, mythForm, handleSubmit };
}