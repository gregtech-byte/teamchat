import { useState } from 'react'
import { X, Hash, Lock } from 'lucide-react'
import { useChat } from '../context/ChatContext'

export default function CreateChannelModal({ onClose }: { onClose: () => void }) {
  const { createChannel } = useChat()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await createChannel(name, description, isPrivate)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-sidebar border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-primary">Create a channel</h2>
          <button onClick={onClose} className="text-muted hover:text-primary transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Channel name</label>
            <div className="relative">
              <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. marketing"
                className="w-full bg-input border border-border rounded-lg pl-8 pr-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Description <span className="text-muted font-normal">(optional)</span></label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-muted" />
              <div>
                <p className="text-sm font-medium text-primary">Private channel</p>
                <p className="text-xs text-muted">Only invited members can join</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(v => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative ${isPrivate ? 'bg-indigo-600' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-sm text-secondary hover:bg-hover transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
