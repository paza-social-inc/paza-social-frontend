"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { walletPaymentsApi } from "@/lib/data/walletPayments";
import { escrowPaymentsApi } from "@/lib/data/escrowPayments";
import { useState } from "react";
import { DepositTransferDialog, type DepositTransferTab } from "@/components/Dashboard/payments/DepositTransferDialog";
import { useAuth } from "@/hooks/store/auth/useAuth";

export function BillingSection() {
    const { user } = useAuth();
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [paymentDialogTab, setPaymentDialogTab] = useState<DepositTransferTab>("deposit");

    const { data: wallet, isLoading: walletLoading } = useQuery({
        queryKey: ["wallet"],
        queryFn: walletPaymentsApi.getWallet,
    });

    const { data: escrowsResult, isLoading: escrowsLoading } = useQuery({
        queryKey: ["escrow-list", 1],
        queryFn: () => escrowPaymentsApi.list(1, 10),
    });

    const escrows = escrowsResult?.escrows || [];

    const openPaymentDialog = (tab: DepositTransferTab) => {
        setPaymentDialogTab(tab);
        setPaymentDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Billing & Wallet</h1>
                <p className="text-sm text-muted-foreground">Manage your subscription and wallet transactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Current Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {walletLoading ? (
                            <div className="py-2"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <p className="text-3xl font-bold tabular-nums">
                                Ksh. {wallet?.balanceKes?.toLocaleString("en-KE", { minimumFractionDigits: 2 }) ?? "0.00"}
                            </p>
                        )}
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openPaymentDialog("deposit")}>
                                <ArrowDownLeft className="mr-2 h-4 w-4 text-green-600" />
                                Deposit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => openPaymentDialog("transfer")}>
                                <ArrowUpRight className="mr-2 h-4 w-4 text-orange-600" />
                                Transfer
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                <span className="font-semibold text-blue-600">⚡</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">Professional Plan</h3>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                                        Active
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-xs mt-1">
                                    Next billing cycle: <span className="font-medium">March 1st, 2025</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-muted-foreground grid grid-cols-5 gap-4 border-b pb-2 text-[10px] font-bold uppercase tracking-wider">
                            <div>REFERENCE</div>
                            <div>DESCRIPTION</div>
                            <div>STATUS</div>
                            <div>DATE</div>
                            <div className="text-right">AMOUNT</div>
                        </div>

                        {escrowsLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : escrows.length === 0 ? (
                            <div className="text-center py-10 text-sm text-muted-foreground">
                                No transactions found yet.
                            </div>
                        ) : (
                            escrows.map((tx) => (
                                <div key={tx.id} className="grid grid-cols-5 gap-4 py-3 text-sm border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors rounded-px">
                                    <div className="font-mono text-xs text-muted-foreground">#{tx.id}</div>
                                    <div className="font-medium truncate">{tx.title || "Escrow Payment"}</div>
                                    <div>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                tx.status === "released" || tx.status === "funded"
                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                    : "bg-orange-50 text-orange-700 border-orange-100"
                                            }>
                                            {tx.status?.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {new Date(tx.createdAt).toLocaleDateString("en-KE", { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="text-right font-medium tabular-nums">
                                        Ksh. {tx.totalAmountKES?.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <DepositTransferDialog
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
                defaultTab={paymentDialogTab}
                selfLabel="My Wallet"
                excludeUserId={user?.id}
            />
        </div>
    );
}
