<template>
  <div class="chart-wrapper">
    <div class="chart-container" ref="chartContainer"></div>
    <!-- Floating Tooltip -->
    <div v-if="tooltip.visible" 
         class="absolute z-10 bg-secondary/90 backdrop-blur-md border border-border/40 p-3 rounded-xl shadow-2xl pointer-events-none transition-opacity duration-200"
         :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px', transform: 'translate(-50%, -100%) translateY(-12px)' }">
        <div class="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{{ tooltip.time }}</div>
        <div class="text-sm font-bold" :class="tooltip.value >= 0 ? 'text-success' : 'text-red-500'">
            {{ tooltip.value >= 0 ? '+' : '' }}{{ currencySymbol }}{{ Math.abs(tooltip.value).toFixed(2).replace('.', ',') }}
        </div>
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
        if (this.series && newData) {
           this.series.setData(newData);
        }
      }
    },
    color(newColor) {
      if (this.series) {
        this.series.applyOptions({ 
            lineColor: newColor,
            topColor: newColor + '44', // Lower opacity
            bottomColor: newColor + '02',
        });
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
          vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
        },
        width: this.$refs.chartContainer.clientWidth,
        height: this.height,
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
          scaleMargins: {
              top: 0.1,
              bottom: 0.1,
          }
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

      // Add Area Series for the "Performance" look
      this.series = this.chart.addAreaSeries({
        lineColor: this.color,
        topColor: this.color + '44',
        bottomColor: this.color + '02',
        lineWidth: 3,
        priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
        },
      });

      if (this.data && this.data.length > 0) {
        this.series.setData(this.data);
      }
      
      this.chart.timeScale().fitContent();

      // Tooltip Interactivity
      this.chart.subscribeCrosshairMove(param => {
          if (!param.point || !param.time || param.point.x < 0 || param.point.x > this.$refs.chartContainer.clientWidth) {
              this.tooltip.visible = false;
              return;
          }

          const data = param.seriesData.get(this.series);
          if (data) {
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
