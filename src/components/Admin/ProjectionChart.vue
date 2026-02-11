<template>
  <div class="projection-chart-container premium-card">
    <div class="chart-header">
      <div class="header-info">
        <h3 class="chart-title">Projeção de Markup (30 Dias)</h3>
        <p class="chart-subtitle">Baseado na média de performance dos últimos 30 dias</p>
      </div>
      <div class="header-metrics">
        <div class="metric-item">
          <span class="metric-label">Média Diária</span>
          <span class="metric-value">{{ formatCurrency(dailyAverage) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Projeção Total</span>
          <span class="metric-value highlight">{{ formatCurrency(projectedTotal) }}</span>
        </div>
      </div>
    </div>
    <div class="chart-body">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'ProjectionChart',
  props: {
    dailyData: { type: Array, default: () => [] }
  },
  data() {
    return {
      // chart: null // Removed to avoid reactivity issues with Chart.js
    };
  },
  computed: {
    dailyAverage() {
      if (!this.dailyData || this.dailyData.length === 0) return 0;
      const sum = this.dailyData.reduce((acc, curr) => acc + (curr.markup || 0), 0);
      return sum / 30; // Sempre divide por 30 para média mensal real
    },
    projectedTotal() {
      return this.dailyAverage * 30;
    }
  },
  watch: {
    dailyData: {
      deep: true,
      handler() {
        this.updateChart();
      }
    }
  },
  mounted() {
    this.renderChart();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    formatCurrency(value) {
      if (isNaN(value) || value === null) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    },
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');
      
      const labels = Array.from({ length: 30 }, (_, i) => `Dia ${i + 1}`);
      const projectionData = labels.map((_, i) => this.dailyAverage * (i + 1));
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Projeção de Markup',
            data: projectionData,
            borderColor: '#00FF88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#00FF88',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#121212',
              titleColor: '#888',
              bodyColor: '#fff',
              borderColor: '#1C1C1C',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (context) => `Projeção: ${this.formatCurrency(context.parsed.y)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#666', font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#666',
                font: { size: 10 },
                callback: (value) => this.formatCurrency(value)
              }
            }
          }
        }
      });
    },
    updateChart() {
      if (!this.chart) return;
      const projectionData = Array.from({ length: 30 }, (_, i) => this.dailyAverage * (i + 1));
      this.chart.data.datasets[0].data = projectionData;
      this.chart.update();
    }
  }
};
</script>

<style scoped>
.projection-chart-container {
  background: #121212;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #fff;
}

.chart-subtitle {
  font-size: 13px;
  color: #888;
  margin: 0;
}

.header-metrics {
  display: flex;
  gap: 32px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.metric-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.metric-value.highlight {
  color: #00FF88;
}

.chart-body {
  height: 240px;
  position: relative;
}
</style>
