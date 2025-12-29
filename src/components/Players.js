import React, { useState } from 'react';
import { Search, ChevronRight, Target, Users as UsersIcon, TrendingUp } from 'lucide-react';

const Players = ({ players, isAdmin, onDeletePlayer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('All Players');
  const [sortBy, setSortBy] = useState('goals');

  const positions = ['All Players', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  const getPositionColor = (position) => {
    const colors = {
      'Forward': 'from-red-500 to-orange-500',
      'Midfielder': 'from-green-500 to-emerald-500',
      'Defender': 'from-blue-500 to-cyan-500',
      'Goalkeeper': 'from-purple-500 to-pink-500'
    };
    return colors[position] || 'from-gray-500 to-gray-600';
  };

  const getPlayerStats = (player) => {
    if (player.position === 'Goalkeeper') {
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

  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = filterPosition === 'All Players' || player.position === filterPosition;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      if (sortBy === 'goals') return (b.total_goals || 0) - (a.total_goals || 0);
      if (sortBy === 'assists') return (b.total_assists || 0) - (a.total_assists || 0);
      if (sortBy === 'matches') return (b.matches_played || 0) - (a.matches_played || 0);
      return 0;
    });

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
            <p className="text-text-secondary text-sm mt-1">Manchester United</p>
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-sm">Total Players</p>
            <p className="text-white text-2xl font-bold">{players.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, position..."
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
          return (
            <div
              key={player.id}
              className="bg-dark-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getPositionColor(player.position)} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xl font-bold">
                      {player.name.charAt(0)}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center border-2 border-dark-card">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {player.name}
                    </h3>
                    <ChevronRight className="text-text-secondary group-hover:text-white transition-colors flex-shrink-0" size={20} />
                  </div>
                  <p className="text-text-secondary text-sm">{player.position || 'Forward'}</p>

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
