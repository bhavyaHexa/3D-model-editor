import { useEffect, useMemo, memo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { LoadedModelProps } from "../../types/types";
import materialsDataRaw from "../../data/materials.json";

const materialsData = materialsDataRaw.materials;

interface SubMeshProps {
  node: THREE.Mesh;
  selectedMaterial: any;
  selectedCrimpColor: any;
  isSelected: boolean;
  baseMaterial: THREE.Material | null;
}

const SubMeshMaterialLoader = memo(
  ({
    node,
    selectedMaterial,
    selectedCrimpColor,
    isSelected,
    baseMaterial,
  }: SubMeshProps) => {
    const isCrimpMesh = node.name === "Crimp";

    const mappedColorName = selectedMaterial
      ? selectedMaterial.materialMap[node.name]
      : null;

    const matItem = mappedColorName
      ? materialsData.find(
          (m) => m.name.toLowerCase() === mappedColorName.toLowerCase(),
        )
      : null;

    const highlightMaterial = useMemo(() => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xf97316),
        roughness: 0.2,
        metalness: 0.8,
      });
    }, []);

    const activeMaterial = useMemo(() => {
      if (isSelected) {
        return highlightMaterial;
      }

      // 1. Determine the target color for this mesh
      let targetColorCode: string | null = null;
      if (isCrimpMesh && selectedCrimpColor) {
        targetColorCode = selectedCrimpColor.colorCode;
      } else if (matItem?.colorCode) {
        targetColorCode = matItem.colorCode;
      }

      // 2. If we have our universal base material, clone it and override the color
      if (baseMaterial) {
        const clonedMat = baseMaterial.clone() as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
        
        if (targetColorCode) {
          clonedMat.color = new THREE.Color(targetColorCode);
        }
        
        clonedMat.needsUpdate = true;
        return clonedMat;
      }

      // 3. Fallback to the original GLTF material if baseMaterial isn't loaded
      return node.material;
    }, [
      isSelected,
      highlightMaterial,
      isCrimpMesh,
      selectedCrimpColor,
      matItem,
      baseMaterial,
      node.material,
    ]);

    // Handle selection outline declaratively
    const edgesGeometry = useMemo(() => {
      if (isSelected && node.geometry) {
        return new THREE.EdgesGeometry(node.geometry);
      }
      return null;
    }, [isSelected, node.geometry]);

    return (
      <mesh
        geometry={node.geometry}
        material={activeMaterial}
        position={node.position}
        rotation={node.rotation}
        scale={node.scale}
        name={node.name}
        userData={node.userData}
      >
        {isSelected && edgesGeometry && (
          <lineSegments geometry={edgesGeometry}>
            <lineBasicMaterial
              color={0xf97316}
              linewidth={2}
              depthTest={false}
              transparent={true}
            />
          </lineSegments>
        )}
      </mesh>
    );
  },
);

export function LoadedModel({
  url,
  onModelLoaded,
  modelRef,
  selectedMeshUuid,
  selectedMaterial,
  selectedCrimpColor,
}: LoadedModelProps) {
  // Load the main model
  const { scene, nodes } = useGLTF(url);
  
  // Load the single universal material GLB
  // Note: Please ensure /models/Rendering/material.glb is placed in the public directory!
  const materialGltf = useGLTF("/models/Rendering/material.glb");
  const baseMaterial = useMemo(() => {
    if (materialGltf && materialGltf.materials) {
      const matValues = Object.values(materialGltf.materials);
      if (matValues.length > 0) {
        return matValues[0];
      }
    }
    return null;
  }, [materialGltf]);

  useEffect(() => {
    if (scene) {
      if (modelRef) {
        (modelRef as React.MutableRefObject<typeof scene>).current = scene;
      }
      onModelLoaded(scene);
      window.dispatchEvent(new CustomEvent("model-loaded"));
    }
  }, [scene, onModelLoaded, modelRef]);

  return (
    <group>
      {Object.values(nodes).map((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const meshNode = node as THREE.Mesh;
          return (
            <SubMeshMaterialLoader
              key={meshNode.uuid}
              node={meshNode}
              selectedMaterial={selectedMaterial}
              selectedCrimpColor={selectedCrimpColor}
              isSelected={selectedMeshUuid === meshNode.uuid}
              baseMaterial={baseMaterial}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

// Preload the universal material
useGLTF.preload("/models/Rendering/material.glb");
