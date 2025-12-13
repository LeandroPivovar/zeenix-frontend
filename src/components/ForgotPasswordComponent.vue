<template>
  <!-- Main Container -->
  <main id="forgot-main" class="min-h-screen flex items-center justify-center px-8">
    <div class="w-full max-w-7xl flex items-center justify-between login-container-wrapper">
      
      <!-- Left Column - Forgot Password Card -->
      <div id="forgot-section" class="w-[480px]">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-10 login-card-shadow forgot-card">
          
          <!-- Logo -->
          <div class="mb-12 flex justify-center forgot-logo">
            <div class="flex items-center space-x-2 logo-animation">
              <div class="text-3xl font-bold text-zenix-text-dark zenix-logo-title">
                <span v-if="isMobile" v-html="typedLogoTitle" class="logo-text"></span>
                <template v-else>
                  <span class="text-zenix-text-dark">ZENI</span><span class="text-zenix-green">X</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Header -->
          <div class="mb-8 header-section">
            <h1 class="text-3xl font-semibold text-zenix-text-dark mb-3 header-title">Acesse sua conta</h1>
            <p class="text-sm text-zenix-gray leading-relaxed forgot-text header-subtitle">Se você já possui uma conta, preencha seus dados para acessar a plataforma.</p>
          </div>

          <!-- Forgot Password Form -->
          <form id="forgot-form" class="space-y-6" @submit.prevent="handleForgotPassword">
            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">E-mail</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4L8 8L14 4M2 4H14V12H2V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  type="email" 
                  v-model="email"
                  placeholder="Digite seu e-mail" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-4 py-4 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                >
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center space-x-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner"></span>
              <span>{{ isLoading ? 'Enviando...' : 'Enviar instruções' }}</span>
              <i v-if="!isLoading" class="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </form>

          <!-- Links -->
          <div class="mt-8 space-y-4 text-center">
            <router-link to="/login" class="block text-sm text-zenix-gray hover:text-zenix-text-dark transition-colors">Voltar ao login</router-link>
          </div>

          <!-- Footer -->
          <div class="mt-10 pt-6 border-t border-zenix-input-border footer-login">
            <p class="text-xs text-zenix-gray text-center leading-relaxed footer-text">Ao continuar, você concorda com nossos <a href="#" class="text-zenix-green hover:underline">Termos de uso</a> e <a href="#" class="text-zenix-green hover:underline">Política de Privacidade</a>.</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Hero Content -->
      <div id="hero-section" class="w-[600px] pl-20">
        
        <!-- Main Title -->
        <div class="mb-8 text-left">
          <h2 class="text-8xl font-bold leading-tight mb-6 text-left" style="font-size: 4.5rem;">
            <span v-html="typedTitle"></span>
          </h2>
          <p class="text-xl text-white leading-relaxed typing-text">
            <span v-html="typedSubtitle"></span>
          </p>
        </div>

        <!-- Benefits List -->
        <div id="benefits-list" class="space-y-8">
          
          <!-- Benefit 1 -->
          <div class="flex items-start space-x-4 benefit-item" :class="{ 'animate-slide-in' : showBenefit1 }">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-brain text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">IA que analisa e decide com precisão</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Nenhum chute. Só cálculo e lógica.</p>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div class="flex items-start space-x-4 benefit-item" :class="{ 'animate-slide-in' : showBenefit2 }">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-copy text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Copy Trading testado e validado</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Você copia estratégias que já funcionam de verdade.</p>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div class="flex items-start space-x-4 benefit-item" :class="{ 'animate-slide-in' : showBenefit3 }">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-robot text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Agente Autônomo que faz tudo por você</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Você ajusta uma vez — ele executa tudo, sem pausa e sem precisar olhar.</p>
            </div>
          </div>
          <div class="flex items-start space-x-4 benefit-item" :class="{ 'animate-slide-in' : showBenefit4 }">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-chart-line text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Operação Manual Guiada por Sinais</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">A plataforma envia o sinal exato e você executa com um clique.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Disclaimer apenas no mobile -->
    <div class="mobile-disclaimer">
      <p class="disclaimer-text">Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.</p>
    </div>
  </main>
</template>

<script>
export default {
  name: "ForgotPasswordComponent",
  data() {
    return {
      email: '',
      isLoading: false,
      fullTitle: 'ZENIX',
      fullSubtitle: 'A única tecnologia criada para operar com a precisão que o mercado exige.',
      typedTitle: '',
      typedSubtitle: '',
      fullLogoTitle: 'ZENIX',
      typedLogoTitle: '',
      isMobile: false,
      logoAnimationStarted: false,
      showBenefit1: false,
      showBenefit2: false,
      showBenefit3: false,
      showBenefit4: false
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 640;
    this.loadFontAwesome();
    this.startAnimations();
  },
  methods: {
    loadFontAwesome() {
      if (!document.getElementById('fa-script')) {
        const script = document.createElement('script');
        script.id = 'fa-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        document.head.appendChild(script);
      }
    },
    startAnimations() {
      // 1. Primeiro o logo ZENIX aparece letra por letra (apenas no mobile)
      if (window.innerWidth <= 640 && !this.logoAnimationStarted) {
        this.logoAnimationStarted = true;
        this.typeLogoTitle();
      }
      // 2. Depois o Zenix do hero aparece letra por letra
      setTimeout(() => {
        this.typeTitle();
      }, 500);
    },
    typeLogoTitle() {
      // Reset do título antes de começar
      this.typedLogoTitle = '';
      let index = 0;
      const typingSpeed = 180; // velocidade de digitação em ms (mais lenta)
      
      const typeChar = () => {
        if (index < this.fullLogoTitle.length) {
          const char = this.fullLogoTitle.charAt(index);
          if (char === 'X') {
            this.typedLogoTitle += '<span class="text-zenix-green">X</span>';
          } else {
            this.typedLogoTitle += `<span class="text-zenix-text-dark">${char}</span>`;
          }
          index++;
          setTimeout(typeChar, typingSpeed);
        }
      };
      
      // Inicia após um pequeno delay
      setTimeout(typeChar, 200);
    },
    typeTitle() {
      let index = 0;
      const typingSpeed = 100; // velocidade de digitação em ms
      
      const typeChar = () => {
        if (index < this.fullTitle.length) {
          const char = this.fullTitle.charAt(index);
          if (char === 'X') {
            this.typedTitle += '<span class="text-zenix-green">X</span>';
          } else {
            this.typedTitle += `<span class="text-white">${char}</span>`;
          }
          index++;
          setTimeout(typeChar, typingSpeed);
        } else {
          // Após terminar o título, inicia o subtítulo
          setTimeout(() => {
            this.typeSubtitle();
          }, 300);
        }
      };
      
      // Inicia após um pequeno delay
      setTimeout(typeChar, 300);
    },
    typeSubtitle() {
      let index = 0;
      const typingSpeed = 30; // velocidade de digitação em ms
      
      const typeChar = () => {
        if (index < this.fullSubtitle.length) {
          this.typedSubtitle += this.fullSubtitle.charAt(index);
          index++;
          setTimeout(typeChar, typingSpeed);
        } else {
          // Após terminar o subtítulo, inicia as qualidades
          this.startBenefitsAnimation();
        }
      };
      
      typeChar();
    },
    startBenefitsAnimation() {
      // 3. Depois cada uma das qualidades em sequência
      setTimeout(() => {
        this.showBenefit1 = true;
      }, 500);
      
      setTimeout(() => {
        this.showBenefit2 = true;
      }, 1200);
      
      setTimeout(() => {
        this.showBenefit3 = true;
      }, 1900);
      
      setTimeout(() => {
        this.showBenefit4 = true;
      }, 2600);
    },
    async handleForgotPassword() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        // Implementar lógica de recuperação de senha
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        // Se VUE_APP_API_BASE_URL já inclui /api, usar /auth/forgot-password, senão usar /api/auth/forgot-password
        const endpoint = apiBase.includes('/api') ? '/auth/forgot-password' : '/api/auth/forgot-password';
        const res = await fetch(`${apiBase}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Erro ao enviar e-mail de recuperação');
        }
        
        this.$root.$toast.success('Instruções de recuperação enviadas para seu e-mail!');
        this.$router.push('/login');
      } catch (e) {
        this.$root.$toast.error(e.message || 'Erro inesperado. Tente novamente.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style>
/* Importa a fonte Inter exatamente como no original */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Estilos globais exatamente como no original */
::-webkit-scrollbar { 
  display: none;
}

* { 
  font-family: 'Inter', sans-serif; 
}

/* Cores Tailwind customizadas - exatamente como no original */
.text-white { color: white !important; }
.text-zenix-text-dark { color: #0B0B0B; }
.text-zenix-green { color: #22C55E !important; }
.text-zenix-green-hover { color: #16A34A; }
.text-zenix-gray { color: #6A6A6A; }
.text-zenix-light-gray { color: #C6C6C6; }

/* Garantir cores específicas para o título hero */
#hero-section .text-white {
  color: white !important;
}

#hero-section .text-zenix-green {
  color: #22C55E !important;
}

.bg-zenix-green { background-color: #22C55E; }
.hover\:bg-zenix-green-hover:hover { background-color: #16A34A; }
.bg-zenix-input-bg { background-color: #F5F5F5; }

/* Garantir que o botão tenha as cores corretas */
button.bg-zenix-green {
  background-color: #22C55E !important;
  color: white !important;
  border: none !important;
}

button.bg-zenix-green:hover:not(:disabled) {
  background-color: #16A34A !important;
}

button.bg-zenix-green:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.border-zenix-input-border { border-color: #E5E5E5; }
.border-zenix-card-border { border-color: #EDEDED; }

.placeholder-zenix-gray::placeholder { color: #6A6A6A; }

.focus\:border-zenix-green:focus { border-color: #22C55E; }

/* Gradient de fundo - exatamente como no original */
.gradient-glow {
  background: #0B0B0B;
}

/* Sombra do card - exatamente como no original */
.login-card-shadow {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 
              0 8px 32px rgba(0, 0, 0, 0.05);
}

/* Ícone de benefício - sem efeito neon */
.benefit-icon {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.3);
}

/* Hover do toggle de senha - exatamente como no original */
.password-toggle:hover {
  color: #22C55E;
}

/* Spinner de loading */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Animação de gradiente para forgot-password no mobile */
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

/* Efeito de digitação */
.typing-text {
  min-height: 1.75rem;
}

/* Animação de opacidade do logo da esquerda para direita (desktop) */
.logo-animation {
  overflow: hidden;
}

.logo-letter {
  opacity: 0;
  animation: fadeInLeft 0.8s ease-out forwards;
}

.logo-letter:nth-child(1) {
  animation-delay: 0.1s;
}

.logo-letter:nth-child(2) {
  animation-delay: 0.3s;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animação dos benefícios da esquerda para direita */
.benefit-item {
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.benefit-item.animate-slide-in {
  opacity: 1;
  transform: translateX(0);
}

/* Classes Tailwind CSS inline - estrutura exata do original */
.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.w-full { width: 100%; }
.max-w-7xl { max-width: 80rem; }
.w-\[480px\] { width: 480px; }
.w-\[600px\] { width: 600px; }
.pl-20 { padding-left: 5rem; }
.bg-white { background-color: white; }
.border { border-width: 1px; }
.rounded-2xl { border-radius: 1rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }
.p-10 { padding: 2.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.pt-6 { padding-top: 1.5rem; }
.border-t { border-top-width: 1px; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-8 > * + * { margin-top: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-6xl { font-size: 3.75rem; line-height: 1; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
.leading-tight { line-height: 1.25; }
.leading-relaxed { line-height: 1.625; }
.block { display: block; }
.relative { position: relative; }
.absolute { position: absolute; }
.right-4 { right: 1rem; }
.top-1\/2 { top: 50%; }
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.-translate-y-1\/2 { --tw-translate-y: -50%; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.pr-12 { padding-right: 3rem; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.hover\:text-zenix-text-dark:hover { color: #0B0B0B; }
.hover\:text-zenix-green-hover:hover { color: #16A34A; }
.hover\:underline:hover { text-decoration: underline; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.w-12 { width: 3rem; }
.h-12 { height: 3rem; }
.flex-shrink-0 { flex-shrink: 0; }
.max-w-md { max-width: 28rem; }

/* Container wrapper responsivo */
.login-container-wrapper {
  flex-wrap: wrap;
  gap: 2rem;
}

/* Responsividade - Monitores médios (1280px - 1440px) */
@media (max-width: 1440px) {
  #forgot-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  #hero-section {
    padding-left: 3rem;
  }
  
  .text-6xl {
    font-size: 3rem !important;
  }
  
  .login-container-wrapper {
    gap: 1.5rem;
  }
}

/* Responsividade - Monitores pequenos (1024px - 1280px) */
@media (max-width: 1280px) {
  #forgot-main {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .login-container-wrapper {
    gap: 1rem;
  }
  
  #hero-section {
    padding-left: 2rem;
    width: 500px !important;
  }
  
  #forgot-section {
    width: 420px !important;
  }
  
  .text-6xl {
    font-size: 2.5rem !important;
  }
  
  .text-lg {
    font-size: 1rem !important;
  }
  
  .p-10 {
    padding: 2.25rem !important;
  }
}

@media (min-width: 1024px) {
  #hero-mobile {
    display: none !important;
  }

  #forgot-main {
    background: #0B0B0B;
  }
}


/* Responsividade - Tablets (768px - 1024px) */
@media (max-width: 1024px) {
  .login-container-wrapper {
    justify-content: center;
    flex-direction: column;
  }
  
  #hero-mobile {
    display: flex !important;;
  }
  
  #forgot-section {
    width: 100% !important;
    max-width: 450px;
  }
  
  #forgot-main {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1.5rem;
    flex-direction: column-reverse;
    padding-bottom: 1.5rem;
  }
  
  .p-10 {
    padding: 2rem !important;
  }
  
  .text-2xl {
    font-size: 1.375rem !important;
  }
  
  .text-sm {
    font-size: 0.8125rem !important;
  }
}

/* Responsividade - Mobile grande (640px - 768px) */
@media (max-width: 768px) {
  #forgot-section {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  #forgot-main {
    padding-bottom: 1rem;
  }
  
  .p-10 {
    padding: 1.75rem !important;
  }
  
  .text-3xl {
    font-size: 1.75rem !important;
  }
  
  .text-2xl {
    font-size: 1.25rem !important;
  }
  
  .mb-8 {
    margin-bottom: 1.5rem !important;
  }
  
  .space-y-6 > * + * {
    margin-top: 1.25rem !important;
  }
  
  .py-4 {
    padding-top: 0.875rem !important;
    padding-bottom: 0.875rem !important;
  }
}

/* Responsividade - Mobile pequeno (< 640px) */
@media (max-width: 640px) {
  #forgot-main {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1.5rem;
    padding-bottom: 0;
    display: flex !important;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
    background: none !important;
    background-color: transparent !important;
    position: relative;
    z-index: 1;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
  }

  /* Aplicar gradiente no elemento pai (body ou wrapper) via pseudo-elemento */
  #forgot-main::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #0B0B0B 0%, #0d2520 25%, #0a1a16 50%, #0d2520 75%, #0B0B0B 100%);
    background-size: 400% 400%;
    animation: gradient-animation 15s ease infinite;
    z-index: -1;
    pointer-events: none;
  }

  /* Garantir que o wrapper e container sejam transparentes */
  .login-container-wrapper {
    background: transparent !important;
    background-color: transparent !important;
  }

  /* Garantir que todos os elementos filhos diretos sejam transparentes */
  #forgot-main > * {
    background: transparent !important;
    background-color: transparent !important;
  }

  /* Garantir que o card seja transparente */
  #forgot-section {
    background: transparent !important;
    background-color: transparent !important;
  }
  
  .w-\[480px\] {
    width: 100% !important;
  }
  
  .p-10 {
    padding: 1.5rem !important;
  }
  
  .text-3xl {
    font-size: 1.5rem !important;
  }
  
  .text-2xl {
    font-size: 1.125rem !important;
  }
  
  .text-lg {
    font-size: 0.9375rem !important;
  }
  
  .text-sm {
    font-size: 0.75rem !important;
  }
  
  .mb-8 {
    margin-bottom: 1.25rem !important;
  }
  
  .mb-4 {
    margin-bottom: 0.75rem !important;
  }
  
  .mb-3 {
    margin-bottom: 0.5rem !important;
  }
  
  .mb-2 {
    margin-bottom: 0.375rem !important;
  }
  
  .space-y-6 > * + * {
    margin-top: 1rem !important;
  }
  
  .space-y-4 > * + * {
    margin-top: 0.75rem !important;
  }
  
  .px-4 {
    padding-left: 0.875rem !important;
    padding-right: 0.875rem !important;
  }
  
  .py-4 {
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
  }
  
  .rounded-xl {
    border-radius: 0.625rem !important;
  }
  
  .rounded-2xl {
    border-radius: 0.875rem !important;
  }

  /* Layout em coluna: hero acima do card no mobile */
  .login-container-wrapper {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 1.5rem;
  }

  #hero-section {
    display: block;
    width: 100% !important;
    max-width: 360px !important;
    padding-left: 0 !important;
    margin: 0 auto;
  }

  /* Card mais estreito e centralizado para ficar igual ao layout */
  #forgot-section {
    width: 100% !important;
    max-width: 360px !important;
    margin: 0 auto !important;
    padding: 0;
    padding-top: 4rem !important;
    background: transparent !important;
  }

  /* Remover fundo do card apenas no mobile */
  #forgot-section .forgot-card {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  /* Ajuste de cores apenas no mobile para ficar igual ao layout */
  #forgot-section .bg-white {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
  }

  /* Garantir que o container wrapper também seja transparente */
  .login-container-wrapper {
    background: transparent !important;
  }

  #forgot-section .bg-zenix-input-bg {
    background-color: #050B0B !important;
    border-color: #111827 !important;
  }

  #forgot-section .border-zenix-input-border {
    border-color: #111827 !important;
  }

  #forgot-section .text-zenix-text-dark {
    color: #F9FAFB !important;
  }

  #forgot-section .text-zenix-gray {
    color: #9CA3AF !important;
  }

  #forgot-section .placeholder-zenix-gray::placeholder {
    color: #6B7280 !important;
  }

  /* Ajustes de espaçamento e fonte para corresponder à imagem */
  .header-section {
    margin-bottom: 2.5rem !important;
    margin-top: 1.5rem !important;
    text-align: center !important;
  }

  .header-title {
    font-size: 1.75rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.75rem !important;
    margin-top: 0 !important;
    color: #FFFFFF !important;
    text-align: center !important;
  }

  .header-subtitle {
    font-size: 0.8125rem !important;
    line-height: 1.5 !important;
    color: #9CA3AF !important;
    text-align: center !important;
    margin-bottom: 0 !important;
  }

  #forgot-section h1 {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
  }

  #hero-section {
    display: none !important;
  }

  /* Ajustes nos inputs */
  #forgot-section input {
    padding: 0.875rem 1rem !important;
    font-size: 0.875rem !important;
    background-color: #1F2937 !important;
    border-color: #374151 !important;
    color: #FFFFFF !important;
  }

  #forgot-section input::placeholder {
    color: #6B7280 !important;
  }

  #forgot-section label {
    font-size: 0.875rem !important;
    margin-bottom: 0.5rem !important;
    color: #FFFFFF !important;
  }

  /* Ícones dos inputs (SVG) */
  .input-icon {
    color: #9CA3AF !important;
    width: 16px !important;
    height: 16px !important;
    z-index: 10;
    pointer-events: none;
  }

  /* Input de email com ícone */
  #forgot-section input[type="email"] {
    padding-left: 2.5rem !important;
  }

  /* Garantir que o texto digitado seja sempre branco */
  #forgot-section input:-webkit-autofill,
  #forgot-section input:-webkit-autofill:hover,
  #forgot-section input:-webkit-autofill:focus {
    -webkit-text-fill-color: #FFFFFF !important;
    -webkit-box-shadow: 0 0 0px 1000px #1F2937 inset !important;
  }

  /* Campo de email */
  #forgot-section input[type="email"] {
    color: #FFFFFF !important;
  }

  #forgot-section input[type="text"],
  #forgot-section input[type="email"],
  #forgot-section input[type="password"] {
    color: #FFFFFF !important;
  }

  /* Botão ajustes */
  #forgot-section button.bg-zenix-green {
    padding: 0.875rem 1.5rem !important;
    font-size: 0.875rem !important;
    border-radius: 0.5rem !important;
    font-weight: 600 !important;
    background-color: #22C55E !important;
    color: #FFFFFF !important;
  }

  #forgot-section button.bg-zenix-green i {
    color: #FFFFFF !important;
  }

  /* Links */
  #forgot-section a {
    color: #9CA3AF !important;
  }

  #forgot-section a.text-zenix-green {
    color: #22C55E !important;
  }

  /* Footer ajustes */
  .footer-login {
    margin-top: 1.5rem !important;
    padding-top: 1.25rem !important;
    border-top-color: rgba(255, 255, 255, 0.1) !important;
  }

  .footer-text {
    font-size: 0.6875rem !important;
    line-height: 1.5 !important;
    color: #9CA3AF !important;
  }

  .footer-text a {
    color: #22C55E !important;
    text-decoration: underline !important;
  }

  .forgot-logo {
    position: absolute;
    top: 6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    margin-bottom: 0 !important;
  }

  /* Animação do logo letra por letra (mobile) */
  .forgot-logo .logo-animation {
    overflow: hidden;
  }

  .forgot-logo .logo-text {
    display: inline-block;
  }

  .forgot-logo .logo-text span {
    display: inline-block;
  }

  /* Estilo do título ZENIX - apenas no mobile */
  .zenix-logo-title {
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    font-size: 50px !important;
    text-transform: uppercase;
    letter-spacing: 0;
    line-height: 1;
  }

  .zenix-logo-title .text-zenix-text-dark,
  .forgot-logo .text-zenix-text-dark,
  .forgot-logo .logo-text span.text-zenix-text-dark {
    font-size: 50px !important;
    line-height: 1;
    margin: 0;
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-family: 'Inter', sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .zenix-logo-title .text-zenix-green,
  .forgot-logo .text-zenix-green,
  .forgot-logo .logo-text span.text-zenix-green {
    font-size: 50px !important;
    line-height: 1;
    margin: 0;
    color: #22C55E !important;
    font-weight: 700 !important;
    font-family: 'Inter', sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  /* Remover espaçamento entre letras no mobile */
  .forgot-logo .logo-animation {
    gap: 0 !important;
  }

  .forgot-logo .logo-animation > * {
    margin: 0 !important;
  }

  /* Espaçamento do card após o logo */
  #forgot-section {
    padding-top: 11rem !important;
  }

  /* Ajuste de padding interno do card */
  #forgot-section .forgot-card {
    padding: 0 !important;
  }

  /* Disclaimer no final da página apenas no mobile */
  .mobile-disclaimer {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: auto auto 1rem;
    padding: 0 1rem;
    padding-bottom: 1.5rem;
    margin-top: 4.5rem;
  }

  .disclaimer-text {
    font-size: 0.625rem;
    line-height: 1.6;
    color: #9CA3AF;
    text-align: center;
  }
}

/* Ocultar disclaimer no desktop */
@media (min-width: 641px) {
  .mobile-disclaimer {
    display: none !important;
  }
  
  /* Desktop - manter estilo original do título */
  .forgot-logo {
    position: relative !important;
    margin-bottom: 3rem !important;
  }
  
  .zenix-logo-title {
    font-size: 1.875rem !important;
  }
  
  .zenix-logo-title .text-zenix-text-dark,
  .zenix-logo-title .text-zenix-green {
    font-size: 1.875rem !important;
  }
}

@media (max-width: 375px){
  .forgot-logo{
    top: 6rem !important;
  }
}
</style>
