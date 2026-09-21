import type { ChangeEvent, RefObject } from "react";
import * as THREE from "three";

export interface ModelFile {
  id: string;
  name: string;
  url: string;
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
}
