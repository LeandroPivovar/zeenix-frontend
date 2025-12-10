<template>
    <div class="copy-trading-view">

        <aside class="config-sidebar">
            <div class="section-header">
                <span>Lucro/Perda do dia</span>
                <span class="value green">+R$ 1.247,50 (+2,8%)</span>
            </div>

            <div class="section-header">
                <span>Saldo total</span>
                <span class="value">R$ 45.680,00</span>
            </div>

            <div class="section-header">
                <span>Contexto: Desempenho</span>
            </div>

             <div class="section-divider"></div>

            <div class="config-section">
                <h4>SELECIONAR TRADER</h4>
                <div class="select-group">
                    <select v-model="selectedTrader" @change="onTraderSelected" class="trader-select">
                        <option value="">Selecione um trader</option>
                        <option v-for="trader in tradersList" :key="trader.id" :value="trader.id">
                            {{ trader.name }} 
                        </option>
                    </select>
                </div>
                
                <!-- Área de informações do trader -->
                <div class="trader-info-area">
                    <div v-if="!selectedTrader" class="trader-placeholder">
                        <p class="placeholder-title">Nenhum trader selecionado</p>
                        <p class="placeholder-subtitle">Clique no campo acima para escolher</p>
                    </div>
                    
                    <div v-else class="trader-info-card">
                        <div class="trader-info-row">
                            <span class="info-label">Nome:</span>
                            <span class="info-value">{{ selectedTraderStats.name }}</span>
                        </div>
                        <div class="trader-info-row">
                            <span class="info-label">ROI:</span>
                            <span class="info-value green">{{ selectedTraderStats.roi }}%</span>
                        </div>
                        <div class="trader-info-row">
                            <span class="info-label">Drawdown:</span>
                            <span class="info-value">{{ selectedTraderStats.dd }}%</span>
                        </div>
                        <div class="trader-info-row">
                            <span class="info-label">Seguidores:</span>
                            <span class="info-value">{{ selectedTraderStats.followers }}k</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="config-section">
                <h4>CONFIGURAÇÕES DO COPY</h4>
                
                <!-- Tipo de Alocação -->
                <div class="field">
                    <label>
                        Tipo de Alocação
                        <span class="help-icon" title="Escolha entre proporção do saldo ou valor fixo">?</span>
                    </label>
                    <div class="toggle-buttons">
                        <button
                            :class="{ active: copyMode === 'proportion' }"
                            @click="copyMode = 'proportion'"
                        >
                            Proporção (%)
                        </button>
                        <button
                            :class="{ active: copyMode === 'fixed' }"
                            @click="copyMode = 'fixed'"
                        >
                            Valor Fixo ($)
                        </button>
                    </div>
                </div>

                <!-- Valor/Proporção -->
                <div class="field">
                    <label>
                        {{ copyMode === 'proportion' ? 'Proporção (%)' : 'Valor Fixo ($)' }}
                    </label>
                    <input 
                        type="number" 
                        v-model.number="allocationValue" 
                        :placeholder="copyMode === 'proportion' ? 'Ex: 15' : 'Ex: 500'"
                        :min="copyMode === 'proportion' ? 1 : 0.01"
                        :max="copyMode === 'proportion' ? 100 : null"
                        step="0.01"
                    />
                    <span class="field-hint" v-if="copyMode === 'proportion'">
                        Percentual do seu saldo a ser alocado
                    </span>
                </div>

                <!-- Alavancagem -->
                <div class="field">
                    <label>
                        Alavancagem
                        <span class="help-icon" title="Multiplicador de posição">?</span>
                    </label>
                    <select v-model="leverage">
                        <option value="1:1">1x</option>
                        <option value="1:2">2x</option>
                        <option value="1:5">5x</option>
                    </select>
                </div>

                <!-- Stop Loss -->
                <div class="field">
                    <label>
                        Stop Loss
                        <span class="help-icon" title="Limite máximo de perda permitido">?</span>
                    </label>
                    <input 
                        type="number" 
                        v-model.number="stopLoss" 
                        placeholder="250" 
                        min="0"
                        step="0.01"
                    />
                </div>

                <!-- Take Profit -->
                <div class="field">
                    <label>
                        Take Profit
                        <span class="help-icon" title="Meta de lucro diária">?</span>
                    </label>
                    <input 
                        type="number" 
                        v-model.number="takeProfit" 
                        placeholder="500" 
                        min="0"
                        step="0.01"
                    />
                </div>

                <!-- Stop Loss Blindado -->
                <div class="field switch">
                    <label>
                        Stop Loss Blindado
                        <span class="help-icon" title="Protege contra operações consecutivas fora do padrão">?</span>
                    </label>
                    <div class="toggle-switch">
                        <input type="checkbox" v-model="blindStop" />
                        <span class="slider"></span>
                    </div>
                    <span class="field-hint" v-if="blindStop">
                        Protege contra operações consecutivas fora do padrão
                    </span>
                </div>
            </div>

            <button 
                class="activate-button" 
                @click="activateCopy"
                :disabled="isActive && sessionStatus === 'active'"
                :class="{ 'button-disabled': isActive && sessionStatus === 'active' }"
            >
                {{ isActive && sessionStatus === 'active' ? 'Copy Ativo' : 'Ativar Copy' }}
            </button>

            <div 
                class="pause-link" 
                @click="togglePause"
                v-if="isActive"
            >
                {{ sessionStatus === 'paused' ? 'Retomar Copy' : 'Pausar Copy' }}
            </div>
        </aside>

        <!-- COLUNA DIREITA: CARDS DE DESEMPENHO -->
        <main class="dashboard-content-copy">
            <div class="tab-controls-container">
                <div class="tab-controls">
                    <button :class="{ active: true }"> 
                        Desempenho
                    </button>
                    <button @click="navigateToHistory">
                        Histórico de Operações
                    </button>
                </div>
            </div>

            <!-- Conteúdo da aba Desempenho -->
            <div class="dashboard-grid">

                <div class="card">
                    <div class="card-header">
                        <h3>Evolução do seu Copy</h3>
                        <div class="period-controls">
                            <button @click="setPeriod('7')" :class="{ active: selectedPeriod === '7' }">7 dias</button>
                            <button @click="setPeriod('30')" :class="{ active: selectedPeriod === '30' }">30 dias</button>
                            <button @click="setPeriod('90')" :class="{ active: selectedPeriod === '90' }">90 dias</button>
                        </div>
                    </div>
                    <div class="chart-placeholder">
                        Gráfico em desenvolvimento
                    </div>
                    <p class="chart-caption">Seu saldo vem aumentando de forma constante nos últimos dias.</p>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>Resumo de Resultados</h3>
                    </div>
                    <div class="summary-list">
                        <div class="summary-item">
                            <span>Retorno total:</span>
                            <span class="value green">{{ performanceData.summary.totalReturn }}</span>
                        </div>
                        <div class="summary-item">
                            <span>Taxa de acerto:</span>
                            <span class="value">{{ performanceData.summary.winRate }}</span>
                        </div>
                        <div class="summary-item">
                            <span>Maior queda:</span>
                            <span class="value red">{{ performanceData.summary.maxDrawdown }}</span>
                        </div>
                        <div class="summary-item">
                            <span>Dias de lucro:</span>
                            <span class="value green">{{ performanceData.summary.profitableDays }}</span>
                        </div>
                        <div class="summary-item">
                            <span>Tempo ativo:</span>
                            <span class="value">{{ performanceData.summary.activeTime }}</span>
                        </div>
                    </div>
                    <p class="summary-note">O Copy está mostrando estável e com boa taxa de acerto.</p>
                </div>

                <!-- Card: Resultados Diários -->
                <div class="card">
                    <div class="card-header">
                        <h3>Resultados Diários</h3>
                    </div>
                    <table class="daily-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Lucro</th>
                                <th>% do dia</th>
                                <th>Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in performanceData.dailyResults" :key="item.date">
                                <td>{{ item.date }}</td>
                                <td :class="item.profit.startsWith('+') ? 'positive' : 'negative'">{{ item.profit }}</td>
                                <td :class="item.percent.startsWith('+') ? 'positive' : 'negative'">{{ item.percent }}</td>
                                <td><span class="status-label" :class="item.result === 'Lucro' ? 'green' : 'red'">{{ item.result }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="daily-summary">Nos últimos 7 dias, o Copy acumulou +R$ 142,00 (+2,3%).</p>
                </div>

                <!-- Card: Situação do Copy -->
                <div class="card">
                    <div class="card-header">
                        <h3>Situação do Copy</h3>
                    </div>
                    <div class="status-indicator">
                        <span class="dot green"></span>
                        Copiando operações em tempo real
                    </div>
                    <p class="last-update">Última atualização: {{ performanceData.copyStatus.lastUpdate }}</p>

                    <!-- Layout em grade para alinhar rótulos e valores -->
                    <div class="copy-status-grid">
                        <div class="status-row">
                            <span class="label">Trader copiado:</span>
                            <span class="value green">@{{ performanceData.copyStatus.trader }}</span>
                        </div>
                        <div class="status-row">
                            <span class="label">Alocação ativa:</span>
                            <span class="value">{{ performanceData.copyStatus.allocation }}</span>
                        </div>
                        <div class="status-row">
                            <span class="label">Operações hoje:</span>
                            <span class="value green">{{ performanceData.copyStatus.operationsToday }}</span>
                        </div>
                    </div>

                    <button class="history-button" @click="navigateToHistory">
                        Ver histórico de operações
                    </button>
                    <p class="status-footer">Enquanto o Copy estiver ativo, as operações são copiadas automaticamente. Você pode pausar quando quiser.</p>
                </div>

            </div>

        </main>

    </div>
</template>

<script>
export default {
    name: 'CopyTradingComponent',
    props: ['performanceData'],
    data() {
        return {
            selectedPeriod: '7',
            copyMode: 'proportion', 
            selectedTrader: '',
            allocationValue: null,
            leverage: '1:1',
            stopLoss: 250,
            takeProfit: 500,
            blindStop: false,
            isPaused: false,
            isActive: false,
            sessionStatus: null,
            activeSession: null,
            configId: null,
            tradersList: [],
            isLoadingTraders: false,
            isLoadingConfig: false
        }
    },
    computed: {
        selectedTraderStats() {
            const trader = this.tradersList.find(t => t.id === this.selectedTrader);
            return trader || { name: '', roi: '0', dd: '0', followers: '0', winRate: '0%', totalTrades: '0' };
        }
    },
    async mounted() {
        await this.loadAvailableTraders();
        await this.loadCopyTradingConfig();
        await this.loadActiveSession();
    },
    methods: {
        setPeriod(period) {
            this.selectedPeriod = period;
        },
        onTraderSelected() {
            if (this.selectedTrader) {
                console.log('Trader selecionado:', this.selectedTrader);
            }
        },
        async activateCopy() {
            // Validações
            if (!this.selectedTrader) {
                if (this.$root.$toast) {
                    this.$root.$toast.error('Selecione um trader antes de ativar o copy!');
                }
                return;
            }

            if (!this.allocationValue || this.allocationValue <= 0) {
                if (this.$root.$toast) {
                    this.$root.$toast.error('Informe o valor ou percentual de alocação!');
                }
                return;
            }

            if (this.copyMode === 'proportion' && (this.allocationValue > 100 || this.allocationValue < 1)) {
                if (this.$root.$toast) {
                    this.$root.$toast.error('A proporção deve estar entre 1% e 100%!');
                }
                return;
            }

            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.error('Usuário não identificado');
                    return;
                }

                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.error('Token Deriv não encontrado');
                    return;
                }

                const selectedTraderData = this.tradersList.find(t => t.id === this.selectedTrader);

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/copy-trading/activate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        traderId: this.selectedTrader,
                        traderName: selectedTraderData.name,
                        allocationType: this.copyMode,
                        allocationValue: this.allocationValue,
                        allocationPercentage: this.copyMode === 'proportion' ? this.allocationValue : null,
                        leverage: this.leverage,
                        stopLoss: this.stopLoss,
                        takeProfit: this.takeProfit,
                        blindStopLoss: this.blindStop,
                        derivToken: derivToken,
                        currency: this.getPreferredCurrency() || 'USD'
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    if (this.$root.$toast) {
                        this.$root.$toast.success('Copy ativado com sucesso! Sessão criada.');
                    }
                    // Recarregar configuração e sessão
                    await this.loadCopyTradingConfig();
                    await this.loadActiveSession();
                    // Navegar para a tela de performance
                    this.$emit('copy-activated');
                } else {
                    if (this.$root.$toast) {
                        this.$root.$toast.error(result.message || 'Erro ao ativar copy');
                    }
                }
            } catch (error) {
                console.error('Erro ao ativar copy:', error);
                if (this.$root.$toast) {
                    this.$root.$toast.error('Erro ao ativar copy. Tente novamente.');
                }
            }
        },
        getUserId() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.userId || payload.sub || payload.id;
                }
                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    return userInfo.id || userInfo.userId;
                }
                return null;
            } catch (error) {
                console.error('Erro ao obter userId:', error);
                return null;
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
                        const specificToken = tokensByLoginId[accountLoginid];
                        if (specificToken) {
                            return specificToken;
                        }
                    }
                }
                return localStorage.getItem('deriv_token');
            } catch (error) {
                console.error('Erro ao obter token Deriv:', error);
                return localStorage.getItem('deriv_token');
            }
        },
        getPreferredCurrency() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    if (connection.tradeCurrency) {
                        return connection.tradeCurrency.toUpperCase();
                    }
                }
            } catch (error) {
                console.error('Erro ao obter moeda preferida:', error);
            }
            return 'USD';
        },
        async togglePause() {
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const token = localStorage.getItem('token');

                if (this.sessionStatus === 'paused') {
                    // Retomar copy trading
                    const response = await fetch(`${apiBase}/copy-trading/resume`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        if (this.$root.$toast) {
                            this.$root.$toast.success('Copy trading retomado com sucesso!');
                        }
                        await this.loadCopyTradingConfig();
                        await this.loadActiveSession();
                    } else {
                        if (this.$root.$toast) {
                            this.$root.$toast.error(result.message || 'Erro ao retomar copy trading');
                        }
                    }
                } else {
                    // Pausar copy trading
                    const response = await fetch(`${apiBase}/copy-trading/pause`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        if (this.$root.$toast) {
                            this.$root.$toast.success('Copy trading pausado com sucesso!');
                        }
                        await this.loadCopyTradingConfig();
                        await this.loadActiveSession();
                    } else {
                        if (this.$root.$toast) {
                            this.$root.$toast.error(result.message || 'Erro ao pausar copy trading');
                        }
                    }
                }
            } catch (error) {
                console.error('Erro ao pausar/retomar copy:', error);
                if (this.$root.$toast) {
                    this.$root.$toast.error('Erro ao pausar/retomar copy. Tente novamente.');
                }
            }
        },
        async loadAvailableTraders() {
            try {
                this.isLoadingTraders = true;
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                
                const response = await fetch(`${apiBase}/copy-trading/traders`);
                const result = await response.json();

                if (result.success && result.data) {
                    this.tradersList = result.data;
                } else {
                    console.warn('Nenhum trader disponível encontrado');
                    // Fallback para dados mockados se necessário
                    this.tradersList = [
                        { id: 't1', name: 'John Doe', roi: '45', dd: '8', followers: '1.2', winRate: '78%', totalTrades: '234' },
                        { id: 't2', name: 'Jane Smith', roi: '52', dd: '6', followers: '0.8', winRate: '82%', totalTrades: '189' },
                        { id: 't3', name: 'TradeMaster', roi: '60', dd: '5', followers: '2.1', winRate: '85%', totalTrades: '456' }
                    ];
                }
            } catch (error) {
                console.error('Erro ao carregar traders:', error);
                // Fallback para dados mockados em caso de erro
                this.tradersList = [
                    { id: 't1', name: 'John Doe', roi: '45', dd: '8', followers: '1.2', winRate: '78%', totalTrades: '234' },
                    { id: 't2', name: 'Jane Smith', roi: '52', dd: '6', followers: '0.8', winRate: '82%', totalTrades: '189' }
                ];
            } finally {
                this.isLoadingTraders = false;
            }
        },
        async loadCopyTradingConfig() {
            try {
                this.isLoadingConfig = true;
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const token = localStorage.getItem('token');

                const response = await fetch(`${apiBase}/copy-trading/config`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success && result.data) {
                    const config = result.data;
                    this.isActive = config.isActive;
                    this.sessionStatus = config.sessionStatus;
                    this.configId = config.id;
                    
                    // Carregar configurações existentes
                    this.selectedTrader = config.traderId;
                    this.copyMode = config.allocationType;
                    this.allocationValue = config.allocationType === 'proportion' 
                        ? config.allocationPercentage 
                        : config.allocationValue;
                    this.leverage = config.leverage;
                    this.stopLoss = config.stopLoss;
                    this.takeProfit = config.takeProfit;
                    this.blindStop = config.blindStopLoss;
                    this.isPaused = config.sessionStatus === 'paused';
                }
            } catch (error) {
                console.error('Erro ao carregar configuração:', error);
            } finally {
                this.isLoadingConfig = false;
            }
        },
        async loadActiveSession() {
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const token = localStorage.getItem('token');

                const response = await fetch(`${apiBase}/copy-trading/session/active`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success && result.data) {
                    this.activeSession = result.data;
                    this.sessionStatus = result.data.status;
                } else {
                    this.activeSession = null;
                }
            } catch (error) {
                console.error('Erro ao carregar sessão ativa:', error);
                this.activeSession = null;
            }
        },
        navigateToHistory() {
            this.$emit('navigate-to-history');
        }
    }
}
</script>

<style src="../../assets/css/components/copyTradingComponent.css"></style>