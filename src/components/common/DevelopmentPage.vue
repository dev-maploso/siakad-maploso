<script setup lang="ts">
import { Construction } from "lucide-vue-next";

defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="development-page">
    <div class="development-card">
      <div class="icon-wrapper">
        <Construction :size="32" />
      </div>

      <h1>{{ title }}</h1>

      <p>
        {{ description ?? "Halaman ini masih dalam pengembangan." }}
      </p>

      <span class="badge">
        Segera hadir
      </span>
    </div>
  </div>
</template>

<style scoped>
.development-page {
  min-height: calc(100vh - 140px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 32px 20px;
}

.development-card {
  width: 100%;
  max-width: 520px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  padding: 48px 32px;

  border: 1px solid #e2e8f0;
  border-radius: 20px;

  background: #ffffff;

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.06);
}

.icon-wrapper {
  width: 68px;
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 20px;

  border-radius: 18px;

  background: #eff6ff;
  color: #2563eb;
}

h1 {
  margin: 0;

  color: #0f172a;

  font-size: 22px;
  font-weight: 700;
}

p {
  margin: 10px 0 20px;

  max-width: 400px;

  color: #64748b;

  font-size: 14px;
  line-height: 1.6;
}

.badge {
  display: inline-flex;
  align-items: center;

  padding: 6px 12px;

  border-radius: 999px;

  background: #f1f5f9;
  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 640px) {
  .development-page {
    min-height: calc(100vh - 120px);
    padding: 24px 16px;
  }

  .development-card {
    padding: 40px 24px;
    border-radius: 16px;
  }

  h1 {
    font-size: 20px;
  }
}
</style>