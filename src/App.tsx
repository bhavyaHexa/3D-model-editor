import { Header } from "./components/layout/Header";
import { ModelSidebar } from "./components/sidebar/ModelSidebar";
import { ViewportCanvas } from "./components/viewport/ViewportCanvas";
import { MainProvider } from "./context/MainContext";

export default function App() {
  return (
    <MainProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-gray-800">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <ModelSidebar />
          <ViewportCanvas />
        </div>
      </div>
    </MainProvider>
  );
}
