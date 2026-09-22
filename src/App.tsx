import { Header } from "./components/layout/Header";
import { ModelSidebar } from "./components/sidebar/ModelSidebar";
import { MobileControls } from "./components/sidebar/MobileControls";
import { ViewportCanvas } from "./components/viewport/ViewportCanvas";
import { MainProvider } from "./context/MainContext";

export default function App() {
  return (
    <MainProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-gray-800">
        <Header />
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
          <ModelSidebar />
          <div className="h-[60vh] md:h-full md:flex-1 relative">
            <ViewportCanvas />
          </div>
          <MobileControls />
        </div>
      </div>
    </MainProvider>
  );
}
