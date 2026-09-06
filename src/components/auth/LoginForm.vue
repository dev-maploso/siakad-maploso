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
  <section class="card">
    <h1>Selamat Datang</h1>

    <p>Masuk ke Sistem Informasi Akademik.</p>

    <LoginAlert :message="error" />

    <form @submit.prevent="emit('submit')">
      <LoginInput
        v-model="email"
        label="Email"
        type="email"
        placeholder="email@kampus.ac.id"
      />

      <LoginInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="********"
      />

      <LoginButton :loading="loading" />
    </form>
  </section>
</template>

<style scoped>
.card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}
</style>