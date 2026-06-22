"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CreditCard, Settings, Shield, User, Users, /* Eye */ } from "lucide-react";
import { RiStore2Line } from "@remixicon/react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { DASHBOARD_TABS_LIST_CLASS } from "@/components/layout/DashboardPageShell";
import { BillingSection } from "./sections/BillingSection";
import { IntegrationsSection } from "./sections/IntergrationsSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { ProfileSection } from "./sections/ProfileSection";
import { SecuritySection } from "./sections/SecuritySection";
import { TeamSection } from "./sections/TeamSection";
import BrandProfileView from "../brand/BrandProfileView";
// import { PrivacySection } from "./sections/PrivacySection";
import { useAuth } from "@/hooks/store/auth/useAuth";

const sidebarItems: { id: string; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "team", label: "Team", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Settings }
];

export function SettingsPage() {
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isBusiness = useMemo(() => {
    const accountType = user?.accountType?.toLowerCase();
    return accountType === "business" || accountType === "brand";
  }, [user?.accountType]);

  const items = useMemo(() => {
    const nextItems = [...sidebarItems];

    if (isBusiness) {
      nextItems.splice(1, 0, {
        id: "brand",
        label: "Brand Profile",
        icon: RiStore2Line,
      });
    }

    return nextItems;
  }, [isBusiness]);

  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);
    const verification = params.get("verification");

    if (!verification) return;

    const platformId = params.get("platform") ?? "";
    const reason = params.get("reason") ?? "";

    const platformLabels: Record<string, string> = {
      youtube: "YouTube",
      tiktok: "TikTok",
      instagram: "Instagram",
      facebook: "Facebook",
      linkedin: "LinkedIn",
      x: "X (Twitter)",
    };

    const label = platformLabels[platformId] ?? "account";

    if (verification === "success") {
      toast.success(`${label} connected successfully`);
    } else {
      const reasonMessages: Record<string, string> = {
        no_pages: "No Facebook Page is linked to your account.",
        no_instagram_account:
          "No Instagram Business account is linked to your Page.",
      };

      toast.error(
        reasonMessages[reason] ??
          `Could not connect ${label}. Please try again.`
      );
    }

    setActiveSection("integrations");

    params.delete("verification");
    params.delete("platform");
    params.delete("reason");

    const query = params.toString();

    window.history.replaceState(
      {},
      "",
      window.location.pathname + (query ? `?${query}` : "")
    );
  }, [mounted]);

  if (!mounted) {
    return <div className="min-h-[60vh] bg-background" />;
  }

    return (
        <div className="flex min-h-[60vh] flex-col bg-background">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full min-w-0">
                <TabsList className={DASHBOARD_TABS_LIST_CLASS}>
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <TabsTrigger key={item.id} value={item.id} className="gap-1.5 px-2.5 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                                <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                                <span className="truncate">{item.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                <TabsContent value="profile" className="mt-6 border-0">
                    <ProfileSection />
                </TabsContent>
                <TabsContent value="brand" className="mt-6 border-0">
                    <BrandProfileView />
                </TabsContent>
                <TabsContent value="team" className="mt-6 border-0">
                    <TeamSection />
                </TabsContent>
                <TabsContent value="security" className="mt-6 border-0">
                    <SecuritySection />
                </TabsContent>
                <TabsContent value="notifications" className="mt-6 border-0">
                    <NotificationsSection />
                </TabsContent>
                <TabsContent value="billing" className="mt-6 border-0">
                    <BillingSection />
                </TabsContent>
                <TabsContent value="integrations" className="mt-6 border-0">
                    <IntegrationsSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}