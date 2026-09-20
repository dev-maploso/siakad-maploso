<script setup lang="ts">
import { ref } from "vue";
import { AxiosError } from "axios";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";

import LoginBrandPanel from "@/components/auth/LoginBrandPanel.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import LoginFooter from "@/components/auth/LoginFooter.vue";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const error = ref("");

const onSubmit = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Email dan password wajib diisi.";
    return;
  }

  try {
    await auth.login(email.value, password.value);

    router.replace("/dashboard");
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    error.value =
      axiosError.response?.data?.message ??
      "Login gagal. Silakan periksa kembali email dan password Anda.";
  }
};
</script>

<template>
  <div class="login-page">
    <main class="login-layout">
      <LoginBrandPanel />

      <section class="login-section">
        <div class="login-container">
          <LoginForm
            v-model:email="email"
            v-model:password="password"
            :error="error"
            :loading="auth.loading"
            @submit="onSubmit"
          />

          <LoginFooter />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100dvh;

  background: #f8fafc;
  color: #1e293b;

  overflow: hidden;
}

.login-layout {
  width: 100%;
  height: 100dvh;

  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(420px, 0.9fr);
}

/* LEFT */
.brand-panel {
  height: 100dvh;
}

/* RIGHT */
.login-section {
  height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 32px 48px;

  background: #ffffff;

  overflow: hidden;
}

.login-container {
  width: 100%;
  max-width: 430px;
}

/* Laptop */
@media (max-width: 1100px) and (min-width: 901px) {
  .login-layout {
    grid-template-columns: minmax(0, 1fr) minmax(390px, 0.8fr);
  }

  .login-section {
    padding: 28px 36px;
  }

  .login-container {
    max-width: 400px;
  }
}

/* Mobile / tablet */
@media (max-width: 900px) {
  .login-page {
    overflow: auto;
  }

  .login-layout {
    min-height: 100dvh;
    height: auto;

    display: block;
  }

  .login-section {
    min-height: 100dvh;
    height: auto;

    padding: 32px 24px;

    overflow: visible;
  }
}

@media (max-width: 480px) {
  .login-section {
    padding: 24px 20px;
  }
}
</style>