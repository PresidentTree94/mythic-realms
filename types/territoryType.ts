export type TerritoryType = {
  id: number;
  name: string;
  counterpart: string;
  kingdom_id: number;
  kingdoms: {
    id: number;
    name: string;
  };
}