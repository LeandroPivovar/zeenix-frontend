<template>
  <div class="layout">
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />

    <div class="operation-main" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="background-glow"></div>
      <div class="background-grid"></div>
      <header class="header-operation">
        <button class="hamburger-btn" @click="handleHamburgerClick">&#9776;</button>
       
        <div class="header-title">
          <span class="title-text">Operação Manual</span>
        </div>
        <div class="header-status">
          {{ accountBalanceFormatted }}
        </div>
      </header>

      <div class="view-toggle-bar">
        <div class="toggle-group">
          <button
            class="toggle-button"
            :class="{ active: currentView === 'OperationChart' }"
            @click="changeView('OperationChart')"
          >
            Gráficos
          </button>
          <button
            class="toggle-button"
            :class="{ active: currentView === 'OperationDigits' }"
            @click="changeView('OperationDigits')"
          >
            Dígitos
          </button>
        </div>
        <span class="connection-indicator" v-if="loadingConnection">Atualizando saldo Deriv…</span>
      </div>

      <div class="operation-content">
        <component
          :is="currentView"
          :account-balance="accountBalanceFormatted"
          :account-currency="accountCurrency"
          :preferred-currency="preferredCurrency"
          :account-loginid="accountLoginId"
          :order-config="orderConfig"
          :last-orders="lastOrdersFormatted"
          @trade-result="handleTradeResult"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import OperationChart from '../components/OperationChart.vue';
import OperationDigits from '../components/OperationDigits.vue';

export default {
  name: 'OperationView',
  components: {
    AppSidebar,
    OperationChart,
    OperationDigits,
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
      isSidebarOpen: false,
      isSidebarCollapsed: false,
      loadingConnection: false,
    };
  },
  computed: {
    accountBalanceFormatted() {
      if (this.accountBalanceValue == null) return '---';
      return this.formatCurrency(this.accountBalanceValue, this.accountCurrency);
    },
    lastOrdersFormatted() {
      return this.lastOrders.map(order => {
        const displayValue =
          order.price != null
            ? this.formatCurrency(order.price, order.currency || this.accountCurrency)
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
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    handleHamburgerClick() {
      if (this.isSidebarCollapsed) {
        // Se estiver colapsada, expandir
        this.isSidebarCollapsed = false;
      } else {
        // Se não estiver colapsada, abrir no modo mobile
        this.isSidebarOpen = true;
      }
    },
    changeView(componentName) {
      this.currentView = componentName;
    },
    async checkConnection(forceRefresh = false) {
      console.log('[OperationView] ========== VERIFICANDO CONEXÃO ==========');
      console.log('[OperationView] forceRefresh:', forceRefresh);
      
      const saved = localStorage.getItem('deriv_connection');
      console.log('[OperationView] Conexão salva no localStorage:', saved ? 'Sim' : 'Não');
      
      if (!forceRefresh && saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('[OperationView] Usando conexão salva (cache)');
          this.applyConnectionSnapshot(parsed);
          return;
        } catch (error) {
          console.warn('[OperationView] Erro ao parsear conexão salva:', error);
          // ignore parsing issues
        }
      }

      this.loadingConnection = true;
      console.log('[OperationView] Buscando status atualizado do backend...');
      
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const requestBody = {
          token: localStorage.getItem('deriv_token') || undefined,
          appId: localStorage.getItem('deriv_app_id')
            ? Number(localStorage.getItem('deriv_app_id'))
            : undefined,
        };
        
        console.log('[OperationView] Requisição para /broker/deriv/status:', {
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

        console.log('[OperationView] Resposta do backend:', {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[OperationView] Erro na resposta:', errorText);
          throw new Error('Não foi possível atualizar o status da Deriv');
        }

        const data = await res.json();
        console.log('[OperationView] Dados recebidos do backend:', JSON.stringify(data, null, 2));
        
        const snapshot = { ...data, timestamp: Date.now() };
        this.applyConnectionSnapshot(snapshot);
        localStorage.setItem('deriv_connection', JSON.stringify(snapshot));
        console.log('[OperationView] Conexão atualizada e salva no localStorage');
      } catch (error) {
        console.error('[OperationView] Erro ao verificar conexão:', error);
        if (saved) {
          console.log('[OperationView] Tentando restaurar conexão salva...');
          try {
            this.applyConnectionSnapshot(JSON.parse(saved));
          } catch (err) {
            console.warn('[OperationView] Falha ao restaurar conexão Deriv local:', err);
          }
        }
      } finally {
        this.loadingConnection = false;
        console.log('[OperationView] ========== VERIFICAÇÃO DE CONEXÃO FINALIZADA ==========');
      }
    },
    applyConnectionSnapshot(snapshot) {
      console.log('[OperationView] ========== APLICANDO SNAPSHOT DE CONEXÃO ==========');
      console.log('[OperationView] Snapshot completo:', JSON.stringify(snapshot, null, 2));
      
      if (!snapshot) {
        console.warn('[OperationView] Snapshot vazio ou null');
        return;
      }
      
      const balanceValue = snapshot?.balance?.value ?? snapshot.balanceAfter ?? null;
      const currency = snapshot?.currency ?? snapshot?.balance?.currency ?? this.accountCurrency;
      const preferredCurrency = snapshot?.preferredCurrency ?? 'USD';
      const loginid = snapshot?.loginid ?? null;
      
      console.log('[OperationView] Valores extraídos:', {
        balanceValue,
        currency,
        preferredCurrency,
        loginid
      });
      
      if (balanceValue != null) {
        this.accountBalanceValue = Number(balanceValue);
        console.log('[OperationView] Saldo atualizado:', this.accountBalanceValue);
      }
      if (currency) {
        this.accountCurrency = currency.toUpperCase();
        console.log('[OperationView] Moeda da conta atualizada:', this.accountCurrency);
      }
      if (preferredCurrency) {
        this.preferredCurrency = preferredCurrency.toUpperCase();
        console.log('[OperationView] Moeda preferida atualizada:', this.preferredCurrency);
      }
      if (loginid) {
        this.accountLoginId = loginid;
        console.log('[OperationView] LoginID atualizado:', this.accountLoginId);
      }
      
      // Armazenar tokens retornados pelo backend no localStorage
      if (snapshot?.tokensByLoginId && Object.keys(snapshot.tokensByLoginId).length > 0) {
        console.log('[OperationView] Tokens recebidos do backend:', Object.keys(snapshot.tokensByLoginId));
        localStorage.setItem('deriv_tokens_by_loginid', JSON.stringify(snapshot.tokensByLoginId));
        console.log('[OperationView] Tokens armazenados no localStorage');
      } else {
        // Se o backend não retornou tokens, verificar se já existem no localStorage
        const existingTokens = localStorage.getItem('deriv_tokens_by_loginid');
        if (existingTokens) {
          try {
            const parsed = JSON.parse(existingTokens);
            if (Object.keys(parsed).length > 0) {
              console.log('[OperationView] Tokens não recebidos do backend, mas encontrados no localStorage:', Object.keys(parsed));
              console.log('[OperationView] Usando tokens existentes do localStorage');
            } else {
              console.warn('[OperationView] Tokens no localStorage estão vazios');
            }
          } catch (e) {
            console.warn('[OperationView] Erro ao parsear tokens do localStorage:', e);
          }
        } else {
          console.warn('[OperationView] Nenhum token encontrado no backend nem no localStorage');
          console.warn('[OperationView] O usuário precisa reconectar via OAuth para armazenar os tokens');
        }
      }
      
      console.log('[OperationView] Estado final:', {
        accountBalanceValue: this.accountBalanceValue,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginId: this.accountLoginId,
        hasTokensByLoginId: !!snapshot?.tokensByLoginId
      });
      console.log('[OperationView] ========== SNAPSHOT APLICADO ==========');
    },
    handleTradeResult(result) {
      console.log('[OperationView] ========== RESULTADO DA OPERAÇÃO RECEBIDO ==========');
      console.log('[OperationView] Resultado completo:', JSON.stringify(result, null, 2));
      console.log('[OperationView] Estado atual da view:', {
        accountBalanceValue: this.accountBalanceValue,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginId: this.accountLoginId
      });
      
      if (result?.balanceAfter != null) {
        console.log('[OperationView] Atualizando saldo:', {
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
          console.log('[OperationView] Ordem existente atualizada com lucro:', this.lastOrders[existingOrderIndex]);
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

      console.log('[OperationView] Adicionando ordem ao histórico:', orderEntry);
      this.lastOrders.unshift(orderEntry);
      this.lastOrders = this.lastOrders.slice(0, 10);
      console.log('[OperationView] Total de ordens no histórico:', this.lastOrders.length);
      console.log('[OperationView] ========== RESULTADO PROCESSADO ==========');
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
  },
  watch: {
    '$route'(to) {
      if (to.path === '/operation') {
        this.checkConnection();
      }
    },
  },
};
</script>

<style src="../assets/css/views/operationView.css"></style>
<style scoped>
.background-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
    radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
    radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
    rgba(9, 10, 12, 0.95);
  z-index: -2;
  pointer-events: none;
}

.background-grid {
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: -1;
  opacity: 0.6;
  pointer-events: none;
  animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: -48px -48px, -48px -48px;
  }
}
</style>