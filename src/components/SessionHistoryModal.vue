<template>
    <Teleport to="body">
        <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" @click.self="close">
            <div class="w-full max-w-5xl bg-secondary/95 rounded-2xl border border-border/50 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 md:p-6 border-b border-border/30">
                    <div class="flex items-center gap-3 md:gap-4">
                        <div class="hidden md:flex w-12 h-12 rounded-xl bg-success flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                                <path d="M3 3v18h18"/>
                                <path d="m19 9-5 5-4-4-3 3"/>
                            </svg>
                        </div>
                        <div class="flex flex-col">
                            <h2 class="text-lg md:text-xl font-black text-white uppercase tracking-tight">Histórico de Sessões</h2>
                            <p class="text-[12px] text-[#A1A1A1] mt-0.5 leading-relaxed max-w-md">
                                Acompanhe nesta área o resumo oficial de suas últimas execuções e resultados detalhados.
                            </p>
                        </div>
                    </div>
                    <button @click="close" class="w-8 h-8 rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center text-muted-foreground hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar-zenix p-4 md:p-6 space-y-4 md:space-y-6">
                    <!-- Summary Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <!-- Total Operations Card -->
                        <div class="p-5 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/40 border border-border/40">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Operações Totais</span>
                                <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <p class="text-2xl font-bold text-foreground">{{ summary.totalOperations.toLocaleString('pt-BR') }}</p>
                        </div>

                        <!-- Total Profit Card -->
                        <div class="p-5 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/40 border border-border/40">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Lucro Total</span>
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="summary.totalProfit >= 0 ? 'bg-success/10 border border-success/30' : 'bg-red-500/10 border border-red-500/30'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="summary.totalProfit >= 0 ? 'text-success' : 'text-red-500'">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                </div>
                            </div>
                            <p class="text-2xl font-bold" :class="summary.totalProfit >= 0 ? 'text-success' : 'text-red-500'">
                                {{ summary.totalProfit >= 0 ? '+' : '' }}${{ summary.totalProfit.toFixed(2) }}
                            </p>
                        </div>

                        <!-- Best AI Card -->
                        <div class="p-5 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/40 border border-border/40">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Melhor IA</span>
                                <div class="w-8 h-8 rounded-lg bg-zenix-green/10 border border-zenix-green/30 flex items-center justify-center">
                                    <i class="fas fa-brain text-zenix-green text-xs"></i>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-lg font-bold text-foreground truncate uppercase">{{ summary.bestAI.name || 'N/A' }}</p>
                                <p class="text-sm font-bold text-success mt-1" v-if="summary.bestAI.name">
                                    +${{ summary.bestAI.profit.toFixed(2) }}
                                </p>
                            </div>
                        </div>

                        <!-- Best Time Card -->
                        <div class="p-5 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/40 border border-border/40">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Melhor Horário</span>
                                <div class="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                                    <i class="far fa-clock text-orange-400 text-xs"></i>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-lg font-bold text-white truncate">{{ summary.bestHours.bracket || 'N/A' }}</p>
                                <p class="text-sm font-bold text-success mt-1" v-if="summary.bestHours.bracket">
                                    {{ summary.bestHours.winRate.toFixed(1) }}% Winrate
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Sessions Table -->
                    <div class="rounded-xl border border-border/30 overflow-hidden bg-[#0B0B0B]">
                        <div v-if="loading" class="p-8 text-center">
                            <div class="inline-block w-8 h-8 border-2 border-success/30 border-t-success rounded-full animate-spin"></div>
                            <p class="mt-3 text-sm text-muted-foreground">Carregando histórico...</p>
                        </div>

                        <div v-else-if="sessions.length === 0" class="p-8 text-center">
                            <p class="text-muted-foreground/60">Nenhuma sessão encontrada</p>
                        </div>

                        <div v-else class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-[#161616] text-xs text-muted-foreground uppercase font-semibold tracking-wider border-b border-border/30">
                                    <tr>
                                        <th class="px-4 py-4 text-left">Data/Hora</th>
                                        <th class="px-4 py-4 text-left">IA</th>
                                        <th class="px-4 py-4 text-center">Operações</th>
                                        <th class="px-4 py-4 text-center">Wins</th>
                                        <th class="px-4 py-4 text-center">Losses</th>
                                        <th class="px-4 py-4 text-right">Lucro</th>
                                        <th class="px-4 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="text-[13px]">
                                    <tr v-for="(session, index) in sessions" :key="session.sessionId" 
                                        class="border-b border-border/20 transition-colors hover:bg-secondary/30"
                                        :class="index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10'">
                                        <td class="px-4 py-4 font-mono text-foreground">
                                            {{ formatDate(session.startTime) }}
                                        </td>
                                        <td class="px-4 py-4">
                                            <span class="font-bold text-foreground uppercase">{{ session.aiName || 'N/A' }}</span>
                                        </td>
                                        <td class="px-4 py-4 text-center font-medium text-foreground">
                                            {{ session.stats?.totalTrades || 0 }}
                                        </td>
                                        <td class="px-4 py-4 text-center font-medium text-success">
                                            {{ session.stats?.wins || 0 }}
                                        </td>
                                        <td class="px-4 py-4 text-center font-medium text-red-500/60">
                                            {{ session.stats?.losses || 0 }}
                                        </td>
                                        <td class="px-4 py-4 text-right">
                                            <span class="font-bold" :class="(session.stats?.profitLoss || 0) >= 0 ? 'text-success' : 'text-red-500'">
                                                {{ (session.stats?.profitLoss || 0) >= 0 ? '+' : '' }}${{ (session.stats?.profitLoss || 0).toFixed(2) }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-4 text-center">
                                            <span class="px-2 py-1 rounded-md text-[10px] font-black uppercase" 
                                                  :class="getStatusClass(session.status)">
                                                {{ session.status || 'N/A' }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
export default {
    name: 'SessionHistoryModal',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            sessions: [],
            summary: {
                totalOperations: 0,
                totalProfit: 0,
                bestAI: { name: '', profit: 0 },
                bestHours: { bracket: '', winRate: 0 }
            },
            loading: false
        };
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.fetchHistory();
            }
        }
    },
    methods: {
        async fetchHistory() {
            this.loading = true;
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const response = await fetch(`${apiBaseUrl}/ai/sessions/history/${this.userId}?limit=20`);
                const result = await response.json();
                
                console.log('[SessionHistory] Resposta completa da API:', result);
                
                if (result.success) {
                    this.sessions = result.data.sessions || [];
                    const baseSummary = result.data.summary || { totalOperations: 0, totalProfit: 0 };
                    
                    // Calcular métricas adicionais
                    this.calculateAdvancedMetrics(this.sessions, baseSummary);
                    
                    console.log('[SessionHistory] Sessões carregadas:', this.sessions);
                    console.log('[SessionHistory] Resumo (Custom):', this.summary);
                }
            } catch (error) {
                console.error('[SessionHistory] Erro ao carregar histórico:', error);
            } finally {
                this.loading = false;
            }
        },
        calculateAdvancedMetrics(sessions, baseSummary) {
            const aiAggregates = {};
            const hourAggregates = {};

            sessions.forEach(session => {
                // Melhor IA (Lucro por Nome)
                const aiName = (session.aiName || 'Unknown').toUpperCase();
                const profit = session.stats?.profitLoss || 0;
                
                if (!aiAggregates[aiName]) aiAggregates[aiName] = 0;
                aiAggregates[aiName] += profit;

                // Melhores Horários (Winrate por Hora)
                if (session.startTime) {
                    const date = new Date(session.startTime);
                    const hour = date.getHours();
                    const bracket = `${hour.toString().padStart(2, '0')}:00 - ${(hour+1).toString().padStart(2, '0')}:00`;
                    
                    if (!hourAggregates[bracket]) {
                        hourAggregates[bracket] = { wins: 0, total: 0 };
                    }
                    
                    hourAggregates[bracket].wins += (session.stats?.wins || 0);
                    hourAggregates[bracket].total += (session.stats?.totalTrades || 0);
                }
            });

            // Encontrar Melhor IA
            let bestAIName = '';
            let maxAIProfit = -Infinity;
            
            Object.keys(aiAggregates).forEach(name => {
                if (aiAggregates[name] > maxAIProfit) {
                    maxAIProfit = aiAggregates[name];
                    bestAIName = name;
                }
            });

            // Encontrar Melhor Horário
            let bestHourBracket = '';
            let maxWinRate = -1;

            Object.keys(hourAggregates).forEach(bracket => {
                const stats = hourAggregates[bracket];
                if (stats.total >= 5) { // Mínimo de 5 operações para relevância
                    const winRate = (stats.wins / stats.total) * 100;
                    if (winRate > maxWinRate) {
                        maxWinRate = winRate;
                        bestHourBracket = bracket;
                    }
                }
            });

            this.summary = {
                ...baseSummary,
                bestAI: {
                    name: bestAIName,
                    profit: maxAIProfit !== -Infinity ? maxAIProfit : 0
                },
                bestHours: {
                    bracket: bestHourBracket,
                    winRate: maxWinRate !== -1 ? maxWinRate : 0
                }
            };
        },
        formatDate(timestamp) {
            if (!timestamp) {
                console.warn('[SessionHistory] Timestamp vazio:', timestamp);
                return 'Data não disponível';
            }
            
            console.log('[SessionHistory] Formatando timestamp:', timestamp, typeof timestamp);
            
            try {
                const date = new Date(timestamp);
                
                if (isNaN(date.getTime())) {
                    console.error('[SessionHistory] Data inválida:', timestamp);
                    return 'Data inválida';
                }
                
                return date.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (error) {
                console.error('[SessionHistory] Erro ao formatar data:', error);
                return 'Erro na data';
            }
        },
        getStatusClass(status) {
            if (status === 'active') return 'bg-success/10 text-success border border-success/20';
            if (status === 'stopped') return 'bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/20';
            return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
}

.custom-scrollbar-zenix::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar-zenix::-webkit-scrollbar-track {
    background: rgba(0, 255, 128, 0.02);
    border-radius: 10px;
}

.custom-scrollbar-zenix::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 128, 0.2);
    border-radius: 10px;
    border: 1px solid rgba(0, 255, 128, 0.05);
}

.custom-scrollbar-zenix::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 255, 128, 0.4);
}
</style>
