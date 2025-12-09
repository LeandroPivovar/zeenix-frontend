<template>
  <div class="operation-chart-wrapper">
    <!-- Loading State -->
    <div v-if="showLoading" class="connection-loading-card animated-card" data-anim-index="0">
      <div class="loading-indicator-wrapper">
        <div class="spinner-large"></div>
        <p class="loading-message">Conectando à Deriv...</p>
      </div>
    </div>

    <!-- Main Layout -->
    <div v-else class="operation-layout">
      <!-- Chart Column -->
      <div class="col-chart flex-1 flex flex-col gap-5">
        <!-- Chart Container -->
        <div class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden flex flex-col shadow-[0_0_8px_rgba(0,0,0,0.25)] chart-container w-full chart-card">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] flex-shrink-0">
            <h3 class="text-base font-semibold text-zenix-text">Gráfico</h3>
          </div>

          <div id="tradingviewChart" ref="chartContainer" class="w-full chart-wrapper" style="background-color: #0B0B0B; position: relative; flex: 1; min-height: 0; height: 100%;">
            <!-- Chart will be rendered here -->
          </div>
          <div v-if="showChartPlaceholder" class="chart-placeholder absolute inset-0 flex items-center justify-center" style="z-index: 2; pointer-events: none;">
            <p class="text-zenix-secondary">Carregando histórico de ticks...</p>
          </div>
        </div>
        
        <!-- Signal Area -->
        <div class="border-t-2 bg-gradient-to-b from-[#101010] to-[#0E0E0E] px-6 py-4 rounded-xl shadow-[0_-2px_12px_rgba(34,197,94,0.08)]">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="far fa-signal text-[11px] text-zenix-green"></i>
              <span class="text-xs font-bold text-zenix-text tracking-wide uppercase">Sinal Gerado</span>
            </div>
            <button 
              class="inline-flex items-center gap-2 px-4 py-2 bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold rounded-lg text-xs transition-all duration-300 shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_16px_rgba(34,197,94,0.4)]"
            >
              <i class="far fa-chart-line text-[9px]"></i>
              <span>Iniciar Análise do Gráfico</span>
            </button>
          </div>
          <div id="signalArea" class="min-h-[80px]">
            <!-- Signal content will be inserted here -->
          </div>
        </div>
      </div>

      <!-- Sidebar Panel -->
      <div class="max-w-[420px] w-[420px] flex-shrink-0 bg-zenix-card border border-zenix-border rounded-xl p-5 overflow-y-auto sidebar-panel">
        <div class="pb-3 border-b border-zenix-border mb-5">
          <h3 class="text-base font-semibold text-zenix-text">Painel de Negociação Manual</h3>
        </div>
        
        <div class="space-y-4">
          <!-- Market Select -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-chart-line text-zenix-green mr-2"></i>Mercado
            </label>
            <select 
              id="marketSelectSidebar"
              v-model="symbol"
              @change="handleSymbolChange"
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
            >
              <optgroup label="Índices Sintéticos">
                <option value="R_10">Volatility 10 Index</option>
                <option value="R_25">Volatility 25 Index</option>
                <option value="R_50">Volatility 50 Index</option>
                <option value="R_75">Volatility 75 Index</option>
                <option value="R_100" selected>Volatility 100 Index</option>
                <option value="1HZ10V">Volatility 10 (1s) Index</option>
                <option value="1HZ25V">Volatility 25 (1s) Index</option>
                <option value="1HZ50V">Volatility 50 (1s) Index</option>
                <option value="1HZ75V">Volatility 75 (1s) Index</option>
                <option value="1HZ100V">Volatility 100 (1s) Index</option>
              </optgroup>
              <optgroup label="Criptomoedas">
                <option value="cryBTCUSD">BTC/USD (Bitcoin)</option>
                <option value="cryETHUSD">ETH/USD (Ethereum)</option>
              </optgroup>
              <optgroup label="Forex">
                <option value="frxEURUSD">EUR/USD (Euro / Dólar)</option>
                <option value="frxUSDJPY">USD/JPY (Dólar / Iene)</option>
                <option value="frxGBPUSD">GBP/USD (Libra / Dólar)</option>
                <option value="frxUSDCHF">USD/CHF (Dólar / Franco)</option>
                <option value="frxAUDUSD">AUD/USD (Dólar Australiano)</option>
                <option value="frxUSDCAD">USD/CAD (Dólar / Dólar Canadense)</option>
                <option value="frxNZDUSD">NZD/USD (Dólar Neozelandês)</option>
                <option value="frxEURGBP">EUR/GBP (Euro / Libra)</option>
                <option value="frxEURJPY">EUR/JPY (Euro / Iene)</option>
                <option value="frxGBPJPY">GBP/JPY (Libra / Iene)</option>
                <option value="frxAUDCAD">AUD/CAD (Dólar Australiano / Canadense)</option>
                <option value="frxAUDJPY">AUD/JPY (Dólar Australiano / Iene)</option>
                <option value="frxCHFJPY">CHF/JPY (Franco / Iene)</option>
                <option value="frxEURAUD">EUR/AUD (Euro / Dólar Australiano)</option>
                <option value="frxGBPAUD">GBP/AUD (Libra / Dólar Australiano)</option>
                <option value="frxUSDMXN">USD/MXN (Dólar / Peso Mexicano)</option>
              </optgroup>
              <optgroup label="Metais">
                <option value="frxXAUUSD">XAU/USD (Ouro / Dólar)</option>
                <option value="frxXAGUSD">XAG/USD (Prata / Dólar)</option>
                <option value="frxXPTUSD">XPT/USD (Platina / Dólar)</option>
                <option value="frxXPDUSD">XPD/USD (Paládio / Dólar)</option>
              </optgroup>
            </select>
          </div>
          
          <!-- Trade Type Select -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-exchange-alt text-zenix-green mr-2"></i>Tipo de Negociação
            </label>
            <select 
              id="tradeTypeSelect"
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
            >
              <option value="">Selecione um mercado primeiro</option>
              <option value="CALL" selected>Alta (CALL)</option>
              <option value="PUT">Baixa (PUT)</option>
            </select>
          </div>
          
          <!-- Duration -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-clock text-zenix-green mr-2"></i>Duração
            </label>
            <div class="flex gap-2">
              <select 
                class="flex-1 bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
              >
                <option value="m" selected>Minutos</option>
                <option value="t">Ticks</option>
              </select>
              <input 
                type="number" 
                value="1"
                min="1"
                max="365"
                class="w-20 bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
              />
            </div>
          </div>
          
          <!-- Entry Value -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-dollar-sign text-zenix-green mr-2"></i>Valor de entrada
            </label>
            <input 
              type="number" 
              value="10.00"
              step="0.01" 
              placeholder="Ex: 1.00, 2.50..."
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text placeholder:text-[#DFDFDF40] focus:outline-none focus:border-zenix-green transition-colors"
            />
            <div class="text-xs text-zenix-secondary mt-1">
              Min: USD 0.35 | Max: USD 10000.00
            </div>
          </div>
          
          <!-- Multiplier -->
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
          
          <!-- Purchase Price -->
          <div v-if="showPurchasePrice" class="bg-zenix-bg border border-zenix-border rounded-lg p-3">
            <div class="text-xs text-zenix-secondary mb-1">Preço de Compra:</div>
            <div class="text-base font-semibold text-zenix-text">USD 10.00</div>
          </div>

          <!-- Real-time P&L -->
          <div v-if="showRealTimeProfit" class="bg-zenix-bg border rounded-lg p-3" :class="realTimeProfitClass">
            <div class="text-xs text-zenix-secondary mb-1">P&L em Tempo Real:</div>
            <div class="text-base font-semibold" :class="realTimeProfitTextClass">
              USD +5.50
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 pt-3">
            <button 
              v-if="!showSellButton"
              id="buyButton"
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-arrow-up"></i>
              Executar Ordem
            </button>
            
            <button 
              v-if="showSellButton"
              id="sellButton"
              class="w-full bg-[#FF4747] hover:bg-[#FF6161] text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            >
              <i class="fas fa-arrow-down"></i>
              PUT / SELL
            </button>
          </div>

          <!-- Countdown -->
          <div v-if="showCountdown" class="countdown-display">
            <span class="countdown-label">Tempo restante:</span>
            <span class="countdown-value">0m 39s</span>
          </div>

          <!-- Messages -->
          <p v-if="showSuccessMessage" class="text-sm text-zenix-green">Operação executada com sucesso!</p>
          <p v-if="showErrorMessage" class="text-sm text-red-500">Erro ao executar operação</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';
import derivTradingService from '../services/deriv-trading.service.js';

export default {
  name: 'OperationChart',
  data() {
    return {
      showLoading: false,
      showChartPlaceholder: true,
      showPurchasePrice: false,
      showRealTimeProfit: false,
      showSellButton: false,
      showCountdown: false,
      showSuccessMessage: false,
      showErrorMessage: false,
      realTimeProfitClass: 'border-zenix-green',
      realTimeProfitTextClass: 'text-zenix-green',
      chart: null,
      chartSeries: null,
      symbol: 'R_100',
      isLoadingTicks: false,
      isConnected: false,
      derivToken: null,
      loginid: null,
    };
  },
  async mounted() {
    this.initChart();
    // Listener de resize
    window.addEventListener('resize', this.handleResize);
    
    // Tentar conectar e carregar ticks
    await this.initializeConnection();
  },
  watch: {
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol && this.chart && this.chartSeries) {
        console.log('[Chart] Símbolo alterado via watcher:', { oldSymbol, newSymbol });
        // handleSymbolChange já será chamado pelo @change do select
        // Mas vamos garantir que seja chamado se mudar programaticamente
        if (oldSymbol) {
          this.handleSymbolChange();
        }
      }
    },
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
      this.chartSeries = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initChart() {
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
              timeVisible: true,
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

          // Não carregar placeholders aqui - será carregado do backend
          // Os dados serão carregados via loadTicksFromBackend()

          // Listener de resize
          this.handleResize = () => {
            const newRect = container.getBoundingClientRect();
            if (this.chart && newRect.width > 0 && newRect.height > 0) {
              this.chart.resize(newRect.width, newRect.height);
            }
          };
        } catch (error) {
          console.error('[Chart] Erro ao inicializar gráfico:', error);
        }
      });
    },
    async initializeConnection() {
      try {
        // Buscar token Deriv do localStorage
        // Tentar primeiro deriv_token (token direto)
        this.derivToken = localStorage.getItem('deriv_token');
        
        // Se não tiver, tentar deriv_connection (objeto com mais informações)
        if (!this.derivToken) {
          const derivConnection = localStorage.getItem('deriv_connection');
          if (derivConnection) {
            try {
              const connection = JSON.parse(derivConnection);
              this.derivToken = connection.token;
              this.loginid = connection.loginid;
            } catch (e) {
              console.warn('[Chart] Erro ao parsear deriv_connection:', e);
            }
          }
        }
        
        // Se ainda não tiver, tentar derivInfo
        if (!this.derivToken) {
          const storedDerivInfo = localStorage.getItem('derivInfo');
          if (storedDerivInfo) {
            try {
              const derivInfo = JSON.parse(storedDerivInfo);
              this.derivToken = derivInfo.token;
              this.loginid = derivInfo.loginid;
            } catch (e) {
              console.warn('[Chart] Erro ao parsear derivInfo:', e);
            }
          }
        }

        if (!this.derivToken) {
          console.warn('[Chart] Token Deriv não encontrado no localStorage');
          return;
        }
        
        // Se não tiver loginid, tentar buscar do deriv_connection
        if (!this.loginid) {
          const derivConnection = localStorage.getItem('deriv_connection');
          if (derivConnection) {
            try {
              const connection = JSON.parse(derivConnection);
              this.loginid = connection.loginid;
            } catch (e) {
              // Ignorar erro
            }
          }
        }

        // Conectar ao backend
        await derivTradingService.connect(this.derivToken, this.loginid);
        this.isConnected = true;

        // Iniciar stream SSE
        await derivTradingService.startStream(this.handleSSEMessage.bind(this), this.derivToken);

        // Inscrever-se no símbolo (isso vai buscar histórico)
        await derivTradingService.subscribeSymbol(this.symbol, this.derivToken, this.loginid);

        // Aguardar um pouco e então buscar ticks
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 1500);
      } catch (error) {
        console.error('[Chart] Erro ao inicializar conexão:', error);
      }
    },
    handleSSEMessage(data) {
      // Processar mensagens SSE
      if (data.type === 'history' && data.data && data.data.ticks) {
        console.log('[Chart] Histórico recebido via SSE:', data.data.ticks.length, 'ticks');
        this.plotTicks(data.data.ticks);
      } else if (data.type === 'tick' && data.data) {
        // Ticks em tempo real - podemos adicionar ao gráfico se necessário
        console.log('[Chart] Tick em tempo real recebido:', data.data);
      }
    },
    async loadTicksFromBackend() {
      if (this.isLoadingTicks || !this.chart || !this.chartSeries) {
        return;
      }

      this.isLoadingTicks = true;
      this.showChartPlaceholder = true;

      try {
        console.log('[Chart] Buscando ticks do backend para símbolo:', this.symbol);
        
        const response = await derivTradingService.getTicks(this.symbol);
        
        if (!response || !response.ticks || !Array.isArray(response.ticks)) {
          console.warn('[Chart] Resposta inválida do backend:', response);
          this.showChartPlaceholder = false;
          return;
        }

        const ticks = response.ticks;
        console.log('[Chart] Ticks recebidos:', ticks.length);

        if (ticks.length === 0) {
          console.warn('[Chart] Nenhum tick recebido do backend, tentando novamente em 2 segundos...');
          // Tentar novamente após 2 segundos
          setTimeout(() => {
            this.loadTicksFromBackend();
          }, 2000);
          return;
        }

        // Plotar os ticks
        this.plotTicks(ticks);
      } catch (error) {
        console.error('[Chart] Erro ao carregar ticks do backend:', error);
        this.showChartPlaceholder = false;
      } finally {
        this.isLoadingTicks = false;
      }
    },
    plotTicks(ticks) {
      if (!this.chart || !this.chartSeries || !ticks || !Array.isArray(ticks)) {
        return;
      }

      // Converter ticks para formato TradingView
      // Limitar aos últimos 100 ticks
      const ticksToUse = ticks.slice(-100);
      
      const chartData = ticksToUse
        .map(tick => {
          // Validar dados
          if (!tick || typeof tick !== 'object') return null;
          
          const value = tick.value;
          const epoch = tick.epoch;
          
          // Validação rigorosa
          if (
            value == null || 
            !isFinite(Number(value)) || 
            Number(value) <= 0 || 
            isNaN(Number(value)) ||
            epoch == null ||
            !isFinite(Number(epoch)) ||
            Number(epoch) <= 0 ||
            isNaN(Number(epoch))
          ) {
            return null;
          }
          
          return {
            time: Math.floor(Number(epoch)),
            value: Number(value)
          };
        })
        .filter(item => item !== null);

      if (chartData.length === 0) {
        console.warn('[Chart] Nenhum tick válido após validação');
        this.showChartPlaceholder = false;
        return;
      }

      // Ordenar por tempo
      chartData.sort((a, b) => a.time - b.time);

      console.log('[Chart] Plotando', chartData.length, 'ticks no gráfico');
      console.log('[Chart] Primeiro tick:', chartData[0]);
      console.log('[Chart] Último tick:', chartData[chartData.length - 1]);

      // Atualizar gráfico
      this.chartSeries.setData(chartData);
      
      // Ajustar viewport para mostrar todos os dados
      this.chart.timeScale().fitContent();
      
      this.showChartPlaceholder = false;
      console.log('[Chart] ✅ Gráfico atualizado com sucesso');
    },
    async handleSymbolChange() {
      console.log('[Chart] Mercado alterado para:', this.symbol);
      
      if (!this.isConnected || !this.derivToken) {
        console.warn('[Chart] Não conectado, tentando conectar...');
        await this.initializeConnection();
        return;
      }

      // Cancelar subscription anterior e inscrever-se no novo símbolo
      try {
        await derivTradingService.cancelTickSubscription();
        await derivTradingService.subscribeSymbol(this.symbol, this.derivToken, this.loginid);
        
        // Aguardar um pouco e buscar novos ticks
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 1500);
      } catch (error) {
        console.error('[Chart] Erro ao alterar símbolo:', error);
      }
    },
    handleResize() {
      const container = this.$refs.chartContainer;
      if (this.chart && container) {
        const newRect = container.getBoundingClientRect();
        if (newRect.width > 0 && newRect.height > 0) {
          this.chart.resize(newRect.width, newRect.height);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Operation Chart Wrapper */
.operation-chart-wrapper {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* Loading Card */
.connection-loading-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background: rgba(11, 11, 11, 0.95);
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.loading-indicator-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(34, 197, 94, 0.2);
  border-top-color: #22C55E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-message {
  color: #DFDFDF;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Layout */
.operation-layout {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  align-items: stretch;
}

.chart-card {
  flex: 1;
  min-height: calc(100% + 145px) !important;
  height: calc(100% + 145px) !important;
  display: flex;
  flex-direction: column;
}

.sidebar-panel {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  height: 100%;
}

.col-chart {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  min-height: 0;
  align-self: stretch;
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

.chart-wrapper {
  background-color: #0B0B0B !important;
  min-height: 400px !important;
  position: relative !important;
  overflow: visible !important;
  width: 100% !important;
  height: 100% !important;
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

/* Signal Area */
.border-t-2 {
  border-top-width: 2px;
}

.bg-gradient-to-b {
  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.from-\[#101010\] {
  --tw-gradient-from: #101010;
  --tw-gradient-to: rgba(16, 16, 16, 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-\[#0E0E0E\] {
  --tw-gradient-to: #0E0E0E;
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

/* Select Styles */
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

/* Utility Classes */
.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-5 {
  gap: 1.25rem;
}

.w-full {
  width: 100%;
}

.w-20 {
  width: 5rem;
}

.max-w-\[420px\] {
  max-width: 420px;
}

.w-\[420px\] {
  width: 420px;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.p-5 {
  padding: 1.25rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py-3\.5 {
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.pb-3 {
  padding-bottom: 0.75rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-5 {
  margin-bottom: 1.25rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.pt-3 {
  padding-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-b {
  border-bottom-width: 1px;
}

.bg-zenix-card {
  background-color: #0F0F0F;
}

.bg-zenix-bg {
  background-color: #0B0B0B;
}

.border-zenix-border {
  border-color: #1A1A1A;
}

.text-zenix-text {
  color: #DFDFDF;
}

.text-zenix-secondary {
  color: rgba(223, 223, 223, 0.6);
}

.text-zenix-green {
  color: #22C55E;
}

.bg-zenix-green {
  background-color: #22C55E;
}

.hover\:bg-zenix-green-hover:hover {
  background-color: #16A34A;
}

.text-black {
  color: #000000;
}

.text-white {
  color: #FFFFFF;
}

.text-red-500 {
  color: #EF4444;
}

.border-red-500 {
  border-color: #EF4444;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.tracking-wide {
  letter-spacing: 0.025em;
}

.uppercase {
  text-transform: uppercase;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.shadow-\[0_0_8px_rgba\(0\,0\,0\,0\.25\)\] {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
}

.shadow-\[0_-2px_12px_rgba\(34\,197\,94\,0\.08\)\] {
  box-shadow: 0 -2px 12px rgba(34, 197, 94, 0.08);
}

.shadow-\[0_0_12px_rgba\(34\,197\,94\,0\.3\)\] {
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
}

.hover\:shadow-\[0_0_16px_rgba\(34\,197\,94\,0\.4\)\]:hover {
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:border-zenix-green:focus {
  border-color: #22C55E;
}

.placeholder\:text-\[#DFDFDF40\]::placeholder {
  color: rgba(223, 223, 223, 0.25);
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.inline-flex {
  display: inline-flex;
}

.block {
  display: block;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.min-h-\[80px\] {
  min-height: 80px;
}

.mr-2 {
  margin-right: 0.5rem;
}

.text-\[11px\] {
  font-size: 11px;
}

.text-\[9px\] {
  font-size: 9px;
}

.animated-card {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
