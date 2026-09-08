export type AttendanceStatus =
  | "hadir"
  | "izin"
  | "sakit"
  | "alpha";

export interface AttendanceRegistrationClass {
  id: number;
  nama: string | null;
  kode: string | null;
}

export interface AttendanceSemester {
  id: number;
  nama: string | null;
}

export interface AttendanceRegistration {
  id: number;
  kelas: AttendanceRegistrationClass;
  semester: AttendanceSemester;
}

export interface AttendanceSummary {
  total_pertemuan: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  persentase_kehadiran: number;
}

export interface AttendanceItem {
  id: number;
  tanggal: string | null;
  jam_ke: number | null;
  status: AttendanceStatus | string;
  jam_hadir: string | null;
  keterangan: string | null;
}

export interface AttendancePagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface AttendanceData {
  registrasi_kelas: AttendanceRegistration;
  summary: AttendanceSummary;
  attendance: AttendanceItem[];
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceData;
  pagination: AttendancePagination;
}