import React from 'react';
import { Target, LogOut, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = ({ currentUser, onLogout, error, showThemeToggle, onMenuToggle }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex justify-between items-center">
        {/* Left Side - Menu + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0"
            title="Open Menu"
          >
            <Menu className="text-gray-600 dark:text-gray-400" size={24} />
          </button>
          
          {/* Title and Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Target className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={28} />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                Football Match Tracker
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Track your team's performance and player statistics
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Theme Toggle + User Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {showThemeToggle && <ThemeToggle />}
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
              {currentUser.username}{' '}
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                {currentUser.role}
              </span>
            </p>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 text-xs sm:text-sm ml-auto"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
          
          {/* Mobile User Menu */}
          <div className="sm:hidden">
            <button
              onClick={onLogout}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile User Info */}
      <div className="sm:hidden mt-3 pt-3 border-t dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Logged in as: <span className="font-semibold">{currentUser.username}</span>{' '}
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
            {currentUser.role}
          </span>
        </p>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Header;
