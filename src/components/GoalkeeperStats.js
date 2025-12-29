import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Award, Target, TrendingUp, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GoalkeeperStats = ({ token }) => {
  const [goalkeepers, setGoalkeepers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGoalkeepers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const gks = data.filter(p => p.position === 'Goalkeeper');
        setGoalkeepers(gks);
      }
    } catch (error) {
      console.error('Error loading goalkeepers:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadGoalkeepers();
  }, [loadGoalkeepers]);

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
      .sort((a, b) => (b.clean_sheets || 0) - (a.clean_sheets || 0))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (goalkeepers.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="bg-dark-card rounded-2xl p-12 text-center shadow-card">
          <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-text-secondary" size={32} />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No goalkeepers yet</h3>
          <p className="text-text-secondary">Add players with Goalkeeper position to see stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Shield className="text-purple-500" size={20} />
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Total Goalkeepers</p>
          <p className="text-white text-3xl font-bold">{goalkeepers.length}</p>
        </div>

        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success-green/10 rounded-xl flex items-center justify-center">
              <Award className="text-success-green" size={20} />
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Clean Sheets</p>
          <p className="text-white text-3xl font-bold">
            {goalkeepers.reduce((sum, gk) => sum + (gk.clean_sheets || 0), 0)}
          </p>
        </div>

        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-blue/10 rounded-xl flex items-center justify-center">
              <Target className="text-primary-blue" size={20} />
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Total Saves</p>
          <p className="text-white text-3xl font-bold">
            {goalkeepers.reduce((sum, gk) => sum + (gk.total_saves || 0), 0)}
          </p>
        </div>

        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-warning-orange/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-warning-orange" size={20} />
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Penalty Saves</p>
          <p className="text-white text-3xl font-bold">
            {goalkeepers.reduce((sum, gk) => sum + (gk.total_penalties_saved || 0), 0)}
          </p>
        </div>
      </div>

      {/* Clean Sheets Leaderboard Chart */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <h2 className="text-white text-xl font-bold mb-6">Clean Sheets Leaderboard</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getTopGoalkeepers()} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3647" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#8b92a7' }}
              angle={-35}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: '#8b92a7' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a2332', 
                border: '1px solid #2a3647',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="clean_sheets" fill="#10b981" name="Clean Sheets" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goalkeepers List */}
      <div className="space-y-3">
        {goalkeepers.map((gk, index) => (
          <div
            key={gk.id}
            className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Shield className="text-white" size={28} />
                </div>
                {index < 3 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-green rounded-full flex items-center justify-center border-2 border-dark-card">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-bold text-lg truncate">{gk.name}</h3>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg font-medium">
                    Goalkeeper
                  </span>
                  <ChevronRight className="ml-auto text-text-secondary group-hover:text-white transition-colors flex-shrink-0" size={20} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">MATCHES</p>
                    <p className="text-white font-bold">{gk.matches_played || 0}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">CLEAN SHEETS</p>
                    <p className="text-success-green font-bold">{gk.clean_sheets || 0}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">SAVES</p>
                    <p className="text-primary-blue font-bold">{gk.total_saves || 0}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">SAVE %</p>
                    <p className="text-purple-400 font-bold">{calculateSavePercentage(gk)}%</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">GOALS/MATCH</p>
                    <p className="text-warning-orange font-bold">{calculateGoalsPerMatch(gk)}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs mb-0.5">PEN SAVES</p>
                    <p className="text-error-red font-bold">
                      {gk.total_penalties_saved || 0}/{gk.total_penalties_faced || 0}
                    </p>
                  </div>
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
