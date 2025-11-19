<template>
	<div class="dashboard-container">

		
		<section class="metric-section">
			<div class="metric-header">
				<div class="header-left">
					<h1 class="header-title">Visão da IA | Orion</h1>
					<p class="header-subtitle">Análise em tempo real do mercado</p>
				</div>
				<div class="header-status">
					<span class="status-dot operando"></span>
					<span class="status-text">Operando</span>
				</div>
			</div>
			<div class="main-metrics-grid">
				<div class="ai-brain-icon">
					<img src="../../assets/icons/brain.svg" alt="IA Orion" width="150px" height="150px">
				</div>
			
				<div class="metric-card">
					<p class="metric-label">Ativo Atual</p>
					<p class="metric-value large-text">EUR/USD</p>
					<p class="metric-detail">Timeframe M5</p>
				</div>
				<div class="metric-card">
					<p class="metric-label">Probabilidade</p>
					<p class="metric-value large-text confidence text-green-ia">82%</p>
					<p class="metric-detail text-green-ia">Alta confiança</p>
				</div>
				<div class="metric-card">
					<p class="metric-label">Latência</p>
					<p class="metric-value large-text">12ms</p>
					<p class="metric-detail status-active text-green-ia">Excelente</p>
				</div>
				<div class="metric-card">
					<p class="metric-label">Última Leitura</p>
					<p class="metric-value large-text">{{ lastUpdateTime }}</p>
					<p class="metric-detail status-active text-green-ia">Agora</p>
				</div>
				<div class="metric-card">
					<p class="metric-label">Status</p>
					<p class="metric-value large-text status-active text-green-ia">Ativo</p>
					<p class="metric-detail">Monitorando</p>
				</div>
				<div class="metric-card">
					<p class="metric-label">Precisão</p>
					<p class="metric-value large-text confidence">78%</p>
					<p class="metric-detail text-green-ia">WinRate</p>
				</div>
			</div>
		</section>
		
		<main class="dashboard-body-grid-ia">
			<!-- Bloco 1: Mercado & Estratégia -->
			<section class="section market-strategy-section">
				<h3 class="section-title">Mercado & Estratégia ⓘ</h3>

				<label class="input-label">Selecionar o mercado</label>
				<select class="input-select" v-model="market">
					<option value="EURUSD_Forex">EUR/USD - Forex</option>
				</select>

				<label class="input-label">Estratégia</label>
				<select class="input-select" v-model="strategy">
					<option value="Orion_AltaPerformance">IA Orion - Alta Performance</option>
				</select>
				<p class="strategy-description">Análise técnica avançada com machine learning</p>

				<label class="input-label">Modo de Negociação</label>
				<div class="button-group">
					<button
						:class="['mode-button', { active: mode === 'Veloz' }]"
						@click="mode = 'Veloz'"
					>
						Veloz
					</button>
					<button
						:class="['mode-button', { active: mode === 'Moderado' }]"
						@click="mode = 'Moderado'"
					>
						Moderado
					</button>
					<button
						:class="['mode-button', { active: mode === 'Devagar' }]"
						@click="mode = 'Devagar'"
					>
						Devagar
					</button>
				</div>
				<p class="mode-tip">Executa sinais imediatamente</p>
			</section>

			<!-- Bloco 2: Parâmetros de Entrada -->
			<section class="section entry-parameters-section">
				<h3 class="section-title">Parâmetros de Entrada</h3>

				<label class="input-label">Valor de Entrada (USD)</label>
				<input
					type="number"
					class="input-field"
					v-model.number="entryValue"
					placeholder="50"
				/>
				<p class="input-tip">Valor por operação</p>

				<label class="input-label">Alvo de Lucro (USD)</label>
				<input
					type="number"
					class="input-field"
					v-model.number="profitTarget"
					placeholder="100"
				/>
				<p class="input-tip">Meta diária de lucro</p>

				<label class="input-label">Limite de Perda (USD)</label>
				<input
					type="number"
					class="input-field"
					v-model.number="lossLimit"
					placeholder="25"
				/>
				<p class="input-tip">Stop loss diário</p>
			</section>

			<!-- Bloco 3: Gerenciamento de Risco -->
			<section class="section risk-management-section">
				<h3 class="section-title">Gerenciamento de Risco</h3>

				<div class="button-group risk-group">
					<button
						:class="['risk-button', { active: riskLevel === 'Fixo' }]"
						@click="riskLevel = 'Fixo'"
					>
						Fixo
					</button>
					<button
						:class="['risk-button', { active: riskLevel === 'Conservador' }]"
						@click="riskLevel = 'Conservador'"
					>
						Conservador
					</button>
					<button
						:class="['risk-button', { active: riskLevel === 'Moderado' }]"
						@click="riskLevel = 'Moderado'"
					>
						Moderado
					</button>
					<button
						:class="['risk-button', { active: riskLevel === 'Agressivo' }]"
						@click="riskLevel = 'Agressivo'"
					>
						Agressivo
					</button>
				</div>

				<!-- Barra de progresso visual -->
				<div class="risk-slider-container">
					<div class="risk-slider-labels">
						<span>Nível de Risco:</span>
						<span class="risk-level-text">Baixo</span>
					</div>
					<div class="risk-slider-bar">
						<div class="risk-slider-fill" style="width: 30%;"></div>
					</div>
					<p class="risk-description">Proteção máxima do capital com crescimento estável</p>
				</div>
			</section>

			<!-- Bloco 4: Controle da IA -->
			<section class="section ai-control-section">
				<h3 class="section-title">Controle da IA</h3>

				<div class="ai-status-toggle">
					<span class="status-label">Status da IA</span>
					<label class="switch">
						<input type="checkbox" v-model="aiEnabled" />
						<span class="slider round"></span>
					</label>
				</div>
				<p class="ai-toggle-tip">Quando ativada, a IA executa operações automaticamente</p>

				<div class="log-section">
					<h4 class="log-title">Logs Recentes</h4>
					<ul class="log-list">
						<li class="log-item live-op">
							<span class="log-time">14:32:15</span>
							<span class="log-message">Operação aberta: EUR/USD</span>
							<span class="log-status live">Ao vivo</span>
						</li>
						<li class="log-item profit">
							<span class="log-time">14:30:42</span>
							<span class="log-message">Lucro: +$12.50</span>
						</li>
						<li class="log-item completed">
							<span class="log-time">14:28:33</span>
							<span class="log-message">Análise concluída</span>
						</li>
					</ul>
				</div>
			</section>
		</main>
		
		<hr class="separator-chart" />
		
		<section class="market-chart-section">
			<div class="chart-header">
                <div class="chart-header-info">
                    <h3 class="chart-title">Análise de Mercado</h3>
                    <p class="chart-info">
                        EUR/USD - M5 | Última atualização: 14:32:15
                    </p>
                </div>
				<div class="chart-legend">
					<span class="legend-item compra"> 🟩 Compra</span>
					<span class="legend-item venda"> 🟥 Venda</span>
				</div>
			</div>
			<div ref="chartContainer" class="chart-placeholder"></div>
		</section>
	</div>
</template>
	
<script>
import { createChart, ColorType } from 'lightweight-charts';

export default {
	name: "InvestmentDashboard",
	props: {
		ticks: {
			type: Array,
			default: () => []
		},
		currentPrice: {
			type: Number,
			default: null
		},
		lastUpdateTime: {
			type: String,
			default: '--:--:--'
		}
	},
	data() {
		return {
			// Estado da IA (Ativado)
			aiEnabled: true,
			chart: null,
			lineSeries: null,
			chartInitialized: false, 
	
			// Seção Mercado & Estratégia
			market: "EURUSD_Forex",
			strategy: "Orion_AltaPerformance",
			// Modo de Negociação (Veloz)
			mode: "Veloz",
	
			// Seção Parâmetros de Entrada
			entryValue: 0.35, // Valor mínimo da Deriv
			profitTarget: 100,
			lossLimit: 25,
	
			// Seção Gerenciamento de Risco (Conservador)
			riskLevel: "Conservador",
		};
	},
	watch: {
		ticks: {
			handler(newTicks) {
				console.log('[InvestmentInactive] Ticks atualizados:', newTicks.length);
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
		// Emitir mudanças dos parâmetros para o componente pai
		entryValue(newValue) {
			console.log('[InvestmentInactive] 💰 Valor de entrada alterado:', newValue);
			this.$emit('update:entryValue', newValue);
		},
		profitTarget(newValue) {
			console.log('[InvestmentInactive] 🎯 Meta de lucro alterada:', newValue);
			this.$emit('update:profitTarget', newValue);
		},
		lossLimit(newValue) {
			console.log('[InvestmentInactive] 🛑 Limite de perda alterado:', newValue);
			this.$emit('update:lossLimit', newValue);
		},
		mode(newValue) {
			console.log('[InvestmentInactive] ⚡ Modo alterado:', newValue);
			this.$emit('update:mode', newValue);
		}
	},
	methods: {
		initChart() {
			if (this.chartInitialized || !this.$refs.chartContainer) {
				return;
			}

			try {
				const container = this.$refs.chartContainer;
				const containerWidth = container.offsetWidth || 800;
				const containerHeight = 350;

				console.log('[InvestmentInactive] Inicializando gráfico...', {
					width: containerWidth,
					height: containerHeight,
					ticksCount: this.ticks.length
				});

				this.chart = createChart(container, {
					width: containerWidth,
					height: containerHeight,
					localization: { locale: 'pt-BR' },
					layout: {
						background: { type: ColorType.Solid, color: '#242424' },
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
					lineColor: '#4caf50',
					topColor: 'rgba(76, 175, 80, 0.2)',
					bottomColor: 'rgba(76, 175, 80, 0.02)',
					lineWidth: 2,
					priceFormat: {
						type: 'price',
						precision: 2,
						minMove: 0.01,
					},
				});

				this.chartInitialized = true;
				console.log('[InvestmentInactive] ✅ Gráfico inicializado');
				this.updateChart();
			} catch (error) {
				console.error('[InvestmentInactive] ❌ Erro ao inicializar gráfico:', error);
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

				console.log('[InvestmentInactive] Atualizando gráfico com', data.length, 'pontos');
				this.lineSeries.setData(data);
				this.chart.timeScale().fitContent();
			} catch (error) {
				console.error('[InvestmentInactive] ❌ Erro ao atualizar gráfico:', error);
			}
		}
	},
	mounted() {
		console.log('[InvestmentInactive] Componente montado. Ticks:', this.ticks.length);
		console.log('[InvestmentInactive] 💰 Valor inicial de entryValue:', this.entryValue);
		
		// Aguardar um pouco para garantir que o container está renderizado
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
	
<style scoped>
/* Variáveis de Cores (Boas Práticas) */
:root {
	--color-bg-dark: #1e1e1e;
	--color-bg-card: #292929;
	--color-text-light: #f0f0f0;
	--color-text-secondary: #aaa;
	--color-accent-green: #4caf50; /* Verde principal para Ativo/Lucro/Confiança */
	--color-accent-dark-green: #1f351f; /* Fundo do status 'Operando' */
	--color-accent-red: #f44336; /* Vermelho principal para Venda/Perda */
	--color-brain-icon: #1a4f1a; /* Verde escuro para o ícone do cérebro */
}

/* Base e Container */
.dashboard-container {
	background-color: var(--color-bg-dark);
	color: var(--color-text-light);
	padding: 100px 40px;
	font-family: sans-serif; 
}

.metric-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.header-left {
	display: flex;
	align-items: baseline;
	flex-grow: 1;
	flex-direction: column;
}

.header-title {
	font-size: 1.5rem;
	font-weight: normal;
	margin: 0;
}

.header-title strong {
	font-weight: bold;
}

.header-subtitle {
	font-size: 1rem;
	color: #b3acac;
	margin-top: 5px;
}

.header-status {
	display: flex;
	align-items: center;
	background-color: var(--color-accent-dark-green);
	padding: 5px 10px;
	border-radius: 4px;
	align-self: flex-start;
}

.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-right: 5px;
}

.status-dot.operando {
	background-color: var(--color-accent-green);
}

.status-text {
	color: var(--color-accent-green);
	font-size: 0.9rem;
}

/* Container principal da seção de métricas */
.metric-section {
	background: #0e0f0e;
	box-shadow: 0px 2px 10px #011401;
	padding: 30px ;
	border-radius: 8px;
	border: 1px solid #191a19;
}

/* Grid de Métricas */
.main-metrics-grid {
	display: grid;
	grid-template-columns: 2fr repeat(3, 1fr);
	grid-template-rows: repeat(2, 1fr);
	gap: 15px;
	background: #0e0f0e;
	margin-top: 15px;
}

.metric-card {
	background-color: #0a0b0a;
	padding: 30px; /* Mantido para métricas */
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	text-align: left;
	border: 1px solid #191a19;
}

/* Posicionamento do Ícone da IA */
.ai-brain-icon {
	grid-area: 1 / 1 / 3 / 2; /* Ocupa as duas linhas da primeira coluna */
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(to right, rgb(20, 44, 15), rgb(18, 49, 25));
	border-radius: 8px;
}


.metric-detail {
	font-size: 0.8rem;
	margin-top: 5px;
	color: #a3a0a0;
}


/* Estilos de Texto das Métricas */
.metric-label {
	font-size: 0.8rem;
	margin-bottom: 5px;
	color: #a1a1a1;
}

.text-green-ia{
	color: #22c55e;
}

.metric-value.large-text {
	font-size: 1.5rem; /* Aumentado de 1.4rem */
	font-weight: bold;
	margin: 0;
	line-height: 1.2;
}



/* GRID PRINCIPAL - AJUSTADO PARA 2x2 EXATO */
.dashboard-body-grid-ia {
	display: grid;
	grid-template-columns: 1fr 1fr; /* Duas colunas iguais */
	grid-template-rows: 1fr 1fr; /* Duas linhas automáticas */
	gap: 15px;
    margin-top: 20px;
}

/* Cada bloco ocupa exatamente 1 célula do grid */
.market-strategy-section {
	grid-area: 1 / 1 / 2 / 2;
    height: 100px;
}

.entry-parameters-section {
	grid-area: 1 / 2 / 2 / 2;
    height: 100px;

}

.risk-management-section {
	grid-area: 2 / 1 / 3 / 2;
    height: 100px;

}

.ai-control-section {
	grid-area: 2 / 2 / 3 / 3;
    height: 100px;

}

/* Ajuste de altura dos blocos */
.market-strategy-section,
.entry-parameters-section {
	height: 500px; /* Removido altura fixa para adaptar conteúdo */
    display: flex;
    flex-direction: column;
    gap: 10px;
}



.risk-management-section,
.ai-control-section {
	height: 300px;
    margin-bottom: auto;
}

.section-title{
    text-align: left;
}

/* ESTILO DOS BLOCOS - PADRONIZADO E REDUZIDO PARA COPIAR A IMAGEM */
.section {
	background-color:#0e0f0e;
	padding: 20px; /* Reduzido para caber melhor no layout */
	border-radius: 8px;
}

.section-title {
	font-size: 1.1rem;
	font-weight: bold;
	margin-bottom: 15px;
}

p{
    text-align: left;
}

.label,
.input-label {
	font-size: 0.85rem;
	color: var(--color-text-secondary);
	margin-top: 20px; /* Reduzido */
	display: block;
    margin-bottom: none;
}

.input-select,
.input-field {
	width: 100%;
	padding: 10px;
	margin-top: 5px;
	background-color: #0a0b0a;
	border: 1px solid #242323;
	border-radius: 4px;
	color: var(--color-text-light);
	font-size: 0.9rem;
	box-sizing: border-box;
}

.input-field {
	appearance: none;
	-moz-appearance: textfield;
}

.strategy-description,
.input-tip,
.mode-tip,
.ai-toggle-tip,
.risk-description {
	font-size: 0.75rem;
	color: #777;
	margin-top: 5px;
}

/* Botões de Modo/Risco - ESTILO ATIVO CORRETO */
.button-group {
	display: flex;
	margin-top: 5px;
    background: transparent;
	border-radius: 4px;
	overflow: hidden;
    gap: 10px;
}

.mode-button,
.risk-button {
	flex-grow: 1;
	padding: 8px;
	background-color: #333333;
	color: var(--color-text-secondary);
	border: none;
	cursor: pointer;
	font-size: 0.85rem;
	transition: background-color 0.2s;
    height: 40px;
    border-radius: 8px;     
}

/* Botão ativo com fundo verde */
.mode-button.active,
.risk-button.active {
	background-color: #22c55e;
	color: #1e1e1e;
	font-weight: bold;
}

.risk-button:not(:last-child) {
	border-right: 1px solid #444;
}

/* Gerenciamento de Risco - Barra de progresso */
.risk-slider-container {
	margin-top: 15px;
}

.risk-slider-labels {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 0.85rem;
	color: var(--color-text-secondary);
	margin-bottom: 5px;
}

.risk-level-text {
	color: #22c55e;
	font-weight: bold;
}

.risk-slider-bar {
	width: 100%;
	height: 6px;
	background-color: #333;
	border-radius: 3px;
	overflow: hidden;
	margin-bottom: 5px;
}

.risk-slider-fill {
	height: 100%;
	background-color: #22c55e;
	border-radius: 3px;
}

/* Controle da IA e Toggle Switch */

.ai-status-toggle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 15px;
}

.status-label {
	font-size: 0.9rem;
	font-weight: bold;
}

/* SWITCH CSS (Toggle) */
.switch {
	position: relative;
	display: inline-block;
	width: 45px;
	height: 25px;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #444;
	transition: 0.4s;
}

.slider:before {
	position: absolute;
	content: "";
	height: 17px;
	width: 17px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	transition: 0.4s;
}

input:checked + .slider {
	background-color: var(--color-accent-green);
}

input:checked + .slider:before {
	transform: translateX(20px);
}

.slider.round {
	border-radius: 25px;
}

.slider.round:before {
	border-radius: 50%;
}

/* Logs Recentes */
.log-section {
	margin-top: 15px;
}

.log-title {
	font-size: 0.9rem;
	color: var(--color-text-secondary);
	margin-bottom: 5px;
}

.log-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.log-item {
	display: flex;
	gap: 10px;
	font-size: 0.8rem;
	padding: 4px 0;
}

.log-time {
	color: #777;
	width: 55px;
}

.log-message {
	flex-grow: 1;
}

.log-item.live-op {
	color: var(--color-text-light);
}

.log-item.profit .log-message {
	color: var(--color-accent-green);
}

.log-item.completed .log-message {
	color: var(--color-text-secondary);
}

.log-status.live {
	color: var(--color-accent-green);
	font-weight: bold;
	font-size: 0.75rem;
	padding: 2px 6px;
	background-color: rgba(34, 197, 94, 0.1);
	border-radius: 3px;
}

/* ---------------------------------------------------- */
/* GRÁFICO (INFERIOR) */
/* ---------------------------------------------------- */

.market-chart-section {
    margin-bottom: auto;
}
.separator-chart {
	border: none;
	height: 1px;
	background-color: #333;
	margin: 20px 0;
}

.market-chart-section {
	background-color: var(--color-bg-card);
	padding: 20px;
	border-radius: 8px;
	margin-bottom: 20px;
}

.chart-header {
	display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
	margin-bottom: 10px;
    width: 100%;
}

.chart-title {
	font-size: 1.1rem;
	font-weight: bold;
	flex-grow: 1;
}

.chart-info {
	font-size: 0.85rem;
	color: #a8a7a7;
	margin-right: 20px;
}

.chart-info strong {
	color: var(--color-text-light);
}

.chart-legend {
	font-size: 0.85rem;
	display: flex;
	gap: 15px;
	align-items: center;
}

.legend-item::before {
	content: "";
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 2px;
	margin-right: 5px;
	vertical-align: middle;
}

.legend-item.compra::before {
	background-color: var(--color-accent-green);
}

.legend-item.venda::before {
	background-color: var(--color-accent-red);
}

/* Container para o gráfico TradingView */
.chart-placeholder {
	height: 350px;
	background-color: #242424;
	border-radius: 4px;
	position: relative;
	overflow: hidden;
}
</style>
