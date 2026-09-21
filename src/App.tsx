import { useRef } from "react";
import * as THREE from "three";
import { useModelManager } from "./hooks/useModelManager";
import { Header } from "./components/layout/Header";
import { ModelSidebar } from "./components/sidebar/ModelSidebar";
import { ViewportCanvas } from "./components/viewport/ViewportCanvas";

export default function App() {
  const activeSceneRef = useRef<THREE.Group | null>(null);
  const {
    modelFiles,
    selectedModel,
    setSelectedModel,
    handleFolderUpload,
    handleModelLoaded,
    selectedMeshUuid,
  } = useModelManager();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-gray-800">
      <Header
        hasModel={!!selectedModel}
      />
      <div className="flex flex-1 overflow-hidden">
        <ModelSidebar
          modelFiles={modelFiles}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          onFolderUpload={handleFolderUpload}
        />
        <ViewportCanvas
          modelUrl={selectedModel?.url}
          onModelLoaded={handleModelLoaded}
          modelRef={activeSceneRef}
          selectedMeshUuid={selectedMeshUuid}
        />
      </div>
    </div>
  );
}
