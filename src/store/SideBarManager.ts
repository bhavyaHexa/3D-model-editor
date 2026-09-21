import { makeAutoObservable } from "mobx";
import type { ChangeEvent } from "react";
import type { ModelFile } from "../types/types";
import { extractGltfFiles } from "../utils/fileUtils";

export class SideBarManager {
  modelFiles: ModelFile[] = [];
  selectedModel: ModelFile | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  handleFolderUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const extracted = extractGltfFiles(event.target.files);
    this.modelFiles = extracted;
    if (extracted.length > 0) {
      this.selectedModel = extracted[0];
    }
  }

  setSelectedModel(model: ModelFile | null) {
    this.selectedModel = model;
  }
}
