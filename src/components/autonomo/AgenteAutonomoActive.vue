<template>
  <div class="layout-content-agent-autonomo">
    <div class="agent-header">
      <div class="agent-status">
        <div 
          class="status-indicator" 
          :class="{ 'status-active': agentStatus === 'ATIVO', 'status-paused': agentStatus === 'PAUSADO' }"
        ></div>
        <div class="agent-title">
          <h2>Agente Autônomo: {{ agentStatus }}</h2>
          <div class="agent-subtitle">
            <p>Finalizando</p>
          </div>
        </div>
      </div>
      <div class="agent-right">
        <div class="agent-text">
          Estratégia: **Arkon** | Mercado: **Índices Sintéticos** | Risco: **Equilibrado** | Última execução: {{ lastExecutionTime }}
        </div>
      </div>
    </div>
 
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Lucro do dia</div>
        <div class="metric-value" :class="{ 'positive': dailyProfit >= 0, 'negative': dailyProfit < 0 }">
          <span v-if="dailyProfit >= 0">+</span>${{ dailyProfit.toFixed(2) }}
        </div>
        <div class="metric-change" :class="{ 'positive': dailyChange >= 0, 'negative': dailyChange < 0 }">
          <span v-if="dailyChange >= 0">+</span>{{ dailyChange.toFixed(2) }}%
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Perda acumulada</div>
        <div class="metric-value negative">
          -${{ accumulatedLoss.toFixed(2) }}
        </div>
        <div class="metric-change negative">
          -{{ accumulatedChange.toFixed(2) }}%
        </div>
      </div>
      <div class="metric-card progress-card">
        <div class="metric-label">Progresso até a meta</div>

        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: Math.min(100, (dailyProfit / 50) * 100) + '%' }"></div>
          </div>
        </div>        
        <div class="progress-label">
          <span>Meta: $50</span>
          <span>Stop: $25</span>
        </div>
      </div>
    </div>
 
    <div class="chart-section">
      <div class="chart-header">
        <h3>Operações em Tempo Real</h3>
      </div>
      <div class="chart-canvas">
        <div 
          class="chart-point" 
          v-for="(point, index) in realTimeOperations" 
          :key="index"
          :style="{ left: point.x + '%', top: point.y + '%' }"
        >
          <span class="chart-value">+${{ point.value.toFixed(2) }}</span>
        </div>
        <svg class="chart-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline :points="chartLinePoints"></polyline>
        </svg>
      </div>
    </div>
 
    <div class="history-section">
      <div class="history-header">
        <h3>Histórico de Operações</h3>
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
          <tr v-for="(op, index) in operationHistory" :key="index">
            <td>{{ op.time }}</td>
            <td>{{ op.asset }}</td>
            <td>{{ op.type }}</td>
            <td>${{ op.entry.toFixed(2) }}</td>
            <td>${{ op.exit.toFixed(2) }}</td>
            <td :class="op.result >= 0 ? 'result-positive' : 'result-negative'">
              {{ op.result >= 0 ? '+' : '' }}${{ op.result.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
 
    <div class="actions-section">
      <div class="actions-header">
        <h3>Ações do Agente</h3>
      </div>
      <div class="action-item" v-for="(action, index) in agentActions" :key="index">
        <div class="action-icon" :class="action.status"></div>
        <div class="action-content">
          <div class="action-title">{{ action.title }}</div>
          <div class="action-description">{{ action.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
 
// --- Dados Reativos (baseados na imagem e no script original) ---
const agentStatus = ref('ATIVO');
const lastExecutionTime = ref('14:32:16'); // Valor inicial da imagem
const dailyProfit = ref(32.50); // Valor inicial da imagem
const dailyChange = ref(2.34); // Valor inicial da imagem
const accumulatedLoss = ref(8.20); // Valor inicial da imagem
const accumulatedChange = ref(0.54); // Ajustado para 0.54% da imagem

// Dados de simulação para o gráfico de linha (replicando visualmente a curva da imagem)
const realTimeOperations = ref([
    { x: 0, y: 75, value: 5.20 },
    { x: 25, y: 60, value: 6.80 },
    { x: 50, y: 80, value: 8.50 },
    { x: 75, y: 70, value: 8.50 },
    { x: 100, y: 55, value: 8.50 },
]);

const operationHistory = ref([
    { time: '14:32:15', asset: 'Volatility 75', type: 'CALL', entry: 10.00, exit: 18.50, result: 8.50 },
    { time: '14:15:42', asset: 'Volatility 100', type: 'PUT', entry: 10.00, exit: 15.20, result: 5.20 },
    { time: '13:58:30', asset: 'Volatility 75', type: 'CALL', entry: 10.00, exit: 6.90, result: -3.10 },
]);

// Ações do Agente (baseado na imagem)
const agentActions = ref([
    { status: 'success', title: 'Operação finalizada com sucesso', description: '14:32:15 - Lucro de $8.50' },
    { status: 'info', title: 'Entrada executada', description: '14:32:00 - CALL em Volatility 75' },
    { status: 'warning', title: 'Volume detectado', description: '14:31:45 - Confirmação de padrão' },
    { status: 'info', title: 'Aguardando padrão de estratégia', description: '14:30:00 - Análise em andamento' },
]);

// --- Computed Properties ---

// Gera a string de pontos para o polyline do SVG
const chartLinePoints = computed(() => {
    // A linha SVG inverte o eixo Y, então subtraímos de 100 para corresponder visualmente
    return realTimeOperations.value.map(p => `${p.x},${100 - p.y}`).join(' ');
});

// Adaptação para simular o gráfico de linha (não barras)
const updateRealTimeChart = () => {
    if (agentStatus.value === 'ATIVO') {
        // Simula um "shift" nos pontos e adiciona um novo ponto no final
        const newPoints = realTimeOperations.value.slice(1);
        
        // Simulação de valores e posições (Y entre 50 e 90 para manter a curva)
        const lastY = newPoints[newPoints.length - 1]?.y || 70;
        const newY = Math.max(50, Math.min(90, lastY + (Math.random() * 20 - 10)));
        const newValue = (newY / 10); // Valor de exibição
        
        // Atualiza a posição X dos pontos existentes e adiciona o novo ponto
        newPoints.forEach((p, index) => p.x = index * 25);
        
        newPoints.push({ x: 100, y: newY, value: newValue });
        realTimeOperations.value = newPoints;
    }
};

const updateDailyProfit = () => {
    if (agentStatus.value === 'ATIVO') {
        const randomProfitChange = (Math.random() * 2 - 1) * 0.5; // Pequena flutuação
        dailyProfit.value = Math.max(0, dailyProfit.value + randomProfitChange);
        
        // Simulação da mudança percentual
        dailyChange.value = Math.max(0.01, (dailyProfit.value / 1500) * 100); // Base de 1500 (Exemplo)
    }
};

const updateTime = () => {
    const now = new Date();
    // Replicando a formatação da imagem
    lastExecutionTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

// --- Configuração de Intervalos ---
let chartInterval;
let profitInterval;
let timeInterval;

onMounted(() => {
    // Inicia as simulações
    chartInterval = setInterval(updateRealTimeChart, 3000);
    profitInterval = setInterval(updateDailyProfit, 5000);
    timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    // Limpa os intervalos
    clearInterval(chartInterval);
    clearInterval(profitInterval);
    clearInterval(timeInterval);
});
</script>
 
<style scoped>
/* Estilos globais */
.layout-content-agent-autonomo {
    font-family: 'Arial', sans-serif;
    background-color: #121212; /* Fundo escuro */
    color: #f0f0f0; /* Cor do texto claro */
    padding: 20px;
    min-height: 100vh;
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Base de Seções */
.agent-header, .metric-card, .chart-section, .history-section, .actions-section {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
}

/* Header do Agente */
.agent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.agent-status {
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.status-active {
    background: #00ff00; /* Verde */
}

.status-paused {
    background: #ffaa00; /* Laranja/Amarelo */
    animation: none;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.agent-title h2 {
    font-size: 18px;
    font-weight: 600;
    color: white;
}

.agent-subtitle {
    font-size: 12px;
    color: #a7a7a7;
}

.agent-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.agent-text {
    font-size: 12px;
    color: #ccc;
}

.pause-btn {
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    color: #fff;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.pause-btn:hover {
    background: #3a3a3a;
}

/* Cards de Métricas */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Ajustado para 3 colunas */
    gap: 20px;
}

.metric-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
}

.metric-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
}

.metric-value.positive {
    color: #00ff00;
}

.metric-value.negative {
    color: #ff0000;
}

.metric-card{
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 20px;
    text-align: left;
}

.metric-change {
    font-size: 14px;
}

.metric-change.positive {
    color: #00ff00;
}

.metric-change.negative {
    color: #ff0000;
}

/* Progresso */
.progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #888;
    margin-bottom: 6px;
}
/* Replicando layout da imagem para a barra de progresso */
.progress-card .progress-label {
    display: block; /* Quebra a linha do label 'Progresso até a meta' */
    margin-top: 5px;
    font-size: 14px;
    color: #f0f0f0;
}
.progress-card .progress-label span:nth-child(1) {
    float: left;
    color: #888;
}
.progress-card .progress-label span:nth-child(2) {
    float: right;
    color: #888;
}
.progress-bar-container {
    clear: both; /* Limpa o float */
    margin-top: 15px;
}
.progress-bar {
    width: 100%;
    height: 6px;
    background: #2a2a2a;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #00ff00;
    transition: width 0.5s;
}

/* Gráfico em Tempo Real */
.chart-header h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
}

.chart-canvas {
    position: relative;
    height: 150px;
    padding: 10px;
    overflow: hidden;
}

.chart-line-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.chart-line-svg polyline {
    fill: none;
    stroke: #00ff00;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: points 0.5s;
}
/* Efeito de área verde embaixo da linha (como na imagem) */
.chart-line-svg polyline::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 255, 0, 0.1);
    clip-path: polygon(0% 100%, v-bind(chartLinePoints), 100% 100%);
}

.chart-point {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ff00;
    transform: translate(-50%, -50%);
    z-index: 10;
    transition: all 0.5s;
}
/* Valores em cima dos pontos (replicando o visual da imagem) */
.chart-value {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #00ff00;
    white-space: nowrap;
}


/* Histórico de Operações */
.operations-table {
    width: 100%;
    border-collapse: collapse;
}

.operations-table th {
    text-align: left;
    padding: 12px;
    font-size: 12px;
    color: #888;
    border-bottom: 1px solid #2a2a2a;
}

.operations-table td {
    padding: 12px;
    font-size: 14px;
    border-bottom: 1px solid #2a2a2a;
}

.operations-table tr:last-child td {
    border-bottom: none; /* Remove a linha do último item */
}

.operations-table tr:hover {
    background: #222;
}

.result-positive {
    color: #00ff00;
}

.result-negative {
    color: #ff0000;
}

/* Ações do Agente */
.action-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #2a2a2a;
}

.actions-section .action-item:last-child {
    border-bottom: none;
}

.action-icon {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 6px; /* Alinhamento visual */
}

.action-icon.success {
    background: #00ff00;
}

.action-icon.info {
    background: #0099ff; /* Azul */
}

.action-icon.warning {
    background: #ffaa00; /* Amarelo */
}

.action-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
}

.action-description {
    font-size: 12px;
    color: #888;
}
</style>