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
    this.$nextTick(() => {
      // Delay para garantir que o canvas esteja totalmente renderizado e visível
      // Especialmente importante quando há animações CSS que começam com opacity: 0
      setTimeout(() => {
        if (this.data && this.data.length > 0) {
          this.renderChart();
        }
      }, 300);
    });
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
      handler(newData) {
        // Só atualizar se houver dados
        if (newData && newData.length > 0) {
          this.updateChart();
        }
      }
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById(this.chartId);
      if (!ctx) {
        console.warn(`Canvas element for chart ${this.chartId} not found.`);
        return;
      }
      
      const context2d = ctx.getContext('2d');
      if (!context2d) {
        console.warn(`Canvas 2D context for chart ${this.chartId} not available.`);
        return;
      }
      
      // Verificar se o canvas tem dimensões válidas
      if (ctx.offsetWidth === 0 || ctx.offsetHeight === 0) {
        console.warn(`Canvas ${this.chartId} has zero dimensions. Retrying...`);
        setTimeout(() => {
          this.renderChart();
        }, 100);
        return;
      }
      
      // Destruir gráfico anterior se existir
      if (this.chart) {
        try {
          this.chart.destroy();
        } catch (error) {
          console.warn('Error destroying previous chart:', error);
        }
        this.chart = null;
      }
      
      try {
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
      } catch (error) {
        console.error(`Error creating chart ${this.chartId}:`, error);
        this.chart = null;
      }
    },
    
    createGradient(ctx, color) {
      if (!ctx) return 'rgba(0,0,0,0)';
      
      const context2d = ctx.getContext('2d');
      if (!context2d) return 'rgba(0,0,0,0)'; 

      try {
        const gradient = context2d.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, color + '40'); 
        gradient.addColorStop(1, color + '00'); 
        return gradient;
      } catch (error) {
        console.warn('Error creating gradient:', error);
        return 'rgba(0,0,0,0)';
      }
    },
    
    updateChart() {
      if (!this.data || this.data.length === 0) {
        return;
      }
      
      if (!this.chart) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.renderChart();
          }, 100);
        });
        return;
      }
      
      try {
        const ctx = document.getElementById(this.chartId);
        if (!ctx) {
          // Canvas ainda não está no DOM, tentar novamente depois
          setTimeout(() => {
            this.updateChart();
          }, 100);
          return;
        }
        
        this.chart.data.labels = this.data.map((_, i) => i);
        this.chart.data.datasets[0].data = this.data;
        this.chart.update('none');
      } catch (error) {
        console.warn('Error updating chart:', error);
        // Tentar recriar o gráfico se houver erro
        this.$nextTick(() => {
          setTimeout(() => {
            this.renderChart();
          }, 100);
        });
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