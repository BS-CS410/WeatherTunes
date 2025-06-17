#!/bin/bash

# Script to validate track metadata against Spotify's actual data
# This will help identify and fix mismatched track information

echo "🎵 Validating track metadata against Spotify..."

# Track IDs from your metadata file
TRACK_IDS=(
  "6rqhFgbbKwnb9MLmUQDhG6"
  "1tNJrcVe6gwLEiZCtprs1u"
  "2takcwOaAZWiXQijPHIx7B"
  "2TpxZ7JUBn3uw46aR7qd6V"
  "7ouMYWpwJ422jRcDASZB7P"
  "1lDWb6b6ieDQ2xT7ewTC3G"
)

echo "Checking each track ID against Spotify..."
echo ""

for track_id in "${TRACK_IDS[@]}"; do
  echo "🔍 Checking: $track_id"

  # Fetch from Spotify oEmbed API
  response=$(curl -s "https://open.spotify.com/oembed?url=https://open.spotify.com/track/$track_id&format=json")

  if [ $? -eq 0 ] && [ -n "$response" ]; then
    # Extract title from response
    title=$(echo "$response" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
    thumbnail=$(echo "$response" | grep -o '"thumbnail_url":"[^"]*"' | cut -d'"' -f4)

    echo "  ✅ Spotify: \"$title\""
    echo "  🖼️  Art: $thumbnail"
  else
    echo "  ❌ Failed to fetch from Spotify"
  fi

  echo ""
done

echo "✨ Validation complete!"
echo ""
echo "💡 Compare this output with your trackMetadata.json file to identify mismatches."
