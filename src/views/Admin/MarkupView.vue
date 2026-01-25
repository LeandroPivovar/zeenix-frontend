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
                    <h1>Markup - Comissões</h1>
                    <p>Comissão de 3% sobre o payout de cada operação realizada na Deriv</p>
                </div>
                <div class="main-header-right">
                    <button class="btn pdf-btn" @click="exportReportToPDF"><img src="../../assets/icons/box-down.svg" alt="" width="20px"> Exportar Relatório</button>
                </div>
            </div>

            <div class="main-content">
                <div class="cards-diary">
                    <div v-for="(card, index) in summaryCards" :key="index" class="card">
                        <h2>{{ card.title }}</h2>
                        <p><strong>{{ formatCurrency(card.value) }}</strong></p>
                    </div>
                </div>

                <div class="filter-controls">
                    <div class="date-filter-wrapper">
                        <div class="date-filter">
                            <span>Data de início</span>
                            <input type="date" v-model="filterStartDate">
                        </div>
                        <div class="date-filter">
                            <span>Data final</span>
                            <input type="date" v-model="filterEndDate">
                        </div>
                    </div>
                    <select v-model="filterSelectedCountry" class="select-country">
                        <option value="">Todos</option>
                        <option v-for="country in availableCountries" :key="country" :value="country">{{ country }}</option>
                    </select>
                    <button class="btn btn-search" @click="fetchData">Buscar</button>
                </div>

                <div class="summary-info">
                    <p>
                        Comissão: {{ formatCurrency(totalCommissionDisplayed) }} |
                        Transações: {{ totalTransactionsDisplayed.toLocaleString() }} |
                        Clientes: {{ displayedClients.length }}
                    </p>
                </div>

                <!-- Tabela Desktop -->
                <div class="table-container desktop-table" id="commission-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>País</th>
                                <th>Login ID</th>
                                <th>Comissão</th>
                                <th>Transações</th>
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
                                <td class="commission-value">{{ formatCurrency(client.commission) }}</td>
                                <td>{{ client.transactionCount }}</td>
                                <td>
                                    <a v-if="client.whatsapp" :href="`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`" target="_blank" class="whatsapp-icon">
                                        <img src="../../assets/icons/whattsapp.svg" alt="" width="20px">
                                    </a>
                                    <span v-else class="whatsapp-icon" style="opacity: 0.3;">
                                        <img src="../../assets/icons/whattsapp.svg" alt="" width="20px">
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
                            <div class="card-commission">
                                <span class="commission-value">{{ formatCurrency(client.commission) }}</span>
                            </div>
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
                                <span class="card-label">Transações:</span>
                                <span class="card-value">{{ client.transactionCount }}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">WhatsApp:</span>
                                <span class="card-value">
                                    <a v-if="client.whatsapp" :href="`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`" target="_blank" class="whatsapp-icon">
                                        <img src="../../assets/icons/whattsapp.svg" alt="" width="20px">
                                    </a>
                                    <span v-else class="whatsapp-icon" style="opacity: 0.3;">
                                        <img src="../../assets/icons/whattsapp.svg" alt="" width="20px">
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
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';

// NOTA: DESCOMENTE AS LINHAS ABAIXO APÓS INSTALAR AS DEPENDÊNCIAS (npm install jspdf html2canvas)
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export default {
    name: 'MarkupView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
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
        };
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
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
            
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                // Buscar dados do período filtrado
                const params = new URLSearchParams({
                    startDate: this.filterStartDate,
                    endDate: this.filterEndDate,
                });
                
                const response = await fetch(`${apiUrl}/trades/markup?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados de markup');
                }
                
                const data = await response.json();
                this.allUsers = data.users || [];
                this.applyFilters();
                
                // Buscar dados agregados por período
                await this.fetchPeriodData(token, apiUrl);
                
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                this.error = error.message;
                this.allUsers = [];
                this.displayedClients = [];
            } finally {
                this.isLoading = false;
            }
        },
        
        async fetchPeriodData(token, apiUrl) {
            try {
                const today = new Date();
                const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
                const endOfToday = today.toISOString().split('T')[0];
                
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
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfToday}&endDate=${endOfToday}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfMonth}&endDate=${endOfToday}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfLastMonth}&endDate=${endOfLastMonth}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(r => r.json()),
                    fetch(`${apiUrl}/trades/markup?startDate=${startOfYear}&endDate=${endOfToday}`, {
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
            return this.calculateTotalCommission(this.displayedClients);
        },

        totalTransactionsDisplayed() {
            return this.displayedClients.reduce((sum, client) => sum + client.transactionCount, 0);
        },

        availableCountries() {
            const countries = this.allUsers.map(user => user.country);
            return [...new Set(countries)].sort();
        },

        summaryCards() {
            return [
                { title: 'Hoje', value: this.periodData.today },
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
    margin-left: 280px;
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
    font-weight: 55500;
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

.whatsapp-icon {
    cursor: pointer;
    font-size: 16px;
    color: #00b894;
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