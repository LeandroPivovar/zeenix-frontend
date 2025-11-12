<template>
    <div class="layout">

        <header>
            <button class="back-button" @click="$router.push('/dashboard')">
                <img src="../assets/icons/back.svg" alt="">Voltar
            </button>

            <div class="header-right">
                <template v-if="showPerformanceHeader">
                    <div class="status-indicator">
                        <span class="dot green"></span>
                        Conectado
                    </div>
                    <div class="account">
                        <img src="../assets/icons/people.svg" alt="">
                        Conta Real
                    </div>
                </template>
                <template v-else-if="showHistoryHeader">
                    <div class="user-saldo">
                        <span>{{ historyData.traderName }}</span>
                        <span class="saldo-valor"> ${{ accountPerformance.balance || 10249.55 }}</span>
                    </div>
                </template>
            </div>
        </header>

        <main class="copy-trading-content">
            <CopyTradingComponent
                v-if="showPerformance"
                :performance-data="performanceData"
                @navigate-to-history="showPerformance = false; showHistory = true; updateHeaders()"
                @navigate-to-performance="showPerformance = true; showHistory = false; updateHeaders()"
            />

            <CopyHistory
                v-else-if="showHistory"
                :trader-name="historyData.traderName"
                :operations="historyData.operations"
                :trader-active="traderActive"
                :account-performance="accountPerformance"
                @navigate-to-performance="showHistory = false; showPerformance = true; updateHeaders()"
                @navigate-to-history="showHistory = true; showPerformance = false; updateHeaders()"
            />
        </main>
    </div>
</template>

<script>
import CopyTradingComponent from '../components/copy/CopyTradingComponent.vue'
import CopyHistory from '../components/copy/CopyHistory.vue'

export default {
    name: 'CopyTrading',
    components: { CopyTradingComponent, CopyHistory },
    data() {
        return {
            showPerformance: true,
            showHistory: false,   
            performanceData: {
                dailyProfit: '+R$ 1.247,50 (+2.8%)',
                totalBalance: 'R$ 45.680,00',
                traderStats: { roi: '45%', dd: '8%', followers: '1.2k' },
                copyMode: 'Proporção (%) do saldo',
                allocation: '1:1',
                stopLoss: '$100',
                takeProfit: '$200',
                blindStop: false,
                chartData: [],
                dailyResults: [
                    { date: '16/10', profit: '+R$ 67,00', percent: '+1,3%', result: 'Lucro' },
                    { date: '15/10', profit: '+R$ 89,50', percent: '+1,7%', result: 'Lucro' },
                    { date: '14/10', profit: '+R$ 45,00', percent: '+0,8%', result: 'Lucro' },
                    { date: '13/10', profit: '-R$ 12,00', percent: '-0,2%', result: 'Perda' }
                ],
                summary: {
                    totalReturn: '+22,5% desde o início',
                    winRate: '78% das operações',
                    maxDrawdown: '-6,8% de redução',
                    profitableDays: '14 dias com ganho',
                    activeTime: '18 dias operando'
                },
                copyStatus: {
                    isCopying: true,
                    lastUpdate: 'há 3 minutos',
                    trader: 'trademaster',
                    allocation: '15% (R$ 781,50)',
                    operationsToday: '3 executadas'
                }
            },

            historyData: {
                traderName: 'John Doe',
                operations: [
                    { time: '14:33', type: 'Copiado', action: 'Buy', stake: '50', result: '+4.50' },
                    { time: '13:58', type: 'Copiado', action: 'Sell', stake: '20', result: '-20.00' },
                    { time: '11:21', type: 'Manual', action: 'Higher', stake: '10', result: '+88.50' },
                    { time: '10:45', type: 'Copiado', action: 'Lower', stake: '10', result: '+8.70' },
                    { time: '09:12', type: 'Copiado', action: 'Buy', stake: '50', result: '-5.00' }
                ]
            },

            traderActive: {
                name: 'IA Orion V2',
                status: 'Ativo',
                trader: 'John Doe',
                roi: '+45%',
                drawdown: '8%'
            },

            accountPerformance: {
                accumulatedProfit: '+R$1.247,50',
                roiTotal: '+2.8%',
                operations: '121',
                activeDays: '7',
                balance: 10249.55
            }
        }
    },
    computed: {
        showPerformanceHeader() {
            return this.showPerformance;
        },
        showHistoryHeader() {
            return this.showHistory;
        }
    },
    mounted() {
        this.updateHeaders();
    },
    methods: {
        updateHeaders() {
        }
    }
}
</script>

<style scoped>
.layout {
    background-color: #121212;
    min-height: 100vh;
}

header {
    height: 60px;
    background-color: #1e1e1e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    z-index: 10;
    border-bottom: 1px solid #333;
}

header img {
    width: 20px;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #ffffff;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
}

.copy-active-header {
    text-align: center;
}

.copy-active-header span {
    font-size: 1.1rem;
    color: #00ff80;
    font-weight: bold;
    display: block;
}

.copy-active-header p {
    font-size: 0.8rem;
    color: #a0a0a0;
    margin: 5px 0 0 0;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.status-indicator {
    display: flex;
    align-items: center;
    color: #00ff80;
    gap: 5px;
    font-weight: 500;
}

.dot {
    width: 8px;
    height: 8px;
    background-color: #00ff80;
    border-radius: 50%;
}

.account {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    color: #ffffff;
}

.user-saldo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #a0a0a0;
}

.saldo-valor {
    color: #00ff80;
    font-weight: bold;
}

.copy-trading-content {
    padding: 20px;
}

</style>