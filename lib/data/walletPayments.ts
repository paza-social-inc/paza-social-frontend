import { pazaApi } from "@/lib/axiosClients";

export type WalletDepositMethod = "card" | "mpesa";

export interface DepositInitResponse {
  authorizationUrl: string;
  reference: string;
}

export interface TransferInitResponse {
  transferCode: string;
  status: string;
  reference: string;
}

export interface VerifyResponse {
  status: string;
  amount: number;
  reference: string;
}

export interface WalletBalanceResponse {
  balanceKobo: number;
  balanceKes: number;
}

export const walletPaymentsApi = {
  getWallet: async (): Promise<WalletBalanceResponse> => {
    const r = await pazaApi.get<{
      success: boolean;
      data: WalletBalanceResponse;
      error?: string;
    }>("/api/payments/wallet");
    if (!r.data.success || r.data.data == null) {
      throw new Error(r.data.error ?? "Could not load wallet");
    }
    return r.data.data;
  },
  initDeposit: async (payload: {
    amountKes: number;
    paymentMethod: WalletDepositMethod;
  }): Promise<DepositInitResponse> => {
    const r = await pazaApi.post<{
      success: boolean;
      data: DepositInitResponse;
      error?: string;
    }>("/api/payments/deposit/init", payload);
    if (!r.data.success || !r.data.data) {
      throw new Error(r.data.error ?? "Could not start deposit");
    }
    return r.data.data;
  },

  initTransfer: async (payload: {
    amountKes: number;
    reason: string;
    recipientUserId?: number;
    mpesaPhone?: string;
    mpesaRecipientName?: string;
  }): Promise<TransferInitResponse> => {
    const r = await pazaApi.post<{
      success: boolean;
      data: TransferInitResponse;
      error?: string;
    }>("/api/payments/transfer/init", payload);
    if (!r.data.success || !r.data.data) {
      throw new Error(r.data.error ?? "Could not complete transfer");
    }
    return r.data.data;
  },

  verify: async (reference: string): Promise<{ ok: boolean; data: VerifyResponse }> => {
    const r = await pazaApi.get<{
      success: boolean;
      data: VerifyResponse;
      error?: string;
    }>(`/api/payments/verify/${encodeURIComponent(reference)}`);
    return { ok: r.data.success, data: r.data.data };
  },
};
