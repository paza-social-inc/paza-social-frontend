
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface MessageInputProps {
    onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prev) => prev + emojiData.emoji);
        textareaRef.current?.focus();
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    return (
        <div className="flex items-end gap-2 p-2 sm:p-3 min-h-[52px] sm:min-h-0">
            <div className="flex-1 relative min-w-0">
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-2 sm:left-3 bottom-2 hidden sm:block"
                >
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full touch-manipulation"
                    >
                        <Paperclip className="w-4 h-4" />
                    </Button>
                </motion.div>
                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="min-h-[44px] sm:min-h-[40px] max-h-32 w-full resize-none bg-secondary border-none pl-11 pr-11 sm:pl-12 py-3 text-base sm:text-sm rounded-2xl touch-manipulation"
                    rows={1}
                />
                <div className="absolute left-2 sm:left-12 bottom-2 sm:bottom-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-full touch-manipulation"
                            >
                                <Smile className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="start"
                            className="w-auto p-0 border-border max-h-[min(400px,70vh)] overflow-auto"
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                width={Math.min(350, typeof window !== "undefined" ? window.innerWidth - 24 : 350)}
                                height={360}
                                searchPlaceHolder="Search emoji..."
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="absolute right-2 bottom-2 h-9 w-9 rounded-full touch-manipulation bg-gradient-primary hover:opacity-90"
                    variant="outline"
                    size="icon"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
