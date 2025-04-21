import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Item, Recipe, Category, ShoppingListItem, UsedItem } from '../types';
import { 
  allItems, 
  mockRecipes, 
  mockShoppingList, 
  mockUsedItems 
} from '../data/mockData';
import { sortItemsByExpiry } from '../utils/expiryUtils';

interface AppContextProps {
  currentCategory: Category;
  setCurrentCategory: (category: Category) => void;
  items: Item[];
  usedItems: UsedItem[];
  shoppingList: ShoppingListItem[];
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  markItemAsUsed: (item: Item, addToShoppingList: boolean) => void;
  toggleItemOpened: (id: string) => void;
  addToShoppingList: (item: Omit<ShoppingListItem, 'id' | 'added'>) => void;
  removeFromShoppingList: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
  searchRecipes: (ingredient: string) => Recipe[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCategory, setCurrentCategory] = useState<Category>('food');
  const [items, setItems] = useState<Item[]>(sortItemsByExpiry(allItems));
  const [usedItems, setUsedItems] = useState<UsedItem[]>(mockUsedItems);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(mockShoppingList);
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  const markItemAsUsed = (item: Item, addToShoppingList: boolean) => {
    // Remove from items list
    setItems(prevItems => prevItems.filter(i => i.id !== item.id));
    
    // Add to used items list
    const usedItem: UsedItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      usedDate: new Date(),
      addedToShoppingList,
    };
    
    setUsedItems(prev => [usedItem, ...prev]);
    
    // Add to shopping list if requested
    if (addToShoppingList) {
      addToShoppingList({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      });
    }
  };

  const toggleItemOpened = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, opened: !item.opened } : item
      )
    );
  };

  const addToShoppingList = (item: Omit<ShoppingListItem, 'id' | 'added'>) => {
    const newItem: ShoppingListItem = {
      ...item,
      id: `sl-${Date.now()}`,
      added: new Date(),
    };
    
    setShoppingList(prev => [newItem, ...prev]);
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const toggleFavoriteRecipe = (id: string) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
    
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      if (recipe.isFavorite) {
        setFavoriteRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        setFavoriteRecipes(prev => [...prev, { ...recipe, isFavorite: true }]);
      }
    }
  };

  const searchRecipes = (ingredient: string): Recipe[] => {
    if (!ingredient.trim()) return [];
    
    return recipes.filter(recipe => 
      recipe.ingredients.some(i => 
        i.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentCategory,
        setCurrentCategory,
        items,
        usedItems,
        shoppingList,
        recipes,
        favoriteRecipes,
        markItemAsUsed,
        toggleItemOpened,
        addToShoppingList,
        removeFromShoppingList,
        toggleFavoriteRecipe,
        searchRecipes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};