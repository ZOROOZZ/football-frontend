import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Target, TrendingUp, ChevronRight, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { detectPosition, getPositionBadgeColor, getPlayerStyle } from '../utils/playerUtils';

const PositionStats = ({ token, position }) => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Auto-detect positions and filter
        const playersWithPositions = data.map(p => ({
          ...p,
          autoPosition: detectPosition(p),
          playerStyle: getPlayerStyle(p)
        }));
        const filtered = playersWithPositions.filter(p => p.autoPosition === position);
        setAllPlayers(filtered);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  }, [token, position]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const getPositionConfig = () => {
    const configs = {
      'Goalkeeper': {
        icon: Shield,
        color: 'purple',
        gradient: 'from-purple-500 to-pink-500',
        stats: [
          { key: 'clean_sheets', label: 'Clean Sheets', color: 'success-green' },
          { key: 'total_saves', label: 'Saves', color: 'primary-blue' },
          { key: 'total_shots_faced', label: 'Shots Faced', color: 'warning-orange' },
          { key: 'total_penalties_saved', label: 'Penalty Saves', color: 'error-red' }
        ],
        chartKey: 'clean_sheets',
        chartLabel: 'Clean Sheets'
      },
      'Forward': {
        icon: Target,
        color: 'red',
        gradient: 'from-red-500 to-orange-500',
        stats: [
          { key: 'total_goals', label: 'Goals', color: 'error-red' },
          { key: 'total_assists', label: 'Assists', color: 'success-green' },
          { key: 'matches_played', label: 'Matches', color: 'warning-orange' }
        ],
        chartKey: 'total_goals',
        chartLabel: 'Goals Scored'
      },
      'Midfielder': {
        icon: Users,
        color: 'green',
        gradient: 'from-green-500 to-emerald-500',
        stats: [
          { key: 'total_assists', label: 'Assists', color: 'success-green' },
          { key: 'total_goals', label: 'Goals', color: 'primary-blue' },
          { key: 'matches_played', label: 'Matches', color: 'warning-orange' }
        ],
        chartKey: 'total_assists',
        chartLabel: 'Assists (Playmaking)'
      },
      'Defender': {
        icon: Shield,
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-500',
        stats: [
          { key: 'matches_played', label: 'Matches', color: 'primary-blue' },
          { key: 'total_assists', label: 'Assists', color: 'success-green' },
          { key: 'total_goals', label: 'Goals', color: 'warning-orange' }
        ],
        chartKey: 'matches_played',
        chartLabel: 'Matches Played'
      }
    };
    return configs[position] || configs['Forward'];
  };

  const config = getPositionConfig();
  const Icon = config.icon;

  const getTopPlayers = () => {
    return [...allPlayers]
      .sort((a, b) => (b[config.chartKey] || 0) - (a[config.chartKey] || 0))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (allPlayers.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="bg-dark-card rounded-2xl p-12 text-center shadow-card">
          <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="text-text-secondary" size={32} />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No {position}s detected</h3>
          <p className="text-text-secondary">
            Players are auto-classified based on their stats
            {position === 'Midfielder' && ' (High assists or balanced goals/assists)'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Info Banner */}
      <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-4">
        <p className="text-primary-blue text-sm">
          <strong>Auto-Detection:</strong> Players are classified as {position}s based on their performance stats.
          {position === 'Midfielder' && ' Midfielders have high assists or balanced goals/assists ratio.'}
          {position === 'Forward' && ' Forwards score more goals than assists.'}
          {position === 'Goalkeeper' && ' Goalkeepers have high saves and shots faced.'}
        </p>
      </div>

      {/* Header Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 bg-${config.color}-500/10 rounded-xl flex items-center justify-center`}>
              <Icon className={`text-${config.color}-500`} size={20} />
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Total {position}s</p>
          <p className="text-white text-3xl font-bold">{allPlayers.length}</p>
        </div>

        {config.stats.slice(0, 3).map((stat, idx) => (
          <div key={idx} className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${stat.color}/10 rounded-xl flex items-center justify-center`}>
                <TrendingUp className={`text-${stat.color}`} size={20} />
              </div>
            </div>
            <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
            <p className="text-white text-3xl font-bold">
              {allPlayers.reduce((sum, p) => sum + (p[stat.key] || 0), 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Leaderboard Chart */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <h2 className="text-white text-xl font-bold mb-6">{config.chartLabel} Leaderboard</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getTopPlayers()} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3647" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#8b92a7' }}
              angle={-35}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: '#8b92a7' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a2332', 
                border: '1px solid #2a3647',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar 
              dataKey={config.chartKey} 
              fill={`#${config.color === 'purple' ? '9333ea' : config.color === 'red' ? 'ef4444' : config.color === 'green' ? '10b981' : '3b82f6'}`}
              name={config.chartLabel} 
              radius={[8, 8, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Players List */}
      <div className="space-y-3">
        {allPlayers.map((player, index) => (
          <div
            key={player.id}
            className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center`}>
                  <Icon className="text-white" size={28} />
                </div>
                {index < 3 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-green rounded-full flex items-center justify-center border-2 border-dark-card">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-white font-bold text-lg truncate">{player.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPositionBadgeColor(position)}`}>
                    {position}
                  </span>
                  <span className="text-xs bg-dark-bg px-2 py-1 rounded text-text-secondary">
                    {player.playerStyle}
                  </span>
                  <ChevronRight className="ml-auto text-text-secondary group-hover:text-white transition-colors flex-shrink-0" size={20} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {config.stats.map((stat, idx) => (
                    <div key={idx}>
                      <p className="text-text-secondary text-xs mb-0.5">{stat.label.toUpperCase()}</p>
                      <p className={`text-${stat.color} font-bold`}>{player[stat.key] || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositionStats;
