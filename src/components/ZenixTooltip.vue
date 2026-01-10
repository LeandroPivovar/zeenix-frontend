<template>
  <div class="zenix-tooltip-wrapper" ref="wrapper">
    <!-- Removido o .stop para permitir que cliques em outros triggers fechem este tooltip via document click listener -->
    <div 
      class="zenix-tooltip-trigger" 
      ref="trigger" 
      @click="handleTriggerClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot name="trigger">
        <div class="info-icon" :class="{ 'active': isVisible }">
          <i class="fas fa-question-circle"></i>
        </div>
      </slot>
    </div>
    
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="isVisible" 
          class="zenix-tooltip-content"
          :style="coords"
          ref="tooltip"
          @click.stop
        >
          <div class="tooltip-inner premium-card shadow-xl">
            <slot></slot>
          </div>
          <div class="tooltip-arrow" :style="arrowStyle"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'ZenixTooltip',
  props: {
    offset: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      isVisible: false,
      uid: Math.random().toString(36).substr(2, 9),
      coords: {
        top: '0px',
        left: '0px',
        opacity: 1
      },
      arrowStyle: {}
    };
  },
  methods: {
    handleTriggerClick(event) {
      // No mobile, o clique alterna a visibilidade
      if (window.innerWidth <= 768) {
        event.stopPropagation();
        if (this.isVisible) {
          this.hide();
        } else {
          // Dispara evento global para fechar outros tooltips
          window.dispatchEvent(new CustomEvent('zenix-tooltip-open', { detail: { uid: this.uid } }));
          this.show();
        }
      }
    },
    handleMouseEnter() {
      // No desktop, mouse enter abre
      if (window.innerWidth > 768) {
        window.dispatchEvent(new CustomEvent('zenix-tooltip-open', { detail: { uid: this.uid } }));
        this.show();
      }
    },
    handleMouseLeave() {
      // No desktop, mouse leave fecha
      if (window.innerWidth > 768) {
        this.hide();
      }
    },
    show() {
      this.isVisible = true;
      // We need to wait for the element to be rendered in the DOM to measure it
      // requestAnimationFrame is usually better than nextTick for layout calculations
      requestAnimationFrame(() => {
        this.calculatePosition();
        
        // Para mobile, adicionamos o listener de clique no documento para fechar ao clicar fora
        if (window.innerWidth <= 768) {
          // Delaying adding the listener to avoid immediate hide from the same click
          setTimeout(() => {
            document.addEventListener('click', this.hide);
          }, 10);
        }
      });
    },
    hide() {
      if (!this.isVisible) return;
      this.isVisible = false;
      document.removeEventListener('click', this.hide);
    },
    handleGlobalOpen(event) {
      // Se outro tooltip foi aberto, este se fecha
      if (event.detail && event.detail.uid !== this.uid) {
        this.hide();
      }
    },
    calculatePosition() {
      const trigger = this.$refs.trigger;
      const tooltip = this.$refs.tooltip;
      
      if (!trigger || !tooltip) return;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // If width is 0, we can't position it yet. Wait for next attempt.
      if (tooltipRect.width === 0) return;

      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      const isMobile = viewportWidth <= 768;

      // Vertical position (anchored to trigger)
      let top = triggerRect.bottom + this.offset + window.scrollY;
      
      // Handle tooltip going off bottom
      if (top + tooltipRect.height > viewportHeight + window.scrollY - 10) {
          // Flip to top if it doesn't fit below
          top = triggerRect.top - tooltipRect.height - this.offset + window.scrollY;
      }

      // Horizontal position
      let left;
      if (isMobile) {
          // Center on screen horizontally
          left = (viewportWidth - tooltipRect.width) / 2 + window.scrollX;
      } else {
          // Center relative to trigger
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + window.scrollX;
      }

      // Safety: Clamp to screen edges with margin
      const margin = 15;
      const minLeft = margin + window.scrollX;
      const maxLeft = viewportWidth - tooltipRect.width - margin + window.scrollX;
      
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      this.coords = {
        top: `${top}px`,
        left: `${left}px`,
        opacity: 1
      };

      // Calculate arrow position relative to tooltip box
      const triggerCenterOnPage = triggerRect.left + (triggerRect.width / 2) + window.scrollX;
      let arrowLeft = triggerCenterOnPage - left;
      
      // Keep arrow within tooltip bounds
      const arrowMargin = 10;
      if (arrowLeft < arrowMargin) arrowLeft = arrowMargin;
      if (arrowLeft > tooltipRect.width - arrowMargin) arrowLeft = tooltipRect.width - arrowMargin;
      
      this.arrowStyle = {
        left: `${arrowLeft}px`
      };
    }
  },
  mounted() {
    window.addEventListener('resize', this.calculatePosition);
    window.addEventListener('scroll', this.calculatePosition, true);
    window.addEventListener('zenix-tooltip-open', this.handleGlobalOpen);
  },
  beforeUnmount() {
    this.hide();
    window.removeEventListener('resize', this.calculatePosition);
    window.removeEventListener('scroll', this.calculatePosition, true);
    window.removeEventListener('zenix-tooltip-open', this.handleGlobalOpen);
  }
};
</script>

<style scoped>
.zenix-tooltip-wrapper {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  line-height: 1;
  margin-left: 6px;
}

.zenix-tooltip-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.info-icon {
  color: #9a9a9a; /* Verde Zenix padrão agora */
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.info-icon.active, .zenix-tooltip-trigger:hover .info-icon {
  opacity: 1;
  filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.4));
}

.zenix-tooltip-content {
  position: absolute;
  z-index: 99999;
  width: max-content;
  max-width: 280px;
}

@media (max-width: 768px) {
  .zenix-tooltip-content {
    max-width: calc(100vw - 30px);
  }
}

.tooltip-inner {
  background: #0D0D0D;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #DFDFDF;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;
  position: relative;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
}

.tooltip-inner :deep(p) {
  margin: 0;
  margin-bottom: 8px;
}

.tooltip-inner :deep(p:last-child) {
  margin-bottom: 0;
}

.tooltip-inner :deep(b), .tooltip-inner :deep(strong) {
  color: #22C55E;
  font-weight: 700;
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(255, 255, 255, 0.1);
  top: -8px;
  transform: translateX(-50%);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
