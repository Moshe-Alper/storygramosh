import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowLeft, Image, MapPin } from 'lucide-react'
import { createPost } from '../../services/feed.service'
import type { Post } from '../../types/post.types'
import type { MiniUser } from '../../types/user.types'

interface Props {
  currentUser: MiniUser
  onClose: () => void
  onPostCreated: (post: Post) => void
}

const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/seed/post1/600/600',
  'https://picsum.photos/seed/post2/600/600',
  'https://picsum.photos/seed/post3/600/600',
  'https://picsum.photos/seed/post4/600/600',
  'https://picsum.photos/seed/post5/600/600',
  'https://picsum.photos/seed/post6/600/600',
]

export function CreatePostModal({ currentUser, onClose, onPostCreated }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [imgUrl, setImgUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [showDiscard, setShowDiscard] = useState(false)

  const hasData = imgUrl || caption || location || tagsInput

  const handleClose = useCallback(() => {
    if (hasData) {
      setShowDiscard(true)
    } else {
      onClose()
    }
  }, [hasData, onClose])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleSubmit() {
    if (!imgUrl.trim()) return

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const newPost = createPost({
      imgUrl: imgUrl.trim(),
      caption: caption.trim() || undefined,
      by: currentUser,
      createdAt: new Date().toISOString(),
      likes: { count: 0, likedBy: [] },
      comments: { count: 0, list: [] },
      location: location.trim() ? { name: location.trim() } : undefined,
      tags: tags.length > 0 ? tags : undefined,
    })

    onPostCreated(newPost)
  }

  function handleDiscard() {
    setShowDiscard(false)
    onClose()
  }

  return createPortal(
    <div className="create-post-overlay" onClick={handleClose}>
      <div
        className={`create-post-modal ${step === 2 ? 'step-2' : 'step-1'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className="create-post-header">
          {step === 2 && (
            <button
              className="create-post-back"
              onClick={() => setStep(1)}
              aria-label="Go back"
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="create-post-title">
            {step === 1 ? 'Create new post' : 'Post details'}
          </h2>
          {step === 2 ? (
            <button
              className="create-post-share"
              onClick={handleSubmit}
              disabled={!imgUrl.trim()}
              type="button"
            >
              Share
            </button>
          ) : (
            <button
              className="create-post-next"
              onClick={() => setStep(2)}
              disabled={!imgUrl.trim()}
              type="button"
            >
              Next
            </button>
          )}
          <button
            className="create-post-close"
            onClick={handleClose}
            aria-label="Close"
            type="button"
          >
            <X size={22} />
          </button>
        </header>

        {/* Body */}
        <div className="create-post-body">
          {step === 1 ? (
            <div className="create-post-image-step">
              <div className="create-post-url-input">
                <Image size={20} className="input-icon" />
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={imgUrl}
                  onChange={e => setImgUrl(e.target.value)}
                  autoFocus
                />
              </div>

              {imgUrl.trim() ? (
                <div className="create-post-preview">
                  <img
                    src={imgUrl}
                    alt="Preview"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <>
                  <p className="placeholder-label">Or choose a placeholder</p>
                  <div className="placeholder-grid">
                    {PLACEHOLDER_IMAGES.map((url, i) => (
                      <button
                        key={i}
                        className="placeholder-item"
                        onClick={() => setImgUrl(url)}
                        type="button"
                      >
                        <img src={url} alt={`Placeholder ${i + 1}`} loading="lazy" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="create-post-details-step">
              <div className="details-preview">
                <img src={imgUrl} alt="Selected" />
              </div>
              <div className="details-form">
                <div className="details-user">
                  <img
                    src={currentUser.imgUrl}
                    alt={currentUser.username}
                    className="avatar avatar-sm"
                  />
                  <span className="username">{currentUser.username}</span>
                </div>
                <textarea
                  className="details-caption"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  maxLength={2200}
                  rows={4}
                  autoFocus
                />
                <div className="details-field">
                  <MapPin size={16} />
                  <input
                    type="text"
                    placeholder="Add location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
                <div className="details-field">
                  <span className="field-hash">#</span>
                  <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discard confirmation */}
      {showDiscard && (
        <div className="discard-dialog" onClick={e => e.stopPropagation()}>
          <h3>Discard post?</h3>
          <p>If you leave, your edits won't be saved.</p>
          <button className="discard-confirm" onClick={handleDiscard} type="button">
            Discard
          </button>
          <button
            className="discard-cancel"
            onClick={() => setShowDiscard(false)}
            type="button"
          >
            Cancel
          </button>
        </div>
      )}
    </div>,
    document.body
  )
}
