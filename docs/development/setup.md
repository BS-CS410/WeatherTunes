# Development Setup

This guide covers development environment configuration, tools setup, and workflow optimization for WeatherTunes development.

## Development Environment

### Required Tools

**Node.js and npm**

- Node.js 18+ (LTS recommended)
- npm 8+ (included with Node.js)
- Verify: `node -v && npm -v`

**Git**

- Latest version from [git-scm.com](https://git-scm.com/)
- Configure: `git config --global user.name "Your Name"`
- Configure: `git config --global user.email "your.email@example.com"`

**Code Editor**

- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint

### Environment Configuration

**Environment Variables**
Create `.env` in project root:

```bash
# Required: OpenWeatherMap API key
VITE_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# Optional: Development settings
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

**VS Code Settings**
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**Git Configuration**
Create `.gitignore` (already configured):

```
node_modules/
dist/
.env
.env.local
.vscode/
*.log
```

## Development Workflow

### Daily Development Commands

**Start Development Server**

```bash
npm run dev
```

- Starts Vite dev server on http://localhost:5173
- Hot module replacement enabled
- TypeScript type checking
- Tailwind CSS compilation

**Code Quality Checks**

```bash
npm run lint        # ESLint checking
npm run lint:fix    # Auto-fix ESLint issues
npm run type-check  # TypeScript compilation check
```

**Build Testing**

```bash
npm run build      # Production build
npm run preview    # Preview production build
```

### File Watching and Hot Reload

**Vite HMR Features:**

- Instant component updates
- CSS hot reloading
- TypeScript compilation
- Error overlay in browser
- Fast refresh for React components

**Performance Tips:**

- Use absolute imports (`@/components/...`)
- Avoid deeply nested re-renders
- Use React DevTools for performance profiling

## Code Quality Setup

### ESLint Configuration

**Current Configuration** (`eslint.config.js`):

- TypeScript support
- React hooks linting
- React refresh compatibility
- Custom rules for project standards

**Key Rules Enforced:**

- No unused variables
- Consistent import ordering
- React hooks dependency arrays
- TypeScript strict mode compliance

### Prettier Configuration

**Automatic Formatting:**

- Format on save in VS Code
- Tailwind class sorting
- Consistent code style
- Line length limits

**Manual Formatting:**

```bash
npx prettier --write .
```

### TypeScript Configuration

**Strict Mode Enabled:**

- Type checking for all files
- Strict null checks
- No implicit any types
- Unused locals detection

**Build Verification:**

```bash
npx tsc --noEmit  # Type checking only
```

## Development Browser Setup

### Browser Extensions

**React Developer Tools**

- Component tree inspection
- Props and state debugging
- Performance profiling
- Hook state monitoring

**Browser DevTools Usage:**

- Network tab for API monitoring
- Console for error tracking
- Application tab for localStorage
- Sources tab for debugging

### Testing in Multiple Browsers

**Recommended Testing:**

- Chrome/Edge (primary development)
- Firefox (compatibility)
- Safari (WebKit engine)
- Mobile browsers (responsive testing)

## API Development and Testing

### Weather API Testing

**Manual Testing Commands:**

```javascript
// Browser console testing
fetch("/api/weather?lat=47.6062&lon=-122.3321")
  .then((r) => r.json())
  .then(console.log);

// Test location detection
navigator.geolocation.getCurrentPosition((pos) => console.log(pos.coords));
```

**API Key Management:**

- Store keys in `.env` file only
- Never commit API keys to git
- Use different keys for dev/prod
- Monitor API usage and limits

### Mock Data Development

**Weather Data Mocking:**

```typescript
// For development without API calls
const mockWeatherData = {
  location: "Bellevue, WA",
  temperature: 22,
  condition: "clear sky",
  // ... full structure
};
```

**Music Data Mocking:**

```typescript
// Placeholder data structure
const mockSpotifyData = {
  songTitle: "Test Song",
  artistName: "Test Artist",
  albumArtUrl: "/placeholder-album.jpg",
};
```

## Development Database and Storage

### Local Storage Development

**Browser Storage Testing:**

```javascript
// View current settings
JSON.parse(localStorage.getItem("weathertunes-settings"));

// Clear settings for testing
localStorage.removeItem("weathertunes-settings");

// Test settings with different values
localStorage.setItem(
  "weathertunes-settings",
  JSON.stringify({
    temperatureUnit: "celsius",
    timeFormat: "24h",
  }),
);
```

### Debug Information Access

**Development Mode Features:**

- Settings menu shows debug info
- Console logging for all API calls
- Location detection status display
- Error boundary information

**Console Debug Commands:**

```javascript
// Test country unit defaults
testCountryUnits();

// Simulate location
simulateCountryDefaults("US");

// View component state (React DevTools)
$r.state; // Selected component state
$r.props; // Selected component props
```

## Performance Development

### Bundle Analysis

**Analyze Bundle Size:**

```bash
npm run build
npx vite-bundle-analyzer dist
```

**Performance Monitoring:**

- Lighthouse audits
- Core Web Vitals tracking
- Bundle size monitoring
- Asset loading optimization

### Development Performance

**Fast Development:**

- Use Vite's fast refresh
- Avoid expensive operations in render
- Use React.memo for heavy components
- Optimize re-renders with useMemo/useCallback

## Debugging Strategies

### Common Development Issues

**TypeScript Errors:**

- Check import paths and types
- Verify interface definitions
- Use TypeScript strict mode
- Fix any type annotations

**API Integration Issues:**

- Check network tab for failed requests
- Verify API key configuration
- Test with mock data first
- Handle loading and error states

**Styling Issues:**

- Use browser inspector for CSS debugging
- Check Tailwind class compilation
- Test responsive breakpoints
- Verify dark mode styles

### Debug Tools and Techniques

**React DevTools:**

- Component tree navigation
- Props and state inspection
- Performance profiler
- Hook debugging

**Browser DevTools:**

- Network monitoring
- Console error tracking
- Application storage inspection
- Performance monitoring

**VS Code Debugging:**

- Breakpoint debugging
- Variable inspection
- Call stack analysis
- Integrated terminal usage

## Collaboration Workflow

### Git Workflow

**Branch Strategy:**

```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create pull request
```

**Commit Message Format:**

```
type(scope): description

Examples:
feat(weather): add weather alerts
fix(settings): resolve storage issue
docs(readme): update installation steps
```

### Code Review Checklist

**Before Submitting:**

- [ ] Code passes ESLint and TypeScript checks
- [ ] Component renders correctly in browser
- [ ] Responsive design tested
- [ ] Dark mode compatibility verified
- [ ] API integration working
- [ ] No console errors
- [ ] Clean commit history

### Documentation Updates

**When to Update Docs:**

- New features added
- API changes made
- Configuration modified
- Dependencies updated
- Workflow changes implemented
