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
            <button
              @click="openMarketModal"
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors text-left flex items-center justify-between"
            >
              <span>{{ selectedMarketLabel }}</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <!-- Select antigo mantido para compatibilidade, mas oculto -->
            <select 
              id="marketSelectSidebar"
              v-model="symbol"
              @change="handleSymbolChange"
              class="hidden"
              style="display: none !important;"
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
            <button
              @click="openTradeTypeModal"
              :disabled="isTrading || activeContract || !symbol"
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{{ selectedTradeTypeLabel }}</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <!-- Select antigo mantido para compatibilidade, mas oculto -->
            <select 
              id="tradeTypeSelect"
              v-model="localOrderConfig.type"
              :disabled="isTrading || activeContract"
              class="hidden"
              style="display: none !important;"
            >
              <option value="">Selecione um mercado primeiro</option>
              <option value="CALL">Alta (CALL)</option>
              <option value="PUT">Baixa (PUT)</option>
            </select>
            <div v-if="!canUseCallPut" class="warning-message mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
              ⚠️ Este ativo não suporta contratos CALL/PUT. Use a operação com dígitos para negociar este ativo.
            </div>
          </div>
          
          <!-- Duration -->
          <div>
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-clock text-zenix-green mr-2"></i>Duração
            </label>
            <div class="flex gap-2">
              <select 
                v-model="localOrderConfig.durationUnit"
                :disabled="isTrading || activeContract"
                class="flex-1 bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text focus:outline-none focus:border-zenix-green transition-colors"
              >
                <option value="m">Minutos</option>
                <option value="t">Ticks</option>
              </select>
              <input 
                type="number" 
                v-model.number="localOrderConfig.duration"
                min="1"
                max="365"
                :disabled="isTrading || activeContract"
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
              v-model.number="localOrderConfig.amount"
              step="0.01" 
              min="0.35"
              max="10000"
              placeholder="Ex: 1.00, 2.50..."
              :disabled="isTrading || activeContract"
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

          <!-- Action Buttons -->
          <div class="space-y-3 pt-3">
            <button 
              v-if="!activeContract"
              id="buyButton"
              @click="executeBuy"
              :disabled="isTrading || !currentProposalId || !localOrderConfig.type"
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-arrow-up"></i>
              Executar Ordem
            </button>
            
            <button 
              v-if="activeContract && isSellEnabled"
              id="sellButton"
              @click="executeSell"
              :disabled="isTrading"
              class="w-full bg-[#FF4747] hover:bg-[#FF6161] text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-arrow-down"></i>
              PUT / SELL
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

          <!-- Countdown -->
          <div v-if="showCountdown" class="countdown-display">
            <span class="countdown-label">Tempo restante:</span>
            <span class="countdown-value">0m 39s</span>
          </div>

          <!-- Messages -->
          <p v-if="showSuccessMessage" class="text-sm text-zenix-green">Operação executada com sucesso!</p>
          <p v-if="showErrorMessage" class="text-sm text-red-500">Erro ao executar operação</p>
          
          <!-- Last Orders Section -->
          <div v-if="tradeResults && tradeResults.length > 0" class="last-orders-section">
            <div class="last-orders-header">
              <h4 class="last-orders-title">
                <i class="fas fa-history text-zenix-green mr-2"></i>Últimas Ordens
              </h4>
            </div>
            <div class="orders-list">
              <div
                v-for="(order, index) in tradeResults.slice(0, 10)"
                :key="index"
                class="order-item"
              >
                <div class="order-item-header">
                  <span class="order-symbol">{{ order.symbol || order.direction || 'N/A' }}</span>
                  <span class="order-type" :class="order.direction === 'CALL' ? 'call' : 'put'">
                    {{ order.direction || 'N/A' }}
                  </span>
                </div>
                <div class="order-details">
                  <span>Compra: ${{ (order.buyPrice || 0).toFixed(2) }}</span>
                  <span v-if="order.sellPrice">Venda: ${{ order.sellPrice.toFixed(2) }}</span>
                </div>
                <div v-if="order.profit !== null && order.profit !== undefined" class="order-profit" :class="order.profit >= 0 ? 'positive' : 'negative'">
                  P&L: ${{ order.profit >= 0 ? '+' : '' }}{{ order.profit.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Trade Result Modal -->
      <TradeResultModal
        :visible="showTradeResultModal"
        :profit="finalTradeProfit"
        :currency="'USD'"
        :type="finalTradeType"
        :buy-price="finalTradeBuyPrice"
        :sell-price="finalTradeSellPrice"
        :balance-after="finalTradeBalanceAfter"
        @close="closeTradeResultModal"
      />
      
      <!-- Market Selection Modal -->
      <div v-if="showMarketModal" class="modal-overlay" @click.self="closeMarketModal">
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
      
      <!-- Trade Type Selection Modal -->
      <div v-if="showTradeTypeModal" class="modal-overlay" @click.self="closeTradeTypeModal">
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
                :class="{ 'active': localOrderConfig.type === type.value }"
              >
                <i :class="type.icon"></i>
                <span class="trade-type-label">{{ type.label }}</span>
                <span class="trade-type-desc">{{ type.description }}</span>
              </button>
            </div>
            <div v-if="!canUseCallPut" class="warning-message mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
              ⚠️ Este ativo não suporta contratos CALL/PUT. Use a operação com dígitos para negociar este ativo.
            </div>
          </div>
        </div>
      </div>
      
      <!-- Contract Tracking Visual Reference -->
      <div v-if="activeContract" class="contract-tracking-panel">
        <div class="tracking-header">
          <h4>Contrato Ativo</h4>
          <span class="contract-status" :class="activeContract.contract_type === 'CALL' ? 'status-call' : 'status-put'">
            {{ activeContract.contract_type }}
          </span>
        </div>
        <div class="tracking-details">
          <div class="tracking-item">
            <span class="tracking-label">Símbolo:</span>
            <span class="tracking-value">{{ activeContract.symbol }}</span>
          </div>
          <div class="tracking-item">
            <span class="tracking-label">Preço de Entrada:</span>
            <span class="tracking-value">$ {{ (activeContract.entry_spot || purchasePrice || 0).toFixed(pricePrecision) }}</span>
          </div>
          <div class="tracking-item">
            <span class="tracking-label">Preço Atual:</span>
            <span class="tracking-value">$ {{ (latestTick?.value || 0).toFixed(pricePrecision) }}</span>
          </div>
          <div class="tracking-item">
            <span class="tracking-label">P&L:</span>
            <span class="tracking-value" :class="realTimeProfit >= 0 ? 'profit' : 'loss'">
              $ {{ realTimeProfit >= 0 ? '+' : '' }}{{ (realTimeProfit || 0).toFixed(pricePrecision) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';
import derivTradingService from '../services/deriv-trading.service.js';
import TradeResultModal from './TradeResultModal.vue';

export default {
  name: 'OperationChart',
  components: {
    TradeResultModal,
  },
  props: {
    tradeResults: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showLoading: false,
      showChartPlaceholder: true,
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
      retryCount: 0,
      errorRetryCount: 0,
      ticks: [], // Armazenar ticks para atualização em tempo real
      // Variáveis de compra/venda
      activeContract: null,
      purchasePrice: null,
      entrySpotLine: null,
      isTrading: false,
      currentProposalId: null,
      currentProposalPrice: null,
      proposalSubscriptionId: null,
      isSellEnabled: false,
      realTimeProfit: null,
      localOrderConfig: {
        type: 'CALL',
        duration: 1,
        durationUnit: 'm',
        amount: 10.00,
        multiplier: null,
      },
      tradeError: '',
      tradeMessage: '',
      latestTick: null,
      pricePrecision: 2,
      // Modais
      showMarketModal: false,
      showTradeTypeModal: false,
      showTradeResultModal: false,
      // Dados do modal de resultado
      finalTradeProfit: 0,
      finalTradeType: 'CALL',
      finalTradeBuyPrice: 0,
      finalTradeSellPrice: null,
      finalTradeBalanceAfter: null,
      // Mercados disponíveis
      markets: [
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
        { value: 'frxEURGBP', label: 'EUR/GBP (Euro / Libra)', category: 'Forex Minors' },
        { value: 'frxEURJPY', label: 'EUR/JPY (Euro / Iene)', category: 'Forex Minors' },
        { value: 'frxGBPJPY', label: 'GBP/JPY (Libra / Iene)', category: 'Forex Minors' },
        { value: 'frxAUDCAD', label: 'AUD/CAD (Dólar Australiano / Canadense)', category: 'Forex Minors' },
        { value: 'frxAUDJPY', label: 'AUD/JPY (Dólar Australiano / Iene)', category: 'Forex Minors' },
        { value: 'frxCHFJPY', label: 'CHF/JPY (Franco / Iene)', category: 'Forex Minors' },
        { value: 'frxEURAUD', label: 'EUR/AUD (Euro / Dólar Australiano)', category: 'Forex Minors' },
        { value: 'frxGBPAUD', label: 'GBP/AUD (Libra / Dólar Australiano)', category: 'Forex Minors' },
        { value: 'frxUSDMXN', label: 'USD/MXN (Dólar / Peso Mexicano)', category: 'Forex Exotics' },
        { value: 'frxXAUUSD', label: 'XAU/USD (Ouro / Dólar)', category: 'Metais' },
        { value: 'frxXAGUSD', label: 'XAG/USD (Prata / Dólar)', category: 'Metais' },
        { value: 'frxXPTUSD', label: 'XPT/USD (Platina / Dólar)', category: 'Metais' },
        { value: 'frxXPDUSD', label: 'XPD/USD (Paládio / Dólar)', category: 'Metais' },
      ],
    };
  },
  computed: {
    showPurchasePrice() {
      return this.purchasePrice !== null;
    },
    showRealTimeProfit() {
      return this.realTimeProfit !== null && this.activeContract;
    },
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
      if (!this.localOrderConfig.type) {
        return 'Selecione o tipo';
      }
      return this.localOrderConfig.type === 'CALL' ? 'Alta (CALL)' : 'Baixa (PUT)';
    },
    availableTradeTypes() {
      // Tipos disponíveis baseados no mercado selecionado
      const types = [
        { value: 'CALL', label: 'Alta (CALL)', description: 'Apostar que o preço subirá', icon: 'fas fa-arrow-up' },
        { value: 'PUT', label: 'Baixa (PUT)', description: 'Apostar que o preço descerá', icon: 'fas fa-arrow-down' },
      ];
      return types;
    },
    canUseCallPut() {
      // Verificar se o símbolo suporta CALL/PUT
      // Por enquanto, assumir que todos os símbolos suportam
      return true;
    },
  },
  async mounted() {
    console.log('[Chart] ========== COMPONENTE MONTADO ==========');
    
    // Inicializar gráfico primeiro
    this.initChart();
    
    // Listener de resize
    window.addEventListener('resize', this.handleResize);
    
    // Aguardar gráfico ser inicializado antes de conectar
    await this.$nextTick();
    
    // Aguardar um pouco mais para garantir que o gráfico foi criado
    setTimeout(async () => {
      if (!this.chart || !this.chartSeries) {
        console.warn('[Chart] Gráfico ainda não inicializado, tentando novamente...');
        this.initChart();
        await this.$nextTick();
        setTimeout(() => {
          this.initializeConnection();
        }, 500);
      } else {
        console.log('[Chart] Gráfico inicializado, conectando...');
        await this.initializeConnection();
      }
    }, 1000);
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
    'localOrderConfig.type'() {
      // Quando o tipo de contrato mudar, recarregar valores padrão e proposta
      if (this.isConnected) {
        this.loadDefaultValues();
        setTimeout(() => {
          this.loadProposal();
        }, 500);
      }
    },
    'localOrderConfig.duration'() {
      // Quando a duração mudar, recarregar proposta
      if (this.isConnected && this.localOrderConfig.type) {
        this.loadProposal();
      }
    },
    'localOrderConfig.durationUnit'() {
      // Quando a unidade de duração mudar, recarregar proposta
      if (this.isConnected && this.localOrderConfig.type) {
        this.loadProposal();
      }
    },
    'localOrderConfig.amount'() {
      // Quando o valor mudar, recarregar proposta
      if (this.isConnected && this.localOrderConfig.type) {
        this.loadProposal();
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

          console.log('[Chart] ✅ Gráfico e série criados com sucesso');
          console.log('[Chart] Dimensões:', { width: rect.width, height: rect.height });

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
          console.error('[Chart] ❌ Erro ao inicializar gráfico:', error);
          this.showChartPlaceholder = false;
        }
      });
    },
    async initializeConnection() {
      try {
        console.log('[Chart] ========== INICIANDO CONEXÃO ==========');
        
        // Primeiro, buscar loginid do deriv_connection
        const derivConnection = localStorage.getItem('deriv_connection');
        console.log('[Chart] deriv_connection encontrado:', !!derivConnection);
        if (derivConnection) {
          try {
            const connection = JSON.parse(derivConnection);
            this.loginid = connection.loginid;
            console.log('[Chart] LoginID encontrado em deriv_connection:', this.loginid);
          } catch (e) {
            console.warn('[Chart] Erro ao parsear deriv_connection:', e);
          }
        }
        
        // Buscar token Deriv do localStorage
        // Tentar primeiro deriv_token (token direto)
        this.derivToken = localStorage.getItem('deriv_token');
        console.log('[Chart] deriv_token encontrado:', !!this.derivToken);
        
        // Se não tiver, tentar deriv_tokens_by_loginid (mais comum - PRIMEIRO!)
        if (!this.derivToken) {
          const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid');
          console.log('[Chart] deriv_tokens_by_loginid encontrado:', !!tokensByLoginId);
          if (tokensByLoginId) {
            try {
              const tokens = JSON.parse(tokensByLoginId);
              console.log('[Chart] Tokens parseados, chaves disponíveis:', Object.keys(tokens));
              console.log('[Chart] LoginID atual:', this.loginid);
              
              // Se tiver loginid, buscar token específico
              if (this.loginid && tokens[this.loginid]) {
                this.derivToken = tokens[this.loginid];
                console.log('[Chart] ✅ Token extraído de deriv_tokens_by_loginid para loginid:', this.loginid);
              } else if (Object.keys(tokens).length > 0) {
                // Se não tiver loginid específico, usar o primeiro token disponível
                const firstLoginId = Object.keys(tokens)[0];
                this.derivToken = tokens[firstLoginId];
                this.loginid = firstLoginId;
                console.log('[Chart] ✅ Token extraído de deriv_tokens_by_loginid (primeiro disponível):', firstLoginId);
              } else {
                console.warn('[Chart] deriv_tokens_by_loginid está vazio');
              }
            } catch (e) {
              console.error('[Chart] ❌ Erro ao parsear deriv_tokens_by_loginid:', e);
            }
          } else {
            console.log('[Chart] deriv_tokens_by_loginid não encontrado no localStorage');
          }
        }
        
        // Se ainda não tiver, tentar deriv_connection (objeto com mais informações)
        if (!this.derivToken && derivConnection) {
          try {
            const connection = JSON.parse(derivConnection);
            this.derivToken = connection.token;
            if (!this.loginid) {
              this.loginid = connection.loginid;
            }
            console.log('[Chart] Token extraído de deriv_connection:', !!this.derivToken);
          } catch (e) {
            console.warn('[Chart] Erro ao parsear deriv_connection:', e);
          }
        }
        
        // Se ainda não tiver, tentar derivInfo
        if (!this.derivToken) {
          const storedDerivInfo = localStorage.getItem('derivInfo');
          console.log('[Chart] derivInfo encontrado:', !!storedDerivInfo);
          if (storedDerivInfo) {
            try {
              const derivInfo = JSON.parse(storedDerivInfo);
              this.derivToken = derivInfo.token;
              if (!this.loginid) {
                this.loginid = derivInfo.loginid;
              }
              console.log('[Chart] Token extraído de derivInfo:', !!this.derivToken);
            } catch (e) {
              console.warn('[Chart] Erro ao parsear derivInfo:', e);
            }
          }
        }
        
        console.log('[Chart] ========== RESULTADO FINAL ==========');
        console.log('[Chart] Token encontrado:', !!this.derivToken);
        console.log('[Chart] LoginID encontrado:', this.loginid);

        if (!this.derivToken) {
          console.warn('[Chart] Token Deriv não encontrado no localStorage');
          console.log('[Chart] Redirecionando para tela de conexão...');
          // Redirecionar para tela de conexão
          this.$router.push('/dashboard').catch(err => {
            // Ignorar erro se já estiver na rota
            if (err.name !== 'NavigationDuplicated') {
              console.error('[Chart] Erro ao redirecionar:', err);
            }
          });
          return;
        }

        console.log('[Chart] Conectando ao backend...');
        // Conectar ao backend
        await derivTradingService.connect(this.derivToken, this.loginid);
        this.isConnected = true;
        console.log('[Chart] ✅ Conectado ao backend');

        // Iniciar stream SSE
        console.log('[Chart] Iniciando stream SSE...');
        await derivTradingService.startStream(this.handleSSEMessage.bind(this), this.derivToken);
        console.log('[Chart] ✅ Stream SSE iniciado');

        // Inscrever-se no símbolo (isso vai buscar histórico)
        console.log('[Chart] Inscrevendo-se no símbolo:', this.symbol);
        await derivTradingService.subscribeSymbol(this.symbol, this.derivToken, this.loginid);
        console.log('[Chart] ✅ Inscrito no símbolo');

        // Aguardar um pouco e então buscar ticks
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 2000);
        
        // Carregar valores padrão e proposta após conectar
        setTimeout(() => {
          this.loadDefaultValues();
          setTimeout(() => {
            this.loadProposal();
            this.subscribeToProposal();
          }, 500);
        }, 2500);
      } catch (error) {
        console.error('[Chart] ❌ Erro ao inicializar conexão:', error);
        // Mesmo com erro, tentar buscar ticks
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 2000);
      }
    },
    handleSSEMessage(data) {
      // Processar mensagens SSE
      if (data.type === 'history' && data.data && data.data.ticks) {
        console.log('[Chart] Histórico recebido via SSE:', data.data.ticks.length, 'ticks');
        // Converter ticks para horário de Brasília antes de armazenar
        // Filtrar ticks inválidos antes de processar
        const ticksWithBrasiliaTime = data.data.ticks
          .filter(tick => {
            // Validar que tick existe e tem value e epoch válidos
            if (!tick || typeof tick !== 'object') return false;
            if (tick.value === null || tick.value === undefined) return false;
            if (tick.epoch === null || tick.epoch === undefined) return false;
            
            const value = Number(tick.value);
            const epoch = Number(tick.epoch);
            
            // Validar valores numéricos
            if (isNaN(value) || !isFinite(value) || value <= 0) return false;
            if (isNaN(epoch) || !isFinite(epoch) || epoch <= 0) return false;
            
            return true;
          })
          .map(tick => ({
            value: Number(tick.value),
            epoch: Math.floor(Number(tick.epoch)) - (3 * 60 * 60) // UTC-3
          }));
        // Armazenar ticks para atualização em tempo real
        this.ticks = ticksWithBrasiliaTime;
        this.plotTicks(ticksWithBrasiliaTime);
      } else if (data.type === 'tick' && data.data) {
        // Ticks em tempo real - validar antes de processar
        if (data.data.value === null || data.data.value === undefined || 
            data.data.epoch === null || data.data.epoch === undefined) {
          console.warn('[Chart] Tick com valores null/undefined ignorado:', data.data);
          return;
        }
        
        // Ticks em tempo real - adicionar ao gráfico
        console.log('[Chart] Tick em tempo real recebido:', data.data);
        this.addTickToChart(data.data);
        
        // Atualizar latestTick apenas se os valores forem válidos
        const tickValue = Number(data.data.value);
        const tickEpoch = Math.floor(Number(data.data.epoch)) - (3 * 60 * 60);
        
        if (!isNaN(tickValue) && isFinite(tickValue) && tickValue > 0 &&
            !isNaN(tickEpoch) && isFinite(tickEpoch) && tickEpoch > 0) {
          this.latestTick = {
            value: tickValue,
            epoch: tickEpoch
          };
        }
        // Atualizar P&L em tempo real se houver contrato ativo
        if (this.activeContract && this.purchasePrice) {
          this.updateRealTimeProfit();
        }
        
        // Atualizar linha de entrada se existir
        if (this.entrySpotLine) {
          this.updateEntrySpotLine();
        }
      } else if (data.type === 'proposal' && data.data) {
        console.log('[Chart] Proposta recebida via SSE:', data.data);
        this.processProposal(data.data);
      } else if (data.type === 'buy' && data.data) {
        console.log('[Chart] Compra recebida via SSE:', data.data);
        this.processBuy(data.data);
      } else if (data.type === 'sell' && data.data) {
        console.log('[Chart] Venda recebida via SSE:', data.data);
        this.processSell(data.data);
      } else if (data.type === 'contract' && data.data) {
        console.log('[Chart] Contrato atualizado via SSE:', data.data);
        this.processContract(data.data);
      }
    },
    addTickToChart(tickData) {
      if (!this.chart || !this.chartSeries || !tickData) {
        return;
      }

      // Validação rigorosa ANTES de qualquer processamento
      if (tickData.value === null || tickData.value === undefined) {
        console.warn('[Chart] Tick com value null/undefined ignorado:', tickData);
        return;
      }
      
      if (tickData.epoch === null || tickData.epoch === undefined) {
        console.warn('[Chart] Tick com epoch null/undefined ignorado:', tickData);
        return;
      }

      const value = tickData.value;
      const epoch = tickData.epoch;

      // Validação rigorosa de tipos e valores
      if (
        value === null || 
        value === undefined ||
        !isFinite(Number(value)) || 
        Number(value) <= 0 || 
        isNaN(Number(value)) ||
        epoch === null ||
        epoch === undefined ||
        !isFinite(Number(epoch)) ||
        Number(epoch) <= 0 ||
        isNaN(Number(epoch))
      ) {
        console.warn('[Chart] Tick em tempo real inválido ignorado:', tickData);
        return;
      }

      // Converter epoch para horário de Brasília (UTC-3)
      // O epoch vem em segundos UTC, precisamos subtrair 3 horas (10800 segundos)
      const brasiliaEpoch = Math.floor(Number(epoch)) - (3 * 60 * 60);
      const numValue = Number(value);
      
      // Validação final antes de adicionar
      if (isNaN(brasiliaEpoch) || !isFinite(brasiliaEpoch) || brasiliaEpoch <= 0) {
        console.warn('[Chart] Epoch convertido inválido:', brasiliaEpoch);
        return;
      }
      
      if (isNaN(numValue) || !isFinite(numValue) || numValue <= 0) {
        console.warn('[Chart] Valor convertido inválido:', numValue);
        return;
      }

      // Verificar se o valor está dentro de uma faixa razoável dos valores existentes
      // Isso evita adicionar valores de símbolos diferentes
      if (this.ticks.length > 0) {
        const existingValues = this.ticks
          .map(t => t.value)
          .filter(v => v !== null && v !== undefined && isFinite(v) && v > 0);
        
        if (existingValues.length > 0) {
          const medianExisting = [...existingValues].sort((a, b) => a - b)[Math.floor(existingValues.length / 2)];
          
          // Se o novo valor estiver muito fora da faixa (mais de 5x da mediana), ignorar
          if (medianExisting > 0 && (numValue < medianExisting / 5 || numValue > medianExisting * 5)) {
            console.warn('[Chart] ⚠️ Tick em tempo real ignorado - valor muito diferente do símbolo atual:', {
              novoValor: numValue,
              medianaExistente: medianExisting,
              razao: numValue / medianExisting
            });
            return;
          }
        }
      }

      // Adicionar ao array de ticks
      this.ticks.push({ value: numValue, epoch: brasiliaEpoch });
      
      // Manter apenas últimos 100 ticks
      if (this.ticks.length > 100) {
        this.ticks.shift();
      }

      // Adicionar ao gráfico usando update() para atualização incremental
      try {
        // Validar novamente antes de passar para o gráfico
        if (brasiliaEpoch === null || brasiliaEpoch === undefined || isNaN(brasiliaEpoch) || !isFinite(brasiliaEpoch) || brasiliaEpoch <= 0) {
          console.warn('[Chart] Epoch inválido antes de update:', brasiliaEpoch);
          return;
        }
        
        if (numValue === null || numValue === undefined || isNaN(numValue) || !isFinite(numValue) || numValue <= 0) {
          console.warn('[Chart] Valor inválido antes de update:', numValue);
          return;
        }
        
        this.chartSeries.update({
          time: brasiliaEpoch,
          value: numValue
        });
        console.log('[Chart] ✅ Tick em tempo real adicionado ao gráfico:', { time: brasiliaEpoch, value: numValue });
      } catch (error) {
        console.error('[Chart] ❌ Erro ao adicionar tick em tempo real:', error, { time: brasiliaEpoch, value: numValue });
      }
    },
    async loadTicksFromBackend() {
      // Verificar se o gráfico está inicializado
      if (!this.chart || !this.chartSeries) {
        console.warn('[Chart] Gráfico não inicializado, aguardando...');
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 500);
        return;
      }

      if (this.isLoadingTicks) {
        console.log('[Chart] Já está carregando ticks, ignorando...');
        return;
      }

      this.isLoadingTicks = true;
      this.showChartPlaceholder = true;

      try {
        console.log('[Chart] ========== BUSCANDO TICKS ==========');
        console.log('[Chart] Símbolo:', this.symbol);
        console.log('[Chart] Gráfico inicializado:', !!this.chart);
        console.log('[Chart] Série inicializada:', !!this.chartSeries);
        
        const response = await derivTradingService.getTicks(this.symbol);
        console.log('[Chart] Resposta do backend:', response);
        
        if (!response || !response.ticks || !Array.isArray(response.ticks)) {
          console.warn('[Chart] Resposta inválida do backend:', response);
          // Tentar novamente após 3 segundos
          setTimeout(() => {
            this.isLoadingTicks = false;
            this.loadTicksFromBackend();
          }, 3000);
          return;
        }

        const ticks = response.ticks;
        console.log('[Chart] Ticks recebidos:', ticks.length);

        if (ticks.length === 0) {
          console.warn('[Chart] Nenhum tick recebido do backend, tentando novamente em 3 segundos...');
          // Tentar novamente após 3 segundos (máximo 3 tentativas)
          if (!this.retryCount) this.retryCount = 0;
          this.retryCount++;
          
          if (this.retryCount < 3) {
            setTimeout(() => {
              this.isLoadingTicks = false;
              this.loadTicksFromBackend();
            }, 3000);
          } else {
            console.error('[Chart] Máximo de tentativas atingido, parando...');
            this.showChartPlaceholder = false;
            this.isLoadingTicks = false;
            this.retryCount = 0;
          }
          return;
        }

        // Resetar contador de tentativas
        this.retryCount = 0;

        // Converter ticks para horário de Brasília antes de armazenar
        const ticksWithBrasiliaTime = ticks.map(tick => ({
          value: tick.value,
          epoch: Math.floor(Number(tick.epoch)) - (3 * 60 * 60) // UTC-3
        }));
        
        // Armazenar ticks para atualização em tempo real
        this.ticks = ticksWithBrasiliaTime;

        // Plotar os ticks
        this.plotTicks(ticksWithBrasiliaTime);
      } catch (error) {
        console.error('[Chart] ❌ Erro ao carregar ticks do backend:', error);
        console.error('[Chart] Erro completo:', error.message, error.stack);
        
        // Tentar novamente após 3 segundos (máximo 2 tentativas)
        if (!this.errorRetryCount) this.errorRetryCount = 0;
        this.errorRetryCount++;
        
        if (this.errorRetryCount < 2) {
          setTimeout(() => {
            this.isLoadingTicks = false;
            this.loadTicksFromBackend();
          }, 3000);
        } else {
          console.error('[Chart] Máximo de tentativas com erro atingido');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          this.errorRetryCount = 0;
        }
      } finally {
        // Não resetar isLoadingTicks aqui se ainda estiver tentando
        if (!this.retryCount && !this.errorRetryCount) {
          this.isLoadingTicks = false;
        }
      }
    },
    plotTicks(ticks) {
      console.log('[Chart] ========== PLOTANDO TICKS ==========');
      console.log('[Chart] Gráfico existe:', !!this.chart);
      console.log('[Chart] Série existe:', !!this.chartSeries);
      console.log('[Chart] Ticks recebidos:', ticks ? ticks.length : 0);
      
      if (!this.chart || !this.chartSeries) {
        console.error('[Chart] ❌ Gráfico ou série não inicializados');
        return;
      }
      
      if (!ticks || !Array.isArray(ticks)) {
        console.error('[Chart] ❌ Ticks inválidos:', ticks);
        this.showChartPlaceholder = false;
        return;
      }

      // Limpar dados anteriores da série ANTES de processar novos dados
      try {
        // Remover todos os dados da série atual
        this.chartSeries.setData([]);
        console.log('[Chart] ✅ Dados anteriores limpos');
      } catch (error) {
        console.warn('[Chart] Aviso ao limpar dados anteriores:', error);
      }

      // Converter ticks para formato TradingView
      // Limitar aos últimos 100 ticks
      let ticksToUse = ticks.slice(-100);
      
      // Verificar se todos os ticks são do mesmo símbolo (valores similares)
      // Se houver valores muito diferentes, pode ser mistura de símbolos
      const tickValues = ticksToUse
        .map(t => {
          if (!t || typeof t !== 'object') return null;
          if (t.value === null || t.value === undefined) return null;
          const val = Number(t.value);
          if (isNaN(val) || !isFinite(val) || val <= 0) return null;
          return val;
        })
        .filter(v => v !== null);
      
      if (tickValues.length === 0) {
        console.warn('[Chart] Nenhum valor válido encontrado nos ticks');
        this.showChartPlaceholder = false;
        this.isLoadingTicks = false;
        return;
      }
      
      // Detectar e filtrar valores de símbolos diferentes
      const minVal = Math.min(...tickValues);
      const maxVal = Math.max(...tickValues);
      
      if (minVal > 0 && (maxVal / minVal) > 10) {
        console.warn('[Chart] ⚠️ Valores muito diferentes detectados - possível mistura de símbolos:', {
          min: minVal,
          max: maxVal,
          ratio: maxVal / minVal
        });
        
        // Agrupar valores por faixa para identificar o símbolo mais comum
        const sortedValues = [...tickValues].sort((a, b) => a - b);
        const median = sortedValues[Math.floor(sortedValues.length / 2)];
        
        // Usar apenas valores que estão próximos da mediana (dentro de 2x)
        // Isso garante que mantemos apenas um símbolo
        const filteredTicks = ticksToUse.filter(tick => {
          if (!tick || typeof tick !== 'object') return false;
          if (tick.value === null || tick.value === undefined) return false;
          const val = Number(tick.value);
          if (isNaN(val) || !isFinite(val) || val <= 0) return false;
          // Manter apenas valores dentro de 2x da mediana (mais rigoroso)
          return val >= median / 2 && val <= median * 2;
        });
        
        if (filteredTicks.length > 0) {
          console.log('[Chart] Ticks filtrados:', filteredTicks.length, 'de', ticksToUse.length);
          ticksToUse = filteredTicks;
        } else {
          // Se o filtro removeu tudo, usar apenas valores próximos da mediana
          const medianTicks = ticksToUse.filter(tick => {
            if (!tick || typeof tick !== 'object') return false;
            if (tick.value === null || tick.value === undefined) return false;
            const val = Number(tick.value);
            if (isNaN(val) || !isFinite(val) || val <= 0) return false;
            return Math.abs(val - median) / median < 0.5; // Dentro de 50% da mediana
          });
          if (medianTicks.length > 0) {
            ticksToUse = medianTicks;
            console.log('[Chart] Usando apenas ticks próximos da mediana:', medianTicks.length);
          }
        }
      }
      
      const chartData = ticksToUse
        .map(tick => {
          // Validar dados básicos
          if (!tick || typeof tick !== 'object') {
            return null;
          }
          
          // Validar null/undefined ANTES de processar
          if (tick.value === null || tick.value === undefined) {
            return null;
          }
          
          if (tick.epoch === null || tick.epoch === undefined) {
            return null;
          }
          
          const value = tick.value;
          const epoch = tick.epoch;
          
          // Validação rigorosa de tipos e valores
          if (
            value === null || 
            value === undefined ||
            !isFinite(Number(value)) || 
            Number(value) <= 0 || 
            isNaN(Number(value)) ||
            epoch === null ||
            epoch === undefined ||
            !isFinite(Number(epoch)) ||
            Number(epoch) <= 0 ||
            isNaN(Number(epoch))
          ) {
            return null;
          }
          
          // Converter epoch para horário de Brasília (UTC-3)
          // O epoch vem em segundos UTC, precisamos subtrair 3 horas (10800 segundos)
          const brasiliaEpoch = Math.floor(Number(epoch)) - (3 * 60 * 60);
          const numValue = Number(value);
          
          // Validação final após conversão
          if (isNaN(brasiliaEpoch) || !isFinite(brasiliaEpoch) || brasiliaEpoch <= 0) {
            return null;
          }
          
          if (isNaN(numValue) || !isFinite(numValue) || numValue <= 0) {
            return null;
          }
          
          return {
            time: brasiliaEpoch,
            value: numValue
          };
        })
        .filter(item => item !== null && item !== undefined);

        if (chartData.length === 0) {
          console.warn('[Chart] Nenhum tick válido após validação');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }

        // Ordenar por tempo
        chartData.sort((a, b) => a.time - b.time);

        // Validação final antes de setar dados - garantir que não há nulls
        let finalChartData = chartData.filter(item => {
          if (!item || item === null || item === undefined) {
            return false;
          }
          if (item.time === null || item.time === undefined || isNaN(item.time) || !isFinite(item.time) || item.time <= 0) {
            return false;
          }
          if (item.value === null || item.value === undefined || isNaN(item.value) || !isFinite(item.value) || item.value <= 0) {
            return false;
          }
          return true;
        });
        
        if (finalChartData.length === 0) {
          console.warn('[Chart] Nenhum dado válido após validação final');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        // Verificar se há valores muito diferentes (possível mistura de símbolos)
        const chartValues = finalChartData.map(d => d.value).filter(v => v !== null && v !== undefined && isFinite(v) && v > 0);
        
        if (chartValues.length === 0) {
          console.warn('[Chart] Nenhum valor válido após validação');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        const minValue = Math.min(...chartValues);
        const maxValue = Math.max(...chartValues);
        const avgValue = chartValues.reduce((a, b) => a + b, 0) / chartValues.length;
        const medianValue = [...chartValues].sort((a, b) => a - b)[Math.floor(chartValues.length / 2)];
        
        // Se a variação for muito grande (mais de 5x), filtrar valores outliers
        if (minValue > 0 && medianValue > 0 && (maxValue / minValue) > 5) {
          console.warn('[Chart] ⚠️ Valores muito diferentes detectados - possível mistura de símbolos:', {
            min: minValue,
            max: maxValue,
            median: medianValue,
            ratio: maxValue / minValue
          });
          
          // Usar mediana como referência (mais robusta que média)
          // Manter apenas valores dentro de 2x da mediana
          const filteredData = finalChartData.filter(item => {
            if (!item || item.value === null || item.value === undefined) return false;
            const val = Number(item.value);
            if (isNaN(val) || !isFinite(val) || val <= 0) return false;
            // Manter apenas valores dentro de 2x da mediana
            return val >= medianValue / 2 && val <= medianValue * 2;
          });
          
          if (filteredData.length > 0) {
            console.log('[Chart] Dados filtrados por mediana:', filteredData.length, 'de', finalChartData.length);
            finalChartData = filteredData;
            
            // Recalcular valores após filtro
            const newValues = filteredData.map(d => d.value).filter(v => v !== null && v !== undefined && isFinite(v) && v > 0);
            if (newValues.length > 0) {
              const newMin = Math.min(...newValues);
              const newMax = Math.max(...newValues);
              const newAvg = newValues.reduce((a, b) => a + b, 0) / newValues.length;
              console.log('[Chart] Após filtro - min:', newMin, 'max:', newMax, 'avg:', newAvg.toFixed(2));
            }
          }
        }
        
        console.log('[Chart] Plotando', finalChartData.length, 'ticks no gráfico');
        console.log('[Chart] Primeiro tick:', finalChartData[0]);
        console.log('[Chart] Último tick:', finalChartData[finalChartData.length - 1]);
        console.log('[Chart] Range de valores:', { min: minValue, max: maxValue, avg: avgValue.toFixed(2) });

        // Validação final individual de cada item antes de passar para o gráfico
        const validatedData = finalChartData.filter(item => {
          // Verificar se o item existe e não é null/undefined
          if (!item || item === null || item === undefined) {
            return false;
          }
          
          // Verificar time
          if (item.time === null || item.time === undefined) {
            return false;
          }
          const timeNum = Number(item.time);
          if (isNaN(timeNum) || !isFinite(timeNum) || timeNum <= 0) {
            return false;
          }
          
          // Verificar value
          if (item.value === null || item.value === undefined) {
            return false;
          }
          const valueNum = Number(item.value);
          if (isNaN(valueNum) || !isFinite(valueNum) || valueNum <= 0) {
            return false;
          }
          
          // Garantir que os valores são números válidos
          item.time = timeNum;
          item.value = valueNum;
          
          return true;
        });
        
        if (validatedData.length === 0) {
          console.warn('[Chart] Nenhum dado válido após validação individual');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        // Atualizar gráfico com try-catch robusto
        try {
          // Limpar série novamente antes de adicionar novos dados
          this.chartSeries.setData([]);
          
          // Adicionar novos dados validados
          this.chartSeries.setData(validatedData);
          console.log('[Chart] ✅ Dados setados na série:', validatedData.length, 'pontos válidos');
        } catch (error) {
          console.error('[Chart] ❌ Erro ao setar dados:', error);
          console.error('[Chart] Dados que causaram erro:', finalChartData.slice(0, 5));
          
          // Tentar recriar a série se houver erro
          try {
            if (this.chartSeries) {
              this.chart.removeSeries(this.chartSeries);
            }
            this.chartSeries = this.chart.addLineSeries({
              color: '#22C55E',
              lineWidth: 2,
              priceLineVisible: false,
              lastValueVisible: true,
            });
            this.chartSeries.setData(validatedData);
            console.log('[Chart] ✅ Série recriada e dados setados');
          } catch (recreateError) {
            console.error('[Chart] ❌ Erro ao recriar série:', recreateError);
          }
          
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        // Ajustar viewport para mostrar todos os dados
        try {
          this.chart.timeScale().fitContent();
          console.log('[Chart] ✅ Viewport ajustado');
        } catch (error) {
          console.warn('[Chart] Erro ao ajustar viewport:', error);
        }
        
        // Ocultar placeholder
        this.showChartPlaceholder = false;
        this.isLoadingTicks = false;
        console.log('[Chart] ✅ Gráfico atualizado com sucesso');
        console.log('[Chart] Placeholder oculto:', !this.showChartPlaceholder);
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
        
        // Carregar valores padrão e proposta para o novo símbolo
        setTimeout(() => {
          this.loadDefaultValues();
          setTimeout(() => {
            this.loadProposal();
            this.subscribeToProposal();
          }, 500);
        }, 2000);
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
    async executeBuy() {
      console.log('[Chart] ========== EXECUTAR COMPRA CHAMADO ==========');
      
      if (!this.isConnected) {
        this.tradeError = 'Conecte-se à Deriv antes de operar.';
        return;
      }
      
      if (this.isTrading || this.activeContract) {
        console.warn('[Chart] Operação já em andamento');
        return;
      }
      
      if (!this.localOrderConfig.type) {
        this.tradeError = 'Selecione o tipo de negociação (CALL ou PUT).';
        return;
      }
      
      // Capturar o preço de compra no momento do envio da requisição
      if (this.latestTick && this.latestTick.value) {
        this.purchasePrice = this.latestTick.value;
      }
      
      this.tradeError = '';
      this.tradeMessage = '';
      this.isTrading = true;
      
      console.log('[Chart] ========== EXECUTAR COMPRA ==========');
      console.log('[Chart] Configuração:', this.localOrderConfig);
      
      try {
        // Enviar toda a configuração para o backend processar
        await derivTradingService.buyContract({
          symbol: this.symbol,
          contractType: this.localOrderConfig.type,
          duration: this.localOrderConfig.duration,
          durationUnit: this.localOrderConfig.durationUnit,
          amount: this.localOrderConfig.amount,
          proposalId: this.currentProposalId, // Opcional, backend busca se não fornecido
        });
        console.log('[Chart] ✅ Compra executada via backend');
        // A resposta chegará via SSE no evento 'buy'
      } catch (error) {
        console.error('[Chart] Erro ao executar compra:', error);
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
      
      console.log('[Chart] ========== EXECUTANDO VENDA ==========');
      console.log('[Chart] ContractId:', this.activeContract.contract_id);
      
      try {
        // Backend determina o preço automaticamente
        await derivTradingService.sellContract(this.activeContract.contract_id);
        console.log('[Chart] ✅ Venda executada via backend');
        // A resposta chegará via SSE no evento 'sell'
      } catch (error) {
        console.error('[Chart] Erro ao executar venda:', error);
        this.tradeError = error.message || 'Erro ao executar venda';
        this.isTrading = false;
      }
    },
    processProposal(proposalData) {
      console.log('[Chart] ========== PROCESSANDO PROPOSTA ==========');
      console.log('[Chart] Dados da proposta:', proposalData);
      
      if (!proposalData || !proposalData.id) {
        console.warn('[Chart] Proposta inválida');
        return;
      }
      
      // Armazenar ID e preço da proposta
      this.currentProposalId = proposalData.id;
      this.currentProposalPrice = Number(proposalData.askPrice || proposalData.ask_price || 0);
      
      console.log('[Chart] ✅ Proposta processada:', {
        proposalId: this.currentProposalId,
        proposalPrice: this.currentProposalPrice
      });
    },
    processBuy(buyData) {
      console.log('[Chart] ========== PROCESSANDO COMPRA ==========');
      console.log('[Chart] Dados da compra:', buyData);
      
      if (!buyData || !buyData.contract_id) {
        console.error('[Chart] Dados de compra inválidos');
        this.tradeError = 'Erro ao processar compra.';
        this.isTrading = false;
        return;
      }
      
      // Criar objeto de contrato ativo
      this.activeContract = {
        contract_id: buyData.contract_id,
        buy_price: buyData.buy_price || this.currentProposalPrice,
        entry_spot: buyData.entry_spot || this.purchasePrice,
        entry_time: buyData.entry_time || Date.now() / 1000,
        contract_type: buyData.contract_type || this.localOrderConfig.type,
        duration: buyData.duration || this.localOrderConfig.duration,
        duration_unit: buyData.duration_unit || this.localOrderConfig.durationUnit,
        symbol: buyData.symbol || this.symbol,
        sell_price: buyData.sell_price || null,
        profit: buyData.profit || null,
      };
      
      // Adicionar linha de compra no gráfico
      if (this.activeContract.entry_spot) {
        const entryTime = this.activeContract.entry_time || (Date.now() / 1000);
        this.addEntrySpotLine(this.activeContract.entry_spot, entryTime);
      }
      
      this.isTrading = false;
      this.tradeMessage = 'Compra executada com sucesso!';
      this.isSellEnabled = true;
      
      console.log('[Chart] ✅ Compra processada com sucesso:', this.activeContract);
    },
    processSell(sellData) {
      console.log('[Chart] ========== PROCESSANDO VENDA ==========');
      console.log('[Chart] Dados da venda:', sellData);
      
      if (!sellData) {
        console.error('[Chart] Dados de venda inválidos');
        this.tradeError = 'Erro ao processar venda.';
        this.isTrading = false;
        return;
      }
      
      // Calcular lucro final
      const finalProfit = sellData.profit !== undefined && sellData.profit !== null 
        ? Number(sellData.profit) 
        : (this.realTimeProfit !== null ? this.realTimeProfit : 0);
      
      // Atualizar contrato com dados da venda
      if (this.activeContract) {
        this.activeContract.sell_price = sellData.sell_price || this.activeContract.sell_price;
        this.activeContract.profit = finalProfit;
        this.activeContract.exit_spot = sellData.exit_spot || null;
        this.activeContract.exit_time = sellData.exit_time || Date.now() / 1000;
        
        // Preparar dados para o modal
        this.finalTradeProfit = finalProfit;
        this.finalTradeType = this.activeContract.contract_type || 'CALL';
        this.finalTradeBuyPrice = this.activeContract.buy_price || this.purchasePrice || 0;
        this.finalTradeSellPrice = sellData.sell_price ? Number(sellData.sell_price) : null;
        this.finalTradeBalanceAfter = sellData.balance_after ? Number(sellData.balance_after) : null;
      }
      
      // Remover linha de compra
      this.removeEntrySpotLine();
      
      // Emitir evento para atualizar histórico
      this.$emit('trade-result', {
        contractId: this.activeContract?.contract_id,
        buyPrice: this.activeContract?.buy_price || this.purchasePrice,
        sellPrice: sellData.sell_price ? Number(sellData.sell_price) : null,
        profit: finalProfit,
        balanceAfter: sellData.balance_after ? Number(sellData.balance_after) : null,
        currency: 'USD',
        direction: this.activeContract?.contract_type,
        status: 'CLOSED',
      });
      
      // Limpar contrato ativo após um delay
      setTimeout(() => {
        this.activeContract = null;
        this.purchasePrice = null;
        this.realTimeProfit = null;
        this.isSellEnabled = false;
      }, 3000);
      
      this.isTrading = false;
      this.tradeMessage = `Venda executada com sucesso! P&L: $${finalProfit.toFixed(this.pricePrecision)}`;
      
      // Mostrar modal de resultado
      this.showTradeResultModal = true;
      
      console.log('[Chart] ✅ Venda processada com sucesso');
    },
    openMarketModal() {
      this.showMarketModal = true;
    },
    closeMarketModal() {
      this.showMarketModal = false;
    },
    selectMarket(marketValue) {
      this.symbol = marketValue;
      this.closeMarketModal();
      // Disparar mudança de símbolo
      if (this.isConnected) {
        this.handleSymbolChange();
      }
    },
    openTradeTypeModal() {
      if (!this.symbol) {
        this.tradeError = 'Selecione um mercado primeiro';
        return;
      }
      this.showTradeTypeModal = true;
    },
    closeTradeTypeModal() {
      this.showTradeTypeModal = false;
    },
    selectTradeType(type) {
      this.localOrderConfig.type = type;
      this.closeTradeTypeModal();
      // Recarregar proposta com novo tipo
      if (this.isConnected) {
        this.loadProposal();
      }
    },
    closeTradeResultModal() {
      this.showTradeResultModal = false;
      // Reiniciar subscription de proposal após fechar o modal
      setTimeout(() => {
        if (!this.activeContract && !this.isTrading && this.isConnected) {
          this.subscribeToProposal();
        }
      }, 500);
    },
    processContract(contractData) {
      console.log('[Chart] ========== PROCESSANDO ATUALIZAÇÃO DE CONTRATO ==========');
      console.log('[Chart] Dados do contrato:', contractData);
      
      if (!this.activeContract) {
        return;
      }
      
      // Atualizar dados do contrato ativo
      if (contractData.sell_price !== undefined) {
        this.activeContract.sell_price = contractData.sell_price;
      }
      if (contractData.profit !== undefined) {
        this.activeContract.profit = contractData.profit;
      }
      if (contractData.is_sold !== undefined) {
        this.isSellEnabled = !contractData.is_sold;
      }
      
      // Atualizar P&L em tempo real
      this.updateRealTimeProfit();
    },
    addEntrySpotLine(entrySpot, entryTime) {
      if (!this.chart || !entrySpot) {
        console.warn('[Chart] Não é possível adicionar linha de entrada: chart ou entrySpot não disponível');
        return;
      }
      
      try {
        // Remover linha anterior se existir
        this.removeEntrySpotLine();
        
        const entryColor = '#94a3b8'; // Cinza para linha de referência
        const entryTimeUnix = Math.floor(Number(entryTime)) - (3 * 60 * 60); // Converter para horário de Brasília
        
        console.log('[Chart] Adicionando linha de entrada:', {
          entrySpot,
          entryTime: entryTimeUnix,
          entryTimeDate: new Date(entryTimeUnix * 1000).toISOString()
        });
        
        // Criar linha horizontal no gráfico
        const lineSeries = this.chart.addLineSeries({
          color: entryColor,
          lineWidth: 2,
          lineStyle: 2, // Linha pontilhada (dashed)
          axisLabelVisible: true,
          title: `Preço de Compra: ${entrySpot.toFixed(this.pricePrecision)}`,
          priceLineVisible: true,
          lastValueVisible: true,
        });
        
        // Validar entrySpot antes de usar
        if (entrySpot === null || entrySpot === undefined || isNaN(Number(entrySpot)) || !isFinite(Number(entrySpot)) || Number(entrySpot) <= 0) {
          console.error('[Chart] EntrySpot inválido para linha de entrada:', entrySpot);
          return;
        }
        
        const validEntrySpot = Number(entrySpot);
        
        // Obter o primeiro e último tick para criar uma linha que ocupe 100% da largura
        const firstTick = this.ticks && this.ticks.length > 0 ? this.ticks[0] : null;
        const lastTick = this.ticks && this.ticks.length > 0 ? this.ticks[this.ticks.length - 1] : null;
        
        // Validar e calcular tempos
        let lineStartTime = entryTimeUnix;
        let lineEndTime = entryTimeUnix;
        
        if (firstTick && firstTick.epoch !== null && firstTick.epoch !== undefined) {
          const firstEpoch = Math.floor(Number(firstTick.epoch));
          if (!isNaN(firstEpoch) && isFinite(firstEpoch) && firstEpoch > 0) {
            lineStartTime = firstEpoch;
          }
        }
        
        if (lastTick && lastTick.epoch !== null && lastTick.epoch !== undefined) {
          const lastEpoch = Math.floor(Number(lastTick.epoch));
          if (!isNaN(lastEpoch) && isFinite(lastEpoch) && lastEpoch > 0) {
            lineEndTime = lastEpoch;
          }
        }
        
        // Validar tempos finais
        if (isNaN(lineStartTime) || !isFinite(lineStartTime) || lineStartTime <= 0) {
          console.error('[Chart] LineStartTime inválido:', lineStartTime);
          return;
        }
        
        if (isNaN(lineEndTime) || !isFinite(lineEndTime) || lineEndTime <= 0) {
          console.error('[Chart] LineEndTime inválido:', lineEndTime);
          return;
        }
        
        // Criar dois pontos: um no início do gráfico e outro no final
        // Isso cria uma linha horizontal pontilhada que ocupa 100% da largura
        lineSeries.setData([
          { time: lineStartTime, value: validEntrySpot },
          { time: lineEndTime, value: validEntrySpot }
        ]);
        this.entrySpotLine = lineSeries;
        
        // Atualizar linha quando novos ticks chegarem
        this.updateEntrySpotLine();
        
        console.log('[Chart] ✅ Linha de entrada adicionada ao gráfico');
      } catch (error) {
        console.error('[Chart] Erro ao adicionar linha de entrada:', error);
      }
    },
    removeEntrySpotLine() {
      if (this.entrySpotLine) {
        try {
          this.chart.removeSeries(this.entrySpotLine);
          this.entrySpotLine = null;
          console.log('[Chart] ✅ Linha de entrada removida');
        } catch (error) {
          console.error('[Chart] Erro ao remover linha de entrada:', error);
        }
      }
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
        // CALL: lucro se o preço subir
        profit = currentPrice - entryPrice;
      } else if (this.activeContract.contract_type === 'PUT') {
        // PUT: lucro se o preço descer
        profit = entryPrice - currentPrice;
      }
      
      // Aplicar multiplicador se houver
      if (this.localOrderConfig.multiplier) {
        profit = profit * this.localOrderConfig.multiplier;
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
    async loadDefaultValues() {
      if (!this.isConnected || !this.localOrderConfig.type) {
        return;
      }
      
      try {
        const defaultValues = await derivTradingService.getDefaultValues(
          this.symbol,
          this.localOrderConfig.type
        );
        
        // Atualizar valores padrão se não estiverem configurados
        if (defaultValues.amount && !this.localOrderConfig.amount) {
          this.localOrderConfig.amount = defaultValues.amount;
        }
        if (defaultValues.duration && !this.localOrderConfig.duration) {
          this.localOrderConfig.duration = defaultValues.duration;
        }
        if (defaultValues.durationUnit && !this.localOrderConfig.durationUnit) {
          this.localOrderConfig.durationUnit = defaultValues.durationUnit;
        }
        
        console.log('[Chart] ✅ Valores padrão carregados:', defaultValues);
      } catch (error) {
        console.error('[Chart] Erro ao carregar valores padrão:', error);
      }
    },
    async loadProposal() {
      if (!this.isConnected || !this.localOrderConfig.type) {
        return;
      }
      
      try {
        const proposal = await derivTradingService.getProposal({
          symbol: this.symbol,
          contractType: this.localOrderConfig.type,
          duration: this.localOrderConfig.duration,
          durationUnit: this.localOrderConfig.durationUnit,
          amount: this.localOrderConfig.amount,
        });
        
        // Atualizar proposta atual
        this.currentProposalId = proposal.id;
        this.currentProposalPrice = proposal.askPrice;
        
        console.log('[Chart] ✅ Proposta carregada:', proposal);
      } catch (error) {
        console.error('[Chart] Erro ao carregar proposta:', error);
      }
    },
    async subscribeToProposal() {
      if (!this.isConnected || !this.derivToken || !this.localOrderConfig.type) {
        return;
      }
      
      try {
        const proposalOptions = {
          proposal: 1,
          amount: this.localOrderConfig.amount || 10,
          basis: 'stake',
          contract_type: this.localOrderConfig.type,
          currency: 'USD',
          duration: this.localOrderConfig.duration || 1,
          duration_unit: this.localOrderConfig.durationUnit || 'm',
          symbol: this.symbol,
        };
        
        await derivTradingService.subscribeProposal(proposalOptions, this.derivToken);
        console.log('[Chart] ✅ Inscrito em proposta');
      } catch (error) {
        console.error('[Chart] Erro ao inscrever-se em proposta:', error);
      }
    },
    updateEntrySpotLine() {
      if (!this.entrySpotLine || !this.activeContract || !this.ticks || this.ticks.length === 0) {
        return;
      }
      
      try {
        const firstTick = this.ticks[0];
        const lastTick = this.ticks[this.ticks.length - 1];
        const entrySpot = this.activeContract.entry_spot || this.purchasePrice;
        
        // Validar entrySpot
        if (entrySpot === null || entrySpot === undefined || isNaN(Number(entrySpot)) || !isFinite(Number(entrySpot)) || Number(entrySpot) <= 0) {
          console.warn('[Chart] EntrySpot inválido ao atualizar linha:', entrySpot);
          return;
        }
        
        const validEntrySpot = Number(entrySpot);
        
        // Validar ticks
        if (!firstTick || !lastTick) {
          return;
        }
        
        if (firstTick.epoch === null || firstTick.epoch === undefined || 
            lastTick.epoch === null || lastTick.epoch === undefined) {
          return;
        }
        
        const lineStartTime = Math.floor(Number(firstTick.epoch));
        const lineEndTime = Math.floor(Number(lastTick.epoch));
        
        // Validar tempos
        if (isNaN(lineStartTime) || !isFinite(lineStartTime) || lineStartTime <= 0) {
          console.warn('[Chart] LineStartTime inválido:', lineStartTime);
          return;
        }
        
        if (isNaN(lineEndTime) || !isFinite(lineEndTime) || lineEndTime <= 0) {
          console.warn('[Chart] LineEndTime inválido:', lineEndTime);
          return;
        }
        
        this.entrySpotLine.setData([
          { time: lineStartTime, value: validEntrySpot },
          { time: lineEndTime, value: validEntrySpot }
        ]);
      } catch (error) {
        console.error('[Chart] Erro ao atualizar linha de entrada:', error);
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
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  padding: 0;
  min-width: 480px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.market-item:hover {
  background: rgba(255, 255, 255, 0.06);
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
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
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
  background: rgba(255, 255, 255, 0.06);
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

/* Contract Tracking Panel */
.contract-tracking-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.tracking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tracking-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.contract-status {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-call {
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-put {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.tracking-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tracking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.tracking-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.tracking-value {
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
}

.tracking-value.profit {
  color: #22C55E;
}

.tracking-value.loss {
  color: #ef4444;
}

/* Last Orders Section */
.last-orders-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.last-orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.last-orders-title {
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.order-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-symbol {
  font-size: 12px;
  font-weight: 600;
  color: #f8fafc;
}

.order-type {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.order-type.call {
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
}

.order-type.put {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.order-details {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.order-profit {
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
}

.order-profit.positive {
  color: #22C55E;
}

.order-profit.negative {
  color: #ef4444;
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
