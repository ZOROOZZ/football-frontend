import React, { useState, useEffect, useCallback } from 'react';
import { Users, Shuffle, Search } from 'lucide-react';

const TeamGenerator = ({ token }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [filterPosition, setFilterPosition] = useState('All');

  const positions = ['All', 'GK', 'DEF', 'MID', 'FWD'];

  const loadPlayers = useCallback(async () => {
    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    }
  }, [token]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const togglePlayerSelection = (player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const calculatePlayerScore = (player) => {
    const avgGoals = player.matches_played > 0 ? player.total_goals / player.matches_played : 0;
    const avgAssists = player.matches_played > 0 ? player.total_assists / player.matches_played : 0;
    const avgSaves = player.matches_played > 0 ? player.total_saves / player.matches_played : 0;
    return avgGoals * 3 + avgAssists * 2 + avgSaves * 1;
  };

  const generateBalancedTeams = () => {
    if (selectedPlayers.length < 2) {
      alert('Please select at least 2 players');
      return;
    }

    const sortedPlayers = [...selectedPlayers].sort((a, b) => 
      calculatePlayerScore(b) - calculatePlayerScore(a)
    );

    const totalPlayers = sortedPlayers.length;
    const team1Size = Math.ceil(totalPlayers / 2);
    const team2Size = Math.floor(totalPlayers / 2);

    const t1 = [];
    const t2 = [];

    sortedPlayers.forEach((player, index) => {
      if (index % 4 === 0 || index % 4 === 3) {
        if (t1.length < team1Size) {
          t1.push(player);
        } else {
          t2.push(player);
        }
      } else {
        if (t2.length < team2Size) {
          t2.push(player);
        } else {
          t1.push(player);
        }
      }
    });

    setTeam1(t1);
    setTeam2(t2);
  };

  const getTeamTotalScore = (team) => {
    return team.reduce((sum, player) => sum + calculatePlayerScore(player), 0).toFixed(1);
  };

  const getPositionShorthand = (position) => {
    const map = {
      'Goalkeeper': 'GK',
      'Defender': 'DEF',
      'Midfielder': 'MID',
      'Forward': 'FWD'
    };
    return map[position] || position;
  };

  const filteredPlayers = players.filter(player => {
    if (filterPosition === 'All') return true;
    return getPositionShorthand(player.position) === filterPosition;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              Team Builder
            </h2>
            <p className="text-text-secondary mt-1">Select players and create balanced teams</p>
          </div>
          <button
            onClick={generateBalancedTeams}
            disabled={selectedPlayers.length < 2}
            className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary-blue/25"
          >
            <Shuffle size={18} />
            Auto-Balance
          </button>
        </div>
      </div>

      {/* Team Preview Cards */}
      {team1.length > 0 && team2.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team A */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">Team A</h3>
                  <p className="text-text-secondary text-sm">{team1.length}/{selectedPlayers.length} Players</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-xs">Rating</p>
                <p className="text-primary-blue text-2xl font-bold">{getTeamTotalScore(team1)}</p>
              </div>
            </div>

            {/* Power Bar */}
            <div className="bg-dark-bg rounded-full h-3 overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-primary-blue to-blue-400 h-full transition-all duration-500"
                style={{ width: `${(parseFloat(getTeamTotalScore(team1)) / (parseFloat(getTeamTotalScore(team1)) + parseFloat(getTeamTotalScore(team2)))) * 100}%` }}
              />
            </div>
          </div>

          {/* Team B */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-2 border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning-orange rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">Team B</h3>
                  <p className="text-text-secondary text-sm">{team2.length}/{selectedPlayers.length} Players</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-xs">Rating</p>
                <p className="text-warning-orange text-2xl font-bold">{getTeamTotalScore(team2)}</p>
              </div>
            </div>

            {/* Power Bar */}
            <div className="bg-dark-bg rounded-full h-3 overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-warning-orange to-orange-400 h-full transition-all duration-500"
                style={{ width: `${(parseFloat(getTeamTotalScore(team2)) / (parseFloat(getTeamTotalScore(team1)) + parseFloat(getTeamTotalScore(team2)))) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Player Selection */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">
            Available Pool ({selectedPlayers.length} selected)
          </h3>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          {/* Search disabled for now - can enable if needed */}
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

        {/* Players Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredPlayers.map(player => {
            const isSelected = selectedPlayers.find(p => p.id === player.id);
            const score = calculatePlayerScore(player);
            
            return (
              <button
                key={player.id}
                onClick={() => togglePlayerSelection(player)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary-blue bg-primary-blue/10 shadow-lg shadow-primary-blue/25'
                    : 'border-dark-border hover:border-primary-blue/50 bg-dark-bg'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {player.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                    <p className="text-text-secondary text-xs">{getPositionShorthand(player.position)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-xs">OVR</span>
                  <span className={`font-bold text-sm ${
                    score > 5 ? 'text-success-green' : 
                    score > 2 ? 'text-warning-orange' : 
                    'text-text-secondary'
                  }`}>
                    {Math.round(score * 10)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generated Teams */}
      {team1.length > 0 && team2.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team A Players */}
          <div className="bg-dark-card rounded-2xl p-6 shadow-card">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              Team A
            </h3>
            <div className="space-y-2">
              {team1.map(player => (
                <div key={player.id} className="bg-dark-bg rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{player.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <p className="text-text-secondary text-xs">{getPositionShorthand(player.position)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Goals: {player.total_goals}</p>
                    <p className="text-xs text-text-secondary">Assists: {player.total_assists}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team B Players */}
          <div className="bg-dark-card rounded-2xl p-6 shadow-card">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-warning-orange rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              Team B
            </h3>
            <div className="space-y-2">
              {team2.map(player => (
                <div key={player.id} className="bg-dark-bg rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-warning-orange to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{player.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <p className="text-text-secondary text-xs">{getPositionShorthand(player.position)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">Goals: {player.total_goals}</p>
                    <p className="text-xs text-text-secondary">Assists: {player.total_assists}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamGenerator;
