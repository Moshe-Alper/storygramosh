import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import type { Post } from '../../types/post.types'
import type { MiniUser } from '../../types/user.types'
import { toggleLike, addComment, toggleSave } from '../../services/feed.service'
import { timeAgo } from '../../services/util.service'
import { CommentsModal } from './CommentsModal'

interface Props {
  post: Post
  currentUser: MiniUser
  onPostUpdate?: (post: Post) => void
}

export function PostCard({ post, currentUser, onPostUpdate }: Props) {
  const [commentTxt, setCommentTxt] = useState('')
  const [commentsModalOpen, setCommentsModalOpen] = useState(false)
  const isLiked = post.likes.likedBy.some(u => u._id === currentUser._id)
  const isSaved = post.savedBy?.includes(currentUser._id) ?? false

  function onLike() {
    const updated = toggleLike(post._id, currentUser)
    if (updated) onPostUpdate?.(updated)
  }

  function onSave() {
    toggleSave(post._id, currentUser._id)
    onPostUpdate?.({ ...post, savedBy: isSaved
      ? post.savedBy?.filter(id => id !== currentUser._id)
      : [...(post.savedBy ?? []), currentUser._id]
    })
  }

  function onSubmitComment(ev: React.FormEvent) {
    ev.preventDefault()
    if (!commentTxt.trim()) return
    const comment = addComment(post._id, commentTxt.trim(), currentUser)
    if (comment) {
      onPostUpdate?.({
        ...post,
        comments: {
          count: post.comments.count + 1,
          list: [...post.comments.list, comment],
        },
      })
    }
    setCommentTxt('')
  }

  return (
    <article className="post-card">
      <header className="post-header">
        <Link to={`/${post.by.username}`} className="post-author">
          <img src={post.by.imgUrl} alt={post.by.username} className="avatar avatar-sm" />
          <div className="post-author-info">
            <span className="username">{post.by.username}</span>
            {post.location && <span className="post-location">{post.location.name}</span>}
          </div>
        </Link>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </header>

      <div className="post-image">
        <img
          src={post.imgUrl}
          alt={post.caption ?? 'Post image'}
          loading="lazy"
          onDoubleClick={onLike}
        />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={onLike}
            aria-label="Like"
            type="button"
          >
            <Heart size={24} fill={isLiked ? 'var(--clr-like)' : 'none'} />
          </button>
          <button className="action-btn" aria-label="Comment" type="button">
            <MessageCircle size={24} />
          </button>
          <button className="action-btn" aria-label="Share" type="button">
            <Send size={24} />
          </button>
        </div>
        <button
          className={`action-btn ${isSaved ? 'saved' : ''}`}
          onClick={onSave}
          aria-label="Save"
          type="button"
        >
          <Bookmark size={24} fill={isSaved ? 'var(--clr-text)' : 'none'} />
        </button>
      </div>

      <div className="post-info">
        <span className="post-likes">{post.likes.count.toLocaleString()} likes</span>

        {post.caption && (
          <p className="post-caption">
            <Link to={`/${post.by.username}`} className="username">{post.by.username}</Link>{' '}
            {post.caption}
          </p>
        )}

        {post.comments.count > 2 && (
          <button className="view-comments" type="button" onClick={() => setCommentsModalOpen(true)}>
            View all {post.comments.count} comments
          </button>
        )}

        {post.comments.list.slice(-2).map(c => (
          <p key={c._id} className="post-comment">
            <Link to={`/${c.by.username}`} className="username">{c.by.username}</Link>{' '}
            {c.txt}
          </p>
        ))}
      </div>

      <form className="post-comment-form" onSubmit={onSubmitComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentTxt}
          onChange={ev => setCommentTxt(ev.target.value)}
          className="comment-input"
        />
        <button
          type="submit"
          className="comment-submit"
          disabled={!commentTxt.trim()}
        >
          Post
        </button>
      </form>

      {commentsModalOpen && (
        <CommentsModal
          post={post}
          currentUser={currentUser}
          onClose={() => setCommentsModalOpen(false)}
          onPostUpdate={(updated) => onPostUpdate?.(updated)}
        />
      )}
    </article>
  )
}
