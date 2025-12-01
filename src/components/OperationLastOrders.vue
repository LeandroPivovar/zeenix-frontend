<template>
  <div class="operation-last-orders-container">
    <div class="orders-header">
      <h2 class="orders-title">Últimas Ordens</h2>
      <div class="orders-count" v-if="orders.length > 0">
        {{ orders.length }} {{ orders.length === 1 ? 'ordem' : 'ordens' }}
      </div>
    </div>
    
    <div class="orders-content">
      <div class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Lucro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="4" class="empty-orders">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma operação executada ainda.</p>
              </td>
            </tr>
            <tr 
              v-for="(order, index) in orders" 
              :key="`order-${index}`"
              class="order-row"
            >
              <td class="order-time">{{ order.time }}</td>
              <td class="order-type">
                <span :class="['order-type-badge', order.type === 'CALL' ? 'type-call' : 'type-put']">
                  {{ order.type }}
                </span>
              </td>
              <td class="order-value">{{ order.displayValue }}</td>
              <td class="order-profit" :class="{ 
                'profit-positive': order.profit != null && order.profit > 0,
                'profit-negative': order.profit != null && order.profit < 0,
                'profit-neutral': order.profit == null
              }">
                {{ order.displayProfit || '--' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationLastOrders',
  props: {
    lastOrders: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    orders() {
      return this.lastOrders || [];
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

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #1C1C1C;
  background: #0B0B0B;
}

.orders-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0;
}

.orders-count {
  font-size: 0.875rem;
  color: #7A7A7A;
  background: #1C1C1C;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
}

.orders-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.orders-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.orders-table thead {
  background: #0B0B0B;
  position: sticky;
  top: 0;
  z-index: 10;
}

.orders-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #A1A1A1;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #1C1C1C;
}

.orders-table th:nth-child(2) {
  text-align: center;
}

.orders-table th:nth-child(3),
.orders-table th:nth-child(4) {
  text-align: right;
}

.orders-table tbody tr {
  border-bottom: 1px solid rgba(28, 28, 28, 0.5);
  transition: background-color 0.2s;
}

.orders-table tbody tr:hover {
  background-color: rgba(28, 28, 28, 0.3);
}

.orders-table tbody tr:last-child {
  border-bottom: none;
}

.orders-table td {
  padding: 1rem;
  color: #DFDFDF;
}

.empty-orders {
  text-align: center;
  padding: 3rem 1rem !important;
  color: #7A7A7A;
}

.empty-orders i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  display: block;
}

.empty-orders p {
  margin: 0;
  font-size: 0.875rem;
}

.order-time {
  color: #A1A1A1;
  font-size: 0.875rem;
}

.order-type {
  text-align: center;
}

.order-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-type-badge.type-call {
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.order-type-badge.type-put {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.order-value {
  text-align: right;
  font-weight: 500;
  color: #DFDFDF;
}

.order-profit {
  text-align: right;
  font-weight: 600;
  font-size: 0.875rem;
}

.order-profit.profit-positive {
  color: #22C55E;
}

.order-profit.profit-negative {
  color: #FF4747;
}

.order-profit.profit-neutral {
  color: #7A7A7A;
}

/* Scrollbar styling */
.orders-content::-webkit-scrollbar {
  width: 8px;
}

.orders-content::-webkit-scrollbar-track {
  background: #0B0B0B;
}

.orders-content::-webkit-scrollbar-thumb {
  background: #1C1C1C;
  border-radius: 4px;
}

.orders-content::-webkit-scrollbar-thumb:hover {
  background: #2A2A2A;
}

/* Responsive */
@media (max-width: 768px) {
  .orders-header {
    padding: 1rem;
  }

  .orders-title {
    font-size: 1rem;
  }

  .orders-table th,
  .orders-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }

  .order-type-badge {
    font-size: 0.625rem;
    padding: 0.2rem 0.5rem;
  }
}
</style>

