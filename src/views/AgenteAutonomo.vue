<template>
	<div class="layout-agente-autnomo" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
		<header class="top-header">
			<div class="header-content">
				<div class="header-left-content">
					<h1 class="header-title">Agente Autônomo</h1>
					<p class="header-subtitle">Configure e monitore seu agente de trading automatizado.</p>
				</div>
				<div class="header-actions-right">
					<div class="balance-display-card">
						<div class="balance-header">
							<i class="far fa-wallet"></i>
							<div class="balance-info">
								<span class="balance-label">Saldo Atual</span>
								<div class="balance-value-row">
									<span id="balanceValue" class="balance-value" v-if="balanceVisible">${{ formattedBalance }}</span>
									<span class="balance-value" v-else>••••••</span>
									<button 
										v-if="balanceVisible && !isDemo" 
										class="account-type-btn real-btn"
										@click="toggleBalanceVisibility"
									>
										Real
									</button>
									<button 
										v-if="balanceVisible && isDemo" 
										class="account-type-btn demo-btn"
										@click="toggleBalanceVisibility"
									>
										Demo
									</button>
									<button class="eye-toggle-btn" @click="toggleBalanceVisibility" :title="balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'">
										<i class="far fa-eye"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
		<AppSidebar 
			:is-open="isSidebarOpen" 
			:is-collapsed="isSidebarCollapsed" 
			@close-sidebar="closeSidebar" 
			@toggle-collapse="toggleSidebarCollapse" 
		/>
		
		<div class="container-componentes">
			<component 
				:is="componenteAtual" 
				v-bind="agenteData" 
				@pausar-agente="toggleAgenteStatus" 
			/>
		</div>
		
		<footer class="agente-autonomo-footer">
			<button 
				@click="toggleAgenteStatus" 
				class="iniciar-button"
				:class="{ 'pause-button': agenteEstaAtivo }" >
				{{ textoDoBotao }} 
			</button>
		</footer>
	</div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import AgenteAutonomoActive from '../components/autonomo/AgenteAutonomoActive.vue';
import AgenteAutonomoInactive from '../components/autonomo/AgenteAutonomoInactive.vue';
// AppHeader foi removido pois a lógica está neste componente (Top-Header)

export default {
	name: 'AgenteAutonomoView',
	components: {
		AgenteAutonomoActive,
		AgenteAutonomoInactive,
		AppSidebar
	},
	
	data() {
		return {
			// Estado Principal
			agenteEstaAtivo: false, // Começa como INATIVO
			
			// Dados de Configuração Estáticos
			estrategia: 'Arkon',
			mercado: 'Índices Sintéticos',
			risco: 'Equilibrado',
			goalValue: 50.00,
			stopValue: 25.00,
			
			// Dados Reativos e de Simulação
			dailyProfit: 0.00,
			dailyChange: 0.00,
			accumulatedLoss: 0.00,
			accumulatedChange: 0.00,
			lastExecutionTime: '00:00:00',
			tempoAtivo: '0h 0m',
			operacoesHoje: 0,
			
			// Dados de simulação para o gráfico
			realTimeOperations: [
				{ x: 0, y: 75, value: 0.00 },
				{ x: 25, y: 75, value: 0.00 },
				{ x: 50, y: 75, value: 0.00 },
				{ x: 75, y: 75, value: 0.00 },
				{ x: 100, y: 75, value: 0.00 },
			],
			
			// Histórico de Operações
			operationHistory: [],

			// Ações do Agente
			agentActions: [],

			// Estado do Sidebar (Placeholder)
			isSidebarOpen: true,
			isSidebarCollapsed: false,
			
			// Intervalos de Simulação
			chartInterval: null,
			profitInterval: null,
			timeAndMetricsInterval: null,

			// === DADOS DE HEADER/SALDO ===
			accountBalance: 1234.56, // Valor inicial simulado
			accountCurrency: 'USD',
			accountLoginid: 'CR12345',
			isDemo: false, // Define se é conta demo ou real
			balanceVisible: true,
			balanceUpdateInterval: null,
			// ==============================
		};
	},

	computed: {
		componenteAtual() {
			return this.agenteEstaAtivo ? 'AgenteAutonomoActive' : 'AgenteAutonomoInactive';
		},
		
		textoDoBotao() {
			return this.agenteEstaAtivo ? 'Pausar Agente' : 'Iniciar Agente Autônomo';
		},
		
		// Objeto que combina todos os dados a serem passados via v-bind
		agenteData() {
			return {
				estrategia: this.estrategia,
				mercado: this.mercado,
				risco: this.risco,
				goalValue: this.goalValue,
				stopValue: this.stopValue,
				dailyProfit: this.dailyProfit,
				dailyChange: this.dailyChange,
				accumulatedLoss: this.accumulatedLoss,
				accumulatedChange: this.accumulatedChange,
				lastExecutionTime: this.lastExecutionTime,
				tempoAtivo: this.tempoAtivo,
				operacoesHoje: this.operacoesHoje,
				realTimeOperations: this.realTimeOperations,
				operationHistory: this.operationHistory,
				agentActions: this.agentActions,
				// Passa o status também para renderização interna (indicador, título)
				agentStatus: this.agenteEstaAtivo ? 'ATIVO' : 'PAUSADO', 
			};
		},

		// === COMPUTED DE HEADER/SALDO ===
		formattedBalance() {
			// Formata o saldo com duas casas decimais
			if (!this.accountBalance && this.accountBalance !== 0) return '0.00';
			return this.accountBalance.toFixed(2);
		}
		// ==============================
	},

	methods: {
		toggleAgenteStatus() {
			this.agenteEstaAtivo = !this.agenteEstaAtivo;

			if (this.agenteEstaAtivo) {
				this.startSimulations();
				this.addSystemAction('Agente Autônomo Iniciado', 'Aguardando padrões de mercado...');
			} else {
				this.stopSimulations();
				this.addSystemAction('Agente Autônomo Pausado', 'O sistema parou de analisar e operar.');
			}
		},

		// --- Lógica de Simulação ---

		updateTimeAndMetrics() {
			if (!this.agenteEstaAtivo) return;

			const now = new Date();
			this.lastExecutionTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
			
			// Simulação de Lucro (Exemplo simplificado)
			const randomProfitChange = (Math.random() * 5 - 2.5); // Flutuação entre -2.5 e +2.5
			this.dailyProfit = Math.max(-this.stopValue, Math.min(this.goalValue, this.dailyProfit + randomProfitChange));
			
			// Simulação da mudança percentual (base de cálculo inicial fictícia)
			const initialCapital = 1000; 
			this.dailyChange = (this.dailyProfit / initialCapital) * 100;

			// Simulação de atualização do Saldo da Conta
			this.accountBalance += (Math.random() * 1.5 - 0.75);
			this.accountBalance = Math.max(0, this.accountBalance); // Garante que não é negativo
		},

		updateRealTimeChart() {
			if (!this.agenteEstaAtivo) return;

			// Simula um "shift" nos pontos e adiciona um novo ponto no final
			const newPoints = this.realTimeOperations.slice(1).map(p => ({
				...p,
				x: p.x - 25 // Move os pontos existentes
			}));
			
			// Cria novo ponto (Y entre 50 e 90 para manter a curva)
			const lastY = this.realTimeOperations[this.realTimeOperations.length - 1]?.y || 75;
			const newY = Math.max(50, Math.min(90, lastY + (Math.random() * 20 - 10)));
			const newValue = Math.abs(this.dailyProfit / 5 + (Math.random() * 5 - 2.5)); // Valor de exibição
			
			// Adiciona o novo ponto na posição 100
			newPoints.push({ x: 100, y: newY, value: newValue });
			this.realTimeOperations = newPoints;

			// Adiciona uma nova operação ao histórico a cada 3 atualizações do gráfico (exemplo)
			if (Math.random() > 0.8) {
				this.addNewOperation();
			}
		},

		addNewOperation() {
			const isProfit = Math.random() > 0.4;
			const result = isProfit ? (Math.random() * 10 + 5) : (Math.random() * -10 - 5);
			const assetName = Math.random() > 0.5 ? 'Volatility 75' : 'Boom 1000';
			const type = Math.random() > 0.5 ? 'CALL' : 'PUT';
			const entry = 10.00;
			const exit = entry + result;

			this.operationHistory.unshift({
				time: this.lastExecutionTime,
				asset: assetName,
				type: type,
				entry: entry,
				exit: exit,
				result: result
			});

			this.operacoesHoje++;
			this.dailyProfit += result;
			this.addSystemAction('Operação finalizada', `${this.lastExecutionTime} - ${isProfit ? 'Lucro' : 'Prejuízo'} de $${Math.abs(result).toFixed(2)}`, isProfit ? 'success' : 'error');
			
			// Limita o histórico
			if (this.operationHistory.length > 5) {
				this.operationHistory.pop();
			}
		},

		addSystemAction(title, description, status = 'info') {
			this.agentActions.unshift({
				status: status, 
				title: title, 
				description: description
			});
			// Limita as ações
			if (this.agentActions.length > 5) {
				this.agentActions.pop();
			}
		},

		startSimulations() {
			this.timeAndMetricsInterval = setInterval(this.updateTimeAndMetrics, 1000); // 1 segundo (usado para métricas e saldo)
			this.chartInterval = setInterval(this.updateRealTimeChart, 3000); // 3 segundos
		},

		stopSimulations() {
			clearInterval(this.timeAndMetricsInterval);
			clearInterval(this.chartInterval);
			this.timeAndMetricsInterval = null;
			this.chartInterval = null;
		},

		// Métodos de Sidebar (Placeholder)
		closeSidebar() {
			this.isSidebarOpen = false;
		},
		toggleSidebarCollapse() {
			this.isSidebarCollapsed = !this.isSidebarCollapsed;
		},

		// === MÉTODOS DE HEADER/SALDO ===
		toggleBalanceVisibility() {
			this.balanceVisible = !this.balanceVisible;
		},
		// Os métodos de integração com API (fetchAccountBalance, getDerivToken, startBalanceUpdates, stopBalanceUpdates)
		// foram substituídos aqui pela lógica de simulação dentro de updateTimeAndMetrics() para fins de demonstração,
		// mantendo a estrutura original do template e do script.
		// ===============================
	},

	mounted() {
		// Inicializa o estado com uma ação
		this.addSystemAction('Sistema carregado', 'Aguardando o início do agente...');
		
		// Inicializa a simulação de métricas (inclui saldo simulado) se não estiver ativo
		// Note: A chamada original à API foi substituída por uma inicialização simples aqui.
		if (!this.agenteEstaAtivo) {
			this.timeAndMetricsInterval = setInterval(this.updateTimeAndMetrics, 1000);
		}
	},

	beforeUnmount() {
		this.stopSimulations();
		
		// Limpa o intervalo de métricas/saldo se o componente for destruído
		if (this.timeAndMetricsInterval) {
			clearInterval(this.timeAndMetricsInterval);
		}
	}
};
</script>

<style scoped>
/* Estilos do Componente Pai (Layout principal) */
.layout-agente-autnomo {
	background-color: #0a0b0a;
	min-height: 100vh;
	width: calc(100% - 240px);
	margin-left: 240px;
	transition: margin-left 0.3s;
	padding-bottom: 40px;
}

.layout-agente-autnomo.sidebar-collapsed {
	width: 100%;
	margin-left: 0;
}

.layout-agente-autnomo.sidebar-collapsed .top-header {
	left: 0;
	width: 100%;
}

.container-componentes{
	/* Padding superior ajustado para compensar o cabeçalho fixo */
	padding-top: 120px;
	padding-left: 60px;
	padding-right: 60px;
	padding-bottom: 20px;
	margin-top: 0;
}

/* Top Header */
.top-header {
	position: fixed;
	top: 0;
	right: 0;
	left: 240px;
	z-index: 40;
	background-color: #0E0E0E;
	border-bottom: 1px solid #1C1C1C;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	transition: left 0.3s ease;
	width: calc(100% - 240px);
	box-sizing: border-box;
}

.main-content-wrapper.sidebar-collapsed .top-header {
	left: 0;
	width: 100%;
}

.header-content {
	padding: 1rem 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	max-width: 100%;
	width: 100%;
	box-sizing: border-box;
}

.header-left-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	justify-content: center;
	align-items: flex-start;
}

.header-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: #DFDFDF;
	margin: 0;
	line-height: 1.2;
}

.header-subtitle {
	font-size: 0.875rem;
	color: #A1A1A1;
	margin: 0;
	line-height: 1.4;
}

.balance-display-card {
	background-color: #0E0E0E;
	border: 1px solid #1C1C1C;
	border-radius: 0.75rem;
	padding: 0.75rem;
	transition: all 0.3s ease;
}

.balance-display-card:hover {
	background: #111;
	transform: translateY(-1px);
}

.balance-header {
	display: flex;
	align-items: center;
	gap: 0.625rem;
}

.balance-header i {
	color: #22C55E;
	font-size: 0.75rem;
}

.balance-info {
	display: flex;
	flex-direction: column;
}

.balance-label {
	font-size: 0.625rem;
	color: #7A7A7A;
	font-weight: 500;
}

.balance-value-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.125rem;
}

.balance-value {
	font-size: 1rem;
	font-weight: bold;
	color: #DFDFDF;
}

.account-type-btn {
	padding: 0.125rem 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.625rem;
	font-weight: 600;
	transition: all 0.2s;
	border: none;
	cursor: pointer;
}

.real-btn {
	background-color: #22C55E;
	color: #000;
}

.real-btn:hover {
	background-color: #16A34A;
}

.demo-btn {
	background-color: #333;
	color: #A1A1A1;
}

.eye-toggle-btn {
	background: none;
	border: none;
	color: #A1A1A1;
	cursor: pointer;
	padding: 0.25rem;
	transition: color 0.2s;
}

.eye-toggle-btn:hover {
	color: #DFDFDF;
}

/* Estilos para o Footer e Botão (Fixos) */
.agente-autonomo-footer {
	position: fixed; /* Fixa o footer */
	bottom: 0;
	left: 240px; /* Alinha com o conteúdo principal */
	width: calc(100% - 240px); /* Ocupa a largura restante */
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #0a0b0a; /* Fundo escuro */
	border-top: 1px solid #1C1C1C;
	padding: 10px 0;
	z-index: 1000;
	transition: left 0.3s, width 0.3s;
	box-sizing: border-box;
}

.layout-agente-autnomo.sidebar-collapsed .agente-autonomo-footer {
	left: 0; /* Ocupa a largura total quando recolhido */
	width: 100%;
}

.iniciar-button {
	background-color: #4CAF50; /* Verde para Iniciar */
	color: white;
	border: none;
	padding: 15px 20px;
	text-align: center;
	font-size: 18px;
	cursor: pointer;
	border-radius: 8px;
	transition: background-color 0.3s ease;
	font-weight: bold;
	width: 93%; /* Ocupa a maior parte do espaço dentro do footer */
	max-width: 600px; /* Limite de largura para botões grandes */
}
.pause-button{
	background: #333;
	max-width: 250px; /* Mais estreito quando é 'Pausar' */
}

.iniciar-button:hover {
	opacity: 0.9;
}
</style>