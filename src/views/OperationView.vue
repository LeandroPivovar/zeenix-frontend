<template>
  <div class="layout">
    <AppSidebar :is-open="isSidebarOpen" @close-sidebar="closeSidebar" />

    <div class="operation-main">
      <header class="header-operation">
        <button class="hamburger-btn" @click="isSidebarOpen = true">&#9776;</button>
        <button @click="$router.push('/dashboard')" class="back-btn">
          <span class="back-icon-desk">
            <img src="../assets/icons/back.svg" alt="" width="20px" />
          </span>
          <span class="back-text">Voltar</span>
        </button>
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
      orderConfig: {
        type: 'Up/Down',
        time: '1 Minuto',
        value: 10.0,
      },
      lastOrders: [],
      isSidebarOpen: false,
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
        return {
          ...order,
          displayValue,
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
    changeView(componentName) {
      this.currentView = componentName;
    },
    async checkConnection(forceRefresh = false) {
      const saved = localStorage.getItem('deriv_connection');
      if (!forceRefresh && saved) {
        try {
          const parsed = JSON.parse(saved);
          this.applyConnectionSnapshot(parsed);
          return;
        } catch (error) {
          // ignore parsing issues
        }
      }

      this.loadingConnection = true;
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${apiBaseUrl}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: localStorage.getItem('deriv_token') || undefined,
            appId: localStorage.getItem('deriv_app_id')
              ? Number(localStorage.getItem('deriv_app_id'))
              : undefined,
          }),
        });

        if (!res.ok) {
          throw new Error('Não foi possível atualizar o status da Deriv');
        }

        const data = await res.json();
        const snapshot = { ...data, timestamp: Date.now() };
        this.applyConnectionSnapshot(snapshot);
        localStorage.setItem('deriv_connection', JSON.stringify(snapshot));
      } catch (error) {
        if (saved) {
          try {
            this.applyConnectionSnapshot(JSON.parse(saved));
          } catch (err) {
            console.warn('Falha ao restaurar conexão Deriv local.', err);
          }
        }
      } finally {
        this.loadingConnection = false;
      }
    },
    applyConnectionSnapshot(snapshot) {
      if (!snapshot) return;
      const balanceValue = snapshot?.balance?.value ?? snapshot.balanceAfter ?? null;
      const currency = snapshot?.currency ?? snapshot?.balance?.currency ?? this.accountCurrency;
      if (balanceValue != null) {
        this.accountBalanceValue = Number(balanceValue);
      }
      if (currency) {
        this.accountCurrency = currency.toUpperCase();
      }
    },
    handleTradeResult(result) {
      if (result?.balanceAfter != null) {
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

      const orderEntry = {
        time: timestamp,
        type: result.direction || 'CALL',
        price: result.buyPrice != null ? Number(result.buyPrice) : null,
        currency: result.currency || this.accountCurrency,
        status: result.status || 'EXECUTED',
        longcode: result.longcode || '',
      };

      this.lastOrders.unshift(orderEntry);
      this.lastOrders = this.lastOrders.slice(0, 10);
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