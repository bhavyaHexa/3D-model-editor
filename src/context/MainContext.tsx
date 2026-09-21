import { createContext, useContext, type ReactNode } from "react";
import { StateManager } from "../store/StateManager";

const MainContext = createContext<StateManager | null>(null);

const stateManager = new StateManager();

export const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MainContext.Provider value={stateManager}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;
};
