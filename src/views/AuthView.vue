<template>
  <div class="auth-wrapper">
    <canvas ref="particlesCanvas" class="particles-canvas"></canvas>
    <main>
      <component :is="componenteAtivo"></component>
    </main>
  </div>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue';
import RegisterComponent from '../components/RegisterComponent.vue';
import ForgotPasswordComponent from '../components/ForgotPasswordComponent.vue';

const PARTICLE_COUNT = 60;
const COLORS = ['rgba(99,102,241,0.8)', 'rgba(56,189,248,0.8)', 'rgba(34,197,94,0.8)'];

export default {
  components: {
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
  },
  data() {
    return {
      componenteAtivo: 'LoginComponent',
      animationHandle: null,
      particles: [],
      ctx: null,
    };
  },
  mounted() {
    this.atualizarComponente();
    this.initParticles();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.cancelAnimationFrame(this.animationHandle);
    window.removeEventListener('resize', this.handleResize);
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
    initParticles() {
      const canvas = this.$refs.particlesCanvas;
      if (!canvas) return;
      this.ctx = canvas.getContext('2d');
      this.resizeCanvas();
      this.particles = Array.from({ length: PARTICLE_COUNT }).map(() => this.createParticle(canvas));
      this.animate();
    },
    createParticle(canvas) {
      const speed = Math.random() * 0.6 + 0.2;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        velocityX: (Math.random() - 0.5) * speed,
        velocityY: (Math.random() - 0.5) * speed,
      };
    },
    animate() {
      if (!this.ctx) return;
      const canvas = this.$refs.particlesCanvas;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach(particle => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 8,
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.arc(particle.x, particle.y, particle.radius * 8, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.animationHandle = window.requestAnimationFrame(this.animate);
    },
    handleResize() {
      this.resizeCanvas();
    },
    resizeCanvas() {
      const canvas = this.$refs.particlesCanvas;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
  background: radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.08), transparent 45%),
    radial-gradient(circle at 80% 30%, rgba(99, 102, 241, 0.12), transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.08), transparent 40%),
    #060708;
  overflow: hidden;
}

.particles-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: blur(0.4px);
  opacity: 0.65;
}

main {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;
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