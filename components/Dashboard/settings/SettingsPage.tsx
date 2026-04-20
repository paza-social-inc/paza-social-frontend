"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CreditCard, Settings, Shield, User } from "lucide-react";
import { useState } from "react";
import { DASHBOARD_TABS_LIST_CLASS } from "@/components/layout/DashboardPageShell";
import { BillingSection } from "./sections/BillingSection";
import { IntegrationsSection } from "./sections/IntergrationsSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { ProfileSection } from "./sections/ProfileSection";
import { SecuritySection } from "./sections/SecuritySection";



const sidebarItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Settings }
];

export function SettingsPage() {
    const [activeSection, setActiveSection] = useState("profile");

    return (
        <div className="flex min-h-[60vh] flex-col bg-background">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full min-w-0">
                <TabsList className={DASHBOARD_TABS_LIST_CLASS}>
                    {sidebarItems.map((item) => {
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
