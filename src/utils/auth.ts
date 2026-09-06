import type { User } from "@/types/auth";

/**
 * Cek apakah user sudah terautentikasi
 * sebagai Mahasantri.
 *
 * User berasal dari endpoint /me
 * yang memang khusus untuk Mahasantri.
 */
export function isMahasantri(
  user: User | null
): boolean {
  return !!user;
}

/**
 * Cek apakah akun Mahasantri aktif.
 */
export function isActiveMahasantri(
  user: User | null
): boolean {
  return user?.is_active ?? false;
}

/**
 * Cek apakah user boleh mengakses
 * aplikasi SIAKAD Mahasantri.
 *
 * Validasi role sebenarnya dilakukan
 * oleh backend melalui endpoint /me.
 */
export function canAccessMahasantriApp(
  user: User | null
): boolean {
  return !!user;
}