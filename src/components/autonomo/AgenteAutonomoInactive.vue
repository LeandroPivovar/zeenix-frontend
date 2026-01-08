<template>
	<Teleport to="#master-trader-portal-target" :disabled="!shouldTeleport">
		<div class="layout-content-agent-autonomo">
		<div class="agent-config-container">
			<header class="config-header">
				<h1>
					<span class="hide-on-mobile">Configuração do </span>Agente Autônomo
				</h1>
				<p>Configure uma única vez. O agente operará todos os dias até atingir suas metas.</p>
			</header>
			<div class="container-sections">
				<!-- Versão Desktop: Seções separadas -->


				<!-- ✅ NOVO: Seção de Seleção de Agente Autônomo -->
				<section class="config-section hide-on-mobile">
					<h2 class="section-with-tooltip">
						Agentes Disponíveis
						<div class="tooltip-container">
							<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10"></circle>
								<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
								<line x1="12" y1="17" x2="12.01" y2="17"></line>
							</svg>
							<span class="tooltip-text">Escolha o agente autônomo que deseja usar.</span>
						</div>
					</h2>
					
					<div class="agent-options options-grid">
						<div 
							class="option-card"
							:class="{ 'selected': selectedAgent === 'sentinel' }"
							@click="selectAgent('sentinel')"
							title="Agente SENTINEL - Martingale Inteligente e Soros"
						>
							<h3>🛡️ SENTINEL</h3>
							<p>Agente completo com Martingale Inteligente e Soros Nível 2. Ideal para operações balanceadas.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedAgent === 'falcon' }"
							@click="selectAgent('falcon')"
							title="Agente FALCON - Alta Precisão e Recuperação Inteligente"
						>
							<h3>🦅 FALCON</h3>
							<p>Agente de alta precisão com recuperação inteligente. Foco em segurança estatística.</p>
						</div>
					</div>
				</section>

				<section class="config-section risk-section hide-on-mobile">
					<h2>Nível de Risco</h2>
					<div class="risk-options">
						<div 
							class="option-card"
							:class="{ 'selected': selectedRisk === 'conservative' }"
							@click="selectRisk('conservative')"
							title="Selecione o seu perfil de risco."
						>
							<h3>Conservador</h3>
							<p>Baixo risco, retornos estáveis</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedRisk === 'balanced' }"
							@click="selectRisk('balanced')"
							title="Selecione o seu perfil de risco."
						>
							<h3>Conservador</h3>
							<p>Risco moderado, bom equilíbrio</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedRisk === 'aggressive' }"
							@click="selectRisk('aggressive')"
							title="Selecione o seu perfil de risco."
						>
							<h3>Agressivo</h3>
							<p>Alto risco, maiores retornos</p>
						</div>
					</div>
				</section>

				<!-- Versão Mobile: Card unificado para Agente, Mercado, Estratégia e Risco -->
				<div class="mobile-unified-card premium-card">
					<!-- ✅ NOVO: Selecione o Agente Autônomo -->
					<div class="mobile-section">
						<p class="mobile-section-label">Agente Autônomo</p>
						<select v-model="selectedAgent" class="mobile-select">
							<option value="sentinel">🛡️ SENTINEL - Martingale Inteligente e Soros</option>
							<option value="falcon">🦅 FALCON - Alta Precisão e Recuperação</option>
						</select>
						<p class="mobile-section-description">{{ getAgentDescription(selectedAgent) }}</p>
					</div>

					<!-- Divisor -->
					<div class="mobile-divider"></div>
					
					<!-- Selecione o Mercado -->
					<div class="mobile-section">
						<p class="mobile-section-label">Selecione o Mercado</p>
						<select v-model="selectedMarket" class="mobile-select">
							<option value="volatility_10">Volatility 10 Index</option>
							<option value="volatility_25">Volatility 25 Index</option>
							<option value="volatility_50">Volatility 50 Index</option>
							<option value="volatility_75">Volatility 75 Index</option>
							<option value="volatility_100">Volatility 100 Index</option>
						</select>
						<p class="mobile-section-description">{{ getMarketDescription(selectedMarket) }}</p>
					</div>

					<!-- Divisor -->
					<div class="mobile-divider"></div>

					<!-- Gerenciamento de Risco -->
					<div class="mobile-section">
						<p class="mobile-section-label">Gerenciamento de Risco</p>
						<div class="mobile-risk-buttons">
							<button 
								class="mobile-risk-btn"
								:class="{ 'active': selectedRisk === 'conservative' }"
								@click="selectRisk('conservative')"
							>
								<span class="mobile-risk-btn-bg" v-if="selectedRisk === 'conservative'"></span>
								<span class="mobile-risk-btn-text" :class="{ 'active-text': selectedRisk === 'conservative' }">Conservador</span>
							</button>
							<button 
								class="mobile-risk-btn"
								:class="{ 'active': selectedRisk === 'balanced' }"
								@click="selectRisk('balanced')"
							>
								<span class="mobile-risk-btn-bg" v-if="selectedRisk === 'balanced'"></span>
								<span class="mobile-risk-btn-text" :class="{ 'active-text': selectedRisk === 'balanced' }">Conservador</span>
							</button>
							<button 
								class="mobile-risk-btn"
								:class="{ 'active': selectedRisk === 'aggressive' }"
								@click="selectRisk('aggressive')"
							>
								<span class="mobile-risk-btn-bg" v-if="selectedRisk === 'aggressive'"></span>
								<span class="mobile-risk-btn-text" :class="{ 'active-text': selectedRisk === 'aggressive' }">Agressivo</span>
							</button>
						</div>
					</div>
				</div>
				<div class="footer-section">
					<section class="config-section daily-params-section">
						<h2>Parâmetros Diários</h2>
						<div class="daily-params-grid">
							<div class="param-input-group">
								<h3>Valor por operação</h3>
								<input 
									type="number" 
									v-model.number="valorOperacao" 
									class="input-editable"
									min="0.01"
									step="0.01"
								>
								<p class="param-percentage-text">{{ percentualValorOperacao }}% do capital total</p>
							</div>
							<div class="param-input-group">
								<h3>Meta diária de lucro</h3>
								<input 
									type="number" 
									v-model.number="metaLucro" 
									class="input-editable"
									min="0.01"
									step="0.01"
								>
								<p class="param-percentage-text positive">{{ percentualMetaLucro }}% do capital total</p>
							</div>
							<div class="loss-control-row">
								<div class="param-input-group loss-input-half">
									<h3 class="section-with-tooltip">
										Limite de Perda
										<div class="tooltip-container">
											<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<circle cx="12" cy="12" r="10"></circle>
												<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
												<line x1="12" y1="17" x2="12.01" y2="17"></line>
											</svg>
											<span class="tooltip-text">Valor máximo de perda diária.</span>
										</div>
									</h3>
									<input 
										type="number" 
										v-model.number="limitePerda" 
										class="input-editable"
										min="0.01"
										step="0.01"
									>
									<p class="param-percentage-text negative">-{{ percentualLimitePerda }}% do saldo</p>
								</div>
								
								<div class="param-input-group loss-input-half">
									<h3 class="section-with-tooltip">
										Stoploss Blindado
										<div class="tooltip-container">
											<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<circle cx="12" cy="12" r="10"></circle>
												<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
												<line x1="12" y1="17" x2="12.01" y2="17"></line>
											</svg>
											<span class="tooltip-text">Proteção extra contra perdas consecutivas.</span>
										</div>
									</h3>
									<div class="blindado-card">
										<div class="blindado-info">
											<svg class="icon-shield" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
											</svg>
											<span class="blindado-status-text">
												{{ stopLossBlindado ? 'Ativado' : 'Desativado' }}
											</span>
										</div>
										<label class="toggle-switch-small">
											<input 
												type="checkbox" 
												v-model="stopLossBlindado"
											>
											<span class="slider-small"></span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section class="config-section summary-section">
						<h2>Resumo da Configuração</h2>
						<div class="summary-grid">
							<div class="summary-item market-item">
								<img src="../../assets/icons/stats-green.svg" alt="" width="15px" class="icon-sumary-risk">
								<div class="summary-item-value">
									<span>Mercado</span>
									<strong>{{ getMarketTitle(selectedMarket) }}</strong>
								</div>
							</div>
							<div class="summary-item value-per-op">
								<svg class="icon-value-op" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 8.44c-.58 0-1.2-.35-1.78-.9-.67-.62-1.3-.77-2.02-.77-1.15 0-2.08.76-2.08 1.96 0 1.25.75 1.83 2.05 2.5.9.48 1.77.8 2.37 1.15 1.4.82 2.3 1.8 2.3 3.3 0 1.8-1.1 2.8-2.6 2.8-.82 0-1.6-.26-2.4-.76-.73-.46-1.5-.7-2.15-.7"></path><path d="M12 4v16"></path></svg>
								<div class="summary-item-value">
									<span>Valor por operação</span>
									<strong>${{ valorOperacaoNumero.toFixed(2) }}</strong>
								</div>
							</div>
							<div class="summary-item daily-goal">
								<span class="icon-sumary-risk icon-green ">↑</span> 
								<div class="summary-item-value">
									<span>Meta diária</span>
									<strong>${{ metaLucroNumero.toFixed(2) }}</strong>
								</div>
							</div>
							<div class="summary-item risk-item">
								<svg class="icon-summary-risk icon-green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-6"></path><path d="M17 12h5l-1-4h-5z"></path><path d="M7 12H2l1-4h5z"></path><path d="M12 2L9 6h6z"></path><path d="M19 19c-3.3 0-6 2-6 3h6"></path><path d="M5 19c3.3 0 6 2 6 3H5"></path></svg>
								<div class="summary-item-value">
									<span>Nível de risco</span>
									<strong>{{ getRiskTitle(selectedRisk) }}</strong>
								</div>
							</div>
							<div class="summary-item daily-loss">
								<span class="icon-sumary-risk icon-green">↓</span> 
								<div class="summary-item-value">
									<span>Limite de perda</span>
									<strong>${{ limitePerdaNumero.toFixed(2) }}</strong>
								</div>
							</div>
							<div class="summary-item blindado-item">
								<svg class="icon-summary-risk icon-green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
									<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
								</svg>
								<div class="summary-item-value">
									<span>Stoploss Blindado</span>
									<strong :class="{ 'text-active': stopLossBlindado, 'text-inactive': !stopLossBlindado }">
										{{ stopLossBlindado ? 'Ativo' : 'Inativo' }}
									</strong>
								</div>
							</div>

						</div>
						<button class="start-button" @click="iniciarAgente">
							INICIAR AGENTE
						</button>
						<footer class="config-footer">
							<p class="footer-text">
								Ao iniciar, você concorda que o agente operará de forma autônoma
								até que a meta diária seja atingida ou o limite de perda seja alcançado.
							</p>
						</footer>
					</section>

				</div>
				
				<!-- Parâmetros de Entrada - Mobile -->
				<section class="config-section mobile-params-section">
					<div class="premium-card mobile-params-card">
						<p class="mobile-params-title">Parâmetros de Entrada</p>
						<div class="mobile-params-grid">
							<div class="mobile-param-group">
								<label class="mobile-param-label">Valor por operação</label>
								<input 
									type="text" 
									:value="'$' + valorOperacaoNumero.toFixed(2)"
									@input="updateValorOperacao"
									class="mobile-param-input"
								>
								<p class="mobile-param-percentage">{{ percentualValorOperacao }}% do capital total</p>
							</div>
							<div class="mobile-param-group">
								<label class="mobile-param-label">Meta diária de lucro</label>
								<input 
									type="text" 
									:value="'$' + metaLucroNumero.toFixed(2)"
									@input="updateMetaLucro"
									class="mobile-param-input"
								>
								<p class="mobile-param-percentage positive">+{{ percentualMetaLucro }}% do capital total</p>
							</div>
							<div class="mobile-param-group">
								<label class="mobile-param-label">Limite de perda diário</label>
								<input 
									type="text" 
									:value="'$' + limitePerdaNumero.toFixed(2)"
									@input="updateLimitePerda"
									class="mobile-param-input"
								>
								<p class="mobile-param-percentage negative">-{{ percentualLimitePerda }}% do capital total</p>
							</div>
						</div>
					</div>
				</section>

				<!-- Status do Agente - Apenas Mobile -->
				<section class="config-section agent-status-mobile">
					<div class="premium-card status-card">
						<div class="status-content">
							<div class="status-text">
								<p class="status-label">STATUS DO AGENTE</p>
								<p class="status-value">Desativado</p>
							</div>
							<label class="toggle-switch">
								<input 
									type="checkbox" 
									@change="handleToggleChange"
									:checked="false"
								>
								<span class="slider"></span>
							</label>
						</div>
						<p class="status-message">O AGENTE está desativado. Ative para começar.</p>
					</div>
				</section>

			</div>
		</div>
		
		</div>
	</Teleport>
</template>

<script>
export default {
	// *** MODIFICAÇÃO 2: Nome do componente corrigido ***
	name: 'AgenteAutonomoInactive', // Era 'AgenteAutonomoView'
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
		};
	},
	async mounted() {
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
			this.selectedAgent = agentId;
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
				'balanced': 'Conservador',
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
		}
	},
	computed: {
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
/* 2. Títulos e cabeçalho */
.config-header h1 {
	font-size: 1.8em;
	margin-bottom: 5px;
	text-align: left;
	color: white;
	font-weight: 600;
}
.config-header p {
	color: #b0b0b0;
	font-size: 0.9em;
	padding: 10px;
	text-align: left;
}

.container{
	padding: 0px;
}

.container-sections{
	display: flex;
	flex-direction: column;
	gap: 20px !important;
	padding: 0px;
	margin-top: 0;
}


.config-section h2 {
	font-size: 1.1em;
	margin-bottom: 15px;
	font-weight: 500;
	color: #e0e0e0;
	text-align: left;
}

section{

	padding: 20px;
	border-radius: 12px;
}

.config-section h3{
	color: white;
}

/* 🟢 ESTILOS DO TOOLTIP CUSTOMIZADO (POSICIONAMENTO CORRIGIDO) 🟢 */

.section-with-tooltip {
	display: flex;
	align-items: center;
	/* Empurra 'Mercado' para a esquerda e o ícone para a direita */
	justify-content: space-between; 
	/* Aumenta o padding superior para garantir espaço para o tooltip */
	padding-top: 25px; 
	padding-right: 10px; 
	/* Ajusta a margem superior para compensar o padding */
	margin-top: -25px; 
}

/* 1. Contêiner para posicionamento relativo */
.tooltip-container {
	position: relative; 
	display: inline-block;
	cursor: help; 
}

/* 2. Estilo do ícone */
.icon-help {
	width: 16px; 
	height: 16px;
	color: #999; 
	transition: color 0.2s;
}

.icon-help:hover {
	color: #fff; 
}

/* 3. Estilo e visibilidade do texto do tooltip (POSIÇÃO CORRIGIDA) */
.tooltip-text {
	visibility: hidden;
	opacity: 0;
	
	background-color: #333;
	color: #fff;
	text-align: center;
	padding: 5px 8px;
	border-radius: 4px;
	font-size: 0.8em;
	width: max-content; 

	position: absolute;
	z-index: 10; 
	/* Ajuste para aparecer à esquerda e alinhado verticalmente com o ícone */
	top: 50%; /* Alinha o meio do tooltip ao meio do container */
	right: 100%; /* Inicia 100% à direita do container (ícone) */
	transform: translateY(-50%) translateX(-10px); /* Centraliza verticalmente e adiciona espaço */
	
	transition: opacity 0.3s;
	pointer-events: none; 
	white-space: nowrap; 
}

/* 4. Mostrar o tooltip ao passar o mouse */
.tooltip-container:hover .tooltip-text {
	visibility: visible;
	opacity: 1;
}

/* FIM DOS ESTILOS DO TOOLTIP CUSTOMIZADO */


/* 3. Cards de Opção (Mercado, Estratégia, Risco) */
.options-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr); 
	gap: 12px;
}
.strategies-options {
	grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1200px) {
	.options-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 800px) {
	.options-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

.icon-sumary-risk{
	margin-right: 10px;
	color: #00ff66;
}

span.icon-sumary-risk{
	font-size: 25px;
	color: #045826;
}

.risk-options {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
}
.option-card {
	background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
	border: 1px solid #333;
	padding: 15px 15px;
	border-radius: 6px;
	transition: all 0.2s;
	cursor: pointer;
	min-height: 90px;
	display: flex;
	flex-direction: column;
	text-align: left;
}
/* Estilo Hover */
.option-card:hover:not(.selected) {
	border-color: #555;
	background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
}
/* Estilo Selecionado: Fundo preto e borda verde */
.option-card.selected {
	border: 1px solid #00ff66; 
	background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
}
.option-card h3 {
	font-size: 0.95em;
	font-weight: 600;
	margin-bottom: 10px;
	margin-top: 5px;
}
.option-card p {
	font-size: 0.8em;
	color: #999;
	line-height: 1.3;
}

.risk-options .option-card {
	text-align: center;
	align-items: center;
	justify-content: center;
}


.risk-options .option-card h3 {
	margin-top: 5px; 
}

/* 4. Parâmetros Diários */
.daily-params-section {
	width: 100%;
	max-width: 600px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	padding: 25px;
	border: 1px solid #333;
	border-radius: 6px;
	background: transparent !important;
}

.daily-params-grid {
	display: flex;
	flex-direction: column;
	gap: 20px;
	width: 100%;
}

/* Ajustes para telas até 1024px - tamanhos mais iguais */
@media (max-width: 1024px) {
	.footer-section {
		gap: 30px;
	}

	.daily-params-section {
		width: 100%;
		max-width: 100%;
		flex: 1;
		padding: 20px;
	}

	.summary-section {
		width: 100%;
		max-width: 100%;
		flex: 1;
		padding: 20px;
	}

	.summary-grid {
		gap: 15px 20px;
		margin: 8px;
	}

	.daily-params-grid {
		gap: 15px;
	}

	section {
		padding: 15px;
	}

	.config-section h2 {
		margin-bottom: 12px;
	}

	.options-grid {
		gap: 10px;
	}

	.risk-options {
		gap: 10px;
	}

	.option-card {
		padding: 12px 15px;
		min-height: 85px;
	}
}

/* Ajustes para telas menores que 1400px */
@media (min-width: 1025px) and (max-width: 1400px) {
	.footer-section {
		gap: 40px;
	}

	.summary-grid {
		gap: 20px 25px;
		margin: 8px;
	}

	.daily-params-section {
		flex: 1;
		max-width: none;
	}

	.daily-params-grid {
		gap: 15px;
	}

	section {
		padding: 15px;
	}

	.daily-params-section {
		flex: 1;
		max-width: none;
		padding: 20px;
	}

	.summary-section {
		padding: 20px;
		flex: 1;
		max-width: none;
	}

	.config-section h2 {
		margin-bottom: 12px;
	}

	.options-grid {
		gap: 10px;
	}

	.risk-options {
		gap: 10px;
	}

	.option-card {
		padding: 12px 15px;
		min-height: 85px;
	}
}

/* Ajustes para telas menores que 1200px - evitar conflitos */
@media (max-width: 1200px) {
	.footer-section {
		flex-direction: column;
		gap: 30px;
	}

	.daily-params-section {
		width: 100%;
		max-width: 100%;
	}

	.daily-params-grid {
		max-width: 100%;
		min-width: 100%;
	}

	.summary-section {
		width: 100%;
		max-width: 100%;
	}

	.summary-grid {
		grid-template-columns: 1fr 1fr;
		gap: 15px 20px;
	}

	.options-grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.strategies-options {
		grid-template-columns: repeat(2, 1fr);
	}

	.risk-options {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1600px){
	.daily-params-section {
		flex: 1;
		max-width: none;
		min-width: 0;
		padding: 20px;
	}

	.summary-section {
		flex: 1;
		max-width: none;
		padding: 20px;
	}

	.footer-text{
		width: 90%;
		margin-right: 100px;
	}
}
.param-input-group h3 {
	font-size: 0.8em;
	color: #999;
	margin-bottom: 8px;
	font-weight: 500;
}

.param-input-group {
	width: 100%;
	text-align: left;
}



/* ESTILO PARA O INPUT EDITÁVEL */
.input-editable {
	background-color: #1a1a1a;
	border: 1px solid #333;
	padding: 10px 12px;
	border-radius: 4px;
	font-size: 1.0em;
	font-weight: bold;
	text-align: left;
	color: #fff;
	height: 40px; 
	line-height: 20px;
	width: 100%;
	box-sizing: border-box; 
	
	/* Remoção dos botões padrão do input type="number" */
	-moz-appearance: textfield; 
	appearance: textfield;
}

/* Remoção dos botões padrão do input type="number" no Chrome/Safari/Edge */
.input-editable::-webkit-outer-spin-button,
.input-editable::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* 5. Resumo da Configuração */
.summary-section {
	padding: 25px;
	margin: 0;
	display: flex;
	flex-direction: column;
	max-width: 800px;
	width: 100%;
	border: 1px solid #333;
	border-radius: 6px;
	background: transparent !important;
}

.summary-grid {
	margin: 10px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px 40px;
}
.summary-item {
	display: flex;
	align-items: center;
	font-size: 0.9em;
	text-align: left;
	width: 100%;
	justify-content: flex-start;
}

/* Novo container para o texto e valor */
.summary-item-value {
	display: flex; 
	align-items: center;
	width: 100%;
}

/* Estilos para a coluna da direita (Valores) */
.summary-item.value-per-op, 
.summary-item.daily-goal, 
.summary-item.daily-loss {
	max-width: 200px;
}

/* Ajuste de ícones no resumo */
.summary-item svg, .summary-item i {
	width: 16px; 
	height: 16px;
	color: #00ff66; 
	margin-right: 10px;
}
.summary-item span {
	margin-right: 5px;
	white-space: nowrap;
	color: #858585;
}
.summary-item strong {
	font-weight: bold;
	color: #fff;
	white-space: nowrap;
}

.summary-item-value{
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	text-align: left;
}

.icon-green{
	color: #00ff66!important;
}
/* Força a quebra de linha para o resumo em telas menores */
@media (max-width: 700px) {
	.summary-grid {
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.summary-item.value-per-op, 
	.summary-item.daily-goal, 
	.summary-item.daily-loss {
		justify-content: flex-start; 
	}
}

.footer-section{
	display: flex;
	width: 100%;
	gap: 20px !important;
	align-items: stretch;
	justify-content: flex-start;
	padding: 0 20px 20px 20px;
}

/* Ajustes para telas até 1024px - tamanhos mais iguais */
@media (max-width: 1024px) {
	.footer-section {
		gap: 30px;
	}
	
	.daily-params-section,
	.summary-section {
		flex: 1;
		min-width: 0;
	}
}

@media (min-width: 1025px) and (max-width: 1400px) {
	.footer-section {
		gap: 40px;
	}
}

@media (min-width: 1400px) {
	.footer-section {
		gap: 60px;
	}
	
	.daily-params-section,
	.summary-section {
		flex: 1;
		max-width: none;
	}
}

@media (min-width: 1600px) {
	.footer-section {
		gap: 100px;
	}
}

/* 6. Botão */
.start-button {
	width: 100%;
	padding: 15px;
	background-color: #22C55E;
	color: #000000;
	border: none;
	border-radius: 8px;
	font-size: 1.0em;
	font-weight: bold;
	cursor: pointer;
	letter-spacing: 1px;
	transition: background-color 0.2s;
	margin-top: 20px; /* Adicionado para separar do Resumo */
	max-width: 550px;
	margin-right: auto;
}
.start-button:hover {
	background-color: #1ca14d;
}


/* 7. Rodapé */
.config-footer {
	text-align: center;
	font-size: 0.9em;
	color: #888;
	
	padding: 10px 20px;
	line-height: 1.4;
	display: flex;
	justify-content: center;
}

.footer-text{
	width: 90%;
	text-align: center;
	margin-top: 10px;
	font-size: 1.0em;
}

@media (max-width: 600px) {
	.daily-params-grid {
		flex-direction: column;
		gap: 15px;
	}
}


/* 🟢 INÍCIO: Estilos e Lógica Mobile 🟢 */

/* Textos de porcentagem - Desktop */
.param-percentage-text {
	font-size: 0.8em;
	margin-top: 5px;
	color: #999;
}

.param-percentage-text.positive {
	color: #22C55E;
}

.param-percentage-text.negative {
	color: #f14d4d;
}

/* Status do Agente - Apenas Mobile */
.agent-status-mobile {
	display: none;
}

/* Card Unificado Mobile */
.mobile-unified-card {
	display: none;
}

/* Seções Mobile */
.mobile-section {
	margin-bottom: 0;
}

.mobile-section-label {
	font-size: 12px;
	font-weight: 500;
	color: #9CA3AF;
	margin-bottom: 8px;
	text-align: left;
}

.mobile-select {
	width: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	border: 1px solid #1C1C1C;
	border-radius: 12px;
	padding: 12px 16px;
	color: #FFFFFF;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.3s ease;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
	background-repeat: no-repeat;
	background-position: right 12px center;
	background-size: 1.2em;
	padding-right: 40px;
}

.mobile-select:focus {
	outline: none;
	border-color: #22C55E;
}

.mobile-section-description {
	font-size: 12px;
	color: #9CA3AF;
	margin-top: 12px;
	margin-bottom: 20px;
	line-height: 1.5;
	text-align: left;
}

.mobile-divider {
	border-top: 1px solid #1C1C1C;
	padding-top: 20px;
	margin-top: 20px;
}


/* Botões Gerenciamento de Risco Mobile */
.mobile-risk-buttons {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8px;
}

.mobile-risk-btn {
	height: 44px;
	border-radius: 10px;
	background: rgba(14, 14, 14, 0.9);
	border: 1px solid #1C1C1C;
	color: #FFFFFF;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	cursor: pointer;
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.mobile-risk-btn:active {
	opacity: 0.9;
}

.mobile-risk-btn.active {
	background: linear-gradient(to bottom, #000000, #0A1A0A);
	border: 1px solid rgba(34, 197, 94, 0.35);
	box-shadow: 0 0 12px rgba(34, 197, 94, 0.15);
}

.mobile-risk-btn-bg {
	position: absolute;
	inset: 0;
	background: rgba(34, 197, 94, 0.05);
	filter: blur(12px);
	z-index: 1;
}

.mobile-risk-btn-text {
	position: relative;
	z-index: 10;
	color: #FFFFFF;
}

.mobile-risk-btn-text.active-text {
	color: #22C55E;
	text-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

/* Parâmetros de Entrada Mobile */
.mobile-params-section {
	display: none;
}

.mobile-params-section .premium-card {
	padding: 16px;
	border-radius: 16px;
	margin-bottom: 0; /* Remove margin do card pois a seção já tem */
	background: linear-gradient(135deg, rgba(10, 15, 10, 0.92) 0%, rgba(11, 11, 11, 0.94) 50%, rgba(8, 13, 8, 0.92) 100%);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: none;
	box-shadow: 0 0 1px 0 rgba(34, 197, 94, 0.08) inset, 0 8px 32px rgba(0, 0, 0, 0.6), 0 16px 64px rgba(0, 0, 0, 0.4);
	position: relative;
	outline: 1px solid rgba(34, 197, 94, 0.04);
	outline-offset: -1px;
}

.mobile-params-section .premium-card::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
	opacity: 1;
	pointer-events: none;
	z-index: 1;
}

.mobile-params-section .premium-card::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
	opacity: 0.6;
	pointer-events: none;
	z-index: 0;
}

.mobile-params-section .premium-card > * {
	position: relative;
	z-index: 2;
}

.mobile-params-title {
	font-size: 16px;
	font-weight: 600;
	color: #FFFFFF;
	margin-bottom: 16px;
	text-align: left;
}

.mobile-params-grid {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.mobile-param-group {
	width: 100%;
}

.mobile-param-label {
	display: block;
	font-size: 12px;
	color: #9CA3AF;
	margin-bottom: 8px;
	text-align: left;
}

.mobile-param-input {
	width: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	border: 1px solid #1C1C1C;
	border-radius: 8px;
	padding: 12px 16px;
	color: #FFFFFF;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.3s ease;
}

.mobile-param-input:focus {
	outline: none;
	border-color: #22C55E;
}

.mobile-param-percentage {
	font-size: 10px;
	color: #9CA3AF;
	margin-top: 4px;
	font-style: italic;
	text-align: left;
}

.mobile-param-percentage {
	color: #999;
}

.mobile-param-percentage.positive {
	color: #22C55E;
}

.mobile-param-percentage.negative {
	color: #f14d4d;
}

.agent-status-mobile .premium-card {
	padding: 16px;
	border-radius: 16px;
	margin-bottom: 0; /* Remove margin do card pois a seção já tem */
	background: linear-gradient(135deg, rgba(10, 15, 10, 0.92) 0%, rgba(11, 11, 11, 0.94) 50%, rgba(8, 13, 8, 0.92) 100%);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: none;
	box-shadow: 0 0 1px 0 rgba(34, 197, 94, 0.08) inset, 0 8px 32px rgba(0, 0, 0, 0.6), 0 16px 64px rgba(0, 0, 0, 0.4);
	position: relative;
	outline: 1px solid rgba(34, 197, 94, 0.04);
	outline-offset: -1px;
}

.agent-status-mobile .premium-card::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
	opacity: 1;
	pointer-events: none;
	z-index: 1;
}

.agent-status-mobile .premium-card::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
	opacity: 0.6;
	pointer-events: none;
	z-index: 0;
}

.agent-status-mobile .premium-card > * {
	position: relative;
	z-index: 2;
}

.status-card h2 {
	font-size: 1.1em;
	margin-bottom: 15px;
	font-weight: 500;
	color: #e0e0e0;
	text-align: left;
	margin: 0;
}

.status-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 10px;
	width: 100%;
}

.status-text {
	flex: 1;
}

.status-value {
	font-size: 1.3em;
	font-weight: bold;
	color: #fff;
	margin: 0 0 10px 0;
}

.status-message {
	font-size: 0.9em;
	color: #ff4444;
	margin: 0;
	line-height: 1.5;
}

/* Toggle Switch */
.toggle-switch {
	position: relative;
	display: inline-block;
	width: 50px;
	height: 28px;
	flex-shrink: 0;
}

.toggle-switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #2a3a4a;
	transition: background-color 0.3s ease;
	border-radius: 28px;
}

.slider:before {
	position: absolute;
	content: "";
	height: 20px;
	width: 20px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	transition: transform 0.3s ease;
	border-radius: 50%;
}

.toggle-switch input:checked + .slider {
	background-color: #22C55E;
}

.toggle-switch input:checked + .slider:before {
	transform: translateX(22px);
}

.toggle-switch input:focus + .slider {
	box-shadow: 0 0 1px #22C55E;
}

/* 1. Estilo do Select (para combinar com o tema) */
.select-mobile {
	width: 100%;
	background-color: #1a1a1a;
	border: 1px solid #333;
	padding: 10px 12px;
	border-radius: 8px;
	font-size: 1.0em;
	font-weight: bold;
	color: #fff;
	height: 45px; 
	line-height: 25px;
	box-sizing: border-box; 
	transition: border-color 0.3s ease;
	
	/* Aparência padrão do dropdown */
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	
	/* Ícone de seta customizado */
	background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
	background-repeat: no-repeat;
	background-position: right 12px center;
	background-size: 1.2em;
	padding-right: 40px; /* Espaço para a seta */
}

.select-mobile:focus {
	outline: none;
	border-color: #22C55E;
	box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.select-mobile:hover {
	border-color: #555;
}

/* 2. Descrição que aparece abaixo do select no mobile */
.select-mobile-description {
	font-size: 0.8em;
	color: #999;
	line-height: 1.3;
	text-align: left;
	margin-top: 10px;
}


/* --- 3. Lógica de Visibilidade --- */

/* Por padrão (Desktop): Esconde o select, mostra o grid */
.select-mobile,
.select-mobile-description {
	display: none;
}

/* .hide-on-mobile - display: grid é definido pela classe .options-grid */

/* Em Mobile (usei 800px para bater com sua media query existente) */
@media (max-width: 800px) {
	/* Título e Subtítulo Mobile */
	.config-header {
		padding-top: 30px;
		margin-bottom: 20px;
	}

	.config-header h1 {
		font-size: 19px !important;
		font-weight: 700 !important;
		color: #fff;
		margin-bottom: 2px;
		padding: 0px 10px;
	}

	.config-header p {
		font-size: 13px !important;
		font-weight: 500;
		color: #9CA3AF;
		line-height: 1.4;
		margin: 0;
		padding: 10px;
	}

	/* Card Unificado Mobile */
	.mobile-unified-card {
		display: block;
		padding: 20px;
		border-radius: 16px;
		margin: 0 !important; /* Remove todos os margins */
		background: linear-gradient(135deg, rgba(10, 15, 10, 0.92) 0%, rgba(11, 11, 11, 0.94) 50%, rgba(8, 13, 8, 0.92) 100%);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: none;
		box-shadow: 0 0 1px 0 rgba(34, 197, 94, 0.08) inset, 0 8px 32px rgba(0, 0, 0, 0.6), 0 16px 64px rgba(0, 0, 0, 0.4);
		position: relative;
		outline: 1px solid rgba(34, 197, 94, 0.04);
		outline-offset: -1px;
	}

	.mobile-unified-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(ellipse 600px 400px at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
		opacity: 1;
		pointer-events: none;
		z-index: 1;
	}

	.mobile-unified-card::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.08) 0%, transparent 50%);
		opacity: 0.6;
		pointer-events: none;
		z-index: 0;
	}

	.mobile-unified-card > * {
		position: relative;
		z-index: 2;
	}

	.container-sections {
		background: transparent !important;
		border: none !important;
	}

	.hide-on-mobile {
		display: none !important;
	}

	/* Parâmetros de Entrada Mobile */
	.mobile-params-section {
		display: block;
		padding: 0 !important; /* Remove padding da seção */
		margin-bottom: 8px; /* Espaçamento reduzido entre seções */
	}

	.daily-params-section {
		display: none;
	}

	.agent-status-mobile {
		display: block;
		padding: 0 !important; /* Remove padding da seção */
		margin: 0 !important; /* Remove todos os margins */
	}

	
	.select-mobile,
	.select-mobile-description {
		display: block; 
	}

	.hide-on-mobile {
		display: none;
	}

	.option-card p{
		display: none;
	}
	.risk-options{
		grid-template-columns: 2fr 2fr;
	}

	.option-card h3{
		margin: 0!important;
	}

	.option-card{
		padding: 0;
		min-height: 50px!important;

	}

	.option-card.selected{
		background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
	}

	.option-card.selected h3{
		background-color: none;
		color: #22C55E;
	}

	.footer-section{
		flex-direction: column;
	}

	.summary-section{
		display: none;
	}

	.daily-params-grid{
		flex-direction: column;
		gap: 10px;
	}

	.daily-params-section p{
		color: #999999!important;
	}

	.param-input-group{
		width: 100%;
		text-align: left;
	}

	.input-editable{
		width: 100%;
		margin-bottom: 10px;
		max-width: 82vw;
	}

	/* Estilização do Select no Mobile */
	.select-mobile {
		background-color: #050907;
		border: 1px solid #333;
		border-radius: 8px;
		font-size: 1.0em;
		height: 45px;
		padding: 0px 20px;
	}

	.select-mobile:focus {
		border-color: #22C55E;
		background-color: #1f1f1f;
	}

	/* Estilização das opções do select (quando aberto) */
	.select-mobile option {
		background-color: #1a1a1a;
		color: #fff;
		padding: 12px 15px;
		border-radius: 4px;
	}

	.select-mobile option:checked {
		background-color: #22C55E;
		color: #000;
		font-weight: bold;
	}

	.select-mobile option:hover {
		background-color: #2a2a2a;
	}

	/* Ajustes específicos do card de status no mobile */
	.agent-status-mobile {
		margin: 0 !important; /* Remove todos os margins */
	}

	.status-card {
		padding: 18px 20px;
	}

	.status-value {
		font-size: 1.4em;
		margin-bottom: 8px;
	}

	.status-message {
		font-size: 0.85em;
	}

	.toggle-switch {
		width: 50px;
		height: 28px;
	}

	.status-card{
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.status-card h2{
		font-size: 1.0rem!important;

	}

	.status-value{
		font-size: 1.0rem!important;
	}

	.status-message{
		font-size: 0.7rem!important;
	}

	.footer-section{
		display: none;
	}

	.container-sections {
		display: flex;
		flex-direction: column;
		gap: 12px; /* Espaçamento uniforme entre todas as seções */
		background: transparent !important;
		border: none !important;
	}

	/* Ajustes de Status Mobile */
	.status-label {
		font-size: 12px;
		color: #9CA3AF;
		margin-bottom: 4px;
		text-align: left;
	}

	.status-value {
		font-size: 14px;
		font-weight: 600;
		color: #FFFFFF;
		text-align: left;
		margin: 0;
	}

	.status-message {
		font-size: 12px;
		color: #FF4747;
		margin-top: 12px;
		text-align: left;
	}
}
/* 🟢 NOVOS ESTILOS PARA LAYOUT DO STOP LOSS BLINDADO 🟢 */

.loss-control-row {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    width: 100%;
}

.loss-input-half {
    flex: 1;
    width: 50%;
}

/* Card Blindado (estilo igual ao input) */
.blindado-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1a1a1a;
    border: 1px solid #333;
    padding: 0 12px; /* Padding horizontal igual ao input */
    border-radius: 4px;
    height: 40px; /* Mesma altura do input-editable */
    width: 100%;
    margin-bottom: 5px; /* Alinha com o margin-bottom ou fluxo */
    transition: border-color 0.2s;
}

.blindado-card:hover {
    border-color: #555;
}

.blindado-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.icon-shield {
    color: #fff;
    width: 14px;
    height: 14px;
}

.blindado-status-text {
    font-size: 0.9em;
    color: #fff;
    font-weight: 500;
}


/* Toggle Switch Pequeno */
.toggle-switch-small {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 18px;
    flex-shrink: 0;
}

.toggle-switch-small input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider-small {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #020303;
    transition: .4s;
    border-radius: 20px;
}

.slider-small:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider-small {
    background-color: #22C55E; /* Slider verde quando ativo */
}

input:checked + .slider-small:before {
    transform: translateX(16px);
    background-color: #FFFFFF; /* Bolinha branca quando ativo */
}

/* Estilos de Texto do Resumo */
.text-active {
    color: #22C55E !important;
}

.text-inactive {
    color: #FFFFFF !important;
}

/* Ajuste dos tooltips na section-with-tooltip */
.section-with-tooltip {
    /* Reseta o estilo anterior que tinha margins negativas */
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding-top: 0;
    padding-right: 0;
    margin-top: 5px;
    margin-bottom: 8px;
}

.section-with-tooltip h3 {
    margin: 0 !important;
}


/* Ajustes Responsivos */
@media (max-width: 600px) {
    .loss-control-row {
        flex-direction: column;
        gap: 20px;
    }
    
    .loss-input-half {
        width: 100%;
    }
}
</style>
