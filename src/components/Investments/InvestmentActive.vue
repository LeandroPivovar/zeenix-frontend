<template>
    <div class="investment-active-wrapper">
        <main class="investment-active-main">
            <!-- Performance Summary Cards -->
            <div id="performance-summary" class="performance-summary-section">
                <div class="performance-cards-grid">
                    <!-- Card 1 - Saldo Total -->
                    <div class="premium-card performance-card">
                        <div class="card-header-row">
                            <span class="card-label">Saldo Total</span>
                            <button class="eye-btn" @click="balanceVisible = !balanceVisible">
                                <i :class="balanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
                            </button>
                </div>
                        <div class="card-value-large">
                            <span v-if="!isLoadingStats && accountBalanceProp" class="balance-value" :class="{ 'hidden-value': !balanceVisible }">
                                {{ formattedBalance }}
                            </span>
                            <span v-else class="text-zenix-secondary">Carregando...</span>
                        </div>
                        <div class="card-actions-row">
                            <button :class="['account-type-btn', accountType === 'real' ? 'active' : '']" @click="accountType = 'real'">Real</button>
                            <button :class="['account-type-btn', accountType === 'demo' ? 'active' : '']" @click="accountType = 'demo'">Demo</button>
                    </div>
                        </div>

                    <!-- Card 2 - Lucro do Dia -->
                    <div class="premium-card performance-card">
                        <div class="card-header-row">
                            <span class="card-label">Lucro do Dia</span>
                            <button class="eye-btn" @click="profitVisible = !profitVisible">
                                <i :class="profitVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
                            </button>
                    </div>
                        <div class="card-value-large">
                            <span v-if="!isLoadingStats" :class="['profit-value', sessionProfitLossClass, { 'hidden-value': !profitVisible }]">
                                {{ formattedSessionProfitLoss }}
                            </span>
                            <span v-else class="text-zenix-secondary">--</span>
                        </div>
                        <span v-if="!isLoadingStats && profitPercentage" class="profit-percentage text-zenix-green text-sm font-medium">{{ profitPercentage }}</span>
                    </div>

                    <!-- Card 3 - Winrate -->
                    <div class="premium-card performance-card">
                        <div class="card-header-row">
                            <span class="card-label">Winrate</span>
                            <button class="eye-btn" @click="winrateVisible = !winrateVisible">
                                <i :class="winrateVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
                            </button>
                        </div>
                        <div class="card-value-large">
                            <span v-if="!isLoadingStats" class="winrate-value" :class="{ 'hidden-value': !winrateVisible }">
                                {{ formattedSessionWinrate }}
                            </span>
                            <span v-else class="text-zenix-secondary">--</span>
                    </div>
                        <span v-if="!isLoadingStats" class="text-xs text-zenix-green font-medium">{{ sessionWinrateLabel }}</span>
                </div>

                    <!-- Card 4 - Trades Hoje -->
                    <div class="premium-card performance-card">
                        <div class="card-header-row">
                            <span class="card-label">Trades Hoje</span>
                            <button class="eye-btn" @click="tradesVisible = !tradesVisible">
                                <i :class="tradesVisible ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
                                </button>
                            </div>
                        <div class="card-value-large">
                            <span v-if="!isLoadingStats" class="trades-value" :class="{ 'hidden-value': !tradesVisible }">
                                {{ dailyStats.sessionTrades || 0 }}
                            </span>
                            <span v-else class="text-zenix-secondary">--</span>
                            </div>
                        <div class="trades-stats-row">
                            <span class="text-xs text-zenix-green font-medium">{{ dailyStats.sessionWins || 0 }} Vitórias</span>
                            <span class="text-xs text-zenix-red/70 font-medium">{{ dailyStats.sessionLosses || 0 }} Perdas</span>
                        </div>
                    </div>
                </div>
    
                <!-- Status da IA Card -->
                <div class="premium-card status-card">
                    <div class="status-card-content">
                        <div class="status-card-left">
                            <div id="ai-status-widget" class="ai-status-widget">
                                <div class="ai-status-bg"></div>
                                <div id="status-analyzing" class="ai-status-content">
                                    <div class="ai-status-spinner-wrapper">
                                        <div class="ai-status-pulse-bg"></div>
                                        <div class="ai-status-spinner">
                                            <svg fill="none" viewBox="0 0 24 24" class="spinner-svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="20 60" opacity="0.3"></circle>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="15 65" stroke-linecap="round"></circle>
                                            </svg>
                        </div>
                                </div>
                            </div>
                                </div>
                            <div class="status-text-content">
                                <h3 class="status-title">Status da Operação</h3>
                                <div class="status-subtitle-row">
                                    <span class="status-indicator-text text-[#FFD058] font-medium">Analisando</span>
                                    <span class="status-indicator-dot">•</span>
                                    <span class="status-indicator-subtext">Aguardando padrão de entrada</span>
                                </div>
                                </div>
                                </div>
                        <div class="status-card-right">
                            <div class="ai-online-indicator">
                                <div class="ai-pulse-dot"></div>
                                <span class="text-xs font-medium text-zenix-green">IA Online</span>
                            </div>
                            <button 
                                class="deactivate-ai-btn-new" 
                                @click="handleDeactivate"
                                :disabled="isDeactivating"
                                title="Desativar IA"
                            >
                                <i class="fas fa-power-off"></i>
                                <span>{{ isDeactivating ? 'Desativando...' : 'Desativar IA' }}</span>
                            </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        
            <!-- Main Content Grid -->
            <div class="main-content-grid">
                <!-- Left Column - Chart -->
                <div class="chart-column">
                    <div class="premium-card market-chart-card">
                        <div class="chart-header">
                            <div>
                                <h2 class="chart-title">Análise de Mercado</h2>
                                <p class="chart-subtitle">EUR/USD • M5 • Última atualização: {{ formattedLastUpdate }}</p>
                            </div>
                            <div class="chart-tabs">
                                <button 
                                    id="tab-chart" 
                                    :class="['chart-tab-btn', activeTab === 'chart' ? 'active' : '']"
                                    @click="activeTab = 'chart'"
                                >
                                    Gráfico
                                    <div v-if="activeTab === 'chart'" class="tab-indicator"></div>
                                </button>
                                <button 
                                    id="tab-logs" 
                                    :class="['chart-tab-btn', activeTab === 'logs' ? 'active' : '']"
                                    @click="activeTab = 'logs'"
                                >
                                    Logs
                                </button>
                        </div>
                    </div>
                        
                        <!-- Chart Type Buttons -->
                        <div class="chart-type-buttons">
                            <button
                                v-for="option in chartTypeOptions"
                                :key="option.value"
                                :class="['chart-type-btn', { 'active': chartType === option.value }]"
                                @click="setChartType(option.value)"
                            >
                                {{ option.label }}
                            </button>
            </div>

                        <div class="timeframe-buttons">
                    <button 
                                v-for="option in timeframeOptionsFormatted"
                                :key="option.value"
                                :class="['timeframe-btn', { 'active': option.value === selectedTimeframe }]"
                                :disabled="chartType !== 'candles'"
                                @click="setTimeframe(option.value)"
                            >
                                {{ option.label }}
                    </button>
                </div>
            
                        <!-- Chart View -->
                        <div v-show="activeTab === 'chart'" id="chart-view" class="chart-view-container">
                            <div ref="chartContainer" id="tradingview-chart" class="chart-container tradingview-container"></div>
                        </div>

                        <!-- Logs View -->
                        <div v-show="activeTab === 'logs'" id="logs-view" class="logs-view-container">
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
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Par</th>
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Direção</th>
                                            <th class="text-left py-3 px-4 text-xs font-medium text-zenix-secondary">Resultado</th>
                                            <th class="text-right py-3 px-4 text-xs font-medium text-zenix-secondary">P&L</th>
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
                                            <td class="py-3 px-4">
                                                <span :class="['result-badge', op.result === 'WIN' ? 'win-badge' : 'loss-badge']">
                                                    <i :class="`fas fa-${op.result === 'WIN' ? 'check' : 'times'} text-xs mr-1`"></i>
                                        {{ op.result }}
                                                </span>
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
                <div class="config-column">
                    <div class="premium-card config-card-sticky">
                        <h3 class="config-card-title">
                            <i class="fas fa-cogs text-zenix-green text-sm mr-2"></i>
                            Configuração Ativa
                        </h3>
                        <div class="config-content">
                            <!-- Estratégia -->
                            <div class="config-section">
                                <div class="config-label">
                                    Estratégia
                                    <div class="tooltip-container">
                                        <svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <span class="tooltip-text">Modelo de análise usado pela IA</span>
                                    </div>
                                </div>
                                <p class="config-value-main">{{ strategyName }}</p>
                                <p class="config-description">Alta performance • Sinais avançados</p>
                            </div>

                            <!-- Mercado -->
                            <div class="config-section">
                                <div class="config-label">
                                    Mercado
                                    <div class="tooltip-container">
                                        <svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <span class="tooltip-text">Escolha o ativo que deseja operar.</span>
                                    </div>
                                </div>
                                <p class="config-value-main">Volatility 10 Index</p>
                                <p class="config-description">Ticks de alta frequência</p>
                        </div>

                            <!-- Parâmetros -->
                            <div class="config-section">
                                <p class="config-label">Parâmetros</p>
                                <div class="config-params-grid">
                                    <div>
                                        <p class="param-label">Entrada</p>
                                        <p class="param-value" v-if="!isLoadingConfig">{{ sessionConfig.stakeAmount ? '$' + sessionConfig.stakeAmount.toFixed(2) : '$50' }}</p>
                                        <p class="param-value" v-else>Carregando...</p>
                    </div>
                                    <div>
                                        <p class="param-label">Modo</p>
                                        <p class="param-value">{{ mode === 'veloz' ? 'Veloz' : mode === 'moderado' ? 'Moderado' : 'Devagar' }}</p>
                </div>
                                    <div>
                                        <p class="param-label">Alvo de Lucro</p>
                                        <p class="param-value text-zenix-green" v-if="!isLoadingConfig">{{ sessionConfig.profitTarget ? '$' + sessionConfig.profitTarget.toFixed(2) : '$100' }}</p>
                                        <p class="param-value" v-else>Carregando...</p>
                </div>
                                    <div>
                                        <p class="param-label">Limite de Perda</p>
                                        <p class="param-value text-zenix-red" v-if="!isLoadingConfig">{{ sessionConfig.lossLimit ? '$' + sessionConfig.lossLimit.toFixed(2) : '$25' }}</p>
                                        <p class="param-value" v-else>Carregando...</p>
            </div>
                                </div>
                            </div>

                            <!-- Gerenciamento de Risco -->
                            <div class="config-section">
                                <p class="config-label">Gerenciamento de Risco</p>
                                <div class="risk-management-row">
                                    <div>
                                        <p class="config-value-main">{{ realRiskLevel }}</p>
                                        <p class="config-description">Proteção de capital ativa</p>
                                    </div>
                                    <div class="risk-level-badge">
                                        <p class="text-xs font-bold text-zenix-green">{{ realRiskLabel }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Status da IA -->
                            <div class="config-section-last">
                                <p class="config-label">Status da IA</p>
                                <div class="ai-status-row">
                                    <div class="ai-status-info">
                                        <div class="ai-pulse-dot"></div>
                                        <p class="config-value-main text-zenix-green">Ativa</p>
                                    </div>
                                    <p class="config-description">Monitorando em tempo real</p>
                                </div>
                                <button 
                                    class="pause-ai-btn"
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
            selectedTimeframe: 300, // 5 minutos (M5)
            timeframeOptions: [
                { label: 'M1', value: 60 },
                { label: 'M5', value: 300 },
                { label: 'M15', value: 900 },
                { label: 'M30', value: 1800 },
                { label: 'H1', value: 3600 },
                { label: 'H4', value: 14400 },
                { label: 'D1', value: 86400 }
            ],
            
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

        // Timeframe options formatted
        timeframeOptionsFormatted() {
            return this.timeframeOptions;
        },

        // Formatted balance
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
                    this.logOperations = result.data.map(trade => {
                        // Usar closedAt ou createdAt para o horário (priorizar closedAt)
                        const time = new Date(trade.closedAt || trade.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });
                        
                        // signal pode ser 'CALL' ou 'PUT', contractType também
                        const direction = (trade.signal || trade.contractType || 'CALL').toUpperCase();
                        
                        // status é 'WON', 'LOST', 'PENDING', 'ACTIVE', 'ERROR'
                        let result_trade;
                        if (trade.status === 'WON') {
                            result_trade = 'WIN';
                        } else if (trade.status === 'LOST') {
                            result_trade = 'LOSS';
                        } else {
                            result_trade = trade.status; // PENDING, ACTIVE, ERROR
                        }
                        
                        // profitLoss é o lucro/prejuízo (pode ser null se ainda não finalizou)
                        const profit = parseFloat(trade.profitLoss || 0);
                        const pnl = profit >= 0 ? `+$${profit.toFixed(2)}` : `$${profit.toFixed(2)}`;
                        
                        return {
                            time: time,
                            pair: 'R_10', // Volatility 10 Index
                            direction: direction,
                            result: result_trade,
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

        setTimeframe(value) {
            if (this.selectedTimeframe !== value) {
                this.selectedTimeframe = value;
            }
        },
        setChartType(type) {
            if (this.chartType !== type) {
                this.chartType = type;
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

            // Ordenar por tempo
            const sortedTicks = [...validTicks].sort((a, b) => a.time - b.time);
            const totalTicks = sortedTicks.length;

            // Calcular timeframe adaptativo para manter aproximadamente a mesma quantidade de velas que ticks
            // Objetivo: ter pelo menos 80% da quantidade de ticks em velas
            let effectiveTimeframe = timeframeSeconds;
            
            // Estimar quantas velas teremos com o timeframe solicitado
            const estimatedCandles = Math.max(1, Math.floor(totalTicks / Math.max(1, timeframeSeconds)));
            
            // Se o timeframe resultar em muito poucas velas (menos de 80% dos ticks), ajustar
            if (estimatedCandles < totalTicks * 0.8 && totalTicks > 0) {
                // Calcular timeframe que resulte em aproximadamente 90% da quantidade de ticks
                effectiveTimeframe = Math.max(1, Math.floor(totalTicks / (totalTicks * 0.9)));
            }

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

            for (const tick of sortedTicks) {
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
            
            return candles;
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
                // Gráfico de velas com aparência similar ao Pine Script
                // Verde para altas, vermelho para baixas, preto como fundo
                this.currentSeries = this.chart.addCandlestickSeries({
                    upColor: '#22C55E',           // Cor do corpo da vela de alta (verde)
                    downColor: '#FF4747',         // Cor do corpo da vela de baixa (vermelho)
                    borderVisible: true,
                    borderUpColor: '#22C55E',     // Borda da vela de alta
                    borderDownColor: '#FF4747',   // Borda da vela de baixa
                    wickUpColor: '#22C55E',       // Cor do pavio superior de alta
                    wickDownColor: '#FF4747',     // Cor do pavio inferior de baixa
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
                const containerWidth = container.offsetWidth || 800;
                const containerHeight = 400;

                console.log('[InvestmentActive] Inicializando gráfico lightweight-charts...', {
                    width: containerWidth,
                    height: containerHeight,
                    ticksCount: this.ticks.length
                });

                this.chart = createChart(container, {
                    width: containerWidth,
                    height: containerHeight,
                    localization: { locale: 'pt-BR' },
                    layout: {
                        background: { type: ColorType.Solid, color: '#131722' },
                        textColor: '#a9b2b8',
                    },
                    rightPriceScale: {
                        borderColor: '#363c4e',
                        scaleMargins: {
                            top: 0.1,
                            bottom: 0.1,
                        },
                    },
                    leftPriceScale: {
                        visible: false,
                    },
                    timeScale: {
                        borderColor: '#363c4e',
                        timeVisible: true,
                        secondsVisible: false,
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
                    // Usar o timeframe selecionado, mas a função aggregateTicksToCandles
                    // já ajusta automaticamente para manter aproximadamente a mesma quantidade de pontos
                    data = this.aggregateTicksToCandles(this.selectedTimeframe);
                } else {
                    // Gráfico de linhas usa todos os ticks disponíveis
                    data = this.ticks.map(tick => ({
                        time: Math.floor(tick.epoch || tick.time || Date.now() / 1000),
                        value: Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0),
                    })).filter(point => point.value);
                }

                if (!data.length) return;

                console.log('[InvestmentActive] Atualizando gráfico com', data.length, this.chartType === 'candles' ? 'velas' : 'pontos');
                this.currentSeries.setData(data);
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
    padding: 1.5rem 20px;
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
    letter-spacing: 2px;
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

.timeframe-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.timeframe-btn {
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

.timeframe-btn:hover:not(:disabled) {
    border-color: #22C55E;
    color: #22C55E;
}

.timeframe-btn.active {
    background-color: #22C55E;
    color: #000;
    border-color: #22C55E;
    font-weight: 700;
}

.timeframe-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.chart-view-container {
    height: 400px;
}

.chart-container {
    width: 100%;
    height: 100%;
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
.status-footer-card {
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
</style>