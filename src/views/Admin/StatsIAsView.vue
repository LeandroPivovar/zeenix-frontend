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
			<div class="main-header">
				<div class="main-header-left">
					<h1 style="font-size: 20px;">🤖 Configuração da IA Automatizada</h1>
					<p style="font-size: 14px;">Configure sua estratégia de IA para operar 24/7 no mercado.</p>
				</div>
			</div>

			<!-- AI Trading Section -->
			<div class="ai-trading-section">
				<div class="ai-trading-header">
					<h2>🤖 Trading Automático com IA</h2>
				</div>

				<!-- Configurações Fixas (Selecionáveis) -->
				<div class="fixed-config-info">
					<div class="config-info-item">
						<label>
							Estratégia:
							<div class="tooltip-container">
								<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
									<line x1="12" y1="17" x2="12.01" y2="17"></line>
								</svg>
								<span class="tooltip-text">Modelo de análise usado pela IA</span>
							</div>
						</label>
						<select v-model="config.strategy" class="mode-select" required>
							<option value="" disabled>Selecione uma estratégia...</option>
							<option value="apollo">🚀 Apollo - Densidade de Dígitos</option>
							<option value="atlas">🎯 Atlas - Análise Estatística</option>
							<option value="nexus">⚡ Nexus - Momentum de Preço</option>
							<option value="orion">🌟 Orion - Sequência de Dígitos</option>
							<option value="titan">💪 Titan - Maioria de Paridade</option>
						</select>
					</div>
					<div class="config-info-item">
						<label>Modo de Negociação:</label>
						<select v-model="config.mode" class="mode-select" required>
							<option value="veloz">⚡ Veloz</option>
							<option value="moderado">🎯 Moderado</option>
						</select>
					</div>
				</div>

				<!-- Parâmetros de Entrada -->
				<div class="trading-controls">
					<div class="input-group">
						<label>Valor de Entrada (USD)</label>
						<span class="input-hint">Valor por operação (mínimo: $0.35)</span>
						<input 
							type="number" 
							v-model.number="config.stake" 
							min="0.35"
							step="0.01"
							placeholder="0.35"
							required
						/>
					</div>

					<button 
						:class="['btn-trading-toggle']" 
						@click="startIA"
						:disabled="isStarting || !config.strategy || !config.stake || !config.mode"
					>
						<span v-if="!isStarting">▶ Iniciar IA Automatizada</span>
						<span v-else>⏳ Iniciando...</span>
					</button>
				</div>

				<!-- Info Box -->
				<div class="info-banner-premium">
					<div class="info-icon-wrapper-premium">
						<i class="fa-solid fa-info-circle"></i>
					</div>
					<div>
						<h4 style="margin: 0; color: #f8fafc; font-size: 0.95rem; font-weight: 600;">Como funciona?</h4>
						<p style="margin: 0.5rem 0 0 0; color: #94a3b8; font-size: 0.875rem; line-height: 1.6;">
							A IA operará automaticamente 24/7 com a estratégia selecionada. Você poderá acompanhar os resultados em tempo real na página de monitoramento.
						</p>
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
				apollo: 'Densidade de dígitos específicos',
				atlas: 'Análise estatística avançada',
				nexus: 'Momentum de preço',
				orion: 'Sequências de dígitos',
				titan: 'Maioria de paridade'
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

/* AI Trading Section - 100% FROM OLD FILE */
.ai-trading-section {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%);
	border: 1px solid rgba(16, 185, 129, 0.3);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 30px;
	animation: fadeIn 0.5s ease-out 0.2s forwards;
	opacity: 0;
	width: 100%;
	box-sizing: border-box;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
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

/* Fixed Config Info - 100% FROM OLD FILE */
.fixed-config-info {
	display: flex;
	gap: 20px;
	margin-bottom: 20px;
	padding: 16px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
	border: 1px solid rgba(148, 163, 184, 0.1);
}

.config-info-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
}

.config-info-item label {
	font-size: 11px;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	margin-bottom: 4px;
}

.config-info-item .fixed-value {
	font-size: 14px;
	color: #f8fafc;
	font-weight: 600;
}

/* Mode Select - 100% FROM OLD FILE */
.mode-select {
	padding: 10px 14px;
	background: rgba(30, 41, 59, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	color: #f8fafc;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	font-family: inherit;
	width: 100%;
}

.mode-select:hover:not(:disabled) {
	border-color: rgba(16, 185, 129, 0.4);
	background: rgba(30, 41, 59, 0.8);
}

.mode-select:focus {
	outline: none;
	border-color: #10b981;
	box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.mode-select:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.mode-select option {
	background: #1e293b;
	color: #f8fafc;
	padding: 10px;
}

/* Trading Controls - 100% FROM OLD FILE */
.trading-controls {
	display: flex;
	gap: 16px;
	align-items: flex-end;
	flex-wrap: wrap;
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

.input-hint {
	font-size: 10px;
	color: #64748b;
	font-style: italic;
	margin-top: 2px;
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

/* Button - 100% FROM OLD FILE */
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

.btn-trading-toggle:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-trading-toggle:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: none;
}

/* Info Banner - PREMIUM STYLE */
.info-banner-premium {
	display: flex;
	align-items: start;
	gap: 1rem;
	margin-top: 1.5rem;
	padding: 1.25rem;
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%);
	border: 1px solid rgba(59, 130, 246, 0.3);
	border-radius: 12px;
}

.info-icon-wrapper-premium {
	width: 2.5rem;
	height: 2.5rem;
	background: rgba(59, 130, 246, 0.2);
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #3B82F6;
	font-size: 1.25rem;
	flex-shrink: 0;
}

/* Tooltip Styles - 100% FROM OLD FILE */
.tooltip-container {
	position: relative;
	display: inline-flex;
	align-items: center;
	cursor: help;
	margin-left: 4px;
	vertical-align: middle;
}

.icon-help {
	width: 14px;
	height: 14px;
	color: #94a3b8;
	transition: color 0.2s;
	flex-shrink: 0;
}

.icon-help:hover {
	color: #fff;
}

.tooltip-text {
	visibility: hidden;
	opacity: 0;
	background-color: #1e293b;
	color: #fff;
	text-align: left;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 12px;
	width: max-content;
	max-width: 250px;
	white-space: nowrap;
	position: absolute;
	z-index: 10000;
	bottom: 100%;
	left: 50%;
	margin-bottom: 8px;
	transform: translateX(-50%);
	transition: opacity 0.2s ease, visibility 0.2s ease;
	pointer-events: none;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	border: 1px solid #334155;
	text-transform: capitalize;
}

.tooltip-text::after {
	content: "";
	position: absolute;
	top: 100%;
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: #1e293b transparent transparent transparent;
}

.tooltip-container:hover .tooltip-text {
	visibility: visible;
	opacity: 1;
}

/* Responsive */
@media (max-width: 1024px) {
	.fixed-config-info {
		flex-direction: column;
	}
}

@media (max-width: 768px) {
	.main-header h1 {
		font-size: 18px !important;
	}
	
	.main-header p {
		font-size: 13px !important;
	}
	
	.trading-controls {
		flex-direction: column;
		width: 100%;
	}
	
	.input-group {
		width: 100%;
	}
	
	.input-group input {
		width: 100%;
	}
	
	.btn-trading-toggle {
		width: 100%;
	}
}
</style>
