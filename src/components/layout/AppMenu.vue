<script setup lang="ts">
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  FileText,
  Wallet,
  CreditCard,
  Megaphone,
  FileCheck,
  User,
  LogOut,
  ChevronDown,
  School,
} from "lucide-vue-next";

import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const props = defineProps<{
  collapsed: boolean;
}>();

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const akademikOpen = ref(true);
const keuanganOpen = ref(false);

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
    match: (path: string) => path === "/dashboard",
  },
    {
    title: "Kelas",
    icon: School,
    to: "/classes",
    match: (path: string) => path.startsWith("/classes"),
  },
  {
    title: "Jadwal Kuliah",
    icon: CalendarDays,
    to: "/schedule",
    match: (path: string) => path.startsWith("/schedule"),
  },
  {
    title: "Mata Kuliah",
    icon: BookOpen,
    to: "/courses",
    match: (path: string) => path.startsWith("/courses"),
  },
  {
    title: "Absensi",
    icon: ClipboardCheck,
    to: "/attendance",
    match: (path: string) =>
      path === "/attendance" ||
      path.startsWith("/attendance/"),
  },
  {
    title: "Perizinan",
    icon: FileCheck,
    to: "/permissions",
    match: (path: string) => path.startsWith("/permissions"),
  },
  {
    title: "Pengumuman",
    icon: Megaphone,
    to: "/announcements",
    match: (path: string) =>
      path.startsWith("/announcements"),
  },
];

const akademikMenus = [
  {
    title: "KRS / Kartu Studi",
    icon: ClipboardList,
    to: "/academic/krs",
    match: (path: string) =>
      path.startsWith("/academic/krs"),
  },
  {
    title: "Nilai / KHS",
    icon: GraduationCap,
    to: "/academic/grades",
    match: (path: string) =>
      path.startsWith("/academic/grades"),
  },
  {
    title: "Transkrip Nilai",
    icon: FileText,
    to: "/academic/transcript",
    match: (path: string) =>
      path.startsWith("/academic/transcript"),
  },
];

const keuanganMenus = [
  {
    title: "Tagihan",
    icon: Wallet,
    to: "/finance/bills",
    match: (path: string) =>
      path.startsWith("/finance/bills"),
  },
  {
    title: "Riwayat Pembayaran",
    icon: CreditCard,
    to: "/finance/payments",
    match: (path: string) =>
      path.startsWith("/finance/payments"),
  },
];

const bottomMenus = [
  {
    title: "Profil",
    icon: User,
    to: "/profile",
    match: (path: string) =>
      path.startsWith("/profile"),
  },
];

const isActive = (menu: {
  match: (path: string) => boolean;
}) => {
  return menu.match(route.path);
};

const isAkademikActive = () => {
  return akademikMenus.some((menu) =>
    menu.match(route.path)
  );
};

const isKeuanganActive = () => {
  return keuanganMenus.some((menu) =>
    menu.match(route.path)
  );
};

const toggleAkademik = () => {
  if (!props.collapsed) {
    akademikOpen.value = !akademikOpen.value;
  }
};

const toggleKeuangan = () => {
  if (!props.collapsed) {
    keuanganOpen.value = !keuanganOpen.value;
  }
};

const logout = async () => {
  await auth.logout();
  await router.replace({ name: "login" });
};
</script>

<template>
  <nav class="menu">

    <!-- =========================
         MENU UTAMA
    ========================== -->
    <div class="menu-top">

      <RouterLink
        v-for="menu in menus"
        :key="menu.to"
        :to="menu.to"
        class="menu-item"
        :class="{
          active: isActive(menu),
          collapsed,
        }"
        :title="collapsed ? menu.title : ''"
      >
        <component
          :is="menu.icon"
          :size="20"
          class="icon"
        />

        <span
          v-if="!collapsed"
          class="label"
        >
          {{ menu.title }}
        </span>
      </RouterLink>


      <!-- =========================
           AKADEMIK
      ========================== -->
      <div class="menu-section">

        <button
          class="menu-item section-header"
          :class="{
            active: isAkademikActive(),
            collapsed,
          }"
          :title="collapsed ? 'Akademik' : ''"
          @click="toggleAkademik"
        >
          <GraduationCap
            :size="20"
            class="icon"
          />

          <span
            v-if="!collapsed"
            class="label"
          >
            Akademik
          </span>

          <ChevronDown
            v-if="!collapsed"
            :size="16"
            class="section-arrow"
            :class="{ rotate: akademikOpen }"
          />
        </button>


        <div
          v-if="!collapsed && akademikOpen"
          class="submenu"
        >
          <RouterLink
            v-for="menu in akademikMenus"
            :key="menu.to"
            :to="menu.to"
            class="submenu-item"
            :class="{ active: isActive(menu) }"
          >
            <component
              :is="menu.icon"
              :size="17"
              class="icon"
            />

            <span class="label">
              {{ menu.title }}
            </span>
          </RouterLink>
        </div>

      </div>


      <!-- =========================
           KEUANGAN
      ========================== -->
      <div class="menu-section">

        <button
          class="menu-item section-header"
          :class="{
            active: isKeuanganActive(),
            collapsed,
          }"
          :title="collapsed ? 'Keuangan' : ''"
          @click="toggleKeuangan"
        >
          <Wallet
            :size="20"
            class="icon"
          />

          <span
            v-if="!collapsed"
            class="label"
          >
            Keuangan
          </span>

          <ChevronDown
            v-if="!collapsed"
            :size="16"
            class="section-arrow"
            :class="{ rotate: keuanganOpen }"
          />
        </button>


        <div
          v-if="!collapsed && keuanganOpen"
          class="submenu"
        >
          <RouterLink
            v-for="menu in keuanganMenus"
            :key="menu.to"
            :to="menu.to"
            class="submenu-item"
            :class="{ active: isActive(menu) }"
          >
            <component
              :is="menu.icon"
              :size="17"
              class="icon"
            />

            <span class="label">
              {{ menu.title }}
            </span>
          </RouterLink>
        </div>

      </div>

    </div>


    <!-- =========================
         MENU BAWAH
    ========================== -->
    <div class="menu-bottom">

      <RouterLink
        v-for="menu in bottomMenus"
        :key="menu.to"
        :to="menu.to"
        class="menu-item"
        :class="{
          active: isActive(menu),
          collapsed,
        }"
        :title="collapsed ? menu.title : ''"
      >
        <component
          :is="menu.icon"
          :size="20"
          class="icon"
        />

        <span
          v-if="!collapsed"
          class="label"
        >
          {{ menu.title }}
        </span>
      </RouterLink>


      <!-- LOGOUT -->
      <button
        class="menu-item logout"
        :class="{ collapsed }"
        :title="collapsed ? 'Logout' : ''"
        @click="logout"
      >
        <LogOut
          :size="20"
          class="icon"
        />

        <span
          v-if="!collapsed"
          class="label"
        >
          Logout
        </span>
      </button>

    </div>

  </nav>
</template>


<style scoped>
.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.menu-top {
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
  padding-right: 2px;
}

/* Scrollbar */
.menu-top::-webkit-scrollbar {
  width: 4px;
}

.menu-top::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}


/* =========================
   MENU ITEM
========================= */

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;

  min-height: 46px;
  padding: 0 14px;

  border-radius: 12px;

  color: #cbd5e1;
  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  cursor: pointer;

  border: none;
  background: transparent;

  font: inherit;
  width: 100%;

  text-align: left;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.menu-item.active {
  background: #2563eb;
  color: white;
  font-weight: 600;
}

.menu-item.collapsed {
  justify-content: center;
  padding: 0;
}

.icon {
  flex-shrink: 0;
}

.label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


/* =========================
   SECTION
========================= */

.menu-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  position: relative;
}

.section-header.active {
  background: rgba(37, 99, 235, 0.18);
  color: #bfdbfe;
}

.section-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.section-arrow.rotate {
  transform: rotate(180deg);
}


/* =========================
   SUBMENU
========================= */

.submenu {
  display: flex;
  flex-direction: column;

  gap: 3px;

  margin: 2px 0 5px 20px;
  padding-left: 14px;

  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 12px;

  min-height: 40px;
  padding: 0 12px;

  border-radius: 9px;

  color: #94a3b8;
  text-decoration: none;

  font-size: 14px;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: white;
}

.submenu-item.active {
  background: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
  font-weight: 600;
}


/* =========================
   BOTTOM
========================= */

.menu-bottom {
  margin-top: auto;

  display: flex;
  flex-direction: column;

  gap: 6px;

  padding-top: 20px;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}


/* =========================
   LOGOUT
========================= */

.logout:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}
</style>