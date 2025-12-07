import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, TrendingUp, Users, Target, Calendar } from 'lucide-react';

const API_URL = 'https://football-tracker-api.mehul-112.workers.dev';

const FootballTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [matchDate, setMatchDate] = useState('');
  const [newPlayers, setNewPlayers] = useState([{ name: '', goals: 0, saves: 0, assists: 0 }]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const matchesRes = await fetch(`${API_URL}/api/matches`);
      const playersRes = await fetch(`${API_URL}/api/players`);
      
      if (!matchesRes.ok || !playersRes.ok) {
        throw new Error('Failed to load data');
      }
      
      const matchesData = await matchesRes.json();
      const playersData = await playersRes.json();
      
      setMatches(matchesData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const addPlayerField = () => {
    setNewPlayers([...newPlayers, { name: '', goals: 0, saves: 0, assists: 0 }]);
  };

  const updatePlayerField = (index, field, value) => {
    const updated = [...newPlayers];
    updated[index][field] = field === 'name' ? value : parseInt(value) || 0;
    setNewPlayers(updated);
  };

  const removePlayerField = (index) => {
    setNewPlayers(newPlayers.filter((_, i) => i !== index));
  };

  const deleteMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match? This will update all player statistics.')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/matches/${matchId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete match');
      }

      await loadData();
      alert('Match deleted successfully!');
    } catch (error) {
      console.error('Error deleting match:', error);
      setError('Failed to delete match. Please try again.');
      alert('Failed to delete match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player? All their match records will also be deleted.')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/players/${playerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      await loadData();
      setSelectedPlayer(null);
      alert('Player deleted successfully!');
    } catch (error) {
      console.error('Error deleting player:', error);
      setError('Failed to delete player. Please try again.');
      alert('Failed to delete player. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitMatch = async () => {
    if (!matchDate) {
      alert('Please select a match date');
      return;
    }

    const validPlayers = newPlayers.filter(p => p.name.trim() !== '');
    if (validPlayers.length === 0) {
      alert('Please add at least one player');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: matchDate,
          players: validPlayers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save match');
      }

      // Reload data from server
      await loadData();

      // Reset form
      setMatchDate('');
      setNewPlayers([{ name: '', goals: 0, saves: 0, assists: 0 }]);
      setActiveTab('dashboard');
      alert('Match added successfully!');
    } catch (error) {
      console.error('Error saving match:', error);
      setError('Failed to save match. Please try again.');
      alert('Failed to save match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTopScorers = () => {
    return [...players].sort((a, b) => b.total_goals - a.total_goals).slice(0, 5);
  };

  const getPlayerPerformance = (player) => {
    return player.history.map(h => ({
      date: h.date,
      goals: h.goals,
      assists: h.assists,
      saves: h.saves
    }));
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
            <Target className="text-blue-600" size={32} />
            <span className="leading-tight">Football Match Tracker</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Track your team's performance and player statistics</p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-4 sm:mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('addMatch')}
              className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                activeTab === 'addMatch' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Plus size={18} />
              Add Match
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                activeTab === 'players' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={18} />
              Players
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading data...</p>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Total Matches</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{matches.length}</p>
                      </div>
                      <Calendar className="text-blue-600" size={32} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Total Players</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">{players.length}</p>
                      </div>
                      <Users className="text-green-600" size={32} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Total Goals</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600">
                          {players.reduce((sum, p) => sum + p.total_goals, 0)}
                        </p>
                      </div>
                      <Target className="text-red-600" size={32} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Total Saves</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                          {players.reduce((sum, p) => sum + p.total_saves, 0)}
                        </p>
                      </div>
                      <TrendingUp className="text-purple-600" size={32} />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                {players.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Scorers */}
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Top Scorers</h2>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getTopScorers()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="total_goals" fill="#3b82f6" name="Goals" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Goals Distribution */}
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Goals Distribution</h2>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={getTopScorers()}
                            dataKey="total_goals"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={(entry) => entry.name}
                            labelLine={false}
                          >
                            {getTopScorers().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {matches.length === 0 && !loading && (
                  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <Target className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first match!</p>
                    <button
                      onClick={() => setActiveTab('addMatch')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Add Match
                    </button>
                  </div>
                )}

                {/* Recent Matches List */}
                {matches.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Matches</h2>
                    <div className="space-y-3">
                      {matches.slice(0, 10).map((match) => (
                        <div key={match.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                          <div>
                            <p className="font-semibold text-gray-800">Match on {match.match_date}</p>
                            <p className="text-sm text-gray-600">ID: {match.id}</p>
                          </div>
                          <button
                            onClick={() => deleteMatch(match.id)}
                            disabled={loading}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Add Match Tab */}
        {activeTab === 'addMatch' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Add New Match</h2>
            
            <div className="mb-4 sm:mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Match Date</label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Players</h3>
                <button
                  onClick={addPlayerField}
                  className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <Plus size={18} />
                  Add Player
                </button>
              </div>

              <div className="space-y-4">
                {newPlayers.map((player, index) => (
                  <div key={index} className="grid grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1 text-sm">Player Name</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerField(index, 'name', e.target.value)}
                        placeholder="Enter player name"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Goals</label>
                        <input
                          type="number"
                          value={player.goals}
                          onChange={(e) => updatePlayerField(index, 'goals', e.target.value)}
                          min="0"
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Assists</label>
                        <input
                          type="number"
                          value={player.assists}
                          onChange={(e) => updatePlayerField(index, 'assists', e.target.value)}
                          min="0"
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Saves</label>
                        <input
                          type="number"
                          value={player.saves}
                          onChange={(e) => updatePlayerField(index, 'saves', e.target.value)}
                          min="0"
                          className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                    {newPlayers.length > 1 && (
                      <button
                        onClick={() => removePlayerField(index)}
                        className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remove Player
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={submitMatch}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Saving...' : 'Save Match'}
            </button>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="space-y-4 sm:space-y-6">
            {players.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
                    >
                      <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <h3 
                          onClick={() => setSelectedPlayer(player)}
                          className="text-lg sm:text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
                        >
                          {player.name}
                        </h3>
                        <button
                          onClick={() => deletePlayer(player.id)}
                          disabled={loading}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:bg-gray-400 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Matches:</span>
                          <span className="font-semibold">{player.matches_played}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Goals:</span>
                          <span className="font-semibold text-blue-600">{player.total_goals}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Assists:</span>
                          <span className="font-semibold text-green-600">{player.total_assists}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Saves:</span>
                          <span className="font-semibold text-purple-600">{player.total_saves}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t text-sm sm:text-base">
                          <span className="text-gray-600">Avg Goals/Match:</span>
                          <span className="font-semibold">
                            {(player.total_goals / player.matches_played).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="w-full mt-3 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                      >
                        View Performance
                      </button>
                    </div>
                  ))}
                </div>

                {selectedPlayer && (
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                        {selectedPlayer.name}'s Performance
                      </h2>
                      <button
                        onClick={() => setSelectedPlayer(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm sm:text-base px-3 py-1 bg-gray-100 rounded"
                      >
                        Close
                      </button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getPlayerPerformance(selectedPlayer)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="goals" stroke="#3b82f6" strokeWidth={2} name="Goals" />
                        <Line type="monotone" dataKey="assists" stroke="#10b981" strokeWidth={2} name="Assists" />
                        <Line type="monotone" dataKey="saves" stroke="#8b5cf6" strokeWidth={2} name="Saves" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No players yet</h3>
                <p className="text-sm sm:text-base text-gray-500">Add your first match to see player statistics</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballTracker;
