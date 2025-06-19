# WeatherTunes - Phase 1: Live Spotify API Integration

## 🎯 Phase 1 Implementation Summary

This phase introduces live Spotify API integration while maintaining fallback to the existing local tracks system. Users can now search for real tracks on Spotify and receive weather-based recommendations powered by Spotify's recommendation engine.

## ✅ What's Implemented

### Backend Enhancements

1. **New API Endpoints** (`/backend/app/routes/recommended.py`):
   - `GET /recommend/search` - Search Spotify tracks by query
   - `POST /recommend/recommendations/weather` - Get weather-based recommendations

2. **Enhanced Recommendation Service** (`/backend/app/services/recommendation.py`):
   - `search_tracks()` - Search Spotify catalog
   - `get_weather_based_recommendations()` - Weather-to-audio-features mapping
   - Advanced audio feature mapping for weather conditions

3. **User Preferences** (`/backend/app/services/user_data.py`):
   - `get_user_preferences()` - Get user music preferences
   - Foundation for personalized recommendations

### Frontend Enhancements

1. **Spotify API Service** (`/src/lib/spotifyApiService.ts`):
   - Search functionality with text and mood-based queries
   - Weather-based recommendation requests
   - Proper error handling and fallbacks

2. **Enhanced Weather Music Service** (`/src/lib/weatherMusicService.ts`):
   - Now async with live Spotify API integration
   - Fallback to local tracks when API unavailable
   - Improved weather-to-music mapping

3. **New Search Hook** (`/src/hooks/useSpotifySearch.ts`):
   - Real-time track search
   - Mood-based search functionality
   - Loading states and error handling

4. **Spotify Search Component** (`/src/components/music/SpotifySearchCard.tsx`):
   - Interactive search interface
   - Mood buttons for quick discovery
   - Add tracks directly to queue
   - Responsive design matching app theme

## 🚀 How to Test

### Prerequisites

1. **Backend Setup**:
   ```bash
   cd backend
   source venv/bin/activate  # or create venv if needed
   pip install -r requirements.txt
   ```

2. **Environment Variables** (`.env` file):
   ```env
   FLASK_SECRET_KEY=your_secret_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/auth-callback
   VITE_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

### Testing Steps

1. **Start Backend**:
   ```bash
   cd backend
   python run.py
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Authentication**:
   - Go to `http://127.0.0.1:5173`
   - Click "Login with Spotify"
   - Complete OAuth flow

4. **Test Search Functionality**:
   - Look for the "Spotify Search" card on the main page
   - Try searching for tracks (e.g., "happy music")
   - Test mood buttons (happy, chill, energetic, etc.)
   - Add tracks to queue using the + button

5. **Test Weather-Based Recommendations**:
   - The app should automatically generate better playlists using Spotify API
   - Weather conditions now map to Spotify audio features
   - Check browser console for Spotify API vs fallback indicators

## 🔄 Fallback Behavior

The system gracefully handles different scenarios:

- **User Not Logged In**: Uses local tracks only
- **Spotify API Unavailable**: Falls back to local tracks with warning
- **No Search Results**: Shows appropriate error messages
- **Network Issues**: Maintains functionality with cached/local data

## 📊 Audio Feature Mapping

Weather conditions now map to Spotify's audio features:

```typescript
"sunny": { valence: 0.8, energy: 0.7, danceability: 0.6 }
"rainy": { valence: 0.3, energy: 0.4, acousticness: 0.7 }
"cloudy": { valence: 0.5, energy: 0.5, acousticness: 0.5 }
// + temperature and time-of-day adjustments
```

## 🐛 Known Issues & Limitations

1. **User Preferences**: Basic implementation, will be enhanced in Phase 2
2. **Rate Limiting**: No rate limiting implemented yet
3. **Caching**: No recommendation caching (fresh API calls each time)
4. **Error Recovery**: Could be more sophisticated

## 🔜 Next Phase

**Phase 2** will focus on:
- Replacing static tracks.json entirely
- Enhanced playlist generation algorithms
- User preference learning
- Recommendation caching
- More sophisticated error handling

## 🧪 API Testing

You can test the backend endpoints directly:

```bash
# Test search (requires authentication)
curl -X GET "http://127.0.0.1:8000/recommend/search?q=happy%20music&limit=5" \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt

# Test weather recommendations
curl -X POST "http://127.0.0.1:8000/recommend/recommendations/weather" \
  -H "Content-Type: application/json" \
  -d '{"weather_condition": "sunny", "temperature": 25, "limit": 10}' \
  --cookie cookies.txt
```

## 🎉 Success Metrics

Phase 1 is successful if:
- ✅ Users can search for real Spotify tracks
- ✅ Weather-based recommendations use live Spotify data
- ✅ System gracefully falls back to local tracks when needed
- ✅ Authentication flow works end-to-end
- ✅ UI remains responsive and user-friendly
