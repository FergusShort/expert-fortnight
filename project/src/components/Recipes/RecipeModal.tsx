import React from 'react';
import { X, Clock, Heart } from 'lucide-react';
import Button from '../ui/Button';
import { Recipe } from '../../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ 
  recipe, 
  onClose, 
  onToggleFavorite 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={recipe.is_favorite ? 'text-red-500' : ''}
              onClick={() => onToggleFavorite(recipe.id)}
            >
              <Heart size={16} fill={recipe.is_favorite ? 'currentColor' : 'none'} className="mr-1" />
              {recipe.is_favorite ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-1"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        
        {recipe.image_url && (
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            className="w-full h-64 object-cover"
          />
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-gray-500" />
              <span className="text-sm text-gray-600">
                <span className="font-medium">{recipe.prepTime + recipe.cookTime} mins</span>
                <span className="mx-1">•</span>
                <span>Prep: {recipe.prepTime} mins</span>
                <span className="mx-1">•</span>
                <span>Cook: {recipe.cookTime} mins</span>
              </span>
            </div>
            
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                ${recipe.type === 'panic' ? 'bg-red-100 text-red-800' : 
                  recipe.type === 'simple' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}
              >
                {recipe.type.charAt(0).toUpperCase() + recipe.type.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <ol className="list-decimal pl-5 space-y-3">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;