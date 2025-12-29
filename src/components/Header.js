import React from 'react';
import { Menu, User } from 'lucide-react';

const Header = ({ currentUser, onMenuToggle, activeTab }) => {
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      addMatch: 'New Match',
      players: 'Players',
      goalkeeper: 'Goalkeepers',
      teamgen: 'Team Builder',
      settings: 'Settings'
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <div className="bg-dark-card border-b border-dark-border px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-dark-bg rounded-xl transition-colors"
          >
            <Menu className="text-white" size={24} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-white font-medium text-sm">{currentUser.username}</p>
            <p className="text-text-secondary text-xs capitalize">{currentUser.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
