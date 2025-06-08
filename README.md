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

Understanding the project structure is key to being comfortable as you build. Here's a breakdown of the most important folders and files:

```
weathertunes/
├── src/
│   ├── assets/        # Images and static files (like logos)
│   ├── components/    # Reusable UI components (buttons, cards, etc.)
│   ├── lib/           # Utility functions (helpers used across the app)
│   ├── pages/         # Page components (each route/page in your app)
│   ├── App.tsx        # Main React component, sets up the app structure
│   ├── main.tsx       # Entry point, sets up React and routing
│   ├── index.css      # Global styles (Tailwind CSS)
│   └── App.css        # App-specific styles
├── public/            # Static files served as-is (like favicon)
├── package.json       # Project metadata and scripts
├── vite.config.ts     # Vite configuration (build tool settings)
└── README.md          # This file
```

**What do these folders do?**

- `src/assets/`: Store images and static files you want to use in your app.
- `src/components/`: Place for reusable UI pieces (like buttons, headers, etc.).
- `src/lib/`: Utility/helper functions that can be used anywhere in your app.
- `src/pages/`: Each file here is a different page (or route) in your app.
- `src/App.tsx`: The main component that brings everything together.
- `src/main.tsx`: The entry point; this is where React starts your app and sets up routing.
- `src/index.css` and `src/App.css`: Where you put your global and app-specific styles.

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
   import { Routes, Route } from "react-router-dom";
   import Home from "./pages/Home";
   import About from "./pages/About";

   function App() {
     return (
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/about" element={<About />} />
       </Routes>
     );
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

- **Prettier** automatically formats your code to keep everything neat and consistent.

### Using Prettier

Prettier is already set up in this project. You can use it to automatically format your code files.

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
