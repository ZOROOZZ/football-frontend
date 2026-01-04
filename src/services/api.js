const API_URL = 'https://football-tracker-api.mehul-112.workers.dev';

export const api = {
  // Auth
  async login(username, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }
    
    return response.json();
  },

  // Get matches
  async getMatches(token) {
    const response = await fetch(`${API_URL}/api/matches`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch matches');
    return response.json();
  },

  // Get players
  async getPlayers(token) {
    const response = await fetch(`${API_URL}/api/players`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  },

  // Create match
  async createMatch(token, matchData) {
    // console.log('DEBUG: Sending match data:', matchData); // Helpful for debugging
    const response = await fetch(`${API_URL}/api/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(matchData)
    });
    
    const data = await response.json();
    if (!response.ok) {
      console.error('Match Creation Error:', data);
      throw new Error(data.error || 'Failed to create match');
    }
    
    return data;
  },

  // NOTE: The endpoints below require backend updates to work!
  // I have updated the Worker code in the next section to support these.

  // Delete match
  async deleteMatch(token, matchId) {
    const response = await fetch(`${API_URL}/api/matches/${matchId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete match');
    }
    
    return response.json();
  },

  // Delete player
  async deletePlayer(token, playerId) {
    const response = await fetch(`${API_URL}/api/players/${playerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete player');
    }
    
    return response.json();
  }
};
