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
                            <h1>Gerenciar Notificações</h1>
                            <p>Crie e gerencie notificações do sistema para os usuários.</p>
                        </header>

                        <section class="notification-list">
                            <div class="section-header">
                                <h2>Notificações Criadas</h2>
                                <button class="btn btn-add-admin" @click="openCreateModal">
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
                                            <th>AÇÕES</th>
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
                                            <td class="actions-cell">
                                                <button class="action-btn edit" @click="openEditModal(notification)" title="Editar">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    v-if="!isExpired(notification.displayUntil)"
                                                    class="action-btn deactivate" 
                                                    @click="deactivateNotification(notification)" 
                                                    title="Desativar (Expirar Agora)"
                                                >
                                                    <i class="fas fa-ban"></i>
                                                </button>
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
                        <h3>{{ isEditing ? 'Editar Notificação' : 'Nova Notificação' }}</h3>
                        <button class="close-button" @click="closeModal">×</button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveNotification">
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
                                <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
                                <button type="submit" class="btn btn-save-config" :disabled="isSaving">
                                    {{ isSaving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Notificação') }}
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
            isEditing: false, // Flag para saber se é edição
            editingId: null, // ID da notificação sendo editada
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
        openCreateModal() {
            this.isEditing = false;
            this.editingId = null;
            this.newNotification = { name: '', description: '', displayUntil: '' };
            this.showCreateModal = true;
        },
        openEditModal(notification) {
            this.isEditing = true;
            this.editingId = notification.id;
            // Formatar data para o input datetime-local (YYYY-MM-DDThh:mm)
            const date = new Date(notification.displayUntil);
            // Ajuste para fuso local simples para o input, ou usar slice se tiver certeza do formato
            // O input datetime-local espera YYYY-MM-DDThh:mm
            const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            
            this.newNotification = {
                name: notification.name,
                description: notification.description,
                displayUntil: localIso
            };
            this.showCreateModal = true;
        },
        closeModal() {
            this.showCreateModal = false;
            this.newNotification = { name: '', description: '', displayUntil: '' };
            this.isEditing = false;
            this.editingId = null;
        },
        async saveNotification() {
            if (this.isEditing) {
                await this.updateNotification();
            } else {
                await this.createNotification();
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
                    this.closeModal();
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
        async updateNotification() {
            this.isSaving = true;
            try {
                const displayUntilDate = new Date(this.newNotification.displayUntil);
                const token = localStorage.getItem('token');
                
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + `/notifications/${this.editingId}`,
                    {
                        method: 'PATCH',
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
                    this.$root.$toast?.success('Notificação atualizada com sucesso');
                    this.closeModal();
                    this.loadNotifications();
                } else {
                    throw new Error('Falha ao atualizar');
                }
            } catch (error) {
                console.error('Erro ao atualizar notificação:', error);
                this.$root.$toast?.error('Erro ao atualizar notificação');
            } finally {
                this.isSaving = false;
            }
        },
        async deactivateNotification(notification) {
            if (!confirm('Deseja realmente desativar esta notificação? Ela expirará imediatamente.')) return;
            
            try {
                const token = localStorage.getItem('token');
                // Definir data de expiração para AGORA
                const now = new Date();
                
                const response = await fetch(
                    (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + `/notifications/${notification.id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            displayUntil: now.toISOString()
                        })
                    }
                );

                if (response.ok) {
                    this.$root.$toast?.success('Notificação desativada');
                    this.loadNotifications();
                } else {
                    throw new Error('Falha ao desativar');
                }
            } catch (error) {
                console.error('Erro ao desativar notificação:', error);
                this.$root.$toast?.error('Erro ao desativar notificação');
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

.admin-dashboard {
    width: 100%;
    max-width: 100%; /* Garante que ocupe todo o espaço disponível */
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
    padding: 10px 20px;
    transition: margin-left 0.3s ease;
    margin-left: 0; /* Expanded sidebar: no extra margin */
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 280px; /* Collapsed sidebar: 280px margin */
}

@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0 !important;
        padding: 15px;
    }
}

.layout-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start !important; /* Tirei o center */
    align-items: stretch !important;
    width: 100%;
}

.notification-list {
    background: #141414;
    border: 1px solid #1C1C1C;
    border-radius: 12px;
    padding: 16px; /* Reduzido padding interno */
    margin-top: 10px; /* Reduzido margin top */
    width: 100%; /* Força largura total */
}

.dashboard-header {
    margin-bottom: 0px;
}

.dashboard-header h1 {
    margin-bottom: 4px;
}

.dashboard-header p {
    margin-bottom: 0px;
    color: #9CA3AF;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}
/* ... restante dos estilos permanece igual ... */
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
    padding: 16px; /* Aumentado padding das células */
    color: #9CA3AF;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    border-bottom: 1px solid #1C1C1C;
}

.modern-table td {
    padding: 16px; /* Aumentado padding das células */
    color: #DFDFDF;
    font-size: 14px;
    border-bottom: 1px solid #1C1C1C;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 6px;
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

.actions-cell {
    display: flex;
    gap: 8px;
    align-items: center;
}

.action-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    padding: 6px;
    border-radius: 4px;
    transition: background 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn.edit {
    color: #3B82F6;
}

.action-btn.edit:hover {
    background: rgba(59, 130, 246, 0.1);
}

.action-btn.deactivate {
    color: #EF4444;
}

.action-btn.deactivate:hover {
    background: rgba(239, 68, 68, 0.1);
}
</style>
