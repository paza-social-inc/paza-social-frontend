import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react";


export default function ChatHeader({
    username,
    avatar,
    onUserClick
}: {
    username: string;
    avatar: string;
    onUserClick?: (username: string, avatar: string) => void;

}) {
    return (
        <motion.div
            onClick={() => {
                if (onUserClick && username && avatar) {
                    onUserClick(username, avatar);
                }
            }}
            className={cn(
                "w-full p-3 border-b bg-card transition-all duration-200 sticky right-0 top-0",
            )}
        >
            <div className="flex items-start flex-1 w-full justify-between gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={avatar} alt={username} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="">
                    <Button size="icon" variant="outline">
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
