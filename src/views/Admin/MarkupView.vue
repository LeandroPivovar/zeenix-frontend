<template>
    <div class="layout">
        <main class="layout-content">
            <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />
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
                    <div class="date-filter">
                        <span>Data de início</span>
                        <input type="date" v-model="filterStartDate">
                    </div>
                    <div class="date-filter">
                        <span>Data final</span>
                        <input type="date" v-model="filterEndDate">
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

                <div class="table-container" id="commission-table">
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
                            <tr v-for="client in displayedClients" :key="client.loginID">
                                <td>{{ client.name }}</td>
                                <td>{{ client.country }}</td>
                                <td>{{ client.loginID }}</td>
                                <td class="commission-value">{{ formatCurrency(client.commission) }}</td>
                                <td>{{ client.transactions }}</td>
                                <td>
                                    <span class="whatsapp-icon"><img src="../../assets/icons/whattsapp.svg" alt="" width="20px"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';

// NOTA: DESCOMENTE AS LINHAS ABAIXO APÓS INSTALAR AS DEPENDÊNCIAS (npm install jspdf html2canvas)
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export default {
    name: 'MarkupView',
    components: {
        AppSidebar,
    },
    data() {
        const currentDate = '2025-11-12';
        const startOfYear = `${currentDate.substring(0, 4)}-01-01`; 

        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            currentDate: currentDate, 
            filterStartDate: startOfYear,
            filterEndDate: currentDate,
            filterSelectedCountry: '',
            displayedClients: [],
            allTransactions: [
                { date: '2025-01-15', name: 'Cliente de Jan', country: 'EUA', loginID: 'CR000101', commission: 10000.00, transactions: 5000 },
                { date: '2025-02-20', name: 'Cliente de Fev', country: 'Canadá', loginID: 'CR000102', commission: 8500.00, transactions: 4000 },
                { date: '2025-07-04', name: 'Cliente de Jul', country: 'México', loginID: 'CR000103', commission: 6000.00, transactions: 3000 },
                { date: '2025-10-01', name: 'Ana Julia', country: 'Brasil', loginID: 'CR123456', commission: 50.10, transactions: 30 },
                { date: '2025-10-01', name: 'Carlos Silva', country: 'Portugal', loginID: 'CR789012', commission: 40.00, transactions: 20 },
                { date: '2025-10-05', name: 'Ana Julia', country: 'Brasil', loginID: 'CR123456', commission: 80.40, transactions: 50 },
                { date: '2025-10-05', name: 'Mariana Costa', country: 'Brasil', loginID: 'CR345678', commission: 90.00, transactions: 60 },
                { date: '2025-10-10', name: 'John Doe', country: 'EUA', loginID: 'CR901234', commission: 150.22, transactions: 100 },
                { date: '2025-10-15', name: 'Sofia Pereira', country: 'Angola', loginID: 'CR567890', commission: 30.65, transactions: 20 },
                { date: '2025-10-15', name: 'Pedro Almeida', country: 'Brasil', loginID: 'CR127233', commission: 40.40, transactions: 50 },
                { date: '2025-10-16', name: 'Ana Julia', country: 'Brasil', loginID: 'CR123456', commission: 120.00, transactions: 70 },
                { date: '2025-10-16', name: 'Carlos Silva', country: 'Portugal', loginID: 'CR789012', commission: 50.75, transactions: 40 },
                { date: '2025-10-18', name: 'John Doe', country: 'EUA', loginID: 'CR901234', commission: 100.00, transactions: 80 },
                { date: '2025-11-01', name: 'Cliente Mensal B', country: 'Brasil', loginID: 'CR000002', commission: 100.00, transactions: 50 },
                { date: '2025-11-05', name: 'Cliente Mensal C', country: 'Portugal', loginID: 'CR000003', commission: 200.00, transactions: 100 },
                { date: '2025-11-12', name: 'Cliente Diário A', country: 'Chile', loginID: 'CR000001', commission: 69.66, transactions: 15 },
            ],
        };
    },
    created() {
        this.fetchData(); 
    },
    methods: {
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        },
        
        fetchData() {
            this.displayedClients = this.applyFilters(this.filterStartDate, this.filterEndDate, this.filterSelectedCountry);
        },

        calculateTotalCommission(transactions) {
            return transactions.reduce((sum, transaction) => sum + transaction.commission, 0);
        },

        applyFilters(startDate, endDate, selectedCountry) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);

            let clientsToAggregate = this.allTransactions.filter(transaction => {
                const transDate = new Date(transaction.date);
                const dateMatch = transDate >= start && transDate < end;
                const countryMatch = !selectedCountry || transaction.country === selectedCountry;
                return dateMatch && countryMatch;
            });

            const aggregated = clientsToAggregate.reduce((acc, current) => {
                if (acc[current.loginID]) {
                    acc[current.loginID].commission += current.commission;
                    acc[current.loginID].transactions += current.transactions;
                } else {
                    acc[current.loginID] = { ...current }; 
                }
                return acc;
            }, {});

            return Object.values(aggregated);
        },
        
        exportReportToPDF() {
            if (this.displayedClients.length === 0) {
                alert('Não há dados para exportar no período selecionado.');
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
            alert(`Download do PDF iniciado! (Arquivo: Relatorio_Comissoes_${this.filterStartDate}_a_${this.filterEndDate}.pdf)`);
        }
    },
    computed: {
        totalCommissionDisplayed() {
            return this.calculateTotalCommission(this.displayedClients);
        },

        totalTransactionsDisplayed() {
            return this.displayedClients.reduce((sum, client) => sum + client.transactions, 0);
        },

        availableCountries() {
            const countries = this.allTransactions.map(client => client.country);
            return [...new Set(countries)].sort();
        },

        summaryCards() {
            const today = this.currentDate;
            const currentYear = today.substring(0, 4); 
            
            const currentMonth = today.substring(0, 7); 
            const monthlyTransactions = this.allTransactions.filter(t => t.date.startsWith(currentMonth));
            const monthlyCommission = this.calculateTotalCommission(monthlyTransactions);
            
            const lastMonthDate = new Date(today);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            const lastMonth = lastMonthDate.toISOString().substring(0, 7);
            const lastMonthTransactions = this.allTransactions.filter(t => t.date.startsWith(lastMonth));
            const lastMonthCommission = this.calculateTotalCommission(lastMonthTransactions);

            const todayTransactions = this.allTransactions.filter(t => t.date === today);
            const todayCommission = this.calculateTotalCommission(todayTransactions);

            const annualTransactions = this.allTransactions.filter(t => t.date.startsWith(currentYear));
            const annualCommission = this.calculateTotalCommission(annualTransactions);

            return [
                { title: 'Hoje', value: todayCommission },
                { title: 'Mensal', value: monthlyCommission },
                { title: 'Mês Passado', value: lastMonthCommission }, 
                { title: 'Anual', value: annualCommission },
                { title: 'Total', value: this.totalCommissionDisplayed },
            ];
        },
    },
};
</script>

<style scoped>
/* Estilos não alterados */
.layout {
    background-color: #0e0f0f;
    color: #fff;
    min-height: 100vh;
    font-family: 'Roboto', sans-serif;
}

.header-markup {
    margin: 20px;
}

.main-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: 30px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.main-header-left {
    width: 100%;
    text-align: left;
    
}

.main-content {
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
    gap: 15px;
    margin-bottom: 30px;
}

.card {
    background-color: #1e1e1e;
    padding: 15px;
    border-radius: 8px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
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
}

.date-filter span {
    display: block;
    text-align: left;
    font-size: 13px;
    color: #afafaf;
    margin-bottom: 5px;
}

.date-filter input, .select-country {
    background-color: #1e1e1e;
    color: #fff;
    border: 1px solid #333;
    padding: 8px;
    border-radius: 4px;
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

/* Tabela */
.table-container {
    overflow-x: auto;
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

@media (min-width: 992px) {
    .pdf-btn {
        width: auto;
        min-width: 190px;
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
	
	.date-filter, .select-country {
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

	.date-filter, 
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
	}
	
	.card p strong {
		font-size: 18px;
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