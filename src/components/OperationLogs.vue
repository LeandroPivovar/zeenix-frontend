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
      <div 
        v-for="(log, index) in logs" 
        :key="index" 
        :class="['log-entry', `log-${log.type}`]"
      >
        <span class="log-timestamp">{{ log.timestamp }}</span>
        <span class="log-message">{{ log.message }}</span>
      </div>
      
      <div v-if="logs.length === 0" class="empty-logs">
        <i class="fas fa-inbox"></i>
        <p>Nenhum log disponível</p>
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
      // Log de preparação para comprar contrato (apenas se status indicar)
      if (result.status === 'PURCHASE_PENDING' || result.status === 'BUYING' || result.status === 'EXECUTED') {
        this.addLog('info', `Preparando para comprar contrato`, logId);
      }
      
      // Log de contrato comprado (usar stakeAmount ou buyPrice)
      const buyPrice = result.buyPrice != null ? result.buyPrice : (result.stakeAmount != null ? result.stakeAmount : result.price);
      
      // Só adicionar log de compra se tiver um valor válido maior que zero
      if (buyPrice != null && buyPrice > 0) {
        const priceFormatted = typeof buyPrice === 'number' 
          ? buyPrice.toFixed(2) 
          : buyPrice;
        this.addLog('purchase', `Contrato comprado | $${priceFormatted} | Volatility 100 Index`, logId);
        
        // Log de condição de pagamento (apenas uma vez por contrato)
        const direction = result.direction || result.type;
        if (direction) {
          const condition = direction === 'CALL' || direction === 'Up'
            ? 'Ganhe o pagamento se o último dígito de Volatility 100 Index for par após 1 ticks.'
            : 'Ganhe o pagamento se o último dígito de Volatility 100 Index for um número ímpar após 1 ticks.';
          this.addLog('info', condition, `${logId}-condition`);
        }
      }
      
      // Log de resultado (ganho ou perda) - apenas se a operação estiver fechada
      if (result.status === 'CLOSED' || (result.profit != null && result.profitLoss != null)) {
        const profit = result.profit != null ? Number(result.profit) : (result.profitLoss != null ? Number(result.profitLoss) : null);
        
        // Só processar se tiver um valor de profit válido
        if (profit != null) {
          const exitTick = result.exitTick || result.sellPrice || result.closePrice;
          const exitTickFormatted = exitTick != null 
            ? (typeof exitTick === 'number' ? exitTick.toFixed(2) : exitTick)
            : 'N/A';
          
          if (profit > 0) {
            this.addLog('gain', `Ganho $${profit.toFixed(2)} | Volatility 100 Index | Tique de saída ${exitTickFormatted}`, `${logId}-result`);
          } else if (profit < 0) {
            this.addLog('loss', `Perda $${Math.abs(profit).toFixed(2)} | Volatility 100 Index | Tique de saída ${exitTickFormatted}`, `${logId}-result`);
          } else {
            this.addLog('info', `Operação finalizada | Volatility 100 Index | Tique de saída ${exitTickFormatted}`, `${logId}-result`);
          }
        }
      }
      
      // Log de status da estratégia
      if (result.strategyStatus) {
        this.addLog('strategy', result.strategyStatus, `${logId}-strategy`);
      }
    },
    
    addLog(type, message, id = null) {
      const timestamp = this.formatTime(new Date());
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
    
    clearLogs() {
      this.logs = [];
      this.processedIds.clear();
    },
    
    // Método público para adicionar logs manualmente
    addManualLog(type, message) {
      this.addLog(type, message);
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
  min-width: 80px;
  flex-shrink: 0;
}

.log-message {
  flex: 1;
  word-break: break-word;
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
</style>

