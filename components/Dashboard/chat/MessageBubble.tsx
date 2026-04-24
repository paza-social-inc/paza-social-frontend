
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "./ChatArea";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";

interface MessageBubbleProps {
    message: Message;
    index: number;
    onUserClick?: (username: string, avatar: string) => void;
}

export function MessageBubble({ message, index, onUserClick }: MessageBubbleProps) {
    const isUser = message.sender === "user";
    const { textContent, attachments } = parseMessageBody(message.content);

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
                {textContent ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {textContent}
                    </p>
                ) : null}
                {attachments.length > 0 ? (
                    <div className={cn("mt-2 space-y-1.5", !textContent && "mt-0")}>
                        {attachments.map((a, idx) => (
                            <div
                                key={`${a.url}-${idx}`}
                                className={cn(
                                    "flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-xs",
                                    isUser
                                        ? "border-primary-foreground/30 bg-primary-foreground/10"
                                        : "border-border bg-background/60"
                                )}
                            >
                                <div className="min-w-0 flex items-center gap-1.5">
                                    <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{a.label}</span>
                                </div>
                                <a
                                    href={a.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        "shrink-0 font-medium",
                                        isUser ? "text-primary-foreground" : "text-orange-500"
                                    )}
                                >
                                    Open
                                </a>
                            </div>
                        ))}
                    </div>
                ) : null}
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

function parseMessageBody(content: string): {
    textContent: string;
    attachments: Array<{ label: string; url: string }>;
} {
    const lines = String(content ?? "").split("\n");
    const textLines: string[] = [];
    const attachments: Array<{ label: string; url: string }> = [];
    for (let i = 0; i < lines.length; i += 1) {
        const raw = lines[i] ?? "";
        const line = raw.trim();
        if (!line) {
            textLines.push(raw);
            continue;
        }
        if (/^Attachment:\s*/i.test(line)) {
            const label = line.replace(/^Attachment:\s*/i, "").trim() || "Attachment";
            const next = (lines[i + 1] ?? "").trim();
            if (/^https?:\/\/\S+$/i.test(next)) {
                attachments.push({ label, url: next });
                i += 1;
                continue;
            }
            textLines.push(raw);
            continue;
        }
        if (/^https?:\/\/\S+$/i.test(line)) {
            attachments.push({ label: "Attachment", url: line });
            continue;
        }
        textLines.push(raw);
    }
    return {
        textContent: textLines.join("\n").trim(),
        attachments,
    };
}
