<template>
  <div class="operation-chart-wrapper">
    <!-- Main Layout -->
    <div class="operation-layout flex w-full overflow-hidden">
      <!-- Chart Column -->
      <div class="col-chart flex-1 min-w-0 flex flex-col gap-5">
        <!-- Chart Container -->
        <div 
          class="bg-zenix-card border border-zenix-border rounded-xl flex flex-col shadow-[0_0_8px_rgba(0,0,0,0.25)] chart-container w-full chart-card"
          :class="[{ 'overflow-hidden': activeTab === 'chart' }, activeTab === 'chart' ? 'h-full' : 'h-fit']"
        >
          <!-- Card Header for Chart Controls -->
          <div v-if="activeTab === 'chart'" class="flex items-center justify-end px-6 py-4 flex-shrink-0 border-b border-white/5">
            <div class="flex items-center gap-2">
              <!-- Botões de Zoom -->
              <div class="flex items-center gap-1 border border-zenix-border rounded-lg overflow-hidden">
                <button
                  @click="setZoomPeriod(10)"
                  :class="[
                    'px-2 py-1.5 text-xs font-medium transition-all duration-200',
                    zoomPeriod === 10 
                      ? 'bg-zenix-green text-black' 
                      : 'bg-zenix-bg text-zenix-text hover:bg-zenix-border'
                  ]"
                  title="Zoom 10 minutos"
                >
                  10m
                </button>
                <button
                  @click="setZoomPeriod(5)"
                  :class="[
                    'px-2 py-1.5 text-xs font-medium transition-all duration-200',
                    zoomPeriod === 5 
                      ? 'bg-zenix-green text-black' 
                      : 'bg-zenix-bg text-zenix-text hover:bg-zenix-border'
                  ]"
                  title="Zoom 5 minutos"
                >
                  5m
                </button>
                <button
                  @click="setZoomPeriod(3)"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-md',
                    zoomPeriod === 3
                      ? 'bg-zenix-green text-black'
                      : 'bg-[#151515] text-zenix-text hover:bg-zenix-border'
                  ]"
                  title="Zoom 3 minutos"
                >
                  3m
                </button>
              </div>
              <!-- Botão Linhas/Velas -->
              <button
                @click="toggleChartType"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-zenix-bg border border-zenix-border hover:border-zenix-green rounded-lg text-xs text-zenix-text transition-all duration-200"
                title="Alternar entre gráfico de linhas e velas"
              >
                <i :class="chartType === 'line' ? 'fas fa-chart-line' : 'fas fa-chart-bar'"></i>
                <span>{{ chartType === 'line' ? 'Linhas' : 'Velas' }}</span>
              </button>
            </div>
          </div>

          <!-- Gráfico -->
          <div v-if="activeTab === 'chart'" id="tradingviewChart" ref="chartContainer" class="flex-1 chart-wrapper relative" style="background-color: #0B0B0B; min-height: 0; height: 100%; margin: 0; padding: 0;">
            <!-- Blocking Loader Overlay -->
            <div v-if="isGlobalLoading" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0B]" style="z-index: 50;">
              <div class="relative w-16 h-16 mb-4">
                <div class="absolute inset-0 rounded-full border-4 border-white/5"></div>
                <div class="absolute inset-0 rounded-full border-4 border-zenix-green border-t-transparent animate-spin"></div>
              </div>
              <p class="text-zenix-text font-medium text-sm animate-pulse">Carregando dados do mercado...</p>
            </div>
            
            <!-- Placeholder (removido a pedido) -->
            <!-- <div v-else-if="showChartPlaceholder || isLoading" class="chart-placeholder absolute inset-0 flex items-center justify-center" style="z-index: 2; pointer-events: none;">
              <p class="text-zenix-secondary">Atualizando gráfico...</p>
            </div> -->
          </div>

          <!-- Digit Analysis Tab -->
          <div v-if="activeTab === 'digits'" class="flex-1 overflow-y-auto bg-[#0B0B0B] custom-scrollbar digits-tab-container">
            <div class="p-6 space-y-6">
              <!-- 1. FREQUÊNCIA GERAL (Meta Design) -->
              <div class="frequency-meta-card border border-white/5 rounded-xl p-6 h-fit">
                <div class="flex items-center justify-between mb-8">
                  <h3 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Frequência dos Dígitos</h3>
                </div>
                
                <div class="digit-meta-grid grid grid-cols-5 md:grid-cols-10 gap-2">
                  <div 
                    v-for="item in digitFrequenciesWithStats" 
                    :key="'meta-'+item.digit" 
                    class="digit-meta-item flex flex-col items-center p-2 rounded-xl transition-all duration-500 bg-[#0F0F0F] border border-white/5"
                    :class="[
                      item.isMax ? 'meta-highest-freq' : '',
                      item.isMin ? 'meta-lowest-freq' : ''
                    ]"
                  >
                    <span class="meta-digit-number text-3xl font-black mb-1" :style="{ color: item.statusClass === 'status-max' ? '#22C55E' : (item.statusClass === 'status-heated' ? '#F59E0B' : (item.statusClass === 'status-min' ? '#EF4444' : 'rgba(255,255,255,0.4)')) }">{{ item.digit }}</span>
                    <span class="meta-digit-percentage text-[11px] font-bold text-white/60 mb-4">{{ item.percentage }}%</span>
                    
                    <div class="meta-vertical-meter-container w-5 h-20 bg-white/5 rounded-full relative overflow-hidden">
                      <div 
                        class="meta-vertical-meter-fill absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out"
                        :style="{ height: item.percentage + '%', backgroundColor: item.statusClass === 'status-max' ? '#22C55E' : (item.statusClass === 'status-heated' ? '#F59E0B' : (item.statusClass === 'status-min' ? '#EF4444' : 'rgba(255,255,255,0.1)')) }"
                      ></div>
                    </div>
                    <span class="text-[9px] font-bold text-white/20 mt-4 uppercase">{{ item.percentage }}%</span>
                  </div>
                </div>
              </div>

              <!-- 2. VOLATILIDADE E RESUMO (Meta Style) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Volatilidade (Meta Style) -->
                <div class="meta-analysis-card border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Volatilidade</h3>
                    <div class="flex items-center gap-2 px-2 py-1 bg-zenix-green/10 rounded-full border border-zenix-green/20">
                      <span class="w-1.5 h-1.5 bg-zenix-green rounded-full shadow-[0_0_5px_#22C55E]"></span>
                      <span class="text-[9px] font-bold text-zenix-green uppercase">{{ dvxStatusText }}</span>
                    </div>
                  </div>
                                    <div class="flex items-center gap-6 py-4">
                      <div class="flex flex-col items-center ml-6 mr-8">
                        <span class="text-6xl font-black text-zenix-green leading-none">{{ dvxValueComputed }}</span>
                        <span class="text-sm font-bold text-white/40 uppercase mt-2">DVX</span>
                      </div>
                      
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-bold text-zenix-green">Volatilidade {{ dvxStatusText }}</span>
                        </div>
                        <div class="relative h-3 bg-white/5 rounded-full mb-4">
                          <div 
                            class="absolute inset-y-0 left-0 bg-gradient-to-r from-zenix-green/20 to-zenix-green rounded-full transition-all duration-1000"
                            :style="{ width: dvxValueComputed + '%' }"
                          ></div>
                          <div 
                            class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-zenix-green rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] transition-all duration-1000 z-10"
                            :style="{ left: dvxValueComputed + '%', transform: 'translate(-50%, -50%)' }"
                          ></div>
                        </div>
                        <div class="flex justify-between items-center text-[9px] font-bold text-white/10 uppercase">
                          <span>Baixa</span>
                          <span>Alta</span>
                        </div>
                      </div>
                    </div>
                  
                  <p class="text-[10px] text-white/30 font-medium">Ambiente {{ dvxEnvironmentText }} para operações de baixo risco</p>
                </div>

                <!-- Paridade (Meta Style) -->
                <div class="meta-analysis-card border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Paridade</h3>
                    <div class="flex items-center gap-1 text-zenix-green">
                      <i class="fas fa-chart-line text-[10px]"></i>
                      <span class="text-[10px] font-bold">+2%</span>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div class="parity-meta-item">
                        <div class="flex justify-between items-center mb-1.5">
                          <span class="text-xs font-bold text-white">Par</span>
                          <span class="text-xs font-black text-zenix-green">{{ evenPercentage }}%</span>
                        </div>
                        <div class="h-3 bg-white/5 rounded-full overflow-hidden">
                          <div class="h-full bg-zenix-green transition-all duration-1000" :style="{ width: evenPercentage + '%' }"></div>
                        </div>
                      </div>
                      <div class="parity-meta-item">
                        <div class="flex justify-between items-center mb-1.5">
                          <span class="text-xs font-bold text-white/40">Ímpar</span>
                          <span class="text-xs font-black text-white/20">{{ oddPercentage }}%</span>
                        </div>
                        <div class="h-3 bg-white/5 rounded-full overflow-hidden">
                          <div class="h-full bg-white/5 transition-all duration-1000" :style="{ width: oddPercentage + '%' }"></div>
                        </div>
                      </div>
                    </div>

                    <div class="border-l border-white/5 pl-6 flex flex-col justify-center">
                      <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-black text-white">{{ mostFrequentDigit ? mostFrequentDigit.digit : '-' }}</span>
                          <span class="text-[10px] font-black text-white/20">{{ mostFrequentDigit ? mostFrequentDigit.percentage : '0' }}%</span>
                        </div>
                        <div class="h-3 bg-white/5 rounded-full overflow-hidden mb-1.5">
                          <div class="h-full bg-zenix-green w-[15%] transition-all duration-1000" :style="{ width: mostFrequentDigit ? mostFrequentDigit.percentage + '%' : '0%' }"></div>
                        </div>
                        <span class="text-[9px] font-bold text-white/20 uppercase tracking-wider">Mais Frequente</span>
                      </div>
                      
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-sm font-black text-white/40">{{ leastFrequentDigit ? leastFrequentDigit.digit : '-' }}</span>
                          <span class="text-[10px] font-black text-white/20">{{ leastFrequentDigit ? leastFrequentDigit.percentage : '0' }}%</span>
                        </div>
                        <div class="h-3 bg-white/5 rounded-full overflow-hidden mb-1.5">
                           <div class="h-full bg-red-500 w-[15%] transition-all duration-1000" :style="{ width: leastFrequentDigit ? leastFrequentDigit.percentage + '%' : '0%' }"></div>
                        </div>
                        <span class="text-[9px] font-bold text-white/20 uppercase tracking-wider">Menos Frequentes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border border-white/5 rounded-xl p-6 h-fit">
                 <div class="flex items-center justify-between mb-6">
                   <h3 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Histórico Recente</h3>
                   <div class="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                     <i class="far fa-clock text-[10px] text-white/40"></i>
                     <span class="text-[10px] font-bold text-white/60">Últimos 15</span>
                   </div>
                 </div>
                  <div v-if="recentDigits.length > 0" class="flex flex-wrap gap-2 justify-start">
                    <div 
                     v-for="(digit, idx) in recentDigits.slice(0, 15)" 
                     :key="'recent-'+idx"
                     class="h-10 w-10 md:h-12 md:w-12 bg-[#080808] border border-white/5 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 flex-shrink-0"
                     :class="[
                       idx === 0 ? 'bg-zenix-green/20 text-zenix-green border-zenix-green/50 shadow-[0_0_15px_#22C55E33]' : 'text-white/40'
                     ]"
                    >
                     {{ digit }}
                   </div>
                   <div v-if="recentDigits.length === 0" class="text-xs text-white/20 uppercase font-black tracking-widest py-4 w-full text-center">
                     Sincronizando ticks...
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <!-- Sidebar Panel -->
      <div class="sidebar-panel w-[400px] flex-shrink-0 bg-[#0D0D0D] border border-white/5 p-8 overflow-y-auto rounded-xl">
        <div class="pb-6 mb-6 border-b border-white/5">
          <div class="flex flex-col gap-4">
            <h2 class="text-xl font-black text-white text-left leading-tight tracking-wide">
              Painel de Negociação
            </h2>
            
            <!-- Mode Switcher -->
            <div class="flex items-center p-1 bg-[#080808] border border-white/5 rounded-xl">
              <button 
                @click="tradingMode = 'manual'"
                class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                :class="tradingMode === 'manual' ? 'bg-zenix-green text-black' : 'text-white/40 hover:text-white'"
              >
                MANUAL
              </button>
              <button 
                @click="tradingMode = 'ai'"
                class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                :class="tradingMode === 'ai' ? 'bg-zenix-green text-black' : 'text-white/40 hover:text-white'"
              >
                SINAIS DE IA
              </button>
            </div>
          </div>
        </div>
        
        <div class="space-y-6 px-1">
          <!-- Mercado -->
          <div>
            <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Mercado</label>
            <button
              @click="openMarketModal"
              class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all text-left flex items-center justify-between"
            >
              <span class="font-medium">{{ selectedMarketLabel }}</span>
              <i class="fas fa-chevron-down text-xs opacity-40"></i>
            </button>
          </div>
          
          <!-- Tipo de Negociação -->
          <div>
            <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Tipo de Negociação</label>
            <button
              @click="openTradeTypeModal"
              class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all text-left flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <img v-if="selectedTradeTypeGroupIcon" :src="selectedTradeTypeGroupIcon" class="w-6 h-6 contrast-[1.5] brightness-[1.5]" alt="" />
                <span class="font-medium">{{ selectedTradeTypeGroupLabel }}</span>
              </div>
              <i class="fas fa-chevron-down text-xs opacity-40"></i>
            </button>
          </div>


          
          <!-- Duração -->
          <div>
            <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Duração</label>
            <div class="flex gap-4">
              <div class="relative flex-1">
                <select 
                  v-model="durationUnit"
                  class="w-full appearance-none bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all cursor-pointer font-medium"
                >
                  <option value="m">Minutos</option>
                  <option value="t">Ticks</option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-40 pointer-events-none"></i>
              </div>
              <input 
                type="number" 
                v-model.number="duration"
                class="w-24 bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white text-center focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
              />
            </div>
          </div>


          
          <!-- Valor de Entrada -->
          <div>
            <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Valor de Entrada</label>
            <input 
              type="number" 
              v-model.number="amount"
              class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
            />
          </div>

          <!-- Multiplicador -->
          <div>
            <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Multiplicador</label>
            <input 
              type="number" 
              v-model.number="multiplier"
              placeholder="Ex: 50, 100, 150..."
              class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
            />
          </div>
          
          <!-- Card de Dígitos de Previsão (apenas para certos contratos de dígitos) -->
          <div v-if="showDigitsPredictionCard" class="bg-zenix-bg border border-zenix-border rounded-lg p-4">
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
            
            <!-- Seleção de Dígito (0-9) para Match, Diff, Over, Under -->
            <div v-if="['DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(tradeType)" class="mt-3 pt-3 border-t border-zenix-border">
              <label class="block text-xs font-medium text-[#DFDFDF88] mb-3">
                <i class="fas fa-bullseye text-zenix-green mr-2"></i>Selecione o Dígito de Previsão
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
          <div v-if="purchasePrice" class="bg-zenix-bg border border-zenix-border rounded-lg p-3 transition-all duration-300">
            <div class="text-[10px] uppercase font-bold text-zenix-secondary mb-1 tracking-wider">Preço de Entrada:</div>
            <div class="text-base font-bold text-zenix-text flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              $ {{ purchasePrice.toFixed(pricePrecision) }}
            </div>
          </div>
          
          <!-- Real-time P&L -->
          <div v-if="realTimeProfit !== null && activeContract" class="w-full bg-zenix-bg border rounded-lg p-3 shadow-lg transition-all duration-300 transform hover:scale-[1.02]" :class="realTimeProfitClass">
            <div class="text-[10px] uppercase font-bold text-zenix-secondary mb-1 tracking-wider">Lucro Atual (Estimado):</div>
            <div class="text-lg font-black flex items-center gap-2" :class="realTimeProfitTextClass">
              <i :class="realTimeProfit >= 0 ? 'fas fa-trending-up' : 'fas fa-trending-down'"></i>
              $ {{ realTimeProfit >= 0 ? '+' : '' }}{{ realTimeProfit.toFixed(pricePrecision) }}
            </div>
          </div>
          
          <!-- Tempo/Ticks Restantes -->
          <div v-if="activeContract && (contractTimeRemaining !== null || contractTicksRemaining !== null)" class="w-full bg-zenix-bg border border-zenix-border rounded-lg p-3 relative overflow-hidden group">
            <!-- Barra de progresso sutil no topo -->
            <div class="absolute top-0 left-0 h-1 bg-zenix-green/30 transition-all duration-1000" :style="{ width: isTickBasedContract ? (100 - (contractTicksRemaining / activeContract.duration * 100)) + '%' : (100 - (contractTimeRemaining / contractDuration * 100)) + '%' }"></div>
            
            <div class="text-[10px] uppercase font-bold text-zenix-secondary mb-1 tracking-wider flex items-center justify-between">
              <span>{{ isTickBasedContract ? 'Ticks Restantes:' : 'Tempo Restante:' }}</span>
              <i class="fas fa-history text-xs"></i>
            </div>
            <div class="text-xl font-black text-zenix-text flex items-baseline gap-1" :class="getCountdownClass">
              <span v-if="isTickBasedContract && contractTicksRemaining !== null">
                {{ contractTicksRemaining }}
              </span>
              <span v-else-if="!isTickBasedContract && contractTimeRemaining !== null">
                {{ formatTimeRemaining(contractTimeRemaining) }}
              </span>
              <span class="text-[10px] text-zenix-secondary font-medium ml-1">RESTANTES</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="pt-3">
            <template v-if="!activeContract">
              <!-- Manual Mode Buttons -->
              <div v-if="tradingMode === 'manual'" class="grid grid-cols-1 gap-3">
                <button 
                  v-for="dir in availableDirections"
                  :key="dir.value"
                  @click="executeTradeWithDirection(dir.value)"
                  :disabled="!canExecuteOrder"
                  :class="[
                    getDirectionButtonClass(dir.value),
                    'font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                  ]"
                >
                  <i :class="getDirectionIcon(dir.value)"></i>
                  {{ dir.label }}
                </button>
              </div>
              
              <!-- AI Mode Display & Button -->
              <div v-else class="space-y-4">
                <!-- AI Signal Info -->
                <div class="w-full bg-zenix-green/5 border border-zenix-green/20 rounded-xl p-5 text-center transition-all duration-300 relative overflow-hidden group flex flex-col items-center justify-center">
                   <div class="absolute inset-0 bg-gradient-to-br from-zenix-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div class="flex flex-col items-center gap-2 relative z-10 w-full">
                     <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest">Sinal da IA</span>
                      <div v-if="aiRecommendation" class="flex flex-col items-center gap-1">
                        <div class="flex items-center gap-3">
                           <i :class="getButtonIcon(aiRecommendation.action) + ' ' + getButtonColor(aiRecommendation.action) + ' text-2xl'"></i>
                           <span :class="getButtonColor(aiRecommendation.action)" class="text-xl font-black">
                             {{ getButtonLabel(aiRecommendation.action) }}
                           </span>
                        </div>
                        <span class="text-[10px] text-white/60 font-bold tracking-wider">{{ aiRecommendation.confidence }}% CONFIABILIDADE</span>
                     </div>
                     <div v-else class="flex flex-col items-center gap-2 py-2">
                        <button 
                          @click="toggleAnalysis"
                          :disabled="isAnalyzing"
                          class="flex flex-col items-center gap-2 group hover:scale-105 transition-transform"
                        >
                          <div class="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/5 group-hover:bg-zenix-green/10 group-hover:border-zenix-green/30 transition-all relative" :class="{ 'animate-pulse': isAnalyzing }">
                            <i class="fas fa-robot text-xl" :class="isAnalyzing ? 'text-zenix-green' : 'text-white/20'"></i>
                            <div v-if="isAnalyzing" class="absolute inset-0 rounded-full border border-zenix-green/50 animate-ping"></div>
                          </div>
                          <div class="flex flex-col items-center">
                            <span class="text-xs font-bold transition-colors" :class="isAnalyzing ? 'text-zenix-green' : 'text-white/40 group-hover:text-white/60 uppercase tracking-tighter'">
                              {{ isAnalyzing ? 'Analisando...' : 'Gerar Sinal de IA' }}
                            </span>
                            <span v-if="!isAnalyzing" class="text-[9px] text-white/20 uppercase tracking-widest font-medium">Toque para iniciar</span>
                          </div>
                        </button>
                     </div>
                   </div>
                </div>

                <!-- Timer Section -->
                <div v-if="signalCountdown !== null" class="flex flex-col items-center justify-center p-4 bg-[#080808] border border-white/5 rounded-xl relative overflow-hidden">
                    <div class="absolute bottom-0 left-0 h-0.5 bg-zenix-green transition-all duration-1000" :style="{ width: (signalCountdown / (aiRecommendation?.entry_time || 1) * 100) + '%' }"></div>
                    <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Janela de Entrada</span>
                    <span class="text-3xl font-black text-zenix-green tabular-nums leading-none">{{ signalCountdown }}s</span>
                </div>

                <!-- AI Execute Button -->
                <button 
                  @click="executeAIOrder"
                  :disabled="!canExecuteAIOrder"
                  class="w-full bg-zenix-green hover:bg-zenix-green-hover text-black font-bold py-5 rounded-xl transition-all text-base flex flex-col items-center justify-center gap-1 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-95"
                >
                  <div class="flex items-center gap-2">
                    <i class="fas fa-bolt"></i>
                    <span class="tracking-tighter">EXECUTAR OPERAÇÃO</span>
                  </div>
                  <span v-if="aiRecommendation" class="text-[10px] opacity-70 font-bold uppercase tracking-widest">Seguir inteligência artificial</span>
                </button>
              </div>
            </template>
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
        <div class="modal-content categorized-modal">
          <div class="modal-header">
            <h3 class="modal-title">Selecionar Mercado</h3>
            <button @click="closeMarketModal" class="modal-close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="categories-grid">
              <div v-for="(markets, category) in marketsByCategory" :key="category" class="category-card">
                <div class="category-card-header">
                  <div class="category-icon-wrapper">
                    <svg v-if="category === 'Índices Contínuos'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11L13.5 15.5L8.5 10.5L2 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 11H22V17" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="category === 'Criptomoedas'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                      <path d="M9 12H15M12 9V15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="category === 'Major Pairs' || category === 'Forex Minors' || category === 'Forex Exotics'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                        <path d="M15 9L9 15M9 9L15 15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                        <path d="M12 2V22" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="category === 'Metais'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4L18 4L21 9L12 21L3 9L6 4Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 9H21" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 21V9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <i v-else class="fas fa-ellipsis-h text-white"></i>
                  </div>
                  <h4 class="category-card-title">{{ category }}</h4>
                </div>
                <div class="category-items-list">
                  <button
                    v-for="market in markets"
                    :key="market.value"
                    @click="selectMarket(market.value)"
                    :class="['category-item-btn', { 'active': symbol === market.value }]"
                  >
                    {{ market.label }}
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
        <div class="modal-content categorized-modal">
          <div class="modal-header">
            <h3 class="modal-title">Selecionar Tipo de Negociação</h3>
            <button @click="closeTradeTypeModal" class="modal-close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="categories-grid">
              <div v-for="category in availableTradeTypeGroups" :key="category.id" class="category-card">
                <div class="category-card-header">
                  <div class="category-icon-wrapper">
                    <svg v-if="category.id === 'rising_falling'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11L13.5 15.5L8.5 10.5L2 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 11H22V17" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="category.id === 'digits'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 9H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 15H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M10 3L8 21" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 3L14 21" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="category.id === 'accumulators'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="category.id === 'multipliers'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                      <path d="M15 9L9 15M9 9L15 15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <i v-else :class="category.icon"></i>
                  </div>
                  <h4 class="category-card-title">{{ category.label }}</h4>
                </div>
                <div class="category-items-list">
                  <button
                    v-for="item in category.items"
                    :key="item.value"
                    @click="selectTradeType(item)"
                    :class="['category-item-btn', { 'active': selectedTradeTypeGroup === item.value }]"
                  >
                    <div class="flex items-center gap-2">
                      <img v-if="item.icon" :src="`/deriv_icons/${item.icon}`" class="w-5 h-5 contrast-[1.5] brightness-[1.5]" alt="" />
                      <span>{{ item.label }}</span>
                    </div>
                  </button>
                </div>
              </div>
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

const APP_ID = process.env.VUE_APP_DERIV_APP_ID || '1089';

export default {
  name: 'OperationChart',
  components: {
  },
  data() {
    return {
      isMobile: false,
      isGlobalLoading: true, // Iniciar com loader bloqueante
      showChartPlaceholder: false,
      tradingMode: 'manual', // 'manual' ou 'ai'
      activeTab: 'chart', // 'chart' ou 'digits'
      digitFrequency: { digits: [], frequency: {}, parity: { even: 0, odd: 0 } },
      frequencies25: [],
      frequencies50: [],
      frequencies100: [],
      chart: null,
      chartSeries: null,
      symbol: 'R_100',
      tradeType: 'CALL',
        duration: 1,
        durationUnit: 'm',
      amount: 10,
      currency: 'USD', // Moeda da conta
      accountInfo: null,
      showMarketModal: false,
      showTradeTypeModal: false,
      showTradeResultModal: false,
      finalTradeProfit: 0,
      finalTradeType: 'CALL',
      finalEntrySpot: null,
      finalExitSpot: null,
      markets: [], // Será preenchido pela API
      isLoadingMarkets: true,
      isLoadingTicks: true,
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
      multiplier: 100, // Valor padrão do multiplicador
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
      signalCountdown: null,
      signalCountdownInterval: null,
      collectedTicks: [], // Ticks coletados para análise
      // Chart Type
      chartType: 'line', // 'line' ou 'candles'
      storedTicks: [], // Armazenar ticks para conversão em velas
      entrySpotLine: null, // Linha tracejada indicando o momento da compra
      // Zoom
      zoomPeriod: 10, // Período de zoom em minutos: 10, 5 ou 3
      allHistoricalTicks: [], // Armazenar todos os ticks históricos recebidos
      selectedTimeframe: 60, // Timeframe padrão para velas (1 minuto em segundos) - velas menores
      chartPointsVisible: 100, // Número de pontos/velas visíveis no gráfico
      selectedTradeTypeGroup: 'rising_falling_rise_fall',
      // Direct WS State
      ws: null,
      wsIsConnecting: false,
      wsAuthorized: false,
      wsConnectionError: null,
      wsRetryTimer: null,
      wsToken: null,
      tickSubscriptionId: null,
      tradeTypeCategories: [
        {
          id: 'digits',
          label: 'Dígitos',
          icon: 'fas fa-hashtag',
          items: [
            { value: 'digits_over_under', label: 'Superior / Inferior', icon: 'TradeTypesDigitsOverIcon.svg', directions: [
                { value: 'DIGITOVER', label: 'Superior' },
                { value: 'DIGITUNDER', label: 'Inferior' }
              ]
            },
            { value: 'digits_match_diff', label: 'Combina / Difere', icon: 'TradeTypesDigitsMatchesIcon.svg', directions: [
                { value: 'DIGITMATCH', label: 'Combina' },
                { value: 'DIGITDIFF', label: 'Difere' }
              ]
            },
            { value: 'digits_even_odd', label: 'Par / Ímpar', icon: 'TradeTypesDigitsEvenIcon.svg', directions: [
                { value: 'DIGITEVEN', label: 'Par' },
                { value: 'DIGITODD', label: 'Ímpar' }
              ]
            }
          ]
        },
        {
          id: 'rising_falling',
          label: 'Subindo ou Descendo',
          icon: 'fas fa-chart-line',
          items: [
            { value: 'rising_falling_rise_fall_equal', label: 'Subida/Queda Igual', icon: 'TradeTypesUpsAndDownsRiseIcon.svg', directions: [
                { value: 'CALLE', label: 'Subida Igual' },
                { value: 'PUTE', label: 'Queda Igual' }
              ]
            },
            { value: 'rising_falling_rise_fall', label: 'Subida/Queda', icon: 'TradeTypesUpsAndDownsRiseIcon.svg', directions: [
                { value: 'CALL', label: 'Subida' },
                { value: 'PUT', label: 'Queda' }
              ] 
            },
            { value: 'reset_high_low', label: 'Reset Alta/Baixa', icon: 'TradeTypesUpsAndDownsResetUpIcon.svg', directions: [
                { value: 'RESETCALL', label: 'Reset Alta' },
                { value: 'RESETPUT', label: 'Reset Baixa' }
              ]
            },
            { value: 'runs_high_low', label: 'Somente Altas / Somente Quedas', icon: 'TradeTypesUpsAndDownsOnlyUpsIcon.svg', directions: [
                { value: 'RUNHIGH', label: 'Somente Altas' },
                { value: 'RUNLOW', label: 'Somente Quedas' }
              ]
            },
            { value: 'tick_high_low', label: 'Máxima/Mínima por Ticks', icon: 'TradeTypesHighsAndLowsHighIcon.svg', directions: [
                { value: 'TICKHIGH', label: 'Máxima' },
                { value: 'TICKLOW', label: 'Mínima' }
              ]
            }
          ]
        },
        {
          id: 'one_barrier',
          label: 'Uma Barreira',
          icon: 'fas fa-bullseye',
          items: [
            { value: 'touch_no_touch', label: 'Toca / Não Toca', icon: 'TradeTypesHighsAndLowsTouchIcon.svg', directions: [
                { value: 'ONETOUCH', label: 'Toca' },
                { value: 'NOTOUCH', label: 'Não Toca' }
              ]
            },
            { value: 'higher_lower', label: 'Maior / Menor', icon: 'TradeTypesHighsAndLowsHigherIcon.svg', directions: [
                { value: 'HIGHER', label: 'Maior' },
                { value: 'LOWER', label: 'Menor' }
              ]
            }
          ]
        },
        {
          id: 'two_barriers',
          label: 'Duas Barreiras',
          icon: 'fas fa-shield-alt',
          items: [
            { value: 'in_out', label: 'Permanece Dentro / Sai Fora', icon: 'TradeTypesInsAndOutsStaysInIcon.svg', directions: [
                { value: 'RANGE', label: 'Permanece Dentro' },
                { value: 'UPORDOWN', label: 'Sai Fora' }
              ]
            },
            { value: 'ends_in_out', label: 'Termina Dentro / Termina Fora', icon: 'TradeTypesInsAndOutsEndsInIcon.svg', directions: [
                { value: 'EXPIRYRANGE', label: 'Termina Dentro' },
                { value: 'EXPIRYMISS', label: 'Termina Fora' }
              ]
            }
          ]
        },
        {
          id: 'no_expiry',
          label: 'Sem Vencimento',
          icon: 'fas fa-bolt',
          items: [
            { value: 'multipliers_mult', label: 'Multiplicadores', icon: 'TradeTypesMultipliersUpIcon.svg', directions: [
                { value: 'MULTUP', label: 'Alta' },
                { value: 'MULTDOWN', label: 'Baixa' }
              ]
            },
            { value: 'accumulators_accu', label: 'Acumuladores', icon: 'TradeTypesAccumulatorStayInIcon.svg', directions: [
                { value: 'ACCU', label: 'Acumuladores' }
              ]
            }
          ]
        }
      ],
      allTradeTypes: [
        { value: 'CALL', label: 'Subida', description: 'Apostar que o preço subirá', icon: 'fas fa-arrow-up' },
        { value: 'PUT', label: 'Queda', description: 'Apostar que o preço cairá', icon: 'fas fa-arrow-down' },
        { value: 'DIGITMATCH', label: 'Combina', description: 'O último dígito será igual', icon: 'fas fa-equals' },
        { value: 'DIGITDIFF', label: 'Difere', description: 'O último dígito será diferente', icon: 'fas fa-not-equal' },
        { value: 'DIGITEVEN', label: 'Par', description: 'O último dígito será par', icon: 'fas fa-divide' },
        { value: 'DIGITODD', label: 'Ímpar', description: 'O último dígito será ímpar', icon: 'fas fa-percent' },
        { value: 'DIGITOVER', label: 'Superior', description: 'O último dígito será maior', icon: 'fas fa-greater-than' },
        { value: 'DIGITUNDER', label: 'Inferior', description: 'O último dígito será menor', icon: 'fas fa-less-than' },
        { value: 'CALLE', label: 'Subida Igual', description: 'Subida com barreira igual', icon: 'fas fa-arrow-up-right-dots' },
        { value: 'PUTE', label: 'Queda Igual', description: 'Queda com barreira igual', icon: 'fas fa-arrow-down-right-dots' },
        { value: 'ACCU', label: 'Acumuladores', description: 'Contrato de acumuladores', icon: 'fas fa-layer-group' },
        { value: 'MULTUP', label: 'Alta', description: 'Multiplicador de alta', icon: 'fas fa-chart-line' },
        { value: 'MULTDOWN', label: 'Baixa', description: 'Multiplicador de baixa', icon: 'fas fa-chart-line' },
        { value: 'RESETCALL', label: 'Reset Alta', description: 'Reset de alta', icon: 'fas fa-redo' },
        { value: 'RESETPUT', label: 'Reset Baixa', description: 'Reset de baixa', icon: 'fas fa-redo' },
        { value: 'RUNHIGH', label: 'Somente Altas', description: 'Somente altas', icon: 'fas fa-arrow-trend-up' },
        { value: 'RUNLOW', label: 'Somente Quedas', description: 'Somente quedas', icon: 'fas fa-arrow-trend-down' },
        { value: 'TICKHIGH', label: 'Máxima', description: 'Máxima do intervalo', icon: 'fas fa-arrows-up-to-line' },
        { value: 'TICKLOW', label: 'Mínima', description: 'Mínima do intervalo', icon: 'fas fa-arrows-down-to-line' },
        { value: 'ONETOUCH', label: 'Toca', description: 'O preço toca a barreira', icon: 'fas fa-bullseye' },
        { value: 'NOTOUCH', label: 'Não Toca', description: 'O preço não toca a barreira', icon: 'fas fa-circle-xmark' },
        { value: 'HIGHER', label: 'Maior', description: 'Termina acima da barreira', icon: 'fas fa-chevron-up' },
        { value: 'LOWER', label: 'Menor', description: 'Termina abaixo da barreira', icon: 'fas fa-chevron-down' },
        { value: 'RANGE', label: 'Permanece Dentro', description: 'Fica entre as barreiras', icon: 'fas fa-arrows-left-right-to-line' },
        { value: 'UPORDOWN', label: 'Sai Fora', description: 'Sai do intervalo', icon: 'fas fa-arrows-left-right' },
        { value: 'EXPIRYRANGE', label: 'Termina Dentro', description: 'Termina no intervalo', icon: 'fas fa-square-full' },
        { value: 'EXPIRYMISS', label: 'Termina Fora', description: 'Termina fora do intervalo', icon: 'fas fa-expand' },
      ],
    };
  },
  computed: {
    isLoading() {
      return this.isLoadingMarkets || this.isLoadingContracts || this.isLoadingTicks;
    },
    digitFrequencies() {
      const counts = new Array(10).fill(0);
      const totalDigits = this.digitFrequency.digits.length;

      this.digitFrequency.digits.forEach(digit => {
        if (digit >= 0 && digit <= 9) {
          counts[digit]++;
        }
      });

      return counts.map((count, index) => {
        const percentage = totalDigits > 0 ? (count / totalDigits) * 100 : 0;
        const p = (count / totalDigits) * 100;

        let statusClass; // Removed barHeight from here as it's less used in chart unless needed

        if (p >= 11.5) {
            statusClass = 'status-max';
        } else if (p >= 10.0) {
            statusClass = 'status-heated';
        } else if (p <= 9.0) {
            statusClass = 'status-min';
        } else {
            statusClass = 'status-underheated';
        }

        return {
          digit: index,
          count,
          percentage: Math.round(percentage * 10) / 10,
          statusClass,
          isMax: statusClass === 'status-max',
          isMin: statusClass === 'status-min',
          isHighlighted: false
        };
      });
    },
    digitFrequenciesWithStats() {
      const totalDigits = this.digitFrequency.digits.length;
      if (totalDigits === 0) {
        return Array.from({ length: 10 }, (_, i) => ({
          digit: i,
          percentage: 0,
          statusClass: 'status-normal',
          isMax: false,
          isMin: false,
          isHighlighted: false
        }));
      }
      
      const frequencies = this.digitFrequencies;
      
      // Encontrar max e min percentagem
      let maxP = -1;
      let minP = 101;
      
      frequencies.forEach(item => {
          if (item.percentage > maxP) maxP = item.percentage;
          if (item.percentage < minP) minP = item.percentage;
      });
      
      // Flags para garantir apenas um de cada
      let maxFound = false;
      let minFound = false;
      
      return frequencies.map(item => {
        const p = item.percentage;
        let isMax = false;
        let isMin = false;
        // Default status
        let statusClass = 'status-normal';

        // Prioridade para Max/Min (apenas o primeiro encontrado)
        // Se empatar, apenas o primeiro ganha o status principal
        if (p === maxP && !maxFound) {
            isMax = true;
            maxFound = true;
            statusClass = 'status-max';
        } else if (p === minP && !minFound) {
            isMin = true;
            minFound = true;
            statusClass = 'status-min';
        } else {
             // Secundário: se não é max/min absoluto, pode ser heated
             if (p >= 10) {
                statusClass = 'status-heated';
             }
        }
        
        return {
          digit: item.digit,
          percentage: item.percentage.toFixed(1),
          statusClass,
          isMax,
          isMin,
          isHighlighted: false
        };
      });
    },
    mostFrequentDigit() {
        if (!this.digitFrequenciesWithStats || this.digitFrequenciesWithStats.length === 0) return null;
        // Clone and sort descending
        const sorted = [...this.digitFrequenciesWithStats].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
        return sorted[0];
    },
    leastFrequentDigit() {
        if (!this.digitFrequenciesWithStats || this.digitFrequenciesWithStats.length === 0) return null;
        // Clone and sort ascending
        const sorted = [...this.digitFrequenciesWithStats].sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
        return sorted[0];
    },
    dvxValueComputed() {
      if (this.digitFrequency.digits.length < 20) {
        return 0;
      }
      const frequencies = this.digitFrequencies;
      const expected = 10;
      let variance = 0;
      frequencies.forEach(f => {
        variance += Math.pow(f.percentage - expected, 2);
      });
      const stdDev = Math.sqrt(variance / 10);
      const val = Math.min(100, Math.round((stdDev / 25) * 100));
      return val;
    },
    dvxStatusClass() {
      const val = this.dvxValueComputed;
      if (val <= 30) return 'dvx-status-green';
      if (val <= 60) return 'dvx-status-yellow';
      return 'dvx-status-red';
    },
    dvxStatusText() {
      const val = this.dvxValueComputed;
      if (val <= 30) return 'Volatilidade Baixa';
      if (val <= 60) return 'Volatilidade Moderada';
      return 'Volatilidade Alta';
    },
    dvxEnvironmentText() {
      const val = this.dvxValueComputed;
      if (val <= 30) return 'estável';
      if (val <= 60) return 'moderado';
      return 'arriscado';
    },
    evenPercentage() {
      const total = this.digitFrequency.digits.length;
      if (total === 0) return 0;
      const evenCount = this.digitFrequency.digits.filter(d => d % 2 === 0).length;
      return Math.round((evenCount / total) * 100);
    },
    oddPercentage() {
      return 100 - this.evenPercentage;
    },
    parityRecommendationText() {
      const even = this.evenPercentage;
      const odd = this.oddPercentage;
      const diff = Math.abs(even - odd);
      if (diff < 5) return 'Distribuição equilibrada — sem vantagem clara';
      return even > 55 ? 'Próximo tick: maior probabilidade de ÍMPAR (ODD)' : 'Próximo tick: maior probabilidade de PAR (EVEN)';
    },
    lowCount() {
      return this.digitFrequency.digits.filter(d => d >= 0 && d <= 4).length;
    },
    highCount() {
      return this.digitFrequency.digits.filter(d => d >= 5 && d <= 9).length;
    },
    lowPercentage() {
      const total = this.digitFrequency.digits.length;
      return total > 0 ? Math.round((this.lowCount / total) * 100 * 10) / 10 : 0;
    },
    highPercentage() {
      const total = this.digitFrequency.digits.length;
      return total > 0 ? Math.round((this.highCount / total) * 100 * 10) / 10 : 0;
    },
    highLowRecommendationText() {
      const low = this.lowPercentage;
      const high = this.highPercentage;
      const diff = Math.abs(low - high);
      if (diff < 5) return 'Distribuição equilibrada — sem vantagem clara';
      return low > 55 ? 'Próximo tick: maior probabilidade de ALTO (OVER 4)' : 'Próximo tick: maior probabilidade de BAIXO (UNDER 5)';
    },
    // Histórico Recente de Dígitos
    recentDigits() {
        if (!this.digitFrequency || !this.digitFrequency.digits) return [];
        return this.digitFrequency.digits.slice(-15).reverse();
    },
    dvxGreenOffset() {
      const len = 90.2;
      const fill = Math.min(30, this.dvxValueComputed) / 30;
      return len * (1 - fill);
    },
    dvxYellowOffset() {
      const len = 102.4;
      const val = Math.max(0, this.dvxValueComputed - 30);
      const fill = Math.min(30, val) / 30;
      return len * (1 - fill);
    },
    dvxRedOffset() {
      const len = 90.2;
      const val = Math.max(0, this.dvxValueComputed - 60);
      const fill = Math.min(40, val) / 40;
      return len * (1 - fill);
    },
    marketsByCategory() {
      const grouped = {};
      
      // Categorias na ordem de prioridade desejada
      const categoryPriority = {
        'Índices Contínuos': 1,
        'Daily Reset Indices': 2,
        'Indices Step': 3,
        'Jump Indices': 4,
        'Boom/Crash': 5,
        'Criptomoedas': 6,
        'Major Pairs': 7, // Forex Majors
        'Minor Pairs': 8, // Forex Minors
        'Outros': 99
      };

      // Mapeamento de nomes amigáveis baseados na imagem do usuário
      const nameMap = {
        'Indices Step': 'Índices Step',
        'Jump Indices': 'Índices JUMP',
        'Boom/Crash': 'Índices Crash/Boom',
        'Daily Reset Indices': 'Índices Daily Reset',
        'Major Pairs': 'Forex',
        'Minor Pairs': 'Forex Minors'
      };
      
      this.markets.forEach(market => {
          let category = market.category || 'Outros';
          
          // Aplicar mapeamento de nomes amigáveis
          if (nameMap[category]) {
              category = nameMap[category];
          }

          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(market);
      });

      // Ordenar as chaves do objeto agrupado com base na prioridade
      const sortedGrouped = {};
      const categories = Object.keys(grouped).sort((a, b) => {
          const pA = categoryPriority[a] || categoryPriority[Object.keys(nameMap).find(k => nameMap[k] === a)] || 99;
          const pB = categoryPriority[b] || categoryPriority[Object.keys(nameMap).find(k => nameMap[k] === b)] || 99;
          return pA - pB;
      });

      categories.forEach(cat => {
          sortedGrouped[cat] = grouped[cat];
      });

      return sortedGrouped;
    },
    selectedMarketLabel() {
      const market = this.markets.find(m => m.value === this.symbol);
      return market ? market.label : 'Selecione um mercado';
    },
    selectedTradeTypeGroupLabel() {
      for (const cat of this.tradeTypeCategories) {
        const item = cat.items.find(i => i.value === this.selectedTradeTypeGroup);
        if (item) return item.label;
      }
      return 'Selecionar Tipo';
    },
    selectedTradeTypeGroupIcon() {
      for (const cat of this.tradeTypeCategories) {
        const item = cat.items.find(i => i.value === this.selectedTradeTypeGroup);
        if (item && item.icon) return `/deriv_icons/${item.icon}`;
      }
      return null;
    },
    availableDirections() {
      for (const cat of this.tradeTypeCategories) {
        const item = cat.items.find(i => i.value === this.selectedTradeTypeGroup);
        if (item) return item.directions;
      }
      return [];
    },
    selectedTradeTypeLabel() {
      if (!this.tradeType) {
        return 'Selecione o tipo';
      }
      for (const cat of this.tradeTypeCategories) {
        const item = cat.items.find(i => i.directions.some(d => d.value === this.tradeType));
        if (item) {
          const dir = item.directions.find(d => d.value === this.tradeType);
          return dir ? dir.label : item.label;
        }
      }
      return this.tradeType;
    },
    availableTradeTypeGroups() {
      // Filtrar categorias e itens baseados nos contratos disponíveis reais da Deriv
      const availableTypes = this.availableTradeTypes.map(t => t.value.toUpperCase());
      
      return this.tradeTypeCategories.map(category => {
        const filteredItems = category.items.filter(item => {
          // Um item é exibido se pelo menos uma de suas direções estiver disponível
          return item.directions.some(dir => availableTypes.includes(dir.value.toUpperCase()));
        });
        
        if (filteredItems.length > 0) {
          return {
            ...category,
            items: filteredItems
          };
        }
        return null;
      }).filter(Boolean);
    },
    currentTradeTypePair() {
      if (!this.selectedTradeTypeGroup) return null;
      for (const cat of this.tradeTypeCategories) {
        const item = cat.items.find(i => i.value === this.selectedTradeTypeGroup);
        if (item) return item;
      }
      return null;
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
    showDigitsPredictionCard() {
      const excludedTypes = ['DIGITEVEN', 'DIGITODD'];
      return this.isDigitContract && !excludedTypes.includes(this.tradeType) && this.latestTick && this.tradingMode !== 'ai';
    },
    canExecuteOrder() {
      return this.symbol && this.duration && this.amount && !this.isTrading && !this.activeContract;
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
    canExecuteAIOrder() {
      return this.aiRecommendation && this.canExecuteOrder;
    },
  },
  async mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    // 1. Inicializar WS Direto (Dados de Mercado)
    this.initDirectConnection();

    // 2. Configurar Stream SSE (Para envio de ordens e atualizações)
    await this.setupStream();
    
    this.initChart();
    
    // 3. Carregar dados iniciais
    await this.fetchMarkets(); // Carregar mercados do backend

    if (!this.symbol) {
        this.symbol = 'R_100'; // Default
    }

    if (this.symbol) {
      console.log('[Chart] Carregando contratos para:', this.symbol);
      this.loadAvailableContracts(this.symbol);
      // Ticks são carregados via WS (subscribeWSTicks chamado no onWSConnected)
    }
    
    // Fallback de segurança para remover o loader
    setTimeout(() => {
      if (this.isGlobalLoading) {
        console.warn('[Chart] Timeout de carregamento inicial. Removendo loader.');
        this.isGlobalLoading = false;
      }
    }, 10000);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
    this.stopDirectConnection();
    
    // Parar análise
    this.stopAnalysis();
    
    // Parar contador de contrato
    this.stopContractCountdown();
    
    // Remover linha de compra
    this.removeEntrySpotLine();
    
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

    setTab(tabName) {
      if (tabName === 'chart' || tabName === 'digits') {
        this.activeTab = tabName;
        this.$emit('tab-changed', tabName);
        
        if (tabName === 'chart') {
            // Re-inicializar gráfico pois o container foi removido do DOM (v-if)
            this.$nextTick(() => {
                if (!this.chart) {
                    this.initChart();
                    // Pequeno delay para garantir renderização correta
                    setTimeout(() => {
                         this.updateChartData(); 
                    }, 50);
                } else {
                    const container = this.$refs.chartContainer;
                    if (container) {
                        this.chart.resize(container.clientWidth, container.clientHeight);
                    }
                }
            });
        } else {
            // Limpar referência do gráfico ao sair da aba
            if (this.chart) {
                this.chart.remove();
                this.chart = null;
                this.chartSeries = null;
            }
        }
      }
    },
    getStatusColor(statusClass) {
      const colors = {
        'status-overheated': '#FFFFFF', 
        'status-max': '#22C55E',      // Intense Green
        'status-min': '#B91C1C',      // Dark Red
        'status-heated': '#F59E0B',
        'status-underheated': '#64748B',
        'status-normal': '#FFFFFF'
      };
      return colors[statusClass] || '#FFFFFF';
    },
    // WebSocket Methods (Refactored)
    async initDirectConnection() {
      console.log('[Chart] Iniciando conexão WebSocket direta');
      this.stopDirectConnection();

      this.wsIsConnecting = true;
      this.wsConnectionError = null;

      // Obter token (opcional para dados públicos, mas recomendado)
      try {
        this.wsToken = await this.getTokenForAccount();
      } catch (e) {
        console.warn('[Chart] Erro ao obter token:', e);
      }

      const appId = localStorage.getItem('deriv_app_id') || APP_ID;
      const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
      
      this.ws = new WebSocket(endpoint);

      this.ws.onopen = () => {
        console.log('[Chart] WebSocket conectado!');
        if (this.wsToken) {
           this.wsSend({ authorize: this.wsToken });
        } else {
           // Sem token, iniciar dados públicos
           this.onWSConnected();
        }
      };

      this.ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            this.handleWSMessage(msg);
        } catch (e) {
            console.error('[Chart] Erro JSON WS:', e);
        }
      };

      this.ws.onerror = (e) => {
        console.error('[Chart] Erro WS:', e);
        this.wsConnectionError = 'Erro de conexão com mercado.';
      };

      this.ws.onclose = () => {
        console.warn('[Chart] WebSocket fechado. Reconectando...');
        this.wsIsConnecting = false;
        this.wsAuthorized = false;
        this.scheduleWSRetry();
      };
    },

    stopDirectConnection() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      if (this.wsRetryTimer) {
        clearTimeout(this.wsRetryTimer);
        this.wsRetryTimer = null;
      }
      this.tickSubscriptionId = null;
    },

    scheduleWSRetry() {
      if (this.wsRetryTimer) return;
      this.wsRetryTimer = setTimeout(() => {
        this.wsRetryTimer = null;
        this.initDirectConnection();
      }, 3000);
    },

    wsSend(payload) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload));
      } else {
        console.warn('[Chart] Tentativa de envio com WS fechado:', payload);
      }
    },

    onWSConnected() {
        // No longer subscribing to active_symbols via WS
        // this.subscribeWSActiveSymbols(); 
        this.subscribeWSTicks();
    },

    handleWSMessage(msg) {
        if (msg.error) {
            console.warn('[Chart] Erro da API Deriv:', msg.error.code, msg.error.message);
            if (msg.msg_type === 'buy') {
                this.tradeError = msg.error.message;
                this.isTrading = false;
            }
            return;
        }

        switch (msg.msg_type) {
            case 'authorize':
                this.wsAuthorized = true;
                if (msg.authorize) {
                  this.currency = msg.authorize.currency || 'USD';
                  this.accountInfo = msg.authorize;
                  console.log('[Chart] WS Autorizado. Moeda:', this.currency);
                }
                this.onWSConnected();
                break;
            case 'history':
                this.processWSHistory(msg);
                break;
            case 'tick':
                this.processWSTick(msg.tick);
                break;
            case 'buy': { // Resposta da Compra Direta
                console.log('[Chart] Confirmação de compra recebida via WS:', msg.buy);
                this.processBuy(msg.buy);
                
                // NOTIFICAR BACKEND sobre a compra (sync)
                const buyPayload = {
                    contractId: msg.buy.contract_id,
                    buyPrice: msg.buy.buy_price,
                    transactionId: msg.buy.transaction_id,
                    shortcode: msg.buy.shortcode,
                    symbol: this.symbol, // msg.buy usually doesn't have symbol
                    contractType: this.tradeType, // msg.buy usually doesn't have contract_type
                    duration: this.duration,
                    durationUnit: this.durationUnit,
                    entryTime: msg.buy.start_time,
                    entrySpot: null // Usually entry spot comes later or we take latest tick
                };
                derivTradingService.notifyBuy(buyPayload);

                // Inscrever para atualizações do contrato
                if (msg.buy.contract_id) {
                    this.wsSend({
                        proposal_open_contract: 1,
                        contract_id: msg.buy.contract_id,
                        subscribe: 1
                    });
                }
                break;
            }
            case 'proposal_open_contract': // Atualizações do Contrato
                this.processContract(msg.proposal_open_contract);
                break;
        }
    },

    // subscribeWSActiveSymbols removed
    
    subscribeWSTicks() {
        if (!this.symbol) return;
        
        console.log('[Chart] Solicitando histórico de ticks via WS para:', this.symbol);
        this.isLoadingTicks = true;
        
        // Cancelar assinatura anterior
        if (this.tickSubscriptionId) {
            this.wsSend({ forget: this.tickSubscriptionId });
            this.tickSubscriptionId = null;
        }

        // Solicitar histórico + subscribe
        this.wsSend({
            ticks_history: this.symbol,
            end: 'latest',
            count: 500, // Ajustado para correspondência com Digits para melhor performance
            style: 'ticks',
            subscribe: 1
        });
    },

    // processWSActiveSymbols removed

    processWSHistory(msg) {
        const history = msg.history;
        if (!history || !history.prices) return;

        console.log('[Chart] Histórico WS recebido:', history.prices.length, 'ticks');
        this.isLoadingTicks = false;
        
        // Converter formato WS {prices:[], times:[]} para [{value, epoch}]
        const ticks = history.prices.map((price, i) => ({
            value: Number(price),
            epoch: Number(history.times[i])
        }));

        // Armazenar ID da assinatura para updates futuros
        if (msg.subscription && msg.subscription.id) {
            this.tickSubscriptionId = msg.subscription.id;
        }

        this.processHistoryData(ticks);
    },

    processWSTick(tick) {
        if (!tick) return;
        
        // Atualizar ID se recebido no tick
        if (tick.id && !this.tickSubscriptionId) {
            this.tickSubscriptionId = tick.id;
        }

        // Converter para formato interno
        const tickData = {
            value: Number(tick.quote),
            epoch: Number(tick.epoch)
        };

        // Adicionar ao gráfico e processar
        this.handleNewTick(tickData);
        
        // Determinar precisão se ainda não tiver (dinâmico)
        if (tick.quote) {
          const str = String(tick.quote);
          if (str.includes('.')) {
            const precision = str.split('.')[1].length;
            if (precision !== this.pricePrecision) {
              console.log(`[Chart] Ajustando precisão para ${this.symbol}: ${precision}`);
              this.pricePrecision = precision;
            }
          }
        }
    },



    // Refatoração: Lógica comum de processamento de histórico
    processHistoryData(ticks) {
            // Armazenar todos os ticks históricos (garantir que epoch está em segundos)
            this.allHistoricalTicks = ticks.map(tick => {
              let epoch = Number(tick.epoch || tick.time);
              if (epoch > 10000000000) epoch = Math.floor(epoch / 1000);
              return { value: Number(tick.value), epoch: epoch };
            });
            
            this.allHistoricalTicks.sort((a, b) => a.epoch - b.epoch);
            
            const filteredTicks = this.filterTicksByZoom(this.allHistoricalTicks);
            
            if (this.isAnalyzing && filteredTicks.length > 0) {
              filteredTicks.forEach(tick => {
                this.collectTickForAnalysis({ value: tick.value, epoch: tick.epoch });
              });
            }
            
            if (filteredTicks.length > 0) {
              this.plotTicks(filteredTicks);
            } else if (this.allHistoricalTicks.length > 0) {
                const last100Ticks = this.allHistoricalTicks.slice(-100);
                this.plotTicks(last100Ticks);
            }
            
            this.isGlobalLoading = false;
            this.calculateDigitFrequency();
    },

    // Refatoração: Lógica comum de processamento de novo tick
    handleNewTick(tick) {
            const tickValue = Number(tick.value);
            const tickEpochOriginal = Math.floor(Number(tick.epoch));
            const tickEpochBrasilia = tickEpochOriginal - (3 * 60 * 60);
            
            if (!isNaN(tickValue) && isFinite(tickValue) && tickValue > 0 &&
                !isNaN(tickEpochOriginal) && isFinite(tickEpochOriginal) && tickEpochOriginal > 0) {
              
              this.latestTick = { value: tickValue, epoch: tickEpochBrasilia };
              
              const newTick = { value: tickValue, epoch: tickEpochOriginal };
              this.allHistoricalTicks.push(newTick);
              
              const now = Math.floor(Date.now() / 1000);
              const maxPeriod = Math.max(this.zoomPeriod * 60, 10 * 60);
              const cutoffTime = now - maxPeriod;
              this.allHistoricalTicks = this.allHistoricalTicks.filter(t => t.epoch >= cutoffTime);
              
              const zoomCutoff = now - (this.zoomPeriod * 60);
              if (tickEpochOriginal >= zoomCutoff) {
                this.addTickToChart({ time: tickEpochBrasilia, value: tickValue });
              }
              
              if (this.entrySpotLine && this.activeContract) this.updateEntrySpotLine();
              
              if (this.isAnalyzing) {
                this.collectTickForAnalysis({ value: tickValue, epoch: tickEpochOriginal });
              }
              
              if (this.isDigitContract) this.updateDigitInfo(tickValue);
              
              if (this.activeContract) {
                this.updateRealTimeProfit();
                if (this.isTickBasedContract && this.contractTicksRemaining !== null) {
                  this.contractTickCount++;
                  this.contractTicksRemaining = Math.max(0, (this.activeContract.duration || this.duration || 1) - this.contractTickCount);
                  if (this.contractTicksRemaining <= 0) {
                    this.handleContractExpiration({ status: 'expired' });
                  }
                }
              }
            }
            
            this.calculateDigitFrequency();
            if (this.isGlobalLoading) this.isGlobalLoading = false;
    },


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
              rightOffset: 0, // ✅ Garantir que o gráfico comece da esquerda
              barSpacing: 1, // ✅ Espaçamento mínimo entre barras
              rightBarStaysOnScroll: false, // ✅ Não manter barra direita ao scroll
              fixLeftEdge: true, // ✅ Fixar borda esquerda (dados começam da esquerda)
              fixRightEdge: false, // ✅ Não fixar borda direita (permite scroll)
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
      
      // Replotar dados com o novo formato (seguindo padrão da IA)
      this.updateChartData();
    },
    updateChartData() {
      if (!this.chart || !this.chartSeries) {
        return;
      }

      // Usar os ticks filtrados pelo zoom atual
      const ticksToUse = this.filterTicksByZoom(this.allHistoricalTicks);
      
      if (ticksToUse.length === 0 && this.storedTicks.length > 0) {
        // Fallback: usar storedTicks se não houver ticks filtrados
        const now = Math.floor(Date.now() / 1000);
        const minutesAgo = now - (this.zoomPeriod * 60);
        const filteredStored = this.storedTicks.filter(tick => {
          // storedTicks já tem time em UTC-3, então precisamos converter de volta ou usar como está
          // Assumindo que storedTicks.time já está em segundos UTC-3
          return tick.time >= (minutesAgo - (3 * 60 * 60)); // Ajustar para UTC-3
        });
        if (filteredStored.length > 0) {
          this.plotTicksForChartType(filteredStored);
          return;
        }
      }
      
      if (ticksToUse.length > 0) {
        this.plotTicksForChartType(ticksToUse);
      }
    },
    plotTicksForChartType(ticks) {
      if (!this.chart || !this.chartSeries || !ticks || ticks.length === 0) {
        return;
      }

      let data = [];
      
      if (this.chartType === 'candles') {
        // Para velas, converter ticks em velas usando timeframe adaptativo
        data = this.aggregateTicksToCandlesForPeriod(ticks, this.selectedTimeframe);
      } else {
        // Gráfico de linhas: mapear ticks para formato de linha
        const sortedTicks = [...ticks]
          .map(tick => {
            let epoch = Number(tick.epoch || tick.time || Date.now() / 1000);
            if (epoch > 10000000000) {
              epoch = Math.floor(epoch / 1000);
            }
            const brasiliaEpoch = Math.floor(epoch) - (3 * 60 * 60);
            return {
              time: brasiliaEpoch,
              value: Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0),
            };
          })
          .filter(point => point.value && point.value > 0 && point.time > 0)
          .sort((a, b) => a.time - b.time);
        
        data = sortedTicks;
      }

      if (data.length === 0) {
        console.warn('[Chart] Nenhum dado para plotar após conversão');
        return;
      }

      console.log('[Chart] Atualizando gráfico com', data.length, this.chartType === 'candles' ? 'velas' : 'pontos');
      this.chartSeries.setData(data);
      
      // ✅ Ajustar o gráfico para mostrar da esquerda para a direita
      // Aguardar um frame para garantir que os dados foram aplicados
      this.$nextTick(() => {
        try {
          if (data.length > 0) {
            // Ordenar dados por tempo (mais antigo primeiro)
            const sortedData = [...data].sort((a, b) => a.time - b.time);
            const firstTime = sortedData[0].time;
            const lastTime = sortedData[sortedData.length - 1].time;
            
            // Definir range visível começando da esquerda (primeiro timestamp)
            this.chart.timeScale().setVisibleRange({
              from: firstTime,
              to: lastTime,
            });
            
            // Garantir que o scroll está no início (esquerda)
            this.chart.timeScale().scrollToPosition(0, false);
          } else {
            // Se não houver dados, usar fitContent como fallback
            this.chart.timeScale().fitContent();
          }
        } catch (error) {
          console.warn('[Chart] Erro ao ajustar range visível:', error);
          // Fallback para fitContent
          this.chart.timeScale().fitContent();
        }
      });
    },
    aggregateTicksToCandlesForPeriod(ticks, timeframeSeconds) {
      if (!Array.isArray(ticks) || ticks.length === 0) {
        return [];
      }

      // Processar ticks para formato padronizado (seguindo padrão da IA)
      const validTicks = ticks.map(tick => {
        let epoch = Number(tick.epoch || tick.time || Date.now() / 1000);
        if (epoch > 10000000000) {
          epoch = Math.floor(epoch / 1000);
        }
        // Converter para UTC-3 (Brasília) como a IA faz
        const brasiliaEpoch = Math.floor(epoch) - (3 * 60 * 60);
        const price = Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0);
        return { time: brasiliaEpoch, price };
      }).filter(tick => tick.price > 0);

      if (validTicks.length === 0) {
        return [];
      }

      // Ordenar por tempo (mais recentes primeiro, como a IA faz)
      const sortedTicks = [...validTicks].sort((a, b) => b.time - a.time);

      // Calcular timeframe baseado no período de zoom para manter consistência visual
      // Usar um timeframe proporcional ao período de zoom
      let effectiveTimeframe;
      
      if (this.zoomPeriod === 3) {
        // Para 3 minutos: usar 3 segundos (aumentado de 2 para velas maiores)
        effectiveTimeframe = 3;
      } else if (this.zoomPeriod === 5) {
        // Para 5 minutos: usar 3 segundos (já está funcionando bem)
        effectiveTimeframe = 3;
      } else if (this.zoomPeriod === 10) {
        // Para 10 minutos: usar 5-6 segundos (já está funcionando bem)
        // Usar cálculo adaptativo mas com limite mínimo
        const timeSpan = sortedTicks.length > 1 
          ? sortedTicks[0].time - sortedTicks[sortedTicks.length - 1].time
          : timeframeSeconds;
        const calculatedTimeframe = timeSpan > 0 
          ? Math.floor(timeSpan / this.chartPointsVisible)
          : 5;
        effectiveTimeframe = Math.max(5, Math.min(60, calculatedTimeframe));
      } else {
        // Para outros períodos, usar o timeframe padrão
        effectiveTimeframe = timeframeSeconds;
      }

      // Reverter para ordem cronológica (mais antigos primeiro) para agregação
      const chronologicalTicks = [...sortedTicks].reverse();

      const candles = [];
      let bucketStart = null;
      let bucketTicks = [];

      const finalizeBucket = () => {
        if (!bucketTicks.length || bucketStart === null) return;
        const prices = bucketTicks.map(t => t.price);
        candles.push({
          time: bucketStart,
          open: bucketTicks[0].price,
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: bucketTicks[bucketTicks.length - 1].price,
        });
      };

      for (const tick of chronologicalTicks) {
        const bucket = Math.floor(tick.time / effectiveTimeframe) * effectiveTimeframe;

        if (bucketStart === null) {
          bucketStart = bucket;
        }

        if (bucket !== bucketStart) {
          finalizeBucket();
          bucketStart = bucket;
          bucketTicks = [];
        }

        bucketTicks.push(tick);
      }

      finalizeBucket();
      
      // Limitar a quantidade final de velas (pegar as últimas N velas - mais recentes)
      const finalCandles = candles.slice(-this.chartPointsVisible);
      
      console.log('[Chart] Velas geradas:', {
        totalCandles: candles.length,
        finalCandles: finalCandles.length,
        effectiveTimeframe,
        timeSpanMinutes: finalCandles.length > 0 ? ((finalCandles[finalCandles.length - 1].time - finalCandles[0].time) / 60).toFixed(2) : 0
      });
      
      return finalCandles;
    },
// Helper para obter token
    async getTokenForAccount() {
        try {
            const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
            if (authToken) {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                // Remove /api from base url if it exists twice or ensure it's there? 
                // DerivTradingService normalizes it. Let's do similar or just append path.
                // Assuming VUE_APP_API_BASE_URL includes /api in production? 
                // But DerivTradingService code: let API_BASE_URL = rawApiUrl... if (!ends with /api) add it.
                // Safest is to rely on simple logic: just use the variable, if user set it right.
                // The logs showed: Requisição para https://iazenix.com/api/broker/deriv/status
                // So VUE_APP_API_BASE_URL likely is 'https://iazenix.com/api'.
                
                const response = await fetch(`${apiBaseUrl}/broker/deriv/trading/token`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.token) {
                        console.log('[Chart] Token Deriv resolvido pelo backend:', data.token.substring(0, 4) + '...');
                        return data.token;
                    }
                }
            }
        } catch (error) {
            console.warn('[Chart] Erro ao obter token do backend:', error);
        }

        // Fallback Local Storage
        const derivConnection = localStorage.getItem('deriv_connection');
        let derivToken = localStorage.getItem('deriv_token');
        let loginid = null;

        if (derivConnection) {
          try {
            const connection = JSON.parse(derivConnection);
            loginid = connection.loginid;
            if (!derivToken) derivToken = connection.token;
          } catch (e) {
            console.warn('[Chart] Erro ao parsear deriv_connection:', e);
          }
        }

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
              }
            } catch (e) {
              console.warn('[Chart] Erro ao parsear deriv_tokens_by_loginid:', e);
            }
          }
        }
        return derivToken;
    },

    // Método loadTicksFromBackend removido (substituído por subscribeWSTicks)
    filterTicksByZoom(ticks) {
      if (!ticks || !Array.isArray(ticks) || ticks.length === 0) {
        return [];
      }
      
      const now = Math.floor(Date.now() / 1000);
      const minutesAgo = now - (this.zoomPeriod * 60);
      
      const filtered = ticks.filter(tick => {
        let tickEpoch = Number(tick.epoch || tick.time || 0);
        // Se o epoch parece estar em milissegundos, converter para segundos
        if (tickEpoch > 10000000000) {
          tickEpoch = Math.floor(tickEpoch / 1000);
        }
        return tickEpoch >= minutesAgo;
      });
      
      console.log(`[Chart] Filtro de zoom: ${ticks.length} ticks totais, ${filtered.length} ticks nos últimos ${this.zoomPeriod} minutos`);
      console.log(`[Chart] Limite de tempo: ${minutesAgo} (${new Date(minutesAgo * 1000).toLocaleTimeString('pt-BR')})`);
      
      // Debug: se não houver ticks filtrados, mostrar informações do último tick
      if (filtered.length === 0 && ticks.length > 0) {
        const lastTick = ticks[ticks.length - 1];
        let lastTickEpoch = Number(lastTick.epoch || lastTick.time || 0);
        if (lastTickEpoch > 10000000000) {
          lastTickEpoch = Math.floor(lastTickEpoch / 1000);
        }
        const ageInMinutes = Math.floor((now - lastTickEpoch) / 60);
        console.log(`[Chart] Último tick muito antigo: epoch=${lastTickEpoch}, idade=${ageInMinutes} minutos, limite=${this.zoomPeriod} minutos`);
      }
      
      return filtered;
    },
    setZoomPeriod(minutes) {
      if (this.zoomPeriod === minutes) {
        return; // Já está no período selecionado
      }
      
      console.log(`[Chart] Alterando zoom para ${minutes} minutos`);
      this.zoomPeriod = minutes;
      
      // Replotar ticks com o novo zoom
      if (this.allHistoricalTicks && this.allHistoricalTicks.length > 0) {
        console.log(`[Chart] Filtrando ${this.allHistoricalTicks.length} ticks para zoom de ${minutes} minutos`);
        const filteredTicks = this.filterTicksByZoom(this.allHistoricalTicks);
        console.log(`[Chart] ${filteredTicks.length} ticks após filtro`);
        
        if (filteredTicks.length > 0) {
          this.plotTicks(filteredTicks);
        } else {
          console.warn(`[Chart] Nenhum tick encontrado para os últimos ${minutes} minutos, mantendo gráfico atual`);
        }
      } else {
        console.warn('[Chart] Nenhum histórico de ticks disponível para aplicar zoom');
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
          let epoch = Number(tick.epoch || tick.time || Date.now() / 1000);
          // Se o epoch parece estar em milissegundos (muito maior que um timestamp Unix normal), converter para segundos
          if (epoch > 10000000000) {
            epoch = Math.floor(epoch / 1000);
          }
          const brasiliaEpoch = Math.floor(epoch) - (3 * 60 * 60);
          
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
          // Converter ticks em velas usando o mesmo método da IA
          // aggregateTicksToCandlesForPeriod espera ticks no formato original (com epoch)
          // então usamos os ticks originais passados para a função
          dataToPlot = this.aggregateTicksToCandlesForPeriod(ticks, this.selectedTimeframe);
        } else {
          // Usar dados de linha diretamente (já convertidos para UTC-3)
          dataToPlot = chartData;
        }
        
        if (dataToPlot.length === 0) {
          console.warn('[Chart] Nenhum dado para plotar após conversão');
          return;
        }
        
        // Limpar dados anteriores e plotar novos dados
        this.chartSeries.setData(dataToPlot);
        
        // ✅ Ajustar o gráfico para mostrar da esquerda para a direita
        this.$nextTick(() => {
          try {
            if (dataToPlot.length > 0) {
              // Ordenar dados por tempo (mais antigo primeiro)
              const sortedData = [...dataToPlot].sort((a, b) => a.time - b.time);
              const firstTime = sortedData[0].time;
              const lastTime = sortedData[sortedData.length - 1].time;
              
              // Definir range visível começando da esquerda (primeiro timestamp)
              this.chart.timeScale().setVisibleRange({
                from: firstTime,
                to: lastTime,
              });
              
              // Garantir que o scroll está no início (esquerda)
              this.chart.timeScale().scrollToPosition(0, false);
            } else {
              // Se não houver dados, usar fitContent como fallback
              this.chart.timeScale().fitContent();
            }
          } catch (error) {
            console.warn('[Chart] Erro ao ajustar range visível:', error);
            // Fallback para fitContent
            this.chart.timeScale().fitContent();
          }
        });
        
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
          // Para velas, precisamos recalcular todas as velas com os ticks atualizados
          // Converter storedTicks de volta para formato com epoch
          const ticksForCandles = this.storedTicks.map(t => ({
            epoch: t.time + (3 * 60 * 60), // Converter de UTC-3 de volta para UTC
            value: t.value
          }));
          const candles = this.aggregateTicksToCandlesForPeriod(ticksForCandles, this.selectedTimeframe);
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

        // Recalcular frequências de dígitos
        this.calculateDigitFrequency();
      } catch (error) {
        console.warn('[Chart] Erro ao adicionar tick ao gráfico:', error);
      }
    },
    calculateDigitFrequency() {
      // Usar uma amostra maior para a frequência geral (500 ticks)
      const lastSample = this.allHistoricalTicks.slice(-500);
      const digits = [];
      const frequency = {};
      
      for (let i = 0; i <= 9; i++) {
        frequency[i] = 0;
      }
      
      lastSample.forEach(tick => {
        const val = Number(tick.value || tick.price || tick.quote);
        const valStr = val.toFixed(this.pricePrecision);
        const lastDigit = parseInt(valStr.charAt(valStr.length - 1));
        if (!isNaN(lastDigit)) {
          digits.push(lastDigit);
          frequency[lastDigit] = (frequency[lastDigit] || 0) + 1;
        }
      });
      
      let evenCount = 0;
      let oddCount = 0;
      digits.forEach(d => {
        if (d % 2 === 0) evenCount++;
        else oddCount++;
      });
      
      const total = digits.length;
      this.digitFrequency = {
        digits,
        frequency,
        parity: {
          even: total > 0 ? Math.round((evenCount / total) * 100) : 0,
          odd: total > 0 ? Math.round((oddCount / total) * 100) : 0,
        },
      };
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
      
      // Carregar ticks do novo mercado via WS
      setTimeout(() => {
        this.subscribeWSTicks();
      }, 500);
    },
    openTradeTypeModal() {
      this.showTradeTypeModal = true;
    },
    closeTradeTypeModal() {
      this.showTradeTypeModal = false;
    },
    async setupStream() {
       try {
        // Iniciar stream SSE para receber atualizações de ORDENS
        await derivTradingService.startStream((data) => {
          if (data.type === 'buy' && data.data) {
            this.processBuy(data.data);
          } else if (data.type === 'contract' && data.data) {
            this.processContract(data.data);
          } else if (data.type === 'error' && data.error) {
            console.error('[Chart] Erro recebido via SSE:', data.error);
            this.tradeError = data.error.message || 'Erro na operação';
            this.isTrading = false;
          }
          // Ignorar active_symbols, history, tick (agora via WS Direto)
        });
       } catch (error) {
         console.error('[Chart] Erro ao configurar stream:', error);
       }
    },
    // Método loadMarketsFromAPI removido (substituído por subscribeWSActiveSymbols)
    async fetchMarkets() {
      try {
        const token = localStorage.getItem('token');
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        const res = await fetch(`${apiBaseUrl}/markets`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error('Falha ao buscar mercados');

        const backendMarkets = await res.json();
        
        // Map backend to component format
        const categoryMap = {
            'synthetic_index': 'Índices Sintéticos',
            'forex': 'Forex',
            'cryptocurrency': 'Criptomoedas',
            'indices': 'Índices',
            'commodities': 'Commodities'
        };

        const allowedForex = ['frxEURUSD', 'frxUSDJPY', 'frxGBPUSD', 'frxAUDUSD', 'frxUSDCHF', 'frxUSDCAD', 'frxNZDUSD', 'frxEURGBP', 'frxEURJPY', 'frxGBPJPY'];
        const allowedCrypto = ['cryBTCUSD', 'cryETHUSD', 'cryLTCUSD', 'cryXRPUSD', 'cryBCHUSD'];
        const allowedSynthetic = ['Continuous Indices', 'Daily Reset Indices', 'Indices Step', 'Jump Indices', 'Boom/Crash'];

        const filteredMarkets = backendMarkets.filter(m => {
             if (m.symbol.startsWith('frx')) return allowedForex.includes(m.symbol);
             if (m.symbol.startsWith('cry')) return allowedCrypto.includes(m.symbol);
             
             // Check synthetic indices based on submarketDisplayName or common prefixes
             const submarket = m.submarketDisplayName;
             if (allowedSynthetic.includes(submarket)) return true;
             
             // Fallback for symbols if submarketDisplayName is missing or different
             if (m.symbol.startsWith('R_') || m.symbol.startsWith('1HZ') || 
                 m.symbol.startsWith('JDM') || m.symbol.startsWith('BOOM') || 
                 m.symbol.startsWith('CRASH') || m.symbol.startsWith('STP') ||
                 m.symbol.startsWith('RDBEAR') || m.symbol.startsWith('RDBULL')) {
                 return true;
             }
             
             return false;
        });

        const mappedMarkets = filteredMarkets.map(m => {
             let category = m.submarketDisplayName || m.marketDisplayName || categoryMap[m.market] || 'Outros';
             
             // Forçar categorias específicas para o mapeamento de prioridade e exibição correta
             if (m.symbol.startsWith('frx')) {
                 category = 'Major Pairs';
             } else if (m.symbol.startsWith('cry')) {
                 category = 'Criptomoedas';
             } else if (m.symbol.startsWith('R_') || m.symbol.startsWith('1HZ')) {
                 category = 'Índices Contínuos';
             } else if (m.symbol.startsWith('JDM')) {
                 category = 'Jump Indices';
             } else if (m.symbol.startsWith('BOOM') || m.symbol.startsWith('CRASH')) {
                 category = 'Boom/Crash';
             } else if (m.symbol.startsWith('STP')) {
                 category = 'Indices Step';
             } else if (m.symbol.startsWith('RDBEAR') || m.symbol.startsWith('RDBULL')) {
                 category = 'Daily Reset Indices';
             }

             return {
                 value: m.symbol,
                 label: m.displayName,
                 category: category,
                 operations: m.operations || []
             };
        });

         // Sort by category
        const categoryPriority = {
            'Índices Contínuos': 1,
            'Forex': 2,
            'Criptomoedas': 3,
            'commodities': 4
        };

        mappedMarkets.sort((a, b) => {
             const pA = categoryPriority[a.category] || 99;
             const pB = categoryPriority[b.category] || 99;
             if (pA !== pB) return pA - pB;
             return a.label.localeCompare(b.label);
        });
        
        this.markets = mappedMarkets;
        console.log('[Chart] Mercados carregados do backend:', this.markets.length);

        if (!this.symbol && this.markets.length > 0) {
             const defaultM = this.markets.find(m => m.value === 'R_100') || this.markets[0];
             this.selectMarket(defaultM.value);
        } else if (this.symbol) {
            // Validate if current symbol exists in new list
             const exists = this.markets.find(m => m.value === this.symbol);
             if (exists) {
                 this.loadAvailableContracts(this.symbol);
             }
        }

      } catch (error) {
        console.error('Erro ao buscar mercados do backend:', error);
      }
    },
    async loadAvailableContracts(symbol) {
      if (!symbol) {
        this.availableContracts = [];
        return;
      }
      
      try {
        this.isLoadingContracts = true;
        
        const token = localStorage.getItem('token');
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        const res = await fetch(`${apiBaseUrl}/markets/${symbol}/contracts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error('Falha ao buscar contratos');

        const contracts = await res.json();
        
        if (contracts && contracts.length > 0) {
             this.availableContracts = contracts.map(c => ({
               ...c.payload, // Spread raw data from Deriv
               contract_type: c.contractType,
               contract_category: c.contractCategory,
               contract_display: c.contractDisplay,
               min_contract_duration: c.minContractDuration,
               max_contract_duration: c.maxContractDuration,
               barriers: c.barriers
             }));
             console.log('[Chart] Contratos detalhados carregados do backend:', this.availableContracts.length);
        } else {
             console.warn('[Chart] Sem contratos detalhados na tabela market_contracts para:', symbol);
             this.availableContracts = [];
        }

        // Validate current trade type
        if (this.tradeType) {
             const availableTypes = this.availableContracts.map(c => c.contract_type.toUpperCase());
             const isAvailable = availableTypes.includes(this.tradeType.toUpperCase());
             
             if (!isAvailable) {
                  this.tradeType = '';
                  console.log('[Chart] Tipo de negociação anterior não está disponível, limpo');
             }
        }
        
      } catch (error) {
        console.error('[Chart] Erro ao carregar contratos:', error);
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
      if (value === null || value === undefined) return;
      
      // Extrair último dígito do valor baseado na precisão do mercado
      const valueStr = value.toFixed(this.pricePrecision);
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
    isTradeTypeSelected(item) {
      return this.selectedTradeTypeGroup === item.value;
    },
    async selectTradeType(item) {
      this.selectedTradeTypeGroup = item.value;
      if (item.directions && item.directions.length > 0) {
        this.tradeType = item.directions[0].value;
      }
      this.showTradeTypeModal = false;
      this.loadDefaultValuesForType(this.tradeType);
      
      // Se for contrato de dígitos e temos latestTick, calcular dígito
      if (this.isDigitContract && this.latestTick && this.latestTick.value) {
        this.updateDigitInfo(this.latestTick.value);
      }
    },
    getButtonLabel(type) {
      const labels = {
        'CALL': 'CALL', 'PUT': 'PUT',
        'CALLE': 'CALL (Equal)', 'PUTE': 'PUT (Equal)',
        'DIGITMATCH': 'IGUAL', 'DIGITDIFF': 'DIFERENTE',
        'DIGITEVEN': 'PAR', 'DIGITODD': 'ÍMPAR',
        'DIGITOVER': 'SUPERIOR', 'DIGITUNDER': 'INFERIOR',
        'ONETOUCH': 'TOCA', 'NOTOUCH': 'NÃO TOCA',
        'MULTUP': 'ALTA', 'MULTDOWN': 'BAIXA'
      };
      return labels[type] || type;
    },
    getButtonIcon(type) {
      const icons = {
        'CALL': 'fas fa-arrow-up', 'PUT': 'fas fa-arrow-down',
        'CALLE': 'fas fa-arrow-up-right-dots', 'PUTE': 'fas fa-arrow-down-right-dots',
        'DIGITMATCH': 'fas fa-equals', 'DIGITDIFF': 'fas fa-not-equal',
        'DIGITEVEN': 'fas fa-divide', 'DIGITODD': 'fas fa-percent',
        'DIGITOVER': 'fas fa-greater-than', 'DIGITUNDER': 'fas fa-less-than',
        'MULTUP': 'fas fa-chart-line', 'MULTDOWN': 'fas fa-chart-line'
      };
      return icons[type] || 'fas fa-bolt';
    },
    getButtonColor(type) {
      const greens = ['CALL', 'CALLE', 'DIGITMATCH', 'DIGITEVEN', 'DIGITOVER', 'ONETOUCH', 'MULTUP', 'RISE'];
      return greens.includes(type) ? 'text-zenix-green' : 'text-red-500';
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
      
      console.log('[Chart] ========== EXECUTAR COMPRA (FRONTEND WS) ==========');
      console.log('[Chart] Configuração:', {
        symbol: this.symbol,
        tradeType: this.tradeType,
        duration: this.duration,
        durationUnit: this.durationUnit,
        amount: this.amount
      });
      
      try {
        // Construir payload para compra direta (Instant Buy)
        const parameters = {
          amount: Number(this.amount),
          basis: 'stake',
          contract_type: this.tradeType,
          currency: this.currency || 'USD',
          symbol: this.symbol,
          duration: Number(this.duration),
          duration_unit: this.durationUnit,
        };

        // Adicionar barrier se necessário
        if (this.isDigitContract && this.tradeType.includes('DIGIT')) {
           const needsBarrier = ['DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(this.tradeType);
           if (needsBarrier) {
             parameters.barrier = String(this.digitMatchValue !== null ? this.digitMatchValue : (this.lastDigit !== null ? this.lastDigit : 5));
           }
        }
        
        // Adicionar multiplicador se necessário
        if (this.tradeType.startsWith('MULT')) {
          parameters.multiplier = Number(this.multiplier || 100);
        }

        const buyRequest = {
            buy: 1,
            price: Number(this.amount), // Limite de preço (stake)
            parameters: parameters
        };

        console.log('[Chart] Enviando ordem via WebSocket direto:', buyRequest);
        this.wsSend(buyRequest);
        
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
      
      // Evitar processamento duplicado (via SSE e Resposta direta)
      if (this.activeContract && String(this.activeContract.contract_id) === String(contractId)) {
        console.log('[Chart] Contrato já está ativo, ignorando processamento duplicado:', contractId);
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
      
      // Adicionar linha de compra no gráfico
      if (this.activeContract && this.activeContract.entry_spot) {
        const entryTime = this.activeContract.entry_time || (Date.now() / 1000);
        this.addEntrySpotLine(this.activeContract.entry_spot, entryTime);
      }
      
      // Inicializar contador
      this.initializeContractCountdown();
      
      // Inicializar P&L
      this.updateRealTimeProfit();
      
      // Clear recommendation after execution if desired, but user specifically asked
      // after the contract finishes. So we keep it for now.
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
      
      // Se o backend já enviou o profit (via contract_update), priorizar ele
      if (this.activeContract.profit !== null && this.activeContract.profit !== undefined && this.activeContract.status === 'open') {
        this.realTimeProfit = Number(this.activeContract.profit);
      } else {
        // Calcular P&L baseado no tipo de contrato (fallback/estimativa)
        let profit = 0;
        const type = (this.activeContract.contract_type || this.tradeType || '').toUpperCase();
        
        const lastDigit = Number(currentPrice.toFixed(this.pricePrecision).slice(-1));
        const barrier = this.digitMatchValue !== null ? this.digitMatchValue : 5;

        if (type === 'CALL' || type === 'RISE' || type === 'CALLE') {
          profit = currentPrice > entryPrice ? (this.amount * 0.95) : -this.amount;
        } else if (type === 'PUT' || type === 'FALL' || type === 'PUTE') {
          profit = currentPrice < entryPrice ? (this.amount * 0.95) : -this.amount;
        } else if (type === 'DIGITMATCH') {
          profit = lastDigit === barrier ? (this.amount * 8) : -this.amount;
        } else if (type === 'DIGITDIFF') {
          profit = lastDigit !== barrier ? (this.amount * 0.1) : -this.amount;
        } else if (type === 'DIGITEVEN') {
          profit = lastDigit % 2 === 0 ? (this.amount * 0.95) : -this.amount;
        } else if (type === 'DIGITODD') {
          profit = lastDigit % 2 !== 0 ? (this.amount * 0.95) : -this.amount;
        } else if (type === 'DIGITOVER') {
          profit = lastDigit > barrier ? (this.amount * 0.95) : -this.amount;
        } else if (type === 'DIGITUNDER') {
          profit = lastDigit < barrier ? (this.amount * 0.95) : -this.amount;
        }
        
        this.realTimeProfit = profit;
      }
      
      // Atualizar classes CSS baseado no P&L
      if (this.realTimeProfit > 0) {
        this.realTimeProfitClass = 'border-zenix-green';
        this.realTimeProfitTextClass = 'text-zenix-green';
      } else if (this.realTimeProfit < 0) {
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
      // Evitar execução duplicada se o modal já estiver aberto
      if (this.showTradeResultModal) {
          console.log('[Chart] Modal já está aberto, ignorando trigger duplicado de expiração.');
          return;
      }

      console.log('[Chart] ========== CONTRATO EXPIRADO ==========');
      console.log('[Chart] Dados de expiração:', contractData);
      
      // Parar contador
      this.stopContractCountdown();
      
      // Remover linha de compra
      this.removeEntrySpotLine();
      
      // Determinar resultado
      let profit = 0;
      if (contractData.profit !== undefined && contractData.profit !== null) {
        profit = Number(contractData.profit);
      } else if (contractData.sell_price !== undefined && contractData.sell_price !== null && this.activeContract?.buy_price) {
        profit = Number(contractData.sell_price) - Number(this.activeContract.buy_price);
      } else {
        profit = this.realTimeProfit !== null ? this.realTimeProfit : 0;
      }
      
      // Atualizar contrato com dados finais
      if (this.activeContract) {
        this.activeContract.sell_price = contractData.sell_price || contractData.exit_spot || this.activeContract.sell_price;
        this.activeContract.exit_spot = contractData.exit_spot || contractData.sell_price || this.latestTick?.value;
        this.activeContract.profit = profit;
        this.activeContract.status = contractData.status || (profit > 0 ? 'won' : 'lost');
        
        if (this.isDigitContract && profit === 0 && (contractData.status === 'lost' || contractData.status === 'loss')) {
          profit = -this.amount;
        }
      }

      // NOTIFICAR BACKEND sobre finalização (sync)
      if (this.activeContract && this.activeContract.contract_id) {
         const resultData = {
            contractId: String(this.activeContract.contract_id),
            status: this.activeContract.status,
            profit: profit,
            sellPrice: this.activeContract.sell_price ? Number(this.activeContract.sell_price) : null,
            exitSpot: this.activeContract.exit_spot ? Number(this.activeContract.exit_spot) : null,
            entrySpot: this.activeContract.entry_spot ? Number(this.activeContract.entry_spot) : null,
            symbol: this.activeContract.symbol,
         };
         derivTradingService.notifyEnd(resultData);
      }
      
      // Preparar dados para o modal
      this.finalTradeProfit = profit;
      this.finalTradeType = this.activeContract?.contract_type || this.tradeType || 'CALL';
      this.finalEntrySpot = this.activeContract?.entry_spot || this.purchasePrice;
      this.finalExitSpot = this.activeContract?.exit_spot || this.latestTick?.value;
      
      // Show modal de resultado (REMOVED)
      // this.showTradeResultModal = true;
      
      // Limpar contrato após um curto delay para o usuário ver o resultado final no painel
      setTimeout(() => {
        this.activeContract = null;
        this.purchasePrice = null;
        this.realTimeProfit = null;
        this.tradeMessage = '';
        this.aiRecommendation = null; // Reset signal to allow new generation
      }, 5000);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    closeTradeResultModal() {
      this.showTradeResultModal = false;
      // Limpar dados do resultado
      this.finalTradeProfit = 0;
      this.finalTradeType = 'CALL';
      
      // Limpar contrato ativo imediatamente para mostrar os botões de ação
      if (this.activeContract) {
        this.activeContract = null;
        this.purchasePrice = null;
        this.realTimeProfit = null;
        this.tradeMessage = '';
        this.stopContractCountdown();
        this.aiRecommendation = null; // Ensure signal is cleared when modal closes
      }
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
        const firstTick = this.storedTicks && this.storedTicks.length > 0 ? this.storedTicks[0] : null;
        const lastTick = this.storedTicks && this.storedTicks.length > 0 ? this.storedTicks[this.storedTicks.length - 1] : null;
        
        // Validar e calcular tempos
        let lineStartTime = entryTimeUnix;
        let lineEndTime = entryTimeUnix;
        
        if (firstTick && firstTick.time !== null && firstTick.time !== undefined) {
          const firstEpoch = Math.floor(Number(firstTick.time));
          if (!isNaN(firstEpoch) && isFinite(firstEpoch) && firstEpoch > 0) {
            lineStartTime = firstEpoch;
          }
        }
        
        if (lastTick && lastTick.time !== null && lastTick.time !== undefined) {
          const lastEpoch = Math.floor(Number(lastTick.time));
          if (!isNaN(lastEpoch) && isFinite(lastEpoch) && lastEpoch > 0) {
            lineEndTime = lastEpoch;
          }
        }
        
        // Se não temos ticks armazenados, usar o tempo atual como referência
        if (!firstTick || !lastTick) {
          const now = Math.floor(Date.now() / 1000) - (3 * 60 * 60);
          lineStartTime = entryTimeUnix;
          lineEndTime = now;
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
    updateEntrySpotLine() {
      if (!this.entrySpotLine || !this.activeContract || !this.storedTicks || this.storedTicks.length === 0) {
        return;
      }
      
      try {
        const firstTick = this.storedTicks[0];
        const lastTick = this.storedTicks[this.storedTicks.length - 1];
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
        
        if (firstTick.time === null || firstTick.time === undefined || 
            lastTick.time === null || lastTick.time === undefined) {
          return;
        }
        
        const lineStartTime = Math.floor(Number(firstTick.time));
        const lineEndTime = Math.floor(Number(lastTick.time));
        
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
    executeTradeWithDirection(direction) {
      console.log('[Chart] Executando ordem com direção:', direction);
      this.tradeType = direction;
      
      // Pequeno timeout para garantir que tradeType foi reativo antes de executeBuy
      this.$nextTick(() => {
        this.executeBuy();
      });
    },
    getDirectionButtonClass(direction) {
      const dir = direction.toUpperCase();
      const isRed = dir.includes('PUT') || dir.includes('FALL') || dir.includes('DIFF') || dir.includes('DOWN') || dir.includes('ODD') || dir.includes('UNDER');
      
      if (isRed) {
        return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20';
      }
      return 'bg-zenix-green hover:bg-zenix-green-hover text-black shadow-zenix-green/30';
    },
    getDirectionIcon(direction) {
      const dir = direction.toUpperCase();
      if (dir.includes('CALL') || dir.includes('RISE') || dir.includes('UP') || dir.includes('OVER')) return 'fas fa-arrow-up text-xs';
      if (dir.includes('PUT') || dir.includes('FALL') || dir.includes('DOWN') || dir.includes('UNDER')) return 'fas fa-arrow-down text-xs';
      if (dir.includes('MATCH')) return 'fas fa-equals text-xs';
      if (dir.includes('DIFF')) return 'fas fa-not-equal text-xs';
      if (dir.includes('EVEN')) return 'fas fa-divide text-xs';
      if (dir.includes('ODD')) return 'fas fa-percent text-xs';
      return 'fas fa-play text-xs';
    },
    toggleAnalysis() {
      // Sincronização com Digitos: apenas gera um sinal manual por clique
      if (this.isAnalyzing) {
        this.stopAnalysis();
      } else {
        this.startAnalysis();
      }
    },
    async startAnalysis() {
      if (!this.symbol) {
        console.warn('[Chart] Símbolo não selecionado');
        return;
      }
      
      this.isAnalyzing = true;
      this.aiRecommendation = null;
      this.signalCountdown = null;
      
      // Gerar apenas um sinal manual por clique (Sincronizado)
      await this.analyzeChart();
      
      // Parar estado de "analisando" após a resposta (ou após um tempo se quiser manter o feedback visual)
      setTimeout(() => {
        this.isAnalyzing = false;
      }, 1000);

      console.log('[Chart] Análise manual executada');
    },
    executeAIOrder() {
      if (!this.aiRecommendation) return;
      
      // Se a recomendação incluir uma barreira (ex: para Match/Diff/Over/Under), usar ela
      if (this.aiRecommendation.barrier !== undefined && this.aiRecommendation.barrier !== null) {
          this.digitMatchValue = Number(this.aiRecommendation.barrier);
      }
      
      console.log('[Chart] Executar AI Order:', this.aiRecommendation.action, 'Barrier:', this.digitMatchValue);
      this.executeTradeWithDirection(this.aiRecommendation.action);
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
        
        // Se não tiver ticks suficientes nos coletados, tentar usar o histórico completo
        if (ticksToAnalyze.length < 50 && this.allHistoricalTicks && this.allHistoricalTicks.length > 0) {
          console.log('[Chart] Usando histórico completo para análise');
          // Pegar os últimos 50 ticks do histórico completo
          // Ordenar por epoch para garantir ordem cronológica
          const sortedHistory = [...this.allHistoricalTicks].sort((a, b) => a.epoch - b.epoch);
          ticksToAnalyze = sortedHistory.slice(-50).map(tick => ({
            value: tick.value,
            epoch: tick.epoch
          }));
        }

        // Se AINDA não tiver ticks suficientes, tentar buscar do backend (fallback final)
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
        
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const response = await fetch(`${apiBaseUrl}/gemini/recommendation`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticks: last50Ticks,
            symbol: this.symbol,
            tradeType: this.tradeType,
            duration: this.duration,
            durationUnit: this.durationUnit,
            amount: this.amount,
            multiplier: this.multiplier
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
          reasoning: recommendation.reasoning || '',
          entry_time: recommendation.entry_time || 0,
          barrier: recommendation.barrier
        };

        // Iniciar contagem regressiva se houver tempo de entrada
        if (this.aiRecommendation.entry_time > 0) {
          this.startSignalCountdown(this.aiRecommendation.entry_time);
        } else {
          this.signalCountdown = null;
        }
        
      } catch (error) {
        console.error('[Chart] Erro ao analisar gráfico:', error);
        this.aiRecommendation = null;
      }
    },
    startSignalCountdown(seconds) {
      if (this.signalCountdownInterval) {
        clearInterval(this.signalCountdownInterval);
      }
      
      this.signalCountdown = seconds;
      
      this.signalCountdownInterval = setInterval(() => {
        if (this.signalCountdown > 0) {
          this.signalCountdown--;
        } else {
          this.stopSignalCountdown();
        }
      }, 1000);
    },
    stopSignalCountdown() {
      if (this.signalCountdownInterval) {
        clearInterval(this.signalCountdownInterval);
        this.signalCountdownInterval = null;
      }
      this.signalCountdown = null;
    },
    stopAnalysis() {
      this.isAnalyzing = false;
      
      if (this.analysisInterval) {
        clearInterval(this.analysisInterval);
        this.analysisInterval = null;
      }
      
      this.stopSignalCountdown();
      this.collectedTicks = [];
      this.aiRecommendation = null;
      
      console.log('[Chart] Análise parada');
    },
    getDefaultMarkets() {
      // Mercados padrão caso a API não retorne
      return [
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
  min-height: 600px;
  padding: 1.5rem;
  box-sizing: border-box;
}

/* Layout */
.operation-layout {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  min-height: 600px;
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
  align-items: stretch;
}

.chart-card {
  flex: 1;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.sidebar-panel {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  height: fit-content;
}

.col-chart {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  min-height: 600px;
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
  margin: 0;
  padding: 0;
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
  box-shadow: none;
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

.btn-gerar-sinal {
  background: #22C55E;
  color: #000;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
}

.btn-gerar-sinal:hover {
  background: #26D466;
  transform: translateY(-2px);
  box-shadow: none;
}

.btn-gerar-sinal:active {
  transform: translateY(0);
}

.metric-signal-card {
  background: #080808;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 90px;
  transition: all 0.3s ease;
}

.metric-signal-card:hover {
  border-color: rgba(34, 197, 94, 0.2);
  background: #0A0A0A;
}

.metric-signal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
}

.metric-signal-body {
  display: flex;
  align-items: center;
  min-height: 24px;
}

/* Categorized Modal Styles */
.categorized-modal {
  min-width: 900px !important;
  max-width: 1100px !important;
  background: #0B0B0B !important;
  border-radius: 12px !important;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  background: rgba(17, 17, 17, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 320px;
  width: 100%; 
}

.category-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.category-icon-wrapper {
  width: 52px;
  height: 52px;
  background: rgba(34, 197, 94, 0.15) !important;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(34, 197, 94, 0.25);
}

.category-icon-wrapper svg, .category-icon-wrapper svg path {
  stroke: #22C55E !important;
}

.category-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
}

.category-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.category-item-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.category-item-btn.active {
  background: rgba(34, 197, 94, 0.1);
  color: #22C55E;
  font-weight: 500;
  border-left: 2px solid #22C55E;
  border-radius: 0 6px 6px 0;
}

/* Response for 2nd row (2 cards) */
@media (min-width: 769px) {
  .categories-grid > div:nth-child(n+4) {
    grid-column: span 1.5;
  }
}

@media (max-width: 1024px) {
  .categorized-modal {
    min-width: 95% !important;
  }
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 16px !important;
  }

  .modal-overlay {
    position: fixed !important;
    padding: 10px !important;
    align-items: flex-start !important;
    overflow-y: auto !important;
  }

  .categorized-modal {
    min-width: auto !important;
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    max-height: calc(100vh - 20px) !important;
    border-radius: 16px !important;
  }

  .modal-header {
    padding: 16px 20px !important;
    /* position removed - using default position to prevent overlap when scrolling */
    background: #0F0F0F !important;
    z-index: 10 !important;
    border-bottom: 1px solid #1A1A1A !important;
  }

  /* Signal area card mobile adjustments */
  .signal-area-card {
    display: none !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 1.5rem !important;
    box-sizing: border-box !important;
  }

.operation-chart-wrapper {
  overflow-x: hidden;
  max-width: 100vw;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.operation-layout {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
}

@media (max-width: 1024px) {
  .operation-layout {
    flex-direction: column;
    gap: 16px !important;
    margin-bottom: 1.5rem !important;
  }
}
  /* Signal generator header mobile adjustments */
  .signal-generator-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 16px !important;
    margin-bottom: 1.5rem !important;
  }

  .btn-gerar-sinal-header {
    width: 100% !important;
    justify-content: center !important;
    margin-top: 0 !important;
  }

  .modal-title {
    font-size: 18px !important;
  }

  .modal-body {
    padding: 20px 16px !important;
  }

  .category-card {
    width: 100% !important;
    min-height: auto !important;
    padding: 16px !important;
  }

  .category-card-header {
    gap: 12px !important;
    margin-bottom: 12px !important;
  }

  .category-icon-wrapper {
    width: 44px !important;
    height: 44px !important;
  }

  .category-card-title {
    font-size: 15px !important;
  }
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



/* Mobile Responsive */
@media (max-width: 768px) {
  .operation-chart-wrapper {
    padding: 0 !important;
    margin: 0 !important;
    min-height: auto;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .operation-layout {
    flex-direction: column;
    gap: 1rem;
    min-height: auto;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 1rem 6rem !important;
    margin: 0 !important;
    box-sizing: border-box;
  }

  .col-chart {
    min-height: auto;
    width: 100% !important;
    max-width: 100% !important;
    gap: 1rem;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
    display: flex !important;
    flex-direction: column !important;
  }

  .chart-card {
    min-height: 400px;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 0 1rem 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.75rem !important;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
    overflow: hidden !important;
  }

  .chart-container {
    min-height: 400px;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
  }

  .chart-wrapper {
    min-height: 400px !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
  }

  /* Mobile: Controles do gráfico abaixo do título */
  .chart-card > .flex.items-center {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.75rem !important;
  }

  .chart-card > .flex.items-center > h3 {
    width: 100%;
    margin-bottom: 0;
  }

  .chart-card > .flex.items-center > .flex.items-center {
    width: 100%;
    justify-content: flex-start !important;
    gap: 0.5rem !important;
  }

  .sidebar-panel {
    width: 100% !important;
    max-width: 100% !important;
    min-height: auto;
    padding: 1rem !important;
    margin: 0 0 1rem 0 !important;
    box-sizing: border-box;
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.75rem !important;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
  }

  .trading-panel {
    width: 100% !important;
    max-width: 100% !important;
    padding: 1rem !important;
    margin: 0 !important;
    box-sizing: border-box;
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.75rem !important;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
  }

  .signal-area {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }

  /* Signal content card - Mobile only */
  @media (max-width: 768px) {
    .signal-content-card {
      background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
      border: 1px solid #1C1C1C !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
      padding: 1rem !important;
      margin: 0 !important;
      box-sizing: border-box;
    }

    .signal-content-card .signal-content {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }

    .signal-content-card .signal-loading,
    .signal-content-card .signal-placeholder {
      padding: 0 !important;
    }
  }

  /* Signal container card style - Mobile only */
  .border-t-2.bg-gradient-to-b {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.75rem !important;
    border-top: 1px solid #1C1C1C !important;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
    margin: 0 0 1rem 0 !important;
    position: relative !important;
  }

  /* Mobile: Transform signal header */
  .border-t-2.bg-gradient-to-b > .flex.items-center {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.5rem !important;
    margin-bottom: 1rem !important;
  }

  .border-t-2.bg-gradient-to-b > .flex.items-center > div:first-child {
    width: 100% !important;
  }

  .border-t-2.bg-gradient-to-b > .flex.items-center > div:first-child span {
    font-size: 1rem !important;
    font-weight: 600 !important;
  }

  /* Mobile: Hide desktop header */
  .border-t-2.bg-gradient-to-b > .desktop-header {
    display: none !important;
  }

  /* Mobile: Show mobile header */
  .border-t-2.bg-gradient-to-b > .mobile-header-signal {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.5rem !important;
    margin-bottom: 1rem !important;
  }

  .mobile-signal-title {
    font-size: 1rem !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .mobile-signal-subtitle {
    font-size: 0.875rem !important;
    color: rgba(255, 255, 255, 0.7) !important;
    font-weight: normal !important;
    margin: 0 !important;
    padding: 0 !important;
  }


  /* Mobile: Show mobile button after signalArea - only on mobile */
  .mobile-generate-button {
    display: none !important;
  }

  @media (max-width: 768px) {
    .mobile-generate-button {
      display: flex !important;
      width: 100% !important;
      margin-top: 1rem !important;
      padding: 0.75rem 1rem !important;
    }
  }

  /* Mobile: Change button text when not analyzing */
  .mobile-generate-button:has(.fa-chart-line) span {
    display: none !important;
  }

  .mobile-generate-button:has(.fa-chart-line)::after {
    content: 'Gerar Sinal';
  }

  .mobile-generate-button:has(.fa-chart-line) i.fa-chart-line {
    font-family: 'Font Awesome 6 Free' !important;
    font-weight: 900 !important;
  }

  .mobile-generate-button:has(.fa-chart-line) i.fa-chart-line::before {
    content: '\f0e7' !important; /* fa-bolt/lightning icon */
  }

  /* Desktop: Hide all mobile elements */
  @media (min-width: 769px) {
    /* Hide mobile button completely */
    .mobile-generate-button {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      position: absolute !important;
      left: -9999px !important;
      pointer-events: none !important;
    }

    /* Hide mobile header */
    .border-t-2.bg-gradient-to-b > .mobile-header-signal,
    .mobile-header-signal {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
    }

    .mobile-signal-title,
    .mobile-signal-subtitle {
      display: none !important;
      visibility: hidden !important;
    }

    /* Show desktop header */
    .border-t-2.bg-gradient-to-b > .desktop-header {
      display: flex !important;
    }
  }

  /* Mobile: Change button text when not analyzing (has fa-chart-line icon) */
  .border-t-2.bg-gradient-to-b > .flex.items-center button:has(.fa-chart-line) span {
    display: none !important;
  }

  .border-t-2.bg-gradient-to-b > .flex.items-center button:has(.fa-chart-line)::after {
    content: 'Gerar Sinal';
  }

  .border-t-2.bg-gradient-to-b > .flex.items-center button:has(.fa-chart-line) i.fa-chart-line {
    font-family: 'Font Awesome 6 Free' !important;
    font-weight: 900 !important;
  }

  .border-t-2.bg-gradient-to-b > .flex.items-center button:has(.fa-chart-line) i.fa-chart-line::before {
    content: '\f0e7' !important; /* fa-bolt/lightning icon */
  }

  /* Mobile: Transform signal card to show status info - 3 rows x 2 columns grid */
  .mobile-signal-empty {
    display: grid !important;
    grid-template-columns: auto 1fr !important;
    grid-template-rows: repeat(3, 1fr) !important;
    gap: 0 !important;
    padding: 1rem !important;
    position: relative;
    align-items: stretch;
  }

  /* Hide original content text/icons but keep elements for structure */
  .mobile-signal-empty .signal-loading span,
  .mobile-signal-empty .signal-loading i,
  .mobile-signal-empty .signal-placeholder span {
    display: none !important;
  }

  /* Row 1: Estado da análise */
  .mobile-signal-empty .signal-row-1 {
    grid-column: 1 / -1;
    grid-row: 1;
    display: grid !important;
    grid-template-columns: auto 1fr !important;
    gap: 0 1rem !important;
    font-size: 0.875rem;
    margin: 0;
    padding: 1rem 0;
    width: 100%;
    min-height: 3rem;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-signal-empty .signal-row-1::before {
    content: 'Estado da análise';
    grid-column: 1;
    color: rgba(255, 255, 255, 0.7);
    display: block;
  }

  .mobile-signal-empty .signal-row-1::after {
    content: 'Aguardando geração...';
    grid-column: 2;
    color: #FFD058;
    font-weight: 500;
    text-align: right;
    display: block;
  }

  .mobile-signal-empty .signal-row-1 span,
  .mobile-signal-empty .signal-row-1 i {
    display: none !important;
  }

  /* Row 2: Resultado */
  .mobile-signal-empty .signal-row-2 {
    grid-column: 1 / -1;
    grid-row: 2;
    display: grid !important;
    grid-template-columns: auto 1fr !important;
    gap: 0 1rem !important;
    font-size: 0.875rem;
    margin: 0;
    padding: 1rem 0;
    width: 100%;
    min-height: 3rem;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-signal-empty .signal-row-2::before {
    content: 'Resultado';
    grid-column: 1;
    color: rgba(255, 255, 255, 0.7);
    display: block;
  }

  .mobile-signal-empty .signal-row-2::after {
    content: 'Nenhum sinal gerado';
    grid-column: 2;
    color: #FFFFFF;
    font-weight: 500;
    text-align: right;
    display: block;
  }

  .mobile-signal-empty .signal-row-2 span,
  .mobile-signal-empty .signal-row-2 i {
    display: none !important;
  }

  /* Row 3: Confiança - criar container wrapper usando pseudo-elementos */
  .mobile-signal-empty {
    position: relative;
  }

  /* Criar container para linha 3 usando ::before como wrapper */
  .mobile-signal-empty::before {
    content: 'Confiança';
    grid-column: 1;
    grid-row: 3;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    margin: 0;
    padding: 1rem 0;
    min-height: 3rem;
  }

  .mobile-signal-empty::after {
    content: '-';
    grid-column: 2;
    grid-row: 3;
    font-size: 0.875rem;
    color: #FFFFFF;
    font-weight: 500;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    padding: 1rem 0;
    min-height: 3rem;
  }

  /* Remove border-bottom from titles */
  .chart-card .border-b,
  .sidebar-panel .border-b {
    border-bottom: none !important;
  }

  /* Standardize title styles */
  h3.text-base {
    font-size: 1rem !important;
    text-align: left !important;
    font-weight: 600 !important;
  }

  .signal-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  .signal-action {
    width: 100% !important;
    box-sizing: border-box;
  }

  .signal-confidence {
    width: 100% !important;
    box-sizing: border-box;
  }

  .px-6 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    box-sizing: border-box;
  }

  .py-4 {
    padding-top: 0.75rem !important;
    padding-bottom: 0.75rem !important;
    box-sizing: border-box;
  }

  .p-5 {
    padding: 1rem !important;
    box-sizing: border-box;
  }

  .gap-5 {
    gap: 1rem;
  }

  * {
    box-sizing: border-box;
  }
}

/* Desktop: Hide all mobile elements */
@media (min-width: 769px) {
  .mobile-header-signal,
  .mobile-generate-button,
  .mobile-signal-empty {
    display: none !important;
  }

  /* Garantir que elementos mobile não apareçam no desktop */
  .mobile-signal-title,
  .mobile-signal-subtitle {
    display: none !important;
  }

  /* Manter lógica original do sinal gerado no desktop - remover estilos mobile */
  .signal-content-card:not(.mobile-signal-empty) {
    display: block !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Garantir que o conteúdo do sinal seja exibido normalmente no desktop */
  .signal-content-card:not(.mobile-signal-empty) .signal-content {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }

  .signal-content-card:not(.mobile-signal-empty) .signal-header {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
  }
}

  /* Trade Result Modal Premium Styles */
  .trade-result-modal {
    max-width: 400px !important;
    background: linear-gradient(135deg, #1A1C20 0%, #0F1012 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 24px !important;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  }

  .trade-result-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
    text-align: center;
  }

  .trade-result-icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .trade-result-icon-wrapper.win {
    background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 70%);
    border: 2px solid #22C55E;
    color: #22C55E;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
    animation: pulse-win 2s infinite;
  }

  .trade-result-icon-wrapper.loss {
    background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 70%);
    border: 2px solid #EF4444;
    color: #EF4444;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
  }

  .trade-result-icon {
    font-size: 2.5rem;
  }

  @keyframes pulse-win {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }

  .trade-result-status {
    font-size: 0.875rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
  }

  .trade-result-main-value {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .currency-symbol {
    font-size: 1.5rem;
    font-weight: 500;
    margin-right: 2px;
    opacity: 0.8;
  }

  .profit-amount {
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1;
  }

  .trade-result-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    padding: 1.25rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .detail-label {
    font-size: 0.625rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
  }

  .detail-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #FFFFFF;
  }

  .trade-result-confirm-btn {
    width: 100%;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 800;
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    color: #FFFFFF;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .trade-result-confirm-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }

  .trade-result-confirm-btn:active {
    transform: translateY(0);
  }

  /* Tracking UI Enhancements */
  .countdown-warning {
    color: #EF4444 !important;
    animation: blink-red 1s infinite;
  }

  .countdown-alert {
    color: #F59E0B !important;
  }

  @keyframes blink-red {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  /* Digit Analysis Styles */
  .status-underheated-pill { background-color: #10b981; color: white; }
  .status-normal-pill { background-color: #eab308; color: black; }
  .status-heated-pill { background-color: #f97316; color: white; }
  .status-overheated-pill { background-color: #ef4444; color: white; }

  .status-underheated-text { color: #10b981; }
  .status-normal-text { color: #eab308; }
  .status-heated-text { color: #f97316; }
  .status-overheated-text { color: #ef4444; }

  .status-underheated-bar { background-color: #10b981; }
  .status-normal-bar { background-color: #eab308; }
  .status-heated-bar { background-color: #f97316; }
  .status-overheated-bar { background-color: #ef4444; }

  .bar-rank-highest { background-color: #22C55E !important; }
  .bar-rank-lowest { background-color: #EF4444 !important; }
  .bar-rank-normal { background-color: rgba(255, 255, 255, 0.1) !important; }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .digits-tab-container {
    height: auto !important;
    max-height: none !important;
    min-height: auto !important; /* fit-content behavior */
    overflow: visible !important;
  }

  .dvx-status-green-text { color: #22C55E; }
  .dvx-status-yellow-text { color: #FFD058; }
  .dvx-status-red-text { color: #FF4747; }

  /* --- META DESIGN STYLES --- */
  .frequency-meta-card, .meta-analysis-card {
    background-color: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
  }

  .digit-meta-item {
    background-color: #080808 !important;
    border: 1px solid rgba(255, 255, 255, 0.03) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .digit-meta-item:hover {
    transform: translateY(-5px);
    background-color: #0F0F0F !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }

  .meta-digit-number {
    text-shadow: 0 0 8px currentColor;
    letter-spacing: -0.05em;
  }

  .meta-highest-freq {
    border-color: rgba(34, 197, 94, 0.4) !important;
    background: radial-gradient(circle at top, rgba(34, 197, 94, 0.2), transparent) !important;
    box-shadow: 0 15px 30px -10px rgba(34, 197, 94, 0.3);
  }

  .meta-lowest-freq {
    border-color: rgba(239, 68, 68, 0.4) !important;
    background: radial-gradient(circle at top, rgba(239, 68, 68, 0.1), transparent) !important;
  }

  .meta-highlight {
    border-color: rgba(34, 197, 94, 0.3) !important;
    background: radial-gradient(circle at top, rgba(34,197,94,0.1), transparent) !important;
    box-shadow: 0 15px 30px -10px rgba(34, 197, 94, 0.2);
  }

  .meta-vertical-meter-container {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .meta-vertical-meter-fill {
    border-radius: 10px;
    box-shadow: 0 0 15px currentColor;
  }

  .status-overheated .meta-vertical-meter-fill { box-shadow: 0 0 15px #EF4444; }
  .status-heated .meta-vertical-meter-fill { box-shadow: 0 0 15px #F59E0B; }
  .status-underheated .meta-vertical-meter-fill { box-shadow: 0 0 15px #3B82F6; }
  .status-normal .meta-vertical-meter-fill { box-shadow: 0 0 15px #64748B; }

  .volatility-meter-thumb {
    transition: left 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Mobile: Cards de dígitos mais compactos */
  @media (max-width: 768px) {
    .digit-meta-item {
      padding: 0.5rem !important;
    }

    .meta-digit-number {
      font-size: 1.5rem !important;
      margin-bottom: 0.25rem !important;
    }

    .meta-digit-percentage {
      font-size: 9px !important;
      margin-bottom: 0.75rem !important;
    }

    .meta-vertical-meter-container {
      width: 1rem !important;
      height: 3rem !important;
    }

    .frequency-meta-card {
      padding: 1rem !important;
    }

    .frequency-meta-card h3 {
      font-size: 8px !important;
      margin-bottom: 1rem !important;
    }
  }
</style>

<style src="../assets/css/components/OperationDigits.css"></style>
<style scoped>
/* Copied from OperationDigits.vue mobile styles */
@media (max-width: 768px) {
    .digit-meta-grid {
        grid-template-columns: repeat(5, 1fr) !important;
        grid-template-rows: repeat(2, auto) !important;
        gap: 0.5rem !important;
        padding: 0.5rem !important;
    }

    .digit-meta-item {
        padding: 0.5rem !important;
        min-height: auto !important;
    }

    .meta-digit-number {
        font-size: 1.5rem !important;
        margin-bottom: 0.25rem !important;
    }

    .meta-digit-percentage {
        font-size: 9px !important;
        margin-bottom: 0.75rem !important;
    }

    .meta-vertical-meter-container {
        width: 1rem !important;
        height: 3rem !important;
    }

    .frequency-meta-card {
        padding: 1rem !important;
    }

    .frequency-meta-card h3 {
        font-size: 8px !important;
        margin-bottom: 1rem !important;
    }
    
    .meta-analysis-card {
        padding: 1rem !important;
        min-height: auto !important;
    }

    .meta-analysis-card .text-6xl {
        font-size: 3rem !important;
    }
}
</style>
