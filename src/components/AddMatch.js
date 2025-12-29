import React, { useState } from 'react';
import { Plus, Minus, X, Calendar, Shield, Users as UsersIcon } from 'lucide-react';

const AddMatch = ({ onSubmit, loading }) => {
  const [matchDate, setMatchDate] = useState('');
  const [players, setPlayers] = useState([{
    name: '',
    goals: 0,
    saves: 0,
    assists: 0,
    shots_faced: 0,
    goals_conceded: 0,
    penalties_faced: 0,
    penalties_saved: 0,
    yellow_cards: 0,
    red_cards: 0
  }]);

  const addPlayerField = () => {
    setPlayers([...players, {
      name: '',
      goals: 0,
      saves: 0,
      assists: 0,
      shots_faced: 0,
      goals_conceded: 0,
      penalties_faced: 0,
      penalties_saved: 0,
      yellow_cards: 0,
      red_cards: 0
    }]);
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
    setPlayers([{
      name: '',
      goals: 0,
      saves: 0,
      assists: 0,
      shots_faced: 0,
      goals_conceded: 0,
      penalties_faced: 0,
      penalties_saved: 0,
      yellow_cards: 0,
      red_cards: 0
    }]);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fadeIn space-y-6">
      {/* Match Details Card */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <h2 className="text-white text-2xl font-bold mb-6">Match Details</h2>

        {/* Date & Time */}
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-2 uppercase tracking-wide">
            Date & Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-blue transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Lineup & Stats Card */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">Lineup & Stats</h2>
            <p className="text-primary-blue text-sm mt-1">{players.filter(p => p.name).length} Players</p>
          </div>
          <button
            onClick={addPlayerField}
            className="bg-primary-blue hover:bg-primary-blue-dark text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Player
          </button>
        </div>

        {/* Players List */}
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={index} className="bg-dark-bg rounded-xl p-4 border border-dark-border">
              {/* Player Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                  <UsersIcon className="text-white" size={20} />
                </div>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => updatePlayerField(index, 'name', e.target.value)}
                  placeholder="Player name"
                  className="flex-1 bg-transparent border-none text-white text-lg font-semibold placeholder-text-secondary focus:outline-none"
                />
                {players.length > 1 && (
                  <button
                    onClick={() => removePlayerField(index)}
                    className="p-2 text-text-secondary hover:text-error-red hover:bg-error-red/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Basic Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-text-secondary text-xs font-medium mb-1 uppercase">Goals</label>
                  <div className="flex items-center gap-2 bg-dark-card rounded-lg p-2">
                    <button
                      onClick={() => updatePlayerField(index, 'goals', Math.max(0, player.goals - 1))}
                      className="w-8 h-8 bg-dark-bg rounded-lg flex items-center justify-center text-text-secondary hover:text-white hover:bg-dark-border transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={player.goals}
                      onChange={(e) => updatePlayerField(index, 'goals', e.target.value)}
                      className="flex-1 bg-transparent text-center text-white text-xl font-bold focus:outline-none"
                      min="0"
                    />
                    <button
                      onClick={() => updatePlayerField(index, 'goals', player.goals + 1)}
                      className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:bg-primary-blue-dark transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary text-xs font-medium mb-1 uppercase">Assists</label>
                  <div className="flex items-center gap-2 bg-dark-card rounded-lg p-2">
                    <button
                      onClick={() => updatePlayerField(index, 'assists', Math.max(0, player.assists - 1))}
                      className="w-8 h-8 bg-dark-bg rounded-lg flex items-center justify-center text-text-secondary hover:text-white hover:bg-dark-border transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={player.assists}
                      onChange={(e) => updatePlayerField(index, 'assists', e.target.value)}
                      className="flex-1 bg-transparent text-center text-white text-xl font-bold focus:outline-none"
                      min="0"
                    />
                    <button
                      onClick={() => updatePlayerField(index, 'assists', player.assists + 1)}
                      className="w-8 h-8 bg-success-green rounded-lg flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary text-xs font-medium mb-1 uppercase">Saves</label>
                  <div className="flex items-center gap-2 bg-dark-card rounded-lg p-2">
                    <button
                      onClick={() => updatePlayerField(index, 'saves', Math.max(0, player.saves - 1))}
                      className="w-8 h-8 bg-dark-bg rounded-lg flex items-center justify-center text-text-secondary hover:text-white hover:bg-dark-border transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={player.saves}
                      onChange={(e) => updatePlayerField(index, 'saves', e.target.value)}
                      className="flex-1 bg-transparent text-center text-white text-xl font-bold focus:outline-none"
                      min="0"
                    />
                    <button
                      onClick={() => updatePlayerField(index, 'saves', player.saves + 1)}
                      className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Goalkeeper Stats (Collapsible) */}
              <details className="group">
                <summary className="flex items-center gap-2 text-text-secondary hover:text-white cursor-pointer text-sm font-medium py-2 border-t border-dark-border">
                  <Shield size={16} />
                  Goalkeeper Stats (Optional)
                </summary>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-text-secondary text-xs mb-1">Shots Faced</label>
                    <input
                      type="number"
                      value={player.shots_faced}
                      onChange={(e) => updatePlayerField(index, 'shots_faced', e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-blue"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-xs mb-1">Goals Conceded</label>
                    <input
                      type="number"
                      value={player.goals_conceded}
                      onChange={(e) => updatePlayerField(index, 'goals_conceded', e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-blue"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-xs mb-1">Penalties Faced</label>
                    <input
                      type="number"
                      value={player.penalties_faced}
                      onChange={(e) => updatePlayerField(index, 'penalties_faced', e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-blue"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary text-xs mb-1">Penalties Saved</label>
                    <input
                      type="number"
                      value={player.penalties_saved}
                      onChange={(e) => updatePlayerField(index, 'penalties_saved', e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-blue"
                      min="0"
                    />
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary-blue hover:bg-primary-blue-dark text-white py-4 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-blue/25"
      >
        {loading ? 'Saving Match...' : 'Save Match'}
      </button>
    </div>
  );
};

export default AddMatch;
