import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { LoadedModel } from "./LoadedModel";
import { Loader } from "./Loader";
import { Env } from "./Env";
import { useMainContext } from "../../context/MainContext";
import { FeedbackButtons } from "./FeedbackButtons";

function CameraFitController({
  modelRef,
  selectedMeshUuid,
}: {
  modelRef: React.RefObject<THREE.Group | null>;
  selectedMeshUuid: string | null;
}) {
  const { camera, controls } = useThree();

  const fitCamera = (focusSelected: boolean) => {
    if (!modelRef.current) return;

    let targetObject: THREE.Object3D = modelRef.current;
    if (focusSelected && selectedMeshUuid) {
      modelRef.current.traverse((child) => {
        if (child.uuid === selectedMeshUuid) targetObject = child;
      });
    }

    const box = new THREE.Box3().setFromObject(targetObject);
    if (box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;

    // Keep the same view angle if possible
    const direction = new THREE.Vector3()
      .subVectors(camera.position, center)
      .normalize();
    if (direction.lengthSq() < 0.01) {
      direction.set(1, 0.5, 1).normalize();
    }

    camera.position.copy(center).add(direction.multiplyScalar(cameraZ));
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    if (controls) {
      (controls as any).target.copy(center);
      (controls as any).update();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === ".") {
        fitCamera(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [camera, controls, modelRef, selectedMeshUuid]);

  useEffect(() => {
    const handleModelLoaded = () => fitCamera(false);
    window.addEventListener("model-loaded", handleModelLoaded);
    return () => window.removeEventListener("model-loaded", handleModelLoaded);
  }, [camera, controls, modelRef]);

  return null;
}

export const ViewportCanvas = observer(() => {
  const stateManager = useMainContext();
  const { modelLoadManager } = stateManager.design3DManager;
  const { sideBarManager } = stateManager.designManager;

  const modelRef = useRef<THREE.Group | null>(null);

  const modelUrl = sideBarManager.selectedModel?.url;
  const selectedMeshUuid = modelLoadManager.selectedMeshUuid;
  const onModelLoaded = modelLoadManager.handleModelLoaded;

  return (
    <div className="flex-1 h-full bg-blueprint-grid relative">
      <FeedbackButtons />
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 45, near: 0.001, far: 1000 }}
        shadows
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        <CameraFitController
          modelRef={modelRef}
          selectedMeshUuid={selectedMeshUuid}
        />

        {modelUrl && (
          <Suspense fallback={<Loader />}>
            <Env />
            <LoadedModel
              key={`${modelUrl}-${sideBarManager.loadKey}`}
              url={modelUrl}
              onModelLoaded={onModelLoaded}
              modelRef={modelRef}
              selectedMeshUuid={selectedMeshUuid}
              selectedMaterial={sideBarManager.selectedMaterial}
              selectedCrimpColor={sideBarManager.selectedCrimpColor}
            />
          </Suspense>
        )}

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
});
