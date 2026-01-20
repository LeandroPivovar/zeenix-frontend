<template>
	<div class="autonomous-agent-view">
		<div class="header">
			<h1>🤖 Agente Autônomo IA SENTINEL</h1>
			<p>Estratégia autônoma 24/7 operando no Volatility 75</p>
		</div>

		<!-- Status e Configuração -->
		<div class="config-section">
			<div class="status-card">
				<div class="status-header">
					<h3>Status do Agente</h3>
					<span :class="['status-badge', agentConfig?.isActive ? 'active' : 'inactive']">
						{{ agentConfig?.isActive ? '🟢 Ativo' : '🔴 Inativo' }}
					</span>
				</div>

				<div v-if="agentConfig" class="config-details">
					<div class="config-item">
						<label>Valor de Entrada:</label>
						<span>${{ agentConfig.initialStake?.toFixed(2) }}</span>
					</div>
					<div class="config-item">
						<label>Meta de Lucro Diário:</label>
						<span>${{ agentConfig.dailyProfitTarget?.toFixed(2) }}</span>
					</div>
					<div class="config-item">
						<label>Limite de Perda Diário:</label>
						<span>${{ agentConfig.dailyLossLimit?.toFixed(2) }}</span>
					</div>
					<div class="config-item">
						<label>Lucro Hoje:</label>
						<span :class="['profit-value', agentConfig.dailyProfit >= 0 ? 'positive' : 'negative']">
							${{ agentConfig.dailyProfit?.toFixed(2) }}
						</span>
					</div>
					<div class="config-item">
						<label>Perda Hoje:</label>
						<span class="loss-value">${{ agentConfig.dailyLoss?.toFixed(2) }}</span>
					</div>
					<div class="config-item">
						<label>Status da Sessão:</label>
						<span>{{ getSessionStatusLabel(agentConfig.sessionStatus) }}</span>
					</div>
				</div>
			</div>

			<!-- Formulário de Ativação -->
			<div v-if="!agentConfig?.isActive" class="activation-form">
				<h3>Ativar Agente Autônomo</h3>
				<div class="form-group">
					<label>Valor de Entrada (USD)</label>
					<input 
						type="number" 
						v-model.number="activationForm.initialStake" 
						min="10"
						step="0.01"
						placeholder="10.00"
					/>
				</div>
				<div class="form-group">
					<label>Meta de Lucro Diário (USD)</label>
					<input 
						type="number" 
						v-model.number="activationForm.dailyProfitTarget" 
						min="0"
						step="0.01"
						placeholder="200.00"
					/>
				</div>
				<div class="form-group">
					<label>Limite de Perda Diário (USD)</label>
					<input 
						type="number" 
						v-model.number="activationForm.dailyLossLimit" 
						min="0"
						step="0.01"
						placeholder="240.00"
					/>
				</div>
				<button 
					class="btn-activate" 
					@click="activateAgent"
					:disabled="isActivating"
				>
					{{ isActivating ? 'Ativando...' : '▶ Ativar Agente' }}
				</button>
			</div>

			<!-- Botão de Desativação -->
			<div v-else class="deactivation-section">
				<button 
					class="btn-deactivate" 
					@click="deactivateAgent"
					:disabled="isDeactivating"
				>
					{{ isDeactivating ? 'Desativando...' : '⏸ Desativar Agente' }}
				</button>
			</div>
		</div>

		<!-- Estatísticas da Sessão -->
		<div v-if="agentConfig?.isActive" class="stats-section">
			<h3>Estatísticas da Sessão</h3>
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-label">Total de Operações</div>
					<div class="stat-value">{{ sessionStats.totalTrades }}</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">Vitórias</div>
					<div class="stat-value positive">{{ sessionStats.wins }}</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">Derrotas</div>
					<div class="stat-value negative">{{ sessionStats.losses }}</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">Taxa de Acerto</div>
					<div class="stat-value">{{ sessionStats.winRate?.toFixed(1) }}%</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">Lucro Total</div>
					<div class="stat-value positive">${{ sessionStats.totalProfit?.toFixed(2) }}</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">Perda Total</div>
					<div class="stat-value negative">${{ sessionStats.totalLoss?.toFixed(2) }}</div>
				</div>
				<div class="stat-card">
					<div class="stat-label">Lucro Líquido</div>
					<div :class="['stat-value', sessionStats.netProfit >= 0 ? 'positive' : 'negative']">
						${{ sessionStats.netProfit?.toFixed(2) }}
					</div>
				</div>
			</div>
		</div>

		<!-- Histórico de Operações -->
		<div v-if="agentConfig?.isActive" class="history-section">
			<h3>Histórico de Operações</h3>
			<div class="trades-table">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Contrato</th>
							<th>Duração</th>
							<th>Entrada</th>
							<th>Saída</th>
							<th>Stake</th>
							<th>Resultado</th>
							<th>Confiança</th>
							<th>Martingale</th>
							<th>Data/Hora</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="trade in tradeHistory" :key="trade.id" :class="['trade-row', trade.status.toLowerCase()]">
							<td>{{ trade.id }}</td>
							<td>{{ trade.contractType }}</td>
							<td>{{ trade.duration }}t</td>
							<td>${{ trade.entryPrice?.toFixed(4) }}</td>
							<td>{{ trade.exitPrice ? '$' + trade.exitPrice.toFixed(4) : '--' }}</td>
							<td>${{ trade.stakeAmount?.toFixed(2) }}</td>
							<td :class="['result-cell', trade.status === 'WON' ? 'won' : trade.status === 'LOST' ? 'lost' : 'pending']">
								{{ trade.profitLoss !== null ? (trade.profitLoss >= 0 ? '+' : '') + '$' + trade.profitLoss.toFixed(2) : '--' }}
							</td>
							<td>{{ trade.confidenceScore?.toFixed(1) }}%</td>
							<td>{{ trade.martingaleLevel }}</td>
							<td>{{ formatDateTime(trade.createdAt) }}</td>
						</tr>
						<tr v-if="tradeHistory.length === 0">
							<td colspan="10" class="no-trades">Nenhuma operação ainda</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<DesktopBottomNav />
	</div>
</template>

<script>
import DesktopBottomNav from '../components/DesktopBottomNav.vue'

export default {
	name: 'AutonomousAgentView',
	components: {
		DesktopBottomNav
	},
	data() {
		return {
			agentConfig: null,
			sessionStats: {
				totalTrades: 0,
				wins: 0,
				losses: 0,
				winRate: 0,
				totalProfit: 0,
				totalLoss: 0,
				netProfit: 0,
			},
			tradeHistory: [],
			activationForm: {
				initialStake: 10.00,
				dailyProfitTarget: 200.00,
				dailyLossLimit: 240.00,
			},
			isActivating: false,
			isDeactivating: false,
			pollingInterval: null,
		};
	},
	mounted() {
		this.loadAgentConfig();
		this.startPolling();
	},
	beforeUnmount() {
		this.stopPolling();
	},
	methods: {
		async loadAgentConfig() {
			try {
				const userId = this.getUserId();
				if (!userId) return;

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
				const response = await fetch(`${apiBase}/autonomous-agent/config/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});

				const result = await response.json();
				if (result.success && result.data) {
					this.agentConfig = result.data;
				}
			} catch (error) {
				console.error('[AutonomousAgentView] Erro ao carregar configuração:', error);
			}
		},

		async loadSessionStats() {
			try {
				const userId = this.getUserId();
				if (!userId) return;

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
				const response = await fetch(`${apiBase}/autonomous-agent/session-stats/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});

				const result = await response.json();
				if (result.success && result.data) {
					this.sessionStats = result.data;
				}
			} catch (error) {
				console.error('[AutonomousAgentView] Erro ao carregar estatísticas:', error);
			}
		},

		async loadTradeHistory() {
			try {
				const userId = this.getUserId();
				if (!userId) return;

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
				const response = await fetch(`${apiBase}/autonomous-agent/trade-history/${userId}?limit=50`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});

				const result = await response.json();
				if (result.success && result.data) {
					this.tradeHistory = result.data;
				}
			} catch (error) {
				console.error('[AutonomousAgentView] Erro ao carregar histórico:', error);
			}
		},

		async activateAgent() {
			try {
				this.isActivating = true;

				const userId = this.getUserId();
				const connectionStr = localStorage.getItem('deriv_connection');
				if (!connectionStr) {
					alert('Erro: Conexão Deriv não encontrada');
					return;
				}

				const connection = JSON.parse(connectionStr);
				const derivToken = connection.token || connection.derivToken;

				if (!derivToken) {
					alert('Erro: Token Deriv não encontrado');
					return;
				}

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
				const response = await fetch(`${apiBase}/autonomous-agent/activate`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						userId,
						initialStake: this.activationForm.initialStake,
						dailyProfitTarget: this.activationForm.dailyProfitTarget,
						dailyLossLimit: this.activationForm.dailyLossLimit,
						derivToken,
						currency: connection.currency || 'USD',
					}),
				});

				const result = await response.json();
				if (result.success) {
					alert('✅ Agente autônomo ativado com sucesso!');
					await this.loadAgentConfig();
					await this.loadSessionStats();
					await this.loadTradeHistory();
				} else {
					alert(`Erro: ${result.message || 'Falha ao ativar agente'}`);
				}
			} catch (error) {
				console.error('[AutonomousAgentView] Erro ao ativar agente:', error);
				alert('Erro ao ativar agente autônomo');
			} finally {
				this.isActivating = false;
			}
		},

		async deactivateAgent() {
			try {
				if (!confirm('Tem certeza que deseja desativar o agente autônomo?')) {
					return;
				}

				this.isDeactivating = true;

				const userId = this.getUserId();
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
				const response = await fetch(`${apiBase}/autonomous-agent/deactivate`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({ userId }),
				});

				const result = await response.json();
				if (result.success) {
					alert('✅ Agente autônomo desativado com sucesso!');
					this.agentConfig = null;
					this.sessionStats = {
						totalTrades: 0,
						wins: 0,
						losses: 0,
						winRate: 0,
						totalProfit: 0,
						totalLoss: 0,
						netProfit: 0,
					};
					this.tradeHistory = [];
				} else {
					alert(`Erro: ${result.message || 'Falha ao desativar agente'}`);
				}
			} catch (error) {
				console.error('[AutonomousAgentView] Erro ao desativar agente:', error);
				alert('Erro ao desativar agente autônomo');
			} finally {
				this.isDeactivating = false;
			}
		},

		startPolling() {
			// Carregar dados imediatamente
			this.loadAgentConfig();
			this.loadSessionStats();
			this.loadTradeHistory();

			// Polling a cada 5 segundos se o agente estiver ativo
			this.pollingInterval = setInterval(() => {
				if (this.agentConfig?.isActive) {
					this.loadAgentConfig();
					this.loadSessionStats();
					this.loadTradeHistory();
				}
			}, 5000);
		},

		stopPolling() {
			if (this.pollingInterval) {
				clearInterval(this.pollingInterval);
				this.pollingInterval = null;
			}
		},

		getUserId() {
			const userStr = localStorage.getItem('user');
			if (userStr) {
				const user = JSON.parse(userStr);
				return user.id || user.userId;
			}
			return null;
		},

		getSessionStatusLabel(status) {
			const labels = {
				active: '🟢 Ativo',
				stopped_profit: '🎯 Stop Win',
				stopped_loss: '🛑 Stop Loss',
				paused: '⏸ Pausado',
			};
			return labels[status] || status;
		},

		formatDateTime(dateStr) {
			if (!dateStr) return '--';
			const date = new Date(dateStr);
			return date.toLocaleString('pt-BR');
		},
	},
};
</script>

<style scoped>
.autonomous-agent-view {
	padding: 2rem;
	max-width: 1400px;
	margin: 0 auto;
}

.header {
	margin-bottom: 2rem;
}

.header h1 {
	font-size: 2rem;
	margin-bottom: 0.5rem;
}

.config-section {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	margin-bottom: 2rem;
}

.status-card,
.activation-form,
.deactivation-section {
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 12px;
	padding: 1.5rem;
}

.status-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.status-badge {
	padding: 0.5rem 1rem;
	border-radius: 8px;
	font-weight: 600;
}

.status-badge.active {
	background: #22c55e;
	color: #000;
}

.status-badge.inactive {
	background: #ef4444;
	color: #fff;
}

.config-details {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.config-item {
	display: flex;
	justify-content: space-between;
	padding: 0.75rem;
	background: #0f0f0f;
	border-radius: 8px;
}

.config-item label {
	font-weight: 500;
}

.profit-value.positive {
	color: #22c55e;
}

.profit-value.negative {
	color: #ef4444;
}

.form-group {
	margin-bottom: 1rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
}

.form-group input {
	width: 100%;
	padding: 0.75rem;
	background: #0f0f0f;
	border: 1px solid #2a2a2a;
	border-radius: 8px;
	color: #fff;
}

.btn-activate,
.btn-deactivate {
	width: 100%;
	padding: 1rem;
	background: #22c55e;
	color: #000;
	border: none;
	border-radius: 8px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;
}

.btn-activate:hover {
	background: #16a34a;
}

.btn-deactivate {
	background: #ef4444;
	color: #fff;
}

.btn-deactivate:hover {
	background: #dc2626;
}

.stats-section,
.history-section {
	margin-bottom: 2rem;
}

.stats-section h3,
.history-section h3 {
	margin-bottom: 1rem;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
}

.stat-card {
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 12px;
	padding: 1.5rem;
	text-align: center;
}

.stat-label {
	font-size: 0.875rem;
	color: #888;
	margin-bottom: 0.5rem;
}

.stat-value {
	font-size: 1.5rem;
	font-weight: 600;
}

.stat-value.positive {
	color: #22c55e;
}

.stat-value.negative {
	color: #ef4444;
}

.trades-table {
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 12px;
	overflow: hidden;
}

.trades-table table {
	width: 100%;
	border-collapse: collapse;
}

.trades-table th {
	background: #0f0f0f;
	padding: 1rem;
	text-align: left;
	font-weight: 600;
	border-bottom: 1px solid #2a2a2a;
}

.trades-table td {
	padding: 0.75rem 1rem;
	border-bottom: 1px solid #2a2a2a;
}

.trade-row.won {
	background: rgba(34, 197, 94, 0.1);
}

.trade-row.lost {
	background: rgba(239, 68, 68, 0.1);
}

.result-cell.won {
	color: #22c55e;
	font-weight: 600;
}

.result-cell.lost {
	color: #ef4444;
	font-weight: 600;
}

.no-trades {
	text-align: center;
	padding: 2rem;
	color: #888;
}
</style>

