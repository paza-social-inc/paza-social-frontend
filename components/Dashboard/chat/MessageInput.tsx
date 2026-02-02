
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
        <div className="flex items-end gap-2">
            {/* Attachment Button */}


            {/* Message Input Area */}
            <div className="flex-1 relative">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="absolute left-3 bottom-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-chat-hover rounded-full transition-colors h-8 w-8"
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                </motion.div>
                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="h-full w-full min-h-24 resize-none bg-secondary border-none pr-12 py-3"
                    rows={1}
                />

                {/* Emoji Button */}
                <div className="absolute left-13 bottom-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-chat-hover rounded-full transition-colors h-8 w-8"
                                >
                                    <Smile className="w-5 h-5" />
                                </Button>
                            </motion.div>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="end"
                            className="w-auto p-0 border-border"
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                width={350}
                                height={400}
                                searchPlaceHolder="Search emoji..."
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="absolute right-4 bottom-2">
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="bg-gradient-primary hover:opacity-90 transition-opacity  rounded-full"
                        variant="outline"
                        size="icon"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
