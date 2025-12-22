<template>
	<div class="layout-agente-autnomo" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
		<AppSidebar 
			:is-open="isSidebarOpen" 
			:is-collapsed="isSidebarCollapsed" 
			@close-sidebar="closeSidebar" 
			@toggle-collapse="toggleSidebarCollapse" 
		/>
		<div class="container-componentes" >
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
            
            <p v-if="!agenteEstaAtivo" class="text-footer">O agente executará operações automaticamente 24/7. Ao atingir a meta diária ou limite de perda, ele pausa e retoma somente no próximo ciclo</p>
        </footer>
	</div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import AgenteAutonomoActive from '../components/autonomo/AgenteAutonomoActive.vue';
import AgenteAutonomoInactive from '../components/autonomo/AgenteAutonomoInactive.vue';

export default {
	name: 'AgenteAutonomoView',
	components: {
		AgenteAutonomoActive,
		AgenteAutonomoInactive,
		AppSidebar,
		TopNavbar
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
			accountBalance: null,
			accountCurrency: 'USD',
			accountLoginid: null,
			isDemo: false, // Define se é conta demo ou real
			balanceUpdateInterval: null,
			preferredCurrency: 'USD',
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
			if (this.accountBalance === null || this.accountBalance === undefined) return '---';
			const prefix = this.getCurrencyPrefix(this.preferredCurrency);
			return `${prefix}${this.accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
		},
		currencyPrefix() {
			return this.getCurrencyPrefix(this.preferredCurrency);
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

			// O saldo agora é atualizado via API, não mais simulado
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
		getPreferredCurrency() {
			try {
				const connectionStr = localStorage.getItem('deriv_connection');
				if (connectionStr) {
					const connection = JSON.parse(connectionStr);
					if (connection.tradeCurrency) {
						const currency = connection.tradeCurrency.toUpperCase();
						console.log('[AgenteAutonomo] Moeda preferida:', currency);
						return currency;
					}
				}
			} catch (error) {
				console.error('[AgenteAutonomo] Erro ao parsear deriv_connection:', error);
			}
			return 'USD';
		},
		
		getDerivToken() {
			console.log('[AgenteAutonomo] Buscando token Deriv...');
			
			let accountLoginid = null;
			let preferredCurrency = null;
			
			try {
				const connectionStr = localStorage.getItem('deriv_connection');
				if (connectionStr) {
					const connection = JSON.parse(connectionStr);
					accountLoginid = connection.loginid;
					preferredCurrency = connection.tradeCurrency;
				}
			} catch (error) {
				console.error('[AgenteAutonomo] Erro ao parsear deriv_connection:', error);
			}
			
			const isDemoPreferred = preferredCurrency?.toUpperCase() === 'DEMO';
			if (isDemoPreferred) {
				try {
					const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
					const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
					
					for (const [loginid, token] of Object.entries(tokensByLoginId)) {
						if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
							console.log('[AgenteAutonomo] ✓ Token demo encontrado');
							return token;
						}
					}
				} catch (error) {
					console.error('[AgenteAutonomo] Erro ao buscar token demo:', error);
				}
			}
			
			if (accountLoginid) {
				try {
					const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
					const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
					
					const specificToken = tokensByLoginId[accountLoginid];
					if (specificToken) {
						console.log('[AgenteAutonomo] ✓ Token específico encontrado');
						return specificToken;
					}
				} catch (error) {
					console.error('[AgenteAutonomo] Erro ao buscar token específico:', error);
				}
			}
			
			const defaultToken = localStorage.getItem('deriv_token');
			if (!defaultToken) {
				console.error('[AgenteAutonomo] ERRO: Nenhum token encontrado!');
			}
			
			return defaultToken;
		},
		
		async fetchAccountBalance() {
			try {
				const derivToken = this.getDerivToken();
				if (!derivToken) {
					console.warn('[AgenteAutonomo] ❌ Token não disponível para buscar saldo');
					return;
				}
				
				// ✅ DESATIVADO: Chamada para /ai/deriv-balance (causa erro 500)
				// Usar saldo já disponível no contexto ou endpoint alternativo /broker/deriv/status
				console.warn('[AgenteAutonomo] ⚠️ Busca de saldo desativada - usar saldo do contexto');
				return;
				
				// const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				// const response = await fetch(`${apiBase}/ai/deriv-balance`, {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 		'Authorization': `Bearer ${localStorage.getItem('token')}`
				// 	},
				// 	body: JSON.stringify({ derivToken: derivToken }),
				// });
				
				// const result = await response.json();
				// if (result.success && result.data) {
				// 	this.accountBalance = result.data.balance;
				// 	this.accountCurrency = result.data.currency;
				// 	this.accountLoginid = result.data.loginid;
				// 	this.isDemo = result.data.loginid?.startsWith('VRTC') || result.data.loginid?.startsWith('VRT');
					
				// 	// Atualizar moeda preferida
				// 	this.preferredCurrency = this.getPreferredCurrency();
					
				// 	console.log('[AgenteAutonomo] ✅ Saldo atualizado:', {
				// 		balance: this.accountBalance,
				// 		currency: this.accountCurrency,
				// 		loginid: this.accountLoginid,
				// 		isDemo: this.isDemo,
				// 		preferredCurrency: this.preferredCurrency
				// 	});
				// } else {
				// 	console.error('[AgenteAutonomo] ❌ Erro ao buscar saldo:', result.message || 'Unknown error');
				// }
			} catch (error) {
				console.error('[AgenteAutonomo] ❌ Erro ao buscar saldo da conta:', error);
			}
		},
		
		startBalanceUpdates() {
			this.fetchAccountBalance();
			this.balanceUpdateInterval = setInterval(() => {
				this.fetchAccountBalance();
			}, 30000); // Atualiza a cada 30 segundos
		},
		
		stopBalanceUpdates() {
			if (this.balanceUpdateInterval) {
				clearInterval(this.balanceUpdateInterval);
				this.balanceUpdateInterval = null;
			}
		},
		
		getCurrencyPrefix(currency) {
			switch ((currency || '').toUpperCase()) {
				case 'USD':
					return '$';
				case 'EUR':
					return '€';
				case 'BTC':
					return '₿';
				case 'DEMO':
					return 'D$';
				default:
					return currency ? `${currency} ` : '';
			}
		}
		// ================================
	},

	mounted() {
		// Inicializa o estado com uma ação
		this.addSystemAction('Sistema carregado', 'Aguardando o início do agente...');
		
		// Buscar moeda preferida
		this.preferredCurrency = this.getPreferredCurrency();
		
		// Iniciar atualizações de saldo
		this.startBalanceUpdates();
		
		// Inicializa a simulação de métricas se não estiver ativo
		if (!this.agenteEstaAtivo) {
			this.timeAndMetricsInterval = setInterval(this.updateTimeAndMetrics, 1000);
		}
	},

	beforeUnmount() {
		this.stopSimulations();
		this.stopBalanceUpdates();
		
		// Limpa o intervalo de métricas se o componente for destruído
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
	transition: margin-left 0.3s;
	padding-bottom: 40px;
    width: 100%;
}

.layout-agente-autnomo.sidebar-collapsed {
	width: 100%;
	margin-left: 0;
}

.layout-agente-autnomo.sidebar-collapsed .top-header {
	left: 0;
	width: 100%!important;
}

.container-componentes{
	/* Padding superior ajustado para compensar o cabeçalho fixo */
	padding-top: 60px;
	padding-left: 60px;
	padding-right: 60px;
	padding-bottom: 20px;
	margin-top: 0;
}

/* Top Header */
.top-header {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	z-index: 40;
	background-color: #0E0E0E;
	border-bottom: 1px solid #1C1C1C;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	transition: left 0.3s ease;
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
	position: static; /* Fixa o footer */
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #0a0b0a; /* Fundo escuro */
	border-top: 1px solid #1C1C1C;
	padding: 30px 0;
	z-index: 1000;
	transition: left 0.3s, width 0.3s;
	box-sizing: border-box;
}

.layout-agente-autnomo.sidebar-collapsed .agente-autonomo-footer {
	left: 0; /* Ocupa a largura total quando recolhido */
	width: 100%;
}

.iniciar-button {
	background-color: #22c55e; /* Verde para Iniciar */
	color: white;
	border: none;
	padding: 15px 20px;
	text-align: center;
	font-size: 18px;
	cursor: pointer;
	border-radius: 8px;
	transition: background-color 0.3s ease;
	font-weight: bold;
	width: 93%; 
}
.pause-button{
	background: #333;
	max-width: 250px; /* Mais estreito quando é 'Pausar' */
}

.iniciar-button:hover {
	opacity: 0.9;
}

.agente-autonomo-footer{
	text-align: center;	
	display: flex;
	justify-content: center;
	flex-direction: column;
	margin-top: 1rem;
}

.text-footer{
	font-size:1rem;
	color: rgb(148, 148, 148);
	margin-top: 1rem;
	margin-bottom: 1rem;
	width:50%;
}
</style>