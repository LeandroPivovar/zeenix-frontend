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
						<img src="../../assets/icons/brain.svg" alt="" width="15px" >
						Estratégia
					</span>
					<div class="data-label">{{ agenteData.estrategia }}</div>
				</div>
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/stats-green.svg" alt="" width="15px">
						Mercado
					</span>
					<div class="data-label">{{ agenteData.mercado }}</div>
				</div>
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;"><img src="../../assets/icons/clock.svg" alt="" width="15px">
						Tempo ativo
					</span>
					<div class="data-label">{{ agenteData.tempoAtivo }}</div>
				</div>
				<div class="data-item">
					<span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/linechart.svg" alt="" width="15px">
						Operações hoje
					</span>
					<div class="data-label">{{ agenteData.operacoesHoje }}</div>
				</div>
			</div>
		</div>
		<div class="metrics-grid">
			<div class="metric-card">
				<span class="arrow positive">↑</span>
				<div class="metric-box">
					<div class="metric-label">Resultado do dia</div>
					<div class="metric-value positive">
						+{{ preferredCurrencyPrefix }}{{ progressoMeta.atual.toFixed(2) }}
					</div>
					<div class="metric-change positive">
						+2.14%
					</div>
				</div>
			</div>
			<div class="metric-card">
				<span class="arrow positive">↑</span>
				<div class="metric-box">
					<div class="metric-label">Resultado da sessão</div>
					<div class="metric-value positive">
						+{{ preferredCurrencyPrefix }}{{ progressoMeta.atual.toFixed(2) }}
					</div>
					<div class="metric-change positive">
						+2.14%
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
					<span>Meta: {{ preferredCurrencyPrefix }}{{ progressoMeta.meta }}</span>
					<span>Stop: {{ preferredCurrencyPrefix }}{{ progressoMeta.stop }}</span>
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
				</div>
				<div class="performance">
					<span class="performance-title">Performance do Agente</span>
					<span class="update-info">Última atualização: <span class="update-time">{{ ultimaAtualizacao }}</span></span>
					<div class="chart-settings">
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
					<p class="chart-placeholder" v-if="abaAtiva === 'grafico'">{{ graficoPlaceholder }}</p>
				</div>
				<div id="contentHistorico" :class="['history-content', { hidden: abaAtiva !== 'historico' }]">
					<div class="history-header">
						<h3>Histórico de Operações ({{ historicoOperacoesFiltradas.length }})</h3>
					</div>
					<div class="table-scroll-wrapper">
						<table class="operations-table">
							<thead>
								<tr>
									<th>Hora</th>
									<th>Ativo</th>
									<th>Tipo</th>
									<th>Entrada</th>
									<th>Saída</th>
									<th>Resultado</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(op, index) in historicoOperacoesFiltradas" :key="index">
									<td>{{ op.hora }}</td>
									<td>{{ op.ativo }}</td>
									<td>{{ op.tipo }}</td>
									<td>{{ preferredCurrencyPrefix }}{{ op.entrada }}</td>
									<td>{{ preferredCurrencyPrefix }}{{ op.saida }}</td>
									<td :class="op.resultado.startsWith('+') ? 'result-positive' : 'result-negative'">
										{{ op.resultado }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="actions-section">
			<div class="actions-header">
				<h3>Ações do Agente</h3>
				<div class="actions-list">
					<div v-for="acao in acoesAgente" :key="acao.hora" class="action-item">
						<div :class="['action-icon', acao.classe]"></div>
						<div class="action-content">
							<div class="action-title">{{ acao.titulo }}</div>
							<div class="action-description">{{ acao.descricao }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import accountBalanceMixin from '../../mixins/accountBalanceMixin';

	export default {
		name: 'AgenteAutonomoPanel',
		mixins: [accountBalanceMixin],
		emits: ['pausarAgente'],
		data() {
			return {
				abaAtiva: 'grafico',
				unidadeTimeframeSelecionada: 'minutos',
				valorTimeframeSelecionado: 5,
				tipoGraficoSelecionado: 'Gráfico de Linhas',
				ultimaAtualizacao: '14:32:15',
				filtroDataSelecionado: 'hoje',
				dataInicio: '2025-11-25',
				dataFim: '2025-11-25',
				agenteData: {
					estrategia: 'Arion',
					mercado: 'Índices Sintéticos',
					tempoAtivo: '2h 15m',
					operacoesHoje: 12,
				},
				progressoMeta: {
					atual: 42.50,
					meta: 50,
					stop: 25,
				},
				timeframeOptions: {
					minutos: [1, 2, 3, 5, 10, 15, 30],
					horas: [1, 2, 4, 8],
					Dias: [1, 2, 3, 4, 5, 6, 7],
				},
				tiposGrafico: ['Gráfico de Linhas', 'Gráfico de Velas'],
				acoesAgente: [
					{ hora: '14:32:15', classe: 'success', titulo: 'Operação finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50'.replace('$', this.preferredCurrencyPrefix) },
					{ hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
					{ hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - Confirmação de padrão' },
					{ hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrão da estratégia', descricao: '14:30:00 - Análise em andamento' },
				],
				historicoOperacoes: [
					{ data: '2025-11-25', hora: '14:32:16', ativo: 'CALL1', tipo: 'Call', entrada: '83.80', saida: '85.20', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '7.50' },
					{ data: '2025-11-25', hora: '14:18:02', ativo: 'CALL1', tipo: 'Call', entrada: '82.60', saida: '81.30', resultado: '-'.replace('-', '-'+this.preferredCurrencyPrefix) + '3.20' },
					{ data: '2025-11-25', hora: '14:01:45', ativo: 'Volatility 75', tipo: 'Put', entrada: '156.40', saida: '158.90', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '12.30' },
					{ data: '2025-11-25', hora: '13:45:22', ativo: 'CALL1', tipo: 'Call', entrada: '84.15', saida: '83.50', resultado: '-'.replace('-', '-'+this.preferredCurrencyPrefix) + '2.10' },
					{ data: '2025-11-25', hora: '13:30:08', ativo: 'Volatility 75', tipo: 'Call', entrada: '155.20', saida: '157.80', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '8.90' },
					{ data: '2025-11-24', hora: '13:15:00', ativo: 'CALL1', tipo: 'Put', entrada: '88.00', saida: '87.00', resultado: '-'.replace('-', '-'+this.preferredCurrencyPrefix) + '1.50' },
					{ data: '2025-11-24', hora: '13:00:00', ativo: 'Volatility 75', tipo: 'Call', entrada: '160.00', saida: '162.00', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '10.00' },
					{ data: '2025-11-23', hora: '12:45:00', ativo: 'CALL1', tipo: 'Put', entrada: '81.00', saida: '80.00', resultado: '-'.replace('-', '-'+this.preferredCurrencyPrefix) + '1.00' },
					{ data: '2025-11-22', hora: '12:30:00', ativo: 'Volatility 75', tipo: 'Call', entrada: '150.00', saida: '152.00', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '9.00' },
					{ data: '2025-11-21', hora: '12:30:00', ativo: 'CALL1', tipo: 'Put', entrada: '85.00', saida: '84.00', resultado: '-'.replace('-', '-'+this.preferredCurrencyPrefix) + '1.00' },
					{ data: '2025-11-20', hora: '12:30:00', ativo: 'Volatility 75', tipo: 'Call', entrada: '150.00', saida: '152.00', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '9.00' },
					{ data: '2025-11-01', hora: '10:00:00', ativo: 'CALL1', tipo: 'Put', entrada: '80.00', saida: '81.00', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '2.00' },
					{ data: '2025-10-31', hora: '11:00:00', ativo: 'Volatility 75', tipo: 'Call', entrada: '140.00', saida: '141.00', resultado: '+'.replace('+', '+'+this.preferredCurrencyPrefix) + '1.00' },
				],
			};
		},
		computed: {
			progressoPorcentagem() {
				const percentage = (this.progressoMeta.atual / this.progressoMeta.meta) * 100;
				return `${Math.min(100, percentage).toFixed(0)}%`;
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
					const date = new Date('2025-11-25');
					date.setDate(date.getDate() - n + 1);
					return date.toISOString().split('T')[0];
				};
				let startDate;
				switch (filtroDataSelecionado) {
					case 'hoje':
						startDate = '2025-11-25';
						return historicoOperacoes.filter(op => op.data === startDate);
					case 'ontem':
						startDate = '2025-11-24';
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
			}
		},
		watch: {
			unidadeTimeframeSelecionada(novaUnidade) {
				const primeiroValor = this.timeframeOptions[novaUnidade][0];
				if (this.valorTimeframeSelecionado !== primeiroValor) {
					this.valorTimeframeSelecionado = primeiroValor;
				}
			},
			filtroDataSelecionado(novoFiltro) {
				if (novoFiltro !== 'personalizado') {
					this.dataInicio = '2025-11-25';
					this.dataFim = '2025-11-25';
				}
			}
		},
		mounted() {
  // Rolagem instantânea para o topo
  window.scrollTo({ top: 0, behavior: 'auto' });
  // Ou simplesmente:
  // window.scrollTo(0, 0);
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
		margin: 20px 0px;
	}

	.metric-card,
	.chart-section,
	.history-section,
	.actions-section {
		background: #0e0f0f;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.progress-card {
		background: #0e0f0f;
		border: 1px solid #1a1a1a;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.agent-top {
		background: #0e0f0f;
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
		padding: 5px;
		margin-right: 20px;
		border-radius: 8px;
		border: 1px solid #1a1a1a;
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
		color: #00ff00;
		font-size: 18px;
	}

	.agent-right {
		display: flex;
		align-items: center;
	}

	.top-pause-btn {
		background: #451312;
		color: white;
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
		background: #a00000;
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
		gap: 8px;
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
	}

	.metric-card {
		background: #0a0a0a;
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
	}

	.metric-box {
		display: flex;
		flex-direction: column;
	}

	.metric-value {
		font-size: 20px;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 5px 0;
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
		color: #3eb83e;
	}

	.metric-value.negative {
		color: #ff4444;
	}

	.metric-change {
		font-size: 13px;
	}

	.metric-change.positive {
		color: #3eb83e;
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
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #00ff00;
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

	.performance-title {
		font-weight: 500;
		color: #e7e7e7;
		font-size: 1.2rem;
	}

	.update-info {
		color: #666;
		display: flex;
		align-items: center;
		gap: 5px;
		margin-right: auto;
		margin-left: 20px;
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
		font-size: 11px;
		color: #666;
		border-bottom: 1px solid #1a1a1a;
		font-weight: 500;
		text-transform: uppercase;
		background-color: #0e0f0f;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.operations-table td {
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
		background: #00ff00;
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

	.progress-card,
	.chart-section,
	.history-section,
	.actions-section,
	.metric-card {
		background: #0e0f0f;
	}
</style>