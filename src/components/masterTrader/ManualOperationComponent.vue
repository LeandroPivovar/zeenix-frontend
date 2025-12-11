<template>
  <div class="manual-operation-container">
    <div class="view-toggle-bar-wrapper">
      <div class="view-toggle-bar">
        <button
          class="px-6 py-3 bg-zenix-card text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
          :class="{ 'border-b-2 border-zenix-green text-zenix-text font-semibold shadow-[0_0_8px_rgba(0,0,0,0.25)]': currentView === 'OperationChart', 'border-b-2 border-transparent text-[#7A7A7A]': currentView !== 'OperationChart' }"
          @click="changeView('OperationChart')"
        >
          Análise gráfica
        </button>
        <button
          class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
          :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationDigits', 'border-b-2 border-transparent': currentView !== 'OperationDigits' }"
          @click="changeView('OperationDigits')"
        >
          Análise de dígitos
        </button>
        <button
          class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
          :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationLogs', 'border-b-2 border-transparent': currentView !== 'OperationLogs' }"
          @click="changeView('OperationLogs')"
        >
          Registro
        </button>
        <button
          class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
          :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationLastOrders', 'border-b-2 border-transparent': currentView !== 'OperationLastOrders' }"
          @click="changeView('OperationLastOrders')"
        >
          Últimas Ordens
        </button>
      </div>
    </div>

    <div class="operation-content">
      <component
        :is="currentView"
        :account-balance="accountBalanceFormatted"
        :account-balance-value="accountBalanceValue"
        :account-currency="accountCurrency"
        :preferred-currency="preferredCurrency"
        :account-loginid="accountLoginId"
        :order-config="orderConfig"
        :trade-results="lastOrdersFormatted"
        @trade-result="handleTradeResult"
      ></component>
    </div>
  </div>
</template>

<script>
import OperationChart from '../OperationChart.vue';
import OperationDigits from '../OperationDigits.vue';
import OperationLogs from '../OperationLogs.vue';
import OperationLastOrders from '../OperationLastOrders.vue';

export default {
  name: 'ManualOperationComponent',
  components: {
    OperationChart,
    OperationDigits,
    OperationLogs,
    OperationLastOrders
  },
  data() {
    return {
      currentView: 'OperationChart',
      accountBalanceValue: null,
      accountCurrency: null,
      preferredCurrency: 'USD',
      accountLoginId: null,
      orderConfig: {
        type: 'Up/Down',
        time: '1 Minuto',
        value: 10.0,
      },
      lastOrders: [],
      loadingConnection: false,
      accountType: 'real', // 'real' ou 'demo'
    };
  },
  computed: {
    accountBalanceFormatted() {
      if (this.accountBalanceValue == null) return '---';
      return this.formatCurrency(this.accountBalanceValue, this.accountCurrency);
    },
    lastOrdersFormatted() {
      if (!this.lastOrders || !Array.isArray(this.lastOrders)) {
        return [];
      }
      return this.lastOrders.map(order => {
        const displayValue =
          order.buyPrice != null || order.entryPrice != null || order.price != null
            ? this.formatCurrency(order.buyPrice || order.entryPrice || order.price, order.currency || this.accountCurrency)
            : '--';
        const displayProfit =
          order.profit != null
            ? this.formatCurrency(order.profit, order.currency || this.accountCurrency)
            : '--';
        return {
          ...order,
          displayValue,
          displayProfit,
          value: displayValue,
          result: order.status || order.result || 'EXECUTED',
        };
      });
    },
  },
  methods: {
    handleAccountTypeChange(newAccountType) {
      // Alterna entre demo e real
      this.accountType = newAccountType;
      console.log('[ManualOperation] Tipo de conta alterado para:', this.accountType);
      
      // Recarrega a conexão para atualizar os dados da conta correta
      this.checkConnection(true);
    },
    formatCurrency(value, currency) {
      try {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'USD',
          minimumFractionDigits: currency === 'BTC' ? 8 : 2,
        }).format(Number(value));
      } catch (error) {
        return `${currency || 'USD'} ${Number(value).toFixed(2)}`;
      }
    },
    changeView(componentName) {
      this.currentView = componentName;
    },
    async checkConnection(forceRefresh = false) {
      console.log('[ManualOperation] ========== VERIFICANDO CONEXÃO ==========');
      console.log('[ManualOperation] forceRefresh:', forceRefresh);
      
      const saved = localStorage.getItem('deriv_connection');
      console.log('[ManualOperation] Conexão salva no localStorage:', saved ? 'Sim' : 'Não');
      
      if (!forceRefresh && saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('[ManualOperation] Usando conexão salva (cache)');
          this.applyConnectionSnapshot(parsed);
          return;
        } catch (error) {
          console.warn('[ManualOperation] Erro ao parsear conexão salva:', error);
          // ignore parsing issues
        }
      }

      this.loadingConnection = true;
      console.log('[ManualOperation] Buscando status atualizado do backend...');
      
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const requestBody = {
          token: localStorage.getItem('deriv_token') || undefined,
          appId: localStorage.getItem('deriv_app_id')
            ? Number(localStorage.getItem('deriv_app_id'))
            : undefined,
        };
        
        console.log('[ManualOperation] Requisição para /broker/deriv/status:', {
          url: `${apiBaseUrl}/broker/deriv/status`,
          body: requestBody
        });
        
        const res = await fetch(`${apiBaseUrl}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('[ManualOperation] Resposta do backend:', {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[ManualOperation] Erro na resposta:', errorText);
          throw new Error('Não foi possível atualizar o status da Deriv');
        }

        const data = await res.json();
        console.log('[ManualOperation] Dados recebidos do backend:', JSON.stringify(data, null, 2));
        
        const snapshot = { ...data, timestamp: Date.now() };
        this.applyConnectionSnapshot(snapshot);
        localStorage.setItem('deriv_connection', JSON.stringify(snapshot));
        console.log('[ManualOperation] Conexão atualizada e salva no localStorage');
      } catch (error) {
        console.error('[ManualOperation] Erro ao verificar conexão:', error);
        if (saved) {
          console.log('[ManualOperation] Tentando restaurar conexão salva...');
          try {
            this.applyConnectionSnapshot(JSON.parse(saved));
          } catch (err) {
            console.warn('[ManualOperation] Falha ao restaurar conexão Deriv local:', err);
          }
        }
      } finally {
        this.loadingConnection = false;
        console.log('[ManualOperation] ========== VERIFICAÇÃO DE CONEXÃO FINALIZADA ==========');
      }
    },
    applyConnectionSnapshot(snapshot) {
      console.log('[ManualOperation] ========== APLICANDO SNAPSHOT DE CONEXÃO ==========');
      console.log('[ManualOperation] Snapshot completo:', JSON.stringify(snapshot, null, 2));
      
      if (!snapshot) {
        console.warn('[ManualOperation] Snapshot vazio ou null');
        return;
      }
      
      const balanceValue = snapshot?.balance?.value ?? snapshot.balanceAfter ?? null;
      const currency = snapshot?.currency ?? snapshot?.balance?.currency ?? this.accountCurrency;
      const preferredCurrency = snapshot?.preferredCurrency ?? 'USD';
      const loginid = snapshot?.loginid ?? null;
      
      console.log('[ManualOperation] Valores extraídos:', {
        balanceValue,
        currency,
        preferredCurrency,
        loginid
      });
      
      if (balanceValue != null) {
        this.accountBalanceValue = Number(balanceValue);
        console.log('[ManualOperation] Saldo atualizado:', this.accountBalanceValue);
      }
      if (currency) {
        this.accountCurrency = currency.toUpperCase();
        console.log('[ManualOperation] Moeda da conta atualizada:', this.accountCurrency);
      }
      if (preferredCurrency) {
        this.preferredCurrency = preferredCurrency.toUpperCase();
        console.log('[ManualOperation] Moeda preferida atualizada:', this.preferredCurrency);
      }
      if (loginid) {
        this.accountLoginId = loginid;
        // Determinar tipo de conta (demo ou real) baseado no loginid
        this.accountType = (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) ? 'demo' : 'real';
        console.log('[ManualOperation] LoginID atualizado:', this.accountLoginId);
        console.log('[ManualOperation] Tipo de conta:', this.accountType);
      }
      
      // Armazenar tokens retornados pelo backend no localStorage
      if (snapshot?.tokensByLoginId && Object.keys(snapshot.tokensByLoginId).length > 0) {
        console.log('[ManualOperation] Tokens recebidos do backend:', Object.keys(snapshot.tokensByLoginId));
        localStorage.setItem('deriv_tokens_by_loginid', JSON.stringify(snapshot.tokensByLoginId));
        console.log('[ManualOperation] Tokens armazenados no localStorage');
      } else {
        // Se o backend não retornou tokens, verificar se já existem no localStorage
        const existingTokens = localStorage.getItem('deriv_tokens_by_loginid');
        if (existingTokens) {
          try {
            const parsed = JSON.parse(existingTokens);
            if (Object.keys(parsed).length > 0) {
              console.log('[ManualOperation] Tokens não recebidos do backend, mas encontrados no localStorage:', Object.keys(parsed));
              console.log('[ManualOperation] Usando tokens existentes do localStorage');
            } else {
              console.warn('[ManualOperation] Tokens no localStorage estão vazios');
            }
          } catch (e) {
            console.warn('[ManualOperation] Erro ao parsear tokens do localStorage:', e);
          }
        } else {
          console.warn('[ManualOperation] Nenhum token encontrado no backend nem no localStorage');
          console.warn('[ManualOperation] O usuário precisa reconectar via OAuth para armazenar os tokens');
        }
      }
      
      console.log('[ManualOperation] Estado final:', {
        accountBalanceValue: this.accountBalanceValue,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginId: this.accountLoginId,
        hasTokensByLoginId: !!snapshot?.tokensByLoginId
      });
      console.log('[ManualOperation] ========== SNAPSHOT APLICADO ==========');
    },
    handleTradeResult(result) {
      console.log('[ManualOperation] ========== RESULTADO DA OPERAÇÃO RECEBIDO ==========');
      console.log('[ManualOperation] Resultado completo:', JSON.stringify(result, null, 2));
      console.log('[ManualOperation] Estado atual da view:', {
        accountBalanceValue: this.accountBalanceValue,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginId: this.accountLoginId
      });
      
      if (result?.balanceAfter != null) {
        console.log('[ManualOperation] Atualizando saldo:', {
          anterior: this.accountBalanceValue,
          novo: Number(result.balanceAfter)
        });
        this.accountBalanceValue = Number(result.balanceAfter);
        this.persistConnectionBalance(
          result.balanceAfter,
          result.currency || this.accountCurrency,
        );
      }

      const timestamp = result.purchaseTime
        ? new Date(result.purchaseTime * 1000).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

      // Se o status for CLOSED e tiver contractId, tentar atualizar ordem existente
      if (result.status === 'CLOSED' && result.contractId) {
        const existingOrderIndex = this.lastOrders.findIndex(
          order => order.contractId === result.contractId
        );
        
        if (existingOrderIndex !== -1) {
          // Atualizar ordem existente com o profit
          this.lastOrders[existingOrderIndex].profit = result.profit != null ? Number(result.profit) : null;
          console.log('[ManualOperation] Ordem existente atualizada com lucro:', this.lastOrders[existingOrderIndex]);
          return;
        }
      }

      const orderEntry = {
        time: timestamp,
        type: result.direction || 'CALL',
        price: result.buyPrice != null ? Number(result.buyPrice) : null,
        profit: result.profit != null ? Number(result.profit) : null,
        currency: result.currency || this.accountCurrency,
        status: result.status || 'EXECUTED',
        longcode: result.longcode || '',
        contractId: result.contractId || null,
      };

      console.log('[ManualOperation] Adicionando ordem ao histórico:', orderEntry);
      this.lastOrders.unshift(orderEntry);
      this.lastOrders = this.lastOrders.slice(0, 10);
      console.log('[ManualOperation] Total de ordens no histórico:', this.lastOrders.length);
      console.log('[ManualOperation] ========== RESULTADO PROCESSADO ==========');
    },
    async loadLastOrders() {
      console.log('[ManualOperation] Carregando últimas ordens do banco...');
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        // Seguir o mesmo padrão usado em outros endpoints (sem /api duplicado)
        const res = await fetch(`${apiBaseUrl}/broker/deriv/trading/last-orders?limit=50`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[ManualOperation] Erro ao buscar últimas ordens:', res.status, res.statusText, errorText);
          return;
        }

        const orders = await res.json();
        console.log('[ManualOperation] Últimas ordens recebidas do backend:', orders);
        console.log('[ManualOperation] Número de ordens recebidas:', orders?.length || 0);
        if (orders && orders.length > 0) {
          console.log('[ManualOperation] Primeira ordem exemplo:', {
            id: orders[0].id,
            entrySpot: orders[0].entrySpot,
            exitSpot: orders[0].exitSpot,
            entryValue: orders[0].entryValue,
            exitValue: orders[0].exitValue,
            symbol: orders[0].symbol,
            status: orders[0].status
          });
        }
        
        // Função para mapear símbolo para nome de mercado
        const getMarketName = (symbol) => {
          if (!symbol) return 'N/A';
          const marketMap = {
            'R_10': 'Volatility 10 Index',
            'R_25': 'Volatility 25 Index',
            'R_50': 'Volatility 50 Index',
            'R_75': 'Volatility 75 Index',
            'R_100': 'Volatility 100 Index',
            '1HZ10V': 'Volatility 10 (1s) Index',
            '1HZ25V': 'Volatility 25 (1s) Index',
            '1HZ50V': 'Volatility 50 (1s) Index',
            '1HZ75V': 'Volatility 75 (1s) Index',
            '1HZ100V': 'Volatility 100 (1s) Index',
            'cryBTCUSD': 'BTC/USD',
            'cryETHUSD': 'ETH/USD',
            'frxEURUSD': 'EUR/USD',
            'frxUSDJPY': 'USD/JPY',
            'frxGBPUSD': 'GBP/USD',
            'frxUSDCHF': 'USD/CHF',
            'frxAUDUSD': 'AUD/USD',
            'frxUSDCAD': 'USD/CAD',
            'frxNZDUSD': 'NZD/USD',
            'frxEURGBP': 'EUR/GBP',
            'frxEURJPY': 'EUR/JPY',
            'frxGBPJPY': 'GBP/JPY',
            'frxAUDCAD': 'AUD/CAD',
            'frxAUDJPY': 'AUD/JPY',
            'frxCHFJPY': 'CHF/JPY',
            'frxEURAUD': 'EUR/AUD',
            'frxGBPAUD': 'GBP/AUD',
            'frxUSDMXN': 'USD/MXN',
            'frxXAUUSD': 'XAU/USD',
            'frxXAGUSD': 'XAG/USD',
            'frxXPTUSD': 'XPT/USD',
            'frxXPDUSD': 'XPD/USD',
          };
          return marketMap[symbol] || symbol;
        };

        // Converter para o formato esperado pelo componente
        this.lastOrders = orders.map(order => ({
          time: new Date(order.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          type: order.contractType || 'CALL',
          direction: order.contractType || 'CALL',
          buyPrice: order.entryValue || null, // Valor investido (stake)
          entryPrice: order.entrySpot || null, // Preço de entrada (spot)
          sellPrice: order.exitValue || null, // Valor recebido na venda
          exitPrice: order.exitSpot || null, // Preço de saída (spot)
          profit: order.profit != null ? Number(order.profit) : null,
          currency: 'USD',
          status: this.mapStatus(order.status),
          contractId: order.derivTransactionId || null,
          market: getMarketName(order.symbol),
        }));

        console.log('[ManualOperation] Últimas ordens formatadas:', this.lastOrders);
        console.log('[ManualOperation] Total de ordens formatadas:', this.lastOrders.length);
        if (this.lastOrders && this.lastOrders.length > 0) {
          console.log('[ManualOperation] Primeira ordem formatada exemplo:', {
            time: this.lastOrders[0].time,
            buyPrice: this.lastOrders[0].buyPrice,
            entryPrice: this.lastOrders[0].entryPrice,
            exitPrice: this.lastOrders[0].exitPrice,
            sellPrice: this.lastOrders[0].sellPrice,
            market: this.lastOrders[0].market,
            status: this.lastOrders[0].status
          });
        }
        
        // Forçar atualização reativa
        this.$forceUpdate();
      } catch (error) {
        console.error('[ManualOperation] Erro ao carregar últimas ordens:', error);
        this.lastOrders = [];
      }
    },
    mapStatus(status) {
      if (!status) return 'PENDING';
      const statusLower = status.toLowerCase();
      // Mapear status do banco para exibição
      if (statusLower === 'won') return 'WON';
      if (statusLower === 'lost') return 'LOST';
      if (statusLower === 'pending') return 'PENDING';
      if (statusLower === 'expired') return 'CLOSED';
      if (statusLower === 'closed') return 'CLOSED';
      if (statusLower === 'sold') return 'CLOSED';
      // Se for um status em uppercase, manter
      return status.toUpperCase();
    },
    persistConnectionBalance(balanceValue, currency) {
      const saved = localStorage.getItem('deriv_connection');
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        parsed.balance = {
          value: Number(balanceValue),
          currency: currency || parsed.balance?.currency || 'USD',
        };
        parsed.timestamp = Date.now();
        localStorage.setItem('deriv_connection', JSON.stringify(parsed));
      } catch (error) {
        console.warn('Não foi possível atualizar cache da Deriv.', error);
      }
    },
  },
  async mounted() {
    await this.checkConnection(true);
    await this.loadLastOrders();
  },
};
</script>

<style scoped>
.manual-operation-container {
  margin: 0;
  padding: 0;
  width: 100%;
  color: #DFDFDF;
  font-family: 'Inter', sans-serif;
}

/* Main Content */
.main-content {
  margin-top: 0;
  padding: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.view-toggle-bar-wrapper {
  display: flex;
  gap: 1.5rem;
  margin-left: 20px;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}

.view-toggle-bar {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  justify-content: flex-start;
}

.operation-content {
  flex: 1;
  overflow: visible;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
}

.bg-zenix-card {
  background-color: #0E0E0E;
}

.text-zenix-text {
  color: #DFDFDF;
}

.border-zenix-green {
  border-color: #22C55E;
}


.hover\:bg-\[#111\]:hover {
  background-color: #111;
}

.hover\:text-zenix-text:hover {
  color: #DFDFDF;
}
</style>
