<template>
    <div class="layout">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />
        
        <div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>

        <main class="copy-trading-content loading-content" v-if="loading" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <div class="background-glow"></div>
            <div class="background-grid"></div>
            <div class="loading-spinner"></div>
            <p class="loading-text">Carregando dados do Copy Trading...</p>
        </main>

        <main class="copy-trading-content" v-else :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <div class="background-glow"></div>
            <div class="background-grid"></div>
            <CopyTradingComponent
                v-if="showPerformance"
                :performance-data="performanceData"
                @navigate-to-history="showPerformance = false; showHistory = true; updateHeaders()"
                @navigate-to-performance="showPerformance = true; showHistory = false; updateHeaders()"
                @copy-activated="handleCopyActivated"
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
import AppSidebar from '../components/Sidebar.vue'
import CopyTradingComponent from '../components/copy/CopyTradingComponent.vue'
import CopyHistory from '../components/copy/CopyHistory.vue'

export default {
    name: 'CopyTrading',
    components: { AppSidebar, CopyTradingComponent, CopyHistory },
    data() {
        return {
            loading: true,
            isSidebarOpen: false,
            isSidebarCollapsed: false,
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
    mounted() {
        this.updateHeaders();
        // Simular carregamento de dados
        setTimeout(() => {
            this.loading = false;
        }, 1500);
    },
    methods: {
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        handleHamburgerClick() {
            if (this.isSidebarCollapsed) {
                this.isSidebarCollapsed = false;
            } else {
                this.isSidebarOpen = true;
            }
        },
        updateHeaders() {
        },
        handleCopyActivated() {
            // Quando o copy é ativado, manter na tela de performance
            this.showPerformance = true;
            this.showHistory = false;
            // Atualizar dados se necessário
            this.loadCopyTradingData();
        },
        async loadCopyTradingData() {
            // Carregar dados atualizados do copy trading
            // Esta função pode ser expandida para buscar dados reais da API
        }
    }
}
</script>

<style scoped>
.layout {
    background-color: #121212;
    min-height: 100vh;
    display: flex;
}

.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
}

.copy-trading-content {
    flex: 1;
    padding: 20px;
    margin-left: 0;
    transition: margin-left 0.3s ease;
    position: relative;
    overflow: hidden;
}

.copy-trading-content.sidebar-collapsed {
    margin-left: 0;
}

.loading-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #06d6a0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    font-weight: 400;
}

@media (min-width: 769px) {
    .copy-trading-content {
    }
    
    .copy-trading-content.sidebar-collapsed {
        margin-left: 80px;
    }
}

.background-glow {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
        radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
        radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
        rgba(9, 10, 12, 0.95);
    z-index: -2;
    pointer-events: none;
}

.background-grid {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    z-index: -1;
    opacity: 0.6;
    pointer-events: none;
    animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
    0% {
        background-position: 0 0, 0 0;
    }
    100% {
        background-position: -48px -48px, -48px -48px;
    }
}

</style>