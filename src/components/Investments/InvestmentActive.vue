<template>
    <div class="investment-active-wrapper">
        <main class="investment-active-main">
            <!-- Desktop: Layout Original - Performance Summary Cards -->
            <section id="compact-performance-panel" class="mb-6 desktop-performance-panel">
                <div id="iya1j" class="grid grid-cols-12 gap-3" style="width: 100%; box-sizing: border-box;">
                    <!-- Card 1 - Saldo Total -->
                    <div class="col-span-2" style="width: 100%; box-sizing: border-box;">
                        <div id="ie22vl" class="bg-[#0B0B0B]/80 border-2 border-[#1C1C1C] rounded-2xl p-3 premium-card h-[100px] flex flex-col justify-between relative overflow-hidden" style="width: 100%; box-sizing: border-box;">
                            <div class="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent pointer-events-none"></div>
                            <div class="relative z-10">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[9px] text-zenix-label font-medium uppercase tracking-wide">Saldo Total</span>
                                    <button class="eye-btn" @click="balanceVisible = !balanceVisible">
                                        <i :class="balanceVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[10px]"></i>
                                    </button>
                                </div>
                                <div class="text-xl font-bold text-zenix-text text-left">
                                    <span v-if="!isLoadingStats && accountBalanceProp" :class="{ 'hidden-value': !balanceVisible }">
                                        {{ balanceVisible ? formattedBalance : '••••••' }}
                                    </span>
                                    <span v-else class="text-zenix-secondary">Carregando...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2 - Lucro do Dia -->
                    <div class="col-span-2" style="width: 100%; box-sizing: border-box;">
                        <div id="i790gh" class="bg-[#0B0B0B]/80 border-2 border-[#1C1C1C] rounded-2xl p-3 premium-card h-[100px] flex flex-col justify-between relative overflow-hidden" style="width: 100%; box-sizing: border-box;">
                            <div class="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent pointer-events-none"></div>
                            <div class="relative z-10">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[9px] text-zenix-label font-medium uppercase tracking-wide mobile-label-lucro">Lucro do Dia</span>
                                    <button class="eye-btn" @click="profitVisible = !profitVisible">
                                        <i :class="profitVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[10px]"></i>
                                    </button>
                                </div>
                                <div class="flex items-baseline space-x-1.5 text-left">
                                    <div v-if="!isLoadingStats" :class="['text-2xl font-bold', sessionProfitLossClass, { 'hidden-value': !profitVisible }]">
                                        {{ profitVisible ? formattedSessionProfitLoss : '••••••' }}
                                    </div>
                                    <span 
                                        v-if="!isLoadingStats && profitPercentage && profitVisible" 
                                        :class="['profit-percentage-badge', isProfitPositive ? 'profit-positive' : 'profit-negative']"
                                    >
                                        {{ profitPercentage }}
                                    </span>
                                    <span v-else-if="isLoadingStats" class="text-zenix-secondary">--</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3 - Trades Hoje -->
                    <div class="col-span-2" style="width: 100%; box-sizing: border-box;">
                        <div id="i42e4g" class="bg-[#0B0B0B]/80 border-2 border-[#1C1C1C] rounded-2xl p-3 premium-card h-[100px] flex flex-col justify-between" style="width: 100%; box-sizing: border-box;">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-[9px] text-zenix-label font-medium uppercase tracking-wide">Trades Hoje</span>
                                <button class="eye-btn" @click="tradesVisible = !tradesVisible">
                                    <i :class="tradesVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[10px]"></i>
                                </button>
                            </div>
                            <div class="flex items-center space-x-2 text-left">
                                <span v-if="!isLoadingStats" id="i8cy7b" :class="['text-2xl font-bold text-zenix-green', { 'hidden-value': !tradesVisible }]">
                                    {{ tradesVisible ? (dailyStats.sessionWins || 0) : '••' }}
                                </span>
                                <div class="relative">
                                    <span class="text-xl font-light text-zenix-secondary/40">|</span>
                                    <div class="absolute inset-0 bg-zenix-green/20 blur-sm"></div>
                                </div>
                                <span v-if="!isLoadingStats" id="idsh94" :class="['text-2xl font-bold text-zenix-red', { 'hidden-value': !tradesVisible }]">
                                    {{ tradesVisible ? (dailyStats.sessionLosses || 0) : '••' }}
                                </span>
                                <span v-else class="text-zenix-secondary">--</span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 4 - Status da IA -->
                    <div id="ichwdn" class="col-span-6" style="width: 100%; box-sizing: border-box;">
                        <div id="ai-status-card" class="bg-gradient-to-b from-[#0B0B0B] to-[#080808] border-2 border-[#22C55E]/10 rounded-[18px] p-5 premium-card h-[100px] relative overflow-hidden transition-all duration-700" style="width: 100%; box-sizing: border-box;">
                            <div id="card-gradient" class="absolute inset-0 bg-gradient-to-br from-[#22C55E]/8 to-transparent pointer-events-none transition-all duration-700"></div>
                            <div class="relative z-10 h-full flex items-center justify-between gap-8">
                                <div class="flex items-center space-x-5 flex-shrink-0">
                                    <div id="status-icon-container" class="w-16 h-16 bg-zenix-green/15 border-2 border-zenix-green/30 rounded-xl flex items-center justify-center transition-all duration-700">
                                        <i id="status-icon" class="fas fa-chart-line text-zenix-green text-2xl ai-pulse"></i>
                                    </div>
                                    <div class="text-left">
                                        <h3 id="status-title" class="text-xl font-bold text-zenix-text leading-tight transition-all duration-700 text-left">
                                            {{ currentStatusTitle }}
                                        </h3>
                                        <p id="status-description" class="text-sm text-zenix-secondary mt-1 leading-tight transition-all duration-700 text-left">
                                            {{ currentStatusDescription }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex-1 h-full flex items-center justify-end min-w-0 relative overflow-hidden" style="margin: -1.25rem -1.25rem -1.25rem 0; height: calc(100% + 2.5rem); width: 100%; flex: 1 1 auto; min-width: 0;">
                                    <!-- Gradiente suave entre preto e verde -->
                                    <div class="absolute inset-0 status-card-gradient"></div>
                                    <!-- Background verde animado -->
                                    <div class="absolute inset-0 status-card-green-bg"></div>
                                    <!-- Animated Grid Background -->
                                    <div class="absolute inset-0 opacity-20">
                                        <div class="absolute inset-0"></div>
                                    </div>
                                    <!-- Central AI Core -->
                                    <div class="relative z-10 flex items-center justify-center w-full h-full" style="position: relative;">
                                        <!-- Outer Rotating Ring -->
                                        <div class="absolute w-32 h-32 border-2 border-zenix-green/30 rounded-full ai-glow-ring" style="opacity: 1; animation: ringPulse 2s ease-in-out infinite;"></div>
                                        <!-- Middle Rotating Ring -->
                                        <div class="absolute w-24 h-24 border-2 border-zenix-green/40 rounded-full" style="opacity: 1; animation: spin 8s linear infinite;"></div>
                                        <!-- Inner Pulsing Core -->
                                        <div class="absolute w-16 h-16 bg-zenix-green/20 rounded-full blur-xl ai-pulse" style="opacity: 1; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
                                        <!-- Central Robot Icon -->
                                        <div class="relative z-30 ai-brain-glow" style="display: flex; align-items: center; justify-content: center; animation: brainPulse 2s ease-in-out infinite; filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));">
                                            <i class="fas fa-robot text-zenix-green text-4xl" style="opacity: 1 !important; display: block !important; visibility: visible !important; font-size: 2.5rem !important;"></i>
                                        </div>
                                        <!-- Orbiting Data Nodes -->
                                        <div class="absolute w-2 h-2 bg-zenix-green rounded-full orbit-node" style="opacity: 1; animation: orbit1 4s linear infinite;"></div>
                                        <div class="absolute w-1.5 h-1.5 bg-zenix-green/70 rounded-full orbit-node" style="opacity: 1; animation: orbit2 5s linear infinite;"></div>
                                        <div class="absolute w-2 h-2 bg-zenix-green/80 rounded-full orbit-node" style="opacity: 1; animation: orbit3 6s linear infinite;"></div>
                                    </div>
                                    <!-- Floating Particles -->
                                    <div class="absolute inset-0 overflow-hidden">
                                        <div class="absolute w-1 h-1 bg-zenix-green rounded-full particle" style="top: 20%; left: 15%; animation: float 3s ease-in-out infinite;"></div>
                                        <div class="absolute w-1 h-1 bg-zenix-green/70 rounded-full particle" style="top: 60%; left: 80%; animation: float 4s ease-in-out infinite 0.5s;"></div>
                                        <div class="absolute w-1 h-1 bg-zenix-green/60 rounded-full particle" style="top: 80%; left: 30%; animation: float 3.5s ease-in-out infinite 1s;"></div>
                                        <div class="absolute w-1 h-1 bg-zenix-green rounded-full particle" style="top: 40%; left: 70%; animation: float 3.8s ease-in-out infinite 1.5s;"></div>
                                    </div>
                                    <!-- Data Stream Lines -->
                                    <div class="absolute inset-0 overflow-hidden opacity-30">
                                        <div class="absolute h-px w-20 bg-gradient-to-r from-transparent via-zenix-green to-transparent" style="top: 30%; left: 10%; animation: streamRight 3s linear infinite;"></div>
                                        <div class="absolute h-px w-16 bg-gradient-to-r from-transparent via-zenix-green to-transparent" style="top: 50%; left: 20%; animation: streamRight 4s linear infinite 0.5s;"></div>
                                        <div class="absolute h-px w-24 bg-gradient-to-r from-transparent via-zenix-green to-transparent" style="top: 70%; left: 15%; animation: streamRight 3.5s linear infinite 1s;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Mobile: Card Unificado: Header + Saldo + Resultado + Trades + Ordem -->
            <section id="mobile-compact-performance-panel" class="mb-6 mobile-performance-panel">
                <div class="bg-[#0B0B0B]/80 border-2 border-[#1C1C1C] rounded-2xl p-6 premium-card relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent pointer-events-none"></div>
                    <div class="relative z-10">
                        <!-- Header -->
                        <div class="mobile-ia-header mb-3">
                            <h1 class="mobile-ia-title">IA ORION</h1>
                            <div class="mobile-separator"></div>
                        </div>
                        
                        <!-- Saldo Total, Lucro do Dia e Trades Hoje -->
                        <div class="grid grid-cols-3 gap-3 mb-4">
                            <!-- Saldo Total -->
                            <div class="flex flex-col justify-between">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[8px] text-zenix-label font-medium uppercase tracking-wide">Saldo Total</span>
                                    <button class="eye-btn" @click="balanceVisible = !balanceVisible">
                                        <i :class="balanceVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[9px]"></i>
                                    </button>
                                </div>
                                <div class="text-[12px] font-bold text-zenix-text text-left">
                                    <span v-if="!isLoadingStats && accountBalanceProp" :class="{ 'hidden-value': !balanceVisible }">
                                        {{ balanceVisible ? formattedBalance : '••••••' }}
                                    </span>
                                    <span v-else class="text-[12px] text-zenix-secondary">Carregando...</span>
                                </div>
                            </div>

                            <!-- Lucro do Dia -->
                            <div class="flex flex-col justify-between">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[8px] text-zenix-label font-medium uppercase tracking-wide mobile-label-lucro">Lucro do Dia</span>
                                    <button class="eye-btn" @click="profitVisible = !profitVisible">
                                        <i :class="profitVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[9px]"></i>
                                    </button>
                                </div>
                                <div class="flex items-baseline space-x-1.5 text-left">
                                    <div v-if="!isLoadingStats" :class="['text-[12px] font-bold', sessionProfitLossClass, { 'hidden-value': !profitVisible }]">
                                        {{ profitVisible ? formattedSessionProfitLoss : '••••••' }}
                                    </div>
                                    <span 
                                        v-if="!isLoadingStats && profitPercentage && profitVisible" 
                                        :class="['profit-percentage-badge profit-percentage-badge-mobile', isProfitPositive ? 'profit-positive' : 'profit-negative']"
                                    >
                                        {{ profitPercentage }}
                                    </span>
                                    <span v-else-if="isLoadingStats" class="text-[12px] text-zenix-secondary">Carregando...</span>
                                </div>
                            </div>

                            <!-- Trades Hoje -->
                            <div class="flex flex-col justify-between">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-[8px] text-zenix-label font-medium uppercase tracking-wide">Trades Hoje</span>
                                    <button class="eye-btn" @click="tradesVisible = !tradesVisible">
                                        <i :class="tradesVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[9px]"></i>
                                    </button>
                                </div>
                                <div class="flex items-center space-x-2 text-left">
                                    <span v-if="!isLoadingStats" id="i8cy7b" :class="['text-[12px] font-bold text-zenix-green', { 'hidden-value': !tradesVisible }]">
                                        {{ tradesVisible ? (dailyStats.sessionWins || 0) : '••' }}
                                    </span>
                                    <div class="relative">
                                        <span class="text-[12px] font-light text-zenix-secondary/40">|</span>
                                        <div class="absolute inset-0 bg-zenix-green/20 blur-sm"></div>
                                    </div>
                                    <span v-if="!isLoadingStats" id="idsh94" :class="['text-[12px] font-bold text-zenix-red', { 'hidden-value': !tradesVisible }]">
                                        {{ tradesVisible ? (dailyStats.sessionLosses || 0) : '••' }}
                                    </span>
                                    <span v-else class="text-[12px] text-zenix-secondary">Carregando...</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Ordem (Barra de Progresso) -->
                        <div class="mobile-progress-container" style="padding-top: 0.5rem; border-top: 1px solid #1C1C1C; margin-top: 0.5rem;">
                            <div class="mobile-progress-bar">
                                <div :class="['mobile-progress-segment segment-1', { 'filled': progressState >= 1 }]"></div>
                                <div :class="['mobile-progress-segment segment-2', { 'filled': progressState >= 2 }]"></div>
                                <div :class="['mobile-progress-segment segment-3', { 'filled': progressState >= 3 }]"></div>
                            </div>
                            <div class="mobile-progress-text">
                                <span class="mobile-progress-dot"></span>
                                <div class="mobile-progress-labels">
                                    <span class="mobile-progress-label label-1">Analisando o mercado</span>
                                    <span class="mobile-progress-label label-2">Ordem aberta</span>
                                    <span class="mobile-progress-label label-3">Ordem fechada</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    
            
            <!-- Mobile Tabs (fora do card - apenas para desktop) -->
            <div class="mobile-tabs-container mobile-tabs-outside">
                <button 
                    :class="['mobile-tab', activeTab === 'config' ? 'mobile-tab-active' : '']"
                    @click="activeTab = 'config'"
                >
                    Configuração
                </button>
                <button 
                    :class="['mobile-tab', activeTab === 'chart' ? 'mobile-tab-active' : '']"
                    @click="activeTab = 'chart'"
                >
                    Gráfico
                </button>
                <button 
                    :class="['mobile-tab', activeTab === 'register' ? 'mobile-tab-active' : '']"
                    @click="activeTab = 'register'"
                >
                    Registro
                </button>
                <button 
                    :class="['mobile-tab', activeTab === 'logs' ? 'mobile-tab-active' : '']"
                    @click="activeTab = 'logs'"
                >
                    Histórico
                </button>
            </div>
            
            <!-- Mobile: Conteúdo da Tab Config -->
            <div v-if="activeTab === 'config'" class="mobile-config-content mobile-tab-content">
                <!-- Mobile Tabs (dentro do card de configuração) -->
                <div class="mobile-tabs-container mobile-tabs-inside">
                    <button 
                        :class="['mobile-tab', activeTab === 'config' ? 'mobile-tab-active' : '']"
                        @click="activeTab = 'config'"
                    >
                        Config
                    </button>
                    <button 
                        :class="['mobile-tab', activeTab === 'chart' ? 'mobile-tab-active' : '']"
                        @click="activeTab = 'chart'"
                    >
                        Gráfico
                    </button>
                    <button 
                        :class="['mobile-tab', activeTab === 'register' ? 'mobile-tab-active' : '']"
                        @click="activeTab = 'register'"
                    >
                        Registro
                    </button>
                    <button 
                        :class="['mobile-tab', activeTab === 'logs' ? 'mobile-tab-active' : '']"
                        @click="activeTab = 'logs'"
                    >
                        Histórico
                    </button>
                </div>
                <div class="mobile-config-header">
                    <h3 class="mobile-config-title">Configuração Ativa</h3>
                    <i class="fas fa-cogs mobile-config-icon"></i>
                </div>
                <div class="mobile-config-card">
                    <div class="mobile-config-item">
                        <p class="mobile-config-label">Estratégia</p>
                        <p class="mobile-config-value">{{ strategyName }}</p>
                        <p class="mobile-config-desc">Estratégia de scalping com análise de padrões em tempo real</p>
                    </div>
                    <div class="mobile-config-item">
                        <p class="mobile-config-label">Mercado</p>
                        <p class="mobile-config-value">{{ formattedMarketName }}</p>
                        <p class="mobile-config-desc">Ticks de alta frequência</p>
                    </div>
                    <div class="mobile-config-grid">
                        <div class="mobile-config-param">
                            <p class="mobile-config-param-label">Entrada</p>
                            <p class="mobile-config-param-value" v-if="!isLoadingConfig">{{ sessionConfig.stakeAmount ? '$' + sessionConfig.stakeAmount.toFixed(2) : '$10.00' }}</p>
                            <p class="mobile-config-param-value" v-else>Carregando...</p>
                        </div>
                        <div class="mobile-config-param">
                            <p class="mobile-config-param-label">Modo</p>
                            <p class="mobile-config-param-value">{{ mode === 'veloz' ? 'Veloz' : mode === 'moderado' ? 'Moderado' : 'Lento' }}</p>
                        </div>
                        <div class="mobile-config-param">
                            <p class="mobile-config-param-label">Alvo de Lucro</p>
                            <p class="mobile-config-param-value mobile-config-profit" v-if="!isLoadingConfig">{{ sessionConfig.profitTarget ? '$' + sessionConfig.profitTarget.toFixed(2) : '$15.00' }}</p>
                            <p class="mobile-config-param-value mobile-config-profit" v-else>Carregando...</p>
                        </div>
                        <div class="mobile-config-param">
                            <p class="mobile-config-param-label">Limite de Perda</p>
                            <p class="mobile-config-param-value mobile-config-loss" v-if="!isLoadingConfig">{{ sessionConfig.lossLimit ? '$' + sessionConfig.lossLimit.toFixed(2) : '$5.00' }}</p>
                            <p class="mobile-config-param-value mobile-config-loss" v-else>Carregando...</p>
                        </div>
                    </div>
                    <div class="mobile-config-item">
                        <p class="mobile-config-label">Gerenciamento</p>
                        <div class="mobile-config-badge">
                            <span class="mobile-config-badge-text">{{ realRiskLabel }}</span>
                        </div>
                    </div>
                    <div class="mobile-config-item">
                        <p class="mobile-config-label">Status da IA</p>
                        <div class="mobile-config-status">
                            <span class="mobile-config-status-dot"></span>
                            <span class="mobile-config-status-text">Ativa</span>
                        </div>
                    </div>
                    <button 
                        class="mobile-pause-btn"
                        @click="handleDeactivate"
                        :disabled="isDeactivating"
                    >
                        <i class="fas fa-pause"></i>
                        <span>{{ isDeactivating ? 'Desativando...' : ' PAUSAR IA' }}</span>
                    </button>
                </div>
            </div>
    
            <!-- Main Content Grid (Desktop) / Mobile Tab Content -->
            <div v-if="activeTab !== 'config'" class="grid grid-cols-12 gap-6 mb-6 items-stretch desktop-main-content" style="width: 100%; box-sizing: border-box;">
                <!-- Left Column - Chart -->
                <div id="ir8sfp" class="col-span-9 flex">
                    <div id="market-chart" class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card h-full flex flex-col w-full">
                        <!-- Mobile Tabs (dentro do card) -->
                        <div class="mobile-tabs-container mobile-tabs-inside">
                            <button 
                                :class="['mobile-tab', activeTab === 'config' ? 'mobile-tab-active' : '']"
                                @click="activeTab = 'config'"
                            >
                                Config
                            </button>
                            <button 
                                :class="['mobile-tab', activeTab === 'chart' ? 'mobile-tab-active' : '']"
                                @click="activeTab = 'chart'"
                            >
                                Gráfico
                            </button>
                            <button 
                                :class="['mobile-tab', activeTab === 'register' ? 'mobile-tab-active' : '']"
                                @click="activeTab = 'register'"
                            >
                                Registro
                            </button>
                            <button 
                                :class="['mobile-tab', activeTab === 'logs' ? 'mobile-tab-active' : '']"
                                @click="activeTab = 'logs'"
                            >
                                Histórico
                            </button>
                        </div>
                        <!-- Mobile: Título do Gráfico -->
                        <div v-show="activeTab === 'chart'" class="mobile-chart-title">
                            <h3 class="mobile-chart-title-text">Gráfico</h3>
                        </div>
                        <div class="flex items-center justify-between mb-4 desktop-chart-header">
                            <div>
                                <h2 v-if="activeTab === 'logs'" class="text-lg font-semibold text-zenix-text">Histórico de Operações</h2>
                                <h2 v-else-if="activeTab === 'register'" class="text-lg font-semibold text-zenix-text">Registro de Eventos em Tempo Real</h2>
                                <h2 v-else class="text-lg font-semibold text-zenix-text">Análise de Mercado</h2>
                                <p v-if="activeTab !== 'register' && activeTab !== 'logs'" class="text-xs text-zenix-secondary mt-1">{{ formattedMarketName }} • M5 • Última atualização: {{ formattedLastUpdate }}</p>
                            </div>
                            <div class="flex items-center space-x-6 desktop-tabs">
                                <button 
                                    id="tab-chart" 
                                    :class="['relative text-sm font-medium transition-all pb-1', activeTab === 'chart' ? 'text-zenix-green' : 'text-zenix-secondary hover:text-zenix-text']"
                                    @click="activeTab = 'chart'"
                                >
                                    Gráfico
                                    <div v-if="activeTab === 'chart'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zenix-green"></div>
                                </button>
                                <button 
                                    id="tab-register" 
                                    :class="['relative text-sm font-medium transition-all pb-1', activeTab === 'register' ? 'text-zenix-green' : 'text-zenix-secondary hover:text-zenix-text']"
                                    @click="activeTab = 'register'"
                                >
                                    Registros
                                    <div v-if="activeTab === 'register'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zenix-green"></div>
                                </button>
                                <button 
                                    id="tab-logs" 
                                    :class="['relative text-sm font-medium transition-all pb-1', activeTab === 'logs' ? 'text-zenix-green' : 'text-zenix-secondary hover:text-zenix-text']"
                                    @click="activeTab = 'logs'"
                                >
                                    Histórico
                                    <div v-if="activeTab === 'logs'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zenix-green"></div>
                                </button>
                            </div>
                        </div>
            
                        <!-- Chart View -->
                        <div v-show="activeTab === 'chart'" id="chart-view" class="flex-1 flex flex-col min-h-0 -mx-6 -mb-6 px-6" style="margin-top: 0;">
                            <div ref="chartContainer" id="tradingview-chart" class="chart-container tradingview-container flex-1 min-h-0"></div>
                            
                            <!-- Mobile: Informações do mercado abaixo do gráfico -->
                            <div class="mobile-market-info mt-4 desktop-hidden">
                                <!-- Linha superior: Preço/Percentual e Botão Compra -->
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex flex-col text-left">
                                        <span class="text-2xl font-bold text-zenix-text">{{ currentPrice ? currentPrice.toFixed(5) : '1.08542' }}</span>
                                        <span class="text-base font-semibold text-zenix-green mt-0.5">+0.24%</span>
                                    </div>
                                    <button class="bg-zenix-green/20 hover:bg-zenix-green/30 border border-zenix-green text-zenix-green px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                                        <i class="fas fa-arrow-up"></i>
                                        Compra
                                    </button>
                                </div>
                                
                                <!-- Linha inferior: Volume, Spread, Sinal IA -->
                                <div class="grid grid-cols-3 gap-4 text-left border-t border-[#1C1C1C] pt-4">
                                    <div class="flex flex-col text-left">
                                        <span class="text-xs text-zenix-secondary mb-1">Volume</span>
                                        <span class="text-sm font-semibold text-zenix-text">2.4M</span>
                                    </div>
                                    <div class="flex flex-col text-left">
                                        <span class="text-xs text-zenix-secondary mb-1">Spread</span>
                                        <span class="text-sm font-semibold text-zenix-text">0.8</span>
                                    </div>
                                    <div class="flex flex-col text-left">
                                        <span class="text-xs text-zenix-secondary mb-1">Sinal IA</span>
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-2 h-2 rounded-full bg-zenix-green"></span>
                                            <span class="text-sm font-semibold text-zenix-green">Alta</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                        <!-- Histórico View (Tabela de Operações Executadas) -->
                        <div v-show="activeTab === 'logs'" id="logs-view" class="h-[600px] overflow-y-auto mobile-logs-view">
                            <!-- Mobile: Título do Histórico -->
                            <div class="mobile-logs-title">
                                <h3 class="mobile-logs-title-text">Histórico de Operações</h3>
                            </div>
                            
                            <div v-if="isLoadingLogs" class="loading-logs">
                                <p>Carregando histórico de operações...</p>
                            </div>
                            
                            <div v-else-if="logOperations.length === 0" class="no-logs">
                                <p>Nenhuma operação executada ainda.</p>
                            </div>
                            
                            <template v-else>
                                <!-- Desktop: Tabela -->
                                <div class="logs-table-wrapper desktop-logs-table">
                                    <table class="logs-table">
                                        <thead>
                                            <tr>
                                                <th class="text-left">Horário</th>
                                                <th class="text-left">Mercado</th>
                                                <th class="text-left">Negociação</th>
                                                <th class="text-right">Preço Entrada</th>
                                                <th class="text-right">Preço Saída</th>
                                                <th class="text-left">Investimento</th>
                                                <th class="text-right">Retorno</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(op, index) in logOperations" :key="index" :class="['log-row', index % 2 === 0 ? 'log-row-even' : 'log-row-odd']">
                                                <td>{{ op.time }}</td>
                                                <td>{{ op.pair }}</td>
                                                <td>
                                                    <span :class="['direction-badge', (op.direction === 'CALL' || op.direction === 'PAR') ? 'call-badge' : 'put-badge']">
                                                        <i :class="`fas fa-arrow-${(op.direction === 'CALL' || op.direction === 'PAR') ? 'up' : 'down'} text-xs mr-1`"></i>
                                                        {{ op.direction === 'CALL' ? 'PAR' : op.direction === 'PUT' ? 'IMPAR' : op.direction }}
                                                    </span>
                                                </td>
                                                
                                                <td class="text-right">
                                                    <span v-if="op.entryPrice != null && op.entryPrice !== undefined && !isNaN(op.entryPrice) && op.entryPrice > 0">
                                                        {{ parseFloat(op.entryPrice).toFixed(2) }}
                                                    </span>
                                                    <span v-else>-</span>
                                                </td>
                                                <td class="text-right">
                                                    <span v-if="op.exitPrice != null && op.exitPrice !== undefined && !isNaN(op.exitPrice) && op.exitPrice > 0">
                                                        {{ parseFloat(op.exitPrice).toFixed(2) }}
                                                    </span>
                                                    <span v-else>-</span>
                                                </td>
                                                <td>
                                                    {{ op.investment }}
                                                </td>
                                                <td :class="['text-right', op.pnl.startsWith('+') ? 'text-zenix-green' : 'text-zenix-red']">
                                                    {{ op.pnl }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                <!-- Mobile: Cards -->
                                <div class="mobile-logs-cards">
                                    <div v-for="(op, index) in logOperations" :key="index" class="mobile-log-card">
                                        <div class="mobile-log-time">{{ op.time }}</div>
                                        <div class="mobile-log-type">
                                            <span v-if="op.pair">{{ op.pair }}</span>
                                            <span v-if="op.direction"> - {{ op.direction === 'CALL' ? 'PAR' : op.direction === 'PUT' ? 'IMPAR' : op.direction }}</span>
                                        </div>
                                        <div class="mobile-log-footer">
                                            <span class="mobile-log-invested">Investido: {{ op.investment }}</span>
                                            <span :class="['mobile-log-result', op.pnl && op.pnl.startsWith('+') ? 'mobile-log-result-positive' : 'mobile-log-result-negative']">
                                                Resultado: <span :class="[op.pnl && op.pnl.startsWith('+') ? 'mobile-log-result-value-positive' : 'mobile-log-result-value-negative']">{{ op.pnl ? (op.pnl.includes('$-') ? op.pnl.replace('$-', '-$') : op.pnl) : '$0.00' }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- Registros View (Logs Detalhados em Tempo Real) -->
                        <div v-show="activeTab === 'register'" id="register-view" class="h-[600px] overflow-hidden flex flex-col mobile-tab-content">
                            <!-- Desktop Header -->
                            <div class="flex items-center justify-between mb-3 px-2 desktop-register-header">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-zenix-secondary">📋 Registro de Eventos em Tempo Real</span>
                                    <span v-if="realtimeLogs.length > 0" class="text-xs text-zenix-green">{{ realtimeLogs.length }} eventos</span>
                                </div>
                                <div class="flex gap-2">
                                    <button 
                                        @click="exportLogs" 
                                        class="px-3 py-1 text-xs bg-zenix-bg border border-zenix-border rounded hover:bg-zenix-card transition-colors text-zenix-secondary hover:text-zenix-text"
                                        :disabled="realtimeLogs.length === 0"
                                    >
                                        <i class="fas fa-download mr-1"></i> Exportar
                                    </button>
                                    <button 
                                        @click="clearLogs" 
                                        class="px-3 py-1 text-xs bg-zenix-bg border border-zenix-border rounded hover:bg-red-900/20 transition-colors text-zenix-secondary hover:text-red-400"
                                        :disabled="realtimeLogs.length === 0"
                                    >
                                        <i class="fas fa-trash mr-1"></i> Limpar
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Mobile Header -->
                            <div class="mobile-register-header">
                                <h2 class="mobile-register-title">Registro de Operações</h2>
                                <p class="mobile-register-subtitle">Histórico completo de eventos da sessão</p>
                            </div>
                            
                            <!-- Desktop Logs List -->
                            <div 
                                ref="logsContainer" 
                                class="flex-1 bg-black rounded-lg p-4 overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar relative desktop-register-list" 
                                style="scroll-behavior: smooth; max-height: 500px;"
                            >
                                <div v-if="realtimeLogs.length === 0" class="text-zenix-secondary text-left py-12 px-4">
                                    <i class="fas fa-info-circle text-2xl mb-2"></i>
                                    <p>Nenhum evento registrado ainda.</p>
                                    <p class="text-xs mt-1">Os logs aparecerão aqui em tempo real quando a IA estiver ativa.</p>
                                </div>
                                
                                <div v-else class="text-left">
                                    <div v-for="(log, index) in realtimeLogs.slice(0, 100)" :key="index" :class="getLogClass(log)" class="mb-0.5 text-left">
                                        <span class="text-gray-500">[{{ log.timestamp }}]</span>
                                        <span class="ml-1">{{ log.icon }}</span>
                                        <span class="ml-1">{{ log.message }}</span>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <!-- Mobile: Cards de Registro -->
                            <div 
                                ref="logsContainerMobile" 
                                class="flex-1 overflow-y-auto custom-scrollbar relative mobile-register-cards" 
                                style="scroll-behavior: smooth; max-height: 500px;"
                            >
                                <div v-if="realtimeLogs.length === 0" class="mobile-register-empty">
                                    <i class="fas fa-info-circle"></i>
                                    <p>Nenhum evento registrado ainda.</p>
                                    <p class="mobile-register-empty-subtitle">Os logs aparecerão aqui em tempo real quando a IA estiver ativa.</p>
                                </div>
                                
                                <div v-else class="mobile-register-cards-container">
                                    <div v-for="(log, index) in realtimeLogs.slice(0, 100)" :key="index" class="mobile-register-card">
                                        <span class="mobile-register-time">{{ log.timestamp }}</span>
                                        <span class="mobile-register-message" :class="getLogClass(log)">{{ log.icon }} {{ log.message }}</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                </div>
            </div>

                <!-- Right Column - Config -->
                <div class="col-span-3 flex">
                    <div id="i0k3nl" class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card h-full flex flex-col w-full ">
                        <h3 class="text-base font-semibold text-zenix-text mb-6 flex items-center text-left">
                            <i class="fas fa-cogs text-zenix-green text-sm mr-2"></i>
                            Configuração Ativa
                        </h3>
                        <div class="flex-1 flex flex-col justify-between text-left">
                            <!-- Estratégia -->
                            <div class="pb-5 border-b border-zenix-border/50 text-left">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-2 tracking-wide uppercase text-left">Estratégia</p>
                                <p class="text-base font-bold text-zenix-text mb-1 text-left">{{ strategyName }}</p>
                                <p class="text-xs text-zenix-secondary text-left">Alta performance • Sinais avançados</p>
                            </div>

                            <!-- Mercado -->
                            <div class="py-5 border-b border-zenix-border/50 text-left">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-2 tracking-wide uppercase text-left">Mercado</p>
                                <p class="text-base font-bold text-zenix-text mb-1 text-left">{{ formattedMarketName }}</p>
                                <p class="text-xs text-zenix-secondary text-left">Ticks de alta frequência</p>
                            </div>

                            <!-- Grid de Parâmetros -->
                            <div class="py-5 border-b border-zenix-border/50 text-left">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-3 tracking-wide uppercase text-left">Parâmetros</p>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="text-left border border-zenix-border/30 rounded-lg p-2.5">
                                        <p class="text-xs text-zenix-secondary mb-0.5 text-left">Entrada</p>
                                        <p class="text-base font-bold text-zenix-text text-left" v-if="!isLoadingConfig">{{ sessionConfig.stakeAmount ? '$' + sessionConfig.stakeAmount.toFixed(2) : '$50' }}</p>
                                        <p class="text-base font-bold text-zenix-text text-left" v-else>Carregando...</p>
                                    </div>
                                    <div class="text-left border border-zenix-border/30 rounded-lg p-2.5">
                                        <p class="text-xs text-zenix-secondary mb-0.5 text-left">Modo</p>
                                        <p class="text-base font-bold text-zenix-text text-left">{{ mode === 'veloz' ? 'Veloz' : mode === 'moderado' ? 'Moderado' : 'Lento' }}</p>
                                    </div>
                                    <div class="text-left border border-zenix-border/30 rounded-lg p-2.5">
                                        <p class="text-xs text-zenix-secondary mb-0.5 text-left">Alvo de Lucro</p>
                                        <p class="text-base font-bold text-zenix-green text-left" v-if="!isLoadingConfig">{{ sessionConfig.profitTarget ? '$' + sessionConfig.profitTarget.toFixed(2) : '$100' }}</p>
                                        <p class="text-base font-bold text-zenix-green text-left" v-else>Carregando...</p>
                                    </div>
                                    <div class="text-left border border-zenix-border/30 rounded-lg p-2.5">
                                        <p class="text-xs text-zenix-secondary mb-0.5 text-left">Limite de Perda</p>
                                        <p class="text-base font-bold text-zenix-red text-left" v-if="!isLoadingConfig">{{ sessionConfig.lossLimit ? '$' + sessionConfig.lossLimit.toFixed(2) : '$25' }}</p>
                                        <p class="text-base font-bold text-zenix-red text-left" v-else>Carregando...</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Gerenciamento -->
                            <div class="py-5 border-b border-zenix-border/50 text-left">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-2 tracking-wide uppercase text-left">Gerenciamento de Risco</p>
                                <div class="flex items-center justify-between">
                                    <div class="text-left">
                                        <p class="text-base font-bold text-zenix-text mb-1 text-left">{{ realRiskLevel }}</p>
                                        <p class="text-xs text-zenix-secondary text-left">Proteção de capital ativa</p>
                                    </div>
                                    <div class="px-3 py-1.5 bg-zenix-green/10 border border-zenix-green/20 rounded-lg">
                                        <p class="text-xs font-bold text-zenix-green">{{ realRiskLabel }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Status da IA -->
                            <div class="pt-5">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-3 tracking-wide uppercase">Status da IA</p>
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-2 h-2 bg-zenix-green rounded-full ai-pulse"></div>
                                        <p class="text-base font-bold text-zenix-green">Ativa</p>
                                    </div>
                                </div>
                                <!-- Botão Pausar -->
                                <button 
                                    class="w-full py-3 bg-zenix-yellow text-black rounded-xl text-sm font-bold hover:bg-[#FFE07A] transition-all flex items-center justify-center pause-btn"
                                    @click="handleDeactivate"
                                    :disabled="isDeactivating"
                                >
                                    <i class="fas fa-pause text-sm"></i>
                                    <span>{{ isDeactivating ? 'Desativando...' : 'Pausar IA' }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Footer -->
            <section class="status-footer-section">
                <div class="premium-card status-footer-card">
                    <div class="status-footer-content">
                        <div class="status-footer-left">
                            <div class="status-footer-icon">
                                <i class="fas fa-robot text-zenix-green text-lg"></i>
                            </div>
                            <div>
                                <h3 class="status-footer-title">IA Operando Normalmente</h3>
                                <p class="status-footer-subtitle">Monitorando sinais de mercado e executando operações conforme estratégia</p>
                            </div>
                        </div>
                        <div class="status-footer-right">
                            <div class="ai-pulse-dot"></div>
                            <span class="status-footer-status text-zenix-green">Online</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';

// TradingView Charting Library - verifique se está disponível globalmente
const TradingView = window.TradingView || null;
const Datafeeds = window.Datafeeds || null;

export default {
    name: 'ZenixTradingDashboard',
    props: {
        ticks: {
            type: Array,
            default: () => []
        },
        currentPrice: {
            type: Number,
            default: null
        },
        entryValueConfig: {
            type: Number,
            default: 0.35
        },
        profitTargetConfig: {
            type: Number,
            default: 100
        },
        lossLimitConfig: {
            type: Number,
            default: 25
        },
        modeConfig: {
            type: String,
            default: 'veloz'
        },
        accountBalanceProp: {
            type: Number,
            default: null
        },
        accountCurrencyProp: {
            type: String,
            default: 'USD'
        },
        selectedMarketProp: {
            type: String,
            default: 'vol10'
        }
    },
    data() {
        return {
            chart: null,
            currentSeries: null,
            chartInitialized: false,
            accountType: 'real',
            chartType: 'candles',
            chartTypeOptions: [
                { label: 'Velas', value: 'candles' },
                { label: 'Linhas', value: 'line' },
            ],
            selectedTimeframe: 300, // 5 minutos (M5) - padrão Médio
            
            // Estatísticas do dia
            dailyStats: {
                profitLoss: 0,
                winrate: 0,
                totalTrades: 0,
                totalVolume: 0,
                wins: 0,
                losses: 0,
                sessionBalance: 0,
                sessionProfitLoss: 0,
                sessionTrades: 0,
                sessionWins: 0,
                sessionLosses: 0,
                sessionWinrate: 0
            },
            isLoadingStats: true,
            statsUpdateInterval: null,
            balance: 18250,
            balanceVisible: true,
            profitVisible: true,
            winrateVisible: true,
            tradesVisible: true,
            aiActive: true,
            showDisconnectModal: false,
            activeTab: 'chart', // 'config', 'chart', 'logs', or 'register'
            showEntryMarkers: true, // Controla visibilidade dos marcadores de entradas da IA
            tradingViewWidget: null, // Widget da TradingView
            
            selectedMarket: null, // Será preenchido do prop ou do histórico de trades
            selectedStrategy: 'orion',
            selectedMode: 'Veloz',
            selectedRisk: 'Conservador', 
            
            tradingModes: ['Veloz', 'Moderado', 'Devagar'],
            riskLevels: ['Fixo', 'Conservador', 'Moderado', 'Agressivo'],
            
            // Configuração real da sessão
            sessionConfig: {
                isActive: false,
                stakeAmount: 0,
                mode: 'veloz',
                modoMartingale: 'conservador',
                profitTarget: null,
                lossLimit: null,
                currency: 'USD',
                sessionBalance: 0,
                sessionStatus: 'active'
            },
            isLoadingConfig: true,
            
            // Log de operações (será carregado via API)
            logOperations: [],
            rawTradeHistory: [], // Dados originais do backend antes da transformação
            isLoadingLogs: true,
            
            // Logs em tempo real (ZENIX v2.0)
            realtimeLogs: [],
            logPollingInterval: null,
            historyPollingInterval: null, // Polling para histórico de operações
            lastLogTimestamp: null, // Timestamp do último log recebido (para detectar novos)
            
            // Estado de desativação
            isDeactivating: false,
            
            // Controle de tamanho do gráfico
            chartPointsVisible: 300, // ✅ AJUSTE: Aumentado para 300 pontos para mostrar mais velas
            chartSizeOptions: [
                { label: 'Pequeno', timeframe: 60, points: 300 },    // M1 - mais detalhado
                { label: 'Médio', timeframe: 300, points: 300 },   // M5 - padrão
                { label: 'Grande', timeframe: 900, points: 300 }    // M15 - menos detalhado
            ],
            timeframeOptions: [
                { label: 'M1', value: 60, points: 300 },
                { label: 'M5', value: 300, points: 300 },
                { label: 'M15', value: 900, points: 300 },
                { label: 'M30', value: 1800, points: 300 },
                { label: 'H1', value: 3600, points: 300 },
                { label: 'H4', value: 14400, points: 300 },
                { label: 'D1', value: 86400, points: 300 }
            ],
            
            // Barra de progresso mobile
            progressState: 1, // 1 = analisando, 2 = ordem aberta, 3 = ordem fechada
            progressInterval: null,
            
            // Status do trade ativo
            activeTrade: null, // Trade ativo atual (null = analisando, objeto = ordem aberta/fechada)
            tradeStatusPollingInterval: null, // Polling para status do trade
            orderClosedTimer: null, // Timer para voltar ao estado "analisando" após 15s quando ordem fechar
        };
    },
    
    computed: {
        // Usar valores reais da sessão ou fallback para props
        entryValue() {
            return this.sessionConfig.stakeAmount || this.entryValueConfig || 0.35;
        },
        profitTarget() {
            return this.sessionConfig.profitTarget || this.profitTargetConfig || null;
        },
        lossLimit() {
            return this.sessionConfig.lossLimit || this.lossLimitConfig || null;
        },
        mode() {
            return this.sessionConfig.mode || this.modeConfig || 'veloz';
        },
        
        // Nome da estratégia baseado no modo
        strategyName() {
            const modeMap = {
                'veloz': 'IA Orion Veloz',
                'moderado': 'IA Orion Moderado',
                'preciso': 'IA Orion Preciso',
                'fast': 'IA Orion Fast'
            };
            return modeMap[this.mode.toLowerCase()] || 'IA Orion';
        },
        
        // Nome do mercado formatado
        formattedMarketName() {
            // Usar o prop primeiro (vem do componente pai)
            const marketKey = this.selectedMarketProp || this.selectedMarket || 'vol10';
            
            const marketMap = {
                'vol10': 'Volatility 10 Index',
                'vol25': 'Volatility 25 Index',
                'vol50': 'Volatility 50 Index',
                'vol75': 'Volatility 75 Index',
                'vol100': 'Volatility 100 Index',
                'vol10_1s': 'Volatility 10 (1s) Index',
                'vol25_1s': 'Volatility 25 (1s) Index',
                'vol50_1s': 'Volatility 50 (1s) Index',
                'vol75_1s': 'Volatility 75 (1s) Index',
                'vol100_1s': 'Volatility 100 (1s) Index',
                'jump10': 'Jump 10 Index',
                'jump25': 'Jump 25 Index',
                'jump50': 'Jump 50 Index',
                'jump75': 'Jump 75 Index',
                'jump100': 'Jump 100 Index'
            };
            
            return marketMap[marketKey] || marketKey;
        },
        
        strategyDescription() {
            const descMap = {
                'veloz': 'Alta Performance',
                'moderado': 'Performance Balanceada',
                'preciso': 'Alta Precisão',
                'fast': 'Operação Contínua'
            };
            return descMap[this.mode.toLowerCase()] || 'Alta Performance';
        },
        
        // Mapear modo_martingale para gerenciamento
        realRiskLevel() {
            if (this.isLoadingConfig) return 'Carregando...';
            const martingale = this.sessionConfig.modoMartingale || 'conservador';
            const riskMap = {
                'conservador': 'Conservador',
                'moderado': 'Moderado',
                'agressivo': 'Agressivo'
            };
            return riskMap[martingale.toLowerCase()] || 'Conservador';
        },
        
        realRiskLabel() {
            const risk = this.realRiskLevel;
            const labels = {
                'Conservador': 'Baixo',
                'Moderado': 'Médio',
                'Agressivo': 'Alto'
            };
            return labels[risk] || 'Baixo';
        },
        
        realRiskPercentage() {
            const risk = this.realRiskLevel;
            const percentages = {
                'Conservador': '25%',
                'Moderado': '50%',
                'Agressivo': '75%'
            };
            return percentages[risk] || '25%';
        },
        
        realEstimatedRiskLabel() {
            const balance = this.accountBalanceProp || 10000;
            const entryValue = this.entryValue || 0.35;
            
            if (!balance || balance <= 0) {
                return '0.00% do capital';
            }
            
            const riskPercent = (entryValue / balance) * 100;
            return `${riskPercent.toFixed(2)}% do capital`;
        },
        
        // Estatísticas formatadas
        formattedProfitLoss() {
            const value = this.dailyStats.profitLoss || 0;
            const sign = value >= 0 ? '+' : '';
            return `${sign}$${Math.abs(value).toFixed(2)}`;
        },
        profitLossPercentage() {
            // Calcular percentual baseado no volume total
            const volume = this.dailyStats.totalVolume || 1;
            const percentage = (this.dailyStats.profitLoss / volume) * 100;
            const sign = percentage >= 0 ? '+' : '';
            return `${sign}${percentage.toFixed(2)}%`;
        },
        formattedWinrate() {
            return `${this.dailyStats.winrate.toFixed(0)}%`;
        },
        winrateLabel() {
            const wr = this.dailyStats.winrate;
            if (wr >= 70) return 'Excelente';
            if (wr >= 60) return 'Ótimo';
            if (wr >= 50) return 'Bom';
            return 'Regular';
        },
        formattedSessionWinrate() {
            return `${this.dailyStats.sessionWinrate.toFixed(0)}%`;
        },
        sessionWinrateLabel() {
            const wr = this.dailyStats.sessionWinrate;
            if (wr >= 70) return 'Excelente';
            if (wr >= 60) return 'Ótimo';
            if (wr >= 50) return 'Bom';
            return 'Regular';
        },
        formattedVolume() {
            return `$${this.dailyStats.totalVolume.toFixed(2)}`;
        },
        formattedSessionProfitLoss() {
            const value = this.dailyStats.sessionProfitLoss || 0;
            const sign = value >= 0 ? '+' : '';
            return `${sign}$${Math.abs(value).toFixed(2)}`;
        },
        formattedSessionBalance() {
            const value = this.dailyStats.sessionBalance || 0;
            const sign = value >= 0 ? '+' : '';
            return `${sign}$${Math.abs(value).toFixed(2)}`;
        },
        profitLossClass() {
            return this.dailyStats.profitLoss >= 0 ? 'text-zenix-green' : 'text-zenix-red';
        },
        sessionProfitLossClass() {
            return this.dailyStats.sessionProfitLoss >= 0 ? 'text-zenix-green' : 'text-zenix-red';
        },
        sessionBalanceClass() {
            return this.dailyStats.sessionBalance >= 0 ? 'text-zenix-green' : 'text-zenix-red';
        },
        
        // Risco estimado por operação
        estimatedRiskPercentage() {
            const balance = this.accountBalanceProp || 10000; // Fallback se não tiver saldo
            const entryValue = this.entryValue || 0.35;
            
            if (!balance || balance <= 0) {
                return 0;
            }
            
            const riskPercent = (entryValue / balance) * 100;
            return riskPercent.toFixed(2);
        },
        
        estimatedRiskLabel() {
            return `${this.estimatedRiskPercentage}% do capital`;
        },
        
        displayBalance() {
            const formatter = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            return this.balanceVisible ? `$${formatter.format(this.balance)}` : '••••••';
        },
        
        riskLabel() {
            const labels = {
                'Fixo': 'Fixo',
                'Conservador': 'Baixo',
                'Moderado': 'Médio',
                'Agressivo': 'Alto'
            };
            return labels[this.selectedRisk] || 'Baixo';
        },
        
        riskPercentage() {
            const percentages = {
                'Fixo': '10%',
                'Conservador': '25%', 
                'Moderado': '50%',
                'Agressivo': '75%'
            };
            return percentages[this.selectedRisk] || '25%';
        },
        
        riskDescription() {
            const descriptions = {
                'Fixo': 'Valor fixo por operação sem variação',
                'Conservador': 'Proteção máxima do capital com crescimento estável',
                'Moderado': 'Equilíbrio entre risco e retorno',
                'Agressivo': 'Maior exposição para potencial de ganhos elevados'
            };
            return descriptions[this.selectedRisk] || 'Proteção máxima do capital com crescimento estável';
        },


        // Formatted balance
        currentStatusTitle() {
            // Status 2: Ordem aberta (quando há trade com status ACTIVE)
            if (this.activeTrade && this.activeTrade.status === 'ACTIVE') {
                return 'Ordem aberta';
            }
            // Status 3: Ordem fechada (quando ordem acabou de fechar - exibido por 15s se orderClosedTimer estiver ativo)
            if (this.activeTrade && (this.activeTrade.status === 'WON' || this.activeTrade.status === 'LOST') && this.orderClosedTimer !== null) {
                return 'Ordem fechada';
            }
            // Status 1: Analisando (quando não há trade ativo ou ordem fechada já passou dos 15s)
            return 'Analisando...';
        },
        currentStatusDescription() {
            // Status 2: Ordem aberta
            if (this.activeTrade && this.activeTrade.status === 'ACTIVE') {
                return 'Aguardando resultado';
            }
            // Status 3: Ordem fechada
            if (this.activeTrade && (this.activeTrade.status === 'WON' || this.activeTrade.status === 'LOST') && this.orderClosedTimer !== null) {
                const result = this.activeTrade.status === 'WON' ? 'Ganhou' : 'Perdeu';
                const profit = this.activeTrade.profitLoss || 0;
                return `${result} ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`;
            }
            // Status 1: Analisando
            return 'Buscando oportunidades';
        },
        formattedBalance() {
            if (!this.accountBalanceProp) return '$0,00';
            const formatter = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            return `$${formatter.format(this.accountBalanceProp)}`;
        },

        // Profit percentage
        profitPercentage() {
            if (!this.accountBalanceProp || this.accountBalanceProp <= 0) return null;
            const profit = this.dailyStats.sessionProfitLoss || 0;
            const percentage = (profit / this.accountBalanceProp) * 100;
            const sign = percentage >= 0 ? '+' : '';
            return `${sign}${percentage.toFixed(2)}%`;
        },
        
        // Check if profit is positive
        isProfitPositive() {
            if (!this.accountBalanceProp || this.accountBalanceProp <= 0) return true;
            const profit = this.dailyStats.sessionProfitLoss || 0;
            return profit >= 0;
        },

        // Last update time
        // Transformar dados do backend para o formato esperado pelo OperationLogs
        formattedTradeResults() {
            // Usar dados originais do backend se disponíveis, senão usar logOperations transformado
            if (!this.rawTradeHistory || this.rawTradeHistory.length === 0) {
                return [];
            }
            
            // O backend retorna dados em camelCase: entryPrice, exitPrice, stakeAmount, etc.
            return this.rawTradeHistory.map((trade, index) => {
                // IDs únicos
                const contractId = trade.id || `trade-${trade.createdAt || Date.now()}-${index}`;
                
                // Valores numéricos (o backend já retorna parseFloat, mas garantimos)
                const stakeAmount = parseFloat(trade.stakeAmount) || 0;
                const exitPrice = trade.exitPrice != null ? parseFloat(trade.exitPrice) : null;
                const profitLoss = trade.profitLoss != null ? parseFloat(trade.profitLoss) : null;
                
                // Direção (signal ou contractType)
                const direction = (trade.signal || trade.contractType || 'CALL').toUpperCase();
                
                // Status
                const status = trade.status || (profitLoss != null ? 'CLOSED' : 'PENDING');
                
                // Converter timestamp para epoch (em segundos)
                let time = Math.floor(Date.now() / 1000);
                if (trade.createdAt) {
                    const date = new Date(trade.createdAt);
                    time = Math.floor(date.getTime() / 1000);
                }
                
                const entryPrice = trade.entryPrice != null ? parseFloat(trade.entryPrice) : null;
                
                return {
                    contractId: contractId,
                    id: contractId,
                    // buyPrice deve ser o stakeAmount (valor investido), não o entryPrice
                    buyPrice: stakeAmount,
                    price: stakeAmount,
                    direction: direction,
                    type: direction,
                    profit: profitLoss,
                    profitLoss: profitLoss,
                    exitTick: exitPrice != null ? exitPrice.toFixed(2) : null,
                    sellPrice: exitPrice,
                    closePrice: exitPrice,
                    entryPrice: entryPrice,
                    exitPrice: exitPrice,
                    symbol: trade.symbol || 'R_10',
                    status: status,
                    time: time,
                    stakeAmount: stakeAmount,
                    createdAt: trade.createdAt,
                    closedAt: trade.closedAt
                };
            });
        },
        
        formattedLastUpdate() {
            // 🕐 TIMESTAMP NO HORÁRIO DE BRASÍLIA (UTC-3)
            if (!this.currentPrice || this.ticks.length === 0) {
                return new Date().toLocaleTimeString('pt-BR', { 
                    timeZone: 'America/Sao_Paulo',
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                });
            }
            return new Date().toLocaleTimeString('pt-BR', { 
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false
            });
        },
        
        progressText() {
            const texts = {
                1: 'Analisando o mercado',
                2: 'Ordem aberta',
                3: 'Ordem fechada'
            };
            return texts[this.progressState] || texts[1];
        }
    },
    
    methods: {
        // Formatar valor PnL para colocar sinal negativo antes do $
        formatPnlValue(pnl) {
            if (!pnl) return '$0.00';
            // Se já começa com +, retornar como está
            if (pnl.startsWith('+')) return pnl;
            // Se tem $ seguido de -, formatar para -$valor
            if (pnl.includes('$-')) {
                return pnl.replace('$-', '-$');
            }
            // Se começa com -$, já está correto
            if (pnl.startsWith('-$')) return pnl;
            // Se começa com $ mas não tem sinal, verificar se é negativo
            if (pnl.startsWith('$')) {
                const value = parseFloat(pnl.replace('$', '').replace('+', ''));
                if (value < 0) {
                    return '-$' + Math.abs(value).toFixed(2);
                }
            }
            return pnl;
        },
        // ============================================
        // SISTEMA DE LOGS EM TEMPO REAL - ZENIX v2.0
        // ============================================
        
        /**
         * Adiciona um log ao histórico em tempo real
         * @param {string} type - Tipo do log (info, tick, analise, sinal, operacao, resultado, alerta, erro)
         * @param {string} message - Mensagem do log
         */
        addLog(type, message) {
            const icons = {
                info: 'ℹ️',
                tick: '📥',
                analise: '🔍',
                sinal: '🎯',
                operacao: '💰',
                resultado: '✅',
                alerta: '⚠️',
                erro: '🚫'
            };
            
            // 🕐 TIMESTAMP NO HORÁRIO DE BRASÍLIA (UTC-3)
            const now = new Date();
            const timestamp = now.toLocaleTimeString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            
            const newLog = {
                timestamp,
                type,
                icon: icons[type] || 'ℹ️',
                message
            };
            
            // ✅ Adicionar no INÍCIO do array (topo) - logs mais novos no topo
            // Vue 3: reatividade automática, não precisa de $set
            // Limitar a 100 logs para performance
            this.realtimeLogs = [newLog, ...this.realtimeLogs].slice(0, 100);
            
            // ✅ Auto-scroll para o topo apenas se o usuário já estiver no topo
            this.$nextTick(() => {
                // Desktop: lista simples
                const container = this.$refs.logsContainer;
                if (container) {
                    // Se está no topo (ou próximo - margem de 50px), manter no topo
                    if (container.scrollTop <= 50) {
                        container.scrollTop = 0;
                    }
                }
                // Mobile: cards
                const containerMobile = this.$refs.logsContainerMobile;
                if (containerMobile) {
                    // Se está no topo (ou próximo - margem de 50px), manter no topo
                    if (containerMobile.scrollTop <= 50) {
                        containerMobile.scrollTop = 0;
                    }
                }
            });
        },
        
        /**
         * Retorna a classe CSS baseada no tipo do log
         */
        getLogClass(log) {
            const colors = {
                info: 'text-blue-400',
                tick: 'text-gray-400',
                analise: 'text-purple-400',
                sinal: 'text-yellow-400',
                operacao: 'text-cyan-400',
                resultado: 'text-green-400',
                alerta: 'text-orange-400',
                erro: 'text-red-500'
            };
            
            return colors[log.type] || 'text-gray-400';
        },
        
        /**
         * Retorna a classe CSS para mensagem de log no mobile baseado no conteúdo
         */
        getMobileLogMessageClass(log) {
            const message = log.message || '';
            const lowerMessage = message.toLowerCase();
            
            // Verde para ganho/vitória/sucesso
            if (lowerMessage.includes('ganho') || 
                lowerMessage.includes('ganhou') || 
                lowerMessage.includes('vitória') || 
                lowerMessage.includes('vitoria') ||
                lowerMessage.includes('lucro') ||
                lowerMessage.startsWith('+')) {
                return 'mobile-log-success';
            }
            
            // Vermelho para perda/derrota/erro
            if (lowerMessage.includes('perda') || 
                lowerMessage.includes('perdeu') || 
                lowerMessage.includes('derrota') ||
                lowerMessage.includes('erro') ||
                lowerMessage.startsWith('-')) {
                return 'mobile-log-error';
            }
            
            // Cor padrão baseada no tipo
            if (log.type === 'resultado') {
                return 'mobile-log-success';
            }
            
            if (log.type === 'erro') {
                return 'mobile-log-error';
            }
            
            return 'mobile-log-default';
        },
        
        /**
         * Exporta logs como arquivo de texto
         */
        exportLogs() {
            if (this.realtimeLogs.length === 0) return;
            
            const text = this.realtimeLogs.map(log => {
                return `[${log.timestamp}] ${log.icon} ${log.message}`;
            }).join('\n');
            
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zenix-logs-${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addLog('info', '📥 Logs exportados com sucesso');
        },
        
        /**
         * Limpa todos os logs (frontend e backend)
         */
        async clearLogs() {
            try {
                // Buscar userId do token
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('[InvestmentActive] ❌ Token não encontrado');
                    return;
                }
                
                // Decodificar JWT para pegar userId
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.sub;
                
                if (!userId) {
                    console.error('[InvestmentActive] ❌ UserId não encontrado no token');
                    return;
                }
                
                // Construir URL da API
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const url = `${apiBase}/ai/logs/${userId}`;
                
                console.log('[InvestmentActive] 🗑️ Deletando logs em:', url);
                
                // Deletar logs do backend
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('[InvestmentActive] ✅ Logs deletados do backend:', result.message);
                } else {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    console.error('[InvestmentActive] ❌ Erro ao deletar logs do backend:', errorData.message || response.statusText);
                }
                
                // Limpar logs do frontend
                this.realtimeLogs = [];
                this.lastLogTimestamp = null;
                
                console.log('[InvestmentActive] ✅ Logs limpos (frontend e backend)');
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao limpar logs:', error);
                // Mesmo com erro, limpar frontend
                this.realtimeLogs = [];
                this.lastLogTimestamp = null;
            }
        },
        
        /**
         * Log de inicialização do sistema
         */
        logSystemInit() {
            this.realtimeLogs = []; // Limpar sem chamar clearLogs() para evitar loop
            this.lastLogTimestamp = null; // Resetar timestamp
            this.addLog('info', '✨ SISTEMA ZENIX v2.0 INICIADO');
            this.addLog('info', '📋 CONFIGURAÇÃO ATIVA:');
            this.addLog('info', `Modo: ${this.sessionConfig.mode ? this.sessionConfig.mode.toUpperCase() : 'VELOZ'}`);
            this.addLog('info', `Entrada: $${this.sessionConfig.stakeAmount ? this.sessionConfig.stakeAmount.toFixed(2) : '0.50'}`);
            this.addLog('info', `Martingale: ${this.sessionConfig.modoMartingale ? this.sessionConfig.modoMartingale.toUpperCase() : 'AGRESSIVO'}`);
            this.addLog('info', `Alvo de Lucro: $${this.sessionConfig.profitTarget || 25}`);
            this.addLog('info', `Limite de Perda: $${this.sessionConfig.lossLimit || 20}`);
            this.addLog('info', '🔌 Conectado à Deriv API (R_10)');
            this.addLog('info', '📡 Sistema operacional. Aguardando operações reais...');
            
            // Iniciar polling de logs do backend
            this.startLogPolling();
        },
        
        /**
         * Inicia polling de logs do backend
         */
        async fetchRealtimeLogs() {
            try {
                console.log('[InvestmentActive] 🔄 fetchRealtimeLogs chamado');
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentActive] ⚠️ UserId não disponível para buscar logs');
                    return;
                }
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const url = `${apiBase}/ai/logs/${userId}`;
                
                console.log('[InvestmentActive] 📡 Buscando logs em:', url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    console.warn('[InvestmentActive] ⚠️ Erro ao buscar logs:', response.status, response.statusText);
                    return;
                }
                
                const result = await response.json();
                if (result.success && result.data && Array.isArray(result.data)) {
                    console.log('[InvestmentActive] 📥 Logs recebidos do backend:', result.data.length, 'logs');
                    // Converter logs recebidos
                    // ✅ INCLUIR id e created_at PARA COMPARAÇÃO CORRETA
                    const newLogs = result.data.map(log => ({
                        id: log.id,
                        timestamp: log.timestamp,
                        created_at: log.created_at,
                        type: log.type,
                        icon: log.icon,
                        message: log.message
                    }));
                    
                    // ✅ Se é a primeira carga, substituir tudo
                    // Backend retorna em ordem DESC (mais novos primeiro), então não precisa inverter
                    if (this.realtimeLogs.length === 0 || !this.lastLogTimestamp) {
                        // Backend já retorna mais novos primeiro, então usar direto
                        // Vue 3: reatividade automática, não precisa de $set
                        this.realtimeLogs = newLogs;
                        if (this.realtimeLogs.length > 0) {
                            // ✅ Usar created_at para comparação (mais preciso que timestamp formatado)
                            this.lastLogTimestamp = this.realtimeLogs[0].created_at || this.realtimeLogs[0].timestamp;
                        }
                        console.log('[InvestmentActive] 📊 Primeira carga:', this.realtimeLogs.length, 'logs');
                        
                        // Scroll para o topo (onde estão os logs mais novos)
                        this.$nextTick(() => {
                            const container = this.$refs.logsContainer;
                            if (container) {
                                container.scrollTop = 0;
                            }
                            const containerMobile = this.$refs.logsContainerMobile;
                            if (containerMobile) {
                                containerMobile.scrollTop = 0;
                            }
                        });
                    } else {
                        // ✅ Adicionar apenas logs novos (comparar por ID ou created_at)
                        // Usar ID se disponível, senão usar created_at
                        const existingIds = new Set(this.realtimeLogs.map(log => log.id || log.created_at || log.timestamp));
                        const logsToAdd = newLogs.filter(log => {
                            const logId = log.id || log.created_at || log.timestamp;
                            return !existingIds.has(logId);
                        });
                        
                        console.log('[InvestmentActive] 🔍 Verificando novos logs:', {
                            totalRecebidos: newLogs.length,
                            jaExistem: this.realtimeLogs.length,
                            novos: logsToAdd.length,
                            idsExistentes: Array.from(existingIds).slice(0, 5),
                            idsNovos: logsToAdd.map(l => l.id || l.created_at || l.timestamp).slice(0, 5)
                        });
                        
                        if (logsToAdd.length > 0) {
                            // Verificar se usuário está no topo (vendo logs mais novos)
                            const container = this.$refs.logsContainer;
                            const containerMobile = this.$refs.logsContainerMobile;
                            const isAtTop = container && container.scrollTop <= 50;
                            const isAtTopMobile = containerMobile && containerMobile.scrollTop <= 50;
                            
                            // ✅ FORÇAR REATIVIDADE DO VUE: Criar novo array
                            // Adicionar novos logs no INÍCIO do array (topo)
                            // Backend já retorna mais novos primeiro, então usar direto
                            // Vue 3: reatividade automática, não precisa de $set
                            this.realtimeLogs = [...logsToAdd, ...this.realtimeLogs];
                            
                            // Atualizar timestamp do último log (usar created_at se disponível)
                            this.lastLogTimestamp = this.realtimeLogs[0].created_at || this.realtimeLogs[0].timestamp;
                            
                            console.log('[InvestmentActive] ✅ Adicionados', logsToAdd.length, 'novos logs. Total agora:', this.realtimeLogs.length);
                            
                            // Se estava no topo, manter no topo
                            this.$nextTick(() => {
                                if (container && isAtTop) {
                                    container.scrollTop = 0;
                                }
                                if (containerMobile && isAtTopMobile) {
                                    containerMobile.scrollTop = 0;
                                }
                            });
                        } else {
                            console.log('[InvestmentActive] ℹ️ Nenhum log novo para adicionar');
                        }
                    }
                }
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao buscar logs:', error);
            }
        },
        
        startLogPolling() {
            // Parar polling anterior se existir
            this.stopLogPolling();
            
            console.log('[InvestmentActive] 🚀 Iniciando polling de logs (a cada 2s)');
            
            // Buscar logs a cada 2 segundos
            this.logPollingInterval = setInterval(() => {
                // Verificar se IA está ativa (pode ser 1 ou true)
                const isActive = this.sessionConfig.isActive === 1 || this.sessionConfig.isActive === true;
                if (isActive) {
                    this.fetchRealtimeLogs();
                } else {
                    console.log('[InvestmentActive] ⏸️ IA não está ativa, parando polling...');
                    this.stopLogPolling();
                }
            }, 2000);
            
            // Buscar logs imediatamente na primeira vez
            this.fetchRealtimeLogs();
        },
        
        stopLogPolling() {
            if (this.logPollingInterval) {
                console.log('[InvestmentActive] ⏹️ Parando polling de logs...');
                clearInterval(this.logPollingInterval);
                this.logPollingInterval = null;
            }
        },
        
        /**
         * Inicia polling de histórico de operações (a cada 1 minuto)
         */
        startHistoryPolling() {
            // Parar polling anterior se existir
            this.stopHistoryPolling();
            
            console.log('[InvestmentActive] 🚀 Iniciando polling de histórico (a cada 1 minuto)');
            
            // Buscar histórico a cada 1 minuto (60000ms)
            this.historyPollingInterval = setInterval(() => {
                // Verificar se IA está ativa
                const isActive = this.sessionConfig.isActive === 1 || this.sessionConfig.isActive === true;
                if (isActive) {
                    this.fetchTradeHistory();
                } else {
                    console.log('[InvestmentActive] ⏸️ IA não está ativa, parando polling de histórico...');
                    this.stopHistoryPolling();
                }
            }, 60000); // 1 minuto = 60000ms
            
            // Buscar histórico imediatamente na primeira vez
            this.fetchTradeHistory();
        },
        
        stopHistoryPolling() {
            if (this.historyPollingInterval) {
                console.log('[InvestmentActive] ⏹️ Parando polling de histórico...');
                clearInterval(this.historyPollingInterval);
                this.historyPollingInterval = null;
            }
        },
        
        
        /**
         * Simula log de análise completa (será substituído por dados reais do backend via WebSocket)
         */
        logAnaliseCompleta(analise) {
            this.addLog('analise', 'ANÁLISE INICIADA');
            this.addLog('analise', `Distribuição: PAR: ${analise.percPar}% | ÍMPAR: ${analise.percImpar}%`);
            this.addLog('analise', `Desequilíbrio: ${analise.desequilibrio}% ${analise.ladoDeseq} ${analise.desequilibrioOK ? '✅' : '❌'}`);
            this.addLog('analise', '🔢 ANÁLISE 1: Desequilíbrio Base');
            this.addLog('analise', `${analise.ladoDeseq}: ${analise.desequilibrio}% → Operar ${analise.operacao}`);
            this.addLog('analise', `Confiança base: ${analise.confiancaBase}%`);
            this.addLog('analise', '🔁 ANÁLISE 2: Sequências Repetidas');
            this.addLog('analise', `Maior sequência: ${analise.sequencia} ticks ${analise.sequencia >= 5 ? '✅' : '❌'}`);
            this.addLog('analise', `Bônus: +${analise.bonusSeq}%`);
            this.addLog('analise', '📈 ANÁLISE 3: Micro-Tendências');
            this.addLog('analise', `Aceleração: ${analise.aceleracao}% ${analise.aceleracao > 10 ? '✅' : '❌'}`);
            this.addLog('analise', `Bônus: +${analise.bonusMicro}%`);
            this.addLog('analise', '⚡ ANÁLISE 4: Força do Desequilíbrio');
            this.addLog('analise', `Velocidade: ${analise.velocidade}% ${analise.velocidade > 5 ? '✅' : '❌'}`);
            this.addLog('analise', `Bônus: +${analise.bonusForca}%`);
            this.addLog('analise', '🎯 CONFIANÇA FINAL');
            this.addLog('analise', `Total: ${analise.confiancaFinal}% (limite: 95%)`);
            this.addLog('analise', `${analise.confiancaOK ? '✅' : '❌'} ${analise.confiancaFinal}% ${analise.confiancaOK ? '≥' : '<'} ${analise.confianciaMin}%`);
            
            if (analise.confiancaOK) {
                this.addLog('sinal', '✅ SINAL GERADO');
                this.addLog('sinal', `Direção: ${analise.operacao}`);
                this.addLog('sinal', `Confiança: ${analise.confiancaFinal}%`);
            } else {
                this.addLog('analise', '❌ Confiança insuficiente. Aguardando...');
            }
        },
        
        /**
         * Log de operação executada
         */
        logOperacaoExecutada(op) {
            this.addLog('operacao', `🎯 EXECUTANDO OPERAÇÃO #${op.numero}${op.martingale ? ' (MARTINGALE)' : ''}`);
            this.addLog('operacao', `Ativo: ${op.ativo}`);
            this.addLog('operacao', `Direção: ${op.direcao}`);
            this.addLog('operacao', `Valor: $${op.valor.toFixed(2)}`);
            this.addLog('operacao', `Payout: 0.95 (95%)`);
            this.addLog('operacao', `Lucro esperado: $${(op.valor * 0.95).toFixed(2)}`);
            
            if (op.martingale) {
                this.addLog('operacao', `Martingale: SIM (entrada ${op.entradaMartingale})`);
                this.addLog('operacao', `Objetivo: Recuperar $${op.perdaAcumulada.toFixed(2)}`);
            } else {
                this.addLog('operacao', `Martingale: NÃO (operação normal)`);
            }
            
            this.addLog('operacao', `Status: Aguardando resultado...`);
        },
        
        /**
         * Log de resultado da operação
         */
        logResultadoOperacao(resultado) {
            const vitoria = resultado.status === 'WON';
            
            this.addLog('resultado', vitoria ? '🎉 VITÓRIA!' : '❌ DERROTA');
            this.addLog('resultado', `Operação #${resultado.numero}: ${resultado.direcao}`);
            this.addLog('resultado', `Resultado: ${resultado.digitoSaida} (${resultado.paridadeSaida}) ${vitoria ? '✅' : '❌'}`);
            this.addLog('resultado', `Investido: -$${resultado.investido.toFixed(2)}`);
            this.addLog('resultado', `Retorno: +$${vitoria ? resultado.retorno.toFixed(2) : '0.00'}`);
            this.addLog('resultado', `${vitoria ? 'Lucro' : 'Perda'}: ${vitoria ? '+' : ''}$${resultado.lucro.toFixed(2)}`);
            this.addLog('resultado', `Capital: $${resultado.capitalAntes.toFixed(2)} → $${resultado.capitalDepois.toFixed(2)}`);
            this.addLog('resultado', `ROI sessão: ${resultado.roi >= 0 ? '+' : ''}${resultado.roi.toFixed(2)}%`);
            this.addLog('resultado', `Vitórias: ${resultado.vitorias} | Derrotas: ${resultado.derrotas}`);
            this.addLog('resultado', `Taxa acerto: ${resultado.taxaAcerto.toFixed(1)}%`);
            
            if (vitoria && resultado.martingaleAtivo) {
                this.addLog('resultado', `Recuperação: +$${resultado.perdaRecuperada.toFixed(2)}`);
                this.addLog('resultado', `🔄 MARTINGALE RESETADO`);
            } else if (!vitoria) {
                this.addLog('resultado', `Perda acumulada: -$${resultado.perdaAcumulada.toFixed(2)}`);
                this.addLog('resultado', `🔄 MARTINGALE ATIVADO (${resultado.modoMartingale.toUpperCase()})`);
                this.addLog('resultado', `Próxima aposta: $${resultado.proximaAposta.toFixed(2)}`);
            }
            
            this.addLog('info', '');
        },
        
        async fetchDailyStats() {
            try {
                console.log('[InvestmentActive] 📊 Buscando estatísticas do dia...');
                
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentActive] ❌ UserId não disponível para buscar stats');
                    this.isLoadingStats = false;
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const url = `${apiBase}/ai/session-stats/${userId}`;
                
                console.log('[InvestmentActive] 📡 Requisitando stats:', url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                console.log('[InvestmentActive] 📥 Status HTTP:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('[InvestmentActive] 📦 Stats recebidas:', result);
                
                if (result.success && result.data) {
                    this.dailyStats = {
                        profitLoss: parseFloat(result.data.profitLoss) || 0,
                        winrate: parseFloat(result.data.winrate) || 0,
                        totalTrades: parseInt(result.data.totalTrades) || 0,
                        totalVolume: parseFloat(result.data.totalVolume) || 0,
                        wins: parseInt(result.data.wins) || 0,
                        losses: parseInt(result.data.losses) || 0,
                        sessionBalance: parseFloat(result.data.sessionBalance) || 0,
                        sessionProfitLoss: parseFloat(result.data.sessionProfitLoss) || 0,
                        sessionTrades: parseInt(result.data.sessionTrades) || 0,
                        sessionWins: parseInt(result.data.sessionWins) || 0,
                        sessionLosses: parseInt(result.data.sessionLosses) || 0,
                        sessionWinrate: parseFloat(result.data.sessionWinrate) || 0
                    };
                    
                    console.log('[InvestmentActive] ✅ Stats atualizadas:', this.dailyStats);
                } else {
                    console.error('[InvestmentActive] ❌ Formato de resposta inválido:', result);
                }
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao buscar estatísticas:', error);
            } finally {
                this.isLoadingStats = false;
            }
        },
        
        startStatsUpdates() {
            // Buscar estatísticas imediatamente
            this.fetchDailyStats();
            
            // Buscar configuração da sessão
            this.fetchSessionConfig();
            
            // Atualizar a cada 10 segundos
            this.statsUpdateInterval = setInterval(() => {
                this.fetchDailyStats();
                // Atualizar configuração também (pode ter mudado)
                this.fetchSessionConfig();
            }, 10000);
            
            console.log('[InvestmentActive] ⏰ Atualizações de stats iniciadas');
        },
        
        stopStatsUpdates() {
            if (this.statsUpdateInterval) {
                clearInterval(this.statsUpdateInterval);
                this.statsUpdateInterval = null;
                console.log('[InvestmentActive] ⏹️ Atualizações de stats paradas');
            }
        },
        
        toggleAI() {
            this.aiActive = !this.aiActive;
        },
        
        disconnect() {
            console.log('Desconectando da Deriv...');
            this.aiActive = false;
            this.showDisconnectModal = false;
        },

        async handleDeactivate() {
            try {
                this.isDeactivating = true;
                console.log('[InvestmentActive] 🛑 Desativando IA...');
                
                // Emitir evento para o componente pai desativar a IA
                this.$emit('deactivate');
                
                // Aguardar um pouco para dar feedback visual
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao desativar IA:', error);
            } finally {
                this.isDeactivating = false;
            }
        },

        // 📊 Buscar configuração da sessão ativa
        async fetchSessionConfig() {
            try {
                this.isLoadingConfig = true;
                console.log('[InvestmentActive] 📊 Buscando configuração da sessão...');
                
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentActive] ❌ UserId não disponível');
                    this.isLoadingConfig = false;
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const url = `${apiBase}/ai/config/${userId}`;
                
                console.log('[InvestmentActive] 📡 Requisitando config:', url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('[InvestmentActive] 📦 Config recebida:', result);
                
                if (result.success && result.data) {
                    this.sessionConfig = {
                        isActive: result.data.isActive || false,
                        stakeAmount: parseFloat(result.data.stakeAmount) || 0,
                        mode: result.data.mode || 'veloz',
                        modoMartingale: result.data.modoMartingale || 'conservador',
                        profitTarget: result.data.profitTarget ? parseFloat(result.data.profitTarget) : null,
                        lossLimit: result.data.lossLimit ? parseFloat(result.data.lossLimit) : null,
                        currency: result.data.currency || 'USD',
                        sessionBalance: parseFloat(result.data.sessionBalance) || 0,
                        sessionStatus: result.data.sessionStatus || 'active'
                    };
                    
                    console.log('[InvestmentActive] ✅ Config atualizada:', this.sessionConfig);
                    
                    // ✅ Se IA está ativa, garantir que polling está rodando
                    const isActive = this.sessionConfig.isActive === 1 || this.sessionConfig.isActive === true;
                    if (isActive) {
                        console.log('[InvestmentActive] ✅ IA está ativa, verificando polling...');
                        // Se logs estão vazios, inicializar
                        if (this.realtimeLogs.length === 0) {
                            console.log('[InvestmentActive] 📋 Logs vazios, inicializando...');
                            this.logSystemInit();
                        } else {
                            // Se já tem logs mas polling não está rodando, iniciar
                            if (!this.logPollingInterval) {
                                console.log('[InvestmentActive] 🔄 Reiniciando polling de logs...');
                                this.startLogPolling();
                            } else {
                                console.log('[InvestmentActive] ✅ Polling já está rodando');
                            }
                        }
                    } else {
                        // Se IA não está ativa, parar polling
                        console.log('[InvestmentActive] ⏸️ IA não está ativa, parando polling...');
                        this.stopLogPolling();
                    }
                } else {
                    console.error('[InvestmentActive] ❌ Formato de resposta inválido:', result);
                }
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao buscar configuração:', error);
            } finally {
                this.isLoadingConfig = false;
            }
        },
        
        // 📊 Buscar histórico de operações reais
        async fetchTradeHistory() {
            try {
                this.isLoadingLogs = true;
                console.log('[InvestmentActive] 📊 Buscando histórico de operações...');
                
                // Obter userId
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentActive] ❌ UserId não disponível');
                    this.isLoadingLogs = false;
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const url = `${apiBase}/ai/trade-history/${userId}?limit=20`;
                
                console.log('[InvestmentActive] 📡 Fazendo requisição para:', url);
                console.log('[InvestmentActive] 🔑 UserId:', userId);
                console.log('[InvestmentActive] 🔐 Token presente?', !!localStorage.getItem('token'));
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                console.log('[InvestmentActive] 📥 Status HTTP:', response.status);
                console.log('[InvestmentActive] 📥 Response OK?', response.ok);

                const result = await response.json();
                console.log('[InvestmentActive] 📦 Resultado completo:', result);
                if (result.success && result.data) {
                    console.log('[InvestmentActive] ✅ Histórico recebido:', result.data.length, 'operações');
                    console.log('[InvestmentActive] 📊 Dados recebidos:', result.data);
                    
                    // Armazenar dados originais para uso no OperationLogs
                    this.rawTradeHistory = result.data;
                    
                    // Transformar dados do backend para o formato do frontend
                    const defaultStakeAmount = this.sessionConfig.stakeAmount || this.entryValue || 0;
                    console.log('[InvestmentActive] 📊 Dados recebidos do backend:', result.data);
                    this.logOperations = result.data.map(trade => {
                        console.log('[InvestmentActive] 🔍 Trade:', {
                            id: trade.id,
                            entryPrice: trade.entryPrice,
                            exitPrice: trade.exitPrice,
                            status: trade.status
                        });
                        // Usar closedAt ou createdAt para o horário (priorizar closedAt)
                        // 🕐 TIMESTAMP NO HORÁRIO DE BRASÍLIA (UTC-3)
                        const tradeDate = new Date(trade.closedAt || trade.createdAt);
                        const time = tradeDate.toLocaleTimeString('pt-BR', {
                            timeZone: 'America/Sao_Paulo',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        });
                        // Salvar timestamp para plotagem no gráfico
                        const timestamp = Math.floor(tradeDate.getTime() / 1000);
                        
                        // signal pode ser 'CALL' ou 'PUT', contractType também
                        const direction = (trade.signal || trade.contractType || 'CALL').toUpperCase();
                        
                        // profitLoss é o lucro/prejuízo (pode ser null se ainda não finalizou)
                        const profit = parseFloat(trade.profitLoss || 0);
                        const pnl = profit >= 0 ? `+$${profit.toFixed(2)}` : `$${profit.toFixed(2)}`;
                        
                        // Investimento (stakeAmount) - usar do trade ou do default
                        const investment = parseFloat(trade.stakeAmount || defaultStakeAmount || 0);
                        const investmentFormatted = `$${investment.toFixed(2)}`;
                        
                        // ✅ Converter entryPrice e exitPrice corretamente (podem vir como string ou number)
                        let entryPrice = null;
                        if (trade.entryPrice != null && trade.entryPrice !== undefined && trade.entryPrice !== '') {
                            const entryValue = typeof trade.entryPrice === 'string' 
                                ? parseFloat(trade.entryPrice) 
                                : Number(trade.entryPrice);
                            entryPrice = !isNaN(entryValue) && entryValue > 0 ? entryValue : null;
                        }
                        
                        let exitPrice = null;
                        if (trade.exitPrice != null && trade.exitPrice !== undefined && trade.exitPrice !== '') {
                            const exitValue = typeof trade.exitPrice === 'string' 
                                ? parseFloat(trade.exitPrice) 
                                : Number(trade.exitPrice);
                            exitPrice = !isNaN(exitValue) && exitValue > 0 ? exitValue : null;
                        }
                        
                        console.log('[InvestmentActive] 🔍 Trade processado:', {
                            id: trade.id,
                            entryPrice: entryPrice,
                            exitPrice: exitPrice,
                            entryPriceRaw: trade.entryPrice,
                            exitPriceRaw: trade.exitPrice,
                            entryPriceType: typeof trade.entryPrice,
                            exitPriceType: typeof trade.exitPrice
                        });
                        
                        return {
                            time: time,
                            timestamp: timestamp,
                            pair: trade.symbol || 'R_10', // Usar symbol do banco
                            direction: direction,
                            investment: investmentFormatted,
                            pnl: pnl,
                            profit: profit,
                            entryPrice: entryPrice,
                            exitPrice: exitPrice
                        };
                    });
                    
                    console.log('[InvestmentActive] ✅ Log formatado:', this.logOperations);
                    console.log('[InvestmentActive] 📊 Primeira operação:', this.logOperations[0]);
                    if (this.logOperations.length > 0) {
                        console.log('[InvestmentActive] 🔍 Primeira operação - entryPrice:', this.logOperations[0].entryPrice, 'exitPrice:', this.logOperations[0].exitPrice);
                        console.log('[InvestmentActive] 🔍 Primeira operação - entryPrice type:', typeof this.logOperations[0].entryPrice, 'exitPrice type:', typeof this.logOperations[0].exitPrice);
                    }
                    
                    // Buscar trade ativo do histórico
                    this.updateActiveTrade(result.data);
                    
                    // Plotar marcadores de entradas no gráfico após um delay para garantir que o gráfico esteja pronto
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.plotEntryMarkers();
                        }, 500);
                    });
                } else {
                    console.error('[InvestmentActive] ❌ Erro ao buscar histórico:', result.message || 'Unknown error');
                    this.logOperations = [];
                }
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao buscar histórico:', error);
                this.logOperations = [];
            } finally {
                this.isLoadingLogs = false;
            }
        },
        
        /**
         * Atualiza o trade ativo baseado no histórico de trades
         * Procura pelo primeiro trade com status ACTIVE, ou o último trade fechado (WON/LOST)
         */
        updateActiveTrade(tradeHistory) {
            if (!tradeHistory || tradeHistory.length === 0) {
                // Se não há histórico, não há trade ativo
                this.activeTrade = null;
                this.progressState = 1; // Analisando
                
                // Se havia um timer rodando, limpar
                if (this.orderClosedTimer !== null) {
                    clearTimeout(this.orderClosedTimer);
                    this.orderClosedTimer = null;
                }
                return;
            }
            
            // Procurar por trade com status ACTIVE (ordem aberta)
            const activeTrade = tradeHistory.find(trade => trade.status === 'ACTIVE');
            
            if (activeTrade) {
                // Há uma ordem aberta
                const wasActive = this.activeTrade && this.activeTrade.status === 'ACTIVE';
                this.activeTrade = activeTrade;
                
                // Se havia um timer rodando (ordem fechada anterior), limpar
                if (this.orderClosedTimer !== null) {
                    clearTimeout(this.orderClosedTimer);
                    this.orderClosedTimer = null;
                }
                
                // Atualizar progressState para mobile (2 = ordem aberta)
                this.progressState = 2;
                
                if (!wasActive) {
                    console.log('[InvestmentActive] ✅ Ordem aberta detectada:', activeTrade.id);
                }
            } else {
                // Não há ordem aberta, verificar se o último trade foi fechado recentemente
                const lastTrade = tradeHistory[0]; // Trades vêm ordenados do mais recente para o mais antigo
                
                if (lastTrade && (lastTrade.status === 'WON' || lastTrade.status === 'LOST')) {
                    // Verificar se este trade é diferente do anterior (nova ordem fechada)
                    const wasDifferent = !this.activeTrade || 
                                       this.activeTrade.id !== lastTrade.id || 
                                       (this.activeTrade.status === 'ACTIVE');
                    
                    if (wasDifferent) {
                        // Nova ordem fechada - iniciar timer de 15 segundos
                        this.activeTrade = lastTrade;
                        this.progressState = 3; // Ordem fechada
                        
                        // Limpar timer anterior se existir
                        if (this.orderClosedTimer !== null) {
                            clearTimeout(this.orderClosedTimer);
                        }
                        
                        // Iniciar timer de 15 segundos para voltar ao estado "analisando"
                        this.orderClosedTimer = setTimeout(() => {
                            console.log('[InvestmentActive] ⏰ Timer de 15s expirado, voltando para estado "analisando"');
                            this.activeTrade = null;
                            this.progressState = 1; // Analisando
                            this.orderClosedTimer = null;
                        }, 15000);
                        
                        console.log('[InvestmentActive] ✅ Ordem fechada detectada:', lastTrade.id, 'Timer de 15s iniciado');
                    }
                    // Se não foi diferente, manter estado atual (timer continua rodando se existir)
                } else {
                    // Não há ordem ativa nem fechada recente - estado de análise
                    // Só atualizar se não havia timer rodando (timer ainda não expirou)
                    if (this.orderClosedTimer === null) {
                        this.activeTrade = null;
                        this.progressState = 1; // Analisando
                    }
                }
            }
        },
        
        /**
         * Inicia polling para verificar status do trade ativo
         */
        startTradeStatusPolling() {
            // Limpar polling anterior se existir
            if (this.tradeStatusPollingInterval) {
                clearInterval(this.tradeStatusPollingInterval);
            }
            
            // Buscar status do trade a cada 2 segundos
            this.tradeStatusPollingInterval = setInterval(() => {
                this.fetchTradeHistory();
            }, 2000);
            
            console.log('[InvestmentActive] 🔄 Polling de status do trade iniciado');
        },
        
        /**
         * Para o polling de status do trade
         */
        stopTradeStatusPolling() {
            if (this.tradeStatusPollingInterval) {
                clearInterval(this.tradeStatusPollingInterval);
                this.tradeStatusPollingInterval = null;
                console.log('[InvestmentActive] ⏸️ Polling de status do trade parado');
            }
        },
        
        /**
         * Plota marcadores no gráfico mostrando onde foram as entradas da IA
         */
        plotEntryMarkers() {
            // Se os marcadores estão ocultos, limpar todos
            if (!this.showEntryMarkers) {
                if (this.chart && this.currentSeries) {
                    try {
                        this.currentSeries.setMarkers([]);
                    } catch (error) {
                        console.warn('[InvestmentActive] Erro ao limpar marcadores:', error);
                    }
                }
                return;
            }
            
            if (!this.logOperations || this.logOperations.length === 0) {
                console.log('[InvestmentActive] ⚠️ Nenhuma operação disponível para plotar');
                return;
            }
            
            // Se estiver usando lightweight-charts
            if (this.chart && this.currentSeries && !this.tradingViewWidget) {
                try {
                    console.log('[InvestmentActive] 📍 Tentando plotar marcadores...', {
                        hasChart: !!this.chart,
                        hasSeries: !!this.currentSeries,
                        hasTradingView: !!this.tradingViewWidget,
                        operationsCount: this.logOperations.length,
                        showMarkers: this.showEntryMarkers
                    });
                    
                    // Verificar se temos ticks disponíveis
                    if (!this.ticks || this.ticks.length === 0) {
                        console.log('[InvestmentActive] ⚠️ Sem ticks disponíveis para plotar marcadores');
                        return;
                    }
                    
                    // Obter timestamps dos ticks disponíveis
                    const tickTimestamps = this.ticks
                        .map(tick => Math.floor(tick.epoch || tick.time || Date.now() / 1000))
                        .filter(ts => ts > 0)
                        .sort((a, b) => a - b);
                    
                    if (tickTimestamps.length === 0) {
                        console.log('[InvestmentActive] ⚠️ Nenhum timestamp válido de tick encontrado');
                        return;
                    }
                    
                    // Primeiro tick disponível
                    const firstTickTime = tickTimestamps[0];
                    // Começar a partir de 30 segundos após o primeiro tick
                    const minTime = firstTickTime + 30;
                    // Último tick disponível
                    const maxTime = tickTimestamps[tickTimestamps.length - 1];
                    
                    console.log('[InvestmentActive] 📊 Range de ticks:', {
                        firstTick: new Date(firstTickTime * 1000).toISOString(),
                        minTime: new Date(minTime * 1000).toISOString(),
                        maxTime: new Date(maxTime * 1000).toISOString(),
                        totalTicks: tickTimestamps.length
                    });
                    
                    // Filtrar operações que estejam dentro do range de ticks (a partir de 30 segundos)
                    const validOperations = this.logOperations.filter(op => {
                        if (!op.timestamp) return false;
                        return op.timestamp >= minTime && op.timestamp <= maxTime;
                    });
                    
                    console.log('[InvestmentActive] 📋 Operações válidas:', {
                        total: this.logOperations.length,
                        valid: validOperations.length,
                        filtered: this.logOperations.length - validOperations.length
                    });
                    
                    // Criar marcadores apenas para operações válidas
                    const markers = validOperations.map((op, index) => {
                        // Encontrar o tick mais próximo ao timestamp da operação
                        let closestTickTime = op.timestamp;
                        let minDiff = Infinity;
                        
                        for (const tickTime of tickTimestamps) {
                            const diff = Math.abs(tickTime - op.timestamp);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closestTickTime = tickTime;
                            }
                        }
                        
                        // Garantir que o timestamp está no formato correto (Unix timestamp em segundos)
                        if (typeof closestTickTime !== 'number' || closestTickTime <= 0) {
                            console.warn(`[InvestmentActive] ⚠️ Timestamp inválido para operação ${index}:`, closestTickTime);
                            return null;
                        }
                        
                        // Determinar cor baseado no resultado (verde para lucro, vermelho para prejuízo)
                        const color = op.profit >= 0 ? '#22C55E' : '#FF4747';
                        
                        return {
                            time: closestTickTime,
                            position: 'belowBar',
                            color: color,
                            shape: 'circle',
                            size: 1, // Tamanho do marcador
                            text: `${op.direction} ${op.pnl}`,
                        };
                    }).filter(marker => marker !== null); // Remover marcadores inválidos
                    
                    if (markers.length > 0) {
                        console.log('[InvestmentActive] 📍 Plotando', markers.length, 'marcadores:', markers);
                        this.currentSeries.setMarkers(markers);
                        console.log('[InvestmentActive] ✅ Marcadores de entradas plotados com sucesso:', markers.length);
                    } else {
                        console.log('[InvestmentActive] ⚠️ Nenhum marcador válido para plotar');
                    }
                } catch (error) {
                    console.error('[InvestmentActive] ❌ Erro ao plotar marcadores:', error);
                }
            }
            // TradingView não suporta marcadores diretamente via API, mas podemos tentar usar shapes
            else if (this.tradingViewWidget) {
                console.log('[InvestmentActive] TradingView não suporta marcadores via API diretamente');
            }
        },
        
        /**
         * Alterna a visibilidade dos marcadores de entradas da IA
         */
        toggleEntryMarkers() {
            this.showEntryMarkers = !this.showEntryMarkers;
            this.plotEntryMarkers();
        },

        // 🔑 Obter userId do token JWT (mesmo método do InvestmentIAView.vue)
        getUserId() {
            try {
                console.log('[InvestmentActive] 🔍 Buscando userId no token JWT...');
                
                // 1. Tentar pegar do token JWT (método principal)
                const token = localStorage.getItem('token');
                console.log('[InvestmentActive] 🔐 Token presente?', !!token);
                
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('[InvestmentActive] 📦 JWT Payload:', payload);
                    
                    if (payload.userId || payload.sub || payload.id) {
                        const userId = payload.userId || payload.sub || payload.id;
                        console.log('[InvestmentActive] ✅ UserId encontrado no JWT:', userId);
                        return userId;
                    }
                }

                // 2. Fallback: tentar pegar de user_info
                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    console.log('[InvestmentActive] 📦 UserInfo:', userInfo);
                    
                    if (userInfo.id || userInfo.userId) {
                        const userId = userInfo.id || userInfo.userId;
                        console.log('[InvestmentActive] ✅ UserId encontrado em user_info:', userId);
                        return userId;
                    }
                }

                console.warn('[InvestmentActive] ❌ Não foi possível obter userId');
                return null;
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao obter userId:', error);
                return null;
            }
        },

        setChartType(type) {
            if (this.chartType !== type) {
                this.chartType = type;
            }
        },
        setChartSize(timeframe, points) {
            if (this.selectedTimeframe !== timeframe) {
                this.selectedTimeframe = timeframe;
                this.chartPointsVisible = points;
                this.$nextTick(() => {
                    this.updateChart();
                });
            }
        },
        aggregateTicksToCandles(timeframeSeconds) {
            if (!Array.isArray(this.ticks) || this.ticks.length === 0) {
                return [];
            }

            // Filtrar e processar todos os ticks primeiro
            const validTicks = this.ticks.map(tick => {
                const rawTime = Math.floor(tick.epoch || tick.time || Date.now() / 1000);
                const price = Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0);
                return { time: rawTime, price };
            }).filter(tick => tick.price > 0);

            // Ordenar por tempo (mais recentes primeiro)
            const sortedTicks = [...validTicks].sort((a, b) => b.time - a.time);
            const totalTicks = sortedTicks.length;

            // Calcular quantos ticks são necessários para 10 minutos
            // Se os ticks são a cada segundo, 10 minutos = 600 segundos = 600 ticks
            // Mas vamos garantir pelo menos 10 minutos de dados, então vamos usar mais ticks
            const minTicksFor10Minutes = 600; // Mínimo de 600 ticks para 10 minutos (1 tick por segundo)
            const ticksNeeded = Math.max(
                minTicksFor10Minutes,
                Math.ceil((10 * 60) / (timeframeSeconds || 1)) * 10, // Garantir pelo menos 10 minutos
                this.chartPointsVisible * 10 // Ou o que já estava calculado
            );
            
            // Limitar aos ticks mais recentes, garantindo pelo menos 10 minutos
            const ticksToUse = sortedTicks.slice(0, Math.min(ticksNeeded, totalTicks));
            
            console.log('[InvestmentActive] Agregando ticks:', {
                totalTicks,
                ticksToUse: ticksToUse.length,
                timeframeSeconds,
                minTicksFor10Minutes,
                ticksNeeded
            });
            
            // Reverter para ordem cronológica (mais antigos primeiro) para agregação
            const chronologicalTicks = [...ticksToUse].reverse();

            // Calcular timeframe adaptativo baseado na quantidade desejada de velas
            // Queremos aproximadamente chartPointsVisible velas
            const timeSpan = chronologicalTicks.length > 1 
                ? chronologicalTicks[chronologicalTicks.length - 1].time - chronologicalTicks[0].time
                : timeframeSeconds;
            
            // Calcular timeframe ideal para ter aproximadamente chartPointsVisible velas
            let effectiveTimeframe = timeSpan > 0 
                ? Math.max(timeframeSeconds, Math.floor(timeSpan / this.chartPointsVisible))
                : timeframeSeconds;

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
            
            // ✅ AJUSTE: Aumentar quantidade de velas para mostrar mais histórico
            // Calcular quantas velas são necessárias para mostrar 15 minutos (aumentado de 10)
            const candlesFor15Minutes = Math.ceil((15 * 60) / effectiveTimeframe);
            const minCandles = Math.max(candlesFor15Minutes, this.chartPointsVisible);
            
            // Limitar a quantidade final de velas, garantindo pelo menos 15 minutos
            // Pegar as últimas N velas (mais recentes)
            const finalCandles = candles.slice(-minCandles);
            
            console.log('[InvestmentActive] Velas geradas:', {
                totalCandles: candles.length,
                finalCandles: finalCandles.length,
                candlesFor15Minutes,
                minCandles,
                effectiveTimeframe,
                timeSpanMinutes: finalCandles.length > 0 ? ((finalCandles[finalCandles.length - 1].time - finalCandles[0].time) / 60).toFixed(2) : 0
            });
            
            return finalCandles;
        },
        createSeries(type) {
            if (!this.chart) return;

            if (this.currentSeries) {
                try {
                    this.chart.removeSeries(this.currentSeries);
                } catch (error) {
                    console.warn('[InvestmentActive] Não foi possível remover série anterior:', error);
                }
                this.currentSeries = null;
            }

            if (type === 'line') {
                this.currentSeries = this.chart.addAreaSeries({
                    lineColor: '#22C55E',
                    topColor: 'rgba(34, 197, 94, 0.2)',
                    bottomColor: 'rgba(34, 197, 94, 0.02)',
                    lineWidth: 2,
                    priceFormat: { type: 'price', precision: 4, minMove: 0.0001 },
                });
            } else {
                // Gráfico de velas com aparência profissional similar ao TradingView
                // Verde para altas, vermelho para baixas
                this.currentSeries = this.chart.addCandlestickSeries({
                    upColor: '#00a65a',           // Cor do corpo da vela de alta (verde mais escuro, similar TradingView)
                    downColor: '#ff3a3a',         // Cor do corpo da vela de baixa (vermelho)
                    borderVisible: true,
                    borderUpColor: '#00a65a',     // Borda da vela de alta
                    borderDownColor: '#ff3a3a',   // Borda da vela de baixa
                    wickUpColor: '#00a65a',       // Cor do pavio superior de alta
                    wickDownColor: '#ff3a3a',     // Cor do pavio inferior de baixa
                    priceFormat: { 
                        type: 'price', 
                        precision: 4, 
                        minMove: 0.0001 
                    },
                });
            }
        },
        /**
         * Cria um datafeed customizado para TradingView usando os ticks da API
         */
        createTradingViewDatafeed() {
            if (!Datafeeds) {
                console.error('[InvestmentActive] Datafeeds não está disponível. Certifique-se de carregar datafeeds/udf/dist/bundle.js');
                return null;
            }

            // Criar datafeed UDF compatível
            const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
            const datafeed = new Datafeeds.UDFCompatibleDatafeed(`${apiBase}/ai/tradingview`, false);
            
            return datafeed;
        },

        // Métodos para gráfico
        initChart() {
            if (this.chartInitialized || !this.$refs.chartContainer) {
                return;
            }

            // Verificar se TradingView está disponível
            if (TradingView && Datafeeds && this.chartType === 'candles') {
                this.initTradingViewChart();
            } else {
                this.initLightweightChart();
            }
        },

        /**
         * Inicializa o gráfico usando TradingView Charting Library
         */
        initTradingViewChart() {
            try {
                const container = this.$refs.chartContainer;
                
                // Limpar container
                container.innerHTML = '';
                
                // Parâmetros de personalização conforme documentação
                const overrides = {
                    // Configurações do painel (fundo, grade)
                    "paneProperties.background": "#131722",
                    "paneProperties.vertGridProperties.color": "#363c4e",
                    "paneProperties.horzGridProperties.color": "#363c4e",
                    "paneProperties.crossHairProperties.color": "#758696",
                    
                    // Configurações das escalas (eixos)
                    "scalesProperties.textColor": "#a9b2b8",
                    "scalesProperties.lineColor": "#363c4e",
                    
                    // Configurações do estilo de vela (Candlestick)
                    "mainSeriesProperties.style": 1, // 1 é o estilo Candlestick
                    "mainSeriesProperties.candleStyle.upColor": "#00a65a", // Cor da vela de alta (Verde)
                    "mainSeriesProperties.candleStyle.downColor": "#ff3a3a", // Cor da vela de baixa (Vermelho)
                    "mainSeriesProperties.candleStyle.drawWick": true,
                    "mainSeriesProperties.candleStyle.drawBorder": true,
                    "mainSeriesProperties.candleStyle.wickUpColor": "#00a65a",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#ff3a3a",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#00a65a",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#ff3a3a",
                    "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
                };
                
                // Criar datafeed customizado
                const datafeed = this.createTradingViewDatafeed();
                if (!datafeed) {
                    console.warn('[InvestmentActive] Não foi possível criar datafeed. Usando lightweight-charts.');
                    this.initLightweightChart();
                    return;
                }
                
                // Configurar caminho da biblioteca
                const libraryPath = process.env.BASE_URL ? `${process.env.BASE_URL}charting_library/` : '/charting_library/';
                
                // Converter timeframe para formato TradingView
                const intervalMap = {
                    60: '1',
                    300: '5',
                    900: '15',
                    1800: '30',
                    3600: '60',
                    14400: '240',
                    86400: 'D'
                };
                const interval = intervalMap[this.selectedTimeframe] || '5';
                
                // Inicializar o Widget da TradingView
                this.tradingViewWidget = new TradingView.widget({
                    container: container,
                    locale: 'pt',
                    library_path: libraryPath,
                    datafeed: datafeed,
                    symbol: 'R_10', // Volatility 10 Index
                    interval: interval,
                    fullscreen: false,
                    autosize: true,
                    theme: 'dark',
                    overrides: overrides,
                    disabled_features: [
                        'use_localstorage_for_settings',
                        'volume_force_overlay',
                        'create_volume_indicator_by_default',
                    ],
                    enabled_features: [
                        'study_templates',
                        'side_toolbar_in_fullscreen_mode',
                    ],
                    charts_storage_url: 'https://saveload.tradingview.com',
                    charts_storage_api_version: '1.1',
                    client_id: 'tradingview.com',
                    user_id: 'public_user_id',
                    custom_css_url: null,
                });
                
                console.log('[InvestmentActive] ✅ Gráfico TradingView inicializado');
                this.chartInitialized = true;
            } catch (error) {
                console.error('[InvestmentActive] Erro ao inicializar gráfico TradingView:', error);
                console.warn('[InvestmentActive] Tentando fallback para lightweight-charts...');
                this.initLightweightChart();
            }
        },

        /**
         * Inicializa o gráfico usando lightweight-charts (fallback)
         */
        initLightweightChart() {
            try {
                const container = this.$refs.chartContainer;
                const containerWidth = container.offsetWidth || 1200;
                const containerHeight = 600; // Aumentado de 400 para 600

                console.log('[InvestmentActive] Inicializando gráfico lightweight-charts...', {
                    width: containerWidth,
                    height: containerHeight,
                    ticksCount: this.ticks.length
                });

                this.chart = createChart(container, {
                    width: containerWidth,
                    height: containerHeight,
                    autoSize: true,
                    localization: { 
                        locale: 'pt-BR',
                        dateFormat: 'dd/MM/yyyy',
                        timeFormat: 'HH:mm'
                    },
                    layout: {
                        background: { type: ColorType.Solid, color: '#131722' },
                        textColor: '#a9b2b8',
                        fontSize: 12,
                    },
                    rightPriceScale: {
                        borderColor: '#363c4e',
                        scaleMargins: {
                            top: 0.1,
                            bottom: 0.1,
                        },
                        entireTextOnly: false,
                        ticksVisible: true,
                    },
                    leftPriceScale: {
                        visible: false,
                    },
                    timeScale: {
                        borderColor: '#363c4e',
                        timeVisible: true,
                        secondsVisible: false,
                        rightOffset: 12,
                        barSpacing: 2,
                        minBarSpacing: 0.5,
                        fixLeftEdge: false,
                        fixRightEdge: true,
                        lockVisibleTimeRangeOnResize: false,
                        rightBarStaysOnScroll: true,
                    },
                    grid: {
                        vertLines: { 
                            color: '#363c4e',
                            style: 0,
                            visible: true,
                        },
                        horzLines: { 
                            color: '#363c4e',
                            style: 0,
                            visible: true,
                        },
                    },
                    crosshair: {
                        mode: 1,
                        vertLine: {
                            color: '#758696',
                            width: 1,
                            style: 3,
                            labelBackgroundColor: '#758696',
                        },
                        horzLine: {
                            color: '#758696',
                            width: 1,
                            style: 3,
                            labelBackgroundColor: '#758696',
                        },
                    },
                });

                this.createSeries(this.chartType);
                this.chartInitialized = true;
                console.log('[InvestmentActive] ✅ Gráfico lightweight-charts inicializado');
                this.updateChart();
                // Plotar marcadores após inicializar o gráfico e atualizar dados
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.plotEntryMarkers();
                    }, 1000);
                });
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao inicializar gráfico:', error);
            }
        },

        updateChart() {
            // Se estiver usando TradingView, não precisa atualizar manualmente (ele gerencia via datafeed)
            if (this.tradingViewWidget) {
                return;
            }

            if (!this.chartInitialized || !this.currentSeries || this.ticks.length === 0) {
                return;
            }

            try {
                let data = [];
                if (this.chartType === 'candles') {
                    // Usar o timeframe selecionado com controle de zoom
                    data = this.aggregateTicksToCandles(this.selectedTimeframe);
                } else {
                    // Gráfico de linhas: garantir pelo menos 10 minutos de dados
                    const sortedTicks = [...this.ticks]
                        .map(tick => ({
                            time: Math.floor(tick.epoch || tick.time || Date.now() / 1000),
                            value: Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0),
                        }))
                        .filter(point => point.value)
                        .sort((a, b) => a.time - b.time);
                    
                    // ✅ AJUSTE: Aumentar ticks necessários para mostrar mais histórico
                    // Calcular quantos ticks são necessários para 15 minutos (900 segundos)
                    const minTicksFor15Minutes = 900;
                    const ticksNeeded = Math.max(minTicksFor15Minutes, this.chartPointsVisible);
                    
                    // Pegar os últimos N pontos, garantindo pelo menos 10 minutos
                    const limitedTicks = sortedTicks.slice(-ticksNeeded);
                    data = limitedTicks;
                    
                    console.log('[InvestmentActive] Gráfico de linhas:', {
                        totalTicks: sortedTicks.length,
                        ticksUsed: limitedTicks.length,
                        timeSpanMinutes: limitedTicks.length > 0 ? ((limitedTicks[limitedTicks.length - 1].time - limitedTicks[0].time) / 60).toFixed(2) : 0
                    });
                }

                if (!data.length) return;

                console.log('[InvestmentActive] Atualizando gráfico com', data.length, this.chartType === 'candles' ? 'velas' : 'pontos');
                this.currentSeries.setData(data);
                
                // Ajustar o gráfico para mostrar todos os dados
                this.chart.timeScale().fitContent();
                
                // Atualizar marcadores quando o gráfico for atualizado
                if (this.logOperations && this.logOperations.length > 0 && this.showEntryMarkers) {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.plotEntryMarkers();
                        }, 200);
                    });
                }
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao atualizar gráfico:', error);
            }
        },
        
        // Animação da barra de progresso mobile
        startProgressAnimation() {
            this.stopProgressAnimation();
            this.progressState = 1;
            
            this.progressInterval = setInterval(() => {
                this.progressState = (this.progressState % 3) + 1;
            }, 3000); // Muda de estado a cada 3 segundos
        },
        
        stopProgressAnimation() {
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
        }
    },

    watch: {
        ticks: {
            handler(newTicks) {
                console.log('[InvestmentActive] Ticks atualizados:', newTicks.length);
                if (newTicks && newTicks.length > 0 && this.activeTab === 'chart') {
                    this.$nextTick(() => {
                        if (!this.chartInitialized) {
                            this.initChart();
                        } else {
                            this.updateChart();
                        }
                    });
                }
            },
            deep: true,
            immediate: true
        },
        activeTab(newTab) {
            if (newTab === 'chart' && this.ticks && this.ticks.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInitialized) {
                        this.initChart();
                    } else {
                        this.updateChart();
                    }
                });
            }
        },
        logOperations: {
            handler(newOperations) {
                if (newOperations && newOperations.length > 0 && this.chartInitialized && this.activeTab === 'chart') {
                    console.log('[InvestmentActive] Operações atualizadas, replotando marcadores:', newOperations.length);
                    this.$nextTick(() => {
                        this.plotEntryMarkers();
                    });
                }
            },
            deep: true
        },
        chartType() {
            if (this.chartInitialized) {
                // Se mudar para candles e TradingView está disponível, reinicializar com TradingView
                if (this.chartType === 'candles' && TradingView && Datafeeds && this.tradingViewWidget === null) {
                    this.chartInitialized = false;
                    if (this.chart) {
                        this.chart.remove();
                        this.chart = null;
                    }
                    this.$nextTick(() => {
                        this.initChart();
                    });
                } else {
                    this.createSeries(this.chartType);
                    this.updateChart();
                }
            }
        },
        selectedTimeframe() {
            // Se TradingView estiver ativo, recriar com novo timeframe
            if (this.tradingViewWidget && this.chartType === 'candles') {
                this.chartInitialized = false;
                this.tradingViewWidget.remove();
                this.tradingViewWidget = null;
                this.$nextTick(() => {
                    this.initChart();
                });
            } else if (this.chartInitialized && this.chartType === 'candles') {
                this.updateChart();
            }
        },
        chartPointsVisible: {
            handler() {
                // Atualizar gráfico quando o zoom mudar
                if (this.chartInitialized) {
                    this.$nextTick(() => {
                        this.updateChart();
                    });
                }
            }
        },
        // ✅ Watcher para iniciar/parar polling quando IA for ativada/desativada
        'sessionConfig.isActive': {
            handler(newVal, oldVal) {
                const isActive = newVal === 1 || newVal === true;
                const wasActive = oldVal === 1 || oldVal === true;
                
                if (isActive && !wasActive) {
                    // IA foi ativada - iniciar polling
                    console.log('[InvestmentActive] ✅ IA ativada, iniciando polling de logs...');
                    if (this.realtimeLogs.length === 0) {
                        this.logSystemInit();
                    } else {
                        this.startLogPolling();
                    }
                    // Iniciar polling de histórico também
                    this.startHistoryPolling();
                    // Iniciar polling de status do trade
                    this.startTradeStatusPolling();
                } else if (!isActive && wasActive) {
                    // IA foi desativada - parar polling
                    console.log('[InvestmentActive] ⏸️ IA desativada, parando polling de logs...');
                    this.stopLogPolling();
                    this.stopHistoryPolling();
                    this.stopTradeStatusPolling();
                }
            },
            immediate: false
        }
    },

    mounted() {
        console.log('[InvestmentActive] Componente montado. Ticks:', this.ticks.length);
        
        // Inicializar mercado do prop se fornecido
        if (this.selectedMarketProp) {
            this.selectedMarket = this.selectedMarketProp;
        }
        
        // 📊 Buscar configuração primeiro (assíncrono)
        this.fetchSessionConfig().then(() => {
            // Após config carregada, verificar se IA está ativa
            const isActive = this.sessionConfig.isActive === 1 || this.sessionConfig.isActive === true;
            if (isActive) {
                console.log('[InvestmentActive] ✅ IA está ativa, inicializando logs...');
                if (this.realtimeLogs.length === 0) {
                    this.logSystemInit();
                } else {
                    // Se já tem logs, apenas iniciar polling
                    this.startLogPolling();
                }
            }
        });
        
        // 📊 Buscar estatísticas do dia
        this.startStatsUpdates();
        
        // 📊 Buscar histórico de operações
        this.fetchTradeHistory();
        
        // 📊 Iniciar polling de histórico (a cada 1 minuto)
        this.startHistoryPolling();
        
        // 🔄 Iniciar polling de status do trade (a cada 2 segundos)
        this.startTradeStatusPolling();
        
        // 🎯 Iniciar animação da barra de progresso mobile
        this.startProgressAnimation();
        
        this.$nextTick(() => {
            setTimeout(() => {
                if (this.ticks && this.ticks.length > 0) {
                    this.initChart();
                }
            }, 500);
        });
    },

    beforeUnmount() {
        // Parar atualizações de stats
        this.stopStatsUpdates();
        
        // Parar polling de logs
        this.stopLogPolling();
        
        // Parar polling de histórico
        this.stopHistoryPolling();
        
        // Parar polling de status do trade
        this.stopTradeStatusPolling();
        
        // Limpar timer de ordem fechada
        if (this.orderClosedTimer !== null) {
            clearTimeout(this.orderClosedTimer);
            this.orderClosedTimer = null;
        }
        
        // Parar animação da barra de progresso
        this.stopProgressAnimation();
        
        // Cleanup: Remove o widget TradingView quando o componente for desmontado
        if (this.tradingViewWidget) {
            try {
                this.tradingViewWidget.remove();
                this.tradingViewWidget = null;
            } catch (error) {
                console.error('[InvestmentActive] Erro ao remover widget TradingView:', error);
            }
        }
        
        // Limpar gráfico lightweight-charts
        if (this.chart) {
            try {
                this.chart.remove();
            } catch (error) {
                console.error('[InvestmentActive] Erro ao remover gráfico:', error);
            }
            this.chart = null;
        }
    }
};
</script>

<style scoped>
/* ========================================================== */
/* New Design Styles                                         */
/* ========================================================== */

* {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
}

.investment-active-wrapper {
    width: 100%;
    min-height: 100vh;
    background-color: #0B0B0B;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

/* Mobile: Aplicar gradiente no wrapper */
@media (max-width: 768px) {
    .investment-active-wrapper {
        background: linear-gradient(135deg, rgba(15, 20, 30, 0.98) 0%, rgba(11, 15, 25, 0.99) 50%, rgba(8, 12, 20, 0.98) 100%) !important;
        background-image: none !important;
    }
}

/* Ensure Font Awesome icons are visible */
.fas,
.far,
.fab,
.fa {
    font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "Font Awesome 6 Pro", "Font Awesome 6 Sharp" !important;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    line-height: 1;
}

.fas {
    font-weight: 900;
}

.far {
    font-weight: 400;
}

.fab {
    font-family: "Font Awesome 6 Brands" !important;
    font-weight: 400;
}

/* Ensure icons in buttons are visible */
button i,
.btn i,
.eye-btn i {
    display: inline-block;
    width: auto;
    height: auto;
}

.investment-active-main {
    padding: 1.5rem 2rem;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
}

/* Premium Card */
.premium-card {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
    background: #0b0b0b;
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid #1C1C1C;
}

.premium-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.06);
}

/* Performance Summary Section */
.performance-summary-section {
    margin-bottom: 1.5rem;
}

.performance-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
}

.performance-card {
    padding: 1.25rem;
    background-color: #0E0E0E;
}

.card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.card-label {
    font-size: 0.75rem;
    color: #7A7A7A;
    font-weight: 500;
}

.eye-btn {
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.6;
    background: none;
    border: none;
    color: #A1A1A1;
    padding: 0.25rem;
}

.eye-btn:hover {
    opacity: 1;
    color: #22C55E;
}

.card-value-large {
    margin-bottom: 0.75rem;
}

.card-value-large span {
    font-size: 1.875rem;
    font-weight: 700;
    color: #DFDFDF;
}

.hidden-value {
    letter-spacing: 4px;
    user-select: none;
    opacity: 0.8;
}

.card-actions-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.account-type-btn {
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.account-type-btn:not(.active) {
    background-color: #0B0B0B;
    color: #A1A1A1;
    border: 1px solid #1C1C1C;
}

.account-type-btn.active {
    background-color: #22C55E;
    color: #000;
}

.profit-percentage {
    font-size: 0.875rem;
    color: #22C55E;
    font-weight: 500;
}

.profit-percentage-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.725rem;
    font-weight: 600;
    color: white;
    text-align: center;
    white-space: nowrap;
}

.profit-positive {
    background-color: #22C55E;
}

.profit-negative {
    background-color: #FF4747;
}

.trades-stats-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.75rem;
}

/* Status Card */
.status-card {
    padding: 1.25rem;
}

.status-card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.status-card-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.ai-status-widget {
    position: relative;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ai-status-bg {
    position: absolute;
    inset: 0;
    background-color: rgba(11, 11, 11, 0.5);
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
}

.ai-status-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
}

.ai-status-spinner-wrapper {
    position: relative;
}

.ai-status-pulse-bg {
    position: absolute;
    inset: 0;
    background-color: rgba(255, 208, 88, 0.2);
    border-radius: 9999px;
    filter: blur(12px);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.ai-status-spinner {
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner-svg {
    width: 1.75rem;
    height: 1.75rem;
    color: #FFD058;
    animation: spin 3s linear infinite;
}

.status-text-content {
    flex: 1;
    text-align: left;
}

.status-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
    text-align: left;
}

.status-subtitle-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    text-align: left;
}

.status-indicator-text {
    font-weight: 500;
}

.status-indicator-dot {
    color: #A1A1A1;
}

.status-indicator-subtext {
    color: #A1A1A1;
}

.status-card-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.ai-online-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.ai-pulse-dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #22C55E;
    border-radius: 9999px;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.deactivate-ai-btn-new {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #FF4747;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.deactivate-ai-btn-new:hover:not(:disabled) {
    background-color: #E63946;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 71, 71, 0.3);
}

.deactivate-ai-btn-new:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Main Content Grid */
.main-content-grid {
    display: grid;
    grid-template-columns: 8fr 4fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    align-items: stretch;
}

.chart-column {
    grid-column: 1;
    display: flex;
    flex-direction: column;
}

.config-column {
    grid-column: 2;
    display: flex;
    flex-direction: column;
}

/* Market Chart Card */
.market-chart-card {
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.market-chart-card .chart-view-container,
.market-chart-card .logs-view-container {
    flex: 1;
    min-height: 400px;
}

.chart-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.chart-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
}

.chart-subtitle {
    font-size: 0.75rem;
    color: #A1A1A1;
    margin-top: 0.25rem;
}

.chart-tabs {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.chart-tab-btn {
    position: relative;
    font-size: 0.875rem;
    font-weight: 500;
    color: #A1A1A1;
    background: none;
    border: none;
    cursor: pointer;
    padding-bottom: 0.25rem;
    transition: all 0.3s ease;
}

.chart-tab-btn.active {
    color: #22C55E;
}

.tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #22C55E;
}

.chart-type-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
}

.chart-type-btn {
    padding: 0.375rem 0.75rem;
    background-color: #0B0B0B;
    color: #A1A1A1;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.chart-type-btn:hover {
    border-color: #22C55E;
    color: #22C55E;
}

.chart-type-btn.active {
    background-color: #22C55E;
    color: #000;
    border-color: #22C55E;
    font-weight: 700;
}

/* Chart Size Controls */
.chart-size-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.chart-size-btn {
    padding: 0.375rem 0.75rem;
    background-color: #0B0B0B;
    color: #A1A1A1;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.chart-size-btn:hover {
    border-color: #22C55E;
    color: #22C55E;
}

.chart-size-btn.active {
    background-color: #22C55E;
    color: #000;
    border-color: #22C55E;
    font-weight: 700;
}

.chart-size-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.chart-view-container {
    height: 600px;
    min-height: 600px;
    width: 100%;
}

#chart-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    margin: 0;
    padding: 0;
    align-self: stretch;
}

.chart-container {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    margin: 0;
    padding: 0;
}

/* TradingView Chart Container */
.tradingview-container {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    background: #131722;
    margin: 0;
    padding: 0;
}

.logs-view-container {
    height: 400px;
    overflow-y: auto;
}

.logs-table-wrapper {
    overflow-x: auto;
}

.logs-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

.logs-table th,
.logs-table td {
    border: none;
    border-bottom: none;
    border-top: none;
}

.log-row {
    border-bottom: none;
    transition: background-color 0.2s ease;
}

.log-row-even {
    background-color: rgba(255, 255, 255, 0.01);
}

.log-row-odd {
    background-color: rgba(255, 255, 255, 0.03);
}

.log-row:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
}

.logs-table td,
.logs-table th {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    text-align: left;
}

.logs-table td {
    color: #838383;
    text-align: left;
}

.logs-table th {
    color: #7D7D7D;
    font-weight: 500;
    text-align: left;
}

.logs-table th.text-right,
.logs-table td.text-right {
    text-align: right;
}

.direction-badge,
.result-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.call-badge {
    background-color: #22C55E;
    color: #000;
}

.put-badge {
    background-color: rgba(255, 71, 71, 0.8);
    color: white;
}

.win-badge {
    background-color: rgba(34, 197, 94, 0.1);
    color: #22C55E;
    border: 1px solid rgba(34, 197, 94, 0.2);
}

/* ============================================ */
/* LOGS EM TEMPO REAL - ZENIX v2.0            */
/* ============================================ */
#register-view .text-blue-400 {
    color: #60a5fa;
}

#register-view .text-gray-400 {
    color: #9ca3af;
}

#register-view .text-purple-400 {
    color: #c084fc;
}

#register-view .text-yellow-400 {
    color: #facc15;
}

#register-view .text-cyan-400 {
    color: #22d3ee;
}

#register-view .text-green-400 {
    color: #4ade80;
}

#register-view .text-orange-400 {
    color: #fb923c;
}

#register-view .text-red-500 {
    color: #ef4444;
}

.loading-logs,
.no-logs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #7D7D7D;
    font-size: 0.875rem;
}

.loss-badge {
    background-color: rgba(255, 71, 71, 0.1);
    color: #FF4747;
    border: 1px solid rgba(255, 71, 71, 0.2);
}

.loading-logs,
.no-logs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #A1A1A1;
    font-size: 0.875rem;
}

/* Config Card */
.config-card-sticky {
    padding: 1.5rem;
    position: sticky;
    top: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.config-card-sticky .config-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.config-card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
}

.config-content {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.config-section {
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(28, 28, 28, 0.5);
}

.config-section-last {
    padding-top: 1.25rem;
}

.config-label {
    font-size: 0.625rem;
    color: #7D7D7D;
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    position: relative;
}

.config-value-main {
    font-size: 1rem;
    font-weight: 700;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
}

.config-description {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.config-params-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 0.75rem;
}

.param-label {
    font-size: 0.75rem;
    color: #A1A1A1;
    margin-bottom: 0.25rem;
}

.param-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #DFDFDF;
}

.risk-management-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
}

.risk-level-badge {
    padding: 0.375rem 0.75rem;
    background-color: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 0.5rem;
}

.ai-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.ai-status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.pause-ai-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #FFD058;
    color: #000;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.pause-ai-btn:hover:not(:disabled) {
    background-color: #FFE07A;
}

.pause-ai-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Status Footer */
.status-footer-section {
    margin-bottom: 1.5rem;
}

.status-footer-card {
    padding: 1.5rem;
    border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-footer-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.status-footer-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.status-footer-icon {
    width: 3rem;
    height: 3rem;
    background-color: rgba(34, 197, 94, 0.1);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-footer-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
}

.status-footer-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
}

.status-footer-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.status-footer-status {
    font-size: 0.875rem;
    font-weight: 500;
}

/* Animations */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* Colors */
.text-zenix-green {
    color: #22C55E;
}

.text-zenix-red {
    color: #FF4747;
}

.text-zenix-secondary {
    color: #A1A1A1;
}

.text-zenix-text {
    color: #DFDFDF;
}

/* Ensure all sections occupy 100% width */
.performance-summary-section,
.performance-cards-grid,
.main-content-grid,
.market-chart-card,
.config-card-sticky,
.status-footer-section,
.status-footer-card,
#compact-performance-panel,
#iya1j {
	width: 100%;
	box-sizing: border-box;
}

/* Grid columns should occupy full width */
.chart-column,
.config-column {
    width: 100%;
    box-sizing: border-box;
}

/* Performance cards grid should adapt to full width */
.performance-cards-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
    .main-content-grid {
        grid-template-columns: 1fr;
    }
    
    .chart-column,
    .config-column {
        grid-column: 1;
    }

    .performance-cards-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop: Mostrar layout original, esconder mobile */
@media (min-width: 769px) {
    .desktop-performance-panel {
        display: block;
    }
    
    .mobile-performance-panel {
        display: none !important;
    }
}

@media (max-width: 768px) {
    .investment-active-main {
        padding: 2rem;
    }
    
    /* Mobile: Esconder layout desktop, mostrar mobile */
    .desktop-performance-panel {
        display: none !important;
    }
    
    .mobile-performance-panel {
        display: block;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    /* Mobile: Card IA ORION - 100% largura */
    #mobile-compact-performance-panel {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    #mobile-compact-performance-panel > div.bg-\[#0B0B0B\]\/80 {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 0px !important;
        border-left: none !important;
        border-right: none !important;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
    }
    
    /* Garantir que o gradiente seja aplicado mesmo com classes Tailwind */
    #mobile-compact-performance-panel > div.premium-card.bg-\[#0B0B0B\]\/80,
    #mobile-compact-performance-panel > div[class*="bg-\[#0B0B0B\]"] {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
    }
    
    /* Mobile: Esconder eye-btn no mobile-compact-performance-panel */
    #mobile-compact-performance-panel .eye-btn {
        display: none !important;
    }
    
    /* Mobile: Aumentar fonte em 2px nos itens do mobile-compact-performance-panel */
    #mobile-compact-performance-panel .text-\[8px\] {
        font-size: 10px !important;
    }
    
    #mobile-compact-performance-panel .text-\[12px\] {
        font-size: 14px !important;
    }
    
    #mobile-compact-performance-panel .text-\[10px\] {
        font-size: 12px !important;
    }
    
    #mobile-compact-performance-panel .text-\[9px\] {
        font-size: 11px !important;
    }
    
    /* Mobile: Diminuir fonte e padding do percentage badge no card IA Orion */
    #mobile-compact-performance-panel .profit-percentage-badge-mobile {
        font-size: 0.625rem !important; /* 10px reduzido para 8px */
        padding: 0.125rem 0.25rem !important; /* Reduzir padding */
    }
    
    /* Mobile: Aumentar fonte dos labels de progresso em 2px */
    #mobile-compact-performance-panel .mobile-progress-label {
        font-size: 0.875rem !important; /* 14px (era 12px/0.75rem) */
    }

    /* Mobile: Header IA ORION */
    .mobile-ia-header {
        display: block;
        margin-bottom: 1rem;
        text-align: center;
    }

    .mobile-ia-title {
        font-size: 0; /* Esconder texto original no mobile */
        font-weight: 700;
        margin: 0;
        padding: 0;
        animation: blink-slow 2s ease-in-out infinite;
    }

    .mobile-ia-title::before {
        content: "IA ";
        color: #22C55E;
        font-size: 1.2rem; /* Restaurar tamanho no pseudo-elemento */
        animation: blink-slow 2s ease-in-out infinite;
    }

    .mobile-ia-title::after {
        content: "ORION";
        color: #DFDFDF;
        font-size: 1.2rem; /* Restaurar tamanho no pseudo-elemento */
        animation: blink-slow 2s ease-in-out infinite;
    }
    
    @keyframes blink-slow {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .mobile-separator {
        height: 1px;
        background: #1C1C1C;
        margin-top: 0.75rem;
        width: 100%;
    }

    /* Mobile: Esconder card de status da IA */
    #ichwdn {
        display: none !important;
    }

    /* Mobile: Reorganizar cards - Saldo, Resultado e Trades no mesmo card */
    #iya1j {
        display: flex !important;
        flex-direction: column;
        gap: 0 !important;
    }

    #iya1j > .col-span-2 {
        grid-column: unset !important;
        width: 100% !important;
        margin-bottom: 0 !important;
    }

    /* Mobile: Card consolidado com as 3 métricas */
    #iya1j > .col-span-2:first-child {
        border-radius: 12px 12px 0 0 !important;
        border-bottom: 1px solid #1C1C1C !important;
    }

    #iya1j > .col-span-2:nth-child(2) {
        border-radius: 0 !important;
        border-top: none !important;
        border-bottom: 1px solid #1C1C1C !important;
    }

    #iya1j > .col-span-2:nth-child(3) {
        border-radius: 0 0 12px 12px !important;
        border-top: none !important;
    }

    /* Mobile: Ajustar labels - mostrar Lucro do Dia */
    .mobile-label-lucro {
        display: inline !important;
    }

    /* Mobile: Ajustar altura dos cards */
    #ie22vl,
    #i790gh,
    #i42e4g {
        height: auto !important;
        min-height: 70px;
        padding: 15px !important;
    }

    /* Mobile: Barra de Progresso (separada - esconder quando está no card unificado) */
    .mobile-progress-section {
        display: none; /* Esconder barra separada, pois está no card unificado */
        margin-top: 1rem;
        margin-bottom: 1.5rem;
        padding: 0 15px;
    }
    
    .mobile-progress-container {
        width: 100%;
        background: transparent;
        border: none;
        border-radius: 0;
        padding: 0;
    }
    
    /* Quando dentro do card unificado */
    #compact-performance-panel .mobile-progress-container {
        margin-top: 0;
        padding-top: 0;
    }
    
    .mobile-progress-bar {
        display: flex;
        gap: 4px;
        width: 100%;
        margin-bottom: 12px;
    }
    
    .mobile-progress-segment {
        flex: 1;
        height: 6px;
        border-radius: 9999px;
        background-color: #1C1C1C;
        border: none;
        transition: all 0.8s ease;
        position: relative;
        overflow: hidden;
    }

    .mobile-progress-segment::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent);
        animation: shimmer 2s infinite;
    }
    
    /* Segmentos coloridos apenas quando têm a classe filled */
    .mobile-progress-segment.filled {
        background-color: #22C55E;
        box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
    }
    
    .mobile-progress-text {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #DFDFDF;
        font-size: 0.75rem;
        justify-content: center;
    }
    
    .mobile-progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #22C55E;
        box-shadow: 0 0 10px 2px rgba(34, 197, 94, 0.6);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .mobile-progress-labels {
        display: flex;
        gap: 20px;
        position: relative;
        width: 100%;
        justify-content: space-between;
    }

    .mobile-progress-label {
        font-weight: 500;
        font-size: 0.75rem;
        color: #7A7A7A;
        transition: color 0.3s ease;
        position: relative;
        flex: 1;
        text-align: center;
    }

    .mobile-progress-label.active {
        color: #22C55E;
    }

    /* Mobile: Tabs */
    .mobile-tabs-container {
        display: flex;
        background: #0B0B0B;
        border: 1px solid #1C1C1C;
        border-radius: 12px;
        padding: 8px;
        gap: 4px;
    }

    /* Mobile: Tabs fora do card - esconder no mobile */
    .mobile-tabs-container.mobile-tabs-outside {
        margin-bottom: 1.5rem;
    }

    /* Mobile: Tabs dentro do card - mostrar apenas no mobile */
    .mobile-tabs-container.mobile-tabs-inside {
        display: none;
        margin-bottom: 1.5rem;
    }

    .mobile-tab {
        flex: 1;
        padding: 10px 8px;
        background: transparent;
        border: none;
        color: #7A7A7A;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        text-align: center;
    }

    .mobile-tab:hover {
        color: #DFDFDF;
    }

    .mobile-tab-active {
        color: #22C55E !important;
        background: rgba(34, 197, 94, 0.1);
        position: relative;
    }

    .mobile-tab-active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #22C55E;
        border-radius: 2px 2px 0 0;
    }

    /* Mobile: Esconder conteúdo desktop */
    .desktop-main-content {
        display: none !important;
    }

    .desktop-chart-header,
    .desktop-tabs {
        display: none !important;
    }

    /* Mobile: Conteúdo das tabs */
    .mobile-tab-content {
        display: block;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 0 !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }

    /* Mobile: Config Content */
    .mobile-config-content {
        display: block;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        border-left: none !important;
        border-right: none !important;
    }
    
    .mobile-config-content.mobile-tab-content {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 0 !important;
        padding: 20px !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }

    .mobile-config-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        margin-top: 0;
        padding-left: 0 !important;
        padding-right: 0 !important;
        text-align: left !important;
    }

    .mobile-config-title {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        color: #DFDFDF !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
    }

    .mobile-config-icon {
        color: #7A7A7A;
        font-size: 1rem;
    }

    .mobile-config-card {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .mobile-config-item {
        padding-bottom: 20px;
        border-bottom: 1px solid #1C1C1C;
    }

    .mobile-config-item:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
    }

    .mobile-config-label {
        font-size: 0.625rem;
        color: #7D7D7D;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 8px;
    }

    .mobile-config-value {
        font-size: 1rem;
        font-weight: 700;
        color: #DFDFDF;
        margin-bottom: 4px;
    }

    .mobile-config-desc {
        font-size: 0.75rem;
        color: #A1A1A1;
    }

    .mobile-config-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-top: 10px;
    }

    .mobile-config-param {
        border: 1px solid #1C1C1C;
        border-radius: 8px;
        padding: 12px;
    }

    .mobile-config-param-label {
        font-size: 0.75rem;
        color: #A1A1A1;
        margin-bottom: 4px;
    }

    .mobile-config-param-value {
        font-size: 1rem;
        font-weight: 700;
        color: #DFDFDF;
    }

    .mobile-config-profit {
        color: #22C55E !important;
    }

    .mobile-config-loss {
        color: #FF4747 !important;
    }

    .mobile-config-badge {
        display: inline-block;
        padding: 6px 12px;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 8px;
        margin-top: 8px;
    }

    .mobile-config-badge-text {
        font-size: 0.75rem;
        font-weight: 700;
        color: #22C55E;
    }

    .mobile-config-status {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
    }

    .mobile-config-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #22C55E;
        animation: pulse 2s infinite;
    }

    .mobile-config-status-text {
        font-size: 1rem;
        font-weight: 700;
        color: #22C55E;
    }

    .mobile-pause-btn {
        width: 100%;
        padding: 1rem 1.25rem;
        background: #FFD058;
        color: #000;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0;
        transition: background 0.2s;
    }

    .mobile-pause-btn:hover:not(:disabled) {
        background: #FFE07A;
    }

    .mobile-pause-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Mobile: Gráfico, Logs, Registro */
    .mobile-tab-content #market-chart {
        display: block !important;
        margin-bottom: 0 !important;
    }

    .mobile-chart-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }

    /* Mobile: Logs View */
    .mobile-tab-content #logs-view {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
        min-height: 600px;
        max-height: 80vh;
    }
    
    #logs-view {
        min-height: 600px !important;
        max-height: 80vh !important;
    }

    /* Mobile: Título do Gráfico - Padronizado */
    .mobile-chart-title {
        display: block;
        margin-bottom: 1rem;
        margin-top: 0;
        padding-bottom: 0;
        border-bottom: none;
    }
    
    .mobile-chart-title-text {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        color: #DFDFDF !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
        text-align: left !important;
    }
    
    /* Desktop: Esconder título do gráfico */
    @media (min-width: 769px) {
        .mobile-chart-title {
            display: none !important;
        }
    }

    /* Mobile: Título do Histórico - Padronizado */
    .mobile-logs-title {
        display: block;
        margin-bottom: 1rem;
        margin-top: 0;
        padding-bottom: 0;
        border-bottom: none;
    }
    
    .mobile-logs-title-text {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        color: #DFDFDF !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
        text-align: left !important;
    }
    
    /* Desktop: Esconder título do histórico */
    @media (min-width: 769px) {
        .mobile-logs-title {
            display: none !important;
        }
    }
    
    /* Mobile: Esconder tabela, mostrar cards */
    #logs-view .desktop-logs-table {
        display: none !important;
    }
    
    #logs-view .mobile-logs-cards {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    #logs-view .mobile-log-card {
        background: #00000066 !important;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        text-align: left;
    }
    
    #logs-view .mobile-log-time {
        font-size: 0.75rem;
        color: #A0A0A0;
        font-weight: 400;
        text-align: left;
        margin-bottom: 0.125rem;
    }
    
    #logs-view .mobile-log-type {
        font-size: 0.9rem;
        color: #FFFFFF;
        font-weight: 700;
        text-align: left;
        margin-bottom: 0.5rem;
    }
    
    #logs-view .mobile-log-separator {
        display: none;
    }
    
    #logs-view .mobile-log-footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
        text-align: left;
        align-items: center;
        border-top: 1px solid #404040;
        padding-top: 0.5rem;
        margin-top: 0.25rem;
    }
    
    #logs-view .mobile-log-invested {
        font-size: 0.75rem;
        color: #A0A0A0;
        font-weight: 400;
        text-align: left;
    }
    
    #logs-view .mobile-log-result {
        font-size: 0.75rem;
        font-weight: 400;
        text-align: left;
    }
    
    #logs-view .mobile-log-result-positive {
        color: #28a745;
    }
    
    #logs-view .mobile-log-result-negative {
        color: #dc3545;
    }
    
    #logs-view .mobile-log-result-value-positive {
        color: #28a745;
        font-weight: 600;
    }
    
    #logs-view .mobile-log-result-value-negative {
        color: #dc3545;
        font-weight: 600;
    }

    /* Desktop: Esconder cards, mostrar lista */
    .desktop-register-list {
        display: block;
    }
    
    .desktop-register-header {
        display: flex;
    }
    
    /* Mobile: Register Header - escondido por padrão */
    .mobile-register-header {
        display: none;
        margin-bottom: 1rem;
        margin-top: 0;
        text-align: left;
    }
    
    .mobile-register-title {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        color: #DFDFDF !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
        text-align: left !important;
    }
    
    .mobile-register-subtitle {
        display: none; /* Esconder subtítulo no mobile para padronizar */
    }
    
    /* Mobile: Register Empty State */
    .mobile-register-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        text-align: center;
        color: #A1A1A1;
    }
    
    .mobile-register-empty i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #7D7D7D;
    }
    
    .mobile-register-empty p {
        font-size: 0.875rem;
        margin: 0.5rem 0;
    }
    
    .mobile-register-empty-subtitle {
        font-size: 0.75rem;
        color: #7D7D7D;
    }
    
    /* Mobile: Register Cards - escondido por padrão */
    .mobile-register-cards {
        display: none;
        padding: 0;
    }
    
    .mobile-register-cards-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0;
    }
    
    .mobile-register-card {
        background: rgba(11, 11, 11, 0.8);
        border: 1px solid #1C1C1C;
        border-radius: 12px;
        padding: 0.875rem 1rem;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 0.75rem;
        text-align: left;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease;
    }
    
    .mobile-register-card:hover {
        border-color: rgba(34, 197, 94, 0.2);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    
    .mobile-register-time {
        font-size: 0.75rem;
        color: #7A7A7A;
        font-weight: 400;
        text-align: left;
        flex-shrink: 0;
        white-space: nowrap;
        font-family: 'Courier New', monospace;
        margin-top: 0.125rem;
    }
    
    .mobile-register-message {
        font-size: 0.875rem;
        color: #DFDFDF;
        font-weight: 400;
        text-align: left;
        line-height: 1.5;
        flex: 1;
        word-wrap: break-word;
    }
    
    /* Cores para mensagens de log no mobile */
    .mobile-log-success {
        color: #22C55E !important;
        font-weight: 500;
    }
    
    .mobile-log-error {
        color: #FF4747 !important;
        font-weight: 500;
    }
    
    .mobile-log-default {
        color: #DFDFDF !important;
    }
    
    .mobile-register-message .text-blue-400 {
        color: #60a5fa;
    }
    
    .mobile-register-message .text-gray-400 {
        color: #9ca3af;
    }
    
    .mobile-register-message .text-purple-400 {
        color: #c084fc;
    }
    
    .mobile-register-message .text-yellow-400 {
        color: #facc15;
    }
    
    .mobile-register-message .text-cyan-400 {
        color: #22d3ee;
    }
    
    .mobile-register-message .text-green-400 {
        color: #4ade80;
    }
    
    .mobile-register-message .text-orange-400 {
        color: #fb923c;
    }
    
    .mobile-register-message .text-red-500 {
        color: #ef4444;
    }
    
    .mobile-register-icon {
        font-size: 1rem;
        flex-shrink: 0;
    }
    
    /* Mobile: Esconder lista e header desktop, mostrar cards e header mobile */
    @media (max-width: 768px) {
        .desktop-register-list {
            display: none !important;
        }
        
        .desktop-register-header {
            display: none !important;
        }
        
        .mobile-register-cards {
            display: flex !important;
            flex-direction: column;
            background: transparent !important;
        }
        
        .mobile-register-header {
            display: block !important;
        }
        
        /* Mobile: Ajustar espaçamento do registro */
        #register-view {
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            background: transparent !important;
            background-color: transparent !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            padding: 0px !important;
        }
        
        .mobile-register-cards-container {
            padding: 0;
            background: transparent !important;
            border: none !important;
        }
        
        .mobile-register-header {
            padding: 0;
            margin-bottom: 1rem;
            margin-top: 0;
        }
        
        .mobile-register-card {
            padding: 1rem;
            gap: 0.5rem;
            background: #00000066 !important;
        }
        
        .mobile-register-time {
            font-size: 0.7rem;
        }
        
        .mobile-register-message {
            font-size: 0.8rem;
        }
    }

    /* Mobile: Register View - apenas no mobile */
    @media (max-width: 768px) {
        #register-view {
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            background: transparent !important;
            background-color: transparent !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            padding: 0px !important;
        }
        
        .mobile-tab-content #register-view,
        #register-view.mobile-tab-content {
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            background: transparent !important;
            background-color: transparent !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            padding: 0px !important;
        }
    }

    /* Animações da barra de progresso */
    @keyframes fillSegment1 {
        0%, 33% {
            background-color: #22C55E;
        }
        34%, 100% {
            background-color: #1C1C1C;
        }
    }

    @keyframes fillSegment2 {
        0%, 33% {
            background-color: #1C1C1C;
        }
        34%, 66% {
            background-color: #22C55E;
        }
        67%, 100% {
            background-color: #1C1C1C;
        }
    }

    @keyframes fillSegment3 {
        0%, 66% {
            background-color: #1C1C1C;
        }
        67%, 100% {
            background-color: #22C55E;
        }
    }

    @keyframes shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }

    /* Status Footer - esconder no mobile */
    .status-footer-section {
        display: none !important;
    }
}

/* Desktop: esconder barra de progresso mobile (apenas quando está fora do card) */
@media (min-width: 769px) {
    .mobile-progress-section {
        display: none;
    }
    
    /* Manter progresso visível dentro do card unificado */
    #compact-performance-panel .mobile-progress-container {
        display: flex;
    }
}

/* Tooltip Styles */
.tooltip-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: help;
    margin-left: 4px;
    vertical-align: middle;
}

.icon-help {
    width: 14px;
    height: 14px;
    color: #94a3b8;
    transition: color 0.2s;
    flex-shrink: 0;
}

.icon-help:hover {
    color: #fff;
}

.tooltip-text {
    visibility: hidden;
    opacity: 0;
    background-color: #1e293b;
    color: #fff;
    text-align: left;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    width: max-content;
    max-width: 250px;
    white-space: nowrap;
    position: absolute;
    z-index: 10000;
    bottom: 100%;
    left: 50%;
    margin-bottom: 8px;
    transform: translateX(-50%);
    transition: opacity 0.2s ease, visibility 0.2s ease;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    border: 1px solid #334155;
}

.tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1e293b transparent transparent transparent;
}

.tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}

/* Ajustar config-label para suportar tooltips */
.config-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    position: relative;
}
/* End Tooltip Styles */

/* Tailwind-like utility classes for new layout */
.grid {
    display: grid;
}

.grid-cols-12 {
	grid-template-columns: repeat(12, minmax(0, 1fr));
	width: 100%;
	box-sizing: border-box;
}

.col-span-2 {
	grid-column: span 2 / span 2;
	width: 100%;
	box-sizing: border-box;
}

.col-span-3 {
	grid-column: span 3 / span 3;
	width: 100%;
	box-sizing: border-box;
}

.col-span-4 {
	grid-column: span 4 / span 4;
	width: 100%;
	box-sizing: border-box;
}

.col-span-6 {
	grid-column: span 6 / span 6;
	width: 100%;
	box-sizing: border-box;
}

.col-span-8 {
	grid-column: span 8 / span 8;
	width: 100%;
	box-sizing: border-box;
}

.gap-2 {
    gap: 0.5rem;
}

.gap-3 {
    gap: 0.75rem;
}

.gap-6 {
    gap: 1.5rem;
}

.gap-4 {
    gap: 1rem;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mb-1 {
    margin-bottom: 0.25rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mb-3 {
    margin-bottom: 0.75rem;
}

.mt-1 {
    margin-top: 0.25rem;
}

.mt-0\.5 {
    margin-top: 0.125rem;
}

.p-3 {
    padding: 0.75rem;
}

.p-5 {
    padding: 1.25rem;
}

.p-6 {
    padding: 1.5rem;
}

.px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}

.py-1\.5 {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
}

.py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
}

.pt-5 {
    padding-top: 1.25rem;
}

.pb-5 {
    padding-bottom: 1.25rem;
}

.py-5 {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
}

.h-\[72px\] {
	height: 100px;
}

.h-\[100px\] {
	height: 100px;
}

.h-\[600px\] {
    height: 600px;
}

.h-\[720px\] {
    height: 720px;
}

.h-\[400px\] {
    height: 400px;
}

.h-\[520px\] {
    height: 520px;
}

.h-full {
    height: 100%;
}

.w-full {
    width: 100%;
}

.w-12 {
    width: 3rem;
}

.h-12 {
    height: 3rem;
}

.w-2 {
    width: 0.5rem;
}

.h-2 {
    height: 0.5rem;
}

.w-8 {
    width: 2rem;
}

.h-8 {
    height: 2rem;
}

.max-w-\[280px\] {
    max-width: 280px;
}

.min-w-0 {
    min-width: 0;
}

.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.flex-shrink-0 {
    flex-shrink: 0;
}

.flex-1 {
    flex: 1 1 0%;
}

.items-center {
    align-items: center;
}

.items-start {
    align-items: flex-start;
}

.items-baseline {
    align-items: baseline;
}

.items-end {
    align-items: flex-end;
}

.justify-between {
    justify-content: space-between;
}

.justify-center {
    justify-content: center;
}

.justify-end {
    justify-content: flex-end;
}

.space-x-1\.5 {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.375rem * var(--tw-space-x-reverse));
    margin-left: calc(0.375rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-2 {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-4 {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-6 {
    --tw-space-x-reverse: 0;
    margin-right: calc(1.5rem * var(--tw-space-x-reverse));
    margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.relative {
    position: relative;
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

.z-10 {
    z-index: 10;
}

.overflow-hidden {
    overflow: hidden;
}

.overflow-y-auto {
    overflow-y: auto;
}

.rounded-2xl {
    border-radius: 1rem;
}

.rounded-xl {
    border-radius: 0.75rem;
}

.rounded-lg {
    border-radius: 0.5rem;
}

.rounded-full {
    border-radius: 9999px;
}

.border {
    border-width: 1px;
}

.border-b {
    border-bottom-width: 1px;
}

.border-zenix-border {
    border-color: #1C1C1C;
}

.border-zenix-border\/50 {
    border-color: rgba(28, 28, 28, 0.5);
}

.border-zenix-green {
    border-color: #22C55E;
}

.border-zenix-green\/10 {
    border-color: rgba(34, 197, 94, 0.1);
}

.border-zenix-green\/20 {
    border-color: rgba(34, 197, 94, 0.2);
}

.border-zenix-green\/30 {
    border-color: rgba(34, 197, 94, 0.3);
}

.bg-zenix-card {
    background-color: #0E0E0E;
}

.bg-zenix-bg {
    background-color: #0B0B0B;
}

.bg-zenix-green {
    background-color: #22C55E;
}

.bg-zenix-green\/10 {
    background-color: rgba(34, 197, 94, 0.1);
}

.bg-zenix-green\/15 {
    background-color: rgba(34, 197, 94, 0.15);
}

.bg-zenix-green\/20 {
    background-color: rgba(34, 197, 94, 0.2);
}

.bg-zenix-yellow {
    background-color: #FFD058;
}

.bg-gradient-to-b {
    background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-\[#0B0B0B\] {
    --tw-gradient-from: #0B0B0B;
    --tw-gradient-to: transparent;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-\[#080808\] {
    --tw-gradient-to: #080808;
}

.from-\[#22C55E\]\/8 {
    --tw-gradient-from: rgba(34, 197, 94, 0.08);
    --tw-gradient-to: transparent;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.from-\[#22C55E\]\/5 {
    --tw-gradient-from: rgba(34, 197, 94, 0.05);
    --tw-gradient-to: transparent;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-transparent {
    --tw-gradient-to: transparent;
}

.text-zenix-text {
    color: #DFDFDF;
}

.text-zenix-secondary {
    color: #A1A1A1;
}

.text-zenix-label {
    color: #7A7A7A;
}

.text-zenix-green {
    color: #22C55E;
}

.text-zenix-green\/60 {
    color: rgba(34, 197, 94, 0.6);
}

.text-zenix-green\/80 {
    color: rgba(34, 197, 94, 0.8);
}

.text-zenix-red {
    color: #FF4747;
}

.text-black {
    color: #000;
}

.text-\[9px\] {
    font-size: 9px;
}

.text-\[10px\] {
    font-size: 10px;
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

.text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
}

.text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

.text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
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

.font-light {
    font-weight: 300;
}

.uppercase {
    text-transform: uppercase;
}

.tracking-wide {
    letter-spacing: 0.025em;
}

.leading-tight {
    line-height: 1.25;
}

.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.duration-700 {
    transition-duration: 700ms;
}

.cursor-pointer {
    cursor: pointer;
}

.pointer-events-none {
    pointer-events: none;
}

.opacity-40 {
    opacity: 0.4;
}

.hover\:bg-\[#FFE07A\]:hover {
    background-color: #FFE07A;
}

.hover\:text-zenix-text:hover {
    color: #DFDFDF;
}

.hover\:border-zenix-green:hover {
    border-color: #22C55E;
}

.hover\:text-zenix-green:hover {
    color: #22C55E;
}

/* AI Pulse Animation */
.ai-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

/* Status Animation SVG */
#status-animation {
    width: 100%;
    height: 100%;
}

#status-animation svg {
    width: 100%;
    height: 100%;
}

/* Specific IDs from HTML */
#iya1j {
	height: 100px;
	width: 100%;
	box-sizing: border-box;
}

#ie22vl {
	width: 100%;
	box-sizing: border-box;
}

#i790gh {
	width: 100%;
	box-sizing: border-box;
}

#i42e4g {
	width: 100%;
	box-sizing: border-box;
}

#ichwdn {
	width: 100%;
	box-sizing: border-box;
}

#ir8sfp {
    position: relative;
}

#i0k3nl {
	height: 800px;
	display: flex;
	flex-direction: column;
	position: static;
}

#i8cy7b {
    text-shadow: rgba(34, 197, 94, 0.3) 0px 0px 20px;
}

#idsh94 {
    text-shadow: rgba(255, 71, 71, 0.3) 0px 0px 20px;
    font-size: 20px;
    color: rgb(222, 59, 59);
}

/* Mobile: Ajustar fonte para 12px */
@media (max-width: 768px) {
    #idsh94 {
        font-size: 12px !important;
    }
    
    #i8cy7b {
        font-size: 12px !important;
    }
}

#ai-status-card {
	box-shadow: rgba(34, 197, 94, 0.08) 0px 0px 24px;
	position: relative;
	width: 100%;
	box-sizing: border-box;
}

#status-icon-container {
    position: relative;
}

/* Timeframe buttons */
.timeframe-btn {
    cursor: pointer;
    border: 1px solid;
}

.timeframe-btn.active {
    background-color: #22C55E;
    color: #000;
    border-color: #22C55E;
    font-weight: 700;
}

/* Eye button improvements */
.eye-btn {
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.6;
}

.eye-btn:hover {
    opacity: 1;
    color: #22C55E;
}

.pause-btn {

    margin-bottom: 5px;
    gap: 5px;
}

/* AI Animation Styles */
@keyframes ringPulse {
    0%, 100% {
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1);
    }
    50% {
        box-shadow: 0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2);
    }
}

@keyframes brainPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.9;
    }
}

@keyframes orbit1 {
    0% {
        transform: rotate(0deg) translateX(3rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(3rem) rotate(-360deg);
    }
}

@keyframes orbit2 {
    0% {
        transform: rotate(0deg) translateX(2.5rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(2.5rem) rotate(-360deg);
    }
}

@keyframes orbit3 {
    0% {
        transform: rotate(0deg) translateX(2rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(2rem) rotate(-360deg);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.6;
    }
    50% {
        transform: translateY(-10px) translateX(5px);
        opacity: 1;
    }
}

@keyframes streamRight {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateX(200%);
        opacity: 0;
    }
}

/* Gradiente suave entre preto e verde */
.status-card-gradient {
    background: linear-gradient(to right, 
        rgba(11, 11, 11, 1) 0%,
        rgba(11, 11, 11, 0.95) 20%,
        rgba(11, 11, 11, 0.85) 40%,
        rgba(20, 44, 15, 0.6) 60%,
        rgba(20, 44, 15, 0.8) 80%,
        rgba(20, 44, 15, 1) 100%
    );
    pointer-events: none;
    z-index: 2;
}

/* Background verde animado */
.status-card-green-bg {
    background-color: rgb(20, 44, 15);
    animation: background-blink 1s infinite ease-in-out;
    pointer-events: none;
    z-index: 1;
}

/* Animação de piscar do background verde - mais evidente */
@keyframes background-blink {
    0% {
        background-color: rgb(15, 35, 10); /* Cor 1 (Mais escura) */
    }
    50% {
        background-color: rgb(25, 60, 20); /* Cor 2 (Mais clara e evidente) */
    }
    100% {
        background-color: rgb(15, 35, 10); /* Volta à Cor 1 */
    }
}

/* ===== SCROLLBAR CUSTOMIZADA PARA LOGS ===== */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.3);
    border-radius: 4px;
    transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.5);
}

/* Firefox */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(16, 185, 129, 0.3) rgba(0, 0, 0, 0.3);
}

/* ========================================================== */
/* MOBILE RESPONSIVE STYLES                                   */
/* ========================================================== */
@media (max-width: 768px) {
    .investment-active-main {
        padding: 2rem;
    }
    
    /* Mobile: Header IA ORION */
    .mobile-ia-header {
        display: block;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .mobile-ia-title {
        font-size: 0; /* Esconder texto original no mobile */
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        animation: blink-slow 2s ease-in-out infinite;
    }
    
    .mobile-ia-title::before {
        content: "IA ";
        color: #22C55E;
        font-size: 1.2rem; /* Restaurar tamanho no pseudo-elemento */
        animation: blink-slow 2s ease-in-out infinite;
    }
    
    .mobile-ia-title::after {
        content: "ORION";
        color: #DFDFDF;
        font-size: 1.2rem; /* Restaurar tamanho no pseudo-elemento */
        animation: blink-slow 2s ease-in-out infinite;
    }
    
    @keyframes blink-slow {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
    
    .mobile-separator {
        height: 1px;
        background: linear-gradient(to right, transparent, #1C1C1C, transparent);
        margin-top: 0.75rem;
    }
    
    /* Mobile: Cards empilhados verticalmente */
    #compact-performance-panel {
        margin-bottom: 1rem;
    }
    
    #iya1j {
        grid-template-columns: 1fr !important;
        gap: 10px !important;
    }
    
    #iya1j > div {
        grid-column: span 1 !important;
    }
    
    /* Esconder card de status da IA no mobile */
    #ichwdn {
        display: none !important;
    }
    
    /* Mobile: Barra de Progresso Animada */
    .mobile-progress-section {
        display: block;
        margin: 1.5rem 0;
        padding: 0 0.5rem;
    }
    
    .mobile-progress-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .mobile-progress-bar {
        display: flex;
        gap: 4px;
        width: 100%;
        height: 8px;
    }
    
    .mobile-progress-segment {
        flex: 1;
        height: 100%;
        border-radius: 4px;
        background: #1C1C1C;
        border: 1px solid #22C55E;
        position: relative;
        overflow: hidden;
        transition: all 0.8s ease;
    }
    
    /* Segmentos coloridos apenas quando têm a classe filled */
    .mobile-progress-segment.filled {
        background: #22C55E;
        border-color: #22C55E;
        box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
    }
    
    .mobile-progress-text {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #A1A1A1;
        font-size: 0.75rem;
    }
    
    .mobile-progress-dot {
        width: 8px;
        height: 8px;
        background: #22C55E;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
        box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
    }
    
    .mobile-progress-labels {
        position: relative;
        min-height: 1.25rem;
    }
    
    .mobile-progress-label {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .mobile-progress-label.label-1 {
        animation: showLabel1 9s ease-in-out infinite;
    }
    
    .mobile-progress-label.label-2 {
        animation: showLabel2 9s ease-in-out infinite;
    }
    
    .mobile-progress-label.label-3 {
        animation: showLabel3 9s ease-in-out infinite;
    }
    
    @keyframes showLabel1 {
        0%, 30% {
            opacity: 1;
        }
        31%, 100% {
            opacity: 0;
        }
    }
    
    @keyframes showLabel2 {
        0%, 30% {
            opacity: 0;
        }
        31%, 63% {
            opacity: 1;
        }
        64%, 100% {
            opacity: 0;
        }
    }
    
    @keyframes showLabel3 {
        0%, 63% {
            opacity: 0;
        }
        64%, 97% {
            opacity: 1;
        }
        98%, 100% {
            opacity: 0;
        }
    }
    
    /* Mobile: Tabs (versão duplicada - manter para compatibilidade) */
    .mobile-tabs-container.mobile-tabs-outside {
        display: flex;
        gap: 0;
        border-bottom: 1px solid #1C1C1C;
        margin-bottom: 1.5rem;
        overflow-x: auto;
    }
    
    .mobile-tab {
        flex: 1;
        padding: 0.75rem 0.5rem;
        background: transparent;
        border: none;
        color: #A1A1A1;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        position: relative;
        transition: color 0.2s;
        text-align: center;
        min-width: 80px;
    }
    
    .mobile-tab:hover {
        color: #DFDFDF;
    }
    
    .mobile-tab-active {
        color: #22C55E;
    }
    
    .mobile-tab-active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #22C55E;
    }
    
    /* Mobile: Conteúdo Config */
    .mobile-config-content {
        display: block;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 0 !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }
    
    .mobile-config-content.mobile-tab-content {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 0 !important;
        padding: 20px !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }
    
    .mobile-config-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }
    
    .mobile-config-title {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        color: #DFDFDF !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
        text-align: left !important;
    }
    
    .mobile-config-icon {
        color: #FFFFFF;
        font-size: 1rem;
    }
    
    .mobile-config-card {
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    
    .mobile-config-content {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 0 !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }
    
    .mobile-config-content.mobile-tab-content {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 0 !important;
        padding: 20px !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }
    
    .mobile-config-header {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    .mobile-config-item {
        background: #00000066 !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: none !important;
        border-radius: 12px;
        padding: 20px !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
        text-align: left !important;
    }
    
    .mobile-config-item:last-of-type {
        margin-bottom: 0;
    }
    
    .mobile-config-label {
        font-size: 0.625rem;
        color: #7D7D7D;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
        text-align: left !important;
    }
    
    .mobile-config-value {
        font-size: 1rem;
        font-weight: 700;
        color: #FFFFFF;
        margin-bottom: 0.25rem;
        text-align: left !important;
    }
    
    .mobile-config-desc {
        font-size: 0.75rem;
        color: #A1A1A1;
        margin: 0;
        margin-top: 0.25rem;
        text-align: left !important;
    }
    
    .mobile-config-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-top: 0;
    }
    
    .mobile-config-param {
        background: #00000066 !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: none !important;
        border-radius: 12px;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
        text-align: left !important;
    }
    
    .mobile-config-param-label {
        font-size: 0.75rem;
        color: #A1A1A1;
        margin-bottom: 0.25rem;
        text-align: left !important;
    }
    
    .mobile-config-param-value {
        font-size: 1rem;
        font-weight: 700;
        color: #FFFFFF;
        text-align: left !important;
    }
    
    .mobile-config-profit {
        color: #22C55E;
    }
    
    .mobile-config-loss {
        color: #FF4747;
    }
    
    .mobile-config-badge {
        display: inline-block;
        padding: 0.375rem 0.75rem;
        background: #22C55E !important;
        border: none !important;
        border-radius: 8px;
        margin-top: 0.5rem;
        text-align: left !important;
    }
    
    .mobile-config-badge-text {
        font-size: 0.75rem;
        font-weight: 700;
        color: #FFFFFF !important;
    }
    
    .mobile-config-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        justify-content: flex-start !important;
        text-align: left !important;
    }
    
    .mobile-config-status-text {
        font-size: 1rem;
        font-weight: 700;
        color: #DFDFDF !important;
        text-align: left !important;
    }
    
    .mobile-config-status-dot {
        width: 8px;
        height: 8px;
        background: #22C55E;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .mobile-pause-btn {
        width: 100%;
        padding: 1rem 1.25rem;
        background: #FFD058;
        color: #000;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0;
        transition: background 0.2s;
    }
    
    .mobile-pause-btn:hover:not(:disabled) {
        background: #FFE07A;
    }
    
    .mobile-pause-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    /* Mobile: Esconder elementos desktop */
    .status-footer-section {
        display: none !important;
    }
    
    #i0k3nl {
        display: none !important;
    }
    
    /* Mobile: Ajustar cards de performance */
    #ie22vl,
    #i790gh,
    #i42e4g {
        height: auto;
        min-height: 80px;
        padding: 1rem;
    }
    
    /* Mobile: Mostrar label correto */
    .mobile-label-lucro {
        display: block;
    }
    
    @media (max-width: 768px) {
        .mobile-label-lucro {
            display: block;
        }
    }
    
    /* Mobile: Ajustar grid principal */
    .grid.grid-cols-12 {
        grid-template-columns: 1fr !important;
    }
    
    #ir8sfp {
        grid-column: span 1 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Mobile: Ajustar altura do gráfico */
    #chart-view {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        min-height: 0 !important;
        height: auto !important;
        border-radius: 12px;
    }
    
    #logs-view,
    #register-view {
        height: 100% !important;
        min-height: 600px;
        border-radius: 12px;
    }
    
    /* Remover qualquer borda do register-view no mobile */
    @media (max-width: 768px) {
        #register-view,
        #register-view[class*="border"],
        .mobile-tab-content#register-view,
        #register-view.mobile-tab-content {
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            border-top: none !important;
            border-right: none !important;
            border-bottom: none !important;
            border-left: none !important;
            outline: none !important;
            outline-width: 0 !important;
            outline-style: none !important;
            outline-color: transparent !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
        }
    }
    
    /* Mobile: Aplicar estilos no registro */
    @media (max-width: 768px) {
        #register-view {
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            background: transparent !important;
            background-color: transparent !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            padding: 0px !important;
        }
        
        .mobile-tab-content#register-view,
        #register-view.mobile-tab-content {
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
        }
    }
    
    /* Mobile: Chart View */
    @media (max-width: 768px) {
        #market-chart #chart-view {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            position: relative !important;
            outline: none !important;
            outline-offset: 0 !important;
            height: auto !important;
            min-height: 600px;
        }
        
        #market-chart #chart-view {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            min-height: 0 !important;
        }
        
        #market-chart #chart-view .chart-container {
            flex: 1 !important;
            min-height: 0 !important;
            height: 100% !important;
        }
        
        #market-chart #logs-view {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            position: relative !important;
            outline: none !important;
            outline-offset: 0 !important;
        }
        
        #market-chart #register-view {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            position: relative !important;
            outline: none !important;
            outline-offset: 0 !important;
        }
        
        /* Mobile: Estilos do registro já estão consolidados na seção específica acima */
    }
    
    /* Mobile: Esconder tabs desktop */
    .desktop-tabs {
        display: none !important;
    }
    
    /* Mobile: Ajustar header do gráfico - Padronizar títulos */
    .desktop-chart-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
        margin-bottom: 1rem;
        margin-top: 0;
    }
    
    .desktop-chart-header h2 {
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        color: #DFDFDF !important;
        margin: 0 !important;
        margin-bottom: 0 !important;
    }
    
    .desktop-chart-header p {
        display: none; /* Esconder subtítulo no mobile */
    }
    
    /* Mobile: Mostrar conteúdo das tabs baseado na tab ativa */
    .mobile-tab-content {
        display: block;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 12px !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }
    
    /* Mobile: Ajustar conteúdo do gráfico para mobile */
    #market-chart {
        padding: 1rem;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    
    /* Mobile: Garantir que o container principal ocupe 100% */
    .desktop-main-content {
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    /* Mobile: Esconder tabs fora do card (versão antiga) */
    .mobile-tabs-container.mobile-tabs-outside {
        display: none !important;
    }

    /* Mobile: Mostrar tabs dentro do card */
    .mobile-tabs-container.mobile-tabs-inside {
        display: flex !important;
        margin-bottom: 1.5rem;
        background: transparent;
        border: none;
        border-radius: 0;
        padding: 0;
        border-bottom: 1px solid #1C1C1C;
        gap: 0;
        overflow-x: auto;
    }

    /* Mobile: Tabs no topo (acima do card IA ORION) */
    .mobile-tabs-container.mobile-tabs-top {
        display: flex !important;
        background: #0B0B0B;
        border: 1px solid #1C1C1C;
        border-radius: 0 !important;
        padding: 8px;
        gap: 4px;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        border-left: none !important;
        border-right: none !important;
    }

    /* Mobile: Ajustar estilo dos tabs dentro do card */
    #market-chart .mobile-tabs-container.mobile-tabs-inside .mobile-tab,
    .mobile-config-content .mobile-tabs-container.mobile-tabs-inside .mobile-tab {
        flex: 1;
        padding: 0.75rem 0.5rem;
        background: transparent;
        border: none;
        color: #A1A1A1;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s ease;
    }

    #market-chart .mobile-tabs-container.mobile-tabs-inside .mobile-tab:hover,
    .mobile-config-content .mobile-tabs-container.mobile-tabs-inside .mobile-tab:hover {
        color: #DFDFDF;
    }

    #market-chart .mobile-tabs-container.mobile-tabs-inside .mobile-tab-active,
    .mobile-config-content .mobile-tabs-container.mobile-tabs-inside .mobile-tab-active {
        color: #22C55E !important;
        position: relative;
    }

    #market-chart .mobile-tabs-container.mobile-tabs-inside .mobile-tab-active::after,
    .mobile-config-content .mobile-tabs-container.mobile-tabs-inside .mobile-tab-active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #22C55E;
        border-radius: 2px 2px 0 0;
    }
    
    /* Mobile: Tabs dentro do conteúdo de configuração */
    .mobile-config-content .mobile-tabs-container.mobile-tabs-inside {
        display: flex !important;
        margin-bottom: 1.5rem;
        margin-top: 1rem;
        background: transparent;
        border: none;
        border-radius: 0;
        padding: 0;
        border-bottom: 1px solid #1C1C1C;
        gap: 0;
        overflow-x: auto;
    }
    
    /* Mobile: Ajustar histórico para mobile */
    #logs-view {
        padding: 0;
    }
    
    .logs-table-wrapper {
        padding: 0.5rem;
    }
    
    .logs-table {
        font-size: 0.7rem;
    }
    
    .logs-table th,
    .logs-table td {
        padding: 0.5rem 0.25rem;
    }
    
    /* Mobile: Ajustar registro para mobile - removido (já está na seção específica acima) */
    
    /* Mobile: Mostrar grid principal mas ajustado */
    .desktop-main-content {
        display: block !important;
        grid-template-columns: 1fr !important;
        gap: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    
    /* Mobile: Mostrar/esconder conteúdo baseado na tab ativa */
    .mobile-tab-content {
        display: block;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: 12px !important;
        padding: 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        position: relative !important;
        outline: 1px solid rgba(34, 197, 94, 0.04) !important;
        outline-offset: -1px !important;
    }
    
    /* Mobile: Ajustar visibilidade baseado na tab */
    .desktop-main-content {
        display: block !important;
    }
    
    /* Mobile: Esconder informações do mercado no desktop */
    .desktop-hidden {
        display: none !important;
    }
    
    @media (max-width: 768px) {
        .desktop-hidden {
            display: block !important;
        }
        
        .mobile-market-info {
            padding: 0.5rem 1rem 1rem 1rem;
            padding-top: 0.5rem;
            border-top: 1px solid #1C1C1C;
            background: #0b0b0b !important;
            background-color: #0b0b0b !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-radius: 12px;
            border: 1px solid #1C1C1C;
        }
        
        /* Garantir que mobile-market-info só apareça no tab do gráfico */
        /* Esconder quando não estiver dentro do chart-view */
        #logs-view ~ .mobile-market-info,
        #register-view ~ .mobile-market-info,
        #logs-view .mobile-market-info,
        #register-view .mobile-market-info {
            display: none !important;
        }
        
        /* Garantir que só apareça dentro do chart-view */
        #chart-view .mobile-market-info {
            display: block !important;
        }
        
        /* Mobile: Aplicar gradiente nos cards premium no mobile */
        .premium-card {
            background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
            background-color: transparent !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
        }
    }
    
    /* Mobile: Ajustar card do gráfico - aplicar background gradiente */
    @media (max-width: 768px) {
        #market-chart {
            border-radius: 12px !important;
            border-left: none !important;
            border-right: none !important;
            border-top: none !important;
            border-bottom: none !important;
            padding: 20px !important;
            margin-bottom: 0 !important;
            background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
            background-color: transparent !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: none !important;
            box-shadow: none !important;
            position: relative !important;
            outline: none !important;
            outline-offset: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
        
        /* Aplicar background gradiente nas classes do market-chart no mobile */
        #market-chart.bg-zenix-card,
        #market-chart.premium-card {
            background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
            background-color: transparent !important;
        }
    }
    
    /* Mobile: Ajustar título do gráfico */
    #market-chart h2 {
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }
    
    #market-chart p {
        font-size: 0.7rem;
    }
    
    /* Mobile: Ajustar controles do gráfico */
    .mobile-chart-controls {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .mobile-chart-controls button {
        font-size: 0.7rem;
        padding: 0.5rem 0.75rem;
    }
    
    /* Mobile: Ajustar histórico para cards */
    #logs-view {
        padding: 1rem;
    }
    
    #logs-view .logs-table {
        font-size: 0.65rem;
    }
    
    #logs-view .logs-table th {
        font-size: 0.7rem;
        padding: 0.5rem 0.25rem;
    }
    
    #logs-view .logs-table td {
        font-size: 0.65rem;
        padding: 0.5rem 0.25rem;
    }
    
    /* Mobile: Ajustar registro */
    /* Mobile: Estilos do registro já estão consolidados na seção acima */
}

/* Desktop: Esconder elementos mobile */
@media (min-width: 769px) {
    .mobile-progress-section,
    .mobile-tabs-container,
    .mobile-tabs-container.mobile-tabs-outside,
    .mobile-tabs-container.mobile-tabs-inside,
    .mobile-tabs-container.mobile-tabs-top,
    .mobile-config-content,
    .mobile-performance-panel,
    .mobile-register-title,
    .mobile-register-subtitle,
    .mobile-market-info,
    .mobile-logs-title,
    .mobile-chart-title,
    .desktop-hidden {
        display: none !important;
    }
    
    /* Desktop: Garantir que todos os cards premium tenham fundo #0b0b0b */
    .premium-card {
        background: #0b0b0b !important;
        background-color: #0b0b0b !important;
    }
    
    /* Desktop: Mostrar tabela, esconder cards */
    #logs-view .desktop-logs-table {
        display: block !important;
    }
    
    #logs-view .mobile-logs-cards {
        display: none !important;
    }
    
    /* Desktop: Mostrar layout original */
    .desktop-performance-panel {
        display: block !important;
    }
    
    /* Desktop: Mostrar grid principal */
    .desktop-main-content {
        display: grid !important;
    }
    
    /* Desktop: Mostrar lista de registro, esconder cards */
    .desktop-register-list {
        display: block !important;
    }
    
    .mobile-register-cards {
        display: none !important;
    }
}
</style>