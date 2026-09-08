export interface PaymentRegistration {
  id: number;
  kelas: string | null;
  tahun_ajaran: string | null;
  semester: string | null;
}

export interface PaymentSummary {
  total_kewajiban: number;
  total_sudah_bayar: number;
  total_kekurangan: number;
  status: "lunas" | "belum" | string;
}

export interface PaymentTransaction {
  id: number;
  tanggal: string | null;
  jenis_pembayaran: string | null;
  nominal: number;
  status: string;
  keterangan: string | null;
}

export interface PaymentHistoryData {
  registrasi_kelas: PaymentRegistration;
  summary: PaymentSummary;
  riwayat: PaymentTransaction[];
}

export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: PaymentHistoryData;
}