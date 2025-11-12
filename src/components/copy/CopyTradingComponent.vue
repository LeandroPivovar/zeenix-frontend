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
                <div class="input-group">
                    <input type="text" placeholder="Buscar trader (nome/ID)" />
                </div>
                <div class="select-group">
                    <select v-model="selectedTrader">
                        <option value="">Top Traders (ROI)</option>
                        <option v-for="trader in tradersList" :key="trader.id" :value="trader.id">
                            {{ trader.name }} 
                        </option>
                    </select>
                    <div class="trader-stats">
                        ROI: {{ selectedTraderStats.roi }}% • DD: {{ selectedTraderStats.dd }}% • {{ selectedTraderStats.followers }}k
                    </div>
                </div>
            </div>
            
            <div class="section-divider"></div>

            <div class="config-section">
                <h4>MODO DE CÓPIA</h4>
                <div class="toggle-buttons">
                    <button
                        :class="{ active: copyMode === 'proportion' }"
                        @click="copyMode = 'proportion'"
                    >
                        Proporção (%) do saldo
                    </button>
                    <button
                        :class="{ active: copyMode === 'fixed' }"
                        @click="copyMode = 'fixed'"
                    >
                        Valor Fixo ($)
                    </button>
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="config-section">
                <h4>ALOCAÇÃO & LIMITES</h4>
                <div class="row">
                    <div class="field">
                        <label>Alevaragem</label>
                        <select v-model="leverage">
                            <option>1:1</option>
                            <option>1:2</option>
                            <option>1:5</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Stop Loss ($)</label>
                        <input type="number" v-model="stopLoss" placeholder="$100" />
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <label>Take Profit ($)</label>
                        <input type="number" v-model="takeProfit" placeholder="$200" />
                    </div>
                    <div class="field">
                        <label>Tipo SL/TP</label>
                        <select v-model="slTpType">
                            <option>Diário</option>
                            <option>Semanal</option>
                            <option>Mensal</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="field switch">
                        <label>Stop Loss Blindado</label>
                        <div class="toggle-switch">
                            <input type="checkbox" v-model="blindStop" />
                            <span class="slider"></span>
                        </div>
                    </div>
                </div>
            </div>

            <button class="activate-button" @click="activateCopy">
                Ativar Copy
            </button>

            <div class="pause-link" @click="togglePause">
                {{ isPaused ? 'Reativar' : 'Pausar' }}/Desativar
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
            leverage: '1:1',
            stopLoss: '100',
            takeProfit: '200',
            slTpType: 'Diário',
            blindStop: false,
            isPaused: false,
            tradersList: [
                { id: 't1', name: 'John Doe', roi: '45', dd: '8', followers: '1.2' },
                { id: 't2', name: 'Jane Smith', roi: '52', dd: '6', followers: '0.8' },
                { id: 't3', name: 'TradeMaster', roi: '60', dd: '5', followers: '2.1' }
            ]
        }
    },
    computed: {
        selectedTraderStats() {
            const trader = this.tradersList.find(t => t.id === this.selectedTrader);
            return trader || { roi: '45', dd: '8', followers: '1.2' };
        }
    },
    methods: {
        setPeriod(period) {
            this.selectedPeriod = period;
        },
        activateCopy() {
            alert('Copy ativado!');
        },
        togglePause() {
            this.isPaused = !this.isPaused;
        },
        navigateToHistory() {
            this.$emit('navigate-to-history');
        }
    }
}
</script>

<style src="../../assets/css/components/copyTradingComponent.css"></style>