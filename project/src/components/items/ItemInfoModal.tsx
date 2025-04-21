import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { Item } from '../../types';
import { getExpiryStatusText } from '../../utils/expiryUtils';

interface ItemInfoModalProps {
  item: Item;
  onClose: () => void;
}

const ItemInfoModal: React.FC<ItemInfoModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{item.name} Information</h2>
          <Button
            variant="outline"
            size="sm"
            className="p-1"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="p-4">
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-1">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Category:</div>
                <div className="font-medium capitalize">{item.category}</div>
                
                <div className="text-gray-600">Quantity:</div>
                <div className="font-medium">{item.quantity} {item.unit}</div>
                
                <div className="text-gray-600">Status:</div>
                <div className="font-medium">{item.opened ? 'Opened' : 'Unopened'}</div>
                
                <div className="text-gray-600">Expiry:</div>
                <div className="font-medium">{getExpiryStatusText(item.expiryDate)}</div>
              </div>
            </div>
            
            {item.info && (
              <div>
                <h3 className="font-semibold text-green-700 mb-1">Storage & Usage Information</h3>
                <div className="space-y-2 text-sm">
                  {item.info.bestBefore && (
                    <div>
                      <span className="text-gray-600">Best Before: </span>
                      <span>{item.info.bestBefore}</span>
                    </div>
                  )}
                  
                  {item.info.useBy && (
                    <div>
                      <span className="text-gray-600">Use By: </span>
                      <span>{item.info.useBy}</span>
                    </div>
                  )}
                  
                  {item.info.bestStored && (
                    <div>
                      <span className="text-gray-600">Best Stored: </span>
                      <span>{item.info.bestStored}</span>
                    </div>
                  )}
                  
                  {item.info.nutritionalInfo && (
                    <div>
                      <span className="text-gray-600">Nutritional Info: </span>
                      <span>{item.info.nutritionalInfo}</span>
                    </div>
                  )}
                  
                  {item.info.additional && (
                    <div>
                      <span className="text-gray-600">Additional Info: </span>
                      <span>{item.info.additional}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Button variant="primary" fullWidth onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemInfoModal;