<template>
	<div class="autonomous-agent-logs-view">
		<div class="header">
			<h1>📋 Logs do Agente Autônomo</h1>
			<p>Visualização em tempo real dos logs do sistema</p>
		</div>

		<!-- Abas -->
		<div class="tabs-section">
			<button 
				:class="['tab-button', { active: activeTab === 'database' }]"
				@click="switchTab('database')"
			>
				<i class="fas fa-database"></i>
				Logs do Banco de Dados
			</button>
			<button 
				:class="['tab-button', { active: activeTab === 'console' }]"
				@click="switchTab('console')"
			>
				<i class="fas fa-terminal"></i>
				Logs do Console (Tempo Real)
				<span v-if="consoleLogsConnected" class="connection-indicator connected"></span>
				<span v-else class="connection-indicator disconnected"></span>
			</button>
		</div>

		<!-- Controles -->
		<div class="controls-section">
			<div class="controls-left">
				<button 
					v-if="activeTab === 'database'"
					class="btn-refresh" 
					@click="loadLogs"
					:disabled="isLoading"
				>
					<i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
					Atualizar
				</button>
				<button 
					v-if="activeTab === 'console'"
					class="btn-refresh" 
					@click="toggleConsoleStream"
					:disabled="isConnecting"
				>
					<i class="fas" :class="consoleLogsConnected ? 'fa-stop' : 'fa-play'"></i>
					{{ consoleLogsConnected ? 'Parar Stream' : 'Iniciar Stream' }}
				</button>
				<button 
					class="btn-clear" 
					@click="clearLogs"
					:disabled="currentLogs.length === 0"
				>
					<i class="fas fa-trash"></i>
					Limpar Visualização
				</button>
				<label v-if="activeTab === 'database'" class="auto-refresh-toggle">
					<input 
						type="checkbox" 
						v-model="autoRefresh"
						@change="toggleAutoRefresh"
					/>
					<span>Atualização Automática (5s)</span>
				</label>
			</div>
			<div class="controls-right">
			<div class="filter-group">
				<label>Filtrar por Nível:</label>
				<select v-model="levelFilter" @change="applyFilters">
					<option value="all">Todos</option>
					<option v-if="activeTab === 'database'" value="INFO">INFO</option>
					<option v-if="activeTab === 'database'" value="DEBUG">DEBUG</option>
					<option v-if="activeTab === 'database'" value="WARN">WARN</option>
					<option v-if="activeTab === 'database'" value="ERROR">ERROR</option>
					<option v-if="activeTab === 'console'" value="log">LOG</option>
					<option v-if="activeTab === 'console'" value="debug">DEBUG</option>
					<option v-if="activeTab === 'console'" value="warn">WARN</option>
					<option v-if="activeTab === 'console'" value="error">ERROR</option>
				</select>
			</div>
				<div class="filter-group">
					<label>Filtrar por Módulo:</label>
					<select v-model="moduleFilter" @change="applyFilters">
						<option value="all">Todos</option>
						<option value="CORE">CORE</option>
						<option value="API">API</option>
						<option value="ANALYZER">ANALYZER</option>
						<option value="DECISION">DECISION</option>
						<option value="TRADER">TRADER</option>
						<option value="RISK">RISK</option>
						<option value="HUMANIZER">HUMANIZER</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Estatísticas Rápidas -->
		<div class="stats-section">
			<div class="stat-item">
				<span class="stat-label">Total de Logs:</span>
				<span class="stat-value">{{ filteredLogs.length }}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">{{ activeTab === 'database' ? 'INFO' : 'LOG' }}:</span>
				<span class="stat-value info">{{ getLogCountByLevel(activeTab === 'database' ? 'INFO' : 'log') }}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">DEBUG:</span>
				<span class="stat-value debug">{{ getLogCountByLevel('DEBUG') }}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">WARN:</span>
				<span class="stat-value warn">{{ getLogCountByLevel('WARN') }}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">ERROR:</span>
				<span class="stat-value error">{{ getLogCountByLevel('ERROR') }}</span>
			</div>
		</div>

		<!-- Container de Logs -->
		<div class="logs-container" ref="logsContainer">
			<div 
				v-if="activeTab === 'database' && isLoading && logs.length === 0" 
				class="loading-state"
			>
				<i class="fas fa-spinner fa-spin"></i>
				<p>Carregando logs...</p>
			</div>
			
			<div 
				v-else-if="activeTab === 'console' && !consoleLogsConnected && consoleLogs.length === 0" 
				class="empty-state"
			>
				<i class="fas fa-terminal"></i>
				<p>Clique em "Iniciar Stream" para ver os logs do console em tempo real</p>
			</div>
			
			<div 
				v-else-if="filteredLogs.length === 0" 
				class="empty-state"
			>
				<i class="fas fa-inbox"></i>
				<p>Nenhum log encontrado</p>
			</div>

			<div 
				v-else 
				class="logs-list"
			>
				<!-- Logs do Banco de Dados -->
				<template v-if="activeTab === 'database'">
					<div 
						v-for="log in filteredLogs" 
						:key="log.id"
						:class="['log-item', `log-${log.type}`]"
					>
						<div class="log-header">
							<span class="log-icon">{{ log.icon }}</span>
							<span class="log-timestamp">{{ log.timestamp }}</span>
							<span :class="['log-level', `level-${log.level}`]">[{{ log.level }}]</span>
							<span :class="['log-module', `module-${log.module}`]">[{{ log.module }}]</span>
						</div>
						<div class="log-message">{{ log.message }}</div>
						<div v-if="log.details" class="log-details">
							<pre>{{ JSON.stringify(log.details, null, 2) }}</pre>
						</div>
					</div>
				</template>

				<!-- Logs do Console -->
				<template v-if="activeTab === 'console'">
					<div 
						v-for="log in filteredLogs" 
						:key="log.id"
						:class="['log-item', `log-${log.level}`]"
					>
						<div class="log-header">
							<span class="log-icon">{{ getConsoleLogIcon(log.level) }}</span>
							<span class="log-timestamp">{{ formatConsoleTimestamp(log.timestamp) }}</span>
							<span :class="['log-level', `level-${log.level.toUpperCase()}`]">[{{ log.level.toUpperCase() }}]</span>
							<span class="log-module">[{{ log.context }}]</span>
						</div>
						<div class="log-message">{{ log.message }}</div>
						<div v-if="log.data && log.data.length > 0" class="log-details">
							<pre>{{ JSON.stringify(log.data, null, 2) }}</pre>
						</div>
					</div>
				</template>
			</div>
		</div>
		<DesktopBottomNav />
	</div>
</template>

<script>
import DesktopBottomNav from '../components/DesktopBottomNav.vue'

export default {
	name: 'AutonomousAgentLogsView',
	components: {
		DesktopBottomNav
	},
	data() {
		return {
			activeTab: 'database', // 'database' ou 'console'
			logs: [], // Logs do banco de dados
			consoleLogs: [], // Logs do console
			filteredLogs: [],
			isLoading: false,
			isConnecting: false,
			autoRefresh: true,
			autoRefreshInterval: null,
			levelFilter: 'all',
			moduleFilter: 'all',
			consoleLogsConnected: false,
			eventSource: null,
		};
	},
	computed: {
		currentLogs() {
			return this.activeTab === 'database' ? this.logs : this.consoleLogs;
		},
	},
	mounted() {
		if (this.activeTab === 'database') {
			this.loadLogs();
			if (this.autoRefresh) {
				this.startAutoRefresh();
			}
		}
	},
	beforeUnmount() {
		this.stopAutoRefresh();
		this.disconnectConsoleStream();
	},
	methods: {
		async loadLogs() {
			try {
				this.isLoading = true;
				const userId = this.getUserId();
				if (!userId) {
					console.error('[AutonomousAgentLogsView] User ID não encontrado');
					return;
				}

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/autonomous-agent/logs/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});

				const result = await response.json();
				if (result.success && result.data) {
					// Os logs já vêm ordenados do mais recente para o mais antigo do backend
					// Mas para exibição, vamos inverter para mostrar os mais antigos primeiro (como um console)
					this.logs = result.data.reverse();
					this.applyFilters();
					this.scrollToBottom();
				} else {
					console.error('[AutonomousAgentLogsView] Erro ao carregar logs:', result.message);
				}
			} catch (error) {
				console.error('[AutonomousAgentLogsView] Erro ao carregar logs:', error);
			} finally {
				this.isLoading = false;
			}
		},

		switchTab(tab) {
			this.activeTab = tab;
			if (tab === 'database') {
				this.loadLogs();
				if (this.autoRefresh) {
					this.startAutoRefresh();
				}
			} else if (tab === 'console') {
				this.stopAutoRefresh();
				// Não iniciar stream automaticamente, usuário deve clicar
			}
			this.applyFilters();
		},

		applyFilters() {
			const sourceLogs = this.activeTab === 'database' ? this.logs : this.consoleLogs;
			this.filteredLogs = sourceLogs.filter(log => {
				if (this.activeTab === 'database') {
					const levelMatch = this.levelFilter === 'all' || log.level === this.levelFilter;
					const moduleMatch = this.moduleFilter === 'all' || log.module === this.moduleFilter;
					return levelMatch && moduleMatch;
				} else {
					// Console logs
					const levelMatch = this.levelFilter === 'all' || log.level === this.levelFilter;
					const contextMatch = this.moduleFilter === 'all' || log.context === this.moduleFilter;
					return levelMatch && contextMatch;
				}
			});
		},

		getLogCountByLevel(level) {
			const sourceLogs = this.activeTab === 'database' ? this.logs : this.consoleLogs;
			return sourceLogs.filter(log => {
				if (this.activeTab === 'database') {
					return log.level === level;
				} else {
					return log.level === level.toLowerCase();
				}
			}).length;
		},

		clearLogs() {
			if (confirm('Deseja limpar a visualização dos logs? (Isso não apaga os logs do servidor)')) {
				if (this.activeTab === 'database') {
					this.logs = [];
				} else {
					this.consoleLogs = [];
				}
				this.filteredLogs = [];
			}
		},

		toggleAutoRefresh() {
			if (this.autoRefresh) {
				this.startAutoRefresh();
			} else {
				this.stopAutoRefresh();
			}
		},

		startAutoRefresh() {
			this.stopAutoRefresh(); // Garantir que não há múltiplos intervalos
			this.autoRefreshInterval = setInterval(() => {
				this.loadLogs();
			}, 5000); // Atualizar a cada 5 segundos
		},

		stopAutoRefresh() {
			if (this.autoRefreshInterval) {
				clearInterval(this.autoRefreshInterval);
				this.autoRefreshInterval = null;
			}
		},

		scrollToBottom() {
			this.$nextTick(() => {
				const container = this.$refs.logsContainer;
				if (container) {
					// Scroll suave para o final
					container.scrollTo({
						top: container.scrollHeight,
						behavior: 'smooth'
					});
				}
			});
		},

		async toggleConsoleStream() {
			if (this.consoleLogsConnected) {
				this.disconnectConsoleStream();
			} else {
				await this.connectConsoleStream();
			}
		},

		async connectConsoleStream() {
			try {
				this.isConnecting = true;
				const userId = this.getUserId();
				if (!userId) {
					console.error('[AutonomousAgentLogsView] User ID não encontrado');
					return;
				}

				// Carregar logs históricos primeiro
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/autonomous-agent/console-logs/${userId}?limit=500`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});

				const result = await response.json();
				if (result.success && result.data) {
					this.consoleLogs = result.data.reverse();
					this.applyFilters();
				}

				// Conectar ao SSE
				const token = localStorage.getItem('token');
				const eventSource = new EventSource(`${apiBase}/autonomous-agent/logs-stream/${userId}?token=${token}`);
				
				eventSource.onmessage = (event) => {
					try {
						const log = JSON.parse(event.data);
						this.consoleLogs.push(log);
						
						// Limitar tamanho do array
						if (this.consoleLogs.length > 2000) {
							this.consoleLogs.shift();
						}
						
						this.applyFilters();
						this.scrollToBottom();
					} catch (error) {
						console.error('[AutonomousAgentLogsView] Erro ao processar log:', error);
					}
				};

				eventSource.onerror = (error) => {
					console.error('[AutonomousAgentLogsView] Erro no EventSource:', error);
					this.disconnectConsoleStream();
				};

				this.eventSource = eventSource;
				this.consoleLogsConnected = true;
			} catch (error) {
				console.error('[AutonomousAgentLogsView] Erro ao conectar stream:', error);
			} finally {
				this.isConnecting = false;
			}
		},

		disconnectConsoleStream() {
			if (this.eventSource) {
				this.eventSource.close();
				this.eventSource = null;
			}
			this.consoleLogsConnected = false;
		},

		getConsoleLogIcon(level) {
			const icons = {
				log: 'ℹ️',
				debug: '🔍',
				warn: '⚠️',
				error: '🚫',
			};
			return icons[level] || 'ℹ️';
		},

		formatConsoleTimestamp(timestamp) {
			if (!timestamp) return '--';
			try {
				const date = new Date(timestamp);
				if (isNaN(date.getTime())) return '--';
				return date.toLocaleTimeString('pt-BR', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false,
				});
			} catch (error) {
				return '--';
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
	},
};
</script>

<style scoped>
.autonomous-agent-logs-view {
	padding: 2rem;
	max-width: 1600px;
	margin: 0 auto;
	min-height: 100vh;
	background: #0a0a0a;
	color: #e0e0e0;
}

.header {
	margin-bottom: 2rem;
}

.header h1 {
	font-size: 2rem;
	margin-bottom: 0.5rem;
	color: #fff;
}

.header p {
	color: #999;
	font-size: 0.9rem;
}

.controls-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 12px;
}

.controls-left {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.controls-right {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.btn-refresh,
.btn-clear {
	padding: 0.5rem 1rem;
	background: #22c55e;
	color: #000;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.2s;
}

.btn-refresh:hover:not(:disabled) {
	background: #16a34a;
	transform: scale(1.05);
}

.btn-refresh:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-clear {
	background: #ef4444;
	color: #fff;
}

.btn-clear:hover:not(:disabled) {
	background: #dc2626;
}

.auto-refresh-toggle {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
	user-select: none;
}

.auto-refresh-toggle input[type="checkbox"] {
	cursor: pointer;
}

.filter-group {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.filter-group label {
	font-size: 0.9rem;
	color: #999;
}

.filter-group select {
	padding: 0.5rem;
	background: #0f0f0f;
	border: 1px solid #2a2a2a;
	border-radius: 6px;
	color: #e0e0e0;
	cursor: pointer;
}

.stats-section {
	display: flex;
	gap: 1.5rem;
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 12px;
	flex-wrap: wrap;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.stat-label {
	color: #999;
	font-size: 0.9rem;
}

.stat-value {
	font-weight: 600;
	font-size: 1rem;
}

.stat-value.info {
	color: #3b82f6;
}

.stat-value.debug {
	color: #8b5cf6;
}

.stat-value.warn {
	color: #f59e0b;
}

.stat-value.error {
	color: #ef4444;
}

.logs-container {
	background: #0f0f0f;
	border: 1px solid #2a2a2a;
	border-radius: 12px;
	padding: 1rem;
	max-height: calc(100vh - 400px);
	overflow-y: auto;
	font-family: 'Courier New', monospace;
	font-size: 0.85rem;
	line-height: 1.6;
}

.logs-container::-webkit-scrollbar {
	width: 8px;
}

.logs-container::-webkit-scrollbar-track {
	background: #1a1a1a;
}

.logs-container::-webkit-scrollbar-thumb {
	background: #3a3a3a;
	border-radius: 4px;
}

.logs-container::-webkit-scrollbar-thumb:hover {
	background: #4a4a4a;
}

.loading-state,
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	color: #666;
}

.loading-state i,
.empty-state i {
	font-size: 3rem;
	margin-bottom: 1rem;
	opacity: 0.5;
}

.logs-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.log-item {
	padding: 0.75rem;
	border-radius: 6px;
	border-left: 3px solid transparent;
	background: #151515;
	transition: all 0.2s;
}

.log-item:hover {
	background: #1a1a1a;
}

.log-item.log-info {
	border-left-color: #3b82f6;
}

.log-item.log-analise {
	border-left-color: #8b5cf6;
}

.log-item.log-alerta {
	border-left-color: #f59e0b;
}

.log-item.log-erro {
	border-left-color: #ef4444;
	background: #1a0f0f;
}

.log-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 0.5rem;
	flex-wrap: wrap;
}

.log-icon {
	font-size: 1rem;
}

.log-timestamp {
	color: #666;
	font-size: 0.8rem;
	min-width: 80px;
}

.log-level {
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 600;
}

.level-INFO {
	background: #3b82f6;
	color: #fff;
}

.level-DEBUG {
	background: #8b5cf6;
	color: #fff;
}

.level-WARN {
	background: #f59e0b;
	color: #000;
}

.level-ERROR {
	background: #ef4444;
	color: #fff;
}

.log-module {
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 600;
	background: #2a2a2a;
	color: #999;
}

.log-message {
	color: #e0e0e0;
	word-break: break-word;
}

.log-details {
	margin-top: 0.5rem;
	padding: 0.5rem;
	background: #0a0a0a;
	border-radius: 4px;
	border: 1px solid #2a2a2a;
}

.log-details pre {
	margin: 0;
	color: #8b5cf6;
	font-size: 0.8rem;
	overflow-x: auto;
}

.tabs-section {
	display: flex;
	gap: 1rem;
	margin-bottom: 1.5rem;
	border-bottom: 2px solid #2a2a2a;
}

.tab-button {
	padding: 0.75rem 1.5rem;
	background: transparent;
	border: none;
	border-bottom: 3px solid transparent;
	color: #999;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	transition: all 0.2s;
	position: relative;
}

.tab-button:hover {
	color: #e0e0e0;
}

.tab-button.active {
	color: #22c55e;
	border-bottom-color: #22c55e;
}

.connection-indicator {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
	margin-left: 0.5rem;
}

.connection-indicator.connected {
	background: #22c55e;
	box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.connection-indicator.disconnected {
	background: #ef4444;
}

.log-item.log-log {
	border-left-color: #3b82f6;
}

.log-item.log-debug {
	border-left-color: #8b5cf6;
}

.log-item.log-warn {
	border-left-color: #f59e0b;
}

.log-item.log-error {
	border-left-color: #ef4444;
	background: #1a0f0f;
}

.level-LOG {
	background: #3b82f6;
	color: #fff;
}

@media (max-width: 768px) {
	.autonomous-agent-logs-view {
		padding: 1rem;
	}

	.tabs-section {
		flex-direction: column;
	}

	.controls-section {
		flex-direction: column;
		align-items: stretch;
	}

	.controls-left,
	.controls-right {
		flex-direction: column;
		width: 100%;
	}

	.stats-section {
		flex-direction: column;
		gap: 0.5rem;
	}

	.log-header {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>

