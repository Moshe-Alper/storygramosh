import type { MiniUser } from './user.types'

export interface Comment {
  _id: string
  txt: string
  by: MiniUser
  createdAt: string
  likedBy?: MiniUser[]
}

export interface Post {
  _id: string
  imgUrl: string
  caption?: string
  by: MiniUser
  createdAt: string
  likes: {
    count: number
    likedBy: MiniUser[]
  }
  comments: {
    count: number
    list: Comment[]
  }
  savedBy?: string[]
  location?: {
    name: string
    lat?: number
    lng?: number
  }
  tags?: string[]
}
