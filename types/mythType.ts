import { InspirationType } from "./inspirationType";

export type MythType = {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  myth_insp: {
    myth_id: number;
    inspiration_id: number;
    contribution: string;
    inspirations: InspirationType;
  }[];
}