import { Item, Recipe, Category, ShoppingListItem, UsedItem } from '../types';

// Helper function to create dates relative to today
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Mock food items
export const mockFoodItems: Item[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    category: 'food',
    expiryDate: daysFromNow(1),
    opened: false,
    quantity: 500,
    unit: 'g',
    info: {
      bestBefore: '2 days after purchase if refrigerated',
      useBy: 'See package date',
      bestStored: 'Refrigerated at 0-4°C',
      nutritionalInfo: 'High in protein, low in fat',
    },
    imageUrl: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Spinach',
    category: 'food',
    expiryDate: daysFromNow(2),
    opened: true,
    quantity: 200,
    unit: 'g',
    info: {
      bestBefore: '3-5 days if refrigerated',
      useBy: 'See package date',
      bestStored: 'Refrigerated in original packaging',
      nutritionalInfo: 'Rich in iron and vitamins',
    },
    imageUrl: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: 'Yogurt',
    category: 'food',
    expiryDate: daysFromNow(5),
    opened: false,
    quantity: 500,
    unit: 'g',
    info: {
      bestBefore: '7-10 days after opening if refrigerated',
      useBy: 'See package date',
      bestStored: 'Refrigerated at 0-4°C',
      nutritionalInfo: 'Good source of calcium and probiotics',
    },
    imageUrl: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    name: 'Bread',
    category: 'food',
    expiryDate: daysFromNow(0),
    opened: true,
    quantity: 1,
    unit: 'loaf',
    info: {
      bestBefore: '3-5 days at room temperature',
      useBy: 'See package date',
      bestStored: 'In a bread bin or paper bag',
      nutritionalInfo: 'Source of carbohydrates',
    },
    imageUrl: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Mock pharma items
export const mockPharmaItems: Item[] = [
  {
    id: '5',
    name: 'Paracetamol',
    category: 'pharma',
    expiryDate: daysFromNow(3),
    opened: true,
    quantity: 20,
    unit: 'tablets',
    info: {
      bestBefore: 'See package date',
      useBy: 'See package date',
      bestStored: 'Cool, dry place away from children',
      additional: 'Take as directed by your doctor',
    },
    imageUrl: 'https://images.pexels.com/photos/163944/pexels-photo-163944.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    name: 'Vitamin C',
    category: 'pharma',
    expiryDate: daysFromNow(14),
    opened: false,
    quantity: 60,
    unit: 'tablets',
    info: {
      bestBefore: '24 months from manufacturing date',
      useBy: 'See package date',
      bestStored: 'Cool, dry place',
      additional: 'Dietary supplement',
    },
    imageUrl: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Mock cosmetics items
export const mockCosmeticsItems: Item[] = [
  {
    id: '7',
    name: 'Facial Cleanser',
    category: 'cosmetics',
    expiryDate: daysFromNow(90),
    opened: true,
    quantity: 200,
    unit: 'ml',
    info: {
      bestBefore: '12 months after opening',
      useBy: 'See package',
      bestStored: 'Cool, dry place',
      additional: 'Use morning and evening',
    },
    imageUrl: 'https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Mock cleaning items
export const mockCleaningItems: Item[] = [
  {
    id: '8',
    name: 'All-Purpose Cleaner',
    category: 'cleaning',
    expiryDate: daysFromNow(180),
    opened: true,
    quantity: 750,
    unit: 'ml',
    info: {
      bestBefore: '24 months from manufacturing date',
      useBy: 'See package',
      bestStored: 'Cool, dry place away from children',
      additional: 'Keep away from direct sunlight',
    },
    imageUrl: 'https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Combine all items
export const allItems = [
  ...mockFoodItems,
  ...mockPharmaItems,
  ...mockCosmeticsItems,
  ...mockCleaningItems,
];

// Mock shopping list
export const mockShoppingList: ShoppingListItem[] = [
  {
    id: '1',
    name: 'Milk',
    quantity: 1,
    unit: 'liter',
    added: new Date(),
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: 12,
    unit: 'pcs',
    added: new Date(),
  },
  {
    id: '3',
    name: 'Fresh Tomatoes',
    quantity: 500,
    unit: 'g',
    added: new Date(),
  },
  {
    id: '4',
    name: 'Ground Coffee',
    quantity: 250,
    unit: 'g',
    added: new Date(),
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    quantity: 500,
    unit: 'g',
    added: new Date(),
  },
  {
    id: '6',
    name: 'Whole Grain Bread',
    quantity: 1,
    unit: 'loaf',
    added: new Date(),
  },
  {
    id: '7',
    name: 'Baby Spinach',
    quantity: 200,
    unit: 'g',
    added: new Date(),
  },
  {
    id: '8',
    name: 'Chicken Thighs',
    quantity: 1,
    unit: 'kg',
    added: new Date(),
  }
];

// Mock used items
export const mockUsedItems: UsedItem[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'food',
    usedDate: new Date(),
    addedToShoppingList: true,
  },
  {
    id: '2',
    name: 'Pasta',
    category: 'food',
    usedDate: new Date(),
    addedToShoppingList: false,
  },
];

// Mock function to get items by category
export const getItemsByCategory = (category: Category): Item[] => {
  return allItems.filter(item => item.category === category);
};

// Mock function to sort items by expiry date
export const sortItemsByExpiry = (items: Item[]): Item[] => {
  return [...items].sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
};

// Mock function to get recipes by ingredient
export const getRecipesByIngredient = (ingredient: string): Recipe[] => {
  return mockRecipes.filter(recipe => 
    recipe.ingredients.some(i => i.toLowerCase().includes(ingredient.toLowerCase()))
  );
};

// Mock recipes
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Quick Chicken Stir-Fry',
    type: 'panic',
    ingredients: ['Chicken Breast', 'Any vegetables', 'Soy sauce', 'Oil'],
    instructions: [
      'Dice chicken breast into small pieces',
      'Chop any vegetables you have on hand',
      'Heat oil in a pan and stir-fry chicken until cooked',
      'Add vegetables and stir-fry for 2-3 minutes',
      'Add soy sauce and serve hot',
    ],
    prepTime: 5,
    cookTime: 10,
    imageUrl: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'Simple Chicken Salad',
    type: 'simple',
    ingredients: ['Chicken Breast', 'Spinach', 'Tomatoes', 'Olive oil', 'Lemon juice', 'Salt', 'Pepper'],
    instructions: [
      'Cook chicken breast and slice into strips',
      'Wash and dry spinach leaves',
      'Dice tomatoes',
      'Combine all ingredients in a bowl',
      'Drizzle with olive oil and lemon juice',
      'Season with salt and pepper to taste',
    ],
    prepTime: 10,
    cookTime: 15,
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'Gourmet Chicken Parmesan',
    type: 'gourmet',
    ingredients: [
      'Chicken Breast',
      'Breadcrumbs',
      'Parmesan cheese',
      'Mozzarella cheese',
      'Tomato sauce',
      'Fresh basil',
      'Olive oil',
      'Salt',
      'Pepper',
      'Garlic powder',
    ],
    instructions: [
      'Pound chicken breasts to even thickness',
      'Season with salt, pepper, and garlic powder',
      'Dip in beaten egg, then coat with breadcrumbs mixed with parmesan',
      'Heat olive oil in a pan and cook chicken until golden brown on both sides',
      'Transfer to a baking dish, top with tomato sauce and mozzarella',
      'Bake at 180°C until cheese is bubbly and chicken is cooked through',
      'Garnish with fresh basil before serving',
    ],
    prepTime: 20,
    cookTime: 25,
    imageUrl: 'https://images.pexels.com/photos/4194614/pexels-photo-4194614.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];