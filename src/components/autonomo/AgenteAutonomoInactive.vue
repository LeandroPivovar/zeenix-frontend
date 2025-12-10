<template>
	<div class="layout-content-agent-autonomo">
		<div class="agent-config-container">
			<header class="config-header">
				<h1>Configuração do Agente Autônomo</h1>
				<p>Configure uma única vez. O agente operará todos os dias até atingir suas metas.</p>
			</header>
			<div class="container-sections">
				
				<section class="config-section">
					<h2 class="section-with-tooltip">
						Mercado
						<div class="tooltip-container">
							<svg class="icon-help" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10"></circle>
								<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
								<line x1="12" y1="17" x2="12.01" y2="17"></line>
							</svg>
							<span class="tooltip-text">Escolha o ativo que deseja operar.</span>
						</div>
					</h2>
					
					<div class="market-options options-grid hide-on-mobile">
						<div 
							class="option-card"
							:class="{ 'selected': selectedMarket === 'volatility_10' }"
							@click="selectMarket('volatility_10')"
						>
							<h3>Volatility 10 Index</h3>
							<p>Mercado com volatilidade constante de 10%.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedMarket === 'volatility_25' }"
							@click="selectMarket('volatility_25')"
						>
							<h3>Volatility 25 Index</h3>
							<p>Mercado com volatilidade constante de 25%.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedMarket === 'volatility_50' }"
							@click="selectMarket('volatility_50')"
						>
							<h3>Volatility 50 Index</h3>
							<p>Mercado com volatilidade constante de 50%.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedMarket === 'volatility_75' }"
							@click="selectMarket('volatility_75')"
						>
							<h3>Volatility 75 Index</h3>
							<p>Mercado com volatilidade constante de 75%.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedMarket === 'volatility_100' }"
							@click="selectMarket('volatility_100')"
						>
							<h3>Volatility 100 Index</h3>
							<p>Mercado com volatilidade constante de 100%.</p>
						</div>
					</div>

					<select v-model="selectedMarket" class="select-mobile">
						<option value="volatility_10">Volatility 10 Index</option>
						<option value="volatility_25">Volatility 25 Index</option>
						<option value="volatility_50">Volatility 50 Index</option>
						<option value="volatility_75">Volatility 75 Index</option>
						<option value="volatility_100">Volatility 100 Index</option>
					</select>
					
					<p class="select-mobile-description">{{ getMarketDescription(selectedMarket) }}</p>

				</section>

				<section class="config-section">
					<h2>Estratégias Disponíveis</h2>
					
					<div class="strategies-options options-grid hide-on-mobile">
						<div 
							class="option-card"
							:class="{ 'selected': selectedStrategy === 'arion' }"
							@click="selectStrategy('arion')"
							title="Selecione uma estratégia de operação."
						>
							<h3>Arion</h3>
							<p>Microtransações rápidas e alta responsabilidade.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedStrategy === 'cryptomax' }"
							@click="selectStrategy('cryptomax')"
							title="Selecione uma estratégia de operação."
						>
							<h3>CryptoMax</h3>
							<p>Ideal para cripto com volatilidade elevada.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedStrategy === 'orion_ultra' }"
							@click="selectStrategy('orion_ultra')"
							title="Selecione uma estratégia de operação."
						>
							<h3>Orion Ultra</h3>
							<p>Confirmação tripla com filtros inteligentes.</p>
						</div>
						<div 
							class="option-card"
							:class="{ 'selected': selectedStrategy === 'metaflow' }"
							@click="selectStrategy('metaflow')"
							title="Selecione uma estratégia de operação."
						>
							<h3>MetaFlow</h3>
							<p>Otimizada para os ciclos dos metais.</p>
						</div>
					</div>

					<select v-model="selectedStrategy" class="select-mobile">
						<option value="arion">Arion</option>
						<option value="cryptomax">CryptoMax</option>
						<option value="orion_ultra">Orion Ultra</option>
						<option value="metaflow">MetaFlow</option>
					</select>
					
					<p class="select-mobile-description">{{ getStrategyDescription(selectedStrategy) }}</p>

				</section>

				<section class="config-section risk-section">
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
							<h3>Equilibrado</h3>
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
								<p style="font-size: 0.8em; color: #777; margin-top: 5px;">{{ percentualValorOperacao }}% do capital total</p>
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
								<p style="font-size: 0.8em; color: #00ff66; margin-top: 5px;">+{{ percentualMetaLucro }}% do capital total</p>
							</div>
							<div class="param-input-group">
								<h3>Limite de perda do dia</h3>
								<input 
									type="number" 
									v-model.number="limitePerda" 
									class="input-editable"
									min="0.01"
									step="0.01"
								>
								<p style="font-size: 0.8em; color: red; margin-top: 5px;">-{{ percentualLimitePerda }}% do capital total</p>
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
							<div class="summary-item strategy-item">
								<svg class="icon-summary-strategy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
								<div class="summary-item-value">
									<span>Estratégia</span>
									<strong>{{ getStrategyTitle(selectedStrategy) }}</strong>
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
				
				<!-- Status do Agente - Apenas Mobile -->
				<section class="config-section agent-status-mobile">
					
					<div class="status-card">
						
						<div class="status-content">
							<div class="status-text">
								<h2>Status do AGENTE</h2>
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
</template>

<script>
export default {
	// *** MODIFICAÇÃO 2: Nome do componente corrigido ***
	name: 'AgenteAutonomoInactive', // Era 'AgenteAutonomoView'
	props: {
		accountBalance: {
			type: Number,
			default: null
		}
		// NOTA: Este componente também está recebendo 'estrategia', 'mercado', 'risco', etc.
		// do 'agenteData' (via v-bind), mas está usando seu próprio 'data()' local.
		// A solução abaixo envia os dados locais para o pai ao iniciar.
	},
	data() {
		return {
			// Estado de seleção inicial (Baseado na imagem)
			selectedMarket: 'volatility_10', 
			selectedStrategy: 'arion',
			selectedRisk: 'balanced',

			// Parâmetros (Baseado na imagem)
			valorOperacao: 50.00,
			metaLucro: 100.00,
			limitePerda: 50.00,
		};
	},
	methods: {
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
				// Usa os nomes de prop que o PAI espera
				estrategia: this.getStrategyTitle(this.selectedStrategy),
				mercado: this.getMarketTitle(this.selectedMarket),
				risco: this.getRiskTitle(this.selectedRisk),
				goalValue: this.metaLucroNumero,
				stopValue: this.limitePerdaNumero,
				// NOTA: 'valorOperacao' não está no 'agenteData' do pai,
				// então não estamos enviando por enquanto.
			};

			// 2. Emite o evento 'iniciar-agente' COM o objeto de dados (o payload)
			this.$emit('iniciar-agente', configData);

			// 🟢 ADICIONE ESTAS LINHAS AQUI para rolar para o topo quando o botão é clicado 🟢
			this.$nextTick(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou 'instant' se preferir sem animação
			});
		},

		// --- Métodos existentes ---
		selectMarket(marketId) {
			this.selectedMarket = marketId;
		},
		selectStrategy(strategyId) {
			this.selectedStrategy = strategyId;
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

		getStrategyTitle(id) {
			const map = {
				'arion': 'Arion',
				'cryptomax': 'CryptoMax',
				'orion_ultra': 'Orion Ultra',
				'metaflow': 'MetaFlow'
			};
			return map[id] || id;
		},

		// 🟢 NOVO MÉTODO 🟢
		getStrategyDescription(id) {
			const map = {
				'arion': 'Microtransações rápidas e alta responsabilidade.',
				'cryptomax': 'Ideal para cripto com volatilidade elevada.',
				'orion_ultra': 'Confirmação tripla com filtros inteligentes.',
				'metaflow': 'Otimizada para os ciclos dos metais.'
			};
			return map[id] || '';
		},

		getRiskTitle(id) {
			const map = {
				'conservative': 'Conservador',
				'balanced': 'Equilibrado',
				'aggressive': 'Agressivo'
			};
			return map[id] || id;
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
	padding-bottom: 30px;
	text-align: left;
}

.container{
	padding: 0px;
}

.container-sections{
	padding: 0px;
	margin-top: 0;
	background: #0e0f0f;
	border-radius: 12px;
	border: 1px solid #1C1C1C;
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
	background-color: #0d0c0c;
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
	background-color: #1a1a1a;
}
/* Estilo Selecionado: Fundo preto e borda verde */
.option-card.selected {
	border: 1px solid #00ff66; 
	background-color: #19723b25;
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
}

.daily-params-grid {
	display: flex;
	flex-direction: column;
	gap: 20px;
	width: 100%;
}

/* Ajustes para telas menores que 1400px */
@media (max-width: 1400px) {
	.footer-section {
		gap: 40px;
	}

	.summary-grid {
		gap: 20px 25px;
		margin: 8px;
	}

	.daily-params-section {
		max-width: 500px;
	}

	.daily-params-grid {
		gap: 15px;
	}

	section {
		padding: 15px;
	}

	.daily-params-section {
		padding: 20px;
	}

	.summary-section {
		padding: 20px;
		max-width: 800px;
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
		max-width: 600px;
		min-width: 600px;
	}

	.summary-section {
		max-width: 900px;
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
	gap: 60px;
	align-items: flex-start;
	justify-content: flex-start;
}

@media (min-width: 1400px) {
	.footer-section {
		gap: 80px;
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
}

@media (max-width: 600px) {
	.daily-params-grid {
		flex-direction: column;
		gap: 15px;
	}
}


/* 🟢 INÍCIO: Estilos e Lógica Mobile 🟢 */

/* Status do Agente - Apenas Mobile */
.agent-status-mobile {
	display: none;
}

.status-card {
	background-color: #1a1a1a;
	border: 1px solid #2a2a2a;
	border-radius: 8px;
	padding: 20px;
	margin-top: 15px;
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
	.agent-status-mobile {
		display: block;
	}

	.config-header{
		padding-top: 50px;
	}

	.config-header p{
		margin: 0;
	}

	.config-header h1{
		font-size: 1.2rem!important;
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
		background: linear-gradient(to bottom, #000602 0%, #081a0a 100%);
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
		margin-top: 20px;
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

	.container-sections{
		background: linear-gradient(135deg, #0c150f 0%, #0f1311 50%, #0b0e0b 100%)!important;
	}	

	.container-sections{
		display: flex;
		flex-direction: column;
		
		gap: 20px;
	}
}

</style>