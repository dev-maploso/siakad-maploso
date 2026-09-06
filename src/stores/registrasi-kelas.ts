import { defineStore } from "pinia";
import RegistrasiKelasService from "@/services/registrasi-kelas.service";

import type {
  RegistrasiKelas,
  RegistrasiKelasPagination,
} from "@/types/registrasi-kelas";

interface RegistrasiKelasState {
  items: RegistrasiKelas[];
  pagination: RegistrasiKelasPagination | null;

  loading: boolean;
  error: string | null;

  page: number;
  perPage: number;
}

export const useRegistrasiKelasStore = defineStore(
  "registrasiKelas",
  {
    state: (): RegistrasiKelasState => ({
      items: [],
      pagination: null,

      loading: false,
      error: null,

      page: 1,
      perPage: 15,
    }),

    getters: {
      total: (state): number => {
        return state.pagination?.total ?? 0;
      },

      hasData: (state): boolean => {
        return state.items.length > 0;
      },

      currentPage: (state): number => {
        return state.pagination?.current_page ?? 1;
      },

      lastPage: (state): number => {
        return state.pagination?.last_page ?? 1;
      },
    },

    actions: {
      async fetchKelas(
        params: {
          page?: number;
          per_page?: number;
          semester_id?: number;
          tahun_ajaran_id?: number;
          status?: string;
        } = {}
      ): Promise<void> {
        this.loading = true;
        this.error = null;

        try {
          const response =
            await RegistrasiKelasService.getAll({
              page: params.page ?? this.page,
              per_page: params.per_page ?? this.perPage,
              semester_id: params.semester_id,
              tahun_ajaran_id: params.tahun_ajaran_id,
              status: params.status,
            });

          const result = response.data;

          this.items = result.data;
          this.pagination = result.pagination;

          this.page =
            result.pagination.current_page;

          this.perPage =
            result.pagination.per_page;
        } catch (error: any) {
          console.error(
            "GET REGISTRASI KELAS ERROR:",
            error
          );

          this.error =
            error?.response?.data?.message ??
            "Gagal mengambil data kelas.";

          this.items = [];
          this.pagination = null;

          throw error;
        } finally {
          this.loading = false;
        }
      },

      async nextPage(): Promise<void> {
        if (
          this.pagination &&
          this.page < this.pagination.last_page
        ) {
          await this.fetchKelas({
            page: this.page + 1,
          });
        }
      },

      async previousPage(): Promise<void> {
        if (this.page > 1) {
          await this.fetchKelas({
            page: this.page - 1,
          });
        }
      },

      async goToPage(page: number): Promise<void> {
        if (page < 1) {
          return;
        }

        if (
          this.pagination &&
          page > this.pagination.last_page
        ) {
          return;
        }

        await this.fetchKelas({
          page,
        });
      },

      clear(): void {
        this.items = [];
        this.pagination = null;
        this.error = null;
        this.page = 1;
      },
    },
  }
);