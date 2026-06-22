"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ArrowRight } from "lucide-react";

export default function ChatHeader({
    username,
    avatar,
    userId,
    onUserClick,
    onBack,
  }: {
    username: string;
    avatar: string;
    userId?: string;
    onUserClick?: (username: string, avatar: string, userId?: string) => void;
    onBack?: () => void;
  }) {
    return (
      <motion.div className="w-full p-3 sm:p-4 border-b bg-card/95 backdrop-blur supports-[padding:env(safe-area-inset)]:pt-[env(safe-area-inset-top)] sticky left-0 right-0 top-0 z-10">
        <div className="flex items-center flex-1 w-full gap-3">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden shrink-0 h-10 w-10 rounded-full touch-manipulation"
              aria-label="Back to conversations"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <button
            type="button"
            onClick={() => onUserClick?.(username, avatar, userId)}
            className="flex items-center gap-3 min-w-0 flex-1 text-left touch-manipulation"
          >
            <Avatar className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 ring-2 ring-primary/20">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm sm:text-base truncate">{username}</span>
          </button>
          <Button size="icon" variant="outline" className="hidden md:flex shrink-0">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }