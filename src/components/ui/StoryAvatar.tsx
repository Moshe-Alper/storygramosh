import type { Story } from '../../types/story.types'

interface Props {
  story: Story
  isViewed: boolean
  onClick?: () => void
}

export function StoryAvatar({ story, isViewed, onClick }: Props) {
  return (
    <button
      className={`story-avatar ${isViewed ? 'viewed' : ''}`}
      onClick={onClick}
      type="button"
      aria-label={`${story.by.username}'s story`}
    >
      <div className="story-ring">
        <img
          src={story.by.imgUrl}
          alt={story.by.username}
          className="avatar"
        />
      </div>
      <span className="story-username">{story.by.username}</span>
    </button>
  )
}
