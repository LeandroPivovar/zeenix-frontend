<template>
	<div class="layout-content-agent-autonomo">
		<!-- New Header with Date Selector -->
		<div class="agent-new-header">
			<div class="header-left">
				<h1 class="header-title">Agente Autônomo</h1>
				<p class="header-subtitle">Dados baseados no período selecionado</p>
			</div>
			<div class="header-right">
				<div class="date-selector">
					<i class="fas fa-calendar-alt"></i>
					<span>{{ dateRangeText }}</span>
					<i class="fas fa-chevron-down"></i>
				</div>
				<button class="hide-values-btn">
					<i class="fas fa-eye-slash"></i>
					Ocultar valores
				</button>
				<button @click="pausarAgenteEIrParaTopo" class="pause-btn-new">
					<i class="fas fa-pause"></i>
					PAUSAR AGENTE
				</button>
			</div>
		</div>

		<!-- New Metrics Grid (4 cards) -->
		<div class="new-metrics-grid">
			<div class="new-metric-card">
				<div class="metric-header">
					<i class="fas fa-wallet metric-icon-small"></i>
					<span class="metric-label-small">CAPITAL INICIAL</span>
				</div>
				<div class="metric-value-large">${{ initialCapital.toFixed(2) }}</div>
				<div class="metric-secondary">R$ {{ (initialCapital * 5.19).toFixed(3) }}</div>
			</div>

			<div class="new-metric-card">
				<div class="metric-header">
					<i class="fas fa-chart-line metric-icon-small"></i>
					<span class="metric-label-small">CAPITAL FINAL</span>
				</div>
				<div class="metric-value-large positive">${{ finalCapital.toFixed(2) }}</div>
				<div class="metric-secondary">R$ {{ (finalCapital * 5.19).toFixed(3) }}</div>
			</div>

			<div class="new-metric-card highlight-card">
				<div class="metric-header">
					<i class="fas fa-arrow-trend-up metric-icon-small"></i>
					<span class="metric-label-small">LUCRO DO PERÍODO</span>
				</div>
				<div class="metric-value-large positive">+${{ periodProfit.toFixed(2) }}</div>
				<div class="metric-footer">
					<span class="metric-secondary">R$ {{ (periodProfit * 5.19).toFixed(3) }}</span>
					<span class="metric-badge positive">+{{ periodProfitPercent.toFixed(2) }}%</span>
				</div>
			</div>

			<div class="new-metric-card">
				<div class="metric-header">
					<i class="fas fa-calendar-day metric-icon-small"></i>
					<span class="metric-label-small">LUCRO MÉDIO/DIA</span>
				</div>
				<div class="metric-value-large positive">+${{ avgDailyProfit.toFixed(2) }}</div>
				<div class="metric-secondary">$25,03/op</div>
			</div>
		</div>

		<!-- Additional Metrics Row -->
		<div class="additional-metrics-row">
			<div class="additional-metric">
				<span class="additional-label">
					<img src="../../assets/icons/brain.svg" alt="" width="16px">
					Estratégia
				</span>
				<span class="additional-value">{{ agenteData.estrategia }}</span>
			</div>
			<div class="additional-metric">
				<span class="additional-label">
					<i class="fas fa-chart-line"></i>
					Resultado do Dia
				</span>
				<span :class="['additional-value', (sessionStats?.netProfit || 0) >= 0 ? 'positive' : 'negative']">
					{{ (sessionStats?.netProfit || 0) >= 0 ? '+' : '' }}${{ (sessionStats?.netProfit || 0).toFixed(2) }}
				</span>
			</div>
			<div class="additional-metric">
				<span class="additional-label">
					<i class="fas fa-list"></i>
					Operações Hoje
				</span>
				<span class="additional-value">{{ operacoesHojeDisplay }}</span>
			</div>
			<div class="additional-metric">
				<span class="additional-label">
					<i class="fas fa-clock"></i>
					Tempo Ativo
				</span>
				<span class="additional-value">{{ tempoAtivoDisplay }}</span>
			</div>
		</div>

		<!-- Performance Chart Section -->
		<div class="performance-chart-section">
			<div class="chart-header">
				<div class="chart-title-wrapper">
					<i class="fas fa-chart-area"></i>
					<span class="chart-title">PERFORMANCE</span>
				</div>
				<div class="chart-period-selector">
					<button :class="['period-btn', { active: selectedPeriod === '30d' }]" @click="selectedPeriod = '30d'">30 dias</button>
				</div>
			</div>
			<div class="chart-container">
				<div ref="performanceChartContainer" class="performance-chart"></div>
			</div>
			<div class="chart-indicators">
				<div class="indicator positive">
					<span class="indicator-label">Melhor dia:</span>
					<span class="indicator-value">+${{ bestDay.value.toFixed(2) }} ({{ bestDay.date }})</span>
				</div>
				<div class="indicator negative">
					<span class="indicator-label">Pior dia:</span>
					<span class="indicator-value">-${{ worstDay.value.toFixed(2) }} ({{ worstDay.date }})</span>
				</div>
			</div>
		</div>

		<!-- Distribution Tables Section -->
		<div class="distribution-section">
			<div class="distribution-header">
				<i class="fas fa-table"></i>
				<span>DISTRIBUIÇÃO DIÁRIA DE PERFORMANCE</span>
			</div>

			<!-- Weekly Summary Table -->
			<div class="table-wrapper">
				<h3 class="table-subtitle">RESUMO SEMANAL</h3>
				<table class="distribution-table">
					<thead>
						<tr>
							<th>SEMANA</th>
							<th>LUCRO</th>
							<th>CAPITAL FINAL</th>
							<th>%</th>
							<th>OPS</th>
							<th>WIN RATE</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="week in weeklyData" :key="week.period">
							<td>{{ week.period }}</td>
							<td :class="week.profit >= 0 ? 'positive' : 'negative'">
								{{ week.profit >= 0 ? '+' : '' }}${{ week.profit.toFixed(2) }}
							</td>
							<td>${{ week.finalCapital.toFixed(2) }}</td>
							<td :class="week.percent >= 0 ? 'positive' : 'negative'">
								{{ week.percent >= 0 ? '+' : '' }}{{ week.percent.toFixed(2) }}%
							</td>
							<td>{{ week.ops }}</td>
							<td>{{ week.winRate.toFixed(1) }}%</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Daily Detail Table -->
			<div class="table-wrapper">
				<h3 class="table-subtitle">DETALHAMENTO DIÁRIO</h3>
				<table class="distribution-table">
					<thead>
						<tr>
							<th>DIA</th>
							<th>LUCRO</th>
							<th>CAPITAL</th>
							<th>OPS</th>
							<th>WIN%</th>
							<th>TEMPO ENTRE OPS</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="day in dailyData" :key="day.date">
							<td>
								<span class="day-badge" :class="day.badge" v-if="day.badge">{{ day.badge }}</span>
								{{ day.date }}
							</td>
							<td :class="day.profit >= 0 ? 'positive' : 'negative'">
								{{ day.profit >= 0 ? '+' : '' }}${{ day.profit.toFixed(2) }}
							</td>
							<td>${{ day.capital.toFixed(2) }}</td>
							<td>{{ day.ops }}</td>
							<td :class="day.winRate >= 70 ? 'positive' : day.winRate >= 50 ? '' : 'negative'">
								{{ day.winRate.toFixed(1) }}%
							</td>
							<td>{{ day.avgTime }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import { createChart, ColorType } from 'lightweight-charts';

	export default {
		name: 'AgenteAutonomoPanel',
		components: {},
		props: {
			agenteData: {
				type: Object,
				default: () => ({
					estrategia: 'IA SENTINEL',
					mercado: 'Volatility 100 Index',
					risco: 'Conservador-Adaptativo',
					goalValue: 50.0,
					stopValue: 25.0,
					dailyProfit: 0.0,
					dailyChange: 0.0,
					accumulatedLoss: 0.0,
					accumulatedChange: 0.0,
					lastExecutionTime: '00:00:00',
					tempoAtivo: '0h 0m 0s',
					operacoesHoje: 0,
					realTimeOperations: [],
					operationHistory: [],
					agentActions: [],
					agentStatus: 'PAUSADO',
					accountBalance: 0,
				})
			},
			tempoAtivo: {
				type: String,
				default: '0h 0m 0s'
			},
			sessionStats: {
				type: Object,
				default: () => ({
					totalTrades: 0,
					wins: 0,
					losses: 0,
					winRate: 0,
					totalProfit: 0,
					totalLoss: 0,
					netProfit: 0,
					totalCapital: 0,
					operationsToday: 0,
				})
			},
			tradeHistory: {
				type: Array,
				default: () => []
			},
			shouldTeleport: {
				type: Boolean,
				default: false
			}
		},
		emits: ['pausarAgente'],
		data() {
			return {
				abaAtiva: 'grafico',
				ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR'),
				filtroDataSelecionado: 'hoje',
				dataInicio: new Date().toISOString().split('T')[0],
				dataFim: new Date().toISOString().split('T')[0],
				periodoMobile: 'hoje',
				progressoMeta: {
					atual: 0,
					meta: 50,
					stop: 25,
				},
				// Dados para gráficos e logs
				indexChartData: [],
				priceHistoryInterval: null,
				pricePollingInterval: null,
				timeUpdateInterval: null,
				chartUpdateThrottle: null,
				priceTicks: [],
				indexChart: null,
				indexChartSeries: null,
				indexChartInitialized: false,
				localTradeHistory: [],
				realtimeLogs: [],
				lastLogTimestamp: null,
				logsPollingInterval: null,
				unidadeTimeframeSelecionada: 'minutos',
				valorTimeframeSelecionado: 1,
				tipoGraficoSelecionado: 'Velas',
				symbol: 'R_75',
				timeframeOptions: {
					minutos: [1, 2, 3, 5, 10, 15, 30],
					horas: [1, 2, 4, 8],
					Dias: [1, 2, 3, 4, 5, 6, 7],
				},
				tiposGrafico: ['Linha', 'Velas'],
				acoesAgente: [
					{ hora: '14:32:15', classe: 'success', titulo: 'Operação finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50' },
					{ hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
					{ hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - Confirmação de padrão' },
					{ hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrão da estratégia', descricao: '14:30:00 - Análise em andamento' },
				],
				showStopLossModal: false,
				
				// Novas propriedades para o layout redesenhado
				selectedPeriod: '30d',
				weeklyData: [
					{ period: '15/12 - 21/12', profit: 3385.05, finalCapital: 105428.46, percent: 3.32, ops: 84, winRate: 75.0 },
					{ period: '22/12 - 28/12', profit: 6641.49, finalCapital: 112069.95, percent: 6.30, ops: 271, winRate: 72.3 },
					{ period: '29/12 - 04/01', profit: 6664.37, finalCapital: 118734.32, percent: 5.95, ops: 268, winRate: 72.8 },
					{ period: '05/01 - 11/01', profit: 6424.36, finalCapital: 125158.68, percent: 5.41, ops: 282, winRate: 73.4 },
					{ period: '12/01 - 18/01', profit: 5769.39, finalCapital: 130928.07, percent: 4.61, ops: 249, winRate: 73.9 },
				],
				dailyData: [
                    { date: '19/12', badge: 'Melhor', profit: 2657.82, capital: 104701.23, ops: 43, winRate: 74.4, avgTime: '24min' },
					{ date: '25/12', badge: '', profit: 1169.77, capital: 111704.38, ops: 38, winRate: 71.0, avgTime: '24min' },
					{ date: '26/12', badge: '', profit: -511.89, capital: 111192.49, ops: 40, winRate: 75.0, avgTime: '24min' },
					{ date: '27/12', badge: '', profit: 387.73, capital: 111580.23, ops: 22, winRate: 72.7, avgTime: '27min' },
					{ date: '28/12', badge: '', profit: 489.72, capital: 112069.95, ops: 20, winRate: 75.0, avgTime: '27min' },
					{ date: '29/12', badge: '', profit: 1678.16, capital: 113749.11, ops: 52, winRate: 71.2, avgTime: '22min' },
					{ date: '30/12', badge: 'Pior', profit: -584.66, capital: 113163.45, ops: 40, winRate: 72.5, avgTime: '24min' },
					{ date: '31/12', badge: '', profit: 1210.03, capital: 114373.48, ops: 44, winRate: 75.0, avgTime: '23min' },
					{ date: '01/01', badge: '', profit: 1318.99, capital: 115692.47, ops: 43, winRate: 74.4, avgTime: '24min' },
					{ date: '02/01', badge: '', profit: 1966.64, capital: 117659.11, ops: 51, winRate: 70.6, avgTime: '22min' },
					{ date: '03/01', badge: '', profit: 584.80, capital: 118243.90, ops: 15, winRate: 73.3, avgTime: '28min' },
				],
			};
		},
		mounted() {
			if (this.abaAtiva === 'grafico') {
				this.$nextTick(() => {
					this.initIndexChart();
					// Mock data inicial
					this.fetchPriceHistory();
				});
			}
		},
		computed: {
			dateRangeText() {
				const today = new Date();
				const startDate = new Date(today);
				startDate.setDate(today.getDate() - 30);
				
				const formatDate = (date) => {
					const day = date.getDate();
					const month = date.toLocaleDateString('pt-BR', { month: 'short' });
					return `${day} ${month}`;
				};
				
				return `${formatDate(startDate)} - ${formatDate(today)} ${today.getFullYear()}`;
			},
			initialCapital() {
				return this.sessionStats?.totalCapital || this.totalCapital || 27808.68;
			},
			finalCapital() {
				return this.initialCapital + this.periodProfit;
			},
			periodProfit() {
				return this.sessionStats?.netProfit || 0;
			},
			periodProfitPercent() {
				if (this.initialCapital <= 0) return 0;
				return (this.periodProfit / this.initialCapital) * 100;
			},
			avgDailyProfit() {
				if (!this.dailyData || this.dailyData.length === 0) return 0;
				const totalProfit = this.dailyData.reduce((sum, day) => sum + day.profit, 0);
				return totalProfit / this.dailyData.length;
			},
			bestDay() {
				if (!this.dailyData || this.dailyData.length === 0) {
					return { value: 0, date: '--' };
				}
				const best = this.dailyData.reduce((max, day) => 
					day.profit > max.profit ? day : max
				, this.dailyData[0]);
				return { value: best.profit, date: best.date };
			},
			worstDay() {
				if (!this.dailyData || this.dailyData.length === 0) {
					return { value: 0, date: '--' };
				}
				const worst = this.dailyData.reduce((min, day) => 
					day.profit < min.profit ? day : min
				, this.dailyData[0]);
				return { value: Math.abs(worst.profit), date: worst.date };
			},
			// Métodos auxiliares legados mantidos para compatibilidade
			userIdComputed() { return this.getUserId(); },
			tempoAtivoDisplay() {
				if (this.tempoAtivo && this.tempoAtivo !== '0h 0m 0s') return this.tempoAtivo;
				if (this.agenteData && this.agenteData.tempoAtivo) return this.agenteData.tempoAtivo;
				return '0h 0m 0s';
			},
			operacoesHojeDisplay() {
				return this.sessionStats?.operationsToday ?? this.agenteData?.operacoesHoje ?? 0;
			},
			totalCapital() {
				// Só para compatibilidade interna se usado em outros lugares
				return this.sessionStats?.totalCapital || this.agenteData?.accountBalance || 0;
			},
			timeframeFinal() {
				const unidadeMap = { 'minutos': 'm', 'horas': 'h', 'Dias': 'D' };
				return `${this.valorTimeframeSelecionado}${unidadeMap[this.unidadeTimeframeSelecionada] || ''}`;
			},
			historicoOperacoesFiltradas() {
				// Simplificado para evitar erro, usando dados mock ou tradeHistory
				return this.tradeHistory || [];
			}
		},
		methods: {
			getUserId() {
				return localStorage.getItem('userId') || localStorage.getItem('user_id');
			},
			pausarAgenteEIrParaTopo() {
				this.$emit('pausarAgente');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			},
			
			// Métodos do Gráfico
			initIndexChart() {
				if (!this.$refs.performanceChartContainer) return;

				// Limpar container se já tiver algo
				this.$refs.performanceChartContainer.innerHTML = '';

				this.indexChart = createChart(this.$refs.performanceChartContainer, {
					layout: {
						background: { type: ColorType.Solid, color: 'transparent' },
						textColor: '#A0A0A0',
					},
					grid: {
						vertLines: { color: 'rgba(42, 46, 57, 0)' },
						horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
					},
					width: this.$refs.performanceChartContainer.clientWidth,
					height: 300,
					timeScale: {
						borderColor: 'rgba(197, 203, 206, 0.2)',
						timeVisible: true,
						secondsVisible: false,
					},
				});

				this.indexChartSeries = this.indexChart.addAreaSeries({
					topColor: 'rgba(34, 197, 94, 0.56)',
					bottomColor: 'rgba(34, 197, 94, 0.04)',
					lineColor: 'rgba(34, 197, 94, 1)',
					lineWidth: 2,
				});

				this.indexChartInitialized = true;

				// Responsividade
				const resizeObserver = new ResizeObserver(entries => {
					if (entries.length === 0 || !entries[0].target) return;
					if (this.indexChart) {
						this.indexChart.resize(entries[0].contentRect.width, 300);
					}
				});
				resizeObserver.observe(this.$refs.performanceChartContainer);
			},
			fetchPriceHistory() {
				// Mock data generator for performance visualization
				const data = [];
				let price = 1000;
				const now = new Date();
				for (let i = 0; i < 100; i++) {
					// 1 minute intervals, 100 points
					const time = new Date(now.getTime() - (100 - i) * 60000); 
					// Random walk price
					price += (Math.random() - 0.5) * 10;
					data.push({ time: time.getTime() / 1000, value: price });
				}
				this.updateIndexChart(data);
			},
			updateIndexChart(data) {
				if (this.indexChartSeries && data) {
					this.indexChartSeries.setData(data);
				}
			},

			// Métodos placeholder
			stopPricePolling() {},
			stopLogsPolling() {},
			startLogsPolling() {},
		},
		watch: {
			'agenteData.accountBalance'() { this.$forceUpdate(); }
		}
	}
</script>

<style scoped>
	/* Novos estilos para o layout redesenhado */
	.agent-new-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #0E0E0E;
		padding: 20px;
		border-bottom: 1px solid #1C1C1C;
		margin-bottom: 20px;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.header-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #F0F0F0;
		margin: 0;
	}

	.header-subtitle {
		font-size: 0.875rem;
		color: #A0A0A0;
		margin: 0;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.date-selector {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: #141414;
		border: 1px solid #333;
		padding: 8px 12px;
		border-radius: 6px;
		color: #F0F0F0;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.date-selector i {
		color: #22C55E;
	}

	.hide-values-btn {
		background: none;
		border: none;
		color: #A0A0A0;
		cursor: pointer;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.pause-btn-new {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: transparent;
		border: 1px solid #333;
		color: #F0F0F0;
		padding: 8px 12px;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.pause-btn-new:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Grid de Métricas */
	.new-metrics-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 20px;
		padding: 0 20px;
	}

	.new-metric-card {
		background-color: #0c0c0c;
		border: 1px solid #1C1C1C;
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

    /* ... omitted existing styles ... */

	/* Tabelas de Distribuição */
	.distribution-section {
		padding: 0 20px 40px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
	}

	.distribution-header {
        grid-column: 1 / -1;
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		color: #F0F0F0;
		text-transform: uppercase;
		margin-bottom: 20px;
	}
	
	.distribution-header i {
		color: #22C55E;
	}
	
	.table-wrapper {
		margin-bottom: 30px;
        background-color: #0c0c0c;
        border: 1px solid #1C1C1C;
        border-radius: 8px;
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
	}

    /* Custom Scrollbar for Premium Look */
    .table-wrapper::-webkit-scrollbar {
        width: 6px;
    }
    .table-wrapper::-webkit-scrollbar-track {
        background: #0E0E0E; 
    }
    .table-wrapper::-webkit-scrollbar-thumb {
        background: #333; 
        border-radius: 3px;
    }
    .table-wrapper::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
	
	.table-subtitle {
		font-size: 0.75rem;
		color: #666;
		margin-bottom: 12px;
		text-transform: uppercase;
		font-weight: 500;
        position: sticky;
        top: 0;
        background-color: #0c0c0c;
        z-index: 1;
        padding-bottom: 8px;
        border-bottom: 1px solid #1C1C1C;
	}

	.distribution-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.distribution-table th {
		text-align: left;
		color: #666;
		font-weight: 500;
		padding: 12px 8px;
		font-size: 0.75rem;
		text-transform: uppercase;
        position: sticky;
        top: 28px; /* Adjust based on subtitle height */
        background-color: #0c0c0c;
        z-index: 1;
	}
	
	.distribution-table td {
		padding: 12px 8px;
		color: #F0F0F0;
		border-bottom: 1px solid #141414;
	}
	
	.distribution-table tr:hover td {
		background-color: #1a1a1a;
	}

	.positive { color: #22C55E; }
	.negative { color: #EF4444; }
	
	.day-badge {
		font-size: 0.625rem;
		font-weight: 700;
		padding: 2px 8px;
		border-radius: 12px;
		margin-right: 8px;
		text-transform: uppercase;
        border: 1px solid transparent;
	}

    .day-badge.Melhor {
        background-color: rgba(34, 197, 94, 0.1);
        color: #22C55E;
        border-color: #22C55E;
    }

    .day-badge.Pior {
        background-color: rgba(239, 68, 68, 0.1);
        color: #EF4444;
        border-color: #EF4444;
    }

    .day-badge.HOJE {
        background-color: #FACC15; 
        color: #000;
        border-color: #FACC15;
    }

	/* Responsividade Basica */
	@media (max-width: 768px) {
		.new-metrics-grid,
		.additional-metrics-row,
        .distribution-section {
			grid-template-columns: 1fr;
		}
		
		.agent-new-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}
		
		.header-right {
			width: 100%;
			justify-content: space-between;
			flex-wrap: wrap;
		}
	}
</style>
