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
        <router-link 
          v-if="!isMobile" 
          to="/dashboard" 
          class="header-brand-text cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span class="text-white font-bold text-xl">ZEN</span>
          <span class="text-white font-bold text-xl">I</span>
          <span class="text-[#22C55E] font-bold text-xl">X</span>
        </router-link>
        
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
      <div class="flex items-center space-x-6 pr-0.5">
        <button 
          @click="openDepositFlow" 
          class="bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold px-5 py-2 rounded-lg text-sm inline-flex items-center space-x-2 transition-all duration-200 shadow-[0_2px_8px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
        >
          <i class="fas fa-plus text-xs"></i>
          <span>Depositar Agora</span>
        </button>
        <div class="flex items-center space-x-3">
          <span id="balanceDisplay" class="text-sm font-medium text-[#DFDFDF] inline-flex items-center">
            Saldo: 
            <span v-if="!balanceHidden" class="inline-flex items-center ml-1">
              <span v-if="currentAccountType === 'demo'" class="demo-currency-symbol-navbar">D</span>
              <span v-else>{{ navbarCurrencySymbol }}</span>
              {{ balanceHidden ? '' : navbarBalanceValue }}
            </span>
            <span v-else class="ml-1">••••••</span>
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
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleNotificationsModal" 
            class="text-white/45 hover:text-white/80 transition-colors w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95 relative"
            type="button"
          >
            <i class="fa-solid fa-bell text-[17px]"></i>
            <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>
          </button>
          <div class="relative">
            <button 
              @click="toggleProfileModal" 
              class="w-9 h-9 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center cursor-pointer hover:border-[#22C55E] hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all duration-200 overflow-hidden"
            >
              <img 
                v-if="userProfilePicture" 
                :src="userProfilePicture" 
                :alt="userName"
                class="w-full h-full object-cover rounded-full profile-img-border"
              />
              <span v-else class="text-white font-semibold text-sm">{{ userInitials }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="h-full px-4 flex items-center justify-between mobile-nav">
      <!-- Foto de Perfil (abre sidebar) -->
      <button 
        @click="toggleMobileSidebar"
        class="w-9 h-9 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center cursor-pointer hover:border-[#22C55E] hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all duration-200 overflow-hidden flex-shrink-0"
        type="button"
      >
        <img 
          v-if="userProfilePicture" 
          :src="userProfilePicture" 
          :alt="userName"
          class="w-full h-full object-cover rounded-full"
        />
        <span v-else class="text-white font-semibold text-sm">{{ userInitials }}</span>
      </button>
      
      <!-- Logo ZENIX -->
      <router-link 
        to="/dashboard" 
        class="mobile-logo cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span class="text-white font-bold text-xl">ZEN</span>
        <span class="text-white font-bold text-xl">I</span>
        <span class="text-[#22C55E] font-bold text-xl">X</span>
      </router-link>
      
      <!-- Botões de Ação (Notificações e Configurações) -->
      <div class="flex items-center space-x-2">
        <button 
          @click="toggleNotificationsModal" 
          class="text-white/45 hover:text-white/80 transition-colors w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95 relative flex-shrink-0"
          type="button"
        >
          <i class="fa-solid fa-bell text-[17px]"></i>
          <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>
        </button>
        <button 
          @click="toggleProfileModal" 
          class="w-9 h-9 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center cursor-pointer hover:border-[#22C55E] hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all duration-200 flex-shrink-0"
          type="button"
        >
          <i class="fas fa-cog text-[#DFDFDF] text-base"></i>
        </button>
      </div>
    </div>

    <!-- Modal de Configurações (Unificado para Desktop e Mobile) -->
    <div 
      v-if="showProfileModal" 
      class="settings-modal-overlay"
      @click.self="closeProfileModal"
    >
      <div class="settings-modal-content" @click.stop>
        <!-- Cabeçalho -->
        <div class="settings-modal-header">
          <h2 class="settings-modal-title">Configurações</h2>
          <button 
            @click="closeProfileModal"
            class="settings-modal-close"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="settings-modal-body">
          <div class="space-y-6">
            <!-- Informações do Usuário -->
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full bg-[#0E0E0E] border border-[#1C1C1C] flex items-center justify-center overflow-hidden flex-shrink-0">
                <img 
                  v-if="userProfilePicture" 
                  :src="userProfilePicture" 
                  :alt="userName"
                  class="w-full h-full object-cover rounded-full"
                />
                <span v-else class="text-white font-semibold text-lg">{{ userInitials }}</span>
              </div>
              <div class="flex-1 min-w-0 text-left">
                <p class="text-base font-semibold text-white text-left">{{ fullUserName }}</p>
                <p class="text-sm text-[#22C55E] font-medium text-left">Conta Ativa</p>
              </div>
            </div>

            <!-- Saldo Total -->
            <div class="bg-[#0E0E0E] border border-[#1C1C1C] rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <p class="text-sm text-[#7A7A7A]">Saldo Total</p>
                <button 
                  @click="toggleBalance" 
                  class="text-[#7A7A7A] hover:text-[#DFDFDF] transition-colors"
                  type="button"
                >
                  <i v-if="balanceHidden" class="fas fa-eye-slash text-sm"></i>
                  <i v-else class="fas fa-eye text-sm"></i>
                </button>
              </div>
              <p class="text-2xl font-bold text-white mb-4 text-left">
                <span v-if="!balanceHidden" class="inline-flex items-center">
                  <span v-if="currentAccountType === 'demo'" class="demo-currency-symbol">D</span>
                  <span v-else>{{ currencySymbol }}</span>
                  {{ balanceHidden ? '' : balanceValueFormatted }}
                </span>
                <span v-else>••••••</span>
              </p>
              <!-- Botões Real/Demo -->
              <div class="flex gap-2">
                <button
                  @click="switchAccountType('real')"
                  :class="currentAccountType === 'real' 
                    ? 'bg-[#22C55E] text-black' 
                    : 'bg-[#1C1C1C] text-[#7A7A7A] hover:bg-[#2A2A2A]'"
                  class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Real
                </button>
                <button
                  @click="switchAccountType('demo')"
                  :class="currentAccountType === 'demo' 
                    ? 'bg-[#22C55E] text-black' 
                    : 'bg-[#1C1C1C] text-[#7A7A7A] hover:bg-[#2A2A2A]'"
                  class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Demo
                </button>
              </div>
            </div>

            <!-- Botão Depositar -->
            <button 
              @click="openDepositFlowFromModal" 
              class="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold px-5 py-3 rounded-lg text-base inline-flex items-center justify-center space-x-2 transition-all duration-200 shadow-[0_2px_8px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
            >
              <i class="fas fa-wallet text-sm"></i>
              <span>Depositar</span>
            </button>

            <!-- Minhas Contas -->
            <div class="pt-2">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-credit-card text-[#7A7A7A] text-sm"></i>
                  <h3 class="text-base font-semibold text-white">Minhas Contas</h3>
                </div>
                <button
                  @click="toggleAccountsList"
                  class="text-[#7A7A7A] hover:text-[#DFDFDF] transition-colors"
                >
                  <i :class="showAccountsList ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                </button>
              </div>
              
              <div v-if="showAccountsList" class="space-y-2">
                <div v-if="loadingAccounts" class="flex items-center justify-center py-8">
                  <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#22C55E] mb-2"></div>
                    <p class="text-[#A1A1A1] text-sm">Carregando contas...</p>
                  </div>
                </div>
                
                <div v-else-if="filteredAccounts.length === 0" class="text-center py-8">
                  <i class="fas fa-exclamation-circle text-[#7A7A7A] text-2xl mb-2"></i>
                  <p class="text-[#A1A1A1] text-sm">Nenhuma conta disponível</p>
                </div>
                
                <div v-else class="space-y-2">
                  <div 
                    v-for="account in filteredAccounts" 
                    :key="account.loginid"
                    @click="selectAccountFromList(account)"
                    class="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-lg cursor-pointer hover:border-[#22C55E]/50 hover:bg-[#0F0F0F] transition-all duration-200"
                    :class="{ 'border-[#22C55E] bg-[#0F0F0F]': isCurrentAccount(account) }"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-semibold text-white">{{ account.loginid }}</span>
                          <span class="text-xs text-[#7A7A7A]">
                            {{ account.isDemo ? 'Demo' : 'Real' }} - {{ formatBalance(account.balance || 0, account.currency) }}
                          </span>
                        </div>
                      </div>
                      <div v-if="isCurrentAccount(account)" class="ml-3 flex-shrink-0">
                        <i class="fas fa-check text-[#22C55E] text-sm"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sair da Corretora -->
            <div class="pt-4 border-t border-[#1C1C1C]">
              <button
                @click="disconnectAccountFromModal"
                class="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-400 transition-colors py-2"
              >
                <i class="fas fa-arrow-left text-sm"></i>
                <span class="text-sm font-medium">Sair da corretora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Notificações -->
    <div 
      v-if="showNotificationsModal" 
      class="notifications-modal-overlay"
      @click.self="closeNotificationsModal"
    >
      <div class="notifications-modal-content" @click.stop>
        <div class="notifications-modal-header">
          <h2 class="notifications-modal-title">Notificações</h2>
          <button class="notifications-modal-close" @click="closeNotificationsModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="notifications-modal-body">
          <div v-if="notifications.length === 0" class="notifications-empty">
            <i class="fa-solid fa-bell-slash text-[48px] text-white/20 mb-4"></i>
            <p class="text-white/40 text-[14px]">Nenhuma notificação</p>
          </div>
          <div v-else class="notifications-list">
            <div 
              v-for="(notification, index) in notifications" 
              :key="index"
              class="notification-item"
            >
              <div class="notification-icon">
                <i :class="notification.icon || 'fa-solid fa-info-circle'"></i>
              </div>
              <div class="notification-content">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ notification.time }}</span>
              </div>
            </div>
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
      showProfileModal: false,
      userProfilePictureUrl: null,
      showAccountModal: false,
      showNotificationsModal: false,
      loadingAccounts: false,
      availableAccounts: [],
      isMobile: false,
      accountTypeFilter: 'real', // 'real' ou 'demo'
      showAccountsList: true,
      notifications: []
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
    currentAccountType() {
      // PRIORIDADE 1: Usar accountType da prop (vem do tradeCurrency do settings, igual ao Dashboard)
      if (this.accountType && (this.accountType === 'demo' || this.accountType === 'real')) {
        return this.accountType;
      }
      
      // PRIORIDADE 2: Verificar o tipo de conta atual baseado na conexão
      const connectionStr = localStorage.getItem('deriv_connection');
      if (connectionStr) {
        try {
          const connection = JSON.parse(connectionStr);
          // Verificar loginid primeiro (mais confiável)
          const loginid = connection.loginid || '';
          const isDemoByLoginid = loginid.startsWith('VRTC') || loginid.startsWith('VRT');
          
          // Verificar isDemo se existir
          const isDemoByFlag = connection.isDemo === true || connection.isDemo === 1;
          
          // Se loginid indica demo, é demo (independente do flag)
          // Se loginid não indica demo mas flag indica, usar flag
          // Se loginid começa com CR, é real
          const isDemo = isDemoByLoginid || (isDemoByFlag && !loginid.startsWith('CR'));
          
          return isDemo ? 'demo' : 'real';
        } catch {
          return this.accountType || 'real';
        }
      }
      return this.accountType || 'real';
    },
    navbarBalanceValue() {
      if (this.currentAccountType === 'demo') {
        const demo = this.balancesByCurrencyDemo['USD'] || 0;
        return demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      const value = this.balanceNumeric;
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    navbarCurrencySymbol() {
      if (this.currentAccountType === 'demo') {
        return '';
      }
      return this.currencyPrefix || this.getCurrencyPrefix(this.currency);
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
    },
    fullUserName() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          return user.name || 'Usuário';
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'Usuário';
    },
    totalBalanceFormatted() {
      // Usar currentAccountType em vez de accountTypeFilter para sempre mostrar o saldo correto
      const accountType = this.currentAccountType;
      
      if (accountType === 'demo') {
        // Buscar saldo demo - pode estar em diferentes moedas
        const demoBalances = this.balancesByCurrencyDemo || {};
        const demoUSD = demoBalances['USD'] || 0;
        // Se não tiver USD, pegar a primeira moeda disponível
        const demoValue = demoUSD > 0 ? demoUSD : (Object.values(demoBalances)[0] || 0);
        return demoValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        // Buscar saldo real - pode estar em diferentes moedas
        const realBalances = this.balancesByCurrencyReal || {};
        const realUSD = realBalances['USD'] || 0;
        // Se não tiver USD, usar balanceNumeric ou pegar a primeira moeda disponível
        const realValue = realUSD > 0 ? realUSD : (this.balanceNumeric || Object.values(realBalances)[0] || 0);
        return realValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    balanceValueFormatted() {
      return this.totalBalanceFormatted;
    },
    currencySymbol() {
      // Usar currentAccountType para sempre mostrar o símbolo correto
      if (this.currentAccountType === 'demo') {
        return '';
      }
      return this.currencyPrefix || this.getCurrencyPrefix(this.currency);
    },
    filteredAccounts() {
      if (!this.availableAccounts || this.availableAccounts.length === 0) {
        return [];
      }
      return this.availableAccounts.filter(account => {
        if (this.accountTypeFilter === 'demo') {
          return account.isDemo === true;
        } else {
          return account.isDemo === false;
        }
      });
    }
  },
  watch: {
    // Observar mudanças no localStorage para atualizar o saldo
    currentAccountType(newType) {
      // Atualizar o filtro quando o tipo de conta mudar
      if (this.accountTypeFilter !== newType) {
        this.accountTypeFilter = newType;
        console.log('[TopNavbar] Tipo de conta mudou, atualizando filtro:', {
          oldFilter: this.accountTypeFilter,
          newType: newType
        });
      }
      // Forçar atualização do componente quando o tipo de conta mudar
      this.$forceUpdate();
    },
    // Observar mudanças no balance para atualizar o modal se estiver aberto
    balance() {
      if (this.showProfileModal) {
        this.$forceUpdate();
      }
    }
  },
  mounted() {
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('userProfileUpdated', this.handleProfileUpdate);
    window.addEventListener('resize', this.checkMobile);
    window.addEventListener('accountChanged', this.handleAccountChange);
    this.checkMobile();
    this.loadUserProfilePicture();
    // Pré-carregar contas em background para uso futuro
    this.preloadAccounts();
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('userProfileUpdated', this.handleProfileUpdate);
    window.removeEventListener('resize', this.checkMobile);
    window.removeEventListener('accountChanged', this.handleAccountChange);
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
    toggleProfileModal() {
      // Fechar modal de notificações se estiver aberto
      if (this.showNotificationsModal) {
        this.showNotificationsModal = false;
      }
      this.showProfileModal = !this.showProfileModal;
      if (this.showProfileModal) {
        // Carregar contas quando abrir o modal (usar cache se disponível)
        this.loadAccountsForModal();
        
        // Definir o filtro baseado no tipo de conta atual
        // Usar o computed currentAccountType que já tem a lógica correta
        this.accountTypeFilter = this.currentAccountType;
        
        const connectionStr = localStorage.getItem('deriv_connection');
        if (connectionStr) {
          try {
            const connection = JSON.parse(connectionStr);
            console.log('[TopNavbar] Modal aberto, tipo de conta:', this.accountTypeFilter, {
              isDemo: connection.isDemo,
              loginid: connection.loginid,
              currentAccountType: this.currentAccountType
            });
          } catch (e) {
            console.warn('[TopNavbar] Erro ao parsear connection:', e);
          }
        }
      }
    },
    closeProfileModal() {
      this.showProfileModal = false;
    },
    async loadAccountsForModal() {
      // Sempre tentar usar cache primeiro para mostrar instantaneamente
      const cachedAccounts = this.getCachedAccountsSync();
      if (cachedAccounts && cachedAccounts.length > 0) {
        this.availableAccounts = cachedAccounts;
        console.log('[TopNavbar] Usando contas do cache para modal:', cachedAccounts.length);
        return;
      }
      
      // Se não tiver cache, carregar as contas
      await this.loadAvailableAccounts(false); // Usar cache se disponível
    },
    async switchAccountType(type) {
      // Verificar o tipo de conta atual baseado no localStorage
      // Usar a mesma lógica do computed currentAccountType
      const currentType = this.currentAccountType;
      
      console.log(`[TopNavbar] switchAccountType chamado:`, {
        typeDesejado: type,
        tipoAtual: currentType,
        connection: JSON.parse(localStorage.getItem('deriv_connection') || '{}')
      });
      
      // Se já está no tipo selecionado, não fazer nada
      if (currentType === type) {
        console.log(`[TopNavbar] Já está na conta ${type}`);
        return;
      }
      
      // Atualizar o filtro visual
      this.accountTypeFilter = type;
      
      // Usar cache se disponível, senão carregar
      // Não limpar cache para troca ser instantânea
      if (this.availableAccounts.length === 0) {
        await this.loadAvailableAccounts(false); // Usar cache se disponível
      }
      
      // Encontrar uma conta do tipo selecionado
      const targetAccounts = this.availableAccounts.filter(account => {
        if (type === 'demo') {
          return account.isDemo === true;
        } else {
          return account.isDemo === false;
        }
      });
      
      if (targetAccounts.length === 0) {
        console.warn(`[TopNavbar] Nenhuma conta ${type} disponível`);
        // Reverter o filtro visual
        this.accountTypeFilter = currentType;
        return;
      }
      
      // Priorizar USD se disponível, senão pegar a primeira
      let selectedAccount = targetAccounts.find(acc => acc.currency === 'USD') || targetAccounts[0];
      
      console.log(`[TopNavbar] Trocando para conta ${type}:`, selectedAccount.loginid, {
        isDemo: selectedAccount.isDemo,
        loginid: selectedAccount.loginid,
        currency: selectedAccount.currency
      });
      
      // Fechar o modal imediatamente (antes de trocar)
      this.closeProfileModal();
      
      // Trocar para a conta selecionada (em background, sem reload)
      await this.selectAccount(selectedAccount);
    },
    toggleAccountsList() {
      this.showAccountsList = !this.showAccountsList;
    },
    async selectAccountFromList(account) {
      // Se já é a conta atual, não fazer nada
      if (this.isCurrentAccount(account)) {
        return;
      }
      // Fechar o modal antes de trocar a conta
      this.closeProfileModal();
      // Selecionar a conta (isso já recarrega a página)
      await this.selectAccount(account);
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
    async updateTradeCurrencyInSettings(accountType) {
      // Atualiza o tradeCurrency no settings (igual ao Dashboard)
      try {
        const tradeCurrency = accountType === 'demo' ? 'DEMO' : 'USD';
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiBase}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tradeCurrency: tradeCurrency
          })
        });

        if (response.ok) {
          console.log('[TopNavbar] TradeCurrency atualizado no settings:', tradeCurrency);
        } else {
          console.warn('[TopNavbar] Erro ao atualizar tradeCurrency:', response.statusText);
        }
      } catch (error) {
        console.error('[TopNavbar] Erro ao atualizar tradeCurrency:', error);
      }
    },
    
    handleAccountChange() {
      // Atualizar o filtro quando a conta for alterada
      const newAccountType = this.currentAccountType;
      if (this.accountTypeFilter !== newAccountType) {
        this.accountTypeFilter = newAccountType;
        console.log('[TopNavbar] Conta alterada, atualizando filtro e saldo:', {
          newAccountType: newAccountType,
          accountTypeFilter: this.accountTypeFilter
        });
      }
      // Atualiza o componente quando a conta for alterada
      this.$forceUpdate();
    },
    openDepositFlow() {
      this.$router.push('/settings?tab=deposit');
    },
    async disconnectAccount() {
      localStorage.removeItem('deriv_token');
      localStorage.removeItem('deriv_tokens_by_loginid');
      localStorage.removeItem('deriv_connection');
      // Limpar cache de contas também
      try {
        const { clearAccountsCache } = await import('../utils/accountsLoader');
        clearAccountsCache();
      } catch (error) {
        console.warn('[TopNavbar] Erro ao limpar cache:', error);
      }
      this.$router.push('/dashboard');
      // Não recarregar página, deixar o router atualizar
    },
    async switchAccount() {
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
    async loadAvailableAccounts(forceReload = false) {
      // Só mostrar loading se o modal estiver aberto (para não mostrar durante troca de conta)
      if (this.showProfileModal || this.showAccountModal) {
        this.loadingAccounts = true;
      }
      try {
        // Usar a função utilitária que já tem cache e otimizações
        // Se forçar recarregamento, limpar cache e buscar novamente
        const accounts = await loadAvailableAccounts(forceReload);
        this.availableAccounts = accounts;
        console.log('[TopNavbar] Contas carregadas:', accounts.length, accounts.map(acc => ({
          loginid: acc.loginid,
          currency: acc.currency,
          isDemo: acc.isDemo
        })));
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
      
      // Verificar se há tokens no localStorage (usuário já logou)
      const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
      if (tokensByLoginIdStr) {
        // Se não tiver cache, carregar em background sem bloquear a UI
        this.loadAvailableAccounts(false).catch(err => {
          console.warn('[TopNavbar] Erro ao pré-carregar contas em background:', err);
        });
      }
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
        // Fechar modal imediatamente para não mostrar loading
        this.closeProfileModal();
        
        // Atualizar localStorage imediatamente com dados do cache (troca instantânea)
        const isDemo = account.isDemo === true || account.loginid?.startsWith('VRTC') || account.loginid?.startsWith('VRT');
        
        // Atualizar token imediatamente
        localStorage.setItem('deriv_token', account.token);
        
        // Atualizar connection com dados básicos do account (do cache)
        const currentConnection = JSON.parse(localStorage.getItem('deriv_connection') || '{}');
        localStorage.setItem('deriv_connection', JSON.stringify({
          ...currentConnection,
          loginid: account.loginid,
          currency: account.currency,
          isDemo: isDemo,
          timestamp: Date.now()
        }));

          // Emitir eventos imediatamente para atualizar componentes
          const accountType = isDemo ? 'demo' : 'real';
          this.$emit('account-type-changed', accountType);
          
          // Atualizar o filtro imediatamente para refletir a mudança no modal
          this.accountTypeFilter = accountType;
          
          // Atualizar tradeCurrency no settings (igual ao Dashboard)
          this.updateTradeCurrencyInSettings(accountType).catch(err => {
            console.warn('[TopNavbar] Erro ao atualizar tradeCurrency:', err);
          });
          
          window.dispatchEvent(new CustomEvent('accountChanged', { 
            detail: { accountType, account } 
          }));
        
        // Buscar informações completas em background (sem bloquear UI)
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const token = localStorage.getItem('token');
        const appId = localStorage.getItem('deriv_app_id') || '1089';

        // Fazer requisição em background sem mostrar loading
        fetch(`${apiBase}/broker/deriv/status`, {
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
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Erro ao buscar status da conta');
        }).then(data => {
          // Atualizar localStorage com dados completos em background
          localStorage.setItem('deriv_connection', JSON.stringify({
            ...data,
            loginid: account.loginid,
            currency: account.currency,
            isDemo: isDemo,
            timestamp: Date.now()
          }));
          
          // Emitir evento novamente com dados atualizados
          window.dispatchEvent(new CustomEvent('accountChanged', { 
            detail: { accountType, account, fullData: data } 
          }));
          
          console.log('[TopNavbar] Conta atualizada em background:', account.loginid);
        }).catch(error => {
          console.warn('[TopNavbar] Erro ao atualizar dados da conta em background:', error);
          // Não mostrar erro ao usuário, a troca já foi feita com dados do cache
        });
      } catch (error) {
        console.error('[TopNavbar] Erro ao selecionar conta:', error);
      }
    },
    closeAccountModal() {
      this.showAccountModal = false;
      this.availableAccounts = [];
    },
    toggleNotificationsModal() {
      // Fechar modal de settings se estiver aberto
      if (this.showProfileModal) {
        this.showProfileModal = false;
      }
      this.showNotificationsModal = !this.showNotificationsModal;
    },
    closeNotificationsModal() {
      this.showNotificationsModal = false;
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

/* Modal de Configurações (Unificado) */
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200000 !important;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.settings-modal-content {
  background: #0B0B0B;
  border-radius: 0;
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(255, 255, 255, 0.05);
  animation: slideInRight 0.3s ease-out;
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: none;
}

.settings-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.settings-modal-close {
  background: none;
  border: none;
  color: #9B9B9B;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.settings-modal-close:hover {
  color: #fff;
}

.settings-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  color: #FFFFFF;
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
  z-index: 200000 !important;
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

/* Borda da imagem de perfil igual aos cards do IA */
.profile-img-border {
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Símbolo D com dois riscos para Demo */
.demo-currency-symbol {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1;
  margin-right: 2px;
}

.demo-currency-symbol::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 42%;
  height: 2.5px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 58%;
  height: 2.5px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

/* Símbolo D com dois riscos para Demo no Navbar */
.demo-currency-symbol-navbar {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 0.875rem;
  line-height: 1;
  margin-right: 2px;
}

.demo-currency-symbol-navbar::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 42%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol-navbar::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 58%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

/* Notifications Modal Styles */
.notifications-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200000 !important;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.notifications-modal-content {
  background: #0B0B0B;
  border-radius: 0;
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100%;
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
}

.notification-title {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.notification-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
}

.notification-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .notifications-modal-content {
    max-width: 85%;
    min-width: 280px;
  }
}
</style>

