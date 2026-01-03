// src/utils/playerUtils.js
// Realistic football position detection based on actual player behavior

export const detectPosition = (stats) => {
  const { 
    total_goals: g = 0, 
    total_assists: a = 0, 
    total_saves: s = 0, 
    total_shots_faced: sf = 0,
    clean_sheets: cs = 0,
    matches_played: mp = 0
  } = stats;

  // 1. GOALKEEPER: Primary indicator is HIGH saves and shots faced
  // Only classify as GK if they have SIGNIFICANTLY high save stats
  // AND very low goals (GKs rarely score)
  if ((s > 15 || sf > 30) && g <= 2) {
    return 'Goalkeeper';
  }
  
  // Special case: If they have some clean sheets but also score goals, they're not a GK
  if (cs > 2 && s > 10 && g <= 1 && a <= 1) {
    return 'Goalkeeper';
  }

  // 2. FORWARD: High goal count relative to assists
  // Strikers score more than they create
  if (g > 5 && g > (a * 2)) {
    return 'Forward';
  }

  // 3. MIDFIELDER: The playmaker logic
  // High assists compared to goals OR balanced G/A contribution
  
  // High assist volume (classic playmaker like De Bruyne)
  if (a > 3 && a >= (g * 0.7)) {
    return 'Midfielder';
  }
  
  // Balanced box-to-box midfielder (goals ≈ assists)
  if (g > 0 && a > 0 && Math.abs(g - a) <= 2) {
    return 'Midfielder';
  }

  // General playmaker with good assists
  if (a > 2 && (g + a) > 4) {
    return 'Midfielder';
  }

  // 4. DEFENDER: Low attacking stats but participates in matches
  // They defend, so minimal goals and assists
  if ((g + a) <= 3 && mp > 0) {
    return 'Defender';
  }

  // Default fallback based on primary contribution
  if (g > a) return 'Forward';
  if (a > g) return 'Midfielder';
  
  return 'Defender';
};

export const getPositionColor = (position) => {
  const colors = {
    'Goalkeeper': 'from-purple-500 to-pink-500',
    'Forward': 'from-red-500 to-orange-500',
    'Midfielder': 'from-green-500 to-emerald-500',
    'Defender': 'from-blue-500 to-cyan-500'
  };
  return colors[position] || 'from-gray-500 to-gray-600';
};

export const getPositionBadgeColor = (position) => {
  const colors = {
    'Goalkeeper': 'bg-purple-500/20 text-purple-400',
    'Forward': 'bg-red-500/20 text-red-400',
    'Midfielder': 'bg-green-500/20 text-green-400',
    'Defender': 'bg-blue-500/20 text-blue-400'
  };
  return colors[position] || 'bg-gray-500/20 text-gray-400';
};

export const getPositionIcon = (position) => {
  // Return icon name as string for flexibility
  const icons = {
    'Goalkeeper': 'Shield',
    'Forward': 'Target',
    'Midfielder': 'Users',
    'Defender': 'Shield'
  };
  return icons[position] || 'Users';
};

// Helper function to get player performance rating
export const calculatePlayerRating = (stats) => {
  const { 
    total_goals: g = 0, 
    total_assists: a = 0, 
    total_saves: s = 0,
    clean_sheets: cs = 0,
    matches_played: mp = 1
  } = stats;

  const position = detectPosition(stats);
  
  let rating = 0;
  
  if (position === 'Goalkeeper') {
    rating = (s * 0.5) + (cs * 3);
  } else if (position === 'Forward') {
    rating = (g * 3) + (a * 1.5);
  } else if (position === 'Midfielder') {
    rating = (a * 2.5) + (g * 2);
  } else { // Defender
    rating = (cs * 2) + (a * 2) + (g * 2);
  }
  
  // Normalize by matches played
  return Math.round((rating / mp) * 10) / 10;
};

// Helper function to describe player style
export const getPlayerStyle = (stats) => {
  const { total_goals: g = 0, total_assists: a = 0 } = stats;
  const position = detectPosition(stats);
  
  if (position === 'Goalkeeper') return 'Shot Stopper';
  
  if (position === 'Midfielder') {
    if (a > g * 1.5) return 'Playmaker';
    if (Math.abs(g - a) <= 1) return 'Box-to-Box';
    if (g > a) return 'Attacking Mid';
    return 'Deep-Lying';
  }
  
  if (position === 'Forward') {
    if (g > a * 3) return 'Poacher';
    if (a > 2) return 'Complete Forward';
    return 'Striker';
  }
  
  if (position === 'Defender') {
    if ((g + a) > 2) return 'Ball-Playing Defender';
    return 'Defensive';
  }
  
  return 'Versatile';
};
