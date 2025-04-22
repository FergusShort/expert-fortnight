import React, { useState } from 'react';
import { Plus, X, ShoppingBag, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';
import { Category } from '../../types';

const ShoppingList: React.FC = () => {
  const { shoppingList, removeFromShoppingList, addToShoppingList, markAllAsPurchased } = useApp();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newItemCategory, setNewItemCategory] = useState<Category>('food'); // Default to food
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to display validation errors

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      setErrorMessage('Item name cannot be empty.');
      return;
    }
    if (isNaN(newItemQuantity) || newItemQuantity <= 0) {
      setErrorMessage('Quantity must be a number greater than 0.');
      return;
    }
    if (!newItemUnit.trim()) {
      setErrorMessage('Unit cannot be empty.');
      return;
    }
    if (!newItemCategory) {
      setErrorMessage('Category cannot be empty.');
      return;
    }

    // If all validations pass, add the item
    addToShoppingList({
      name: newItemName.trim(),
      quantity: parseInt(newItemQuantity.toString(), 10),
      unit: newItemUnit,
      category: newItemCategory,
    });

    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnit('pcs');
    setNewItemCategory('food');
    setShowAddForm(false);
    setErrorMessage(''); // Clear any previous error messages
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

        {!showAddForm && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} className="mr-1" />
            Add Item
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-4"> {/* Container for the add form */}
          <div className="flex flex-col gap-2 mb-2"> {/* Arrange inputs vertically */}
            <input
              type="text"
              placeholder="Enter item name"
              className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
              onKeyDown={handleKeyDown}
            />
            <div className="flex gap-2">
              <input
                type="number"
                className="border rounded-lg px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
              />
              <input
                type="text"
                placeholder="Unit (e.g., pcs, g, ml)"
                className="border rounded-lg px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
              />
              <select
                className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as Category)}
              >
                <option value="food">Food</option>
                <option value="pharma">Pharma</option>
                <option value="cosmetics">Cosmetics</option>
                <option value="cleaning">Cleaning</option>
                <option value="pet">Pet</option>
              </select>
            </div>
          </div>
          {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>} {/* Display error message */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddItem}
              disabled={!newItemName.trim()}
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
        </div>
      )}

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
                  {item.quantity} {item.unit} ({item.category})
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
          <Button variant="primary" onClick={async () => await markAllAsPurchased()}>
            Mark All as Purchased
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;