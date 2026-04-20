"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { walletPaymentsApi, type WalletDepositMethod } from "@/lib/data/walletPayments";
import { usersApi } from "@/lib/data/users";
import type { BaseUser } from "@/types/common";
import { CreditCard, Loader2, Search, X } from "lucide-react";
import toast from "react-hot-toast";

const QUICK_AMOUNTS = [500, 1000, 1500, 2000, 2500];

export type DepositTransferTab = "deposit" | "transfer";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: DepositTransferTab;
  /** After Paystack redirect, parent verifies and passes success for deposit */
  showDepositSuccess?: boolean;
  onConsumedDepositSuccess?: () => void;
  selfLabel: string;
  selfHint?: string;
  /** Hide current user from transfer search (self-transfer is blocked server-side) */
  excludeUserId?: string;
  /** After a successful wallet transfer (balance already debited server-side) */
  onTransferSuccess?: () => void;
};

function parseAmount(raw: string): number {
  const n = Number(String(raw).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function DepositTransferDialog({
  open,
  onOpenChange,
  defaultTab = "deposit",
  showDepositSuccess = false,
  onConsumedDepositSuccess,
  selfLabel,
  selfHint,
  excludeUserId,
  onTransferSuccess,
}: Props) {
  const [tab, setTab] = useState<DepositTransferTab>(defaultTab);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState<WalletDepositMethod>("card");
  const [depositLoading, setDepositLoading] = useState(false);

  const [transferAmount, setTransferAmount] = useState("");
  const [transferPurpose, setTransferPurpose] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BaseUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BaseUser | null>(null);
  const [useMpesaFallback, setUseMpesaFallback] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaName, setMpesaName] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  const [transferSuccess, setTransferSuccess] = useState(false);
  const [depositSuccessView, setDepositSuccessView] = useState(false);
  const consumedDepositRedirectRef = useRef(false);

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
    } else {
      consumedDepositRedirectRef.current = false;
    }
  }, [open, defaultTab]);

  useEffect(() => {
    if (showDepositSuccess && open && !consumedDepositRedirectRef.current) {
      consumedDepositRedirectRef.current = true;
      setDepositSuccessView(true);
      setTab("deposit");
      onConsumedDepositSuccess?.();
    }
  }, [showDepositSuccess, open, onConsumedDepositSuccess]);

  useEffect(() => {
    let cancelled = false;
    const q = searchQuery.trim();
    if (q.length < 2 || useMpesaFallback) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const t = setTimeout(async () => {
      try {
        const rows = await usersApi.search(q);
        if (!cancelled) setSearchResults(rows);
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchQuery, useMpesaFallback]);

  const depositKes = useMemo(() => parseAmount(depositAmount), [depositAmount]);
  const transferKes = useMemo(() => parseAmount(transferAmount), [transferAmount]);

  const searchResultsOthers = useMemo(
    () =>
      excludeUserId
        ? searchResults.filter((u) => String(u.id) !== excludeUserId)
        : searchResults,
    [searchResults, excludeUserId]
  );

  const resetAndClose = () => {
    setDepositSuccessView(false);
    setTransferSuccess(false);
    setDepositAmount("");
    setTransferAmount("");
    setTransferPurpose("");
    setSearchQuery("");
    setSelectedUser(null);
    setUseMpesaFallback(false);
    setMpesaPhone("");
    setMpesaName("");
    onOpenChange(false);
  };

  const handleDepositConfirm = async () => {
    if (depositKes < 1) {
      toast.error("Enter a valid amount (KES 1 or more)");
      return;
    }
    setDepositLoading(true);
    try {
      const { authorizationUrl } = await walletPaymentsApi.initDeposit({
        amountKes: depositKes,
        paymentMethod: depositMethod,
      });
      window.location.href = authorizationUrl;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not start payment");
    } finally {
      setDepositLoading(false);
    }
  };

  const handleTransferConfirm = async () => {
    if (transferKes < 1) {
      toast.error("Enter a valid amount");
      return;
    }
    if (transferPurpose.trim().length < 2) {
      toast.error('Add a short note under "What is it for?"');
      return;
    }
    setTransferLoading(true);
    try {
      if (selectedUser?.id) {
        await walletPaymentsApi.initTransfer({
          amountKes: transferKes,
          reason: transferPurpose.trim(),
          recipientUserId: Number(selectedUser.id),
        });
      } else if (useMpesaFallback && mpesaPhone.trim() && mpesaName.trim()) {
        await walletPaymentsApi.initTransfer({
          amountKes: transferKes,
          reason: transferPurpose.trim(),
          mpesaPhone: mpesaPhone.trim(),
          mpesaRecipientName: mpesaName.trim(),
        });
      } else {
        toast.error("Select a user from search or use M-PESA phone + name");
        setTransferLoading(false);
        return;
      }
      setTransferSuccess(true);
      onTransferSuccess?.();
      toast.success("Transfer submitted");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Transfer failed");
    } finally {
      setTransferLoading(false);
    }
  };

  const successDeposit = depositSuccessView;
  const successTransfer = transferSuccess;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] max-w-md overflow-y-auto border-border bg-[#141414] p-0 text-foreground shadow-2xl sm:rounded-2xl"
      >
        {successDeposit || successTransfer ? (
          <div className="relative px-6 pb-8 pt-10 text-center">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
              onClick={resetAndClose}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <svg
                className="h-10 w-10 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-emerald-500">Payment Successful</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {successDeposit
                ? "Your deposit has been successfully processed"
                : "Your transfer has been successfully processed"}
            </p>
            <Button
              className="mt-8 w-full bg-orange-500 text-white hover:bg-orange-600"
              onClick={resetAndClose}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border/80 px-2 pt-2">
              <div className="flex flex-1 gap-0">
                <button
                  type="button"
                  className={cn(
                    "flex-1 border-b-2 py-3 text-sm font-medium transition-colors",
                    tab === "deposit"
                      ? "border-orange-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/80"
                  )}
                  onClick={() => setTab("deposit")}
                >
                  Deposit
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex-1 border-b-2 py-3 text-sm font-medium transition-colors",
                    tab === "transfer"
                      ? "border-orange-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground/80"
                  )}
                  onClick={() => setTab("transfer")}
                >
                  Transfer
                </button>
              </div>
              <button
                type="button"
                className="mr-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Close"
                onClick={() => resetAndClose()}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 pb-6 pt-4">
              {tab === "deposit" ? (
                <div className="space-y-5">
                  <DialogHeader className="space-y-1 p-0 text-left">
                    <DialogTitle className="sr-only">Deposit</DialogTitle>
                  </DialogHeader>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Enter amount you want to deposit?
                    </label>
                    <input
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Kes.4000"
                      className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 text-lg font-medium outline-none focus:border-orange-500/80"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                        onClick={() => setDepositAmount(String(a))}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Choose your payment method</p>
                    <div className="mt-3 space-y-3">
                      <button
                        type="button"
                        onClick={() => setDepositMethod("card")}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                          depositMethod === "card"
                            ? "border-orange-500/80 bg-orange-500/10"
                            : "border-border bg-muted/20 hover:bg-muted/40"
                        )}
                      >
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg bg-white">
                          <CreditCard className="h-7 w-7 text-neutral-800" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">Card</span>
                          <span className="ml-2">Visa · Mastercard · Amex</span>
                        </div>
                      </button>
                      <div>
                        <p className="text-xs text-muted-foreground">Deposit Using:</p>
                        <button
                          type="button"
                          onClick={() => setDepositMethod("mpesa")}
                          className={cn(
                            "mt-1 flex w-full items-center justify-center rounded-xl border px-4 py-3 transition-colors",
                            depositMethod === "mpesa"
                              ? "border-orange-500/80 bg-orange-500/10"
                              : "border-border bg-white hover:bg-neutral-100"
                          )}
                        >
                          <span className="text-lg font-bold tracking-tight text-green-600">
                            M-PESA
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="h-11 w-full bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
                    disabled={depositLoading}
                    onClick={handleDepositConfirm}
                  >
                    {depositLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <DialogHeader className="space-y-1 p-0 text-left">
                    <DialogTitle className="sr-only">Transfer</DialogTitle>
                  </DialogHeader>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      How much do you want to transfer?
                    </label>
                    <input
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="Kes.4000"
                      className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 text-lg font-medium outline-none focus:border-orange-500/80"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">What is it for?</label>
                    <input
                      value={transferPurpose}
                      onChange={(e) => setTransferPurpose(e.target.value)}
                      placeholder="eg. Shopping"
                      className="mt-2 w-full border-0 border-b border-border bg-transparent py-2 outline-none focus:border-orange-500/80"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Transfer money to:</label>
                    <div className="relative mt-2">
                      <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedUser(null);
                        }}
                        placeholder="Search name"
                        className="w-full border-0 border-b border-border bg-transparent py-2 pl-7 outline-none focus:border-orange-500/80"
                        disabled={useMpesaFallback}
                      />
                    </div>
                    {searchQuery.trim().length >= 2 && !useMpesaFallback && (
                      <div className="mt-2 max-h-36 overflow-y-auto rounded-lg border border-border bg-muted/20">
                        {searchLoading ? (
                          <p className="p-2 text-xs text-muted-foreground">Searching…</p>
                        ) : searchResultsOthers.length === 0 ? (
                          <p className="p-2 text-xs text-muted-foreground">
                            {searchResults.length === 0 ? "No users found" : "No other users match"}
                          </p>
                        ) : (
                          searchResultsOthers.map((u) => {
                            const email = String(u.email ?? "");
                            const name =
                              [u.firstname, u.lastname].filter(Boolean).join(" ").trim() || email;
                            return (
                              <button
                                key={u.id ?? email}
                                type="button"
                                className="flex w-full px-3 py-2 text-left text-sm hover:bg-muted"
                                onClick={() => {
                                  setSelectedUser(u);
                                  setSearchQuery(name);
                                }}
                              >
                                {name}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      className="mt-2 text-xs text-orange-500 hover:underline"
                      onClick={() => {
                        setUseMpesaFallback((v) => !v);
                        setSelectedUser(null);
                        setSearchQuery("");
                      }}
                    >
                      {useMpesaFallback ? "Search platform users instead" : "Send to M-PESA number instead"}
                    </button>
                    {useMpesaFallback && (
                      <div className="mt-3 space-y-2 rounded-lg border border-border/80 p-3">
                        <input
                          value={mpesaName}
                          onChange={(e) => setMpesaName(e.target.value)}
                          placeholder="Recipient name"
                          className="w-full border-0 border-b border-border bg-transparent py-1.5 text-sm outline-none"
                        />
                        <input
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="+254 7XX XXX XXX"
                          className="w-full border-0 border-b border-border bg-transparent py-1.5 text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Favourites</span>
                      <button type="button" className="text-xs text-orange-500 hover:underline">
                        View all
                      </button>
                    </div>
                    <div className="mt-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-left">
                      <p className="font-medium text-orange-400">{selfLabel}</p>
                      {selfHint ? (
                        <p className="text-sm text-orange-400/80">{selfHint}</p>
                      ) : null}
                    </div>
                  </div>

                  <Button
                    className="h-11 w-full bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
                    disabled={transferLoading}
                    onClick={handleTransferConfirm}
                  >
                    {transferLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
