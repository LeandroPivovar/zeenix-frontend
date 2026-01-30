<template>
	<div class="dashboard-layout">
		<div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="closeSidebar"></div>

		<AppSidebar 
			:is-open="isSidebarOpen" 
			:is-collapsed="isSidebarCollapsed" 
			:is-mobile="isMobile"
			@close-sidebar="closeSidebar" 
			@toggle-collapse="toggleSidebarCollapse" 
			@open-settings="showSettingsModal = true"
		/>

		<div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<TopNavbar 
				:is-sidebar-collapsed="isSidebarCollapsed"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
				@toggle-sidebar-collapse="toggleSidebarCollapse"
				@open-settings="showSettingsModal = true"
			/>

			<main class="layout-content">
				<!-- Header -->
				<div class="main-header mb-6">
					<div class="flex justify-between items-center">
						<div>
							<h1 style="font-size: 20px; font-weight: bold; color: white;">Monitoramento de IA</h1>
							<p style="font-size: 14px; color: #7D7D7D;">Acompanhe a execução da IA em tempo real</p>
						</div>
						<button @click="stopIA" :disabled="isStopping" class="stop-btn">
							<i class="fas fa-stop mr-2"></i>
							{{ isStopping ? 'Parando...' : 'Parar IA' }}
						</button>
					</div>
				</div>

				<!-- Stats Cards -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-4">
					<!-- Balance Card -->
					<div class="stats-card">
						<div class="stats-icon-wrapper blue">
							<i class="fas fa-wallet"></i>
						</div>
						<div class="stats-info">
							<span class="stats-label">Saldo Atual</span>
							<span class="stats-value">$ {{ stats.balance.toFixed(2) }}</span>
						</div>
					</div>

					<!-- Session P/L Card -->
					<div class="stats-card">
						<div class="stats-icon-wrapper" :class="stats.profit >= 0 ? 'green' : 'red'">
							<i class="fas fa-chart-line"></i>
						</div>
						<div class="stats-info">
							<span class="stats-label">Sessão P/L</span>
							<span class="stats-value" :class="stats.profit >= 0 ? 'text-zenix-green glow-green-text' : 'text-red-500'">
								{{ stats.profit >= 0 ? '+' : '' }}$ {{ stats.profit.toFixed(2) }}
							</span>
						</div>
					</div>

					<!-- Win/Loss Card -->
					<div class="stats-card">
						<div class="stats-icon-wrapper yellow">
							<i class="fas fa-percentage"></i>
						</div>
						<div class="stats-info">
							<span class="stats-label">Assertividade</span>
							<span class="stats-value text-zenix-green">
								{{ stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(0) : 0 }}%
							</span>
							<span class="text-[10px] text-[#7A7A7A] ml-1">{{ stats.wins }}W / {{ stats.losses }}L</span>
						</div>
					</div>

					<!-- AI Status Card -->
					<div class="stats-card">
						<div class="stats-icon-wrapper green pulse">
							<i class="fas fa-robot"></i>
						</div>
						<div class="stats-info">
							<span class="stats-label">Status da IA</span>
							<span class="stats-value text-sm text-zenix-green">{{ stats.status }}</span>
							<p class="text-[10px] text-zenix-green/80">{{ stats.statusDesc }}</p>
						</div>
					</div>
				</div>

				<!-- Tabs Section -->
				<div class="px-4">
					<div class="monitoring-tabs-container mb-4">
						<div class="monitoring-tabs flex gap-4 border-b border-[#333]">
							<button @click="activeTab = 'logs'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeTab === 'logs' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
								<i class="fas fa-list-ul mr-2"></i> Logs
							</button>
							<button @click="activeTab = 'history'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeTab === 'history' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
								<i class="fas fa-history mr-2"></i> Histórico
							</button>
							<button @click="activeTab = 'config'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeTab === 'config' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
								<i class="fas fa-cog mr-2"></i> Configuração
							</button>
						</div>
					</div>

					<!-- Tab Content -->
					<div class="tab-content-container bg-[#141414] border border-[#333] rounded-xl p-6 min-h-[500px]">
						<!-- Logs Tab -->
						<div v-if="activeTab === 'logs'" class="logs-tab-content h-full">
							<div class="logs-list-wrapper space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
								<div v-for="log in logs" :key="log.id" class="p-3 bg-[#0B0B0B] rounded-lg border border-[#222] font-mono text-xs flex gap-3">
									<span class="text-gray-500">[{{ log.time }}]</span>
									<span :class="{ 'text-zenix-green': log.type === 'success', 'text-red-500': log.type === 'error', 'text-blue-400': log.type === 'info', 'text-yellow-400': log.type === 'warning' }">
										{{ log.message }}
									</span>
								</div>
								<div v-if="logs.length === 0" class="text-center py-12 text-[#7A7A7A]">
									<i class="fas fa-inbox text-4xl mb-4 block opacity-20"></i>
									Nenhum log registrado ainda.
								</div>
							</div>
						</div>

						<!-- History Tab -->
						<div v-if="activeTab === 'history'" class="history-tab-content">
							<div class="overflow-x-auto">
								<table class="w-full text-left">
									<thead class="border-b border-[#333] text-xs text-[#7A7A7A] uppercase tracking-wider">
										<tr>
											<th class="pb-4">Hora</th>
											<th class="pb-4">Mercado</th>
											<th class="pb-4">Contrato</th>
											<th class="pb-4">Stake</th>
											<th class="pb-4">Resultado</th>
											<th class="pb-4 text-right">P/L</th>
										</tr>
									</thead>
									<tbody class="text-sm">
										<tr v-for="op in operations" :key="op.id" class="border-b border-[#222] last:border-0 hover:bg-[#1A1A1A] transition-colors">
											<td class="py-4">{{ op.time }}</td>
											<td class="py-4">{{ op.market }}</td>
											<td class="py-4 text-xs">{{ op.contract }}</td>
											<td class="py-4">$ {{ op.stake.toFixed(2) }}</td>
											<td class="py-4">
												<span :class="op.result === 'WIN' ? 'bg-zenix-green/10 text-zenix-green border-zenix-green/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="px-2 py-1 rounded border text-[10px] font-bold">
													{{ op.result }}
												</span>
											</td>
											<td class="py-4 text-right font-bold" :class="op.result === 'WIN' ? 'text-zenix-green' : 'text-red-500'">
												{{ op.result === 'WIN' ? '+' : '' }}$ {{ op.pnl.toFixed(2) }}
											</td>
										</tr>
										<tr v-if="operations.length === 0">
											<td colspan="6" class="text-center py-12 text-[#7A7A7A]">
												<i class="fas fa-history text-4xl mb-4 block opacity-20"></i>
												Nenhuma operação executada nesta sessão.
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<!-- Config Tab -->
						<div v-if="activeTab === 'config'" class="config-tab-content">
							<div class="space-y-6">
								<div class="config-item">
									<label class="text-sm text-gray-400 block mb-2">Estratégia Ativa</label>
									<div class="bg-[#0B0B0B] border border-[#333] rounded-lg p-4">
										<p class="text-white font-bold text-lg">{{ currentConfig.strategy }}</p>
									</div>
								</div>
								<div class="config-item">
									<label class="text-sm text-gray-400 block mb-2">Stake Configurado</label>
									<div class="bg-[#0B0B0B] border border-[#333] rounded-lg p-4">
										<p class="text-white font-bold text-lg">$ {{ currentConfig.stake.toFixed(2) }}</p>
									</div>
								</div>
								<div class="config-item">
									<label class="text-sm text-gray-400 block mb-2">Modo</label>
									<div class="bg-[#0B0B0B] border border-[#333] rounded-lg p-4">
										<p class="text-white font-bold text-lg">{{ currentConfig.mode === 'veloz' ? '⚡ Veloz' : '🎯 Moderado' }}</p>
									</div>
								</div>
								<div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
									<p class="text-sm text-blue-400">
										<i class="fas fa-info-circle mr-2"></i>
										Para alterar as configurações, pare a IA e inicie uma nova sessão.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>

		<!-- Settings Modal -->
		<SettingsSidebar
			:is-open="showSettingsModal"
			@close="showSettingsModal = false"
		/>
	</div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';

export default {
	name: 'AIMonitoringView',
	components: {
		AppSidebar,
		TopNavbar,
		SettingsSidebar,
	},
	data() {
		return {
			isSidebarOpen: false,
			isSidebarCollapsed: false,
			isMobile: false,
			showSettingsModal: false,
			isStopping: false,
			activeTab: 'logs',

			stats: {
				balance: 1000.00,
				profit: 0.00,
				wins: 0,
				losses: 0,
				status: 'Online',
				statusDesc: 'Analisando mercado'
			},

			logs: [],
			operations: [],

			currentConfig: {
				strategy: 'Apollo',
				stake: 0.35,
				mode: 'veloz'
			},

			eventSource: null
		}
	},
	mounted() {
		this.checkMobile();
		window.addEventListener('resize', this.checkMobile);
		this.connectToLogs();
		this.loadInitialData();
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.checkMobile);
		if (this.eventSource) {
			this.eventSource.close();
		}
	},
	methods: {
		checkMobile() {
			this.isMobile = window.innerWidth < 768;
			if (!this.isMobile) this.isSidebarOpen = false;
		},
		closeSidebar() {
			this.isSidebarOpen = false;
		},
		toggleSidebarCollapse() {
			this.isSidebarCollapsed = !this.isSidebarCollapsed;
		},
		async loadInitialData() {
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				// Load current stats
				const statsRes = await fetch(`${apiBaseUrl}/ai/stats`, {
					headers: { 'Authorization': `Bearer ${token}` }
				});
				if (statsRes.ok) {
					const data = await statsRes.json();
					this.stats = { ...this.stats, ...data };
				}

				// Load operations history
				const historyRes = await fetch(`${apiBaseUrl}/ai/history`, {
					headers: { 'Authorization': `Bearer ${token}` }
				});
				if (historyRes.ok) {
					const data = await historyRes.json();
					this.operations = data;
				}

				// Load current config
				const configRes = await fetch(`${apiBaseUrl}/ai/config`, {
					headers: { 'Authorization': `Bearer ${token}` }
				});
				if (configRes.ok) {
					const data = await configRes.json();
					this.currentConfig = data;
				}
			} catch (error) {
				console.error('Erro ao carregar dados:', error);
			}
		},
		connectToLogs() {
			const token = localStorage.getItem('token');
			const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
			
			// Use EventSource for SSE or WebSocket
			// For now, using SSE as an example
			this.eventSource = new EventSource(`${apiBaseUrl}/ai/logs/stream?token=${token}`);
			
			this.eventSource.onmessage = (event) => {
				try {
					const log = JSON.parse(event.data);
					this.logs.unshift({
						id: Date.now() + Math.random(),
						time: new Date().toLocaleTimeString(),
						type: log.type || 'info',
						message: log.message
					});
					
					// Keep only last 100 logs
					if (this.logs.length > 100) {
						this.logs = this.logs.slice(0, 100);
					}
				} catch (e) {
					console.error('Error parsing log:', e);
				}
			};

			this.eventSource.onerror = (error) => {
				console.error('SSE connection error:', error);
			};
		},
		async stopIA() {
			this.isStopping = true;
			
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				const response = await fetch(`${apiBaseUrl}/ai/stop`, {
					method: 'POST',
					headers: { 'Authorization': `Bearer ${token}` }
				});

				if (response.ok) {
					this.$router.push('/StatsIAs');
				} else {
					alert('Erro ao parar IA');
				}
			} catch (error) {
				console.error('Erro ao parar IA:', error);
				alert('Erro ao conectar com o servidor');
			} finally {
				this.isStopping = false;
			}
		}
	}
}
</script>

<style scoped>
.dashboard-layout {
	display: flex;
	min-height: 100vh;
	background: #0a0a0a;
}

.sidebar-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 40;
}

.dashboard-content-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.layout-content {
	flex: 1;
	padding: 24px;
	overflow-y: auto;
}

.stop-btn {
	background-color: #ef4444;
	color: white;
	padding: 12px 24px;
	border-radius: 12px;
	font-weight: bold;
	font-size: 14px;
	transition: all 0.2s;
	border: none;
	cursor: pointer;
}
.stop-btn:hover {
	background-color: #dc2626;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}
.stop-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.stats-card {
	background: rgba(20, 20, 20, 0.6);
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-radius: 20px;
	padding: 1.25rem;
	display: flex;
	align-items: center;
	gap: 16px;
	transition: all 0.4s;
}
.stats-card:hover {
	background: rgba(26, 26, 26, 0.8);
	border-color: rgba(34, 197, 94, 0.3);
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.stats-icon-wrapper {
	width: 52px;
	height: 52px;
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22px;
}
.stats-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
.stats-icon-wrapper.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
.stats-icon-wrapper.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
.stats-icon-wrapper.yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2); }

.stats-info {
	flex: 1;
}

.stats-label {
	display: block;
	font-size: 11px;
	color: #7A7A7A;
	text-transform: uppercase;
	font-weight: 600;
	letter-spacing: 0.5px;
}

.stats-value {
	display: block;
	font-size: 20px;
	font-weight: bold;
	color: white;
	margin-top: 4px;
}

.glow-green-text {
	text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.text-zenix-green {
	color: #22C55E;
}

.pulse {
	animation: pulse 2s infinite;
}

@keyframes pulse {
	0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
	70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
	100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #0F0F0F; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
</style>
