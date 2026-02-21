import type { Notification, NotificationType, GroupedNotification } from '../types/notification.types'
import { makeId } from './util.service'
import { getUsers } from './auth.service'
import { getPosts } from './feed.service'

const NOTIFICATIONS_KEY = 'notifications'

export function getNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* restricted storage */ }
  return []
}

function _saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  } catch { /* restricted storage */ }
}

export function addNotification(notification: Omit<Notification, '_id' | 'createdAt' | 'isRead'>): Notification {
  const notifications = getNotifications()
  const newNotif: Notification = {
    ...notification,
    _id: `n${makeId(6)}`,
    createdAt: new Date().toISOString(),
    isRead: false,
  }
  notifications.unshift(newNotif)
  _saveNotifications(notifications)
  return newNotif
}

export function removeNotification(type: NotificationType, byUserId: string, postId?: string): void {
  const notifications = getNotifications()
  const filtered = notifications.filter(n => {
    if (n.type !== type || n.by._id !== byUserId) return true
    if (type === 'follow') return false
    return n.postId !== postId
  })
  _saveNotifications(filtered)
}

export function getGroupedNotifications(userId: string): GroupedNotification[] {
  const notifications = getNotifications()
    .filter(n => n.targetUserId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const groups: GroupedNotification[] = []
  const groupMap = new Map<string, GroupedNotification>()

  for (const n of notifications) {
    if (n.type === 'follow') {
      groups.push({
        type: 'follow',
        users: [n.by],
        latestAt: n.createdAt,
        isRead: n.isRead,
        ids: [n._id],
      })
      continue
    }

    const key = `${n.type}-${n.postId}`

    const existing = groupMap.get(key)
    if (existing) {
      if (!existing.users.some(u => u._id === n.by._id)) {
        existing.users.push(n.by)
      }
      existing.ids.push(n._id)
      if (!n.isRead) existing.isRead = false
    } else {
      const group: GroupedNotification = {
        type: n.type,
        postId: n.postId,
        postImgUrl: n.postImgUrl,
        commentTxt: n.commentTxt,
        users: [n.by],
        latestAt: n.createdAt,
        isRead: n.isRead,
        ids: [n._id],
      }
      groupMap.set(key, group)
      groups.push(group)
    }
  }

  return groups
}

export function markAllAsRead(userId: string): void {
  const notifications = getNotifications()
  let changed = false
  for (const n of notifications) {
    if (n.targetUserId === userId && !n.isRead) {
      n.isRead = true
      changed = true
    }
  }
  if (changed) _saveNotifications(notifications)
}

export function hasUnread(userId: string): boolean {
  return getNotifications().some(n => n.targetUserId === userId && !n.isRead)
}

export function seedNotificationsIfNeeded(targetUserId: string): void {
  const existing = getNotifications()
  if (existing.length > 0) return

  const users = getUsers()
  const posts = getPosts().filter(p => p.by._id === targetUserId)
  const otherUsers = users.filter(u => u._id !== targetUserId)

  if (otherUsers.length === 0 || posts.length === 0) return

  const seed: Notification[] = []
  const now = Date.now()

  for (let i = 0; i < Math.min(3, posts.length); i++) {
    const post = posts[i]
    for (let j = 0; j < Math.min(2, otherUsers.length); j++) {
      seed.push({
        _id: `n${makeId(6)}`,
        type: 'like',
        by: { _id: otherUsers[j]._id, username: otherUsers[j].username, fullname: otherUsers[j].fullname, imgUrl: otherUsers[j].imgUrl },
        targetUserId,
        postId: post._id,
        postImgUrl: post.imgUrl,
        createdAt: new Date(now - (i * 2 + j) * 3600000).toISOString(),
        isRead: false,
      })
    }
  }

  if (posts.length > 0 && otherUsers.length > 0) {
    seed.push({
      _id: `n${makeId(6)}`,
      type: 'comment',
      by: { _id: otherUsers[0]._id, username: otherUsers[0].username, fullname: otherUsers[0].fullname, imgUrl: otherUsers[0].imgUrl },
      targetUserId,
      postId: posts[0]._id,
      postImgUrl: posts[0].imgUrl,
      commentTxt: 'This is amazing! 🔥',
      createdAt: new Date(now - 1800000).toISOString(),
      isRead: false,
    })
  }

  for (let i = 0; i < Math.min(2, otherUsers.length); i++) {
    seed.push({
      _id: `n${makeId(6)}`,
      type: 'follow',
      by: { _id: otherUsers[i]._id, username: otherUsers[i].username, fullname: otherUsers[i].fullname, imgUrl: otherUsers[i].imgUrl },
      targetUserId,
      createdAt: new Date(now - (i + 1) * 7200000).toISOString(),
      isRead: false,
    })
  }

  _saveNotifications(seed)
}
