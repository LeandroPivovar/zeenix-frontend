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
                <header class=" header-webhook">
                <div class="header-info">
                    <h1 style="font-size: 20px;">Webhooks de Vendas</h1>
                    <p class="header-subtitle" style="font-size: 14px;">Integre KiwiFy para sincronizar assinaturas, compras e renovações.</p>
                </div>
                <button class="btn add-webhook">
                    + Nova Conexão
                </button>
            </header>

            <section class="webhook-cards-grid">
                <div 
                    v-for="connection in connections" 
                    :key="connection.id" 
                    :class="['webhook-card', connection.status]"
                >
                    <div class="card-header">
                        <h2>{{ connection.name.toUpperCase() }}</h2>
                        
                        <div :class="['status-indicator', connection.status]">
                            <span class="status-dot"></span>
                            <span class="status-text">
                                {{ connection.status === 'active' ? 'Funcionando' : 'Inativo' }}
                            </span>
                        </div>
                        </div>
                    
                    <div class="card-details">
                        <p class="detail-label">Endpoint</p>
                        <input type="text" :value="connection.endpoint" readonly disabled />
                        
                        <p class="detail-label last-event">
                            Último evento: 
                            <strong>{{ connection.lastEvent }}</strong>
                        </p>
                    </div>

                    <div class="card-actions">
                        <button class="btn-link">Editar</button>
                        <button class="btn-link">Logs</button>
                        <button class="btn-link">Testar</button>
                        <button 
                            v-if="connection.status === 'active'" 
                            class="btn-link btn-danger"
                        >
                            Desativar
                        </button>
                        <button 
                            v-else 
                            class="btn-link btn-success-action"
                        >
                            Ativar
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Card de Eventos Disponíveis -->
            <section class="events-available-card">
                <div class="card-header-section">
                    <h2>Eventos Disponíveis</h2>
                    <p class="card-subtitle">Eventos que são processados automaticamente pelo webhook</p>
                </div>
                <div class="events-list">
                    <div v-for="event in availableEvents" :key="event.key" class="event-item">
                        <div class="event-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="event-info">
                            <h3>{{ event.label }}</h3>
                            <p>{{ event.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tabela de Logs -->
            <section class="webhook-logs">
                <div class="logs-header">
                    <h2>Logs do Webhook</h2>
                    <div class="logs-actions">
                        <button class="btn btn-secondary btn-refresh" @click="refreshLogs">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Atualizar
                        </button>
                        <button class="btn btn-secondary btn-clear" @click="requestClearLogs">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Limpar
                        </button>
                    </div>
                </div>
                <!-- Tabela Desktop -->
                <div class="logs-table-container desktop-table">
                    <table class="logs-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Evento</th>
                                <th>Status</th>
                                <th>Email</th>
                                <th>Detalhes</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in webhookLogs" :key="log.id" :class="log.status">
                                <td>{{ log.timestamp }}</td>
                                <td>
                                    <span :class="['event-badge', log.eventType]">
                                        {{ log.eventLabel }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="['status-badge', log.status]">
                                        {{ log.statusLabel }}
                                    </span>
                                </td>
                                <td>{{ log.email }}</td>
                                <td class="details-cell">{{ log.details }}</td>
                                <td>
                                    <button class="btn-icon" @click="viewLogDetails(log)" title="Ver detalhes">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="webhookLogs.length === 0">
                                <td colspan="6" class="empty-state">
                                    <div class="empty-content">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p>Nenhum log registrado ainda</p>
                                        <span>Os logs aparecerão aqui quando o webhook receber eventos</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Cards Mobile -->
                <div class="mobile-webhook-logs-cards">
                    <div v-if="webhookLogs.length === 0" class="mobile-log-card empty-state">
                        <div class="empty-content">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>Nenhum log registrado ainda</p>
                            <span>Os logs aparecerão aqui quando o webhook receber eventos</span>
                        </div>
                    </div>
                    <div v-else v-for="log in webhookLogs" :key="log.id" class="mobile-log-card">
                        <div class="log-card-header">
                            <div class="log-card-badges">
                                <span :class="['event-badge', log.eventType]">
                                    {{ log.eventLabel }}
                                </span>
                                <span :class="['status-badge', log.status]">
                                    {{ log.statusLabel }}
                                </span>
                                <button class="btn-icon" @click="viewLogDetails(log)" title="Ver detalhes">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="log-card-body">
                            <div class="log-card-row">
                                <span class="log-card-label">Data/Hora:</span>
                                <span class="log-card-value">{{ log.timestamp }}</span>
                            </div>
                            <div class="log-card-row">
                                <span class="log-card-label">Email:</span>
                                <span class="log-card-value">{{ log.email }}</span>
                            </div>
                            <div class="log-card-row">
                                <span class="log-card-label">Detalhes:</span>
                                <span class="log-card-value">{{ log.details }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="alert-uptime-footer">
                <div class="alert-settings">
                    <div class="alert-toggle">
                        <p>Alertas por e-mail/WhatsApp ao falhar</p>
                        <label class="switch">
                            <input type="checkbox" v-model="emailAlertsEnabled">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="alert-destinations">
                        <p>Destinatários</p>
                        <input type="text" v-model="alertDestinations" />
                    </div>
                </div>
                
                <div class="uptime-metrics">
                    <p class="uptime-text">Uptime 24h: <strong>{{ uptimePercentage }}</strong></p>
                    <div class="uptime-chart">
                        <div class="bar-chart-placeholder"></div>
                    </div>
                    <p class="deliveries-label">Entregas por hora</p>
                </div>
            </footer>
            </main>
        </div>

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
            confirm-text="Sim, limpar"
            cancel-text="Cancelar"
            @confirm="handleConfirmAction"
            @cancel="confirmModalData.visible = false"
        />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal.vue';

export default {
    name: 'WebhookView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        ConfirmActionModal,
    },
    data() {
        return {
            // Layout data (mantido do original)
            isSidebarOpen: false,
            isMobile: false,
            isSidebarCollapsed: false,
            showSettingsModal: false,
            
            // --- Dados do Conteúdo da Imagem ---

            // 1. Cards de Webhooks
            connections: [
                { id: 2, name: 'KiwiFy', endpoint: 'https://iazenix.com/api/webhook', status: 'active', lastEvent: 'há 2 minutos' },
            ],

            // 2. Eventos Disponíveis
            availableEvents: [
                { 
                    key: 'order_approved', 
                    label: 'Compra Aprovada', 
                    description: 'Dispara quando uma compra é aprovada e paga. Cria automaticamente o usuário no sistema.' 
                },
                { 
                    key: 'subscription_renewed', 
                    label: 'Assinatura Renovada', 
                    description: 'Dispara quando uma assinatura é renovada com sucesso.' 
                },
                { 
                    key: 'subscription_cancelled', 
                    label: 'Assinatura Cancelada', 
                    description: 'Dispara quando uma assinatura é cancelada ou não renovada.' 
                },
            ],

            // 3. Logs do Webhook
            webhookLogs: [
                {
                    id: 1,
                    timestamp: '20/11/2025 13:19:35',
                    eventType: 'order_approved',
                    eventLabel: 'Compra Aprovada',
                    status: 'success',
                    statusLabel: 'Sucesso',
                    email: 'denoc89670@okcdeals.com',
                    details: 'Usuário criado e email enviado',
                },
                {
                    id: 2,
                    timestamp: '20/11/2025 13:05:48',
                    eventType: 'order_approved',
                    eventLabel: 'Compra Aprovada',
                    status: 'success',
                    statusLabel: 'Sucesso',
                    email: 'johndoe@example.com',
                    details: 'Usuário criado com sucesso',
                },
            ],

            // 4. Alertas e Uptime
            emailAlertsEnabled: true,
            alertDestinations: 'admin@zenix.pro, +5511999999999',
            uptimePercentage: '99.98%',
            
            // Modal de Confirmação
            confirmModalData: {
                visible: false,
                title: '',
                message: '',
                confirmAction: null
            }
        }
    },
    mounted() {
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
        refreshLogs() {
            console.log('Atualizando logs...');
            // TODO: Implementar chamada à API para buscar logs atualizados
        },
        clearLogs() {
            this.webhookLogs = [];
        },
        requestClearLogs() {
            this.confirmModalData = {
                visible: true,
                title: 'Limpar Logs',
                message: 'Tem certeza que deseja limpar todos os logs?',
                confirmAction: this.clearLogs
            };
        },
        handleConfirmAction() {
            if (this.confirmModalData.confirmAction) {
                this.confirmModalData.confirmAction();
            }
            this.confirmModalData.visible = false;
        },
        viewLogDetails(log) {
            console.log('Visualizando detalhes do log:', log);
            // TODO: Implementar modal ou página de detalhes do log
        }
    }
}
</script>

<style scoped>
:root {
    --color-bg-card:#131213;
    --color-text-light: #f9fafb;
    --color-text-muted: #9ca3af; 
    --color-text-black: #000000;
    --color-border: #374151; 
    --color-primary: #10b981; 
    --color-secondary: #3b82f6; 
    --color-danger: #ef4444; 
    --color-success: #10b981; 
}

/* Layout Base - Padrão Dashboard */
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0B0B0B;
    color: #fff;
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
    padding: 40px;
    padding-top: 80px;
    background-color: #0B0B0B !important;
}


/* Cards Mobile - Logs */
.mobile-webhook-logs-cards {
    display: none;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding-bottom: 20px;
    overflow-y: auto;
    max-height: 800px;
}

.mobile-log-card {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #383838;
    width: 100%;
    box-sizing: border-box;
}

.mobile-log-card.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
}

.log-card-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #383838;
    gap: 10px;
    flex-wrap: wrap;
}

.log-card-badges {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    align-items: center;
}

.log-card-badges .btn-icon {
    margin-left: 0;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    padding: 0.25rem;
    min-width: 32px;
}

.log-card-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.log-card-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    min-height: 24px;
}

.log-card-label {
    font-size: 14px;
    color: #999;
    font-weight: 500;
    flex-shrink: 0;
}

.log-card-value {
    font-size: 14px;
    color: #fff;
    text-align: right;
    flex: 1;
    margin-left: 10px;
    word-break: break-word;
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

.header-webhook {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 2rem 0;
}

.add-webhook{
    background-color: #22C55E;
} 

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    position: relative;
    padding-bottom: 1rem;
    width: 100%;
}

.header-info{
    text-align: left;
    display: flex;
    flex-direction: column;
}

.header-info h1 {
    font-size: calc(1.5rem + 0.5rem);
    font-weight: 600;
    margin-top: 0;
    padding-top: 0;
}

.page-header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    flex-basis: 100%; 
    margin-bottom: 0.5rem;
}

.header-subtitle {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    flex-grow: 1; /* O subtítulo ocupa o espaço restante */
    text-align: left !important;
}

.btn-new-connection {
    position: absolute; /* Ajusta o botão para o canto superior direito */
    top: 0;
    right: 0;
}

/* --- Estilos de Botões Genéricos --- */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem; /* 6px */
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
}

.btn-primary {
    background-color: var(--color-success);
    color: #ffffff;
}

.btn-primary:hover {
    background-color: #059669; /* Verde um pouco mais escuro */
}

.btn-success {
    background-color: var(--color-success);
    color: #ffffff;
}

/* --- Cards de Webhooks Grid --- */
.webhook-cards-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.webhook-card {
    background-color: var(--color-bg-card);
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    border: 1px solid #383838;
}

.card-header {
    display: flex;
    align-items: center;
    /* CORREÇÃO 1: Garante que o nome e o status fiquem nas extremidades */
    justify-content: space-between;
    margin-bottom: 1rem;
}

.card-header h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-light);
    text-align: left;
}

/* Status Dot e Texto */

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Espaço de 8px entre o ponto e o texto */
    font-size: 0.875rem;
    font-weight: 500;
}

.status-dot {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-indicator.active {
    color: var(--color-primary); /* Cor do texto Ativo */
}

.status-indicator.active .status-dot {
    background-color: var(--color-primary); /* Cor do ponto Ativo */
}

.status-indicator.paused {
    color: var(--color-danger); /* Cor do texto Pausado */
}

.status-indicator.paused .status-dot {
    background-color: var(--color-danger); /* Cor do ponto Pausado */
}


/* Detalhes do Card */
.detail-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
}


.card-details{
    text-align: left    ;
}

.card-details input {
    width: 100%;
    padding: 0.5rem;
    background-color: #131213; /* Um tom um pouco mais claro que o card */
    border: 1px solid #383838;
    border-radius: 0.25rem;
    color: var(--color-text-light);
    font-size: 0.875rem;
    pointer-events: none; /* Desativa a interação para inputs readonly */
    box-sizing: border-box;

    padding-right: 2.5rem;
}

.detail-label.last-event {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

.detail-label.last-event strong {
    color: var(--color-text-light);
    font-weight: 600;
}

/* Ações do Card */
.card-actions {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #383838;
}

.btn-link {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
}

.btn-link:hover {
    color: var(--color-text-light);
}

.btn-link.btn-danger {
    color: var(--color-danger);
}

.btn-link.btn-success-action {
    color: var(--color-primary);
}

/* --- Card de Eventos Disponíveis --- */
.events-available-card {
    background-color: var(--color-bg-card);
    border-radius: 0.5rem;
    padding: 1.5rem 0;
    margin-bottom: 2rem;
    width: 100%;
}

.card-header-section {
    margin-bottom: 1.5rem;
    text-align: left;
}

.card-header-section h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-light);
    margin-bottom: 0.25rem;
}

.card-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-muted);
}

.events-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.event-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 0.5rem;
    transition: all 0.2s;
}

.event-item:hover {
    background-color: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
}

.event-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(16, 185, 129, 0.1);
    border-radius: 0.5rem;
    color: var(--color-primary);
}

.event-info {
    flex: 1;
    text-align: left;
}

.event-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-light);
    margin-bottom: 0.25rem;
}

.event-info p {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    line-height: 1.4;
}

/* --- Tabela de Logs --- */
.webhook-logs {
    background-color: var(--color-bg-card);
    border-radius: 0.5rem;
    padding: 1.5rem 0;
    margin-bottom: 3rem;
    width: 100%;
}

.logs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.logs-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-light);
}

.logs-actions {
    display: flex;
    gap: 0.75rem;
}

.btn-secondary {
    background-color: transparent;
    color: var(--color-text-muted);
    border: 1px solid #383838;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.btn-secondary svg {
    width: 16px;
    height: 16px;
}

.logs-table-container {
    overflow-x: auto;
    border-radius: 0.5rem;
    border: 1px solid #383838;
}

.logs-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
}

.logs-table thead {
    background-color: rgba(255, 255, 255, 0.02);
}

.logs-table th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-text-muted);
    border-bottom: 1px solid #383838;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.logs-table td {
    padding: 1rem;
    border-bottom: 1px solid #383838;
    color: var(--color-text-light);
    text-align: left;
}

.logs-table tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.02);
}

.logs-table tbody tr:last-child td {
    border-bottom: none;
}

.event-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.event-badge.order_approved {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--color-primary);
}

.event-badge.subscription_renewed {
    background-color: rgba(59, 130, 246, 0.1);
    color: var(--color-secondary);
}

.event-badge.subscription_cancelled {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
}

.status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.success {
    background-color: rgba(16, 185, 129, 0.1);
    color: var(--color-primary);
}

.status-badge.error {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
}

.status-badge.pending {
    background-color: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
}

.details-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.btn-icon {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: all 0.2s;
}

.btn-icon:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--color-primary);
}

.empty-state {
    padding: 3rem 1rem !important;
    text-align: center;
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.empty-content svg {
    color: var(--color-text-muted);
    opacity: 0.5;
}

.empty-content p {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-light);
    margin: 0;
}

.empty-content span {
    font-size: 0.875rem;
    color: var(--color-text-muted);
}


/* --- Alerta e Uptime Footer --- */
.alert-uptime-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end; /* Alinha o gráfico à parte inferior */
    padding-top: 1.5rem;
    border-top: 1px solid #383838;
    width: 100%;
}

.alert-settings {
    flex-grow: 1;
    text-align: left;
}

.alert-toggle {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

.alert-toggle p {
    font-size: 1rem;
    font-weight: 500;
}

.alert-destinations p {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: 0.25rem;
}

.alert-destinations input {
    width: 400px; 
    padding: 0.5rem 0.75rem;
    background-color: #1f2937;
    border-radius: 0.25rem;
    color: var(--color-text-light);
    font-size: 0.875rem;
}

/* --- Switch Toggle (Personalizado) --- */
.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-border);
    transition: 0.4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--color-primary);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

/* --- Uptime / Gráfico --- */
.uptime-metrics {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.uptime-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-primary);
}

.uptime-chart {
    width: 150px;
    height: 60px;
    display: flex;
    gap: 3px;
    align-items: flex-end;
    margin: 0.5rem 0;
}

.bar-chart-placeholder {
    /* Simulação das barras do gráfico (placeholder) */
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.bar-chart-placeholder::before {
    content: '';
    /* Simulação das barras usando uma máscara SVG */
    display: block;
    width: 100%;
    height: 100%;
    background: var(--color-primary);
    /* SVG para simular barras de diferentes alturas */
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='0' y='10' width='1.5' height='10' rx='0.2'/%3E%3Crect x='2.5' y='5' width='1.5' height='15' rx='0.2'/%3E%3Crect x='5' y='7' width='1.5' height='13' rx='0.2'/%3E%3Crect x='7.5' y='3' width='1.5' height='17' rx='0.2'/%3E%3Crect x='10' y='1' width='1.5' height='19' rx='0.2'/%3E%3Crect x='12.5' y='8' width='1.5' height='12' rx='0.2'/%3E%3Crect x='15' y='4' width='1.5' height='16' rx='0.2'/%3E%3Crect x='17.5' y='6' width='1.5' height='14' rx='0.2'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-size: cover;
}


.deliveries-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
}

@media (min-width: 768px) {
    .webhook-card{
        min-height: 300px;
    }

    .layout{
        max-width: calc(100% - 280px);
        padding: 0 20px;
        margin-left: 280px;
    }
}

/* --- Responsividade (Opcional, mas recomendado) --- */
@media (max-width: 1200px) {
    .events-list {
        grid-template-columns: 1fr;
    }
    
    .logs-table {
        font-size: 0.75rem;
    }
    
    .logs-table th,
    .logs-table td {
        padding: 0.5rem;
    }
}

@media (max-width: 768px) {
    .layout-content {
        padding: 10px;
        padding-top: 70px;
    }

    .header-webhook {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #383838;
        align-items: center;
        flex-direction: column;
    }
    
    .header-info {
        width: 100%;
    }
    
    .add-webhook {
        width: 100%;
    }
    
    .webhook-cards-grid {
        grid-template-columns: 1fr;
    }
    
    .events-list {
        grid-template-columns: 1fr;
    }
    
    .logs-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .logs-actions {
        width: 100%;
        flex-direction: row;
        gap: 0.75rem;
    }
    
    .logs-actions button {
        flex: 1;
        justify-content: center;
    }
    
    .mobile-log-card {
        padding: 30px;
    }
    
    /* Esconder tabela desktop e mostrar cards mobile */
    .desktop-table {
        display: none !important;
    }
    
    .mobile-webhook-logs-cards {
        display: flex !important;
    }

    .alert-uptime-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 2rem;
    }

    .alert-destinations input {
        width: 100%;
    }
}

@media (min-width: 769px) {
    .desktop-table {
        display: block !important;
    }
    
    .mobile-webhook-logs-cards {
        display: none !important;
    }
}

/* Ajuste para hambúrguer */
.hamburger-btn {
    display: none;
    background: none;
    border: none;
    color: var(--color-text-light);
    cursor: pointer;
    padding: 0.5rem;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .hamburger-btn {
        display: block;
    }
}
</style>
