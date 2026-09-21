import { ModelLoadManager } from "./ModelLoadManager";

export class Design3DManager {
  modelLoadManager: ModelLoadManager;

  constructor() {
    this.modelLoadManager = new ModelLoadManager();
  }
}
