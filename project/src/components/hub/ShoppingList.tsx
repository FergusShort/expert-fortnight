import React, { useState } from 'react';
import { Plus, X, ShoppingBag, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

const ShoppingList: React.FC = () => {
  const { shoppingList, removeFromShoppingList, addToShoppingList } = useApp();
  const [newItem, setNewItem] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddItem = () => {
    if (newItem.trim()) {
      addToShoppingList({
        name: newItem.trim(),
        quantity: 1,
        unit: 'pcs',
      });
      
      setNewItem('');
      setShowAddForm(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Shopping List</h3>
        
        {!showAddForm ? (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Item
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter item name"
              className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleAddItem}
              disabled={!newItem.trim()}
            >
              <Check size={16} />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(false)}
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </div>
      
      {shoppingList.length > 0 ? (
        <ul className="divide-y">
          {shoppingList.map(item => (
            <li 
              key={item.id} 
              className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded"
            >
              <div className="flex items-center">
                <ShoppingBag size={16} className="text-gray-400 mr-3" />
                <span>{item.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {item.quantity} {item.unit}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="p-1"
                onClick={() => removeFromShoppingList(item.id)}
              >
                <X size={16} />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <ShoppingBag size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Your shopping list is empty</p>
          <p className="text-sm text-gray-400 mt-1">
            Add items you need to buy
          </p>
        </div>
      )}
      
      {shoppingList.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button variant="primary">
            Mark All as Purchased
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;