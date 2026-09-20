<template>
  <footer class="login-footer">
    <p>
      © {{ new Date().getFullYear() }} SIAKAD Mahasantri
    </p>

    <span>
      Ma'had Aly Al Falah Ploso
    </span>
  </footer>
</template>

<style scoped>
.login-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  margin-top: 48px;
  padding-top: 20px;

  border-top: 1px solid #e2e8f0;

  color: #94a3b8;

  font-size: 11px;
  line-height: 1.5;
}

.login-footer p {
  margin: 0;
}

.login-footer span {
  text-align: right;
}

@media (max-width: 480px) {
  .login-footer {
    flex-direction: column;
    align-items: flex-start;

    margin-top: 36px;
  }

  .login-footer span {
    text-align: left;
  }
}
</style>