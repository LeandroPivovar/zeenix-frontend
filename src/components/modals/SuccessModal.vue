<template>
  <transition name="modal-fade">
    <div v-if="visible" class="success-modal-overlay" @click.self="handleConfirm">
      <div class="success-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <i class="fas fa-check text-zenix-primary text-4xl"></i>
          </div>
        </div>
        
        <h2 class="modal-title">{{ title }}</h2>
        
        <p class="modal-message" v-html="message"></p>
        
        <div class="modal-actions">
          <button class="confirm-button" type="button" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SuccessModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Sucesso'
    },
    message: {
      type: String,
      default: 'Operação realizada com sucesso!'
    },
    confirmText: {
      type: String,
      default: 'OK'
    }
  },
  emits: ['confirm'],
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
.success-modal-overlay {
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
  backdrop-filter: blur(4px);
}

.success-modal {
  background: #0B0B0B;
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.modal-icon-container {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #22C55E;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon i {
  color: #22C55E;
}

.modal-title {
  font-family: 'Outfit', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #22C55E;
  margin: 0 0 16px 0;
}

.modal-message {
  font-family: 'Outfit', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #C5C5C5;
  margin: 0 0 32px 0;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.confirm-button {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid #22C55E;
  border-radius: 12px;
  padding: 16px 48px;
  font-family: 'Outfit', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #22C55E;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.confirm-button:hover {
  background: #22C55E;
  color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .success-modal,
.modal-fade-leave-active .success-modal {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .success-modal,
.modal-fade-leave-to .success-modal {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
