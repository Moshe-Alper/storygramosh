import { NavLink } from 'react-router-dom'
import { Home, Search, Compass, Heart, PlusSquare, Menu } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { ThemeToggle } from '../ThemeToggle'

interface Props {
  onCreateClick?: () => void
  onSearchClick?: () => void
  searchOpen?: boolean
}

export function LeftSidebar({ onCreateClick, onSearchClick, searchOpen }: Props) {
  const user = useAuthStore(s => s.user)

  return (
    <aside className="left-sidebar">
      <NavLink to="/" className="sidebar-logo">
        <span className="logo-full">Storygramosh</span>
        <span className="logo-icon">S</span>
      </NavLink>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">
          <Home size={24} />
          <span className="nav-label">Home</span>
        </NavLink>
        <button
          className={`nav-item${searchOpen ? ' active' : ''}`}
          type="button"
          onClick={onSearchClick}
        >
          <Search size={24} />
          <span className="nav-label">Search</span>
        </button>
        <NavLink to="/explore" className="nav-item">
          <Compass size={24} />
          <span className="nav-label">Explore</span>
        </NavLink>
        <button className="nav-item" type="button">
          <Heart size={24} />
          <span className="nav-label">Notifications</span>
        </button>
        <button className="nav-item" type="button" onClick={onCreateClick}>
          <PlusSquare size={24} />
          <span className="nav-label">Create</span>
        </button>
        {user && (
          <NavLink to={`/${user.username}`} className="nav-item">
            <img
              src={user.imgUrl}
              alt={user.username}
              className="nav-avatar"
            />
            <span className="nav-label">Profile</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <button className="nav-item" type="button">
          <Menu size={24} />
          <span className="nav-label">More</span>
        </button>
      </div>
    </aside>
  )
}
