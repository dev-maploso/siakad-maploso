<script setup lang="ts">
import LoginInput from "./LoginInput.vue";
import LoginButton from "./LoginButton.vue";
import LoginAlert from "./LoginAlert.vue";

const email = defineModel<string>("email", {
  required: true,
});

const password = defineModel<string>("password", {
  required: true,
});

defineProps<{
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  submit: [];
}>();
</script>

<template>
  <section class="login-form">
    <div class="heading">
      <p class="eyebrow">
        Sistem Informasi Akademik
      </p>

      <h1>Selamat Datang</h1>

      <p class="description">
        Masuk untuk mengakses informasi akademik
        dan layanan mahasantri.
      </p>
    </div>

    <LoginAlert :message="error" />

    <form
      class="form"
      @submit.prevent="emit('submit')"
    >
      <LoginInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="email@kampus.ac.id"
        autocomplete="email"
      />

      <LoginInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Masukkan password"
        autocomplete="current-password"
      />

      <LoginButton :loading="loading" />
    </form>
  </section>
</template>

<style scoped>
.login-form {
  width: 100%;
}

.heading {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 7px;

  color: #047857;

  font-size: 11px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

h1 {
  margin: 0;

  color: #0f172a;

  font-size: 30px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.description {
  max-width: 370px;

  margin: 9px 0 0;

  color: #64748b;

  font-size: 13px;
  line-height: 1.55;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Laptop dengan tinggi layar pendek */
@media (max-height: 800px) and (min-width: 901px) {
  .heading {
    margin-bottom: 18px;
  }

  h1 {
    font-size: 27px;
  }

  .description {
    margin-top: 7px;
  }

  .form {
    gap: 12px;
  }
}

/* Mobile */
@media (max-width: 900px) {
  .heading {
    margin-bottom: 26px;
  }

  h1 {
    font-size: 28px;
  }

  .description {
    font-size: 14px;
  }

  .form {
    gap: 16px;
  }
}
</style>