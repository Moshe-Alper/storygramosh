export interface MiniUser {
  _id: string
  username: string
  fullname?: string
  imgUrl: string
}

export interface User {
  _id: string
  username: string
  fullname: string
  password?: string
  imgUrl: string
  bio?: string
  website?: string
  followers: MiniUser[]
  following: MiniUser[]
  postsCount: number
  followersCount: number
  followingCount: number
  likedPostIds?: string[]
  savedPostIds?: string[]
}
