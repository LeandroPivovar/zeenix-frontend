<template>
    <div class="main-container">
        <div class="flex-row-gap">
            
            <div class="col-left">
                
                <div class="card">
                    <h3 class="card-header space-between">
                        Saldo da Conta 
                        <span class="status-time status-green">🟢 2h 13m</span>
                    </h3>
                    <p class="account-balance space-between">
                        <span>{{ accountBalance }}</span> 
                        <span class="balance-change status-green">+R$ 127.30</span>
                    </p>
                    <p class="text-small-opacity">A IA está operando com estabilidade - dados atualizados em tempo real.</p>
                </div>

                <div class="card">
                    <h3 class="card-header">Configuração Atual</h3>
                    <ul class="list-config">
                        <li class="list-item"><span>Mercado:</span> <span class="text-bold-white">V100</span></li>
                        <li class="list-item"><span>Modelo:</span> <span class="text-bold-green">Orion V2</span></li>
                        <li class="list-item"><span>Entrada:</span> <span class="text-bold-white">R$ 30 (0.3%)</span></li>
                        <li class="list-item"><span>Take Profit:</span> <span class="status-green">R$ 100 (0.9%)</span></li>
                        <li class="list-item"><span>Stop Loss:</span> <span class="status-red">R$ 25 (0.1%)</span></li>
                    </ul>
                </div>

                <div class="card">
                    <h3 class="card-header">Parâmetros de Risco</h3>

                    <div class="risk-bar-container">
                        <div class="risk-pointer"></div>
                    </div>
                    <div class="risk-labels">
                        <span class="status">Conservador</span>
                        <span class="status">Moderado</span>
                        <span class="status">Agressivo</span>
                    </div>
                    <div class="risk-stats">
                        <span>Expectativa: <br><span class="status-green">+0.9% / sessão</span></span>
                        <span>Stop Acumulado: <br> <span class="status-red">-R$ 15</span></span>
                    </div>
                    <p class="text-small-center">O equilíbrio entre segurança e o resultado é ideal.</p>
                </div>

                <div class="card">
                    <h3 class="card-header space-between">
                        Status da Ordem
                        <span class="text-bold-yellow">00:08</span>
                    </h3>
                    <div class="order-status-labels">
                        <span>Iniciado</span>
                        <span class="status-yellow">Analisando</span>
                        <span>Finalizado</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill-yellow"></div>
                    </div>
                    <p class="order-analysis">Analisando padrões...</p>
                    <div class="order-detail">
                        <span>Tipo:</span>
                        <span class="order-type-buy">COMPRAR ⬆️</span>
                    </div>
                    <div class="order-detail margin-top-5">
                        <span>Valor:</span>
                        <span class="text-bold-white">R$ 30,00</span>
                    </div>

                    <p class="text-micro-opacity">A IA Orion está processando este estudo em tempo real</p>

                </div>

            </div>

            <div class="col-middle">
                
                <div class="card full-height">
                    <h3 class="card-header">Últimos 20 Dígitos</h3>
                    <div class="digit-list">
                        <span v-for="(digit, index) in last20Digits.slice(0, 19)" :key="'d1'+index" class="digit-item">{{ digit }}</span>
                        <span class="digit-item-active">{{ last20Digits[19] }}</span>
                    </div>
                    <p class="digit-repetition">{{ currentRepetition }}</p>
                    
                    <div class="volatility-analysis-placeholder">
                        <p class="text-placeholder">Análise de Volatilidade de Dígitos (Gráfico Oculto)</p>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-header">Paridade</h3>
                    
                    <div class="parity-section">
                        <div class="parity-info">
                            <p class="parity-label">Pares</p>
                            <div class="parity-bar-bg margin-top-5">
                                <div class="parity-bar-purple-52"></div>
                            </div>
                        </div>
                        <span class="parity-percentage text-bold-purple">52%</span>
                    </div>

                    <div class="parity-section margin-top-10">
                        <div class="parity-info">
                            <p class="parity-label">Ímpares</p>
                            <div class="parity-bar-bg margin-top-5">
                                <div class="parity-bar-red-48"></div>
                            </div>
                        </div>
                        <span class="parity-percentage text-bold-red">48%</span>
                    </div>

                    <p class="parity-trend-green">Tendência: favorecendo pares</p>
                    <p class="text-micro-opacity margin-top-5">"Paridade limpa" — equilíbrio traz previsibilidade.</p>
                </div>
            </div>

            <div class="col-right">
                
                <div class="card">
                    <h3 class="card-header">Frequência por Dígito</h3>
                    <div class="frequency-list">
                        <div v-for="item in digitFrequencies" :key="item.digit" class="frequency-item">
                            <span class="digit-label">{{ item.digit }}</span>
                            <div class="frequency-bar-bg">
                                <div :class="`frequency-bar frequency-bar-color-${item.digit}`" :style="{ width: item.percentage + '%' }"></div>
                            </div>
                            <span :class="['frequency-percentage', {'status-green': item.digit === 7}, {'status-yellow': item.digit === 1}]">{{ item.percentage }}%</span>
                        </div>
                    </div>
                    <p class="text-micro-opacity-border-top">Linha cinza marca a faixa neutra (10%)</p>
                </div>
                <div class="card">
                    <h3 class="card-header">Sequência & Retenção</h3>
                    
                    <div class="sequence-stats">
                        <span>Hold</span>
                        <span class="status">65%</span>
                    </div>
                    <div class="progress-bar-container margin-bottom-10">
                        <div class="progress-bar-hold" :style="{ width: '65%' }"></div>
                        <div class="progress-bar-hold-yellow" :style="{ width: '35%' }"></div>
                    </div>
                    
                    <div class="sequence-stats">
                        <span>Break</span>
                        <span class="statu">35%</span>
                    </div>
                    
                    <div class="sequence-dots">
                        <span v-for="n in 3" :key="'dot'+n" class="dot-green"></span>
                        <span v-for="n in 2" :key="'dotL'+n" class="dot"></span>
                    </div>

                    <p class="sequence-trend">Mercado em sequência forte.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OperationDigits',
    props: {
        accountBalance: { type: String, required: true },
        orderConfig: { type: Object, required: true },
        lastOrders: { type: Array, required: true }
    },
    data() {
        return {
            last20Digits: [3, 7, 2, 9, 1, 7, 7, 4, 8, 6, 2, 5, 9, 3, 1, 7, 4, 6, 8, 2],
        }
    },
    computed: {
        digitFrequencies() {
            const counts = new Array(10).fill(0);
            const totalDigits = this.last20Digits.length;

            this.last20Digits.forEach(digit => {
                if (digit >= 0 && digit <= 9) {
                    counts[digit]++;
                }
            });

            return counts.map((count, index) => {
                const percentage = (count / totalDigits) * 100;
                return {
                    digit: index,
                    percentage: Math.round(percentage)
                };
            });
        },
        currentRepetition() {
            const counts = new Array(10).fill(0);
            this.last20Digits.forEach(digit => {
                if (digit >= 0 && digit <= 9) {
                    counts[digit]++;
                }
            });

            let maxCount = 0;
            let maxDigit = -1;

            for (let i = 0; i < counts.length; i++) {
                if (counts[i] > maxCount) {
                    maxCount = counts[i];
                    maxDigit = i;
                }
            }
            
            if (maxDigit !== -1) {
                return `Repetição atual: ${maxCount}x dígito ${maxDigit}`;
            }
            return 'Repetição atual: 0x';
        }
    }
}
</script>

<style src="../assets/css/components/OperationDigits.css"></style>
