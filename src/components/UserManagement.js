import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Key, Trash2, X, UserPlus, Shield } from 'lucide-react';

const UserManagement = ({ token, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [resetPassword, setResetPassword] = useState('');
  
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState('Forward');

  const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole
        })
      });

      if (response.ok) {
        alert('User created successfully!');
        setNewUsername('');
        setNewPassword('');
        setNewRole('user');
        setShowAddUser(false);
        loadUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      alert('Error creating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://football-tracker-api.mehul-112.workers.dev/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: playerName,
          position: position,
          total_goals: 0,
          total_saves: 0,
          total_assists: 0,
          matches_played: 0
        })
      });

      if (response.ok) {
        alert('Player added successfully!');
        setPlayerName('');
        setPosition('Forward');
        setShowAddPlayer(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add player');
      }
    } catch (error) {
      alert('Error adding player: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`https://football-tracker-api.mehul-112.workers.dev/api/users/${selectedUser.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: resetPassword })
      });

      if (response.ok) {
        alert('Password reset successfully!');
        setResetPassword('');
        setShowResetPassword(false);
        setSelectedUser(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reset password');
      }
    } catch (error) {
      alert('Error resetting password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://football-tracker-api.mehul-112.workers.dev/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('User deleted successfully!');
        loadUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              Settings
            </h2>
            <p className="text-text-secondary mt-1">Manage users and players</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAddPlayer(true)}
              className="flex-1 sm:flex-none bg-success-green hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Add Player
            </button>
            <button
              onClick={() => setShowAddUser(true)}
              className="flex-1 sm:flex-none bg-primary-blue hover:bg-primary-blue-dark text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate">{user.username}</h3>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                  user.role === 'admin' 
                    ? 'bg-error-red/20 text-error-red' 
                    : 'bg-primary-blue/20 text-primary-blue'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowResetPassword(true);
                }}
                className="flex-1 bg-warning-orange/10 text-warning-orange px-3 py-2 rounded-xl hover:bg-warning-orange hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-1"
              >
                <Key size={14} />
                Reset
              </button>
              {user.id !== currentUser.id && (
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-error-red/10 text-error-red px-3 py-2 rounded-xl hover:bg-error-red hover:text-white transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-blue hover:bg-primary-blue-dark text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-dark-bg text-text-secondary hover:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add New Player</h3>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Player Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-success-green hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Player'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  className="flex-1 bg-dark-bg text-text-secondary hover:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-dark-card rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Reset Password</h3>
              <button
                onClick={() => {
                  setShowResetPassword(false);
                  setSelectedUser(null);
                  setResetPassword('');
                }}
                className="p-2 hover:bg-dark-bg rounded-lg transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <p className="text-text-secondary mb-4">
              Reset password for <span className="text-white font-semibold">{selectedUser.username}</span>
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-blue"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-blue hover:bg-primary-blue-dark text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(false);
                    setSelectedUser(null);
                    setResetPassword('');
                  }}
                  className="flex-1 bg-dark-bg text-text-secondary hover:text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
