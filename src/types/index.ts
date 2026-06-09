export type UserRole = 'admin' | 'agent' | 'customer' | 'member'
export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export interface User {
  id: string
  name: string
  username: string
  avatar: string
  role: UserRole
  status: UserStatus
  statusMessage?: string
}

export interface Channel {
  id: string
  name: string
  description: string
  type: 'channel' | 'dm' | 'support'
  unread: number
  members: string[]
  isPrivate?: boolean
}

export interface Reaction {
  emoji: string
  count: number
  userIds: string[]
}

export interface Message {
  id: string
  channelId: string
  authorId: string
  content: string
  timestamp: string
  edited?: boolean
  reactions: Reaction[]
  replyTo?: string
  attachments?: { name: string; size: string; type: string }[]
}
