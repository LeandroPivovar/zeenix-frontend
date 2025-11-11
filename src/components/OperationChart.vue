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
      previousDataCount: 0,
      isDestroying: false,
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
      retryCount: 0,
      retryTimeout: null,
      maxRetries: Infinity, // Tentar infinitamente
      retryDelay: 3000, // 3 segundos inicial
    };
  },
  computed: {
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
      console.log('[OperationChart] displayCurrency - Calculando moeda a ser usada');
      console.log('[OperationChart] Valores disponíveis:', {
        preferredCurrency: this.preferredCurrency,
        accountCurrency: this.accountCurrency,
        connectionCurrency: this.connectionCurrency
      });
      
      let currency = this.preferredCurrency || this.accountCurrency || this.connectionCurrency || 'USD';
      const originalCurrency = currency;
      
      if (currency.toUpperCase() === 'DEMO') {
        console.log('[OperationChart] Moeda preferida é DEMO, convertendo para USD');
        currency = 'USD'; // DEMO não é uma moeda real, usar USD para requisições
      }
      
      const finalCurrency = currency.toUpperCase();
      console.log('[OperationChart] Moeda calculada:', {
        original: originalCurrency,
        final: finalCurrency
      });
      
      return finalCurrency;
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
      console.log('[OperationChart] initChart - Iniciando inicialização do gráfico');
      console.log('[OperationChart] Estado antes de inicializar:', {
        hasChart: !!this.chart,
        hasChartContainer: !!this.$refs.chartContainer,
        chartContainerElement: this.$refs.chartContainer
      });
      
      if (this.chart) {
        console.warn('[OperationChart] Gráfico já existe, não inicializando novamente');
        return;
      }
      
      if (!this.$refs.chartContainer) {
        console.error('[OperationChart] ERRO: chartContainer não está disponível no DOM');
        return;
      }

      // Aguardar o próximo tick para garantir que o DOM está totalmente renderizado
      this.$nextTick(() => {
        const container = this.$refs.chartContainer;
        if (!container) {
          console.error('[OperationChart] ERRO: chartContainer não está disponível após nextTick');
          return;
        }

        // Forçar recálculo das dimensões
        const containerRect = container.getBoundingClientRect();
        const containerHeight = containerRect.height || container.clientHeight || 400;
        const containerWidth = containerRect.width || container.clientWidth || 800;
        
        console.log('[OperationChart] Criando gráfico no container...');
        console.log('[OperationChart] Dimensões do container:', {
          width: containerWidth,
          height: containerHeight,
          clientWidth: container.clientWidth,
          clientHeight: container.clientHeight,
          boundingRect: {
            width: containerRect.width,
            height: containerRect.height
          }
        });
        
        // Garantir que o container tem dimensões válidas
        if (containerWidth <= 0 || containerHeight <= 0) {
          console.warn('[OperationChart] Container tem dimensões inválidas, aguardando...');
          setTimeout(() => this.initChart(), 100);
          return;
        }
        
        try {
          this.chart = createChart(container, {
            width: containerWidth,
            height: containerHeight,
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

          console.log('[OperationChart] ✓ Gráfico e lineSeries criados com sucesso');
          console.log('[OperationChart] Estado após inicialização:', {
            hasChart: !!this.chart,
            hasLineSeries: !!this.lineSeries,
            ticksCount: this.ticks.length,
            containerVisible: container.offsetParent !== null,
            containerDimensions: {
              width: containerWidth,
              height: containerHeight,
              offsetWidth: container.offsetWidth,
              offsetHeight: container.offsetHeight
            }
          });
          
          // Se já temos ticks, atualizar o gráfico imediatamente
          if (this.ticks.length > 0) {
            console.log('[OperationChart] Já temos ticks, atualizando gráfico imediatamente...');
            // Aguardar um pouco mais para garantir que o gráfico está totalmente inicializado
            setTimeout(() => {
              this.updateChartFromTicks();
            }, 100);
          }

          this.chartInitialized = true;
          window.addEventListener('resize', this.handleResize);
          
          // Aguardar um pouco antes de redimensionar para garantir que está renderizado
          setTimeout(() => {
            this.handleResize();
            // Forçar uma atualização visual do gráfico
            if (this.chart && this.lineSeries && this.ticks.length > 0) {
              this.$nextTick(() => {
                this.updateChartFromTicks();
              });
            }
          }, 100);
        } catch (error) {
          console.error('[OperationChart] ERRO ao criar gráfico:', error);
          console.error('[OperationChart] Stack trace:', error.stack);
        }
      });
    },
    handleResize() {
      if (!this.chart || !this.$refs.chartContainer) return;
      const container = this.$refs.chartContainer;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width || container.clientWidth;
      const containerHeight = containerRect.height || container.clientHeight;
      
      if (containerWidth > 0 && containerHeight > 0) {
        this.chart.applyOptions({ 
          width: containerWidth,
          height: containerHeight
        });
        console.log('[OperationChart] Gráfico redimensionado:', {
          width: containerWidth,
          height: containerHeight
        });
      }
    },
    initConnection() {
      console.log('[OperationChart] initConnection - Iniciando conexão WebSocket');
      console.log('[OperationChart] Props recebidas:', {
        accountLoginid: this.accountLoginid,
        preferredCurrency: this.preferredCurrency,
        accountCurrency: this.accountCurrency
      });
      
      // Limpar retry anterior se existir
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }
      
      if (this.ws) {
        console.log('[OperationChart] Fechando conexão WebSocket existente');
        this.teardownConnection();
      }

      // Limpar dados do gráfico para reinicializar
      this.ticks = [];
      this.latestTick = null;
      this.isLoadingSymbol = true;
      this.previousDataCount = 0; // Resetar contador ao reiniciar conexão
      
      // Garantir que o gráfico existe antes de limpar
      if (this.chart && this.$refs.chartContainer) {
        console.log('[OperationChart] Limpando dados do gráfico para reinicialização');
        // Não destruir o gráfico, apenas limpar os dados
        // O gráfico será atualizado quando novos dados chegarem
      } else if (!this.chart && this.$refs.chartContainer) {
        console.log('[OperationChart] Gráfico não existe, inicializando...');
        this.initChart();
      }

      this.connectionError = '';
      this.isConnecting = true;
      
      // Determinar qual token usar baseado na moeda preferida e loginid
      this.token = this.getTokenForAccount();
      this.appId = localStorage.getItem('deriv_app_id') || APP_ID;

      console.log('[OperationChart] Token selecionado:', {
        hasToken: !!this.token,
        tokenLength: this.token ? this.token.length : 0,
        tokenPreview: this.token ? `${this.token.substring(0, 10)}...` : 'null',
        appId: this.appId
      });

      if (!this.token) {
        console.error('[OperationChart] ERRO: Nenhum token Deriv encontrado');
        this.connectionError = 'Nenhum token Deriv encontrado. Aguardando reconexão...';
        this.isConnecting = false;
        // Não fazer retry se não houver token - aguardar que o usuário reconecte via OAuth
        // Mas ainda assim tentar novamente após um delay maior
        this.scheduleRetry();
        return;
      }

      const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
      console.log('[OperationChart] Conectando ao endpoint:', endpoint);
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        console.log('[OperationChart] WebSocket aberto, enviando autorização');
        console.log('[OperationChart] Autorizando com token para loginid:', this.accountLoginid);
        // Pequeno delay para garantir que o WebSocket está totalmente pronto
        setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.send({ authorize: this.token });
          } else {
            console.warn('[OperationChart] WebSocket não está mais aberto ao tentar autorizar');
            this.connectionError = 'Erro ao autorizar conexão. Reconectando automaticamente...';
            this.scheduleRetry();
          }
        }, 50);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('[OperationChart] 📥 Mensagem recebida da Deriv:', {
            msg_type: msg.msg_type,
            hasError: !!msg.error,
            fullMessage: JSON.stringify(msg, null, 2)
          });
          this.handleMessage(msg);
        } catch (error) {
          console.error('[OperationChart] ERRO ao interpretar mensagem da Deriv:', error);
          console.error('[OperationChart] Dados recebidos (raw):', event.data);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[OperationChart] ========== ERRO NO WEBSOCKET ==========');
        console.error('[OperationChart] Erro:', error);
        console.error('[OperationChart] Contexto:', {
          accountLoginid: this.accountLoginid,
          preferredCurrency: this.preferredCurrency,
          tokenPreview: this.token ? `${this.token.substring(0, 10)}...` : 'null'
        });
        this.connectionError = 'Erro na conexão com a Deriv. Reconectando automaticamente...';
        this.isConnecting = false;
        this.isAuthorized = false;
        this.scheduleRetry();
      };

      this.ws.onclose = (event) => {
        console.log('[OperationChart] ========== WEBSOCKET FECHADO ==========');
        console.log('[OperationChart] Detalhes do fechamento:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          isConnecting: this.isConnecting
        });
        if (!this.isConnecting) {
          console.warn('[OperationChart] Conexão encerrada inesperadamente');
          this.connectionError = 'Conexão com a Deriv encerrada. Reconectando automaticamente...';
          this.scheduleRetry();
        }
        this.isConnecting = false;
        this.isAuthorized = false;
        this.ws = null;
      };
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
          console.log('[OperationChart] ✓ Autorização recebida da Deriv');
          console.log('[OperationChart] Dados de autorização:', {
            loginid: msg.authorize?.loginid,
            currency: msg.authorize?.currency,
            email: msg.authorize?.email,
            fullname: msg.authorize?.fullname
          });
          this.isAuthorized = true;
          this.isConnecting = false;
          this.connectionError = ''; // Limpar erro ao conectar com sucesso
          this.retryCount = 0; // Resetar contador de tentativas
          this.connectionCurrency = msg.authorize?.currency?.toUpperCase() || this.accountCurrency;
          console.log('[OperationChart] Moeda da conexão:', this.connectionCurrency);
          console.log('[OperationChart] Moeda preferida configurada:', this.preferredCurrency);
          console.log('[OperationChart] Moeda da conta:', this.accountCurrency);
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
      console.error('[OperationChart] ========== ERRO DA DERIV ==========');
      console.error('[OperationChart] Erro completo:', JSON.stringify(error, null, 2));
      console.error('[OperationChart] Contexto:', {
        isTrading: this.isTrading,
        isAuthorized: this.isAuthorized,
        accountLoginid: this.accountLoginid,
        preferredCurrency: this.preferredCurrency,
        tokenPreview: this.token ? `${this.token.substring(0, 10)}...` : 'null'
      });
      
      const message = error?.message || 'Erro desconhecido na Deriv';
      if (this.isTrading) {
        console.error('[OperationChart] Erro durante operação de compra/venda');
        this.tradeError = message;
        this.tradeMessage = '';
        this.isTrading = false;
      } else {
        console.error('[OperationChart] Erro de conexão');
        this.connectionError = `${message}. Reconectando automaticamente...`;
        this.isAuthorized = false;
        this.scheduleRetry();
      }
    },
    subscribeToSymbol() {
      console.log('[OperationChart] subscribeToSymbol - Inscrevendo-se no símbolo');
      console.log('[OperationChart] Estado do WebSocket:', {
        exists: !!this.ws,
        readyState: this.ws ? this.ws.readyState : 'null'
      });
      
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.warn('[OperationChart] WebSocket não está pronto, não é possível inscrever');
        return;
      }

      this.isLoadingSymbol = true;
      this.ticks = [];
      this.latestTick = null;
      this.tradeError = '';
      this.tradeMessage = '';

      if (this.tickSubscriptionId) {
        console.log('[OperationChart] Cancelando inscrição anterior:', this.tickSubscriptionId);
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
      
      console.log('[OperationChart] Inscrevendo-se no símbolo:', this.symbol);
      console.log('[OperationChart] Payload de inscrição:', JSON.stringify(payload, null, 2));
      this.send(payload);
    },
    processHistory(msg) {
      console.log('[OperationChart] processHistory - Processando histórico de ticks');
      const history = msg.history;
      if (!history || !history.prices) {
        console.warn('[OperationChart] Histórico inválido ou sem preços:', msg);
        return;
      }
      
      const prices = history.prices.map(price => Number(price));
      const times = history.times?.map(time => Number(time)) || [];
      this.ticks = prices.map((value, index) => ({ value, epoch: times[index] || index }));
      
      console.log('[OperationChart] Histórico processado:', {
        ticksCount: this.ticks.length,
        firstTick: this.ticks[0],
        lastTick: this.ticks[this.ticks.length - 1]
      });
      
      if (msg.subscription?.id) {
        this.tickSubscriptionId = msg.subscription.id;
        console.log('[OperationChart] Subscription ID do histórico:', this.tickSubscriptionId);
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
      if (!tick) {
        console.warn('[OperationChart] processTick - Tick inválido:', msg);
        return;
      }
      
      console.log('[OperationChart] processTick - Processando novo tick:', {
        quote: tick.quote,
        epoch: tick.epoch,
        symbol: tick.symbol,
        ticksCount: this.ticks.length
      });
      
      if (tick.id && !this.tickSubscriptionId) {
        this.tickSubscriptionId = tick.id;
        console.log('[OperationChart] Subscription ID definido:', this.tickSubscriptionId);
      }
      
      const value = Number(tick.quote);
      if (isNaN(value)) {
        console.error('[OperationChart] ERRO: Valor do tick não é um número:', tick.quote);
        return;
      }
      
      this.latestTick = { value, epoch: tick.epoch };
      this.lastUpdate = Date.now();
      this.ticks.push({ value, epoch: tick.epoch });
      
      if (this.ticks.length > 1000) {
        this.ticks.shift();
      }
      
      console.log('[OperationChart] Tick adicionado. Total de ticks:', this.ticks.length);
      this.updateChartFromTicks();
    },
    updateChartFromTicks() {
      // Não atualizar se o componente está sendo destruído
      if (this.isDestroying) {
        console.warn('[OperationChart] Componente está sendo destruído, ignorando atualização');
        return;
      }
      
      console.log('[OperationChart] updateChartFromTicks - Iniciando atualização do gráfico');
      console.log('[OperationChart] Estado atual:', {
        ticksCount: this.ticks.length,
        hasChart: !!this.chart,
        hasLineSeries: !!this.lineSeries,
        hasChartContainer: !!this.$refs.chartContainer,
        chartInitialized: this.chartInitialized,
        isAuthorized: this.isAuthorized,
        connectionError: this.connectionError,
        isConnecting: this.isConnecting,
        isDestroying: this.isDestroying
      });
      
      if (!this.ticks.length) {
        console.warn('[OperationChart] Nenhum tick disponível para plotar');
        this.chartInitialized = false;
        return;
      }
      
      // Garantir que o chartContainer está disponível
      if (!this.$refs.chartContainer) {
        console.warn('[OperationChart] chartContainer não está disponível no DOM');
        // Tentar novamente no próximo tick
        return;
      }
      
      if (!this.chart) {
        console.log('[OperationChart] Gráfico não existe, inicializando...');
        this.initChart();
        // Aguardar um pouco para garantir que o gráfico foi criado
        this.$nextTick(() => {
          if (!this.lineSeries) {
            console.error('[OperationChart] ERRO: lineSeries não está definido após initChart');
            return;
          }
          // Continuar com a atualização após o gráfico ser criado
          this.updateChartFromTicks();
        });
        return;
      }
      
      if (!this.lineSeries) {
        console.error('[OperationChart] ERRO: lineSeries não está definido após initChart');
        return;
      }

      // Lightweight Charts espera time como Unix timestamp (segundos desde 1970)
      // A Deriv retorna epoch em segundos, então podemos usar diretamente
      // Mas precisamos garantir que seja um número inteiro (não float)
      const data = this.ticks.map(tick => {
        // Garantir que epoch seja um número válido
        const epoch = Math.floor(Number(tick.epoch));
        const value = Number(tick.value);
        
        if (isNaN(epoch) || isNaN(value) || epoch <= 0) {
          console.warn('[OperationChart] Tick inválido ignorado:', tick);
          return null;
        }
        
        return { time: epoch, value: value };
      }).filter(item => item !== null);
      
      // Ordenar por tempo para garantir ordem correta
      data.sort((a, b) => a.time - b.time);
      
      console.log('[OperationChart] Atualizando gráfico com', data.length, 'pontos de dados');
      console.log('[OperationChart] Primeiros 3 pontos (detalhado):', JSON.stringify(data.slice(0, 3), null, 2));
      console.log('[OperationChart] Últimos 3 pontos (detalhado):', JSON.stringify(data.slice(-3), null, 2));
      
      if (data.length === 0) {
        console.warn('[OperationChart] Nenhum dado válido para plotar');
        return;
      }
      
      try {
        // Verificar se é um novo tick incremental (apenas 1 ponto a mais que o anterior)
        const previousDataCount = this.previousDataCount || 0;
        const isIncrementalUpdate = data.length === previousDataCount + 1 && previousDataCount > 0;
        
        if (isIncrementalUpdate) {
          // Apenas adicionar o novo ponto usando update
          const lastPoint = data[data.length - 1];
          console.log('[OperationChart] Atualizando gráfico com novo ponto incremental:', lastPoint);
          this.lineSeries.update(lastPoint);
          // Scroll para o tempo real
          this.chart.timeScale().scrollToRealTime();
        } else {
          // Primeira vez ou muitos dados novos, usar setData completo
          console.log('[OperationChart] Chamando lineSeries.setData com', data.length, 'pontos...');
          this.lineSeries.setData(data);
          console.log('[OperationChart] setData chamado com sucesso');
          
          // Aguardar um pouco antes de ajustar a escala para garantir que os dados foram renderizados
          setTimeout(() => {
            console.log('[OperationChart] Ajustando escala de tempo...');
            try {
              if (this.chart && this.chart.timeScale) {
                this.chart.timeScale().fitContent();
                console.log('[OperationChart] Escala ajustada');
                
                // Forçar uma atualização visual do gráfico
                setTimeout(() => {
                  try {
                    this.chart.timeScale().scrollToPosition(-1, false);
                    // Forçar redraw do gráfico
                    this.handleResize();
                  } catch (scrollError) {
                    console.warn('[OperationChart] Erro ao fazer scroll:', scrollError);
                  }
                }, 50);
              }
            } catch (scaleError) {
              console.warn('[OperationChart] Erro ao ajustar escala:', scaleError);
            }
          }, 100);
        }
        
        // Armazenar contagem de dados para próxima verificação
        this.previousDataCount = data.length;
        
        this.chartInitialized = true;
        console.log('[OperationChart] ✓ Gráfico atualizado com sucesso');
      } catch (error) {
        console.error('[OperationChart] ERRO ao atualizar gráfico:', error);
        console.error('[OperationChart] Stack trace:', error.stack);
        console.error('[OperationChart] Dados que causaram o erro:', {
          dataLength: data.length,
          firstItem: data[0],
          lastItem: data[data.length - 1],
          chartInitialized: this.chartInitialized,
          ticksLength: this.ticks.length
        });
      }
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
    getTokenForAccount() {
      console.log('[OperationChart] getTokenForAccount - Buscando token para conta');
      console.log('[OperationChart] Parâmetros:', {
        accountLoginid: this.accountLoginid,
        preferredCurrency: this.preferredCurrency,
        accountCurrency: this.accountCurrency
      });
      
      // Se temos um loginid específico, tentar buscar o token correspondente
      if (this.accountLoginid) {
        try {
          const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
          console.log('[OperationChart] Tokens armazenados (raw):', tokensByLoginIdStr);
          const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
          console.log('[OperationChart] Tokens parseados:', tokensByLoginId);
          console.log('[OperationChart] Loginids disponíveis:', Object.keys(tokensByLoginId));
          
          const specificToken = tokensByLoginId[this.accountLoginid];
          if (specificToken) {
            console.log('[OperationChart] ✓ Token específico encontrado para loginid:', this.accountLoginid);
            console.log('[OperationChart] Token (preview):', `${specificToken.substring(0, 10)}...`);
            return specificToken;
          } else {
            console.warn('[OperationChart] ⚠ Token específico NÃO encontrado para loginid:', this.accountLoginid);
            console.warn('[OperationChart] Loginids disponíveis:', Object.keys(tokensByLoginId));
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
      return defaultToken;
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
      
      this.currentProposal = {
        payload,
      };
      console.log('[OperationChart] Enviando requisição proposal...');
      this.send(payload);
    },
    processProposal(msg) {
      console.log('[OperationChart] ========== PROPOSTA RECEBIDA ==========');
      console.log('[OperationChart] Mensagem completa:', JSON.stringify(msg, null, 2));
      
      const proposal = msg.proposal;
      if (!proposal) {
        console.error('[OperationChart] ERRO: Proposta inválida');
        this.tradeError = 'Proposta inválida retornada pela Deriv.';
        this.isTrading = false;
        return;
      }
      
      console.log('[OperationChart] Dados da proposta:', {
        id: proposal.id,
        askPrice: proposal.ask_price,
        payout: proposal.payout,
        spot: proposal.spot,
        dateStart: proposal.date_start
      });
      
      this.currentProposal.id = proposal.id;
      this.currentProposal.askPrice = Number(proposal.ask_price);
      
      const buyPayload = {
        buy: proposal.id,
        price: Number(proposal.ask_price),
      };
      
      console.log('[OperationChart] 🔑 INFORMAÇÕES ANTES DE COMPRAR:');
      console.log('[OperationChart] - Moeda preferida do usuário:', this.preferredCurrency);
      console.log('[OperationChart] - Moeda da conta:', this.accountCurrency);
      console.log('[OperationChart] - Moeda da conexão:', this.connectionCurrency);
      console.log('[OperationChart] - LoginID da conta:', this.accountLoginid);
      console.log('[OperationChart] - Token usado (preview):', this.token ? `${this.token.substring(0, 10)}...` : 'null');
      console.log('[OperationChart] Payload da requisição buy:', JSON.stringify(buyPayload, null, 2));
      console.log('[OperationChart] Enviando requisição buy...');
      
      this.send(buyPayload);
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
        longcode: buy.longcode
      });
      
      console.log('[OperationChart] 🔑 INFORMAÇÕES DA CONTA USADA:');
      console.log('[OperationChart] - Moeda preferida do usuário:', this.preferredCurrency);
      console.log('[OperationChart] - Moeda da conta:', this.accountCurrency);
      console.log('[OperationChart] - Moeda da conexão:', this.connectionCurrency);
      console.log('[OperationChart] - Moeda usada na operação:', this.displayCurrency);
      console.log('[OperationChart] - LoginID da conta:', this.accountLoginid);
      console.log('[OperationChart] - Token usado (preview):', this.token ? `${this.token.substring(0, 10)}...` : 'null');
      console.log('[OperationChart] - Saldo após compra:', buy.balance_after);
      console.log('[OperationChart] - Preço da compra:', buy.buy_price);
      
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
      
      console.log('[OperationChart] Emitindo evento trade-result:', resultPayload);
      this.$emit('trade-result', resultPayload);
      this.pendingTradeType = null;
      console.log('[OperationChart] ========== OPERAÇÃO FINALIZADA ==========');
    },
    send(payload) {
      console.log('[OperationChart] 📤 Enviando mensagem para Deriv:', JSON.stringify(payload, null, 2));
      console.log('[OperationChart] Estado do WebSocket:', {
        exists: !!this.ws,
        readyState: this.ws ? this.ws.readyState : 'null',
        readyStateText: this.ws ? (this.ws.readyState === WebSocket.OPEN ? 'OPEN' : this.ws.readyState === WebSocket.CONNECTING ? 'CONNECTING' : this.ws.readyState === WebSocket.CLOSING ? 'CLOSING' : 'CLOSED') : 'null'
      });
      
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.error('[OperationChart] ERRO: WebSocket não está pronto');
        this.connectionError = 'Conexão com a Deriv não está pronta.';
        this.isTrading = false;
        return;
      }
      
      const payloadStr = JSON.stringify(payload);
      console.log('[OperationChart] Enviando payload (string):', payloadStr);
      this.ws.send(payloadStr);
      console.log('[OperationChart] ✓ Mensagem enviada com sucesso');
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
    // Reiniciar conexão quando o loginid ou moeda preferida mudarem
    // para garantir que estamos usando o token correto
    accountLoginid(newVal, oldVal) {
      console.log('[OperationChart] ⚠ accountLoginid mudou:', {
        antigo: oldVal,
        novo: newVal
      });
      // Aguardar um pouco para evitar race condition com abertura do WebSocket
      this.$nextTick(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('[OperationChart] Reiniciando conexão devido à mudança de loginid');
          this.teardownConnection();
          // Pequeno delay para garantir que a conexão foi fechada
          setTimeout(() => {
            this.initConnection();
          }, 100);
        } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.log('[OperationChart] WebSocket ainda está conectando, aguardando...');
          // Aguardar que a conexão abra antes de reiniciar
          const checkConnection = () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              console.log('[OperationChart] WebSocket aberto, reiniciando conexão devido à mudança de loginid');
              this.teardownConnection();
              setTimeout(() => {
                this.initConnection();
              }, 100);
            } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
              setTimeout(checkConnection, 100);
            }
          };
          setTimeout(checkConnection, 100);
        }
      });
    },
    preferredCurrency(newVal, oldVal) {
      console.log('[OperationChart] ⚠ preferredCurrency mudou:', {
        antigo: oldVal,
        novo: newVal
      });
      // Aguardar um pouco para evitar race condition com abertura do WebSocket
      this.$nextTick(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('[OperationChart] Reiniciando conexão devido à mudança de moeda preferida');
          this.teardownConnection();
          // Pequeno delay para garantir que a conexão foi fechada
          setTimeout(() => {
            this.initConnection();
          }, 100);
        } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
          console.log('[OperationChart] WebSocket ainda está conectando, aguardando...');
          // Aguardar que a conexão abra antes de reiniciar
          const checkConnection = () => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              console.log('[OperationChart] WebSocket aberto, reiniciando conexão devido à mudança de moeda preferida');
              this.teardownConnection();
              setTimeout(() => {
                this.initConnection();
              }, 100);
            } else if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
              setTimeout(checkConnection, 100);
            }
          };
          setTimeout(checkConnection, 100);
        }
      });
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
      
      console.log('[OperationChart] Inicializando conexão WebSocket...');
      this.initConnection();
      
      this.startExpirationTimer();
      this.startAiCardCycle();
      console.log('[OperationChart] Componente totalmente inicializado');
    },
  beforeUnmount() {
    console.log('[OperationChart] ========== COMPONENTE SENDO DESMONTADO ==========');
    this.isDestroying = true;
    
    // Limpar retry se existir
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    
    this.teardownConnection();
    if (this.chart) {
      window.removeEventListener('resize', this.handleResize);
      try {
        this.chart.remove();
        console.log('[OperationChart] Gráfico removido com sucesso');
      } catch (error) {
        console.warn('[OperationChart] Erro ao remover gráfico:', error);
      }
      this.chart = null;
      this.lineSeries = null;
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

.price-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
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