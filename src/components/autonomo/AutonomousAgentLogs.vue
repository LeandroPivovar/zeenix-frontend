<template>
  <div class="operation-logs-container">
    <div class="logs-header">
      <div class="logs-title-section">
        <h2 class="logs-title">Ações do Agente</h2>
        <p class="logs-subtitle">Registro de atividades em tempo real</p>
      </div>
    </div>
    
    <div class="logs-content" ref="logsContainer">
      <div v-if="realtimeLogs.length === 0" class="empty-logs">
        <i class="fas fa-inbox"></i>
        <p>Nenhum evento registrado ainda.</p>
        <p class="text-xs mt-1">Os logs aparecerão aqui em tempo real quando o agente estiver ativo.</p>
      </div>
      
      <div v-else class="logs-list">
        <div 
          v-for="(log, index) in formattedLogs" 
          :key="log.id || index" 
          class="log-card"
        >
          <div :class="['log-icon-container', `log-icon-${log.logType}`]">
            <i :class="log.icon"></i>
          </div>
          <div class="log-content">
            <p class="log-title">{{ log.title }}</p>
            <p class="log-details">{{ log.details }}</p>
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
    userId: {
      type: String,
      required: false,
      default: null
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
    },
    userId(newVal) {
      // Quando userId mudar, reiniciar polling se estiver ativo
      if (newVal && this.isActive) {
        this.stopLogPolling();
        this.startLogPolling();
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
  computed: {
    formattedLogs() {
      // Limitar a 50 logs mais recentes para performance
      const limitedLogs = this.realtimeLogs.slice(0, 50);
      return limitedLogs.map(log => {
        // Determinar tipo de log e ícone baseado na mensagem e módulo
        let logType = 'info';
        let icon = 'fa-solid fa-info-circle';
        let title = log.message;
        let details = '';
        
        // Extrair informações da mensagem
        const message = log.message || '';
        const module = log.module || '';
        const level = log.level || '';
        
        // Detectar operação finalizada com sucesso
        if (message.includes('WON') || message.includes('profit') || message.includes('ganho') || 
            (module === 'TRADER' && level !== 'ERROR' && message.includes('closed'))) {
          logType = 'success';
          icon = 'fa-solid fa-check';
          title = 'Operação finalizada com sucesso';
          
          // Tentar extrair informações da mensagem
          const profitMatch = message.match(/[+-]?\$?[\d,]+\.?\d*/);
          const volMatch = message.match(/Vol\s*(\d+)/i) || message.match(/R_(\d+)/);
          const timeMatch = this.formatTimestamp(log.timestamp);
          
          if (profitMatch && volMatch) {
            details = `${timeMatch} • Vol ${volMatch[1]} • ${profitMatch[0]}`;
          } else if (profitMatch) {
            details = `${timeMatch} • ${profitMatch[0]}`;
          } else {
            details = timeMatch || '--';
          }
        }
        // Detectar entrada executada
        else if (message.includes('Buy') || message.includes('Proposal') || message.includes('entrada') || 
                 (module === 'TRADER' && message.includes('opened'))) {
          logType = 'purchase';
          icon = 'fa-solid fa-arrow-right';
          title = 'Entrada executada';
          
          const volMatch = message.match(/Vol\s*(\d+)/i) || message.match(/R_(\d+)/);
          const priceMatch = message.match(/\$?[\d,]+\.?\d*/);
          const timeMatch = this.formatTimestamp(log.timestamp);
          
          if (volMatch && priceMatch) {
            details = `${timeMatch} • Vol ${volMatch[1]} • ${priceMatch[0]}`;
          } else if (volMatch) {
            details = `${timeMatch} • Vol ${volMatch[1]}`;
          } else {
            details = timeMatch || '--';
          }
        }
        // Detectar análise/volume
        else if (message.includes('Volume') || message.includes('volume') || message.includes('detectado') ||
                 module === 'ANALYZER' || module === 'RISK') {
          logType = 'analysis';
          icon = 'fa-solid fa-chart-line';
          title = 'Volume detectado';
          
          const timeMatch = this.formatTimestamp(log.timestamp);
          details = `${timeMatch} • Análise de mercado`;
        }
        // Detectar perda
        else if (message.includes('LOST') || message.includes('loss') || message.includes('perda') ||
                 (module === 'TRADER' && level === 'ERROR')) {
          logType = 'loss';
          icon = 'fa-solid fa-xmark';
          title = 'Operação finalizada com perda';
          
          const lossMatch = message.match(/[-$]?[\d,]+\.?\d*/);
          const volMatch = message.match(/Vol\s*(\d+)/i) || message.match(/R_(\d+)/);
          const timeMatch = this.formatTimestamp(log.timestamp);
          
          if (lossMatch && volMatch) {
            details = `${timeMatch} • Vol ${volMatch[1]} • ${lossMatch[0]}`;
          } else if (lossMatch) {
            details = `${timeMatch} • ${lossMatch[0]}`;
          } else {
            details = timeMatch || '--';
          }
        }
        // Detectar aguardando
        else if (message.includes('waiting') || message.includes('aguardando') || message.includes('monitoring') ||
                 message.includes('Monitoramento')) {
          logType = 'waiting';
          icon = 'fa-solid fa-clock';
          title = 'Aguardando padrão da estratégia';
          
          const timeMatch = this.formatTimestamp(log.timestamp);
          details = `${timeMatch} • Monitoramento ativo`;
        }
        // Padrão genérico
        else {
          logType = 'info';
          icon = 'fa-solid fa-info-circle';
          title = message.length > 50 ? message.substring(0, 50) + '...' : message;
          const timeMatch = this.formatTimestamp(log.timestamp);
          details = timeMatch || '--';
        }
        
        return {
          ...log,
          logType,
          icon,
          title,
          details
        };
      });
    }
  },
  methods: {
    // Função auxiliar para formatar timestamp de forma segura
    formatTimestamp(timestamp) {
      if (!timestamp) return '--';
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '--';
        return date.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
      } catch (error) {
        return '--';
      }
    },
    async fetchRealtimeLogs() {
      try {
        // Tentar obter userId da prop ou do localStorage
        let userId = this.userId;
        if (!userId) {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              userId = user.id || user.userId;
            } catch (error) {
              console.error('[AutonomousAgentLogs] Erro ao parsear user:', error);
            }
          }
        }
        
        // Tentar obter do token JWT se ainda não tiver
        if (!userId) {
          try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (token) {
              // Decodificar JWT (base64)
              const payload = JSON.parse(atob(token.split('.')[1]));
              userId = payload.userId || payload.id || payload.sub;
            }
          } catch (error) {
            console.error('[AutonomousAgentLogs] Erro ao decodificar token:', error);
          }
        }
        
        if (!userId) {
          console.warn('[AutonomousAgentLogs] ⚠️ UserId não disponível', {
            propUserId: this.userId,
            hasUserInLocalStorage: !!localStorage.getItem("user"),
            hasToken: !!(localStorage.getItem('token') || localStorage.getItem('authToken'))
          });
          return;
        }
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const url = `${apiBase}/autonomous-agent/logs/${userId}`;
        
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
  background-color: transparent;
  border: none;
  border-radius: 0;
  overflow: visible;
}

.logs-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0;
}

.logs-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logs-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
}

.logs-subtitle {
  font-size: 0.75rem;
  color: #A1A1A1;
  margin: 0;
}

.logs-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background-color: transparent;
  max-height: 500px;
  min-height: 200px;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 0.75rem;
  animation: fadeIn 0.3s ease;
  text-align: left;
  justify-content: flex-start;
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

.log-icon-container {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 0;
}

.log-icon-container i {
  font-size: 0.75rem;
}

.log-icon-success {
  background-color: #22C55E;
  color: #FFFFFF;
}

.log-icon-purchase {
  background-color: #FACC15;
  color: #FFFFFF;
}

.log-icon-analysis {
  background-color: #1C1C1C;
  color: #3B82F6;
}

.log-icon-waiting {
  background-color: #1C1C1C;
  color: #9CA3AF;
}

.log-icon-loss {
  background-color: #FF4747;
  color: #FFFFFF;
}

.log-icon-info {
  background-color: rgba(156, 163, 175, 0.2);
  color: #9CA3AF;
}

.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: left;
  align-items: flex-start;
}

.log-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.4;
  text-align: left;
  width: 100%;
}

.log-details {
  font-size: 0.625rem;
  color: #A1A1A1;
  margin: 0;
  line-height: 1.4;
  text-align: left;
  width: 100%;
}

.logs-content::-webkit-scrollbar {
  width: 8px;
}

.logs-content::-webkit-scrollbar-track {
  background: transparent;
}

.logs-content::-webkit-scrollbar-thumb {
  background: #2C2C2C;
  border-radius: 4px;
}

.logs-content::-webkit-scrollbar-thumb:hover {
  background: #3C3C3C;
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

