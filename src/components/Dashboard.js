import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Target, TrendingUp } from 'lucide-react';

const Dashboard = ({ matches, players, loading, isAdmin, onDeleteMatch, onNavigate }) => {
  const getTopScorers = () => {
    return [...players].sort((a, b) => b.total_goals - a.total_goals).slice(0, 5);
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* No matches placeholder */}
      {matches.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <Target className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches yet</h3>
          <p className="text-gray-500 mb-4">Start by adding your first match!</p>
          {isAdmin && (
            <button
              onClick={() => onNavigate('addMatch')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Match
            </button>
          )}
        </div>
      )}

      {/* Recent Matches List - Admin Only */}
      {matches.length > 0 && isAdmin && (
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
                  onClick={() => onDeleteMatch(match.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
