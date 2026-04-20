// Messaging types for conversations and messages in Inbox
// Aligned with: GET/POST /api/conversations, GET/POST /api/conversations/:id/messages, PATCH /api/conversations/:id/read

export interface Message {
  _id?: string;
  text: string;
  sender: string;
  recipient: string;
  createdAt?: string;
}

/** Conversation from GET /api/conversations (otherParticipant, unreadCount, lastMessage, lastMessageAt) */
export interface Conversation {
  _id: string;
  participants: string[];
  /** Last message preview text */
  lastMessage?: string;
  /** ISO date string */
  lastMessageAt?: string;
  /** Unread count for current user (for badge) */
  unreadCount?: number;
  /** Other participant embedded by backend */
  otherParticipant?: {
    id: string;
    name?: string;
    avatar?: string;
  };
}


