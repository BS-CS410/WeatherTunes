# Backend API Requirements

This document specifies the backend API requirements for WeatherTunes, detailing endpoints, data structures, and integration patterns needed to support the frontend application.

## Overview

WeatherTunes frontend currently displays placeholder data for music features and requires backend implementation for:

- **Spotify OAuth 2.0 authentication** for user login and music access
- **Spotify Web API integration** for music playback control and data
- **User settings synchronization** across devices and sessions
- **Weather-based music selection** algorithm implementation

The frontend is production-ready for weather features and UI-complete for music features, requiring only data integration.

## Authentication System

### Spotify OAuth 2.0 Integration

WeatherTunes requires Spotify Web API access for music functionality. The backend must implement OAuth 2.0 with PKCE (Proof Key for Code Exchange) for security.

**Required Spotify Scopes**:

- `user-read-playback-state`: Read current playback information
- `user-modify-playback-state`: Control playback (play, pause, skip)
- `user-read-currently-playing`: Access currently playing track
- `user-library-read`: Access user's saved tracks and albums
- `playlist-read-private`: Read user's private playlists
- `playlist-read-collaborative`: Read collaborative playlists

### Authentication Endpoints

**Initiate Spotify Login**

```http
POST /api/auth/spotify/login
```

**Response**:

```json
{
  "authUrl": "https://accounts.spotify.com/authorize?...",
  "state": "random_state_string"
}
```

Redirects user to Spotify OAuth consent screen with required scopes.

**Handle OAuth Callback**

```http
GET /api/auth/spotify/callback
Query Parameters:
  - code: string (authorization code from Spotify)
  - state: string (state parameter for CSRF protection)
```

**Response**:

```json
{
  "success": true,
  "user": {
    "id": "spotify_user_id",
    "displayName": "User Display Name",
    "email": "user@example.com",
    "country": "US",
    "product": "premium" // "free" | "premium"
  },
  "accessToken": "encrypted_token",
  "expiresIn": 3600
}
```

**Get Authentication Status**

```http
GET /api/auth/status
Headers:
  - Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "isAuthenticated": true,
  "user": {
    "id": "spotify_user_id",
    "displayName": "User Display Name",
    "email": "user@example.com",
    "country": "US",
    "product": "premium"
  },
  "tokenExpiresAt": "2024-01-15T10:30:00Z"
}
```

**Logout**

```http
POST /api/auth/logout
Headers:
  - Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

## Music Integration Endpoints

### Current Playback Information

The frontend `CurrentlyPlaying` component expects this data structure:

**Get Currently Playing Track**

```http
GET /api/music/currently-playing
Headers:
  - Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "isPlaying": true,
  "track": {
    "id": "spotify_track_id",
    "name": "Song Title",
    "artists": [
      {
        "id": "spotify_artist_id",
        "name": "Artist Name"
      }
    ],
    "album": {
      "id": "spotify_album_id",
      "name": "Album Name",
      "images": [
        {
          "url": "https://i.scdn.co/image/...",
          "height": 640,
          "width": 640
        }
      ]
    },
    "duration_ms": 240000,
    "progress_ms": 60000
  },
  "device": {
    "id": "device_id",
    "name": "Device Name",
    "type": "Computer",
    "volume_percent": 80
  }
}
```

**Error Response** (no active playback):

```json
{
  "isPlaying": false,
  "track": null,
  "device": null
}
```

### Playback Queue Management

The frontend `UpNext` component expects queue information:

**Get Playback Queue**

```http
GET /api/music/queue
Headers:
  - Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "queue": [
    {
      "id": "spotify_track_id",
      "name": "Next Song Title",
      "artists": [
        {
          "name": "Artist Name"
        }
      ],
      "album": {
        "name": "Album Name",
        "images": [
          {
            "url": "https://i.scdn.co/image/...",
            "height": 300,
            "width": 300
          }
        ]
      },
      "duration_ms": 180000
    }
  ]
}
```

### Playback Control

**Play/Pause Toggle**

```http
POST /api/music/toggle-playback
Headers:
  - Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "success": true,
  "isPlaying": false
}
```

**Skip to Next Track**

```http
POST /api/music/next
Headers:
  - Authorization: Bearer {jwt_token}
```

**Skip to Previous Track**

```http
POST /api/music/previous
Headers:
  - Authorization: Bearer {jwt_token}
```

**Set Volume**

```http
POST /api/music/volume
Headers:
  - Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "volume_percent": 50
}
```

## Weather-Based Music Selection

### Core Algorithm Endpoint

The backend should implement an algorithm that selects appropriate music based on weather conditions:

**Get Weather-Based Recommendations**

```http
POST /api/music/weather-recommendations
Headers:
  - Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "weather": {
    "condition": "rain",
    "temperature": 18.5,
    "humidity": 85,
    "time_period": "evening"
  },
  "user_preferences": {
    "genres": ["indie", "ambient", "electronic"],
    "energy_level": "medium",
    "exclude_explicit": false
  }
}
```

**Response**:

```json
{
  "recommendations": [
    {
      "id": "spotify_track_id",
      "name": "Rainy Day Song",
      "artists": [{ "name": "Artist Name" }],
      "album": {
        "name": "Album Name",
        "images": [{ "url": "https://..." }]
      },
      "match_score": 0.95,
      "match_reasons": [
        "weather_appropriate",
        "time_suitable",
        "user_preference"
      ]
    }
  ],
  "playlist_id": "generated_playlist_id"
}
```

### Weather Data Integration

While the frontend currently uses OpenWeatherMap directly, the backend may optionally handle weather data for consistency and caching:

**Weather Data Passthrough** (Optional)

```http
GET /api/weather/current?lat={latitude}&lon={longitude}
```

This would allow the backend to cache weather data and potentially use multiple weather services.

## User Settings Synchronization

### Settings Storage

The frontend currently stores settings in localStorage. The backend should support cross-device synchronization:

**Save User Settings**

```http
POST /api/user/settings
Headers:
  - Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "temperatureUnit": "F",
  "timeFormat": "12h",
  "speedUnit": "mph",
  "themeMode": "auto",
  "musicPreferences": {
    "preferredGenres": ["indie", "electronic"],
    "energyLevel": "medium",
    "explicitContent": false
  }
}
```

**Get User Settings**

```http
GET /api/user/settings
Headers:
  - Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "temperatureUnit": "F",
  "timeFormat": "12h",
  "speedUnit": "mph",
  "themeMode": "auto",
  "musicPreferences": {
    "preferredGenres": ["indie", "electronic"],
    "energyLevel": "medium",
    "explicitContent": false
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Error Handling Standards

### HTTP Status Codes

- `200`: Success
- `201`: Created (for new resources)
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid or expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error
- `503`: Service Unavailable (Spotify API down)

### Error Response Format

```json
{
  "error": {
    "code": "SPOTIFY_API_ERROR",
    "message": "Unable to connect to Spotify services",
    "details": "The Spotify API is currently unavailable",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Rate Limiting and Caching

### Spotify API Rate Limits

- **Authentication**: 10 requests per second
- **Web API**: Various limits per endpoint (typically 100 requests per minute)
- **Player API**: 1 request per second for control endpoints

### Recommended Caching Strategy

- **Currently Playing**: Cache for 5-10 seconds to reduce API calls
- **User Profile**: Cache for 1 hour
- **Playlists**: Cache for 15 minutes
- **Recommendations**: Cache for 1 hour with weather condition as cache key

### Frontend Integration Points

The frontend components that require backend integration:

**NavBar.tsx** (Line 23):

```tsx
// Replace placeholder login button with real Spotify OAuth
onClick={() => window.location.href = '/api/auth/spotify/login'}
```

**CurrentlyPlaying.tsx** (Line 12):

```tsx
// Replace placeholder data with real API call
const { songTitle, artistName, albumArtUrl } = useCurrentlyPlaying();
```

**UpNext.tsx** (Line 11):

```tsx
// Replace placeholder songs array with real queue data
const { queue } = useQueue();
```

## Development Environment Setup

### Required Environment Variables

```bash
SPOTIFY_CLIENT_ID=your_spotify_app_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_app_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/auth/callback
JWT_SECRET=your_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_api_key (optional)
```

### Spotify App Configuration

1. Create Spotify app at [developer.spotify.com](https://developer.spotify.com)
2. Add redirect URI: `http://localhost:5173/auth/callback`
3. Note Client ID and Client Secret for environment variables
4. Configure required scopes in app settings

### Database Schema Recommendations

**Users Table**:

- `id` (primary key)
- `spotify_id` (unique)
- `display_name`
- `email`
- `country`
- `product_type`
- `created_at`
- `updated_at`

**User Settings Table**:

- `user_id` (foreign key)
- `settings_json` (JSON column)
- `updated_at`

**Sessions Table**:

- `id` (primary key)
- `user_id` (foreign key)
- `access_token` (encrypted)
- `refresh_token` (encrypted)
- `expires_at`
- `created_at`

This API specification provides the complete backend requirements for transforming WeatherTunes from a weather-only application into a fully functional weather-based music streaming service.

```http
GET /api/forecast?lat={latitude}&lon={longitude}
```

Response:

```json
{
  "forecast": [
    {
      "date": string, // YYYY-MM-DD
      "dayName": string,
      "condition": string,
      "tempHigh": number,
      "tempLow": number,
      "icon": string // OpenWeather icon code
    }
  ]
}
```

## Music Control Endpoints

### Player State

**Get Currently Playing**

```http
GET /api/player/current
```

Response:

```json
{
  "isPlaying": boolean,
  "track": {
    "id": string,
    "name": string,
    "artists": [
      {
        "id": string,
        "name": string
      }
    ],
    "album": {
      "id": string,
      "name": string,
      "images": [
        {
          "url": string,
          "height": number,
          "width": number
        }
      ]
    },
    "duration_ms": number,
    "progress_ms": number
  } | null,
  "device": {
    "id": string,
    "name": string,
    "type": string,
    "volume_percent": number
  } | null
}
```

**Get Player Queue**

```http
GET /api/player/queue
```

Response:

```json
{
  "queue": [
    {
      "id": string,
      "name": string,
      "artists": [{"name": string}],
      "album": {
        "name": string,
        "images": [{"url": string}]
      }
    }
  ]
}
```

### Playback Control

**Play/Resume**

```http
POST /api/player/play
Content-Type: application/json

{
  "context_uri"?: string, // playlist/album URI
  "uris"?: string[], // track URIs
  "offset"?: {
    "position": number
  },
  "position_ms"?: number
}
```

**Pause Playback**

```http
POST /api/player/pause
```

**Skip to Next Track**

```http
POST /api/player/next
```

**Skip to Previous Track**

```http
POST /api/player/previous
```

**Set Volume**

```http
PUT /api/player/volume?level={0-100}
```

**Seek to Position**

```http
PUT /api/player/seek?position_ms={milliseconds}
```

## User Data Endpoints

### Settings Management

**Get User Settings**

```http
GET /api/settings
```

Response:

```json
{
  "temperatureUnit": "fahrenheit" | "celsius",
  "timeFormat": "12h" | "24h",
  "speedUnit": "mph" | "kmh" | "ms",
  "themeMode": "auto" | "light" | "dark",
  "location": {
    "latitude": number,
    "longitude": number,
    "country": string
  } | null
}
```

**Update User Settings**

```http
PUT /api/settings
Content-Type: application/json

{
  "temperatureUnit"?: "fahrenheit" | "celsius",
  "timeFormat"?: "12h" | "24h",
  "speedUnit"?: "mph" | "kmh" | "ms",
  "themeMode"?: "auto" | "light" | "dark"
}
```

### Favorites Management

**Get User Favorites**

```http
GET /api/favorites
```

Response:

```json
{
  "tracks": [
    {
      "id": string,
      "name": string,
      "artists": [{"name": string}],
      "album": {"name": string, "images": [{"url": string}]},
      "added_at": string // ISO timestamp
    }
  ],
  "playlists": [
    {
      "id": string,
      "name": string,
      "description": string,
      "images": [{"url": string}],
      "tracks_count": number
    }
  ]
}
```

**Add to Favorites**

```http
POST /api/favorites
Content-Type: application/json

{
  "type": "track" | "playlist",
  "id": string
}
```

**Remove from Favorites**

```http
DELETE /api/favorites/{type}/{id}
```

## Weather-Music Integration

### Weather-Based Recommendations

**Get Weather-Appropriate Music**

```http
GET /api/music/weather-recommendations?lat={lat}&lon={lon}
```

Response:

```json
{
  "weather": {
    "condition": string,
    "temperature": number,
    "time_period": "morning" | "day" | "evening" | "night"
  },
  "recommendations": {
    "playlists": [
      {
        "id": string,
        "name": string,
        "description": string,
        "images": [{"url": string}],
        "reason": string // e.g., "Perfect for rainy evenings"
      }
    ],
    "tracks": [
      {
        "id": string,
        "name": string,
        "artists": [{"name": string}],
        "reason": string
      }
    ]
  }
}
```

## Error Handling

### Standard Error Response

All endpoints return consistent error format:

```json
{
  "error": {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

### Common Error Codes

**Authentication Errors:**

- `AUTH_REQUIRED` (401) - User not authenticated
- `TOKEN_EXPIRED` (401) - Access token expired
- `SPOTIFY_AUTH_ERROR` (403) - Spotify authentication failed

**API Errors:**

- `RATE_LIMITED` (429) - Too many requests
- `EXTERNAL_API_ERROR` (502) - Third-party API failure
- `INVALID_REQUEST` (400) - Malformed request data

**Server Errors:**

- `INTERNAL_ERROR` (500) - Server-side error
- `SERVICE_UNAVAILABLE` (503) - Service temporarily down

## Rate Limiting

### Request Limits

**Per User:**

- Authentication endpoints: 10 requests/minute
- Weather endpoints: 60 requests/hour
- Music control: 100 requests/minute
- Settings: 30 requests/minute

**Global Limits:**

- Spotify API: Managed by backend with queuing
- OpenWeatherMap: 1000 requests/minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Security Requirements

### Authentication Security

**OAuth 2.0 PKCE:**

- Code challenge and verifier for security
- State parameter for CSRF protection
- Secure token storage on backend

**Session Management:**

- JWT tokens with appropriate expiration
- Refresh token rotation
- Secure cookie handling

### API Security

**Request Security:**

- HTTPS enforcement for all endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers

**Data Protection:**

- User data encryption at rest
- Audit logging for sensitive operations
- Privacy compliance (GDPR considerations)

## Caching Strategy

### Backend Caching

**Weather Data:**

- Cache current weather for 10 minutes per location
- Cache forecast data for 30 minutes per location
- Use Redis or similar for distributed caching

**Spotify Data:**

- Cache user playlists for 1 hour
- Cache track metadata for 24 hours
- Invalidate on user changes

**User Settings:**

- Cache in memory for session duration
- Invalidate on settings updates
- Sync across multiple backend instances

### CDN Usage

**Static Assets:**

- Cache weather icons and images
- Cache album artwork with appropriate headers
- Use appropriate cache control headers

## Monitoring and Logging

### Required Metrics

**API Performance:**

- Response times for all endpoints
- Error rates by endpoint
- Third-party API response times

**User Behavior:**

- Authentication success/failure rates
- Feature usage patterns
- Geographic distribution

### Logging Requirements

**Structured Logging:**

- Request/response logging
- Error tracking with stack traces
- User action audit trails
- External API call logging

## Frontend Integration Points

### Component Updates Required

**NavBar.tsx (Line 36):**

```typescript
// Replace placeholder with real authentication
const initiateSpotifyAuth = () => {
  window.location.href = "/auth/spotify";
};
```

**CurrentlyPlaying.tsx:**

```typescript
// Replace placeholder data with API call
const { data: currentTrack } = useQuery("/api/player/current");
```

**UpNext.tsx:**

```typescript
// Replace placeholder songs with real queue
const { data: queue } = useQuery("/api/player/queue");
```

**Settings Synchronization:**

```typescript
// Sync settings with backend
const updateSettings = async (newSettings) => {
  await fetch("/api/settings", {
    method: "PUT",
    body: JSON.stringify(newSettings),
  });
};
```
