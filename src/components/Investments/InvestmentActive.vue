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
                        <p class="stat-label-primary">Lucro do Dia</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large text-zenix-green">+$247,50</p>
                            <p class="stat-subtitle-small text-zenix-green">+1,34%</p>
                        </div>
                    </div>
                    <div class="stat-card-primary">
                        <p class="stat-label-primary">Winrate</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large">78%</p>
                            <p class="stat-subtitle-small text-zenix-green">Excelente</p>
                        </div>
                    </div>
                    <div class="stat-card-primary">
                        <p class="stat-label-primary">Trades</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large">23</p>
                            <p class="stat-subtitle-small">Operações</p>
                        </div>
                    </div>
                    <div class="stat-card-primary">
                        <p class="stat-label-primary">Volume</p>
                        <div class="stat-value-area">
                            <p class="stat-value-large">$450</p>
                            <p class="stat-subtitle-small">Operado</p>
                        </div>
                    </div>
                    <div class="stat-card-primary status-indicator-panel">
                        <div class="status-indicator-content">
                            <div class="ai-status-pulse pulse-active pulse-large"></div>
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
                                    <p class="config-value-main">IA Orion</p>
                                    <p class="input-help-text">Alta Performance</p>
                                </div>
                                <span class="active-status-tag-mini">Ativa</span>
                            </div>
    
                            <div class="config-grid-2x2">
                                <div class="config-card">
                                    <label class="input-label-compact">Entrada</label>
                                    <p class="config-value-main">{{ entryValue ? '$' + entryValue : 'Não definido' }}</p>
                                </div>
                                <div class="config-card">
                                    <label class="input-label-compact">Meta Diária</label>
                                    <p class="config-value-main">{{ profitTarget ? '$' + profitTarget : 'Não definido' }}</p>
                                </div>
                                <div class="config-card">
                                    <label class="input-label-compact">Stop Diário</label>
                                    <p class="config-value-main text-zenix-danger">{{ lossLimit ? '$' + lossLimit : 'Não definido' }}</p>
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
                                        <p :class="['config-value-main', selectedRisk === 'Agressivo' ? 'text-zenix-danger' : 'text-zenix-green']">{{ selectedRisk }}</p>
                                    </div>
                                    <div class="risk-progress-bar-container">
                                        <div 
                                            class="risk-progress-bar" 
                                            :style="{ width: riskPercentage }"
                                        ></div>
                                    </div>
                                    <p class="input-help-text">Risco: {{ riskLabel }}</p>
                                </div>
                            </div>
                        
                            <div class="risk-indicator-box-small">
                                <p class="risk-indicator-header-small">
                                    <i class="fas fa-chart-pie mr-2"></i> Risco Estimado
                                </p>
                                <p class="risk-indicator-value">2.5% do capital</p>
                                <p class="input-help-text-dark">Por operação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card full-height-card">
                <h3 class="card-title-small mb-4">Log de Operações</h3>
            
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
        }
    },
    data() {
        return {
            chart: null,
            lineSeries: null,
            chartInitialized: false,
            accountType: 'real',
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
            
            // Log de operações (será carregado via API)
            logOperations: [],
            isLoadingLogs: true,
        };
    },
    
    computed: {
        // Usar valores das props (configuração real do usuário)
        entryValue() {
            return this.entryValueConfig;
        },
        profitTarget() {
            return this.profitTargetConfig;
        },
        lossLimit() {
            return this.lossLimitConfig;
        },
        mode() {
            return this.modeConfig;
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
        toggleAI() {
            this.aiActive = !this.aiActive;
        },
        
        disconnect() {
            console.log('Desconectando da Deriv...');
            this.aiActive = false;
            this.showDisconnectModal = false;
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

        // 🔑 Obter userId do localStorage
        getUserId() {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return user.id || null;
            } catch (error) {
                console.error('[InvestmentActive] Erro ao parsear user:', error);
                return null;
            }
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

                this.lineSeries = this.chart.addAreaSeries({
                    lineColor: '#22C55E',
                    topColor: 'rgba(34, 197, 94, 0.2)',
                    bottomColor: 'rgba(34, 197, 94, 0.02)',
                    lineWidth: 2,
                    priceFormat: {
                        type: 'price',
                        precision: 2,
                        minMove: 0.01,
                    },
                });

                this.chartInitialized = true;
                console.log('[InvestmentActive] ✅ Gráfico inicializado');
                this.updateChart();
            } catch (error) {
                console.error('[InvestmentActive] ❌ Erro ao inicializar gráfico:', error);
            }
        },

        updateChart() {
            if (!this.chartInitialized || !this.lineSeries || this.ticks.length === 0) {
                return;
            }

            try {
                const data = this.ticks.map(tick => ({
                    time: Math.floor(tick.epoch || Date.now() / 1000),
                    value: tick.value || tick.price || 0,
                }));

                console.log('[InvestmentActive] Atualizando gráfico com', data.length, 'pontos');
                this.lineSeries.setData(data);
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
        }
    },

    mounted() {
        console.log('[InvestmentActive] Componente montado. Ticks:', this.ticks.length);
        
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
        if (this.chart) {
            this.chart.remove();
        }
    }
};
</script>

<style src="../../assets/css/components/ActiveView.css"></style>