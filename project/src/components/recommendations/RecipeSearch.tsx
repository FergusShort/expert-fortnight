import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';
import RecipeCard from './RecipeCard';

const RecipeSearch: React.FC = () => {
  const { searchRecipes, toggleFavoriteRecipe } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<ReturnType<typeof searchRecipes>>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = searchRecipes(searchTerm);
      setRecipes(results);
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Group recipes by type
  const recipesByType = {
    panic: recipes.filter(recipe => recipe.type === 'panic'),
    simple: recipes.filter(recipe => recipe.type === 'simple'),
    gourmet: recipes.filter(recipe => recipe.type === 'gourmet'),
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Find Recipes</h2>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by ingredient (e.g., chicken)..."
              className="pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleSearch}
            disabled={!searchTerm.trim()}
          >
            Search
          </Button>
        </div>
      </div>
      
      {hasSearched && (
        <div className="space-y-8">
          {recipes.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">No recipes found for "{searchTerm}"</p>
              <p className="text-sm text-gray-400">Try searching for another ingredient</p>
            </div>
          ) : (
            <>
              {recipesByType.panic.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-600">
                    Panic Recipes (Use ingredients ASAP!)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipesByType.panic.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onToggleFavorite={toggleFavoriteRecipe}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {recipesByType.simple.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-yellow-600">
                    Simple Recipes (Quick &amp; Easy)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipesByType.simple.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onToggleFavorite={toggleFavoriteRecipe}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {recipesByType.gourmet.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">
                    Gourmet Recipes (More Involved)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipesByType.gourmet.map(recipe => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onToggleFavorite={toggleFavoriteRecipe}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {!hasSearched && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">Search for ingredients to find recipes</p>
          <p className="text-sm text-gray-500">Find the perfect recipe for items nearing expiration</p>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;