import React, { useState } from 'react';
import { Clock, Heart } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Recipe } from '../../types';
import RecipeModal from './RecipeModal';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onToggleFavorite }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      <Card hoverable className="h-full transition-all duration-300">
        <CardBody className="p-0">
          {recipe.imageUrl && (
            <div className="h-48 overflow-hidden">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
            
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <Clock size={14} className="mr-1" />
              <span>{recipe.prepTime + recipe.cookTime} mins</span>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Main ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {ingredient}
                  </span>
                ))}
                {recipe.ingredients.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{recipe.ingredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="border-t flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className={recipe.is_favorite ? 'text-red-500' : ''}
            onClick={() => onToggleFavorite(recipe.id)}
          >
            <Heart size={16} fill={recipe.is_favorite ? 'currentColor' : 'none'} />
          </Button>
          
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowDetails(true)}
          >
            View Recipe
          </Button>
        </CardFooter>
      </Card>
      
      {showDetails && (
        <RecipeModal 
          recipe={recipe} 
          onClose={() => setShowDetails(false)} 
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  );
};

export default RecipeCard;