<template>
    <div class="operation-chart-wrapper">
        
        <div class="col-chart">
            
            <div class="chart-box">
                
                <div class="chart-data-wrapper">
                    <div 
                        v-for="(candle, index) in chartData" 
                        :key="index" 
                        :class="['candle', candle.isWin ? 'candle-green' : 'candle-red']" 
                        :style="{ height: (candle.height * 3) + 'px' }"
                    >
                        <span v-if="candle.value" :class="['candle-value-text', candle.isWin ? 'text-green' : 'text-red']">
                            {{ candle.isWin ? `+$${candle.value.toFixed(2)}` : `-$${candle.value.toFixed(2)}` }}
                        </span>
                    </div>
                </div>

                <div class="signal-card">
                    <div class="signal-header-text">
                        <span class="ia-status-small">🟢 IA ORION</span>
                        <span class="signal-active-status">SINAL ATIVO</span>
                    </div>
                    <div class="signal-recommendation">RECOMENDAÇÃO</div>
                    <div class="signal-action-buy">
                        <span class="signal-action-text">⬆️ COMPRAR</span>
                    </div>
                    <p class="signal-trend-force">Força da Tendência: **82%**</p>
                    <p class="signal-expiration">Expira em **00:09s**</p>
                </div>
            </div>
            
            <p class="chart-footer-info">
                A IA Orion utiliza análise de 3.5M de pontos de dados históricos para fornecer sinais de alto precisão. Opere com responsabilidade.
            </p>
        </div>

        <div class="col-sidebar">
            
            <div class="card-order-config">
                <h4 class="card-title">Configuração da Ordem</h4>
                
                <div class="input-group">
                    <label class="input-label">Tipo de contrato</label>
                    <select v-model="localOrderConfig.type" class="select-field" :disabled="isTrading">
                        <option value="Up/Down">Up/Down</option>
                        <option value="Digital">Digital</option>
                    </select>
                </div>
                
                <div class="input-row-flex">
                    <div class="input-group-half">
                        <label class="input-label">Tipo de tempo</label>
                        <div class="toggle-buttons">
                            <button @click="setTradeType('Minutos')" :class="{ 'toggle-active': localOrderConfig.timeType === 'Minutos' }" :disabled="isTrading">Minutos</button>
                            <button @click="setTradeType('Ticks')" :class="{ 'toggle-active': localOrderConfig.timeType === 'Ticks' }" :disabled="isTrading">Ticks</button>
                        </div>
                    </div>
                    <div class="input-group-half">
                        <label class="input-label">Duração</label>
                        <select v-model="localOrderConfig.time" class="select-field" :disabled="isTrading">
                            <option>1 Minuto</option>
                            <option>1 Tick</option>
                        </select>
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Multiplicador</label>
                    <select v-model="localOrderConfig.multiplier" class="select-field" :disabled="isTrading">
                        <option value="x2">x2</option>
                        <option value="x5">x5</option>
                    </select>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Valor da entrada ($)</label>
                    <input type="number" v-model.number="localOrderConfig.value" class="input-field-value" :disabled="isTrading" />
                </div>

                <div class="action-buttons-group">
                    <button @click="executeTrade('BUY')" class="btn-action btn-buy" :disabled="isTrading">BUY</button>
                    <button @click="executeTrade('SELL')" class="btn-action btn-sell" :disabled="isTrading">SELL</button>
                </div>
                <button @click="executeTrade('EXECUTE')" class="btn-execute-operation" :disabled="isTrading">
                    {{ isTrading ? 'Aguardando Resultado...' : 'Executar Operação' }}
                </button>
            </div>

            <div class="card-last-orders">
                <h4 class="card-title">Últimas Ordens</h4>
                
                <div class="orders-table-header">
                    <span>Hora</span>
                    <span>Tipo</span>
                    <span>Resultado</span>
                </div>

                <div class="orders-list-scroll">
                    <div v-for="(order, index) in lastOrders" :key="index" class="order-row">
                        <span class="order-col">{{ order.time || 'N/A' }}</span>
                        <span class="order-col order-type-text">{{ order.type }}</span>
                        <span class="order-col order-result-text" :class="{ 'win': order.result === 'WIN', 'loss': order.result === 'LOSS' }">{{ order.result === 'WIN' ? `+$${order.value}` : `-$${order.value}` }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OperationChart',
    props: {
        accountBalance: { type: String, required: true },
        orderConfig: { type: Object, required: true },
        lastOrders: { 
            type: Array, 
            required: true,
            default: () => [
                { time: '10:19:12', type: 'BUY', result: 'WIN', value: '1.00' },
                { time: '10:17:45', type: 'BUY', result: 'LOSS', value: '5.95' },
                { time: '10:05:21', type: 'SELL', result: 'WIN', value: '1.20' },
            ]
        }
    },
    data() {
        return {
            localOrderConfig: {
                type: 'Up/Down',
                timeType: 'Minutos', 
                time: '1 Minuto',
                multiplier: 'x2',
                value: 10.00,
            },
            chartData: [], 
            isTrading: false 
        }
    },
    methods: {
        setTradeType(type) {
            this.localOrderConfig.timeType = type;
            this.localOrderConfig.time = (type === 'Ticks') ? '1 Tick' : '1 Minuto';
        },
        executeTrade(tradeType) {
            console.log(`Executing trade: ${tradeType}`);

            const isWin = Math.random() > 0.5;
            const result = isWin ? 'WIN' : 'LOSS';

            const tradeValue = isWin 
                ? (Math.random() * 4 + 1) 
                : this.localOrderConfig.value; 

            const newCandle = {
                height: Math.floor(Math.random() * 50) + 20, 
                isWin: isWin, 
                value: tradeValue
            };

            this.chartData.push(newCandle); 

            this.$emit('execute-trade', {
                type: tradeType, 
                config: this.localOrderConfig,
                result: result, 
                value: tradeValue.toFixed(2), 
                timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
        }
    },
    mounted() {
        if (this.orderConfig && this.orderConfig.value !== undefined) {
            this.localOrderConfig.value = this.orderConfig.value;
        }
    }
}
</script>

<style src="../assets/css/components/OperationCharts.css"></style>