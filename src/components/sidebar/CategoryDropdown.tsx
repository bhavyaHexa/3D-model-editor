import { observer } from "mobx-react-lite";
import { useMainContext } from "../../context/MainContext";

export const CategoryDropdown = observer(() => {
  const stateManager = useMainContext();
  const { sideBarManager } = stateManager.designManager;
  
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    isCategoryDropdownOpen, 
    toggleCategoryDropdown 
  } = sideBarManager;

  return (
    <div 
      className="mb-4 relative" 
      onClick={(e) => e.stopPropagation()}
    >
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Select Category
      </label>
      
      <button
        onClick={toggleCategoryDropdown}
        className="flex items-center justify-between w-full text-left text-xs text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 px-3"
      >
        <span className="truncate">{selectedCategory || "Select a category..."}</span>
        <span className="text-gray-500 ml-2 text-[10px]">▼</span>
      </button>

      {isCategoryDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {categories.map((category) => (
            <button
              key={category}
              className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-blue-50 ${
                selectedCategory === category ? "bg-blue-100 font-medium text-blue-900" : "text-gray-700"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
