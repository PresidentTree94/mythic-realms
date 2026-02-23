export type KingdomType = {
  id: number;
  name: string;
  crest: string;
  government: string;
  counterparts: {
    id: number;
    name: string;
    type: string;
    founder: string;
    location: string;
    primary_gov: string;
    secondary_gov: string;
    economy: string;
    religion: string;
    kingdom_id: number;
  }[];
  territories: {
    id: number;
    name: string;
    counterpart: string;
    kingdom_id: number;
  }[];
}