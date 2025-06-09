# WeatherTunes

**WeatherTunes** is a web application that connects to your Spotify account and plays music according to the current weather in your location. This project is a modern web application built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vitejs.dev/). It uses [Tailwind CSS](https://tailwindcss.com/) for styling and is structured to be beginner-friendly for new web developers.

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Running the Development Server](#running-the-development-server)
- [Project Structure](#project-structure)
- [Using Tailwind CSS](#using-tailwind-css)
  - [Basic Concepts](#basic-concepts)
  - [Common Properties Reference](#common-properties-reference)
  - [Common Patterns](#common-patterns)
- [Adding Pages](#adding-pages)
- [Adding Components](#adding-components)
- [Linting and Formatting](#linting-and-formatting)
- [Further Resources](#further-resources)

---

## Getting Started

This section will guide you through setting up your development environment and getting the project running on your local machine. We'll cover everything from installing prerequisites to running the development server.

### Prerequisites

Before you begin, you'll need to have the following tools installed on your computer:

1. **Node.js** (version 18 or higher recommended)
   - This is the JavaScript runtime that powers your development environment
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version for stability

2. **npm** (Node Package Manager)
   - Comes bundled with Node.js
   - Used to install and manage project dependencies
   - You don't need to install it separately

To verify your installations, open a terminal and run:
```bash
node -v    # Should show v18.x.x or higher
npm -v     # Should show 8.x.x or higher
```

### What are `npm` and `npx`?

- **`npm`** is the Node.js package manager. You use it to install packages (libraries, tools, etc.) into your project or globally on your system. For example, `npm install react` adds React to your project.
- **`npx`** is a tool that comes with npm (version 5.2+). It lets you run commands from packages that you haven't installed globally. For example, `npx prettier --write .` will run Prettier even if you haven't installed it in your project, always using the latest version available.

In this README, you'll see both `npm` and `npx` used:

- Use `npm` to install dependencies.
- Use `npx` to run tools and CLIs directly from the command line.

Example `npx` usage:
```bash
npx create-react-app my-app     # Create a new React app
npx prettier --write .          # Format all files
npx eslint .                    # Lint all files
```

### Installation Steps

1. **Clone the Repository**
   ```bash
   # (Install git first if you haven't already)
   git clone https://github.com/cpond8/weathertunes.git

   # Then navigate into the project directory
   cd weathertunes
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This command:
   - Reads the `package.json` file
   - Installs all listed dependencies
   - Creates a `node_modules` directory
   - Generates a `package-lock.json` file for dependency versioning

   > **Note**: The installation process might take a few minutes depending on your internet connection and computer speed.

3. **Verify Installation**
   After installation, you should see:
   - A `node_modules` directory containing all dependencies
   - A `package-lock.json` file
   - No error messages in the terminal

### Running the Development Server

1. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This command:
   - Starts the Vite development server
   - Enables hot module replacement (HMR)
   - Opens your default browser to `http://localhost:5173`

2. **Understanding the Development Environment**
   - The server automatically reloads when you make changes
   - You'll see compilation errors in the terminal
   - The browser console (F12) shows runtime errors
   - HMR updates components without full page refresh

3. **Available Scripts**
   ```bash
   npm run dev      # Start development server
   npm run build    # Build for production
   npm run preview  # Preview production build
   npm run lint     # Run ESLint
   npm run format   # Format code with Prettier
   ```

### Troubleshooting

Common issues and solutions:

1. **Port Already in Use**
   ```bash
   # If port 5173 is already in use, you can specify a different port
   npm run dev -- --port 3000
   ```

2. **Dependency Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

3. **TypeScript Errors**
   - Check that you're using the correct types
   - Make sure all required props are provided
   - Verify that imports are correct

4. **Build Errors**
   - Check for syntax errors (watch out for brackets and implicit semicolons!)
   - *Really* verify all imports are correct
   - Make sure all required dependencies are installed

---

## Project Structure

```
weathertunes/
├── src/              # Source code directory
│   ├── assets/           # Images and static files
│   ├── components/       # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   └── ...               # Custom components
│   ├── lib/              # Utility functions and shared logic
│   ├── pages/            # Page components (each route/page in the app)
│   ├── App.tsx           # Main React component, sets up the app structure
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles (Tailwind CSS)
│   └── App.css           # App-specific styles
├── public/           # Static files served as-is (like favicon)
├── package.json      # Project dependencies and scripts
└── vite.config.ts    # Vite configuration
```

### Understanding Each Directory

- `src/assets/`: Store images and static files used in the application.
- `src/components/`: Place for reusable UI pieces (like buttons, headers, etc.).
- `src/lib/`: Utility/helper functions that can be used throughout the application.
- `src/pages/`: Each file here represents a different page (or route) in the application.
- `src/App.tsx`: The main component that brings everything together.
- `src/main.tsx`: The entry point; this is where React starts the application and sets up routing.
- `src/index.css` and `src/App.css`: Where global and app-specific styles are defined.

---

### Configuration Files

#### `package.json`
This file contains:
- Project metadata (name, version)
- Dependencies and their versions
- Scripts for running, building, and testing
- Other project configuration

Example scripts section:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

#### `vite.config.ts`
This file configures the Vite build tool:
- Development server settings
- Build options
- Path aliases
- Plugin configuration

Example configuration:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Miscellaneous Files

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

Tailwind CSS is a utility-first CSS framework that lets you style elements directly in your HTML/TSX code using predefined classes. Instead of writing custom CSS, you compose styles using these utility classes. This section will help you get started with styling in WeatherTunes.

### Basic Concepts

#### 1. Utility Classes
Utility classes are the building blocks of Tailwind CSS. Each class represents a specific style property.

```tsx
// Basic utility classes
<div className="p-4 bg-blue-500 text-white rounded-lg">
  Hello World
</div>
```

This creates a div with:
- `p-4`: padding of 1rem (16px) on all sides
- `bg-blue-500`: blue background color
- `text-white`: white text color
- `rounded-lg`: large border radius

#### 2. Responsive Design
Tailwind uses screen size prefixes to create responsive designs:

```tsx
<div className="
  w-full           // Full width on mobile
  md:w-1/2         // Half width on medium screens (768px+)
  lg:w-1/3         // One-third width on large screens (1024px+)
">
  Responsive Content
</div>
```

Common screen sizes:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

#### 3. State Variants
Tailwind provides state variants for interactive elements:

```tsx
<button className="
  bg-blue-500           // Default state
  hover:bg-blue-600     // Hover state
  focus:ring-2          // Focus state
  active:bg-blue-700    // Active state
  disabled:opacity-50   // Disabled state
">
  Click Me
</button>
```

Common state variants:
- `hover:`: Mouse hover
- `focus:`: Keyboard focus
- `active:`: Mouse down
- `disabled:`: Disabled state
- `group-hover:`: Parent hover

### Common Properties Reference

#### Spacing
Tailwind uses a consistent spacing scale:

```tsx
// Padding
<div className="p-4">           // Padding all sides
<div className="px-4 py-2">     // Padding x and y
<div className="pt-4 pb-2">     // Padding top and bottom
<div className="pl-4 pr-2">     // Padding left and right

// Margin
<div className="m-4">           // Margin all sides
<div className="mx-auto">       // Auto margins for centering
<div className="mt-4 mb-2">     // Margin top and bottom
```

Spacing scale:
- `0`: 0px
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `4`: 1rem (16px)
- `8`: 2rem (32px)
- `16`: 4rem (64px)

#### Colors
Tailwind provides a comprehensive color palette:

```tsx
// Text colors
<p className="text-blue-500">Blue text</p>
<p className="text-gray-700">Dark gray text</p>

// Background colors
<div className="bg-green-100">Light green background</div>
<div className="bg-red-500">Red background</div>

// Border colors
<div className="border border-blue-500">Blue border</div>
```

Color scale:
- `50`: Lightest
- `100`: Very light
- `200`: Light
- `300`: Medium light
- `400`: Medium
- `500`: Base
- `600`: Medium dark
- `700`: Dark
- `800`: Very dark
- `900`: Darkest

#### Layout
Tailwind provides utilities for common layout patterns:

```tsx
// Flexbox
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Grid
<div className="grid grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Container
<div className="container mx-auto px-4">
  Centered content with padding
</div>
```

Common layout utilities:
- `flex`: Flexbox container
- `grid`: Grid container
- `container`: Responsive container
- `block`: Block display
- `inline-block`: Inline block display
- `hidden`: Hide element

#### Typography
Tailwind includes comprehensive typography utilities:

```tsx
// Font sizes
<p className="text-sm">Small text</p>
<p className="text-base">Base text</p>
<p className="text-lg">Large text</p>
<p className="text-2xl">Extra large text</p>

// Font weights
<p className="font-normal">Normal weight</p>
<p className="font-medium">Medium weight</p>
<p className="font-bold">Bold weight</p>

// Text alignment
<p className="text-left">Left aligned</p>
<p className="text-center">Center aligned</p>
<p className="text-right">Right aligned</p>
```

Typography scale:
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)

### Styling shadcn/ui Components

shadcn/ui components are built with Tailwind CSS and can be customized using the same utility classes.

#### 1. Buttons
```tsx
<Button className="
  bg-blue-500           // Custom background
  hover:bg-blue-600     // Custom hover state
  text-white            // Custom text color
  px-6 py-2             // Custom padding
  rounded-full          // Custom border radius
">
  Custom Button
</Button>
```

#### 2. Cards
```tsx
<Card className="
  p-6                // Custom padding
  bg-gray-50         // Custom background
  shadow-lg          // Custom shadow
  hover:shadow-xl    // Custom hover effect
">
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl">Card Title</CardTitle>
  </CardHeader>
</Card>
```

#### 3. Inputs
```tsx
<Input className="
  border-2              // Custom border width
  border-gray-300       // Custom border color
  focus:border-blue-500 // Custom focus state
  rounded-lg            // Custom border radius
  px-4 py-2             // Custom padding
" />
```

### Common Patterns

#### 1. Card with Hover Effect
```tsx
<div className="
  p-4                // Padding
  bg-white           // Background
  rounded-lg         // Rounded corners
  shadow-md          // Default shadow
  hover:shadow-lg    // Larger shadow on hover
  transition-shadow  // Smooth transition
  duration-200       // Transition duration
">
  Card Content
</div>
```

#### 2. Responsive Navigation
```tsx
<nav className="
  flex               // Flex container
  flex-col           // Stack on mobile
  md:flex-row        // Row on medium screens
  items-center       // Center items
  space-y-4          // Vertical spacing on mobile
  md:space-y-0       // No vertical spacing on medium
  md:space-x-4       // Horizontal spacing on medium
">
  <a href="#" className="text-gray-600 hover:text-blue-500">Link 1</a>
  <a href="#" className="text-gray-600 hover:text-blue-500">Link 2</a>
</nav>
```

#### 3. Centered Content
```tsx
<div className="
  flex               // Flex container
  items-center       // Center vertically
  justify-center     // Center horizontally
  min-h-screen       // Full viewport height
">
  <div className="text-center">
    Centered content
  </div>
</div>
```

### Advanced Techniques

#### 1. Custom Classes
Create custom classes in your CSS file:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

#### 2. Dynamic Classes
Use template literals for dynamic classes:

```tsx
function Button({ variant = 'primary' }) {
  return (
    <button
      className={`
        px-4 py-2 rounded
        ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
      `}
    >
      Click Me
    </button>
  )
}
```

#### 3. Group Hover
Style child elements based on parent hover:

```tsx
<div className="group">
  <div className="text-gray-600 group-hover:text-blue-500">
    Hover me to change color
  </div>
</div>
```

For more detailed information, visit the [Tailwind CSS documentation](https://tailwindcss.com/docs) and [shadcn/ui documentation](https://ui.shadcn.com/docs).

---

## Adding Pages

Pages are React components that represent different routes in your application. They are stored in the `src/pages/` directory and are used to create the different screens of your application.

### Understanding Pages

#### What are Pages?
Pages are special components that:
- Represent a unique URL in your application
- Contain the main content for that route
- Can include multiple components
- Handle their own data fetching and state management

#### Page Structure
A typical page component follows this structure:
```tsx
// src/pages/About.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function About() {
  // State management
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    // Layout
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="text-gray-600 mt-2">Learn more about our mission</p>
      </header>

      {/* Main Content */}
      <main>
        <Card className="p-6">
          <p className="text-gray-700">
            Welcome to our application! This is the about page where you can learn more about us.
          </p>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        </Card>
      </main>
    </div>
  )
}

export default About
```

### Creating a New Page

1. **Create the Page Component**
   ```tsx
   // src/pages/Contact.tsx
   function Contact() {
     return (
       <div className="max-w-4xl mx-auto p-6">
         <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
         <p className="text-gray-600">
           Get in touch with our team.
         </p>
       </div>
     )
   }

   export default Contact
   ```

2. **Add the Route**
   ```tsx
   // src/App.tsx
   import { Routes, Route } from 'react-router-dom'
   import Home from '@/pages/Home'
   import About from '@/pages/About'
   import Contact from '@/pages/Contact'

   function App() {
     return (
       <div className="min-h-screen bg-gray-50">
         <NavBar />
         <main className="container mx-auto px-4 py-8">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/about" element={<About />} />
             <Route path="/contact" element={<Contact />} />
           </Routes>
         </main>
       </div>
     )
   }
   ```

3. **Add Navigation**
   ```tsx
   // src/components/NavBar.tsx
   import { Link } from 'react-router-dom'

   function NavBar() {
     return (
       <nav className="bg-white shadow">
         <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between h-16">
             <div className="flex space-x-8">
               <Link to="/" className="text-gray-900 hover:text-blue-500">
                 Home
               </Link>
               <Link to="/about" className="text-gray-900 hover:text-blue-500">
                 About
               </Link>
               <Link to="/contact" className="text-gray-900 hover:text-blue-500">
                 Contact
               </Link>
             </div>
           </div>
         </div>
       </nav>
     )
   }
   ```

## Adding Components

Components are reusable pieces of UI that can be used across your application. They help you maintain consistency and reduce code duplication.

### Understanding Components

#### What are Components?
Components are:
- Reusable pieces of UI
- Self-contained and independent
- Can accept props for customization
- Can maintain their own state

#### Basic Component Example
```tsx
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

function Button({
  children,
  variant = 'primary',
  onClick
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded px-4 py-2
        ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
        hover:opacity-90
        transition-opacity
      `}
    >
      {children}
    </button>
  )
}

export default Button
```

#### Using Components
```tsx
// src/pages/Home.tsx
import Button from '@/components/Button'

function Home() {
  return (
    <div className="p-4">
      <Button variant="primary" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </div>
  )
}
```

### Common Component Patterns

1. **Layout Components**
   ```tsx
   // src/components/Layout.tsx
   interface LayoutProps {
     children: React.ReactNode
     sidebar?: React.ReactNode
   }

   function Layout({ children, sidebar }: LayoutProps) {
     return (
       <div className="flex min-h-screen">
         {sidebar && (
           <aside className="w-64 bg-gray-100 p-4">
             {sidebar}
           </aside>
         )}
         <main className="flex-1 p-6">
           {children}
         </main>
       </div>
     )
   }
   ```

2. **Form Components**
   ```tsx
   // src/components/Form.tsx
   interface FormProps {
     onSubmit: (data: FormData) => void
     children: React.ReactNode
   }

   function Form({ onSubmit, children }: FormProps) {
     const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault()
       const formData = new FormData(e.target as HTMLFormElement)
       onSubmit(formData)
     }

     return (
       <form onSubmit={handleSubmit} className="space-y-4">
         {children}
       </form>
     )
   }
   ```

3. **List Components**
   ```tsx
   // src/components/List.tsx
   interface ListProps<T> {
     items: T[]
     renderItem: (item: T) => React.ReactNode
     className?: string
   }

   function List<T>({ items, renderItem, className = '' }: ListProps<T>) {
     return (
       <ul className={`divide-y divide-gray-200 ${className}`}>
         {items.map((item, index) => (
           <li key={index} className="py-4">
             {renderItem(item)}
           </li>
         ))}
       </ul>
     )
   }
   ```

### Component Composition

1. **Compound Components**
   ```tsx
   // src/components/Accordion.tsx
   interface AccordionProps {
     children: React.ReactNode
   }

   function Accordion({ children }: AccordionProps) {
     return <div className="space-y-2">{children}</div>
   }

   Accordion.Item = function AccordionItem({
     title,
     children
   }: {
     title: string
     children: React.ReactNode
   }) {
     const [isOpen, setIsOpen] = useState(false)

     return (
       <div className="border rounded">
         <button
           onClick={() => setIsOpen(!isOpen)}
           className="w-full p-4 text-left"
         >
           {title}
         </button>
         {isOpen && <div className="p-4">{children}</div>}
       </div>
     )
   }
   ```

2. **Render Props**
   ```tsx
   // src/components/DataFetcher.tsx
   interface DataFetcherProps<T> {
     url: string
     children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
   }

   function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
     const [data, setData] = useState<T | null>(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState<Error | null>(null)

     useEffect(() => {
       fetch(url)
         .then(res => res.json())
         .then(data => {
           setData(data)
           setLoading(false)
         })
         .catch(error => {
           setError(error)
           setLoading(false)
         })
     }, [url])

     return <>{children(data, loading, error)}</>
   }
   ```

### Component Documentation

1. **JSDoc Comments**
   ```tsx
   /**
    * A button component that supports different variants and sizes.
    * @param {Object} props - Component props
    * @param {React.ReactNode} props.children - Button content
    * @param {'primary' | 'secondary'} [props.variant='primary'] - Button style variant
    * @param {() => void} [props.onClick] - Click handler
    */
   function Button({ children, variant = 'primary', onClick }: ButtonProps) {
     // Component implementation
   }
   ```

2. **Usage Examples**
   ```tsx
   // Example usage in a README or documentation
   <Button variant="primary" onClick={() => alert('Clicked!')}>
     Click Me
   </Button>
   ```
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
