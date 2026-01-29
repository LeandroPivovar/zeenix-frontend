<template>
	<div class="dashboard-layout" ref="layoutContainer">
		<div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
		
		<AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @toggle-collapse="toggleSidebarCollapse" @close-sidebar="isSidebarOpen = false" @open-settings="showSettingsModal = true" />

		<div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<TopNavbar 
				:is-sidebar-collapsed="isSidebarCollapsed"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
				@toggle-sidebar-collapse="toggleSidebarCollapse"
				@open-settings="showSettingsModal = true"
			/>

			<main class="layout-content">
				<div class="container"> 
				<h1 style="font-size: 20px;">{{ pageTitle }}</h1>
				<p style="font-size: 14px;">Monitoramento de usuários e contas vinculadas à Deriv</p>
				
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
					<button class="filter-btn" @click="openFilterModal">Filtrar</button>
					<div class="controls-row-buttons">
						<button class="export-btn" @click="exportClients">Exportar Lista</button>
						<button class="update-btn" @click="updateData">Atualizar dados</button>
					</div>
					<div class="search-group"> 
						<input type="text" v-model="searchQuery" placeholder="Buscar por nome, email ou ID de login" @keyup.enter="performSearch">
						<button class="search-btn" @click="performSearch">Buscar</button>
					</div>
					<select class="dropdown" v-model="balanceFilter" @change="fetchClients">
						<option value="">Todos</option>
						<option value="less100">Saldo &lt; $100</option>
						<option value="more500">Saldo &gt; $500</option>
						<option value="more1000">Saldo &gt; $1000</option>
						<option value="more5000">Saldo &gt; $5000</option>
					</select>
				</div>

				<!-- Tabela Desktop -->
				<div class="c-table desktop-table">
					<div class="list-controls c-desk">
						<div class="controls-left">
							<button class="filter-btn" @click="openFilterModal">
								<span class="c-icon" style="filter: none; margin-right: 5px;">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
									</svg>
								</span>
								Filtrar
							</button>
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
								<th @click="handleSort('name')" class="sortable-header">
									Nome <span class="sort-icon">{{ getSortIndicator('name') }}</span>
								</th>
								<th @click="handleSort('loginId')" class="sortable-header">
									Login ID <span class="sort-icon">{{ getSortIndicator('loginId') }}</span>
								</th>
								<th @click="handleSort('email')" class="sortable-header">
									Email <span class="sort-icon">{{ getSortIndicator('email') }}</span>
								</th>
								<th>Role</th>
								<th @click="handleSort('balance')" class="sortable-header">
									Saldo (USD) <span class="sort-icon">{{ getSortIndicator('balance') }}</span>
								</th>
								<th>Tempo gasto</th>
								<th @click="handleSort('createdAt')" class="sortable-header">
									Criado em <span class="sort-icon">{{ getSortIndicator('createdAt') }}</span>
								</th>
								<th>Última atividade</th>
								<th>Período de Atividade</th>
								<th>WhatsApp</th>
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
								<td>{{ client.activityPeriod || '-' }}</td>
								<td>
									<button v-if="client.whatsappNumber" class="whatsapp-btn" @click="openWhatsapp(client.whatsappNumber)">
										<span class="c-icon"><img src="../../assets/icons/whattsapp.svg" alt="" width="15px" ></span>
										{{ client.whatsappNumber }}
									</button>
									<span v-else class="text-muted">-</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Cards Mobile -->
				<div class="mobile-clients-cards">
					<div v-if="loading" class="mobile-client-card empty-state">
						<p>Carregando clientes...</p>
					</div>
					<div v-else-if="error" class="mobile-client-card empty-state error">
						<p>{{ error }}</p>
					</div>
					<div v-else v-for="client in clients" :key="client.userId" class="mobile-client-card">
						<div class="card-header-client">
							<h3 class="card-client-name">{{ client.name }}</h3>
							<div class="card-client-balance" :class="{'positive-balance': client.balance > 0, 'zero-balance': client.balance === 0}">
								{{ formatCurrency(client.balance) }}
							</div>
						</div>
						<div class="card-body-client">
							<div class="card-row-client">
								<span class="card-label-client">Login ID:</span>
								<span class="card-value-client">{{ client.loginId }}</span>
							</div>
							<div class="card-row-client">
								<span class="card-label-client">Email:</span>
								<span class="card-value-client">{{ client.email }}</span>
							</div>
							<div class="card-row-client">
								<span class="card-label-client">Role:</span>
								<span class="card-value-client">
									<select 
										class="role-select-mobile" 
										:value="client.role" 
										@change="updateRole(client.userId, $event.target.value)"
										:class="getRoleClass(client.role)"
									>
										<option value="user">Usuário</option>
										<option value="admin">Admin</option>
										<option value="master_trader">Master Trader</option>
										<option value="expert">Expert</option>
									</select>
								</span>
							</div>
							<div class="card-row-client">
								<span class="card-label-client">Tempo gasto:</span>
								<span class="card-value-client">{{ client.timeSpent }}</span>
							</div>
							<div class="card-row-client">
								<span class="card-label-client">Criado em:</span>
								<span class="card-value-client">{{ client.createdAt }}</span>
							</div>
							<div class="card-row-client">
								<span class="card-label-client">Última atividade:</span>
								<span class="card-value-client">{{ client.lastActivity }}</span>
							</div>
							<div class="card-row-client" v-if="client.whatsapp">
								<span class="card-label-client">WhatsApp:</span>
								<span class="card-value-client">
									<button class="whatsapp-btn-mobile">
										<span class="c-icon"><img src="../../assets/icons/whattsapp.svg" alt="" width="15px" ></span>
										Conversar
									</button>
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

		<!-- Filter Modal -->
		<Teleport to="body">
			<div v-if="showFilterModal" class="modal-overlay" @click.self="closeFilterModal">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">Filtros de Clientes</h3>
						<button class="modal-close-btn" @click="closeFilterModal">
							<i class="fas fa-times">X</i>
						</button>
					</div>
					<div class="modal-body">
						<!-- Option 1: Only Real Account -->
						<div class="filter-option" @click="toggleOnlyRealAccount">
							<div class="filter-info">
								<span class="filter-label">Somente conta real</span>
								<p class="filter-desc">Exibe apenas usuários com conta real e seus saldos reais</p>
							</div>
							<div class="custom-checkbox" :class="{ 'checked': tempFilters.onlyRealAccount }">
								<i class="fas fa-check" v-if="tempFilters.onlyRealAccount" style="color: white; font-size: 12px;">✓</i>
							</div>
						</div>

						<!-- Option 2: Balance Interval -->
						<div class="filter-option" @click="openBalanceIntervalModal">
							<div class="filter-info">
								<span class="filter-label">Intervalo de saldo</span>
								<p class="filter-desc">Filtrar por valor mínimo e máximo (Somente Conta Real)</p>
							</div>
							<i class="fas fa-chevron-right" style="color: #6b7280;">></i>
						</div>
						<div v-if="tempFilters.minBalance !== null || tempFilters.maxBalance !== null" class="active-filter-tag">
							Saldo: {{ formatCurrency(tempFilters.minBalance || 0) }} - {{ tempFilters.maxBalance ? formatCurrency(tempFilters.maxBalance) : '∞' }}
							<span @click.stop="clearBalanceFilter" class="clear-tag">×</span>
						</div>

						<!-- Option 3: Users without balance -->
						<div class="filter-option" @click="toggleNoRealBalance">
							<div class="filter-info">
								<span class="filter-label">Usuários sem saldo na conta real</span>
								<p class="filter-desc">Exibe usuários com conta real zerada</p>
							</div>
							<div class="custom-checkbox" :class="{ 'checked': tempFilters.noRealBalance }">
								<i class="fas fa-check" v-if="tempFilters.noRealBalance" style="color: white; font-size: 12px;">✓</i>
							</div>
						</div>

                        <!-- Option 4: Activity Period -->
                        <div class="filter-section">
                            <span class="filter-label">Período de Atividade</span>
                            <div class="chips-container">
                                <div 
                                    class="chip" 
                                    :class="{ active: tempFilters.activityPeriod === 'Manhã' }"
                                    @click="toggleActivityPeriod('Manhã')"
                                >Manhã</div>
                                <div 
                                    class="chip" 
                                    :class="{ active: tempFilters.activityPeriod === 'Tarde' }"
                                    @click="toggleActivityPeriod('Tarde')"
                                >Tarde</div>
                                <div 
                                    class="chip" 
                                    :class="{ active: tempFilters.activityPeriod === 'Noite' }"
                                    @click="toggleActivityPeriod('Noite')"
                                >Noite</div>
                                <div 
                                    class="chip" 
                                    :class="{ active: tempFilters.activityPeriod === 'Madrugada' }"
                                    @click="toggleActivityPeriod('Madrugada')"
                                >Madrugada</div>
                            </div>
                        </div>
					</div>
					<div class="modal-footer">
						<button class="btn-secondary" @click="clearAllFilters">Limpar</button>
						<button class="btn-primary" @click="applyFilters">Aplicar Filtros</button>
					</div>
				</div>
			</div>
		</Teleport>

		<!-- Balance Interval Modal (Second Modal) -->
		<Teleport to="body">
			<div v-if="showBalanceIntervalModal" class="modal-overlay" @click.self="showBalanceIntervalModal = false">
				<div class="modal-content small-modal">
					<div class="modal-header">
						<h3 class="modal-title">Intervalo de Saldo</h3>
						<button class="modal-close-btn" @click="showBalanceIntervalModal = false">
							<i class="fas fa-times">X</i>
						</button>
					</div>
					<div class="modal-body">
						<p class="modal-subtitle">Defina o intervalo de saldo para contas reais.</p>
						<div class="form-group">
							<label>Saldo Mínimo ($)</label>
							<input type="number" v-model.number="tempMinBalance" placeholder="0.00" class="form-input">
						</div>
						<div class="form-group">
							<label>Saldo Máximo ($)</label>
							<input type="number" v-model.number="tempMaxBalance" placeholder="Sem limite" class="form-input">
						</div>
					</div>
					<div class="modal-footer">
						<button class="btn-secondary" @click="showBalanceIntervalModal = false">Cancelar</button>
						<button class="btn-primary" @click="saveBalanceInterval">Confirmar</button>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';

export default {
	name: 'ClientsView',
	components: {
		AppSidebar,
		TopNavbar,
		SettingsSidebar,
	},
	data() {
		return {
			isSidebarOpen: true,
			isSidebarCollapsed: false,
			isMobile: false,
			showSettingsModal: false,
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
			
			// Sorting
			sortBy: 'createdAt',
			sortOrder: 'DESC',
			
			// Filter Modal State
			showFilterModal: false,
			showBalanceIntervalModal: false,
			
			// Filters
			filters: {
				onlyRealAccount: false,
				noRealBalance: false,
				minBalance: null,
				maxBalance: null,
                activityPeriod: null
			},
			
			// Temp filters for modal (to allow cancel)
            tempFilters: {
				onlyRealAccount: false,
				noRealBalance: false,
				minBalance: null,
				maxBalance: null,
                activityPeriod: null
            },
			
			// Temp storage for interval modal
			tempMinBalance: null,
			tempMaxBalance: null
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
				
				// Sorting
				if (this.sortBy) params.append('sortBy', this.sortBy);
				if (this.sortOrder) params.append('sortOrder', this.sortOrder);
				
				// Novos filtros
				if (this.filters.onlyRealAccount) params.append('onlyRealAccount', 'true');
				if (this.filters.noRealBalance) params.append('noRealBalance', 'true');
				if (this.filters.minBalance !== null) params.append('minBalance', this.filters.minBalance);
				if (this.filters.maxBalance !== null) params.append('maxBalance', this.filters.maxBalance);
                if (this.filters.activityPeriod) params.append('activityPeriod', this.filters.activityPeriod);
				
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
					await alert(data.message);
				}
			} catch (err) {
				console.error('Erro ao atualizar role:', err);
				await alert('Erro ao atualizar role do usuário');
			}
		},
		
		// Filter Methods
		// Filter Methods
		openFilterModal() {
			// Copy current filters to temp
			this.tempFilters = { ...this.filters };
			this.showFilterModal = true;
		},
		closeFilterModal() {
			this.showFilterModal = false;
		},
		toggleOnlyRealAccount() {
			this.tempFilters.onlyRealAccount = !this.tempFilters.onlyRealAccount;
			if (this.tempFilters.onlyRealAccount) {
				this.tempFilters.noRealBalance = false;
				this.tempFilters.minBalance = null;
				this.tempFilters.maxBalance = null;
			}
		},
		toggleNoRealBalance() {
			this.tempFilters.noRealBalance = !this.tempFilters.noRealBalance;
			if (this.tempFilters.noRealBalance) {
				this.tempFilters.onlyRealAccount = false;
				this.tempFilters.minBalance = null;
				this.tempFilters.maxBalance = null;
			}
		},
		openBalanceIntervalModal() {
			this.tempMinBalance = this.tempFilters.minBalance;
			this.tempMaxBalance = this.tempFilters.maxBalance;
			this.showBalanceIntervalModal = true;
		},
		saveBalanceInterval() {
			// Convert empty strings to null
			const min = this.tempMinBalance === '' || this.tempMinBalance === null ? null : Number(this.tempMinBalance);
			const max = this.tempMaxBalance === '' || this.tempMaxBalance === null ? null : Number(this.tempMaxBalance);
			
			this.tempFilters.minBalance = min;
			this.tempFilters.maxBalance = max;
			
			// If interval is set, clear other modes
			if (this.tempFilters.minBalance !== null || this.tempFilters.maxBalance !== null) {
				this.tempFilters.onlyRealAccount = false;
				this.tempFilters.noRealBalance = false;
			}
			
			this.showBalanceIntervalModal = false;
		},
		clearBalanceFilter() {
			this.tempFilters.minBalance = null;
			this.tempFilters.maxBalance = null;
			// No need to set others, just clearing interval
		},
		clearAllFilters() {
			this.filters = {
				onlyRealAccount: false,
				noRealBalance: false,
				minBalance: null,
				maxBalance: null,
                activityPeriod: null
			};
			this.tempFilters = { ...this.filters }; // Sync temp
			this.fetchClients();
			this.closeFilterModal();
		},
		applyFilters() {
			this.filters = { ...this.tempFilters }; // Commit temp to actual
			this.fetchClients();
			this.closeFilterModal();
		},
        
        toggleActivityPeriod(period) {
            if (this.tempFilters.activityPeriod === period) {
                this.tempFilters.activityPeriod = null; // Toggle off
            } else {
                this.tempFilters.activityPeriod = period;
            }
        },
		
		// Sorting Methods
		handleSort(column) {
			if (this.sortBy === column) {
				// Toggle order
				this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
			} else {
				this.sortBy = column;
				this.sortOrder = 'DESC'; // Default to DESC for new column
			}
			this.fetchClients();
		},
		getSortIndicator(column) {
			if (this.sortBy !== column) return '';
			return this.sortOrder === 'ASC' ? '▲' : '▼';
		},
        openWhatsapp(number) {
            // Remove non-numeric characters
            const cleanNumber = number.replace(/\D/g, '');
            window.open(`https://wa.me/${cleanNumber}`, '_blank');
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
	width: calc(100% - 280px);
}

.dashboard-content-wrapper.sidebar-collapsed {
	margin-left: 80px;
}

.layout-content {
	flex-grow: 1;
	padding: 20px;
	padding-top: 50px;
	background-color: #0b0b0b;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
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
	margin: 2rem auto;
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
	color: rgb(34, 197, 94); /* Cor verde para os valores */
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
	background-color: rgb(34, 197, 94); /* Verde */
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

@media (max-width: 768px) {
	.c-cards {
		grid-template-columns: repeat(2, 1fr);
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
	background-color: rgb(34, 197, 94); 
	color: #121212; 
	padding: 9px 15px;
	border: none;
	border-radius: 0 25px 25px 0; /* Arredonda apenas o lado direito */
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.2s;
}

.search-group .search-btn:hover {
	background-color: rgb(28, 170, 80); 
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
	cursor: default; /* Default not clickable */
}

.c-table thead th.sortable-header {
	cursor: pointer;
	transition: color 0.2s;
}

.c-table thead th.sortable-header:hover {
	color: #fff;
}

.c-table .sort-icon {
	font-size: 10px;
	margin-left: 5px;
}

.c-table tbody td {
	border-bottom: 1px solid #282828;
	font-size: 14px;
}

.c-table tbody tr:last-child td {
	border-bottom: none;
}

.c-table .positive-balance {
	color: rgb(34, 197, 94); /* Verde para saldo positivo */
	font-weight: bold;
}

.c-table .zero-balance {
	color: #a0a0a0; /* Cinza para saldo zero */
}

/* Botão de Conversar no WhatsApp */
.whatsapp-btn {
	background-color: rgb(34, 197, 94);
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

/* Cards Mobile */
.mobile-clients-cards {
	display: none;
	flex-direction: column;
	gap: 15px;
	width: 100%;
	padding-bottom: 20px;
	overflow-y: auto;
	max-height: 800px;
}

.mobile-client-card {
	background-color: #1e1e1e;
	border-radius: 8px;
	padding: 20px;
	border: 1px solid #333;
	width: 100%;
	box-sizing: border-box;
}

.mobile-client-card.empty-state {
	text-align: center;
	padding: 40px 20px;
	color: #999;
}

.mobile-client-card.empty-state.error {
	color: #ff5252;
}

.card-header-client {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
	padding-bottom: 15px;
	border-bottom: 1px solid #333;
	gap: 10px;
	flex-wrap: wrap;
}

.card-client-name {
	font-size: 18px;
	font-weight: 600;
	color: #fff;
	margin: 0;
	flex: 1;
	min-width: 0;
	word-break: break-word;
	text-align: left;
}

.card-client-balance {
	font-size: 20px;
	font-weight: bold;
	flex-shrink: 0;
}

.card-client-balance.positive-balance {
	color: rgb(34, 197, 94);
}

.card-client-balance.zero-balance {
	color: #a0a0a0;
}

.card-body-client {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.card-row-client {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
	min-height: 24px;
}

.card-label-client {
	font-size: 14px;
	color: #999;
	font-weight: 500;
	flex-shrink: 0;
}

.card-value-client {
	font-size: 14px;
	color: #fff;
	text-align: right;
	flex: 1;
	margin-left: 10px;
	word-break: break-word;
}

.role-select-mobile {
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
	width: 100%;
	max-width: 150px;
}

.role-select-mobile:focus {
	outline: none;
	box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.4);
}

.whatsapp-btn-mobile {
	background-color: rgb(34, 197, 94);
	color: #fff;
	border: none;
	padding: 6px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: bold;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 5px;
}

/* Responsividade - Esconder/Mostrar Tabela e Cards */
@media (max-width: 768px) {
	.desktop-table {
		display: none !important;
	}
	
	.mobile-clients-cards {
		display: flex !important;
	}

	.c-desk{
		display: none;
	}

	.list-controls.c-mobile {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}

	.list-controls.c-mobile .filter-btn {
		width: 100%;
		padding: 8px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
		background-color: #1e1e1e;
		color: #e0e0e0;
		border: 1px solid #555;
	}

	.controls-row-buttons {
		display: flex;
		gap: 10px;
		width: 100%;
	}

	.controls-row-buttons button {
		flex: 1;
		padding: 8px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: bold;
	}

	.list-controls.c-mobile .search-group {
		width: 100%;
	}

	.list-controls.c-mobile .dropdown {
		width: 100%;
		padding: 8px 15px;
		border-radius: 25px;
		border: 1px solid #555;
		background-color: #1e1e1e;
		color: #e0e0e0;
		appearance: none;
		cursor: pointer;
	}
}

@media (min-width: 769px) {
	.desktop-table {
		display: block !important;
	}
	
	.mobile-clients-cards {
		display: none !important;
	}
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: #1e1e1e;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    border: 1px solid #333;
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
}

@media (min-width: 1025px) {
    .modal-content {
        margin-left: 280px;
        width: calc(100% - 280px);
    }
}

.modal-content.small-modal {
    max-width: 400px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.modal-subtitle {
    font-size: 0.9rem;
    color: #a0a0a0;
    margin-bottom: 20px;
}

.modal-close-btn {
    background: transparent;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 1rem;
    padding: 4px;
    transition: color 0.2s;
}

.modal-close-btn:hover {
    color: #fff;
}

.modal-body {
    padding: 24px;
}

.filter-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-option:hover {
    border-color: rgba(34, 197, 94, 0.3);
    background: rgba(34, 197, 94, 0.05);
}

.filter-info {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.filter-label {
    font-weight: 500;
    color: #fff;
    margin-bottom: 4px;
}

.filter-desc {
    font-size: 0.8rem;
    color: #a0a0a0;
    margin: 0;
}

.custom-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #555;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background: transparent;
}

.custom-checkbox.checked {
    background: #22c55e;
    border-color: #22c55e;
}

.active-filter-tag {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.clear-tag {
    cursor: pointer;
    font-weight: bold;
    margin-left: 10px;
}

.modal-footer {
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-primary, .btn-secondary {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: #22c55e;
    color: white;
    border: none;
}

.btn-primary:hover {
    background: #16a34a;
}

.btn-secondary {
    background: transparent;
    color: #a0a0a0;
    border: 1px solid #333;
}

.btn-secondary:hover {
    border-color: #555;
    color: #fff;
}

.form-group {
    margin-bottom: 16px;
    text-align: left;
}

.form-group label {
    display: block;
    color: #a0a0a0;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.form-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #333;
    color: #fff;
    padding: 10px 12px;
    border-radius: 8px;
    outline: none;
    font-size: 1rem;
}

.form-input:focus {
    border-color: #22c55e;
}

.filter-section {
    margin-top: 16px;
    padding: 0 16px;
}

.chips-container {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.chip {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.85rem;
    color: #a0a0a0;
    cursor: pointer;
    transition: all 0.2s;
}

.chip:hover {
    border-color: #22c55e;
    color: #fff;
}

.chip.active {
    background: #22c55e;
    color: #fff;
    border-color: #22c55e;
}
</style>