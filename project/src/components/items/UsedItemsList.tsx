import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import { UsedItem } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface UsedItemsListProps {
  usedItems: UsedItem[];
}

const UsedItemsList: React.FC<UsedItemsListProps> = ({ usedItems }) => {
  const { addToShoppingList, removeFromUsedItems } = useApp(); // Assuming you'll create removeFromUsedItems

  const handleAddToShoppingList = async (usedItem: UsedItem) => {
    // Add the item to the shopping list
    await addToShoppingList({
      name: usedItem.name,
      quantity: usedItem.quantity,
      unit: usedItem.unit,
      category: usedItem.category,
      image_url: usedItem.image_url,
    });

    // Remove the item from the used items list
    await removeFromUsedItems(usedItem.id);
  };

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <h3 className="text-lg font-semibold">Recently Used Items</h3>
      </CardHeader>

      <CardBody className="p-0">
        {usedItems.length > 0 ? (
          <ul className="divide-y">
            {usedItems.map(item => (
              <li key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Used {item.used_date ? new Date(item.used_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                {!item.added_to_shopping_list && ( // Use the correct column name
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToShoppingList(item)} // Pass the entire item
                    title="Add to shopping list"
                  >
                    <Plus size={16} className="mr-1" />
                    <ShoppingCart size={16} />
                  </Button>
                )}

                {item.added_to_shopping_list && ( // Use the correct column name
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    On list
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>No recently used items</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UsedItemsList;