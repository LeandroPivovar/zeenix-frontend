<template>
	<div class="layout-content-agent-autonomo">
		<!-- New Header with Date Selector -->
		<div class="agent-new-header">
			<div class="header-left">
				<h1 class="header-title">Agente AutÃ´nomo</h1>
				<p class="header-subtitle">Dados baseados no perÃ­odo selecionado</p>
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
				<div class="metric-secondary">R$ {{ (initialCapital * 5.17).toFixed(2) }}</div>
			</div>

			<div class="new-metric-card">
				<div class="metric-header">
					<i class="fas fa-chart-line metric-icon-small"></i>
					<span class="metric-label-small">CAPITAL FINAL</span>
				</div>
				<div class="metric-value-large positive">${{ finalCapital.toFixed(2) }}</div>
				<div class="metric-secondary">R$ {{ (finalCapital * 5.17).toFixed(2) }}</div>
			</div>

			<div class="new-metric-card highlight-card">
				<div class="metric-header">
					<i class="fas fa-arrow-trend-up metric-icon-small"></i>
					<span class="metric-label-small">LUCRO DO PERÍODO</span>
				</div>
				<div class="metric-value-large positive">+${{ periodProfit.toFixed(2) }}</div>
				<div class="metric-footer">
					<span class="metric-secondary">R$ {{ (periodProfit * 5.17).toFixed(2) }}</span>
					<span class="metric-badge positive">+{{ periodProfitPercent.toFixed(2) }}%</span>
				</div>
			</div>

			<div class="new-metric-card">
				<div class="metric-header">
					<i class="fas fa-calendar-day metric-icon-small"></i>
					<span class="metric-label-small">LUCRO MÃ‰DIO/DIA</span>
				</div>
				<div class="metric-value-large positive">+${{ avgDailyProfit.toFixed(2) }}</div>
				<div class="metric-secondary">R${{ (avgDailyProfit * 5.17).toFixed(2) }}</div>
			</div>
		</div>

		<!-- Additional Metrics Row -->
		<div class="additional-metrics-row">
			<div class="additional-metric">
				<span class="additional-label">
					<img src="../../assets/icons/brain.svg" alt="" width="16px">
					EstratÃ©gia
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
					OperaÃ§Ãµes Hoje
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
				<h3 class="table-subtitle">DETALHAMENTO DIÃRIO</h3>
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
								<span class="day-badge" :class="day.badge">{{ day.badge }}</span>
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
					mercado: 'Volatility 100 Index', // âœ… Todos os agentes autÃ´nomos usam R_100
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
					accountBalance: 0, // Mudar de null para 0 para evitar problemas de reatividade
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
				maiorGanho: 0,
				maiorPerda: 0,
				progressoMeta: {
					atual: 0,
					meta: 50,
					stop: 25,
				},
				// Dados para grÃ¡ficos
				indexChartData: [],
				priceHistoryInterval: null,
				pricePollingInterval: null, // âœ… Novo: Intervalo para polling de preÃ§os (como na IA)
				timeUpdateInterval: null, // âœ… Novo: Intervalo para atualizar tempo
				chartUpdateThrottle: null, // âœ… Novo: Throttle para atualizaÃ§Ãµes do grÃ¡fico
				priceTicks: [],
				indexChart: null,
				indexChartSeries: null,
				indexChartInitialized: false,
				localTradeHistory: [], // HistÃ³rico de trades buscado localmente
				realtimeLogs: [], // Logs em tempo real (igual Ã  IA)
				lastLogTimestamp: null, // Timestamp do Ãºltimo log para polling
				logsPollingInterval: null, // Intervalo para polling de logs
				unidadeTimeframeSelecionada: 'minutos',
				valorTimeframeSelecionado: 1,
				tipoGráfico de Linhas',
				// âœ… REMOVIDO: WebSocket nÃ£o Ã© mais usado no frontend (backend gerencia)
				symbol: 'R_75', // Ãndice do agente autÃ´nomo (serÃ¡ atualizado do backend)
				timeframeOptions: {
					minutos: [1, 2, 3, 5, 10, 15, 30],
					horas: [1, 2, 4, 8],
					Dias: [1, 2, 3, 4, 5, 6, 7],
				},
				tiposGráfico de Velas'],
				acoesAgente: [
					{ hora: '14:32:15', classe: 'success', titulo: 'OperaÃ§Ã£o finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50' },
					{ hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
					{ hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - ConfirmaÃ§Ã£o de padrÃ£o' },
					{ hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrÃ£o da estratÃ©gia', descricao: '14:30:00 - AnÃ¡lise em andamento' },
				],
				showStopLossModal: false,
				// Novas propriedades para o layout redesenhado
				selectedPeriod: '30d',
				weeklyData: [
					{ period: '15/12 - 21/12', profit: 82385.05, finalCapital: 112049.48, percent: 3.32, ops: 64, winRate: 76.0 },
					{ period: '22/12 - 28/12', profit: -8843.49, finalCapital: 112049.65, percent: -6.30, ops: 271, winRate: 72.3 },
					{ period: '29/12 - 04/01', profit: 8844.37, finalCapital: 118734.32, percent: 5.95, ops: 268, winRate: 72.8 },
					{ period: '05/01 - 11/01', profit: 8434.36, finalCapital: 125159.68, percent: 5.41, ops: 262, winRate: 73.4 },
					{ period: '12/01 - 18/01', profit: 5789.39, finalCapital: 130928.07, percent: 4.61, ops: 249, winRate: 73.9 },
				],
				dailyData: [
					{ date: '19/12', badge: 'HOJE', profit: 42857.82, capital: 104701.23, ops: 43, winRate: 74.4, avgTime: '24min' },
					{ date: '20/12', badge: '', profit: 2006.41, capital: 106697.83, ops: 20, winRate: 70.0, avgTime: '27min' },
					{ date: '21/12', badge: '', profit: -3298.18, capital: 105426.46, ops: 21, winRate: 76.2, avgTime: '27min' },
					{ date: '22/12', badge: '', profit: 61734.67, capital: 107363.03, ops: 54, winRate: 70.4, avgTime: '22min' },
					{ date: '23/12', badge: '', profit: 41950.53, capital: 108113.65, ops: 41, winRate: 75.6, avgTime: '24min' },
					{ date: '24/12', badge: '', profit: 41421.06, capital: 110534.61, ops: 56, winRate: 69.6, avgTime: '22min' },
					{ date: '25/12', badge: '', profit: 41169.77, capital: 111704.38, ops: 38, winRate: 71.0, avgTime: '24min' },
					{ date: '26/12', badge: '', profit: -511.89, capital: 111192.49, ops: 40, winRate: 75.0, avgTime: '24min' },
					{ date: '27/12', badge: '', profit: 9387.73, capital: 111580.23, ops: 22, winRate: 72.7, avgTime: '27min' },
				],
			};
		},
		computed: {
			statsHoje() {
				// Considerando 'hoje' como 2025-11-25 (ou data atual da simulaÃ§Ã£o) ou baseado nas ops
				// Aqui vou pegar do historicoOperacoes para ser consistente
				const ops = this.historicoOperacoes || [];
				// Usando data simples mockada se necessÃ¡rio ou a atual
				const hoje = new Date().toISOString().split('T')[0];
				
				// Filtro simplificado, considerando que historicoOperacoes jÃ¡ pode estar filtrado ou nÃ£o.
				// Se a aplicaÃ§Ã£o usa dados de "hoje" como padrÃ£o, isso basta.
				const opsHoje = ops.filter(op => op.data === hoje || op.data === '2025-11-25'); 
				
				const wins = opsHoje.filter(op => op.resultado.includes('+')).length;
				const losses = opsHoje.filter(op => op.resultado.includes('-')).length;
				return { wins, losses };
			},
			historicoOperacoes() {
				// âœ… Usar localTradeHistory primeiro (dados buscados localmente), depois tradeHistory (prop), depois operationHistory
				const historyToUse = (this.localTradeHistory && this.localTradeHistory.length > 0) 
					? this.localTradeHistory 
					: (this.tradeHistory && Array.isArray(this.tradeHistory) && this.tradeHistory.length > 0)
						? this.tradeHistory
						: null;
				
				if (historyToUse && historyToUse.length > 0) {
					console.log('[AgenteAutonomoActive] ðŸ“Š Convertendo tradeHistory:', historyToUse.length, 'trades');
					return historyToUse.map(trade => {
						const date = new Date(trade.createdAt || trade.created_at || Date.now());
						const dataStr = date.toISOString().split('T')[0];
						const horaStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
						const profitLoss = parseFloat(trade.profitLoss || trade.profit_loss || 0);
						const resultadoStr = profitLoss >= 0 ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`;
						
						return {
							data: dataStr,
							hora: horaStr,
							ativo: trade.symbol || 'R_75',
							tipo: (trade.signalDirection || trade.contractType) === 'RISE' || (trade.signalDirection || trade.contractType) === 'HIGHER' ? 'Call' : 'Put',
							entrada: parseFloat(trade.entryPrice || trade.entry_price || 0).toFixed(2),
							saida: (trade.exitPrice || trade.exit_price) ? parseFloat(trade.exitPrice || trade.exit_price).toFixed(2) : '0.00',
							resultado: resultadoStr,
							volume: parseFloat(trade.stakeAmount || trade.stake_amount || 0).toFixed(2),
						};
					});
				}
				// Se nÃ£o houver tradeHistory, usar operationHistory do agenteData
				console.log('[AgenteAutonomoActive] âš ï¸ Nenhum tradeHistory disponÃ­vel. tradeHistory:', this.tradeHistory, 'agenteData.operationHistory:', this.agenteData?.operationHistory);
				return this.agenteData?.operationHistory || [];
			},
			userIdComputed() {
				// Garantir que o userId seja sempre atualizado
				return this.getUserId();
			},
			tempoAtivoDisplay() {
				// Priorizar prop tempoAtivo, depois agenteData.tempoAtivo
				if (this.tempoAtivo && this.tempoAtivo !== '0h 0m 0s') {
					return this.tempoAtivo;
				}
				if (this.agenteData && this.agenteData.tempoAtivo) {
					return this.agenteData.tempoAtivo;
				}
				return '0h 0m 0s';
			},
			acoesAgenteComputed() {
				// Usar agentActions do agenteData se disponÃ­vel
				const actions = this.agenteData?.agentActions || this.acoesAgente || [];
				return actions;
			},
			progressoPorcentagem() {
				const current = this.sessionStats?.netProfit || this.progressoMeta.atual || 0;
				const percentage = (current / this.progressoMeta.meta) * 100;
				return `${Math.min(100, Math.max(0, percentage)).toFixed(0)}%`;
			},
			operacoesHojeDisplay() {
				// Priorizar sessionStats.operationsToday (mais confiÃ¡vel), depois agenteData.operacoesHoje, depois 0
				const valor = this.sessionStats?.operationsToday ?? this.agenteData?.operacoesHoje ?? 0;
				console.log('[AgenteAutonomoActive] operacoesHojeDisplay computed:', valor, 'sessionStats:', this.sessionStats?.operationsToday, 'agenteData:', this.agenteData?.operacoesHoje);
				return valor;
			},
			totalCapital() {
				// Priorizar sessionStats.totalCapital (do backend), depois usar accountBalance do header como fallback
				const backendCapital = this.sessionStats?.totalCapital;
				const headerBalance = this.agenteData?.accountBalance;
				
				// Converter para nÃºmero se necessÃ¡rio
				const backendCapitalNum = backendCapital ? (typeof backendCapital === 'number' ? backendCapital : parseFloat(String(backendCapital)) || 0) : 0;
				const headerBalanceNum = headerBalance !== null && headerBalance !== undefined 
					? (typeof headerBalance === 'number' ? headerBalance : parseFloat(String(headerBalance)) || 0) 
					: 0;
				
				// Log detalhado para debug (sempre logar quando houver valores ou quando agenteData existir)
				if (this.agenteData && (headerBalanceNum > 0 || backendCapitalNum > 0 || headerBalance !== undefined)) {
					console.log('[AgenteAutonomoActive] totalCapital computed:', {
						backendCapital: backendCapital,
						backendCapitalNum: backendCapitalNum,
						headerBalance: headerBalance,
						headerBalanceType: typeof headerBalance,
						headerBalanceNum: headerBalanceNum,
						agenteDataExists: !!this.agenteData,
						agenteDataAccountBalance: this.agenteData?.accountBalance,
						sessionStatsExists: !!this.sessionStats
					});
				}
				
				if (backendCapitalNum > 0) {
					return backendCapitalNum;
				}
				
				if (headerBalanceNum > 0) {
					console.log('[AgenteAutonomoActive] âœ… totalCapital: usando headerBalance como fallback:', headerBalanceNum);
					return headerBalanceNum;
				}
				
				// Log apenas quando realmente nÃ£o hÃ¡ valor (evitar spam)
				if (this.sessionStats && this.agenteData && headerBalanceNum === 0 && backendCapitalNum === 0) {
					console.warn('[AgenteAutonomoActive] âš ï¸ totalCapital: nenhum valor disponÃ­vel. backendCapital:', backendCapitalNum, 'headerBalance:', headerBalanceNum, 'agenteData.accountBalance:', this.agenteData?.accountBalance);
				}
				return 0;
			},
			totalBalance() {
				// âœ… Saldo total da conta (account balance) - usado para calcular porcentagem do resultado do dia
				// IMPORTANTE: NÃƒO usar totalCapital (valor inicial) como fallback, sempre usar o saldo atual da conta
				const accountBalance = this.agenteData?.accountBalance;
				let balanceNum = 0;
				
				if (accountBalance !== null && accountBalance !== undefined) {
					if (typeof accountBalance === 'number') {
						balanceNum = accountBalance;
					} else if (typeof accountBalance === 'object') {
						// Se for um objeto (retornado pelo balanceLoader), extrair o valor numÃ©rico
						if (accountBalance.balance !== undefined && accountBalance.balance !== null) {
							balanceNum = typeof accountBalance.balance === 'number' 
								? accountBalance.balance 
								: parseFloat(String(accountBalance.balance)) || 0;
						} else if (accountBalance.value !== undefined && accountBalance.value !== null) {
							balanceNum = typeof accountBalance.value === 'number' 
								? accountBalance.value 
								: parseFloat(String(accountBalance.value)) || 0;
						} else {
							// Tentar converter o objeto inteiro para nÃºmero (improvÃ¡vel, mas tenta)
							balanceNum = Number(accountBalance) || 0;
						}
					} else if (typeof accountBalance === 'string') {
						// Converter string para nÃºmero, removendo formataÃ§Ã£o se necessÃ¡rio
						// Tratar formato brasileiro: "18.299,07" -> 18299.07
						// Tratar formato americano: "18299.07" -> 18299.07
						let cleanBalance = String(accountBalance).trim();
						
						// Remover sÃ­mbolos de moeda e espaÃ§os
						cleanBalance = cleanBalance.replace(/[Ä$R$\s]/g, '');
						
						// Se tiver vÃ­rgula como separador decimal (formato brasileiro)
						if (cleanBalance.includes(',') && cleanBalance.includes('.')) {
							// Formato: "18.299,07" -> remover pontos de milhar, substituir vÃ­rgula por ponto
							cleanBalance = cleanBalance.replace(/\./g, '').replace(',', '.');
						} else if (cleanBalance.includes(',')) {
							// Apenas vÃ­rgula: "18299,07" -> substituir por ponto
							cleanBalance = cleanBalance.replace(',', '.');
						}
						
						balanceNum = parseFloat(cleanBalance) || 0;
					} else {
						// Tentar converter para nÃºmero diretamente
						balanceNum = Number(accountBalance) || 0;
					}
				}
				
				// Log para debug (sempre logar quando houver netProfit para identificar problemas)
				if (this.sessionStats?.netProfit !== undefined && this.sessionStats.netProfit !== null) {
					const netProfit = this.sessionStats.netProfit || 0;
					const percentage = balanceNum > 0 ? ((netProfit / balanceNum) * 100).toFixed(2) : 'N/A';
					
					console.log('[AgenteAutonomoActive] ðŸ’° totalBalance computed:', {
						accountBalance: accountBalance,
						accountBalanceType: typeof accountBalance,
						balanceNum: balanceNum,
						netProfit: netProfit,
						percentage: percentage,
						agenteDataExists: !!this.agenteData,
						// NÃƒO usar totalCapital como referÃªncia aqui
					});
					
					// Aviso se o saldo nÃ£o estiver disponÃ­vel mas houver netProfit
					if (balanceNum <= 0 && Math.abs(netProfit) > 0.01) {
						console.error('[AgenteAutonomoActive] âŒ ERRO: Saldo total nÃ£o disponÃ­vel para calcular porcentagem!', {
							accountBalance: accountBalance,
							balanceNum: balanceNum,
							netProfit: netProfit,
							agenteData: this.agenteData,
						});
					}
				}
				
				// âŒ NÃƒO usar totalCapital como fallback - sempre usar o saldo atual da conta
				// Se nÃ£o houver saldo vÃ¡lido, retornar 0 (evitar divisÃ£o por zero e cÃ¡lculos incorretos)
				if (balanceNum <= 0) {
					return 0;
				}
				
				return balanceNum;
			},
			tempoOptions() {
				return this.timeframeOptions[this.unidadeTimeframeSelecionada] || [];
			},
			timeframeFinal() {
				const unidadeMap = {
					'minutos': 'm',
					'horas': 'h',
					'Dias': 'D'
				};
				return `${this.valorTimeframeSelecionado}${unidadeMap[this.unidadeTimeframeSelecionada] || ''}`;
			},
			graficoPlaceholder() {
				return `Performance do Agente (Gráfico de ${this.tipoGraficoSelecionado} | ${this.timeframeFinal})`;
			},
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
				// Capital inicial da sessão (sessionStats.totalCapital ou fallback)
				return this.sessionStats?.totalCapital || this.totalCapital || 27808.68;
			},
			finalCapital() {
				// Capital final = capital inicial + lucro do período
				return this.initialCapital + this.periodProfit;
			},
			periodProfit() {
				// Lucro do período (sessionStats.netProfit ou fallback)
				return this.sessionStats?.netProfit || 0;
			},
			periodProfitPercent() {
				// Percentual de lucro do período
				if (this.initialCapital <= 0) return 0;
				return (this.periodProfit / this.initialCapital) * 100;
			},
			avgDailyProfit() {
				// Lucro médio por dia (baseado nos dados diários)
				if (!this.dailyData || this.dailyData.length === 0) return 0;
				const totalProfit = this.dailyData.reduce((sum, day) => sum + day.profit, 0);
				return totalProfit / this.dailyData.length;
			},
			bestDay() {
				// Melhor dia (maior lucro)
				if (!this.dailyData || this.dailyData.length === 0) {
					return { value: 0, date: '--' };
				}
				const best = this.dailyData.reduce((max, day) => 
					day.profit > max.profit ? day : max
				, this.dailyData[0]);
				return { value: best.profit, date: best.date };
			},
			worstDay() {
				// Pior dia (maior perda)
				if (!this.dailyData || this.dailyData.length === 0) {
					return { value: 0, date: '--' };
				}
				const worst = this.dailyData.reduce((min, day) => 
					day.profit < min.profit ? day : min
				, this.dailyData[0]);
				return { value: Math.abs(worst.profit), date: worst.date };
			},

			historicoOperacoesFiltradas() {
				const { filtroDataSelecionado, dataInicio, dataFim, historicoOperacoes } = this;
				const getDateNDaysAgo = (n) => {
					const date = new Date();
					date.setDate(date.getDate() - n + 1);
					return date.toISOString().split('T')[0];
				};
				const hoje = new Date().toISOString().split('T')[0];
				let startDate;
				switch (filtroDataSelecionado) {
					case 'hoje':
						startDate = hoje;
						return historicoOperacoes.filter(op => op.data === startDate);
					case 'ontem':
						startDate = getDateNDaysAgo(1);
						return historicoOperacoes.filter(op => op.data === startDate);
					case 'personalizado':
						if (dataInicio && dataFim) {
							return historicoOperacoes.filter(op => op.data >= dataInicio && op.data <= dataFim).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
						} else if (dataInicio) {
							return historicoOperacoes.filter(op => op.data >= dataInicio).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
						} else if (dataFim) {
							return historicoOperacoes.filter(op => op.data <= dataFim).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
						}
						return historicoOperacoes;
					case '7d':
						startDate = getDateNDaysAgo(7);
						return historicoOperacoes.filter(op => op.data >= startDate).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
					case '30d':
						startDate = getDateNDaysAgo(30);
						return historicoOperacoes.filter(op => op.data >= startDate).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
					default:
						return historicoOperacoes.sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
				}
			},
			// Transformar dados do histórico para o formato esperado pelo OperationLogs
			formattedTradeResults() {
				if (!this.historicoOperacoes || this.historicoOperacoes.length === 0) {
					return [];
				}
				
				return this.historicoOperacoes.map((op, index) => {
					// Extrair valores numÃ©ricos
					const entrada = parseFloat(op.entrada) || 0;
					const saida = parseFloat(op.saida) || entrada;
					
					// Extrair resultado (ganho/perda)
					const resultadoStr = op.resultado || '+$0.00';
					const resultadoMatch = resultadoStr.replace('$', '').replace('+', '').replace(',', '');
					const profit = parseFloat(resultadoMatch) || 0;
					
					// Determinar direÃ§Ã£o baseado no tipo
					const direction = op.tipo === 'Call' ? 'CALL' : (op.tipo === 'Put' ? 'PUT' : 'CALL');
					
					// Criar ID Ãºnico
					const contractId = `autonomo-${op.data}-${op.hora}-${index}`;
					
					// Converter data e hora para timestamp e Date objects
					const dateTime = new Date(`${op.data}T${op.hora}`);
					const time = Math.floor(dateTime.getTime() / 1000);
					
					// Criar createdAt e closedAt (assumindo que a hora Ã© quando foi fechado)
					const createdAt = dateTime.toISOString();
					const closedAt = dateTime.toISOString(); // Usar mesma data/hora jÃ¡ que nÃ£o temos separaÃ§Ã£o
					
					return {
						contractId: contractId,
						id: contractId,
						buyPrice: entrada,
						price: entrada,
						direction: direction,
						type: direction,
						profit: profit,
						profitLoss: profit,
						exitTick: saida.toFixed(2),
						sellPrice: saida,
						closePrice: saida,
						status: 'CLOSED',
						time: time,
						stakeAmount: entrada,
						createdAt: createdAt,
						closedAt: closedAt
					};
				});
			}
		},
		watch: {
			'agenteData.dailyProfit'(newVal) {
				if (newVal !== undefined) {
					this.progressoMeta.atual = parseFloat(newVal) || 0;
				}
			},
			'agenteData.operacoesHoje'(newVal) {
				console.log('[AgenteAutonomoActive] agenteData.operacoesHoje mudou para:', newVal);
			},
			sessionStats: {
				handler(newStats) {
					if (newStats && newStats.netProfit !== undefined) {
						this.progressoMeta.atual = parseFloat(newStats.netProfit) || 0;
					}
				},
				deep: true,
				immediate: true,
			},
			abaAtiva(newAba, oldAba) {
				// âœ… DESATIVADO: Polling desativado temporariamente para reduzir carga no servidor
				if (newAba === 'grafico') {
					// Buscar histÃ³rico apenas uma vez (sem polling contÃ­nuo)
					this.fetchPriceHistory();
					// this.startPricePolling(); // âœ… DESATIVADO
					
					// Parar polling de logs
					this.stopLogsPolling();
					
					this.$nextTick(() => {
						setTimeout(() => {
							if (this.$refs.indexChartContainer) {
								if (!this.indexChartInitialized) {
									this.initIndexChart();
								} else if (this.priceTicks.length > 0) {
									// Se jÃ¡ estiver inicializado, atualizar com dados
									this.updateIndexChart();
								}
							}
						}, 200);
					});
				} else if (newAba === 'historico') {
					// Buscar histÃ³rico de trades quando entrar na aba histÃ³rico
					this.fetchTradeHistory();
					// Parar polling de logs
					this.stopLogsPolling();
				} else if (newAba === 'registro') {
					// âœ… Iniciar polling de logs quando entrar na aba registro
					this.startLogsPolling();
				} else {
					// âœ… OTIMIZADO: Parar polling quando sair da aba grÃ¡fico
					if (oldAba === 'grafico') {
						this.stopPricePolling();
						console.log('[AgenteAutonomoActive] Polling parado ao sair da aba grÃ¡fico');
					}
					// Parar polling de logs se sair da aba registro
					if (oldAba === 'registro') {
						this.stopLogsPolling();
					}
				}
			},
			'agenteData.goalValue'(newVal) {
				if (newVal !== undefined) {
					this.progressoMeta.meta = newVal || 50;
				}
			},
			'agenteData.stopValue'(newVal) {
				if (newVal !== undefined) {
					this.progressoMeta.stop = newVal || 25;
				}
			},
			'agenteData.lastExecutionTime'(newVal) {
				if (newVal) {
					this.ultimaAtualizacao = newVal;
				}
			},
			'agenteData.tempoAtivo'(newVal, oldVal) {
				// ForÃ§ar atualizaÃ§Ã£o quando tempoAtivo mudar
				if (newVal && newVal !== oldVal) {
					console.log('[AgenteAutonomoActive] tempoAtivo mudou:', { newVal, oldVal });
					this.$forceUpdate();
				}
			},
			'agenteData.accountBalance'(newVal, oldVal) {
				// ForÃ§ar atualizaÃ§Ã£o quando accountBalance mudar para recalcular porcentagens
				if (newVal !== oldVal) {
					console.log('[AgenteAutonomoActive] accountBalance mudou (watch especÃ­fico):', { 
						newVal, 
						oldVal, 
						newValType: typeof newVal,
						isValid: newVal && typeof newVal === 'number' && newVal > 0,
						agenteDataAccountBalance: this.agenteData?.accountBalance
					});
					if (newVal && typeof newVal === 'number' && newVal > 0) {
						console.log('[AgenteAutonomoActive] ForÃ§ando atualizaÃ§Ã£o devido a mudanÃ§a de accountBalance');
						this.$forceUpdate();
					}
				}
			},
			agenteData: {
				handler(newVal, oldVal) {
					// Log de mudanÃ§as em agenteData
					if (newVal && typeof newVal === 'object') {
						console.log('[AgenteAutonomoActive] agenteData mudou:', {
							operacoesHoje: newVal?.operacoesHoje,
							accountBalance: newVal?.accountBalance,
							accountBalanceType: typeof newVal?.accountBalance,
							oldAccountBalance: oldVal?.accountBalance,
							fullAgenteData: newVal
						});
						
						// ForÃ§ar atualizaÃ§Ã£o quando accountBalance mudar
						if (newVal.accountBalance && newVal.accountBalance !== oldVal?.accountBalance) {
							console.log('[AgenteAutonomoActive] accountBalance mudou no agenteData, forÃ§ando atualizaÃ§Ã£o');
							this.$forceUpdate();
						}
						
						// ForÃ§ar atualizaÃ§Ã£o quando agenteData mudar (especialmente tempoAtivo)
						if (newVal.tempoAtivo) {
							console.log('[AgenteAutonomoActive] agenteData mudou:', {
								newTempoAtivo: newVal.tempoAtivo,
								oldTempoAtivo: oldVal?.tempoAtivo
							});
							this.$forceUpdate();
						}
						
						// âœ… NOVO: Quando agenteData Ã© definido pela primeira vez (nova sessÃ£o), buscar ticks atualizados
						if (!oldVal && this.abaAtiva === 'grafico') {
							console.log('[AgenteAutonomoActive] Nova sessÃ£o detectada, buscando ticks atualizados...');
							this.$nextTick(() => {
								setTimeout(() => {
									this.fetchPriceHistory();
								}, 1000); // Aguardar 1 segundo para garantir que o backend processou a ativaÃ§Ã£o
							});
						}
					} else if (newVal && !oldVal) {
						// âœ… Nova sessÃ£o detectada (agenteData definido pela primeira vez)
						if (this.abaAtiva === 'grafico') {
							console.log('[AgenteAutonomoActive] Nova sessÃ£o detectada, buscando ticks atualizados...');
							this.$nextTick(() => {
								setTimeout(() => {
									this.fetchPriceHistory();
								}, 1000); // Aguardar 1 segundo para garantir que o backend processou a ativaÃ§Ã£o
							});
						}
					}
				},
				deep: true,
				immediate: true
			},
			tradeHistory: {
				handler(newHistory) {
					if (newHistory && newHistory.length > 0) {
						// Calcular maior ganho e maior perda
						const profits = newHistory
							.filter(t => t.profitLoss !== null && t.profitLoss > 0)
							.map(t => t.profitLoss);
						const losses = newHistory
							.filter(t => t.profitLoss !== null && t.profitLoss < 0)
							.map(t => Math.abs(t.profitLoss));
						
						this.maiorGanho = profits.length > 0 ? Math.max(...profits) : 0;
						this.maiorPerda = losses.length > 0 ? Math.max(...losses) : 0;
					}
				},
				deep: true,
				immediate: true
			},
			unidadeTimeframeSelecionada(novaUnidade) {
				const primeiroValor = this.timeframeOptions[novaUnidade][0];
				if (this.valorTimeframeSelecionado !== primeiroValor) {
					this.valorTimeframeSelecionado = primeiroValor;
				}
			},
			filtroDataSelecionado(novoFiltro) {
				if (novoFiltro !== 'personalizado') {
					const hoje = new Date().toISOString().split('T')[0];
					this.dataInicio = hoje;
					this.dataFim = hoje;
				}
			},
			priceTicks: {
				handler(newTicks) {
					console.log('[AgenteAutonomoActive] priceTicks atualizado:', newTicks?.length || 0, 'ticks');
					if (newTicks && newTicks.length > 0) {
						if (this.indexChartInitialized && this.abaAtiva === 'grafico') {
							this.$nextTick(() => {
								this.updateIndexChart();
							});
						} else if (this.abaAtiva === 'grafico') {
							// Se o grÃ¡fico ainda nÃ£o foi inicializado mas temos dados, inicializar
							this.$nextTick(() => {
								if (this.$refs.indexChartContainer) {
									this.initIndexChart();
								}
							});
						}
					}
				},
				deep: true,
				immediate: true
			},
			'agenteData.mercado'(newMarket) {
				// Atualizar sÃ­mbolo quando o mercado mudar
				if (newMarket) {
					const marketToSymbol = {
						'Volatility 10 Index': 'R_10',
						'Volatility 25 Index': 'R_25',
						'Volatility 50 Index': 'R_50',
						'Volatility 75 Index': 'R_75',
						'Volatility 100 Index': 'R_100'
					};
					const newSymbol = marketToSymbol[newMarket] || 'R_75';
					if (this.symbol !== newSymbol) {
						this.symbol = newSymbol;
						// Reconectar WebSocket com novo sÃ­mbolo
						if (this.derivWebSocket) {
							this.disconnectDerivWebSocket();
							setTimeout(() => {
								this.connectToDerivWebSocket();
							}, 1000);
						}
					}
				}
			}
		},
		mounted() {
			// Inicializar dados do agente
			if (this.agenteData) {
				this.progressoMeta.atual = this.agenteData.dailyProfit || 0;
				this.progressoMeta.meta = this.agenteData.goalValue || 50;
				this.progressoMeta.stop = this.agenteData.stopValue || 25;
				this.ultimaAtualizacao = this.agenteData.lastExecutionTime || new Date().toLocaleTimeString('pt-BR');
				
				// Atualizar sÃ­mbolo baseado no mercado do agenteData
				if (this.agenteData.mercado) {
					const marketToSymbol = {
						'Volatility 10 Index': 'R_10',
						'Volatility 25 Index': 'R_25',
						'Volatility 50 Index': 'R_50',
						'Volatility 75 Index': 'R_75',
						'Volatility 100 Index': 'R_100'
					};
					this.symbol = marketToSymbol[this.agenteData.mercado] || 'R_75';
				}
			}
			
			// Atualizar Ãºltima atualizaÃ§Ã£o a cada segundo
			this.timeUpdateInterval = setInterval(() => {
				this.ultimaAtualizacao = new Date().toLocaleTimeString('pt-BR');
			}, 1000);
			
			// âœ… DESATIVADO: Polling desativado temporariamente para reduzir carga no servidor
			// NÃ£o usar WebSocket no frontend para evitar requisiÃ§Ãµes travadas
			if (this.abaAtiva === 'grafico') {
				// Buscar histÃ³rico inicial apenas uma vez (sem polling contÃ­nuo)
				this.fetchPriceHistory();
				// this.startPricePolling(); // âœ… DESATIVADO
			} else if (this.abaAtiva === 'historico') {
				// Buscar histÃ³rico de trades se estiver na aba histÃ³rico
				this.fetchTradeHistory();
			}
			
			// Inicializar grÃ¡fico apenas se estiver na aba grÃ¡fico
			if (this.abaAtiva === 'grafico') {
				this.$nextTick(() => {
					setTimeout(() => {
						if (this.$refs.indexChartContainer) {
							this.initIndexChart();
						}
					}, 500);
				});
			}
			
			// âœ… Iniciar polling de logs se estiver na aba registro
			if (this.abaAtiva === 'registro') {
				this.startLogsPolling();
			}
			
			if (this.abaAtiva === 'registro') {
				this.startLogsPolling();
			}

			// Verificar estado do Stop Loss ao montar
			this.checkStopLossState();
			
			// Rolagem instantÃ¢nea para o topo
			window.scrollTo({ top: 0, behavior: 'auto' });
		},
		beforeUnmount() {
			// Limpar todos os intervalos
			if (this.priceHistoryInterval) {
				clearInterval(this.priceHistoryInterval);
			}
			if (this.pricePollingInterval) {
				clearInterval(this.pricePollingInterval);
			}
			if (this.timeUpdateInterval) {
				clearInterval(this.timeUpdateInterval);
			}
			if (this.chartUpdateThrottle) {
				clearTimeout(this.chartUpdateThrottle);
			}
			
			// âœ… Removido: WebSocket nÃ£o Ã© mais usado no frontend
			// this.disconnectDerivWebSocket();
			
			// Destruir grÃ¡fico
			if (this.indexChart) {
				this.indexChart.remove();
				this.indexChart = null;
			}
		},
		methods: {
			trocarAba(aba) {
				this.abaAtiva = aba;
			},
			exportarHistorico() {
				// Removido o alert
				console.log(`Exportando histÃ³rico. Filtro: ${this.filtroDataSelecionado}. Total de operaÃ§Ãµes: ${this.historicoOperacoesFiltradas.length}`);
				// Aqui seria a lÃ³gica real para gerar e baixar um arquivo CSV/Excel/PDF
			},
			// âœ… REMOVIDO: WebSocket nÃ£o Ã© mais usado no frontend
			// O backend gerencia o WebSocket, o frontend usa polling HTTP como na IA
			
			// âœ… NOVO: Buscar histÃ³rico de preÃ§os do backend (como na IA)
			async fetchPriceHistory() {
				try {
					const userId = this.getUserId();
					if (!userId) {
						console.warn('[AgenteAutonomoActive] âš ï¸ userId nÃ£o disponÃ­vel para buscar histÃ³rico');
						return;
					}
					
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const url = `${apiBase}/autonomous-agent/price-history/${userId}?limit=200`;
					console.log('[AgenteAutonomoActive] ðŸ“¡ Buscando histÃ³rico de preÃ§os:', url);
					
					const response = await fetch(url, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					
					if (!response.ok) {
						console.warn(`[AgenteAutonomoActive] âš ï¸ Resposta nÃ£o OK: ${response.status} ${response.statusText}`);
						return;
					}
					
					const result = await response.json();
					console.log('[AgenteAutonomoActive] ðŸ“¦ Resposta recebida:', { success: result.success, dataLength: result.data?.length || 0 });
					
					if (result.success && result.data && Array.isArray(result.data)) {
						// âœ… SEGUINDO PADRÃƒO DA IA: Processamento robusto de ticks
						const ticks = result.data
							.map(tick => {
								// Extrair value de forma robusta (tentar todas as propriedades possÃ­veis)
								const rawValue = tick.value ?? tick.price ?? tick.quote ?? tick.close ?? tick.spot ?? null;
								if (!rawValue || rawValue === 0) {
									return null;
								}
								
								const value = parseFloat(rawValue);
								if (isNaN(value) || !isFinite(value) || value <= 0) {
									return null;
								}
								
								// Extrair epoch/time de forma robusta
								let epoch = tick.epoch || tick.time;
								if (!epoch && tick.timestamp) {
									epoch = Math.floor(new Date(tick.timestamp).getTime() / 1000);
								} else if (epoch > 10000000000) {
									// Se for timestamp em milissegundos, converter para segundos
									epoch = Math.floor(epoch / 1000);
								} else {
									epoch = Math.floor(epoch);
								}
								
								if (!epoch || epoch <= 0) {
									return null;
								}
								
								return {
									value: value,
									epoch: epoch,
									timestamp: tick.timestamp || new Date(epoch * 1000).toISOString()
								};
							})
							.filter(tick => tick !== null && tick.value > 0 && tick.epoch > 0);
						
						this.priceTicks = ticks;
						console.log('[AgenteAutonomoActive] âœ… HistÃ³rico carregado:', ticks.length, 'ticks vÃ¡lidos de', result.data.length, 'total');
						if (ticks.length > 0) {
							console.log('[AgenteAutonomoActive] ðŸ“Š Primeiro tick:', ticks[0], 'Ãšltimo tick:', ticks[ticks.length - 1]);
						}
						
						// Atualizar grÃ¡fico se jÃ¡ estiver inicializado
						if (this.indexChartInitialized) {
							this.updateIndexChart();
						} else if (ticks.length > 0) {
							// Se o grÃ¡fico ainda nÃ£o foi inicializado mas temos dados, inicializar
							this.$nextTick(() => {
								if (this.$refs.indexChartContainer && !this.indexChartInitialized) {
									this.initIndexChart();
								}
							});
						}
					} else {
						console.warn('[AgenteAutonomoActive] âš ï¸ Resposta sem dados vÃ¡lidos:', result);
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] âŒ Erro ao buscar histÃ³rico:', error);
				}
			},
			
			// âœ… DESATIVADO: Polling de preÃ§os desativado temporariamente para reduzir carga no servidor
			startPricePolling() {
				// Buscar apenas uma vez ao inicializar, sem polling contÃ­nuo
				// this.fetchPriceHistory();
				// Polling desativado para reduzir requisiÃ§Ãµes pendentes
				// this.pricePollingInterval = setInterval(() => {
				// 	if (this.abaAtiva === 'grafico') {
				// 		this.fetchPriceHistory();
				// 	}
				// }, 2000);
			},
			
			// âœ… NOVO: Parar polling de preÃ§os
			stopPricePolling() {
				if (this.pricePollingInterval) {
					clearInterval(this.pricePollingInterval);
					this.pricePollingInterval = null;
				}
			},
			
			// âœ… NOVO: Buscar histÃ³rico de trades do backend
			async fetchTradeHistory() {
				try {
					const userId = this.getUserId();
					if (!userId) {
						console.warn('[AgenteAutonomoActive] âš ï¸ userId nÃ£o disponÃ­vel para buscar histÃ³rico de trades');
						return;
					}
					
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const url = `${apiBase}/autonomous-agent/trade-history/${userId}?limit=50`;
					console.log('[AgenteAutonomoActive] ðŸ“¡ Buscando histÃ³rico de trades:', url);
					
					const response = await fetch(url, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					
					if (!response.ok) {
						console.warn(`[AgenteAutonomoActive] âš ï¸ Resposta nÃ£o OK ao buscar trades: ${response.status} ${response.statusText}`);
						return;
					}
					
					const result = await response.json();
					console.log('[AgenteAutonomoActive] ðŸ“¦ HistÃ³rico de trades recebido:', { success: result.success, dataLength: result.data?.length || 0 });
					
					if (result.success && result.data && Array.isArray(result.data)) {
						// Atualizar localTradeHistory (variÃ¡vel local no data)
						this.localTradeHistory = result.data;
						console.log('[AgenteAutonomoActive] âœ… HistÃ³rico de trades atualizado:', result.data.length, 'trades');
					} else {
						console.warn('[AgenteAutonomoActive] âš ï¸ Resposta sem dados vÃ¡lidos de trades:', result);
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] âŒ Erro ao buscar histÃ³rico de trades:', error);
				}
			},
			
			// âœ… REMOVIDO: Todo o cÃ³digo do WebSocket foi removido
			// Agora usamos polling HTTP para buscar ticks do backend (como na IA)
			// O backend gerencia o WebSocket com a Deriv
			
			// ============================================
			// GRÃFICO DO ÃNDICE R_75
			// ============================================
			initIndexChart() {
				if (this.indexChartInitialized || !this.$refs.indexChartContainer) {
					return;
				}
				
				try {
					const container = this.$refs.indexChartContainer;
					
					// Verificar se o container tem dimensÃµes vÃ¡lidas
					if (container.offsetWidth === 0 || container.offsetHeight === 0) {
						console.warn('[AgenteAutonomoActive] Container sem dimensÃµes, tentando novamente...');
						setTimeout(() => this.initIndexChart(), 500);
						return;
					}
					
					const containerWidth = container.offsetWidth || 800;
					const containerHeight = container.offsetHeight || 400;
					
					console.log('[AgenteAutonomoActive] Inicializando grÃ¡fico com dimensÃµes:', containerWidth, 'x', containerHeight);
					
					this.indexChart = createChart(container, {
						width: containerWidth,
						height: containerHeight,
						autoSize: true,
						localization: { 
							locale: 'pt-BR',
							timeFormatter: (time) => {
								const date = new Date(time * 1000);
								const hours = String(date.getHours()).padStart(2, '0');
								const minutes = String(date.getMinutes()).padStart(2, '0');
								return `${hours}:${minutes}`;
							}
						},
						layout: {
							background: { type: ColorType.Solid, color: '#0B0B0B' },
							textColor: '#DFDFDF',
						},
						rightPriceScale: {
							borderColor: '#1C1C1C',
						},
						leftPriceScale: {
							visible: false,
						},
						timeScale: {
							borderColor: '#1C1C1C',
							timeVisible: true,
							secondsVisible: false,
						},
						grid: {
							vertLines: { color: 'rgba(148, 163, 184, 0.1)', visible: true },
							horzLines: { color: 'rgba(148, 163, 184, 0.1)', visible: true },
						},
					});
					
					this.indexChartSeries = this.indexChart.addLineSeries({
						color: '#22C55E',
						lineWidth: 2,
						priceFormat: {
							type: 'price',
							precision: 1,
							minMove: 0.1,
						},
					});
					
					this.indexChartInitialized = true;
					console.log('[AgenteAutonomoActive] GrÃ¡fico inicializado. Ticks disponÃ­veis:', this.priceTicks.length);
					
					if (this.priceTicks.length > 0) {
						this.updateIndexChart();
					} else {
						console.warn('[AgenteAutonomoActive] Nenhum tick disponÃ­vel para plotar - tentando buscar histÃ³rico...');
						// Tentar buscar histÃ³rico se ainda nÃ£o tiver dados
						this.fetchPriceHistory();
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao inicializar Gráfico de Ã­ndice:', error);
					this.indexChartInitialized = false;
				}
			},
			
			updateIndexChart() {
				if (!this.indexChartInitialized || !this.indexChartSeries) {
					console.warn('[AgenteAutonomoActive] GrÃ¡fico nÃ£o inicializado ou sÃ©rie nÃ£o disponÃ­vel');
					return;
				}
				
				if (this.priceTicks.length === 0) {
					console.warn('[AgenteAutonomoActive] Nenhum tick disponÃ­vel para atualizar grÃ¡fico');
					return;
				}
				
				try {
					// âœ… SEGUINDO PADRÃƒO DA IA: Processamento robusto de ticks
					const sortedTicks = [...this.priceTicks]
						.map(tick => {
							// Extrair time de forma robusta (como na IA)
							let time = tick.epoch || tick.time;
							if (!time) {
								// Tentar extrair de timestamp se disponÃ­vel
								if (tick.timestamp) {
									time = Math.floor(new Date(tick.timestamp).getTime() / 1000);
								} else {
									time = Date.now() / 1000;
								}
							} else if (time > 10000000000) {
								// Se for timestamp em milissegundos, converter para segundos
								time = Math.floor(time / 1000);
							} else {
								time = Math.floor(time);
							}
							
							// âœ… Extrair value de forma robusta - tentar todas as propriedades possÃ­veis (como na IA)
							let rawValue = tick.value ?? tick.price ?? tick.quote ?? tick.close ?? tick.spot ?? null;
							
							// Se ainda for null/undefined, pular este tick
							if (rawValue == null || rawValue === undefined) {
								return null;
							}
							
							// Converter para nÃºmero
							const value = Number(rawValue);
							
							// Validar antes de retornar (como na IA)
							if (isNaN(value) || !isFinite(value) || value <= 0 || time <= 0) {
								return null;
							}
							
							return { time, value };
						})
						.filter(point => {
							// âœ… CORREÃ‡ÃƒO: Filtrar valores null, undefined, NaN, 0 e negativos (como na IA)
							if (!point) return false;
							return point.value != null
								&& !isNaN(point.value)
								&& isFinite(point.value)
								&& point.value > 0
								&& point.time != null
								&& !isNaN(point.time)
								&& isFinite(point.time)
								&& point.time > 0;
						})
						.sort((a, b) => a.time - b.time);
					
					if (sortedTicks.length === 0) {
						console.warn('[AgenteAutonomoActive] Nenhum tick vÃ¡lido apÃ³s filtragem');
						return;
					}
					
					// âœ… ValidaÃ§Ã£o final: garantir que nÃ£o hÃ¡ valores null/undefined (como na IA)
					const validTicks = sortedTicks.filter(point => {
						return point
							&& typeof point.time === 'number'
							&& typeof point.value === 'number'
							&& point.time > 0
							&& point.value > 0
							&& isFinite(point.time)
							&& isFinite(point.value);
					});
					
					if (validTicks.length === 0) {
						console.warn('[AgenteAutonomoActive] Nenhum tick vÃ¡lido apÃ³s validaÃ§Ã£o final');
						return;
					}
					
					// Limitar dados para melhor performance (Ãºltimos 200 pontos)
					const limitedData = validTicks.slice(-200);
					
					console.log('[AgenteAutonomoActive] Atualizando grÃ¡fico com', limitedData.length, 'pontos vÃ¡lidos de', this.priceTicks.length, 'ticks totais');
					
					// âœ… Usar setData com dados validados
					this.indexChartSeries.setData(limitedData);
					this.indexChart.timeScale().fitContent();
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao atualizar Gráfico de Ã­ndice:', error);
				}
			},
			getUserId() {
				// Tentar obter do localStorage primeiro
				const userStr = localStorage.getItem("user");
				if (userStr) {
					try {
						const user = JSON.parse(userStr);
						if (user.id || user.userId) {
							return user.id || user.userId;
						}
					} catch (error) {
						console.error("[AgenteAutonomoActive] Erro ao parsear user:", error);
					}
				}

				// Fallback: tentar decodificar do token JWT
				const token = localStorage.getItem("token");
				if (token) {
					try {
						const payload = JSON.parse(atob(token.split('.')[1]));
						// Tentar diferentes campos comuns do payload JWT
						if (payload.userId || payload.sub || payload.id) {
							const userId = payload.userId || payload.sub || payload.id;
							console.log("[AgenteAutonomoActive] userId obtido do token JWT:", userId);
							return userId;
						}
					} catch (error) {
						console.error("[AgenteAutonomoActive] Erro ao decodificar token JWT:", error);
					}
				}

				console.warn("[AgenteAutonomoActive] NÃ£o foi possÃ­vel obter userId");
				console.warn("[AgenteAutonomoActive] NÃ£o foi possÃ­vel obter userId");
				return null;
			},

			checkStopLossState() {
				const lastHit = localStorage.getItem('agent_stop_loss_date');
				if (lastHit) {
					const today = new Date().toDateString();
					if (lastHit === today) {
						this.showStopLossModal = true;
					} else {
						// Novo dia, limpar estado
						localStorage.removeItem('agent_stop_loss_date');
						this.showStopLossModal = false;
					}
				}
			},
			
			pausarAgenteEIrParaTopo() {
				console.log('[AgenteAutonomoActive] BotÃ£o pausar clicado, emitindo evento pausar-agente');
				this.$emit('pausar-agente'); // Usa apenas o padrÃ£o kebab-case para evitar duplicidade
				this.$nextTick(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou 'instant'
				});
			},
			
			// âœ… MÃ©todos para logs (igual Ã  IA)
			async fetchRealtimeLogs() {
				try {
					const userId = this.getUserId();
					if (!userId) {
						console.warn('[AgenteAutonomoActive] âš ï¸ UserId nÃ£o disponÃ­vel para buscar logs');
						return;
					}
					
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const url = `${apiBase}/autonomous-agent/logs/${userId}?limit=100`;
					
					const response = await fetch(url, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					
					if (!response.ok) {
						console.warn('[AgenteAutonomoActive] âš ï¸ Erro ao buscar logs:', response.status);
						return;
					}
					
					const result = await response.json();
					if (result.success && result.data && Array.isArray(result.data)) {
						// Converter logs para o formato esperado (igual Ã  IA)
						const newLogs = result.data.map(log => {
							// Determinar tipo e Ã­cone baseado no mÃ³dulo e mensagem
							let type = 'info';
							let icon = 'â„¹ï¸';
							
							if (log.module === 'TRADER' || log.module === 'API') {
								if (log.level === 'ERROR' || log.message?.toLowerCase().includes('loss') || 
									log.message?.toLowerCase().includes('lost') || log.message?.toLowerCase().includes('perda')) {
									type = 'erro';
									icon = 'ðŸš«';
								} else if (log.message?.toLowerCase().includes('profit') || log.message?.toLowerCase().includes('won') || 
									log.message?.toLowerCase().includes('lucro') || log.message?.toLowerCase().includes('ganho')) {
									type = 'resultado';
									icon = 'âœ…';
								} else if (log.message?.toLowerCase().includes('buy') || log.message?.toLowerCase().includes('proposal') || 
									log.message?.toLowerCase().includes('comprando')) {
									type = 'operacao';
									icon = 'ðŸ’°';
								}
							} else if (log.module === 'ANALYZER') {
								type = 'analise';
								icon = 'ðŸ”';
							} else if (log.module === 'RISK') {
								type = 'alerta';
								icon = 'âš ï¸';
							} else if (log.module === 'CORE') {
								type = 'info';
								icon = 'â„¹ï¸';
							}
							
							// Formatar timestamp (HH:mm:ss)
							let timestamp = '--';
							if (log.timestamp) {
								try {
									const date = new Date(log.timestamp);
									if (!isNaN(date.getTime())) {
										// Formato: HH:mm:ss
										const hours = String(date.getHours()).padStart(2, '0');
										const minutes = String(date.getMinutes()).padStart(2, '0');
										const seconds = String(date.getSeconds()).padStart(2, '0');
										timestamp = `${hours}:${minutes}:${seconds}`;
									}
								} catch (error) {
									timestamp = '--';
								}
							}
							
							// Limpar mensagem removendo prefixos duplicados
							let cleanMessage = log.message || '';
							cleanMessage = cleanMessage.replace(/^\[.*?\]\s*-\s*/g, '');
							
							return {
								id: log.id,
								timestamp,
								type,
								icon,
								message: cleanMessage,
								module: log.module,
								level: log.level || log.logLevel,
							};
						});
						
						// âœ… Verificar logs de Stop Loss
						const stopLossLog = newLogs.find(l => l.message && (l.message.includes('LIMITE DE PERDA ATINGIDO') || l.message.includes('daily_loss=')));
						if (stopLossLog) {
							const today = new Date().toDateString();
							const lastHit = localStorage.getItem('agent_stop_loss_date');
							
							// Se ainda nÃ£o foi mostrado hoje
							if (lastHit !== today) {
								console.log('[AgenteAutonomoActive] âš ï¸ Stop Loss detectado: ativando modal');
								this.showStopLossModal = true;
								localStorage.setItem('agent_stop_loss_date', today);
							}
						}
						
						if (!this.realtimeLogs || this.realtimeLogs.length === 0 || !this.lastLogTimestamp) {
							this.realtimeLogs = newLogs;
							if (this.realtimeLogs && this.realtimeLogs.length > 0) {
								this.lastLogTimestamp = this.realtimeLogs[0].timestamp;
							}
							
							this.$nextTick(() => {
								if (this.$refs.logsContainer) {
									this.$refs.logsContainer.scrollTop = 0;
								}
							});
						} else {
							if (!this.realtimeLogs) {
								this.realtimeLogs = [];
							}
							const existingIds = new Set(this.realtimeLogs.map(log => log.id || log.timestamp));
							const logsToAdd = newLogs.filter(log => {
								const logId = log.id || log.timestamp;
								return !existingIds.has(logId);
							});
							
							if (logsToAdd.length > 0) {
								const container = this.$refs.logsContainer;
								const isAtTop = container && container.scrollTop <= 50;
								
								this.realtimeLogs = [...logsToAdd, ...this.realtimeLogs];
								this.lastLogTimestamp = this.realtimeLogs[0].timestamp;
								
								this.$nextTick(() => {
									if (container && isAtTop) {
										container.scrollTop = 0;
									}
								});
							}
						}
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] âŒ Erro ao buscar logs:', error);
				}
			},
			
			getLogClass(log) {
				const colors = {
					info: 'text-blue-400',
					tick: 'text-gray-400',
					analise: 'text-purple-400',
					sinal: 'text-yellow-400',
					operacao: 'text-cyan-400',
					resultado: 'text-green-400',
					alerta: 'text-orange-400',
					erro: 'text-red-500'
				};
				
				return colors[log.type] || 'text-gray-400';
			},
			
			exportLogs() {
				if (!this.realtimeLogs || this.realtimeLogs.length === 0) return;
				
				const text = this.realtimeLogs.map(log => {
					return `[${log.timestamp}] ${log.icon} ${log.message}`;
				}).join('\n');
				
				const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `agente-autonomo-logs-${new Date().toISOString().split('T')[0]}.txt`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			},
			
			clearLogs() {
				this.realtimeLogs = [];
				this.lastLogTimestamp = null;
			},
			
			startLogsPolling() {
				this.stopLogsPolling();
				
				// Buscar logs imediatamente
				this.fetchRealtimeLogs();
				
				// Polling a cada 2 segundos (igual Ã  IA)
				this.logsPollingInterval = setInterval(() => {
					if (this.abaAtiva === 'registro') {
						this.fetchRealtimeLogs();
					} else {
						this.stopLogsPolling();
					}
				}, 2000);
			},
			
			stopLogsPolling() {
				if (this.logsPollingInterval) {
					clearInterval(this.logsPollingInterval);
					this.logsPollingInterval = null;
				}
			}
		},
	};
</script>

<style scoped>
	/* Estilos globais/Base */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.layout-content-agent-autonomo {
		font-family: -apple-system, BlinkMacMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		color: #f0f0f0;
		
	}

	.metric-card,
	.chart-section {
		background: #0e0e0e;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.history-section,
	.actions-section {
		background: #0e0e0e;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.progress-card {
		background: #0e0e0e;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.agent-top {
		background: transparent;
		padding: 30px;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
	}

	.agent-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		padding-bottom: 15px;
	}

	.agent-status {
		display: flex;
		align-items: center;
		flex-grow: 1;
	}

	.agent-title {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex-grow: 1;
		background: transparent;
		padding: 10px 0;
		margin-right: 20px;
		border-radius: 8px;
		border: none;
		min-height: 55px;
		justify-content: center;
	}

	.agent-title h2 {
		font-size: 20px;
		font-weight: 700;
		color: white;
		margin: 0;
	}

	.agent-subtitle {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: #cfcdcd;
	}

	.status-badge {
		background: #1a4d2e8e;
		border: 1px solid #1a4d2e;
		color: #ffffff;
		padding: 4px 12px;
		border-radius: 3px;
		font-weight: 700;
		font-size: 11px;
	}

	.status-dot {
		display: flex;
		align-items: center;
		color: #22c55e;
		font-size: 18px;
	}

	.agent-right {
		display: flex;
		align-items: center;
	}

	.top-pause-btn {
		background: #FFD700;
		color: #000;
		border: none;
		padding: 10px 20px;
		border-radius: 12px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background 0.2s;
		height: 55px;
	}

	.top-pause-btn:hover {
		background: #FFC700;
	}

	.pause-icon {
		font-size: 14px;
		font-weight: bold;
	}

	.data-row-line {
		display: flex;
		justify-content: space-between;
		gap: 40px;
		margin-bottom: 20px;
	}

	.data-item {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		text-align: left;
		gap: 0;
		font-size: 12px;
		color: #666;
	}

	.data-item .icon-bullet {
		font-size: 0.8rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.data-label {
		font-size: 1rem;
	}

	.data-item .data-label {
		color: #f0f0f0;
		font-weight: 500;
		text-align: left;
	}

	.pause-agent-data-btn {
		background: #FFD700;
		color: #000;
		border: none;
		padding: 10px 16px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 12px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition: background 0.2s;
		width: 100%;
		height: 100%;
		min-height: 40px;
	}

	.pause-agent-data-btn:hover {
		background: #FFC700;
	}

	.pause-agent-data-btn .pause-icon {
		font-size: 12px;
		font-weight: bold;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr;
		gap: 15px;
		margin-top: 1.5rem;
		background: transparent;
	}

	.metric-card {
		background: #0e0e0e;
		border: 1px solid #1a1a1a;
		border-radius: 6px;
		padding: 20px;
		text-align: left;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}

	.metric-label {
		font-size: 12px;
		color: #a09e9e;
		text-transform: capitalize;
		text-align: left;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
	}

	.progress-percentage {
		font-size: 12px;
		color: #a09e9e;
		font-weight: 500;
		margin-left: auto;
	}

	.metric-box {
		display: flex;
		flex-direction: column;
	}

	.metric-value-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin: 5px 0;
		flex-wrap: wrap;
	}

	.metric-icon {
		font-size: 12px;
		flex-shrink: 0;
		margin-right: 2px;
	}

	.metric-icon.positive {
		color: #22C55E;
	}

	.metric-icon.negative {
		color: #9CA3AF; /* Cinza quando negativo */
	}

	.metric-value {
		font-size: 20px;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
	}

	.metric-card .arrow {
		font-size: 30px;
		position: relative;
	}

	.metric-value .arrow {
		font-size: 20px;
	}

	.metric-card .arrow.positive {
		color: #3eb83e;
	}

	.metric-card .arrow.negative {
		color: #ff4444;
	}

	.metric-value.positive {
		color: #22C55E;
	}

	.metric-value.negative {
		color: #9CA3AF; /* Cinza quando negativo */
	}

	.metric-change {
		font-size: 13px;
	}

	.metric-change.positive {
		color: #22C55E;
	}

	.metric-change.negative {
		color: #9CA3AF; /* Cinza quando negativo */
	}

	.progress-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.progress-bar-container {
		margin-top: 10px;
		margin-bottom: 0px;
	}

	.progress-bar {
		width: 100%;
		height: 20px !important;
		background: #1a1a1a;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.progress-fill {
		height: 100%;
		background: #22C55E;
		transition: width 0.5s;
		position: absolute;
		left: 0;
		top: 0;
	}

	.progress-percentage-text,
	.progress-percentage {
		position: absolute;
		font-size: 10px;
		font-weight: 600;
		color: #FFFFFF;
		z-index: 10;
		text-align: center;
		width: 100%;
		pointer-events: none;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #666;
	}

	.chart-section {
		padding: 20px;
		margin-top: 1.5rem;
		background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
	}

	.chart-controls {
		display: flex;
		flex-direction: column;
		gap: 20px;
		font-size: 13px;
		color: #666;
		padding-bottom: 15px;
		border-bottom: 1px solid #1a1a1a;
		margin-bottom: 20px;
	}

	.tab-controls {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		gap: 20px;
	}

	.toggle-tab {
		cursor: pointer;
		padding: 0 2px 8px 2px;
		transition: all 0.1s;
		color: #666;
		font-weight: 500;
	}

	.toggle-tab:hover {
		color: #999;
	}

	.chart-title-active {
		font-weight: 600;
		color: #f0f0f0;
		border-bottom: 2px solid #22C55E;
	}

	.performance {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.performance-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		gap: 15px;
		flex: 1;
	}

	.performance-title-wrapper {
		display: flex;
		flex-direction: column;
		gap: 5px;
		flex: 1;
	}

	.performance-title {
		font-weight: 500;
		color: #e7e7e7;
		font-size: 1.2rem;
		text-align: left;
	}

	.update-info {
		color: #666;
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 0.875rem;
	}

	.mobile-period-select {
		display: none;
	}

	.mobile-performance-header {
		display: none;
	}

	.desktop-performance-header {
		display: flex;
	}

	@media (max-width: 768px) {
		.mobile-performance-header {
			display: flex;
		}
		
		.desktop-performance-header {
			display: none !important;
		}
	}

	.mobile-history-header {
		display: none;
	}

	.mobile-history-cards {
		display: none;
	}

	.mobile-performance-cards {
		display: none;
	}

	.mobile-pause-agent-btn {
		display: none;
	}

	.mobile-period-select {
		display: none;
	}

	.desktop-history-table {
		display: block;
	}

	.chart-settings {
		margin-left: auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: flex-end;
		gap: 20px;
		font-size: 11px;
		color: #666;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.control-div {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.custom-select,
	.custom-input-date {
		background-color: #0a0a0a;
		color: #f0f0f0;
		border: 1px solid #1a1a1a;
		border-radius: 3px;
		padding: 4px 10px;
		font-size: 11px;
		cursor: pointer;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		height: 40px;
	}

	.custom-input-date {
		width: 120px;
		padding: 4px 8px;
		cursor: text;
	}

	.export-btn {
		background: #22c55e1a;
		color: #22C55E;
		border: 1px solid #22C55E;
		padding: 8px 10px;
		border-radius: 3px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		width: 100%;
		max-width: 180px;
	}

	.export-btn:hover {
		background: #1a4d2e8e;
	}

	.chart-content {
		min-height: 350px;
	}

	.chart-canvas {
		position: relative;
		height: 400px;
		overflow: hidden;
		background-color: #000000;
		border: 1px solid #1a1a1a;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	.register-content {
		min-height: 400px;
		display: flex;
		flex-direction: column;
	}

	.register-content.hidden {
		display: none;
	}
	
	/* âœ… Estilos de logs igual Ã  IA */
	.desktop-register-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		padding: 0 0.5rem;
	}
	
	.desktop-register-list {
		display: block;
		flex: 1;
		background: #000000;
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-y: auto;
		font-family: monospace;
		font-size: 0.75rem;
		line-height: 1.75;
		scroll-behavior: smooth;
		/* âœ… Limitar altura para mostrar no mÃ¡ximo 30 linhas */
		max-height: calc(1.75rem * 30 + 2rem); /* 30 linhas * line-height + padding */
	}
	
	.log-entry {
		margin-bottom: 0.375rem;
		text-align: left;
	}
	
	.log-message {
		word-break: break-word;
	}
	
	/* Mobile: Register Cards - escondido por padrÃ£o no desktop */
	.mobile-register-cards {
		display: none;
		flex: 1;
		overflow-y: auto;
		/* âœ… Limitar altura para mostrar no mÃ¡ximo 30 linhas no mobile */
		max-height: calc(1.75rem * 30 + 2rem); /* 30 linhas * line-height + padding */
		padding: 0;
	}
	
	.mobile-register-cards-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0;
	}
	
	.mobile-register-card {
		background: rgba(0, 0, 0, 0.4);
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		text-align: left;
	}
	
	.mobile-register-time {
		font-size: 0.75rem;
		color: #A0A0A0;
		font-weight: 400;
		text-align: left;
		margin-bottom: 0.125rem;
	}
	
	.mobile-register-message {
		font-size: 0.875rem;
		color: #FFFFFF;
		text-align: left;
		word-break: break-word;
	}
	
	.mobile-register-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		color: #A1A1A1;
	}
	
	.mobile-register-empty i {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #7D7D7D;
	}
	
	.mobile-register-empty p {
		font-size: 0.875rem;
		margin: 0.5rem 0;
	}
	
	.mobile-register-empty-subtitle {
		font-size: 0.75rem;
		color: #7D7D7D;
	}
	
	/* Mobile: Mostrar cards, esconder lista desktop */
	@media (max-width: 768px) {
		.desktop-register-list {
			display: none !important;
		}
		
		.desktop-register-header {
			display: none !important;
		}
		
		.mobile-register-cards {
			display: block !important;
		}
	}
	
	/* Desktop: Esconder cards, mostrar lista */
	@media (min-width: 769px) {
		.desktop-register-list {
			display: block !important;
		}
		
		.mobile-register-cards {
			display: none !important;
		}
	}
	
	/* Cores para mensagens de log */
	.mobile-register-message .text-blue-400 {
		color: #60a5fa;
	}
	
	.mobile-register-message .text-gray-400 {
		color: #9ca3af;
	}
	
	.mobile-register-message .text-purple-400 {
		color: #c084fc;
	}
	
	.mobile-register-message .text-yellow-400 {
		color: #facc15;
	}
	
	.mobile-register-message .text-cyan-400 {
		color: #22d3ee;
	}
	
	.mobile-register-message .text-green-400 {
		color: #4ade80;
	}
	
	.mobile-register-message .text-orange-400 {
		color: #fb923c;
	}
	
	.mobile-register-message .text-red-500 {
		color: #ef4444;
	}
	
	/* Custom scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}
	
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #2C2C2C;
		border-radius: 4px;
	}
	
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #3C3C3C;
	}
	
	#contentHistorico.history-content,
	.history-content {
		display: flex;
		flex-direction: column;
		min-height: 400px;
	}
	
	#contentHistorico.history-content.hidden,
	.history-content.hidden {
		display: none;
	}

	.history-header {
		display: block;
		margin-bottom: 20px;
	}

	.history-header h3 {
		font-weight: 500;
		color: #e7e7e7;
		font-size: 1.2rem;
		text-align: left;
		padding-bottom: 0;
		border-bottom: none;
		margin-bottom: 0;
		width: 100%;
	}

	.chart-placeholder {
		color: #333;
		font-style: italic;
		font-size: 13px;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.index-chart-container {
		margin-bottom: 30px;
		background: #0b0b0b;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
		padding: 0;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 400px;
		width: 100%;
	}
	
	.market-chart-wrapper {
		width: 100% !important;
		flex: 1;
		min-height: 400px;
		position: relative;
		padding: 0;
		margin: 0;
	}
	
	.chart-title {
		font-size: 14px;
		font-weight: 600;
		color: #e7e7e7;
		margin-bottom: 10px;
		text-align: left;
	}
	
	@media (max-width: 768px) {
		.index-chart-container {
			padding: 10px;
		}
	}

	.table-scroll-wrapper {
		max-height: 300px;
		overflow-y: auto;
	}

	.operations-table {
		width: 100%;
		border-collapse: collapse;
	}

	.operations-table th {
		text-align: left;
		padding: 12px;
		font-size: 14px;
		color: #666;
		border-bottom: 1px solid #1a1a1a;
		font-weight: 700;
		text-transform: uppercase;
		background-color: #0e0f0f;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.operations-table td {
		text-align: left;
		padding: 12px;
		font-size: 13px;
		border-bottom: 1px solid #1a1a1a;
		color: #ccc;
	}

	.operations-table tr:hover {
		background: #0f0f0f;
	}

	.operations-table td.result-positive {
		color: #22c55e !important;
		font-weight: 600;
	}

	.operations-table td.result-negative {
		color: #888888 !important;
		font-weight: 600;
	}

	.history-footer {
		display: flex;
		justify-content: center;
		padding: 15px 0;
		border-top: 1px solid #1a1a1a;
	}

	.total-operations-info {
		font-size: 13px;
		color: #7c7c7c;
	}

	.actions-section {
		padding: 20px;
		margin-top: 1.5rem;
	}

	.actions-header h3 {
		font-weight: 500;
		color: #e7e7e7;
		font-size: 1.2rem;
		text-align: left;
		padding-bottom: 15px;
		border-bottom: 1px solid #1a1a1a;
		margin-bottom: 10px;
	}

	.actions-list {
		display: flex;
		flex-direction: column;
	}

	.action-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid #1a1a1a;
	}

	.actions-section .actions-list .action-item:last-child {
		border-bottom: none;
	}

	.action-icon {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.action-icon.success {
		background: #22C55E;
	}

	.action-icon.info {
		background: #919090;
	}

	.action-icon.warning {
		background: #ffaa00;
	}

	.action-icon.error {
		background: #ff4444;
	}

	.action-content {
		flex-grow: 1;
	}

	.action-title {
		font-size: 15px;
		font-weight: 500;
		margin-bottom: 4px;
		color: #f0f0f0;
		text-align: left;
	}

	.action-description {
		font-size: 13px;
		color: #7c7c7c;
		text-align: left;
	}

	.hidden {
		display: none;
	}

	.progress-card {
		background: #0e0e0e;
	}
	
	.chart-section {
		background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
	}

	.history-section,
	.actions-section,
	.metric-card {
		background: #0e0e0e;
	}
	@media (min-width: 1024px) {
		.agent-title-mobile{
			display: none;
		}
	}

	/* Desktop: garantir que todos os cards tenham #0e0e0e */
	@media (min-width: 1025px) {
		.metric-card,
		.history-section,
		.actions-section,
		.progress-card {
			background: #0e0e0e !important;
		}
		
		.chart-section {
			background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
		}

		.agent-title {
			background: #0e0e0e !important;
		}
	}
	@media (max-width: 768px) {
	.layout-content-agent-autonomo {
		padding: 10px 0;
	}

	.agent-top {
		padding: 30px 0px 0px 0;
		background: none;
		border: none;
	}

	.agent-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 15px;
	}

	.agent-status {
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
	}

	.agent-title {
		margin-right: 0;
		width: 100%;
	}

	.agent-right {
		width: 100%;
		justify-content: flex-end;
	}

	.top-pause-btn {
		width: 100%;
		justify-content: center;
		height: auto;
		padding: 12px 20px;
		font-size: 14px;
	}

	/* ðŸ‘‡ AlteraÃ§Ã£o aqui ðŸ‘‡ */
	.data-row-line {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
	}

	.data-item {
		width: 100%;
	}

	.metrics-grid {
		grid-template-columns: 1fr;
		gap: 10px;
		
	}

	.metric-card,
	.progress-card {
		flex-direction: row;
		align-items: center;
		gap: 15px;
	}

	.metric-box {
		flex-grow: 1;
	}

	.progress-card {
		flex-direction: column;
	}

	.chart-section {
		padding: 15px;
		background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
	}

	.chart-controls {
		flex-direction: column;
		gap: 15px;
	}

	.tab-controls {
		width: 100%;
		justify-content: space-around;
	}

	.performance {
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		width: 100%;
	}

	.performance-header {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}

		.update-info {
			margin-left: 0;
			margin-right: 0;
		}

		.mobile-hide {
			display: none !important;
		}

		.mobile-hide-on-history {
			display: none !important;
		}


		.history-header {
			display: none !important;
		}

		.mobile-history-header {
			display: block;
			margin-bottom: 20px;
			text-align: left;
		}

		.mobile-history-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #f0f0f0;
			margin: 0 0 8px 0;
			text-align: left;
		}

		.mobile-history-subtitle {
			font-size: 0.875rem;
			color: #a09e9e;
			margin: 0;
			text-align: left;
		}

		.mobile-history-cards {
			display: flex;
			flex-direction: column;
			gap: 15px;
			max-height: 60vh;
			overflow-y: auto;
		}

		.mobile-history-card {
			background: #0e0e0e !important;
			border: none;
			border-radius: 8px;
			
			padding: 15px;
			
			border: 1px solid #1a1a1a;
		}

		.mobile-history-card-header {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 12px;
			padding-bottom: 12px;
			border-bottom: 1px solid #1a1a1a;
		}

		.mobile-history-time {
			font-size: 14px;
			color: #f0f0f0;
			font-weight: 500;
		}

		.mobile-history-badge {
			padding: 4px 10px;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 600;
		}

		.badge-call {
			background: #22C55E;
			color: #000;
		}

		.badge-put {
			background: #ff4444;
			color: #fff;
		}

		.mobile-history-volume {
			font-size: 12px;
			color: #a09e9e;
			margin-left: auto;
		}

		.mobile-history-details {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 10px;
		}

		.mobile-history-detail-column {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.detail-label {
			font-size: 12px;
			color: #a09e9e;
			text-align: left;
		}

		.detail-value {
			font-size: 14px;
			font-weight: 500;
			color: #f0f0f0;
			text-align: left;
		}

		.detail-value.result-positive {
			color: #22C55E;
		}

		.detail-value.result-negative {
			color: #ff4444;
		}

		.desktop-history-table {
			display: none !important;
		}

	.chart-settings {
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}

	.control-group {
		width: 100%;
	}

	.custom-select,
	.custom-input-date {
		width: 100%;
		max-width: none;
	}

	.export-btn {
		width: 100%;
		max-width: none;
	}

	.chart-content {
		min-height: 250px;
	}

	.chart-canvas {
		height: 250px;
	}

	.table-scroll-wrapper {
		max-height: 250px;
	}

	.operations-table th,
	.operations-table td {
		padding: 8px 6px;
		font-size: 12px;
	}

	.actions-section {
		padding: 15px;
	}

	.actions-header h3 {
		font-size: 1rem;
	}

	.action-item {
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	.action-icon {
		width: 10px;
		height: 10px;
	}

	.action-title {
		font-size: 14px;
	}

	.action-description {
		font-size: 12px;
	}

	.icon-bullet img{
		display: none  !important;;
	}

	.data-item{
		border: #1d1d1c 1px solid;
		background: #0a120c;
		padding: 10px;
		gap: 0;
		border-radius: 8px;
	}

	.data-item.no-padding {
		padding: 0 !important;
	}

	.data-label{
		font-size: 14px;
	}

	.pause-agent-data-btn {
		width: 100%;
		min-height: 45px;
		font-size: 11px;
		padding: 8px 12px;
	}

	.pause-btn{
		display: none;
	}

	.agent-title{
		display: none;
	}

	.agent-title-mobile{
		display: flex;

	}

	.agent-header{
		margin: 0;
	}

	.agent-title-mobile{
		display: flex;
		justify-content: space-between !important;
		flex-direction: row;
		width: 100% !important;
		align-items: center;

	
	}

	.agent-title-header h2 {
		font-weight: 700;
	}

	.agent-title-header p{
		font-size: 14px;
		color: #89909b;
	}

	.dot{
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		color: #22C55E;
	}

	.dot span{
		font-size: 15px;
		box-shadow:0px 0px 10px 2px #c3c4c3;
		border-radius: 50%;
		width: 4px;
		height: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}	

	.metric-negative{
		display: none;
	}

	.metrics-grid{
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid #333;
		border-radius: 12px;
		background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
	}

	.metric-card{
		background: none;
		margin: 20px;
		border: none;
		border-bottom: 1px solid #333;
		border-radius: 0%;
		padding: 0px 0px 20px 0;
	}

	.progress-card{
		margin: 0;
		border: none;
		padding: 0px 20px 0;
		background: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 10px;
	}

	.arrow{
		display: none;
	}

	.progress-bar-container{
		width: 100%;
	}

	.progress-label{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		font-size: 14px;
		color: #89909b;
		font-weight: 500;
		margin-bottom: 10px;
		padding: 10px;
	}

	.actions-section{
		display: none;
	}

	/* Performance cards mobile */
	.mobile-performance-cards {
		display: none;
	}

	.mobile-pause-agent-btn {
		display: none;
	}

	.mobile-period-select {
		display: none;
	}

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

.visibility-btn {
background: none;
border: none;
color: #A0A0A0;
cursor: pointer;
font-size: 0.875rem;
display: flex;
align-items: center;
gap: 6px;
}

.header-pause-btn {
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

.header-pause-btn:hover {
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
background-color: #0E0E0E;
border: 1px solid #1C1C1C;
border-radius: 8px;
padding: 16px;
display: flex;
flex-direction: column;
gap: 12px;
}

.new-metric-card.highlight-card {
border-color: #22C55E;
background-color: rgba(34, 197, 94, 0.02);
}

.card-header {
display: flex;
align-items: center;
gap: 8px;
font-size: 0.75rem;
text-transform: uppercase;
color: #A0A0A0;
letter-spacing: 0.5px;
}

.card-header i {
color: #22C55E;
}

.card-value {
font-size: 1.5rem;
font-weight: 700;
color: #F0F0F0;
}

.card-value-fiat {
font-size: 0.75rem;
color: #666;
margin-top: -8px;
}

.card-value.highlight {
color: #22C55E;
}

.profit-badge {
display: inline-flex;
padding: 2px 8px;
border-radius: 12px;
font-size: 0.75rem;
font-weight: 600;
margin-left: 8px;
}

.profit-badge.positive {
background-color: rgba(34, 197, 94, 0.1);
color: #22C55E;
}

.profit-badge.negative {
background-color: rgba(239, 68, 68, 0.1);
color: #EF4444;
}

.per-op {
font-size: 0.875rem;
color: #A0A0A0;
font-weight: normal;
}

/* Linha de Métricas Adicionais */
.additional-metrics-row {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 16px;
margin-bottom: 24px;
padding: 0 20px;
border-bottom: 1px solid #1C1C1C;
padding-bottom: 24px;
}

.add-metric {
display: flex;
flex-direction: column;
gap: 4px;
}

.add-label {
font-size: 0.75rem;
color: #666;
text-transform: uppercase;
display: flex;
align-items: center;
gap: 6px;
}

.add-value {
font-size: 1rem;
font-weight: 600;
color: #F0F0F0;
display: flex;
align-items: center;
gap: 8px;
}

.add-value.positive {
color: #22C55E;
}

.strategy-tag {
display: flex;
align-items: center;
gap: 6px;
color: #F0F0F0;
}

.strategy-tag i {
color: #22C55E;
font-size: 0.75rem;
}

/* Seção de Performance */
.performance-chart-section {
padding: 0 20px;
margin-bottom: 30px;
}

.chart-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
}

.chart-title {
display: flex;
align-items: center;
gap: 8px;
font-size: 0.875rem;
font-weight: 600;
color: #F0F0F0;
text-transform: uppercase;
}

.chart-title i {
color: #22C55E;
}

.period-tabs {
font-size: 0.75rem;
color: #666;
}

.performance-chart-container {
height: 300px;
background: linear-gradient(180deg, rgba(34, 197, 94, 0.05) 0%, rgba(14, 14, 14, 0) 100%);
border-bottom: 1px solid #1C1C1C;
position: relative;
/* Placeholder temporário até termos o gráfico real */
display: flex;
align-items: flex-end;
justify-content: center;
}

.chart-footer {
display: flex;
justify-content: space-between;
margin-top: 12px;
}

.footer-metric {
display: flex;
align-items: center;
gap: 8px;
background-color: #0E0E0E;
border: 1px solid #1C1C1C;
padding: 6px 12px;
border-radius: 4px;
font-size: 0.75rem;
}

.footer-metric.positive .metric-label {
color: #22C55E;
background-color: rgba(34, 197, 94, 0.1);
padding: 2px 6px;
border-radius: 4px;
}

.footer-metric.negative .metric-label {
color: #EF4444;
background-color: rgba(239, 68, 68, 0.1);
padding: 2px 6px;
border-radius: 4px;
}

.footer-metric .metric-value {
color: #F0F0F0;
font-weight: 600;
}

.metric-date {
color: #666;
}

/* Tabelas de Distribuição */
.distribution-section {
padding: 0 20px 40px;
}

.section-title {
display: flex;
align-items: center;
gap: 8px;
font-size: 0.875rem;
font-weight: 600;
color: #F0F0F0;
text-transform: uppercase;
margin-bottom: 20px;
}

.section-title i {
color: #22C55E;
}

.tables-container {
display: flex;
flex-direction: column;
gap: 30px;
}

.table-wrapper {
width: 100%;
margin-bottom: 20px;
}

.table-title {
font-size: 0.75rem;
color: #666;
margin-bottom: 12px;
text-transform: uppercase;
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
}

.distribution-table th.text-right,
.distribution-table td.text-right {
text-align: right;
}

.distribution-table td {
padding: 12px 8px;
color: #F0F0F0;
border-bottom: 1px solid #141414;
}

.distribution-table tr:hover td {
background-color: #0E0E0E;
}

.text-green { color: #22C55E; }
.text-red { color: #EF4444; }

.today-badge {
background-color: #FACC15;
color: #000;
font-size: 0.625rem;
font-weight: 700;
padding: 2px 6px;
border-radius: 4px;
margin-left: 6px;
text-transform: uppercase;
}


/* Desktop: esconder todos os elementos mobile */
	@media (min-width: 769px) {
		.mobile-history-header,
		.mobile-history-cards,
		.mobile-history-card,
		.mobile-history-card-header,
		.mobile-history-time,
		.mobile-history-badge,
		.mobile-history-volume,
		.mobile-history-details,
		.mobile-history-detail-column,
		.mobile-performance-cards,
		.mobile-performance-card,
		.mobile-performance-label,
		.mobile-performance-value,
		.mobile-pause-agent-btn,
		.mobile-pause-icon,
		.mobile-period-select {
			display: none !important;
		}
	}

	/* Estilos para os cards de performance no mobile */
	@media (max-width: 768px) {
		.performance-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-start;
			width: 100%;
			gap: 10px;
		}

		.performance-title-wrapper {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 5px;
			flex: 1;
		}

		.performance-title {
			font-size: 1rem;
			font-weight: 600;
			color: #f0f0f0;
		}

		.update-info {
			font-size: 0.75rem;
			color: #a09e9e;
			margin-left: 0;
			margin-right: 0;
		}

		.mobile-period-select {
			display: block;
			background-color: #0a0a0a;
			color: #f0f0f0;
			border: 1px solid #1a1a1a;
			border-radius: 6px;
			padding: 8px 12px;
			font-size: 13px;
			cursor: pointer;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			height: 36px;
			width: fit-content;
			margin-left: auto;
		}

		.desktop-chart-settings {
			display: none;
		}

		.mobile-performance-cards {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 15px;
			margin-top: 20px;
			margin-bottom: 20px;
		}

		.mobile-performance-card {
			background: #0e0e0e !important;
			border: 1px solid #1a1a1a;
			border-radius: 8px;
			padding: 15px;
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.mobile-performance-label {
			font-size: 12px;
			color: #a09e9e;
			text-transform: uppercase;
		}

		.mobile-performance-value {
			font-size: 18px;
			font-weight: 700;
		}

		.mobile-performance-value.positive {
			color: #22C55E;
		}

		.mobile-performance-value.negative {
			color: #ff4444;
		}

		.mobile-pause-agent-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			width: 100%;
			background: #FFD700;
			color: #000;
			border: none;
			padding: 16px 20px;
			border-radius: 8px;
			font-size: 16px;
			font-weight: 700;
			cursor: pointer;
			transition: background 0.2s;
			margin-top: 20px;
		}

		.mobile-pause-agent-btn:hover {
			background: #FFC700;
		}

		.mobile-pause-icon {
			font-size: 18px;
			font-weight: bold;
		}
	}

	/* BotÃ£o Pausar Agente - HistÃ³rico e Registro */
	.pause-agent-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		background: #FACC15;
		color: #000;
		border: none;
		padding: 0.875rem 1.25rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		margin-top: 1.25rem;
	}

	.pause-agent-btn:hover {
		background: #EAB308;
	}

	.pause-agent-btn i {
		font-size: 0.875rem;
	}

	.history-pause-btn {
		display: flex;
		margin-top: auto;
	}
	
	.register-pause-btn {
		display: flex;
	}
}
	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		backdrop-filter: blur(5px);
		padding: 20px;
	}

	.modal-content.stop-loss-modal {
		background: #0e0e0e;
		border: 1px solid #1a1a1a;
		border-radius: 12px;
		padding: 30px;
		width: 100%;
		max-width: 450px;
		text-align: center;
		color: #f0f0f0;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
		animation: modalFadeIn 0.3s ease-out;
	}

	.modal-icon-wrapper {
		width: 60px;
		height: 60px;
		background: rgba(239, 68, 68, 0.1);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 20px;
	}

	.modal-icon {
		font-size: 28px;
		color: #ef4444;
	}

	.modal-title {
		font-size: 20px;
		font-weight: 700;
		margin-bottom: 15px;
		color: #ffffff;
	}

	.modal-message {
		color: #a1a1a1;
		font-size: 14px;
		line-height: 1.6;
		margin-bottom: 25px;
	}

	.modal-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
		margin-bottom: 25px;
		background: #0a0a0a;
		padding: 15px;
		border-radius: 8px;
		border: 1px solid #1a1a1a;
	}

	.modal-stat-item {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.modal-stat-item .stat-label {
		font-size: 11px;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.modal-stat-item .stat-value {
		font-size: 16px;
		font-weight: 700;
	}
	
	.modal-stat-item .stat-value.negative {
		color: #ef4444;
	}

	.modal-btn {
		background: #ef4444;
		color: white;
		border: none;
		width: 100%;
		padding: 12px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.modal-btn:hover {
		background: #dc2626;
	}
	
	@keyframes modalFadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	/* Mobile Customizations */
	.mobile-only {
		display: none;
	}

	.mobile-stats {
		display: none;
		font-size: 0.9em;
		color: #888;
		margin-left: 5px;
	}
	
	.desktop-only {
		display: flex; /* Assuming flex based on context, or block */
	}

	@media (max-width: 768px) {
		.desktop-only {
			display: none !important;
		}

		.mobile-only {
			display: block; /* Or flex depending on context */
		}

		.data-row-line {
			flex-wrap: wrap; /* Ensure items can wrap if needed, though we strictly order */
			gap: 15px; /* Adjust gap for mobile */
		}

		.order-1-mob {
			order: 1;
			width: 100%; 
		}

		.order-2-mob {
			order: 2;
		}

		.order-3-mob {
			order: 3;
			width: 100%;
		}

		.order-2-mob-replace-market {
			order: 2;
			width: 100%; /* Takes the place of Market */
		}
		
		.order-4-mob {
			order: 4;
			width: 100%;
			display: flex;
			align-items: center; 
			justify-content: flex-end; 
		}

		.mobile-stats {
			display: inline-block;
		}
		
		/* Adjust margins/padding in data-item for mobile if needed */
		.data-item {
			margin-bottom: 0; 
		}
		
		/* Pause Button Mobile Styles */
		.pause-btn-mobile {
			background: #451312;
			color: white;
			border: none;
			padding: 8px 12px;
			border-radius: 8px;
			cursor: pointer;
			font-size: 11px;
			font-weight: 600;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 5px;
			transition: background 0.2s;
			width: 100%; 
			height: 100%;
		}

		.pause-btn-mobile:hover {
			background: #a00000;
		}
	}
</style>
