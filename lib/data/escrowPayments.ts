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

/** Subset of GET /api/escrow list item (formatted escrow) */
export interface EscrowListItem {
  id: number;
  status: string;
  totalAmountKES: number;
  sellerAmountKES: number;
  title?: string | null;
  buyer?: { id: number; firstName?: string; lastName?: string; email?: string };
  seller?: { id: number; firstName?: string; lastName?: string; email?: string };
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
};
