// Common types used throughout the application

export type Category = 'food' | 'pharma' | 'cosmetics' | 'cleaning' | 'pet';

export interface Item {
  id: string; // Assuming UUID for items now
  name: string;
  category: Category;
  expiry_date?: Date;
  opened: boolean;
  quantity: number;
  unit: string;
  image_url?: string | null; // Keeping flexible as your SQL is text
  user_id?: string;
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
  id: string; // Changed to number (int4 in SQL)
  date: Date | null; // timestamp in SQL
  store?: string;
  total?: number; // numeric in SQL
  image_Url?: string;
  user_id?: string; // uuid in SQL
}

export interface Recipe {
  id: string; // Changed to number (int4 in SQL)
  title: string;
  type: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // int4 in SQL
  cookTime: number; // int4 in SQL
  image_url?: string;
  is_favorite?: boolean; // bool in SQL (note the underscore in the name)
  user_id?: string; // uuid in SQL
}

export interface ShoppingListItem {
  id: string; // Changed to number (int4 in SQL)
  name: string;
  quantity: number; // int4 in SQL
  unit: string;
  added: Date | null; // timestamp in SQL
  user_id?: string; // uuid in SQL
  image_url?: string | null; // Keeping flexible as your SQL is text
  category: Category | string; // Keeping flexible as your SQL is text
}

export interface UsedItem {
  id: string; // text in SQL
  name: string;
  category: Category | string; // Keeping flexible as your SQL is text
  quantity: number; // int4 in SQL
  unit: string;
  image_url?: string | null; // Keeping flexible as your SQL is text
  used_date: Date | null; // timestamp in SQL
  added_to_shopping_list: boolean;
    user_id?: string; // uuid in SQL
}