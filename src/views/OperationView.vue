<template>
    <div class="layout">
        <div class="sidebar" :class="{ 'is-open': isMobileMenuOpen }">
            <div class="buttons">
                <button
                    @click="changeView('OperationChart')"
                    class="view-button"
                    :class="{ 'active-view': currentView === 'OperationChart' }"
                >
                    <span>Graficos</span>
                </button>
                <button
                    @click="changeView('OperationDigits')"
                    class="view-button"
                    :class="{ 'active-view': currentView === 'OperationDigits' }"
                >
                    <span>Digitos</span>
                </button>
                <button class="back-btn-mobile view-button" @click="$router.push('/dashboard')">Voltar</button>

            </div>
        </div>

        
        <div class="header-operation">

            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="hamburger-btn">
                &#9776;
            </button>

            <button @click="$router.push('/dashboard')" class="back-btn">
                <span class="back-icon-desk"> <img src="../assets/icons/back.svg" alt="" width="20px"></span>
            </button>

            <div class="header-title">
                <span class="title-text">
                    Operação Manual
                </span>
            </div>
            <div class="header-status">
                {{ currentView === 'OperationChart' ? `$${accountBalance.replace('R$ ', '').replace(',', '.')}` : '🟢 IA Ativa' }}
            </div>
        </div>
        <div class="main-container">
            <div class="layout-operation">

                <main class="operation-content">

                    <div class="components-content">
                        <component
                            :is="currentView"
                            :account-balance="accountBalance"
                            :order-config="orderConfig"
                            :last-orders="lastOrdersFormatted"
                            @execute-trade="handleTradeExecution"
                        ></component>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import OperationChart from '../components/OperationChart.vue'
import OperationDigits from '../components/OperationDigits.vue'

export default {
    name: 'OperationView',
    components: {
        OperationChart,
        OperationDigits
    },
    data() {
        return {
            currentView: 'OperationChart',
            accountBalance: 'R$ 10.247,32',
            orderConfig: {
                type: 'Up/Down',
                time: '1 Minuto',
                value: 10.00,
            },
            lastOrders: [
                { time: '10:19:12', type: 'BUY', value: 1.00, result: 'WIN' },
                { time: '10:17:45', type: 'BUY', value: 5.95, result: 'LOSS' },
                { time: '10:05:21', type: 'SELL', value: 1.20, result: 'WIN' }
            ],
            isMobileMenuOpen: false,
        }
    },
    computed: {
        lastOrdersFormatted() {
            return this.lastOrders.map(order => ({
                ...order,
                value: order.value.toFixed(2),
            }));
        }
    },
    methods: {
        changeView(componentName) {
            this.currentView = componentName
            this.isMobileMenuOpen = false; 
        },
        handleTradeExecution(tradeData) {
            const isWin = Math.random() < 0.55;
            const tradeValue = tradeData.config.value;
            const payoutRate = 0.85;

            const netChange = isWin ? (tradeValue * payoutRate) : (-tradeValue);

            const newOrder = {
                time: tradeData.timestamp,
                type: tradeData.type,
                value: tradeValue,
                result: isWin ? 'WIN' : 'LOSS',
            };

            this.lastOrders.unshift(newOrder);
            this.lastOrders = this.lastOrders.slice(0, 5);

            const currentBalanceNumeric = parseFloat(this.accountBalance.replace(/[^0-9,-]/g, '').replace(',', '.'));
            const newBalanceNumeric = currentBalanceNumeric + netChange;

            this.accountBalance = `R$ ${newBalanceNumeric.toFixed(2).replace('.', ',')}`;

            alert(`Ordem de ${tradeData.type} executada. Resultado: ${isWin ? 'GANHO' : 'PERDA'}. Saldo Atual: ${this.accountBalance}`);
        }
    }
}
</script>

<style src="../assets/css/views/operationView.css"></style>