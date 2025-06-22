export type LevelData = {
  bgColor: string;
  customFields?: Record<string, any>;
  entities: Record<string, Entity[]>;
  height: number;
  width: number;
  layers: LayerName[];
  x: number;
  y: number;
};

type EntityName = "spawn" | "star";

type Entity = {
  color: number;
  customFields: any;
  height: number;
  width: number;
  x: number;
  y: number;
  id: EntitiyName;
  iid: string;
  layer: LayerName;
};

type LayerName = "entities" | "background" | "foreground";
