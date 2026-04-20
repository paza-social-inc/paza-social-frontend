
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "./ChatSidebar";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
}

export function ConversationItem({
    conversation,
    isActive,
    onClick,
}: ConversationItemProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "w-full p-3 sm:p-3 py-4 sm:py-3 min-h-[72px] sm:min-h-0 transition-all duration-200 text-left touch-manipulation",
                "hover:bg-secondary/30 active:bg-secondary/50",
                isActive && "bg-secondary hover:bg-secondary"
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11 sm:w-10 sm:h-10 shrink-0 ring-2 ring-primary/20">
                    <AvatarImage src={conversation.avatar} alt={conversation.username} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {conversation.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm truncate">
                            {conversation.username}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conversation.timestamp)}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                    </p>
                </div>
            </div>
        </motion.button>
    );
}

function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}
