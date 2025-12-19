/**
 * Mixin para padronizar carregamento de saldo e funcionalidades da sidebar
 * em todas as páginas, igual ao Dashboard
 */
import { loadAccountBalance, reloadAccountBalance } from '../utils/balanceLoader';

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
    preferredCurrencyPrefix() {
      if (this.tradeCurrency === 'DEMO') {
        return 'D$';
      }
      return this.getCurrencyPrefix?.(this.info?.currency || 'USD') || '$';
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
    /**
     * Carrega o saldo da conta usando o balanceLoader
     * Cria o objeto info no mesmo formato que o Dashboard recebe
     */
    async loadAccountBalanceInfo() {
      this.loadingBalance = true;
      try {
        const balanceData = await loadAccountBalance();
        
        if (balanceData) {
          // Criar objeto info no mesmo formato que o Dashboard recebe
          this.info = {
            balance: balanceData.balance,
            currency: balanceData.currency,
            loginid: balanceData.loginid,
            isDemo: balanceData.isDemo,
            balancesByCurrencyReal: balanceData.balancesByCurrencyReal || {},
            balancesByCurrencyDemo: balanceData.balancesByCurrencyDemo || {},
            // Manter compatibilidade
            balanceValue: balanceData.balanceValue || balanceData.balance
          };
          
          // Atualizar accountType baseado no isDemo
          this.accountType = balanceData.isDemo ? 'demo' : 'real';
          
          console.log('[AccountBalanceMixin] Saldo carregado:', this.info);
        } else {
          console.warn('[AccountBalanceMixin] Não foi possível carregar saldo');
          // Criar objeto vazio para evitar erros
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
      } catch (error) {
        console.error('[AccountBalanceMixin] Erro ao carregar saldo:', error);
        this.info = {
          balance: 0,
          currency: 'USD',
          loginid: null,
          isDemo: false,
          balancesByCurrencyReal: {},
          balancesByCurrencyDemo: {},
          balanceValue: 0
        };
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
          this.tradeCurrency = data.tradeCurrency || 'USD';
          // Atualizar accountType baseado no tradeCurrency
          this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
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
          // Atualizar tradeCurrency local imediatamente
          this.tradeCurrency = tradeCurrency;
          this.accountType = type;
          
          // Recarregar saldo para atualizar info
          await this.loadAccountBalanceInfo();
          
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
      const balanceData = await reloadAccountBalance();
      
      if (balanceData) {
        this.info = {
          balance: balanceData.balance,
          currency: balanceData.currency,
          loginid: balanceData.loginid,
          isDemo: balanceData.isDemo,
          balancesByCurrencyReal: balanceData.balancesByCurrencyReal || {},
          balancesByCurrencyDemo: balanceData.balancesByCurrencyDemo || {},
          balanceValue: balanceData.balanceValue || balanceData.balance
        };
        
        this.accountType = balanceData.isDemo ? 'demo' : 'real';
      }
    }
  },
  async mounted() {
    // Carregar tradeCurrency primeiro
    await this.loadTradeCurrency();
    // Depois carregar saldo
    await this.loadAccountBalanceInfo();
  },
  beforeUnmount() {
    // Limpar intervalos
    this.stopBalancePolling();
  }
};

