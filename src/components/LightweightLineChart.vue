<template>
  <div class="chart-wrapper">
    <div class="chart-container" ref="chartContainer"></div>
    <!-- Floating Tooltip -->
    <div v-if="tooltip.visible" 
         class="absolute z-[100] bg-[#161616]/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl pointer-events-none transition-opacity duration-150"
         :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px', transform: 'translate(-50%, -100%) translateY(-15px)' }">
        <div class="flex flex-col items-center">
            <div class="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em] mb-1.5 opacity-60">
                Performance • {{ tooltip.time }}
            </div>
            <div class="text-base font-black tracking-tight flex items-center gap-2" :class="tooltip.value >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'">
                <span class="text-xs opacity-50">{{ currencySymbol }}</span>
                <span>{{ Math.abs(tooltip.value).toFixed(2).replace('.', ',') }}</span>
                <span v-if="tooltip.value !== 0" class="text-[10px] ml-1">
                    <i :class="tooltip.value > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                </span>
            </div>
        </div>
        <!-- Tooltip Arrow -->
        <div class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#161616] border-r border-b border-white/10 rotate-45"></div>
    </div>
  </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';

export default {
  name: 'LightweightLineChart',
  props: {
    data: {
      type: Array, // Expects [{ time: number, value: number }]
      required: true,
      default: () => []
    },
    color: {
      type: String,
      default: '#22C55E'
    },
    height: {
        type: Number,
        default: 320
    },
    currencySymbol: {
        type: String,
        default: '$'
    }
  },
  data() {
    return {
      chart: null,
      series: null,
      resizeObserver: null,
      tooltip: {
          visible: false,
          x: 0,
          y: 0,
          value: 0,
          time: ''
      }
    };
  },
  mounted() {
    this.initChart();
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        if (this.series && newData && newData.length > 0) {
           this.series.setData(newData);
           // After data update, maybe fit content if small?
           if (newData.length < 5) {
               this.chart.timeScale().fitContent();
           }
        }
      }
    },
    color: {
        immediate: true,
        handler(newColor) {
            if (this.series) {
                this.series.applyOptions({ 
                    lineColor: newColor,
                    topColor: newColor + '44', // ~26%
                    bottomColor: newColor + '00', // 0%
                });
            }
        }
    }
  },
  methods: {
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },
    initChart() {
      if (!this.$refs.chartContainer) return;

      const chartOptions = {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#A1A1AA',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
        },
        width: this.$refs.chartContainer.clientWidth,
        height: this.height,
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          borderColor: 'rgba(255, 255, 255, 0.05)',
          fixLeftEdge: true, // User request: Start from left
          fixRightEdge: false,
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
          scaleMargins: {
              top: 0.2,
              bottom: 0.2,
          },
          autoScale: true,
        },
        handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
        },
        handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
        },
        crosshair: {
            vertLine: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1,
                style: 3,
                labelVisible: false,
            },
            horzLine: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1,
                style: 3,
                labelVisible: false,
            }
        }
      };

      this.chart = createChart(this.$refs.chartContainer, chartOptions);

      // Add Area Series with high-quality settings
      this.series = this.chart.addAreaSeries({
        lineColor: this.color,
        topColor: this.color + '44',
        bottomColor: this.color + '00',
        lineWidth: 3,
        priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
        },
        lastValueVisible: false,
        priceLineVisible: false,
      });

      if (this.data && this.data.length > 0) {
        this.series.setData(this.data);
      }
      
      this.chart.timeScale().fitContent();

      // Better Tooltip System
      this.chart.subscribeCrosshairMove(param => {
          if (!param.point || !param.time || param.point.x < 0 || param.point.x > this.$refs.chartContainer.clientWidth) {
              this.tooltip.visible = false;
              return;
          }

          const data = param.seriesData.get(this.series);
          if (data && (data.value !== undefined || data.close !== undefined)) {
              this.tooltip.visible = true;
              this.tooltip.x = param.point.x;
              this.tooltip.y = param.point.y;
              this.tooltip.value = data.value !== undefined ? data.value : data.close;
              this.tooltip.time = this.formatTime(param.time);
          } else {
              this.tooltip.visible = false;
          }
      });

      // Resize Observer
      this.resizeObserver = new ResizeObserver(entries => {
        if (entries.length === 0 || !entries[0].contentRect) return;
        const { width } = entries[0].contentRect;
        if (this.chart) {
            this.chart.applyOptions({ width });
        }
      });
      this.resizeObserver.observe(this.$refs.chartContainer);
    },
    forceUpdate() {
        if (this.chart) {
            this.chart.timeScale().fitContent();
        }
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
