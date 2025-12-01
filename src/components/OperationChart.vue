<template>
  <div class="operation-chart-wrapper">
    <!-- Loading State -->
    <div v-if="!isAuthorized" class="connection-loading-card">
      <div class="loading-indicator-wrapper">
        <div class="spinner-large"></div>
        <p class="loading-message">Conectando à Deriv...</p>
      </div>
    </div>

    <!-- Chart Container -->
    <div v-else class="operation-layout">
      <div class="col-chart flex-1 flex flex-col gap-5">
        <div class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden flex flex-col shadow-[0_0_8px_rgba(0,0,0,0.25)] chart-container w-full" style="min-height: 845px;">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
            <div class="flex items-center gap-4">
              <select 
                v-model="selectedSymbol"
                @change="onSymbolChange"
                class="bg-zenix-bg border border-zenix-border rounded-lg px-3 py-2 text-sm text-zenix-text"
              >
                <option value="R_100">Volatility 100 Index</option>
                <option value="R_50">Volatility 50 Index</option>
                <option value="R_25">Volatility 25 Index</option>
                <option value="R_10">Volatility 10 Index</option>
              </select>
            </div>
          </div>
          
          <!-- Chart Container -->
          <div 
            id="chartContainer" 
            ref="chartContainer" 
            class="flex-1 w-full"
            style="background-color: #0B0B0B; min-height: 400px; height: 100%;"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createChart, ColorType } from 'lightweight-charts';

const APP_ID = process.env.VUE_APP_DERIV_APP_ID || '111346';
const WS_URL = 'wss://ws.derivws.com/websockets/v3';

export default {
  name: 'OperationChart',
  props: {
    accountBalance: { type: String, required: true },
    accountCurrency: { type: String, default: 'USD' },
    preferredCurrency: { type: String, default: 'USD' },
    accountLoginid: { type: String, default: null },
    orderConfig: { type: Object, required: true },
    lastOrders: { type: Array, default: () => [] },
  },
  data() {
    return {
      ws: null,
      chart: null,
      lineSeries: null,
      isAuthorized: false,
      selectedSymbol: 'R_100',
      ticks: [],
      token: null,
      subscriptionId: null,
    };
  },
  mounted() {
    console.log('[OperationChart] Componente montado');
    
    // Aguardar o próximo tick para garantir que o DOM está totalmente renderizado
    this.$nextTick(() => {
      this.initChart();
      this.initConnection();
    });
  },
  beforeUnmount() {
    this.disconnect();
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      if (this.chart) {
        return;
      }

      const container = this.$refs.chartContainer;
      if (!container) {
        console.error('[OperationChart] Container não encontrado, tentando novamente...');
        setTimeout(() => this.initChart(), 100);
        return;
      }

      // Aguardar até que o container tenha dimensões válidas
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        console.log('[OperationChart] Container ainda não tem dimensões, aguardando...');
        setTimeout(() => this.initChart(), 100);
        return;
      }

      const width = container.clientWidth || rect.width || 800;
      const height = container.clientHeight || rect.height || 600;

      console.log('[OperationChart] Criando gráfico:', { width, height });

      try {
        this.chart = createChart(container, {
          width,
          height,
          layout: {
            background: { type: ColorType.Solid, color: '#0B0B0B' },
            textColor: '#DFDFDF',
          },
          rightPriceScale: {
            borderVisible: false,
            textColor: '#DFDFDF',
          },
          leftPriceScale: {
            visible: false,
          },
          timeScale: {
            borderVisible: false,
            timeVisible: true,
            secondsVisible: true,
          },
          grid: {
            vertLines: { color: 'rgba(28, 28, 28, 0.5)' },
            horzLines: { color: 'rgba(28, 28, 28, 0.5)' },
          },
        });

        this.lineSeries = this.chart.addLineSeries({
          color: '#22C55E',
          lineWidth: 2,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });

        // Handle resize
        const resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (this.chart && width > 0 && height > 0) {
              this.chart.applyOptions({ width, height });
            }
          }
        });
        resizeObserver.observe(container);

        console.log('[OperationChart] Gráfico criado com sucesso');
      } catch (error) {
        console.error('[OperationChart] Erro ao criar gráfico:', error);
        setTimeout(() => this.initChart(), 200);
      }
    },

    async initConnection() {
      console.log('[OperationChart] Iniciando conexão WebSocket');

      // Buscar token
      this.token = this.getToken();
      if (!this.token) {
        console.error('[OperationChart] Token não encontrado');
        return;
      }

      const url = `${WS_URL}?app_id=${APP_ID}`;
      console.log('[OperationChart] Conectando a:', url);

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[OperationChart] WebSocket aberto');
        this.authorize();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onerror = (error) => {
        console.error('[OperationChart] Erro no WebSocket:', error);
      };

      this.ws.onclose = () => {
        console.log('[OperationChart] WebSocket fechado');
        this.isAuthorized = false;
      };
    },

    getToken() {
      // Tentar pegar o token do localStorage
      try {
        // Primeiro, tentar usar o accountLoginid da prop se disponível
        if (this.accountLoginid) {
          const tokensStr = localStorage.getItem('deriv_tokens_by_loginid');
          if (tokensStr) {
            const tokens = JSON.parse(tokensStr);
            if (tokens[this.accountLoginid]) {
              console.log('[OperationChart] Token encontrado para accountLoginid:', this.accountLoginid);
              return tokens[this.accountLoginid];
            }
          }
        }

        // Tentar pegar do snapshot de conexão
        const savedConnection = localStorage.getItem('deriv_connection');
        if (savedConnection) {
          const snapshot = JSON.parse(savedConnection);
          
          // Se há loginid no snapshot, usar o token correspondente
          if (snapshot.loginid && snapshot.tokensByLoginId && snapshot.tokensByLoginId[snapshot.loginid]) {
            console.log('[OperationChart] Token encontrado no snapshot para loginid:', snapshot.loginid);
            return snapshot.tokensByLoginId[snapshot.loginid];
          }
          
          // Se não, pegar o primeiro token disponível
          if (snapshot.tokensByLoginId) {
            const loginIds = Object.keys(snapshot.tokensByLoginId);
            if (loginIds.length > 0) {
              const token = snapshot.tokensByLoginId[loginIds[0]];
              console.log('[OperationChart] Token encontrado no snapshot (primeiro disponível)');
              return token;
            }
          }
        }

        // Tentar tokens_by_loginid direto
        const tokensStr = localStorage.getItem('deriv_tokens_by_loginid');
        if (tokensStr) {
          const tokens = JSON.parse(tokensStr);
          const loginIds = Object.keys(tokens);
          if (loginIds.length > 0) {
            // Priorizar contas demo (VRTC) se existirem
            const demoAccount = loginIds.find(id => id.startsWith('VRTC') || id.startsWith('VRT'));
            if (demoAccount) {
              console.log('[OperationChart] Token encontrado (conta demo):', demoAccount);
              return tokens[demoAccount];
            }
            
            // Senão, pegar o primeiro disponível
            const token = tokens[loginIds[0]];
            console.log('[OperationChart] Token encontrado em deriv_tokens_by_loginid');
            return token;
          }
        }

        console.warn('[OperationChart] Nenhum token encontrado');
        return null;
      } catch (error) {
        console.error('[OperationChart] Erro ao buscar token:', error);
        return null;
      }
    },

    authorize() {
      if (!this.token) {
        console.error('[OperationChart] Sem token para autorizar');
        return;
      }

      console.log('[OperationChart] Autorizando...');
      this.send({ authorize: this.token });
    },

    handleMessage(msg) {
      const msgType = msg.msg_type || msg.error?.code;
      console.log('[OperationChart] Mensagem recebida:', msgType);

      if (msgType === 'authorize') {
        if (msg.error) {
          console.error('[OperationChart] Erro na autorização:', msg.error);
          return;
        }
        this.isAuthorized = true;
        console.log('[OperationChart] Autorizado com sucesso');
        this.subscribeToSymbol();
      } else if (msgType === 'history') {
        this.handleHistory(msg);
      } else if (msgType === 'tick') {
        this.handleTick(msg);
      } else if (msg.error) {
        console.error('[OperationChart] Erro:', msg.error);
      }
    },

    subscribeToSymbol() {
      if (!this.isAuthorized || !this.selectedSymbol) {
        return;
      }

      console.log('[OperationChart] Inscrevendo-se no símbolo:', this.selectedSymbol);

      // Limpar dados anteriores
      this.ticks = [];
      if (this.lineSeries) {
        this.lineSeries.setData([]);
      }

      // Buscar histórico e inscrever para novos ticks
      this.send({
        ticks_history: this.selectedSymbol,
        adjust_start_time: 1,
        count: 500,
        end: 'latest',
        style: 'ticks',
        subscribe: 1,
      });
    },

    handleHistory(msg) {
      if (msg.error) {
        console.error('[OperationChart] Erro no histórico:', msg.error);
        return;
      }

      console.log('[OperationChart] Mensagem de histórico completa:', msg);

      let data = [];

      // Tentar diferentes formatos de resposta
      if (msg.history) {
        // Formato 1: history.times e history.prices
        if (msg.history.times && msg.history.prices) {
          const times = msg.history.times || [];
          const prices = msg.history.prices || [];
          
          data = times.map((time, index) => ({
            time: time,
            value: parseFloat(prices[index]),
          })).filter(d => d.time && !isNaN(d.value) && isFinite(d.value));
          
          console.log('[OperationChart] Histórico processado (formato times/prices):', data.length, 'pontos');
        }
        // Formato 2: history.candles
        else if (msg.history.candles && Array.isArray(msg.history.candles)) {
          data = msg.history.candles.map(candle => ({
            time: candle.epoch || candle.time,
            value: parseFloat(candle.close || candle.quote || candle.price),
          })).filter(d => d.time && !isNaN(d.value) && isFinite(d.value));
          
          console.log('[OperationChart] Histórico processado (formato candles):', data.length, 'pontos');
        }
        // Formato 3: array direto de ticks
        else if (Array.isArray(msg.history)) {
          data = msg.history.map(tick => ({
            time: tick.epoch || tick.time,
            value: parseFloat(tick.quote || tick.close || tick.price),
          })).filter(d => d.time && !isNaN(d.value) && isFinite(d.value));
          
          console.log('[OperationChart] Histórico processado (formato array):', data.length, 'pontos');
        }
      }
      // Formato alternativo: dados direto na raiz
      else if (Array.isArray(msg.candles)) {
        data = msg.candles.map(candle => ({
          time: candle.epoch || candle.time,
          value: parseFloat(candle.close || candle.quote || candle.price),
        })).filter(d => d.time && !isNaN(d.value) && isFinite(d.value));
        
        console.log('[OperationChart] Histórico processado (formato candles direto):', data.length, 'pontos');
      }

      if (data.length > 0 && this.lineSeries) {
        this.lineSeries.setData(data);
        this.ticks = [...data];
        this.chart.timeScale().fitContent();
        console.log('[OperationChart] ✓ Gráfico atualizado com histórico:', data.length, 'pontos');
      } else {
        console.warn('[OperationChart] Nenhum dado válido encontrado no histórico');
      }

      // Armazenar subscription ID
      if (msg.subscription) {
        this.subscriptionId = msg.subscription.id;
        console.log('[OperationChart] Subscription ID:', this.subscriptionId);
      }
    },

    handleTick(msg) {
      if (msg.error) {
        console.error('[OperationChart] Erro no tick:', msg.error);
        return;
      }

      if (!msg.tick || msg.tick.quote === undefined) {
        return;
      }

      const tick = {
        time: msg.tick.epoch || msg.tick.time,
        value: parseFloat(msg.tick.quote),
      };

      if (!tick.time || isNaN(tick.value) || !isFinite(tick.value)) {
        return;
      }

      // Adicionar novo ponto ao gráfico
      if (this.lineSeries) {
        this.lineSeries.update(tick);
        this.ticks.push(tick);
        
        // Manter apenas os últimos 1000 ticks
        if (this.ticks.length > 1000) {
          this.ticks.shift();
        }

        // Atualizar visualmente o gráfico
        if (this.ticks.length % 10 === 0) {
          this.chart.timeScale().fitContent();
        }
      }
    },

    onSymbolChange() {
      console.log('[OperationChart] Símbolo alterado para:', this.selectedSymbol);
      
      // Limpar dados antigos
      this.ticks = [];
      if (this.lineSeries) {
        this.lineSeries.setData([]);
      }

      // Se já está autorizado, inscrever no novo símbolo
      if (this.isAuthorized) {
        this.subscribeToSymbol();
      }
    },

    send(payload) {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.error('[OperationChart] WebSocket não está aberto');
        return;
      }

      console.log('[OperationChart] Enviando:', payload);
      this.ws.send(JSON.stringify(payload));
    },

    disconnect() {
      if (this.ws) {
        if (this.subscriptionId) {
          this.send({ forget: this.subscriptionId });
        }
        this.ws.close();
        this.ws = null;
      }
    },
  },
};
</script>

<style scoped>
.operation-chart-wrapper {
  width: 100%;
  height: 100%;
}

.connection-loading-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #0B0B0B;
  border-radius: 12px;
}

.loading-indicator-wrapper {
  text-align: center;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(34, 197, 94, 0.2);
  border-top-color: #22C55E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-message {
  color: #DFDFDF;
  font-size: 14px;
}

.operation-layout {
  display: flex;
  gap: 20px;
  width: 100%;
}

.col-chart {
  flex: 1;
}

.chart-container {
  position: relative;
}
</style>