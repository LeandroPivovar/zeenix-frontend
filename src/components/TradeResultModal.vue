<template>
  <transition name="modal-fade">
    <div v-if="visible" class="trade-result-modal-overlay" @click.self="handleClose">
      <!-- MOBILE REDESIGN (NEW) -->
      <div v-if="isMobile" class="trade-result-modal mobile-redesign" :class="{ 'is-profit': isProfit, 'is-loss': isLoss }">
        <div class="modal-glow"></div>
        
        <div class="modal-body-container">
          <!-- Top Row: Operation Label -->
          <div class="operation-label">Resultado da Operação</div>

          <!-- Icon Header -->
          <div class="modal-header">
            <div class="result-icon-outer" :class="{ 'profit-outer': isProfit, 'loss-outer': isLoss }">
              <div class="result-icon">
                <i v-if="isProfit" class="fas fa-chart-line"></i>
                <i v-else-if="isLoss" class="fas fa-chart-line"></i>
                <i v-else class="fas fa-chart-bar"></i>
              </div>
            </div>
          </div>

          <!-- Status and Amount -->
          <div class="result-summary">
            <div class="status-badge" :class="{ 'profit-status': isProfit, 'loss-status': isLoss }">
              {{ isProfit ? 'VITÓRIA' : isLoss ? 'DERROTA' : 'FINALIZADO' }}
            </div>
            <div class="amount-value" :class="{ 'profit-amount': isProfit, 'loss-amount': isLoss }">
              <span class="amount-prefix">{{ currencySymbol }}</span>
              <span class="amount-number">{{ Math.abs(profit).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="result-details-grid">
            <div class="detail-box">
              <div class="box-label">TIPO</div>
              <div class="box-value">{{ type.replace('_', '') }}</div>
            </div>
            <div class="detail-box">
              <div class="box-label">ENTRADA</div>
              <div class="box-value">{{ currencySymbol }} {{ buyPrice.toFixed(2) }}</div>
            </div>
            <div class="detail-box">
              <div class="box-label">SAÍDA</div>
              <div class="box-value">{{ sellPrice !== null ? currencySymbol + ' ' + sellPrice.toFixed(2) : '--' }}</div>
            </div>
            <div class="detail-box">
              <div class="box-label">STATUS</div>
              <div class="box-value" :class="{ 'profit-text': isProfit, 'loss-text': isLoss }">
                {{ isProfit ? 'Win' : isLoss ? 'Loss' : 'Neutral' }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-confirm-action" :class="{ 'profit-btn': isProfit, 'loss-btn': isLoss }" @click="handleClose">
            ENTENDIDO
          </button>
        </div>
      </div>

      <!-- DESKTOP LAYOUT (OLD) -->
      <div v-else class="trade-result-modal desktop-layout" :class="{ 'is-profit': isProfit, 'is-loss': isLoss }">
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
          <div class="result-amount" :class="{ 'profit-amount-box': isProfit, 'loss-amount-box': isLoss }">
            <div class="amount-label">Resultado da Operação</div>
            <div class="amount-value">
              <span class="amount-sign">{{ profit >= 0 ? '+' : '' }}</span>
              <span class="amount-currency">{{ currencySymbol }}</span>
              <span class="amount-number">{{ Math.abs(profit).toFixed(2) }}</span>
            </div>
          </div>

          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Tipo:</span>
              <span class="detail-value">{{ type.replace('_', '') }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Preço de Compra:</span>
              <span class="detail-value">{{ currencySymbol }} {{ buyPrice.toFixed(2) }}</span>
            </div>
            <div v-if="sellPrice !== null" class="detail-row">
              <span class="detail-label">Preço de Venda:</span>
              <span class="detail-value">{{ currencySymbol }} {{ sellPrice.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Saldo Após Operação:</span>
              <span class="detail-value highlight">{{ currencySymbol }} {{ balanceAfter ? balanceAfter.toFixed(2) : '--' }}</span>
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
    type: { type: String, default: 'DIGITMATCH (5)' },
    buyPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: null },
    balanceAfter: { type: Number, default: null },
  },
  data() {
    return {
      audioContext: null,
      isMobile: false,
    };
  },
  computed: {
    isProfit() {
      return this.profit > 0;
    },
    isLoss() {
      return this.profit < 0;
    },
    currencySymbol() {
      return this.currency === 'BRL' ? 'R$' : '$';
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.playResultSound();
      }
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
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
          oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2);
        } else if (this.isLoss) {
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
          oscillator.frequency.setValueAtTime(349.23, this.audioContext.currentTime + 0.15);
        } else {
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
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');

.trade-result-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  font-family: 'Outfit', sans-serif;
}

.trade-result-modal {
  position: relative;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* =========================================
   NEW MOBILE REDESIGN STYLES
   ========================================= */
.mobile-redesign {
  background: #0d0d0d;
  border-radius: 20px;
  max-width: 480px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-redesign .modal-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.mobile-redesign.is-profit .modal-glow {
  background: radial-gradient(circle at 50% 30%, rgba(34, 197, 94, 0.08), transparent 70%);
}

.mobile-redesign.is-loss .modal-glow {
  background: radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.08), transparent 70%);
}

.mobile-redesign .modal-body-container {
  position: relative;
  z-index: 1;
  padding: 32px 24px;
}

.mobile-redesign .operation-label {
  text-align: left;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: -0.02em;
}

.mobile-redesign .modal-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding: 0;
  border: none;
}

.mobile-redesign .result-icon-outer {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.mobile-redesign .profit-outer {
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid #22c55e;
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.2);
}

.mobile-redesign .loss-outer {
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
}

.mobile-redesign .result-icon {
  font-size: 36px;
}

.mobile-redesign .profit-outer .result-icon { color: #22c55e; }
.mobile-redesign .loss-outer .result-icon { color: #ef4444; }

.mobile-redesign .result-summary {
  text-align: center;
  margin-bottom: 32px;
}

.mobile-redesign .status-badge {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.mobile-redesign .profit-status { color: #22c55e; }
.mobile-redesign .loss-status { color: #ef4444; }

.mobile-redesign .amount-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  line-height: 1;
}

.mobile-redesign .amount-prefix {
  font-size: 24px;
  font-weight: 700;
  opacity: 0.9;
}

.mobile-redesign .amount-number {
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.mobile-redesign .profit-amount { color: #22c55e; }
.mobile-redesign .loss-amount { color: #f87171; }

.mobile-redesign .result-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.mobile-redesign .detail-box {
  background: #0d0d0d;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-redesign .box-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
}

.mobile-redesign .box-value {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.mobile-redesign .profit-text { color: #22c55e; }
.mobile-redesign .loss-text { color: #ef4444; }

.mobile-redesign .modal-footer {
  padding: 0;
  border-top: none;
}

.mobile-redesign .btn-confirm-action {
  width: 100%;
  padding: 24px;
  border: none;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.05em;
}

.mobile-redesign .profit-btn { background: #22c55e; }
.mobile-redesign .loss-btn { background: #f87171; }

/* =========================================
   OLD DESKTOP LAYOUT STYLES
   ========================================= */
.desktop-layout {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  min-width: 480px;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.desktop-layout.is-profit {
  border: 2px solid rgba(16, 185, 129, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2);
}

.desktop-layout.is-loss {
  border: 2px solid rgba(239, 68, 68, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.2);
}

.desktop-layout .modal-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.3), transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.desktop-layout.is-profit .modal-glow {
  background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.3), transparent 70%);
}

.desktop-layout.is-loss .modal-glow {
  background: radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.3), transparent 70%);
}

.desktop-layout .modal-header {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: block;
}

.desktop-layout .result-icon {
  font-size: 64px;
  margin-bottom: 16px;
  display: inline-block;
  animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.desktop-layout .profit-icon {
  animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), iconPulse 2s ease-in-out infinite;
}

.desktop-layout .modal-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #f8fafc;
  letter-spacing: -0.5px;
}

.desktop-layout .modal-body {
  position: relative;
  z-index: 1;
  padding: 32px;
}

.desktop-layout .result-amount {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.desktop-layout .profit-amount-box {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.desktop-layout .loss-amount-box {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.desktop-layout .amount-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.desktop-layout .amount-value {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.desktop-layout.is-profit .amount-value {
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.desktop-layout.is-loss .amount-value {
  color: #ef4444;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.desktop-layout .amount-sign { font-size: 36px; }
.desktop-layout .amount-currency { font-size: 32px; opacity: 0.9; }
.desktop-layout .amount-number { font-size: 48px; }

.desktop-layout .result-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.desktop-layout .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.desktop-layout .detail-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.desktop-layout .detail-value {
  font-size: 16px;
  color: #f8fafc;
  font-weight: 600;
}

.desktop-layout .detail-value.highlight {
  color: #6366f1;
  font-weight: 700;
}

.desktop-layout .modal-footer {
  position: relative;
  z-index: 1;
  padding: 24px 32px 32px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.desktop-layout .btn-close-modal {
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

.desktop-layout .btn-close-modal:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

/* Common Animations */
@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes iconBounce {
  0% { opacity: 0; transform: scale(0) rotate(-180deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
