import type { User } from '../types'
import StatusDot from './StatusDot'

interface AvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
}

const sizes = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-11 h-11',
}

const dotSizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
}

export default function Avatar({ user, size = 'md', showStatus = false }: AvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizes[size]} rounded-full bg-gray-700 object-cover`}
      />
      {showStatus && (
        <StatusDot
          status={user.status}
          className={`${dotSizes[size]} absolute -bottom-0.5 -right-0.5 ring-2 ring-gray-800`}
        />
      )}
    </div>
  )
}
