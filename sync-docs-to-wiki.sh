#!/bin/bash

# Enhanced script for syncing docs folder to GitHub wiki
# Supports both initial migration and ongoing updates

set -e  # Exit on any error

WIKI_DIR="WeatherTunes.wiki"
DOCS_DIR="docs"
REPO_URL="https://github.com/BS-CS410/WeatherTunes.wiki.git"

echo "🔄 Syncing WeatherTunes documentation to GitHub wiki..."

# Function to check if we're in the right directory
check_environment() {
  if [[ ! -d "$DOCS_DIR" ]]; then
    echo "❌ Error: $DOCS_DIR folder not found. Run this script from the project root."
    exit 1
  fi
}

# Function to setup or update wiki repository
setup_wiki_repo() {
  if [[ -d "$WIKI_DIR" ]]; then
    echo "📁 Wiki directory exists, pulling latest changes..."
    cd "$WIKI_DIR"
    git pull origin master
    cd ..
  else
    echo "📥 Cloning wiki repository..."
    git clone "$REPO_URL" "$WIKI_DIR"
  fi
}

# Function to copy documentation files with timestamp check
copy_docs() {
  echo "📁 Copying documentation files..."

  # Copy main README as Home.md
  cp "$DOCS_DIR/README.md" "$WIKI_DIR/Home.md"

  # Copy architecture docs
  [[ -f "$DOCS_DIR/architecture/overview.md" ]] && cp "$DOCS_DIR/architecture/overview.md" "$WIKI_DIR/Architecture-Overview.md"
  [[ -f "$DOCS_DIR/architecture/components.md" ]] && cp "$DOCS_DIR/architecture/components.md" "$WIKI_DIR/Architecture-Components.md"
  [[ -f "$DOCS_DIR/architecture/state-management.md" ]] && cp "$DOCS_DIR/architecture/state-management.md" "$WIKI_DIR/Architecture-State-Management.md"

  # Copy feature docs
  [[ -f "$DOCS_DIR/features/weather.md" ]] && cp "$DOCS_DIR/features/weather.md" "$WIKI_DIR/Features-Weather.md"
  [[ -f "$DOCS_DIR/features/settings.md" ]] && cp "$DOCS_DIR/features/settings.md" "$WIKI_DIR/Features-Settings.md"
  [[ -f "$DOCS_DIR/features/video-backgrounds.md" ]] && cp "$DOCS_DIR/features/video-backgrounds.md" "$WIKI_DIR/Features-Video-Backgrounds.md"
  [[ -f "$DOCS_DIR/features/music.md" ]] && cp "$DOCS_DIR/features/music.md" "$WIKI_DIR/Features-Music.md"

  # Copy development docs
  [[ -f "$DOCS_DIR/development/getting-started.md" ]] && cp "$DOCS_DIR/development/getting-started.md" "$WIKI_DIR/Development-Getting-Started.md"
  [[ -f "$DOCS_DIR/development/setup.md" ]] && cp "$DOCS_DIR/development/setup.md" "$WIKI_DIR/Development-Setup.md"

  # Copy backend docs
  [[ -f "$DOCS_DIR/backend/api-requirements.md" ]] && cp "$DOCS_DIR/backend/api-requirements.md" "$WIKI_DIR/Backend-API-Requirements.md"
}

# Function to update internal links for wiki format
update_links() {
  echo "🔗 Updating internal links for wiki format..."

  # Update links in Home.md to point to wiki pages (without .md extension)
  sed -i '' 's|development/getting-started\.md|Development-Getting-Started|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|development/setup\.md|Development-Setup|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|architecture/overview\.md|Architecture-Overview|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|architecture/components\.md|Architecture-Components|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|architecture/state-management\.md|Architecture-State-Management|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|features/weather\.md|Features-Weather|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|features/settings\.md|Features-Settings|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|features/video-backgrounds\.md|Features-Video-Backgrounds|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|features/music\.md|Features-Music|g' "$WIKI_DIR/Home.md"
  sed -i '' 's|backend/api-requirements\.md|Backend-API-Requirements|g' "$WIKI_DIR/Home.md"
}

# Function to commit and push changes
push_changes() {
  cd "$WIKI_DIR"

  # Check if there are any changes
  if git diff --quiet && git diff --cached --quiet; then
    echo "📝 No changes detected in documentation."
    cd ..
    return
  fi

  echo "📤 Pushing changes to GitHub wiki..."
  git add .

  # Create commit message with timestamp and changed files
  CHANGED_FILES=$(git diff --cached --name-only | tr '\n' ' ')
  COMMIT_MSG="Update documentation - $(date '+%Y-%m-%d %H:%M')

Files updated: $CHANGED_FILES"

  git commit -m "$COMMIT_MSG"
  git push origin master
  cd ..
}

# Main execution
main() {
  check_environment
  setup_wiki_repo
  copy_docs
  update_links
  push_changes

  echo "✅ Documentation sync complete!"
  echo "🌐 View your wiki at: https://github.com/BS-CS410/WeatherTunes/wiki"
}

# Run main function
main
