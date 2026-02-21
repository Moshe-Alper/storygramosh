---
name: createPostComponent
description: Creating new post types, post components, or extending post functionality in this React posting application.
---
# Mister Posts Component Guidelines

When creating new post components or post types for this application, follow these conventions:

## File Structure
- Place post-related components in `src/components/Editor/`
- Use TypeScript with `.tsx` extension
- Create corresponding test file with `.test.tsx` suffix

## Component Pattern
```tsx
import type { PostData } from '../../types/post.types'

interface Props {
  data: PostData
  // additional props
}

export function MyPostComponent({ data }: Props) {
  // Component implementation
}
```

## Post Types
- Post types are defined in `src/types/post.types.ts`
- Register new types in `src/services/post.service.ts` via `getPostTypes()`
- Add corresponding SVG icon to `public/img/post/{type}.svg`

## Canvas Drawing
- Use HTML Canvas for rendering posts
- Support animation via the `useAnimation` hook
- Implement `drawPost(ctx, data, progress)` pattern where progress is 0-1

## Testing
- Use Vitest + React Testing Library
- Mock canvas context in tests
- Test user interactions and accessibility