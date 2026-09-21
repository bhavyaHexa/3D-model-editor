import type { ColorCombination } from "./types/types";

export const COLOR_COMBINATIONS: ColorCombination[] = [
  {
    id: 1,
    name: "Blue",
    meshMaterialMap: {
      Nut: "Blue",
      NutHead: "Blue",
      Crimp: "Blue",
      Pipe: "Blue",
    },
  },
  {
    id: 2,
    name: "Black",
    meshMaterialMap: {
      Nut: "Black",
      NutHead: "Black",
      Crimp: "Black",
      Pipe: "Black",
    },
  },
  {
    id: 3,
    name: "Stainless Steel",
    meshMaterialMap: {
      Nut: "Stainless Steel",
      NutHead: "Stainless Steel",
      Crimp: "Stainless Steel",
      Pipe: "Stainless Steel",
    },
  },
  {
    id: 4,
    name: "Stainless Blue",
    meshMaterialMap: {
      Nut: "Blue",
      NutHead: "Stainless Steel",
      Crimp: "Stainless Steel",
      Pipe: "Stainless Steel",
    },
  },
  {
    id: 5,
    name: "Stainless Black",
    meshMaterialMap: {
      Nut: "Black",
      NutHead: "Stainless Steel",
      Crimp: "Stainless Steel",
      Pipe: "Stainless Steel",
    },
  },
];
