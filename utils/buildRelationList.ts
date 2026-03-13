import { CharacterType } from "@/types/characterType";

export default function buildRelationList({
  character, charForm, relatives, relationships
}:Readonly<{
  character: CharacterType | undefined,
  charForm: any,
  relatives: CharacterType[],
  relationships: { first_character: number, second_character: number, type: string }[]
}>) {

  const list: {id: number, name: string, relation: string}[] = [];

  relatives.forEach(relative => {
    // Parents
    if (relative.name === charForm.father && charForm.father) {
      list.push({id: relative.id, name: relative.name, relation: "Father"});
    }
    if (relative.name === charForm.mother && charForm.mother) {
      list.push({id: relative.id, name: relative.name, relation: "Mother"});
    }
    // Siblings
    if ((relative.father === charForm.father && relative.mother === charForm.mother) && (charForm.father || charForm.mother)) {
      list.push({
        id: relative.id,
        name: relative.name,
        relation: relative.gender === "Male"? "Brother" : "Sister"
      });
    }
    else if ((relative.father === charForm.father && charForm.father) || (relative.mother === charForm.mother && charForm.mother)) {
      list.push({
        id: relative.id,
        name: relative.name, 
        relation: relative.gender === "Male"? "Half-Brother" : "Half-Sister"
      });
    }
    // Children
    if ((relative.father === charForm.name || relative.mother === charForm.name) && charForm.name) {
      list.push({
        id: relative.id,
        name: relative.name, 
        relation: relative.gender === "Male" ? "Son" : "Daughter"
      });
    }
  });
  // Romantic relationships
  list.push(...relationships.map(rel => {
    const relativeId = rel.first_character === character?.id ? rel.second_character : rel.first_character;
    const relative = relatives.find(c => c.id === relativeId);
    const union = rel.type === "Spouse" ? relative?.gender === "Male" ? "Husband" : "Wife" : rel.type;
    return {id: relativeId, name: relative?.name ?? "", relation: union};
  }));
  return list.sort((a, b) => a.name.localeCompare(b.name));
}