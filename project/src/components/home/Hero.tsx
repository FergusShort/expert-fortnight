import React from 'react';
import { ShoppingBag, Clock, Leaf } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative px-6 py-12 md:px-12 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Never waste food or medicine again
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          SmartExpire helps you track expiry dates, reduces waste, and saves money with smart recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/list">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white hover:bg-gray-100 border-white text-green-700 font-bold"
            >
              View My Items
            </Button>
          </Link>
          <Link to="/hub">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent hover:bg-green-600 border-white text-white font-bold"
            >
              Go to My Hub
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;