<template>
    <div class="layout-agente-autnomo" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @close-sidebar="closeSidebar" 
            @toggle-collapse="toggleSidebarCollapse" 
        />
        <TopNavbar 
            :is-sidebar-collapsed="isSidebarCollapsed"
            :balance="accountBalance"
            :account-type="isDemo ? 'demo' : 'real'"
            :currency="accountCurrency"
            @account-type-changed="handleAccountTypeChange"
        />
        <div class="container-componentes" style="margin-top: 60px;">
            <component 
                :is="componenteAtual" 
                v-bind="agenteData" 
                @pausar-agente="toggleAgenteStatus('componenteAtivo')"
                @iniciar-agente="toggleAgenteStatus('componenteInativo')" 
            />
        </div>
        
        <footer id="footer" class="bg-zenix-bg mt-12 w-full">
            <div class="max-w-7xl mx-auto px-8 py-12">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
                    <div>
                        <div class="flex items-center space-x-2 mb-4">
                            <div class="text-lg font-semibold text-zenix-text">ZENIX</div>
                            <div class="text-xs text-zenix-label">PRO</div>
                        </div>
                        <p class="text-zenix-label text-xs leading-relaxed mb-6 opacity-60">
                            Plataforma inteligente de investimentos com IA, copy trading e automação.
                        </p>
                        <div class="flex items-center space-x-4">
                            <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                                <i class="fa-brands fa-twitter text-sm"></i>
                            </a>
                            <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                                <i class="fa-brands fa-linkedin text-sm"></i>
                            </a>
                            <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                                <i class="fa-brands fa-instagram text-sm"></i>
                            </a>
                            <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                                <i class="fa-brands fa-youtube text-sm"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-zenix-text mb-4">Produtos</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Copy Trading</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Agente Autônomo</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Academia</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Sinais de Trading</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-zenix-text mb-4">Suporte</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Central de Ajuda</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Contato</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Termos de Uso</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Política de Privacidade</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-zenix-text mb-4">Empresa</h3>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Sobre Nós</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Blog</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Carreiras</a></li>
                            <li><a href="#" class="text-zenix-label hover:text-zenix-text text-xs transition-colors">Parceiros</a></li>
                        </ul>
                    </div>
                </div>
                <div class="pt-8">
                    <p class="text-zenix-label text-xs text-center opacity-60">
                        © 2024 ZENIX PRO. Todos os direitos reservados.
                    </p>
                </div>
            </div>
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
        
        // Propriedade removida: textoDoBotao
        
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
                // Passa o saldo da conta para cálculo de porcentagens
                accountBalance: this.accountBalance
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
        handleAccountTypeChange(newAccountType) {
            // Alterna entre demo e real
            this.isDemo = newAccountType === 'demo';
            console.log('[AgenteAutonomo] Tipo de conta alterado para:', this.isDemo ? 'demo' : 'real');
        },
        // Método agora é acionado pelos componentes filhos através de eventos (@pausar-agente ou @iniciar-agente)
		toggleAgenteStatus(source) {
			this.agenteEstaAtivo = !this.agenteEstaAtivo;

			if (this.agenteEstaAtivo) {
				this.startSimulations();
				this.addSystemAction('Agente Autônomo Iniciado', 'Aguardando padrões de mercado...');

				// 🟢 ADICIONE ESTAS LINHAS AQUI 🟢
				this.$nextTick(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				});

			} else {
				this.stopSimulations();
				this.addSystemAction('Agente Autônomo Pausado', 'O sistema parou de analisar e operar.');
			}

			console.log(`[AgenteAutonomo] Status do Agente alterado. Acionado por: ${source}`);
		},

		iniciarAgente() {
			// 1. Coleta os dados configurados
			const configData = {
				estrategia: this.getStrategyTitle(this.selectedStrategy),
				mercado: this.getMarketTitle(this.selectedMarket),
				risco: this.getRiskTitle(this.selectedRisk),
				goalValue: this.metaLucroNumero,
				stopValue: this.limitePerdaNumero,
			};

			// 2. Emite o evento 'iniciar-agente' COM o objeto de dados
			this.$emit('iniciar-agente', configData);

			// 🟢 ADICIONE OU VERIFIQUE ESTAS LINHAS AQUI 🟢
			this.$nextTick(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou 'instant' se preferir sem animação
			});
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
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/deriv-balance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ derivToken: derivToken }),
                });
                
                const result = await response.json();
                if (result.success && result.data) {
                    this.accountBalance = result.data.balance;
                    this.accountCurrency = result.data.currency;
                    this.accountLoginid = result.data.loginid;
                    this.isDemo = result.data.loginid?.startsWith('VRTC') || result.data.loginid?.startsWith('VRT');
                    
                    // Atualizar moeda preferida
                    this.preferredCurrency = this.getPreferredCurrency();
                    
                    console.log('[AgenteAutonomo] ✅ Saldo atualizado:', {
                        balance: this.accountBalance,
                        currency: this.accountCurrency,
                        loginid: this.accountLoginid,
                        isDemo: this.isDemo,
                        preferredCurrency: this.preferredCurrency
                    });
                } else {
                    console.error('[AgenteAutonomo] ❌ Erro ao buscar saldo:', result.message || 'Unknown error');
                }
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
    width: calc(100% -280px);
    margin-left:280px;
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


</style>