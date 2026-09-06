<template>
  <section class="hero">
    <img
      src="@/assets/images/login-hero.svg"
      alt="SIAKAD"
    />

    <div class="overlay">
      <h2>Sistem Informasi Akademik</h2>

      <p>
        Kelola perkuliahan, presensi, nilai, dan administrasi
        dalam satu platform.
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100%;
  padding: 3rem;

  overflow: hidden;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.hero img {
  width: min(100%, 420px);
  max-height: 45vh;
  object-fit: contain;
}

.overlay {
  margin-top: 2rem;
  text-align: center;
  max-width: 500px;
}

.overlay h2 {
  margin: 0 0 .75rem;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1.2;
}

.overlay p {
  margin: 0;
  opacity: .9;
  line-height: 1.7;
}
</style>