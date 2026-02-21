---
name: serviceLayer
description: Creating services, data persistence, localStorage, utility functions, and business logic in this React application.
---
# Service Layer Guidelines

When creating or modifying services in this application, follow these patterns:

## File Location
- Place services in `src/services/`
- Name files with `.service.ts` suffix (e.g., `story.service.ts`)
- Create corresponding `.test.ts` file for tests

## Service Pattern
Services are pure functions, not classes. Export named functions:

```typescript
// story.service.ts
import type { StoryData } from '../types/story.types'

export function saveStory(story: StoryData): void {
  const stories = loadStories()
  stories.push(story)
  localStorage.setItem('stories', JSON.stringify(stories))
}

export function loadStories(): StoryData[] {
  const stored = localStorage.getItem('stories')
  return stored ? JSON.parse(stored) : []
}

export function deleteStory(id: string): void {
  const stories = loadStories().filter(c => c.id !== id)
  localStorage.setItem('stories', JSON.stringify(stories))
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
// story.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveStory, loadStories } from './story.service'

describe('Story Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load stories', () => {
    const story = { id: '1', name: 'Test' }
    saveStory(story)
    expect(loadStories()).toContainEqual(story)
  })
})
```

## Type Safety
- Define types in `src/types/story.types.ts`
- Use strict typing for all function parameters and returns
- Avoid `any` type
