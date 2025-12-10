<template>
  <div class="operation-last-orders-container">
    <div class="orders-content">
      <div v-if="!tradeResults || tradeResults.length === 0" class="empty-state">
        <i class="fas fa-info-circle"></i>
        <p class="empty-message">Nenhuma operação realizada ainda</p>
        <p class="empty-submessage">Suas operações aparecerão aqui após serem executadas</p>
      </div>
      
      <div v-else class="orders-table-container">
        <div class="orders-header">
          <h3 class="orders-title">
            <i class="fas fa-history mr-2" style="color: #22C55E;"></i>Últimas Ordens
          </h3>
          <span class="orders-count">{{ tradeResults.length }} {{ tradeResults.length === 1 ? 'operação' : 'operações' }}</span>
        </div>
        
        <div class="table-wrapper">
          <table class="orders-table">
            <thead>
              <tr>
                <th style="text-align: left;">Horário</th>
                <th style="text-align: left;">Mercado</th>
                <th style="text-align: center;">Tipo</th>
                <th style="text-align: right;">Valor Entrada</th>
                <th style="text-align: right;">Preço Entrada</th>
                <th style="text-align: right;">Preço Saída</th>
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
                <td class="order-value" style="text-align: right;">${{ formatPrice(order.buyPrice || order.price) }}</td>
                <td class="order-value" style="text-align: right;">
                  <span v-if="order.entryPrice">${{ formatPrice(order.entryPrice) }}</span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="order-value" style="text-align: right;">
                  <span v-if="order.exitPrice">${{ formatPrice(order.exitPrice) }}</span>
                  <span v-else class="text-muted">-</span>
                </td>
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

/* Responsive */
@media (max-width: 768px) {
  .orders-content {
    padding: 1rem;
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
}
</style>

