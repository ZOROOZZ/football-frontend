import React, { useState } from 'react';
import { Search, ChevronRight, Target, Users as UsersIcon, TrendingUp, Shield } from 'lucide-react';
import { detectPosition, getPositionColor, getPositionBadgeColor, getPlayerStyle } from '../utils/playerUtils';

const Players = ({ players, isAdmin, onDeletePlayer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All Players');
  const [sortBy, setSortBy] = useState('goals');

  const positions = ['All Players', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  const getPlayerStats = (player) => {
    const position = detectPosition(player);
    
    if (position === 'Goalkeeper') {
      return [
        { label: 'CLEAN SHEETS', value: player.clean_sheets || 0, color: 'text-success-green' },
        { label: 'SAVES', value: player.total_saves || 0, color: 'text-primary-blue' },
        { label: 'MATCHES', value: player.matches_played || 0, color: 'text-warning-orange' }
      ];
    }
    return [
      { label: 'GOALS', value: player.total_goals || 0, color: 'text-primary-blue' },
      { label: 'ASSISTS', value: player.total_assists || 0, color: 'text-success-green' },
      { label: 'MATCHES', value: player.matches_played || 0, color: 'text-warning-orange' }
    ];
  };

  const getPositionIcon = (position) => {
    if (position === 'Goalkeeper') return Shield;
    if (position === 'Forward') return Target;
    if (position === 'Midfielder') return UsersIcon;
    return Shield;
  };

  // Add automatic position to each player
  const playersWithPosition = players.map(p => ({
    ...p,
    autoPosition: detectPosition(p),
    playerStyle: getPlayerStyle(p)
  }));

  const filteredPlayers = playersWithPosition
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = filterPosition === 'All Players' || player.autoPosition === filterPosition;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      if (sortBy === 'goals') return (b.total_goals || 0) - (a.total_goals || 0);
      if (sortBy === 'assists') return (b.total_assists || 0) - (a.total_assists || 0);
      if (sortBy === 'matches') return (b.matches_played || 0) - (a.matches_played || 0);
      return 0;
    });

  // Calculate position distribution
  const positionStats = {
    Forward: playersWithPosition.filter(p => p.autoPosition === 'Forward').length,
    Midfielder: playersWithPosition.filter(p => p.autoPosition === 'Midfielder').length,
    Defender: playersWithPosition.filter(p => p.autoPosition === 'Defender').length,
    Goalkeeper: playersWithPosition.filter(p => p.autoPosition === 'Goalkeeper').length
  };

  if (players.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="bg-dark-card rounded-2xl p-12 text-center shadow-card">
          <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="text-text-secondary" size={32} />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No players yet</h3>
          <p className="text-text-secondary">Players will appear here once you add your first match</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header Section */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-2xl font-bold">Players</h2>
            <p className="text-text-secondary text-sm mt-1">Squad Overview</p>
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-sm">Total Players</p>
            <p className="text-white text-2xl font-bold">{players.length}</p>
          </div>
        </div>

        {/* Position Distribution */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
            <p className="text-red-400 text-lg font-bold">{positionStats.Forward}</p>
            <p className="text-text-secondary text-xs">Forwards</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
            <p className="text-green-400 text-lg font-bold">{positionStats.Midfielder}</p>
            <p className="text-text-secondary text-xs">Midfielders</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
            <p className="text-blue-400 text-lg font-bold">{positionStats.Defender}</p>
            <p className="text-text-secondary text-xs">Defenders</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 text-center">
            <p className="text-purple-400 text-lg font-bold">{positionStats.Goalkeeper}</p>
            <p className="text-text-secondary text-xs">Goalkeepers</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-dark-bg border border-dark-border rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-text-secondary focus:outline-none focus:border-primary-blue transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {positions.map(position => (
            <button
              key={position}
              onClick={() => setFilterPosition(position)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                filterPosition === position
                  ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/25'
                  : 'bg-dark-bg text-text-secondary hover:text-white hover:bg-dark-card-hover'
              }`}
            >
              {position}
              {position !== 'All Players' && ` (${positionStats[position] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-text-secondary">{filteredPlayers.length} Players</p>
        <button
          onClick={() => setSortBy(sortBy === 'goals' ? 'assists' : sortBy === 'assists' ? 'matches' : 'goals')}
          className="text-primary-blue hover:underline flex items-center gap-1"
        >
          Sort by {sortBy === 'goals' ? 'Goals' : sortBy === 'assists' ? 'Assists' : 'Matches'}
          <TrendingUp size={14} />
        </button>
      </div>

      {/* Players List */}
      <div className="space-y-3">
        {filteredPlayers.map((player, index) => {
          const stats = getPlayerStats(player);
          const PositionIcon = getPositionIcon(player.autoPosition);
          
          return (
            <div
              key={player.id}
              className="bg-dark-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getPositionColor(player.autoPosition)} rounded-full flex items-center justify-center`}>
                    <PositionIcon className="text-white" size={24} />
                  </div>
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center border-2 border-dark-card">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {player.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPositionBadgeColor(player.autoPosition)}`}>
                      {player.autoPosition}
                    </span>
                    <span className="text-xs bg-dark-bg px-2 py-1 rounded text-text-secondary">
                      {player.playerStyle}
                    </span>
                    <ChevronRight className="ml-auto text-text-secondary group-hover:text-white transition-colors flex-shrink-0" size={20} />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    {stats.map((stat, idx) => (
                      <div key={idx}>
                        <p className="text-text-secondary text-xs mb-0.5">{stat.label}</p>
                        <p className={`${stat.color} text-xl font-bold`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delete Button */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlayer(player.id);
                    }}
                    className="px-4 py-2 bg-error-red/10 text-error-red rounded-xl hover:bg-error-red hover:text-white transition-all text-sm font-medium flex-shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredPlayers.length === 0 && (
        <div className="bg-dark-card rounded-2xl p-12 text-center shadow-card">
          <Target className="mx-auto text-text-secondary mb-4" size={48} />
          <h3 className="text-white text-xl font-semibold mb-2">No players found</h3>
          <p className="text-text-secondary">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Players;
