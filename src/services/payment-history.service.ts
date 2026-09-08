import api from "./api";
import type { PaymentHistoryResponse } from "@/types/payment-history";

export default {
  getByRegistrasiKelas(registrasiKelasId: number) {
    return api.get<PaymentHistoryResponse>(
      `/registrasi-kelas/${registrasiKelasId}/riwayat-pembayaran`
    );
  },
};