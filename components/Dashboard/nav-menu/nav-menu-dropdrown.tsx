import {
    ChevronDownIcon,
    LogOutIcon,
    ChevronUp,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/store/auth/useAuth";

export default function UserDropDown() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("token");
        }
        logout();
        router.push("/login");
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={() => setIsOpen(!isOpen)}>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar || "./avatar.jpg"} alt="Profile image" />
                        <AvatarFallback>
                            {(user?.firstname?.[0] || user?.email?.[0] || "U").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isOpen ? <ChevronUp
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    /> : <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent id="user-dropdown" className="max-w-72 w-full md:min-w-64!">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        {user?.firstname || user?.lastname
                            ? `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim()
                            : user?.email ?? "User"}
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        {user?.email ?? ""}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

