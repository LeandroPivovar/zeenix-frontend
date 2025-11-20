<template>
    <div class="main-content-area">

        <main class="main-content">
            <section class="section-vision">
                <div class="ai-vision-title-area">
                    <h1 class="ai-vision-title">IA Orion - Operação Automática Ativa</h1>
                    <p class="ai-vision-subtitle">A IA está monitorando o mercado e executando operações conforme sua configuração.</p>
                </div>
    
                <div class="stat-bar-primary">
                    <div class="stat-card-primary">
                        <p class="stat-label-primary">Lucro da Sessão</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large" :class="sessionProfitLossClass" v-if="!isLoadingStats">{{ formattedSessionProfitLoss }}</p>
                            <p class="stat-value-large text-zenix-secondary" v-else>Carregando...</p>
                            <p class="stat-subtitle-small">Sessão Atual</p>
                        </div>
                    </div>
                    <div class="stat-card-primary">
                        <p class="stat-label-primary">Winrate</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large" v-if="!isLoadingStats">{{ formattedSessionWinrate }}</p>
                            <p class="stat-value-large text-zenix-secondary" v-else>--</p>
                            <p class="stat-subtitle-small text-zenix-green" v-if="!isLoadingStats">{{ sessionWinrateLabel }}</p>
                        </div>
                    </div>
                    <div class="stat-card-primary">
                        <p class="stat-label-primary">Trades</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large" v-if="!isLoadingStats">{{ dailyStats.sessionTrades || 0 }}</p>
                            <p class="stat-value-large text-zenix-secondary" v-else>--</p>
                            <p class="stat-subtitle-small">Operações</p>
                        </div>
                    </div>
                    <div class="stat-card-primary status-indicator-panel">
                        <div class="status-indicator-content">
                            <div class="status-loading-spinner"></div>
                            <p class="status-indicator-text">Analisando</p>
                            <p class="status-indicator-subtext">Aprimoramento possível</p>
                        </div>
                    </div>
                </div>
            </section>
    
            <div class="config-log-grid">
                <div class="config-col-left">
                    <div class="card market-analysis-card">
                        <div class="card-header-flex">
                            <h3 class="card-title-small">Análise de Mercado</h3>
                            <div class="ai-status-pulse pulse-active pulse-small"></div>
                        </div>
                        
                        <div class="chart-controls">
                            <div class="timeframe-selector">
                                <button
                                    v-for="option in timeframeOptions"
                                    :key="option.value"
                                    type="button"
                                    class="timeframe-option"
                                    :class="{ active: option.value === selectedTimeframe }"
                                    @click="setTimeframe(option.value)"
                                >
                                    {{ option.label }}
                                </button>
                            </div>
                        </div>
                        
                        <div ref="chartContainer" class="chart-placeholder"></div>
                    </div>
    
                </div>
    
                <div class="config-col-right">
                    <div class="card sticky-config-card">
                        <div class="card-header-flex">
                            <h3 class="card-title-small">
                                <span>
                                    <img src="../../assets/icons/settings-ia.svg" alt="" width="20px">
                                </span>
                                Configuração Ativa
                            </h3>
                        </div>
    
                        <div class="card-content-spacing-compact">
                            <div class="config-stat-row-half config-card">
                                <div>
                                    <label class="input-label-compact">Estratégia</label>
                                    <p class="config-value-main">{{ strategyName }}</p>
                                    <p class="input-help-text">{{ strategyDescription }}</p>
                                </div>
                                <span v-if="sessionConfig.isActive" class="active-status-tag-mini">Ativa</span>
                                <span v-else class="active-status-tag-mini" style="background: #ef4444;">Inativa</span>
                            </div>
    
                            <div class="config-grid-2x2">
                                <div class="config-card">
                                    <label class="input-label-compact">Entrada</label>
                                    <p class="config-value-main" v-if="!isLoadingConfig">{{ sessionConfig.stakeAmount ? '$' + sessionConfig.stakeAmount.toFixed(2) : 'Não definido' }}</p>
                                    <p class="config-value-main" v-else>Carregando...</p>
                                </div>
                                <div class="config-card">
                                    <label class="input-label-compact">Meta Diária</label>
                                    <p class="config-value-main" v-if="!isLoadingConfig">{{ sessionConfig.profitTarget ? '$' + sessionConfig.profitTarget.toFixed(2) : 'Não definido' }}</p>
                                    <p class="config-value-main" v-else>Carregando...</p>
                                </div>
                                <div class="config-card">
                                    <label class="input-label-compact">Stop Diário</label>
                                    <p class="config-value-main text-zenix-danger" v-if="!isLoadingConfig">{{ sessionConfig.lossLimit ? '$' + sessionConfig.lossLimit.toFixed(2) : 'Não definido' }}</p>
                                    <p class="config-value-main text-zenix-danger" v-else>Carregando...</p>
                                </div>
                                <div class="config-card">
                                    <label class="input-label-compact">Timeframe</label>
                                    <p class="config-value-main">M5</p>
                                </div>
                            </div>
    
                            <div class="risk-summary config-card">
                                <div class="risk-display-area">
                                    <div class="title-risk-display">
                                        <label class="input-label-compact">Gerenciamento</label>
                                        <p :class="['config-value-main', realRiskLevel === 'Agressivo' ? 'text-zenix-danger' : 'text-zenix-green']" v-if="!isLoadingConfig">{{ realRiskLevel }}</p>
                                        <p class="config-value-main" v-else>Carregando...</p>
                                    </div>
                                    <div class="risk-progress-bar-container">
                                        <div 
                                            class="risk-progress-bar" 
                                            :style="{ width: realRiskPercentage }"
                                        ></div>
                                    </div>
                                    <p class="input-help-text">Risco: {{ realRiskLabel }}</p>
                                </div>
                            </div>
                        
                            <div class="risk-indicator-box-small">
                                <p class="risk-indicator-header-small">
                                    <i class="fas fa-chart-pie mr-2"></i> Risco Estimado
                                </p>
                                <p class="risk-indicator-value" v-if="!isLoadingConfig">{{ realEstimatedRiskLabel }}</p>
                                <p class="risk-indicator-value" v-else>Carregando...</p>
                                <p class="input-help-text-dark">Por operação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card full-height-card">
                <div class="card-header-flex">
                    <h3 class="card-title-small mb-0">Log de Operações</h3>
                    <button 
                        class="btn btn-secondary" 
                        @click="fetchTradeHistory"
                        :disabled="isLoadingLogs"
                        style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;"
                    >
                        <i class="fa-solid fa-rotate-right" :class="{ 'fa-spin': isLoadingLogs }"></i>
                        {{ isLoadingLogs ? 'Atualizando...' : 'Atualizar' }}
                    </button>
                </div>
            
                <div class="log-table-container">
                    <div v-if="isLoadingLogs" class="loading-logs">
                        <p>Carregando histórico de operações...</p>
                    </div>
                    
                    <div v-else-if="logOperations.length === 0" class="no-logs">
                        <p>Nenhuma operação executada ainda.</p>
                    </div>
                    
                    <table v-else>
                        <thead>
                            <tr>
                                <th>Horário</th>
                                <th>Par</th>
                                <th>Direção</th>
                                <th>Resultado</th>
                                <th>P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(op, index) in logOperations" :key="index">
                                <td>
                                    <p>{{ op.time }}</p>
                                    <span class="input-help-text-dark">${{ entryValue }}</span>
                                </td>
                                <td>{{ op.pair }}</td>
                                
                                <td>
                                    <div :class="['op-direction', op.direction === 'CALL' ? 'text-zenix-green' : 'text-zenix-danger']">
                                        <i :class="`fas fa-arrow-${op.direction === 'CALL' ? 'up' : 'down'} mr-1`"></i>
                                        {{ op.direction }}
                                    </div>
                                </td>
                                
                                <td>
                                    <div :class="['op-result', op.result === 'WIN' ? 'text-zenix-green' : 'text-zenix-danger']">
                                        <i :class="`fas fa-${op.result === 'WIN' ? 'check' : 'times'} mr-1`"></i>
                                        {{ op.result }}
                                    </div>
                                </td>
                                
                                <td :class="['op-pnl', op.pnl.startsWith('+') ? 'text-zenix-green' : 'text-zenix-danger']">
                                    {{ op.pnl }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div :class="['operation-status-footer', aiActive ? 'status-active-footer' : 'status-inactive-footer']">
                <div class="status-content">
                    <div class="status-main-box">
                        <span><img src="../../assets/icons/brain.svg" alt="IA Ativa" width="20px"></span>

                        <div class="">
                            <p class="status-main-text">IA Operando Normalmente</p>
                            <p class="status-sub-text">Monitorando sinais de mercado e executando operações conforme estratégia.</p>
                        </div>
                    </div>
                </div>
                <div :class="aiActive ? 'text-zenix-green-background' : 'text-zenix-red-background'">
                    <span class="status-online-tag">{{ aiActive ? 'ONLINE' : 'OFFLINE' }}</span>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';

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
            candleSeries: null,
            chartInitialized: false,
            accountType: 'real',
            selectedTimeframe: 60, // 1 minuto
            timeframeOptions: [
                { label: '1m', value: 60 },
                { label: '2m', value: 120 },
                { label: '5m', value: 300 },
                { label: '15m', value: 900 }
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
            aiActive: true,
            showDisconnectModal: false,
            
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
        aggregateTicksToCandles(timeframeSeconds) {
            if (!Array.isArray(this.ticks) || this.ticks.length === 0) {
                return [];
            }

            const sortedTicks = [...this.ticks].sort((a, b) => {
                const timeA = Math.floor(a.epoch || a.time || 0);
                const timeB = Math.floor(b.epoch || b.time || 0);
                return timeA - timeB;
            });

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
                const rawTime = Math.floor(tick.epoch || tick.time || Date.now() / 1000);
                const price = Number(tick.value ?? tick.price ?? tick.quote ?? tick.close ?? 0);
                if (!price) continue;

                const bucket = Math.floor(rawTime / timeframeSeconds) * timeframeSeconds;

                if (bucketStart === null) {
                    bucketStart = bucket;
                }

                if (bucket !== bucketStart) {
                    finalizeBucket();
                    bucketStart = bucket;
                    bucketTicks = [];
                }

                bucketTicks.push({ time: rawTime, price });
            }

            finalizeBucket();
            return candles;
        },
        // Métodos para gráfico
        initChart() {
            if (this.chartInitialized || !this.$refs.chartContainer) {
                return;
            }

            try {
                const container = this.$refs.chartContainer;
                const containerWidth = container.offsetWidth || 800;
                const containerHeight = 400; // Aumentado de 350 para 400 (gráfico maior)

                console.log('[InvestmentActive] Inicializando gráfico...', {
                    width: containerWidth,
                    height: containerHeight,
                    ticksCount: this.ticks.length
                });

                this.chart = createChart(container, {
                    width: containerWidth,
                    height: containerHeight,
                    localization: { locale: 'pt-BR' },
                    layout: {
                        background: { type: ColorType.Solid, color: '#1a1a1a' },
                        textColor: '#f0f0f0',
                    },
                    rightPriceScale: {
                        borderVisible: false,
                    },
                    timeScale: {
                        borderVisible: false,
                        timeVisible: true,
                        secondsVisible: true,
                    },
                    grid: {
                        vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
                        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
                    },
                    crosshair: {
                        mode: 1,
                    },
                });

                this.candleSeries = this.chart.addCandlestickSeries({
                    upColor: '#22C55E',
                    borderUpColor: '#22C55E',
                    wickUpColor: '#22C55E',
                    downColor: '#ef4444',
                    borderDownColor: '#ef4444',
                    wickDownColor: '#ef4444',
                    priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
                });

                this.chartInitialized = true;
                console.log('[InvestmentActive] ✅ Gráfico inicializado');
                this.updateChart();
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao inicializar gráfico:', error);
            }
        },

        updateChart() {
            if (!this.chartInitialized || !this.candleSeries || this.ticks.length === 0) {
                return;
            }

            try {
                const candles = this.aggregateTicksToCandles(this.selectedTimeframe);
                if (!candles.length) {
                    return;
                }

                console.log('[InvestmentActive] Atualizando gráfico com', candles.length, 'velas');
                this.candleSeries.setData(candles);
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
                if (newTicks && newTicks.length > 0) {
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
        selectedTimeframe() {
            if (this.chartInitialized) {
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
        
        if (this.chart) {
            this.chart.remove();
        }
    }
};
</script>

<style src="../../assets/css/components/ActiveView.css"></style>