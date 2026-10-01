import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useControls } from "leva";
import { LoadedModel } from "./LoadedModel";
import { Loader } from "./Loader";
import { Env } from "./Env";
import { useMainContext } from "../../context/MainContext";
import { FeedbackButtons } from "./FeedbackButtons";
import { NormalizedModelGroup } from "./NormalizedModelGroup";

export const ViewportCanvas = observer(() => {
  const stateManager = useMainContext();
  const { modelLoadManager } = stateManager.design3DManager;
  const { sideBarManager } = stateManager.designManager;

  const modelRef = useRef<THREE.Group | null>(null);

  const modelUrl = sideBarManager.selectedModel?.url;
  const selectedMeshUuid = modelLoadManager.selectedMeshUuid;
  const onModelLoaded = modelLoadManager.handleModelLoaded;

  const { backgroundGradient } = useControls("Environment", {
    backgroundGradient: {
      options: {
        "Studio (Current)":
          "linear-gradient(to bottom, #a8a9ad 0%, #bfc0c3 50%, #6d6e6f 100%)",
        "Studio (Lighter)":
          "linear-gradient(to bottom, #a5a6a8 0%, #c9cbcd 60%, #7c8087 100%)",
        "Studio (Darker)":
          "linear-gradient(to bottom, #9b9c9f 0%, #bebfc1 50%, #676767 100%)",
        "Studio (Warm)":
          "linear-gradient(to bottom, #b5b3a8 0%, #d1cfc0 50%, #75746b 100%)",
        "Radial (Cool)":
          "radial-gradient(circle at center, #eaecf0 0%, #8c96a3 100%)",
        "Radial (Dark)":
          "radial-gradient(circle at center, #c3c2c2ff 0%, #6c6969 100%)",
      },
    },
  });

  return (
    <div
      className="flex-1 h-full relative"
      style={{
        background: backgroundGradient,
      }}
    >
      <div className="hidden md:block absolute z-50 w-max bottom-12 left-1/2 -translate-x-1/2">
        <FeedbackButtons />
      </div>
      {sideBarManager.selectedModel?.name && (
        <div className="absolute bottom-6 md:top-6 md:bottom-auto left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <h2 className="text-gray-800 font-bold text-xl md:text-2xl tracking-wide">
            {sideBarManager.selectedModel.name}
          </h2>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 2, 7.5], fov: 45, near: 0.1, far: 15 }}
        shadows
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />

        {modelUrl && (
          <Suspense fallback={<Loader />}>
            <Env />
            <NormalizedModelGroup targetSize={3.5}>
              <LoadedModel
                key={`${modelUrl}-${sideBarManager.loadKey}`}
                url={modelUrl}
                onModelLoaded={onModelLoaded}
                modelRef={modelRef}
                selectedMeshUuid={selectedMeshUuid}
                selectedMaterial={sideBarManager.selectedMaterial}
                selectedCrimpColor={sideBarManager.selectedCrimpColor}
              />
            </NormalizedModelGroup>
          </Suspense>
        )}

        <OrbitControls
          makeDefault
          minDistance={5}
          maxDistance={10}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
});
