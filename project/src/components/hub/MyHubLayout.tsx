import React, { useState } from 'react';
import { CreditCard, FileText } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import SmartCard from './SmartCard';
import ReceiptScanner from './ReceiptScanner';

const MyHubLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'card' | 'receipts'>('card');
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Hub</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`flex items-center px-6 py-3 ${
              activeTab === 'card' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('card')}
          >
            <CreditCard size={18} className="mr-2" />
            <span>My Smart Card</span>
          </button>
          
          <button 
            className={`flex items-center px-6 py-3 ${
              activeTab === 'receipts' ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('receipts')}
          >
            <FileText size={18} className="mr-2" />
            <span>Receipts</span>
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'card' && <SmartCard />}
          {activeTab === 'receipts' && <ReceiptScanner />}
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-3">Quick Tips</h3>
            <ul className="text-gray-700 space-y-2 list-disc pl-5">
              <li>Show your Smart Card at checkout to track purchases automatically</li>
              <li>Scan receipts for manual tracking of items</li>
              <li>Check your shopping list before heading to the store</li>
            </ul>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="font-medium">Added 4 items from Walmart</p>
                <p className="text-sm text-gray-500">Yesterday, 15:30</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Used Chicken Breast</p>
                <p className="text-sm text-gray-500">2 days ago, 18:45</p>
              </div>
              <div>
                <p className="font-medium">Added Milk to shopping list</p>
                <p className="text-sm text-gray-500">3 days ago, 10:15</p>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-3">Statistics</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Items tracked this month</p>
                <p className="font-bold text-lg">42</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items used before expiry</p>
                <p className="font-bold text-lg">38 (90%)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated savings</p>
                <p className="font-bold text-lg text-green-600">$87.50</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MyHubLayout;