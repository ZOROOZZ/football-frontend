import React from 'react';
import { TrendingUp, Plus, Users, Settings, Shuffle, Shield, X, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, isAdmin, onLogout, currentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, show: true },
    { id: 'addMatch', label: 'New Match', icon: Plus, show: isAdmin },
    { id: 'players', label: 'Players', icon: Users, show: true },
    { id: 'teamgen', label: 'Team Builder', icon: Shuffle, show: isAdmin },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-dark-card border-r border-dark-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold">Football Tracker</h2>
              <p className="text-text-secondary text-xs">Menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{currentUser.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentUser.username}</p>
              <p className="text-text-secondary text-xs capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (!item.show) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25'
                    : 'text-text-secondary hover:text-white hover:bg-dark-bg'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-dark-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-error-red hover:bg-error-red/10 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
