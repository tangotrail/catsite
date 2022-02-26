export interface Genome {
  species?: Species;
  wind?: Wind[];
  furtype?: Furtype[];
  color?: (Color | number)[];
  pattern?: Pattern[];
  whitespotting?: (Whitespotting | number)[];
  growth?: Growth[];
}

export enum Species {
  NOTCAT = "C",
}

export enum Wind {
  NORTH = "N",
  SOUTH = "S",
  NULL = "O",
  TRADE = "Trade",
}

export enum Furtype {
  SHORT = "S",
  LONG = "L",
}

export enum Color {
  BLACK = "B",
  ORANGE = "O",
  FULL = "F",
  DILUTE = "D",
}

export enum Pattern {
  YES = "Y",
  NO = "N",
  STRIPE = "T",
  SPOT = "S",
  MARBLE = "M",
  POINTED = "P",
}

export enum Whitespotting {
  YES = "Y",
  NO = "N",
  CLASSIC = "C",
}

export enum Growth {
  A = "A",
  B = "B",
  C = "C",
}

export const Traits: string[] = [
  "Species",
  "Wind",
  "Fur type",
  "Color",
  "Pattern",
  "White spotting",
  "Growth",
];

export const colorMap: Map<string, string> = new Map([
  [`${Color.BLACK}, ${Color.FULL}, 4`, "Black"],
  [`${Color.BLACK}, ${Color.FULL}, 3`, "Chocolate"],
  [`${Color.BLACK}, ${Color.FULL}, 2`, "Brown"],
  [`${Color.BLACK}, ${Color.FULL}, 1`, "Tan"],
  [`${Color.BLACK}, ${Color.DILUTE}, 4`, "Charcoal"],
  [`${Color.BLACK}, ${Color.DILUTE}, 3`, "Grey"],
  [`${Color.BLACK}, ${Color.DILUTE}, 2`, "Smoke"],
  [`${Color.BLACK}, ${Color.DILUTE}, 1`, "Silver"],

  [`${Color.ORANGE}, ${Color.FULL}, 4`, "Red"],
  [`${Color.ORANGE}, ${Color.FULL}, 3`, "Ginger"],
  [`${Color.ORANGE}, ${Color.FULL}, 2`, "Orange"],
  [`${Color.ORANGE}, ${Color.FULL}, 1`, "Apricot"],
  [`${Color.ORANGE}, ${Color.DILUTE}, 4`, "Buff"],
  [`${Color.ORANGE}, ${Color.DILUTE}, 3`, "Cream"],
  [`${Color.ORANGE}, ${Color.DILUTE}, 2`, "Almond"],
  [`${Color.ORANGE}, ${Color.DILUTE}, 1`, "Beige"],
]);

export const patternMap: Map<string, string> = new Map([
  [`${Pattern.STRIPE}, ${Pattern.STRIPE}`, "Mackerel"],
  [`${Pattern.STRIPE}, ${Pattern.SPOT}`, "Broken"],
  [`${Pattern.STRIPE}, ${Pattern.MARBLE}`, "Classic"],
  [`${Pattern.STRIPE}, ${Pattern.POINTED}`, "Lynxpoint"],

  [`${Pattern.SPOT}, ${Pattern.STRIPE}`, "Broken"],
  [`${Pattern.SPOT}, ${Pattern.SPOT}`, "Spotted"],
  [`${Pattern.SPOT}, ${Pattern.MARBLE}`, "Rosette"],
  [`${Pattern.SPOT}, ${Pattern.POINTED}`, "Mink"],

  [`${Pattern.MARBLE}, ${Pattern.STRIPE}`, "Classic"],
  [`${Pattern.MARBLE}, ${Pattern.SPOT}`, "Rosette"],
  [`${Pattern.MARBLE}, ${Pattern.MARBLE}`, "Clouded"],
  [`${Pattern.MARBLE}, ${Pattern.POINTED}`, "Cloudpoint"],

  [`${Pattern.POINTED}, ${Pattern.STRIPE}`, "Lynxpoint"],
  [`${Pattern.POINTED}, ${Pattern.SPOT}`, "Mink"],
  [`${Pattern.POINTED}, ${Pattern.MARBLE}`, "Cloudpoint"],
  [`${Pattern.POINTED}, ${Pattern.POINTED}`, "Colorpoint"],
]);

export const whitespottingMap: Map<number, string> = new Map([
  [0, "None"],
  [1, "Locket"],
  [2, "Locket & Toes"],
  [3, "Bib & Boots"],
  [4, "Bib, Boots, & Belly"],
  [5, "Classic Bicolor"],
  [6, "Piebald"],
  [7, "Spotted Piebald"],
  [8, "Freckled Piebald"],
  [9, "Van"],
  [10, "Albino"],
]);

export const growthMap: Map<string, string> = new Map([
  [`${Growth.A}, ${Growth.A}`, "Very Early"],
  [`${Growth.A}, ${Growth.B}`, "Early"],
  [`${Growth.A}, ${Growth.C}`, "Decreasing"],

  [`${Growth.B}, ${Growth.A}`, "Arch"],
  [`${Growth.B}, ${Growth.B}`, "Steady"],
  [`${Growth.B}, ${Growth.C}`, "Dip"],

  [`${Growth.C}, ${Growth.A}`, "Very Late"],
  [`${Growth.C}, ${Growth.B}`, "Late"],
  [`${Growth.C}, ${Growth.C}`, "Increasing"],
]);
