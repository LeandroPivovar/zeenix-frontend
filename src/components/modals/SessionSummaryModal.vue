<template>
  <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div 
        class="bg-[#0c0c0c] border border-[#27272a] rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 p-6 relative"
    >
        <!-- Confetti Animation for Win -->
        <div v-if="isWin" class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="absolute top-0 left-1/4 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <div class="absolute top-10 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping delay-100"></div>
            <div class="absolute bottom-10 left-1/3 w-2 h-2 bg-emerald-500 rounded-full animate-ping delay-200"></div>
        </div>

        <!-- Header Icon -->
        <div class="flex justify-center mb-6">
            <div 
                class="w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] relative"
                :class="isWin ? 'bg-green-500/10' : 'bg-red-500/10'"
            >
                <div class="absolute inset-0 rounded-full animate-pulse opacity-50" :class="isWin ? 'bg-green-500/5' : 'bg-red-500/5'"></div>
                <svg v-if="isWin" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold text-center text-white mb-2">
            {{ isWin ? 'Meta Batida!' : 'Sessão Finalizada' }}
        </h2>
        <p class="text-center text-[#A1A1AA] text-sm mb-6 px-4">
            {{ message }}
        </p>

        <!-- Period Filter -->
        <div class="flex justify-center mb-6">
            <div class="bg-[#18181b] p-1 rounded-lg flex gap-1 border border-[#27272a]">
                <button 
                    v-for="period in periods" 
                    :key="period.value"
                    @click="$emit('update:period', period.value)"
                    class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                    :class="currentPeriod === period.value ? 'bg-[#27272a] text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'"
                >
                    {{ period.label }}
                </button>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3 mb-8">
            <!-- Total Profit -->
            <div class="bg-[#18181b] rounded-lg p-3 border border-[#27272a] flex flex-col items-center justify-center">
                <span class="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold mb-1">Resultado Total</span>
                <span class="text-xl font-bold tabular-nums" :class="totalProfit >= 0 ? 'text-green-500' : 'text-red-500'">
                    {{ totalProfit >= 0 ? '+' : '' }}{{ currencySymbol }}{{ formatPrice(totalProfit) }}
                </span>
            </div>

            <!-- Cycle Stopped -->
            <div class="bg-[#18181b] rounded-lg p-3 border border-[#27272a] flex flex-col items-center justify-center">
                <span class="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold mb-1">Ciclo Final</span>
                <span class="text-xl font-bold text-white tabular-nums">
                    {{ cycle }} <span class="text-sm text-[#52525b] font-normal">/ 4</span>
                </span>
            </div>

             <!-- Stop Reason -->
             <div class="bg-[#18181b] rounded-lg p-3 border border-[#27272a] flex flex-col items-center justify-center col-span-2">
                <span class="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold mb-1">Motivo do Encerramento</span>
                <span class="text-sm font-medium text-white flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="reasonColor"></span>
                    {{ reasonText }}
                </span>
            </div>

            <!-- Win Rate -->
            <div class="bg-[#18181b] rounded-lg p-3 border border-[#27272a] flex flex-col items-center justify-center">
                <span class="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold mb-1">Assertividade</span>
                <span class="text-xl font-bold tabular-nums" :class="getWinRateColor(winRate)">
                    {{ winRate.toFixed(1) }}%
                </span>
            </div>

            <!-- Total Operations -->
            <div class="bg-[#18181b] rounded-lg p-3 border border-[#27272a] flex flex-col items-center justify-center">
                <span class="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-semibold mb-1">Total de Operações</span>
                <span class="text-xl font-bold text-white tabular-nums">
                    {{ totalTrades }}
                </span>
            </div>
        </div>

        <!-- Action Button -->
        <button 
            @click="$emit('view-details')" 
            class="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
            Visualizar Detalhes
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SessionSummaryModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    totalProfit: {
      type: Number,
      default: 0
    },
    cycle: {
      type: Number,
      default: 1
    },
    reason: {
      type: String,
      default: 'STOP_LOSS' // 'TARGET', 'STOP_LOSS', 'BLINDADO'
    },
    currencySymbol: {
      type: String,
      default: '$'
    },
    winRate: {
      type: Number,
      default: 0
    },
    totalTrades: {
      type: Number,
      default: 0
    },
    currentPeriod: {
      type: String,
      default: 'session'
    }
  },
  data() {
    return {
        periods: [
            { label: 'Sessão', value: 'session' },
            { label: 'Hoje', value: 'today' },
            { label: '7 Dias', value: '7d' },
            { label: '30 Dias', value: '30d' }
        ]
    }
  },
  computed: {
    isWin() {
        return this.totalProfit > 0 && this.reason === 'TARGET';
    },
    message() {
        if (this.reason === 'TARGET') return `Os ciclos foram concluídos e você garantiu um total de +${this.currencySymbol}${this.formatPrice(this.totalProfit)}`;
        if (this.reason === 'BLINDADO') return 'O Stop Blindado foi ativado para proteger seus lucros neste ciclo.';
        if (this.reason === 'CYCLE_STOP') return 'O limite de perdas do ciclo (Drawdown) foi atingido. A sessão foi encerrada por segurança.';
        return 'O limite de perdas foi atingido. Volte amanhã para operar com segurança.';
    },
    reasonText() {
        const map = {
            'TARGET': 'Meta Diária Atingida',
            'STOP_LOSS': 'Stop Loss Diário',
            'BLINDADO': 'Lucro Protegido (Blindado)',
            'CYCLE_STOP': 'Stop por Ciclo'
        };
        return map[this.reason] || this.reason;
    },
    reasonColor() {
        if (this.reason === 'TARGET') return 'bg-green-500';
        if (this.reason === 'BLINDADO') return 'bg-yellow-500';
        return 'bg-red-500';
    }
  },
  methods: {
    formatPrice(value) {
      if (value === undefined || value === null) return '0,00';
      return Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    getWinRateColor(rate) {
        if (rate >= 50) return 'text-green-500';
        if (rate >= 40) return 'text-yellow-500';
        return 'text-red-500';
    }
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-in {
    animation-duration: 0.3s;
    animation-fill-mode: both;
}
</style>
