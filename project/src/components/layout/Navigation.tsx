import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, List, Search, User, LogOut } from 'lucide-react'; // Import LogOut icon
import CategoryDropdown from '../ui/CategoryDropdown';
import { useApp } from '../../contexts/AppContext';
import Logo from './Logo';
import { supabase } from '../../utils/supabase'; // Import your Supabase client

const Navigation: React.FC = () => {
  const { currentCategory, setCurrentCategory } = useApp();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      // Optionally display an error message to the user
    } else {
      console.log('User signed out successfully');
      navigate('/login'); // Redirect to the login page after sign out
    }
  };

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <div className="ml-6 hidden md:block">
              <CategoryDropdown
                currentCategory={currentCategory}
                onChange={setCurrentCategory}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center text-sm ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-500'}`
              }
              end
            >
              <Home size={20} />
              <span className="mt-1">Home</span>
            </NavLink>

            <NavLink
              to="/list"
              className={({ isActive }) =>
                `flex flex-col items-center text-sm ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-500'}`
              }
            >
              <List size={20} />
              <span className="mt-1">My List</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `flex flex-col items-center text-sm ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-500'}`
              }
            >
              <Search size={20} />
              <span className="mt-1">Recommendations</span>
            </NavLink>

            <NavLink
              to="/hub"
              className={({ isActive }) =>
                `flex flex-col items-center text-sm ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-500'}`
              }
            >
              <User size={20} />
              <span className="mt-1">My Hub</span>
            </NavLink>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center text-sm text-gray-600 hover:text-red-500 focus:outline-none"
            >
              <LogOut size={20} />
              <span className="mt-1">Sign Out</span>
            </button>
          </div>

          <div className="ml-4 md:hidden">
            <CategoryDropdown
              currentCategory={currentCategory}
              onChange={setCurrentCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;