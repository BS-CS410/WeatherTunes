import { Box, Typography, Paper } from "@mui/material";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { WeatherDisplay as WeatherDisplayMui } from "@/components/WeatherDisplayMui";
import { ForecastCard } from "@/components/ForecastCard";
import { ForecastCardMui } from "@/components/ForecastCardMui";
import UnifiedDisplay from "@/components/UnifiedDisplay";
import UnifiedDisplayMui from "@/components/UnifiedDisplayMui";
import { useWeatherData } from "@/hooks/useWeather";
import { useThemeManager } from "@/hooks/useThemeManager";

export default function MuiDemo() {
  const { displayData, timePeriod, isLoading, error } = useWeatherData();

  useThemeManager(timePeriod);

  // Sample music data for unified display demo
  const songData = {
    songTitle: "Angel's Fake",
    artistName: "DAZBEE",
    albumArtUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/3c/d1/f93cd16d-2329-561c-a851-672eea4e48c3/23UMGIM87924.rgb.jpg/800x800cc.jpg",
  };

  useThemeManager(timePeriod);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" color="text.secondary">
          Loading weather data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" color="error">
          Error loading weather data
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 700 }}
      >
        Material UI Integration Demo
      </Typography>

      {/* Weather Display Comparison */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Weather Display Components
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Original (Tailwind CSS)
            </Typography>
            <WeatherDisplay weatherData={displayData} />
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Material UI Version
            </Typography>
            <WeatherDisplayMui weatherData={displayData} />
          </Box>
        </Box>
      </Paper>

      {/* Unified Display Comparison */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Unified Display Components
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Original (Tailwind CSS)
          </Typography>
          <UnifiedDisplay
            weatherData={displayData}
            songTitle={songData.songTitle}
            artistName={songData.artistName}
            albumArtUrl={songData.albumArtUrl}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Material UI Version
          </Typography>
          <UnifiedDisplayMui
            weatherData={displayData}
            songTitle={songData.songTitle}
            artistName={songData.artistName}
            albumArtUrl={songData.albumArtUrl}
          />
        </Box>
      </Paper>

      {/* Forecast Card Comparison */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Forecast Components
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Original (Tailwind CSS)
          </Typography>
          <ForecastCard />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Material UI Version
          </Typography>
          <ForecastCardMui />
        </Box>
      </Paper>

      {/* Features Showcase */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          MUI Integration Features
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              ✅ Responsive Design
            </Typography>
            <Typography variant="body2" paragraph>
              Components automatically adapt to different screen sizes using
              MUI's breakpoint system
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              ✅ Smooth Transitions
            </Typography>
            <Typography variant="body2" paragraph>
              Built-in animations and transitions for hover states, loading, and
              theme changes
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              ✅ Theme Integration
            </Typography>
            <Typography variant="body2" paragraph>
              Seamlessly integrates with existing settings and theme preferences
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              ✅ Minimal Changes
            </Typography>
            <Typography variant="body2" paragraph>
              Preserves existing component interfaces and behavior
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
