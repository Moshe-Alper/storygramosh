import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { markStoryViewed } from '../../services/story.service'
import type { Story } from '../../types/story.types'
import type { MiniUser } from '../../types/user.types'

interface Props {
  stories: Story[]
  initialUserIndex: number
  userOrder: MiniUser[]
  currentUserId: string
  onClose: () => void
}

const STORY_DURATION = 5000

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function StoryViewer({
  stories,
  initialUserIndex,
  userOrder,
  currentUserId,
  onClose,
}: Props) {
  const storiesByUser = useMemo(() => {
    const map = new Map<string, Story[]>()
    for (const user of userOrder) {
      map.set(user._id, [])
    }
    for (const story of stories) {
      const arr = map.get(story.by._id)
      if (arr) arr.push(story)
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
    return map
  }, [stories, userOrder])

  const [activeUserIdx, setActiveUserIdx] = useState(initialUserIndex)
  const [activeStoryIdx, setActiveStoryIdx] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressKeyRef = useRef(0)

  const currentUser = userOrder[activeUserIdx]
  const currentUserStories = storiesByUser.get(currentUser?._id) ?? []
  const currentStory = currentUserStories[activeStoryIdx]

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const goNext = useCallback(() => {
    clearTimer()
    if (activeStoryIdx < currentUserStories.length - 1) {
      setActiveStoryIdx(prev => prev + 1)
    } else if (activeUserIdx < userOrder.length - 1) {
      setActiveUserIdx(prev => prev + 1)
      setActiveStoryIdx(0)
    } else {
      onClose()
    }
  }, [activeStoryIdx, currentUserStories.length, activeUserIdx, userOrder.length, onClose, clearTimer])

  const goPrev = useCallback(() => {
    clearTimer()
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(prev => prev - 1)
    } else if (activeUserIdx > 0) {
      setActiveUserIdx(prev => prev - 1)
      const prevUserStories = storiesByUser.get(userOrder[activeUserIdx - 1]?._id) ?? []
      setActiveStoryIdx(prevUserStories.length - 1)
    }
  }, [activeStoryIdx, activeUserIdx, storiesByUser, userOrder, clearTimer])

  useEffect(() => {
    if (!currentStory) return
    markStoryViewed(currentStory._id, currentUserId)
    setImageLoaded(false)
    progressKeyRef.current += 1
  }, [currentStory?._id, currentUserId])

  useEffect(() => {
    if (!imageLoaded || !currentStory) return
    clearTimer()
    timerRef.current = setTimeout(goNext, STORY_DURATION)
    return clearTimer
  }, [imageLoaded, currentStory?._id, goNext, clearTimer])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goNext, goPrev])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!currentStory || !currentUser) return null

  return createPortal(
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-container" onClick={e => e.stopPropagation()}>
        {/* Progress bar */}
        <div className="story-progress-bar">
          {currentUserStories.map((s, i) => {
            let cls = 'story-progress-fill '
            if (i < activeStoryIdx) cls += 'viewed'
            else if (i === activeStoryIdx) cls += `active${imageLoaded ? '' : ' paused'}`
            else cls += 'upcoming'

            return (
              <div className="story-progress-segment" key={s._id}>
                <div
                  className={cls}
                  key={`fill-${progressKeyRef.current}-${i}`}
                />
              </div>
            )
          })}
        </div>

        {/* Header */}
        <div className="story-viewer-header">
          <img
            src={currentUser.imgUrl}
            alt={currentUser.username}
            className="avatar"
          />
          <span className="story-viewer-username">{currentUser.username}</span>
          <span className="story-viewer-time">{timeAgo(currentStory.createdAt)}</span>
          <button
            className="story-viewer-close"
            onClick={onClose}
            aria-label="Close story viewer"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image */}
        <div className="story-viewer-image-wrapper">
          <img
            src={currentStory.imgUrl}
            alt={`Story by ${currentUser.username}`}
            className={`story-viewer-image${imageLoaded ? '' : ' loading'}`}
            onLoad={() => setImageLoaded(true)}
            key={currentStory._id}
          />
          {currentStory.txt && (
            <div className="story-viewer-text">{currentStory.txt}</div>
          )}
        </div>

        {/* Tap zones */}
        <div
          className="story-tap-zone left"
          onClick={goPrev}
          role="button"
          aria-label="Previous story"
          tabIndex={-1}
        />
        <div
          className="story-tap-zone right"
          onClick={goNext}
          role="button"
          aria-label="Next story"
          tabIndex={-1}
        />
      </div>
    </div>,
    document.body
  )
}
