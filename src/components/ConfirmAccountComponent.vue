<template>
  <!-- Background animado igual ao forgot-password -->
  <div class="confirm-animated-bg"></div>
  <div class="confirm-texture-layer"></div>
  
  <!-- Main Container -->
  <main id="confirm-main" class="min-h-screen flex items-center justify-center px-8 gradient-glow">
    <div class="w-full max-w-7xl flex items-center justify-center login-container-wrapper">
      
      <!-- Left Column - Confirm Account Card -->
      <div id="confirm-section" class="w-[480px]">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-10 login-card-shadow confirm-card">
          
          <!-- Logo -->
          <div class="mb-8 flex justify-center confirm-logo">
            <div class="flex items-center logo-animation">
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
            <h1 class="text-2xl font-semibold text-zenix-text-dark mb-3 header-title">Confirmar Conta</h1>
            <p class="text-sm text-zenix-gray leading-relaxed header-subtitle">Clique no botão abaixo para confirmar sua conta e começar a usar a plataforma.</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <p class="text-sm text-green-600 font-medium">{{ success }}</p>
          </div>

          <!-- Confirm Button -->
          <button 
            v-if="!success && !error"
            @click="handleConfirmAccount" 
            class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center space-x-2"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner"></span>
            <span>{{ isLoading ? 'Confirmando...' : 'Confirmar Conta' }}</span>
            <i v-if="!isLoading" class="fa-solid fa-check text-sm"></i>
          </button>

          <!-- Links -->
          <div class="mt-4 space-y-4 text-center">
            <a @click.prevent="$router.push('/login')" href="/login" class="block text-sm text-zenix-gray hover:text-zenix-text-dark transition-colors cursor-pointer">Voltar ao login</a>
          </div>

          <!-- Footer -->
          <div class="mt-10 pt-6 border-t border-zenix-input-border footer-login">
            <p class="text-xs text-zenix-gray text-center leading-relaxed footer-text">Ao continuar, você concorda com nossos <a href="#" class="text-zenix-green hover:underline">Termos de uso</a> e <a href="#" class="text-zenix-green hover:underline">Política de Privacidade</a>.</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Hero Content -->
      <div id="hero-section" class="w-[600px] pl-12">
        
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
    
    <!-- Disclaimer desktop - no final da página, precisa rolar para ver -->
    <div class="desktop-disclaimer-page">
      <p class="desktop-disclaimer-text">Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.</p>
    </div>
    
    <!-- Disclaimer apenas no mobile -->
    <div class="mobile-disclaimer">
      <p class="disclaimer-text">Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.</p>
    </div>
  </main>
</template>

<script>
export default {
  name: "ConfirmAccountComponent",
  data() {
    return {
      isLoading: false,
      error: '',
      success: '',
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
    // Verificar se há token na URL e confirmar automaticamente
    const token = this.$route.query.token;
    if (!token) {
      this.error = 'Token inválido. Por favor, verifique o link de confirmação.';
    } else {
      // Confirmar automaticamente ao carregar a página
      this.handleConfirmAccount();
    }
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
    async handleConfirmAccount() {
      if (this.isLoading) return;
      
      const token = this.$route.query.token;
      if (!token) {
        this.error = 'Token inválido. Por favor, verifique o link de confirmação.';
        return;
      }

      this.isLoading = true;
      this.error = '';
      this.success = '';

      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const endpoint = apiBase.includes('/api') ? '/auth/confirm-account' : '/api/auth/confirm-account';
        const res = await fetch(`${apiBase}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Erro ao confirmar conta');
        }
        
        this.success = 'Conta confirmada com sucesso! Você já pode fazer login.';
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (e) {
        this.error = e.message || 'Erro inesperado. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
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

/* Efeito de digitação */
.typing-text {
  min-height: 1.75rem;
}

/* Desktop - manter estilo original do título */
@media (min-width: 641px) {
  .confirm-logo {
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
  
  /* Disclaimer no desktop */
  .desktop-disclaimer-text {
    display: block;
    font-size: 0.625rem;
    line-height: 1.6;
    color: #4e4e4e;
    text-align: center;
    margin-top: 3rem;
    padding: 0 1rem;
  }
}

/* Ocultar disclaimer desktop no mobile */
@media (max-width: 640px) {
  .desktop-disclaimer-text {
    display: none !important;
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

/* Ícone de benefício - sem efeito neon */
.benefit-icon {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.3);
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

/* Background animado - ocultar no desktop */
.confirm-animated-bg,
.confirm-texture-layer {
  display: none;
}

/* Animações para background animado */
@keyframes gradient-animation {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animação textureFloat para o background animado */
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
    transform: translate(4px, 4px);
  }
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
.mb-4 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.mt-1 { margin-top: 0.25rem; }
.mb-6 { margin-bottom: 1.5rem; }
.pt-6 { padding-top: 1.5rem; }
.border-t { border-top-width: 1px; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-8 > * + * { margin-top: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-6xl { font-size: 3.75rem; line-height: 1; }
.text-8xl { font-size: 4.5rem; line-height: 1; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
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

/* Container wrapper responsivo */
.login-container-wrapper {
  flex-wrap: wrap;
  gap: 2rem;
}

/* Responsividade - Monitores médios (1280px - 1440px) */
@media (max-width: 1440px) {
  #confirm-main {
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
  #confirm-main {
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
  
  #confirm-section {
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

/* Responsividade - Tablets (768px - 1024px) */
@media (max-width: 1024px) {
  .login-container-wrapper {
    justify-content: center;
    flex-direction: column;
  }

  #hero-section {
    display: none;
  }

  #confirm-section {
    width: 100% !important;
    max-width: 450px;
  }

  #confirm-main {
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
  #confirm-section {
    width: 100% !important;
    max-width: 100% !important;
  }

  #confirm-main {
    padding-top: 1rem;
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

  .space-y-4 > * + * {
    margin-top: 1.25rem !important;
  }
  
  .py-4 {
    padding-top: 0.875rem !important;
    padding-bottom: 0.875rem !important;
  }
}

/* Responsividade - Mobile pequeno (< 640px) */
@media (max-width: 640px) {
  /* Background animado igual ao forgot-password */
  .confirm-animated-bg {
    display: block !important;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(135deg, #0B0B0B 0%, #0d2520 25%, #0a1a16 50%, #0d2520 75%, #0B0B0B 100%);
    background-size: 400% 400%;
    animation: gradient-animation 15s ease infinite;
  }

  .confirm-texture-layer {
    display: block !important;
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

  .confirm-texture-layer::before {
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

  .confirm-texture-layer::after {
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

  /* Confirm main - garantir que seja transparente para mostrar background animado */
  #confirm-main {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
    padding-top: 1.5rem !important;
    padding-bottom: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    min-height: 100vh !important;
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    position: relative !important;
    z-index: 100 !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;
  }

  /* Remover qualquer pseudo-elemento que possa ter background */
  #confirm-main::before,
  #confirm-main::after {
    display: none !important;
    content: none !important;
    background: none !important;
    background-color: transparent !important;
  }

  /* Garantir que o wrapper e container sejam transparentes */
  .login-container-wrapper {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
  }
  
  #confirm-section {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
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
  
  .mb-1 {
    margin-bottom: 0.375rem !important;
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

  /* Card mais estreito e centralizado para ficar igual ao layout */
  #confirm-section {
    width: 100% !important;
    max-width: 360px !important;
    margin: 0 auto !important;
    padding: 0;
    padding-top: 12rem !important;
  }

  /* Remover fundo do card apenas no mobile */
  #confirm-section .confirm-card {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    background-image: none !important;
  }

  /* Card com background transparente - sobrescrever TODOS os estilos */
  #confirm-section .bg-white,
  #confirm-section .confirm-card.bg-white,
  #confirm-section .confirm-card,
  #confirm-section > div,
  #confirm-section > div > div {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    border-color: transparent !important;
  }

  /* Sobrescrever qualquer estilo que possa estar aplicando background branco */
  #confirm-main * {
    background-image: none !important;
  }
  
  /* Exceto o background animado */
  #confirm-main .confirm-animated-bg,
  .confirm-animated-bg {
    background-image: linear-gradient(135deg, #0B0B0B 0%, #0d2520 25%, #0a1a16 50%, #0d2520 75%, #0B0B0B 100%) !important;
  }
  
  #confirm-section * {
    background-image: none !important;
  }

  #confirm-section .text-zenix-text-dark {
    color: #FFFFFF !important;
  }

  #confirm-section .text-zenix-gray {
    color: #9CA3AF !important;
  }

  /* Ajustes de espaçamento e fonte para corresponder à imagem */
  .header-section {
    margin-bottom: 1.5rem !important;
    margin-top: 0 !important;
    text-align: center !important;
  }

  .header-title {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    margin-bottom: 0.5rem !important;
    margin-top: 0 !important;
    color: #DFDFDF !important;
    text-align: center !important;
  }

  .header-subtitle {
    font-size: 13px !important;
    line-height: 1.5 !important;
    color: #8A8A8A !important;
    text-align: center !important;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    font-weight: 400 !important;
  }

  #confirm-section h1 {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
  }

  /* Logo fora visualmente do card apenas no mobile */
  .confirm-logo {
    position: absolute;
    top: 6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    margin-bottom: 0 !important;
  }

  /* Animação do logo letra por letra (mobile) */
  .confirm-logo .logo-animation {
    overflow: hidden;
  }

  .confirm-logo .logo-text {
    display: inline-block;
  }

  .confirm-logo .logo-text span {
    display: inline-block;
  }

  .zenix-logo-title {
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    font-size: 50px !important;
    text-transform: uppercase;
    letter-spacing: 0;
    line-height: 1;
  }

  .zenix-logo-title .text-zenix-text-dark,
  .confirm-logo .text-zenix-text-dark,
  .confirm-logo .logo-text span.text-zenix-text-dark {
    font-size: 50px !important;
    line-height: 1;
    margin: 0;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .zenix-logo-title .text-zenix-green,
  .confirm-logo .text-zenix-green,
  .confirm-logo .logo-text span.text-zenix-green {
    font-size: 50px !important;
    line-height: 1;
    margin: 0;
    font-weight: 700 !important;
    color: #22C55E !important;
    font-family: 'Inter', sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  /* Remover espaçamento entre letras no mobile */
  .confirm-logo .logo-animation {
    gap: 0 !important;
  }

  .confirm-logo .logo-animation > * {
    margin: 0 !important;
  }

  /* Ajuste de padding interno do card */
  #confirm-section .confirm-card {
    padding: 0 !important;
  }

  /* Mensagens de erro e sucesso */
  #confirm-section .bg-red-50 {
    background-color: rgba(239, 68, 68, 0.1) !important;
    border-color: rgba(239, 68, 68, 0.3) !important;
  }

  #confirm-section .bg-green-50 {
    background-color: rgba(34, 197, 94, 0.1) !important;
    border-color: rgba(34, 197, 94, 0.3) !important;
  }

  #confirm-section .text-red-600 {
    color: #FCA5A5 !important;
  }

  #confirm-section .text-green-600 {
    color: #86EFAC !important;
  }

  #confirm-section .bg-red-50.mb-4,
  #confirm-section .bg-green-50.mb-4 {
    margin-bottom: 1rem !important;
  }

  /* Botão ajustes */
  #confirm-section button.bg-zenix-green {
    padding: 0.875rem 1.5rem !important;
    font-size: 0.875rem !important;
    border-radius: 0.75rem !important;
    font-weight: 600 !important;
    margin-top: 0 !important;
    background-color: #22C55E !important;
    color: #FFFFFF !important;
    height: 52px !important;
  }

  #confirm-section button.bg-zenix-green i {
    color: #FFFFFF !important;
  }

  /* Links */
  #confirm-section a {
    color: #AAAAAA !important;
    font-size: 0.875rem !important;
    font-weight: 400 !important;
  }

  /* Espaçamento após o botão - 15px */
  #confirm-section .mt-4 {
    margin-top: 15px !important;
  }

  /* Footer ajustes */
  .footer-login {
    margin-top: 1.5rem !important;
    padding-top: 1.25rem !important;
    border-top-width: 1px !important;
    border-top-color: rgba(255, 255, 255, 0.1) !important;
  }

  #confirm-section .text-xs {
    font-size: 11px !important;
    line-height: 1.5 !important;
    color: #6B7280 !important;
    font-weight: 400 !important;
  }

  #confirm-section .text-xs a {
    color: #22C55E !important;
    text-decoration: underline !important;
  }

  /* Espaçamento do footer */
  .footer-login {
    padding-top: 2rem !important;
    margin-top: 2rem !important;
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

@media (max-width: 375px) {
  .confirm-logo {
    top: 6rem !important;
  }
}

/* Ocultar disclaimer no desktop */
@media (min-width: 641px) {
  .mobile-disclaimer {
    display: none !important;
  }
  
  /* Disclaimer desktop - removido do card */
  .desktop-disclaimer-text {
    display: none;
  }
  
  /* Disclaimer na página (desktop) - bem abaixo, precisa rolar */
  .desktop-disclaimer-page {
    display: block;
    width: 100%;
    max-width: 1080px;
    margin: 0 auto 4rem;
    padding: 0 2rem;
    flex: 0 0 auto;
    margin-top: 0;
  }
  
  .desktop-disclaimer-page .desktop-disclaimer-text {
    display: block;
    font-size: 0.625rem;
    line-height: 1.6;
    color: #4e4e4e;
    text-align: center;
    padding: 0 1rem;
  }
  
  /* Garantir que a página tenha scroll no desktop e centralizar conteúdo */
  #confirm-main {
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
  }
  
  /* Container wrapper centralizado verticalmente na viewport */
  .login-container-wrapper {
    margin: 0 auto;
    flex: 0 0 auto;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }
}

/* Ocultar disclaimer desktop no mobile */
@media (max-width: 640px) {
  .desktop-disclaimer-page {
    display: none !important;
  }
  
  .desktop-disclaimer-text {
    display: none !important;
  }
}

/* Estilos finais com máxima especificidade para garantir background transparente no mobile */
@media (max-width: 640px) {
  /* Sobrescrever TODOS os backgrounds possíveis no confirm mobile */
  #confirm-main,
  #confirm-main > *,
  #confirm-main > * > *,
  #confirm-section,
  #confirm-section > *,
  #confirm-section > * > *,
  #confirm-section .confirm-card,
  #confirm-section .confirm-card.bg-white,
  #confirm-section .bg-white,
  .login-container-wrapper,
  .login-container-wrapper > * {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
  }
  
  /* Garantir que nenhum pseudo-elemento tenha background */
  #confirm-main::before,
  #confirm-main::after,
  #confirm-section::before,
  #confirm-section::after,
  #confirm-section .confirm-card::before,
  #confirm-section .confirm-card::after {
    display: none !important;
    content: none !important;
    background: none !important;
    background-color: transparent !important;
    background-image: none !important;
  }
}
</style>









