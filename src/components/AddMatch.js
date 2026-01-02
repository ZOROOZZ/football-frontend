import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Users as UsersIcon } from 'lucide-react';;

const AddMatch = ({ onSubmit, loading, token }) => {
  const [matchDate, setMatchDate] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [teamAScore, setTeamAScore] = useState({ firstHalf: 0, secondHalf: 0 });
  const [teamBScore, setTeamBScore] = useState({ firstHalf: 0, secondHalf: 0 });
  const [currentTeam, setCurrentTeam] = useState('A');

  // Load available players
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAvailablePlayers(data);
        }
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };
    loadPlayers();
  }, [token]);

  const addPlayerToTeam = (team) => {
    const newPlayer = {
      playerId: '',
      name: '',
      position: '',
      goals: 0,
      saves: 0,
      assists: 0,
      shots_faced: 0,
      goals_conceded: 0,
      penalties_faced: 0,
      penalties_saved: 0,
      yellow_cards: 0,
      red_cards: 0
    };

    if (team === 'A') {
      setTeamAPlayers([...teamAPlayers, newPlayer]);
    } else {
      setTeamBPlayers([...teamBPlayers, newPlayer]);
    }
  };

  const removePlayer = (team, index) => {
    if (team === 'A') {
      setTeamAPlayers(teamAPlayers.filter((_, i) => i !== index));
    } else {
      setTeamBPlayers(teamBPlayers.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (team, index, field, value) => {
    const updateTeam = team === 'A' ? teamAPlayers : teamBPlayers;
    const updated = [...updateTeam];

    if (field === 'playerId') {
      const player = availablePlayers.find(p => p.id === parseInt(value));
      if (player) {
        updated[index] = {
          ...updated[index],
          playerId: player.id,
          name: player.name,
          position: player.position || 'Forward'
        };
      }
    } else {
      updated[index][field] = field === 'name' || field === 'position' ? value : parseInt(value) || 0;
    }

    if (team === 'A') {
      setTeamAPlayers(updated);
    } else {
      setTeamBPlayers(updated);
    }
  };

  const handleSubmit = () => {
    if (!matchDate) {
      alert('Please select a match date');
      return;
    }

    if (teamAPlayers.length === 0 && teamBPlayers.length === 0) {
      alert('Please add at least one player');
      return;
    }

    const allPlayers = [...teamAPlayers, ...teamBPlayers]
      .filter(p => p.name.trim() !== '')
      .map(p => ({
        name: p.name,
        goals: p.goals,
        saves: p.saves,
        assists: p.assists,
        shots_faced: p.shots_faced,
        goals_conceded: p.goals_conceded,
        penalties_faced: p.penalties_faced,
        penalties_saved: p.penalties_saved,
        yellow_cards: p.yellow_cards,
        red_cards: p.red_cards
      }));

    const matchData = {
      date: matchDate,
      players: allPlayers,
      teamA: {
        players: teamAPlayers.filter(p => p.name.trim() !== '').map(p => p.name),
        score: {
          firstHalf: teamAScore.firstHalf,
          secondHalf: teamAScore.secondHalf,
          total: teamAScore.firstHalf + teamAScore.secondHalf
        }
      },
      teamB: {
        players: teamBPlayers.filter(p => p.name.trim() !== '').map(p => p.name),
        score: {
          firstHalf: teamBScore.firstHalf,
          secondHalf: teamBScore.secondHalf,
          total: teamBScore.firstHalf + teamBScore.secondHalf
        }
      }
    };

    onSubmit(matchData);
  };

  const StatSelector = ({ label, value, onChange, max = 10 }) => (
    <div>
      <label className="block text-text-secondary text-xs mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-blue"
      >
        {[...Array(max + 1)].map((_, i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>
    </div>
  );

  const PlayerCard = ({ player, index, team }) => (
    <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          team === 'A' ? 'bg-primary-blue' : 'bg-warning-orange'
        }`}>
          <UsersIcon className="text-white" size={20} />
        </div>
        
        <select
          value={player.playerId || ''}
          onChange={(e) => updatePlayer(team, index, 'playerId', e.target.value)}
          className="flex-1 bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue"
        >
          <option value="">Select Player</option>
          {availablePlayers.map(p => (
            <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
          ))}
        </select>

        <button
          onClick={() => removePlayer(team, index)}
          className="p-2 text-text-secondary hover:text-error-red hover:bg-error-red/10 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {player.name && (
        <>
          <div className="mb-3 p-2 bg-dark-card rounded-lg">
            <p className="text-text-secondary text-xs">Position</p>
            <p className="text-white font-semibold">{player.position}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <StatSelector
              label="Goals"
              value={player.goals}
              onChange={(val) => updatePlayer(team, index, 'goals', val)}
            />
            <StatSelector
              label="Assists"
              value={player.assists}
              onChange={(val) => updatePlayer(team, index, 'assists', val)}
            />
            <StatSelector
              label="Saves"
              value={player.saves}
              onChange={(val) => updatePlayer(team, index, 'saves', val)}
            />
          </div>

          {player.position === 'Goalkeeper' && (
            <details className="group">
              <summary className="text-text-secondary hover:text-white cursor-pointer text-sm font-medium py-2 border-t border-dark-border">
                Goalkeeper Stats
              </summary>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <StatSelector
                  label="Shots Faced"
                  value={player.shots_faced}
                  onChange={(val) => updatePlayer(team, index, 'shots_faced', val)}
                  max={30}
                />
                <StatSelector
                  label="Goals Conceded"
                  value={player.goals_conceded}
                  onChange={(val) => updatePlayer(team, index, 'goals_conceded', val)}
                />
                <StatSelector
                  label="Penalties Faced"
                  value={player.penalties_faced}
                  onChange={(val) => updatePlayer(team, index, 'penalties_faced', val)}
                />
                <StatSelector
                  label="Penalties Saved"
                  value={player.penalties_saved}
                  onChange={(val) => updatePlayer(team, index, 'penalties_saved', val)}
                />
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Match Details */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <h2 className="text-white text-2xl font-bold mb-6">Match Details</h2>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="datetime-local"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-blue transition-colors"
          />
        </div>
      </div>

      {/* Team Selection Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentTeam('A')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            currentTeam === 'A'
              ? 'bg-primary-blue text-white shadow-lg'
              : 'bg-dark-card text-text-secondary hover:text-white'
          }`}
        >
          Team A ({teamAPlayers.length})
        </button>
        <button
          onClick={() => setCurrentTeam('B')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            currentTeam === 'B'
              ? 'bg-warning-orange text-white shadow-lg'
              : 'bg-dark-card text-text-secondary hover:text-white'
          }`}
        >
          Team B ({teamBPlayers.length})
        </button>
      </div>

      {/* Team Score */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <h3 className="text-white text-lg font-bold mb-4">
          Team {currentTeam} Score
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-text-secondary text-sm mb-2">1st Half</label>
            <select
              value={currentTeam === 'A' ? teamAScore.firstHalf : teamBScore.firstHalf}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (currentTeam === 'A') {
                  setTeamAScore({...teamAScore, firstHalf: val});
                } else {
                  setTeamBScore({...teamBScore, firstHalf: val});
                }
              }}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
            >
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">2nd Half</label>
            <select
              value={currentTeam === 'A' ? teamAScore.secondHalf : teamBScore.secondHalf}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (currentTeam === 'A') {
                  setTeamAScore({...teamAScore, secondHalf: val});
                } else {
                  setTeamBScore({...teamBScore, secondHalf: val});
                }
              }}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
            >
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 p-4 bg-dark-bg rounded-xl text-center">
          <p className="text-text-secondary text-sm mb-1">Total Score</p>
          <p className="text-white text-3xl font-bold">
            {currentTeam === 'A' 
              ? teamAScore.firstHalf + teamAScore.secondHalf
              : teamBScore.firstHalf + teamBScore.secondHalf
            }
          </p>
        </div>
      </div>

      {/* Players */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold">
            Team {currentTeam} Players
          </h3>
          <button
            onClick={() => addPlayerToTeam(currentTeam)}
            className="bg-success-green hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Player
          </button>
        </div>

        <div className="space-y-4">
          {(currentTeam === 'A' ? teamAPlayers : teamBPlayers).map((player, index) => (
            <PlayerCard key={index} player={player} index={index} team={currentTeam} />
          ))}
        </div>

        {((currentTeam === 'A' && teamAPlayers.length === 0) || 
          (currentTeam === 'B' && teamBPlayers.length === 0)) && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto text-text-secondary mb-4" size={48} />
            <p className="text-text-secondary">No players added yet</p>
          </div>
        )}
      </div>

      {/* Match Summary */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <h3 className="text-white text-xl font-bold mb-4">Match Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary-blue/10 border border-primary-blue/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">Team A</h4>
              <span className="text-primary-blue text-2xl font-bold">
                {teamAScore.firstHalf + teamAScore.secondHalf}
              </span>
            </div>
            <p className="text-text-secondary text-sm">
              {teamAPlayers.filter(p => p.name).length} players • 
              1st Half: {teamAScore.firstHalf} • 
              2nd Half: {teamAScore.secondHalf}
            </p>
          </div>
          <div className="p-4 bg-warning-orange/10 border border-warning-orange/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold">Team B</h4>
              <span className="text-warning-orange text-2xl font-bold">
                {teamBScore.firstHalf + teamBScore.secondHalf}
              </span>
            </div>
            <p className="text-text-secondary text-sm">
              {teamBPlayers.filter(p => p.name).length} players • 
              1st Half: {teamBScore.firstHalf} • 
              2nd Half: {teamBScore.secondHalf}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
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
