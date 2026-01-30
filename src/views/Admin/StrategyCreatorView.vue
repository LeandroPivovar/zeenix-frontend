<template>
    <div class="dashboard-layout">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            :is-mobile="isMobile" 
            @close-sidebar="isSidebarOpen = false" 
            @toggle-collapse="toggleSidebarCollapse" 
            @open-settings="showSettingsModal = true" 
        />

        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="layout-content">
                <div class="strategy-creator-view max-w-4xl mx-auto">
                    <header class="mb-8">
                        <h1 class="text-3xl font-bold text-white mb-2">Criador de Estratégias</h1>
                        <p class="text-gray-400">Configure e inicie uma nova estratégia automatizada.</p>
                    </header>

                    <form @submit.prevent="submitForm" class="space-y-6">
                        <!-- Mercado Section -->
                        <div class="form-group">
                            <label class="block text-white font-bold mb-2">Mercado</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fa-solid fa-chart-bar text-gray-500"></i>
                                </div>
                                <select 
                                    v-model="form.market" 
                                    @change="onMarketChange"
                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-zenix-green transition-colors appearance-none"
                                >
                                    <option value="" disabled>Selecione um mercado</option>
                                    <option v-for="market in markets" :key="market.symbol" :value="market.symbol">
                                        {{ market.displayName }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                </div>
                            </div>
                            <p v-if="selectedMarketDescription" class="mt-2 text-zenix-green text-sm">
                                {{ selectedMarketDescription }}
                            </p>
                        </div>

                        <!-- Tipo de Negociação -->
                        <div class="form-group">
                            <label class="block text-white font-bold mb-2">Tipo de Negociação</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fa-solid fa-layer-group text-gray-500"></i>
                                </div>
                                <select 
                                    v-model="form.tradeType" 
                                    :disabled="!contracts.length"
                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-zenix-green transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="" disabled>Selecione o tipo</option>
                                    <option v-for="contract in contracts" :key="contract.contractType" :value="contract.contractType">
                                        {{ contract.contractDisplay || contract.contractType }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Duração, Unidade, Multiplicador -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-white font-bold mb-2">Duração</label>
                                <input 
                                    type="number" 
                                    v-model.number="form.duration" 
                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label class="block text-white font-bold mb-2">Unidade</label>
                                <div class="relative">
                                    <select 
                                        v-model="form.durationUnit" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                    >
                                        <option value="t">Tique</option>
                                        <option value="s">Segundos</option>
                                        <option value="m">Minutos</option>
                                        <option value="h">Horas</option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-white font-bold mb-2">Multiplicador</label>
                                <input 
                                    type="number" 
                                    v-model.number="form.multiplier" 
                                    step="0.1" 
                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                />
                            </div>
                        </div>

                        <!-- Configurações Virtuais -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-white font-bold mb-2">Perdas virtuais</label>
                                <input 
                                    type="number" 
                                    v-model.number="form.virtualLosses" 
                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label class="block text-white font-bold mb-2">Negociações virtuais</label>
                                <div class="relative">
                                    <select 
                                        v-model="form.virtualTradeAction" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                    >
                                        <option value="loss">Na perda</option>
                                        <option value="win">Na vitória</option>
                                        <option value="always">Sempre</option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label class="block text-white font-bold mb-2">Iniciar com virtuais</label>
                                <div class="relative">
                                    <select 
                                        v-model="form.startWithVirtual" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                    >
                                        <option :value="true">Sim</option>
                                        <option :value="false">Não</option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Valores Monetários -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-white font-bold mb-2">Quantia inicial</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold">Ð</span>
                                    <input 
                                        type="number" 
                                        v-model.number="form.initialStake" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                        step="0.01"
                                    />
                                </div>
                                <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.initialStake) }}% do saldo</p>
                            </div>
                            <div>
                                <label class="block text-white font-bold mb-2">Lucro alvo</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold">Ð</span>
                                    <input 
                                        type="number" 
                                        v-model.number="form.takeProfit" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                        step="0.01"
                                    />
                                </div>
                                <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.takeProfit) }}% do saldo</p>
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-2">
                                    <label class="block text-white font-bold">Limite de perda</label>
                                    <i class="fa-solid fa-gear text-gray-400 cursor-pointer hover:text-white transition-colors"></i>
                                </div>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold">Ð</span>
                                    <input 
                                        type="number" 
                                        v-model.number="form.stopLoss" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                        step="0.01"
                                    />
                                </div>
                                <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.stopLoss) }}% do saldo</p>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="pt-6">
                            <button 
                                type="submit" 
                                class="w-full bg-zenix-green hover:bg-green-600 text-black font-bold text-lg py-4 rounded-lg flex justify-center items-center gap-3 transition-colors shadow-lg hover:shadow-zenix-green/20"
                            >
                                <i class="fa-solid fa-play"></i>
                                <span>Iniciar Robô</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>

        <SettingsSidebar 
            :is-open="showSettingsModal" 
            @close="showSettingsModal = false" 
        />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';

export default {
    name: 'StrategyCreatorView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar
    },
    data() {
        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
            markets: [],
            contracts: [],
            form: {
                market: '',
                tradeType: '',
                duration: 1,
                durationUnit: 't',
                multiplier: 2.2,
                virtualLosses: 0,
                virtualTradeAction: 'loss',
                startWithVirtual: true,
                initialStake: 1,
                takeProfit: 20,
                stopLoss: 1000
            },
            balance: 5889.28 // Mock implementation or fetch from store
        }
    },
    computed: {
        selectedMarketDescription() {
            // This is a placeholder as the API might not return this description directly
            // In a real scenario, this could be mapped or fetched
            if (this.form.market === 'R_100') return 'Volatilidade constante de 100% com um tique a cada 2 segundos';
            return '';
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.fetchMarkets();
        // this.fetchBalance(); // Implement real balance fetching
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth < 1024;
            if (this.isMobile) {
                this.isSidebarOpen = false;
            }
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        async fetchMarkets() {
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    this.markets = await res.json();
                }
            } catch (error) {
                console.error('Erro ao buscar mercados:', error);
                this.$root.$toast.error('Erro ao carregar mercados');
            }
        },
        async onMarketChange() {
            if (!this.form.market) return;
            
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets/${this.form.market}/contracts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    this.contracts = await res.json();
                    if (this.contracts.length > 0) {
                        this.form.tradeType = this.contracts[0].contractType;
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar contratos:', error);
                this.$root.$toast.error('Erro ao carregar contratos do mercado');
            }
        },
        calculatePercentage(value) {
            if (!value || !this.balance) return '0.00';
            return ((value / this.balance) * 100).toFixed(2);
        },
        submitForm() {
            console.log('Strategy Config:', this.form);
            this.$root.$toast.success('Robô iniciado com sucesso! (Simulação)');
        }
    }
}
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0B0B0B;
    color: #fff;
    font-family: 'Roboto', sans-serif;
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.dashboard-content-wrapper {
    flex-grow: 1;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 50px;
    padding-bottom: 40px;
    background-color: #0B0B0B;
    width: 100%;
    overflow-y: auto;
}

@media (max-width: 1024px) {
    .dashboard-content-wrapper { margin-left: 0; }
    .dashboard-content-wrapper.sidebar-collapsed { margin-left: 0; }
    .layout-content { padding-top: 70px; }
}
</style>
