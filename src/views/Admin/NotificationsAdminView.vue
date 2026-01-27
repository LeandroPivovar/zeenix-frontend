<template>
    <div class="dashboard-layout">
        <!-- Sticky Header -->
        <header class="admin-sticky-header">
            <div class="header-left">
                <button class="toggle-menu-btn-header" @click="isMobile ? isSidebarOpen = true : toggleSidebarCollapse()" :title="isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'">
                    <i class="fas fa-bars text-[#DFDFDF]"></i>
                </button>
                <div class="header-brand-text ml-4">
                    <span class="text-white font-bold text-xl">ZEN</span>
                    <span class="text-white font-bold text-xl">I</span>
                    <span class="text-[#22C55E] font-bold text-xl">X</span>
                </div>
            </div>
        </header>

        <div class="main-body-wrapper">
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
                <main class="layout-content">
                    <div class="admin-dashboard">
                        <header class="dashboard-header">
                            <h1 style="font-size: 20px;">Gerenciar Notificações</h1>
                            <p style="font-size: 14px;">Crie e gerencie notificações do sistema para os usuários.</p>
                        </header>

                        <section class="notification-list">
                            <div class="section-header">
                                <h2>Notificações Criadas</h2>
                                <button class="btn btn-add-admin" @click="showCreateModal = true">
                                    <i class="fas fa-plus mr-2"></i>Nova Notificação
                                </button>
                            </div>

                            <div class="table-container desktop-table" :class="{ 'loading': isLoading }">
                                <table class="modern-table">
                                    <thead>
                                        <tr>
                                            <th>NOME</th>
                                            <th>DESCRIÇÃO</th>
                                            <th>CRIADO EM</th>
                                            <th>DATA EXPIRAÇÃO</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="isLoading">
                                            <td colspan="5" class="text-center py-8 text-[#999]">Carregando notificações...</td>
                                        </tr>
                                        <tr v-else-if="notifications.length === 0">
                                            <td colspan="5" class="text-center py-8 text-[#999]">Nenhuma notificação encontrada</td>
                                        </tr>
                                        <tr v-else v-for="notification in notifications" :key="notification.id">
                                            <td>{{ notification.name }}</td>
                                            <td>{{ notification.description }}</td>
                                            <td>{{ formatDate(notification.createdAt) }}</td>
                                            <td>{{ formatDate(notification.displayUntil) }}</td>
                                            <td>
                                                <span :class="['status-badge', isExpired(notification.displayUntil) ? 'inativo' : 'ativo']">
                                                    {{ isExpired(notification.displayUntil) ? 'Expirada' : 'Ativa' }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>

        <!-- Modal Criar Notificação -->
        <transition name="modal-fade">
            <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Nova Notificação</h3>
                        <button class="close-button" @click="showCreateModal = false">×</button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="createNotification">
                            <div class="form-group">
                                <label>Nome / Título</label>
                                <input type="text" v-model="newNotification.name" required placeholder="Ex: Manutenção Programada">
                            </div>
                            <div class="form-group">
                                <label>Descrição</label>
                                <textarea v-model="newNotification.description" required placeholder="Ex: O sistema passará por manutenção..." rows="4" class="form-control"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Exibir até (Data/Hora)</label>
                                <input type="datetime-local" v-model="newNotification.displayUntil" required>
                                <small class="text-gray-400 mt-1 block">A notificação deixará de aparecer para os usuários após esta data.</small>
                            </div>
                            
                            <div class="modal-actions">
                                <button type="button" class="btn btn-secondary" @click="showCreateModal = false">Cancelar</button>
                                <button type="submit" class="btn btn-save-config" :disabled="isSaving">
                                    {{ isSaving ? 'Salvando...' : 'Criar Notificação' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </transition>

        <SettingsSidebar :is-open="showSettingsModal" @close="showSettingsModal = false" />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';

export default {
    name: 'NotificationsAdminView',
    components: {
        AppSidebar,
        SettingsSidebar
    },
    data() {
        return {
            isSidebarOpen: window.innerWidth > 1024,
            isSidebarCollapsed: false,
            isMobile: window.innerWidth <= 1024,
            showSettingsModal: false,
            
            isLoading: false,
            notifications: [],
            
            showCreateModal: false,
            isSaving: false,
            newNotification: {
                name: '',
                description: '',
                displayUntil: ''
            }
        };
    },
    mounted() {
        window.addEventListener('resize', this.handleResize);
        this.loadNotifications();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth <= 1024;
            if (!this.isMobile) {
                this.isSidebarOpen = true;
            } else {
                this.isSidebarOpen = false;
            }
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        async loadNotifications() {
            this.isLoading = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/notifications/admin',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.ok) {
                    this.notifications = await response.json();
                }
            } catch (error) {
                console.error('Erro ao carregar notificações:', error);
                this.$root.$toast?.error('Erro ao carregar notificações');
            } finally {
                this.isLoading = false;
            }
        },
        async createNotification() {
            this.isSaving = true;
            try {
                // Converter data local para ISO
                const displayUntilDate = new Date(this.newNotification.displayUntil);
                
                const token = localStorage.getItem('token');
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/notifications',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: this.newNotification.name,
                            description: this.newNotification.description,
                            displayUntil: displayUntilDate.toISOString()
                        })
                    }
                );

                if (response.ok) {
                    this.$root.$toast?.success('Notificação criada com sucesso');
                    this.showCreateModal = false;
                    this.newNotification = { name: '', description: '', displayUntil: '' };
                    this.loadNotifications();
                } else {
                    throw new Error('Falha ao criar');
                }
            } catch (error) {
                console.error('Erro ao criar notificação:', error);
                this.$root.$toast?.error('Erro ao criar notificação');
            } finally {
                this.isSaving = false;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleString('pt-BR');
        },
        isExpired(dateStr) {
            return new Date(dateStr) < new Date();
        }
    }
};
</script>

<style scoped>
/* Reutilizando estilos do AdminView se possível, mas definindo alguns específicos */
.dashboard-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #0B0B0B;
}

.admin-sticky-header {
    height: 60px;
    background-color: #0B0B0B;
    border-bottom: 1px solid #1C1C1C;
    display: flex;
    align-items: center;
    padding: 0 20px;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
}

.main-body-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
}

.dashboard-content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    margin-left: 260px; /* Largura da sidebar expandida */
    transition: margin-left 0.3s ease;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px; /* Largura da sidebar colapsada */
}

@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0 !important;
        padding: 15px;
    }
}

.notification-list {
    background: #141414;
    border: 1px solid #1C1C1C;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-header h2 {
    color: #FFF;
    font-size: 18px;
    font-weight: 600;
}

.btn-add-admin {
    background: #22C55E;
    color: #000;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-add-admin:hover {
    background: #16A34A;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-table th {
    text-align: left;
    padding: 12px;
    color: #9CA3AF;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    border-bottom: 1px solid #1C1C1C;
}

.modern-table td {
    padding: 14px 12px;
    color: #DFDFDF;
    font-size: 14px;
    border-bottom: 1px solid #1C1C1C;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.ativo {
    background: rgba(34, 197, 94, 0.1);
    color: #22C55E;
}

.status-badge.inativo {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #141414;
    width: 500px;
    max-width: 90%;
    border-radius: 12px;
    border: 1px solid #1C1C1C;
    overflow: hidden;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #1C1C1C;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    color: #FFF;
    margin: 0;
    font-size: 18px;
}

.close-button {
    background: none;
    border: none;
    color: #9CA3AF;
    font-size: 24px;
    cursor: pointer;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    color: #9CA3AF;
    font-size: 14px;
    margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    background: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 6px;
    padding: 10px;
    color: #FFF;
    font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #22C55E;
    outline: none;
}

.modal-actions {
    padding: 20px;
    border-top: 1px solid #1C1C1C;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-secondary {
    background: #27272A;
    color: #FFF;
}

.btn-save-config {
    background: #22C55E;
    color: #000;
}
</style>
