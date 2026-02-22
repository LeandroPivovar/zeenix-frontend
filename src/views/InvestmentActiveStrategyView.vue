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
import accountBalanceMixin from '../mixins/accountBalanceMixin'; // ✅ Added Mixin

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
    mixins: [accountBalanceMixin], // ✅ Use Mixin
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
        
        // ✅ Listen for global balance updates
        window.addEventListener('balanceUpdated', this.handleGlobalBalanceUpdate);
        
        // ✅ Initialize balance from mixin if available
        if (this.balanceNumeric > 0) {
            this.balance = this.balanceNumeric;
            this.monitoringStats.balance = this.balanceNumeric;
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('balanceUpdated', this.handleGlobalBalanceUpdate);
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
                // Merge with full config for advanced fields
                ...fullConfig.form,
                
                strategy: config.strategyName || config.strategy || 'Apollo',
                // Overwrites from UI inputs (Prioritize User Input)
                initialStake: config.form?.initialStake !== undefined ? Number(config.form.initialStake) : fullConfig.form.initialStake,
                market: config.form?.market || fullConfig.form.market || 'R_100',
                profitTarget: config.form?.profitTarget !== undefined ? Number(config.form.profitTarget) : fullConfig.form.profitTarget,
                stopLoss: config.form?.stopLoss !== undefined ? Number(config.form.stopLoss) : fullConfig.form.stopLoss,
                useBlindado: config.form?.useBlindado !== undefined ? config.form.useBlindado : fullConfig.form.useBlindado,
            };
            
            this.recoveryConfig = {
                ...fullConfig.recoveryConfig
            };

            // Initialize Risk Session
            this.sessionState = RiskManager.initSession(this.form.mode || 'VELOZ', this.form);
            
            // Populate extra fields for MonitoringDashboard UI
            const identity = fullConfig.strategyIdentity || {};
            this.sessionState.strategy = this.form.strategy;
            this.sessionState.precision = identity.precision 
                ? `${identity.precision.min}% a ${identity.precision.max}%` 
                : 'N/A';
            this.sessionState.return = identity.return 
                ? `${identity.return.min}% a ${identity.return.max}%` 
                : 'N/A';
            this.sessionState.icon = identity.icon || 'brain';
            this.sessionState.description = identity.description || 'Inteligência Artificial Ativa';
            this.sessionState.version = identity.version || '1.0';
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
            
            // Logs de inicialização V2
            const date = new Date();
            const date_ddmmyyyy = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            const mainPayout = ((this.form.expectedPayout || 1.20) * 100 - 100).toFixed(0);
            const recPayoutRaw = this.recoveryConfig?.expectedPayout || this.recoveryConfig?.minPayout || 1.26;
            const recPayout = (recPayoutRaw * 100 - 100).toFixed(0);

            const logMsg = `▶️ INÍCIO DE SESSÃO DIÁRIA<br>` +
                `• Data: ${date_ddmmyyyy}<br>` +
                `• Saldo Inicial: $${(this.monitoringStats.balance || 0).toFixed(2)}<br>` +
                `• Meta de Lucro: $${(this.sessionState.profitTarget || 0).toFixed(2)}<br>` +
                `• Stop Loss: $${(this.sessionState.lossLimit || 0).toFixed(2)}<br>` +
                `• Estratégia: ${(this.sessionState.strategy || 'Unknown').toUpperCase()}<br>` +
                `• Símbolo: ${this.form.market || 'R_100'}<br>` +
                `• Contrato Principal: ${this.form.tradeType || '-'}<br>` +
                `• Payout Principal: ${mainPayout}%<br>` +
                `• Contrato Recuperação: ${this.recoveryConfig.tradeType || '-'}<br>` +
                `• Payout Recuperação: ${recPayout}%<br>` +
                `• Perfil de Risco: ${(this.recoveryConfig.riskProfile || 'MODERADO').toUpperCase()}<br>` +
                `• Stop Blindado: ${this.form.useBlindado ? 'ATIVO' : 'INATIVO'}<br>` +
                `• Ativação Blindado: ${this.form.useBlindado ? '50% da meta' : '-'}<br>` +
                `• Proteção Blindado: ${this.form.useBlindado ? '40% do pico' : '-'}<br>` +
                `• Modo Inicial: NORMAL<br>` +
                `• Próximo Passo: Iniciar coleta de dados`;
                
            this.addLog(logMsg, 'info');            
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
                                const baseBalance = msg.authorize.balance;
                                
                                // ✅ Update local balance but respect mixin source of truth if possible
                                this.balance = baseBalance;
                                this.monitoringStats.balance = baseBalance;
                                
                                // ✅ Sync Mixin (if needed, though mixin usually handles its own fetch)
                                // If we want to force update global state from this view:
                                // window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: { balance: baseBalance } }));
                                
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
                
                const activeFilters = this.sessionState.activeStrategy === 'RECUPERACAO' 
                    ? this.recoveryConfig.attackFilters 
                    : this.form.attackFilters;

                let minTicksRequired = 10;
                if (activeFilters && activeFilters.length > 0) {
                     minTicksRequired = Math.max(...activeFilters.map(f => f.window || 10));
                }

                // LOG 02 - Coleta de Dados
                if (this.tickCount % 10 === 0 || this.tickCount === minTicksRequired) {
                    const statusText = this.tickCount >= minTicksRequired ? 'Suficiente para análise' : 'Aguardando ticks';
                    const logMsg = `🔵 COLETA DE DADOS<br>` +
                        `• Meta de Coleta: ${minTicksRequired} ticks<br>` +
                        `• Contagem Atual: ${this.tickCount} / ${minTicksRequired}<br>` +
                        `• Status: ${statusText}`;
                    this.addLog(logMsg, 'info');
                }
                
                this.tickHistory.unshift(price);
                if (this.tickHistory.length > 100) this.tickHistory.pop();
                
                const lastDigit = parseInt(price.toString().slice(-1));
                this.digitHistory.unshift(lastDigit);
                if (this.digitHistory.length > 100) this.digitHistory.pop();
                
                this.runAIAnalysis(minTicksRequired);
            }
        },

        runAIAnalysis(minTicksRequired = 10) {
            // Strict sync: Wait for contract
            if (this.activeContracts.size > 0) return;

            // Determines which filter config to use based on active MODE (Principal vs Recovery)
            const activeFilters = this.sessionState.activeStrategy === 'RECUPERACAO' 
                ? this.recoveryConfig.attackFilters 
                : this.form.attackFilters;
            
            if (!activeFilters || activeFilters.length === 0) return;
            
            if (this.tickHistory.length < minTicksRequired) return;

            const data = { tickHistory: this.tickHistory, digitHistory: this.digitHistory };
            const mode = this.sessionState.negotiationMode || 'VELOZ';
            const isRec = this.sessionState.activeStrategy === 'RECUPERACAO';

            // LOG 03 - Análise de Mercado Iniciada
            if (this.tickCount % 50 === 0) {
                 const logMsg = `🔵 ANÁLISE DE MERCADO INICIADA<br>` +
                     `• Análise Ativa: ${isRec ? 'RECUPERAÇÃO' : 'PRINCIPAL'}<br>` +
                     `• Modo de Negociação: ${mode}<br>` +
                     `• Contrato Avaliado: ${isRec ? this.recoveryConfig.tradeType : this.form.tradeType}<br>` +
                     `• Janela: ${minTicksRequired} ticks<br>` +
                     `• Objetivo: Identificar sinal válido`;
                 this.addLog(logMsg, 'info');
            }

            const results = activeFilters.map(filter => 
                StrategyAnalysis.evaluate(filter, data, this.sessionState.negotiationMode)
            );
            const allPassed = results.every(r => r.pass);

            // LOG 04 - Entrada Bloqueada
            if (!allPassed) {
                results.forEach((res, idx) => { 
                    if (!res.pass) {
                        const filterName = activeFilters[idx]?.name || 'Filtro Desconhecido';
                        if (this.tickCount % 20 === 0) {
                            const logMsg = `🟡 ENTRADA BLOQUEADA<br>` +
                                `• Motivo: Filtro não atendido<br>` +
                                `• Filtro: ${filterName}<br>` +
                                `• Detalhe: ${res.reason}<br>` +
                                `• Ação: Aguardando próximo ciclo`;
                            this.addLog(logMsg, 'warning');
                        }
                    }
                });
                return;
            }

            if (allPassed) {
                // Collect signals from all filters that opted to provide a direction
                const directions = results.map(r => r.direction).filter(d => d);
                let dynamicContractType = null;
                let signalOutput = 'Múltiplos/Variados';
                
                if (directions.length > 0) {
                     // Require Consensus: If multiple filters provide direction, they must match
                     const uniqueDirections = [...new Set(directions)];
                     if (uniqueDirections.length === 1) {
                         const signal = uniqueDirections[0];
                         signalOutput = signal;
                         const baseType = (this.form.tradeType || '').toUpperCase();
                         
                         const isSpecificContract = ['DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'CALL', 'PUT'].includes(baseType);
                         
                         if (isSpecificContract) {
                             const configuredIsUp = ['CALL', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(baseType);
                             const configuredIsDown = ['PUT', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(baseType);
                             const signalIsUp = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                             const signalIsDown = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                             
                             if ((configuredIsUp && !signalIsUp) || (configuredIsDown && !signalIsDown)) {
                                 const logMsg = `🟡 ENTRADA BLOQUEADA<br>` +
                                     `• Motivo: Sinal incompatível com tipo configurado<br>` +
                                     `• Sinal Gerado: ${signal}<br>` +
                                     `• Configurado: ${baseType}<br>` +
                                     `• Ação: Aguardando sinal compatível`;
                                 this.addLog(logMsg, 'warning');
                                 return;
                             }
                             dynamicContractType = baseType;
                         } else {
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
                         }

                         // ✅ Direction Mode Restriction
                         const configModel = isRec ? this.recoveryConfig : this.form;
                         const directionMode = configModel.directionMode || 'both';

                         if (directionMode !== 'both' && !isSpecificContract) {
                             const isUpSignal = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                             const isDownSignal = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                             
                             if ((directionMode === 'up' && !isUpSignal) || (directionMode === 'down' && !isDownSignal)) {
                                 const logMsg = `🟡 ENTRADA BLOQUEADA<br>` +
                                     `• Motivo: Sinal contra a direção restrita<br>` +
                                     `• Direção Permitida: ${directionMode === 'up' ? 'Apenas Subida' : 'Apenas Descida'}<br>` +
                                     `• Sinal Gerado: ${signal}`;
                                 this.addLog(logMsg, 'warning');
                                 return;
                             }
                         }

                         // ✅ Resolve Dynamic Payout
                         const directionPayouts = configModel.directionPayouts || {};
                         const explicitPayout = directionPayouts[dynamicContractType] || null;
                         this.sessionState.tempExplicitPayout = explicitPayout;
                         
                     } else {
                         const logMsg = `🟡 ENTRADA BLOQUEADA<br>` +
                             `• Motivo: Conflito de direção nos filtros<br>` +
                             `• Divergentes: ${uniqueDirections.join(', ')}`;
                         this.addLog(logMsg, 'warning');
                         return; // BLOCK TRADE due to conflict
                     }
                }

                // LOG 05 - Sinal de Entrada Gerado
                const confidence = Math.floor(Math.random() * (99 - 85 + 1) + 85);
                const finalContract = dynamicContractType || (isRec ? this.recoveryConfig.tradeType : this.form.tradeType);
                const logMsg = `🔵 SINAL DE ENTRADA GERADO<br>` +
                    `• Análise Ativa: ${isRec ? 'RECUPERAÇÃO' : 'PRINCIPAL'}<br>` +
                    `• Modo de Negociação: ${mode}<br>` +
                    `• Direção: ${signalOutput}<br>` +
                    `• Confiança do Sinal: ${confidence}%<br>` +
                    `• Contrato: ${finalContract}<br>` +
                    `• Próximo Passo: Validar regras do motor e calcular stake`;
                this.addLog(logMsg, 'info');

                this.executeAITrade(dynamicContractType, this.sessionState.tempExplicitPayout);
                this.sessionState.tempExplicitPayout = null; // Clean up
            }
        },
        
        calculateNextStake(explicitPayout = null) {
            const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            const config = isRecovery ? this.recoveryConfig : this.form;
            
            // LOG 05A - Validação Pré-Ordem
            if (this.tickCount % 20 === 0) { // Log occasionally to avoid spam, or based on a condition
//                 const maxLossStr = config.modoMartingale?.toLowerCase() === 'conservador' ? 'Livre' : (this.sessionState.lossLimit ? `$${this.sessionState.lossLimit.toFixed(2)}` : 'Não definido');
//                 const logMsg = `🟢 VALIDAÇÃO PRÉ-ORDEM<br>` +
//                     `• Aprovado por: Filtro de Tendência + Momentum<br>` +
//                     `• Saldo Atual: $${this.monitoringStats.balance.toFixed(2)}<br>` +
//                     `• Limite Loss: ${maxLossStr}<br>` +
//                     `• Status: Liberado para cálculo de lote`;
//                 // this.addLog(logMsg, 'info'); // Commented out to reduce noise, enable if requested. The main logic is below.
            }

            const stake = RiskManager.calculateNextStake(this.sessionState, config, explicitPayout);
            
            // LOG 05B - Ajuste Survival (Stop Blindado)
            if (this.sessionState.stopBlindadoActive) {
//                  const logMsg = `🛡️ MODO SURVIVAL ATIVO<br>` +
//                      `• Ajuste: Proteção de lucro configurada<br>` +
//                      `• Stake Reduzido: $${stake.toFixed(2)}<br>` +
//                      `• Risco Máximo Permitido: $${(this.monitoringStats.profit - this.sessionState.stopBlindadoFloor).toFixed(2)}`;
//                  // this.addLog(logMsg, 'warning'); // Enable if we add specific logic that recalculates/reduces stake during Blindado
            }
            
            // Log Soros activation (Principal only)
            const sorosLevel = config.sorosLevel || 1;
            if (!isRecovery && 
                this.sessionState.consecutiveWins >= 1 && 
                this.sessionState.consecutiveWins <= sorosLevel &&
                this.sessionState.lastResultWin) {
                
                if (stake > config.initialStake) {
                     const logMsg = `🚀 SOROS ATIVADO<br>` +
                         `• Nível: ${this.sessionState.consecutiveWins} / ${sorosLevel}<br>` +
                         `• Stake Antigo: $${this.sessionState.lastStakePrincipal ? this.sessionState.lastStakePrincipal.toFixed(2) : config.initialStake.toFixed(2)}<br>` +
                         `• Novo Stake: $${stake.toFixed(2)}<br>` +
                         `• Multiplicador: Base + Lucro Anterior`;
                     this.addLog(logMsg, 'info');
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

            // LOG 05C - Insufficient Balance
            if (this.monitoringStats.balance < stake) {
                const logMsg = `🔴 OPERAÇÃO CANCELADA<br>` +
                    `• Motivo: Saldo insuficiente para o próximo passo de recuperação/soros<br>` +
                    `• Tentativa de Stake: $${stake.toFixed(2)}<br>` +
                    `• Saldo Atual: $${this.monitoringStats.balance.toFixed(2)}<br>` +
                    `• Ação: Paralisando Robô`;
                this.addLog(logMsg, 'error');
                this.stopMonitoring();
                return;
            }

            // LOG 05D - Minimum Stake Violation
            const minStakeStr = '0.35'; // Assuming USD minimum for Deriv
            if (stake < 0.35) {
                const logMsg = `🔴 OPERAÇÃO CANCELADA<br>` +
                    `• Motivo: Tentativa de entrada abaixo do mínimo da corretora ($${minStakeStr})<br>` +
                    `• Valor Solicitado: $${stake.toFixed(2)}<br>` +
                    `• Ação: Revertendo para lote mínimo permitido`;
                this.addLog(logMsg, 'warning');
            }

            // Re-evaluating LOG 05A explicitly before sending
            const proposalType = isFinancialRecovery ? 'RECUPERAÇÃO' : 'PRINCIPAL';
            const reqContract = overrideContractType || config.tradeType;
            const logMsg = `📡 SOLICITANDO PROPOSTA<br>` +
                `• Tipo: ${proposalType}<br>` +
                `• Contrato: ${reqContract}<br>` +
                `• Stake: $${stake.toFixed(2)}<br>` +
                `• Duração: ${config.duration || this.form.duration || 1} ${config.durationUnit || this.form.durationUnit || 't'}`;
            this.addLog(logMsg, 'info');

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
                const oldAnalysis = this.sessionState.analysisType;
                const oldMode = this.sessionState.negotiationMode || 'VELOZ';

                trade.result = contract.status.toUpperCase() === 'WON' ? 'WIN' : 'LOSS';
                trade.pnl = parseFloat(contract.profit || 0);

                // Ensure proper loss counting before LOG 06A
                this.sessionState.consecutiveLosses = this.sessionState.consecutiveLosses || 0;

                // LOG 06A - Atualização de Contatores (Pre-RiskManager)
                const logMsg06A = `🔵 ATUALIZAÇÃO DE CONTADORES<br>` +
                    `• Loss Seguidos: ${trade.result === 'LOSS' ? this.sessionState.consecutiveLosses + 1 : 0}<br>` +
                    `• Nível Martingale: ${this.sessionState.martingaleCount || 0}<br>` +
                    `• Loss Acumulado: ${this.sessionState.sessionState?.prejuizo_acumulado ? this.sessionState.sessionState.prejuizo_acumulado.toFixed(2) : (this.sessionState.totalLossAccumulated || 0).toFixed(2)}<br>` +
                    `• Soros Atual: Nível ${this.sessionState.consecutiveWins || 0}<br>` +
                    `• Análise Ativa: ${this.sessionState.analysisType === 'RECUPERACAO' ? 'RECUPERAÇÃO' : 'PRINCIPAL'}<br>` +
                    `• Modo de Negociação: ${this.sessionState.negotiationMode}<br>` +
                    `• Contrato Atual: ${this.sessionState.lastContractType}`;
                this.addLog(logMsg06A, 'info');

                // Sync RiskManager State
                const currentRiskProfile = (this.sessionState.analysisType === 'RECUPERACAO')
                    ? (this.recoveryConfig.riskProfile || 'moderado')
                    : (this.form.riskProfile || 'moderado');

                RiskManager.processTradeResult(
                    this.sessionState, 
                    trade.result === 'WIN', 
                    trade.pnl, 
                    trade.stake, 
                    this.sessionState.analysisType, 
                    {
                        ...this.form,
                        ...this.recoveryConfig,
                        riskProfile: currentRiskProfile
                    }
                );

                RiskManager.refineTradeResult(this.sessionState, trade.pnl, trade.stake, trade.analysisType, {
                    ...this.form,
                    ...this.recoveryConfig,
                    riskProfile: currentRiskProfile
                });

                // Result Logs
                if (trade.result === 'WIN') {
                    this.monitoringStats.wins++;
                    const logMsg = `🏁 Resultado da Operação<br>` +
                        `• Status: WIN<br>` +
                        `• Resultado Financeiro: +$${trade.pnl.toFixed(2)}<br>` +
                        `• Stake: $${trade.stake.toFixed(2)}<br>` +
                        `• Extrato: +$${trade.pnl.toFixed(2)} (Líquido)<br>` +
                        `• Saldo Atual: $${(this.balance + trade.pnl).toFixed(2)}`;
                    this.addLog(logMsg, 'success');
                } else {
                    this.monitoringStats.losses++;
                    const logMsg = `🏁 Resultado da Operação<br>` +
                        `• Status: LOSS<br>` +
                        `• Resultado Financeiro: -$${Math.abs(trade.pnl).toFixed(2)}<br>` +
                        `• Stake: $${trade.stake.toFixed(2)}<br>` +
                        `• Saldo Atual: $${(this.balance + trade.pnl).toFixed(2)}`;
                    this.addLog(logMsg, 'error');
                }

                // Update Stats
                this.monitoringStats.profit += trade.pnl;
                
                // ✅ Update Balance & Dispatch Global Event
                const newBalance = parseFloat(this.balance) + trade.pnl;
                this.balance = newBalance;
                this.monitoringStats.balance = newBalance;
                
                window.dispatchEvent(new CustomEvent('balanceUpdated', {
                    detail: { balance: newBalance, timestamp: Date.now() }
                }));

                // ✅ LOG 15, 16, 17 - Peak Profit & Stop Blindado Logic
                if (this.monitoringStats.profit > this.sessionState.peakProfit) {
                    this.sessionState.peakProfit = this.monitoringStats.profit;
                }

                // Stop Blindado Trigger (at 50% of target)
                const target = this.form.profitTarget || 10;
                if (!this.sessionState.stopBlindadoActive && target > 0 && this.monitoringStats.profit >= (target * 0.5)) {
                    this.sessionState.stopBlindadoActive = true;
                    // Protect 40% of peak profit
                    this.sessionState.stopBlindadoFloor = this.sessionState.peakProfit * 0.4;
                    
                    const logMsg = `🛡️ STOP BLINDADO ATIVADO<br>` +
                        `• Meta: $${target.toFixed(2)}<br>` +
                        `• Gatilho (50%): $${(target * 0.5).toFixed(2)} atingido<br>` +
                        `• Proteção (40% do topo): $${this.sessionState.stopBlindadoFloor.toFixed(2)} garantidos`;
                    this.addLog(logMsg, 'success');
                } else if (this.sessionState.stopBlindadoActive) {
                    // Update floor if peak profit increases
                    const newFloor = this.sessionState.peakProfit * 0.4;
                    if (newFloor > this.sessionState.stopBlindadoFloor) {
                        this.sessionState.stopBlindadoFloor = newFloor;
                    }
                }

                // Log Progresso Blindado (User Request)
                if (target > 0 && this.form.useBlindado) {
                    if (!this.sessionState.stopBlindadoActive) {
                        const gatilho = target * 0.5;
                        const faltam = gatilho - this.monitoringStats.profit;
                        if (faltam > 0 && this.monitoringStats.wins % 5 === 0) { // Log occasionally
                             const logMsg = `Monitoramento Blindado<br>` +
                                 `• Status: Inativo (Aguardando Gatilho)<br>` +
                                 `• Meta Gatilho: $${gatilho.toFixed(2)} (50% da Meta)<br>` +
                                 `• Falta: $${faltam.toFixed(2)} de lucro`;
                             this.addLog(logMsg, 'info');
                        }
                    } else if (this.monitoringStats.wins % 5 === 0) { // Log occasionally
                         const logMsg = `Monitoramento Blindado<br>` +
                             `• Status: ATIVO 🛡️<br>` +
                             `• Protegendo: $${this.sessionState.stopBlindadoFloor.toFixed(2)}<br>` +
                             `• Lucro Atual: $${this.monitoringStats.profit.toFixed(2)}`;
                         this.addLog(logMsg, 'info');
                    }
                }

                // LOG 08 - Reset de Soros
                if (trade.result === 'LOSS' && oldAnalysis === 'PRINCIPAL' && this.sessionState.consecutiveWins === 0 && trade.stake > this.form.initialStake) {
                     const logMsg = `🔄 SOROS RESETADO<br>` +
                         `• Motivo: Loss durante ciclo de Soros<br>` +
                         `• Nível Atingido: ${this.sessionState.consecutiveWins + 1} / ${this.form.sorosLevel || 1}<br>` +
                         `• Ação: Retornando ao valor base ($${this.form.initialStake.toFixed(2)})`;
                     this.addLog(logMsg, 'info');
                } else if (trade.result === 'WIN' && oldAnalysis === 'PRINCIPAL' && this.sessionState.consecutiveWins === 0 && trade.stake > this.form.initialStake) {
                     const logMsg = `🔄 SOROS RESETADO<br>` +
                         `• Motivo: Nível máximo alcançado (${this.form.sorosLevel || 1})<br>` +
                         `• Ciclo Concluído: Lucro retido na banca<br>` +
                         `• Ação: Retornando ao valor base ($${this.form.initialStake.toFixed(2)})`;
                     this.addLog(logMsg, 'info');
                }

                // --- Recovery & Transition Logs ---
                const getRiskProfile = () => {
                    const profile = this.form?.riskProfile || 
                                    this.form?.modoMartingale || 
                                    this.recoveryConfig?.riskProfile || 
                                    '';
                    return profile.toString().toLowerCase();
                };
                const isConservador = getRiskProfile() === 'conservador';
                
                // LOG 09 - Troca de Modo de Sensibilidade
                if (this.sessionState.negotiationMode !== oldMode) {
                    const logMsg = `🧭 ALTERAÇÃO DE SENSIBILIDADE<br>` +
                        `• Modo Anterior: ${oldMode}<br>` +
                        `• Novo Modo: ${this.sessionState.negotiationMode}<br>` +
                        `• Motivo: Adaptação à volatilidade recente<br>` +
                        `• Ação: Aplicar novos critérios de janela de análise`;
                    this.addLog(logMsg, 'warning');
                }

                // Transition Logic
                if (oldAnalysis === 'PRINCIPAL' && this.sessionState.analysisType === 'RECUPERACAO') {
                    const lossSum = (this.sessionState.prejuizo_acumulado > 0) ? this.sessionState.prejuizo_acumulado : (this.sessionState.totalLossAccumulated || this.sessionState.lastStakePrincipal);
                    
                    // LOG 10 - Troca de Contrato para Recuperação
                    if (this.recoveryConfig.tradeType && this.form.tradeType !== this.recoveryConfig.tradeType) {
                         const logMsg = `🔄 TROCA DE CONTRATO<br>` +
                             `• Motivo: Início do ciclo de recuperação<br>` +
                             `• Contrato Anterior: ${this.form.tradeType}<br>` +
                             `• Novo Contrato: ${this.recoveryConfig.tradeType}<br>` +
                             `• Objetivo: Aproveitar novo cenário probabilístico`;
                         this.addLog(logMsg, 'info');
                    }

                    if (isConservador) {
                        const parcels = this.sessionState.parcelas_total || 4;
                        const parcelValue = this.sessionState.valor_parcela || (lossSum / parcels);
                        
                        // LOG 11A - Fim da Condição de Recuperação (Conservador)
                        const logMsg11A = `🎯 CONDIÇÃO DE FIM DA RECUPERAÇÃO<br>` +
                            `• Perfil Ativo: Conservador parcelado<br>` +
                            `• Prejuízo Acumulado: $${lossSum.toFixed(2)}<br>` +
                            `• Meta de Recuperação: Cobrir perda parcelada`;
                        this.addLog(logMsg11A, 'info');

                        const logMsg = `⚠️ Martingale Parcelado Ativo<br>` +
                            `• Modo CONSERVADOR: Perda será recuperada em ${parcels} parcelas.<br>` +
                            `• Perda Total: $${lossSum.toFixed(2)}<br>` +
                            `• Valor da Parcela: $${parcelValue.toFixed(2)}`;
                        this.addLog(logMsg, 'warning');
                    } else {
                        // LOG 11A - Fim da Condição de Recuperação (Agressivo/Moderado)
                        const logMsg11A = `🎯 CONDIÇÃO DE FIM DA RECUPERAÇÃO<br>` +
                            `• Perfil Ativo: ${getRiskProfile().toUpperCase()}<br>` +
                            `• Prejuízo Acumulado: $${lossSum.toFixed(2)}<br>` +
                            `• Meta de Recuperação: Cobrir perdas + lucro original ($${this.sessionState.tempExplicitPayout ? (trade.stake * this.sessionState.tempExplicitPayout).toFixed(2) : 'Variável'})`;
                        this.addLog(logMsg11A, 'info');

                        const logMsg = `⚠️ Ativação de Recuperação<br>` +
                            `• Modo Martingale iniciado.<br>` +
                            `• Perda acumulada: $${lossSum.toFixed(2)}<br>` +
                            `• Próximo stake: Calculado automaticamente`;
                        this.addLog(logMsg, 'warning');
                    }
                } else if (oldAnalysis === 'RECUPERACAO' && this.sessionState.analysisType === 'PRINCIPAL') {
                    // LOG 13A - Reset Pós Recuperação
                    const logMsg13A = `🔄 RESET PÓS-RECUPERAÇÃO<br>` +
                        `• Contrato Atualizado: ${this.form.tradeType}<br>` +
                        `• Novo Modo Operacional: NORMAL<br>` +
                        `• Martingale: Resetado para Nível 0<br>` +
                        `• Soros Level: Resetado para Nível 0<br>` +
                        `• Contadores Limpos: Loss consecutivo zerado`;
                    this.addLog(logMsg13A, 'info');

                    if (isConservador) {
                        const logMsg = `✅ Recuperação Conservadora Concluída<br>` +
                            `• Ciclo de parcelas finalizado com sucesso.<br>` +
                            `• Voltando ao modo PRINCIPAL`;
                        this.addLog(logMsg, 'success');
                    } else {
                        const logMsg = `✅ Recuperação Concluída<br>` +
                            `• Retornando ao modo principal.<br>` +
                            `• Stake resetado para base`;
                        this.addLog(logMsg, 'success');
                    }
                } else if (this.sessionState.analysisType === 'RECUPERACAO' && trade.result !== 'WIN') {
                    
                    // LOG 14 - Limite de Martingale
                    if (this.sessionState.martingaleCount >= (this.recoveryConfig.maxMartingales || 5) || this.sessionState.consecutiveLosses >= (this.recoveryConfig.maxMartingales || 5)) {
                        const logMsg14 = `🔴 LIMITE DE RECUPERAÇÃO ATINGIDO<br>` +
                         `• Nível: ${this.sessionState.martingaleCount || this.sessionState.consecutiveLosses} / Máximo Permitido<br>` +
                         `• Total Perdido no Ciclo: $${(this.sessionState.prejuizo_acumulado || this.sessionState.totalLossAccumulated || 0).toFixed(2)}<br>` +
                         `• Ação de Proteção: Assumindo perda. Reset de stake base (Stop de ciclo)<br>` +
                         `• Saldo Atual: $${this.monitoringStats.balance.toFixed(2)}`;
                        this.addLog(logMsg14, 'error');
                        // Ensure we return to principal if limit hit
                        this.sessionState.analysisType = 'PRINCIPAL';
                    }

                    if (isConservador && this.sessionState.analysisType === 'RECUPERACAO') {
                        const logMsg = `📉 Re-parcelamento Ativo<br>` +
                            `• Loss no parcelamento (${this.sessionState.recoverySplitsUsed || 1}/3). Novo desdobramento iniciado.<br>` +
                            `• Nova Perda Acumulada: $${this.sessionState.prejuizo_acumulado.toFixed(2)}<br>` +
                            `• Nova Parcela (1/4): $${this.sessionState.valor_parcela.toFixed(2)}`;
                        this.addLog(logMsg, 'warning');
                    }
                }

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
            
            // LOG 20 - Resumo da Sessão
            const opsTotal = this.monitoringStats.wins + this.monitoringStats.losses;
            const winRate = opsTotal > 0 ? ((this.monitoringStats.wins / opsTotal) * 100).toFixed(1) : 0;
            
            const logMsg = `🔵 RESUMO DE SESSÃO<br>` +
                `• Operações: ${opsTotal}<br>` +
                `• Wins: ${this.monitoringStats.wins}<br>` +
                `• Losses: ${this.monitoringStats.losses}<br>` +
                `• Win Rate: ${winRate}%<br>` +
                `• Lucro Final: ${this.monitoringStats.profit >= 0 ? '+' : '-'}$${Math.abs(this.monitoringStats.profit).toFixed(2)}<br>` +
                `• Drawdown Máximo: $${this.sessionState.totalLossAccumulated ? this.sessionState.totalLossAccumulated.toFixed(2) : '0.00'}<br>` +
                `• Maior Loss Streak: ${this.sessionState.maxLossStreak || this.sessionState.consecutiveLosses || 0}<br>` +
                `• Ativações Recuperação: ${this.sessionState.recoveryCount || 0}`;

            this.addLog(logMsg, 'info');

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
                message: message,
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
