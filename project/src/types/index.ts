// Common types used throughout the application

export type Category = 'food' | 'pharma' | 'cosmetics' | 'cleaning' | 'pet';

export interface Item {
  id: string; // Assuming UUID for items now
  name: string;
  category: Category;
  expiryDate: Date | null;
  opened: boolean;
  quantity: number;
  unit: string;
  imageUrl?: string;
  user_id?: string;
  itemInfoId?: string; // Optional foreign key to item_info if you want to explicitly include it in the Item type
}

export interface ItemInfo {
  item_id: string; // Foreign key linking back to items
  bestBefore?: string;
  useBy?: string;
  bestStored?: string;
  nutritionalInfo?: string;
  ingredients?: string[];
  additional?: string;
}

export interface Profile {
  created_at: Date; // timestamptz in SQL
  user_id: string; // uuid in SQL
  firstName?: string; // Changed from first_name to follow TS convention
  lastName?: string;  // Changed from last_name to follow TS convention
  email?: string;
}

export interface Receipt {
  id: number; // Changed to number (int4 in SQL)
  date: Date | null; // timestamp in SQL
  store?: string;
  total?: number; // numeric in SQL
  imageUrl?: string;
  user_id?: string; // uuid in SQL
  items?: Item[]; // Assuming you might want to include items here
}

export interface Recipe {
  id: number; // Changed to number (int4 in SQL)
  title: string;
  type: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // int4 in SQL
  cookTime: number; // int4 in SQL
  imageUrl?: string;
  is_favorite?: boolean; // bool in SQL (note the underscore in the name)
  user_id?: string; // uuid in SQL
}

export interface ShoppingListItem {
  id: number; // Changed to number (int4 in SQL)
  name: string;
  quantity: number; // int4 in SQL
  unit: string;
  added: Date | null; // timestamp in SQL
  user_id?: string; // uuid in SQL
}

export interface UsedItem {
  id: string; // text in SQL
  name: string;
  category: Category | string; // Keeping flexible as your SQL is text
  usedDate: Date | null; // timestamp in SQL
  addedToShoppingList: boolean;
  user_id?: string; // uuid in SQL
}