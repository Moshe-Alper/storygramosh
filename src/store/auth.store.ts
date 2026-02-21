import { create } from 'zustand'
import type { User } from '../types/user.types'
import * as authService from '../services/auth.service'

interface AuthState {
  user: User | null
  login: (username: string) => User | null
  logout: () => void
  init: () => void
  refreshUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  init: () => {
    authService.seedUsersIfNeeded()
    let user = authService.getLoggedInUser()
    if (!user) {
      user = authService.login('moshik_dev')
    }
    set({ user })
  },

  login: (username: string) => {
    const user = authService.login(username)
    if (user) set({ user })
    return user
  },

  logout: () => {
    authService.logout()
    set({ user: null })
  },

  refreshUser: () => {
    const user = authService.getLoggedInUser()
    if (user) set({ user })
  },
}))
