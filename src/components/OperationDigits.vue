<template>
    <div class="main-container">
        <!-- Tela de carregamento -->
        <div v-if="connectionError || isLoading" class="connection-loading">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
        </div>
            
        <div class="digits-layout">
            <!-- Main Content Grid -->
            <div class="main-content-grid">
                <!-- Premium Header -->
                <div class="premium-analysis-header mb-6 hidden md:block">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="analysis-icon-wrapper">
                                <i class="fas fa-chart-line text-zenix-green"></i>
                                <div class="icon-pulse"></div>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-white tracking-tight">Análise de Dígitos - Deriv</h2>
                                <p class="text-xs text-white/40 font-medium uppercase tracking-widest">Monitoramento em tempo real</p>
                            </div>
                        </div>
                        <div class="live-status-badge">
                            <span class="pulse-dot"></span>
                            <span class="text-[10px] font-black uppercase tracking-[0.2em]">LIVE</span>
                        </div>
                    </div>
                </div>

                <div class="cards-grid">
                    <!-- Linha 1: Frequência Geral (Meta Design) -->
                    <div class="frequency-meta-card bg-black border border-white/5 rounded-xl p-6 mb-6 h-fit">
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
                                        :style="{ height: item.percentage + '%', backgroundColor: item.statusClass === 'status-max' ? '#22C55E' : (item.statusClass === 'status-heated' ? '#F59E0B' : (item.statusClass === 'status-min' ? '#EF4444' : 'rgba(255,255,255,1)')) }"
                                    ></div>
                                </div>
                                <span class="text-[9px] font-bold text-white/20 mt-4 uppercase">{{ item.percentage }}%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Linha 2: Resumo em Duas Colunas (Volatilidade e Paridade) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <!-- Volatilidade (Meta Style) -->
                        <div class="meta-analysis-card bg-black border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
                            <div class="flex items-center justify-between mb-2">
                                <h3 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Volatilidade</h3>
                                <div class="flex items-center gap-2 px-2 py-1 bg-zenix-green/10 rounded-full border border-zenix-green/20">
                                    <span class="w-1.5 h-1.5 bg-zenix-green rounded-full shadow-[0_0_5px_#22C55E]"></span>
                                    <span class="text-[9px] font-bold text-zenix-green uppercase">Estável</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-6 py-4">
                                <div class="flex flex-col items-center ml-6 mr-8">
                                    <span class="text-6xl font-black text-zenix-green leading-none">{{ dvxValueComputed }}</span>
                                    <span class="text-sm font-bold text-white/40 uppercase mt-2">DVX</span>
                                </div>
                                
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-bold text-zenix-green">Volatilidade Baixa</span>
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
                            
                            <p class="text-[10px] text-white/30 font-medium">Ambiente estável para operações de baixo risco</p>
                        </div>

                        <!-- Paridade (Meta Style) -->
                        <div class="meta-analysis-card bg-black border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
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
                                            <span class="text-xs font-black text-zenix-green">{{ digitFrequency.parity.even }}%</span>
                                        </div>
                                        <div class="h-4 bg-white/5 rounded-full overflow-hidden">
                                            <div class="h-full bg-zenix-green transition-all duration-1000" :style="{ width: digitFrequency.parity.even + '%' }"></div>
                                        </div>
                                    </div>
                                    <div class="parity-meta-item">
                                        <div class="flex justify-between items-center mb-1.5">
                                            <span class="text-xs font-bold text-white/40">Ímpar</span>
                                            <span class="text-xs font-black text-white/20">{{ digitFrequency.parity.odd }}%</span>
                                        </div>
                                        <div class="h-4 bg-white/5 rounded-full overflow-hidden">
                                            <div class="h-full bg-white/5 transition-all duration-1000" :style="{ width: digitFrequency.parity.odd + '%' }"></div>
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
                                        <span class="text-[9px] font-bold text-white/20 uppercase tracking-wider">Menos Frequente</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="recent-history-card bg-[#0D0D0D] border border-white/5 p-6 rounded-2xl mb-4 h-fit">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Histórico Recente</h3>
                        <div class="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                            <i class="far fa-clock text-[10px] text-white/40"></i>
                            <span class="text-[10px] font-bold text-white/60">Últimos 14</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-7 md:flex md:flex-nowrap gap-2 justify-start">
                        <div 
                            v-for="(digit, index) in recentDigits" 
                            :key="'recent-'+index"
                            class="h-10 w-10 md:h-12 md:w-12 bg-[#080808] border border-white/5 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 flex-shrink-0"
                            :class="[
                                index === (recentDigits.length - 1) ? 'bg-zenix-green/20 text-zenix-green border-zenix-green/50 shadow-[0_0_15px_#22C55E33]' : 'text-white/40'
                            ]"
                        >
                            {{ digit }}
                        </div>
                        <div v-if="recentDigits.length === 0" class="text-white/20 text-xs italic tracking-widest py-2 w-full text-left ml-2">Sincronizando dados...</div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Panel -->
            <div class="sidebar-panel trading-panel w-[400px] flex-shrink-0 bg-[#0D0D0D] border border-white/5 p-8 overflow-y-auto rounded-xl">
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
                                <i :class="selectedTradeTypeIcon + ' text-[#22C55E] text-xl'"></i>
                                <span class="font-medium">{{ selectedTradeTypeGroupLabel }}</span>
                            </div>
                            <i class="fas fa-chevron-down text-xs opacity-40"></i>
                        </button>
                    </div>

                    <!-- Previsão (Dígito) -->
                    <div v-if="['digits_match_diff', 'digits_over_under'].includes(selectedTradeTypeGroup)">
                        <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Barreira (Dígito)</label>
                        <select v-model="digitMatchValue" class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-medium appearance-none cursor-pointer">
                            <option v-for="d in 10" :key="d-1" :value="d-1">{{ d-1 }}</option>
                        </select>
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
                            step="0.01"
                            v-model.number="amount"
                            class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
                        />
                    </div>

                    <!-- Card de Dígitos de Previsão -->
                    <div v-if="showDigitsPredictionCard" class="bg-zenix-bg border border-zenix-border rounded-lg p-4">
                        <div class="text-xs font-medium text-zenix-secondary mb-3">
                            <i class="fas fa-calculator text-zenix-green mr-2"></i>Status do Último Dígito
                        </div>
                        <div class="text-xs text-zenix-secondary mb-2">Último dígito: <span class="text-zenix-green font-bold">{{ lastDigit }}</span> ({{ lastDigitParity }})</div>
                    </div>
                    
                    <!-- Real-time P&L -->
                    <div v-if="realTimeProfit !== null && activeContract" class="w-full bg-zenix-bg border rounded-lg p-3 shadow-lg transition-all duration-300 transform hover:scale-[1.02]" :class="realTimeProfitClass">
                        <div class="text-[10px] uppercase font-bold text-zenix-secondary mb-1 tracking-wider">Lucro Atual (Estimado):</div>
                        <div class="text-lg font-black flex items-center gap-2" :class="realTimeProfitTextClass">
                            <i :class="realTimeProfit >= 0 ? 'fas fa-trending-up' : 'fas fa-trending-down'"></i>
                            $ {{ realTimeProfit >= 0 ? '+' : '' }}{{ realTimeProfit.toFixed(2) }}
                        </div>
                    </div>
                    
                    <!-- Ticks Restantes -->
                    <div v-if="activeContract && (contractTimeRemaining !== null || contractTicksRemaining !== null)" class="w-full bg-zenix-bg border border-zenix-border rounded-lg p-3 relative overflow-hidden group">
                        <div class="absolute top-0 left-0 h-1 bg-zenix-green/30 transition-all duration-1000" :style="{ width: isTickBasedContract ? (100 - (contractTicksRemaining / (activeContract.duration || duration) * 100)) + '%' : (100 - (contractTimeRemaining / (activeContract.duration || duration) * 100)) + '%' }"></div>
                        
                        <div class="text-[10px] uppercase font-bold text-zenix-secondary mb-1 tracking-wider flex items-center justify-between">
                            <span>{{ isTickBasedContract ? 'Ticks Restantes:' : 'Tempo Restante:' }}</span>
                            <i class="fas fa-history text-xs"></i>
                        </div>
                        <div class="text-xl font-black text-zenix-text flex items-baseline gap-1" :class="getCountdownClass">
                            <span v-if="isTickBasedContract">
                                {{ contractTicksRemaining }}
                            </span>
                             <span v-else>
                                {{ formatTimeRemaining(contractTimeRemaining) }}
                            </span>
                            <span class="text-[10px] text-zenix-secondary font-medium ml-1">RESTANTES</span>
                        </div>
                    </div>

                    <!-- Compra Executada Message -->
                    <div v-if="isTrading || (activeContract && !showTradeResultModal)" class="mt-3 p-3 bg-zenix-green/10 border border-zenix-green/30 rounded flex items-center justify-center gap-2 animate-pulse">
                        <i class="fas fa-check-circle text-zenix-green"></i>
                        <span class="text-zenix-green font-bold text-xs uppercase tracking-wider">Compra Executada!</span>
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
                </div>
            </div>

            <!-- Trade Result Modal -->
            <TradeResultModal
                v-if="isMobile"
                :visible="showTradeResultModal"
                :profit="finalTradeProfit"
                :currency="accountCurrency"
                :type="finalTradeType"
                :buyPrice="finalEntrySpot || 0"
                :sellPrice="finalExitSpot || 0"
                @close="closeTradeResultModal"
            />

            <Teleport to="body" v-else>
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
                                <div class="trade-result-icon-wrapper" :class="finalTradeProfit >= 0 ? 'win' : 'loss'">
                                    <div class="trade-result-icon">
                                        <i :class="finalTradeProfit >= 0 ? 'fas fa-trophy' : 'fas fa-chart-line rotate-180'"></i>
                                    </div>
                                    <div class="trade-result-particles"></div>
                                </div>
                                <h4 class="trade-result-status" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                    {{ finalTradeProfit >= 0 ? 'VITÓRIA' : 'DERROTA' }}
                                </h4>
                                <div class="trade-result-main-value" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                    <span class="currency-symbol">$</span>
                                    <span class="profit-amount">{{ Math.abs(finalTradeProfit).toFixed(pricePrecision) }}</span>
                                </div>
                                <div class="trade-result-details-grid">
                                    <div class="detail-item">
                                        <span class="detail-label">TIPO</span>
                                        <span class="detail-value">{{ finalTradeType }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">ENTRADA</span>
                                        <span class="detail-value">$ {{ finalEntrySpot ? finalEntrySpot.toFixed(pricePrecision) : '---' }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">SAÍDA</span>
                                        <span class="detail-value">$ {{ finalExitSpot ? finalExitSpot.toFixed(pricePrecision) : '---' }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">STATUS</span>
                                        <span class="detail-value" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                            {{ finalTradeProfit >= 0 ? 'Profit' : 'Loss' }}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    @click="closeTradeResultModal"
                                    class="trade-result-confirm-btn"
                                    :class="finalTradeProfit >= 0 ? 'bg-zenix-green' : 'bg-red-500'"
                                >
                                    ENTENDIDO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Teleport>
        </div>

        <!-- Market Selection Modal -->
        <Teleport to="body">
            <div 
                v-if="showMarketModal" 
                class="modal-overlay market-modal-overlay" 
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
                                            <path d="M22 11L13.5 15.5L8.5 10.5L2 14" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 11H22V17" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Criptomoedas'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="#22C55E" stroke-width="2.5"/>
                                            <path d="M9 12H15M12 9V15" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Forex Majors' || category === 'Forex Minors' || category === 'Forex Exotics'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="#22C55E" stroke-width="2.5"/>
                                            <path d="M15 9L9 15M9 9L15 15" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
                                            <path d="M12 2V22" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Metais'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 4L18 4L21 9L12 21L3 9L6 4Z" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M3 9H21" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 21V9" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <i v-else class="fas fa-chart-line text-[#22C55E] text-lg"></i>
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
                            <div v-for="category in tradeTypeCategories" :key="category.id" class="category-card">
                                <div class="category-card-header">
                                    <div class="category-icon-wrapper">
                                        <i :class="category.icon + ' text-[#22C55E] text-xl'"></i>
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
                                        {{ item.label }}
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

<script>
import TradeResultModal from './TradeResultModal.vue';

const APP_ID = process.env.VUE_APP_DERIV_APP_ID || '1089';

export default {
  name: 'OperationDigits',
  components: {
    TradeResultModal
  },
  props: {
    accountBalance: { type: String, required: true },
    accountCurrency: { type: String, default: 'USD' },
    preferredCurrency: { type: String, default: 'USD' },
    accountLoginid: { type: String, default: null }
  },
  data() {
    return {
      isMobile: false,
      isGlobalLoading: true,
      tradingMode: 'manual', // 'manual' ou 'ai'
      digitFrequency: { digits: [], frequency: {}, parity: { even: 0, odd: 0 } },
      symbol: 'R_100',
      tradeType: 'DIGITMATCH',
      duration: 1,
      durationUnit: 't',
      amount: 10,
      currency: 'USD',
      showMarketModal: false,
      showTradeTypeModal: false,
      showTradeResultModal: false,
      finalTradeProfit: 0,
      finalTradeType: 'DIGITMATCH',
      finalEntrySpot: null,
      finalExitSpot: null,
      markets: [],
      isLoadingMarkets: true,
      isLoadingTicks: true,
      latestTick: null,
      digitMatchValue: 5,
      activeContract: null,
      isTrading: false,
      tradeError: '',
      tradeMessage: '',
      realTimeProfit: null,
      contractTimeRemaining: null,
      contractTicksRemaining: null,
      isAnalyzing: false,
      aiRecommendation: null,
      signalCountdown: null,
      signalCountdownInterval: null,
      allHistoricalTicks: [],
      selectedTradeTypeGroup: 'digits_match_diff',
      ws: null,
      wsIsConnecting: false,
      wsAuthorized: false,
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
      availableContracts: [],
      isLoadingContracts: false
    };
  },
  computed: {
    isLoading() {
      return this.isLoadingMarkets || this.isLoadingTicks;
    },
    digitFrequencies() {
      const counts = new Array(10).fill(0);
      const totalDigits = this.digitFrequency.digits.length;
      this.digitFrequency.digits.forEach(digit => {
        if (digit >= 0 && digit <= 9) counts[digit]++;
      });
      return counts.map((count, index) => {
        const percentage = totalDigits > 0 ? (count / totalDigits) * 100 : 0;
        let statusClass = 'status-normal';
        if (percentage >= 12) statusClass = 'status-max';
        else if (percentage >= 10.5) statusClass = 'status-heated';
        else if (percentage <= 8.5) statusClass = 'status-min';
        return {
          digit: index,
          count,
          percentage: Math.round(percentage * 10) / 10,
          statusClass
        };
      });
    },
    digitFrequenciesWithStats() {
       return this.digitFrequencies.map(item => {
           return {
               ...item,
               isMax: item.statusClass === 'status-max',
               isMin: item.statusClass === 'status-min'
           };
       });
    },
    dvxValueComputed() {
      if (this.digitFrequency.digits.length < 20) return 0;
      const frequencies = this.digitFrequencies;
      let variance = 0;
      frequencies.forEach(f => { variance += Math.pow(f.percentage - 10, 2); });
      const stdDev = Math.sqrt(variance / 10);
      return Math.min(100, Math.round((stdDev / 15) * 100));
    },
    selectedMarketLabel() {
      const market = this.markets.find(m => m.value === this.symbol);
      return market ? market.label : 'Volatility 100 Index';
    },
    selectedTradeTypeGroupLabel() {
      for (const cat of this.tradeTypeCategories) {
        const item = cat.items.find(i => i.value === this.selectedTradeTypeGroup);
        if (item) return item.label;
      }
      return 'Selecionar Tipo';
    },
    selectedTradeTypeIcon() {
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
    isDigitContract() {
      return ['DIGITMATCH', 'DIGITDIFF', 'DIGITEVEN', 'DIGITODD', 'DIGITOVER', 'DIGITUNDER'].includes(this.tradeType);
    },
    showDigitsPredictionCard() {
      return this.isDigitContract && !['DIGITEVEN', 'DIGITODD'].includes(this.tradeType) && this.latestTick && this.tradingMode !== 'ai';
    },
    canExecuteOrder() {
      return this.symbol && this.duration && this.amount && !this.isTrading && !this.activeContract;
    },
    isTickBasedContract() {
      return this.activeContract && this.activeContract.duration_unit === 't';
    },
    getCountdownClass() {
      const val = this.isTickBasedContract ? this.contractTicksRemaining : this.contractTimeRemaining;
      if (val === null) return 'text-white';
      return val <= 5 ? 'text-red-500 animate-pulse' : 'text-white';
    },
    realTimeProfitClass() {
      if (this.realTimeProfit === null) return 'border-white/5';
      return this.realTimeProfit >= 0 ? 'border-zenix-green bg-zenix-green/5' : 'border-red-500 bg-red-500/5';
    },
    realTimeProfitTextClass() {
      if (this.realTimeProfit === null) return 'text-white';
      return this.realTimeProfit >= 0 ? 'text-zenix-green' : 'text-red-500';
    },
    displayCurrency() {
        return this.preferredCurrency || this.accountCurrency || 'USD';
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
    canExecuteAIOrder() {
        return this.aiRecommendation && this.canExecuteOrder;
    },
    lastDigit() {
      if (!this.latestTick) return '-';
      const valStr = this.latestTick.value.toString();
      return valStr.charAt(valStr.length - 1);
    },
    lastDigitParity() {
      if (this.lastDigit === '-') return '-';
      return parseInt(this.lastDigit) % 2 === 0 ? 'PAR' : 'ÍMPAR';
    },
    recentDigits() {
        return this.digitFrequency.digits.slice(-14);
    },
    mostFrequentDigit() {
        if (!this.digitFrequencies || this.digitFrequencies.length === 0) return null;
        return [...this.digitFrequencies].sort((a, b) => b.percentage - a.percentage)[0];
    },
    leastFrequentDigit() {
        if (!this.digitFrequencies || this.digitFrequencies.length === 0) return null;
        return [...this.digitFrequencies].sort((a, b) => a.percentage - b.percentage)[0];
    },
    loadingMessage() {
        if (this.wsConnectionError) return 'Reconectando...';
        return 'Carregando Dados...';
    },
    pricePrecision() {
        return 2;
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.initDirectConnection();
    // 2. Initial Data Loading (Updated sequence)
    this.fetchMarkets(); // Load markets from backend with new endpoint
    
    if (!this.symbol) {
        this.symbol = 'R_100'; // Default
    }

    if (this.symbol) {
      this.loadAvailableContracts(this.symbol);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
    this.stopDirectConnection();
    this.stopAnalysis();
  },
  methods: {
    async initDirectConnection() {
      this.stopDirectConnection();
      this.wsIsConnecting = true;
      try { this.wsToken = await this.getTokenForAccount(); } catch (e) { console.error('[OperationDigits] Token error:', e); }
      const appId = localStorage.getItem('deriv_app_id') || APP_ID;
      this.ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${appId}`);
      this.ws.onopen = () => {
        if (this.wsToken) this.wsSend({ authorize: this.wsToken });
        else this.onWSConnected();
      };
      this.ws.onmessage = (event) => {
        try { this.handleWSMessage(JSON.parse(event.data)); } catch (e) { console.error('[OperationDigits] Message error:', e); }
      };
      this.ws.onclose = () => { this.scheduleWSRetry(); };
    },
    stopDirectConnection() {
      if (this.ws) this.ws.close();
      if (this.wsRetryTimer) clearTimeout(this.wsRetryTimer);
      this.tickSubscriptionId = null;
    },
    wsSend(payload) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(payload));
    },
    onWSConnected() {
      this.subscribeWSTicks();
    },
    handleWSMessage(msg) {
      if (msg.error) {
        if (msg.msg_type === 'buy') { this.tradeError = msg.error.message; this.isTrading = false; }
        return;
      }
      switch (msg.msg_type) {
        case 'authorize':
          this.wsAuthorized = true;
          this.currency = msg.authorize.currency || 'USD';
          this.onWSConnected();
          break;
        case 'history':
          this.processWSHistory(msg);
          break;
        case 'tick':
          this.processWSTick(msg.tick);
          break;
        case 'buy':
          this.processBuy(msg.buy);
          break;
        case 'proposal_open_contract':
          this.processContract(msg.proposal_open_contract);
          break;
      }
    },
    subscribeWSTicks() {
      if (!this.symbol) return;
      if (this.tickSubscriptionId) this.wsSend({ forget: this.tickSubscriptionId });
      this.wsSend({ ticks_history: this.symbol, end: 'latest', count: 500, style: 'ticks', subscribe: 1 });
    },
    processWSHistory(msg) {
      const history = msg.history;
      if (!history || !history.prices) return;
      this.isLoadingTicks = false;
      this.allHistoricalTicks = history.prices.map((price, i) => ({ value: Number(price), epoch: Number(history.times[i]) }));
      if (msg.subscription) this.tickSubscriptionId = msg.subscription.id;
      this.calculateDigitFrequency();
      this.isGlobalLoading = false;
    },
    processWSTick(tick) {
      if (!tick) return;
      if (tick.id) this.tickSubscriptionId = tick.id;
      const tickData = { value: Number(tick.quote), epoch: Number(tick.epoch) };
      this.latestTick = tickData;
      this.allHistoricalTicks.push(tickData);
      if (this.allHistoricalTicks.length > 1000) this.allHistoricalTicks.shift();
      this.calculateDigitFrequency();
      if (this.activeContract) this.updateRealTimeProfit();
    },
    calculateDigitFrequency() {
      const lastSample = this.allHistoricalTicks.slice(-500);
      const digits = [];
      const frequency = {};
      for (let i = 0; i <= 9; i++) frequency[i] = 0;
      lastSample.forEach(tick => {
        const valStr = tick.value.toString();
        const lastChar = valStr.charAt(valStr.length - 1);
        const lastDigit = parseInt(lastChar);
        if (!isNaN(lastDigit)) { digits.push(lastDigit); frequency[lastDigit]++; }
      });
      const total = digits.length;
      let even = 0; digits.forEach(d => { if (d % 2 === 0) even++; });
      this.digitFrequency = {
        digits,
        frequency,
        parity: {
          even: total > 0 ? Math.round((even / total) * 100) : 0,
          odd: total > 0 ? 100 - Math.round((even / total) * 100) : 0
        }
      };
    },
    async getTokenForAccount() {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
      try {
        const response = await fetch(`${apiBaseUrl}/broker/deriv/trading/token`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          return data.token;
        }
      } catch (e) { console.error('[OperationDigits] error:', e); }
      return localStorage.getItem('deriv_token');
    },
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
        console.log('[OperationDigits] Mercados carregados do backend:', this.markets.length);

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
      } finally {
        this.isLoadingMarkets = false;
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
             console.log('[OperationDigits] Contratos detalhados carregados do backend:', this.availableContracts.length);
        } else {
             console.warn('[OperationDigits] Sem contratos detalhados na tabela market_contracts para:', symbol);
             this.availableContracts = [];
        }

        // Validate current trade type
        if (this.tradeType) {
             const availableTypes = this.availableContracts.map(c => c.contract_type.toUpperCase());
             const isAvailable = availableTypes.includes(this.tradeType.toUpperCase());
             
             if (!isAvailable) {
                  // Se o tipo atual não estiver disponível, tenta selecionar o primeiro disponível
                  // Mas mantenha DIGITMATCH como preferência se disponível
                  if (availableTypes.includes('DIGITMATCH')) {
                     this.tradeType = 'DIGITMATCH';
                     this.selectedTradeTypeGroup = 'digits_match_diff';
                  } else {
                     this.tradeType = availableTypes[0] || '';
                  }
                  console.log('[OperationDigits] Tipo de negociação reajustado:', this.tradeType);
             }
        }
        
      } catch (error) {
        console.error('[OperationDigits] Erro ao carregar contratos:', error);
        this.availableContracts = [];
      } finally {
        this.isLoadingContracts = false;
      }
    },
    openMarketModal() { this.showMarketModal = true; },
    closeMarketModal() { this.showMarketModal = false; },
    async selectMarket(symbol) {
      this.symbol = symbol;
      this.subscribeWSTicks();
      this.closeMarketModal();
    },
    openTradeTypeModal() { this.showTradeTypeModal = true; },
    closeTradeTypeModal() { this.showTradeTypeModal = false; },
    selectTradeType(item) {
      this.selectedTradeTypeGroup = item.value;
      if (item.directions && item.directions.length > 0) this.tradeType = item.directions[0].value;
      this.closeTradeTypeModal();
    },
    executeTradeWithDirection(direction) {
      this.tradeType = direction;
      this.executeBuy();
    },
    executeBuy() {
      if (this.isTrading || this.activeContract) return;
      this.isTrading = true;
      this.tradeError = '';
      this.tradeMessage = '';
      const payload = {
        buy: 1,
        subscribe: 1,
        price: 100,
        parameters: {
          amount: Number(this.amount),
          basis: 'stake',
          contract_type: this.tradeType,
          currency: this.currency,
          duration: Number(this.duration),
          duration_unit: this.durationUnit,
          symbol: this.symbol
        }
      };
      if (this.isDigitContract && !['DIGITEVEN', 'DIGITODD'].includes(this.tradeType)) {
          payload.parameters.barrier = this.digitMatchValue.toString();
      }
      this.wsSend(payload);
    },
    processBuy(buy) {
      this.isTrading = false;
      this.activeContract = { ...buy, symbol: this.symbol, type: this.tradeType };
      this.wsSend({ proposal_open_contract: 1, contract_id: buy.contract_id, subscribe: 1 });
    },
    processContract(contract) {
      this.realTimeProfit = contract.profit;
      if (contract.is_sold) {
          this.finalTradeProfit = contract.profit;
          this.finalTradeType = this.tradeType;
          this.finalEntrySpot = contract.entry_spot;
          this.finalExitSpot = contract.exit_spot;
          this.showTradeResultModal = true;
          this.activeContract = null;
          this.realTimeProfit = null;
      }
    },
    closeTradeResultModal() { this.showTradeResultModal = false; },
    checkMobile() { this.isMobile = window.innerWidth <= 768; },
    toggleAnalysis() { this.isAnalyzing ? this.stopAnalysis() : this.startAnalysis(); },
    startAnalysis() { this.isAnalyzing = true; this.analyzeChart(); },
    stopAnalysis() { this.isAnalyzing = false; this.aiRecommendation = null; },
    async analyzeChart() {
       setTimeout(() => {
           this.aiRecommendation = { action: 'DIGITMATCH', confidence: 85, entry_time: 15 };
           this.isAnalyzing = false;
       }, 2000);
    },
    executeAIOrder() { if (this.aiRecommendation) this.executeTradeWithDirection(this.aiRecommendation.action); },
    getDirectionButtonClass(dir) { return ['PUT', 'DIGITDIFF', 'DIGITUNDER', 'DIGITODD'].includes(dir) ? 'bg-red-500 text-white' : 'bg-zenix-green text-black'; },
    getDirectionIcon(dir) {
        const icons = { 'CALL': 'fas fa-arrow-up', 'PUT': 'fas fa-arrow-down', 'DIGITMATCH': 'fas fa-equals', 'DIGITDIFF': 'fas fa-not-equal', 'DIGITOVER': 'fas fa-greater-than', 'DIGITUNDER': 'fas fa-less-than', 'DIGITEVEN': 'fas fa-divide', 'DIGITODD': 'fas fa-percent' };
        return icons[dir] || 'fas fa-play';
    },
    getButtonIcon(type) { return this.getDirectionIcon(type); },
    getButtonColor(type) { return ['PUT', 'DIGITDIFF', 'DIGITUNDER', 'DIGITODD'].includes(type) ? 'text-red-500' : 'text-zenix-green'; },
    getButtonLabel(type) {
        const labels = { 'DIGITMATCH': 'Combina', 'DIGITDIFF': 'Difere', 'CALL': 'Sobe', 'PUT': 'Desce', 'DIGITEVEN': 'Par', 'DIGITODD': 'Ímpar', 'DIGITOVER': 'Superior', 'DIGITUNDER': 'Inferior' };
        return labels[type] || type;
    },
    scheduleWSRetry() {
      if (this.wsRetryTimer) return;
      this.wsRetryTimer = setTimeout(() => {
        this.wsRetryTimer = null;
        this.initDirectConnection();
      }, 3000);
    },
    updateRealTimeProfit() {
        // Logic to update profit manually if needed, usually handled by processContract
    }
  }
};
</script>

<style src="../assets/css/components/OperationDigits.css"></style>
<style scoped>
.connection-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #06d6a0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

  /* --- META DESIGN STYLES --- */
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

  .meta-highest-freq {
    border-color: rgba(34, 197, 94, 0.4) !important;
    background: radial-gradient(circle at top, rgba(34, 197, 94, 0.2), transparent) !important;
    box-shadow: 0 15px 30px -10px rgba(34, 197, 94, 0.3);
  }

  .meta-lowest-freq {
    border-color: rgba(239, 68, 68, 0.4) !important;
    background: radial-gradient(circle at top, rgba(239, 68, 68, 0.1), transparent) !important;
  }

  .meta-digit-number {
    text-shadow: 0 0 8px currentColor;
    letter-spacing: -0.05em;
  }

  .meta-vertical-meter-fill {
    border-radius: 10px;
    box-shadow: 0 0 15px currentColor;
  }

/* Mobile Responsive */
@media (max-width: 768px) {
    .main-container {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden;
        box-sizing: border-box;
        padding: 0 !important;
        margin: 0 !important;
    }

    .digits-layout {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden;
        box-sizing: border-box;
        padding: 0 !important;
        margin: 0 0 6.5rem !important;
        display: flex;
        flex-direction: column;
    }

    .main-content-grid {
        order: 2;
    }

    .trading-panel {
        order: 4;
        width: 100% !important;
        max-width: 100% !important;
        padding: 1rem !important;
        margin: 0 !important;
        box-sizing: border-box;
        background: linear-gradient(135deg, rgba(9, 20, 9, 0) 0%, rgb(13, 20, 13) 50%, rgba(0, 0, 0, 0.4) 100%) !important;
        border: 1px solid #1C1C1C !important;
        border-radius: 0.75rem !important;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
    }

    .main-content-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    /* Standardize all titles */
    .card-header,
    h3.text-base {
        font-size: 1rem !important;
        text-align: left !important;
        font-weight: 600 !important;
    }

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
        font-size: 0.625rem !important;
        margin-bottom: 0.5rem !important;
    }

    .meta-vertical-meter-container {
        height: 40px !important;
        width: 4px !important;
    }

    .meta-analysis-card {
        padding: 1rem !important;
        min-height: auto !important;
    }

    * {
        box-sizing: border-box;
    }
}
</style>
