<template>
  <transition name="modal-fade">
    <div v-if="visible" class="cycle-completion-modal-overlay" @click.self="handleClose">
      <div class="cycle-completion-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#22C55E" stroke-width="3"/>
              <!-- Ícone de Ciclo / Recarrega -->
              <path d="M32 16V22M32 42V48M48 32H42M22 32H16" stroke="#22C55E" stroke-width="3" stroke-linecap="round"/>
              <path d="M43.3137 20.6863L39.0711 24.9289M24.9289 39.0711L20.6863 43.3137M43.3137 43.3137L39.0711 39.0711M24.9289 24.9289L20.6863 20.6863" stroke="#22C55E" stroke-width="3" stroke-linecap="round"/>
              <circle cx="32" cy="32" r="8" fill="#22C55E" fill-opacity="0.2" stroke="#22C55E" stroke-width="2"/>
            </svg>
          </div>
        </div>

        <div class="modal-content">
          <h2 class="modal-title">CICLO {{ cycleNumber }} CONCLUÍDO!</h2>
          <p class="modal-description">
            O robô finalizou com sucesso mais uma etapa da estratégia. 
            O lucro foi consolidado e o próximo ciclo será iniciado.
          </p>
          
          <div class="result-badge">
            <span class="label">LUCRO NO CICLO</span>
            <span class="value">+{{ currencySymbol }}{{ result.toFixed(2) }}</span>
          </div>

          <button class="confirm-button" @click="handleConfirm">
            CONTINUAR OPERAÇÕES
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CycleCompletionModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cycleNumber: {
      type: [Number, String],
      default: 1
    },
    result: {
      type: Number,
      default: 0
    },
    currencySymbol: {
      type: String,
      default: '$'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
.cycle-completion-modal-overlay {
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

.cycle-completion-modal {
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
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
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

.modal-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.result-badge {
  margin: 24px 0;
  padding: 16px;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-badge .label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.result-badge .value {
  color: #22C55E;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.5px;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.confirm-button:hover {
  background: #16A34A;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  transform: translateY(-2px);
}

.confirm-button:active {
  transform: scale(0.98);
}

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .cycle-completion-modal {
  animation: modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-pop {
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .cycle-completion-modal {
    padding: 32px 24px;
    max-width: 100%;
    margin: 20px;
  }
  
  .modal-title {
    font-size: 20px;
  }
}
</style>
