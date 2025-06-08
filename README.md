# WeatherTunes

Welcome to **WeatherTunes**! This project is a modern web application built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/). It uses [Tailwind CSS](https://tailwindcss.com/) for styling and is structured to be beginner-friendly for new web developers.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Using Tailwind CSS](#using-tailwind-css)
  - [Basic Concepts](#basic-concepts)
  - [Common Properties Reference](#common-properties-reference)
  - [Styling shadcn/ui Components](#styling-shadcn-ui-components)
  - [Common Patterns](#common-patterns)
  - [Tips for Beginners](#tips-for-beginners)
- [Adding Pages](#adding-pages)
- [Adding Components](#adding-components)
- [Styling](#styling)
- [Linting and Formatting](#linting-and-formatting)
- [Further Resources](#further-resources)

---

## Project Overview

WeatherTunes is a web application that connects to your Spotify account and plays music according to the current weather in your location. It is built using Vite for fast development, TypeScript for type safety and Tailwind CSS for utility-first styling.

---

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

You can check if you have these installed by running:

```bash
node -v
npm -v
```

### What are `npm` and `npx`?

- **`npm`** is the Node.js package manager. You use it to install packages (libraries, tools, etc.) into your project or globally on your system. For example, `npm install react` adds React to your project.
- **`npx`** is a tool that comes with npm (version 5.2+). It lets you run commands from packages that you haven't installed globally. For example, `npx prettier --write .` will run Prettier even if you haven't installed it in your project, always using the latest version available.

In this README, you'll see both `npm` and `npx` used:

- Use `npm` to install dependencies.
- Use `npx` to run tools and CLIs directly from the command line.

### Installation

1. **Clone the repository**

   Open your terminal and run:

   ```bash
   git clone https://github.com/cpond8/weathertunes.git
   cd weathertunes
   ```

2. **Install dependencies**

   This will download all the packages the project needs:

   ```bash
   npm install
   ```

   > _This command reads `package.json` and installs everything listed under `dependencies` and `devDependencies`._

### Running the App

To start the development server (which will reload as you make changes):

```bash
npm run dev
```

- Open the URL shown in your terminal (usually `http://localhost:5173`) in your browser.
- You should see the WeatherTunes starter page.

---

## Project Structure

## Project Structure Overview

```
weathertunes/
├── src/
│   ├── assets/        # Images and static files (like logos)
│   ├── components/    # Reusable UI components (buttons, cards, etc.)
│   ├── lib/          # Utility functions (helpers used across the app)
│   ├── pages/        # Page components (each route/page in the app)
│   ├── App.tsx       # Main React component, sets up the app structure
│   ├── main.tsx      # Entry point, sets up React and routing
│   ├── index.css     # Global styles (Tailwind CSS)
│   └── App.css       # App-specific styles
├── public/           # Static files served as-is (like favicon)
├── package.json      # Project metadata and dependencies
└── vite.config.ts    # Vite configuration (build tool settings)
```

**What do these folders do?**

- `src/assets/`: Store images and static files used in the application.
- `src/components/`: Place for reusable UI pieces (like buttons, headers, etc.).
- `src/lib/`: Utility/helper functions that can be used throughout the application.
- `src/pages/`: Each file here represents a different page (or route) in the application.
- `src/App.tsx`: The main component that brings everything together.
- `src/main.tsx`: The entry point; this is where React starts the application and sets up routing.
- `src/index.css` and `src/App.css`: Where global and app-specific styles are defined.

**What about all these other files in root?**

The project includes several configuration files that typically won't need modification unless making specific changes:

- `tsconfig.json` and `tsconfig.app.json`: TypeScript configuration files that control type checking and compilation settings
- `tsconfig.node.json`: TypeScript configuration specifically for Vite's build process
- `eslint.config.js`: Configuration for ESLint, which helps catch code errors and enforce style rules
- `.prettierrc` and `.prettierignore`: Settings for Prettier, which automatically formats code
- `components.json`: Configuration for shadcn/ui components
- `.gitignore`: Specifies which files Git should ignore
- `index.html`: The HTML entry point for the Vite application

---

## Using Tailwind CSS

Tailwind CSS is a utility-first CSS framework that lets you style elements directly in your HTML/JSX using predefined classes. This section will help you get started with styling in WeatherTunes.

### Basic Concepts

1. **Utility Classes**: Instead of writing custom CSS, you use predefined classes like:
   ```jsx
   <div className="p-4 bg-blue-500 text-white rounded-lg">
     Hello World
   </div>
   ```
   This creates a div with:
   - `p-4`: padding of 1rem (16px)
   - `bg-blue-500`: blue background
   - `text-white`: white text
   - `rounded-lg`: large border radius

2. **Responsive Design**: Add screen size prefixes to make styles responsive:
   ```jsx
   <div className="w-full md:w-1/2 lg:w-1/3">
     This div is full width on mobile, half width on medium screens, and one-third width on large screens
   </div>
   ```

### Common Properties Reference

#### Spacing
- **Padding**: `p-{size}` (all sides), `px-{size}` (horizontal), `py-{size}` (vertical)
  ```jsx
  <div className="p-4"> // 1rem padding all around
  <div className="px-4 py-2"> // 1rem horizontal, 0.5rem vertical
  ```
  Sizes: `0`, `1` (0.25rem), `2` (0.5rem), `4` (1rem), `8` (2rem), etc.

- **Margin**: `m-{size}`, `mx-{size}`, `my-{size}` (same as padding)
  ```jsx
  <div className="m-4"> // 1rem margin all around
  <div className="mx-auto"> // auto margins for centering
  ```

#### Colors
- **Text**: `text-{color}-{shade}`
  ```jsx
  <p className="text-blue-500">Blue text</p>
  <p className="text-gray-700">Dark gray text</p>
  ```

- **Background**: `bg-{color}-{shade}`
  ```jsx
  <div className="bg-green-100">Light green background</div>
  ```

- **Border**: `border-{color}-{shade}`
  ```jsx
  <div className="border border-red-500">Red border</div>
  ```

#### Layout
- **Flexbox**: `flex`, `flex-row`, `flex-col`, `items-center`, `justify-between`
  ```jsx
  <div className="flex items-center justify-between">
    <span>Left</span>
    <span>Right</span>
  </div>
  ```

- **Grid**: `grid`, `grid-cols-{n}`, `gap-{size}`
  ```jsx
  <div className="grid grid-cols-3 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
  ```

#### Typography
- **Font Size**: `text-{size}`
  ```jsx
  <p className="text-sm">Small text</p>
  <p className="text-lg">Large text</p>
  <p className="text-2xl">Extra large text</p>
  ```

- **Font Weight**: `font-{weight}`
  ```jsx
  <p className="font-bold">Bold text</p>
  <p className="font-medium">Medium weight text</p>
  ```

### Styling shadcn/ui Components

shadcn/ui components are built with Tailwind CSS and can be customized using the same utility classes. Here are some common customizations:

1. **Buttons**:
   ```jsx
   <Button className="bg-blue-500 hover:bg-blue-600">
     Custom Button
   </Button>
   ```

2. **Cards**:
   ```jsx
   <Card className="p-6 bg-gray-50">
     <CardHeader className="space-y-1">
       <CardTitle className="text-2xl">Card Title</CardTitle>
     </CardHeader>
   </Card>
   ```

3. **Inputs**:
   ```jsx
   <Input className="border-2 border-gray-300 focus:border-blue-500" />
   ```

### Common Patterns

1. **Card with Hover Effect**:
   ```jsx
   <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
     Content
   </div>
   ```

2. **Responsive Navigation**:
   ```jsx
   <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
     <a href="#" className="text-gray-600 hover:text-blue-500">Link 1</a>
     <a href="#" className="text-gray-600 hover:text-blue-500">Link 2</a>
   </nav>
   ```

3. **Centered Content**:
   ```jsx
   <div className="flex items-center justify-center min-h-screen">
     <div className="text-center">
       Centered content
     </div>
   </div>
   ```

### Tips for Beginners

1. **Start Simple**: Begin with basic utilities like padding, margin, and colors before moving to complex layouts.

2. **Use the DevTools**: Right-click an element and use browser DevTools to experiment with different classes.

3. **Group Related Classes**: Keep your code readable by grouping related utilities:
   ```jsx
   <div className="
     p-4                    // spacing
     bg-white rounded-lg    // appearance
     flex items-center      // layout
     text-gray-800         // typography
   ">
     Content
   </div>
   ```

4. **Responsive Design**: Always consider mobile first. Start with mobile styles and add responsive prefixes for larger screens.

5. **Common Combinations**: Save frequently used combinations as components or custom classes in your CSS.

For more detailed information, visit the [Tailwind CSS documentation](https://tailwindcss.com/docs) and [shadcn/ui documentation](https://ui.shadcn.com/docs).

### Building a Web Application: A Comprehensive Guide

This section provides a detailed explanation of web application development concepts, from basic to advanced. Each concept builds upon the previous ones, creating a complete understanding of modern web development.

#### 1. Understanding Components

A component is a reusable piece of code that creates part of your web page. Components are the fundamental building blocks of React applications.

##### Basic Component Structure
```tsx
function WelcomeMessage({ userName }: { userName: string }) {
  return <h1 className="text-2xl text-blue-500">Welcome, {userName}</h1>
}
```

This component:
- Is named `WelcomeMessage`
- Accepts a `userName` as input
- Displays a welcome message with the user's name
- Uses Tailwind classes for styling

##### Component Types
1. **Function Components** (Most Common):
   ```tsx
   function Button({ text }: { text: string }) {
     return <button className="bg-blue-500">{text}</button>
   }
   ```

2. **Arrow Function Components**:
   ```tsx
   const Button = ({ text }: { text: string }) => {
     return <button className="bg-blue-500">{text}</button>
   }
   ```

3. **Components with Children**:
   ```tsx
   function Card({ children }: { children: React.ReactNode }) {
     return <div className="p-4 border">{children}</div>
   }
   ```

#### 2. Understanding Pages and Routing

Pages are special components that represent different screens in your application. They are managed through a routing system.

##### Basic Page Structure
```tsx
function HomePage() {
  return (
    <div className="p-4">
      <WelcomeMessage userName="WeatherTunes User" />
      <WeatherInformation />
      <MusicPlayer />
    </div>
  )
}
```

##### Setting Up Routes
```tsx
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/music" element={<MusicPage />} />
    </Routes>
  )
}
```

##### Navigation Between Pages
```tsx
import { Link } from "react-router-dom"

function Navigation() {
  return (
    <nav className="flex space-x-4">
      <Link to="/" className="text-blue-500">Home</Link>
      <Link to="/weather" className="text-blue-500">Weather</Link>
      <Link to="/music" className="text-blue-500">Music</Link>
    </nav>
  )
}
```

#### 3. Understanding Data Flow

Data in a web application flows from parent components to child components through props. Understanding this flow is crucial for building interactive applications.

##### Basic Data Flow
```tsx
// Parent component
function WeatherPage() {
  const currentTemperature = 22
  return <TemperatureDisplay temperature={currentTemperature} />
}

// Child component
function TemperatureDisplay({ temperature }: { temperature: number }) {
  return <div>The current temperature is {temperature}°C</div>
}
```

##### Handling User Input
```tsx
function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <input
      type="text"
      className="p-2 border rounded"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

##### State Management
```tsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  )
}
```

#### 4. Understanding Styling with Tailwind

Tailwind CSS provides a utility-first approach to styling. Each class represents a specific style property.

##### Basic Styling
```tsx
// Traditional CSS approach
<div style="padding: 1rem; background-color: blue; color: white;">
  Hello
</div>

// Tailwind CSS approach
<div className="p-4 bg-blue-500 text-white">
  Hello
</div>
```

##### Responsive Design
```tsx
<div className="
  w-full           // Full width on mobile
  md:w-1/2         // Half width on medium screens
  lg:w-1/3         // One-third width on large screens
  p-4              // Padding
  bg-white         // Background color
  rounded-lg       // Rounded corners
  shadow-md        // Box shadow
">
  Responsive Content
</div>
```

##### Common Style Patterns
1. **Card Layout**:
   ```tsx
   <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
     Card Content
   </div>
   ```

2. **Flexbox Layout**:
   ```tsx
   <div className="flex items-center justify-between p-4">
     <div>Left Content</div>
     <div>Right Content</div>
   </div>
   ```

3. **Grid Layout**:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     <div>Item 1</div>
     <div>Item 2</div>
     <div>Item 3</div>
   </div>
   ```

#### 5. Understanding Component Libraries

shadcn/ui provides pre-built components that can be customized to match your application's design.

##### Basic Component Usage
```tsx
// Basic usage
<Button className="bg-blue-500">
  Click Me
</Button>

// Customized usage
<Button className="bg-blue-500 hover:bg-blue-600">
  Custom Button
</Button>
```

##### Common Component Patterns
1. **Form Elements**:
   ```tsx
   <form className="space-y-4">
     <Input
       type="text"
       placeholder="Enter your name"
       className="w-full"
     />
     <Button type="submit">
       Submit
     </Button>
   </form>
   ```

2. **Modal Dialogs**:
   ```tsx
   <Dialog>
     <DialogTrigger>Open Dialog</DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Dialog Title</DialogTitle>
       </DialogHeader>
       <DialogBody>
         Dialog content goes here
       </DialogBody>
     </DialogContent>
   </Dialog>
   ```

3. **Navigation Menus**:
   ```tsx
   <NavigationMenu>
     <NavigationMenuList>
       <NavigationMenuItem>
         <NavigationMenuLink>Home</NavigationMenuLink>
       </NavigationMenuItem>
     </NavigationMenuList>
   </NavigationMenu>
   ```

#### 6. Error Handling and Loading States

Proper error handling and loading states are essential for a good user experience.

##### Loading States
```tsx
function WeatherDisplay({ isLoading, data }: { isLoading: boolean, data?: WeatherData }) {
  if (isLoading) {
    return <div className="p-4">Loading weather data...</div>
  }

  return <div className="p-4">{data?.temperature}°C</div>
}
```

##### Error Handling
```tsx
function WeatherDisplay({ error, data }: { error?: Error, data?: WeatherData }) {
  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>
  }

  return <div className="p-4">{data?.temperature}°C</div>
}
```

#### 7. Development Guidelines

1. **Start with Simple Components**
   Begin with basic components and gradually add complexity.

   ```tsx
   // Start with a simple component
   function SimpleCard() {
     return <div className="p-4 bg-white">Hello</div>
   }

   // Add features as needed
   function EnhancedCard({ title }: { title: string }) {
     return (
       <div className="p-4 bg-white rounded-lg shadow">
         <h2 className="text-xl">{title}</h2>
       </div>
     )
   }
   ```

2. **Maintain Component Focus**
   Each component should have a single responsibility.

   ```tsx
   // Good: Separate components for different responsibilities
   function TemperatureDisplay({ temp }: { temp: number }) {
     return <div>{temp}°C</div>
   }

   function LocationDisplay({ city }: { city: string }) {
     return <div>{city}</div>
   }
   ```

3. **Use TypeScript for Type Safety**
   TypeScript helps prevent errors by checking types.

   ```tsx
   // Define the data structure
   interface WeatherData {
     temperature: number
     condition: string
   }

   // Use the defined structure
   function WeatherCard({ temperature, condition }: WeatherData) {
     return <div>{temperature}°C - {condition}</div>
   }
   ```

4. **Organize Components Logically**
   Break down your user interface into logical components.

   ```tsx
   // Organize components by function
   function WeatherPage() {
     return (
       <div>
         <WeatherHeader />
         <WeatherCard />
         <MusicControls />
       </div>
     )
   }
   ```

Key Points to Remember:
- Components are the building blocks of your application
- Data flows from parent to child components
- Tailwind CSS provides styling through classes
- shadcn/ui offers pre-built components
- TypeScript helps prevent errors
- Start with simple components and build complexity gradually
- Handle loading and error states appropriately
- Use responsive design for all components
- Follow consistent naming conventions
- Keep components focused and reusable

---

## Adding Pages

Pages are React components that represent different routes in your app. They are stored in `src/pages/`.

**To add a new page:**

1. **Create a new file in `src/pages/`**, for example, `About.jsx`:

   ```jsx
   // src/pages/About.jsx
   function About() {
     return <h1>About WeatherTunes</h1>;
   }
   export default About;
   ```

2. **Add a route to your new page.**

   - Open `src/App.tsx`.
   - Import your new page at the top: `import About from './pages/About';`
   - Use [React Router](https://reactrouter.com/) to add a route (if not already set up, you may need to wrap your app in `<Routes>` and use `<Route>` components).

   Example:

   ```jsx
   import { Routes, Route } from "react-router-dom"
   import Home from "@/pages/Home"
   import About from "./pages/About"

   export default function App() {
     return (
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
       </Routes>
     )
   }
   ```

   > _Visit `/about` in your browser to see your new page._

---

## Adding Components

Components are reusable pieces of UI. The `src/components/` folder is where you put them. Components help you avoid repeating code and make your app easier to manage.

**To add a new component:**

1. **Create a new file in `src/components/`, e.g., `Button.jsx`:**

   ```jsx
   // src/components/Button.jsx
   function Button({ children, onClick }) {
     return (
       <button
         className="px-4 py-2 bg-blue-500 text-white rounded"
         onClick={onClick}
       >
         {children}
       </button>
     );
   }
   export default Button;
   ```

2. **Use your component in a page:**

   ```jsx
   import Button from "../components/Button";

   function Home() {
     return (
       <div>
         <h1>Welcome!</h1>
         <Button onClick={() => alert("Clicked!")}>Click Me</Button>
       </div>
     );
   }
   ```

---

## Styling

- **Tailwind CSS** is used for styling. You can use utility classes directly in your JSX, e.g., `className="text-xl font-bold"`.
- Global styles are in `src/index.css`.
- You can add custom CSS in `src/App.css` or create new CSS files as needed.

---

## Linting and Formatting

### Using Prettier

Prettier automatically formats your code to keep everything neat and consistent. You can use it to automatically format your code files.

- **Format all files in the project:**

  ```bash
  npx prettier --write .
  ```

  This will format all supported files in your project.

- **Format a specific file:**

  ```bash
  npx prettier --write src/components/Button.jsx
  ```

- **Format on save (recommended):**
  Most code editors (like VS Code) can be set up to run Prettier every time you save a file. Look for a Prettier extension or plugin for your editor and enable "Format on Save" in your settings.

- **Configuration:**
  - The `.prettierrc` file in the project root contains Prettier settings (currently using defaults).
  - The `.prettierignore` file lists files and folders to ignore when formatting.

### Using ESLint

ESLint is a tool that checks your code for errors and enforces consistent code style. It helps catch bugs and keeps your codebase clean.

- **Check your code for lint errors:**

  ```bash
  npm run lint
  ```

  This will scan your project and list any issues or warnings.

- **Fix issues automatically:**
  Many issues can be fixed automatically. Run:

  ```bash
  npx eslint . --fix
  ```

  This will try to fix as many problems as possible in your code files.

- **Lint on save (recommended):**
  Most editors (like VS Code) have ESLint extensions that can show errors and warnings as you type, and even fix issues when you save a file. Look for an ESLint extension/plugin for your editor and enable "Fix on Save" in your settings.

- **Configuration:**
  - The `eslint.config.js` file in the project root contains the ESLint rules and settings for this project.

---

## Using shadcn/ui for Components and Blocks

The main component library for this project is [shadcn/ui](https://ui.shadcn.com/). This library provides a huge set of accessible, customizable React components built with Tailwind CSS. The reason we use Tailwind is to make it easy to style and customize these components.

### Why shadcn/ui?

- **Copy-paste or CLI install:** You can add only the components you need, keeping your project lightweight.
- **Fully customizable:** All components use Tailwind CSS, so you can easily change their look and feel.
- **Accessible and modern:** Components are built with accessibility and best practices in mind.

### How to Add a shadcn/ui Component or Block

#### 1. Find the Component or Block

- Visit the [shadcn/ui components page](https://ui.shadcn.com/docs/components) or [blocks page](https://ui.shadcn.com/blocks).
- Browse and pick the component or block you want to add (e.g., Button, Card, Dialog, etc.).

#### 2. Add the Component Using the CLI

- Open your terminal in the project root.
- Run the following command, replacing `component-name` with the name of the component you want (e.g., `button`, `card`, `dialog`):

  ```bash
  npx shadcn@latest add component-name
  ```

  Example:

  ```bash
  npx shadcn@latest add button card
  ```

  This will add the Button and Card components to your project under `src/components/ui/`.

- If you are using React 19, the CLI may prompt you with:

  ```text
  It looks like you are using React 19. Some packages may fail to install due to peer dependency issues in npm (see https://ui.shadcn.com/react-19).
  How would you like to proceed?
  ```

  **Select the `legacy-peer-deps` option** when prompted. This will allow the installation to complete successfully.

- If you want to add a block (a group of components for a specific UI section), you can:
  - Copy the code from the [blocks page](https://ui.shadcn.com/blocks) and paste it into a new file in your `src/components/` directory, **or**
  - If a block is available via the CLI, use its name in the command above.

#### 3. Import and Use the Component

- Import the new component in your page or component file:
  ```jsx
  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  ```
- Use it in your JSX:
  ```jsx
  <Button>Click me</Button>
  <Card>...</Card>
  ```

#### 4. Customizing Components

- All shadcn/ui components use Tailwind classes, so you can add or change classes to customize their appearance.
- You can also edit the component files directly in `src/components/ui/` to change their structure or behavior.

#### 5. Keeping Components Up to Date

- To check for updates to a component, run:
  ```bash
  npx shadcn@latest diff component-name
  ```
- To update, follow the CLI prompts or re-add the component.

#### 6. More Resources

- [shadcn/ui documentation](https://ui.shadcn.com/docs/cli)
- [Component list](https://ui.shadcn.com/docs/components)
- [Blocks list](https://ui.shadcn.com/blocks)

---

## Further Resources

- [React documentation](https://react.dev/)
- [Vite documentation](https://vitejs.dev/guide/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs/installation)
- [React Router documentation](https://reactrouter.com/)

---
