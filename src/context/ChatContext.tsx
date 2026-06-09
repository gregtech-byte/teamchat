import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import {
  collection, addDoc, onSnapshot, query, orderBy,
  serverTimestamp, doc, updateDoc, getDoc, deleteDoc,
  setDoc, where, getDocs,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

interface Reaction {
  emoji: string
  count: number
  userIds: string[]
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  timestamp: any
  reactions: Reaction[]
  edited?: boolean
}

export interface Channel {
  id: string
  name: string
  description: string
  type: 'channel' | 'dm'
  isPrivate?: boolean
  members?: string[]
  unread?: number
  createdBy?: string
}

export interface ChatUser {
  uid: string
  name: string
  email: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  statusMessage?: string
}

interface TypingUser {
  uid: string
  name: string
}

interface ChatContextValue {
  channels: Channel[]
  messages: Message[]
  activeChannelId: string
  setActiveChannelId: (id: string) => void
  sendMessage: (content: string) => void
  editMessage: (messageId: string, newContent: string) => void
  deleteMessage: (messageId: string) => void
  addReaction: (messageId: string, emoji: string) => void
  members: ChatUser[]
  typingUsers: TypingUser[]
  setTyping: (isTyping: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: Message[]
  createChannel: (name: string, description: string, isPrivate: boolean) => void
  unreadCounts: Record<string, number>
  updateUserStatus: (status: ChatUser['status'], statusMessage?: string) => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

const DEFAULT_CHANNELS: Channel[] = [
  { id: 'general', name: 'general', description: 'Company-wide chat', type: 'channel' },
  { id: 'announcements', name: 'announcements', description: 'Important updates', type: 'channel' },
  { id: 'engineering', name: 'engineering', description: 'Engineering discussions', type: 'channel' },
  { id: 'design', name: 'design', description: 'Design team workspace', type: 'channel' },
  { id: 'random', name: 'random', description: 'Off-topic fun', type: 'channel' },
]

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth()
  const [activeChannelId, setActiveChannelIdState] = useState('general')
  const [messages, setMessages] = useState<Message[]>([])
  const [members, setMembers] = useState<ChatUser[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [customChannels, setCustomChannels] = useState<Channel[]>([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSeenRef = useRef<Record<string, number>>({})

  const channels = [...DEFAULT_CHANNELS, ...customChannels]

  // Listen to messages
  useEffect(() => {
    if (!activeChannelId) return
    lastSeenRef.current[activeChannelId] = Date.now()
    const q = query(collection(db, 'channels', activeChannelId, 'messages'), orderBy('timestamp', 'asc'))
    const unsub = onSnapshot(q, snapshot => {
      const msgs: Message[] = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) }))
      setMessages(msgs)
      setUnreadCounts(prev => ({ ...prev, [activeChannelId]: 0 }))
    })
    return unsub
  }, [activeChannelId])

  // Track unread for other channels
  useEffect(() => {
    const unsubs = channels.map(ch => {
      if (ch.id === activeChannelId) return () => {}
      const q = query(collection(db, 'channels', ch.id, 'messages'), orderBy('timestamp', 'desc'))
      return onSnapshot(q, snapshot => {
        const lastSeen = lastSeenRef.current[ch.id] ?? 0
        const unread = snapshot.docs.filter(d => {
          const ts = d.data().timestamp?.toMillis?.() ?? 0
          return ts > lastSeen && d.data().authorId !== currentUser?.uid
        }).length
        setUnreadCounts(prev => ({ ...prev, [ch.id]: unread }))
      })
    })
    return () => unsubs.forEach(u => u())
  }, [activeChannelId, channels.length])

  // Listen to users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snapshot => {
      setMembers(snapshot.docs.map(d => d.data() as ChatUser))
    })
    return unsub
  }, [])

  // Listen to typing indicators
  useEffect(() => {
    if (!activeChannelId || !currentUser) return
    const unsub = onSnapshot(collection(db, 'channels', activeChannelId, 'typing'), snapshot => {
      const typers: TypingUser[] = snapshot.docs
        .filter(d => d.id !== currentUser.uid)
        .map(d => ({ uid: d.id, name: d.data().name }))
      setTypingUsers(typers)
    })
    return unsub
  }, [activeChannelId, currentUser])

  // Listen to custom channels
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'customChannels'), snapshot => {
      setCustomChannels(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Channel, 'id'>) })))
    })
    return unsub
  }, [])

  // Set user online on load, offline on unload
  useEffect(() => {
    if (!currentUser) return
    const userRef = doc(db, 'users', currentUser.uid)
    updateDoc(userRef, { status: 'online' }).catch(() => {})
    const handleUnload = () => {
      navigator.sendBeacon && navigator.sendBeacon('/api/offline') // fallback
      updateDoc(userRef, { status: 'offline' }).catch(() => {})
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [currentUser])

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const lower = searchQuery.toLowerCase()
    const results = messages.filter(m => m.content.toLowerCase().includes(lower))
    setSearchResults(results)
  }, [searchQuery, messages])

  const setActiveChannelId = useCallback((id: string) => {
    setActiveChannelIdState(id)
    lastSeenRef.current[id] = Date.now()
    setUnreadCounts(prev => ({ ...prev, [id]: 0 }))
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentUser) return
    // Play notification sound for others (we send, they hear)
    await addDoc(collection(db, 'channels', activeChannelId, 'messages'), {
      channelId: activeChannelId,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorAvatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(currentUser.displayName)}`,
      content: content.trim(),
      timestamp: serverTimestamp(),
      reactions: [],
      edited: false,
    })
    // Clear typing
    setTyping(false)
  }, [activeChannelId, currentUser])

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!newContent.trim()) return
    const msgRef = doc(db, 'channels', activeChannelId, 'messages', messageId)
    await updateDoc(msgRef, { content: newContent.trim(), edited: true })
  }, [activeChannelId])

  const deleteMessage = useCallback(async (messageId: string) => {
    const msgRef = doc(db, 'channels', activeChannelId, 'messages', messageId)
    await deleteDoc(msgRef)
  }, [activeChannelId])

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!currentUser) return
    const msgRef = doc(db, 'channels', activeChannelId, 'messages', messageId)
    const msgSnap = await getDoc(msgRef)
    if (!msgSnap.exists()) return
    const reactions: Reaction[] = msgSnap.data().reactions ?? []
    const existing = reactions.find(r => r.emoji === emoji)
    let updated: Reaction[]
    if (existing) {
      const already = existing.userIds.includes(currentUser.uid)
      updated = reactions.map(r => r.emoji === emoji ? {
        ...r,
        count: already ? r.count - 1 : r.count + 1,
        userIds: already ? r.userIds.filter(id => id !== currentUser.uid) : [...r.userIds, currentUser.uid],
      } : r).filter(r => r.count > 0)
    } else {
      updated = [...reactions, { emoji, count: 1, userIds: [currentUser.uid] }]
    }
    await updateDoc(msgRef, { reactions: updated })
  }, [activeChannelId, currentUser])

  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!currentUser || !activeChannelId) return
    const ref = doc(db, 'channels', activeChannelId, 'typing', currentUser.uid)
    if (isTyping) {
      await setDoc(ref, { name: currentUser.displayName, timestamp: serverTimestamp() })
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setTyping(false), 3000)
    } else {
      await deleteDoc(ref).catch(() => {})
    }
  }, [currentUser, activeChannelId])

  const createChannel = useCallback(async (name: string, description: string, isPrivate: boolean) => {
    if (!currentUser || !name.trim()) return
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await setDoc(doc(db, 'customChannels', slug), {
      name: slug, description, type: 'channel', isPrivate,
      createdBy: currentUser.uid, members: [currentUser.uid],
    })
  }, [currentUser])

  const updateUserStatus = useCallback(async (status: ChatUser['status'], statusMessage?: string) => {
    if (!currentUser) return
    const ref = doc(db, 'users', currentUser.uid)
    await updateDoc(ref, { status, statusMessage: statusMessage ?? '' })
  }, [currentUser])

  return (
    <ChatContext.Provider value={{
      channels, messages, activeChannelId, setActiveChannelId,
      sendMessage, editMessage, deleteMessage, addReaction,
      members, typingUsers, setTyping, searchQuery, setSearchQuery,
      searchResults, createChannel, unreadCounts, updateUserStatus,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
