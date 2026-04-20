
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
    onBack?: () => void;
    username?: string;
    avatar?: string;
}

export function ChatArea({
    conversationId,
    messages,
    onSendMessage,
    onUserClick,
    onBack,
    username,
    avatar,
}: ChatAreaProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background p-4 sm:p-6 min-h-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-sm"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl">💬</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to Chat</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Select a conversation or start a new one
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col border-l border-border bg-background w-full min-w-0 min-h-0 h-full">
            <ChatHeader
                username={username!}
                avatar={avatar!}
                onUserClick={onUserClick}
                onBack={onBack}
            />
            <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
                <AnimatePresence mode="popLayout">
                    <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-6 max-w-4xl mx-auto pb-4">
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
            <div className="border-t bg-card shrink-0 supports-[padding:env(safe-area-inset)]:pb-[env(safe-area-inset-bottom)]">
                <div className="max-w-4xl mx-auto">
                    <MessageInput onSendMessage={onSendMessage} />
                </div>
            </div>
        </div>
    );
}
