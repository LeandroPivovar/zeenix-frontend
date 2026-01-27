<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="visible" class="minimum-stake-modal-overlay" @click.self="handleClose">
        <div class="minimum-stake-modal">
          <div class="modal-icon-container">
            <div class="modal-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" stroke="#FFD058" stroke-width="3"/>
                <path d="M32 20V36M32 40H32.01" stroke="#FFD058" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          
          <h2 class="modal-title">VALOR MÍNIMO</h2>
          
          <p class="modal-message">
            O valor de entrada informado é inferior ao limite permitido.
          </p>
          
          <div class="info-box">
            <p class="info-label">VALOR MÍNIMO EXIGIDO</p>
            <p class="info-value">$0.35</p>
          </div>
          
          <p class="description-message">
            O valor mínimo de entrada aceito pela corretora Deriv é <span class="highlight">$0.35</span>. Por favor, ajuste o valor da sua entrada para continuar.
          </p>
          
          <button class="confirm-button" type="button" @click="handleConfirm">
            Entendido
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'MinimumStakeModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      // O usuário geralmente clica no botão "Entendido"
    },
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
.minimum-stake-modal-overlay {
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

.minimum-stake-modal {
  background: #0B0B0B;
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 208, 88, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 208, 88, 0.1);
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
  border: 3px solid #FFD058;
  background: rgba(255, 208, 88, 0.1);
}

.modal-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #FFD058;
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
  background: rgba(255, 208, 88, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 208, 88, 0.1);
}

.info-label {
  font-size: 11px;
  color: rgba(255, 208, 88, 0.7);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 32px;
  font-weight: 700;
  color: #FFD058;
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

.highlight {
  color: #FFD058;
  font-weight: 600;
}

.confirm-button {
  width: 100%;
  background: #1C1C1C;
  border: 1px solid rgba(255, 208, 88, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button:hover {
  background: rgba(255, 208, 88, 0.1);
  border-color: rgba(255, 208, 88, 0.5);
}

.confirm-button:active {
  transform: scale(0.98);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
