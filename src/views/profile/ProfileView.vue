<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  User,
  CreditCard,
  MapPin,
  Phone,
  Home,
  Users,
  GraduationCap,
  Heart,
  BriefcaseBusiness,
  CalendarDays,
  RefreshCw,
} from "lucide-vue-next";

import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const loading = ref(false);
const error = ref("");

const loadProfile = async () => {
  loading.value = true;
  error.value = "";

  try {
    await auth.fetchMe();
  } catch (err) {
    console.error("Gagal mengambil profil:", err);
    error.value = "Gagal mengambil data profil.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!auth.user) {
    loadProfile();
  }
});
</script>

<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Profil Saya</h1>
        <p>Informasi pribadi dan data kepesantrenan Anda.</p>
      </div>

      <button
        class="refresh-button"
        :disabled="loading"
        @click="loadProfile"
      >
        <RefreshCw
          :size="17"
          :class="{ spinning: loading }"
        />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && !auth.user" class="state-card">
      <RefreshCw :size="28" class="spinning" />
      <p>Memuat profil...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-card error">
      <p>{{ error }}</p>

      <button @click="loadProfile">
        Coba Lagi
      </button>
    </div>

    <!-- Profile -->
    <template v-else-if="auth.user">
      <!-- Profile Hero -->
      <section class="profile-hero">
        <div class="avatar">
          {{ auth.user.name?.charAt(0)?.toUpperCase() || "M" }}
        </div>

        <div class="profile-identity">
          <h2>{{ auth.user.name }}</h2>

          <div class="identity-info">
            <span>
              <CreditCard :size="15" />
              {{ auth.user.nim || "-" }}
            </span>

            <span
              class="status"
              :class="auth.user.is_active ? 'active' : 'inactive'"
            >
              <span class="status-dot"></span>

              {{
                auth.user.is_active
                  ? "Mahasantri Aktif"
                  : "Mahasantri Tidak Aktif"
              }}
            </span>
          </div>
        </div>
      </section>

      <!-- Data Dasar -->
      <section class="profile-section">
        <div class="section-header">
          <div class="section-icon">
            <User :size="19" />
          </div>

          <div>
            <h3>Data Pribadi</h3>
            <p>Informasi dasar mahasantri</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Nama Lengkap</span>
            <span class="value">{{ auth.user.name || "-" }}</span>
          </div>

          <div class="info-item">
            <span class="label">NIM</span>
            <span class="value">{{ auth.user.nim || "-" }}</span>
          </div>

          <div class="info-item">
            <span class="label">NIK</span>
            <span class="value">{{ auth.user.nik || "-" }}</span>
          </div>

          <div class="info-item">
            <span class="label">NISN</span>
            <span class="value">{{ auth.user.nisn || "-" }}</span>
          </div>

          <div class="info-item">
            <span class="label">Tempat Lahir</span>
            <span class="value">
              {{ auth.user.tempat_lahir || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Tanggal Lahir</span>
            <span class="value">
              <CalendarDays :size="15" />
              {{ auth.user.tanggal_lahir || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Anak Ke</span>
            <span class="value">
              {{ auth.user.anak_ke_berapa || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Jumlah Saudara</span>
            <span class="value">
              {{ auth.user.jumlah_saudara ?? "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Pendidikan Terakhir</span>
            <span class="value">
              {{ auth.user.pendidikan_terakhir || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Hobi</span>
            <span class="value">
              {{ auth.user.hobi || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Cita-cita</span>
            <span class="value">
              {{ auth.user.cita_cita || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Riwayat Penyakit</span>
            <span class="value">
              {{ auth.user.riwayat_penyakit || "-" }}
            </span>
          </div>
        </div>
      </section>

      <!-- Kepesantrenan -->
      <section class="profile-section">
        <div class="section-header">
          <div class="section-icon">
            <Home :size="19" />
          </div>

          <div>
            <h3>Data Kepesantrenan</h3>
            <p>Informasi tempat tinggal di pesantren</p>
          </div>
        </div>

        <div class="campus-grid">
          <div class="campus-card">
            <span class="campus-label">Pondok</span>

            <strong>
              {{ auth.user.pondok?.nama_pondok || "-" }}
            </strong>

            <small>
              Kode:
              {{ auth.user.pondok?.kode_pondok || "-" }}
            </small>
          </div>

          <div class="campus-card">
            <span class="campus-label">Komplek</span>

            <strong>
              {{ auth.user.komplek?.nama_komplek || "-" }}
            </strong>

            <small>
              Kode:
              {{ auth.user.komplek?.kode_komplek || "-" }}
            </small>
          </div>

          <div class="campus-card">
            <span class="campus-label">Kamar</span>

            <strong>
              {{ auth.user.kamar?.nama_kamar || "-" }}
            </strong>

            <small>
              Kode:
              {{ auth.user.kamar?.kode_kamar || "-" }}
            </small>
          </div>
        </div>
      </section>

      <!-- Ayah & Ibu -->
      <div class="two-column">
        <!-- Ayah -->
        <section class="profile-section">
          <div class="section-header">
            <div class="section-icon">
              <Users :size="19" />
            </div>

            <div>
              <h3>Data Ayah</h3>
              <p>Informasi orang tua</p>
            </div>
          </div>

          <div class="detail-list">
            <div class="detail-item">
              <span>Nama</span>
              <strong>{{ auth.user.ayah?.nama || "-" }}</strong>
            </div>

            <div class="detail-item">
              <span>Status</span>
              <strong>{{ auth.user.ayah?.status || "-" }}</strong>
            </div>

            <div class="detail-item">
              <span>NIK</span>
              <strong>{{ auth.user.ayah?.nik || "-" }}</strong>
            </div>

            <div class="detail-item">
              <span>Tempat Lahir</span>
              <strong>
                {{ auth.user.ayah?.tempat_lahir || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Tanggal Lahir</span>
              <strong>
                {{ auth.user.ayah?.tanggal_lahir || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Pendidikan</span>
              <strong>
                {{ auth.user.ayah?.pendidikan_terakhir || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Pekerjaan</span>
              <strong>
                {{ auth.user.ayah?.pekerjaan || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Penghasilan / Bulan</span>
              <strong>
                {{ auth.user.ayah?.penghasilan_per_bulan || "-" }}
              </strong>
            </div>
          </div>
        </section>

        <!-- Ibu -->
        <section class="profile-section">
          <div class="section-header">
            <div class="section-icon">
              <Heart :size="19" />
            </div>

            <div>
              <h3>Data Ibu</h3>
              <p>Informasi orang tua</p>
            </div>
          </div>

          <div class="detail-list">
            <div class="detail-item">
              <span>Nama</span>
              <strong>{{ auth.user.ibu?.nama || "-" }}</strong>
            </div>

            <div class="detail-item">
              <span>Status</span>
              <strong>{{ auth.user.ibu?.status || "-" }}</strong>
            </div>

            <div class="detail-item">
              <span>NIK</span>
              <strong>{{ auth.user.ibu?.nik || "-" }}</strong>
            </div>

            <div class="detail-item">
              <span>Tempat Lahir</span>
              <strong>
                {{ auth.user.ibu?.tempat_lahir || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Tanggal Lahir</span>
              <strong>
                {{ auth.user.ibu?.tanggal_lahir || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Pendidikan</span>
              <strong>
                {{ auth.user.ibu?.pendidikan_terakhir || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Pekerjaan</span>
              <strong>
                {{ auth.user.ibu?.pekerjaan || "-" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Penghasilan / Bulan</span>
              <strong>
                {{ auth.user.ibu?.penghasilan_per_bulan || "-" }}
              </strong>
            </div>
          </div>
        </section>
      </div>

      <!-- Wali -->
      <section class="profile-section">
        <div class="section-header">
          <div class="section-icon">
            <User :size="19" />
          </div>

          <div>
            <h3>Data Wali</h3>
            <p>Informasi wali mahasantri</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Nama</span>
            <span class="value">
              {{ auth.user.wali?.nama || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">NIK</span>
            <span class="value">
              {{ auth.user.wali?.nik || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Status</span>
            <span class="value">
              {{ auth.user.wali?.status || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Pekerjaan</span>
            <span class="value">
              <BriefcaseBusiness :size="15" />
              {{ auth.user.wali?.pekerjaan || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">No. WhatsApp</span>
            <span class="value">
              <Phone :size="15" />
              {{ auth.user.wali?.no_wa || "-" }}
            </span>
          </div>
        </div>
      </section>

      <!-- Alamat -->
      <section class="profile-section">
        <div class="section-header">
          <div class="section-icon">
            <MapPin :size="19" />
          </div>

          <div>
            <h3>Alamat</h3>
            <p>Informasi alamat tempat tinggal</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">No. Kartu Keluarga</span>
            <span class="value">
              {{ auth.user.alamat?.no_kartu_keluarga || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Provinsi</span>
            <span class="value">
              {{ auth.user.alamat?.provinsi || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Kabupaten / Kota</span>
            <span class="value">
              {{ auth.user.alamat?.kabupaten_kota || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Kecamatan</span>
            <span class="value">
              {{ auth.user.alamat?.kecamatan || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Kelurahan</span>
            <span class="value">
              {{ auth.user.alamat?.kelurahan || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">Dusun / Jalan / Blok</span>
            <span class="value">
              {{ auth.user.alamat?.dusun_jalan_blok || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">RT / RW</span>
            <span class="value">
              {{ auth.user.alamat?.rt_rw || "-" }}
            </span>
          </div>

          <div class="info-item">
            <span class="label">No. WhatsApp Orang Tua</span>
            <span class="value">
              <Phone :size="15" />
              {{ auth.user.no_wa_orang_tua || "-" }}
            </span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.profile-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
}

/* Header */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.page-header p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.refresh-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  background: white;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Hero */

.profile-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: white;
}

.avatar {
  width: 72px;
  height: 72px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #2563eb;
  color: white;

  font-size: 27px;
  font-weight: 700;
}

.profile-identity h2 {
  margin: 0 0 8px;

  color: #111827;
  font-size: 21px;
  font-weight: 700;
}

.identity-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 13px;
}

.identity-info span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status.active {
  background: #ecfdf5;
  color: #047857;
}

.status.inactive {
  background: #fef2f2;
  color: #b91c1c;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Section */

.profile-section {
  margin-bottom: 20px;
  padding: 22px;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  background: white;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 20px;
}

.section-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 9px;

  background: #eff6ff;
  color: #2563eb;
}

.section-header h3 {
  margin: 0;

  color: #111827;
  font-size: 16px;
  font-weight: 700;
}

.section-header p {
  margin: 3px 0 0;

  color: #9ca3af;
  font-size: 12px;
}

/* Grid */

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;

  overflow: hidden;

  border: 1px solid #f0f0f0;
  border-radius: 10px;

  background: #f0f0f0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  min-width: 0;
  padding: 13px 15px;

  background: white;
}

.label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.value {
  display: flex;
  align-items: center;
  gap: 6px;

  min-width: 0;

  color: #374151;
  font-size: 13px;
  font-weight: 600;

  word-break: break-word;
}

/* Campus */

.campus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.campus-card {
  padding: 16px;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  background: #fafafa;
}

.campus-label {
  display: block;

  margin-bottom: 7px;

  color: #9ca3af;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.campus-card strong {
  display: block;

  color: #111827;
  font-size: 14px;
}

.campus-card small {
  display: block;

  margin-top: 5px;

  color: #9ca3af;
  font-size: 11px;
}

/* Two columns */

.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.two-column .profile-section {
  min-width: 0;
}

/* Detail */

.detail-list {
  display: flex;
  flex-direction: column;

  border-top: 1px solid #f3f4f6;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  padding: 11px 0;

  border-bottom: 1px solid #f3f4f6;
}

.detail-item span {
  flex-shrink: 0;

  color: #9ca3af;
  font-size: 12px;
}

.detail-item strong {
  color: #374151;
  font-size: 12px;
  text-align: right;
  word-break: break-word;
}

/* State */

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 300px;

  padding: 30px;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  background: white;

  color: #6b7280;
}

.state-card p {
  margin: 12px 0 0;
  font-size: 14px;
}

.state-card.error {
  color: #b91c1c;
}

.state-card button {
  margin-top: 12px;
  padding: 8px 14px;

  border: 0;
  border-radius: 8px;

  background: #2563eb;
  color: white;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

/* Animation */

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */

@media (max-width: 900px) {
  .campus-grid {
    grid-template-columns: 1fr;
  }

  .two-column {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding-bottom: 24px;
  }

  .page-header {
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .refresh-button span {
    display: none;
  }

  .refresh-button {
    padding: 9px;
  }

  .profile-hero {
    padding: 18px;
  }

  .avatar {
    width: 58px;
    height: 58px;
    font-size: 22px;
  }

  .profile-identity h2 {
    font-size: 17px;
  }

  .identity-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }

  .profile-section {
    padding: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    flex-direction: column;
    gap: 4px;
  }

  .detail-item strong {
    text-align: left;
  }
}
</style>