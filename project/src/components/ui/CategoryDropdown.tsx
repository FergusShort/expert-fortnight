import React, { useState } from 'react';
import { Category } from '../../types';
import { ChevronDown, ShoppingBag, Pill, Scissors, SprayCan as Spray, Dog, Package } from 'lucide-react';

interface CategoryDropdownProps {
  currentCategory: Category | 'all';
  onChange: (category: Category | 'all') => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  currentCategory,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories: { value: Category | 'all'; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Categories', icon: <Package size={18} /> },
    { value: 'food', label: 'Food', icon: <ShoppingBag size={18} /> },
    { value: 'pharma', label: 'Pharmacy', icon: <Pill size={18} /> },
    { value: 'cosmetics', label: 'Cosmetics', icon: <Scissors size={18} /> },
    { value: 'cleaning', label: 'Cleaning', icon: <Spray size={18} /> },
    { value: 'pet', label: 'Pet Care', icon: <Dog size={18} /> },
  ];

  const currentCategoryData = categories.find(cat => cat.value === currentCategory) || categories[0];

  const handleSelect = (category: Category | 'all') => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {currentCategoryData.icon}
          <span className="ml-2">{currentCategoryData.label}</span>
        </span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            {categories.map((category) => (
              <li key={category.value}>
                <button
                  type="button"
                  className={`flex items-center w-full px-4 py-2 hover:bg-gray-100 ${
                    currentCategory === category.value ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSelect(category.value)}
                >
                  {category.icon}
                  <span className="ml-2">{category.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;