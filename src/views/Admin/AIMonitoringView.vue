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
                <div class="content-header mb-6 flex justify-between items-center px-4">
                    <div>
                        <h1 class="text-2xl font-bold text-white">Monitoramento de IA Premium</h1>
                        <p class="text-sm text-[#7D7D7D]">Acompanhe a atividade do robô em tempo real com estatísticas avançadas.</p>
                    </div>
                    <button @click="stopIA" :disabled="isStopping" class="stop-btn">
                        <i class="fas fa-stop mr-2"></i> {{ isStopping ? 'Parando...' : 'Parar IA' }}
                    </button>
                </div>

                <!-- MONITORING DASHBOARD -->
                <div class="monitoring-dashboard animate-fadeIn px-4">
                    <!-- Summary Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="stats-card">
                            <div class="stats-icon-wrapper blue">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Saldo Atual</span>
                                <span class="stats-value">$ {{ monitoringStats.balance.toFixed(2) }}</span>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-icon-wrapper" :class="monitoringStats.profit >= 0 ? 'green' : 'red'">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Sessão P/L</span>
                                <span class="stats-value" :class="monitoringStats.profit >= 0 ? 'text-zenix-green glow-green-text' : 'text-red-500'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}$ {{ monitoringStats.profit.toFixed(2) }}
                                </span>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-icon-wrapper yellow">
                                <i class="fas fa-percentage"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Assertividade</span>
                                <span class="stats-value text-zenix-green">{{ monitoringStats.wins + monitoringStats.losses > 0 ? ((monitoringStats.wins / (monitoringStats.wins + monitoringStats.losses)) * 100).toFixed(0) : 0 }}%</span>
                                <span class="text-[10px] text-[#7A7A7A] ml-1">{{ monitoringStats.wins }}W / {{ monitoringStats.losses }}L</span>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-icon-wrapper green pulse">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Status da IA</span>
                                <span class="stats-value text-sm text-zenix-green">{{ monitoringStats.status }}</span>
                                <p class="text-[10px] text-zenix-green/80">{{ monitoringStats.statusDesc }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="monitoring-tabs-container mb-4">
                        <div class="monitoring-tabs flex gap-4 border-b border-[#333]">
                            <button @click="activeMonitoringTab = 'chart'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'chart' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-chart-area mr-2"></i> Gráfico
                            </button>
                            <button @click="activeMonitoringTab = 'logs'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'logs' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-list-ul mr-2"></i> Registros
                            </button>
                            <button @click="activeMonitoringTab = 'history'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'history' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-history mr-2"></i> Histórico
                            </button>
                            <button @click="activeMonitoringTab = 'config'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'config' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-cog mr-2"></i> Configuração
                            </button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-container bg-[#141414] border border-[#333] rounded-xl p-6 min-h-[400px]">
                        <!-- Chart Placeholder -->
                        <div v-show="activeMonitoringTab === 'chart'" class="chart-tab-content flex items-center justify-center h-full min-h-[300px]">
                            <div class="text-center">
                                <i class="fas fa-chart-line text-6xl text-zenix-green/20 mb-4 block"></i>
                                <p class="text-[#7A7A7A]">Aguardando conexão com o mercado...</p>
                            </div>
                        </div>

                        <!-- Logs Tab -->
                        <div v-if="activeMonitoringTab === 'logs'" class="logs-tab-content h-full">
                            <div class="logs-list-wrapper space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                <div v-for="log in monitoringLogs" :key="log.id" class="p-3 bg-[#0B0B0B] rounded-lg border border-[#222] font-mono text-xs flex gap-3">
                                    <span class="text-gray-500">[{{ log.time }}]</span>
                                    <span :class="{ 'text-zenix-green': log.type === 'success', 'text-red-500': log.type === 'error', 'text-blue-400': log.type === 'info', 'text-yellow-400': log.type === 'warning' }">
                                        {{ log.message }}
                                    </span>
                                </div>
                                <div v-if="monitoringLogs.length === 0" class="text-center py-12 text-[#7A7A7A]">
                                    Nenhum log registrado ainda.
                                </div>
                            </div>
                        </div>

                        <!-- History Tab -->
                        <div v-if="activeMonitoringTab === 'history'" class="history-tab-content">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left">
                                    <thead class="border-b border-[#333] text-xs text-[#7A7A7A] uppercase tracking-wider">
                                        <tr>
                                            <th class="pb-4">Hora</th>
                                            <th class="pb-4">Mercado</th>
                                            <th class="pb-4">Contrato</th>
                                            <th class="pb-4">Investimento</th>
                                            <th class="pb-4">Resultado</th>
                                            <th class="pb-4 text-right">P/L</th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-sm">
                                        <tr v-for="op in monitoringOperations" :key="op.id" class="border-b border-[#222] last:border-0 hover:bg-[#1A1A1A] transition-colors">
                                            <td class="py-4">{{ op.time }}</td>
                                            <td class="py-4">{{ op.market }}</td>
                                            <td class="py-4 text-xs">{{ op.contract }}</td>
                                            <td class="py-4">$ {{ op.stake.toFixed(2) }}</td>
                                            <td class="py-4">
                                                <span :class="op.result === 'WIN' ? 'bg-zenix-green/10 text-zenix-green border-zenix-green/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="px-2 py-1 rounded border text-[10px] font-bold">
                                                    {{ op.result }}
                                                </span>
                                            </td>
                                            <td class="py-4 text-right font-bold" :class="op.result === 'WIN' ? 'text-zenix-green' : 'text-red-500'">
                                                {{ op.result === 'WIN' ? '+' : '' }}{{ op.pnl.toFixed(2) }}
                                            </td>
                                        </tr>
                                        <tr v-if="monitoringOperations.length === 0">
                                            <td colspan="6" class="text-center py-12 text-[#7A7A7A]">Nenhuma operação executada nesta sessão.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Config Tab -->
                        <div v-if="activeMonitoringTab === 'config'" class="config-tab-content">
                            <div class="space-y-6">
                                <div class="config-item">
                                    <label class="text-sm text-gray-400 block mb-2">Estratégia Ativa</label>
                                    <div class="bg-[#0B0B0B] border border-[#333] rounded-lg p-4">
                                        <p class="text-white font-bold text-lg">{{ currentConfig.strategy }}</p>
                                    </div>
                                </div>
                                <div class="config-item">
                                    <label class="text-sm text-gray-400 block mb-2">Stake Configurado</label>
                                    <div class="bg-[#0B0B0B] border border-[#333] rounded-lg p-4">
                                        <p class="text-white font-bold text-lg">$ {{ currentConfig.stake.toFixed(2) }}</p>
                                    </div>
                                </div>
                                <div class="config-item">
                                    <label class="text-sm text-gray-400 block mb-2">Modo</label>
                                    <div class="bg-[#0B0B0B] border border-[#333] rounded-lg p-4">
                                        <p class="text-white font-bold text-lg">{{ currentConfig.mode === 'veloz' ? '⚡ Veloz' : '🎯 Moderado' }}</p>
                                    </div>
                                </div>
                                <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p class="text-sm text-blue-400">
                                        <i class="fas fa-info-circle mr-2"></i>
                                        Para alterar as configurações, pare a IA e inicie uma nova sessão.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

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
import { StrategyAnalysis } from '../../utils/StrategyAnalysis';

// Import strategy configurations
import apolloStrategy from '../../utils/strategies/apollo.json';
import atlasStrategy from '../../utils/strategies/atlas.json';
import nexusStrategy from '../../utils/strategies/nexus.json';
import orionStrategy from '../../utils/strategies/orion.json';
import titanStrategy from '../../utils/strategies/titan.json';

const strategyConfigs = {
	apollo: apolloStrategy,
	atlas: atlasStrategy,
	nexus: nexusStrategy,
	orion: orionStrategy,
	titan: titanStrategy
};

export default {
    name: 'AIMonitoringView',
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
            isStopping: false,
            activeMonitoringTab: 'chart',

            // Strategy Config (loaded from local storage)
            currentConfig: {
                strategy: 'Apollo',
                stake: 0.35,
                mode: 'veloz'
            },

            // WebSocket Connection
            ws: null,
            tickSubscriptionId: null,
            isAuthorized: false,
            tickCount: 0,
            tickHistory: [],
            digitHistory: [],

            monitoringStats: {
                balance: 0,
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Conectando...',
                statusDesc: 'Inicializando WebSocket'
            },

            monitoringLogs: [],
            monitoringOperations: [],
            activeContracts: new Map()
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        this.loadConfiguration();
        this.initTickConnection();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        this.stopTickConnection();
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
        loadConfiguration() {
            const savedConfig = localStorage.getItem('ai_active_config');
            if (savedConfig) {
                try {
                    this.currentConfig = JSON.parse(savedConfig);
                } catch (e) {
                    console.error('Error loading config:', e);
                }
            }
        },
        getDerivToken() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    const accountLoginid = connection.loginid;
                    if (accountLoginid) {
                        const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                        const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                        if (tokensByLoginId[accountLoginid]) {
                            return tokensByLoginId[accountLoginid].trim();
                        }
                    }
                }
                const defaultToken = localStorage.getItem('deriv_token');
                return defaultToken ? defaultToken.trim() : null;
            } catch (e) {
                console.error('Error getting token:', e);
                return null;
            }
        },
        async initTickConnection() {
            this.stopTickConnection();
            this.tickCount = 0;

            const appId = localStorage.getItem('deriv_app_id') || '1089';
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
            
            try {
                this.ws = new WebSocket(endpoint);

                this.ws.onopen = () => {
                    this.addLog('🔌 Conectado ao mercado', 'success');
                    const token = this.getDerivToken();
                    
                    if (token) {
                        this.ws.send(JSON.stringify({ authorize: token }));
                    } else {
                        this.addLog('⚠️ Token não encontrado. Modo observação.', 'warning');
                        this.subscribeTicks();
                    }
                };

                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        
                        if (msg.msg_type === 'authorize') {
                            if (msg.error) {
                                this.addLog(`❌ Erro de autorização: ${msg.error.message}`, 'error');
                            } else {
                                this.isAuthorized = true;
                                this.monitoringStats.balance = msg.authorize.balance;
                                this.addLog(`✅ Autorizado! Saldo: $${this.monitoringStats.balance}`, 'success');
                                this.subscribeTicks();
                            }
                        }

                        if (msg.msg_type === 'tick') {
                            this.handleTickMessage(msg);
                        }

                        if (msg.msg_type === 'buy') {
                            if (msg.error) {
                                this.addLog(`❌ Erro na compra: ${msg.error.message}`, 'error');
                            } else {
                                const payout = msg.buy.payout;
                                this.addLog(`🚀 Compra realizada! ID: ${msg.buy.contract_id} | Payout: $${payout}`, 'success');
                                this.subscribeToContract(msg.buy.contract_id);
                            }
                        }

                        if (msg.msg_type === 'proposal_open_contract') {
                            this.handleContractUpdate(msg.proposal_open_contract);
                        }
                    } catch (e) {
                        console.error('WebSocket message error:', e);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.addLog('❌ Erro na conexão WebSocket', 'error');
                };

                this.ws.onclose = () => {
                    this.addLog('📡 Conexão encerrada. Reconectando...', 'info');
                    setTimeout(() => this.initTickConnection(), 3000);
                };
            } catch (error) {
                console.error('WebSocket connection error:', error);
                this.addLog('❌ Falha ao conectar', 'error');
            }
        },
        stopTickConnection() {
            if (this.ws) {
                if (this.tickSubscriptionId) {
                    this.ws.send(JSON.stringify({ forget: this.tickSubscriptionId }));
                }
                this.ws.close();
                this.ws = null;
            }
            this.tickSubscriptionId = null;
        },
        subscribeTicks() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    ticks: 'R_100',
                    subscribe: 1
                }));
                this.monitoringStats.status = 'Monitorando';
                this.monitoringStats.statusDesc = 'Analisando tiques em tempo real';
            }
        },
        handleTickMessage(msg) {
            if (msg.error) {
                this.addLog(`❌ Erro: ${msg.error.message}`, 'error');
                return;
            }
            if (msg.msg_type === 'tick' && msg.tick) {
                this.tickCount++;
                const price = msg.tick.quote;
                if (msg.subscription) this.tickSubscriptionId = msg.subscription.id;
                if (this.tickCount % 10 === 0) this.addLog(`📈 Tick #${this.tickCount}: ${price}`, 'info');
                this.tickHistory.unshift(price);
                if (this.tickHistory.length > 100) this.tickHistory.pop();
                const lastDigit = parseInt(price.toString().slice(-1));
                this.digitHistory.unshift(lastDigit);
                if (this.digitHistory.length > 100) this.digitHistory.pop();
                this.runAIAnalysis();
            }
        },
        runAIAnalysis() {
            const strategyKey = this.currentConfig.strategy.toLowerCase();
            const strategyConfig = strategyConfigs[strategyKey];
            if (!strategyConfig || !strategyConfig.config) return;
            const attackFilters = strategyConfig.config.form.attackFilters || [];
            if (attackFilters.length === 0) return;
            const data = { tickHistory: this.tickHistory, digitHistory: this.digitHistory };
            const results = attackFilters.map(filter => StrategyAnalysis.evaluate(filter, data));
            const allPassed = results.every(r => r.pass);
            results.forEach(res => { if (!res.pass) this.addLog(`🔍 ${res.reason}`, 'info'); });
            if (allPassed) {
                this.addLog('🎯 SINAL GERADO! Todos os filtros confirmados.', 'success');
                this.executeAITrade(strategyConfig);
            }
        },
        executeAITrade(strategyConfig) {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado', 'warning');
                return;
            }
            if (this.activeContracts.size > 0) {
                this.addLog('⏳ Sinal ignorado: Operação em andamento', 'info');
                return;
            }
            const form = strategyConfig.config.form;
            const stake = this.currentConfig.stake;
            const buyParams = {
                buy: 1,
                price: stake,
                parameters: {
                    amount: stake,
                    basis: 'stake',
                    contract_type: form.tradeType,
                    currency: 'USD',
                    duration: form.duration,
                    duration_unit: form.durationUnit,
                    symbol: form.market
                }
            };
            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(form.tradeType)) {
                buyParams.parameters.barrier = form.prediction.toString();
            }
            this.addLog(`💸 Executando: ${form.tradeType} em ${form.market} | Stake: $${stake}`, 'info');
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(buyParams));
            } else {
                this.addLog('❌ WebSocket não conectado', 'error');
            }
        },
        subscribeToContract(contractId) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ proposal_open_contract: 1, contract_id: contractId, subscribe: 1 }));
            }
        },
        handleContractUpdate(contract) {
            const id = contract.contract_id;
            let trade = this.monitoringOperations.find(o => o.id === id);
            if (!trade) {
                trade = {
                    id: id,
                    time: new Date(contract.date_start * 1000).toLocaleTimeString(),
                    market: contract.display_name,
                    contract: contract.contract_type,
                    stake: contract.buy_price,
                    pnl: contract.profit || 0,
                    result: 'OPEN'
                };
                this.monitoringOperations.unshift(trade);
                this.activeContracts.set(id, trade);
            } else {
                trade.pnl = contract.profit || 0;
            }
            if (contract.is_sold) {
                trade.result = contract.status.toUpperCase() === 'WON' ? 'WIN' : 'LOSS';
                trade.pnl = parseFloat(contract.profit || 0);
                if (trade.result === 'WIN') {
                    this.monitoringStats.wins++;
                    this.addLog(`💰 WIN! +$${trade.pnl.toFixed(2)}`, 'success');
                } else {
                    this.monitoringStats.losses++;
                    this.addLog(`🔴 LOSS: -$${Math.abs(trade.pnl).toFixed(2)}`, 'error');
                }
                this.monitoringStats.profit += trade.pnl;
                this.monitoringStats.balance = parseFloat(this.monitoringStats.balance) + trade.pnl;
                this.activeContracts.delete(id);
            }
        },
        async stopIA() {
            this.isStopping = true;
            this.stopTickConnection();
            this.addLog('⏹️ IA parada pelo usuário', 'info');
            localStorage.removeItem('ai_active_config');
            setTimeout(() => { this.$router.push('/StatsIAs'); }, 1000);
        },
        addLog(message, type) {
            this.monitoringLogs.unshift({
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString(),
                message,
                type
            });
            if (this.monitoringLogs.length > 100) this.monitoringLogs = this.monitoringLogs.slice(0, 100);
        }
    }
}
</script>

<style scoped>
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
	animation: fadeIn 0.3s ease-out forwards;
}
.dashboard-layout {
	display: flex;
	min-height: 100vh;
	background-color: #0B0B0B;
	color: #fff;
	font-family: 'Roboto', sans-serif;
}

.sidebar-overlay {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
}

.dashboard-content-wrapper {
	flex-grow: 1;
	margin-left: 280px;
	transition: margin-left 0.3s ease;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
	margin-left: 0;
}

.layout-content {
	flex-grow: 1;
	padding: 20px;
	padding-top: 50px;
	padding-bottom: 40px;
	background-color: #0B0B0B;
	width: 100%;
	overflow-y: auto;
}

@media (max-width: 1024px) {
	.dashboard-content-wrapper { margin-left: 0; }
	.dashboard-content-wrapper.sidebar-collapsed { margin-left: 0; }
	.layout-content { padding-top: 70px; }
}

.stats-card {
	background: rgba(20, 20, 20, 0.6);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-radius: 20px;
	padding: 1.25rem;
	display: flex;
	align-items: center;
	gap: 16px;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-card:hover {
	background: rgba(26, 26, 26, 0.8);
	border-color: rgba(34, 197, 94, 0.3);
	transform: translateY(-4px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.stats-icon-wrapper {
	width: 52px;
	height: 52px;
	border-radius: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22px;
	transition: all 0.3s ease;
}

.stats-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
.stats-icon-wrapper.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
.stats-icon-wrapper.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
.stats-icon-wrapper.yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2); }

.stats-card:hover .stats-icon-wrapper {
	transform: scale(1.1);
}

.glow-green-text {
	text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.text-zenix-green {
	color: #22C55E;
}

.stats-icon-wrapper.pulse {
	animation: statsPulse 2s infinite;
}

@keyframes statsPulse {
	0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
	70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
	100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.stats-label {
	display: block;
	font-size: 10px;
	text-transform: uppercase;
	color: #A1A1AA;
	font-weight: 800;
	letter-spacing: 0.1em;
	margin-bottom: 4px;
}

.stats-value {
	display: block;
	font-size: 20px;
	font-weight: 900;
	color: #fff;
	line-height: 1;
}

.monitoring-tabs-container {
	border-bottom: 1px solid #1A1A1A;
}

.tab-content-container {
	background: rgba(15, 15, 15, 0.8) !important;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.05) !important;
	border-radius: 20px !important;
	min-height: 480px !important;
}

.stop-btn {
	background-color: #ef4444;
	color: white;
	padding: 10px 20px;
	border-radius: 12px;
	font-weight: bold;
	font-size: 14px;
	transition: all 0.2s;
	border: none;
	cursor: pointer;
}

.stop-btn:hover {
	background-color: #dc2626;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #0F0F0F; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
</style>
