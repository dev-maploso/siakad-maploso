<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { CreditCard } from "lucide-vue-next";
import { useRegistrasiKelasStore } from "@/stores/registrasi-kelas";

const router = useRouter();
const kelasStore = useRegistrasiKelasStore();

/*
|--------------------------------------------------------------------------
| COMPUTED
|--------------------------------------------------------------------------
*/

const activeKelas = computed(() =>
  kelasStore.items.filter(
    (item) => item.semester?.aktif === true
  )
);

const inactiveKelas = computed(() =>
  kelasStore.items.filter(
    (item) => item.semester?.aktif !== true
  )
);

/*
|--------------------------------------------------------------------------
| LOAD DATA
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  try {
    await kelasStore.fetchKelas({
      page: 1,
      per_page: 15,
    });

    console.log("REGISTRASI KELAS:", kelasStore.items);
    console.log("PAGINATION:", kelasStore.pagination);
  } catch (error) {
    console.error("GAGAL LOAD KELAS:", error);
  }
});

/*
|--------------------------------------------------------------------------
| ACTION
|--------------------------------------------------------------------------
*/

async function reloadKelas() {
  try {
    await kelasStore.fetchKelas({
      page: kelasStore.currentPage,
      per_page: kelasStore.perPage,
    });
  } catch (error) {
    console.error("GAGAL RELOAD KELAS:", error);
  }
}

function openKelas(id: number) {
  router.push(`/classes/${id}`);
}
function openPayment(id: number) {
  router.push(`/classes/${id}/payment`);
}
/*
|--------------------------------------------------------------------------
| FORMAT
|--------------------------------------------------------------------------
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

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getStatusClass(
  status: string | null
): string {
  if (!status) {
    return "status-default";
  }

  const value = status.toLowerCase();

  if (
    value === "aktif" ||
    value === "active"
  ) {
    return "status-active";
  }

  if (
    value === "selesai" ||
    value === "lulus"
  ) {
    return "status-success";
  }

  if (
    value === "nonaktif" ||
    value === "inactive" ||
    value === "dibatalkan"
  ) {
    return "status-danger";
  }

  return "status-default";
}
</script>

<template>
  <div class="kelas-page">

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="page-header">

      <div class="breadcrumb">
        <span class="breadcrumb-main">
          SIAKAD
        </span>

        <span>/</span>

        <span>Kelas</span>
      </div>

      <div class="page-title-wrapper">

        <div>
          <h1>
            Kelas Saya
          </h1>

          <p>
            Daftar kelas yang Anda ikuti dalam perkuliahan.
          </p>
        </div>

      </div>

    </header>


    <!-- =====================================================
         ERROR
    ====================================================== -->

    <div
      v-if="kelasStore.error"
      class="alert-error"
    >
      <div>
        <strong>
          Gagal memuat kelas
        </strong>

        <p>
          {{ kelasStore.error }}
        </p>
      </div>

      <button
        type="button"
        :disabled="kelasStore.loading"
        @click="reloadKelas"
      >
        Coba Lagi
      </button>
    </div>


    <!-- =====================================================
         LOADING
    ====================================================== -->

    <div
      v-if="kelasStore.loading"
      class="kelas-grid"
    >

      <div
        v-for="i in 6"
        :key="i"
        class="kelas-card skeleton-card"
      >

        <div class="skeleton skeleton-icon"></div>

        <div class="skeleton-content">

          <div class="skeleton skeleton-title"></div>

          <div class="skeleton skeleton-text"></div>

          <div class="skeleton skeleton-text small"></div>

        </div>

      </div>

    </div>


    <!-- =====================================================
         EMPTY
    ====================================================== -->

    <div
      v-else-if="
        !kelasStore.error &&
        !kelasStore.hasData
      "
      class="empty-state"
    >

      <div class="empty-icon">
        📚
      </div>

      <h2>
        Belum Ada Kelas
      </h2>

      <p>
        Anda belum memiliki registrasi kelas
        pada sistem akademik.
      </p>

    </div>


    <!-- =====================================================
         DATA
    ====================================================== -->

    <template
      v-else-if="
        !kelasStore.loading &&
        kelasStore.hasData
      "
    >

      <!-- ===================================================
           SUMMARY
      ==================================================== -->

      <div class="summary">

        <div class="summary-icon">
          📚
        </div>

        <div>
          <strong>
            {{ kelasStore.total }} Kelas
          </strong>

          <span>
            terdaftar dalam sistem
          </span>
        </div>

      </div>


      <!-- ===================================================
           SEMESTER AKTIF
      ==================================================== -->

      <section
        v-if="activeKelas.length > 0"
        class="kelas-section"
      >

        <div class="section-header">

          <div class="section-title">

            <span class="active-dot"></span>

            <h2>
              Semester Aktif
            </h2>

            <span class="section-count active-count">
              {{ activeKelas.length }}
            </span>

          </div>

          <span class="section-description">
            Kelas yang sedang Anda jalani
          </span>

        </div>


        <div class="kelas-grid">

  <article
    v-for="item in activeKelas"
    :key="item.id"
    class="kelas-card kelas-card-active"
    @click="openKelas(item.id)"
  >

    <!-- ACTIVE BAR -->
    <div class="active-bar"></div>

    <!-- ICON -->
    <div class="kelas-icon kelas-icon-active">
      📖
    </div>

    <!-- CONTENT -->
    <div class="kelas-content">

      <div class="kelas-top">

        <span class="status status-active">
          <span class="status-dot"></span>
          Semester Aktif
        </span>

      </div>

      <h2 class="kelas-title-active">
        {{
          item.kelas.nama_kelas ||
          "Kelas tidak tersedia"
        }}
      </h2>

      <!-- ACADEMIC INFO -->
      <div class="academic-info">

        <div
          v-if="item.semester"
          class="info-item"
        >
          <span class="info-label">
            Semester
          </span>

          <strong>
            {{ item.semester.nama }}
          </strong>
        </div>

        <div
          v-if="item.tahun_ajaran"
          class="info-item"
        >
          <span class="info-label">
            Tahun Ajaran
          </span>

          <strong>
            {{ item.tahun_ajaran.nama }}
          </strong>
        </div>

      </div>

      <!-- PAYMENT BUTTON -->
      <div class="kelas-payment">

        <button
          type="button"
          class="payment-button"
          @click.stop="openPayment(item.id)"
        >
          <CreditCard :size="16" />
          Pembayaran
        </button>

      </div>

    </div>

  </article>

</div>

      </section>


      <!-- ===================================================
           KELAS SEBELUMNYA
      ==================================================== -->

      <section
        v-if="inactiveKelas.length > 0"
        class="kelas-section kelas-section-history"
      >

        <div class="section-header">

          <div class="section-title">

            <span class="inactive-dot"></span>

            <h2>
              Kelas Sebelumnya
            </h2>

            <span class="section-count">
              {{ inactiveKelas.length }}
            </span>

          </div>

          <span class="section-description">
            Riwayat kelas yang pernah diikuti
          </span>

        </div>


        <div class="kelas-grid">

          <article
            v-for="item in inactiveKelas"
            :key="item.id"
            class="kelas-card"
            @click="openKelas(item.id)"
          >

            <!-- ICON -->

            <div class="kelas-icon">
              📖
            </div>


            <!-- CONTENT -->

            <div class="kelas-content">

              <div class="kelas-top">

               

                <!-- <span
                  class="status"
                  :class="getStatusClass(item.status)"
                >
                  {{
                    item.status_label ||
                    item.status ||
                    "Tidak Aktif"
                  }}
                </span> -->

              </div>


              <h2>
                {{
                  item.kelas.nama_kelas ||
                  "Kelas tidak tersedia"
                }}
              </h2>


              <!-- ACADEMIC INFO -->

              <div class="academic-info">

                <div
                  v-if="item.semester"
                  class="info-item"
                >
                  <span class="info-label">
                    Semester
                  </span>

                  <strong>
                    {{ item.semester.nama }}
                  </strong>
                </div>


                <div
                  v-if="item.tahun_ajaran"
                  class="info-item"
                >
                  <span class="info-label">
                    Tahun Ajaran
                  </span>

                  <strong>
                    {{ item.tahun_ajaran.nama }}
                  </strong>
                </div>

              </div>


              <!-- FOOTER -->

              <!-- <div class="kelas-footer">

                <span>
                  Terdaftar
                  {{ formatTanggal(item.tanggal_registrasi) }}
                </span>

                <span class="arrow">
                  →
                </span>

              </div> -->

            </div>

          </article>

        </div>

      </section>


      <!-- ===================================================
           PAGINATION
      ==================================================== -->

      <div
        v-if="
          kelasStore.pagination &&
          kelasStore.lastPage > 1
        "
        class="pagination"
      >

        <button
          type="button"
          :disabled="
            kelasStore.currentPage <= 1 ||
            kelasStore.loading
          "
          @click="kelasStore.previousPage()"
        >
          ← Sebelumnya
        </button>


        <span>
          Halaman
          <strong>
            {{ kelasStore.currentPage }}
          </strong>
          dari
          <strong>
            {{ kelasStore.lastPage }}
          </strong>
        </span>


        <button
          type="button"
          :disabled="
            kelasStore.currentPage >=
              kelasStore.lastPage ||
            kelasStore.loading
          "
          @click="kelasStore.nextPage()"
        >
          Berikutnya →
        </button>

      </div>

    </template>

  </div>
</template>


<style scoped>

/* ============================================================
   PAGE
============================================================ */

.kelas-page {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;

  padding: 28px;

  box-sizing: border-box;
}


/* ============================================================
   HEADER
============================================================ */

.page-header {
  margin-bottom: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-bottom: 8px;

  font-size: 12px;
  color: #9ca3af;
}

.breadcrumb-main {
  color: #6b7280;
  font-weight: 500;
}

.page-header h1 {
  margin: 0;

  font-size: 28px;
  line-height: 1.25;

  font-weight: 700;

  color: #111827;
}

.page-header p {
  margin: 7px 0 0;

  font-size: 14px;

  color: #6b7280;
}


/* ============================================================
   SUMMARY
============================================================ */

.summary {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 28px;

  padding: 14px 17px;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 12px;
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  flex-shrink: 0;

  border-radius: 10px;

  background: #f3f4f6;

  font-size: 20px;
}

.summary div:last-child {
  display: flex;
  flex-direction: column;

  gap: 2px;
}

.summary strong {
  font-size: 14px;

  color: #111827;
}

.summary span {
  font-size: 12px;

  color: #6b7280;
}


/* ============================================================
   SECTION
============================================================ */

.kelas-section {
  margin-bottom: 32px;
}

.kelas-section-history {
  margin-top: 34px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  margin-bottom: 14px;
}

.section-title {
  display: flex;
  align-items: center;

  gap: 8px;
}

.section-title h2 {
  margin: 0;

  font-size: 15px;
  font-weight: 700;

  color: #111827;
}

.section-description {
  font-size: 12px;

  color: #9ca3af;
}

.section-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 22px;
  height: 22px;

  padding: 0 7px;

  border-radius: 999px;

  background: #f3f4f6;

  font-size: 11px;
  font-weight: 700;

  color: #6b7280;
}

.active-count {
  background: #dcfce7;

  color: #15803d;
}

.active-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 0 3px #dcfce7;
}

.inactive-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #9ca3af;
}


/* ============================================================
   GRID
============================================================ */

.kelas-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(300px, 1fr)
    );

  gap: 16px;
}


/* ============================================================
   CARD
============================================================ */

.kelas-card {
  position: relative;

  display: flex;

  gap: 16px;

  padding: 20px;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

  cursor: pointer;

  overflow: hidden;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.kelas-card:hover {
  transform: translateY(-3px);

  border-color: #d1d5db;

  box-shadow:
    0 10px 25px
    rgba(0, 0, 0, 0.06);
}


/* ============================================================
   ACTIVE CARD
============================================================ */

.kelas-card-active {
  background:
    linear-gradient(
      135deg,
      #f0fdf4 0%,
      #ffffff 65%
    );

  border-color: #bbf7d0;

  box-shadow:
    0 4px 14px
    rgba(34, 197, 94, 0.08);
}

.kelas-card-active:hover {
  border-color: #86efac;

  box-shadow:
    0 12px 28px
    rgba(34, 197, 94, 0.12);
}

.active-bar {
  position: absolute;

  top: 0;
  left: 0;

  width: 4px;
  height: 100%;

  background: #22c55e;
}


/* ============================================================
   ICON
============================================================ */

.kelas-icon {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  border-radius: 12px;

  background: #f3f4f6;

  font-size: 22px;
}

.kelas-icon-active {
  background: #dcfce7;
}


/* ============================================================
   CONTENT
============================================================ */

.kelas-content {
  flex: 1;

  min-width: 0;
}

.kelas-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-bottom: 7px;
}

.kode-kelas {
  font-size: 11px;
  font-weight: 600;

  color: #6b7280;

  text-transform: uppercase;
}

.kode-kelas-active {
  color: #15803d;
}

.kelas-content h2 {
  margin: 0;

  font-size: 17px;
  font-weight: 600;

  line-height: 1.4;

  color: #111827;
}

.kelas-title-active {
  color: #14532d !important;
}


/* ============================================================
   STATUS
============================================================ */

.status {
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;

  gap: 5px;

  padding: 4px 8px;

  border-radius: 6px;

  font-size: 10px;
  font-weight: 700;

  white-space: nowrap;
}

.status-active {
  background: #dcfce7;

  color: #15803d;
}

.status-success {
  background: #eff6ff;

  color: #1d4ed8;
}

.status-danger {
  background: #fef2f2;

  color: #b91c1c;
}

.status-default {
  background: #f3f4f6;

  color: #4b5563;
}

.status-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #22c55e;
}


/* ============================================================
   ACADEMIC INFO
============================================================ */

.academic-info {
  display: flex;
  flex-wrap: wrap;

  gap: 22px;

  margin-top: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.info-label {
  font-size: 10px;

  color: #9ca3af;
}

.info-item strong {
  font-size: 13px;

  color: #374151;
}

.kelas-card-active .info-item strong {
  color: #166534;
}


/* ============================================================
   FOOTER
============================================================ */

.kelas-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  margin-top: 18px;
  padding-top: 14px;

  border-top: 1px solid #f3f4f6;

  font-size: 11px;

  color: #9ca3af;
}

.kelas-footer-active {
  border-color: #dcfce7;

  color: #65a30d;
}

.arrow {
  font-size: 17px;

  color: #9ca3af;

  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.kelas-card:hover .arrow {
  transform: translateX(4px);

  color: #374151;
}

.arrow-active {
  color: #16a34a;
}

.kelas-card-active:hover .arrow-active {
  color: #15803d;
}


/* ============================================================
   EMPTY
============================================================ */

.empty-state {
  display: flex;
  align-items: center;

  flex-direction: column;

  padding: 70px 20px;

  text-align: center;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 14px;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 64px;
  height: 64px;

  margin-bottom: 16px;

  background: #f3f4f6;

  border-radius: 16px;

  font-size: 30px;
}

.empty-state h2 {
  margin: 0;

  font-size: 18px;

  color: #111827;
}

.empty-state p {
  max-width: 400px;

  margin: 8px 0 0;

  font-size: 13px;
  line-height: 1.5;

  color: #6b7280;
}


/* ============================================================
   ERROR
============================================================ */

.alert-error {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-bottom: 20px;

  padding: 16px 18px;

  background: #fef2f2;

  border: 1px solid #fecaca;

  border-radius: 12px;
}

.alert-error strong {
  font-size: 14px;

  color: #991b1b;
}

.alert-error p {
  margin: 4px 0 0;

  font-size: 13px;

  color: #b91c1c;
}

.alert-error button {
  flex-shrink: 0;

  padding: 8px 13px;

  border: 1px solid #fca5a5;

  border-radius: 7px;

  background: #ffffff;

  font-size: 12px;
  font-weight: 500;

  color: #991b1b;

  cursor: pointer;
}

.alert-error button:hover:not(:disabled) {
  background: #fff7f7;
}

.alert-error button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* ============================================================
   PAGINATION
============================================================ */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 15px;

  margin-top: 28px;
}

.pagination button {
  padding: 9px 13px;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 8px;

  font-size: 12px;

  color: #374151;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.pagination button:hover:not(:disabled) {
  background: #f9fafb;

  border-color: #d1d5db;
}

.pagination button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}

.pagination span {
  font-size: 12px;

  color: #6b7280;
}

.pagination strong {
  color: #111827;
}


/* ============================================================
   SKELETON
============================================================ */

.skeleton-card {
  cursor: default;
}

.skeleton-card:hover {
  transform: none;

  box-shadow: none;
}

.skeleton {
  background: #f3f4f6;

  border-radius: 6px;

  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-icon {
  width: 48px;
  height: 48px;

  flex-shrink: 0;

  border-radius: 12px;
}

.skeleton-content {
  flex: 1;
}

.skeleton-title {
  width: 70%;
  height: 18px;

  margin-bottom: 12px;
}

.skeleton-text {
  width: 90%;
  height: 12px;

  margin-bottom: 8px;
}

.skeleton-text.small {
  width: 55%;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 640px) {

  .kelas-page {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .kelas-grid {
    grid-template-columns: 1fr;
  }

  .kelas-card {
    padding: 16px;
  }

  .kelas-top {
    align-items: flex-start;
  }

  .academic-info {
    gap: 14px;
  }

  .section-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 5px;
  }

  .section-description {
    margin-left: 16px;
  }

  .pagination {
    gap: 8px;
  }

  .pagination button {
    padding: 8px 10px;
  }

  .pagination span {
    font-size: 11px;
  }

  .alert-error {
    align-items: flex-start;

    flex-direction: column;
  }

  .alert-error button {
    width: 100%;
  }
}
/* ============================================================
   PAYMENT
============================================================ */

.kelas-payment {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid #dcfce7;
}

.payment-button {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  padding: 9px 12px;

  border: 1px solid #bbf7d0;
  border-radius: 8px;

  background: #f0fdf4;
  color: #166534;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
}

.payment-button:hover {
  background: #dcfce7;
  border-color: #86efac;
}

.payment-button:active {
  transform: scale(0.98);
}
</style>