import type { MiniUser } from './user.types'

export interface Story {
  _id: string
  imgUrl: string
  txt?: string
  by: MiniUser
  createdAt: string
  viewedBy?: string[]
  expiresAt?: string
}
