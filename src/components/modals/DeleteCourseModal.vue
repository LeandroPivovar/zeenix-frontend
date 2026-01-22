<template>
  <transition name="modal-fade">
    <div v-if="visible" class="delete-confirm-modal-overlay" @click.self="handleCancel">
      <div class="delete-confirm-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#FF5252" stroke-width="3"/>
              <path d="M20 24h24M40 24v24a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4V24m6 0V20a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v4M28 32v10M36 32v10" stroke="#FF5252" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <h2 class="modal-title">EXCLUIR CURSO?</h2>
        
        <p class="modal-message">
          Você está prestes a excluir o curso <span class="highlight">{{ courseName }}</span>. 
          Esta ação é <strong>irreversível</strong> e todos os módulos, aulas e materiais 
          associados serão permanentemente excluídos.
        </p>
        
        <div class="warning-section">
          <div class="warning-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="warning-text">
            Esta ação não pode ser desfeita. Certifique-se de que deseja prosseguir.
          </p>
        </div>
        
        <div class="button-group">
          <button class="cancel-button" type="button" @click="handleCancel">
            Cancelar
          </button>
          <button class="confirm-button" type="button" @click="handleConfirm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Excluir Curso
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DeleteCourseModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    courseName: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleCancel() {
      this.$emit('cancel');
    },
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
.delete-confirm-modal-overlay {
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

.delete-confirm-modal {
  background: #0B0B0B;
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 1px solid rgba(255, 82, 82, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 82, 82, 0.1);
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
  border: 3px solid #FF5252;
  background: rgba(255, 82, 82, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(255, 82, 82, 0);
  }
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #FF5252;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.highlight {
  color: #00ff7f;
  font-weight: 600;
}

.warning-section {
  margin: 24px 0;
  padding: 16px;
  background: rgba(255, 82, 82, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 82, 82, 0.2);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}

.warning-icon {
  flex-shrink: 0;
  color: #FF5252;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.warning-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.cancel-button,
.confirm-button {
  flex: 1;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cancel-button {
  background: #1C1C1C;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.confirm-button {
  background: linear-gradient(135deg, #FF5252 0%, #DC2626 100%);
  color: #FFFFFF;
  border: 1px solid rgba(255, 82, 82, 0.3);
}

.confirm-button:hover {
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
  box-shadow: 0 4px 12px rgba(255, 82, 82, 0.4);
  transform: translateY(-2px);
}

.cancel-button:active,
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

.modal-fade-enter-active .delete-confirm-modal,
.modal-fade-leave-active .delete-confirm-modal {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .delete-confirm-modal {
  transform: scale(0.9);
}

.modal-fade-leave-to .delete-confirm-modal {
  transform: scale(0.9);
}

/* Responsividade */
@media (max-width: 480px) {
  .delete-confirm-modal {
    padding: 32px 24px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .modal-message {
    font-size: 13px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .cancel-button,
  .confirm-button {
    width: 100%;
  }
}
</style>
