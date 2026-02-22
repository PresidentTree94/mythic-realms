import { InspirationType } from "./inspirationType";

export type CharacterType = {
  id: number;
  name: string;
  pronunciation: string;
  gender: string;
  markers: string[];
  inspiration_id: number;
  inspirations: InspirationType;
}