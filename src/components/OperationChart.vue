<template>
  <div class="operation-chart-wrapper">
    <div v-if="connectionError" class="connection-error-card">
      <p>{{ connectionError }}</p>
      <button class="btn-action btn-buy" @click="initConnection" :disabled="isConnecting">
        {{ isConnecting ? 'Reconectando...' : 'Tentar novamente' }}
      </button>
    </div>

    <div v-else class="operation-layout">
      <div class="col-chart">
        <div class="chart-toolbar">
          <div class="toolbar-group">
            <label class="toolbar-label" for="symbol-select">Mercado</label>
            <select
              id="symbol-select"
              v-model="symbol"
              @change="handleSymbolChange"
              :disabled="!isAuthorized || isLoadingSymbol"
              class="select-field"
            >
              <option v-for="market in markets" :key="market.value" :value="market.value">
                {{ market.label }}
              </option>
            </select>
            <span v-if="isLoadingSymbol" class="loading-indicator">Atualizando...</span>
          </div>

          <div class="price-indicator" v-if="latestTick">
            <span class="indicator-label">Último preço</span>
            <strong>{{ latestTick.value.toFixed(pricePrecision) }}</strong>
          </div>
        </div>

        <div class="chart-box">
          <div ref="chartContainer" class="line-chart-container"></div>
          <div v-if="!chartInitialized" class="chart-placeholder">
            <p>{{ isAuthorized ? 'Carregando histórico de ticks...' : 'Aguardando autorização da Deriv...' }}</p>
          </div>
        </div>

        <div class="chart-footer">
          <div class="footer-meta">
            <span>Resolução: {{ chartResolutionLabel }}</span>
            <span>Última atualização: {{ lastUpdateLabel }}</span>
          </div>
          <p class="chart-footer-info">
            Dados de preço em tempo real fornecidos pela Deriv. Operações executadas aparecerão no histórico.
          </p>
        </div>
      </div>

      <div class="col-sidebar">
        <div class="card-order-config">
          <h4 class="card-title">Configuração da Ordem</h4>

          <div class="input-group">
            <label class="input-label">Tipo de contrato</label>
            <select v-model="localOrderConfig.type" class="select-field" :disabled="isTrading">
              <option value="CALL">Alta (CALL)</option>
              <option value="PUT">Baixa (PUT)</option>
            </select>
          </div>

          <div class="input-row-flex">
            <div class="input-group-half">
              <label class="input-label">Tipo de duração</label>
              <div class="toggle-buttons">
                <button @click="setDurationUnit('m')" :class="{ 'toggle-active': localOrderConfig.durationUnit === 'm' }" :disabled="isTrading">Minutos</button>
                <button @click="setDurationUnit('t')" :class="{ 'toggle-active': localOrderConfig.durationUnit === 't' }" :disabled="isTrading">Ticks</button>
              </div>
            </div>
            <div class="input-group-half">
              <label class="input-label">Duração</label>
              <input type="number" min="1" v-model.number="localOrderConfig.duration" class="input-field-value" :disabled="isTrading" />
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">Valor da entrada ({{ displayCurrency }})</label>
            <input type="number" min="0.35" step="0.01" v-model.number="localOrderConfig.value" class="input-field-value" :disabled="isTrading" />
          </div>

          <div class="action-buttons-group">
            <button @click="executeTrade('BUY')" class="btn-action btn-buy" :disabled="isTrading">BUY</button>
            <button @click="executeTrade('SELL')" class="btn-action btn-sell" :disabled="isTrading">SELL</button>
          </div>
          <button @click="executeTrade('EXECUTE')" class="btn-execute-operation" :disabled="isTrading || !isAuthorized">
            {{ isTrading ? 'Aguardando confimação...' : 'Executar Operação' }}
          </button>

          <p v-if="tradeMessage" class="trade-message success">{{ tradeMessage }}</p>
          <p v-if="tradeError" class="trade-message error">{{ tradeError }}</p>
        </div>

        <div class="card-last-orders">
          <h4 class="card-title">Últimas Ordens</h4>

          <div class="orders-table-header">
            <span>Hora</span>
            <span>Tipo</span>
            <span>Valor</span>
          </div>

          <div class="orders-list-scroll">
            <div v-if="!lastOrders.length" class="orders-empty">
              Nenhuma operação executada ainda.
            </div>
            <div v-for="(order, index) in lastOrders" :key="`order-${index}`" class="order-row">
              <span class="order-col">{{ order.time }}</span>
              <span class="order-col order-type-text">{{ order.type }}</span>
              <span class="order-col order-result-text">{{ order.displayValue }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';

const APP_ID = process.env.VUE_APP_DERIV_APP_ID || '1089';

export default {
  name: 'OperationChart',
  props: {
    accountBalance: { type: String, required: true },
    accountCurrency: { type: String, default: 'USD' },
    orderConfig: { type: Object, required: true },
    lastOrders: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      ws: null,
      tickSubscriptionId: null,
      token: null,
      appId: null,
      isConnecting: false,
      isAuthorized: false,
      isLoadingSymbol: false,
      connectionError: '',
      tradeMessage: '',
      tradeError: '',
      symbol: 'R_100',
      markets: [
        { value: 'R_100', label: 'Volatility 100 Index' },
        { value: 'R_75', label: 'Volatility 75 Index' },
        { value: 'R_50', label: 'Volatility 50 Index' },
        { value: 'frxUSDJPY', label: 'USD/JPY (Forex)' },
        { value: '1HZ10V', label: 'Crash 1000' },
      ],
      ticks: [],
      chartInitialized: false,
      latestTick: null,
      lastUpdate: null,
      chart: null,
      lineSeries: null,
      timeScaleMarkers: [],
      localOrderConfig: {
        type: 'CALL',
        duration: 1,
        durationUnit: 'm',
        value: 10,
      },
      isTrading: false,
      pendingTradeType: null,
      currentProposal: null,
      connectionCurrency: null,
    };
  },
  computed: {
    pricePrecision() {
      if (this.symbol.startsWith('frx')) return 5;
      if ((this.accountCurrency || '').toUpperCase() === 'BTC') return 8;
      return 2;
    },
    displayCurrency() {
      return (this.accountCurrency || this.connectionCurrency || 'USD').toUpperCase();
    },
    chartResolutionLabel() {
      if (!this.ticks.length) return '--';
      return `${this.ticks.length} pts (${this.symbol})`;
    },
    lastUpdateLabel() {
      if (!this.lastUpdate) return '--';
      return new Date(this.lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },
  },
  methods: {
    initChart() {
      if (this.chart || !this.$refs.chartContainer) return;

      this.chart = createChart(this.$refs.chartContainer, {
        localization: { locale: 'pt-BR' },
        layout: {
          background: { type: ColorType.Solid, color: '#0f172a' },
          textColor: '#f8fafc',
        },
        rightPriceScale: {
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: true,
        },
        grid: {
          vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
          horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
        },
        crosshair: {
          mode: 1,
        },
      });

      this.lineSeries = this.chart.addAreaSeries({
        lineColor: '#4ade80',
        topColor: 'rgba(74, 222, 128, 0.2)',
        bottomColor: 'rgba(74, 222, 128, 0.02)',
        lineWidth: 2,
        priceFormat: {
          type: 'price',
          precision: this.pricePrecision,
          minMove: Math.pow(10, -this.pricePrecision),
        },
      });

      this.chartInitialized = true;
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    },
    handleResize() {
      if (!this.chart || !this.$refs.chartContainer) return;
      const { clientWidth } = this.$refs.chartContainer;
      this.chart.applyOptions({ width: clientWidth });
    },
    initConnection() {
      if (this.ws) {
        this.teardownConnection();
      }

      this.connectionError = '';
      this.isConnecting = true;
      this.token = localStorage.getItem('deriv_token');
      this.appId = localStorage.getItem('deriv_app_id') || APP_ID;

      if (!this.token) {
        this.connectionError = 'Nenhum token Deriv encontrado. Conecte sua conta antes de operar.';
        this.isConnecting = false;
        return;
      }

      const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        this.send({ authorize: this.token });
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleMessage(msg);
        } catch (error) {
          console.error('Erro ao interpretar mensagem da Deriv', error);
        }
      };

      this.ws.onerror = () => {
        this.connectionError = 'Erro na conexão com a Deriv. Verifique sua rede e tente novamente.';
        this.isConnecting = false;
        this.isAuthorized = false;
      };

      this.ws.onclose = () => {
        if (!this.isConnecting) {
          this.connectionError = 'Conexão com a Deriv encerrada.';
        }
        this.isConnecting = false;
        this.isAuthorized = false;
        this.ws = null;
      };
    },
    teardownConnection() {
      if (this.ws) {
        try {
          this.ws.close();
        } catch (error) {
          console.warn('Erro ao encerrar WebSocket', error);
        }
      }
      this.ws = null;
      this.tickSubscriptionId = null;
    },
    handleMessage(msg) {
      if (msg.error) {
        this.handleDerivError(msg.error);
        return;
      }

      switch (msg.msg_type) {
        case 'authorize':
          this.isAuthorized = true;
          this.isConnecting = false;
          this.connectionCurrency = msg.authorize?.currency?.toUpperCase() || this.accountCurrency;
          this.subscribeToSymbol();
          break;
        case 'history':
          this.processHistory(msg);
          break;
        case 'candles':
          this.processCandles(msg);
          break;
        case 'tick':
          this.processTick(msg);
          break;
        case 'proposal':
          this.processProposal(msg);
          break;
        case 'buy':
          this.processBuy(msg);
          break;
        default:
          break;
      }
    },
    handleDerivError(error) {
      const message = error?.message || 'Erro desconhecido na Deriv';
      if (this.isTrading) {
        this.tradeError = message;
        this.tradeMessage = '';
        this.isTrading = false;
      } else {
        this.connectionError = message;
      }
    },
    subscribeToSymbol() {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      this.isLoadingSymbol = true;
      this.ticks = [];
      this.latestTick = null;
      this.tradeError = '';
      this.tradeMessage = '';

      if (this.tickSubscriptionId) {
        this.send({ forget: this.tickSubscriptionId });
        this.tickSubscriptionId = null;
      }

      const payload = {
        ticks_history: this.symbol,
        adjust_start_time: 1,
        count: 500,
        end: 'latest',
        subscribe: 1,
        style: 'ticks',
      };
      this.send(payload);
    },
    processHistory(msg) {
      const history = msg.history;
      if (!history || !history.prices) return;
      const prices = history.prices.map(price => Number(price));
      const times = history.times?.map(time => Number(time)) || [];
      this.ticks = prices.map((value, index) => ({ value, epoch: times[index] || index }));
      if (msg.subscription?.id) {
        this.tickSubscriptionId = msg.subscription.id;
      }
      this.isLoadingSymbol = false;
      this.updateChartFromTicks();
    },
    processCandles(msg) {
      const candles = msg.candles || [];
      const prices = candles.map(candle => Number(candle.close));
      const epochs = candles.map(candle => Number(candle.epoch));
      this.ticks = prices.map((value, index) => ({ value, epoch: epochs[index] || index }));
      if (msg.subscription?.id) {
        this.tickSubscriptionId = msg.subscription.id;
      }
      this.isLoadingSymbol = false;
      this.updateChartFromTicks();
    },
    processTick(msg) {
      const tick = msg.tick;
      if (!tick) return;
      if (tick.id && !this.tickSubscriptionId) {
        this.tickSubscriptionId = tick.id;
      }
      const value = Number(tick.quote);
      this.latestTick = { value, epoch: tick.epoch };
      this.lastUpdate = Date.now();
      this.ticks.push({ value, epoch: tick.epoch });
      if (this.ticks.length > 1000) {
        this.ticks.shift();
      }
      this.updateChartFromTicks();
    },
    updateChartFromTicks() {
      if (!this.ticks.length) {
        this.chartInitialized = false;
        return;
      }
      if (!this.chart) {
        this.initChart();
      }

      const data = this.ticks.map(tick => ({ time: tick.epoch, value: tick.value }));
      this.lineSeries.setData(data);
      this.chart.timeScale().fitContent();
      this.chartInitialized = true;
    },
    handleSymbolChange() {
      this.subscribeToSymbol();
    },
    setDurationUnit(unit) {
      if (this.isTrading) return;
      this.localOrderConfig.durationUnit = unit;
      if (unit === 't') {
        this.localOrderConfig.duration = Math.max(1, Math.min(this.localOrderConfig.duration, 10));
      }
    },
    executeTrade(action) {
      if (!this.isAuthorized) {
        this.tradeError = 'Conecte-se à Deriv antes de operar.';
        return;
      }
      if (this.isTrading) return;

      const tradeType = action === 'EXECUTE' ? (this.localOrderConfig.type === 'CALL' ? 'BUY' : 'SELL') : action;
      this.pendingTradeType = tradeType === 'BUY' ? 'CALL' : 'PUT';
      this.tradeError = '';
      this.tradeMessage = '';
      this.isTrading = true;

      const contractType = tradeType === 'BUY' ? 'CALL' : 'PUT';
      const duration = Math.max(1, Number(this.localOrderConfig.duration));
      const payload = {
        proposal: 1,
        amount: Number(this.localOrderConfig.value),
        basis: 'stake',
        contract_type: contractType,
        currency: this.displayCurrency,
        duration,
        duration_unit: this.localOrderConfig.durationUnit,
        symbol: this.symbol,
      };
      this.currentProposal = {
        payload,
      };
      this.send(payload);
    },
    processProposal(msg) {
      const proposal = msg.proposal;
      if (!proposal) {
        this.tradeError = 'Proposta inválida retornada pela Deriv.';
        this.isTrading = false;
        return;
      }
      this.currentProposal.id = proposal.id;
      this.currentProposal.askPrice = Number(proposal.ask_price);
      this.send({
        buy: proposal.id,
        price: Number(proposal.ask_price),
      });
    },
    processBuy(msg) {
      const buy = msg.buy;
      if (!buy) {
        this.tradeError = 'A Deriv não confirmou a compra.';
        this.isTrading = false;
        return;
      }

      this.tradeMessage = 'Operação executada com sucesso.';
      this.tradeError = '';
      this.isTrading = false;
      const resultPayload = {
        contractId: buy.contract_id,
        longcode: buy.longcode,
        buyPrice: Number(buy.buy_price),
        balanceAfter: buy.balance_after != null ? Number(buy.balance_after) : null,
        purchaseTime: buy.purchase_time,
        currency: this.displayCurrency,
        direction: this.pendingTradeType,
        status: 'EXECUTED',
      };
      this.$emit('trade-result', resultPayload);
      this.pendingTradeType = null;
    },
    send(payload) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.connectionError = 'Conexão com a Deriv não está pronta.';
        this.isTrading = false;
        return;
      }
      this.ws.send(JSON.stringify(payload));
    },
  },
  mounted() {
    if (this.orderConfig && this.orderConfig.value !== undefined) {
      this.localOrderConfig.value = Number(this.orderConfig.value);
    }
    this.initChart();
    this.initConnection();
  },
  beforeUnmount() {
    this.teardownConnection();
    if (this.chart) {
      window.removeEventListener('resize', this.handleResize);
      this.chart.remove();
      this.chart = null;
    }
  },
};
</script>

<style src="../assets/css/components/OperationCharts.css"></style>
<style scoped>
.operation-layout {
  display: flex;
  gap: 24px;
  width: 100%;
}

.connection-error-card {
  width: 100%;
  padding: 32px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  text-align: center;
  color: #fff;
}

.chart-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.loading-indicator {
  font-size: 0.75rem;
  color: #facc15;
}

.price-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.chart-box {
  position: relative;
  width: 100%;
  height: 420px;
  background: rgba(15, 23, 42, 0.65);
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
}

.line-chart-container {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
}

.chart-footer {
  margin-top: 12px;
}

.footer-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.8);
  margin-bottom: 4px;
}

.chart-footer-info {
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.8);
}

.orders-empty {
  padding: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.trade-message {
  margin-top: 12px;
  font-size: 0.85rem;
}

.trade-message.success {
  color: #4ade80;
}

.trade-message.error {
  color: #f87171;
}
</style>