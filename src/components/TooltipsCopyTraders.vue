<template>
  <span class="info-icon-wrapper" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
    <span class="info-icon">?</span>
    <div :class="['tooltip-box', positionClass]" v-if="showTooltip">
      <slot></slot>
      <div class="tooltip-arrow"></div>
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
    };
  },
  computed: {
    positionClass() {
      // Mapeia a prop para uma classe CSS
      return `tooltip-${this.position}`;
    }
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
  position: absolute;
  /* Posição vertical padrão: ABAIXO */
  top: calc(100% + 10px); 
  left: 50%;
  transform: translateX(-50%);
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 16px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 9999;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  line-height: 1.5;
}
/* Ajuste de Posição */
.tooltip-box.tooltip-center {
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  z-index: 9999;
}

.tooltip-box.tooltip-right {
  left: initial;
  right: 0;
  transform: translateX(0);
  width: 400px;
  z-index: 9999;
}

.tooltip-box.tooltip-left {
  left: 0;
  transform: translateX(0);
  width: 400px;
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
.tooltip-box p { margin: 0 0 8px 0; color: #aaa; font-size: 13px; }
.tooltip-box p:last-child { margin-bottom: 0; }
.tooltip-box .section-title { font-size: 13px; font-weight: 600; color: #fff; margin-top: 12px; margin-bottom: 6px; }
.tooltip-box .section-title:first-child { margin-top: 0; }
.tooltip-box hr { border: none; border-top: 1px solid #333; margin: 12px 0; }
.tooltip-box .example { color: #888; font-style: italic; margin-top: 8px; }

/* Classes de Destaque */
.tooltip-box .highlight { color: #fbbf24; font-weight: 500; }
.tooltip-box .caution { color: #ef4444; font-weight: 500; }
.tooltip-box .highlight-green { color: #4ade80; font-weight: 500; }


</style>