import type { MiniUser } from './user.types'

export type NotificationType = 'like' | 'comment' | 'follow'

export interface Notification {
  _id: string
  type: NotificationType
  by: MiniUser
  targetUserId: string
  postId?: string
  postImgUrl?: string
  commentTxt?: string
  createdAt: string
  isRead: boolean
}

export interface GroupedNotification {
  type: NotificationType
  postId?: string
  postImgUrl?: string
  commentTxt?: string
  users: MiniUser[]
  latestAt: string
  isRead: boolean
  ids: string[]
}
