<template>
    <div class="operation-chart-wrapper">
    <div v-if="connectionError || isConnecting" class="connection-loading-card animated-card" data-anim-index="0">
      <div class="loading-indicator-wrapper">
        <div class="spinner-large"></div>
        <p class="loading-message">{{ loadingMessage }}</p>
        <p v-if="retryCount > 0" class="retry-info">Tentativa {{ retryCount }}...</p>
      </div>
    </div>

    <div v-else class="operation-layout">
        <div class="col-chart flex-1 flex flex-col gap-5">
        <div class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden flex flex-col shadow-[0_0_8px_rgba(0,0,0,0.25)] chart-container w-full" style="height: 700px;">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] flex-shrink-0">
            <h3 class="text-base font-semibold text-zenix-text">Gráfico</h3>
          </div>

          <div id="tradingviewChart" class="w-full chart-wrapper" ref="chartContainer" style="background-color: #0B0B0B; position: relative; flex: 1; min-height: 0; height: 100%;">
          </div>
          <div v-if="!ticks.length" class="chart-placeholder absolute inset-0 flex items-center justify-center" style="z-index: 2; pointer-events: none;">
            <p class="text-zenix-secondary">{{ isAuthorized ? 'Carregando histórico de ticks...' : 'Aguardando autorização da Deriv...' }}</p>
          </div>
        </div>
        
        <div class="border-t-2 bg-gradient-to-b from-[#101010] to-[#0E0E0E] px-6 py-4 rounded-xl shadow-[0_-2px_12px_rgba(34,197,94,0.08)]">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="far fa-signal text-[11px] text-zenix-green"></i>
              <span class="text-xs font-bold text-zenix-text tracking-wide uppercase">Sinal Gerado</span>
            </div>
            <button 
              id="startAnalysisBtn" 
              @click="startAnalysis"
              class="inline-flex items-center gap-2 px-4 py-2 bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold rounded-lg text-xs transition-all duration-300 shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_16px_rgba(34,197,94,0.4)]"
            >
              <i class="far fa-chart-line text-[9px]"></i>
              <span>{{ analysisInProgress ? 'Atualizar Análise' : 'Iniciar Análise do Gráfico' }}</span>
            </button>
          </div>
          <div id="signalArea" class="min-h-[80px]">
            <!-- Signal content will be inserted here -->
          </div>
        </div>
        </div>

        <div class="max-w-[420px] w-[420px] flex-shrink-0 bg-zenix-card border border-zenix-border rounded-xl p-5 overflow-y-auto">
          <div class="pb-3 border-b border-zenix-border mb-5">
            <h3 class="text-base font-semibold text-zenix-text">Painel de Negociação Manual</h3>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
                <i class="fas fa-chart-line text-zenix-green mr-2"></i>Mercado
              </label>
              <select 
                id="marketSelectSidebar"
                v-model="symbol"
                @change="handleSymbolChange"
                :disabled="!isAuthorized || isLoadingSymbol"
                class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
              >
                <optgroup label="Índices Sintéticos">
                  <option v-for="market in marketsByCategory['Índices Contínuos']" :key="market.value" :value="market.value" data-category="synthetic">
                    {{ market.label }}
                  </option>
                </optgroup>
                <optgroup label="Criptomoedas">
                  <option v-for="market in marketsByCategory['Criptomoedas']" :key="market.value" :value="market.value" data-category="crypto">
                    {{ market.label }}
                  </option>
                </optgroup>
                <optgroup label="Forex">
                  <option v-for="market in [...(marketsByCategory['Forex Majors'] || []), ...(marketsByCategory['Forex Minors'] || []), ...(marketsByCategory['Forex Exotics'] || [])]" :key="market.value" :value="market.value" data-category="forex">
                    {{ market.label }}
                  </option>
                </optgroup>
                <optgroup label="Metais">
                  <option v-for="market in marketsByCategory['Metais']" :key="market.value" :value="market.value" data-category="metals">
                    {{ market.label }}
                  </option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
                <i class="fas fa-exchange-alt text-zenix-green mr-2"></i>Tipo de Negociação
              </label>
              <select 
                id="tradeTypeSelect"
                v-model="localOrderConfig.type" 
                class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
                :disabled="isTrading || !canUseCallPut"
              >
                <option value="">Selecione um mercado primeiro</option>
                <option value="CALL">Alta (CALL)</option>
                <option value="PUT">Baixa (PUT)</option>
              </select>
              <div v-if="!canUseCallPut" class="warning-message mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                ⚠️ Este ativo não suporta contratos CALL/PUT. Use a operação com dígitos para negociar este ativo.
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
                <i class="fas fa-clock text-zenix-green mr-2"></i>Duração
              </label>
              <div class="flex gap-2">
                <select 
                  v-model="localOrderConfig.durationUnit"
                  @change="setDurationUnit(localOrderConfig.durationUnit)"
                  class="flex-1 bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
                  :disabled="isTrading"
                >
                  <option value="m">Minutos</option>
                  <option value="t">Ticks</option>
                </select>
                <input 
                  type="number" 
                  :min="getValidDurationForSymbol(symbol).min" 
                  :max="getValidDurationForSymbol(symbol).max"
                  v-model.number="localOrderConfig.duration" 
                  @input="onDurationChange"
                  class="w-20 bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
                  :disabled="isTrading" 
                />
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
                <i class="fas fa-dollar-sign text-zenix-green mr-2"></i>Valor de entrada
              </label>
              <input 
                type="number" 
                :min="stakeLimits.min" 
                :max="stakeLimits.max" 
                step="0.01" 
                v-model.number="localOrderConfig.value" 
                @input="validateAndAdjustStake"
                placeholder="Ex: 1.00, 2.50..."
                class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text placeholder:text-[#DFDFDF40] focus:outline-none focus:border-zenix-green transition-colors"
                :disabled="isTrading" 
              />
              <div v-if="stakeLimits.min || stakeLimits.max" class="text-xs text-zenix-secondary mt-1">
                Min: {{ displayCurrency }} {{ stakeLimits.min.toFixed(2) }} | Max: {{ displayCurrency }} {{ stakeLimits.max.toFixed(2) }}
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
                <i class="fas fa-times text-zenix-green mr-2"></i>Multiplicador
              </label>
              <input 
                type="number" 
                placeholder="Ex: 50, 100, 150..."
                class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text placeholder:text-[#DFDFDF40] focus:outline-none focus:border-zenix-green transition-colors"
              />
            </div>
            
            <div v-if="currentProposalPrice" class="bg-zenix-bg border border-zenix-border rounded-lg p-3">
              <div class="text-xs text-zenix-secondary mb-1">Preço de Compra:</div>
              <div class="text-base font-semibold text-zenix-text">{{ displayCurrency }} {{ currentProposalPrice.toFixed(2) }}</div>
            </div>

            <div v-if="realTimeProfit !== null && activeContract" class="bg-zenix-bg border rounded-lg p-3" :class="realTimeProfit > 0 ? 'border-zenix-green' : 'border-red-500'">
              <div class="text-xs text-zenix-secondary mb-1">P&L em Tempo Real:</div>
              <div class="text-base font-semibold" :class="realTimeProfit > 0 ? 'text-zenix-green' : 'text-red-500'">
                {{ displayCurrency }} {{ realTimeProfit > 0 ? '+' : '' }}{{ realTimeProfit.toFixed(2) }}
              </div>
            </div>

            <div class="space-y-3 pt-3">
              <button 
                v-if="!activeContract"
                @click="handleBuyClick" 
                id="buyButton"
                class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isTrading || !isAuthorized || !canUseCallPut"
                @mouseenter="debugButtonState"
              >
                <i class="fas fa-arrow-up"></i>
                {{ isTrading ? 'Aguardando confirmação...' : (currentProposalId ? 'Executar Ordem' : 'Aguardando proposta...') }}
              </button>
              
              <button 
                v-if="activeContract && isSellEnabled"
                @click="executeSell" 
                id="sellButton"
                class="w-full bg-[#FF4747] hover:bg-[#FF6161] text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                :disabled="isTrading"
              >
                <i class="fas fa-arrow-down"></i>
                {{ isTrading ? 'Vendendo...' : 'PUT / SELL' }}
              </button>
            </div>

            <div v-if="formattedCountdown && activeContract" class="countdown-display">
              <span class="countdown-label">Tempo restante:</span>
              <span class="countdown-value">{{ formattedCountdown }}</span>
            </div>

            <p v-if="tradeMessage" class="text-sm text-zenix-green">{{ tradeMessage }}</p>
            <p v-if="tradeError" class="text-sm text-red-500">{{ tradeError }}</p>
          </div>
        </div>

        <TradeResultModal
          :visible="showTradeResultModal"
          :profit="finalTradeProfit"
          :currency="displayCurrency"
          :type="finalTradeType"
          :buy-price="finalTradeBuyPrice"
          :sell-price="finalTradeSellPrice"
          :balance-after="finalTradeBalanceAfter"
          @close="closeTradeResultModal"
        />
      </div>
    </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';
import TradeResultModal from './TradeResultModal.vue';
import derivTradingService from '../services/deriv-trading.service.js';

// APP_ID removido - não é mais necessário (backend gerencia)

export default {
    name: 'OperationChart',
    components: {
      TradeResultModal,
    },
    props: {
        accountBalance: { type: String, required: true },
    accountCurrency: { type: String, default: 'USD' },
        preferredCurrency: { type: String, default: 'USD' },
        accountLoginid: { type: String, default: null },
        orderConfig: { type: Object, required: true },
        lastOrders: { 
            type: Array, 
            required: true,
      default: () => [],
    },
    },
    data() {
        return {
      // ws removido - agora usa derivTradingService
      tickSubscriptionId: null,
      token: null,
      appId: null,
      isConnecting: false,
      isAuthorized: false,
      isReconnecting: false,
      currentLoginid: null,
      reconnectTimeout: null,
      isLoadingSymbol: false,
      connectionError: '',
      tradeMessage: '',
      tradeError: '',
      symbol: 'R_100',
      // Cache de dados de contratos por símbolo
      contractsData: {}, // { symbol: { contractTypes, minDuration, maxDuration, minStake, maxStake, allowedUnits } }
      isLoadingContracts: false,
      // Cache global de trading durations (carregado uma vez ao conectar)
      tradingDurationsCache: null,
      isLoadingTradingDurations: false,
      // Cache de active symbols
      activeSymbolsCache: null,
      markets: [
        // Índices Contínuos
        { value: 'R_10', label: 'Volatility 10 Index', category: 'Índices Contínuos' },
        { value: 'R_25', label: 'Volatility 25 Index', category: 'Índices Contínuos' },
        { value: 'R_50', label: 'Volatility 50 Index', category: 'Índices Contínuos' },
        { value: 'R_75', label: 'Volatility 75 Index', category: 'Índices Contínuos' },
        { value: 'R_100', label: 'Volatility 100 Index', category: 'Índices Contínuos' },
        { value: '1HZ10V', label: 'Volatility 10 (1s) Index', category: 'Índices Contínuos' },
        { value: '1HZ25V', label: 'Volatility 25 (1s) Index', category: 'Índices Contínuos' },
        { value: '1HZ50V', label: 'Volatility 50 (1s) Index', category: 'Índices Contínuos' },
        { value: '1HZ75V', label: 'Volatility 75 (1s) Index', category: 'Índices Contínuos' },
        { value: '1HZ100V', label: 'Volatility 100 (1s) Index', category: 'Índices Contínuos' },
        
        // Criptomoedas
        { value: 'cryBTCUSD', label: 'BTC/USD (Bitcoin)', category: 'Criptomoedas' },
        { value: 'cryETHUSD', label: 'ETH/USD (Ethereum)', category: 'Criptomoedas' },
        
        // Forex (Majors)
        { value: 'frxEURUSD', label: 'EUR/USD (Euro / Dólar)', category: 'Forex Majors' },
        { value: 'frxUSDJPY', label: 'USD/JPY (Dólar / Iene)', category: 'Forex Majors' },
        { value: 'frxGBPUSD', label: 'GBP/USD (Libra / Dólar)', category: 'Forex Majors' },
        { value: 'frxUSDCHF', label: 'USD/CHF (Dólar / Franco)', category: 'Forex Majors' },
        { value: 'frxAUDUSD', label: 'AUD/USD (Dólar Australiano)', category: 'Forex Majors' },
        { value: 'frxUSDCAD', label: 'USD/CAD (Dólar / Dólar Canadense)', category: 'Forex Majors' },
        { value: 'frxNZDUSD', label: 'NZD/USD (Dólar Neozelandês)', category: 'Forex Majors' },
        
        // Forex (Minors/Exotics)
        { value: 'frxEURGBP', label: 'EUR/GBP (Euro / Libra)', category: 'Forex Minors' },
        { value: 'frxEURJPY', label: 'EUR/JPY (Euro / Iene)', category: 'Forex Minors' },
        { value: 'frxGBPJPY', label: 'GBP/JPY (Libra / Iene)', category: 'Forex Minors' },
        { value: 'frxAUDCAD', label: 'AUD/CAD (Dólar Australiano / Canadense)', category: 'Forex Minors' },
        { value: 'frxAUDJPY', label: 'AUD/JPY (Dólar Australiano / Iene)', category: 'Forex Minors' },
        { value: 'frxCHFJPY', label: 'CHF/JPY (Franco / Iene)', category: 'Forex Minors' },
        { value: 'frxEURAUD', label: 'EUR/AUD (Euro / Dólar Australiano)', category: 'Forex Minors' },
        { value: 'frxGBPAUD', label: 'GBP/AUD (Libra / Dólar Australiano)', category: 'Forex Minors' },
        { value: 'frxUSDMXN', label: 'USD/MXN (Dólar / Peso Mexicano)', category: 'Forex Exotics' },
        
        // Metais
        { value: 'frxXAUUSD', label: 'XAU/USD (Ouro / Dólar)', category: 'Metais' },
        { value: 'frxXAGUSD', label: 'XAG/USD (Prata / Dólar)', category: 'Metais' },
        { value: 'frxXPTUSD', label: 'XPT/USD (Platina / Dólar)', category: 'Metais' },
        { value: 'frxXPDUSD', label: 'XPD/USD (Paládio / Dólar)', category: 'Metais' },
      ],
      ticks: [],
      isDestroying: false,
      chartUpdateTimer: null,
      latestTick: null,
      lastUpdate: null,
      chart: null,
      chartSeries: null,
      chartReady: false,
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
      proposalSubscriptionId: null,
      contractSubscriptionId: null,
      activeContract: null,
      currentProposalId: null,
      currentProposalPrice: null,
      proposalTimeout: null,
      proposalRetryCount: 0, // Contador para evitar loops infinitos
      maxProposalRetries: 3, // Máximo de tentativas de re-subscription
      lastProposalAttemptTime: 0, // Timestamp da última tentativa
      proposalThrottleMs: 2000, // Mínimo de tempo entre tentativas (2 segundos)
      // Countdown do contrato
      contractExpiryTime: null, // Timestamp de expiração do contrato
      countdownInterval: null, // Interval para atualizar countdown
      remainingTime: null, // Tempo restante em segundos
      durationErrorCount: 0,
      maxDurationErrors: 3,
      realTimeProfit: null,
      entrySpotLine: null,
      updateEntrySpotLine: null,
      entryMarker: null,
      entryTime: null,
      purchasePrice: null,
      isSellEnabled: false,
      isDemoAccount: false,
      showTradeResultModal: false,
      finalTradeProfit: 0,
      finalTradeType: 'CALL',
      finalTradeBuyPrice: 0,
      finalTradeSellPrice: null,
      finalTradeBalanceAfter: null,
      connectionCurrency: null,
      oauthLoading: false,
      expirationTime: '0m39s',
      expirationInterval: null,
      showAiCard: false,
      aiCardCycleInterval: null,
      aiRecommendationInterval: null,
      aiRecommendation: null,
      aiCardTimeout: null,
      audioContext: null,
      lastCanUseCallPut: null, // Para rastrear mudanças em canUseCallPut
      retryCount: 0,
      retryTimeout: null,
      maxRetries: Infinity, // Tentar infinitamente
      retryDelay: 3000, // 3 segundos inicial
      selectedTimeframe: '5m',
      analysisInProgress: false,
    };
  },
  computed: {
    marketsByCategory() {
      const grouped = {};
      this.markets.forEach(market => {
        const category = market.category || 'Outros';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(market);
      });
      return grouped;
    },
    canUseCallPut() {
      return this.supportsCallPut(this.symbol);
    },
    canUseMinutes() {
      if (!this.canUseCallPut) return false;
      const config = this.getValidDurationForSymbol(this.symbol);
      return config.allowedUnits.includes('m');
    },
    canUseTicks() {
      if (!this.canUseCallPut) return false;
      const config = this.getValidDurationForSymbol(this.symbol);
      return config.allowedUnits.includes('t');
    },
    canUseHours() {
      if (!this.canUseCallPut) return false;
      const config = this.getValidDurationForSymbol(this.symbol);
      return config.allowedUnits.includes('h');
    },
    canUseDays() {
      if (!this.canUseCallPut) return false;
      const config = this.getValidDurationForSymbol(this.symbol);
      return config.allowedUnits.includes('d');
    },
    stakeLimits() {
      const config = this.getValidDurationForSymbol(this.symbol);
      return {
        min: config.minStake || 0.35,
        max: config.maxStake || 10000
      };
    },
    loadingMessage() {
      if (this.connectionError) {
        return 'Reconectando automaticamente...';
      }
      if (this.isConnecting) {
        return 'Conectando à Deriv...';
      }
      return 'Carregando...';
    },
    pricePrecision() {
      if (this.symbol.startsWith('frx')) return 5;
      if ((this.accountCurrency || '').toUpperCase() === 'BTC') return 8;
      return 2;
    },
    displayCurrency() {
      // Usar a moeda preferida do usuário (tradeCurrency) para as operações
      // Esta é a mesma moeda exibida no dashboard
      // Se for DEMO, usar USD (o backend prioriza USD demo quando é DEMO)
      let currency = this.preferredCurrency || this.accountCurrency || this.connectionCurrency || 'USD';
      
      if (currency.toUpperCase() === 'DEMO') {
        currency = 'USD'; // DEMO não é uma moeda real, usar USD para requisições
      }
      
      return currency.toUpperCase();
    },
    chartResolutionLabel() {
      if (!this.ticks.length) return '--';
      return `${this.ticks.length} pts (${this.symbol})`;
    },
    formattedCountdown() {
      if (!this.remainingTime || this.remainingTime < 0) {
        return null;
      }
      
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      
      if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      }
      return `${seconds}s`;
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
    // ========== TRADINGVIEW LIGHTWEIGHT CHARTS ==========
    initChart() {
      if (this.chart) return;

      const container = this.$refs.chartContainer;
      if (!container) {
        setTimeout(() => this.initChart(), 100);
        return;
      }

      this.$nextTick(() => {
        try {
          // Limpar container
          container.innerHTML = '';

          const rect = container.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) {
            setTimeout(() => this.initChart(), 200);
            return;
          }

          // Criar gráfico TradingView Lightweight Charts
          this.chart = createChart(container, {
            width: rect.width,
            height: rect.height,
            layout: {
              background: { type: ColorType.Solid, color: '#0B0B0B' },
              textColor: '#DFDFDF',
            },
            grid: {
              vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
              horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            rightPriceScale: {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              textColor: '#DFDFDF',
            },
            timeScale: {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              timeVisible: false,
              secondsVisible: false,
            },
          });

          // Criar série de linha
          this.chartSeries = this.chart.addLineSeries({
            color: '#22C55E',
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: true,
          });

          // Marcar como pronto
          this.chartReady = true;
          
          // Se já temos dados, atualizar
          if (this.ticks.length > 0) {
            this.updateChart();
          }

          // Listener de resize
          if (!this._resizeHandler) {
            this._resizeHandler = () => {
              if (this.chart && !this.isDestroying && container) {
                const newRect = container.getBoundingClientRect();
                if (newRect.width > 0 && newRect.height > 0) {
                  this.chart.applyOptions({
                    width: newRect.width,
                    height: newRect.height,
                  });
                }
              }
            };
            window.addEventListener('resize', this._resizeHandler);
          }
        } catch (error) {
          console.error('[Chart] Erro ao criar gráfico TradingView:', error);
          this.chart = null;
          this.chartSeries = null;
        }
      });
    },

    // Atualizar gráfico TradingView
    updateChart() {
      if (!this.chart || !this.chartSeries || !this.chartReady || !this.ticks || this.ticks.length === 0) {
        return;
      }

      try {
        // Limpar ticks inválidos do array antes de processar
        this.ticks = this.ticks.filter(t => {
          if (!t || typeof t !== 'object') return false;
          const val = t.value ?? t.quote;
          const ep = t.epoch;
          const isValid = val != null && 
            isFinite(Number(val)) && 
            Number(val) > 0 && 
            !isNaN(Number(val)) &&
            ep != null && 
            isFinite(Number(ep)) && 
            Number(ep) > 0 &&
            !isNaN(Number(ep));
          return isValid;
        });
        
        if (this.ticks.length === 0) {
          console.warn('[Chart] Nenhum tick válido após limpeza');
          return;
        }
        
        // Limitar a últimos 5 minutos de ticks (aproximadamente 300 ticks)
        const maxTicks = 300;
        const ticksToUse = this.ticks.slice(-maxTicks);
        
        // Converter ticks para formato TradingView (time, value)
        let chartData = [];
        
        for (const tick of ticksToUse) {
          if (!tick || typeof tick !== 'object') continue;
          
          const value = tick.value ?? tick.quote;
          // Validação rigorosa: null, undefined, NaN, strings vazias, zero
          if (value == null || value === '' || (typeof value === 'number' && (isNaN(value) || !isFinite(value) || value <= 0))) {
            continue;
          }
          
          const numValue = Number(value);
          // Validação dupla: garantir que é um número válido e positivo
          if (!isFinite(numValue) || numValue <= 0 || isNaN(numValue)) {
            continue;
          }
          
          // Usar epoch como timestamp (em segundos, TradingView espera em segundos)
          // Garantir que seja um número inteiro
          let time = tick.epoch;
          if (time == null || time <= 0 || !isFinite(Number(time))) {
            time = Math.floor(Date.now() / 1000);
          } else {
            time = Math.floor(Number(time));
            if (!isFinite(time) || time <= 0) {
              time = Math.floor(Date.now() / 1000);
            }
          }
          
          // Validar que o tempo é válido (não muito antigo nem futuro)
          const now = Math.floor(Date.now() / 1000);
          if (time < now - 86400 || time > now + 3600) {
            // Se o tempo estiver muito fora do esperado, usar timestamp atual
            time = now;
          }
          
          // Validação final antes de adicionar: ambos devem ser números válidos e positivos
          if (isFinite(numValue) && numValue > 0 && isFinite(time) && time > 0 && !isNaN(numValue) && !isNaN(time)) {
            chartData.push({
              time: time,
              value: numValue
            });
          } else {
            console.warn('[Chart] Tick ignorado no updateChart - dados inválidos:', { value: numValue, epoch: time, tick });
          }
        }

        if (chartData.length === 0) {
          console.warn('[Chart] Nenhum dado válido para plotar');
          return;
        }

        // Ordenar por tempo (TradingView requer dados ordenados)
        chartData.sort((a, b) => a.time - b.time);
        
        // Validação final: verificar se há algum valor null ou inválido
        const invalidPoints = chartData.filter(p => 
          p.value == null || 
          !isFinite(p.value) || 
          p.value <= 0 || 
          isNaN(p.value) ||
          p.time == null ||
          !isFinite(p.time) ||
          p.time <= 0 ||
          isNaN(p.time)
        );
        
        if (invalidPoints.length > 0) {
          console.error('[Chart] ❌ Pontos inválidos encontrados:', invalidPoints);
          // Remover pontos inválidos
          chartData = chartData.filter(p => 
            p.value != null && 
            isFinite(p.value) && 
            p.value > 0 && 
            !isNaN(p.value) &&
            p.time != null &&
            isFinite(p.time) &&
            p.time > 0 &&
            !isNaN(p.time)
          );
          console.log('[Chart] Pontos válidos após limpeza:', chartData.length);
        }
        
        if (chartData.length === 0) {
          console.warn('[Chart] Nenhum dado válido após validação final');
          return;
        }
        
        console.log('[Chart] Atualizando gráfico com', chartData.length, 'pontos');
        console.log('[Chart] Primeiro ponto:', chartData[0]);
        console.log('[Chart] Último ponto:', chartData[chartData.length - 1]);
        
        // Verificação final antes de passar para o gráfico
        const finalValidation = chartData.every(p => 
          p.value != null && 
          typeof p.value === 'number' &&
          isFinite(p.value) && 
          p.value > 0 && 
          !isNaN(p.value) &&
          p.time != null &&
          typeof p.time === 'number' &&
          isFinite(p.time) &&
          p.time > 0 &&
          !isNaN(p.time)
        );
        
        if (!finalValidation) {
          console.error('[Chart] ❌ Validação final falhou! Verificando cada ponto...');
          chartData.forEach((p, idx) => {
            if (p.value == null || !isFinite(p.value) || p.value <= 0 || isNaN(p.value) ||
                p.time == null || !isFinite(p.time) || p.time <= 0 || isNaN(p.time)) {
              console.error(`[Chart] Ponto inválido no índice ${idx}:`, p);
            }
          });
          return;
        }
        
        console.log('[Chart] Estado do gráfico:', {
          chartExists: !!this.chart,
          chartSeriesExists: !!this.chartSeries,
          chartReady: this.chartReady,
          containerExists: !!this.$refs.chartContainer
        });

        // Atualizar série do gráfico
        try {
          this.chartSeries.setData(chartData);
          console.log('[Chart] ✅ Dados setados na série');
          
          // Ajustar viewport para mostrar os dados mais recentes
          setTimeout(() => {
            try {
              this.chart.timeScale().fitContent();
              console.log('[Chart] ✅ Viewport ajustado');
            } catch (error) {
              console.warn('[Chart] Erro ao ajustar viewport:', error);
            }
          }, 100);
        } catch (error) {
          console.error('[Chart] ❌ Erro ao setar dados:', error);
        }
      } catch (error) {
        console.error('[Chart] Erro ao atualizar:', error);
      }
    },

    // Agendar atualização
    scheduleUpdate() {
      if (this.chartUpdateTimer) {
        clearTimeout(this.chartUpdateTimer);
      }
      
      this.chartUpdateTimer = setTimeout(() => {
        if (this.chartReady) {
          this.updateChart();
        }
        this.chartUpdateTimer = null;
      }, 200);
    },
    async initConnection() {
      console.log('[OperationChart] initConnection - Iniciando conexão via backend');
      console.log('[OperationChart] Props recebidas:', {
        accountLoginid: this.accountLoginid,
        preferredCurrency: this.preferredCurrency,
        accountCurrency: this.accountCurrency
      });
      
      // Se já está conectado, não reconectar
      if (derivTradingService.isConnected && this.isAuthorized) {
        const expectedLoginid = this.accountLoginid || this.currentLoginid;
        if (this.currentLoginid === expectedLoginid && !this.isReconnecting) {
          console.log('[OperationChart] ✅ Conexão já está ativa, cancelando reconexão desnecessária');
          return;
        }
      }
      
      // Limpar retry anterior se existir
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }
      
      if (derivTradingService.isConnected) {
        console.log('[OperationChart] Fechando conexão WebSocket existente');
        this.teardownConnection();
      }
      
      // Se está em reconexão, preservar dados do gráfico
      if (this.isReconnecting) {
        console.log('[OperationChart] Em reconexão, preservando dados do gráfico');
        this.isLoadingSymbol = true;
      } else {
        // Primeira conexão ou conexão perdida - limpar dados
        this.ticks = [];
        this.latestTick = null;
        this.isLoadingSymbol = true;
      }
      
      // Garantir que o gráfico existe e está pronto
      if (!this.chart && this.$refs.chartContainer) {
        console.log('[OperationChart] Gráfico não existe, inicializando...');
        this.initChart();
      } else if (this.chart && this.$refs.chartContainer) {
        console.log('[OperationChart] Gráfico existe, preservando durante reconexão');
        this.$nextTick(() => {
          if (this.chart && this.ticks.length > 0) {
            if (this.chartReady) {
              this.scheduleUpdate();
            }
          }
        });
      }

      this.connectionError = '';
      this.isConnecting = true;
      
      // Obter token Deriv
      const derivToken = this.getTokenForAccount();
      if (!derivToken) {
        console.error('[OperationChart] ERRO: Nenhum token Deriv encontrado');
        this.isConnecting = false;
        localStorage.removeItem('deriv_connection');
        this.$router.push('/dashboard');
        return;
      }

      try {
        // Conectar via backend
        await derivTradingService.connect(derivToken, this.accountLoginid);
        console.log('[OperationChart] ✅ Conectado ao backend Deriv');
        
        // Iniciar stream SSE
        await derivTradingService.startStream((data) => {
          this.handleSSEMessage(data);
        }, derivToken);
        
        // Configurar listeners específicos
        derivTradingService.on('tick', (tickData) => {
          this.processTick({ tick: { quote: tickData.value, epoch: tickData.epoch } });
        });
        
        derivTradingService.on('history', (historyData) => {
          this.processHistory({ history: { prices: historyData.ticks.map(t => t.value), times: historyData.ticks.map(t => t.epoch) }, subscription: { id: historyData.subscriptionId } });
        });
        
        derivTradingService.on('proposal', (proposalData) => {
          this.processProposal({ proposal: proposalData, subscription: { id: proposalData.id } });
        });
        
        derivTradingService.on('contracts_for', (contractsData) => {
          this.processContractsFor({ contracts_for: contractsData });
        });
        
        derivTradingService.on('trading_durations', (durationsData) => {
          this.processTradingDurations({ trading_durations: durationsData });
        });
        
        derivTradingService.on('active_symbols', (symbolsData) => {
          this.processActiveSymbols({ active_symbols: symbolsData });
        });
        
        this.isAuthorized = true;
        this.isConnecting = false;
        this.currentLoginid = this.accountLoginid;
        
        // Inscrever-se no símbolo padrão
        if (this.symbol) {
          await this.subscribeToSymbol(this.symbol);
        }
        
      } catch (error) {
        console.error('[OperationChart] Erro ao conectar:', error);
        this.connectionError = error.message || 'Erro ao conectar com Deriv';
        this.isConnecting = false;
        this.isAuthorized = false;
        this.scheduleRetry();
      }
    },
    scheduleRetry() {
      // Limpar retry anterior se existir
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }
      
      // Incrementar contador de tentativas
      this.retryCount++;
      
      // Calcular delay com backoff exponencial (máximo 30 segundos)
      const delay = Math.min(this.retryDelay * Math.pow(1.5, this.retryCount - 1), 30000);
      
      console.log(`[OperationChart] Agendando retry ${this.retryCount} em ${delay}ms`);
      
      this.retryTimeout = setTimeout(() => {
        console.log(`[OperationChart] Executando retry ${this.retryCount}`);
        this.retryTimeout = null;
        this.initConnection();
      }, delay);
    },
    teardownConnection() {
      derivTradingService.stopStream();
      derivTradingService.disconnect();
      this.tickSubscriptionId = null;
      this.isAuthorized = false;
      // Não resetar isReconnecting aqui, será resetado quando nova conexão for estabelecida
    },
    startCountdown() {
      // Limpar interval anterior se existir
      this.stopCountdown();
      
      console.log('[OperationChart] Iniciando countdown. Expiry:', this.contractExpiryTime);
      
      // Atualizar countdown imediatamente
      this.updateCountdown();
      
      // Atualizar a cada segundo
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },
    updateCountdown() {
      if (!this.contractExpiryTime) {
        this.remainingTime = null;
        return;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const remaining = this.contractExpiryTime - now;
      
      if (remaining <= 0) {
        this.remainingTime = 0;
        this.stopCountdown();
      } else {
        this.remainingTime = remaining;
      }
    },
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      this.remainingTime = null;
    },
    handleSSEMessage(data) {
      // Processar mensagens SSE do backend
      if (data.error) {
        this.handleDerivError(data.error);
        return;
      }

      switch (data.type) {
        case 'tick':
          this.processTick({ tick: { quote: data.data.value, epoch: data.data.epoch } });
          break;
        case 'history':
          this.processHistory({ 
            history: { 
              prices: data.data.ticks?.map(t => t.value) || [], 
              times: data.data.ticks?.map(t => t.epoch) || [] 
            }, 
            subscription: { id: data.data.subscriptionId } 
          });
          break;
        case 'proposal': {
          // O backend envia proposalData com askPrice (camelCase)
          // Passar diretamente, o processProposal já aceita ambos os formatos
          const proposalData = data.data;
          this.processProposal({ 
            proposal: proposalData, 
            subscription: { id: proposalData.id } 
          });
          break;
        }
        case 'contracts_for':
          this.processContractsFor({ contracts_for: data.data });
          break;
        case 'trading_durations':
          this.processTradingDurations({ trading_durations: data.data });
          break;
        case 'active_symbols':
          this.processActiveSymbols({ active_symbols: data.data });
          break;
        case 'buy':
          this.processBuy({ buy: data.data });
          break;
        case 'sell':
          this.processSell({ sell: data.data });
          break;
        case 'error':
          this.handleDerivError(data.error);
          break;
      }
    },
    
    handleMessage(msg) {
      // Método legado - mantido para compatibilidade
      // A maioria das mensagens agora chega via SSE através de handleSSEMessage
      // Este método ainda pode ser usado para processar mensagens diretas se necessário
      
      if (msg.error) {
        this.handleDerivError(msg.error);
        return;
      }

      // Processar apenas mensagens que não chegam via SSE
      // As mensagens principais (tick, history, proposal, buy, sell) são processadas via SSE
      switch (msg.msg_type) {
        case 'proposal_open_contract':
          this.processProposalOpenContract(msg);
          break;
        default:
          // Outras mensagens são processadas via SSE
          break;
      }
    },
    handleDerivError(error) {
      const errorCode = error?.code || '';
      const message = error?.message || 'Erro desconhecido na Deriv';
      
      // Tratar "AlreadySubscribed" como sucesso (já está inscrito)
      if (errorCode === 'AlreadySubscribed') {
        console.log('[OperationChart] ℹ️ Já está inscrito:', message);
        // Não tratar como erro, apenas logar
        return;
      }
      
      console.error('[OperationChart] ========== ERRO DA DERIV ==========');
      console.error('[OperationChart] Erro completo:', JSON.stringify(error, null, 2));
      console.error('[OperationChart] Contexto:', {
        isTrading: this.isTrading,
        isAuthorized: this.isAuthorized,
        accountLoginid: this.accountLoginid,
        preferredCurrency: this.preferredCurrency,
        tokenPreview: this.token ? `${this.token.substring(0, 10)}...` : 'null'
      });
      
      const errorField = error?.details?.field || '';
      
      // Tratar erros específicos de duração
      if (errorCode === 'OfferingsValidationError' && errorField === 'duration') {
        this.durationErrorCount++;
        console.warn('[OperationChart] Duração inválida para este ativo. Tentativa', this.durationErrorCount, 'de', this.maxDurationErrors);
        
        // Circuit Breaker: Se excedeu o número máximo de tentativas, parar e mostrar erro
        if (this.durationErrorCount >= this.maxDurationErrors) {
          console.error('[OperationChart] Máximo de tentativas de ajuste de duração atingido. Parando para evitar loop infinito.');
          this.tradeError = 'Não foi possível determinar uma duração válida para este ativo. Tente outro ativo ou ajuste manualmente a duração.';
          // Cancelar qualquer proposta pendente para parar o loop
          this.unsubscribeFromProposal();
          // Resetar contador após 15 segundos para permitir novas tentativas
          setTimeout(() => {
            this.durationErrorCount = 0;
            console.log('[OperationChart] Contador de erros de duração resetado');
          }, 15000);
          return;
        }
        
        // Se não temos dados reais, tentar buscar primeiro (apenas uma vez)
        if (!this.contractsData[this.symbol] && !this.isLoadingContracts && this.durationErrorCount === 1) {
          console.log('[OperationChart] Buscando dados de contratos para ajustar duração...');
          this.fetchContractsForSymbol(this.symbol);
          // Aguardar um pouco e tentar novamente
          setTimeout(() => {
            if (this.durationErrorCount < this.maxDurationErrors) {
              this.handleDurationError();
            }
          }, 2000);
          return;
        }
        
        // Se está carregando, aguardar (mas só uma vez)
        if (this.isLoadingContracts && this.durationErrorCount <= 2) {
          setTimeout(() => {
            if (this.durationErrorCount < this.maxDurationErrors) {
              this.handleDurationError();
            }
          }, 2000);
          return;
        }
        
        // Tentar ajustar duração se já temos dados ou se esgotamos as tentativas de buscar
        this.handleDurationError();
        return;
      }
      
      // Resetar contador de erros de duração se não for erro de duração
      if (errorField !== 'duration') {
        this.durationErrorCount = 0;
      }
      
      // Tratar erros de contract_category (ativo não suporta CALL/PUT)
      if (errorCode === 'OfferingsValidationError' && errorField === 'contract_category') {
        console.warn('[OperationChart] Este ativo não suporta contratos CALL/PUT:', this.symbol);
        // Não tentar reconectar, apenas cancelar a subscription de proposal
        this.unsubscribeFromProposal();
        this.tradeError = 'Este ativo não suporta contratos CALL/PUT. Use a operação com dígitos para negociar este ativo.';
        return;
      }
      
      if (this.isTrading) {
        console.error('[OperationChart] Erro durante operação de compra/venda');
        this.tradeError = message;
        this.tradeMessage = '';
        this.isTrading = false;
      } else {
        // Para outros erros, não reconectar automaticamente se for erro de validação
        if (errorCode === 'OfferingsValidationError') {
          console.warn('[OperationChart] Erro de validação:', message);
          this.tradeError = message;
          // Se for erro de validação na proposta, tentar reenviar após ajuste
          if (errorField === 'duration' || errorField === 'amount' || errorField === 'symbol') {
            // O erro já foi tratado acima, não fazer nada aqui
            return;
          }
          return;
        }
        
        // Se for erro relacionado à proposta e não for erro de validação, tentar reenviar (com limite)
        // Verificar se não temos proposta atual e estamos autorizados
        // Mas não tentar se já está inscrito (AlreadySubscribed)
        if (errorCode !== 'AlreadySubscribed' && !this.currentProposalId && this.isAuthorized && !this.activeContract && this.proposalRetryCount < this.maxProposalRetries) {
          console.warn('[OperationChart] Erro pode estar relacionado à proposta, tentando reenviar após 2 segundos...');
          setTimeout(() => {
            if (this.isAuthorized && derivTradingService.isConnected && !this.activeContract && this.proposalRetryCount < this.maxProposalRetries) {
              this.subscribeToProposal();
            }
          }, 2000);
          return;
        }
        
        console.error('[OperationChart] Erro de conexão');
        this.connectionError = `${message}. Reconectando automaticamente...`;
        this.isAuthorized = false;
        this.scheduleRetry();
      }
    },
    handleDurationError() {
      console.warn('[OperationChart] Ajustando duração após erro de validação...');
      
      // Para Forex/Metais, aguardar dados de contratos antes de tentar novamente
      const isForexOrMetal = this.symbol.startsWith('frx');
      if (isForexOrMetal && !this.contractsData[this.symbol] && !this.isLoadingContracts) {
        console.log('[OperationChart] Forex/Metal sem dados de contratos, buscando antes de ajustar...');
        this.fetchContractsForSymbol(this.symbol);
        // Aguardar dados antes de tentar novamente
        setTimeout(() => {
          if (this.contractsData[this.symbol]) {
            this.handleDurationError();
          } else {
            console.warn('[OperationChart] Dados de contratos não recebidos, usando valores padrão seguros...');
            // Para Forex/Metais sem dados, usar valores seguros conhecidos
            this.localOrderConfig.duration = 15; // 15 minutos é geralmente o mínimo para Forex
            this.localOrderConfig.durationUnit = 'm';
            setTimeout(() => {
              this.subscribeToProposal();
            }, 500);
          }
        }, 2000);
        return;
      }
      
      const config = this.getValidDurationForSymbol(this.symbol);
      
      // Se temos dados reais, usar a duração mínima real da unidade padrão
      if (this.contractsData[this.symbol]) {
        const contractData = this.contractsData[this.symbol];
        const defaultUnit = contractData.defaultUnit || 'm';
        
        // Tentar usar a duração mínima da unidade padrão se disponível
        let minDuration = contractData.defaultDuration;
        if (contractData.durationsByUnit && contractData.durationsByUnit[defaultUnit]) {
          const unitLimits = contractData.durationsByUnit[defaultUnit];
          if (unitLimits.min !== Infinity && unitLimits.min > 0) {
            minDuration = unitLimits.min;
          }
        } else if (contractData.minDuration > 0) {
          minDuration = contractData.minDuration;
        }
        
        // VALIDAÇÃO CRÍTICA: Nunca usar duração 0 ou menor que 1
        if (minDuration <= 0 || !minDuration || isNaN(minDuration)) {
          console.warn('[OperationChart] Duração inválida detectada (0 ou menor), usando fallback seguro');
          // Para Forex/Metais, usar 15 minutos como mínimo seguro
          if (isForexOrMetal) {
            minDuration = 15;
            this.localOrderConfig.durationUnit = 'm';
          } else {
            // Para outros ativos, usar 1 minuto
            minDuration = 1;
            this.localOrderConfig.durationUnit = 'm';
          }
        }
        
        this.localOrderConfig.duration = minDuration;
        this.localOrderConfig.durationUnit = defaultUnit;
        
        console.log('[OperationChart] Duração ajustada usando dados reais:', {
          duration: this.localOrderConfig.duration,
          unit: this.localOrderConfig.durationUnit,
          symbol: this.symbol,
          minDuration: contractData.minDuration,
          maxDuration: contractData.maxDuration,
          allowedUnits: contractData.allowedUnits,
          durationsByUnit: contractData.durationsByUnit,
          wasInvalid: minDuration <= 0
        });
      } else {
        // Usar valores padrão do fallback
        let defaultDuration = config.defaultDuration;
        let defaultUnit = config.defaultUnit;
        
        // VALIDAÇÃO: Para Forex/Metais, garantir mínimo de 15 minutos
        if (isForexOrMetal && (defaultDuration < 15 || defaultUnit === 't')) {
          defaultDuration = 15;
          defaultUnit = 'm';
          console.log('[OperationChart] Ajustado para 15 minutos para Forex/Metal');
        }
        
        // VALIDAÇÃO: Nunca usar duração 0
        if (defaultDuration <= 0 || !defaultDuration || isNaN(defaultDuration)) {
          defaultDuration = isForexOrMetal ? 15 : 1;
          defaultUnit = 'm';
          console.warn('[OperationChart] Duração padrão inválida, usando fallback:', defaultDuration);
        }
        
        this.localOrderConfig.duration = defaultDuration;
        this.localOrderConfig.durationUnit = defaultUnit;
        
        console.log('[OperationChart] Duração ajustada usando valores padrão:', {
          duration: this.localOrderConfig.duration,
          unit: this.localOrderConfig.durationUnit,
          symbol: this.symbol,
          isForexOrMetal
        });
      }
      
      // Tentar novamente após ajuste
      setTimeout(() => {
        this.subscribeToProposal();
      }, 500);
    },
    async subscribeToSymbol(symbol = null) {
      const targetSymbol = symbol || this.symbol;
      console.log('[OperationChart] subscribeToSymbol - Inscrevendo-se no símbolo:', targetSymbol);
      
      if (!this.isAuthorized || !derivTradingService.isConnected) {
        console.warn('[OperationChart] Não é possível inscrever-se: não autorizado ou não conectado');
        return;
      }
      
      if (!targetSymbol) {
        console.warn('[OperationChart] Nenhum símbolo selecionado');
        return;
      }
      
      this.isLoadingSymbol = true;
      this.ticks = [];
      this.latestTick = null;
      this.tradeError = '';
      this.tradeMessage = '';

      if (this.tickSubscriptionId) {
        console.log('[OperationChart] Cancelando inscrição anterior:', this.tickSubscriptionId);
        // TODO: Implementar endpoint de cancelamento no backend
        this.tickSubscriptionId = null;
      }
      
      try {
        const derivToken = this.getTokenForAccount();
        await derivTradingService.subscribeSymbol(targetSymbol, derivToken, this.accountLoginid);
        console.log('[OperationChart] ✅ Inscrito no símbolo:', targetSymbol);
        
        // Buscar dados de contratos para este símbolo se ainda não tiver
        if (!this.contractsData[targetSymbol]) {
          this.fetchContractsForSymbol(targetSymbol);
        }
      } catch (error) {
        console.error('[OperationChart] Erro ao inscrever-se no símbolo:', error);
        this.isLoadingSymbol = false;
      }
    },
    async fetchContractsForSymbol(symbol) {
      if (!this.isAuthorized || !derivTradingService.isConnected) {
        console.warn('[OperationChart] Não é possível buscar contratos: não autorizado ou WebSocket não está aberto');
        return;
      }
      
      if (this.isLoadingContracts) {
        console.log('[OperationChart] Já está carregando contratos, aguardando...');
        return;
      }
      
      console.log('[OperationChart] Buscando dados de contratos para:', symbol);
      this.isLoadingContracts = true;
      
      // Timeout para resetar flag se os dados não chegarem
      setTimeout(() => {
        if (this.isLoadingContracts && !this.contractsData[symbol]) {
          console.warn('[OperationChart] Timeout ao buscar dados de contratos para', symbol, '- resetando flag');
          this.isLoadingContracts = false;
        }
      }, 5000); // 5 segundos de timeout
      
      try {
        await derivTradingService.getContracts(symbol, this.displayCurrency);
        // Os dados chegarão via SSE no evento 'contracts_for'
      } catch (error) {
        console.error('[OperationChart] Erro ao buscar contratos:', error);
        this.isLoadingContracts = false;
      }
    },
    processContractsFor(msg) {
      console.log('[OperationChart] processContractsFor - Dados de contratos recebidos');
      console.log('[OperationChart] Resposta completa:', JSON.stringify(msg, null, 2));
      
      if (msg.error) {
        console.error('[OperationChart] Erro ao buscar contratos:', msg.error);
        this.isLoadingContracts = false;
        return;
      }
      
      const contractsFor = msg.contracts_for;
      if (!contractsFor) {
        console.warn('[OperationChart] Resposta contracts_for inválida:', msg);
        this.isLoadingContracts = false;
        return;
      }
      
      const symbol = contractsFor.underlying || contractsFor.symbol || this.symbol;
      
      // A resposta pode ter diferentes estruturas:
      // 1. contractsFor.available (array de objetos)
      // 2. contractsFor.contracts (array de objetos)
      // 3. contractsFor (objeto com propriedades de contrato)
      // 4. Array direto de contratos
      let available = [];
      
      if (Array.isArray(contractsFor)) {
        available = contractsFor;
      } else if (Array.isArray(contractsFor.available)) {
        available = contractsFor.available;
      } else if (Array.isArray(contractsFor.contracts)) {
        available = contractsFor.contracts;
      } else if (typeof contractsFor === 'object') {
        // Se for um objeto único, tentar extrair dados dele
        // Pode ser que a API retorne um objeto com propriedades de contrato
        if (contractsFor.contract_type || contractsFor.name) {
          available = [contractsFor];
        } else {
          // Tentar encontrar arrays dentro do objeto
          for (const key in contractsFor) {
            if (Array.isArray(contractsFor[key])) {
              available = contractsFor[key];
              break;
            }
          }
        }
      }
      
      if (!Array.isArray(available) || available.length === 0) {
        console.warn('[OperationChart] Nenhum contrato disponível para este símbolo:', symbol);
        console.warn('[OperationChart] Estrutura recebida:', contractsFor);
        this.isLoadingContracts = false;
        return;
      }
      
      console.log('[OperationChart] Processando', available.length, 'contratos para', symbol);
      
      // Processar dados de contratos
      const contractTypes = [];
      const durationUnits = new Set();
      let minDuration = Infinity;
      let maxDuration = 0;
      let minStake = Infinity;
      let maxStake = 0;
      
      // Estrutura para armazenar durações por unidade
      const durationsByUnit = {};
      
      available.forEach((contract, index) => {
        // Log do primeiro contrato para debug
        if (index === 0) {
          console.log('[OperationChart] Exemplo de contrato recebido:', JSON.stringify(contract, null, 2));
        }
        
        // Coletar tipos de contrato (pode ser contract_type ou name)
        const contractType = contract.contract_type || contract.name || contract.type;
        if (contractType && !contractTypes.includes(contractType)) {
          contractTypes.push(contractType);
        }
        
        // Função auxiliar para parsear durações como "5t", "1d", "365d"
        const parseDuration = (durationStr) => {
          if (!durationStr) return null;
          const match = String(durationStr).match(/^(\d+)([a-z]+)$/i);
          if (match) {
            return {
              value: parseInt(match[1]),
              unit: match[2].toLowerCase()
            };
          }
          return null;
        };
        
        // Coletar durações mínimas/máximas (vêm como "5t", "1d", "365d")
        const minDurStr = contract.min_contract_duration || contract.min_duration;
        const maxDurStr = contract.max_contract_duration || contract.max_duration;
        
        const minDurParsed = parseDuration(minDurStr);
        const maxDurParsed = parseDuration(maxDurStr);
        
        // Processar durações
        if (minDurParsed) {
          const unit = minDurParsed.unit;
          const value = minDurParsed.value;
          
          durationUnits.add(unit);
          
          if (!durationsByUnit[unit]) {
            durationsByUnit[unit] = { min: Infinity, max: 0 };
          }
          
          durationsByUnit[unit].min = Math.min(durationsByUnit[unit].min, value);
          minDuration = Math.min(minDuration, value);
        }
        
        if (maxDurParsed) {
          const unit = maxDurParsed.unit;
          const value = maxDurParsed.value;
          
          durationUnits.add(unit);
          
          if (!durationsByUnit[unit]) {
            durationsByUnit[unit] = { min: Infinity, max: 0 };
          }
          
          durationsByUnit[unit].max = Math.max(durationsByUnit[unit].max, value);
          maxDuration = Math.max(maxDuration, value);
        }
        
        // Coletar apostas mínimas/máximas (pode vir de validation_params ou direto)
        let minStVal = null;
        let maxStVal = null;
        
        // Tentar extrair de validation_params (mais preciso)
        if (contract.validation_params) {
          if (contract.validation_params.stake) {
            minStVal = contract.validation_params.stake.min;
            maxStVal = contract.validation_params.stake.max;
          }
        }
        
        // Fallback para propriedades diretas
        if (!minStVal) {
          minStVal = contract.min_stake || contract.min_payout || contract.min_purchase;
        }
        if (!maxStVal) {
          maxStVal = contract.max_stake || contract.max_payout || contract.max_purchase;
        }
        
        if (minStVal !== undefined && minStVal !== null) {
          const minStNum = parseFloat(minStVal);
          if (!isNaN(minStNum) && minStNum > 0) {
            minStake = Math.min(minStake, minStNum);
          }
        }
        if (maxStVal !== undefined && maxStVal !== null) {
          const maxStNum = parseFloat(maxStVal);
          if (!isNaN(maxStNum) && maxStNum > 0) {
            maxStake = Math.max(maxStake, maxStNum);
          }
        }
      });
      
      // Log de debug das durações extraídas
      console.log('[OperationChart] Durações extraídas:', {
        minDuration,
        maxDuration,
        units: Array.from(durationUnits),
        byUnit: durationsByUnit
      });
      
      // Determinar unidade padrão e duração padrão baseado nos dados coletados
      let defaultUnit = 'm';
      let defaultDuration = 1;
      
      // Priorizar minutos se disponível, senão usar a primeira unidade disponível
      if (durationUnits.has('m')) {
        defaultUnit = 'm';
        if (durationsByUnit['m'] && durationsByUnit['m'].min !== Infinity && durationsByUnit['m'].min > 0) {
          defaultDuration = durationsByUnit['m'].min;
        }
      } else if (durationUnits.has('t')) {
        defaultUnit = 't';
        if (durationsByUnit['t'] && durationsByUnit['t'].min !== Infinity && durationsByUnit['t'].min > 0) {
          defaultDuration = durationsByUnit['t'].min;
        }
      } else if (durationUnits.has('h')) {
        defaultUnit = 'h';
        if (durationsByUnit['h'] && durationsByUnit['h'].min !== Infinity && durationsByUnit['h'].min > 0) {
          defaultDuration = durationsByUnit['h'].min;
        }
      } else if (durationUnits.has('d')) {
        defaultUnit = 'd';
        if (durationsByUnit['d'] && durationsByUnit['d'].min !== Infinity && durationsByUnit['d'].min > 0) {
          defaultDuration = durationsByUnit['d'].min;
        }
      } else if (durationUnits.size > 0) {
        defaultUnit = Array.from(durationUnits)[0];
        if (durationsByUnit[defaultUnit] && durationsByUnit[defaultUnit].min !== Infinity && durationsByUnit[defaultUnit].min > 0) {
          defaultDuration = durationsByUnit[defaultUnit].min;
        }
      }
      
      // VALIDAÇÃO CRÍTICA: Garantir que minDuration NUNCA seja 0 ou Infinity
      let finalMinDuration = minDuration;
      if (minDuration === Infinity || minDuration <= 0 || isNaN(minDuration)) {
        finalMinDuration = defaultDuration > 0 ? defaultDuration : 1;
        console.warn('[OperationChart] ⚠ minDuration inválido, usando defaultDuration:', finalMinDuration);
      }
      
      // Se ainda é inválido, usar fallback baseado no símbolo
      if (finalMinDuration <= 0 || isNaN(finalMinDuration)) {
        const isForex = symbol.startsWith('frx');
        finalMinDuration = isForex ? 15 : 1;
        console.warn('[OperationChart] ⚠ Usando fallback para', symbol, ':', finalMinDuration);
      }
      
      // Garantir maxDuration válido
      let finalMaxDuration = maxDuration;
      if (maxDuration === 0 || maxDuration === Infinity || isNaN(maxDuration)) {
        finalMaxDuration = 365; // 365 dias como padrão
      }
      
      // Garantir stakes válidos
      const finalMinStake = (minStake === Infinity || minStake <= 0 || isNaN(minStake)) ? 0.35 : minStake;
      const finalMaxStake = (maxStake === 0 || maxStake === Infinity || isNaN(maxStake)) ? 50000 : maxStake;
      
      // Armazenar dados processados
      this.contractsData[symbol] = {
        contractTypes: contractTypes,
        allowedUnits: Array.from(durationUnits),
        minDuration: finalMinDuration,
        maxDuration: finalMaxDuration,
        minStake: finalMinStake,
        maxStake: finalMaxStake,
        defaultUnit: defaultUnit,
        defaultDuration: finalMinDuration, // Usar o valor validado
        durationsByUnit: durationsByUnit,
        source: 'contracts_for' // Marcar origem dos dados
      };
      
      console.log('[OperationChart] ✅ Dados processados para', symbol, ':', {
        minDuration: finalMinDuration,
        maxDuration: finalMaxDuration,
        defaultUnit,
        units: Array.from(durationUnits).join(', '),
        minStake: finalMinStake,
        maxStake: finalMaxStake
      });
      
      // Atualizar configuração local se necessário
      if (symbol === this.symbol) {
        this.validateAndAdjustDuration();
        this.subscribeToProposal();
      }
      
      this.isLoadingContracts = false;
    },
    fetchTradingDurations() {
      if (!this.isAuthorized || !derivTradingService.isConnected) {
        console.warn('[OperationChart] Não é possível buscar trading durations');
        return;
      }
      
      if (this.isLoadingTradingDurations) return;
      
      console.log('[OperationChart] 🔍 Buscando trading durations globais...');
      this.isLoadingTradingDurations = true;
      
      // Trading durations serão buscados automaticamente quando necessário
      // TODO: Implementar endpoint específico se necessário
    },
    processTradingDurations(msg) {
      console.log('[OperationChart] ✅ Trading durations recebidos');
      
      if (msg.error) {
        console.error('[OperationChart] Erro:', msg.error);
        this.isLoadingTradingDurations = false;
        return;
      }
      
      const data = msg.trading_durations;
      if (!data || !Array.isArray(data)) {
        console.warn('[OperationChart] Dados inválidos em trading_durations:', data);
        this.isLoadingTradingDurations = false;
        return;
      }
      
      // Log da estrutura para debug
      console.log('[OperationChart] Exemplo de trading_duration (primeiro item):', JSON.stringify(data[0], null, 2));
      
      this.tradingDurationsCache = {};
      
      // A API Deriv retorna: { markets: [{name, subname, symbols: [{display_name, symbol, trading_durations: [...]}]}] }
      data.forEach(marketGroup => {
        if (!marketGroup.markets || !Array.isArray(marketGroup.markets)) return;
        
        marketGroup.markets.forEach(market => {
          if (!market.symbols || !Array.isArray(market.symbols)) return;
          
          market.symbols.forEach(symbolData => {
            const symbol = symbolData.symbol;
            if (!symbol || !symbolData.trading_durations) return;
            
            const contractData = {};
            
            symbolData.trading_durations.forEach(ct => {
              const type = ct.trade_type;
              if (!type || !ct.durations) return;
              
              contractData[type] = {
                minDuration: Infinity,
                maxDuration: 0,
                units: new Set(),
                byUnit: {}
              };
              
              ct.durations.forEach(dur => {
                const unit = dur.unit;
                const min = parseInt(dur.min) || 0;
                const max = parseInt(dur.max) || 0;
                
                if (unit) {
                  contractData[type].units.add(unit);
                  contractData[type].byUnit[unit] = { min, max };
                  
                  if (min > 0 && min < contractData[type].minDuration) {
                    contractData[type].minDuration = min;
                  }
                  if (max > contractData[type].maxDuration) {
                    contractData[type].maxDuration = max;
                  }
                }
              });
            });
            
            if (Object.keys(contractData).length > 0) {
              this.tradingDurationsCache[symbol] = contractData;
            }
          });
        });
      });
      
      console.log('[OperationChart] ✅ Cache criado para', Object.keys(this.tradingDurationsCache).length, 'símbolos');
      this.updateContractsFromTradingDurations();
      this.isLoadingTradingDurations = false;
    },
    updateContractsFromTradingDurations() {
      if (!this.tradingDurationsCache) return;
      
      Object.entries(this.tradingDurationsCache).forEach(([symbol, data]) => {
        // Só criar/atualizar se não temos dados de contracts_for (que são mais completos)
        if (this.contractsData[symbol] && this.contractsData[symbol].source !== 'trading_durations') {
          console.log('[OperationChart] Mantendo dados de contracts_for para', symbol);
          return;
        }
        
        const isForex = symbol.startsWith('frx');
        const callData = data['CALL'] || data['call'];
        if (!callData) return;
        
        let minDur = callData.minDuration !== Infinity ? callData.minDuration : (isForex ? 15 : 1);
        if (minDur <= 0) minDur = isForex ? 15 : 1;
        if (isForex && minDur < 15) minDur = 15;
        
        const units = Array.from(callData.units);
        const defaultUnit = units.includes('m') ? 'm' : (units.includes('t') ? 't' : (units[0] || 'm'));
        
        this.contractsData[symbol] = {
          contractTypes: ['CALL', 'PUT'],
          allowedUnits: units,
          minDuration: minDur,
          maxDuration: callData.maxDuration || 365,
          minStake: 0.35,
          maxStake: 10000,
          defaultUnit,
          defaultDuration: minDur,
          durationsByUnit: callData.byUnit,
          source: 'trading_durations'
        };
        
        console.log('[OperationChart] Dados criados para', symbol, 'via trading_durations:', {
          minDur,
          defaultUnit,
          units: units.join(', ')
        });
      });
      
      if (this.symbol && this.contractsData[this.symbol]) {
        console.log('[OperationChart] Atualizando configuração após trading_durations');
        this.validateAndAdjustDuration();
      }
    },
    fetchActiveSymbols() {
      if (!this.isAuthorized || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      console.log('[OperationChart] 🔍 Buscando active symbols...');
      // Active symbols serão buscados automaticamente quando necessário
      // TODO: Implementar endpoint específico se necessário
    },
    processActiveSymbols(msg) {
      if (msg.error || !msg.active_symbols) return;
      
      this.activeSymbolsCache = {};
      msg.active_symbols.forEach(s => {
        if (s.symbol) {
          this.activeSymbolsCache[s.symbol] = {
            displayName: s.display_name,
            market: s.market,
            isOpen: s.exchange_is_open === 1
          };
        }
      });
      
      console.log('[OperationChart] ✅ Active symbols:', Object.keys(this.activeSymbolsCache).length);
    },
    // Processar histórico de ticks - SIMPLIFICADO
    processHistory(msg) {
      const history = msg.history;
      if (!history || !history.prices) return;
      
      const newTicks = [];
      const prices = history.prices || [];
      const times = history.times || [];
      
      // Processar apenas os últimos 5 minutos (300 ticks)
      const startIdx = Math.max(0, prices.length - 300);
      
      for (let i = startIdx; i < prices.length; i++) {
        const rawValue = prices[i];
        const rawEpoch = times[i];
        
        // Validação rigorosa: verificar null, undefined, NaN
        if (rawValue == null || rawEpoch == null) {
          continue;
        }
        
        const value = Number(rawValue);
        const epoch = rawEpoch ? Math.floor(Number(rawEpoch)) : Math.floor(Date.now() / 1000) - (prices.length - i);
        
        // Validação dupla: garantir que são números válidos e positivos
        if (value == null || !isFinite(value) || value <= 0 || isNaN(value)) {
          continue;
        }
        
        if (epoch == null || !isFinite(epoch) || epoch <= 0 || isNaN(epoch)) {
          continue;
        }
        
        // Adicionar apenas se ambos são válidos
        if (isFinite(value) && value > 0 && isFinite(epoch) && epoch > 0) {
          newTicks.push({ value, epoch });
        }
      }
      
      // Limpar array de ticks inválidos antes de atribuir
      this.ticks = newTicks.filter(t => {
        const isValid = t && 
          t.value != null && 
          isFinite(t.value) && 
          t.value > 0 && 
          t.epoch != null && 
          isFinite(t.epoch) && 
          t.epoch > 0;
        if (!isValid) {
          console.warn('[Chart] Tick inválido removido do histórico:', t);
        }
        return isValid;
      });
      
      if (msg.subscription?.id) {
        this.tickSubscriptionId = msg.subscription.id;
      }
      
      this.isLoadingSymbol = false;
      
      // Inicializar ou atualizar gráfico
      if (!this.chart) {
        this.chartReady = false;
        this.initChart();
        setTimeout(() => {
          if (this.chartReady && this.ticks.length > 0) {
            this.updateChart();
          }
        }, 600);
      } else if (this.chartReady) {
        this.scheduleUpdate();
      }
    },
    // Processar candles - IGNORADO (focando apenas em ticks)
    processCandles() {
      // Ignorar candles por enquanto, focar apenas em ticks
      return;
    },
    // Processar tick individual - SIMPLIFICADO
    processTick(msg) {
      const tick = msg.tick;
      if (!tick || tick.quote == null || tick.epoch == null) return;
      
      const value = Number(tick.quote);
      const epoch = Number(tick.epoch);
      
      // Validação rigorosa ANTES de adicionar ao array
      if (value == null || !isFinite(value) || value <= 0 || isNaN(value)) {
        console.warn('[Chart] Tick ignorado - valor inválido:', value);
        return;
      }
      
      if (epoch == null || !isFinite(epoch) || epoch <= 0 || isNaN(epoch)) {
        console.warn('[Chart] Tick ignorado - epoch inválido:', epoch);
        return;
      }
      
      // Garantir que ambos são números válidos
      const validValue = Number(value);
      const validEpoch = Math.floor(Number(epoch));
      
      if (!isFinite(validValue) || validValue <= 0 || !isFinite(validEpoch) || validEpoch <= 0) {
        console.warn('[Chart] Tick ignorado - dados inválidos:', { value: validValue, epoch: validEpoch });
        return;
      }
      
      if (tick.id && !this.tickSubscriptionId) {
        this.tickSubscriptionId = tick.id;
      }
      
      // Adicionar tick e manter apenas últimos 300 (5 minutos)
      // Usar valores validados
      this.ticks.push({ value: validValue, epoch: validEpoch });
      if (this.ticks.length > 300) {
        this.ticks.shift();
      }
      
      this.latestTick = { value: validValue, epoch: validEpoch };
      this.lastUpdate = Date.now();
      
      // Atualizar gráfico TradingView diretamente (mais eficiente)
      if (this.chartReady && this.chartSeries) {
        try {
          // Validação rigorosa do valor antes de tudo
          if (value == null || !isFinite(value) || value <= 0 || isNaN(value)) {
            console.warn('[Chart] Valor inválido ignorado no processTick:', value);
            return;
          }
          
          // Garantir que epoch seja um número inteiro válido
          let validEpoch = Math.floor(Number(epoch));
          if (!validEpoch || validEpoch <= 0 || !isFinite(validEpoch)) {
            validEpoch = Math.floor(Date.now() / 1000);
          }
          
          // Validar que o tempo é válido
          const now = Math.floor(Date.now() / 1000);
          if (validEpoch < now - 86400 || validEpoch > now + 3600) {
            validEpoch = now;
          }
          
          // Validação final: ambos devem ser válidos
          if (!isFinite(value) || value <= 0 || !isFinite(validEpoch) || validEpoch <= 0) {
            console.warn('[Chart] Dados inválidos ignorados no processTick:', { value, epoch: validEpoch });
            return;
          }
          
          // Adicionar apenas o novo tick (atualização incremental)
          this.chartSeries.update({
            time: validEpoch,
            value: value
          });
        } catch (error) {
          console.error('[Chart] Erro ao atualizar tick:', error);
          // Se falhar, agendar atualização completa
          this.scheduleUpdate();
        }
      }
    },
    supportsCallPut(symbol) {
      // Verifica se o símbolo suporta contratos CALL/PUT (Rise/Fall)
      // Primeiro verifica se temos dados reais da API
      if (this.contractsData[symbol]) {
        const contractTypes = this.contractsData[symbol].contractTypes || [];
        return contractTypes.includes('CALL') || contractTypes.includes('PUT');
      }
      
      // Fallback para lógica hardcoded se não tiver dados reais
      if (symbol.startsWith('cry')) {
        return false; // Criptomoedas geralmente não suportam CALL/PUT
      }
      // Índices e Forex/Metais geralmente suportam CALL/PUT
      return true;
    },
    getValidDurationForSymbol(symbol) {
      const isForexOrMetal = symbol.startsWith('frx');
      
      // Primeiro verifica se temos dados reais da API
      if (this.contractsData[symbol]) {
        const data = this.contractsData[symbol];
        
        // Os dados já vêm validados do processContractsFor, apenas fazer validação final
        let minDuration = data.minDuration;
        let defaultDuration = data.defaultDuration || data.minDuration;
        let maxDuration = data.maxDuration;
        
        // Validação final silenciosa (sem warnings repetitivos)
        if (!minDuration || minDuration <= 0 || isNaN(minDuration)) {
          minDuration = isForexOrMetal ? 15 : 1;
        }
        
        if (!defaultDuration || defaultDuration <= 0 || isNaN(defaultDuration)) {
          defaultDuration = minDuration;
        }
        
        if (!maxDuration || maxDuration <= 0 || isNaN(maxDuration)) {
          maxDuration = 365;
        }
        
        // Para Forex/Metais, garantir mínimo de 15 minutos (silenciosamente)
        if (isForexOrMetal) {
          if (minDuration < 15) {
            minDuration = 15;
          }
          if (defaultDuration < 15) {
            defaultDuration = 15;
          }
        }
        
        return {
          min: minDuration,
          max: maxDuration,
          defaultUnit: data.defaultUnit || 'm',
          allowedUnits: data.allowedUnits && data.allowedUnits.length > 0 ? data.allowedUnits : ['m', 'h', 'd'],
          defaultDuration: defaultDuration,
          minStake: data.minStake || 0.35,
          maxStake: data.maxStake || 10000
        };
      }
      
      // Fallback para lógica hardcoded se não tiver dados reais
      if (symbol.startsWith('R_') || symbol.startsWith('1HZ')) {
        // Índices de Volatilidade: permitem durações curtas (1-5 minutos ou 1-10 ticks)
        return {
          min: 1,
          max: symbol.startsWith('1HZ') ? 10 : 5, // Índices 1s permitem até 10, outros até 5
          defaultUnit: 'm',
          allowedUnits: ['m', 't'],
          defaultDuration: 1,
          minStake: 0.35,
          maxStake: 10000
        };
      } else if (symbol.startsWith('cry')) {
        // Criptomoedas: permitem durações médias (1-365 dias, 1-24 horas, 1-60 minutos)
        return {
          min: 1,
          max: 365,
          defaultUnit: 'm',
          allowedUnits: ['m', 'h', 'd'],
          defaultDuration: 1,
          minStake: 0.35,
          maxStake: 10000
        };
      } else if (symbol.startsWith('frx')) {
        // Forex e Metais: SEMPRE usar mínimo de 15 minutos
        // API Deriv geralmente não aceita menos que isso para Forex
        return {
          min: 15, // Duração mínima SEGURA para Forex/Metais
          max: 365,
          defaultUnit: 'm', // Manter minutos pois temos botão para isso
          allowedUnits: ['m', 'h', 'd'],
          defaultDuration: 15, // 15 minutos como padrão seguro
          minStake: 0.35,
          maxStake: 10000
        };
      }
      // Padrão: minutos
      return {
        min: 1,
        max: 5,
        defaultUnit: 'm',
        allowedUnits: ['m', 't'],
        defaultDuration: 1,
        minStake: 0.35,
        maxStake: 10000
      };
    },
    validateAndAdjustDuration() {
      const config = this.getValidDurationForSymbol(this.symbol);
      let duration = Number(this.localOrderConfig.duration) || 1;
      let unit = this.localOrderConfig.durationUnit || config.defaultUnit;
      
      // Se temos dados reais com durações por unidade, usar limites específicos
      if (this.contractsData[this.symbol] && this.contractsData[this.symbol].durationsByUnit) {
        const durationsByUnit = this.contractsData[this.symbol].durationsByUnit;
        
        // Se a unidade atual tem limites específicos, usar esses limites
        if (durationsByUnit[unit]) {
          const unitLimits = durationsByUnit[unit];
          if (unitLimits.min !== Infinity && duration < unitLimits.min) {
            duration = unitLimits.min;
          }
          if (unitLimits.max !== 0 && duration > unitLimits.max) {
            duration = unitLimits.max;
          }
        }
      } else {
        // Usar limites gerais se não tiver dados por unidade
        if (duration < config.min) {
          duration = config.min;
        } else if (duration > config.max) {
          duration = config.max;
        }
      }
      
      // Se a unidade não é permitida, tentar usar uma unidade que tenha botão disponível
      if (!config.allowedUnits.includes(unit)) {
        // Prioridade: minutos > ticks > horas > dias
        if (config.allowedUnits.includes('m')) {
          unit = 'm';
        } else if (config.allowedUnits.includes('t')) {
          unit = 't';
        } else if (config.allowedUnits.includes('h')) {
          unit = 'h';
        } else if (config.allowedUnits.includes('d')) {
          unit = 'd';
        } else {
          unit = config.defaultUnit;
        }
        duration = config.defaultDuration;
        
        // Se temos dados reais, usar a duração mínima da unidade selecionada
        if (this.contractsData[this.symbol] && this.contractsData[this.symbol].durationsByUnit) {
          const durationsByUnit = this.contractsData[this.symbol].durationsByUnit;
          if (durationsByUnit[unit] && durationsByUnit[unit].min !== Infinity) {
            duration = durationsByUnit[unit].min;
          }
        }
      }
      
      // Se a unidade atual não tem botão disponível (h ou d), usar minutos como fallback
      const availableButtons = [];
      if (config.allowedUnits.includes('m')) availableButtons.push('m');
      if (config.allowedUnits.includes('t')) availableButtons.push('t');
      
      if (availableButtons.length > 0 && !availableButtons.includes(unit)) {
        // Usar a primeira unidade disponível que tem botão
        unit = availableButtons[0];
        
        // Usar duração mínima da unidade selecionada se disponível
        if (this.contractsData[this.symbol] && this.contractsData[this.symbol].durationsByUnit) {
          const durationsByUnit = this.contractsData[this.symbol].durationsByUnit;
          if (durationsByUnit[unit] && durationsByUnit[unit].min !== Infinity) {
            duration = durationsByUnit[unit].min;
          } else {
            duration = config.defaultDuration;
          }
        } else {
          duration = config.defaultDuration;
        }
      }
      
      // Ajustar valores
      if (this.localOrderConfig.duration !== duration) {
        this.localOrderConfig.duration = duration;
      }
      if (this.localOrderConfig.durationUnit !== unit) {
        this.localOrderConfig.durationUnit = unit;
      }
      
      return { duration, unit };
    },
    handleSymbolChange() {
      if (this.isTrading || this.activeContract) return;
      console.log('[OperationChart] Mudando símbolo para:', this.symbol);
      
      // Resetar todos os contadores de erro/retry ao mudar de símbolo
      this.durationErrorCount = 0;
      this.proposalRetryCount = 0;
      this.tradeError = '';
      
      // Cancelar proposta atual ao mudar de símbolo (isso também limpa timeouts)
      this.unsubscribeFromProposal();
      
      // Limpar dados do gráfico (a desinscrição do símbolo anterior é feita automaticamente por subscribeToSymbol)
      if (this.lineSeries) {
        try {
          this.lineSeries.setData([]);
        } catch (error) {
          console.warn('[OperationChart] Erro ao limpar série de linha:', error);
        }
      }
      this.ticks = [];
      // Inscrever no novo símbolo
      this.subscribeToSymbol();
      
      // Buscar dados de contratos para o novo símbolo se ainda não tiver
      if (!this.contractsData[this.symbol]) {
        this.fetchContractsForSymbol(this.symbol);
      }
      
      // Validar e ajustar duração para o novo símbolo
      this.validateAndAdjustDuration();
      
      // Ajustar valor da entrada se necessário
      this.validateAndAdjustStake();
      
      // Reiniciar subscription de proposal quando símbolo mudar
      this.subscribeToProposal();
    },
    validateAndAdjustStake() {
      const config = this.getValidDurationForSymbol(this.symbol);
      let stake = Number(this.localOrderConfig.value) || config.minStake || 0.35;
      
      if (config.minStake && stake < config.minStake) {
        stake = config.minStake;
      }
      if (config.maxStake && stake > config.maxStake) {
        stake = config.maxStake;
      }
      
      if (this.localOrderConfig.value !== stake) {
        this.localOrderConfig.value = stake;
      }
    },
    onDurationChange() {
      if (this.isTrading || this.activeContract) return;
      
      // Validar e ajustar duração
      this.validateAndAdjustDuration();
      
      // Resetar contadores ao mudar duração
      this.proposalRetryCount = 0;
      this.tradeError = '';
      
      // Atualizar proposal quando duração mudar
      this.subscribeToProposal();
    },
    setDurationUnit(unit) {
      if (this.isTrading || this.activeContract) return;
      
      // Validar se a unidade é permitida para este símbolo
      const config = this.getValidDurationForSymbol(this.symbol);
      if (!config.allowedUnits.includes(unit)) {
        console.warn('[OperationChart] Unidade de duração não permitida para este ativo. Usando unidade padrão.');
        unit = config.defaultUnit;
      }
      
      this.localOrderConfig.durationUnit = unit;
      
      // Ajustar duração baseado na unidade e limites do símbolo
      let duration = Number(this.localOrderConfig.duration) || 1;
      if (unit === 't') {
        duration = Math.max(config.min, Math.min(duration, Math.min(10, config.max)));
      } else {
        duration = Math.max(config.min, Math.min(duration, config.max));
      }
      
      this.localOrderConfig.duration = duration;
      
      // Resetar contadores ao mudar unidade
      this.proposalRetryCount = 0;
      this.tradeError = '';
      
      // Atualizar proposal quando unidade de duração mudar
      this.subscribeToProposal();
    },
    setTimeframe(timeframe) {
      this.selectedTimeframe = timeframe;
      // Aqui você pode adicionar lógica para atualizar o gráfico com o novo timeframe
      console.log('[OperationChart] Timeframe alterado para:', timeframe);
    },
    async startAnalysis() {
      if (this.analysisInProgress) {
        // Se já está em progresso, apenas atualizar
        return;
      }
      
      this.analysisInProgress = true;
      const signalArea = document.getElementById('signalArea');
      if (!signalArea) {
        this.analysisInProgress = false;
        return;
      }
      
      // Mostrar estado de análise
      signalArea.innerHTML = `
        <div class="relative bg-zenix-card rounded-lg px-4 py-4 border border-zenix-border">
          <div class="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-zenix-bg border border-zenix-border rounded-md">
            <div class="w-1.5 h-1.5 bg-zenix-green rounded-full animate-pulse"></div>
            <span class="text-[9px] font-medium text-[#DFDFDF88] tracking-wide uppercase">IA em processamento</span>
          </div>
          <div class="flex items-center gap-3 mb-3">
            <div class="flex-shrink-0 w-8 h-8 border-2 border-zenix-border border-t-zenix-green rounded-full animate-spin" style="animation-duration: 1.5s;"></div>
            <div class="flex-1">
              <h4 id="analysisStageText" class="text-sm font-semibold text-zenix-text mb-0.5">Coletando dados de mercado…</h4>
              <p class="text-[10px] text-[#DFDFDF66]">Processando informações do ativo</p>
            </div>
          </div>
          <div class="relative h-0.5 bg-zenix-bg rounded-full overflow-hidden">
            <div class="absolute inset-0 bg-zenix-green/60 rounded-full" style="animation: progressBar 2s ease-in-out infinite;"></div>
          </div>
        </div>
      `;
      
      // Animar através dos estágios
      const stages = [
        'Coletando dados de mercado…',
        'Analisando comportamento do preço…',
        'Avaliando padrões operacionais…',
        'Gerando sinal ideal…'
      ];
      
      let currentStage = 0;
      const stageInterval = setInterval(() => {
        currentStage++;
        const textElement = document.getElementById('analysisStageText');
        if (textElement && currentStage < stages.length) {
          textElement.style.opacity = '0';
          setTimeout(() => {
            textElement.textContent = stages[currentStage];
            textElement.style.opacity = '1';
          }, 150);
        }
      }, 650);
      
      try {
        // Buscar recomendação da IA usando os ticks atuais
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }
        
        // Preparar ticks para a API (últimos 10 ticks)
        const ticksForAnalysis = this.ticks.slice(-10).map(tick => ({
          value: Number(tick.value),
          epoch: Number(tick.epoch) || (tick.time ? Math.floor(tick.time / 1000) : Math.floor(Date.now() / 1000))
        }));
        
        if (ticksForAnalysis.length === 0) {
          throw new Error('Não há dados de ticks disponíveis para análise');
        }
        
        // Atualizar estágio
        const textElement = document.getElementById('analysisStageText');
        if (textElement) {
          textElement.textContent = 'Consultando IA para recomendação…';
        }
        
        // Buscar recomendação da IA
        const response = await fetch(`${apiBaseUrl}/gemini/recommendation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ticks: ticksForAnalysis
          })
        });
        
        if (!response.ok) {
          throw new Error('Erro ao buscar recomendação da IA');
        }
        
        const aiRecommendation = await response.json();
        clearInterval(stageInterval);
        
        // Processar resposta da IA
        const direction = aiRecommendation.action || 'CALL';
        const confidence = aiRecommendation.confidence || 50;
        const reasoning = aiRecommendation.reasoning || '';
        const isCall = direction === 'CALL';
        const now = new Date();
        const entryTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + 'h';
        const duration = `${this.localOrderConfig.duration}${this.localOrderConfig.durationUnit === 'm' ? 'min' : ' Ticks'}`;
        
        // Exibir sinal gerado pela IA
        signalArea.innerHTML = `
          <div class="bg-zenix-card border border-zenix-border rounded-lg px-3 py-2.5">
            <div class="flex items-center justify-between mb-2.5 flex-wrap gap-2">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-[11px] text-[#DFDFDF66] font-medium">${this.symbol}</span>
                <span class="px-2 py-0.5 ${isCall ? 'bg-zenix-green/20 text-zenix-green' : 'bg-[#FF4747]/20 text-[#FF4747]'} text-[11px] font-semibold rounded ${isCall ? 'border-zenix-green/30' : 'border-[#FF4747]/30'} border">${direction}</span>
                <span class="text-[11px] text-[#DFDFDF88]">Entrada: <span class="text-zenix-text font-medium">${entryTime}</span></span>
                <span class="text-[11px] text-[#DFDFDF88]">Duração: <span class="text-zenix-text font-medium">${duration}</span></span>
                <span class="px-2 py-0.5 bg-zenix-green/10 text-zenix-green text-[10px] font-semibold rounded border border-zenix-green/20">● Ativo</span>
              </div>
            </div>
            ${confidence ? `
              <div class="mt-2 pt-2 border-t border-zenix-border">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] text-[#DFDFDF66]">Confiança:</span>
                  <span class="text-[11px] font-semibold ${confidence >= 70 ? 'text-zenix-green' : confidence >= 50 ? 'text-yellow-500' : 'text-orange-500'}">${confidence}%</span>
                </div>
                ${reasoning ? `<p class="text-[10px] text-[#DFDFDF88] mt-1">${reasoning}</p>` : ''}
              </div>
            ` : ''}
          </div>
        `;
        
        this.analysisInProgress = false;
      } catch (error) {
        clearInterval(stageInterval);
        console.error('[OperationChart] Erro ao buscar recomendação da IA:', error);
        
        // Exibir erro
        signalArea.innerHTML = `
          <div class="bg-zenix-card border border-red-500/30 rounded-lg px-3 py-2.5">
            <div class="flex items-center gap-2 text-red-400">
              <i class="fas fa-exclamation-triangle text-xs"></i>
              <span class="text-xs font-medium">Erro ao gerar sinal: ${error.message || 'Erro desconhecido'}</span>
            </div>
          </div>
        `;
        
        this.analysisInProgress = false;
      }
    },
    selectTradeType(type) {
      if (this.isTrading || this.activeContract) return;
      this.localOrderConfig.type = type;
      
      // Resetar contadores ao mudar tipo
      this.proposalRetryCount = 0;
      this.tradeError = '';
      
      // Atualizar proposal quando tipo mudar
      this.subscribeToProposal();
    },
    getTokenForAccount() {
      console.log('[OperationChart] getTokenForAccount - Buscando token para conta');
      
      // Ler snapshot de conexão para obter moeda preferida se a prop não estiver disponível
      let effectivePreferredCurrency = this.preferredCurrency;
      let effectiveAccountLoginid = this.accountLoginid;
      
      try {
        const savedConnection = localStorage.getItem('deriv_connection');
        if (savedConnection) {
          const snapshot = JSON.parse(savedConnection);
          if (!effectivePreferredCurrency || effectivePreferredCurrency === 'USD') {
            effectivePreferredCurrency = snapshot?.preferredCurrency || effectivePreferredCurrency;
            if (snapshot?.preferredCurrency) {
              console.log('[OperationChart] 📋 Usando moeda preferida do snapshot:', effectivePreferredCurrency);
            }
          }
          if (!effectiveAccountLoginid && snapshot?.loginid) {
            effectiveAccountLoginid = snapshot.loginid;
            console.log('[OperationChart] 📋 Usando LoginID do snapshot:', effectiveAccountLoginid);
          }
        }
      } catch (error) {
        console.warn('[OperationChart] Erro ao ler snapshot de conexão:', error);
      }
      
      console.log('[OperationChart] Parâmetros efetivos:', {
        accountLoginid: effectiveAccountLoginid,
        preferredCurrency: effectivePreferredCurrency,
        accountCurrency: this.accountCurrency
      });
      
      // Se a moeda preferida for DEMO, priorizar contas demo
      const isDemoPreferred = effectivePreferredCurrency?.toUpperCase() === 'DEMO';
      if (isDemoPreferred) {
        console.log('[OperationChart] Moeda preferida é DEMO, buscando token de conta demo...');
        try {
          const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
          const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
          
          // Buscar qualquer conta demo disponível
          for (const [loginid, token] of Object.entries(tokensByLoginId)) {
            if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
              console.log('[OperationChart] ✓ Token demo encontrado para moeda preferida DEMO:', loginid);
              return token;
            }
          }
          console.warn('[OperationChart] ⚠ Nenhuma conta demo encontrada, mas moeda preferida é DEMO');
        } catch (error) {
          console.error('[OperationChart] Erro ao buscar token demo:', error);
        }
      }
      
      // Se temos um loginid específico, tentar buscar o token correspondente
      if (effectiveAccountLoginid) {
        try {
          const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
          console.log('[OperationChart] Tokens armazenados (raw):', tokensByLoginIdStr);
          const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
          console.log('[OperationChart] Tokens parseados:', tokensByLoginId);
          console.log('[OperationChart] Loginids disponíveis:', Object.keys(tokensByLoginId));
          
          // Verificar se o loginid é de uma conta demo (começa com VRTC ou VRT)
          const isDemoLoginId = effectiveAccountLoginid.startsWith('VRTC') || effectiveAccountLoginid.startsWith('VRT');
          if (isDemoLoginId) {
            console.log('[OperationChart] ✓ LoginID identificado como conta DEMO:', effectiveAccountLoginid);
          }
          
          const specificToken = tokensByLoginId[effectiveAccountLoginid];
          if (specificToken) {
            console.log('[OperationChart] ✓ Token específico encontrado para loginid:', effectiveAccountLoginid);
            console.log('[OperationChart] - Tipo de conta:', isDemoLoginId ? 'DEMO' : 'REAL');
            console.log('[OperationChart] - Token (preview):', `${specificToken.substring(0, 10)}...`);
            return specificToken;
          } else {
            console.warn('[OperationChart] ⚠ Token específico NÃO encontrado para loginid:', effectiveAccountLoginid);
            console.warn('[OperationChart] Loginids disponíveis:', Object.keys(tokensByLoginId));
            
            // Se for conta demo e não encontrou token específico, tentar encontrar qualquer token demo
            if (isDemoLoginId) {
              console.log('[OperationChart] Tentando encontrar token demo alternativo...');
              for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
                  console.log('[OperationChart] ✓ Token demo alternativo encontrado:', loginid);
                  return token;
                }
              }
            }
          }
        } catch (error) {
          console.error('[OperationChart] ERRO ao buscar token específico:', error);
        }
      } else {
        console.log('[OperationChart] Nenhum accountLoginid fornecido, usando token padrão');
      }
      
      // Fallback: usar o token padrão
      const defaultToken = localStorage.getItem('deriv_token');
      console.log('[OperationChart] Usando token padrão:', {
        hasToken: !!defaultToken,
        tokenPreview: defaultToken ? `${defaultToken.substring(0, 10)}...` : 'null'
      });
      
      if (!defaultToken) {
        console.error('[OperationChart] ERRO: Nenhum token encontrado!');
        console.error('[OperationChart] O usuário precisa conectar uma conta Deriv via OAuth.');
      }
      
      return defaultToken;
    },
    subscribeToProposal() {
      // Throttle: Evitar chamadas muito rápidas
      const now = Date.now();
      if (now - this.lastProposalAttemptTime < this.proposalThrottleMs) {
        console.log('[OperationChart] Throttling subscribeToProposal - aguardando intervalo mínimo');
        return;
      }
      this.lastProposalAttemptTime = now;
      
      // Cancelar subscription anterior se existir
      this.unsubscribeFromProposal();
      
      if (!this.isAuthorized || !derivTradingService.isConnected) {
        console.warn('[OperationChart] Não é possível subscrever proposal: não autorizado ou não conectado');
        return;
      }
      
      if (this.activeContract) {
        // Não subscrever proposal se já houver contrato ativo
        console.log('[OperationChart] Contrato ativo detectado, não subscrevendo proposal');
        return;
      }
      
      // Verificar se o ativo suporta CALL/PUT antes de tentar subscrever
      if (!this.supportsCallPut(this.symbol)) {
        console.warn('[OperationChart] Ativo não suporta contratos CALL/PUT, não subscrevendo proposal:', this.symbol);
        this.tradeError = 'Este ativo não suporta contratos CALL/PUT. Use a operação com dígitos para negociar este ativo.';
        return;
      }
      
      // Para Forex e Metais, buscar dados de contratos primeiro
      const isForexOrMetal = this.symbol.startsWith('frx');
      
      if (isForexOrMetal && !this.contractsData[this.symbol] && !this.isLoadingContracts) {
        console.log('[OperationChart] Forex/Metal detectado, buscando dados de contratos...');
        this.fetchContractsForSymbol(this.symbol);
        
        // Aguardar até 5 segundos pelos dados de contratos
        const maxWaitTime = 5000;
        const startTime = Date.now();
        let waitAttempt = 0;
        const maxWaitAttempts = 10; // 10 tentativas de 500ms = 5 segundos
        
        const checkAndProceed = () => {
          waitAttempt++;
          const elapsed = Date.now() - startTime;
          
          if (this.contractsData[this.symbol]) {
            // Dados recebidos, prosseguir
            console.log('[OperationChart] Dados de contratos recebidos para Forex, prosseguindo...');
            this.proceedWithProposal();
          } else if (waitAttempt >= maxWaitAttempts || elapsed >= maxWaitTime) {
            // Timeout - usar valores padrão seguros para Forex
            console.warn('[OperationChart] Timeout aguardando dados de contratos para Forex. Usando valores padrão.');
            // Ajustar duração para um valor mais seguro
            if (this.localOrderConfig.durationUnit === 'm' && this.localOrderConfig.duration < 15) {
              this.localOrderConfig.duration = 15; // 15 minutos como padrão mais seguro para Forex
              console.log('[OperationChart] Ajustado para 15 minutos como padrão seguro para Forex');
            } else if (this.localOrderConfig.durationUnit === 't') {
              // Forex geralmente não suporta ticks, mudar para minutos
              this.localOrderConfig.durationUnit = 'm';
              this.localOrderConfig.duration = 15;
              console.log('[OperationChart] Forex não suporta ticks, mudado para 15 minutos');
            }
            this.proceedWithProposal();
          } else if (this.activeContract) {
            // Se um contrato foi criado enquanto esperávamos, cancelar
            console.log('[OperationChart] Contrato criado durante espera, cancelando subscription');
            return;
          } else {
            // Ainda aguardando, verificar novamente
            setTimeout(checkAndProceed, 500);
          }
        };
        
        // Iniciar verificação
        setTimeout(checkAndProceed, 500);
        return;
      }
      
      // Para outros ativos (índices), buscar dados em background se não disponíveis
      if (!this.contractsData[this.symbol] && !this.isLoadingContracts) {
        console.log('[OperationChart] Dados de contratos não disponíveis, buscando em background...');
        this.fetchContractsForSymbol(this.symbol);
      }
      
      // Prosseguir com a proposta
      this.proceedWithProposal();
    },
    async proceedWithProposal() {
      // Validar e ajustar duração antes de enviar
      const { duration, unit } = this.validateAndAdjustDuration();
      const displayCurrency = this.displayCurrency;
      
      // Verificar se temos dados reais e usar duração mínima real se disponível
      let finalDuration = duration;
      let finalUnit = unit;
      
      if (this.contractsData[this.symbol]) {
        const contractData = this.contractsData[this.symbol];
        
        // Se temos durações por unidade, usar limites específicos da unidade
        if (contractData.durationsByUnit && contractData.durationsByUnit[finalUnit]) {
          const unitLimits = contractData.durationsByUnit[finalUnit];
          if (unitLimits.min !== Infinity && finalDuration < unitLimits.min) {
            finalDuration = unitLimits.min;
            console.log('[OperationChart] Ajustando duração para mínimo real da unidade', finalUnit + ':', finalDuration);
          }
          if (unitLimits.max !== 0 && finalDuration > unitLimits.max) {
            finalDuration = unitLimits.max;
            console.log('[OperationChart] Ajustando duração para máximo real da unidade', finalUnit + ':', finalDuration);
          }
        } else {
          // Usar limites gerais se não tiver dados por unidade
          if (finalDuration < contractData.minDuration) {
            finalDuration = contractData.minDuration;
            console.log('[OperationChart] Ajustando duração para mínimo real:', finalDuration);
          }
          if (finalDuration > contractData.maxDuration) {
            finalDuration = contractData.maxDuration;
            console.log('[OperationChart] Ajustando duração para máximo real:', finalDuration);
          }
        }
        
        // Garantir que a unidade é permitida
        if (!contractData.allowedUnits.includes(finalUnit)) {
          finalUnit = contractData.defaultUnit || 'm';
          // Ajustar duração para a mínima da nova unidade
          if (contractData.durationsByUnit && contractData.durationsByUnit[finalUnit]) {
            const unitLimits = contractData.durationsByUnit[finalUnit];
            if (unitLimits.min !== Infinity) {
              finalDuration = unitLimits.min;
            } else {
              finalDuration = contractData.defaultDuration;
            }
          } else {
            finalDuration = contractData.defaultDuration;
          }
          console.log('[OperationChart] Ajustando unidade para padrão real:', finalUnit, 'com duração:', finalDuration);
        }
      }
      
      const payload = {
        proposal: 1,
        amount: Number(this.localOrderConfig.value),
        basis: 'stake',
        contract_type: this.localOrderConfig.type,
        currency: displayCurrency,
        duration: finalDuration,
        duration_unit: finalUnit,
        symbol: this.symbol,
        subscribe: 1, // Subscription contínua
      };
      
      console.log('[OperationChart] Subscribing to proposal:', JSON.stringify(payload, null, 2));
      
      // Limpar timeout anterior se existir
      if (this.proposalTimeout) {
        clearTimeout(this.proposalTimeout);
        this.proposalTimeout = null;
      }
      
      // Resetar proposta atual antes de enviar
      this.currentProposalId = null;
      this.currentProposalPrice = null;
      
      const proposalConfig = {
        symbol: this.symbol,
        contractType: this.localOrderConfig.type,
        duration: finalDuration,
        durationUnit: finalUnit,
        amount: Number(this.localOrderConfig.value),
      };
      
      try {
        await derivTradingService.subscribeProposal(proposalConfig);
        // Os dados chegarão via SSE no evento 'proposal'
      } catch (error) {
        console.error('[OperationChart] Erro ao inscrever-se em proposta:', error);
      }
      
      // Circuit Breaker: Limitar tentativas de re-subscription para evitar loops infinitos
      this.proposalTimeout = setTimeout(() => {
        // Limpar o timeout primeiro
        this.proposalTimeout = null;
        
        // Verificar se ainda precisamos de uma proposta
        if (!this.currentProposalId && this.isAuthorized && derivTradingService.isConnected && !this.activeContract) {
          this.proposalRetryCount++;
          
          if (this.proposalRetryCount <= this.maxProposalRetries) {
            console.warn(`[OperationChart] Proposta não recebida após 3 segundos, tentando novamente (tentativa ${this.proposalRetryCount}/${this.maxProposalRetries})...`);
            this.proceedWithProposal();
          } else {
            console.error('[OperationChart] Máximo de tentativas de proposta atingido. Parando para evitar loop infinito.');
            this.tradeError = 'Não foi possível obter proposta da Deriv após várias tentativas. Verifique sua conexão ou tente outro ativo.';
            // Resetar contador após 10 segundos para permitir novas tentativas
            setTimeout(() => {
              this.proposalRetryCount = 0;
              console.log('[OperationChart] Contador de tentativas resetado, pode tentar novamente');
            }, 10000);
          }
        } else {
          // Resetar contador se conseguimos obter proposta ou não precisamos mais
          this.proposalRetryCount = 0;
        }
      }, 3000);
    },
    unsubscribeFromProposal() {
      // Limpar timeout pendente
      if (this.proposalTimeout) {
        clearTimeout(this.proposalTimeout);
        this.proposalTimeout = null;
      }
      
      // Cancelar subscription (backend gerencia automaticamente)
      if (this.proposalSubscriptionId) {
        console.log('[OperationChart] Unsubscribing from proposal:', this.proposalSubscriptionId);
        // TODO: Implementar endpoint de cancelamento no backend se necessário
        this.proposalSubscriptionId = null;
      }
      
      // Limpar dados da proposta
      this.currentProposalId = null;
      this.currentProposalPrice = null;
    },
    subscribeToContract(contractId) {
      if (!derivTradingService.isConnected) {
        console.error('[OperationChart] WebSocket não está pronto para subscrever contrato');
        return;
      }
      
      console.log('[OperationChart] Subscribing to contract:', contractId);
      // TODO: Implementar endpoint de subscription de contrato no backend
      // Os dados chegarão via SSE automaticamente quando o contrato for criado
    },
    unsubscribeFromContract() {
      if (this.contractSubscriptionId && derivTradingService.isConnected) {
        console.log('[OperationChart] Unsubscribing from contract:', this.contractSubscriptionId);
        // TODO: Implementar endpoint de cancelamento no backend
        this.contractSubscriptionId = null;
      }
    },
    processProposalOpenContract(msg) {
      console.log('[OperationChart] ========== CONTRATO ATUALIZADO ==========');
      console.log('[OperationChart] Mensagem completa:', JSON.stringify(msg, null, 2));
      
      const contract = msg.proposal_open_contract;
      if (!contract) {
        console.warn('[OperationChart] Contrato não encontrado na mensagem');
        return;
      }
      
      // Armazenar subscription ID se fornecido
      if (msg.subscription?.id) {
        this.contractSubscriptionId = msg.subscription.id;
      }
      
      // Atualizar P&L em tempo real
      if (contract.profit !== undefined && contract.profit !== null) {
        this.realTimeProfit = Number(contract.profit);
        console.log('[OperationChart] P&L atualizado:', this.realTimeProfit);
        
        // Atualizar marcador no gráfico com P&L imediatamente
        if (this.lineSeries && this.entryMarker) {
          const profitText = this.realTimeProfit >= 0 
            ? `+${this.displayCurrency} ${this.realTimeProfit.toFixed(2)}`
            : `${this.displayCurrency} ${this.realTimeProfit.toFixed(2)}`;
          const markerColor = this.realTimeProfit >= 0 ? '#10b981' : '#ef4444';
          const markerTimeToUse = this.entryMarker.originalTime || this.entryMarker.time;
          
          // Verificar se o tempo do marcador é válido (não mais antigo que o último tick)
          // Se for muito antigo, não tentar atualizar o ponto na série principal
          const lastTickTime = this.ticks.length > 0 ? Math.floor(Number(this.ticks[this.ticks.length - 1].epoch)) : null;
          const canUpdatePoint = lastTickTime && markerTimeToUse >= lastTickTime;
          
          if (canUpdatePoint) {
            // Garantir que o ponto na série principal esteja acima da linha de entrada
            // Calcular um valor que fique acima da linha de entrada (0.5% acima)
            const offsetPercent = 0.005; // 0.5%
            const markerValueAboveLine = this.entryMarker.spot * (1 + offsetPercent);
            
            // Atualizar o ponto na série principal para manter o marcador acima da linha
            try {
              this.lineSeries.update({
                time: markerTimeToUse,
                value: markerValueAboveLine
              });
            } catch (error) {
              // Se falhar ao atualizar, apenas atualizar o marcador
              console.warn('[OperationChart] Não foi possível atualizar ponto na série:', error);
            }
          }
          
          this.lineSeries.setMarkers([
            {
              time: markerTimeToUse,
              position: 'aboveBar',
              color: markerColor,
              shape: 'circle',
              size: 4,
              text: profitText,
            }
          ]);
          console.log('[OperationChart] Marcador atualizado com P&L:', profitText);
        }
        
        // Atualizar linha de entrada também
        if (this.updateEntrySpotLine) {
          this.updateEntrySpotLine();
        }
      }
      
      // Atualizar status de venda antecipada
      this.isSellEnabled = contract.is_valid_to_sell === 1;
      
      // Atualizar dados do contrato ativo
      if (this.activeContract) {
        // Atualizar entry_spot se fornecido no proposal_open_contract
        if (contract.entry_spot !== undefined && contract.entry_spot !== null) {
          const newEntrySpot = Number(contract.entry_spot);
          if (newEntrySpot !== this.activeContract.entry_spot) {
            this.activeContract.entry_spot = newEntrySpot;
            // Atualizar linha de entrada se necessário
            if (this.entryTime) {
              this.addEntrySpotLine(newEntrySpot, this.entryTime);
            }
          }
        }
        
        this.activeContract.current_profit = this.realTimeProfit;
        this.activeContract.is_valid_to_sell = this.isSellEnabled;
        this.activeContract.sell_price = contract.sell_price ? Number(contract.sell_price) : null;
        this.activeContract.current_spot = contract.current_spot ? Number(contract.current_spot) : null;
      }
      
      // Verificar se o contrato foi vendido ou expirou
      if (contract.is_sold === 1) {
        console.log('[OperationChart] Contrato finalizado (vendido ou expirado)');
        // Aguardar um pouco para garantir que o P&L final está atualizado
        setTimeout(() => {
          this.finalizeContract(contract);
        }, 100);
      }
    },
    processSell(msg) {
      console.log('[OperationChart] ========== VENDA CONFIRMADA ==========');
      console.log('[OperationChart] Mensagem completa:', JSON.stringify(msg, null, 2));
      
      const sell = msg.sell;
      if (!sell) {
        console.error('[OperationChart] ERRO: Venda não confirmada');
        this.tradeError = 'A Deriv não confirmou a venda.';
        this.isTrading = false;
        return;
      }
      
      console.log('[OperationChart] ✓ Venda executada com sucesso!');
      console.log('[OperationChart] Dados da venda:', {
        contractId: sell.contract_id,
        sellPrice: sell.sell_price,
        profit: sell.profit,
        balanceAfter: sell.balance_after,
        buyPrice: this.activeContract?.buy_price,
        realTimeProfit: this.realTimeProfit
      });
      
      // Calcular lucro - usar profit da resposta, senão calcular pela diferença
      let profitValue = 0;
      if (sell.profit !== undefined && sell.profit !== null) {
        profitValue = Number(sell.profit);
      } else if (this.realTimeProfit !== null && this.realTimeProfit !== undefined) {
        profitValue = Number(this.realTimeProfit);
      } else if (sell.sell_price && this.activeContract?.buy_price) {
        profitValue = Number(sell.sell_price) - Number(this.activeContract.buy_price);
      }
      
      console.log('[OperationChart] Lucro calculado na venda:', {
        sellProfit: sell.profit,
        realTimeProfit: this.realTimeProfit,
        calculatedProfit: profitValue,
        sellPrice: sell.sell_price,
        buyPrice: this.activeContract?.buy_price
      });
      
      this.tradeMessage = `Venda executada. Lucro: ${this.displayCurrency} ${profitValue.toFixed(2)}`;
      this.isTrading = false;
      
      // Finalizar contrato
      if (this.activeContract) {
        this.finalizeContract({
          ...sell,
          profit: profitValue, // Garantir que o profit está correto
          is_sold: 1,
        });
      }
    },
    finalizeContract(contract) {
      console.log('[OperationChart] ========== FINALIZANDO CONTRATO ==========');
      
      // Cancelar subscription do contrato
      this.unsubscribeFromContract();
      
      // Remover linha de entrada do gráfico
      this.removeEntrySpotLine();
      
      // Calcular resultado final - usar o profit do contrato se disponível, senão usar o realTimeProfit
      let finalProfit = 0;
      if (contract.profit !== undefined && contract.profit !== null) {
        finalProfit = Number(contract.profit);
      } else if (this.realTimeProfit !== null && this.realTimeProfit !== undefined) {
        finalProfit = Number(this.realTimeProfit);
      } else if (contract.sell_price !== undefined && contract.sell_price !== null && this.activeContract?.buy_price) {
        // Calcular lucro baseado na diferença entre preço de venda e compra
        finalProfit = Number(contract.sell_price) - Number(this.activeContract.buy_price);
      }
      
      console.log('[OperationChart] Lucro final calculado:', {
        contractProfit: contract.profit,
        realTimeProfit: this.realTimeProfit,
        calculatedProfit: finalProfit,
        sellPrice: contract.sell_price,
        buyPrice: this.activeContract?.buy_price
      });
      
      // Armazenar dados para o modal
      this.finalTradeProfit = finalProfit;
      this.finalTradeType = this.activeContract?.type || 'CALL';
      this.finalTradeBuyPrice = this.activeContract?.buy_price || 0;
      this.finalTradeSellPrice = contract.sell_price ? Number(contract.sell_price) : null;
      this.finalTradeBalanceAfter = contract.balance_after ? Number(contract.balance_after) : null;
      
      // Emitir evento para atualizar histórico
      this.$emit('trade-result', {
        contractId: this.activeContract?.contract_id,
        buyPrice: this.activeContract?.buy_price,
        sellPrice: contract.sell_price ? Number(contract.sell_price) : null,
        profit: finalProfit,
        balanceAfter: contract.balance_after ? Number(contract.balance_after) : null,
        currency: this.activeContract?.currency || this.displayCurrency,
        direction: this.activeContract?.type,
        status: 'CLOSED',
      });
      
      // Limpar estado do contrato ativo
      this.activeContract = null;
      this.realTimeProfit = null;
      this.purchasePrice = null;
      this.isSellEnabled = false;
      // Parar countdown
      this.stopCountdown();
      this.contractExpiryTime = null;
      // Manter isDemoAccount pois é baseado na autorização, não no contrato
      
      // Mostrar modal de resultado
      this.showTradeResultModal = true;
      
      // Reiniciar subscription de proposal após fechar o modal
      // (será feito no método closeTradeResultModal)
      
      console.log('[OperationChart] ========== CONTRATO FINALIZADO ==========');
    },
    closeTradeResultModal() {
      this.showTradeResultModal = false;
      // Reiniciar subscription de proposal após fechar o modal
      // Mas apenas se não houver contrato ativo e não estiver trading
      setTimeout(() => {
        if (!this.activeContract && !this.isTrading && this.isAuthorized) {
          this.subscribeToProposal();
        }
      }, 500);
    },
    debugButtonState() {
      console.log('[OperationChart] 🔍 Estado do botão de compra:', {
        isTrading: this.isTrading,
        isAuthorized: this.isAuthorized,
        canUseCallPut: this.canUseCallPut,
        currentProposalId: this.currentProposalId,
        currentProposalPrice: this.currentProposalPrice,
        activeContract: this.activeContract,
        symbol: this.symbol,
        supportsCallPut: this.supportsCallPut(this.symbol),
        contractsData: this.contractsData[this.symbol],
        wsReady: derivTradingService.isConnected,
        buttonDisabled: this.isTrading || !this.isAuthorized || !this.canUseCallPut
      });
    },
    handleBuyClick(event) {
      console.log('[OperationChart] 🖱️ CLIQUE NO BOTÃO DE COMPRA DETECTADO');
      console.log('[OperationChart] Evento:', event);
      console.log('[OperationChart] Estado do botão no momento do clique:', {
        isTrading: this.isTrading,
        isAuthorized: this.isAuthorized,
        canUseCallPut: this.canUseCallPut,
        currentProposalId: this.currentProposalId,
        currentProposalPrice: this.currentProposalPrice,
        activeContract: this.activeContract,
        buttonDisabled: this.isTrading || !this.isAuthorized || !this.canUseCallPut
      });
      
      // Verificar se o botão está realmente desabilitado
      const button = event.currentTarget || event.target;
      if (button && button.disabled) {
        console.warn('[OperationChart] ⚠️ Botão está desabilitado no DOM!');
        console.warn('[OperationChart] Razões possíveis:', {
          isTrading: this.isTrading,
          isAuthorized: this.isAuthorized,
          canUseCallPut: this.canUseCallPut
        });
        return;
      }
      
      // Chamar executeBuy se o botão não estiver desabilitado
      this.executeBuy();
    },
    async executeBuy() {
      console.log('[OperationChart] ========== EXECUTAR COMPRA CHAMADO ==========');
      console.log('[OperationChart] Estado atual:', {
        isAuthorized: this.isAuthorized,
        currentProposalId: this.currentProposalId,
        currentProposalPrice: this.currentProposalPrice,
        isTrading: this.isTrading,
        canUseCallPut: this.canUseCallPut,
        activeContract: this.activeContract,
        wsReady: this.ws ? this.ws.readyState === WebSocket.OPEN : false
      });
      
      if (!this.isAuthorized) {
        console.error('[OperationChart] ERRO: Não autorizado');
        this.tradeError = 'Conecte-se à Deriv antes de operar.';
        return;
      }
      
      if (!this.currentProposalId) {
        console.error('[OperationChart] ERRO: Proposta não disponível', {
          currentProposalId: this.currentProposalId,
          currentProposalPrice: this.currentProposalPrice
        });
        this.tradeError = 'Aguarde a proposta ser carregada.';
        return;
      }
      
      if (this.isTrading) {
        console.warn('[OperationChart] Operação já em andamento');
        return;
      }
      
      // Usar o preço da proposta se disponível, senão usar o valor configurado
      const priceToUse = this.currentProposalPrice || this.localOrderConfig.amount || 10;
      
      // Capturar o preço de compra no momento do envio da requisição
      if (this.latestTick && this.latestTick.value) {
        this.purchasePrice = this.latestTick.value;
      } else {
        // Fallback: usar o preço da proposta ou valor configurado
        this.purchasePrice = priceToUse;
      }
      
      this.tradeError = '';
      this.tradeMessage = '';
      this.isTrading = true;
      this.pendingTradeType = this.localOrderConfig.type;
      
      console.log('[OperationChart] ========== EXECUTAR COMPRA ==========');
      console.log('[OperationChart] ProposalId:', this.currentProposalId);
      console.log('[OperationChart] Price (original):', this.currentProposalPrice);
      console.log('[OperationChart] Price (usado):', priceToUse);
      console.log('[OperationChart] Preço de compra capturado:', this.purchasePrice);
      
      try {
        await derivTradingService.buyContract(this.currentProposalId, priceToUse);
        console.log('[OperationChart] ✅ Compra executada via backend');
        // A resposta chegará via SSE no evento 'buy'
      } catch (error) {
        console.error('[OperationChart] Erro ao executar compra:', error);
        this.tradeError = error.message || 'Erro ao executar compra';
        this.isTrading = false;
      }
    },
    async executeSell() {
      if (!this.activeContract || !this.isSellEnabled) {
        this.tradeError = 'Venda não disponível no momento.';
        return;
      }
      
      if (this.isTrading) {
        return;
      }
      
      this.tradeError = '';
      this.tradeMessage = '';
      this.isTrading = true;
      
      const sellPrice = this.activeContract.sell_price || this.currentProposalPrice || 0;
      
      console.log('[OperationChart] ========== EXECUTANDO VENDA ==========');
      console.log('[OperationChart] ContractId:', this.activeContract.contract_id);
      console.log('[OperationChart] Price:', sellPrice);
      
      try {
        await derivTradingService.sellContract(this.activeContract.contract_id, sellPrice);
        console.log('[OperationChart] ✅ Venda executada via backend');
        // A resposta chegará via SSE no evento 'sell'
      } catch (error) {
        console.error('[OperationChart] Erro ao executar venda:', error);
        this.tradeError = error.message || 'Erro ao executar venda';
        this.isTrading = false;
      }
    },
    addEntrySpotLine(entrySpot, entryTime) {
      if (!this.chart || !entrySpot) {
        console.warn('[OperationChart] Não é possível adicionar linha de entrada: chart ou entrySpot não disponível');
        return;
      }
      
      try {
        // Remover linha anterior se existir
        this.removeEntrySpotLine();
        
        const entryColor = '#94a3b8'; // Cinza para linha de referência
        const entryTimeUnix = Math.floor(Number(entryTime));
        
        console.log('[OperationChart] Adicionando linha de entrada:', {
          entrySpot,
          entryTime: entryTimeUnix,
          entryTimeDate: new Date(entryTimeUnix * 1000).toISOString(),
          ticksCount: this.ticks.length
        });
        
        // Encontrar o tick mais próximo ao momento da compra
        let closestTick = null;
        let closestTickTime = null;
        if (this.ticks.length > 0) {
          let minDiff = Infinity;
          for (const tick of this.ticks) {
            const tickTime = Math.floor(Number(tick.epoch));
            const diff = Math.abs(tickTime - entryTimeUnix);
            if (diff < minDiff) {
              minDiff = diff;
              closestTick = tick;
              closestTickTime = tickTime;
            }
          }
          console.log('[OperationChart] Tick mais próximo encontrado:', {
            tickTime: closestTickTime,
            tickValue: closestTick?.value,
            diff: Math.abs(closestTickTime - entryTimeUnix),
            entryTime: entryTimeUnix
          });
        }
        
        // Usar o tempo do tick mais próximo (se estiver dentro de 60 segundos) ou o tempo de entrada
        // Se a diferença for muito grande, usar o tempo de entrada diretamente
        const timeDiff = closestTickTime ? Math.abs(closestTickTime - entryTimeUnix) : Infinity;
        const markerTime = (closestTickTime && timeDiff < 60) ? closestTickTime : entryTimeUnix;
        const markerValue = (closestTick && timeDiff < 60) ? closestTick.value : entrySpot;
        
        console.log('[OperationChart] Tempo do marcador determinado:', {
          markerTime,
          markerValue,
          entryTimeUnix,
          closestTickTime,
          timeDiff,
          usingClosestTick: timeDiff < 60
        });
        
        // Criar linha horizontal no gráfico
        const lineSeries = this.chart.addLineSeries({
          color: entryColor,
          lineWidth: 2, // Espessura adequada para linha pontilhada
          lineStyle: 2, // Linha pontilhada (dashed)
          axisLabelVisible: true,
          title: `Preço de Compra: ${entrySpot.toFixed(this.pricePrecision)}`,
          priceLineVisible: true,
          lastValueVisible: true,
        });
        
        // Obter o primeiro e último tick para criar uma linha que ocupe 100% da largura
        const firstTick = this.ticks[0];
        const lastTick = this.ticks[this.ticks.length - 1];
        
        // Usar o primeiro tick disponível como ponto inicial (ou tempo de entrada se não houver ticks)
        const lineStartTime = firstTick ? Math.floor(Number(firstTick.epoch)) : entryTimeUnix;
        
        // Usar o último tick disponível como ponto final (ou tempo atual se não houver ticks)
        const lineEndTime = lastTick ? Math.floor(Number(lastTick.epoch)) : entryTimeUnix;
        
        // Criar dois pontos: um no início do gráfico e outro no final
        // Isso cria uma linha horizontal pontilhada que ocupa 100% da largura
        lineSeries.setData([
          { time: lineStartTime, value: entrySpot },
          { time: lineEndTime, value: entrySpot }
        ]);
        this.entrySpotLine = lineSeries;
        
        if (lastTick) {
          
          // Adicionar marcador visual no ponto de entrada na série principal
          // O marcador precisa estar em um ponto onde há dados na série
          // Vamos usar o tick mais próximo ou o último tick disponível
          const markerTimeForSeries = closestTickTime || (this.ticks.length > 0 ? Math.floor(Number(this.ticks[this.ticks.length - 1].epoch)) : markerTime);
          const markerValueForSeries = closestTick?.value || (this.ticks.length > 0 ? this.ticks[this.ticks.length - 1].value : markerValue);
          
          if (this.lineSeries) {
            const markerColor = this.localOrderConfig.type === 'CALL' ? '#3b82f6' : '#ef4444';
            
            // Calcular um valor para o marcador que fique acima da linha de entrada
            // Adicionar um offset de 0.5% do valor de entrada para garantir que o marcador apareça acima
              const offsetPercent = 0.005; // 0.5%
              const markerValueAboveLine = entrySpot * (1 + offsetPercent);
              
            // Adicionar um ponto temporário na série principal no momento da entrada
            // com um valor ligeiramente maior que entrySpot para que o marcador apareça acima da linha
              this.lineSeries.update({
                time: markerTimeForSeries,
                value: markerValueAboveLine
              });
            
            // Adicionar marcador no momento exato da compra
            // Usar 'aboveBar' para posicionar acima do ponto
            const entryMarker = {
              time: markerTimeForSeries,
              position: 'aboveBar',
              color: markerColor,
              shape: 'circle',
              size: 4, // Tamanho maior para melhor visibilidade
              text: `ENTRADA ${this.localOrderConfig.type}`,
            };
            
            // Adicionar o marcador (setMarkers substitui todos os marcadores existentes)
            this.lineSeries.setMarkers([entryMarker]);
            
            // Forçar atualização imediata
            this.$nextTick(() => {
              // Re-adicionar o marcador para garantir que seja exibido
              this.lineSeries.setMarkers([entryMarker]);
            });
            this.entryMarker = { time: markerTimeForSeries, spot: entrySpot, value: markerValueAboveLine, originalTime: markerTime };
            
            console.log('[OperationChart] Marcador adicionado na série principal:', {
              markerTime: markerTimeForSeries,
              originalTime: markerTime,
              value: markerValueForSeries,
              spot: entrySpot,
              color: markerColor,
              usingClosestTick: !!closestTickTime
            });
            
            // Não ajustar zoom automaticamente - deixar o usuário controlar
          } else {
            console.warn('[OperationChart] lineSeries não está disponível para adicionar marcador');
            // Armazenar informações do marcador para adicionar depois
            this.entryMarker = { time: markerTimeForSeries, spot: entrySpot, value: markerValueForSeries, originalTime: markerTime };
            
            // Tentar novamente após um delay
            setTimeout(() => {
              if (this.lineSeries && this.entryMarker) {
                const markerColor = this.localOrderConfig.type === 'CALL' ? '#3b82f6' : '#ef4444';
                this.lineSeries.setMarkers([
                  {
                    time: this.entryMarker.time,
                    position: 'inBar',
                    color: markerColor,
                    shape: 'circle',
                    size: 3,
                    text: `Entrada ${this.localOrderConfig.type}`,
                  }
                ]);
                console.log('[OperationChart] Marcador adicionado após retry');
              }
            }, 500);
          }
          
          // Não ajustar zoom automaticamente - deixar o usuário controlar
          
          console.log('[OperationChart] Linha de entrada e marcador adicionados:', { 
            entrySpot, 
            entryTime: entryTimeUnix,
            markerTime: markerTime,
            markerValue: markerValue
          });
          
          // Atualizar a linha quando novos ticks chegarem
          this.updateEntrySpotLine = () => {
            if (this.entrySpotLine && this.ticks.length > 0 && this.entryTime) {
              // Obter o primeiro e último tick para manter a linha ocupando 100% da largura
              const firstTick = this.ticks[0];
              const latestTick = this.ticks[this.ticks.length - 1];
              
              const lineStartTime = firstTick ? Math.floor(Number(firstTick.epoch)) : Math.floor(Number(this.entryTime));
              const lineEndTime = latestTick ? Math.floor(Number(latestTick.epoch)) : Math.floor(Number(this.entryTime));
              
              // Atualizar a linha para se estender desde o primeiro tick até o último tick
              // Isso mantém a linha ocupando 100% da largura do gráfico
              this.entrySpotLine.setData([
                { time: lineStartTime, value: entrySpot },
                { time: lineEndTime, value: entrySpot }
              ]);
              
              // Atualizar marcador com P&L se disponível
              if (this.lineSeries && this.entryMarker) {
                const profitText = this.realTimeProfit !== null
                  ? (this.realTimeProfit >= 0 
                      ? `+${this.displayCurrency} ${this.realTimeProfit.toFixed(2)}`
                      : `${this.displayCurrency} ${this.realTimeProfit.toFixed(2)}`)
                  : `ENTRADA ${this.localOrderConfig.type}`;
                
                const markerColor = this.realTimeProfit !== null
                  ? (this.realTimeProfit >= 0 ? '#10b981' : '#ef4444')
                  : (this.localOrderConfig.type === 'CALL' ? '#3b82f6' : '#ef4444');
                
                // Usar o tempo original do marcador (não o tempo do tick mais próximo)
                const markerTimeToUse = this.entryMarker.originalTime || this.entryMarker.time;
                
                // Verificar se o tempo do marcador é válido (não mais antigo que o último tick)
                // Se for muito antigo, não tentar atualizar o ponto na série principal
                  const lastTickTime = this.ticks.length > 0 ? Math.floor(Number(this.ticks[this.ticks.length - 1].epoch)) : null;
                  const canUpdatePoint = lastTickTime && markerTimeToUse >= lastTickTime;
                  
                  if (canUpdatePoint) {
                  // Garantir que o ponto na série principal esteja acima da linha de entrada
                  // Calcular um valor que fique acima da linha de entrada (0.5% acima)
                    const offsetPercent = 0.005; // 0.5%
                    const markerValueAboveLine = this.entryMarker.spot * (1 + offsetPercent);
                    
                  // Atualizar o ponto na série principal para manter o marcador acima da linha
                    try {
                      this.lineSeries.update({
                        time: markerTimeToUse,
                        value: markerValueAboveLine
                      });
                    } catch (error) {
                    // Se falhar ao atualizar, apenas atualizar o marcador
                      console.warn('[OperationChart] Não foi possível atualizar ponto na série:', error);
                  }
                }
                
                this.lineSeries.setMarkers([
                  {
                    time: markerTimeToUse,
                    position: 'aboveBar',
                    color: markerColor,
                    shape: 'circle',
                    size: 4, // Tamanho maior
                    text: profitText,
                  }
                ]);
              }
            }
          };
          
          // Mesmo sem ticks, garantir que a função de atualização esteja definida
          // para quando os ticks chegarem
          if (!this.updateEntrySpotLine) {
            this.updateEntrySpotLine = () => {
              if (this.entrySpotLine && this.ticks.length > 0 && this.entryTime) {
                // Obter o primeiro e último tick para manter a linha ocupando 100% da largura
                const firstTick = this.ticks[0];
                const latestTick = this.ticks[this.ticks.length - 1];
                
                const lineStartTime = firstTick ? Math.floor(Number(firstTick.epoch)) : Math.floor(Number(this.entryTime));
                const lineEndTime = latestTick ? Math.floor(Number(latestTick.epoch)) : Math.floor(Number(this.entryTime));
                
                this.entrySpotLine.setData([
                  { time: lineStartTime, value: entrySpot },
                  { time: lineEndTime, value: entrySpot }
                ]);
              }
            };
          }
        } else {
          console.warn('[OperationChart] Nenhum tick disponível no momento, mas linha de entrada criada');
          // Mesmo sem ticks, definir a função de atualização para quando os ticks chegarem
          this.updateEntrySpotLine = () => {
            if (this.entrySpotLine && this.ticks.length > 0 && this.entryTime) {
              // Obter o primeiro e último tick para manter a linha ocupando 100% da largura
              const firstTick = this.ticks[0];
              const latestTick = this.ticks[this.ticks.length - 1];
              
              const lineStartTime = firstTick ? Math.floor(Number(firstTick.epoch)) : Math.floor(Number(this.entryTime));
              const lineEndTime = latestTick ? Math.floor(Number(latestTick.epoch)) : Math.floor(Number(this.entryTime));
              
              this.entrySpotLine.setData([
                { time: lineStartTime, value: entrySpot },
                { time: lineEndTime, value: entrySpot }
              ]);
            }
          };
        }
      } catch (error) {
        console.error('[OperationChart] Erro ao adicionar linha de entrada:', error);
        console.error('[OperationChart] Stack trace:', error.stack);
      }
    },
    removeEntrySpotLine() {
      if (this.entrySpotLine && this.chart) {
        try {
          this.chart.removeSeries(this.entrySpotLine);
          this.entrySpotLine = null;
          this.updateEntrySpotLine = null;
          this.entryMarker = null;
          this.entryTime = null;
          
          // Remover marcadores da série principal
          if (this.lineSeries) {
            this.lineSeries.setMarkers([]);
          }
          
          console.log('[OperationChart] Linha de entrada e marcador removidos');
        } catch (error) {
          console.warn('[OperationChart] Erro ao remover linha de entrada:', error);
        }
      }
    },
    executeTrade(action) {
      console.log('[OperationChart] ========== EXECUTAR OPERAÇÃO ==========');
      console.log('[OperationChart] Action:', action);
      console.log('[OperationChart] Estado atual:', {
        isAuthorized: this.isAuthorized,
        isTrading: this.isTrading,
        accountLoginid: this.accountLoginid,
        preferredCurrency: this.preferredCurrency,
        accountCurrency: this.accountCurrency,
        connectionCurrency: this.connectionCurrency
      });
      
      if (!this.isAuthorized) {
        console.error('[OperationChart] ERRO: Não autorizado');
        this.tradeError = 'Conecte-se à Deriv antes de operar.';
        return;
      }
      if (this.isTrading) {
        console.warn('[OperationChart] Operação já em andamento, ignorando');
        return;
      }

      const tradeType = action === 'EXECUTE' ? (this.localOrderConfig.type === 'CALL' ? 'BUY' : 'SELL') : action;
      this.pendingTradeType = tradeType === 'BUY' ? 'CALL' : 'PUT';
      this.tradeError = '';
      this.tradeMessage = '';
      this.isTrading = true;

      const contractType = tradeType === 'BUY' ? 'CALL' : 'PUT';
      const duration = Math.max(1, Number(this.localOrderConfig.duration));
      const displayCurrency = this.displayCurrency;
      
      console.log('[OperationChart] Configuração da ordem:', {
        contractType,
        tradeType,
        duration,
        durationUnit: this.localOrderConfig.durationUnit,
        amount: Number(this.localOrderConfig.value),
        symbol: this.symbol,
        currency: displayCurrency
      });
      
      console.log('[OperationChart] 🔑 INFORMAÇÕES DE CONTA:');
      console.log('[OperationChart] - Moeda preferida do usuário:', this.preferredCurrency);
      console.log('[OperationChart] - Moeda da conta:', this.accountCurrency);
      console.log('[OperationChart] - Moeda da conexão:', this.connectionCurrency);
      console.log('[OperationChart] - Moeda que será usada (displayCurrency):', displayCurrency);
      console.log('[OperationChart] - LoginID da conta:', this.accountLoginid);
      console.log('[OperationChart] - Token usado (preview):', this.token ? `${this.token.substring(0, 10)}...` : 'null');
      
      const payload = {
        proposal: 1,
        amount: Number(this.localOrderConfig.value),
        basis: 'stake',
        contract_type: contractType,
        currency: displayCurrency,
        duration,
        duration_unit: this.localOrderConfig.durationUnit,
        symbol: this.symbol,
      };
      
      console.log('[OperationChart] Payload da requisição proposal:', JSON.stringify(payload, null, 2));
      
      // Método antigo - substituído por proceedWithProposal() que usa REST
      console.warn('[OperationChart] Método antigo chamado - use proceedWithProposal()');
      this.proceedWithProposal();
    },
    processProposal(msg) {
      console.log('[OperationChart] ========== PROPOSTA RECEBIDA ==========');
      console.log('[OperationChart] Mensagem completa:', JSON.stringify(msg, null, 2));
      
      const proposal = msg.proposal;
      if (!proposal) {
        console.error('[OperationChart] ERRO: Proposta inválida');
        this.tradeError = 'Proposta inválida retornada pela Deriv.';
        this.currentProposalId = null;
        this.currentProposalPrice = null;
        return;
      }
      
      // Verificar se há erro na proposta
      if (proposal.error || msg.error) {
        const error = proposal.error || msg.error;
        console.error('[OperationChart] ERRO na proposta:', error);
        this.tradeError = error.message || 'Erro ao obter proposta';
        this.currentProposalId = null;
        this.currentProposalPrice = null;
        return;
      }
      
      console.log('[OperationChart] Dados da proposta:', {
        id: proposal.id,
        askPrice: proposal.askPrice || proposal.ask_price,
        payout: proposal.payout,
        spot: proposal.spot,
        dateStart: proposal.dateStart || proposal.date_start
      });
      
      // Armazenar ID e preço da proposta para exibição e compra
      // O backend envia askPrice (camelCase), mas pode vir ask_price (snake_case) também
      this.currentProposalId = proposal.id;
      this.currentProposalPrice = Number(proposal.askPrice || proposal.ask_price || 0);
      
      // Limpar timeout de retry já que recebemos a proposta
      if (this.proposalTimeout) {
        clearTimeout(this.proposalTimeout);
        this.proposalTimeout = null;
      }
      
      // Resetar contadores de erro já que a proposta foi recebida com sucesso
      this.durationErrorCount = 0;
      this.proposalRetryCount = 0;
      
      // Limpar qualquer erro anterior
      this.tradeError = '';
      
      // Armazenar subscription ID se fornecido
      if (msg.subscription?.id) {
        this.proposalSubscriptionId = msg.subscription.id;
        console.log('[OperationChart] Proposal subscription ID:', this.proposalSubscriptionId);
      }
      
      console.log('[OperationChart] ✓ Proposta processada com sucesso:', {
        proposalId: this.currentProposalId,
        proposalPrice: this.currentProposalPrice,
        subscriptionId: this.proposalSubscriptionId
      });
      
      // Verificar estado do botão após receber proposta
      this.$nextTick(() => {
        console.log('[OperationChart] Estado após receber proposta:', {
          canExecuteBuy: !this.isTrading && this.isAuthorized && this.canUseCallPut && !!this.currentProposalId,
          isTrading: this.isTrading,
          isAuthorized: this.isAuthorized,
          canUseCallPut: this.canUseCallPut,
          currentProposalId: this.currentProposalId,
          activeContract: this.activeContract
        });
      });
    },
    processBuy(msg) {
      console.log('[OperationChart] ========== COMPRA CONFIRMADA ==========');
      console.log('[OperationChart] Mensagem completa:', JSON.stringify(msg, null, 2));
      
      const buy = msg.buy;
      if (!buy) {
        console.error('[OperationChart] ERRO: Compra não confirmada');
        this.tradeError = 'A Deriv não confirmou a compra.';
        this.isTrading = false;
        return;
      }

      console.log('[OperationChart] ✓ Compra executada com sucesso!');
      console.log('[OperationChart] Dados da compra:', {
        contractId: buy.contract_id,
        buyPrice: buy.buy_price,
        balanceAfter: buy.balance_after,
        purchaseTime: buy.purchase_time,
        entrySpot: buy.entry_spot,
        longcode: buy.longcode
      });
      
      // Cancelar subscription de proposal
      this.unsubscribeFromProposal();
      
      // Obter entry_spot da resposta buy ou usar o spot atual
      const entrySpot = Number(buy.entry_spot || buy.spot || this.latestTick?.value || 0);
      
      // Atualizar o preço de compra com o entry_spot confirmado pela Deriv
      this.purchasePrice = entrySpot;
      
      // Calcular tempo de expiração baseado na duração do contrato
      const purchaseTime = buy.purchase_time || Math.floor(Date.now() / 1000);
      let expiryTime = purchaseTime;
      
      // Calcular expiry baseado na duração configurada
      const duration = this.localOrderConfig.duration;
      const durationUnit = this.localOrderConfig.durationUnit;
      
      switch (durationUnit) {
        case 't': // ticks - aproximadamente 2 segundos por tick
          expiryTime = purchaseTime + (duration * 2);
          break;
        case 's': // segundos
          expiryTime = purchaseTime + duration;
          break;
        case 'm': // minutos
          expiryTime = purchaseTime + (duration * 60);
          break;
        case 'h': // horas
          expiryTime = purchaseTime + (duration * 3600);
          break;
        case 'd': // dias
          expiryTime = purchaseTime + (duration * 86400);
          break;
        default:
          expiryTime = purchaseTime + 60; // fallback: 1 minuto
      }
      
      // Criar objeto de contrato ativo
      this.activeContract = {
        contract_id: buy.contract_id,
        symbol: this.symbol,
        type: this.localOrderConfig.type,
        entry_spot: entrySpot,
        purchase_time: purchaseTime,
        buy_price: Number(buy.buy_price),
        currency: this.displayCurrency,
        expiry_time: expiryTime,
        duration: duration,
        duration_unit: durationUnit
      };
      
      // Armazenar tempo de entrada
      this.entryTime = purchaseTime;
      
      // Iniciar countdown
      this.contractExpiryTime = expiryTime;
      this.startCountdown();
      
      console.log('[OperationChart] Preparando para adicionar marcador visual:', {
        entrySpot: this.activeContract.entry_spot,
        entryTime: this.entryTime,
        purchaseTime: buy.purchase_time,
        latestTick: this.latestTick,
        ticksCount: this.ticks.length,
      });
      
      // Aguardar um pouco para garantir que o gráfico está atualizado
      this.$nextTick(() => {
        // Adicionar linha de entrada e marcador no gráfico
        setTimeout(() => {
          this.addEntrySpotLine(this.activeContract.entry_spot, this.entryTime);
        }, 100);
      });
      
      // Iniciar monitoramento do contrato
      this.subscribeToContract(buy.contract_id);
      
      this.tradeMessage = 'Compra executada com sucesso. Monitorando contrato...';
      this.tradeError = '';
      this.isTrading = false;
      
      // Emitir evento para atualizar saldo
      const resultPayload = {
        contractId: buy.contract_id,
        longcode: buy.longcode,
        buyPrice: Number(buy.buy_price),
        balanceAfter: buy.balance_after != null ? Number(buy.balance_after) : null,
        purchaseTime: buy.purchase_time,
        currency: this.displayCurrency,
        direction: this.localOrderConfig.type,
        status: 'EXECUTED',
      };
      
      console.log('[OperationChart] Emitindo evento trade-result:', resultPayload);
      this.$emit('trade-result', resultPayload);
      console.log('[OperationChart] ========== COMPRA FINALIZADA, INICIANDO MONITORAMENTO ==========');
    },
    // Método send() removido - agora usa derivTradingService
    // Todas as operações são feitas via REST/SSE
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
    async fetchAiRecommendation() {
      if (!this.isAuthorized || this.ticks.length < 10) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const last10Ticks = this.ticks.slice(-10);
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        const response = await fetch(`${apiBaseUrl}/gemini/recommendation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ticks: last10Ticks
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar recomendação');
        }

        const recommendation = await response.json();
        this.aiRecommendation = recommendation;

        // Mostrar o card por 10 segundos
        this.showAiCard = true;
        this.playAiCardSound();

        // Limpar timeout anterior se existir
        if (this.aiCardTimeout) {
          clearTimeout(this.aiCardTimeout);
        }

        // Esconder o card após 10 segundos
        this.aiCardTimeout = setTimeout(() => {
          this.showAiCard = false;
        }, 10000);

        console.log('[OperationChart] Recomendação da IA recebida:', recommendation);
      } catch (error) {
        console.error('[OperationChart] Erro ao buscar recomendação da IA:', error);
      }
    },
    startAiRecommendationCycle() {
      // Limpar intervalo anterior se existir
      if (this.aiRecommendationInterval) {
        clearInterval(this.aiRecommendationInterval);
      }

      // Buscar recomendação imediatamente se tiver pelo menos 10 ticks
      if (this.ticks.length >= 10) {
        this.fetchAiRecommendation();
      }

      // Buscar recomendação a cada 40 segundos (40000ms)
      this.aiRecommendationInterval = setInterval(() => {
        if (this.ticks.length >= 10) {
          this.fetchAiRecommendation();
        }
      }, 40000); // 40 segundos
    },
    startAiCardCycle() {
      // Este método não é mais usado, mas mantido para compatibilidade
      // A lógica agora está no startAiRecommendationCycle
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
    // Monitorar condições do botão de compra
    currentProposalId(newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('[OperationChart] currentProposalId mudou:', { oldVal, newVal });
        this.debugButtonState();
      }
    },
    symbol(newVal, oldVal) {
      if (newVal !== oldVal) {
        const result = this.supportsCallPut(newVal);
        if (this.lastCanUseCallPut !== result) {
          console.log('[OperationChart] canUseCallPut mudou (via symbol):', {
            symbol: newVal,
            canUseCallPut: result,
            contractsData: this.contractsData[newVal]
          });
          this.lastCanUseCallPut = result;
          this.debugButtonState();
        }
      }
    },
    'contractsData': {
      handler() {
        const result = this.supportsCallPut(this.symbol);
        if (this.lastCanUseCallPut !== result) {
          console.log('[OperationChart] canUseCallPut mudou (via contractsData):', {
            symbol: this.symbol,
            canUseCallPut: result,
            contractsData: this.contractsData[this.symbol]
          });
          this.lastCanUseCallPut = result;
          this.debugButtonState();
        }
      },
      deep: true
    },
    isAuthorized(newVal) {
      if (newVal && this.ticks.length >= 10) {
        // Iniciar ciclo de recomendações quando autorizado e tiver ticks suficientes
        this.startAiRecommendationCycle();
      }
    },
    ticks: {
      handler(newTicks) {
        // Remover atualização automática do gráfico - será feita manualmente no processTick
        // Apenas verificar se precisa iniciar ciclo de IA
        if (newTicks.length >= 10 && this.isAuthorized && !this.aiRecommendationInterval) {
          this.startAiRecommendationCycle();
        }
      },
      deep: false
    },
    // Reiniciar conexão quando o loginid ou moeda preferida mudarem
    // para garantir que estamos usando o token correto
    accountLoginid(newVal, oldVal) {
      // Ignorar se for a primeira inicialização (oldVal é null/undefined)
      if (!oldVal && !newVal) return;
      if (oldVal === newVal) return;
      
      console.log('[OperationChart] ⚠ accountLoginid mudou:', {
        antigo: oldVal,
        novo: newVal,
        currentLoginid: this.currentLoginid,
        isAuthorized: this.isAuthorized,
        wsState: derivTradingService.isConnected ? 'connected' : 'disconnected'
      });
      
      // Se a conexão já está ativa e autorizada, verificar se precisa realmente reconectar
      if (this.isAuthorized && derivTradingService.isConnected) {
        // Se o currentLoginid já corresponde ao novo valor, não reconectar
        if (this.currentLoginid === newVal) {
          console.log('[OperationChart] ✅ Já está conectado e autorizado com este loginid, cancelando reconexão desnecessária');
          return;
        }
        
        // Se oldVal era null (primeira vez recebendo o loginid após conexão já estabelecida)
        // E a conexão primária já está funcionando, não reconectar
        // Apenas atualizar a referência para que futuras mudanças sejam detectadas
        if (!oldVal && this.currentLoginid) {
          console.log('[OperationChart] ⚠ Primeira vez recebendo loginid (' + newVal + '), mas conexão primária já está funcionando com (' + this.currentLoginid + ')');
          console.log('[OperationChart] ✅ Cancelando reconexão - mantendo conexão primária ativa');
          // Apenas atualizar referência sem reconectar
          this.currentLoginid = newVal;
          return;
        }
      }
      
      // Se não está autorizado ou a conexão não está aberta, apenas atualizar referência
      // A inicialização normal vai acontecer
      if (!this.isAuthorized || !derivTradingService.isConnected) {
        console.log('[OperationChart] Conexão não está ativa, apenas atualizando referência. Inicialização normal acontecerá');
        this.currentLoginid = newVal;
        return;
      }
      
      // Evitar múltiplas reconexões simultâneas
      if (this.isReconnecting) {
        console.log('[OperationChart] Já está reconectando, ignorando nova mudança');
        return;
      }
      
      // Só reconectar se realmente necessário (loginid mudou de um valor para outro diferente)
      // E ambos oldVal e newVal são valores válidos (não null)
      if (oldVal && newVal && oldVal !== newVal && this.currentLoginid !== newVal) {
        console.log('[OperationChart] Loginid realmente mudou (' + oldVal + ' -> ' + newVal + '), iniciando reconexão');
        this.isReconnecting = true;
        this.currentLoginid = newVal;
        
        // Aguardar um pouco para evitar race condition
        this.$nextTick(() => {
          if (derivTradingService.isConnected) {
            console.log('[OperationChart] Reiniciando conexão devido à mudança de loginid');
            this.teardownConnection();
            setTimeout(() => {
              this.initConnection();
              this.isReconnecting = false;
            }, 500);
          } else {
            this.isReconnecting = false;
          }
        });
      } else {
        // Apenas atualizar referência sem reconectar
        this.currentLoginid = newVal;
        console.log('[OperationChart] Apenas atualizando referência do loginid, sem reconectar');
      }
    },
    preferredCurrency(newVal, oldVal) {
      // Ignorar se for a primeira inicialização ou se não mudou realmente
      if (!oldVal && !newVal) return;
      if (oldVal === newVal) return;
      
      // Verificar se a moeda final (após conversão) realmente mudou
      const oldFinalCurrency = oldVal?.toUpperCase() === 'DEMO' ? 'USD' : (oldVal?.toUpperCase() || 'USD');
      const newFinalCurrency = newVal?.toUpperCase() === 'DEMO' ? 'USD' : (newVal?.toUpperCase() || 'USD');
      
      if (oldFinalCurrency === newFinalCurrency) {
        console.log('[OperationChart] Moeda final não mudou (DEMO -> USD), ignorando mudança');
        return;
      }
      
      console.log('[OperationChart] ⚠ preferredCurrency mudou:', {
        antigo: oldVal,
        novo: newVal,
        oldFinal: oldFinalCurrency,
        newFinal: newFinalCurrency
      });
      
      // Se já está conectado e autorizado, verificar se realmente precisa reconectar
      if (this.isAuthorized && derivTradingService.isConnected) {
        // Se a moeda da conexão atual já corresponde à nova moeda final, não reconectar
        if (this.connectionCurrency === newFinalCurrency) {
          console.log('[OperationChart] ✅ Conexão já está usando a moeda correta (' + this.connectionCurrency + '), cancelando reconexão desnecessária');
          return;
        }
      }
      
      // Se não está autorizado ou a conexão não está aberta, deixar inicialização normal acontecer
      if (!this.isAuthorized || !derivTradingService.isConnected) {
        return; // Deixar a inicialização normal acontecer
      }
      
      // Evitar múltiplas reconexões simultâneas
      if (this.isReconnecting) {
        console.log('[OperationChart] Já está reconectando, ignorando nova mudança de moeda');
        return;
      }
      
      // Só reconectar se realmente necessário
      this.isReconnecting = true;
      
      // Aguardar um pouco para evitar race condition
      this.$nextTick(() => {
        if (derivTradingService.isConnected) {
          console.log('[OperationChart] Reiniciando conexão devido à mudança de moeda preferida');
          this.teardownConnection();
          setTimeout(() => {
            this.initConnection();
            this.isReconnecting = false;
          }, 500);
        } else {
          this.isReconnecting = false;
        }
      });
    },
    'localOrderConfig.duration'(newVal, oldVal) {
      if (newVal !== oldVal && !this.activeContract && this.isAuthorized) {
        this.subscribeToProposal();
      }
    },
    'localOrderConfig.value'(newVal, oldVal) {
      if (newVal !== oldVal && !this.activeContract && this.isAuthorized) {
        this.subscribeToProposal();
      }
    },
    },
    mounted() {
      console.log('[OperationChart] ========== COMPONENTE MONTADO ==========');
      console.log('[OperationChart] Props recebidas no mount:', {
        accountBalance: this.accountBalance,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginid: this.accountLoginid,
        orderConfig: this.orderConfig
      });
      
      if (this.orderConfig && this.orderConfig.value !== undefined) {
        this.localOrderConfig.value = Number(this.orderConfig.value);
        console.log('[OperationChart] Valor da ordem configurado:', this.localOrderConfig.value);
      }
      
      console.log('[OperationChart] Inicializando gráfico...');
      this.initChart();
      
      // Aguardar um ciclo para garantir que as props foram processadas
      // O getTokenForAccount vai ler o snapshot diretamente se a prop não estiver disponível
      this.$nextTick(() => {
        console.log('[OperationChart] Inicializando conexão WebSocket...');
        this.initConnection();
      });
      
      this.startExpirationTimer();
      this.startAiRecommendationCycle();
      console.log('[OperationChart] Componente totalmente inicializado');
    },
  beforeUnmount() {
    if (this.aiRecommendationInterval) {
      clearInterval(this.aiRecommendationInterval);
    }
    if (this.aiCardTimeout) {
      clearTimeout(this.aiCardTimeout);
    }
    // Limpar countdown
    this.stopCountdown();
    
    console.log('[OperationChart] ========== COMPONENTE SENDO DESMONTADO ==========');
    this.isDestroying = true;
    
    // Limpar timeout de atualização
    if (this.chartUpdateTimer) {
      clearTimeout(this.chartUpdateTimer);
      this.chartUpdateTimer = null;
    }
    
    // Destruir gráfico TradingView
    if (this.chart) {
      try {
        this.chart.remove();
      } catch (error) {
        // Ignorar erros
      }
      this.chart = null;
      this.chartSeries = null;
      this.chartReady = false;
    }
    
    // Remover listener de resize
    window.removeEventListener('resize', this.handleResize);
    
    // Limpar retry se existir
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    
    // Limpar timeout de proposta se existir
    if (this.proposalTimeout) {
      clearTimeout(this.proposalTimeout);
      this.proposalTimeout = null;
    }
    
    // Cancelar subscriptions
    this.unsubscribeFromProposal();
    this.unsubscribeFromContract();
    
    // Remover linha de entrada
    this.removeEntrySpotLine();
    
    this.teardownConnection();
    if (this.chart) {
      // Remover listener de resize
      if (this._resizeHandler) {
        window.removeEventListener('resize', this._resizeHandler);
        this._resizeHandler = null;
      }
      // Limpar timer de atualização
      if (this.chartUpdateTimer) {
        clearTimeout(this.chartUpdateTimer);
        this.chartUpdateTimer = null;
      }
      
      // Destruir gráfico TradingView
      if (this.chart) {
        try {
          this.chart.remove();
        } catch (error) {
          // Ignorar erros ao destruir
        }
      }
      
      this.chart = null;
      this.chartSeries = null;
      this.chartReady = false;
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

.connection-loading-card {
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  text-align: center;
  color: #fff;
}

.loading-indicator-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 6px solid rgba(255, 255, 255, 0.1);
  border-top-color: #06d6a0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message {
  font-size: 18px;
  font-weight: 500;
  color: #f8fafc;
  margin: 0;
}

.retry-info {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .connection-loading-card {
    padding: 48px 24px;
    min-height: 300px;
  }

  .spinner-large {
    width: 48px;
    height: 48px;
    border-width: 5px;
  }

  .loading-message {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .connection-loading-card {
    padding: 32px 16px;
    min-height: 250px;
  }

  .spinner-large {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }

  .loading-message {
    font-size: 14px;
  }

  .retry-info {
    font-size: 12px;
  }
}

@media (max-width: 360px) {
  .connection-loading-card {
    padding: 24px 12px;
    min-height: 200px;
  }

  .spinner-large {
    width: 36px;
    height: 36px;
    border-width: 3px;
  }

  .loading-message {
    font-size: 13px;
  }

  .retry-info {
    font-size: 11px;
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

.price-indicators {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.price-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.price-indicator.entry-price {
  color: #6366f1;
}

.price-indicator.entry-price strong {
  color: #818cf8;
}

.chart-box {
  position: relative !important;
  width: 100% !important;
  height: 420px !important;
  min-height: 420px !important;
  background: rgba(15, 23, 42, 0.65) !important;
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
  display: block !important;
}

.line-chart-container {
  width: 100% !important;
  height: 100% !important;
  min-height: 396px !important;
  position: relative !important;
  box-sizing: border-box;
  z-index: 1;
  background: transparent !important;
  display: block !important;
  flex: none !important;
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
  z-index: 0;
  pointer-events: none;
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

.proposal-info {
  margin: 16px 0;
  padding: 12px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.proposal-price-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.proposal-price-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #6366f1;
}

.profit-info {
  margin: 16px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid;
}

.profit-info.profit-positive {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.profit-info.profit-negative {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.profit-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.profit-value {
  font-size: 1.2rem;
  font-weight: 700;
}

.profit-info.profit-positive .profit-value {
  color: #10b981;
}

.profit-info.profit-negative .profit-value {
  color: #ef4444;
}

.btn-execute-operation.btn-buy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
}

.btn-execute-operation.btn-buy:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-execute-operation.btn-sell {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
}

.btn-execute-operation.btn-sell:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.card-title-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.demo-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #818cf8;
}

.demo-icon {
  font-size: 0.9rem;
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

/* Countdown Display */
.countdown-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 12px 0;
  padding: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  animation: pulse-countdown 2s ease-in-out infinite;
}

.countdown-label {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.countdown-value {
  font-size: 24px;
  font-weight: 700;
  color: #6366F1;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

@keyframes pulse-countdown {
  0%, 100% {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  }
}

/* Estilos para selects conforme HTML fornecido */
#marketSelectSidebar optgroup,
#tradeTypeSelect optgroup {
  background-color: #0F0F0F;
  color: #22C55E;
  font-weight: 600;
  font-size: 11px;
  padding: 8px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

#marketSelectSidebar option,
#tradeTypeSelect option {
  background-color: #0B0B0B;
  color: #DFDFDF;
  font-weight: 500;
  font-size: 13px;
  padding: 10px 12px;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
}

#marketSelectSidebar option:hover,
#tradeTypeSelect option:hover {
  background-color: #111111;
  border-left-color: #22C55E;
  color: #22C55E;
}

/* Animação progressBar */
@keyframes progressBar {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Layout atualizado */
.operation-layout {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.chart-container {
  height: 100%;
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

#candlestickChart {
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #0B0B0B;
  overflow: hidden;
}

#candlestickChart > * {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
}

.chart-wrapper {
  background-color: #0B0B0B !important;
  min-height: 400px !important;
  position: relative !important;
  overflow: visible !important;
  width: 100% !important;
  height: 100% !important;
}

.chart-wrapper canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  z-index: 1 !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
  background-color: #0B0B0B !important;
}

#candlestickChart {
  position: relative !important;
  width: 100% !important;
  height: 100% !important;
  background-color: #0B0B0B !important;
  display: block !important;
}

#candlestickChart canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 10 !important;
  background-color: #0B0B0B !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Garantir que o container do gráfico está visível */
.chart-wrapper,
#candlestickChart {
  position: relative !important;
  overflow: visible !important;
  background-color: #0B0B0B !important;
}

.chart-wrapper > div,
#candlestickChart > div {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
}

.col-chart {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  min-height: 0;
}

</style>

