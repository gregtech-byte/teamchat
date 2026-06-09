import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Paperclip, Smile, Send } from 'lucide-react'
import { useChat } from '../context/ChatContext'

export default function MessageInput({ placeholder }: { placeholder: string }) {
  const { sendMessage, setTyping } = useChat()
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Notification sound
  const audioRef = useRef<HTMLAudioElement | null>(null)
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3')
    audioRef.current.volume = 0.3
  }, [])

  async function handleSend() {
    if (!value.trim() || sending) return
    setSending(true)
    await sendMessage(value)
    setValue('')
    setSending(false)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    setTyping(e.target.value.length > 0)
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 160) + 'px' }
  }

  return (
    <div className="px-4 pb-4">
      <div className="bg-input rounded-xl border border-border focus-within:border-indigo-500/60 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-transparent px-4 py-3 text-sm text-primary placeholder-muted resize-none outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors">
              <Paperclip size={15} />
            </button>
            <button className="p-1.5 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors">
              <Smile size={15} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!value.trim() || sending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Send size={13} />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
      <p className="text-xs text-muted mt-1.5 px-1">
        <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
