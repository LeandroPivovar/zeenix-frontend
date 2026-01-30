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
                                    <h3 class="modal-title" style="font-size: 1.6rem;">Selecionar Estratégia</h3>
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
                                            <div class="agent-option-content">
                                                <div class="agent-option-header-row">
                                                    <div class="strategy-icon-box-large" :class="strategy.id">
                                                        <img v-if="strategy.icons && strategy.icons.length > 0" :src="strategy.icons[0]" class="deriv-svg-icon" alt="strategy icon" />
                                                        <i v-else :class="strategy.icon"></i>
                                                        <i v-if="strategy.id === 'nexus'" class="fas fa-shield-alt mini-shield"></i>
                                                    </div>
                                                    <div class="agent-option-main-info">
                                                        <h4 class="agent-option-title">{{ strategy.title }}</h4>
                                                        <p class="agent-option-desc">{{ strategy.description }}</p>
                                                    </div>
                                                    <div class="agent-option-arrow">
                                                        <i class="fas fa-chevron-right"></i>
                                                    </div>
                                                </div>
                                                <div class="agent-option-footer-stats">
                                                    <div class="stat-item">
                                                        <span class="stat-label">Assertividade:</span>
                                                        <span class="stat-value">{{ strategy.assertividade }}</span>
                                                    </div>
                                                    <div class="stat-divider"></div>
                                                    <div class="stat-item">
                                                        <span class="stat-label">Retorno:</span>
                                                        <span class="stat-value highlight">{{ strategy.retorno }}</span>
                                                    </div>
                                                </div>
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
import StrategyAnalysis from '@/utils/StrategyAnalysis';
import strategiesPresets from '@/utils/strategies_presets.json';

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
                { 
                    id: 'atlas', 
                    title: 'IA Atlas', 
                    marketType: 'Digits', 
                    icon: 'fas fa-shield-alt', 
                    icons: [], 
                    description: 'Híbrida (Fluxo de Dígitos + Price Action → Tendência)',
                    assertividade: '92 a 96%',
                    retorno: '95% / 99%'
                },
                { 
                    id: 'apollo', 
                    title: 'IA Apollo', 
                    marketType: 'Ups e Downs', 
                    icon: 'fas fa-rocket', 
                    icons: [],
                    description: 'Price Action Puro (Inércia + Força + Tendência)',
                    assertividade: '90% a 95%',
                    retorno: '99%'
                },
                { 
                    id: 'nexus', 
                    title: 'IA Nexus', 
                    marketType: 'Ups e Downs', 
                    icon: 'fas fa-chart-bar',
                    icons: [],
                    description: 'Price Action Barreira de Segurança com Troca de Contrato',
                    assertividade: '91% a 95%',
                    retorno: '91% / 95%'
                },
                { 
                    id: 'orion', 
                    title: 'IA Orion', 
                    marketType: 'Digits', 
                    icon: 'fas fa-star', 
                    icons: [],
                    description: 'Estatística de Dígitos + (Over 2) com Price Action na Recuperação',
                    assertividade: '94% a 97%',
                    retorno: '95% / 99%'
                },
                { 
                    id: 'titan', 
                    title: 'IA Titan', 
                    marketType: 'Digits', 
                    icon: 'fas fa-yin-yang', 
                    icons: [],
                    description: 'Dígitos Par/Ímpar com persistência direcional',
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
            isDeactivating: false
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
                // ✅ Validação de Estratégia
                if (!this.selectedStrategy) {
                    console.warn('[InvestmentIAView] ⚠️ Nenhuma estratégia selecionada. Exibindo modal.');
                    this.showStrategyRequiredModal = true;
                    return;
                }

                console.log('[InvestmentIAView] ===== ATIVANDO IA (FRONTEND MODE) =====');
                
                // Validação de saldo mínimo
                const currentBalance = this.balanceNumeric || 0;
                const requiredBalance = this.entryValue;

                if (currentBalance < requiredBalance) {
                    console.warn('[InvestmentIAView] ⚠️ Saldo insuficiente para iniciar:', currentBalance, '<', requiredBalance);
                    this.showInsufficientBalanceModal = true;
                    this.isActivating = false;
                    return;
                }

                // Carregar Configuração da Estratégia do Preset
                const strategyPreset = strategiesPresets.find(s => s.id === this.selectedStrategy);
                if (!strategyPreset) {
                    this.$root.$toast.error('Configuração da estratégia não encontrada!');
                    return;
                }

                // ✅ Resetar Dados da Sessão (Zerado)
                this.dailyStats = {
                    profitLoss: 0,
                    profitLossPercent: 0,
                    totalTrades: 0,
                    winrate: 0,
                    wins: 0,
                    losses: 0
                };
                this.realtimeLogs = [];
                this.logOperations = [];

                // Configurar filtros ativos baseados no preset
                this.activeFilters = JSON.parse(JSON.stringify(strategyPreset.config.form.attackFilters));
                this.isRecoveryActive = false;
                this.consecutiveLosses = 0;

                // Iniciar Conexão WebSocket Local
                this.isInvestmentActive = true;
                this.isMonitoring = true;
                this.initTickConnection();
                
                this.addLog(`🚀 IA ${strategyPreset.name} Iniciada com sucesso!`, 'success');
                this.$root.$toast.success('IA iniciada com sucesso (Frontend Mode)!');

            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao ativar IA:', error);
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

            // Atualizar histórico de ticks
            this.tickHistory.push({
                time: tick.epoch,
                value: price
            });
            if (this.tickHistory.length > 500) this.tickHistory.shift();
            
            this.ticks = [...this.tickHistory];

            // Atualizar histórico de dígitos
            const digit = parseInt(price.toString().slice(-1));
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

            let allPassed = true;
            for (const filter of this.activeFilters) {
                if (!filter.active) continue;
                
                const result = StrategyAnalysis.evaluate(filter, data);
                if (!result.pass) {
                    allPassed = false;
                    break;
                }
            }

            if (allPassed && this.activeFilters.length > 0) {
                this.addLog(`🎯 Sinal detectado (${strategy})! Executando trade...`, 'success');
                this.executeRealTrade();
            }
        },

        async executeRealTrade() {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            const strategyPreset = strategiesPresets.find(s => s.id === this.selectedStrategy);
            const tradeConfig = this.isRecoveryActive ? strategyPreset.config.recoveryConfig : strategyPreset.config.form;

            const buyRequest = {
                buy: '1',
                price: Number(this.entryValue),
                parameters: {
                    amount: Number(this.entryValue),
                    basis: 'stake',
                    contract_type: tradeConfig.tradeType,
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

            if (this.realtimeLogs.length > 50) this.realtimeLogs.pop();
        },

        getMarketSymbol(market) {
            const map = {
                vol10: 'R_10', vol25: 'R_25', vol50: 'R_50', vol75: 'R_75', vol100: 'R_100',
                vol10_1s: '1HZ10V', vol25_1s: '1HZ25V', vol50_1s: '1HZ50V', vol75_1s: '1HZ75V', vol100_1s: '1HZ100V'
            };
            return map[market] || 'R_100';
        },
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

        // ✅ Garantir que inicie zerado (Logs e Histórico) conforme solicitado
        // Exceto se a sincronização via checkAIStatus já tiver trazido algo que queremos manter, 
        // mas a instrução "traga zerado" sugere uma limpeza.
        this.realtimeLogs = [];
        this.logOperations = [];
        this.dailyStats = {
            profitLoss: 0,
            profitLossPercent: 0,
            totalTrades: 0,
            winrate: 0,
            wins: 0,
            losses: 0
        };
        
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


<style scoped src="@/assets/css/investment-ia.css"></style>
