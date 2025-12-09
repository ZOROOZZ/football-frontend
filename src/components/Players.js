import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

const Players = ({ players, isAdmin, onDeletePlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const getPlayerPerformance = (player) => {
    return player.history.map(h => ({
      date: h.date,
      goals: h.goals,
      assists: h.assists,
      saves: h.saves
    }));
  };

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
        <Users className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No players yet</h3>
        <p className="text-sm sm:text-base text-gray-500">Add your first match to see player statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {players.map((player) => (
          <div key={player.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h3 
                onClick={() => setSelectedPlayer(player)}
                className="text-lg sm:text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
              >
                {player.name}
              </h3>
              {isAdmin && (
                <button
                  onClick={() => onDeletePlayer(player.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                >
                  Delete
                </button>
              )}
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
    </div>
  );
};

export default Players;
