
import {
    BoltIcon,
    BookOpenIcon,
    ChevronDownIcon,
    Layers2Icon,
    LogOutIcon,
    PinIcon,
    UserPenIcon,
    ChevronUp
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
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function UserDropDown() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={() => setIsOpen(!isOpen)}>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="./avatar.jpg" alt="Profile image" />
                        <AvatarFallback>KK</AvatarFallback>
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
            <DropdownMenuContent className="max-w-72 w-full md:!min-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        Keith Kennedy
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        k.kennedy@paza.com
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Option 1</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Option 2</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Option 3</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <PinIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Option 4</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
                        <span>Option 5</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

