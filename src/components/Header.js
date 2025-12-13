import React from 'react';
import { Target, LogOut, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = ({ currentUser, onLogout, error, showThemeToggle, onMenuToggle }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Open Menu"
          >
            <Menu className="text-gray-600 dark:text-gray-400" size={24} />
          </button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
              <Target className="text-blue-600 dark:text-blue-400" size={32} />
              <span className="leading-tight">Football Match Tracker</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              Track your team's performance and player statistics
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {showThemeToggle && <ThemeToggle />}
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {currentUser.username}{' '}
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {currentUser.role}
              </span>
            </p>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
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
