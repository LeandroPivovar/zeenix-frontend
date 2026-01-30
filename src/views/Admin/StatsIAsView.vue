<template>
	<div class="dashboard-layout">
		<div
			v-if="isSidebarOpen && isMobile"
			class="sidebar-overlay"
			@click="closeSidebar"
		></div>

		<AppSidebar 
			:is-open="isSidebarOpen" 
			:is-collapsed="isSidebarCollapsed" 
			:is-mobile="isMobile"
			@close-sidebar="closeSidebar" 
			@toggle-collapse="toggleSidebarCollapse" 
			@open-settings="showSettingsModal = true"
		/>

		<div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<!-- Top Navbar -->
			<TopNavbar 
				:is-sidebar-collapsed="isSidebarCollapsed"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
				@toggle-sidebar-collapse="toggleSidebarCollapse"
				@open-settings="showSettingsModal = true"
			/>

		<main class="layout-content">
			<div class="main-header">
				<div class="main-header-left">
					<h1 style="font-size: 20px;">Configuração da IA</h1>
					<p style="font-size: 14px;">Configure sua estratégia de IA automatizada para operar no mercado.</p>
				</div>
			</div>

			<div class="main-content px-4 py-6">
				<!-- Configuration Form -->
				<div class="config-form-wrapper max-w-4xl mx-auto">
					<form @submit.prevent="startIA" class="space-y-6">
						<!-- Strategy Selection -->
						<div class="form-group">
							<label class="block text-white font-bold mb-2 flex items-center gap-2">
								<i class="fa-solid fa-brain text-zenix-green"></i>
								Selecionar Estratégia
							</label>
							<div class="relative">
								<select 
									v-model="config.strategy" 
									class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-4 appearance-none focus:outline-none focus:border-zenix-green transition-colors text-lg"
									required
								>
									<option value="" disabled>Escolha uma estratégia</option>
									<option value="apollo">🚀 Apollo - Densidade de Dígitos</option>
									<option value="atlas">🎯 Atlas - Análise Estatística</option>
									<option value="nexus">⚡ Nexus - Momentum de Preço</option>
									<option value="orion">🌟 Orion - Sequência de Dígitos</option>
									<option value="titan">💪 Titan - Maioria de Paridade</option>
								</select>
								<div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
									<i class="fa-solid fa-chevron-down text-gray-400"></i>
								</div>
							</div>
							<p v-if="config.strategy" class="mt-2 text-sm text-gray-400">
								{{ getStrategyDescription(config.strategy) }}
							</p>
						</div>

						<!-- Stake Amount -->
						<div class="form-group">
							<label class="block text-white font-bold mb-2 flex items-center gap-2">
								<i class="fa-solid fa-dollar-sign text-zenix-green"></i>
								Valor de Entrada (Stake)
							</label>
							<div class="relative">
								<span class="absolute inset-y-0 left-0 pl-4 flex items-center text-white font-bold">Ð</span>
								<input 
									type="number" 
									v-model.number="config.stake" 
									min="0.35"
									step="0.01"
									class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-4 pl-10 focus:outline-none focus:border-zenix-green transition-colors text-lg"
									required
									placeholder="0.35"
								/>
							</div>
							<p class="mt-2 text-sm text-zenix-green font-bold">
								Mínimo: $0.35 • Recomendado: 1-2% do saldo
							</p>
						</div>

						<!-- Mode Selection -->
						<div class="form-group">
							<label class="block text-white font-bold mb-2 flex items-center gap-2">
								<i class="fa-solid fa-gauge-high text-zenix-green"></i>
								Modo de Operação
							</label>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<button
									type="button"
									@click="config.mode = 'veloz'"
									:class="['mode-card', { 'active': config.mode === 'veloz' }]"
								>
									<div class="mode-icon">⚡</div>
									<div class="mode-info">
										<h3 class="font-bold text-lg">Veloz</h3>
										<p class="text-xs text-gray-400">Alta frequência de operações</p>
									</div>
									<div v-if="config.mode === 'veloz'" class="mode-check">
										<i class="fa-solid fa-check"></i>
									</div>
								</button>
								<button
									type="button"
									@click="config.mode = 'moderado'"
									:class="['mode-card', { 'active': config.mode === 'moderado' }]"
								>
									<div class="mode-icon">🎯</div>
									<div class="mode-info">
										<h3 class="font-bold text-lg">Moderado</h3>
										<p class="text-xs text-gray-400">Operações mais seletivas</p>
									</div>
									<div v-if="config.mode === 'moderado'" class="mode-check">
										<i class="fa-solid fa-check"></i>
									</div>
								</button>
							</div>
						</div>

						<!-- Submit Button -->
						<div class="pt-6">
							<button 
								type="submit" 
								:disabled="isStarting || !config.strategy || !config.stake || !config.mode"
								class="w-full bg-zenix-green hover:bg-green-600 text-black font-bold text-lg py-4 rounded-lg flex justify-center items-center gap-3 transition-all shadow-lg hover:shadow-zenix-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<i class="fa-solid fa-rocket"></i>
								<span>{{ isStarting ? 'Iniciando IA...' : 'Iniciar IA Automatizada' }}</span>
							</button>
						</div>

						<!-- Info Box -->
						<div class="info-box mt-6">
							<i class="fa-solid fa-info-circle text-blue-500 text-2xl"></i>
							<div class="ml-4">
								<h4 class="font-bold text-white mb-1">Importante</h4>
								<p class="text-sm text-gray-400">
									A IA operará automaticamente 24/7 com a estratégia selecionada. 
									Você poderá acompanhar os resultados em tempo real na página de monitoramento.
								</p>
							</div>
						</div>
					</form>
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
	name: 'StatsIAsConfig',
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
			isStarting: false,

			config: {
				strategy: '',
				stake: 0.35,
				mode: 'veloz'
			},

			strategyDescriptions: {
				apollo: 'Analisa densidade de dígitos específicos em uma janela de tiques para identificar padrões',
				atlas: 'Utiliza análise estatística avançada para prever movimentos de mercado',
				nexus: 'Identifica momentum de preço através da força e direção dos tiques',
				orion: 'Detecta sequências específicas de dígitos (Par, Ímpar, <4, etc)',
				titan: 'Busca maioria de paridade (Par/Ímpar) para tomar decisões'
			}
		}
	},
	mounted() {
		this.checkMobile();
		window.addEventListener('resize', this.checkMobile);
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.checkMobile);
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
		getStrategyDescription(strategy) {
			return this.strategyDescriptions[strategy] || '';
		},
		async startIA() {
			this.isStarting = true;
			
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				const response = await fetch(`${apiBaseUrl}/ai/start`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({
						strategy: this.config.strategy,
						stake: this.config.stake,
						mode: this.config.mode
					})
				});

				if (response.ok) {
					// Redirect to monitoring page
					this.$router.push('/StatsIAs/monitoring');
				} else {
					const error = await response.json();
					alert('Erro ao iniciar IA: ' + (error.message || 'Erro desconhecido'));
				}
			} catch (error) {
				console.error('Erro ao iniciar IA:', error);
				alert('Erro ao conectar com o servidor. Verifique sua conexão.');
			} finally {
				this.isStarting = false;
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
	transition: margin-left 0.3s;
}

.layout-content {
	flex: 1;
	padding: 24px;
	overflow-y: auto;
}

.main-header {
	margin-bottom: 32px;
}

.main-header-left h1 {
	color: white;
	font-weight: bold;
}

.main-header-left p {
	color: #7D7D7D;
}

.config-form-wrapper {
	background: rgba(20, 20, 20, 0.6);
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-radius: 24px;
	padding: 32px;
}

.form-group {
	margin-bottom: 24px;
}

.mode-card {
	background: #1E1E1E;
	border: 2px solid #333;
	border-radius: 16px;
	padding: 20px;
	display: flex;
	align-items: center;
	gap: 16px;
	cursor: pointer;
	transition: all 0.3s;
	position: relative;
}

.mode-card:hover {
	border-color: #22C55E;
	transform: translateY(-2px);
}

.mode-card.active {
	border-color: #22C55E;
	background: rgba(34, 197, 94, 0.1);
}

.mode-icon {
	font-size: 32px;
	width: 56px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(34, 197, 94, 0.1);
	border-radius: 12px;
}

.mode-info {
	flex: 1;
}

.mode-info h3 {
	color: white;
}

.mode-check {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: #22C55E;
	color: black;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
}

.info-box {
	background: rgba(59, 130, 246, 0.1);
	border: 1px solid rgba(59, 130, 246, 0.2);
	border-radius: 12px;
	padding: 20px;
	display: flex;
	align-items: start;
}

.text-zenix-green {
	color: #22C55E;
}

.bg-zenix-green {
	background-color: #22C55E;
}
</style>
