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
        {
          path: "",
          redirect: {
            name: "dashboard",
          },
        },

        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("@/views/dashboard/DashboardView.vue"),

          meta: {
            title: "Dashboard",
          },
        },

        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/profile/ProfileView.vue"),

          meta: {
            title: "Profil",
          },
        },

        {
          path: "/classes",
          name: "classes",
          component: () => import("@/views/kelas/KelasView.vue"),
          meta: {
            requiresAuth: true,
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
