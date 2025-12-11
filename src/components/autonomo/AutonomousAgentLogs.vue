<template>
  <div class="operation-logs-container">
    <div class="logs-header">
      <h2 class="logs-title">Registro de Operações</h2>
      <div class="logs-header-actions">
        <span v-if="realtimeLogs.length > 0" class="text-xs text-zenix-green">{{ realtimeLogs.length }} eventos</span>
        <button 
          class="clear-logs-btn" 
          @click="exportLogs"
          :disabled="realtimeLogs.length === 0"
        >
          <i class="fas fa-download"></i> Exportar
        </button>
        <button 
          class="clear-logs-btn" 
          @click="clearLogs"
          :disabled="realtimeLogs.length === 0"
        >
          <i class="fas fa-trash"></i> Limpar
        </button>
      </div>
    </div>
    
    <div class="logs-content" ref="logsContainer">
      <div v-if="realtimeLogs.length === 0" class="empty-logs">
        <i class="fas fa-inbox"></i>
        <p>Nenhum evento registrado ainda.</p>
        <p class="text-xs mt-1">Os logs aparecerão aqui em tempo real quando o agente estiver ativo.</p>
      </div>
      
      <div v-else>
        <div 
          v-for="(log, index) in realtimeLogs" 
          :key="log.id || index" 
          :class="['log-entry', `log-${log.type}`]"
        >
          <span class="log-timestamp">[{{ log.timestamp }}]</span>
          <span class="log-level">[{{ log.level || log.type?.toUpperCase() || 'INFO' }}]</span>
          <span class="log-module">[{{ log.module || 'CORE' }}]</span>
          <span class="log-separator">-</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutonomousAgentLogs',
  props: {
    userId: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
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
      if (newVal) {
        this.startLogPolling();
      } else {
        this.stopLogPolling();
      }
    }
  },
  mounted() {
    if (this.isActive) {
      this.startLogPolling();
    }
  },
  beforeUnmount() {
    this.stopLogPolling();
  },
  methods: {
    async fetchRealtimeLogs() {
      try {
        if (!this.userId) {
          console.warn('[AutonomousAgentLogs] ⚠️ UserId não disponível');
          return;
        }
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const url = `${apiBase}/autonomous-agent/logs/${this.userId}?limit=2000`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          console.warn('[AutonomousAgentLogs] ⚠️ Erro ao buscar logs:', response.status);
          return;
        }
        
        const result = await response.json();
        if (result.success && result.data && Array.isArray(result.data)) {
          const newLogs = result.data.map(log => ({
            id: log.id,
            timestamp: log.timestamp,
            created_at: log.created_at,
            type: log.type,
            icon: log.icon,
            level: log.level || log.log_level,
            module: log.module,
            message: log.message
          }));
          
          if (this.realtimeLogs.length === 0 || !this.lastLogTimestamp) {
            this.realtimeLogs = newLogs;
            if (this.realtimeLogs.length > 0) {
              this.lastLogTimestamp = this.realtimeLogs[0].created_at || this.realtimeLogs[0].timestamp;
            }
            
            this.$nextTick(() => {
              if (this.$refs.logsContainer) {
                this.$refs.logsContainer.scrollTop = 0;
              }
            });
          } else {
            const existingIds = new Set(this.realtimeLogs.map(log => log.id || log.created_at || log.timestamp));
            const logsToAdd = newLogs.filter(log => {
              const logId = log.id || log.created_at || log.timestamp;
              return !existingIds.has(logId);
            });
            
            if (logsToAdd.length > 0) {
              const container = this.$refs.logsContainer;
              const isAtTop = container && container.scrollTop <= 50;
              
              this.realtimeLogs = [...logsToAdd, ...this.realtimeLogs];
              this.lastLogTimestamp = this.realtimeLogs[0].created_at || this.realtimeLogs[0].timestamp;
              
              this.$nextTick(() => {
                if (container && isAtTop) {
                  container.scrollTop = 0;
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('[AutonomousAgentLogs] ❌ Erro ao buscar logs:', error);
      }
    },
    
    startLogPolling() {
      this.stopLogPolling();
      
      this.logPollingInterval = setInterval(() => {
        if (this.isActive) {
          this.fetchRealtimeLogs();
        } else {
          this.stopLogPolling();
        }
      }, 2000);
      
      this.fetchRealtimeLogs();
    },
    
    stopLogPolling() {
      if (this.logPollingInterval) {
        clearInterval(this.logPollingInterval);
        this.logPollingInterval = null;
      }
    },
    
    exportLogs() {
      if (this.realtimeLogs.length === 0) return;
      
      const text = this.realtimeLogs.map(log => {
        return `[${log.timestamp}] ${log.icon} ${log.message}`;
      }).join('\n');
      
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agente-autonomo-logs-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    clearLogs() {
      this.realtimeLogs = [];
      this.lastLogTimestamp = null;
    }
  }
};
</script>

<style scoped>
.operation-logs-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 0.75rem;
  overflow: hidden;
}

.logs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
}

.logs-title {
  font-size: 1rem;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0;
}

.logs-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-logs-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #1C1C1C;
  border: 1px solid #2C2C2C;
  border-radius: 0.5rem;
  color: #A1A1A1;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-logs-btn:hover:not(:disabled) {
  background-color: #2C2C2C;
  color: #DFDFDF;
  border-color: #3C3C3C;
}

.clear-logs-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.logs-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  background-color: #0B0B0B;
}

.logs-content::-webkit-scrollbar {
  width: 8px;
}

.logs-content::-webkit-scrollbar-track {
  background: #0B0B0B;
}

.logs-content::-webkit-scrollbar-thumb {
  background: #2C2C2C;
  border-radius: 4px;
}

.logs-content::-webkit-scrollbar-thumb:hover {
  background: #3C3C3C;
}

.log-entry {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(28, 28, 28, 0.5);
  word-wrap: break-word;
  animation: fadeIn 0.3s ease;
  text-align: left;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.log-timestamp {
  color: #7A7A7A;
  font-weight: 500;
  min-width: 100px;
  flex-shrink: 0;
}

.log-level {
  color: #9CA3AF;
  font-weight: 600;
  min-width: 60px;
  flex-shrink: 0;
  font-size: 0.8rem;
}

.log-module {
  color: #6B7280;
  font-weight: 500;
  min-width: 80px;
  flex-shrink: 0;
  font-size: 0.8rem;
}

.log-separator {
  color: #4B5563;
  margin: 0 0.5rem;
  flex-shrink: 0;
}

.log-message {
  flex: 1;
  word-break: break-word;
}

/* Tipos de log */
.log-info {
  color: #DFDFDF;
}

.log-analise {
  color: #A78BFA;
}

.log-sinal {
  color: #FCD34D;
}

.log-operacao {
  color: #60A5FA;
}

.log-resultado {
  color: #22C55E;
}

.log-alerta {
  color: #FB923C;
}

.log-erro {
  color: #FF4747;
}

.empty-logs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #7A7A7A;
  text-align: center;
}

.empty-logs i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-logs p {
  font-size: 0.875rem;
  margin: 0.25rem 0;
}
</style>

