<template>
    <div class="main-container">
        <!-- Tela de carregamento -->
        <div v-if="connectionError || isConnecting" class="connection-loading">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
        </div>
            
        <div class="digits-layout">
            <!-- Seção: Porcentagem de frequência de dígitos -->
            <!-- Seções de Análise unificadas foram movidas para main-content-grid -->

            <!-- Sidebar Panel (Trading) -->
            <div class="max-w-[400px] w-[400px] flex-shrink-0 bg-[#0D0D0D] border border-white/5 p-8 overflow-y-auto sidebar-panel rounded-xl trading-panel">

                
                <div class="trading-panel-content space-y-3 px-1">
                    <!-- Mercado -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Mercado</label>
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
                        <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Tipo de Negociação</label>
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
                        <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Previsão (Dígito)</label>
                        <select v-model="digitBarrier" @change="subscribeToProposal" class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-medium appearance-none cursor-pointer">
                            <option v-for="d in 10" :key="d-1" :value="(d-1).toString()">{{ d-1 }}</option>
                        </select>
                    </div>
                    
                    <!-- Duração -->
                    <div>
                        <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Duração (Ticks)</label>
                        <input 
                            type="number" 
                            v-model.number="duration"
                            min="1"
                            max="10"
                            class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
                        />
                    </div>

                    
                    <!-- Seção de Entrada e Ação -->
                    <div class="space-y-8">
                        <!-- Valor de Entrada -->
                        <div>
                            <label class="block text-xs font-bold text-white mb-1 ml-1 uppercase tracking-wider opacity-80">Valor de Entrada</label>
                            <input 
                                type="number" 
                                step="0.01"
                                v-model.number="orderValue"
                                class="w-full bg-[#080808] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-zenix-green/50 transition-all font-bold"
                                @input="subscribeToProposal"
                            />
                        </div>

                        <!-- Botões de Ação Dinâmicos -->
                        <div class="grid grid-cols-1 gap-2">
                            <button 
                                v-for="dir in availableDirections"
                                :key="dir.value"
                                @click="setDirectionAndBuy(dir.value)" 
                                :disabled="isTrading || activeContract || (digitType === dir.value && !currentProposalId) || (digitType !== dir.value && isLoadingProposal)"
                                :class="[
                                    dir.value.includes('DIFF') || dir.value.includes('PUT') || dir.value.includes('ODD') || dir.value.includes('UNDER') || dir.value.includes('FALL')
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white' 
                                        : 'bg-zenix-green hover:bg-zenix-green/90 shadow-zenix-green/20 text-black',
                                    { 'opacity-30 cursor-not-allowed': isTrading || activeContract || (digitType !== dir.value && isLoadingProposal) }
                                ]"
                                class="flex-1 font-black py-4 rounded-xl transition-all duration-300 shadow-lg uppercase tracking-widest text-sm"
                            >
                                {{ dir.label }}
                            </button>

                        </div>
                    </div>

                    <div v-if="tradeMessage || tradeError" class="mt-2">
                        <p v-if="tradeMessage" class="text-xs font-bold text-zenix-green text-center uppercase tracking-wider">{{ tradeMessage }}</p>
                        <p v-if="tradeError" class="text-xs font-bold text-red-500 text-center uppercase tracking-wider">{{ tradeError }}</p>
                    </div>
                </div>
            </div>

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
                                        :style="{ height: item.percentage + '%', backgroundColor: item.statusClass === 'status-max' ? '#22C55E' : (item.statusClass === 'status-heated' ? '#F59E0B' : (item.statusClass === 'status-min' ? '#EF4444' : 'rgba(255,255,255,0.1)')) }"
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
                                        <span class="text-[9px] font-bold text-white/20 uppercase tracking-wider">Menos Frequentes</span>
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
                            <span class="text-[10px] font-bold text-white/60">Últimos 15</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap md:flex-nowrap gap-2 justify-start">
                        <div 
                            v-for="(digit, index) in recentDigits.slice(0, 15)" 
                            :key="'recent-'+index"
                            class="h-10 w-10 md:h-12 md:w-12 bg-[#080808] border border-white/5 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 flex-shrink-0"
                            :class="[
                                index === 0 ? 'bg-zenix-green/20 text-zenix-green border-zenix-green/50 shadow-[0_0_15px_#22C55E33]' : 'text-white/40'
                            ]"
                        >
                            {{ digit }}
                        </div>
                        <div v-if="recentDigits.length === 0" class="text-white/20 text-xs italic tracking-widest py-2 w-full text-left ml-2">Sincronizando dados...</div>
                    </div>
                </div>

            </div>

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
                                <div class="trade-result-icon-wrapper" :class="finalTradeProfit >= 0 ? 'win' : 'loss'">
                                    <div class="trade-result-icon">
                                        <i :class="finalTradeProfit >= 0 ? 'fas fa-trophy' : 'fas fa-chart-line rotate-180'"></i>
                                    </div>
                                    <div class="trade-result-particles"></div>
                                </div>
                                
                                <!-- Título -->
                                <h4 class="trade-result-status" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                    {{ finalTradeProfit >= 0 ? 'VITÓRIA' : 'DERROTA' }}
                                </h4>
                                
                                <!-- Valor -->
                                <div class="trade-result-main-value" :class="finalTradeProfit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                    <span class="currency-symbol">$</span>
                                    <span class="profit-amount">{{ Math.abs(finalTradeProfit).toFixed(pricePrecision) }}</span>
                                </div>
                                
                                <!-- Detalhes em Grid -->
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
                                
                                <!-- Botão Fechar -->
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
import derivTradingService from '../services/deriv-trading.service.js';

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
            markets: [], // Iniciar vazio e carregar via API
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
            // Trade Result Modal Data
            showTradeResultModal: false,
            finalTradeProfit: 0,
            finalTradeType: 'CALL',
            finalEntrySpot: null,
            finalExitSpot: null,

            
            isAnalyzing: false,
            aiRecommendation: null,
            analysisTimer: null,
            signalCountdown: null,
            signalCountdownInterval: null,
            isSimulated: false,
        }
    },
    computed: {
        finalTradeTypeLabel() {
             return this.getDigitTypeLabel(this.finalTradeType);
        },
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
        currentTradeCurrency() {
            return localStorage.getItem('trade_currency') || (this.accountLoginid?.startsWith('VRT') ? 'DEMO' : 'USD');
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
        // Histórico Recente de Dígitos
        recentDigits() {
            if (!this.digitFrequency || !this.digitFrequency.digits) return [];
            return this.digitFrequency.digits.slice(-15).reverse();
        },
        // Estatísticas de dígitos com Z-score
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
                let statusClass = 'status-normal';

                // Prioridade para Max/Min (apenas o primeiro encontrado)
                if (p === maxP && !maxFound) {
                    isMax = true;
                    maxFound = true;
                    statusClass = 'status-max';
                } else if (p === minP && !minFound) {
                    isMin = true;
                    minFound = true;
                    statusClass = 'status-min';
                } else {
                     // Manter lógica de aquecimento secundário se desejar, ou simplificar
                     if (p >= 5) {
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
            const sorted = [...this.digitFrequenciesWithStats].sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
            return sorted[0];
        },
        leastFrequentDigit() {
            if (!this.digitFrequenciesWithStats || this.digitFrequenciesWithStats.length === 0) return null;
            const sorted = [...this.digitFrequenciesWithStats].sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
            return sorted[0];
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
    },
    methods: {
        getStatusColor(statusClass) {
            const colors = {
                'status-underheated': '#3B82F6', // Blue
                'status-normal': '#64748B',      // Gray/Slate
                'status-heated': '#F59E0B',      // Orange/Amber
                'status-overheated': '#EF4444'   // Red
            };
            return colors[statusClass] || '#22C55E';
        },
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
        async startAnalysis() {
            if (!this.symbol) return;
            
            this.isAnalyzing = true;
            this.aiRecommendation = null;
            this.signalCountdown = null;
            
            // Gerar apenas um sinal manual por clique (Sincronizado com Gráfico)
            await this.generateSignal();
            
            // Feedback visual: mantém "analisando" por 1s se for muito rápido
            setTimeout(() => {
                this.isAnalyzing = false;
            }, 1000);
        },
        executeAIOrder() {
            if (!this.aiRecommendation) return;
            
            // Se a recomendação incluir uma barreira (ex: para Match/Diff/Over/Under), usar ela
            if (this.aiRecommendation.barrier !== undefined && this.aiRecommendation.barrier !== null) {
                this.digitBarrier = String(this.aiRecommendation.barrier);
            }
            
            console.log('[OperationDigits] Executar AI Order:', this.aiRecommendation.action, 'Barrier:', this.digitBarrier);
            this.setDirectionAndBuy(this.aiRecommendation.action);
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
        stopAnalysis() {
            this.isAnalyzing = false;
            if (this.analysisTimer) {
                clearInterval(this.analysisTimer);
                this.analysisTimer = null;
            }
            this.stopSignalCountdown();
            this.aiRecommendation = null;
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
        async generateSignal() {
            if (!this.symbol) return;

            try {
                // Sincronizar formato de ticks com OperationChart (últimos 50 ticks)
                const last50Ticks = this.ticks.slice(-50).map(tick => ({
                    value: Number(tick.value),
                    epoch: Number(tick.epoch)
                }));

                if (last50Ticks.length === 0) {
                    console.warn('[OperationDigits] Nenhum tick disponível para análise do Gemini');
                    return;
                }

                const authToken = localStorage.getItem('token');
                if (!authToken) {
                    throw new Error('Token de autenticação não encontrado');
                }

                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                
                console.log('[OperationDigits] Solicitando recomendação Gemini para', this.symbol);
                
                const response = await fetch(`${apiBaseUrl}/gemini/recommendation`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ticks: last50Ticks,
                        symbol: this.symbol,
                        tradeType: this.digitType,
                        duration: Number(this.duration),
                        durationUnit: 't',
                        amount: Number(this.orderValue),
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro ao obter recomendação Gemini');
                }

                const recommendation = await response.json();
                console.log('[OperationDigits] Recomendação Gemini recebida:', recommendation);

                // Garantir que a estrutura de retorno seja compatível com o template
                let confidenceValue = 50;
                if (recommendation.confidence !== undefined) {
                    confidenceValue = Number(recommendation.confidence);
                }

                this.aiRecommendation = {
                    action: recommendation.action || 'AGUARDAR',
                    confidence: confidenceValue,
                    reason: recommendation.reasoning || recommendation.reason || '',
                    entry_time: recommendation.entry_time || 0,
                    barrier: recommendation.barrier
                };

                // Iniciar contagem regressiva se o Gemini sugerir um tempo de entrada
                if (this.aiRecommendation.entry_time > 0) {
                    this.startSignalCountdown(this.aiRecommendation.entry_time);
                }

            } catch (error) {
                console.error('[OperationDigits] Erro na análise Gemini:', error);
                this.aiRecommendation = {
                    action: 'ERRO',
                    reason: 'Falha na conexão com a IA',
                    confidence: 0
                };
            }
        },
        getHistogramBarClass(digit, percentage, frequencies) {
            if (!frequencies || frequencies.length === 0) return '';
            
            let max = -1;
            let min = 101;
            
            frequencies.forEach(f => {
                if (f.percentage > max) max = f.percentage;
                if (f.percentage < min) min = f.percentage;
            });

            if (percentage === max && max > min) return 'status-max';
            if (percentage === min && min < max) return 'status-min';
            return 'status-normal';
        },
        getFrequencyClass(digit, percentage) {
            if (percentage > 15) return 'status-green';
            if (percentage > 10) return 'status-yellow';
            return '';
        },
        closeResultNotification() {
            this.showResultNotification = false;
        },
        async initConnection() {
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
            
            try {
                this.token = await this.getTokenForAccount();
            } catch (error) {
                console.error('[OperationDigits] Erro ao obter token do backend:', error);
                this.token = null;
            }

            this.appId = localStorage.getItem('deriv_app_id') || APP_ID;

            // Verificação de acesso - requer token Deriv
            if (!this.token) {
                console.error('[OperationDigits] ERRO: Nenhum token Deriv encontrado (Backend/Storage)');
                this.isConnecting = false;
                // localStorage.removeItem('deriv_connection'); // Evitar limpar storage agressivamente se for erro de rede temporário
                // mas se for erro de auth, talvez redirecionar?
                // localStorage.removeItem('deriv_token');
                
                // Tentar fallback local apenas se backend falhar? Não, getTokenForAccount já deve lidar com isso ou retornar null
                if (!this.token) {
                   this.$router.push('/dashboard');
                   return;
                }
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
                case 'active_symbols':
                    this.processWSActiveSymbols(msg.active_symbols);
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
            
            // Se estiver usando dados simulados, limpar antes de adicionar dados reais
            if (this.isSimulated) {
                this.digits = []; // Limpar array local se estiver usando
                this.digitFrequency.digits = []; // Limpar array de frequência
                this.isSimulated = false;
            }

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
            
            // Se ainda estiver com dados simulados e receber um tick, limpar tudo primeiro
            if (this.isSimulated) {
                this.ticks = [];
                this.digitFrequency.digits = [];
                this.isSimulated = false;
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
            const lastSample = this.ticks.slice(-500);
            const digits = [];
            const frequency = {};
            
            for (let i = 0; i <= 9; i++) {
                frequency[i] = 0;
            }
            
            lastSample.forEach(tick => {
                const valueStr = tick.value.toString();
                const lastDigit = parseInt(valueStr.charAt(valueStr.length - 1));
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
            
            this.tradeMessage = '';
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
            
            // Persistir a trade no backend
            try {
                derivTradingService.notifyBuy({
                    contract_id: buy.contract_id,
                    buy_price: Number(buy.buy_price),
                    currency: this.currentTradeCurrency,
                    symbol: this.symbol,
                    contract_type: this.digitType,
                    status: 'OPEN',
                    transaction_id: buy.transaction_id,
                    purchase_time: buy.purchase_time,
                    entry_tick: Number(buy.entry_spot || buy.spot || this.latestTick?.value || 0),
                    barrier: this.needsDigitBarrier ? this.digitBarrier : null
                }, this.currentTradeCurrency).then(() => {
                    console.log('[OperationDigits] Trade persistida no backend com sucesso');
                }).catch(err => {
                    console.error('[OperationDigits] Erro ao persistir trade no backend:', err);
                });
            } catch (e) {
                 console.error('[OperationDigits] Erro ao chamar notifyBuy:', e);
            }
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
            // Evitar execução duplicada se o modal já estiver aberto
            if (this.showTradeResultModal) {
                 console.log('[OperationDigits] Modal já está aberto, ignorando trigger duplicado de expiração.');
                 return;
            }

            console.log('[OperationDigits] ========== FINALIZANDO CONTRATO ==========');
            console.log('[OperationDigits] Dados do contrato:', contract);
            
            this.unsubscribeFromContract();
            
            let finalProfit = 0;
            if (contract.profit !== undefined && contract.profit !== null) {
                finalProfit = Number(contract.profit);
            } else if (this.realTimeProfit !== null && this.realTimeProfit !== undefined) {
                finalProfit = Number(this.realTimeProfit);
            }
            
            // Preparar dados para o modal
            this.finalTradeProfit = finalProfit;
            // Usar o tipo do contrato ativo ou o tipo selecionado
            this.finalTradeType = this.activeContract?.type || this.digitType || 'CALL'; 
            if (this.activeContract?.digitBarrier) {
                 this.finalTradeType += ` (${this.activeContract.digitBarrier})`;
            }
            
            this.finalEntrySpot = this.activeContract?.entry_spot || 0;
            this.finalExitSpot = contract.exit_spot ? Number(contract.exit_spot) : (contract.sell_spot ? Number(contract.sell_spot) : this.latestTick?.value);
            
            // Exibir Modal
            this.showTradeResultModal = true;
            
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
            
            // Limpar contrato após um tempo para garantir que o usuário veja
            // Mas a limpeza real ocorre no closeTradeResultModal para reativar botões apenas lá
            setTimeout(() => {
                if (!this.showTradeResultModal) {
                    this.activeContract = null;
                    this.realTimeProfit = null;
                }
            }, 10000);
            
            this.contractStartTime = null;
            this.contractDuration = null;
        },
        closeTradeResultModal() {
            this.showTradeResultModal = false;
            // Limpar dados do resultado
            this.finalTradeProfit = 0;
            this.finalTradeType = 'CALL';
            
            // Limpar contrato ativo imediatamente para mostrar os botões de ação
            if (this.activeContract) {
                this.activeContract = null;
                this.realTimeProfit = null;
                this.currentProposalId = null; 
            }
            
            // Reinscrever na proposta para próxima operação
            setTimeout(() => {
                this.subscribeToProposal();
            }, 500);
        },
        async getTokenForAccount() {
            // Tentar obter do backend a fonte da verdade (baseado em user_settings.trade_currency)
            try {
                const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
                if (authToken) {
                    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                    const response = await fetch(`${apiBaseUrl}/broker/deriv/trading/token`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.token) {
                            console.log('[OperationDigits] Token Deriv resolvido pelo backend (Demo/Real):', data.token.substring(0, 4) + '...');
                            return data.token;
                        }
                        
                        // NOTA: O backend deve retornar token ou falhar. Se retornar null, é porque não achou.
                        // Nesse caso, podemos tentar fallback local se quisermos, mas a ideia é usar o backend.
                    }
                }
            } catch (error) {
                console.warn('[OperationDigits] Falha ao obter token do backend, tentando fallback local:', error);
            }

            // Fallback: Lógica antiga (Local Storage)
            console.warn('[OperationDigits] Usando fallback de token do LocalStorage');
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
            this.isSimulated = true;
            const simulatedTicks = [];
            const now = Math.floor(Date.now() / 1000);
            
            // Gerar 100 ticks simulados para que calculateDigitFrequency funcione
            for (let i = 0; i < 100; i++) {
                const randomDigit = Math.floor(Math.random() * 10);
                // Criar um valor fake onde o último dígito é o randomDigit (ex: 1234.5)
                const randomValue = 1000 + (Math.random() * 100); 
                const valueStr = randomValue.toFixed(2); // ex "1234.56"
                // Ajustar para terminar com o dígito desejado
                // Na verdade, mais fácil apenas gerar um valor inteiro terminado no digito
                const tickValue = 1000 + (i * 10) + randomDigit; 

                simulatedTicks.push({
                    value: tickValue,
                    epoch: now - (100 - i)
                });
            }
            
            this.ticks = simulatedTicks;
            this.calculateDigitFrequency(); 
        },
    },
    mounted() {
        console.log('[OperationDigits] Componente montado');
        if (this.orderConfig && this.orderConfig.value !== undefined) {
            this.orderValue = Number(this.orderConfig.value);
        }
        
        // Iniciar com dados simulados para evitar gráfico vazio (0%)
        this.simulateInitialData();
        
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

.btn-gerar-sinal-header {
  background-color: #22C55E;
  color: #000000;
  font-weight: 800;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
  transition: all 0.3s ease;
}

.btn-gerar-sinal-header:hover {
  background-color: #16A34A;
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.4);
}

.metric-signal-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-signal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
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

    /* Mobile layout ordering */
    .frequency-unified-card-wrapper,
    .heatmap-card,
    .dvx-card,
    .parity-meter-card,
    .high-low-card {
        display: none !important;
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

    .digit-meta-item span:last-child {
        display: none !important; /* Hide redundant percentage label on mobile */
    }

    .meta-analysis-card {
        padding: 1rem !important;
        min-height: auto !important;
    }

    .meta-analysis-card .text-6xl {
        font-size: 3rem !important;
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

/* Ocultar Gerador de Sinais */
.signal-generator-wrapper-digits,
.signal-generator-inline-mobile {
    display: none !important;
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
</style>
