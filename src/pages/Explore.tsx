import { useState, useEffect } from 'react'
import { getPosts } from '../services/feed.service'
import { seedPostsIfNeeded } from '../services/feed.service'
import { Heart } from 'lucide-react'
import type { Post } from '../types/post.types'

export function Explore() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    seedPostsIfNeeded()
    const allPosts = getPosts()
    setPosts(allPosts.sort(() => Math.random() - 0.5))
  }, [])

  return (
    <div className="explore-page">
      <div className="explore-grid">
        {posts.map(post => (
          <div key={post._id} className="explore-grid-item">
            <img src={post.imgUrl} alt={post.caption ?? 'Post'} loading="lazy" />
            <div className="grid-item-overlay">
              <span><Heart size={16} fill="white" /> {post.likes.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
