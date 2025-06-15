# Frontend Component Data Structures

This document describes the current frontend implementation and the data structures used by music-related components.

## Current Implementation Status

WeatherTunes frontend contains complete user interface components for music functionality but displays placeholder data. The application includes:

- **Music player interface**: CurrentlyPlaying component with playback controls
- **Queue display**: UpNext component showing track list
- **Authentication UI**: Login page and navigation bar elements
- **Placeholder data structures**: Static data for development and testing

## Music Component Data Structures

### CurrentlyPlaying Component

**Location**: `src/components/CurrentlyPlaying.tsx`

**Current Data Structure**:

```typescript
const placeholderData = {
  songTitle: "Bohemian Rhapsody",
  artistName: "Queen",
  albumArtUrl: "https://i.scdn.co/image/...",
};
```

### UpNext Component

**Location**: `src/components/UpNext.tsx`

**Current Data Structure**:

```typescript
const placeholderSongs = [
  { title: "Thunderstruck", artist: "AC/DC" },
  { title: "Hotel California", artist: "Eagles" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin" },
  { title: "Don't Stop Believin'", artist: "Journey" },
];
```

## Authentication Interface

The application includes a login page (`src/pages/Login.tsx`) and navigation bar login button that display static interfaces without backend connectivity.
