"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CreditCard, Settings, Shield, User, Users, Eye } from "lucide-react";
import { RiStore2Line } from "@remixicon/react";
import { useState } from "react";
import { DASHBOARD_TABS_LIST_CLASS } from "@/components/layout/DashboardPageShell";
import { BillingSection } from "./sections/BillingSection";
import { IntegrationsSection } from "./sections/IntergrationsSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { ProfileSection } from "./sections/ProfileSection";
import { SecuritySection } from "./sections/SecuritySection";
import { TeamSection } from "./sections/TeamSection";
import BrandProfileView from "../brand/BrandProfileView";
import { PrivacySection } from "./sections/PrivacySection";
import { useAuth } from "@/hooks/store/auth/useAuth";

const sidebarItems: { id: string; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "team", label: "Team", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Eye }, 
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Settings }
];

export function SettingsPage() {
    const { user } = useAuth();
    const isBusiness = user?.accountType?.toLowerCase() === "business" || user?.accountType?.toLowerCase() === "brand";

    const items = [...sidebarItems];
    if (isBusiness && !items.find(i => i.id === "brand")) {
        // Insert after profile
        items.splice(1, 0, { id: "brand", label: "Brand Profile", icon: RiStore2Line });
    }

    const [activeSection, setActiveSection] = useState("profile");

    return (
        <div className="flex min-h-[60vh] flex-col bg-background">
            {/* <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full min-w-0"> */}
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full min-w-0" suppressHydrationWarning>
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
                <TabsContent value="privacy" className="mt-6 border-0">
                     <PrivacySection />
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
