import React from 'react';
import { Calendar, Search, ShoppingCart, RotateCcw } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';

const features = [
  {
    title: "Track Expiry Dates",
    description: "Color-coded system to easily identify items nearing expiration, so you'll never waste food or medicine again.",
    icon: <Calendar size={36} className="text-green-600" />,
  },
  {
    title: "Get Smart Recommendations",
    description: "Find recipes and uses for your items before they expire, from quick emergency meals to gourmet options.",
    icon: <Search size={36} className="text-green-600" />,
  },
  {
    title: "Manage Shopping List",
    description: "Automatically add used items to your shopping list and track what you need to buy on your next trip.",
    icon: <ShoppingCart size={36} className="text-green-600" />,
  },
  {
    title: "Reduce Waste",
    description: "Save money and help the environment by reducing food waste and making better use of resources.",
    icon: <RotateCcw size={36} className="text-green-600" />,
  },
];

const FeatureSection: React.FC = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose SmartExpire?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="h-full">
            <CardBody className="flex flex-col items-center text-center p-6">
              <div className="mb-4 p-3 bg-green-100 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;