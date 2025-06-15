# API Requirements

This document outlines the backend API requirements for WeatherTunes, including endpoints, data structures, and integration patterns needed to support the frontend.

## Overview

The backend API needs to support:

- Spotify OAuth 2.0 authentication
- Weather data service (migrated from client-side)
- Music player control and data
- User preferences and settings
- Favorites and user data management

## Authentication Endpoints

### Spotify OAuth Integration

**Initiate Authentication**

```http
POST /auth/spotify
```

- Redirects user to Spotify OAuth consent screen
- Handles PKCE flow for security
- Returns authorization URL

**Handle OAuth Callback**

```http
GET /auth/spotify/callback?code={auth_code}&state={state}
```

- Processes Spotify OAuth callback
- Exchanges code for access/refresh tokens
- Creates or updates user session

**Check Authentication Status**

```http
GET /auth/status
```

Response:

```json
{
  "isAuthenticated": boolean,
  "user": {
    "id": string,
    "displayName": string,
    "email": string,
    "country": string,
    "product": string // "free" | "premium"
  } | null,
  "expiresAt": string // ISO timestamp
}
```

**Logout**

```http
POST /auth/logout
```

- Invalidates user session
- Clears authentication tokens
- Returns success confirmation

## Weather Endpoints

### Current Weather Data

**Get Current Weather**

```http
GET /api/weather?lat={latitude}&lon={longitude}
```

Response:

```json
{
  "location": string,
  "temperature": number, // in Celsius
  "condition": string,
  "humidity": number,
  "pressure": number,
  "windSpeed": number, // in m/s
  "windDirection": number, // degrees
  "visibility": number, // in meters
  "sunrise": string, // ISO timestamp
  "sunset": string, // ISO timestamp
  "country": string // ISO country code
}
```

**Get 5-Day Forecast**

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
