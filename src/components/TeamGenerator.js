import React, { useState, useEffect } from 'react';
import { Users, Shuffle, Save } from 'lucide-react';

const TeamGenerator = ({ token }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

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

    // Sort players by skill score
    const sortedPlayers = [...selectedPlayers].sort((a, b) => 
      calculatePlayerScore(b) - calculatePlayerScore(a)
    );

    const t1 = [];
    const t2 = [];
    let t1Score = 0;
    let t2Score = 0;

    // Distribute players to balance teams
    sortedPlayers.forEach(player => {
      const playerScore = calculatePlayerScore(player);
      if (t1Score <= t2Score) {
        t1.push(player);
        t1Score += playerScore;
      } else {
        t2.push(player);
        t2Score += playerScore;
      }
    });

    setTeam1(t1);
    setTeam2(t2);
  };

  const getTeamTotalScore = (team) => {
    return team.reduce((sum, player) => sum + calculatePlayerScore(player), 0).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users size={28} />
              Team Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select players and create balanced teams
            </p>
          </div>
          <button
            onClick={generateBalancedTeams}
            disabled={selectedPlayers.length < 2}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Shuffle size={18} />
            Generate Teams
          </button>
        </div>
      </div>

      {/* Player Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Select Players ({selectedPlayers.length} selected)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => togglePlayerSelection(player)}
              className={`p-3 rounded-lg border-2 transition ${
                selectedPlayers.find(p => p.id === player.id)
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{player.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Score: {calculatePlayerScore(player).toFixed(1)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Teams */}
      {team1.length > 0 && team2.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team 1 */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              Team 1 (Score: {getTeamTotalScore(team1)})
            </h3>
            <div className="space-y-2">
              {team1.map(player => (
                <div key={player.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800 dark:text-white">{player.name}</p>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Goals: {player.total_goals}</span>
                    <span>Assists: {player.total_assists}</span>
                    <span>Matches: {player.matches_played}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
              Team 2 (Score: {getTeamTotalScore(team2)})
            </h3>
            <div className="space-y-2">
              {team2.map(player => (
                <div key={player.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <p className="font-semibold text-gray-800 dark:text-white">{player.name}</p>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Goals: {player.total_goals}</span>
                    <span>Assists: {player.total_assists}</span>
                    <span>Matches: {player.matches_played}</span>
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
