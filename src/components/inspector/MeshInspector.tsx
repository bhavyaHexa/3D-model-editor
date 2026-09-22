import type { MeshItem } from "../../types/types";

export interface MeshInspectorProps {
  meshes: MeshItem[];
  onRenameMesh: (uuid: string, newName: string) => void;
  selectedMeshUuid: string | null;
  onSelectMesh: (uuid: string) => void;
}

export function MeshInspector({ meshes, onRenameMesh, selectedMeshUuid, onSelectMesh }: MeshInspectorProps) {
  return (
    <aside className="w-72 bg-gray-100 border-l border-gray-300 flex flex-col p-4">
      <h2 className="text-gray-800 font-semibold text-sm mb-3">
        Mesh Hierarchy
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {meshes.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No meshes detected.</p>
        ) : (
          meshes.map((mesh) => (
            <div
              key={mesh.uuid}
              onClick={() => onSelectMesh(mesh.uuid)}
              className={`p-2.5 rounded border transition-colors cursor-pointer ${
                selectedMeshUuid === mesh.uuid
                  ? "bg-white border-blue-500 shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white"
              }`}
            >
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                Mesh Name
              </label>
              <input
                type="text"
                value={mesh.name}
                onChange={(e) => onRenameMesh(mesh.uuid, e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
