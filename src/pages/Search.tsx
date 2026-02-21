import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import {
  searchUsers,
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../services/auth.service'
import type { MiniUser } from '../types/user.types'

export function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MiniUser[]>([])
  const [recentSearches, setRecentSearches] = useState<MiniUser[]>([])

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  useEffect(() => {
    setResults(searchUsers(query))
  }, [query])

  function onSelectUser(user: MiniUser) {
    addRecentSearch(user)
    navigate(`/${user.username}`)
  }

  function onRemoveRecent(userId: string) {
    removeRecentSearch(userId)
    setRecentSearches(prev => prev.filter(u => u._id !== userId))
  }

  function onClearAll() {
    clearRecentSearches()
    setRecentSearches([])
  }

  return (
    <div className="search-page">
      <div className="search-panel-input-wrapper">
        <SearchIcon size={16} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="search-clear-btn" type="button" onClick={() => setQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      <div className="search-panel-divider" />

      {query ? (
        <ul className="search-results">
          {results.map(user => (
            <li key={user._id}>
              <button className="search-result-row" type="button" onClick={() => onSelectUser(user)}>
                <img src={user.imgUrl} alt={user.username} className="avatar avatar-md" />
                <div>
                  <span className="username">{user.username}</span>
                  <span className="fullname">{user.fullname}</span>
                </div>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="search-no-results">No results found.</li>}
        </ul>
      ) : (
        <div className="search-recent">
          <div className="search-recent-header">
            <span>Recent</span>
            {recentSearches.length > 0 && (
              <button type="button" onClick={onClearAll}>Clear all</button>
            )}
          </div>
          <ul className="search-results">
            {recentSearches.map(user => (
              <li key={user._id}>
                <button className="search-result-row" type="button" onClick={() => onSelectUser(user)}>
                  <img src={user.imgUrl} alt={user.username} className="avatar avatar-md" />
                  <div>
                    <span className="username">{user.username}</span>
                    <span className="fullname">{user.fullname}</span>
                  </div>
                </button>
                <button
                  className="search-remove-btn"
                  type="button"
                  onClick={() => onRemoveRecent(user._id)}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
            {recentSearches.length === 0 && (
              <li className="search-no-results">No recent searches.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
