// src/components/Header.js
import React from 'react';
import { Target, LogOut } from 'lucide-react';

const Header = ({ currentUser, onLogout, error }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
            <Target className="text-blue-600" size={32} />
            <span className="leading-tight">Football Match Tracker</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Track your team's performance and player statistics
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-2">
            {currentUser.username}{' '}
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Header;
