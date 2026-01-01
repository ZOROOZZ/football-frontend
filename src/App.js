// Update your App.js to include position-specific tabs

import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddMatch from './components/AddMatch';
import Players from './components/Players';
import UserManagement from './components/UserManagement';
import TeamGenerator from './components/TeamGenerator';
// import GoalkeeperStats from './components/GoalkeeperStats';
import PositionStats from './components/PositionStats'; // NEW COMPONENT
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

  // ... (keep all existing functions: handleLogout, loadData, etc.)

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
      if (error.message.includes('401')) {
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
    const data = await api.login(username, password);
    setToken(data.token);
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const handleSubmitMatch = async (matchData) => {
    setLoading(true);
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
    <div className="min-h-screen bg-dark-bg">
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

      <main>
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

        {/* Position-specific tabs */}
        {activeTab === 'goalkeeper' && (
          <PositionStats token={token} position="Goalkeeper" />
        )}

        {activeTab === 'defender' && (
          <PositionStats token={token} position="Defender" />
        )}

        {activeTab === 'midfielder' && (
          <PositionStats token={token} position="Midfielder" />
        )}

        {activeTab === 'forward' && (
          <PositionStats token={token} position="Forward" />
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
