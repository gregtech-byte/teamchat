import { useState } from 'react'
import { Hash, ChevronDown, Plus, LogOut, Sun, Moon, Lock } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import CreateChannelModal from './CreateChannelModal'
import StatusPicker from './StatusPicker'

export default function Sidebar() {
  const { channels, activeChannelId, setActiveChannelId, unreadCounts, members } = useChat()
  const { currentUser, logOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showCreate, setShowCreate] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [channelsOpen, setChannelsOpen] = useState(true)

  const currentMember = members.find(m => m.uid === currentUser?.uid)

  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-yellow-400',
    busy: 'bg-red-500',
    offline: 'bg-gray-500',
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar flex flex-col h-full border-r border-border">
      {/* Workspace header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <img src="/logo.png" alt="Greg Tech" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-primary text-sm truncate">Greg Tech</h1>
          <p className="text-xs text-green-500 font-medium">● All systems go</p>
        </div>
        <button onClick={toggleTheme} className="text-muted hover:text-primary transition-colors flex-shrink-0" title="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Channels */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        <div className="flex items-center justify-between px-3 py-1.5 group">
          <button
            onClick={() => setChannelsOpen(v => !v)}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-primary transition-colors"
          >
            <ChevronDown size={12} className={`transition-transform ${channelsOpen ? '' : '-rotate-90'}`} />
            Channels
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-primary"
            title="Create channel"
          >
            <Plus size={14} />
          </button>
        </div>

        {channelsOpen && (
          <div className="space-y-0.5 mt-1">
            {channels.map(ch => {
              const unread = unreadCounts[ch.id] ?? 0
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md mx-1 text-sm transition-colors ${
                    activeChannelId === ch.id
                      ? 'bg-active text-primary font-medium'
                      : unread > 0
                      ? 'text-primary hover:bg-hover'
                      : 'text-muted hover:bg-hover hover:text-primary'
                  }`}
                >
                  {ch.isPrivate ? <Lock size={13} className="flex-shrink-0 text-muted" /> : <Hash size={13} className="flex-shrink-0 text-muted" />}
                  <span className="flex-1 truncate text-left">{ch.name}</span>
                  {unread > 0 && (
                    <span className="flex-shrink-0 bg-indigo-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </nav>

      {/* User footer */}
      {currentUser && (
        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowStatus(true)} className="relative flex-shrink-0">
              <img
                src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(currentUser.displayName)}`}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full bg-gray-700"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${statusColors[currentMember?.status ?? 'online']} ring-2 ring-sidebar`} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">{currentUser.displayName}</p>
              <p className="text-xs text-muted truncate">{currentMember?.statusMessage || currentMember?.status || 'online'}</p>
            </div>
            <button onClick={logOut} title="Sign out" className="text-muted hover:text-red-400 transition-colors flex-shrink-0">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      )}

      {showCreate && <CreateChannelModal onClose={() => setShowCreate(false)} />}
      {showStatus && <StatusPicker onClose={() => setShowStatus(false)} />}
    </aside>
  )
}
