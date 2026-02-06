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

        <div class="dashboard-content-wrapper transition-all duration-300" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
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
import RiskManager from '../utils/RiskManager'; // ✅ Added RiskManager

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
            isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
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
            recoveryConfig: {},
            
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
            localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed.toString());
        },
        
        handleStartMonitoring(config) {
            // Map incoming config from StrategyManager
            // Ensure we have the full strategy config structure
            const strategyKey = (config.strategyName || config.strategy || 'Apollo').toLowerCase();
            const fullConfig = strategyConfigs[strategyKey]?.config || strategyConfigs['apollo'].config;

            this.form = {
                strategy: config.strategyName || config.strategy || 'Apollo',
                stake: config.form?.initialStake || 0.35,
                market: config.form?.market || 'R_100',
                profitTarget: config.form?.profitTarget || 10,
                stopLoss: config.form?.stopLoss || 50,
                // Merge with full config for advanced fields
                ...fullConfig.form,
                // Overwrites from UI inputs
                initialStake: config.form?.initialStake || fullConfig.form.initialStake,
            };
            
            this.recoveryConfig = {
                ...fullConfig.recoveryConfig
            };

            // Initialize Risk Session
            this.sessionState = RiskManager.initSession(this.form.mode || 'VELOZ');
            
            // Populate extra fields for MonitoringDashboard UI
            this.sessionState.strategy = this.form.strategy;
            this.sessionState.mode = this.sessionState.negotiationMode || 'VELOZ';
            this.sessionState.modoMartingale = config.form?.riskProfile || 'Moderado';
            this.sessionState.stake = this.form.initialStake;
            this.sessionState.profitTarget = this.form.profitTarget;
            this.sessionState.lossLimit = this.form.stopLoss;
            this.sessionState.stoplossBlindado = config.form?.useBlindado || false;
            this.sessionState.activeStrategy = 'PRINCIPAL';

            this.monitoringStats = {
                balance: this.balance || 0, // Use current balance if available
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Conectando...',
                statusDesc: 'Inicializando WebSocket'
            };

            this.isMonitoring = true;
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
                            
                        // PROPOSAL RESPONSE (Validate Payout)
                        if (msg.msg_type === 'proposal') {
                            if (msg.error) {
                                this.addLog(`❌ Proposta negada: ${msg.error.message}`, 'error');
                                return;
                            }
                            
                            const proposalId = msg.proposal.id;
                            const payout = msg.proposal.payout;
                            const stakeValue = msg.proposal.ask_price;
                            
                            this.addLog(`🔍 Proposta recebida: Payout $${payout} (Stake: $${stakeValue})`, 'info');
                            
                            // BUY
                            this.addLog(`💸 Comprando contrato via ID: ${proposalId}`, 'info');
                            this.ws.send(JSON.stringify({
                                buy: proposalId,
                                price: stakeValue
                            }));
                        }

                        if (msg.msg_type === 'buy') {
                            if (msg.error) {
                                this.addLog(`❌ Erro na compra: ${msg.error.message}`, 'error');
                            } else {
                                const payout = msg.buy.payout;
                                const stake = msg.buy.buy_price;
                                const contractType = this.sessionState.lastContractType || 'Contrato';
                                const profitExpected = (payout - stake).toFixed(2);
                                
                                const logMsg = `🚀 COMPRA REALIZADA!<br>` +
                                    `• Contrato: ${contractType}<br>` +
                                    `• Investimento: $${stake.toFixed(2)}<br>` +
                                    `• Payout Esperado: $${payout} (${(((payout-stake)/stake)*100).toFixed(0)}%)<br>` +
                                    `• Lucro Esperado: $${profitExpected}`;
                                    
                                this.addLog(logMsg, 'success');
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
                
                // Periodical log
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
            // Strict sync: Wait for contract
            if (this.activeContracts.size > 0) return;

            // Determines which filter config to use based on active MODE (Principal vs Recovery)
            const activeFilters = this.sessionState.activeStrategy === 'RECUPERACAO' 
                ? this.recoveryConfig.attackFilters 
                : this.form.attackFilters;
            
            if (!activeFilters || activeFilters.length === 0) return;

            const data = { tickHistory: this.tickHistory, digitHistory: this.digitHistory };
            const results = activeFilters.map(filter => 
                StrategyAnalysis.evaluate(filter, data, this.sessionState.negotiationMode)
            );
            const allPassed = results.every(r => r.pass);

            // Detailed logging like Strategy Creator
             results.forEach(res => {
                if (!res.pass) {
                   // Optional: this.addLog(`⏸️ ENTRADA BLOQUEADA: ${res.reason}`, 'warning');
                }
            });

            if (allPassed) {
                const mode = this.sessionState.negotiationMode || 'VELOZ';
                const isRec = this.sessionState.activeStrategy === 'RECUPERACAO';
                
                // Collect signals from all filters that opted to provide a direction
                const directions = results.map(r => r.direction).filter(d => d);
                let dynamicContractType = null;
                
                if (directions.length > 0) {
                     // Require Consensus: If multiple filters provide direction, they must match
                     const uniqueDirections = [...new Set(directions)];
                     if (uniqueDirections.length === 1) {
                         const signal = uniqueDirections[0];
                         const baseType = (this.form.tradeType || '').toUpperCase();
                         
                         // Map Signal to Contract Type
                         if (['CALL', 'UP'].includes(signal)) {
                             dynamicContractType = baseType.includes('DIGIT') ? 'DIGITOVER' : 'CALL';
                         } else if (['PUT', 'DOWN'].includes(signal)) {
                             dynamicContractType = baseType.includes('DIGIT') ? 'DIGITUNDER' : 'PUT';
                         } else if (['DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(signal)) {
                             dynamicContractType = signal;
                         } else {
                             dynamicContractType = baseType; 
                         }

                         // ✅ Direction Mode Restriction
                         const configModel = isRec ? this.recoveryConfig : this.form;
                         const directionMode = configModel.directionMode || 'both';

                         if (directionMode !== 'both') {
                             const isUpSignal = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                             const isDownSignal = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                             
                             if ((directionMode === 'up' && !isUpSignal) || (directionMode === 'down' && !isDownSignal)) {
                                 this.addLog(`🚫 Direção Restrita: Sinal ${signal} ignorado. Modo: ${directionMode}`, 'info');
                                 return;
                             }
                         }

                         // ✅ Resolve Dynamic Payout
                         const directionPayouts = configModel.directionPayouts || {};
                         const explicitPayout = directionPayouts[dynamicContractType] || null;
                         this.sessionState.tempExplicitPayout = explicitPayout;
                         
                         this.addLog('🧭 Direção Dinâmica', [
                            `Sinal: ${signal} → ${dynamicContractType}`,
                            explicitPayout ? `Payout: ${(explicitPayout * 100).toFixed(0)}%` : 'Payout: Padrão'
                         ], 'info');
                     } else {
                         this.addLog('⚠️ Conflito de Direção', `Filtros divergentes: ${uniqueDirections.join(', ')}`, 'warning');
                         return; // BLOCK TRADE due to conflict
                     }
                }

                this.addLog(`🧠 ANÁLISE: ${mode} ${isRec ? '(RECUPERAÇÃO)' : ''} | Filtros OK`, 'info');
                this.executeAITrade(dynamicContractType, this.sessionState.tempExplicitPayout);
                this.sessionState.tempExplicitPayout = null; // Clean up
            }
        },
        
        calculateNextStake(explicitPayout = null) {
            const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            const config = isRecovery ? this.recoveryConfig : this.form;
            
            const stake = RiskManager.calculateNextStake(this.sessionState, config, explicitPayout);
            
            // Log Soros activation (Principal only)
            const sorosLevel = config.sorosLevel || 1;
            if (!isRecovery && 
                this.sessionState.consecutiveWins >= 1 && 
                this.sessionState.consecutiveWins <= sorosLevel &&
                this.sessionState.lastResultWin) {
                
                if (stake > config.initialStake) {
                     this.addLog(`🚀 SOROS ATIVADO: Stake base + último lucro = $${stake.toFixed(2)}`, 'info');
                }
            }
            return stake;
        },

        executeAITrade(overrideContractType = null, explicitPayout = null) {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado', 'warning');
                return;
            }
            if (this.activeContracts.size > 0) return;

            if (this.checkLimits()) return;

            const isRecoveryStrategy = this.sessionState.activeStrategy === 'RECUPERACAO';
            const isFinancialRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            
            // Select correct config
            const config = (isFinancialRecovery || isRecoveryStrategy) ? this.recoveryConfig : this.form;
            
            // Update Contract Type state
            this.sessionState.lastContractType = config.tradeType;
            
            const stake = this.calculateNextStake(explicitPayout);

            this.addLog(`📡 Solicitando proposta (${isFinancialRecovery ? 'RECUPERAÇÃO' : 'PRINCIPAL'}): ${config.tradeType} $${stake}`, 'info');

            // Request Proposal First (Critical for Payout Validation)
            const proposalParams = {
                proposal: 1,
                amount: stake,
                basis: 'stake',
                contract_type: overrideContractType || config.tradeType,
                currency: 'USD',
                duration: config.duration || this.form.duration || 1, // Fallback
                duration_unit: config.durationUnit || this.form.durationUnit || 't',
                symbol: this.form.market
            };

            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(config.tradeType)) {
                proposalParams.barrier = config.prediction.toString();
            }

            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(proposalParams));
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

                // Update Stats
                this.monitoringStats.profit += trade.pnl;
                this.balance = parseFloat(this.balance) + trade.pnl;
                this.monitoringStats.balance = this.balance;

                // Sync RiskManager State
                RiskManager.processTradeResult(
                    this.sessionState, 
                    trade.result === 'WIN', // RiskManager expects boolean
                    trade.pnl, 
                    trade.stake, 
                    this.sessionState.analysisType, // pass current analysis type (Principal/Recup)
                    this.recoveryConfig.lossesToActivate
                );

                this.activeContracts.delete(id);
                this.checkLimits();
            }
        },

        checkLimits() {
            if (this.sessionState.isStopped) return true;
            
            const profit = this.monitoringStats.profit;
            const target = this.form.profitTarget;
            const stopLoss = this.form.stopLoss;

            if (target > 0 && profit >= target) {
                 this.addLog(`🎯 META BATIDA! +$${profit.toFixed(2)}`, 'success');
                 this.stopMonitoring();
                 return true;
            }
            if (stopLoss > 0 && profit <= -stopLoss) {
                 this.addLog(`🛑 STOP LOSS! -$${Math.abs(profit).toFixed(2)}`, 'error');
                 this.stopMonitoring();
                 return true;
            }
            return false;
        },

        stopMonitoring() {
            this.isMonitoring = false;
            this.monitoringStats.status = 'Parado';
            this.monitoringStats.statusDesc = 'Sessão encerrada';
            this.stopTickConnection();
            this.addLog('⏹️ Operação finalizada.', 'info');
            
            // ✅ Limpar configuração ativa e redirecionar
            localStorage.removeItem('ai_active_config');
            setTimeout(() => {
                this.$router.push('/Investments-IA');
            }, 1000);
        },

        addLog(message, type) {
            this.monitoringLogs.unshift({
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString(),
                message,
                type
            });
            if (this.monitoringLogs.length > 5000) this.monitoringLogs = this.monitoringLogs.slice(0, 5000);
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
    padding: 20px 0; /* Changed to 0 horizontal padding for 100% width effect */
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
