<template>
    <div class="operation-chart-wrapper">
    <div v-if="connectionError" class="connection-error-card animated-card" data-anim-index="0">
      <p>{{ connectionError }}</p>
      <div class="error-actions">
        <button class="btn-action btn-buy" @click="initConnection" :disabled="isConnecting || oauthLoading">
          {{ isConnecting ? 'Reconectando...' : 'Tentar novamente' }}
        </button>
        <button
          v-if="showOAuthConnect"
          class="btn-action btn-oauth"
          @click="startOAuthFlow"
          :disabled="oauthLoading || isConnecting"
        >
          {{ oauthLoading ? 'Abrindo Deriv...' : 'Conectar com Deriv' }}
        </button>
        <button class="btn-secondary" @click="goToDashboard" :disabled="oauthLoading || isConnecting">
          Ir para o Dashboard
        </button>
      </div>
    </div>

    <div v-else class="operation-layout">
        <div class="col-chart">
        <div class="chart-toolbar animated-fade" data-anim-index="0">
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

        <div class="chart-box animated-card" data-anim-index="1">
          <div class="ai-recommendation-card" :class="{ 'hidden': !showAiCard }">
            <div class="ai-card-header">
              <div class="ai-header-left">
                <span class="ai-icon">🧠</span>
                <span class="ai-name">IA ORION</span>
              </div>
              <div class="ai-signal-badge">SINAL ATIVO</div>
            </div>
            <div class="ai-recommendation-section">
              <div class="ai-recommendation-label">RECOMENDAÇÃO</div>
              <div class="ai-arrow-up">⬆️</div>
              <div class="ai-action-text">COMPRAR</div>
            </div>
            <div class="ai-info-section">
              <div class="ai-info-item">
                <span class="ai-info-label">Força da Tendência:</span>
                <span class="ai-info-value green">82%</span>
              </div>
              <div class="ai-info-item">
                <span class="ai-info-label">Expira em:</span>
                <span class="ai-info-value orange">{{ expirationTime }}</span>
              </div>
                    </div>
                    </div>
          <div ref="chartContainer" class="line-chart-container"></div>
          <div v-if="!chartInitialized" class="chart-placeholder">
            <p>{{ isAuthorized ? 'Carregando histórico de ticks...' : 'Aguardando autorização da Deriv...' }}</p>
                </div>
            </div>
            
        <div class="chart-footer animated-fade" data-anim-index="2">
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
        <div class="card-order-config animated-card" data-anim-index="0">
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
                    <button 
                      @click="selectTradeType('CALL')" 
                      class="btn-selector btn-buy-selector" 
                      :class="{ 'selected': localOrderConfig.type === 'CALL' }"
                      :disabled="isTrading"
                    >
                      BUY
                    </button>
                    <button 
                      @click="selectTradeType('PUT')" 
                      class="btn-selector btn-sell-selector" 
                      :class="{ 'selected': localOrderConfig.type === 'PUT' }"
                      :disabled="isTrading"
                    >
                      SELL
                </button>
                </div>
          <button @click="executeTrade('EXECUTE')" class="btn-execute-operation" :disabled="isTrading || !isAuthorized">
            {{ isTrading ? 'Aguardando confimação...' : 'Executar Operação' }}
                </button>

          <p v-if="tradeMessage" class="trade-message success">{{ tradeMessage }}</p>
          <p v-if="tradeError" class="trade-message error">{{ tradeError }}</p>
            </div>

        <div class="card-last-orders animated-card" data-anim-index="1">
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
      oauthLoading: false,
      expirationTime: '0m39s',
      expirationInterval: null,
      showAiCard: true,
      aiCardCycleInterval: null,
      audioContext: null,
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
    showOAuthConnect() {
      return (
        this.connectionError &&
        this.connectionError.toLowerCase().includes('nenhum token deriv')
      );
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
    selectTradeType(type) {
      if (this.isTrading) return;
      this.localOrderConfig.type = type;
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
    generateState() {
      if (window.crypto?.getRandomValues) {
        const array = new Uint32Array(4);
        window.crypto.getRandomValues(array);
        return Array.from(array, value => value.toString(16)).join('');
      }
      return Math.random().toString(16).slice(2);
    },
    async startOAuthFlow() {
      if (this.oauthLoading) return;
      this.oauthLoading = true;
      try {
        const state = this.generateState();
        localStorage.setItem('deriv_oauth_state', state);
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${apiBase}/broker/deriv/oauth/url?state=${state}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Não foi possível iniciar o OAuth');
        }
        const data = await res.json();
        if (!data?.url) {
          throw new Error('URL de OAuth não recebida');
        }
        window.location.href = data.url;
      } catch (error) {
        this.connectionError = error?.message || 'Falha ao iniciar OAuth. Tente novamente.';
        localStorage.removeItem('deriv_oauth_state');
        this.oauthLoading = false;
      }
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    startExpirationTimer() {
      if (this.expirationInterval) {
        clearInterval(this.expirationInterval);
      }
      let seconds = 39;
      this.expirationInterval = setInterval(() => {
        if (seconds <= 0) {
          seconds = 60;
        }
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        this.expirationTime = `${minutes}m${secs.toString().padStart(2, '0')}s`;
        seconds--;
      }, 1000);
    },
    startAiCardCycle() {
      if (this.aiCardCycleInterval) {
        clearInterval(this.aiCardCycleInterval);
      }
      
      // Mostra o card inicialmente
      this.showAiCard = true;
      // Toca som na primeira exibição
      this.$nextTick(() => {
        this.playAiCardSound();
      });
      
      // Ciclo: 30s visível, 20s escondido
      let isVisible = true;
      let timeRemaining = 30; // Começa visível por 30s
      
      this.aiCardCycleInterval = setInterval(() => {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
          if (isVisible) {
            // Esconde o card por 20s
            this.showAiCard = false;
            isVisible = false;
            timeRemaining = 20;
          } else {
            // Mostra o card por 30s
            this.showAiCard = true;
            isVisible = true;
            timeRemaining = 30;
            // Reinicia o timer de expiração quando o card volta
            this.startExpirationTimer();
          }
        }
      }, 1000);
    },
    playAiCardSound() {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Som premium: duas notas suaves
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // Lá
        oscillator.frequency.setValueAtTime(554.37, this.audioContext.currentTime + 0.1); // Dó#
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
        
        oscillator.type = 'sine';
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      } catch (error) {
        console.warn('Não foi possível reproduzir som:', error);
      }
    },
  },
  watch: {
    showAiCard(newVal) {
      if (newVal) {
        // Quando o card aparece, toca o som
        this.$nextTick(() => {
          this.playAiCardSound();
            });
        }
    },
    },
    mounted() {
        if (this.orderConfig && this.orderConfig.value !== undefined) {
      this.localOrderConfig.value = Number(this.orderConfig.value);
    }
    this.initChart();
    this.initConnection();
    this.startExpirationTimer();
    this.startAiCardCycle();
  },
  beforeUnmount() {
    this.teardownConnection();
    if (this.chart) {
      window.removeEventListener('resize', this.handleResize);
      this.chart.remove();
      this.chart = null;
    }
    if (this.expirationInterval) {
      clearInterval(this.expirationInterval);
    }
    if (this.aiCardCycleInterval) {
      clearInterval(this.aiCardCycleInterval);
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

.error-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 768px) {
  .connection-error-card {
    padding: 24px 16px;
  }

  .error-actions {
    flex-direction: column;
    gap: 10px;
  }

  .error-actions .btn-action,
  .error-actions .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .connection-error-card {
    padding: 20px 12px;
    font-size: 0.9rem;
  }

  .error-actions .btn-action,
  .error-actions .btn-secondary {
    padding: 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .connection-error-card {
    padding: 16px 10px;
    font-size: 0.85rem;
  }
}

.btn-oauth {
  background: #6366f1;
}

.btn-secondary {
  padding: 10px 18px;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
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
  min-height: 0;
  position: relative;
  box-sizing: border-box;
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

/* Card de Recomendação da IA Orion */
.ai-recommendation-card {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #1a1a1a;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 14px;
  min-width: 210px;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s;
}

.ai-recommendation-card:not(.hidden) {
  opacity: 1;
  transform: translateY(0) scale(1);
  visibility: visible;
  animation: aiCardArrival 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.ai-recommendation-card.hidden {
  opacity: 0;
  transform: translateX(-20px) scale(0.9);
  visibility: hidden;
  pointer-events: none;
  animation: none;
}

@keyframes aiCardArrival {
  0% {
    opacity: 0;
    transform: translateX(-30px) translateY(-10px) scale(0.85) rotate(-2deg);
  }
  60% {
    transform: translateX(5px) translateY(0) scale(1.05) rotate(1deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1) rotate(0deg);
  }
}

.ai-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.ai-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ai-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.6));
}

.ai-name {
  font-size: 12px;
  font-weight: 700;
  color: #10B981;
  letter-spacing: 0.5px;
}

.ai-signal-badge {
  padding: 3px 8px;
  border: 1px solid #10B981;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 600;
  color: #10B981;
  letter-spacing: 0.5px;
  background: rgba(16, 185, 129, 0.1);
}

.ai-recommendation-section {
  background: rgba(16, 185, 129, 0.15);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  text-align: center;
}

.ai-recommendation-label {
  font-size: 9px;
  color: rgba(16, 185, 129, 0.8);
  font-weight: 500;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.ai-arrow-up {
  font-size: 28px;
  margin: 3px 0;
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.8));
}

.ai-action-text {
  font-size: 18px;
  font-weight: 700;
  color: #10B981;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.ai-info-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.ai-info-label {
  color: #e5e7eb;
  font-weight: 500;
}

.ai-info-value {
  font-weight: 700;
  font-size: 13px;
}

.ai-info-value.green {
  color: #10B981;
}

.ai-info-value.orange {
  color: #F97316;
}
</style>