<template>
    <div class="main-container">
        <!-- Tela de carregamento -->
        <div v-if="connectionError || isConnecting" class="connection-loading">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
        </div>
            
        <div class="digits-layout">
            <!-- Seção: Porcentagem de frequência de dígitos -->
            <div class="frequency-unified-card-wrapper">
                <div class="frequency-unified-card bg-[#000000] border border-white/5 rounded-xl p-8 shadow-2xl">
                    <h3 class="frequency-section-title text-base font-medium text-white/90 mb-10 text-center tracking-wide">Porcentagem de frequência de dígitos</h3>
                    <div class="frequency-charts-grid grid grid-cols-1 md:grid-cols-3 gap-16">
                        <!-- Últimos 25 Dígitos -->
                        <div class="frequency-chart-container flex flex-col items-center">
                            <h4 class="frequency-chart-subtitle text-xs font-normal text-white/40 mb-6 tracking-wider">Últimos 25 Dígitos</h4>
                            <div class="histogram-container flex items-end w-full max-w-[280px]">
                                <div v-for="item in frequencies25" :key="'freq25-'+item.digit" class="histogram-column flex flex-col items-center flex-1">
                                    <div class="histogram-bar-wrapper w-full h-[120px] flex items-end justify-center">
                                        <div 
                                            class="histogram-bar w-full transition-all duration-700 ease-out relative" 
                                            :class="getHistogramBarClass(item.digit, item.percentage, frequencies25)"
                                            :style="{ height: (item.percentage > 0 ? Math.max(4, Math.min((item.percentage * 4), 130)) : 0) + 'px', maxHeight: '130px', minHeight: item.percentage > 0 ? '4px' : '0px' }"
                                        >
                                            <div class="histogram-percentage text-[10px] font-bold text-white absolute bottom-full left-1/2 transform -translate-x-1/2">{{ Math.round(item.percentage) }}%</div>
                                        </div>
                                    </div>
                                    <div class="histogram-digit text-xs font-bold text-white mt-2">{{ item.digit }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Últimos 50 Dígitos -->
                        <div class="frequency-chart-container flex flex-col items-center">
                            <h4 class="frequency-chart-subtitle text-xs font-normal text-white/40 mb-6 tracking-wider">Últimos 50 Dígitos</h4>
                            <div class="histogram-container flex items-end w-full max-w-[280px]">
                                <div v-for="item in frequencies50" :key="'freq50-'+item.digit" class="histogram-column flex flex-col items-center flex-1">
                                    <div class="histogram-bar-wrapper w-full h-[120px] flex items-end justify-center">
                                        <div 
                                            class="histogram-bar w-full transition-all duration-700 ease-out relative" 
                                            :class="getHistogramBarClass(item.digit, item.percentage, frequencies50)"
                                            :style="{ height: (item.percentage > 0 ? Math.max(4, Math.min((item.percentage * 4), 130)) : 0) + 'px', maxHeight: '130px', minHeight: item.percentage > 0 ? '4px' : '0px' }"
                                        >
                                            <div class="histogram-percentage text-[10px] font-bold text-white absolute bottom-full left-1/2 transform -translate-x-1/2">{{ Math.round(item.percentage) }}%</div>
                                        </div>
                                    </div>
                                    <div class="histogram-digit text-xs font-bold text-white mt-2">{{ item.digit }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Últimos 100 Dígitos -->
                        <div class="frequency-chart-container flex flex-col items-center">
                            <h4 class="frequency-chart-subtitle text-xs font-normal text-white/40 mb-6 tracking-wider">Últimos 100 Dígitos</h4>
                            <div class="histogram-container flex items-end w-full max-w-[280px]">
                                <div v-for="item in frequencies100" :key="'freq100-'+item.digit" class="histogram-column flex flex-col items-center flex-1">
                                    <div class="histogram-bar-wrapper w-full h-[120px] flex items-end justify-center">
                                        <div 
                                            class="histogram-bar w-full transition-all duration-700 ease-out relative" 
                                            :class="getHistogramBarClass(item.digit, item.percentage, frequencies100)"
                                            :style="{ height: (item.percentage > 0 ? Math.max(4, Math.min((item.percentage * 4), 130)) : 0) + 'px', maxHeight: '130px', minHeight: item.percentage > 0 ? '4px' : '0px' }"
                                        >
                                            <div class="histogram-percentage text-[10px] font-bold text-white absolute bottom-full left-1/2 transform -translate-x-1/2">{{ Math.round(item.percentage) }}%</div>
                                        </div>
                                    </div>
                                    <div class="histogram-digit text-xs font-bold text-white mt-2">{{ item.digit }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar Panel (Trading) -->
            <div class="max-w-[400px] w-[400px] flex-shrink-0 bg-[#0D0D0D] border border-white/5 p-8 overflow-y-auto sidebar-panel rounded-xl trading-panel">
                <div class="pb-8 mb-8 border-b border-white/5">
                    <h2 class="text-xl font-black text-white text-left leading-tight tracking-wide">
                        Painel de Negociação Manual
                    </h2>
                </div>
                
                <div class="trading-panel-content space-y-6 px-1">
                    <!-- Mercado -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Mercado</label>
                        <button 
                            @click="openMarketModal"

                            class="w-full bg-[#080808] border border-white/10 hover:border-zenix-green/50 rounded-xl px-5 py-4 text-sm text-white flex items-center justify-between transition-all font-medium group"
                        >
                            <span class="truncate">{{ selectedMarketLabel }}</span>
                            <i class="fas fa-chevron-right text-[10px] text-white/20 group-hover:text-zenix-green transition-colors"></i>
                        </button>
                    </div>
                    
                    <!-- Tipo de Negociação -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Tipo de Negociação</label>
                        <button 
                            @click="openTradeTypeModal"
                            class="w-full bg-[#080808] border border-white/10 hover:border-zenix-green/50 rounded-xl px-5 py-4 text-sm text-white flex items-center justify-between transition-all font-medium group"
                        >
                            <span class="truncate">{{ selectedTradeTypeLabel }}</span>
                            <i class="fas fa-chevron-right text-[10px] text-white/20 group-hover:text-zenix-green transition-colors"></i>
                        </button>
                    </div>

                    <!-- Previsão (Dígito) -->
                    <div v-if="needsDigitBarrier">
                        <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Previsão (Dígito)</label>
                        <select v-model="digitBarrier" @change="subscribeToProposal" class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-medium appearance-none cursor-pointer">
                            <option v-for="d in 10" :key="d-1" :value="(d-1).toString()">{{ d-1 }}</option>
                        </select>
                    </div>
                    
                    <!-- Duração -->
                    <div>
                        <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Duração (Ticks)</label>
                        <input 
                            type="number" 
                            v-model.number="duration"
                            min="1"
                            max="10"
                            class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
                        />
                    </div>
                    
                    <!-- Valor de Entrada -->
                    <div>
                        <label class="block text-xs font-bold text-white mb-2 ml-1 uppercase tracking-wider opacity-80">Valor de Entrada</label>
                        <input 
                            type="number" 
                            step="0.01"
                            v-model.number="orderValue"
                            class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
                            @input="subscribeToProposal"
                        />
                    </div>

                    <!-- Preço de Compra e P&L -->
                    <div class="space-y-3">
                        <div v-if="currentProposalPrice" class="bg-[#080808] border border-white/5 rounded-xl p-4">
                            <div class="text-xs font-bold text-white/40 mb-1 uppercase tracking-wider">Preço de Compra</div>
                            <div class="text-lg font-black text-white">{{ displayCurrency }} {{ currentProposalPrice.toFixed(2) }}</div>
                        </div>

                        <div v-if="realTimeProfit !== null && activeContract" class="bg-[#080808] border border-white/5 rounded-xl p-4">
                            <div class="text-xs font-bold text-white/40 mb-1 uppercase tracking-wider">P&L em Tempo Real</div>
                            <div class="text-lg font-black" :class="realTimeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                {{ displayCurrency }} {{ realTimeProfit >= 0 ? '+' : '' }}{{ realTimeProfit.toFixed(2) }}
                            </div>
                        </div>
                    </div>

                    <!-- Botões de Ação Dinâmicos -->
                    <div class="grid grid-cols-1 gap-4 pt-2">
                        <button 
                            v-for="dir in availableDirections"
                            :key="dir.value"
                            @click="setDirectionAndBuy(dir.value)" 
                            :disabled="isTrading || activeContract || (digitType === dir.value && !currentProposalId) || (digitType !== dir.value && isLoadingProposal)"
                            :class="[
                                dir.value.includes('DIFF') || dir.value.includes('PUT') || dir.value.includes('ODD') || dir.value.includes('UNDER') 
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white' 
                                    : 'bg-zenix-green hover:bg-zenix-green/90 shadow-zenix-green/20 text-black',
                                { 'opacity-30 cursor-not-allowed': isTrading || activeContract || (digitType !== dir.value && isLoadingProposal) }
                            ]"
                            class="flex-1 font-black py-4 rounded-xl transition-all duration-300 shadow-lg uppercase tracking-widest text-sm"
                        >
                            {{ dir.label }}
                        </button>
                    </div>

                    <div v-if="tradeMessage || tradeError" class="mt-4">
                        <p v-if="tradeMessage" class="text-xs font-bold text-zenix-green text-center uppercase tracking-wider">{{ tradeMessage }}</p>
                        <p v-if="tradeError" class="text-xs font-bold text-red-500 text-center uppercase tracking-wider">{{ tradeError }}</p>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="main-content-grid">
                <div class="cards-grid">
                    <!-- Linha 1: Heatmap + DVX -->
                    <div class="heatmap-card">
                    <div class="card-header-with-help">
                        <h3 class="card-header">Heatmap Estatístico (0-9)</h3>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">🔵 Como Analisar?</div>
                                <div class="tooltip-text">
                                    Cada barra mostra quantas vezes aquele dígito apareceu. Verde escuro = apareceu pouco (subaquecido), Vermelho = apareceu muito (sobreaquecido). Dígitos subaquecidos têm maior probabilidade de aparecer em breve (reversão à média).<br><br>
                                    <strong>Exemplo:</strong> Se o dígito 7 está vermelho (4%), ele está "devendo" aparecer. Considere estratégia MATCHES 7.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="heatmap-grid">
                        <div 
                            v-for="item in digitFrequenciesWithStats" 
                            :key="'heat-'+item.digit" 
                            class="heatmap-digit-block"
                            :class="[item.statusClass, item.isHighlighted ? 'heatmap-highlighted' : '']"
                        >
                            <div class="frequency-percentage-label">{{ item.percentage }}%</div>
                            <div 
                                class="frequency-pill-visual" 
                                :class="item.statusClass"
                            >
                                <span class="frequency-digit-number">{{ item.digit }}</span>
                            </div>
                            <div class="frequency-status-label" :class="item.statusClass + '-text'">{{ item.statusText }}</div>
                            <div class="frequency-z-score desktop-only">Z: {{ item.zScore }}</div>
                        </div>
                    </div>
                    <div class="heatmap-legend">
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-green"></div>
                            <span>Baixo</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-yellow"></div>
                            <span>Médio</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-orange"></div>
                            <span>Alto</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-red"></div>
                            <span>Crítico</span>
                        </div>
                    </div>
                    </div>

                    <!-- Linha 1: Heatmap + DVX (continuação) -->
                    <div class="dvx-card">
                    <div class="card-header-with-help">
                        <div>
                            <h3 class="card-header">Índice de Volatilidade (DVX)</h3>
                            <p class="card-subtitle">Mede a variabilidade dos dígitos</p>
                        </div>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">🔵 Como Analisar?</div>
                                <div class="tooltip-text">
                                    O DVX mede o quão "espalhados" estão os dígitos. Verde (0-30) = baixa volatilidade, ambiente ideal para operar. Amarelo (30-60) = moderado, cautela. Vermelho (60-100) = alta volatilidade, ambiente arriscado - reduza apostas ou não opere.<br><br>
                                    <strong>Exemplo:</strong> DVX em 85 (vermelho) = mercado errático, padrões não confiáveis. Aguarde o ponteiro voltar para zona verde/amarela.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dvx-gauge-container">
                        <svg width="240" height="120" class="dvx-gauge-svg">
                            <path d="M 30 110 A 90 90 0 0 1 72 35" stroke="#22C55E" stroke-width="16" fill="none" opacity="0.4"></path>
                            <path d="M 72 35 A 90 90 0 0 1 168 35" stroke="#FFD058" stroke-width="16" fill="none" opacity="0.4"></path>
                            <path d="M 168 35 A 90 90 0 0 1 210 110" stroke="#FF4747" stroke-width="16" fill="none" opacity="0.4"></path>
                            <line 
                                x1="120" 
                                y1="110" 
                                :x2="dvxGaugeX2" 
                                :y2="dvxGaugeY2" 
                                stroke="#DFDFDF" 
                                stroke-width="3" 
                                stroke-linecap="round"
                            ></line>
                            <circle cx="120" cy="110" r="6" fill="#DFDFDF"></circle>
                        </svg>
                        <div class="dvx-value-container">
                            <div class="dvx-value">{{ dvxValue }}</div>
                            <div class="dvx-status" :class="dvxStatusClass">{{ dvxStatusText }}</div>
                            <div class="dvx-subtitle">Ambiente {{ dvxEnvironmentText }}</div>
                        </div>
                    </div>
                    <div class="dvx-legend">
                        <div class="dvx-legend-item">
                            <div class="dvx-legend-bar dvx-legend-green"></div>
                            <span>0–30 | Baixa</span>
                        </div>
                        <div class="dvx-legend-item">
                            <div class="dvx-legend-bar dvx-legend-yellow"></div>
                            <span>30–60 | Moderada</span>
                        </div>
                        <div class="dvx-legend-item">
                            <div class="dvx-legend-bar dvx-legend-red"></div>
                            <span>60–100 | Alta</span>
                        </div>
                    </div>
                </div>

                <!-- Linha 2: Paridade + Distribuição Alto/Baixo -->
                <div class="parity-meter-card">
                    <div class="card-header-with-help">
                        <div>
                            <h3 class="card-header">Medidor de Paridade</h3>
                            <p class="card-subtitle">Distribuição Par vs Ímpar (esperado: 50/50)</p>
                        </div>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">🔵 Como Analisar?</div>
                                <div class="tooltip-text">
                                    Mostra a distribuição de dígitos pares (0,2,4,6,8) vs ímpares (1,3,5,7,9). O esperado é 50/50. Se houver desequilíbrio (>55% para um lado), o próximo tick tende a reverter para o lado oposto.<br><br>
                                    <strong>Exemplo:</strong> Se Pares está em 62%, há excesso de pares. Próxima operação: aposte em ÍMPAR (ODD) na plataforma Deriv.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="parity-meter-content">
                        <div class="parity-meter-item">
                            <div class="parity-meter-header">
                                <span>Par (0,2,4,6,8)</span>
                                <span class="parity-meter-percentage text-blue">{{ digitFrequency.parity.even }}%</span>
                            </div>
                            <div class="parity-meter-bar-container">
                                <div class="parity-meter-bar parity-meter-bar-blue" :style="{ width: digitFrequency.parity.even + '%' }"></div>
                                <div class="parity-meter-value">{{ evenCount }}</div>
                            </div>
                        </div>
                        <div class="parity-meter-item">
                            <div class="parity-meter-header">
                                <span>Ímpar (1,3,5,7,9)</span>
                                <span class="parity-meter-percentage text-orange">{{ digitFrequency.parity.odd }}%</span>
                            </div>
                            <div class="parity-meter-bar-container">
                                <div class="parity-meter-bar parity-meter-bar-orange" :style="{ width: digitFrequency.parity.odd + '%' }"></div>
                                <div class="parity-meter-value">{{ oddCount }}</div>
                            </div>
                        </div>
                        <div class="parity-meter-recommendation">
                            <i class="fas fa-check text-green"></i>
                            <span>{{ parityRecommendationText }}</span>
                        </div>
                    </div>
                </div>

                <!-- Distribuição Alto/Baixo -->
                <div class="high-low-card">
                    <div class="card-header-with-help">
                        <div>
                            <h3 class="card-header">Distribuição Alto/Baixo</h3>
                            <p class="card-subtitle">Baixos (0–4) vs Altos (5–9) — esperado: 50/50</p>
                        </div>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">🔵 Como Analisar?</div>
                                <div class="tooltip-text">
                                    Divide os dígitos em Baixos (0-4) e Altos (5-9). O esperado é 50/50. Desequilíbrio indica que o próximo tick terá maior probabilidade de ser do lado oposto.<br><br>
                                    <strong>Exemplo:</strong> Se Baixos está em 58%, muitos dígitos 0-4 saíram. Próxima operação: escolha OVER 4 (apostar que o próximo será 5-9).
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="high-low-content">
                        <div class="high-low-item">
                            <div class="high-low-header">
                                <span>Baixos (0–4)</span>
                                <span class="high-low-percentage text-green">{{ lowPercentage }}%</span>
                            </div>
                            <div class="high-low-bar-container">
                                <div class="high-low-bar high-low-bar-green" :style="{ width: lowPercentage + '%' }"></div>
                                <div class="high-low-value">{{ lowCount }}</div>
                            </div>
                        </div>
                        <div class="high-low-item">
                            <div class="high-low-header">
                                <span>Altos (5–9)</span>
                                <span class="high-low-percentage text-purple">{{ highPercentage }}%</span>
                            </div>
                            <div class="high-low-bar-container">
                                <div class="high-low-bar high-low-bar-purple" :style="{ width: highPercentage + '%' }"></div>
                                <div class="high-low-value">{{ highCount }}</div>
                            </div>
                        </div>
                        <div class="high-low-recommendation">
                            <i class="fas fa-arrow-right text-green"></i>
                            <span>{{ highLowRecommendationText }}</span>
                        </div>
                    </div>
                </div>
                </div>

                <!-- Signal Generator Card -->
                <div class="signal-generator-wrapper-digits bg-[#0D0D0D] border border-white/5 p-8 rounded-2xl shadow-xl">
                    <div class="signal-generator-header flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 rounded-full border border-zenix-green bg-zenix-green/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                <i class="fas fa-bolt text-zenix-green text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white tracking-tight text-left">Gerador de Sinais (Dígitos)</h3>
                                <p class="text-sm text-white/40 font-medium text-left">Análise inteligente de frequências</p>
                            </div>
                        </div>
                        <button 
                            @click="toggleAnalysis"
                            :disabled="!symbol"
                            class="btn-gerar-sinal-header bg-zenix-green hover:bg-zenix-green/90 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-zenix-green/20 uppercase tracking-widest text-xs flex items-center gap-2"
                        >
                            <i :class="aiRecommendation ? 'fas fa-pencil-alt' : (isAnalyzing ? 'fas fa-stop' : 'fas fa-pencil-alt')"></i>
                            <span>{{ aiRecommendation ? 'Gerar Novamente' : (isAnalyzing ? 'Parar' : 'Gerar Sinal') }}</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="metric-signal-card bg-[#080808] border border-white/5 p-4 rounded-xl">
                            <div class="flex items-center gap-2 mb-3">
                                <i class="fas fa-clock text-white/40 text-xs"></i>
                                <span class="text-xs font-bold text-white/40 uppercase tracking-wider">Estado de Análise</span>
                            </div>
                            <div class="metric-body">
                                <span v-if="isAnalyzing" class="text-sm text-zenix-green animate-pulse font-bold uppercase tracking-wider">Analisando Mercado...</span>
                                <span v-else-if="aiRecommendation" class="text-sm text-zenix-green font-bold uppercase tracking-wider">Sinal Gerado</span>
                                <span v-else class="text-sm text-white/20 font-bold uppercase tracking-wider">Aguardando geração...</span>
                            </div>
                        </div>

                        <div class="metric-signal-card bg-[#080808] border border-white/5 p-4 rounded-xl">
                            <div class="flex items-center gap-2 mb-3">
                                <i class="fas fa-question-circle text-white/40 text-xs"></i>
                                <span class="text-xs font-bold text-white/40 uppercase tracking-wider">Estratégia Recomendada</span>
                            </div>
                            <div class="metric-body">
                                <div v-if="aiRecommendation" class="flex items-center gap-2">
                                    <i class="fas fa-bullseye text-zenix-green"></i>
                                    <span class="text-sm font-black text-white uppercase tracking-wider">
                                        {{ aiRecommendation.action }}
                                    </span>
                                </div>
                                <span v-else class="text-sm text-white/20 font-bold uppercase tracking-wider">Nenhum sinal gerado</span>
                            </div>
                        </div>

                        <div class="metric-signal-card bg-[#080808] border border-white/5 p-4 rounded-xl">
                            <div class="flex items-center gap-2 mb-3">
                                <i class="fas fa-chart-bar text-white/40 text-xs"></i>
                                <span class="text-xs font-bold text-white/40 uppercase tracking-wider">Confiança</span>
                            </div>
                            <div class="metric-body text-left">
                                <span v-if="aiRecommendation" class="text-xl font-black text-zenix-green">
                                    {{ aiRecommendation.confidence }}%
                                </span>
                                <span v-else class="text-sm text-white/20 font-bold uppercase tracking-wider">-</span>
                            </div>
                        </div>

                        <div class="metric-signal-card bg-[#080808] border border-white/5 p-4 rounded-xl">
                            <div class="flex items-center gap-2 mb-3">
                                <i class="fas fa-bolt text-white/40 text-xs"></i>
                                <span class="text-xs font-bold text-white/40 uppercase tracking-wider">Tempo</span>
                            </div>
                            <div class="metric-body text-left">
                                <span v-if="aiRecommendation && aiRecommendation.time" class="text-xl font-black text-zenix-green">
                                    {{ aiRecommendation.time }}
                                </span>
                                <span v-else class="text-sm text-white/20 font-bold uppercase tracking-wider">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resultado da Operação -->
            <div v-if="showResultNotification" class="result-notification-overlay" @click="closeResultNotification">
                <div class="result-notification" :class="resultNotificationClass" @click.stop>
                    <div class="result-header">
                        <h3>{{ resultNotificationTitle }}</h3>
                        <button @click="closeResultNotification" class="close-btn">✕</button>
                    </div>
                    <div class="result-body">
                        <div class="result-icon">{{ resultNotificationIcon }}</div>
                        <div class="result-profit">
                            {{ lastTradeResult.profit >= 0 ? '+' : '' }}{{ displayCurrency }} {{ (lastTradeResult.profit || 0).toFixed(2) }}
                        </div>
                        <div class="result-details">
                            <div class="result-detail-item">
                                <span>Tipo:</span>
                                <span>{{ getDigitTypeLabel(lastTradeResult.direction) }} {{ lastTradeResult.barrier ? `(${lastTradeResult.barrier})` : '' }}</span>
                            </div>
                            <div class="result-detail-item">
                                <span>Investimento:</span>
                                <span>{{ displayCurrency }} {{ (lastTradeResult.buyPrice || 0).toFixed(2) }}</span>
                            </div>
                            <div class="result-detail-item">
                                <span>Retorno:</span>
                                <span>{{ displayCurrency }} {{ (lastTradeResult.sellPrice || 0).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                            <div v-for="category in digitTradeTypeCategories" :key="category.id" class="category-card">
                                <div class="category-card-header">
                                    <div class="category-icon-wrapper">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 9H20" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4 15H20" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M10 3L8 21" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 3L14 21" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
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
const APP_ID = process.env.VUE_APP_DERIV_APP_ID || '1089';

export default {
    name: 'OperationDigits',
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
            showMarketModal: false,
            showTradeTypeModal: false,
            selectedTradeTypeGroup: 'digits_match_diff',
            digitTradeTypeCategories: [
                {
                    id: 'digits',
                    label: 'Dígitos',
                    icon: 'fas fa-hashtag',
                    items: [
                        { value: 'digits_match_diff', label: 'Combina / Difere', directions: [
                                { value: 'DIGITMATCH', label: 'Combina' },
                                { value: 'DIGITDIFF', label: 'Difere' }
                            ]
                        },
                        { value: 'digits_even_odd', label: 'Par / Ímpar', directions: [
                                { value: 'DIGITEVEN', label: 'Par' },
                                { value: 'DIGITODD', label: 'Ímpar' }
                            ]
                        },
                        { value: 'digits_over_under', label: 'Superior / Inferior', directions: [
                                { value: 'DIGITOVER', label: 'Superior' },
                                { value: 'DIGITUNDER', label: 'Inferior' }
                            ]
                        }
                    ]
                }
            ],
            ws: null,
            tickSubscriptionId: null,
            token: null,
            appId: null,
            isConnecting: false,
            isAuthorized: false,
            isLoadingSymbol: false,
            isLoadingProposal: false,
            shouldAutoBuy: false,
            connectionError: '',
            tradeMessage: '',
            tradeError: '',
            symbol: 'R_100',
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
            latestTick: null,
            lastUpdate: null,
            digitType: 'DIGITMATCH',
            digitBarrier: '5',
            duration: 5,
            orderValue: 10,
            isTrading: false,
            currentProposal: null,
            proposalSubscriptionId: null,
            contractSubscriptionId: null,
            activeContract: null,
            currentProposalId: null,
            currentProposalPrice: null,
            realTimeProfit: null,
            connectionCurrency: null,
            retryCount: 0,
            retryTimeout: null,
            retryDelay: 3000,
            contractStartTime: null,
            contractDuration: null,
            isDestroying: false,
            digitFrequency: {
                digits: [],
                frequency: {},
                parity: { even: 0, odd: 0 },
            },
            showResultNotification: false,
            lastTradeResult: {
                profit: 0,
                buyPrice: 0,
                sellPrice: 0,
                barrier: null,
            },
            isAnalyzing: false,
            aiRecommendation: null,
            analysisTimer: null,
        }
    },
    computed: {
        selectedMarketLabel() {
            const market = this.markets.find(m => m.value === this.symbol);
            if (!market) {
                for (const cat in this.marketsByCategory) {
                    const m = this.marketsByCategory[cat].find(x => x.value === this.symbol);
                    if (m) return m.label;
                }
            }
            return market ? market.label : 'Volatility 100 Index';
        },
        selectedTradeTypeLabel() {
            for (const cat of this.digitTradeTypeCategories) {
                const item = cat.items.find(i => i.directions.some(d => d.value === this.digitType));
                if (item) {
                    const dir = item.directions.find(d => d.value === this.digitType);
                    return `Dígitos: ${dir ? dir.label : item.label}`;
                }
            }
            return 'Dígitos: Combina';
        },
        availableDirections() {
            for (const cat of this.digitTradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.selectedTradeTypeGroup);
                if (item) return item.directions;
            }
            return [];
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
            let currency = this.preferredCurrency || this.accountCurrency || this.connectionCurrency || 'USD';
            if (currency.toUpperCase() === 'DEMO') {
                currency = 'USD';
            }
            return currency.toUpperCase();
        },
        needsDigitBarrier() {
            return this.digitType !== 'DIGITEVEN' && this.digitType !== 'DIGITODD';
        },
        last20Digits() {
            return this.digitFrequency.digits.slice(-20);
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
                return {
                    digit: index,
                    count,
                    percentage: Math.round(percentage * 10) / 10
                };
            });
        },
        frequencies25() { return this.getFrequenciesForCount(25); },
        frequencies50() { return this.getFrequenciesForCount(50); },
        frequencies100() { return this.getFrequenciesForCount(100); },
        currentRepetition() {
            if (this.digitFrequency.digits.length === 0) {
                return 'Aguardando dados...';
            }
            const counts = new Array(10).fill(0);
            this.digitFrequency.digits.forEach(digit => {
                if (digit >= 0 && digit <= 9) {
                    counts[digit]++;
                }
            });

            let maxCount = 0;
            let maxDigit = -1;

            for (let i = 0; i < counts.length; i++) {
                if (counts[i] > maxCount) {
                    maxCount = counts[i];
                    maxDigit = i;
                }
            }
            
            if (maxDigit !== -1) {
                return `Repetição atual: ${maxCount}x dígito ${maxDigit}`;
            }
            return 'Repetição atual: 0x';
        },
        parityTrendText() {
            const diff = this.digitFrequency.parity.even - this.digitFrequency.parity.odd;
            if (Math.abs(diff) < 5) {
                return 'Tendência: equilibrada';
            }
            return diff > 0 
                ? 'Tendência: favorecendo pares'
                : 'Tendência: favorecendo ímpares';
        },
        parityTrendClass() {
            const diff = this.digitFrequency.parity.even - this.digitFrequency.parity.odd;
            if (Math.abs(diff) < 5) {
                return 'parity-trend-neutral';
            }
            return diff > 0 ? 'parity-trend-green' : 'parity-trend-red';
        },
        contractTimeRemaining() {
            if (!this.activeContract || !this.contractStartTime || !this.contractDuration) {
                return '--:--';
            }
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - this.contractStartTime;
            const remaining = Math.max(0, this.contractDuration - elapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        contractProgress() {
            if (!this.activeContract || !this.contractStartTime || !this.contractDuration) {
                return 0;
            }
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - this.contractStartTime;
            return Math.min(100, (elapsed / this.contractDuration) * 100);
        },
        balanceChange() {
            // Calcular mudança de saldo baseado em operações recentes
            return null; // Implementar se necessário
        },
        resultNotificationTitle() {
            if (!this.lastTradeResult || this.lastTradeResult.profit === undefined) {
                return 'Resultado da Operação';
            }
            return this.lastTradeResult.profit >= 0 ? '🎉 LUCRO!' : '📉 PERDA';
        },
        resultNotificationIcon() {
            if (!this.lastTradeResult || this.lastTradeResult.profit === undefined) {
                return '📊';
            }
            return this.lastTradeResult.profit >= 0 ? '✅' : '❌';
        },
        resultNotificationClass() {
            if (!this.lastTradeResult || this.lastTradeResult.profit === undefined) {
                return '';
            }
            return this.lastTradeResult.profit >= 0 ? 'result-profit' : 'result-loss';
        },
        // Semáforo
        semaphoreState() {
            if (this.digitFrequency.digits.length < 50) {
                return 'AGUARDAR';
            }
            const dvx = this.dvxValue;
            if (dvx > 60) {
                return 'STOP';
            }
            // Verificar padrões favoráveis
            const frequencies = this.digitFrequenciesWithStats;
            const hasClearPattern = frequencies.some(f => Math.abs(f.zScore) > 1.5);
            if (hasClearPattern && dvx <= 30) {
                return 'GO';
            }
            return 'AGUARDAR';
        },
        semaphoreStateClass() {
            return `semaphore-${this.semaphoreState.toLowerCase()}`;
        },
        semaphoreIcon() {
            const states = {
                'GO': 'fa-check-circle',
                'AGUARDAR': 'fa-clock',
                'STOP': 'fa-exclamation-triangle'
            };
            return states[this.semaphoreState] || 'fa-clock';
        },
        semaphoreTitle() {
            const states = {
                'GO': 'OPERAR',
                'AGUARDAR': 'AGUARDAR',
                'STOP': 'NÃO OPERAR'
            };
            return states[this.semaphoreState] || 'AGUARDAR';
        },
        semaphoreStatus() {
            return this.semaphoreState;
        },
        semaphoreReason() {
            if (this.semaphoreState === 'GO') {
                return 'Condição favorável identificada pelos padrões estatísticos.';
            } else if (this.semaphoreState === 'AGUARDAR') {
                return 'Aguardando mais dados (mínimo 50 ticks).';
            } else {
                return 'Alta volatilidade ou sinais contraditórios detectados.';
            }
        },
        // DVX (Índice de Volatilidade)
        dvxValue() {
            if (this.digitFrequency.digits.length < 20) {
                return 0;
            }
            const frequencies = this.digitFrequencies;
            const expected = 10; // 10% esperado para cada dígito
            let variance = 0;
            frequencies.forEach(f => {
                variance += Math.pow(f.percentage - expected, 2);
            });
            const stdDev = Math.sqrt(variance / 10);
            // Normalizar para 0-100
            return Math.min(100, Math.round((stdDev / 10) * 100));
        },
        dvxStatusClass() {
            if (this.dvxValue <= 30) return 'dvx-status-green';
            if (this.dvxValue <= 60) return 'dvx-status-yellow';
            return 'dvx-status-red';
        },
        dvxStatusText() {
            if (this.dvxValue <= 30) return 'Volatilidade Baixa';
            if (this.dvxValue <= 60) return 'Volatilidade Moderada';
            return 'Volatilidade Alta';
        },
        dvxEnvironmentText() {
            if (this.dvxValue <= 30) return 'estável';
            if (this.dvxValue <= 60) return 'moderado';
            return 'arriscado';
        },
        // Estatísticas de dígitos com Z-score
        digitFrequenciesWithStats() {
            const totalDigits = this.digitFrequency.digits.length;
            if (totalDigits === 0) {
                return Array.from({ length: 10 }, (_, i) => ({
                    digit: i,
                    percentage: 0,
                    zScore: 0,
                    statusClass: 'status-normal',
                    statusText: 'Normal',
                    barHeight: 42,
                    isHighlighted: false
                }));
            }
            
            const expected = totalDigits / 10;
            const frequencies = this.digitFrequencies;
            
            return frequencies.map(item => {
                const count = (item.percentage / 100) * totalDigits;
                const zScore = expected > 0 ? ((count - expected) / Math.sqrt(expected)).toFixed(1) : 0;
                const z = parseFloat(zScore);
                
                let statusClass, statusText, barHeight;
                if (z < -1.5) {
                    statusClass = 'status-underheated';
                    statusText = 'Subaquec.';
                    barHeight = 42;
                } else if (z < -0.5) {
                    statusClass = 'status-normal';
                    statusText = 'Normal';
                    barHeight = 81;
                } else if (z < 1.5) {
                    statusClass = 'status-heated';
                    statusText = z < 0.5 ? 'Lev. aquec.' : 'Aquecido';
                    barHeight = z < 0.5 ? 93 : 106;
                } else {
                    statusClass = 'status-overheated';
                    statusText = 'Sobreaquec.';
                    barHeight = 110;
                }
                
                // Destacar dígito 7 se for subaquecido (exemplo do HTML)
                const isHighlighted = item.digit === 7 && z < -1.5;
                
                return {
                    digit: item.digit,
                    percentage: item.percentage.toFixed(1),
                    zScore: zScore,
                    statusClass,
                    statusText,
                    barHeight,
                    isHighlighted
                };
            });
        },
        // Contadores para paridade
        evenCount() {
            return this.digitFrequency.digits.filter(d => d % 2 === 0).length;
        },
        oddCount() {
            return this.digitFrequency.digits.filter(d => d % 2 === 1).length;
        },
        parityRecommendationText() {
            const diff = Math.abs(this.digitFrequency.parity.even - this.digitFrequency.parity.odd);
            if (diff < 5) {
                return 'Distribuição equilibrada — sem vantagem clara';
            }
            if (this.digitFrequency.parity.even > 55) {
                return 'Próximo tick: maior probabilidade de ÍMPAR (ODD)';
            } else {
                return 'Próximo tick: maior probabilidade de PAR (EVEN)';
            }
        },
        // Contadores para alto/baixo
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
            const diff = Math.abs(this.lowPercentage - this.highPercentage);
            if (diff < 5) {
                return 'Distribuição equilibrada — sem vantagem clara';
            }
            if (this.lowPercentage > 55) {
                return 'Próximo tick: maior probabilidade de ALTO (OVER 4)';
            } else {
                return 'Próximo tick: maior probabilidade de BAIXO (UNDER 5)';
            }
        },
        // DVX Gauge coordinates
        dvxGaugeX2() {
            const angle = (this.dvxValue / 100) * Math.PI - Math.PI / 2;
            return 120 + 70 * Math.cos(angle);
        },
        dvxGaugeY2() {
            const angle = (this.dvxValue / 100) * Math.PI - Math.PI / 2;
            return 110 + 70 * Math.sin(angle);
        },
    },
    methods: {
        getDigitTypeLabel(type) {
            const labels = {
                'DIGITMATCH': 'MATCH',
                'DIGITDIFF': 'DIFFERS',
                'DIGITOVER': 'OVER',
                'DIGITUNDER': 'UNDER',
                'DIGITEVEN': 'EVEN',
                'DIGITODD': 'ODD',
            };
            return labels[type] || type;
        },
        getFrequenciesForCount(count) {
            const digits = this.digitFrequency.digits.slice(-count);
            const total = digits.length;
            const counts = new Array(10).fill(0);
            
            digits.forEach(d => {
                if (d >= 0 && d <= 9) counts[d]++;
            });

            return counts.map((c, i) => ({
                digit: i,
                count: c,
                percentage: total > 0 ? (c / total) * 100 : 0
            }));
        },
        toggleAnalysis() {
            if (this.isAnalyzing) {
                this.stopAnalysis();
            } else {
                this.startAnalysis();
            }
        },
        startAnalysis() {
            if (!this.symbol) return;
            this.isAnalyzing = true;
            this.aiRecommendation = null;
            
            // Primeira chamada imediata
            this.generateSignal();

            // Configurar intervalo
            this.analysisTimer = setInterval(() => {
                this.generateSignal();
            }, 3000); // 3 segundos (compatível com modo veloz)
        },
        stopAnalysis() {
            this.isAnalyzing = false;
            if (this.analysisTimer) {
                clearInterval(this.analysisTimer);
                this.analysisTimer = null;
            }
            this.aiRecommendation = null;
        },
        async generateSignal() {
            if (!this.isAnalyzing) return;

            // Chamar backend para análise real (Veloz)
            try {
                // Recupera userId do localStorage ou de onde estiver armazenado
                // Se não tiver userId, tentar usar 'current' se o backend suportar ou pegar do token
                // Assumindo que o back espera { userId: ... }
                // Vamos tentar pegar o loginid como userId provisório ou decodificar do token se necessário
                // O endpoint /ai/analyze espera { userId: string }
                
                // Melhor abordagem: usar o serviço de API se existisse, mas vamos de fetch direto
                const token = localStorage.getItem('auth_token'); // Ajustar chave se necessário
                const userId = this.accountLoginid || 'current'; 

                const response = await fetch(`${process.env.VUE_APP_API_URL || 'http://localhost:3000'}/ai/analyze`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId })
                });

                if (!response.ok) {
                    throw new Error('Falha na análise da IA');
                }

                const result = await response.json();
                
                if (result.success && result.data) {
                    const diag = result.data;
                    
                    // Mapear resposta do backend para o formato esperado pelo frontend
                    // O backend retorna algo como: 
                    // { sinal: 'PAR', confianca: 85, motivo: '...', detalhes: {...} }
                    
                    if (diag.sinal) {
                        this.aiRecommendation = {
                            // Se o sinal for específico (ex: MATCH 5), ajustar aqui. 
                            // O backend atual (Veloz) retorna PAR/IMPAR normalmente. 
                            // Vamos exibir o sinal cru formatado
                            action: `APOSTAR ${diag.sinal}`, 
                            confidence: Math.round(diag.confianca)
                        };
                    } else {
                        // Sem sinal forte
                        this.aiRecommendation = null;
                    }
                }
            } catch (error) {
                console.error('[OperationDigits] Erro ao gerar sinal:', error);
                // Não exibir erro na UI para não poluir, apenas logar
            }
        },
        getHistogramBarClass(digit, percentage, frequencies) {
            if (!frequencies || frequencies.length === 0) return '';
            
            // Encontrar max e min baseados na porcentagem
            let max = -1;
            let min = 101;
            
            frequencies.forEach(f => {
                if (f.percentage > max) max = f.percentage;
                if (f.percentage < min) min = f.percentage;
            });

            if (percentage === max && max > min) return 'bar-rank-highest';
            if (percentage === min && min < max) return 'bar-rank-lowest';
            return 'bar-rank-normal';
        },
        getFrequencyClass(digit, percentage) {
            if (percentage > 15) return 'status-green';
            if (percentage > 10) return 'status-yellow';
            return '';
        },
        closeResultNotification() {
            this.showResultNotification = false;
        },
        initConnection() {
            console.log('[OperationDigits] initConnection - Iniciando conexão WebSocket');
            
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
            
            if (this.ws) {
                this.teardownConnection();
            }

            this.ticks = [];
            this.latestTick = null;
            this.isLoadingSymbol = true;
            // Verificações de conexão Deriv
            this.connectionError = '';
            this.isConnecting = true;
            
            this.token = this.getTokenForAccount();
            this.appId = localStorage.getItem('deriv_app_id') || APP_ID;

            // Verificação de acesso - requer token Deriv
            if (!this.token) {
                console.error('[OperationDigits] ERRO: Nenhum token Deriv encontrado');
                this.isConnecting = false;
                localStorage.removeItem('deriv_connection');
                localStorage.removeItem('deriv_token');
                localStorage.removeItem('deriv_tokens_by_loginid');
                this.$router.push('/dashboard');
                return;
            }

            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                setTimeout(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.send({ authorize: this.token });
                    } else {
                        this.connectionError = 'Erro ao autorizar conexão. Reconectando automaticamente...';
                        this.scheduleRetry();
                    }
                }, 50);
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    this.handleMessage(msg);
                } catch (error) {
                    console.error('[OperationDigits] ERRO ao interpretar mensagem:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[OperationDigits] Erro no WebSocket:', error);
                this.connectionError = 'Erro na conexão com a Deriv. Reconectando automaticamente...';
                this.isConnecting = false;
                this.isAuthorized = false;
                this.scheduleRetry();
            };

            this.ws.onclose = () => {
                if (!this.isConnecting) {
                    this.connectionError = 'Conexão com a Deriv encerrada. Reconectando automaticamente...';
                    this.scheduleRetry();
                }
                this.isConnecting = false;
                this.isAuthorized = false;
                this.ws = null;
            };
        },
        scheduleRetry() {
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
            }
            
            this.retryCount++;
            const delay = Math.min(this.retryDelay * Math.pow(1.5, this.retryCount - 1), 30000);
            
            this.retryTimeout = setTimeout(() => {
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
                    this.processAuthorize(msg);
                    break;
                case 'history':
                    this.processHistory(msg);
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
                case 'proposal_open_contract':
                    this.processProposalOpenContract(msg);
                    break;
            }
        },
        processAuthorize(msg) {
            console.log('[OperationDigits] ✓ Autorização recebida');
            const authorizeData = msg.authorize || {};
            this.isAuthorized = true;
            this.isConnecting = false;
            this.connectionError = '';
            this.retryCount = 0;
            this.connectionCurrency = authorizeData.currency?.toUpperCase() || this.accountCurrency;
            this.subscribeToSymbol();
            setTimeout(() => {
                this.subscribeToProposal();
            }, 500);
        },
        openMarketModal() {
            console.log('[OperationDigits] openMarketModal chamado, showMarketModal:', this.showMarketModal);
            this.showMarketModal = true;
            console.log('[OperationDigits] showMarketModal após set:', this.showMarketModal);
        },
        closeMarketModal() {
            this.showMarketModal = false;
        },
        selectMarket(symbol) {
            this.symbol = symbol;
            this.handleSymbolChange();
            this.closeMarketModal();
        },
        openTradeTypeModal() {
            this.showTradeTypeModal = true;
        },
        closeTradeTypeModal() {
            this.showTradeTypeModal = false;
        },
        selectTradeType(item) {
            this.selectedTradeTypeGroup = item.value;
            if (item.directions && item.directions.length > 0) {
                // Seleciona a primeira direção como padrão (ex: DIGITMATCH)
                this.digitType = item.directions[0].value;
                this.onDigitTypeChange();
            }
            this.closeTradeTypeModal();
        },
        setDirectionAndBuy(dirValue) {
            if (this.isTrading || this.activeContract) return;

            if (this.digitType === dirValue && this.currentProposalId) {
                this.executeBuy();
            } else {
                this.digitType = dirValue;
                this.isLoadingProposal = true;
                this.shouldAutoBuy = true;
                this.subscribeToProposal();
            }
        },
        handleDerivError(error) {
            const message = error?.message || 'Erro desconhecido na Deriv';
            if (this.isTrading) {
                this.tradeError = message;
                this.tradeMessage = '';
                this.isTrading = false;
            } else {
                this.connectionError = `${message}. Reconectando automaticamente...`;
                this.isAuthorized = false;
                this.scheduleRetry();
            }
        },
        subscribeToSymbol() {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }

            this.isLoadingSymbol = true;
            this.ticks = [];
            this.latestTick = null;

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
            if (!history || !history.prices) {
                return;
            }
            
            const prices = history.prices.map(price => Number(price));
            const times = history.times?.map(time => Number(time)) || [];
            this.ticks = prices.map((value, index) => ({ value, epoch: times[index] || index }));
            
            if (msg.subscription?.id) {
                this.tickSubscriptionId = msg.subscription.id;
            }
            
            this.isLoadingSymbol = false;
            this.calculateDigitFrequency();
        },
        processTick(msg) {
            const tick = msg.tick;
            if (!tick) {
                return;
            }
            
            if (tick.id && !this.tickSubscriptionId) {
                this.tickSubscriptionId = tick.id;
            }
            
            const value = Number(tick.quote);
            if (isNaN(value)) {
                return;
            }
            
            this.latestTick = { value, epoch: tick.epoch };
            this.lastUpdate = Date.now();
            this.ticks.push({ value, epoch: tick.epoch });
            
            if (this.ticks.length > 1000) {
                this.ticks.shift();
            }
            
            // Coletar os últimos 10 ticks e printar no console
            const last10Ticks = this.ticks.slice(-10);
            console.log('[OperationDigits] Últimos 10 ticks:', last10Ticks);
            
            this.calculateDigitFrequency();
        },
        calculateDigitFrequency() {
            const last20Ticks = this.ticks.slice(-20);
            const digits = [];
            const frequency = {};
            
            for (let i = 0; i <= 9; i++) {
                frequency[i] = 0;
            }
            
            last20Ticks.forEach(tick => {
                const value = Math.floor(tick.value);
                const lastDigit = value % 10;
                digits.push(lastDigit);
                frequency[lastDigit] = (frequency[lastDigit] || 0) + 1;
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
        handleSymbolChange() {
            this.subscribeToSymbol();
            this.subscribeToProposal();
        },
        onDigitTypeChange() {
            this.subscribeToProposal();
        },
        subscribeToProposal() {
            this.unsubscribeFromProposal();
            
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            if (this.activeContract) {
                return;
            }
            
            const payload = {
                proposal: 1,
                amount: Number(this.orderValue),
                basis: 'stake',
                contract_type: this.digitType,
                currency: this.displayCurrency,
                duration: Math.max(1, Number(this.duration)),
                duration_unit: 't',
                symbol: this.symbol,
                subscribe: 1,
            };
            
            if (this.needsDigitBarrier) {
                payload.barrier = this.digitBarrier;
            }
            
            console.log('[OperationDigits] Subscribing to proposal:', JSON.stringify(payload, null, 2));
            this.isLoadingProposal = true;
            this.send(payload);
        },
        unsubscribeFromProposal() {
            if (this.proposalSubscriptionId && this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ forget: this.proposalSubscriptionId });
                this.proposalSubscriptionId = null;
            }
            this.currentProposalId = null;
            this.currentProposalPrice = null;
        },
        processProposal(msg) {
            const proposal = msg.proposal;
            if (!proposal) {
                this.tradeError = 'Proposta inválida retornada pela Deriv.';
                this.currentProposalId = null;
                this.currentProposalPrice = null;
                return;
            }
            
            this.currentProposalId = proposal.id;
            this.currentProposalPrice = Number(proposal.ask_price);
            this.isLoadingProposal = false;
            
            if (this.shouldAutoBuy && this.currentProposalId) {
                this.shouldAutoBuy = false;
                this.executeBuy();
            }
            
            if (msg.subscription?.id) {
                this.proposalSubscriptionId = msg.subscription.id;
            }
        },
        executeBuy() {
            if (!this.currentProposalId || !this.currentProposalPrice) {
                this.tradeError = 'Aguarde a proposta ser carregada.';
                return;
            }
            
            if (this.isTrading) {
                return;
            }
            
            this.tradeError = '';
            this.tradeMessage = '';
            this.isTrading = true;
            
            const buyPayload = {
                buy: this.currentProposalId,
                price: this.currentProposalPrice,
            };
            
            console.log('[OperationDigits] Executando compra:', JSON.stringify(buyPayload, null, 2));
            this.send(buyPayload);
        },
        processBuy(msg) {
            const buy = msg.buy;
            if (!buy) {
                this.tradeError = 'A Deriv não confirmou a compra.';
                this.isTrading = false;
                return;
            }

            console.log('[OperationDigits] ✓ Compra executada com sucesso!');
            
            this.unsubscribeFromProposal();
            
            this.activeContract = {
                contract_id: buy.contract_id,
                symbol: this.symbol,
                type: this.digitType,
                entry_spot: Number(buy.entry_spot || buy.spot || this.latestTick?.value || 0),
                purchase_time: buy.purchase_time,
                buy_price: Number(buy.buy_price),
                currency: this.displayCurrency,
                digitBarrier: this.needsDigitBarrier ? this.digitBarrier : null,
            };
            
            this.contractStartTime = buy.purchase_time || Math.floor(Date.now() / 1000);
            this.contractDuration = Number(this.duration);
            
            this.subscribeToContract(buy.contract_id);
            
            this.tradeMessage = 'Compra executada com sucesso. Monitorando contrato...';
            this.tradeError = '';
            this.isTrading = false;
            
            this.$emit('trade-result', {
                contractId: buy.contract_id,
                buyPrice: Number(buy.buy_price),
                balanceAfter: buy.balance_after != null ? Number(buy.balance_after) : null,
                purchaseTime: buy.purchase_time,
                currency: this.displayCurrency,
                direction: this.digitType,
                status: 'EXECUTED',
            });
        },
        subscribeToContract(contractId) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            const payload = {
                proposal_open_contract: 1,
                contract_id: contractId,
                subscribe: 1,
            };
            
            this.send(payload);
        },
        unsubscribeFromContract() {
            if (this.contractSubscriptionId && this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ forget: this.contractSubscriptionId });
                this.contractSubscriptionId = null;
            }
        },
        processProposalOpenContract(msg) {
            const contract = msg.proposal_open_contract;
            if (!contract) {
                console.log('[OperationDigits] ⚠ Contrato vazio em proposal_open_contract');
                return;
            }
            
            console.log('[OperationDigits] 📊 Atualização de contrato recebida:', {
                is_sold: contract.is_sold,
                profit: contract.profit,
                status: contract.status
            });
            
            if (msg.subscription?.id) {
                this.contractSubscriptionId = msg.subscription.id;
            }
            
            if (contract.profit !== undefined && contract.profit !== null) {
                this.realTimeProfit = Number(contract.profit);
                console.log('[OperationDigits] P&L atualizado:', this.realTimeProfit);
            }
            
            if (contract.is_sold === 1) {
                console.log('[OperationDigits] ✅ Contrato vendido, finalizando...');
                setTimeout(() => {
                    this.finalizeContract(contract);
                }, 100);
            } else {
                console.log('[OperationDigits] ⏳ Contrato ainda ativo (is_sold =', contract.is_sold, ')');
            }
        },
        finalizeContract(contract) {
            console.log('[OperationDigits] ========== FINALIZANDO CONTRATO ==========');
            console.log('[OperationDigits] Dados do contrato:', contract);
            
            this.unsubscribeFromContract();
            
            let finalProfit = 0;
            if (contract.profit !== undefined && contract.profit !== null) {
                finalProfit = Number(contract.profit);
            } else if (this.realTimeProfit !== null && this.realTimeProfit !== undefined) {
                finalProfit = Number(this.realTimeProfit);
            }
            
            // Armazenar resultado para exibição
            this.lastTradeResult = {
                profit: finalProfit,
                buyPrice: this.activeContract?.buy_price || 0,
                sellPrice: contract.sell_price ? Number(contract.sell_price) : 0,
                direction: this.activeContract?.type || '',
                barrier: this.activeContract?.digitBarrier || null,
            };
            
            console.log('[OperationDigits] Resultado armazenado:', this.lastTradeResult);
            
            // Exibir notificação de resultado
            this.showResultNotification = true;
            
            console.log('[OperationDigits] showResultNotification definido como:', this.showResultNotification);
            
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
            
            this.activeContract = null;
            this.realTimeProfit = null;
            this.contractStartTime = null;
            this.contractDuration = null;
            
            setTimeout(() => {
                this.subscribeToProposal();
            }, 500);
        },
        getTokenForAccount() {
            if (this.accountLoginid) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                    const specificToken = tokensByLoginId[this.accountLoginid];
                    if (specificToken) {
                        return specificToken;
                    }
                } catch (error) {
                    console.error('[OperationDigits] Erro ao buscar token:', error);
                }
            }
            
            const defaultToken = localStorage.getItem('deriv_token');
            return defaultToken;
        },
        send(payload) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.error('[OperationDigits] WebSocket não está pronto');
                return;
            }
            
            this.ws.send(JSON.stringify(payload));
        },
        simulateInitialData() {
            console.log('[OperationDigits] Simulando histórico inicial para demonstração');
            const simulatedDigits = [];
            for (let i = 0; i < 100; i++) {
                simulatedDigits.push(Math.floor(Math.random() * 10));
            }
            this.digitFrequency.digits = simulatedDigits;
        },
    },
    mounted() {
        console.log('[OperationDigits] Componente montado');
        if (this.orderConfig && this.orderConfig.value !== undefined) {
            this.orderValue = Number(this.orderConfig.value);
        }
        // Inicialização da conexão Deriv
        this.initConnection();
    },
    beforeUnmount() {
        console.log('[OperationDigits] Componente sendo desmontado');
        this.isDestroying = true;
        
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
        
        this.unsubscribeFromProposal();
        this.unsubscribeFromContract();
        this.teardownConnection();
    },
}
</script>

<style src="../assets/css/components/OperationDigits.css"></style>
<style scoped>
.connection-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 32px;
    min-height: 400px;
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

.input-group {
    margin-bottom: 16px;
}

.input-label {
    display: block;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
}

.select-field, .input-field-value {
    width: 100%;
    padding: 10px 12px;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 6px;
    color: #f8fafc;
    font-size: 0.9rem;
}

.input-row-flex {
    display: flex;
    gap: 12px;
}

.input-group-half {
    flex: 1;
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

.btn-execute-operation {
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    margin-top: 16px;
}

.btn-execute-operation.btn-buy {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.btn-execute-operation.btn-buy:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-execute-operation:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.trade-message {
    margin-top: 12px;
    font-size: 0.85rem;
    padding: 8px;
    border-radius: 6px;
}

.trade-message.success {
    color: #4ade80;
    background: rgba(16, 185, 129, 0.1);
}

.trade-message.error {
    color: #f87171;
    background: rgba(239, 68, 68, 0.1);
}

.parity-bar-purple {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.parity-bar-red {
    height: 100%;
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.parity-trend-neutral {
    color: #94a3b8;
}

.parity-trend-red {
    color: #ef4444;
}

/* Notificação de Resultado */
.result-notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.result-notification {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 16px;
    padding: 0;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.4s ease;
    border: 1px solid rgba(148, 163, 184, 0.2);
}

.result-notification.result-profit {
    border-color: rgba(16, 185, 129, 0.5);
}

.result-notification.result-loss {
    border-color: rgba(239, 68, 68, 0.5);
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.result-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f8fafc;
}

.close-btn {
    background: rgba(148, 163, 184, 0.1);
    border: none;
    color: #94a3b8;
    font-size: 1.5rem;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: rgba(148, 163, 184, 0.2);
    color: #f8fafc;
}

.result-body {
    padding: 32px 24px;
    text-align: center;
}

.result-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    animation: bounce 0.6s ease;
}

.result-profit {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 24px;
}

.result-notification.result-profit .result-profit {
    color: #10b981;
    text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.result-notification.result-loss .result-profit {
    color: #ef4444;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.result-details {
    background: rgba(15, 23, 42, 0.6);
    border-radius: 12px;
    padding: 16px;
    margin-top: 20px;
}

.result-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.result-detail-item:last-child {
    border-bottom: none;
}

.result-detail-item span:first-child {
    color: #94a3b8;
    font-size: 0.9rem;
}

.result-detail-item span:last-child {
    color: #f8fafc;
    font-weight: 600;
    font-size: 0.95rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    60% {
        transform: translateY(-10px);
    }
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
        margin: 0 !important;
        display: flex;
        flex-direction: column;
    }

    /* Mobile layout ordering */
    .frequency-unified-card-wrapper {
        order: 1;
    }

    .main-content-grid {
        order: 2;
    }

    .signal-generator-wrapper-digits {
        order: 3;
    }

    .trading-panel {
        order: 4;
    }

    .top-section {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem !important;
        margin: 0 0 1rem 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    .semaphore-card {
        width: 100% !important;
        max-width: 100% !important;
        padding: 1rem !important;
        margin: 0 0 1rem 0 !important;
        box-sizing: border-box;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        border: 1px solid #1C1C1C !important;
        border-radius: 0.75rem !important;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
    }

    .history-card {
        width: 100% !important;
        max-width: 100% !important;
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

    .main-content-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    .heatmap-card,
    .dvx-card,
    .parity-meter-card,
    .high-low-card {
        width: 100% !important;
        max-width: 100% !important;
        padding: 1rem !important;
        margin: 0 0 1rem 0 !important;
        box-sizing: border-box;
    }

    .heatmap-grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 0.5rem;
        width: 100% !important;
        box-sizing: border-box;
    }

    .digit-history-grid {
        grid-template-columns: repeat(10, 1fr);
        gap: 0.25rem;
        width: 100% !important;
        box-sizing: border-box;
    }

    .input-group {
        margin-bottom: 1rem;
        width: 100% !important;
        box-sizing: border-box;
    }

    .trading-buttons {
        flex-direction: column;
        gap: 0.75rem;
        width: 100% !important;
        box-sizing: border-box;
    }

    .btn-call,
    .btn-put {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0.875rem;
        box-sizing: border-box;
    }

    .result-notification {
        width: 95% !important;
        max-width: 95% !important;
        box-sizing: border-box;
    }

    .result-body {
        padding: 1.5rem 1rem;
        box-sizing: border-box;
    }

    .result-icon {
        font-size: 3rem;
    }

    .result-profit {
        font-size: 2rem;
    }

    /* Standardize all titles */
    .semaphore-title,
    .card-header,
    h3.text-base {
        font-size: 1rem !important;
        text-align: left !important;
        font-weight: 600 !important;
    }

    * {
        box-sizing: border-box;
    }
}

/* Fix connection loading overlay */
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
</style>
