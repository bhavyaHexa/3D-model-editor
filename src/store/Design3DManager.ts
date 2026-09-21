import { ModelLoadManager } from "./ModelLoadManager";
import { EnvManager } from "./EnvManager";

export class Design3DManager {
  modelLoadManager: ModelLoadManager;
  envManager: EnvManager;

  constructor() {
    this.modelLoadManager = new ModelLoadManager();
    this.envManager = new EnvManager();
  }
}
