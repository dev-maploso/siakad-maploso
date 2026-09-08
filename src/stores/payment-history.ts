import { defineStore } from "pinia";
import PaymentHistoryService from "@/services/payment-history.service";

import type {
  PaymentHistoryData,
} from "@/types/payment-history";

interface PaymentHistoryState {
  data: PaymentHistoryData | null;
  loading: boolean;
  error: string | null;
}

export const usePaymentHistoryStore = defineStore("paymentHistory", {
  state: (): PaymentHistoryState => ({
    data: null,
    loading: false,
    error: null,
  }),

  getters: {
    registration: (state) => state.data?.registrasi_kelas ?? null,

    summary: (state) => state.data?.summary ?? null,

    transactions: (state) => state.data?.riwayat ?? [],

    hasData: (state): boolean => {
      return !!state.data;
    },

    isLunas: (state): boolean => {
      return state.data?.summary?.status === "lunas";
    },

    hasTransactions: (state): boolean => {
      return (state.data?.riwayat?.length ?? 0) > 0;
    },
  },

  actions: {
    async fetchPaymentHistory(
      registrasiKelasId: number
    ): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const response =
          await PaymentHistoryService.getByRegistrasiKelas(
            registrasiKelasId
          );

        this.data = response.data.data;
      } catch (error: any) {
        console.error(
          "GET PAYMENT HISTORY ERROR:",
          error
        );

        this.data = null;

        this.error =
          error?.response?.data?.message ??
          "Gagal mengambil riwayat pembayaran.";

        throw error;
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.data = null;
      this.loading = false;
      this.error = null;
    },
  },
});