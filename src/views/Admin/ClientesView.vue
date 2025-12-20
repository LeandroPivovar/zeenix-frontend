<template>
	<div class="dashboard-layout" ref="layoutContainer">
		<div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
		
		<AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @toggle-collapse="toggleSidebarCollapse" @close-sidebar="isSidebarOpen = false" />

		<div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<TopNavbar 
				v-if="!isMobile"
				:is-sidebar-collapsed="isSidebarCollapsed"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
				@toggle-sidebar-collapse="toggleSidebarCollapse"
			/>
			
			<div v-if="isMobile" class="mobile-header-admin">
				<button class="menu-toggler-btn" @click="isSidebarOpen = true">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="mobile-brand">
					<span class="text-white font-bold text-lg">ZEN</span><span class="text-white font-bold text-lg">I</span><span class="text-[#22C55E] font-bold text-lg">X</span>
				</div>
			</div>

			<main class="layout-content">
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
					<div class="c-card-title">SALDO &lt; $100</div>
					<div class="c-card-value">{{ metrics.balanceLess100 }}</div>
				</div>

				<div class="c-card">
					<div class="c-card-title">SALDO &gt; $500</div>
					<div class="c-card-value">{{ metrics.balanceMore500 }}</div>
				</div>
				
				<div class="c-card">
					<div class="c-card-title">SALDO &gt; $1000</div>
					<div class="c-card-value">{{ metrics.balanceMore1000 }}</div>
				</div>
				
				<div class="c-card">
					<div class="c-card-title">SALDO &gt; $5000</div>
					<div class="c-card-value">{{ metrics.balanceMore5000 }}</div>
				</div>

				</div>

				<div class="list-controls c-mobile">
					<div class="controls-left">
						<button class="filter-btn">Filtrar por saldo</button>
						<button class="export-btn" @click="exportClients">Exportar Lista</button>
						<button class="update-btn" @click="updateData">Atualizar dados</button>
					</div>
					<div class="controls-right">
						<select class="dropdown" v-model="balanceFilter" @change="fetchClients">
							<option value="">Todos</option>
							<option value="less100">Saldo &lt; $100</option>
							<option value="more500">Saldo &gt; $500</option>
							<option value="more1000">Saldo &gt; $1000</option>
							<option value="more5000">Saldo &gt; $5000</option>
						</select>
						<div class="search-group"> 
							<input type="text" v-model="searchQuery" placeholder="Buscar por nome, email ou ID de login" @keyup.enter="performSearch">
							<button class="search-btn" @click="performSearch">Buscar</button>
						</div>
					</div>
				</div>

				<div class="c-table">
					<div class="list-controls c-desk">
						<div class="controls-left">
							<button class="filter-btn">Filtrar por saldo</button>
							<button class="export-btn" @click="exportClients">Exportar Lista</button>
							<button class="update-btn" @click="updateData">Atualizar dados</button>
						</div>
						<div class="controls-right">
							<select class="dropdown" v-model="balanceFilter" @change="fetchClients">
								<option value="">Todos</option>
								<option value="less100">Saldo &lt; $100</option>
								<option value="more500">Saldo &gt; $500</option>
								<option value="more1000">Saldo &gt; $1000</option>
								<option value="more5000">Saldo &gt; $5000</option>
							</select>
							<div class="search-group"> 
								<input type="text" v-model="searchQuery" placeholder="Buscar por nome, email ou ID de login" @keyup.enter="performSearch">
								<button class="search-btn" @click="performSearch">Buscar</button>
							</div>
						</div>
					</div>
					<div v-if="loading" class="loading-message">Carregando clientes...</div>
					<div v-else-if="error" class="error-message">{{ error }}</div>
					<table v-else>
						<thead>
							<tr>
								<th>Nome <span class="sort-icon"></span></th>
								<th>Login ID <span class="sort-icon"></span></th>
								<th>Email <span class="sort-icon"></span></th>
								<th>Role</th>
								<th>Saldo (USD) <span class="sort-icon"></span></th>
								<th>Tempo gasto <span class="sort-icon"></span></th>
								<th>Criado em <span class="sort-icon"></span></th>
								<th>Última atividade <span class="sort-icon"></span></th>
								<th>Número de WhatsApp</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="client in clients" :key="client.userId">
								<td>{{ client.name }}</td>
								<td>{{ client.loginId }}</td>
								<td>{{ client.email }}</td>
								<td>
									<select 
										class="role-select" 
										:value="client.role" 
										@change="updateRole(client.userId, $event.target.value)"
										:class="getRoleClass(client.role)"
									>
										<option value="user">Usuário</option>
										<option value="admin">Admin</option>
										<option value="master_trader">Master Trader</option>
										<option value="expert">Expert</option>
									</select>
								</td>
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
	</div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';

export default {
	name: 'ClientsView',
	components: {
		AppSidebar,
		TopNavbar,
	},
	data() {
		return {
			isSidebarOpen: true,
			isSidebarCollapsed: false,
			isMobile: false,
			pageTitle: 'Métricas dos Clientes', 
			loading: true,
			error: null,
			metrics: {
				total: 0,
				realAccountUsed: 0,
				newToday: 0,
				newThisWeek: 0,
				newThisMonth: 0,
				activeThisWeek: 0,
				activeThisMonth: 0,
				balanceLess100: 0,
				balanceMore500: 0,
				balanceMore1000: 0,
				balanceMore5000: 0,
			},
			clients: [],
			searchQuery: '',
			balanceFilter: '',
		};
	},
	mounted() {
		this.fetchMetrics();
		this.fetchClients();
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
		},
		async fetchMetrics() {
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				const res = await fetch(`${apiBaseUrl}/clients/metrics`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						...(token && { 'Authorization': `Bearer ${token}` })
					}
				});
				
				if (!res.ok) {
					throw new Error('Erro ao buscar métricas');
				}
				
				const data = await res.json();
				this.metrics = data;
			} catch (err) {
				console.error('Erro ao buscar métricas:', err);
				this.error = 'Erro ao carregar métricas dos clientes';
			}
		},
		async fetchClients() {
			this.loading = true;
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				const params = new URLSearchParams();
				if (this.searchQuery) {
					params.append('search', this.searchQuery);
				}
				if (this.balanceFilter) {
					params.append('balanceFilter', this.balanceFilter);
				}
				
				const url = `${apiBaseUrl}/clients/list${params.toString() ? '?' + params.toString() : ''}`;
				
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						...(token && { 'Authorization': `Bearer ${token}` })
					}
				});
				
				if (!res.ok) {
					throw new Error('Erro ao buscar clientes');
				}
				
				const data = await res.json();
				this.clients = data.clients;
			} catch (err) {
				console.error('Erro ao buscar clientes:', err);
				this.error = 'Erro ao carregar lista de clientes';
			} finally {
				this.loading = false;
			}
		},
		async updateData() {
			await this.fetchMetrics();
			await this.fetchClients();
		},
		async exportClients() {
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				const res = await fetch(`${apiBaseUrl}/clients/export`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						...(token && { 'Authorization': `Bearer ${token}` })
					}
				});
				
				if (!res.ok) {
					throw new Error('Erro ao exportar clientes');
				}
				
				const data = await res.json();
				
				// Converter para CSV
				const csv = this.convertToCSV(data);
				const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
				const link = document.createElement('a');
				const url = URL.createObjectURL(blob);
				link.setAttribute('href', url);
				link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			} catch (err) {
				console.error('Erro ao exportar clientes:', err);
				this.$root.$toast.error('Erro ao exportar lista de clientes');
			}
		},
		convertToCSV(data) {
			const headers = ['Nome', 'Login ID', 'Email', 'Saldo (USD)', 'Tempo gasto', 'Criado em', 'Última atividade'];
			const rows = data.map(client => [
				client.name,
				client.loginId,
				client.email,
				client.balance,
				client.timeSpent,
				client.createdAt,
				client.lastActivity
			]);
			
			const csvContent = [
				headers.join(','),
				...rows.map(row => row.join(','))
			].join('\n');
			
			return csvContent;
		},
		performSearch() {
			this.fetchClients();
		},
		getRoleClass(role) {
			const classes = {
				'admin': 'role-admin',
				'master_trader': 'role-master',
				'expert': 'role-expert',
				'user': 'role-user'
			};
			return classes[role] || 'role-user';
		},
		async updateRole(userId, newRole) {
			try {
				const token = localStorage.getItem('token');
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
				
				const res = await fetch(`${apiBaseUrl}/clients/${userId}/role`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						...(token && { 'Authorization': `Bearer ${token}` })
					},
					body: JSON.stringify({ role: newRole })
				});
				
				if (!res.ok) {
					throw new Error('Erro ao atualizar role');
				}
				
				const data = await res.json();
				
				if (data.success) {
					// Atualizar localmente
					const client = this.clients.find(c => c.userId === userId);
					if (client) {
						client.role = newRole;
					}
					console.log(`✅ Role atualizada: ${data.message}`);
				} else {
					console.error(`❌ Erro: ${data.message}`);
					alert(data.message);
				}
			} catch (err) {
				console.error('Erro ao atualizar role:', err);
				alert('Erro ao atualizar role do usuário');
			}
		}
	}
}
</script>

<style scoped>
/* Estilos Essenciais para Recriar o Layout da Imagem (Dark Mode) */

/* Layout Base - Padrão Dashboard */
.dashboard-layout {
	display: flex;
	min-height: 100vh;
	background-color: #0b0b0b;
	color: #e0e0e0;
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
	padding-top: 80px;
	background-color: #0b0b0b;
}

/* Mobile Header */
.mobile-header-admin {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 60px;
	background-color: #0b0b0b;
	z-index: 998;
	padding: 0 20px;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #1C1C1C;
}

.mobile-brand {
	display: flex;
	align-items: center;
}

.menu-toggler-btn {
	background-color: #1e1e1e;
	color: rgb(255, 255, 255);
	border: 1px solid #333;
	border-radius: 8px;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background-color 0.2s;
}

.menu-toggler-btn:hover {
	background-color: #2a2a2a;
}

/* Responsividade */
@media (max-width: 1024px) {
	.dashboard-content-wrapper {
		margin-left: 0;
	}
	
	.dashboard-content-wrapper.sidebar-collapsed {
		margin-left: 0;
	}
	
	.mobile-header-admin {
		display: flex;
	}
	
	.layout-content {
		padding-top: 80px;
	}
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
	color: #4CAF50; /* Cor verde para os valores */
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

.loading-message, .error-message {
	padding: 20px;
	text-align: center;
	color: #a0a0a0;
	font-size: 16px;
}

.error-message {
	color: #ff5252;
}

/* Estilos do Select de Role */
.role-select {
	padding: 6px 12px;
	border-radius: 20px;
	border: none;
	font-size: 12px;
	font-weight: bold;
	cursor: pointer;
	appearance: none;
	text-align: center;
	min-width: 120px;
	transition: all 0.2s ease;
}

.role-select:focus {
	outline: none;
	box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.4);
}

.role-user {
	background-color: #2a2a2a;
	color: #a0a0a0;
	border: 1px solid #444;
}

.role-admin {
	background-color: rgba(244, 67, 54, 0.2);
	color: #ff5252;
	border: 1px solid #ff5252;
}

.role-master {
	background-color: rgba(255, 193, 7, 0.2);
	color: #ffc107;
	border: 1px solid #ffc107;
}

.role-expert {
	background-color: rgba(33, 150, 243, 0.2);
	color: #2196f3;
	border: 1px solid #2196f3;
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