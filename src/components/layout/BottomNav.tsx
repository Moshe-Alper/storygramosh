import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Search, PlusSquare, Compass } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

interface Props {
  onCreateClick: () => void
}

function useScrollDirection(threshold = 10) {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastScrollY.current) < threshold) return
      setHidden(currentY > lastScrollY.current && currentY > 50)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}

export function BottomNav({ onCreateClick }: Props) {
  const user = useAuthStore(s => s.user)
  const hidden = useScrollDirection()

  return (
    <nav className={`bottom-nav${hidden ? ' hidden' : ''}`}>
      <NavLink to="/" end className="bottom-nav-item">
        {({ isActive }) => <Home size={24} strokeWidth={isActive ? 2.5 : 1.5} />}
      </NavLink>
      <NavLink to="/search" className="bottom-nav-item">
        {({ isActive }) => <Search size={24} strokeWidth={isActive ? 2.5 : 1.5} />}
      </NavLink>
      <button className="bottom-nav-item" type="button" onClick={onCreateClick}>
        <PlusSquare size={24} strokeWidth={1.5} />
      </button>
      <NavLink to="/explore" className="bottom-nav-item">
        {({ isActive }) => <Compass size={24} strokeWidth={isActive ? 2.5 : 1.5} />}
      </NavLink>
      {user && (
        <NavLink to={`/${user.username}`} className="bottom-nav-item">
          {({ isActive }) => (
            <img
              src={user.imgUrl}
              alt={user.username}
              className={`bottom-nav-avatar${isActive ? ' active' : ''}`}
            />
          )}
        </NavLink>
      )}
    </nav>
  )
}
