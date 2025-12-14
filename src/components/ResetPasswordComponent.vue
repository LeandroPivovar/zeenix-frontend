<template>
  <!-- Main Container -->
  <main id="reset-main" class="min-h-screen flex items-center justify-center px-8 gradient-glow">
    <div class="w-full max-w-7xl flex items-center justify-between login-container-wrapper">
      
      <!-- Left Column - Reset Password Card -->
      <div id="reset-section" class="w-[480px]">
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
            <h1 class="text-2xl font-semibold text-zenix-text-dark mb-3">Acesse sua conta</h1>
            <p class="text-sm text-zenix-gray leading-relaxed">Se você já possui uma conta, preencha seus dados para acessar a plataforma.</p>
          </div>

          <!-- Reset Password Form -->
          <form id="reset-form" class="space-y-6" @submit.prevent="handleResetPassword">
            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Nova Senha</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Digite sua nova senha" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-4 pr-12 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                  minlength="6"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-zenix-gray password-toggle transition-colors"
                >
                  <i class="fa-regular" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" id="eye-icon"></i>
                </button>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Confirmar Senha</label>
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  placeholder="Confirme sua nova senha" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-4 pr-12 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                  minlength="6"
                >
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-zenix-gray password-toggle transition-colors"
                >
                  <i class="fa-regular" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'" id="eye-icon-confirm"></i>
                </button>
              </div>
              <p v-if="passwordMismatch" class="text-sm text-red-500 mt-1">As senhas não coincidem</p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p class="text-sm text-green-600 font-medium">{{ success }}</p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center space-x-2"
              :disabled="isLoading || passwordMismatch"
            >
              <span v-if="isLoading" class="spinner"></span>
              <span>{{ isLoading ? 'Redefinindo...' : 'Redefinir senha' }}</span>
              <i v-if="!isLoading" class="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </form>

          <!-- Links -->
          <div class="mt-4 space-y-4 text-center">
            <a @click.prevent="$router.push('/login')" href="/login" class="block text-sm text-zenix-gray hover:text-zenix-text-dark transition-colors cursor-pointer">Voltar ao login</a>
          </div>

          <!-- Footer -->
          <div class="mt-10 pt-6 border-t border-zenix-input-border">
            <p class="text-xs text-zenix-gray text-center leading-relaxed">Ao acessar, você concorda com nossos <a href="#" class="text-zenix-green hover:underline">Termos de Uso</a> e <a href="#" class="text-zenix-green hover:underline">Política de Privacidade</a>.</p>
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
  </main>
</template>

<script>
export default {
  name: "ResetPasswordComponent",
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      error: '',
      success: '',
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
  computed: {
    passwordMismatch() {
      return this.confirmPassword && this.password !== this.confirmPassword;
    }
  },
  mounted() {
    // Verificar se há token na URL
    const token = this.$route.query.token;
    if (!token) {
      this.error = 'Token inválido. Por favor, solicite uma nova recuperação de senha.';
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
    async handleResetPassword() {
      if (this.isLoading || this.passwordMismatch) return;
      
      const token = this.$route.query.token;
      if (!token) {
        this.error = 'Token inválido. Por favor, solicite uma nova recuperação de senha.';
        return;
      }

      if (this.password.length < 6) {
        this.error = 'A senha deve ter no mínimo 6 caracteres';
        return;
      }

      this.isLoading = true;
      this.error = '';
      this.success = '';

      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        // Se VUE_APP_API_BASE_URL já inclui /api, usar /auth/reset-password, senão usar /api/auth/reset-password
        const endpoint = apiBase.includes('/api') ? '/auth/reset-password' : '/api/auth/reset-password';
        const res = await fetch(`${apiBase}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            token: token,
            password: this.password 
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Erro ao redefinir senha');
        }
        
        this.success = 'Senha redefinida com sucesso!';
        
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

.placeholder-zenix-gray::placeholder { color: #6A6A6A; }

.focus\:border-zenix-green:focus { border-color: #22C55E; }

/* Hover do toggle de senha - exatamente como no original */
.password-toggle:hover {
  color: #22C55E;
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

/* Responsividade - mesma do ForgotPasswordComponent */
@media (max-width: 1440px) {
  #reset-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  #hero-section {
    padding-left: 3rem;
  }
  
  .text-6xl {
    font-size: 3rem !important;
  }
}

@media (max-width: 1280px) {
  #reset-main {
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
  
  #reset-section {
    width: 420px !important;
  }
  
  .text-6xl {
    font-size: 2.5rem !important;
  }
}

@media (max-width: 1024px) {
  .login-container-wrapper {
    justify-content: center;
  }
  
  #hero-section {
    display: none;
  }
  
  #reset-section {
    width: 100% !important;
    max-width: 420px;
  }
}

@media (max-width: 768px) {
  #reset-section {
    max-width: 100%;
  }
  
  .p-10 {
    padding: 1.75rem !important;
  }
}

@media (max-width: 640px) {
  #reset-main {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .w-\[480px\] {
    width: 100% !important;
  }
  
  .p-10 {
    padding: 1.5rem !important;
  }
  
  /* Remover bordas dos inputs no mobile */
  #reset-section input {
    background-color: #1A1A1A !important;
    border: none !important;
    border-color: transparent !important;
    color: #FFFFFF !important;
    height: 52px !important;
    padding: 0.875rem 1rem !important;
    font-size: 0.875rem !important;
  }
  
  #reset-section input::placeholder {
    color: rgba(255, 255, 255, 0.35) !important;
  }
  
  #reset-section input:focus {
    border: none !important;
    border-color: transparent !important;
    outline: none !important;
  }
  
  #reset-section label {
    font-size: 13px !important;
    font-weight: 500 !important;
    margin-bottom: 0.375rem !important;
    color: #A8A8A8 !important;
  }
  
  #reset-section a {
    color: #AAAAAA !important;
    font-size: 11px !important;
    font-weight: 400 !important;
  }
  
  #reset-section .footer-text {
    font-size: 11px !important;
    line-height: 1.5 !important;
    color: #6B7280 !important;
    font-weight: 400 !important;
  }
  
  #reset-section button.bg-zenix-green {
    height: 52px !important;
    border-radius: 0.75rem !important;
  }
  
  #reset-section h1 {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    color: #DFDFDF !important;
  }
  
  #reset-section p {
    font-size: 13px !important;
    color: #8A8A8A !important;
    font-weight: 400 !important;
  }
}
</style>

