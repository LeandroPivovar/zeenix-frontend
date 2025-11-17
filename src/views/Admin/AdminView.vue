<template>
    <div class="layout">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

        <main class="layout-content">
            <div class="admin-dashboard">
                <header class="dashboard-header">
                    <h1>Painel Administrativo</h1>
                    <p>Controle total da operação, permissões e desempenho da plataforma.</p>
                </header>

                <section class="kpi-grid">
                    <div class="card">
                        <span class="kpi-label">Admins ativos</span>
                        <span class="kpi-value value-green">{{ kpis.activeAdmins }}</span>
                    </div>
                    <div class="card">
                        <span class="kpi-label">Usuários ativos</span>
                        <span class="kpi-value value-green">{{ kpis.activeUsers.toLocaleString('pt-BR') }}</span>
                    </div>
                    <div class="card">
                        <span class="kpi-label">IAs em operação</span>
                        <span class="kpi-value value-green">{{ kpis.iasInOperation }}</span>
                    </div>
                    <div class="card">
                        <span class="kpi-label">Experts cadastrados</span>
                        <span class="kpi-value value-green">{{ kpis.registeredExperts }}</span>
                    </div>
                    <div class="card">
                        <span class="kpi-label">Volume gerenciado (US$)</span>
                        <span class="kpi-value value-green">{{ kpis.managedVolume }}</span>
                    </div>
                    <div class="card">
                        <span class="kpi-label">Comissão total (Markup)</span>
                        <span class="kpi-value value-green">{{ kpis.totalCommission }}</span>
                    </div>
                </section>

                <hr class="separator" />

                <section class="system-admins">
                    <div class="section-header">
                        <h2>Administradores do Sistema</h2>
                        <button class="btn btn-add-admin">+ Adicionar Novo Administrador</button>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Permissão</th>
                                <th>Último login</th>
                                <th>Status</th>
                                <th>Ações</th>
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
                                <td class="action-buttons">
                                    <button class="btn btn-action">Editar</button>
                                    <button class="btn btn-action">Desativar</button>
                                    <button class="btn btn-action btn-delete">Excluir</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <hr class="separator" />

                <section class="logs-audit">
                    <div class="section-header">
                        <h2>Logs & Auditoria</h2>
                        <div class="log-actions">
                            <button class="btn btn-secondary">Exportar Logs</button>
                            <button class="btn btn-secondary filter-btn">Filtrar</button>
                        </div>
                    </div>
                    <table class="data-table log-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Ação</th>
                                <th>Usuário</th>
                                <th>IP</th>
                                <th>Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(log, index) in logs" :key="index">
                                <td>{{ log.dateTime }}</td>
                                <td>{{ log.action }}</td>
                                <td>{{ log.user }}</td>
                                <td>{{ log.ip }}</td>
                                <td>
                                    <span :class="['log-result', log.result === 'Sucesso' ? 'success' : 'failure']">
                                        <span v-if="log.result === 'Sucesso'">✔</span>
                                        <span v-else>✘</span>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <hr class="separator" />

                <section class="permission-control">
                    <h2>Controle de Permissões</h2>
                    <div class="permission-cards-grid">
                        <div class="permission-card card">
                            <span class="card-title">Estatísticas das IAs</span>
                            <span class="card-detail">4 administradores com acesso</span>
                            <button class="btn btn-manage">Gerenciar</button>
                        </div>
                        <div class="permission-card card">
                            <span class="card-title">Clientes</span>
                            <span class="card-detail">2 administradores com acesso</span>
                            <button class="btn btn-manage">Gerenciar</button>
                        </div>
                        <div class="permission-card card">
                            <span class="card-title">Ver Finanças</span>
                            <span class="card-detail">1 administrador com acesso</span>
                            <button class="btn btn-manage">Gerenciar</button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
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
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            
            kpis: {
                activeAdmins: 8,
                activeUsers: 1254,
                iasInOperation: 48,
                registeredExperts: 12,
                managedVolume: '1.2M', // US$1.2M
                totalCommission: '$87k', // $87k
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
        };
    },
    methods: {
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        }
    }
}
</script>

<style scoped>
/* --- Variáveis CSS --- */
:root {
    /* Fundo da tela principal, muito escuro (Dark Mode) */
    --bg-color: #1a1a1a;
    /* Fundo de cards, tabelas e elementos de interface (ligeiramente mais claro que o fundo) */
    --card-bg: #2d2d2d;
    /* Cor de fundo para cabeçalhos de tabela/elementos de destaque */
    --highlight-color: #272727; 
    /* Texto principal e valores */
    --text-color: #ffffff;
    /* Texto secundário (rótulos, descrições) */
    --text-secondary: #999999;
    /* Cor de sucesso/destaque (Verde) */
    --success-color: #00e676;
    /* Cor de aviso (Amarelo/Laranja) */
    --warning-color: #ffc107;
    /* Cor de erro/excluir (Vermelho) */
    --error-color: #dc3545;
    /* Cor de borda/divisor sutil */
    --border-color: #444444;
    /* Verde de destaque para o botão "Novo Administrador" */
    --accent-green: #00e676; 
}

/* --- Layout Geral e Estilos de Fundo --- */
.layout {
    display: flex; 
    min-height: 100vh;
    color: var(--text-color);
    font-family: Arial, sans-serif;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto; 
}

/* --- Dashboard Container --- */
.admin-dashboard {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
}

.value-green{
    color: rgb(71, 235, 71);
}

/* --- Cabeçalho e Títulos --- */
.dashboard-header h1 {
    font-size: 2em;
    margin-bottom: 5px;
    font-weight: 600;
}

.dashboard-header p {
    color: var(--text-secondary);
    margin-top: 0;
    margin-bottom: 30px;
    font-size: 0.9em;
}

/* --- Separador Horizontal --- */
.separator {
    border: 0;
    height: 1px;
    background-color: var(--border-color);
    margin: 30px 0;
}

/* --- KPIs (Métricas) --- */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
    /* Alinha os KPIs com o fundo geral, como na imagem 1 */
}

.kpi-card {
    padding: 0;
    display: flex;
    flex-direction: column;
}

.kpi-label {
    font-size: 0.8em;
    color: var(--text-secondary);
    text-transform: uppercase;
    margin-bottom: 5px;
}

.kpi-value {
    font-size: 1.8em;
    font-weight: bold;
}

.kpi-green {
    color: var(--success-color);
}

/* --- Seção e Botões Gerais --- */
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
    background-color: var(--accent-green);
    color: var(--bg-color);
}

.btn-add-admin:hover {
    background-color: #00b359;
}

.btn-secondary {
    background-color: var(--card-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    margin-left: 10px;
    padding: 6px 12px;
}

.btn-secondary:hover {
    background-color: var(--highlight-color);
}

/* --- Tabela de Dados (Administradores e Logs) --- */
.data-table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--card-bg); /* Fundo dos dados */
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 40px;
}

.data-table th,
.data-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.data-table th {
    background-color: var(--highlight-color); /* Fundo do cabeçalho */
    color: var(--text-secondary);
    font-weight: normal;
    text-transform: uppercase;
    font-size: 0.8em;
}

.data-table tbody tr:last-child td {
    border-bottom: none;
}

/* --- Status Badge --- */
.status-badge {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 600;
}

.ativo {
    background-color: rgba(0, 230, 118, 0.2);
    color: var(--success-color);
}

.inativo {
    background-color: rgba(255, 193, 7, 0.2);
    color: var(--warning-color);
}

/* --- Ações da Tabela --- */
.action-buttons button {
    margin-right: 10px;
    color: var(--text-secondary);
    /* Remove padding/background padrão */
}

.action-buttons button:hover {
    color: var(--text-color);
}

.btn-delete {
    color: var(--error-color);
}

/* --- Logs (Ajuste de Alinhamento do Resultado) --- */
.log-table th:last-child,
.log-table td:last-child {
    text-align: center;
    width: 10%;
}

.log-result {
    font-size: 1.2em;
    font-weight: bold;
    display: inline-block;
}

.log-result.success {
    color: var(--success-color);
}

.log-result.failure {
    color: var(--error-color);
}

/* --- Cards de Permissão --- */

.permission-cards-grid {
    display: flex;
    gap: 20px;
}

.card {
    background-color: var(--card-bg); /* Aplica o fundo mais claro nos cards */
    padding: 15px;
    border-radius: 8px;
}

.permission-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 250px;
}

.card-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-detail {
    font-size: 0.8em;
    color: var(--text-secondary);
    margin-bottom: 15px;
}

.btn-manage {
    align-self: flex-start;
    background-color: var(--success-color);
    color: var(--bg-color);
    padding: 6px 12px;
    font-weight: 600;
}

.btn-manage:hover {
    background-color: #00b359;
}
</style>