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
    height: { type: Number, default: 80 }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.renderChart();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null; 
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.updateChart();
      }
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById(this.chartId);
      if (!ctx || !ctx.getContext('2d')) {
        console.warn(`Canvas context for chart ${this.chartId} not ready.`);
        return;
      }
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.map((_, i) => i),
          datasets: [{
            data: this.data,
            borderColor: this.color,
            backgroundColor: this.createGradient(ctx, this.color),
            borderWidth: 2,
            fill: true,
            tension: 0.4, 
            pointRadius: 0, 
            pointHoverRadius: 0 
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          interaction: { intersect: false, mode: 'index' }
        }
      });
    },
    
    createGradient(ctx, color) {
      const context2d = ctx.getContext('2d');
      if (!context2d) return 'rgba(0,0,0,0)'; 

      const gradient = context2d.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, color + '40'); 
      gradient.addColorStop(1, color + '00'); 
      return gradient;
    },
    
    updateChart() {
      if (!this.chart) {
        this.renderChart();
        return;
      }
      this.chart.data.labels = this.data.map((_, i) => i);
      this.chart.data.datasets[0].data = this.data;
      this.chart.update('none'); 
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