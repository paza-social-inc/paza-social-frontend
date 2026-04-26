"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { messagesApi } from "@/lib/data/messages"
import { notificationsApi } from "@/lib/data/notifications"
import {
    FRONTEND_TASK_NOTIFICATIONS_QUERY_KEY,
    getFrontendTaskNotifications,
    markAllFrontendTaskNotificationsRead,
    markFrontendTaskNotificationRead,
    subscribeFrontendTaskNotifications,
    type FrontendTaskNotificationRow,
} from "@/lib/frontendTaskNotifications"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RiNotificationLine } from "@remixicon/react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

function Dot({ className }: { className?: string }) {
    return (
        <svg
            width="6"
            height="6"
            fill="currentColor"
            viewBox="0 0 6 6"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <circle cx="3" cy="3" r="3" />
        </svg>
    )
}

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const
const CONVERSATIONS_QUERY_KEY = ["conversations"] as const

function isFrontendTaskNotificationId(id: number | string): id is string {
    return typeof id === "string" && id.startsWith("ftn-")
}

function formatChatTime(value?: string): string {
    if (!value) return ""
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString()
}

export default function NotificationMenu() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEY,
        queryFn: () => notificationsApi.getList(),
    })
    const { data: taskNotifications = [] } = useQuery({
        queryKey: FRONTEND_TASK_NOTIFICATIONS_QUERY_KEY,
        queryFn: () => getFrontendTaskNotifications(),
    })

    useEffect(() => {
        return subscribeFrontendTaskNotifications(() => {
            void queryClient.invalidateQueries({
                queryKey: FRONTEND_TASK_NOTIFICATIONS_QUERY_KEY,
            })
        })
    }, [queryClient])
    const { data: conversations = [] } = useQuery({
        queryKey: CONVERSATIONS_QUERY_KEY,
        queryFn: () => messagesApi.getConversations(),
    })
    const unreadNotifications = notifications.filter((n) => n.unread)
    const unreadTaskNotifications = taskNotifications.filter((n) => n.unread)
    const unreadConversations = conversations.filter((c) => (c.unreadCount ?? 0) > 0)
    const notificationUnread =
        unreadNotifications.length + unreadTaskNotifications.length
    const inboxUnread = unreadConversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0)
    const unreadCount = notificationUnread + inboxUnread

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationsApi.markAllRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
        },
    })

    const markOneReadMutation = useMutation({
        mutationFn: (id: number) => notificationsApi.markRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
        },
    })

    const markConversationReadMutation = useMutation({
        mutationFn: (id: string) => messagesApi.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY })
        },
    })

    const handleMarkAllAsRead = () => {
        if (unreadNotifications.length > 0) markAllReadMutation.mutate()
        if (unreadTaskNotifications.length > 0) {
            markAllFrontendTaskNotificationsRead()
            void queryClient.invalidateQueries({
                queryKey: FRONTEND_TASK_NOTIFICATIONS_QUERY_KEY,
            })
        }
    }

    const handleNotificationClick = (id: number | string) => {
        if (isFrontendTaskNotificationId(id)) {
            const row = taskNotifications.find((n) => n.id === id)
            if (row?.unread) markFrontendTaskNotificationRead(id)
            if (row?.href) router.push(row.href)
            return
        }
        const notification = notifications.find((n) => n.id === id)
        if (notification?.unread) markOneReadMutation.mutate(id)
        if (notification?.href) router.push(notification.href)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant="secondary"
                    className="relative rounded-full"
                    aria-label="Open notifications"
                >
                    <RiNotificationLine size={16} aria-hidden="true" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-1">
                <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                    <div className="text-sm font-semibold">Notifications</div>
                    {(unreadNotifications.length > 0 ||
                        unreadTaskNotifications.length > 0) && (
                        <button
                            className="text-xs font-medium hover:underline"
                            onClick={handleMarkAllAsRead}
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                {inboxUnread > 0 && (
                    <Link
                        href="/inbox"
                        className="text-muted-foreground hover:text-foreground mx-3 mb-1 block text-xs font-medium underline-offset-2 hover:underline"
                    >
                        {inboxUnread} unread message{inboxUnread !== 1 ? "s" : ""} in Inbox
                    </Link>
                )}
                <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="bg-border -mx-1 my-1 h-px"
                ></div>
                {unreadConversations.length > 0 && (
                    <div className="px-3 pb-2">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Chats
                        </div>
                        <div className="max-h-44 overflow-y-auto space-y-1">
                            {unreadConversations.map((c) => {
                                const unread = true
                                const name = c.otherParticipant?.name ?? "User"
                                const preview = c.lastMessage?.trim() || "No messages yet"
                                return (
                                    <Link
                                        key={`chat-${c._id}`}
                                        href="/inbox"
                                        onClick={() => {
                                            if (unread) markConversationReadMutation.mutate(c._id)
                                        }}
                                        className="hover:bg-accent block rounded-md px-2 py-1.5 text-xs transition-colors"
                                    >
                                        <div className="relative pe-4">
                                            <p className="font-medium text-foreground truncate">{name}</p>
                                            <p className="text-muted-foreground truncate">{preview}</p>
                                            {c.lastMessageAt ? (
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    {formatChatTime(c.lastMessageAt)}
                                                </p>
                                            ) : null}
                                            {unread ? (
                                                <span className="absolute right-0 top-1 inline-flex items-center gap-1 text-[10px] text-primary">
                                                    <Dot />
                                                    {c.unreadCount}
                                                </span>
                                            ) : null}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
                <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="bg-border -mx-1 my-1 h-px"
                ></div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : unreadNotifications.length === 0 &&
                  unreadTaskNotifications.length === 0 &&
                  unreadConversations.length === 0 ? (
                    <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                        No notifications yet
                    </p>
                ) : (
                    <>
                        {unreadTaskNotifications.length > 0 && (
                            <div className="px-3 pb-2">
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Tasks
                                </div>
                                <div className="max-h-44 space-y-1 overflow-y-auto">
                                    {unreadTaskNotifications.map(
                                        (notification: FrontendTaskNotificationRow) => (
                                            <div
                                                key={notification.id}
                                                className="hover:bg-accent rounded-md px-2 py-1.5 text-sm transition-colors"
                                            >
                                                <div className="relative flex items-start pe-3">
                                                    <div className="flex-1 space-y-1">
                                                        <button
                                                            className="text-foreground/80 text-left after:absolute after:inset-0"
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <span className="text-foreground block text-xs font-medium hover:underline">
                                                                {notification.user}
                                                            </span>
                                                            {notification.action ? (
                                                                <span className="text-muted-foreground mt-0.5 block text-[11px] leading-snug">
                                                                    {notification.action}
                                                                </span>
                                                            ) : null}
                                                        </button>
                                                        <div className="text-muted-foreground text-[10px]">
                                                            {notification.timestamp}
                                                        </div>
                                                    </div>
                                                    {notification.unread && (
                                                        <div className="absolute end-0 self-center">
                                                            <span className="sr-only">Unread</span>
                                                            <Dot />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {unreadTaskNotifications.length > 0 &&
                            unreadNotifications.length > 0 && (
                                <div
                                    role="separator"
                                    aria-orientation="horizontal"
                                    className="bg-border -mx-1 my-1 h-px"
                                ></div>
                            )}
                        {unreadNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
                            >
                                <div className="relative flex items-start pe-3">
                                    <div className="flex-1 space-y-1">
                                        <button
                                            className="text-foreground/80 text-left after:absolute after:inset-0"
                                            onClick={() =>
                                                handleNotificationClick(notification.id)
                                            }
                                        >
                                            <span className="text-foreground block font-medium hover:underline">
                                                {notification.user}
                                            </span>
                                            {notification.action ? (
                                                <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
                                                    {notification.action}
                                                </span>
                                            ) : null}
                                        </button>
                                        <div className="text-muted-foreground text-xs">
                                            {notification.timestamp}
                                        </div>
                                    </div>
                                    {notification.unread && (
                                        <div className="absolute end-0 self-center">
                                            <span className="sr-only">Unread</span>
                                            <Dot />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}
