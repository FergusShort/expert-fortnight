import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-white shadow-inner py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SmartExpire. All rights reserved.</p>
            <p className="mt-2">Helping you reduce waste and save money.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;