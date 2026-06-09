import type { User, Channel, Message } from '../types'

export const CURRENT_USER_ID = 'u1'

export const users: User[] = [
  { id: 'u1', name: 'Alex Johnson', username: 'alex.j', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=alex', role: 'admin', status: 'online' },
  { id: 'u2', name: 'Sarah Chen', username: 'sarah.c', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=sarah', role: 'agent', status: 'online', statusMessage: 'Helping customers' },
  { id: 'u3', name: 'Mike Torres', username: 'mike.t', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=mike', role: 'member', status: 'away' },
  { id: 'u4', name: 'Jess Park', username: 'jess.p', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=jess', role: 'member', status: 'busy', statusMessage: 'In a meeting' },
  { id: 'u5', name: 'Dan Roberts', username: 'dan.r', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=dan', role: 'agent', status: 'online' },
  { id: 'u6', name: 'Acme Corp', username: 'acme', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=acme', role: 'customer', status: 'online' },
  { id: 'u7', name: 'TechStart Inc', username: 'techstart', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=tech', role: 'customer', status: 'offline' },
]

export const channels: Channel[] = [
  { id: 'ch1', name: 'general', description: 'Company-wide announcements and chat', type: 'channel', unread: 3, members: ['u1','u2','u3','u4','u5'] },
  { id: 'ch2', name: 'engineering', description: 'Engineering team discussions', type: 'channel', unread: 0, members: ['u1','u3','u4'] },
  { id: 'ch3', name: 'design', description: 'Design team workspace', type: 'channel', unread: 1, members: ['u1','u4','u5'] },
  { id: 'ch4', name: 'announcements', description: 'Important company updates', type: 'channel', unread: 0, members: ['u1','u2','u3','u4','u5'], isPrivate: false },
  { id: 'dm1', name: 'Sarah Chen', description: '', type: 'dm', unread: 2, members: ['u1','u2'] },
  { id: 'dm2', name: 'Mike Torres', description: '', type: 'dm', unread: 0, members: ['u1','u3'] },
  { id: 'sup1', name: 'Acme Corp', description: 'Support ticket #1042', type: 'support', unread: 5, members: ['u1','u2','u6'] },
  { id: 'sup2', name: 'TechStart Inc', description: 'Support ticket #1038', type: 'support', unread: 0, members: ['u1','u5','u7'] },
]

export const messages: Message[] = [
  // #general
  { id: 'm1', channelId: 'ch1', authorId: 'u2', content: 'Good morning team! 👋 Ready for the sprint review today?', timestamp: '2026-06-08T08:00:00Z', reactions: [{ emoji: '👋', count: 3, userIds: ['u1','u3','u4'] }] },
  { id: 'm2', channelId: 'ch1', authorId: 'u3', content: "Morning! Yes, I've got the demo ready. Should be a good one.", timestamp: '2026-06-08T08:05:00Z', reactions: [] },
  { id: 'm3', channelId: 'ch1', authorId: 'u1', content: 'Perfect. Meeting starts at 10am in the main room. Everyone make sure to join 5 mins early.', timestamp: '2026-06-08T08:10:00Z', reactions: [{ emoji: '✅', count: 4, userIds: ['u2','u3','u4','u5'] }] },
  { id: 'm4', channelId: 'ch1', authorId: 'u4', content: "Will do! Also quick heads up — I'll be pushing the new UI updates before the meeting so the demo reflects the latest.", timestamp: '2026-06-08T08:15:00Z', reactions: [{ emoji: '🔥', count: 2, userIds: ['u1','u2'] }] },
  { id: 'm5', channelId: 'ch1', authorId: 'u5', content: 'Nice! Looking forward to seeing it. The new color system looks really clean from the preview.', timestamp: '2026-06-08T08:22:00Z', reactions: [] },
  { id: 'm6', channelId: 'ch1', authorId: 'u2', content: 'Also reminder: customer onboarding call with Acme Corp at 2pm. Dan and I are handling it.', timestamp: '2026-06-08T09:00:00Z', reactions: [{ emoji: '👍', count: 1, userIds: ['u1'] }] },
  // #engineering
  { id: 'm7', channelId: 'ch2', authorId: 'u3', content: 'PR #247 is ready for review — refactored the auth middleware. Should cut login latency by ~40%.', timestamp: '2026-06-08T07:30:00Z', reactions: [{ emoji: '🚀', count: 2, userIds: ['u1','u4'] }] },
  { id: 'm8', channelId: 'ch2', authorId: 'u4', content: "On it. Quick question — did you add tests for the token refresh edge case we discussed last week?", timestamp: '2026-06-08T07:45:00Z', reactions: [] },
  { id: 'm9', channelId: 'ch2', authorId: 'u3', content: 'Yep, covered in the `auth.test.ts` file. 12 new test cases total.', timestamp: '2026-06-08T07:50:00Z', reactions: [{ emoji: '💪', count: 1, userIds: ['u4'] }] },
  { id: 'm10', channelId: 'ch2', authorId: 'u1', content: 'Great work Mike. Approving now and will merge after CI passes.', timestamp: '2026-06-08T08:30:00Z', reactions: [] },
  // #design
  { id: 'm11', channelId: 'ch3', authorId: 'u4', content: 'Updated the component library with the new token system. Figma file is synced.', timestamp: '2026-06-08T09:00:00Z', reactions: [{ emoji: '🎨', count: 2, userIds: ['u1','u5'] }] },
  { id: 'm12', channelId: 'ch3', authorId: 'u5', content: 'The button variants look amazing. Love the hover states.', timestamp: '2026-06-08T09:15:00Z', reactions: [{ emoji: '❤️', count: 1, userIds: ['u4'] }] },
  // DM sarah
  { id: 'm13', channelId: 'dm1', authorId: 'u2', content: "Hey Alex, do you have 15 mins before the meeting? Wanted to run through the Acme onboarding flow.", timestamp: '2026-06-08T08:45:00Z', reactions: [] },
  { id: 'm14', channelId: 'dm1', authorId: 'u1', content: 'Sure, 9:30 works for me.', timestamp: '2026-06-08T08:47:00Z', reactions: [] },
  { id: 'm15', channelId: 'dm1', authorId: 'u2', content: 'Perfect, see you then!', timestamp: '2026-06-08T08:48:00Z', reactions: [{ emoji: '👍', count: 1, userIds: ['u1'] }] },
  // DM mike
  { id: 'm16', channelId: 'dm2', authorId: 'u3', content: 'The build is passing now. Deployment should be smooth.', timestamp: '2026-06-08T10:00:00Z', reactions: [] },
  { id: 'm17', channelId: 'dm2', authorId: 'u1', content: 'Excellent. Go ahead and trigger the staging deploy.', timestamp: '2026-06-08T10:05:00Z', reactions: [] },
  // Support - Acme
  { id: 'm18', channelId: 'sup1', authorId: 'u6', content: "Hi, we're having trouble with the bulk import feature. CSV files over 10MB are timing out.", timestamp: '2026-06-08T07:00:00Z', reactions: [] },
  { id: 'm19', channelId: 'sup1', authorId: 'u2', content: "Hi Acme Corp! Thanks for reaching out. I can see the issue — there's a 10MB limit on our current plan. Let me check what options we have for you.", timestamp: '2026-06-08T07:15:00Z', reactions: [] },
  { id: 'm20', channelId: 'sup1', authorId: 'u6', content: 'We need to import files up to 50MB regularly. Is there an upgrade option?', timestamp: '2026-06-08T07:20:00Z', reactions: [] },
  { id: 'm21', channelId: 'sup1', authorId: 'u2', content: "Absolutely! Our Business plan supports up to 100MB imports. I'll send over the upgrade details shortly.", timestamp: '2026-06-08T07:30:00Z', reactions: [{ emoji: '🙏', count: 1, userIds: ['u6'] }] },
  { id: 'm22', channelId: 'sup1', authorId: 'u6', content: "That would be great. Also, can we get a dedicated account manager?", timestamp: '2026-06-08T07:35:00Z', reactions: [] },
  // Support - TechStart
  { id: 'm23', channelId: 'sup2', authorId: 'u7', content: 'Quick question about API rate limits on the Enterprise tier.', timestamp: '2026-06-07T15:00:00Z', reactions: [] },
  { id: 'm24', channelId: 'sup2', authorId: 'u5', content: 'Hi TechStart! Enterprise gives you 10,000 requests/min with burst up to 50,000. Does that work for your use case?', timestamp: '2026-06-07T15:10:00Z', reactions: [] },
  { id: 'm25', channelId: 'sup2', authorId: 'u7', content: "That's more than enough. Thanks!", timestamp: '2026-06-07T15:15:00Z', reactions: [{ emoji: '✅', count: 1, userIds: ['u5'] }] },
]
