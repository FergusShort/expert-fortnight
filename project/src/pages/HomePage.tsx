import React from "react";
import Hero from "../components/home/Hero";
import FeatureSection from "../components/home/FeatureSection";
import Card, { CardBody } from "../components/ui/Card";
import { useApp } from "../contexts/AppContext";
import { Leaf, ShoppingBag, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const { items } = useApp();

  if (!Array.isArray(items)) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <p>Loading your data...</p>
        {/* Optional: Add a loading spinner */}
      </div>
    );
  }

  // Count items by expiry status
  const expiringSoon = items.filter((item) => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  }).length;

  return (
    <div className="space-y-12">
      <Hero />
      <FeatureSection />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <ShoppingBag size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Quick Stats</h3>
                <p className="text-gray-600">Track your progress</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Items Tracked</span>
                <span className="font-semibold">{items.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expiring Soon</span>
                <span className="font-semibold text-orange-600">
                  {expiringSoon}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Money Saved This Month</span>
                <span className="font-semibold text-green-600">$45.75</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Carbon Footprint Reduced</span>
                <span className="font-semibold text-green-600">12 kg CO₂</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/list">
                <Button variant="outline" className="w-full justify-between">
                  <span>View All Items</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Leaf size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  Environmental Impact
                </h3>
                <p className="text-gray-600">Your contribution matters</p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              By reducing food waste, you're making a significant environmental
              impact. Every item saved helps reduce greenhouse gas emissions and
              conserves resources.
            </p>

            <div className="space-y-3">
              <div className="bg-gray-100 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Your waste reduction goal</span>
                <span className="font-medium">65%</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Did you know?</strong> The average household wastes
                approximately 30% of the food they purchase. By using
                SmartExpire, you can reduce this by up to 80%.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
