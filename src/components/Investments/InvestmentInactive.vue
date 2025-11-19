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
					<svg class="brain-icon-svg" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path fill="currentColor" d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"></path>
					</svg>
				</div>
			
				<div class="metric-card">
					<p class="metric-label">Ativo Atual</p>
					<p class="metric-value large-text"></p>
					<p class="metric-detail"></p>
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
						<span class="risk-level-text">{{ riskLevelLabel }}</span>
					</div>
					<div class="risk-slider-bar">
						<div class="risk-slider-fill" :style="{ width: riskBarWidth }"></div>
					</div>
					<p class="risk-description">{{ riskDescription }}</p>
				</div>
			</section>

			<!-- Bloco 4: Controle da IA -->
			<section class="section ai-control-section">
				<h3 class="section-title">Controle da IA</h3>

				<div class="ai-status-toggle">
					<span class="status-label">Status da IA</span>
				</div>
				<p class="ai-toggle-tip">Quando ativada, a IA executa operações automaticamente</p>

				<div class="log-section">
					<h4 class="log-title">Histórico de Sessões</h4>
					<div v-if="isLoadingSessions" class="loading-sessions">
						<span class="loading-spinner"></span>
						<span>Carregando sessões...</span>
					</div>
					<div v-else-if="sessions.length === 0" class="no-sessions">
						<p>Nenhuma sessão registrada ainda.</p>
					</div>
					<div v-else class="sessions-list">
						<div 
							v-for="session in sessions" 
							:key="session.sessionId"
							:class="['session-item', {
								'session-active': session.isActive,
								'session-profit': !session.isActive && session.stats.profitLoss > 0,
								'session-loss': !session.isActive && session.stats.profitLoss < 0
							}]"
						>
							<div class="session-header">
								<span class="session-date">{{ formatSessionDate(session.createdAt) }}</span>
								<span 
									:class="['session-status', { 'active': session.isActive }]"
								>
									{{ session.isActive ? '🟢 Ativa' : '⚫ Finalizada' }}
								</span>
							</div>
							<div class="session-stats">
								<div class="stat-item">
									<span class="stat-label">Operações:</span>
									<span class="stat-value">{{ session.stats.totalTrades }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Lucro/Prejuízo:</span>
									<span 
										:class="['stat-value', {
											'profit': session.stats.profitLoss > 0,
											'loss': session.stats.profitLoss < 0
										}]"
									>
										{{ formatCurrency(session.stats.profitLoss, session.currency) }}
									</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Winrate:</span>
									<span class="stat-value">{{ session.stats.winrate }}%</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Duração:</span>
									<span class="stat-value">{{ formatDuration(session.durationMinutes) }}</span>
								</div>
							</div>
							<div v-if="session.deactivationReason" class="session-reason">
								<small>{{ session.deactivationReason }}</small>
							</div>
						</div>
					</div>
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
			
			// Histórico de sessões
			sessions: [],
			isLoadingSessions: false,
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
		},
		riskLevel(newValue) {
			console.log('[InvestmentInactive] 🎲 Risco alterado:', newValue);
			// Mapear riskLevel para modoMartingale (lowercase)
			const modoMartingale = newValue === 'Fixo' ? 'conservador' : newValue.toLowerCase();
			this.$emit('update:modoMartingale', modoMartingale);
		}
	},
	computed: {
		// Calcula a largura da barra de progresso baseado no nível de risco
		riskBarWidth() {
			const widths = {
				'Fixo': '10%',
				'Conservador': '25%',
				'Moderado': '50%',
				'Agressivo': '75%'
			};
			return widths[this.riskLevel] || '25%';
		},
		
		// Retorna o label do nível de risco
		riskLevelLabel() {
			const labels = {
				'Fixo': 'Mínimo',
				'Conservador': 'Baixo',
				'Moderado': 'Médio',
				'Agressivo': 'Alto'
			};
			return labels[this.riskLevel] || 'Baixo';
		},
		
		// Retorna a descrição do nível de risco
		riskDescription() {
			const descriptions = {
				'Fixo': 'Valor fixo por operação sem variação',
				'Conservador': 'Proteção máxima do capital com crescimento estável',
				'Moderado': 'Equilíbrio entre risco e retorno',
				'Agressivo': 'Maior exposição para potencial de ganhos elevados'
			};
			return descriptions[this.riskLevel] || 'Proteção máxima do capital com crescimento estável';
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
		},
		
		// 📊 Buscar histórico de sessões
		async fetchSessions() {
			try {
				this.isLoadingSessions = true;
				
				const userId = this.getUserId();
				if (!userId) {
					console.warn('[InvestmentInactive] ❌ UserId não disponível para buscar sessões');
					return;
				}
				
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const url = `${apiBase}/ai/sessions/${userId}?limit=1`;
				
				console.log('[InvestmentInactive] 📊 Buscando última sessão:', url);
				
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
				console.log('[InvestmentInactive] ✅ Última sessão recebida:', result);
				
				if (result.success && result.data) {
					// Exibir apenas a última sessão (primeira do array, já ordenada por data mais recente)
					this.sessions = result.data.length > 0 ? [result.data[0]] : [];
				}
			} catch (error) {
				console.error('[InvestmentInactive] ❌ Erro ao buscar sessões:', error);
			} finally {
				this.isLoadingSessions = false;
			}
		},
		
		// 🆔 Obter ID do usuário do token
		getUserId() {
			try {
				const token = localStorage.getItem('token');
				if (!token) return null;
				
				// Decodificar JWT token
				const payload = JSON.parse(atob(token.split('.')[1]));
				return payload.userId || payload.sub || payload.id;
			} catch (error) {
				console.error('[InvestmentInactive] Erro ao extrair userId do token:', error);
				return null;
			}
		},
		
		// 📅 Formatação de data
		formatSessionDate(dateString) {
			const date = new Date(dateString);
			const now = new Date();
			const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
			
			if (diffDays === 0) {
				return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
			} else if (diffDays === 1) {
				return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
			} else {
				return date.toLocaleString('pt-BR', { 
					day: '2-digit', 
					month: '2-digit', 
					year: 'numeric', 
					hour: '2-digit', 
					minute: '2-digit' 
				});
			}
		},
		
		// 💰 Formatação de moeda
		// eslint-disable-next-line no-unused-vars
		formatCurrency(value, currency = 'USD') {
			const sign = value >= 0 ? '+' : '';
			return `${sign}$${Math.abs(value).toFixed(2)}`;
		},
		
		// ⏱️ Formatação de duração
		formatDuration(minutes) {
			if (minutes < 60) {
				return `${minutes}min`;
			} else {
				const hours = Math.floor(minutes / 60);
				const mins = minutes % 60;
				return `${hours}h ${mins}min`;
			}
		}
	},
	mounted() {
		console.log('[InvestmentInactive] Componente montado. Ticks:', this.ticks.length);
		console.log('[InvestmentInactive] 💰 Valor inicial de entryValue:', this.entryValue);
		
		// Buscar histórico de sessões
		this.fetchSessions();
		
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

.brain-icon-svg {
	width: 150px;
	height: 150px;
	color: #22c55e; /* Verde Zenix */
	opacity: 0.3;
	transition: opacity 0.3s ease;
}

.ai-brain-icon:hover .brain-icon-svg {
	opacity: 0.5;
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

/* Logs/Sessões */
.log-section {
	margin-top: 15px;
}

.log-title {
	font-size: 0.9rem;
	color: var(--color-text-secondary);
	margin-bottom: 10px;
	font-weight: 600;
}

/* Estados de carregamento */
.loading-sessions,
.no-sessions {
	text-align: center;
	padding: 20px;
	color: var(--color-text-secondary);
	font-size: 0.85rem;
}

.loading-spinner {
	display: inline-block;
	width: 16px;
	height: 16px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-top-color: var(--color-accent-green);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-right: 8px;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

/* Lista de sessões */
.sessions-list {
	list-style: none;
	padding: 0;
	margin: 0;
	max-height: 400px;
	overflow-y: auto;
}

.session-item {
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 10px;
	transition: all 0.3s ease;
}

.session-item:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.2);
	transform: translateX(2px);
}

.session-item.session-active {
	border-color: var(--color-accent-green);
	background: rgba(76, 175, 80, 0.05);
}

.session-item.session-profit {
	border-left: 3px solid var(--color-accent-green);
}

.session-item.session-loss {
	border-left: 3px solid #ef4444;
}

.session-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.session-date {
	font-size: 0.85rem;
	color: var(--color-text-primary);
	font-weight: 500;
}

.session-status {
	font-size: 0.75rem;
	padding: 2px 8px;
	border-radius: 4px;
	background: rgba(255, 255, 255, 0.1);
	color: var(--color-text-secondary);
}

.session-status.active {
	background: rgba(76, 175, 80, 0.2);
	color: var(--color-accent-green);
}

.session-stats {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 8px;
	margin-bottom: 8px;
}

.stat-item {
	display: flex;
	justify-content: space-between;
	font-size: 0.8rem;
}

.stat-label {
	color: var(--color-text-secondary);
}

.stat-value {
	color: var(--color-text-primary);
	font-weight: 500;
}

.stat-value.profit {
	color: var(--color-accent-green);
}

.stat-value.loss {
	color: #ef4444;
}

.session-reason {
	margin-top: 8px;
	padding-top: 8px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	font-size: 0.75rem;
	color: var(--color-text-secondary);
	font-style: italic;
}

/* Compatibilidade com logs antigos (removido) */
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

.separator-chart {
	border: none;
	height: 1px;
	background-color: #333;
	margin: 10px 0 20px 0;
}

.market-chart-section {
	background-color: var(--color-bg-card);
	padding: 20px;
	border-radius: 8px;
	margin-bottom: 20px;
	margin-top: 10px;
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
