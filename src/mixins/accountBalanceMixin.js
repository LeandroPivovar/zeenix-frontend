/**
 * Mixin para padronizar carregamento de saldo e funcionalidades da sidebar
 * em todas as páginas, igual ao Dashboard
 */
// Não precisa mais importar balanceLoader, usa a mesma lógica do Dashboard

export default {
  data() {
    return {
      info: null, // Objeto com balance, balancesByCurrencyReal, balancesByCurrencyDemo
      accountType: 'real', // 'real' ou 'demo'
      tradeCurrency: 'USD', // 'USD' ou 'DEMO'
      balanceUpdateInterval: null,
      loadingBalance: false
    };
  },
  computed: {
    balancesByCurrencyReal() {
      return this.info?.balancesByCurrencyReal || {};
    },
    balancesByCurrencyDemo() {
      return this.info?.balancesByCurrencyDemo || {};
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
    preferredCurrencyPrefix() {
      if (this.tradeCurrency === 'DEMO') {
        return 'D$';
      }
      return this.getCurrencyPrefix?.(this.info?.currency || 'USD') || '$';
    },
    balanceNumeric() {
      // Mesma lógica do Dashboard
      const usdReal = this.balancesByCurrencyReal['USD'];
      if (usdReal !== undefined && usdReal !== null && usdReal > 0) {
        return usdReal;
      }
      const raw = this.info?.balance;
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const parsed = Number(raw);
        return isNaN(parsed) ? 0 : parsed;
      }
      const val = raw?.value ?? raw?.balance ?? 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    formattedBalance() {
      // Mesma lógica do Dashboard - usa tradeCurrency para determinar se é demo
      if (this.tradeCurrency === 'DEMO') {
        const demo = this.balancesByCurrencyDemo['USD'] || 0;
        const prefix = this.preferredCurrencyPrefix;
        return `${prefix}${demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      const value = this.balanceNumeric;
      const prefix = this.preferredCurrencyPrefix;
      return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
            // Ignorar erro de parsing
          }
        }
        
        const saved = localStorage.getItem('deriv_connection');
        if (saved && !forceRefresh && hasToken) {
          try {
            const parsed = JSON.parse(saved);
            const maxAge = 60 * 60 * 1000; // 1 hora
            if (Date.now() - parsed.timestamp < maxAge) {
              // Usar dados do cache (igual ao Dashboard)
              this.info = {
                balance: parsed.balance || 0,
                currency: parsed.currency || 'USD',
                loginid: parsed.loginid || null,
                isDemo: parsed.isDemo || false,
                balancesByCurrencyReal: parsed.balancesByCurrencyReal || {},
                balancesByCurrencyDemo: parsed.balancesByCurrencyDemo || {},
                balanceValue: parsed.balance || 0
              };
              
              // Sincronizar accountType com tradeCurrency
              if (this.tradeCurrency === 'DEMO') {
                this.accountType = 'demo';
              } else {
                this.accountType = 'real';
              }
              
              console.log('[AccountBalanceMixin] Saldo carregado do cache (como Dashboard):', {
                balance: this.info.balance,
                loginid: this.info.loginid,
                isDemo: this.info.isDemo,
                tradeCurrency: this.tradeCurrency,
                accountType: this.accountType,
                balancesByCurrencyReal: this.info.balancesByCurrencyReal,
                balancesByCurrencyDemo: this.info.balancesByCurrencyDemo
              });
              
              this.loadingBalance = false;
              return;
            }
          } catch (e) {
            // Se houver erro ao parsear, continua para buscar do backend
          }
        }
        
        // Se não há token, limpar cache e retornar
        if (!hasToken) {
          this.info = {
            balance: 0,
            currency: 'USD',
            loginid: null,
            isDemo: false,
            balancesByCurrencyReal: {},
            balancesByCurrencyDemo: {},
            balanceValue: 0
          };
          this.loadingBalance = false;
          return;
        }
        
        // Buscar da API /broker/deriv/status (igual ao Dashboard)
        const storedAppId = localStorage.getItem('deriv_app_id');
        const derivToken = localStorage.getItem('deriv_token');
        const token = localStorage.getItem('token');
        
        if (!derivToken || !token) {
          this.info = {
            balance: 0,
            currency: 'USD',
            loginid: null,
            isDemo: false,
            balancesByCurrencyReal: {},
            balancesByCurrencyDemo: {},
            balanceValue: 0
          };
          this.loadingBalance = false;
          return;
        }
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const response = await fetch(`${apiBase}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: derivToken,
            appId: storedAppId ? parseInt(storedAppId) : undefined
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data?.loginid) {
            const loginid = data.loginid || '';
            const isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT');
            
            // Criar objeto info no mesmo formato que o Dashboard recebe
            this.info = {
              balance: data.balance || 0,
              currency: data.currency || 'USD',
              loginid: loginid,
              isDemo: isDemo,
              balancesByCurrencyReal: data.balancesByCurrencyReal || {},
              balancesByCurrencyDemo: data.balancesByCurrencyDemo || {},
              balanceValue: data.balance || 0
            };
            
            // Salvar no cache (igual ao Dashboard)
            localStorage.setItem('deriv_connection', JSON.stringify({
              ...data,
              loginid: loginid,
              isDemo: isDemo,
              balancesByCurrencyReal: data.balancesByCurrencyReal || {},
              balancesByCurrencyDemo: data.balancesByCurrencyDemo || {},
              timestamp: Date.now()
            }));
            
            // Sincronizar accountType com tradeCurrency
            if (this.tradeCurrency === 'DEMO') {
              this.accountType = 'demo';
            } else {
              this.accountType = 'real';
            }
            
            console.log('[AccountBalanceMixin] Saldo carregado da API (como Dashboard):', {
              balance: this.info.balance,
              loginid: this.info.loginid,
              isDemo: this.info.isDemo,
              tradeCurrency: this.tradeCurrency,
              accountType: this.accountType,
              balancesByCurrencyReal: this.info.balancesByCurrencyReal,
              balancesByCurrencyDemo: this.info.balancesByCurrencyDemo
            });
          } else {
            this.info = {
              balance: 0,
              currency: 'USD',
              loginid: null,
              isDemo: false,
              balancesByCurrencyReal: {},
              balancesByCurrencyDemo: {},
              balanceValue: 0
            };
          }
        } else {
          // Se falhar, tentar usar cache antigo
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              this.info = {
                balance: parsed.balance || 0,
                currency: parsed.currency || 'USD',
                loginid: parsed.loginid || null,
                isDemo: parsed.isDemo || false,
                balancesByCurrencyReal: parsed.balancesByCurrencyReal || {},
                balancesByCurrencyDemo: parsed.balancesByCurrencyDemo || {},
                balanceValue: parsed.balance || 0
              };
            } catch (e2) {
              this.info = {
                balance: 0,
                currency: 'USD',
                loginid: null,
                isDemo: false,
                balancesByCurrencyReal: {},
                balancesByCurrencyDemo: {},
                balanceValue: 0
              };
            }
          } else {
            this.info = {
              balance: 0,
              currency: 'USD',
              loginid: null,
              isDemo: false,
              balancesByCurrencyReal: {},
              balancesByCurrencyDemo: {},
              balanceValue: 0
            };
          }
        }
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao carregar saldo:', error);
        // Tentar usar cache em caso de erro
        const saved = localStorage.getItem('deriv_connection');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            this.info = {
              balance: parsed.balance || 0,
              currency: parsed.currency || 'USD',
              loginid: parsed.loginid || null,
              isDemo: parsed.isDemo || false,
              balancesByCurrencyReal: parsed.balancesByCurrencyReal || {},
              balancesByCurrencyDemo: parsed.balancesByCurrencyDemo || {},
              balanceValue: parsed.balance || 0
            };
          } catch (e) {
            this.info = {
              balance: 0,
              currency: 'USD',
              loginid: null,
              isDemo: false,
              balancesByCurrencyReal: {},
              balancesByCurrencyDemo: {},
              balanceValue: 0
            };
          }
        } else {
          this.info = {
            balance: 0,
            currency: 'USD',
            loginid: null,
            isDemo: false,
            balancesByCurrencyReal: {},
            balancesByCurrencyDemo: {},
            balanceValue: 0
          };
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
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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
          
          console.log('[AccountBalanceMixin] loadTradeCurrency - Carregado:', {
            tradeCurrency: newTradeCurrency,
            accountType: newAccountType
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
          // Ignorar erro
        }
      }
    },
    
    /**
     * Troca entre conta Real e Demo (igual ao Dashboard)
     */
    async switchAccount(type) {
      try {
        const tradeCurrency = type === 'demo' ? 'DEMO' : 'USD';
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.warn('[AccountBalanceMixin] Token não disponível');
          return;
        }
        
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
          // Atualizar tradeCurrency e accountType local imediatamente ANTES do reload
          // IMPORTANTE: Atualizar accountType primeiro para garantir sincronização
          this.accountType = type;
          this.tradeCurrency = tradeCurrency;
          
          console.log('[AccountBalanceMixin] switchAccount - Atualizado:', { 
            type, 
            tradeCurrency, 
            accountType: this.accountType,
            tradeCurrencyValue: this.tradeCurrency 
          });
          
          // Forçar atualização reativa para garantir que os componentes vejam a mudança
          if (this.$forceUpdate) {
            this.$forceUpdate();
          }
          
          // Pequeno delay para garantir que a atualização seja processada antes do reload
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Recarregar página para aplicar mudanças em todos os componentes
          window.location.reload();
        } else {
          throw new Error('Erro ao alterar moeda');
        }
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao alterar moeda:', error);
        alert('Erro ao alterar moeda. Tente novamente.');
      }
    },
    
    /**
     * Inicia polling de atualização de saldo (opcional)
     */
    startBalancePolling(intervalMs = 30000) {
      if (this.balanceUpdateInterval) {
        clearInterval(this.balanceUpdateInterval);
      }
      
      this.balanceUpdateInterval = setInterval(async () => {
        await this.loadAccountBalanceInfo();
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
    }
  },
  async mounted() {
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
    
    // Depois carregar saldo (forçar recarregamento na primeira vez para garantir dados atualizados)
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
  },
  beforeUnmount() {
    // Limpar intervalos
    this.stopBalancePolling();
  }
};

