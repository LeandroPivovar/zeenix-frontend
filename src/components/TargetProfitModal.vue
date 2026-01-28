<template>
  <transition name="modal-fade">
    <div v-if="visible" class="target-profit-modal-overlay" @click.self="handleClose">
      <div class="target-profit-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#22C55E" stroke-width="3"/>
              <!-- Troféu -->
              <path d="M24 20H40V28C40 30.5 38.5 32.5 36 34L34 36H30L28 34C25.5 32.5 24 30.5 24 28V20Z" fill="#22C55E"/>
              <path d="M28 36H36V40H28V36Z" fill="#22C55E"/>
              <path d="M30 40H34V44H30V40Z" fill="#22C55E"/>
              <path d="M26 44H38V48H26V44Z" fill="#22C55E"/>
            </svg>
          </div>
        </div>
        
        <h2 class="modal-title">META ATINGIDA</h2>
        
        <p class="modal-message">
          Parabéns! Você atingiu seu alvo de lucro diário com sucesso.
        </p>
        
        <div class="result-section" v-if="result !== null && result !== undefined">
          <p class="result-label">RESULTADO DA SESSÃO</p>
          <p class="result-value profit-value">{{ formattedResult }}</p>
        </div>
        
        <p class="info-message">
          "Disciplina é o que transforma ganhos pontuais em consistência."
        </p>
        
        <button class="confirm-button" type="button" @click="handleConfirm">
          Confirmar e Encerrar Ciclo
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TargetProfitModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    result: {
      type: Number,
      default: 0
    },
    finalProfit: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  emits: ['confirm'],
  computed: {
    formattedResult() {
      if (this.result === null || this.result === undefined) return '$0.00';
      const sign = this.result >= 0 ? '+' : '-';
      return `${sign}$${Math.abs(this.result).toFixed(2)}`;
    }
  },
  methods: {
    handleClose() {
      // Não permitir fechar clicando fora
    },
    handleConfirm() {
      this.$emit('confirm');
      // Apenas emite; o pai decide navegação/fechamento
    }
  }
}
</script>

<style scoped>
.target-profit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000000;
  padding: 20px;
}

.target-profit-modal {
  background: #0B0B0B;
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(34, 197, 94, 0.2);
  box-shadow: 0 20px 60px rgba(34, 197, 94, 0.1);
}

.modal-icon-container {
  margin-bottom: 24px;
}

.modal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #22C55E;
  background: rgba(34, 197, 94, 0.1);
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #22C55E;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.modal-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.result-section {
  margin: 24px 0;
  padding: 16px;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.result-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-value {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.profit-value {
  color: #22C55E;
}

.loss-value {
  color: #FF5252;
}

.info-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.6;
  font-style: italic;
}

.confirm-button {
  width: 100%;
  background: #22C55E;
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button:hover {
  background: #16A34A;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.confirm-button:active {
  transform: scale(0.98);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .target-profit-modal {
    padding: 32px 24px;
    max-width: 100%;
    margin: 20px;
  }
  
  .modal-title {
    font-size: 20px;
  }
}
</style>

