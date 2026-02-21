import type { Story } from '../../types/story.types'
import { StoryAvatar } from './StoryAvatar'

interface Props {
  stories: Story[]
  currentUserId: string
}

export function StoriesRow({ stories, currentUserId }: Props) {
  const uniqueByUser = stories.reduce<Story[]>((acc, story) => {
    if (!acc.some(s => s.by._id === story.by._id)) acc.push(story)
    return acc
  }, [])

  if (uniqueByUser.length === 0) return null

  return (
    <div className="stories-row">
      {uniqueByUser.map(story => (
        <StoryAvatar
          key={story._id}
          story={story}
          isViewed={story.viewedBy?.includes(currentUserId) ?? false}
        />
      ))}
    </div>
  )
}
