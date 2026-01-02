import React from 'react';
import { 
  TrendingUp, 
  Plus, 
  Users, 
  Settings, 
  Shuffle, 
  Shield, 
  X, 
  LogOut, 
  Target, 
  Calendar 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, isAdmin, onLogout, currentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, show: true },
    { id: 'addMatch', label: 'Add Match', icon: Plus, show: isAdmin },
    { id: 'matches', label: 'Match History', icon: Calendar, show: true },
    { id: 'players', label: 'All Players', icon: Users, show: true },
    { id: 'teamgen', label: 'Team Builder', icon: Shuffle, show: isAdmin },
    { id: 'goalkeeper', label: 'Goalkeepers', icon: Shield, show: true },
    { id: 'defender', label: 'Defenders', icon: Shield, show: true },
    { id: 'midfielder', label: 'Midfielders', icon: Users, show: true },
    { id: 'forward', label: 'Forwards', icon: Target, show: true },
    { id: 'settings', label: 'Admin Settings', icon: Settings, show: isAdmin },
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
              <h2 className="text-white font-bold text-lg">Football Tracker</h2>
              <p className="text-text-secondary text-xs">League Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-bg rounded-lg transition-colors md:hidden"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-dark-bg/50 border border-dark-border rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate text-sm">{currentUser?.username}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <p className="text-text-secondary text-[10px] uppercase tracking-wider font-bold">{currentUser?.role}</p>
              </div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/20'
                    : 'text-text-secondary hover:text-white hover:bg-dark-bg'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-dark-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
