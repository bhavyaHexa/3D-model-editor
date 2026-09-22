import type { RefObject } from "react";
import * as THREE from "three";

export interface ModelFile {
  id: string;
  name: string;
  url: string;
  colorCombination?: ColorCombination[];
}

export interface CrimpColor {
  id: number;
  name: string;
  colorCode: string;
  description: string;
}

export interface MeshItem {
  uuid: string;
  name: string;
  ref: THREE.Mesh;
}

export interface LoadedModelProps {
  url: string;
  onModelLoaded: (clonedScene: THREE.Group) => void;
  modelRef: RefObject<THREE.Group | null>;
  selectedMeshUuid: string | null;
  selectedMaterial: ColorCombination | null;
  selectedCrimpColor?: CrimpColor | null;
}

export interface ColorCombination {
  id: number;
  name: string;
  materialMap: Record<string, string>;
}
