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
    }),

    getters: {
      registration: (state) =>
        state.data?.registrasi_kelas ?? null,

      summary: (state) =>
        state.data?.summary ?? null,

      items: (state) =>
        state.data?.attendance ?? [],

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
    },

    actions: {
      async fetchHistory(
        registrasiKelasId: number,
        semesterId: number,
        page = 1
      ): Promise<void> {

        this.loading = true;
        this.error = null;

        try {
          const response =
            await AttendanceService.getHistory({
              registrasi_kelas_id:
                registrasiKelasId,

              semester_id: semesterId,

              page,

              per_page: this.perPage,
            });

          const result = response.data;

          this.data = result.data;

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
            "Gagal mengambil data kehadiran.";

          throw error;

        } finally {
          this.loading = false;
        }
      },

      async nextPage() {
        if (
          this.pagination &&
          this.page <
            this.pagination.last_page
        ) {

          const registration =
            this.data?.registrasi_kelas;

          if (!registration) {
            return;
          }

          await this.fetchHistory(
            registration.id,
            registration.semester.id,
            this.page + 1
          );
        }
      },

      async previousPage() {
        if (this.page <= 1) {
          return;
        }

        const registration =
          this.data?.registrasi_kelas;

        if (!registration) {
          return;
        }

        await this.fetchHistory(
          registration.id,
          registration.semester.id,
          this.page - 1
        );
      },

      async goToPage(page: number) {
        if (page < 1) {
          return;
        }

        if (
          this.pagination &&
          page > this.pagination.last_page
        ) {
          return;
        }

        const registration =
          this.data?.registrasi_kelas;

        if (!registration) {
          return;
        }

        await this.fetchHistory(
          registration.id,
          registration.semester.id,
          page
        );
      },

      clear() {
        this.data = null;
        this.pagination = null;
        this.loading = false;
        this.error = null;
        this.page = 1;
      },
    },
  }
);