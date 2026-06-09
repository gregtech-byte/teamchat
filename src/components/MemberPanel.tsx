import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'

const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-400',
  busy: 'bg-red-500',
  offline: 'bg-gray-500',
}

const statusLabels: Record<string, string> = {
  online: 'Online',
  away: 'Away',
  busy: 'Do not disturb',
  offline: 'Offline',
}

export default function MemberPanel() {
  const { members } = useChat()
  const { currentUser } = useAuth()

  const online = members.filter(m => m.status !== 'offline')
  const offline = members.filter(m => m.status === 'offline')

  return (
    <div className="w-56 flex-shrink-0 bg-sidebar border-l border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Members — {members.length}</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {online.length > 0 && (
          <div className="mb-3">
            <p className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider">Online — {online.length}</p>
            {online.map(u => (
              <div key={u.uid} className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-hover rounded mx-1 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full bg-gray-700" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${statusColors[u.status]} ring-2 ring-sidebar`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-primary truncate">
                    {u.name}
                    {u.uid === currentUser?.uid && <span className="text-xs text-muted ml-1">(you)</span>}
                  </p>
                  <p className="text-xs text-muted truncate">{u.statusMessage || statusLabels[u.status]}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {offline.length > 0 && (
          <div>
            <p className="px-4 py-1 text-xs font-semibold text-muted uppercase tracking-wider">Offline — {offline.length}</p>
            {offline.map(u => (
              <div key={u.uid} className="flex items-center gap-2.5 px-4 py-1.5 hover:bg-hover rounded mx-1 cursor-pointer opacity-50">
                <div className="relative flex-shrink-0">
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full bg-gray-700" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gray-500 ring-2 ring-sidebar" />
                </div>
                <p className="text-sm text-primary truncate">{u.name}</p>
              </div>
            ))}
          </div>
        )}
        {members.length === 0 && <p className="text-xs text-muted px-4 py-2">No members yet</p>}
      </div>
    </div>
  )
}
