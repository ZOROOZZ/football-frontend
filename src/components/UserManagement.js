import React, { useState, useEffect, useCallback } from 'react';
import { Key, Trash2 } from 'lucide-react';

const UserManagement = ({ token, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState('');

  const loadUsers = useCallback(async () => {
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
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
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
      alert('Error resetting password: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

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
      alert('Error deleting user: ' + error.message);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fadeIn space-y-6">
      {/* Header */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold">User Management</h2>
            <p className="text-text-secondary mt-1">Manage user accounts and permissions</p>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const isSuperAdmin = user.username === 'admin';
          const isCurrentUser = user.id === currentUser.id;
          const isCurrentUserSuperAdmin = currentUser.username === 'admin';
          
          return (
            <div key={user.id} className="bg-dark-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold truncate">{user.username}</h3>
                    {isSuperAdmin && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg font-medium border border-yellow-500/30">
                        Super
                      </span>
                    )}
                  </div>
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
                {/* Show reset button only if: current user is super admin OR it's their own account */}
                {(isCurrentUserSuperAdmin || isCurrentUser) && (
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
                )}
                
                {/* Show delete button only if: not super admin AND not current user AND current user is super admin */}
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
                className="p-2 hover:bg-dark-bg rounded-lg transition-colors text-text-secondary hover:text-white"
              >
                ✕
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
                  minLength={6}
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-blue hover:bg-primary-blue-dark text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Reset Password
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
