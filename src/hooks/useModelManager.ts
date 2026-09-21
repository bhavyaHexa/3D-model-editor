import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import * as THREE from "three";
import type {
  ModelFile,
  MeshItem,
  TransformMode,
  UseModelManagerReturn,
} from "../types/types";
import { extractGltfFiles } from "../utils/fileUtils";

export function useModelManager(): UseModelManagerReturn {
  const [modelFiles, setModelFiles] = useState<ModelFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelFile | null>(null);
  const [meshes, setMeshes] = useState<MeshItem[]>([]);
  const [selectedMeshUuid, setSelectedMeshUuid] = useState<string | null>(null);
  const [transformMode, setTransformMode] =
    useState<TransformMode>("translate");

  const handleFolderUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;
      const extracted = extractGltfFiles(event.target.files);
      setModelFiles(extracted);
      if (extracted.length > 0) {
        setSelectedModel(extracted[0]);
      }
    },
    [],
  );

  const handleModelLoaded = useCallback((clonedScene: THREE.Group) => {
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
    setMeshes(extractedMeshes);
  }, []);

  const handleRenameMesh = useCallback((uuid: string, newName: string) => {
    setMeshes((prev) =>
      prev.map((item) => {
        if (item.uuid === uuid) {
          item.ref.name = newName;
          return { ...item, name: newName };
        }
        return item;
      }),
    );
  }, []);

  return {
    modelFiles,
    selectedModel,
    setSelectedModel,
    meshes,
    transformMode,
    setTransformMode,
    handleFolderUpload,
    handleModelLoaded,
    handleRenameMesh,
    selectedMeshUuid,
    setSelectedMeshUuid,
  };
}
