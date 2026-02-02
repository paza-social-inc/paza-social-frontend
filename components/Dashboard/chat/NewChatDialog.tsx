
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

interface NewChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateChat: (name: string) => void;
}

export function NewChatDialog({
    open,
    onOpenChange,
    onCreateChat,
}: NewChatDialogProps) {
    const [chatName, setChatName] = useState("");

    const handleCreate = () => {
        if (chatName.trim()) {
            onCreateChat(chatName.trim());
            setChatName("");
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquarePlus className="w-6 h-6 text-primary" />
                                <DialogTitle>New Conversation</DialogTitle>
                            </div>
                            <DialogDescription>
                                Start a new conversation. Give it a memorable name!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <Input
                                placeholder="Enter conversation name..."
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                className="bg-secondary border-border"
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="hover:bg-chat-hover"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleCreate}
                                    disabled={!chatName.trim()}
                                    className="bg-primary hover:opacity-90 transition-opacity "
                                >
                                    Create
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
