import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Key, Trash2, X, UserPlus, Shield } from 'lucide-react';

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
      const data = await response.json();
      if (response.ok) {
        alert('Password reset successfully!');
        setResetPassword('');
        setShowResetPassword(false);
        setSelectedUser(null);
      } else {
        alert(data.error || 'Failed to reset password');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      const response = await fetch(`https://football-tracker-api.mehul-112.workers.dev/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        alert('User deleted successfully!');
        loadUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (handleCreateUser and handleAddPlayer remain the same as your provided code)

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header section... same as before */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const isSuperAdmin = user.username === 'admin';
          const isCurrentUser = user.id === currentUser.id;
          const isCurrentUserSuperAdmin = currentUser.username === 'admin';

          return (
            <div key={user.id} className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold truncate">{user.username}</h3>
                    {isSuperAdmin && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg font-medium border border-yellow-500/30">
                        Super Admin
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    user.role === 'admin' ? 'bg-error-red/20 text-error-red' : 'bg-primary-blue/20 text-primary-blue'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {(isCurrentUserSuperAdmin || isCurrentUser) && (
                  <button
                    onClick={() => { setSelectedUser(user); setShowResetPassword(true); }}
                    className="flex-1 bg-warning-orange/10 text-warning-orange px-3 py-2 rounded-xl hover:bg-warning-orange hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Key size={14} /> Reset
                  </button>
                )}
                {!isSuperAdmin && !isCurrentUser && isCurrentUserSuperAdmin && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-error-red/10 text-error-red px-3 py-2 rounded-xl hover:bg-error-red hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals for Add User, Add Player, and Reset Password... same as before */}
    </div>
  );
};

export default UserManagement;
