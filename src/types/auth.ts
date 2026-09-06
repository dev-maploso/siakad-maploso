export interface OrangTua {
  nama: string | null;
  status: string | null;
  nik: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  status_perkawinan?: string | null;
  pendidikan_terakhir: string | null;
  pekerjaan: string | null;
  penghasilan_per_bulan: string | number | null;
}

export interface Wali {
  nama: string | null;
  nik: string | null;
  status: string | null;
  pekerjaan: string | null;
  no_wa: string | null;
}

export interface Alamat {
  no_kartu_keluarga: string | null;
  provinsi: string | null;
  kabupaten_kota: string | null;
  kecamatan: string | null;
  kelurahan: string | null;
  dusun_jalan_blok: string | null;
  rt_rw: string | null;
}

export interface Pondok {
  id: number;
  kode_pondok: string;
  nama_pondok: string;
}

export interface Komplek {
  id: number;
  kode_komplek: string;
  nama_komplek: string;
}

export interface Kamar {
  id: number;
  kode_kamar: string;
  nama_kamar: string;
}

export interface User {
  id: number;
  name: string;
  nim: string;
  is_active: boolean;

  nik: string | null;
  nisn: string | null;

  tempat_lahir: string | null;
  tanggal_lahir: string | null;

  anak_ke_berapa: number | null;
  jumlah_saudara: number | null;

  hobi: string | null;
  cita_cita: string | null;
  riwayat_penyakit: string | null;
  pendidikan_terakhir: string | null;

  ayah: OrangTua | null;
  ibu: OrangTua | null;
  wali: Wali | null;

  alamat: Alamat | null;

  no_wa_orang_tua: string | null;

  pondok: Pondok | null;
  komplek: Komplek | null;
  kamar: Kamar | null;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
}