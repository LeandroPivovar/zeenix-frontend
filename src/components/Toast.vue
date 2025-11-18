<template>
  <transition-group name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
    >
      <div class="toast-icon">
        <span v-if="toast.type === 'success'">✓</span>
        <span v-else-if="toast.type === 'error'">✕</span>
        <span v-else-if="toast.type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-content">
        <div class="toast-message" v-html="toast.message"></div>
      </div>
      <button class="toast-close" @click="removeToast(toast.id)">×</button>
    </div>
  </transition-group>
</template>

<script>
export default {
  name: 'ToastNotification',
  data() {
    return {
      toasts: [],
      nextId: 0,
    };
  },
  methods: {
    show(message, type = 'info', duration = 5000) {
      const id = this.nextId++;
      const toast = {
        id,
        message,
        type,
        duration,
      };

      this.toasts.push(toast);

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }

      return id;
    },
    success(message, duration = 5000) {
      return this.show(message, 'success', duration);
    },
    error(message, duration = 7000) {
      return this.show(message, 'error', duration);
    },
    warning(message, duration = 5000) {
      return this.show(message, 'warning', duration);
    },
    info(message, duration = 5000) {
      return this.show(message, 'info', duration);
    },
    removeToast(id) {
      const index = this.toasts.findIndex(t => t.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },
  },
  mounted() {
    // Tornar o componente acessível globalmente
    this.$root.$toast = this;
  },
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #1f1f1f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  animation: slideInRight 0.3s ease-out;
  min-width: 300px;
  max-width: 100%;
}

.toast-success {
  border-left: 4px solid #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, #1f1f1f 100%);
}

.toast-error {
  border-left: 4px solid #f44336;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, #1f1f1f 100%);
}

.toast-warning {
  border-left: 4px solid #ffc107;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, #1f1f1f 100%);
}

.toast-info {
  border-left: 4px solid #2196F3;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, #1f1f1f 100%);
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-weight: bold;
}

.toast-success .toast-icon {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.toast-error .toast-icon {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.toast-warning .toast-icon {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.toast-info .toast-icon {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.toast-message ::v-deep(br) {
  display: block;
  margin: 4px 0;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toast-close:hover {
  color: #fff;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .toast {
    min-width: auto;
    width: 100%;
  }
}
</style>

