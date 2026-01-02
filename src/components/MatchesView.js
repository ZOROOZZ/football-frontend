import React, { useState } from 'react';
import { Calendar, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

const MatchesView = ({ matches, isAdmin, onDeleteMatch }) => {
  const [expandedMatch, setExpandedMatch] = useState(null);

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
        {matches.map((match) => (
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
                      Match #{match.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Score Display if available */}
                  {match.teamA && match.teamB && (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-text-secondary text-xs">Team A</p>
                        <p className="text-primary-blue text-2xl font-bold">
                          {match.teamA.score?.total || 0}
                        </p>
                      </div>
                      <span className="text-text-secondary">-</span>
                      <div className="text-left">
                        <p className="text-text-secondary text-xs">Team B</p>
                        <p className="text-warning-orange text-2xl font-bold">
                          {match.teamB.score?.total || 0}
                        </p>
                      </div>
                    </div>
                  )}

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
                {/* Score Breakdown */}
                {match.teamA && match.teamB && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary-blue/10 border border-primary-blue/20 rounded-xl">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">A</span>
                        </div>
                        Team A
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">1st Half:</span>
                          <span className="text-white font-semibold">
                            {match.teamA.score?.firstHalf || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">2nd Half:</span>
                          <span className="text-white font-semibold">
                            {match.teamA.score?.secondHalf || 0}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-primary-blue/20">
                          <span className="text-white font-semibold">Total:</span>
                          <span className="text-primary-blue text-xl font-bold">
                            {match.teamA.score?.total || 0}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-primary-blue/20">
                        <p className="text-text-secondary text-xs mb-2">Players</p>
                        <div className="flex flex-wrap gap-1">
                          {match.teamA.players?.map((player, idx) => (
                            <span key={idx} className="text-xs bg-primary-blue/20 text-primary-blue px-2 py-1 rounded">
                              {player}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-warning-orange/10 border border-warning-orange/20 rounded-xl">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-warning-orange rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                        Team B
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">1st Half:</span>
                          <span className="text-white font-semibold">
                            {match.teamB.score?.firstHalf || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">2nd Half:</span>
                          <span className="text-white font-semibold">
                            {match.teamB.score?.secondHalf || 0}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-warning-orange/20">
                          <span className="text-white font-semibold">Total:</span>
                          <span className="text-warning-orange text-xl font-bold">
                            {match.teamB.score?.total || 0}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-warning-orange/20">
                        <p className="text-text-secondary text-xs mb-2">Players</p>
                        <div className="flex flex-wrap gap-1">
                          {match.teamB.players?.map((player, idx) => (
                            <span key={idx} className="text-xs bg-warning-orange/20 text-warning-orange px-2 py-1 rounded">
                              {player}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delete Button for Admin */}
                {isAdmin && (
                  <div className="flex justify-end">
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
        ))}
      </div>
    </div>
  );
};

export default MatchesView;
