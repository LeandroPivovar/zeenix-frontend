<template>
  <!-- Main Container -->
  <main id="success-main" class="min-h-screen flex items-center justify-center px-8">
    <div class="w-full max-w-7xl flex items-center justify-center login-container-wrapper">
      
      <!-- Left Column - Success Card -->
      <div id="success-section" class="w-full max-w-[480px] flex-shrink-0">
        <div class="bg-white border border-zenix-card-border rounded-2xl p-10 login-card-shadow w-full success-card">
          
          <!-- Logo -->
          <div class="mb-12 flex justify-center success-logo">
            <div class="flex items-center space-x-2 logo-animation">
              <div class="text-3xl font-bold text-zenix-text-dark zenix-logo-title">
                <span v-if="isMobile" v-html="typedLogoTitle" class="logo-text"></span>
                <template v-else>
                  <span class="text-zenix-text-dark">ZENI</span><span class="text-zenix-green">X</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Header & Icon -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-zenix-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-zenix-green/20 scale-animation">
              <i class="fa-solid fa-check text-zenix-green text-3xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-zenix-text-dark mb-4">Cadastro Concluído!</h1>
            <p class="text-sm text-zenix-gray leading-relaxed">
              Sua conta foi criada com sucesso na plataforma <strong>ZENIX</strong>.
            </p>
          </div>

          <!-- Activation Info -->
          <div class="bg-zenix-input-bg border border-zenix-input-border rounded-2xl p-6 mb-8">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <i class="fa-solid fa-envelope text-zenix-green"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-zenix-text-dark mb-1">Verifique seu e-mail</h3>
                <p class="text-xs text-zenix-gray leading-relaxed">
                  Enviamos um link de ativação para o seu e-mail. Por favor, clique no link para ativar sua conta e liberar o acesso.
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <button 
            @click="$router.push('/login')" 
            class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-4 rounded-full transition-all flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Ir para Login</span>
            <i class="fa-solid fa-arrow-right text-sm"></i>
          </button>

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-zenix-input-border">
            <p class="text-xs text-zenix-gray text-center leading-relaxed">
              Não recebeu o e-mail? Verifique sua caixa de spam ou entre em contato com nosso <a href="#" class="text-zenix-green hover:underline">suporte</a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column - Hero Content -->
      <div v-if="!isMobile" id="hero-section" class="w-full max-w-[600px] pl-12 flex-shrink-0">
        <!-- Main Title -->
        <div class="mb-8 text-left">
          <h2 class="text-8xl font-bold leading-tight mb-6 text-left" style="font-size: 4.5rem;">
            <span v-html="typedTitle"></span>
          </h2>
          <p class="text-xl text-white leading-relaxed typing-text">
            <span v-html="typedSubtitle"></span>
          </p>
        </div>

        <!-- Benefits Summary (Concise) -->
        <div class="space-y-6">
          <div class="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <div class="w-10 h-10 bg-zenix-green/20 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-rocket text-zenix-green"></i>
            </div>
            <p class="text-white font-medium">Prepare-se para uma nova era de investimentos com IA.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "RegisterSuccessComponent",
  data() {
    return {
      fullTitle: 'ZENIX',
      fullSubtitle: 'A única tecnologia criada para operar com a precisão que o mercado exige.',
      typedTitle: '',
      typedSubtitle: '',
      fullLogoTitle: 'ZENIX',
      typedLogoTitle: '',
      isMobile: false
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 640;
    this.startAnimations();
  },
  methods: {
    startAnimations() {
      setTimeout(() => this.typeLogoTitle(), 200);
      setTimeout(() => this.typeTitle(), 500);
    },
    typeLogoTitle() {
      this.typedLogoTitle = '';
      let index = 0;
      const typeChar = () => {
        if (index < this.fullLogoTitle.length) {
          const char = this.fullLogoTitle.charAt(index);
          this.typedLogoTitle += (char === 'X') 
            ? '<span class="text-zenix-green">X</span>' 
            : `<span class="text-zenix-text-dark">${char}</span>`;
          index++;
          setTimeout(typeChar, 180);
        }
      };
      typeChar();
    },
    typeTitle() {
      let index = 0;
      const typeChar = () => {
        if (index < this.fullTitle.length) {
          const char = this.fullTitle.charAt(index);
          this.typedTitle += (char === 'X') 
            ? '<span class="text-zenix-green">X</span>' 
            : `<span class="text-white">${char}</span>`;
          index++;
          setTimeout(typeChar, 100);
        } else {
          setTimeout(() => this.typeSubtitle(), 300);
        }
      };
      typeChar();
    },
    typeSubtitle() {
      let index = 0;
      const typeChar = () => {
        if (index < this.fullSubtitle.length) {
          this.typedSubtitle += this.fullSubtitle.charAt(index);
          index++;
          setTimeout(typeChar, 30);
        }
      };
      typeChar();
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { 
  font-family: 'Inter', sans-serif; 
}

.success-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 
              0 8px 32px rgba(0, 0, 0, 0.05);
}

.scale-animation {
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .zenix-logo-title {
    font-size: 50px !important;
  }
}
</style>
