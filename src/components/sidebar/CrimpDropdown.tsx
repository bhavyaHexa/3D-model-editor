import { observer } from "mobx-react-lite";
import { useMainContext } from "../../context/MainContext";

export const CrimpDropdown = observer(() => {
  const stateManager = useMainContext();
  const { sideBarManager } = stateManager.designManager;
  
  const { 
    availableCrimpColors, 
    recommendedCrimpColor,
    selectedCrimpColor, 
    setSelectedCrimpColor, 
    isCrimpDropdownOpen, 
    toggleCrimpDropdown 
  } = sideBarManager;

  return (
    <div 
      className="mb-4 relative" 
      onClick={(e) => e.stopPropagation()}
    >
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Crimp Color
      </label>
      
      <button
        onClick={toggleCrimpDropdown}
        className="flex items-center justify-between w-full text-left text-xs text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3"
      >
        <span className="truncate flex items-center">
          {selectedCrimpColor ? (
            <>
              <span 
                className="w-3 h-3 rounded-full mr-2 inline-block border border-gray-300" 
                style={{ backgroundColor: selectedCrimpColor.colorCode }}
              ></span>
              {selectedCrimpColor.name}
            </>
          ) : (
            "Select a crimp color..."
          )}
        </span>
        <span className="text-gray-500 ml-2 text-[10px]">▼</span>
      </button>

      {isCrimpDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {availableCrimpColors.map((color) => {
            const isRecommended = recommendedCrimpColor?.id === color.id;
            return (
              <button
                key={color.id}
                className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-blue-50 ${
                  selectedCrimpColor?.id === color.id ? "bg-blue-100 font-medium text-blue-900" : "text-gray-700"
                }`}
                onClick={() => setSelectedCrimpColor(color)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2 border border-gray-300 flex-shrink-0" 
                      style={{ backgroundColor: color.colorCode }}
                    ></span>
                    <span className="truncate">{color.name}</span>
                  </div>
                  {isRecommended && (
                    <span className="text-[9px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                      Recommended
                    </span>
                  )}
                </div>
                {color.description && (
                  <div className="text-[10px] text-gray-500 mt-0.5 ml-5">{color.description}</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});
