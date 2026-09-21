import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import type { MeshItem } from "../types/types";

export class ModelLoadManager {
  meshes: MeshItem[] = [];
  selectedMeshUuid: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  handleModelLoaded(clonedScene: THREE.Group) {
    const extractedMeshes: MeshItem[] = [];
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        extractedMeshes.push({
          uuid: child.uuid,
          name: child.name || "Unnamed_Mesh",
          ref: child as THREE.Mesh,
        });
      }
    });
    this.meshes = extractedMeshes;
  }

  handleRenameMesh(uuid: string, newName: string) {
    const meshItem = this.meshes.find((item) => item.uuid === uuid);
    if (meshItem) {
      meshItem.ref.name = newName;
      meshItem.name = newName;
    }
  }

  setSelectedMeshUuid(uuid: string | null) {
    this.selectedMeshUuid = uuid;
  }
}
