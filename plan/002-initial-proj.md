# Storygramosh - Instagram Clone - Initial Project Plan 

## Project Overview
Minimal single-page React + TypeScript + Vite Instagram clone.  
Focus: feed of posts/stories, profile, interactions (like/comment/save), theme toggle, clean CSS architecture.

No backend yet → fake/mock data + local persistence (localStorage or IndexedDB later).

## Core Features (v1 scope)
1. Authentication stub (login/logout with mock user)
2. Home feed — posts from followed users
3. Stories row (ephemeral-like, 24h simulation later)
4. Post creation (image + caption modal)
5. Like, comment, save on posts
6. Profile page (own + others)
7. Light/dark theme toggle (persisted)
8. Responsive layout (desktop sidebar → mobile bottom nav later)

## Tech Stack
- React 18 + TypeScript
- Vite
- React Router v6
- Zustand for global state
- Lucide-react icons
- CSS layers (custom properties + data-theme attribute)
- localStorage for theme + mock user data persistence
- Optional later: TanStack Query for future API layer

## Coding Conventions
Per [copilot-instructions.md](.github/copilot-instructions.md):
- No semicolons in JS/TS unless necessary
- Single quotes in JS/TS
- Double quotes in HTML/JSX attributes
- Event handlers named `onSomething`

## Architecture
src/
├── main.tsx                  # entry + router + theme apply
├── App.tsx                   # root layout wrapper
├── style/                    # cssLayer convention
│   ├── main.css
│   ├── setup/
│   ├── basics/
│   └── cmps/
├── components/
│   ├── layout/               # MainLayout, LeftSidebar, RightSidebar
│   ├── ui/                   # Button, NavLink, ThemeToggle, PostCard...
│   └── modals/               # CreatePostModal, StoryViewer...
├── services/                 # serviceLayer pure functions
│   ├── theme.service.ts
│   ├── auth.service.ts       # mock login / current user
│   └── feed.service.ts       # mock feed generation
├── types/
│   ├── user.types.ts
│   ├── post.types.ts
│   ├── story.types.ts
│   └── ...
├── pages/
│   ├── Home.tsx              # feed + stories
│   ├── Profile.tsx
│   ├── Explore.tsx           # stub
│   └── ...
└── mocks/                    # fake data generators
    └── data.ts

## Data Shapes (TypeScript types + example objects)

### Post (main feed item)

```ts
export interface Post {
  _id: string;                // 'p101'
  imgUrl: string;             // single image for now (carousel later)
  caption?: string;
  by: {
    _id: string;              // 'u101'
    username: string;
    fullname?: string;
    imgUrl: string;           // avatar
  };
  createdAt: string;          // ISO or relative time
  likes: {
    count: number;
    likedBy: MiniUser[];      // or just count for v1
  };
  comments: {
    count: number;
    list: Comment[];          // preview 2–3 + "View all"
  };
  savedBy?: string[];         // user ids who saved (for bookmark-fill)
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  };
  tags?: string[];            // ['sunset', 'travel']
}
```

### Comment

```ts
export interface Comment {
  _id: string;                // 'c1001'
  txt: string;
  by: MiniUser;
  createdAt: string;
  likedBy?: MiniUser[];       // optional for v1
  replies?: Comment[];        // nested replies later
}
```

### MiniUser (used in likes / by / followers / ...)

```ts
export interface MiniUser {
  _id: string;
  username: string;
  fullname?: string;
  imgUrl: string;
}
```

### User (full profile)

```ts
export interface User {
  _id: string;                // 'u101'
  username: string;
  fullname: string;
  password?: string;          // only for mock auth
  imgUrl: string;             // profile pic
  bio?: string;
  website?: string;
  followers: MiniUser[];
  following: MiniUser[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likedPostIds?: string[];    // for "liked" collection view later
  savedPostIds?: string[];    // saved collection
}
```

### Story (simplified — no video for v1)

```ts
export interface Story {
  _id: string;                // 's101'
  imgUrl: string;
  txt?: string;               // optional overlay text
  by: MiniUser;
  createdAt: string;
  viewedBy?: string[];        // user ids (for seen ring)
  expiresAt?: string;         // ISO — hide after 24h
}
```

### Mock Data & Feed Logic (examples)

On first load, check localStorage for existing data. If empty, seed with default mock data.

```ts
// Current logged-in user (persisted in localStorage)
const loggedInUser: User = {
  _id: 'u101',
  username: 'moshik_dev',
  fullname: 'Moshik Alper',
  imgUrl: 'https://example.com/avatar.jpg',
  bio: 'building things in Tel Aviv',
  followers: [/* ... */],
  following: [/* ... */],
  postsCount: 42,
  followersCount: 1800,
  followingCount: 320,
}

// Derive home feed (mock implementation in feed.service.ts)
const followingIds = loggedInUser.following.map(u => u._id)
const feedPosts = allPosts
  .filter(post => followingIds.includes(post.by._id))
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

// My own posts (for profile)
const myPosts = allPosts
  .filter(post => post.by._id === loggedInUser._id)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

// Stories row — only from followed + own
const stories = allStories
  .filter(s => followingIds.includes(s.by._id) || s.by._id === loggedInUser._id)
  .sort(/* most recent first */)
```