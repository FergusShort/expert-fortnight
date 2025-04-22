import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Item, Recipe, Category, ShoppingListItem, UsedItem } from '../types';

// Access the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  const [items, setItems] = useState<Item[]>([]);
  const [usedItems, setUsedItems] = useState<UsedItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  // Fetch data from Supabase when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch items from Supabase
      const itemsResponse = await fetch(`${supabaseUrl}/rest/v1/items`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const itemsData: Item[] = await itemsResponse.json();
      setItems(itemsData);

      // Fetch used items from Supabase
      const usedItemsResponse = await fetch(`${supabaseUrl}/rest/v1/used_items`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const usedItemsData: UsedItem[] = await usedItemsResponse.json();
      setUsedItems(usedItemsData);

      // Fetch shopping list from Supabase
      const shoppingListResponse = await fetch(`${supabaseUrl}/rest/v1/shopping_list`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const shoppingListData: ShoppingListItem[] = await shoppingListResponse.json();
      setShoppingList(shoppingListData);

      // Fetch recipes from Supabase
      const recipesResponse = await fetch(`${supabaseUrl}/rest/v1/recipes`, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      const recipesData: Recipe[] = await recipesResponse.json();
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const markItemAsUsed = async (item: Item, shouldAddToShoppingList: boolean) => {
    try {
      // Remove from items list (Supabase)
      await fetch(`${supabaseUrl}/rest/v1/items?id=eq.${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Add to used items list (Supabase)
      const usedItem: UsedItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        usedDate: new Date(),
        addedToShoppingList: shouldAddToShoppingList,
      };
      await fetch(`${supabaseUrl}/rest/v1/used_items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usedItem),
      });

      // Add to shopping list if requested
      if (shouldAddToShoppingList) {
        addToShoppingList({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        });
      }
    } catch (error) {
      console.error('Error marking item as used:', error);
    }
  };

  const toggleItemOpened = async (id: string) => {
    try {
      const item = items.find(item => item.id === id);
      if (item) {
        const updatedItem = { ...item, opened: !item.opened };

        // Update the item in Supabase
        await fetch(`${supabaseUrl}/rest/v1/items?id=eq.${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedItem),
        });

        // Update the state
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? updatedItem : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling item opened:', error);
    }
  };

  const addToShoppingList = async (item: Omit<ShoppingListItem, 'id' | 'added'>) => {
    try {
      const newItem = { ...item, added: new Date() };

      // Save to Supabase
      const response = await fetch(`${supabaseUrl}/rest/v1/shopping_list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      const savedItem: ShoppingListItem = await response.json();

      // Add to state
      setShoppingList(prev => [savedItem, ...prev]);
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    }
  };

  const removeFromShoppingList = async (id: string) => {
    try {
      // Delete from Supabase
      await fetch(`${supabaseUrl}/rest/v1/shopping_list?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      // Update the state
      setShoppingList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from shopping list:', error);
    }
  };

  const toggleFavoriteRecipe = async (id: string) => {
    try {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        const updatedRecipe = { ...recipe, isFavorite: !recipe.isFavorite };

        // Update in Supabase
        await fetch(`${supabaseUrl}/rest/v1/recipes?id=eq.${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecipe),
        });

        // Update in state
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.id === id ? updatedRecipe : recipe
          )
        );

        // Update favorite recipes
        if (updatedRecipe.isFavorite) {
          setFavoriteRecipes(prev => [...prev, updatedRecipe]);
        } else {
          setFavoriteRecipes(prev => prev.filter(r => r.id !== id));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite recipe:', error);
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
