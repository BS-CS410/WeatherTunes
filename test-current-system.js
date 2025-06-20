const API_BASE_URL = "http://localhost:8000";

async function testCurrentSystem() {
  console.log("🧪 Testing current queue system...");

  // Test weather recommendations without auth
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations/weather`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weather_condition: "clear",
        temperature: 25,
        time_of_day: "afternoon",
        limit: 5,
      }),
    });

    const result = await response.json();
    console.log("Weather recommendations response:", result);

    if (result.tracks && result.tracks.length > 0) {
      console.log("\n✅ Got tracks:");
      result.tracks.forEach((track, i) => {
        console.log(`${i + 1}. ${track.title} by ${track.artist}`);
        console.log(`   Album art: ${track.albumArt ? "Present" : "MISSING"}`);
        if (track.albumArt) {
          console.log(
            `   Album art URL: ${track.albumArt.substring(0, 50)}...`,
          );
        }
      });
    } else {
      console.log("❌ No tracks received");
    }
  } catch (error) {
    console.log("❌ Error testing recommendations:", error.message);

    // Try to see what the error response is
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/weather`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weather_condition: "clear",
          temperature: 25,
          time_of_day: "afternoon",
          limit: 5,
        }),
      });

      const errorText = await response.text();
      console.log("Error response:", errorText);
    } catch (e) {
      console.log("Failed to get error details:", e.message);
    }
  }
}

testCurrentSystem();
