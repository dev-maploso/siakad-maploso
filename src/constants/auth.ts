/**
 * Role utama aplikasi.
 *
 * Aplikasi ini khusus untuk Mahasantri.
 */
export const AUTH_ROLE = {
  MAHASANTRI: "mahasantri",
} as const;

/**
 * Role yang diperbolehkan mengakses
 * aplikasi SIAKAD Mahasantri.
 */
export const ALLOWED_ROLES = [
  AUTH_ROLE.MAHASANTRI,
] as const;