import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ItemCard from './ItemCard';
import UsedItemsList from './UsedItemsList';
import ShoppingList from '../hub/ShoppingList';
//import { Item } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { filterItemsBySearchTerm } from '../../utils/expiryUtils';

const ItemList: React.FC = () => {
  const { 
    items, 
    usedItems, 
    currentCategory,
    markItemAsUsed,
    toggleItemOpened
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter items by category and search term
  const filteredItems = items
    .filter(item => item.category === currentCategory)
    .filter(item => filterItemsBySearchTerm([item], searchTerm).length > 0);
  
  // Filter used items by category
  const filteredUsedItems = usedItems.filter(
    item => item.category === currentCategory
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-3/4">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold">My {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Items</h2>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onMarkAsUsed={markItemAsUsed}
                onToggleOpened={toggleItemOpened}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">No items found</p>
            {searchTerm ? (
              <p className="text-sm text-gray-400">Try adjusting your search term</p>
            ) : (
              <p className="text-sm text-gray-400">Add items to your list to start tracking</p>
            )}
          </div>
        )}
      </div>
      
      <div className="lg:w-1/4 space-y-6">
        <ShoppingList />
        <UsedItemsList usedItems={filteredUsedItems} />
      </div>
    </div>
  );
};

export default ItemList;