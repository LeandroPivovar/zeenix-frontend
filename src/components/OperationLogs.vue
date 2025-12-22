<template>
  <div class="operation-logs-container">
    <div class="logs-header">
      <h2 class="logs-title">Registro de Operações</h2>
      <button 
        class="clear-logs-btn" 
        @click="clearLogs"
        :disabled="logs.length === 0"
      >
        <i class="fas fa-trash"></i>
        Limpar
      </button>
    </div>
    
    <div class="logs-content" ref="logsContainer">
      <div v-if="logs.length === 0" class="empty-logs">
        <i class="fas fa-inbox"></i>
        <p>Nenhum log disponível</p>
      </div>
      
      <!-- Desktop Logs -->
      <div class="desktop-logs-list">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          :class="['log-entry', `log-${log.type}`]"
        >
          <span class="log-timestamp">{{ log.timestamp }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      
      <!-- Mobile Logs Cards -->
      <div class="mobile-logs-list">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          class="log-card"
        >
          <div :class="['log-icon-container', `log-icon-${getLogIconType(log.type)}`]">
            <i :class="getLogIcon(log.type)"></i>
          </div>
          <div class="log-content">
            <p class="log-title">{{ getLogTitle(log.message) }}</p>
            <p class="log-details">{{ getLogDetails(log.message, log.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationLogs',
  props: {
    tradeResults: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      logs: [],
      processedIds: new Set() // Rastrear IDs já processados para evitar duplicatas
    };
  },
  watch: {
    tradeResults: {
      handler(newResults, oldResults) {
        if (!newResults || newResults.length === 0) {
          return;
        }
        
        // Se é a primeira vez (oldResults é undefined ou vazio), limpar e processar todos
        if (!oldResults || oldResults.length === 0) {
          // Limpar logs e IDs processados quando receber novos dados pela primeira vez
          this.logs = [];
          this.processedIds.clear();
          this.processTradeResults(newResults);
        } else {
          // Processar apenas novos resultados (comparar por ID)
          const oldIds = new Set(oldResults.map(r => r.contractId || r.id).filter(Boolean));
          const newItems = newResults.filter(r => {
            const id = r.contractId || r.id;
            return id && !oldIds.has(id);
          });
          
          if (newItems.length > 0) {
            this.processTradeResults(newItems);
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    
    processTradeResults(results) {
      // Processar apenas novos resultados que ainda não foram logados
      results.forEach((result, index) => {
        // Usar contractId, id, ou criar um ID único baseado no timestamp e dados
        const logId = result.contractId 
          || result.id 
          || `${result.time || Date.now()}-${result.type || 'UNKNOWN'}-${index}`;
        
        // Verificar se já foi processado usando o Set de IDs processados
        if (this.processedIds.has(logId)) {
          return; // Já foi processado
        }
        
        // Marcar como processado
        this.processedIds.add(logId);
        this.addLogFromTradeResult(result, logId);
      });
    },
    
    addLogFromTradeResult(result, logId) {
      // Obter timestamp real do registro (prioridade: createdAt, closedAt, time, ou agora)
      let recordTimestamp = null;
      if (result.createdAt) {
        // Se for string, converter para Date; se já for Date, usar diretamente
        recordTimestamp = result.createdAt instanceof Date ? result.createdAt : new Date(result.createdAt);
      } else if (result.closedAt) {
        recordTimestamp = result.closedAt instanceof Date ? result.closedAt : new Date(result.closedAt);
      } else if (result.time) {
        // Se time for um timestamp em segundos, converter para milissegundos
        const timestamp = typeof result.time === 'number' ? result.time : parseInt(result.time);
        recordTimestamp = new Date(timestamp * 1000);
      }
      
      // Validar se a data é válida
      if (recordTimestamp && isNaN(recordTimestamp.getTime())) {
        recordTimestamp = null;
      }
      
      // Log de preparação para comprar contrato (apenas se status indicar)
      if (result.status === 'PURCHASE_PENDING' || result.status === 'BUYING' || result.status === 'EXECUTED') {
        this.addLog('info', `Preparando para comprar contrato`, logId, recordTimestamp);
      }
      
      // Log de contrato comprado (usar stakeAmount ou buyPrice)
      const buyPrice = result.buyPrice != null ? result.buyPrice : (result.stakeAmount != null ? result.stakeAmount : result.price);
      
      // Só adicionar log de compra se tiver um valor válido maior que zero
      if (buyPrice != null && buyPrice > 0) {
        const priceFormatted = typeof buyPrice === 'number' 
          ? buyPrice.toFixed(2) 
          : buyPrice;
        this.addLog('purchase', `Contrato comprado | $${priceFormatted} | Volatility 100 Index`, logId, recordTimestamp);
        
        // Log de condição de pagamento (apenas uma vez por contrato) - usar mesmo timestamp
        const direction = result.direction || result.type;
        if (direction) {
          const condition = direction === 'CALL' || direction === 'Up'
            ? 'Ganhe o pagamento se o último dígito de Volatility 100 Index for par após 1 ticks.'
            : 'Ganhe o pagamento se o último dígito de Volatility 100 Index for um número ímpar após 1 ticks.';
          this.addLog('info', condition, `${logId}-condition`, recordTimestamp);
        }
      }
      
      // Log de resultado (ganho ou perda) - apenas se a operação estiver fechada
      // Para resultado, usar closedAt se disponível, senão usar createdAt
      let resultTimestamp = recordTimestamp;
      if (result.closedAt) {
        resultTimestamp = new Date(result.closedAt);
      } else if (result.createdAt && !resultTimestamp) {
        resultTimestamp = new Date(result.createdAt);
      }
      
      if (result.status === 'CLOSED' || (result.profit != null && result.profitLoss != null)) {
        const profit = result.profit != null ? Number(result.profit) : (result.profitLoss != null ? Number(result.profitLoss) : null);
        
        // Só processar se tiver um valor de profit válido
        if (profit != null) {
          const exitTick = result.exitTick || result.sellPrice || result.closePrice;
          const exitTickFormatted = exitTick != null 
            ? (typeof exitTick === 'number' ? exitTick.toFixed(2) : exitTick)
            : 'N/A';
          
          if (profit > 0) {
            this.addLog('gain', `Ganho $${profit.toFixed(2)} | Volatility 100 Index | Tique de saída ${exitTickFormatted}`, `${logId}-result`, resultTimestamp);
          } else if (profit < 0) {
            this.addLog('loss', `Perda $${Math.abs(profit).toFixed(2)} | Volatility 100 Index | Tique de saída ${exitTickFormatted}`, `${logId}-result`, resultTimestamp);
          } else {
            this.addLog('info', `Operação finalizada | Volatility 100 Index | Tique de saída ${exitTickFormatted}`, `${logId}-result`, resultTimestamp);
          }
        }
      }
      
      // Log de status da estratégia
      if (result.strategyStatus) {
        this.addLog('strategy', result.strategyStatus, `${logId}-strategy`, recordTimestamp);
      }
    },
    
    addLog(type, message, id = null, recordDate = null) {
      // Usar a data do registro se fornecida, senão usar a data atual
      const dateToUse = recordDate || new Date();
      const timestamp = this.formatDateTime(dateToUse);
      const logEntry = {
        id: id || `log-${Date.now()}-${Math.random()}`,
        timestamp,
        type,
        message
      };
      
      this.logs.unshift(logEntry); // Adiciona no início
      
      // Limitar a 100 logs para performance
      if (this.logs.length > 100) {
        this.logs = this.logs.slice(0, 100);
      }
      
      // Auto-scroll para o topo (último log)
      this.$nextTick(() => {
        if (this.$refs.logsContainer) {
          this.$refs.logsContainer.scrollTop = 0;
        }
      });
    },
    
    formatDateTime(date) {
      // Formatar como DD/MM/YYYY HH:MM:SS
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    },
    
    clearLogs() {
      this.logs = [];
      this.processedIds.clear();
    },
    
    // Método público para adicionar logs manualmente
    addManualLog(type, message) {
      this.addLog(type, message);
    },
    
    getLogIconType(type) {
      const iconMap = {
        'gain': 'success',
        'loss': 'loss',
        'purchase': 'purchase',
        'info': 'info',
        'strategy': 'analysis'
      };
      return iconMap[type] || 'info';
    },
    
    getLogIcon(type) {
      const iconMap = {
        'gain': 'fas fa-check-circle',
        'loss': 'fas fa-times-circle',
        'purchase': 'fas fa-shopping-cart',
        'info': 'fas fa-info-circle',
        'strategy': 'fas fa-chart-line'
      };
      return iconMap[type] || 'fas fa-info-circle';
    },
    
    getLogTitle(message) {
      // Extrair título principal da mensagem
      if (message.includes('|')) {
        return message.split('|')[0].trim();
      }
      if (message.includes('Ganho') || message.includes('Perda')) {
        return message.split('|')[0] || message.split(' ').slice(0, 2).join(' ');
      }
      return message.length > 50 ? message.substring(0, 50) + '...' : message;
    },
    
    getLogDetails(message, timestamp) {
      // Extrair detalhes da mensagem
      if (message.includes('|')) {
        const parts = message.split('|');
        if (parts.length > 1) {
          return parts.slice(1).join(' | ').trim();
        }
      }
      // Se não tiver separador, retornar timestamp ou mensagem completa se for curta
      if (message.length <= 50) {
        return timestamp || '';
      }
      return message.substring(50);
    }
  },
  mounted() {
    // Exemplo de logs iniciais (pode ser removido)
    // this.addLog('strategy', 'Tempo executando a estratégia 00:00:21');
    // this.addLog('strategy', 'A negociação parará após esta negociação terminar');
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
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(28, 28, 28, 0.5);
  word-wrap: break-word;
  animation: fadeIn 0.3s ease;
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
  min-width: 160px;
  flex-shrink: 0;
  text-align: left;
}

.log-message {
  flex: 1;
  word-break: break-word;
  text-align: left;
}

/* Tipos de log */
.log-gain {
  color: #22C55E;
}

.log-loss {
  color: #FF4747;
}

.log-purchase {
  color: #DFDFDF;
}

.log-info {
  color: #DFDFDF;
}

.log-strategy {
  color: #60A5FA;
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
  margin: 0;
}

/* Mobile Logs Cards - Estilo do Agente Autônomo */
@media (max-width: 768px) {
  .operation-logs-container {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden;
    box-sizing: border-box;
    border-radius: 0 !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 1rem 6rem !important;
    background: transparent !important;
  }

  .logs-header {
    padding: 0 !important;
    margin-bottom: 1rem !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
    background: transparent !important;
    border: none !important;
  }

  .logs-title {
    font-size: 1.125rem !important;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    margin: 0 0 0.25rem 0 !important;
  }

  .clear-logs-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    box-sizing: border-box;
  }

  .logs-content {
    padding: 0 !important;
    font-size: 0.8125rem;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
    margin: 0 !important;
    background: transparent !important;
    max-height: 500px !important;
    min-height: 200px !important;
  }

  .desktop-logs-list {
    display: none !important;
  }

  .mobile-logs-list {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
  }

  .log-card {
    display: flex !important;
    align-items: flex-start !important;
    gap: 0.75rem !important;
    padding: 0.75rem !important;
    background-color: #0E0E0E !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.75rem !important;
    animation: fadeIn 0.3s ease !important;
    text-align: left !important;
    justify-content: flex-start !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .log-icon-container {
    width: 1.5rem !important;
    height: 1.5rem !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    margin-right: 0 !important;
  }

  .log-icon-container i {
    font-size: 0.75rem !important;
  }

  .log-icon-success {
    background-color: #22C55E !important;
    color: #FFFFFF !important;
  }

  .log-icon-purchase {
    background-color: #FACC15 !important;
    color: #FFFFFF !important;
  }

  .log-icon-analysis {
    background-color: #1C1C1C !important;
    color: #3B82F6 !important;
  }

  .log-icon-waiting {
    background-color: #1C1C1C !important;
    color: #9CA3AF !important;
  }

  .log-icon-loss {
    background-color: #FF4747 !important;
    color: #FFFFFF !important;
  }

  .log-icon-info {
    background-color: rgba(156, 163, 175, 0.2) !important;
    color: #9CA3AF !important;
  }

  .log-content {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0.125rem !important;
    text-align: left !important;
    align-items: flex-start !important;
  }

  .log-title {
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    line-height: 1.4 !important;
    text-align: left !important;
    width: 100% !important;
  }

  .log-details {
    font-size: 0.625rem !important;
    color: #A1A1A1 !important;
    margin: 0 !important;
    line-height: 1.4 !important;
    text-align: left !important;
    width: 100% !important;
  }

  .empty-logs {
    padding: 3rem 1rem !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }

  .empty-logs i {
    font-size: 3rem !important;
    margin-bottom: 1rem !important;
    opacity: 0.5 !important;
  }

  .empty-logs p {
    font-size: 0.875rem !important;
    margin: 0.25rem 0 !important;
  }

  * {
    box-sizing: border-box;
  }
}

/* Desktop: Hide mobile elements */
@media (min-width: 769px) {
  .mobile-logs-list {
    display: none !important;
  }

  .desktop-logs-list {
    display: block !important;
  }
}
</style>

