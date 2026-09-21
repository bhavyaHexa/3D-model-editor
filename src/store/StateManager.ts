import { DesignManager } from "./DesignManager";
import { Design3DManager } from "./Design3DManager";

export class StateManager {
  designManager: DesignManager;
  design3DManager: Design3DManager;

  constructor() {
    this.designManager = new DesignManager();
    this.design3DManager = new Design3DManager();
  }
}
