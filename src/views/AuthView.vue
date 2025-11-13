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
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0a0d0b 0%, #070907 25%, #060806 50%, #040504 100%);
}

.auth-wrapper::before,
.auth-wrapper::after {
  content: '';
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
  will-change: transform, opacity;
}

/* Círculo verde no canto superior esquerdo */
.auth-wrapper::before {
  top: -200px;
  left: -200px;
  width: 900px;
  height: 900px;
  background: radial-gradient(circle, rgba(0, 255, 135, 0.2) 0%, rgba(58, 255, 179, 0.2) 10%, transparent 60%);
  animation: floatTopLeft 12s ease-in-out infinite;
}

/* Círculo verde no canto inferior direito */
.auth-wrapper::after {
  bottom: -200px;
  right: -200px;
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, rgba(0, 255, 135, 0.25) 0%, rgba(51, 255, 156, 0.18) 10%, transparent 80%);
  animation: floatBottomRight 15s ease-in-out infinite;
  animation-delay: -5s;
}

/* Animação do círculo superior esquerdo */
@keyframes floatTopLeft {
  0%, 100% {
    transform: translate(0, 0) scale(1.7);
    opacity: 1;
  }
  25% {
    transform: translate(30px, 20px) scale(1.4);
    opacity: 0.8;
  }
  50% {
    transform: translate(15px, 40px) scale(1.8);
    opacity: 0.9;
  }
  75% {
    transform: translate(40px, 10px) scale(1.6);
    opacity: 0.85;
  }
}

/* Animação do círculo inferior direito */
@keyframes floatBottomRight {
  0%, 100% {
    transform: translate(0, 0) scale(1.7);
    opacity: 1;
  }
  25% {
    transform: translate(30px, 20px) scale(1.4);
    opacity: 0.8;
  }
  50% {
    transform: translate(15px, 40px) scale(1.8);
    opacity: 0.9;
  }
  75% {
    transform: translate(40px, 10px) scale(1.6);
    opacity: 0.85;
  }
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