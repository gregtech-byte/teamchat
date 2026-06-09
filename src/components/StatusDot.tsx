import type { UserStatus } from '../types'

const colors: Record<UserStatus, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-400',
  busy: 'bg-red-500',
  offline: 'bg-gray-500',
}

export default function StatusDot({
  status,
  className = '',
}: {
  status: UserStatus
  className?: string
}) {
  return (
    <span
      className={`inline-block rounded-full ${colors[status]} ${className}`}
    />
  )
}
