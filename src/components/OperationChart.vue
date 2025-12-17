<template>
  <div class="operation-chart-wrapper">
    <!-- Main Layout -->
    <div class="operation-layout">
      <!-- Chart Column -->
      <div class="col-chart flex-1 flex flex-col gap-5">
        <!-- Chart Container -->
        <div class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden flex flex-col shadow-[0_0_8px_rgba(0,0,0,0.25)] chart-container w-full chart-card h-full">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] flex-shrink-0">
            <h3 class="text-base font-semibold text-zenix-text">Gráfico</h3>
            <button
              @click="toggleChartType"
              class="inline-flex items-center gap-2 px-3 py-1.5 bg-zenix-bg border border-zenix-border hover:border-zenix-green rounded-lg text-xs text-zenix-text transition-all duration-200"
              title="Alternar entre gráfico de linhas e velas"
            >
              <i :class="chartType === 'line' ? 'fas fa-chart-line' : 'fas fa-chart-bar'"></i>
              <span>{{ chartType === 'line' ? 'Linhas' : 'Velas' }}</span>
            </button>
          </div>

          <!-- Gráfico -->
          <div id="tradingviewChart" ref="chartContainer" class="flex-1 chart-wrapper relative" style="background-color: #0B0B0B; min-height: 0; height: 100%;">
            <div v-if="showChartPlaceholder" class="chart-placeholder absolute inset-0 flex items-center justify-center" style="z-index: 2; pointer-events: none;">
              <p class="text-zenix-secondary">Carregando gráfico...</p>
            </div>
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
              @click="toggleAnalysis"
              :disabled="!symbol"
              class="inline-flex items-center gap-2 px-4 py-2 bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold rounded-lg text-xs transition-all duration-300 shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_16px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isAnalyzing ? 'fas fa-stop' : 'far fa-chart-line text-[9px]'"></i>
              <span>{{ isAnalyzing ? 'Parar Análise' : 'Iniciar Análise do Gráfico' }}</span>
            </button>
          </div>
          <div id="signalArea" class="min-h-[80px]">
            <!-- Signal content -->
            <div v-if="aiRecommendation" class="signal-content">
              <div class="signal-header">
                <div class="signal-action" :class="aiRecommendation.action === 'CALL' ? 'signal-call' : 'signal-put'">
                  <i :class="aiRecommendation.action === 'CALL' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  <span class="signal-action-text">{{ aiRecommendation.action === 'CALL' ? 'COMPRA (CALL)' : 'VENDA (PUT)' }}</span>
                </div>
                <div class="signal-confidence">
                  <span class="confidence-label">Confiança:</span>
                  <span class="confidence-value" :class="confidenceClass">
                    {{ confidenceValue }}%
                  </span>
                </div>
              </div>
              <div v-if="aiRecommendation.reasoning" class="signal-reasoning">
                <i class="fas fa-lightbulb text-zenix-green mr-2"></i>
                <span>{{ aiRecommendation.reasoning }}</span>
              </div>
            </div>
            <div v-else-if="isAnalyzing" class="signal-loading">
              <i class="fas fa-spinner fa-spin text-zenix-green mr-2"></i>
              <span>Analisando gráfico...</span>
            </div>
            <div v-else class="signal-placeholder">
              <span class="text-zenix-secondary">Clique em "Iniciar Análise do Gráfico" para começar</span>
            </div>
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
            <button
              @click="openMarketModal"
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors text-left flex items-center justify-between"
            >
              <span>{{ selectedMarketLabel }}</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          
          <!-- Trade Type Select -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-exchange-alt text-zenix-green mr-2"></i>Tipo de Negociação
            </label>
            <button
              @click="openTradeTypeModal"
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors text-left flex items-center justify-between"
            >
              <span>{{ selectedTradeTypeLabel }}</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          
          <!-- Duration -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-clock text-zenix-green mr-2"></i>Duração
            </label>
            <div class="flex gap-2">
              <select 
                v-model="durationUnit"
                class="flex-1 bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
              >
                <option value="m">Minutos</option>
                <option value="t">Ticks</option>
              </select>
              <input 
                type="number" 
                v-model.number="duration"
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
              v-model.number="amount"
              step="0.01" 
              min="0.35"
              max="10000"
              placeholder="Ex: 1.00, 2.50..."
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text placeholder:text-[#DFDFDF40] focus:outline-none focus:border-zenix-green transition-colors"
            />
            <div class="text-xs text-zenix-secondary mt-1">
              Min: USD 0.35 | Max: USD 10000.00
            </div>
          </div>
          
          <!-- Card de Dígitos de Previsão (apenas para contratos de dígitos) -->
          <div v-if="isDigitContract && latestTick" class="bg-zenix-bg border border-zenix-border rounded-lg p-4">
            <div class="text-xs font-medium text-zenix-secondary mb-3">
              <i class="fas fa-calculator text-zenix-green mr-2"></i>Dígitos de Previsão
            </div>
            
            <!-- Grid de Dígitos 0-9 com último destacado -->
            <div class="mb-4">
              <div class="text-xs text-zenix-secondary mb-2">Último dígito: <span class="text-zenix-green font-bold">{{ lastDigit }}</span> ({{ lastDigitParity }})</div>
              <div class="grid grid-cols-5 gap-2">
                <div
                  v-for="digit in 10"
                  :key="digit - 1"
                  :class="[
                    'digit-display-item',
                    lastDigit === (digit - 1) ? 'digit-display-item-last' : 'digit-display-item-normal'
                  ]"
                >
                  {{ digit - 1 }}
                </div>
              </div>
            </div>
            
            <!-- Seleção de Dígito (0-9) para DIGITMATCH -->
            <div v-if="tradeType === 'DIGITMATCH'" class="mt-3 pt-3 border-t border-zenix-border">
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-3">
                <i class="fas fa-bullseye text-zenix-green mr-2"></i>Selecione o Dígito para Match
              </label>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="digit in 10"
                  :key="digit - 1"
                  @click="digitMatchValue = digit - 1"
                  :class="[
                    'digit-select-btn',
                    digitMatchValue === (digit - 1) ? 'digit-select-btn-active' : 'digit-select-btn-inactive'
                  ]"
                >
                  {{ digit - 1 }}
                </button>
              </div>
              <div v-if="digitMatchValue !== null" class="mt-3 text-center">
                <span class="text-xs text-zenix-secondary">Dígito selecionado: </span>
                <span class="text-lg font-bold text-zenix-green">{{ digitMatchValue }}</span>
              </div>
            </div>
          </div>
          
          <!-- Purchase Price -->
          <div v-if="purchasePrice" class="bg-zenix-bg border border-zenix-border rounded-lg p-3">
            <div class="text-xs text-zenix-secondary mb-1">Preço de Compra:</div>
            <div class="text-base font-semibold text-zenix-text">$ {{ purchasePrice.toFixed(pricePrecision) }}</div>
          </div>
          
          <!-- Real-time P&L -->
          <div v-if="realTimeProfit !== null && activeContract" class="bg-zenix-bg border rounded-lg p-3" :class="realTimeProfitClass">
            <div class="text-xs text-zenix-secondary mb-1">P&L em Tempo Real:</div>
            <div class="text-base font-semibold" :class="realTimeProfitTextClass">
              $ {{ realTimeProfit >= 0 ? '+' : '' }}{{ realTimeProfit.toFixed(pricePrecision) }}
            </div>
          </div>
          
          <!-- Tempo/Ticks Restantes -->
          <div v-if="activeContract && (contractTimeRemaining !== null || contractTicksRemaining !== null)" class="bg-zenix-bg border border-zenix-border rounded-lg p-3">
            <div class="text-xs text-zenix-secondary mb-1">
              <i class="fas fa-clock mr-2"></i>
              {{ isTickBasedContract ? 'Ticks Restantes:' : 'Tempo Restante:' }}
            </div>
            <div class="text-base font-semibold text-zenix-text" :class="getCountdownClass">
              <span v-if="isTickBasedContract && contractTicksRemaining !== null">
                {{ contractTicksRemaining }}
              </span>
              <span v-else-if="!isTickBasedContract && contractTimeRemaining !== null">
                {{ formatTimeRemaining(contractTimeRemaining) }}
              </span>
            </div>
          </div>
          
          <!-- Action Button -->
          <div class="space-y-3 pt-3">
            <button 
              v-if="!activeContract"
              @click="executeBuy"
              :disabled="!canExecuteOrder"
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-arrow-up"></i>
              Executar Ordem
            </button>
          </div>
          
          <!-- Error Message -->
          <div v-if="tradeError" class="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
            {{ tradeError }}
          </div>
          
          <!-- Success Message -->
          <div v-if="tradeMessage" class="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-xs">
            {{ tradeMessage }}
          </div>
          </div>
          </div>
          </div>
      
      <!-- Market Selection Modal -->
    <Teleport to="body">
      <div 
        v-if="showMarketModal" 
        class="modal-overlay" 
        data-modal="market" 
        @click.self="closeMarketModal"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Selecionar Mercado</h3>
            <button @click="closeMarketModal" class="modal-close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="market-categories">
              <div v-for="(markets, category) in marketsByCategory" :key="category" class="market-category">
                <h4 class="category-title">{{ category }}</h4>
                <div class="market-grid">
                  <button
                    v-for="market in markets"
                    :key="market.value"
                    @click="selectMarket(market.value)"
                    class="market-item"
                    :class="{ 'active': symbol === market.value }"
                  >
                    <span class="market-label">{{ market.label }}</span>
                    <span class="market-symbol">{{ market.value }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
      
      <!-- Trade Type Selection Modal -->
    <Teleport to="body">
      <div 
        v-if="showTradeTypeModal" 
        class="modal-overlay" 
        data-modal="trade-type" 
        @click.self="closeTradeTypeModal"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Selecionar Tipo de Negociação</h3>
            <button @click="closeTradeTypeModal" class="modal-close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="trade-type-grid">
              <button
                v-for="type in availableTradeTypes"
                :key="type.value"
                @click="selectTradeType(type.value)"
                class="trade-type-item"
                :class="{ 'active': tradeType === type.value }"
              >
                <i :class="type.icon"></i>
                <span class="trade-type-label">{{ type.label }}</span>
                <span class="trade-type-desc">{{ type.description }}</span>
              </button>
            </div>
            </div>
          </div>
        </div>
    </Teleport>
    
    <!-- Trade Result Modal -->
    <Teleport to="body">
      <div 
        v-if="showTradeResultModal" 
        class="modal-overlay" 
        data-modal="trade-result" 
        @click.self="closeTradeResultModal"
      >
        <div class="modal-content trade-result-modal">
          <div class="modal-header">
            <h3 class="modal-title">Resultado da Operação</h3>
            <button @click="closeTradeResultModal" class="modal-close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="trade-result-content">
              <!-- Ícone e Status -->
              <div class="trade-result-icon" :class="finalTradeProfit >= 0 ? 'trade-result-win' : 'trade-result-loss'">
                <i :class="finalTradeProfit >= 0 ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
              </div>
              
              <!-- Título -->
              <h4 class="trade-result-title" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                {{ finalTradeProfit >= 0 ? 'Ganho!' : 'Perda' }}
              </h4>
              
              <!-- Valor -->
              <div class="trade-result-value" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                {{ finalTradeProfit >= 0 ? '+' : '' }}${{ finalTradeProfit.toFixed(pricePrecision) }}
              </div>
              
              <!-- Tipo de Contrato -->
              <div class="trade-result-type">
                <span class="text-zenix-secondary">Tipo:</span>
                <span class="text-zenix-text font-semibold">{{ finalTradeType }}</span>
              </div>
              
              <!-- Botão Fechar -->
              <button 
                @click="closeTradeResultModal"
                class="trade-result-close-btn"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="js">
import { createChart, ColorType } from 'lightweight-charts';
import derivTradingService from '../services/deriv-trading.service.js';

export default {
  name: 'OperationChart',
  data() {
    return {
      showChartPlaceholder: false,
      chart: null,
      chartSeries: null,
      symbol: 'R_100',
      tradeType: '',
        duration: 1,
        durationUnit: 'm',
      amount: 10,
      showMarketModal: false,
      showTradeTypeModal: false,
      showTradeResultModal: false,
      finalTradeProfit: 0,
      finalTradeType: 'CALL',
      markets: [], // Será preenchido pela API
      isLoadingMarkets: false,
      availableContracts: [], // Contratos disponíveis para o símbolo atual
      isLoadingContracts: false,
      latestTick: null, // Último tick recebido
      lastDigit: null, // Último dígito do preço
      lastDigitParity: null, // Paridade do último dígito (PAR/IMPAR)
      digitMatchValue: null, // Valor do dígito selecionado para DIGITMATCH
      // Estado do contrato ativo
      activeContract: null,
      purchasePrice: null,
      isTrading: false,
      tradeError: '',
      tradeMessage: '',
      realTimeProfit: null,
      realTimeProfitClass: 'border-zenix-green',
      realTimeProfitTextClass: 'text-zenix-green',
      contractTimeRemaining: null,
      contractTicksRemaining: null,
      contractStartTime: null,
      contractDuration: null,
      contractCountdownInterval: null,
      contractTickCount: 0,
      pricePrecision: 2,
      // IA Analysis
      isAnalyzing: false,
      analysisInterval: null,
      aiRecommendation: null,
      collectedTicks: [], // Ticks coletados para análise
      // Chart Type
      chartType: 'line', // 'line' ou 'candles'
      storedTicks: [], // Armazenar ticks para conversão em velas
      allTradeTypes: [
        { value: 'CALL', label: 'Alta (CALL)', description: 'Apostar que o preço subirá', icon: 'fas fa-arrow-up' },
        { value: 'PUT', label: 'Baixa (PUT)', description: 'Apostar que o preço cairá', icon: 'fas fa-arrow-down' },
        { value: 'DIGITMATCH', label: 'Dígito Igual', description: 'O último dígito será igual', icon: 'fas fa-equals' },
        { value: 'DIGITDIFF', label: 'Dígito Diferente', description: 'O último dígito será diferente', icon: 'fas fa-not-equal' },
        { value: 'DIGITEVEN', label: 'Dígito Par', description: 'O último dígito será par', icon: 'fas fa-divide' },
        { value: 'DIGITODD', label: 'Dígito Ímpar', description: 'O último dígito será ímpar', icon: 'fas fa-percent' },
        { value: 'DIGITOVER', label: 'Dígito Acima', description: 'O último dígito será maior', icon: 'fas fa-greater-than' },
        { value: 'DIGITUNDER', label: 'Dígito Abaixo', description: 'O último dígito será menor', icon: 'fas fa-less-than' },
      ],
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
    selectedMarketLabel() {
      const market = this.markets.find(m => m.value === this.symbol);
      return market ? market.label : 'Selecione um mercado';
    },
    selectedTradeTypeLabel() {
      if (!this.tradeType) {
        return 'Selecione o tipo';
      }
      const selectedType = this.availableTradeTypes.find(t => t.value === this.tradeType);
      return selectedType ? selectedType.label : this.tradeType;
    },
    availableTradeTypes() {
      // Se não houver contratos disponíveis, retornar todos os tipos
      if (!this.availableContracts || this.availableContracts.length === 0) {
        return this.allTradeTypes;
      }
      
      // Extrair tipos de contrato dos contratos disponíveis
      const contractTypes = this.availableContracts.map(contract => {
            if (typeof contract === 'string') {
              return contract.toUpperCase();
            }
            if (contract && typeof contract === 'object') {
          return (contract.contract_type || contract.type || contract.name || '').toString().toUpperCase();
            }
            return null;
      }).filter(type => type && type.length > 0);
      
      // Filtrar tipos de negociação baseado nos contratos disponíveis
      const filteredTypes = this.allTradeTypes.filter(type => {
        return contractTypes.some(ct => ct === type.value.toUpperCase());
      });
      
      // Se não encontrou nenhum tipo, retornar todos (fallback)
      return filteredTypes.length > 0 ? filteredTypes : this.allTradeTypes;
    },
    isDigitContract() {
      const digitTypes = ['DIGITMATCH', 'DIGITDIFF', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER'];
      return digitTypes.includes(this.tradeType);
    },
    canExecuteOrder() {
      return this.symbol && this.tradeType && this.duration && this.amount && !this.isTrading && !this.activeContract;
    },
    isTickBasedContract() {
      return this.activeContract && this.activeContract.duration_unit === 't';
    },
    getCountdownClass() {
      if (this.isTickBasedContract) {
        if (this.contractTicksRemaining === null) return '';
        if (this.contractTicksRemaining <= 5) return 'countdown-warning';
        if (this.contractTicksRemaining <= 10) return 'countdown-alert';
        return 'countdown-normal';
      } else {
        if (this.contractTimeRemaining === null) return '';
        if (this.contractTimeRemaining <= 10) return 'countdown-warning';
        if (this.contractTimeRemaining <= 30) return 'countdown-alert';
        return 'countdown-normal';
      }
    },
    confidenceClass() {
      if (!this.aiRecommendation || this.aiRecommendation.confidence === null || this.aiRecommendation.confidence === undefined) {
        return 'confidence-low';
      }
      
      try {
        // Extrair valor numérico
        const confidence = this.aiRecommendation.confidence;
        let confValue;
        
        if (typeof confidence === 'number') {
          confValue = confidence;
        } else {
          confValue = parseFloat(String(confidence));
        }
        
        if (isNaN(confValue) || !isFinite(confValue)) return 'confidence-low';
        
        if (confValue >= 70) return 'confidence-high';
        if (confValue >= 50) return 'confidence-medium';
        return 'confidence-low';
      } catch (error) {
        console.error('[Chart] Erro ao processar confidence:', error);
        return 'confidence-low';
      }
    },
    confidenceValue() {
      if (!this.aiRecommendation || this.aiRecommendation.confidence === null || this.aiRecommendation.confidence === undefined) {
        return 0;
      }
      
      try {
        const confidence = this.aiRecommendation.confidence;
        if (typeof confidence === 'number') {
          return confidence;
        }
        const parsed = parseFloat(String(confidence));
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      } catch (error) {
        return 0;
      }
    },
  },
  async mounted() {
    this.initChart();
    await this.loadMarketsFromAPI();
    
    // Se já houver um símbolo selecionado, carregar contratos disponíveis e ticks
    if (this.symbol) {
      await this.loadAvailableContracts(this.symbol);
      // Aguardar um pouco para garantir que o gráfico está pronto
      setTimeout(() => {
        this.loadTicksFromBackend();
      }, 1000);
    }
  },
  beforeUnmount() {
    // Parar análise
    this.stopAnalysis();
    
    // Parar contador de contrato
    this.stopContractCountdown();
    
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
      this.chartSeries = null;
    }
    // Parar stream SSE se estiver ativo
    if (derivTradingService.eventSource) {
      derivTradingService.stopStream();
    }
  },
  methods: {
    initChart() {
      const container = this.$refs.chartContainer;
      if (!container) return;

      const { width, height } = container.getBoundingClientRect();
      
          this.chart = createChart(container, {
        width,
        height,
            layout: {
              background: { type: ColorType.Solid, color: '#0B0B0B' },
              textColor: '#DFDFDF',
            },
            grid: {
          vertLines: { color: '#1A1A1A' },
          horzLines: { color: '#1A1A1A' },
            },
            timeScale: {
              timeVisible: true,
              secondsVisible: false,
            },
          });

          // Criar série baseada no tipo de gráfico
          this.createChartSeries();

      // Resize observer
      const resizeObserver = new ResizeObserver(() => {
        if (this.chart && container) {
          const { width, height } = container.getBoundingClientRect();
          this.chart.applyOptions({ width, height });
        }
      });
      resizeObserver.observe(container);

              this.showChartPlaceholder = false;
    },
    createChartSeries() {
      if (!this.chart) return;
      
      // Remover série anterior se existir
      if (this.chartSeries) {
        this.chart.removeSeries(this.chartSeries);
        this.chartSeries = null;
      }
      
      // Criar nova série baseada no tipo
      if (this.chartType === 'line') {
        this.chartSeries = this.chart.addLineSeries({
          color: '#22C55E',
          lineWidth: 2,
        });
      } else {
        // Gráfico de velas
        this.chartSeries = this.chart.addCandlestickSeries({
          upColor: '#22C55E',
          downColor: '#EF4444',
          borderVisible: true,
          borderUpColor: '#22C55E',
          borderDownColor: '#EF4444',
          wickUpColor: '#22C55E',
          wickDownColor: '#EF4444',
        });
      }
    },
    toggleChartType() {
      // Alternar tipo de gráfico
      this.chartType = this.chartType === 'line' ? 'candles' : 'line';
      
      // Recriar série
      this.createChartSeries();
      
      // Replotar dados com o novo formato
      if (this.storedTicks.length > 0) {
        if (this.chartType === 'candles') {
          const candles = this.aggregateTicksToCandles(this.storedTicks);
          if (candles.length > 0) {
            this.chartSeries.setData(candles);
            this.chart.timeScale().fitContent();
          }
        } else {
          const lineData = this.storedTicks.map(tick => ({
            time: tick.time,
            value: tick.value
          }));
          if (lineData.length > 0) {
            this.chartSeries.setData(lineData);
            this.chart.timeScale().fitContent();
          }
        }
      }
    },
    aggregateTicksToCandles(ticks, timeframeSeconds = 1) {
      if (!Array.isArray(ticks) || ticks.length === 0) {
        return [];
      }
      
      // Ordenar ticks por tempo
      const sortedTicks = [...ticks].sort((a, b) => a.time - b.time);
      
      const candles = [];
      let bucketStart = null;
      let bucketTicks = [];
      
      const finalizeBucket = () => {
        if (!bucketTicks.length || bucketStart === null) return;
        
        const prices = bucketTicks.map(t => t.value);
        candles.push({
          time: bucketStart,
          open: bucketTicks[0].value,
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: bucketTicks[bucketTicks.length - 1].value,
        });
      };
      
      for (const tick of sortedTicks) {
        const tickTime = Math.floor(tick.time);
        const bucket = Math.floor(tickTime / timeframeSeconds) * timeframeSeconds;
        
        if (bucketStart === null) {
          bucketStart = bucket;
        }
        
        if (bucket !== bucketStart) {
          // Finalizar bucket anterior
          finalizeBucket();
          // Iniciar novo bucket
          bucketStart = bucket;
          bucketTicks = [];
        }
        
        bucketTicks.push({
          value: tick.value,
          time: tickTime
        });
      }
      
      // Finalizar último bucket
      finalizeBucket();
      
      return candles;
    },
    async loadTicksFromBackend() {
      if (!this.chart || !this.chartSeries || !this.symbol) {
        console.warn('[Chart] Gráfico não inicializado ou símbolo não definido');
        return;
      }
      
      try {
        console.log('[Chart] ========== BUSCANDO TICKS ==========');
        console.log('[Chart] Símbolo:', this.symbol);
        
        const response = await derivTradingService.getTicks(this.symbol);
        console.log('[Chart] Resposta do backend:', response);
        
        if (!response || !response.ticks || !Array.isArray(response.ticks)) {
          console.warn('[Chart] Resposta inválida do backend:', response);
          return;
        }
        
        // Filtrar ticks dos últimos 10 minutos
        const now = Math.floor(Date.now() / 1000);
        const tenMinutesAgo = now - (10 * 60);
        
        const recentTicks = response.ticks.filter(tick => {
          const tickEpoch = tick.epoch || tick.time || 0;
          return tickEpoch >= tenMinutesAgo;
        });
        
        console.log('[Chart] Ticks recebidos:', response.ticks.length);
        console.log('[Chart] Ticks dos últimos 10 minutos:', recentTicks.length);
        
        if (recentTicks.length > 0) {
          // Se estiver analisando, coletar ticks antes de plotar
          if (this.isAnalyzing) {
            recentTicks.forEach(tick => {
              this.collectTickForAnalysis({
                value: Number(tick.value),
                epoch: Number(tick.epoch || tick.time)
              });
            });
          }
          
          this.plotTicks(recentTicks);
        } else {
          console.warn('[Chart] Nenhum tick dos últimos 10 minutos encontrado');
        }
      } catch (error) {
        console.error('[Chart] Erro ao carregar ticks do backend:', error);
      }
    },
    plotTicks(ticks) {
      if (!this.chart || !this.chartSeries) {
        console.warn('[Chart] Gráfico não inicializado');
        return;
      }
      
      if (!ticks || !Array.isArray(ticks) || ticks.length === 0) {
        console.warn('[Chart] Ticks inválidos ou vazios');
        return;
      }
      
      console.log('[Chart] ========== PLOTANDO TICKS ==========');
      console.log('[Chart] Ticks recebidos:', ticks.length);
      
      // Converter ticks para formato do gráfico
      const chartData = ticks
        .map(tick => {
          // Converter epoch para horário de Brasília (UTC-3)
          const epoch = tick.epoch || tick.time || Date.now() / 1000;
          const brasiliaEpoch = Math.floor(Number(epoch)) - (3 * 60 * 60);
          
          return {
            time: brasiliaEpoch,
            value: Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0),
          };
        })
        .filter(point => point.value && point.value > 0 && point.time > 0)
        .sort((a, b) => a.time - b.time);
      
      if (chartData.length === 0) {
        console.warn('[Chart] Nenhum tick válido após processamento');
        return;
      }
      
      console.log('[Chart] Plotando', chartData.length, 'ticks no gráfico');
      if (chartData.length > 0) {
        console.log('[Chart] Primeiro tick:', chartData[0]);
        console.log('[Chart] Último tick:', chartData[chartData.length - 1]);
      }
      
      try {
        // Armazenar ticks para conversão futura
        this.storedTicks = chartData.map(tick => ({
          time: tick.time,
          value: tick.value
        }));
        
        // Converter para formato correto baseado no tipo de gráfico
        let dataToPlot = [];
        if (this.chartType === 'candles') {
          // Converter ticks em velas
          dataToPlot = this.aggregateTicksToCandles(this.storedTicks);
        } else {
          // Usar dados de linha diretamente
          dataToPlot = chartData;
        }
        
        if (dataToPlot.length === 0) {
          console.warn('[Chart] Nenhum dado para plotar após conversão');
          return;
        }
        
        // Limpar dados anteriores
        this.chartSeries.setData([]);
        
        // Plotar novos dados
        this.chartSeries.setData(dataToPlot);
        
        // Ajustar o gráfico para mostrar todos os dados
        this.chart.timeScale().fitContent();
        
        console.log('[Chart] ✅ Dados plotados com sucesso:', dataToPlot.length, this.chartType === 'candles' ? 'velas' : 'pontos');
        
        // Atualizar latestTick com o último tick
        if (chartData.length > 0) {
          const lastTick = chartData[chartData.length - 1];
          this.latestTick = {
            value: lastTick.value,
            epoch: lastTick.time
          };
          
          // Coletar ticks para análise se estiver analisando
          // Nota: chartData tem time em UTC-3, mas precisamos do epoch original
          // Vamos coletar dos ticks originais que foram passados para plotTicks
          // Isso será feito quando recebermos ticks do backend ou via SSE
          
          // Calcular último dígito se for contrato de dígitos
          if (this.isDigitContract) {
            this.updateDigitInfo(lastTick.value);
          }
        }
      } catch (error) {
        console.error('[Chart] Erro ao plotar ticks:', error);
      }
    },
    addTickToChart(tickData) {
      if (!this.chart || !this.chartSeries || !tickData) {
        return;
      }
      
      try {
        const time = tickData.time || tickData.epoch || Date.now() / 1000;
        const value = Number(tickData.value);
        
        if (!isFinite(value) || value <= 0 || !isFinite(time) || time <= 0) {
          return;
        }
        
        // Adicionar tick aos ticks armazenados
        this.storedTicks.push({
          time: Math.floor(time),
          value: value
        });
        
        // Manter apenas os últimos 1000 ticks para performance
        if (this.storedTicks.length > 1000) {
          this.storedTicks.shift();
        }
        
        // Atualizar gráfico baseado no tipo
        if (this.chartType === 'candles') {
          // Para velas, precisamos recalcular a última vela ou criar nova
          // Vamos usar uma abordagem mais simples: recalcular as últimas velas
          const recentTicks = this.storedTicks.slice(-60); // Últimos 60 ticks
          const candles = this.aggregateTicksToCandles(recentTicks);
          if (candles.length > 0) {
            this.chartSeries.setData(candles);
          }
        } else {
          // Para linhas, apenas atualizar
          this.chartSeries.update({
            time: Math.floor(time),
            value: value
          });
        }
        
        // Atualizar latestTick
        this.latestTick = {
          value: value,
          epoch: Math.floor(time)
        };
      } catch (error) {
        console.warn('[Chart] Erro ao adicionar tick ao gráfico:', error);
      }
    },
    openMarketModal() {
      this.showMarketModal = true;
    },
    closeMarketModal() {
      this.showMarketModal = false;
    },
    async selectMarket(marketValue) {
      this.symbol = marketValue;
      this.closeMarketModal();
      
      // Limpar tipo de negociação selecionado
      this.tradeType = '';
      
      // Buscar tipos de negociação disponíveis para o mercado selecionado
      await this.loadAvailableContracts(marketValue);
      
      // Carregar ticks do novo mercado
      setTimeout(() => {
        this.loadTicksFromBackend();
      }, 500);
    },
    openTradeTypeModal() {
      this.showTradeTypeModal = true;
    },
    closeTradeTypeModal() {
      this.showTradeTypeModal = false;
    },
    async selectTradeType(type) {
      this.tradeType = type;
        this.closeTradeTypeModal();
      
      // Se mudou para um contrato de dígitos e temos latestTick, calcular dígito
      const digitTypes = ['DIGITMATCH', 'DIGITDIFF', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER'];
      if (digitTypes.includes(this.tradeType) && this.latestTick && this.latestTick.value) {
        this.updateDigitInfo(this.latestTick.value);
      }
      
      // Se mudou para DIGITMATCH e temos um último dígito, inicializar digitMatchValue
      if (this.tradeType === 'DIGITMATCH' && this.lastDigit !== null) {
        this.digitMatchValue = this.lastDigit;
      } else if (this.tradeType !== 'DIGITMATCH') {
        // Limpar digitMatchValue se não for DIGITMATCH
        this.digitMatchValue = null;
      }
      
      // Carregar valores padrão (duração e valor mínimo) para o tipo selecionado
      if (this.symbol) {
        await this.loadDefaultValuesForType(type);
      }
    },
    async loadMarketsFromAPI() {
      try {
        this.isLoadingMarkets = true;
        
        // Buscar token e loginid do localStorage
        const derivConnection = localStorage.getItem('deriv_connection');
        let derivToken = localStorage.getItem('deriv_token');
        let loginid = null;

        if (derivConnection) {
          try {
            const connection = JSON.parse(derivConnection);
            loginid = connection.loginid;
            if (!derivToken) {
              derivToken = connection.token;
            }
          } catch (e) {
            console.warn('[Chart] Erro ao parsear deriv_connection:', e);
          }
        }

        // Se não tiver token, tentar deriv_tokens_by_loginid
        if (!derivToken) {
          const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid');
          if (tokensByLoginId) {
            try {
              const tokens = JSON.parse(tokensByLoginId);
              if (loginid && tokens[loginid]) {
                derivToken = tokens[loginid];
              } else if (Object.keys(tokens).length > 0) {
                const firstLoginId = Object.keys(tokens)[0];
                derivToken = tokens[firstLoginId];
                loginid = firstLoginId;
              }
            } catch (e) {
              console.warn('[Chart] Erro ao parsear deriv_tokens_by_loginid:', e);
            }
          }
        }

        if (!derivToken) {
          console.warn('[Chart] Token Deriv não encontrado, usando mercados padrão');
          // Usar mercados padrão se não tiver token
          this.markets = this.getDefaultMarkets();
          this.isLoadingMarkets = false;
        return;
      }
      
        // Conectar ao backend
        await derivTradingService.connect(derivToken, loginid);

        // Iniciar stream SSE para receber mensagens
        await derivTradingService.startStream((data) => {
          if (data.type === 'active_symbols' && data.data) {
            this.processActiveSymbols(data.data);
            this.isLoadingMarkets = false;
          } else if (data.type === 'history' && data.data && data.data.ticks) {
            // Histórico recebido via SSE - filtrar últimos 10 minutos e plotar
            const now = Math.floor(Date.now() / 1000);
            const tenMinutesAgo = now - (10 * 60);
            
            const recentTicks = data.data.ticks
              .filter(tick => {
                const tickEpoch = tick.epoch || tick.time || 0;
                return tickEpoch >= tenMinutesAgo;
              })
              .map(tick => ({
                value: Number(tick.value),
                epoch: Number(tick.epoch || tick.time) // Manter epoch original para análise
              }));
            
            // Se estiver analisando, coletar ticks antes de plotar
            if (this.isAnalyzing && recentTicks.length > 0) {
              recentTicks.forEach(tick => {
                this.collectTickForAnalysis({
                  value: tick.value,
                  epoch: tick.epoch
                });
              });
            }
            
            if (recentTicks.length > 0) {
              this.plotTicks(recentTicks);
            }
          } else if (data.type === 'buy' && data.data) {
            this.processBuy(data.data);
          } else if (data.type === 'contract' && data.data) {
            this.processContract(data.data);
          } else if (data.type === 'tick' && data.data) {
            // Atualizar latestTick e adicionar ao gráfico
            const tickValue = Number(data.data.value);
            const tickEpochOriginal = Math.floor(Number(data.data.epoch)); // Epoch original (UTC)
            const tickEpochBrasilia = tickEpochOriginal - (3 * 60 * 60); // UTC-3 para o gráfico
            
            if (!isNaN(tickValue) && isFinite(tickValue) && tickValue > 0 &&
                !isNaN(tickEpochOriginal) && isFinite(tickEpochOriginal) && tickEpochOriginal > 0) {
              this.latestTick = {
                value: tickValue,
                epoch: tickEpochBrasilia
              };
              
              // Adicionar tick ao gráfico (usando epoch em UTC-3)
              this.addTickToChart({
                time: tickEpochBrasilia,
                value: tickValue
              });
              
              // Coletar tick para análise se estiver analisando (usando epoch original)
              if (this.isAnalyzing) {
                this.collectTickForAnalysis({
                  value: tickValue,
                  epoch: tickEpochOriginal
                });
              }
              
              // Calcular último dígito se for contrato de dígitos
              if (this.isDigitContract) {
                this.updateDigitInfo(tickValue);
              }
              
              // Atualizar P&L em tempo real se houver contrato ativo
              if (this.activeContract) {
                this.updateRealTimeProfit();
                
                // Atualizar ticks restantes se for contrato baseado em ticks
                if (this.isTickBasedContract && this.contractTicksRemaining !== null) {
                  this.contractTickCount++;
                  this.contractTicksRemaining = Math.max(0, (this.activeContract.duration || this.duration || 1) - this.contractTickCount);
                  
                  if (this.contractTicksRemaining <= 0) {
                    this.handleContractExpiration({ status: 'expired' });
                  }
                }
              }
            }
          }
        }, derivToken);

        // Solicitar símbolos ativos via endpoint REST
        try {
          await derivTradingService.requestActiveSymbols();
          console.log('[Chart] Solicitação de símbolos enviada');
        } catch (error) {
          console.warn('[Chart] Erro ao solicitar símbolos:', error);
        }

        // Aguardar um pouco para receber os símbolos via SSE
        setTimeout(() => {
          if (this.markets.length === 0) {
            console.warn('[Chart] Nenhum símbolo recebido, usando mercados padrão');
            this.markets = this.getDefaultMarkets();
            this.isLoadingMarkets = false;
          }
        }, 5000);

        } catch (error) {
        console.error('[Chart] Erro ao carregar mercados da API:', error);
        // Usar mercados padrão em caso de erro
        this.markets = this.getDefaultMarkets();
        this.isLoadingMarkets = false;
      }
    },
    processActiveSymbols(symbols) {
      if (!symbols || !Array.isArray(symbols)) {
        console.warn('[Chart] active_symbols inválido:', symbols);
        return;
      }

      console.log('[Chart] Processando símbolos ativos:', symbols.length);

      // Mapear símbolos para o formato esperado
      const mappedMarkets = symbols.map(symbol => {
        const symbolData = typeof symbol === 'string' ? { symbol } : symbol;
        const symbolValue = symbolData.symbol || symbolData.market || symbol;
        const displayName = symbolData.display_name || symbolData.name || symbolValue;
        
        // Determinar categoria baseado no prefixo do símbolo
        let category = 'Outros';
        if (symbolValue.startsWith('R_') || symbolValue.startsWith('1HZ')) {
          category = 'Índices Contínuos';
        } else if (symbolValue.startsWith('cry')) {
          category = 'Criptomoedas';
        } else if (symbolValue.startsWith('frx')) {
          if (symbolValue.includes('XAU') || symbolValue.includes('XAG') || symbolValue.includes('XPT') || symbolValue.includes('XPD')) {
            category = 'Metais';
          } else {
            category = 'Forex Majors';
          }
        }

        return {
          value: symbolValue,
          label: displayName,
          category: category,
        };
      });

      // Ordenar por categoria e depois por label
      mappedMarkets.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.label.localeCompare(b.label);
      });

      this.markets = mappedMarkets;
      console.log('[Chart] Mercados carregados:', this.markets.length);
    },
    async loadAvailableContracts(symbol) {
      if (!symbol) {
        this.availableContracts = [];
        return;
      }
      
      try {
        this.isLoadingContracts = true;
        
        // Buscar token e loginid do localStorage
        const derivConnection = localStorage.getItem('deriv_connection');
        let derivToken = localStorage.getItem('deriv_token');
        let loginid = null;

        if (derivConnection) {
          try {
            const connection = JSON.parse(derivConnection);
            loginid = connection.loginid;
            if (!derivToken) {
              derivToken = connection.token;
            }
          } catch (e) {
            console.warn('[Chart] Erro ao parsear deriv_connection:', e);
          }
        }

        // Se não tiver token, tentar deriv_tokens_by_loginid
        if (!derivToken) {
          const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid');
          if (tokensByLoginId) {
            try {
              const tokens = JSON.parse(tokensByLoginId);
              if (loginid && tokens[loginid]) {
                derivToken = tokens[loginid];
              } else if (Object.keys(tokens).length > 0) {
                const firstLoginId = Object.keys(tokens)[0];
                derivToken = tokens[firstLoginId];
                loginid = firstLoginId;
              }
            } catch (e) {
              console.warn('[Chart] Erro ao parsear deriv_tokens_by_loginid:', e);
            }
          }
        }

        if (!derivToken) {
          console.warn('[Chart] Token Deriv não encontrado, não é possível buscar contratos');
          this.availableContracts = [];
          this.isLoadingContracts = false;
        return;
      }
      
        // Garantir que está conectado
        if (!derivTradingService.isConnected) {
          await derivTradingService.connect(derivToken, loginid);
        }

        // Buscar valores padrão (que incluem contratos disponíveis)
        // Usar CALL como tipo padrão para buscar contratos
        const defaultValues = await derivTradingService.getDefaultValues(symbol, 'CALL');
        
        console.log('[Chart] Valores padrão recebidos:', defaultValues);
        
        // Processar contratos disponíveis
        if (defaultValues.availableContracts) {
          let contractsArray = [];
          
          if (Array.isArray(defaultValues.availableContracts)) {
            contractsArray = defaultValues.availableContracts;
          } else if (defaultValues.availableContracts.available && Array.isArray(defaultValues.availableContracts.available)) {
            contractsArray = defaultValues.availableContracts.available;
          } else if (typeof defaultValues.availableContracts === 'object') {
            // Tentar extrair de outras estruturas
            const values = Object.values(defaultValues.availableContracts);
            for (const value of values) {
              if (Array.isArray(value)) {
                contractsArray = [...contractsArray, ...value];
              }
            }
          }
          
              this.availableContracts = contractsArray;
          console.log('[Chart] Contratos disponíveis atualizados:', this.availableContracts.length, 'contratos');
          
          // Se o tipo atual não estiver disponível, limpar seleção
          if (this.tradeType) {
            const isTypeAvailable = this.availableContracts.some(c => {
              const contractType = typeof c === 'string' ? c : (c.contract_type || c.type || c.name);
              return contractType && contractType.toUpperCase() === this.tradeType.toUpperCase();
            });
            
            if (!isTypeAvailable) {
              this.tradeType = '';
              console.log('[Chart] Tipo de negociação anterior não está disponível, limpo');
            }
          }
        } else {
          console.warn('[Chart] Nenhum contrato disponível retornado para o símbolo:', symbol);
          this.availableContracts = [];
        }
        
      } catch (error) {
        console.error('[Chart] Erro ao carregar contratos disponíveis:', error);
        this.availableContracts = [];
      } finally {
        this.isLoadingContracts = false;
      }
    },
    async loadDefaultValuesForType(contractType) {
      if (!this.symbol || !contractType) {
        return;
      }
      
      try {
        // Buscar valores padrão para o tipo de contrato
        const defaultValues = await derivTradingService.getDefaultValues(this.symbol, contractType);
        
        console.log('[Chart] Valores padrão recebidos para tipo:', contractType, defaultValues);
        
        // Encontrar o contrato selecionado nos contratos disponíveis
            const selectedContract = this.availableContracts.find(c => {
          const contractTypeValue = typeof c === 'string' ? c : (c.contract_type || c.type || c.name);
          return contractTypeValue && contractTypeValue.toUpperCase() === contractType.toUpperCase();
            });
            
            if (selectedContract && typeof selectedContract === 'object') {
          // Ajustar duração mínima
          if (selectedContract.min_contract_duration) {
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
              
              const minDur = parseDuration(selectedContract.min_contract_duration);
              
              if (minDur) {
              const currentDuration = this.duration || 1;
              const currentUnit = this.durationUnit || 'm';
                
              // Ajustar se necessário
                if (minDur.unit === 't') {
                if (currentUnit !== 't' || currentDuration < minDur.value) {
                  this.duration = minDur.value;
                  this.durationUnit = 't';
                  console.log('[Chart] Duração ajustada para mínima (ticks):', minDur.value);
                    }
                  } else {
                // Para outras unidades, converter para comparação
                  const currentInMinutes = currentUnit === 'm' ? currentDuration : 
                                          (currentUnit === 'h' ? currentDuration * 60 : 
                                          (currentUnit === 'd' ? currentDuration * 1440 : 0));
                  const minInMinutes = minDur.unit === 'm' ? minDur.value : 
                                      (minDur.unit === 'h' ? minDur.value * 60 : 
                                      (minDur.unit === 'd' ? minDur.value * 1440 : 0));
                  
                    if (currentUnit === minDur.unit && currentDuration < minDur.value) {
                  this.duration = minDur.value;
                        console.log('[Chart] Duração ajustada para mínima:', minDur.value, minDur.unit);
                    } else if (currentUnit !== minDur.unit && currentInMinutes < minInMinutes) {
                  this.duration = minDur.value;
                  this.durationUnit = minDur.unit;
                        console.log('[Chart] Duração ajustada para mínima (conversão):', minDur.value, minDur.unit);
                }
              }
            }
          }
          
          // Ajustar valor mínimo
          if (selectedContract.min_contract_amount) {
            const minAmount = parseFloat(selectedContract.min_contract_amount);
            if (!isNaN(minAmount) && this.amount < minAmount) {
              this.amount = minAmount;
              console.log('[Chart] Valor de entrada ajustado para mínimo:', minAmount);
            }
          }
        }
        
        // Se houver valores padrão retornados, usar eles (apenas se não foram ajustados pelo contrato)
        if (defaultValues.amount) {
          const defaultAmount = parseFloat(defaultValues.amount);
          if (!isNaN(defaultAmount) && this.amount < defaultAmount) {
            this.amount = defaultAmount;
            console.log('[Chart] Valor de entrada ajustado para padrão:', defaultAmount);
          }
        }
        if (defaultValues.duration && !this.duration) {
          this.duration = defaultValues.duration;
        }
        if (defaultValues.durationUnit && !this.durationUnit) {
          this.durationUnit = defaultValues.durationUnit;
        }
        
      } catch (error) {
        console.error('[Chart] Erro ao carregar valores padrão para tipo:', error);
      }
    },
    updateDigitInfo(value) {
      // Extrair último dígito do valor
      const valueStr = value.toFixed(5); // Usar 5 casas decimais para garantir precisão
      const lastChar = valueStr[valueStr.length - 1];
      const digit = parseInt(lastChar, 10);
      
      if (!isNaN(digit) && digit >= 0 && digit <= 9) {
        this.lastDigit = digit;
        this.lastDigitParity = digit % 2 === 0 ? 'PAR' : 'IMPAR';
        
        // Se for DIGITMATCH e não tiver valor selecionado, usar o último dígito
        if (this.tradeType === 'DIGITMATCH' && this.digitMatchValue === null) {
          this.digitMatchValue = digit;
        }
      }
    },
    async executeBuy() {
      if (!this.canExecuteOrder) {
        return;
      }
      
      // Definir preço de compra
      if (this.latestTick && this.latestTick.value) {
        this.purchasePrice = this.latestTick.value;
      }
      
      this.tradeError = '';
      this.tradeMessage = '';
      this.isTrading = true;
      
      console.log('[Chart] ========== EXECUTAR COMPRA ==========');
      console.log('[Chart] Configuração:', {
        symbol: this.symbol,
        tradeType: this.tradeType,
        duration: this.duration,
        durationUnit: this.durationUnit,
        amount: this.amount
      });
      
      try {
        const buyConfig = {
          symbol: this.symbol,
          contractType: this.tradeType,
          duration: this.duration,
          durationUnit: this.durationUnit,
          amount: this.amount,
        };
        
        // Adicionar barrier para DIGITMATCH
        if (this.tradeType === 'DIGITMATCH') {
          buyConfig.barrier = this.digitMatchValue !== null && this.digitMatchValue !== undefined 
            ? this.digitMatchValue 
            : (this.lastDigit !== null && this.lastDigit !== undefined ? this.lastDigit : 5);
        }
        
        // Enviar compra para o backend
        await derivTradingService.buyContract(buyConfig);
        console.log('[Chart] ✅ Compra executada via backend');
        // A resposta chegará via SSE no evento 'buy'
      } catch (error) {
        console.error('[Chart] Erro ao executar compra:', error);
        this.tradeError = error.message || 'Erro ao executar compra';
        this.isTrading = false;
      }
    },
    processBuy(buyData) {
      console.log('[Chart] ========== PROCESSANDO COMPRA ==========');
      console.log('[Chart] Dados da compra:', buyData);
      
      const contractId = buyData.contractId || buyData.contract_id;
      
      if (!buyData || !contractId) {
        console.error('[Chart] Dados de compra inválidos:', buyData);
        this.tradeError = 'Erro ao processar compra.';
        this.isTrading = false;
        return;
      }
      
      const durationUnit = buyData.durationUnit || buyData.duration_unit || this.durationUnit || 'm';
      const duration = buyData.duration || this.duration || 1;
      
      this.activeContract = {
        contract_id: contractId,
        buy_price: buyData.buyPrice || buyData.buy_price || this.purchasePrice,
        entry_spot: buyData.entrySpot || buyData.entry_spot || this.purchasePrice || null,
        entry_time: buyData.entryTime || buyData.entry_time || Date.now() / 1000,
        contract_type: buyData.contractType || buyData.contract_type || this.tradeType,
        duration: duration,
        duration_unit: durationUnit,
        symbol: buyData.symbol || this.symbol,
        sell_price: buyData.sellPrice || buyData.sell_price || null,
        profit: buyData.profit || null,
        expiry_time: buyData.expiryTime || buyData.expiry_time || null,
        payout: buyData.payout || null,
      };
      
      this.isTrading = false;
      this.tradeMessage = 'Compra executada com sucesso!';
      
      // Inicializar contador
      this.initializeContractCountdown();
      
      // Inicializar P&L
      this.updateRealTimeProfit();
    },
    initializeContractCountdown() {
      if (!this.activeContract) return;
      
      const duration = this.activeContract.duration || this.duration || 1;
      const durationUnit = this.activeContract.duration_unit || this.durationUnit || 'm';
      const entryTime = this.activeContract.entry_time || Date.now() / 1000;
      
      this.contractStartTime = entryTime;
      this.contractTickCount = 0;
      
      if (durationUnit === 't') {
        // Contrato baseado em ticks
        this.contractTicksRemaining = duration;
        this.contractTimeRemaining = null;
      } else {
        // Contrato baseado em tempo
        let durationInSeconds = 0;
        switch (durationUnit) {
          case 's':
            durationInSeconds = duration;
            break;
          case 'm':
            durationInSeconds = duration * 60;
            break;
          case 'h':
            durationInSeconds = duration * 3600;
            break;
          case 'd':
            durationInSeconds = duration * 86400;
            break;
          default:
            durationInSeconds = duration * 60;
        }
        
        this.contractDuration = durationInSeconds;
        this.contractTimeRemaining = durationInSeconds;
        this.contractTicksRemaining = null;
        
        // Iniciar contador de tempo
        const intervalId = setInterval(() => {
          if (!this.activeContract) {
            this.stopContractCountdown();
            return;
          }
          
          const now = Date.now() / 1000;
          const elapsed = now - this.contractStartTime;
          const remaining = Math.max(0, this.contractDuration - elapsed);
          
          this.contractTimeRemaining = remaining;
          
          // Se expirou, processar expiração
          if (remaining <= 0) {
            this.stopContractCountdown();
            this.handleContractExpiration({ status: 'expired' });
          }
        }, 1000);
        
        this.contractCountdownInterval = intervalId;
      }
    },
    stopContractCountdown() {
      if (this.contractCountdownInterval) {
        clearInterval(this.contractCountdownInterval);
        this.contractCountdownInterval = null;
      }
      
      this.contractTimeRemaining = null;
      this.contractTicksRemaining = null;
      this.contractStartTime = null;
      this.contractDuration = null;
      this.contractTickCount = 0;
    },
    formatTimeRemaining(seconds) {
      if (seconds === null || seconds === undefined || seconds < 0) return '00:00';
      
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },
    updateRealTimeProfit() {
      if (!this.activeContract || !this.purchasePrice || !this.latestTick) {
        return;
      }
      
      const currentPrice = this.latestTick.value;
      const entryPrice = this.purchasePrice;
      
      // Calcular P&L baseado no tipo de contrato
      let profit = 0;
      if (this.activeContract.contract_type === 'CALL') {
        profit = currentPrice - entryPrice;
      } else if (this.activeContract.contract_type === 'PUT') {
        profit = entryPrice - currentPrice;
      }
      
      this.realTimeProfit = profit;
      
      // Atualizar classes CSS baseado no P&L
      if (profit > 0) {
        this.realTimeProfitClass = 'border-zenix-green';
        this.realTimeProfitTextClass = 'text-zenix-green';
      } else if (profit < 0) {
        this.realTimeProfitClass = 'border-red-500';
        this.realTimeProfitTextClass = 'text-red-500';
      } else {
        this.realTimeProfitClass = 'border-zenix-border';
        this.realTimeProfitTextClass = 'text-zenix-text';
      }
    },
    processContract(contractData) {
      if (!this.activeContract) {
        return;
      }
      
      // Verificar se o contrato expirou
      const isExpired = contractData.status === 'sold' || contractData.status === 'won' || 
                        contractData.status === 'lost' || contractData.is_sold === true || 
                        contractData.is_expired === true || contractData.status === 'expired';
      
      // Atualizar dados do contrato
      if (contractData.sell_price !== undefined) {
        this.activeContract.sell_price = contractData.sell_price;
      }
      if (contractData.profit !== undefined) {
        this.activeContract.profit = contractData.profit;
      }
      if (contractData.exit_spot !== undefined || contractData.exitSpot !== undefined) {
        this.activeContract.exit_spot = contractData.exit_spot || contractData.exitSpot || null;
      }
      
      // Se o contrato expirou, processar resultado final
      if (isExpired) {
        this.handleContractExpiration(contractData);
        return;
      }
      
      // Atualizar P&L em tempo real
      this.updateRealTimeProfit();
      
      // Atualizar ticks restantes se for contrato baseado em ticks
      if (this.isTickBasedContract && contractData.ticks_remaining !== undefined) {
        this.contractTicksRemaining = contractData.ticks_remaining;
      }
    },
    handleContractExpiration(contractData) {
      console.log('[Chart] ========== CONTRATO EXPIRADO ==========');
      
      // Parar contador
      this.stopContractCountdown();
      
      // Determinar resultado
      const profit = contractData.profit !== undefined && contractData.profit !== null 
        ? Number(contractData.profit) 
        : (this.realTimeProfit !== null ? this.realTimeProfit : 0);
      
      // Atualizar contrato com dados finais
      if (this.activeContract) {
        this.activeContract.sell_price = contractData.sell_price || this.activeContract.sell_price;
        this.activeContract.profit = profit;
        this.activeContract.status = contractData.status || (profit > 0 ? 'won' : 'lost');
      }
      
      // Preparar dados para o modal
      this.finalTradeProfit = profit;
      this.finalTradeType = this.activeContract?.contract_type || this.tradeType || 'CALL';
      
      // Mostrar modal de resultado
      this.showTradeResultModal = true;
      
      // Limpar contrato após um tempo
      setTimeout(() => {
        this.activeContract = null;
        this.purchasePrice = null;
        this.realTimeProfit = null;
        this.tradeMessage = '';
      }, 5000);
    },
    closeTradeResultModal() {
      this.showTradeResultModal = false;
      // Limpar dados do resultado
      this.finalTradeProfit = 0;
      this.finalTradeType = 'CALL';
    },
    toggleAnalysis() {
      if (this.isAnalyzing) {
        this.stopAnalysis();
      } else {
        this.startAnalysis();
      }
    },
    startAnalysis() {
      if (!this.symbol) {
        console.warn('[Chart] Símbolo não selecionado');
        return;
      }
      
      this.isAnalyzing = true;
      this.collectedTicks = [];
      
      // Coletar ticks iniciais do gráfico (se houver)
      this.collectInitialTicks();
      
      // Executar primeira análise imediatamente
      this.analyzeChart();
      
      // Configurar intervalo para repetir a cada 2 minutos
      this.analysisInterval = setInterval(() => {
        if (this.isAnalyzing) {
          this.analyzeChart();
        }
      }, 2 * 60 * 1000); // 2 minutos
      
      console.log('[Chart] Análise iniciada');
    },
    stopAnalysis() {
      this.isAnalyzing = false;
      
      if (this.analysisInterval) {
        clearInterval(this.analysisInterval);
        this.analysisInterval = null;
      }
      
      this.collectedTicks = [];
      this.aiRecommendation = null;
      
      console.log('[Chart] Análise parada');
    },
    collectInitialTicks() {
      // Coletar ticks dos últimos 10 minutos que já foram plotados
      // Isso será feito quando carregar os ticks do backend
      // Por enquanto, vamos coletar apenas os novos ticks que chegarem
    },
    collectTickForAnalysis(tick) {
      if (!this.isAnalyzing) return;
      
      // Adicionar tick à coleção
      this.collectedTicks.push({
        value: tick.value,
        epoch: tick.epoch
      });
      
      // Manter apenas os últimos 50 ticks
      if (this.collectedTicks.length > 50) {
        this.collectedTicks.shift();
      }
    },
    async analyzeChart() {
      if (!this.isAnalyzing || !this.symbol) {
        return;
      }
      
      try {
        // Coletar os últimos 50 ticks
        // Se não tiver 50 ticks coletados, usar os ticks do gráfico
        let ticksToAnalyze = [...this.collectedTicks];
        
        // Se não tiver ticks suficientes, tentar buscar do backend
        if (ticksToAnalyze.length < 50) {
          try {
            const response = await derivTradingService.getTicks(this.symbol);
            if (response && response.ticks && Array.isArray(response.ticks)) {
              // Pegar os últimos 50 ticks
              const recentTicks = response.ticks.slice(-50);
              ticksToAnalyze = recentTicks.map(tick => ({
                value: Number(tick.value),
                epoch: Number(tick.epoch)
              }));
            }
          } catch (error) {
            console.warn('[Chart] Erro ao buscar ticks para análise:', error);
          }
        }
        
        // Se ainda não tiver ticks suficientes, usar os coletados
        if (ticksToAnalyze.length === 0) {
          console.warn('[Chart] Nenhum tick disponível para análise');
          return;
        }
        
        // Pegar os últimos 50 ticks
        const last50Ticks = ticksToAnalyze.slice(-50);
        
        console.log('[Chart] Enviando', last50Ticks.length, 'ticks para análise');
        
        // Enviar para o backend
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          throw new Error('Token de autenticação não encontrado');
        }
        
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const response = await fetch(`${apiBaseUrl}/gemini/recommendation`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticks: last50Ticks
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao obter recomendação');
        }
        
        const recommendation = await response.json();
        
        console.log('[Chart] Recomendação recebida:', recommendation);
        
        // Garantir que confidence seja um número
        let confidenceValue = 50; // valor padrão
        if (recommendation.confidence !== undefined && recommendation.confidence !== null) {
          const parsed = Number(recommendation.confidence);
          if (!isNaN(parsed) && isFinite(parsed)) {
            confidenceValue = parsed;
          }
        }
        
        // Atualizar recomendação
        this.aiRecommendation = {
          action: recommendation.action || 'CALL',
          confidence: confidenceValue,
          reasoning: recommendation.reasoning || ''
        };
        
      } catch (error) {
        console.error('[Chart] Erro ao analisar gráfico:', error);
        this.aiRecommendation = null;
      }
    },
    getDefaultMarkets() {
      // Mercados padrão caso a API não retorne
      return [
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
        { value: 'cryBTCUSD', label: 'BTC/USD (Bitcoin)', category: 'Criptomoedas' },
        { value: 'cryETHUSD', label: 'ETH/USD (Ethereum)', category: 'Criptomoedas' },
        { value: 'frxEURUSD', label: 'EUR/USD (Euro / Dólar)', category: 'Forex Majors' },
        { value: 'frxUSDJPY', label: 'USD/JPY (Dólar / Iene)', category: 'Forex Majors' },
        { value: 'frxGBPUSD', label: 'GBP/USD (Libra / Dólar)', category: 'Forex Majors' },
        { value: 'frxUSDCHF', label: 'USD/CHF (Dólar / Franco)', category: 'Forex Majors' },
        { value: 'frxAUDUSD', label: 'AUD/USD (Dólar Australiano)', category: 'Forex Majors' },
        { value: 'frxUSDCAD', label: 'USD/CAD (Dólar / Dólar Canadense)', category: 'Forex Majors' },
        { value: 'frxNZDUSD', label: 'NZD/USD (Dólar Neozelandês)', category: 'Forex Majors' },
        { value: 'frxEURGBP', label: 'EUR/GBP (Euro / Libra)', category: 'Forex Majors' },
        { value: 'frxEURJPY', label: 'EUR/JPY (Euro / Iene)', category: 'Forex Majors' },
        { value: 'frxGBPJPY', label: 'GBP/JPY (Libra / Iene)', category: 'Forex Majors' },
        { value: 'frxAUDCAD', label: 'AUD/CAD (Dólar Australiano / Canadense)', category: 'Forex Majors' },
        { value: 'frxAUDJPY', label: 'AUD/JPY (Dólar Australiano / Iene)', category: 'Forex Majors' },
        { value: 'frxCHFJPY', label: 'CHF/JPY (Franco / Iene)', category: 'Forex Majors' },
        { value: 'frxEURAUD', label: 'EUR/AUD (Euro / Dólar Australiano)', category: 'Forex Majors' },
        { value: 'frxGBPAUD', label: 'GBP/AUD (Libra / Dólar Australiano)', category: 'Forex Majors' },
        { value: 'frxUSDMXN', label: 'USD/MXN (Dólar / Peso Mexicano)', category: 'Forex Majors' },
        { value: 'frxXAUUSD', label: 'XAU/USD (Ouro / Dólar)', category: 'Metais' },
        { value: 'frxXAGUSD', label: 'XAG/USD (Prata / Dólar)', category: 'Metais' },
        { value: 'frxXPTUSD', label: 'XPT/USD (Platina / Dólar)', category: 'Metais' },
        { value: 'frxXPDUSD', label: 'XPD/USD (Paládio / Dólar)', category: 'Metais' },
      ];
    },
  },
};
</script>

<style scoped>
/* Copiando todos os estilos do arquivo original */
/* Operation Chart Wrapper */
.operation-chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 960px;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* Layout */
.operation-layout {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  min-height: 960px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  align-items: stretch;
}

.chart-card {
  flex: 1;
  height: 100%;
  min-height: 960px;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.sidebar-panel {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  height: 100%;
  min-height: 960px;
}

.col-chart {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  min-height: 960px;
  align-self: stretch;
  flex: 1;
}

.chart-container {
  height: 100%;
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.chart-wrapper {
  background-color: #0B0B0B !important;
  min-height: 0 !important;
  position: relative !important;
  overflow: hidden !important;
  width: 100% !important;
  height: 100% !important;
  flex: 1 1 0;
  display: block;
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

.text-black {
  color: #000000;
}

.text-white {
  color: #FFFFFF;
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

.border-t-2 {
  border-top-width: 2px;
}

.bg-zenix-green {
  background-color: #22C55E;
}

.hover\:bg-zenix-green-hover:hover {
  background-color: #16A34A;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  pointer-events: auto;
}

.modal-content {
  position: relative;
  background: #0F0F0F;
  border: 1px solid #1A1A1A;
  border-radius: 24px;
  padding: 0;
  min-width: 480px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(255, 255, 255, 0.05);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #1A1A1A;
  background: #0F0F0F;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px 32px;
  background: #0F0F0F;
}

/* Market Selection Modal */
.market-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.market-category {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.market-item {
  background: #0B0B0B;
  border: 1px solid #1A1A1A;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.market-item:hover {
  background: #151515;
  border-color: rgba(34, 197, 94, 0.5);
  transform: translateY(-2px);
}

.market-item.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22C55E;
}

.market-label {
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
}

.market-symbol {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* Trade Type Selection Modal */
.trade-type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.trade-type-item {
  background: #0B0B0B;
  border: 2px solid #1A1A1A;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.trade-type-item:hover {
  background: #151515;
  border-color: rgba(34, 197, 94, 0.5);
  transform: translateY(-2px);
}

.trade-type-item.active {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22C55E;
}

.trade-type-item i {
  font-size: 32px;
  color: #22C55E;
}

.trade-type-item.active i {
  color: #22C55E;
}

.trade-type-label {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
}

.trade-type-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Digit Display Items (visualização dos dígitos 0-9) */
.digit-display-item {
  aspect-ratio: 1;
  min-height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.digit-display-item-normal {
  background: rgba(11, 11, 11, 0.6);
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
}

.digit-display-item-last {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.15));
  border-color: #22C55E;
  color: #22C55E;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
  transform: scale(1.1);
  font-weight: 700;
  font-size: 16px;
}

/* Digit Select Buttons (seleção de dígito para DIGITMATCH) */
.digit-select-btn {
  aspect-ratio: 1;
  min-height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.digit-select-btn-inactive {
  background: rgba(11, 11, 11, 0.8);
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
}

.digit-select-btn-inactive:hover {
  background: rgba(11, 11, 11, 1);
  border-color: rgba(34, 197, 94, 0.5);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
}

.digit-select-btn-active {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.15));
  border-color: #22C55E;
  color: #22C55E;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
  transform: scale(1.05);
}

/* Countdown Styles */
.countdown-normal {
  color: #DFDFDF;
}

.countdown-alert {
  color: #FBBF24;
  animation: pulse 1s ease-in-out infinite;
}

.countdown-warning {
  color: #EF4444;
  animation: pulse 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.border-red-500 {
  border-color: #EF4444;
}

.text-red-500 {
  color: #EF4444;
}

.bg-red-500\/10 {
  background-color: rgba(239, 68, 68, 0.1);
}

.border-red-500\/30 {
  border-color: rgba(239, 68, 68, 0.3);
}

.text-red-400 {
  color: #F87171;
}

.bg-green-500\/10 {
  background-color: rgba(34, 197, 94, 0.1);
}

.border-green-500\/30 {
  border-color: rgba(34, 197, 94, 0.3);
}

.text-green-400 {
  color: #4ADE80;
}

/* Trade Result Modal Styles */
.trade-result-modal {
  max-width: 480px;
}

.trade-result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  text-align: center;
}

.trade-result-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 40px;
}

.trade-result-win {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  border: 2px solid #22C55E;
  color: #22C55E;
}

.trade-result-loss {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
  border: 2px solid #EF4444;
  color: #EF4444;
}

.trade-result-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.trade-result-value {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
}

.trade-result-type {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 30px;
  padding: 12px 20px;
  background: rgba(26, 26, 26, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.trade-result-close-btn {
  width: 100%;
  padding: 14px 24px;
  background: #22C55E;
  color: #000000;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trade-result-close-btn:hover {
  background: #16A34A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Signal Area Styles */
.signal-content {
  padding: 16px;
  background: rgba(11, 11, 11, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
}

.signal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.signal-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.signal-call {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #22C55E;
}

.signal-put {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #EF4444;
}

.signal-action-text {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.signal-confidence {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.confidence-value {
  font-size: 16px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 6px;
}

.confidence-high {
  color: #22C55E;
  background: rgba(34, 197, 94, 0.1);
}

.confidence-medium {
  color: #FBBF24;
  background: rgba(251, 191, 36, 0.1);
}

.confidence-low {
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
}

.signal-reasoning {
  padding: 12px;
  background: rgba(26, 26, 26, 0.5);
  border-radius: 8px;
  border-left: 3px solid #22C55E;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.signal-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.signal-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}
</style>
