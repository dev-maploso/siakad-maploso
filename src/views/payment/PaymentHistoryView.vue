<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
} from "vue";

import {
  useRoute,
  useRouter,
} from "vue-router";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Wallet,
  AlertCircle,
  ReceiptText,
  ChevronDown,
} from "lucide-vue-next";

import { usePaymentHistoryStore } from "@/stores/payment-history";
import { useRegistrasiKelasStore } from "@/stores/registrasi-kelas";

const route = useRoute();
const router = useRouter();

const paymentStore = usePaymentHistoryStore();
const kelasStore = useRegistrasiKelasStore();

/**
 * =========================================================
 * STATE
 * =========================================================
 */

const selectedRegistrasiKelasId = ref<number | null>(null);

/**
 * Apakah halaman dibuka dari:
 *
 * /classes/:id/payment
 *
 * atau:
 *
 * /finance/payments
 */
const isDirectPaymentPage = computed(() => {
  return !!route.params.id;
});

/**
 * ID registrasi kelas dari URL.
 */
const registrasiKelasId = computed(() => {
  if (!route.params.id) {
    return null;
  }

  const id = Number(route.params.id);

  return Number.isFinite(id) && id > 0
    ? id
    : null;
});

/**
 * =========================================================
 * PAYMENT DATA
 * =========================================================
 */

const registration = computed(() => {
  return paymentStore.registration;
});

const summary = computed(() => {
  return paymentStore.summary;
});

const transactions = computed(() => {
  return paymentStore.transactions;
});

/**
 * =========================================================
 * KELAS
 * =========================================================
 */

const kelasItems = computed(() => {
  return kelasStore.items;
});

/**
 * Kelas yang dipilih dari dropdown.
 */
const selectedKelas = computed(() => {
  if (!selectedRegistrasiKelasId.value) {
    return null;
  }

  return (
    kelasItems.value.find(
      (item) =>
        item.id === selectedRegistrasiKelasId.value
    ) ?? null
  );
});

/**
 * =========================================================
 * FORMAT
 * =========================================================
 */

const formatRupiah = (
  value: number | null | undefined
) => {
  if (value === null || value === undefined) {
    return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatTanggal = (
  tanggal: string | null
) => {
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
};

/**
 * =========================================================
 * STATUS
 * =========================================================
 */

const getStatusClass = (
  status: string
) => {
  switch (status.toLowerCase()) {
    case "lunas":
      return "status-lunas";

    case "belum":
    case "belum lunas":
      return "status-belum";

    default:
      return "status-default";
  }
};

const getStatusLabel = (
  status: string
) => {
  switch (status.toLowerCase()) {
    case "lunas":
      return "Lunas";

    case "belum":
      return "Belum Lunas";

    default:
      return status;
  }
};

/**
 * =========================================================
 * NAVIGATION
 * =========================================================
 */

const goBack = () => {
  router.push("/classes");
};

/**
 * =========================================================
 * PAYMENT
 * =========================================================
 */

async function loadPayment(
  registrasiKelasId: number
) {
  try {
    await paymentStore.fetchPaymentHistory(
      registrasiKelasId
    );
  } catch {
    // Error sudah ditangani oleh store.
  }
}

/**
 * Ketika dropdown berubah.
 */
async function handleKelasChange() {
  paymentStore.clear();

  if (!selectedRegistrasiKelasId.value) {
    return;
  }

  await loadPayment(
    selectedRegistrasiKelasId.value
  );
}

/**
 * =========================================================
 * RETRY
 * =========================================================
 */

const retry = async () => {
  const id =
    registrasiKelasId.value ??
    selectedRegistrasiKelasId.value;

  if (!id) {
    return;
  }

  await loadPayment(id);
};

/**
 * =========================================================
 * LOAD KELAS UNTUK DROPDOWN
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
      "GAGAL LOAD KELAS PEMBAYARAN:",
      error
    );
  }
}

/**
 * =========================================================
 * INITIAL LOAD
 * =========================================================
 */

onMounted(async () => {

  /**
   * ===============================================
   * MODE 1:
   * /classes/:id/payment
   *
   * Langsung tampilkan pembayaran.
   * ===============================================
   */
  if (isDirectPaymentPage.value) {

    if (!registrasiKelasId.value) {
      paymentStore.error =
        "ID registrasi kelas tidak valid.";

      return;
    }

    selectedRegistrasiKelasId.value =
      registrasiKelasId.value;

    await loadPayment(
      registrasiKelasId.value
    );

    return;
  }

  /**
   * ===============================================
   * MODE 2:
   * /finance/payments
   *
   * Tampilkan dropdown kelas.
   * Jangan load pembayaran sebelum dipilih.
   * ===============================================
   */

  await loadKelas();
});

/**
 * Jika URL berubah dari /classes/:id/payment
 * ke route lain dengan component yang sama.
 */
watch(
  () => route.params.id,
  async (id) => {

    if (!id) {
      paymentStore.clear();

      selectedRegistrasiKelasId.value = null;

      if (!kelasStore.items.length) {
        await loadKelas();
      }

      return;
    }

    const parsedId = Number(id);

    if (
      !Number.isFinite(parsedId) ||
      parsedId <= 0
    ) {
      paymentStore.error =
        "ID registrasi kelas tidak valid.";

      return;
    }

    selectedRegistrasiKelasId.value =
      parsedId;

    await loadPayment(parsedId);
  }
);
</script>

<template>
  <div class="payment-page">

    <!-- =====================================================
         HEADER
         ===================================================== -->

    <header class="payment-header">

      <button
        v-if="isDirectPaymentPage"
        type="button"
        class="back-button"
        @click="goBack"
      >
        <ArrowLeft :size="18" />
        <span>Kembali ke Kelas</span>
      </button>

      <div class="header-content">
        <div>
          <p class="eyebrow">
            KEUANGAN
          </p>

          <h1>
            Riwayat Pembayaran
          </h1>

          <p class="header-description">
            Informasi kewajiban dan riwayat pembayaran
            kelas kamu.
          </p>
        </div>
      </div>

    </header>


    <!-- =====================================================
         MODE /finance/payments
         PILIH KELAS
         ===================================================== -->

    <section
      v-if="!isDirectPaymentPage"
      class="payment-selector"
    >

      <div class="selector-header">
        <div class="selector-icon">
          <CreditCard :size="21" />
        </div>

        <div>
          <h2>
            Pilih Kelas
          </h2>

          <p>
            Pilih kelas dan semester untuk melihat
            riwayat pembayaran.
          </p>
        </div>
      </div>


      <!-- LOADING KELAS -->

      <div
        v-if="kelasStore.loading"
        class="selector-loading"
      >
        <div class="loading-spinner"></div>

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
         LOADING PAYMENT
         ===================================================== -->

    <div
      v-if="paymentStore.loading"
      class="loading-state"
    >

      <div class="loading-spinner"></div>

      <p>
        Memuat riwayat pembayaran...
      </p>

    </div>


    <!-- =====================================================
         ERROR
         ===================================================== -->

    <div
      v-else-if="paymentStore.error"
      class="error-state"
    >

      <div class="error-icon">
        <AlertCircle :size="28" />
      </div>

      <div>

        <h3>
          Gagal memuat pembayaran
        </h3>

        <p>
          {{ paymentStore.error }}
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
         PAYMENT DETAIL
         ===================================================== -->

    <main
      v-else-if="paymentStore.hasData"
      class="payment-content"
    >

      <!-- REGISTRATION INFO -->

      <section class="class-info-card">

        <div class="class-icon">
          <CreditCard :size="24" />
        </div>

        <div class="class-info">

          <p class="class-label">
            Pembayaran Kelas
          </p>

          <h2>
            {{ registration?.kelas || "Kelas" }}
          </h2>

          <div class="class-meta">

            <span>
              <CalendarDays :size="15" />

              {{ registration?.tahun_ajaran || "-" }}
            </span>

            <span>
              <Clock3 :size="15" />

              {{ registration?.semester || "-" }}
            </span>

          </div>

        </div>

        <div
          v-if="summary"
          class="main-status"
          :class="getStatusClass(summary.status)"
        >

          <CheckCircle2
            v-if="summary.status === 'lunas'"
            :size="17"
          />

          <AlertCircle
            v-else
            :size="17"
          />

          {{ getStatusLabel(summary.status) }}

        </div>

      </section>


      <!-- =================================================
           SUMMARY
           ================================================= -->

      <section class="summary-grid">

        <!-- KEWAJIBAN -->

        <div class="summary-card">

          <div class="summary-icon">
            <Wallet :size="20" />
          </div>

          <div>

            <p>
              Total Kewajiban
            </p>

            <strong>
              {{
                formatRupiah(
                  summary?.total_kewajiban
                )
              }}
            </strong>

          </div>

        </div>


        <!-- SUDAH BAYAR -->

        <div class="summary-card">

          <div class="summary-icon">
            <CheckCircle2 :size="20" />
          </div>

          <div>

            <p>
              Sudah Dibayar
            </p>

            <strong>
              {{
                formatRupiah(
                  summary?.total_sudah_bayar
                )
              }}
            </strong>

          </div>

        </div>


        <!-- KEKURANGAN -->

        <div class="summary-card">

          <div class="summary-icon">
            <AlertCircle :size="20" />
          </div>

          <div>

            <p>
              Kekurangan
            </p>

            <strong>
              {{
                formatRupiah(
                  summary?.total_kekurangan
                )
              }}
            </strong>

          </div>

        </div>

      </section>


      <!-- =================================================
           TRANSACTIONS
           ================================================= -->

      <section class="history-section">

        <div class="section-header">

          <div>

            <p class="eyebrow">
              TRANSAKSI
            </p>

            <h2>
              Riwayat Pembayaran
            </h2>

          </div>

          <span class="transaction-count">
            {{ transactions.length }} transaksi
          </span>

        </div>


        <!-- EMPTY -->

        <div
          v-if="!paymentStore.hasTransactions"
          class="empty-state"
        >

          <div class="empty-icon">
            <ReceiptText :size="28" />
          </div>

          <h3>
            Belum ada pembayaran
          </h3>

          <p>
            Belum terdapat transaksi pembayaran
            untuk kelas ini.
          </p>

        </div>


        <!-- TRANSACTION LIST -->

        <div
          v-else
          class="transaction-list"
        >

          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="transaction-card"
          >

            <div class="transaction-icon">
              <ReceiptText :size="20" />
            </div>

            <div class="transaction-main">

              <div class="transaction-top">

                <h3>
                  {{
                    transaction.jenis_pembayaran ||
                    "Pembayaran"
                  }}
                </h3>

                <span
                  class="transaction-status"
                  :class="
                    getStatusClass(
                      transaction.status
                    )
                  "
                >
                  {{
                    getStatusLabel(
                      transaction.status
                    )
                  }}
                </span>

              </div>

              <div class="transaction-meta">

                <span>
                  {{
                    formatTanggal(
                      transaction.tanggal
                    )
                  }}
                </span>

                <span
                  v-if="transaction.keterangan"
                >
                  {{ transaction.keterangan }}
                </span>

              </div>

            </div>

            <div class="transaction-amount">

              {{
                formatRupiah(
                  transaction.nominal
                )
              }}

            </div>

          </div>

        </div>

      </section>

    </main>


    <!-- =====================================================
         BELUM PILIH KELAS
         ===================================================== -->

    <div
      v-else-if="
        !isDirectPaymentPage &&
        !selectedRegistrasiKelasId &&
        !paymentStore.loading
      "
      class="empty-state page-empty"
    >

      <div class="empty-icon">
        <CreditCard :size="28" />
      </div>

      <h3>
        Pilih kelas terlebih dahulu
      </h3>

      <p>
        Pilih kelas dan semester pada dropdown
        di atas untuk melihat riwayat pembayaran.
      </p>

    </div>


    <!-- =====================================================
         DATA TIDAK DITEMUKAN
         ===================================================== -->

    <div
      v-else-if="
        isDirectPaymentPage &&
        !paymentStore.loading &&
        !paymentStore.error &&
        !paymentStore.hasData
      "
      class="empty-state page-empty"
    >

      <div class="empty-icon">
        <CreditCard :size="28" />
      </div>

      <h3>
        Data pembayaran tidak ditemukan
      </h3>

      <p>
        Belum ada informasi pembayaran
        untuk registrasi kelas ini.
      </p>

      <button
        type="button"
        class="retry-button"
        @click="goBack"
      >
        Kembali ke Kelas
      </button>

    </div>

  </div>
</template>
<style scoped>
/* =========================================================
   PAGE
   ========================================================= */

.payment-page {
  min-height: 100%;
  padding: 28px;
  background: #f8fafc;
}


/* =========================================================
   HEADER
   ========================================================= */

.payment-header {
  max-width: 1180px;
  margin: 0 auto 28px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: 0;
  background: transparent;

  color: #64748b;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  padding: 0;
  margin-bottom: 22px;

  transition: color 0.2s ease;
}

.back-button:hover {
  color: #0f172a;
}

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.payment-header h1 {
  margin: 0;

  color: #0f172a;

  font-size: 30px;
  font-weight: 800;

  letter-spacing: -0.03em;
}

.header-description {
  margin: 8px 0 0;

  color: #64748b;

  font-size: 14px;
}

.eyebrow {
  margin: 0 0 7px;

  color: #64748b;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.12em;
}


/* =========================================================
   PAYMENT SELECTOR
   ========================================================= */

.payment-selector {
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
   SELECT DROPDOWN
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

.payment-content {
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
  font-weight: 750;

  line-height: 1.3;
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
   MAIN STATUS
   ========================================================= */

.main-status {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 750;

  white-space: nowrap;
}

.status-lunas {
  color: #15803d;

  background: #f0fdf4;
}

.status-belum {
  color: #b45309;

  background: #fffbeb;
}

.status-default {
  color: #475569;

  background: #f1f5f9;
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

  line-height: 1.2;
}


/* =========================================================
   HISTORY SECTION
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

.transaction-count {
  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}


/* =========================================================
   TRANSACTION LIST
   ========================================================= */

.transaction-list {
  display: flex;
  flex-direction: column;

  gap: 10px;
}

.transaction-card {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 17px 18px;

  background: #ffffff;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.transaction-card:hover {
  transform: translateY(-1px);

  border-color: #cbd5e1;

  box-shadow:
    0 4px 14px rgba(15, 23, 42, 0.04);
}

.transaction-icon {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #64748b;

  background: #f8fafc;

  border-radius: 11px;
}

.transaction-main {
  min-width: 0;

  flex: 1;
}

.transaction-top {
  display: flex;
  align-items: center;

  gap: 10px;
}

.transaction-top h3 {
  min-width: 0;

  margin: 0;

  color: #0f172a;

  font-size: 14px;
  font-weight: 700;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-status {
  display: inline-flex;
  align-items: center;

  flex-shrink: 0;

  padding: 4px 8px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 750;
}

.transaction-meta {
  display: flex;

  gap: 12px;

  margin-top: 5px;

  color: #94a3b8;

  font-size: 11px;
}

.transaction-meta span {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.transaction-amount {
  flex-shrink: 0;

  color: #0f172a;

  font-size: 15px;
  font-weight: 800;

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
  width: 32px;
  height: 32px;

  margin-bottom: 14px;

  border: 3px solid #e2e8f0;

  border-top-color: #64748b;

  border-radius: 50%;

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
   MOBILE / TABLET
   ========================================================= */

@media (max-width: 900px) {

  .summary-grid {
    grid-template-columns: 1fr;
  }

}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 768px) {

  .payment-page {
    padding: 18px;
  }

  .payment-header {
    margin-bottom: 20px;
  }

  .payment-header h1 {
    font-size: 24px;
  }

  .header-description {
    font-size: 13px;
  }

  .payment-selector {
    padding: 18px;
  }

  .class-info-card {
    align-items: flex-start;

    flex-wrap: wrap;

    padding: 18px;
  }

  .class-info {
    flex: 1;

    min-width: 200px;
  }

  .main-status {
    margin-left: 70px;
  }

  .summary-card {
    padding: 17px;
  }

  .history-section {
    margin-top: 26px;
  }

  .transaction-card {
    align-items: flex-start;
  }

  .transaction-amount {
    margin-left: auto;
  }

}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 520px) {

  .payment-page {
    padding: 14px;
  }

  .payment-header {
    margin-bottom: 18px;
  }

  .payment-header h1 {
    font-size: 21px;
  }

  .header-description {
    margin-top: 6px;

    font-size: 12px;

    line-height: 1.5;
  }

  .back-button {
    margin-bottom: 17px;

    font-size: 13px;
  }


  /* SELECTOR */

  .payment-selector {
    padding: 16px;

    border-radius: 14px;
  }

  .selector-header {
    align-items: flex-start;

    margin-bottom: 14px;
  }

  .selector-icon {
    width: 40px;
    height: 40px;
  }

  .selector-header h2 {
    font-size: 15px;
  }

  .selector-header p {
    font-size: 11px;

    line-height: 1.5;
  }

  .kelas-select {
    padding: 12px 40px 12px 12px;

    font-size: 13px;
  }


  /* CLASS INFO */

  .class-info-card {
    gap: 12px;

    padding: 16px;

    border-radius: 14px;
  }

  .class-icon {
    width: 44px;
    height: 44px;

    border-radius: 11px;
  }

  .class-info {
    min-width: calc(100% - 58px);
  }

  .class-label {
    font-size: 11px;
  }

  .class-info h2 {
    font-size: 17px;
  }

  .class-meta {
    flex-direction: column;

    align-items: flex-start;

    gap: 5px;

    margin-top: 7px;

    font-size: 12px;
  }

  .main-status {
    width: auto;

    margin-left: 0;

    padding: 7px 10px;

    font-size: 11px;
  }


  /* SUMMARY */

  .summary-grid {
    gap: 10px;

    margin-top: 12px;
  }

  .summary-card {
    gap: 11px;

    padding: 15px;

    border-radius: 13px;
  }

  .summary-icon {
    width: 38px;
    height: 38px;

    border-radius: 10px;
  }

  .summary-card p {
    font-size: 11px;
  }

  .summary-card strong {
    font-size: 16px;
  }


  /* HISTORY */

  .history-section {
    margin-top: 24px;
  }

  .section-header {
    align-items: flex-start;

    gap: 10px;
  }

  .section-header h2 {
    font-size: 18px;
  }

  .transaction-count {
    padding-top: 3px;

    font-size: 11px;
  }


  /* TRANSACTION */

  .transaction-list {
    gap: 8px;
  }

  .transaction-card {
    flex-wrap: wrap;

    gap: 11px;

    padding: 14px;

    border-radius: 12px;
  }

  .transaction-icon {
    width: 38px;
    height: 38px;

    border-radius: 9px;
  }

  .transaction-main {
    width: calc(100% - 50px);
  }

  .transaction-top {
    align-items: flex-start;

    flex-wrap: wrap;

    gap: 5px 8px;
  }

  .transaction-top h3 {
    width: 100%;

    font-size: 13px;

    white-space: normal;
  }

  .transaction-status {
    font-size: 9px;
  }

  .transaction-meta {
    flex-direction: column;

    gap: 3px;

    margin-top: 5px;

    font-size: 10px;
  }

  .transaction-amount {
    width: 100%;

    margin-left: 49px;

    padding-top: 2px;

    font-size: 14px;
  }


  /* EMPTY */

  .empty-state {
    padding: 40px 16px;

    border-radius: 14px;
  }

  .page-empty {
    margin-top: 20px;
  }

  .empty-icon {
    width: 52px;
    height: 52px;

    border-radius: 14px;
  }

  .empty-state h3 {
    font-size: 15px;
  }

  .empty-state p {
    font-size: 12px;
  }


  /* ERROR */

  .error-state {
    margin: 20px auto;

    padding: 15px;

    border-radius: 13px;
  }

  .error-state h3 {
    font-size: 13px;
  }

  .error-state p {
    font-size: 12px;
  }

}


/* =========================================================
   VERY SMALL SCREEN
   ========================================================= */

@media (max-width: 360px) {

  .payment-page {
    padding: 11px;
  }

  .payment-selector {
    padding: 14px;
  }

  .selector-header {
    gap: 9px;
  }

  .selector-icon {
    width: 36px;
    height: 36px;
  }

  .class-info-card {
    padding: 14px;
  }

  .summary-card {
    padding: 13px;
  }

  .summary-card strong {
    font-size: 15px;
  }

  .transaction-card {
    padding: 12px;
  }

}
</style>