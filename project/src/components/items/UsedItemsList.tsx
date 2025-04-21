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
  const { addToShoppingList } = useApp();
  
  const handleAddToShoppingList = (name: string) => {
    addToShoppingList({
      name,
      quantity: 1,
      unit: 'pcs',
    });
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
                    Used {new Date(item.usedDate).toLocaleDateString()}
                  </p>
                </div>
                
                {!item.addedToShoppingList && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToShoppingList(item.name)}
                    title="Add to shopping list"
                  >
                    <Plus size={16} className="mr-1" />
                    <ShoppingCart size={16} />
                  </Button>
                )}
                
                {item.addedToShoppingList && (
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