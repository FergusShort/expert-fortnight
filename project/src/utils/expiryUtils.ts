import { Item } from '../types';

// Calculate days until expiry for an item
export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Get expiry status color based on days until expiry
export const getExpiryStatusColor = (expiryDate: Date): string => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 1) {
    return 'red';
  } else if (daysUntilExpiry <= 2) {
    return 'yellow';
  } else {
    return 'green';
  }
};

// Get expiry status text based on days until expiry
export const getExpiryStatusText = (expiryDate: Date): string => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) {
    return 'Expired';
  } else if (daysUntilExpiry === 0) {
    return 'Expires today';
  } else if (daysUntilExpiry === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${daysUntilExpiry} days`;
  }
};

// Get CSS class for expiry status
export const getExpiryStatusClass = (expiryDate: Date): string => {
  const status = getExpiryStatusColor(expiryDate);
  
  switch (status) {
    case 'red':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'green':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

// Sort items by expiry date (soonest first)
export const sortItemsByExpiry = (items: Item[]): Item[] => {
  return [...items].sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
};

// Filter items by search term
export const filterItemsBySearchTerm = (items: Item[], searchTerm: string): Item[] => {
  if (!searchTerm.trim()) return items;
  
  const term = searchTerm.toLowerCase().trim();
  return items.filter(item => 
    item.name.toLowerCase().includes(term)
  );
};