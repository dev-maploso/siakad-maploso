<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const menu = [
  {
    title: "Jadwal Kuliah",
    description: "Lihat jadwal perkuliahan dan mata kuliah yang sedang berjalan.",
    route: "/schedule",
    icon: "📅",
  },
  {
    title: "Mata Kuliah",
    description: "Lihat daftar mata kuliah yang sedang dan telah ditempuh.",
    route: "/courses",
    icon: "📚",
  },
  {
    title: "Absensi",
    description: "Lihat riwayat dan rekap kehadiran perkuliahan.",
    route: "/attendance",
    icon: "📝",
  },
  {
    title: "Nilai Akademik",
    description: "Lihat nilai mata kuliah dan hasil studi.",
    route: "/grades",
    icon: "🎓",
  },
  {
    title: "Keuangan",
    description: "Lihat tagihan dan riwayat pembayaran.",
    route: "/finance",
    icon: "💳",
  },
  {
    title: "Pengumuman",
    description: "Lihat informasi dan pengumuman terbaru.",
    route: "/announcements",
    icon: "📢",
  },
  {
    title: "Profil",
    description: "Lihat informasi pribadi dan data kepesantrenan.",
    route: "/profile",
    icon: "👤",
  },
];
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div>
        <p class="welcome">Selamat datang 👋</p>

        <h1>
          {{ auth.user?.name || "Mahasantri" }}
        </h1>

        <p class="subtitle">
          Selamat datang di SIAKAD Mahasantri.
        </p>
      </div>

      <div class="identity" v-if="auth.user">
        <span class="status-dot"></span>

        <div>
          <strong>{{ auth.user.nim }}</strong>
          <small>Mahasantri</small>
        </div>
      </div>
    </header>

    <!-- Quick Menu -->
    <section class="section">
      <div class="section-header">
        <h2>Akses Cepat</h2>
        <p>Pilih layanan yang ingin Anda akses.</p>
      </div>

      <div class="menu-grid">
        <RouterLink
          v-for="item in menu"
          :key="item.route"
          :to="item.route"
          class="menu-card"
        >
          <div class="icon">
            {{ item.icon }}
          </div>

          <div class="content">
            <h3>{{ item.title }}</h3>

            <p>
              {{ item.description }}
            </p>
          </div>

          <span class="arrow">→</span>
        </RouterLink>
      </div>
    </section>

    <!-- Profile Summary -->
    <section
      v-if="auth.user"
      class="profile-card"
    >
      <div class="profile-avatar">
        {{ auth.user.name.charAt(0).toUpperCase() }}
      </div>

      <div class="profile-info">
        <span class="profile-label">
          Profil Mahasantri
        </span>

        <h3>
          {{ auth.user.name }}
        </h3>

        <p>
          NIM: {{ auth.user.nim }}
        </p>
      </div>

      <RouterLink
        to="/profile"
        class="profile-button"
      >
        Lihat Profil
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* =========================
   HEADER
========================= */

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 36px;
}

.welcome {
  margin: 0 0 6px;
  font-size: 14px;
  color: #6b7280;
}

.header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #111827;
}

.subtitle {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
}

/* =========================
   IDENTITY
========================= */

.identity {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 14px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.status-dot {
  width: 9px;
  height: 9px;
  background: #22c55e;
  border-radius: 50%;
}

.identity div {
  display: flex;
  flex-direction: column;
}

.identity strong {
  font-size: 14px;
  color: #111827;
}

.identity small {
  margin-top: 2px;
  font-size: 12px;
  color: #6b7280;
}

/* =========================
   SECTION
========================= */

.section {
  margin-bottom: 28px;
}

.section-header {
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.section-header p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #6b7280;
}

/* =========================
   MENU
========================= */

.menu-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  );
  gap: 16px;
}

.menu-card {
  position: relative;

  display: flex;
  align-items: flex-start;
  gap: 14px;

  min-height: 125px;
  padding: 20px;

  text-decoration: none;
  color: inherit;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.menu-card:hover {
  transform: translateY(-3px);

  border-color: #d1d5db;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.07);
}

.icon {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  font-size: 25px;

  background: #f3f4f6;
  border-radius: 12px;
}

.content {
  flex: 1;
  padding-right: 20px;
}

.menu-card h3 {
  margin: 2px 0 0;

  font-size: 16px;
  font-weight: 600;

  color: #111827;
}

.menu-card p {
  margin: 7px 0 0;

  font-size: 13px;
  line-height: 1.5;

  color: #6b7280;
}

.arrow {
  position: absolute;
  right: 18px;
  bottom: 16px;

  font-size: 18px;

  color: #9ca3af;

  transition: transform 0.2s ease;
}

.menu-card:hover .arrow {
  transform: translateX(3px);
}

/* =========================
   PROFILE CARD
========================= */

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 20px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.profile-avatar {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;

  border-radius: 50%;

  background: #f3f4f6;

  font-size: 21px;
  font-weight: 700;

  color: #374151;
}

.profile-info {
  flex: 1;
}

.profile-label {
  display: block;

  margin-bottom: 3px;

  font-size: 12px;
  color: #6b7280;
}

.profile-info h3 {
  margin: 0;

  font-size: 16px;
  font-weight: 600;

  color: #111827;
}

.profile-info p {
  margin: 4px 0 0;

  font-size: 13px;

  color: #6b7280;
}

.profile-button {
  padding: 9px 15px;

  text-decoration: none;

  font-size: 13px;
  font-weight: 500;

  color: #111827;

  border: 1px solid #d1d5db;
  border-radius: 8px;

  transition: 0.2s;
}

.profile-button:hover {
  background: #f9fafb;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 640px) {
  .dashboard {
    padding: 16px;
  }

  .header {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 28px;
  }

  .header h1 {
    font-size: 24px;
  }

  .identity {
    width: 100%;
    box-sizing: border-box;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }

  .menu-card {
    min-height: auto;
  }

  .profile-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .profile-button {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }
}
</style>