import type { User, MiniUser } from '../types/user.types'
import { mockUsers } from '../mocks/data'
import { addNotification, removeNotification } from './notification.service'

const STORAGE_KEY = 'loggedInUser'
const USERS_KEY = 'users'
const RECENT_SEARCHES_KEY = 'recentSearches'
const MAX_RECENT = 10

export function getUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* restricted storage */ }
  return []
}

function _saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch { /* restricted storage */ }
}

export function seedUsersIfNeeded(): void {
  const existing = getUsers()
  if (existing.length > 0) return
  _saveUsers(mockUsers)
}

export function getLoggedInUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* restricted storage */ }
  return null
}

export function login(username: string, _password?: string): User | null {
  const users = getUsers()
  const user = users.find(u => u.username === username)
  if (!user) return null

  void _password
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch { /* restricted storage */ }
  return user
}

export function logout(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* restricted storage */ }
}

export function getUserById(userId: string): User | undefined {
  return getUsers().find(u => u._id === userId)
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username)
}

export function toggleFollow(
  currentUserId: string,
  targetUserId: string
): { currentUser: User; targetUser: User } | undefined {
  if (currentUserId === targetUserId) return undefined

  const users = getUsers()
  const currentUser = users.find(u => u._id === currentUserId)
  const targetUser = users.find(u => u._id === targetUserId)
  if (!currentUser || !targetUser) return undefined

  const alreadyFollowing = currentUser.following.some(u => u._id === targetUserId)

  if (alreadyFollowing) {
    currentUser.following = currentUser.following.filter(u => u._id !== targetUserId)
    currentUser.followingCount--
    targetUser.followers = targetUser.followers.filter(u => u._id !== currentUserId)
    targetUser.followersCount--
    removeNotification('follow', currentUserId)
  } else {
    currentUser.following.push({
      _id: targetUser._id,
      username: targetUser.username,
      fullname: targetUser.fullname,
      imgUrl: targetUser.imgUrl,
    })
    currentUser.followingCount++
    targetUser.followers.push({
      _id: currentUser._id,
      username: currentUser.username,
      fullname: currentUser.fullname,
      imgUrl: currentUser.imgUrl,
    })
    targetUser.followersCount++
    addNotification({
      type: 'follow',
      by: {
        _id: currentUser._id,
        username: currentUser.username,
        fullname: currentUser.fullname,
        imgUrl: currentUser.imgUrl,
      },
      targetUserId,
    })
  }

  _saveUsers(users)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser))
  } catch { /* restricted storage */ }

  return { currentUser, targetUser }
}

export function searchUsers(query: string): MiniUser[] {
  if (!query.trim()) return []

  const term = query.toLowerCase()
  return getUsers()
    .filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.fullname.toLowerCase().includes(term)
    )
    .map(u => ({ _id: u._id, username: u.username, fullname: u.fullname, imgUrl: u.imgUrl }))
}

export function getRecentSearches(): MiniUser[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* restricted storage */ }
  return []
}

export function addRecentSearch(user: MiniUser): void {
  const recent = getRecentSearches().filter(u => u._id !== user._id)
  recent.unshift(user)
  if (recent.length > MAX_RECENT) recent.pop()
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent))
  } catch { /* restricted storage */ }
}

export function removeRecentSearch(userId: string): void {
  const recent = getRecentSearches().filter(u => u._id !== userId)
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent))
  } catch { /* restricted storage */ }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch { /* restricted storage */ }
}

export function getSuggestedUsers(currentUserId: string): MiniUser[] {
  const users = getUsers()
  const currentUser = users.find(u => u._id === currentUserId)
  if (!currentUser) return []

  const followingIds = new Set(currentUser.following.map(u => u._id))
  return users
    .filter(u => u._id !== currentUserId && !followingIds.has(u._id))
    .map(u => ({ _id: u._id, username: u.username, fullname: u.fullname, imgUrl: u.imgUrl }))
}
