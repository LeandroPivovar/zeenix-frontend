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
                <div class="main-header header-markup">
                <div class="main-header-left">
                    <h1 style="font-size: 20px;">Markup - Comissões</h1>
                    <p style="font-size: 14px;">
                        Comissão de 3% sobre o payout de cada operação realizada na Deriv
                        <span v-if="selectedUserName" style="color: #22C55E; font-weight: 500;"> • {{ selectedUserName }}</span>
                    </p>
                </div>
                <div class="main-header-right">
                    <button class="btn pdf-btn" @click="exportReportToPDF"><img src="../../assets/icons/box-down.svg" alt="" width="20px"> Exportar Relatório</button>
                </div>
            </div>

            <div class="main-content">
                <!-- Summary Cards -->
                <div class="summary-cards">
                    <div class="card total">
                        <h3>Comissão Total</h3>
                        <p class="value" v-if="!derivMarkupLoading">{{ formatCurrency(derivMarkupTotal) }}</p>
                        <p class="value" v-else style="font-size: 14px; color: #999;">Carregando...</p>
                        <p v-if="derivMarkupError" style="font-size: 12px; color: #ff4444; margin-top: 5px;">{{ derivMarkupError }}</p>
                    </div>
                    <div class="card total">
                        <h3>Saldo Total (Real)</h3>
                        <p class="value">{{ formatCurrency(summaryCards.totalRealAmount) }}</p>
                    </div>
                    <div class="card count">
                        <h3>Usuários com Saldo</h3>
                        <p class="value">{{ summaryCards.usersWithMarkup }}</p>
                    </div>
                </div>

                <div class="filter-controls" style="display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap;">
                    <div class="date-filter">
                        <span>Data de início</span>
                        <input type="date" v-model="filterStartDate">
                    </div>
                    <div class="date-filter">
                        <span>Data final</span>
                        <input type="date" v-model="filterEndDate">
                    </div>
                    
                    <div class="filter-item">
                        <span style="display: block; font-size: 12px; margin-bottom: 5px; color: #a0a0a0;">País</span>
                        <select v-model="filterSelectedCountry" class="select-country" style="height: 40px;">
                            <option value="">Todos</option>
                            <option v-for="country in availableCountries" :key="country" :value="country">{{ country }}</option>
                        </select>
                    </div>
                    <button class="btn btn-search" @click="fetchData" style="height: 40px; margin-bottom: 0;">Buscar</button>
                </div>

                <div class="summary-info">
                    <p>
                        Comissão: {{ formatCurrency(totalCommissionDisplayed) }} |
                        Transações: {{ totalTransactionsDisplayed.toLocaleString() }} |
                        Clientes: {{ displayedClients.length }} |
                        Saldo Real: {{ formatCurrency(totalRealAmountDisplayed) }}
                    </p>
                </div>

            <!-- Barra de Progresso -->
            <div v-if="isLoading" class="mb-4">
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-blue-700 dark:text-blue-500">Carregando dados...</span>
                    <span class="text-sm font-medium text-blue-700 dark:text-blue-500">{{ loadingProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: loadingProgress + '%' }"></div>
                </div>
                <div class="text-xs text-center mt-1 text-gray-500" v-if="totalToLoad > 0">
                    Processando {{ allUsers.length }} de {{ totalToLoad }} usuários
                </div>
            </div>

            <!-- Tabela Desktop -->
                <div class="table-container desktop-table" id="commission-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>País</th>
                                <th>Login ID</th>
                                <th>Saldo Real</th>
                                <th>Comissão (3%)</th>
                                <th>WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoading">
                                <td colspan="6" style="text-align: center; padding: 40px;">
                                    Carregando dados...
                                </td>
                            </tr>
                            <tr v-else-if="error">
                                <td colspan="6" style="text-align: center; padding: 40px; color: #ff4444;">
                                    Erro ao carregar dados: {{ error }}
                                </td>
                            </tr>
                            <tr v-else-if="displayedClients.length === 0">
                                <td colspan="6" style="text-align: center; padding: 40px;">
                                    Nenhum dado encontrado para o período selecionado
                                </td>
                            </tr>
                            <tr v-else v-for="client in displayedClients" :key="client.userId">
                                <td>{{ client.name }}</td>
                                <td>{{ client.country }}</td>
                                <td>{{ client.email }}</td>
                                <td>{{ formatCurrency(client.realAmount) }}</td>
                                <td class="commission-value">{{ formatCurrency(client.commission) }}</td>
                                <td>
                                    <a v-if="client.whatsapp || client.phone || client.phoneNumber" 
                                       :href="`https://wa.me/${(client.whatsapp || client.phone || client.phoneNumber).replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${client.name.split(' ')[0]}, como vai?`)}`" 
                                       target="_blank" 
                                       class="whatsapp-btn">
                                        <i class="fab fa-whatsapp"></i> WhatsApp
                                    </a>
                                    <span v-else class="whatsapp-btn disabled">
                                        <i class="fab fa-whatsapp"></i> -
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Cards Mobile -->
                <div class="mobile-cards-container">
                    <div v-if="isLoading" class="mobile-card empty-state">
                        <p>Carregando dados...</p>
                    </div>
                    <div v-else-if="error" class="mobile-card empty-state error">
                        <p>Erro ao carregar dados: {{ error }}</p>
                    </div>
                    <div v-else-if="displayedClients.length === 0" class="mobile-card empty-state">
                        <p>Nenhum dado encontrado para o período selecionado</p>
                    </div>
                    <div v-else v-for="client in displayedClients" :key="client.userId" class="mobile-card">
                        <div class="card-header">
                            <h3 class="card-name">{{ client.name }}</h3>
                        </div>
                        <div class="card-body">
                            <div class="card-row">
                                <span class="card-label">País:</span>
                                <span class="card-value">{{ client.country }}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Login ID:</span>
                                <span class="card-value">{{ client.email }}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Saldo Real:</span>
                                <span class="card-value">{{ formatCurrency(client.realAmount) }}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Comissão:</span>
                                <span class="card-value">{{ formatCurrency(client.commission) }}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">WhatsApp:</span>
                                <span class="card-value">
                                    <a v-if="client.whatsapp || client.phone || client.phoneNumber" 
                                       :href="`https://wa.me/${(client.whatsapp || client.phone || client.phoneNumber).replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${client.name.split(' ')[0]}, como vai?`)}`" 
                                       target="_blank" 
                                       class="whatsapp-btn">
                                        <i class="fab fa-whatsapp"></i> WhatsApp
                                    </a>
                                    <span v-else class="whatsapp-btn disabled">
                                        <i class="fab fa-whatsapp"></i> -
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </main>
        </div>

        <!-- Settings Modal -->
        <SettingsSidebar
            :is-open="showSettingsModal"
            @close="showSettingsModal = false"
        />

        <!-- User Selection Modal -->
        <SelectionModal
            :show="showUserModal"
            title="Selecionar Usuário"
            :items="userItems"
            :selected-value="selectedUserId"
            search-placeholder="Buscar usuário..."
            @select="selectUser"
            @close="showUserModal = false"
        />

    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import SelectionModal from '../../components/SelectionModal.vue';

// NOTA: DESCOMENTE AS LINHAS ABAIXO APÓS INSTALAR AS DEPENDÊNCIAS (npm install jspdf html2canvas)
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export default {
    name: 'MarkupView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        SelectionModal,
    },
    data() {
        const currentDate = new Date().toISOString().split('T')[0];
        const startOfYear = `${currentDate.substring(0, 4)}-01-01`; 

        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            currentDate: currentDate, 
            filterStartDate: startOfYear,
            filterEndDate: currentDate,
            filterSelectedCountry: '',
            showSettingsModal: false,
            displayedClients: [],
            allUsers: [],
            isLoading: false,
            error: null,
            // Dados agregados por período
            periodData: {
                today: 0,
                monthly: 0,
                lastMonth: 0,
                annual: 0,
            },
            loadingProgress: 0,
            totalToLoad: 0,
            // Dados do markup da Deriv API
            derivMarkupTotal: 0,
            derivMarkupLoading: false,
            derivMarkupError: null,
            // Modal de seleção de usuário
            showUserModal: false,
            selectedUserId: null,
            selectedUserName: '',
            users: [],
        };
    },
    computed: {
        userItems() {
            return this.users.map(user => ({
                value: user.id.toString(),
                label: user.name || user.email,
                description: user.email
            }));
        },
    },
    watch: {
    },
    created() {
        // Não buscar dados automaticamente, esperar seleção de usuário
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        // Buscar lista de usuários e mostrar modal
        this.fetchUsers();
        this.showUserModal = true;
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
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        },
        
        async fetchData() {
            this.isLoading = true;
            this.error = null;
            // Limpar dados anteriores mas manter estrutura
            this.allUsers = [];
            this.displayedClients = [];
            this.periodData = { today: 0, monthly: 0, lastMonth: 0, annual: 0 };
            this.loadingProgress = 0;
            this.totalToLoad = 0;
            
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const params = new URLSearchParams({
                    startDate: this.filterStartDate,
                    endDate: this.filterEndDate,
                });

                // Criar conexão SSE usando EventSourceWrapper ou Fetch Stream para passar headers
                // Como EventSource nativo não suporta headers, usaremos fetch com reader
                const response = await fetch(`${apiUrl}/trades/markup/stream?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'text/event-stream',
                    },
                });

                if (!response.ok) throw new Error(response.statusText);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                // Iniciar leitura do stream
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;
                    
                    // Processar linhas do SSE (padrão "data: {...}\n\n")
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop(); // Guardar o resto incompleto para o próximo chunk

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const jsonStr = line.replace('data: ', '');
                                const eventData = JSON.parse(jsonStr);
                                this.handleStreamEvent(eventData);
                            } catch (e) {
                                console.warn('Erro ao processar mensagem do stream JSON:', e);
                            }
                        }
                    }
                }

                this.isLoading = false;
                
                // Buscar dados agregados de outros períodos em paralelo (pode manter isso ou também streacar)
                // Para manter a resposta rápida, vamos carregar o markup total via stream e deixar
                // os "cards" de períodos carregarem via request normal em background
                // TEMPORARIAMENTE DESABILITADO - endpoint /trades/markup não implementado
                // this.fetchPeriodData(token, apiUrl);
                
                // Buscar dados de markup da Deriv API
                this.fetchDerivMarkupStatistics();

            } catch (error) {
                console.error('Erro ao buscar dados (stream):', error);
                this.error = 'Erro na conexão de stream: ' + error.message;
                this.isLoading = false;
            }
        },

        handleStreamEvent(event) {
            if (event.type === 'start') {
                this.totalToLoad = event.totalUsers;
                this.loadingProgress = 0;
            } else if (event.type === 'user_data') {
                const user = event.user;
                this.allUsers.push(user);
                this.applyFilters();
                
                // Atualizar progresso
                if (this.totalToLoad > 0) {
                    this.loadingProgress = Math.round((this.allUsers.length / this.totalToLoad) * 100);
                }
                
                if (this.allUsers.length === 1) {
                   // Apenas para remover estado de "nenhum dado" se houver
                } 
            } else if (event.type === 'done') {
                this.isLoading = false;
                this.loadingProgress = 100;
            }
        },
        
        async fetchPeriodData(token, apiUrl) {
            try {
                let queryParams = '';
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const startOfToday = `${year}-${month}-${day}`;
                const endOfToday = startOfToday;
                
                // Primeiro dia do mês atual
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                
                // Primeiro dia do mês passado
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
                // Último dia do mês passado
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
                
                // Primeiro dia do ano atual
                const startOfYear = `${today.getFullYear()}-01-01`;
                
                // Fazer chamadas paralelas para todos os períodos
                const [todayData, monthlyData, lastMonthData, annualData] = await Promise.all([
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfToday}&endDate=${endOfToday}${queryParams}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfMonth}&endDate=${endOfToday}${queryParams}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfLastMonth}&endDate=${endOfLastMonth}${queryParams}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfYear}&endDate=${endOfToday}${queryParams}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                ]);
                
                this.periodData = {
                    today: todayData.summary?.totalCommission || 0,
                    monthly: monthlyData.summary?.totalCommission || 0,
                    lastMonth: lastMonthData.summary?.totalCommission || 0,
                    annual: annualData.summary?.totalCommission || 0,
                };
                
            } catch (error) {
                console.error('Erro ao buscar dados por período:', error);
                // Em caso de erro, manter valores em 0
                this.periodData = {
                    today: 0,
                    monthly: 0,
                    lastMonth: 0,
                    annual: 0,
                };
            }
        },
        
        async fetchDerivMarkupStatistics() {
            if (!this.selectedUserId) {
                console.warn('[MarkupView] Nenhum usuário selecionado');
                return;
            }
            
            this.derivMarkupLoading = true;
            this.derivMarkupError = null;
            
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const params = new URLSearchParams({
                    userId: this.selectedUserId,
                    dateFrom: this.filterStartDate,
                    dateTo: this.filterEndDate,
                });
                
                const response = await fetch(`${apiUrl}/markup/statistics?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`Erro ao buscar estatísticas de markup: ${response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success && result.data) {
                    this.derivMarkupTotal = result.data.total_app_markup_usd || 0;
                    console.log('[MarkupView] Markup total da Deriv API:', this.derivMarkupTotal);
                } else {
                    this.derivMarkupTotal = 0;
                }
                
            } catch (error) {
                console.error('Erro ao buscar estatísticas de markup da Deriv:', error);
                this.derivMarkupError = error.message;
                this.derivMarkupTotal = 0;
            } finally {
                this.derivMarkupLoading = false;
            }
        },

        async fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const response = await fetch(`${apiUrl}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                
                const result = await response.json();
                this.users = result.data || result || [];
                console.log('[MarkupView] Usuários carregados:', this.users.length);
                
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
                this.$root.$toast.error('Erro ao carregar lista de usuários');
            }
        },

        selectUser(user) {
            this.selectedUserId = user.value;
            this.selectedUserName = user.label;
            console.log('[MarkupView] Usuário selecionado:', user.label, '(ID:', user.value, ')');
            
            // Buscar dados do markup para o usuário selecionado
            this.fetchData();
            this.fetchDerivMarkupStatistics();
        },

        calculateTotalCommission(users) {
            return users.reduce((sum, user) => sum + user.commission, 0);
        },

        applyFilters() {
            let filtered = [...this.allUsers];
            
            if (this.filterSelectedCountry) {
                filtered = filtered.filter(user => user.country === this.filterSelectedCountry);
            }
            
            this.displayedClients = filtered;
        },
        
        exportReportToPDF() {
            if (this.displayedClients.length === 0) {
                this.$root.$toast.warning('Não há dados para exportar no período selecionado.');
                return;
            }
            // --- LÓGICA REAL DE EXPORTAÇÃO PARA PDF COM DOWNLOAD ---


            // const element = document.getElementById('commission-table');
            
            /* DESCOMENTE ESTE BLOCO APÓS INSTALAR AS DEPENDÊNCIAS
            npm install jspdf html2canvas
            
            html2canvas(element, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // Largura A4 em mm
                const pageHeight = 297; // Altura A4 em mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
            
                // Adiciona a primeira página
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            
                // Adiciona páginas extras se o conteúdo for maior que uma página
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                // Salva o arquivo, iniciando o download
                const filename = `Relatorio_Comissoes_${this.filterStartDate}_a_${this.filterEndDate}.pdf`;
                pdf.save(filename);
            });
            */
            
            // SIMULAÇÃO (Remova a linha abaixo após descomentar o bloco acima)
            this.$root.$toast.success(`Download do PDF iniciado! (Arquivo: Relatorio_Comissoes_${this.filterStartDate}_a_${this.filterEndDate}.pdf)`);
        }
    },
    computed: {
        totalCommissionDisplayed() {
            // Agora "commission" vem calculado do backend (markup 3%)
            return this.displayedClients.reduce((sum, client) => sum + (Number(client.commission) || 0), 0);
        },
        
        totalRealAmountDisplayed() {
            return this.displayedClients.reduce((sum, client) => sum + (Number(client.realAmount) || 0), 0);
        },

        totalTransactionsDisplayed() {
            // This value is no longer directly available or relevant in the new context
            return 0;
        },

        availableCountries() {
            const countries = this.allUsers.map(user => user.country);
            return [...new Set(countries)].sort();
        },

        summaryCards() {
            return [
                { title: 'Mensal', value: this.periodData.monthly },
                { title: 'Mês Passado', value: this.periodData.lastMonth },
                { title: 'Anual', value: this.periodData.annual },
                { title: 'Total (Período)', value: this.totalCommissionDisplayed },
            ];
        },
    },
};
</script>

<style scoped>
/* Estilos não alterados */
/* Layout Base - Padrão Dashboard */
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


/* Responsividade */
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

.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.main-header-left {
    width: 90%;
    text-align: left;
    
}

.main-content {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
}

.main-header{
    width: 100%;
}

.main-header h1 {
    font-size: 30px;
    margin: 0;
}

.main-header p {
    font-size: 14px;
    color: #999;
    margin: 5px 0 0 0;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}

.btn-primary {
    background-color: #00b862; /* Verde */
    color: #fff;
}

/* Cards de Resumo */
.cards-diary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px 15px;
    row-gap: 10px;
    margin-bottom: 30px;
    width: 100%;
    box-sizing: border-box;
}

.card {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.card {
    background-color: #1e1e1e;
    padding: 20px;
    min-height: 100px;
    border-radius: 8px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    margin: 0;
}

/* Delays escalonados para cada card */
.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
.card:nth-child(4) { animation-delay: 0.4s; }
.card:nth-child(5) { animation-delay: 0.5s; }

.card h2 {
    font-size: 14px;
    color: #cecccc;
}

.card p strong {
    font-size: 22px;
    color: #00ff88; 
    display: block;
    font-weight: 500;
    text-align: left;
    margin-top: 10px;
}

/* Filtros */
.filter-controls {
    display: flex;
    gap: 15px;
    align-items: flex-end;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeIn 0.6s ease-out forwards;
    animation-delay: 0.6s;
    flex-wrap: wrap;
}

.date-filter {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.date-filter span {
    display: block;
    text-align: left;
    font-size: 13px;
    color: #afafaf;
    margin-bottom: 0;
}

.date-filter input, .select-country {
    background-color: #1e1e1e;
    color: #fff;
    border: 1px solid #333;
    padding: 8px;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
}

.date-filter-wrapper {
    display: flex;
    gap: 15px;
    align-items: flex-end;
    flex-wrap: nowrap;
}

.btn-search {
    background-color: #00b862;
    color: #fff;
}

.summary-info p{
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #7e7d7d;
    text-align: left;
    font-weight: 500;
}

/* Tabela Desktop */
.table-container {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 800px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.7s;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
}

th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #333;
    
}

thead th {
    background-color: #252525;
    color: #ddd;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
}

tbody tr {
    color: rgb(182, 182, 182);
    font-weight: 500;
}

tbody tr:hover {
    background-color: #2a2a2a;
}

.commission-value {
    color: #00b862; 
    font-weight: bold;
}

.whatsapp-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #25D366; /* WhatsApp Green */
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer;
}

.whatsapp-btn:hover {
    background-color: #128C7E;
}

.whatsapp-btn i {
    font-size: 16px;
}

.whatsapp-btn.disabled {
    background-color: #333;
    color: #666;
    cursor: not-allowed;
    opacity: 0.7;
}

/* Cards Mobile */
.mobile-cards-container {
    display: none;
    gap: 10px;
    flex-direction: column;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.7s;
    width: 100%;
    padding-bottom: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 800px;
    align-items: flex-start;
}

.mobile-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #333;
    width: 100%;
    box-sizing: border-box;
    overflow: visible;
    word-wrap: break-word;
}

.mobile-card.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: rgb(182, 182, 182);
}

.mobile-card.empty-state.error {
    color: #ff4444;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
    gap: 10px;
    flex-wrap: wrap;
}

.card-name {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    flex: 1;
    min-width: 0;
    word-break: break-word;
}

.card-commission .commission-value {
    font-size: 20px;
    color: #00b862;
    font-weight: bold;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    min-height: 24px;
}

.card-label {
    font-size: 14px;
    color: #999;
    font-weight: 500;
    flex-shrink: 0;
}

.card-value {
    font-size: 14px;
    color: rgb(182, 182, 182);
    text-align: right;
    flex: 1;
    margin-left: 10px;
    word-break: break-word;
    overflow-wrap: break-word;
}

.card-value .whatsapp-icon {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
}

/* Responsividade - Esconder/Mostrar Tabela e Cards */
@media (max-width: 768px) {
    .desktop-table {
        display: none !important;
    }
    
    .mobile-cards-container {
        display: flex !important;
    }
    
    .layout-content {
        padding: 15px;
        padding-top: 70px;
        padding-bottom: 30px;
    }
    
    .main-content {
        width: 100%;
        overflow: visible;
    }
    
    .mobile-card {
        padding: 15px;
    }
    
    .card-name {
        font-size: 16px;
    }
    
    .card-commission .commission-value {
        font-size: 18px;
    }
    
    .card-label,
    .card-value {
        font-size: 13px;
    }
}

@media (min-width: 769px) {
    .desktop-table {
        display: block !important;
    }
    
    .mobile-cards-container {
        display: none !important;
    }
}

@media (min-width: 992px) {
    .pdf-btn {
        width: auto;
        min-width: 190px;
        margin-right: 20px;
    }
}

@media (max-width: 992px) {
	.layout {
		margin-left: 0;
		width: 100%;
		box-sizing: border-box;
	}
	
	.main-header {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.main-header-right {
		margin-top: 15px; 
		width: 100%;
		text-align: right;
	}
	
	.btn-primary {
		width: auto;
	}
	
	.filter-controls {
		flex-direction: row; 
		flex-wrap: wrap; 
	}
	
	.date-filter-wrapper {
		display: flex;
		gap: 15px;
		width: 100%;
	}
	
	.date-filter {
		flex: 1;
		min-width: 0;
	}
	
	.select-country {
		width: calc(50% - 7.5px); 
	}
	
	.btn-search {
		width: 100%; 
		margin-top: 10px;
	}
}

.pdf-btn {
    background-color: #00b862;
    color: #000000;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

/* Animações */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@media (max-width: 600px) {
	.layout {
		padding: 0 10px; 
	}

	.filter-controls {
		flex-direction: column; 
		align-items: stretch; 
		gap: 10px;
	}
	
	.date-filter-wrapper {
		display: flex;
		gap: 10px;
		width: 100%;
		flex-direction: row;
	}

	.date-filter {
		flex: 1;
		min-width: 0;
		width: auto;
	}
	
	.select-country,
	.btn-search {
		width: 100%; 
		margin-top: 0 !important;
	}
	
	.summary-info {
		font-size: 13px; 
	}
	
	.cards-diary {
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		width: 100%;
		gap: 10px;
	}
	
	.card {
		width: 100%;
		min-width: 0;
	}
	
	.card p strong {
		font-size: 18px;
		text-align: left;
		margin-top: 10px;
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