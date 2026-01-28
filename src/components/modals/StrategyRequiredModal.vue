<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="strategy-required-modal-overlay" @click.self="handleClose">
        <div class="strategy-required-modal">
          <div class="modal-icon-container">
            <div class="modal-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60Z" stroke="#22C55E" stroke-width="3"/>
                <path d="M32 18V34" stroke="#22C55E" stroke-width="3" stroke-linecap="round"/>
                <path d="M32 42V42.5" stroke="#22C55E" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          
          <h2 class="modal-title">SELECIONE UMA IA</h2>
          
          <p class="modal-message">
            Nenhuma Inteligência Artificial foi selecionada.
          </p>
          
          <div class="info-box">
            <p class="info-label">AÇÃO NECESSÁRIA</p>
            <p class="info-value">Escolher Estratégia</p>
          </div>
          
          <p class="description-message">
            Para iniciar as operações, você precisa selecionar uma das estratégias disponíveis (Orion, Atlas, Nexus, etc.).
          </p>
          
          <button class="confirm-button" type="button" @click.stop="handleConfirm">
            Selecionar Agora
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'StrategyRequiredModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
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
.strategy-required-modal-overlay {
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

.strategy-required-modal {
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
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #22C55E;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-message {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 24px 0;
  line-height: 1.5;
  text-align: center;
}

.info-box {
  margin: 24px 0;
  padding: 20px;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.1);
}

.info-label {
  font-size: 11px;
  color: rgba(34, 197, 94, 0.7);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 24px;
  font-weight: 700;
  color: #22C55E;
  margin: 0;
  letter-spacing: 0.5px;
}

.description-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.6;
  text-align: center;
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
</style>
