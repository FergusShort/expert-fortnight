import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { Item, ItemInfo } from '../../types';
import { getExpiryStatusText } from '../../utils/expiryUtils';
import { supabase } from '../../utils/supabase'; // Import your Supabase client

interface ItemInfoModalProps {
  item: Item;
  onClose: () => void;
}

const ItemInfoModal: React.FC<ItemInfoModalProps> = ({ item, onClose }) => {
  const [itemInfo, setItemInfo] = useState<ItemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('item_info')
          .select('*')
          .eq('item_id', item.id)
          .maybeSingle<ItemInfo>(); // Use maybeSingle()

        if (error) {
          setError(error.message);
        } else {
          setItemInfo(data); // data will be null if no matching row
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [item.id]);

  if (loading) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">Loading item details...</div>;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        Error loading item details: {error}
      </div>
    );
  }

  //  Handle the case where no item info is found.
  if (!itemInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-end">
            <Button
              variant="outline" // Changed from "ghost" to "outline"
              size="sm" // Changed from "icon" to "sm" to match the allowed types.
              onClick={onClose}
              className="ml-auto p-1" // Added p-1 to the button
            >
              <X size={20} />
            </Button>
          </div>
          <p className="text-gray-700">No additional information available for this item.</p>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          {item.image_url && (
            <img
              src={item.image_url}
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
                <div className="font-medium">{getExpiryStatusText(item.expiry_date || new Date())}</div>
              </div>
            </div>

            {itemInfo && (
              <div>
                <h3 className="font-semibold text-green-700 mb-1">Storage & Usage Information</h3>
                <div className="space-y-2 text-sm">
                  {itemInfo.bestBefore && (
                    <div>
                      <span className="text-gray-600">Best Before: </span>
                      <span>{itemInfo.bestBefore}</span>
                    </div>
                  )}

                  {itemInfo.useBy && (
                    <div>
                      <span className="text-gray-600">Use By: </span>
                      <span>{itemInfo.useBy}</span>
                    </div>
                  )}

                  {itemInfo.bestStored && (
                    <div>
                      <span className="text-gray-600">Best Stored: </span>
                      <span>{itemInfo.bestStored}</span>
                    </div>
                  )}

                  {itemInfo.nutritionalInfo && (
                    <div>
                      <span className="text-gray-600">Nutritional Info: </span>
                      <span>{itemInfo.nutritionalInfo}</span>
                    </div>
                  )}

                  {itemInfo.additional && (
                    <div>
                      <span className="text-gray-600">Additional Info: </span>
                      <span>{itemInfo.additional}</span>
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
