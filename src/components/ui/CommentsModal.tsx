import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Post, Comment } from '../../types/post.types'
import type { MiniUser } from '../../types/user.types'
import { addComment, toggleCommentLike, deleteComment } from '../../services/feed.service'
import { timeAgo } from '../../services/util.service'

interface Props {
  post: Post
  currentUser: MiniUser
  onClose: () => void
  onPostUpdate: (post: Post) => void
}

export function CommentsModal({ post, currentUser, onClose, onPostUpdate }: Props) {
  const [comments, setComments] = useState<Comment[]>(post.comments.list)
  const [count, setCount] = useState(post.comments.count)
  const [commentTxt, setCommentTxt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const handleClose = useCallback(() => { onClose() }, [onClose])

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

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function emitUpdate(list: Comment[], newCount: number) {
    onPostUpdate({
      ...post,
      comments: { count: newCount, list },
    })
  }

  function handleAddComment(ev: React.FormEvent) {
    ev.preventDefault()
    if (!commentTxt.trim()) return
    const comment = addComment(post._id, commentTxt.trim(), currentUser)
    if (comment) {
      const nextList = [...comments, comment]
      const nextCount = count + 1
      setComments(nextList)
      setCount(nextCount)
      emitUpdate(nextList, nextCount)
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
      }, 0)
    }
    setCommentTxt('')
  }

  function handleLike(commentId: string) {
    const updated = toggleCommentLike(post._id, commentId, currentUser)
    if (updated) {
      setComments(updated.comments.list)
      emitUpdate(updated.comments.list, count)
    }
  }

  function handleDelete(commentId: string) {
    const updated = deleteComment(post._id, commentId)
    if (updated) {
      const nextCount = count - 1
      setComments(updated.comments.list)
      setCount(nextCount)
      emitUpdate(updated.comments.list, nextCount)
    }
  }

  return createPortal(
    <div className="comments-overlay" onClick={handleClose}>
      <button className="comments-overlay-close" onClick={handleClose} aria-label="Close comments" type="button">
        <X size={24} />
      </button>

      <div className="comments-modal" onClick={e => e.stopPropagation()}>
        {/* Left – image */}
        <div className="comments-image-panel">
          <img src={post.imgUrl} alt={post.caption ?? 'Post image'} />
        </div>

        {/* Right – comments */}
        <div className="comments-panel">
          {/* Author + caption */}
          <div className="comments-panel-header">
            <div className="comments-author-row">
              <Link to={`/${post.by.username}`}>
                <img src={post.by.imgUrl} alt={post.by.username} className="avatar avatar-sm" />
              </Link>
              <Link to={`/${post.by.username}`} className="username">{post.by.username}</Link>
              <span className="comment-time">{timeAgo(post.createdAt)}</span>
            </div>
            {post.caption && <p className="comments-caption">{post.caption}</p>}
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="comments-empty">No comments yet.</div>
          ) : (
            <ul className="comments-list" ref={listRef}>
              {comments.map(c => {
                const isLiked = c.likedBy?.some(u => u._id === currentUser._id) ?? false
                const isOwn = c.by._id === currentUser._id
                return (
                  <li key={c._id} className="comment-item">
                    <Link to={`/${c.by.username}`}>
                      <img src={c.by.imgUrl} alt={c.by.username} className="avatar avatar-sm" />
                    </Link>
                    <div className="comment-body">
                      <div className="comment-body-header">
                        <Link to={`/${c.by.username}`} className="username">{c.by.username}</Link>
                        <span className="comment-time">{timeAgo(c.createdAt)}</span>
                      </div>
                      <p className="comment-text">{c.txt}</p>
                    </div>
                    <div className="comment-actions">
                      {isOwn && (
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDelete(c._id)}
                          aria-label="Delete comment"
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <button
                        className={`comment-like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => handleLike(c._id)}
                        aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
                        type="button"
                      >
                        <Heart size={14} fill={isLiked ? 'var(--clr-like)' : 'none'} />
                      </button>
                      {(c.likedBy?.length ?? 0) > 0 && (
                        <span className="comment-like-count">{c.likedBy!.length}</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Comment input */}
          <form className="comments-input-bar" onSubmit={handleAddComment}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              value={commentTxt}
              onChange={ev => setCommentTxt(ev.target.value)}
            />
            <button type="submit" disabled={!commentTxt.trim()}>Post</button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
