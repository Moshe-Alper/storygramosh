import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid3X3, Bookmark, Heart } from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import { getUserByUsername, toggleFollow } from '../services/auth.service'
import { getUserPosts } from '../services/feed.service'
import type { User } from '../types/user.types'
import type { Post } from '../types/post.types'

type Tab = 'posts' | 'saved' | 'liked'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const currentUser = useAuthStore(s => s.user)
  const refreshUser = useAuthStore(s => s.refreshUser)
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('posts')
  const [hoveringFollow, setHoveringFollow] = useState(false)

  const isFollowing = currentUser?.following.some(u => u._id === profileUser?._id) ?? false

  function onToggleFollow() {
    if (!currentUser || !profileUser) return
    toggleFollow(currentUser._id, profileUser._id)
    refreshUser()
    const updated = getUserByUsername(profileUser.username)
    if (updated) setProfileUser(updated)
  }

  useEffect(() => {
    if (!username) return
    const found = getUserByUsername(username)
    if (found) {
      setProfileUser(found)
      setPosts(getUserPosts(found._id))
    }
  }, [username])

  if (!profileUser) {
    return <div className="profile-not-found">User not found</div>
  }

  const isOwnProfile = currentUser?._id === profileUser._id

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">
          <img src={profileUser.imgUrl} alt={profileUser.username} className="avatar avatar-xl" />
        </div>
        <div className="profile-info">
          <div className="profile-top-row">
            <h2 className="profile-username">{profileUser.username}</h2>
            {isOwnProfile ? (
              <button className="btn-edit-profile" type="button">Edit profile</button>
            ) : isFollowing ? (
              <button
                className="btn-following"
                type="button"
                onClick={onToggleFollow}
                onMouseEnter={() => setHoveringFollow(true)}
                onMouseLeave={() => setHoveringFollow(false)}
              >
                {hoveringFollow ? 'Unfollow' : 'Following'}
              </button>
            ) : (
              <button className="btn-follow" type="button" onClick={onToggleFollow}>Follow</button>
            )}
          </div>
          <div className="profile-stats">
            <span><strong>{profileUser.postsCount}</strong> posts</span>
            <span><strong>{profileUser.followersCount.toLocaleString()}</strong> followers</span>
            <span><strong>{profileUser.followingCount}</strong> following</span>
          </div>
          <div className="profile-bio">
            <span className="profile-fullname">{profileUser.fullname}</span>
            {profileUser.bio && <p>{profileUser.bio}</p>}
            {profileUser.website && (
              <a href={`https://${profileUser.website}`} className="profile-website" target="_blank" rel="noopener noreferrer">
                {profileUser.website}
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
          type="button"
        >
          <Grid3X3 size={12} />
          <span>Posts</span>
        </button>
        {isOwnProfile && (
          <>
            <button
              className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
              type="button"
            >
              <Bookmark size={12} />
              <span>Saved</span>
            </button>
            <button
              className={`profile-tab ${activeTab === 'liked' ? 'active' : ''}`}
              onClick={() => setActiveTab('liked')}
              type="button"
            >
              <Heart size={12} />
              <span>Liked</span>
            </button>
          </>
        )}
      </div>

      <div className="profile-grid">
        {activeTab === 'posts' && posts.map(post => (
          <div key={post._id} className="profile-grid-item">
            <img src={post.imgUrl} alt={post.caption ?? 'Post'} loading="lazy" />
            <div className="grid-item-overlay">
              <span><Heart size={16} fill="white" /> {post.likes.count}</span>
              <span><MessageIcon /> {post.comments.count}</span>
            </div>
          </div>
        ))}
        {activeTab !== 'posts' && (
          <div className="profile-empty">
            <p>No {activeTab} posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
