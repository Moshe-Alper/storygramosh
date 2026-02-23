# StoryGramosh

A modern, responsive social media application built with React, TypeScript, and Vite, inspired by Instagram's core features. StoryGramosh allows users to share stories, create posts, interact with content, and stay updated with notifications.

## Features

- **Stories** - Share ephemeral stories with followers
- **Posts & Feed** - Create and view posts on your home feed
- **Comments** - Interact with posts through comments
- **Notifications** - Real-time notifications for likes, comments, and follows
- **Search** - Search for users and posts
- **Profiles** - User profiles with saved and liked posts
- **Theme Toggle** - Light and dark theme support
- **Responsive Design** - Mobile-friendly bottom navigation and responsive layout
- **Authentication** - User authentication and session management

## Tech Stack

- **Frontend Framework** - React 18+ with TypeScript
- **Build Tool** - Vite
- **Styling** - CSS with CSS Layers for component organization
- **State Management** - Custom React hooks and service layer
- **Type Safety** - Full TypeScript support with strict type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Sidebar, BottomNav, MainLayout)
│   ├── ui/             # UI components (Cards, Modals, Panels)
│   └── ThemeToggle.tsx # Theme switcher component
├── pages/              # Page components (Home, Explore, Profile, etc.)
├── services/           # Business logic and data persistence
│   ├── auth.service.ts
│   ├── feed.service.ts
│   ├── story.service.ts
│   ├── notification.service.ts
│   ├── theme.service.ts
│   └── util.service.ts
├── store/              # State management (auth store)
├── types/              # TypeScript type definitions
├── style/              # Global and component styles
│   ├── setup/          # Base styles (typography, variables, reset)
│   ├── basics/         # Basic element styles (buttons, layout, helpers)
│   └── cmps/           # Component-specific styles
├── mocks/              # Mock data for development
└── assets/             # Static assets
```

## Coding Standards

### JavaScript/TypeScript

- No semicolons unless necessary
- Single quotes for strings
- Event handlers named `onSomething`
- Full TypeScript type safety

### CSS

- CSS Layers for style organization
- Component-scoped styling
- CSS variables for theming

### Component Architecture

- Service layer pattern for business logic
- Strict separation of concerns
- Type-safe props and state

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start on `http://localhost:5173` with hot module replacement enabled.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Development Workflow

The project uses a planning-driven approach:

- Check the [plan/](plan/) directory for feature development plans
- Each plan documents feature requirements and implementation strategy
- Follow established coding styles and patterns before implementing

## Key Services

- **auth.service** - User authentication and session management
- **feed.service** - Post fetching and feed management
- **story.service** - Story creation and viewing
- **notification.service** - Notification handling and persistence
- **theme.service** - Theme management and localStorage persistence
- **util.service** - Utility functions

## Browser Support

Modern browsers with ES2020+ support

## License

MIT
