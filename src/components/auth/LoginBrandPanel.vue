<template>
  <section class="brand-panel">
    <img
      src="@/assets/images/login-kampus.webp"
      alt="Lingkungan akademik"
      class="brand-image"
    />

    <div class="brand-overlay"></div>

    <div class="brand-content">
      <div class="brand-logo">
        <span>MA</span>
      </div>

      <div class="brand-main">
        <p class="eyebrow">
          SISTEM INFORMASI AKADEMIK
        </p>

        <h1>
          SIAKAD<br />
          Mahasantri
        </h1>

        <p class="description">
          Akses informasi akademik, perkuliahan,
          kehadiran, pembayaran, dan layanan
          mahasantri dalam satu sistem.
        </p>
      </div>

      <div class="brand-footer">
        <div class="brand-line"></div>

        <p class="institution">
          Ma'had Aly
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brand-panel {
  position: relative;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  background: #064e3b;
  color: white;
}

.brand-image {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.brand-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(6, 78, 59, 0.94) 0%,
      rgba(6, 78, 59, 0.76) 55%,
      rgba(6, 78, 59, 0.48) 100%
    );
}

.brand-content {
  position: relative;
  z-index: 1;

  width: 100%;
  height: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 48px 64px;

  /*
   * Sedikit naik dari posisi center
   * supaya area bawah tidak terasa mepet.
   */
  transform: translateY(-3vh);
}

.brand-logo {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 34px;

  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 9px;

  background: rgba(255, 255, 255, 0.08);

  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.brand-main {
  max-width: 560px;
}

.eyebrow {
  margin: 0 0 12px;

  color: #a7f3d0;

  font-size: 11px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: 0.15em;
}

h1 {
  margin: 0;

  font-size: clamp(42px, 4.5vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  font-weight: 700;
}

.description {
  max-width: 500px;

  margin: 22px 0 0;

  color: rgba(255, 255, 255, 0.82);

  font-size: 15px;
  line-height: 1.65;
}

.brand-footer {
  margin-top: 34px;
}

.brand-line {
  width: 42px;
  height: 2px;

  margin-bottom: 12px;

  background: #a7f3d0;
}

.institution {
  margin: 0;

  color: rgba(255, 255, 255, 0.72);

  font-size: 13px;
}

/*
|--------------------------------------------------------------------------
| Laptop pendek
|--------------------------------------------------------------------------
|
| Contoh: 1366 × 768
|
*/
@media (max-height: 800px) and (min-width: 901px) {
  .brand-content {
    padding: 36px 52px;

    transform: translateY(-2vh);
  }

  .brand-logo {
    width: 44px;
    height: 44px;

    margin-bottom: 26px;
  }

  .eyebrow {
    margin-bottom: 9px;

    font-size: 10px;
  }

  h1 {
    font-size: clamp(38px, 4vw, 54px);
  }

  .description {
    margin-top: 16px;

    font-size: 14px;
    line-height: 1.55;
  }

  .brand-footer {
    margin-top: 26px;
  }
}

/*
|--------------------------------------------------------------------------
| Desktop besar
|--------------------------------------------------------------------------
*/
@media (min-width: 1440px) {
  .brand-content {
    padding-left: 76px;
    padding-right: 76px;
  }
}

/*
|--------------------------------------------------------------------------
| Tablet / Mobile
|--------------------------------------------------------------------------
*/
@media (max-width: 900px) {
  .brand-panel {
    display: none;
  }
}
</style>