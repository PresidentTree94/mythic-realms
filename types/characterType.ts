import { InspirationType } from "./inspirationType";

export type CharacterType = {
  id: number;
  name: string;
  pronunciation: string;
  meaning: string;
  gender: string;
  markers: string[];
  status: string;
  father: string;
  mother: string;
  territory_id: number;
  inspiration_id: number;
  inspirations: InspirationType;
}