import { defineStore } from "pinia";
import AuthService from "@/services/auth.service";
import type { AuthState, User } from "@/types/auth";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("token"),
    user: null,
    loading: false,
  }),

  getters: {
    /**
     * Apakah user memiliki token login?
     */
    isLoggedIn: (state): boolean => {
      return !!state.token;
    },

    /**
     * Apakah data Mahasantri sudah tersedia?
     */
    isMahasantri: (state): boolean => {
      return !!state.user;
    },

    /**
     * Apakah Mahasantri aktif?
     */
    isActive: (state): boolean => {
      return state.user?.is_active ?? false;
    },
  },

  actions: {
    /**
     * Simpan token
     */
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    /**
     * Simpan data user / Mahasantri
     */
    setUser(user: User) {
      this.user = user;
    },

    /**
     * Hapus seluruh session
     */
    clear() {
      this.token = null;
      this.user = null;

      localStorage.removeItem("token");
    },

    /**
     * Login Mahasantri
     */
    async login(
      email: string,
      password: string
    ): Promise<void> {
      this.loading = true;

      try {
        const response = await AuthService.login({
          email,
          password,
        });

        const token = response.data?.data?.token;

        if (!token) {
          throw new Error(
            "Token login tidak ditemukan."
          );
        }

        this.setToken(token);

        /**
         * Setelah login berhasil,
         * ambil profil Mahasantri.
         */
        await this.fetchMe();
      } catch (error) {
        this.clear();

        console.error(
          "LOGIN ERROR:",
          error
        );

        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Ambil profil Mahasantri yang sedang login
     */
    async fetchMe(): Promise<User> {
      const response = await AuthService.me();

      const user = response.data?.data as User;

      if (!user) {
        throw new Error(
          "Data Mahasantri tidak ditemukan."
        );
      }

      this.setUser(user);

      return user;
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
      try {
        if (this.token) {
          await AuthService.logout();
        }
      } catch (error) {
        console.error(
          "LOGOUT ERROR:",
          error
        );
      } finally {
        this.clear();
      }
    },

    /**
     * Restore session ketika aplikasi dibuka kembali
     */
    async restore(): Promise<boolean> {
      if (!this.token) {
        return false;
      }

      this.loading = true;

      try {
        await this.fetchMe();

        return true;
      } catch (error) {
        console.error(
          "RESTORE ERROR:",
          error
        );

        this.clear();

        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});