<template>
    <div class="ia-investment-panel">
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
                    <button @click="showHistoryModal = true"
                        class="w-full mt-4 py-3 bg-transparent border border-[#22C55E] rounded-full flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#22C55E]/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#22C55E]"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                        <span class="text-xs font-black text-[#22C55E] uppercase tracking-widest">HISTÓRICO</span>
                    </button>
                </div>
                <div class="grid grid-cols-12 gap-5">
                    <!-- AI Visualization Area (Desktop Only) -->
                    <div v-if="!isMobile" class="col-span-5 h-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-zenix-green/10 to-transparent border-2 border-zenix-green/30 flex items-center justify-center relative ai-visualization-area">
                        <div class="absolute inset-0 bg-gradient-to-br from-zenix-green/5 via-transparent to-zenix-green/10"></div>
                        <div class="absolute inset-0 opacity-20"><div class="absolute inset-0"></div></div>
                        <div class="relative z-10 flex items-center justify-center ai-core-mobile" style="width: 100%; height: 100%;">
                            <div class="absolute w-40 h-40 border-2 border-zenix-green/30 rounded-full ai-glow-ring"></div>
                            <div class="absolute w-32 h-32 border-2 border-zenix-green/40 rounded-full"></div>
                            <div class="absolute w-24 h-24 bg-zenix-green/20 rounded-full blur-xl ai-pulse"></div>
                            <div class="relative z-30 ai-brain-glow" style="display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-brain text-zenix-green text-5xl" style="opacity: 1 !important; display: block !important; visibility: visible !important; font-size: 3rem !important;"></i>
                            </div>
                        </div>
                    </div>
                    <!-- Status Cards -->
                    <div :class="isMobile ? 'col-span-12' : 'col-span-7'" class="grid grid-cols-2 gap-4 status-cards-container">
                        <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                            <div class="flex items-center justify-center gap-2 mb-2">
                                <i class="fas fa-brain text-[#22C55E] text-lg"></i>
                                <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">ESTRATÉGIAS</p>
                            </div>
                            <p class="text-xs text-white status-value">5 IAs Especializadas</p>
                            <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">IAs para diferentes perfis</p>
                        </div>
                        <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                            <div class="flex items-center justify-center gap-2 mb-2">
                                <i class="fas fa-chart-line text-[#22C55E] text-lg"></i>
                                <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">DESEMPENHO</p>
                            </div>
                            <p class="text-xs text-white status-value">{{ performanceDisplay }}</p>
                            <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Varia por estratégia e modo</p>
                        </div>
                        <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center h-full min-h-[105px] justify-center">
                            <div class="flex items-center justify-center gap-2 mb-2">
                                <i class="fas fa-sliders-h text-[#22C55E] text-lg"></i>
                                <p class="text-[10px] text-[#22C55E] uppercase font-bold status-label">CONTROLE</p>
                            </div>
                            <p class="text-xs text-white status-value">Parcial com Supervisão</p>
                            <p v-if="!isMobile" class="text-xs text-zenix-label mt-1 status-description">Você decide quando operar</p>
                        </div>
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
                        <button @click="openStrategyModal" class="premium-selector-btn">
                            <div class="selector-content">
                                <div class="selector-left">
                                    <div v-if="selectedStrategyObject" class="strategy-icons-inline mr-2">
                                        <div class="strategy-icon-box">
                                            <img v-if="selectedStrategyObject.icons && selectedStrategyObject.icons.length > 0" :src="selectedStrategyObject.icons[0]" class="deriv-svg-icon" />
                                            <i v-else :class="selectedStrategyObject.icon"></i>
                                        </div>
                                    </div>
                                    <span :class="{ 'placeholder': !selectedStrategy }">
                                        <template v-if="selectedStrategyObject">{{ selectedStrategyObject.title }}</template>
                                        <template v-else>Selecione uma estratégia</template>
                                    </span>
                                </div>
                                <i class="fas fa-chevron-right selector-arrow"></i>
                            </div>
                        </button>

                        <!-- Strategy Description Card -->
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

                    <!-- Strategy Selection Modal -->
                    <Teleport to="body">
                        <div v-if="showStrategyModal" class="modal-overlay" @click.self="closeStrategyModal">
                            <div class="modal-content categorized-modal" style="padding: 20px;">
                                <div class="modal-header-premium">
                                    <div class="modal-header-info">
                                        <h3 class="modal-title" style="font-size: 1.6rem;">Selecionar Estratégia</h3>
                                        <p class="modal-subtitle text-xs text-zenix-secondary mt-1">Escolha a melhor estratégia para sua operação.</p>
                                    </div>
                                    <button @click="closeStrategyModal" class="modal-close-btn"><i class="fas fa-times"></i></button>
                                </div>
                                <div class="modal-body">
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
                            <button id="modeVeloz" :class="['mode-btn', { 'active': mode === 'veloz' }]" @click="mode = 'veloz'">Veloz</button>
                            <button id="modeModerate" :class="['mode-btn', { 'active': mode === 'moderado' }]" @click="mode = 'moderado'">Normal</button>
                            <button id="modeLento" :class="['mode-btn', { 'active': mode === 'lento' }]" @click="mode = 'lento'">Preciso</button>
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
                            <button :class="['risk-btn', { 'active': modoMartingale === 'fixo' }]" @click="modoMartingale = 'fixo'">Fixo</button>
                            <button :class="['risk-btn', { 'active': modoMartingale === 'conservador' }]" @click="modoMartingale = 'conservador'">Conservador</button>
                            <button :class="['risk-btn', { 'active': modoMartingale === 'moderado' }]" @click="modoMartingale = 'moderado'">Moderado</button>
                            <button :class="['risk-btn', { 'active': modoMartingale === 'agressivo' }]" @click="modoMartingale = 'agressivo'">Agressivo</button>
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
                                <p>Defina o valor da sua primeira operação.</p>
                            </ZenixTooltip>
                        </label>
                        <div class="input-wrapper">
                            <span class="input-prefix">$</span>
                            <input type="number" class="form-input" v-model.number="entryValue" min="0.35" step="0.01">
                        </div>
                        <p class="form-help">{{ entryPercent }}% do saldo</p>
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            Alvo de Lucro
                            <ZenixTooltip :offset="20">
                                <p>Sua meta financeira para a sessão.</p>
                            </ZenixTooltip>
                        </label>
                        <div class="input-wrapper">
                            <span class="input-prefix">$</span>
                            <input type="number" class="form-input" v-model.number="profitTarget" min="0" step="0.01">
                        </div>
                        <p class="form-help">{{ profitPercent }}% do saldo</p>
                    </div>

                    <div class="loss-stoploss-row">
                        <div class="form-group flex-1">
                            <label class="form-label">
                                Limite de Perda
                                <ZenixTooltip :offset="20">
                                    <p>O valor máximo que você aceita arriscar na sessão.</p>
                                </ZenixTooltip>
                            </label>
                            <div class="input-wrapper">
                                <span class="input-prefix">$</span>
                                <input type="number" class="form-input" v-model.number="lossLimit" min="0" step="0.01">
                            </div>
                            <p class="form-help">{{ lossPercent }}% do saldo</p>
                        </div>

                        <div class="form-group flex-1">
                            <label class="form-label">
                                Stoploss Blindado
                                <ZenixTooltip :offset="20">
                                    <p>Ative para proteção dinâmica. Quando você atinge 40% da meta, o sistema cria um 'piso de segurança' móvel.</p>
                                </ZenixTooltip>
                            </label>
                            <div class="stoploss-blindado-wrapper">
                                <div class="stoploss-blindado-label">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>{{ stoplossBlindado ? 'Ativado' : 'Desativado' }}</span>
                                </div>
                                <label class="toggle-switch stoploss-toggle">
                                    <input type="checkbox" v-model="stoplossBlindado">
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
                                    <input type="checkbox" :checked="isInvestmentActive" @change="handleToggleChange">
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
                :account-balance-prop="info?.balance || 0"
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

        <!-- Modals -->
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
            <div v-if="showAccountModal" class="modal-overlay" @click.self="showAccountModal = false">
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
                                    <div class="account-icon-box" :class="account.isDemo ? 'account-demo' : 'account-real'">
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

        <!-- Session History Modal -->
        <SessionHistoryModal
            :visible="showHistoryModal"
            :userId="getUserId()"
            @close="showHistoryModal = false"
        />
    </div>
</template>

<script>
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';
import ZenixTooltip from '@/components/ZenixTooltip.vue';
import accountBalanceMixin from '@/mixins/accountBalanceMixin';
import InsufficientBalanceModal from '@/components/InsufficientBalanceModal.vue';
import MinimumStakeModal from '@/components/modals/MinimumStakeModal.vue';
import StrategyRequiredModal from '@/components/modals/StrategyRequiredModal.vue';
import SessionHistoryModal from '@/components/SessionHistoryModal.vue';
import ImplementationModal from '@/components/modals/ImplementationModal.vue';
import { StrategiesService } from '@/services/StrategiesService';

let strategiesPresets = [];

export default {
    name: 'InvestmentComponent',
    mixins: [accountBalanceMixin],
    components: {
        InvestmentActive,
        ZenixTooltip,
        InsufficientBalanceModal,
        MinimumStakeModal,
        StrategyRequiredModal,
        SessionHistoryModal,
        ImplementationModal
    },
    props: {
        isMobile: {
            type: Boolean,
            default: false
        },
        isSidebarCollapsed: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
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
            allStrategies: [],

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
            },

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
        };
    },
    watch: {
        showAccountModal(newValue) {
            if (!newValue && !this.isInvestmentActive && this.activationEvent) {
                if (this.activationEvent.target) {
                    this.activationEvent.target.checked = false;
                }
            }
        },
        info(newInfo) {
            if (this.loadingBalance) return;
            if (!newInfo || !newInfo.loginid) {
                console.log('[InvestmentComponent] ⚠️ Conexão pausada ou token pendente.');
            }
        }
    },
    computed: {
        isAdmin() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                const isAdminFlag = payload.isAdmin || payload.is_admin;
                if (isAdminFlag === true || isAdminFlag === 'true') return true;
                if (role) {
                    const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                    return roleStr.includes('admin') || roleStr === 'admin';
                }
                return false;
            } catch (e) { return false; }
        },
        selectedStrategyObject() {
            return this.allStrategies.find(s => s.id === this.selectedStrategy);
        },
        selectedStrategyName() {
            return this.selectedStrategyObject ? this.selectedStrategyObject.title : 'Selecione uma estratégia';
        },
        availableStrategies() {
            const activeStrategies = this.allStrategies.filter(s => s.status === 'Ativo');
            if (!this.planFeatures) return activeStrategies;
            return activeStrategies;
        },
        performanceDisplay() {
            if (this.selectedStrategyObject) return this.selectedStrategyObject.assertividade;
            return '60% a 75%';
        },
        strategyDescription() {
            const strategyId = this.selectedStrategy || 'atlas';
            const strategyObject = this.allStrategies.find(s => s.id === strategyId);
            if (strategyObject) {
                const cleanDesc = strategyObject.description.replace(/\.$/, '');
                return `<strong>Análise:</strong> ${cleanDesc} - <strong>Assertividade:</strong> ${strategyObject.assertividade} - <strong>Retorno:</strong> ${strategyObject.retorno}`;
            }
            return 'Estratégia de IA avançada.';
        },
        entryPercent() {
            const val = Number(this.entryValue);
            const bal = Number(this.balanceNumeric);
            if (!bal || bal <= 0 || !val || val < 0) return '0.00';
            return ((val / bal) * 100).toFixed(2);
        },
        profitPercent() {
            const val = Number(this.profitTarget);
            const bal = Number(this.balanceNumeric);
            if (!bal || bal <= 0 || !val || val < 0) return '0.00';
            return ((val / bal) * 100).toFixed(2);
        },
        lossPercent() {
            const val = Number(this.lossLimit);
            const bal = Number(this.balanceNumeric);
            if (!bal || bal <= 0 || !val || val < 0) return '0.00';
            return ((val / bal) * 100).toFixed(2);
        },
        riskLevelText() {
            const labels = { 'conservador': 'Baixo', 'moderado': 'Médio', 'agressivo': 'Alto', 'fixo': 'Fixo' };
            return labels[this.modoMartingale] || 'Baixo';
        },
        riskBarWidth() {
            const widths = { 'conservador': '25%', 'moderado': '50%', 'agressivo': '75%', 'fixo': '15%' };
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
        modeDescription() {
            const descriptions = {
                'veloz': 'Mais negociações, menos precisão',
                'moderado': 'Negociações e precisão moderado',
                'lento': 'Menos operações, mais precisão'
            };
            return descriptions[this.mode] || descriptions.veloz;
        },
    },
    methods: {
        handleLiveBalanceUpdate(newBalance) {
            if (!newBalance || !this.info) return;
            this.info.balance = newBalance;
            if (this.accountType === 'demo') {
                this.info.demo_amount = newBalance;
                if (this.info.balancesByCurrencyDemo) this.info.balancesByCurrencyDemo['USD'] = newBalance;
            } else {
                this.info.real_amount = newBalance;
                if (this.info.balancesByCurrencyReal) this.info.balancesByCurrencyReal['USD'] = newBalance;
            }
            this.info = { ...this.info };
        },

        handleAccountTypeChange(newType) {
            this.accountType = newType;
        },

        formatAccountBalance(balance, isDemo = false) {
            let value = parseFloat(balance) || 0;
            if (isDemo && this.isFictitiousBalanceActive) {
                value += (parseFloat(this.fictitiousBalance) || 0);
            }
            return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },

        async handleToggleChange(event) {
            const isChecked = event.target.checked;
            if (isChecked && !this.isInvestmentActive) {
                this.handleStartClick(event);
            } else if (!isChecked && this.isInvestmentActive) {
                await this.deactivateIA();
            }
        },

        async activateIA() {
            this.isActivating = true;
            try {
                if (!this.selectedStrategy) {
                    this.showStrategyRequiredModal = true;
                    return;
                }

                await this.loadMasterTraderSettings();

                const currentBalance = this.balanceNumeric || 0;
                if (currentBalance < this.entryValue) {
                    this.showInsufficientBalanceModal = true;
                    this.isActivating = false;
                    return;
                }

                if (this.entryValue < 0.35) {
                    this.showMinimumStakeModal = true;
                    this.isActivating = false;
                    return;
                }

                const strategyPreset = strategiesPresets.find(s => {
                    const strategyId = s.id.replace('default_', '');
                    const selectedId = this.selectedStrategy.replace('default_', '');
                    return strategyId === selectedId;
                });

                if (!strategyPreset) {
                    this.$root.$toast.error('Configuração da estratégia não encontrada!');
                    this.isActivating = false;
                    return;
                }

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
                    attackFilters: strategyPreset.config?.form?.attackFilters || [],
                    recoveryConfig: strategyPreset.config?.recoveryConfig || {},
                    strategyIdentity: strategyPreset.config?.strategyIdentity || {},
                    version: this.allStrategies.find(s => s.id === this.selectedStrategy)?.version || '1.0'
                };

                localStorage.removeItem('ai_active_config');
                localStorage.setItem('ai_active_config', JSON.stringify(config));

                this.$root.$toast.success(`IA ${strategyPreset.name} ativada com sucesso!`);

                setTimeout(() => {
                    const conn = JSON.parse(localStorage.getItem('deriv_connection') || '{}');
                    this.$router.push({
                        path: '/Investments-IA/active',
                        query: { loginid: conn.loginid },
                        params: {
                            sessionState: {
                                version: config.version,
                                strategy: config.strategyName
                            }
                        }
                    });
                }, 500);

            } catch (error) {
                console.error('[InvestmentComponent] ❌ Erro ao ativar IA:', error);
                this.$root.$toast.error('Erro ao ativar IA');
            } finally {
                this.isActivating = false;
            }
        },

        async deactivateIA() {
            try {
                this.isDeactivating = true;
                this.stopTickConnection();
                this.isMonitoring = false;
                this.isInvestmentActive = false;
                this.addLog('⏹️ IA Desativada pelo usuário.', 'info');
                this.$root.$toast.info('IA desativada com sucesso.');
            } catch (error) {
                console.error('[InvestmentComponent] ❌ Erro ao desativar IA:', error);
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
                    if (payload.userId || payload.sub || payload.id) return payload.userId || payload.sub || payload.id;
                }
                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    if (userInfo.id || userInfo.userId) return userInfo.id || userInfo.userId;
                }
                return null;
            } catch (error) {
                return null;
            }
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
                    headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Falha ao buscar configurações do backend');
                const data = await response.json();
                const accounts = [];

                if (data.tokenReal) {
                    accounts.push({ loginid: data.idRealAccount || 'Conta Real', token: data.tokenReal, balance: Number(data.realAmount) || 0, currency: data.tokenRealCurrency || 'USD', isDemo: false });
                }
                if (data.tokenDemo) {
                    accounts.push({ loginid: data.idDemoAccount || 'Conta Demo', token: data.tokenDemo, balance: Number(data.demoAmount) || 0, currency: data.tokenDemoCurrency || 'USD', isDemo: true });
                }
                this.availableAccounts = accounts;
            } catch (error) {
                this.$root.$toast.error('Erro ao conectar com o servidor.');
                if (event && event.target) event.target.checked = false;
                this.showAccountModal = false;
            } finally {
                this.isLoadingAccounts = false;
            }
        },

        async selectAccount(account) {
            this.selectedToken = account.token;
            this.accountType = account.isDemo ? 'demo' : 'real';
            localStorage.setItem('deriv_account_type', this.accountType);

            if (this.info) {
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
                this.info = { ...this.info };
            }

            this.showAccountModal = false;

            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const token = localStorage.getItem('token');
                const tradeCurrency = account.isDemo ? 'DEMO' : 'USD';
                localStorage.setItem('trade_currency', tradeCurrency);
                localStorage.setItem('deriv_token', account.token);
                const connectionData = { loginid: account.loginid, token: account.token, isDemo: account.isDemo, balance: account.balance, currency: account.currency, timestamp: Date.now() };
                localStorage.setItem('deriv_connection', JSON.stringify(connectionData));

                await fetch(`${apiBase}/settings/deriv-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ token: account.token, active_loginid: account.loginid })
                });
            } catch (error) {
                console.error('Erro ao salvar token no backend:', error);
            }

            await this.activateIA();
        },

        getDerivToken() {
            if (this.selectedToken) return this.selectedToken;
            try {
                const tokensByLoginId = JSON.parse(localStorage.getItem('deriv_tokens_by_loginid') || '{}');
                if (this.accountType === 'demo') {
                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) return token;
                    }
                } else {
                    const conn = JSON.parse(localStorage.getItem('deriv_connection') || '{}');
                    if (conn.loginid && tokensByLoginId[conn.loginid]) return tokensByLoginId[conn.loginid];
                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (!loginid.startsWith('VRTC') && !loginid.startsWith('VRT')) return token;
                    }
                }
            } catch (e) { /* fallback to default token */ }
            return localStorage.getItem('deriv_token') || null;
        },

        async fetchStrategies() {
            try {
                let defaultStrategies = [];
                try {
                    defaultStrategies = await StrategiesService.getAllStrategies();
                } catch (e) {
                    defaultStrategies = [
                        { id: 'atlas', title: 'IA Atlas', icon: 'fas fa-shield-alt', status: 'Ativo' },
                        { id: 'apollo', title: 'IA Apollo', icon: 'fas fa-rocket', status: 'Ativo' },
                        { id: 'nexus', title: 'IA Nexus', icon: 'fas fa-chart-bar', status: 'Ativo' },
                        { id: 'orion', title: 'IA Orion', icon: 'fas fa-star', status: 'Ativo' },
                        { id: 'titan', title: 'IA Titan', icon: 'fas fa-yin-yang', status: 'Ativo' }
                    ];
                }

                const stored = localStorage.getItem('zeenix_saved_strategies');
                let userStrategies = stored ? JSON.parse(stored) : [];
                const unified = [...defaultStrategies, ...userStrategies];
                const seen = new Set();
                const fullStrategyList = unified.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });

                strategiesPresets = fullStrategyList;

                const formatRange = (min, max) => (min !== undefined && max !== undefined) ? `${min}% a ${max}%` : null;
                this.allStrategies = fullStrategyList.map(s => {
                    const identity = s.config?.strategyIdentity;
                    return {
                        id: s.id,
                        title: identity?.name || s.title || s.name,
                        icon: (identity?.icon ? `fas fa-${identity.icon}` : '') || s.icon || 'fas fa-robot',
                        description: identity?.description || s.description || 'Estratégia personalizada',
                        assertividade: formatRange(identity?.precision?.min, identity?.precision?.max) || s.metadata?.assertividade || s.assertividade || 'Variável',
                        retorno: formatRange(identity?.return?.min, identity?.return?.max) || s.metadata?.retorno || s.retorno || 'Variável',
                        status: identity?.status || s.status || 'Ativo',
                        version: s.version || '1.0',
                        fullConfig: s.config
                    };
                });

                this.allStrategies = this.allStrategies.filter(s => {
                    if (s.status === 'Ativo') return true;
                    if (s.status === 'Rascunho' && this.isAdmin) return true;
                    return false;
                });
            } catch (error) {
                console.error('[InvestmentComponent] Erro ao carregar estratégias:', error);
            }
        },

        async openStrategyModal() {
            this.showStrategyModal = true;
            await this.loadStrategiesFromAPI();
        },

        closeStrategyModal() {
            this.showStrategyModal = false;
        },

        selectStrategy(strategyId) {
            if (strategyId.toLowerCase() !== 'apollo' && !this.isAdmin) {
                const strategyName = this.allStrategies.find(s => s.id === strategyId)?.title || strategyId;
                this.implementationMessage = `A estratégia ${strategyName} está passando por atualizações e será liberada em breve.`;
                this.showImplementationModal = true;
                this.showStrategyModal = false;
                return;
            }
            this.selectedStrategy = strategyId;
            const strategyLower = strategyId.toLowerCase();
            if (['atlas', 'orion', 'titan', 'nexus', 'apollo'].includes(strategyLower)) {
                this.selectedMarket = 'vol100';
            } else {
                this.selectedMarket = 'vol10';
            }
            setTimeout(() => { this.closeStrategyModal(); }, 300);
        },

        async loadStrategiesFromAPI() {
            this.isLoadingStrategies = true;
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const token = localStorage.getItem('token');
                const strategyNames = ['apollo', 'atlas', 'nexus', 'orion', 'titan'];

                for (const strategyName of strategyNames) {
                    try {
                        const response = await fetch(`${apiBase}/strategies/${strategyName}`, { headers: { 'Authorization': `Bearer ${token}` } });
                        if (response.ok) {
                            const { data } = await response.json();
                            const idx = this.allStrategies.findIndex(s => s.id === strategyName);
                            if (idx !== -1 && data) {
                                if (data.metadata?.assertividade) this.allStrategies[idx].assertividade = data.metadata.assertividade;
                                if (data.metadata?.retorno) this.allStrategies[idx].retorno = data.metadata.retorno;
                                if (data.version) this.allStrategies[idx].version = data.version;
                            }
                        }
                    } catch (e) { /* keep defaults */ }
                }

                if (this.allStrategies.length > 0) {
                    localStorage.setItem('zeenix_strategies_cache', JSON.stringify(this.allStrategies));
                }
            } catch (error) {
                try {
                    const cached = localStorage.getItem('zeenix_strategies_cache');
                    if (cached) this.allStrategies = JSON.parse(cached);
                } catch (e) { /* use hardcoded defaults */ }
            } finally {
                this.isLoadingStrategies = false;
            }
        },

        stopTickConnection() {
            if (this.ws) { this.ws.close(); this.ws = null; }
        },

        addLog(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            this.realtimeLogs.unshift({ id: Date.now() + Math.random(), timestamp, message, type });
            if (this.realtimeLogs.length > 100) this.realtimeLogs.pop();
        },

        handleGlobalAccountChange() {
            this.reloadBalance();
        },

        stopPolling() {
            if (this.pollingInterval) { clearInterval(this.pollingInterval); this.pollingInterval = null; }
        },
        stopStatsUpdates() {
            if (this.statsUpdateInterval) { clearInterval(this.statsUpdateInterval); this.statsUpdateInterval = null; }
        },
    },

    async mounted() {
        console.log('[InvestmentComponent] mounted()');

        await this.fetchStrategies();
        this.reloadBalance();
        this.startBalancePolling(5000);

        window.addEventListener('accountChanged', this.handleGlobalAccountChange);
        window.addEventListener('refreshBalance', () => this.reloadBalance());

        if (this.$route?.query?.strategy) {
            this.selectedStrategy = this.$route.query.strategy;
        }

        const activeConfig = localStorage.getItem('ai_active_config');
        if (activeConfig) {
            const config = JSON.parse(activeConfig);
            if (config.isActive) {
                this.isInvestmentActive = true;
                this.isMonitoring = true;
                this.entryValue = config.stake;
                this.profitTarget = config.profitTarget;
                this.lossLimit = config.lossLimit;
                this.selectedStrategy = config.strategy?.toLowerCase();
            }
        }
    },

    beforeUnmount() {
        window.removeEventListener('accountChanged', this.handleGlobalAccountChange);
        this.stopPolling();
        this.stopStatsUpdates();
        this.stopBalancePolling();
        this.stopTickConnection();
    }
};
</script>

<style scoped src="@/assets/css/investment-ia.css"></style>