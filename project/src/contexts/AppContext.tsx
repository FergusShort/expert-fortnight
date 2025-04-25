// AppContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Item, Recipe, Category, ShoppingListItem, UsedItem } from "../types"; // Import Profile
import { supabase } from "../utils/supabase"; // Import your Supabase client

type AppCategory = Category | 'all'; // Define a new type

interface AppContextProps {
  userId: string | undefined;
  currentCategory: AppCategory; // Use the new type
  setCurrentCategory: (category: AppCategory) => void; // Use the new type
  items: Item[];
  usedItems: UsedItem[];
  shoppingList: ShoppingListItem[];
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  foodSubcategories: string[]; // New state for food subcategories
  markItemAsUsed: (item: Item, addToShoppingList: boolean) => void;
  toggleItemOpened: (id: string) => void;
  addToShoppingList: (
    item: Omit<ShoppingListItem, "id" | "added"> & {
      image_url?: string | null;
      foodsubcategory?: string | null; // Include foodsubcategory
    }
  ) => void;
  removeFromShoppingList: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
  searchRecipes: (ingredient: string) => Recipe[];
  markAllAsPurchased: () => Promise<void>;
  removeFromUsedItems: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{
  children: ReactNode;
  userId: string | undefined;
}> = ({ children, userId }) => {
  const [currentCategory, setCurrentCategory] = useState<AppCategory>("all"); // Initialize to 'all'
  const [items, setItems] = useState<Item[]>([]);
  const [usedItems, setUsedItems] = useState<UsedItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [foodSubcategories] = useState([
    "produce",
    "dairy",
    "meat",
    "bakery",
    "canned",
    "frozen",
    "other",
  ]); // Updated foodSubcategories

  useEffect(() => {
    if (userId) {
      fetchData(userId);
    } else {
      setItems([]);
      setUsedItems([]);
      setShoppingList([]);
      setRecipes([]);
      setFavoriteRecipes([]);
    }
  }, [userId]);

  const fetchData = async (currentUserId: string) => {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", currentUserId);

      if (itemsError) console.error("Error fetching items:", itemsError);
      else setItems(itemsData || []);

      const { data: usedItemsData, error: usedItemsError } = await supabase
        .from("used_items")
        .select("*")
        .eq("user_id", currentUserId);

      if (usedItemsError)
        console.error("Error fetching used items:", usedItemsError);
      else {
        const itemsToDelete = usedItemsData?.filter(
          (usedItem) => usedItem.added_to_shopping_list
        );
        setUsedItems(
          usedItemsData?.filter((usedItem) => !usedItem.added_to_shopping_list) || []
        );

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

      const { data: shoppingListData, error: shoppingListError } = await supabase
        .from("shopping_list")
        .select("*")
        .eq("user_id", currentUserId);

      if (shoppingListError)
        console.error("Error fetching shopping list:", shoppingListError);
      else setShoppingList(shoppingListData || []);

      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select("*");

      if (recipesError) console.error("Error fetching recipes:", recipesError);
      else setRecipes(recipesData || []);

      const { data: favoriteRecipesData, error: favoriteRecipesError } = await supabase
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
      const { error: deleteError } = await supabase
        .from("used_items")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (deleteError)
        console.error("Error removing from used items:", deleteError);

      setUsedItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from used items:", error);
    }
  };

  const markItemAsUsed = async (
    item: Item,
    shouldAddToShoppingList: boolean
  ) => {
    if (!userId) return;
    try {
      const { error: deleteError } = await supabase
        .from("items")
        .delete()
        .eq("id", item.id)
        .eq("user_id", userId);
      if (deleteError) console.error("Error deleting item:", deleteError);

      if (!shouldAddToShoppingList) {
        const usedItem: UsedItem = {
          id: crypto.randomUUID(),
          name: item.name,
          category: item.category,
          foodsubcategory: item.foodsubcategory || undefined, // Add foodsubcategory
          quantity: item.quantity,
          unit: item.unit,
          image_url: item.image_url || null,
          used_date: new Date(),
          added_to_shopping_list: false, // Explicitly set to false
          user_id: userId,
        };
        const { error: insertUsedError } = await supabase
          .from("used_items")
          .insert([usedItem]);
        if (insertUsedError)
          console.error("Error adding to used items:", insertUsedError);

        setUsedItems((prevUsed) => [usedItem, ...prevUsed]);
      }

      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));

      if (shouldAddToShoppingList) {
        addToShoppingList({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          image_url: item.image_url || null,
          foodsubcategory: item.foodsubcategory || undefined, // Pass foodsubcategory if it exists
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

        const { error: updateError } = await supabase
          .from("items")
          .update(updatedItem)
          .eq("id", id)
          .eq("user_id", userId);
        if (updateError)
          console.error("Error toggling item opened:", updateError);

        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updatedItem : item))
        );
      }
    } catch (error) {
      console.error("Error toggling item opened:", error);
    }
  };

  const addToShoppingList = async (
    item: Omit<ShoppingListItem, "id" | "added"> & {
      image_url?: string | null;
      foodsubcategory?: string | null; // Receive foodsubcategory
    }
  ) => {
    if (!userId) return;
    try {
      const newItem: ShoppingListItem = {
        id: crypto.randomUUID(),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        foodsubcategory: item.foodsubcategory || undefined, // Store foodsubcategory
        added: new Date(),
        user_id: userId,
        image_url: item.image_url || null,
      };

      const { data: savedItem, error: insertError } = await supabase
        .from("shopping_list")
        .insert([newItem])
        .select(
          "id, name, quantity, unit, category, foodsubcategory, added, user_id, image_url"
        );

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
      const { error: deleteError } = await supabase
        .from("shopping_list")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (deleteError)
        console.error("Error removing from shopping list:", deleteError);

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

        const { error: updateError } = await supabase
          .from("recipes")
          .update(updatedRecipe)
          .eq("id", id);
        if (updateError)
          console.error("Error toggling favorite recipe:", updateError);

        setRecipes((prevRecipes) =>
          prevRecipes.map((r) => (r.id === id ? updatedRecipe : r))
        );

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
      const purchasedItems = [...shoppingList];

      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      if (!accessToken) {
        console.error("No access token found.");
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseApiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      for (const listItem of purchasedItems) {
        const url = `${supabaseUrl}/rest/v1/items?select=*&user_id=eq.${userId}&name=eq.${encodeURIComponent(listItem.name)}`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseApiKey || "",
        };

        const response = await fetch(url, {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          console.error(
            `Error checking existing item (status ${response.status}):`,
            await response.text()
          );
          continue;
        }

        const existingItems: Item[] = await response.json();
        const existingItem = existingItems.length > 0 ? existingItems[0] : null;

        if (existingItem) {
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
          const newItem: Omit<Item, "id" | "expiry_date"> & {
            image_url?: string | null;
            foodsubcategory?: string | null; // Include foodsubcategory
          } = {
            name: listItem.name,
            category: listItem.category as Category,
            foodsubcategory: listItem.foodsubcategory || undefined, // Store foodsubcategory
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

        const { error: deleteError } = await supabase
          .from("shopping_list")
          .delete()
          .eq("id", listItem.id)
          .eq("user_id", userId);

        if (deleteError) {
          console.error("Error removing from shopping list:", deleteError);
        }
      }

      fetchData(userId);
    } catch (error) {
      console.error("Error marking all as purchased:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        currentCategory,
        setCurrentCategory,
        items,
        usedItems,
        shoppingList,
        recipes,
        favoriteRecipes,
        foodSubcategories, // Expose foodSubcategories
        markItemAsUsed,
        toggleItemOpened,
        addToShoppingList,
        removeFromShoppingList,
        toggleFavoriteRecipe,
        searchRecipes,
        markAllAsPurchased,
        removeFromUsedItems,
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