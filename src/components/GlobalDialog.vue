<template>
  <transition name="modal-fade">
    <div v-if="state.visible" class="confirm-modal-overlay" @click.self="handleOverlayClick">
      <div class="confirm-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <i class="fas fa-exclamation-triangle text-zenix-primary text-4xl" v-if="state.type === 'confirm'"></i>
            <i class="fas fa-info-circle text-zenix-primary text-4xl" v-else></i>
          </div>
        </div>
        
        <h2 class="modal-title">{{ state.title }}</h2>
        
        <p class="modal-message" v-html="formattedMessage"></p>
        
        <div class="modal-actions">
           <button 
            v-if="state.type === 'confirm'" 
            class="cancel-button" 
            type="button" 
            @click="handleCancel"
          >
            {{ state.cancelText }}
          </button>
          
          <button class="confirm-button" type="button" @click="handleConfirm">
            {{ state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import DialogService from '../services/DialogService';

export default {
  name: 'GlobalDialog',
  setup() {
    return {
      state: DialogService.state
    }
  },
  computed: {
    formattedMessage() {
      if (!this.state.message) return '';
      // Convert newlines to <br> for simple formatting compatibility with alert()
      return this.state.message.replace(/\n/g, '<br>');
    }
  },
  methods: {
    handleConfirm() {
      DialogService.close(true);
    },
    handleCancel() {
      DialogService.close(false);
    },
    handleOverlayClick() {
      // If it's an alert, clicking overlay can close it (returning true/undefined)
      // If it's a confirm, usually we want explicit action, but let's allow cancel on overlay for UX
      if (this.state.type === 'confirm') {
        this.handleCancel();
      } else {
        this.handleConfirm();
      }
    }
  }
}
</script>

<style scoped>
.confirm-modal-overlay {
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

.confirm-modal {
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
  border: 3px solid #FFD058;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon i {
  color: #FFD058;
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
  color: #FFD058;
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
  white-space: pre-wrap; /* Keeps formatting if we don't use the computed property, but we are */
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-button {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid #22C55E;
  border-radius: 12px;
  padding: 16px 24px;
  font-family: 'Outfit', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #22C55E;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.confirm-button:hover {
  background: #22C55E;
  color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.cancel-button {
  background: transparent;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 16px 24px;
  font-family: 'Outfit', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #777777;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.cancel-button:hover {
  border-color: #555555;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.05);
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

.modal-fade-enter-active .confirm-modal,
.modal-fade-leave-active .confirm-modal {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-enter-from .confirm-modal,
.modal-fade-leave-to .confirm-modal {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
