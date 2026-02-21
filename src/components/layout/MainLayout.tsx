import { useState, useCallback, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { LeftSidebar } from './LeftSidebar'
import { CreatePostModal } from '../ui/CreatePostModal'
import type { Post } from '../../types/post.types'

export interface OutletContext {
  registerPostCreated: (cb: (post: Post) => void) => void
}

export function MainLayout() {
  const user = useAuthStore(s => s.user)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const postCreatedRef = useRef<((post: Post) => void) | null>(null)

  const registerPostCreated = useCallback((cb: (post: Post) => void) => {
    postCreatedRef.current = cb
  }, [])

  function handlePostCreated(post: Post) {
    postCreatedRef.current?.(post)
    setCreateModalOpen(false)
  }

  const miniUser = user
    ? { _id: user._id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl }
    : null

  return (
    <div className="app-layout">
      <LeftSidebar onCreateClick={() => setCreateModalOpen(true)} />
      <main className="main-content">
        <Outlet context={{ registerPostCreated } satisfies OutletContext} />
      </main>
      {createModalOpen && miniUser && (
        <CreatePostModal
          currentUser={miniUser}
          onClose={() => setCreateModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  )
}
