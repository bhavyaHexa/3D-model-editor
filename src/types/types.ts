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

export interface HeaderProps {
  hasModel: boolean;
}

export interface ModelSidebarProps {
  modelFiles: ModelFile[];
  selectedModel: ModelFile | null;
  onSelectModel: (model: ModelFile) => void;
  onFolderUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface MeshInspectorProps {
  meshes: MeshItem[];
  onRenameMesh: (uuid: string, newName: string) => void;
  selectedMeshUuid: string | null;
  onSelectMesh: (uuid: string) => void;
}

export interface ViewportCanvasProps {
  modelUrl?: string;
  onModelLoaded: (clonedScene: THREE.Group) => void;
  modelRef: RefObject<THREE.Group | null>;
  selectedMeshUuid: string | null;
}

export interface LoadedModelProps {
  url: string;
  onModelLoaded: (clonedScene: THREE.Group) => void;
  modelRef: RefObject<THREE.Group | null>;
  selectedMeshUuid: string | null;
}

export interface UseModelManagerReturn {
  modelFiles: ModelFile[];
  selectedModel: ModelFile | null;
  setSelectedModel: (model: ModelFile | null) => void;
  meshes: MeshItem[];
  handleFolderUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  handleModelLoaded: (clonedScene: THREE.Group) => void;
  handleRenameMesh: (uuid: string, newName: string) => void;
  selectedMeshUuid: string | null;
  setSelectedMeshUuid: (uuid: string | null) => void;
}
