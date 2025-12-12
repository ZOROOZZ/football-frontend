import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Award, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GoalkeeperStats = ({ token }) => {
  const [goalkeepers, setGoalkeepers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoalkeepers();
  }, []);

  const loadGoalkeepers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter only goalkeepers
        const gks = data.filter(p => p.position === 'Goalkeeper');
        setGoalkeepers(gks);
      }
    } catch (error) {
      console.error('Error loading goalkeepers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavePercentage = (gk) => {
    if (gk.total_shots_faced === 0) return 0;
    return ((gk.total_saves / gk.total_shots_faced) * 100).toFixed(1);
  };

  const calculateGoalsPerMatch = (gk) => {
    if (gk.matches_played === 0) return 0;
    return (gk.total_goals_conceded / gk.matches_played).toFixed(2);
  };

  const getTopGoalkeepers = () => {
    return [...goalkeepers]
      .sort((a, b) => b.clean_sheets - a.clean_sheets)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (goalkeepers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
        <Shield className="mx-auto text-gray-300 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No goalkeepers yet</h3>
        <p className="text-gray-500 dark:text-gray-500">Add players with Goalkeeper position to see stats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Total Goalkeepers</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{goalkeepers.length}</p>
            </div>
            <Shield className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Clean Sheets</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {goalkeepers.reduce((sum, gk) => sum + gk.clean_sheets, 0)}
              </p>
            </div>
            <Award className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Total Saves</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {goalkeepers.reduce((sum, gk) => sum + gk.total_saves, 0)}
              </p>
            </div>
            <Target className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Penalty Saves</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">
                {goalkeepers.reduce((sum, gk) => sum + gk.total_penalties_saved, 0)}
              </p>
            </div>
            <TrendingUp className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Clean Sheets Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Clean Sheets Leaderboard</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getTopGoalkeepers()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="clean_sheets" fill="#10b981" name="Clean Sheets" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goalkeeper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goalkeepers.map(gk => (
          <div key={gk.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Shield className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{gk.name}</h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Goalkeeper
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Matches:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{gk.matches_played}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Clean Sheets:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{gk.clean_sheets}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Saves:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{gk.total_saves}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Save %:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{calculateSavePercentage(gk)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Goals/Match:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{calculateGoalsPerMatch(gk)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Penalty Saves:</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {gk.total_penalties_saved}/{gk.total_penalties_faced}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Cards:</span>
                <div className="flex gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">🟨 {gk.total_yellow_cards}</span>
                  <span className="text-red-600 dark:text-red-400">🟥 {gk.total_red_cards}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalkeeperStats;
