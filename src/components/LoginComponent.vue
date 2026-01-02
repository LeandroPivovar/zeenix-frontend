<template>
  <!-- Main Container -->
  <main id="login-main" class="min-h-screen flex items-center justify-center px-8">
    <div class="w-full max-w-7xl flex items-center justify-center login-container-wrapper">
      
      <!-- Left Column - Login Card -->
      <div id="login-section" class="w-[480px]">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-10 login-card-shadow login-card">
          
          <!-- Logo -->
          <div class="mb-12 flex justify-center login-logo">                                                                                                                                                                          
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

          <!-- Login Form -->
          <form id="login-form" class="space-y-6" @submit.prevent="handleLogin">
            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2 login-label">E-mail</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4L8 8L14 4M2 4H14V12H2V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  type="email" 
                  v-model="email"
                  placeholder="Digite o seu e-mail" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-4 py-4 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors input-email"
                  required
                >
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2 login-label">Senha</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6H11V4C11 2.89543 10.1046 2 9 2H7C5.89543 2 5 2.89543 5 4V6H4C3.44772 6 3 6.44772 3 7V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V7C13 6.44772 12.5523 6 12 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 4C6 3.44772 6.44772 3 7 3H9C9.55228 3 10 3.44772 10 4V6H6V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password-input" 
                  v-model="password"
                  placeholder="Digite sua senha" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-12 py-4 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors input-password"
                  required
                >
                <button 
                  type="button" 
                  @click="togglePassword" 
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-zenix-gray password-toggle transition-colors"
                >
                  <!-- Eye SVG -->
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8C1 8 3.5 4 8 4C12.5 4 15 8 15 8C15 8 12.5 12 8 12C3.5 12 1 8 1 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <!-- Eye-slash SVG -->
                  <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 4.5C11.5 5 13 6.5 14 8M6.5 11.5C4.5 11 3 9.5 2 8M2 4L14 12M14 4L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <!-- Security Message -->
              <div class="mt-2 security-message login-security-message">
                <svg class="text-xs mr-1 security-icon" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6H11V4C11 2.89543 10.1046 2 9 2H7C5.89543 2 5 2.89543 5 4V6H4C3.44772 6 3 6.44772 3 7V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V7C13 6.44772 12.5523 6 12 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 4C6 3.44772 6.44772 3 7 3H9C9.55228 3 10 3.44772 10 4V6H6V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-xxs security-text">Seus dados estão protegidos com criptografia avançada</span>
              </div>
            </div>

            <!-- Login Button -->
            <button 
              type="submit" 
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center space-x-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner"></span>
              <span>{{ isLoading ? 'Entrando...' : 'Acessar minha conta' }}</span>
              <i v-if="!isLoading" class="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </form>

          <!-- Links -->
          <div class="links-section">
            <router-link to="/forgot-password" class="text-sm text-zenix-gray hover:text-zenix-text-dark transition-colors link-left">Esqueceu a senha? </router-link>
            <router-link to="/register" class="text-sm text-zenix-green hover:text-zenix-green-hover font-medium transition-colors link-right">Criar conta agora</router-link>
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
import { loadAvailableAccounts, clearAccountsCache } from '../utils/accountsLoader';

export default {
  name: "LoginComponent",
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      showPassword: false,
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
      showBenefit4: false,
      isMounted: false
    }
  },
  mounted() {
    this.isMounted = true;
    this.isMobile = window.innerWidth <= 640;
    this.loadFontAwesome();
    this.startAnimations();
  },
  beforeUnmount() {
    this.isMounted = false;
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
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (this.isLoading) return;
      
      // Usar uma abordagem mais segura: verificar se podemos atualizar o estado
      // antes de continuar
      try {
        if (this.$el && this.$el.parentNode) {
          this.isLoading = true;
        } else {
          // Se o componente não está mais no DOM, não podemos atualizar o estado
          return;
        }
      } catch (e) {
        // Se houver erro ao atualizar estado, abortar
        return;
      }
      
      try {
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Falha no login');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.removeItem('deriv_token');
        localStorage.removeItem('deriv_connection');
        localStorage.removeItem('deriv_app_id');
        
        // Carregar contas disponíveis em background após login bem-sucedido
        // Isso otimiza o carregamento quando o usuário clicar em "trocar de conta"
        this.loadAccountsInBackground();
        
        // Para login bem-sucedido, usar window.location.href diretamente
        // Isso força um reload completo da página, evitando completamente
        // problemas de desmontagem do componente Vue
        window.location.href = '/dashboard';
      } catch (e) {
        // Apenas atualizar estado se o componente ainda estiver montado
        // e se conseguirmos acessar o DOM
        try {
          if (this.$el && this.$el.parentNode) {
            this.isLoading = false;
            if (this.$root && this.$root.$toast) {
              this.$root.$toast.error(e.message || 'Erro inesperado');
            }
          }
        } catch (stateError) {
          // Ignorar erro silenciosamente se não conseguirmos atualizar
        }
      }
    },
    async loadAccountsInBackground() {
      // Limpar cache e carregar todas as contas em background após login
      // Se houver tokens armazenados, limpar cache e recarregar as contas
      const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
      if (tokensByLoginIdStr) {
        try {
          // Limpar cache antes de recarregar
          clearAccountsCache();
          console.log('[LoginComponent] Cache de contas limpo, recarregando todas as contas...');
          
          // Executar em background sem await para não bloquear o redirecionamento
          // Usar forceReload=true para garantir que busca todas as contas
          loadAvailableAccounts(true).then((accounts) => {
            console.log(`[LoginComponent] ✅ ${accounts.length} contas carregadas e salvas no cache após login`);
          }).catch(err => {
            console.warn('[LoginComponent] Erro ao carregar contas em background:', err);
          });
        } catch (error) {
          console.warn('[LoginComponent] Erro ao iniciar carregamento de contas:', error);
        }
      } else {
        console.log('[LoginComponent] Nenhum token de conta encontrado, pulando carregamento de contas');
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

/* Efeito de digitação */
.typing-text {
  min-height: 1.75rem;
}

/* Estilo do título ZENIX - apenas no mobile */
@media (max-width: 640px) {
  .zenix-logo-title {
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    font-size: 50px !important;
    text-transform: uppercase;
    letter-spacing: 0;
    line-height: 1;
  }

  .zenix-logo-title .text-zenix-text-dark {
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 50px !important;
  }

  .zenix-logo-title .text-zenix-green {
    color: #22C55E !important;
    font-weight: 700 !important;
    font-size: 50px !important;
  }
}

/* Desktop - manter estilo original do título */
@media (min-width: 641px) {
  .login-logo {
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
  
  /* Centralizar título e descrição no desktop */
  .header-section {
    text-align: center !important;
  }
  
  .header-title {
    text-align: center !important;
  }
  
  .header-subtitle {
    text-align: center !important;
  }
  
  
  /* Links com space-between e espaçamento de 15px do botão */
  .links-section {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-top: 0 !important;
    margin: 0 !important;
    padding-top: 0 !important;
    gap: 15px !important;
  }
  
  .link-left,
  .link-right {
    font-size: 0.875rem !important;
    font-weight: 400 !important;
    padding: 15px !important;
  }
  
  /* Ocultar labels no desktop */
  #login-section label.login-label {
    display: none !important;
  }
  
  /* Ocultar mensagem de segurança no desktop */
  .login-security-message {
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
  #login-main {
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

/* Centralizar conteúdo no desktop */
@media (min-width: 641px) {
  .login-container-wrapper {
    justify-content: center !important;
  }
}

/* Responsividade - Monitores médios (1280px - 1440px) */
@media (max-width: 1440px) {
  #login-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  #hero-section {
    padding-left: 2rem;
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
  #login-main {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .login-container-wrapper {
    gap: 1rem;
  }
  
  #hero-section {
    padding-left: 1.5rem;
    width: 500px !important;
  }
  
  #login-section {
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

  #login-section {
    width: 100% !important;
    max-width: 450px;

  }

  #login-main {
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
  #login-section {
    width: 100% !important;
    max-width: 100% !important;
  }

  #login-main {
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
  #login-main {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1.5rem;
    padding-bottom: 0;
    display: flex !important;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
    background: transparent;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch;
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
  #login-section {
    width: 100% !important;
    max-width: 360px !important;
    margin: 0 auto !important;
    padding: 0;
    padding-top: 4rem !important;
  }

  /* Remover fundo do card apenas no mobile */
  #login-section .login-card {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  /* Ajuste de cores apenas no mobile para ficar igual ao layout */
  #login-section .bg-white {
    background-color: transparent !important;
    border-color: transparent !important;
  }

  #login-section .bg-zenix-input-bg {
    background-color: #050B0B !important;
    border-color: #111827 !important;
  }

  #login-section .border-zenix-input-border {
    border: none;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  #login-section .text-zenix-text-dark {
    color: #FFFFFF !important;
  }

  #login-section .text-zenix-gray {
    color: #9CA3AF !important;
  }

  #login-section .placeholder-zenix-gray::placeholder {
    color: #6B7280 !important;
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

  #login-section h1 {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
  }

  /* Links lado a lado no mobile */
  .links-section {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-top: 0 !important;
    gap: 1rem;
  }

  .link-left,
  .link-right {
    display: inline-block !important;
    font-size: 0.875rem !important;
    font-weight: 400 !important;
  }

  .link-left {
    color: #AAAAAA !important;
  }
  
  .link-right {
    color: #22C55E !important;
  }
  
  /* Espaçamento de 15px entre os links */
  .links-section {
    gap: 15px !important;
  }

  /* Footer ajustes */
  .footer-login {
    margin-top: 1.5rem !important;
    padding-top: 1.25rem !important;
    border-top-color: rgba(255, 255, 255, 0.1) !important;
  }

  .footer-text {
    font-size: 11px !important;
    line-height: 1.5 !important;
    color: #6B7280 !important;
    font-weight: 400 !important;
  }

  .footer-text a {
    color: #22C55E !important;
    text-decoration: underline !important;
  }

  /* Logo fora visualmente do card apenas no mobile */
  .login-logo {
    position: absolute;
    top: 6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    margin-bottom: 0 !important;
  }

  /* Animação do logo letra por letra (mobile) */
  .login-logo .logo-animation {
    overflow: hidden;
  }

  .login-logo .logo-text {
    display: inline-block;
  }

  .login-logo .logo-text span {
    display: inline-block;
  }

  .login-logo .text-zenix-text-dark,
  .login-logo .logo-text span.text-zenix-text-dark {
    font-size: 50px !important;
    line-height: 1;
    margin: 0;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    text-transform: uppercase;
    letter-spacing: 0;
  }

  .login-logo .text-zenix-green,
  .login-logo .logo-text span.text-zenix-green {
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
  .login-logo .logo-animation {
    gap: 0 !important;
  }

  .login-logo .logo-animation > * {
    margin: 0 !important;
  }

  /* Espaçamento do card após o logo */
  #login-section {
    padding-top: 12rem !important;
  }

  /* Ajuste de padding interno do card */
  #login-section .login-card {
    padding: 0 !important;
  }

  /* Ajustes nos inputs */
  #login-section input {
    padding: 0.875rem 1rem !important;
    font-size: 0.875rem !important;
    background-color: #030606bf !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
  }
  
  #login-section input:focus {
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    outline: none !important;
  }

  /* Input de email com ícone */
  #login-section input.input-email {
    padding-left: 2.75rem !important;
  }

  /* Input de senha com ícone */
  #login-section input.input-password {
    padding-left: 2.75rem !important;
  }

  /* Garantir que o texto digitado seja sempre branco */
  #login-section input:-webkit-autofill,
  #login-section input:-webkit-autofill:hover,
  #login-section input:-webkit-autofill:focus {
    -webkit-text-fill-color: #FFFFFF !important;
    -webkit-box-shadow: 0 0 0px 1000px #030606bf inset !important;
  }

  /* Campo de senha - quando preenchido, mostrar pontos em branco */
  #login-section input.input-password {
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.1em;
  }

  /* Campo de email */
  #login-section input.input-email {
    color: #FFFFFF !important;
  }

  #login-section input::placeholder {
    color: rgba(255, 255, 255, 0.35) !important;
    font-family: 'Inter', sans-serif !important;
  }

  /* Placeholder do campo de senha sem letter-spacing */
  #login-section input.input-password::placeholder {
    letter-spacing: 0 !important;
    font-family: 'Inter', sans-serif !important;
  }

  /* Texto digitado nos inputs deve ser branco */
  #login-section input[type="text"],
  #login-section input[type="email"],
  #login-section input[type="password"] {
    color: #FFFFFF !important;
  }

  /* Quando o campo de senha tem valor, o texto deve ser branco */
  #login-section input[type="password"]:not(:placeholder-shown) {
    color: #FFFFFF !important;
  }

  #login-section label {
    font-size: 13px !important;
    margin-bottom: 0.375rem !important;
    color: #a0a3a2 !important;
    font-weight: 500 !important;
  }
  
  /* Ocultar labels no mobile */
  #login-section label.login-label {
    display: none !important;
  }
  
  /* Garantir que labels com text-zenix-text-dark também usem a cor correta */
  #login-section label.text-zenix-text-dark {
    color: #a0a3a2 !important;
  }

  /* Ícones dos inputs (SVG) */
  .input-icon {
    color: #6B7280 !important;
    width: 14px !important;
    height: 14px !important;
    z-index: 10;
    pointer-events: none;
  }

  /* Ícone do olho no campo de senha */
  #login-section .password-toggle {
    color: #6B7280 !important;
  }

  /* Mensagem de segurança */
  .security-message {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 0.5rem !important;
    padding-top: 0.25rem !important;
    margin-top: 0 !important;
    text-align: left !important;
  }
  
  /* Ocultar security-message no mobile */
  .login-security-message {
    display: none !important;
  }

  .security-message svg,
  .security-message .security-icon {
    width: 12px !important;
    height: 12px !important;
    margin-right: 0.375rem !important;
    color: #9CA3AF !important;
    flex-shrink: 0;
  }

  .security-message svg path {
    stroke: #9CA3AF !important;
  }

  .security-text {
    font-size: 0.625rem !important;
    color: #9CA3AF !important;
  }
  
  .text-xxs {
    font-size: 0.625rem !important;
    line-height: 1rem;
  }

  /* Botão ajustes */
  #login-section button.bg-zenix-green {
    padding: 0.875rem 1.5rem !important;
    font-size: 0.875rem !important;
    border-radius: 0.75rem !important;
    font-weight: 600 !important;
    margin-top: 1.25rem !important;
    background-color: #22C55E !important;
    color: #FFFFFF !important;
    height: 52px !important;
  }

  #login-section button.bg-zenix-green i {
    color: #FFFFFF !important;
  }

  /* Espaçamento entre campos do formulário */
  #login-form {
    gap: 1rem !important;
    margin-top: 1.5rem !important;
  }
  
  #login-form > div {
    margin-bottom: 0 !important;
  }
  
  /* Espaçamento da mensagem de segurança - apenas no desktop */
  .security-message:not(.login-security-message) {
    padding-top: 0.375rem !important;
    margin-top: 0.375rem !important;
    margin-bottom: 0 !important;
  }
  
  /* Espaçamento após o botão - 15px */
  .links-section {
    padding-top: 0 !important;
    margin-top: 15px !important;
    gap: 15px !important;
  }
  
  /* Remover espaçamento do último elemento do formulário (botão) */
  #login-form > button {
    margin-bottom: 0 !important;
  }
  
  #login-form > button + div {
    margin-top: 0 !important;
    padding-top: 0 !important;
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

/* Ocultar disclaimer no desktop */
@media (min-width: 641px) {
  .mobile-disclaimer {
    display: none !important;
  }
}

@media (max-width: 375px){
  .login-logo{
    top: 6rem !important;
  }
}
</style>
