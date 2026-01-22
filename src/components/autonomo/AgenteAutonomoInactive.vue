<template>
	<div class="layout-content-agent-autonomo">
		<div class="agent-config-container">

			<!-- Header Section -->
		<section class="fade-in" style="margin-bottom: 1.5rem;">
			<!-- Desktop: AI Vision Panel -->
			<div class="ai-vision-panel-desktop" style="margin-top: 2rem;">
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
			<div class="mb-6 ai-vision-header-mobile">
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
									<span class="tooltip-text">Escolha o agente autônomo que deseja usar.</span>
								</div>
							</label>
							
							<!-- Premium Selector Button -->
							<button 
								@click="openAgentSelectorModal"
								class="premium-selector-btn"
							>
								<div class="selector-content">
									<div class="selector-left">
										<div class="selector-icon-active" v-if="selectedAgent">
											<i v-if="selectedAgent === 'sentinel'" class="fas fa-shield-alt"></i>
											<i v-else-if="selectedAgent === 'falcon'" class="fas fa-rocket"></i>
											<i v-else class="fas fa-bolt"></i>
										</div>
										<span :class="{ 'placeholder': !selectedAgent }">
											{{ selectedAgent ? getAgentTitle(selectedAgent) : 'Selecione seu agente' }}
										</span>
									</div>
									<i class="fas fa-chevron-right selector-arrow"></i>
								</div>
							</button>
							
							<!-- Agent Description Card (appears when selected) -->
							<transition name="slide-fade" mode="out-in">
								<div v-if="selectedAgent" :key="selectedAgent" class="agent-description-card mt-3">
									<div class="agent-desc-content">
										<div class="agent-desc-icon">
											<i v-if="selectedAgent === 'sentinel'" class="fas fa-shield-alt" style="color: white !important;"></i>
											<i v-else-if="selectedAgent === 'falcon'" class="fas fa-rocket" style="color: white !important;"></i>
											<i v-else class="fas fa-bolt" style="color: white !important;"></i>
										</div>
										<div class="agent-desc-info">
											<h3>{{ getAgentTitle(selectedAgent).toUpperCase() }}</h3>
											<p>{{ getAgentDescription(selectedAgent) }}</p>
										</div>
									</div>
								</div>
							</transition>
						</div>

						<!-- Nível de Risco -->
						<div class="form-group risk-management-section">
							<label class="form-label">
								Nível de Risco
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
									<span class="input-prefix">$</span>
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
									<span class="input-prefix">$</span>
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
									<span class="input-prefix">$</span>
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
							<button class="start-agent-btn" @click="iniciarAgente">
								Iniciar Agente Autônomo
							</button>
						</div>
					</div>
				</div>

			</div> <!-- End of config-grid -->
		</div> <!-- End of agent-config-container -->

		<!-- Agent Selection Modal (Premium Style) -->
		<Teleport to="body">
			<div v-if="showAgentSelectorModal" class="modal-overlay" @click.self="closeAgentSelectorModal">
				<div class="modal-content categorized-modal">
					<div class="modal-header-premium">
						<h3 class="modal-title">Selecionar Agente Autônomo</h3>
						<button @click="closeAgentSelectorModal" class="modal-close-btn">
							<i class="fas fa-times"></i>
						</button>
					</div>
					<div class="modal-body">
						<div class="agents-modal-list">
							<div 
								v-for="agent in availableAgents" 
								:key="agent.id"
								class="agent-option-premium"
								:class="{ 'active': selectedAgent === agent.id }"
								@click="selectAgent(agent.id)"
							>
								<div class="agent-option-icon">
									<i :class="agent.icon"></i>
								</div>
								<div class="agent-option-info">
									<h4 class="agent-option-title">{{ agent.title }}</h4>
									<p class="agent-option-desc">{{ agent.description }}</p>
								</div>
								<div class="agent-option-check">
									<i class="fas" :class="selectedAgent === agent.id ? 'fa-check-circle' : 'fa-circle'"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Teleport>
	</div> <!-- End of layout-content-agent-autonomo -->
</template>

<script>

export default {
	// *** MODIFICAÇÃO 2: Nome do componente corrigido ***
	name: 'AgenteAutonomoInactive',
	components: {
	},
	props: {
		accountBalance: {
			type: Number,
			default: null
		},
		shouldTeleport: {
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
			selectedAgent: '', 
			selectedMarket: 'volatility_75', 
			stopLossBlindado: false, 
			selectedRisk: 'balanced',
			selectedTradingMode: 'rapido', // Novo: Modo de Negociação

			// Parâmetros (Baseado na imagem)
			valorOperacao: 20.00,
			metaLucro: 100.00,
			limitePerda: 100.00,
			showAgentSelectorModal: false,
			availableAgents: [

				{
					id: 'falcon',
					title: 'FALCON',
					icon: 'fas fa-rocket',
					description: 'Análise: Momentum Direcional (Rise/Fall)\nAssertividade: 53% a 65%\nRetorno: 92%'
				},
				{
					id: 'zeus',
					title: 'ZEUS',
					icon: 'fas fa-bolt',
					description: 'Análise: Probabilidade com Troca de Contrato\nAssertividade: 65% a 75%\nRetorno: 60% / 92%'
				}
			]
		};
	},
	async mounted() {
		console.log('[AgenteAutonomoInactive] Componente montado.');
		// Carregar configurações salvas do backend
		await this.loadSavedConfig();
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
						this.selectedMarket = symbolToMarket[config.symbol] || 'volatility_75';
					}
					if (config.riskLevel) {
						this.selectedRisk = config.riskLevel;
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

				return;
			}
			// 1. Coleta os dados configurados
			const configData = {
				// ✅ Novo: Tipo de agente selecionado
				agentType: this.selectedAgent, // 'sentinel' ou 'falcon'
				// Usa os nomes de prop que o PAI espera
				mercado: this.selectedMarket, // Enviar o ID, não o título
				risco: this.selectedRisk, // Enviar o ID, não o título
				goalValue: this.metaLucroNumero,
				stopValue: this.limitePerdaNumero,
				initialStake: this.valorOperacaoNumero,
			};

			// 2. Atualiza os valores no componente pai antes de iniciar
			if (this.$parent.goalValue !== undefined) {
				this.$parent.goalValue = this.metaLucroNumero;
			}
			if (this.$parent.stopValue !== undefined) {
				this.$parent.stopValue = this.limitePerdaNumero;
			}

			// 3. Emite o evento 'iniciar-agente' COM o objeto de dados (o payload)
			this.$emit('iniciar-agente', configData);

			// Rolar para o topo
			window.scrollTo({ top: 0, behavior: 'smooth' });
		},

		openAgentSelectorModal() {
			this.showAgentSelectorModal = true;
		},

		closeAgentSelectorModal() {
			this.showAgentSelectorModal = false;
		},

		selectAgent(agentId) {
			this.selectedAgent = agentId;
			this.closeAgentSelectorModal();
		},

		getAgentTitle(id) {
			const agent = this.availableAgents.find(a => a.id === id);
			return agent ? agent.title : 'Selecione seu agente';
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
			const map = {
				'sentinel': 'Agente completo com Martingale Inteligente e Soros Nível 2. Ideal para operações balanceadas.',
				'falcon': 'Análise: Momentum Direcional (Rise/Fall)\nAssertividade: 53% a 65%\nRetorno: 92%',
				'zeus': 'Análise: Probabilidade com Troca de Contrato\nAssertividade: 65% a 75%\nRetorno: 60% / 92%'
			};
			return map[id] || '';
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
			const value = event.target.value.replace('$', '').replace(',', '');
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				this.valorOperacao = numValue;
			}
		},
		updateMetaLucro(event) {
			const value = event.target.value.replace('$', '').replace(',', '');
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				this.metaLucro = numValue;
			}
		},
		updateLimitePerda(event) {
			const value = event.target.value.replace('$', '').replace(',', '');
			const numValue = parseFloat(value);
			if (!isNaN(numValue)) {
				this.limitePerda = numValue;
			}
		},
	},
	computed: {
		riskLevelText() {
			const labels = {
				'conservative': 'Baixo',
				'balanced': 'Médio',
				'aggressive': 'Alto'
			};
			return labels[this.selectedRisk] || 'Baixo';
		},
		riskBarWidth() {
			const widths = {
				'conservative': '33%',
				'balanced': '66%',
				'aggressive': '100%'
			};
			return widths[this.selectedRisk] || '33%';
		},
		riskDescriptionText() {
			const descriptions = {
				'conservative': 'Foco total em proteção de capital. Recuperações mais lentas e seguras.',
				'balanced': 'Equilíbrio ideal entre ganho e proteção. Recuperação moderada.',
				'aggressive': 'Máxima velocidade de recuperação. Maior exposição para acelerar lucros.'
			};
			return descriptions[this.selectedRisk] || descriptions.conservative;
		},
		capitalTotal() {
			// Usa o accountBalance da prop, ou um valor padrão se não estiver disponível
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
    padding: 30px 0px;
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
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
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
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.25rem 0;
    letter-spacing: 0.5px;
}

.agent-desc-info p {
    font-size: 0.75rem;
    color: #A1A1A1;
    line-height: 1.5;
    margin: 0;
    white-space: pre-line;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.risk-btn {
    padding: 0.5rem 0.75rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #A1A1A1;
    cursor: pointer;
    transition: all 0.2s;
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

.input-prefix {
    position: absolute;
    left: 0;
    top: 0;
    width: 2.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #DFDFDF;
    font-size: 0.95rem;
    pointer-events: none;
    line-height: normal;
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

.loss-stoploss-row {
    display: flex;
    gap: 1rem;
}

.value-goal-row {
    display: flex;
    gap: 1rem;
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
    max-width: 100%;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.start-agent-btn-large {
    width: 100%;
    max-width: 600px;
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

.start-agent-btn-large:hover {
    background: #1eb352;
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(34, 197, 94, 0.4);
}

.start-disclaimer-center {
    font-size: 0.75rem;
    color: #666;
    font-style: italic;
    text-align: center;
}

.form-input {
    width: 100%;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 0.625rem 0.75rem 0.625rem 1.75rem;
    font-size: 0.875rem;
    color: #DFDFDF;
    outline: none;
    transition: border-color 0.2s;
    height: 45px; /* Standardizing height to match Stoploss */
    box-sizing: border-box;
}


/* Premium Selector Button */
.premium-selector-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    height: 45px;
    box-sizing: border-box;
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

.selector-icon-active {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #22C55E;
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
    max-width: 800px;
    background: #0D0D0D;
    border: 1px solid #22C55E33;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.modal-header-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
    font-size: 1.1rem;
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

.agent-option-premium {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #111;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.agent-option-premium:hover {
    border-color: #22C55E66;
    background: #161616;
}

.agent-option-premium.active {
    border-color: #22C55E;
    background: #0d1a10;
}

.agent-option-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(34, 197, 94, 0.1);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.agent-option-icon i,
.agent-option-icon svg,
.agent-option-icon path {
    font-size: 1.25rem;
    color: #FFFFFF !important;
    fill: #FFFFFF !important;
    stroke: #FFFFFF !important;
}

.agent-option-info {
    flex: 1;
    text-align: left;
}

.agent-option-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.125rem 0;
}

.agent-option-desc {
    font-size: 0.75rem;
    color: #A1A1A1;
    margin: 0;
    line-height: 1.3;
}

.agent-option-check {
    color: #333;
    font-size: 1rem;
}

.agent-option-premium.active .agent-option-check {
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

@media (max-width: 600px) {
    .loss-stoploss-row {
        /* Kept horizontal (side-by-side) as requested */
    }
    
    .value-goal-row {
        flex-direction: column;
    }
    
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
</style>
