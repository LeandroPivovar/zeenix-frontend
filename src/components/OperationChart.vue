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
        <div class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden flex flex-col shadow-[0_0_8px_rgba(0,0,0,0.25)] chart-container w-full chart-card h-full">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] flex-shrink-0">
            <h3 class="text-base font-semibold text-zenix-text">Gráfico</h3>
            <!-- Funções acima do gráfico -->
            <div class="flex items-center gap-2">
              <button 
                @click="showFunctionAlert('Análise Técnica')"
                class="p-2 rounded-lg bg-zenix-bg border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group"
                title="Análise Técnica"
              >
                <i class="fas fa-chart-area text-zenix-secondary group-hover:text-zenix-green text-sm transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Indicadores')"
                class="p-2 rounded-lg bg-zenix-bg border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group"
                title="Indicadores"
              >
                <i class="fas fa-chart-line text-zenix-secondary group-hover:text-zenix-green text-sm transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Padrões Gráficos')"
                class="p-2 rounded-lg bg-zenix-bg border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group"
                title="Padrões Gráficos"
              >
                <i class="fas fa-shapes text-zenix-secondary group-hover:text-zenix-green text-sm transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Histórico')"
                class="p-2 rounded-lg bg-zenix-bg border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group"
                title="Histórico"
              >
                <i class="fas fa-history text-zenix-secondary group-hover:text-zenix-green text-sm transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Exportar Dados')"
                class="p-2 rounded-lg bg-zenix-bg border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group"
                title="Exportar Dados"
              >
                <i class="fas fa-download text-zenix-secondary group-hover:text-zenix-green text-sm transition-colors"></i>
              </button>
            </div>
          </div>

          <div class="flex flex-1 min-h-0 relative" style="height: 100%; flex: 1 1 0;">
            <!-- Barra lateral de funções à esquerda do gráfico -->
            <div class="w-12 bg-zenix-bg border-r border-zenix-border flex flex-col items-center py-3 gap-2 flex-shrink-0">
              <button 
                @click="showFunctionAlert('Desenhar Linha')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Desenhar Linha"
              >
                <i class="fas fa-pencil-alt text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Régua')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Régua"
              >
                <i class="fas fa-ruler text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Retângulo')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Retângulo"
              >
                <i class="fas fa-square text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Círculo')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Círculo"
              >
                <i class="fas fa-circle text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <div class="w-8 h-px bg-zenix-border my-1"></div>
              <button 
                @click="showFunctionAlert('Zoom In')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Zoom In"
              >
                <i class="fas fa-search-plus text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Zoom Out')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Zoom Out"
              >
                <i class="fas fa-search-minus text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Resetar Zoom')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Resetar Zoom"
              >
                <i class="fas fa-compress-arrows-alt text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <div class="w-8 h-px bg-zenix-border my-1"></div>
              <button 
                @click="showFunctionAlert('Alertas de Preço')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Alertas de Preço"
              >
                <i class="fas fa-bell text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Configurações do Gráfico')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Configurações"
              >
                <i class="fas fa-cog text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
              <button 
                @click="showFunctionAlert('Tela Cheia')"
                class="p-2.5 rounded-lg bg-zenix-card border border-zenix-border hover:border-zenix-green hover:bg-zenix-green/10 transition-all duration-200 group w-10 h-10 flex items-center justify-center"
                title="Tela Cheia"
              >
                <i class="fas fa-expand text-zenix-secondary group-hover:text-zenix-green text-xs transition-colors"></i>
              </button>
            </div>
            
            <!-- Gráfico -->
            <div id="tradingviewChart" ref="chartContainer" class="flex-1 chart-wrapper relative" style="background-color: #0B0B0B; min-height: 0; height: 100%;">
              <!-- Chart will be rendered here -->
              <div v-if="showChartPlaceholder" class="chart-placeholder absolute inset-0 flex items-center justify-center" style="z-index: 2; pointer-events: none;">
                <p class="text-zenix-secondary">Carregando histórico de ticks...</p>
              </div>
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
          
          <!-- Multiplier (apenas para CALL/PUT) -->
          <div v-if="!isDigitContract">
            <label class="block text-xs font-medium text-[#DFDFDF88] mb-2">
              <i class="fas fa-times text-zenix-green mr-2"></i>Multiplicador
            </label>
            <input 
              type="number" 
              placeholder="Ex: 50, 100, 150..."
              class="w-full bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2.5 text-sm text-zenix-text placeholder:text-[#DFDFDF40] focus:outline-none focus:border-zenix-green transition-colors"
            />
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
            <div v-if="localOrderConfig.type === 'DIGITMATCH'" class="mt-3 pt-3 border-t border-zenix-border">
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-3">
                <i class="fas fa-bullseye text-zenix-green mr-2"></i>Selecione o Dígito para Match
              </label>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="digit in 10"
                  :key="digit - 1"
                  @click="digitMatchValue = digit - 1"
                  :disabled="isTrading || activeContract"
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
              v-if="activeContract && isSellEnabled && !isTickBasedContract"
              id="sellButton"
              @click="executeSell"
              :disabled="isTrading"
              class="w-full bg-[#FF4747] hover:bg-[#FF6161] text-white font-semibold py-3.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-arrow-down"></i>
              PUT / SELL
            </button>
            <div v-if="activeContract && isTickBasedContract" class="w-full bg-zenix-bg border border-zenix-border rounded-lg p-3 text-center">
              <span class="text-xs text-zenix-secondary">Contratos de ticks não podem ser vendidos antes do vencimento</span>
            </div>
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
    accountBalance: {
      type: [String, Number],
      default: null,
    },
    accountBalanceValue: {
      type: Number,
      default: null,
    },
    accountCurrency: {
      type: String,
      default: 'USD',
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
      loadTicksAttempts: 0, // Contador de tentativas para inicializar gráfico
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
      // Contratos disponíveis para o mercado atual
      availableContracts: [],
      // Dados de dígitos para contratos de dígitos
      lastDigit: null,
      lastDigitParity: null,
      digitMatchValue: null,
      // Dados do modal de resultado
      finalTradeProfit: 0,
      finalTradeType: 'CALL',
      finalTradeBuyPrice: 0,
      finalTradeSellPrice: null,
      finalTradeBalanceAfter: null,
      // Contador de contrato
      contractTimeRemaining: null, // em segundos
      contractTicksRemaining: null, // em ticks
      contractStartTime: null, // timestamp de início
      contractDuration: null, // duração em segundos ou ticks
      contractCountdownInterval: null, // intervalo do contador
      contractTickCount: 0, // contador de ticks recebidos após compra
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
      // Buscar o label do tipo selecionado nos tipos disponíveis
      const selectedType = this.availableTradeTypes.find(t => t.value === this.localOrderConfig.type);
      if (selectedType) {
        return selectedType.label;
      }
      // Fallback para tipos conhecidos
      const typeMap = {
        'CALL': 'Alta (CALL)',
        'PUT': 'Baixa (PUT)',
        'DIGITMATCH': 'Dígito Igual',
        'DIGITDIFF': 'Dígito Diferente',
        'DIGITEVEN': 'Dígito Par',
        'DIGITODD': 'Dígito Ímpar',
        'DIGITOVER': 'Dígito Acima',
        'DIGITUNDER': 'Dígito Abaixo',
      };
      return typeMap[this.localOrderConfig.type] || this.localOrderConfig.type;
    },
    isDigitContract() {
      const digitTypes = ['DIGITMATCH', 'DIGITDIFF', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER'];
      return digitTypes.includes(this.localOrderConfig.type);
    },
    isTickBasedContract() {
      // Contratos baseados em ticks (durationUnit === 't')
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
    availableTradeTypes() {
      // Tipos disponíveis baseados nos contratos retornados pelo backend
      if (!this.availableContracts || this.availableContracts.length === 0) {
        // Fallback: tipos padrão se não houver contratos disponíveis
        return [
          { value: 'CALL', label: 'Alta (CALL)', description: 'Apostar que o preço subirá', icon: 'fas fa-arrow-up' },
          { value: 'PUT', label: 'Baixa (PUT)', description: 'Apostar que o preço descerá', icon: 'fas fa-arrow-down' },
        ];
      }
      
      // Mapear contratos disponíveis para tipos de negociação
      const typeMap = {
        'CALL': { value: 'CALL', label: 'Alta (CALL)', description: 'Apostar que o preço subirá', icon: 'fas fa-arrow-up' },
        'PUT': { value: 'PUT', label: 'Baixa (PUT)', description: 'Apostar que o preço descerá', icon: 'fas fa-arrow-down' },
        'DIGITMATCH': { value: 'DIGITMATCH', label: 'Dígito Igual', description: 'Apostar que o último dígito será igual', icon: 'fas fa-equals' },
        'DIGITDIFF': { value: 'DIGITDIFF', label: 'Dígito Diferente', description: 'Apostar que o último dígito será diferente', icon: 'fas fa-not-equal' },
        'DIGITEVEN': { value: 'DIGITEVEN', label: 'Dígito Par', description: 'Apostar que o último dígito será par', icon: 'fas fa-divide' },
        'DIGITODD': { value: 'DIGITODD', label: 'Dígito Ímpar', description: 'Apostar que o último dígito será ímpar', icon: 'fas fa-percent' },
        'DIGITOVER': { value: 'DIGITOVER', label: 'Dígito Acima', description: 'Apostar que o último dígito será acima de 5', icon: 'fas fa-arrow-up' },
        'DIGITUNDER': { value: 'DIGITUNDER', label: 'Dígito Abaixo', description: 'Apostar que o último dígito será abaixo de 5', icon: 'fas fa-arrow-down' },
      };
      
      // Filtrar apenas os tipos que estão disponíveis nos contratos
      console.log('[Chart] Contratos disponíveis para processar:', this.availableContracts);
      console.log('[Chart] Tipo de dados:', Array.isArray(this.availableContracts) ? 'Array' : typeof this.availableContracts);
      
      // Extrair tipos de contrato - a estrutura pode variar
      let contractTypes = [];
      
      if (Array.isArray(this.availableContracts)) {
        contractTypes = this.availableContracts
          .map(contract => {
            // Pode ser contract.contract_type, contract.type, contract.name, ou o próprio valor
            if (typeof contract === 'string') {
              return contract.toUpperCase();
            }
            if (contract && typeof contract === 'object') {
              return (contract.contract_type || contract.type || contract.name || contract.value || '').toString().toUpperCase();
            }
            return null;
          })
          .filter(type => type && type.length > 0) // Apenas strings válidas
          .filter((type, index, self) => self.indexOf(type) === index); // Remover duplicatas
      } else if (this.availableContracts && typeof this.availableContracts === 'object') {
        // Se for um objeto, tentar extrair tipos de diferentes formas
        const values = Object.values(this.availableContracts);
        contractTypes = values
          .map(item => {
            if (typeof item === 'string') {
              return item.toUpperCase();
            }
            if (Array.isArray(item)) {
              return item.map(c => {
                if (typeof c === 'string') return c.toUpperCase();
                return (c.contract_type || c.type || c.name || '').toString().toUpperCase();
              });
            }
            if (item && typeof item === 'object') {
              return (item.contract_type || item.type || item.name || '').toString().toUpperCase();
            }
            return null;
          })
          .flat()
          .filter(type => type && type.length > 0)
          .filter((type, index, self) => self.indexOf(type) === index);
      }
      
      console.log('[Chart] Tipos de contrato extraídos:', contractTypes);
      
      const availableTypes = contractTypes
        .map(type => typeMap[type])
        .filter(type => type !== undefined); // Remover tipos não mapeados
      
      console.log('[Chart] Tipos mapeados disponíveis:', availableTypes);
      
      return availableTypes.length > 0 ? availableTypes : [
        { value: 'CALL', label: 'Alta (CALL)', description: 'Apostar que o preço subirá', icon: 'fas fa-arrow-up' },
        { value: 'PUT', label: 'Baixa (PUT)', description: 'Apostar que o preço descerá', icon: 'fas fa-arrow-down' },
      ];
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
    async 'localOrderConfig.type'() {
      // Quando o tipo de contrato mudar, recarregar valores padrão e proposta
      if (this.isConnected) {
        // Limpar proposalId antigo quando o tipo muda (importante para evitar usar proposta do tipo errado)
        this.currentProposalId = null;
        this.currentProposalPrice = null;
        console.log('[Chart] Tipo de contrato alterado, limpando proposalId antigo');
        
        // Se mudou para DIGITMATCH e temos um último dígito, inicializar digitMatchValue
        if (this.localOrderConfig.type === 'DIGITMATCH' && this.lastDigit !== null) {
          this.digitMatchValue = this.lastDigit;
        } else if (this.localOrderConfig.type !== 'DIGITMATCH') {
          // Limpar digitMatchValue se não for DIGITMATCH
          this.digitMatchValue = null;
        }
        
        await this.loadDefaultValues();
        // Aguardar que a duração seja ajustada antes de carregar proposta
        if (this.localOrderConfig.type) {
          setTimeout(() => {
            this.loadProposal();
            this.subscribeToProposal();
          }, 500);
        }
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
    // Limpar contador de contrato
    this.stopContractCountdown();
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
      this.chartSeries = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    showFunctionAlert(functionName) {
      alert(`Função "${functionName}" em desenvolvimento`);
    },
    initChart() {
      const container = this.$refs.chartContainer;
      if (!container) {
        console.warn('[Chart] Container não encontrado, tentando novamente...');
        setTimeout(() => this.initChart(), 100);
        return;
      }

      this.$nextTick(() => {
        try {
          // Limpar container
          container.innerHTML = '';

          const rect = container.getBoundingClientRect();
          console.log('[Chart] Dimensões do container:', { width: rect.width, height: rect.height, container: container });
          
          if (rect.width <= 0 || rect.height <= 0) {
            console.warn('[Chart] Container sem dimensões válidas, tentando novamente...', { width: rect.width, height: rect.height });
            // Forçar uma altura mínima se necessário
            if (rect.height <= 0) {
              const parent = container.parentElement;
              if (parent) {
                const parentRect = parent.getBoundingClientRect();
                console.log('[Chart] Dimensões do parent:', { width: parentRect.width, height: parentRect.height });
              }
            }
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
              console.log('[Chart] Redimensionando gráfico:', { width: newRect.width, height: newRect.height });
              this.chart.resize(newRect.width, newRect.height);
            }
          };
          
          // Adicionar listener de resize
          window.addEventListener('resize', this.handleResize);
          
          // Forçar um resize inicial após um pequeno delay para garantir que o layout está completo
          setTimeout(() => {
            const finalRect = container.getBoundingClientRect();
            if (this.chart && finalRect.width > 0 && finalRect.height > 0) {
              console.log('[Chart] Resize inicial:', { width: finalRect.width, height: finalRect.height });
              this.chart.resize(finalRect.width, finalRect.height);
            }
          }, 100);
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
        setTimeout(async () => {
          await this.loadDefaultValues();
          if (this.localOrderConfig.type) {
            setTimeout(() => {
              this.loadProposal();
              this.subscribeToProposal();
            }, 500);
          } else {
            console.warn('[Chart] Tipo de contrato não definido após carregar valores padrão');
          }
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
        
        // Calcular último dígito e paridade para contratos de dígitos
        if (this.isDigitContract && tickValue && isFinite(tickValue) && tickValue > 0) {
          this.updateDigitInfo(tickValue);
        }
        
        if (!isNaN(tickValue) && isFinite(tickValue) && tickValue > 0 &&
            !isNaN(tickEpoch) && isFinite(tickEpoch) && tickEpoch > 0) {
          this.latestTick = {
            value: tickValue,
            epoch: tickEpoch
          };
        }
        // Atualizar contador de ticks se for contrato baseado em ticks
        if (this.activeContract && this.activeContract.duration_unit === 't' && this.contractTicksRemaining !== null) {
          this.contractTickCount++;
          this.contractTicksRemaining = Math.max(0, (this.activeContract.duration || this.localOrderConfig.duration || 1) - this.contractTickCount);
          
          // Se expirou (0 ticks restantes), processar expiração no próximo tick
          if (this.contractTicksRemaining <= 0 && this.activeContract) {
            // Aguardar um pouco para garantir que o backend processou
            setTimeout(() => {
              if (this.activeContract && this.contractTicksRemaining <= 0) {
                this.handleContractExpiration({ status: 'expired' });
              }
            }, 1000);
          }
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

      // Filtrar ticks por símbolo atual - usar apenas valores compatíveis com o símbolo selecionado
      // Determinar o símbolo baseado nos valores existentes no gráfico
      if (this.ticks.length > 0) {
        const existingValues = this.ticks
          .map(t => t.value)
          .filter(v => v !== null && v !== undefined && isFinite(v) && v > 0);
        
        if (existingValues.length > 0) {
          // Calcular mediana dos valores existentes
          const sortedValues = [...existingValues].sort((a, b) => a - b);
          const medianExisting = sortedValues[Math.floor(sortedValues.length / 2)];
          
          // Determinar faixa esperada baseada no símbolo atual
          // R_100: ~600-800, R_50: ~300-400, R_75: ~450-600, etc.
          // Aceitar apenas valores dentro de 50% da mediana (mais tolerante)
          const tolerance = 0.5; // 50% de tolerância
          const lowerBound = medianExisting * (1 - tolerance);
          const upperBound = medianExisting * (1 + tolerance);
          
          // Se o novo valor estiver muito fora da faixa, ignorar (é de outro símbolo)
          if (numValue < lowerBound || numValue > upperBound) {
            console.log('[Chart] ⚠️ Tick ignorado - valor fora da faixa do símbolo atual:', {
              novoValor: numValue,
              medianaExistente: medianExisting,
              limiteInferior: lowerBound,
              limiteSuperior: upperBound,
              simbolo: this.symbol
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
        
        // Validação final dupla antes de chamar update()
        const finalTime = Number(brasiliaEpoch);
        const finalValue = Number(numValue);
        
        if (!isFinite(finalTime) || finalTime <= 0 || !isFinite(finalValue) || finalValue <= 0) {
          console.warn('[Chart] Valores finais inválidos:', { time: finalTime, value: finalValue });
          return;
        }
        
        this.chartSeries.update({
          time: finalTime,
          value: finalValue
        });
        console.log('[Chart] ✅ Tick em tempo real adicionado ao gráfico:', { time: finalTime, value: finalValue });
        
        // Atualizar linha de entrada para terminar no último tick
        if (this.entrySpotLine && this.activeContract) {
          this.updateEntrySpotLine();
        }
      } catch (error) {
        console.error('[Chart] ❌ Erro ao adicionar tick em tempo real:', error, { time: brasiliaEpoch, value: numValue });
      }
    },
    async loadTicksFromBackend() {
      // Verificar se o gráfico está inicializado
      if (!this.chart || !this.chartSeries) {
        // Limitar tentativas para evitar loop infinito
        if (!this.loadTicksAttempts) {
          this.loadTicksAttempts = 0;
        }
        this.loadTicksAttempts++;
        
        if (this.loadTicksAttempts > 20) { // Máximo de 20 tentativas (10 segundos)
          console.error('[Chart] ❌ Máximo de tentativas para inicializar gráfico atingido. Parando...');
          this.loadTicksAttempts = 0;
          return;
        }
        
        console.warn(`[Chart] Gráfico não inicializado, aguardando... (tentativa ${this.loadTicksAttempts}/20)`);
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 500);
        return;
      }
      
      // Resetar contador quando gráfico estiver pronto
      this.loadTicksAttempts = 0;

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
      
      // Filtrar ticks por símbolo atual - usar apenas valores compatíveis
      // Se já temos dados no gráfico, usar a mediana para determinar o símbolo
      let filteredTicks = ticksToUse;
      
      if (this.ticks.length > 0) {
        const existingValues = this.ticks
          .map(t => t.value)
          .filter(v => v !== null && v !== undefined && isFinite(v) && v > 0);
        
        if (existingValues.length > 0) {
          const sortedValues = [...existingValues].sort((a, b) => a - b);
          const medianExisting = sortedValues[Math.floor(sortedValues.length / 2)];
          const tolerance = 0.5; // 50% de tolerância
          const lowerBound = medianExisting * (1 - tolerance);
          const upperBound = medianExisting * (1 + tolerance);
          
          filteredTicks = ticksToUse.filter(tick => {
            if (!tick || typeof tick !== 'object') return false;
            if (tick.value === null || tick.value === undefined) return false;
            const val = Number(tick.value);
            if (isNaN(val) || !isFinite(val) || val <= 0) return false;
            return val >= lowerBound && val <= upperBound;
          });
          
          if (filteredTicks.length > 0) {
            console.log('[Chart] Ticks filtrados por símbolo:', filteredTicks.length, 'de', ticksToUse.length);
            ticksToUse = filteredTicks;
          }
        }
      } else {
        // Se não temos dados ainda, usar a mediana dos ticks recebidos
        const sortedValues = [...tickValues].sort((a, b) => a - b);
        const median = sortedValues[Math.floor(sortedValues.length / 2)];
        const tolerance = 0.5;
        const lowerBound = median * (1 - tolerance);
        const upperBound = median * (1 + tolerance);
        
        filteredTicks = ticksToUse.filter(tick => {
          if (!tick || typeof tick !== 'object') return false;
          if (tick.value === null || tick.value === undefined) return false;
          const val = Number(tick.value);
          if (isNaN(val) || !isFinite(val) || val <= 0) return false;
          return val >= lowerBound && val <= upperBound;
        });
        
        if (filteredTicks.length > 0) {
          console.log('[Chart] Ticks filtrados por mediana inicial:', filteredTicks.length, 'de', ticksToUse.length);
          ticksToUse = filteredTicks;
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

        // Validação final EXTREMAMENTE rigorosa antes de setar dados - garantir que não há nulls
        let finalChartData = chartData.filter(item => {
          // Validação de objeto
          if (!item || item === null || item === undefined || typeof item !== 'object') {
            return false;
          }
          
          // Validação de time - múltiplas verificações
          const time = item.time;
          if (time === null || time === undefined) {
            return false;
          }
          const numTime = Number(time);
          if (isNaN(numTime) || !isFinite(numTime) || numTime <= 0) {
            return false;
          }
          
          // Validação de value - múltiplas verificações
          const value = item.value;
          if (value === null || value === undefined) {
            return false;
          }
          const numValue = Number(value);
          if (isNaN(numValue) || !isFinite(numValue) || numValue <= 0) {
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
        const chartValues = finalChartData.map(d => {
          const val = Number(d.value);
          return (val !== null && val !== undefined && isFinite(val) && val > 0) ? val : null;
        }).filter(v => v !== null);
        
        if (chartValues.length === 0) {
          console.warn('[Chart] Nenhum valor válido após validação');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        const minValue = Math.min(...chartValues);
        const maxValue = Math.max(...chartValues);
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
        if (finalChartData.length > 0) {
          console.log('[Chart] Primeiro tick:', finalChartData[0]);
          console.log('[Chart] Último tick:', finalChartData[finalChartData.length - 1]);
        }
        console.log('[Chart] Range de valores:', { min: minValue, max: maxValue, median: medianValue });

        // Validação final EXTREMAMENTE rigorosa individual de cada item antes de passar para o gráfico
        const validatedData = finalChartData
          .map(item => {
            // Verificar se o item existe e não é null/undefined
            if (!item || item === null || item === undefined || typeof item !== 'object') {
              return null;
            }
            
            // Verificar time - múltiplas validações
            if (item.time === null || item.time === undefined) {
              return null;
            }
            const timeNum = Number(item.time);
            if (isNaN(timeNum) || !isFinite(timeNum) || timeNum <= 0) {
              return null;
            }
            
            // Verificar value - múltiplas validações
            if (item.value === null || item.value === undefined) {
              return null;
            }
            const valueNum = Number(item.value);
            if (isNaN(valueNum) || !isFinite(valueNum) || valueNum <= 0) {
              return null;
            }
            
            // Retornar objeto com valores validados e convertidos
            return {
              time: timeNum,
              value: valueNum
            };
          })
          .filter(item => item !== null && item !== undefined);
        
        if (validatedData.length === 0) {
          console.error('[Chart] ❌ Nenhum dado válido após validação final rigorosa');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        // Validação final EXTRA antes de setData() - garantir que não há nulls
        const finalData = validatedData.filter(item => {
          if (!item || item === null || item === undefined) return false;
          const time = Number(item.time);
          const value = Number(item.value);
          return isFinite(time) && time > 0 && isFinite(value) && value > 0;
        });
        
        if (finalData.length === 0) {
          console.error('[Chart] ❌ Nenhum dado válido após validação extra');
          this.showChartPlaceholder = false;
          this.isLoadingTicks = false;
          return;
        }
        
        // Atualizar gráfico com try-catch robusto
        try {
          // Limpar série novamente antes de adicionar novos dados
          this.chartSeries.setData([]);
          
          // Adicionar novos dados validados
          this.chartSeries.setData(finalData);
          console.log('[Chart] ✅ Dados setados na série:', finalData.length, 'pontos válidos');
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
        
        // Forçar resize para garantir que o gráfico use toda a altura disponível
        this.$nextTick(() => {
          if (this.chart && this.$refs.chartContainer) {
            const rect = this.$refs.chartContainer.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              console.log('[Chart] Resize após plotar dados:', { width: rect.width, height: rect.height });
              this.chart.resize(rect.width, rect.height);
            }
          }
        });
        
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

      // Limpar contratos disponíveis para forçar recarregamento
      this.availableContracts = [];

      // Cancelar subscription anterior e inscrever-se no novo símbolo
      try {
        await derivTradingService.cancelTickSubscription();
        await derivTradingService.subscribeSymbol(this.symbol, this.derivToken, this.loginid);
        
        // Aguardar um pouco e buscar novos ticks
        setTimeout(() => {
          this.loadTicksFromBackend();
        }, 1500);
        
        // Carregar valores padrão e proposta para o novo símbolo
        setTimeout(async () => {
          await this.loadDefaultValues();
          // Aguardar um pouco mais para garantir que o tipo foi ajustado
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Verificar novamente se o tipo está definido e disponível
          if (this.localOrderConfig.type && this.availableContracts && this.availableContracts.length > 0) {
            const isTypeAvailable = this.availableContracts.some(c => {
              const contractType = typeof c === 'string' ? c : (c.contract_type || c.type || c.name);
              return contractType && contractType.toUpperCase() === this.localOrderConfig.type.toUpperCase();
            });
            
            if (isTypeAvailable) {
              setTimeout(() => {
                this.loadProposal();
                this.subscribeToProposal();
              }, 500);
            } else {
              console.warn('[Chart] Tipo de contrato não está disponível para o símbolo:', this.symbol, 'Tipo:', this.localOrderConfig.type);
              // Tentar novamente após ajustar o tipo
              await this.loadDefaultValues();
              if (this.localOrderConfig.type) {
                setTimeout(() => {
                  this.loadProposal();
                  this.subscribeToProposal();
                }, 500);
              }
            }
          } else {
            console.warn('[Chart] Tipo de contrato não definido após carregar valores padrão. Símbolo:', this.symbol);
          }
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
      
      // Validar saldo antes de comprar usando o saldo da conta Deriv configurada (mostrado no header)
      const requiredAmount = this.localOrderConfig.amount || 10;
      const accountBalance = this.accountBalanceValue !== null && this.accountBalanceValue !== undefined 
        ? Number(this.accountBalanceValue) 
        : null;
      
      if (accountBalance !== null && accountBalance < requiredAmount) {
        const balanceFormatted = accountBalance.toFixed(2);
        const requiredFormatted = requiredAmount.toFixed(2);
        this.tradeError = `Saldo insuficiente! Você possui $${balanceFormatted} mas precisa de $${requiredFormatted} para esta operação.`;
        this.isTrading = false;
        console.warn('[Chart] Saldo insuficiente:', { accountBalance, requiredAmount });
        return;
      }
      
      if (accountBalance === null) {
        console.warn('[Chart] Saldo da conta não disponível, continuando com a compra (backend também validará)');
      } else {
        console.log('[Chart] Saldo da conta verificado:', { accountBalance, requiredAmount });
      }
      
      try {
        // Preparar configuração de compra
        // IMPORTANTE: Se o proposalId foi gerado com um tipo diferente, não usar
        // O backend deve buscar uma nova proposta com o tipo correto
        const buyConfig = {
          symbol: this.symbol,
          contractType: this.localOrderConfig.type, // Garantir que o tipo correto seja enviado
          duration: this.localOrderConfig.duration,
          durationUnit: this.localOrderConfig.durationUnit, // 'm' ou 't'
          amount: this.localOrderConfig.amount,
          proposalId: this.currentProposalId, // Opcional, backend busca se não fornecido
        };
        
        console.log('[Chart] Configuração de compra sendo enviada:', {
          contractType: buyConfig.contractType,
          duration: buyConfig.duration,
          durationUnit: buyConfig.durationUnit,
          proposalId: buyConfig.proposalId,
          originalType: this.localOrderConfig.type,
          originalDuration: this.localOrderConfig.duration,
          originalDurationUnit: this.localOrderConfig.durationUnit
        });
        
        // Se o proposalId existe mas o tipo mudou, não usar o proposalId antigo
        // Deixar o backend buscar uma nova proposta com o tipo correto
        if (this.currentProposalId && this.localOrderConfig.type) {
          // Verificar se o proposalId atual corresponde ao tipo selecionado
          // Por segurança, sempre forçar o backend a usar o contractType enviado
          console.log('[Chart] ⚠️ Usando proposalId existente, mas garantindo que contractType seja respeitado');
        }
        
        // Adicionar barrier APENAS para DIGITMATCH (único que precisa de barrier)
        if (this.localOrderConfig.type === 'DIGITMATCH') {
          buyConfig.barrier = this.digitMatchValue !== null && this.digitMatchValue !== undefined 
            ? this.digitMatchValue 
            : (this.lastDigit !== null && this.lastDigit !== undefined ? this.lastDigit : 5);
        }
        
        // Adicionar multiplier para contratos MULTUP/MULTDOWN
        if (this.localOrderConfig.type === 'MULTUP' || this.localOrderConfig.type === 'MULTDOWN') {
          buyConfig.multiplier = this.localOrderConfig.multiplier || 10;
        }
        
        // Enviar toda a configuração para o backend processar
        await derivTradingService.buyContract(buyConfig);
        console.log('[Chart] ✅ Compra executada via backend');
        // A resposta chegará via SSE no evento 'buy'
      } catch (error) {
        console.error('[Chart] Erro ao executar compra:', error);
        
        // Verificar se o erro é de saldo insuficiente
        if (error.message && (error.message.includes('InsufficientBalance') || error.message.includes('insufficient'))) {
          this.tradeError = `Saldo insuficiente! Você não possui saldo suficiente para esta operação de $${requiredAmount.toFixed(2)}.`;
        } else {
          this.tradeError = error.message || 'Erro ao executar compra';
        }
        
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
      
      // O backend pode enviar contractId (camelCase) ou contract_id (snake_case)
      const contractId = buyData.contractId || buyData.contract_id;
      
      if (!buyData || !contractId) {
        console.error('[Chart] Dados de compra inválidos:', buyData);
        this.tradeError = 'Erro ao processar compra.';
        this.isTrading = false;
        return;
      }
      
      // Criar objeto de contrato ativo
      // IMPORTANTE: Preservar duration_unit original ('t' para ticks, 'm' para minutos)
      const durationUnit = buyData.durationUnit || buyData.duration_unit || this.localOrderConfig.durationUnit || 'm';
      const duration = buyData.duration || this.localOrderConfig.duration || 1;
      
      console.log('[Chart] Criando contrato ativo com:', {
        duration,
        durationUnit,
        originalBuyData: {
          durationUnit: buyData.durationUnit,
          duration_unit: buyData.duration_unit
        },
        localConfig: {
          duration: this.localOrderConfig.duration,
          durationUnit: this.localOrderConfig.durationUnit
        }
      });
      
      // Log para debug
      console.log('[Chart] EntrySpot recebido:', {
        entrySpot: buyData.entrySpot,
        entry_spot: buyData.entry_spot,
        purchasePrice: this.purchasePrice,
        finalEntrySpot: buyData.entrySpot || buyData.entry_spot || this.purchasePrice
      });
      
      this.activeContract = {
        contract_id: contractId,
        buy_price: buyData.buyPrice || buyData.buy_price || this.currentProposalPrice,
        entry_spot: buyData.entrySpot || buyData.entry_spot || this.purchasePrice || null,
        entry_time: buyData.entryTime || buyData.entry_time || Date.now() / 1000,
        contract_type: buyData.contractType || buyData.contract_type || this.localOrderConfig.type,
        duration: duration,
        duration_unit: durationUnit, // Preservar 't' ou 'm'
        symbol: buyData.symbol || this.symbol,
        sell_price: buyData.sellPrice || buyData.sell_price || null,
        profit: buyData.profit || null,
        expiry_time: buyData.expiryTime || buyData.expiry_time || null, // Tempo de expiração se disponível
        payout: buyData.payout || null, // Payout do contrato
      };
      
      // Desabilitar venda para contratos de ticks
      if (durationUnit === 't') {
        this.isSellEnabled = false;
        console.log('[Chart] Contrato de ticks detectado - venda desabilitada');
      }
      
      // Inicializar contador
      this.initializeContractCountdown();
      
      // Adicionar linha de compra no gráfico
      if (this.activeContract.entry_spot) {
        const entryTime = this.activeContract.entry_time || (Date.now() / 1000);
        this.addEntrySpotLine(this.activeContract.entry_spot, entryTime);
      }
      
      this.isTrading = false;
      this.tradeMessage = 'Compra executada com sucesso!';
      // Só habilitar venda se não for contrato de ticks
      if (this.activeContract.duration_unit !== 't') {
        this.isSellEnabled = true;
      }
      
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
      
      // Parar contador
      this.stopContractCountdown();
      
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
    async selectMarket(marketValue) {
      this.symbol = marketValue;
      this.closeMarketModal();
      // Limpar contratos disponíveis para forçar recarregamento
      this.availableContracts = [];
      // Disparar mudança de símbolo
      if (this.isConnected) {
        await this.handleSymbolChange();
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
      // Recarregar valores padrão e proposta com novo tipo
      if (this.isConnected) {
        this.loadDefaultValues();
        setTimeout(() => {
          this.loadProposal();
        }, 500);
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
      }
    },
    closeTradeResultModal() {
      this.showTradeResultModal = false;
      // Reiniciar subscription de proposal após fechar o modal
      setTimeout(() => {
        if (!this.activeContract && !this.isTrading && this.isConnected && this.localOrderConfig.type) {
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
      
      // Verificar se o contrato expirou ou foi vendido
      const isExpired = contractData.status === 'sold' || contractData.status === 'won' || contractData.status === 'lost' || 
                        contractData.is_sold === true || contractData.is_expired === true ||
                        contractData.status === 'expired';
      
      // Atualizar dados do contrato ativo
      if (contractData.sell_price !== undefined) {
        this.activeContract.sell_price = contractData.sell_price;
      }
      if (contractData.profit !== undefined) {
        this.activeContract.profit = contractData.profit;
      }
      if (contractData.exit_spot !== undefined || contractData.exitSpot !== undefined) {
        this.activeContract.exit_spot = contractData.exit_spot || contractData.exitSpot || null;
      }
      if (contractData.is_sold !== undefined) {
        this.isSellEnabled = !contractData.is_sold;
      }
      
      // Atualizar se venda antecipada está disponível
      // A maioria dos contratos permite venda antecipada, exceto alguns tipos específicos
      if (contractData.is_valid_to_sell !== undefined) {
        this.isSellEnabled = contractData.is_valid_to_sell;
      } else {
        // Por padrão, assumir que venda antecipada está disponível se não foi vendido
        if (contractData.is_sold === undefined || !contractData.is_sold) {
          // Verificar se o tipo de contrato permite venda antecipada
          const noEarlySellTypes = ['DIGITMATCH', 'DIGITDIFF', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER'];
          this.isSellEnabled = !noEarlySellTypes.includes(this.activeContract.contract_type);
        }
      }
      
      // Atualizar tempo de expiração se disponível
      if (contractData.expiry_time !== undefined && contractData.expiry_time !== null) {
        this.activeContract.expiry_time = contractData.expiry_time;
        // Recalcular tempo restante se necessário
        if (!this.isTickBasedContract && this.contractStartTime) {
          const now = Date.now() / 1000;
          const expiry = Number(contractData.expiry_time);
          this.contractTimeRemaining = Math.max(0, expiry - now);
        }
      }
      
      // Se o contrato expirou, processar resultado final
      if (isExpired) {
        this.handleContractExpiration(contractData);
        return;
      }
      
      // Atualizar P&L em tempo real
      this.updateRealTimeProfit();
    },
    initializeContractCountdown() {
      if (!this.activeContract) return;
      
      const duration = this.activeContract.duration || this.localOrderConfig.duration || 1;
      const durationUnit = this.activeContract.duration_unit || this.localOrderConfig.durationUnit || 'm';
      const entryTime = this.activeContract.entry_time || Date.now() / 1000;
      
      this.contractStartTime = entryTime;
      this.contractTickCount = 0; // Resetar contador de ticks
      
      if (durationUnit === 't') {
        // Contrato baseado em ticks
        this.contractTicksRemaining = duration;
        this.contractTimeRemaining = null;
      } else {
        // Contrato baseado em tempo
        // Converter duração para segundos
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
            durationInSeconds = duration * 60; // Default para minutos
        }
        
        this.contractDuration = durationInSeconds;
        this.contractTimeRemaining = durationInSeconds;
        this.contractTicksRemaining = null;
        
        // Iniciar contador de tempo
        this.contractCountdownInterval = setInterval(() => {
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
        }, 1000); // Atualizar a cada segundo
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
    async handleContractExpiration(contractData) {
      console.log('[Chart] ========== CONTRATO EXPIRADO ==========');
      console.log('[Chart] Dados finais:', contractData);
      
      // Parar contador
      this.stopContractCountdown();
      
      // Se não temos dados completos, tentar buscar do backend
      let finalContractData = contractData;
      if (!contractData.profit && contractData.profit !== 0 && this.activeContract?.contract_id) {
        try {
          // Tentar buscar status atualizado do contrato do backend
          // O backend deve enviar via SSE, mas podemos tentar buscar se necessário
          console.log('[Chart] Buscando resultado final do contrato...');
          // Por enquanto, usar os dados que temos
          // O backend deve enviar via SSE quando o contrato expirar
        } catch (error) {
          console.warn('[Chart] Não foi possível buscar resultado do backend:', error);
        }
      }
      
      // Determinar resultado
      const profit = finalContractData.profit !== undefined && finalContractData.profit !== null 
        ? Number(finalContractData.profit) 
        : (this.realTimeProfit !== null ? this.realTimeProfit : 0);
      
      const isWin = profit > 0;
      const status = finalContractData.status || (isWin ? 'won' : 'lost');
      
      // Atualizar contrato com dados finais
      if (this.activeContract) {
        this.activeContract.sell_price = finalContractData.sell_price || this.activeContract.sell_price;
        this.activeContract.profit = profit;
        this.activeContract.exit_spot = finalContractData.exit_spot || this.latestTick?.value || null;
        this.activeContract.exit_time = finalContractData.exit_time || Date.now() / 1000;
        this.activeContract.status = status;
      }
      
      // Preparar dados para o modal
      this.finalTradeProfit = profit;
      this.finalTradeType = this.activeContract?.contract_type || 'CALL';
      this.finalTradeBuyPrice = this.activeContract?.buy_price || this.purchasePrice || 0;
      this.finalTradeSellPrice = finalContractData.sell_price ? Number(finalContractData.sell_price) : null;
      this.finalTradeBalanceAfter = finalContractData.balance_after ? Number(finalContractData.balance_after) : null;
      
      // Remover linha de compra
      this.removeEntrySpotLine();
      
      // Emitir evento para atualizar histórico
      this.$emit('trade-result', {
        contractId: this.activeContract?.contract_id,
        buyPrice: this.activeContract?.buy_price || this.purchasePrice,
        sellPrice: finalContractData.sell_price ? Number(finalContractData.sell_price) : null,
        profit: profit,
        balanceAfter: finalContractData.balance_after ? Number(finalContractData.balance_after) : null,
        currency: 'USD',
        direction: this.activeContract?.contract_type,
        status: status.toUpperCase(),
      });
      
      // Limpar contrato ativo após um delay
      setTimeout(() => {
        this.activeContract = null;
        this.purchasePrice = null;
        this.realTimeProfit = null;
        this.isSellEnabled = false;
      }, 3000);
      
      this.isTrading = false;
      this.tradeMessage = isWin 
        ? `🎉 Contrato vencido com lucro! P&L: +$${profit.toFixed(this.pricePrecision)}`
        : `📉 Contrato vencido com perda. P&L: $${profit.toFixed(this.pricePrecision)}`;
      
      // Mostrar modal de resultado
      this.showTradeResultModal = true;
      
      console.log('[Chart] ✅ Expiração processada:', { profit, status, isWin });
    },
    addEntrySpotLine(entrySpot, entryTime) {
      if (!this.chart || !entrySpot) {
        console.warn('[Chart] Não é possível adicionar linha de entrada: chart ou entrySpot não disponível');
        return;
      }
      
      try {
        // Remover linha anterior se existir
        this.removeEntrySpotLine();
        
        const entryColor = '#ef4444'; // Vermelho para linha de entrada
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
      if (!this.isConnected || !this.symbol) {
        return;
      }
      
      try {
        // Usar o tipo atual ou CALL como padrão para buscar contratos disponíveis
        const contractType = this.localOrderConfig.type || 'CALL';
        const defaultValues = await derivTradingService.getDefaultValues(
          this.symbol,
          contractType
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
        
        // Atualizar contratos disponíveis
        if (defaultValues.availableContracts) {
          // A estrutura pode ser um objeto com {available: [...]} ou um array direto
          let contractsArray = [];
          if (Array.isArray(defaultValues.availableContracts)) {
            contractsArray = defaultValues.availableContracts;
          } else if (defaultValues.availableContracts.available && Array.isArray(defaultValues.availableContracts.available)) {
            // Estrutura: {available: [...], non_available: [...], ...}
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
          console.log('[Chart] ✅ Contratos disponíveis atualizados:', this.availableContracts);
          console.log('[Chart] Total de contratos:', this.availableContracts.length);
          if (this.availableContracts.length > 0) {
            console.log('[Chart] Primeiro contrato exemplo:', this.availableContracts[0]);
          }
          
          // Se o tipo atual não estiver disponível, selecionar o primeiro disponível
          const contractTypes = this.availableContracts.map(c => {
            if (typeof c === 'string') return c;
            return c.contract_type || c.type || c.name || c;
          }).filter(t => t);
          
          // Verificar se o tipo atual está disponível
          const currentTypeAvailable = contractTypes.some(
            type => {
              const typeStr = typeof type === 'string' ? type : (type.contract_type || type.type || type.name || type);
              return typeStr && typeStr.toUpperCase() === (this.localOrderConfig.type || '').toUpperCase();
            }
          );
          
          // Se o tipo atual não estiver disponível OU não estiver definido, selecionar o primeiro disponível
          if ((!this.localOrderConfig.type || !currentTypeAvailable) && contractTypes.length > 0) {
            // Priorizar CALL ou PUT se disponíveis, senão usar o primeiro
            const preferredTypes = ['CALL', 'PUT', 'MULTUP', 'MULTDOWN'];
            let selectedType = null;
            
            // Tentar encontrar um tipo preferido
            for (const preferred of preferredTypes) {
              const found = contractTypes.find(type => {
                const typeStr = typeof type === 'string' ? type : (type.contract_type || type.type || type.name || type);
                return typeStr && typeStr.toUpperCase() === preferred.toUpperCase();
              });
              if (found) {
                selectedType = found;
                break;
              }
            }
            
            // Se não encontrou um preferido, usar o primeiro disponível
            if (!selectedType) {
              selectedType = contractTypes[0];
            }
            
            const newType = typeof selectedType === 'string' 
              ? selectedType 
              : (selectedType.contract_type || selectedType.type || selectedType.name || 'CALL');
            
            this.localOrderConfig.type = newType;
            console.log('[Chart] Tipo de contrato alterado para:', this.localOrderConfig.type, '(disponível para', this.symbol, ')');
          } else if (this.localOrderConfig.type && currentTypeAvailable) {
            console.log('[Chart] Tipo de contrato mantido:', this.localOrderConfig.type, '(disponível para', this.symbol, ')');
          }
          
          // Ajustar duração baseada nos contratos disponíveis
          if (this.localOrderConfig.type && this.availableContracts.length > 0) {
            const selectedContract = this.availableContracts.find(c => {
              const contractType = typeof c === 'string' ? c : (c.contract_type || c.type || c.name);
              return contractType === this.localOrderConfig.type;
            });
            
            if (selectedContract && typeof selectedContract === 'object') {
              // Parsear min_contract_duration (ex: "15m", "1d", "5t")
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
                // Preservar a duração atual se ela já foi definida pelo usuário
                const currentDuration = this.localOrderConfig.duration || 1;
                const currentUnit = this.localOrderConfig.durationUnit || 'm';
                
                // Se a unidade mínima for 't' (ticks) e a atual não for 't', ajustar apenas se necessário
                if (minDur.unit === 't') {
                  // Se a unidade atual não for ticks, ajustar apenas se a duração atual for inválida
                  if (currentUnit !== 't') {
                    // Verificar se há uma duração mínima em minutos/horas/dias que seja maior
                    // Por enquanto, manter a seleção do usuário se já tiver uma duração válida
                    if (currentDuration >= 1) {
                      // Manter a duração atual do usuário
                      console.log('[Chart] Duração do usuário preservada:', currentDuration, currentUnit);
                    } else {
                      // Apenas ajustar se a duração for inválida
                      this.localOrderConfig.duration = minDur.value;
                      this.localOrderConfig.durationUnit = 't';
                      console.log('[Chart] Duração ajustada para:', minDur.value, minDur.unit);
                    }
                  } else {
                    // Se já está em ticks, apenas ajustar se for menor que o mínimo
                    if (currentDuration < minDur.value) {
                      this.localOrderConfig.duration = minDur.value;
                      console.log('[Chart] Duração em ticks ajustada para mínima:', minDur.value);
                    }
                  }
                } else {
                  // Para outras unidades (m, h, d), converter para minutos para comparação
                  const currentInMinutes = currentUnit === 'm' ? currentDuration : 
                                          (currentUnit === 'h' ? currentDuration * 60 : 
                                          (currentUnit === 'd' ? currentDuration * 1440 : 0));
                  const minInMinutes = minDur.unit === 'm' ? minDur.value : 
                                      (minDur.unit === 'h' ? minDur.value * 60 : 
                                      (minDur.unit === 'd' ? minDur.value * 1440 : 0));
                  
                  // Apenas ajustar se a duração atual for menor que a mínima E a unidade for compatível
                  if (currentUnit === minDur.unit && currentDuration < minDur.value) {
                    // Mesma unidade, apenas ajustar valor se menor
                    this.localOrderConfig.duration = minDur.value;
                    console.log('[Chart] Duração ajustada para mínima:', minDur.value, minDur.unit);
                  } else if (currentUnit !== minDur.unit && currentInMinutes < minInMinutes) {
                    // Unidades diferentes, converter e ajustar apenas se menor
                    this.localOrderConfig.duration = minDur.value;
                    this.localOrderConfig.durationUnit = minDur.unit;
                    console.log('[Chart] Duração ajustada para mínima (conversão):', minDur.value, minDur.unit);
                  } else {
                    // Duração atual é válida, preservar
                    console.log('[Chart] Duração do usuário preservada:', currentDuration, currentUnit);
                  }
                }
              }
            }
          }
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
      if (!this.isConnected || !this.derivToken) {
        console.warn('[Chart] Não conectado ou sem token, não inscrevendo em proposta');
        return;
      }
      
      if (!this.localOrderConfig.type) {
        console.warn('[Chart] Tipo de contrato não definido, não inscrevendo em proposta');
        return;
      }
      
      // Verificar se o tipo está disponível para o símbolo atual
      if (this.availableContracts && this.availableContracts.length > 0) {
        const isTypeAvailable = this.availableContracts.some(c => {
          const contractType = typeof c === 'string' ? c : (c.contract_type || c.type || c.name);
          return contractType && contractType.toUpperCase() === this.localOrderConfig.type.toUpperCase();
        });
        
        if (!isTypeAvailable) {
          console.warn('[Chart] Tipo de contrato não está disponível para o símbolo:', this.symbol, 'Tipo:', this.localOrderConfig.type);
          console.warn('[Chart] Contratos disponíveis:', this.availableContracts.map(c => {
            const type = typeof c === 'string' ? c : (c.contract_type || c.type || c.name);
            return type;
          }));
          // Tentar recarregar valores padrão para ajustar o tipo
          await this.loadDefaultValues();
          if (!this.localOrderConfig.type) {
            console.error('[Chart] Não foi possível definir um tipo de contrato válido');
            return;
          }
        }
      }
      
      try {
        // O backend espera contractType (camelCase), não contract_type
        const proposalOptions = {
          symbol: this.symbol,
          contractType: this.localOrderConfig.type, // camelCase para o backend
          duration: this.localOrderConfig.duration || 1,
          durationUnit: this.localOrderConfig.durationUnit || 'm', // camelCase
          amount: this.localOrderConfig.amount || 10,
        };
        
        // Adicionar barrier APENAS para DIGITMATCH (único que precisa de barrier)
        if (this.localOrderConfig.type === 'DIGITMATCH') {
          // Usar digitMatchValue se disponível, senão usar lastDigit, senão usar 5 como padrão
          proposalOptions.barrier = this.digitMatchValue !== null && this.digitMatchValue !== undefined 
            ? this.digitMatchValue 
            : (this.lastDigit !== null && this.lastDigit !== undefined ? this.lastDigit : 5);
        }
        
        // Adicionar multiplier para contratos MULTUP/MULTDOWN
        if (this.localOrderConfig.type === 'MULTUP' || this.localOrderConfig.type === 'MULTDOWN') {
          proposalOptions.multiplier = this.localOrderConfig.multiplier || 10;
        }
        
        console.log('[Chart] Inscrevendo-se em proposta com opções:', proposalOptions);
        await derivTradingService.subscribeProposal(proposalOptions);
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
  min-height: 960px;
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

/* Contract Tracking Panel */
.contract-tracking-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  background: #0F0F0F;
  border: 1px solid #1A1A1A;
  border-radius: 16px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
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

/* Contador de Contrato */
.contract-countdown {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.countdown-value {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.countdown-number {
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

.countdown-normal {
  color: #22C55E;
}

.countdown-alert {
  color: #fbbf24;
  animation: pulse 1s ease-in-out infinite;
}

.countdown-warning {
  color: #ef4444;
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


.orders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
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

/* Digit Selection Buttons */
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

.digit-select-btn-inactive:hover:not(:disabled) {
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

.digit-select-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
