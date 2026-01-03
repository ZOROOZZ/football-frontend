// src/utils/playerUtils.js
// Optimized for park/friendly football matches

export const detectPosition = (stats) => {
  const { 
    total_goals: g = 0, 
    total_assists: a = 0, 
    total_saves: s = 0, 
    total_shots_faced: sf = 0,
    clean_sheets: cs = 0,
    matches_played: mp = 0
  } = stats;

  // Protection: Not enough data
  if (mp < 3) {
    return 'Provisional';
  }

  // Calculate ratios for better accuracy
  const totalContribution = g + a;
  const goalRatio = totalContribution > 0 ? g / totalContribution : 0;
  const assistRatio = totalContribution > 0 ? a / totalContribution : 0;
  const savesPerMatch = mp > 0 ? s / mp : 0;

  // 1. GOALKEEPER (Lowered thresholds for park football)
  if (savesPerMatch >= 2 && g <= 1) {
    return 'Goalkeeper';
  }
  
  if (s >= 5 && g === 0 && a <= 1) {
    return 'Goalkeeper';
  }

  // 2. FORWARD
  if (g >= 4 && g >= (a + 2)) {
    return 'Forward';
  }

  if (goalRatio > 0.65 && g >= 3) {
    return 'Forward';
  }

  // 3. HYBRID ROLES (Common in park football)
  if (g >= 4 && a >= 4) {
    return 'Forward/Midfielder';
  }

  if (totalContribution <= 3 && totalContribution > 0 && s > 0) {
    return 'Midfielder/Defender';
  }

  // 4. MIDFIELDER (The balance logic)
  // Balanced G/A contributor - box-to-box style
  if (g > 0 && a > 0 && Math.abs(g - a) <= 2) {
    return 'Midfielder';
  }

  // Classic playmaker - creates more than scores
  if (assistRatio > 0.6 && a >= 3) {
    return 'Midfielder';
  }
  
  if (totalContribution >= 4 && assistRatio >= 0.4) {
    return 'Midfielder';
  }

  // 5. DEFENDER
  if (totalContribution <= 2 && mp >= 3) {
    return 'Defender';
  }

  // 6. UTILITY PLAYER
  if (g > 0 && a > 0 && s > 0) {
    return 'Utility Player';
  }

  // Default fallback
  if (g > a && g > s) return 'Forward';
  if (a > g && a > s) return 'Midfielder';
  if (s > 3) return 'Goalkeeper';
  
  return 'Midfielder';
};

// Calculate confidence score (0-100)
export const getPositionConfidence = (stats) => {
  const position = detectPosition(stats);
  const { total_goals: g = 0, total_assists: a = 0, total_saves: s = 0, matches_played: mp = 0 } = stats;
  
  if (position === 'Provisional') return 0;
  if (mp < 3) return 30;
  
  let confidence = 50; 
  
  if (position === 'Goalkeeper' && s > 10) confidence = 95;
  if (position === 'Forward' && g > 8) confidence = 90;
  if (position === 'Midfielder' && Math.abs(g - a) <= 1) confidence = 85;
  
  confidence += Math.min(mp * 5, 30);
  
  return Math.min(confidence, 100);
};

export const getPositionColor = (position) => {
  const colors = {
    'Goalkeeper': 'from-purple-500 to-pink-500',
    'Forward': 'from-red-500 to-orange-500',
    'Midfielder': 'from-green-500 to-emerald-500',
    'Defender': 'from-blue-500 to-cyan-500',
    'Forward/Midfielder': 'from-red-400 to-green-400',
    'Midfielder/Defender': 'from-green-400 to-blue-400',
    'Utility Player': 'from-yellow-400 to-orange-400',
    'Provisional': 'from-gray-500 to-gray-600'
  };
  return colors[position] || 'from-gray-500 to-gray-600';
};

export const getPositionBadgeColor = (position) => {
  const colors = {
    'Goalkeeper': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Forward': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Midfielder': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Defender': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Forward/Midfielder': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Midfielder/Defender': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Utility Player': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Provisional': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };
  return colors[position] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// Enhanced player style detection
export const getPlayerStyle = (stats) => {
  const { 
    total_goals: g = 0, 
    total_assists: a = 0, 
    total_saves: s = 0, 
    clean_sheets: cs = 0, // FIXED: Added this to destructuring to solve the build error
    matches_played: mp = 0 
  } = stats;

  const position = detectPosition(stats);
  
  if (mp < 3) return 'Developing';
  
  const totalContribution = g + a;
  const goalsPerMatch = mp > 0 ? g / mp : 0;
  const assistsPerMatch = mp > 0 ? a / mp : 0;
  
  if (position === 'Goalkeeper') {
    if (s > 15) return '🧱 The Wall';
    if (s > 8) return '🧤 Shot Stopper';
    return '🛡️ Safe Hands';
  }
  
  if (position === 'Forward' || position === 'Forward/Midfielder') {
    if (goalsPerMatch > 1.5) return '🔥 Goal Machine';
    if (g > 8) return '⚡ Clinical Finisher';
    if (a > 3) return '🎯 Complete Forward';
    return '🏃 Striker';
  }
  
  if (position === 'Midfielder') {
    if (a > g * 1.5) return '🧠 Playmaker';
    if (Math.abs(g - a) <= 1 && totalContribution > 8) return '💪 Box-to-Box';
    if (assistsPerMatch > 0.8) return '🎨 Creative';
    if (g > a) return '⚔️ Attacking Mid';
    return '🔄 Central Mid';
  }
  
  if (position === 'Defender' || position === 'Midfielder/Defender') {
    if (totalContribution >= 3) return '🏃 Ball-Playing';
    if (cs > mp * 0.5) return '🛡️ Rock Solid';
    return '💪 Defensive';
  }
  
  if (position === 'Utility Player') return '🌟 Versatile';
  if (position === 'Provisional') return '🆕 New Player';
  
  return '⚽ Player';
};

export const getPositionIcon = (position) => {
  const icons = {
    'Goalkeeper': 'Shield',
    'Forward': 'Target',
    'Midfielder': 'Users',
    'Defender': 'Shield',
    'Forward/Midfielder': 'Zap',
    'Midfielder/Defender': 'Activity',
    'Utility Player': 'Star',
    'Provisional': 'HelpCircle'
  };
  return icons[position] || 'Users';
};

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
    rating = (s * 0.5) + (cs * 4);
  } else if (position === 'Forward' || position === 'Forward/Midfielder') {
    rating = (g * 3.5) + (a * 2);
  } else if (position === 'Midfielder') {
    rating = (a * 3) + (g * 2.5);
  } else if (position === 'Defender' || position === 'Midfielder/Defender') {
    rating = (cs * 3) + (a * 2.5) + (g * 2);
  } else if (position === 'Utility Player') {
    rating = (g * 2) + (a * 2) + (s * 0.3);
  }
  
  const normalizedRating = mp > 0 ? (rating / mp) : 0;
  return Math.min(Math.round(normalizedRating * 10) / 10, 10);
};

export const getPositionExplanation = (stats) => {
  const position = detectPosition(stats);
  const { total_goals: g = 0, total_assists: a = 0, total_saves: s = 0, matches_played: mp = 0 } = stats;
  
  const explanations = {
    'Goalkeeper': `Based on ${s} saves across ${mp} matches (${(s/mp).toFixed(1)} saves per game)`,
    'Forward': `Scored ${g} goals with ${a} assists - clear attacking focus`,
    'Midfielder': `Balanced contribution: ${g} goals and ${a} assists`,
    'Defender': `Low attacking involvement (${g + a} total contributions)`,
    'Forward/Midfielder': `Hybrid role - both scores (${g}) and creates (${a})`,
    'Midfielder/Defender': `Defensive-minded with occasional attacking contribution`,
    'Utility Player': `Versatile - contributes in multiple areas`,
    'Provisional': `Only ${mp} match${mp === 1 ? '' : 'es'} played - position will clarify with more games`
  };
  
  return explanations[position] || 'Position based on overall contribution';
};
