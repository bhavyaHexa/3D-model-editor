import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { LoadedModelProps } from "../../types/types";
import materialPaths from "../../data/materials.json";

function extractMaterial(gltf: any): THREE.Material | null {
  let material: THREE.Material | null = null;
  gltf.scene.traverse((child: any) => {
    if (!material && child.isMesh && child.material) {
      material = child.material;
    }
  });
  return material;
}

export function LoadedModel({
  url,
  onModelLoaded,
  modelRef,
  selectedMeshUuid,
  selectedMaterial,
}: LoadedModelProps) {
  const { scene } = useGLTF(url);

  // Load the material GLBs
  const blueGltf = useGLTF(materialPaths.Blue as string);
  const blackGltf = useGLTF(materialPaths.Black as string);
  const stainlessGltf = useGLTF(materialPaths["Stainless Steel"] as string);

  // Extract materials once
  const materialLookup = useMemo(() => {
    return {
      "Blue": extractMaterial(blueGltf),
      "Black": extractMaterial(blackGltf),
      "Stainless Steel": extractMaterial(stainlessGltf),
    };
  }, [blueGltf, blackGltf, stainlessGltf]);

  useEffect(() => {
    if (scene) {
      (modelRef as React.MutableRefObject<typeof scene>).current = scene;
      onModelLoaded(scene);
      // Dispatch custom event to notify camera controller
      window.dispatchEvent(new CustomEvent("model-loaded"));
    }
  }, [scene, onModelLoaded, modelRef]);

  useEffect(() => {
    if (scene && selectedMaterial) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mappedColorName = selectedMaterial.meshMaterialMap[mesh.name];

          if (mappedColorName) {
            // Check lookup dictionary
            const targetMaterial = materialLookup[mappedColorName as keyof typeof materialLookup];
            if (targetMaterial) {
              // Apply the extracted authentic material directly
              mesh.material = targetMaterial;
            }
          }
        }
      });
    }
  }, [scene, selectedMaterial, materialLookup]);

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

// @ts-ignore
useGLTF.preload(materialPaths.Blue as string);
// @ts-ignore
useGLTF.preload(materialPaths.Black as string);
// @ts-ignore
useGLTF.preload(materialPaths["Stainless Steel"] as string);
