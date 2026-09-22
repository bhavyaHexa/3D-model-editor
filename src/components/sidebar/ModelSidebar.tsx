import { observer } from "mobx-react-lite";
import { useMainContext } from "../../context/MainContext";
import { MaterialDropdown } from "./Material";
import { CrimpDropdown } from "./CrimpDropdown";

export const ModelSidebar = observer(() => {
  const stateManager = useMainContext();
  const { sideBarManager } = stateManager.designManager;
  const { modelLoadManager } = stateManager.design3DManager;

  const hasCrimpMesh = modelLoadManager.meshes.some(mesh => mesh.name === "Crimp");

  const {
    modelFiles,
    selectedModel,
    setSelectedModel,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    isMaterialDropdownOpen,
    closeMaterialDropdown,
    isCrimpDropdownOpen,
    closeCrimpDropdown
  } = sideBarManager;

  return (
    <aside
      className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col p-4"
      onClick={() => {
        if (isDropdownOpen) closeDropdown();
        if (isMaterialDropdownOpen) closeMaterialDropdown();
        if (isCrimpDropdownOpen) closeCrimpDropdown();
      }}
    >
      <h2 className="text-gray-800 font-semibold text-sm mb-3">
        Model Explorer
      </h2>

      <div className="mb-4 relative" onClick={(e) => e.stopPropagation()}>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Select Model
        </label>

        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full text-left text-xs text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3"
        >
          <span className="truncate">
            {selectedModel?.name || "Select a model..."}
          </span>
          <span className="text-gray-500 ml-2 text-[10px]">▼</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {modelFiles.map((model) => (
              <button
                key={model.id}
                className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-blue-50 ${
                  selectedModel?.id === model.id
                    ? "bg-blue-100 font-medium text-blue-900"
                    : "text-gray-700"
                }`}
                onClick={() => setSelectedModel(model)}
              >
                {model.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <MaterialDropdown />
      {hasCrimpMesh && <CrimpDropdown />}
    </aside>
  );
});
