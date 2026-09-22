import type { ColorCombination } from "./types/types";

export const COLOR_COMBINATIONS: ColorCombination[] = [
  {
    id: 1,
    name: "Blue",
    materialMap: {
      Nut: "Blue",
      NutHead: "Blue",
      Crimp: "Blue",
      Pipe: "Blue",
    },
  },
  {
    id: 2,
    name: "Black",
    materialMap: {
      Nut: "Black",
      NutHead: "Black",
      Crimp: "Black",
      Pipe: "Black",
    },
  },
  {
    id: 3,
    name: "Stainless Steel",
    materialMap: {
      Nut: "Stainless Steel",
      NutHead: "Stainless Steel",
      Crimp: "Stainless Steel",
      Pipe: "Stainless Steel",
    },
  },
  {
    id: 4,
    name: "Stainless Blue",
    materialMap: {
      Nut: "Blue",
      NutHead: "Stainless Steel",
      Crimp: "Stainless Steel",
      Pipe: "Stainless Steel",
    },
  },
  {
    id: 5,
    name: "Stainless Black",
    materialMap: {
      Nut: "Black",
      NutHead: "Stainless Steel",
      Crimp: "Stainless Steel",
      Pipe: "Stainless Steel",
    },
  },
];
