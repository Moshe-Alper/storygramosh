import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import { getUserById, toggleFollow } from '../services/auth.service'
import {
  getGroupedNotifications,
  markAllAsRead,
} from '../services/notification.service'
import { timeAgo } from '../services/util.service'
import type { GroupedNotification } from '../types/notification.types'

function FollowBackButton({ currentUserId, targetUserId, onToggle }: {
  currentUserId: string
  targetUserId: string
  onToggle: (targetUserId: string) => void
}) {
  const currentUser = getUserById(currentUserId)
  const isFollowing = currentUser?.following.some(u => u._id === targetUserId) ?? false

  return (
    <button
      className={`notification-follow-btn${isFollowing ? ' following' : ''}`}
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle(targetUserId)
      }}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

export function Notifications() {
  const user = useAuthStore(s => s.user)
  const refreshUser = useAuthStore(s => s.refreshUser)
  const navigate = useNavigate()
  const [groups, setGroups] = useState<GroupedNotification[]>([])

  useEffect(() => {
    if (!user) return
    setGroups(getGroupedNotifications(user._id))
    markAllAsRead(user._id)
  }, [user])

  function onNotificationClick(group: GroupedNotification) {
    if (group.type === 'follow') {
      navigate(`/${group.users[0].username}`)
    } else if (group.postId) {
      navigate(`/p/${group.postId}`)
    }
  }

  function onFollowBack(targetUserId: string) {
    if (!user) return
    toggleFollow(user._id, targetUserId)
    refreshUser()
    setGroups(getGroupedNotifications(user._id))
  }

  return (
    <div className="notifications-page">
      <header className="notifications-page-header">
        <h1>Notifications</h1>
      </header>

      <ul className="notifications-list">
        {groups.map(group => (
          <li key={group.ids.join('-')} className="notification-item">
            <button
              className="notification-row"
              type="button"
              onClick={() => onNotificationClick(group)}
            >
              <img
                src={group.users[0].imgUrl}
                alt={group.users[0].username}
                className="avatar avatar-md"
              />
              <div className="notification-body">
                <p>
                  <span className="notification-username">{group.users[0].username}</span>
                  {group.users.length > 1 && (
                    <span> and {group.users.length - 1} other{group.users.length > 2 ? 's' : ''}</span>
                  )}
                  {group.type === 'like' && ' liked your post'}
                  {group.type === 'comment' && ' commented: '}
                  {group.type === 'follow' && ' started following you'}
                </p>
                {group.type === 'comment' && group.commentTxt && (
                  <span className="notification-comment-preview">
                    {group.commentTxt.length > 50
                      ? group.commentTxt.slice(0, 50) + '…'
                      : group.commentTxt}
                  </span>
                )}
                <span className="notification-time">{timeAgo(group.latestAt)}</span>
              </div>
            </button>

            {group.postImgUrl && (
              <img
                src={group.postImgUrl}
                alt="Post"
                className="notification-post-thumb"
              />
            )}

            {group.type === 'follow' && user && (
              <FollowBackButton
                currentUserId={user._id}
                targetUserId={group.users[0]._id}
                onToggle={onFollowBack}
              />
            )}
          </li>
        ))}
        {groups.length === 0 && (
          <li className="notifications-empty">
            <Heart size={48} strokeWidth={1} />
            <p>Activity on your posts</p>
            <span>When someone likes or comments on your posts, or follows you, you'll see it here.</span>
          </li>
        )}
      </ul>
    </div>
  )
}
