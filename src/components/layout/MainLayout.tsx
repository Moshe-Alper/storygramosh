import { useState, useCallback, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { LeftSidebar } from './LeftSidebar'
import { BottomNav } from './BottomNav'
import { CreatePostModal } from '../ui/CreatePostModal'
import { SearchPanel } from '../ui/SearchPanel'
import { NotificationsPanel } from '../ui/NotificationsPanel'
import { hasUnread } from '../../services/notification.service'
import type { Post } from '../../types/post.types'

export interface OutletContext {
  registerPostCreated: (cb: (post: Post) => void) => void
}

export function MainLayout() {
  const user = useAuthStore(s => s.user)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false)
  const postCreatedRef = useRef<((post: Post) => void) | null>(null)

  useEffect(() => {
    if (user) setHasUnreadNotifs(hasUnread(user._id))
  }, [user])

  function onOpenNotifications() {
    setSearchOpen(false)
    setNotificationsOpen(true)
    setHasUnreadNotifs(false)
  }

  function onCloseNotifications() {
    setNotificationsOpen(false)
  }

  function onOpenSearch() {
    setNotificationsOpen(false)
    setSearchOpen(true)
  }

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
    <div className={`app-layout${searchOpen || notificationsOpen ? ' search-open' : ''}`}>
      <LeftSidebar
        onCreateClick={() => setCreateModalOpen(true)}
        onSearchClick={onOpenSearch}
        searchOpen={searchOpen}
        onNotificationsClick={onOpenNotifications}
        notificationsOpen={notificationsOpen}
        hasUnreadNotifications={hasUnreadNotifs}
      />
      <main className="main-content">
        <Outlet context={{ registerPostCreated } satisfies OutletContext} />
      </main>
      <BottomNav onCreateClick={() => setCreateModalOpen(true)} />
      {searchOpen && (
        <>
          <SearchPanel onClose={() => setSearchOpen(false)} />
          <div className="search-backdrop" onClick={() => setSearchOpen(false)} />
        </>
      )}
      {notificationsOpen && (
        <>
          <NotificationsPanel onClose={onCloseNotifications} />
          <div className="notifications-backdrop" onClick={onCloseNotifications} />
        </>
      )}
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
