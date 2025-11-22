<template>
    <div class="layout-content-agent-autonomo">
        <div class="agent-top">
            <div class="agent-header">
                <div class="agent-status">
                    <div class="agent-title">
                        <h2 class="agente-autonomo-text">Agente Autônomo</h2>
                        <div class="agent-subtitle">
                            <span class="status-badge">ATIVO</span>
                            <span class="status-dot">●</span>
                            <span id="agentStatus">Aguardando oportunidade</span>
                        </div>
                    </div>
                </div>
                <div class="agent-right">
                    <button @click="$emit('pausarAgente')" class="pause-btn top-pause-btn">
                        <span class="pause-icon">II</span> PAUSAR AGENTE
                    </button>
                </div>
            </div>

            <div class="data-row-line">
                <div class="data-item">
                    <span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/brain.png" alt="" width="15px">
						Estratégia
					</span> 
                    <div class="data-label">{{ agenteData.estrategia }}</div>
                </div>
                <div class="data-item">
                    <span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/stats-green.svg" alt="" width="15px">		
						Mercado
						</span> 
                    <div class="data-label">{{ agenteData.mercado }}</div>
                </div>
                <div class="data-item">
                    <span class="icon-bullet" style="color: #666;"><img src="../../assets/icons/clock.svg" alt="" width="15px">
					Tempo ativo
					</span>
                    <div class="data-label">{{ agenteData.tempoAtivo }}</div>
                </div>
                <div class="data-item">
                    <span class="icon-bullet" style="color: #666;">
						<img src="../../assets/icons/linechart.svg" alt="" width="15px">
						Operações hoje
					</span> 
                    <div class="data-label">{{ agenteData.operacoesHoje }}</div>
                </div>
            </div>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <span class="arrow positive">↑</span>
                <div class="metric-box">
                    <div class="metric-label">Lucro do dia</div>
                    <div class="metric-value positive">
                        +${{ progressoMeta.atual.toFixed(2) }}
                    </div>
                    <div class="metric-change positive">
                        +2.14%
                    </div>
                </div>
            </div>

            <div class="metric-card">
                <span class="arrow negative">↓</span>
                <div class="metric-box">
                    <div class="metric-label">Perda acumulada</div>
                    
                    <div class="metric-value negative">
                        -$5.20
                    </div>
                    <div class="metric-change negative">
                        -0.34%
                    </div>
                </div>
            </div> 
            <div class="progress-card">
                <div class="metric-label">Progresso até a meta</div>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: progressoPorcentagem }"></div>
                    </div>
                </div>
                <div class="progress-label">
                    <span>Meta: ${{ progressoMeta.meta }}</span>
                    <span>Stop: ${{ progressoMeta.stop }}</span>
                </div>
            </div>
        </div>

        <div class="chart-section">
            <div class="chart-controls">
                
                <div class="tab-controls">
                    <span
                        :class="['toggle-tab', { 'chart-title-active': abaAtiva === 'grafico' }]"
                        @click="trocarAba('grafico')"
                    >
                        Gráfico
                    </span>
                    <span
                        :class="['toggle-tab', { 'chart-title-active': abaAtiva === 'historico' }]"
                        @click="trocarAba('historico')"
                    >
                        Histórico
                    </span>
                </div>

                <div class="performance">
                    <span class="performance-title">Performance do Agente</span>
                    <span class="update-info">Última atualização: <span class="update-time">{{ ultimaAtualizacao }}</span></span>
                    
                    <div class="chart-settings">

                        <div class="control-group">
                            Timeframe:
                            <select v-model="timeframeSelecionado" class="custom-select">
                                <option v-for="tf in timeframes" :key="tf" :value="tf">{{ tf }}</option>
                            </select>
                        </div>

                        <div class="control-group">
                            Tipo:
                            <select v-model="tipoGraficoSelecionado" class="custom-select">
                                <option v-for="tipo in tiposGrafico" :key="tipo" :value="tipo">{{ tipo }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chart-content">
                <div id="contentGrafico" :class="['chart-canvas', { hidden: abaAtiva !== 'grafico' }]">
                    <p class="chart-placeholder" v-if="abaAtiva === 'grafico'">{{ graficoPlaceholder }}</p>
                </div>

                <div id="contentHistorico" :class="['history-content', { hidden: abaAtiva !== 'historico' }]">
                    <div class="history-header">
                        <h3>Histórico de Operações ({{ historicoOperacoes.length }})</h3>
                    </div>
                    <table class="operations-table">
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>Ativo</th>
                                <th>Tipo</th>
                                <th>Entrada</th>
                                <th>Saída</th>
                                <th>Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="op in historicoOperacoes" :key="op.hora">
                                <td>{{ op.hora }}</td>
                                <td>{{ op.ativo }}</td>
                                <td>{{ op.tipo }}</td>
                                <td>${{ op.entrada }}</td>
                                <td>${{ op.saida }}</td>
                                <td :class="op.resultado.startsWith('+') ? 'result-positive' : 'result-negative'">
                                    {{ op.resultado }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="actions-section">
            <div class="actions-header">
                <h3>Ações do Agente</h3>
                <div class="actions-list">
                    <div v-for="acao in acoesAgente" :key="acao.hora" class="action-item">
                        <div :class="['action-icon', acao.classe]"></div>
                        <div class="action-content">
                            <div class="action-title">{{ acao.titulo }}</div>
                            <div class="action-description">{{ acao.descricao }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AgenteAutonomoPanel',
    emits: ['pausarAgente'],
    data() {
        return {
            abaAtiva: 'grafico',
            timeframeSelecionado: '5m',
            tipoGraficoSelecionado: 'Linha',
            ultimaAtualizacao: '14:32:15',
            
            // Dados do Topo
            agenteData: {
                estrategia: 'Arion',
                mercado: 'Índices Sintéticos',
                tempoAtivo: '2h 15m',
                operacoesHoje: 12,
            },

            // Métricas (Valor ajustado para preenchimento de 85% visualmente)
            progressoMeta: {
                // Progresso ajustado para 85% do total de 50, correspondendo ao visual da última imagem
                atual: 42.50, 
                meta: 50,
                stop: 25,
            },

            timeframes: ['5m', '1h', '1d'],
            tiposGrafico: ['Linha', 'Candle'],

            // Ações (Ajustado para corresponder à imagem)
            acoesAgente: [
                { hora: '14:32:15', classe: 'success', titulo: 'Operação finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50' },
                { hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
                { hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - Confirmação de padrão' },
                { hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrão da estratégia', descricao: '14:30:00 - Análise em andamento' },
            ],

            // Histórico (Mantido como exemplo)
            historicoOperacoes: [
                { hora: '14:32:16', ativo: 'CALL1', tipo: 'Call', entrada: '83.80', saida: '85.20', resultado: '+$7.50' },
                { hora: '14:18:02', ativo: 'CALL1', tipo: 'Call', entrada: '82.60', saida: '81.30', resultado: '-$3.20' },
                { hora: '14:01:45', ativo: 'Volatility 75', tipo: 'Put', entrada: '156.40', saida: '158.90', resultado: '+$12.30' },
                { hora: '13:45:22', ativo: 'CALL1', tipo: 'Call', entrada: '84.15', saida: '83.50', resultado: '-$2.10' },
                { hora: '13:30:08', ativo: 'Volatility 75', tipo: 'Call', entrada: '155.20', saida: '157.80', resultado: '+$8.90' },
            ],
        };
    },
    computed: {
        progressoPorcentagem() {
            const percentage = (this.progressoMeta.atual / this.progressoMeta.meta) * 100;
            return `${Math.min(100, percentage).toFixed(0)}%`;
        },

        graficoPlaceholder() {
            return `Performance do Agente (Gráfico de ${this.tipoGraficoSelecionado} | ${this.timeframeSelecionado})`;
        },
    },
    methods: {
        trocarAba(aba) {
            this.abaAtiva = aba;
        },
    },
};
</script>

<style scoped>
/* Estilos globais/Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Os estilos do body não são aplicados em componentes Vue, mas estão aqui para referência */
.layout-content-agent-autonomo {
    font-family: -apple-system, BlinkMacMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #f0f0f0;
}

/* Base de Seções */
.metric-card, .chart-section, .history-section, .actions-section {
    background: #0e0f0f;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.progress-card {
    background: #0e0f0f;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.agent-top {
    background: #0e0f0f;
    padding: 30px;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
}

.agent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
}

/* Header do Agente - AJUSTES PARA PROXIMIDADE E PREENCHIMENTO */
.agent-status {
    display: flex;
    align-items: center;
    flex-grow: 1; /* Permite que o contêiner de status cresça */
}

.agent-title {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex-grow: 1; /* Garante que o título cresça dentro do status */
    background: #0e0f0f;
    padding: 5px;
    margin-right: 20px;
    border-radius: 8px;
    border: 1px solid #1a1a1a;
}

.agent-title h2 {
    font-size: 20px;
    font-weight: 600;
    color: white;
    margin: 0;
}

.agent-subtitle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #cfcdcd;
}

.status-badge {
    background: #1a4d2e8e;
    border: 1px solid #1a4d2e;
    color: #ffffff;
    padding: 4px 12px;
    border-radius: 3px;
    font-weight: 700;
    font-size: 11px;
}

.status-dot {
    display: flex;
    align-items: center;
    color: #00ff00;
    font-size: 18px;
}

.agent-right {
    display: flex;
    align-items: center;
}

.top-pause-btn {
    background: #451312;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
    height: 55px;
}

.top-pause-btn:hover {
    background: #a00000;
}

.pause-icon {
    font-size: 14px;
    font-weight: bold;
}

/* Dados em Linha */
.data-row-line {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 20px;
}

.data-item {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    text-align: left;
    gap: 8px;
    font-size: 12px;
    color: #666;
}

.data-item .icon-bullet {
    font-size:0.8rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap:10px;
}

.icon-bulelt{

}

.data-label {
    font-size: 1rem;
}

.data-item .data-label {
    color: #f0f0f0;
    font-weight: 500;
    text-align: left;
}

/* Cards de Métricas */
.metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: 15px;
    margin-top: 1.5rem;
}

.metric-card {
    background: #0a0a0a;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    padding: 20px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;

}

.metric-label {
    font-size: 12px;
    color: #a09e9e;
    text-transform: capitalize;
    text-align: left;
}

.metric-box {
    display: flex;
    flex-direction: column;
}

.metric-value {
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 5px 0;
}

.metric-card .arrow {
    font-size: 30px;
    position: relative;
}

.metric-value .arrow {
    font-size: 20px;
}

.metric-card .arrow.positive { color: #3eb83e; }
.metric-card .arrow.negative { color: #ff4444; }

.metric-value.positive { color: #3eb83e; }
.metric-value.negative { color: #ff4444; }

.metric-change {
    font-size: 13px;
}

.metric-change.positive { color: #3eb83e; }
.metric-change.negative { color: #ff4444; }

/* Progresso */
.progress-card {
    /* CORREÇÃO: Força o layout a ser vertical, como na imagem original. */
    display: flex;
    flex-direction: column; 
    justify-content: space-between;
}

.progress-bar-container {
	margin: 0;
    height: 10px; 
}

.progress-bar {
    width: 100%;
    /* 🎨 AJUSTE FINAL: Fundo da parte não preenchida conforme a imagem de debug */
    background: #1A1A1A; 
    /* 📐 CORREÇÃO DE ALTURA FORÇADA */
    height: 10px !important; 
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    /* 🎨 COR: Verde para o preenchimento */
    background: #3eb83e; 
    transition: width 0.5s;
    /* 📐 CORREÇÃO DE ALTURA FORÇADA */
    height: 10px !important; 
}

.progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
}

/* Gráfico em Tempo Real - CONTROLES E TOGGLE */
.chart-section {
    padding: 20px;
    margin-top: 1.5rem;
}

.chart-controls {
    /* Garante que as abas e a performance fiquem em colunas (uma em cima da outra) */
    display: flex;
    flex-direction: column; 
    gap: 20px;
    font-size: 13px;
    color: #666;
    padding-bottom: 15px;
    border-bottom: 1px solid #1a1a1a;
    margin-bottom: 20px;
}

/* Estilos dos Botões de Toggle (LINHA 1) */
.tab-controls {
    display: flex;
    width: 100%;
    /* Alinhamento das abas na sua imagem. */
    justify-content: flex-start;
    gap: 20px;
}

.toggle-tab {
    cursor: pointer;
    padding: 0 2px 8px 2px;
    transition: all 0.2s;
    color: #666;
    font-weight: 500;
}

.toggle-tab:hover {
    color: #999;
}

.chart-title-active {
    font-weight: 600;
    color: #f0f0f0;
    border-bottom: 2px solid #00ff00;
}

/* Performance e Controles (LINHA 2) */
.performance {
    /* ESSENCIAL: Garante que os elementos na Linha 2 se espalhem horizontalmente */
    display: flex;
    flex-direction: row;
    justify-content: space-between; /* Distribui o espaço entre os grupos */
    align-items: center;
    width: 100%;
}

.performance-title {
    font-weight: 500;
    color: #e7e7e7;
    font-size: 1.2rem;
    /* Alinhado à esquerda na performance */
}

.update-info {
    color: #666;
    display: flex;
    align-items: center;
    gap: 5px;
    /* Puxa a atualização para perto do título de Performance */
    margin-right: auto;
    margin-left: 20px; /* Pequeno espaçamento do título */
}

/* Configurações de Tempo/Tipo no lado direito */
.chart-settings {
    /* ESSENCIAL: Garante que este grupo fique na extrema direita */
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 11px;
    color: #666;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
}

/* Estilo para o SELECT */
.custom-select {
    background-color: #0a0a0a;
    color: #f0f0f0;
    border: 1px solid #1a1a1a;
    border-radius: 3px;
    padding: 4px 10px;
    font-size: 11px;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

/* Conteúdo (Gráfico/Histórico) */
.chart-content {
    min-height: 350px;
}

.chart-canvas {
    position: relative;
    height: 400px;
    overflow: hidden;
    background-color: #000000;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chart-placeholder {
    color: #333;
    font-style: italic;
    font-size: 13px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Estilos da Tabela de Histórico */
.operations-table {
    width: 100%;
    border-collapse: collapse;
}

.operations-table th {
    text-align: left;
    padding: 12px;
    font-size: 11px;
    color: #666;
    border-bottom: 1px solid #1a1a1a;
    font-weight: 500;
    text-transform: uppercase;
}

.operations-table td {
    padding: 12px;
    font-size: 13px;
    border-bottom: 1px solid #1a1a1a;
    color: #ccc;
}

.operations-table tr:hover {
    background: #0f0f0f;
}

.result-positive { color: #00ff00; font-weight: 600; }
.result-negative { color: #ff4444; font-weight: 600; }

/* Ações do Agente */
.actions-section {
    padding: 20px;
    margin-top: 1.5rem;
}

.actions-header h3 {
    font-weight: 500;
    color: #e7e7e7;
    font-size: 1.2rem;
    text-align: left;
    padding-bottom: 15px;
    border-bottom: 1px solid #1a1a1a;
    margin-bottom: 10px;
}

.actions-list {
    display: flex;
    flex-direction: column;
}

.action-item {
    display: flex;
    align-items: center;
	justify-content: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #1a1a1a;
}

.actions-section .actions-list .action-item:last-child {
    border-bottom: none;
}

.action-icon {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    flex-shrink: 0;
}

.action-icon.success { background: #00ff00; }
.action-icon.info { background: #919090; } /* Cor amarela para 'Aguardando' na imagem */
.action-icon.warning { background: #ffaa00; } /* Cor amarela para 'Volume Detectado' na imagem */
.action-icon.error { background: #ff4444; }

.action-content {
    flex-grow: 1;
}

.action-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #f0f0f0;
    text-align: left;
}

.action-description {
    font-size: 13px;
    color: #7c7c7c;
    text-align: left;
}

.hidden {
    display: none;
}

.progress-card, .chart-section, .history-section, .actions-section, .metric-card {
    background: #0e0f0f;
}
</style>