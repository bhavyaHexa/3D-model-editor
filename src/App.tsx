import { useRef } from "react";
import * as THREE from "three";
import { useModelManager } from "./hooks/useModelManager";
import { applyAllTransforms, exportSceneToGLB } from "./utils/transformUtils";
import { Header } from "./components/layout/Header";
import { ModelSidebar } from "./components/sidebar/ModelSidebar";
import { ViewportCanvas } from "./components/viewport/ViewportCanvas";
import { MeshInspector } from "./components/inspector/MeshInspector";

export default function App() {
  const activeSceneRef = useRef<THREE.Group | null>(null);
  const {
    modelFiles,
    selectedModel,
    setSelectedModel,
    meshes,
    transformMode,
    setTransformMode,
    handleFolderUpload,
    handleModelLoaded,
    handleRenameMesh,
    selectedMeshUuid,
    setSelectedMeshUuid,
  } = useModelManager();

  const handleApplyTransforms = () => {
    if (activeSceneRef.current) {
      applyAllTransforms(activeSceneRef.current);
    }
  };

  const handleExport = () => {
    if (activeSceneRef.current && selectedModel) {
      exportSceneToGLB(
        activeSceneRef.current,
        `modified_${selectedModel.name}`,
        false
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-gray-800">
      <Header
        transformMode={transformMode}
        setTransformMode={setTransformMode}
        onApplyTransforms={handleApplyTransforms}
        onExport={handleExport}
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
          transformMode={transformMode}
          onModelLoaded={handleModelLoaded}
          modelRef={activeSceneRef}
          selectedMeshUuid={selectedMeshUuid}
        />
        <MeshInspector 
          meshes={meshes} 
          onRenameMesh={handleRenameMesh}
          selectedMeshUuid={selectedMeshUuid}
          onSelectMesh={setSelectedMeshUuid}
        />
      </div>
    </div>
  );
}
