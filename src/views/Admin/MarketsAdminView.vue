<template>
    <div class="dashboard-layout">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @close-sidebar="isSidebarOpen = false" @toggle-collapse="toggleSidebarCollapse" @open-settings="showSettingsModal = true" />

        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="layout-content">
                <div class="admin-markets-view">
                    <div class="flex justify-between items-center mb-6">
                        <div class="main-header-left">
                            <h1 class="text-2xl font-bold text-white mb-2">Gerenciar Mercados</h1>
                            <p class="text-gray-400 text-sm">Sincronize e visualize os mercados disponíveis na Deriv.</p>
                        </div>
                        <button 
                            @click="syncMarkets" 
                            :disabled="loading"
                            class="bg-zenix-green hover:bg-green-600 text-black font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
                            <span>{{ loading ? 'Sincronizando...' : 'Sincronizar com Deriv' }}</span>
                        </button>
                    </div>

                    <div class="bg-[#1E1E1E] rounded-lg shadow-lg overflow-hidden border border-[#333]">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-[#2a2a2a] text-gray-400 text-sm uppercase">
                                        <th class="p-4 font-semibold border-b border-[#333]">Símbolo</th>
                                        <th class="p-4 font-semibold border-b border-[#333]">Nome</th>
                                        <th class="p-4 font-semibold border-b border-[#333]">Mercado</th>
                                        <th class="p-4 font-semibold border-b border-[#333]">Submercado</th>
                                        <th class="p-4 font-semibold border-b border-[#333] text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="text-gray-300 text-sm">
                                    <tr v-if="markets.length === 0 && !fetching" class="hover:bg-[#252525] transition-colors">
                                        <td colspan="5" class="p-8 text-center text-gray-500">
                                            Nenhum mercado encontrado. Clique em sincronizar.
                                        </td>
                                    </tr>
                                    <tr v-else-if="fetching" class="hover:bg-[#252525] transition-colors">
                                        <td colspan="5" class="p-8 text-center text-gray-500">
                                            Carregando mercados...
                                        </td>
                                    </tr>
                                    <tr 
                                        v-for="market in markets" 
                                        :key="market.id" 
                                        class="border-b border-[#333] hover:bg-[#252525] transition-colors"
                                    >
                                        <td class="p-4 font-mono text-zenix-green">{{ market.symbol }}</td>
                                        <td class="p-4 font-medium">{{ market.displayName }}</td>
                                        <td class="p-4 text-gray-400">{{ market.marketDisplayName || market.market }}</td>
                                        <td class="p-4 text-gray-400">{{ market.submarketDisplayName || market.submarket }}</td>
                                        <td class="p-4 text-center">
                                            <span 
                                                class="px-2 py-1 rounded-full text-xs font-bold"
                                                :class="market.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                                            >
                                                {{ market.isActive ? 'ATIVO' : 'INATIVO' }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
    name: 'MarketsAdminView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
    },
    data() {
        return {
            markets: [],
            loading: false,
            fetching: true,
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.fetchMarkets();
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
            this.fetching = true;
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Falha ao buscar mercados');

                this.markets = await res.json();
            } catch (error) {
                console.error('Erro ao buscar mercados:', error);
                this.$root.$toast.error('Erro ao carregar lista de mercados');
            } finally {
                this.fetching = false;
            }
        },
        async syncMarkets() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets/sync`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || 'Falha na sincronização');
                }

                const data = await res.json();
                this.$root.$toast.success(data.message || 'Sincronização concluída com sucesso!');
                await this.fetchMarkets(); // Refresh list
            } catch (error) {
                console.error('Erro na sincronização:', error);
                this.$root.$toast.error(error.message || 'Erro ao sincronizar com Deriv');
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
/* Scoped styles imitating Dashboard Layout or using provided CSS */
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
}

@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0;
    }
    
    .dashboard-content-wrapper.sidebar-collapsed {
        margin-left: 0;
    }
    
    .layout-content {
        padding-top: 70px;
    }
}
</style>
