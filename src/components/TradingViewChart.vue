<template>
  <div class="tradingview-chart-wrapper">
    <div 
      ref="chartContainer" 
      id="tradingview-chart-container"
      class="w-full h-full"
      :style="{ width: '100%', height: '100%', minHeight: '400px' }"
    ></div>
    <div v-if="!libraryLoaded" class="library-loading-overlay">
      <div class="loading-message">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando biblioteca TradingView...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TradingViewChart',
  props: {
    symbol: {
      type: String,
      required: true,
      default: 'R_100'
    },
    datafeed: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      default: 'dark'
    },
    interval: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      widget: null,
      chartReady: false,
      libraryLoaded: false
    };
  },
  mounted() {
    this.checkLibraryAndInit();
  },
  beforeUnmount() {
    this.destroyChart();
  },
  watch: {
    symbol(newSymbol) {
      if (this.widget && this.chartReady) {
        this.updateSymbol(newSymbol);
      }
    },
    theme(newTheme) {
      if (this.widget && this.chartReady) {
        this.updateTheme(newTheme);
      }
    }
  },
  methods: {
    checkLibraryAndInit() {
      // Verificar se a biblioteca TradingView está carregada
      if (typeof window !== 'undefined' && window.TradingView && window.TradingView.widget) {
        this.libraryLoaded = true;
        this.$nextTick(() => {
          this.initChart();
        });
      } else {
        // Tentar novamente após um delay
        console.warn('[TradingViewChart] Biblioteca não encontrada, tentando novamente...');
        setTimeout(() => {
          this.checkLibraryAndInit();
        }, 500);
      }
    },
    
    initChart() {
      if (!this.$refs.chartContainer) {
        console.error('[TradingViewChart] Container não encontrado');
        return;
      }

      if (typeof window === 'undefined' || !window.TradingView || !window.TradingView.widget) {
        console.error('[TradingViewChart] Biblioteca TradingView não encontrada!');
        console.error('[TradingViewChart] Certifique-se de que:');
        console.error('[TradingViewChart] 1. Os arquivos estão em /public/charting_library/');
        console.error('[TradingViewChart] 2. Os scripts estão descomentados no index.html');
        return;
      }

      console.log('[TradingViewChart] Inicializando gráfico...');
      console.log('[TradingViewChart] Símbolo:', this.symbol);
      console.log('[TradingViewChart] Datafeed:', this.datafeed);

      try {
        this.widget = new window.TradingView.widget({
          symbol: this.symbol,
          datafeed: this.datafeed,
          interval: this.interval,
          container: this.$refs.chartContainer,
          library_path: '/charting_library/',
          locale: 'pt',
          disabled_features: [
            'use_localstorage_for_settings',
            'volume_force_overlay',
            'create_volume_indicator_by_default',
            'header_compare',
            'header_screenshot',
            'header_widget',
            'header_saveload',
            'header_chart_type',
            'header_resolutions',
            'header_symbol_search',
            'header_undo_redo',
            'header_interval_dialog_button',
            'show_interval_dialog_on_key_press',
            'header_settings',
            'header_fullscreen_button',
            'header_widget_dom_node',
            'timeframes_toolbar',
            'go_to_date',
            'control_bar',
            'timeframes_toolbar',
            'edit_buttons_in_legend',
            'context_menus',
            'left_toolbar',
          ],
          enabled_features: [
            'study_templates',
            'side_toolbar_in_fullscreen_mode',
            'header_in_fullscreen_mode',
            'hide_left_toolbar_by_default',
            'drawing_templates',
            'side_toolbar',
          ],
          charts_storage_url: 'https://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user_id',
          fullscreen: false,
          autosize: true,
          studies_overrides: {},
          theme: this.theme === 'dark' ? 'Dark' : 'Light',
          toolbar_bg: '#1a1a1a',
          loading_screen: { backgroundColor: '#1a1a1a' },
          overrides: {
            'paneProperties.background': '#1a1a1a',
            'paneProperties.vertGridProperties.color': '#2a2a2a',
            'paneProperties.horzGridProperties.color': '#2a2a2a',
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': '#AAA',
            'mainSeriesProperties.candleStyle.upColor': '#26a69a',
            'mainSeriesProperties.candleStyle.downColor': '#ef5350',
            'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
            'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
          },
        });

        this.widget.onChartReady(() => {
          this.chartReady = true;
          console.log('[TradingViewChart] Gráfico pronto!');
          this.$emit('chart-ready', this.widget);
        });

        // Expor widget para acesso externo se necessário
        this.$emit('widget-created', this.widget);
      } catch (error) {
        console.error('[TradingViewChart] Erro ao inicializar gráfico:', error);
        this.$emit('error', error);
      }
    },
    
    updateSymbol(newSymbol) {
      if (this.widget && this.chartReady) {
        try {
          this.widget.setSymbol(newSymbol, this.interval, () => {
            console.log('[TradingViewChart] Símbolo atualizado:', newSymbol);
            this.$emit('symbol-changed', newSymbol);
          });
        } catch (error) {
          console.error('[TradingViewChart] Erro ao atualizar símbolo:', error);
        }
      }
    },
    
    updateTheme(newTheme) {
      if (this.widget && this.chartReady) {
        try {
          this.widget.changeTheme(newTheme === 'dark' ? 'Dark' : 'Light');
          console.log('[TradingViewChart] Tema atualizado:', newTheme);
        } catch (error) {
          console.error('[TradingViewChart] Erro ao atualizar tema:', error);
        }
      }
    },
    
    destroyChart() {
      if (this.widget) {
        try {
          this.widget.remove();
          this.widget = null;
          this.chartReady = false;
          console.log('[TradingViewChart] Gráfico destruído');
        } catch (error) {
          console.error('[TradingViewChart] Erro ao destruir gráfico:', error);
        }
      }
    },
    
    // Métodos públicos para acesso externo
    getWidget() {
      return this.widget;
    },
    
    isReady() {
      return this.chartReady;
    }
  }
};
</script>

<style scoped>
.tradingview-chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

#tradingview-chart-container {
  width: 100%;
  height: 100%;
}

.library-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 26, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #aaa;
}

.loading-message i {
  font-size: 2rem;
  color: #26a69a;
}

.loading-message p {
  font-size: 0.875rem;
}
</style>

