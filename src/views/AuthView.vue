<template>
  <div class="auth-wrapper">
    <main>
      <component :is="componenteAtivo"></component>
    </main>
  </div>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue';
import RegisterComponent from '../components/RegisterComponent.vue';
import ForgotPasswordComponent from '../components/ForgotPasswordComponent.vue';

export default {
  components: {
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
  },
  data() {
    return {
      componenteAtivo: 'LoginComponent',
    };
  },
  mounted() {
    this.atualizarComponente();
  },
  beforeUnmount() {
  },
  watch: {
    '$route.path'() {
      this.atualizarComponente();
    },
  },
  methods: {
    atualizarComponente() {
      const path = this.$route.path;

      if (path === '/register') {
        this.componenteAtivo = 'RegisterComponent';
      } else if (path === '/login' || path === '/') {
        this.componenteAtivo = 'LoginComponent';
      } else if (path === '/forgot-password') {
        this.componenteAtivo = 'ForgotPasswordComponent';
      }
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 18%, rgba(32, 198, 134, 0.20) 0%, rgba(8, 12, 10, 0) 35%),
    radial-gradient(circle at 85% 82%, rgba(32, 198, 134, 0.18) 0%, rgba(6, 10, 8, 0) 30%),
    radial-gradient(circle at 50% 50%, rgba(5, 7, 6, 0.98) 0%, rgba(3, 5, 4, 1) 70%),
    linear-gradient(135deg, #030403, #060907);
  overflow: hidden;
}

.auth-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(58, 255, 179, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 82% 85%, rgba(58, 255, 179, 0.06) 0%, transparent 35%);
  pointer-events: none;
  mix-blend-mode: screen;
  filter: blur(1.5px);
}



main {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(48px, 8vw, 96px);
  z-index: 1;
}

@media (max-width: 768px) {
  main {
    padding: 32px 16px;
  }
}

.login-container h1 {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-top: 0;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.login-container h1 strong {
  color: #00ff87;
  text-shadow: 0 0 12px rgba(99, 102, 241, 0.6), 0 0 22px rgba(34, 211, 238, 0.5), 0 0 120px rgba(0, 255, 135, 0.3);
}

h2 {
  font-size: 1.5rem;
  margin: 0.5rem;
  color: rgb(247, 246, 245);
}
</style>