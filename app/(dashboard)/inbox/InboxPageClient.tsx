"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatSidebar, Conversation } from "@/components/Dashboard/chat/ChatSidebar";
import { ChatArea, Message } from "@/components/Dashboard/chat/ChatArea";
import { UserInfoSheet } from "@/components/Dashboard/chat/UserInfoSheet";
import { messagesApi } from "@/lib/data/messages";
import type { Conversation as ApiConversation, Message as ApiMessage } from "@/types/messages/messageTypes";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { useInboxWebSocket } from "@/hooks/useInboxWebSocket";
import toast from "react-hot-toast";

const POLL_CONVERSATIONS_MS = 8_000;
const POLL_MESSAGES_MS = 5_000;

const AVATAR_FALLBACK = (seed: string) =>
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

function mapApiConversationToUI(api: ApiConversation, currentUserId: string): Conversation {
    const other = api.otherParticipant ?? (() => {
        const otherId = api.participants.find((p) => p !== currentUserId) ?? api.participants[0] ?? "";
        return { id: otherId, name: "User", avatar: AVATAR_FALLBACK(otherId) };
    })();
    return {
        id: api._id,
        username: other.name ?? "User",
        avatar: other.avatar ?? AVATAR_FALLBACK(other.id),
        lastMessage: api.lastMessage ?? "No messages yet",
        timestamp: api.lastMessageAt ? new Date(api.lastMessageAt) : new Date(),
        unreadCount: api.unreadCount ?? 0,
    };
}

function mapApiMessageToUI(api: ApiMessage, currentUserId: string): Message {
    const isUser = String(api.sender) === String(currentUserId);
    return {
        id: api._id ?? "",
        content: api.text,
        sender: isUser ? "user" : "other",
        timestamp: api.createdAt ? new Date(api.createdAt) : new Date(),
        senderName: isUser ? undefined : undefined,
        avatar: isUser ? undefined : AVATAR_FALLBACK(api.sender),
    };
}

export default function InboxPageClient() {
    const searchParams = useSearchParams();
    const userParam = searchParams.get("user");
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const currentUserId = currentUser?.id ? String(currentUser.id) : "";

    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [userSheetOpen, setUserSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ username: string; avatar: string } | null>(null);
    const lastHandledUserParam = useRef<string | null>(null);

    useInboxWebSocket(!!currentUserId);

    const {
        data: apiConversations = [],
        isLoading: conversationsLoading,
        error: conversationsError,
    } = useQuery({
        queryKey: ["conversations"],
        queryFn: () => messagesApi.getConversations(),
        enabled: !!currentUserId,
        refetchInterval: POLL_CONVERSATIONS_MS,
        refetchIntervalInBackground: false,
    });

    const conversations: Conversation[] = useMemo(
        () => apiConversations.map((c) => mapApiConversationToUI(c, currentUserId)),
        [apiConversations, currentUserId]
    );

    const {
        data: apiMessages = [],
    } = useQuery({
        queryKey: ["messages", activeConversationId],
        queryFn: () => messagesApi.getMessages(activeConversationId!),
        enabled: !!activeConversationId,
        refetchInterval: POLL_MESSAGES_MS,
        refetchIntervalInBackground: false,
    });

    const messages: Message[] = useMemo(
        () => apiMessages.map((m) => mapApiMessageToUI(m, currentUserId)),
        [apiMessages, currentUserId]
    );

    const sendMessageMutation = useMutation({
        mutationFn: ({ conversationId, text }: { conversationId: string; text: string }) =>
            messagesApi.sendMessage(conversationId, text),
        onSuccess: (_, { conversationId }) => {
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Failed to send message");
        },
    });

    const getOrCreateMutation = useMutation({
        mutationFn: (participantId: string) => messagesApi.getOrCreateConversation(participantId),
        onSuccess: (conv) => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            setActiveConversationId(conv._id);
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Could not start conversation");
        },
    });

    useEffect(() => {
        if (!userParam || !currentUserId || conversationsLoading) return;
        if (lastHandledUserParam.current === userParam) return;
        lastHandledUserParam.current = userParam;
        const existing = apiConversations.find((c) => c.participants.includes(userParam));
        if (existing) {
            setActiveConversationId(existing._id);
        } else {
            getOrCreateMutation.mutate(userParam);
        }
    }, [userParam, currentUserId, conversationsLoading, apiConversations, getOrCreateMutation]);

    const handleNewConversation = (userId: string) => {
        const existing = apiConversations.find((c) =>
            c.participants.includes(userId)
        );
        if (existing) {
            setActiveConversationId(existing._id);
        } else {
            getOrCreateMutation.mutate(userId);
        }
    };

    const handleUserClick = async (username: string, avatar: string) => {
        setSelectedUser({ username, avatar });
        setUserSheetOpen(true);
    };

    const handleSendMessage = (content: string) => {
        if (!activeConversationId) return;
        sendMessageMutation.mutate({ conversationId: activeConversationId, text: content });
    };

    const activeConversation = conversations.find((c) => c.id === activeConversationId);

    useEffect(() => {
        if (conversationsError) {
            toast.error("Could not load conversations. Check your connection.");
        }
    }, [conversationsError]);

    useEffect(() => {
        if (!activeConversationId) return;
        messagesApi.markAsRead(activeConversationId).then(() => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }).catch(() => {});
    }, [activeConversationId, queryClient]);

    const showListOnMobile = !activeConversationId;
    const showChatOnMobile = !!activeConversationId;

    return (
        <div className="relative flex h-full min-h-0 w-full flex-1 overflow-hidden bg-background">
            {/* Conversation list: full width on mobile when no chat open, sidebar on md+ */}
            <div
                className={`
                    w-full md:w-80 shrink-0 h-full flex flex-col
                    ${showListOnMobile ? "flex" : "hidden md:flex"}
                `}
            >
                <ChatSidebar
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={setActiveConversationId}
                    onNewConversation={handleNewConversation}
                />
            </div>
            {/* Chat: full width on mobile when conversation selected, flex-1 on md+ */}
            <div
                className={`
                    flex-1 min-w-0 h-full flex flex-col
                    ${showChatOnMobile ? "flex" : "hidden md:flex"}
                `}
            >
                <ChatArea
                    conversationId={activeConversationId}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onUserClick={handleUserClick}
                    onBack={() => setActiveConversationId(null)}
                    username={activeConversation?.username}
                    avatar={activeConversation?.avatar}
                />
            </div>

            {selectedUser && (
                <UserInfoSheet
                    open={userSheetOpen}
                    onOpenChange={setUserSheetOpen}
                    username={selectedUser.username}
                    avatar={selectedUser.avatar}
                />
            )}
        </div>
    );
}
