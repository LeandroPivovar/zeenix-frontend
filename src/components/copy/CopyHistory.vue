<template>
    <div class="copy-history-view">

        <!-- Sidebar Esquerda -->
        <aside class="copy-sidebar">
            <div class="copy-active-aside">
                <p class="status-header">🟢 Copy Ativo</p>
                <p class="active-operation">Operando com {{ traderActive.name }} — última operação há 3 minutos</p>

                <!-- Status do Trader -->
                <div class="status-trader card-history">
                    <h4>Status do Trader</h4>
                    <div class="status-item">
                        <span>Trader:</span>
                        <span class="value">{{ traderActive.trader }}</span>
                    </div>
                    <div class="status-item">
                        <span>ROI:</span>
                        <span class="value green">{{ traderActive.roi }}</span>
                    </div>
                    <div class="status-item">
                        <span>Drawdown:</span>
                        <span class="value">{{ traderActive.drawdown }}</span>
                    </div>
                </div>

                <!-- Desempenho da Conta -->
                <div class="account-performance card-history">
                    <h4>Desempenho da Conta</h4>
                    <div class="perf-list">
                        <div class="perf-item">
                            <span>Lucro Acumulado:</span>
                            <span class="value green">{{ accountPerformance.accumulatedProfit }}</span>
                        </div>
                        <div class="perf-item">
                            <span>ROI Total:</span>
                            <span class="value green">{{ accountPerformance.roiTotal }}</span>
                        </div>
                        <div class="perf-item">
                            <span>Operações:</span>
                            <span class="value">{{ accountPerformance.operations }}</span>
                        </div>
                        <div class="perf-item">
                            <span>Dias Ativos:</span>
                            <span class="value">{{ accountPerformance.activeDays }}</span>
                        </div>
                    </div>
                </div>

                <!-- Parâmetros Ativos -->
                <div class="active-parameters card-history">
                    <h4>Parâmetros Ativos</h4>
                    <div class="param-item">
                        <span>Modo de cópia:</span>
                        <span class="value">5% do saldo</span>
                    </div>
                    <div class="param-item">
                        <span>Stop Loss:</span>
                        <span class="value">$100</span>
                    </div>
                    <div class="param-item">
                        <span>Take Profit:</span>
                        <span class="value">$200</span>
                    </div>
                    <div class="param-item">
                        <span>SL Blindado:</span>
                        <span class="value green">Ativado</span>
                    </div>
                </div>

                <div class="trader-consistency card-history">
                    <h4>IA Orion V2</h4>
                    <p>Monitorando consistência do trader — risco dentro dos parâmetros ideais.</p>
                    <p class="last-analysis green">Última análise: há 2 minutos</p>
                </div>

                <!-- Últimas Operações no Sidebar -->
                <div class="ultimas-operacoes-sidebar card-history">
                    <h3>Últimas Operações</h3>
                    <div class="op-list">
                        <div class="op-item">
                            <span>13:12 Buy</span>
                            <span class="op-value green">+$4,60</span>
                        </div>
                        <div class="op-item">
                            <span>12:47 Sell</span>
                            <span class="op-value red">-$2,10</span>
                        </div>
                        <div class="op-item">
                            <span>12:10 Buy</span>
                            <span class="op-value green">+$7,90</span>
                        </div>
                    </div>
                </div>

                <p class="footer-status">🟢 Copy ativo e sincronizado</p>
                <p class="footer-note">Quanto mais tempo ativo, mais o sistema aprende seu perfil de risco</p>
            </div>
        </aside>

        <section class="main-content-area">
            <div class="main-content-wrapper">
                <div class="tab-controls-container">
                    <div class="tab-controls">
                        <button @click="navigateToPerformance">
                            Desempenho
                        </button>
                        <button :class="{ active: true }">
                            Histórico de Operações
                        </button>
                    </div>
                </div>

                <div class="historico-operacoes">
                    <h2>Últimas operações da {{ traderName }}</h2>
                    <p class="operation-info">
                        Mostrando operações do trader <strong>{{ traderName }}</strong> entre <strong>01 e 16 Out 2025</strong> (<strong>68% de acerto</strong>).
                    </p>

                    <!-- Filtros -->
                    <div class="filters">
                        <button class="filter-btn active">Hoje</button>
                        <button class="filter-btn">7D</button>
                        <button class="filter-btn">30D</button>
                        <button class="filter-btn">90D</button>
                        <select class="filter-dropdown">
                            <option>Todos os tipos</option>
                        </select>
                    </div>

                    <!-- Tabela de Operações -->
                     <div class="table-box">
                        <table class="operations-table">
                            <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Tipo</th>
                                    <th>Ação</th>
                                    <th>Stake ($)</th>
                                    <th>Resultado ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="op in operations" :key="op.time">
                                    <td>{{ op.time }}</td>
                                    <td>{{ op.type }}</td>
                                    <td>{{ op.action }}</td>
                                    <td>{{ op.stake }}</td>
                                    <td>
                                        <span class="result-value-text" :class="parseFloat(op.result) >= 0 ? 'green' : 'red'">
                                            {{ op.result }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <button class="full-history-button">
                       ↓ Ver histórico completo
                    </button>

                    <p class="note">
                        🔎 Você está analisando operações com <strong>72,1% de acerto</strong>. Mantenha sua IA ativa — resultados consistentes vêm com o tempo.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'CopyHistory',
    props: {
        traderName: {
            type: String,
            default: 'John Doe'
        },
        operations: {
            type: Array,
            default: () => []
        },
        traderActive: {
            type: Object,
            default: () => ({})
        },
        accountPerformance: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        navigateToPerformance() {
            this.$emit('navigate-to-performance');
        }
    }
}
</script>

<style src="../../assets/css/components/copyHistory.css"></style>