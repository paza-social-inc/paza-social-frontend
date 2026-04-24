"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/data/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell, CheckCheck, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NotificationsClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { data: notifications = [], isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationsApi.getList(),
    });

    const markReadMutation = useMutation({
        mutationFn: (id: number) => notificationsApi.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationsApi.markAllRead(),
        onSuccess: () => {
            toast.success("All notifications marked as read");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: () => {
            toast.error("Failed to mark all as read");
        },
    });

    const handleNotificationClick = (id: number) => {
        const selected = notifications.find((n) => n.id === id);
        if (selected?.unread) {
            markReadMutation.mutate(id);
        }
        if (selected?.href) {
            router.push(selected.href);
        }
    };

    const handleMarkAllRead = () => {
        if (notifications.some(n => n.unread)) {
            markAllReadMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <p className="text-destructive font-medium">Failed to load notifications.</p>
                <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })}
                >
                    Try again
                </Button>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Bell className="h-6 w-6 text-primary" />
                        Notifications
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your alerts and activity updates
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={handleMarkAllRead}
                        disabled={markAllReadMutation.isPending}
                    >
                        {markAllReadMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCheck className="h-4 w-4" />
                        )}
                        Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-muted rounded-full p-4 mb-4">
                            <Bell className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No notifications yet</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-2">
                            When you get activity updates from campaigns, jobs, or payments, they&apos;ll appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <Card 
                            key={n.id} 
                            className={`border-border transition-colors ${n.unread ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted/30'}`}
                            onClick={() => handleNotificationClick(n.id)}
                        >
                            <CardContent className="p-4 flex items-start gap-4 cursor-pointer">
                                <div className={`mt-1 p-2 rounded-full ${n.unread ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <Bell className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className={`text-sm font-semibold truncate ${n.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {n.user}
                                        </h3>
                                        {n.unread && (
                                            <Badge variant="default" className="text-[10px] px-1.5 py-0">New</Badge>
                                        )}
                                    </div>
                                    <p className={`text-sm mt-1 leading-relaxed ${n.unread ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                                        {n.action}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {n.timestamp}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
