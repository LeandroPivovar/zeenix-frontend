<template>
    <div class="monitoring-dashboard-wrapper h-full animate-fadeIn">
        <!-- Unified Premium Status Bar -->
        <div class="premium-status-bar mb-6 px-4">
            <div class="status-bar-inner">
                <!-- AI Name & Pulsing Icon -->
                <div class="ai-identity">
                    <div class="ai-pulse-icon">
                        <i class="fas fa-wave-square"></i>
                        <div class="pulse-ring"></div>
                    </div>
                    <div class="ai-info">
                        <div class="flex items-center gap-2">
                            <span class="status-dot"></span>
                            <h2 class="ai-name">IA ORION</h2>
                        </div>
                        <p class="ai-status-detail">SISTEMA OPERANDO AUTOMATICAMENTE</p>
                    </div>
                </div>

                <!-- Financial Stats -->
                <div class="financial-stats">
                    <div class="stat-group">
                        <span class="stat-label">CAPITAL</span>
                        <span class="stat-value">$ {{ stats.balance.toFixed(2) }}</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-group">
                        <span class="stat-label">RESULTADO</span>
                        <div class="flex items-baseline gap-2">
                            <span class="stat-value highlight" :class="stats.profit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                {{ stats.profit >= 0 ? '+' : '' }}${{ stats.profit.toFixed(2) }}
                            </span>
                            <span class="stat-percent" :class="stats.profit >= 0 ? 'bg-zenix-green/10 text-zenix-green' : 'bg-red-500/10 text-red-500'">
                                {{ stats.profit >= 0 ? '+' : '' }}{{ ((stats.profit / (stats.balance || 1)) * 100).toFixed(1) }}%
                            </span>
                        </div>
                        <div class="progress-line" :class="stats.profit >= 0 ? 'bg-zenix-green' : 'bg-red-500'"></div>
                    </div>
                </div>

                <!-- Operations Summary -->
                <div class="ops-summary">
                    <span class="stat-label">OPERAÇÕES</span>
                    <div class="ops-grid">
                        <div class="op-item">
                            <span class="op-val">{{ stats.wins + stats.losses }}</span>
                            <span class="op-lbl">Total</span>
                        </div>
                        <div class="op-item">
                            <span class="op-val text-zenix-green">{{ stats.wins }}</span>
                            <span class="op-lbl">Win</span>
                        </div>
                        <div class="op-item">
                            <span class="op-val text-red-500">{{ stats.losses }}</span>
                            <span class="op-lbl">Loss</span>
                        </div>
                        <div class="op-item">
                            <span class="op-val text-zenix-green">{{ stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(0) : 0 }}%</span>
                            <span class="op-lbl">WR</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content 2-Column Grid -->
        <div class="dashboard-grid grid grid-cols-12 gap-6 px-4 pb-8">
            <!-- Left Column: Main View (Tabs & Content) -->
            <div class="col-span-12 lg:col-span-9">
                <div class="main-card-premium">
                    <!-- Tabs -->
                    <div class="tabs-header border-b border-white/5 mb-6">
                        <div class="flex gap-2">
                            <button @click="activeTab = 'chart'" :class="{ 'active': activeTab === 'chart' }" class="tab-btn">
                                Gráfico
                            </button>
                            <button @click="activeTab = 'history'" :class="{ 'active': activeTab === 'history' }" class="tab-btn">
                                Histórico
                            </button>
                            <button @click="activeTab = 'logs'" :class="{ 'active': activeTab === 'logs' }" class="tab-btn">
                                Registros
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="tab-view-container min-h-[500px]">
                        <!-- Chart Window -->
                        <div v-show="activeTab === 'chart'" class="chart-container fade-in">
                            <div class="chart-header mb-8">
                                <h3 class="text-lg font-medium text-white">Evolução do Resultado da IA ORION</h3>
                                <p class="text-sm text-gray-400">Desempenho em tempo real da sessão atual</p>
                            </div>
                            <div class="flex items-center justify-center flex-col py-20 opacity-40">
                                <i class="fas fa-chart-line text-6xl mb-4"></i>
                                <p>Aguardando conexão com o mercado...</p>
                            </div>
                        </div>

                        <!-- History Section -->
                        <div v-if="activeTab === 'history'" class="history-container fade-in">
                            <div class="table-wrapper overflow-x-auto">
                                <table class="trading-table w-full">
                                    <thead>
                                        <tr>
                                            <th>HORÁRIO</th>
                                            <th>TIPO</th>
                                            <th>ENTRADA</th>
                                            <th>SAÍDA</th>
                                            <th>$ INVESTIDO</th>
                                            <th class="text-right">RESULTADO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="op in operations" :key="op.id">
                                            <td>{{ op.time }}</td>
                                            <td>
                                                <div class="type-badge" :class="op.result === 'WIN' ? 'buy' : 'sell'">
                                                    {{ op.result === 'WIN' ? 'Compra' : 'Venda' }}
                                                </div>
                                            </td>
                                            <td>$1.2340</td> <!-- Placeholder as data might not include it yet -->
                                            <td>$1.2352</td> <!-- Placeholder -->
                                            <td>${{ op.stake.toFixed(2) }}</td>
                                            <td class="text-right font-bold" :class="op.result === 'WIN' ? 'text-zenix-green' : 'text-red-500'">
                                                {{ op.result === 'WIN' ? '+' : '' }}${{ op.pnl.toFixed(2) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Logs Section -->
                        <div v-if="activeTab === 'logs'" class="logs-container fade-in">
                            <div class="logs-scroller space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                <div v-for="log in logs" :key="log.id" class="log-entry">
                                    <span class="log-time">[{{ log.time }}]</span>
                                    <span class="log-msg" :class="log.type">{{ log.message }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Control Sidebar -->
            <div class="col-span-12 lg:col-span-3">
                <div class="control-sidebar h-full flex flex-col gap-4">
                    <!-- Session Info Detail -->
                    <div class="session-card-premium">
                        <div class="session-header mb-6">
                            <div class="icon-box-small">
                                <i class="fas fa-microchip"></i>
                            </div>
                            <div>
                                <h3 class="text-white font-bold">IA ORION</h3>
                                <p class="text-[10px] text-gray-500">Especialista em probabilidade</p>
                            </div>
                        </div>

                        <div class="params-list space-y-4">
                            <div class="param-row">
                                <span class="param-lbl"><i class="fas fa-bolt mr-2"></i> MODO</span>
                                <span class="param-val">VELOZ</span>
                            </div>
                            <div class="param-row">
                                <span class="param-lbl"><i class="fas fa-wave-square mr-2"></i> GESTÃO</span>
                                <span class="param-val">MODERADO</span>
                            </div>
                            
                            <div class="divider"></div>

                            <div class="param-row">
                                <span class="param-lbl">ENTRADA</span>
                                <span class="param-val text-white">$5,00</span>
                            </div>
                            <div class="param-row">
                                <span class="param-lbl">ALVO</span>
                                <span class="param-val text-zenix-green">$50,00</span>
                            </div>
                            <div class="param-row">
                                <span class="param-lbl">LIMITE</span>
                                <span class="param-val text-red-500">$25,00</span>
                            </div>
                        </div>

                        <!-- Protection Badge -->
                        <div class="protection-badge mt-8">
                            <div class="flex items-center gap-3">
                                <div class="shield-icon">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <span class="flex-1 font-medium text-13">Stoploss Blindado</span>
                                <span class="active-tag">ATIVO</span>
                            </div>
                        </div>
                    </div>

                    <!-- Main Action -->
                    <button @click="$emit('stop')" class="pause-ia-btn mt-auto">
                        <i class="fas fa-pause mr-2"></i> Pausar IA
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MonitoringDashboard',
    props: {
        stats: {
            type: Object,
            required: true
        },
        logs: {
            type: Array,
            default: () => []
        },
        operations: {
            type: Array,
            default: () => []
        },
        sessionState: {
            type: Object,
            required: true
        }
    },
    emits: ['stop'],
    data() {
        return {
            activeTab: 'chart'
        }
    }
}
</script>

<style scoped>
/* Dashboard Wrapper */
.monitoring-dashboard-wrapper {
    background: #050505;
    color: #E0E0E0;
    font-family: 'Inter', -apple-system, sans-serif;
}

/* Premium Status Bar */
.premium-status-bar {
    width: 100%;
}
.status-bar-inner {
    background: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 24px;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

/* AI Identity Section */
.ai-identity {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}
.ai-pulse-icon {
    position: relative;
    width: 52px;
    height: 52px;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #22C55E;
    font-size: 1.25rem;
}
.pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(34, 197, 94, 0.4);
    border-radius: 50%;
    animation: ring-pulse 2s infinite;
}
@keyframes ring-pulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.6); opacity: 0; }
}
.ai-name {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 1px;
    color: #22C55E;
    text-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
}
.status-dot {
    width: 8px;
    height: 8px;
    background: #22C55E;
    border-radius: 50%;
    box-shadow: 0 0 8px #22C55E;
}
.ai-status-detail {
    font-size: 0.65rem;
    color: #7A7A7A;
    font-weight: 600;
    margin-top: 2px;
}

/* Financial Stats Section */
.financial-stats {
    display: flex;
    align-items: center;
    gap: 3rem;
}
.stat-group {
    display: flex;
    flex-direction: column;
    position: relative;
}
.stat-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #7A7A7A;
    letter-spacing: 1.5px;
    margin-bottom: 0.5rem;
}
.stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #FFF;
}
.stat-value.highlight {
    text-shadow: 0 0 15px currentColor;
}
.stat-percent {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 6px;
}
.stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
}
.progress-line {
    height: 3px;
    width: 60%;
    border-radius: 3px;
    margin-top: 6px;
    box-shadow: 0 0 10px currentColor;
}

/* Operations Grid Section */
.ops-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.ops-grid {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
}
.op-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.op-val {
    font-size: 0.95rem;
    font-weight: 700;
}
.op-lbl {
    font-size: 0.6rem;
    color: #555;
    font-weight: 700;
}

/* Main Cards Premium */
.main-card-premium, .session-card-premium {
    background: rgba(15, 15, 15, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

/* Tabs Styling */
.tab-btn {
    padding: 0.5rem 1.25rem;
    color: #7A7A7A;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.3s;
    position: relative;
}
.tab-btn.active {
    color: #22C55E;
}
.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #22C55E;
    box-shadow: 0 0 10px #22C55E;
}

/* History Table Styling */
.trading-table th {
    font-size: 0.65rem;
    color: #555;
    letter-spacing: 1px;
    padding-bottom: 1.25rem;
    text-align: left;
}
.trading-table td {
    padding: 1rem 0;
    font-size: 0.85rem;
    color: #D1D1D1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}
.type-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
}
.type-badge.buy { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
.type-badge.sell { background: rgba(239, 68, 68, 0.1); color: #EF4444; }

/* Control Sidebar - Session Card */
.icon-box-small {
    width: 38px;
    height: 38px;
    background: rgba(34, 197, 94, 0.1);
    color: #22C55E;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}
.session-header {
    display: flex;
    align-items: center;
    gap: 12px;
}
.param-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.param-lbl {
    font-size: 0.7rem;
    font-weight: 600;
    color: #7A7A7A;
}
.param-val {
    font-size: 0.8rem;
    font-weight: 800;
}
.divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 1.5rem 0;
}

/* Protection Badge */
.protection-badge {
    background: rgba(20, 20, 20, 0.5);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 14px;
    padding: 0.85rem 1.25rem;
}
.shield-icon {
    color: #22C55E;
    font-size: 1rem;
    filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.4));
}
.active-tag {
    font-size: 0.6rem;
    color: #22C55E;
    font-weight: 800;
    letter-spacing: 1px;
}

/* Pause Button */
.pause-ia-btn {
    background: #22C55E;
    color: #000;
    font-weight: 800;
    font-size: 0.95rem;
    padding: 1.25rem;
    border-radius: 16px;
    width: 100%;
    transition: all 0.3s;
    box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}
.pause-ia-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(34, 197, 94, 0.5);
    filter: brightness(1.1);
}

/* Animations */
.fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

/* Log Styles */
.log-entry { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; display: flex; gap: 10px; }
.log-time { color: #555; }
.success { color: #22C55E; }
.error { color: #EF4444; }
.info { color: #3b82f6; }
.warning { color: #eab308; }
</style>
