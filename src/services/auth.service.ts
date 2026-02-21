import type { User, MiniUser } from '../types/user.types'
import { mockUsers } from '../mocks/data'

const STORAGE_KEY = 'loggedInUser'
const USERS_KEY = 'users'

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

export function getSuggestedUsers(currentUserId: string): MiniUser[] {
  const users = getUsers()
  const currentUser = users.find(u => u._id === currentUserId)
  if (!currentUser) return []

  const followingIds = new Set(currentUser.following.map(u => u._id))
  return users
    .filter(u => u._id !== currentUserId && !followingIds.has(u._id))
    .map(u => ({ _id: u._id, username: u.username, fullname: u.fullname, imgUrl: u.imgUrl }))
}
