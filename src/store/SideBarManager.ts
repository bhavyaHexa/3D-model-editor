import { makeAutoObservable } from "mobx";
import type { ModelFile } from "../types/types";
import predefinedModels from "../data/models.json";
import { useGLTF } from "@react-three/drei";

export class SideBarManager {
  modelFiles: ModelFile[] = [];
  selectedModel: ModelFile | null = null;
  loadKey: number = 0;
  isDropdownOpen: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initModels();
  }

  initModels() {
    this.modelFiles = predefinedModels as ModelFile[];
    if (this.modelFiles.length > 0) {
      this.selectedModel = this.modelFiles[0];
      this.loadKey++;
    }
  }

  setSelectedModel(model: ModelFile | null) {
    if (model) {
      useGLTF.clear(model.url);
    }
    this.selectedModel = model;
    this.loadKey++;
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}
