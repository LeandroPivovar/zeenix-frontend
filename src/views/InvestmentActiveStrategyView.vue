<template>
    <div class="dashboard-layout">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            :is-mobile="isMobile" 
            @close-sidebar="isSidebarOpen = false" 
            @toggle-collapse="toggleSidebarCollapse" 
            @open-settings="showSettingsModal = true" 
        />

        <div class="dashboard-content-wrapper">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="layout-content">
                <StrategyManager 
                    v-if="!isMonitoring" 
                    :balance="balance" 
                    @start-monitoring="handleStartMonitoring" 
                />

                <MonitoringDashboard 
                    v-else 
                    :stats="monitoringStats" 
                    :logs="monitoringLogs" 
                    :operations="monitoringOperations" 
                    :session-state="sessionState"
                    @stop="stopMonitoring"
                />
            </main>
        </div>

        <SettingsSidebar 
            :is-open="showSettingsModal" 
            @close="showSettingsModal = false" 
        />
    </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import SettingsSidebar from '../components/SettingsSidebar.vue';
import StrategyManager from '../components/ActiveStrategy/StrategyManager.vue';
import MonitoringDashboard from '../components/ActiveStrategy/MonitoringDashboard.vue';
import { StrategyAnalysis } from '../utils/StrategyAnalysis';

// Import strategy configurations
import apolloStrategy from '../utils/strategies/apollo.json';
import atlasStrategy from '../utils/strategies/atlas.json';
import nexusStrategy from '../utils/strategies/nexus.json';
import orionStrategy from '../utils/strategies/orion.json';
import titanStrategy from '../utils/strategies/titan.json';

const strategyConfigs = {
	apollo: apolloStrategy,
	atlas: atlasStrategy,
	nexus: nexusStrategy,
	orion: orionStrategy,
	titan: titanStrategy
};

export default {
    name: 'InvestmentActiveStrategyView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        StrategyManager,
        MonitoringDashboard
    },
    data() {
        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
            
            // Configuration structure 
            form: {
                initialStake: 0.35,
                profitTarget: 10,
                stopLoss: 50,
                market: 'R_100',
                strategy: 'Apollo'
            },
            
            // WebSocket & Market Data
            ws: null,
            tickSubscriptionId: null,
            isAuthorized: false,
            tickCount: 0,
            tickHistory: [],
            digitHistory: [],
            activeContracts: new Map(),

            balance: 0, 
            isMonitoring: false,
            
            sessionState: {
                isRecoveryMode: false,
                isStopped: false,
                peakProfit: 0,
                stopBlindadoActive: false,
                stopBlindadoFloor: 0
            },
            
            monitoringStats: {
                balance: 0,
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Inativo',
                statusDesc: 'Aguardando configuração'
            },
            
            monitoringLogs: [],
            monitoringOperations: []
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.stopTickConnection();
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth < 1024;
            if (this.isMobile) {
                this.isSidebarOpen = false;
            }
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        
        handleStartMonitoring(config) {
            // Map incoming config from StrategyManager
            this.form = {
                strategy: config.strategy || 'Apollo',
                stake: config.form?.initialStake || 0.35,
                market: config.form?.market || 'R_100',
                profitTarget: config.form?.profitTarget || 10,
                stopLoss: config.form?.stopLoss || 50
            };

            this.isMonitoring = true;
            this.monitoringStats.status = 'Conectando...';
            this.monitoringStats.statusDesc = 'Inicializando WebSocket';
            
            this.initTickConnection();
            this.$root.$toast.success('Robô iniciado com sucesso!');
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
                                this.balance = msg.authorize.balance;
                                this.monitoringStats.balance = this.balance;
                                this.addLog(`✅ Autorizado! Saldo: $${this.balance}`, 'success');
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
                    if (this.isMonitoring) {
                        this.addLog('📡 Conexão encerrada. Reconectando...', 'info');
                        setTimeout(() => this.initTickConnection(), 3000);
                    }
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
                    ticks: this.form.market,
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
                
                // Periodical log to show life
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
            // ✅ Sincronização: Aguardar resultado do contrato antes de nova análise
            if (this.activeContracts.size > 0) return;

            const strategyKey = this.form.strategy.toLowerCase();
            const strategyConfig = strategyConfigs[strategyKey];
            
            if (!strategyConfig || !strategyConfig.config) return;
            
            const attackFilters = strategyConfig.config.form.attackFilters || [];
            if (attackFilters.length === 0) return;

            const data = { tickHistory: this.tickHistory, digitHistory: this.digitHistory };
            const results = attackFilters.map(filter => StrategyAnalysis.evaluate(filter, data));
            const allPassed = results.every(r => r.pass);

            // Log details for failed filters only occasionally or based on logic (optional but useful for user)
            // results.forEach(res => { if (!res.pass) this.addLog(`🔍 ${res.reason}`, 'info'); });

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

            const tradeForm = strategyConfig.config.form;
            const stake = this.form.stake;

            const buyParams = {
                buy: 1,
                price: stake,
                parameters: {
                    amount: stake,
                    basis: 'stake',
                    contract_type: tradeForm.tradeType,
                    currency: 'USD',
                    duration: tradeForm.duration,
                    duration_unit: tradeForm.durationUnit,
                    symbol: this.form.market
                }
            };

            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(tradeForm.tradeType)) {
                buyParams.parameters.barrier = tradeForm.prediction.toString();
            }

            this.addLog(`💸 Executando: ${tradeForm.tradeType} em ${this.form.market} | Stake: $${stake}`, 'info');
            
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
                this.balance = parseFloat(this.balance) + trade.pnl;
                this.monitoringStats.balance = this.balance;

                this.activeContracts.delete(id);
                // checkLimits logic would go here if needed as in original ActiveStrategy
            }
        },

        stopMonitoring() {
            this.isMonitoring = false;
            this.monitoringStats.status = 'Parado';
            this.monitoringStats.statusDesc = 'Sessão encerrada pelo usuário';
            this.stopTickConnection();
            this.addLog('⏹️ IA parada pelo usuário', 'info');
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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
    .layout-content { padding-top: 70px; }
}
</style>
