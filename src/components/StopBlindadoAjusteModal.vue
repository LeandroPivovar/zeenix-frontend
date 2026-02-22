<template>
  <transition name="modal-fade">
    <div v-if="visible" class="stop-blindado-modal-overlay" @click.self="handleClose">
      <div class="stop-blindado-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#22C55E" stroke-width="3"/>
              <path d="M32 16L32 32L40 40" stroke="#22C55E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 20L28 28" stroke="#22C55E" stroke-width="2" stroke-linecap="round"/>
              <path d="M36 20L44 28" stroke="#22C55E" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <h2 class="modal-title">STOP LOSS BLINDADO</h2>
        
        <p class="modal-message">
          A sua próxima entrada violaria o stop loss blindado, para preservar o seu capital o sistema encerrou antes para preservar o lucro.
        </p>
        
        <div class="result-section" v-if="result !== null && result !== undefined">
          <p class="result-label">RESULTADO DA SESSÃO</p>
          <p class="result-value profit-value">{{ formattedResult }}</p>
        </div>
        
        <p class="info-message">
          O Stop Loss Blindado garante que você mantenha uma parte dos seus lucros, mesmo em cenários de reversão de mercado.
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
  name: 'StopBlindadoAjusteModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    result: {
      type: Number,
      default: 0
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
      const sign = this.result >= 0 ? '+' : '';
      return `${sign}$${Math.abs(this.result).toFixed(2)}`;
    }
  },
  methods: {
    handleClose() {
      // Não permitir fechar clicando fora
    },
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
.stop-blindado-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.stop-blindado-modal {
  background: #0B0B0B;
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(34, 197, 94, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1);
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
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #22C55E;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  width: 100%;
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

.info-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.6;
  font-style: italic;
}

.confirm-button {
  width: 100%;
  background: #1C1C1C;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button:hover {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.5);
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

@media (max-width: 768px) {
  .stop-blindado-modal {
    padding: 32px 24px;
    max-width: 100%;
    margin: 20px;
  }
  
  .modal-title {
    font-size: 20px;
  }
}
</style>
