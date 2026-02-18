// levels.js - level metadata and helpers

export const levels = [
  // Easy 1–10
  level(1, "Country Road", "easy", 2600, 0.7, 80, 0.18, 0.09, 0.05, 1.2, "pastelFields"),
  level(2, "Grassy Hill", "easy", 2700, 0.8, 90, 0.2, 0.09, 0.05, 1.2, "pastelHills"),
  level(3, "Sunny Beach", "easy", 2600, 0.6, 60, 0.19, 0.1, 0.05, 1.1, "beach"),
  level(4, "Farm Fields", "easy", 2600, 0.7, 70, 0.18, 0.09, 0.05, 1.2, "farm"),
  level(5, "Seaside Cliffs", "easy", 2800, 0.9, 100, 0.17, 0.08, 0.05, 1.2, "cliffs"),
  level(6, "Meadow Run", "easy", 2600, 0.7, 70, 0.18, 0.09, 0.05, 1.2, "meadow"),
  level(7, "Rolling Plains", "easy", 2700, 0.8, 90, 0.17, 0.09, 0.05, 1.2, "plains"),
  level(8, "Orchard Path", "easy", 2600, 0.7, 70, 0.18, 0.09, 0.05, 1.2, "orchard"),
  level(9, "Lakeside Drive", "easy", 2700, 0.7, 70, 0.18, 0.08, 0.05, 1.2, "lake"),
  level(10, "Gentle Forest", "easy", 2800, 0.8, 80, 0.17, 0.08, 0.05, 1.2, "forest"),
  // Normal 11–20
  level(11, "Rocky Mountain", "normal", 3200, 1.1, 120, 0.15, 0.07, 0.05, 1.3, "mountain"),
  level(12, "Desert Dunes", "normal", 3300, 1.0, 140, 0.15, 0.07, 0.06, 1.2, "desert"),
  level(13, "Jungle Trail", "normal", 3200, 1.0, 110, 0.15, 0.07, 0.05, 1.3, "jungle"),
  level(14, "Snowy Pass", "normal", 3200, 1.0, 120, 0.14, 0.06, 0.05, 1.25, "snow"),
  level(15, "Canyon Run", "normal", 3300, 1.1, 130, 0.14, 0.06, 0.05, 1.3, "canyon"),
  level(16, "Volcanic Ridge", "normal", 3400, 1.2, 140, 0.13, 0.06, 0.06, 1.35, "volcano"),
  level(17, "Arctic Tundra", "normal", 3400, 1.1, 130, 0.13, 0.06, 0.05, 1.2, "arctic"),
  level(18, "Rainforest Rush", "normal", 3300, 1.0, 120, 0.14, 0.06, 0.06, 1.3, "rainforest"),
  level(19, "Muddy Swamp", "normal", 3200, 1.0, 120, 0.15, 0.07, 0.06, 1.3, "swamp"),
  level(20, "Stormy Cliffs", "normal", 3500, 1.1, 140, 0.13, 0.05, 0.06, 1.35, "storm"),
  // Hard 21–25
  level(21, "Asteroid Field", "hard", 3800, 1.4, 170, 0.11, 0.05, 0.07, 0.8, "asteroid"),
  level(22, "Underground Cave", "hard", 3600, 1.3, 160, 0.11, 0.05, 0.07, 1.4, "cave"),
  level(23, "Underwater Tunnel", "hard", 3600, 1.2, 150, 0.11, 0.05, 0.07, 0.7, "underwater"),
  level(24, "Space Launch", "hard", 3800, 1.4, 170, 0.10, 0.05, 0.07, 0.6, "space"),
  level(25, "Lava World", "hard", 3800, 1.4, 170, 0.10, 0.05, 0.07, 1.5, "lava"),
  // Advanced 26–30
  level(26, "Nightmare Highway", "advanced", 4000, 1.5, 180, 0.09, 0.04, 0.08, 1.3, "nightmare"),
  level(27, "Chaos Canyon", "advanced", 4000, 1.5, 180, 0.09, 0.04, 0.08, 1.4, "chaos"),
  level(28, "Zero Gravity Moon", "advanced", 4000, 1.5, 180, 0.09, 0.04, 0.08, 0.4, "moon"),
  level(29, "Inferno Descent", "advanced", 4000, 1.5, 190, 0.09, 0.04, 0.08, 1.6, "inferno"),
  level(30, "The Final Summit", "advanced", 4200, 1.6, 200, 0.08, 0.04, 0.08, 1.5, "final"),
];

function level(
  id,
  name,
  difficulty,
  length,
  terrainFrequency,
  terrainAmplitude,
  coinDensity,
  fuelDensity,
  boostDensity,
  gravity,
  theme
) {
  return {
    id,
    name,
    difficulty,
    length,
    terrainFrequency,
    terrainAmplitude,
    coinDensity,
    fuelDensity,
    boostDensity,
    gravity,
    theme,
    seed: id * 9973,
  };
}

export function getLevelById(id) {
  return levels.find((l) => l.id === id) || levels[0];
}

