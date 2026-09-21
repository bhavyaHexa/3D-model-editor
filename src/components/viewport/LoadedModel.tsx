import { useEffect, useState } from "react";
import { useGLTF, TransformControls } from "@react-three/drei";
import * as THREE from "three";
import type { LoadedModelProps } from "../../types/types";

export function LoadedModel({
  url,
  transformMode,
  onModelLoaded,
  modelRef,
  selectedMeshUuid,
}: LoadedModelProps) {
  const { scene } = useGLTF(url);
  const [selectedMesh, setSelectedMesh] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (scene) {
      const clonedScene = scene.clone(true);
      (modelRef as React.MutableRefObject<typeof clonedScene>).current =
        clonedScene;
      onModelLoaded(clonedScene);
      // Dispatch custom event to notify camera controller
      window.dispatchEvent(new CustomEvent("model-loaded"));
    }
  }, [scene, url, onModelLoaded, modelRef]);

  useEffect(() => {
    if (modelRef.current) {
      // First, remove any existing outlines
      modelRef.current.traverse((child) => {
        const outline = child.children.find((c) => c.userData.isOutline);
        if (outline) {
          child.remove(outline);
          if ((outline as THREE.LineSegments).geometry) {
            (outline as THREE.LineSegments).geometry.dispose();
          }
          if ((outline as THREE.LineSegments).material) {
            ((outline as THREE.LineSegments).material as THREE.Material).dispose();
          }
        }
      });

      let found: THREE.Object3D | null = null;
      if (selectedMeshUuid) {
        modelRef.current.traverse((child) => {
          if (child.uuid === selectedMeshUuid) {
            found = child;
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              
              // Create an orange wireframe/edges highlight
              const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
              const edgesMaterial = new THREE.LineBasicMaterial({
                color: 0xf97316, // Orange
                linewidth: 2,
                depthTest: false, // Ensures it draws over the mesh
                transparent: true,
              });
              const outlineLine = new THREE.LineSegments(edgesGeometry, edgesMaterial);
              outlineLine.userData.isOutline = true;
              mesh.add(outlineLine);
            }
          }
        });
      }
      setSelectedMesh(found);
    }
  }, [selectedMeshUuid, modelRef]);

  if (!modelRef.current) return null;

  return (
    <>
      <TransformControls mode={transformMode}>
        <primitive object={modelRef.current} />
      </TransformControls>
    </>
  );
}
