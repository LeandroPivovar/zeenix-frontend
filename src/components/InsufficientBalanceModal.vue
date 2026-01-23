<template>
  <transition name="modal-fade">
    <div v-if="visible" class="insufficient-balance-modal-overlay" @click.self="handleClose">
      <div class="insufficient-balance-modal">
        <div class="modal-icon-container">
          <div class="modal-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#FF5252" stroke-width="3"/>
              <path d="M32 20V36M32 40H32.01" stroke="#FF5252" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <h2 class="modal-title">SALDO INSUFICIENTE</h2>
        
        <p class="modal-message">
          Seu saldo atual é insuficiente para iniciar as operações com segurança. É necessário ter saldo para pelo menos 3 entradas de <span class="highlight">{{ formattedEntryValue }}</span>.
        </p>
        
        <div class="result-section">
          <div class="balance-item">
            <p class="balance-label">SALDO ATUAL</p>
            <p class="balance-value current-value">{{ formattedBalance }}</p>
          </div>
          <div class="balance-divider"></div>
          <div class="balance-item">
            <p class="balance-label">MÍNIMO NECESSÁRIO</p>
            <p class="balance-value required-value">{{ formattedRequired }}</p>
          </div>
        </div>
        
        <p class="info-message">
          Por favor, ajuste o valor da sua entrada ou faça um depósito para continuar operando com nossas ferramentas de IA.
        </p>
        
        <button class="confirm-button" type="button" @click="handleConfirm">
          Entendido
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'InsufficientBalanceModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentBalance: {
      type: Number,
      default: 0
    },
    entryValue: {
      type: Number,
      default: 0.35
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  computed: {
    requiredBalance() {
      return this.entryValue * 3;
    },
    formattedBalance() {
      const prefix = this.currency === 'DEMO' ? 'D$' : '$';
      return `${prefix}${this.currentBalance.toFixed(2)}`;
    },
    formattedEntryValue() {
      const prefix = this.currency === 'DEMO' ? 'D$' : '$';
      return `${prefix}${this.entryValue.toFixed(2)}`;
    },
    formattedRequired() {
      const prefix = this.currency === 'DEMO' ? 'D$' : '$';
      return `${prefix}${this.requiredBalance.toFixed(2)}`;
    }
  },
  methods: {
    handleClose() {
      // Permitir fechar? O usuário disse "use os de stop loss como exemplo"
      // StopLossModal não permite fechar clicando fora.
    },
    handleConfirm() {
      this.$emit('confirm');
    }
  }
}
</script>

<style scoped>
.insufficient-balance-modal-overlay {
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

.insufficient-balance-modal {
  background: #0B0B0B;
  border-radius: 24px;
  padding: 40px 32px;
  max-width: 420px;
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
  margin: 0 0 32px 0;
  line-height: 1.5;
  text-align: center;
}

.highlight {
  color: #FF5252;
  font-weight: 600;
}

.result-section {
  margin: 24px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.balance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.balance-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  width: 100%;
}

.balance-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.balance-value {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.current-value {
  color: #A1A1A1;
}

.required-value {
  color: #FFD058;
}

.info-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  line-height: 1.6;
  text-align: center;
}

.confirm-button {
  width: 100%;
  background: #1C1C1C;
  border: 1px solid rgba(255, 82, 82, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button:hover {
  background: rgba(255, 82, 82, 0.1);
  border-color: rgba(255, 82, 82, 0.5);
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
