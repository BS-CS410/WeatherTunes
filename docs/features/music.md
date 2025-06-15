# Music Components

The music components provide user interface elements for music playback display and controls. All components currently display placeholder data.

## Current Implementation

WeatherTunes contains complete music interface components:

- Music player display with track information
- Queue display with upcoming tracks
- Player control buttons and interface elements
- Authentication UI components

## Component Details

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

### Navigation Integration

**Location:** `src/components/NavBar.tsx`

**Current State:**

```typescript
// Line 36: Placeholder for authentication
[TODO: put spotify login here]
```
