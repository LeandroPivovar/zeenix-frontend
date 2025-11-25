<template>
  <transition name="modal-fade">
    <div v-if="visible" class="trade-result-modal-overlay" @click.self="handleClose">
      <div class="trade-result-modal" :class="{ 'is-profit': isProfit, 'is-loss': isLoss }">
        <div class="modal-glow"></div>
        
        <div class="modal-header">
          <div class="result-icon" :class="{ 'profit-icon': isProfit, 'loss-icon': isLoss }">
            <span v-if="isProfit">🎉</span>
            <span v-else-if="isLoss">📉</span>
            <span v-else>📊</span>
          </div>
          <h2 class="modal-title">{{ isProfit ? 'Operação Lucrativa!' : isLoss ? 'Operação Encerrada' : 'Operação Finalizada' }}</h2>
        </div>

        <div class="modal-body">
          <div class="result-amount" :class="{ 'profit-amount': isProfit, 'loss-amount': isLoss }">
            <div class="amount-label">Resultado da Operação</div>
            <div class="amount-value">
              <span class="amount-sign">{{ profit >= 0 ? '+' : '' }}</span>
              <span class="amount-currency">{{ currency }}</span>
              <span class="amount-number">{{ Math.abs(profit).toFixed(2) }}</span>
            </div>
          </div>

          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span class="detail-value">{{ type === 'CALL' ? 'Alta (CALL)' : 'Baixa (PUT)' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preço de Compra:</span>
              <span class="detail-value">{{ currency }} {{ buyPrice.toFixed(2) }}</span>
            </div>
            <div v-if="sellPrice !== null" class="detail-row">
              <span class="detail-label">Preço de Venda:</span>
              <span class="detail-value">{{ currency }} {{ sellPrice.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saldo Após Operação:</span>
              <span class="detail-value highlight">{{ currency }} {{ balanceAfter ? balanceAfter.toFixed(2) : '--' }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-close-modal" @click="handleClose">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TradeResultModal',
  props: {
    visible: { type: Boolean, default: false },
    profit: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    type: { type: String, default: 'CALL' },
    buyPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: null },
    balanceAfter: { type: Number, default: null },
  },
  computed: {
    isProfit() {
      return this.profit > 0;
    },
    isLoss() {
      return this.profit < 0;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // Tocar som quando o modal aparecer
        this.playResultSound();
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    playResultSound() {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (this.isProfit) {
          // Som de sucesso: notas ascendentes
          oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // Dó
          oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // Mi
          oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // Sol
        } else if (this.isLoss) {
          // Som de perda: nota descendente
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // Lá
          oscillator.frequency.setValueAtTime(349.23, this.audioContext.currentTime + 0.15); // Fá
        } else {
          // Som neutro
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4);
        
        oscillator.type = 'sine';
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
      } catch (error) {
        console.warn('Não foi possível reproduzir som:', error);
      }
    },
  },
  data() {
    return {
      audioContext: null,
    };
  },
};
</script>

<style scoped>
.trade-result-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.trade-result-modal {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  padding: 0;
  min-width: 480px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.trade-result-modal.is-profit {
  border: 2px solid rgba(16, 185, 129, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(16, 185, 129, 0.3),
              0 0 40px rgba(16, 185, 129, 0.2);
}

.trade-result-modal.is-loss {
  border: 2px solid rgba(239, 68, 68, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(239, 68, 68, 0.3),
              0 0 40px rgba(239, 68, 68, 0.2);
}

.modal-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.3), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.trade-result-modal.is-profit .modal-glow {
  background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.3), transparent 70%);
}

.trade-result-modal.is-loss .modal-glow {
  background: radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.3), transparent 70%);
}

.modal-header {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-icon {
  font-size: 64px;
  margin-bottom: 16px;
  display: inline-block;
  animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.profit-icon {
  animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
             iconPulse 2s ease-in-out infinite;
}

.loss-icon {
  animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #f8fafc;
  letter-spacing: -0.5px;
}

.modal-body {
  position: relative;
  z-index: 1;
  padding: 32px;
}

.result-amount {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profit-amount {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.loss-amount {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.amount-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.amount-value {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.profit-amount .amount-value {
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.loss-amount .amount-value {
  color: #ef4444;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.amount-sign {
  font-size: 36px;
}

.amount-currency {
  font-size: 32px;
  opacity: 0.9;
}

.amount-number {
  font-size: 48px;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.detail-value {
  font-size: 16px;
  color: #f8fafc;
  font-weight: 600;
}

.detail-value.highlight {
  color: #6366f1;
  font-weight: 700;
}

.modal-footer {
  position: relative;
  z-index: 1;
  padding: 24px 32px 32px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-close-modal {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.btn-close-modal:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-close-modal:active {
  transform: translateY(0);
}

/* Animações */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes iconBounce {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  60% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsivo */
@media (max-width: 640px) {
  .trade-result-modal {
    min-width: auto;
    margin: 20px;
  }

  .amount-value {
    font-size: 36px;
  }

  .amount-number {
    font-size: 36px;
  }

  .modal-title {
    font-size: 24px;
  }
}
</style>

