<template>
    <div class="dashboard-layout">
        <div
            v-if="isSidebarOpen && isMobile"
            class="sidebar-overlay"
            @click="isSidebarOpen = false"
        ></div>

        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            :is-mobile="isMobile"
            @toggle-collapse="toggleSidebarCollapse" 
            @close-sidebar="isSidebarOpen = false" 
            @open-settings="showSettingsModal = true"
        />

        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <!-- Top Navbar -->
            <TopNavbar 
                v-if="!isMobile"
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />
            
            <!-- Mobile Header -->
            <div v-if="isMobile" class="mobile-header-admin">
                <button class="menu-toggler-btn" @click="isSidebarOpen = true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="mobile-brand">
                    <span class="text-white font-bold text-lg">ZEN</span><span class="text-white font-bold text-lg">I</span><span class="text-[#22C55E] font-bold text-lg">X</span>
                </div>
                <button class="mobile-profile-btn" @click="showSettingsModal = true">
                    <i class="fas fa-user-circle text-2xl text-[#DFDFDF]"></i>
                </button>
            </div>

            <main class="layout-content">
                <div class="admin-dashboard">
                <header class="dashboard-header">
                    <h1 style="font-size: 20px;">Painel Administrativo</h1>
                    <p style="font-size: 14px;">Controle total da operação, permissões e desempenho da plataforma.</p>
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
                    <!-- Tabela Desktop -->
                    <div class="table-container desktop-table">
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
                    <!-- Cards Mobile -->
                    <div class="mobile-admins-cards">
                        <div v-for="admin in admins" :key="admin.email" class="mobile-admin-card">
                            <div class="card-header-admin">
                                <h3 class="card-admin-name">{{ admin.name }}</h3>
                                <span :class="['status-badge', admin.status.toLowerCase()]">
                                    {{ admin.status }}
                                </span>
                            </div>
                            <div class="card-body-admin">
                                <div class="card-row-admin">
                                    <span class="card-label-admin">Email:</span>
                                    <span class="card-value-admin">{{ admin.email }}</span>
                                </div>
                                <div class="card-row-admin">
                                    <span class="card-label-admin">Permissão:</span>
                                    <span class="card-value-admin">{{ admin.permission }}</span>
                                </div>
                                <div class="card-row-admin">
                                    <span class="card-label-admin">Último Login:</span>
                                    <span class="card-value-admin">{{ admin.lastLogin }}</span>
                                </div>
                                <div class="card-actions-admin">
                                    <button @click="editAdmin(admin)" class="action-link">Editar</button>
                                    <button @click="toggleStatus(admin)" class="action-link">
                                        {{ admin.status === 'Ativo' ? 'Desativar' : 'Ativar' }}
                                    </button>
                                    <button @click="deleteAdmin(admin)" class="action-link delete">Excluir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="all-users">
                    <div class="section-header">
                        <h2>Todos os Usuários</h2>
                        <div class="user-actions">
                            <div class="search-container">
                                <i class="fas fa-search search-icon"></i>
                                <input 
                                    type="text" 
                                    v-model="allUsersSearch" 
                                    @keyup.enter="loadAllUsers(1, allUsersPagination.recordsPerPage)"
                                    placeholder="Buscar por nome, email ou ID..." 
                                    class="search-input"
                                >
                            </div>
                            <button class="btn btn-add-admin" @click="showAddUserModal = true">+ Adicionar Novo Usuário</button>
                        </div>
                    </div>
                    <!-- Tabela Desktop -->
                    <div class="table-container desktop-table" :class="{ 'loading': isLoadingAllUsers }">
                        <table class="modern-table">
                            <thead>
                                <tr>
                                    <th>NOME</th>
                                    <th>EMAIL</th>
                                    <th>CONTA/MOEDA</th>
                                    <th class="text-right">SALDO</th>
                                    <th>PLANO</th>
                                    <th>DATA CADASTRO</th>
                                    <th>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLoadingAllUsers">
                                    <td colspan="6" style="text-align: center; padding: 2rem; color: #999;">
                                        Carregando usuários...
                                    </td>
                                </tr>
                                <tr v-else-if="!filteredAllUsers || filteredAllUsers.length === 0">
                                    <td colspan="6" style="text-align: center; padding: 2rem; color: #999;">
                                        Nenhum usuário encontrado
                                    </td>
                                </tr>
                                <tr v-else v-for="user in filteredAllUsers" :key="user.id">
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>
                                        <div class="account-info">
                                            <span class="account-id">{{ user.derivLoginId }}</span>
                                            <span class="account-currency">{{ user.currency }}</span>
                                        </div>
                                    </td>
                                    <td class="text-right">{{ user.balance.toLocaleString('en-US', { style: 'currency', currency: user.currency || 'USD' }) }}</td>
                                    <td>
                                        <span class="plan-badge">{{ user.plan }}</span>
                                    </td>
                                    <td>{{ new Date(user.createdAt).toLocaleDateString('pt-BR') }}</td>
                                    <td>
                                        <button @click="editUser(user)" class="action-link">Editar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Cards Mobile -->
                    <div class="mobile-users-cards" :class="{ 'loading': isLoadingAllUsers }">
                        <div v-for="user in filteredAllUsers" :key="'mob-' + user.id" class="mobile-user-card">
                            <div class="card-header-user">
                                <h3 class="card-user-name">{{ user.name }}</h3>
                                <span class="plan-badge">{{ user.plan }}</span>
                            </div>
                            <div class="card-body-user">
                                <div class="card-row-user">
                                    <span class="card-label-user">Email:</span>
                                    <span class="card-value-user">{{ user.email }}</span>
                                </div>
                                <div class="card-row-user">
                                    <span class="card-label-user">Conta:</span>
                                    <span class="card-value-user">{{ user.derivLoginId }} ({{ user.currency }})</span>
                                </div>
                                <div class="card-row-user">
                                    <span class="card-label-user">Saldo:</span>
                                    <span class="card-value-user">{{ user.balance.toLocaleString('en-US', { style: 'currency', currency: user.currency || 'USD' }) }}</span>
                                </div>
                                <div class="card-row-user">
                                    <span class="card-label-user">Cadastro:</span>
                                    <span class="card-value-user">{{ new Date(user.createdAt).toLocaleDateString('pt-BR') }}</span>
                                </div>
                                <div class="card-actions-admin">
                                    <button @click="editUser(user)" class="action-link">Editar Usuário</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Paginação para Todos os Usuários -->
                    <div class="pagination-controls" v-if="allUsersPagination.totalPages > 1">
                        <div class="pagination-info">
                            <span>Total: {{ allUsersPagination.totalRecords }} usuários</span>
                            <div class="records-per-page">
                                <label>Por página:</label>
                                <select v-model="allUsersPagination.recordsPerPage" @change="loadAllUsers(1, allUsersPagination.recordsPerPage)">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div class="pagination-buttons">
                            <button 
                                class="btn-pagination" 
                                :disabled="!allUsersPagination.hasPreviousPage"
                                @click="loadAllUsers(allUsersPagination.currentPage - 1, allUsersPagination.recordsPerPage)"
                            >
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            
                            <div class="page-numbers">
                                <button 
                                    v-for="page in allUsersPagination.totalPages" 
                                    :key="page"
                                    class="btn-page-number"
                                    :class="{ 'active': page === allUsersPagination.currentPage }"
                                    @click="loadAllUsers(page, allUsersPagination.recordsPerPage)"
                                >
                                    {{ page }}
                                </button>
                            </div>

                            <button 
                                class="btn-pagination" 
                                :disabled="!allUsersPagination.hasNextPage"
                                @click="loadAllUsers(allUsersPagination.currentPage + 1, allUsersPagination.recordsPerPage)"
                            >
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </section>

                <section class="logs-audit">
                    <div class="section-header">
                        <h2>Logs & Auditoria</h2>
                        <div class="log-actions">
                            <button class="btn btn-secondary" @click="showKiwifyModal = true">
                                <i class="fas fa-sync-alt" style="margin-right: 5px;"></i>
                                Sincronizar Usuários
                            </button>
                            <button class="btn btn-secondary filter-btn" @click="loadActivityLogs(logsPagination.currentPage, logsPagination.recordsPerPage)">
                                <i class="fa-solid fa-rotate-right" style="margin-right: 5px;"></i>
                                Atualizar
                            </button>
                        </div>
                    </div>
                    <!-- Tabela Desktop -->
                    <div class="table-container desktop-table" :class="{ 'loading': isLoadingLogs }">
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
                    <!-- Cards Mobile -->
                    <div class="mobile-logs-cards" :class="{ 'loading': isLoadingLogs }">
                        <div v-if="isLoadingLogs" class="mobile-log-card empty-state">
                            <p>Carregando logs...</p>
                        </div>
                        <div v-else-if="logs.length === 0" class="mobile-log-card empty-state">
                            <p>Nenhum log de atividade encontrado</p>
                        </div>
                        <div v-else v-for="(log, index) in logs" :key="log.id || index" class="mobile-log-card">
                            <div class="card-header-log">
                                <h3 class="card-log-action">{{ log.action }}</h3>
                                <span :class="['result-icon', log.result === 'Sucesso' ? 'success' : 'failure']">
                                    {{ log.result === 'Sucesso' ? '✅' : '❌' }}
                                </span>
                            </div>
                            <div class="card-body-log">
                                <div class="card-row-log">
                                    <span class="card-label-log">Data/Hora:</span>
                                    <span class="card-value-log">{{ log.dateTime }}</span>
                                </div>
                                <div class="card-row-log">
                                    <span class="card-label-log">Usuário:</span>
                                    <span class="card-value-log">{{ log.user }}</span>
                                </div>
                                <div class="card-row-log">
                                    <span class="card-label-log">IP:</span>
                                    <span class="card-value-log">{{ log.ip }}</span>
                                </div>
                            </div>
                        </div>
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



                            </div>
            </main>
        </div>
        
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

        <!-- Modal de Adicionar Novo Usuário -->
        <transition name="modal-fade">
            <div v-if="showAddUserModal" class="modal-overlay" @click.self="showAddUserModal = false">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Adicionar Novo Usuário</h3>
                        <button class="close-button" @click="showAddUserModal = false">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Nome Completo</label>
                            <input type="text" v-model="newUser.name" placeholder="Ex: João Silva">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" v-model="newUser.email" placeholder="email@exemplo.com">
                        </div>
                        <div class="form-group">
                            <label>WhatsApp / Telefone</label>
                            <input type="text" v-model="newUser.phone" placeholder="(11) 99999-9999">
                        </div>
                        <div class="form-group">
                            <label>Plano</label>
                            <select v-model="newUser.planId">
                                <option value="" disabled>Selecione um plano</option>
                                <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                                    {{ plan.name }} - {{ plan.price.toLocaleString('pt-BR', { style: 'currency', currency: plan.currency || 'BRL' }) }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" @click="showAddUserModal = false">Cancelar</button>
                        <button class="btn btn-save-config" @click="createNewUser" :disabled="isCreatingUser">
                            {{ isCreatingUser ? 'Criando...' : 'Criar Usuário' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal de Editar Usuário -->
        <transition name="modal-fade">
            <div v-if="showEditUserModal" class="modal-overlay" @click.self="showEditUserModal = false">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Editar Usuário: {{ editingUser.name }}</h3>
                        <button class="close-button" @click="showEditUserModal = false">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Plano</label>
                            <select v-model="editingUser.planId">
                                <option value="" disabled>Selecione um plano</option>
                                <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                                    {{ plan.name }} - {{ plan.price.toLocaleString('pt-BR', { style: 'currency', currency: plan.currency || 'BRL' }) }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Permissão / Role</label>
                            <select v-model="editingUser.role">
                                <option value="user">Usuário Comum</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div class="form-group toggle-group" style="margin-top: 15px;">
                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <input type="checkbox" v-model="editingUser.traderMestre" style="width: auto;">
                                <span>Trader Mestre</span>
                            </label>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" @click="showEditUserModal = false">Cancelar</button>
                        <button class="btn btn-save-config" @click="submitUpdateUser" :disabled="isUpdatingUser">
                            {{ isUpdatingUser ? 'Salvando...' : 'Salvar Alterações' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Settings Modal -->
        <SettingsSidebar
            :is-open="showSettingsModal"
            @close="showSettingsModal = false"
        />

        <!-- Confirm Modal -->
        <ConfirmActionModal
            :visible="confirmModalData.visible"
            :title="confirmModalData.title"
            :message="confirmModalData.message"
            confirm-text="Sim, excluir"
            cancel-text="Cancelar"
            @confirm="handleConfirmAction"
            @cancel="confirmModalData.visible = false"
        />

        <!-- Kiwify Users Modal -->
        <KiwifyUsersModal 
            :visible="showKiwifyModal"
            @close="showKiwifyModal = false"
        />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal.vue';
import KiwifyUsersModal from '../../components/modals/KiwifyUsersModal.vue';

export default {
    name: 'AdminView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        ConfirmActionModal,
        KiwifyUsersModal
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth > 1024,
            isSidebarCollapsed: false,
            isMobile: window.innerWidth <= 1024,
            
            showSettingsModal: false,
            showAddAdminModal: false,
            showKiwifyModal: false, 
            
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
            allUsers: [],
            isLoadingAllUsers: false,
            allUsersSearch: '',
            allUsersPagination: {
                currentPage: 1,
                totalPages: 1,
                totalRecords: 0,
                recordsPerPage: 10
            },
            plans: [],
            showAddUserModal: false,
            newUser: {
                name: '',
                email: '',
                phone: '',
                planId: ''
            },
            isCreatingUser: false,
            showEditUserModal: false,
            editingUser: {
                id: '',
                name: '',
                email: '',
                planId: '',
                role: 'user',
                traderMestre: false
            },
            isUpdatingUser: false,
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

            
            // Modal de Confirmação
            confirmModalData: {
                visible: false,
                title: '',
                message: '',
                confirmAction: null
            }
        };
    },
    async mounted() {
        window.addEventListener('resize', this.handleResize);
        await this.loadAdminStats();
        await this.loadNonDemoUsers();
        await this.loadAdministrators();
        await this.loadAllUsers();
        await this.loadPlans();
        await this.loadActivityLogs();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    computed: {
        filteredAllUsers() {
            return this.allUsers || []; // Backend handles search now, ensure array
        }
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
                    iasInOperation: data.iasInOperation || 0,
                    registeredExperts: data.registeredExperts || 0,
                    managedVolume: data.managedVolumeFormatted || '$0',
                    totalCommission: data.totalCommissionFormatted || '$0',
                };
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
                this.$root.$toast.error('Erro ao carregar estatísticas do painel');
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

        editUser(user) {
            this.editingUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                planId: user.planId || '',
                role: user.role || 'user',
                traderMestre: user.traderMestre || false
            };
            this.showEditUserModal = true;
        },

        async submitUpdateUser() {
            this.isUpdatingUser = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + `/admin/users/${this.editingUser.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            planId: this.editingUser.planId,
                            role: this.editingUser.role,
                            traderMestre: this.editingUser.traderMestre
                        })
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro ao atualizar usuário');
                }

                alert('Usuário atualizado com sucesso!');
                this.showEditUserModal = false;
                await this.loadAllUsers(this.allUsersPagination.currentPage, this.allUsersPagination.recordsPerPage);
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                alert(error.message);
            } finally {
                this.isUpdatingUser = false;
            }
        },

        async loadAllUsers(page = 1, limit = 10) {
            this.isLoadingAllUsers = true;
            try {
                const token = localStorage.getItem('token');
                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = new URL(`${baseUrl}/admin/users/all`);
                url.searchParams.append('page', page);
                url.searchParams.append('limit', limit);
                if (this.allUsersSearch) {
                    url.searchParams.append('search', this.allUsersSearch);
                }

                const response = await fetch(url.toString(), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Falha ao carregar todos os usuários');
                }

                const result = await response.json();
                
                // Suporte robusto para estrutura paginada ou array direto
                if (result && result.data && Array.isArray(result.data)) {
                    this.allUsers = result.data;
                    this.allUsersPagination = result.pagination || this.allUsersPagination;
                } else if (Array.isArray(result)) {
                    this.allUsers = result;
                    // Reset pagination if array is returned
                    this.allUsersPagination = {
                        currentPage: 1,
                        totalPages: 1,
                        totalRecords: result.length,
                        recordsPerPage: result.length
                    };
                } else {
                    this.allUsers = [];
                }
                
                console.log('Todos os usuários carregados:', this.allUsers.length);
            } catch (error) {
                console.error('Erro ao carregar todos os usuários:', error);
            } finally {
                this.isLoadingAllUsers = false;
            }
        },

        async loadPlans() {
            try {
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/plans'
                );
                if (response.ok) {
                    this.plans = await response.json();
                }
            } catch (error) {
                console.error('Erro ao carregar planos:', error);
            }
        },

        async createNewUser() {
            if (!this.newUser.name || !this.newUser.email || !this.newUser.planId) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            this.isCreatingUser = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/admin/users',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.newUser)
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro ao criar usuário');
                }

                const result = await response.json();
                alert(`Usuário criado com sucesso!\nSenha temporária: ${result.tempPassword}`);
                this.showAddUserModal = false;
                this.newUser = { name: '', email: '', phone: '', planId: '' };
                this.loadAllUsers();
            } catch (error) {
                console.error('Erro ao criar usuário:', error);
                alert(error.message);
            } finally {
                this.isCreatingUser = false;
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
                this.$root.$toast.error('Erro ao carregar lista de administradores');
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
            this.isMobile = window.innerWidth <= 1024;
            if (window.innerWidth > 1024) {
                this.isSidebarOpen = true;
            } else {
                this.isSidebarOpen = false;
            }
        },
        

        editAdmin(admin) {
            this.$root.$toast.info(`Editando: ${admin.name}`);
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
                this.$root.$toast.success(`Status alterado para: ${updated.status}`);
            } catch (error) {
                console.error('Erro ao alterar status:', error);
                this.$root.$toast.error('Erro ao alterar status do administrador');
            }
        },
        
        async deleteAdmin(admin) {
            // Confirmação via Modal
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
                this.$root.$toast.success(`Administrador ${admin.name} excluído com sucesso!`);
            } catch (error) {
                console.error('Erro ao excluir administrador:', error);
                this.$root.$toast.error(error.message || 'Erro ao excluir administrador');
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
                    this.$root.$toast.success(
                        `Administrador ${created.name} criado com sucesso!<br><br>` +
                        `Senha temporária: ${created.tempPassword}<br><br>` +
                        `IMPORTANTE: Anote esta senha, ela não será exibida novamente.`
                    , 10000);
                } else {
                    this.$root.$toast.success(`Administrador ${created.name} adicionado com sucesso!`);
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
                this.$root.$toast.error(error.message || 'Erro ao adicionar administrador');
            } finally {
                this.isLoading = false;
            }
        },
        requestDeleteAdmin(admin) {
            this.confirmModalData = {
                visible: true,
                title: 'Excluir Administrador',
                message: `Tem certeza que deseja excluir <strong>${admin.name}</strong>?`,
                confirmAction: () => this.deleteAdmin(admin)
            };
        },
        handleConfirmAction() {
            if (this.confirmModalData.confirmAction) {
                this.confirmModalData.confirmAction();
            }
            this.confirmModalData.visible = false;
        }
    }
}
</script>
<style scoped>
/* --- Layout Base (seguindo padrão da Dashboard) --- */
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background-color: #0b0b0b;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    box-sizing: border-box;
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
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 80px; /* Espaço para o TopNavbar */
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #0b0b0b;
    box-sizing: border-box;
    width: 100%;
}

.admin-dashboard {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    overflow-x: hidden;
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
    color: rgb(34, 197, 94);
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
    background-color: rgb(34, 197, 94);
    color: black;
    box-shadow: 0px 0px 10px rgba(34, 197, 94, 0.5);
}

.btn-add-admin:hover {
    background-color: rgb(28, 170, 80);
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
    border-color: rgb(34, 197, 94);
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
    background-color: rgb(34, 197, 94);
    border-color: rgb(34, 197, 94);
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
    background-color: rgb(34, 197, 94);
    border-color: rgb(34, 197, 94);
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
    background-color: rgba(34, 197, 94, 0.048);
    color: rgb(34, 197, 94);
    border: 1px solid rgb(34, 197, 94);
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
    color: rgb(34, 197, 94);
}

.result-icon.failure {
    color: #ff5252;
}

/* --- Cards de Permissão --- */
.permission-control {
    margin-top: 40px;
}

/* --- Logs e Auditoria --- */
.logs-audit {
    margin-top: 15px;
}

.permission-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.permission-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #131213;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    height: 100%;

}

.permission-card:last-child {
    margin-bottom: 30px;
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
    text-align: left;
}

.card-detail {
    font-size: 0.8em;
    color: #999;
}

.btn-manage-green {
    padding: 8px 15px;
    font-weight: bold;
    background-color: rgb(34, 197, 94);
    color: black;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.btn-manage-green:hover {
    background-color: rgb(28, 170, 80);
}

/* --- Seção de Todos os Usuários --- */
.all-users {
    margin-top: 40px;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #1e1e1e;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 0 15px;
    width: 300px;
    transition: all 0.3s;
}

.search-container:focus-within {
    border-color: rgb(34, 197, 94);
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
}

.user-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.search-icon {
    color: #999;
    font-size: 0.9em;
    margin-right: 10px;
}

.search-input {
    background: transparent;
    border: none;
    color: white;
    padding: 10px 0;
    width: 100%;
    outline: none;
    font-size: 0.9em;
}

.account-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.account-id {
    font-size: 0.9em;
    font-weight: 500;
}

.account-currency {
    font-size: 0.75em;
    color: #999;
}

.plan-badge {
    background-color: rgba(34, 197, 94, 0.1);
    color: rgb(34, 197, 94);
    border: 1px solid rgba(34, 197, 94, 0.3);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: 600;
}

.card-actions-admin {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid #333;
    flex-wrap: wrap;
    width: 100%;
}

.card-actions-admin .action-link {
    flex: 1;
    min-width: 80px;
    text-align: center;
    padding: 8px 4px;
    word-break: break-word;
    font-size: 0.85em;
    box-sizing: border-box;
    color: rgb(34, 197, 94);
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.card-actions-admin .action-link:hover {
    background: rgba(34, 197, 94, 0.2);
}

.toggle-group label {
    user-select: none;
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
    background-color: rgb(34, 197, 94);
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
    background-color: rgb(34, 197, 94);
    color: black;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
}

.btn-save-config:hover {
    background-color: rgb(28, 170, 80);
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
/* --- Estilos do Botão Hambúrguer no AdminView (Apenas Mobile) --- */
/* ---------------------------------------------------------------------------------------------------- */

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
    .dashboard-content-wrapper {
        margin-left: 0;
        width: 100%;
        max-width: 100%;
    }
    
    .dashboard-content-wrapper.sidebar-collapsed {
        margin-left: 0;
        width: 100%;
        max-width: 100%;
    }
    
    .mobile-header-admin {
        display: flex;
    }
    
    .layout-content {
        padding-top: 70px;
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

    .search-container {
        width: 100%;
        margin-top: 10px;
    }
}

@media (max-width: 768px) {
    .all-users .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}

@media (min-width: 769px) {
    .desktop-table {
        display: block !important;
    }
    
    .mobile-admins-cards,
    .mobile-logs-cards,
    .mobile-users-cards {
        display: none !important;
    }
}

/* Cards Mobile - Usuários */
.mobile-users-cards {
    display: none;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding-bottom: 20px;
}

.mobile-users-cards.loading {
    opacity: 0.6;
}

.mobile-user-card {
    background-color: #131213;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #333;
}

.card-header-user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #222;
}

.card-user-name {
    font-size: 1.1em;
    font-weight: 600;
    color: white;
    margin: 0;
}

.card-body-user {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card-row-user {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
}

.card-label-user {
    color: #999;
}

.card-value-user {
    color: #eee;
    text-align: right;
    word-break: break-all;
}


/* Cards Mobile - Administradores */
.mobile-admins-cards {
    display: none;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding-bottom: 20px;
    overflow-y: auto;
    max-height: 800px;
}

.mobile-admin-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #333;
    width: 100%;
    box-sizing: border-box;
}

.card-header-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
    gap: 10px;
    flex-wrap: wrap;
}

.card-admin-name {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    flex: 1;
    min-width: 0;
    word-break: break-word;
    text-align: left;
}

.card-body-admin {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-row-admin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    min-height: 24px;
}

.card-label-admin {
    font-size: 14px;
    color: #999;
    font-weight: 500;
    flex-shrink: 0;
}

.card-value-admin {
    font-size: 14px;
    color: #fff;
    text-align: right;
    flex: 1;
    margin-left: 10px;
    word-break: break-word;
}

.card-actions-admin {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid #333;
    flex-wrap: wrap;
    width: 100%;
}

.card-actions-admin .action-link {
    flex: 1;
    min-width: 80px;
    text-align: center;
    padding: 8px 4px;
    word-break: break-word;
    font-size: 0.85em;
    box-sizing: border-box;
}

/* Cards Mobile - Logs */
.mobile-logs-cards {
    display: none;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding-bottom: 20px;
    overflow-y: auto;
    max-height: 800px;
}

.mobile-logs-cards.loading {
    opacity: 0.6;
}

.mobile-log-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #333;
    width: 100%;
    box-sizing: border-box;
}

.mobile-log-card.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
}

.card-header-log {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
    gap: 10px;
    flex-wrap: wrap;
}

.card-log-action {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    flex: 1;
    min-width: 0;
    word-break: break-word;
    text-align: left;
}

.card-body-log {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-row-log {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    min-height: 24px;
}

.card-label-log {
    font-size: 14px;
    color: #999;
    font-weight: 500;
    flex-shrink: 0;
}

.card-value-log {
    font-size: 14px;
    color: #fff;
    text-align: right;
    flex: 1;
    margin-left: 10px;
    word-break: break-word;
}

/* Para Celulares e Telas Pequenas (max-width: 768px) */
@media (max-width: 768px) {
    .layout-content {
        padding: 10px;
        padding-top: 70px;
        overflow-x: hidden;
        box-sizing: border-box;
        width: 100%;
    }

    .admin-dashboard{
        width: 100%;
        max-width: 100%;
        padding: 10px;
        padding-bottom: 0;
        box-sizing: border-box;
        overflow-x: hidden;
    }
    
    /* Ajusta a grade de KPIs para 2 colunas */
    .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
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

    .user-actions {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
    }
    
    /* Esconder tabelas desktop e mostrar cards mobile */
    .desktop-table {
        display: none !important;
    }
    
    .mobile-admins-cards,
    .mobile-logs-cards,
    .mobile-users-cards {
        display: flex !important;
    }
    
    /* Ajustar grid de permissões */
    .permission-cards-grid {
        grid-template-columns: 1fr;
    }
    
    /* Ajustar configurações */
    .config-card {
        padding: 15px;
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