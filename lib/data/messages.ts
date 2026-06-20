/**
 * Inbox API – mapped to backend endpoints.
 *
 * GET    /api/conversations              → List current user's conversations (otherParticipant, unreadCount, lastMessage, lastMessageAt).
 * POST   /api/conversations              → Start or get 1:1 conversation. Body: { participantId }.
 * GET    /api/conversations/:id/messages → Get messages for conversation (oldest first).
 * POST   /api/conversations/:id/messages → Send message. Body: { text }.
 * PATCH  /api/conversations/:id/read     → Mark conversation as read for current user.
 */

import { pazaApi } from "@/lib/axiosClients";
import type { Conversation as ApiConversation, Message as ApiMessage } from "@/types/messages/messageTypes";

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const messagesApi = {
  /** GET /api/conversations – list with otherParticipant, unreadCount, lastMessage, lastMessageAt */
  getConversations: async (): Promise<ApiConversation[]> => {
    const res = await pazaApi.get<ApiResponse<ApiConversation[]>>("/api/conversations");
    return res.data.data ?? [];
  },

  /** POST /api/conversations – start or get 1:1 conversation. Body: { participantId } */
  getOrCreateConversation: async (participantId: string): Promise<ApiConversation> => {
    const res = await pazaApi.post<ApiResponse<ApiConversation>>("/api/conversations", {
      participantId,
    });
    return res.data.data;
  },

  /** GET /api/conversations/:id/messages – messages oldest first */
  getMessages: async (conversationId: string): Promise<ApiMessage[]> => {
    const res = await pazaApi.get<ApiResponse<ApiMessage[]>>(
      `/api/conversations/${conversationId}/messages`
    );
    return res.data.data ?? [];
  },

  /** POST /api/conversations/:id/messages – send message. Body: { text } */
  sendMessage: async (
    conversationId: string,
    text: string
  ): Promise<ApiMessage> => {
    const res = await pazaApi.post<ApiResponse<ApiMessage>>(
      `/api/conversations/${conversationId}/messages`,
      { text }
    );
    return res.data.data;
  },

  /** PATCH /api/conversations/:id/read – mark as read for current user */
  markAsRead: async (conversationId: string): Promise<void> => {
    await pazaApi.patch(`/api/conversations/${conversationId}/read`);
  },

  /** Total unread count from conversation list (for badge) */
  getUnreadCount: async (): Promise<number> => {
    try {
      const list = await messagesApi.getConversations();
      return list.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
    } catch {
      return 0;
    }
  },

  getUserById: async (userId: string): Promise<{
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  } | null> => {
    try {
      const res = await pazaApi.get(`/api/users/${userId}`);
      return res.data.data ?? null;
    } catch {
      return null;
    }
  },
};
