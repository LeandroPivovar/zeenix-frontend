<template>
  <div class="auth-wrapper">
    <div class="zenix-animated-bg"></div>
    <div class="zenix-texture-layer"></div>
    <div class="zenix-light-primary"></div>
    <div class="zenix-light-secondary"></div>
    <div class="zenix-particles">
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
      <div class="zenix-particle"></div>
    </div>
    <main>
      <component :is="componenteAtivo"></component>
    </main>
  </div>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue';
import RegisterComponent from '../components/RegisterComponent.vue';
import ForgotPasswordComponent from '../components/ForgotPasswordComponent.vue';
import RegisterSuccessComponent from '../components/RegisterSuccessComponent.vue';

export default {
  components: {
    RegisterComponent,
    ForgotPasswordComponent,
    RegisterSuccessComponent,
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
      } else if (path === '/register-success') {
        this.componenteAtivo = 'RegisterSuccessComponent';
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

/* Fundo animado apenas no mobile */
@media (max-width: 640px) {
  .zenix-animated-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(145deg, #0B0B0B 0%, #111111 35%, #0F0F0F 65%, #0B0B0B 100%);
  }

  .zenix-texture-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.11;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 2%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 2%),
      radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.025) 0%, transparent 2%),
      radial-gradient(circle at 60% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 2%),
      radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 2%),
      radial-gradient(circle at 90% 40%, rgba(255, 255, 255, 0.025) 0%, transparent 2%);
    background-size:
      200px 200px,
      180px 180px,
      220px 220px,
      190px 190px,
      210px 210px,
      175px 175px;
    background-position:
      0 0,
      50px 50px,
      100px 100px,
      150px 150px,
      200px 200px,
      250px 250px;
    animation: textureFloat 45s ease-in-out infinite;
    mix-blend-mode: screen;
  }

  .zenix-texture-layer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      repeating-linear-gradient(0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.008) 2px,
        rgba(255, 255, 255, 0.008) 4px),
      repeating-linear-gradient(90deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.008) 2px,
        rgba(255, 255, 255, 0.008) 4px);
    opacity: 0.4;
  }

  .zenix-texture-layer::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.35'/%3E%3C/svg%3E");
    opacity: 0.08;
    mix-blend-mode: overlay;
  }
}

/* Ocultar elementos de fundo no desktop */
@media (min-width: 641px) {
  .zenix-animated-bg,
  .zenix-texture-layer,
  .zenix-light-primary,
  .zenix-light-secondary,
  .zenix-particles {
    display: none;
  }
}

@keyframes textureFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(8px, -8px);
  }
  50% {
    transform: translate(-6px, 6px);
  }
  75% {
    transform: translate(6px, 8px);
  }
}

/* Luzes animadas apenas no mobile */
@media (max-width: 640px) {
  .zenix-light-primary {
    position: fixed;
    width: 800px;
    height: 800px;
    background: radial-gradient(ellipse at center,
      rgba(34, 197, 94, 0.22) 0%,
      rgba(34, 197, 94, 0.18) 20%,
      rgba(34, 197, 94, 0.15) 40%,
      rgba(34, 197, 94, 0.10) 60%,
      rgba(34, 197, 94, 0.05) 80%,
      transparent 100%);
    border-radius: 50%;
    filter: blur(200px);
    pointer-events: none;
    z-index: 2;
    animation: zenixLightMove1 13s ease-in-out infinite;
  }

  .zenix-light-secondary {
    position: fixed;
    width: 650px;
    height: 650px;
    background: radial-gradient(ellipse at center,
      rgba(0, 153, 255, 0.16) 0%,
      rgba(0, 153, 255, 0.13) 25%,
      rgba(0, 153, 255, 0.10) 50%,
      rgba(0, 153, 255, 0.06) 75%,
      transparent 100%);
    border-radius: 50%;
    filter: blur(180px);
    pointer-events: none;
    z-index: 2;
    animation: zenixLightMove2 16s ease-in-out infinite;
  }
}

@keyframes zenixLightMove1 {
  0% {
    top: -20%;
    left: -25%;
    transform: scale(1) rotate(0deg);
  }
  20% {
    top: 12%;
    left: 40%;
    transform: scale(1.18) rotate(72deg);
  }
  40% {
    top: 55%;
    left: 80%;
    transform: scale(0.88) rotate(144deg);
  }
  60% {
    top: 75%;
    left: 10%;
    transform: scale(1.12) rotate(216deg);
  }
  80% {
    top: 30%;
    left: -15%;
    transform: scale(0.94) rotate(288deg);
  }
  100% {
    top: -20%;
    left: -25%;
    transform: scale(1) rotate(360deg);
  }
}

@keyframes zenixLightMove2 {
  0% {
    top: 90%;
    left: 95%;
    transform: scale(1) rotate(0deg);
  }
  20% {
    top: 60%;
    left: 5%;
    transform: scale(0.90) rotate(-72deg);
  }
  40% {
    top: 0%;
    left: 60%;
    transform: scale(1.20) rotate(-144deg);
  }
  60% {
    top: 35%;
    left: 90%;
    transform: scale(1.10) rotate(-216deg);
  }
  80% {
    top: 75%;
    left: 35%;
    transform: scale(0.95) rotate(-288deg);
  }
  100% {
    top: 90%;
    left: 95%;
    transform: scale(1) rotate(-360deg);
  }
}

/* Partículas apenas no mobile */
@media (max-width: 640px) {
  .zenix-particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
  }

  .zenix-particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.20);
    border-radius: 50%;
  }

  .zenix-particle:nth-child(1) {
    width: 2px;
    height: 2px;
    left: 18%;
    top: 12%;
    animation: zenixFloat1 7.5s ease-in-out infinite;
  }

  .zenix-particle:nth-child(2) {
    width: 3px;
    height: 3px;
    left: 82%;
    top: 28%;
    animation: zenixFloat2 8.2s ease-in-out infinite;
  }

  .zenix-particle:nth-child(3) {
    width: 2px;
    height: 2px;
    left: 52%;
    top: 58%;
    animation: zenixFloat3 8.8s ease-in-out infinite;
  }

  .zenix-particle:nth-child(4) {
    width: 3px;
    height: 3px;
    left: 8%;
    top: 72%;
    animation: zenixFloat1 6.4s ease-in-out infinite;
  }

  .zenix-particle:nth-child(5) {
    width: 2px;
    height: 2px;
    left: 92%;
    top: 48%;
    animation: zenixFloat2 9.6s ease-in-out infinite;
  }

  .zenix-particle:nth-child(6) {
    width: 2px;
    height: 2px;
    left: 33%;
    top: 82%;
    animation: zenixFloat3 7.9s ease-in-out infinite;
  }

  .zenix-particle:nth-child(7) {
    width: 3px;
    height: 3px;
    left: 67%;
    top: 22%;
    animation: zenixFloat1 8.3s ease-in-out infinite;
  }

  .zenix-particle:nth-child(8) {
    width: 2px;
    height: 2px;
    left: 12%;
    top: 38%;
    animation: zenixFloat2 9.1s ease-in-out infinite;
  }

  .zenix-particle:nth-child(9) {
    width: 2px;
    height: 2px;
    left: 78%;
    top: 68%;
    animation: zenixFloat3 6.8s ease-in-out infinite;
  }

  .zenix-particle:nth-child(10) {
    width: 3px;
    height: 3px;
    left: 42%;
    top: 18%;
    animation: zenixFloat1 9.8s ease-in-out infinite;
  }

  .zenix-particle:nth-child(11) {
    width: 2px;
    height: 2px;
    left: 25%;
    top: 45%;
    animation: zenixFloat2 7.1s ease-in-out infinite;
  }

  .zenix-particle:nth-child(12) {
    width: 2px;
    height: 2px;
    left: 88%;
    top: 15%;
    animation: zenixFloat3 8.6s ease-in-out infinite;
  }

  .zenix-particle:nth-child(13) {
    width: 3px;
    height: 3px;
    left: 5%;
    top: 55%;
    animation: zenixFloat1 9.4s ease-in-out infinite;
  }

  .zenix-particle:nth-child(14) {
    width: 2px;
    height: 2px;
    left: 58%;
    top: 35%;
    animation: zenixFloat2 6.9s ease-in-out infinite;
  }

  .zenix-particle:nth-child(15) {
    width: 2px;
    height: 2px;
    left: 72%;
    top: 88%;
    animation: zenixFloat3 10.2s ease-in-out infinite;
  }

  .zenix-particle:nth-child(16) {
    width: 3px;
    height: 3px;
    left: 15%;
    top: 25%;
    animation: zenixFloat1 7.7s ease-in-out infinite;
  }

  .zenix-particle:nth-child(17) {
    width: 2px;
    height: 2px;
    left: 95%;
    top: 60%;
    animation: zenixFloat2 8.9s ease-in-out infinite;
  }

  .zenix-particle:nth-child(18) {
    width: 2px;
    height: 2px;
    left: 48%;
    top: 8%;
    animation: zenixFloat3 9.3s ease-in-out infinite;
  }

  .zenix-particle:nth-child(19) {
    width: 3px;
    height: 3px;
    left: 38%;
    top: 92%;
    animation: zenixFloat1 8.5s ease-in-out infinite;
  }

  .zenix-particle:nth-child(20) {
    width: 2px;
    height: 2px;
    left: 62%;
    top: 42%;
    animation: zenixFloat2 7.3s ease-in-out infinite;
  }
}

@keyframes zenixFloat1 {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.15;
  }
  33% {
    transform: translate(24px, -36px);
    opacity: 0.25;
  }
  66% {
    transform: translate(-18px, 30px);
    opacity: 0.20;
  }
}

@keyframes zenixFloat2 {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.18;
  }
  33% {
    transform: translate(-28px, 32px);
    opacity: 0.25;
  }
  66% {
    transform: translate(22px, -26px);
    opacity: 0.20;
  }
}

@keyframes zenixFloat3 {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.16;
  }
  33% {
    transform: translate(20px, 40px);
    opacity: 0.23;
  }
  66% {
    transform: translate(-26px, -32px);
    opacity: 0.25;
  }
}

/* Removido gradiente animado - usando o fundo do HTML fornecido */

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
  z-index: 100;
  background: transparent;
}

@media (max-width: 640px) {
  main {
    background: transparent !important;
    background-color: transparent !important;
    position: relative;
    z-index: 100;
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