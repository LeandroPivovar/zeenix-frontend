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

        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
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
            
            // Active Config (Populated on Start)
            form: {
                initialStake: 0.35,
                profitTarget: 10,
                stopLoss: 50,
                riskProfile: 'moderado', 
                useBlindado: false,
                stopBlindadoPercent: 50,
                duration: 1,
                durationUnit: 't',
                market: 'R_100',
                tradeType: null,
                prediction: 0, 
                attackFilters: []
            },
            
            recoveryConfig: {
                enabled: true,
                market: '',
                selectedTradeTypeGroup: '',
                tradeType: '',
                prediction: 0,
                lossesToActivate: 2,
                contractSwitch: true,
                switchToNormal: false,
                switchToPrecise: true,
                maxPreciseLosses: 3,
                pauseLosses: 6,
                pauseVolatility: 50,
                pauseTime: 5,
                attackFilters: []
            },

            // Strategy Execution State
            sessionState: {
                isRecoveryMode: false,
                consecutiveLosses: 0,
                totalLossAccumulated: 0,
                recoveredAmount: 0,
                lastPayoutRate: 0.95, 
                peakProfit: 0,
                stopBlindadoActive: false,
                stopBlindadoFloor: 0,
                isStopped: false
            },
            
            isFetchingContracts: false, // Legacy hold if needed or remove? keeping just in case WS needs it? No, WS doesn't use it.
            recoveryContracts: [], // Legacy...

            // WebSocket Tick & Trade Monitoring
            ws: null,
            tickSubscriptionId: null,
            tickCount: 0,
            lastTickPrice: null,
            tickHistory: [], 
            digitHistory: [], 
            isAuthorized: false,
            activeContracts: new Map(),

            balance: 5889.28, 
            isMonitoring: false,
            
            monitoringStats: {
                balance: 5889.28,
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Aguardando sinal...',
                statusDesc: 'Analisando condições de mercado'
            },
            monitoringLogs: [],
            monitoringOperations: [],
            simulationInterval: null
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        // Initial token verification/balance check could go here
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
            this.form = config.form;
            this.recoveryConfig = config.recoveryConfig;
            
            this.isMonitoring = true;
            this.startSimulation();
            this.$root.$toast.success('Estratégia iniciada com sucesso!');
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
                console.error('[Parent] Erro ao obter token:', e);
                return null;
            }
        },
        startSimulation() {
            this.addLog('🤖 Robô iniciado. Aguardando conexão com mercado...', 'info');
            this.initTickConnection();
        },
         async initTickConnection() {
            if (!this.form.market) {
                this.addLog('⚠️ Nenhum mercado selecionado.', 'error');
                return;
            }

            this.stopTickConnection();
            this.tickCount = 0;

            const appId = localStorage.getItem('deriv_app_id') || '1089';
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
            
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                this.addLog(`🔌 Conectado. Autorizando...`, 'info');
                const token = this.getDerivToken();
                
                if (token) {
                    console.log('[WS] Enviando token de autorização Deriv...');
                    this.ws.send(JSON.stringify({ authorize: token }));
                } else {
                    console.warn('[WS] Token Deriv não encontrado!');
                    this.addLog('⚠️ Token Deriv não encontrado. Operações reais desativadas.', 'warning');
                    this.subscribeTicks();
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    
                    if (['authorize', 'buy', 'proposal_open_contract'].includes(msg.msg_type) || msg.error) {
                         console.log(`[WS] Mensagem Recebida (${msg.msg_type}):`, msg);
                    }
                    
                    if (msg.msg_type === 'authorize') {
                        if (msg.error) {
                            console.error('[WS] Erro na autorização:', msg.error);
                            this.addLog(`❌ Falha na autorização: ${msg.error.message}`, 'error');
                        } else {
                            this.isAuthorized = true;
                            this.balance = msg.authorize.balance;
                            this.monitoringStats.balance = this.balance; // Sync initial balance
                            console.log('[WS] Autorizado com sucesso! Dados:', msg.authorize);
                            this.addLog(`✅ Autorizado! Saldo: $${this.balance}`, 'success');
                            this.subscribeTicks();
                        }
                    }

                    if (msg.msg_type === 'tick') {
                        this.handleTickMessage(msg);
                    }

                    if (msg.msg_type === 'buy') {
                        console.log('[WS] Resposta de compra recebida:', msg);
                        if (msg.error) {
                            console.error('[WS] Erro na compra:', msg.error);
                            this.addLog(`❌ ERRO NA COMPRA: ${msg.error.message}`, 'error');
                        } else {
                            const payout = msg.buy.payout;
                            const stake = msg.buy.buy_price;
                            const profitPercent = (((payout - stake) / stake) * 100).toFixed(0);
                            
                            console.log(`[WS] Sucesso! ID: ${msg.buy.contract_id}, Payout: $${payout} (${profitPercent}%)`);
                            this.addLog(`🚀 COMPRA REALIZADA! ID: ${msg.buy.contract_id} | Payout: $${payout} (${profitPercent}%)`, 'success');
                            this.subscribeToContract(msg.buy.contract_id);
                        }
                    }

                    if (msg.msg_type === 'proposal_open_contract') {
                        console.log('[WS] Atualização de contrato:', msg.proposal_open_contract);
                        this.handleContractUpdate(msg.proposal_open_contract);
                    }

                } catch (e) {
                    console.error('[WS] Erro JSON:', e);
                }
            };

            this.ws.onerror = (e) => {
                console.error('[WS] Erro:', e);
                this.addLog('❌ Erro na conexão com o mercado.', 'error');
            };

            this.ws.onclose = () => {
                if (this.isMonitoring) {
                    this.addLog('📡 Conexão encerrada. Tentando reconectar...', 'info');
                    setTimeout(() => {
                        if (this.isMonitoring) this.initTickConnection();
                    }, 3000);
                }
            };
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
            this.tickCount = 0;
        },

        subscribeTicks() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    ticks: this.form.market,
                    subscribe: 1
                }));
            }
        },

        handleTickMessage(msg) {
            if (msg.error) {
                this.addLog(`❌ Erro Deriv: ${msg.error.message}`, 'error');
                return;
            }

            if (msg.msg_type === 'tick' && msg.tick) {
                this.tickCount++;
                const price = msg.tick.quote;
                this.lastTickPrice = price;
                
                if (msg.subscription) {
                    this.tickSubscriptionId = msg.subscription.id;
                }

                this.addLog(`📈 Tick recebido: ${price} - Tick #${this.tickCount}`, 'info');
                
                this.tickHistory.unshift(price);
                if (this.tickHistory.length > 100) this.tickHistory.pop();

                const lastDigit = parseInt(price.toString().slice(-1));
                this.digitHistory.unshift(lastDigit);
                if (this.digitHistory.length > 100) this.digitHistory.pop();

                this.runAnalysis();
            }
        },
        runAnalysis() {
            const activeFilters = this.sessionState.isRecoveryMode 
                ? this.recoveryConfig.attackFilters 
                : this.form.attackFilters;
                
            if (!activeFilters || activeFilters.length === 0) return;

            const data = {
                tickHistory: this.tickHistory,
                digitHistory: this.digitHistory
            };

            const results = activeFilters.map(filter => {
                return StrategyAnalysis.evaluate(filter, data);
            });

            const allPassed = results.every(r => r.pass);
            
            results.forEach(res => {
                if (!res.pass) {
                    this.addLog(`🔍 Analisando: ${res.reason}`, 'info');
                }
            });

            if (allPassed) {
                this.addLog('🎯 SINAL GERADO! Filtros de ataque confirmados.', 'success');
                this.executeRealTrade(); 
            }
        },
        checkLimits() {
            if (this.sessionState.isStopped) return true;

            const lucroAtual = this.monitoringStats.profit;
            const target = this.form.profitTarget;
            const stopLoss = this.form.stopLoss;

            // 1. Profit Target
            if (target > 0 && lucroAtual >= target) {
                this.addLog(`🎯 META ATINGIDA: +$${lucroAtual.toFixed(2)}`, 'success');
                this.stopMonitoring('Meta atingida');
                return true;
            }

            // 2. Stop Blindado
            if (this.form.useBlindado && target > 0) {
                const activationThreshold = target * 0.40;
                const currentPeak = this.sessionState.peakProfit;

                if (currentPeak >= activationThreshold) {
                    if (!this.sessionState.stopBlindadoActive) {
                        this.sessionState.stopBlindadoActive = true;
                        const factor = (this.form.stopBlindadoPercent || 50) / 100;
                        this.sessionState.stopBlindadoFloor = activationThreshold * factor;
                        this.addLog(`🛡️ STOP BLINDADO ATIVADO! Piso: $${this.sessionState.stopBlindadoFloor.toFixed(2)}`, 'info');
                    }

                    if (lucroAtual <= this.sessionState.stopBlindadoFloor) {
                        this.addLog(`🛡️ STOP BLINDADO ATINGIDO: Protegendo $${lucroAtual.toFixed(2)}`, 'warning');
                        this.stopMonitoring('Stop Blindado atingido');
                        return true;
                    }
                }
            }

            // 3. Stop Loss
            if (stopLoss > 0 && lucroAtual <= -stopLoss) {
                this.addLog(`🛑 STOP LOSS ATINGIDO: -$${Math.abs(lucroAtual).toFixed(2)}`, 'error');
                this.stopMonitoring('Stop Loss atingido');
                return true;
            }

            return false;
        },
        calculateNextStake() {
            if (!this.sessionState.isRecoveryMode) {
                return this.form.initialStake;
            }

            const lossToRecover = this.sessionState.totalLossAccumulated - this.sessionState.recoveredAmount;
            
            let profitFactor = 0.15; 
            if (this.form.riskProfile === 'conservador') profitFactor = 0;
            else if (this.form.riskProfile === 'agressivo') profitFactor = 0.30;

            const config = this.recoveryConfig;
            let payoutRate = this.sessionState.lastPayoutRate;

            if (!payoutRate || payoutRate < 0.10) {
                if (config.tradeType === 'DIGITUNDER' && config.prediction === 8) payoutRate = 0.19;
                else if (config.tradeType === 'DIGITUNDER' && config.prediction === 4) payoutRate = 1.25;
                else if (config.tradeType === 'DIGITEVEN' || config.tradeType === 'DIGITODD') payoutRate = 0.95;
                else payoutRate = 0.95;
            }
            
            const stake = (lossToRecover * (1 + profitFactor)) / payoutRate;
            
            return Math.max(0.35, parseFloat(stake.toFixed(2)));
        },
        stopMonitoring(reason = 'Finalizado pelo usuário') {
            const stopReason = (reason instanceof Event) ? 'Finalizado pelo usuário' : reason;
            
            this.isMonitoring = false;
            this.sessionState.isStopped = true;
            this.monitoringStats.status = 'Parado';
            this.monitoringStats.statusDesc = stopReason;
            this.stopTickConnection();
            this.addLog(`⏹️ Monitoramento parado: ${stopReason}`, 'info');
        },
        executeRealTrade() {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado (Token inválido ou ausente).', 'warning');
                return;
            }

            if (this.checkLimits()) return;

            if (this.activeContracts.size > 0) {
                this.addLog('⏳ Sinal ignorado: Já existe uma operação em andamento.', 'info');
                return;
            }

            const stake = this.calculateNextStake();
            const config = this.sessionState.isRecoveryMode ? this.recoveryConfig : this.form;

            const buyParams = {
                buy: 1,
                price: stake,
                parameters: {
                    amount: stake,
                    basis: 'stake',
                    contract_type: config.tradeType,
                    currency: 'USD',
                    duration: this.form.duration,
                    duration_unit: this.form.durationUnit,
                    symbol: config.market || this.form.market
                }
            };

            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(config.tradeType)) {
                buyParams.parameters.barrier = config.prediction.toString(); 
            }

            this.addLog(`💸 Enviando ordem (${this.sessionState.isRecoveryMode ? 'RECUPERAÇÃO' : 'PRINCIPAL'}): ${config.tradeType} $${stake}`, 'info');
            this.ws.send(JSON.stringify(buyParams));
        },
        subscribeToContract(contractId) {
            this.ws.send(JSON.stringify({
                proposal_open_contract: 1,
                contract_id: contractId,
                subscribe: 1
            }));
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
                trade.result = contract.status.toUpperCase(); 
                trade.pnl = parseFloat(contract.profit || 0);

                if (trade.result === 'WON') {
                    this.monitoringStats.wins++;
                    this.addLog(`💰 WIN! Resultado: +$${trade.pnl.toFixed(2)} (Stake: $${trade.stake.toFixed(2)})`, 'success');
                    
                    if (trade.stake > 0) {
                        this.sessionState.lastPayoutRate = trade.pnl / trade.stake;
                    }

                    if (this.sessionState.isRecoveryMode) {
                        this.sessionState.recoveredAmount += trade.pnl;
                        if (this.sessionState.recoveredAmount >= this.sessionState.totalLossAccumulated) {
                            this.addLog('✅ RECUPERAÇÃO CONCLUÍDA!', 'success');
                            this.sessionState.isRecoveryMode = false;
                            this.sessionState.consecutiveLosses = 0;
                            this.sessionState.totalLossAccumulated = 0;
                            this.sessionState.recoveredAmount = 0;
                        }
                    } else {
                        this.sessionState.consecutiveLosses = 0;
                        this.sessionState.totalLossAccumulated = 0;
                    }
                } else {
                    this.monitoringStats.losses++;
                    this.addLog(`🔴 LOSS! Prejuízo: -$${Math.abs(trade.pnl).toFixed(2)} (Stake: $${trade.stake.toFixed(2)})`, 'error');
                    
                    this.sessionState.consecutiveLosses++;
                    this.sessionState.totalLossAccumulated += Math.abs(trade.pnl);

                    if (!this.sessionState.isRecoveryMode && 
                        this.recoveryConfig.enabled && 
                        this.sessionState.consecutiveLosses >= this.recoveryConfig.lossesToActivate) {
                        this.addLog('🔄 ATIVANDO MODO RECUPERAÇÃO...', 'warning');
                        this.sessionState.isRecoveryMode = true;
                        this.sessionState.recoveredAmount = 0;
                    }
                }
                
                this.monitoringStats.profit += trade.pnl;
                this.monitoringStats.balance = parseFloat(this.balance) + this.monitoringStats.profit;
                
                if (this.monitoringStats.profit > this.sessionState.peakProfit) {
                    this.sessionState.peakProfit = this.monitoringStats.profit;
                }

                this.activeContracts.delete(id);
                this.checkLimits();
            }
        },
        addLog(message, type) {
            this.monitoringLogs.unshift({
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                message,
                type
            });
            if (this.monitoringLogs.length > 50) this.monitoringLogs.pop();
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
</style>
