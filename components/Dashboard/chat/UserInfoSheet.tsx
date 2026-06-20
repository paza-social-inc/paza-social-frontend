'use client'

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import {
  RiInstagramLine,
  RiTiktokLine,
  RiTwitterXLine,
  RiYoutubeLine,
  RiLinkedinLine,
  RiFacebookLine,
} from "@remixicon/react";
import { messagesApi } from "@/lib/data/messages";

interface UserProfile {
  id: string;
  email: string | null;
  firstname: string;
  lastname: string;
  accountType?: string;
  phone: string | null;
  location: string | null;
  socials: {
    instagram: string | null;
    tiktok: string | null;
    twitter: string | null;
    youtube: string | null;
    linkedin: string | null;
    facebook: string | null;
  } | null;
  profileVisibility: {
    email: boolean;
    phone: boolean;
    location: boolean;
    socials: boolean;
  };
}

interface UserInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  avatar: string;
  userId?: string;
}

const SOCIAL_CONFIG = [
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: RiInstagramLine,
    color: "text-pink-500",
    baseUrl: "https://instagram.com/",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    icon: RiTiktokLine,
    color: "text-foreground",
    baseUrl: "https://tiktok.com/@",
  },
  {
    key: "twitter" as const,
    label: "Twitter / X",
    icon: RiTwitterXLine,
    color: "text-sky-500",
    baseUrl: "https://x.com/",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    icon: RiYoutubeLine,
    color: "text-red-500",
    baseUrl: "https://youtube.com/@",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: RiLinkedinLine,
    color: "text-blue-600",
    baseUrl: "https://linkedin.com/in/",
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: RiFacebookLine,
    color: "text-blue-500",
    baseUrl: "https://facebook.com/",
  },
];

function accountTypeLabel(accountType?: string): string {
  if (!accountType || accountType === "None") return "PAZA Member";
  if (accountType === "Business") return "Brand";
  return accountType;
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
    messagesApi
      .getUserById(userId)
      .then((data) => {
        // #region agent log
        fetch('http://127.0.0.1:7652/ingest/df3d88ac-8592-4007-bdc8-b681ec8fbbe9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'bdaae3'},body:JSON.stringify({sessionId:'bdaae3',location:'UserInfoSheet.tsx:load',message:'inbox profile loaded',data:{userId,email:data?.email,phone:data?.phone,location:data?.location,visibility:data?.profileVisibility},timestamp:Date.now(),hypothesisId:'D',runId:'post-fix'})}).catch(()=>{});
        // #endregion
        setProfile(data);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [open, userId]);

  const displayName = profile
    ? `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() || username
    : username;

  const activeSocials = profile?.socials
    ? SOCIAL_CONFIG.filter((s) => profile.socials![s.key])
    : [];

    // const activeSocials = profile?.socials
    //     ? SOCIAL_CONFIG.filter((s) => (profile.socials as Record<string, string | null>)[s.key])
    //     : [];
  const hasContactInfo = profile?.email || profile?.phone || profile?.location;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
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
              <Badge variant="secondary" className="mt-2">
                {profile ? accountTypeLabel(profile.accountType) : "Active"}
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : profile ? (
            <>
              {/* Contact Information */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Contact Information
                </h4>

                {hasContactInfo ? (
                  <>
                    {profile.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="w-5 h-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium truncate">{profile.email}</p>
                        </div>
                      </div>
                    )}

                    {profile.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium">{profile.phone}</p>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium">{profile.location}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    This user has kept their contact info private.
                  </p>
                )}
              </div>

                {/* Socials */}
                {activeSocials.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Social Media
                  </h4>
                  {activeSocials.map(({ key, label, icon: Icon, color, baseUrl }) => {
                    const handle =
                      (profile.socials as Record<string, string | null>)[key] ?? "";
                    if (!handle) return null;
                    const url = handle.startsWith("http") ? handle : `${baseUrl}${handle}`;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm font-medium truncate">{handle}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Could not load profile information.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}