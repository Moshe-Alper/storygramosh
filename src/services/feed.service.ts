import type { Post, Comment } from '../types/post.types'
import type { MiniUser } from '../types/user.types'
import { mockPosts } from '../mocks/data'
import { makeId } from './util.service'
import { addNotification, removeNotification } from './notification.service'

const POSTS_KEY = 'posts'

export function getPosts(): Post[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* restricted storage */ }
  return []
}

function _savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  } catch { /* restricted storage */ }
}

export function seedPostsIfNeeded(): void {
  const existing = getPosts()
  if (existing.length > 0) return
  _savePosts(mockPosts)
}

export function getHomeFeed(followingIds: string[]): Post[] {
  const ids = new Set(followingIds)
  return getPosts()
    .filter(post => ids.has(post.by._id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getUserPosts(userId: string): Post[] {
  return getPosts()
    .filter(post => post.by._id === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function toggleLike(postId: string, user: MiniUser): Post | undefined {
  const posts = getPosts()
  const post = posts.find(p => p._id === postId)
  if (!post) return undefined

  const idx = post.likes.likedBy.findIndex(u => u._id === user._id)
  if (idx >= 0) {
    post.likes.likedBy.splice(idx, 1)
    post.likes.count--
    removeNotification('like', user._id, postId)
  } else {
    post.likes.likedBy.push(user)
    post.likes.count++
    if (post.by._id !== user._id) {
      addNotification({
        type: 'like',
        by: user,
        targetUserId: post.by._id,
        postId: post._id,
        postImgUrl: post.imgUrl,
      })
    }
  }
  _savePosts(posts)
  return post
}

export function addComment(postId: string, txt: string, by: MiniUser): Comment | undefined {
  const posts = getPosts()
  const post = posts.find(p => p._id === postId)
  if (!post) return undefined

  const comment: Comment = {
    _id: `c${makeId(6)}`,
    txt,
    by,
    createdAt: new Date().toISOString(),
  }
  post.comments.list.push(comment)
  post.comments.count++

  if (post.by._id !== by._id) {
    addNotification({
      type: 'comment',
      by,
      targetUserId: post.by._id,
      postId: post._id,
      postImgUrl: post.imgUrl,
      commentTxt: txt,
    })
  }

  _savePosts(posts)
  return comment
}

export function toggleSave(postId: string, userId: string): boolean {
  const posts = getPosts()
  const post = posts.find(p => p._id === postId)
  if (!post) return false

  if (!post.savedBy) post.savedBy = []
  const idx = post.savedBy.indexOf(userId)
  if (idx >= 0) {
    post.savedBy.splice(idx, 1)
  } else {
    post.savedBy.push(userId)
  }
  _savePosts(posts)
  return post.savedBy.includes(userId)
}

export function getSavedPosts(userId: string): Post[] {
  return getPosts()
    .filter(post => post.savedBy?.includes(userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getLikedPosts(userId: string): Post[] {
  return getPosts()
    .filter(post => post.likes.likedBy.some(u => u._id === userId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function toggleCommentLike(postId: string, commentId: string, user: MiniUser): Post | undefined {
  const posts = getPosts()
  const post = posts.find(p => p._id === postId)
  if (!post) return undefined

  const comment = post.comments.list.find(c => c._id === commentId)
  if (!comment) return undefined

  if (!comment.likedBy) comment.likedBy = []
  const idx = comment.likedBy.findIndex(u => u._id === user._id)
  if (idx >= 0) {
    comment.likedBy.splice(idx, 1)
  } else {
    comment.likedBy.push(user)
  }
  _savePosts(posts)
  return post
}

export function deleteComment(postId: string, commentId: string): Post | undefined {
  const posts = getPosts()
  const post = posts.find(p => p._id === postId)
  if (!post) return undefined

  const idx = post.comments.list.findIndex(c => c._id === commentId)
  if (idx < 0) return undefined

  post.comments.list.splice(idx, 1)
  post.comments.count--
  _savePosts(posts)
  return post
}

export function createPost(post: Omit<Post, '_id'>): Post {
  const posts = getPosts()
  const newPost: Post = { ...post, _id: `p${makeId(6)}` }
  posts.unshift(newPost)
  _savePosts(posts)
  return newPost
}
