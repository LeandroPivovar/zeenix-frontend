<template>
  <div class="daily-chart-container premium-card">
    <div class="chart-header">
      <div class="header-info">
        <h3 class="chart-title">Histórico de Markup Diário</h3>
        <p class="chart-subtitle">Performance diária dos últimos 30 dias</p>
      </div>
      <div class="header-metrics">
        <div class="metric-item">
          <span class="metric-label">Total no Período</span>
          <span class="metric-value highlight">{{ formatCurrency(totalMarkup) }}</span>
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
  name: 'DailyMarkupChart',
  props: {
    dailyData: { type: Array, default: () => [] }
  },
  data() {
    return {
      // chart instance stored outside data to avoid reactivity issues
    };
  },
  computed: {
    totalMarkup() {
      if (!this.dailyData || this.dailyData.length === 0) return 0;
      return this.dailyData.reduce((acc, curr) => acc + (curr.markup || 0), 0);
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
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
    },
    renderChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d');
      
      // Ensure dailyData is sorted by date
      const sortedData = [...this.dailyData].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const labels = sortedData.map(d => this.formatDate(d.date));
      const data = sortedData.map(d => d.markup);
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Markup Diário',
            data: data,
            borderColor: '#00FF88',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(0, 255, 136, 0.2)');
              gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
              return gradient;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#121212',
            pointBorderColor: '#00FF88',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#121212',
              titleColor: '#888',
              bodyColor: '#fff',
              borderColor: '#333',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (context) => `Markup: ${this.formatCurrency(context.parsed.y)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#666', font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }
            },
            y: {
              beginAtZero: true,
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
      
      const sortedData = [...this.dailyData].sort((a, b) => new Date(a.date) - new Date(b.date));
      this.chart.data.labels = sortedData.map(d => this.formatDate(d.date));
      this.chart.data.datasets[0].data = sortedData.map(d => d.markup);
      this.chart.update();
    }
  }
};
</script>

<style scoped>
.daily-chart-container {
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
