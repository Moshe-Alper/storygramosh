import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { getSuggestedUsers, toggleFollow } from '../../services/auth.service'

export function RightSidebar() {
  const user = useAuthStore(s => s.user)
  const refreshUser = useAuthStore(s => s.refreshUser)
  if (!user) return null

  const suggested = getSuggestedUsers(user._id)

  return (
    <aside className="right-sidebar">
      <div className="sidebar-user">
        <Link to={`/${user.username}`} className="sidebar-user-info">
          <img src={user.imgUrl} alt={user.username} className="avatar avatar-md" />
          <div>
            <span className="username">{user.username}</span>
            <span className="fullname">{user.fullname}</span>
          </div>
        </Link>
      </div>

      {suggested.length > 0 && (
        <div className="suggestions">
          <div className="suggestions-header">
            <span className="suggestions-title">Suggested for you</span>
          </div>
          <ul className="suggestions-list">
            {suggested.map(s => (
              <li key={s._id} className="suggestion-item">
                <Link to={`/${s.username}`} className="suggestion-user">
                  <img src={s.imgUrl} alt={s.username} className="avatar avatar-sm" />
                  <div>
                    <span className="username">{s.username}</span>
                    <span className="fullname">{s.fullname}</span>
                  </div>
                </Link>
                <button
                  className="btn-follow"
                  type="button"
                  onClick={() => {
                    toggleFollow(user._id, s._id)
                    refreshUser()
                  }}
                >Follow</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="sidebar-credits">
        <p>© 2026 Storygramosh</p>
      </footer>
    </aside>
  )
}
