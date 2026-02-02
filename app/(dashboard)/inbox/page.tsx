"use client"
import { useState } from "react";
import { ChatSidebar, Conversation } from "@/components/Dashboard/chat/ChatSidebar";
import { ChatArea, Message } from "@/components/Dashboard/chat/ChatArea";
import { UserInfoSheet } from "@/components/Dashboard/chat/UserInfoSheet";

// Mock data for demo
const initialConversations: Conversation[] = [
    {
        id: "1",
        username: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        lastMessage: "Hey! How's the project going?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    },
    {
        id: "2",
        username: "Mike Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        lastMessage: "Thanks for the help earlier!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
        id: "3",
        username: "Emma Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        lastMessage: "Let's catch up tomorrow",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
];

const initialMessages: Record<string, Message[]> = {
    "1": [
        {
            id: "1",
            content: "Hey! How's the project going?",
            sender: "other",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            senderName: "Sarah Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        {
            id: "2",
            content: "It's going great! Just finished the chat interface 🎉",
            sender: "user",
            timestamp: new Date(Date.now() - 1000 * 60 * 4),
        },
        {
            id: "3",
            content: "That's awesome! Can't wait to see it in action",
            sender: "other",
            timestamp: new Date(Date.now() - 1000 * 60 * 3),
            senderName: "Sarah Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
    ],
    "2": [
        {
            id: "1",
            content: "Thanks for the help earlier!",
            sender: "other",
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            senderName: "Mike Johnson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        },
        {
            id: "2",
            content: "No problem! Happy to help anytime 😊",
            sender: "user",
            timestamp: new Date(Date.now() - 1000 * 60 * 55),
        },
    ],
    "3": [
        {
            id: "1",
            content: "Let's catch up tomorrow",
            sender: "other",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
            senderName: "Emma Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        },
    ],
};

const page = () => {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [activeConversationId, setActiveConversationId] = useState<string | null>("1");
    const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
    const [userSheetOpen, setUserSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ username: string; avatar: string } | null>(null);

    const handleNewConversation = (name: string) => {
        const newId = Date.now().toString();
        const newConversation: Conversation = {
            id: newId,
            username: name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            lastMessage: "No messages yet",
            timestamp: new Date(),
        };
        setConversations([newConversation, ...conversations]);
        setMessages({ ...messages, [newId]: [] });
        setActiveConversationId(newId);
    };

    const handleUserClick = (username: string, avatar: string) => {
        setSelectedUser({ username, avatar });
        setUserSheetOpen(true);
    };

    const handleSendMessage = (content: string) => {
        if (!activeConversationId) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages({
            ...messages,
            [activeConversationId]: [
                ...(messages[activeConversationId] || []),
                newMessage,
            ],
        });

        // Update last message in conversation
        setConversations(
            conversations.map((conv) =>
                conv.id === activeConversationId
                    ? { ...conv, lastMessage: content, timestamp: new Date() }
                    : conv
            )
        );
    };

    return (
        <div className="flex h-screen w-full relative overflow-hidden">
            <ChatSidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={setActiveConversationId}
                onNewConversation={handleNewConversation}
            />
            <ChatArea
                conversationId={activeConversationId}
                messages={messages[activeConversationId || ""] || []}
                onSendMessage={handleSendMessage}
                onUserClick={handleUserClick}
                username={selectedUser?.username}
                avatar={selectedUser?.avatar}
            />

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
};

export default page;

