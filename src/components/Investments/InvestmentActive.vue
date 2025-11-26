<template>
    <div class="investment-active-wrapper">
        <main class="investment-active-main">
            <!-- Performance Summary Cards -->
            <section id="compact-performance-panel" class="mb-6">
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
                                <div class="text-xl font-bold text-zenix-text">
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
                                    <span class="text-[9px] text-zenix-label font-medium uppercase tracking-wide">Lucro do Dia</span>
                                    <button class="eye-btn" @click="profitVisible = !profitVisible">
                                        <i :class="profitVisible ? 'far fa-eye' : 'far fa-eye-slash'" class="text-zenix-green/60 text-[10px]"></i>
                                    </button>
                                </div>
                                <div class="flex items-baseline space-x-1.5">
                                    <div v-if="!isLoadingStats" :class="['text-xl font-bold', sessionProfitLossClass, { 'hidden-value': !profitVisible }]">
                                        {{ profitVisible ? formattedSessionProfitLoss : '••••••' }}
                                    </div>
                                    <span v-if="!isLoadingStats && profitPercentage && profitVisible" class="text-[10px] text-zenix-green/80 font-medium">{{ profitPercentage }}</span>
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
                            <div class="flex items-center space-x-2">
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
                                <div class="flex-1 h-full flex items-center justify-end min-w-0">
                                    <svg id="status-animation" viewBox="0 0 280 100" preserveAspectRatio="none" style="width: 100%; min-width: 500px; height: 100%; flex: 1;">
                                        <defs>
                                            <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stop-color="#22C55E" stop-opacity="0"></stop>
                                                <stop offset="50%" stop-color="#22C55E" stop-opacity="0.8"></stop>
                                                <stop offset="100%" stop-color="#22C55E" stop-opacity="0"></stop>
                                            </linearGradient>
                                            <filter id="glow-filter">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur"></feGaussianBlur>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                            <radialGradient id="radar-gradient">
                                                <stop offset="0%" stop-color="#22C55E" stop-opacity="0.6"></stop>
                                                <stop offset="100%" stop-color="#22C55E" stop-opacity="0"></stop>
                                            </radialGradient>
                                        </defs>
                                        <g opacity="0.15">
                                            <line x1="20" y1="15" x2="260" y2="15" stroke="#22C55E" stroke-width="0.5"></line>
                                            <line x1="20" y1="25" x2="260" y2="25" stroke="#22C55E" stroke-width="0.5"></line>
                                            <line x1="20" y1="36" x2="260" y2="36" stroke="#22C55E" stroke-width="1"></line>
                                            <line x1="20" y1="47" x2="260" y2="47" stroke="#22C55E" stroke-width="0.5"></line>
                                            <line x1="20" y1="57" x2="260" y2="57" stroke="#22C55E" stroke-width="0.5"></line>
                                        </g>
                                        <path d="M 30,45 Q 70,25 110,40 T 190,35 Q 220,45 250,30" stroke="#22C55E" stroke-width="2" fill="none" opacity="0.4" filter="url(#glow-filter)">
                                            <animate attributeName="d" values="M 30,45 Q 70,25 110,40 T 190,35 Q 220,45 250,30; M 30,40 Q 70,30 110,45 T 190,30 Q 220,40 250,35; M 30,45 Q 70,25 110,40 T 190,35 Q 220,45 250,30" dur="3s" repeatCount="indefinite"></animate>
                                        </path>
                                        <rect x="20" y="10" width="4" height="52" fill="url(#scan-gradient)" opacity="0.8">
                                            <animate attributeName="x" values="20;260;20" dur="2.5s" repeatCount="indefinite"></animate>
                                        </rect>
                                        <g opacity="0.6">
                                            <circle cx="50" cy="36" r="3" fill="#22C55E">
                                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="90" cy="30" r="3" fill="#22C55E">
                                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.2s" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="140" cy="38" r="3" fill="#22C55E">
                                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="180" cy="33" r="3" fill="#22C55E">
                                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.6s" repeatCount="indefinite"></animate>
                                            </circle>
                                            <circle cx="230" cy="40" r="3" fill="#22C55E">
                                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.8s" repeatCount="indefinite"></animate>
                                            </circle>
                                        </g>
                                        <circle cx="140" cy="36" r="25" fill="url(#radar-gradient)" opacity="0.3">
                                            <animate attributeName="r" values="15;35;15" dur="2s" repeatCount="indefinite"></animate>
                                            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite"></animate>
                                        </circle>
                                        <line x1="140" y1="36" x2="165" y2="36" stroke="#22C55E" stroke-width="1.5" opacity="0.8" filter="url(#glow-filter)">
                                            <animateTransform attributeName="transform" type="rotate" values="0 140 36;360 140 36" dur="3s" repeatCount="indefinite"></animateTransform>
                                        </line>
                                        <circle cx="140" cy="36" r="4" fill="#22C55E" filter="url(#glow-filter)">
                                            <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite"></animate>
                                        </circle>
                                        <g opacity="0.4">
                                            <rect x="25" y="60" width="8" height="4" fill="#22C55E" rx="1">
                                                <animate attributeName="height" values="4;12;4" dur="0.8s" repeatCount="indefinite"></animate>
                                                <animate attributeName="y" values="60;56;60" dur="0.8s" repeatCount="indefinite"></animate>
                                            </rect>
                                            <rect x="38" y="60" width="8" height="4" fill="#22C55E" rx="1">
                                                <animate attributeName="height" values="4;16;4" dur="0.8s" begin="0.1s" repeatCount="indefinite"></animate>
                                                <animate attributeName="y" values="60;52;60" dur="0.8s" begin="0.1s" repeatCount="indefinite"></animate>
                                            </rect>
                                            <rect x="51" y="60" width="8" height="4" fill="#22C55E" rx="1">
                                                <animate attributeName="height" values="4;10;4" dur="0.8s" begin="0.2s" repeatCount="indefinite"></animate>
                                                <animate attributeName="y" values="60;58;60" dur="0.8s" begin="0.2s" repeatCount="indefinite"></animate>
                                            </rect>
                                            <rect x="64" y="60" width="8" height="4" fill="#22C55E" rx="1">
                                                <animate attributeName="height" values="4;14;4" dur="0.8s" begin="0.3s" repeatCount="indefinite"></animate>
                                                <animate attributeName="y" values="60;54;60" dur="0.8s" begin="0.3s" repeatCount="indefinite"></animate>
                                            </rect>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    
            <!-- Main Content Grid -->
            <div class="grid grid-cols-12 gap-6 mb-6" style="width: 100%; box-sizing: border-box;">
                <!-- Left Column - Chart -->
                <div id="ir8sfp" class="col-span-8">
                    <div id="market-chart" class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card h-[800px] flex flex-col">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h2 class="text-lg font-semibold text-zenix-text">Análise de Mercado</h2>
                                <p class="text-xs text-zenix-secondary mt-1">{{ selectedMarket }} • M5 • Última atualização: {{ formattedLastUpdate }}</p>
                            </div>
                            <div class="flex items-center space-x-6">
                                <button 
                                    id="tab-chart" 
                                    :class="['relative text-sm font-medium transition-all pb-1', activeTab === 'chart' ? 'text-zenix-green' : 'text-zenix-secondary hover:text-zenix-text']"
                                    @click="activeTab = 'chart'"
                                >
                                    Gráfico
                                    <div v-if="activeTab === 'chart'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zenix-green"></div>
                                </button>
                                <button 
                                    id="tab-logs" 
                                    :class="['relative text-sm font-medium transition-all pb-1', activeTab === 'logs' ? 'text-zenix-green' : 'text-zenix-secondary hover:text-zenix-text']"
                                    @click="activeTab = 'logs'"
                                >
                                    Logs
                                    <div v-if="activeTab === 'logs'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zenix-green"></div>
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <button
                                v-for="timeframe in timeframeOptions"
                                :key="timeframe.value"
                                :class="['timeframe-btn px-3 py-1.5 rounded-lg text-xs font-medium transition-all', selectedTimeframe === timeframe.value ? 'bg-zenix-green text-black border border-zenix-green font-bold' : 'bg-zenix-bg text-zenix-secondary border border-zenix-border hover:border-zenix-green hover:text-zenix-green']"
                                @click="setChartSize(timeframe.value, timeframe.points)"
                            >
                                {{ timeframe.label }}
                            </button>
                        </div>
            
                        <!-- Chart View -->
                        <div v-show="activeTab === 'chart'" id="chart-view" class="h-[600px]">
                            <div ref="chartContainer" id="tradingview-chart" class="chart-container tradingview-container h-full"></div>
                        </div>

                        <!-- Logs View -->
                        <div v-show="activeTab === 'logs'" id="logs-view" class="h-[600px] overflow-y-auto">
                    <div v-if="isLoadingLogs" class="loading-logs">
                        <p>Carregando histórico de operações...</p>
                    </div>
                    
                    <div v-else-if="logOperations.length === 0" class="no-logs">
                        <p>Nenhuma operação executada ainda.</p>
                    </div>
                    
                            <div v-else class="logs-table-wrapper">
                                <table class="logs-table">
                        <thead>
                            <tr>
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Horário</th>
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Mercado</th>
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Negociação</th>
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Investimento</th>
                                            <th class="text-right py-3 px-4 text-xs font-medium text-zenix-secondary">Retorno</th>
                            </tr>
                        </thead>
                        <tbody>
                                        <tr v-for="(op, index) in logOperations" :key="index" class="log-row">
                                            <td class="py-3 px-4 text-xs text-zenix-text font-medium">{{ op.time }}</td>
                                            <td class="py-3 px-4 text-xs text-zenix-text">{{ op.pair }}</td>
                                            <td class="py-3 px-4">
                                                <span :class="['direction-badge', op.direction === 'CALL' ? 'call-badge' : 'put-badge']">
                                                    <i :class="`fas fa-arrow-${op.direction === 'CALL' ? 'up' : 'down'} text-xs mr-1`"></i>
                                        {{ op.direction }}
                                                </span>
                                </td>
                                            <td class="py-3 px-4 text-xs text-zenix-text">
                                    {{ op.investment }}
                                </td>
                                            <td :class="['py-3 px-4 text-right text-sm font-bold', op.pnl.startsWith('+') ? 'text-zenix-green' : 'text-zenix-red']">
                                    {{ op.pnl }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                            </div>
                        </div>
                </div>
            </div>

                <!-- Right Column - Config -->
                <div class="col-span-4">
                    <div id="i0k3nl" class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card h-[800px] flex flex-col">
                        <h3 class="text-base font-semibold text-zenix-text mb-6 flex items-center">
                            <i class="fas fa-cogs text-zenix-green text-sm mr-2"></i>
                            Configuração Ativa
                        </h3>
                        <div class="flex-1 flex flex-col justify-between">
                            <!-- Estratégia -->
                            <div class="pb-5 border-b border-zenix-border/50">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-2 tracking-wide uppercase">Estratégia</p>
                                <p class="text-base font-bold text-zenix-text mb-1">{{ strategyName }}</p>
                                <p class="text-xs text-zenix-secondary">Alta performance • Sinais avançados</p>
                            </div>

                            <!-- Mercado -->
                            <div class="py-5 border-b border-zenix-border/50">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-2 tracking-wide uppercase">Mercado</p>
                                <p class="text-base font-bold text-zenix-text mb-1">{{ selectedMarket }}</p>
                                <p class="text-xs text-zenix-secondary">Ticks de alta frequência</p>
                            </div>

                            <!-- Grid de Parâmetros -->
                            <div class="py-5 border-b border-zenix-border/50">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-3 tracking-wide uppercase">Parâmetros</p>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-xs text-zenix-secondary mb-1">Entrada</p>
                                        <p class="text-lg font-bold text-zenix-text" v-if="!isLoadingConfig">{{ sessionConfig.stakeAmount ? '$' + sessionConfig.stakeAmount.toFixed(2) : '$50' }}</p>
                                        <p class="text-lg font-bold text-zenix-text" v-else>Carregando...</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-zenix-secondary mb-1">Modo</p>
                                        <p class="text-lg font-bold text-zenix-text">{{ mode === 'veloz' ? 'Veloz' : mode === 'moderado' ? 'Moderado' : 'Lento' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-zenix-secondary mb-1">Alvo de Lucro</p>
                                        <p class="text-lg font-bold text-zenix-green" v-if="!isLoadingConfig">{{ sessionConfig.profitTarget ? '$' + sessionConfig.profitTarget.toFixed(2) : '$100' }}</p>
                                        <p class="text-lg font-bold text-zenix-green" v-else>Carregando...</p>
                                    </div>
                                    <div>
                                        <p class="text-xs text-zenix-secondary mb-1">Limite de Perda</p>
                                        <p class="text-lg font-bold text-zenix-red" v-if="!isLoadingConfig">{{ sessionConfig.lossLimit ? '$' + sessionConfig.lossLimit.toFixed(2) : '$25' }}</p>
                                        <p class="text-lg font-bold text-zenix-red" v-else>Carregando...</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Gerenciamento -->
                            <div class="py-5 border-b border-zenix-border/50">
                                <p class="text-[10px] text-[#7D7D7D] font-medium mb-2 tracking-wide uppercase">Gerenciamento de Risco</p>
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-base font-bold text-zenix-text mb-1">{{ realRiskLevel }}</p>
                                        <p class="text-xs text-zenix-secondary">Proteção de capital ativa</p>
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
                                    <p class="text-xs text-zenix-secondary">Monitorando em tempo real</p>
                                </div>
                                <!-- Botão Pausar -->
                                <button 
                                    class="w-full py-3 bg-zenix-yellow text-black rounded-xl text-sm font-bold hover:bg-[#FFE07A] transition-all flex items-center justify-center space-x-2"
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
                                <i class="fas fa-brain text-zenix-green text-lg"></i>
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
            activeTab: 'chart', // 'chart' or 'logs'
            tradingViewWidget: null, // Widget da TradingView
            
            selectedMarket: 'EUR/USD',
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
            isLoadingLogs: true,
            
            // Estado de desativação
            isDeactivating: false,
            
            // Controle de tamanho do gráfico
            chartPointsVisible: 200, // Padrão: 200 pontos (Médio)
            chartSizeOptions: [
                { label: 'Pequeno', timeframe: 60, points: 200 },    // M1 - mais detalhado
                { label: 'Médio', timeframe: 300, points: 200 },   // M5 - padrão
                { label: 'Grande', timeframe: 900, points: 200 }    // M15 - menos detalhado
            ],
            timeframeOptions: [
                { label: 'M1', value: 60, points: 200 },
                { label: 'M5', value: 300, points: 200 },
                { label: 'M15', value: 900, points: 200 },
                { label: 'M30', value: 1800, points: 200 },
                { label: 'H1', value: 3600, points: 200 },
                { label: 'H4', value: 14400, points: 200 },
                { label: 'D1', value: 86400, points: 200 }
            ],
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
            // Pode ser dinâmico baseado no estado da IA
            return 'Analisando...';
        },
        currentStatusDescription() {
            // Pode ser dinâmico baseado no estado da IA
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

        // Last update time
        formattedLastUpdate() {
            if (!this.currentPrice || this.ticks.length === 0) {
                return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            }
            return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
    },
    
    methods: {
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
                    
                    // Transformar dados do backend para o formato do frontend
                    const defaultStakeAmount = this.sessionConfig.stakeAmount || this.entryValue || 0;
                    this.logOperations = result.data.map(trade => {
                        // Usar closedAt ou createdAt para o horário (priorizar closedAt)
                        const time = new Date(trade.closedAt || trade.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });
                        
                        // signal pode ser 'CALL' ou 'PUT', contractType também
                        const direction = (trade.signal || trade.contractType || 'CALL').toUpperCase();
                        
                        // profitLoss é o lucro/prejuízo (pode ser null se ainda não finalizou)
                        const profit = parseFloat(trade.profitLoss || 0);
                        const pnl = profit >= 0 ? `+$${profit.toFixed(2)}` : `$${profit.toFixed(2)}`;
                        
                        // Investimento (stakeAmount) - usar do trade ou do default
                        const investment = parseFloat(trade.stakeAmount || defaultStakeAmount || 0);
                        const investmentFormatted = `$${investment.toFixed(2)}`;
                        
                        return {
                            time: time,
                            pair: 'R_10', // Volatility 10 Index
                            direction: direction,
                            investment: investmentFormatted,
                            pnl: pnl
                        };
                    });
                    
                    console.log('[InvestmentActive] ✅ Log formatado:', this.logOperations);
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

            // Limitar aos ticks mais recentes baseado no zoom
            const ticksToUse = sortedTicks.slice(0, Math.min(this.chartPointsVisible * 10, totalTicks));
            
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
            
            // Limitar a quantidade final de velas ao zoom desejado
            // Pegar as últimas N velas (mais recentes)
            const finalCandles = candles.slice(-this.chartPointsVisible);
            
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
                    // Gráfico de linhas: limitar aos pontos mais recentes baseado no zoom
                    const sortedTicks = [...this.ticks]
                        .map(tick => ({
                            time: Math.floor(tick.epoch || tick.time || Date.now() / 1000),
                            value: Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0),
                        }))
                        .filter(point => point.value)
                        .sort((a, b) => a.time - b.time);
                    
                    // Pegar os últimos N pontos baseado no zoom
                    const limitedTicks = sortedTicks.slice(-this.chartPointsVisible);
                    data = limitedTicks;
                }

                if (!data.length) return;

                console.log('[InvestmentActive] Atualizando gráfico com', data.length, this.chartType === 'candles' ? 'velas' : 'pontos');
                this.currentSeries.setData(data);
                
                // Ajustar o gráfico para mostrar todos os dados
                this.chart.timeScale().fitContent();
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao atualizar gráfico:', error);
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
        }
    },

    mounted() {
        console.log('[InvestmentActive] Componente montado. Ticks:', this.ticks.length);
        
        // 📊 Buscar estatísticas do dia
        this.startStatsUpdates();
        
        // 📊 Buscar histórico de operações
        this.fetchTradeHistory();
        
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
    background: radial-gradient(circle at top left, #101010 0%, #0E0E0E 100%);
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

.chart-container {
    width: 100%;
    height: 100%;
    min-height: 600px;
}

/* TradingView Chart Container */
.tradingview-container {
    width: 100%;
    min-height: 500px;
    background: #131722;
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
}

.log-row {
    border-bottom: 1px solid rgba(28, 28, 28, 0.4);
    transition: background-color 0.2s ease;
}

.log-row:hover {
    background-color: rgba(255, 255, 255, 0.05);
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

@media (max-width: 768px) {
    .investment-active-main {
        padding: 1rem 15px;
    }

    .performance-cards-grid {
        grid-template-columns: 1fr;
    }

    .status-card-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .status-card-right {
        width: 100%;
        justify-content: space-between;
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
</style>