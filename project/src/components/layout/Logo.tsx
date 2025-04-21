import React from 'react';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center text-green-600 hover:text-green-700">
      <Timer size={28} className="mr-2" />
      <span className="text-xl font-bold">SmartExpire</span>
    </Link>
  );
};

export default Logo;