import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Item, Recipe, Category, ShoppingListItem, UsedItem } from "../types";
import { supabase } from "../utils/supabase"; // Import your Supabase client

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
  addToShoppingList: (item: Omit<ShoppingListItem, "id" | "added"> & { image_url?: string | null }) => void;
  removeFromShoppingList: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
  searchRecipes: (ingredient: string) => Recipe[];
  markAllAsPurchased: () => Promise<void>; // Add the new function to the context
  removeFromUsedItems: (id: string) => Promise<void>; // Add removeFromUsedItems to the context
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{
  children: ReactNode;
  userId: string | undefined;
}> = ({ children, userId }) => {
  const [currentCategory, setCurrentCategory] = useState<Category>("food");
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
        .from("items")
        .select("*")
        .eq("user_id", currentUserId);

      if (itemsError) console.error("Error fetching items:", itemsError);
      else setItems(itemsData || []);

      // Fetch used items for the current user
      const { data: usedItemsData, error: usedItemsError } = await supabase
        .from("used_items")
        .select("*")
        .eq("user_id", currentUserId);

      if (usedItemsError)
        console.error("Error fetching used items:", usedItemsError);
      else {
        // Filter out items that have added_to_shopping_list as true
        const itemsToDelete = usedItemsData?.filter(usedItem => usedItem.added_to_shopping_list);
        setUsedItems(usedItemsData?.filter(usedItem => !usedItem.added_to_shopping_list) || []);

        // Delete the items from the database
        if (itemsToDelete && itemsToDelete.length > 0) {
          for (const itemToDelete of itemsToDelete) {
            const { error: deleteError } = await supabase
              .from("used_items")
              .delete()
              .eq("id", itemToDelete.id)
              .eq("user_id", currentUserId);
            if (deleteError)
              console.error("Error deleting used item:", deleteError);
          }
        }
      }

      // Fetch shopping list for the current user
      const { data: shoppingListData, error: shoppingListError } =
        await supabase
          .from("shopping_list")
          .select("*")
          .eq("user_id", currentUserId);

      if (shoppingListError)
        console.error("Error fetching shopping list:", shoppingListError);
      else setShoppingList(shoppingListData || []);

      // Fetch all recipes (assuming recipes are not user-specific, adjust if needed)
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select("*");

      if (recipesError) console.error("Error fetching recipes:", recipesError);
      else setRecipes(recipesData || []);

      // Fetch favorite recipes for the current user
      const { data: favoriteRecipesData, error: favoriteRecipesError } =
        await supabase
          .from("recipes")
          .select("*")
          .eq("user_id", currentUserId)
          .eq("is_favorite", true);

      if (favoriteRecipesError)
        console.error("Error fetching favorite recipes:", favoriteRecipesError);
      else setFavoriteRecipes(favoriteRecipesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const removeFromUsedItems = async (id: string) => {
    if (!userId) return;
    try {
      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from("used_items")
        .delete()
        .eq("id", id)
        .eq("user_id", userId); // Ensure we only delete the user's item
      if (deleteError)
        console.error("Error removing from used items:", deleteError);

      // Update the state
      setUsedItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from used items:", error);
    }
  };


  const markItemAsUsed = async (
    item: Item,
    shouldAddToShoppingList: boolean
  ) => {
    if (!userId) return; // Don't proceed if no user is logged in
    try {
      // Remove from items list (Supabase)
      const { error: deleteError } = await supabase
        .from("items")
        .delete()
        .eq("id", item.id)
        .eq("user_id", userId); // Ensure we only delete the user's item
      if (deleteError) console.error("Error deleting item:", deleteError);

      // Add to used items list (Supabase)
      const usedItem: UsedItem = {
        id: crypto.randomUUID(), // Generate a UUID for the used item
        name: item.name,
        category: item.category,
        quantity: item.quantity, // Add quantity
        unit: item.unit,       // Add unit
        image_url: item.image_url || null, // Add image_url
        used_date: new Date(),
        added_to_shopping_list: shouldAddToShoppingList, // <--- This is the column causing the error
        user_id: userId, // Associate with the current user
      };
      const { error: insertUsedError } = await supabase
        .from("used_items")
        .insert([usedItem]);
      if (insertUsedError)
        console.error("Error adding to used items:", insertUsedError);

      // Update local state
      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
      setUsedItems((prevUsed) => [usedItem, ...prevUsed]);

      // Add to shopping list if requested
      if (shouldAddToShoppingList) {
        addToShoppingList({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          image_url: item.image_url || null, // Pass image_url
        });
      }
    } catch (error) {
      console.error("Error marking item as used:", error);
    }
  };

  const toggleItemOpened = async (id: string) => {
    if (!userId) return;
    try {
      const item = items.find((item) => item.id === id);
      if (item) {
        const updatedItem = { ...item, opened: !item.opened };

        // Update the item in Supabase
        const { error: updateError } = await supabase
          .from("items")
          .update(updatedItem)
          .eq("id", id)
          .eq("user_id", userId); // Ensure we only update the user's item
        if (updateError)
          console.error("Error toggling item opened:", updateError);

        // Update the state
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updatedItem : item))
        );
      }
    } catch (error) {
      console.error("Error toggling item opened:", error);
    }
  };

  const addToShoppingList = async (
    item: Omit<ShoppingListItem, "id" | "added"> & { image_url?: string | null }
  ) => {
    if (!userId) return;
    try {
      const newItem: ShoppingListItem = {
        id: crypto.randomUUID(),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        added: new Date(),
        user_id: userId,
        image_url: item.image_url || null,
      };

      const { data: savedItem, error: insertError } = await supabase
        .from("shopping_list")
        .insert([newItem])
        .select("id, name, quantity, unit, category, added, user_id, image_url"); // Include image_url in select

      if (insertError)
        console.error("Error adding to shopping list:", insertError);
      else if (savedItem && savedItem.length > 0) {
        setShoppingList((prev) => [savedItem[0], ...prev]);
      }
    } catch (error) {
      console.error("Error adding to shopping list:", error);
    }
  };

  const removeFromShoppingList = async (id: string) => {
    if (!userId) return;
    try {
      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from("shopping_list")
        .delete()
        .eq("id", id)
        .eq("user_id", userId); // Ensure we only delete the user's item
      if (deleteError)
        console.error("Error removing from shopping list:", deleteError);

      // Update the state
      setShoppingList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from shopping list:", error);
    }
  };

  const toggleFavoriteRecipe = async (id: string) => {
    if (!userId) return;
    try {
      const recipe = recipes.find((r) => r.id === id);
      if (recipe) {
        const updatedRecipe = { ...recipe, isFavorite: !recipe.is_favorite };

        // Update in Supabase (assuming 'isFavorite' is a column in your 'recipes' table and you want to make it user-specific, you might need a separate 'user_favorites' table)
        const { error: updateError } = await supabase
          .from("recipes")
          .update(updatedRecipe)
          .eq("id", id);
        if (updateError)
          console.error("Error toggling favorite recipe:", updateError);

        // Update in state
        setRecipes((prevRecipes) =>
          prevRecipes.map((r) => (r.id === id ? updatedRecipe : r))
        );

        // Update favorite recipes in state
        if (updatedRecipe.isFavorite) {
          setFavoriteRecipes((prev) => [...prev, updatedRecipe]);
        } else {
          setFavoriteRecipes((prev) => prev.filter((r) => r.id !== id));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite recipe:", error);
    }
  };

  const searchRecipes = (ingredient: string): Recipe[] => {
    if (!ingredient.trim()) return [];
    return recipes.filter((recipe) =>
      recipe.ingredients.some((i) =>
        i.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
  };

  const markAllAsPurchased = async () => {
    if (!userId || shoppingList.length === 0) return;

    try {
      const purchasedItems = [...shoppingList]; // Create a copy to iterate over

      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      if (!accessToken) {
        console.error("No access token found.");
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseApiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Process each item in the shopping list
      for (const listItem of purchasedItems) {
        const url = `${supabaseUrl}/rest/v1/items?select=*&user_id=eq.${userId}&name=eq.${encodeURIComponent(listItem.name)}`;
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'apikey': supabaseApiKey || '',
        };

        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          console.error(`Error checking existing item (status ${response.status}):`, await response.text());
          continue;
        }

        const existingItems: Item[] = await response.json();
        const existingItem = existingItems.length > 0 ? existingItems[0] : null;

        if (existingItem) {
          // Item exists, update the quantity
          const updatedQuantity = (existingItem.quantity || 0) + listItem.quantity;
          const { error: updateError } = await supabase
            .from("items")
            .update({ quantity: updatedQuantity })
            .eq("id", existingItem.id)
            .eq("user_id", userId);

          if (updateError) {
            console.error("Error updating item quantity:", updateError);
            continue;
          }
        } else {
          // Item doesn't exist, create a new item
          const newItem: Omit<Item, "id" | "expiry_date"> & { image_url?: string | null } = {
            name: listItem.name,
            category: listItem.category as Category,
            opened: false,
            quantity: listItem.quantity,
            unit: listItem.unit,
            user_id: userId,
            image_url: listItem.image_url || null,
          };
          const { error: insertError } = await supabase
            .from("items")
            .insert([newItem]);

          if (insertError) {
            console.error("Error creating new item:", insertError);
            continue;
          }
        }

        // After processing, remove the item from the shopping list
        const { error: deleteError } = await supabase
          .from("shopping_list")
          .delete()
          .eq("id", listItem.id)
          .eq("user_id", userId);

        if (deleteError) {
          console.error("Error removing from shopping list:", deleteError);
        }
      }

      // After processing all items, refetch the items and shopping list
      fetchData(userId);
    } catch (error) {
      console.error("Error marking all as purchased:", error);
    }
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
        markAllAsPurchased, 
        removeFromUsedItems
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};