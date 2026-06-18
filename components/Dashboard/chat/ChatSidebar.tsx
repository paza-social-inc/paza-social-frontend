import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { NewChatDialog } from "./NewChatDialog";
import { RiChat1Line } from "@remixicon/react";
import { useRouter } from "next/navigation";

export interface Conversation {
    id: string;
    username: string;
    avatar: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount?: number;
}

interface ChatSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: (userId: string) => void;
}

export function ChatSidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
}: ChatSidebarProps) {
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const router = useRouter();

    return (
        <motion.aside
            initial={{ opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full md:w-80 bg-background relative border-r border-border flex flex-col h-full min-h-0"
        >
            <div className="p-3 sm:p-4 border-b border-border sticky top-0 bg-background z-10 flex items-center justify-between supports-[padding:env(safe-area-inset)]:pt-[env(safe-area-inset-top)]">
                <div className="flex items-center gap-2 min-w-0">
                    <RiChat1Line className="w-6 h-6 shrink-0 text-primary" />
                    <h2 className="text-base sm:text-lg font-semibold truncate">Chats</h2>
                </div>
                <div className="flex gap-1 sm:gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
                        onClick={() => setIsNewChatOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation hidden sm:flex"
                        onClick={() => router.push("/settings")}
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
                <div className="divide-y divide-border">
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