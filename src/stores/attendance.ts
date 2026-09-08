import { defineStore } from "pinia";

import AttendanceService from "@/services/attendance.service";

import type {
  AttendanceData,
  AttendancePagination,
} from "@/types/attendance";

interface AttendanceState {
  data: AttendanceData | null;
  pagination: AttendancePagination | null;

  loading: boolean;
  error: string | null;

  page: number;
  perPage: number;

  tanggalMulai: string | null;
  tanggalSelesai: string | null;

  registrasiKelasId: number | null;
  semesterId: number | null;
}

export const useAttendanceStore = defineStore(
  "attendance",
  {
    state: (): AttendanceState => ({
      data: null,
      pagination: null,

      loading: false,
      error: null,

      page: 1,
      perPage: 15,

      tanggalMulai: null,
      tanggalSelesai: null,

      registrasiKelasId: null,
      semesterId: null,
    }),

    getters: {
      registration: (state) =>
        state.data?.registrasi_kelas ?? null,

      summary: (state) =>
        state.data?.summary ?? null,

      items: (state) =>
        state.data?.attendance ?? [],

      periode: (state) =>
        state.data?.periode ?? null,

      hasData: (state): boolean =>
        !!state.data,

      hasItems: (state): boolean =>
        (state.data?.attendance?.length ?? 0) > 0,

      total: (state): number =>
        state.pagination?.total ?? 0,

      currentPage: (state): number =>
        state.pagination?.current_page ?? 1,

      lastPage: (state): number =>
        state.pagination?.last_page ?? 1,

      hasPreviousPage: (state): boolean =>
        state.page > 1,

      hasNextPage: (state): boolean =>
        !!state.pagination &&
        state.page < state.pagination.last_page,
    },

    actions: {
      async fetchHistory(
        registrasiKelasId: number,
        semesterId: number,
        page = 1,
        tanggalMulai?: string | null,
        tanggalSelesai?: string | null,
      ): Promise<void> {

        this.loading = true;
        this.error = null;

        /*
        |--------------------------------------------------------------------------
        | SIMPAN FILTER AKTIF
        |--------------------------------------------------------------------------
        |
        | Filter disimpan di store supaya ketika pagination berubah,
        | tanggal yang sedang dipilih tetap digunakan.
        |
        */

        this.registrasiKelasId =
          registrasiKelasId;

        this.semesterId =
          semesterId;

        /*
        | Jika parameter tanggal tidak diberikan,
        | gunakan tanggal yang sudah tersimpan di store.
        */

        if (
          tanggalMulai !== undefined
        ) {
          this.tanggalMulai =
            tanggalMulai || null;
        }

        if (
          tanggalSelesai !== undefined
        ) {
          this.tanggalSelesai =
            tanggalSelesai || null;
        }

        try {
          const response =
            await AttendanceService.getHistory({
              registrasi_kelas_id:
                registrasiKelasId,

              semester_id:
                semesterId,

              tanggal_mulai:
                this.tanggalMulai ?? undefined,

              tanggal_selesai:
                this.tanggalSelesai ?? undefined,

              page,

              per_page:
                this.perPage,
            });

          const result =
            response.data;

          this.data =
            result.data;

          this.pagination =
            result.pagination;

          this.page =
            result.pagination.current_page;

          this.perPage =
            result.pagination.per_page;

        } catch (error: any) {

          console.error(
            "GET ATTENDANCE ERROR:",
            error
          );

          this.data = null;

          this.pagination = null;

          this.error =
            error?.response?.data?.message ??
            error?.response?.data?.errors?.tanggal_mulai?.[0] ??
            error?.response?.data?.errors?.tanggal_selesai?.[0] ??
            "Gagal mengambil data kehadiran.";

          throw error;

        } finally {
          this.loading = false;
        }
      },

      /*
      |--------------------------------------------------------------------------
      | NEXT PAGE
      |--------------------------------------------------------------------------
      */

      async nextPage() {
        if (
          !this.pagination ||
          this.page >=
            this.pagination.last_page
        ) {
          return;
        }

        if (
          !this.registrasiKelasId ||
          !this.semesterId
        ) {
          return;
        }

        await this.fetchHistory(
          this.registrasiKelasId,
          this.semesterId,
          this.page + 1,
        );
      },

      /*
      |--------------------------------------------------------------------------
      | PREVIOUS PAGE
      |--------------------------------------------------------------------------
      */

      async previousPage() {
        if (this.page <= 1) {
          return;
        }

        if (
          !this.registrasiKelasId ||
          !this.semesterId
        ) {
          return;
        }

        await this.fetchHistory(
          this.registrasiKelasId,
          this.semesterId,
          this.page - 1,
        );
      },

      /*
      |--------------------------------------------------------------------------
      | GO TO PAGE
      |--------------------------------------------------------------------------
      */

      async goToPage(page: number) {
        if (page < 1) {
          return;
        }

        if (
          this.pagination &&
          page >
            this.pagination.last_page
        ) {
          return;
        }

        if (
          !this.registrasiKelasId ||
          !this.semesterId
        ) {
          return;
        }

        await this.fetchHistory(
          this.registrasiKelasId,
          this.semesterId,
          page,
        );
      },

      /*
      |--------------------------------------------------------------------------
      | SET DATE FILTER
      |--------------------------------------------------------------------------
      */

      setDateFilter(
        tanggalMulai: string | null,
        tanggalSelesai: string | null,
      ) {
        this.tanggalMulai =
          tanggalMulai || null;

        this.tanggalSelesai =
          tanggalSelesai || null;
      },

      /*
      |--------------------------------------------------------------------------
      | CLEAR DATE FILTER
      |--------------------------------------------------------------------------
      */

      clearDateFilter() {
        this.tanggalMulai = null;
        this.tanggalSelesai = null;
      },

      /*
      |--------------------------------------------------------------------------
      | CLEAR STORE
      |--------------------------------------------------------------------------
      */

      clear() {
        this.data = null;

        this.pagination = null;

        this.loading = false;

        this.error = null;

        this.page = 1;

        this.perPage = 15;

        this.tanggalMulai = null;

        this.tanggalSelesai = null;

        this.registrasiKelasId = null;

        this.semesterId = null;
      },
    },
  }
);