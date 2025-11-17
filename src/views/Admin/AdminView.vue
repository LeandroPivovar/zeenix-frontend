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
                    <div class="kpi-card">
                        <span class="kpi-label">Admins ativos</span>
                        <span class="kpi-value value-green">{{ kpis.activeAdmins }}</span>
                    </div>
                    <div class="kpi-card">
                        <span class="kpi-label">Usuários ativos</span>
                        <span class="kpi-value value-green">{{ kpis.activeUsers.toLocaleString('pt-BR') }}</span>
                    </div>
                    <div class="kpi-card">
                        <span class="kpi-label">IAs em operação</span>
                        <span class="kpi-value value-green">{{ kpis.iasInOperation }}</span>
                    </div>
                    <div class="kpi-card">
                        <span class="kpi-label">Experts cadastrados</span>
                        <span class="kpi-value value-green">{{ kpis.registeredExperts }}</span>
                    </div>
                    <div class="kpi-card">
                        <span class="kpi-label">Volume gerenciado (US$)</span>
                        <span class="kpi-value value-green">{{ kpis.managedVolume }}</span>
                    </div>
                    <div class="kpi-card">
                        <span class="kpi-label">Comissão total (Markup)</span>
                        <span class="kpi-value value-green">{{ kpis.totalCommission }}</span>
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
                            <button class="btn btn-secondary filter-btn">Filtrar</button>
                        </div>
                    </div>
                    <div class="table-container">
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
                                <tr v-for="(log, index) in logs" :key="index">
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
            // isSidebarOpen: true, <-- REMOVA OU COMENTE ESTA LINHA
            isSidebarOpen: window.innerWidth > 1024, // NOVO: Sidebar fechada em telas pequenas
            isSidebarCollapsed: false,
            
            showAddAdminModal: false, 
            
            newAdmin: {
                name: '',
                email: '',
                permission: 'Editor', 
                lastLogin: 'Nunca',
                status: 'Ativo',
            },

            // ... resto dos seus dados (kpis, admins, logs, config) ...
            kpis: {
                activeAdmins: 8,
                activeUsers: 1254,
                iasInOperation: 48,
                registeredExperts: 12,
                managedVolume: '1.2M',
                totalCommission: '$87k',
            },
            admins: [
                {
                    name: 'Marcos Costa',
                    email: 'marcos.costa@zenix.pro',
                    permission: 'Super Admin',
                    lastLogin: '2025-10-18 10:30:15',
                    status: 'Ativo',
                },
                {
                    name: 'Ana Silva',
                    email: 'ana.silva@zenix.pro',
                    permission: 'Editor',
                    lastLogin: '2025-10-17 18:45:02',
                    status: 'Ativo',
                },
                {
                    name: 'Carlos Pereira',
                    email: 'carlos.pereira@zenix.pro',
                    permission: 'Suporte',
                    lastLogin: '2025-10-16 09:12:33',
                    status: 'Inativo',
                },
            ],
            logs: [
                {
                    dateTime: '2025-10-18 10:31:00',
                    action: 'Login no sistema',
                    user: 'Marcos Costa',
                    ip: '192.168.1.1',
                    result: 'Sucesso',
                },
                {
                    dateTime: '2025-10-18 10:25:45',
                    action: "Desativou usuário 'C. Pereira'",
                    user: 'Ana Silva',
                    ip: '203.0.113.25',
                    result: 'Sucesso',
                },
                {
                    dateTime: '2025-10-18 09:55:12',
                    action: 'Falha ao exportar logs',
                    user: 'Marcos Costa',
                    ip: '192.168.1.1',
                    result: 'Falha',
                },
            ],
            config: {
                modoManutencao: false,
                alertasTempoReal: true,
                permitirNovasContas: true,
                logsDetalhados: false,
                modoSeguroApi: false,
            }
        };
    },
    // Opcional, mas recomendado para lidar com a mudança de tamanho da janela
    mounted() {
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        handleResize() {
            // Se a tela for maior que 1024px, a sidebar deve estar aberta (desktop).
            // Se for menor ou igual, ela deve estar fechada (mobile).
            if (window.innerWidth > 1024) {
                this.isSidebarOpen = true;
            } else {
                this.isSidebarOpen = false;
            }
        },
        // ... resto dos seus métodos ...
        saveConfigurations() {
            console.log('Configurações salvas:', this.config);
        },
        editAdmin(admin) {
            alert(`Editando: ${admin.name}`);
        },
        toggleStatus(admin) {
            admin.status = admin.status === 'Ativo' ? 'Inativo' : 'Ativo';
        },
        deleteAdmin(admin) {
            if (confirm(`Tem certeza que deseja excluir ${admin.name}?`)) {
                const index = this.admins.indexOf(admin);
                if (index > -1) {
                    this.admins.splice(index, 1);
                }
            }
        },
        addNewAdmin() {
            const newAdminEntry = { ...this.newAdmin };
            this.admins.push(newAdminEntry);
            
            this.newAdmin = {
                name: '',
                email: '',
                permission: 'Editor',
                lastLogin: 'Nunca',
                status: 'Ativo',
            };
            
            this.showAddAdminModal = false;
            alert(`Administrador ${newAdminEntry.name} adicionado com sucesso!`);
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