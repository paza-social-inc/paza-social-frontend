
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "./ChatArea";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
    message: Message;
    index: number;
    onUserClick?: (username: string, avatar: string) => void;
}

export function MessageBubble({ message, index, onUserClick }: MessageBubbleProps) {
    const isUser = message.sender === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
            }}
            className={cn(
                "flex gap-3 max-w-[85%] sm:max-w-[70%]",
                isUser ? "flex-row-reverse ml-auto w-fit" : "w-fit"
            )}
        >
            {/* Avatar */}
            {!isUser && (
                <Avatar
                    className="w-8 h-8 ring-2 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all"
                    onClick={() => {
                        if (onUserClick && message.senderName && message.avatar) {
                            onUserClick(message.senderName, message.avatar);
                        }
                    }}
                >
                    <AvatarImage src={message.avatar} alt={message.senderName} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                        {message.senderName?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                </Avatar>
            )}

            {/* Message Content: mobile-first width */}
            <div
                className={cn(
                    "max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 sm:py-1.5 shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-foreground rounded-bl-md"
                )}
            >
                {!isUser && message.senderName && (
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                        {message.senderName}
                    </p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                </p>
                <p
                    className={cn(
                        "text-xs mt-1",
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                >
                    {formatTime(message.timestamp)}
                </p>
            </div>

            {/* User Avatar */}
            {isUser && (
                <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                        U
                    </AvatarFallback>
                </Avatar>
            )}
        </motion.div>
    );
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}
