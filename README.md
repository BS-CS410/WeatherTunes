# WeatherTunes

Welcome to **WeatherTunes**! This project is a modern web application built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/). It uses [Tailwind CSS](https://tailwindcss.com/) for styling and is structured to be beginner-friendly for new web developers.

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

WeatherTunes is a template React project using Vite for fast development, TypeScript for type safety, and Tailwind CSS for utility-first styling. It is set up for easy extension, so you can add new pages and components as you learn. The project is organized to help you understand where different parts of your app live and how they work together.

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

- **ESLint** checks your code for errors and enforces style rules.
- **Prettier** automatically formats your code.

To check for lint errors:

```bash
npm run lint
```

---

## Further Resources

- [React documentation](https://react.dev/)
- [Vite documentation](https://vitejs.dev/guide/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs/installation)
- [React Router documentation](https://reactrouter.com/)

---
