
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
import toast from "react-hot-toast";
import { uploadPublicFileUrl } from "@/lib/data/uploads";

interface MessageInputProps {
    onSendMessage: (content: string) => void;
}

type PendingAttachment = {
    id: string;
    name: string;
    file: File;
    status: "queued" | "uploading" | "failed";
    error?: string;
};

export function MessageInput({ onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = async () => {
        const trimmed = message.trim();
        if (!trimmed && pendingAttachments.length === 0) return;
        setIsSending(true);
        try {
            const urls: string[] = [];
            for (const attachment of pendingAttachments) {
                setPendingAttachments((prev) =>
                    prev.map((a) =>
                        a.id === attachment.id ? { ...a, status: "uploading", error: undefined } : a
                    )
                );
                try {
                    const url = await uploadPublicFileUrl(attachment.file);
                    urls.push(url);
                } catch (err: unknown) {
                    const msg =
                        String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
                        (err as Error)?.message ||
                        "Upload failed";
                    setPendingAttachments((prev) =>
                        prev.map((a) =>
                            a.id === attachment.id ? { ...a, status: "failed", error: msg } : a
                        )
                    );
                }
            }

            if (!trimmed && urls.length === 0) {
                toast.error("No attachment uploaded. Please try again.");
                return;
            }

            const attachmentLines = urls.map((url, idx) => {
                const name = pendingAttachments[idx]?.name ?? "file";
                return `Attachment: ${name}\n${url}`;
            });
            const payload = [trimmed, ...attachmentLines]
                .filter(Boolean)
                .join("\n");
            onSendMessage(payload);
            setMessage("");
            setPendingAttachments((prev) => prev.filter((a) => a.status === "failed"));
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } finally {
            setIsSending(false);
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

    const handleAttachmentPick = () => {
        if (isSending) return;
        const input = fileInputRef.current;
        if (!input) return;
        try {
            if ("showPicker" in input && typeof input.showPicker === "function") {
                input.showPicker();
                return;
            }
        } catch {
            // Ignore and fallback to click().
        }
        input.click();
    };

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.currentTarget.files;
        if (!fileList?.length) return;
        const selectedFiles = Array.from(fileList);
        e.currentTarget.value = "";
        const selected = selectedFiles.map((file, idx): PendingAttachment => ({
            id: `${Date.now()}-${idx}-${file.name}`,
            name: file.name,
            file,
            status: "queued",
        }));
        setPendingAttachments((prev) => [...prev, ...selected]);
        textareaRef.current?.focus();
        toast.success(selectedFiles.length === 1 ? "Attachment queued. Tap send." : `${selectedFiles.length} attachments queued. Tap send.`);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    return (
        <div className="p-2 sm:p-3">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="absolute -left-[9999px] h-px w-px opacity-0"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/quicktime,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleAttachmentChange}
            />
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-secondary/60 p-2 sm:p-2.5">
                {pendingAttachments.length > 0 ? (
                    <p className="px-2 pt-1 text-xs text-muted-foreground">
                        Selected files: {pendingAttachments.length}
                    </p>
                ) : null}
                {pendingAttachments.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 px-2 pt-1">
                        {pendingAttachments.map((a, i) => (
                            <span
                                key={`${a.id}-${i}`}
                                className="inline-flex max-w-full items-center rounded-full border px-2 py-1 text-xs"
                                title={a.error ? `${a.name}: ${a.error}` : a.name}
                            >
                                <Paperclip className="mr-1 h-3 w-3 shrink-0" />
                                <span
                                    className={
                                        a.status === "failed"
                                            ? "truncate text-destructive"
                                            : a.status === "uploading"
                                              ? "truncate text-muted-foreground"
                                              : "truncate text-foreground"
                                    }
                                >
                                    {a.name}
                                    {a.status === "queued" ? " (queued)" : ""}
                                    {a.status === "uploading" ? " (uploading...)" : ""}
                                    {a.status === "failed" ? " (failed)" : ""}
                                </span>
                            </span>
                        ))}
                    </div>
                ) : null}
                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="min-h-[44px] sm:min-h-[40px] max-h-32 w-full resize-none border-0 bg-transparent px-2 py-2 text-base sm:text-sm shadow-none focus-visible:ring-0"
                    rows={1}
                />
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-full touch-manipulation"
                                disabled={isSending}
                                aria-label="Attach files"
                                onClick={handleAttachmentPick}
                            >
                                <Paperclip className="h-4 w-4" />
                            </Button>
                        </motion.div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-full touch-manipulation"
                                    aria-label="Open emoji picker"
                                >
                                    <Smile className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                side="top"
                                align="start"
                                className="w-auto max-h-[min(400px,70vh)] overflow-auto border-border p-0"
                            >
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width={Math.min(350, typeof window !== "undefined" ? window.innerWidth - 24 : 320)}
                                    height={360}
                                    searchPlaceHolder="Search emoji..."
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {isSending ? (
                        <span className="text-xs text-muted-foreground">Sending...</span>
                    ) : null}
                    <Button
                        type="button"
                        onClick={handleSend}
                        disabled={(!message.trim() && pendingAttachments.length === 0) || isSending}
                        className="h-9 w-9 rounded-full bg-gradient-primary hover:opacity-90 touch-manipulation"
                        variant="outline"
                        size="icon"
                        aria-label="Send message"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
