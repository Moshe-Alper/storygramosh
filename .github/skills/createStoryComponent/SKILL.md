---
name: createStoryComponent
description: Creating new story types, story components, or extending story functionality in this React storying application.
---
# Mister Stories Component Guidelines

When creating new story components or story types for this application, follow these conventions:

## File Structure
- Place story-related components in `src/components/Editor/`
- Use TypeScript with `.tsx` extension
- Create corresponding test file with `.test.tsx` suffix

## Component Pattern
```tsx
import type { StoryData } from '../../types/story.types'

interface Props {
  data: StoryData
  // additional props
}

export function MyStoryComponent({ data }: Props) {
  // Component implementation
}
```

## Story Types
- Story types are defined in `src/types/story.types.ts`
- Register new types in `src/services/story.service.ts` via `getStoryTypes()`
- Add corresponding SVG icon to `public/img/story/{type}.svg`

## Canvas Drawing
- Use HTML Canvas for rendering stories
- Support animation via the `useAnimation` hook
- Implement `drawStory(ctx, data, progress)` pattern where progress is 0-1

## Testing
- Use Vitest + React Testing Library
- Mock canvas context in tests
- Test user interactions and accessibility