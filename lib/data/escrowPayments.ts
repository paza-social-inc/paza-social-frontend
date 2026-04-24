import { pazaApi } from "@/lib/axiosClients";

/** Matches GET /api/escrow/stats */
export interface EscrowDashboardStats {
  totalEscrows: number;
  pendingPayment: number;
  inProgress: number;
  awaitingRelease: number;
  completed: number;
  disputed: number;
  totalValueKobo: number;
  totalEarnedKobo: number;
}

/** Per-milestone payment tracking within a campaign escrow. */
export interface EscrowMilestonePayment {
  id: number;
  milestoneId: number;
  title?: string;
  amountKES: number;
  status: "pending" | "funded" | "in_progress" | "delivered" | "released" | "disputed" | "refunded";
  deliveredAt?: string | null;
  releasedAt?: string | null;
  deliveryNote?: string | null;
  transferRef?: string | null;
}

/** Subset of GET /api/escrow list item (formatted escrow) */
export interface EscrowListItem {
  id: number;
  status: string;
  totalAmountKES: number;
  sellerAmountKES: number;
  title?: string | null;
  buyer?: { id: number; firstName?: string; lastName?: string; email?: string };
  seller?: { id: number; firstName?: string; lastName?: string; email?: string };
  /** Campaign-based escrow fields */
  campaignId?: number | null;
  campaignTitle?: string | null;
  /** Milestone-level breakdown (present for campaign-based escrows) */
  milestonePayments?: EscrowMilestonePayment[];
  createdAt: string;
  updatedAt: string;
}

export const escrowPaymentsApi = {
  getStats: async (): Promise<EscrowDashboardStats> => {
    const r = await pazaApi.get<{ success: boolean; data: EscrowDashboardStats; error?: string }>(
      "/api/escrow/stats"
    );
    if (!r.data.success || r.data.data == null) {
      throw new Error(r.data.error ?? "Could not load escrow stats");
    }
    return r.data.data;
  },

  list: async (page = 1, limit = 50): Promise<{ escrows: EscrowListItem[]; total: number }> => {
    const r = await pazaApi.get<{
      success: boolean;
      data: { escrows: EscrowListItem[]; total: number; page: number; totalPages: number };
      error?: string;
    }>("/api/escrow", { params: { page, limit } });
    if (!r.data.success || !r.data.data) {
      throw new Error(r.data.error ?? "Could not load escrows");
    }
    return { escrows: r.data.data.escrows, total: r.data.data.total };
  },

  getById: async (id: number): Promise<EscrowListItem> => {
    const r = await pazaApi.get<{ success: boolean; data: EscrowListItem; error?: string }>(`/api/escrow/${id}`);
    if (!r.data.success || !r.data.data) throw new Error(r.data.error || "Escrow not found");
    return r.data.data;
  },

  // ─── Campaign-Based Escrow (Primary) ────────────────────────────────────

  /**
   * Create a campaign-based escrow.
   * POST /api/escrow/from-campaign/:campaignId
   * Body: { sellerId: number; milestoneIds?: number[] }
   *
   * Returns a Paystack payment URL for the buyer to fund the escrow.
   */
  createFromCampaign: async (
    campaignId: number,
    sellerId: number,
    milestoneIds?: number[]
  ): Promise<{ paymentUrl: string; reference: string; escrowId?: number }> => {
    const r = await pazaApi.post<{
      success: boolean;
      data: { paymentUrl: string; reference: string; escrowId?: number };
    }>(`/api/escrow/from-campaign/${campaignId}`, {
      sellerId,
      ...(milestoneIds && milestoneIds.length > 0 ? { milestoneIds } : {}),
    });
    return r.data.data;
  },

  /**
   * Seller delivers a single milestone within a campaign escrow.
   * POST /api/escrow/:id/milestones/:milestonePaymentId/deliver
   */
  deliverMilestone: async (escrowId: number, milestonePaymentId: number, deliveryNote?: string): Promise<void> => {
    await pazaApi.post(`/api/escrow/${escrowId}/milestones/${milestonePaymentId}/deliver`, { deliveryNote });
  },

  /**
   * Buyer releases funds for a single milestone within a campaign escrow.
   * POST /api/escrow/:id/milestones/:milestonePaymentId/release
   */
  releaseMilestone: async (escrowId: number, milestonePaymentId: number): Promise<void> => {
    await pazaApi.post(`/api/escrow/${escrowId}/milestones/${milestonePaymentId}/release`);
  },

  // ─── Legacy (Deprecated) ────────────────────────────────────────────────

  /** @deprecated Use createFromCampaign instead. Routes moved to /api/escrow/legacy/ */
  createFromProposal: async (proposalId: number): Promise<{ paymentUrl: string; reference: string }> => {
    const r = await pazaApi.post<{ success: boolean; data: { paymentUrl: string; reference: string } }>(
      `/api/escrow/legacy/from-job-proposal/${proposalId}`
    );
    return r.data.data;
  },

  createFromMilestone: async (milestoneId: number): Promise<{ paymentUrl: string; reference: string }> => {
    const r = await pazaApi.post<{ success: boolean; data: { paymentUrl: string; reference: string } }>(
      `/api/escrow/from-campaign-milestone/${milestoneId}`
    );
    return r.data.data;
  },

  // ─── Escrow Lifecycle Actions ───────────────────────────────────────────

  startWork: async (id: number): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/start`);
  },

  deliver: async (id: number, deliveryNote?: string): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/deliver`, { deliveryNote });
  },

  releaseFunds: async (id: number): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/release`);
  },

  raiseDispute: async (id: number, reason: string): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/dispute`, { reason });
  },

  refundBuyer: async (id: number): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/refund`);
  },

  cancel: async (id: number, reason: string): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/cancel`, { reason });
  },

  verifyPayment: async (id: number): Promise<void> => {
    await pazaApi.post(`/api/escrow/${id}/verify-payment`);
  },

  // ─── Campaign Escrow Queries ────────────────────────────────────────────

  /** Get all escrows for a specific campaign */
  getByCampaign: async (campaignId: number): Promise<EscrowListItem[]> => {
    const r = await pazaApi.get<{
      success: boolean;
      data: { escrows: EscrowListItem[] };
      error?: string;
    }>("/api/escrow", { params: { campaignId } });
    if (!r.data.success || !r.data.data) {
      throw new Error(r.data.error ?? "Could not load campaign escrows");
    }
    return r.data.data.escrows ?? [];
  },
};
