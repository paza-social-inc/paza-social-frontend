'use client'

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { messagesApi } from "@/lib/data/messages";

interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface UserInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  avatar: string;
  userId?: string;
}

export function UserInfoSheet({
  open,
  onOpenChange,
  username,
  avatar,
  userId,
}: UserInfoSheetProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    setProfile(null);
    messagesApi.getUserById(userId)
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [open, userId]);

  const displayName = profile
    ? `${profile.firstname ?? ''} ${profile.lastname ?? ''}`.trim() || username
    : username;

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
              <AvatarImage src={avatar} alt={displayName} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                {displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-2xl font-semibold">{displayName}</h3>
              <Badge variant="secondary" className="mt-2">Active</Badge>
            </div>
          </div>


          {/* Contact Information */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : profile ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                        <p className="text-xs text-muted-foreground">Member since</p>
                        <p className="text-sm font-medium">
                        {profile ? "PAZA Member" : "User"}
                        </p>
                    </div>
                    </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account type</p>
                    <p className="text-sm font-medium capitalize">
                      {/* accountType not returned by getById: add later */}
                      User
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Could not load profile information.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}