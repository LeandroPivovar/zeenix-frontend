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
  background: #0B0B0B;
}

/* Animação de gradiente apenas no mobile */
@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: 640px) {
  .auth-wrapper {
    background: #0B0B0B !important;
    background-image: linear-gradient(135deg, #0B0B0B 0%, #0d2520 25%, #0a1a16 50%, #0d2520 75%, #0B0B0B 100%) !important;
    background-size: 400% 400% !important;
    animation: gradient-animation 15s ease infinite !important;
    position: relative !important;
    min-height: 100vh !important;
    height: auto !important;
    z-index: 0 !important;
    width: 100% !important;
    overflow: visible !important;
    overflow-y: visible !important;
    overflow-x: hidden !important;
  }
}

/* Removido os círculos animados para ficar 100% fiel ao design original */

main {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 1;
  background: transparent;
}

@media (max-width: 640px) {
  main {
    background: transparent !important;
    background-color: transparent !important;
    position: relative;
    z-index: 1;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
    height: auto !important;
    min-height: 100vh !important;
  }

  /* Garantir que todos os elementos main dentro sejam transparentes */
  main > * {
    background: transparent !important;
    background-color: transparent !important;
  }
}

/* Estilos removidos para usar 100% do componente LoginComponent */
</style>