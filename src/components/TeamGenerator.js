import React, { useState, useEffect, useCallback } from 'react';
import { Users, Shuffle } from 'lucide-react';

const TeamGenerator = ({ token }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);

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

    // Sort players by score (highest to lowest)
    const sortedPlayers = [...selectedPlayers].sort((a, b) => 
      calculatePlayerScore(b) - calculatePlayerScore(a)
    );

    // Calculate team sizes
    const totalPlayers = sortedPlayers.length;
    const team1Size = Math.ceil(totalPlayers / 2);  // Larger or equal team
    const team2Size = Math.floor(totalPlayers / 2); // Smaller or equal team

    const t1 = [];
    const t2 = [];

    // Distribute players using snake draft (1-2-2-1-1-2-2-1...)
    sortedPlayers.forEach((player, index) => {
      // Alternate distribution, prioritizing balance
      if (index % 4 === 0 || index % 4 === 3) {
        // Add to team 1
        if (t1.length < team1Size) {
          t1.push(player);
        } else {
          t2.push(player);
        }
      } else {
        // Add to team 2
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
    return team.reduce((sum, player) => sum + calculatePlayerScore(player), 0).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Shuffle size={18} />
            Generate Teams
          </button>
        </div>
      </div>

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
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-700'
              }`}
            >
              <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{player.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Score: {calculatePlayerScore(player).toFixed(1)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {team1.length > 0 && team2.length > 0 && (
        <>
          {/* Team Size Info */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center">
            <p className="text-blue-800 dark:text-blue-200 font-semibold">
              Team Distribution: {team1.length} vs {team2.length} players
              {team1.length === team2.length && ' ✓ Perfectly Balanced'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team 1 */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                Team 1 ({team1.length} players)
                <span className="text-sm font-normal block mt-1">Score: {getTeamTotalScore(team1)}</span>
              </h3>
              <div className="space-y-2">
                {team1.map(player => (
                  <div key={player.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-white">{player.name}</p>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                Team 2 ({team2.length} players)
                <span className="text-sm font-normal block mt-1">Score: {getTeamTotalScore(team2)}</span>
              </h3>
              <div className="space-y-2">
                {team2.map(player => (
                  <div key={player.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-white">{player.name}</p>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>Goals: {player.total_goals}</span>
                      <span>Assists: {player.total_assists}</span>
                      <span>Matches: {player.matches_played}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamGenerator;
