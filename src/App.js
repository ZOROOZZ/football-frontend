import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Plus, Users, Settings, Shuffle } from 'lucide-react'; // <-- ADDED Shuffle
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddMatch from './components/AddMatch';
import Players from './components/Players';
import UserManagement from './components/UserManagement';
import PlayerManagement from './components/PlayerManagement'; // <-- ADDED PlayerManagement
import TeamGenerator from './components/TeamGenerator'; // <-- ADDED TeamGenerator
import { api } from './services/api';
import { ThemeProvider } from './context/ThemeContext'; // <-- ADDED ThemeProvider (Though context usage is in index.js)

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMatches([]);
    setPlayers([]);
  }, []);

  const loadData = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const [matchesData, playersData] = await Promise.all([
        api.getMatches(token),
        api.getPlayers(token)
      ]);
      setMatches(matchesData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message.includes('401')) {
        handleLogout();
      } else {
        setError('Failed to load data. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadData();
    }
  }, [isAuthenticated, token, loadData]);

  const handleLogin = async (username, password) => {
    const data = await api.login(username, password);
    setToken(data.token);
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const handleSubmitMatch = async (matchData) => {
    setLoading(true);
    setError(null);
    try {
      await api.createMatch(token, matchData);
      await loadData();
      setActiveTab('dashboard');
      alert('Match added successfully!');
    } catch (error) {
      console.error('Error saving match:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) {
      return;
    }
    setLoading(true);
    try {
      await api.deleteMatch(token, matchId);
      await loadData();
      alert('Match deleted successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player?')) {
      return;
    }
    setLoading(true);
    try {
      await api.deletePlayer(token, playerId);
      await loadData();
      alert('Player deleted successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          error={error}
          showThemeToggle={true} // <-- ADDED showThemeToggle prop
        />

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-4 sm:mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <TrendingUp size={18} />
              Dashboard
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('addMatch')}
                className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  activeTab === 'addMatch' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Plus size={18} />
                Add Match
              </button>
            )}
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                activeTab === 'players' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Users size={18} />
              Players
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Settings size={18} />
                Settings
              </button>
            )}
            {isAdmin && (
              <button // <-- ADDED Team Gen Tab
                onClick={() => setActiveTab('teamgen')}
                className={`flex-1 min-w-max px-4 sm:px-6 py-3 sm:py-4 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                  activeTab === 'teamgen' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Shuffle size={18} />
                Team Gen
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <Dashboard
            matches={matches}
            players={players}
            loading={loading}
            isAdmin={isAdmin}
            onDeleteMatch={handleDeleteMatch}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'addMatch' && isAdmin && (
          <AddMatch onSubmit={handleSubmitMatch} loading={loading} />
        )}

        {activeTab === 'players' && (
          <Players
            players={players}
            isAdmin={isAdmin}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {activeTab === 'settings' && isAdmin && (
          <UserManagement token={token} currentUser={currentUser} onPlayerAdded={loadData} />
        )}

        {activeTab === 'teamgen' && isAdmin && ( // <-- ADDED Team Generator Content
          <TeamGenerator token={token} players={players} />
        )}
      </div>
    </div>
  );
};

export default App;
