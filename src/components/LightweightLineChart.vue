<template>
  <div class="chart-wrapper">
    <div class="chart-container" ref="chartContainer"></div>
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
    },
    markers: {
        type: Array,
        default: () => []
    }
  },
  data() {
    return {
      chart: null,
      series: null,
      resizeObserver: null
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
           if (newData.length < 5) {
               this.chart.timeScale().fitContent();
           }
        }
      }
    },
    markers: {
        deep: true,
        handler(newMarkers) {
            if (this.series) {
                this.series.setMarkers(newMarkers || []);
            }
        }
    },
    color: {
        immediate: true,
        handler(newColor) {
            if (this.series) {
                this.series.applyOptions({ 
                    lineColor: newColor,
                    topColor: newColor + '44',
                    bottomColor: newColor + '00',
                });
            }
        }
    }
  },
  methods: {
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
          fixLeftEdge: true,
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
