import type { Unit } from "./types";

export const UNITS: Unit[] = [
  { id: "life-in-paradise", name: "Life in Paradise" },
  { id: "island-time", name: "Island Time" },
  { id: "coastal-keys", name: "Coastal Keys" },
  { id: "summit-stays", name: "Summit Stays" },
  { id: "blue-harbor", name: "Blue Harbor" },
  { id: "desert-bloom", name: "Desert Bloom" },
  { id: "pine-and-peak", name: "Pine & Peak" },
  { id: "lakeside-collective", name: "Lakeside Collective" },
  { id: "sunset-shores", name: "Sunset Shores" },
  { id: "urban-nest", name: "Urban Nest" },
  { id: "mountain-modern", name: "Mountain Modern" },
  { id: "vista-verde", name: "Vista Verde" },
  { id: "harborline", name: "Harborline" },
];

export const DEFAULT_UNIT_ID = "life-in-paradise";

export function getUnit(unitId: string): Unit {
  return UNITS.find((u) => u.id === unitId) ?? UNITS[0];
}

const MONOGRAM_STOPWORDS = new Set(["&", "the", "in", "of", "and"]);

export function unitInitials(name: string): string {
  const parts = name.split(/\s+/).filter((p) => !MONOGRAM_STOPWORDS.has(p.toLowerCase()));
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
