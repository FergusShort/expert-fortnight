// ItemCard.tsx
import React, { useState } from "react";
import { Info, Check, ShoppingCart, RotateCcw, Edit } from "lucide-react";
import Card, { CardBody, CardFooter } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Item } from "../../types";
import {
  getExpiryStatusText,
  getExpiryStatusClass,
} from "../../utils/expiryUtils";
import ItemInfoModal from "./ItemInfoModal";

interface ItemCardProps {
  item: Item;
  onMarkAsUsed: (item: Item, addToShoppingList: boolean) => void;
  onToggleOpened: (id: string) => void;
  onEditItem: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onMarkAsUsed,
  onToggleOpened,
  onEditItem,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showUsedOptions, setShowUsedOptions] = useState(false);

  const expiryStatusClass = getExpiryStatusClass(
    item.expiry_date || new Date()
  );
  const expiryText = getExpiryStatusText(item.expiry_date || new Date());

  const cardBodyStyle: React.CSSProperties = {
    backgroundImage: `url('${item.image_url}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    padding: '8px',
  };

  const hasOpenedButton =
    item.foodsubcategory != null &&
    ['dairy', 'meat', 'bakery', 'canned', 'frozen'].includes(
      item.foodsubcategory.toLowerCase()
    );

  return (
    <>
      <Card className="h-full">
        <CardBody className="p-4 relative" style={cardBodyStyle}>
          <div
            className="absolute inset-0 rounded-md"
            style={{
              backgroundImage: `url('${item.image_url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(80%)',
            }}
          ></div>

          {/* Expiry Badge (Top Left) */}
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant={
                expiryStatusClass.includes("red")
                  ? "danger"
                  : expiryStatusClass.includes("yellow")
                    ? "warning"
                    : "success"
              }
              className="font-semibold inline-block"
            >
              {expiryText}
            </Badge>
          </div>

          {/* Opened Badge (Bottom Left) */}
          {hasOpenedButton && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge
                variant={item.opened ? 'warning' : 'success'}
                size="sm"
              >
                {item.opened ? 'Opened' : 'Unopened'}
              </Badge>
            </div>
          )}

          {/* Name, Quantity, Unit (Center with background) */}
          <div className="relative z-10 bg-white/70 rounded-lg p-2">
            <h3 className="text-lg font-semibold mb-0 text-gray-800">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.quantity} {item.unit}</p>
          </div>
        </CardBody>

        <CardFooter className="pt-0 border-t-0 flex justify-between items-center mt-2">
          <div className="flex space-x-1 flex-shrink-0 w-36">
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
              onClick={() => onEditItem(item)}
              title="Edit Item"
            >
              <Edit size={16} />
            </Button>
            {hasOpenedButton && (
              <Button
                variant="outline"
                size="sm"
                className="p-2"
                onClick={() => onToggleOpened(item.id)}
                title={item.opened ? 'Mark as Unopened' : 'Mark as Opened'}
              >
                <RotateCcw size={16} />
              </Button>
            )}
            {!hasOpenedButton && <div className="w-6" />}
          </div>

          {!showUsedOptions ? (
            <div className="w-20 ml-2">
              <Button
                variant="primary"
                size="sm"
                className="px-2 py-1 w-full text-xs"
                onClick={() => setShowUsedOptions(true)}
              >
                <Check size={14} className="mr-1" /> Used
              </Button>
            </div>
          ) : (
            <div className="flex space-x-1 w-32 ml-2">
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 w-14 text-xs"
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
                className="px-2 py-1 w-18 text-xs"
                onClick={() => {
                  onMarkAsUsed(item, true);
                  setShowUsedOptions(false);
                }}
              >
                <ShoppingCart size={14} className="mr-1" />
                Add
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {showInfo && (
        <ItemInfoModal item={item} onClose={() => setShowInfo(false)} />
      )}
    </>
  );
};

export default ItemCard;