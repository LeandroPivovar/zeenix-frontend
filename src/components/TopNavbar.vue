<template>
  <nav 
    id="top-navbar" 
    class="fixed top-0 left-0 right-0 h-[60px] z-[1000] mobile-header" 
    style="width: 100%; background: #0B0B0B;"
  >
    <!-- Desktop Layout -->
    <div class="h-full flex items-center justify-between desktop-nav">
      <div class="flex items-center space-x-4 mr-10">
        <!-- Botão de toggle do menu (apenas desktop, sempre visível) -->
        <button 
          v-if="!isMobile"
          @click="toggleSidebarCollapse"
          class="toggle-menu-btn-header p-[6px]"
          :title="isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
        >
          <i class="fas fa-bars text-[#DFDFDF]"></i>
        </button>
        
        <!-- Título ZENIX (apenas desktop, sempre visível) -->
        <div v-if="!isMobile" class="header-brand-text">
          <span class="text-white font-bold text-xl">ZEN</span>
          <span class="text-white font-bold text-xl">I</span>
          <span class="text-[#22C55E] font-bold text-xl">X</span>
        </div>
        
        <!-- Botão Grupo de Alunos (apenas desktop, sempre visível) -->
        <a 
          v-if="!isMobile"
          href="#" 
          class="header-whatsapp-button bg-transparent hover:bg-[#0E0E0E] text-[#A1A1A1] hover:text-[#25D366] font-medium px-3 py-1.5 rounded-lg text-xs inline-flex items-center space-x-2 transition-all duration-200 border border-[#1C1C1C] hover:border-[#25D366]/30"
        >
          <i class="fa-brands fa-whatsapp text-xs"></i>
          <span>Grupo de Alunos</span>
        </a>
      </div>
      <div class="flex items-center space-x-6 pr-6">
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
                @click.prevent="switchAccount"
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

    <!-- Mobile Layout -->
    <div class="h-full px-4 flex items-center justify-between mobile-nav">
      <!-- Menu Hambúrguer -->
      <button 
        @click="toggleMobileSidebar"
        class="mobile-menu-btn"
        type="button"
      >
        <i class="fas fa-bars text-[#22C55E] text-xl"></i>
      </button>
      
      <!-- Logo ZENIX -->
      <div class="mobile-logo">
        <span class="text-white font-bold text-xl">ZEN</span>
        <span class="text-white font-bold text-xl">I</span>
        <span class="text-[#22C55E] font-bold text-xl">X</span>
      </div>
      
      <!-- Perfil -->
      <div class="relative">
        <button 
          @click="toggleProfileModal" 
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
      </div>
    </div>

    <!-- Modal do Perfil Mobile -->
    <div 
      v-if="showProfileModal" 
      class="profile-modal-overlay"
      @click.self="closeProfileModal"
    >
      <div class="profile-modal-container">
        <div class="p-6 border-b border-[#1C1C1C] flex items-center justify-between">
          <h2 class="text-xl font-semibold text-[#DFDFDF]">Perfil</h2>
          <button 
            @click="closeProfileModal"
            class="text-[#7A7A7A] hover:text-[#DFDFDF] transition-colors"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Informações do Usuário -->
          <div class="flex items-center space-x-4 pb-4 border-b border-[#1C1C1C]">
            <div class="w-16 h-16 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center overflow-hidden">
              <img 
                v-if="userProfilePicture" 
                :src="userProfilePicture" 
                :alt="userName"
                class="w-full h-full object-cover rounded-full"
              />
              <span v-else class="text-white font-semibold text-lg">{{ userInitials }}</span>
            </div>
            <div>
              <p class="text-base font-semibold text-[#DFDFDF]">{{ userName }}</p>
              <p class="text-sm text-[#7A7A7A]">{{ userEmail }}</p>
            </div>
          </div>

          <!-- Saldo -->
          <div class="bg-[#0E0E0E] border border-[#1C1C1C] rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-[#7A7A7A]">Saldo</p>
              <button 
                @click="toggleBalance" 
                class="text-[#7A7A7A] hover:text-[#DFDFDF] transition-colors"
                type="button"
              >
                <i v-if="balanceHidden" class="fas fa-eye-slash text-sm"></i>
                <i v-else class="fas fa-eye text-sm"></i>
              </button>
            </div>
            <p class="text-2xl font-bold text-[#DFDFDF]">
              {{ balanceHidden ? '••••••' : formattedBalance }}
            </p>
          </div>

          <!-- Botão Depositar -->
          <button 
            @click="openDepositFlowFromModal" 
            class="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold px-5 py-3 rounded-lg text-base inline-flex items-center justify-center space-x-2 transition-all duration-200 shadow-[0_2px_8px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
          >
            <i class="fas fa-plus text-sm"></i>
            <span>Depositar</span>
          </button>

          <!-- Outras opções -->
          <div class="pt-4 border-t border-[#1C1C1C] space-y-2">
            <a 
              href="#" 
              @click.prevent="switchAccountFromModal"
              class="block px-4 py-2.5 text-sm text-[#DFDFDF] hover:bg-[#0B0B0B] hover:text-[#22C55E] transition-colors rounded-lg"
            >
              <i class="fas fa-exchange-alt text-xs mr-3 text-[#7A7A7A]"></i>
              Trocar de Conta
            </a>
            <a 
              href="#" 
              @click.prevent="goToSettings"
              class="block px-4 py-2.5 text-sm text-[#DFDFDF] hover:bg-[#0B0B0B] hover:text-[#22C55E] transition-colors rounded-lg"
            >
              <i class="fas fa-cog text-xs mr-3 text-[#7A7A7A]"></i>
              Configurações
            </a>
            <a 
              href="#" 
              @click.prevent="disconnectAccountFromModal" 
              class="block px-4 py-2.5 text-sm text-[#DFDFDF] hover:bg-[#0B0B0B] hover:text-[#22C55E] transition-colors rounded-lg"
            >
              <i class="fas fa-plug text-xs mr-3 text-[#7A7A7A]"></i>
              Sair da Corretora
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Contas -->
    <div 
      v-if="showAccountModal" 
      class="account-modal-overlay"
      @click.self="closeAccountModal"
    >
      <div class="account-modal-container">
        <div class="p-6 border-b border-[#1C1C1C] flex items-center justify-between">
          <h2 class="text-xl font-semibold text-[#DFDFDF]">Selecionar Conta</h2>
          <button 
            @click="closeAccountModal"
            class="text-[#7A7A7A] hover:text-[#DFDFDF] transition-colors"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        
        <div class="overflow-y-auto flex-1 p-6">
          <div v-if="loadingAccounts" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#22C55E] mb-4"></div>
              <p class="text-[#A1A1A1]">Carregando contas...</p>
            </div>
          </div>
          
          <div v-else-if="availableAccounts.length === 0" class="text-center py-12">
            <i class="fas fa-exclamation-circle text-[#7A7A7A] text-4xl mb-4"></i>
            <p class="text-[#A1A1A1]">Nenhuma conta disponível</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="account in availableAccounts" 
              :key="account.loginid"
              @click="selectAccount(account)"
              class="p-4 bg-[#0B0B0B] border border-[#1C1C1C] rounded-lg cursor-pointer hover:border-[#22C55E] hover:bg-[#0F0F0F] transition-all duration-200"
              :class="{ 'border-[#22C55E] bg-[#0F0F0F]': isCurrentAccount(account) }"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-sm font-semibold text-[#DFDFDF]">{{ account.loginid }}</span>
                    <span 
                      class="px-2 py-0.5 rounded text-xs font-medium"
                      :class="account.isDemo ? 'bg-[#333] text-[#A1A1A1]' : 'bg-[#22C55E]/20 text-[#22C55E]'"
                    >
                      {{ account.isDemo ? 'DEMO' : 'REAL' }}
                    </span>
                    <span class="text-xs text-[#7A7A7A]">{{ account.currency }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div>
                      <p class="text-xs text-[#7A7A7A] mb-1">Saldo</p>
                      <p class="text-base font-semibold text-[#DFDFDF]">
                        {{ formatBalance(account.balance || 0, account.currency) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div v-if="isCurrentAccount(account)" class="ml-4">
                  <i class="fas fa-check-circle text-[#22C55E] text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { loadAvailableAccounts } from '../utils/accountsLoader';

export default {
  name: 'TopNavbar',
  emits: ['toggle-sidebar', 'toggle-sidebar-collapse'],
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
      showProfileModal: false,
      userProfilePictureUrl: null,
      showAccountModal: false,
      loadingAccounts: false,
      availableAccounts: [],
      isMobile: false
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
    window.addEventListener('resize', this.checkMobile);
    this.checkMobile();
    this.loadUserProfilePicture();
    // Pré-carregar contas em background para uso futuro
    this.preloadAccounts();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('userProfileUpdated', this.handleProfileUpdate);
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024;
    },
    toggleSidebarCollapse() {
      this.$emit('toggle-sidebar-collapse');
    },
    toggleBalance() {
      this.balanceHidden = !this.balanceHidden;
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    toggleProfileModal() {
      this.showProfileModal = !this.showProfileModal;
    },
    closeProfileModal() {
      this.showProfileModal = false;
    },
    toggleMobileSidebar() {
      this.$emit('toggle-sidebar');
    },
    openDepositFlowFromModal() {
      this.closeProfileModal();
      this.openDepositFlow();
    },
    switchAccountFromModal() {
      this.closeProfileModal();
      this.switchAccount();
    },
    goToSettings() {
      this.closeProfileModal();
      this.$router.push('/settings');
    },
    disconnectAccountFromModal() {
      this.closeProfileModal();
      this.disconnectAccount();
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
    async switchAccount() {
      // Fecha o dropdown
      this.showProfileDropdown = false;
      
      // Abre o modal de seleção de contas
      this.showAccountModal = true;
      
      // Se já temos contas carregadas, usar elas (do cache ou carregamento anterior)
      if (this.availableAccounts.length > 0) {
        console.log('[TopNavbar] Usando contas já carregadas:', this.availableAccounts.length);
        return;
      }
      
      // Caso contrário, carregar as contas
      await this.loadAvailableAccounts();
    },
    async loadAvailableAccounts() {
      this.loadingAccounts = true;
      try {
        // Usar a função utilitária que já tem cache e otimizações
        const accounts = await loadAvailableAccounts();
        this.availableAccounts = accounts;
        console.log('[TopNavbar] Contas carregadas:', accounts.length);
      } catch (error) {
        console.error('[TopNavbar] Erro ao carregar contas:', error);
        this.availableAccounts = [];
      } finally {
        this.loadingAccounts = false;
      }
    },
    // Pré-carregar contas em background quando o componente é montado
    preloadAccounts() {
      // Verificar se já temos contas no cache
      const cachedAccounts = this.getCachedAccountsSync();
      if (cachedAccounts && cachedAccounts.length > 0) {
        this.availableAccounts = cachedAccounts;
        console.log('[TopNavbar] Contas pré-carregadas do cache:', cachedAccounts.length);
        return;
      }
      
      // Se não tiver cache, carregar em background sem bloquear a UI
      this.loadAvailableAccounts().catch(err => {
        console.warn('[TopNavbar] Erro ao pré-carregar contas em background:', err);
      });
    },
    // Obter contas do cache de forma síncrona (para uso imediato)
    getCachedAccountsSync() {
      try {
        const cachedStr = localStorage.getItem('deriv_available_accounts_cache');
        const timestampStr = localStorage.getItem('deriv_accounts_cache_timestamp');
        
        if (!cachedStr || !timestampStr) {
          return null;
        }

        const timestamp = parseInt(timestampStr);
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

        // Verificar se cache expirou
        if (now - timestamp > CACHE_DURATION) {
          return null;
        }

        return JSON.parse(cachedStr);
      } catch (error) {
        console.error('[TopNavbar] Erro ao ler cache de contas:', error);
        return null;
      }
    },
    isCurrentAccount(account) {
      const connectionStr = localStorage.getItem('deriv_connection');
      if (!connectionStr) return false;
      
      try {
        const connection = JSON.parse(connectionStr);
        return connection.loginid === account.loginid;
      } catch {
        return false;
      }
    },
    async selectAccount(account) {
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const token = localStorage.getItem('token');
        const appId = localStorage.getItem('deriv_app_id') || '1089';

        // Buscar informações completas da conta selecionada
        const response = await fetch(`${apiBase}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: account.token,
            appId: parseInt(appId),
            currency: account.currency
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Atualizar localStorage com a conta selecionada
          localStorage.setItem('deriv_token', account.token);
          localStorage.setItem('deriv_connection', JSON.stringify({
            ...data,
            loginid: account.loginid,
            currency: account.currency,
            isDemo: account.isDemo,
            timestamp: Date.now()
          }));

          // Emitir evento para atualizar o componente pai
          const accountType = account.isDemo ? 'demo' : 'real';
          this.$emit('account-type-changed', accountType);
          
          // Fechar modal e recarregar página para atualizar todos os componentes
          this.closeAccountModal();
          window.location.reload();
        } else {
          throw new Error('Erro ao selecionar conta');
        }
      } catch (error) {
        console.error('[TopNavbar] Erro ao selecionar conta:', error);
        alert('Erro ao trocar de conta. Tente novamente.');
      }
    },
    closeAccountModal() {
      this.showAccountModal = false;
      this.availableAccounts = [];
    },
    formatBalance(balance, currency) {
      const prefix = this.getCurrencyPrefix(currency);
      // Sempre mostrar o saldo, mesmo se for zero
      const value = parseFloat(balance) || 0;
      return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
  background: #0B0B0B !important;
  box-shadow: none;
  backdrop-filter: blur(12px);
  animation: fadeInSlide 0.35s ease-out;
  transition: left 0.3s ease, width 0.3s ease;
  border-bottom: none;
}

/* Mobile Header - Borda roxa no topo */
.mobile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #9333EA;
  z-index: 1;
}

/* Desktop e Mobile Layouts */
.desktop-nav {
  display: flex;
}

.mobile-nav {
  display: none;
}

.mobile-search-btn {
  width: 36px;
  height: 36px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  visibility: visible !important;
  opacity: 1 !important;
}

.mobile-search-btn i {
  font-size: 17px !important;
  color: rgba(255, 255, 255, 0.45) !important;
  transition: color 0.3s ease;
}

.mobile-search-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.mobile-search-btn:hover i {
  color: rgba(255, 255, 255, 0.8) !important;
}

.mobile-search-btn:active {
  transform: scale(0.95);
}

.mobile-logo {
  display: flex;
  align-items: center;
  font-family: sans-serif;
  font-weight: bold;
}

/* Modal do Perfil Mobile */
.profile-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

.profile-modal-container {
  background: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
  margin: auto;
}

/* Modal de Seleção de Contas */
.account-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

.account-modal-container {
  background: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  margin: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  #top-navbar {
    left: 0 !important;
    width: 100% !important;
    background: #0B0B0B !important;
    z-index: 1000 !important;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: flex;
    gap: 16px;
  }
  
  .toggle-menu-btn-header,
  .header-brand-text,
  .header-whatsapp-button {
    display: none !important;
  }

  .mobile-menu-btn,
  .mobile-search-btn {
    width: 36px !important;
    height: 36px !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    visibility: visible !important;
    opacity: 1 !important;
  }

  .mobile-search-btn i {
    font-size: 17px !important;
    color: rgba(255, 255, 255, 0.45) !important;
  }

  .mobile-search-btn:hover i {
    color: rgba(255, 255, 255, 0.8) !important;
  }

  .mobile-logo {
    flex: 1;
    justify-content: center;
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

/* Estilos para elementos do header quando sidebar está colapsada */
.toggle-menu-btn-header {
  background: transparent;
  border: none;
  color: #DFDFDF;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.toggle-menu-btn-header:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #22C55E;
}

.toggle-menu-btn-header i {
  font-size: 16px;
}

.header-brand-text {
  display: flex;
  align-items: center;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.header-whatsapp-button {
  text-decoration: none;
  white-space: nowrap;
}
</style>

