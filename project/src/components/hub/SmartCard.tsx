import React from 'react';
import { Timer, Download } from 'lucide-react';
import Button from '../ui/Button';

// Mock barcode generation - in a real app, we would use a barcode library
const generateBarcodePattern = (): string => {
  const pattern = [];
  for (let i = 0; i < 70; i++) {
    const width = Math.random() > 0.7 ? 3 : 1;
    pattern.push(`<div class="h-full w-${width} bg-black mx-px"></div>`);
  }
  return pattern.join('');
};

const mockUserId = "SE-" + Math.floor(10000000 + Math.random() * 90000000);

const SmartCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl w-full p-6 text-white shadow-lg transform transition-transform hover:scale-105 duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <Timer size={28} className="mr-2" />
            <h3 className="text-2xl font-bold">SmartExpire</h3>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">SmartCard</p>
            <p className="font-bold">{mockUserId}</p>
          </div>
        </div>
        
        <div className="mb-5">
          <p className="text-xs opacity-80 mb-1">Cardholder</p>
          <p className="font-semibold text-lg">Jane Smith</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Timer size={120} className="text-green-500" />
          </div>
          
          <div className="relative h-16 flex items-center">
            <div dangerouslySetInnerHTML={{ __html: generateBarcodePattern() }} className="flex h-full"></div>
          </div>
          
          <p className="text-center mt-2 text-sm font-mono text-gray-700">{mockUserId}</p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Present your SmartCard at checkout to automatically track your purchases. Cashiers can scan this barcode to add items to your SmartExpire account.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Download
          </Button>
          
          <Button variant="primary" className="flex items-center">
            Add to Apple Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartCard;