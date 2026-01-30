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
			<TopNavbar 
				:is-sidebar-collapsed="isSidebarCollapsed"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
				@toggle-sidebar-collapse="toggleSidebarCollapse"
				@open-settings="showSettingsModal = true"
			/>

		<main class="layout-content">
			<div class="main-header">
				<div class="main-header-left">
					<h1 style="font-size: 20px;">🤖 Configuração da IA Automatizada</h1>
					<p style="font-size: 14px;">Configure sua estratégia de IA para operar 24/7 no mercado.</p>
				</div>
			</div>

			<div class="main-content px-4 py-6">
				<!-- Premium Configuration Cards -->
				<div class="config-cards-grid">
					<!-- Strategy Selection Card -->
					<div class="premium-card config-card animate-fadeInUp">
						<div class="card-header-premium">
							<i class="fa-solid fa-brain text-zenix-green text-2xl"></i>
							<div>
								<h3 class="card-title-premium">Estratégia de IA</h3>
								<p class="card-subtitle-premium">Escolha o modelo de análise</p>
							</div>
						</div>
						<div class="card-body-premium">
							<select 
								v-model="config.strategy" 
								class="premium-select"
								required
							>
								<option value="" disabled>Selecione uma estratégia</option>
								<option value="apollo">🚀 Apollo - Densidade de Dígitos</option>
								<option value="atlas">🎯 Atlas - Análise Estatística</option>
								<option value="nexus">⚡ Nexus - Momentum de Preço</option>
								<option value="orion">🌟 Orion - Sequência de Dígitos</option>
								<option value="titan">💪 Titan - Maioria de Paridade</option>
							</select>
							<div v-if="config.strategy" class="strategy-description">
								<i class="fa-solid fa-info-circle text-blue-400"></i>
								<span>{{ getStrategyDescription(config.strategy) }}</span>
							</div>
						</div>
					</div>

					<!-- Stake Amount Card -->
					<div class="premium-card config-card animate-fadeInUp" style="animation-delay: 0.1s">
						<div class="card-header-premium">
							<i class="fa-solid fa-dollar-sign text-zenix-green text-2xl"></i>
							<div>
								<h3 class="card-title-premium">Valor de Entrada</h3>
								<p class="card-subtitle-premium">Stake por operação</p>
							</div>
						</div>
						<div class="card-body-premium">
							<div class="stake-input-wrapper">
								<span class="stake-currency">Ð</span>
								<input 
									type="number" 
									v-model.number="config.stake" 
									min="0.35"
									step="0.01"
									class="premium-input-stake"
									required
									placeholder="0.35"
								/>
							</div>
							<div class="stake-info">
								<span class="text-zenix-green font-bold">Mínimo: $0.35</span>
								<span class="text-gray-400">• Recomendado: 1-2% do saldo</span>
							</div>
						</div>
					</div>

					<!-- Mode Selection Card -->
					<div class="premium-card config-card animate-fadeInUp" style="animation-delay: 0.2s">
						<div class="card-header-premium">
							<i class="fa-solid fa-gauge-high text-zenix-green text-2xl"></i>
							<div>
								<h3 class="card-title-premium">Modo de Operação</h3>
								<p class="card-subtitle-premium">Frequência de trades</p>
							</div>
						</div>
						<div class="card-body-premium">
							<div class="mode-selector">
								<button
									type="button"
									@click="config.mode = 'veloz'"
									:class="['mode-option', { 'active': config.mode === 'veloz' }]"
								>
									<div class="mode-option-icon">⚡</div>
									<div class="mode-option-info">
										<h4>Veloz</h4>
										<p>Alta frequência</p>
									</div>
									<div v-if="config.mode === 'veloz'" class="mode-check-icon">
										<i class="fa-solid fa-check"></i>
									</div>
								</button>
								<button
									type="button"
									@click="config.mode = 'moderado'"
									:class="['mode-option', { 'active': config.mode === 'moderado' }]"
								>
									<div class="mode-option-icon">🎯</div>
									<div class="mode-option-info">
										<h4>Moderado</h4>
										<p>Seletivo</p>
									</div>
									<div v-if="config.mode === 'moderado'" class="mode-check-icon">
										<i class="fa-solid fa-check"></i>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Action Button -->
				<div class="action-section animate-fadeInUp" style="animation-delay: 0.3s">
					<button 
						@click="startIA" 
						:disabled="isStarting || !config.strategy || !config.stake || !config.mode"
						class="btn-start-ia"
					>
						<div class="btn-glow"></div>
						<i class="fa-solid fa-rocket"></i>
						<span>{{ isStarting ? 'Iniciando IA...' : 'Iniciar IA Automatizada' }}</span>
					</button>
				</div>

				<!-- Info Banner -->
				<div class="info-banner animate-fadeInUp" style="animation-delay: 0.4s">
					<div class="info-banner-icon">
						<i class="fa-solid fa-info-circle"></i>
					</div>
					<div class="info-banner-content">
						<h4>Como funciona?</h4>
						<p>A IA operará automaticamente 24/7 com a estratégia selecionada. Você poderá acompanhar os resultados em tempo real na página de monitoramento.</p>
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
				// Save configuration to localStorage for the monitoring page
				localStorage.setItem('ai_active_config', JSON.stringify({
					strategy: this.config.strategy,
					stake: this.config.stake,
					mode: this.config.mode
				}));

				// Redirect to monitoring page
				this.$router.push('/StatsIAs/monitoring');
			} catch (error) {
				console.error('Erro ao iniciar IA:', error);
				alert('Erro ao iniciar IA. Por favor, tente novamente.');
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
	margin-bottom: 8px;
}

.main-header-left p {
	color: #7D7D7D;
}

/* Premium Card Styles */
.config-cards-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	gap: 1.5rem;
	margin-bottom: 2rem;
}

.premium-card {
	background: linear-gradient(145deg, rgba(30, 30, 30, 0.8), rgba(20, 20, 20, 0.9));
	backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-radius: 20px;
	padding: 1.75rem;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
}

.premium-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 2px;
	background: linear-gradient(90deg, transparent, #22C55E, transparent);
	opacity: 0;
	transition: opacity 0.4s;
}

.premium-card:hover {
	transform: translateY(-4px);
	border-color: rgba(34, 197, 94, 0.3);
	box-shadow: 0 12px 48px rgba(34, 197, 94, 0.15);
}

.premium-card:hover::before {
	opacity: 1;
}

.card-header-premium {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.5rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-title-premium {
	font-size: 1.125rem;
	font-weight: 700;
	color: #f8fafc;
	margin: 0;
}

.card-subtitle-premium {
	font-size: 0.75rem;
	color: #94a3b8;
	margin: 0;
	margin-top: 0.25rem;
}

.card-body-premium {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Premium Select */
.premium-select {
	width: 100%;
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 1rem;
	color: #f8fafc;
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s;
	appearance: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 1rem center;
	background-size: 1.25rem;
	padding-right: 3rem;
}

.premium-select:hover {
	border-color: #22C55E;
}

.premium-select:focus {
	outline: none;
	border-color: #22C55E;
	box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.premium-select option {
	background: #1e293b;
	color: #f8fafc;
	padding: 1rem;
}

.strategy-description {
	display: flex;
	align-items: start;
	gap: 0.75rem;
	padding: 0.875rem;
	background: rgba(59, 130, 246, 0.1);
	border: 1px solid rgba(59, 130, 246, 0.2);
	border-radius: 8px;
	font-size: 0.8125rem;
	color: #94a3b8;
	line-height: 1.5;
}

/* Stake Input */
.stake-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.stake-currency {
	position: absolute;
	left: 1.25rem;
	font-size: 1.25rem;
	font-weight: 700;
	color: #22C55E;
	pointer-events: none;
}

.premium-input-stake {
	width: 100%;
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 1rem 1rem 1rem 3rem;
	color: #f8fafc;
	font-size: 1.5rem;
	font-weight: 700;
	transition: all 0.3s;
}

.premium-input-stake:hover {
	border-color: #22C55E;
}

.premium-input-stake:focus {
	outline: none;
	border-color: #22C55E;
	box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.stake-info {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	font-size: 0.75rem;
}

/* Mode Selector */
.mode-selector {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.mode-option {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: rgba(15, 23, 42, 0.4);
	border: 2px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s;
	position: relative;
}

.mode-option:hover {
	border-color: #22C55E;
	transform: translateX(4px);
}

.mode-option.active {
	border-color: #22C55E;
	background: rgba(34, 197, 94, 0.1);
	box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
}

.mode-option-icon {
	font-size: 2rem;
	width: 3.5rem;
	height: 3.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(34, 197, 94, 0.1);
	border-radius: 12px;
	flex-shrink: 0;
}

.mode-option-info {
	flex: 1;
	text-align: left;
}

.mode-option-info h4 {
	font-size: 1.125rem;
	font-weight: 700;
	color: #f8fafc;
	margin: 0;
}

.mode-option-info p {
	font-size: 0.875rem;
	color: #94a3b8;
	margin: 0;
	margin-top: 0.25rem;
}

.mode-check-icon {
	width: 2rem;
	height: 2rem;
	background: #22C55E;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #000;
	font-size: 0.875rem;
	flex-shrink: 0;
	animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Action Section */
.action-section {
	margin: 2rem 0;
}

.btn-start-ia {
	width: 100%;
	position: relative;
	padding: 1.25rem 2rem;
	background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
	border: none;
	border-radius: 16px;
	color: #000;
	font-size: 1.125rem;
	font-weight: 700;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	overflow: hidden;
	box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

.btn-start-ia::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
	transition: left 0.5s;
}

.btn-start-ia:hover::before {
	left: 100%;
}

.btn-start-ia:hover {
	transform: translateY(-2px);
	box-shadow: 0 12px 32px rgba(34, 197, 94, 0.4);
}

.btn-start-ia:active {
	transform: translateY(0);
}

.btn-start-ia:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	transform: none;
}

.btn-glow {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%);
	opacity: 0;
	transition: opacity 0.4s;
	pointer-events: none;
}

.btn-start-ia:hover .btn-glow {
	opacity: 1;
}

/* Info Banner */
.info-banner {
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
	border: 1px solid rgba(59, 130, 246, 0.2);
	border-radius: 16px;
	padding: 1.5rem;
	display: flex;
	align-items: start;
	gap: 1rem;
}

.info-banner-icon {
	width: 3rem;
	height: 3rem;
	background: rgba(59, 130, 246, 0.2);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #3B82F6;
	font-size: 1.5rem;
	flex-shrink: 0;
}

.info-banner-content h4 {
	font-size: 1rem;
	font-weight: 700;
	color: #f8fafc;
	margin: 0 0 0.5rem 0;
}

.info-banner-content p {
	font-size: 0.875rem;
	color: #94a3b8;
	margin: 0;
	line-height: 1.6;
}

/* Animations */
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

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.animate-fadeInUp {
	animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	opacity: 0;
}

/* Utility Classes */
.text-zenix-green {
	color: #22C55E;
}

.text-gray-400 {
	color: #94a3b8;
}

.text-blue-400 {
	color: #3B82F6;
}

.font-bold {
	font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
	.config-cards-grid {
		grid-template-columns: 1fr;
	}
	
	.main-header h1 {
		font-size: 18px !important;
	}
	
	.main-header p {
		font-size: 13px !important;
	}
}
</style>
