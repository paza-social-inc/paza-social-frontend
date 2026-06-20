"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { MessageSquarePlus, Loader2, Search } from "lucide-react";
import { usersApi } from "@/lib/data/users";
import Image from "next/image";

interface NewChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateChat: (userId: string) => void;
}

export function NewChatDialog({
    open,
    onOpenChange,
    onCreateChat,
}: NewChatDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQ, setDebouncedQ] = useState("");

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => setDebouncedQ(searchQuery), 300);
        return () => clearTimeout(t);
    }, [open, searchQuery]);

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users-search", debouncedQ],
        queryFn: () => usersApi.search(debouncedQ),
        enabled: open && debouncedQ.length >= 2,
    });

    const handleSelectUser = (userId: string) => {
        onCreateChat(userId);
        setSearchQuery("");
        setDebouncedQ("");
        onOpenChange(false);
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
                                <DialogTitle>New conversation</DialogTitle>
                            </div>
                            <DialogDescription>
                                Search for a user to start a conversation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-secondary border-border"
                                    autoFocus
                                />
                            </div>
                            {searchQuery.length >= 2 && (
                                <div className="max-h-48 overflow-auto rounded-md border border-border bg-muted/30 p-2 space-y-1">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : users.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No users found. Try a different search.
                                        </p>
                                    ) : (
                                        users.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                className="w-full flex items-center gap-3 rounded-md p-2 text-left hover:bg-muted transition-colors"
                                                onClick={() => {
                                                    const id = user.id ?? (user as { _id?: string })._id;
                                                    if (id) handleSelectUser(String(id));
                                                }}
                                            >
                                                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                                                    {user.avatar ? (
                                                        <Image
                                                            src={user.avatar}
                                                            alt={user.firstname || "User"}
                                                            width={32}
                                                            height={32}
                                                            className="h-full w-full object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium">
                                                            {(user.firstname?.[0] || user.email[0] || "?").toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {user.firstname || user.lastname
                                                            ? [user.firstname, user.lastname].filter(Boolean).join(" ")
                                                            : "User"}
                                                    </p>
                                                    {/* <p className="text-xs text-muted-foreground truncate">
                                                        {user.email}
                                                    </p> */}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="hover:bg-chat-hover"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
