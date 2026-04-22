"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { fetchAuthMe } from "@/lib/data/auth";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DepositTransferDialog,
  type DepositTransferTab,
} from "@/components/Dashboard/payments/DepositTransferDialog";
import { walletPaymentsApi } from "@/lib/data/walletPayments";
import {
  escrowPaymentsApi,
  type EscrowListItem,
} from "@/lib/data/escrowPayments";
import EscrowDetailsModal from "@/components/Dashboard/payments/EscrowDetailsModal";

function personName(p?: { firstName?: string; lastName?: string; email?: string }): string {
  const n = [p?.firstName, p?.lastName].filter(Boolean).join(" ").trim();
  return n || p?.email || "User";
}

function escrowInPeriod(iso: string, period: string): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  const cy = now.getFullYear();
  const cm = now.getMonth();
  if (period === "this-month") return y === cy && m === cm;
  if (period === "last-month") {
    const lm = cm === 0 ? 11 : cm - 1;
    const ly = cm === 0 ? cy - 1 : cy;
    return y === ly && m === lm;
  }
  if (period === "this-quarter") {
    const cq = Math.floor(cm / 3);
    const q = Math.floor(m / 3);
    return y === cy && q === cq;
  }
  return true;
}

function sumBuyerCommitment(escrows: EscrowListItem[], userId: number): number {
  const skip = new Set(["cancelled", "refunded"]);
  return escrows.reduce((sum, e) => {
    if (e.buyer?.id !== userId) return sum;
    if (skip.has(e.status)) return sum;
    return sum + (e.totalAmountKES ?? 0);
  }, 0);
}

function buildStatsChartRows(
  escrows: EscrowListItem[],
  period: string
): { day: string; volume: number; deals: number }[] {
  const filtered = escrows.filter((e) => escrowInPeriod(e.createdAt, period));
  const map = new Map<string, { volume: number; deals: number; t: number }>();
  for (const e of filtered) {
    const d = new Date(e.createdAt);
    const key = d.toLocaleDateString("en-KE", { month: "short", day: "numeric" });
    const prev = map.get(key) ?? { volume: 0, deals: 0, t: d.getTime() };
    prev.volume += e.totalAmountKES ?? 0;
    prev.deals += 1;
    prev.t = Math.min(prev.t, d.getTime());
    map.set(key, prev);
  }
  return [...map.entries()]
    .map(([day, v]) => ({
      day,
      volume: Math.round((v.volume / 1000) * 10) / 10,
      deals: v.deals,
      t: v.t,
    }))
    .sort((a, b) => a.t - b.t)
    .map(({ day, volume, deals }) => ({ day, volume, deals }));
}

function escrowStatusUi(status: string): { label: string; tone: "ok" | "pending" | "bad" } {
  switch (status) {
    case "released":
      return { label: "Released", tone: "ok" };
    case "funded":
    case "in_progress":
    case "delivered":
      return { label: status.replace("_", " "), tone: "pending" };
    case "pending":
      return { label: "Awaiting payment", tone: "pending" };
    case "disputed":
    case "refunded":
    case "cancelled":
      return { label: status, tone: "bad" };
    default:
      return { label: status.replace(/_/g, " "), tone: "pending" };
  }
}

function initialsFromLabel(label: string): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const statsChartConfig: ChartConfig = {
  volume: { label: "Volume (K KES)", color: "#7c3aed" },
  deals: { label: "Escrows (count)", color: "#eab308" },
};

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, token } = useAuth();
  const [period, setPeriod] = useState("this-month");
  const [transactionsPeriod, setTransactionsPeriod] = useState("this-month");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDialogTab, setPaymentDialogTab] = useState<DepositTransferTab>("deposit");
  const [depositSuccessFromRedirect, setDepositSuccessFromRedirect] = useState(false);
  const [selectedEscrowId, setSelectedEscrowId] = useState<number | null>(null);
  const [escrowDetailsOpen, setEscrowDetailsOpen] = useState(false);

  const effectiveToken =
    token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const { data: authMe } = useQuery({
    queryKey: ["auth-me"],
    queryFn: fetchAuthMe,
    enabled: !!effectiveToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const displayName =
    [authMe?.firstName, authMe?.lastName].filter(Boolean).join(" ").trim() ||
    [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
    user?.email?.split("@")[0] ||
    "Creator";

  const selfPhoneHint = user?.email ? `Account: ${user.email}` : undefined;

  const numericUserId = authMe?.id ?? (user?.id ? Number(user.id) : NaN);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["escrow-stats"],
    queryFn: escrowPaymentsApi.getStats,
    enabled: !!effectiveToken && Number.isFinite(numericUserId),
    staleTime: 60_000,
  });

  const { data: escrowListResult, isLoading: listLoading } = useQuery({
    queryKey: ["escrow-list-payments"],
    queryFn: () => escrowPaymentsApi.list(1, 100),
    enabled: !!effectiveToken && Number.isFinite(numericUserId),
    staleTime: 60_000,
  });

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ["payments-wallet"],
    queryFn: walletPaymentsApi.getWallet,
    enabled: !!effectiveToken && Number.isFinite(numericUserId),
    staleTime: 30_000,
  });

  const walletKes = walletData?.balanceKes ?? 0;

  const allEscrows = escrowListResult?.escrows ?? [];

  const statsRows = useMemo(
    () => buildStatsChartRows(allEscrows, period),
    [allEscrows, period]
  );

  const chartData = useMemo(() => {
    if (statsRows.length > 0) return statsRows;
    return [{ day: "—", volume: 0, deals: 0 }];
  }, [statsRows]);

  const releasedKes = stats ? stats.totalEarnedKobo / 100 : 0;
  const volumeKes = stats ? stats.totalValueKobo / 100 : 0;
  const buyerCommittedKes = useMemo(
    () => (Number.isFinite(numericUserId) ? sumBuyerCommitment(allEscrows, numericUserId) : 0),
    [allEscrows, numericUserId]
  );

  const recentEscrows = useMemo(
    () =>
      [...allEscrows]
        .filter((e) => escrowInPeriod(e.createdAt, transactionsPeriod))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 15),
    [allEscrows, transactionsPeriod]
  );

  const analyticsSegments = useMemo(() => {
    if (!stats) return [];
    const rows = [
      { name: "Completed", value: stats.completed, color: "#22c55e" },
      { name: "In progress", value: stats.inProgress, color: "#7c3aed" },
      { name: "Awaiting release", value: stats.awaitingRelease, color: "#3b82f6" },
      { name: "Pending payment", value: stats.pendingPayment, color: "#eab308" },
      { name: "Disputed", value: stats.disputed, color: "#ef4444" },
    ].filter((r) => r.value > 0);
    return rows;
  }, [stats]);

  const analyticsTotal = useMemo(
    () => analyticsSegments.reduce((a, s) => a + s.value, 0),
    [analyticsSegments]
  );

  const analyticsTop = useMemo(() => {
    if (analyticsSegments.length === 0) return null;
    return analyticsSegments.reduce((a, b) => (a.value >= b.value ? a : b));
  }, [analyticsSegments]);

  const analyticsChartConfig: ChartConfig = useMemo(() => {
    const c: ChartConfig = {};
    for (const s of analyticsSegments) {
      c[s.name] = { label: s.name, color: s.color };
    }
    return c;
  }, [analyticsSegments]);

  const dashboardLoading = statsLoading || listLoading;
  const walletCardLoading = walletLoading;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") ?? params.get("trxref");
    if (!ref || !effectiveToken) return;

    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await walletPaymentsApi.verify(ref);
        if (cancelled) return;
        if (ok && data?.status === "success") {
          void queryClient.invalidateQueries({ queryKey: ["payments-wallet"] });
          setDepositSuccessFromRedirect(true);
          setPaymentDialogTab("deposit");
          setPaymentDialogOpen(true);
          toast.success("Deposit confirmed");
        } else {
          toast.error("Could not verify payment. Check your wallet or try again.");
        }
      } catch {
        if (!cancelled) toast.error("Could not verify payment.");
      } finally {
        if (!cancelled) {
          router.replace("/payments", { scroll: false });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [effectiveToken, queryClient, router]);

  const clearDepositRedirectFlag = useCallback(() => {
    setDepositSuccessFromRedirect(false);
  }, []);

  const openPaymentDialog = (tab: DepositTransferTab) => {
    setPaymentDialogTab(tab);
    setDepositSuccessFromRedirect(false);
    setPaymentDialogOpen(true);
  };

  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-5 sm:py-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_min(100%,340px)] xl:items-start">
          {/* Main column */}
          <div className="flex flex-col gap-6 xl:gap-8">
            <header>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Hi, {displayName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Record all your transactions
              </p>
            </header>

            {/* Summary cards — data from escrow API (no per-user wallet ledger yet) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              <Card className="border-border/80 bg-card shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Wallet balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {walletCardLoading ? (
                    <div className="flex items-center gap-2 py-4 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm">Loading…</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold tabular-nums sm:text-3xl">
                        Ksh.{" "}
                        {walletKes.toLocaleString("en-KE", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Spendable balance (Paystack deposits minus transfers). Escrow released
                        lifetime: Ksh. {Math.round(releasedKes).toLocaleString()}.
                      </p>
                    </>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 flex-1 border-orange-500/40 text-orange-600 hover:bg-orange-500/10 dark:text-orange-400"
                      type="button"
                      onClick={() => openPaymentDialog("deposit")}
                    >
                      Deposit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 flex-1 border-orange-500/40 text-orange-600 hover:bg-orange-500/10 dark:text-orange-400"
                      type="button"
                      onClick={() => openPaymentDialog("transfer")}
                    >
                      Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-card shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Escrow volume
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dashboardLoading ? (
                    <div className="flex items-center gap-2 py-4 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold tabular-nums sm:text-3xl">
                        Ksh. {Math.round(volumeKes).toLocaleString()}
                      </p>
                      <div className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                        {stats?.totalEscrows ?? 0} escrows total
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-card shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Committed as buyer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dashboardLoading ? (
                    <div className="flex items-center gap-2 py-4 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-bold tabular-nums sm:text-3xl">
                        Ksh. {Math.round(buyerCommittedKes).toLocaleString()}
                      </p>
                      <div className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-400">
                        <TrendingDown className="h-3.5 w-3.5" aria-hidden />
                        Excludes cancelled and refunded
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Statistics</CardTitle>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-9 w-[140px] border-border bg-background">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This month</SelectItem>
                    <SelectItem value="last-month">Last month</SelectItem>
                    <SelectItem value="this-quarter">This quarter</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="pt-2">
                <ChartContainer config={statsChartConfig} className="h-[280px] w-full">
                  <LineChart data={chartData} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      tickFormatter={(v) => `${v}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                      allowDecimals={false}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "volume" ? `${value}k KES` : value,
                        name === "volume" ? "Volume" : "Escrows",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: 16 }}
                      formatter={(value) =>
                        value === "volume" ? "Volume (K KES)" : value === "deals" ? "Escrow count" : value
                      }
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="volume"
                      name="volume"
                      stroke="#7c3aed"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="deals"
                      name="deals"
                      stroke="#eab308"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
                {!dashboardLoading && statsRows.length === 0 && (
                  <p className="pb-2 text-center text-xs text-muted-foreground">
                    No escrows in this period yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                <Select value={transactionsPeriod} onValueChange={setTransactionsPeriod}>
                  <SelectTrigger className="h-9 w-[140px] border-border bg-background">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This month</SelectItem>
                    <SelectItem value="last-month">Last month</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="hidden border-b border-border/80 pb-2 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1.4fr)_auto_auto_auto] sm:gap-4">
                  <span>Escrow / Counterparty</span>
                  <span className="text-center">Date</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">Status</span>
                </div>
                {dashboardLoading ? (
                  <div className="flex justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : recentEscrows.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No escrows in this period. Activity from jobs, campaigns, and services will show
                    here.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/80">
                    {recentEscrows.map((tx) => {
                      const isBuyer = tx.buyer?.id === numericUserId;
                      const counterparty = isBuyer ? tx.seller : tx.buyer;
                      const title = tx.title?.trim() || `Escrow #${tx.id}`;
                      const cp = personName(counterparty);
                      const initials = initialsFromLabel(title);
                      const dt = new Date(tx.updatedAt);
                      const dateStr = dt.toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                      });
                      const timeStr = dt.toLocaleTimeString("en-KE", {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      const ui = escrowStatusUi(tx.status);
                      return (
                        <li
                          key={tx.id}
                          className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[minmax(0,1.4fr)_auto_auto_auto] sm:items-center sm:gap-4 cursor-pointer hover:bg-muted/30 transition-colors rounded-lg px-2"
                          onClick={() => {
                            setSelectedEscrowId(tx.id);
                            setEscrowDetailsOpen(true);
                          }}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white shadow-inner"
                              aria-hidden
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">{title}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {isBuyer ? "With" : "From"} {cp}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground sm:text-center">
                            <span className="font-medium text-foreground sm:hidden">Date: </span>
                            {dateStr}
                            <span className="hidden sm:inline"> {timeStr}</span>
                          </div>
                          <p className="text-sm font-semibold tabular-nums sm:text-right">
                            Ksh. {Math.round(tx.totalAmountKES).toLocaleString()}
                          </p>
                          <div className="sm:flex sm:justify-end">
                            <span
                              className={cn(
                                "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize",
                                ui.tone === "ok" &&
                                  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
                                ui.tone === "pending" &&
                                  "bg-amber-500/25 text-amber-800 dark:text-amber-400",
                                ui.tone === "bad" && "bg-red-500/20 text-red-700 dark:text-red-400"
                              )}
                            >
                              {ui.label}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column — My Cards + Analytics */}
          <aside className="flex flex-col gap-6 xl:sticky xl:top-20 xl:self-start">
            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-semibold">Wallet &amp; escrows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #5b21b6 0%, #7c3aed 35%, #c026d3 100%)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-white/80">Wallet balance</p>
                    <CreditCard className="h-5 w-5 text-white/90" aria-hidden />
                  </div>
                  {walletCardLoading ? (
                    <div className="mt-6 flex justify-center py-4">
                      <Loader2 className="h-8 w-8 animate-spin text-white/80" />
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">
                        Ksh.{" "}
                        {walletKes.toLocaleString("en-KE", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="mt-4 text-xs leading-relaxed text-white/85">
                        Deposit adds to this balance; transfers send from it. Escrow released
                        lifetime: Ksh. {Math.round(releasedKes).toLocaleString()}.
                      </p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 gap-2 border-orange-500/40 font-medium hover:bg-orange-500/10"
                    onClick={() => openPaymentDialog("deposit")}
                  >
                    <ArrowDownLeft className="h-4 w-4" />
                    Deposit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 gap-2 border-orange-500/40 font-medium hover:bg-orange-500/10"
                    onClick={() => openPaymentDialog("transfer")}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Escrow mix</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardLoading ? (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : analyticsTotal === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No escrow activity yet.
                  </p>
                ) : (
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <div className="relative h-[200px] w-[200px] shrink-0">
                      <ChartContainer
                        config={analyticsChartConfig}
                        className="mx-auto aspect-square h-full w-full max-w-[200px]"
                      >
                        <PieChart>
                          <Pie
                            data={analyticsSegments}
                            cx="50%"
                            cy="50%"
                            innerRadius={58}
                            outerRadius={82}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                          >
                            {analyticsSegments.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">
                            {analyticsTop
                              ? Math.round((analyticsTop.value / analyticsTotal) * 100)
                              : 0}
                            %
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {analyticsTop?.name ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2.5 text-sm">
                      {analyticsSegments.map((d) => (
                        <li key={d.name} className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="text-muted-foreground">{d.name}</span>
                          <span className="ml-auto tabular-nums font-medium text-foreground">
                            {d.value}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              (
                              {Math.round((d.value / analyticsTotal) * 100)}
                              %)
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <DepositTransferDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        defaultTab={paymentDialogTab}
        showDepositSuccess={depositSuccessFromRedirect}
        onConsumedDepositSuccess={clearDepositRedirectFlag}
        selfLabel={`${displayName} (You)`}
        selfHint={selfPhoneHint}
        excludeUserId={user?.id}
        onTransferSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: ["payments-wallet"] });
        }}
      />

      <EscrowDetailsModal
        escrowId={selectedEscrowId}
        open={escrowDetailsOpen}
        onOpenChange={setEscrowDetailsOpen}
        viewerUserId={numericUserId}
      />
    </div>
  );
}
