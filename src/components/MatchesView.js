import React, { useState, useEffect } from 'react';
import { Calendar, Trophy, ChevronDown, ChevronUp, Target, Award, Shield } from 'lucide-react';

const MatchesView = ({ matches, isAdmin, onDeleteMatch, token }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [matchPlayers, setMatchPlayers] = useState({});

  useEffect(() => {
    // Load player stats for each match
    const loadMatchPlayers = async () => {
      for (const match of matches) {
        try {
          const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const players = await response.json();
            // Filter players who played in this match
            const matchPlayerData = players.filter(p => 
              p.history && p.history.some(h => h.date === match.match_date)
            ).map(p => {
              const performance = p.history.find(h => h.date === match.match_date);
              return {
                ...p,
                matchPerformance: performance
              };
            });
            setMatchPlayers(prev => ({...prev, [match.id]: matchPlayerData}));
          }
        } catch (error) {
          console.error('Error loading match players:', error);
        }
      }
    };

    if (matches.length > 0 && token) {
      loadMatchPlayers();
    }
  }, [matches, token]);

  const toggleMatch = (matchId) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMatchStats = (matchId) => {
    const players = matchPlayers[matchId] || [];
    const totalGoals = players.reduce((sum, p) => sum + (p.matchPerformance?.goals || 0), 0);
    const totalSaves = players.reduce((sum, p) => sum + (p.matchPerformance?.saves || 0), 0);
    const totalAssists = players.reduce((sum, p) => sum + (p.matchPerformance?.assists || 0), 0);
    return { totalGoals, totalSaves, totalAssists, playerCount: players.length };
  };

  const getPositionIcon = (position) => {
    if (position === 'Goalkeeper') return Shield;
    if (position === 'Forward') return Target;
    return Award;
  };

  if (matches.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="bg-dark-card rounded-2xl p-12 text-center shadow-card">
          <Trophy className="mx-auto text-text-secondary mb-4" size={64} />
          <h3 className="text-white text-xl font-semibold mb-2">No matches yet</h3>
          <p className="text-text-secondary">Start tracking your team's performance by adding matches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">Match History</h2>
            <p className="text-text-secondary mt-1">{matches.length} matches played</p>
          </div>
          <div className="text-right">
            <Trophy className="text-warning-orange mb-2" size={32} />
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map((match) => {
          const stats = getMatchStats(match.id);
          const players = matchPlayers[match.id] || [];
          
          return (
            <div key={match.id} className="bg-dark-card rounded-2xl shadow-card overflow-hidden">
              {/* Match Header */}
              <button
                onClick={() => toggleMatch(match.id)}
                className="w-full p-6 hover:bg-dark-card-hover transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center">
                      <Calendar className="text-primary-blue" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-bold text-lg">
                        {formatDate(match.match_date)}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        Match #{match.id} • {stats.playerCount} players
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-primary-blue text-2xl font-bold">{stats.totalGoals}</p>
                        <p className="text-text-secondary text-xs">Goals</p>
                      </div>
                      <div className="text-center">
                        <p className="text-success-green text-2xl font-bold">{stats.totalAssists}</p>
                        <p className="text-text-secondary text-xs">Assists</p>
                      </div>
                      <div className="text-center">
                        <p className="text-purple-400 text-2xl font-bold">{stats.totalSaves}</p>
                        <p className="text-text-secondary text-xs">Saves</p>
                      </div>
                    </div>

                    {expandedMatch === match.id ? (
                      <ChevronUp className="text-text-secondary" size={24} />
                    ) : (
                      <ChevronDown className="text-text-secondary" size={24} />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedMatch === match.id && (
                <div className="border-t border-dark-border p-6 space-y-6">
                  {/* Match Statistics Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm mb-1">Total Goals</p>
                          <p className="text-primary-blue text-3xl font-bold">{stats.totalGoals}</p>
                        </div>
                        <Target className="text-primary-blue" size={32} />
                      </div>
                    </div>
                    <div className="bg-success-green/10 border border-success-green/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm mb-1">Total Assists</p>
                          <p className="text-success-green text-3xl font-bold">{stats.totalAssists}</p>
                        </div>
                        <Award className="text-success-green" size={32} />
                      </div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-secondary text-sm mb-1">Total Saves</p>
                          <p className="text-purple-400 text-3xl font-bold">{stats.totalSaves}</p>
                        </div>
                        <Shield className="text-purple-400" size={32} />
                      </div>
                    </div>
                  </div>

                  {/* Players Performance */}
                  <div>
                    <h4 className="text-white font-bold text-lg mb-4">Player Performance</h4>
                    <div className="space-y-3">
                      {players.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">
                          No player data available for this match
                        </div>
                      ) : (
                        players.map((player) => {
                          const perf = player.matchPerformance;
                          const PositionIcon = getPositionIcon(player.position);
                          
                          return (
                            <div
                              key={player.id}
                              className="bg-dark-bg rounded-xl p-4 hover:bg-dark-card-hover transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                {/* Player Avatar */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${
                                  player.position === 'Goalkeeper' ? 'from-purple-500 to-pink-500' :
                                  player.position === 'Forward' ? 'from-red-500 to-orange-500' :
                                  player.position === 'Midfielder' ? 'from-green-500 to-emerald-500' :
                                  'from-blue-500 to-cyan-500'
                                } rounded-full flex items-center justify-center flex-shrink-0`}>
                                  <PositionIcon className="text-white" size={20} />
                                </div>

                                {/* Player Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="text-white font-semibold truncate">{player.name}</h5>
                                    <span className="text-xs bg-dark-card px-2 py-1 rounded text-text-secondary">
                                      {player.position}
                                    </span>
                                  </div>

                                  {/* Stats Grid */}
                                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-2">
                                    {perf?.goals > 0 && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Goals</p>
                                        <p className="text-primary-blue font-bold">{perf.goals}</p>
                                      </div>
                                    )}
                                    {perf?.assists > 0 && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Assists</p>
                                        <p className="text-success-green font-bold">{perf.assists}</p>
                                      </div>
                                    )}
                                    {perf?.saves > 0 && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Saves</p>
                                        <p className="text-purple-400 font-bold">{perf.saves}</p>
                                      </div>
                                    )}
                                    {perf?.shots_faced > 0 && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Shots</p>
                                        <p className="text-warning-orange font-bold">{perf.shots_faced}</p>
                                      </div>
                                    )}
                                    {perf?.goals_conceded !== undefined && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Conceded</p>
                                        <p className="text-error-red font-bold">{perf.goals_conceded}</p>
                                      </div>
                                    )}
                                    {perf?.penalties_saved > 0 && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Pen Saved</p>
                                        <p className="text-success-green font-bold">{perf.penalties_saved}</p>
                                      </div>
                                    )}
                                    {(perf?.yellow_cards > 0 || perf?.red_cards > 0) && (
                                      <div>
                                        <p className="text-text-secondary text-xs">Cards</p>
                                        <p className="text-white font-bold">
                                          {perf?.yellow_cards > 0 && <span className="text-yellow-400">Y:{perf.yellow_cards}</span>}
                                          {perf?.yellow_cards > 0 && perf?.red_cards > 0 && ' '}
                                          {perf?.red_cards > 0 && <span className="text-error-red">R:{perf.red_cards}</span>}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Performance Rating */}
                                <div className="text-right flex-shrink-0">
                                  <div className="w-12 h-12 bg-gradient-to-br from-warning-orange to-yellow-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {Math.round((perf?.goals * 3 + perf?.assists * 2 + perf?.saves * 1) / 2) || '-'}
                                    </span>
                                  </div>
                                  <p className="text-text-secondary text-xs mt-1">Rating</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Delete Button for Admin */}
                  {isAdmin && (
                    <div className="flex justify-end pt-4 border-t border-dark-border">
                      <button
                        onClick={() => onDeleteMatch(match.id)}
                        className="px-6 py-2.5 bg-error-red/10 text-error-red rounded-xl hover:bg-error-red hover:text-white transition-all font-medium"
                      >
                        Delete Match
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchesView;
