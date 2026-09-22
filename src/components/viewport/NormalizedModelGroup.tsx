import React, { useRef, useLayoutEffect } from "react";
import * as THREE from "three";

interface NormalizedModelGroupProps {
  children: React.ReactNode;
  /** The target maximum dimension (width, height, or depth) that the model should scale to */
  targetSize?: number;
}

/**
 * Wraps a 3D model and automatically normalizes its size and position.
 * Regardless of how big the original mesh is, this component scales it 
 * to exactly `targetSize` and perfectly centers it at [0, 0, 0].
 */
export function NormalizedModelGroup({
  children,
  targetSize = 5,
}: NormalizedModelGroupProps) {
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    // 1. Reset scale and position in case this runs multiple times
    groupRef.current.scale.setScalar(1);
    groupRef.current.position.set(0, 0, 0);
    
    // Ensure the matrix is fully updated with the reset values
    groupRef.current.updateMatrixWorld(true);

    // 2. Calculate the bounding box of the loaded model
    const box = new THREE.Box3().setFromObject(groupRef.current);
    if (box.isEmpty()) return;

    // 3. Find its current center and size
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      // 4. Calculate the ratio needed to make its max dimension exactly `targetSize`
      const scale = targetSize / maxDim;
      
      // 5. Apply the uniform scale
      groupRef.current.scale.setScalar(scale);

      // 6. Apply a negative offset so that the visual center becomes [0, 0, 0]
      // We must multiply the offset by the scale since the object itself is being scaled
      groupRef.current.position.copy(center).multiplyScalar(-scale);
    }
  }, [children]);

  return <group ref={groupRef}>{children}</group>;
}
