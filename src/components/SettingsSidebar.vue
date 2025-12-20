<template>
  <div v-if="isOpen" class="settings-modal-overlay" @click="close">
    <div class="settings-modal-content" @click.stop>
      <div class="settings-modal-header">
        <h2 class="settings-modal-title">Configurações</h2>
        <button class="settings-modal-close" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="settings-modal-body">
        <div class="settings-modal-section">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
              <img 
                v-if="userProfilePicture"
                :src="userProfilePicture"
                :alt="userName"
                class="w-full h-full object-cover"
              />
              <div 
                v-else
                class="w-full h-full bg-[#22C55E]/20 flex items-center justify-center"
              >
                <span class="text-white text-lg font-semibold">{{ userInitials }}</span>
              </div>
            </div>
            <div class="settings-user-info">
              <h3 class="settings-user-name">{{ userName }}</h3>
              <p class="settings-user-status">Conta Ativa</p>
            </div>
          </div>

          <div class="glass-card rounded-xl p-4 mb-4">
            <div class="flex items-center justify-between mb-3">
              <span class="settings-balance-label">Saldo Total</span>
              <button 
                @click="toggleBalanceVisibility"
                class="settings-eye-btn"
              >
                <i :class="balanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            <p class="settings-balance-amount text-left">
              <span v-if="balanceVisible" class="inline-flex items-center">
                <span v-if="currentAccountType === 'demo'" class="demo-currency-symbol-wrapper">
                  <span class="demo-currency-symbol">D</span>
                </span>
                <span v-else>$</span>
                {{ balanceVisible ? formattedBalance : '' }}
              </span>
              <span v-else>••••••</span>
            </p>
            <div class="flex items-center gap-3 mt-3">
              <button 
                @click="switchAccount('real')"
                :class="currentAccountType === 'real' ? 'settings-account-btn-active' : 'settings-account-btn-inactive'"
                class="settings-account-btn"
              >
                Real
              </button>
              <button 
                @click="switchAccount('demo')"
                :class="currentAccountType === 'demo' ? 'settings-account-btn-active' : 'settings-account-btn-inactive'"
                class="settings-account-btn"
              >
                Demo
              </button>
            </div>
          </div>

          <button 
            @click="openDepositFlow"
            class="settings-deposit-btn"
          >
            <i class="fa-solid fa-wallet"></i>
            <span>Depositar</span>
          </button>
        </div>

        <div class="settings-modal-section settings-modal-section-with-border">
          <div class="mb-4">
            <button 
              @click="toggleAccountsList"
              class="w-full flex items-center justify-between py-4 text-white/70 hover:text-white transition-colors"
            >
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-wallet text-[16px]"></i>
                <span class="text-[14px] font-medium">Minhas Contas</span>
              </div>
              <i :class="showAccountsList ? 'fa-solid fa-chevron-up text-[12px]' : 'fa-solid fa-chevron-down text-[12px]'"></i>
            </button>
            
            <div v-if="showAccountsList" class="accounts-list">
              <div 
                v-for="account in availableAccounts" 
                :key="account.loginid"
                @click="selectAccount(account)"
                class="account-item flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <img 
                      v-if="!account.isDemo && getCurrencyIcon(account.currency || 'USD', 'real')" 
                      :src="getCurrencyIcon(account.currency || 'USD', 'real')" 
                      :alt="account.currency || 'USD'"
                      class="w-5 h-5 rounded-full object-cover"
                    />
                    <span class="text-white text-[14px] font-medium">{{ getAccountDisplayName(account) }}</span>
                    <i v-if="isCurrentAccount(account)" class="fa-solid fa-check text-[#22C55E] text-[12px]"></i>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="account.isDemo ? 'text-[#22C55E]/70 text-[12px]' : 'text-[#F59E0B]/70 text-[12px]'">
                      {{ account.isDemo ? 'Demo' : 'Real' }}
                    </span>
                    <span class="text-white/40 text-[12px]">•</span>
                    <span class="text-white/80 text-[12px] inline-flex items-center">
                      <span v-if="account.isDemo" class="demo-currency-symbol-modal-small-wrapper">
                        <span class="demo-currency-symbol-modal-small">D</span>
                      </span>
                      <span v-else>$</span>
                      {{ formatBalance(account.balance || 0) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="availableAccounts.length === 0" class="text-white/40 text-[12px] py-4 text-center">
                Nenhuma conta encontrada
              </div>
            </div>
          </div>

          <button 
            @click="logout"
            class="w-full flex items-center gap-3 py-4 text-[#FF4747] hover:text-[#FF6060] transition-colors"
          >
            <i class="fa-solid fa-right-from-bracket text-[16px]"></i>
            <span class="text-[14px] font-medium">Sair da corretora</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadAvailableAccounts } from '../utils/accountsLoader';

export default {
  name: 'SettingsSidebar',
  props: {
    isOpen: {
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
    }
  },
  emits: ['close', 'account-type-changed'],
  data() {
    return {
      balanceVisible: true,
      showAccountsList: false,
      availableAccounts: [],
      loadingAccounts: false,
      userProfilePictureUrl: null
    };
  },
  computed: {
    currentAccountType() {
      return this.accountType || 'real';
    },
    formattedBalance() {
      // Retorna apenas o valor numérico formatado (sem prefixo, pois o símbolo é adicionado no template)
      if (this.accountType === 'demo') {
        // Para Demo, usar APENAS o saldo Demo, nunca fallback para Real
        const demo = this.balancesByCurrencyDemo['USD'];
        if (demo !== undefined && demo !== null && demo > 0) {
          return demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        // Se não tiver saldo Demo, mostrar 0
        return '0,00';
      }
      
      // Para Real, usar APENAS o saldo Real
      // Primeiro tentar balancesByCurrencyReal
      const realFromBalances = this.balancesByCurrencyReal['USD'];
      if (realFromBalances !== undefined && realFromBalances !== null && realFromBalances >= 0) {
        return realFromBalances.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      
      // Se não tiver saldo Real nos balancesByCurrency, tentar calcular a partir das contas disponíveis
      // Buscar todas as contas Real e somar os saldos
      if (this.availableAccounts && this.availableAccounts.length > 0) {
        const realAccounts = this.availableAccounts.filter(acc => !acc.isDemo && acc.currency === 'USD');
        if (realAccounts.length > 0) {
          const totalReal = realAccounts.reduce((sum, acc) => {
            const balance = parseFloat(acc.balance || 0);
            return sum + (isNaN(balance) ? 0 : balance);
          }, 0);
          if (totalReal >= 0) {
            return totalReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
        }
      }
      
      // Se não encontrou saldo Real em lugar nenhum, mostrar 0
      // NUNCA usar o balance prop como fallback se for Real, pois pode ser saldo Demo
      return '0,00';
    },
    balanceNumeric() {
      // Para Real, usar APENAS balancesByCurrencyReal
      if (this.accountType === 'real') {
        const usdReal = this.balancesByCurrencyReal['USD'];
        if (usdReal !== undefined && usdReal !== null && usdReal >= 0) {
          return usdReal;
        }
        // Se não tiver saldo Real, tentar calcular das contas disponíveis
        if (this.availableAccounts && this.availableAccounts.length > 0) {
          const realAccounts = this.availableAccounts.filter(acc => !acc.isDemo && acc.currency === 'USD');
          if (realAccounts.length > 0) {
            const totalReal = realAccounts.reduce((sum, acc) => {
              const balance = parseFloat(acc.balance || 0);
              return sum + (isNaN(balance) ? 0 : balance);
            }, 0);
            if (totalReal >= 0) {
              return totalReal;
            }
          }
        }
        // Se não encontrou saldo Real, retornar 0
        return 0;
      }
      
      // Para Demo, usar APENAS balancesByCurrencyDemo
      if (this.accountType === 'demo') {
        const usdDemo = this.balancesByCurrencyDemo['USD'];
        if (usdDemo !== undefined && usdDemo !== null && usdDemo >= 0) {
          return usdDemo;
        }
        // Se não tiver saldo Demo, tentar calcular das contas disponíveis
        if (this.availableAccounts && this.availableAccounts.length > 0) {
          const demoAccounts = this.availableAccounts.filter(acc => acc.isDemo && acc.currency === 'USD');
          if (demoAccounts.length > 0) {
            const totalDemo = demoAccounts.reduce((sum, acc) => {
              const balance = parseFloat(acc.balance || 0);
              return sum + (isNaN(balance) ? 0 : balance);
            }, 0);
            if (totalDemo >= 0) {
              return totalDemo;
            }
          }
        }
        // Se não encontrou saldo Demo, retornar 0
        return 0;
      }
      
      // Fallback genérico (não deveria chegar aqui)
      return 0;
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
    userProfilePicture() {
      if (!this.userProfilePictureUrl) return null;
      
      if (this.userProfilePictureUrl.startsWith('http://') || 
          this.userProfilePictureUrl.startsWith('https://')) {
        return this.userProfilePictureUrl;
      }
      
      if (this.userProfilePictureUrl.startsWith('/api/uploads')) {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const baseUrl = apiBaseUrl.replace(/\/api$/, '');
        return `${baseUrl}${this.userProfilePictureUrl}`;
      }
      
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
      const baseUrl = apiBaseUrl.replace(/\/api$/, '');
      return `${baseUrl}${this.userProfilePictureUrl}`;
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        // Sempre tentar carregar contas quando abrir, mesmo se já tiver algumas
        // Isso garante que as contas estejam atualizadas
        this.loadAvailableAccounts(false);
      }
    },
    accountType(newType) {
      console.log('[SettingsSidebar] accountType mudou:', newType);
      // Forçar atualização do formattedBalance quando accountType mudar
      this.$forceUpdate();
    },
    balancesByCurrencyReal: {
      handler(newVal) {
        console.log('[SettingsSidebar] balancesByCurrencyReal atualizado:', newVal);
      },
      deep: true
    },
    balancesByCurrencyDemo: {
      handler(newVal) {
        console.log('[SettingsSidebar] balancesByCurrencyDemo atualizado:', newVal);
      },
      deep: true
    }
  },
  mounted() {
    this.loadUserProfilePicture();
    window.addEventListener('userProfileUpdated', this.handleProfileUpdate);
    // Carregar contas disponíveis quando o componente montar
    // Isso garante que as contas estejam disponíveis para calcular o saldo
    this.loadAvailableAccounts(false);
  },
  beforeUnmount() {
    window.removeEventListener('userProfileUpdated', this.handleProfileUpdate);
  },
  methods: {
    close() {
      this.$emit('close');
      this.showAccountsList = false;
    },
    /**
     * Retorna nome amigável da conta baseado no tipo e moeda
     * Ex: "Conta Demo (USD)" ou "Conta Real (USD)"
     */
    getAccountDisplayName(account) {
      if (!account) return 'Conta';
      
      const type = account.isDemo ? 'Demo' : 'Real';
      const currency = account.currency || 'USD';
      
      return `Conta ${type} (${currency})`;
    },
    toggleBalanceVisibility() {
      this.balanceVisible = !this.balanceVisible;
    },
    toggleAccountsList() {
      this.showAccountsList = !this.showAccountsList;
      console.log('[SettingsSidebar] toggleAccountsList:', {
        showAccountsList: this.showAccountsList,
        availableAccountsCount: this.availableAccounts.length,
        availableAccounts: this.availableAccounts
      });
      
      // Sempre tentar carregar quando abrir, mesmo se já tiver contas
      // Isso garante que as contas estejam atualizadas
      if (this.showAccountsList) {
        if (this.availableAccounts.length === 0) {
          console.log('[SettingsSidebar] Nenhuma conta disponível, carregando...');
          // Se não tem contas, tentar forçar recarregamento
          this.loadAvailableAccounts(true);
        } else {
          console.log('[SettingsSidebar] Contas já disponíveis:', this.availableAccounts.length);
          // Mesmo assim, tentar recarregar para garantir que está atualizado
          this.loadAvailableAccounts(false);
        }
      }
    },
    async loadAvailableAccounts(forceReload = false) {
      this.loadingAccounts = true;
      try {
        console.log('[SettingsSidebar] Carregando contas disponíveis...', { forceReload });
        
        // Usar a função importada
        const accounts = await loadAvailableAccounts(forceReload);
        
        console.log('[SettingsSidebar] Contas carregadas:', {
          count: accounts?.length || 0,
          accounts: accounts
        });
        
        // Garantir que é um array válido
        if (Array.isArray(accounts)) {
          this.availableAccounts = accounts;
        } else {
          console.warn('[SettingsSidebar] Resposta não é um array:', accounts);
          this.availableAccounts = [];
        }
        
        if (this.availableAccounts.length === 0) {
          console.warn('[SettingsSidebar] Nenhuma conta encontrada após carregamento');
          // Tentar verificar o cache diretamente
          try {
            const cacheKey = 'deriv_available_accounts_cache';
            const cachedStr = localStorage.getItem(cacheKey);
            if (cachedStr) {
              const cached = JSON.parse(cachedStr);
              console.log('[SettingsSidebar] Cache encontrado no localStorage:', cached);
              if (Array.isArray(cached) && cached.length > 0) {
                console.log('[SettingsSidebar] Usando contas do cache diretamente');
                this.availableAccounts = cached;
              }
            }
          } catch (e) {
            console.error('[SettingsSidebar] Erro ao ler cache:', e);
          }
        }
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao carregar contas:', error);
        this.availableAccounts = [];
      } finally {
        this.loadingAccounts = false;
      }
    },
    async selectAccount(account) {
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const token = localStorage.getItem('token');
        const appId = localStorage.getItem('deriv_app_id') || '1089';

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
          
          localStorage.setItem('deriv_token', account.token);
          localStorage.setItem('deriv_connection', JSON.stringify({
            ...data,
            loginid: account.loginid,
            currency: account.currency,
            isDemo: account.isDemo,
            timestamp: Date.now()
          }));

          const accountType = account.isDemo ? 'demo' : 'real';
          this.$emit('account-type-changed', accountType);
          
          this.close();
          window.location.reload();
        } else {
          throw new Error('Erro ao selecionar conta');
        }
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao selecionar conta:', error);
        alert('Erro ao trocar de conta. Tente novamente.');
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
    switchAccount(type) {
      this.$emit('account-type-changed', type);
    },
    openDepositFlow() {
      this.close();
      this.$router.push('/settings?tab=deposit');
    },
    logout() {
      localStorage.removeItem('deriv_token');
      localStorage.removeItem('deriv_tokens_by_loginid');
      localStorage.removeItem('deriv_connection');
      this.close();
      this.$router.push('/dashboard');
      window.location.reload();
    },
    formatBalance(balance) {
      const value = parseFloat(balance) || 0;
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    handleProfileUpdate() {
      this.loadUserProfilePicture();
    },
    async loadUserProfilePicture() {
      try {
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
        console.error('[SettingsSidebar] Erro ao carregar foto do perfil:', error);
      }
    }
  }
};
</script>

<style scoped>
.settings-modal-overlay {
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

.settings-modal-section {
  margin-bottom: 24px;
}

.settings-modal-section:last-child {
  margin-bottom: 0;
}

.settings-modal-section-with-border {
  border-top: 2px solid rgba(255, 255, 255, 0.05);
  padding-top: 24px;
  margin-top: 0;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.settings-user-info {
  text-align: left;
}

.settings-user-name {
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.settings-user-status {
  color: #22C55E;
  font-size: 12px;
  font-weight: 500;
  margin: 2px 0 0 0;
  line-height: 1.3;
}

.settings-balance-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
}

.settings-eye-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
  font-size: 14px;
}

.settings-eye-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.settings-balance-amount {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-align: left;
}

.settings-account-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.settings-account-btn-active {
  background: #22C55E;
  color: #FFFFFF;
}

.settings-account-btn-inactive {
  background: #2A2A2A;
  color: #9B9B9B;
}

.settings-account-btn-inactive:hover {
  background: #333333;
  color: #CCCCCC;
}

.settings-deposit-btn {
  width: 100%;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  border: none;
  border-radius: 12px;
  padding: 14px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  margin-bottom: 0;
}

.settings-deposit-btn:hover {
  opacity: 0.9;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
}

.settings-deposit-btn:active {
  transform: scale(0.98);
}

.glass-card {
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.accounts-list {
  margin-top: 8px;
  border-top: 2px solid rgba(255, 255, 255, 0.05);
  padding-top: 8px;
}

.account-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.account-item:last-child {
  border-bottom: none;
}

.demo-currency-symbol-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 2px;
}

.demo-currency-symbol {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1;
  color: currentColor;
}

.demo-currency-symbol::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 35%;
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
  top: 65%;
  height: 2.5px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol-modal-small-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 2px;
}

.demo-currency-symbol-modal-small {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  color: currentColor;
}

.demo-currency-symbol-modal-small::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 35%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol-modal-small::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 65%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

@media (max-width: 768px) {
  .settings-modal-content {
    max-width: 85%;
    min-width: 280px;
  }
}
</style>

