import type { HeaderProps, TransformMode } from "../../types/types";

export function Header({
  transformMode,
  setTransformMode,
  onApplyTransforms,
  onExport,
  hasModel,
}: HeaderProps) {
  const modes: TransformMode[] = ["translate", "rotate", "scale"];

  return (
    <header className="h-14 bg-gray-200 border-b border-gray-300 px-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <span className="text-blue-600 font-bold text-lg">3D Viewer</span>
        <span className="text-gray-500 text-sm">| Blender Tools</span>
      </div>

      <div className="flex bg-gray-300 p-1 rounded-md border border-gray-400">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setTransformMode(mode)}
            className={`px-3 py-1 text-xs rounded font-medium capitalize transition-colors ${
              transformMode === mode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onApplyTransforms}
          disabled={!hasModel}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded transition-all"
        >
          Apply Transforms
        </button>
        <button
          onClick={onExport}
          disabled={!hasModel}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded transition-all"
        >
          Export GLB
        </button>
      </div>
    </header>
  );
}
