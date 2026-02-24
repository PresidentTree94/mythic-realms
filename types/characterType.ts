import { InspirationType } from "./inspirationType";

export type CharacterType = {
  id: number;
  name: string;
  pronunciation: string;
  gender: string;
  markers: string[];
  father: string;
  mother: string;
  territory_id: number;
  inspiration_id: number;
  inspirations: InspirationType;
}