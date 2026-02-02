import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";

interface UserInfoSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    username: string;
    avatar: string;
    email?: string;
    phone?: string;
    location?: string;
}

export function UserInfoSheet({
    open,
    onOpenChange,
    username,
    avatar,
    email = `${username?.toLowerCase().replace(" ", ".")}@example.com`,
    phone = "+1 (555) 123-4567",
    location = "San Francisco, CA",
}: UserInfoSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>User Information</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Avatar and Name */}
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                            <AvatarImage src={avatar} alt={username} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                                {username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold">{username}</h3>
                            <Badge variant="secondary" className="mt-2">Active</Badge>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Contact Information
                        </h4>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Mail className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">{email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Phone className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="text-sm font-medium">{phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <MapPin className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
