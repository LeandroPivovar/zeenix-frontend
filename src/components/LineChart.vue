<template>
  <div class="chart-wrapper">
    <canvas :id="chartId" :key="chartId"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'LineChart',
  props: {
    chartId: { type: String, required: true },
    data: { type: Array, required: true }, 
    color: { type: String, default: '#10B981' },
    height: { type: Number, default: 80 },
    currencySymbol: { type: String, default: '$' }
  },
  data() {
    return {
      chart: null,
      isRendering: false,
      resizeObserver: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.data && this.data.length > 0) {
          this.renderChart();
        }
      }, 300);
    });
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chart) {
      this.chart.stop(); // Stop animations
      this.chart.destroy();
      this.chart = null; 
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        if (newData && newData.length > 0) {
            this.updateChart();
        }
      }
    },
    currencySymbol() {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      if (this.isRendering) return;
      this.isRendering = true;
      
      const ctx = document.getElementById(this.chartId);
      if (!ctx) {
        this.isRendering = false;
        return;
      }
      
      if (this.chart) {
        try {
          this.chart.stop();
          this.chart.destroy();
        } catch (error) {
          console.warn('[LineChart] Error destroying previous chart:', error);
        }
        this.chart = null;
      }
      
      if (!this.data || this.data.length === 0) {
        this.isRendering = false;
        return;
      }
      
      const self = this;
      try {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.data.map((_, i) => i),
            datasets: [{
              data: [...this.data],
              borderColor: this.color,
              backgroundColor: this.createGradient(ctx, this.color),
              borderWidth: 3,
              fill: 'start',
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: this.color,
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
            animation: {
                duration: 800,
                easing: 'easeOutQuart',
                onComplete: function() {
                  // Optional: Mark as rendered
                }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                displayColors: false,
                cornerRadius: 8,
                intersect: false,
                mode: 'index',
                callbacks: {
                    title: function(context) {
                        return `Operação #${context[0].dataIndex}`;
                    },
                    label: function(context) {
                        const index = context.dataIndex;
                        const dataset = context.dataset.data;
                        const totalValue = context.parsed.y;
                        
                        let opValue = totalValue;
                        if (index > 0) {
                            opValue = totalValue - dataset[index - 1];
                        }
                        
                        const sign = opValue >= 0 ? '+' : '';
                        const formattedOp = sign + self.currencySymbol + opValue.toFixed(2).replace('.', ',');
                        const formattedTotal = self.currencySymbol + totalValue.toFixed(2).replace('.', ',');
                        
                        return [
                          `Resultado: ${formattedOp}`,
                          `Acumulado: ${formattedTotal}`
                        ];
                    }
                }
              }
            },
            scales: {
              x: { 
                display: true,
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: { display: false }
              },
              y: { 
                display: true,
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)',
                    font: { size: 10 },
                    callback: function(value) {
                        return self.currencySymbol + value.toFixed(2);
                    }
                }
              }
            },
            interaction: {
                intersect: false,
                mode: 'index',
                axis: 'x'
            }
          }
        });
        
        this.isRendering = false;
      } catch (error) {
        console.error(`[LineChart] Error creating chart ${this.chartId}:`, error);
        this.chart = null;
        this.isRendering = false;
      }
    },
    
    createGradient(ctx, color) {
      if (!ctx) return 'rgba(0,0,0,0)';
      const context2d = ctx.getContext('2d');
      if (!context2d) return 'rgba(0,0,0,0)'; 

      try {
        const gradient = context2d.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, color + '50'); 
        gradient.addColorStop(1, color + '00'); 
        return gradient;
      } catch (error) {
        return 'rgba(0,0,0,0)';
      }
    },
    
    updateChart() {
      if (!this.data || this.data.length === 0) return;
      
      if (!this.chart) {
        this.renderChart();
        return;
      }
      
      try {
        const newData = [...this.data];
        const currentData = this.chart.data.datasets[0].data;
        
        if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
          this.chart.data.labels = newData.map((_, i) => i);
          this.chart.data.datasets[0].data = newData;
          this.chart.update('none'); 
        }
      } catch (error) {
        this.renderChart();
      }
    },
    forceUpdate() {
        if (this.chart) {
             const ctx = document.getElementById(this.chartId);
             if (ctx) {
                this.chart.resize();
             }
        } else {
            this.renderChart();
        }
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%; height: 100%; min-height: 80px; position: relative;
}
canvas {
  width: 100% !important; height: 100% !important;
}
</style>