---
name: serviceLayer
description: Creating services, data persistence, localStorage, utility functions, and business logic in this React application.
---
# Service Layer Guidelines

When creating or modifying services in this application, follow these patterns:

## File Location
- Place services in `src/services/`
- Name files with `.service.ts` suffix (e.g., `post.service.ts`)
- Create corresponding `.test.ts` file for tests

## Service Pattern
Services are pure functions, not classes. Export named functions:

```typescript
// post.service.ts
import type { PostData } from '../types/post.types'

export function savePost(post: PostData): void {
  const posts = loadPosts()
  posts.push(post)
  localStorage.setItem('posts', JSON.stringify(posts))
}

export function loadPosts(): PostData[] {
  const stored = localStorage.getItem('posts')
  return stored ? JSON.parse(stored) : []
}

export function deletePost(id: string): void {
  const posts = loadPosts().filter(c => c.id !== id)
  localStorage.setItem('posts', JSON.stringify(posts))
}
```

## Data Persistence
- Use `localStorage` for client-side persistence
- Always handle JSON parse errors gracefully
- Return empty arrays/objects as defaults, never undefined

## Utility Functions
Place in `src/services/util.service.ts`:
- ID generation: `makeId(length?: number)`
- Random helpers: `getRandomColor()`, `getRandomInt(min, max)`
- Keep utilities pure and stateless

## Testing Services
```typescript
// post.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { savePost, loadPosts } from './post.service'

describe('Post Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load posts', () => {
    const post = { id: '1', name: 'Test' }
    savePost(post)
    expect(loadPosts()).toContainEqual(post)
  })
})
```

## Type Safety
- Define types in `src/types/post.types.ts`
- Use strict typing for all function parameters and returns
- Avoid `any` type
