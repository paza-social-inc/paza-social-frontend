import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    RiFacebookCircleLine,
    RiInstagramLine,
    RiLinkedinLine,
    RiTiktokLine,
    RiTwitterXLine,
    RiYoutubeLine,
    RiLoader2Line,
    RiCheckLine,
    RiExternalLinkLine,
    RiLinkUnlinkM,
} from "@remixicon/react";
import {
    getSocialAuthUrl,
    getConnectedSocials,
    disconnectSocial,
    getAuthToken,
    SocialPlatform,
    ConnectedSocial,
    NotAuthenticatedError,
} from "@/lib/data/socialVerification";
import { useAuth } from "@/hooks/store/auth/useAuth";
import toast from "react-hot-toast";

const socialPlatforms: { name: string; id: SocialPlatform; icon: React.ReactNode; description: string }[] = [
    {
        id: "youtube",
        name: "YouTube",
        description: "Verify your channel to enable reach monitoring",
        icon: <RiYoutubeLine className="text-[#FF0000]" />,
    },
    {
        id: "tiktok",
        name: "TikTok",
        description: "Connect your TikTok account for campaign insights",
        icon: <RiTiktokLine />,
    },
    {
        id: "instagram",
        name: "Instagram",
        description: "Sync your professional Instagram account",
        icon: <RiInstagramLine className="text-[#E4405F]" />,
    },
    {
        id: "facebook",
        name: "Facebook",
        description: "Connect your brand page",
        icon: <RiFacebookCircleLine className="text-[#1877F2]" />,
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        description: "Professional reach and networking verification",
        icon: <RiLinkedinLine className="text-[#0A66C2]" />,
    },
    {
        id: "x",
        name: "X (Twitter)",
        description: "Verify your X account identity",
        icon: <RiTwitterXLine />,
    },
];

type PlatformData = Record<string, string | number | boolean | undefined | null>;

/**
 * Extract a human-friendly summary (display label + follower metric + profile url)
 * from the saved platformData for a given platform. Each provider stores
 * different fields; this normalizes them for display.
 */
function describeConnected(
    platform: SocialPlatform,
    data: Record<string, unknown> | undefined
): { label: string; metric?: string; url?: string } {
    const d = (data || {}) as PlatformData;
    const formatCount = (n: number | undefined | null): string | undefined => {
        if (n === undefined || n === null || Number.isNaN(Number(n))) return undefined;
        const num = Number(n);
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M followers`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K followers`;
        return `${num} followers`;
    };

    switch (platform) {
        case "youtube":
            return {
                label: (d.channelTitle as string) || (d.title as string) || "YouTube channel",
                metric: formatCount(d.subscriberCount as number | null),
                url: d.url as string | undefined,
            };
        case "tiktok":
            return {
                label: (d.displayName as string) || (d.username as string) || "TikTok account",
                url: d.url as string | undefined,
            };
        case "instagram":
            return {
                label: d.username ? `@${d.username}` : "Instagram account",
                metric: formatCount(d.followerCount as number | null),
                url: d.url as string | undefined,
            };
        case "facebook":
            return {
                label: (d.name as string) || "Facebook page",
                url: d.url as string | undefined,
            };
        case "linkedin":
            return {
                label: (d.name as string) || "LinkedIn profile",
                url: d.url as string | undefined,
            };
        case "x":
            return {
                label: d.username ? `@${d.username}` : "X account",
                metric: formatCount(d.followerCount as number | null),
                url: d.url as string | undefined,
            };
        default:
            return { label: "Connected account", url: d.url as string | undefined };
    }
}

const POLL_INTERVAL_MS = 3_000;
const POLL_TIMEOUT_MS = 3 * 60 * 1_000; // 3 minutes max

export function IntegrationsSection() {
    useAuth();
    const [loadingPlatform, setLoadingPlatform] = React.useState<string | null>(null);
    const [connected, setConnected] = React.useState<Record<string, ConnectedSocial>>({});
    const [loadingList, setLoadingList] = React.useState(true);
    const [disconnecting, setDisconnecting] = React.useState<string | null>(null);

    // Refs so the polling loop can read fresh state without restarting.
    const connectedRef = React.useRef(connected);
    connectedRef.current = connected;

    const refreshConnected = React.useCallback(async (silent = false): Promise<ConnectedSocial[]> => {
        try {
            const list = await getConnectedSocials();
            // getConnectedSocials returns [] on 401 (token expired) without throwing,
            // so an empty result here does NOT necessarily mean an error.
            const map: Record<string, ConnectedSocial> = {};
            for (const item of list) map[item.platform] = item;
            setConnected(map);
            return list;
        } catch (err) {
            // Only show a toast if this is the initial load (not polling).
            if (!silent) {
                console.error("[IntegrationsSection] Failed to fetch connected accounts:", err);
                toast.error("Could not load connected accounts. Please refresh.");
            }
            return [];
        } finally {
            setLoadingList(false);
        }
    }, []);

    React.useEffect(() => {
        refreshConnected();
    }, [refreshConnected]);

    // When the user returns to this tab after the OAuth flow (same-tab fallback),
    // reset the spinner and re-fetch.
    React.useEffect(() => {
        const reset = () => setLoadingPlatform(null);
        window.addEventListener("pageshow", reset);
        const onVisibility = () => {
            if (document.visibilityState === "visible") {
                reset();
                refreshConnected();
            }
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("pageshow", reset);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [refreshConnected]);

    /**
     * Poll the GET endpoint every POLL_INTERVAL_MS until the given platform
     * appears as connected (or we time out). Returns true on success.
     */
    const pollUntilConnected = React.useCallback(
        (platform: SocialPlatform): Promise<void> => {
            return new Promise<void>((resolve) => {
                const start = Date.now();
                const timer = setInterval(async () => {
                    // Stop if the user navigated away or timed out.
                    if (Date.now() - start > POLL_TIMEOUT_MS) {
                        clearInterval(timer);
                        resolve();
                        return;
                    }
                    try {
                        const list = await getConnectedSocials();
                        // getConnectedSocials returns [] on 401 — that means
                        // the token expired; stop polling rather than looping forever.
                        if (list.length === 0 && !getAuthToken()) {
                            clearInterval(timer);
                            resolve();
                            return;
                        }
                        // Merge into state regardless — keeps UI up to date.
                        const map: Record<string, ConnectedSocial> = {};
                        for (const item of list) map[item.platform] = item;
                        setConnected(map);

                        if (list.some((r) => r.platform === platform && r.isVerified)) {
                            clearInterval(timer);
                            resolve();
                        }
                    } catch {
                        // Network hiccup — keep polling.
                    }
                }, POLL_INTERVAL_MS);

                // Cleanup if component unmounts mid-poll.
                pollTimerRef.current = timer;
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    // Ref to allow cleanup on unmount.
    const pollTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    React.useEffect(() => {
        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        };
    }, []);

    const handleConnect = async (platform: SocialPlatform) => {
        try {
            const url = getSocialAuthUrl(platform);
            const platformLabel = socialPlatforms.find((p) => p.id === platform)?.name ?? "Account";

            setLoadingPlatform(platform);

            // Try opening in a new tab first (better UX — user keeps the settings page open).
            const newTab = window.open(url, "_blank");
            if (newTab) {
                // Sever opener to prevent reverse-tabnabbing.
                newTab.opener = null;

                // Show "waiting" toast while the user completes OAuth in the other tab.
                const waitingToast = toast.loading(`Connecting ${platformLabel}… Complete the login in the other tab.`, {
                    duration: Infinity,
                    id: `connect-${platform}`,
                });

                // Poll the backend until the connection appears.
                await pollUntilConnected(platform);

                // Check if it actually connected (from the latest state).
                const didConnect = !!connectedRef.current[platform]?.isVerified;
                toast.dismiss(waitingToast);

                if (didConnect) {
                    toast.success(`${platformLabel} connected successfully!`);
                } else {
                    toast.error(`${platformLabel} connection timed out. Check the other tab or try again.`);
                }
            } else {
                // Popup blocked — fall back to same-tab navigation.
                toast("Popup blocked — connecting in this tab instead…", { icon: "⚠️" });
                window.location.href = url;
                // Same-tab: the app will remount on /settings?verification=success,
                // and SettingsPage's useEffect handles the toast + tab switch.
            }
        } catch (err) {
            if (err instanceof NotAuthenticatedError) {
                toast.error("Please log in to connect an account.");
            } else {
                toast.error("Could not initiate verification");
            }
            setLoadingPlatform(null);
        }
    };

    const handleDisconnect = async (platform: SocialPlatform) => {
        setDisconnecting(platform);
        try {
            await disconnectSocial(platform);
            setConnected((prev) => {
                const next = { ...prev };
                delete next[platform];
                return next;
            });
            toast.success(`${socialPlatforms.find((p) => p.id === platform)?.name ?? "Account"} disconnected.`);
        } catch {
            toast.error("Could not disconnect. Please try again.");
        } finally {
            setDisconnecting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Social Verification</h1>
                <p className="text-muted-foreground mt-1">
                    Connect your social accounts to verify your reach and unlock platform-linked features.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => {
                    const record = connected[platform.id];
                    const isConnected = !!record?.isVerified;
                    const info = isConnected ? describeConnected(platform.id, record.platformData) : null;
                    const isBusy = loadingPlatform === platform.id || disconnecting === platform.id;

                    return (
                        <Card key={platform.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="text-3xl p-3 bg-muted rounded-xl">
                                            {platform.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{platform.name}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                                                {platform.description}
                                            </p>
                                        </div>
                                    </div>
                                    {isConnected && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium px-2.5 py-1">
                                            <RiCheckLine className="h-3.5 w-3.5" />
                                            Connected
                                        </span>
                                    )}
                                </div>

                                {isConnected && info && (
                                    <div className="mt-4 rounded-lg bg-muted/60 p-3 text-sm">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-medium truncate">{info.label}</span>
                                            {info.url && (
                                                <a
                                                    href={info.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                                                >
                                                    View profile
                                                    <RiExternalLinkLine className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
                                        {info.metric && (
                                            <p className="text-muted-foreground mt-1">{info.metric}</p>
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 flex gap-2">
                                    {!isConnected && (
                                        <Button
                                            className="w-full h-11 rounded-xl"
                                            variant="outline"
                                            onClick={() => handleConnect(platform.id)}
                                            disabled={isBusy || loadingList}
                                        >
                                            {loadingPlatform === platform.id ? (
                                                <>
                                                    <RiLoader2Line className="animate-spin mr-2 h-4 w-4" />
                                                    Connecting…
                                                </>
                                            ) : (
                                                "Connect Account"
                                            )}
                                        </Button>
                                    )}
                                    {isConnected && (
                                        <>
                                            <Button
                                                className="flex-1 h-11 rounded-xl"
                                                variant="outline"
                                                onClick={() => handleConnect(platform.id)}
                                                disabled={isBusy}
                                            >
                                                Reconnect
                                            </Button>
                                            <Button
                                                className="flex-1 h-11 rounded-xl"
                                                variant="ghost"
                                                onClick={() => handleDisconnect(platform.id)}
                                                disabled={isBusy}
                                            >
                                                {disconnecting === platform.id ? (
                                                    <RiLoader2Line className="animate-spin mr-2 h-4 w-4" />
                                                ) : (
                                                    <RiLinkUnlinkM className="mr-2 h-4 w-4" />
                                                )}
                                                Disconnect
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
