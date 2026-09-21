import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export function applyAllTransforms(rootObject: THREE.Object3D): void {
  rootObject.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).geometry) {
      const mesh = child as THREE.Mesh;
      mesh.updateMatrixWorld(true);

      mesh.geometry.applyMatrix4(mesh.matrixWorld);

      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(1, 1, 1);

      mesh.updateMatrix();
    }
  });
}

export function exportSceneToGLB(
  sceneObject: THREE.Object3D | null,
  filename = "model.glb",
  shouldApplyTransforms = false
): void {
  if (!sceneObject) return;

  const exportScene = sceneObject.clone(true);
  
  // Remove outline geometry before exporting
  const outlinesToRemove: THREE.Object3D[] = [];
  exportScene.traverse((child) => {
    if (child.userData.isOutline) {
      outlinesToRemove.push(child);
    }
  });
  outlinesToRemove.forEach((outline) => {
    if (outline.parent) {
      outline.parent.remove(outline);
    }
  });

  if (shouldApplyTransforms) {
    applyAllTransforms(exportScene);
  }

  const exporter = new GLTFExporter();
  exporter.parse(
    exportScene,
    (arrayBuffer) => {
      const blob = new Blob([arrayBuffer as ArrayBuffer], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename.endsWith(".glb") ? filename : `${filename}.glb`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    (error) => console.error("Export error:", error),
    { binary: true },
  );
}
