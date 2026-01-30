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
      <AdminLoginComponent />
    </main>
  </div>
</template>

<script>
import AdminLoginComponent from '../../components/AdminLoginComponent.vue';

export default {
  name: 'AdminLoginView',
  components: {
    AdminLoginComponent
  }
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

/* Animations moved to animations.css */
@import '../../assets/css/animations.css';

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

  main > * {
    background: transparent !important;
    background-color: transparent !important;
  }
}
</style>


