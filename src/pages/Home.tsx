import { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { getHomeFeed } from '../services/feed.service'
import { getHomeStories } from '../services/story.service'
import { seedPostsIfNeeded } from '../services/feed.service'
import { seedStoriesIfNeeded } from '../services/story.service'
import { PostCard } from '../components/ui/PostCard'
import { StoriesRow } from '../components/ui/StoriesRow'
import { StoryViewer } from '../components/ui/StoryViewer'
import { RightSidebar } from '../components/layout/RightSidebar'
import type { Post } from '../types/post.types'
import type { Story } from '../types/story.types'
import type { MiniUser } from '../types/user.types'
import type { OutletContext } from '../components/layout/MainLayout'

export function Home() {
  const user = useAuthStore(s => s.user)
  const { registerPostCreated } = useOutletContext<OutletContext>()
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [storyViewer, setStoryViewer] = useState<{
    open: boolean
    initialUserIndex: number
    userOrder: MiniUser[]
  }>({ open: false, initialUserIndex: 0, userOrder: [] })

  useEffect(() => {
    if (!user) return
    seedPostsIfNeeded()
    seedStoriesIfNeeded()
    const followingIds = user.following.map(u => u._id)
    setPosts(getHomeFeed(followingIds))
    setStories(getHomeStories(followingIds, user._id))
  }, [user])

  useEffect(() => {
    registerPostCreated((post: Post) => {
      setPosts(prev => [post, ...prev])
    })
  }, [registerPostCreated])

  const onPostUpdate = useCallback((updated: Post) => {
    setPosts(prev => prev.map(p => p._id === updated._id ? updated : p))
  }, [])

  const handleStoryClick = useCallback((userIndex: number, userOrder: MiniUser[]) => {
    setStoryViewer({ open: true, initialUserIndex: userIndex, userOrder })
  }, [])

  const handleStoryViewerClose = useCallback(() => {
    setStoryViewer(prev => ({ ...prev, open: false }))
    if (!user) return
    const followingIds = user.following.map(u => u._id)
    setStories(getHomeStories(followingIds, user._id))
  }, [user])

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
        <StoriesRow
          stories={stories}
          currentUserId={user._id}
          onStoryClick={handleStoryClick}
        />
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
      {storyViewer.open && (
        <StoryViewer
          stories={stories}
          initialUserIndex={storyViewer.initialUserIndex}
          userOrder={storyViewer.userOrder}
          currentUserId={user._id}
          onClose={handleStoryViewerClose}
        />
      )}
    </div>
  )
}
