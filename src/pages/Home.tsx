import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store/auth.store'
import { getHomeFeed } from '../services/feed.service'
import { getHomeStories } from '../services/story.service'
import { seedPostsIfNeeded } from '../services/feed.service'
import { seedStoriesIfNeeded } from '../services/story.service'
import { PostCard } from '../components/ui/PostCard'
import { StoriesRow } from '../components/ui/StoriesRow'
import { RightSidebar } from '../components/layout/RightSidebar'
import type { Post } from '../types/post.types'
import type { Story } from '../types/story.types'

export function Home() {
  const user = useAuthStore(s => s.user)
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    if (!user) return
    seedPostsIfNeeded()
    seedStoriesIfNeeded()
    const followingIds = user.following.map(u => u._id)
    setPosts(getHomeFeed(followingIds))
    setStories(getHomeStories(followingIds, user._id))
  }, [user])

  const onPostUpdate = useCallback((updated: Post) => {
    setPosts(prev => prev.map(p => p._id === updated._id ? updated : p))
  }, [])

  if (!user) return null

  const miniUser = {
    _id: user._id,
    username: user.username,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
  }

  return (
    <div className="home-page">
      <div className="home-feed">
        <StoriesRow stories={stories} currentUserId={user._id} />
        <div className="feed-posts">
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={miniUser}
              onPostUpdate={onPostUpdate}
            />
          ))}
        </div>
      </div>
      <RightSidebar />
    </div>
  )
}
