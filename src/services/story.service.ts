import type { Story } from '../types/story.types'
import { mockStories } from '../mocks/data'

const STORIES_KEY = 'stories'

export function getStories(): Story[] {
  try {
    const stored = localStorage.getItem(STORIES_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* restricted storage */ }
  return []
}

function _saveStories(stories: Story[]): void {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
  } catch { /* restricted storage */ }
}

export function seedStoriesIfNeeded(): void {
  const existing = getStories()
  if (existing.length > 0) return
  _saveStories(mockStories)
}

export function getHomeStories(followingIds: string[], ownId: string): Story[] {
  const ids = new Set([...followingIds, ownId])
  return getStories()
    .filter(s => ids.has(s.by._id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function markStoryViewed(storyId: string, userId: string): void {
  const stories = getStories()
  const story = stories.find(s => s._id === storyId)
  if (!story) return

  if (!story.viewedBy) story.viewedBy = []
  if (!story.viewedBy.includes(userId)) {
    story.viewedBy.push(userId)
    _saveStories(stories)
  }
}
