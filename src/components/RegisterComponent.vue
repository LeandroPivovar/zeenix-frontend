<template>
  <!-- Main Container -->
  <main id="register-main" class="min-h-screen flex items-center justify-center px-8">
    <div class="w-full max-w-7xl flex items-center justify-between login-container-wrapper">
      
      <!-- Left Column - Register Card -->
      <div id="register-section" class="w-full max-w-[420px] flex-shrink-0">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-8 login-card-shadow w-full register-card">
          
          <!-- Logo -->
          <div class="mb-12 flex justify-center register-logo">
            <div class="flex items-center space-x-2 logo-animation">
              <div class="text-2xl font-bold text-zenix-text-dark">
                <span v-if="isMobile" v-html="typedLogoTitle" class="logo-text"></span>
                <template v-else>
                  <span class="text-zenix-text-dark">ZENI</span><span class="text-zenix-green">X</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Header -->
          <div class="mb-6 header-section">
            <h1 class="text-2xl font-semibold text-zenix-text-dark mb-2 header-title">Crie sua conta</h1>
            <p class="text-sm text-zenix-gray leading-relaxed forgot-text header-subtitle">Preencha seus dados para criar uma conta na plataforma.</p>
          </div>

          <!-- Register Form -->
          <form id="register-form" class="space-y-4" @submit.prevent="handleRegister">
            <!-- Name Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Nome Completo</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 16C2 13.2386 4.23858 11 7 11H9C11.7614 11 14 13.2386 14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  v-model="name"
                  placeholder="Digite seu nome completo" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                >
              </div>
            </div>

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
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                >
              </div>
            </div>

            <!-- CPF Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">CPF</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 16C2 13.2386 4.23858 11 7 11H9C11.7614 11 14 13.2386 14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  v-model="cpf"
                  @input="formatCPF"
                  placeholder="000.000.000-00" 
                  maxlength="14"
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                >
              </div>
            </div>

            <!-- WhatsApp Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">WhatsApp</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 1.5C2.67157 1.5 2 2.17157 2 3V13C2 13.8284 2.67157 14.5 3.5 14.5H5.5L6.5 16.5H9.5L10.5 14.5H12.5C13.3284 14.5 14 13.8284 14 13V3C14 2.17157 13.3284 1.5 12.5 1.5H3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6H10M6 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input 
                  type="text" 
                  v-model="whatsapp"
                  @input="formatPhone"
                  placeholder="(41) 99999-9999" 
                  maxlength="15"
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                >
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Senha</label>
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
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-12 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
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
              
              <!-- Password Strength Indicator -->
              <div v-if="password" class="mt-2">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs text-zenix-gray">Força da senha</span>
                  <span class="text-xs font-medium" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
                </div>
                <div class="w-full bg-zenix-input-bg rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all"
                    :style="{ 
                      width: passwordStrength + '%',
                      backgroundColor: strengthColor 
                    }"
                  ></div>
                </div>
                
                <!-- Password Requirements -->
                <div class="mt-2 space-y-1">
                  <div class="flex items-center text-xs" :class="password.length >= 8 ? 'text-zenix-green' : 'text-zenix-gray'">
                    <i :class="password.length >= 8 ? 'fa-solid fa-check' : 'fa-regular fa-circle'" class="mr-2"></i>
                    Pelo menos 8 caracteres
                  </div>
                  <div class="flex items-center text-xs" :class="/[A-Z]/.test(password) ? 'text-zenix-green' : 'text-zenix-gray'">
                    <i :class="/[A-Z]/.test(password) ? 'fa-solid fa-check' : 'fa-regular fa-circle'" class="mr-2"></i>
                    Letras maiúsculas
                  </div>
                  <div class="flex items-center text-xs" :class="/[0-9]/.test(password) ? 'text-zenix-green' : 'text-zenix-gray'">
                    <i :class="/[0-9]/.test(password) ? 'fa-solid fa-check' : 'fa-regular fa-circle'" class="mr-2"></i>
                    Números
                  </div>
                  <div class="flex items-center text-xs" :class="/[^a-zA-Z0-9]/.test(password) ? 'text-zenix-green' : 'text-zenix-gray'">
                    <i :class="/[^a-zA-Z0-9]/.test(password) ? 'fa-solid fa-check' : 'fa-regular fa-circle'" class="mr-2"></i>
                    Caracteres especiais (!@#$%)
                  </div>
                </div>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Confirmar Senha</label>
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6H11V4C11 2.89543 10.1046 2 9 2H7C5.89543 2 5 2.89543 5 4V6H4C3.44772 6 3 6.44772 3 7V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V7C13 6.44772 12.5523 6 12 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 4C6 3.44772 6.44772 3 7 3H9C9.55228 3 10 3.44772 10 4V6H6V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirm-password-input" 
                  v-model="confirmPassword"
                  placeholder="Confirme sua senha" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl pl-10 pr-12 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                >
                <button 
                  type="button" 
                  @click="toggleConfirmPassword" 
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-zenix-gray password-toggle transition-colors"
                >
                  <!-- Eye SVG -->
                  <svg v-if="!showConfirmPassword" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8C1 8 3.5 4 8 4C12.5 4 15 8 15 8C15 8 12.5 12 8 12C3.5 12 1 8 1 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <!-- Eye-slash SVG -->
                  <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 4.5C11.5 5 13 6.5 14 8M6.5 11.5C4.5 11 3 9.5 2 8M2 4L14 12M14 4L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <!-- Password Match Indicator -->
              <div v-if="confirmPassword" class="mt-2">
                <div v-if="password === confirmPassword" class="text-xs text-zenix-green flex items-center">
                  <i class="fa-solid fa-check mr-2"></i>
                  Senhas correspondem
                </div>
                <div v-else class="text-xs text-red-500 flex items-center">
                  <i class="fa-solid fa-times mr-2"></i>
                  As senhas não correspondem
                </div>
              </div>
            </div>

            <!-- Register Button -->
            <button 
              type="submit" 
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center space-x-2"
              :disabled="isLoading || password !== confirmPassword"
            >
              <span v-if="isLoading" class="spinner"></span>
              <span>{{ isLoading ? 'Criando conta...' : 'Criar conta' }}</span>
              <i v-if="!isLoading" class="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </form>

          <!-- Links -->
          <div class="mt-6 space-y-3 text-center">
            <router-link to="/login" class="block text-sm text-zenix-gray hover:text-zenix-text-dark transition-colors">Já possui uma conta? Voltar ao login</router-link>
          </div>

          <!-- Footer -->
          <div class="mt-6 pt-4 border-t border-zenix-input-border footer-login">
            <p class="text-xs text-zenix-gray text-center leading-relaxed footer-text">Ao continuar, você concorda com nossos <a href="#" class="text-zenix-green hover:underline">Termos de uso</a> e <a href="#" class="text-zenix-green hover:underline">Política de Privacidade</a>.</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Hero Content -->
      <div id="hero-section" class="w-full max-w-[600px] pl-20 flex-shrink-0">
        
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
    
    <!-- Disclaimer apenas no mobile -->
    <div class="mobile-disclaimer">
      <p class="disclaimer-text">Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.</p>
    </div>
  </main>
</template>

<script>
export default {
  name: "RegisterComponent",
  data() {
    return {
      name: '',
      email: '',
      cpf: '',
      whatsapp: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      passwordStrength: 0,
      strengthLabel: '',
      strengthColor: '#e5e7eb',
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
    this.startAnimations();
  },
  watch: {
    password(newPassword) {
      this.calculatePasswordStrength(newPassword);
    }
  },
  methods: {
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
      const typingSpeed = 100; // velocidade de digitação em ms
      
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
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    calculatePasswordStrength(password) {
      if (!password) {
        this.passwordStrength = 0;
        this.strengthLabel = '';
        this.strengthColor = '#e5e7eb';
        return;
      }
      
      let strength = 0;
      
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 10;
      if (/[a-z]/.test(password)) strength += 15;
      if (/[A-Z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
      
      this.passwordStrength = Math.min(strength, 100);
      
      if (this.passwordStrength < 40) {
        this.strengthLabel = 'Fraca';
        this.strengthColor = '#ef4444';
      } else if (this.passwordStrength < 70) {
        this.strengthLabel = 'Média';
        this.strengthColor = '#f59e0b';
      } else if (this.passwordStrength < 90) {
        this.strengthLabel = 'Boa';
        this.strengthColor = '#3b82f6';
      } else {
        this.strengthLabel = 'Forte';
        this.strengthColor = '#10b981';
      }
    },
    formatCPF(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.cpf = value;
    },
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      this.whatsapp = value;
    },
    async handleRegister() {
      if (this.isLoading) return;
      if (this.password !== this.confirmPassword) {
        this.$root.$toast.error('As senhas não correspondem!');
        return;
      }
      this.isLoading = true;
      try {
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name, email: this.email, password: this.password })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Falha no cadastro');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        this.$root.$toast.success('Cadastro realizado com sucesso');
        this.$router.push('/login');
      } catch (e) {
        this.$root.$toast.error(e.message || 'Erro inesperado');
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
.text-red-500 { color: #ef4444; }

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

/* Classes Tailwind CSS inline - estrutura exata do original */
.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-between { justify-content: space-between; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.w-full { width: 100%; }
.max-w-7xl { max-width: 80rem; }
.w-\[480px\] { width: 480px; }
.w-\[600px\] { width: 600px; }
.max-w-\[420px\] { max-width: 420px; }
.max-w-\[480px\] { max-width: 480px; }
.max-w-\[600px\] { max-width: 600px; }
.pl-20 { padding-left: 5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.p-8 { padding: 2rem; }
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
.mb-6 { margin-bottom: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.pt-4 { padding-top: 1rem; }
.pt-6 { padding-top: 1.5rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.border-t { border-top-width: 1px; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-1 > * + * { margin-top: 0.25rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-8 > * + * { margin-top: 2rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-6xl { font-size: 3.75rem; line-height: 1; }
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
.mr-2 { margin-right: 0.5rem; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.hover\:text-zenix-text-dark:hover { color: #0B0B0B; }
.hover\:text-zenix-green-hover:hover { color: #16A34A; }
.hover\:underline:hover { text-decoration: underline; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.w-12 { width: 3rem; }
.h-12 { height: 3rem; }
.h-2 { height: 0.5rem; }
.flex-shrink-0 { flex-shrink: 0; }
.max-w-md { max-width: 28rem; }

/* Container wrapper responsivo (igual ao login) */
.login-container-wrapper {
  flex-wrap: wrap;
  gap: 2rem;
}

@media (min-width: 1024px) {
  #hero-mobile {
    display: none !important;
  }
  #register-section {
    margin: 2rem !important;
  }
}

/* Responsividade - Monitores médios (1280px - 1440px) */
@media (max-width: 1440px) {
  #register-main {
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
  #register-main {
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
  
  #register-section {
    max-width: 420px !important;
  }
  
  .text-6xl {
    font-size: 2.5rem !important;
  }
  
  .text-lg {
    font-size: 1rem !important;
  }
  
  .p-8 {
    padding: 1.5rem !important;
  }
}

/* Responsividade - Tablets (768px - 1024px) */
@media (max-width: 1024px) {
  .login-container-wrapper {
    justify-content: center;
    flex-direction: column;
  }
  
  #hero-section {
    display: block;
  }
  
  #register-section {
    width: 100% !important;
    max-width: 450px;
  }
  
  #register-main {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  .p-8 {
    padding: 1.5rem !important;
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
  #register-section {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  #register-main {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .p-8 {
    padding: 1.5rem !important;
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
    margin-top: 1rem !important;
  }
  
  .py-3 {
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
  }
}

/* Responsividade - Mobile pequeno (< 640px) - igual ao login */
@media (max-width: 640px) {
  #register-main {
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
  
  .p-8 {
    padding: 1.25rem !important;
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
  
  .space-y-4 > * + * {
    margin-top: 0.875rem !important;
  }
  
  .space-y-3 > * + * {
    margin-top: 0.625rem !important;
  }
  
  .px-4 {
    padding-left: 0.875rem !important;
    padding-right: 0.875rem !important;
  }
  
  .py-3 {
    padding-top: 0.625rem !important;
    padding-bottom: 0.625rem !important;
  }
  
  .rounded-xl {
    border-radius: 0.625rem !important;
  }
  
  .rounded-2xl {
    border-radius: 0.875rem !important;
  }

  /* Layout em coluna: hero acima do card no mobile, igual login */
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

  #register-section {
    width: 100% !important;
    max-width: 360px !important;
    margin: 0 auto !important;
    padding: 0;
    padding-top: 4rem !important;
  }

  /* Remover fundo do card apenas no mobile */
  #register-section .register-card {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  /* Ajuste de cores para combinar com o login mobile */
  #register-section .bg-white {
    background-color: transparent !important;
    border-color: transparent !important;
  }

  #register-section .bg-zenix-input-bg {
    background-color: #050B0B !important;
    border-color: #111827 !important;
  }

  #register-section .border-zenix-input-border {
    border-color: #111827 !important;
  }

  #register-section .text-zenix-text-dark {
    color: #F9FAFB !important;
  }

  #register-section .text-zenix-gray {
    color: #9CA3AF !important;
  }

  #register-section .placeholder-zenix-gray::placeholder {
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

  /* Ajustes nos inputs */
  #register-section input {
    padding: 0.875rem 1rem !important;
    font-size: 0.875rem !important;
    background-color: #1F2937 !important;
    border-color: #374151 !important;
    color: #FFFFFF !important;
  }

  /* Ajustar padding dos inputs com ícones */
  #register-section input[type="email"],
  #register-section input[type="password"],
  #register-section input[type="text"] {
    padding-left: 2.5rem !important;
  }

  #register-section input::placeholder {
    color: #6B7280 !important;
  }

  #register-section label {
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

  /* Botão ajustes */
  #register-section button.bg-zenix-green {
    padding: 0.875rem 1.5rem !important;
    font-size: 0.875rem !important;
    border-radius: 0.5rem !important;
    font-weight: 600 !important;
    background-color: #22C55E !important;
    color: #FFFFFF !important;
  }

  #register-section button.bg-zenix-green i {
    color: #FFFFFF !important;
  }

  /* Links */
  #register-section a {
    color: #9CA3AF !important;
  }

  #register-section a.text-zenix-green {
    color: #22C55E !important;
  }

  /* Footer ajustes */
  .footer-login {
    margin-top: 2rem !important;
    padding-top: 1.5rem !important;
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

  .register-logo .text-zenix-text-dark,
  .register-logo .logo-text span.text-zenix-text-dark {
    font-size: 2rem !important;
    line-height: 1;
    margin: 0;
    color: #FFFFFF !important;
    font-weight: 700 !important;
  }

  .register-logo .text-zenix-green,
  .register-logo .logo-text span.text-zenix-green {
    font-size: 2rem !important;
    line-height: 1;
    margin: 0;
    color: #22C55E !important;
    font-weight: 700 !important;
  }

  /* Remover espaçamento entre letras no mobile */
  .register-logo .logo-animation {
    gap: 0 !important;
  }

  .register-logo .logo-animation > * {
    margin: 0 !important;
  }

  .register-logo {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
  }

  /* Animação do logo letra por letra (mobile) */
  .register-logo .logo-animation {
    overflow: hidden;
  }

  .register-logo .logo-text {
    display: inline-block;
  }

  .register-logo .logo-text span {
    display: inline-block;
  }

  /* Espaçamento do card após o logo */
  #register-section {
    padding-top: 7rem !important;
  }

  /* Ajuste de padding interno do card */
  #register-section .register-card {
    padding: 0 !important;
  }

  button.bg-zenix-green {
  background-color: #22C55E !important;
  color: white !important;
  border: none !important;
  border-radius: 0.625rem !important;
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
</style>
