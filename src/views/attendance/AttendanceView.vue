<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserCheck,
  UserX,
  HeartPulse,
  AlertCircle,
  ChevronDown,
  LoaderCircle,
} from "lucide-vue-next";

import { useRegistrasiKelasStore } from "@/stores/registrasi-kelas";
import { useAttendanceStore } from "@/stores/attendance";

const kelasStore =
  useRegistrasiKelasStore();

const attendanceStore =
  useAttendanceStore();

const selectedRegistrasiKelasId =
  ref<number | null>(null);

const kelasItems = computed(() => {
  return kelasStore.items;
});

const registration = computed(() => {
  return attendanceStore.registration;
});

const summary = computed(() => {
  return attendanceStore.summary;
});

const attendanceItems = computed(() => {
  return attendanceStore.items;
});


/**
 * =========================================================
 * LOAD KELAS
 * =========================================================
 */

async function loadKelas() {
  try {
    await kelasStore.fetchKelas({
      page: 1,
      per_page: 100,
    });
  } catch (error) {
    console.error(
      "GAGAL LOAD KELAS:",
      error
    );
  }
}


/**
 * =========================================================
 * PILIH KELAS
 * =========================================================
 */

async function handleKelasChange() {
  attendanceStore.clear();

  if (
    !selectedRegistrasiKelasId.value
  ) {
    return;
  }

  const selected =
    kelasItems.value.find(
      (item) =>
        item.id ===
        selectedRegistrasiKelasId.value
    );

  if (!selected) {
    return;
  }

  if (!selected.semester?.id) {
    attendanceStore.error =
      "Semester kelas tidak ditemukan.";

    return;
  }

  try {
    await attendanceStore.fetchHistory(
      selected.id,
      selected.semester.id,
      1
    );
  } catch {
    // Error sudah ditangani store.
  }
}


/**
 * =========================================================
 * FORMAT TANGGAL
 * =========================================================
 */

function formatTanggal(
  tanggal: string | null
): string {

  if (!tanggal) {
    return "-";
  }

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) {
    return tanggal;
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}


/**
 * =========================================================
 * STATUS
 * =========================================================
 */

function getStatusLabel(
  status: string
): string {

  switch (status.toLowerCase()) {
    case "hadir":
      return "Hadir";

    case "izin":
      return "Izin";

    case "sakit":
      return "Sakit";

    case "alpha":
      return "Alpha";

    default:
      return status;
  }
}


function getStatusClass(
  status: string
): string {

  switch (status.toLowerCase()) {
    case "hadir":
      return "status-hadir";

    case "izin":
      return "status-izin";

    case "sakit":
      return "status-sakit";

    case "alpha":
      return "status-alpha";

    default:
      return "status-default";
  }
}


/**
 * =========================================================
 * STATUS ICON
 * =========================================================
 */

function getStatusIcon(
  status: string
) {

  switch (status.toLowerCase()) {
    case "hadir":
      return UserCheck;

    case "izin":
      return Clock3;

    case "sakit":
      return HeartPulse;

    case "alpha":
      return UserX;

    default:
      return AlertCircle;
  }
}


/**
 * =========================================================
 * PERSENTASE
 * =========================================================
 */

const attendancePercentage =
  computed(() => {

    return (
      summary.value
        ?.persentase_kehadiran ?? 0
    );
  });


/**
 * =========================================================
 * RETRY
 * =========================================================
 */

async function retry() {

  if (
    !selectedRegistrasiKelasId.value
  ) {
    return;
  }

  const selected =
    kelasItems.value.find(
      (item) =>
        item.id ===
        selectedRegistrasiKelasId.value
    );

  if (!selected?.semester?.id) {
    return;
  }

  try {
    await attendanceStore.fetchHistory(
      selected.id,
      selected.semester.id,
      attendanceStore.page
    );
  } catch {
    // handled by store
  }
}


/**
 * =========================================================
 * PAGINATION
 * =========================================================
 */

async function previousPage() {
  await attendanceStore.previousPage();
}

async function nextPage() {
  await attendanceStore.nextPage();
}


/**
 * =========================================================
 * INITIAL
 * =========================================================
 */

onMounted(async () => {
  await loadKelas();
});
</script>

<template>

  <div class="attendance-page">

    <!-- =====================================================
         HEADER
         ===================================================== -->

    <header class="attendance-header">

      <div>

        <p class="eyebrow">
          AKADEMIK
        </p>

        <h1>
          Kehadiran
        </h1>

        <p class="header-description">
          Lihat riwayat dan rekap kehadiran
          berdasarkan kelas dan semester.
        </p>

      </div>

    </header>


    <!-- =====================================================
         SELECTOR
         ===================================================== -->

    <section class="attendance-selector">

      <div class="selector-header">

        <div class="selector-icon">
          <CalendarDays :size="21" />
        </div>

        <div>

          <h2>
            Pilih Kelas
          </h2>

          <p>
            Pilih kelas dan semester untuk
            melihat kehadiran.
          </p>

        </div>

      </div>


      <!-- LOADING KELAS -->

      <div
        v-if="kelasStore.loading"
        class="selector-loading"
      >

        <LoaderCircle
          :size="20"
          class="loading-icon"
        />

        <span>
          Memuat daftar kelas...
        </span>

      </div>


      <!-- DROPDOWN -->

      <div
        v-else
        class="select-wrapper"
      >

        <select
          v-model="selectedRegistrasiKelasId"
          class="kelas-select"
          @change="handleKelasChange"
        >

          <option :value="null">
            Pilih kelas / semester...
          </option>

          <option
            v-for="item in kelasItems"
            :key="item.id"
            :value="item.id"
          >

            {{
              item.kelas.nama_kelas ||
              "Kelas tidak tersedia"
            }}

            -

            {{
              item.tahun_ajaran?.nama ||
              "-"
            }}

            {{
              item.semester?.nama ||
              ""
            }}

          </option>

        </select>

        <ChevronDown
          :size="18"
          class="select-icon"
        />

      </div>

    </section>


    <!-- =====================================================
         LOADING ATTENDANCE
         ===================================================== -->

    <div
      v-if="attendanceStore.loading"
      class="loading-state"
    >

      <LoaderCircle
        :size="32"
        class="loading-spinner"
      />

      <p>
        Memuat data kehadiran...
      </p>

    </div>


    <!-- =====================================================
         ERROR
         ===================================================== -->

    <div
      v-else-if="attendanceStore.error"
      class="error-state"
    >

      <div class="error-icon">
        <AlertCircle :size="27" />
      </div>

      <div>

        <h3>
          Gagal memuat kehadiran
        </h3>

        <p>
          {{ attendanceStore.error }}
        </p>

        <button
          type="button"
          class="retry-button"
          @click="retry"
        >
          Coba Lagi
        </button>

      </div>

    </div>


    <!-- =====================================================
         DETAIL
         ===================================================== -->

    <main
      v-else-if="attendanceStore.hasData"
      class="attendance-content"
    >

      <!-- CLASS INFO -->

      <section class="class-info-card">

        <div class="class-icon">
          <CalendarDays :size="23" />
        </div>

        <div class="class-info">

          <p class="class-label">
            Kehadiran Kelas
          </p>

          <h2>
            {{
              registration?.kelas?.nama ||
              "Kelas"
            }}
          </h2>

          <div class="class-meta">

            <span>
              <CalendarDays :size="15" />

              {{
                registration?.semester?.nama ||
                "-"
              }}
            </span>

          </div>

        </div>

      </section>


      <!-- ===================================================
           SUMMARY
           =================================================== -->

      <section class="summary-grid">

        <!-- TOTAL -->

        <div class="summary-card">

          <div class="summary-icon">
            <CalendarDays :size="20" />
          </div>

          <div>

            <p>
              Total Pertemuan
            </p>

            <strong>
              {{
                summary?.total_pertemuan ?? 0
              }}
            </strong>

          </div>

        </div>


        <!-- HADIR -->

        <div class="summary-card">

          <div class="summary-icon hadir">
            <UserCheck :size="20" />
          </div>

          <div>

            <p>
              Hadir
            </p>

            <strong>
              {{
                summary?.hadir ?? 0
              }}
            </strong>

          </div>

        </div>


        <!-- IZIN -->

        <div class="summary-card">

          <div class="summary-icon izin">
            <Clock3 :size="20" />
          </div>

          <div>

            <p>
              Izin
            </p>

            <strong>
              {{
                summary?.izin ?? 0
              }}
            </strong>

          </div>

        </div>


        <!-- SAKIT -->

        <div class="summary-card">

          <div class="summary-icon sakit">
            <HeartPulse :size="20" />
          </div>

          <div>

            <p>
              Sakit
            </p>

            <strong>
              {{
                summary?.sakit ?? 0
              }}
            </strong>

          </div>

        </div>


        <!-- ALPHA -->

        <div class="summary-card">

          <div class="summary-icon alpha">
            <UserX :size="20" />
          </div>

          <div>

            <p>
              Alpha
            </p>

            <strong>
              {{
                summary?.alpha ?? 0
              }}
            </strong>

          </div>

        </div>


        <!-- PERSENTASE -->

        <div class="summary-card percentage-card">

          <div class="percentage-circle">

            <strong>
              {{ attendancePercentage }}%
            </strong>

          </div>

          <div>

            <p>
              Persentase Kehadiran
            </p>

            <strong>
              {{ attendancePercentage }}%
            </strong>

          </div>

        </div>

      </section>


      <!-- ===================================================
           HISTORY
           =================================================== -->

      <section class="history-section">

        <div class="section-header">

          <div>

            <p class="eyebrow">
              RIWAYAT
            </p>

            <h2>
              Riwayat Kehadiran
            </h2>

          </div>

          <span class="attendance-count">
            {{ attendanceStore.total }}
            data
          </span>

        </div>


        <!-- EMPTY -->

        <div
          v-if="!attendanceStore.hasItems"
          class="empty-state"
        >

          <div class="empty-icon">
            <CalendarDays :size="27" />
          </div>

          <h3>
            Belum ada data kehadiran
          </h3>

          <p>
            Belum terdapat data kehadiran
            untuk kelas dan semester ini.
          </p>

        </div>


        <!-- LIST -->

        <div
          v-else
          class="attendance-list"
        >

          <div
            v-for="item in attendanceItems"
            :key="item.id"
            class="attendance-card"
          >

            <div class="attendance-date">

              <span class="date-day">
                {{
                  item.tanggal
                    ? new Date(
                        item.tanggal
                      ).getDate()
                    : "-"
                }}
              </span>

              <span class="date-month">
                {{
                  item.tanggal
                    ? new Intl.DateTimeFormat(
                        "id-ID",
                        {
                          month: "short",
                        }
                      ).format(
                        new Date(
                          item.tanggal
                        )
                      )
                    : "-"
                }}
              </span>

            </div>


            <div class="attendance-main">

              <div class="attendance-top">

                <h3>
                  Pertemuan
                  {{ item.jam_ke ?? "-" }}
                </h3>

                <span
                  class="attendance-status"
                  :class="
                    getStatusClass(
                      item.status
                    )
                  "
                >

                  <component
                    :is="
                      getStatusIcon(
                        item.status
                      )
                    "
                    :size="13"
                  />

                  {{
                    getStatusLabel(
                      item.status
                    )
                  }}

                </span>

              </div>


              <div class="attendance-meta">

                <span>
                  {{ formatTanggal(item.tanggal) }}
                </span>

                <span
                  v-if="item.jam_hadir"
                >
                  Hadir:
                  {{ item.jam_hadir }}
                </span>

                <span
                  v-if="item.keterangan"
                >
                  {{ item.keterangan }}
                </span>

              </div>

            </div>

          </div>

        </div>


        <!-- =================================================
             PAGINATION
             ================================================= -->

        <div
          v-if="
            attendanceStore.pagination &&
            attendanceStore.lastPage > 1
          "
          class="pagination"
        >

          <button
            type="button"
            :disabled="
              attendanceStore.currentPage <= 1
            "
            @click="previousPage"
          >
            Sebelumnya
          </button>

          <span>
            Halaman
            {{ attendanceStore.currentPage }}
            dari
            {{ attendanceStore.lastPage }}
          </span>

          <button
            type="button"
            :disabled="
              attendanceStore.currentPage >=
              attendanceStore.lastPage
            "
            @click="nextPage"
          >
            Berikutnya
          </button>

        </div>

      </section>

    </main>


    <!-- =====================================================
         BELUM PILIH
         ===================================================== -->

    <div
      v-else-if="
        !selectedRegistrasiKelasId &&
        !attendanceStore.loading
      "
      class="empty-state page-empty"
    >

      <div class="empty-icon">
        <CalendarDays :size="28" />
      </div>

      <h3>
        Pilih kelas terlebih dahulu
      </h3>

      <p>
        Pilih kelas dan semester pada dropdown
        di atas untuk melihat riwayat kehadiran.
      </p>

    </div>

  </div>
</template>
<style scoped>
/* =========================================================
   PAGE
   ========================================================= */

.attendance-page {
  min-height: 100%;
  padding: 28px;
  background: #f8fafc;
}


/* =========================================================
   HEADER
   ========================================================= */

.attendance-header {
  max-width: 1180px;
  margin: 0 auto 28px;
}

.attendance-header h1 {
  margin: 0;

  color: #0f172a;

  font-size: 30px;
  font-weight: 800;

  letter-spacing: -0.03em;
}

.eyebrow {
  margin: 0 0 7px;

  color: #64748b;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.12em;
}

.header-description {
  margin: 8px 0 0;

  color: #64748b;

  font-size: 14px;
}


/* =========================================================
   SELECTOR
   ========================================================= */

.attendance-selector {
  max-width: 1180px;

  margin: 0 auto 24px;

  padding: 22px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  box-shadow:
    0 4px 16px rgba(15, 23, 42, 0.04);
}

.selector-header {
  display: flex;
  align-items: center;

  gap: 13px;

  margin-bottom: 18px;
}

.selector-icon {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #2563eb;

  background: #eff6ff;

  border-radius: 12px;
}

.selector-header h2 {
  margin: 0;

  color: #0f172a;

  font-size: 16px;
  font-weight: 800;
}

.selector-header p {
  margin: 4px 0 0;

  color: #64748b;

  font-size: 12px;
}


/* =========================================================
   DROPDOWN
   ========================================================= */

.select-wrapper {
  position: relative;

  width: 100%;
}

.kelas-select {
  width: 100%;

  appearance: none;
  -webkit-appearance: none;

  padding: 13px 44px 13px 14px;

  color: #0f172a;

  background: #f8fafc;

  border: 1px solid #cbd5e1;

  border-radius: 10px;

  outline: none;

  font-family: inherit;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.kelas-select:hover {
  background: #ffffff;

  border-color: #94a3b8;
}

.kelas-select:focus {
  background: #ffffff;

  border-color: #2563eb;

  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.1);
}

.kelas-select option {
  color: #0f172a;

  background: #ffffff;

  font-size: 14px;
}

.select-icon {
  position: absolute;

  right: 14px;
  top: 50%;

  transform: translateY(-50%);

  pointer-events: none;

  color: #64748b;
}


/* =========================================================
   SELECTOR LOADING
   ========================================================= */

.selector-loading {
  min-height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: #64748b;

  font-size: 13px;
}


/* =========================================================
   CONTENT
   ========================================================= */

.attendance-content {
  max-width: 1180px;

  margin: 0 auto;
}


/* =========================================================
   CLASS INFO
   ========================================================= */

.class-info-card {
  display: flex;
  align-items: center;

  gap: 18px;

  padding: 22px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 18px;

  box-shadow:
    0 4px 16px rgba(15, 23, 42, 0.04);
}

.class-icon {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #2563eb;

  background: #eff6ff;

  border-radius: 14px;
}

.class-info {
  min-width: 0;

  flex: 1;
}

.class-label {
  margin: 0 0 4px;

  color: #94a3b8;

  font-size: 12px;
  font-weight: 600;
}

.class-info h2 {
  margin: 0;

  color: #0f172a;

  font-size: 20px;
  font-weight: 800;
}

.class-meta {
  display: flex;
  align-items: center;

  gap: 16px;

  margin-top: 8px;

  color: #64748b;

  font-size: 13px;
}

.class-meta span {
  display: inline-flex;
  align-items: center;

  gap: 6px;
}


/* =========================================================
   SUMMARY
   ========================================================= */

.summary-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 16px;

  margin-top: 18px;
}

.summary-card {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 20px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 16px;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-1px);

  border-color: #cbd5e1;

  box-shadow:
    0 5px 16px rgba(15, 23, 42, 0.04);
}

.summary-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #475569;

  background: #f1f5f9;

  border-radius: 12px;
}

.summary-icon.hadir {
  color: #15803d;
  background: #f0fdf4;
}

.summary-icon.izin {
  color: #b45309;
  background: #fffbeb;
}

.summary-icon.sakit {
  color: #2563eb;
  background: #eff6ff;
}

.summary-icon.alpha {
  color: #dc2626;
  background: #fef2f2;
}

.summary-card p {
  margin: 0 0 5px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}

.summary-card strong {
  display: block;

  color: #0f172a;

  font-size: 18px;
  font-weight: 800;
}


/* =========================================================
   PERCENTAGE
   ========================================================= */

.percentage-card {
  grid-column: span 3;
}

.percentage-circle {
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #15803d;

  background: #f0fdf4;

  border: 3px solid #bbf7d0;

  border-radius: 50%;
}

.percentage-circle strong {
  font-size: 11px;
}


/* =========================================================
   HISTORY
   ========================================================= */

.history-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 14px;
}

.section-header h2 {
  margin: 0;

  color: #0f172a;

  font-size: 20px;
  font-weight: 800;
}

.attendance-count {
  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}


/* =========================================================
   ATTENDANCE LIST
   ========================================================= */

.attendance-list {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.attendance-card {
  display: flex;
  align-items: center;

  gap: 15px;

  padding: 16px 18px;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 14px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.attendance-card:hover {
  transform: translateY(-1px);

  border-color: #cbd5e1;

  box-shadow:
    0 4px 14px rgba(15, 23, 42, 0.04);
}


/* =========================================================
   DATE
   ========================================================= */

.attendance-date {
  width: 48px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  padding: 7px 4px;

  background: #f8fafc;

  border-radius: 10px;
}

.date-day {
  color: #0f172a;

  font-size: 18px;

  font-weight: 800;

  line-height: 1;
}

.date-month {
  margin-top: 4px;

  color: #64748b;

  font-size: 9px;

  font-weight: 700;

  text-transform: uppercase;
}


/* =========================================================
   MAIN
   ========================================================= */

.attendance-main {
  min-width: 0;

  flex: 1;
}

.attendance-top {
  display: flex;
  align-items: center;

  gap: 10px;
}

.attendance-top h3 {
  margin: 0;

  color: #0f172a;

  font-size: 14px;

  font-weight: 700;
}

.attendance-status {
  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 4px 8px;

  border-radius: 999px;

  font-size: 10px;

  font-weight: 750;
}

.status-hadir {
  color: #15803d;
  background: #f0fdf4;
}

.status-izin {
  color: #b45309;
  background: #fffbeb;
}

.status-sakit {
  color: #2563eb;
  background: #eff6ff;
}

.status-alpha {
  color: #dc2626;
  background: #fef2f2;
}

.status-default {
  color: #475569;
  background: #f1f5f9;
}


/* =========================================================
   META
   ========================================================= */

.attendance-meta {
  display: flex;

  gap: 12px;

  margin-top: 6px;

  color: #94a3b8;

  font-size: 11px;
}

.attendance-meta span {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}


/* =========================================================
   LOADING
   ========================================================= */

.loading-state {
  max-width: 1180px;

  min-height: 350px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  color: #64748b;
}

.loading-state p {
  margin: 0;

  font-size: 13px;
}

.loading-spinner {
  margin-bottom: 12px;

  animation: spin 0.8s linear infinite;
}

.loading-icon {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* =========================================================
   ERROR
   ========================================================= */

.error-state {
  max-width: 1180px;

  margin: 30px auto;

  display: flex;
  align-items: flex-start;

  gap: 14px;

  padding: 20px;

  background: #fff7ed;

  border: 1px solid #fed7aa;

  border-radius: 16px;
}

.error-icon {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #c2410c;

  background: #ffedd5;

  border-radius: 10px;
}

.error-state h3 {
  margin: 0 0 5px;

  color: #9a3412;

  font-size: 14px;
}

.error-state p {
  margin: 0;

  color: #c2410c;

  font-size: 13px;

  line-height: 1.5;
}


/* =========================================================
   EMPTY
   ========================================================= */

.empty-state {
  padding: 55px 20px;

  text-align: center;

  background: #ffffff;

  border: 1px solid #e2e8f0;

  border-radius: 18px;
}

.page-empty {
  max-width: 1180px;

  margin: 30px auto;
}

.empty-icon {
  width: 58px;
  height: 58px;

  margin: 0 auto 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #64748b;

  background: #f1f5f9;

  border-radius: 16px;
}

.empty-state h3 {
  margin: 0 0 6px;

  color: #0f172a;

  font-size: 16px;

  font-weight: 750;
}

.empty-state p {
  max-width: 420px;

  margin: 0 auto;

  color: #64748b;

  font-size: 13px;

  line-height: 1.6;
}


/* =========================================================
   BUTTON
   ========================================================= */

.retry-button {
  margin-top: 16px;

  padding: 9px 14px;

  border: 0;

  border-radius: 9px;

  color: #ffffff;

  background: #0f172a;

  font-family: inherit;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.retry-button:hover {
  background: #1e293b;
}

.retry-button:active {
  transform: scale(0.98);
}


/* =========================================================
   PAGINATION
   ========================================================= */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  margin-top: 20px;

  color: #64748b;

  font-size: 12px;
}

.pagination button {
  padding: 8px 12px;

  color: #334155;

  background: #ffffff;

  border: 1px solid #cbd5e1;

  border-radius: 8px;

  font-family: inherit;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  background: #f8fafc;

  border-color: #94a3b8;
}

.pagination button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 900px) {

  .summary-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .percentage-card {
    grid-column: span 2;
  }

}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 640px) {

  .attendance-page {
    padding: 18px;
  }

  .attendance-header h1 {
    font-size: 24px;
  }

  .header-description {
    font-size: 13px;
  }

  .attendance-selector {
    padding: 18px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .percentage-card {
    grid-column: span 1;
  }

  .class-info-card {
    align-items: flex-start;

    padding: 18px;
  }

  .class-icon {
    width: 46px;
    height: 46px;
  }

  .class-info h2 {
    font-size: 18px;
  }

  .attendance-card {
    align-items: flex-start;

    padding: 14px;
  }

  .attendance-top {
    flex-wrap: wrap;
  }

  .attendance-meta {
    flex-direction: column;

    gap: 3px;
  }

  .pagination {
    flex-wrap: wrap;
  }

}


/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 420px) {

  .attendance-page {
    padding: 14px;
  }

  .attendance-selector {
    padding: 15px;
  }

  .selector-header {
    align-items: flex-start;
  }

  .selector-icon {
    width: 40px;
    height: 40px;
  }

  .kelas-select {
    padding: 12px 40px 12px 12px;

    font-size: 13px;
  }

  .summary-card {
    padding: 15px;
  }

  .summary-card strong {
    font-size: 16px;
  }

  .attendance-date {
    width: 43px;
  }

  .date-day {
    font-size: 16px;
  }

  .attendance-top h3 {
    font-size: 13px;
  }

  .attendance-status {
    font-size: 9px;
  }

}
</style>