import type { ModelFile } from "../types/types";

export function extractGltfFiles(fileList: FileList): ModelFile[] {
  const files = Array.from(fileList);
  const gltfFiles = files.filter(
    (file) => file.name.endsWith(".glb") || file.name.endsWith(".gltf"),
  );

  return gltfFiles.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    url: URL.createObjectURL(file),
  }));
}
