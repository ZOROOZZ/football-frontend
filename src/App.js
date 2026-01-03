import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddMatch from './components/AddMatch';
import Players from './components/Players';
import MatchesView from './components/MatchesView'; // NEW COMPONENT
import UserManagement from './components/UserManagement';
import TeamGenerator from './components/TeamGenerator';
import PositionStats from './components/PositionStats';
import { api } from './services/api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    try {
      const [matchesData, playersData] = await Promise.all([
        api.getMatches(token),
        api.getPlayers(token)
      ]);
      setMatches(matchesData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.status === 401) {
        handleLogout();
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
    try {
      const data = await api.login(username, password);
      setToken(data.token);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleSubmitMatch = async (matchData) => {
    setLoading(true);
    try {
      await api.createMatch(token, matchData);
      await loadData();
      setActiveTab('matches');
      alert('Match added successfully!');
    } catch (error) {
      console.error('Error saving match:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;
    setLoading(true);
    try {
      await api.deleteMatch(token, matchId);
      await loadData();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    setLoading(true);
    try {
      await api.deletePlayer(token, playerId);
      await loadData();
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
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <Header
        currentUser={currentUser}
        onMenuToggle={() => setSidebarOpen(true)}
        activeTab={activeTab}
      />

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
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
          <AddMatch 
            onSubmit={handleSubmitMatch} 
            loading={loading} 
            token={token} 
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView 
            matches={matches} 
            isAdmin={isAdmin} 
            onDeleteMatch={handleDeleteMatch} 
            token={token}
          />
        )}

        {activeTab === 'players' && (
          <Players
            players={players}
            isAdmin={isAdmin}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {/* Dynamic Position Rendering */}
        {['goalkeeper', 'defender', 'midfielder', 'forward'].includes(activeTab) && (
          <PositionStats 
            token={token} 
            position={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          />
        )}

        {activeTab === 'teamgen' && isAdmin && (
          <TeamGenerator token={token} />
        )}

        {activeTab === 'settings' && isAdmin && (
          <UserManagement token={token} currentUser={currentUser} />
        )}
      </main>
    </div>
  );
};

export default App;
