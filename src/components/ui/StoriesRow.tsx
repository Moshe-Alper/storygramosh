import { useMemo } from 'react'
import type { Story } from '../../types/story.types'
import type { MiniUser } from '../../types/user.types'
import { StoryAvatar } from './StoryAvatar'

interface Props {
  stories: Story[]
  currentUserId: string
  onStoryClick?: (userIndex: number, userOrder: MiniUser[]) => void
}

export function StoriesRow({ stories, currentUserId, onStoryClick }: Props) {
  const uniqueByUser = useMemo(() =>
    stories.reduce<Story[]>((acc, story) => {
      if (!acc.some(s => s.by._id === story.by._id)) acc.push(story)
      return acc
    }, []),
  [stories])

  const userOrder: MiniUser[] = useMemo(() =>
    uniqueByUser.map(s => s.by),
  [uniqueByUser])

  if (uniqueByUser.length === 0) return null

  return (
    <div className="stories-row">
      {uniqueByUser.map((story, idx) => (
        <StoryAvatar
          key={story._id}
          story={story}
          isViewed={story.viewedBy?.includes(currentUserId) ?? false}
          onClick={() => onStoryClick?.(idx, userOrder)}
        />
      ))}
    </div>
  )
}
