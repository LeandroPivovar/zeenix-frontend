<template>
    <div class="zenix-layout">

        


        <div class="min-h-screen flex flex-col transition-all duration-300" :style="{ marginLeft: isMobile ? '0' : (isSidebarCollapsed ? '0' : '280px') }">
        <TopNavbar 
            :is-sidebar-collapsed="isSidebarCollapsed"
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
                            <div class="text-left">
                                <h1 class="text-xl font-bold text-zenix-text mb-1">Painel de Configuração da IA</h1>
                                <p class="text-sm text-zenix-secondary">Escolha um dos Agentes de investimento, defina sua configuração, inicie e acompanhe os resultados.</p>
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
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-brain text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-bold status-label">ESTRATÉGIAS</p>
                                    </div>
                                    <p class="text-xs text-white status-value">5 IAs Especializadas</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">IAs para diferentes perfis</p>
                                </div>
                                <!-- Card 2: DESEMPENHO -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-chart-line text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-bold status-label">DESEMPENHO</p>
                                    </div>
                                    <p class="text-xs text-white status-value">60% a 75%</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Varia por estratégia e modo</p>
                                </div>
                                <!-- Card 3: CONTROLE -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-sliders-h text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-bold status-label">CONTROLE</p>
                                    </div>
                                    <p class="text-xs text-white status-value">Parcial com Supervisão</p>
                                    <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Você decide quando operar</p>
                                </div>
                                <!-- Card 4: SEGURANÇA -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
                                    <div class="flex items-center justify-center gap-2 mb-2">
                                        <i class="fas fa-shield-alt text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-bold status-label">SEGURANÇA</p>
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
                                                    <i :class="selectedStrategyObject.icon"></i>
                                                </div>
                                            </div>
                                            <span :class="{ 'placeholder': !selectedStrategy }">
                                                <template v-if="selectedStrategyObject">
                                                    IA - {{ selectedStrategyObject.title }}
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
                                    <div v-if="selectedStrategy" :key="selectedStrategy" class="agent-description-card">
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
                            <div class="modal-content categorized-modal">
                                <div class="modal-header-premium">
                                    <h3 class="modal-title">Selecionar Estratégia</h3>
                                    <button @click="closeStrategyModal" class="modal-close-btn">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="agents-modal-list">
                                        <div 
                                            v-for="strategy in availableStrategies" 
                                            :key="strategy.id"
                                            class="agent-option-premium"
                                            :class="{ 'active': selectedStrategy === strategy.id }"
                                            @click="selectStrategy(strategy.id)"
                                        >
                                            <div class="agent-option-info">
                                                <div class="agent-option-simple-row">
                                                    <div class="strategy-icons-inline">
                                                        <div class="strategy-icon-box">
                                                            <i :class="strategy.icon"></i>
                                                        </div>
                                                    </div>
                                                    <div class="agent-option-text-col">
                                                        <h4 class="agent-option-title">{{ strategy.title }}</h4>
                                                        <p class="agent-option-desc" v-html="strategy.description"></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="agent-option-check">
                                                <i class="fas" :class="selectedStrategy === strategy.id ? 'fa-check-circle' : 'fa-circle'"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    :account-balance-prop="balanceNumeric"
                    :account-currency-prop="tradeCurrency"
                    :selected-market-prop="selectedMarket"
                    :stoploss-blindado-config="stoplossBlindado"
                    :is-fictitious-balance-active="isFictitiousBalanceActive"
                    :fictitious-balance="fictitiousBalance"
                    :is-mobile="isMobile"
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
    </div>
    <DesktopBottomNav />
    
    <!-- Sidebar Overlay & Component positioned at the very end to be on top of everything -->
    <div class="sidebar-overlay" v-if="isSidebarOpen" @click="closeSidebar"></div>
    <AppSidebar 
        :is-open="isSidebarOpen" 
        :is-collapsed="isSidebarCollapsed" 
        @toggle-collapse="toggleSidebarCollapse"
        @close-sidebar="closeSidebar"
    />
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import SettingsSidebar from '../components/SettingsSidebar.vue';
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';
import ZenixTooltip from '@/components/ZenixTooltip.vue';
import DesktopBottomNav from '../components/DesktopBottomNav.vue';
import accountBalanceMixin from '../mixins/accountBalanceMixin';
import { loadAvailableAccounts } from '../utils/accountsLoader';
import InsufficientBalanceModal from '../components/InsufficientBalanceModal.vue';
import MinimumStakeModal from '../components/modals/MinimumStakeModal.vue';
import StrategyRequiredModal from '../components/modals/StrategyRequiredModal.vue';

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
        StrategyRequiredModal
    },
    data() {
        return {
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            isMobile: false,
            isInvestmentActive: false,
            isActivating: false,
            showSettingsModal: false,
            showInsufficientBalanceModal: false,
            showMinimumStakeModal: false,

            showStrategyRequiredModal: false,
            availableAccounts: [],
            loadingAccounts: false,

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
            showStrategyModal: false,
            allStrategies: [


                { id: 'atlas', title: 'IA Atlas', marketType: 'Digits', icon: 'fas fa-brain', description: '<strong>Análise:</strong> Híbrida (Fluxo de Dígitos + Price Action) - <strong>Assertividade:</strong> 92 a 96% - <strong>Retorno:</strong> 95% / 99%' },
                { id: 'apollo', title: 'IA Apollo', marketType: 'Ups e Downs', icon: 'fas fa-rocket', description: '<strong>Análise:</strong> Price Action Puro (Inércia + Força + Tendência) - <strong>Assertividade:</strong> 90% a 95% - <strong>Retorno:</strong> 99%' },
                { id: 'nexus', title: 'IA Nexus', marketType: 'Ups e Downs', icon: 'fas fa-share-alt', description: '<strong>Análise:</strong> Price Action (Barreira de Segurança) com Troca de Contrato - <strong>Assertividade:</strong> 91% a 95% - <strong>Retorno:</strong> 91% / 95%' },
                { id: 'orion', title: 'IA Orion', marketType: 'Digits', icon: 'fas fa-star', description: '<strong>Análise:</strong> Estatística de Dígitos (Over 2) com Price Action na Recuperação - <strong>Assertividade:</strong> 94% a 97% - <strong>Retorno:</strong> 95% / 99%' },
                { id: 'titan', title: 'IA Titan', marketType: 'Digits', icon: 'fas fa-shield-alt', description: '<strong>Análise:</strong> Dígitos Par/Ímpar com persistência direcional - <strong>Assertividade:</strong> 90-95% - <strong>Retorno:</strong> 95%' }
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
            }
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
                return `+${this.tradeCurrency} ${value.toFixed(2)}`;
            } else {
                return `-${this.tradeCurrency} ${Math.abs(value).toFixed(2)}`;
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
                'apollo': '<strong>Análise:</strong> Price Action Puro (Inércia + Força + Tendência) - <strong>Assertividade:</strong> 90% a 95% - <strong>Retorno:</strong> 99%',
                'nexus': '<strong>Análise:</strong> Price Action (Barreira de Segurança) com Troca de Contrato - <strong>Assertividade:</strong> 91% a 95% - <strong>Retorno:</strong> 91% / 95%',
                'orion': '<strong>Análise:</strong> Estatística de Dígitos (Over 2) com Price Action na Recuperação - <strong>Assertividade:</strong> 94% a 97% - <strong>Retorno:</strong> 95% / 99%',
                'titan': '<strong>Análise:</strong> Dígitos Par/Ímpar com persistência direcional - <strong>Assertividade:</strong> 90-95% - <strong>Retorno:</strong> 95%'
            };
            return descriptions[this.selectedStrategy] || descriptions.atlas;
        },
        
        entryValuePercent() {
            if (!this.balanceNumeric || this.balanceNumeric <= 0) return '0.00';
            return ((this.entryValue / this.balanceNumeric) * 100).toFixed(2);
        },
        profitTargetPercent() {
            if (!this.balanceNumeric || this.balanceNumeric <= 0) return '0.00';
            return ((this.profitTarget / this.balanceNumeric) * 100).toFixed(2);
        },
        lossLimitPercent() {
            if (!this.balanceNumeric || this.balanceNumeric <= 0) return '0.00';
            return ((this.lossLimit / this.balanceNumeric) * 100).toFixed(2);
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
                'agressivo': 'Alto'
            };
            return labels[this.modoMartingale] || 'Baixo';
        },
        
        riskBarWidth() {
            const widths = {
                'conservador': '25%',
                'moderado': '50%',
                'agressivo': '75%'
            };
            return widths[this.modoMartingale] || '25%';
        },
        
        riskDescriptionText() {
            const descriptions = {
                'conservador': 'Recupera o valor perdido até o M5 (sexta perda). Se não conseguir, assume a perda e reseta para o valor da entrada inicial.',
                'moderado': 'Recuperação ilimitada com +15% de lucro sobre as perdas totais',
                'agressivo': 'Recuperação ilimitada com +30% de lucro sobre as perdas totais'
            };
            return descriptions[this.modoMartingale] || descriptions.conservador;
        }
    },
    methods: {
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
                // Ativando IA
                await this.activateIA();
                
                // ✅ FIX: Se a ativação falhar (isInvestmentActive continuar false),
                // forçar o checkbox a voltar para unchecked.
                if (!this.isInvestmentActive) {
                    console.log('[InvestmentIAView] ⚠️ Ativação falhou ou cancelada, revertendo toggle.');
                    // Forçar atualização do DOM caso o Vue não detecte a mudança (já que o model já era false)
                    event.target.checked = false;
                }
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
                // ✅ Validação de Estratégia (User Story: Modal de Aviso)
                if (!this.selectedStrategy) {
                    console.warn('[InvestmentIAView] ⚠️ Nenhuma estratégia selecionada. Exibindo modal.');
                    this.showStrategyRequiredModal = true;
                    return;
                }

                console.log('[InvestmentIAView] ===== ATIVANDO IA =====');
                console.log('[InvestmentIAView] 💰 VALOR DE ENTRADA:', this.entryValue);
                console.log('[InvestmentIAView] Parâmetros configurados:', {
                    entryValue: this.entryValue,
                    profitTarget: this.profitTarget,
                    lossLimit: this.lossLimit,
                    mode: this.mode
                });

                if (!this.entryValue || this.entryValue < 0.35) {
                    console.warn('[InvestmentIAView] ⚠️ Valor de entrada inválido:', this.entryValue);
                    this.showMinimumStakeModal = true;
                    this.isActivating = false;
                    return;
                }

                // ✅ [NOVO] Validação de saldo mínimo (pelo menos 1 entrada)
                const currentBalance = this.balanceNumeric || 0;
                const requiredBalance = this.entryValue;

                console.log('[InvestmentIAView] 🔍 Verificando saldo mínimo:', {
                    current: currentBalance,
                    required: requiredBalance,
                    accountType: this.accountType
                });

                if (currentBalance < requiredBalance) {
                    console.warn('[InvestmentIAView] ⚠️ Saldo insuficiente para iniciar:', currentBalance, '<', requiredBalance);
                    this.showInsufficientBalanceModal = true;
                    this.isActivating = false;
                    return;
                }

                const userId = this.getUserId();
                if (!userId) {
                    console.error('[InvestmentIAView] ❌ Usuário não identificado');
                    return;
                }

                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.error('[InvestmentIAView] ❌ Token Deriv não encontrado');
                    return;
                }

                const preferredCurrency = (this.tradeCurrency === 'DEMO' || !this.tradeCurrency) ? 'USD' : this.tradeCurrency;
                
                // O saldo agora vem do mixin centralizado (balanceNumeric)
                const accountBalanceReal = this.balanceNumeric || 0;

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const capitalInicial = accountBalanceReal > 0 ? accountBalanceReal : (this.balanceNumeric || this.entryValue || 1);
                
                console.log('[InvestmentIAView] 💰 Capital inicial para IA:', capitalInicial, '| Valor de entrada por operação:', this.entryValue);
                
                const response = await fetch(`${apiBase}/ai/activate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        stakeAmount: capitalInicial, // ✅ Capital inicial = saldo real da conta ($9k)
                        entryValue: this.entryValue || 1, // ✅ Valor de entrada por operação ($1.00)
                        derivToken: derivToken,
                        currency: preferredCurrency,
                        mode: this.mode.toLowerCase(),
                        profitTarget: this.profitTarget,
                        lossLimit: this.lossLimit,
                        modoMartingale: this.modoMartingale || 'conservador',
                        strategy: this.selectedStrategy || 'orion',
                        stopLossBlindado: this.stoplossBlindado, // ✅ ZENIX v2.0: Stop-Loss Blindado
                        selectedMarket: this.selectedMarket, // ✅ Sincronização de Mercado (ZENIX v2.0)
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    this.isInvestmentActive = true;
                    console.log('[InvestmentIAView] ✅ IA ativada com sucesso!');
                    
                    // Buscar histórico de ticks para construir o gráfico
                    await this.fetchTicksHistory(1000);
                } else {
                    console.error('[InvestmentIAView] ❌ Erro ao ativar IA:', result.message);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao ativar IA:', error);
            } finally {
                this.isActivating = false;
            }
        },

        async deactivateIA() {
            try {
                console.log('[InvestmentIAView] Desativando IA...');

                const userId = this.getUserId();
                if (!userId) {
                    console.error('[InvestmentIAView] ❌ Usuário não identificado');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const response = await fetch(`${apiBase}/ai/deactivate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    this.isInvestmentActive = false;
                    console.log('[InvestmentIAView] ✅ IA desativada com sucesso!');
                } else {
                    console.error('[InvestmentIAView] ❌ Erro ao desativar IA:', result.message);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao desativar IA:', error);
            }
        },

        handleStrategyRequiredConfirm() {
            this.showStrategyRequiredModal = false;
            this.openStrategyModal();
        },

        openStrategyModal() {
            this.showStrategyModal = true;
        },

        closeStrategyModal() {
            this.showStrategyModal = false;
        },
        
        selectStrategy(id) {
            this.selectedStrategy = id;
            
            // ✅ Sincronização de Mercado Automática (ZENIX v2.0)
            const strategyLower = id.toLowerCase();
            if (strategyLower === 'atlas') {
                this.selectedMarket = 'vol100';
                console.log('[InvestmentIAView] 🎯 Atlas selecionado: Alternando mercado para Volatility 100 Index');
            } else if (['orion', 'titan', 'nexus', 'apollo'].includes(strategyLower)) {
                this.selectedMarket = 'vol100';
                console.log(`[InvestmentIAView] 🎯 ${id.toUpperCase()} selecionado: Alternando mercado para Volatility 100 Index`);
            } else {
                this.selectedMarket = 'vol10';
            }

            // Delay closing to show visual feedback (check icon)
            setTimeout(() => {
                this.closeStrategyModal();
            }, 300);
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

        getDerivToken() {
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
            this.fetchDailyStats();
            this.statsUpdateInterval = setInterval(() => {
                this.fetchDailyStats();
            }, 10000);
            
            console.log('[InvestmentIAView] ⏰ Atualizações de stats iniciadas');
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
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
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
        }
    },
    created() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    async mounted() {
        console.log('[InvestmentIAView] mounted() - Sincronizando com logic do Dashboard');
        await this.loadAvailableAccounts();
        
        // Verificar se há uma estratégia passada via query param
        if (this.$route.query.strategy) {
            console.log('[InvestmentIAView] 🎯 Estratégia recebida via query:', this.$route.query.strategy);
            this.selectedStrategy = this.$route.query.strategy;
        }
        
        // O accountBalanceMixin já lida com loadTradeCurrency e loadAccountBalanceInfo no seu mounted()
        
        await this.checkAIStatus();
        
        console.log('[InvestmentIAView] Iniciando carregamento de dados...');
        this.startDataLoading();
        
        console.log('[InvestmentIAView] Iniciando atualização de estatísticas...');
        this.startStatsUpdates();
        
        // Iniciar polling de saldo via mixin (ajustado para 5s)
        this.startBalancePolling(5000);
        
        // Escutar mudanças de conta e pedidos de refresh para atualizar saldo automaticamente
        window.addEventListener('accountChanged', this.handleGlobalAccountChange);
        window.addEventListener('refreshBalance', () => this.reloadBalance());
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        window.removeEventListener('accountChanged', this.handleGlobalAccountChange);
        console.log('[InvestmentIAView] Limpando intervalos e listeners...');
        
        this.stopPolling(); // Para os ticks do gráfico
        this.stopStatsUpdates(); // Para as estatísticas diárias
        this.stopBalancePolling(); // Do Mixin
    },
}
</script>

<style scoped>
/* Importando estilos do design fornecido */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
}



/* Force Sidebar Background on Mobile */
:deep(.sidebar) {
    background-color: #0B0B0B !important;
}

.zenix-layout {
    min-height: 100vh;
    background: linear-gradient(to bottom, #102018 0%, #020403 50%, #000100 100%);
    color: #DFDFDF;
}

/* Desktop: remover gradiente e aplicar #0e0e0e nos cards */
@media (min-width: 1025px) {
    .zenix-layout {
        background: #0b0b0b;
    }

    .main-content {
        margin-top: 60px!important;
        justify-content: flex-start !important;
        display: flex;
        flex-direction: column;
    }

    .bg-zenix-card {
        background: #0e0e0e !important;
    }

    .bg-zenix-bg {
        background-color: #0e0e0e !important;
    }

    .ai-vision-card {
        background: #0e0e0e !important;
    }

    .config-card {
        background: #0e0e0e !important;
    }

    .ai-control-card {
        background: #0e0e0e !important;
    }
}

/* Obsolete styles removed: .content-wrapper, .top-header */

.header-content {
    padding: 1rem 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
}

.header-left-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    justify-content: center;
    align-items: flex-start;
}

.header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #DFDFDF;
    margin: 0;
    line-height: 1.2;
}

.header-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
    margin: 0;
    line-height: 1.4;
}

.balance-display-card {
    background-color: #0E0E0E;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 0.75rem;
    transition: all 0.3s ease;
}

.balance-display-card:hover {
    background: #111;
    transform: translateY(-1px);
}

.balance-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.balance-header i {
    color: #22C55E;
    font-size: 0.75rem;
}

.balance-info {
    display: flex;
    flex-direction: column;
}

.balance-label {
    font-size: 0.625rem;
    color: #7A7A7A;
    font-weight: 500;
}

.balance-value-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.125rem;
}

.balance-value {
    font-size: 1rem;
    font-weight: bold;
    color: #DFDFDF;
}

.account-type-btn {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
}

.real-btn {
    background-color: #22C55E;
    color: #000;
}

.real-btn:hover {
    background-color: #16A34A;
}

.demo-btn {
    background-color: #333;
    color: #A1A1A1;
}

.eye-toggle-btn {
    background: none;
    border: none;
    color: #A1A1A1;
    cursor: pointer;
    padding: 0.25rem;
    transition: color 0.2s;
}

.eye-toggle-btn:hover {
    color: #DFDFDF;
}

/* Main Content - Desktop & Mobile Adjustments */
.main-content {
    margin-top: 60px; 
    padding: 30px 15px !important; /* Default desktop padding adjusted to 30px */
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start !important;
    background-color: transparent;
}

@media (max-width: 1024px) {
    .main-content {
        padding: 60px 15px !important; /* Mobile padding */
    }
}

/* AI Vision Panel */
#ai-vision-panel {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    width: 100%;
    box-sizing: border-box;
}

.ai-vision-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    width: 100%;
    box-sizing: border-box;
}

.premium-card {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
}

.glow-green {
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.06);
}

/* Tailwind-like utility classes for AI Vision Panel */
.bg-zenix-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
}

.bg-zenix-bg {
    background-color: #0B0B0B;
}

.border-zenix-border {
    border-color: #1C1C1C;
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

.bg-zenix-green {
    background-color: #22C55E;
}

.text-black {
    color: #000;
}

.rounded-xl {
    border-radius: 0.75rem;
}

.grid-cols-12 {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
}

@media (max-width: 768px) {
    .grid-cols-12 {
        grid-template-columns: 1fr;
    }
}

.grid-cols-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.col-span-5 {
    grid-column: span 5 / span 5;
}

.col-span-7 {
    grid-column: span 7 / span 7;
}

.gap-5 {
    gap: 1.25rem;
}

.gap-4 {
    gap: 1rem;
}

.gap-2 {
    gap: 0.5rem;
}

.gap-2\.5 {
    gap: 0.625rem;
}

.h-\[220px\] {
    height: 220px;
}

.from-zenix-green\/10 {
    --tw-gradient-from: rgba(34, 197, 94, 0.1);
}

.to-transparent {
    --tw-gradient-to: transparent;
}

.bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.border-zenix-green\/30 {
    border-color: rgba(34, 197, 94, 0.3);
}

.w-40 {
    width: 10rem;
}

.h-40 {
    height: 10rem;
}

.w-32 {
    width: 8rem;
}

.h-32 {
    height: 8rem;
}

.w-24 {
    width: 6rem;
}

.h-24 {
    height: 6rem;
}

.w-3 {
    width: 0.75rem;
}

.h-3 {
    height: 0.75rem;
}

.w-2 {
    width: 0.5rem;
}

.h-2 {
    height: 0.5rem;
}

.w-2\.5 {
    width: 0.625rem;
}

.h-2\.5 {
    height: 0.625rem;
}

.w-1 {
    width: 0.25rem;
}

.h-1 {
    height: 0.25rem;
}

.w-1\.5 {
    width: 0.375rem;
}

.h-1\.5 {
    height: 0.375rem;
}

.w-20 {
    width: 5rem;
}

.w-16 {
    width: 4rem;
}

.h-px {
    height: 1px;
}

.text-5xl {
    font-size: 3rem;
    line-height: 1;
}

.text-base {
    font-size: 1rem;
    line-height: 1.5rem;
}

.text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
}

.text-\[10px\] {
    font-size: 10px;
}

.font-bold {
    font-weight: 700;
}

.font-semibold {
    font-weight: 600;
}

.font-medium {
    font-weight: 500;
}

.mb-1 {
    margin-bottom: 0.25rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mb-5 {
    margin-bottom: 1.25rem;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.mt-0\.5 {
    margin-top: 0.125rem;
}

.mt-1 {
    margin-top: 0.25rem;
}

.p-3 {
    padding: 0.75rem;
}

.p-4 {
    padding: 1rem;
}

.p-6 {
    padding: 1.5rem;
}

.px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.py-0\.5 {
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
}

.space-x-1 {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.25rem * var(--tw-space-x-reverse));
    margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-2 {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-x-2\.5 {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.625rem * var(--tw-space-x-reverse));
    margin-left: calc(0.625rem * calc(1 - var(--tw-space-x-reverse)));
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.items-start {
    align-items: flex-start;
}

.justify-between {
    justify-content: space-between;
}

.justify-center {
    justify-content: center;
}

.flex-col {
    flex-direction: column;
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

.overflow-hidden {
    overflow: hidden;
}

.z-10 {
    z-index: 10;
}

.z-20 {
    z-index: 20;
}

.opacity-20 {
    opacity: 0.2;
}

.opacity-30 {
    opacity: 0.3;
}

.blur-xl {
    filter: blur(24px);
}

.rounded-full {
    border-radius: 9999px;
}

.border-2 {
    border-width: 2px;
}

.border {
    border-width: 1px;
}

.bg-zenix-green\/20 {
    background-color: rgba(34, 197, 94, 0.2);
}

.bg-zenix-green\/70 {
    background-color: rgba(34, 197, 94, 0.7);
}

.bg-zenix-green\/80 {
    background-color: rgba(34, 197, 94, 0.8);
}

.bg-zenix-green {
    background-color: #22C55E;
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-transparent {
    --tw-gradient-from: transparent;
}

.via-zenix-green {
    --tw-gradient-via: #22C55E;
}

.to-transparent {
    --tw-gradient-to: transparent;
}

.hover\:bg-zenix-green-hover:hover {
    background-color: #16A34A;
}

.hover\:text-zenix-text:hover {
    color: #DFDFDF;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.transition-colors {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.cursor-pointer {
    cursor: pointer;
}

@import '../assets/css/animations.css';

.fade-in {
    animation: fadeIn 0.4s ease-out;
}

/* Keyframes removed - moved to animations.css */

.stream-3 {
    width: 6rem;
    top: 70%;
    left: -20px;
    animation: streamRight 3s linear infinite 1s;
}

@keyframes streamRight {
    0% {
        left: -20px;
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        left: 100%;
        opacity: 0;
    }
}

/* AI Status Grid */
.ai-status-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.status-info-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1rem;
    transition: all 0.3s ease;
}

.status-info-card:hover {
    background: #111;
    transform: translateY(-1px);
}

.status-info-label {
    font-size: 0.625rem;
    color: #A1A1A1;
    margin-bottom: 0.5rem;
}

.status-info-value {
    font-size: 1rem;
    font-weight: bold;
    color: #A1A1A1;
    margin-bottom: 0.25rem;
}

.status-info-value.active {
    color: #22C55E;
}

.status-info-detail {
    font-size: 0.625rem;
    color: #7A7A7A;
}

/* Config Grid */
.config-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    margin-top: 0; /* Remove margem superior extra */
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    box-sizing: border-box;
}

/* Order para desktop - ordem padrão */
#market-strategy-card {
    order: 1;
}

#entry-params-card {
    order: 2;
}

#risk-management-card {
    order: 3;
}

#ai-control-card {
    order: 4;
}

/* Gerenciamento de Risco */
.flex-1 {
    flex: 1;
}

.loss-stoploss-row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.ai-status-group {
    margin-top: 0.5rem;
}

.ai-status-control-simple {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1.5rem;
    background: linear-gradient(135deg, rgba(29, 229, 103, 0.03) 0%, rgba(68, 115, 69, 0.11) 100%);
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
}

.ai-status-info {
    flex: 1;
}

.ai-status-subtitle {
    font-size: 0.75rem;
    color: #A1A1A1;
    margin: 0;
    text-align: justify;
}

.ai-status-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.ai-status-text {
    font-size: 0.875rem;
    font-weight: bold;
    color: #A1A1A1;
}

.ai-status-text.active {
    color: #22C55E;
}

/* Garantir que no desktop (acima de 768px) as regras sejam aplicadas */
@media (min-width: 769px) {
    .risk-management-mobile {
        display: none !important;
    }
}

.config-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 2px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    width: 100%;
    box-sizing: border-box;
}

/* Garantir que todos os cards tenham o mesmo gradiente */
.config-card.premium-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
}

.card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card-title i {
    color: #A1A1A1;
    font-size: 0.75rem;
    cursor: pointer;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Reduzindo gap de 1rem para 0.5rem */
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.875rem;
    color: #A1A1A1;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.form-label i {
    font-size: 0.75rem;
    color: #A1A1A1;
    cursor: pointer;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-prefix {
    position: absolute;
    left: 0;
    top: 0;
    width: 2.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #DFDFDF;
    font-size: 0.95rem;
    z-index: 1;
    pointer-events: none;
    line-height: normal;
}

.form-select,
.form-input {
    width: 100%;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #DFDFDF;
    outline: none;
    transition: border-color 0.2s;
    height: 45px;
    box-sizing: border-box;
}

.form-select {
    padding: 0.625rem 0.75rem;
}

.form-input {
    padding-left: 1.75rem;
    padding-right: 0.75rem;
}

.form-select:focus,
.form-input:focus {
    border-color: #22C55E;
}

.form-group input{
    margin-bottom: 0rem;
}

.form-help {
    font-size: 0.8rem;
    color: #A1A1A1;
    opacity: 0.6;
    text-align: justify;
}

/* Mode Buttons */
.mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
}

.mode-btn {
    padding: 0.5rem 0.75rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #A1A1A1;
    cursor: pointer;
    transition: all 0.2s;
}

.mode-btn:hover {
    border-color: #22C55E;
}

.mode-btn.active {
    background-color: #0A1A0A;
    color: #22C55E;
    border-color: #22C55E;
    border-width: 1px;
    font-weight: 500;
    box-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
}

/* Risk Buttons */
.risk-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.risk-btn {
    padding: 0.5rem 0.75rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #A1A1A1;
    cursor: pointer;
    transition: all 0.2s;
}

.risk-btn:hover {
    border-color: #22C55E;
}

.risk-btn.active {
    background-color: #0A1A0A;
    color: #22C55E;
    border-color: #22C55E;
    border-width: 1px;
    font-weight: 500;
    box-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
}

/* Risk Indicator */
.risk-indicator {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 1rem;
}

.risk-header {
    display: flex;
    align-items: center;
        justify-content: space-between;
    margin-bottom: 0.5rem;
}

.risk-label {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.risk-level-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #22C55E;
}

.risk-bar-container {
    width: 100%;
    background-color: #0E0E0E;
    border-radius: 9999px;
    height: 0.5rem;
    margin-bottom: 0.75rem;
}

.risk-bar {
    background-color: #22C55E;
    height: 0.5rem;
    border-radius: 9999px;
    transition: width 0.3s ease;
}

.risk-description {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
    text-align: justify;
}

/* Stoploss Blindado Slider */
.stoploss-blindado-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    background-color: #0b0b0b;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    height: 38px; /* Standardize desktop input height */
    box-sizing: border-box;
}

.stoploss-blindado-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #DFDFDF;
}

.stoploss-blindado-label i {
    font-size: 0.875rem;
    color: #22C55E;
}

.stoploss-toggle {
    flex-shrink: 0;
    height: 1.75rem;
}

.stoploss-toggle .toggle-slider {
    height: 1.75rem;
}

.stoploss-toggle .toggle-slider::before {
    height: 1.25rem;
    width: 1.25rem;
}

.stoploss-toggle input:checked + .toggle-slider::before {
    transform: translateX(calc(4rem - 1.25rem - 6px));
}

/* AI Control Card */
.ai-control-card {
    position: relative;
    overflow: hidden;
    border: 2px solid rgba(34, 197, 94, 0.2);
    box-shadow: 0 0 24px rgba(34, 197, 94, 0.08), 0 4px 16px rgba(0, 0, 0, 0.3);
    background: linear-gradient(to bottom right, #0C0C0C 0%, #0A0A0A 100%);
}

.ai-control-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.ai-control-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 50%, transparent 100%);
}

.animated-grid-ai {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: gridMove 20s linear infinite;
    opacity: 0.2;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%, rgba(34, 197, 94, 0.05) 100%);
}

.particles-ai {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.particle-ai {
    position: absolute;
    background: #22C55E;
    border-radius: 50%;
}

.particle-ai-1 {
    width: 0.25rem;
    height: 0.25rem;
    top: 20%;
    left: 15%;
    animation: float 3s ease-in-out infinite;
}

.particle-ai-2 {
    width: 0.375rem;
    height: 0.375rem;
    background: rgba(34, 197, 94, 0.7);
    top: 60%;
    right: 20%;
    animation: float 4s ease-in-out infinite 0.5s;
}

.particle-ai-3 {
    width: 0.25rem;
    height: 0.25rem;
    background: rgba(34, 197, 94, 0.6);
    bottom: 20%;
    left: 30%;
    animation: float 3.5s ease-in-out infinite 1s;
}

.particle-ai-4 {
    width: 0.375rem;
    height: 0.375rem;
    top: 40%;
    right: 30%;
    animation: float 4.5s ease-in-out infinite 1.5s;
}

.data-streams-ai {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.3;
    pointer-events: none;
}

.stream-ai {
    position: absolute;
    height: 1px;
    background: linear-gradient(to right, transparent, #22C55E, transparent);
}

.stream-ai-1 {
    width: 5rem;
    top: 30%;
    left: -20px;
    animation: streamRight 2s linear infinite;
}

.stream-ai-2 {
    width: 4rem;
    top: 50%;
    left: -20px;
    animation: streamRight 2.5s linear infinite 0.5s;
}

.stream-ai-3 {
    width: 6rem;
    top: 70%;
    left: -20px;
    animation: streamRight 3s linear infinite 1s;
}

.ai-control-content {
    position: relative;
    z-index: 10;
}

.ai-status-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
}

.ai-status-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
    text-align: left;
}

.ai-status-subtitle {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.ai-status-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.ai-status-text {
    font-size: 0.875rem;
    font-weight: bold;
    color: #A1A1A1;
}

.ai-status-text.active {
    color: #22C55E;
}

/* Toggle Switch */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 4rem;
    height: 2rem;
    cursor: pointer;
    flex-shrink: 0;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.toggle-slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 4rem;
    height: 2rem;
    background-color: #0B0B0B;
    border: 2px solid #1C1C1C;
    border-radius: 9999px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    height: 1.5rem;
    width: 1.5rem;
    left: 3px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
    background-color: #22C55E;
    border-color: #22C55E;
}

.toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(calc(4rem - 1.5rem - 6px));
}

.ai-status-message {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    display: none;
}

@media (min-width: 769px) {
    .ai-status-message {
        display: none !important;
    }
}

.ai-message-text {
    font-size: 0.875rem;
    color: #A1A1A1;
    line-height: 1.5;
    margin: 0;
    text-align: center;
}

.ai-status-inactive {
    color: #EF4444;
    font-weight: 600;
}

.ai-status-note {
    text-align: center;
}

.ai-note-text {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
    font-style: italic;
}

/* Chart Section */
.chart-section {
    margin-bottom: 1.5rem;
    margin-left: -20px;
    margin-right: -20px;
    width: calc(100% + 40px);
    box-sizing: border-box;
}

    .ai-status-info label{
        margin: 0 !important;
        font-size: 0.9rem !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        color: #C5C5C5 !important;
    }

/* Ensure all cards and divs occupy 100% width */
.ai-vision-card,
.config-card,
.config-grid,
.chart-section,
#ai-vision-panel {
    width: 100%;
    box-sizing: border-box;
}

/* Footer */
.zenix-footer {
    background-color: #0B0B0B;
    border-top: 1px solid #1C1C1C;
    margin-top: 3rem;
    width: 100%;
}

.footer-content {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 20px;
    box-sizing: border-box;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
    margin-bottom: 2rem;
}

.footer-brand {
    grid-column: span 1;
}

.footer-logo {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.footer-logo-main {
    font-size: 1.125rem;
    font-weight: 600;
    color: #DFDFDF;
}

.footer-logo-sub {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.footer-description {
    color: #A1A1A1;
    font-size: 0.75rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.6;
}

.footer-social {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.social-icon {
    color: #A1A1A1;
    transition: color 0.2s;
    opacity: 0.5;
}

.social-icon:hover {
    color: #DFDFDF;
}

.footer-column-title {
    color: #DFDFDF;
    font-weight: 500;
    font-size: 0.75rem;
    margin-bottom: 1rem;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.footer-links a {
    color: #A1A1A1;
    font-size: 0.75rem;
    text-decoration: none;
    transition: color 0.2s;
    opacity: 0.6;
}

.footer-links a:hover {
    color: #DFDFDF;
}

.footer-bottom {
    border-top: 1px solid #1A1A1A;
    padding-top: 2rem;
    opacity: 0.4;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

@media (min-width: 768px) {
    .footer-bottom {
        flex-direction: row;
    justify-content: space-between;
    align-items: center;
    }
}

.footer-copyright {
    color: #A1A1A1;
    font-size: 0.75rem;
}

.footer-legal {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 0.75rem;
}

.footer-legal a {
    color: #A1A1A1;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-legal a:hover {
    color: #DFDFDF;
}

.footer-separator {
    color: #1C1C1C;
}

/* Responsive */
@media (max-width: 1024px) {
    .content-wrapper {
        margin-left: 0;
        width: 100%;
    }
    
    .content-wrapper.sidebar-collapsed {
        margin-left: 0;
        width: 100%;
    }
    
    .main-content {
        padding: 1rem 15px;
        padding-bottom: 90px !important;
    }
    
    .config-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .grid.grid-cols-12 {
        grid-template-columns: 1fr;
    }
    
    .col-span-5,
    .col-span-7 {
        grid-column: span 1;
    }
    
    .col-span-7 .grid.grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    #ai-vision-panel {
        margin-left: 0;
        margin-right: 0;
    }
    
    .chart-section {
        margin-left: -15px;
        margin-right: -15px;
        width: calc(100% + 30px);
    }
}

@media (max-width: 768px) {
    .zenix-layout {
        background: linear-gradient(to bottom, #102018 0%, #020403 50%, #000100 100%) !important;
        background-color: transparent !important;
        position: relative;
    }
    
    .zenix-layout::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(10, 53, 25, 0.15) 0%, rgba(1, 5, 2, 0.05) 50%, transparent 80%);
        pointer-events: none;
        z-index: 0;
    }
    
    .zenix-layout > * {
        position: relative;
        z-index: 1;
    }
    
    /* SettingsSidebar não deve ser afetado pelo z-index do zenix-layout */
    .zenix-layout > :deep(.settings-modal-overlay) {
        position: fixed !important;
        z-index: 100000 !important;
    }
    
    .content-wrapper {
        margin-left: 0;
        width: 100%;
        background: transparent !important;
    }
    
    .content-wrapper.sidebar-collapsed {
        margin-left: 0;
        width: 100%;
    }
    
    /* Gradiente no fundo da página - apenas mobile */
    .main-content {
        margin-top: 0px;
        padding: 0rem 15px;
        background: transparent !important;
        position: relative;
    }
    
    /* Gradiente nos cards de configuração - apenas mobile */
    .config-card {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
    }
    
    
    #ai-vision-panel {
        margin-bottom: 1rem;
    }
    
    .grid.grid-cols-12 {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .col-span-5 {
        grid-column: span 1;
        height: 180px;
    }
    
    .col-span-7 {
        grid-column: span 1;
    }
    
    .col-span-7 .grid.grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
    
    .col-span-7 .bg-zenix-bg {
        padding: 0.875rem;
    }
    
    .col-span-7 .text-\[10px\] {
        font-size: 9px;
    }
    
    .col-span-7 .text-base {
        font-size: 0.875rem;
    }
    
    .col-span-7 .text-sm {
        font-size: 0.8125rem;
    }
    
    .config-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }
    
    /* Reorganização da ordem no mobile */
    #market-strategy-card {
        order: 1;
    }
    
    #entry-params-card {
        order: 2;
    }
    
    #ai-control-card {
        order: 3;
    }
    
    .risk-management-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    /* Mostrar apenas o texto descritivo no mobile, esconder barra e header */
    .risk-management-section .risk-indicator {
        display: block !important;
        background-color: transparent !important;
        border: none !important;
        padding: 0.5rem 0 !important;
        margin-top: 0.5rem;
    }
    
    .risk-management-section .risk-header,
    .risk-management-section .risk-bar-container {
        display: none !important;
    }
    
    .risk-management-section .risk-description {
        display: block !important;
        font-size: 0.75rem;
        color: #A1A1A1;
        opacity: 0.8;
        text-align: center;
        margin: 0;
    }
    
    /* Gradiente nos cards de configuração - apenas mobile */
    .config-card {
        padding: 1rem;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    }
    
    .card-content {
        gap: 0.875rem;
    }
    
    .form-group {
        gap: 0.375rem;
    }
    
    .card-title {
        font-size: 0.8125rem;
        margin-bottom: 0.875rem;
    }
    
    .form-label {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        color: #DFDFDF;
    }
    
    .form-select,
    .form-input {
        font-size: 0.875rem;
        padding: 0.875rem 1rem;
        background-color: #000000 !important;
        border: 1px solid #1C1C1C !important;
        border-radius: 0.5rem;
        color: #FFFFFF !important;
        font-weight: 600;
    }
    
    .form-input {
        padding-left: 2rem;
    }
    
    .input-prefix {
        left: 0;
        top: 0;
        height: 100%;
        width: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF !important;
        font-weight: 600;
        line-height: normal;
    }
    
    .form-help {
        font-size: 0.8125rem;
    }
    
    .mode-buttons {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
    }
    
    .mode-btn {
        padding: 0.75rem 0.75rem;
        font-size: 0.75rem;
    }
    
    .risk-buttons {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }
    
    .risk-btn {
        padding: 0.75rem 0.75rem;
        font-size: 0.75rem;
    }
    
    .risk-indicator {
        padding: 0.875rem;
    }
    
    .risk-label,
    .risk-level-text {
        font-size: 0.7rem;
    }
    
    .risk-description {
        font-size: 0.7rem;
    }
    
    .ai-status-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .ai-status-control-simple {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        padding: 1rem;
        background-color: #000000;
        border: 1px solid #1C1C1C;
        margin-bottom: 0;
    }
    
    .ai-status-info {
        flex: 1;
    }
    
    .ai-status-toggle-wrapper {
        flex-shrink: 0;
        justify-content: flex-end;
        gap: 0.75rem;
    }
    
    .ai-status-title {
        font-size: 1rem;
        font-weight: 600;
        color: #DFDFDF;
        margin-bottom: 0.25rem;
        text-align: left;
    }
    
    .ai-status-subtitle {
        font-size: 0.875rem;
        color: #A1A1A1;
        text-align: left;
    }
    
    .ai-status-text {
        font-size: 0.8125rem;
        display: none;
    }
    
    .ai-status-message {
        display: block;
        margin-top: 1rem;
        padding: 0.875rem;
        background-color: #0B0B0B;
        border: 1px solid #1C1C1C;
        border-radius: 0.5rem;
    }
    
    .ai-message-text {
        font-size: 0.875rem;
        text-align: center;
    }
    
    .toggle-switch {
        width: 3.5rem;
        height: 1.75rem;
    }
    
    .toggle-slider {
        width: 3.5rem;
        height: 1.75rem;
    }
    
    .toggle-slider::before {
        height: 1.25rem;
        width: 1.25rem;
    }
    
    .toggle-switch input:checked + .toggle-slider::before {
        transform: translateX(calc(3.5rem - 1.25rem - 6px));
    }
    
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .chart-section {
        margin-left: -15px;
        margin-right: -15px;
        width: calc(100% + 30px);
    }
    
    .p-6 {
        padding: 1rem;
    }
    
    .mb-6 {
        margin-bottom: 1rem;
    }
    
    .text-xl {
        font-size: 1.125rem;
    }
    
    .h-\[220px\] {
        height: 180px;
    }
    
    .w-40 {
        width: 8rem;
    }
    
    .h-40 {
        height: 8rem;
    }
    
    .w-32 {
        width: 6rem;
    }
    
    .h-32 {
        height: 6rem;
    }
    
    .w-24 {
        width: 4.5rem;
    }
    
    .h-24 {
        height: 4.5rem;
    }
    
    .text-5xl {
        font-size: 2rem;
    }
    
    .ai-brain-glow i {
        font-size: 2rem !important;
    }
}

/* Sidebar Overlay - Fecha ao clicar fora */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85); /* Increased opacity instead of blur */
    z-index: 10001;
    cursor: pointer;
}

/* Premium Selector Button */
.premium-selector-btn {
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 48px; /* Reduced from 64px */
    height: auto;
    box-sizing: border-box;
    display: flex; /* Ensure flex behavior for centering */
    align-items: center;
}

.premium-selector-btn:hover {
    border-color: #22C55E;
    background-color: #0d1a10;
}

.selector-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.selector-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}


.selector-left span {
    font-size: 0.875rem;
    font-weight: 500;
}

.selector-left span.placeholder {
    color: #A1A1A1;
}

.selector-arrow {
    font-size: 0.75rem;
    color: #444;
}

/* Agent Description Card */
.agent-description-card {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(0, 0, 0, 0) 100%);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 0.75rem;
    padding: 1rem;
    animation: fadeIn 0.3s ease-out;
    margin-top: 1rem;
}

.agent-desc-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}


.agent-desc-info {
    text-align: left !important;
    flex: 1;
}

.agent-desc-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    text-align: left !important;
}

.agent-desc-info p {
    margin: 0;
    font-size: 0.75rem;
    color: #A1A1A1;
    line-height: 1.4;
    text-align: left !important;
}

/* Modal Premium Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85); /* Increased opacity instead of blur */
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.categorized-modal {
    width: 100%;
    max-width: 850px;
    background: #0D0D0D;
    border: 1px solid #22C55E33;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.modal-close-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 1.25rem;
    cursor: pointer;
    transition: color 0.2s;
}

.modal-close-btn:hover {
    color: #fff;
}

.agents-modal-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.agent-option-premium {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    background: #111;
    border: 1px solid #1C1C1C;
    border-radius: 1rem;
    gap: 0;
    cursor: pointer;
    transition: all 0.2s;
}

.agent-option-premium:hover {
    border-color: #22C55E66;
    background: #161616;
    transform: translateY(-2px);
}

.agent-option-premium.active {
    border-color: #22C55E;
    background: #0d1a10;
}

.agent-option-simple-row {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.strategy-icons-inline {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.deriv-svg-icon {
    width: 24px;
    height: 24px;
}

.deriv-svg-icon-small {
    width: 18px;
    height: 18px;
}


.agent-option-info {
    flex: 1;
    text-align: left;
}

.agent-option-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.agent-option-desc {
    font-size: 12px;
    color: #A1A1A1;
    margin: 0;
    line-height: 1.4;
}

.strategy-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; /* Reduced from 48px */
    height: 32px; /* Reduced from 48px */
    background-color: rgba(34, 197, 94, 0.15); /* zenix-green with opacity */
    border-radius: 8px; /* Slightly reduced radius */
    color: #FFFFFF;
    font-size: 1rem; /* Reduced from 1.5rem */
}

.agent-option-text-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
}

.agent-option-check {
    color: #333;
    font-size: 1.25rem;
    margin-left: 0.5rem;
}

.agent-option-premium.active .agent-option-check {
    color: #22C55E;
}

.agent-option-premium .strategy-icon-box {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (min-width: 769px) {
    .agents-modal-list {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        justify-content: flex-start !important;
        gap: 1.25rem !important;
    }
    
    .agent-option-premium {
        width: calc(50% - 0.7rem);
        flex-grow: 1;
        max-width: 48%; /* Ensure 2 per row mostly */
    }
}

/* Ajustes para mobile */
@media (max-width: 1024px) {
    .content-wrapper {
        margin-left: 0 !important;
        width: 100% !important;
    }
    
    .content-wrapper.sidebar-collapsed {
        margin-left: 0 !important;
        width: 100% !important;
    }
    
    /* Sidebar como drawer no mobile */
    :deep(.sidebar) {
        position: fixed;
        width: 280px !important;
        height: 100vh;
        z-index: 999;
        transform: translateX(-100%);
        transition: transform 0.3s ease-out;
    }
    
    /* Sidebar aberta no mobile - z-index alto para ficar acima de tudo */
    :deep(.sidebar.is-open) {
        transform: translateX(0);
        z-index: 99999999 !important;
    }
    
    /* Modal de Settings deve sobrepor tudo no mobile, incluindo TopNavbar */
    /* Forçar z-index muito alto para garantir que sobreponha o TopNavbar (z-index: 1002) */
    :deep(.settings-modal-overlay) {
        z-index: 100000 !important;
        top: 0 !important;
        height: 100vh !important;
        position: fixed !important;
    }
    
    :deep(.settings-modal-content) {
        z-index: 100000 !important;
        top: 0 !important;
        height: 100vh !important;
        position: fixed !important;
    }
    
    /* Garantir que TopNavbar fique abaixo do modal quando aberto */
    #top-navbar {
        z-index: 1002 !important;
    }
}

/* Header Mobile - Escondido no desktop */
#ai-vision-panel .ai-vision-header-mobile {
    display: none;
}

/* Estilos específicos para Visão da IA no Mobile */
@media (max-width: 768px) {
    /* Remove o fundo do container principal da Visão da IA */
    #ai-vision-panel .ai-vision-container {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
    }
    
    /* Esconde header desktop, mostra mobile */
    #ai-vision-panel .ai-vision-header-desktop {
        display: none !important;
    }
    
    #ai-vision-panel .ai-vision-header-mobile {
        display: block !important;
        margin-bottom: 0;
        background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(15, 32, 25, .3) 0, rgba(0, 1, 0, .1) 70%, transparent 100%);
        border-radius: .75rem;
        padding: 1rem 0 0;
    }
    
    #ai-vision-panel .ai-vision-header-mobile h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #DFDFDF;
        margin-bottom: 0.25rem;
    }
    
    #ai-vision-panel .ai-vision-header-mobile p {
        font-size: 0.875rem;
        color: #A1A1A1;
    }
    
    #ai-vision-panel .ai-chip-icon-mobile {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(34, 197, 94, 0.15);
        padding: 15px;
        border-radius: 50%;
        width: auto;
        height: auto;
    }
    
    /* Esconde a área de visualização AI completa no mobile */
    #ai-vision-panel .ai-visualization-area {
        display: none !important;
    }
    
    /* Ajusta o grid para ocupar toda a largura no mobile */
    #ai-vision-panel .grid {
        grid-template-columns: 1fr !important;
    }
    
    #ai-vision-panel .col-span-7 {
        grid-column: span 1 !important;
    }
    
    /* Modifica os cards de status para mobile */
    #ai-vision-panel .status-cards-container {
        display: none !important;
    }
    
    #ai-vision-panel .status-card-mobile {
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        background-color: transparent !important;
        border: 1px solid rgba(28, 28, 28, 0.8) !important;
        border-radius: 0.75rem;
        padding: 1rem;
        text-align: left !important;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    
    /* Remove textos descritivos (status-description) no mobile */
    #ai-vision-panel .status-description {
        display: none !important;
    }
    
    /* Alinha labels e valores à esquerda */
    #ai-vision-panel .status-label {
        text-align: left !important;
        margin: 0 !important;
        color: #FFFFFF !important;
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    #ai-vision-panel .status-value {
        text-align: left !important;
        color: #FFFFFF !important;
        font-weight: 700;
        font-size: 1rem;
        margin-top: 0.5rem;
        margin-bottom: 0;
    }
    
    /* Ajusta os ícones nos cards */
    #ai-vision-panel .status-card-mobile .flex.items-center {
        justify-content: flex-start !important;
        margin-bottom: 0.5rem;
        align-items: center;
    }
    
    #ai-vision-panel .status-card-mobile .flex.items-center i {
        color: #22C55E !important;
        font-size: 1.125rem;
    }
    
    #ai-vision-panel .status-card-mobile .asset-icon {
        opacity: 1 !important;
        width: 18px !important;
        height: 18px !important;
        filter: brightness(0) saturate(100%) invert(67%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(96%) contrast(88%);
    }
    
    /* Esconde o Central AI Core no mobile */
    #ai-vision-panel .ai-core-mobile {
        display: none !important;
    }
    
    /* Remove gap do grid no mobile */
    #ai-vision-panel .grid.gap-5 {
        gap: 0 !important;
    }
    
    /* Remove h3 (card-title) no mobile */
    .config-card .card-title,
    .config-card h3 {
        display: none !important;
    }
    
    /* Remove ai-status-title no mobile */
    .ai-status-title {
        display: none !important;
    }

    /* 1. Gerenciamento de Risco: 3 colunas */
    .risk-buttons {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 0.5rem !important;
        width: 100% !important;
    }

    /* 2. Stop Loss e Blindado: Lado a lado com mesma altura */
    .loss-stoploss-row {
        flex-direction: row !important;
        gap: 12px !important;
        align-items: stretch !important;
    }

    .loss-stoploss-row .flex-1 {
        width: 50% !important;
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
    }
    
    .loss-stoploss-row .form-input {
        height: 100% !important;
        min-height: 48px !important;
    }
    
    /* Label styling: 0.725rem, uppercase, #C5C5C5 */
    .form-label {
        font-size: 0.725rem !important;
        font-weight: 80 !important;
        text-transform: uppercase !important;
        color: #C5C5C5 !important;
    }

    .stoploss-blindado-wrapper {
        background-color: #000000 !important;
        padding: 0rem 0.5rem !important;
        height: auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        min-height: 48px !important;
    }

    .ai-status-info label{
        margin: 0 !important;
        font-size: 0.9rem !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        color: #C5C5C5 !important;
    }
}
</style>