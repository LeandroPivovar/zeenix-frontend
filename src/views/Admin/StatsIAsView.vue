<template>
	<div class="layout">
		<main class="layout-content">
			<div class="background-glow"></div>
			<div class="background-grid"></div>
			<AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />
			
			<div class="main-header">
				<div class="main-header-left">
					<h1>Estatísticas das IAs</h1>
					<p>Monitoramento de performance e resultados das IAs cadastradas na Deriv.</p>
				</div>
				<div class="main-header-right">
					<button class="btn pdf-btn" @click="exportReportToPDF">
						<img src="../../assets/icons/box-down.svg" alt="Exportar PDF" width="20px"> Exportar Relatório
					</button>
				</div>
			</div>

			<!-- Seção de Monitoramento de IA -->
			<div class="ai-monitoring-section">
				<div class="ai-monitoring-header">
					<h2>Monitor de Volatilidade 100</h2>
					<button :class="['btn-ai-toggle', aiMonitoring.isActive ? 'active' : '']" @click="toggleAIMonitoring">
						<span v-if="!aiMonitoring.isActive">▶ Ativar IA</span>
						<span v-else>⏸ Desativar IA</span>
					</button>
				</div>

				<div v-if="aiMonitoring.isActive" class="ai-monitoring-content">
					<div class="price-display-section">
						<div class="current-price-card">
							<h3>Preço Atual</h3>
							<div class="price-value">
								<span v-if="aiMonitoring.currentPrice">{{ aiMonitoring.currentPrice.toFixed(2) }}</span>
								<span v-else>--</span>
							</div>
							<p class="price-timestamp">{{ aiMonitoring.lastUpdate }}</p>
						</div>

						<div class="last-10-prices-card">
							<h3>Últimos 10 Preços</h3>
							<div class="price-list">
								<div v-for="(tick, index) in aiMonitoring.ticks" :key="index" class="price-item">
									<span class="price-number">{{ (index + 1).toString().padStart(2, '0') }}.</span>
									<span class="price-value-item">{{ tick.value.toFixed(2) }}</span>
									<span class="price-time">{{ tick.timestamp }}</span>
									<span v-if="index > 0" :class="['price-variation', getVariationClass(tick.value, aiMonitoring.ticks[index - 1].value)]">
										{{ getVariationText(tick.value, aiMonitoring.ticks[index - 1].value) }}
									</span>
								</div>
								<div v-if="aiMonitoring.ticks.length === 0" class="no-data">
									<p>Aguardando dados...</p>
								</div>
							</div>
						</div>

						<div v-if="aiMonitoring.statistics" class="statistics-card">
							<h3>Estatísticas</h3>
							<div class="stats-grid">
								<div class="stat-item">
									<span class="stat-label">Mínimo:</span>
									<span class="stat-value">{{ aiMonitoring.statistics.min.toFixed(2) }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Máximo:</span>
									<span class="stat-value">{{ aiMonitoring.statistics.max.toFixed(2) }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Média:</span>
									<span class="stat-value">{{ aiMonitoring.statistics.avg.toFixed(2) }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Variação:</span>
									<span :class="['stat-value', aiMonitoring.statistics.change >= 0 ? 'positive' : 'negative']">
										{{ aiMonitoring.statistics.change.toFixed(2) }}%
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Seção de Trading Automático -->
				<div v-if="aiMonitoring.isActive" class="ai-trading-section">
					<div class="ai-trading-header">
						<h2>🤖 Trading Automático com IA</h2>
						<div class="trading-controls">
							<div class="input-group">
								<label>Valor por Operação:</label>
								<input 
									type="number" 
									v-model.number="tradingConfig.stakeAmount" 
									min="1"
									step="0.5"
									:disabled="tradingConfig.isActive"
								/>
							</div>
							<button 
								:class="['btn-trading-toggle', tradingConfig.isActive ? 'active' : '']" 
								@click="toggleAutomatedTrading"
							>
								<span v-if="!tradingConfig.isActive">🚀 Iniciar Trading</span>
								<span v-else>⏸ Parar Trading</span>
							</button>
						</div>
					</div>

					<div v-if="tradingConfig.isActive" class="trading-active-content">
						<!-- Operação Ativa -->
						<div v-if="activeTrade" class="active-trade-card">
							<div class="trade-header">
								<h3>📊 Operação em Andamento</h3>
								<span :class="['trade-signal', activeTrade.signal]">
									{{ activeTrade.signal === 'CALL' ? '📈 CALL' : '📉 PUT' }}
								</span>
							</div>

							<div class="trade-details">
								<div class="detail-row">
									<span class="detail-label">Preço de Entrada:</span>
									<span class="detail-value">${{ activeTrade.entryPrice?.toFixed(2) }}</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Preço Atual:</span>
									<span :class="['detail-value', getPriceChangeClass(activeTrade.entryPrice, activeTrade.currentPrice)]">
										${{ activeTrade.currentPrice?.toFixed(2) || '--' }}
									</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Variação:</span>
									<span :class="['detail-value', getPriceChangeClass(activeTrade.entryPrice, activeTrade.currentPrice)]">
										{{ getPriceDifference() }} ({{ getPriceChangePercent() }})
									</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Tempo Restante:</span>
									<span class="detail-value countdown">{{ formatTimeRemaining(activeTrade.timeRemaining) }}</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Investimento:</span>
									<span class="detail-value">${{ activeTrade.stakeAmount?.toFixed(2) }}</span>
								</div>
								<div class="detail-row profit-row">
									<span class="detail-label">Lucro Estimado:</span>
									<span :class="['detail-value profit-value', getEstimatedProfitClass()]">
										{{ getEstimatedProfit() }}
									</span>
								</div>
								
								<!-- Barra de progresso visual -->
								<div class="profit-progress-bar">
									<div :class="['progress-fill', getEstimatedProfitClass()]" :style="{ width: getProgressBarWidth() }"></div>
									<span class="progress-label">{{ isCurrentlyWinning() ? '✓ Ganhando' : '✗ Perdendo' }}</span>
								</div>
							</div>

							<div class="trade-reasoning">
								<p><strong>Análise da IA:</strong> {{ activeTrade.reasoning }}</p>
							</div>
						</div>

					<!-- Aguardando Próxima Operação -->
					<div v-else class="next-trade-card">
						<div class="next-trade-info">
							<div class="timer-icon">⏱️</div>
							<div>
								<h3>🔄 Aguardando próxima operação...</h3>
								<p class="countdown-text">Intervalo de segurança: {{ formatTimeRemaining(nextTradeCountdown) }}</p>
								<p class="info-text">A IA analisará o mercado novamente em breve</p>
							</div>
						</div>
					</div>

						<!-- Estatísticas do Trading -->
						<div class="trading-stats-card">
							<h3>Estatísticas da Sessão</h3>
							<div class="stats-row">
								<div class="stat-box">
									<span class="stat-number">{{ tradingStats.totalTrades }}</span>
									<span class="stat-label">Total de Operações</span>
								</div>
								<div class="stat-box win">
									<span class="stat-number">{{ tradingStats.wins }}</span>
									<span class="stat-label">Vitórias</span>
								</div>
								<div class="stat-box loss">
									<span class="stat-number">{{ tradingStats.losses }}</span>
									<span class="stat-label">Perdas</span>
								</div>
								<div class="stat-box">
									<span :class="['stat-number', tradingStats.profitLoss >= 0 ? 'positive' : 'negative']">
										{{ tradingStats.profitLoss >= 0 ? '+' : '' }}${{ tradingStats.profitLoss.toFixed(2) }}
									</span>
									<span class="stat-label">Lucro/Perda</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Histórico de Operações -->
					<div v-if="tradingConfig.isActive" class="trade-history-card">
						<div class="history-header">
							<h3>📋 Histórico de Operações</h3>
							<button class="btn-refresh" @click="loadTradeHistory">🔄 Atualizar</button>
						</div>
						
						<div v-if="tradeHistory.length > 0" class="history-table">
							<table>
								<thead>
									<tr>
										<th>Horário</th>
										<th>Sinal</th>
										<th>Entrada</th>
										<th>Saída</th>
										<th>Duração</th>
										<th>Status</th>
										<th>Lucro/Perda</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="trade in tradeHistory" :key="trade.id" :class="['trade-row', trade.status.toLowerCase()]">
										<td>{{ formatTradeTime(trade.closedAt) }}</td>
										<td>
											<span :class="['signal-badge', trade.signal.toLowerCase()]">
												{{ trade.signal === 'CALL' ? '📈 CALL' : '📉 PUT' }}
											</span>
										</td>
										<td>${{ trade.entryPrice.toFixed(2) }}</td>
										<td>${{ trade.exitPrice.toFixed(2) }}</td>
										<td>{{ trade.duration }}s</td>
										<td>
											<span :class="['status-badge', trade.status.toLowerCase()]">
												{{ trade.status === 'WON' ? '✅ Ganhou' : '❌ Perdeu' }}
											</span>
										</td>
										<td :class="['profit-cell', trade.profitLoss >= 0 ? 'positive' : 'negative']">
											{{ trade.profitLoss >= 0 ? '+' : '' }}${{ trade.profitLoss.toFixed(2) }}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div v-else class="no-history">
							<p>📊 Nenhuma operação realizada ainda</p>
							<p class="hint">As operações aparecerão aqui após serem finalizadas</p>
						</div>
					</div>
				</div>
			</div>

			<div class="main-content">
				<div class="filter-controls">
					<div class="date-filter">
						<input type="date" v-model="filterStartDate">
					</div>
					<div class="date-filter">
						<input type="date" v-model="filterEndDate">
					</div>
					<button class="btn btn-search" @click="fetchData">Buscar</button>
				</div>

				<div class="table-container" id="ia-stats-table">
					<table>
						<thead>
							<tr>
								<th class="bot-name-col">Nome do Bot</th>
								<th>Total de Trades</th>
								<th>Ganho</th>
								<th>Perda</th>
								<th class="profit-col">Lucro Total</th>
								<th>Lucro Alcançado</th>
								<th>Perda Alcançada</th>
								<th>Parada Ativada</th>
								<th>Risco Mais Usado</th>
								<th>Modo Mais Usado</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="bot in displayedStats" :key="bot.name">
								<td class="bot-name-col">
									<span :class="['status-dot', bot.status]"></span>
									{{ bot.name }}
								</td>
								<td>{{ bot.totalTrades }}</td>
								<td>{{ bot.wins }}</td>
								<td>{{ bot.losses }}</td>
								<td :class="['profit-col', bot.profit >= 0 ? 'positive-profit' : 'negative-profit']">
									{{ formatCurrency(bot.profit) }}
								</td>
								<td>{{ bot.profitReached }}</td>
								<td>{{ bot.lossReached }}</td>
								<td>{{ bot.activeStop }}</td>
								<td>{{ bot.riskMode }}</td>
								<td>{{ bot.tradeMode }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				
				<div class="bottom-summary-cards">
					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/robot.svg" alt="Total de IAs Ativas" class="card-icon" >
							<div class="card-text-group"> 
								<p class="card-value card-value-white">12</p>
								<h3 class="card-title">Total de IAs Ativas</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/stats.svg" alt="Lucro Combinado (7 dias)" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value positive-profit">+U$ 5.481,20</p>
								<h3 class="card-title">Lucro Combinado (7 dias)</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/target-IA.svg" alt="Média de Acerto Global" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value card-value-white">72,4%</p>
								<h3 class="card-title">Média de Acerto Global</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/trophy.svg" alt="IA com Maior Lucro" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value positive-profit">IA Zenix 2 <span class="card-value-white">(+3,848.93)</span></p>
								<h3 class="card-title">IA com Maior Lucro</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';

export default {
	name: 'StatsIAs',
	components: {
		AppSidebar,
	},
	data() {
		const currentDate = '2025-11-18';
		const startOfWeek = '2025-11-10'; 
	
		const botStats = [
			{ name: 'IA Zenix 2', status: 'active', totalTrades: 1320, wins: 1073, losses: 646, profit: 3848.93, profitReached: 399, lossReached: 0, activeStop: 71, riskMode: 'Conservador', tradeMode: 'Veloz' },
			{ name: 'IA Zenix 3', status: 'active', totalTrades: 2034, wins: 1456, losses: 845, profit: 1129.70, profitReached: 245, lossReached: 22, activeStop: 57, riskMode: 'Moderado', tradeMode: 'Veloz' },
			{ name: 'IA Orion V2', status: 'warning', totalTrades: 890, wins: 512, losses: 378, profit: 990.50, profitReached: 150, lossReached: 15, activeStop: 30, riskMode: 'Balanceado', tradeMode: 'Moderado' },
			{ name: 'IA Centauri', status: 'inactive', totalTrades: 315, wins: 150, losses: 165, profit: -210.00, profitReached: 40, lossReached: 55, activeStop: 25, riskMode: 'Agressivo', tradeMode: 'Lento' },
		];

		return {
			isSidebarOpen: true, 
			isSidebarCollapsed: false,
			
			filterStartDate: startOfWeek, 
			filterEndDate: currentDate,  

			allStats: botStats,
			displayedStats: botStats, 

			totalActiveIAs: 12,
			combinedProfit7Days: 5481.20,
			globalAccuracy: 72.4,
			topProfitIA: 'IA Zenix 2 (+3,848.93)',

			// Monitoramento de IA
			aiMonitoring: {
				isActive: false,
				currentPrice: null,
				ticks: [],
				statistics: null,
				lastUpdate: '--',
			},
			aiPollingInterval: null,

			// Trading Automático
			tradingConfig: {
				isActive: false,
				stakeAmount: 10,
			},
			activeTrade: null,
			nextTradeCountdown: 300, // 5 minutos em segundos
			tradingInterval: null,
			countdownInterval: null,
			tradingStats: {
				totalTrades: 0,
				wins: 0,
				losses: 0,
				profitLoss: 0,
			},
			tradeHistory: [],
			
			closeSidebar: () => { }, 
			toggleSidebarCollapse: () => {},
		};
	},
	methods: {
		formatCurrency(value) {
			const sign = value >= 0 ? '+' : ''; 
			const absoluteValue = Math.abs(value);
			return `${sign}${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(absoluteValue)}`;
		},
		
		/**
		 * Obter token da Deriv baseado na conta ativa
		 * EXATAMENTE como o OperationChart.vue faz
		 */
		getDerivToken() {
			console.log('[StatsIAsView] getTokenForAccount - Buscando token para conta');
			
			// 1. Obter informações da conta ativa do deriv_connection
			let accountLoginid = null;
			let preferredCurrency = null;
			
			try {
				const connectionStr = localStorage.getItem('deriv_connection');
				if (connectionStr) {
					const connection = JSON.parse(connectionStr);
					accountLoginid = connection.loginid;
					preferredCurrency = connection.tradeCurrency;
					
					console.log('[StatsIAsView] Informações da conta ativa:', {
						loginid: accountLoginid,
						currency: preferredCurrency
					});
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao parsear deriv_connection:', error);
			}
			
			// 2. Se a moeda preferida for DEMO, buscar token de conta demo
			const isDemoPreferred = preferredCurrency?.toUpperCase() === 'DEMO';
			if (isDemoPreferred) {
				console.log('[StatsIAsView] Moeda preferida é DEMO, buscando token de conta demo...');
				try {
					const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
					const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
					
					// Buscar qualquer conta demo disponível (VRTC ou VRT)
					for (const [loginid, token] of Object.entries(tokensByLoginId)) {
						if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
							console.log('[StatsIAsView] ✓ Token demo encontrado:', loginid);
							return token;
						}
					}
					console.warn('[StatsIAsView] ⚠ Nenhuma conta demo encontrada, mas moeda preferida é DEMO');
				} catch (error) {
					console.error('[StatsIAsView] Erro ao buscar token demo:', error);
				}
			}
			
			// 3. Se temos um loginid específico, buscar o token correspondente
			if (accountLoginid) {
				try {
					const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
					const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
					
					console.log('[StatsIAsView] Buscando token para loginid:', accountLoginid);
					console.log('[StatsIAsView] Loginids disponíveis:', Object.keys(tokensByLoginId));
					
					// Verificar se é conta demo
					const isDemoLoginId = accountLoginid.startsWith('VRTC') || accountLoginid.startsWith('VRT');
					if (isDemoLoginId) {
						console.log('[StatsIAsView] ✓ LoginID identificado como conta DEMO');
					}
					
					const specificToken = tokensByLoginId[accountLoginid];
					if (specificToken) {
						console.log('[StatsIAsView] ✓ Token específico encontrado para loginid:', accountLoginid);
						console.log('[StatsIAsView] - Tipo:', isDemoLoginId ? 'DEMO' : 'REAL');
						return specificToken;
					} else {
						console.warn('[StatsIAsView] ⚠ Token específico NÃO encontrado para loginid:', accountLoginid);
						
						// Se for conta demo e não encontrou token, buscar qualquer token demo
						if (isDemoLoginId) {
							console.log('[StatsIAsView] Tentando encontrar token demo alternativo...');
							for (const [loginid, token] of Object.entries(tokensByLoginId)) {
								if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
									console.log('[StatsIAsView] ✓ Token demo alternativo encontrado:', loginid);
									return token;
								}
							}
						}
					}
				} catch (error) {
					console.error('[StatsIAsView] Erro ao buscar token específico:', error);
				}
			}
			
			// 4. Fallback: token padrão
			const defaultToken = localStorage.getItem('deriv_token');
			console.log('[StatsIAsView] Usando token padrão:', {
				hasToken: !!defaultToken,
				tokenPreview: defaultToken ? `${defaultToken.substring(0, 10)}...` : 'null'
			});
			
			if (!defaultToken) {
				console.error('[StatsIAsView] ERRO: Nenhum token encontrado!');
			}
			
			return defaultToken;
		},
		
		/**
		 * Obter moeda preferida do usuário
		 * Igual ao OperationChart.vue - pega a moeda da conta ativa
		 */
		getPreferredCurrency() {
			console.log('[StatsIAsView] Buscando moeda preferida...');
			
			// 1. Tentar buscar do objeto de conexão (moeda da conta ativa)
			try {
				const connectionStr = localStorage.getItem('deriv_connection');
				if (connectionStr) {
					const connection = JSON.parse(connectionStr);
					if (connection.tradeCurrency) {
						const currency = connection.tradeCurrency.toUpperCase();
						console.log('[StatsIAsView] Moeda encontrada em deriv_connection:', currency);
						
						// Se for DEMO, retornar USD (DEMO não é moeda real)
						if (currency === 'DEMO') {
							console.log('[StatsIAsView] Moeda é DEMO, usando USD');
							return 'USD';
						}
						
						return currency;
					}
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao parsear deriv_connection:', error);
			}
			
			// 2. Fallback: tentar buscar currency do userSettings
			try {
				const userSettingsStr = localStorage.getItem('user_settings');
				if (userSettingsStr) {
					const userSettings = JSON.parse(userSettingsStr);
					if (userSettings.currency) {
						console.log('[StatsIAsView] Moeda encontrada em user_settings:', userSettings.currency);
						return userSettings.currency.toUpperCase();
					}
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao parsear user_settings:', error);
			}
			
			// 3. Fallback final: USD
			console.log('[StatsIAsView] Usando USD como fallback');
			return 'USD';
		},
		
		fetchData() {
			console.log(`Buscando dados de ${this.filterStartDate} a ${this.filterEndDate}`);
			this.displayedStats = this.allStats; 
		},

		exportReportToPDF() {
			alert(`Download do PDF de Estatísticas iniciado! (Arquivo: Relatorio_IAs_${this.filterStartDate}_a_${this.filterEndDate}.pdf)`);
		},

		// Métodos de monitoramento de IA
		async toggleAIMonitoring() {
			if (this.aiMonitoring.isActive) {
				this.stopAIMonitoring();
			} else {
				await this.startAIMonitoring();
			}
		},

		async startAIMonitoring() {
			try {
				console.log('[StatsIAsView] Iniciando monitoramento de IA...');
				
				// Iniciar monitoramento no backend
				const response = await fetch('https://taxafacil.site/api/ai/start', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const result = await response.json();

				if (result.success) {
					this.aiMonitoring.isActive = true;
					console.log('[StatsIAsView] Monitoramento iniciado com sucesso');
					
					// Iniciar polling para buscar dados a cada 2 segundos
					this.startPolling();
				} else {
					console.error('[StatsIAsView] Erro ao iniciar monitoramento:', result.message);
					alert('Erro ao iniciar monitoramento: ' + result.message);
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao iniciar monitoramento:', error);
				alert('Erro ao conectar com o servidor');
			}
		},

		stopAIMonitoring() {
			console.log('[StatsIAsView] Parando monitoramento de IA...');
			
			this.aiMonitoring.isActive = false;
			this.stopPolling();

			// Parar monitoramento no backend
			fetch('https://taxafacil.site/api/ai/stop', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			}).catch(error => {
				console.error('[StatsIAsView] Erro ao parar monitoramento:', error);
			});

			// Limpar dados
			this.aiMonitoring.currentPrice = null;
			this.aiMonitoring.ticks = [];
			this.aiMonitoring.statistics = null;
			this.aiMonitoring.lastUpdate = '--';
		},

		startPolling() {
			// Buscar dados imediatamente
			this.fetchAIData();

			// Continuar buscando a cada 2 segundos
			this.aiPollingInterval = setInterval(() => {
				this.fetchAIData();
			}, 2000);
		},

		stopPolling() {
			if (this.aiPollingInterval) {
				clearInterval(this.aiPollingInterval);
				this.aiPollingInterval = null;
			}
		},

		async fetchAIData() {
			try {
				const response = await fetch('https://taxafacil.site/api/ai/ticks');
				const result = await response.json();

				if (result.success) {
					this.aiMonitoring.ticks = result.data.ticks || [];
					this.aiMonitoring.currentPrice = result.data.currentPrice;
					this.aiMonitoring.statistics = result.data.statistics;
					this.aiMonitoring.lastUpdate = new Date().toLocaleTimeString('pt-BR');
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao buscar dados:', error);
			}
		},

		getVariationClass(current, previous) {
			if (current > previous) return 'positive';
			if (current < previous) return 'negative';
			return 'neutral';
		},

		getVariationText(current, previous) {
			const diff = current - previous;
			if (diff > 0) return `+${diff.toFixed(2)}`;
			return diff.toFixed(2);
		},

		// Métodos de Trading Automático
		async toggleAutomatedTrading() {
			if (this.tradingConfig.isActive) {
				this.stopAutomatedTrading();
			} else {
				await this.startAutomatedTrading();
			}
		},

		async startAutomatedTrading() {
			if (this.tradingConfig.stakeAmount < 1) {
				alert('Valor de entrada deve ser no mínimo $1');
				return;
			}

			console.log('[StatsIAsView] Iniciando trading automático...');
			this.tradingConfig.isActive = true;
			
			// Carregar estatísticas e histórico do banco
			await this.loadSessionStats();
			await this.loadTradeHistory();
			
			this.nextTradeCountdown = 0;
			await this.executeNextTrade();
			this.startCountdown();
		},

		stopAutomatedTrading() {
			console.log('[StatsIAsView] Parando trading automático...');
			this.tradingConfig.isActive = false;
			
			if (this.tradingInterval) {
				clearInterval(this.tradingInterval);
				this.tradingInterval = null;
			}

			if (this.countdownInterval) {
				clearInterval(this.countdownInterval);
				this.countdownInterval = null;
			}

			this.nextTradeCountdown = 300;
		},

		async executeNextTrade() {
			if (!this.tradingConfig.isActive) return;

			try {
				console.log('[StatsIAsView] Analisando mercado com Gemini...');

				const analyzeResponse = await fetch('https://taxafacil.site/api/ai/analyze', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: 1 }),
				});

				const analyzeResult = await analyzeResponse.json();

				if (!analyzeResult.success) {
					console.error('[StatsIAsView] Erro na análise:', analyzeResult.message);
					return;
				}

				const signal = analyzeResult.data;
				console.log('[StatsIAsView] Sinal recebido:', signal);

			// Obter token real da Deriv (mesmo método do OperationChart.vue)
			const derivToken = this.getDerivToken();
			
			if (!derivToken) {
				console.error('[StatsIAsView] Token da Deriv não encontrado');
				alert('Por favor, conecte sua conta Deriv primeiro');
				return;
			}
			
			// Obter moeda preferida (USD, BTC, DEMO, etc)
			const preferredCurrency = this.getPreferredCurrency();
			console.log('[StatsIAsView] ====== INFORMAÇÕES DA CONTA ======');
			console.log('[StatsIAsView] Moeda:', preferredCurrency);
			console.log('[StatsIAsView] Token (preview):', derivToken.substring(0, 15) + '...');
			console.log('[StatsIAsView] Stake Amount:', this.tradingConfig.stakeAmount);
			console.log('[StatsIAsView] =====================================');
			
			const tradeResponse = await fetch('https://taxafacil.site/api/ai/execute-trade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: 1,
					signal,
					stakeAmount: this.tradingConfig.stakeAmount,
					derivToken: derivToken,
					currency: preferredCurrency,
				}),
			});

			const tradeResult = await tradeResponse.json();

			if (!tradeResult.success) {
				console.error('[StatsIAsView] Erro ao executar trade:', tradeResult.message);
				
				// Verificar se é erro de saldo insuficiente
				if (tradeResult.error && tradeResult.error.includes('InsufficientBalance')) {
					alert(
						'❌ Saldo insuficiente!\n\n' +
						'Seu saldo não é suficiente para esta operação.\n\n' +
						'💡 Dica: Se você tem uma conta DEMO USD, troque de conta no Dashboard:\n' +
						'1. Vá para o Dashboard\n' +
						'2. Clique no seletor de contas (canto superior direito)\n' +
						'3. Selecione sua conta DEMO USD\n' +
						'4. Volte para IAs de Investimento e tente novamente'
					);
				} else {
					alert(`❌ Erro ao executar operação: ${tradeResult.error || tradeResult.message}`);
				}
				
				return;
			}

				console.log('[StatsIAsView] Trade iniciado:', tradeResult.data.tradeId);

				this.activeTrade = {
					id: tradeResult.data.tradeId,
					signal: signal.signal,
					entryPrice: this.aiMonitoring.currentPrice,
					currentPrice: this.aiMonitoring.currentPrice,
					timeRemaining: signal.duration,
					reasoning: signal.reasoning,
					stakeAmount: this.tradingConfig.stakeAmount,
				};

				this.monitorActiveTrade();

			} catch (error) {
				console.error('[StatsIAsView] Erro ao executar trade:', error);
			}
		},

		monitorActiveTrade() {
			const monitorInterval = setInterval(async () => {
				if (!this.activeTrade) {
					clearInterval(monitorInterval);
					return;
				}

				try {
					const response = await fetch('https://taxafacil.site/api/ai/active-trade');
					const result = await response.json();

					if (!result.success || !result.data) {
						clearInterval(monitorInterval);
						return;
					}

					const trade = result.data;

					this.activeTrade.currentPrice = trade.currentPrice || this.aiMonitoring.currentPrice;
					this.activeTrade.timeRemaining = trade.timeRemaining;
					this.activeTrade.profitLoss = trade.profitLoss;

				// Verificar se o tempo acabou OU se o status é final
				if (trade.timeRemaining <= 0 || trade.status === 'WON' || trade.status === 'LOST') {
					console.log('[StatsIAsView] Trade finalizado:', trade.status || 'Tempo esgotado');
					
					// Limpar operação ativa imediatamente
					this.activeTrade = null;
					clearInterval(monitorInterval);

					// Recarregar estatísticas e histórico do banco
					await this.loadSessionStats();
					await this.loadTradeHistory();
					
					// Iniciar countdown de 5 minutos (300 segundos) para a próxima operação
					if (this.tradingConfig.isActive) {
						console.log('[StatsIAsView] Aguardando 5 minutos para próxima operação...');
						this.nextTradeCountdown = 300;
						this.startCountdown();
						
						// Executar próxima operação após 5 minutos
						setTimeout(() => {
							if (this.tradingConfig.isActive) {
								this.executeNextTrade();
							}
						}, 300000); // 300000ms = 5 minutos
					}
				}

				} catch (error) {
					console.error('[StatsIAsView] Erro ao monitorar trade:', error);
				}
			}, 1000);
		},

		startCountdown() {
			this.countdownInterval = setInterval(() => {
				if (this.nextTradeCountdown > 0) {
					this.nextTradeCountdown--;
				}
			}, 1000);
		},

		formatTimeRemaining(seconds) {
			if (!seconds || seconds < 0) return '00:00';
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		},

		getPriceChangeClass(entryPrice, currentPrice) {
			if (!entryPrice || !currentPrice) return '';
			if (currentPrice > entryPrice) return 'positive';
			if (currentPrice < entryPrice) return 'negative';
			return '';
		},

		getEstimatedProfitClass() {
			if (!this.activeTrade) return '';
			
			// Usar o profitLoss da API para determinar a classe
			const profit = this.activeTrade.profitLoss || 0;
			return profit >= 0 ? 'positive' : 'negative';
		},

		getEstimatedProfit() {
			if (!this.activeTrade) return '$0.00';
			
			// Usar o profitLoss retornado pela API (cálculo em tempo real do backend)
			const profit = this.activeTrade.profitLoss || 0;
			
			const sign = profit >= 0 ? '+' : '';
			return `${sign}$${profit.toFixed(2)}`;
		},

		getPriceDifference() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return '--';
			}
			
			const diff = this.activeTrade.currentPrice - this.activeTrade.entryPrice;
			const sign = diff >= 0 ? '+' : '';
			return `${sign}$${diff.toFixed(2)}`;
		},

		getPriceChangePercent() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return '0.00%';
			}
			
			const percentChange = ((this.activeTrade.currentPrice - this.activeTrade.entryPrice) / this.activeTrade.entryPrice) * 100;
			const sign = percentChange >= 0 ? '+' : '';
			return `${sign}${percentChange.toFixed(2)}%`;
		},

		isCurrentlyWinning() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return false;
			}
			
			const { signal, entryPrice, currentPrice } = this.activeTrade;
			return (signal === 'CALL' && currentPrice > entryPrice) ||
				(signal === 'PUT' && currentPrice < entryPrice);
		},

		getProgressBarWidth() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return '50%';
			}
			
			const { entryPrice, currentPrice } = this.activeTrade;
			const diff = Math.abs(currentPrice - entryPrice);
			const percentDiff = (diff / entryPrice) * 100;
			
			// Normalizar para barra de 0-100%
			// Se a diferença for muito pequena, mostrar pelo menos 20%
			// Se for grande (>1%), mostrar 100%
			const normalizedWidth = Math.min(Math.max(percentDiff * 50, 20), 100);
			
			return `${normalizedWidth}%`;
		},

		async loadSessionStats() {
			try {
				const response = await fetch('https://taxafacil.site/api/ai/session-stats/1');
				const result = await response.json();

				if (result.success && result.data) {
					this.tradingStats.totalTrades = result.data.totalTrades;
					this.tradingStats.wins = result.data.wins;
					this.tradingStats.losses = result.data.losses;
					this.tradingStats.profitLoss = result.data.profitLoss;
					console.log('[StatsIAsView] Estatísticas carregadas:', result.data);
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar estatísticas:', error);
			}
		},

		async loadTradeHistory() {
			try {
				const response = await fetch('https://taxafacil.site/api/ai/trade-history/1');
				const result = await response.json();

				if (result.success && result.data) {
					this.tradeHistory = result.data;
					console.log('[StatsIAsView] Histórico carregado:', result.data.length, 'operações');
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar histórico:', error);
			}
		},

		formatTradeTime(timestamp) {
			if (!timestamp) return '--';
			const date = new Date(timestamp);
			return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		},
	},

	beforeUnmount() {
		this.stopPolling();
		this.stopAutomatedTrading();
	},
}
</script>

<style scoped>
.layout {
	background-color: #121212;
	color: #fff;
	min-height: 100vh;
	width: calc(100% - 240px);
	margin-left: 240px;
	padding: 0 20px;
	font-family: 'Roboto', sans-serif;
}

h1{
	font-weight: 700;
}

.layout-content {
	margin: 0;
	justify-content: flex-start;
	padding: 40px;

}

.main-header {
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	margin-bottom: 30px;
	padding-top: 20px;
	opacity: 0;
	animation: fadeIn 0.5s ease-out forwards;
}

.main-header-left {
	width: 100%;
	text-align: left;
}

.main-content {
	width: 100%;
}

.main-header h1 {
	font-size: 30px;
	margin: 0;
}

.main-header p {
	font-size: 14px;
	color: #999;
	margin: 5px 0 0 0;
}

.btn {
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: 500; 
}

.pdf-btn {
	background-color: #00b862;
	color: #000000;
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	min-width: 190px;
}

.filter-controls {
	display: flex;
	gap: 10px; 
	align-items: center; 
	margin-bottom: 20px;
	opacity: 0;
	animation: fadeIn 0.6s ease-out forwards;
	animation-delay: 0.1s;
}

.date-filter input {
	background-color: #1e1e1e;
	color: #fff;
	border: 1px solid #333;
	padding: 8px;
	border-radius: 4px;
	font-family: 'Roboto', sans-serif;
}

.btn-search {
	background-color: #00b862;
	color: #fff;
}

/* Tabela */
.table-container {
	overflow-x: auto;
	overflow-y: auto;
	background: #191a19;
	opacity: 0;
	transform: translateY(20px);
	animation: fadeInUp 0.6s ease-out forwards;
	animation-delay: 0.2s;
}

.table-container::-webkit-scrollbar {
	width: 8px;
	height: 8px; 
}

.table-container::-webkit-scrollbar-track {
	background: #2a2a2a;
}

.table-container::-webkit-scrollbar-thumb {
	background-color: #555; 
	border-radius: 4px; 
	border: 2px solid #2a2a2a; 
}

.table-container::-webkit-scrollbar-thumb:hover {
	background-color: #888;
}


table {
	width: 100%;
	overflow: hidden;
	margin-bottom: 30px; 
}

th, td {
	padding: 12px 15px;
	text-align: left;
	border-bottom: 1px solid #333;
	font-size: 13px; 
}

thead th {
	background-color: #252525;
	color: #ddd;
	font-weight: 600; 
	text-transform: uppercase;
	font-size: 11px; 
}

tbody tr {
	color: rgb(182, 182, 182);
	font-weight: 500;
}

tbody tr:hover {
	background-color: #2a2a2a;
}


.status-dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.status-dot.active {
	background-color: #00b862; 
}

.status-dot.warning {
	background-color: #ffc107; 
}

.status-dot.inactive {
	background-color: #dc3545; 
}

.profit-col {
	font-weight: bold;
}

.positive-profit {
	color: #00b862; 
}

.negative-profit {
	color: #dc3545; 
}

.bottom-summary-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr); 
	gap: 15px;
	margin-top: 20px;
}

.bottom-card {
	background-color: #1e1e1e;
	padding: 10px;
	border-radius: 8px;
	display: flex;
	height: 70px; 
	align-items: center;
	opacity: 0;
	transform: translateY(20px);
	animation: fadeInUp 0.6s ease-out forwards;
}

/* Delays escalonados para cada card */
.bottom-card:nth-child(1) { animation-delay: 0.3s; }
.bottom-card:nth-child(2) { animation-delay: 0.4s; }
.bottom-card:nth-child(3) { animation-delay: 0.5s; }
.bottom-card:nth-child(4) { animation-delay: 0.6s; }

.bottom-card .card-content {
	display: flex;
	flex-direction: row; 
	justify-content: flex-start;
	align-items: center;
	text-align: left;
	gap: 15px;
	width: 100%;
}

.card-content {
	gap: 15px;
}

.card-icon {
	filter: invert(100%); 
	width: 30px;
	margin: 0 10px;
}

.card-text-group {
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-start;
	justify-content: center;
	gap: 2px; 
}

.bottom-card .card-title {
	font-size: 11px;
	color: #a7a7a7;
	margin: 0;
	text-transform: uppercase;
	font-weight: 500; 
}

.bottom-card .card-value {
	font-size: 18px;
	font-weight: 700; 
	margin: 0;
}

.card-value-white{
	color: white;
}

@media (min-width: 992px) {

    /* Tabela */
    .table-container {
        overflow-x: auto;
        min-height: 600px;
        overflow-y: auto;
        background: #191a19;
    }
}

/* Seção de Monitoramento de IA */
.ai-monitoring-section {
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 30px;
	animation: fadeIn 0.5s ease-out 0.1s forwards;
	opacity: 0;
}

.ai-monitoring-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.ai-monitoring-header h2 {
	font-size: 22px;
	font-weight: 600;
	color: #f8fafc;
	margin: 0;
}

.btn-ai-toggle {
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
	color: white;
	border: none;
	padding: 12px 24px;
	border-radius: 8px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 8px;
}

.btn-ai-toggle:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-ai-toggle.active {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.btn-ai-toggle.active:hover {
	box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.ai-monitoring-content {
	animation: slideDown 0.4s ease-out;
}

.price-display-section {
	display: grid;
	grid-template-columns: 1fr 2fr 1fr;
	gap: 20px;
	margin-top: 20px;
}

.current-price-card,
.last-10-prices-card,
.statistics-card {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.1);
	border-radius: 10px;
	padding: 20px;
}

.current-price-card h3,
.last-10-prices-card h3,
.statistics-card h3 {
	font-size: 14px;
	font-weight: 600;
	color: #94a3b8;
	margin: 0 0 16px 0;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.price-value {
	font-size: 48px;
	font-weight: 800;
	color: #06d6a0;
	text-align: center;
	margin: 20px 0;
	text-shadow: 0 0 20px rgba(6, 214, 160, 0.3);
}

.price-timestamp {
	text-align: center;
	font-size: 12px;
	color: #64748b;
	margin: 0;
}

.price-list {
	max-height: 300px;
	overflow-y: auto;
}

.price-item {
	display: grid;
	grid-template-columns: 30px 80px 80px 1fr;
	gap: 10px;
	padding: 8px 12px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.05);
	align-items: center;
	font-size: 13px;
}

.price-item:last-child {
	border-bottom: none;
}

.price-number {
	color: #64748b;
	font-weight: 600;
}

.price-value-item {
	color: #f8fafc;
	font-weight: 600;
	font-family: 'Courier New', monospace;
}

.price-time {
	color: #94a3b8;
	font-size: 11px;
}

.price-variation {
	text-align: right;
	font-weight: 600;
	font-size: 12px;
}

.price-variation.positive {
	color: #10b981;
}

.price-variation.negative {
	color: #ef4444;
}

.price-variation.neutral {
	color: #64748b;
}

.no-data {
	text-align: center;
	padding: 40px 20px;
	color: #64748b;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;
}

.stat-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
}

.stat-label {
	color: #94a3b8;
	font-size: 13px;
	font-weight: 500;
}

.stat-value {
	color: #f8fafc;
	font-size: 16px;
	font-weight: 700;
	font-family: 'Courier New', monospace;
}

.stat-value.positive {
	color: #10b981;
}

.stat-value.negative {
	color: #ef4444;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
    }
}

/* Seção de Trading Automático */
.ai-trading-section {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%);
	border: 1px solid rgba(16, 185, 129, 0.3);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 30px;
	animation: fadeIn 0.5s ease-out 0.2s forwards;
	opacity: 0;
}

.ai-trading-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
	flex-wrap: wrap;
	gap: 16px;
}

.ai-trading-header h2 {
	font-size: 24px;
	font-weight: 700;
	color: #f8fafc;
	margin: 0;
}

.trading-controls {
	display: flex;
	gap: 16px;
	align-items: center;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.input-group label {
	font-size: 12px;
	color: #94a3b8;
	font-weight: 500;
}

.input-group input {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	padding: 10px 14px;
	color: #f8fafc;
	font-size: 14px;
	font-weight: 600;
	width: 140px;
	transition: all 0.2s ease;
}

.input-group input:focus {
	outline: none;
	border-color: #10b981;
	box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-group input:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-trading-toggle {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	color: white;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-trading-toggle:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-trading-toggle.active {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

.btn-trading-toggle.active:hover {
	box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.trading-active-content {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	margin-top: 20px;
}

.active-trade-card,
.next-trade-card {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
	grid-column: span 2;
}

.trade-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.trade-header h3 {
	font-size: 18px;
	font-weight: 600;
	color: #f8fafc;
	margin: 0;
}

.trade-signal {
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 6px;
}

.trade-signal.CALL {
	background: rgba(16, 185, 129, 0.2);
	color: #10b981;
	border: 1px solid rgba(16, 185, 129, 0.4);
}

.trade-signal.PUT {
	background: rgba(239, 68, 68, 0.2);
	color: #ef4444;
	border: 1px solid rgba(239, 68, 68, 0.4);
}

.trade-details {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 20px;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
}

.detail-label {
	color: #94a3b8;
	font-size: 13px;
	font-weight: 500;
}

.detail-value {
	color: #f8fafc;
	font-size: 16px;
	font-weight: 700;
	font-family: 'Courier New', monospace;
}

.detail-value.countdown {
	color: #60a5fa;
	font-size: 20px;
}

.detail-row.profit-row {
	grid-column: span 2;
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1));
	border: 1px solid rgba(99, 102, 241, 0.3);
	padding: 18px;
}

.detail-value.profit-value {
	font-size: 24px;
	font-weight: 800;
	text-shadow: 0 0 10px currentColor;
}

.profit-progress-bar {
	grid-column: span 2;
	position: relative;
	height: 50px;
	background: rgba(30, 41, 59, 0.5);
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid rgba(148, 163, 184, 0.2);
	margin-top: 8px;
}

.progress-fill {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	transition: width 0.5s ease, background 0.3s ease;
	border-radius: 12px;
}

.progress-fill.positive {
	background: linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.6));
	box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.progress-fill.negative {
	background: linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.6));
	box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.progress-label {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	color: #f8fafc;
	font-size: 16px;
	font-weight: 700;
	z-index: 10;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.trade-reasoning {
	padding: 16px;
	background: rgba(59, 130, 246, 0.1);
	border-left: 3px solid #3b82f6;
	border-radius: 8px;
	margin-top: 16px;
}

.trade-reasoning p {
	margin: 0;
	color: #cbd5e1;
	font-size: 14px;
	line-height: 1.6;
}

.next-trade-info {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 20px;
}

.timer-icon {
	font-size: 48px;
	animation: pulse 2s ease-in-out infinite;
}

.next-trade-info h3 {
	font-size: 18px;
	color: #f8fafc;
	margin: 0 0 12px 0;
	font-weight: 600;
}

.next-trade-info .countdown-text {
	color: #06d6a0;
	font-size: 20px;
	margin: 0 0 8px 0;
	font-family: 'Courier New', monospace;
	font-weight: 700;
}

.next-trade-info .info-text {
	color: #94a3b8;
	font-size: 14px;
	margin: 0;
	font-style: italic;
}

.trading-stats-card {
	grid-column: span 2;
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
}

.trading-stats-card h3 {
	font-size: 16px;
	color: #f8fafc;
	margin: 0 0 20px 0;
	font-weight: 600;
}

.stats-row {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
}

.stat-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
	border: 1px solid rgba(148, 163, 184, 0.1);
	transition: all 0.3s ease;
}

.stat-box:hover {
	transform: translateY(-4px);
	border-color: rgba(148, 163, 184, 0.3);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stat-box.win {
	border-color: rgba(16, 185, 129, 0.3);
}

.stat-box.loss {
	border-color: rgba(239, 68, 68, 0.3);
}

.stat-number {
	font-size: 32px;
	font-weight: 700;
	color: #f8fafc;
	font-family: 'Courier New', monospace;
	margin-bottom: 8px;
}

.stat-label {
	font-size: 12px;
	color: #94a3b8;
	text-align: center;
	font-weight: 500;
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 0.8;
    }
}

@media (max-width: 992px) {
	.sidebar{
		display: none;
	}
	.layout {
		margin-left: 0;
		width: 100%;
		box-sizing: border-box;
	}
	
	.main-header {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.main-header-right {
		margin-top: 15px; 
		width: 100%;
		text-align: right;
	}
	
	.filter-controls {
		flex-direction: row; 
		flex-wrap: wrap; 
	}
	
	.date-filter, .btn-search {
		width: calc(50% - 5px); 
	}

	.bottom-summary-cards {
		grid-template-columns: repeat(2, 1fr); 
	}

	.filter-controls {
		flex-direction: row; 
		align-items: stretch; 
		gap: 10px;
	}

	.pdf-btn {
		width: 100%;
	}

	th, td {
		width: 1000px;
	}

	.table-container {
		height: fit-content;
	}
}

/* Histórico de Operações */
.trade-history-card {
	background: linear-gradient(145deg, #1e1e1e, #252525);
	border-radius: 15px;
	padding: 20px;
	margin-top: 20px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.history-header h3 {
	margin: 0;
	font-size: 1.3rem;
	color: #fff;
}

.btn-refresh {
	background: linear-gradient(135deg, #4A90E2, #357ABD);
	border: none;
	padding: 8px 15px;
	border-radius: 8px;
	color: #fff;
	cursor: pointer;
	font-size: 0.9rem;
	transition: all 0.3s ease;
}

.btn-refresh:hover {
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.history-table {
	overflow-x: auto;
}

.history-table table {
	width: 100%;
	border-collapse: collapse;
}

.history-table thead th {
	background: #2a2a2a;
	padding: 12px;
	text-align: left;
	font-size: 0.9rem;
	color: #999;
	border-bottom: 2px solid #333;
}

.history-table tbody tr {
	border-bottom: 1px solid #2a2a2a;
	transition: background 0.2s;
}

.history-table tbody tr:hover {
	background: #252525;
}

.history-table tbody td {
	padding: 12px;
	font-size: 0.95rem;
}

.signal-badge {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
}

.signal-badge.call {
	background: rgba(46, 204, 113, 0.2);
	color: #2ecc71;
}

.signal-badge.put {
	background: rgba(231, 76, 60, 0.2);
	color: #e74c3c;
}

.status-badge {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
}

.status-badge.won {
	background: rgba(46, 204, 113, 0.2);
	color: #2ecc71;
}

.status-badge.lost {
	background: rgba(231, 76, 60, 0.2);
	color: #e74c3c;
}

.profit-cell {
	font-weight: 700;
	font-size: 1rem;
}

.profit-cell.positive {
	color: #2ecc71;
}

.profit-cell.negative {
	color: #e74c3c;
}

.no-history {
	text-align: center;
	padding: 40px 20px;
	color: #999;
}

.no-history p {
	margin: 5px 0;
}

.no-history .hint {
	font-size: 0.9rem;
	color: #666;
}

/* Animações */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@media (max-width: 600px) {
	.layout {
		padding: 0 10px; 
	}

	.filter-controls {
		flex-direction: column; 
		align-items: stretch; 
		gap: 10px;
	}

	.date-filter, 
	.btn-search {
		width: 100%; 
	}
	
	.bottom-summary-cards {
		grid-template-columns: 1fr; 
	}
	
	.bottom-card .card-content {
		gap: 10px; 
	}
}

.background-glow {
	position: fixed;
	inset: 0;
	background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
		radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
		radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
		rgba(9, 10, 12, 0.95);
	z-index: -2;
	pointer-events: none;
}

.background-grid {
	position: fixed;
	inset: 0;
	background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
		linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
	background-size: 48px 48px;
	z-index: -1;
	opacity: 0.6;
	pointer-events: none;
	animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
	0% {
		background-position: 0 0, 0 0;
	}
	100% {
		background-position: -48px -48px, -48px -48px;
	}
}
</style>