import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AddMatch = ({ onSubmit, loading }) => {
  const [matchDate, setMatchDate] = useState('');
  const [players, setPlayers] = useState([{ name: '', goals: 0, saves: 0, assists: 0 }]);

  const addPlayerField = () => {
    setPlayers([...players, { name: '', goals: 0, saves: 0, assists: 0 }]);
  };

  const updatePlayerField = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = field === 'name' ? value : parseInt(value) || 0;
    setPlayers(updated);
  };

  const removePlayerField = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!matchDate) {
      alert('Please select a match date');
      return;
    }

    const validPlayers = players.filter(p => p.name.trim() !== '');
    if (validPlayers.length === 0) {
      alert('Please add at least one player');
      return;
    }

    onSubmit({ date: matchDate, players: validPlayers });
    setMatchDate('');
    setPlayers([{ name: '', goals: 0, saves: 0, assists: 0 }]);
  };

  return (
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
          {players.map((player, index) => (
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
              {players.length > 1 && (
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
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? 'Saving...' : 'Save Match'}
      </button>
    </div>
  );
};

export default AddMatch;
