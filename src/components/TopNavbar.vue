<template>
  <nav 
    id="top-navbar" 
    class="fixed top-0 left-0 right-0 h-[60px] bg-[#0B0B0B] border-b border-[#1C1C1C] z-50" 
    :style="{ left: isSidebarCollapsed ? '72px' : '280px', width: isSidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 280px)' }"
  >
    <div class="h-full px-6 flex items-center justify-between">
      <div class="flex items-center space-x-8">
        <div class="text-lg font-bold text-zenix-text tracking-tight">
          ZENI<span class="text-zenix-green">X</span>
        </div>
        <a 
          href="#" 
          class="bg-transparent hover:bg-[#0E0E0E] text-[#A1A1A1] hover:text-[#25D366] font-medium px-4 py-2 rounded-lg text-sm inline-flex items-center space-x-2 transition-all duration-200 border border-[#1C1C1C] hover:border-[#25D366]/30"
        >
          <i class="fa-brands fa-whatsapp text-base"></i>
          <span>Grupo de Alunos</span>
        </a>
      </div>
      <div class="flex items-center space-x-6">
        <button 
          @click="openDepositFlow" 
          class="bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold px-5 py-2 rounded-lg text-sm inline-flex items-center space-x-2 transition-all duration-200 shadow-[0_2px_8px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
        >
          <i class="fas fa-plus text-xs"></i>
          <span>Depositar Agora</span>
        </button>
        <div class="flex items-center space-x-3">
          <span id="balanceDisplay" class="text-sm font-medium text-[#DFDFDF]">
            Saldo: {{ balanceHidden ? '••••••' : formattedBalance }}
          </span>
          <button 
            @click="toggleBalance" 
            class="text-[#7A7A7A] hover:text-[#DFDFDF] transition-colors"
            type="button"
          >
            <i v-if="balanceHidden" class="fas fa-eye-slash text-sm"></i>
            <i v-else class="fas fa-eye text-sm"></i>
          </button>
        </div>
        <div class="relative">
          <button 
            @click="toggleProfileDropdown" 
            class="w-9 h-9 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center cursor-pointer hover:border-[#22C55E] hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all duration-200 overflow-hidden"
          >
            <img 
              v-if="userProfilePicture" 
              :src="userProfilePicture" 
              :alt="userName"
              class="w-full h-full object-cover rounded-full"
            />
            <span v-else class="text-white font-semibold text-sm">{{ userInitials }}</span>
          </button>
          <div 
            v-if="showProfileDropdown" 
            id="profileDropdown" 
            class="absolute right-0 top-12 w-56 bg-[#0E0E0E] border border-[#1C1C1C] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div class="p-3 border-b border-[#1C1C1C]">
              <p class="text-sm font-semibold text-[#DFDFDF]">{{ userName }}</p>
              <p class="text-xs text-[#7A7A7A]">{{ userEmail }}</p>
            </div>
            <div class="py-2">
              <a 
                href="#" 
                class="block px-4 py-2.5 text-sm text-[#DFDFDF] hover:bg-[#0B0B0B] hover:text-[#22C55E] transition-colors"
              >
                <i class="fas fa-exchange-alt text-xs mr-3 text-[#7A7A7A]"></i>
                Trocar de Conta
              </a>
              <a 
                href="#" 
                @click.prevent="$router.push('/settings')" 
                class="block px-4 py-2.5 text-sm text-[#DFDFDF] hover:bg-[#0B0B0B] hover:text-[#22C55E] transition-colors"
              >
                <i class="fas fa-cog text-xs mr-3 text-[#7A7A7A]"></i>
                Configurações
              </a>
              <a 
                href="#" 
                @click.prevent="disconnectAccount" 
                class="block px-4 py-2.5 text-sm text-[#DFDFDF] hover:bg-[#0B0B0B] hover:text-[#22C55E] transition-colors"
              >
                <i class="fas fa-plug text-xs mr-3 text-[#7A7A7A]"></i>
                Sair da Corretora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopNavbar',
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      default: false
    },
    balance: {
      type: [Number, String, Object],
      default: 0
    },
    accountType: {
      type: String,
      default: 'real'
    },
    balancesByCurrencyReal: {
      type: Object,
      default: () => ({})
    },
    balancesByCurrencyDemo: {
      type: Object,
      default: () => ({})
    },
    currencyPrefix: {
      type: String,
      default: '$'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  data() {
    return {
      balanceHidden: false,
      showProfileDropdown: false,
      userProfilePictureUrl: null
    }
  },
  computed: {
    formattedBalance() {
      if (this.accountType === 'demo') {
        const demo = this.balancesByCurrencyDemo['USD'] || this.balanceNumeric || 0;
        const prefix = this.currencyPrefix || this.getCurrencyPrefix(this.currency);
        return `${prefix}${demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      const value = this.balanceNumeric;
      const prefix = this.currencyPrefix || this.getCurrencyPrefix(this.currency);
      return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    balanceNumeric() {
      const usdReal = this.balancesByCurrencyReal['USD'];
      if (usdReal !== undefined && usdReal !== null && usdReal > 0) {
        return usdReal;
      }
      const raw = this.balance;
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const parsed = Number(raw);
        return isNaN(parsed) ? 0 : parsed;
      }
      const val = raw?.value ?? raw?.balance ?? 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    userName() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            return user.name.split(' ')[0];
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'Usuário';
    },
    userInitials() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
              return (names[0][0] + names[1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'U';
    },
    userEmail() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          return user.email || 'email@exemplo.com';
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'email@exemplo.com';
    },
    userProfilePicture() {
      if (!this.userProfilePictureUrl) return null;
      
      // Se já é uma URL completa, retornar como está
      if (this.userProfilePictureUrl.startsWith('http://') || 
          this.userProfilePictureUrl.startsWith('https://')) {
        return this.userProfilePictureUrl;
      }
      
      // Se começa com /api/uploads, construir URL relativa ao domínio
      if (this.userProfilePictureUrl.startsWith('/api/uploads')) {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const baseUrl = apiBaseUrl.replace(/\/api$/, '');
        return `${baseUrl}${this.userProfilePictureUrl}`;
      }
      
      // Fallback para caminhos antigos /uploads/...
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
      const baseUrl = apiBaseUrl.replace(/\/api$/, '');
      return `${baseUrl}${this.userProfilePictureUrl}`;
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('userProfileUpdated', this.handleProfileUpdate);
    this.loadUserProfilePicture();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('userProfileUpdated', this.handleProfileUpdate);
  },
  methods: {
    toggleBalance() {
      this.balanceHidden = !this.balanceHidden;
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    handleClickOutside(event) {
      const dropdown = document.getElementById('profileDropdown');
      const button = event.target.closest('button');
      if (dropdown && !dropdown.contains(event.target) && !button?.closest('.relative')) {
        this.showProfileDropdown = false;
      }
    },
    handleStorageChange(event) {
      // Atualiza a foto quando o localStorage 'user' for alterado
      if (event.key === 'user') {
        this.loadUserProfilePicture();
      }
    },
    handleProfileUpdate() {
      // Atualiza a foto quando um evento customizado for disparado
      this.loadUserProfilePicture();
    },
    openDepositFlow() {
      this.$router.push('/settings?tab=deposit');
    },
    disconnectAccount() {
      localStorage.removeItem('deriv_token');
      localStorage.removeItem('deriv_tokens_by_loginid');
      localStorage.removeItem('deriv_connection');
      this.$router.push('/dashboard');
      window.location.reload();
    },
    getCurrencyPrefix(currency) {
      switch ((currency || '').toUpperCase()) {
        case 'USD':
          return '$'
        case 'EUR':
          return '€'
        case 'BTC':
          return '₿'
        case 'DEMO':
          return 'D$'
        default:
          return currency ? `${currency} ` : '$'
      }
    },
    async loadUserProfilePicture() {
      try {
        // Primeiro tenta buscar do localStorage (pode ter sido atualizado recentemente)
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            if (user.profilePictureUrl) {
              this.userProfilePictureUrl = user.profilePictureUrl;
              return;
            }
          } catch (e) {
            // Ignorar erro de parsing
          }
        }

        // Se não encontrou no localStorage, busca da API
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.profilePictureUrl) {
            this.userProfilePictureUrl = data.profilePictureUrl;
            
            // Atualiza o localStorage para uso futuro
            const userInfo = localStorage.getItem('user');
            if (userInfo) {
              try {
                const user = JSON.parse(userInfo);
                user.profilePictureUrl = data.profilePictureUrl;
                localStorage.setItem('user', JSON.stringify(user));
              } catch (e) {
                // Ignorar erro de parsing
              }
            }
          }
        }
      } catch (error) {
        console.error('[TopNavbar] Erro ao carregar foto do perfil:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Top Navbar Styles */
#top-navbar {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45), 0 0 20px rgba(34, 197, 94, 0.02);
  backdrop-filter: blur(12px);
  animation: fadeInSlide 0.35s ease-out;
  transition: left 0.3s ease, width 0.3s ease;
}

@media (max-width: 1024px) {
  #top-navbar {
    left: 0 !important;
    width: 100% !important;
  }
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

