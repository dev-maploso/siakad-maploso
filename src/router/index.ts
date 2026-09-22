import { createRouter, createWebHistory } from "vue-router";
import { setupRouterGuards } from "./guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    /**
     * Guest
     */
    {
      path: "/login",
      component: () => import("@/layouts/AuthLayout.vue"),

      children: [
        {
          path: "",
          name: "login",
          component: () => import("@/views/auth/LoginView.vue"),

          meta: {
            guest: true,
            title: "Login",
          },
        },
      ],
    },

    /**
     * Protected
     */
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),

      meta: {
        requiresAuth: true,
      },

      children: [
        /**
         * Dashboard
         */
        {
          path: "",
          redirect: {
            name: "dashboard",
          },
        },

        {
          path: "dashboard",
          name: "dashboard",
          component: () =>
            import("@/views/dashboard/DashboardView.vue"),

          meta: {
            title: "Dashboard",
          },
        },

        /**
         * Profil
         */
        {
          path: "profile",
          name: "profile",
          component: () =>
            import("@/views/profile/ProfileView.vue"),

          meta: {
            title: "Profil",
          },
        },

        /**
         * =========================
         * KELAS
         * =========================
         */
        {
          path: "classes",
          name: "classes",
          component: () =>
            import("@/views/kelas/KelasView.vue"),

          meta: {
            title: "Kelas",
          },
        },

        /**
         * Detail pembayaran dari kelas
         */
        {
          path: "classes/:id/payment",
          name: "class-payment-history",
          component: () =>
            import("@/views/payment/PaymentHistoryView.vue"),

          meta: {
            title: "Riwayat Pembayaran",
          },
        },

        /**
         * =========================
         * JADWAL KULIAH
         * =========================
         */
        {
          path: "schedule",
          name: "schedule",
          component: () =>
            import("@/views/schedule/ScheduleView.vue"),

          meta: {
            title: "Jadwal Kuliah",
          },
        },

        /**
         * =========================
         * MATA KULIAH
         * =========================
         */
        {
          path: "courses",
          name: "courses",
          component: () =>
            import("@/views/courses/CoursesView.vue"),

          meta: {
            title: "Mata Kuliah",
          },
        },

        /**
         * =========================
         * KEHADIRAN
         * =========================
         */
        {
          path: "attendance",
          name: "attendance",
          component: () =>
            import("@/views/attendance/AttendanceView.vue"),

          meta: {
            title: "Kehadiran",
          },
        },

        /**
         * =========================
         * PENGUMUMAN
         * =========================
         */
        {
          path: "announcements",
          name: "announcements",
          component: () =>
            import("@/views/announcements/AnnouncementsView.vue"),

          meta: {
            title: "Pengumuman",
          },
        },

        /**
         * =========================
         * AKADEMIK
         * =========================
         */

        /**
         * KRS / Kartu Studi
         */
        {
          path: "academic/krs",
          name: "academic-krs",
          component: () =>
            import("@/views/academic/KrsView.vue"),

          meta: {
            title: "KRS / Kartu Studi",
          },
        },

        /**
         * Nilai / KHS
         */
        {
          path: "academic/grades",
          name: "academic-grades",
          component: () =>
            import("@/views/academic/GradesView.vue"),

          meta: {
            title: "Nilai / KHS",
          },
        },

        /**
         * Transkrip Nilai
         */
        {
          path: "academic/transcript",
          name: "academic-transcript",
          component: () =>
            import("@/views/academic/TranscriptView.vue"),

          meta: {
            title: "Transkrip Nilai",
          },
        },

        /**
         * =========================
         * PEMBAYARAN
         * =========================
         */
        {
          path: "finance/payments",
          name: "payment-history",
          component: () =>
            import("@/views/payment/PaymentHistoryView.vue"),

          meta: {
            title: "Pembayaran",
          },
        },
      ],
    },

    /**
     * 404
     */
    {
      path: "/:pathMatch(.*)*",
      redirect: {
        name: "dashboard",
      },
    },
  ],
});

// Pasang navigation guard
setupRouterGuards(router);

export default router;