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
                    
                        <p class="chart-subtitle">{{ selectedMarket }} • M5 • Última atualização: 14:32:15</p>
    
                        <div class="chart-placeholder">
                            <svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <polyline fill="none" stroke="#22C55E" stroke-width="1" points="0,80 10,75 20,85 30,70 40,65 50,75 60,60 70,55 80,40 90,45 100,30" />
                            </svg>
                            <div class="chart-point"></div>
                            <span class="chart-text-placeholder">Gráfico em tempo real (não implementado)</span>
                        </div>
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
                    <table>
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
                                    <span class="input-help-text-dark">$50.00</span>
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
            
            entryValue: 50,
            profitTarget: 100,
            lossLimit: 25,
            
            tradingModes: ['Veloz', 'Moderado', 'Devagar'],
            riskLevels: ['Fixo', 'Conservador', 'Moderado', 'Agressivo'],
            
            // Log de operações com os valores P&L da imagem
            logOperations: [
                { time: '16:32:15', pair: 'EUR/USD', direction: 'CALL', result: 'WIN', pnl: '+$12.50' },
                { time: '16:25:42', pair: 'GBP/USD', direction: 'PUT', result: 'LOSS', pnl: '-$8.30' },
                { time: '16:18:23', pair: 'USD/JPY', direction: 'CALL', result: 'WIN', pnl: '+$15.75' }, 
                { time: '16:12:18', pair: 'AUD/USD', direction: 'PUT', result: 'WIN', pnl: '+$11.30' }, 
                { time: '16:05:55', pair: 'EUR/GBP', direction: 'CALL', result: 'WIN', pnl: '+$8.85' },
            ],
        };
    },
    
    computed: {
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

        // Métodos para gráfico
        initChart() {
            if (this.chartInitialized || !this.$refs.chartContainer) {
                return;
            }

            try {
                const container = this.$refs.chartContainer;
                const containerWidth = container.offsetWidth || 800;
                const containerHeight = 350;

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