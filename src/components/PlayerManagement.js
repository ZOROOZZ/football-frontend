import React, { useState } from 'react';
import { UserPlus, Save, X } from 'lucide-react';

const PlayerManagement = ({ token, onPlayerAdded }) => {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [loading, setLoading] = useState(false);

  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: playerName,
          position: position,
          total_goals: 0,
          total_saves: 0,
          total_assists: 0,
          matches_played: 0
        })
      });

      if (response.ok) {
        alert('Player added successfully!');
        setPlayerName('');
        setPosition('Forward');
        setShowAddPlayer(false);
        if (onPlayerAdded) onPlayerAdded();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add player');
      }
    } catch (error) {
      alert('Error adding player: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowAddPlayer(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        <UserPlus size={18} />
        Add Player
      </button>

      {showAddPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add New Player</h3>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {loading ? 'Adding...' : 'Add Player'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;
