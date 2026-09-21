import { observer } from "mobx-react-lite";
import { useMainContext } from "../../context/MainContext";

export const ModelSidebar = observer(() => {
  const stateManager = useMainContext();
  const { sideBarManager } = stateManager.designManager;
  
  const { modelFiles, selectedModel, setSelectedModel, handleFolderUpload } = sideBarManager;

  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col p-4">
      <h2 className="text-gray-800 font-semibold text-sm mb-3">
        Model Explorer
      </h2>

      <label className="mb-4 block">
        <span className="sr-only">Upload Folder</span>
        <input
          type="file"
          {...({ webkitdirectory: "", directory: "" } as Record<
            string,
            string
          >)}
          onChange={handleFolderUpload}
          className="block w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-400 cursor-pointer"
        />
      </label>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {modelFiles.map((model) => (
          <button
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className={`w-full text-left px-3 py-2 rounded text-xs truncate transition-colors ${
              selectedModel?.id === model.id
                ? "bg-blue-600 text-white font-medium"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {model.name}
          </button>
        ))}
      </div>
    </aside>
  );
});
