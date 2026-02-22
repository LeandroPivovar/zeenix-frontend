<template>
	<div class="layout-content-agent-autonomo">
		<div class="agent-config-container">

			<!-- Header Section -->
		<section class="fade-in" style="margin-bottom: 1.5rem;">
			<!-- Desktop: AI Vision Panel -->
			<div v-if="!isMobile" class="ai-vision-panel-desktop" style="margin-top: 2rem;">
				<div class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card glow-green ai-vision-container">
					<!-- Header Desktop -->
					<div class="mb-6">
						<div class="text-left">
							<h1 class="text-xl font-bold text-zenix-text mb-1">Painel de Configuração do Agente Autônomo</h1>
							<p class="text-sm text-zenix-secondary">Defina parâmetros de risco, metas diárias e limites. O agente opera continuamente até atingir objetivos e reinicia no próximo dia.</p>
						</div>
					</div>
					<div class="grid grid-cols-12 gap-5">
						<!-- AI Visualization Area -->
						<div class="col-span-5 h-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-zenix-green/10 to-transparent border-2 border-zenix-green/30 flex items-center justify-center relative ai-visualization-area">
							<div class="absolute inset-0 bg-gradient-to-br from-zenix-green/5 via-transparent to-zenix-green/10"></div>
							<!-- Animated Grid Background -->
							<div class="absolute inset-0 opacity-20">
								<div id="i9dlnn" class="absolute inset-0"></div>
							</div>
							<!-- Central AI Core -->
							<div class="relative z-10 flex items-center justify-center ai-core-mobile" style="width: 100%; height: 100%;">
								<!-- Outer Rotating Ring -->
								<div id="irazem" class="absolute w-40 h-40 border-2 border-zenix-green/30 rounded-full ai-glow-ring" style="opacity: 1;"></div>
								<!-- Middle Rotating Ring -->
								<div id="i5uptv" class="absolute w-32 h-32 border-2 border-zenix-green/40 rounded-full" style="opacity: 1;"></div>
								<!-- Inner Pulsing Core -->
								<div class="absolute w-24 h-24 bg-zenix-green/20 rounded-full blur-xl ai-pulse" style="opacity: 1;"></div>
								<!-- Central AI Robot Icon -->
								<div class="relative z-30 ai-brain-glow" style="display: flex; align-items: center; justify-content: center;">
									<i class="fas fa-microchip text-zenix-green text-5xl" style="opacity: 1 !important; display: block !important; visibility: visible !important; font-size: 3.5rem !important;"></i>
								</div>
								<!-- Orbiting Data Nodes -->
								<div id="iyljui" class="absolute w-3 h-3 bg-zenix-green rounded-full" style="opacity: 1;"></div>
								<div id="isxtjr" class="absolute w-2 h-2 bg-zenix-green/70 rounded-full" style="opacity: 1;"></div>
								<div id="ijse57" class="absolute w-2.5 h-2.5 bg-zenix-green/80 rounded-full" style="opacity: 1;"></div>
							</div>
							<!-- Floating Particles -->
							<div class="absolute inset-0 overflow-hidden">
								<div id="iw45yh" class="absolute w-1 h-1 bg-zenix-green rounded-full"></div>
								<div id="i2cpbj" class="absolute w-1.5 h-1.5 bg-zenix-green/70 rounded-full"></div>
								<div id="ispbex" class="absolute w-1 h-1 bg-zenix-green/60 rounded-full"></div>
								<div id="i7wi6r" class="absolute w-1.5 h-1.5 bg-zenix-green rounded-full"></div>
							</div>
							<!-- Data Stream Lines -->
							<div class="absolute inset-0 overflow-hidden opacity-30">
								<div id="ivhu5o" class="absolute h-px w-20 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
								<div id="iybi4e" class="absolute h-px w-16 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
								<div id="icjipi" class="absolute h-px w-24 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
							</div>
						</div>
						<!-- Status Cards -->
						<div class="col-span-7 grid grid-cols-2 gap-4 status-cards-container">
							<!-- Card 1: AUTONOMIA -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
								<div class="flex items-center justify-center gap-2 mb-2">
									<i class="fas fa-microchip text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-bold status-label">AUTONOMIA</p>
								</div>
								<p class="text-xs text-white status-value">100% Autônomo</p>
								<p class="text-xs text-zenix-label mt-1 status-description">Opera 24/7 sem supervisão</p>
							</div>
							<!-- Card 2: CONFIGURAÇÃO -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
								<div class="flex items-center justify-center gap-2 mb-2">
									<i class="fas fa-cog text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-bold status-label">CONFIGURAÇÃO</p>
								</div>
								<p class="text-xs text-white status-value">Configure uma vez</p>
								<p class="text-xs text-zenix-label mt-1 status-description">Esqueça e deixe trabalhar</p>
							</div>
							<!-- Card 3: PROTEÇÃO -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
								<div class="flex items-center justify-center gap-2 mb-2">
									<i class="fas fa-shield-alt text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-bold status-label">PROTEÇÃO</p>
								</div>
								<p class="text-xs text-white status-value">Metas Automáticas</p>
								<p class="text-xs text-zenix-label mt-1 status-description">Para ao atingir lucro ou perda</p>
							</div>
							<!-- Card 4: CICLO DIÁRIO -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center text-center">
								<div class="flex items-center justify-center gap-2 mb-2">
									<i class="fas fa-sync-alt text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-bold status-label">CICLO DIÁRIO</p>
								</div>
								<p class="text-xs text-white status-value">Reinício Automático</p>
								<p class="text-xs text-zenix-label mt-1 status-description">Volta sozinho no dia seguinte</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Mobile: Simple Header -->
			<!-- Mobile: Header Structured -->
			<div v-if="isMobile" class="mb-6 ai-vision-header-mobile">
				<div class="flex items-center justify-between">
					<div class="text-left flex flex-col gap-[3px]">
						<h1 class="text-xl font-bold text-zenix-text leading-tight">Configuração do Agente Autônomo</h1>
						<p class="text-sm text-zenix-secondary leading-tight">Defina parâmetros de risco, metas diárias e limites. O agente opera continuamente até atingir objetivos e reinicia no próximo dia.</p>
					</div>
					<!-- Icon Removed for Left Alignment -->
				</div>
			</div>
		</section>
			<div class="config-grid">
				<!-- Agente Selecionado -->
				<div id="agent-selection-card" class="config-card premium-card">
					<div class="card-content">
						<div class="form-group">
							<label class="form-label">
								Agente Autônomo
								<div class="tooltip-container">
									<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Modelo de análise usado pela IA</span>
								</div>
							</label>
							
							<!-- Premium Selector Button -->
							<button 
								@click="openAgentSelectorModal"
								class="premium-selector-btn"
							>
								<div class="selector-content">
									<div class="selector-left">
                                            <div class="strategy-icons-inline" v-if="selectedAgent">
                                                <div class="agent-avatar-mask-small">
                                                    <img 
                                                        v-if="availableAgents.find(a => a.id === selectedAgent)?.image" 
                                                        :src="availableAgents.find(a => a.id === selectedAgent)?.image" 
                                                        class="agent-video-avatar" 
                                                    />
                                                    <img 
                                                        v-else
                                                        :src="availableAgents.find(a => a.id === selectedAgent)?.icons[0]" 
                                                        class="deriv-svg-icon-small"
                                                    />
                                                </div>
                                            </div>
										<span :class="{ 'placeholder': !selectedAgent }">
											{{ selectedAgent ? getAgentTitle(selectedAgent).replace('Agente ', '') : 'Selecione seu agente' }}
										</span>
									</div>
									<i class="fas fa-chevron-right selector-arrow"></i>
								</div>
							</button>
							
							<!-- Agent Description Card (appears when selected) -->
							<transition name="slide-fade" mode="out-in">
								<div v-if="selectedAgent" :key="selectedAgent" class="agent-description-card mt-3">
									<div class="agent-desc-content">
										<div class="agent-desc-info-row">
											<span class="info-item"><strong>Análise:</strong> {{ getAgentAnalysis(selectedAgent) }}</span>
											<span class="info-item"><strong>Assertividade:</strong> {{ getAgentAssertiveness(selectedAgent) }}</span>
											<span class="info-item"><strong>Retorno:</strong> {{ getStaticReturn(selectedAgent) }}</span>
										</div>
									</div>
								</div>
							</transition>
						</div>

						<!-- Nível de Risco -->
						<div class="form-group risk-management-section">
							<label class="form-label">
								Gestão de Risco
								<div class="tooltip-container">
									<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Configura a estratégia de recuperação e o nível de exposição do capital.</span>
								</div>
							</label>
							<div class="risk-buttons">
								<button 
									:class="['risk-btn', { 'active': selectedRisk === 'fixed' }]"
									@click="selectRisk('fixed')"
								>
									Fixo
								</button>
								<button 
									:class="['risk-btn', { 'active': selectedRisk === 'conservative' }]"
									@click="selectRisk('conservative')"
								>
									Conservador
								</button>
								<button 
									:class="['risk-btn', { 'active': selectedRisk === 'balanced' }]"
									@click="selectRisk('balanced')"
								>
									Moderado
								</button>
								<button 
									:class="['risk-btn', { 'active': selectedRisk === 'aggressive' }]"
									@click="selectRisk('aggressive')"
								>
									Agressivo
								</button>
							</div>
							
							<div class="risk-indicator">
								<div class="risk-header">
									<span class="risk-label">Intensidade do Risco</span>
									<span class="risk-level-text">{{ riskLevelText }}</span>
								</div>
								<div class="risk-bar-container">
									<div class="risk-bar" :style="{ width: riskBarWidth }"></div>
								</div>
								<p class="risk-description">{{ riskDescriptionText }}</p>
							</div>
						</div>


					</div>
				</div>

				<!-- Parâmetros Diários -->
				<div id="entry-params-card" class="config-card premium-card">
					<div class="card-content">
						<div class="value-goal-row">
							<div class="form-group flex-1">
								<label class="form-label">
									Valor por operação
									<div class="tooltip-container">
										<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Defina o valor da sua primeira operação. Todas as estratégias de recuperação e alavancagem (Soros) serão calculadas a partir deste valor base.</span>
									</div>
								</label>
								<div class="input-wrapper">
									<span class="input-prefix-premium">{{ preferredCurrencyPrefix }}</span>
									<input 
										type="number" 
										class="form-input" 
										v-model.number="valorOperacao"
										min="0.01"
										step="0.01"
									>
								</div>
								<p class="form-help">{{ percentualValorOperacao }}% do capital total</p>
							</div>

							<div class="form-group flex-1">
								<label class="form-label">
									Meta diária de lucro
									<div class="tooltip-container">
										<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Sua meta financeira para a sessão. O sistema encerrará as operações automaticamente assim que este valor for atingido ou superado.</span>
									</div>
								</label>
								<div class="input-wrapper">
									<span class="input-prefix-premium">{{ preferredCurrencyPrefix }}</span>
									<input 
										type="number" 
										class="form-input" 
										v-model.number="metaLucro"
										min="0.01"
										step="0.01"
									>
								</div>
								<p class="form-help positive">+{{ percentualMetaLucro }}% do capital total</p>
							</div>
						</div>

						<div class="loss-stoploss-row">
							<div class="form-group flex-1">
								<label class="form-label">
									Limite de Perda
									<div class="tooltip-container">
										<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">O valor máximo que você aceita arriscar na sessão. Nosso sistema possui Stop de Precisão: ele ajusta automaticamente o valor da última entrada para garantir que você nunca perca mais do que definiu aqui.</span>
									</div>
								</label>
								<div class="input-wrapper">
									<span class="input-prefix-premium">{{ preferredCurrencyPrefix }}</span>
									<input 
										type="number" 
										class="form-input" 
										v-model.number="limitePerda"
										min="0.01"
										step="0.01"
									>
								</div>
								<p class="form-help negative">-{{ percentualLimitePerda }}% do saldo</p>
							</div>
							
							<div class="form-group flex-1">
								<label class="form-label">
									Stoploss Blindado
									<div class="tooltip-container">
										<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Ative para proteção dinâmica. Quando você atinge 40% da meta, o sistema cria um 'piso de segurança' móvel. Se o mercado virar, o sistema para com lucro garantido (50% do pico), impedindo que você devolva seus ganhos.</span>
									</div>
								</label>
								<div class="stoploss-blindado-wrapper">
									<div class="stoploss-blindado-label">
										<i class="fas fa-shield-alt"></i>
										<span>{{ stopLossBlindado ? 'Ativado' : 'Desativado' }}</span>
									</div>
									<label class="toggle-switch stoploss-toggle">
										<input 
											type="checkbox" 
											v-model="stopLossBlindado"
										>
										<span class="toggle-slider"></span>
									</label>
								</div>
							</div>
						</div>


						<!-- Botão de Iniciar Agente -->
						<div class="mt-auto">
							<button 
								class="start-agent-btn" 
								@click="iniciarAgente"
								:disabled="!selectedAgent || isStarting"
								:class="{ 'disabled': !selectedAgent || isStarting, 'loading': isStarting }"
							>
								<template v-if="isStarting">
									<i class="fas fa-spinner fa-spin mr-2"></i>
									Iniciando Agente...
								</template>
								<template v-else>
									Iniciar Agente Autônomo
								</template>
							</button>
						</div>
					</div>
				</div>

			</div> <!-- End of config-grid -->
		</div> <!-- End of agent-config-container -->

		<Teleport to="body">
			<div v-if="showAgentSelectorModal" class="modal-overlay" @click.self="closeAgentSelectorModal">
				<div class="modal-content categorized-modal">
					<div class="modal-header-premium">
						<div class="modal-header-text">
							<h3 class="modal-title">Selecionar Agente Autônomo</h3>
							<p class="modal-subtitle">Escolha qual inteligência irá operar por você nesta sessão</p>
						</div>
						<button @click="closeAgentSelectorModal" class="modal-close-btn">
							<i class="fas fa-times"></i>
						</button>
					</div>
					<div class="modal-body">
						<div class="agents-selection-list">
							<div 
								v-for="agent in availableAgents" 
								:key="agent.id"
									class="agent-selection-card"
								:class="{ 
									'active': selectedAgent === agent.id,
									'disabled-card': agent.id === 'falcon' && !isAdmin
								}"
								@click="selectAgent(agent.id)"
							>
								<!-- Overlay para Agente em Desenvolvimento (Falcon) - Apenas se não for admin -->
								<div v-if="agent.id === 'falcon' && !isAdmin" class="falcon-overlay">
									<div class="overlay-badge">
										<i class="fas fa-hammer mr-2"></i>
										<span>EM BREVE</span>
									</div>
								</div>
								<!-- Top Row: Avatar, Header, Action -->
                                <div class="agent-selection-card-top-row">
                                    <!-- Left Section: Avatar (Rectangular) -->
                                    <div class="agent-card-left-tall">
                                        <img 
                                            v-if="agent.image" 
                                            :src="agent.image" 
                                            class="agent-video-tall"
                                        />
                                        <div v-else class="agent-avatar-fallback-tall">
                                            <i class="fas fa-robot"></i>
                                        </div>
                                    </div>

                                    <!-- Middle Section: Header Only -->
                                    <div class="agent-card-content header-only">
                                        <div class="agent-header-row">
                                            <div class="agent-title-col">
                                                <h4 class="agent-name-premium">{{ agent.title.replace('Agente ', '') }}</h4>
                                                <p class="agent-description-premium">{{ agent.subtitle }}</p>
                                            </div>
                                            <span class="agent-profile-badge" :class="agent.profileBadge.toLowerCase()">
                                                {{ agent.profileBadge }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Right Section: Action -->
                                    <div class="agent-card-action">
                                        <div class="agent-performance-badget">
                                            <span class="perf-val">{{ getAgentReturn(agent.id) }}</span>
                                            <span class="perf-lbl text-muted">RETORNO</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Subtle Divider -->
                                <div class="agent-card-divider"></div>

                                <!-- Bottom Row: Benefits List -->
                                <div class="agent-benefits-list-row">
                                    <div class="agent-benefits-list-premium">
                                        <div class="benefit-item-premium full-width">
											<i class="fas fa-check-circle"></i>
                                            <span class="benefit-content"><strong>Análise:</strong> {{ agent.analysis }}</span>
                                        </div>
										<div class="benefit-row-inline">
											<div class="benefit-item-premium">
												<i class="fas fa-check-circle"></i>
												<span class="benefit-content"><strong>Assertividade:</strong> {{ agent.assertiveness }}</span>
											</div>
											<div class="benefit-item-premium">
												<span class="benefit-content"><strong>Retorno:</strong> {{ agent.return }}</span>
											</div>
										</div>
                                    </div>
                                </div>
								
								<!-- Glow Effect -->
								<div v-if="selectedAgent === agent.id" class="selection-glow"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Teleport>

		<!-- Invalid Params Modal -->
		<InvalidParamsModal 
			:visible="showInvalidParamsModal"
			:message="invalidParamsMessage"
			@confirm="showInvalidParamsModal = false"
		/>

		<!-- Implementation Modal for Falcon -->
		<Teleport to="body">
			<ImplementationModal
				:visible="showFalconDevModal"
				entity-type="Agente"
				message="Este agente ainda está sendo implementado e será liberado entre segunda e sexta da próxima semana."
				@close="showFalconDevModal = false"
			/>
		</Teleport>
	</div> <!-- End of layout-content-agent-autonomo -->
</template>

<script>
import InvalidParamsModal from '../modals/InvalidParamsModal.vue';
import ImplementationModal from '../modals/ImplementationModal.vue';
	import accountBalanceMixin from '@/mixins/accountBalanceMixin';

	export default {
		// *** MODIFICAÇÃO 2: Nome do componente corrigido ***
		name: 'AgenteAutonomoInactive',
		mixins: [accountBalanceMixin],
	components: {
		InvalidParamsModal,
		ImplementationModal
	},
	props: {
		accountBalance: {
			type: Number,
			default: null
		},
		shouldTeleport: {
			type: Boolean,
			default: false
		},
		planFeatures: {
			type: Object,
			default: null
		},
		isMobile: {
			type: Boolean,
			default: false
		}
		// NOTA: Este componente também está recebendo 'estrategia', 'mercado', 'risco', etc.
		// do 'agenteData' (via v-bind), mas está usando seu próprio 'data()' local.
		// A solução abaixo envia os dados locais para o pai ao iniciar.
	},
		data() {
		return {
			// Estado de seleção inicial (Baseado na imagem)
			selectedAgent: null, 
			selectedMarket: 'volatility_100',  // ✅ FIX: Default to R_100 per agent requirement 
			stopLossBlindado: false, 
			selectedRisk: 'balanced',
			selectedTradingMode: 'rapido', // Novo: Modo de Negociação

			// Parâmetros (Baseado na imagem)
			valorOperacao: 20.00,
			metaLucro: 100.00,
			limitePerda: 100.00,
			showAgentSelectorModal: false,
			isStarting: false,
			showInvalidParamsModal: false,
			invalidParamsMessage: '',
			showFalconDevModal: false,
			zeusReturn: 3.97,
			falconReturn: 2.89,
			returnInterval: null,
			allAgents: [
				{
					id: 'zeus',
					title: 'Agente Zeus',
					subtitle: 'Análise de Fluxo',
					profileBadge: 'OFENSIVO',
					percentage: 'dynamic', // Use dynamic placeholder
					percentageLabel: 'Performance recente',
					graphColor: '#22c55e',
					image: '/img/agents/zeus.png', // Updated to image
					marketType: 'Digits',
					icons: ['/deriv_icons/TradeTypesTurboLongIcon.svg'],
					description: 'Estatística de Dígitos',
					analysis: 'Estatística de Dígitos',
					assertiveness: '65% a 80%',
					return: '19% a 126%',
					benefits: [
						'Ideal para contas pequenas',
						'Mercado ativo',
						'Busca de consistência',
						'Operações mais frequentes'
					]
				},
				{
					id: 'falcon',
					title: 'Agente Falcon',
					subtitle: 'Barreira de segurança',
					profileBadge: 'DEFENSIVO',
					percentage: 'dynamic', // Use dynamic placeholder
					percentageLabel: 'Performance recente',
					graphColor: '#22c55e',
					image: '/img/agents/falcon.png', // Updated to image
					marketType: 'Digits',
					icons: ['/deriv_icons/TradeTypesHighsAndLowsHighIcon.svg'],
					description: 'Barreira de Segurança',
					analysis: 'Estatística de Dígitos (Over 2)',
					assertiveness: '91% a 95%',
					return: '65% a 86%',
					benefits: [
						'Ideal para banca acima de {{ preferredCurrencyPrefix }}500',
						'Proteção de capital',
						'Foco em consistência diária',
						'Menor exposição ao risco'
					]
				}
			]
		};
	},
	async mounted() {
		console.log('[AgenteAutonomoInactive] Componente montado.');
		// Carregar configurações salvas do backend
		await this.loadSavedConfig();
		
		// Iniciar oscilação do retorno (pequenas mudanças a cada 45s)
		this.startReturnOscillation();
	},
	beforeUnmount() {
		if (this.returnInterval) clearInterval(this.returnInterval);
	},
	methods: {
		async loadSavedConfig() {
			try {
				// Obter userId do token JWT
				const token = localStorage.getItem('token');
				if (!token) return;
				
				const payload = JSON.parse(atob(token.split('.')[1]));
				const userId = payload.userId || payload.sub || payload.id;
				if (!userId) return;

				const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
				const response = await fetch(`${apiBase}/autonomous-agent/config/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const result = await response.json();
				if (result.success && result.data) {
					const config = result.data;
					
					// Mapear símbolo para mercado
					const symbolToMarket = {
						'R_10': 'volatility_10',
						'R_25': 'volatility_25',
						'R_50': 'volatility_50',
						'R_75': 'volatility_75',
						'R_100': 'volatility_100'
					};
					
					// Atualizar valores se existirem
					if (config.symbol) {
						this.selectedMarket = symbolToMarket[config.symbol] || 'volatility_100';
					}
					if (config.riskLevel) {
						this.selectedRisk = config.riskLevel === 'fixo' ? 'fixed' : config.riskLevel;
					}
					if (config.initialStake) {
						this.valorOperacao = parseFloat(config.initialStake);
					}
					if (config.dailyProfitTarget) {
						this.metaLucro = parseFloat(config.dailyProfitTarget);
					}
					if (config.dailyLossLimit) {
						this.limitePerda = parseFloat(config.dailyLossLimit);
					}
				}
			} catch (error) {
				console.error('[AgenteAutonomoInactive] Erro ao carregar configuração salva:', error);
			}
		},

		handleToggleChange(event) {
			if (event.target.checked) {
				// Quando o toggle é ativado, aguarda delay antes de iniciar o agente
				setTimeout(() => {
					this.iniciarAgente();
				}, 500); // Delay de 500ms
			}
		},
		
		iniciarAgente() {
			if (!this.selectedAgent) {
				if (this.$root && this.$root.$toast) {
					this.$root.$toast.warning('Por favor, selecione um agente antes de iniciar o Agente Autônomo.');
				}
				return;
			}

			if (this.isStarting) return;
			this.isStarting = true;

			// 1. Coleta os dados configurados
			// 1. Coleta os dados configurados
			const configData = {
				agentType: this.selectedAgent,
				mercado: this.selectedMarket,
				risco: this.selectedRisk === 'fixed' ? 'fixo' : this.selectedRisk, // ✅ FIX: Send 'fixo' for fixed risk
				goalValue: this.metaLucroNumero,
				stopValue: this.limitePerdaNumero,
				initialStake: this.valorOperacaoNumero,
				stopLossType: this.stopLossBlindado ? 'blindado' : 'normal', // ✅ FIX: Send stop type
			};

			// 1.5. Validação de parâmetros
			if (configData.initialStake <= 0) {
				this.isStarting = false;
				this.invalidParamsMessage = 'O valor de entrada (stake base) não pode ser zero.';
				this.showInvalidParamsModal = true;
				return;
			}

			if (configData.initialStake > configData.goalValue) {
				this.isStarting = false;
				this.invalidParamsMessage = 'O valor de entrada não pode ser maior que a Meta de Lucro (Stop Win).';
				this.showInvalidParamsModal = true;
				return;
			}

			if (configData.initialStake > configData.stopValue) {
				this.isStarting = false;
				this.invalidParamsMessage = 'O valor de entrada não pode ser maior que o Limite de Perda (Stop Loss).';
				this.showInvalidParamsModal = true;
				return;
			}

			// 2. Atualiza os valores no componente pai antes de iniciar
			if (this.$parent.goalValue !== undefined) {
				this.$parent.goalValue = this.metaLucroNumero;
			}
			if (this.$parent.stopValue !== undefined) {
				this.$parent.stopValue = this.limitePerdaNumero;
			}

			// Simular delay para feedback visual e então iniciar
			setTimeout(() => {
				if (this.$root && this.$root.$toast) {
					this.$root.$toast.success('Agente configurado com sucesso! Iniciando operações...');
				}

				// 3. Emite o evento 'iniciar-agente' COM o objeto de dados
				this.$emit('iniciar-agente', configData);

				// Rolar para o topo
				window.scrollTo({ top: 0, behavior: 'smooth' });
				
				// Omitindo reset de isStarting para manter o loader até a transição de componente
			}, 800);
		},

		openAgentSelectorModal() {
			this.showAgentSelectorModal = true;
		},

		closeAgentSelectorModal() {
			this.showAgentSelectorModal = false;
		},

		selectAgent(agentId) {
			// ✅ FIX: Block Falcon selection and show dev modal ONLY if not admin
			if (agentId === 'falcon' && !this.isAdmin) {
				this.showFalconDevModal = true;
				this.closeAgentSelectorModal();
                return;
			}
			
			this.selectedAgent = agentId;
			this.selectedMarket = 'volatility_100';
			this.closeAgentSelectorModal();
		},

		getAgentTitle(id) {
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.title.replace('Agente ', '') : 'Selecione seu agente';
		},
		selectMarket(marketId) {
			this.selectedMarket = marketId;
		},
		selectRisk(riskId) {
			this.selectedRisk = riskId;
		},
		getMarketTitle(id) {
			const map = {
				'volatility_10': 'Volatility 10 Index',
				'volatility_25': 'Volatility 25 Index',
				'volatility_50': 'Volatility 50 Index', 
				'volatility_75': 'Volatility 75 Index',
				'volatility_100': 'Volatility 100 Index'
			};
			return map[id] || id;
		},
		
		// 🟢 NOVO MÉTODO 🟢
		getMarketDescription(id) {
			const map = {
				'volatility_10': 'Mercado com volatilidade constante de 10%.',
				'volatility_25': 'Mercado com volatilidade constante de 25%.',
				'volatility_50': 'Mercado com volatilidade constante de 50%.',
				'volatility_75': 'Mercado com volatilidade constante de 75%.',
				'volatility_100': 'Mercado com volatilidade constante de 100%.'
			};
			return map[id] || '';
		},


		// 🟢 NOVO MÉTODO: Descrição do Agente 🟢
		getAgentDescription(id) {
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.description : '';
		},
		getAgentAnalysis(id) {
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.analysis : '';
		},
		getAgentAssertiveness(id) {
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.assertiveness : '';
		},
		getAgentReturn(id) {
			if (id === 'zeus') return `+${this.zeusReturn.toFixed(2)}%`;
			if (id === 'falcon') return `+${this.falconReturn.toFixed(2)}%`;
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.return : '';
		},
		getStaticReturn(id) {
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.return : '';
		},

		getRiskTitle(id) {
			const map = {
				'conservative': 'Conservador',
				'balanced': 'Moderado',
				'aggressive': 'Agressivo',
				'fixed': 'Fixo'
			};
			return map[id] || id;
		},
		updateValorOperacao(event) {
			const value = event.target.value.replace(this.preferredCurrencyPrefix, '').replace(',', '');
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				this.valorOperacao = numValue;
			}
		},
		startReturnOscillation() {
			this.returnInterval = setInterval(() => {
				// Oscilação Zeus: entre 3.50% e 4.10% (Valor Verde)
				const zeusVariation = (Math.random() * 0.08 - 0.04); // +/- 0.04
				this.zeusReturn = Math.max(3.50, Math.min(4.10, this.zeusReturn + zeusVariation));
				
				// Oscilação Falcon: entre 2.50% e 3.20% (Valor Verde)
				const falconVariation = (Math.random() * 0.06 - 0.03); // +/- 0.03
				this.falconReturn = Math.max(2.50, Math.min(3.20, this.falconReturn + falconVariation));
			}, 45000); // A cada 45 segundos
		},
		updateMetaLucro(event) {
			const value = event.target.value.replace(this.preferredCurrencyPrefix, '').replace(',', '');
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				this.metaLucro = numValue;
			}
		},
		updateLimitePerda(event) {
			const value = event.target.value.replace(this.preferredCurrencyPrefix, '').replace(',', '');
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				this.limitePerda = numValue;
			}
		},
	},
	computed: {
        isAdmin() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Verificar se o usuário tem role de admin
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                const isAdminFlag = payload.isAdmin || payload.is_admin;
                
                console.log('[AgenteAutonomoInactive] Checking Admin Status:', { role, isAdminFlag, payload });

                // Verificar se role contém 'admin' ou se isAdmin é true
                if (isAdminFlag === true || isAdminFlag === 'true') {
                    return true;
                }
                
                if (role) {
                    const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                    const result = roleStr.includes('admin') || roleStr === 'admin';
                    console.log('[AgenteAutonomoInactive] Role Check Result:', result);
                    return result;
                }
                
                return false;
            } catch (error) {
                console.error('[AgenteAutonomoInactive] Erro ao verificar se usuário é admin:', error);
                return false;
            }
        },
		availableAgents() {
			if (this.isAdmin) return this.allAgents;
			if (!this.planFeatures) return this.allAgents;
			
			const features = this.planFeatures || {};
			
			// 1. Verificar se o plano tem lista explícita de agentes
			if (Array.isArray(features.agents)) {
				return this.allAgents.filter(agent => {
					const agentIdLow = agent.id.toLowerCase();
					return features.agents.some(id => id.toString().toLowerCase() === agentIdLow);
				});
			}
			
			// 2. Fallback: Se tiver a permissão global de agente autônomo, mostrar todos
			if (features.autonomous_agent === true) {
				return this.allAgents;
			}
			
			return [];
		},
		riskLevelText() {
			const labels = {
				'conservative': 'Baixo',
				'balanced': 'Médio',
				'aggressive': 'Alto',
				'fixed': 'Fixo'
			};
			return labels[this.selectedRisk] || 'Baixo';
		},
		riskBarWidth() {
			const widths = {
				'conservative': '33%',
				'balanced': '66%',
				'aggressive': '100%',
				'fixed': '10%'
			};
			return widths[this.selectedRisk] || '33%';
		},
		riskDescriptionText() {
			const descriptions = {
				'conservative': 'Recupera o valor perdido até o M5 (sexta perda). Se não conseguir, assume a perda e reseta para o valor da entrada inicial.',
				'balanced': 'Recuperação ilimitada com +15% de lucro sobre as perdas totais',
				'aggressive': 'Recuperação ilimitada com +30% de lucro sobre as perdas totais',
				'fixed': 'Entradas fixas sem progressão (Sem Martingale). Preservação máxima de capital sem recuperação agressiva.'
			};
			return descriptions[this.selectedRisk] || descriptions.conservative;
		},
		capitalTotal() {
			// Usa o balanceNumeric do mixin (se disponível) ou accountBalance da prop
			if (this.balanceNumeric !== undefined && this.balanceNumeric !== null) {
				return Number(this.balanceNumeric);
			}
			return Number(this.accountBalance) || 2500.00;
		},
		valorOperacaoNumero() {
			return Number(this.valorOperacao) || 0;
		},
		metaLucroNumero() {
			return Number(this.metaLucro) || 0;
		},
		limitePerdaNumero() {
			return Number(this.limitePerda) || 0;
		},
		percentualValorOperacao() {
			if (!this.capitalTotal || this.capitalTotal === 0) return '0.00';
			return ((this.valorOperacaoNumero / this.capitalTotal) * 100).toFixed(2);
		},
		percentualMetaLucro() {
			if (!this.capitalTotal || this.capitalTotal === 0) return '0.00';
			return ((this.metaLucroNumero / this.capitalTotal) * 100).toFixed(2);
		},
		percentualLimitePerda() {
			if (!this.capitalTotal || this.capitalTotal === 0) return '0.00';
			return ((this.limitePerdaNumero / this.capitalTotal) * 100).toFixed(2);
		}
	},
	watch: {
		valorOperacao() {
			// Atualiza automaticamente quando o valor é alterado
		},
		metaLucro() {
			// Atualiza automaticamente quando o valor é alterado
		},
		limitePerda() {
			// Atualiza automaticamente quando o valor é alterado
		}
	}
}
</script>

<style scoped>
.layout-content-agent-autonomo {
    margin: 0;
    padding: 30px 15px;
    box-sizing: border-box;
}

@media (max-width: 768px) {
    .layout-content-agent-autonomo {
        padding: 20px 0px !important;
        margin: 0 !important;
        width: 100% !important;
    }
}

.agent-config-container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-x: hidden;
}

@media (max-width: 768px) {
    .agent-config-container {
        padding: 0 10px;
    }
}

/* --- PADRÃO ZENIX v2.0: CONFIGURAÇÕES PREMIUM --- */

/* Tooltip antigo (manual) adaptado ao novo layout */
.tooltip-container {
    position: relative; 
    display: inline-block;
    cursor: help; 
    line-height: normal;
    margin-left: 4px;
}

.icon-help {
    width: 14px; 
    height: 14px;
    color: #999; 
    transition: color 0.2s;
    vertical-align: middle;
}

.icon-help:hover {
    color: #fff; 
}

.tooltip-text {
    visibility: hidden;
    opacity: 0;
    background-color: #111;
    border: 1px solid #333;
    color: #fff;
    text-align: left;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    text-transform: none; /* Mantém o texto como está no HTML (Sentence case) */
    width: 280px; /* Largura fixa maior para textos longos */
    position: absolute;
    z-index: 100; 
    top: 50%;
    right: 100%; 
    transform: translateY(-50%) translateX(-12px); 
    transition: all 0.2s ease;
    pointer-events: none; 
    white-space: normal;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    line-height: 1.4;
}

.tooltip-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}

.risk-buttons {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .risk-buttons {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 0.5rem !important;
    }
    
    .risk-btn {
        width: 100% !important;
    }
}

.config-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.config-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 2px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.config-card.premium-card {
    position: relative;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    flex: 1;
}

/* Desktop/Mobile Header Visibility */
.ai-vision-panel-desktop {
    display: block;
}

.mobile-simple-header {
    display: none;
}

.mobile-header-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    text-align: left;
}

.mobile-header-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
    line-height: 1.5;
    text-align: left;
}

@media (max-width: 768px) {
    .ai-vision-panel-desktop {
        display: none;
    }
    
    .mobile-simple-header {
        display: block;
        padding: 0;
    }
}

/* Form Styles */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-bottom: 5px;
}

.form-group input {
    margin-bottom: 0;
}

.form-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #A1A1A1;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Empurra o ícone para a direita */
    width: 100%;
    gap: 0.375rem;
    text-transform: uppercase; 
}

/* Premium Selector Field */
.premium-selector-field {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s;
}

.premium-selector-field:hover {
    border-color: #22C55E;
    background-color: #0d1a10;
}

.selector-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Prevenção de duplicação de ícones pelo FontAwesome */
.selector-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}

/* Força a exibição de apenas um elemento no wrapper de ícone */
.selector-icon-wrapper > *:not(:first-child) {
    display: none !important;
}

/* Disabled Card and Overlay for Falcon */
.agent-selection-card.disabled-card {
    cursor: pointer; /* Change from not-allowed to pointer to show it's clickable */
    filter: grayscale(0.4);
    position: relative;
    border-color: rgba(255, 255, 255, 0.05) !important;
}

.agent-selection-card.disabled-card:hover {
    transform: none !important;
    background: transparent !important;
}

.falcon-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(2px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.overlay-badge {
    background: #1C1C1C;
    border: 1px solid #22C55E;
    color: #22C55E;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}


.selector-icon-wrapper :deep(i), 
.selector-icon-wrapper :deep(svg) {
    font-size: 1.25rem;
    color: #FFFFFF !important;
    fill: #FFFFFF !important;
}

.selector-text {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.selector-title {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
}

.selector-subtitle {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.selector-arrow {
    color: #444;
    font-size: 0.875rem;
}

/* Form Select Dropdown */
.form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
}

.form-select:hover {
    border-color: #22C55E;
    background-color: #0d1a10;
}

.form-select:focus {
    outline: none;
    border-color: #22C55E;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-select option {
    background-color: #0B0B0B;
    color: #fff;
    padding: 0.5rem;
}

/* Agent Description Card */
.agent-description-card {
    margin-top: 0.75rem;
    background: linear-gradient(135deg, #0d1a10 0%, #0B0B0B 100%);
    border: 1px solid #22C55E;
    border-radius: 0.5rem;
    padding: 0.75rem;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.1);
}

.agent-desc-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.agent-desc-icon {
    width: 40px;
    height: 40px;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.agent-desc-icon i {
    font-size: 1.25rem;
    color: #fff !important;
}

.agent-desc-info {
    flex: 1;
    text-align: left;
}

.agent-desc-info h3 {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem 0;
    letter-spacing: 0.5px;
}

.agent-desc-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    font-size: 12px;
    color: #A1A1A1;
    line-height: normal;
}

.info-item strong {
    color: #DFDFDF;
    margin-right: 4px;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.2s ease;
}

.slide-fade-enter-from {
    transform: translateY(-10px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .agent-desc-icon {
        width: 36px;
        height: 36px;
    }
    
    .agent-desc-icon i {
        font-size: 1.125rem;
    }
}

/* Risk Buttons & Bar (From InvestmentIAView) */
.risk-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.risk-btn {
    padding: 0.5rem 0.25rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.7rem;
    font-weight: 500;
    color: #A1A1A1;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.risk-btn.active {
    background-color: #0A1A0A;
    color: #22C55E;
    border-color: #22C55E;
    box-shadow: 0 0 4px rgba(34, 197, 94, 0.3);
}

.risk-indicator {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 1rem;
}

.risk-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.risk-label {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.risk-level-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #22C55E;
}

.risk-bar-container {
    width: 100%;
    background-color: #0E0E0E;
    border-radius: 9999px;
    height: 0.4rem;
    margin-bottom: 0.75rem;
}

.risk-bar {
    background-color: #22C55E;
    height: 0.4rem;
    border-radius: 9999px;
    transition: width 0.3s ease;
}

.risk-description {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
    text-align: left;
}

/* Inputs */
.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}


.form-input:focus {
    border-color: #22C55E;
}

.form-help {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
    text-align: left;
    margin-top: 2px;
}

.form-help.positive { color: #22C55E; opacity: 0.9; }
.form-help.negative { color: #EF4444; opacity: 0.9; }

.loss-stoploss-row,
.value-goal-row {
    display: flex;
    gap: 1rem;
}

@media (max-width: 768px) {
    .loss-stoploss-row,
    .value-goal-row {
        flex-direction: column;
        gap: 0;
    }
}

.flex-1 { flex: 1; }

/* Blindado Wrapper */
.stoploss-blindado-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.75rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    height: 45px;
    box-sizing: border-box;
}

.stoploss-blindado-label {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.875rem;
    color: #DFDFDF;
}

.stoploss-blindado-label i { 
    color: #fff !important; 
    font-size: 1rem;
}

/* Status Toggle In-Card */
.ai-status-control-simple {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(34, 197, 94, 0.08) 100%);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
}

.ai-status-info label {
    font-size: 0.75rem !important;
    text-transform: uppercase !important;
    color: #C5C5C5 !important;
    margin: 0 !important;
}

.ai-status-subtitle {
    font-size: 0.7rem;
    color: #A1A1A1;
    margin: 0;
}

.ai-status-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.ai-status-text {
    font-size: 0.75rem;
    font-weight: bold;
    color: #A1A1A1;
}

.ai-status-text.active { color: #22C55E; }


.start-action-container {
    width: 100%;
    margin: 2rem auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    box-sizing: border-box;
    padding: 0 10px;
}

.start-agent-btn-large {
    width: 100%;
    padding: 1.25rem;
    background: #22C55E;
    color: #000;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.1rem;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.2);
}

@media (max-width: 768px) {
    .start-agent-btn-large {
        padding: 1rem;
        font-size: 1rem;
    }
    
    .config-grid {
        gap: 1rem;
    }
    
    .config-card {
        padding: 1rem;
    }
}

/* --- NOVO DESIGN: MODAL DE SELEÇÃO DE AGENTE PREMIUM (Horizontal) --- */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-content.categorized-modal {
    width: 100%;
    max-width: 800px; /* Wider for horizontal cards */
    background: rgba(13, 13, 13, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
    overflow: hidden;
    position: relative;
    backdrop-filter: blur(20px);
}

.modal-header-premium {
    padding: 2rem 2.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-header-text {
    flex: 1;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ebebeb;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
}

.modal-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
    margin: 0;
}

.modal-close-btn {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #666;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.modal-close-btn:hover {
    color: #ebebeb;
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 0 2.5rem 2.5rem;
    max-height: 75vh;
    overflow-y: auto;
}

.agents-selection-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Legacy card styles removed to avoid conflicts */

.agent-selection-card:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(34, 197, 94, 0.2);
    transform: translateY(-4px);
}

.agent-selection-card.active {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(0, 0, 0, 0.4) 100%);
    border-color: transparent; /* Selection glow handles the border */
}

/* Glassmorphism background for active card */
.agent-selection-card.active::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, rgba(34, 197, 94, 0.1), transparent 60%);
    pointer-events: none;
}

.agent-card-left {
    flex-shrink: 0;
    padding-top: 4px; /* Ajuste fino para alinhar com o texto */
}

.agent-avatar-box {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #000;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.agent-avatar-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.agent-avatar-fallback {
    font-size: 2rem;
    color: #333;
}

.agent-card-middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.agent-name-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.agent-name-premium {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ebebeb;
    margin: 0;
    letter-spacing: -0.5px;
}

.agent-profile-badge {
    font-size: 0.625rem;
    font-weight: 900;
    padding: 8px 13px;
    border-radius: 17px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.agent-profile-badge.ofensivo {
    background: rgba(34, 197, 94, 0.2);
    color: #22C55E;
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.agent-profile-badge.defensivo {
    background: rgba(161, 161, 161, 0.1);
    color: #889988;
    border: 1px solid rgba(161, 161, 161, 0.2);
}

.agent-description-premium {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
}

.agent-benefits-list {
    margin-top: 0.5rem;
}

.benefits-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #ebebeb;
    margin-bottom: 0.5rem;
}

.benefits-grid {
    display: flex; /* Mudado para flex para facilitar coluna única */
    flex-direction: column;
    gap: 6px;
}

.benefit-item-premium {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #A1A1A1;
}

.benefit-item-premium.full-width {
	width: 100%;
}

.benefit-row-inline {
	display: flex;
	align-items: center;
	gap: 15px;
	width: 100%;
}

.benefit-content {
	color: #A1A1A1;
}

.benefit-content strong {
	color: #DFDFDF;
	font-weight: 700;
	margin-right: 4px;
}

.check-icon {
    font-size: 0.8rem;
    color: #22C55E;
}

.agent-benefits-list-premium {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.agent-card-right {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1.5rem;
    min-width: 140px;
    padding-top: 4px; /* Alinhado ao topo */
}

.agent-performance-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.perf-value-premium {
    font-size: 1.25rem;
    font-weight: 800;
    color: #22C55E;
    line-height: 1;
}

.perf-label-premium {
    font-size: 0.625rem;
    color: #666;
    text-transform: uppercase;
    margin-top: 2px;
}

.agent-select-btn-premium {
	width: 100%;
	padding: 0.75rem 1rem;
	border-radius: 0.75rem;
	font-size: 0.75rem;
	font-weight: 800;
	border: 1px solid #C5A15E66;
	background: #FFFFFF05;
	color: #ebebeb;
	cursor: pointer;
	transition: all 0.2s;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.agent-selection-card:hover .agent-select-btn-premium {
    border-color: rgba(255, 255, 255, 0.2);
}

.agent-select-btn-premium.selected {
    background: #22C55E;
    border-color: #22C55E;
    color: #000;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

/* Neon Glow Effect */
.selection-glow {
    position: absolute;
    inset: -1px;
    border-radius: 12px;
    border: 1px solid #22C55E;
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
    pointer-events: none;
    z-index: 10;
}

/* --- FIX: INPUT STYLING (IMAGE 0) --- */

.form-input {
    width: 100%;
    background-color: #0B0B0B !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.5rem;
    padding: 0.625rem 0.75rem 0.625rem 2.75rem !important;
    font-size: 0.875rem;
    color: #DFDFDF !important;
    outline: none;
    transition: all 0.2s;
    height: 48px !important;
    box-sizing: border-box;
}

.form-input:focus {
    border-color: #22C55E !important;
    background-color: #0D0D0D !important;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.input-wrapper {
    position: relative;
    width: 100%;
}

.input-prefix-premium {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 0.875rem;
    pointer-events: none;
    z-index: 2;
}

/* Premium Selector Button */
.premium-selector-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    color: #ebebeb;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 48px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.premium-selector-btn:hover {
    border-color: #22C55E;
    background-color: #0d1a10;
}

.selector-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.selector-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.strategy-icons-inline {
    display: flex;
    align-items: center;
    gap: 6px;
}

.deriv-svg-icon {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
}

.deriv-svg-icon-small {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
}


.selector-left span {
    font-size: 0.875rem;
    font-weight: 500;
}

.selector-left span.placeholder {
    color: #A1A1A1;
}

.selector-arrow {
    font-size: 0.75rem;
    color: #444;
}

/* Modal Premium Styles */
.categorized-modal {
	width: 100%;
    min-width: 0;
	max-width: 700px !important;
	background: #0b0b0b !important;
	border: 1px solid #22C55E33;
	padding: 20px;
	border-radius: 12px !important;
	box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 10000000;
}

.modal-body {
    padding: 15px 10px 20px;
    max-height: 75vh;
    overflow-y: auto;
}

.modal-header-premium {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding: 0rem 0 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.modal-close-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 1.25rem;
    cursor: pointer;
    transition: color 0.2s;
}

.modal-close-btn:hover {
    color: #fff;
}

.agents-modal-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.agent-option-simple-row {
    display: flex;
    align-items: center;
    padding: 0.85rem 1rem;
    background: #111;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    gap: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
}

.agent-option-simple-row:hover {
    border-color: #22C55E66;
    background: #161616;
}

.agent-option-simple-row.active {
    border-color: #22C55E;
    background: #0d1a10;
}

.agent-option-info {
    flex: 1;
    text-align: left;
}

.agent-option-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.agent-option-check {
    color: #333;
    font-size: 1rem;
}

.agent-option-simple-row.active .agent-option-check {
    color: #22C55E;
}

/* Toggle Control */
.toggle-switch {
    width: 3.5rem;
    height: 1.75rem;
    position: relative;
    cursor: pointer;
}

.toggle-switch input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
    position: absolute;
    inset: 0;
    background: #111;
    border: 1px solid #333;
    border-radius: 99px;
    transition: 0.3s;
}

.toggle-slider:before {
    content: "";
    position: absolute;
    height: 1.25rem;
    width: 1.25rem;
    left: 3px;
    bottom: 2px;
    background: #fff;
    border-radius: 50%;
    transition: 0.3s;
}

input:checked + .toggle-slider { background: #22C55E; border-color: #22C55E; }
input:checked + .toggle-slider:before { transform: translateX(1.75rem); }

/* Fade In Animation */
.fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Responsividade */
@media (max-width: 1024px) {
    .config-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .summary-grid-new {
        grid-template-columns: 1fr;
    }
}

/* Botão de Iniciar Agente */
.start-agent-btn {
    width: 100%;
    padding: 20px;
    background-color: #22c55e;
    color: #000;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.start-agent-btn:hover {
    background-color: #1eb352;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.start-agent-btn.loading {
    opacity: 0.8;
    cursor: wait;
    transform: none;
    background-color: #1eb352;
}

.mr-2 {
    margin-right: 0.5rem;
}

.ai-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

.ai-brain-glow {
    animation: brainPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
}

@keyframes brainPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.9; }
}

@keyframes orbit1 {
    0% { transform: rotate(0deg) translateX(5rem) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(5rem) rotate(-360deg); }
}

@keyframes orbit2 {
    0% { transform: rotate(0deg) translateX(4rem) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(4rem) rotate(-360deg); }
}

@keyframes orbit3 {
    0% { transform: rotate(0deg) translateX(3rem) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(3rem) rotate(-360deg); }
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1); }
    50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2); }
}

.ai-glow-ring {
    animation: ringPulse 2s ease-in-out infinite;
}

#irazem { animation: rotate 8s linear infinite; }
#i5uptv { animation: rotate 6s linear infinite reverse; }
#iyljui { animation: orbit1 4s linear infinite; }
#isxtjr { animation: orbit2 5s linear infinite; }
#ijse57 { animation: orbit3 6s linear infinite; }

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

#iw45yh { animation: float 3s ease-in-out infinite; }
#i2cpbj { animation: float 4s ease-in-out infinite 0.5s; }
#ispbex { animation: float 3.5s ease-in-out infinite 1s; }
#i7wi6r { animation: float 4.5s ease-in-out infinite 1.5s; }

@keyframes streamRight {
    0% { left: -20px; opacity: 0; }
    50% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
}

#ivhu5o { animation: streamRight 2s linear infinite; }
#iybi4e { animation: streamRight 2.5s linear infinite 0.5s; }
#icjipi { animation: streamRight 3s linear infinite 1s; }

.hover-lift {
    transition: all 0.3s ease;
}

.hover-lift:hover {
    background: #111 !important;
    transform: translateY(-1px);
}

/* Mobile responsive adjustments for vision panel */
@media (max-width: 768px) {
    .ai-vision-header-desktop { display: none; }
    .status-cards-container { grid-template-columns: 1fr; }
    .col-span-5, .col-span-7 { grid-column: span 12 / span 12; }
}

@media (min-width: 769px) {
    .ai-vision-header-mobile { display: none; }

    .agents-modal-list {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 1rem !important;
    }
}

/* Header Mobile Styles - Matching IA View */
@media (max-width: 768px) {
    .ai-vision-header-mobile {
        display: block !important;
        margin-bottom: 0;
        background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(15, 32, 25, .3) 0, rgba(0, 1, 0, .1) 70%, transparent 100%);
        border-radius: .75rem;
        padding: 0;
    }

    .ai-vision-header-mobile h1 {
        font-size: 20px;
        font-weight: 700;
        color: #dfdfdf;
        margin-bottom: .25rem;
    }

    .ai-vision-header-mobile p {
        font-size: 12px;
        color: #a1a1a1;
        line-height: 1.5;
        text-align: left;
    }

    .ai-chip-icon-mobile {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(34, 197, 94, 0.15);
        padding: 15px;
        border-radius: 50%;
        width: auto;
        height: auto;
        margin-left: 1rem;
    }
}

.start-agent-btn:disabled, .start-agent-btn.disabled {
    background-color: #1a3a26 !important;
    color: #4a4a4a !important;
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #1c1c1c !important;
}

/* --- PREMIUM AGENT CARD STYLES --- */
.agent-card-premium {
    display: flex;
    align-items: center;
    background: #000000;
    border: 1px solid #1C1C1C;
    border-radius: 24px;
    padding: 16px 24px;
    gap: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 80px;
}

.agent-card-premium:hover {
    border-color: #333;
    background: #050505;
}

.agent-card-premium.active {
    border-color: #22C55E;
    box-shadow: 0 0 0 1px #22C55E;
}

/* Avatar Section */
.agent-avatar-container {
    flex-shrink: 0;
}

.agent-avatar-mask {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
}

.agent-video-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.agent-image-avatar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px; /* Espaço para o ícone não tocar as bordas */
}

/* Info Section */
.agent-info-premium {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.agent-title-premium {
    font-size: 18px;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0;
    line-height: 1.2;
}

.agent-subtitle-premium {
    font-size: 13px;
    color: #666666;
    margin: 2px 0 0 0;
    font-weight: 400;
}

/* Stats Section */
.agent-stats-premium {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.agent-mini-graph {
    opacity: 0.8;
}

.agent-percentage-premium {
    color: #22C55E;
    font-size: 16px;
    font-weight: 700;
}

.agent-avatar-mask-small {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
}

/* Ensure active title remains white */
.agent-card-premium.active .agent-title-premium {
    color: #FFFFFF !important;
}

/* Remove 'bolinha' overlay if it exists via pseudos */
.agent-avatar-mask::after,
.agent-avatar-mask::before {
    display: none !important;
    content: none !important;
}

/* --- NEW AGENT SELECTION MODAL STYLES (REVISED) --- */

/* --- NEW AGENT SELECTION MODAL STYLES (REFINED) --- */
.agent-selection-card {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    height: auto;
    box-sizing: border-box;
    align-items: stretch;
    margin-bottom: 0.75rem;
    padding: 1rem;
}

.agent-selection-card:hover {
    border-color: rgba(34, 197, 94, 0.5);
    background: rgba(34, 197, 94, 0.05);
    transform: translateY(-2px);
}

.agent-selection-card.active {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%);
    border-color: #22C55E;
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.2);
}

.agent-selection-card-top-row {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #333;
}

.agent-card-left-tall {
    margin-right: 0.75rem;
    flex-shrink: 0;
}

.agent-video-tall,
.agent-avatar-fallback-tall {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #000;
}

.agent-avatar-fallback-tall {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #444;
}

.agent-card-content.header-only {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
}

.agent-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.agent-name-premium {
    font-size: 1.125rem;
    font-weight: 700;
    color: #FFF;
    margin: 0;
}

.agent-description-premium {
    font-size: 0.75rem;
    color: #7d807e;
    margin: 0;
}

.agent-profile-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.05);
    color: #a1a1aa;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: auto;
}

.agent-profile-badge.ofensivo {
    background: rgba(34, 197, 94, 0.1);
    color: #22C55E;
    border-color: rgba(34, 197, 94, 0.2);
}

.agent-profile-badge.defensivo {
    background: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
    border-color: rgba(59, 130, 246, 0.2);
}

.agent-card-action {
    margin-left: 1rem;
    flex-shrink: 0;
}

.agent-performance-badget {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.perf-val {
    font-size: 1rem;
    font-weight: 700;
    color: #22C55E;
}

.perf-lbl {
    font-size: 8px;
    font-weight: 600;
    color: #52525b;
}

.agent-card-divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 0.125rem 0 0.5rem 0;
	display: none; /* Hide divider in favor of unified padding */
}

.agent-benefits-list-row {
    width: 100%;
    padding: 0;
}

.agent-benefits-list {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.benefit-item-premium {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    color: #7d807e;
}

.benefit-item-premium i {
    color: #22C55E;
    font-size: 12px;
}

.benefit-item-premium strong {
    color: #d4d4d8;
    margin-right: 2px;
}

.selection-glow {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    pointer-events: none;
    z-index: 5;
}

@media (max-width: 768px) {
    /* Modal Layout */
    .categorized-modal {
        padding: 1rem !important;
        max-width: 95% !important;
        max-height: 85vh !important;
        width: 95% !important;
    }

    .modal-header-premium {
        padding: 0 0 1rem !important;
        margin-bottom: 0 !important;
    }

    .modal-body {
        padding: 0 !important;
        max-height: calc(85vh - 70px) !important;
    }

    /* Agent Card Layout */
    .agent-selection-card {
        padding: 1rem !important;
        margin-bottom: 0.75rem !important;
    }

    .agent-selection-card-top-row {
        padding: 0 !important;
        gap: 0.75rem !important;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem !important;
        border-bottom: 1px solid #333;
    }

    .agent-video-tall,
    .agent-avatar-fallback-tall {
        width: 50px !important;
        height: 50px !important;
    }

    .agent-name-premium {
        font-size: 0.9375rem !important;
    }

    .agent-profile-badge {
        font-size: 8px !important;
        padding: 2px 6px !important;
    }

    .perf-val {
        font-size: 0.875rem !important;
    }

    .agent-card-action {
        margin-left: 0.5rem !important;
    }

    .agent-card-divider {
        margin: 0.125rem 0 0.25rem 0 !important;
    }

    .agent-benefits-list-row {
        padding: 0 0.75rem 0.5rem 0.75rem !important;
    }

    .benefit-item-premium {
        font-size: 0.6rem !important;
    }

    /* AI Vision Header Mobile */
    .ai-vision-header-mobile {
        display: block !important;
        margin-bottom: 0;
        background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(15, 32, 25, .3) 0, rgba(0, 1, 0, .1) 70%, transparent 100%);
        border-radius: .75rem;
        padding: 0;
    }

    .ai-vision-header-mobile h1 {
        font-size: 20px;
        font-weight: 700;
        color: #dfdfdf;
        margin-bottom: .25rem;
    }

    .ai-vision-header-mobile p {
        font-size: 12px;
        color: #a1a1a1;
        line-height: 1.5;
        text-align: left;
    }
}

/* Locked Agent Card State */
.agent-selection-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.7);
}

.agent-selection-card.locked:hover {
    border-color: #444 !important;
    box-shadow: none !important;
}

.lock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    z-index: 10;
    pointer-events: none;
}
</style>