<template>
  <nav 
    id="top-navbar" 
    class="fixed top-0 left-0 w-full h-[60px] z-[1000]" 
    :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    :style="navStyle"
  >
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="h-full flex items-center justify-end desktop-nav">
      <div class="flex items-center space-x-6 pr-6">
        <button 
          @click="openDepositFlow" 
          class="bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold px-5 py-2 rounded-lg text-sm inline-flex items-center space-x-2 transition-all duration-200 shadow-[0_2px_8px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
        >
          <i class="fas fa-plus text-xs"></i>
          <span>Depositar Agora</span>
        </button>
        <div class="flex items-center space-x-3">
          <span id="balanceDisplay" class="text-sm font-medium text-[#DFDFDF] inline-flex items-center gap-2">
            <span>Saldo:</span>
            <span v-if="isBalanceReady && !balanceHidden" class="inline-flex items-center gap-1.5 animate-fadeIn">
              <span v-if="uiAccountType !== 'demo' || showDollarSign">
                {{ isFictitiousBalanceActive ? '$' : currencyPrefix }}
              </span>
              <span v-else>Đ</span>
              {{ formattedBalance }}
            </span>
            <span v-else>••••••</span>
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
        <!-- Botão de Notificação -->
        <div class="relative">
          <button 
            @click="toggleNotifications" 
            class="w-9 h-9 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center cursor-pointer hover:border-[#22C55E] hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all duration-200 relative"
            type="button"
          >
            <i class="fas fa-bell text-[#DFDFDF] text-sm"></i>
            <span 
              v-if="hasUnreadNotifications" 
              class="absolute top-0 right-0 w-2 h-2 bg-[#22C55E] rounded-full border border-[#0E0E0E]"
            ></span>
          </button>
        </div>
        <div class="relative">
          <button 
            @click="handleProfileClick" 
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
    </div>

    <!-- Mobile Layout -->
    <div v-if="isMobile" class="h-full px-4 flex items-center justify-between mobile-nav">
      <!-- Menu Hambúrguer -->
      <button 
        @click="toggleMobileSidebar"
        class="mobile-menu-btn"
        type="button"
      >
        <i class="fas fa-bars text-[#22C55E] text-xl"></i>
      </button>
      
      <!-- Logo ZENIX -->
      <div class="mobile-logo flex-shrink-0">
        <span class="text-white font-bold text-xl">ZEN</span>
        <span class="text-white font-bold text-xl">I</span>
        <span class="text-[#22C55E] font-bold text-xl">X</span>
      </div>

      
      <div class="flex items-center gap-2">
        <!-- Botão de Notificação (Mobile) -->
        <div class="relative">
          <button 
            @click="toggleNotifications" 
            class="w-8 h-8 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center cursor-pointer hover:border-[#22C55E] transition-all duration-200 relative"
            type="button"
          >
            <i class="fas fa-bell text-[#DFDFDF] text-xs"></i>
            <span 
              v-if="hasUnreadNotifications" 
              class="absolute top-0 right-0 w-1.5 h-1.5 bg-[#22C55E] rounded-full border border-[#0E0E0E]"
            ></span>
          </button>
        </div>
        
        <!-- Perfil -->
        <div class="relative">
          <button 
            @click="handleProfileClick" 
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
    </div>

    <!-- Modal de Notificações -->
    <div 
      v-if="showNotificationsModal" 
      class="notifications-modal-overlay"
      @click.self="closeNotificationsModal"
    >
      <div class="notifications-modal-content">
        <div class="notifications-modal-header">
          <h2 class="notifications-modal-title">Notificações</h2>
          <button 
            @click="closeNotificationsModal"
            class="notifications-modal-close"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notifications-modal-body">
          <div v-if="notifications.length === 0" class="notifications-empty">
            <i class="fas fa-bell-slash text-[48px] text-white/20 mb-4"></i>
            <p class="text-white/40 text-[14px]">Nenhuma notificação</p>
          </div>
          <div v-else class="notifications-list">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              class="notification-item"
            >
              <div class="notification-icon">
                <i :class="notification.icon || 'fa-solid fa-info-circle'"></i>
              </div>
              <div class="notification-content">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ formatNotificationDate(notification.date) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="notifications.length > 0" class="notifications-modal-footer">
          <button 
            @click="clearNotifications" 
            class="w-full flex items-center justify-center gap-2 py-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-[#EF4444]/20"
          >
            <i class="fas fa-trash"></i>
            <span>Excluir Notificações</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Seleção de Contas -->
    <div 
      v-if="showAccountModal" 
      class="account-modal-overlay"
      @click.self="closeAccountModal"
    >
      <div class="account-modal-container" style="max-width: 600px; margin: 0 auto;">
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
                    <span class="text-sm font-semibold text-[#DFDFDF]">{{ getAccountDisplayName(account) }}</span>
                    <span 
                      class="px-2 py-0.5 rounded text-xs font-medium"
                      :class="(account.isDemo && isFictitiousBalanceActive) ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : (account.isDemo ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#F59E0B]/20 text-[#F59E0B]')"
                    >
                      {{ (account.isDemo && isFictitiousBalanceActive) ? 'REAL' : (account.isDemo ? 'DEMO' : 'REAL') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div>
                      <p class="text-xs text-[#7A7A7A] mb-1">Saldo</p>
                      <p class="text-base font-semibold text-[#DFDFDF] inline-flex items-center gap-1.5">
                        <img 
                          v-if="!account.isDemo && getCurrencyIcon(account.currency, 'real')" 
                          :src="getCurrencyIcon(account.currency, 'real')" 
                          :alt="account.currency"
                          class="w-5 h-5 rounded-full object-cover"
                        />
                        <span v-if="account.isDemo && !isFictitiousBalanceActive">Đ</span>
                        <span v-else>$</span>
                        {{ formatBalance(account.balance || 0, account.isDemo) }}
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
export default {
  name: 'TopNavbar',
  emits: ['toggle-sidebar', 'toggle-sidebar-collapse', 'open-settings'],
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      default: false
    },
    isDashboard: {
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
      balanceHidden: localStorage.getItem('balanceVisible') === 'false', // Invertido: balanceHidden = !balanceVisible
      showProfileDropdown: false,
      showProfileModal: false,
      userProfilePictureUrl: null,
      showAccountModal: false,
      loadingAccounts: false,
      availableAccounts: [],
      isMobile: false,
      hasUnreadNotifications: false,
      showNotificationsModal: false,
      notifications: [],
      // Master Trader Settings
      isFictitiousBalanceActive: false,
      fictitiousBalance: 0,
      showDollarSign: false,
      isBalanceReady: false,
      
      // Novas colunas do banco de dados para contas
      tokenReal: null,
      tokenRealCurrency: 'USD',
      realAmount: 0,
      tokenDemo: null,
      tokenDemoCurrency: 'USD',
      demoAmount: 0,
            
      // Configuração Grupo de Alunos - MOVIDO PARA SIDEBAR
      // studentGroupConfig removido daqui
      renderedBalance: 0
    }
  },
  computed: {
    uiAccountType() {
      // Se saldo fictício estiver ativo, mascarar como 'real'
      if (this.isFictitiousBalanceActive) {
        return 'real';
      }
      return this.accountType || 'real';
    },
    formattedBalance() {
      // Usar renderedBalance para exibição estável
      const value = this.renderedBalance;

      // Determinar decimais
      const currency = this.currency || 'USD';
      const isCrypto = ['BTC', 'ETH', 'LTC', 'USDC', 'UST'].includes(currency.toUpperCase()) || this.currencyPrefix === '₿';
      const decimals = isCrypto ? (currency === 'BTC' ? 8 : 4) : 2;

      // Formatar (sem prefixo aqui, pois o prefixo está no template)
      return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },
    balanceNumeric() {
      // Prioridade 0: Fallback para o prop 'balance' (Sincronização em tempo real para IA/Monitoramento)
      // Se o prop balance for passado e for diferente de zero, usá-lo como fonte de verdade absoluta
      const raw = this.balance;
      let propValue = 0;
      if (typeof raw === 'number') propValue = raw;
      else if (typeof raw === 'string') {
        const parsed = Number(raw);
        propValue = isNaN(parsed) ? 0 : parsed;
      } else if (raw !== null && raw !== undefined) {
        const val = raw?.value ?? raw?.balance ?? 0;
        const num = Number(val);
        propValue = isNaN(num) ? 0 : num;
      }

      if (propValue > 0) return propValue;

      // Prioridade 1: Saldo Demo + Fictício se ativo E conta for demo
      if (this.accountType === 'demo') {
        const demoBalance = this.balancesByCurrencyDemo['USD'] || 0;
        if (this.isFictitiousBalanceActive) {
          return Number(demoBalance) + (Number(this.fictitiousBalance) || 0);
        }
        return Number(demoBalance);
      }

      // Prioridade 2: Saldo Real (USD preferencial)
      const usdReal = this.balancesByCurrencyReal['USD'];
      if (usdReal !== undefined && usdReal !== null && Number(usdReal) > 0) {
        return Number(usdReal);
      }

      // Prioridade 2: Qualquer moeda que tenha saldo > 0
      for (const balance of Object.values(this.balancesByCurrencyReal)) {
        if (Number(balance) > 0) return Number(balance);
      }

      return propValue; // Retorna o valor do prop mesmo se for 0, se chegarmos aqui
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
    },
    navStyle() {
      return {
        background: this.isDashboard ? '#000000 !important' : 'rgba(11, 11, 11, 0.8) !important',
        backdropFilter: 'blur(20px)',
        webkitBackdropFilter: 'blur(20px)',
        padding: '0',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        borderBottom: 'none'
      }
    }
  },
  watch: {
    balanceNumeric: {
      immediate: true,
      handler(newVal) {
        this.tryUpdateRenderedBalance(newVal);
      }
    },
    isBalanceReady(ready) {
      if (ready) {
        this.tryUpdateRenderedBalance(this.balanceNumeric);
      }
    }
  },
  async mounted() {
    // Inicializar renderedBalance
    this.tryUpdateRenderedBalance(this.balanceNumeric);

    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('userProfileUpdated', this.handleProfileUpdate);
    window.addEventListener('resize', this.checkMobile);
    this.checkMobile();
    this.loadUserProfilePicture();
    this.loadLoginNotifications();
    window.addEventListener('masterTraderSettingsUpdated', this.handleMasterTraderSettingsUpdate);
    window.addEventListener('fictitiousBalanceChanged', this.handleFictitiousBalanceChange);
    
    // Carregar configurações antes de liberar o saldo
    await this.loadMasterTraderSettings();
    await this.loadMasterTraderSettings();
    // await this.loadStudentGroupConfig(); // Movido para Sidebar

    // Delay de segurança: 200ms para conta fictícia (conforme solicitado), 300ms para contas normais
    const delayTime = this.isFictitiousBalanceActive ? 200 : 300;
    
    setTimeout(() => {
      this.isBalanceReady = true;
    }, delayTime);
  },
  beforeUnmount() {
    window.removeEventListener('masterTraderSettingsUpdated', this.handleMasterTraderSettingsUpdate);
    window.removeEventListener('fictitiousBalanceChanged', this.handleFictitiousBalanceChange);
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('userProfileUpdated', this.handleProfileUpdate);
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    tryUpdateRenderedBalance(val) {
      if (this.isFictitiousBalanceActive && val === this.fictitiousBalance) {
          const hasDemoBalance = this.balancesByCurrencyDemo && Object.keys(this.balancesByCurrencyDemo).length > 0;
          if (!hasDemoBalance) return;
      }
      if (this.isBalanceReady) {
        this.renderedBalance = val;
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024;
    },
    toggleSidebarCollapse() {
      this.$emit('toggle-sidebar-collapse');
    },
    toggleBalance() {
      this.balanceHidden = !this.balanceHidden;
      // Inverter para balanceVisible no localStorage
      localStorage.setItem('balanceVisible', (!this.balanceHidden).toString());
    },
    toggleNotifications() {
      this.showNotificationsModal = !this.showNotificationsModal;
    },
    closeNotificationsModal() {
      this.showNotificationsModal = false;
    },
    async clearNotifications() {
      // Solução persistente no frontend: salvar timestamp da limpeza
      const timestamp = Date.now();
      localStorage.setItem('zenix_notifications_cleared_at', timestamp);
      
      this.notifications = [];
      this.hasUnreadNotifications = false;
      
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const token = localStorage.getItem('token');
        
        fetch(`${apiBase}/notifications/clear`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {});
      } catch (error) {
        console.error('[TopNavbar] Erro ao limpar notificações:', error);
      }
    },
    formatNotificationDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    /**
     * Retorna nome amigável da conta baseado no tipo e moeda
     * Ex: "Conta Demo (USD)" ou "Conta Real (USD)"
     */
    getAccountDisplayName(account) {
      if (!account) return 'Conta';
      
      const type = account.isDemo ? 'Demo' : 'Real';
      const currency = account.currency || 'USD';
      
      if (account.isDemo && this.isFictitiousBalanceActive) {
        return `Conta Real (${currency})`;
      }
      
      return `Conta ${type} (${currency})`;
    },
    handleProfileClick() {
      // Redirect directly to settings modal
      this.onSettingsClick();
    },
    onSettingsClick() {
      // Emit event to open modal
      this.$emit('open-settings');
      this.showProfileDropdown = false;
      
      // Fallback: if we are not on an admin page (where the modal is handled),
      // we might want to still navigate. But for now, let's assume the modal
      // is the preferred way if handled, or the user can use the sidebar to navigate.
      // Actually, many common layouts use the modal for quick settings.
      
      // If we want to maintain navigation as fallback:
      /*
      if (!this.$listeners['open-settings']) {
        this.$router.push('/settings');
      }
      */
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
    toggleMobileSidebar() {
      this.$emit('toggle-sidebar');
    },
    handleClickOutside(event) {
      const dropdown = document.getElementById('profileDropdown');
      const dropdownMobile = document.getElementById('profileDropdownMobile');
      const button = event.target.closest('button');
      if (dropdown && !dropdown.contains(event.target) && !button?.closest('.relative')) {
        this.showProfileDropdown = false;
      }
      if (dropdownMobile && !dropdownMobile.contains(event.target) && !button?.closest('.relative')) {
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
      // Redirecionamento para a Academy - Aula 2
      this.$router.push({ 
        name: 'CourseDetail', 
        params: { id: '25054bef-4f7c-4388-b22a-f01374671da3' },
        query: { lesson: '2' }
      });
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
      await this.loadAvailableAccounts();
    },
    async loadAvailableAccounts() {
      this.loadingAccounts = true;
      try {
        console.log('[TopNavbar] Populando contas via dados do banco...');
        
        const accounts = [];
        
        // Adicionar Conta Real se existir token
        if (this.tokenReal) {
          accounts.push({
            loginid: 'REAL_ACC',
            token: this.tokenReal,
            isDemo: false,
            balance: parseFloat(this.realAmount) || 0,
            currency: this.tokenRealCurrency || 'USD'
          });
        }
        
        // Adicionar Conta Demo se existir token
        if (this.tokenDemo) {
          accounts.push({
            loginid: 'DEMO_ACC',
            token: this.tokenDemo,
            isDemo: true,
            balance: parseFloat(this.demoAmount) || 0,
            currency: this.tokenDemoCurrency || 'USD'
          });
        }
        
        if (accounts.length > 0) {
          this.availableAccounts = accounts;
          this.loadingAccounts = false;
          return;
        }

        // Fallback para lógica legada se não houver dados no banco
        console.warn('[TopNavbar] Nenhum dado no banco, usando fallback legado');

        // Buscar informações de cada conta
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const token = localStorage.getItem('token');
        const appId = localStorage.getItem('deriv_app_id') || '1089';

        // ✅ ZENIX v3.5: Buscar tokens do localStorage
        const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
        if (!tokensByLoginIdStr) {
          this.loadingAccounts = false;
          return;
        }
        
        let tokensByLoginId = {};
        try {
          tokensByLoginId = JSON.parse(tokensByLoginIdStr);
        } catch (e) {
          console.error('[TopNavbar] Erro ao parsear tokensByLoginId:', e);
          this.loadingAccounts = false;
          return;
        }

        const loginIds = Object.keys(tokensByLoginId);

        for (const loginid of loginIds) {
          try {
            const accountToken = tokensByLoginId[loginid];
            
            // Buscar informações da conta
            const response = await fetch(`${apiBase}/broker/deriv/status`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                token: accountToken,
                appId: parseInt(appId)
              })
            });

            if (response.ok) {
              const data = await response.json();
              
              console.log(`[TopNavbar] Dados recebidos para conta ${loginid}:`, data);
              
              // Buscar informações específicas da conta pelo loginid
              let balance = 0;
              let currency = 'USD';
              let isDemo = false;
              let accountFound = false;
              
              // Tentar buscar da estrutura accountsByCurrency primeiro (estrutura principal)
              if (data.accountsByCurrency && typeof data.accountsByCurrency === 'object') {
                for (const curr in data.accountsByCurrency) {
                  const accountList = data.accountsByCurrency[curr];
                  if (Array.isArray(accountList)) {
                    const account = accountList.find(acc => acc.loginid === loginid);
                    if (account) {
                      balance = parseFloat(account.value) || 0;
                      currency = curr.toUpperCase();
                      isDemo = account.isDemo || false;
                      accountFound = true;
                      console.log(`[TopNavbar] Conta encontrada em accountsByCurrency:`, { loginid, balance, currency, isDemo });
                      break;
                    }
                  }
                }
              }
              
              // Se não encontrou em accountsByCurrency, tentar buscar do raw.accounts
              if (!accountFound && data.raw && data.raw.accounts && data.raw.accounts[loginid]) {
                const accountData = data.raw.accounts[loginid];
                currency = (accountData.currency || 'USD').toUpperCase();
                // Usar converted_amount se disponível, senão balance
                balance = accountData.converted_amount !== null && accountData.converted_amount !== undefined
                  ? parseFloat(accountData.converted_amount) || 0
                  : parseFloat(accountData.balance || 0);
                isDemo = accountData.demo_account === 1 || accountData.demo_account === true;
                accountFound = true;
                console.log(`[TopNavbar] Conta encontrada em raw.accounts:`, { loginid, balance, currency, isDemo });
              }
              
              // Se ainda não encontrou, usar fallback com saldos agregados
              if (!accountFound) {
                // Determinar se é demo baseado no loginid
                isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT');
                
                // Buscar saldo agregado por moeda (pode ser que a conta específica não esteja disponível)
                if (isDemo && data.balancesByCurrencyDemo) {
                  const currencies = Object.keys(data.balancesByCurrencyDemo);
                  if (currencies.length > 0) {
                    currency = currencies[0];
                    balance = parseFloat(data.balancesByCurrencyDemo[currency]) || 0;
                  }
                } else if (!isDemo && data.balancesByCurrencyReal) {
                  const currencies = Object.keys(data.balancesByCurrencyReal);
                  if (currencies.length > 0) {
                    currency = currencies[0];
                    balance = parseFloat(data.balancesByCurrencyReal[currency]) || 0;
                  }
                } else if (data.balance) {
                  // Último fallback: usar balance geral
                  balance = typeof data.balance === 'object' ? (parseFloat(data.balance.value) || 0) : (parseFloat(data.balance) || 0);
                  currency = data.currency || (data.balance?.currency || 'USD');
                }
                
                console.log(`[TopNavbar] Usando fallback para conta ${loginid}:`, { balance, currency, isDemo });
              }
              
              // Garantir que sempre temos valores válidos
              balance = parseFloat(balance) || 0;
              currency = (currency || 'USD').toUpperCase();
              
              // Confirmar se é demo baseado no loginid (sobrescrever se necessário)
              if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
                isDemo = true;
              }

              console.log(`[TopNavbar] Conta final:`, { loginid, balance, currency, isDemo });

              accounts.push({
                loginid,
                token: accountToken,
                isDemo,
                balance: balance, // Sempre mostrar o valor real, mesmo se for 0.00
                currency: currency
              });
            }
          } catch (error) {
            console.error(`[TopNavbar] Erro ao buscar conta ${loginid}:`, error);
          }
        }

        // Ordenar: contas reais primeiro, depois demo
        accounts.sort((a, b) => {
          if (a.isDemo === b.isDemo) return 0;
          return a.isDemo ? 1 : -1;
        });

        this.availableAccounts = accounts;
      } catch (error) {
        console.error('[TopNavbar] Erro ao carregar contas:', error);
        this.availableAccounts = [];
      } finally {
        this.loadingAccounts = false;
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
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
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

          // ✅ Determinar Active Context baseado na rota atual
          let activeContext = 'all';
          const currentPath = this.$route.path;
          console.log(`[TopNavbar] 🔍 Detectando contexto - Path atual: ${currentPath}`);
          
          // Verificar se está em páginas de IA (StatsIAs, InvestmentIA, copy-trading)
          if (currentPath.includes('StatsIAs') || 
              currentPath.includes('Investment') || 
              currentPath.includes('copy-trading')) {
             activeContext = 'ai';
          } 
          // Verificar se está em páginas do Agente Autônomo (agente-autonomo)
          else if (currentPath.includes('agente-autonomo')) {
             activeContext = 'agent';
          }

          console.log(`[TopNavbar] Trocando conta. Contexto ativo detectado: ${activeContext}`);

          try {
            const saveTokenResponse = await fetch(`${apiBase}/settings/deriv-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                token: account.token,
                tradeCurrency: account.isDemo ? 'DEMO' : (account.currency || 'USD'),
                activeContext: activeContext // ✅ Enviar contexto para o backend
              })
            });

            if (saveTokenResponse.ok) {
              console.log('[TopNavbar] ✅ Token da conta selecionada salvo no banco de dados');
            } else {
              console.warn('[TopNavbar] ⚠️ Erro ao salvar token no banco, mas continuando...');
            }
          } catch (saveError) {
            console.error('[TopNavbar] ❌ Erro ao salvar token no banco:', saveError);
            // Continuar mesmo se falhar ao salvar no banco
          }

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
        await alert('Erro ao trocar de conta. Tente novamente.');
      }
    },
    closeAccountModal() {
      this.showAccountModal = false;
      this.availableAccounts = [];
    },
    formatBalance(balance, isDemo = false) {
      // Retorna apenas o valor numérico formatado (sem prefixo, pois o símbolo é adicionado no template)
      let value = parseFloat(balance) || 0;
      if (isDemo && this.isFictitiousBalanceActive) {
        value += this.fictitiousBalance;
      }
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    getCurrencyPrefix(currency, isDemo = false) {
      // Se for demo, retornar vazio (o D será renderizado via CSS)
      if (isDemo) {
        return '';
      }
      // Para real, retornar símbolo padrão da moeda
      switch ((currency || '').toUpperCase()) {
        case 'USD':
          return '$'
        case 'EUR':
          return '€'
        case 'BTC':
          return '₿'
        default:
          return currency ? `${currency} ` : '$'
      }
    },
    getCurrencyIcon(currency, accountType) {
      // Retorna o ícone da moeda baseado no tipo de conta
      const isDemo = accountType === 'demo';
      const curr = (currency || 'USD').toUpperCase();
      
      // Para demo, não mostrar ícone
      if (isDemo) {
        return null;
      }
      
      // Para real, retornar ícone baseado na moeda
      if (curr === 'USD') {
        // Bandeira dos EUA - usando SVG inline
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='15' viewBox='0 0 20 15'%3E%3Crect width='20' height='15' fill='%23BD0023'/%3E%3Cpath d='M0 3h20M0 6h20M0 9h20M0 12h20' stroke='%23fff' stroke-width='2'/%3E%3Crect width='8' height='8' fill='%2300007F'/%3E%3C/svg%3E";
      } else if (curr === 'USDT') {
        // Logo do USDT (Tether) - usando SVG inline
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%2326A378'/%3E%3Ctext x='10' y='15' font-size='12' font-weight='bold' fill='white' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E";
      }
      
      return null;
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
    },
    async loadLoginNotifications() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        // ✅ OTIMIZADO: Adicionar timeout e AbortController para evitar requisições travadas
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout
        
        const res = await fetch(`${apiBaseUrl}/notifications/login-summary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal // ✅ Adicionar signal para permitir cancelamento
        });
        
        clearTimeout(timeoutId); // ✅ Limpar timeout se a requisição completar

        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length > 0) {
            // Pegar timestamp da última limpeza
            const clearedAt = parseInt(localStorage.getItem('zenix_notifications_cleared_at') || '0');
            
            // Filtrar apenas notificações mais recentes que a limpeza
            const filtered = data.notifications.filter(notif => {
              const notifDate = new Date(notif.timestamp).getTime();
              return notifDate > clearedAt;
            });

            // Converter as notificações do backend para o formato esperado pelo frontend
            const formattedNotifications = filtered.map((notif, index) => {
              // Limpar emojis/ícones do início do título
              const cleanTitle = notif.title.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')
                                          .replace(/^[^a-zA-Z0-9À-ÿ\s]+\s*/, '');
              
              return {
                id: `login-notif-${index}`,
                title: cleanTitle,
                message: notif.message,
                icon: this.getNotificationIcon(notif.type),
                date: notif.timestamp,
                type: notif.type
              };
            });

            // Adicionar às notificações existentes
            this.notifications = [...formattedNotifications];
            
            // Se houver notificações, mostrar o indicador
            if (this.notifications.length > 0) {
              this.hasUnreadNotifications = true;
            } else {
              this.hasUnreadNotifications = false;
            }
          }
        } else {
          // ✅ Se a resposta não foi OK, logar mas não travar
          console.warn(`[TopNavbar] Resposta não OK para login-summary: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        // ✅ Tratar erro de abort (timeout) de forma específica
        if (error.name === 'AbortError') {
          console.warn('[TopNavbar] ⏱️ Requisição login-summary cancelada por timeout (8s)');
        } else {
          console.error('[TopNavbar] Erro ao carregar notificações de login:', error);
        }
      }
    },
    getNotificationIcon(type) {
      const iconMap = {
        'success': 'fa-solid fa-check-circle',
        'warning': 'fa-solid fa-exclamation-triangle',
        'error': 'fa-solid fa-times-circle',
        'info': 'fa-solid fa-info-circle'
      };
      return iconMap[type] || 'fa-solid fa-info-circle';
    },
    async loadMasterTraderSettings() {
      try {
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
          if (data.isFictitiousBalanceActive !== undefined) this.isFictitiousBalanceActive = data.isFictitiousBalanceActive;
          if (data.fictitiousBalance !== undefined) this.fictitiousBalance = parseFloat(data.fictitiousBalance);
          if (data.showDollarSign !== undefined) this.showDollarSign = data.showDollarSign;
          
          // Atualizar dados de conta do banco
          this.tokenReal = data.tokenReal;
          this.tokenRealCurrency = data.tokenRealCurrency;
          this.realAmount = data.realAmount;
          this.tokenDemo = data.tokenDemo;
          this.tokenDemoCurrency = data.tokenDemoCurrency;
          this.demoAmount = data.demoAmount;
        }
      } catch (error) {
        console.error('[TopNavbar] Erro ao carregar configurações de Master Trader:', error);
      }
    },
    handleMasterTraderSettingsUpdate(event) {
      const settings = event.detail;
      if (settings) {
        this.fictitiousBalance = settings.fictitiousBalance;
        this.isFictitiousBalanceActive = settings.isFictitiousBalanceActive;
        this.showDollarSign = settings.showDollarSign;
      }
    },
    handleFictitiousBalanceChange(event) {
      const { enabled, amount } = event.detail;
      this.isFictitiousBalanceActive = enabled;
      this.fictitiousBalance = amount;
      console.log('[TopNavbar] Saldo fictício atualizado:', { enabled, amount });
    },
    // resolveImageUrl removido pois era usado apenas pelo studentGroupConfig
  }
}
</script>

<style scoped>
/* Top Navbar Styles */
#top-navbar {
  /* The base styles are now handled by navStyle computed property */
  animation: fadeInSlide 0.35s ease-out;
  transition: left 0.3s ease, width 0.3s ease;
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

/* Modal de Notificações */
.notifications-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
  height: 100vh;
}

.notifications-modal-content {
  background: #0B0B0B;
  border-radius: 0;
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(255, 255, 255, 0.05);
  animation: slideInRight 0.3s ease-out;
}

.notifications-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: none;
}

.notifications-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.notifications-modal-close {
  background: none;
  border: none;
  color: #9B9B9B;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.notifications-modal-close:hover {
  color: #fff;
}

.notifications-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  color: #FFFFFF;
}

.notifications-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.notification-item:hover {
  background: #1F1F1F;
  border-color: rgba(255, 255, 255, 0.1);
}

.notification-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 10px;
  color: #22C55E;
  font-size: 18px;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left !important;
  justify-content: flex-start !important;
}

.notification-title {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  text-align: left !important;
}

.notification-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
  text-align: left !important;
}

.notification-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  font-size: 11px;
  margin-top: 4px;
  text-align: left !important;
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

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 1024px) {
  #top-navbar {
    left: 0 !important;
    width: 100% !important;
    background: #0B0B0B !important;
    z-index: 1002 !important;
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

/* Símbolo D estilizado para Demo */
.demo-currency-symbol-navbar-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
  width: 16px;
  height: 16px;
}

.demo-currency-symbol-navbar-icon {
  width: 16px;
  height: 16px;
  filter: blur(0.5px);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.demo-currency-symbol-account-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
  width: 16px;
  height: 16px;
}

.demo-currency-symbol-account-icon {
  width: 16px;
  height: 16px;
  filter: blur(0.5px);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.notifications-modal-footer {
  padding: 16px 24px;
  border-top: none;
  display: flex;
  justify-content: flex-end;
  background: #0B0B0B;
  flex-shrink: 0;
}

.clear-notifications-btn {
  margin: auto;
  background: transparent;
  color: #EF4444;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 10px 20px;
  border: 1px solid #EF4444 !important;
  border-radius: 12px;
}

.clear-notifications-btn:hover:not(:disabled) {
  color: #DC2626;
  text-decoration: underline;
}

.clear-notifications-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #EF4444;
}
</style>
