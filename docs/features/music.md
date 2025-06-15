# Music Integration

The music integration system provides a complete Spotify-based music experience that responds to weather conditions. The frontend UI is fully implemented and ready for backend integration.

## Overview

WeatherTunes integrates with Spotify to provide:

- Weather-based music selection and recommendations
- Full music player controls
- Queue management and playlist creation
- User library integration
- Personalized listening experience

## Current Implementation Status

### ✅ Frontend UI Complete

**Music Player Components**

- `CurrentlyPlaying.tsx` - Track display with album art and controls
- `UpNext.tsx` - Music queue with upcoming tracks
- `NavBar.tsx` - Spotify authentication trigger
- Complete styling and responsive design

**Data Structures**

- TypeScript interfaces for all Spotify data
- Placeholder data for development and testing
- Error handling and loading states

### 🔄 Awaiting Backend Integration

**Spotify Web API Integration**

- OAuth 2.0 authentication flow
- Real-time player state synchronization
- Music playback controls
- Playlist and library access

## Component Architecture

### CurrentlyPlaying Component

**Location:** `src/components/CurrentlyPlaying.tsx`

**Features:**

- Album artwork display
- Song title and artist information
- Playback progress visualization
- Player control buttons (play/pause/skip)
- Responsive design with glassmorphism styling

**Current Implementation:**

```typescript
// Placeholder data structure (line 12)
const placeholderData = {
  songTitle: "Bohemian Rhapsody",
  artistName: "Queen",
  albumArtUrl: "https://i.scdn.co/image/...",
};
```

**Backend Integration Required:**

```typescript
// Replace with real Spotify API data
const { data: currentTrack } = useCurrentlyPlaying();
```

### UpNext Component

**Location:** `src/components/UpNext.tsx`

**Features:**

- Queue display with track list
- Artist and song information
- Album artwork thumbnails
- Queue management controls
- Scroll handling for long queues

**Current Implementation:**

```typescript
// Placeholder songs (lines 11 & 102)
const placeholderSongs = [
  { title: "Thunderstruck", artist: "AC/DC" },
  { title: "Hotel California", artist: "Eagles" },
  // ... more placeholder tracks
];
```

**Backend Integration Required:**

```typescript
// Replace with real queue data
const { data: queue } = usePlayerQueue();
```

### Navigation Integration

**Location:** `src/components/NavBar.tsx`

**Current State:**

```typescript
// Line 36: Placeholder for Spotify login
[TODO: put spotify login here]
```

**Backend Integration Required:**

```typescript
// Replace with authentication trigger
<SpotifyLoginButton onClick={initiateSpotifyAuth} />
```

## Spotify Web API Integration

### Required Spotify Scopes

**User Permissions Needed:**

```typescript
const requiredScopes = [
  "user-read-playback-state", // Current playback info
  "user-modify-playback-state", // Control playback
  "user-read-currently-playing", // Currently playing track
  "user-library-read", // User's saved tracks
  "playlist-read-private", // User's playlists
  "playlist-read-collaborative", // Collaborative playlists
  "user-read-email", // User profile info
  "user-read-private", // User profile info
];
```

### OAuth 2.0 Flow

**Authentication Process:**

1. User clicks Spotify login in NavBar
2. Redirect to Spotify authorization URL
3. User grants permissions
4. Spotify redirects to callback URL
5. Backend exchanges code for access token
6. Frontend receives authentication status

**Frontend Implementation:**

```typescript
// Initiate authentication
const loginToSpotify = async () => {
  const response = await fetch("/auth/spotify", {
    method: "POST",
  });
  const { authUrl } = await response.json();
  window.location.href = authUrl;
};
```

### Player Control API

**Required Endpoints:**

- `GET /api/player/current` - Currently playing track
- `GET /api/player/queue` - Upcoming tracks
- `POST /api/player/play` - Start/resume playback
- `POST /api/player/pause` - Pause playback
- `POST /api/player/next` - Skip to next track
- `POST /api/player/previous` - Previous track
- `PUT /api/player/volume` - Set volume level

## Weather-Music Intelligence

### Weather Condition Mapping

**Mood and Energy Mapping:**

```typescript
const weatherMoodMapping = {
  // High energy, upbeat
  clear_day: { energy: "high", valence: "positive", tempo: "fast" },

  // Calm, peaceful
  clear_night: { energy: "low", valence: "peaceful", tempo: "slow" },

  // Cozy, introspective
  rain_evening: { energy: "medium", valence: "melancholic", tempo: "medium" },

  // Energetic, dramatic
  rain_day: { energy: "high", valence: "intense", tempo: "fast" },

  // Calm, atmospheric
  fog_morning: { energy: "low", valence: "mysterious", tempo: "slow" },

  // Cozy, warm
  snow_evening: { energy: "low", valence: "warm", tempo: "slow" },
};
```

### Music Selection Algorithm

**Factors Considered:**

1. **Weather Condition** - Rain, snow, clear, cloudy, fog
2. **Time of Day** - Morning, day, evening, night
3. **Temperature** - Hot, warm, cool, cold
4. **Season** - Spring, summer, fall, winter
5. **User Preferences** - Listening history, saved tracks
6. **Current Mood** - Derived from recent activity

**Selection Strategy:**

```typescript
const selectWeatherMusic = (weather, time, user) => {
  const mood = getWeatherMood(weather, time);
  const userTaste = getUserMusicProfile(user);
  const recommendations = findMatchingTracks(mood, userTaste);
  return recommendations;
};
```

### Spotify Audio Features

**Track Analysis Integration:**

```typescript
// Spotify provides audio features for each track
interface AudioFeatures {
  energy: number; // 0.0 - 1.0
  valence: number; // 0.0 (sad) - 1.0 (happy)
  tempo: number; // BPM
  danceability: number; // 0.0 - 1.0
  acousticness: number; // 0.0 - 1.0
  instrumentalness: number; // 0.0 - 1.0
}
```

## User Experience Features

### Personalization

**User Music Profile:**

- Listening history analysis
- Preferred genres and artists
- Time-based listening patterns
- Weather preference correlations

**Learning Algorithm:**

- Track user responses to weather suggestions
- Adapt recommendations over time
- Consider skip rates and replay frequency
- Seasonal preference variations

### Playlist Management

**Weather-Based Playlists:**

- Automatically generated playlists for each weather/time combination
- User-curated weather playlists
- Collaborative weather playlists with friends
- Seasonal playlist rotation

**Smart Queue Management:**

- Automatic queue population based on weather
- User override capabilities
- Queue history and replay
- Seamless transitions between different weather conditions

## Integration Points

### Frontend Component Updates

**CurrentlyPlaying.tsx Updates:**

```typescript
// Line 12: Replace placeholder with real data
const { data: currentTrack, isLoading } = useCurrentlyPlaying();

// Add real player controls
const handlePlay = () => spotifyApi.play();
const handlePause = () => spotifyApi.pause();
const handleNext = () => spotifyApi.next();
```

**UpNext.tsx Updates:**

```typescript
// Line 11: Replace placeholder songs
const { data: queue } = usePlayerQueue();

// Add queue management
const removeFromQueue = (trackId) => spotifyApi.removeFromQueue(trackId);
const reorderQueue = (trackId, position) =>
  spotifyApi.reorderQueue(trackId, position);
```

**NavBar.tsx Updates:**

```typescript
// Line 36: Replace TODO with authentication
const { user, isAuthenticated } = useAuth();
const loginButton = isAuthenticated ?
  <UserProfile user={user} /> :
  <SpotifyLoginButton />;
```

### State Management

**Music Context:**

```typescript
interface MusicContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  playTrack: (trackId: string) => void;
  pausePlayback: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  setVolume: (level: number) => void;
}
```

**Weather-Music Integration:**

```typescript
// Combine weather and music contexts
const useWeatherMusic = () => {
  const weather = useWeather();
  const music = useMusic();

  // Update music based on weather changes
  useEffect(() => {
    if (weather.condition) {
      updateMusicForWeather(weather);
    }
  }, [weather.condition, weather.timeOfDay]);
};
```

## Performance Considerations

### API Efficiency

**Rate Limiting Management:**

- Cache frequently accessed data
- Batch API requests when possible
- Implement request queuing for rate limits
- Use webhooks for real-time updates

**Data Synchronization:**

- Real-time player state updates
- Efficient polling strategies
- WebSocket connections for live data
- Background sync for offline support

### User Experience Optimization

**Instant Feedback:**

- Optimistic UI updates for player controls
- Local state management for immediate response
- Background sync for data consistency
- Graceful error handling and recovery

## Testing Strategy

### Music Integration Testing

**Authentication Testing:**

- OAuth flow completion
- Token refresh handling
- Logout and session cleanup
- Error scenarios (denied access, expired tokens)

**Player Control Testing:**

- Play/pause functionality
- Track skipping and navigation
- Volume control
- Queue management

**Weather Integration Testing:**

- Music updates on weather changes
- Algorithm accuracy for weather-music matching
- User preference learning
- Edge cases (no internet, API failures)

### Mock Data for Development

**Spotify API Mocking:**

```typescript
const mockSpotifyData = {
  currentTrack: {
    id: "test123",
    name: "Test Song",
    artists: [{ name: "Test Artist" }],
    album: {
      name: "Test Album",
      images: [{ url: "/test-album.jpg" }],
    },
  },
  queue: [
    { name: "Next Song 1", artists: [{ name: "Artist 1" }] },
    { name: "Next Song 2", artists: [{ name: "Artist 2" }] },
  ],
};
```

## Future Enhancements

### Advanced Features

**Social Integration:**

- Share weather-music combinations
- Collaborative weather playlists
- Friend activity based on weather
- Location-based music discovery

**Machine Learning:**

- Advanced recommendation algorithms
- Mood detection from listening patterns
- Seasonal preference evolution
- Cross-user pattern analysis

**Extended Integrations:**

- Apple Music support
- YouTube Music integration
- Local music file support
- Podcast recommendations based on weather
