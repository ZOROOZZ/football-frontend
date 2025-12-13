import React from 'react';
import { TrendingUp, Plus, Users, Settings, Shuffle, Shield, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, show: true },
    { id: 'addMatch', label: 'Add Match', icon: Plus, show: isAdmin },
    { id: 'players', label: 'Players', icon: Users, show: true },
    { id: 'teamgen', label: 'Team Generator', icon: Shuffle, show: isAdmin },
    { id: 'goalkeeper', label: 'Goalkeepers', icon: Shield, show: true },
    { id: 'settings', label: 'Settings', icon: Settings, show: isAdmin },
  ];

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            if (!item.show) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
