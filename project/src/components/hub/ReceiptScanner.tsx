import React, { useState } from 'react';
import { Upload, Camera, Check, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardBody } from '../ui/Card';

const ReceiptScanner: React.FC = () => {
  const [scanStatus, setScanStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [lastUpload, setLastUpload] = useState<Date | null>(null);
  
  const handleUpload = () => {
    setScanStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      setScanStatus(success ? 'success' : 'error');
      
      if (success) {
        setLastUpload(new Date());
      }
      
      // Reset state after a few seconds
      setTimeout(() => {
        setScanStatus('idle');
      }, 3000);
    }, 2000);
  };
  
  // Mock receipts
  const recentReceipts = [
    { id: 1, store: 'Walmart', date: '2025-03-15', items: 8 },
    { id: 2, store: 'Target', date: '2025-03-10', items: 5 },
    { id: 3, store: 'Kroger', date: '2025-03-05', items: 12 },
  ];

  return (
    <div>
      <div className="max-w-xl mx-auto mb-8">
        <h3 className="text-xl font-semibold mb-4">Scan Receipt</h3>
        
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {scanStatus === 'idle' && (
            <>
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-6">
                Upload a photo of your receipt or take a photo now
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" onClick={handleUpload}>
                  <Upload size={16} className="mr-2" />
                  Upload Receipt
                </Button>
                
                <Button variant="primary" onClick={handleUpload}>
                  <Camera size={16} className="mr-2" />
                  Take Photo
                </Button>
              </div>
            </>
          )}
          
          {scanStatus === 'uploading' && (
            <div className="py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-300 h-12 w-12 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
              <p className="text-gray-600 mt-4">Processing your receipt...</p>
            </div>
          )}
          
          {scanStatus === 'success' && (
            <div className="py-8 text-green-600">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Check size={32} />
                </div>
                <p className="font-semibold text-lg mb-2">Receipt Processed!</p>
                <p className="text-gray-600">
                  {lastUpload ? `Uploaded at ${lastUpload.toLocaleTimeString()}` : ''}
                </p>
              </div>
            </div>
          )}
          
          {scanStatus === 'error' && (
            <div className="py-8 text-red-600">
              <div className="flex flex-col items-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <AlertTriangle size={32} />
                </div>
                <p className="font-semibold text-lg mb-2">Processing Failed</p>
                <p className="text-gray-600">
                  Please try again with a clearer image
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Supported formats: JPG, PNG</p>
          <p>For best results, ensure the receipt is well-lit and text is clearly visible</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Receipts</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentReceipts.map(receipt => (
            <Card key={receipt.id} hoverable>
              <CardBody>
                <h4 className="font-semibold mb-1">{receipt.store}</h4>
                <p className="text-sm text-gray-500 mb-2">{receipt.date}</p>
                <p className="text-sm">{receipt.items} items added</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;