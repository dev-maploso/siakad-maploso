export interface RegistrasiKelasMahasantri {
  id: number;
  name: string;
  nim: string;
}

export interface RegistrasiKelasInfo {
  id: number;
  nama_kelas: string | null;
  kode_kelas: string | null;
}

export interface RegistrasiKelasSemester {
  id: number;
  nama: string;
  aktif: boolean;
}

export interface RegistrasiKelasTahunAjaran {
  id: number;
  nama: string;
}

export interface RegistrasiKelas {
  id: number;

  mahasantri: RegistrasiKelasMahasantri;

  kelas: RegistrasiKelasInfo;

  semester: RegistrasiKelasSemester | null;

  tahun_ajaran: RegistrasiKelasTahunAjaran | null;

  status: string;
  status_label: string | null;

  tanggal_registrasi: string | null;

  created_at: string | null;
  updated_at: string | null;
}

export interface RegistrasiKelasPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface RegistrasiKelasResponse {
  data: RegistrasiKelas[];
  pagination: RegistrasiKelasPagination;
}