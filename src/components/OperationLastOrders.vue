<template>
  <div class="operation-last-orders-container">
    <div class="orders-content">
      <div class="empty-state">
        <i class="fas fa-info-circle"></i>
        <p class="empty-message">Histórico de operações em desenvolvimento</p>
        <p class="empty-submessage">Em breve você poderá visualizar suas últimas operações aqui</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationLastOrders'
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
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.empty-state {
  text-align: center;
  max-width: 400px;
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

/* Responsive */
@media (max-width: 768px) {
  .orders-content {
    padding: 2rem 1rem;
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

