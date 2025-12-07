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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Target className="text-blue-600" size={40} />
            Football Match Tracker
          </h1>
          <p className="text-gray-600 mt-2">Track your team's performance and player statistics</p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('addMatch')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
                activeTab === 'addMatch' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Plus size={20} />
              Add Match
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
                activeTab === 'players' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Matches</p>
                        <p className="text-3xl font-bold text-blue-600">{matches.length}</p>
                      </div>
                      <Calendar className="text-blue-600" size={40} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Players</p>
                        <p className="text-3xl font-bold text-green-600">{players.length}</p>
                      </div>
                      <Users className="text-green-600" size={40} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Goals</p>
                        <p className="text-3xl font-bold text-red-600">
                          {players.reduce((sum, p) => sum + p.total_goals, 0)}
                        </p>
                      </div>
                      <Target className="text-red-600" size={40} />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Saves</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {players.reduce((sum, p) => sum + p.total_saves, 0)}
                        </p>
                      </div>
                      <TrendingUp className="text-purple-600" size={40} />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                {players.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Scorers */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Top Scorers</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getTopScorers()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="total_goals" fill="#3b82f6" name="Goals" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Goals Distribution */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Goals Distribution</h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getTopScorers()}
                            dataKey="total_goals"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {getTopScorers().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
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
              </>
            )}
          </div>
        )}

        {/* Add Match Tab */}
        {activeTab === 'addMatch' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Match</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Match Date</label>
              <input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Players</h3>
                <button
                  onClick={addPlayerField}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Player
                </button>
              </div>

              <div className="space-y-4">
                {newPlayers.map((player, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-1">Player Name</label>
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayerField(index, 'name', e.target.value)}
                        placeholder="Enter player name"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Goals</label>
                      <input
                        type="number"
                        value={player.goals}
                        onChange={(e) => updatePlayerField(index, 'goals', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Assists</label>
                      <input
                        type="number"
                        value={player.assists}
                        onChange={(e) => updatePlayerField(index, 'assists', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">Saves</label>
                        <input
                          type="number"
                          value={player.saves}
                          onChange={(e) => updatePlayerField(index, 'saves', e.target.value)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {newPlayers.length > 1 && (
                        <button
                          onClick={() => removePlayerField(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={submitMatch}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Match'}
            </button>
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="space-y-6">
            {players.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedPlayer(player)}
                      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{player.name}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Matches:</span>
                          <span className="font-semibold">{player.matches_played}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Goals:</span>
                          <span className="font-semibold text-blue-600">{player.total_goals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assists:</span>
                          <span className="font-semibold text-green-600">{player.total_assists}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Saves:</span>
                          <span className="font-semibold text-purple-600">{player.total_saves}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Avg Goals/Match:</span>
                          <span className="font-semibold">
                            {(player.total_goals / player.matches_played).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPlayer && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedPlayer.name}'s Performance
                      </h2>
                      <button
                        onClick={() => setSelectedPlayer(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Close
                      </button>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={getPlayerPerformance(selectedPlayer)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="goals" stroke="#3b82f6" strokeWidth={2} name="Goals" />
                        <Line type="monotone" dataKey="assists" stroke="#10b981" strokeWidth={2} name="Assists" />
                        <Line type="monotone" dataKey="saves" stroke="#8b5cf6" strokeWidth={2} name="Saves" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Users className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No players yet</h3>
                <p className="text-gray-500">Add your first match to see player statistics</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballTracker;
