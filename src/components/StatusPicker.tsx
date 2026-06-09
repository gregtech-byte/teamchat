import { useState } from 'react'
import { X } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import type { ChatUser } from '../context/ChatContext'

const STATUSES: { value: ChatUser['status']; label: string; color: string }[] = [
  { value: 'online', label: 'Online', color: 'bg-green-500' },
  { value: 'away', label: 'Away', color: 'bg-yellow-400' },
  { value: 'busy', label: 'Do not disturb', color: 'bg-red-500' },
  { value: 'offline', label: 'Appear offline', color: 'bg-gray-500' },
]

export default function StatusPicker({ onClose }: { onClose: () => void }) {
  const { updateUserStatus } = useChat()
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSelect(status: ChatUser['status']) {
    setLoading(true)
    await updateUserStatus(status, statusMessage)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-sidebar border border-border rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-primary">Set your status</h2>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <input
            type="text"
            value={statusMessage}
            onChange={e => setStatusMessage(e.target.value)}
            placeholder="What's your status message?"
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <div className="space-y-1">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => handleSelect(s.value)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-hover transition-colors text-left"
              >
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${s.color}`} />
                <span className="text-sm text-primary">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
