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
      chart: null,
      isRendering: false // Flag para evitar múltiplas renderizações simultâneas
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
      handler(newData, oldData) {
        // Só atualizar se houver dados E se os dados mudaram
        if (newData && newData.length > 0) {
          // Comparar se os dados realmente mudaram para evitar loops infinitos
          if (!oldData || JSON.stringify(newData) !== JSON.stringify(oldData)) {
            this.updateChart();
          }
        }
      }
    }
  },
  methods: {
    renderChart() {
      // Verificar se já está renderizando para evitar múltiplas chamadas simultâneas
      if (this.isRendering) {
        return;
      }
      
      this.isRendering = true;
      
      const ctx = document.getElementById(this.chartId);
      if (!ctx) {
        console.warn(`[LineChart] Canvas element for chart ${this.chartId} not found.`);
        this.isRendering = false;
        return;
      }
      
      const context2d = ctx.getContext('2d');
      if (!context2d) {
        console.warn(`[LineChart] Canvas 2D context for chart ${this.chartId} not available.`);
        this.isRendering = false;
        return;
      }
      
      // Verificar se o canvas tem dimensões válidas
      if (ctx.offsetWidth === 0 || ctx.offsetHeight === 0) {
        console.warn(`[LineChart] Canvas ${this.chartId} has zero dimensions. Retrying...`);
        this.isRendering = false;
        setTimeout(() => {
          this.renderChart();
        }, 200);
        return;
      }
      
      // Destruir gráfico anterior se existir
      if (this.chart) {
        try {
          this.chart.destroy();
        } catch (error) {
          console.warn('[LineChart] Error destroying previous chart:', error);
        }
        this.chart = null;
      }
      
      // Validar dados antes de criar o gráfico
      if (!this.data || this.data.length === 0) {
        console.warn(`[LineChart] No data to render for chart ${this.chartId}`);
        this.isRendering = false;
        return;
      }
      
      try {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.data.map((_, i) => i),
            datasets: [{
              data: [...this.data], // Criar cópia para evitar referência
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
            responsive: true, 
            maintainAspectRatio: false,
            animation: false, // Desabilitar animação para evitar problemas
            plugins: { 
              legend: { display: false }, 
              tooltip: { enabled: false } 
            },
            scales: { 
              x: { display: false }, 
              y: { display: false } 
            },
            interaction: { intersect: false, mode: 'index' }
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
        // Se não há gráfico, renderizar pela primeira vez
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
          // Canvas ainda não está no DOM, não tentar atualizar
          console.warn(`[LineChart] Canvas ${this.chartId} não encontrado para atualização`);
          return;
        }
        
        // Verificar se o gráfico ainda existe e está válido
        if (!this.chart.data || !this.chart.data.datasets || !this.chart.data.datasets[0]) {
          // Recriar o gráfico se estiver inválido
          this.$nextTick(() => {
            setTimeout(() => {
              this.renderChart();
            }, 100);
          });
          return;
        }
        
        // Atualizar apenas os dados, sem recalcular tudo
        const newLabels = this.data.map((_, i) => i);
        const newData = [...this.data];
        
        // Só atualizar se os dados realmente mudaram
        const currentData = this.chart.data.datasets[0].data;
        if (JSON.stringify(currentData) !== JSON.stringify(newData)) {
          this.chart.data.labels = newLabels;
          this.chart.data.datasets[0].data = newData;
          this.chart.update('none'); // 'none' evita animações e recálculos desnecessários
        }
      } catch (error) {
        console.warn('[LineChart] Error updating chart:', error);
        // Se houver erro, destruir e recriar
        if (this.chart) {
          try {
            this.chart.destroy();
          } catch (e) {
            // Ignorar erros ao destruir
          }
          this.chart = null;
        }
        // Tentar recriar o gráfico após um delay
        this.$nextTick(() => {
          setTimeout(() => {
            this.renderChart();
          }, 200);
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