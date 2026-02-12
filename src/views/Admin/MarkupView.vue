<template>
    <div class="dashboard-layout">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @close-sidebar="isSidebarOpen = false" @toggle-collapse="toggleSidebarCollapse" @open-settings="showSettingsModal = true" />

        <div class="dashboard-content-wrapper">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="layout-content">
                <div class="main-content">
                    <!-- Expanded Filters -->
                    <div class="filter-controls">
                        <div class="filter-group">
                            <label><i class="far fa-calendar-alt"></i> Data de Início</label>
                            <input type="date" v-model="filterStartDate">
                        </div>
                        <div class="filter-group">
                            <label><i class="far fa-calendar-alt"></i> Data Final</label>
                            <input type="date" v-model="filterEndDate">
                        </div>
                        <div class="filter-group">
                            <label><i class="fas fa-globe"></i> País</label>
                            <select v-model="filterSelectedCountry">
                                <option value="">Todos</option>
                                <option v-for="country in availableCountries" :key="country" :value="country">{{ country }}</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label><i class="fas fa-bullhorn"></i> Origem do Usuário</label>
                            <select v-model="filterUserOrigin">
                                <option value="">Todas Campanhas</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label><i class="fas fa-wallet"></i> Faixa de Depósito</label>
                            <div class="select-wrapper">
                                <select v-model="filterDepositRange">
                                    <option value="">Selecionar faixa</option>
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-search" @click="fetchData" :disabled="isLoading">
                            <i class="fas" :class="isLoading ? 'fa-spinner fa-spin' : 'fa-search'"></i> 
                            {{ isLoading ? 'Buscando...' : 'Buscar' }}
                        </button>
                    </div>

                    <!-- 7 Summary Cards -->
                    <div class="summary-cards-grid">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Receita Total (Markup 3%)</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ formatCurrency(summaryCards.totalCommission) }}</span>
                                    <span class="stat-percentage">+12.5%</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Soma total da comissão gerada no período. Representa 3% do payout de todas as operações realizadas. Use para entender quanto o marketing trouxe de receita real, não apenas leads"></i>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Volume Total Operado</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ formatCurrency(summaryCards.totalVolume) }}</span>
                                    <span class="stat-percentage">+8.3%</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Valor total negociado pelos usuários na corretora. Quanto maior o volume, maior o potencial de geração de markup. Campanhas que atraem usuários com alto volume tendem a gerar mais lucro"></i>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-piggy-bank"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Total em Saldo Real</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ formatCurrency(summaryCards.totalRealAmount) }}</span>
                                    <span class="stat-percentage">+15.2%</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Soma de todos os depósitos realizados pelos usuários. Indica a qualidade financeira do tráfego. Leads com depósitos maiores geralmente geram mais volume e mais markup."></i>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Depósito Médio por Usuário</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ formatCurrency(summaryCards.avgDeposit) }}</span>
                                    <span class="stat-percentage">+3.1%</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Valor médio depositado por usuário ativo. Use para comparar campanhas, países ou períodos. Quedas nessa métrica podem indicar tráfego menos qualificado."></i>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Receita Média por Usuário</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ formatCurrency(summaryCards.avgRevenue) }}</span>
                                    <span class="stat-percentage">+5.8%</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Receita média de markup gerada por usuário. Mostra a eficiência do funil e da retenção. Ideal para avaliar qualidade além da aquisição."></i>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Usuários com Saldo</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ summaryCards.usersWithBalance }}</span>
                                    <span class="stat-percentage">+24</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Número de usuários com saldo ativo na corretora. Representa a base real de usuários monetizáveis. Crescimento saudável ocorre quando esse número sobe junto com depósito médio e ARPU."></i>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon-wrapper">
                                <i class="fas fa-globe"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">LTV Médio por Lead (Markup)</span>
                                <div class="stat-row">
                                    <span class="stat-value">{{ formatCurrency(summaryCards.ltvAvg) }}</span>
                                    <span class="stat-percentage">+18.2%</span>
                                </div>
                            </div>
                            <i class="fas fa-info-circle stat-info-icon" title="Receita média de markup gerada por cada lead desde a aquisição. Essa é a métrica mais importante para decisões de marketing. Ela mostra quanto dinheiro real cada lead traz, independentemente do custo por lead."></i>
                        </div>
                    </div>

                    <!-- Projection Chart -->
                    <ProjectionChart :daily-data="dailyMarkupData" />

                    <!-- Daily Markup Chart -->
                    <DailyMarkupChart :daily-data="dailyMarkupData" />

                    <!-- Table Section -->
                    <div class="table-section mt-8">
                        <div class="table-header mb-4">
                            <h2 class="table-title">Usuários por Receita</h2>
                            <p class="table-subtitle">Análise detalhada de receita por usuário</p>
                        </div>

                        <div class="table-container desktop-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>País</th>
                                        <th>Login ID</th>
                                        <th>Saldo Real <i class="fas fa-arrows-alt-v ml-1 text-xs opacity-50"></i></th>
                                        <th>Volume Operado <i class="fas fa-arrows-alt-v ml-1 text-xs opacity-50"></i></th>
                                        <th>Markup Gerado <i class="fas fa-arrows-alt-v ml-1 text-xs opacity-50"></i></th>
                                        <th>Markup Médio/Dia</th>
                                        <th>Status</th>
                                        <th style="text-align: right;">Contato</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="isLoading">
                                        <td colspan="9" class="text-center py-12">Carregando dados...</td>
                                    </tr>
                                    <tr v-else-if="displayedClients.length === 0">
                                        <td colspan="9" class="text-center py-12">Nenhum dado encontrado</td>
                                    </tr>
                                    <tr v-else v-for="client in displayedClients" :key="client.userId">
                                        <td class="client-name">{{ client.name }}</td>
                                        <td>
                                            <div class="country-cell">
                                                <span class="country-flag">{{ getCountryFlag(client.country) }}</span>
                                                <span class="country-name">{{ client.country }}</span>
                                            </div>
                                        </td>
                                        <td class="login-id">{{ client.email }}</td>
                                        <td class="font-medium text-white">{{ formatCurrency(client.realAmount || 0) }}</td>
                                        <td class="font-medium text-white">{{ formatCurrency(client.volumeOperado || 0) }}</td>
                                        <td class="markup-value">{{ formatCurrency(client.commission) }}</td>
                                        <td class="font-medium text-white">{{ formatCurrency(client.markupAvgPerDay || 0) }}</td>
                                        <td>
                                            <span class="status-pill premium">
                                                <i class="fas fa-leaf mr-1 text-[10px]"></i> Alto Valor
                                            </span>
                                        </td>
                                        <td style="text-align: right;">
                                            <a v-if="client.whatsapp || client.phone || client.phoneNumber" 
                                               :href="`https://wa.me/${(client.whatsapp || client.phone || client.phoneNumber).replace(/\D/g, '')}`" 
                                               target="_blank" 
                                               class="whatsapp-action-btn">
                                                <i class="fab fa-whatsapp"></i> WhatsApp
                                            </a>
                                            <div v-else class="whatsapp-action-btn disabled">
                                                <i class="fab fa-whatsapp"></i> WhatsApp
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
import ProjectionChart from '../../components/Admin/ProjectionChart.vue';
import DailyMarkupChart from '../../components/Admin/DailyMarkupChart.vue';

// NOTA: DESCOMENTE AS LINHAS ABAIXO APÓS INSTALAR AS DEPENDÊNCIAS (npm install jspdf html2canvas)
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export default {
    name: 'MarkupView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        ProjectionChart,
        DailyMarkupChart,
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
            filterUserOrigin: '',
            filterDepositRange: '',
            showSettingsModal: false,
            displayedClients: [],
            allUsers: [],
            isLoading: false,
            error: null,
            todayCommission: 0, 
            loadingProgress: 0,
            totalToLoad: 0,
            dailyMarkupData: [],
        };
    },
    watch: {
    },
    created() {
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.fetchData();
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
            this.loadingProgress = 0;
            this.totalToLoad = 0;
            
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                console.log('[MarkupView] Iniciando busca de dados de markup...');
                console.log('[MarkupView] Período:', this.filterStartDate, 'até', this.filterEndDate);
                
                const params = new URLSearchParams({
                    startDate: this.filterStartDate,
                    endDate: this.filterEndDate,
                });

                // Usar endpoint /trades/markup (GET simples) em vez de SSE stream
                const response = await fetch(`${apiUrl}/trades/markup?${params}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('[MarkupView] Dados recebidos:', data);

                // Processar dados recebidos
                if (data.users && Array.isArray(data.users)) {
                    this.allUsers = data.users;
                    this.applyFilters();
                    console.log('[MarkupView] Total de usuários processados:', this.allUsers.length);
                } else {
                    console.warn('[MarkupView] Nenhum usuário encontrado na resposta');
                }

                // 2. Buscar dados de HOJE separadamente para o card "Comissão Hoje"
                this.fetchTodayData(token, apiUrl);

                // 3. Buscar dados do gráfico de projeção
                this.fetchChartData(token, apiUrl);

                this.isLoading = false;
                this.loadingProgress = 100;

            } catch (error) {
                console.error('[MarkupView] Erro ao buscar dados:', error);
                this.error = 'Erro ao carregar dados de markup: ' + error.message;
                this.isLoading = false;
            }
        },

        async fetchTodayData(token, apiUrl) {
            try {
                const today = new Date().toISOString().split('T')[0];
                const params = new URLSearchParams({
                    startDate: today,
                    endDate: today,
                });

                const response = await fetch(`${apiUrl}/trades/markup?${params}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Calcular comissão total de hoje
                    if (data.summary && data.summary.totalCommission) {
                        this.todayCommission = data.summary.totalCommission;
                    } else {
                         this.todayCommission = 0;
                    }
                }
            } catch (error) {
                console.warn('[MarkupView] Erro ao buscar dados de hoje:', error);
            }
        },

        handleStreamEvent(event) {
            // Manter método por compatibilidade, mas não será mais usado
            console.log('[MarkupView] handleStreamEvent (deprecated):', event);
        },
        
        async fetchChartData(token, apiUrl) {
            try {
                // Use selected filters or default to 30 days if not set
                let start = this.filterStartDate;
                let end = this.filterEndDate;

                if (!start || !end) {
                     const today = new Date();
                     end = today.toISOString().split('T')[0];
                     start = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
                }
                
                const response = await fetch(`${apiUrl}/trades/markup/daily?startDate=${start}&endDate=${end}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const dailyStats = await response.json();
                    this.dailyMarkupData = dailyStats || [];
                }
            } catch (error) {
                console.error('Erro ao buscar dados do gráfico:', error);
                this.dailyMarkupData = [];
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

        getCountryFlag(countryName) {
            const flags = {
                'Brazil': '🇧🇷',
                'Brasil': '🇧🇷',
                'UK': '🇬🇧',
                'USA': '🇺🇸',
                'Portugal': '🇵🇹',
                'Angola': '🇦🇴',
                'Mozambique': '🇲🇿',
            };
            return flags[countryName] || '🏳️';
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
            return this.displayedClients.reduce((sum, client) => sum + (Number(client.commission) || 0), 0);
        },
        
        totalRealAmountDisplayed() {
            return this.displayedClients.reduce((sum, client) => sum + (Number(client.realAmount) || 0), 0);
        },

        summaryCards() {
            const totalRealAmount = this.displayedClients.reduce((sum, c) => sum + (c.realAmount || 0), 0);
            const totalVolume = this.displayedClients.reduce((sum, c) => sum + (c.volumeOperado || 0), 0);
            const totalCommission = this.totalCommissionDisplayed;
            const userCount = this.displayedClients.length || 1;

            return {
                totalCommission,
                totalVolume,
                totalRealAmount,
                avgDeposit: totalRealAmount / userCount,
                avgRevenue: totalCommission / userCount,
                usersWithBalance: this.displayedClients.length,
                ltvAvg: totalCommission / userCount, 
            };
        },

        availableCountries() {
            const countries = this.allUsers.map(user => user.country);
            return [...new Set(countries)].filter(Boolean).sort();
        },
    },
};
</script>

<style scoped>
/* Base Colors & Variables */
:root {
    --bg-main: #060606;
    --bg-card: #121212;
    --primary-green: #00FF88;
    --primary-green-dim: rgba(0, 255, 136, 0.1);
    --border-dim: #222222;
    --text-muted: #888888;
    --text-main: #FFFFFF;
}

.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #060606;
    color: #FFFFFF;
    font-family: 'Inter', 'Poppins', sans-serif;
}

.dashboard-content-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.layout-content {
    flex-grow: 1;
    padding: 80px 40px 32px 40px;
}

/* Header */
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
}

.header-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
}

.header-subtitle {
    font-size: 14px;
    color: #888888;
    margin: 0;
}

.main-header-right {
    display: flex;
    gap: 12px;
}

.btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-outline-metrics {
    background: transparent;
    border: 1px solid #00FF88;
    color: #00FF88;
}

.btn-outline-metrics:hover {
    background: rgba(0, 255, 136, 0.1);
}

.btn-export {
    background: #00FF88;
    color: #000;
}

.btn-export:hover {
    background: #00e077;
    transform: translateY(-1px);
}

/* Filters */
.filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    background: #0e0e0e;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #222222;
    margin-bottom: 32px;
    align-items: flex-end;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 160px;
}

.filter-group label {
    font-size: 11px;
    color: #555;
    font-weight: 600;
    text-transform: none;
    display: flex;
    align-items: center;
    gap: 6px;
}

.filter-group label i {
    font-size: 12px;
}

.filter-group input, .filter-group select {
    background: #181818;
    border: 1px solid #2a2a2a;
    color: #fff;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
}

.filter-group input:focus, .filter-group select:focus {
    border-color: #444;
}

.btn-search {
    background: #00FF88;
    color: #000;
    padding: 10px 24px;
    height: 42px;
    border-radius: 8px;
}

/* Summary Cards Grid */
.summary-cards-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 16px;
    margin-bottom: 32px;
}

.stat-card {
    background: #121212;
    border: 1px solid #222222;
    border-radius: 12px;
    padding: 20px;
    position: relative;
    transition: transform 0.2s, border-color 0.2s;
}

.stat-card:hover {
    border-color: #333;
    transform: translateY(-2px);
}

.stat-icon-wrapper {
    width: 32px;
    height: 32px;
    background: rgba(0, 255, 136, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.stat-icon-wrapper i {
    color: #00FF88;
    font-size: 14px;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 12px;
    color: #888888;
    margin-bottom: 8px;
    font-weight: 500;
}

.stat-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
}

.stat-percentage {
    font-size: 10px;
    background: rgba(0, 255, 136, 0.1);
    color: #00FF88;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 700;
}

.stat-info-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: #333;
}

/* Table Section */
.table-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
}

.table-subtitle {
    font-size: 13px;
    color: #888888;
    margin: 0;
}

.table-container {
    background: transparent;
    border-radius: 0;
    overflow: visible;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
}

th {
    padding: 12px 16px;
    text-align: left;
    color: #444;
    font-size: 11px;
    font-weight: 700;
    text-transform: none;
    border-bottom: 1px solid #111;
}

td {
    padding: 16px;
    background: #0d0d0d;
    vertical-align: middle;
}

tr td:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

tr td:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}

.country-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.country-flag {
    font-size: 16px;
}

.country-name {
    color: #aaa;
    font-size: 13px;
}

.markup-value {
    color: #00FF88;
    font-weight: 700;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
}

.status-pill.premium {
    background: rgba(0, 255, 136, 0.05);
    color: #008855;
    border: 1px solid rgba(0, 255, 136, 0.1);
}

.client-name {
    font-weight: 600;
    color: #fff;
    font-size: 14px;
}

.login-id {
    color: #666;
    font-size: 13px;
}

.whatsapp-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #00FF88;
    color: #000;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 12px;
    font-weight: 700;
    transition: transform 0.2s;
}

.whatsapp-action-btn:hover {
    transform: scale(1.05);
}

.whatsapp-action-btn.disabled {
    opacity: 0.2;
    filter: grayscale(1);
    cursor: not-allowed;
}

/* Responsividade */
@media (max-width: 1400px) {
    .summary-cards-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1024px) {
    .summary-cards-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .layout-content {
        padding: 20px;
    }
}

@media (max-width: 640px) {
    .summary-cards-grid {
        grid-template-columns: 1fr;
    }
    .main-header {
        flex-direction: column;
        gap: 16px;
    }
    .main-header-right {
        width: 100%;
        flex-direction: column;
    }
}
</style>