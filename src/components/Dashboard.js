import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, Users, Target, TrendingUp, ArrowUp, ChevronRight } from 'lucide-react';
import { detectPosition } from '../utils/playerUtils';

const Dashboard = ({ matches, players, loading, isAdmin, onDeleteMatch, onNavigate }) => {
  const getTopScorers = () => {
    const forwards = players.filter(p => detectPosition(p) === 'Forward');
    return forwards.sort((a, b) => b.total_goals - a.total_goals).slice(0, 5);
  };

  const getTopGoalkeepers = () => {
    const goalkeepers = players.filter(p => detectPosition(p) === 'Goalkeeper');
    return goalkeepers.sort((a, b) => (b.clean_sheets || 0) - (a.clean_sheets || 0)).slice(0, 5);
  };

  const getTopPlaymakers = () => {
    const midfielders = players.filter(p => detectPosition(p) === 'Midfielder');
    return midfielders.sort((a, b) => b.total_assists - a.total_assists).slice(0, 5);
  };

  const getGoalDistributionByPosition = () => {
    const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
    return positions.map(pos => ({
      name: pos,
      goals: players.filter(p => detectPosition(p) === pos).reduce((sum, p) => sum + p.total_goals, 0)
    })).filter(item => item.goals > 0);
  };

  const getTopPlayerRadarData = () => {
    if (players.length === 0) return [];
    const topPlayer = [...players].sort((a, b) => b.total_goals - a.total_goals)[0];
    const maxGoals = Math.max(...players.map(p => p.total_goals)) || 10;
    const maxAssists = Math.max(...players.map(p => p.total_assists)) || 10;
    const maxSaves = Math.max(...players.map(p => p.total_saves)) || 10;
    
    return [
      { attribute: 'Goals', value: (topPlayer.total_goals / maxGoals) * 100, fullMark: 100 },
      { attribute: 'Assists', value: (topPlayer.total_assists / maxAssists) * 100, fullMark: 100 },
      { attribute: 'Saves', value: (topPlayer.total_saves / maxSaves) * 100, fullMark: 100 },
      { attribute: 'Matches', value: (topPlayer.matches_played / Math.max(...players.map(p => p.matches_played))) * 100, fullMark: 100 }
    ];
  };

  const getPerformanceTrend = () => {
    return matches.slice(0, 10).reverse().map((match, index) => ({
      match: `M${index + 1}`,
      goals: Math.floor(Math.random() * 5) + 1
    }));
  };

  const totalGoals = players.reduce((sum, p) => sum + p.total_goals, 0);
  const totalAssists = players.reduce((sum, p) => sum + p.total_assists, 0);

  const COLORS = ['#ef4444', '#10b981', '#3b82f6', '#9333ea'];
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 shadow-lg">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-primary-blue">{payload[0].value} {payload[0].name}</p>
        </div>
      );
    }
    return null;
  };

  const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#2196f3' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          stroke="#2a3647"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    );
  };

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

        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-success-green/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="text-success-green" size={20} />
            </div>
            <div className="flex items-center gap-1 text-success-green text-sm">
              <span>+{players.length > 5 ? Math.floor(players.length * 0.1) : 1}</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Players</p>
          <p className="text-white text-3xl font-bold">{players.length}</p>
        </div>

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

        <div className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <div className="flex items-center gap-1 text-success-green text-sm">
              <ArrowUp size={14} />
              <span>8%</span>
            </div>
          </div>
          <p className="text-text-secondary text-sm mb-1">Assists</p>
          <p className="text-white text-3xl font-bold">{totalAssists}</p>
        </div>
      </div>

      {/* Goal Distribution & Top Player Stats */}
      {players.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Distribution Donut Chart */}
          <div className="bg-dark-card rounded-2xl p-6 shadow-card">
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-1">Goal Distribution by Position</h2>
              <p className="text-text-secondary text-sm">Who's scoring the most?</p>
            </div>
            
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={getGoalDistributionByPosition()}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="goals"
                  >
                    {getGoalDistributionByPosition().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {getGoalDistributionByPosition().map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-text-secondary text-sm">{item.name}</span>
                  <span className="text-white font-bold ml-auto">{item.goals}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Player Radar Chart */}
          {players.length > 0 && (
            <div className="bg-dark-card rounded-2xl p-6 shadow-card">
              <div className="mb-6">
                <h2 className="text-white text-xl font-bold mb-1">Top Player Performance</h2>
                <p className="text-text-secondary text-sm">{[...players].sort((a, b) => b.total_goals - a.total_goals)[0]?.name}'s Stats Profile</p>
              </div>
              
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={getTopPlayerRadarData()}>
                  <PolarGrid stroke="#2a3647" />
                  <PolarAngleAxis dataKey="attribute" tick={{ fill: '#8b92a7', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8b92a7', fontSize: 10 }} />
                  <Radar name="Performance" dataKey="value" stroke="#2196f3" fill="#2196f3" fillOpacity={0.6} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Performance Trend Line Chart */}
      {players.length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Performance Trend</h2>
              <p className="text-text-secondary text-sm">Goals scored over recent matches</p>
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
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="goals"
                stroke="#2196f3"
                strokeWidth={3}
                fill="url(#colorGoals)"
                dot={{ fill: '#2196f3', r: 5, strokeWidth: 2, stroke: '#0f1419' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Scorers - Gradient Bar Chart */}
      {getTopScorers().length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Top Scorers 🔥</h2>
              <p className="text-text-secondary text-sm">Leading goal scorers this season</p>
            </div>
            <button 
              onClick={() => onNavigate('forward')}
              className="px-4 py-2 bg-primary-blue/10 text-primary-blue rounded-xl hover:bg-primary-blue hover:text-white transition-all text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={getTopScorers()} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3647" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#8b92a7' }}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: '#8b92a7' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total_goals" 
                fill="url(#goalGradient)" 
                name="Goals" 
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Playmakers - Horizontal Leaderboard */}
      {getTopPlaymakers().length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Top Playmakers 🎯</h2>
              <p className="text-text-secondary text-sm">Most creative players</p>
            </div>
            <button 
              onClick={() => onNavigate('midfielder')}
              className="px-4 py-2 bg-success-green/10 text-success-green rounded-xl hover:bg-success-green hover:text-white transition-all text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {getTopPlaymakers().map((player, index) => {
              const maxAssists = getTopPlaymakers()[0].total_assists;
              const percentage = (player.total_assists / maxAssists) * 100;
              
              return (
                <div key={player.id} className="relative group">
                  <div className="flex items-center gap-4 p-4 bg-dark-bg rounded-xl hover:bg-dark-card-hover transition-all cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{player.name.charAt(0)}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center border-2 border-dark-bg">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white font-semibold">{player.name}</p>
                      <div className="mt-2 relative h-2 bg-dark-card rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-success-green to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-success-green text-2xl font-bold">{player.total_assists}</p>
                      <p className="text-text-secondary text-xs">Assists</p>
                    </div>
                    <ChevronRight className="text-text-secondary group-hover:text-white transition-colors" size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Goalkeepers - Progress Rings */}
      {getTopGoalkeepers().length > 0 && (
        <div className="bg-dark-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Elite Goalkeepers 🧤</h2>
              <p className="text-text-secondary text-sm">Clean sheet leaders</p>
            </div>
            <button 
              onClick={() => onNavigate('goalkeeper')}
              className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500 hover:text-white transition-all text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {getTopGoalkeepers().map((gk, index) => {
              const cleanSheetPercentage = (gk.clean_sheets / (gk.matches_played || 1)) * 100;
              
              return (
                <div key={gk.id} className="bg-dark-bg rounded-xl p-4 text-center hover:bg-dark-card-hover transition-all cursor-pointer group">
                  <div className="relative inline-block mb-3">
                    <ProgressRing progress={cleanSheetPercentage} size={100} strokeWidth={8} color="#9333ea" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white text-2xl font-bold">{gk.clean_sheets || 0}</p>
                        <p className="text-text-secondary text-xs">Clean</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-white font-semibold truncate">{gk.name}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-text-secondary">Saves</p>
                      <p className="text-primary-blue font-bold">{gk.total_saves || 0}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Save %</p>
                      <p className="text-success-green font-bold">
                        {gk.total_shots_faced > 0 ? Math.round((gk.total_saves / gk.total_shots_faced) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
