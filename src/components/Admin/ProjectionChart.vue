<template>
  <div class="projection-chart-container premium-card">
    <div class="chart-header">
      <div class="header-info">
        <h3 class="chart-title">Projeção 12 Meses (Crescimento 5%)</h3>
        <p class="chart-subtitle">Projeção de lucro mensal baseada na média atual com crescimento composto de 5% ao mês</p>
      </div>
      <div class="header-metrics">
        <div class="metric-item">
          <span class="metric-label">Média Diária Atual</span>
          <span class="metric-value">{{ formatCurrency(dailyAverage) }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Projeção Total (12 Meses)</span>
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
      const monthlyBase = this.dailyAverage * 30;
      let currentAmount = monthlyBase;
      let total = 0;
      
      for (let i = 0; i < 12; i++) {
        if (i > 0) {
            currentAmount = currentAmount * 1.05;
        }
        total += currentAmount;
      }
      return total;
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
      
      const currentMonth = new Date().getMonth();
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      
      const labels = [];
      const projectionData = [];
      const monthlyBase = this.dailyAverage * 30; // Base monthly profit
      let currentAmount = monthlyBase;

      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth + i) % 12;
        labels.push(monthNames[monthIndex]);
        
        // Add 5% growth each month
        if (i > 0) {
            currentAmount = currentAmount * 1.05;
        }
        projectionData.push(currentAmount);
      }
      
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Lucro Projetado (Mês)',
            data: projectionData,
            backgroundColor: '#00FF88',
            borderRadius: 4,
            barPercentage: 0.5,
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
              callbacks: {
                label: (context) => `Lucro Projetado: ${this.formatCurrency(context.parsed.y)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#666' }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#666',
                callback: (value) => this.formatCurrency(value)
              }
            }
          }
        }
      });
    },
    updateChart() {
      if (!this.chart) return;
      
      const monthlyBase = this.dailyAverage * 30;
      let currentAmount = monthlyBase;
      const projectionData = [];

      for (let i = 0; i < 12; i++) {
        if (i > 0) {
            currentAmount = currentAmount * 1.05;
        }
        projectionData.push(currentAmount);
      }

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
