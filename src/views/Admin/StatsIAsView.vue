<template>
	<div class="layout">
		<main class="layout-content">
			<AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />
			
			<div class="main-header">
				<div class="main-header-left">
					<h1>Estatísticas das IAs</h1>
					<p>Monitoramento de performance e resultados das IAs cadastradas na Deriv.</p>
				</div>
				<div class="main-header-right">
					<button class="btn pdf-btn" @click="exportReportToPDF">
						<img src="../../assets/icons/box-down.svg" alt="Exportar PDF" width="20px"> Exportar Relatório
					</button>
				</div>
			</div>

			<div class="main-content">
				<div class="filter-controls">
					<div class="date-filter">
						<input type="date" v-model="filterStartDate">
					</div>
					<div class="date-filter">
						<input type="date" v-model="filterEndDate">
					</div>
					<button class="btn btn-search" @click="fetchData">Buscar</button>
				</div>

				<div class="table-container" id="ia-stats-table">
					<table>
						<thead>
							<tr>
								<th class="bot-name-col">Nome do Bot</th>
								<th>Total de Trades</th>
								<th>Ganho</th>
								<th>Perda</th>
								<th class="profit-col">Lucro Total</th>
								<th>Lucro Alcançado</th>
								<th>Perda Alcançada</th>
								<th>Parada Ativada</th>
								<th>Risco Mais Usado</th>
								<th>Modo Mais Usado</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="bot in displayedStats" :key="bot.name">
								<td class="bot-name-col">
									<span :class="['status-dot', bot.status]"></span>
									{{ bot.name }}
								</td>
								<td>{{ bot.totalTrades }}</td>
								<td>{{ bot.wins }}</td>
								<td>{{ bot.losses }}</td>
								<td :class="['profit-col', bot.profit >= 0 ? 'positive-profit' : 'negative-profit']">
									{{ formatCurrency(bot.profit) }}
								</td>
								<td>{{ bot.profitReached }}</td>
								<td>{{ bot.lossReached }}</td>
								<td>{{ bot.activeStop }}</td>
								<td>{{ bot.riskMode }}</td>
								<td>{{ bot.tradeMode }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				
				<div class="bottom-summary-cards">
					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/robot.svg" alt="Total de IAs Ativas" class="card-icon" >
							<div class="card-text-group"> 
								<p class="card-value card-value-white">12</p>
								<h3 class="card-title">Total de IAs Ativas</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/stats.svg" alt="Lucro Combinado (7 dias)" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value positive-profit">+U$ 5.481,20</p>
								<h3 class="card-title">Lucro Combinado (7 dias)</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/target-IA.svg" alt="Média de Acerto Global" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value card-value-white">72,4%</p>
								<h3 class="card-title">Média de Acerto Global</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/trophy.svg" alt="IA com Maior Lucro" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value positive-profit">IA Zenix 2 <span class="card-value-white">(+3,848.93)</span></p>
								<h3 class="card-title">IA com Maior Lucro</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';

export default {
	name: 'StatsIAs',
	components: {
		AppSidebar,
	},
	data() {
		const currentDate = '2025-11-18';
		const startOfWeek = '2025-11-10'; 
	
		const botStats = [
			{ name: 'IA Zenix 2', status: 'active', totalTrades: 1320, wins: 1073, losses: 646, profit: 3848.93, profitReached: 399, lossReached: 0, activeStop: 71, riskMode: 'Conservador', tradeMode: 'Veloz' },
			{ name: 'IA Zenix 3', status: 'active', totalTrades: 2034, wins: 1456, losses: 845, profit: 1129.70, profitReached: 245, lossReached: 22, activeStop: 57, riskMode: 'Moderado', tradeMode: 'Veloz' },
			{ name: 'IA Orion V2', status: 'warning', totalTrades: 890, wins: 512, losses: 378, profit: 990.50, profitReached: 150, lossReached: 15, activeStop: 30, riskMode: 'Balanceado', tradeMode: 'Moderado' },
			{ name: 'IA Centauri', status: 'inactive', totalTrades: 315, wins: 150, losses: 165, profit: -210.00, profitReached: 40, lossReached: 55, activeStop: 25, riskMode: 'Agressivo', tradeMode: 'Lento' },
		];

		return {
			isSidebarOpen: true, 
			isSidebarCollapsed: false,
			
			filterStartDate: startOfWeek, 
			filterEndDate: currentDate,  

			allStats: botStats,
			displayedStats: botStats, 

			totalActiveIAs: 12,
			combinedProfit7Days: 5481.20,
			globalAccuracy: 72.4,
			topProfitIA: 'IA Zenix 2 (+3,848.93)',
			
			closeSidebar: () => { }, 
			toggleSidebarCollapse: () => {},
		};
	},
	methods: {
		formatCurrency(value) {
			const sign = value >= 0 ? '+' : ''; 
			const absoluteValue = Math.abs(value);
			return `${sign}${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(absoluteValue)}`;
		},
		
		fetchData() {
			console.log(`Buscando dados de ${this.filterStartDate} a ${this.filterEndDate}`);
			this.displayedStats = this.allStats; 
		},

		exportReportToPDF() {
			alert(`Download do PDF de Estatísticas iniciado! (Arquivo: Relatorio_IAs_${this.filterStartDate}_a_${this.filterEndDate}.pdf)`);
		}
	}
}
</script>

<style scoped>
.layout {
	background-color: #121212;
	color: #fff;
	min-height: 100vh;
	width: calc(100% - 240px);
	margin-left: 240px;
	padding: 0 20px;
	font-family: 'Roboto', sans-serif;
}

h1{
	font-weight: 700;
}

.layout-content {
	margin: 0;
	justify-content: flex-start;
}

.main-header {
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	margin-bottom: 30px;
	padding-top: 20px; 
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
	font-weight: 500; 
}

.pdf-btn {
	background-color: #00b862;
	color: #000000;
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	min-width: 190px;
}

.filter-controls {
	display: flex;
	gap: 10px; 
	align-items: center; 
	margin-bottom: 20px;
}

.date-filter input {
	background-color: #1e1e1e;
	color: #fff;
	border: 1px solid #333;
	padding: 8px;
	border-radius: 4px;
	font-family: 'Roboto', sans-serif;
}

.btn-search {
	background-color: #00b862;
	color: #fff;
}

/* Tabela */
.table-container {
	overflow-x: auto;
	overflow-y: auto;
	background: #191a19;
}

.table-container::-webkit-scrollbar {
	width: 8px;
	height: 8px; 
}

.table-container::-webkit-scrollbar-track {
	background: #2a2a2a;
}

.table-container::-webkit-scrollbar-thumb {
	background-color: #555; 
	border-radius: 4px; 
	border: 2px solid #2a2a2a; 
}

.table-container::-webkit-scrollbar-thumb:hover {
	background-color: #888;
}


table {
	width: 100%;
	overflow: hidden;
	margin-bottom: 30px; 
}

th, td {
	padding: 12px 15px;
	text-align: left;
	border-bottom: 1px solid #333;
	font-size: 13px; 
}

thead th {
	background-color: #252525;
	color: #ddd;
	font-weight: 600; 
	text-transform: uppercase;
	font-size: 11px; 
}

tbody tr {
	color: rgb(182, 182, 182);
	font-weight: 500;
}

tbody tr:hover {
	background-color: #2a2a2a;
}


.status-dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.status-dot.active {
	background-color: #00b862; 
}

.status-dot.warning {
	background-color: #ffc107; 
}

.status-dot.inactive {
	background-color: #dc3545; 
}

.profit-col {
	font-weight: bold;
}

.positive-profit {
	color: #00b862; 
}

.negative-profit {
	color: #dc3545; 
}

.bottom-summary-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr); 
	gap: 15px;
	margin-top: 20px;
}

.bottom-card {
	background-color: #1e1e1e;
	padding: 10px;
	border-radius: 8px;
	display: flex;
	height: 70px; 
	align-items: center; 
}

.bottom-card .card-content {
	display: flex;
	flex-direction: row; 
	justify-content: flex-start;
	align-items: center;
	text-align: left;
	gap: 15px;
	width: 100%;
}

.card-content {
	gap: 15px;
}

.card-icon {
	filter: invert(100%); 
	width: 30px;
	margin: 0 10px;
}

.card-text-group {
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-start;
	justify-content: center;
	gap: 2px; 
}

.bottom-card .card-title {
	font-size: 11px;
	color: #a7a7a7;
	margin: 0;
	text-transform: uppercase;
	font-weight: 500; 
}

.bottom-card .card-value {
	font-size: 18px;
	font-weight: 700; 
	margin: 0;
}

.card-value-white{
	color: white;
}

@media (min-width: 992px) {

    /* Tabela */
    .table-container {
        overflow-x: auto;
        min-height: 600px;
        overflow-y: auto;
        background: #191a19;
    }
}

@media (max-width: 992px) {
	.sidebar{
		display: none;
	}
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
	
	.filter-controls {
		flex-direction: row; 
		flex-wrap: wrap; 
	}
	
	.date-filter, .btn-search {
		width: calc(50% - 5px); 
	}

	.bottom-summary-cards {
		grid-template-columns: repeat(2, 1fr); 
	}

	.filter-controls {
		flex-direction: row; 
		align-items: stretch; 
		gap: 10px;
	}

	.pdf-btn {
		width: 100%;
	}

	th, td {
		width: 1000px;
	}

	.table-container {
		height: fit-content;
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
	.btn-search {
		width: 100%; 
	}
	
	.bottom-summary-cards {
		grid-template-columns: 1fr; 
	}
	
	.bottom-card .card-content {
		gap: 10px; 
	}
}
</style>