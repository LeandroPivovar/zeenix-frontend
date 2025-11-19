<template>
  <!-- Main Container -->
  <main id="register-main" class="min-h-screen flex items-center justify-center px-8 py-8">
    <div class="w-full max-w-7xl flex items-center justify-between login-container-wrapper">
      
      <!-- Left Column - Register Card -->
      <div id="register-section" class="w-full max-w-[420px] flex-shrink-0">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-8 login-card-shadow w-full">
          
          <!-- Logo -->
          <div class="mb-6">
            <div class="flex items-center space-x-2">
              <div class="text-2xl font-bold text-zenix-text-dark">ZENI</div>
              <div class="text-2xl font-bold text-zenix-green">X</div>
            </div>
          </div>

          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-xl font-semibold text-zenix-text-dark mb-2">Crie sua conta</h1>
            <p class="text-sm text-zenix-gray leading-relaxed">Preencha seus dados para criar uma conta na plataforma.</p>
          </div>

          <!-- Register Form -->
          <form id="register-form" class="space-y-4" @submit.prevent="handleRegister">
            <!-- Name Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Nome Completo</label>
              <input 
                type="text" 
                v-model="name"
                placeholder="Digite seu nome completo" 
                class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                required
              >
            </div>

            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">E-mail</label>
              <input 
                type="email" 
                v-model="email"
                placeholder="Digite seu e-mail" 
                class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                required
              >
            </div>

            <!-- CPF Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">CPF</label>
              <input 
                type="text" 
                v-model="cpf"
                @input="formatCPF"
                placeholder="000.000.000-00" 
                maxlength="14"
                class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
              >
            </div>

            <!-- WhatsApp Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">WhatsApp</label>
              <input 
                type="text" 
                v-model="whatsapp"
                @input="formatPhone"
                placeholder="(41) 99999-9999" 
                maxlength="15"
                class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-3 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
              >
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-zenix-text-dark mb-2">Senha</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password-input" 
                  v-model="password"
                  placeholder="Digite sua senha" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-3 pr-12 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                >
                <button 
                  type="button" 
                  @click="togglePassword" 
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-zenix-gray password-toggle transition-colors"
                >
                  <i class="fa-regular" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
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
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirm-password-input" 
                  v-model="confirmPassword"
                  placeholder="Confirme sua senha" 
                  class="w-full bg-zenix-input-bg border border-zenix-input-border rounded-xl px-4 py-3 pr-12 text-zenix-text-dark placeholder-zenix-gray focus:border-zenix-green focus:outline-none transition-colors"
                  required
                >
                <button 
                  type="button" 
                  @click="toggleConfirmPassword" 
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-zenix-gray password-toggle transition-colors"
                >
                  <i class="fa-regular" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
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
          <div class="mt-6 pt-4 border-t border-zenix-input-border">
            <p class="text-xs text-zenix-gray text-center leading-relaxed">Ao cadastrar, você concorda com nossos <a href="#" class="text-zenix-green hover:underline">Termos de Uso</a> e <a href="#" class="text-zenix-green hover:underline">Política de Privacidade</a>.</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Hero Content -->
      <div id="hero-section" class="w-full max-w-[600px] pl-20 flex-shrink-0">
        
        <!-- Main Title -->
        <div class="mb-8 text-left">
          <h2 class="text-6xl font-bold leading-tight mb-4 text-left">
            <span class="text-white">Você é</span><br>
            <span class="text-zenix-green">único.</span>
          </h2>
          <p class="text-lg text-zenix-light-gray leading-relaxed max-w-md text-left">A única tecnologia criada para operar com a precisão que o mercado exige..</p>
        </div>

        <!-- Benefits List -->
        <div id="benefits-list" class="space-y-8">
          
          <!-- Benefit 1 -->
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-brain text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">IA que analisa e decide com precisão</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Nenhum chute. Só cálculo e lógica.</p>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-copy text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Copy Trading testado e validado</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Você copia estratégias que já funcionam de verdade.</p>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 benefit-icon rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-robot text-zenix-green text-lg"></i>
            </div>
            <div class="text-left">
              <h3 class="text-lg font-semibold text-white mb-1">Agente Autônomo que faz tudo por você</h3>
              <p class="text-sm text-zenix-light-gray leading-relaxed">Você ajusta uma vez — ele executa tudo, sem pausa e sem precisar olhar.</p>
            </div>
          </div>

          <!-- Benefit 4 -->
          <div class="flex items-start space-x-4">
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
      isLoading: false
    }
  },
  watch: {
    password(newPassword) {
      this.calculatePasswordStrength(newPassword);
    }
  },
  methods: {
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
        alert('As senhas não correspondem!');
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
        alert('Cadastro realizado com sucesso');
        this.$router.push('/login');
      } catch (e) {
        alert(e.message || 'Erro inesperado');
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

/* Container wrapper responsivo */
.login-container-wrapper {
  flex-wrap: wrap;
  gap: 2rem;
}

/* Responsividade - Monitores médios (1280px - 1440px) */
@media (max-width: 1440px) {
  #register-main {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  #hero-section {
    padding-left: 3rem !important;
    max-width: 550px !important;
  }
  
  #register-section {
    max-width: 400px !important;
  }
  
  .text-6xl {
    font-size: 3rem !important;
  }
  
  .login-container-wrapper {
    gap: 1.5rem;
  }
  
  .p-8 {
    padding: 1.75rem !important;
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
    padding-left: 2rem !important;
    max-width: 500px !important;
  }
  
  #register-section {
    max-width: 380px !important;
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
    display: none;
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

/* Responsividade - Mobile pequeno (< 640px) */
@media (max-width: 640px) {
  #register-main {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  #register-section {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  #register-main {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
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
}
</style>
