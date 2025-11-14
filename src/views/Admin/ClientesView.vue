<template>
	<div class="layout" ref="layoutContainer">
		<AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

		<main class="layout-content">
			<div class="background-glow"></div>
			<div class="background-grid"></div>
			<button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>

			<div class="container"> 
				<h1>{{ pageTitle }}</h1>
				<p>Monitoramento de usuàrios e contas vinculadas à Deriv</p>
				
				<div class="c-cards">
					<div class="c-card">
						<div class="c-card-title">TOTAL</div>
						<div class="c-card-value">{{ metrics.total }}</div>
					</div>

					<div class="c-card">
						<div class="c-card-title">CONTA REAL UTILIZADA</div>
						<div class="c-card-value">{{ metrics.realAccountUsed }}</div>
					</div>

					<div class="c-card">
						<div class="c-card-title">NOVOS HOJE</div>
						<div class="c-card-value">{{ metrics.newToday }}</div> 	
					</div>

					<div class="c-card">
						<div class="c-card-title">NOVOS ESTA SEMANA</div>
						<div class="c-card-value">{{ metrics.newThisWeek }}</div>
					</div>

					<div class="c-card">
						<div class="c-card-title">NOVOS ESTE MÊS</div>
						<div class="c-card-value">{{ metrics.newThisMonth }}</div>
					</div>

					<div class="c-card">
						<div class="c-card-title">ATIVOS ESTA SEMANA</div>
						<div class="c-card-value">{{ metrics.activeThisWeek }}</div>
					</div>

					<div class="c-card">
						<div class="c-card-title">ATIVOS ESTE MÊS</div>
						<div class="c-card-value">{{ metrics.activeThisMonth }}</div>
					</div>
					
					<div class="c-card">
						<div class="c-card-title">SALDO 	$100</div>
						<div class="c-card-value">{{ metrics.balanceLess100 }}</div>
					</div>

					<div class="c-card">
						<div class="c-card-title">SALDO > $500</div>
						<div class="c-card-value">{{ metrics.balanceMore500 }}</div>
					</div>
					
					<div class="c-card">
						<div class="c-card-title">SALDO > $1000</div>
						<div class="c-card-value">{{ metrics.balanceMore1000 }}</div>
					</div>
					
					<div class="c-card">
						<div class="c-card-title">SALDO > $5000</div>
						<div class="c-card-value">{{ metrics.balanceMore5000 }}</div>
					</div>

				</div>

				<div class="list-controls c-mobile">
					<div class="controls-left">
						<button class="filter-btn">Filtrar por saldo</button>
						<button class="export-btn">Exportar Lista</button>
						<button class="update-btn">Atualizar dados</button>
					</div>
					<div class="controls-right">
						<select class="dropdown">
							<option>Todos</option>
						</select>
						<div class="search-group"> 
							<input type="text" placeholder="Buscar por nome, email ou ID de login">
							<button class="search-btn">Buscar</button>
						</div>
					</div>
				</div>

				<div class="c-table">
					<div class="list-controls c-desk">
						<div class="controls-left">
							<button class="filter-btn">Filtrar por saldo</button>
							<button class="export-btn">Exportar Lista</button>
							<button class="update-btn">Atualizar dados</button>
						</div>
						<div class="controls-right">
							<select class="dropdown">
								<option>Todos</option>
							</select>
							<div class="search-group"> 
								<input type="text" placeholder="Buscar por nome, email ou ID de login">
								<button class="search-btn">Buscar</button>
							</div>
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>Nome <span class="sort-icon"></span></th>
								<th>Login ID <span class="sort-icon"></span></th>
								<th>Email <span class="sort-icon"></span></th>
								<th>Saldo (USD) <span class="sort-icon"></span></th>
								<th>Tempo gasto <span class="sort-icon"></span></th>
								<th>Criado em <span class="sort-icon"></span></th>
								<th>Última atividade <span class="sort-icon"></span></th>
								<th>Número de WhatsApp</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="client in clients" :key="client.loginId">
								<td>{{ client.name }}</td>
								<td>{{ client.loginId }}</td>
								<td>{{ client.email }}</td>
								<td :class="{'positive-balance': client.balance > 0, 'zero-balance': client.balance === 0}">
									{{ formatCurrency(client.balance) }}
								</td>
								<td>{{ client.timeSpent }}</td>
								<td>{{ client.createdAt }}</td>
								<td>{{ client.lastActivity }}</td>
								<td>
									<button v-if="client.whatsapp" class="whatsapp-btn">
										<span class="c-icon"><img src="../../assets/icons/whattsapp.svg" alt="" width="15px" ></span>
										Conversar
									</button>
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

export default {
	name: 'ClientsView',
	components: {
		AppSidebar,
	},
	data() {
		return {
			isSidebarOpen: true,
			isSidebarCollapsed: false,
			pageTitle: 'Métricas dos Clientes', 
			// Dados simulados baseados na imagem
			metrics: {
				total: 453,
				realAccountUsed: 367,
				newToday: 12,
				newThisWeek: 45,
				newThisMonth: 112,
				activeThisWeek: 210,
				activeThisMonth: 350,
				balanceLess100: 89,
				balanceMore500: 156,
				balanceMore1000: 78,
				balanceMore5000: 23,
			},
			clients: [
				{
					name: 'João Silva',
					loginId: 'CR123456',
					email: 'joao.silva@example.com',
					balance: 1250.75,
					timeSpent: '12h 45m',
					createdAt: '2025-09-15',
					lastActivity: '2025-10-18',
					whatsapp: true
				},
				{
					name: 'Maria Oliveira',
					loginId: 'CR789012',
					email: 'maria.o@example.com',
					balance: 89.50,
					timeSpent: '8h 10m',
					createdAt: '2025-08-01',
					lastActivity: '2025-10-17',
					whatsapp: true
				},
				{
					name: 'Carlos Pereira',
					loginId: 'CR345678',
					email: 'carlos.p@example.com',
					balance: 0.00,
					timeSpent: '5h 30m',
					createdAt: '2025-07-20',
					lastActivity: '2025-09-30',
					whatsapp: true
				},
				{
					name: 'Ana Souza',
					loginId: 'CR987654',
					balance: 5120.99,
					email: 'ana.s@example.com',
					timeSpent: '20h 05m',
					createdAt: '2025-10-01',
					lastActivity: '2025-11-10',
					whatsapp: false // Não exibe o botão
				},
			]
		};
	},
	methods: {
		toggleSidebar() {
			this.isSidebarOpen = !this.isSidebarOpen;
		},
		toggleSidebarCollapse() {
			this.isSidebarCollapsed = !this.isSidebarCollapsed;
		},
		formatCurrency(value) {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 2
			}).format(value);
		}
	}
}
</script>

<style scoped>
/* Estilos Essenciais para Recriar o Layout da Imagem (Dark Mode) */

.layout {
	display: flex;
	min-height: 100vh;
	background-color: #121212; /* Fundo escuro */
	color: #e0e0e0; /* Texto claro */
	font-family: 'Roboto', sans-serif;

}

.layout-content {
	justify-content: flex-start;
	width: 100%;
}

.c-icon{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 15px;
	margin-right: 5px;
	filter: invert(0%) sepia(100%) saturate(0%) hue-rotate(90deg) brightness(1200%) contrast(100%);
	
}
.hamburger-btn {
	display: none;
}

/* Container principal com o cabeçalho */
.container {
	width: 100%; /* Garante que o container utilize o espaço disponível */
	margin: 0 auto;
}

h1 {
	font-size: 24px;
	margin-bottom: 5px;
	color: #ffffff;
	text-align: left;
}

p {
	font-size: 14px;
	color: #a0a0a0;
	margin-bottom: 20px;
	text-align: left;

}

/* Cards de Métricas */
.c-cards {
	display: grid;
	grid-template-columns: repeat(6, 1fr); 
	gap: 15px;
	margin-bottom: 30px;
}

.c-cards > :nth-child(7) {
	grid-column: 1 / span 1; 
}

.c-card {
	background-color: #1e1e1e;
	padding: 15px;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	border: 1px solid #333;
    text-align: left;
}

.c-card-title {
	font-size: 12px;
	color: #909090;
	margin-bottom: 5px;
	text-transform: uppercase;
}

.c-card-value {
	font-size: 24px;
	font-weight: bold;
	color: #3bda40; /* Cor verde para os valores */
}

.controls-left{
	display: flex;
	gap: 10px;
	align-items: center; 	
	flex-wrap: wrap;
	flex-direction: row
}

.controls-left button {
	padding: 8px 15px;
	margin-right: 10px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-weight: bold;
	width: fit-content;
}

.filter-btn, .export-btn {
	background-color: #1e1e1e;
	color: #e0e0e0;
	border: 1px solid #555;
}

.update-btn {
	background-color: #4CAF50; /* Verde */
	color: #fff;
}

@media (max-width: 1400px) {
	.c-cards {
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
	.c-cards > :nth-child(n) {
		grid-column: auto;
	}
}

.list-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding: 10px 0;
	flex-wrap: wrap;
}

/* **INÍCIO DA CORREÇÃO** para o campo de busca separado */
.controls-right {
	display: flex;
	gap: 10px; /* Adiciona espaçamento entre o select e o grupo de busca */
	align-items: center;
	flex-wrap: wrap; /* Permite quebrar linha em mobile */
}

.controls-right .dropdown {
	padding: 8px 15px;
	/* Estiliza o Select para parecer um botão pílula */
	border-radius: 25px; 
	border: none; /* Remove a borda padrão */
	background-color: #1e1e1e;
	color: #e0e0e0;
	appearance: none; /* Remove estilos nativos (chrome) */
	cursor: pointer;
}

/* Agrupa Input e Botão de Busca */
.search-group {
	display: flex;
	gap: 0; 
	align-items: center;
	background-color: #1e1e1e; 
	border: 1px solid #555; /* Borda do container arredondado */
	border-radius: 25px; 
}

.search-group input[type="text"] {
	padding: 8px 15px;
	border-radius: 25px 0 0 25px; /* Arredonda apenas o lado esquerdo */
	border: none; 
	background-color: #1e1e1e;
	color: #e0e0e0;
	flex-grow: 1; 
	outline: none; 
}

.search-group .search-btn {
	background-color: #00FF80; 
	color: #121212; 
	padding: 9px 15px;
	border: none;
	border-radius: 0 25px 25px 0; /* Arredonda apenas o lado direito */
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.2s;
}

.search-group .search-btn:hover {
	background-color: #00e676; 
}
/* **FIM DA CORREÇÃO** */


.c-table {
	overflow-x: auto;
	background-color: #1e1e1e;
	border-radius: 8px;
	padding: 20px;
    max-height: 600px;
    overflow-y: auto;
}

.c-table table {
	width: 100%;
	border-collapse: collapse;
}

.c-table th, .c-table td {
	padding: 12px 15px;
	text-align: left;
	white-space: nowrap;
}

.c-table thead th {
	color: #a0a0a0;
	font-size: 13px;
	border-bottom: 1px solid #333;
	cursor: pointer;
}

.c-table tbody td {
	border-bottom: 1px solid #282828;
	font-size: 14px;
}

.c-table tbody tr:last-child td {
	border-bottom: none;
}

.c-table .positive-balance {
	color: #4CAF50; /* Verde para saldo positivo */
	font-weight: bold;
}

.c-table .zero-balance {
	color: #a0a0a0; /* Cinza para saldo zero */
}

/* Botão de Conversar no WhatsApp */
.whatsapp-btn {
	background-color: #4CAF50;
	color: #fff;
	border: none;
	padding: 5px 10px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: bold;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
}

.whatsapp-btn svg {
	margin-right: 5px;
}

@media (min-width: 768px) {
	.c-mobile{
		display: none;
	}
}

@media (max-width: 768px) {

	.c-desk{
		display: none;
	}

	.controls-left{
		display: flex;
		gap: 10px;
		align-items: center; 	
		flex-wrap: wrap;
		width: 100%;
		flex-direction: column;
		margin-bottom: 10px;
	}

	.controls-left button {
		padding: 8px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		width: 100%;
	}
}

</style>
