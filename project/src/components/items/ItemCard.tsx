import React, { useState } from 'react';
import { Info, Check, ShoppingCart, RotateCcw } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Item } from '../../types';
import { getExpiryStatusText, getExpiryStatusClass } from '../../utils/expiryUtils';
import ItemInfoModal from './ItemInfoModal';

interface ItemCardProps {
  item: Item;
  onMarkAsUsed: (item: Item, addToShoppingList: boolean) => void;
  onToggleOpened: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onMarkAsUsed, 
  onToggleOpened 
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showUsedOptions, setShowUsedOptions] = useState(false);
  
  const expiryStatusClass = getExpiryStatusClass(item.expiryDate);
  const expiryText = getExpiryStatusText(item.expiryDate);

  return (
    <>
      <Card className="h-full">
        <CardBody className="p-0">
          {item.imageUrl && (
            <div className="relative h-40 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <Badge 
                  variant={
                    expiryStatusClass.includes('red') ? 'danger' : 
                    expiryStatusClass.includes('yellow') ? 'warning' : 'success'
                  }
                  className="font-semibold"
                >
                  {expiryText}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
            <p className="text-gray-600 text-sm">
              {item.quantity} {item.unit}
            </p>
            
            <div className="mt-2 flex gap-2">
              <Badge 
                variant={item.opened ? 'warning' : 'success'} 
                size="sm"
              >
                {item.opened ? 'Opened' : 'Unopened'}
              </Badge>
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="pt-0 border-t-0 flex justify-between items-center">
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="p-2" 
              onClick={() => setShowInfo(true)}
              title="View Information"
            >
              <Info size={16} />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="p-2" 
              onClick={() => onToggleOpened(item.id)}
              title={item.opened ? "Mark as Unopened" : "Mark as Opened"}
            >
              <RotateCcw size={16} />
            </Button>
          </div>
          
          {!showUsedOptions ? (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setShowUsedOptions(true)}
            >
              <Check size={16} className="mr-1" /> Used
            </Button>
          ) : (
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onMarkAsUsed(item, false);
                  setShowUsedOptions(false);
                }}
              >
                Used
              </Button>
              
              <Button 
                variant="success" 
                size="sm" 
                onClick={() => {
                  onMarkAsUsed(item, true);
                  setShowUsedOptions(false);
                }}
              >
                <ShoppingCart size={16} className="mr-1" />
                Add to List
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      {showInfo && (
        <ItemInfoModal
          item={item}
          onClose={() => setShowInfo(false)}
        />
      )}
    </>
  );
};

export default ItemCard;