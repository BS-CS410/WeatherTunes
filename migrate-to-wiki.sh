#!/bin/bash

# Script to migrate docs folder to GitHub wiki

echo "🚀 Migrating WeatherTunes documentation to GitHub wiki..."

# Step 1: Clone the wiki repository (run this after creating the first page on GitHub)
echo "📥 Cloning wiki repository..."
cd ~/Desktop
git clone https://github.com/BS-CS410/WeatherTunes.wiki.git

# Step 2: Copy documentation files
echo "📁 Copying documentation files..."
cd WeatherTunes.wiki

# Copy the main README as Home.md (GitHub wiki home page)
cp ../weathertunes/docs/README.md ./Home.md

# Copy all other documentation maintaining structure
# GitHub wikis flatten the structure, so we'll rename files to indicate hierarchy
cp ../weathertunes/docs/architecture/overview.md ./Architecture-Overview.md
cp ../weathertunes/docs/architecture/components.md ./Architecture-Components.md
cp ../weathertunes/docs/architecture/state-management.md ./Architecture-State-Management.md

cp ../weathertunes/docs/features/weather.md ./Features-Weather.md
cp ../weathertunes/docs/features/settings.md ./Features-Settings.md
cp ../weathertunes/docs/features/video-backgrounds.md ./Features-Video-Backgrounds.md
cp ../weathertunes/docs/features/music.md ./Features-Music.md

cp ../weathertunes/docs/development/getting-started.md ./Development-Getting-Started.md
cp ../weathertunes/docs/development/setup.md ./Development-Setup.md

cp ../weathertunes/docs/backend/api-requirements.md ./Backend-API-Requirements.md

# Step 3: Update internal links in Home.md to match new file names
echo "🔗 Updating internal links..."
sed -i '' 's|development/getting-started.md|Development-Getting-Started|g' Home.md
sed -i '' 's|development/setup.md|Development-Setup|g' Home.md
sed -i '' 's|architecture/overview.md|Architecture-Overview|g' Home.md
sed -i '' 's|architecture/components.md|Architecture-Components|g' Home.md
sed -i '' 's|architecture/state-management.md|Architecture-State-Management|g' Home.md
sed -i '' 's|features/weather.md|Features-Weather|g' Home.md
sed -i '' 's|features/settings.md|Features-Settings|g' Home.md
sed -i '' 's|features/video-backgrounds.md|Features-Video-Backgrounds|g' Home.md
sed -i '' 's|features/music.md|Features-Music|g' Home.md
sed -i '' 's|backend/api-requirements.md|Backend-API-Requirements|g' Home.md

# Step 4: Add, commit, and push to wiki
echo "📤 Pushing to GitHub wiki..."
git add .
git commit -m "Migrate documentation from docs folder

- Added comprehensive documentation structure
- Converted hierarchical docs to flat wiki structure
- Updated internal links for GitHub wiki format"

git push origin master

echo "✅ Documentation successfully migrated to GitHub wiki!"
echo "🌐 View your wiki at: https://github.com/BS-CS410/WeatherTunes/wiki"
