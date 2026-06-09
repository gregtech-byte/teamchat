import { useEffect, useRef, useState } from 'react'
import { Hash, Lock, Search, X } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import MemberPanel from './MemberPanel'

export default function ChatArea() {
  const {
    activeChannelId, channels, messages, typingUsers,
    searchQuery, setSearchQuery, searchResults,
  } = useChat()
  const channel = channels.find(c => c.id === activeChannelId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, activeChannelId])

  if (!channel) return null

  const displayMessages = searchQuery && searchResults.length > 0 ? searchResults : messages
  const isSearching = searchQuery.trim().length > 0

  return (
    <div className="flex flex-1 min-w-0 h-full">
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-main flex-shrink-0">
          {channel.isPrivate ? <Lock size={15} className="text-muted flex-shrink-0" /> : <Hash size={15} className="text-muted flex-shrink-0" />}
          <h2 className="font-semibold text-primary">{channel.name}</h2>
          {channel.description && (
            <>
              <span className="text-border">|</span>
              <span className="text-sm text-muted truncate hidden sm:block">{channel.description}</span>
            </>
          )}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <button
              onClick={() => { setShowSearch(v => !v); if (showSearch) setSearchQuery('') }}
              className={`p-1.5 rounded-lg transition-colors ${showSearch ? 'bg-active text-primary' : 'text-muted hover:text-primary hover:bg-hover'}`}
              title="Search messages"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="px-4 py-2 border-b border-border bg-main flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-input border border-border rounded-lg pl-9 pr-9 py-2 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                  <X size={14} />
                </button>
              )}
            </div>
            {isSearching && (
              <p className="text-xs text-muted mt-1.5 px-1">
                {searchResults.length === 0 ? 'No results found' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {!isSearching && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-14 h-14 rounded-full bg-hover flex items-center justify-center mb-4">
                <Hash size={24} className="text-muted" />
              </div>
              <h3 className="font-semibold text-primary mb-1">Welcome to #{channel.name}</h3>
              <p className="text-sm text-muted">{channel.description || 'Send the first message!'}</p>
            </div>
          )}

          {isSearching && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <p className="text-muted text-sm">No messages match "{searchQuery}"</p>
            </div>
          )}

          {displayMessages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} prevMessage={displayMessages[i - 1]} />
          ))}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted">
                {typingUsers.map(u => u.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!isSearching && <MessageInput placeholder={`Message #${channel.name}`} />}
      </div>

      <MemberPanel />
    </div>
  )
}
