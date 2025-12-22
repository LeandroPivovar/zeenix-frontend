<template>
  <div class="operation-last-orders-container">
    <div class="orders-content">
      <div v-if="!tradeResults || tradeResults.length === 0" class="empty-state">
        <i class="fas fa-info-circle"></i>
        <p class="empty-message">Nenhuma operação realizada ainda</p>
        <p class="empty-submessage">Suas operações aparecerão aqui após serem executadas</p>
      </div>
      
      <div v-else class="orders-table-container">
        <div class="orders-header desktop-orders-header">
          <h3 class="orders-title">
            <i class="fas fa-history mr-2" style="color: #22C55E;"></i>Últimas Ordens
          </h3>
          <span class="orders-count">{{ tradeResults.length }} {{ tradeResults.length === 1 ? 'operação' : 'operações' }}</span>
        </div>
        
        <!-- Mobile Cards -->
        <div class="mobile-history-cards">
          <div v-for="(order, index) in tradeResults" :key="index" class="mobile-history-card">
            <div class="mobile-history-card-header">
              <span class="mobile-history-time">{{ formatTime(order.time) }}</span>
              <span :class="['mobile-history-badge', (order.direction === 'CALL' || order.type === 'CALL') ? 'badge-call' : 'badge-put']">
                {{ (order.direction || order.type || 'N/A').toUpperCase() }}
              </span>
              <span class="mobile-history-volume">Vol {{ formatPrice(order.buyPrice || order.price || 0) }}</span>
            </div>
            <div class="mobile-history-details">
              <div class="mobile-history-detail-column">
                <span class="detail-label">Entrada</span>
                <span class="detail-value">${{ order.entryPrice ? formatPrice(order.entryPrice) : '-' }}</span>
              </div>
              <div class="mobile-history-detail-column">
                <span class="detail-label">Saída</span>
                <span class="detail-value">${{ order.exitPrice ? formatPrice(order.exitPrice) : '-' }}</span>
              </div>
              <div class="mobile-history-detail-column">
                <span class="detail-label">Resultado</span>
                <span v-if="order.profit !== null && order.profit !== undefined" :class="['detail-value', order.profit >= 0 ? 'result-positive' : 'result-negative']">
                  {{ order.profit >= 0 ? '+' : '' }}${{ formatPrice(order.profit) }}
                </span>
                <span v-else class="detail-value">-</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Desktop Table -->
        <div class="table-wrapper desktop-orders-table">
          <table class="orders-table">
            <thead>
              <tr>
                <th style="text-align: left;">Horário</th>
                <th style="text-align: left;">Mercado</th>
                <th style="text-align: center;">Tipo</th>
                <th style="text-align: right;">Preço Entrada</th>
                <th style="text-align: right;">Preço Saída</th>
                <th style="text-align: right;">Valor Entrada</th>
                <th style="text-align: right;">P&L</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(order, index) in tradeResults"
                :key="index"
                class="order-row"
              >
                <td class="order-time" style="text-align: left;">{{ order.time || 'N/A' }}</td>
                <td class="order-market" style="text-align: left;">{{ order.market || 'N/A' }}</td>
                <td style="text-align: center;">
                  <span class="order-type" :class="order.direction === 'CALL' || order.type === 'CALL' ? 'call' : 'put'">
                    {{ order.direction || order.type || 'N/A' }}
                  </span>
                </td>
                <td class="order-value" style="text-align: right;">
                  <span v-if="order.entryPrice">${{ formatPrice(order.entryPrice) }}</span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="order-value" style="text-align: right;">
                  <span v-if="order.exitPrice">${{ formatPrice(order.exitPrice) }}</span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="order-value" style="text-align: right;">${{ formatPrice(order.buyPrice || order.price) }}</td>
                <td style="text-align: right;">
                  <span v-if="order.profit !== null && order.profit !== undefined" class="order-profit" :class="order.profit >= 0 ? 'profit' : 'loss'">
                    {{ order.profit >= 0 ? '+' : '' }}${{ formatPrice(order.profit) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td style="text-align: center;">
                  <span v-if="order.status" class="order-status" :class="getStatusClass(order.status)">
                    {{ getStatusDisplay(order.status) }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationLastOrders',
  props: {
    tradeResults: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatPrice(value) {
      if (value === null || value === undefined || value === '') {
        return '0.00';
      }
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      if (isNaN(numValue)) {
        return '0.00';
      }
      return numValue.toFixed(2);
    },
    formatTime(timeString) {
      if (!timeString) return 'N/A';
      // Se já estiver no formato HH:MM:SS, retornar direto
      if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return timeString;
      }
      // Se for uma data completa, extrair apenas a hora
      if (typeof timeString === 'string' && timeString.includes(' ')) {
        const timePart = timeString.split(' ')[1];
        if (timePart) {
          return timePart.substring(0, 8); // HH:MM:SS
        }
      }
      // Tentar converter timestamp ou data
      try {
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        }
      } catch (e) {
        // Ignorar erro
      }
      return timeString;
    },
    getStatusDisplay(status) {
      if (!status) return 'PENDING';
      const statusLower = status.toLowerCase();
      if (statusLower === 'expired') return 'CLOSED';
      return status.toUpperCase();
    },
    getStatusClass(status) {
      if (!status) return 'pending';
      const statusLower = status.toLowerCase();
      if (statusLower === 'won' || statusLower === 'closed' || statusLower === 'expired') return 'won closed';
      if (statusLower === 'lost') return 'lost';
      return 'pending';
    }
  }
};
</script>

<style scoped>
.operation-last-orders-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0E0E0E;
  border-radius: 0.75rem;
  overflow: hidden;
}

.orders-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.empty-state i {
  font-size: 3.5rem;
  color: #22C55E;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-message {
  font-size: 1.125rem;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0 0 0.5rem 0;
}

.empty-submessage {
  font-size: 0.875rem;
  color: #7A7A7A;
  margin: 0;
  line-height: 1.5;
}

.orders-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.orders-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  display: flex;
  align-items: center;
}

.orders-title i {
  color: #22C55E;
}

.orders-count {
  font-size: 0.875rem;
  color: #7A7A7A;
  font-weight: 500;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.orders-table thead {
  position: sticky;
  top: 0;
  background: #0E0E0E;
  z-index: 10;
}

.orders-table th {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #7A7A7A;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.orders-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #DFDFDF;
}

.order-row {
  transition: background-color 0.2s;
}

.order-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.order-time {
  font-size: 0.875rem;
  color: #7A7A7A;
  font-weight: 500;
  white-space: nowrap;
}

.order-market {
  font-size: 0.875rem;
  color: #DFDFDF;
  font-weight: 500;
  white-space: nowrap;
}

.order-type {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.order-type.call {
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.order-type.put {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.order-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #DFDFDF;
}

.order-profit {
  font-size: 0.875rem;
  font-weight: 600;
}

.order-profit.profit {
  color: #22C55E;
}

.order-profit.loss {
  color: #ef4444;
}

.text-muted {
  color: #7A7A7A;
  font-style: italic;
}

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.order-status.won,
.order-status.closed {
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
}

.order-status.lost {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.order-status.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

/* Mobile Cards - Histórico */
@media (max-width: 768px) {
  .operation-last-orders-container {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden;
    box-sizing: border-box;
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
  }

  .orders-content {
    padding: 0 1rem 6rem !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
    background: transparent !important;
  }

  .empty-state {
    padding: 1rem !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box;
  }

  .empty-state i {
    font-size: 2.5rem;
  }

  .empty-message {
    font-size: 1rem;
  }

  .empty-submessage {
    font-size: 0.8125rem;
  }

  .desktop-orders-header {
    display: none !important;
  }

  .desktop-orders-table {
    display: none !important;
  }

  .mobile-history-cards {
    display: flex !important;
    flex-direction: column !important;
    gap: 15px !important;
    max-height: 60vh !important;
    overflow-y: auto !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .mobile-history-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    border: 1px solid #1C1C1C !important;
    border-radius: 0.75rem !important;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25) !important;
    padding: 15px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .mobile-history-card-header {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    margin-bottom: 12px !important;
    padding-bottom: 12px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }

  .mobile-history-time {
    font-size: 14px !important;
    color: #f0f0f0 !important;
    font-weight: 500 !important;
  }

  .mobile-history-badge {
    padding: 4px 10px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
  }

  .badge-call {
    background: #22C55E !important;
    color: #000 !important;
  }

  .badge-put {
    background: #ff4444 !important;
    color: #fff !important;
  }

  .mobile-history-volume {
    font-size: 12px !important;
    color: #a09e9e !important;
    margin-left: auto !important;
  }

  .mobile-history-details {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr !important;
    gap: 10px !important;
  }

  .mobile-history-detail-column {
    display: flex !important;
    flex-direction: column !important;
    gap: 4px !important;
  }

  .detail-label {
    font-size: 12px !important;
    color: #a09e9e !important;
    text-align: left !important;
  }

  .detail-value {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: #f0f0f0 !important;
    text-align: left !important;
  }

  .detail-value.result-positive {
    color: #22C55E !important;
  }

  .detail-value.result-negative {
    color: #ff4444 !important;
  }

  * {
    box-sizing: border-box;
  }
}

/* Desktop: Hide mobile elements */
@media (min-width: 769px) {
  .mobile-history-cards {
    display: none !important;
  }

  .desktop-orders-header {
    display: flex !important;
  }

  .desktop-orders-table {
    display: block !important;
  }
}
</style>

