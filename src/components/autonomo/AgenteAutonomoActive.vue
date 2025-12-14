<template>
	<div class="layout-content-agent-autonomo">
		<div class="agent-top">
			<div class="agent-header">
				<div class="agent-status">
					<div class="agent-title">
						<h2 class="agente-autonomo-text">Agente Autônomo</h2>
						<div class="agent-subtitle">
							<span class="status-badge">ATIVO</span>
							<span class="status-dot">●</span>
							<span id="agentStatus">Aguardando oportunidade</span>
						</div>
					</div>
					<div class="agent-title-mobile">
						<div class="agent-title-header">
							<h2>Agente Autônomo</h2>
							<p>Operando automaticamente no mercado</p>
						</div>
					<div class="dot"><span>●</span>Ativo</div>
					</div>
				</div>
				<!-- ... (código anterior) -->
				<div class="agent-right">
					<!-- Mude @click="$emit('pausarAgente')" para @click="pausarAgenteEIrParaTopo" -->
					<button @click="pausarAgenteEIrParaTopo" class="pause-btn top-pause-btn">
						<span class="pause-icon">II</span> PAUSAR AGENTE
					</button>
				</div>
				<!-- ... (código posterior) -->

			</div>
			<div class="data-row-line">
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/brain.svg" alt="" width="20px" >
						Estratégia
					</span>
					<div class="data-label">{{ agenteData.estrategia }}</div>
				</div>
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/stats-green.svg" alt="" width="20px">
						Mercado
					</span>
					<div class="data-label">{{ agenteData.mercado }}</div>
				</div>
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;"><img src="../../assets/icons/clock.svg" alt="" width="20px">
						Tempo ativo
					</span>
					<div class="data-label">{{ tempoAtivoDisplay }}</div>
				</div>
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/linechart.svg" alt="" width="20px">
						Operações hoje
					</span>
					<div class="data-label">{{ agenteData.operacoesHoje }}</div>
				</div>
			</div>
		</div>
		<div class="metrics-grid">
			<div class="metric-card">
				<div class="metric-box">
					<div class="metric-label">Lucro do dia<i class="fa-solid fa-arrow-trend-up metric-icon positive"></i></div>
					<div class="metric-value-row">
					<div class="metric-value positive">
						{{ (sessionStats?.netProfit || 0) >= 0 ? '+' : '' }}${{ (sessionStats?.netProfit || 0).toFixed(2) }}
					</div>
					<div class="metric-change positive">
						{{ progressoMeta.meta > 0 ? (((sessionStats?.netProfit || 0) / progressoMeta.meta) * 100).toFixed(2) : '0.00' }}%
					</div>
					</div>
				</div>
			</div>
			<div class="metric-card metric-negative">
				<span class="arrow negative">↓</span>
				<div class="metric-box">
					<div class="metric-label">Perda acumulada</div>
					<div class="metric-value negative">
						-${{ Math.abs(sessionStats?.totalLoss || 0).toFixed(2) }}
					</div>
					<div class="metric-change negative">
						{{ progressoMeta.stop > 0 ? ((Math.abs(sessionStats?.totalLoss || 0) / progressoMeta.stop) * 100).toFixed(2) : '0.00' }}%
					</div>
				</div>
			</div>
			<div class="progress-card">
				<div class="metric-label">Progresso até a meta</div>
				<div class="progress-bar-container">
					<div class="progress-bar">
						<div class="progress-fill" :style="{ width: progressoPorcentagem }"></div>
					</div>
				</div>
				<div class="progress-label">
					<span>Meta: ${{ progressoMeta.meta }}</span>
					<span>Stop: ${{ progressoMeta.stop }}</span>
				</div>
			</div>
		</div>
		<div class="chart-section">
			<div class="chart-controls">
				<div class="tab-controls">
					<span
						:class="['toggle-tab', { 'chart-title-active': abaAtiva === 'grafico' }]"
						@click="trocarAba('grafico')"
						>
						Gráfico
					</span>
					<span
						:class="['toggle-tab', { 'chart-title-active': abaAtiva === 'historico' }]"
						@click="trocarAba('historico')"
						>
						Histórico
					</span>
					<span
						:class="['toggle-tab', { 'chart-title-active': abaAtiva === 'registro' }]"
						@click="trocarAba('registro')"
						>
						Registro
					</span>
				</div>
				<div class="performance">
					<!-- Header mobile apenas -->
					<div class="performance-header mobile-performance-header" v-if="abaAtiva === 'grafico'">
						<div class="performance-title-wrapper">
							<span class="performance-title">Gráfico em tempo real</span>
							<span class="update-info">Última atualização: <span class="update-time">{{ ultimaAtualizacao }}</span></span>
						</div>
						<!-- Select simples apenas no mobile -->
						<select v-model="periodoMobile" class="custom-select mobile-period-select">
							<option value="hoje">Hoje</option>
							<option value="ontem">Ontem</option>
							<option value="7d">Últimos 7 dias</option>
							<option value="30d">Últimos 30 dias</option>
						</select>
					</div>
					<!-- Header desktop sempre visível -->
					<div class="performance-header desktop-performance-header" v-if="abaAtiva === 'grafico'">
						<div class="performance-title-wrapper">
							<span class="performance-title">Gráfico em tempo real</span>
							<span class="update-info">Última atualização: <span class="update-time">{{ ultimaAtualizacao }}</span></span>
						</div>
					</div>
					<div class="performance-header desktop-performance-header" v-else-if="abaAtiva === 'historico'">
						<div class="performance-title-wrapper">
							<span class="performance-title">Histórico de Operações</span>
							<span class="update-info">Última atualização: <span class="update-time">{{ ultimaAtualizacao }}</span></span>
						</div>
					</div>
					<div class="chart-settings desktop-chart-settings">
						<template v-if="abaAtiva === 'grafico'">
							<div class="control-group">
								Timeframe:
								<select v-model="unidadeTimeframeSelecionada" class="custom-select" style="width: 80px;">
									<option value="minutos">Minutos</option>
									<option value="horas">Horas</option>
									<option value="Dias">Dias</option>
								</select>
								<select v-model="valorTimeframeSelecionado" class="custom-select" style="width: 70px;">
									<option
										v-for="val in tempoOptions"
										:key="unidadeTimeframeSelecionada + val"
										:value="val"
										>
										{{ val }}
									</option>
								</select>
							</div>
							<div class="control-group">
								Tipo:
								<select v-model="tipoGraficoSelecionado" class="custom-select">
									<option v-for="tipo in tiposGrafico" :key="tipo" :value="tipo">{{ tipo }}</option>
								</select>
							</div>
						</template>
						<template v-else-if="abaAtiva === 'historico'">
							<button @click="exportarHistorico" class="export-btn">
								Exportar Histórico
							</button>
							<div class="control-div">
								<div class="control-group">
									Período:
									<select v-model="filtroDataSelecionado" class="custom-select" style="min-width: 130px;">
										<option value="hoje">Hoje</option>
										<option value="ontem">Ontem</option>
										<option value="7d">Últimos 7 dias</option>
										<option value="30d">Últimos 30 dias</option>
										<option value="personalizado">Personalizado</option>
									</select>
								</div>
								<div class="control-group" v-if="filtroDataSelecionado === 'personalizado'">
									<span>A partir de:</span>
									<input type="date" v-model="dataInicio" class="custom-input-date">
								</div>
								<div class="control-group" v-if="filtroDataSelecionado === 'personalizado'">
									<span>Até:</span>
									<input type="date" v-model="dataFim" class="custom-input-date">
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
			<div class="chart-content">
				<div id="contentGrafico" :class="['chart-canvas', { hidden: abaAtiva !== 'grafico' }]">
					<!-- Gráfico do Índice R_75 -->
					<div class="index-chart-container" v-if="abaAtiva === 'grafico'">
						<div ref="indexChartContainer" class="market-chart-wrapper"></div>
					</div>
				</div>
				<div id="contentHistorico" :class="['history-content', { hidden: abaAtiva !== 'historico' }]">
					<div class="history-header">
						<h3>Histórico de Operações ({{ historicoOperacoesFiltradas.length }})</h3>
					</div>
					<!-- Título e subtítulo mobile -->
					<div class="mobile-history-header">
						<h3 class="mobile-history-title">Histórico de Operações</h3>
						<p class="mobile-history-subtitle">Últimas operações realizadas</p>
					</div>
					<!-- Cards mobile -->
					<div class="mobile-history-cards">
						<div v-for="(op, index) in historicoOperacoesFiltradas" :key="index" class="mobile-history-card">
							<div class="mobile-history-card-header">
								<span class="mobile-history-time">{{ op.hora }}</span>
								<span :class="['mobile-history-badge', op.tipo === 'Call' ? 'badge-call' : 'badge-put']">
									{{ op.tipo.toUpperCase() }}
								</span>
								<span class="mobile-history-volume">Vol {{ op.volume }}</span>
							</div>
							<div class="mobile-history-details">
								<div class="mobile-history-detail-column">
									<span class="detail-label">Entrada</span>
									<span class="detail-value">${{ op.entrada }}</span>
								</div>
								<div class="mobile-history-detail-column">
									<span class="detail-label">Saída</span>
									<span class="detail-value">${{ op.saida }}</span>
								</div>
								<div class="mobile-history-detail-column">
									<span class="detail-label">Resultado</span>
									<span :class="['detail-value', op.resultado.startsWith('+') ? 'result-positive' : 'result-negative']">
										{{ op.resultado }}
									</span>
								</div>
							</div>
						</div>
					</div>
					<!-- Tabela desktop -->
					<div class="table-scroll-wrapper desktop-history-table">
						<table class="operations-table">
							<thead>
								<tr>
									<th>Hora</th>
									<th>Ativo</th>
									<th>Tipo</th>
									<th>Entrada</th>
									<th>Saída</th>
									<th>Investimento</th>
									<th>Resultado</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(op, index) in historicoOperacoesFiltradas" :key="index">
									<td>{{ op.hora }}</td>
									<td>{{ op.ativo }}</td>
									<td>{{ op.tipo }}</td>
									<td>${{ op.entrada }}</td>
									<td>${{ op.saida }}</td>
									<td>${{ op.volume }}</td>
									<td :class="op.resultado.startsWith('+') ? 'result-positive' : 'result-negative'">
										{{ op.resultado }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<!-- Botão Pausar Agente - Histórico -->
					<button @click="pausarAgenteEIrParaTopo" class="pause-agent-btn history-pause-btn">
						<i class="fa-solid fa-pause"></i>
						<span>Pausar Agente</span>
					</button>
				</div>
				<div id="contentRegistro" :class="['register-content', { hidden: abaAtiva !== 'registro' }]">
					<AutonomousAgentLogs :user-id="userIdComputed" :is-active="true" />
					<!-- Botão Pausar Agente - Registro -->
					<button @click="pausarAgenteEIrParaTopo" class="pause-agent-btn register-pause-btn">
						<i class="fa-solid fa-pause"></i>
						<span>Pausar Agente</span>
					</button>
				</div>
			</div>
			<!-- Cards Maior Ganho e Maior Perda - apenas mobile e apenas na aba gráfico -->
			<div v-if="abaAtiva === 'grafico'" class="mobile-performance-cards">
				<div class="mobile-performance-card">
					<div class="mobile-performance-label">Maior Ganho</div>
					<div class="mobile-performance-value positive">+${{ maiorGanho.toFixed(2) }}</div>
				</div>
				<div class="mobile-performance-card">
					<div class="mobile-performance-label">Maior Perda</div>
					<div class="mobile-performance-value negative">-${{ maiorPerda.toFixed(2) }}</div>
				</div>
			</div>
			<!-- Botão Pausar Agente - apenas mobile e apenas na aba gráfico -->
			<button v-if="abaAtiva === 'grafico'" @click="pausarAgenteEIrParaTopo" class="mobile-pause-agent-btn">
				<span class="mobile-pause-icon">II</span>
				Pausar Agente
			</button>
		</div>
		<div class="actions-section">
			<div class="actions-header">
				<h3>Ações do Agente</h3>
					<div class="actions-list">
						<div v-for="(acao, index) in acoesAgenteComputed" :key="index" class="action-item">
						<div :class="['action-icon', acao.status || acao.classe || 'info']"></div>
						<div class="action-content">
							<div class="action-title">{{ acao.title || acao.titulo }}</div>
							<div class="action-description">{{ acao.description || acao.descricao }}</div>
						</div>
					</div>
						<div v-if="acoesAgenteComputed.length === 0" class="action-item">
						<div class="action-icon info"></div>
						<div class="action-content">
							<div class="action-title">Nenhuma ação registrada</div>
							<div class="action-description">Aguardando operações do agente...</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AutonomousAgentLogs from './AutonomousAgentLogs.vue';
	import { createChart, ColorType } from 'lightweight-charts';

	export default {
		name: 'AgenteAutonomoPanel',
		components: {
			AutonomousAgentLogs
		},
		props: {
			agenteData: {
				type: Object,
				default: () => ({
					estrategia: 'IA SENTINEL',
					mercado: 'Volatility 75 Index',
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
					accountBalance: null,
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
				})
			},
			tradeHistory: {
				type: Array,
				default: () => []
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
				// Dados para gráficos
				indexChartData: [],
				priceHistoryInterval: null,
				priceTicks: [],
				indexChart: null,
				indexChartSeries: null,
				indexChartInitialized: false,
				unidadeTimeframeSelecionada: 'minutos',
				valorTimeframeSelecionado: 1,
				tipoGraficoSelecionado: 'Gráfico de Linhas',
				// WebSocket para ticks em tempo real
				derivWebSocket: null,
				derivToken: null,
				symbol: 'R_75', // Índice do agente autônomo (será atualizado do backend)
				timeframeOptions: {
					minutos: [1, 2, 3, 5, 10, 15, 30],
					horas: [1, 2, 4, 8],
					Dias: [1, 2, 3, 4, 5, 6, 7],
				},
				tiposGrafico: ['Gráfico de Linhas', 'Gráfico de Velas'],
				acoesAgente: [
					{ hora: '14:32:15', classe: 'success', titulo: 'Operação finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50' },
					{ hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
					{ hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - Confirmação de padrão' },
					{ hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrão da estratégia', descricao: '14:30:00 - Análise em andamento' },
				],
			};
		},
		computed: {
			historicoOperacoes() {
				// Converter tradeHistory da API para o formato esperado
				if (this.tradeHistory && this.tradeHistory.length > 0) {
					return this.tradeHistory.map(trade => {
						const date = new Date(trade.createdAt);
						const dataStr = date.toISOString().split('T')[0];
						const horaStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
						const profitLoss = trade.profitLoss || 0;
						const resultadoStr = profitLoss >= 0 ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`;
						
						return {
							data: dataStr,
							hora: horaStr,
							ativo: trade.symbol || 'R_75',
							tipo: trade.signalDirection === 'RISE' ? 'Call' : 'Put',
							entrada: parseFloat(trade.entryPrice || 0).toFixed(2),
							saida: trade.exitPrice ? parseFloat(trade.exitPrice).toFixed(2) : '0.00',
							resultado: resultadoStr,
							volume: parseFloat(trade.stakeAmount || 0).toFixed(2),
						};
					});
				}
				// Se não houver tradeHistory, usar operationHistory do agenteData
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
				// Usar agentActions do agenteData se disponível
				const actions = this.agenteData?.agentActions || this.acoesAgente || [];
				return actions;
			},
			progressoPorcentagem() {
				const current = this.sessionStats?.netProfit || this.progressoMeta.atual || 0;
				const percentage = (current / this.progressoMeta.meta) * 100;
				return `${Math.min(100, Math.max(0, percentage)).toFixed(0)}%`;
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
					// Extrair valores numéricos
					const entrada = parseFloat(op.entrada) || 0;
					const saida = parseFloat(op.saida) || entrada;
					
					// Extrair resultado (ganho/perda)
					const resultadoStr = op.resultado || '+$0.00';
					const resultadoMatch = resultadoStr.replace('$', '').replace('+', '').replace(',', '');
					const profit = parseFloat(resultadoMatch) || 0;
					
					// Determinar direção baseado no tipo
					const direction = op.tipo === 'Call' ? 'CALL' : (op.tipo === 'Put' ? 'PUT' : 'CALL');
					
					// Criar ID único
					const contractId = `autonomo-${op.data}-${op.hora}-${index}`;
					
					// Converter data e hora para timestamp e Date objects
					const dateTime = new Date(`${op.data}T${op.hora}`);
					const time = Math.floor(dateTime.getTime() / 1000);
					
					// Criar createdAt e closedAt (assumindo que a hora é quando foi fechado)
					const createdAt = dateTime.toISOString();
					const closedAt = dateTime.toISOString(); // Usar mesma data/hora já que não temos separação
					
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
			sessionStats: {
				handler(newStats) {
					if (newStats && newStats.netProfit !== undefined) {
						this.progressoMeta.atual = parseFloat(newStats.netProfit) || 0;
					}
				},
				deep: true,
				immediate: true,
			},
			abaAtiva(newAba) {
				// Quando a aba 'grafico' for selecionada, garantir que o gráfico seja inicializado
				if (newAba === 'grafico') {
					// Conectar WebSocket se não estiver conectado
					if (!this.derivWebSocket || this.derivWebSocket.readyState !== WebSocket.OPEN) {
						this.connectToDerivWebSocket();
					}
					
					this.$nextTick(() => {
						setTimeout(() => {
							if (this.$refs.indexChartContainer) {
								if (!this.indexChartInitialized) {
									this.initIndexChart();
								} else if (this.priceTicks.length > 0) {
									// Se já estiver inicializado, atualizar com dados
									this.updateIndexChart();
								}
							}
						}, 200);
					});
				} else {
					// Desconectar WebSocket quando sair da aba gráfico (opcional - pode manter conectado)
					// this.disconnectDerivWebSocket();
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
				// Forçar atualização quando tempoAtivo mudar
				if (newVal && newVal !== oldVal) {
					console.log('[AgenteAutonomoActive] tempoAtivo mudou:', { newVal, oldVal });
					this.$forceUpdate();
				}
			},
			agenteData: {
				handler(newVal, oldVal) {
					// Forçar atualização quando agenteData mudar
					if (newVal && newVal.tempoAtivo) {
						console.log('[AgenteAutonomoActive] agenteData mudou:', {
							newTempoAtivo: newVal.tempoAtivo,
							oldTempoAtivo: oldVal?.tempoAtivo
						});
						this.$forceUpdate();
					}
				},
				deep: true,
				immediate: false
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
				handler() {
					if (this.indexChartInitialized && this.abaAtiva === 'grafico') {
						this.updateIndexChart();
					}
				},
				deep: true
			},
			'agenteData.mercado'(newMarket) {
				// Atualizar símbolo quando o mercado mudar
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
						// Reconectar WebSocket com novo símbolo
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
				
				// Atualizar símbolo baseado no mercado do agenteData
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
			
			// Atualizar última atualização a cada segundo
			setInterval(() => {
				this.ultimaAtualizacao = new Date().toLocaleTimeString('pt-BR');
			}, 1000);
			
			// Conectar ao WebSocket da Deriv para receber ticks em tempo real
			this.connectToDerivWebSocket();
			
			// Inicializar gráfico após um pequeno delay para garantir que o ref esteja pronto
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.$refs.indexChartContainer) {
						this.initIndexChart();
					}
				}, 500);
			});
			
			// Rolagem instantânea para o topo
			window.scrollTo({ top: 0, behavior: 'auto' });
		},
		beforeUnmount() {
			if (this.priceHistoryInterval) {
				clearInterval(this.priceHistoryInterval);
			}
			
			// Desconectar WebSocket
			this.disconnectDerivWebSocket();
			
			// Destruir gráfico
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
				console.log(`Exportando histórico. Filtro: ${this.filtroDataSelecionado}. Total de operações: ${this.historicoOperacoesFiltradas.length}`);
				// Aqui seria a lógica real para gerar e baixar um arquivo CSV/Excel/PDF
			},
			getDerivToken() {
				// Buscar token Deriv do localStorage
				try {
					// Tentar deriv_token direto
					let token = localStorage.getItem('deriv_token');
					if (token) return token;
					
					// Tentar deriv_tokens_by_loginid
					const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid');
					if (tokensByLoginId) {
						const tokens = JSON.parse(tokensByLoginId);
						const firstToken = Object.values(tokens)[0];
						if (firstToken) return firstToken;
					}
					
					// Tentar deriv_connection
					const connection = localStorage.getItem('deriv_connection');
					if (connection) {
						const conn = JSON.parse(connection);
						if (conn.token) return conn.token;
					}
					
					console.warn('[AgenteAutonomoActive] Token Deriv não encontrado');
					return null;
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao buscar token Deriv:', error);
					return null;
				}
			},
			
			connectToDerivWebSocket() {
				// Tentar primeiro com o App ID padrão do agente autônomo (1089)
				this.connectToDerivWebSocketWithAppId('1089');
			},
			
			connectToDerivWebSocketWithAppId(appId) {
				try {
					this.derivToken = this.getDerivToken();
					if (!this.derivToken) {
						console.warn('[AgenteAutonomoActive] Não é possível conectar: token Deriv não encontrado');
						return;
					}
					
					const wsUrl = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
					
					console.log('[AgenteAutonomoActive] Conectando ao WebSocket da Deriv com App ID:', appId);
					
					// Fechar conexão anterior se existir
					if (this.derivWebSocket) {
						this.derivWebSocket.close();
					}
					
					this.derivWebSocket = new WebSocket(wsUrl);
					
					this.derivWebSocket.onopen = () => {
						console.log('[AgenteAutonomoActive] ✅ WebSocket conectado');
						// Autorizar
						this.derivWebSocket.send(JSON.stringify({
							authorize: this.derivToken
						}));
					};
					
					this.derivWebSocket.onmessage = (event) => {
						try {
							const message = JSON.parse(event.data);
							
							if (message.error) {
								console.error('[AgenteAutonomoActive] Erro do WebSocket:', message.error);
								
								// Se o erro for de token inválido, tentar com outro App ID
								if (message.error.code === 'InvalidToken') {
									const currentAppId = this.derivWebSocket?.url?.match(/app_id=(\d+)/)?.[1] || '1089';
									if (currentAppId === '1089') {
										console.warn('[AgenteAutonomoActive] Token inválido para App ID 1089, tentando 111346...');
										this.disconnectDerivWebSocket();
										setTimeout(() => {
											// Tentar com App ID alternativo
											this.connectToDerivWebSocketWithAppId('111346');
										}, 1000);
									} else {
										console.error('[AgenteAutonomoActive] Token inválido para ambos os App IDs. Verifique o token.');
									}
								}
								return;
							}
							
							if (message.msg_type === 'authorize') {
								console.log('[AgenteAutonomoActive] ✅ Autorizado na Deriv');
								// Buscar histórico inicial e se inscrever para ticks em tempo real
								this.derivWebSocket.send(JSON.stringify({
									ticks_history: this.symbol,
									adjust_start_time: 1,
									count: 100,
									end: 'latest',
									subscribe: 1,
									style: 'ticks'
								}));
								
								// Também se inscrever para ticks em tempo real separadamente
								setTimeout(() => {
									if (this.derivWebSocket && this.derivWebSocket.readyState === WebSocket.OPEN) {
										this.derivWebSocket.send(JSON.stringify({
											ticks: this.symbol,
											subscribe: 1
										}));
										console.log('[AgenteAutonomoActive] 📡 Inscrito para ticks em tempo real:', this.symbol);
									} else {
										console.warn('[AgenteAutonomoActive] WebSocket não está pronto para inscrição de ticks');
									}
								}, 1000);
							}
							
							if (message.msg_type === 'history') {
								const history = message.history;
								if (history && history.prices && Array.isArray(history.prices)) {
									console.log('[AgenteAutonomoActive] 📊 Histórico recebido:', history.prices.length, 'ticks');
									
									const ticks = history.prices.map((price, index) => {
										const epoch = history.times && history.times[index] 
											? history.times[index] 
											: Math.floor(Date.now() / 1000) - (history.prices.length - index);
										
										return {
											value: parseFloat(price) || 0,
											epoch: epoch,
											timestamp: new Date(epoch * 1000).toISOString()
										};
									}).filter(tick => tick.value > 0 && tick.epoch > 0);
									
									this.priceTicks = ticks;
									console.log('[AgenteAutonomoActive] ✅', ticks.length, 'ticks processados');
									
									if (this.indexChartInitialized) {
										this.updateIndexChart();
									}
								}
							}
							
							if (message.msg_type === 'tick') {
								const tick = message.tick;
								if (tick && tick.quote !== undefined) {
									const epoch = tick.epoch || Math.floor(Date.now() / 1000);
									const value = parseFloat(tick.quote);
									
									if (!isNaN(value) && value > 0 && epoch > 0) {
										const newTick = {
											value: value,
											epoch: epoch,
											timestamp: new Date(epoch * 1000).toISOString()
										};
										
										// Adicionar ao array (manter últimos 500 ticks)
										this.priceTicks.push(newTick);
										if (this.priceTicks.length > 500) {
											this.priceTicks.shift();
										}
										
										console.log('[AgenteAutonomoActive] 📈 Novo tick recebido:', {
											value: value,
											epoch: epoch,
											totalTicks: this.priceTicks.length,
											chartInitialized: this.indexChartInitialized,
											hasSeries: !!this.indexChartSeries
										});
										
										// Atualizar gráfico
										if (this.indexChartInitialized && this.indexChartSeries) {
											try {
												this.indexChartSeries.update({
													time: Math.floor(epoch),
													value: value
												});
												// Ajustar escala para mostrar o último tick
												this.indexChart.timeScale().scrollToPosition(-1, false);
											} catch (error) {
												console.error('[AgenteAutonomoActive] Erro ao atualizar tick:', error);
											}
										} else {
											console.warn('[AgenteAutonomoActive] Gráfico não inicializado, não é possível atualizar');
										}
									}
								}
							}
						} catch (error) {
							console.error('[AgenteAutonomoActive] Erro ao processar mensagem WebSocket:', error);
						}
					};
					
					this.derivWebSocket.onerror = (error) => {
						console.error('[AgenteAutonomoActive] ❌ Erro no WebSocket:', error);
					};
					
					this.derivWebSocket.onclose = () => {
						console.warn('[AgenteAutonomoActive] 🔌 WebSocket fechado. Tentando reconectar...');
						// Tentar reconectar após 5 segundos
						setTimeout(() => {
							if (this.abaAtiva === 'grafico') {
								this.connectToDerivWebSocket();
							}
						}, 5000);
					};
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao conectar WebSocket:', error);
				}
			},
			
			disconnectDerivWebSocket() {
				if (this.derivWebSocket) {
					this.derivWebSocket.close();
					this.derivWebSocket = null;
				}
			},
			
			// ============================================
			// GRÁFICO DO ÍNDICE R_75
			// ============================================
			initIndexChart() {
				if (this.indexChartInitialized || !this.$refs.indexChartContainer) {
					return;
				}
				
				try {
					const container = this.$refs.indexChartContainer;
					
					// Verificar se o container tem dimensões válidas
					if (container.offsetWidth === 0 || container.offsetHeight === 0) {
						console.warn('[AgenteAutonomoActive] Container sem dimensões, tentando novamente...');
						setTimeout(() => this.initIndexChart(), 500);
						return;
					}
					
					const containerWidth = container.offsetWidth || 800;
					const containerHeight = container.offsetHeight || 400;
					
					console.log('[AgenteAutonomoActive] Inicializando gráfico com dimensões:', containerWidth, 'x', containerHeight);
					
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
					console.log('[AgenteAutonomoActive] Gráfico inicializado. Ticks disponíveis:', this.priceTicks.length);
					
					if (this.priceTicks.length > 0) {
						this.updateIndexChart();
					} else {
						console.warn('[AgenteAutonomoActive] Nenhum tick disponível para plotar');
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao inicializar gráfico de índice:', error);
					this.indexChartInitialized = false;
				}
			},
			
			updateIndexChart() {
				if (!this.indexChartInitialized || !this.indexChartSeries) {
					console.warn('[AgenteAutonomoActive] Gráfico não inicializado ou série não disponível');
					return;
				}
				
				if (this.priceTicks.length === 0) {
					console.warn('[AgenteAutonomoActive] Nenhum tick disponível para atualizar gráfico');
					return;
				}
				
				try {
					// Filtrar e ordenar ticks por epoch
					const sortedTicks = [...this.priceTicks]
						.filter(tick => tick.epoch && tick.value && !isNaN(tick.value))
						.sort((a, b) => a.epoch - b.epoch);
					
					if (sortedTicks.length === 0) {
						console.warn('[AgenteAutonomoActive] Nenhum tick válido após filtragem');
						return;
					}
					
					const data = sortedTicks.map(tick => ({
						time: Math.floor(tick.epoch),
						value: parseFloat(tick.value)
					}));
					
					console.log('[AgenteAutonomoActive] Atualizando gráfico com', data.length, 'pontos');
					this.indexChartSeries.setData(data);
					this.indexChart.timeScale().fitContent();
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao atualizar gráfico de índice:', error);
				}
			},
			getUserId() {
				const userStr = localStorage.getItem("user");
				if (userStr) {
					try {
						const user = JSON.parse(userStr);
						return user.id || user.userId;
					} catch (error) {
						console.error("[AgenteAutonomoActive] Erro ao parsear user:", error);
					}
				}
				return null;
			},
			
			pausarAgenteEIrParaTopo() {
				this.$emit('pausarAgente'); // Emite o evento original para o pai
				this.$nextTick(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou 'instant'
				});
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
		background: #0e0f0f;
		padding: 10px 10px;
		margin-right: 20px;
		border-radius: 8px;
		border: 1px solid #1a1a1a;
		min-height: 55px;
		justify-content: center;
	}

	.agent-title h2 {
		font-size: 20px;
		font-weight: 600;
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

	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr;
		gap: 15px;
		margin-top: 1.5rem;
		background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
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
		color: #ff4444;
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
		color: #ff4444;
	}

	.metric-change {
		font-size: 13px;
	}

	.metric-change.positive {
		color: #22C55E;
	}

	.metric-change.negative {
		color: #ff4444;
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
		height: 10px;
		background: #1a1a1a;
		border-radius: 12px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #22C55E;
		transition: width 0.5s;
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
		
		.chart-section,
		.metrics-grid {
			background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
		}

		.agent-title {
			background: #0e0e0e !important;
		}
	}
	@media (max-width: 768px) {
	.layout-content-agent-autonomo {
		padding: 10px;
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

	/* 👇 Alteração aqui 👇 */
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

	.data-label{
		font-size: 14px;
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

	/* Botão Pausar Agente - Histórico e Registro */
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
</style>