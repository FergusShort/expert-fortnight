import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Item, Recipe, Category, ShoppingListItem, UsedItem } from '../types';
import { supabase } from '../utils/supabase'; // Import your Supabase client

interface AppContextProps {
  userId: string | undefined; // Add userId to the context
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

export const AppProvider: React.FC<{ children: ReactNode; userId: string | undefined }> = ({ children, userId }) => {
  const [currentCategory, setCurrentCategory] = useState<Category>('food');
  const [items, setItems] = useState<Item[]>([]);
  const [usedItems, setUsedItems] = useState<UsedItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  // Fetch data from Supabase when the component mounts OR userId changes
  useEffect(() => {
    if (userId) {
      fetchData(userId);
    } else {
      // Optionally clear state if no user is logged in
      setItems([]);
      setUsedItems([]);
      setShoppingList([]);
      setRecipes([]);
      setFavoriteRecipes([]);
    }
  }, [userId]); // Re-run effect when userId changes

  const fetchData = async (currentUserId: string) => {
    try {
      // Fetch items for the current user
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', currentUserId); // Assuming you have a 'user_id' column

      if (itemsError) console.error('Error fetching items:', itemsError);
      else setItems(itemsData || []);

      // Fetch used items for the current user
      const { data: usedItemsData, error: usedItemsError } = await supabase
        .from('used_items')
        .select('*')
        .eq('user_id', currentUserId); // Assuming you have a 'user_id' column

      if (usedItemsError) console.error('Error fetching used items:', usedItemsError);
      else setUsedItems(usedItemsData || []);

      // Fetch shopping list for the current user
      const { data: shoppingListData, error: shoppingListError } = await supabase
        .from('shopping_list')
        .select('*')
        .eq('user_id', currentUserId); // Assuming you have a 'user_id' column

      if (shoppingListError) console.error('Error fetching shopping list:', shoppingListError);
      else setShoppingList(shoppingListData || []);

      // Fetch all recipes (assuming recipes are not user-specific, adjust if needed)
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*');

      if (recipesError) console.error('Error fetching recipes:', recipesError);
      else setRecipes(recipesData || []);

      // Fetch favorite recipes for the current user (you might need a separate table or a flag in the recipes table)
      // This example assumes a boolean 'isFavorite' column in the recipes table that is user-specific.
      const { data: favoriteRecipesData, error: favoriteRecipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', currentUserId) // Assuming user-specific favorites
        .eq('isFavorite', true);

      if (favoriteRecipesError) console.error('Error fetching favorite recipes:', favoriteRecipesError);
      else setFavoriteRecipes(favoriteRecipesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const markItemAsUsed = async (item: Item, shouldAddToShoppingList: boolean) => {
    if (!userId) return; // Don't proceed if no user is logged in
    try {
      // Remove from items list (Supabase)
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .eq('id', item.id)
        .eq('user_id', userId); // Ensure we only delete the user's item
      if (deleteError) console.error('Error deleting item:', deleteError);

      // Add to used items list (Supabase)
      const usedItem: UsedItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        usedDate: new Date(),
        addedToShoppingList: shouldAddToShoppingList,
        user_id: userId, // Associate with the current user
      };
      const { error: insertUsedError } = await supabase
        .from('used_items')
        .insert([usedItem]);
      if (insertUsedError) console.error('Error adding to used items:', insertUsedError);

      // Update local state
      setItems(prevItems => prevItems.filter(i => i.id !== item.id));
      setUsedItems(prevUsed => [usedItem, ...prevUsed]);

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
    if (!userId) return;
    try {
      const item = items.find(item => item.id === id);
      if (item) {
        const updatedItem = { ...item, opened: !item.opened };

        // Update the item in Supabase
        const { error: updateError } = await supabase
          .from('items')
          .update(updatedItem)
          .eq('id', id)
          .eq('user_id', userId); // Ensure we only update the user's item
        if (updateError) console.error('Error toggling item opened:', updateError);

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
    if (!userId) return;
    try {
      const newItem = { ...item, added: new Date(), user_id: userId }; // Associate with the current user

      // Save to Supabase
      const { data: savedItem, error: insertError } = await supabase
        .from('shopping_list')
        .insert([newItem])
        .select(); // It's good practice to select the inserted data

      if (insertError) console.error('Error adding to shopping list:', insertError);
      else if (savedItem && savedItem.length > 0) {
        // Add to state
        setShoppingList(prev => [savedItem[0], ...prev]);
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    }
  };

  const removeFromShoppingList = async (id: string) => {
    if (!userId) return;
    try {
      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Ensure we only delete the user's item
      if (deleteError) console.error('Error removing from shopping list:', deleteError);

      // Update the state
      setShoppingList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing from shopping list:', error);
    }
  };

  const toggleFavoriteRecipe = async (id: string) => {
    if (!userId) return;
    try {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        const updatedRecipe = { ...recipe, isFavorite: !recipe.isFavorite };

        // Update in Supabase (assuming 'isFavorite' is a column in your 'recipes' table and you want to make it user-specific, you might need a separate 'user_favorites' table)
        const { error: updateError } = await supabase
          .from('recipes')
          .update(updatedRecipe)
          .eq('id', id);
        if (updateError) console.error('Error toggling favorite recipe:', updateError);

        // Update in state
        setRecipes(prevRecipes =>
          prevRecipes.map(r => (r.id === id ? updatedRecipe : r))
        );

        // Update favorite recipes in state
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
        userId, // Make userId available in the context
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