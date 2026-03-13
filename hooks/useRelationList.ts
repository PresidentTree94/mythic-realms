import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CharacterType } from "@/types/characterType";
import buildRelationList from "@/utils/buildRelationList";

export default function useRelationList(character: CharacterType | undefined, charForm: any) {

  const [relations, setRelations] = useState<{id: number, name: string, relation: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: relatives } = await supabase.from("fantasy_characters").select("*").neq("id", character?.id);
      const { data: relationships } = await supabase.from("relationships").select("*").or(`first_character.eq.${character?.id},second_character.eq.${character?.id}`);

      if (relatives && relationships) {
        const result = buildRelationList({character, charForm, relatives, relationships});
        setRelations(result);
      }
    }
    fetchData();
  }, [character, charForm]);

  return relations;
}