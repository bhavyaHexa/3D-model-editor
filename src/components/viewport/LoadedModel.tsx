import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { LoadedModelProps } from "../../types/types";

export function LoadedModel({
  url,
  onModelLoaded,
  modelRef,
  selectedMeshUuid,
}: LoadedModelProps) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (scene) {
      (modelRef as React.MutableRefObject<typeof scene>).current = scene;
      onModelLoaded(scene);
      // Dispatch custom event to notify camera controller
      window.dispatchEvent(new CustomEvent("model-loaded"));
    }
  }, [scene, onModelLoaded, modelRef]);

  useEffect(() => {
    if (scene) {
      // First, remove any existing outlines
      scene.traverse((child) => {
        const outline = child.children.find((c) => c.userData.isOutline);
        if (outline) {
          child.remove(outline);
          if ((outline as THREE.LineSegments).geometry) {
            (outline as THREE.LineSegments).geometry.dispose();
          }
          if ((outline as THREE.LineSegments).material) {
            (
              (outline as THREE.LineSegments).material as THREE.Material
            ).dispose();
          }
        }
      });


      if (selectedMeshUuid) {
        scene.traverse((child) => {
          if (child.uuid === selectedMeshUuid) {

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
              const outlineLine = new THREE.LineSegments(
                edgesGeometry,
                edgesMaterial,
              );
              outlineLine.userData.isOutline = true;
              mesh.add(outlineLine);
            }
          }
        });
      }
    }
  }, [selectedMeshUuid, scene]);

  return (
    <>
      <primitive object={scene} />
    </>
  );
}
