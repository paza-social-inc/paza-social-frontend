"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Optional WebSocket URL for instant inbox updates (e.g. ws://localhost:8000/ws or wss://api.example.com/ws).
 * When set, the client connects with ?token=<jwt> and listens for JSON messages.
 * Backend should send: { type: "new_message", conversationId } or { type: "conversation_updated", conversationId? }.
 */
const WS_URL = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_WS_URL : undefined;

type InboxWsMessage =
    | { type: "new_message"; conversationId: string }
    | { type: "conversation_updated"; conversationId?: string };

function getWsUrl(): string | null {
    if (typeof window === "undefined" || !WS_URL) return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    const url = new URL(WS_URL);
    url.searchParams.set("token", token);
    return url.toString();
}

export function useInboxWebSocket(enabled: boolean = true) {
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectAttempts = useRef(0);
    const cancelledRef = useRef(false);

    useEffect(() => {
        if (!enabled) return;
        cancelledRef.current = false;

        const url = getWsUrl();
        if (!url) return;

        const connect = () => {
            if (cancelledRef.current) return;
            try {
                const ws = new WebSocket(url);
                wsRef.current = ws;

                ws.onopen = () => {
                    reconnectAttempts.current = 0;
                };

                ws.onmessage = (event: MessageEvent) => {
                    try {
                        const data = JSON.parse(event.data) as InboxWsMessage;
                        if (data.type === "new_message" && data.conversationId) {
                            queryClient.invalidateQueries({ queryKey: ["messages", data.conversationId] });
                            queryClient.invalidateQueries({ queryKey: ["conversations"] });
                        } else if (data.type === "conversation_updated") {
                            queryClient.invalidateQueries({ queryKey: ["conversations"] });
                            if (data.conversationId) {
                                queryClient.invalidateQueries({ queryKey: ["messages", data.conversationId] });
                            }
                        }
                    } catch {
                        // ignore non-JSON or unknown payloads
                    }
                };

                ws.onclose = () => {
                    wsRef.current = null;
                    if (cancelledRef.current) return;
                    const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
                    reconnectAttempts.current += 1;
                    reconnectTimeoutRef.current = setTimeout(connect, delay);
                };

                ws.onerror = () => {
                    ws.close();
                };
            } catch {
                // connection failed; polling will keep data fresh
            }
        };

        connect();

        return () => {
            cancelledRef.current = true;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [enabled, queryClient]);

    return { isSupported: !!WS_URL };
}
