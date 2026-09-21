import { makeAutoObservable } from "mobx";
import type { ModelFile } from "../types/types";
import predefinedModels from "../data/models.json";
import { useGLTF } from "@react-three/drei";
import type { ColorCombination } from "../types/types";
import { COLOR_COMBINATIONS } from "../constant";

export class SideBarManager {
  modelFiles: ModelFile[] = [];
  selectedModel: ModelFile | null = null;
  loadKey: number = 0;
  isDropdownOpen: boolean = false;

  materials: ColorCombination[] = COLOR_COMBINATIONS;
  selectedMaterial: ColorCombination | null = null;
  isMaterialDropdownOpen: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initModels();
    
    // Select first material by default
    if (this.materials.length > 0) {
      this.selectedMaterial = this.materials[0];
    }
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
    if (this.isDropdownOpen) this.isMaterialDropdownOpen = false;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  setSelectedMaterial(material: ColorCombination | null) {
    this.selectedMaterial = material;
    this.isMaterialDropdownOpen = false;
  }

  toggleMaterialDropdown() {
    this.isMaterialDropdownOpen = !this.isMaterialDropdownOpen;
    if (this.isMaterialDropdownOpen) this.isDropdownOpen = false;
  }

  closeMaterialDropdown() {
    this.isMaterialDropdownOpen = false;
  }
}
