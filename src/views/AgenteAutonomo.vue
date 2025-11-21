<template>
    <div class="layout-agente-autnomo" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @close-sidebar="closeSidebar" 
            @toggle-collapse="toggleSidebarCollapse" 
        />
        
        <div class="container">
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
        };
    },

    computed: {
        componenteAtual() {
            return this.agenteEstaAtivo ? 'AgenteAutonomoActive' : 'AgenteAutonomoInactive';
        },
        
        textoDoBotao() {
            return this.agenteEstaAtivo ? 'Pausar Agente Autônomo' : 'Iniciar Agente Autônomo';
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
            this.timeAndMetricsInterval = setInterval(this.updateTimeAndMetrics, 1000); // 1 segundo
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
        }
    },

    mounted() {
        // Inicializa o estado com uma ação
        this.addSystemAction('Sistema carregado', 'Aguardando o início do agente...');
    },

    beforeUnmount() {
        this.stopSimulations();
    }
};
</script>

<style scoped>
/* Estilos do Componente Pai (Layout principal) */
.layout-agente-autnomo {
    padding: 40px;
    background-color: #0d0d0d;
    min-height: 100vh;
    width: calc(100% - 240px);
    margin-left: 240px;
    transition: margin-left 0.3s;
}

.layout-agente-autnomo.sidebar-collapsed {
    width: calc(100% - 60px); /* Largura ajustada quando a sidebar é recolhida */
    margin-left: 60px;
}

.container {
    /* O componente filho ocupará esta área */
    padding-bottom: 80px; /* Espaço para o footer fixo */
}

/* Estilos para o Footer e Botão (Fixos) */
.agente-autonomo-footer {
    position: fixed;
    bottom: 0;
    left: 240px; 
    width: calc(100% - 240px);
    background-color: #1a1a1a;
    padding: 15px 40px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
    transition: left 0.3s, width 0.3s;
}

.layout-agente-autnomo.sidebar-collapsed .agente-autonomo-footer {
    left: 60px;
    width: calc(100% - 60px);
}

.iniciar-button {
    background-color: #4CAF50; /* Verde para Iniciar */
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    font-weight: bold;
}

.iniciar-button.pause-button {
    background-color: #f44336; /* Vermelho para Pausar */
}

.iniciar-button:hover {
    opacity: 0.9;
}
</style>