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
  defaultMaterial: THREE.Material;
}

const SubMeshMaterialLoader = memo(
  ({
    node,
    selectedMaterial,
    selectedCrimpColor,
    isSelected,
    defaultMaterial,
  }: SubMeshProps) => {
    const isCrimpMesh = node.name === "Crimp";

    const mappedColorName = selectedMaterial
      ? selectedMaterial.materialMap[node.name]
      : null;

    const matItem = mappedColorName
      ? materialsData.find(
          (m) => m.name.toLowerCase() === mappedColorName.toLowerCase()
        )
      : null;

    const materialUrl = matItem?.materialURL ?? null;

    let gltfMaterials: Record<string, THREE.Material> | undefined;
    if (materialUrl) {
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const gltf = useGLTF(materialUrl);
        gltfMaterials = gltf.materials;
      } catch {
        // Silently handle if material GLB is missing
      }
    }

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

      if (isCrimpMesh && selectedCrimpColor) {
        const isStainless = selectedCrimpColor.name.toLowerCase().includes("stainless");
        const mat = new THREE.MeshPhysicalMaterial({
          clearcoat: 0.1,
          clearcoatRoughness: 0.1,
          color: new THREE.Color(selectedCrimpColor.colorCode),
          metalness: isStainless ? 0.95 : 0.8,
          reflectivity: 0.9,
          roughness: isStainless ? 0.15 : 0.25,
        });
        return mat;
      }

      if (gltfMaterials) {
        const materialValues = Object.values(gltfMaterials);
        if (materialValues.length > 0) {
          const mat = materialValues[0].clone();
          mat.needsUpdate = true;
          return mat;
        }
      }

      // Fallback to generating a material dynamically if there is a colorCode but no GLB
      if (matItem?.colorCode) {
        const isStainless = matItem.name.toLowerCase().includes("stainless");
        return new THREE.MeshPhysicalMaterial({
          clearcoat: 0.1,
          clearcoatRoughness: 0.1,
          color: new THREE.Color(matItem.colorCode),
          metalness: isStainless ? 0.95 : 0.8,
          reflectivity: 0.9,
          roughness: isStainless ? 0.15 : 0.25,
        });
      }

      // 4. Default Base Material Check
      return node.material || defaultMaterial;
    }, [
      isCrimpMesh,
      selectedCrimpColor,
      gltfMaterials,
      matItem,
      node.material,
      defaultMaterial,
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
  }
);

export function LoadedModel({
  url,
  onModelLoaded,
  modelRef,
  selectedMeshUuid,
  selectedMaterial,
  selectedCrimpColor,
}: LoadedModelProps) {
  const { scene, nodes } = useGLTF(url);

  // Create the default fitting material (Silver default matching BMRS-FE)
  const fittingMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      clearcoat: 0.1,
      clearcoatRoughness: 0.1,
      color: new THREE.Color("#C0C0C0"), // Global default colorCode
      metalness: 0.8,
      reflectivity: 0.9,
      roughness: 0.25,
    });
  }, []);

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
              defaultMaterial={fittingMaterial}
            />
          );
        }
        return null;
      })}
    </group>
  );
}
