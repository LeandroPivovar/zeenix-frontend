<template>
	<div class="layout-content-agent-autonomo">
		<div class="agent-config-container">
			<header class="config-header">
				<h1>
					<span class="hide-on-mobile">Configuração do </span>Agente Autônomo
				</h1>
				<p>Configure uma única vez. O agente operará todos os dias até atingir suas metas.</p>
			</header>

			<!-- AI Vision Panel -->
			<section id="ai-vision-panel" class="fade-in" style="margin-bottom: 1.5rem;">
				<div class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card glow-green ai-vision-container">
					<!-- Header Desktop -->
					<div class="mb-6 ai-vision-header-desktop">
						<div class="text-left">
							<h1 class="text-xl font-bold text-zenix-text mb-1">Painel de Configuração do Agente Autônomo</h1>
							<p class="text-sm text-zenix-secondary">Defina parâmetros de risco, metas diárias e limites. O agente opera continuamente até atingir objetivos e reinicia no próximo dia.</p>
						</div>
					</div>
					<!-- Header Mobile -->
					<div class="mb-6 ai-vision-header-mobile">
						<div class="flex items-center justify-between">
							<div class="text-left">
								<h1 class="text-xl font-bold text-zenix-text mb-1">Painel de Configuração do Agente Autônomo</h1>
								<p class="text-sm text-zenix-secondary">Defina parâmetros de risco, metas diárias e limites. O agente opera continuamente até atingir objetivos e reinicia no próximo dia.</p>
							</div>
							<div class="ai-chip-icon-mobile">
								<i class="fas fa-microchip text-[#22C55E] text-2xl"></i>
							</div>
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
								<!-- Central Brain Icon -->
								<div class="relative z-30 ai-brain-glow" style="display: flex; align-items: center; justify-content: center;">
									<i class="fas fa-brain text-zenix-green text-5xl" style="opacity: 1 !important; display: block !important; visibility: visible !important; font-size: 3rem !important;"></i>
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
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
								<div class="flex items-center gap-2 mb-2">
									<i class="fas fa-robot text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-semibold status-label">AUTONOMIA</p>
								</div>
								<p class="text-base font-bold text-white status-value">100% Autônomo</p>
								<p class="text-[10px] text-zenix-label mt-1 status-description">Opera 24/7 sem supervisão</p>
							</div>
							<!-- Card 2: CONFIGURAÇÃO -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
								<div class="flex items-center gap-2 mb-2">
									<i class="fas fa-cog text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-semibold status-label">CONFIGURAÇÃO</p>
								</div>
								<p class="text-base font-bold text-white status-value">Configure uma vez</p>
								<p class="text-[10px] text-zenix-label mt-1 status-description">Esqueça e deixe trabalhar</p>
							</div>
							<!-- Card 3: PROTEÇÃO -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
								<div class="flex items-center gap-2 mb-2">
									<i class="fas fa-shield-alt text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-semibold status-label">PROTEÇÃO</p>
								</div>
								<p class="text-base font-bold text-white status-value">Metas Automáticas</p>
								<p class="text-[10px] text-zenix-label mt-1 status-description">Para ao atingir lucro ou perda</p>
							</div>
							<!-- Card 4: CICLO DIÁRIO -->
							<div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile">
								<div class="flex items-center gap-2 mb-2">
									<i class="fas fa-sync-alt text-[#22C55E] text-lg"></i>
									<p class="text-[10px] text-white uppercase font-semibold status-label">CICLO DIÁRIO</p>
								</div>
								<p class="text-base font-bold text-white status-value">Reinício Automático</p>
								<p class="text-[10px] text-zenix-label mt-1 status-description">Volta sozinho no dia seguinte</p>
							</div>
						</div>
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
								<ZenixTooltip :offset="20"> 
									<p>Escolha o agente autônomo. Cada agente possui uma estratégia única de operação e recuperação.</p>
								</ZenixTooltip>
							</label>
							<div class="premium-selector-field" @click="showAgentSelectorModal = true">
								<div class="selector-content">
									<div 
										class="selector-icon-wrapper" 
										v-html="selectedAgent === 'sentinel' ? '<i class=\'fas fa-shield-alt\' style=\'color: white !important\'></i>' : '<i class=\'fas fa-rocket\' style=\'color: white !important\'></i>'"
									></div>
									<div class="selector-text">
										<span class="selector-title">{{ selectedAgent === 'sentinel' ? 'SENTINEL' : 'FALCON' }}</span>
										<span class="selector-subtitle">{{ getAgentDescription(selectedAgent) }}</span>
									</div>
								</div>
								<i class="fas fa-chevron-right selector-arrow"></i>
							</div>
						</div>

						<!-- Nível de Risco -->
						<div class="form-group risk-management-section">
							<label class="form-label">
								Nível de Risco
								<ZenixTooltip :offset="20"> 
									<p>Configura a estratégia de recuperação e o nível de exposição do capital.</p>
								</ZenixTooltip>
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

						<!-- Resumo da Configuração -->
						<div class="summary-section-in-card">
							<label class="form-label mb-3">Resumo da Configuração</label>
							<div class="summary-grid-new">
								<div class="summary-item-new">
									<span class="label">Agente</span>
									<span class="value">{{ selectedAgent.toUpperCase() }}</span>
								</div>
								<div class="summary-item-new">
									<span class="label">Risco</span>
									<span class="value">{{ getRiskTitle(selectedRisk) }}</span>
								</div>
								<div class="summary-item-new">
									<span class="label">Entrada</span>
									<span class="value">${{ valorOperacaoNumero.toFixed(2) }}</span>
								</div>
								<div class="summary-item-new">
									<span class="label">Meta Diária</span>
									<span class="value green">${{ metaLucroNumero.toFixed(2) }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Parâmetros Diários -->
				<div id="entry-params-card" class="config-card premium-card">
					<div class="card-content">
						<div class="form-group">
							<label class="form-label">
								Valor por operação
								<ZenixTooltip :offset="20"> 
									<p>Valor base de cada entrada realizada pelo agente.</p>
								</ZenixTooltip>
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

						<div class="form-group">
							<label class="form-label">
								Meta diária de lucro
								<ZenixTooltip :offset="20"> 
									<p>Objetivo financeiro diário. O agente para ao atingir este valor.</p>
								</ZenixTooltip>
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

						<div class="loss-stoploss-row">
							<div class="form-group flex-1">
								<label class="form-label">
									Limite de Perda
									<ZenixTooltip :offset="20"> 
										<p>Valor máximo de perda aceitável para o dia.</p>
									</ZenixTooltip>
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
									<ZenixTooltip :offset="20"> 
										<p>Proteção extra contra variações bruscas do mercado.</p>
									</ZenixTooltip>
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

						<!-- Controle do Agente -->
						<div class="form-group status-control-section">
							<div class="ai-status-control-simple">
								<div class="ai-status-info">
									<label class="form-label">Status do Agente</label>
									<p class="ai-status-subtitle">Defina os parâmetros e inicie o agente</p>
								</div>
								<div class="ai-status-toggle-wrapper">
									<span class="ai-status-text" :class="{ 'active': false }">
										Desativado
									</span>
									<label class="toggle-switch">
										<input 
											type="checkbox" 
											@change="handleToggleChange"
											:checked="false"
										>
										<span class="toggle-slider"></span>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div> <!-- End of config-grid -->
		</div> <!-- End of agent-config-container -->
			<div v-if="showAgentSelectorModal" class="modal-overlay" style="z-index: 999999 !important;" @click.self="showAgentSelectorModal = false">
				<div class="agent-selector-modal premium-card fade-in" style="z-index: 1000000 !important; pointer-events: all !important;">
					<div class="modal-header">
						<h2>Selecione o Agente</h2>
						<button class="close-btn" @click.stop.prevent="showAgentSelectorModal = false">
							<i class="fas fa-times"></i>
						</button>
					</div>
					<div class="agent-modal-list">
						<div 
							class="agent-modal-card" 
							:class="{ 'active': selectedAgent === 'sentinel' }"
							style="pointer-events: auto !important;"
							@click.stop.prevent="selectAgent('sentinel')"
						>
							<div class="agent-modal-icon">
								<i class="fas fa-shield-alt"></i>
							</div>
							<div class="agent-modal-info">
								<h3>SENTINEL</h3>
								<p>Equilíbrio perfeito entre segurança e rentabilidade. Utiliza Martingale Inteligente e Soros Nível 2.</p>
								<div class="agent-modal-tags">
									<span>Balanceado</span>
									<span>Soros L2</span>
								</div>
							</div>
						</div>
						<div 
							class="agent-modal-card" 
							:class="{ 'active': selectedAgent === 'falcon' }"
							style="pointer-events: auto !important;"
							@click.stop.prevent="selectAgent('falcon')"
						>
							<div class="agent-modal-icon">
								<i class="fas fa-rocket"></i>
							</div>
							<div class="agent-modal-info">
								<h3>FALCON</h3>
								<p>Alta precisão com foco em recuperação rápida. Ideal para traders que buscam velocidade.</p>
								<div class="agent-modal-tags">
									<span>Alta Precisão</span>
									<span>Veloz</span>
								</div>
							</div>
						</div>
					</div>
			</div>
		</div>
	</div> <!-- End of layout-content-agent-autonomo -->
</template>

<script>
import ZenixTooltip from '@/components/ZenixTooltip.vue'

export default {
	// *** MODIFICAÇÃO 2: Nome do componente corrigido ***
	name: 'AgenteAutonomoInactive',
	components: {
		ZenixTooltip
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
			selectedAgent: 'sentinel', // ✅ Novo: Agente selecionado (sentinel ou falcon)
			selectedMarket: 'volatility_75', 
			stopLossBlindado: false, 
			selectedRisk: 'balanced',
			selectedTradingMode: 'rapido', // Novo: Modo de Negociação

			// Parâmetros (Baseado na imagem)
			valorOperacao: 50.00,
			metaLucro: 100.00,
			limitePerda: 50.00,
			showAgentSelectorModal: false, // Controle do modal premium
		};
	},
	async mounted() {
		console.log('[AgenteAutonomoInactive] Componente montado. showAgentSelectorModal:', this.showAgentSelectorModal);
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

				const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
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

			// 🟢 ADICIONE ESTAS LINHAS AQUI para rolar para o topo quando o botão é clicado 🟢
			this.$nextTick(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou 'instant' se preferir sem animação
			});
		},

		// --- Métodos existentes ---
		selectAgent(agentId) {
			console.log('[AgenteAutonomoInactive] Selecionando agente:', agentId);
			this.selectedAgent = agentId;
			this.showAgentSelectorModal = false; // Garantir que o modal feche aqui também
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
				'falcon': 'Agente de alta precisão com recuperação inteligente. Foco em segurança estatística.'
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
/* --- PADRÃO ZENIX v2.0: CONFIGURAÇÕES PREMIUM --- */

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
    padding: 1.25rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.config-card.premium-card {
    position: relative;
    overflow: hidden;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Reduzindo gap de 1.25rem (20px) para 0.5rem */
}

/* Form Styles */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #A1A1A1;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    text-transform: none; /* Mantendo Inter style */
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
    gap: 0.5rem;
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

/* Summary Card Style */
.summary-grid-new {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.summary-item-new {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.75rem;
    border-radius: 0.5rem;
    text-align: left;
}

.summary-item-new .label {
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #777;
    margin-bottom: 2px;
}

.summary-item-new .value {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
}

.summary-item-new .value.green { color: #22C55E; }

/* New Refinements */
.summary-section-in-card {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

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


/* Modal Agent Selector */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.agent-selector-modal {
    width: 100%;
    max-width: 500px;
    background: #0D0D0D;
    border: 1px solid #22C55E33;
    padding: 1.5rem;
    border-radius: 1rem;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.modal-header h2 {
    font-size: 1.25rem;
    color: #fff;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 1.25rem;
    cursor: pointer;
}

.agent-modal-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.agent-modal-card {
    display: flex;
    padding: 1.25rem;
    background: #141414;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    gap: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
}

.agent-modal-card:hover, .agent-modal-card.active {
    border-color: #22C55E;
    background: #0d1a10;
}

.agent-modal-icon {
    width: 3rem;
    height: 3rem;
    background: #22C55E11;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.agent-modal-icon i, .agent-modal-icon svg {
    font-size: 1.5rem;
    color: #FFFFFF !important;
    fill: #FFFFFF !important;
}

.agent-modal-info h3 {
    font-size: 1.1rem;
    color: #fff;
    margin: 0 0 0.25rem 0;
}

.agent-modal-info p {
    font-size: 0.8rem;
    color: #A1A1A1;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
}

.agent-modal-tags {
    display: flex;
    gap: 0.5rem;
}

.agent-modal-tags span {
    font-size: 0.65rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 8px;
    border-radius: 99px;
    color: #777;
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
        flex-direction: column;
    }
    
    .summary-grid-new {
        grid-template-columns: 1fr;
    }
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
}
</style>
