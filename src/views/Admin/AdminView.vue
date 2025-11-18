<template>
    <div class="layout">
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @toggle-collapse="toggleSidebarCollapse" 
            @close-sidebar="isSidebarOpen = false" 
        />

        <main class="layout-content">
            
            <button class="menu-toggler-btn" @click="isSidebarOpen = true" v-if="!isSidebarOpen">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="admin-dashboard">
                <header class="dashboard-header">
                    <h1>Painel Administrativo</h1>
                    <p>Controle total da operação, permissões e desempenho da plataforma.</p>
                </header>

                <section class="kpi-grid">
                    <div class="kpi-card" :class="{ 'loading': isLoadingStats }">
                        <span class="kpi-label">Admins ativos</span>
                        <span class="kpi-value value-green">{{ isLoadingStats ? '...' : kpis.activeAdmins }}</span>
                    </div>
                    <div class="kpi-card" :class="{ 'loading': isLoadingStats }">
                        <span class="kpi-label">Usuários ativos</span>
                        <span class="kpi-value value-green">{{ isLoadingStats ? '...' : kpis.activeUsers.toLocaleString('pt-BR') }}</span>
                    </div>
                    <div class="kpi-card" :class="{ 'loading': isLoadingStats }">
                        <span class="kpi-label">IAs em operação</span>
                        <span class="kpi-value value-green">{{ isLoadingStats ? '...' : kpis.iasInOperation }}</span>
                    </div>
                    <div class="kpi-card" :class="{ 'loading': isLoadingStats }">
                        <span class="kpi-label">Experts cadastrados</span>
                        <span class="kpi-value value-green">{{ isLoadingStats ? '...' : kpis.registeredExperts }}</span>
                    </div>
                    <div class="kpi-card" :class="{ 'loading': isLoadingStats }">
                        <span class="kpi-label">Volume gerenciado</span>
                        <span class="kpi-value value-green">{{ isLoadingStats ? '...' : '$' + kpis.managedVolume }}</span>
                    </div>
                    <div class="kpi-card" :class="{ 'loading': isLoadingStats }">
                        <span class="kpi-label">Comissão total (Markup)</span>
                        <span class="kpi-value value-green">{{ isLoadingStats ? '...' : '$' + kpis.totalCommission }}</span>
                    </div>
                </section>

                <section class="system-admins">
                    <div class="section-header">
                        <h2>Administradores do Sistema</h2>
                        <button class="btn btn-add-admin" @click="showAddAdminModal = true">+ Adicionar Novo Administrador</button>
                    </div>
                    <div class="table-container">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>NOME</th>
                                    <th>EMAIL</th>
                                    <th>PERMISSÃO</th>
                                    <th>ÚLTIMO LOGIN</th>
                                    <th>STATUS</th>
                                    <th>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="admin in admins" :key="admin.email">
                                    <td>{{ admin.name }}</td>
                                    <td>{{ admin.email }}</td>
                                    <td>{{ admin.permission }}</td>
                                    <td>{{ admin.lastLogin }}</td>
                                    <td>
                                        <span :class="['status-badge', admin.status.toLowerCase()]">
                                            {{ admin.status }}
                                        </span>
                                    </td>
                                    <td class="actions">
                                        <button @click="editAdmin(admin)" class="action-link">Editar</button>
                                        <button @click="toggleStatus(admin)" class="action-link">
                                            {{ admin.status === 'Ativo' ? 'Desativar' : 'Ativar' }}
                                        </button>
                                        <button @click="deleteAdmin(admin)" class="action-link delete">Excluir</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>


                <section class="logs-audit">
                    <div class="section-header">
                        <h2>Logs & Auditoria</h2>
                        <div class="log-actions">
                            <button class="btn btn-secondary">Exportar Logs</button>
                            <button class="btn btn-secondary filter-btn" @click="loadActivityLogs(logsPagination.currentPage, logsPagination.recordsPerPage)">
                                <i class="fa-solid fa-rotate-right" style="margin-right: 5px;"></i>
                                Atualizar
                            </button>
                        </div>
                    </div>
                    <div class="table-container" :class="{ 'loading': isLoadingLogs }">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>DATA/HORA</th>
                                    <th>AÇÃO</th>
                                    <th>USUÁRIO</th>
                                    <th>IP</th>
                                    <th>RESULTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLoadingLogs">
                                    <td colspan="5" style="text-align: center; padding: 2rem; color: #999;">
                                        Carregando logs...
                                    </td>
                                </tr>
                                <tr v-else-if="logs.length === 0">
                                    <td colspan="5" style="text-align: center; padding: 2rem; color: #999;">
                                        Nenhum log de atividade encontrado
                                    </td>
                                </tr>
                                <tr v-else v-for="(log, index) in logs" :key="log.id || index">
                                    <td>{{ log.dateTime }}</td>
                                    <td>{{ log.action }}</td>
                                    <td>{{ log.user }}</td>
                                    <td>{{ log.ip }}</td>
                                    <td>
                                        <span :class="['result-icon', log.result === 'Sucesso' ? 'success' : 'failure']">
                                            {{ log.result === 'Sucesso' ? '✅' : '❌' }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Controles de Paginação -->
                    <div class="pagination-controls" v-if="logsPagination.totalPages > 1">
                        <div class="pagination-info">
                            <span>Mostrando {{ (logsPagination.currentPage - 1) * logsPagination.recordsPerPage + 1 }} - {{ Math.min(logsPagination.currentPage * logsPagination.recordsPerPage, logsPagination.totalRecords) }} de {{ logsPagination.totalRecords }} registros</span>
                            
                            <div class="records-per-page">
                                <label>Por página:</label>
                                <select @change="changeLogsPerPage($event.target.value)" :value="logsPagination.recordsPerPage">
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>

                        <div class="pagination-buttons">
                            <button 
                                class="btn-pagination" 
                                @click="goToLogsPage(1)" 
                                :disabled="!logsPagination.hasPreviousPage || isLoadingLogs"
                            >
                                <i class="fa-solid fa-angles-left"></i>
                            </button>
                            
                            <button 
                                class="btn-pagination" 
                                @click="goToLogsPage(logsPagination.currentPage - 1)" 
                                :disabled="!logsPagination.hasPreviousPage || isLoadingLogs"
                            >
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>

                            <div class="page-numbers">
                                <button 
                                    v-for="(page, idx) in getVisiblePages()" 
                                    :key="`page-${idx}`"
                                    class="btn-page-number" 
                                    :class="{ 'active': page === logsPagination.currentPage, 'ellipsis': page === '...' }"
                                    @click="page !== '...' ? goToLogsPage(page) : null"
                                    :disabled="isLoadingLogs || page === '...'"
                                >
                                    {{ page }}
                                </button>
                            </div>

                            <button 
                                class="btn-pagination" 
                                @click="goToLogsPage(logsPagination.currentPage + 1)" 
                                :disabled="!logsPagination.hasNextPage || isLoadingLogs"
                            >
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>
                            
                            <button 
                                class="btn-pagination" 
                                @click="goToLogsPage(logsPagination.totalPages)" 
                                :disabled="!logsPagination.hasNextPage || isLoadingLogs"
                            >
                                <i class="fa-solid fa-angles-right"></i>
                            </button>
                        </div>
                    </div>
                </section>


                <section class="permission-control">
                    <div class="section-header">
                        <h2>Controle de Permissões</h2>
                    </div>
                    <div class="permission-cards-grid">
                        <div class="permission-card card">
                            <div class="card-details">
                                <span class="card-title">Estatísticas das IAs</span>
                                <span class="card-detail">4 administradores com acesso</span>
                            </div>
                            <button class="btn btn-manage btn-manage-green">Gerenciar</button>
                        </div>

                        <div class="permission-card card">
                            <div class="card-details">
                                <span class="card-title">Clientes</span>
                                <span class="card-detail">2 administradores com acesso</span>
                            </div>
                            <button class="btn btn-manage btn-manage-green">Gerenciar</button>
                        </div>

                        <div class="permission-card card">
                            <div class="card-details">
                                <span class="card-title">Ver Finanças</span>
                                <span class="card-detail">1 administrador com acesso</span>
                            </div>
                            <button class="btn btn-manage btn-manage-green">Gerenciar</button>
                        </div>
                    </div>
                </section>

                <section class="config-section">
                    <div class="config-card">
                        <h2>Configurações Gerais</h2>
                        
                        <div class="config-item">
                            <span class="toggle-label">Modo manutenção</span>
                            <div :class="['toggle-switch-admin', { active: config.modoManutencao }]" @click="config.modoManutencao = !config.modoManutencao">
                                <span class="slider round"></span>
                            </div>
                        </div>

                        <div class="config-item">
                            <span class="toggle-label">Alertas em tempo real</span>
                            <div :class="['toggle-switch-admin', { active: config.alertasTempoReal }]" @click="config.alertasTempoReal = !config.alertasTempoReal">
                                <span class="slider round"></span>
                            </div>
                        </div>

                        <div class="config-item">
                            <span class="toggle-label">Permitir novas contas</span>
                            <div :class="['toggle-switch-admin', { active: config.permitirNovasContas }]" @click="config.permitirNovasContas = !config.permitirNovasContas">
                                <span class="slider round"></span>
                            </div>
                        </div>

                        <div class="config-item">
                            <span class="toggle-label">Logs detalhados</span>
                            <div :class="['toggle-switch-admin', { active: config.logsDetalhados }]" @click="config.logsDetalhados = !config.logsDetalhados">
                                <span class="slider round"></span>
                            </div>
                        </div>

                        <div class="config-item">
                            <span class="toggle-label">Modo seguro API (Deriv)</span>
                            <div :class="['toggle-switch-admin', { active: config.modoSeguroApi }]" @click="config.modoSeguroApi = !config.modoSeguroApi">
                                <span class="slider round"></span>
                            </div>
                        </div>

                        <button class="btn-save-config" @click="saveConfigurations">Salvar Configurações</button>
                    </div>
                </section>
            </div>
        </main>
        
        <transition name="modal-fade">
            <div class="modal-overlay" v-if="showAddAdminModal" @click.self="showAddAdminModal = false">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Adicionar Novo Administrador</h3>
                        <button class="close-button" @click="showAddAdminModal = false">×</button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="addNewAdmin">
                            <div class="form-group">
                                <label for="adminName">Nome Completo</label>
                                <input type="text" id="adminName" v-model="newAdmin.name" required>
                            </div>
                            <div class="form-group">
                                <label for="adminEmail">Email</label>
                                <input type="email" id="adminEmail" v-model="newAdmin.email" required>
                            </div>
                            <div class="form-group">
                                <label for="adminPermission">Permissão</label>
                                <select id="adminPermission" v-model="newAdmin.permission" required>
                                    <option value="Super Admin">Super Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Suporte">Suporte</option>
                                    <option value="Visualizador">Visualizador</option>
                                </select>
                            </div>
                            
                            <div class="modal-actions">
                                <button type="submit" class="btn btn-save-config">Adicionar Administrador</button>
                                <button type="button" class="btn btn-secondary" @click="showAddAdminModal = false">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';

export default {
    name: 'AdminView',
    components: {
        AppSidebar
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth > 1024,
            isSidebarCollapsed: false,
            
            showAddAdminModal: false, 
            
            newAdmin: {
                name: '',
                email: '',
                permission: 'Editor', 
                lastLogin: 'Nunca',
                status: 'Ativo',
            },

            kpis: {
                activeAdmins: 0,
                activeUsers: 0,
                iasInOperation: 48,
                registeredExperts: 12,
                managedVolume: '$0',
                totalCommission: '$0',
            },
            
            isLoadingStats: true,
            nonDemoUsers: [],
            admins: [],
            logs: [],
            isLoadingLogs: false,
            logsPagination: {
                currentPage: 1,
                totalPages: 1,
                totalRecords: 0,
                recordsPerPage: 10,
                hasNextPage: false,
                hasPreviousPage: false,
            },
            config: {
                modoManutencao: false,
                alertasTempoReal: true,
                permitirNovasContas: true,
                logsDetalhados: false,
                modoSeguroApi: false,
            }
        };
    },
    async mounted() {
        window.addEventListener('resize', this.handleResize);
        await this.loadAdminStats();
        await this.loadNonDemoUsers();
        await this.loadAdministrators();
        await this.loadActivityLogs();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        async loadAdminStats() {
            this.isLoadingStats = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/admin/stats',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Falha ao carregar estatísticas');
                }

                const data = await response.json();
                
                this.kpis = {
                    activeAdmins: data.activeAdmins || 0,
                    activeUsers: data.activeUsers || 0,
                    iasInOperation: 48, // TODO: Implementar no backend
                    registeredExperts: 12, // TODO: Implementar no backend
                    managedVolume: data.managedVolume?.totalFormatted || '$0',
                    totalCommission: data.managedVolume?.estimatedCommissionFormatted || '$0',
                };
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
                alert('Erro ao carregar estatísticas do painel');
            } finally {
                this.isLoadingStats = false;
            }
        },

        async loadNonDemoUsers() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/admin/users/non-demo',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Falha ao carregar usuários');
                }

                this.nonDemoUsers = await response.json();
                console.log('Usuários não-demo carregados:', this.nonDemoUsers.length);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
            }
        },

        async loadAdministrators() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/admin/administrators',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Falha ao carregar administradores');
                }

                this.admins = await response.json();
                console.log('Administradores carregados:', this.admins.length);
            } catch (error) {
                console.error('Erro ao carregar administradores:', error);
                alert('Erro ao carregar lista de administradores');
            }
        },

        async loadActivityLogs(page = 1, limit = 10) {
            this.isLoadingLogs = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + 
                    `/admin/activity-logs?page=${page}&limit=${limit}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Falha ao carregar logs');
                }

                const result = await response.json();
                this.logs = result.data;
                this.logsPagination = result.pagination;
                console.log('Logs de atividade carregados:', this.logs.length, 'de', result.pagination.totalRecords);
            } catch (error) {
                console.error('Erro ao carregar logs:', error);
                // Não mostrar alert para logs, apenas log no console
            } finally {
                this.isLoadingLogs = false;
            }
        },

        goToLogsPage(page) {
            if (page >= 1 && page <= this.logsPagination.totalPages) {
                this.loadActivityLogs(page, this.logsPagination.recordsPerPage);
            }
        },

        changeLogsPerPage(limit) {
            this.loadActivityLogs(1, parseInt(limit));
        },

        getVisiblePages() {
            const current = this.logsPagination.currentPage;
            const total = this.logsPagination.totalPages;
            const visible = [];

            if (total <= 7) {
                // Mostrar todas as páginas
                for (let i = 1; i <= total; i++) {
                    visible.push(i);
                }
            } else {
                // Mostrar páginas com reticências
                if (current <= 4) {
                    for (let i = 1; i <= 5; i++) visible.push(i);
                    visible.push('...');
                    visible.push(total);
                } else if (current >= total - 3) {
                    visible.push(1);
                    visible.push('...');
                    for (let i = total - 4; i <= total; i++) visible.push(i);
                } else {
                    visible.push(1);
                    visible.push('...');
                    for (let i = current - 1; i <= current + 1; i++) visible.push(i);
                    visible.push('...');
                    visible.push(total);
                }
            }

            return visible;
        },

        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        
        handleResize() {
            if (window.innerWidth > 1024) {
                this.isSidebarOpen = true;
            } else {
                this.isSidebarOpen = false;
            }
        },
        
        saveConfigurations() {
            console.log('Configurações salvas:', this.config);
            alert('Configurações salvas com sucesso!');
        },
        editAdmin(admin) {
            alert(`Editando: ${admin.name}`);
        },
        
        async toggleStatus(admin) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + `/admin/administrators/${admin.id}/toggle-status`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Falha ao alterar status');
                }

                const updated = await response.json();
                admin.status = updated.status;
                alert(`Status alterado para: ${updated.status}`);
            } catch (error) {
                console.error('Erro ao alterar status:', error);
                alert('Erro ao alterar status do administrador');
            }
        },
        
        async deleteAdmin(admin) {
            if (!confirm(`Tem certeza que deseja excluir ${admin.name}?`)) {
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + `/admin/administrators/${admin.id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Falha ao excluir administrador');
                }

                const index = this.admins.indexOf(admin);
                if (index > -1) {
                    this.admins.splice(index, 1);
                }
                alert(`Administrador ${admin.name} excluído com sucesso!`);
            } catch (error) {
                console.error('Erro ao excluir administrador:', error);
                alert(error.message || 'Erro ao excluir administrador');
            }
        },
        
        async addNewAdmin() {
            if (this.isLoading) return;
            
            this.isLoading = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/admin/administrators',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.newAdmin.name,
                            email: this.newAdmin.email,
                            permission: this.newAdmin.permission
                        })
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Falha ao criar administrador');
                }

                const created = await response.json();
                this.admins.push(created);
                
                // Mostrar senha temporária se foi gerada
                if (created.tempPassword) {
                    alert(
                        `Administrador ${created.name} criado com sucesso!\n\n` +
                        `Senha temporária: ${created.tempPassword}\n\n` +
                        `IMPORTANTE: Anote esta senha, ela não será exibida novamente.`
                    );
                } else {
                    alert(`Administrador ${created.name} adicionado com sucesso!`);
                }
                
                this.newAdmin = {
                    name: '',
                    email: '',
                    permission: 'Editor',
                    lastLogin: 'Nunca',
                    status: 'Ativo',
                };
                
                this.showAddAdminModal = false;
            } catch (error) {
                console.error('Erro ao adicionar administrador:', error);
                alert(error.message || 'Erro ao adicionar administrador');
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>
<style scoped>
/* --- Layout Base --- */
.layout {
    display: flex;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #0a0a0a;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #0a0a0a;
}

.admin-dashboard {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
}

/* --- Cabeçalho --- */
.dashboard-header h1 {
    font-size: 2em;
    margin-bottom: 5px;
    font-weight: 600;
    color: white;
    text-align: left;
}

.dashboard-header p {
    margin-top: 0;
    margin-bottom: 30px;
    font-size: 0.9em;
    color: #ccc;
    text-align: left;

}

/* --- Separador --- */
.separator {
    border: 0;
    height: 1px;
    background-color: #333;
    margin: 30px 0;
}

/* --- KPIs --- */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.kpi-card {
    background-color: #131213;
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.kpi-card:hover {
    transform: translateY(-2px);
}

.kpi-card.loading {
    opacity: 0.6;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
}

.kpi-label {
    font-size: 0.8em;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: #aaa;
}

.kpi-value {
    font-size: 1.8em;
    font-weight: bold;
    color: rgb(41, 216, 108);
}

/* --- Seção de Administradores --- */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.btn {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
    font-size: 0.9em;
}

.btn-add-admin {
    background-color: rgb(41, 216, 108);
    color: black;
    box-shadow: 0px 0px 10px rgba(41, 216, 108, 0.5);
}

.btn-add-admin:hover {
    background-color: #00b359;
}

.btn-secondary {
    background-color: #131213;
    color: #fff;
    border: 1px solid #444;
    margin-left: 10px;
    padding: 8px 15px; 
    font-weight: 500;
}

.btn-secondary:hover {
    background-color: #222;
}

/* --- Tabelas Modernas --- */
.table-container {
    background-color: #131213;
    border-radius: 8px;
    overflow-x: auto; 
    margin-bottom: 40px;
}

.table-container.loading {
    opacity: 0.6;
}

/* --- Paginação --- */
.pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px 20px;
    background-color: #131213;
    border-radius: 8px;
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: 20px;
    color: #ccc;
    font-size: 0.9em;
}

.records-per-page {
    display: flex;
    align-items: center;
    gap: 8px;
}

.records-per-page label {
    color: #999;
    font-size: 0.85em;
}

.records-per-page select {
    background-color: #1e1e1e;
    color: white;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 0.9em;
    cursor: pointer;
}

.records-per-page select:hover {
    border-color: rgb(41, 216, 108);
}

.pagination-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-pagination {
    background-color: #1e1e1e;
    color: white;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9em;
}

.btn-pagination:hover:not(:disabled) {
    background-color: rgb(41, 216, 108);
    border-color: rgb(41, 216, 108);
    color: black;
}

.btn-pagination:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 4px;
}

.btn-page-number {
    background-color: #1e1e1e;
    color: white;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9em;
    min-width: 40px;
}

.btn-page-number:hover:not(:disabled):not(.active) {
    background-color: #2a2a2a;
    border-color: #444;
}

.btn-page-number.active {
    background-color: rgb(41, 216, 108);
    border-color: rgb(41, 216, 108);
    color: black;
    font-weight: bold;
}

.btn-page-number:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.btn-page-number.ellipsis {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
}

/* Responsividade da Paginação */
@media (max-width: 768px) {
    .pagination-controls {
        flex-direction: column;
        gap: 15px;
    }
    
    .pagination-info {
        flex-direction: column;
        gap: 10px;
        text-align: center;
        width: 100%;
    }
    
    .pagination-buttons {
        width: 100%;
        justify-content: center;
    }
    
    .btn-pagination {
        padding: 6px 10px;
        font-size: 0.85em;
    }
    
    .btn-page-number {
        padding: 6px 8px;
        font-size: 0.85em;
        min-width: 35px;
    }
}

@media (max-width: 480px) {
    .pagination-info span {
        font-size: 0.8em;
    }
    
    .records-per-page {
        width: 100%;
        justify-content: center;
    }
    
    .page-numbers {
        gap: 2px;
    }
    
    .btn-page-number {
        padding: 5px 6px;
        font-size: 0.75em;
        min-width: 30px;
    }
    
    .btn-pagination {
        padding: 5px 8px;
    }
}

.modern-table {
    width: 100%;
    min-width: 600px; 
    border-collapse: collapse;
    background-color: #131213;
    color: white;
}

.modern-table th,
.modern-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #333;
}

.modern-table th {
    background-color: #1e1e1e;
    color: #ddd;
    font-weight: normal;
    text-transform: uppercase;
    font-size: 0.8em;
}

.modern-table tbody tr:last-child td {
    border-bottom: none;
}

/* --- Status Badge --- */
.status-badge {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 600;
    display: inline-block;
    min-width: 50px;
    text-align: center;
}

.ativo {
    background-color: rgba(0, 230, 119, 0.048);
    color: #00e676;
    border: 1px solid #00e676;
}

.inativo {
    background-color: rgba(255, 193, 7, 0.068);
    color: #ffc107;
    border: 1px solid #ffc107;
}

.action-link {
    background: none;
    border: none;
    color: #e9e6e6;
    cursor: pointer;
    font-size: 0.9em;
    padding: 0;
    transition: color 0.2s;
    margin-right: 10px;
}

.action-link:hover {
    color: white;
}

.action-link.delete {
    color: #ff5252;
}

.action-link.delete:hover {
    color: #ff8a80;
}

/* --- Resultado (Logs) --- */
.result-icon {
    font-size: 1.2em;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: center;
}

.result-icon.success {
    color: #00e676;
}

.result-icon.failure {
    color: #ff5252;
}

/* --- Cards de Permissão --- */
.permission-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.permission-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #131213;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.card-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card-title {
    font-size: 1em;
    font-weight: 500;
    color: white;
    border-bottom: none;
    padding: 0;
    margin: 0;
}

.card-detail {
    font-size: 0.8em;
    color: #999;
}

.btn-manage-green {
    padding: 8px 15px;
    font-weight: bold;
    background-color: rgb(41, 216, 108);
    color: black;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.btn-manage-green:hover {
    background-color: #00b359;
}

/* --- Configurações Gerais --- */
.config-section {
    margin-bottom: 40px;
}

.config-card {
    background-color: #131213;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
}

.config-card h2 {
    font-size: 1.4em;
    margin-top: 0;
    margin-bottom: 20px;
    font-weight: 600;
    color: white;
}

.config-item {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 15px;
    padding: 8px 0;
    gap: 20px;
}

.toggle-label {
    font-size: 1em;
    color: white;
    margin-right: 10px;
}

/* --- Toggle Switch Customizado --- */
.toggle-switch-admin {
    position: relative;
    display: inline-block;
    width: 45px;
    height: 22px;
    background-color: #555;
    border-radius: 11px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.toggle-switch-admin.active {
    background-color: rgb(41, 216, 108);
}


.toggle-switch-admin.active .slider:before {
    transform: translateX(23px);
}

.toggle-switch-admin .slider.round {
    border-radius: 50%;
}

.slider{
    width: 0;
}

/* --- Botão Salvar --- */
.btn-save-config {
    width: fit-content;
    padding: 12px;
    margin-top: 20px;
    font-size: 1em;
    background-color: rgb(41, 216, 108);
    color: black;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
}

.btn-save-config:hover {
    background-color: #00b359;
}

/* ---------------------------------------------------------------------------------------------------- */
/* --- ESTILOS DO MODAL --- */
/* ---------------------------------------------------------------------------------------------------- */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #1e1e1e;
    color: white;
    padding: 25px;
    border-radius: 10px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    transform: translateY(-50px);
    transition: all 0.3s ease-in-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #333;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5em;
    font-weight: 600;
}

.close-button {
    background: none;
    border: none;
    color: #aaa;
    font-size: 2em;
    cursor: pointer;
    transition: color 0.2s;
}

.close-button:hover {
    color: #ff5252;
}

/* Formulário do Modal */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9em;
    color: #ccc;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 5px;
    background-color: #333;
    color: white;
    box-sizing: border-box;
    font-size: 1em;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions .btn-save-config {
    margin-top: 0;
    padding: 10px 20px;
}

.modal-actions .btn-secondary {
    margin-top: 0;
}

/* Transições do Modal (Para um efeito mais suave) */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter, .modal-fade-leave-to /* .modal-fade-leave-active em <2.1.8 */ {
  opacity: 0;
}

/* ---------------------------------------------------------------------------------------------------- */
/* --- NOVO: Estilos do Botão Hambúrguer no AdminView (Apenas Mobile) --- */
/* ---------------------------------------------------------------------------------------------------- */

.menu-toggler-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 999; /* Abaixo do sidebar (1000) */
    background-color: #1e1e1e;
    color: rgb(255, 255, 255);
    border: 1px solid #333;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: none; /* Oculto por padrão no desktop */
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    transition: background-color 0.2s;
}

.menu-toggler-btn:hover {
    background-color: #2a2a2a;
}


/* ---------------------------------------------------------------------------------------------------- */
/* --- Responsividade (Media Queries) --- */
/* ---------------------------------------------------------------------------------------------------- */

/* Para Tablets e Telas Médias (max-width: 1024px) */
@media (max-width: 1024px) {
    /* Mostra o botão de hambúrguer */
    .menu-toggler-btn {
        display: flex;

    }
    
    .layout-content {
        /* Adiciona padding para o botão de hambúrguer não cobrir o conteúdo */
        padding-top: 60px; 
    }
    
    /* Ajusta a grade de KPIs para 3 colunas, se necessário */
    .kpi-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }
    
    /* Ajusta a grade de Permissões para colunas menores */
    .permission-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}


/* Para Celulares e Telas Pequenas (max-width: 768px) */
@media (max-width: 768px) {
    .layout-content {
        padding: 10px;
    }

    .admin-dashboard{
        width: 100%;
        margin-top: 40px;
    }
    
    /* Ajusta a grade de KPIs para 2 colunas */
    .kpi-grid {
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 10px;
    }

    /* Ajusta o cabeçalho das seções */
    .section-header {
        flex-direction: column; 
        align-items: flex-start;
    }

    .section-header h2 {
        margin-bottom: 10px;
    }

    .btn-add-admin, .btn-secondary {
        width: 100%; 
        margin-left: 0;
        margin-top: 10px;
    }
    
    .log-actions {
        display: flex;
        width: 100%;
        gap: 10px;
    }
    
    /* Força o overflow para a tabela aparecer em tela pequena */
    .table-container {
        overflow-x: auto;
    }
    
    .modern-table {
        min-width: 650px; 
    }

    /* Ajusta a grade de Permissões para 1 coluna */
    .permission-cards-grid {
        grid-template-columns: 1fr;
    }
    
    /* Ajuste do Modal em Mobile */
    .modal-content {
        margin: 10px;
    }
    .modal-actions {
        flex-direction: column-reverse; 
    }
    .modal-actions .btn {
        width: 100%;
        margin-left: 0;
    }
}

/* Para Celulares em Orientação Retrato (max-width: 480px) */
@media (max-width: 480px) {
    
    /* Força a grade de KPIs para 2 colunas */
    .kpi-grid {
        grid-template-columns: 1fr 1fr;
    }

    /* Reduz ainda mais o padding das células da tabela */
    .modern-table th,
    .modern-table td {
        padding: 10px 8px;
    }
    
    .actions {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
    }
    
    .action-link {
        margin-right: 0; 
        font-size: 0.8em;
    }
}
</style>