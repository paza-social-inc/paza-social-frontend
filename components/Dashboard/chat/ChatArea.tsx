
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import ChatHeader from "./ChatHeader";

export interface Message {
    id: string;
    content: string;
    sender: "user" | "other";
    timestamp: Date;
    senderName?: string;
    avatar?: string;
}

interface ChatAreaProps {
    conversationId: string | null;
    messages: Message[];
    onSendMessage: (content: string) => void;
    onUserClick?: (username: string, avatar: string) => void;
    username?: string;
    avatar?: string;
}

export function ChatArea({
    conversationId,
    messages,
    onSendMessage,
    onUserClick,
    username,
    avatar
}: ChatAreaProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-4xl">💬</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
                    <p className="text-muted-foreground">
                        Select a conversation or start a new one
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col border-l bg-background w-full relative">
            <ChatHeader username={username!} avatar={avatar!} onUserClick={onUserClick} />
            {/* Messages Area */}
            <ScrollArea className="flex-1 h-64" ref={scrollAreaRef}>
                <AnimatePresence mode="popLayout">
                    <div className="space-y-4 max-w-4xl p-6 mx-auto">
                        {messages.map((message, index) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                index={index}
                                onUserClick={onUserClick}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </AnimatePresence>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t bg-card">
                <div className="max-w-4xl mx-auto">
                    <MessageInput onSendMessage={onSendMessage} />
                </div>
            </div>
        </div>
    );
}
