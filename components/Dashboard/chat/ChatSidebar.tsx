
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { NewChatDialog } from "./NewChatDialog";
import { RiChat1Line } from "@remixicon/react";

export interface Conversation {
    id: string;
    username: string;
    avatar: string;
    lastMessage: string;
    timestamp: Date;
}

interface ChatSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: (name: string) => void;
}

export function ChatSidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
}: ChatSidebarProps) {
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);

    return (
        <motion.aside
            initial={{ opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-80 bg-background  relative border-border flex flex-col h-full"
        >
            {/* Header */}
            <div className="p-4 border-b border-border sticky top-0 bg-background z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <RiChat1Line className="w-6 h-6 text-primary" />
                    <h2 className="text-lg font-semibold">Chats</h2>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-chat-hover transition-colors"
                        onClick={() => setIsNewChatOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-chat-hover transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
                <div className="divide-y">
                    {conversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={activeConversationId === conversation.id}
                            onClick={() => onSelectConversation(conversation.id)}
                        />
                    ))}
                </div>
            </ScrollArea>

            <NewChatDialog
                open={isNewChatOpen}
                onOpenChange={setIsNewChatOpen}
                onCreateChat={onNewConversation}
            />
        </motion.aside>
    );
}
