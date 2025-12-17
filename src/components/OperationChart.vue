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
              class="inline-flex items-center gap-2 px-4 py-2 bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold rounded-lg text-xs transition-all duration-300 shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_16px_rgba(34,197,94,0.4)]"
            >
              <i class="far fa-chart-line text-[9px]"></i>
              <span>Iniciar Análise do Gráfico</span>
            </button>
          </div>
          <div id="signalArea" class="min-h-[80px]">
            <!-- Signal content placeholder -->
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
          
          <!-- Action Button -->
          <div class="space-y-3 pt-3">
            <button 
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              <i class="fas fa-arrow-up"></i>
              Executar Ordem
            </button>
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
      markets: [], // Será preenchido pela API
      isLoadingMarkets: false,
      availableContracts: [], // Contratos disponíveis para o símbolo atual
      isLoadingContracts: false,
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
  },
  async mounted() {
    this.initChart();
    await this.loadMarketsFromAPI();
    
    // Se já houver um símbolo selecionado, carregar contratos disponíveis
    if (this.symbol) {
      await this.loadAvailableContracts(this.symbol);
    }
  },
  beforeUnmount() {
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

      this.chartSeries = this.chart.addLineSeries({
        color: '#22C55E',
        lineWidth: 2,
      });

      // Dados placeholder
      this.loadPlaceholderData();

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
    loadPlaceholderData() {
      if (!this.chartSeries) return;

      // Gerar dados placeholder (últimas 100 horas)
      const now = Math.floor(Date.now() / 1000);
      const data = [];
      let baseValue = 625.0;

      for (let i = 100; i >= 0; i--) {
        const time = now - (i * 3600); // 1 hora atrás
        baseValue += (Math.random() - 0.5) * 2; // Variação aleatória
        data.push({
          time: time,
          value: Math.max(600, Math.min(650, baseValue)), // Limitar entre 600 e 650
        });
      }

      this.chartSeries.setData(data);
      this.chart.timeScale().fitContent();
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
    },
    openTradeTypeModal() {
      this.showTradeTypeModal = true;
    },
    closeTradeTypeModal() {
      this.showTradeTypeModal = false;
    },
    selectTradeType(type) {
      this.tradeType = type;
      this.closeTradeTypeModal();
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

        // Iniciar stream SSE para receber active_symbols
        await derivTradingService.startStream((data) => {
          if (data.type === 'active_symbols' && data.data) {
            this.processActiveSymbols(data.data);
            this.isLoadingMarkets = false;
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
</style>
