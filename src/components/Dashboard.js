import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Users, Target, TrendingUp, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

const Dashboard = ({ matches, players, loading, isAdmin, onDeleteMatch, onNavigate }) => {
  const getTopScorers = () => {
    return [...players].sort((a, b) => b.total_goals - a.total_goals).slice(0, 5);
  };

  const getPerformanceTrend = () => {
    return matches.slice(0, 10).reverse().map((match, index) => ({
      match: `M${index + 1}`,
      goals: Math.floor(Math.random() * 5) + 1 // Replace with actual data
    }));
  };

  const totalGoals = players.reduce((sum, p) => sum + p.total_goals, 0);
  const totalSaves = players.reduce((sum, p) => sum + p.total_saves, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Matches Card */}
        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-primary-blue/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="text-primary-blue" size={20} />
            </div>
            <div className="flex items-center gap-1 text-success-green text-sm">
              <ArrowUp size={14} />
              <span>2%</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Matches</p>
          <p className="text-white text-3xl font-bold">{matches.length}</p>
        </div>

        {/* Players Card */}
        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success-green/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="text-success-green" size={20} />
            </div>
            <div className="flex items-center gap-1 text-success-green text-sm">
              <span>+1</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Players</p>
          <p className="text-white text-3xl font-bold">{players.length}</p>
        </div>

        {/* Goals Card */}
        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-error-red/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="text-error-red" size={20} />
            </div>
            <div className="flex items-center gap-1 text-success-green text-sm">
              <ArrowUp size={14} />
              <span>12%</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Goals</p>
          <p className="text-white text-3xl font-bold">{totalGoals}</p>
        </div>

        {/* Saves Card */}
        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <div className="flex items-center gap-1 text-success-green text-sm">
              <ArrowUp size={14} />
              <span>5%</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Saves</p>
          <p className="text-white text-3xl font-bold">{totalSaves}</p>
        </div>
      </div>

      {/* Performance Analysis */}
      {players.length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Performance Analysis</h2>
              <p className="text-text-secondary text-sm">Goal distribution over time</p>
            </div>
            <button className="text-primary-blue text-sm font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="mb-6">
            <p className="text-text-secondary text-sm mb-2">Goal Distribution</p>
            <div className="flex items-baseline gap-3">
              <p className="text-white text-4xl font-bold">{totalGoals} Goals</p>
              <span className="text-success-green text-sm">+12% vs last season</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={getPerformanceTrend()}>
              <defs>
                <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196f3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2196f3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3647" />
              <XAxis dataKey="match" stroke="#8b92a7" fontSize={12} />
              <YAxis stroke="#8b92a7" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2332',
                  border: '1px solid #2a3647',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="goals"
                stroke="#2196f3"
                strokeWidth={3}
                fill="url(#colorGoals)"
                dot={{ fill: '#2196f3', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-dark-border">
            <div>
              <p className="text-text-secondary text-sm mb-1">1ST HALF</p>
              <p className="text-white text-2xl font-bold">22 Goals</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">2ND HALF</p>
              <p className="text-primary-blue text-2xl font-bold">34 Goals</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Scorers */}
      {players.length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <h2 className="text-white text-xl font-bold mb-6">Top Scorers</h2>
          <div className="space-y-3">
            {getTopScorers().map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-4 p-4 bg-dark-bg rounded-xl hover:bg-dark-card-hover transition-colors cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{player.name.charAt(0)}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center border-2 border-dark-bg">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-text-secondary text-sm">
                    {player.position || 'Forward'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary-blue text-2xl font-bold">{player.total_goals}</p>
                  <p className="text-text-secondary text-xs">GOALS</p>
                </div>
                <ChevronRight className="text-text-secondary group-hover:text-white transition-colors" size={20} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Matches */}
      {matches.length > 0 && isAdmin && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <h2 className="text-white text-xl font-bold mb-6">Recent Matches</h2>
          <div className="space-y-3">
            {matches.slice(0, 5).map((match, index) => (
              <div
                key={match.id}
                className="flex items-center justify-between p-4 bg-dark-bg rounded-xl hover:bg-dark-card-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-12 rounded-full ${index % 2 === 0 ? 'bg-success-green' : 'bg-error-red'}`} />
                  <div>
                    <p className="text-white font-semibold">Match on {match.match_date}</p>
                    <p className="text-text-secondary text-sm">{new Date(match.match_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteMatch(match.id)}
                  className="px-4 py-2 bg-error-red/10 text-error-red rounded-lg hover:bg-error-red hover:text-white transition-colors text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {matches.length === 0 && (
        <div className="bg-dark-card rounded-2xl p-12 text-center shadow-card">
          <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-text-secondary" size={32} />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No matches yet</h3>
          <p className="text-text-secondary mb-6">Start tracking your team's performance</p>
          {isAdmin && (
            <button
              onClick={() => onNavigate('addMatch')}
              className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Add Your First Match
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
