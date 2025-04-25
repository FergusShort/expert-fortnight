import React, { useState } from 'react';
import { Plus, X, ShoppingBag, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';
import { Category } from '../../types';

const ShoppingList: React.FC = () => {
  const {
    shoppingList,
    removeFromShoppingList,
    addToShoppingList,
    markAllAsPurchased,
    foodSubcategories,
  } = useApp();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newItemCategory, setNewItemCategory] = useState<Category>('food'); // Default to food
  const [newFoodSubcategory, setNewFoodSubcategory] = useState<
    'produce' | 'dairy' | 'meat' | 'bakery' | 'canned' | 'frozen' | 'other' | null
  >(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

    const newItem = {
      name: newItemName.trim(),
      quantity: parseInt(newItemQuantity.toString(), 10),
      unit: newItemUnit,
      category: newItemCategory,
      foodsubcategory:
        newItemCategory === 'food' && newFoodSubcategory ? newFoodSubcategory : undefined,
    };

    let imageUrl: string = '/categoryImages/default.jpeg'; // Default image
if (newItem.category === 'food' && newItem.foodsubcategory) {
  switch (newItem.foodsubcategory) {
    case 'produce':
      imageUrl = '/categoryImages/produce.jpeg';
      break;
    case 'dairy':
      imageUrl = '/categoryImages/dairy.jpeg';
      break;
    case 'meat':
      imageUrl = '/categoryImages/meat.jpeg';
      break;
    case 'bakery':
      imageUrl = '/categoryImages/bakery.jpeg';
      break;
    case 'canned':
      imageUrl = '/categoryImages/cannedfood.jpeg';
      break;
    case 'frozen':
      imageUrl = '/categoryImages/frozenfood.jpeg';
      break;
    case 'other':
      imageUrl = '/categoryImages/other.jpeg';
      break;
    default:
      imageUrl = '/categoryImages/other.jpeg';
      break;
  }
} else {
  switch (newItem.category) {
    case 'pharma':
      imageUrl = '/categoryImages/pharma.jpeg';
      break;
    case 'cosmetics':
      imageUrl = '/categoryImages/cosmetics.jpeg';
      break;
    case 'cleaning':
      imageUrl = '/categoryImages/cleaning.jpeg';
      break;
    case 'pet':
      imageUrl = '/categoryImages/pet.jpeg';
      break;
  }
}

    addToShoppingList({ ...newItem, image_url: imageUrl });

    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnit('pcs');
    setNewItemCategory('food');
    setNewFoodSubcategory(null);
    setShowAddForm(false);
    setErrorMessage('');
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
        <div className="mb-4">
          <div className="flex flex-col gap-2 mb-2">
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
                onChange={(e) => {
                  setNewItemCategory(e.target.value as Category);
                  setNewFoodSubcategory(null); // Reset subcategory when category changes
                }}
              >
                <option value="food">Food</option>
                <option value="pharma">Pharma</option>
                <option value="cosmetics">Cosmetics</option>
                <option value="cleaning">Cleaning</option>
                <option value="pet">Pet</option>
              </select>
            </div>

            {newItemCategory === 'food' && (
              <select
                className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newFoodSubcategory || ''}
                onChange={(e) =>
                  setNewFoodSubcategory(
                    e.target.value as
                      | 'produce'
                      | 'dairy'
                      | 'meat'
                      | 'bakery'
                      | 'canned'
                      | 'frozen'
                      | 'other'
                      | null
                  )
                }
              >
                <option value="">Subcategory</option>
                {foodSubcategories.map((sub) => (
                  <option key={sub} value={sub.toLowerCase()}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
          </div>
          {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
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
                  {item.quantity} {item.unit} ({item.category}
                  {item.foodsubcategory && ` - ${item.foodsubcategory}`}
                  )
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