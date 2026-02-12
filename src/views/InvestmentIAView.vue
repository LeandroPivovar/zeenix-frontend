<template>
    <div class="zenix-layout">
        <!-- Sidebar -->
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="localSidebarCollapsed" 
            :is-mobile="isMobile"
            @toggle-collapse="toggleSidebarCollapse"
            @close-sidebar="closeSidebar"
        />

        <div class="dashboard-content-wrapper transition-all duration-300" :class="{ 'sidebar-collapsed': localSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="localSidebarCollapsed"
            :balance="info?.balance"
            :account-type="accountType"
            :balances-by-currency-real="balancesByCurrencyReal"
            :balances-by-currency-demo="balancesByCurrencyDemo"
            :currency-prefix="preferredCurrencyPrefix"
            @open-settings="toggleSettingsModal"
            @account-type-changed="handleAccountTypeChange"
            @toggle-sidebar="toggleSidebar"
            @toggle-sidebar-collapse="toggleSidebarCollapse"
        />
        
        <!-- Settings Sidebar -->
        <SettingsSidebar
            :is-open="showSettingsModal"
            :balance="info?.balance"
            :account-type="accountType"
            :balances-by-currency-real="balancesByCurrencyReal"
            :balances-by-currency-demo="balancesByCurrencyDemo"
            :currency-prefix="preferredCurrencyPrefix"
            :active-service="'ia'"
            @close="closeSettingsModal"
            @account-type-changed="handleAccountTypeChange"
        />

            <main class="main-content" style="margin-top: 0px;">
                <!-- AI Vision Panel - Only show when IA is inactive -->
                <section id="ai-vision-panel" class="fade-in" style="margin-bottom: 1.5rem;" v-if="!isInvestmentActive">
                    <div class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card glow-green ai-vision-container">
                        <!-- Header Desktop -->
                        <div v-if="!isMobile" class="mb-6 ai-vision-header-desktop">
                            <div class="flex items-center justify-between">
                                <div class="text-left">
                                    <h1 class="text-xl font-bold text-zenix-text mb-1">Painel de Configuração da IA</h1>
                                    <p class="text-sm text-zenix-secondary">Escolha um dos Agentes de investimento, defina sua configuração, inicie e acompanhe os resultados.</p>
                                </div>
                                <button @click="showHistoryModal = true" 
                                        class="px-6 py-3 rounded-xl bg-success/10 hover:bg-success/20 border border-success/30 hover:border-success/40 transition-all duration-200 flex items-center gap-2 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success group-hover:scale-110 transition-transform">
                                        <path d="M3 3v18h18"/>
                                        <path d="m19 9-5 5-4-4-3 3"/>
                                    </svg>
                                    <span class="text-sm font-bold text-success uppercase tracking-wide">Histórico</span>
                                </button>
                            </div>
                        </div>
                        <!-- Header Mobile -->
                        <div v-if="isMobile" class="mb-6 ai-vision-header-mobile">
                            <div class="flex items-center justify-between">
                                <div class="text-left">
                                    <h1 class="text-xl font-bold text-zenix-text mb-1">Configuração da IA</h1>
                                    <p class="text-sm text-zenix-secondary">Escolha uma das IAs de investimento, defina sua configuração, inicie e acompanhe os resultados.</p>
                                </div>
                                <div class="ai-chip-icon-mobile">
                                    <i class="fas fa-brain text-[#22C55E] text-2xl"></i>
                                </div>
                            </div>
                            
                            <!-- Mobile History Button -->
                            <button 
                                @click="showHistoryModal = true"
                                class="w-full mt-4 py-3 bg-transparent border border-[#22C55E] rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#22C55E]/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#22C55E]"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                <span class="text-xs font-black text-[#22C55E] uppercase tracking-widest">HISTÓRICO</span>
                            </button>
                        </div>
                        <div class="grid grid-cols-12 gap-5">
                            <!-- AI Visualization Area (Desktop Only) -->
                            <div v-if="!isMobile" class="col-span-5 h-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-zenix-green/10 to-transparent border-2 border-zenix-green/30 flex items-center justify-center relative ai-visualization-area">
                                <div class="absolute inset-0 bg-gradient-to-br from-zenix-green/5 via-transparent to-zenix-green/10"></div>
                                <!-- Animated Grid Background -->
                                <div class="absolute inset-0 opacity-20">
                                    <div id="i9dlnn" class="absolute inset-0"></div>
                                </div>
                                <!-- Central AI Core -->
                                <div class="relative z-10 flex items-center justify-center ai-core-mobile" style="width: 100%; height: 100%;">
                                    <!-- Outer Rotating Ring -->
                                    <div id="irazem" class="absolute w-40 h-40 border-2 border-zenix-green/30 rounded-full ai-glow-ring" style="opacity: 1;"></div>
                                    <!-- Middle Rotating Ring -->
                                    <div id="i5uptv" class="absolute w-32 h-32 border-2 border-zenix-green/40 rounded-full" style="opacity: 1;"></div>
                                    <!-- Inner Pulsing Core -->
                                    <div class="absolute w-24 h-24 bg-zenix-green/20 rounded-full blur-xl ai-pulse" style="opacity: 1;"></div>
                                    <!-- Central Robot Icon -->
                                    <div class="relative z-30 ai-brain-glow" style="display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-brain text-zenix-green text-5xl" style="opacity: 1 !important; display: block !important; visibility: visible !important; font-size: 3rem !important;"></i>
                                    </div>
                                    <!-- Orbiting Data Nodes -->
                                    <div id="iyljui" class="absolute w-3 h-3 bg-zenix-green rounded-full" style="opacity: 1;"></div>
                                    <div id="isxtjr" class="absolute w-2 h-2 bg-zenix-green/70 rounded-full" style="opacity: 1;"></div>
                                    <div id="ijse57" class="absolute w-2.5 h-2.5 bg-zenix-green/80 rounded-full" style="opacity: 1;"></div>
                                </div>
                                <!-- Floating Particles -->
                                <div class="absolute inset-0 overflow-hidden">
                                    <div id="iw45yh" class="absolute w-1 h-1 bg-zenix-green rounded-full"></div>
                                    <div id="i2cpbj" class="absolute w-1.5 h-1.5 bg-zenix-green/70 rounded-full"></div>
                                    <div id="ispbex" class="absolute w-1 h-1 bg-zenix-green/60 rounded-full"></div>
                                    <div id="i7wi6r" class="absolute w-1.5 h-1.5 bg-zenix-green rounded-full"></div>
                                </div>
                                <!-- Data Stream Lines -->
                                <div class="absolute inset-0 overflow-hidden opacity-30">
                                    <div id="ivhu5o" class="absolute h-px w-20 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
                                    <div id="iybi4e" class="absolute h-px w-16 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
                                    <div id="icjipi" class="absolute h-px w-24 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
                                </div>
                            </div>
                            <!-- Status Cards -->
                            <div :class="isMobile ? 'col-span-12' : 'col-span-7'" class="grid grid-cols-2 gap-4 status-cards-container">
                                <!-- Card 1: ESTRATÉGIAS -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-brain text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">ESTRATÉGIAS</p>
                                    </div>
                                    <p class="text-xs text-white status-value">5 IAs Especializadas</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">IAs para diferentes perfis</p>
                                </div>
                                <!-- Card 2: DESEMPENHO -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-chart-line text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">DESEMPENHO</p>
                                    </div>
                                    <p class="text-xs text-white status-value">60% a 75%</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Varia por estratégia e modo</p>
                                </div>
                                <!-- Card 3: CONTROLE -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-sliders-h text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">CONTROLE</p>
                                    </div>
                                    <p class="text-xs text-white status-value">Parcial com Supervisão</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Você decide quando operar</p>
                                </div>
                                <!-- Card 4: SEGURANÇA -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-shield-alt text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">SEGURANÇA</p>
                                    </div>
                                    <p class="text-xs text-white status-value">Stop Loss Duplo</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Normal + Blindado automáticos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Configuration Cards Grid - Only show when IA is inactive -->
                <div class="config-grid" v-if="!isInvestmentActive">
                    <!-- Mercado & Estratégia -->
                    <div id="market-strategy-card" class="config-card premium-card">
                        <div class="card-content">
                            <div class="form-group">
                                <label class="form-label">
                                    Estratégia
                                    <ZenixTooltip :offset="20"> 
                                        <p>Modelo de análise usado pela IA</p>
                                    </ZenixTooltip>
                                </label>
                                <!-- Premium Selector Button -->
                                <button 
                                    @click="openStrategyModal"
                                    class="premium-selector-btn"
                                >
                                    <div class="selector-content">
                                        <div class="selector-left">
                                            <div v-if="selectedStrategyObject" class="strategy-icons-inline mr-2">
                                                <div class="strategy-icon-box">
                                                    <img v-if="selectedStrategyObject.icons && selectedStrategyObject.icons.length > 0" :src="selectedStrategyObject.icons[0]" class="deriv-svg-icon" />
                                                    <i v-else :class="selectedStrategyObject.icon"></i>
                                                </div>
                                            </div>
                                            <span :class="{ 'placeholder': !selectedStrategy }">
                                                <template v-if="selectedStrategyObject">
                                                    {{ selectedStrategyObject.title }}
                                                </template>
                                                <template v-else>
                                                    Selecione uma estratégia
                                                </template>
                                            </span>
                                        </div>
                                        <i class="fas fa-chevron-right selector-arrow"></i>
                                    </div>
                                </button>
                                
                                <!-- Strategy Description Card (appears when selected) -->
                                <transition name="slide-fade" mode="out-in">
                                    <div v-if="selectedStrategy" :key="selectedStrategy" class="agent-description-card" :class="selectedStrategy">
                                        <div class="agent-desc-content">
                                            <div class="agent-desc-info">
                                                <p v-html="strategyDescription"></p>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                    </div>

                    <!-- Strategy Selection Modal (Premium Style) -->
                    <Teleport to="body">
                        <div v-if="showStrategyModal" class="modal-overlay" @click.self="closeStrategyModal">
                            <div class="modal-content categorized-modal" style="padding: 20px;">
                                <div class="modal-header-premium">
                                    <div class="modal-header-info">
                                        <h3 class="modal-title" style="font-size: 1.6rem;">Selecionar Estratégia</h3>
                                        <p class="modal-subtitle text-xs text-zenix-secondary mt-1">Escolha a melhor estratégia para sua operação.</p>
                                    </div>
                                    <button @click="closeStrategyModal" class="modal-close-btn">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <!-- Loading State -->
                                    <div v-if="isLoadingStrategies" class="flex flex-col items-center justify-center py-10 gap-4">
                                        <div class="w-10 h-10 border-4 border-zenix-green/30 border-t-zenix-green rounded-full animate-spin"></div>
                                        <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Carregando estratégias...</p>
                                    </div>
                                    <div v-else class="agents-modal-list">
                                        <div 
                                            v-for="strategy in availableStrategies" 
                                            :key="strategy.id"
                                            class="agent-option-premium"
                                            :class="{ 'active': selectedStrategy === strategy.id }"
                                            @click="selectStrategy(strategy.id)"
                                        >
                                            <div class="agent-option-content">
                                                <div class="agent-option-header-row">
                                                    <div class="strategy-icon-box-large" :class="strategy.id">
                                                        <img v-if="strategy.icons && strategy.icons.length > 0" :src="strategy.icons[0]" class="deriv-svg-icon" alt="strategy icon" />
                                                        <i v-else :class="strategy.icon"></i>
                                                        <i v-if="strategy.id !== 'apollo'" class="fas fa-lock mini-shield text-gray-400"></i>
                                                        <i v-else-if="strategy.id === 'nexus'" class="fas fa-shield-alt mini-shield"></i>
                                                    </div>
                                                    <div class="agent-option-main-info">
                                                        <h4 class="agent-option-title">{{ strategy.title }}</h4>
                                                        <p class="agent-option-desc">{{ strategy.description }}</p>
                                                    </div>
                                                    <div v-if="selectedStrategy === strategy.id" class="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#1b3324] border border-[#22c55e]/40 shadow-sm z-30 flex items-center justify-center min-w-[50px]">
                                                        <span class="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider text-center w-full">Ativo</span>
                                                    </div>
                                                </div>
                                                <div class="agent-option-footer-stats">
                                                    <div class="stat-item">
                                                        <span class="stat-label">precisão:</span>
                                                        <span class="stat-value stat-fluctuate-opacity">{{ strategy.assertividade }}</span>
                                                    </div>
                                                    <div class="stat-divider"></div>
                                                    <div class="stat-item">
                                                        <span class="stat-label">retorno:</span>
                                                        <span class="stat-value highlight stat-fluctuate-glow">{{ strategy.retorno }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Teleport>

                    <Teleport to="body">
                        <ImplementationModal
                            :visible="showImplementationModal"
                            entityType="IA"
                            :message="implementationMessage"
                            @close="showImplementationModal = false"
                        />
                    </Teleport>

                            <div class="form-group">
                                <label class="form-label">
                                    Modo de Negociação
                                    <ZenixTooltip :offset="20"> 
                                        <p>Define a frequência e a precisão das operações realizadas pela IA.</p>
                                    </ZenixTooltip>
                                </label>
                                <div class="mode-buttons">
                                    <button 
                                        id="modeVeloz" 
                                        :class="['mode-btn', { 'active': mode === 'veloz' }]"
                                        @click="mode = 'veloz'"
                                    >
                                        Veloz
                                    </button>
                                    <button 
                                        id="modeModerate" 
                                        :class="['mode-btn', { 'active': mode === 'moderado' }]"
                                        @click="mode = 'moderado'"
                                    >
                                        Normal
                                    </button>
                                    <button 
                                        id="modeLento" 
                                        :class="['mode-btn', { 'active': mode === 'lento' }]"
                                        @click="mode = 'lento'"
                                    >
                                        Preciso
                                    </button>
                                </div>
                                <p id="modeDescription" class="form-help">{{ modeDescription }}</p>
                            </div>
                            
                            <!-- Gerenciamento de Risco -->
                            <div class="form-group risk-management-section">
                                <label class="form-label">
                                    Gerenciamento de Risco
                                    <ZenixTooltip :offset="20"> 
                                        <p>Configura a estratégia de recuperação e o nível de exposição do capital.</p>
                                    </ZenixTooltip>
                                </label>
                                <div class="risk-buttons">
                                    <button 
                                        :class="['risk-btn', { 'active': modoMartingale === 'fixo' }]"
                                        @click="modoMartingale = 'fixo'"
                                    >
                                        Fixo
                                    </button>
                                    <button 
                                        :class="['risk-btn', { 'active': modoMartingale === 'conservador' }]"
                                        @click="modoMartingale = 'conservador'"
                                    >
                                        Conservador
                                    </button>
                                    <button 
                                        :class="['risk-btn', { 'active': modoMartingale === 'moderado' }]"
                                        @click="modoMartingale = 'moderado'"
                                    >
                                        Moderado
                                    </button>
                                    <button 
                                        :class="['risk-btn', { 'active': modoMartingale === 'agressivo' }]"
                                        @click="modoMartingale = 'agressivo'"
                                    >
                                        Agressivo
                                    </button>
                                </div>
                                
                                <div class="risk-indicator">
                                    <div class="risk-header">
                                        <span class="risk-label">Nível de Risco</span>
                                        <span id="riskLevelText" class="risk-level-text">{{ riskLevelText }}</span>
                                    </div>
                                    <div class="risk-bar-container">
                                        <div id="riskBar" class="risk-bar" :style="{ width: riskBarWidth }"></div>
                                    </div>
                                    <p id="riskDescription" class="risk-description">{{ riskDescriptionText }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Parâmetros de Entrada -->
                    <div id="entry-params-card" class="config-card premium-card">
                        <div class="card-content">
                            <div class="form-group">
                                <label class="form-label">
                                    Valor de Entrada
                                    <ZenixTooltip :offset="20"> 
                                        <p>Defina o valor da sua primeira operação. Todas as estratégias de recuperação e alavancagem (Soros) serão calculadas a partir deste valor base.</p>
                                    </ZenixTooltip>
                                </label>
                                <div class="input-wrapper">
                                    <span class="input-prefix">$</span>
                                    <input 
                                        type="number" 
                                        class="form-input" 
                                        v-model.number="entryValue"
                                        min="0.35"
                                        step="0.01"
                                    >
                                </div>
                                <p class="form-help">{{ entryPercent }}% do saldo</p>
                            </div>

                            <div class="form-group">
                                <label class="form-label">
                                    Alvo de Lucro
                                    <ZenixTooltip :offset="20"> 
                                        <p>Sua meta financeira para a sessão. O sistema encerrará as operações automaticamente assim que este valor for atingido ou superado.</p>
                                    </ZenixTooltip>
                                </label>
                                <div class="input-wrapper">
                                    <span class="input-prefix">$</span>
                                    <input 
                                        type="number" 
                                        class="form-input" 
                                        v-model.number="profitTarget"
                                        min="0"
                                        step="0.01"
                                    >
                                </div>
                                <p class="form-help">{{ profitPercent }}% do saldo</p>
                            </div>

                            <div class="loss-stoploss-row">
                                <div class="form-group flex-1">
                                    <label class="form-label">
                                        Limite de Perda
                                        <ZenixTooltip :offset="20"> 
                                            <p>O valor máximo que você aceita arriscar na sessão. Nosso sistema possui Stop de Precisão: ele ajusta automaticamente o valor da última entrada para garantir que você nunca perca mais do que definiu aqui.</p>
                                        </ZenixTooltip>
                                    </label>
                                    <div class="input-wrapper">
                                        <span class="input-prefix">$</span>
                                        <input 
                                            type="number" 
                                            class="form-input" 
                                            v-model.number="lossLimit"
                                            min="0"
                                            step="0.01"
                                        >
                                    </div>
                                    <p class="form-help">{{ lossPercent }}% do saldo</p>
                                </div>
                                
                                <div class="form-group flex-1">
                                    <label class="form-label">
                                        Stoploss Blindado
                                        <ZenixTooltip :offset="20"> 
                                            <p>Ative para proteção dinâmica. Quando você atinge 40% da meta, o sistema cria um 'piso de segurança' móvel. Se o mercado virar, o sistema para com lucro garantido (50% do pico), impedindo que você devolva seus ganhos.</p>
                                        </ZenixTooltip>
                                    </label>
                                    <div class="stoploss-blindado-wrapper">
                                        <div class="stoploss-blindado-label">
                                            <i class="fas fa-shield-alt"></i>
                                            <span>{{ stoplossBlindado ? 'Ativado' : 'Desativado' }}</span>
                                        </div>
                                        <label class="toggle-switch stoploss-toggle">
                                            <input 
                                                type="checkbox" 
                                                v-model="stoplossBlindado"
                                            >
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Controle da IA -->
                            <div class="form-group ai-status-group">
                                
                                <div class="ai-status-control-simple">
                                    
                                    <div class="ai-status-info">
                                        <label class="form-label">Status da IA</label>
                                        <p class="ai-status-subtitle">{{ isInvestmentActive ? 'Execução automática' : 'Ative para iniciar' }}</p>
                                    </div>
                                    <div class="ai-status-toggle-wrapper">
                                        <span class="ai-status-text" :class="{ 'active': isInvestmentActive }">
                                            {{ isInvestmentActive ? 'Ativada' : 'Desativada' }}
                                        </span>
                                        <label class="toggle-switch">
                                            <input 
                                                type="checkbox" 
                                                :checked="isInvestmentActive"
                                                @change="handleToggleChange"
                                            >
                                            <span class="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Chart Section - Only show when IA is active -->
                <section id="chart-section" class="chart-section" v-if="isInvestmentActive">
                <InvestmentActive 
                    :ticks="ticks" 
                    :current-price="currentPrice"
                    :entry-value-config="entryValue"
                    :profit-target-config="profitTarget"
                    :loss-limit-config="lossLimit"
                    :mode-config="mode"
                    :account-balance-prop="info?.balance || currentBalance?.balance || 0"
                    :account-currency-prop="tradeCurrency"
                    :selected-market-prop="selectedMarket"
                    :stoploss-blindado-config="stoplossBlindado"
                    :is-fictitious-balance-active="isFictitiousBalanceActive"
                    :fictitious-balance="fictitiousBalance"
                    :is-mobile="isMobile"
                    :realtime-logs-prop="realtimeLogs"
                    :log-operations-prop="logOperations"
                        @deactivate="deactivateIA"
                        @reactivate="activateIA"
                        @update-balance="handleLiveBalanceUpdate"
                        @refresh-balance="reloadBalance"
                />
                </section>

        </main>

        </div>
        <InsufficientBalanceModal
            :visible="showInsufficientBalanceModal"
            :currentBalance="balanceNumeric"
            :entryValue="entryValue"
            :currency="tradeCurrency"
            @confirm="showInsufficientBalanceModal = false"
        />
        <MinimumStakeModal
            :visible="showMinimumStakeModal"
            @confirm="showMinimumStakeModal = false"
        />
        <StrategyRequiredModal
            :visible="showStrategyRequiredModal"
            @close="showStrategyRequiredModal = false"
            @confirm="handleStrategyRequiredConfirm"
        />

        <!-- Account Selection Modal -->
        <Teleport to="body">
            <div 
                v-if="showAccountModal" 
                class="modal-overlay" 
                @click.self="showAccountModal = false"
            >
                <div class="categorized-modal" style="max-width: 550px">
                    <div class="modal-header-premium">
                        <h3 class="modal-title">Selecionar Conta</h3>
                        <button @click="showAccountModal = false" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="isLoadingAccounts" class="flex flex-col items-center justify-center py-10 gap-4">
                            <div class="w-10 h-10 border-4 border-zenix-green/30 border-t-zenix-green rounded-full animate-spin"></div>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Carregando contas disponíveis...</p>
                        </div>
                        <div v-else-if="availableAccounts.length === 0" class="text-center py-10">
                            <i class="fa-solid fa-triangle-exclamation text-yellow-500 text-3xl mb-4"></i>
                            <p class="text-white font-bold uppercase">Nenhuma conta encontrada</p>
                            <p class="text-gray-400 text-xs mt-2 font-bold uppercase">Certifique-se de que você está conectado à Deriv.</p>
                        </div>
                        <div v-else class="space-y-3">
                            <p class="text-xs text-[#7A7A7A] mb-4 font-semibold uppercase tracking-widest">Escolha a conta para iniciar as operações:</p>
                            <div 
                                v-for="account in availableAccounts" 
                                :key="account.loginid"
                                @click="selectAccount(account)"
                                class="account-card-premium"
                            >
                                <div class="flex items-center gap-4">
                                    <div 
                                        class="account-icon-box"
                                        :class="account.isDemo ? 'account-demo' : 'account-real'"
                                    >
                                        <i class="fa-solid" :class="account.isDemo ? 'fa-vial' : 'fa-dollar-sign'"></i>
                                    </div>
                                    <div>
                                        <div class="text-white font-bold text-sm">{{ account.loginid }}</div>
                                        <div class="text-[10px] uppercase font-bold tracking-wide" :class="account.isDemo ? 'text-orange-400' : 'text-[#22C55E]'">
                                            {{ account.isDemo ? 'Conta Demo' : 'Conta Real' }}
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-white font-bold tracking-tight text-base">{{ account.currency }} {{ formatAccountBalance(account.balance, account.isDemo) }}</div>
                                    <div class="text-[9px] text-[#7A7A7A] font-bold uppercase tracking-widest">Saldo Disponível</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
    <DesktopBottomNav />
    
    <!-- Session History Modal -->
    <SessionHistoryModal
        :visible="showHistoryModal"
        :userId="getUserId()"
        @close="showHistoryModal = false"
    />
    
</template>

<script>
import AppSidebar from '@/components/Sidebar.vue';
import TopNavbar from '@/components/TopNavbar.vue';
import SettingsSidebar from '@/components/SettingsSidebar.vue';
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';
import ZenixTooltip from '@/components/ZenixTooltip.vue';
import DesktopBottomNav from '@/components/DesktopBottomNav.vue';
import accountBalanceMixin from '@/mixins/accountBalanceMixin';
import { loadAvailableAccounts } from '@/utils/accountsLoader';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal.vue';
import MinimumStakeModal from '@/components/modals/MinimumStakeModal.vue';
import StrategyRequiredModal from '@/components/modals/StrategyRequiredModal.vue';
import { StrategyAnalysis } from '@/utils/StrategyAnalysis';
import SessionHistoryModal from '@/components/SessionHistoryModal.vue';
import { StrategiesService } from '@/services/StrategiesService';
import ImplementationModal from '@/components/modals/ImplementationModal.vue';

let strategiesPresets = [];

export default {
    name: 'InvestmentIAView',
    mixins: [accountBalanceMixin],
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        InvestmentActive,
        ZenixTooltip,
        DesktopBottomNav,
        InsufficientBalanceModal,
        MinimumStakeModal,
        StrategyRequiredModal,
        SessionHistoryModal,
        ImplementationModal
    },
    data() {
        return {
            isSidebarOpen: false,
            localSidebarCollapsed: true,
            isMobile: false,
            isInvestmentActive: false,
            isActivating: false,
            showSettingsModal: false,
            showInsufficientBalanceModal: false,
            showMinimumStakeModal: false,

            showStrategyRequiredModal: false,
            showAccountModal: false,
            showStrategyModal: false,
            showImplementationModal: false,
            implementationMessage: '',
            isLoadingStrategies: false,
            isLoadingAccounts: false,
            availableAccounts: [],
            selectedToken: null,
            activationEvent: null,

            ticks: [],
            currentPrice: null,
            pollingInterval: null,

            entryValue: 1,
            profitTarget: 100,
            lossLimit: 100,
            mode: 'veloz',
            modoMartingale: 'conservador',
            stoplossBlindado: false,

            selectedMarket: 'vol10',
            selectedStrategy: null,
            allStrategies: [
                { 
                    id: 'atlas', 
                    title: 'IA Atlas', 
                    marketType: 'Digits', 
                    icon: 'fas fa-shield-alt', 
                    icons: [], 
                    description: 'Híbrida: Dígitos + Price Action.',
                    assertividade: '92 a 96%',
                    retorno: '95% / 99%'
                },
                { 
                    id: 'apollo', 
                    title: 'IA Apollo', 
                    marketType: 'Ups e Downs', 
                    icon: 'fas fa-rocket', 
                    icons: [],
                    description: 'Densidade de Dígitos e Microtendências',
                    assertividade: '60% a 70%',
                    retorno: '19% a 126%'
                },
                { 
                    id: 'nexus', 
                    title: 'IA Nexus', 
                    marketType: 'Ups e Downs', 
                    icon: 'fas fa-chart-bar',
                    icons: [],
                    description: 'Price Action com Barreira.',
                    assertividade: '91% a 95%',
                    retorno: '91% / 95%'
                },
                { 
                    id: 'orion', 
                    title: 'IA Orion', 
                    marketType: 'Digits', 
                    icon: 'fas fa-star', 
                    icons: [],
                    description: 'Estatística de Dígitos e Recuperação.',
                    assertividade: '94% a 97%',
                    retorno: '95% / 99%'
                },
                { 
                    id: 'titan', 
                    title: 'IA Titan', 
                    marketType: 'Digits', 
                    icon: 'fas fa-yin-yang', 
                    icons: [],
                    description: 'Dígitos Par/Ímpar Direcional.',
                    assertividade: '90% - 95%',
                    retorno: '95%'
                }
            ],
            
            dailyStats: {
                profitLoss: 0,
                profitLossPercent: 0,
                totalTrades: 0,
                winrate: 0,
                wins: 0,
                losses: 0
            },
            statsUpdateInterval: null,

            marketDescriptions: {
                vol10: 'Volatilidade constante de 10% com um tique por segundo',
                vol25: 'Volatilidade constante de 25% com um tique por segundo',
                vol50: 'Volatilidade constante de 50% com um tique por segundo',
                vol75: 'Volatilidade constante de 75% com um tique por segundo',
                vol100: 'Volatilidade constante de 100% com um tique por segundo',
                vol10_1s: 'Volatilidade constante de 10% com um tique a cada 1 segundo',
                vol25_1s: 'Volatilidade constante de 25% com um tique a cada 1 segundo',
                vol50_1s: 'Volatilidade constante de 50% com um tique a cada 1 segundo',
                vol75_1s: 'Volatilidade constante de 75% com um tique a cada 1 segundo',
                vol100_1s: 'Volatilidade constante de 100% com um tique a cada 1 segundo',
                jump10: 'Volatilidade de 10% com saltos ocasionais de aproximadamente 30%',
                jump25: 'Volatilidade de 25% com saltos ocasionais de aproximadamente 60%',
                jump50: 'Volatilidade de 50% com saltos ocasionais de aproximadamente 100%',
                jump75: 'Volatilidade de 75% com saltos ocasionais de aproximadamente 150%',
                jump100: 'Volatilidade de 100% com saltos ocasionais de aproximadamente 200%'
            },

            // Frontend AI Operation Properties
            isMonitoring: false,
            tickHistory: [],
            digitHistory: [],
            activeFilters: [],
            realtimeLogs: [],
            logOperations: [],
            currentActiveTrade: null,
            consecutiveLosses: 0,
            isRecoveryActive: false,
            lastAnalysisResult: null,
            isDeactivating: false,
            tickCounter: 0,
            showHistoryModal: false
        }
    },
    watch: {
        entryValue(newValue) {
            console.log('[InvestmentIAView] 💰 Valor de entrada atualizado:', newValue);
        },
        profitTarget(newValue) {
            console.log('[InvestmentIAView] 🎯 Meta de lucro atualizada:', newValue);
        },
        lossLimit(newValue) {
            console.log('[InvestmentIAView] 🛑 Limite de perda atualizado:', newValue);
        },
        mode(newValue) {
            console.log('[InvestmentIAView] ⚡ Modo atualizado:', newValue);
        },
        selectedMarket(newValue) {
            console.log('[InvestmentIAView] 📊 Mercado selecionado:', newValue);
        },
        showAccountModal(newValue) {
            // Se o modal de conta for fechado e a IA ainda não estiver ativa,
            // certificar-se de resetar o checkbox/estado de ativação
            if (!newValue && !this.isInvestmentActive && this.activationEvent) {
                console.log('[InvestmentIAView] Modal fechado sem seleção, resetando toggle.');
                if (this.activationEvent.target) {
                    this.activationEvent.target.checked = false;
                }
            }
        },
        info(newInfo) {
            // ✅ [CONEXÃO] Evitar redirecionamento prematuro se estiver carregando saldo
            if (this.loadingBalance) return;

            // Log de monitoramento da conexão (opcional, mantendo apenas para log)
            if (!newInfo || !newInfo.loginid) {
                console.log('[InvestmentIAView] ⚠️ Conexão pausada ou token pendente.');
            }
        }
    },

    computed: {


        selectedStrategyObject() {
            return this.allStrategies.find(s => s.id === this.selectedStrategy);
        },

        selectedStrategyName() {
            return this.selectedStrategyObject ? this.selectedStrategyObject.title : 'Selecione uma estratégia';
        },
        
        availableStrategies() {
            // Se não houver configurações de plano carregadas ainda, mostrar todas ou nenhuma?
            // Melhor mostrar todas por padrão até carregar, ou filtrar se planFeatures existir
            if (!this.planFeatures) return this.allStrategies;
            
            // const allowedIAs = this.planFeatures.ias || [];
            
            // Mas geralmente no config do admin as IAs são selecionadas.
            
            return this.allStrategies;
            /*
            return this.allStrategies.filter(strategy => {
                // Verificar se o ID da estratégia (em minúsculo) está na lista de IAs permitidas
                return allowedIAs.some(allowed => allowed.toLowerCase() === strategy.id.toLowerCase());
            });
            */
        },
        
        formattedLastUpdate() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        
        formattedDailyProfit() {
            const value = this.dailyStats.profitLoss || 0;
            if (value >= 0) {
                return `+${this.preferredCurrencyPrefix} ${value.toFixed(2)}`;
            } else {
                return `-${this.preferredCurrencyPrefix} ${Math.abs(value).toFixed(2)}`;
            }
        },
        
        formattedDailyProfitPercent() {
            const value = this.dailyStats.profitLossPercent || 0;
            const sign = value >= 0 ? '+' : '-';
            return `(${sign}${Math.abs(value).toFixed(2)}%)`;
        },
        
        dailyProfitClass() {
            return this.dailyStats.profitLoss >= 0 ? 'profit-positive' : 'profit-negative';
        },
        
        marketDescription() {
            return this.marketDescriptions[this.selectedMarket] || this.marketDescriptions.vol10;
        },
        
        modeDescription() {
            const descriptions = {
                'veloz': 'Mais negociações, menos precisão',
                'moderado': 'Negociações e precisão moderado',
                'lento': 'Menos operações, mais precisão'
            };
            return descriptions[this.mode] || descriptions.veloz;
        },
        
        strategyDescription() {
            const descriptions = {
                'atlas': '<strong>Análise:</strong> Híbrida (Fluxo de Dígitos + Price Action) - <strong>Assertividade:</strong> 92 a 96% - <strong>Retorno:</strong> 95% / 99%',
                'apollo': '<strong>Análise:</strong> Densidade de Dígitos e Microtendências - <strong>Assertividade:</strong> 60% a 70% - <strong>Retorno:</strong> 19% a 126%',
                'nexus': '<strong>Análise:</strong> Price Action (Barreira de Segurança) com Troca de Contrato - <strong>Assertividade:</strong> 91% a 95% - <strong>Retorno:</strong> 91% / 95%',
                'orion': '<strong>Análise:</strong> Estatística de Dígitos (Over 2) com Price Action na Recuperação - <strong>Assertividade:</strong> 94% a 97% - <strong>Retorno:</strong> 95% / 99%',
                'titan': '<strong>Análise:</strong> Dígitos Par/Ímpar com persistência direcional - <strong>Assertividade:</strong> 90-95% - <strong>Retorno:</strong> 95%'
            };
            return descriptions[this.selectedStrategy] || descriptions.atlas;
        },
        

        entryPercent() {
            if (!this.balanceNumeric || this.balanceNumeric <= 0) return '0.00';
            return ((this.entryValue / this.balanceNumeric) * 100).toFixed(2);
        },
        profitPercent() {
            if (!this.balanceNumeric || this.balanceNumeric <= 0) return '0.00';
            return ((this.profitTarget / this.balanceNumeric) * 100).toFixed(2);
        },
        lossPercent() {
            if (!this.balanceNumeric || this.balanceNumeric <= 0) return '0.00';
            return ((this.lossLimit / this.balanceNumeric) * 100).toFixed(2);
        },
        
        riskLevelText() {
            const labels = {
                'conservador': 'Baixo',
                'moderado': 'Médio',
                'agressivo': 'Alto',
                'fixo': 'Fixo'
            };
            return labels[this.modoMartingale] || 'Baixo';
        },
        
        riskBarWidth() {
            const widths = {
                'conservador': '25%',
                'moderado': '50%',
                'agressivo': '75%',
                'fixo': '15%'
            };
            return widths[this.modoMartingale] || '25%';
        },
        
        riskDescriptionText() {
            const descriptions = {
                'conservador': 'Recupera o valor perdido até o M5 (sexta perda). Se não conseguir, assume a perda e reseta para o valor da entrada inicial.',
                'moderado': 'Recuperação ilimitada com +15% de lucro sobre as perdas totais',
                'agressivo': 'Recuperação ilimitada com +30% de lucro sobre as perdas totais',
                'fixo': 'Opera com valor fixo sem multiplicar stakes na recuperação.'
            };
            return descriptions[this.modoMartingale] || descriptions.conservador;
        },

        isAdmin() {
            try {
                const token = localStorage.getItem('token');
                console.log('[InvestmentIAView] Verificando token para admin:', token ? 'Token presente' : 'Sem token');
                
                if (!token) return false;
                
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('[InvestmentIAView] Payload do token:', payload);
                
                // Verificar várias propriedades comuns para roles e flags de admin
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                const isAdminFlag = payload.isAdmin || payload.is_admin;
                
                console.log('[InvestmentIAView] Role:', role, 'IsAdminFlag:', isAdminFlag);

                // Prioridade para flag booleana
                if (isAdminFlag === true || isAdminFlag === 'true') {
                    console.log('[InvestmentIAView] É admin via flag');
                    return true;
                }
                
                // Verificar string de role(s)
                if (role) {
                    const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                    const isAdm = roleStr.includes('admin') || roleStr === 'admin' || roleStr.includes('master');
                    console.log('[InvestmentIAView] É admin via role:', isAdm);
                    return isAdm;
                }
                
                return false;
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao verificar admin:', error);
                return false;
            }
        }
    },
    methods: {
        getStrategyIcon(name) {
            const icons = {
                'Atlas': 'fas fa-shield-alt',
                'Apollo': 'fas fa-rocket',
                'Nexus': 'fas fa-chart-bar',
                'Orion': 'fas fa-star',
                'Titan': 'fas fa-yin-yang'
            };
            return icons[name] || 'fas fa-robot';
        },
        getStrategyDescription(name) {
                const descs = {
                'Atlas': 'Híbrida: Dígitos + Price Action.',
                'Apollo': 'Densidade de Dígitos e Microtendências',
                'Nexus': 'Price Action com Barreira.',
                'Orion': 'Estatística de Dígitos e Recuperação.',
                'Titan': 'Dígitos Par/Ímpar Direcional.'
            };
            return descs[name] || 'Estratégia de IA avançada.';
        },
        /**
         * ✅ ZENIX v3.5: Atualiza o saldo em tempo real vindo da IA (InvestmentActive)
         * Evita chamadas extras à API Deriv usando os dados de lucro já disponíveis
         */
        handleLiveBalanceUpdate(newBalance) {
            if (!newBalance || !this.info) return;
            
            console.log(`[InvestmentIAView] 💰 Sincronizando saldo real-time: $${newBalance.toFixed(2)}`);
            
            // 1. Atualizar o saldo principal
            this.info.balance = newBalance;
            
            // 2. Atualizar campos específicos dependendo do tipo de conta
            // Isso garante que o accountBalanceMixin e TopNavbar vejam a mudança
            if (this.accountType === 'demo') {
                this.info.demo_amount = newBalance;
                if (this.info.balancesByCurrencyDemo) {
                    this.info.balancesByCurrencyDemo['USD'] = newBalance;
                }
            } else {
                this.info.real_amount = newBalance;
                if (this.info.balancesByCurrencyReal) {
                    this.info.balancesByCurrencyReal['USD'] = newBalance;
                }
            }
            
            // 3. Forçar reatividade clonando o objeto info
            this.info = { ...this.info };
        },

        handleAccountTypeChange(newType) {
            console.log('[InvestmentIAView] Tipo de conta alterado via componente filho:', newType);
            this.accountType = newType; 
            // NÃO chamar switchAccount() pois o componente filho (Sidebar/Navbar) já faz o reload.
        },

        async loadAvailableAccounts() {
            this.loadingAccounts = true;
            try {
                const accounts = await loadAvailableAccounts();
                this.availableAccounts = accounts;
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao carregar contas:', error);
                this.availableAccounts = [];
            } finally {
                this.loadingAccounts = false;
            }
        },

        async switchAccount(type) {
            try {
                const isDemo = type === 'demo';
                const tradeCurrency = isDemo ? 'DEMO' : 'USD';
                
                // Tentar encontrar uma conta correspondente no cache de contas disponíveis
                const matchingAccount = this.availableAccounts.find(acc => acc.isDemo === isDemo);
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const token = localStorage.getItem('token');
                
                if (matchingAccount) {
                    console.log(`[InvestmentIAView] Sincronizando conta ${type} com token: ${matchingAccount.loginid}`);
                    
                    // Usar o endpoint unificado que salva token E moeda
                    const response = await fetch(`${apiBase}/settings/deriv-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            token: matchingAccount.token,
                            tradeCurrency: tradeCurrency
                        })
                    });

                    if (response.ok) {
                        // Atualizar localStorage local para manter consistência imediata
                        localStorage.setItem('deriv_token', matchingAccount.token);
                        localStorage.setItem('trade_currency', tradeCurrency);
                        
                        this.tradeCurrency = tradeCurrency;
                        this.accountType = type;
                        
                        console.log('[InvestmentIAView] ✅ Conta e token sincronizados com sucesso');
                        window.location.reload();
                        return;
                    }
                }

                // Fallback: se não encontrar conta específica ou falhar, tentar atualizar apenas a moeda
                console.warn('[InvestmentIAView] ⚠️ Nenhuma conta correspondente encontrada ou falha no sync, tentando apenas moeda...');
                const response = await fetch(`${apiBase}/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        tradeCurrency: tradeCurrency
                    })
                });

                if (response.ok) {
                    localStorage.setItem('trade_currency', tradeCurrency);
                    this.tradeCurrency = tradeCurrency;
                    this.accountType = type;
                    window.location.reload();
                } else {
                    throw new Error('Erro ao alterar conta');
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao alterar moeda:', error);
                await alert('Erro ao alterar moeda. Tente novamente.');
            }
        },



        
        getCurrencyPrefix(currency) {
            switch ((currency || '').toUpperCase()) {
                case 'USD':
                    return '$';
                case 'EUR':
                    return '€';
                case 'BTC':
                    return '₿';
                case 'DEMO':
                    return 'D$';
                default:
                    return currency ? `${currency} ` : '$';
            }
        },
        
        checkMobile() {
            this.isMobile = window.innerWidth <= 1024;
        },
        
        async handleToggleChange(event) {
            const isChecked = event.target.checked;
            console.log('[InvestmentIAView] 🔄 Toggle alterado:', isChecked ? 'Ativar' : 'Desativar');
            
            if (isChecked && !this.isInvestmentActive) {
                // Ativando IA - Mostra modal de seleção de conta
                this.handleStartClick(event);
            } else if (!isChecked && this.isInvestmentActive) {
                // Desativando IA
                await this.deactivateIA();
            }
        },
        
        async toggleInvestmentState() {
            if (this.isInvestmentActive) {
                await this.deactivateIA();
            } else {
                await this.activateIA();
            }
        },

        async activateIA() {
            this.isActivating = true;
            try {
                // ✅ Validação de Estratégia
                if (!this.selectedStrategy) {
                    console.warn('[InvestmentIAView] ⚠️ Nenhuma estratégia selecionada. Exibindo modal.');
                    this.showStrategyRequiredModal = true;
                    return;
                }

                console.log('[InvestmentIAView] ===== ATIVANDO IA (NOVA LÓGICA) =====');
                
                // ✅ Forçar recarregamento das configurações de Master Trader para garantir saldo fictício atualizado
                await this.loadMasterTraderSettings();
                console.log('[InvestmentIAView] Configurações recarregadas:', {
                    active: this.isFictitiousBalanceActive,
                    amount: this.fictitiousBalance
                });
                
                // Validação de saldo mínimo
                const currentBalance = this.balanceNumeric || 0;
                const requiredBalance = this.entryValue;

                console.log('[InvestmentIAView] 🔍 Debug Saldo:', {
                    balanceNumeric: this.balanceNumeric,
                    currentBalance: currentBalance,
                    requiredBalance: requiredBalance,
                    isFictitiousBalanceActive: this.isFictitiousBalanceActive,
                    fictitiousBalance: this.fictitiousBalance,
                    infoBalance: this.info?.balance,
                    accountType: this.accountType
                });

                if (currentBalance < requiredBalance) {
                    console.warn('[InvestmentIAView] ⚠️ Saldo insuficiente para iniciar:', currentBalance, '<', requiredBalance);
                    this.showInsufficientBalanceModal = true;
                    this.isActivating = false;
                    return;
                }

                // Validar stake mínimo
                if (this.entryValue < 0.35) {
                    console.warn('[InvestmentIAView] ⚠️ Valor mínimo de entrada: $0.35');
                    this.showMinimumStakeModal = true;
                    this.isActivating = false;
                    return;
                }

                // Carregar Configuração da Estratégia do Preset
                // ✅ Handle both "apollo" and "default_apollo" formats
                const strategyPreset = strategiesPresets.find(s => {
                    const strategyId = s.id.replace('default_', ''); // Remove 'default_' prefix if exists
                    const selectedId = this.selectedStrategy.replace('default_', '');
                    return strategyId === selectedId;
                });
                
                if (!strategyPreset) {
                    console.error('[InvestmentIAView] ❌ Estratégia não encontrada:', this.selectedStrategy);
                    console.error('[InvestmentIAView] Estratégias disponíveis:', strategiesPresets.map(s => s.id));
                    this.$root.$toast.error('Configuração da estratégia não encontrada!');
                    this.isActivating = false;
                    return;
                }

                // ✅ Salvar configuração no localStorage
                const config = {
                    strategy: this.selectedStrategy,
                    strategyName: strategyPreset.name,
                    stake: this.entryValue,
                    profitTarget: this.profitTarget,
                    lossLimit: this.lossLimit,
                    mode: this.mode,
                    modoMartingale: this.modoMartingale,
                    stoplossBlindado: this.stoplossBlindado,
                    market: this.selectedMarket,
                    // ✅ Pass Version
                    version: this.allStrategies.find(s => s.id === this.selectedStrategy)?.version || '1.0'
                };

                localStorage.removeItem('ai_active_config'); // 🗑️ Limpar dados anteriores
                localStorage.setItem('ai_active_config', JSON.stringify(config));
                console.log('[InvestmentIAView] ✅ Configuração salva no localStorage:', config);

                this.$root.$toast.success(`IA ${strategyPreset.name} ativada com sucesso!`);
                
                // ✅ Redirecionar para página de monitoramento (USER ACTIVE MONITORING)
                setTimeout(() => {
                    const conn = JSON.parse(localStorage.getItem('deriv_connection') || '{}');
                    this.$router.push({ 
                        path: '/Investments-IA/active', 
                        query: { loginid: conn.loginid },
                        // ✅ Pass sessionState explicitly for AIMonitoringView priority check
                        params: { 
                            sessionState: { 
                                version: config.version,
                                strategy: config.strategyName
                            } 
                        }
                    });
                }, 500);

            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao ativar IA:', error);
                this.$root.$toast.error('Erro ao ativar IA');
            } finally {
                this.isActivating = false;
            }
        },

        async deactivateIA() {
            try {
                console.log('[InvestmentIAView] 🛑 Desativando IA (Frontend Mode)...');
                this.isDeactivating = true;
                
                this.stopTickConnection();
                this.isMonitoring = false;
                this.isInvestmentActive = false;
                
                this.addLog('⏹️ IA Desativada pelo usuário.', 'info');
                this.$root.$toast.info('IA desativada com sucesso.');

            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao desativar IA:', error);
            } finally {
                this.isDeactivating = false;
            }
        },

        handleStrategyRequiredConfirm() {
            this.showStrategyRequiredModal = false;
            this.openStrategyModal();
        },

        getUserId() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.userId || payload.sub || payload.id) {
                        return payload.userId || payload.sub || payload.id;
                    }
                }

                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    if (userInfo.id || userInfo.userId) {
                        return userInfo.id || userInfo.userId;
                    }
                }

                console.warn('[InvestmentIAView] Não foi possível obter userId');
                return null;
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao obter userId:', error);
                return null;
            }
        },

        formatAccountBalance(balance, isDemo = false) {
            // Add fictitious balance to demo accounts when active  
            let value = parseFloat(balance) || 0;
            if (isDemo && this.isFictitiousBalanceActive) {
                value += (parseFloat(this.fictitiousBalance) || 0);
            }
            return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },

        async handleStartClick(event) {
             this.isLoadingAccounts = true;
             this.showAccountModal = true;
             this.availableAccounts = [];
             this.activationEvent = event;
             
             try {
                 const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                 const userToken = localStorage.getItem('token');
                 
                 if (!userToken) {
                     this.$root.$toast.error('Sessão expirada. Faça login novamente.');
                     if (event && event.target) event.target.checked = false;
                     this.showAccountModal = false;
                     return;
                 }

                 const response = await fetch(`${apiBase}/settings`, {
                     headers: {
                         'Authorization': `Bearer ${userToken}`,
                         'Content-Type': 'application/json'
                     }
                 });

                 if (!response.ok) throw new Error('Falha ao buscar configurações do backend');

                 const data = await response.json();
                 const accounts = [];

                 if (data.tokenReal) {
                     accounts.push({
                         loginid: data.idRealAccount || 'Conta Real',
                         token: data.tokenReal,
                         balance: Number(data.realAmount) || 0,
                         currency: data.tokenRealCurrency || 'USD',
                         isDemo: false
                     });
                 }

                 if (data.tokenDemo) {
                     accounts.push({
                         loginid: data.idDemoAccount || 'Conta Demo',
                         token: data.tokenDemo,
                         balance: Number(data.demoAmount) || 0,
                         currency: data.tokenDemoCurrency || 'USD',
                         isDemo: true
                     });
                 }

                 this.availableAccounts = accounts;
             } catch (error) {
                 console.error('[InvestmentIAView] Erro ao carregar contas:', error);
                 this.$root.$toast.error('Erro ao conectar com o servidor.');
                 if (event && event.target) event.target.checked = false;
                 this.showAccountModal = false;
             } finally {
                 this.isLoadingAccounts = false;
             }
        },

        async selectAccount(account) {
            console.log('[InvestmentIAView] Conta selecionada:', account);
            this.selectedToken = account.token;
            this.accountType = account.isDemo ? 'demo' : 'real';
            localStorage.setItem('deriv_account_type', this.accountType);
            
            // ✅ [FIX BALANÇO] Atualizar o estado local IMEDIATAMENTE para evitar bug de saldo insuficiente
            // Isso garante que activateIA() já veja o saldo correto da conta selecionada
            if (this.info) {
                console.log(`[InvestmentIAView] ⚡ Sincronizando saldo local para validação: ${account.balance}`);
                this.info.balance = account.balance;
                this.info.isDemo = account.isDemo;
                
                if (account.isDemo) {
                    this.info.demo_amount = account.balance;
                    if (!this.info.balancesByCurrencyDemo) this.info.balancesByCurrencyDemo = {};
                    this.info.balancesByCurrencyDemo['USD'] = account.balance;
                } else {
                    this.info.real_amount = account.balance;
                    if (!this.info.balancesByCurrencyReal) this.info.balancesByCurrencyReal = {};
                    this.info.balancesByCurrencyReal['USD'] = account.balance;
                }
                
                // Forçar reatividade
                this.info = { ...this.info };
            }

            this.showAccountModal = false;

            // ✅ Sync with backend to ensure AIMonitoringView picks up the correct account
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const token = localStorage.getItem('token');
                const tradeCurrency = account.isDemo ? 'DEMO' : 'USD';

                // Optimistic local update
                localStorage.setItem('trade_currency', tradeCurrency);
                localStorage.setItem('deriv_token', account.token);
                
                // ✅ UPDATE deriv_connection to ensure AIMonitoringView uses the correct token
                const connectionData = {
                    loginid: account.loginid,
                    token: account.token,
                    isDemo: account.isDemo,
                    balance: account.balance,
                    currency: account.currency,
                    timestamp: Date.now()
                };
                console.log('[InvestmentIAView] Saving deriv_connection:', connectionData);
                localStorage.setItem('deriv_connection', JSON.stringify(connectionData));

                await fetch(`${apiBase}/settings/deriv-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        token: account.token,
                        active_loginid: account.loginid
                    })
                });
            } catch (error) {
                console.error('Erro ao salvar token no backend:', error);
            }

            // Restore AI Activation
            console.log('[InvestmentIAView] Account sync complete, activating AI...');
            await this.activateIA();
        },


        getDerivToken() {
            if (this.selectedToken) {
                console.log('[InvestmentIAView] ✓ Usando token selecionado no modal');
                return this.selectedToken;
            }
            console.log('[InvestmentIAView] Buscando token Deriv para conta:', this.accountType);

            try {
                const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                
                // Se estivermos em modo demo, procurar especificamente por um token de conta virtual (VRT/VRTC)
                if (this.accountType === 'demo') {
                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
                            console.log('[InvestmentIAView] ✓ Token demo encontrado para loginid:', loginid);
                            return token;
                        }
                    }
                } else {
                    // Se estivermos em modo real, tentar pegar o token associado ao loginid atual no deriv_connection
                    const connectionStr = localStorage.getItem('deriv_connection');
                    if (connectionStr) {
                        const connection = JSON.parse(connectionStr);
                        const currentLoginid = connection.loginid;
                        
                        if (currentLoginid && tokensByLoginId[currentLoginid]) {
                            // Validar que não é um loginid de demo se estamos no modo real
                            if (!currentLoginid.startsWith('VRTC') && !currentLoginid.startsWith('VRT')) {
                                console.log('[InvestmentIAView] ✓ Token real específico encontrado para loginid:', currentLoginid);
                                return tokensByLoginId[currentLoginid];
                            }
                        }
                    }
                    
                    // Fallback para qualquer token real que não comece com VRT
                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (!loginid.startsWith('VRTC') && !loginid.startsWith('VRT')) {
                            console.log('[InvestmentIAView] ✓ Token real alternativo encontrado para loginid:', loginid);
                            return token;
                        }
                    }
                }
            } catch (error) {
                console.error('[AccountBalanceMixin] Erro ao buscar token específico:', error);
            }

            // Fallback final para o token padrão
            const defaultToken = localStorage.getItem('deriv_token');
            if (defaultToken) {
                console.log('[InvestmentIAView] ✓ Usando token padrão (fallback)');
                return defaultToken;
            }

            console.error('[InvestmentIAView] ❌ Nenhum token encontrado para o modo:', this.accountType);
            return null;
        },


        
        async fetchDailyStats() {
            // ✅ Se a IA estiver rodando localmente, não sobrescrever com dados do backend
            if (this.isMonitoring) return;

            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentIAView] ❌ UserId não disponível para buscar stats');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const url = `${apiBase}/ai/session-stats/${userId}`;
                
                console.log('[InvestmentIAView] 📊 Buscando estatísticas diárias:', url);
                
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
                console.log('[InvestmentIAView] 📦 Stats recebidas:', result);
                
                if (result.success && result.data) {
                    const profitLoss = parseFloat(result.data.profitLoss) || 0;
                    const totalVolume = parseFloat(result.data.totalVolume) || 1;
                    const profitLossPercent = (profitLoss / totalVolume) * 100;
                    
                    this.dailyStats = {
                        profitLoss: profitLoss,
                        profitLossPercent: profitLossPercent,
                        totalTrades: parseInt(result.data.totalTrades) || 0,
                        winrate: parseFloat(result.data.winrate) || 0,
                        wins: parseInt(result.data.wins) || 0,
                        losses: parseInt(result.data.losses) || 0
                    };
                    
                    console.log('[InvestmentIAView] ✅ Stats atualizadas:', this.dailyStats);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar estatísticas:', error);
            }
        },
        
        startStatsUpdates() {
            // ✅ Comentado para iniciar zerado conforme solicitado. 
            // O primeiro update virá após 10 segundos, ou será gerido localmente pela IA.
            // this.fetchDailyStats(); 
            this.statsUpdateInterval = setInterval(() => {
                this.fetchDailyStats();
            }, 10000);
            
            console.log('[InvestmentIAView] ⏰ Atualizações de stats iniciadas (início zerado)');
        },
        
        stopStatsUpdates() {
            if (this.statsUpdateInterval) {
                clearInterval(this.statsUpdateInterval);
                this.statsUpdateInterval = null;
                console.log('[InvestmentIAView] ⏹️ Atualizações de stats paradas');
            }
        },

        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        
        toggleSidebarCollapse() {
            this.localSidebarCollapsed = !this.localSidebarCollapsed;
            localStorage.setItem('sidebarCollapsed', this.localSidebarCollapsed.toString());
        },
        
        toggleSettingsModal() {
            this.showSettingsModal = !this.showSettingsModal;
        },
        
        closeSettingsModal() {
            this.showSettingsModal = false;
        },
        
        
        handleGlobalAccountChange() {
            console.log('[InvestmentIAView] Detectada mudança de conta global, recarregando...');
            this.reloadBalance();
        },
        async startDataLoading() {
            try {
                console.log('[InvestmentIAView] ===== INICIANDO CARREGAMENTO DE DADOS =====');
                
                // Primeiro, buscar o histórico de 1000 ticks para construir o gráfico
                console.log('[InvestmentIAView] 📊 Buscando histórico de 1000 ticks...');
                await this.fetchTicksHistory(1000);
                
                // Depois, iniciar o serviço de monitoramento
                const response = await fetch('https://iazenix.com/api/ai/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('[InvestmentIAView] Status da resposta:', response.status);
                const result = await response.json();
                console.log('[InvestmentIAView] Resultado:', result);

                if (result.success) {
                    console.log('[InvestmentIAView] ✅ Carregamento de dados iniciado');
                    this.startPolling();
                } else {
                    console.warn('[InvestmentIAView] ⚠ Não foi possível iniciar:', result.message);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ ERRO ao iniciar carregamento:', error);
                console.error('[InvestmentIAView] Detalhes:', error.message);
            }
        },
        
        async fetchTicksHistory(count = 1000) {
            try {
                // Log de início
                console.log('[InvestmentIAView] ===== INÍCIO DO CARREGAMENTO DE HISTÓRICO =====');
                console.log(`[InvestmentIAView] 📊 Iniciando busca de histórico de ${count} ticks...`);
                console.log(`[InvestmentIAView] ⏰ Timestamp de início: ${new Date().toISOString()}`);
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const url = `${apiBase}/ai/ticks?count=${count}`;
                
                // Log de envio da requisição
                console.log('[InvestmentIAView] 📡 Enviando requisição para API...');
                console.log(`[InvestmentIAView] 🔗 URL: ${url}`);
                console.log(`[InvestmentIAView] 📋 Parâmetros: count=${count}`);
                console.log(`[InvestmentIAView] ⏰ Timestamp de envio: ${new Date().toISOString()}`);
                
                const requestStartTime = Date.now();
                const response = await fetch(url);
                const requestEndTime = Date.now();
                const requestDuration = requestEndTime - requestStartTime;
                
                // Log de retorno da API
                console.log('[InvestmentIAView] 📥 Resposta recebida da API');
                console.log(`[InvestmentIAView] ⏰ Timestamp de retorno: ${new Date().toISOString()}`);
                console.log(`[InvestmentIAView] ⏱️ Tempo de requisição: ${requestDuration}ms`);
                console.log(`[InvestmentIAView] 📊 Status HTTP: ${response.status} ${response.statusText}`);
                console.log(`[InvestmentIAView] ✅ Response OK: ${response.ok}`);
                
                const result = await response.json();
                
                console.log('[InvestmentIAView] 📦 Dados recebidos da API:', {
                    success: result.success,
                    ticksCount: result.data?.ticks?.length || 0,
                    currentPrice: result.data?.currentPrice,
                    hasData: !!result.data,
                    hasTicks: !!result.data?.ticks
                });

                if (result.success && result.data?.ticks) {
                    // Manter apenas os últimos ticks recebidos
                    const historyTicks = result.data.ticks.slice(-count);
                    this.ticks = historyTicks;
                    this.currentPrice = result.data.currentPrice;
                    
                    console.log('[InvestmentIAView] ✅ Histórico processado com sucesso');
                    console.log(`[InvestmentIAView] 📊 Ticks processados: ${historyTicks.length}`);
                    console.log(`[InvestmentIAView] 💰 Preço atual: ${this.currentPrice}`);
                    console.log(`[InvestmentIAView] ⏰ Timestamp de conclusão: ${new Date().toISOString()}`);
                    console.log('[InvestmentIAView] ===== FIM DO CARREGAMENTO DE HISTÓRICO =====');
                } else {
                    console.warn('[InvestmentIAView] ⚠ Nenhum histórico disponível ainda');
                    console.warn('[InvestmentIAView] 📋 Resposta completa:', result);
                    console.log('[InvestmentIAView] ===== FIM DO CARREGAMENTO DE HISTÓRICO (SEM DADOS) =====');
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar histórico de ticks');
                console.error(`[InvestmentIAView] ⏰ Timestamp do erro: ${new Date().toISOString()}`);
                console.error('[InvestmentIAView] 🔴 Detalhes do erro:', error);
                console.error('[InvestmentIAView] 📋 Mensagem:', error.message);
                console.error('[InvestmentIAView] 📋 Stack:', error.stack);
                console.log('[InvestmentIAView] ===== FIM DO CARREGAMENTO DE HISTÓRICO (ERRO) =====');
            }
        },

        startPolling() {
            this.fetchTicks();
            this.pollingInterval = setInterval(() => {
                this.fetchTicks();
            }, 2000);
        },

        stopPolling() {
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        },

        async fetchTicks() {
            if (this.isMonitoring) return; // Skip polling if local WebSocket is active
            try {
                console.log('[InvestmentIAView] Buscando novos ticks...');
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const response = await fetch(`${apiBase}/ai/ticks`);
                const result = await response.json();

                console.log('[InvestmentIAView] Ticks recebidos:', {
                    success: result.success,
                    ticksCount: result.data?.ticks?.length || 0,
                    currentPrice: result.data?.currentPrice
                });

                if (result.success && result.data?.ticks) {
                    const newTicks = result.data.ticks || [];
                    
                    // Se já temos histórico, mesclar mantendo os últimos 1000 ticks
                    if (this.ticks && this.ticks.length > 0) {
                        // Pegar os últimos ticks do histórico atual
                        const existingTicks = this.ticks.slice(-990); // Manter 990 do histórico
                        // Adicionar os novos ticks
                        const allTicks = [...existingTicks, ...newTicks];
                        // Manter apenas os últimos 1000
                        this.ticks = allTicks.slice(-1000);
                    } else {
                        // Se não temos histórico ainda, usar os ticks recebidos (limitados a 1000)
                        this.ticks = newTicks.slice(-1000);
                    }
                    
                    this.currentPrice = result.data.currentPrice;
                    console.log('[InvestmentIAView] ✅ Ticks atualizados:', this.ticks.length);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar ticks:', error);
            }
        },

        async checkAIStatus() {
            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentIAView] userId não encontrado');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const response = await fetch(`${apiBase}/ai/config/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = await response.json();

                if (result.success && result.data) {
                    const config = result.data;
                    this.isInvestmentActive = config.isActive || false;
                    
                    // ✅ [ZENIX v2.0] Só preencher parâmetros se a IA estiver ativa
                    // Se estiver inativa, manter os padrões para uma nova configuração
                    if (this.isInvestmentActive) {
                        if (config.entryValue) this.entryValue = Number(config.entryValue);
                        if (config.profitTarget) this.profitTarget = Number(config.profitTarget);
                        if (config.lossLimit) this.lossLimit = Number(config.lossLimit);
                        if (config.mode) this.mode = config.mode;
                        if (config.strategy) this.selectedStrategy = config.strategy.toLowerCase();
                        if (config.modoMartingale) this.modoMartingale = config.modoMartingale;
                        if (config.stoplossBlindado !== undefined) this.stoplossBlindado = config.stoplossBlindado;
                        
                        console.log('[InvestmentIAView] ✅ IA JÁ ESTÁ ATIVA! Parâmetros sincronizados.');
                        // Buscar histórico de ticks para construir o gráfico
                        await this.fetchTicksHistory(1000);
                    } else {
                        console.log('[InvestmentIAView] IA está inativa, usando padrões de nova configuração.');
                    }
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao verificar status da IA:', error);
            }
        },

        // --- FRONTEND AI ENGINE METHODS ---

        initTickConnection() {
            const marketSymbol = this.getMarketSymbol(this.selectedMarket);
            console.log(`[InvestmentIAView] 🔌 Conectando ao mercado: ${marketSymbol}`);

            this.stopTickConnection();

            const appId = localStorage.getItem('deriv_app_id') || '1089';
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
            
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                this.addLog(`🔌 Conectado ao Deriv. Autorizando...`, 'info');
                const token = this.getDerivToken();
                
                if (token) {
                    this.ws.send(JSON.stringify({ authorize: token }));
                } else {
                    this.addLog('⚠️ Token Deriv não encontrado. Operações reais desativadas.', 'warning');
                    this.subscribeTicks(marketSymbol);
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    
                    if (msg.msg_type === 'authorize') {
                        if (msg.error) {
                            this.addLog(`❌ Falha na autorização: ${msg.error.message}`, 'error');
                        } else {
                            this.addLog(`✅ Autorizado! Saldo: $${msg.authorize.balance}`, 'success');
                            this.subscribeTicks(marketSymbol);
                        }
                    }

                    if (msg.msg_type === 'tick') {
                        this.handleTickMessage(msg);
                    }

                    if (msg.msg_type === 'buy') {
                        if (msg.error) {
                            this.addLog(`❌ ERRO NA COMPRA: ${msg.error.message}`, 'error');
                        } else {
                            this.addLog(`🚀 COMPRA REALIZADA! ID: ${msg.buy.contract_id}`, 'success');
                            this.ws.send(JSON.stringify({
                                proposal_open_contract: 1,
                                contract_id: msg.buy.contract_id,
                                subscribe: 1
                            }));
                        }
                    }

                    if (msg.msg_type === 'proposal_open_contract') {
                        this.handleContractUpdate(msg.proposal_open_contract);
                    }

                } catch (e) {
                    console.error('[WS] Erro JSON:', e);
                }
            };
        },

        stopTickConnection() {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
        },

        subscribeTicks(symbol) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    ticks: symbol,
                    subscribe: 1
                }));
                this.addLog(`📡 Monitorando ticks de ${symbol}...`, 'info');
            }
        },

        handleTickMessage(msg) {
            const tick = msg.tick;
            const price = tick.quote;
            this.currentPrice = price;

            // ✅ Log de Ticks (Feedback Visual)
            // Agora em tempo real, sem filtro
            this.tickCounter = (this.tickCounter || 0) + 1;
            const digit = parseInt(price.toString().slice(-1));
            this.addLog(`📊 Tick recebido: ${price} (Último dígito: ${digit})`, 'info');

            // Atualizar histórico de ticks
            this.tickHistory.push({
                time: tick.epoch,
                value: price
            });
            if (this.tickHistory.length > 500) this.tickHistory.shift();
            
            this.ticks = [...this.tickHistory];

            // Atualizar histórico de dígitos
            this.digitHistory.push(digit);
            if (this.digitHistory.length > 200) this.digitHistory.shift();

            // EXECUTAR ANÁLISE
            if (this.isMonitoring) {
                this.runAnalysis();
            }
        },

        runAnalysis() {
            if (this.currentActiveTrade) return;

            const strategy = this.isRecoveryActive ? 'recovery' : 'main';
            const data = {
                tickHistory: this.tickHistory.map(t => t.value),
                digitHistory: this.digitHistory
            };

            const results = [];
            let allPassed = true;

            for (const filter of this.activeFilters) {
                if (!filter.active) continue;
                
                const result = StrategyAnalysis.evaluate(filter, data, this.mode || 'VELOZ');
                results.push(result);

                if (!result.pass) {
                    allPassed = false;
                    break;
                }
            }

            if (allPassed && this.activeFilters.length > 0) {
                // ✅ DYNAMIC DIRECTION LOGIC
                const directions = results.map(r => r.direction).filter(d => d);
                let dynamicContractType = null;

                if (directions.length > 0) {
                    const uniqueDirections = [...new Set(directions)];
                    if (uniqueDirections.length === 1) {
                        const signal = uniqueDirections[0];
                        const strategyPreset = strategiesPresets.find(s => s.id === this.selectedStrategy);
                        const configModel = this.isRecoveryActive ? strategyPreset.config.recoveryConfig : strategyPreset.config.form;
                        
                        const baseType = (configModel.tradeType || '').toUpperCase();

                        if (['CALL', 'UP'].includes(signal)) {
                            dynamicContractType = baseType.includes('DIGIT') ? 'DIGITOVER' : 'CALL';
                        } else if (['PUT', 'DOWN'].includes(signal)) {
                            dynamicContractType = baseType.includes('DIGIT') ? 'DIGITUNDER' : 'PUT';
                        } else if (['DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(signal)) {
                            dynamicContractType = signal;
                        } else {
                            dynamicContractType = baseType;
                        }

                        // ✅ Direction Mode Restriction
                        const directionMode = configModel.directionMode || 'both';
                        if (directionMode !== 'both') {
                            const isUpSignal = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                            const isDownSignal = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                            
                            if ((directionMode === 'up' && !isUpSignal) || (directionMode === 'down' && !isDownSignal)) {
                                this.addLog(`🚫 Direção Restrita: Sinal ${signal} ignorado.`, 'warning');
                                return;
                            }
                        }

                        this.addLog(`🧭 Direção Dinâmica: ${signal} → ${dynamicContractType}`, 'info');
                    } else {
                        this.addLog('⚠️ Conflito de Direção', 'warning');
                        return;
                    }
                }

                this.addLog(`🎯 Sinal detectado (${strategy})! Executando trade...`, 'success');
                this.executeRealTrade(dynamicContractType);
            }
        },

        async executeRealTrade(overrideContractType = null) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            const strategyPreset = strategiesPresets.find(s => s.id === this.selectedStrategy);
            const tradeConfig = this.isRecoveryActive ? strategyPreset.config.recoveryConfig : strategyPreset.config.form;

            const buyRequest = {
                buy: '1',
                price: Number(this.entryValue),
                parameters: {
                    amount: Number(this.entryValue),
                    basis: 'stake',
                    contract_type: overrideContractType || tradeConfig.tradeType,
                    currency: 'USD',
                    duration: tradeConfig.duration || 1,
                    duration_unit: tradeConfig.durationUnit || 't',
                    symbol: this.getMarketSymbol(this.selectedMarket)
                }
            };

            if (tradeConfig.prediction !== undefined) {
                buyRequest.parameters.barrier = tradeConfig.prediction.toString();
            }

            this.currentActiveTrade = { status: 'PENDING' };
            this.ws.send(JSON.stringify(buyRequest));
        },

        handleContractUpdate(contract) {
            if (contract.is_sold) {
                const profit = contract.profit;
                const win = profit > 0;
                
                this.addLog(`🏁 Contrato finalizado: ${win ? 'VITORIA' : 'DERROTA'} ($${profit})`, win ? 'success' : 'error');

                this.dailyStats.totalTrades++;
                if (win) {
                    this.dailyStats.wins++;
                    this.consecutiveLosses = 0;
                    this.isRecoveryActive = false;
                    const strategyPreset = strategiesPresets.find(s => s.id === this.selectedStrategy);
                    this.activeFilters = JSON.parse(JSON.stringify(strategyPreset.config.form.attackFilters));
                } else {
                    this.dailyStats.losses++;
                    this.consecutiveLosses++;
                    
                    const strategyPreset = strategiesPresets.find(s => s.id === this.selectedStrategy);
                    if (strategyPreset.config.recoveryConfig.enabled && 
                        this.consecutiveLosses >= strategyPreset.config.recoveryConfig.lossesToActivate) {
                        this.isRecoveryActive = true;
                        this.activeFilters = JSON.parse(JSON.stringify(strategyPreset.config.recoveryConfig.attackFilters));
                        this.addLog('🛡️ MODO RECUPERAÇÃO ATIVADO!', 'warning');
                    }
                }
                
                this.dailyStats.profitLoss += profit;
                this.dailyStats.winrate = (this.dailyStats.wins / this.dailyStats.totalTrades) * 100;

                this.logOperations.unshift({
                    time: new Date().toLocaleTimeString(),
                    pair: contract.display_name,
                    direction: contract.contract_type,
                    entryPrice: contract.entry_tick,
                    exitPrice: contract.exit_tick,
                    investment: `$${contract.buy_price}`,
                    pnl: `${win ? '+' : ''}$${profit}`
                });

                this.currentActiveTrade = null;
            }
        },

        addLog(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
            
            this.realtimeLogs.unshift({
                id: Date.now() + Math.random(),
                timestamp,
                message,
                type,
                icon
            });

            if (this.realtimeLogs.length > 100) this.realtimeLogs.pop();
        },

        getMarketSymbol(market) {
            const map = {
                vol10: 'R_10', vol25: 'R_25', vol50: 'R_50', vol75: 'R_75', vol100: 'R_100',
                vol10_1s: '1HZ10V', vol25_1s: '1HZ25V', vol50_1s: '1HZ50V', vol75_1s: '1HZ75V', vol100_1s: '1HZ100V'
            };
            return map[market] || 'R_100';
        },

        // --- STRATEGY MODAL METHODS ---
        async openStrategyModal() {
            this.showStrategyModal = true;
            await this.loadStrategiesFromAPI();
        },

        closeStrategyModal() {
            this.showStrategyModal = false;
        },

        selectStrategy(strategyId) {
            // ✅ BLOCKING LOGIC: Only allow 'apollo' (Except for Admins)
            console.log('[InvestmentIAView] Verificando acesso à estratégia:', strategyId, 'IsAdmin:', this.isAdmin);
            
            if (strategyId.toLowerCase() !== 'apollo' && !this.isAdmin) {
                const strategyName = this.allStrategies.find(s => s.id === strategyId)?.title || strategyId;
                this.implementationMessage = `A estratégia ${strategyName} está passando por atualizações e será liberada entre segunda e sexta da próxima semana.`;
                this.showImplementationModal = true;
                this.showStrategyModal = false; // Fecha o seletor para evitar overlap
                return;
            }

            this.selectedStrategy = strategyId;
            
            // ✅ Sincronização de Mercado Automática (ZENIX v2.0)
            const strategyLower = strategyId.toLowerCase();
            if (strategyLower === 'atlas') {
                this.selectedMarket = 'vol100';
                console.log('[InvestmentIAView] 🎯 Atlas selecionado: Alternando mercado para Volatility 100 Index');
            } else if (['orion', 'titan', 'nexus', 'apollo'].includes(strategyLower)) {
                this.selectedMarket = 'vol100';
                console.log(`[InvestmentIAView] 🎯 ${strategyId.toUpperCase()} selecionado: Alternando mercado para Volatility 100 Index`);
            } else {
                this.selectedMarket = 'vol10';
            }

            // Delay closing to show visual feedback (check icon)
            setTimeout(() => {
                this.closeStrategyModal();
            }, 300);
        },

        async loadStrategiesFromAPI() {
            this.isLoadingStrategies = true;
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const token = localStorage.getItem('token');
                const strategyNames = ['apollo', 'atlas', 'nexus', 'orion', 'titan'];

                console.log('[InvestmentIAView] 📡 Carregando estratégias da API...');

                for (const strategyName of strategyNames) {
                    try {
                        const response = await fetch(`${apiBase}/strategies/${strategyName}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (response.ok) {
                            const { data } = await response.json();
                            
                            // Find the strategy in allStrategies
                            const strategyIndex = this.allStrategies.findIndex(s => s.id === strategyName);
                            
                            if (strategyIndex !== -1) {
                                // ✅ FALLBACK: Only update if metadata exists and has valid values
                                // Otherwise, keep the hardcoded values from allStrategies
                                if (data && data.metadata) {
                                    
                                    // Update assertividade only if it exists in metadata
                                    if (data.metadata.assertividade) {
                                        this.allStrategies[strategyIndex].assertividade = data.metadata.assertividade;
                                    }
                                    
                                    // Update retorno only if it exists in metadata
                                    if (data.metadata.retorno) {
                                        this.allStrategies[strategyIndex].retorno = data.metadata.retorno;
                                    }

                                    // ✅ CAPTURE VERSION
                                    if (data.version) {
                                        this.allStrategies[strategyIndex].version = data.version;
                                    }
                                    
                                    console.log(`[InvestmentIAView] ✅ ${strategyName} atualizado:`, {
                                        assertividade: this.allStrategies[strategyIndex].assertividade,
                                        retorno: this.allStrategies[strategyIndex].retorno,
                                        version: this.allStrategies[strategyIndex].version
                                    });
                                } else if (data && data.version) {
                                     // Case where metadata might be missing but version exists
                                     this.allStrategies[strategyIndex].version = data.version;
                                     console.log(`[InvestmentIAView] ✅ ${strategyName} versão atualizada: v${data.version}`);
                                } else {
                                    console.log(`[InvestmentIAView] ⚠️ ${strategyName} sem metadata/versão, usando valores padrão`);
                                }
                            }
                        } else {
                            console.warn(`[InvestmentIAView] ⚠️ API retornou status ${response.status} para ${strategyName}`);
                        }
                    } catch (error) {
                        console.error(`[InvestmentIAView] ❌ Erro ao carregar ${strategyName}:`, error);
                        // Continue with next strategy - keep hardcoded values for this one
                    }
                }

                // Save to localStorage only if we have valid data
                if (this.allStrategies && this.allStrategies.length > 0) {
                    localStorage.setItem('zeenix_strategies_cache', JSON.stringify(this.allStrategies));
                    console.log('[InvestmentIAView] ✅ Estratégias salvas no localStorage');
                }

            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro geral ao carregar estratégias:', error);
                
                // Try to load from localStorage cache
                try {
                    const cached = localStorage.getItem('zeenix_strategies_cache');
                    if (cached) {
                        const parsedCache = JSON.parse(cached);
                        if (parsedCache && parsedCache.length > 0) {
                            this.allStrategies = parsedCache;
                            console.log('[InvestmentIAView] ✅ Estratégias carregadas do cache');
                        }
                    } else {
                        console.log('[InvestmentIAView] ℹ️ Nenhum cache encontrado, usando valores hardcoded');
                    }
                } catch (cacheError) {
                    console.error('[InvestmentIAView] ❌ Erro ao carregar cache:', cacheError);
                    console.log('[InvestmentIAView] ℹ️ Usando valores hardcoded do allStrategies');
                }
            } finally {
                this.isLoadingStrategies = false;
            }
        },
    },

    created() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    async mounted() {
        console.log('[InvestmentIAView] mounted() - Modo 100% Frontend');
        
        // Log de status de conexão na montagem (opcional)
        const derivToken = localStorage.getItem('deriv_token');
        const derivConnection = localStorage.getItem('deriv_connection');
        if (!derivToken || !derivConnection) {
            console.log('[InvestmentIAView] ℹ️ Iniciando sem conexão ativa ou cache pendente.');
        }

        await this.loadAvailableAccounts();
        
        if (this.$route.query.strategy) {
            this.selectedStrategy = this.$route.query.strategy;
        }
        
        // Sincronizar saldo inicial
        this.reloadBalance();
        
        // Iniciar polling de saldo via mixin (ajustado para 5s)
        this.startBalancePolling(5000);
        
        window.addEventListener('accountChanged', this.handleGlobalAccountChange);
        window.addEventListener('refreshBalance', () => this.reloadBalance());

        // Load Strategies Dynamically
        try {
            this.isLoadingStrategies = true;
            const strategies = await StrategiesService.getAllStrategies();
            strategiesPresets = strategies; // Update module-level variable
            
            // Update component state
            this.allStrategies = strategies.map(s => {
                const strategyId = s.id.replace('default_', '');
                const hardcoded = this.allStrategies.find(h => h.id === strategyId);
                
                return {
                    id: strategyId,
                    title: strategyId === 'apollo' ? 'IA APOLLO' : s.name,
                    marketType: s.config?.form?.market === 'R_10' ? 'Ups e Downs' : 'Digits',
                    icon: this.getStrategyIcon(s.name),
                    icons: [],
                    description: this.getStrategyDescription(s.name),
                    // Se a API retornar N/A, usar o valor fixo (se existir)
                    assertividade: (s.config?.metadata?.assertividade && s.config.metadata.assertividade !== 'N/A') 
                        ? `${s.config.metadata.assertividade}%` 
                        : (hardcoded?.assertividade || 'N/A'),
                    retorno: (s.config?.metadata?.retorno && s.config.metadata.retorno !== 'N/A') 
                        ? `${s.config.metadata.retorno}%` 
                        : (hardcoded?.retorno || 'N/A')
                };
            });

            console.log('[InvestmentIAView] Estratégias carregadas:', strategiesPresets.length);
        } catch (e) {
            console.error('[InvestmentIAView] Erro ao carregar estratégias:', e);
            this.$root.$toast.error('Erro ao carregar estratégias de IA');
        } finally {
            this.isLoadingStrategies = false;
        }

        // Check if came from monitoring (to restore state)
        const activeConfig = localStorage.getItem('ai_active_config');
        if (activeConfig) {
            const config = JSON.parse(activeConfig);
            if (config.isActive) {
                this.isInvestmentActive = true;
                this.isMonitoring = true;
                // Restore key values
                this.entryValue = config.stake;
                this.profitTarget = config.profitTarget;
                this.lossLimit = config.lossLimit;
                this.selectedStrategy = config.strategy.toLowerCase();
                // Re-init WebSocket connection
                 this.activateIA(true); // true = restore mode
            }
        }
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        window.removeEventListener('accountChanged', this.handleGlobalAccountChange);
        console.log('[InvestmentIAView] Limpando intervalos e listeners...');
        
        this.stopPolling(); // Para os ticks do gráfico
        this.stopStatsUpdates(); // Para as estatísticas diárias
        this.stopBalancePolling(); // Do Mixin
        this.stopTickConnection(); // ✅ [ZENIX v3.5] IMPORTANTE: Matar conexão WebSocket e análise
    },
}
</script>


<style scoped src="@/assets/css/investment-ia.css"></style>