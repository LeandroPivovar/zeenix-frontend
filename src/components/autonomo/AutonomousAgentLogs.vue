<template>
  <div class="operation-logs-container">
    <!-- Desktop Terminal View -->
    <div class="hidden md:block">
      <div dir="ltr" class="relative overflow-hidden h-[400px] border-border bg-black/40">
        <div class="h-full w-full overflow-y-auto custom-scrollbar" ref="desktopLogsContainer">
          <div class="p-4 font-mono text-xs space-y-4 text-left">
            <div v-if="realtimeLogs.length === 0" class="flex flex-col items-center justify-center h-[300px] text-muted-foreground opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m7 15 5-5 5 5"/></svg>
              <p>Aguardando atividade do agente...</p>
            </div>
            
            <div 
              v-for="(log, index) in formattedLogs" 
              :key="log.id || index"
              :class="['space-y-0.5 animate-in fade-in slide-in-from-left-1 duration-200 p-2 border-b border-white/[0.05]']"
            >
              <div class="flex items-start gap-2">
                <span class="shrink-0 font-mono transition-colors text-[#A1A1AA]">[{{ formatTimestamp(log.timestamp) }}]</span>
                <div :class="['space-y-0.5', getLogColorClass(log.logType)]">
                  <div class="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                    <span>{{ getLogEmoji(log.logType) }}</span>
                    <span>{{ log.title }}</span>
                  </div>
                  <div v-if="log.details" class="pl-5 text-[10px] leading-relaxed transition-colors text-[#A1A1AA]">
                    {{ log.details }}
                  </div>
                  <!-- Special handling for multi-line analysis or config if available -->
                   <div v-if="log.message && log.message.includes('\n')" class="pl-5 space-y-0.5">
                      <div v-for="(line, lIdx) in log.message.split('\n').slice(1)" :key="lIdx" class="text-[10px] leading-relaxed transition-colors text-[#A1A1AA]">
                        • {{ line.trim() }}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden">
      <div class="logs-content h-[400px] overflow-y-auto custom-scrollbar" ref="mobileLogsContainer">
        <div v-if="realtimeLogs.length === 0" class="flex flex-col items-center justify-center h-full text-[#A1A1AA] opacity-50 text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p class="text-xs">Nenhum log registrado</p>
        </div>
        
        <div v-else class="space-y-3 p-3">
          <div 
            v-for="(log, index) in formattedLogs" 
            :key="log.id || index" 
            class="flex items-start gap-3 p-3 bg-[#111111] border border-[#1c1c1c] rounded-xl"
          >
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0', getLogBgClass(log.logType)]">
              <i :class="[log.icon, 'text-xs text-white']"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <p class="text-[11px] font-bold text-white uppercase tracking-tight">{{ log.title }}</p>
                <span class="text-[9px] text-[#A1A1AA] font-mono">{{ formatTimestamp(log.timestamp) }}</span>
              </div>
              <p class="text-[10px] text-[#A1A1AA] leading-snug">{{ log.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutonomousAgentLogs',
  props: {
    userId: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    agentName: { type: String, default: 'AGENTE' }
  },
  data() {
    return {
      realtimeLogs: [],
      logPollingInterval: null,
      lastLogTimestamp: null
    };
  },
  watch: {
    isActive(newVal) {
      if (newVal) this.startLogPolling();
      else this.stopLogPolling();
    },
    userId(newVal) {
      if (newVal && this.isActive) {
        this.stopLogPolling();
        this.startLogPolling();
      }
    }
  },
  mounted() {
    if (this.isActive) this.startLogPolling();
  },
  beforeUnmount() {
    this.stopLogPolling();
  },
  computed: {
    formattedLogs() {
      const limitedLogs = this.realtimeLogs.slice(0, 50);
      return limitedLogs.map(log => {
        let logType = 'info';
        let icon = 'fa-solid fa-info-circle';
        let title = log.message || '';
        let details = '';
        
        const message = log.message || '';
        const module = log.module || '';
        
        // Detect Config
        if (message.includes('CONFIG') || module === 'CONFIG') {
          logType = 'config';
          icon = 'fa-solid fa-gear';
          title = 'Configurações Iniciais';
        }
        // Success / Win
        else if (message.includes('WON') || message.includes('VITÓRIA') || message.includes('✅') || 
                 (module === 'TRADER' && message.includes('closed') && !message.includes('lost'))) {
          logType = 'success';
          icon = 'fa-solid fa-check';
          title = 'Resultado: WIN';
        }
        // Loss
        else if (message.includes('LOST') || message.includes('DERROTA') || message.includes('❌') || 
                 (module === 'TRADER' && message.includes('lost'))) {
          logType = 'loss';
          icon = 'fa-solid fa-xmark';
          title = 'Resultado: LOSS';
        }
        // Entry / Execution
        else if (message.includes('Buy') || message.includes('Proposal') || message.includes('executada') || message.includes('🚀')) {
          logType = 'purchase';
          icon = 'fa-solid fa-rocket';
          title = 'Executando Entrada';
        }
        // Risk
        else if (module === 'RISK' || message.includes('GUARDIÃO') || message.includes('🛡️')) {
          logType = 'risk';
          icon = 'fa-solid fa-shield-halved';
          title = 'Guardião de Risco';
        }
        // Analysis
        else if (module === 'ANALYZER' || message.includes('ANÁLISE') || message.includes('🧠') || message.includes('🔍')) {
          logType = 'analysis';
          icon = 'fa-solid fa-brain';
          title = 'Análise do Mercado';
        }
        // Collection / Data
        else if (message.includes('COLETANDO') || message.includes('📡')) {
          logType = 'data';
          icon = 'fa-solid fa-satellite-dish';
          title = 'Coletando Dados...';
        }
        
        // Extract basic details if not present
        if (!details) {
          const firstLine = message.split('\n')[0];
          details = firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine;
        }

        // Apply Zenix v2.0 Standardization
        const zenixPrefix = `❄️ Zenix v2.0 | ${this.agentName.toUpperCase()} | `;
        if (!title.startsWith('❄️')) {
          title = zenixPrefix + title;
        }

        return { ...log, logType, icon, title, details };
      });
    }
  },
  methods: {
    getLogEmoji(type) {
      const emojis = {
        config: '❄️',
        success: '✅',
        loss: '❌',
        purchase: '🚀',
        risk: '🛡️',
        analysis: '🧠',
        data: '📡',
        info: 'ℹ️'
      };
      return emojis[type] || emojis.info;
    },
    getLogColorClass(type) {
      const classes = {
        config: 'text-blue-400',
        success: 'text-green-500',
        loss: 'text-red-500',
        purchase: 'text-cyan-400',
        risk: 'text-orange-400 border-l-2 border-orange-400/30 pl-2',
        analysis: 'text-yellow-400',
        data: 'text-[#A1A1AA] opacity-80',
        info: 'text-[#FAFAFA]'
      };
      return classes[type] || classes.info;
    },
    getLogBgClass(type) {
      const classes = {
        config: 'bg-blue-500',
        success: 'bg-green-500',
        loss: 'bg-red-500',
        purchase: 'bg-cyan-500',
        risk: 'bg-orange-500',
        analysis: 'bg-yellow-500',
        data: 'bg-gray-600',
        info: 'bg-gray-700'
      };
      return classes[type] || classes.info;
    },
    formatTimestamp(ts) {
      if (!ts) return '--:--:--';
      try {
        const d = new Date(ts);
        return d.toLocaleTimeString('pt-BR', { 
          hour12: false,
          timeZone: 'America/Sao_Paulo'
        });
      } catch (e) {
        return ts;
      }
    },
    async fetchRealtimeLogs() {
      try {
        let userId = this.userId || localStorage.getItem('userId');
        if (!userId) return;
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        const response = await fetch(`${apiBase}/autonomous-agent/logs/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            console.log('[AutonomousAgentLogs] Logs recebidos:', result.data.length);
            this.realtimeLogs = result.data;
            this.$emit('update-logs', this.realtimeLogs);
          }
        }
      } catch (e) { console.error('Log fetch error:', e); }
    },
    startLogPolling() {
      this.stopLogPolling();
      this.fetchRealtimeLogs();
      this.logPollingInterval = setInterval(() => this.fetchRealtimeLogs(), 3000);
    },
    stopLogPolling() {
      if (this.logPollingInterval) clearInterval(this.logPollingInterval);
    }
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
</style>
