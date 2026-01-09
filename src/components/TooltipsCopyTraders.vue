<template>
  <span class="info-icon-wrapper" ref="wrapper" @mouseenter="handleMouseEnter" @mouseleave="showTooltip = false">
    <span class="info-icon">?</span>
    <div 
      :class="['tooltip-box', positionClass]" 
      v-if="showTooltip"
      :style="tooltipStyle"
      ref="tooltip"
    >
      <slot></slot>
      <div class="tooltip-arrow" :style="arrowStyle"></div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'TooltipsCopyTraders',
  props: {
    // Propriedade para definir a posição horizontal
    position: {
      type: String,
      default: 'center', // 'center', 'left', 'right'
      validator: value => ['center', 'left', 'right'].includes(value)
    }
  },
  data() {
    return {
      showTooltip: false,
      tooltipStyle: {},
      arrowStyle: {}
    };
  },
  computed: {
    positionClass() {
      // Mapeia a prop para uma classe CSS
      return `tooltip-${this.position}`;
    }
  },
  methods: {
    handleMouseEnter() {
      this.showTooltip = true;
      this.$nextTick(() => {
        this.calculatePosition();
      });
    },
    calculatePosition() {
      if (!this.$refs.wrapper || !this.$refs.tooltip) return;
      
      const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
      const tooltipRect = this.$refs.tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let left = 0;
      let top = wrapperRect.bottom + 10;
      let arrowLeft = '50%';
      
      // Calcular posição horizontal baseada na prop position
      if (this.position === 'left') {
        left = wrapperRect.left;
        arrowLeft = '10px';
      } else if (this.position === 'right') {
        left = wrapperRect.right - tooltipRect.width;
        arrowLeft = 'calc(100% - 10px)';
      } else {
        // center
        left = wrapperRect.left + (wrapperRect.width / 2) - (tooltipRect.width / 2);
        arrowLeft = '50%';
      }
      
      // Ajustar se sair da tela à esquerda
      if (left < 10) {
        left = 10;
        arrowLeft = `${wrapperRect.left + wrapperRect.width / 2 - 10}px`;
      }
      
      // Ajustar se sair da tela à direita
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
        arrowLeft = `${wrapperRect.right - left - wrapperRect.width / 2}px`;
      }
      
      let arrowPosition = 'bottom';
      
      // Ajustar se sair da tela no topo (mostrar acima)
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = wrapperRect.top - tooltipRect.height - 10;
        arrowPosition = 'top';
      }
      
      this.tooltipStyle = {
        left: `${left}px`,
        top: `${top}px`,
        transform: 'none'
      };
      
      // Calcular posição da seta baseada na posição do tooltip
      let arrowLeftValue = arrowLeft;
      if (this.position === 'left') {
        arrowLeftValue = '10px';
      } else if (this.position === 'right') {
        arrowLeftValue = 'calc(100% - 10px)';
      } else {
        // center - calcular baseado na posição do wrapper
        const centerOffset = wrapperRect.left + wrapperRect.width / 2 - left;
        arrowLeftValue = `${centerOffset}px`;
      }
      
      if (arrowPosition === 'top') {
        this.arrowStyle = {
          bottom: 'auto',
          top: '100%',
          left: arrowLeftValue,
          transform: 'translateX(-50%)',
          borderTop: '6px solid #333',
          borderBottom: 'none',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent'
        };
      } else {
        this.arrowStyle = {
          bottom: '100%',
          top: 'auto',
          left: arrowLeftValue,
          transform: 'translateX(-50%)',
          borderBottom: '6px solid #333',
          borderTop: 'none',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent'
        };
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.calculatePosition, true);
    window.addEventListener('resize', this.calculatePosition);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.calculatePosition, true);
    window.removeEventListener('resize', this.calculatePosition);
  }
};
</script>

<style scoped>
/* Estilos do Componente Tooltip */

.info-icon-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  margin-left: 4px;
  z-index: 1;
}

.info-icon {
  width: 16px;
  height: 16px;
  border: 1.5px solid #555;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #555;
  cursor: help;
  transition: all 0.3s;
}

.info-icon-wrapper:hover .info-icon {
  border-color: #888;
  color: #888;
}

.tooltip-box {
  display: block;
  position: fixed;
  /* Posição vertical padrão: ABAIXO */
  top: calc(100% + 10px); 
  left: 50%;
  transform: translateX(-50%);
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 99999;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  line-height: 1.5;
  width: max-content;
  max-width: 380px;
  pointer-events: none;
  white-space: normal;
  word-wrap: break-word;
}
/* Ajuste de Posição - agora controlado via JavaScript */
.tooltip-box.tooltip-center {
  z-index: 99999;
}

.tooltip-box.tooltip-right {
  z-index: 99999;
}

.tooltip-box.tooltip-left {
  z-index: 99999;
}
.tooltip-arrow {
  position: absolute;
  bottom: 100%; 
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #333; 
  border-top: none;
}

/* Ajuste da seta para posição direita */
.tooltip-box.tooltip-right .tooltip-arrow {
  left: initial;
  right: 10px;
  transform: translateX(0);
}

/* Ajuste da seta para posição esquerda */
.tooltip-box.tooltip-left .tooltip-arrow {
  left: 10px;
  transform: translateX(0);
}

/* 🎨 ESTILOS DO CONTEÚDO DO SLOT (Para colorir corretamente devido ao scoped CSS) */
.tooltip-box h4 { margin: 0 0 8px 0; font-size: 14px; color: #fff; font-weight: 600; }
.tooltip-box p { margin: 0 0 8px 0; color: #DFDFDF; font-size: 14px; }
.tooltip-box p:last-child { margin-bottom: 0; }
.tooltip-box .section-title { font-size: 14px; font-weight: 600; color: #fff; margin-top: 12px; margin-bottom: 6px; }
.tooltip-box .section-title:first-child { margin-top: 0; }
.tooltip-box hr { border: none; border-top: 1px solid #333; margin: 12px 0; }
.tooltip-box .example { color: #888; font-style: italic; margin-top: 8px; }

/* Classes de Destaque */
.tooltip-box .highlight { color: #fbbf24; font-weight: 500; }
.tooltip-box .caution { color: #ef4444; font-weight: 500; }
.tooltip-box .highlight-green { color: #4ade80; font-weight: 500; }


</style>