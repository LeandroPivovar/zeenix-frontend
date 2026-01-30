<template>
    <div class="monitoring-dashboard-wrapper h-full">
        <!-- Header -->
        <div class="content-header mb-6 flex justify-between items-center px-4">
            <div>
                <h1 class="text-2xl font-bold text-white">Acompanhamento de Estratégia [BETA]</h1>
                <p class="text-sm text-[#7D7D7D]">Acompanhe a atividade do robô em tempo real.</p>
            </div>
            <button @click="$emit('stop')" class="stop-btn">
                <i class="fas fa-stop mr-2"></i> Parar Robô
            </button>
        </div>

        <!-- Dashboard Content -->
        <div class="monitoring-dashboard animate-fadeIn px-4">
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <!-- Balance Card -->
                <div class="stats-card">
                    <div class="stats-icon-wrapper blue">
                        <i class="fas fa-wallet"></i>
                    </div>
                    <div class="stats-info">
                        <span class="stats-label">Saldo Atual</span>
                        <span class="stats-value">$ {{ stats.balance.toFixed(2) }}</span>
                    </div>
                </div>

                <!-- Session P/L Card -->
                <div class="stats-card">
                    <div class="stats-icon-wrapper" :class="stats.profit >= 0 ? 'green' : 'red'">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stats-info">
                        <span class="stats-label">Sessão P/L</span>
                        <span class="stats-value" :class="stats.profit >= 0 ? 'text-zenix-green glow-green-text' : 'text-red-500'">
                            {{ stats.profit >= 0 ? '+' : '' }}$ {{ stats.profit.toFixed(2) }}
                        </span>
                    </div>
                </div>

                <!-- Win/Loss Card -->
                <div class="stats-card">
                    <div class="stats-icon-wrapper yellow">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stats-info">
                        <span class="stats-label">Assertividade</span>
                        <span class="stats-value text-zenix-green">
                            {{ stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(0) : 0 }}%
                        </span>
                        <span class="text-[10px] text-[#7A7A7A] ml-1">{{ stats.wins }}W / {{ stats.losses }}L</span>
                    </div>
                </div>

                <!-- Status/Recovery Card -->
                <div v-if="sessionState.isRecoveryMode" class="stats-card border border-zenix-green/30 bg-zenix-green/5">
                    <div class="stats-icon-wrapper green">
                        <i class="fas fa-undo"></i>
                    </div>
                    <div class="stats-info">
                        <span class="stats-label">Recuperação</span>
                        <span class="stats-value text-zenix-green glow-green-text">$ {{ (sessionState.totalLossAccumulated - sessionState.recoveredAmount).toFixed(2) }}</span>
                        <p class="text-[10px] text-gray-500">Restante para Meta</p>
                    </div>
                </div>
                <div v-else class="stats-card">
                    <div class="stats-icon-wrapper green pulse">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="stats-info">
                        <span class="stats-label">Status da IA</span>
                        <span class="stats-value text-sm text-zenix-green">{{ stats.status }}</span>
                        <p class="text-[10px] text-zenix-green/80">{{ stats.statusDesc }}</p>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="monitoring-tabs-container mb-4">
                <div class="monitoring-tabs flex gap-4 border-b border-[#333]">
                    <button @click="activeTab = 'chart'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeTab === 'chart' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                        <i class="fas fa-chart-area mr-2"></i> Gráfico
                    </button>
                    <button @click="activeTab = 'logs'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeTab === 'logs' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                        <i class="fas fa-list-ul mr-2"></i> Registros
                    </button>
                    <button @click="activeTab = 'history'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeTab === 'history' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                        <i class="fas fa-history mr-2"></i> Histórico
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="tab-content-container bg-[#141414] border border-[#333] rounded-xl p-6 min-h-[400px]">
                <!-- Chart Placeholder -->
                <div v-show="activeTab === 'chart'" class="chart-tab-content flex items-center justify-center h-full min-h-[300px]">
                    <div class="text-center">
                        <i class="fas fa-chart-line text-6xl text-zenix-green/20 mb-4 block"></i>
                        <p class="text-[#7A7A7A]">Aguardando conexão com o mercado...</p>
                    </div>
                </div>

                <!-- Logs Tab -->
                <div v-if="activeTab === 'logs'" class="logs-tab-content h-full">
                    <div class="logs-list-wrapper space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <div v-for="log in logs" :key="log.id" class="p-3 bg-[#0B0B0B] rounded-lg border border-[#222] font-mono text-xs flex gap-3">
                            <span class="text-gray-500">[{{ log.time }}]</span>
                            <span :class="{ 'text-zenix-green': log.type === 'success', 'text-red-500': log.type === 'error', 'text-blue-400': log.type === 'info', 'text-yellow-400': log.type === 'warning' }">
                                {{ log.message }}
                            </span>
                        </div>
                        <div v-if="logs.length === 0" class="text-center py-12 text-[#7A7A7A]">
                            Nenhum log registrado ainda.
                        </div>
                    </div>
                </div>

                <!-- History Tab -->
                <div v-if="activeTab === 'history'" class="history-tab-content">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="border-b border-[#333] text-xs text-[#7A7A7A] uppercase tracking-wider">
                                <tr>
                                    <th class="pb-4">Hora</th>
                                    <th class="pb-4">Mercado</th>
                                    <th class="pb-4">Contrato</th>
                                    <th class="pb-4">Investimento</th>
                                    <th class="pb-4">Resultado</th>
                                    <th class="pb-4 text-right">P/L</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                <tr v-for="op in operations" :key="op.id" class="border-b border-[#222] last:border-0">
                                    <td class="py-4">{{ op.time }}</td>
                                    <td class="py-4">{{ op.market }}</td>
                                    <td class="py-4 text-xs">{{ op.contract }}</td>
                                    <td class="py-4">$ {{ op.stake.toFixed(2) }}</td>
                                    <td class="py-4">
                                        <span :class="op.result === 'WIN' ? 'bg-zenix-green/10 text-zenix-green border-zenix-green/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="px-2 py-1 rounded border text-[10px] font-bold">
                                            {{ op.result }}
                                        </span>
                                    </td>
                                    <td class="py-4 text-right font-bold" :class="op.result === 'WIN' ? 'text-zenix-green' : 'text-red-500'">
                                        {{ op.result === 'WIN' ? '+' : '' }}{{ op.pnl }}
                                    </td>
                                </tr>
                                <tr v-if="operations.length === 0">
                                    <td colspan="6" class="text-center py-12 text-[#7A7A7A]">Nenhuma operação executada nesta sessão.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
/* Copied styles from original */
.stop-btn {
    background-color: #ef4444;
    color: white;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
}
.stop-btn:hover {
    background-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.stats-card {
    background: rgba(20, 20, 20, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.stats-card:hover {
    background: rgba(26, 26, 26, 0.8);
    border-color: rgba(34, 197, 94, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.stats-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: all 0.3s ease;
}
.stats-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
.stats-icon-wrapper.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
.stats-icon-wrapper.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
.stats-icon-wrapper.yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2); }

.glow-green-text { text-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
.text-zenix-green { color: #22C55E; }

.pulse { animation: pulse 2s infinite; }
@keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #0F0F0F; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
</style>
