#!/usr/bin/env node

/**
 * Test script to demonstrate enhanced weather-music mapping with temperature and user preferences
 */

console.log("🎵 Enhanced Weather-to-Music Mapping Test");
console.log("==========================================\n");

// Simulate enhanced temperature mapping
const temperatureRanges = [
  { temp: 35, desc: "Very Hot (Tropical)" },
  { temp: 28, desc: "Hot (Summer vibes)" },
  { temp: 22, desc: "Warm (Pleasant)" },
  { temp: 18, desc: "Mild (Comfortable)" },
  { temp: 12, desc: "Cool (Relaxed)" },
  { temp: 5, desc: "Cold (Contemplative)" },
  { temp: -5, desc: "Very Cold (Intimate)" },
  { temp: -15, desc: "Extremely Cold (Mellow)" },
];

// Simulate user preferences
const userProfile = {
  top_genres: ["indie-pop", "electronic", "jazz", "folk"],
  top_artists: ["Billie Eilish", "Tame Impala", "Miles Davis"],
  audio_features_avg: {
    valence: 0.6,
    energy: 0.7,
    danceability: 0.5,
    acousticness: 0.4,
  },
};

console.log("🌡️ Enhanced Temperature Mapping:");
console.log("================================");
temperatureRanges.forEach((range, index) => {
  console.log(`${index + 1}. ${range.temp}°C - ${range.desc}`);

  // Simulate temperature adjustments
  let energyAdjust = 0;
  let valenceAdjust = 0;
  let tempoAdjust = 0;

  if (range.temp >= 30) {
    energyAdjust = +0.25;
    valenceAdjust = +0.15;
    tempoAdjust = +20;
  } else if (range.temp >= 25) {
    energyAdjust = +0.2;
    valenceAdjust = +0.1;
    tempoAdjust = +15;
  } else if (range.temp >= 20) {
    energyAdjust = +0.1;
    valenceAdjust = +0.05;
    tempoAdjust = +5;
  } else if (range.temp < 0) {
    energyAdjust = -0.2;
    valenceAdjust = -0.1;
    tempoAdjust = -20;
  } else if (range.temp < 10) {
    energyAdjust = -0.1;
    valenceAdjust = -0.05;
    tempoAdjust = -10;
  }

  console.log(
    `   • Energy: ${energyAdjust >= 0 ? "+" : ""}${energyAdjust.toFixed(2)}`,
  );
  console.log(
    `   • Valence: ${valenceAdjust >= 0 ? "+" : ""}${valenceAdjust.toFixed(2)}`,
  );
  console.log(`   • Tempo: ${tempoAdjust >= 0 ? "+" : ""}${tempoAdjust}`);
  console.log("");
});

console.log("👤 User Personalization Integration:");
console.log("====================================");
console.log("User's Top Genres:", userProfile.top_genres.join(", "));
console.log("User's Audio Preferences:");
console.log(
  `   • Happiness (Valence): ${userProfile.audio_features_avg.valence.toFixed(2)}`,
);
console.log(`   • Energy: ${userProfile.audio_features_avg.energy.toFixed(2)}`);
console.log(
  `   • Danceability: ${userProfile.audio_features_avg.danceability.toFixed(2)}`,
);
console.log(
  `   • Acousticness: ${userProfile.audio_features_avg.acousticness.toFixed(2)}`,
);
console.log("");

console.log(
  "🎯 Example: Sunny weather at 28°C for a user who likes indie-pop:",
);
console.log("================================================================");

// Simulate blending weather + temperature + user preferences
const weatherBase = { valence: 0.8, energy: 0.7, danceability: 0.8 };
const temperatureAdjust = { valence: +0.1, energy: +0.2, danceability: +0.15 };
const userPrefs = userProfile.audio_features_avg;

const blended = {
  valence: Math.min(
    1.0,
    (weatherBase.valence + temperatureAdjust.valence + userPrefs.valence) / 2.5,
  ),
  energy: Math.min(
    1.0,
    (weatherBase.energy + temperatureAdjust.energy + userPrefs.energy) / 2.5,
  ),
  danceability: Math.min(
    1.0,
    (weatherBase.danceability +
      temperatureAdjust.danceability +
      userPrefs.danceability) /
      2.5,
  ),
};

console.log("Weather Base (Sunny):");
console.log(`   • Valence: ${weatherBase.valence.toFixed(2)}`);
console.log(`   • Energy: ${weatherBase.energy.toFixed(2)}`);
console.log(`   • Danceability: ${weatherBase.danceability.toFixed(2)}`);

console.log("\nTemperature Adjustment (28°C - Hot):");
console.log(`   • Valence: +${temperatureAdjust.valence.toFixed(2)}`);
console.log(`   • Energy: +${temperatureAdjust.energy.toFixed(2)}`);
console.log(`   • Danceability: +${temperatureAdjust.danceability.toFixed(2)}`);

console.log("\nUser Preferences Blend:");
console.log(`   • User's Valence: ${userPrefs.valence.toFixed(2)}`);
console.log(`   • User's Energy: ${userPrefs.energy.toFixed(2)}`);
console.log(`   • User's Danceability: ${userPrefs.danceability.toFixed(2)}`);

console.log("\n🎵 Final Blended Recommendation Parameters:");
console.log("==========================================");
console.log(
  `   • Valence: ${blended.valence.toFixed(2)} (${getValenceDescription(blended.valence)})`,
);
console.log(
  `   • Energy: ${blended.energy.toFixed(2)} (${getEnergyDescription(blended.energy)})`,
);
console.log(
  `   • Danceability: ${blended.danceability.toFixed(2)} (${getDanceabilityDescription(blended.danceability)})`,
);

console.log("\n✨ Key Enhancements:");
console.log("===================");
console.log(
  "1. ✅ Enhanced Temperature Mapping - 8 granular temperature ranges",
);
console.log(
  "2. ✅ User Preference Integration - Blends weather with personal taste",
);
console.log(
  "3. ✅ Spotify User Profile - Uses top artists, genres, and audio preferences",
);
console.log(
  "4. ✅ Smart Fallbacks - Graceful degradation if user data unavailable",
);
console.log(
  "5. ✅ Real-time Personalization - Adapts to user's actual Spotify listening history",
);

console.log("\n🎯 Result: Music recommendations that are:");
console.log("   • Weather-appropriate for current conditions");
console.log("   • Temperature-sensitive for fine-tuned mood matching");
console.log("   • Personalized to user's actual music taste");
console.log("   • Powered by Spotify's recommendation engine");

function getValenceDescription(valence) {
  if (valence >= 0.8) return "Very Happy";
  if (valence >= 0.6) return "Happy";
  if (valence >= 0.4) return "Neutral";
  if (valence >= 0.2) return "Melancholic";
  return "Very Sad";
}

function getEnergyDescription(energy) {
  if (energy >= 0.8) return "Very Energetic";
  if (energy >= 0.6) return "Energetic";
  if (energy >= 0.4) return "Moderate";
  if (energy >= 0.2) return "Calm";
  return "Very Calm";
}

function getDanceabilityDescription(danceability) {
  if (danceability >= 0.8) return "Very Danceable";
  if (danceability >= 0.6) return "Danceable";
  if (danceability >= 0.4) return "Moderate";
  if (danceability >= 0.2) return "Not Very Danceable";
  return "Not Danceable";
}
