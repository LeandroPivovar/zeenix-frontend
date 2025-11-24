<template>
  <!-- Main Container -->
  <main id="forgot-main" class="min-h-screen flex items-center justify-center px-8 forgot-password-bg">
    <div class="w-full max-w-7xl flex items-center justify-between login-container-wrapper">
      
      <!-- Left Column - Forgot Password Card -->
      <div id="forgot-section" class="w-[480px]">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-10 login-card-shadow">
          
          <!-- Logo -->
          <div class="mb-8 flex justify-center">
            <div class="flex items-center space-x-2">
              <div class="text-3xl font-bold text-zenix-text-dark">ZENI</div>
              <div class="text-3xl font-bold text-zenix-green">X</div>
            </div>
          </div>

          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl font-semibold text-zenix-text-dark mb-3">Recuperar senha</h1>
            <p class="text-sm text-zenix-gray leading-relaxed">Insira seu e-mail para receber as instruções de recuperação de senha.</p>
          </div>

          <!-- Forgot Password Form -->
          <form id="forgot-form" class="space-y-6" @submit.prevent="handleForgotPassword">
            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">E-mail</label>
              <input 
                type="email" 
                v-model="email"
                placeholder="Digite seu e-mail" 
                class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-4 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                required
              >
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
          <div class="mt-10 pt-6 border-t border-zenix-input-border">
            <p class="text-xs text-zenix-gray text-center leading-relaxed">Não recebeu o e-mail? Verifique sua caixa de spam ou <a href="#" class="text-zenix-green hover:underline">entre em contato</a>.</p>
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
              <h3 class="text-lg font-semibold text-white mb-1">IA de Investimento</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Nenhum chute. Só cálculo e lógica e estratégia.</p>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div class="flex items-start space-x-4 benefit-item" :class="{ 'animate-slide-in' : showBenefit2 }">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-copy text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Copy Trading</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Você copia estratégias que já funcionam de verdade.</p>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div class="flex items-start space-x-4 benefit-item" :class="{ 'animate-slide-in' : showBenefit3 }">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-robot text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Agente Autônomo</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Você ajusta uma vez — ele executa tudo, sem pausa e sem precisar olhar.</p>
            </div>
          </div>

          <!-- Benefit 4 -->
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
      showBenefit1: false,
      showBenefit2: false,
      showBenefit3: false,
      showBenefit4: false
    }
  },
  mounted() {
    this.startAnimations();
  },
  methods: {
    startAnimations() {
      // 1. Primeiro o Zenix aparece letra por letra
      this.typeTitle();
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

/* Efeito de digitação */
.typing-text {
  min-height: 1.75rem;
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

/* Background gradient */
.forgot-password-bg {
  background: #0B0B0B;
}

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

/* Responsividade - Tablets (768px - 1024px) */
@media (max-width: 1024px) {
  .login-container-wrapper {
    justify-content: center;
  }
  
  #hero-section {
    display: none;
  }
  
  #forgot-section {
    width: 100% !important;
    max-width: 420px;
  }
  
  #forgot-main {
    padding-left: 1rem;
    padding-right: 1rem;
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
    max-width: 100%;
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
    padding-top: 1rem;
    padding-bottom: 1rem;
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
}
</style>
