/**
 * Mixin para padronizar carregamento de saldo e funcionalidades da sidebar
 * em todas as páginas, igual ao Dashboard
 */
// Não precisa mais importar balanceLoader, usa a mesma lógica do Dashboard
import { loadAvailableAccounts } from '../utils/accountsLoader';

export default {
  data() {
    return {
      info: null, // Objeto com balance, balancesByCurrencyReal, balancesByCurrencyDemo
      accountType: 'real', // 'real' ou 'demo'
      tradeCurrency: 'USD', // 'USD' ou 'DEMO'
      balanceUpdateInterval: null,
      loadingBalance: false,
      isBalanceReady: false,
      isFictitiousBalanceActive: false,
      fictitiousBalance: 0,
      planFeatures: null
    };
  },
  computed: {
    balancesByCurrencyReal() {
      if (!this.info) return {};
      // 1. Tentar camelCase direto
      if (this.info.balancesByCurrencyReal && Object.keys(this.info.balancesByCurrencyReal).length > 0) return this.info.balancesByCurrencyReal;
      // 2. Tentar snake_case diretivo
      if (this.info.balances_by_currency_real && Object.keys(this.info.balances_by_currency_real).length > 0) return this.info.balances_by_currency_real;
      // 3. Tentar extrair do root se for apenas um par {currency: balance}
      if (this.info.currency === 'USD' && this.info.balance !== undefined) return { 'USD': this.info.balance };
      // 4. Tentar extrair de raw.accounts (muito comum vir aqui)
      if (this.info.raw?.accounts) {
        const balances = {};
        Object.values(this.info.raw.accounts).forEach(acc => {
          if (acc.demo_account !== 1 && acc.demo_account !== true) {
            balances[acc.currency || 'USD'] = parseFloat(acc.balance) || 0;
          }
        });
        if (Object.keys(balances).length > 0) return balances;
      }
      return {};
    },
    balancesByCurrencyDemo() {
      if (!this.info) return {};
      if (this.info.balancesByCurrencyDemo && Object.keys(this.info.balancesByCurrencyDemo).length > 0) return this.info.balancesByCurrencyDemo;
      if (this.info.balances_by_currency_demo && Object.keys(this.info.balances_by_currency_demo).length > 0) return this.info.balances_by_currency_demo;
      if (this.info.raw?.accounts) {
        const balances = {};
        Object.values(this.info.raw.accounts).forEach(acc => {
          if (acc.demo_account === 1 || acc.demo_account === true) {
            balances[acc.currency || 'USD'] = parseFloat(acc.balance) || 0;
          }
        });
        if (Object.keys(balances).length > 0) return balances;
      }
      return {};
    },
    // Computed para retornar o saldo correto baseado no accountType atual
    // Isso garante que o balance passado para TopNavbar seja o correto
    currentBalance() {
      if (!this.info) return null;

      // Se for demo, retornar o saldo demo
      if (this.accountType === 'demo') {
        const demoBalance = this.balancesByCurrencyDemo['USD'];
        if (demoBalance !== undefined && demoBalance !== null) {
          return {
            ...this.info,
            balance: demoBalance,
            isDemo: true
          };
        }
      }

      // Se for real, retornar o saldo real
      const realBalance = this.balancesByCurrencyReal['USD'];
      if (realBalance !== undefined && realBalance !== null) {
        return {
          ...this.info,
          balance: realBalance,
          isDemo: false
        };
      }

      // Fallback para o saldo original
      return this.info;
    },
    uiAccountType() {
      // Se saldo fictício estiver ativo, mascarar como 'real'
      if (this.isFictitiousBalanceActive) {
        return 'real';
      }
      return this.accountType;
    },
    preferredCurrencyPrefix() {
      // Se saldo fictício estiver ativo, forçar prefixo '$' (mascarar conta Real)
      if (this.isFictitiousBalanceActive) {
        return '$';
      }
      if (this.tradeCurrency === 'DEMO') {
        return 'Đ';
      }
      return this.getCurrencyPrefix?.(this.info?.currency || 'USD') || '$';
    },
    balanceNumeric() {
      let baseBalance = 0;

      // 1. Calcular Saldo Base (Real vs Demo)
      if (this.accountType === 'demo') {
        const demoAmountFromBackend = this.info?.demo_amount !== undefined ? Number(this.info.demo_amount) : undefined;
        const demoBalanceUSD = this.balancesByCurrencyDemo['USD'];

        if (demoAmountFromBackend !== undefined) {
          baseBalance = demoAmountFromBackend;
        } else if (demoBalanceUSD !== undefined && demoBalanceUSD !== null) {
          baseBalance = Number(demoBalanceUSD);
        } else {
          // Último recurso: somar todos os saldos demo
          baseBalance = Object.values(this.balancesByCurrencyDemo).reduce((acc, val) => acc + (Number(val) || 0), 0);
        }
      } else {
        // Lógica para conta Real
        // Prioridade 1: real_amount do backend
        if (this.info?.real_amount !== undefined && this.info?.real_amount !== null && Number(this.info.real_amount) > 0) {
          baseBalance = Number(this.info.real_amount);
        } else {
          // Prioridade 2: Saldo USD Real
          const usdReal = this.balancesByCurrencyReal['USD'];
          if (usdReal !== undefined && usdReal !== null && Number(usdReal) > 0) {
            baseBalance = Number(usdReal);
          } else {
            // Prioridade 3: Qualquer moeda real que tenha saldo > 0
            let found = false;
            for (const balance of Object.values(this.balancesByCurrencyReal)) {
              if (Number(balance) > 0) {
                baseBalance = Number(balance);
                found = true;
                break;
              }
            }

            // Prioridade 4: BTC Real (se não encontrou outro)
            if (!found) {
              const btcReal = this.balancesByCurrencyReal['BTC'];
              if (btcReal !== undefined && btcReal !== null) {
                baseBalance = Number(btcReal);
              }
            }
          }
        }
      }

      // Fallback: Prioridade 5: Saldo principal do objeto info (se baseBalance ainda for 0)
      if (baseBalance === 0) {
        const raw = this.info?.balance;
        if (typeof raw === 'number') {
          baseBalance = raw;
        } else if (typeof raw === 'string') {
          const parsed = Number(raw);
          baseBalance = isNaN(parsed) ? 0 : parsed;
        } else {
          // Tratamento de objetos {value, balance}
          const val = raw?.value ?? raw?.balance ?? 0;
          const num = Number(val);
          baseBalance = isNaN(num) ? 0 : num;
        }
      }

      // 2. Adicionar Saldo Fictício (Master Trader)
      // O saldo fictício é SOMADO ao saldo existente, não substituído.
      if (this.isFictitiousBalanceActive) {
        baseBalance += (Number(this.fictitiousBalance) || 0);
      }

      return baseBalance;
    },
    formattedBalance() {
      const value = this.balanceNumeric;
      const prefix = this.preferredCurrencyPrefix;

      // Se saldo fictício estiver ativo, formatar como real (2 casas)
      if (this.isFictitiousBalanceActive) {
        return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      // Mesma lógica do Dashboard - usa tradeCurrency para determinar se é demo
      if (this.tradeCurrency === 'DEMO') {
        return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }

      // Formatação para Real - detectar se é BTC para usar 8 casas
      const currency = this.info?.currency || 'USD';
      const isCrypto = ['BTC', 'ETH', 'LTC', 'USDC', 'UST'].includes(currency.toUpperCase()) || prefix === '₿' || prefix === 'Ξ';
      const decimals = isCrypto ? (currency === 'BTC' ? 8 : 4) : 2;

      return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    }
  },
  methods: {
    getCurrencyPrefix(currency) {
      const prefixes = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'BTC': '₿',
        'ETH': 'Ξ'
      };
      return prefixes[currency?.toUpperCase()] || '$';
    },
    /**
     * Carrega o saldo da conta - EXATAMENTE como o Dashboard faz
     * Copia a lógica do HomeView.checkConnection
     */
    async loadAccountBalanceInfo(forceRefresh = false) {
      this.loadingBalance = true;
      try {
        // MESMA LÓGICA DO HomeView.checkConnection
        // Verificar se há token válido antes de usar cache
        let hasToken = !!localStorage.getItem('deriv_token');
        if (!hasToken) {
          try {
            const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid');
            if (tokensByLoginId) {
              const parsed = JSON.parse(tokensByLoginId);
              hasToken = Object.keys(parsed).length > 0;
            }
          } catch (e) {
            console.error('[AccountBalanceMixin] Erro ao parsear tokensByLoginId:', e);
          }
        }

        console.log('[AccountBalanceMixin] hasToken check:', {
          hasToken,
          deriv_token: !!localStorage.getItem('deriv_token'),
          hasTokensByLoginId: !!localStorage.getItem('deriv_tokens_by_loginid')
        });

        const saved = localStorage.getItem('deriv_connection');
        if (saved && !forceRefresh && hasToken) {
          try {
            const parsed = JSON.parse(saved);
            const maxAge = 60 * 60 * 1000; // 1 hora
            if (Date.now() - parsed.timestamp < maxAge) {
              // Usar dados do cache completo (igual ao Dashboard)
              this.info = {
                ...parsed,
                balance: parsed.balance ?? parsed.balanceValue ?? 0,
                currency: parsed.currency || 'USD',
                isDemo: parsed.isDemo ?? (parsed.loginid?.startsWith('VRT')) ?? false
              };

              // Sincronizar accountType com tradeCurrency
              this.tradeCurrency = parsed.tradeCurrency || (parsed.isDemo ? 'DEMO' : 'USD');
              this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';

              console.log('[AccountBalanceMixin] Saldo carregado do cache (como Dashboard):', {
                balance: this.info.balance,
                loginid: this.info.loginid,
                isDemo: this.info.isDemo,
                accountType: this.accountType,
                tradeCurrency: this.tradeCurrency
              });

              this.loadingBalance = false;
              return;
            }
          } catch (e) {
            console.error('[AccountBalanceMixin] Erro ao processar cache:', e);
          }
        }

        // Se não há token, limpar cache e retornar
        if (!hasToken) {
          console.warn('[AccountBalanceMixin] ⚠️ Nenhum token Deriv encontrado. Abortando busca.');
          this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
          this.loadingBalance = false;
          return;
        }

        // Buscar da API /broker/deriv/status (igual ao Dashboard)
        const storedAppId = localStorage.getItem('deriv_app_id');
        let derivToken = localStorage.getItem('deriv_token');

        // Se não tiver deriv_token, tentar pegar do deriv_connection (mais robusto)
        if (!derivToken && saved) {
          try {
            const parsed = JSON.parse(saved);
            derivToken = parsed.token || parsed.derivToken;
          } catch (e) {
            // Ignorar erro de parsing de cache
          }
        }

        const token = localStorage.getItem('token');

        console.log('[AccountBalanceMixin] Iniciando busca na API...', { hasDerivToken: !!derivToken, hasToken: !!token });

        if (!token) {
          console.warn('[AccountBalanceMixin] ⚠️ Token do sistema ausente. Abortando busca.');
          this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
          this.loadingBalance = false;
          return;
        }

        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const response = await fetch(`${apiBase}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: derivToken || undefined,
            appId: storedAppId ? parseInt(storedAppId) : undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[AccountBalanceMixin] Resposta da API /broker/deriv/status:', data);
          if (data?.loginid) {
            const loginid = data.loginid || '';
            const isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT');

            // Salvar objeto completo no info (igual ao Dashboard)
            this.info = {
              ...data,
              loginid: loginid,
              isDemo: isDemo,
              balance: data.balance ?? data.balanceValue ?? 0
            };

            // Salvar no cache (igual ao Dashboard)
            const cacheData = {
              ...data,
              loginid: loginid,
              isDemo: isDemo,
              timestamp: Date.now()
            };
            localStorage.setItem('deriv_connection', JSON.stringify(cacheData));

            console.log('[AccountBalanceMixin] Cache atualizado:', cacheData);

            // Corrigido: Usar isDemo da API para determinar tradeCurrency, não o localStorage
            // O localStorage pode estar desatualizado se a troca de conta foi recente
            this.tradeCurrency = isDemo ? 'DEMO' : 'USD';
            this.accountType = isDemo ? 'demo' : 'real';

            // Atualizar localStorage para manter sincronia
            localStorage.setItem('trade_currency', this.tradeCurrency);
            console.log('[AccountBalanceMixin] Saldo carregado da API - LOGINID:', loginid, 'Type:', this.accountType);
          } else {
            console.warn('[AccountBalanceMixin] ⚠️ API retornou status OK mas sem LOGINID:', data);
            this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
          }
        } else {
          console.error('[AccountBalanceMixin] ❌ Erro na API broker/deriv/status:', response.status);
          // Se falhar, tentar usar cache antigo
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              this.info = { ...parsed, balance: parsed.balance ?? parsed.balanceValue ?? 0 };
            } catch (e2) {
              this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
            }
          } else {
            this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
          }
        }
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao carregar saldo:', error);
        // Tentar usar cache em caso de erro
        const saved = localStorage.getItem('deriv_connection');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            this.info = { ...parsed, balance: parsed.balance ?? parsed.balanceValue ?? 0 };
          } catch (e) {
            this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
          }
        } else {
          this.info = { balance: 0, currency: 'USD', loginid: null, isDemo: false };
        }
      } finally {
        this.loadingBalance = false;
      }
    },

    /**
     * Carrega o tradeCurrency do settings (igual ao Dashboard)
     */
    async loadTradeCurrency() {
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const token = localStorage.getItem('token');

        if (!token) {
          console.warn('[AccountBalanceMixin] Token não disponível');
          return;
        }

        const response = await fetch(`${apiBase}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const newTradeCurrency = data.tradeCurrency || 'USD';
          this.tradeCurrency = newTradeCurrency;
          // Atualizar accountType baseado no tradeCurrency
          const newAccountType = newTradeCurrency === 'DEMO' ? 'demo' : 'real';
          this.accountType = newAccountType;
          this.planFeatures = data.planFeatures || null;

          console.log('[AccountBalanceMixin] loadTradeCurrency - Carregado:', {
            tradeCurrency: newTradeCurrency,
            accountType: newAccountType,
            hasPlanFeatures: !!this.planFeatures
          });
        }
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao carregar tradeCurrency:', error);
        // Fallback: tentar pegar do deriv_connection
        try {
          const connectionStr = localStorage.getItem('deriv_connection');
          if (connectionStr) {
            const connection = JSON.parse(connectionStr);
            if (connection.tradeCurrency) {
              this.tradeCurrency = connection.tradeCurrency;
              this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
            }
          }
        } catch (e) {
          // Ignorar erro ao buscar do backup
        }
      }
    },

    /**
     * Carrega configurações do Master Trader (Saldo Fictício)
     */
    async loadMasterTraderSettings() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
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
          console.log('[AccountBalanceMixin] Configurações Master Trader carregadas:', {
            active: this.isFictitiousBalanceActive,
            amount: this.fictitiousBalance
          });
        }
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao carregar configurações de Master Trader:', error);
      }
    },

    handleMasterTraderUpdate(event) {
      if (event.detail) {
        this.fictitiousBalance = event.detail.fictitiousBalance || this.fictitiousBalance;
        this.isFictitiousBalanceActive = event.detail.isFictitiousBalanceActive !== undefined ? event.detail.isFictitiousBalanceActive : this.isFictitiousBalanceActive;
      }
    },

    handleFictitiousBalanceChange(event) {
      const { enabled, amount } = event.detail;
      this.isFictitiousBalanceActive = enabled;
      this.fictitiousBalance = amount;
    },

    // ✅ Real-time Balance Synchronization Handler
    handleGlobalBalanceUpdate(event) {
      if (event.detail && event.detail.balance !== undefined) {
        const newBalance = event.detail.balance;
        // Avoid cycle if the change is negligible
        if (Math.abs(newBalance - this.balanceNumeric) < 0.0001) return;

        console.log('[AccountBalanceMixin] Syncing local balance with global update:', newBalance);

        // Calculate adjusted base balance (real vs demo)
        let adjustedBase = newBalance;
        if (this.isFictitiousBalanceActive && this.accountType === 'demo') {
          adjustedBase = newBalance - (Number(this.fictitiousBalance) || 0);
        }

        // Update local state components to reflect the synchronized balance
        if (!this.info) this.info = {};

        if (this.accountType === 'demo') {
          this.info.demo_amount = adjustedBase;
          if (this.balancesByCurrencyDemo) this.balancesByCurrencyDemo['USD'] = adjustedBase;
        } else {
          this.info.real_amount = adjustedBase;
          if (this.balancesByCurrencyReal) this.balancesByCurrencyReal['USD'] = adjustedBase;
        }

        this.info.balance = adjustedBase;
      }
    },

    /**
     * Troca entre conta Real e Demo (igual ao Dashboard)
     */
    async switchAccount(type) {
      try {
        if (this.isFictitiousBalanceActive) {
          console.log('[AccountBalanceMixin] Saldo fictício ativo - ignorando troca de conta. UI já mostra como Real.');
          return;
        }

        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const token = localStorage.getItem('token');

        if (!token) {
          console.warn('[AccountBalanceMixin] Token não disponível');
          return;
        }

        const isDemo = type === 'demo';
        let selectedToken = null;

        // Estratégia 1: Tentar encontrar em availableAccounts (se já tiver sido carregado)
        // O mixin não tem availableAccounts no data, mas podemos tentar carregar
        console.log('[AccountBalanceMixin] Carregando contas disponíveis para encontrar token...');
        try {
          const accounts = await loadAvailableAccounts(false);
          if (accounts && accounts.length > 0) {
            const targetAccount = accounts.find(acc => acc.isDemo === isDemo);
            if (targetAccount && targetAccount.token) {
              selectedToken = targetAccount.token;
              console.log('[AccountBalanceMixin] Token encontrado em accountsLoader para', type, ':', targetAccount.loginid);
            }
          }
        } catch (loaderError) {
          console.error('[AccountBalanceMixin] Erro ao carregar contas via loader:', loaderError);
        }

        // Estratégia 2: Fallback para localStorage legado
        if (!selectedToken) {
          console.log('[AccountBalanceMixin] Tentando fallback para localStorage...');
          const derivConnectionStr = localStorage.getItem('deriv_connection');
          if (derivConnectionStr) {
            try {
              const derivConnection = JSON.parse(derivConnectionStr);
              const tokensByLoginId = derivConnection.tokensByLoginId;
              const accountsByCurrency = derivConnection.accountsByCurrency;

              if (accountsByCurrency && tokensByLoginId) {
                for (const currency in accountsByCurrency) {
                  const accounts = accountsByCurrency[currency];
                  if (Array.isArray(accounts)) {
                    const targetAccount = accounts.find(acc => acc.isDemo === isDemo);
                    if (targetAccount && targetAccount.loginid && tokensByLoginId[targetAccount.loginid]) {
                      selectedToken = tokensByLoginId[targetAccount.loginid];
                      console.log('[AccountBalanceMixin] Token encontrado no cache legado para', type);
                      break;
                    }
                  }
                }
              }
            } catch (e) {
              // Ignorar erros de parsing
            }
          }
        }

        // Se encontrou token, salvar corretamente
        if (selectedToken) {
          const response = await fetch(`${apiBase}/settings/deriv-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              token: selectedToken,
              tradeCurrency: type === 'demo' ? 'DEMO' : 'USD'
            })
          });

          if (response.ok) {
            localStorage.setItem('deriv_token', selectedToken);
            this.accountType = type;
            this.tradeCurrency = type === 'demo' ? 'DEMO' : 'USD';
            console.log('[AccountBalanceMixin] ✅ Conta e token sincronizados com sucesso');
            window.location.reload();
            return;
          }
        }

        // Fallback final: apenas atualizar moeda
        console.warn('[AccountBalanceMixin] ⚠️ Token não encontrado, tentando atualizar apenas moeda...');
        const response = await fetch(`${apiBase}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tradeCurrency: type === 'demo' ? 'DEMO' : 'USD'
          })
        });

        if (response.ok) {
          this.accountType = type;
          this.tradeCurrency = type === 'demo' ? 'DEMO' : 'USD';
          window.location.reload();
        } else {
          throw new Error('Erro ao alterar conta');
        }
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao alterar conta:', error);
        await alert('Erro ao alterar conta. Tente novamente.');
      }
    },

    /**
     * Inicia polling de atualização de saldo (opcional)
     */
    startBalancePolling(intervalMs = 5000) {
      if (this.balanceUpdateInterval) {
        clearInterval(this.balanceUpdateInterval);
      }

      this.balanceUpdateInterval = setInterval(async () => {
        await this.loadAccountBalanceInfo(true);
      }, intervalMs);
    },

    /**
     * Para o polling de atualização de saldo
     */
    stopBalancePolling() {
      if (this.balanceUpdateInterval) {
        clearInterval(this.balanceUpdateInterval);
        this.balanceUpdateInterval = null;
      }
    },

    /**
     * Recarrega o saldo forçando atualização (ignora cache)
     */
    async reloadBalance() {
      // Forçar recarregamento ignorando cache
      await this.loadAccountBalanceInfo(true);
    },
  },
  watch: {
    info(newInfo) {
      console.log('[AccountBalanceMixin] INFO ATUALIZADO:', {
        balance: newInfo?.balance,
        currency: newInfo?.currency,
        realUSD: newInfo?.balancesByCurrencyReal?.['USD'],
        demoUSD: newInfo?.balancesByCurrencyDemo?.['USD']
      });
    },
    accountType(newType, oldType) {
      // Quando accountType muda, garantir que o info está sincronizado
      if (this.info && newType !== oldType) {
        // O TopNavbar já usa balancesByCurrencyReal/Demo corretamente
        // Mas podemos atualizar o info.balance para refletir o tipo correto
        if (newType === 'demo') {
          this.info.isDemo = true;
        } else {
          this.info.isDemo = false;
        }
        console.log('[AccountBalanceMixin] accountType mudou:', { oldType, newType, info: this.info });
      }
    },
    tradeCurrency(newCurrency, oldCurrency) {
      // Quando tradeCurrency muda, atualizar accountType
      if (newCurrency !== oldCurrency) {
        const newAccountType = newCurrency === 'DEMO' ? 'demo' : 'real';
        if (this.accountType !== newAccountType) {
          this.accountType = newAccountType;
          console.log('[AccountBalanceMixin] tradeCurrency mudou, accountType atualizado:', { tradeCurrency: newCurrency, accountType: newAccountType });
        }
      }
    },
    // ✅ Real-time Balance Synchronization
    // Emit global event when balance changes for cross-component sync
    balanceNumeric(newVal, oldVal) {
      if (newVal !== oldVal && newVal !== undefined && newVal !== null) {
        console.log('[AccountBalanceMixin] Balance changed:', oldVal, '->', newVal);
        // Emit global event for components to sync
        window.dispatchEvent(new CustomEvent('balanceUpdated', {
          detail: { balance: newVal, timestamp: Date.now() }
        }));
      }
    }
  },
  async mounted() {
    this.loadingBalance = true; // Forçar loading inicial para evitar glitch

    // Carregar configurações de Master Trader
    await this.loadMasterTraderSettings();

    // Ouvir eventos de atualização de saldo fictício
    window.addEventListener('masterTraderSettingsUpdated', (e) => this.handleMasterTraderUpdate(e));
    window.addEventListener('fictitiousBalanceChanged', (e) => this.handleFictitiousBalanceChange(e));
    window.addEventListener('refreshBalance', () => this.reloadBalance());
    window.addEventListener('balanceUpdated', this.handleGlobalBalanceUpdate);

    // Carregar tradeCurrency primeiro para garantir que accountType está correto
    await this.loadTradeCurrency();

    // Garantir que accountType está sincronizado com tradeCurrency
    // Isso é importante caso o loadTradeCurrency não tenha atualizado corretamente
    if (this.tradeCurrency === 'DEMO' && this.accountType !== 'demo') {
      this.accountType = 'demo';
    } else if (this.tradeCurrency !== 'DEMO' && this.accountType !== 'real') {
      this.accountType = 'real';
    }

    console.log('[AccountBalanceMixin] mounted - Estado inicial:', {
      tradeCurrency: this.tradeCurrency,
      accountType: this.accountType
    });

    // Depois carregar saldo (forçar recarregamento na primeira vez, igual ao Dashboard/HomeView)
    await this.loadAccountBalanceInfo(true);

    // Após carregar saldo, garantir novamente que accountType está correto
    // baseado no tradeCurrency (não no isDemo do saldo carregado)
    if (this.tradeCurrency === 'DEMO') {
      this.accountType = 'demo';
    } else {
      this.accountType = 'real';
    }

    console.log('[AccountBalanceMixin] mounted - Estado final:', {
      tradeCurrency: this.tradeCurrency,
      accountType: this.accountType,
      hasInfo: !!this.info,
      balancesByCurrencyReal: this.balancesByCurrencyReal,
      balancesByCurrencyDemo: this.balancesByCurrencyDemo
    });

    // Pequeno atraso artificial para garantir que a UI não mostre valores intermediários
    // Isso resolve o glitch visual do "pulo" do saldo fictício
    setTimeout(() => {
      this.isBalanceReady = true;
      this.loadingBalance = false;
    }, 500);
  },
  beforeUnmount() {
    // Limpar intervalos
    this.stopBalancePolling();
    window.removeEventListener('masterTraderSettingsUpdated', this.handleMasterTraderUpdate);
    window.removeEventListener('fictitiousBalanceChanged', this.handleFictitiousBalanceChange);
    window.removeEventListener('balanceUpdated', this.handleGlobalBalanceUpdate);
  }
};

