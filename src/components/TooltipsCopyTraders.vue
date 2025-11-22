<template>
    <span class="info-icon-wrapper" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
      <span class="info-icon">?</span>
      <div class="tooltip-box" v-if="showTooltip">
        <slot></slot>
        <div class="tooltip-arrow"></div>
      </div>
    </span>
  </template>
  
  <script>
  export default {
    name: 'TooltipsCopyTraders',
    data() {
      return {
        showTooltip: false,
      };
    },
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
    display: block; /* Controlado pelo v-if do Vue */
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    width: 320px;
    background-color: #1a1a1a;
    border: 1px solid #333;
    padding: 16px;
    border-radius: 6px;
    font-size: 13px;
    z-index: 1000;
    text-align: left;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
    line-height: 1.5;
  }
  
  .tooltip-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #333; /* Cor da borda do tooltip */
  }
  
  /* Estilos internos para o conteúdo do tooltip - podem ser globais ou repetidos */
  .tooltip-box h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #fff;
    font-weight: 600;
  }
  
  .tooltip-box p {
    margin: 0 0 8px 0;
    color: #aaa;
    font-size: 13px;
  }
  
  .tooltip-box p:last-child {
    margin-bottom: 0;
  }
  
  .tooltip-box .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-top: 12px;
    margin-bottom: 6px;
  }
  
  .tooltip-box .section-title:first-child {
    margin-top: 0;
  }
  
  .tooltip-box hr {
    border: none;
    border-top: 1px solid #333;
    margin: 12px 0;
  }
  
  .tooltip-box .example {
    color: #888;
    font-style: italic;
    margin-top: 8px;
  }
  
  .tooltip-box .highlight {
    color: #fbbf24;
    font-weight: 500;
  }
  
  .tooltip-box .caution {
    color: #ef4444;
    font-weight: 500;
  }
  </style>