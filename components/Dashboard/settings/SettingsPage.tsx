"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CreditCard, Settings, Shield, User } from "lucide-react";
import { useState } from "react";
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
        <div className="bg-background flex flex-col min-h-screen p-6 lg:p-8">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                <TabsList className="w-full h-12">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <TabsTrigger key={item.id} value={item.id}>
                                <div className="flex items-center">
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}

                                </div>
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
