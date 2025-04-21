// Common types used throughout the application

export type Category = 'food' | 'pharma' | 'cosmetics' | 'cleaning' | 'pet';

export interface Item {
  id: string;
  name: string;
  category: Category;
  expiryDate: Date;
  opened: boolean;
  quantity: number;
  unit: string;
  info?: ItemInfo;
  imageUrl?: string;
}

export interface ItemInfo {
  bestBefore?: string;
  useBy?: string;
  bestStored?: string;
  nutritionalInfo?: string;
  ingredients?: string[];
  additional?: string;
}

export interface Recipe {
  id: string;
  title: string;
  type: 'panic' | 'simple' | 'gourmet';
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  imageUrl?: string;
  isFavorite?: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  added: Date;
}

export interface UsedItem extends Pick<Item, 'id' | 'name' | 'category'> {
  usedDate: Date;
  addedToShoppingList: boolean;
}

export interface Receipt {
  id: string;
  date: Date;
  items: Item[];
  store?: string;
  total?: number;
  imageUrl?: string;
}