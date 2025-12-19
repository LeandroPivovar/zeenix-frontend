<template>
    <div class="zenix-layout">
        <!-- Overlay para fechar sidebar ao clicar fora (mobile) -->
        <div 
            v-if="isSidebarOpen" 
            class="sidebar-overlay" 
            @click="closeSidebar"
        ></div>
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @toggle-collapse="toggleSidebarCollapse"
            @close-sidebar="closeSidebar"
        />

        <div class="content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                :balance="currentBalance?.balance || info?.balance"
                :account-type="accountType"
                :balances-by-currency-real="balancesByCurrencyReal"
                :balances-by-currency-demo="balancesByCurrencyDemo"
                :currency-prefix="preferredCurrencyPrefix"
                @open-settings="toggleSettingsModal"
                @account-type-changed="switchAccount"
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
                @close="closeSettingsModal"
                @account-type-changed="switchAccount"
            />

            <main class="main-content" style="margin-top: 60px;">
                <!-- AI Vision Panel - Only show when IA is inactive -->
                <section id="ai-vision-panel" class="fade-in" style="margin-bottom: 1.5rem;" v-if="!isInvestmentActive">
                    <div class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card glow-green ai-vision-container">
                        <!-- Header Desktop -->
                        <div class="mb-6 ai-vision-header-desktop">
                            <div class="text-left">
                                <h1 class="text-xl font-bold text-zenix-text mb-1">Visão da IA | {{ selectedStrategyName }}</h1>
                                <p class="text-sm text-zenix-secondary">Configure esta IA para iniciar operações</p>
                            </div>
                        </div>
                        <!-- Header Mobile -->
                        <div class="mb-6 ai-vision-header-mobile">
                            <div class="flex items-center justify-between">
                                <div class="text-left">
                                    <h1 class="text-xl font-bold text-zenix-text mb-1">Visão da IA</h1>
                                    <p class="text-sm text-zenix-secondary">Configure esta IA para iniciar operações</p>
                                </div>
                                <div class="ai-chip-icon-mobile">
                                    <i class="fas fa-microchip text-[#22C55E] text-2xl"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-5">
                            <!-- AI Visualization Area -->
                            <div class="col-span-5 h-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-zenix-green/10 to-transparent border-2 border-zenix-green/30 flex items-center justify-center relative ai-visualization-area">
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
                                    <!-- Central Brain Icon -->
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
                            <div class="col-span-7 grid grid-cols-2 gap-4 status-cards-container">
                                <!-- Card 1: STATUS -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i class="fas fa-check-circle text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-semibold status-label">STATUS</p>
                                    </div>
                                    <p class="text-base font-bold text-white status-value">Configurando</p>
                                    <p class="text-[10px] text-zenix-label mt-1 status-description">Configure para ativar esta IA</p>
                                </div>
                                <!-- Card 2: ALVO DA IA -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
                                    <div class="flex items-center gap-2 mb-2">
                                        <img src="@/assets/icons/target-IA.svg" alt="Alvo da IA" class="asset-icon" style="width: 18px !important; height: 18px !important; display: block !important;">
                                        <p class="text-[10px] text-white uppercase font-semibold status-label">ALVO DA IA</p>
                                    </div>
                                    <p class="text-base font-bold text-white status-value">Não definido</p>
                                    <p class="text-[10px] text-zenix-label mt-1 status-description">Defina os parâmetros para revelar</p>
                                </div>
                                <!-- Card 3: PARÂMETROS -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i class="fas fa-eye text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-semibold status-label">PARÂMETROS</p>
                                    </div>
                                    <p class="text-base font-bold text-white status-value">Não definido</p>
                                    <p class="text-[10px] text-zenix-label mt-1 status-description">Configure risco e entradas</p>
                                </div>
                                <!-- Card 4: EXECUÇÃO -->
                                <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i class="fas fa-bolt text-[#22C55E] text-lg"></i>
                                        <p class="text-[10px] text-white uppercase font-semibold status-label">EXECUÇÃO</p>
                                    </div>
                                    <p class="text-base font-bold text-white status-value">Automática</p>
                                    <p class="text-[10px] text-zenix-label mt-1 status-description">Ativada após configuração</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Configuration Cards Grid - Only show when IA is inactive -->
                <div class="config-grid" v-if="!isInvestmentActive">
                    <!-- Mercado & Estratégia -->
                    <div id="market-strategy-card" class="config-card premium-card">
                        <h3 class="card-title">
                            Mercado & Estratégia
                            <TooltipsCopyTraders position="left"> 
                                <h4>🎯 Mercado & Estratégia</h4>
                            </TooltipsCopyTraders>
                        </h3>
                        <div class="card-content">
                            <div class="form-group">
                                <label class="form-label">
                                    Selecione o mercado
                                    <TooltipsCopyTraders position="left"> 
                                        <p>Escolha o ativo que deseja operar</p>
                                    </TooltipsCopyTraders>
                                </label>
                                <select id="marketSelect" class="form-select" v-model="selectedMarket">
                                    <option value="vol10">Volatility 10 Index</option>
                                    <option value="vol25">Volatility 25 Index</option>
                                    <option value="vol50">Volatility 50 Index</option>
                                    <option value="vol75">Volatility 75 Index</option>
                                    <option value="vol100">Volatility 100 Index</option>
                                    <option value="vol10_1s">Volatility 10 (1s) Index</option>
                                    <option value="vol25_1s">Volatility 25 (1s) Index</option>
                                    <option value="vol50_1s">Volatility 50 (1s) Index</option>
                                    <option value="vol75_1s">Volatility 75 (1s) Index</option>
                                    <option value="vol100_1s">Volatility 100 (1s) Index</option>
                                    <option value="jump10">Jump 10 Index</option>
                                    <option value="jump25">Jump 25 Index</option>
                                    <option value="jump50">Jump 50 Index</option>
                                    <option value="jump75">Jump 75 Index</option>
                                    <option value="jump100">Jump 100 Index</option>
                                </select>
                                <p id="marketDescription" class="form-help">{{ marketDescription }}</p>
                        </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    Estratégia
                                    <TooltipsCopyTraders position="left"> 
                                        <p>Modelo de análise usado pela IA</p>
                                    </TooltipsCopyTraders>
                                </label>
                                <select id="strategySelect" class="form-select" v-model="selectedStrategy">
                                    <option value="orion">IA Orion</option>
                                    <option value="trinity">IA Trinity</option>
                                </select>
                                <p id="strategyDescription" class="form-help">Análise técnica avançada com machine learning</p>
                    </div>

                            <div class="form-group">
                                <label class="form-label">Modo de Negociação</label>
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
                                        Moderado
                                    </button>
                                    <button 
                                        id="modeLento" 
                                        :class="['mode-btn', { 'active': mode === 'lento' }]"
                                        @click="mode = 'lento'"
                                    >
                                        Lento
                                    </button>
                                </div>
                                <p id="modeDescription" class="form-help">{{ modeDescription }}</p>
                            </div>
                            
                            <!-- Gerenciamento de Risco - Mobile Only -->
                            <div class="form-group risk-management-mobile">
                                <label class="form-label">Gerenciamento de Risco</label>
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
                                        <span id="riskLevelTextMobile" class="risk-level-text">{{ riskLevelText }}</span>
                                    </div>
                                    <div class="risk-bar-container">
                                        <div id="riskBarMobile" class="risk-bar" :style="{ width: riskBarWidth }"></div>
                                    </div>
                                    <p id="riskDescriptionMobile" class="risk-description">{{ riskDescriptionText }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Parâmetros de Entrada -->
                    <div id="entry-params-card" class="config-card premium-card">
                        <h3 class="card-title">Parâmetros de Entrada</h3>
                        <div class="card-content">
                            <div class="form-group">
                                <label class="form-label">Valor de Entrada (USD)</label>
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
                                <label class="form-label">Alvo de Lucro (USD)</label>
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

                            <div class="form-group">
                                <label class="form-label">Limite de Perda (USD)</label>
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
                    </div>
                </div>

                    <!-- Gerenciamento de Risco -->
                    <div id="risk-management-card" class="config-card premium-card">
                        <h3 class="card-title">Gerenciamento de Risco</h3>
                        <div class="card-content">
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

                    <!-- Controle da IA -->
                    <div id="ai-control-card" class="config-card premium-card ai-control-card">
                        <div class="ai-control-bg">
                            <div class="animated-grid-ai"></div>
                            <div class="particles-ai">
                                <div class="particle-ai particle-ai-1"></div>
                                <div class="particle-ai particle-ai-2"></div>
                                <div class="particle-ai particle-ai-3"></div>
                                <div class="particle-ai particle-ai-4"></div>
                            </div>
                            <div class="data-streams-ai">
                                <div class="stream-ai stream-ai-1"></div>
                                <div class="stream-ai stream-ai-2"></div>
                                <div class="stream-ai stream-ai-3"></div>
                            </div>
                        </div>
                        
                        <div class="ai-control-content">
                            <div class="ai-status-control">
                                <div>
                                    <p class="ai-status-title">Status da IA</p>
                                    <p class="ai-status-subtitle">{{ isInvestmentActive ? 'Controle de execução automática' : 'Ative para iniciar operações' }}</p>
                                </div>
                                <div class="ai-status-toggle-wrapper">
                                    <span id="aiStatusText" class="ai-status-text" :class="{ 'active': isInvestmentActive }">
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
                            <div class="ai-status-message" v-if="!isInvestmentActive">
                                <p class="ai-message-text">
                                    A IA está <span class="ai-status-inactive">desativada</span>. Ative para começar.
                                </p>
                            </div>
                            <div class="ai-status-note" v-if="isInvestmentActive">
                                <p class="ai-note-text">Desativação manual pelo usuário</p>
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
                    :account-balance-prop="accountBalance"
                    :account-currency-prop="tradeCurrency || accountCurrency"
                    :selected-market-prop="selectedMarket"
                        @deactivate="deactivateIA"
                />
                </section>

        </main>

        </div>
    </div>
    <DesktopBottomNav />
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import SettingsSidebar from '../components/SettingsSidebar.vue';
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';
import TooltipsCopyTraders from '../components/TooltipsCopyTraders.vue';
import DesktopBottomNav from '../components/DesktopBottomNav.vue';
import { loadAvailableAccounts } from '../utils/accountsLoader';
import accountBalanceMixin from '../mixins/accountBalanceMixin';

export default {
    name: 'InvestmentIAView',
    mixins: [accountBalanceMixin],
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        InvestmentActive,
        TooltipsCopyTraders,
        DesktopBottomNav
    },
    data() {
        return {
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            isMobile: false,
            isInvestmentActive: false,
            isActivating: false,
            showSettingsModal: false, 

            ticks: [],
            currentPrice: null,
            pollingInterval: null,

            entryValue: 0.35,
            profitTarget: 100,
            lossLimit: 25,
            mode: 'veloz',
            modoMartingale: 'conservador',

            selectedMarket: 'vol10',
            selectedStrategy: 'orion',
            
            accountBalance: 0,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            tradeCurrency: 'USD', // Usar tradeCurrency como no Dashboard
            balanceVisible: true,
            lastBalanceUpdate: null,
            balanceUpdateInterval: null,
            clockInterval: null,
            
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
        // Objeto de saldo no formato esperado pelo TopNavbar (igual ao Dashboard)
        balanceObject() {
            return {
                value: this.accountBalance || 0,
                currency: this.accountCurrency || 'USD'
            };
        },
        
        // Saldos por moeda - Real (igual ao Dashboard)
        balancesByCurrencyReal() {
            if (this.isDemo) {
                return {};
            }
            const balance = this.accountBalance || 0;
            const currency = this.accountCurrency || 'USD';
            return {
                [currency]: balance
            };
        },
        
        // Saldos por moeda - Demo (igual ao Dashboard)
        balancesByCurrencyDemo() {
            if (!this.isDemo) {
                return {};
            }
            const balance = this.accountBalance || 0;
            const currency = this.accountCurrency || 'USD';
            return {
                [currency]: balance
            };
        },
        
        // Prefixo da moeda (igual ao Dashboard)
        currencyPrefix() {
            return this.getCurrencyPrefix(this.accountCurrency || 'USD');
        },
        
        formattedBalance() {
            if (!this.balanceVisible) {
                return '••••••';
            }
            // Sempre formatar o saldo, mesmo se for 0
            const balance = this.accountBalance || 0;
            return `$${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
        
        selectedStrategyName() {
            const strategyNames = {
                'orion': 'Orion',
                'trinity': 'Trinity'
            };
            return strategyNames[this.selectedStrategy] || 'Orion';
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
                return `+${this.accountCurrency} ${value.toFixed(2)}`;
            } else {
                return `-${this.accountCurrency} ${Math.abs(value).toFixed(2)}`;
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
        
        entryPercent() {
            if (!this.accountBalance || this.accountBalance <= 0) return '0.00';
            return ((this.entryValue / this.accountBalance) * 100).toFixed(2);
        },
        
        profitPercent() {
            if (!this.accountBalance || this.accountBalance <= 0) return '0.00';
            return ((this.profitTarget / this.accountBalance) * 100).toFixed(2);
        },
        
        lossPercent() {
            if (!this.accountBalance || this.accountBalance <= 0) return '0.00';
            return ((this.lossLimit / this.accountBalance) * 100).toFixed(2);
        },
        
        riskLevelText() {
            const labels = {
                'fixo': 'Fixo',
                'conservador': 'Baixo',
                'moderado': 'Médio',
                'agressivo': 'Alto'
            };
            return labels[this.modoMartingale] || 'Baixo';
        },
        
        riskBarWidth() {
            const widths = {
                'fixo': '15%',
                'conservador': '25%',
                'moderado': '50%',
                'agressivo': '75%'
            };
            return widths[this.modoMartingale] || '25%';
        },
        
        riskDescriptionText() {
            const descriptions = {
                'fixo': 'Valor de entrada fixo sem variação',
                'conservador': 'Proteção máxima do capital com crescimento estável',
                'moderado': 'Equilíbrio entre proteção e crescimento',
                'agressivo': 'Maior exposição para potencial de retorno elevado'
            };
            return descriptions[this.modoMartingale] || descriptions.conservador;
        }
    },
    methods: {
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

                const preferredCurrency = this.getPreferredCurrency();
                
                console.log('[InvestmentIAView] 💰 Verificando saldo da conta...');
                try {
                    const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                    const balanceResponse = await fetch(`${apiBase}/ai/deriv-balance`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ derivToken: derivToken }),
                    });
                    
                    const balanceResult = await balanceResponse.json();
                    if (balanceResult.success && balanceResult.data) {
                        const balance = balanceResult.data.balance;
                        const currency = balanceResult.data.currency;
                        const loginid = balanceResult.data.loginid;
                        
                        console.log('[InvestmentIAView] 💰 Saldo:', balance, currency);
                        console.log('[InvestmentIAView] 🔑 LoginID:', loginid);
                        
                        if (balance < this.entryValue) {
                            console.warn('[InvestmentIAView] ⚠️ Saldo insuficiente:', balance, 'necessário:', this.entryValue);
                        }
                    }
                } catch (balanceError) {
                    console.warn('[InvestmentIAView] ⚠️ Não foi possível verificar saldo:', balanceError);
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/activate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        stakeAmount: this.entryValue,
                        derivToken: derivToken,
                        currency: preferredCurrency,
                        mode: this.mode.toLowerCase(),
                        profitTarget: this.profitTarget,
                        lossLimit: this.lossLimit,
                        modoMartingale: this.modoMartingale || 'conservador',
                        strategy: this.selectedStrategy || 'orion',
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

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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
            console.log('[InvestmentIAView] Buscando token Deriv...');

            let accountLoginid = null;
            let preferredCurrency = null;

            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    accountLoginid = connection.loginid;
                    preferredCurrency = connection.tradeCurrency;
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao parsear deriv_connection:', error);
            }

            const isDemoPreferred = preferredCurrency?.toUpperCase() === 'DEMO';
            if (isDemoPreferred) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);

                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
                            console.log('[InvestmentIAView] ✓ Token demo encontrado');
                            return token;
                        }
                    }
                } catch (error) {
                    console.error('[InvestmentIAView] Erro ao buscar token demo:', error);
                }
            }

            if (accountLoginid) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);

                    const specificToken = tokensByLoginId[accountLoginid];
                    if (specificToken) {
                        console.log('[InvestmentIAView] ✓ Token específico encontrado');
                        return specificToken;
                    }
                } catch (error) {
                    console.error('[InvestmentIAView] Erro ao buscar token específico:', error);
                }
            }

            const defaultToken = localStorage.getItem('deriv_token');
            if (!defaultToken) {
                console.error('[InvestmentIAView] ERRO: Nenhum token encontrado!');
            }

            return defaultToken;
        },

        getPreferredCurrency() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    if (connection.tradeCurrency) {
                        const currency = connection.tradeCurrency.toUpperCase();
                        console.log('[InvestmentIAView] Moeda preferida:', currency);
                        return currency;
                    }
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao parsear deriv_connection:', error);
            }

            return 'USD';
        },

        async fetchAccountBalance() {
            try {
                // PRIMEIRO: Verificar qual tipo de conta está ativa (demo ou real)
                let preferredIsDemo = false;
                try {
                    const connectionStr = localStorage.getItem('deriv_connection');
                    if (connectionStr) {
                        const connection = JSON.parse(connectionStr);
                        if (connection.isDemo !== undefined) {
                            preferredIsDemo = connection.isDemo === true || connection.isDemo === 1;
                        }
                    }
                } catch (error) {
                    console.warn('[InvestmentIAView] Erro ao verificar deriv_connection:', error);
                }
                
                // PRIMEIRO: Tentar buscar do cache (como no Dashboard)
                try {
                    const cachedAccounts = await loadAvailableAccounts();
                    if (cachedAccounts && cachedAccounts.length > 0) {
                        // Buscar a conta que corresponde ao tipo preferido (demo ou real)
                        let activeAccount = cachedAccounts.find(acc => acc.isDemo === preferredIsDemo);
                        
                        // Se não encontrou, tentar o tipo oposto
                        if (!activeAccount) {
                            activeAccount = cachedAccounts.find(acc => acc.isDemo !== preferredIsDemo);
                        }
                        
                        // Se ainda não encontrou, usar a primeira disponível
                        if (!activeAccount) {
                            activeAccount = cachedAccounts[0];
                        }
                        
                        if (activeAccount && activeAccount.balance !== null && activeAccount.balance !== undefined) {
                            const cachedBalance = parseFloat(activeAccount.balance) || 0;
                            // Só atualizar se o saldo do cache for válido (> 0) ou se não temos saldo ainda
                            if (cachedBalance > 0 || this.accountBalance === 0 || this.accountBalance === null || this.accountBalance === undefined) {
                                this.accountBalance = cachedBalance;
                                this.accountCurrency = activeAccount.currency || 'USD';
                                this.accountLoginid = activeAccount.loginid;
                                this.isDemo = activeAccount.isDemo || false;
                                this.lastBalanceUpdate = new Date();
                                
                                console.log('[InvestmentIAView] ✅ Saldo carregado do cache:', {
                                    balance: this.accountBalance,
                                    currency: this.accountCurrency,
                                    loginid: this.accountLoginid,
                                    isDemo: this.isDemo,
                                    preferredIsDemo: preferredIsDemo,
                                    cachedBalance: cachedBalance
                                });
                            } else {
                                console.log('[InvestmentIAView] ⚠️ Mantendo saldo atual, cache tem valor inválido:', cachedBalance);
                            }
                            
                            // Continuar para atualizar com dados mais recentes em background
                        }
                    }
                } catch (cacheError) {
                    console.warn('[InvestmentIAView] Erro ao buscar do cache:', cacheError);
                }
                
                // SEGUNDO: Buscar da API para atualizar com dados mais recentes
                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.warn('[InvestmentIAView] ❌ Token não disponível para buscar saldo');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/deriv-balance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ derivToken: derivToken }),
                });

                const result = await response.json();
                if (result.success && result.data) {
                    // Extrair saldo - pode vir como número, string ou objeto com value
                    let newBalance = result.data.balance;
                    if (typeof newBalance === 'object' && newBalance !== null) {
                        newBalance = newBalance.value || newBalance.balance || 0;
                    }
                    // Converter para número
                    newBalance = parseFloat(newBalance) || 0;
                    
                    const newCurrency = result.data.currency;
                    const newLoginid = result.data.loginid;
                    
                    // Verificar isDemo de múltiplas fontes para garantir precisão
                    let isDemoFromLoginid = newLoginid?.startsWith('VRTC') || newLoginid?.startsWith('VRT');
                    
                    // Verificar também no localStorage deriv_connection
                    try {
                        const connectionStr = localStorage.getItem('deriv_connection');
                        if (connectionStr) {
                            const connection = JSON.parse(connectionStr);
                            if (connection.isDemo !== undefined) {
                                isDemoFromLoginid = connection.isDemo === true || connection.isDemo === 1;
                            }
                        }
                    } catch (error) {
                        console.warn('[InvestmentIAView] Erro ao verificar deriv_connection:', error);
                    }
                    
                    console.log('[InvestmentIAView] 🔍 Verificando atualização de saldo:', {
                        newBalance,
                        newLoginid,
                        isDemoFromLoginid,
                        currentBalance: this.accountBalance,
                        currentIsDemo: this.isDemo,
                        accountTypeMatches: isDemoFromLoginid === this.isDemo,
                        balanceType: typeof newBalance
                    });
                    
                    // Sempre atualizar o saldo se o valor recebido for válido (>= 0 e é um número)
                    // Mas só atualizar se:
                    // 1. O novo saldo é válido (> 0) OU
                    // 2. O novo saldo é 0 mas não temos saldo válido ainda OU
                    // 3. O novo saldo é >= 0 e não temos saldo válido ainda
                    const hasValidBalance = this.accountBalance !== null && this.accountBalance !== undefined && this.accountBalance > 0;
                    
                    if (!isNaN(newBalance) && newBalance >= 0) {
                        // Se temos um saldo válido do cache e o novo saldo é 0, não atualizar (manter o cache)
                        if (hasValidBalance && newBalance === 0) {
                            console.log('[InvestmentIAView] ⚠️ Mantendo saldo do cache, novo saldo é 0:', {
                                cachedBalance: this.accountBalance,
                                newBalance: newBalance
                            });
                        } else {
                            // Atualizar o saldo
                            this.accountBalance = newBalance;
                            console.log('[InvestmentIAView] ✅ Saldo atualizado para:', newBalance);
                        }
                    } else {
                        console.warn('[InvestmentIAView] ⚠️ Saldo inválido recebido:', newBalance);
                        // Se o saldo recebido for inválido, manter o saldo atual do cache (não resetar para 0)
                        if (!hasValidBalance) {
                            // Só resetar para 0 se realmente não tivermos saldo válido
                            this.accountBalance = 0;
                        }
                    }
                    
                    // Sempre atualizar currency e loginid se disponíveis
                    if (newCurrency) {
                        this.accountCurrency = newCurrency;
                    }
                    if (newLoginid) {
                        this.accountLoginid = newLoginid;
                    }
                    
                    // Atualizar isDemo baseado no loginid retornado
                    this.isDemo = isDemoFromLoginid;
                    this.lastBalanceUpdate = new Date();
                    
                    console.log('[InvestmentIAView] ✅ Saldo atualizado da API:', {
                        balance: this.accountBalance,
                        currency: this.accountCurrency,
                        loginid: this.accountLoginid,
                        isDemo: this.isDemo,
                        newBalanceReceived: newBalance,
                        finalBalance: this.accountBalance
                    });
                } else {
                    console.error('[InvestmentIAView] ❌ Erro ao buscar saldo:', result.message || 'Unknown error');
                    // Se houver erro mas já temos um saldo do cache, manter o saldo atual (não resetar)
                    if (this.accountBalance === null || this.accountBalance === undefined) {
                        this.accountBalance = 0;
                    }
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar saldo da conta:', error);
                // Se houver erro mas já temos um saldo do cache, manter o saldo atual
                if (this.accountBalance === null || this.accountBalance === undefined) {
                    this.accountBalance = 0;
                }
            }
        },

        startBalanceUpdates() {
            this.fetchAccountBalance();
            this.balanceUpdateInterval = setInterval(() => {
                this.fetchAccountBalance();
            }, 30000);
        },

        stopBalanceUpdates() {
            if (this.balanceUpdateInterval) {
                clearInterval(this.balanceUpdateInterval);
                this.balanceUpdateInterval = null;
            }
        },

        startClock() {
            this.clockInterval = setInterval(() => {
                this.lastBalanceUpdate = new Date();
            }, 1000);
        },

        stopClock() {
            if (this.clockInterval) {
                clearInterval(this.clockInterval);
                this.clockInterval = null;
            }
        },
        
        async fetchDailyStats() {
            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentIAView] ❌ UserId não disponível para buscar stats');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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
        
        async loadTradeCurrency() {
            // Carrega o tradeCurrency do settings (igual ao Dashboard)
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const token = localStorage.getItem('token');
                
                const response = await fetch(`${apiBase}/settings`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.tradeCurrency = data.tradeCurrency || 'USD';
                    // Atualizar isDemo baseado no tradeCurrency (igual ao Dashboard)
                    this.isDemo = this.tradeCurrency === 'DEMO';
                    console.log('[InvestmentIAView] TradeCurrency carregado:', {
                        tradeCurrency: this.tradeCurrency,
                        isDemo: this.isDemo
                    });
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao carregar tradeCurrency:', error);
                // Fallback: tentar pegar do deriv_connection
                try {
                    const connectionStr = localStorage.getItem('deriv_connection');
                    if (connectionStr) {
                        const connection = JSON.parse(connectionStr);
                        if (connection.tradeCurrency) {
                            this.tradeCurrency = connection.tradeCurrency;
                            this.isDemo = this.tradeCurrency === 'DEMO';
                        } else {
                            // Se não tiver tradeCurrency, usar isDemo do connection
                            const loginid = connection.loginid || '';
                            this.isDemo = connection.isDemo === true || connection.isDemo === 1 || 
                                         loginid.startsWith('VRTC') || loginid.startsWith('VRT');
                            this.tradeCurrency = this.isDemo ? 'DEMO' : 'USD';
                        }
                    }
                } catch (e) {
                    console.warn('[InvestmentIAView] Erro ao verificar deriv_connection:', e);
                }
            }
        },
        
        async updateTradeCurrency(type) {
            // Atualiza o tradeCurrency no settings (igual ao Dashboard)
            try {
                const tradeCurrency = type === 'demo' ? 'DEMO' : 'USD';
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const token = localStorage.getItem('token');
                
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
                    // Atualizar tradeCurrency local imediatamente
                    this.tradeCurrency = tradeCurrency;
                    this.isDemo = type === 'demo';
                    console.log('[InvestmentIAView] TradeCurrency atualizado:', {
                        tradeCurrency: this.tradeCurrency,
                        isDemo: this.isDemo
                    });
                } else {
                    throw new Error('Erro ao alterar moeda');
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao atualizar tradeCurrency:', error);
            }
        },
        
        toggleAccountType(type) {
            // Atualizar tradeCurrency no settings quando trocar de conta
            this.updateTradeCurrency(type);
        },
        
        handleAccountTypeChangeFromNavbar(newAccountType) {
            // Alterna entre demo e real quando chamado do navbar
            // Atualiza tradeCurrency no settings (igual ao Dashboard)
            this.updateTradeCurrency(newAccountType);
        },
        
        handleAccountChange(event) {
            console.log('[InvestmentIAView] Conta alterada, atualizando saldo...', event.detail);
            
            // Atualizar isDemo e tradeCurrency baseado na nova conta
            const account = event.detail?.account;
            if (account) {
                const isDemoAccount = account.isDemo === true || account.loginid?.startsWith('VRTC') || account.loginid?.startsWith('VRT');
                this.isDemo = isDemoAccount;
                this.tradeCurrency = isDemoAccount ? 'DEMO' : 'USD';
                
                // Se temos dados da conta no evento, atualizar saldo imediatamente do cache
                if (account.balance !== null && account.balance !== undefined) {
                    const balance = parseFloat(account.balance) || 0;
                    if (balance > 0) {
                        this.accountBalance = balance;
                        this.accountCurrency = account.currency || 'USD';
                        this.accountLoginid = account.loginid;
                        console.log('[InvestmentIAView] ✅ Saldo atualizado do evento:', {
                            balance: this.accountBalance,
                            currency: this.accountCurrency,
                            loginid: this.accountLoginid,
                            isDemo: this.isDemo,
                            tradeCurrency: this.tradeCurrency
                        });
                    }
                }
                
                // Atualizar tradeCurrency no settings (igual ao Dashboard)
                this.updateTradeCurrency(isDemoAccount ? 'demo' : 'real');
            }
            
            // Buscar saldo atualizado da API em background (sem bloquear)
            this.fetchAccountBalance();
        },
        
        async startDataLoading() {
            try {
                console.log('[InvestmentIAView] ===== INICIANDO CARREGAMENTO DE DADOS =====');
                
                // Primeiro, buscar o histórico de 1000 ticks para construir o gráfico
                console.log('[InvestmentIAView] 📊 Buscando histórico de 1000 ticks...');
                await this.fetchTicksHistory(1000);
                
                // Depois, iniciar o serviço de monitoramento
                const response = await fetch('https://taxafacil.site/api/ai/start', {
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
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/config/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = await response.json();

                if (result.success && result.data) {
                    const config = result.data;
                    this.isInvestmentActive = config.isActive || false;
                    
                    if (config.isActive) {
                        console.log('[InvestmentIAView] ✅ IA JÁ ESTÁ ATIVA!');
                        // Buscar histórico de ticks para construir o gráfico
                        await this.fetchTicksHistory(1000);
                    } else {
                        console.log('[InvestmentIAView] IA está inativa');
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
        console.log('🚀 TESTE: InvestmentIAView mounted() foi chamado!');
        console.warn('⚠️ SE VOCÊ VÊ ESTA MENSAGEM, O COMPONENTE ESTÁ CARREGANDO!');
        
        // Carregar tradeCurrency do settings (igual ao Dashboard)
        await this.loadTradeCurrency();
        
        // Buscar saldo imediatamente ao montar o componente
        console.log('[InvestmentIAView] Buscando saldo inicial...');
        await this.fetchAccountBalance();
        
        await this.checkAIStatus();
        
        console.log('[InvestmentIAView] Iniciando carregamento de dados...');
        this.startDataLoading();
        
        console.log('[InvestmentIAView] Iniciando atualização de saldo...');
        this.startBalanceUpdates();
        
        console.log('[InvestmentIAView] Iniciando relógio em tempo real...');
        this.startClock();
        
        console.log('[InvestmentIAView] Iniciando atualização de estatísticas...');
        this.startStatsUpdates();
        
        // Escutar mudanças de conta para atualizar saldo automaticamente
        window.addEventListener('accountChanged', this.handleAccountChange);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        window.removeEventListener('accountChanged', this.handleAccountChange);
        console.log('[InvestmentIAView] Limpando polling antes de desmontar...');
        this.stopPolling();
        
        console.log('[InvestmentIAView] Parando atualização de saldo...');
        this.stopBalanceUpdates();
        
        console.log('[InvestmentIAView] Parando relógio...');
        this.stopClock();
        
        console.log('[InvestmentIAView] Parando atualização de estatísticas...');
        this.stopStatsUpdates();
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

.content-wrapper {
    margin-left: 280px;
    min-height: 100vh;
    transition: margin-left 0.3s ease, width 0.3s ease;
    width: calc(100% - 280px);
    box-sizing: border-box;
}

.content-wrapper.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
}

/* Top Header */
.top-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 350px;
    z-index: 40;
    background-color: #0E0E0E;
    border-bottom: 1px solid #1C1C1C;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    transition: left 0.3s ease;
    width: calc(100% - 350px);
    box-sizing: border-box;
}

.content-wrapper.sidebar-collapsed .top-header {
    left: 0;
    width: 100%;
}

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

/* Main Content - Desktop (sem gradiente) */
.main-content {
    margin-top: 90px; /* Margem pequena entre conteúdo e header */
    padding: 1rem 20px; /* Padding reduzido */
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
}

/* AI Vision Panel */
#ai-vision-panel {
    margin-left: 0;
    margin-right: 0;
    margin-top: 1.5rem;
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

.fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ai-vision-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between; 
    margin-bottom: 1.5rem;
}

.ai-vision-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
}

.ai-vision-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
}

.balance-card-header {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 0.75rem;
}

.balance-header-content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.balance-info-header {
    display: flex;
    flex-direction: column;
}

.balance-label-header {
    font-size: 0.625rem;
    color: #7A7A7A;
    font-weight: 500;
}

.balance-value-row-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.125rem;
}

.balance-value-header {
    font-size: 1rem;
    font-weight: bold;
    color: #DFDFDF;
}

.account-type-btn-header {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    border: none;
}

.real-btn-header {
    background-color: #22C55E;
    color: #000;
}

.demo-btn-header {
    background-color: #333;
    color: #A1A1A1;
}

.eye-toggle-btn-header {
    background: none;
    border: none;
    color: #A1A1A1;
    cursor: pointer;
}

/* AI Vision Grid */
.ai-vision-grid {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 1.25rem;
}

/* AI Brain Container */
.ai-brain-container {
    height: 220px;
    overflow: hidden;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%);
    border: 1px solid rgba(34, 197, 94, 0.3);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ai-brain-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 50%, rgba(34, 197, 94, 0.1) 100%);
}

.animated-grid {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: gridMove 20s linear infinite;
    opacity: 0.2;
}

@keyframes gridMove {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 20px 20px;
    }
}

.ai-core-wrapper {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ring-outer {
    position: absolute;
    width: 10rem;
    height: 10rem;
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 50%;
    animation: rotate 8s linear infinite;
}

.ring-middle {
    position: absolute;
    width: 8rem;
    height: 8rem;
    border: 2px solid rgba(34, 197, 94, 0.4);
    border-radius: 50%;
    animation: rotate 6s linear infinite reverse;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* AI Vision Panel Specific Animations */
#i9dlnn {
    background-image: linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: gridMove 20s linear infinite;
    opacity: 1;
}

#irazem {
    animation: rotate 8s linear infinite;
}

#i5uptv {
    animation: rotate 6s linear infinite reverse;
}

#iyljui {
    animation: orbit1 4s linear infinite;
}

#isxtjr {
    animation: orbit2 5s linear infinite;
}

#ijse57 {
    animation: orbit3 6s linear infinite;
}

#iw45yh {
    top: 20%;
    left: 15%;
    animation: float 3s ease-in-out infinite;
}

#i2cpbj {
    top: 60%;
    left: 80%;
    animation: float 4s ease-in-out infinite 0.5s;
}

#ispbex {
    top: 80%;
    left: 30%;
    animation: float 3.5s ease-in-out infinite 1s;
}

#i7wi6r {
    top: 40%;
    left: 70%;
    animation: float 4.5s ease-in-out infinite 1.5s;
}

#ivhu5o {
    top: 30%;
    left: -20px;
    animation: streamRight 2s linear infinite;
}

#iybi4e {
    top: 50%;
    left: -20px;
    animation: streamRight 2.5s linear infinite 0.5s;
}

#icjipi {
    top: 70%;
    left: -20px;
    animation: streamRight 3s linear infinite 1s;
}

.hover-lift {
    transition: all 0.3s ease;
}

.hover-lift:hover {
    background: #111;
    transform: translateY(-1px);
}

.core-pulse {
    position: absolute;
    width: 6rem;
    height: 6rem;
    background: rgba(34, 197, 94, 0.2);
    border-radius: 50%;
    filter: blur(1.5rem);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.ai-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.brain-icon {
    position: relative;
    z-index: 20;
    font-size: 3rem;
    color: #22C55E;
    animation: brainPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
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

.ai-brain-glow {
    animation: brainPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
    z-index: 30;
    position: relative;
}

.ai-brain-glow i {
    opacity: 1 !important;
    display: block !important;
    visibility: visible !important;
}

/* Wallet Icon Styles */
.wallet-icon-wrapper {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 20px !important;
    min-height: 20px !important;
}

.wallet-icon-wrapper i {
    font-size: 16px !important;
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
    line-height: 1 !important;
    color: #22C55E !important;
}

/* Asset Icon Styles */
.asset-icon {
    width: 16px !important;
    height: 16px !important;
    display: block !important;
    opacity: 0.6 !important;
    flex-shrink: 0 !important;
    visibility: visible !important;
    object-fit: contain !important;
}

.asset-icon[src] {
    filter: brightness(0) saturate(100%) invert(67%) sepia(90%) saturate(400%) hue-rotate(90deg) brightness(95%) contrast(85%);
}

.ai-glow-ring {
    animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
    0%, 100% {
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1);
    }
    50% {
        box-shadow: 0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2);
    }
}

.orbit-node {
    position: absolute;
    background: #22C55E;
    border-radius: 50%;
}

.orbit-1 {
    width: 0.75rem;
    height: 0.75rem;
    animation: orbit1 4s linear infinite;
}

.orbit-2 {
    width: 0.5rem;
    height: 0.5rem;
    background: rgba(34, 197, 94, 0.7);
    animation: orbit2 5s linear infinite;
}

.orbit-3 {
    width: 0.625rem;
    height: 0.625rem;
    background: rgba(34, 197, 94, 0.8);
    animation: orbit3 6s linear infinite;
}

@keyframes orbit1 {
    0% {
        transform: rotate(0deg) translateX(5rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(5rem) rotate(-360deg);
    }
}

@keyframes orbit2 {
    0% {
        transform: rotate(0deg) translateX(4rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(4rem) rotate(-360deg);
    }
}

@keyframes orbit3 {
    0% {
        transform: rotate(0deg) translateX(3rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(3rem) rotate(-360deg);
    }
}

.particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.particle {
    position: absolute;
    background: #22C55E;
    border-radius: 50%;
}

.particle-1 {
    width: 0.25rem;
    height: 0.25rem;
    top: 20%;
    left: 15%;
    animation: float 3s ease-in-out infinite;
}

.particle-2 {
    width: 0.375rem;
    height: 0.375rem;
    background: rgba(34, 197, 94, 0.7);
    top: 60%;
    left: 80%;
    animation: float 4s ease-in-out infinite 0.5s;
}

.particle-3 {
    width: 0.25rem;
    height: 0.25rem;
    background: rgba(34, 197, 94, 0.6);
    top: 80%;
    left: 30%;
    animation: float 3.5s ease-in-out infinite 1s;
}

.particle-4 {
    width: 0.375rem;
    height: 0.375rem;
    top: 40%;
    left: 70%;
    animation: float 4.5s ease-in-out infinite 1.5s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.data-streams {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.3;
}

.stream {
    position: absolute;
    height: 1px;
    background: linear-gradient(to right, transparent, #22C55E, transparent);
}

.stream-1 {
    width: 5rem;
    top: 30%;
    left: -20px;
    animation: streamRight 2s linear infinite;
}

.stream-2 {
    width: 4rem;
    top: 50%;
    left: -20px;
    animation: streamRight 2.5s linear infinite 0.5s;
}

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

/* Gerenciamento de Risco - Desktop: esconder dentro do card, mostrar card separado */
.risk-management-mobile {
    display: none;
}

#risk-management-card {
    display: block;
}

/* Garantir que no desktop (acima de 768px) as regras sejam aplicadas */
@media (min-width: 769px) {
    .risk-management-mobile {
        display: none !important;
    }
    
    #risk-management-card {
        display: block !important;
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
    gap: 1rem;
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
    left: 0.75rem;
    color: #DFDFDF;
    font-size: 0.75rem;
    z-index: 1;
    pointer-events: none;
}

.form-select,
.form-input {
    width: 100%;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
    color: #DFDFDF;
    outline: none;
    transition: border-color 0.2s;
}

.form-input {
    padding-left: 1.5rem;
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
    text-align: left;
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
    grid-template-columns: repeat(4, 1fr);
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
        margin-top: 60px;
        padding: 1rem 15px;
        background: transparent !important;
        position: relative;
        min-height: calc(100vh - 60px);
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
    
    /* Gerenciamento de Risco - Mobile: mostrar dentro do card, esconder card separado */
    .risk-management-mobile {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    /* Mostrar apenas o texto descritivo no mobile, esconder barra e header */
    .risk-management-mobile .risk-indicator {
        display: block !important;
        background-color: transparent !important;
        border: none !important;
        padding: 0.5rem 0 !important;
        margin-top: 0.5rem;
    }
    
    .risk-management-mobile .risk-header,
    .risk-management-mobile .risk-bar-container {
        display: none !important;
    }
    
    .risk-management-mobile .risk-description {
        display: block !important;
        font-size: 0.75rem;
        color: #A1A1A1;
        opacity: 0.8;
        text-align: center;
        margin: 0;
    }
    
    #risk-management-card {
        display: none !important;
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
        font-size: 0.875rem;
        left: 1rem;
        color: #FFFFFF !important;
        font-weight: 600;
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
    
    .ai-status-control {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem;
        background-color: transparent;
        border: none;
        margin-bottom: 0;
    }
    
    .ai-status-control > div:first-child {
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
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
    z-index: 998;
    cursor: pointer;
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
        z-index: 10000 !important;
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
        margin-bottom: 1.5rem;
        background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(15, 32, 25, 0.3) 0%, rgba(0, 1, 0, 0.1) 70%, transparent 100%);
        border-radius: 0.75rem;
        padding: 1rem;
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
        grid-template-columns: 1fr 1fr !important;
        gap: 0.75rem;
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
}
</style>