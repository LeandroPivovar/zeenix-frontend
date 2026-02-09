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
              <div class="settings-plan-badge-container">
                <span v-if="planName" class="settings-plan-badge">{{ planName }}</span>
                <span v-else class="settings-plan-badge free">Plano Gratuito</span>
              </div>
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
                <span v-if="(isFictitiousBalanceActive || uiAccountType !== 'demo')">
                  {{ isFictitiousBalanceActive ? '$' : currencyPrefix }}
                </span>
                <span v-else class="demo-currency-symbol-wrapper">
                  <span class="demo-currency-symbol">D</span>
                </span>
                {{ balanceVisible ? formattedBalance : '' }}
              </span>
              <span v-else>••••••</span>
            </p>
            <div class="flex items-center gap-3 mt-3">
              <button 
                @click="switchAccount('real')"
                :class="uiAccountType === 'real' ? 'settings-account-btn-active' : 'settings-account-btn-inactive'"
                class="settings-account-btn"
              >
                Real
              </button>
              <button 
                @click="switchAccount('demo')"
                :class="uiAccountType === 'demo' ? 'settings-account-btn-active' : 'settings-account-btn-inactive'"
                class="settings-account-btn"
              >
                Demo
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <button 
              @click="openDepositFlow"
              class="settings-deposit-btn"
            >
              <i class="fa-solid fa-wallet"></i>
              <span>Depositar</span>
            </button>
            <button 
              v-if="uiAccountType === 'demo'"
              @click="topUpDemo"
              class="settings-deposit-btn"
              :class="{ 'opacity-70 cursor-not-allowed': loadingTopup }"
              :disabled="loadingTopup"
              style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);"
            >
              <i class="fa-solid fa-rotate-right" :class="{ 'fa-spin': loadingTopup }"></i>
              <span>{{ loadingTopup ? 'Recarregando...' : 'Recarregar demo' }}</span>
            </button>
          </div>
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
                    <span :class="account.isDemo ? (isFictitiousBalanceActive ? 'text-[#F59E0B]/70 text-[12px]' : 'text-[#22C55E]/70 text-[12px]') : 'text-[#F59E0B]/70 text-[12px]'">
                      {{ (account.isDemo && isFictitiousBalanceActive) ? 'Real' : (account.isDemo ? 'Demo' : 'Real') }}
                    </span>
                    <span class="text-white/40 text-[12px]">•</span>
                    <span class="text-white/80 text-[12px] inline-flex items-center">
                      <span v-if="account.isDemo && !isFictitiousBalanceActive" class="demo-currency-symbol-modal-small-wrapper">
                        <span class="demo-currency-symbol-modal-small">D</span>
                      </span>
                      <span v-else>{{ getCurrencyPrefix?.(account.currency) || '$' }}</span>
                      {{ formatBalance(account.balance || 0, account.isDemo) }}
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
    },
    activeService: {
      type: String,
      default: null, // Valores aceitos: 'ia', 'agent', null
      validator: (value) => [null, 'ia', 'agent'].includes(value)
    }
  },
  emits: ['close', 'account-type-changed'],
  data() {
    return {
      balanceVisible: localStorage.getItem('balanceVisible') !== 'false', // Persistir estado
      showAccountsList: false,
      availableAccounts: [],
      loadingAccounts: false,

      userProfilePictureUrl: null,
      isMasterTrader: false,
      fictitiousBalance: 10000,
      isFictitiousBalanceActive: false,
      showDollarSign: false,
      
      // Novas colunas do banco de dados para contas
      tokenReal: null,
      tokenRealCurrency: 'USD',
      realAmount: 0,
      tokenDemo: null,
      tokenDemoCurrency: 'USD',
      demoAmount: 0,
      idRealAccount: null,
      idDemoAccount: null,
      loadingTopup: false,
      planName: null,
      isCreatorModeExpanded: false,
    };
  },
  computed: {
    currentAccountType() {
      return this.accountType || 'real';
    },
    uiAccountType() {
      // Se saldo fictício estiver ativo, mascarar como 'real'
      if (this.isFictitiousBalanceActive) {
        return 'real';
      }
      return this.currentAccountType;
    },
    formattedBalance() {
      // Valor base
      const value = this.balanceNumeric;

      // Determinar decimais
      const currency = (this.accountType === 'demo' ? 'USD' : (this.info?.currency || 'USD'));
      const isCrypto = ['BTC', 'ETH', 'LTC', 'USDC', 'UST'].includes(currency.toUpperCase()) || this.currencyPrefix === '₿';
      const decimals = isCrypto ? (currency === 'BTC' ? 8 : 4) : 2;

      // Formatar (sem prefixo aqui, pois o prefixo está no template)
      return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },
    balanceNumeric() {
      let baseBalance = 0;

      // Para Real
      if (this.accountType === 'real') {
        // Prioridade 1: Saldo USD Real
        const usdReal = this.balancesByCurrencyReal['USD'];
        if (usdReal !== undefined && usdReal !== null && Number(usdReal) > 0) {
          baseBalance = Number(usdReal);
        } else {
            // Prioridade 2: Qualquer moeda que tenha saldo > 0
            for (const balance of Object.values(this.balancesByCurrencyReal)) {
              if (Number(balance) > 0) {
                  baseBalance = Number(balance);
                  break;
              }
            }
        }
        
        // Fallback para o prop 'balance' se ainda for 0
        if (baseBalance === 0) {
             const raw = this.balance;
             if (typeof raw === 'number') baseBalance = raw;
             else {
                 const val = raw?.value ?? raw?.balance ?? raw ?? 0;
                 baseBalance = Number(val) || 0;
             }
        }
      }
      // Para Demo
      else if (this.accountType === 'demo') {
        const demoBalanceUSD = this.balancesByCurrencyDemo['USD'];
        
        if (demoBalanceUSD !== undefined && demoBalanceUSD !== null) {
            baseBalance = Number(demoBalanceUSD);
        } else {
             // Fallback: somar todos os saldos demo
             baseBalance = Object.values(this.balancesByCurrencyDemo).reduce((acc, val) => acc + (Number(val) || 0), 0);
        }
      }
      
      // ✅ ADICIONAR Saldo Fictício (SOMA) para ambos os tipos de conta
      if (this.isFictitiousBalanceActive) {
          baseBalance += (Number(this.fictitiousBalance) || 0);
      }
      
      return baseBalance;
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
      // Recarregar configurações quando o modal abrir
      if (newVal) {
        console.log('[SettingsSidebar] Modal aberto, recarregando configurações...');
        this.loadUserProfilePicture();
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
    window.addEventListener('masterTraderSettingsUpdated', this.handleMasterTraderUpdate);
    window.addEventListener('fictitiousBalanceChanged', this.handleFictitiousBalanceChange);
    // Não carregar contas automaticamente no mounted - só quando necessário
    // Isso evita chamadas desnecessárias ao montar o componente
  },
  beforeUnmount() {
    window.removeEventListener('userProfileUpdated', this.handleProfileUpdate);
    window.removeEventListener('masterTraderSettingsUpdated', this.handleMasterTraderUpdate);
    window.removeEventListener('fictitiousBalanceChanged', this.handleFictitiousBalanceChange);
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
      
      // Se houver um ID real e não for placeholder, exibi-lo
      if (account.loginid && !['REAL_ACC', 'DEMO_ACC'].includes(account.loginid)) {
        return `${account.loginid}`;
      }
      
      return `Conta ${type} (${currency})`;
    },
    toggleBalanceVisibility() {
      this.balanceVisible = !this.balanceVisible;
      localStorage.setItem('balanceVisible', this.balanceVisible.toString());
    },
    toggleAccountsList() {
      this.showAccountsList = !this.showAccountsList;
      
      if (this.showAccountsList) {
        console.log('[SettingsSidebar] Populando contas via dados do banco...');
        
        const accounts = [];
        
        // Adicionar Conta Real se existir token
        if (this.tokenReal) {
          accounts.push({
            loginid: this.idRealAccount || 'REAL_ACC', // Usar ID real se disponível
            token: this.tokenReal,
            isDemo: false,
            balance: parseFloat(this.realAmount) || 0,
            currency: this.tokenRealCurrency || 'USD'
          });
        }
        
        // Adicionar Conta Demo se existir token
        if (this.tokenDemo) {
          accounts.push({
            loginid: this.idDemoAccount || 'DEMO_ACC', // Usar ID real se disponível
            token: this.tokenDemo,
            isDemo: true,
            balance: parseFloat(this.demoAmount) || 0,
            currency: this.tokenDemoCurrency || 'USD'
          });
        }
        
        this.availableAccounts = accounts;
        
        if (this.availableAccounts.length === 0) {
          console.log('[SettingsSidebar] Nenhuma conta encontrada nos dados do perfil, tentando carregar via legado...');
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
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
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

          // ✅ Determinar Active Context baseado na rota atual (usando window.location pois $route pode não estar disponível?)
          // Assumindo que $route está disponível ($route.path)
          let activeContext = 'all';
          const currentPath = this.$route.path;
          
          if (currentPath.includes('/ia') || currentPath.includes('/copy-trading')) {
             activeContext = 'ai';
          } else if (currentPath.includes('/autonomo')) {
             activeContext = 'agent';
          }

          console.log(`[SettingsSidebar] Selecionando conta. Contexto ativo: ${activeContext}`);

          // ✅ NOVO: Salvar token selecionado no banco de dados
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
                activeContext: activeContext // ✅ Enviar contexto
              })
            });

            if (saveTokenResponse.ok) {
              console.log('[SettingsSidebar] ✅ Token da conta selecionada salvo no banco de dados');
            } else {
              console.warn('[SettingsSidebar] ⚠️ Erro ao salvar token no banco, mas continuando...');
            }
          } catch (saveError) {
            console.error('[SettingsSidebar] ❌ Erro ao salvar token no banco:', saveError);
            // Continuar mesmo se falhar ao salvar no banco
          }

          // ✅ Desativar apenas o serviço da página atual (se houver)
          // Isso já é redundante pois o backend faz a desativação, mas o frontend pode limpar estado local se precisar
          // await this.deactivateAllActiveServices(this.activeService); 

          const accountType = account.isDemo ? 'demo' : 'real';
          this.$emit('account-type-changed', accountType);
          
          this.close();
          window.location.reload();
        } else {
          throw new Error('Erro ao selecionar conta');
        }
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao selecionar conta:', error);
        await alert('Erro ao trocar de conta. Tente novamente.');
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
    async switchAccount(type) {
      try {
        // ✅ NOVO: Se saldo fictício estiver ativo, apenas ignorar a troca de conta
        // O saldo fictício já mascara a conta demo como real
        if (this.isFictitiousBalanceActive) {
          console.log('[SettingsSidebar] Saldo fictício ativo - ignorando troca de conta. UI já mostra como Real.');
          // Não fazer nada - o uiAccountType já retorna 'real' quando isFictitiousBalanceActive é true
          // O saldo já é calculado com fictício em formattedBalance
          this.close();
          return;
        }

        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const token = localStorage.getItem('token');
        
        // ✅ NOVO: Encontrar o token correto baseado no tipo de conta
        let selectedToken = null;
        const isDemo = type === 'demo';
        
        // Estratégia 1: Tentar encontrar em availableAccounts (que já carrega do backend)
        // Isso é mais robusto pois o accountsLoader já trata tokens do backend
        if (this.availableAccounts && this.availableAccounts.length > 0) {
           const targetAccount = this.availableAccounts.find(acc => acc.isDemo === isDemo);
           if (targetAccount && targetAccount.token) {
              selectedToken = targetAccount.token;
              console.log('[SettingsSidebar] Token encontrado em availableAccounts para', type, ':', targetAccount.loginid);
           }
        }

        // Estratégia 2: Se não achou, tentar no localStorage (deriv_connection) - Fallback legado
        if (!selectedToken) {
            const derivConnectionStr = localStorage.getItem('deriv_connection');
            if (derivConnectionStr) {
            try {
                const derivConnection = JSON.parse(derivConnectionStr);
                const accountsByCurrency = derivConnection.accountsByCurrency;
                const tokensByLoginId = derivConnection.tokensByLoginId;
                
                if (accountsByCurrency && tokensByLoginId) {
                // Iterar por todas as moedas
                for (const currency in accountsByCurrency) {
                    const accounts = accountsByCurrency[currency];
                    if (Array.isArray(accounts)) {
                    // Procurar conta do tipo correto
                    const targetAccount = accounts.find(acc => acc.isDemo === isDemo);
                    if (targetAccount && targetAccount.loginid) {
                        // Pegar token do loginid encontrado
                        const token = tokensByLoginId[targetAccount.loginid];
                        if (token) {
                        selectedToken = token;
                        console.log('[SettingsSidebar] Token encontrado no cache legado para', type, ':', targetAccount.loginid);
                        break;
                        }
                    }
                    }
                }
                }
            } catch (parseError) {
                console.error('[SettingsSidebar] Erro ao parsear deriv_connection:', parseError);
            }
            }
        }
        
        // Estratégia 3: Tentar carregar contas se ainda não tivermos token e availableAccounts estiver vazio
        if (!selectedToken && (!this.availableAccounts || this.availableAccounts.length === 0)) {
           console.log('[SettingsSidebar] Tentando carregar contas para encontrar token...');
           await this.loadAvailableAccounts(false);
           // Tentar novamente na lista carregada
           if (this.availableAccounts && this.availableAccounts.length > 0) {
               const targetAccount = this.availableAccounts.find(acc => acc.isDemo === isDemo);
               if (targetAccount && targetAccount.token) {
                  selectedToken = targetAccount.token;
                  console.log('[SettingsSidebar] Token encontrado após carregamento para', type, ':', targetAccount.loginid);
               }
           }
        }

        if (!selectedToken) {
          console.warn('[SettingsSidebar] Token não encontrado para tipo:', type);
          // Mesmo sem token, tentar mudar apenas a moeda no backend (pode ser que o backend já tenha tudo)
          // Mas vamos avisar o usuário ou tentar o fallback de moeda
        }

        // ✅ NOVO: Resolver Contexto Ativo
        let activeContext = 'all';
        const currentPath = this.$route.path;
        console.log(`[SettingsSidebar] 🔍 Detectando contexto - Path atual: ${currentPath}`);
        
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
        console.log(`[SettingsSidebar] Trocando para ${type}. Contexto detectado: ${activeContext}`);

        // ✅ NOVO: Salvar token selecionado no banco de dados (ou apenas moeda se token for null)
        try {
          const payload = {
              tradeCurrency: type === 'demo' ? 'DEMO' : 'USD',
              activeContext: activeContext // ✅ Passar contexto
          };
          if (selectedToken) {
              payload.token = selectedToken;
          }

          // Usar endpoint correto dependendo se temos token ou não
          const endpoint = selectedToken ? '/settings/deriv-token' : '/settings';
          const method = selectedToken ? 'POST' : 'PUT';

          console.log(`[SettingsSidebar] Salvando alteração via ${endpoint}...`);

          const saveResponse = await fetch(`${apiBase}${endpoint}`, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });

          if (saveResponse.ok) {
            console.log('[SettingsSidebar] ✅ Configuração salva com sucesso (tipo:', type, ')');
            
            // ✅ Atualizar localStorage com o novo token se tivermos
            if (selectedToken) {
                localStorage.setItem('deriv_token', selectedToken);
                console.log('[SettingsSidebar] ✅ localStorage atualizado com novo token');
            }
          } else {
            console.warn('[SettingsSidebar] ⚠️ Erro ao salvar no banco, mas continuando...');
          }
        } catch (saveError) {
          console.error('[SettingsSidebar] ❌ Erro ao salvar no banco:', saveError);
          // Continuar mesmo se falhar ao salvar no banco
        }

        // ✅ Desativar apenas o serviço da página atual (se houver)
        // Redundante se backend faz, mas ok manter estado
        // await this.deactivateAllActiveServices(this.activeService);

        this.$emit('account-type-changed', type);
        
        // ✅ Recarregar página para aplicar mudanças
        window.location.reload();
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao trocar conta:', error);
        this.$emit('account-type-changed', type);
      }
    },
    openDepositFlow() {
      this.close();
      // Redirecionamento para a Academy - Aula 2
      this.$router.push({ 
        name: 'CourseDetail', 
        params: { id: '25054bef-4f7c-4388-b22a-f01374671da3' },
        query: { lesson: '2' }
      });
    },
    logout() {
      localStorage.removeItem('deriv_token');
      localStorage.removeItem('deriv_tokens_by_loginid');
      localStorage.removeItem('deriv_connection');
      this.close();
      this.$router.push('/dashboard');
      window.location.reload();
    },
    formatBalance(balance, isDemo = false) {
      let value = parseFloat(balance) || 0;
      if (isDemo && this.isFictitiousBalanceActive) {
        value += this.fictitiousBalance;
      }
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
          
          // Atualizar dados do Master Trader
          this.isMasterTrader = !!data.traderMestre;
          if (data.fictitiousBalance !== undefined) this.fictitiousBalance = parseFloat(data.fictitiousBalance);
          if (data.isFictitiousBalanceActive !== undefined) this.isFictitiousBalanceActive = data.isFictitiousBalanceActive;
          if (data.showDollarSign !== undefined) this.showDollarSign = data.showDollarSign;

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

          // Atualizar dados de conta do banco
          this.tokenReal = data.tokenReal;
          this.tokenRealCurrency = data.tokenRealCurrency;
          this.realAmount = data.realAmount;
          this.idRealAccount = data.idRealAccount;
          this.tokenDemo = data.tokenDemo;
          this.tokenDemoCurrency = data.tokenDemoCurrency;
          this.demoAmount = data.demoAmount;
          this.idDemoAccount = data.idDemoAccount;
          this.planName = data.planName;
        }
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao carregar configurações:', error);
      }
    },

    async saveMasterTraderSettings() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('[SettingsSidebar] Token não encontrado');
          return;
        }

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fictitiousBalance: parseFloat(this.fictitiousBalance) || 10000,
            isFictitiousBalanceActive: this.isFictitiousBalanceActive,
            showDollarSign: this.showDollarSign
          })
        });

        if (res.ok) {
          console.log('[SettingsSidebar] Configurações de saldo fictício salvas com sucesso');
          
          // Emitir evento para atualizar a topbar
          window.dispatchEvent(new CustomEvent('fictitiousBalanceChanged', {
            detail: {
              enabled: this.isFictitiousBalanceActive,
              amount: this.fictitiousBalance
            }
          }));
          
          // Emitir evento global para recarregar dados da Deriv
          if (this.isFictitiousBalanceActive) {
            window.dispatchEvent(new Event('refreshDerivBalance'));
          }
        } else {
          console.error('[SettingsSidebar] Erro ao salvar configurações:', await res.text());
        }
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao salvar configurações do Master Trader:', error);
      }
    },

    handleMasterTraderUpdate(event) {
      if (event.detail) {
        this.fictitiousBalance = event.detail.fictitiousBalance || this.fictitiousBalance;
        this.isFictitiousBalanceActive = event.detail.isFictitiousBalanceActive !== undefined ? event.detail.isFictitiousBalanceActive : this.isFictitiousBalanceActive;
        this.showDollarSign = event.detail.showDollarSign !== undefined ? event.detail.showDollarSign : this.showDollarSign;
      }
    },

    handleFictitiousBalanceChange(event) {
      const { enabled, amount } = event.detail;
      this.isFictitiousBalanceActive = enabled;
      this.fictitiousBalance = amount;
      console.log('[SettingsSidebar] Saldo fictício atualizado:', { enabled, amount });
    },

    /**
     * Desativa serviços ativos antes de trocar de conta
     * @param {string} serviceType - Tipo de serviço a desativar: 'ia', 'agent', ou 'all'
     * Se não especificado, não desativa nada (comportamento padrão)
     */
    async deactivateAllActiveServices(serviceType = null) {
      const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('[SettingsSidebar] Token não encontrado, pulando desativação de serviços');
        return;
      }

      // Obter userId do token
      let userId = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || payload.id;
      } catch (error) {
        console.error('[SettingsSidebar] Erro ao extrair userId do token:', error);
      }

      if (!userId) {
        console.warn('[SettingsSidebar] userId não encontrado, pulando desativação de serviços');
        return;
      }

      // Se serviceType não foi especificado, não desativar nada
      if (!serviceType) {
        console.log('[SettingsSidebar] 🔄 Nenhum serviço será desativado (modo passivo)');
        return;
      }

      console.log(`[SettingsSidebar] 🛑 Desativando serviço: ${serviceType}...`);

      // Desativar IA (se solicitado)
      if (serviceType === 'ia' || serviceType === 'all') {
        try {
          const aiResponse = await fetch(`${apiBase}/ai/deactivate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
          });

          if (aiResponse.ok) {
            console.log('[SettingsSidebar] ✅ IA desativada com sucesso');
          } else {
            console.log('[SettingsSidebar] ⚠️ IA não estava ativa ou erro ao desativar');
          }
        } catch (error) {
          console.error('[SettingsSidebar] Erro ao desativar IA:', error);
        }
      }

      // Desativar Agente Autônomo (se solicitado)
      if (serviceType === 'agent' || serviceType === 'all') {
        try {
          const agentResponse = await fetch(`${apiBase}/autonomous-agent/deactivate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
          });

          if (agentResponse.ok) {
            console.log('[SettingsSidebar] ✅ Agente Autônomo desativado com sucesso');
          } else {
            console.log('[SettingsSidebar] ⚠️ Agente Autônomo não estava ativo ou erro ao desativar');
          }
        } catch (error) {
          console.error('[SettingsSidebar] Erro ao desativar Agente Autônomo:', error);
        }
      }

      console.log('[SettingsSidebar] ✅ Verificação de serviços concluída');
    },
    async topUpDemo() {
      if (this.loadingTopup) return;
      
      this.loadingTopup = true;
      console.log('[SettingsSidebar] Iniciando recarga de conta demo...');

      try {
        const appId = localStorage.getItem('deriv_app_id') || '1089';
        const token = localStorage.getItem('deriv_token');
        
        if (!token) {
          throw new Error('Token da Deriv não encontrado. Por favor, faça login novamente.');
        }

        // Conectar ao WebSocket
        const ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${appId}`);
        
        await new Promise((resolve, reject) => {
          ws.onopen = () => {
            console.log('[SettingsSidebar] WS Conectado');
            resolve();
          };
          ws.onerror = (err) => reject(err);
        });

        // 1. Autorizar
        ws.send(JSON.stringify({ authorize: token }));

        await new Promise((resolve, reject) => {
          ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            
            if (data.error) {
              console.error('[SettingsSidebar] WS Error:', data.error);
              reject(new Error(data.error.message));
              return;
            }

            if (data.msg_type === 'authorize') {
              console.log('[SettingsSidebar] Autorizado com sucesso. Solicitando topup...');
              // 2. Solicitar Topup
              ws.send(JSON.stringify({ topup_virtual: 1 }));
            }
            else if (data.msg_type === 'topup_virtual') {
              console.log('[SettingsSidebar] Topup realizado com sucesso:', data.topup_virtual);
              ws.close();
              resolve(data.topup_virtual);
            }
          };
        });

        alert('Conta demo recarregada com sucesso!');
        // Recarregar a página para atualizar o saldo
        window.location.reload();

      } catch (error) {
        console.error('[SettingsSidebar] Erro ao recarregar demo:', error);
        let msg = 'Erro ao recarregar conta demo.';
        if (error.message && error.message.includes('TopupVirtual')) {
             msg = error.message; // Mensagens da Deriv geralmente são claras
        }
        alert(msg);
      } finally {
        this.loadingTopup = false;
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
  z-index: 20000;
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

.settings-plan-badge-container {
  margin-top: 6px;
}

.settings-plan-badge {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
}

.settings-plan-badge.free {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
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

/* Switch Small */
.switch-small {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
}

.switch-small input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-small {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2A2A2A;
  transition: .4s;
  border-radius: 18px;
}

.slider-small:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider-small {
  background-color: #22C55E;
}

input:checked + .slider-small:before {
  transform: translateX(14px);
}

</style>

