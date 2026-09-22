import { makeAutoObservable } from "mobx";
import type { ModelFile } from "../types/types";
import predefinedModels from "../data/models.json";
import { useGLTF } from "@react-three/drei";
import { getFilteredCrimpColors, getRecommendedCrimpColor } from "../utils/crimpFilterUtils";
import type { ColorCombination, CrimpColor } from "../types/types";
import crimpColorsData from "../data/crimpColors.json";
export class SideBarManager {
  modelFiles: ModelFile[] = [];
  selectedModel: ModelFile | null = null;
  loadKey: number = 0;
  isDropdownOpen: boolean = false;

  materials: ColorCombination[] = [];
  selectedMaterial: ColorCombination | null = null;
  isMaterialDropdownOpen: boolean = false;

  crimpColors: CrimpColor[] = [];
  selectedCrimpColor: CrimpColor | null = null;
  isCrimpDropdownOpen: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initModels();
    
    // Initialization logic moved to initModels
  }

  initModels() {
    this.modelFiles = predefinedModels as ModelFile[];
    if (this.modelFiles.length > 0) {
      this.setSelectedModel(this.modelFiles[0]);
    }
    
    this.crimpColors = crimpColorsData.crimpColors as CrimpColor[];
    if (this.crimpColors.length > 0) {
      this.selectedCrimpColor = this.crimpColors[0];
    }
  }

  setSelectedModel(model: ModelFile | null) {
    if (model) {
      useGLTF.clear(model.url);
      this.materials = model.colorCombination || [];
      if (this.materials.length > 0) {
        this.selectedMaterial = this.materials[0];
      } else {
        this.selectedMaterial = null;
      }
    } else {
      this.materials = [];
      this.selectedMaterial = null;
    }
    this.selectedModel = model;
    this.loadKey++;
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.isMaterialDropdownOpen = false;
      this.isCrimpDropdownOpen = false;
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  setSelectedMaterial(material: ColorCombination | null) {
    this.selectedMaterial = material;
    this.isMaterialDropdownOpen = false;

    if (material) {
      // Auto-update to recommended crimp color if available
      const recommended = this.recommendedCrimpColor;
      if (recommended) {
        this.selectedCrimpColor = recommended;
      } else if (this.selectedCrimpColor && !this.availableCrimpColors.some(c => c.id === this.selectedCrimpColor!.id)) {
        // If current crimp is no longer available in the filtered list, reset to the first available option
        this.selectedCrimpColor = this.availableCrimpColors[0] || null;
      }
    }
  }

  get availableCrimpColors() {
    return getFilteredCrimpColors(this.selectedMaterial, this.crimpColors);
  }

  get recommendedCrimpColor() {
    return getRecommendedCrimpColor(this.selectedMaterial, this.availableCrimpColors);
  }

  toggleMaterialDropdown() {
    this.isMaterialDropdownOpen = !this.isMaterialDropdownOpen;
    if (this.isMaterialDropdownOpen) {
      this.isDropdownOpen = false;
      this.isCrimpDropdownOpen = false;
    }
  }

  closeMaterialDropdown() {
    this.isMaterialDropdownOpen = false;
  }

  setSelectedCrimpColor(color: CrimpColor | null) {
    this.selectedCrimpColor = color;
    this.isCrimpDropdownOpen = false;
  }

  toggleCrimpDropdown() {
    this.isCrimpDropdownOpen = !this.isCrimpDropdownOpen;
    if (this.isCrimpDropdownOpen) {
      this.isDropdownOpen = false;
      this.isMaterialDropdownOpen = false;
    }
  }

  closeCrimpDropdown() {
    this.isCrimpDropdownOpen = false;
  }
}
