import { Reply, Pencil, Trash2, Check, X } from 'lucide-react'
import { Reply, Pencil, Trash2, Check, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useChat, type Message } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🔥', '✅', '👀']

function formatTime(timestamp: any) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatRelative(timestamp: any) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  try {
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return formatTime(timestamp)
  }
}

function isSameDay(a: any, b: any) {
  if (!a || !b) return false
  const da = a.toDate ? a.toDate() : new Date(a)
  const db = b.toDate ? b.toDate() : new Date(b)
  return da.toDateString() === db.toDateString()
}

function formatDate(timestamp: any) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

interface Props {
  message: Message
  prevMessage?: Message
}

export default function MessageBubble({ message, prevMessage }: Props) {
  const { addReaction, editMessage, deleteMessage } = useChat()
  const { currentUser } = useAuth()
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(message.content)
  const [showMenu, setShowMenu] = useState(false)

  const isOwn = message.authorId === currentUser?.uid
  const showAvatar = !prevMessage || prevMessage.authorId !== message.authorId || !isSameDay(prevMessage.timestamp, message.timestamp)
  const showDateDivider = !prevMessage || !isSameDay(prevMessage.timestamp, message.timestamp)

  async function handleEditSave() {
    await editMessage(message.id, editValue)
    setEditing(false)
  }

  async function handleDelete() {
    if (confirm('Delete this message?')) await deleteMessage(message.id)
    setShowMenu(false)
  }

  return (
    <>
      {showDateDivider && message.timestamp && (
        <div className="flex items-center gap-3 my-4 px-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted font-medium px-2">{formatDate(message.timestamp)}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      <div
        className={`group flex gap-3 px-4 py-0.5 hover:bg-hover rounded transition-colors relative ${showAvatar ? 'mt-3' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setShowMenu(false) }}
      >
        {/* Avatar */}
        <div className="w-9 flex-shrink-0 mt-0.5">
          {showAvatar ? (
            <img src={message.authorAvatar} alt={message.authorName} className="w-9 h-9 rounded-full bg-gray-700" />
          ) : (
            <span className="text-xs text-muted leading-6 hidden group-hover:block text-right">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {showAvatar && (
            <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
              <span className={`text-sm font-semibold ${isOwn ? 'text-indigo-400' : 'text-primary'}`}>
                {message.authorName}
                {isOwn && <span className="text-xs font-normal text-muted ml-1">(you)</span>}
              </span>
              <span className="text-xs text-muted" title={formatTime(message.timestamp)}>
                {formatRelative(message.timestamp)}
              </span>
              {message.edited && <span className="text-xs text-muted italic">(edited)</span>}
            </div>
          )}

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                autoFocus
                rows={2}
                className="w-full bg-input border border-indigo-500 rounded-lg px-3 py-2 text-sm text-primary resize-none outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleEditSave} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
                  <Check size={12} /> Save
                </button>
                <button onClick={() => { setEditing(false); setEditValue(message.content) }} className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-lg">
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-secondary leading-relaxed break-words">{message.content}</p>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {message.reactions.map(r => {
                const reacted = r.userIds.includes(currentUser?.uid ?? '')
                return (
                  <button
                    key={r.emoji}
                    onClick={() => addReaction(message.id, r.emoji)}
                    className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      reacted ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-hover border-border text-secondary hover:border-gray-400'
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span>{r.count}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Hover toolbar */}
        {hovered && !editing && (
          <div className="absolute right-4 -top-3 flex items-center gap-0.5 bg-sidebar border border-border rounded-lg shadow-lg px-1 py-0.5 z-10">
            {QUICK_EMOJIS.map(emoji => (
              <button key={emoji} onClick={() => addReaction(message.id, emoji)} className="text-sm hover:scale-125 transition-transform p-0.5">
                {emoji}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-0.5" />
            {isOwn && (
              <button onClick={() => setEditing(true)} className="p-1 text-muted hover:text-primary transition-colors rounded" title="Edit">
                <Pencil size={13} />
              </button>
            )}
            {isOwn && (
              <button onClick={handleDelete} className="p-1 text-muted hover:text-red-400 transition-colors rounded" title="Delete">
                <Trash2 size={13} />
              </button>
            )}
            <button className="p-1 text-muted hover:text-primary transition-colors rounded">
              <Reply size={13} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
