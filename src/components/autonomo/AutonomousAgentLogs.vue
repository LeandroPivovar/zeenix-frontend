<template>
  <div class="operation-logs-container">
    <!-- Header with Action Buttons -->
    <div class="flex items-center justify-end my-3 px-2">
      <div class="flex items-center gap-2">
        <!-- Clear Logs Button -->
        <button
          @click="clearLogs"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#27272a] text-[#FAFAFA] hover:bg-[#3f3f46] transition-colors border border-[#3f3f46]"
          title="Limpar notificações"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          <span>Limpar</span>
        </button>
        
        <!-- Export Logs Button -->
        <button
          @click="exportLogs"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
          title="Exportar registros"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          <span>Exportar Registro</span>
        </button>
      </div>
    </div>

    <div class="hidden md:block">
      <div dir="ltr" class="relative h-[500px] border-border bg-black/40">
        <div class="h-full w-full overflow-y-scroll custom-scrollbar" ref="desktopLogsContainer">
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
                <span class="shrink-0 font-mono transition-colors text-[#A1A1AA] text-[10px] items-center flex h-5">[{{ formatTimestamp(log.timestamp) }}]</span>
                <div :class="['space-y-0.5 w-full', getLogColorClass(log.logType)]">
                  <div class="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px] h-5">
                    <i v-if="log.icon" :class="[log.icon, 'text-[10px]']"></i>
                    <span>{{ log.title }}</span>
                  </div>
                  <div v-if="log.details" class="pl-0 text-[10px] leading-relaxed transition-colors text-[#D1D1D6] whitespace-pre-wrap">
                    {{ log.details }}
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
      <div class="logs-content h-[500px] overflow-y-scroll custom-scrollbar" ref="mobileLogsContainer">
        <div v-if="realtimeLogs.length === 0" class="flex flex-col items-center justify-center h-full text-[#A1A1AA] opacity-50 text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p class="text-xs">Nenhum log registrado</p>
        </div>
        
        <div v-else class="space-y-2 p-3">
          <div 
            v-for="(log, index) in formattedLogs" 
            :key="log.id || index" 
            class="flex items-start gap-3 p-3 bg-[#111111]/50 border border-white/[0.05] rounded-lg"
          >
            <div :class="['shrink-0 mt-0.5', getLogColorClass(log.logType)]">
              <i :class="[log.icon, 'text-sm']"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <p :class="['text-[11px] font-bold uppercase tracking-tight', getLogColorClass(log.logType)]">{{ log.title }}</p>
                <span class="text-[9px] text-[#A1A1AA] font-mono">{{ formatTimestamp(log.timestamp) }}</span>
              </div>
              <div v-if="log.details" class="text-[10px] text-[#D1D1D6] leading-snug text-left mt-0.5 whitespace-pre-wrap">
                 {{ log.details.trim() }}
              </div>
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
    agentName: { type: String, default: 'AGENTE' },
    market: { type: String, default: '' },
    riskProfile: { type: String, default: '' },
    accountType: { type: String, default: '' }
  },
  data() {
    return {
      realtimeLogs: [],
      lastLogTimestamp: null
    };
  },
  watch: {
    isActive(newVal) {
      if (newVal) this.fetchRealtimeLogs(200);
    },
    userId(newVal) {
      if (newVal && this.isActive) {
        this.fetchRealtimeLogs(200);
      }
    }
  },
  mounted() {
    if (this.isActive) this.fetchRealtimeLogs(200);
  },
  beforeUnmount() {
    // No polling to stop
  },
  computed: {
    allFormattedLogs() {
      const limitedLogs = this.realtimeLogs;
      return limitedLogs.map(log => {
        const message = log.message || '';
        
        // Parse title and details
        const lines = message.split('\n');
        const titleLine = lines[0].replace(/^\[.*?\]\s*/, '').trim().toUpperCase();
        const details = lines.length > 1 ? lines.slice(1).join('\n') : '';
        
        // Determine type based on title and content
        let logType = 'info';
        
        // 1. Result Logs (Green/Red) - Prioritize explicit result/concluída
        if (titleLine.includes('RESULTADO') || titleLine.includes('CONCLUÍDA')) {
          if (message.toUpperCase().includes('LOSS')) logType = 'loss';
          else logType = 'success';
        }
        // 2. Yellow/Warning Logs
        else if (
          titleLine.includes('BLOQUEADA') || 
          titleLine.includes('INSUFICIENTE') ||
          titleLine.includes('ERRO') ||
          log.type === 'alerta' ||
          log.type === 'erro' ||
          titleLine.includes('SEQUÊNCIA') || 
          titleLine.includes('TROCA') || 
          titleLine.includes('MARTINGALE') ||
          titleLine.includes('PARCIAL') ||
          (titleLine.includes('INÍCIO') && titleLine.includes('RECUPERAÇÃO')) ||
          (titleLine.includes('NÍVEL') && !titleLine.includes('SOROS'))
        ) {
          logType = 'warning';
        }
        // 3. Blue/Analysis Logs (Blue)
        else if (
          titleLine.includes('INÍCIO') || 
          titleLine.includes('ANÁLISE') || 
          log.type === 'analise' ||
          titleLine.includes('COLETA') || 
          titleLine.includes('AJUSTE') ||
          titleLine.includes('CONTRATO') ||
          titleLine.includes('STAKE')
        ) {
          logType = 'blue';
        }
        // 4. Success/Win Logs (Green)
        else if (
          log.type === 'vitoria' ||
          titleLine.includes('META') ||
          titleLine.includes('PROTEÇÃO') ||
          titleLine.includes('BLINDADO')
        ) {
          logType = 'success';
        }
        
        // Icons
        const iconMap = {
          success: 'fa-solid fa-circle-check',
          loss: 'fa-solid fa-circle-xmark',
          warning: 'fa-solid fa-triangle-exclamation',
          blue: 'fa-solid fa-circle-info',
          info: 'fa-solid fa-info-circle'
        };
        const icon = iconMap[logType] || iconMap.info;

        return { ...log, logType, icon, title: titleLine, details };
      });
    },
    formattedLogs() {
      // ✅ Limit to 200 logs for rendering to avoid lag
      return this.allFormattedLogs.slice(0, 200);
    }
  },
  methods: {
    getLogEmoji() {
      return '';
    },
    getLogColorClass(type) {
      const classes = {
        blue: 'text-cyan-400',
        success: 'text-green-400',
        loss: 'text-red-500',
        warning: 'text-yellow-400',
        info: 'text-[#FAFAFA]'
      };
      return classes[type] || classes.info;
    },
    getLogBgClass(type) {
      const classes = {
        blue: 'bg-cyan-400/10',
        success: 'bg-green-400/10',
        loss: 'bg-red-500/10',
        warning: 'bg-yellow-400/10',
        info: 'bg-gray-700/10'
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
    async fetchRealtimeLogs(limit = 200, returnDataOnly = false) {
      try {
        let userId = this.userId || localStorage.getItem('userId');
        if (!userId) return;
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
        // ✅ [PERFORMANCE] Limit configurable (default 500 for display, 2000 for export)
        const response = await fetch(`${apiBase}/autonomous-agent/logs/${userId}?limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            console.log(`[AutonomousAgentLogs] Logs recebidos (limit=${limit}):`, result.data.length);
            
            if (returnDataOnly) {
              return result.data;
            } else {
              this.realtimeLogs = result.data;
              this.$emit('update-logs', this.realtimeLogs);
            }
          }
        }
      } catch (e) { console.error('Log fetch error:', e); }
      return [];
    },
    async clearLogs() {
      if (await confirm('Tem certeza que deseja limpar todos os logs?')) {
        this.realtimeLogs = [];
        this.$emit('update-logs', []);
        console.log('[AutonomousAgentLogs] Logs limpos pelo usuário');
      }
    },
    async exportLogs() {
      try {
        // ✅ Buscar logs completos (limite alto) antes de exportar
        // Usar 50000 para garantir que pegamos tudo
        const fullLogs = await this.fetchRealtimeLogs(50000, true);
        
        if (!fullLogs || fullLogs.length === 0) {
          alert('Nenhum log para exportar.');
          return;
        }

        // Formatar logs para exportação (usando lógica similar ao computed mas no array completo)
        const formattedFullLogs = fullLogs.map(log => {
           // Reutilizar lógica de formatação simples aqui ou extrair método se fosse complexo
           // Para texto puro, a formatação visual (cores) não importa, apenas Title/Details
            const message = log.message || '';
            const lines = message.split('\n');
            const titleLine = lines[0].replace(/^\[.*?\]\s*/, '').trim().toUpperCase();
            const details = lines.length > 1 ? lines.slice(1).join('\n') : '';
            return { ...log, title: titleLine, details, timestamp: log.timestamp };
        });
        
        // Get data for filename
        const agenteName = this.agentName || 'AGENTE';
        const now = new Date();
        
        // Format YYYY-MM-DD
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const dateISO = `${yyyy}-${mm}-${dd}`;
        
        // Sanitize and format fields
        const safeAgentName = agenteName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const mode = 'auto'; 
        
        let safeSymbol = (this.market || 'market').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
        if (safeSymbol.includes('volatility100')) safeSymbol = '1hz100v';
        else if (safeSymbol.includes('volatility75')) safeSymbol = 'r75';
        else if (safeSymbol.includes('volatility10')) safeSymbol = 'r10';
        
        // Map risk profile
        let safeProfile = 'mod'; 
        const riskLower = (this.riskProfile || '').toLowerCase();
        if (riskLower.includes('conservador')) safeProfile = 'cons';
        else if (riskLower.includes('agressivo')) safeProfile = 'agr';
        else if (riskLower.includes('moderado')) safeProfile = 'mod';
        
        const safeEnvironment = this.accountType || 'test';
        
        // Construct filename
        const fileName = `zenix-${safeAgentName}-${mode}-${safeSymbol}-${safeProfile}-${safeEnvironment}-${dateISO}.txt`;

        // Create content
        const content = formattedFullLogs.map((log) => {
          const timestamp = this.formatTimestamp(log.timestamp);
          return `[${timestamp}] [${(log.logLevel || 'INFO').toUpperCase()}] ${log.title}\n${log.details || ''}`;
        }).join('\n\n----------------------------------------\n\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        
        URL.revokeObjectURL(link.href);

        console.log(`[AutonomousAgentLogs] Logs exportados: ${fileName} (${formattedFullLogs.length} registros)`);
      } catch (error) {
        console.error('[AutonomousAgentLogs] Erro ao exportar logs:', error);
        alert('Erro ao exportar logs.');
      }
    },
    stopLogPolling() {
      // Logic removed
    }
  }
};
</script>



