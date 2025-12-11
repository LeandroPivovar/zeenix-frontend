<template>
    <aside class="sidebar" :class="{ 'is-open': isOpen, 'collapsed': isCollapsed }">
        <div class="brand">
            <div class="brand-content">
                <div class="brand-text">
                    ZENI<span class="text-zenix-green">X</span>
                </div>
                <a 
                    href="#" 
                    class="whatsapp-button bg-transparent hover:bg-[#0E0E0E] text-[#A1A1A1] hover:text-[#25D366] font-medium px-3 py-1.5 rounded-lg text-xs inline-flex items-center space-x-2 transition-all duration-200 border border-[#1C1C1C] hover:border-[#25D366]/30"
                >
                    <i class="fa-brands fa-whatsapp text-xs"></i>
                    <span class="whatsapp-text">Grupo de Alunos</span>
                </a>
            </div>
        </div>
        <nav class="menu">
            <a
                href="#"
                class="menu-item"
                :class="{ active: isDashboardActive }"
                @click.prevent="navigateAndClose('/dashboard')"
                data-text="Dashboard"
            >
                <i class="fa-solid fa-chart-line w-5 opacity-85"></i>
                <span>Dashboard</span>
            </a>
            
            <a
                href="#"
                class="menu-item"
                :class="{ active: isStatsIAsActive }"
                @click.prevent="navigateAndClose('/StatsIAs')"
                data-text="IAs de Investimento"
            >
                <i class="fa-solid fa-brain w-5 opacity-85"></i>
                <span>IA's de Investimento</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isAutonomousAgentActive }"
                @click.prevent="navigateAndClose('/agente-autonomo')"
                data-text="Agente Autônomo"
            >
                <i class="fa-solid fa-robot w-5 opacity-85"></i>
                <span>Agente Autônomo</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isCopyTradingActive }"
                @click.prevent="navigateAndClose('/copy-trading')"
                data-text="Copy Trading"
            >
                <i class="fa-solid fa-copy w-5 opacity-85"></i>
                <span>Copy Trading</span>
            </a>

            <a 
                href="#"
                class="menu-item" 
                :class="{ active: isOperationActive }"
                @click.prevent="navigateAndClose('/operation')"
                data-text="Operação Manual"
            >
                <i class="fa-solid fa-hand-pointer w-5 opacity-85"></i>
                <span>Operação Manual</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isMasterTraderActive }"
                @click.prevent="navigateAndClose('/MasterTrader')"
                data-text="Trader Mestre"
            >
                <i class="fa-solid fa-user-crown w-5 opacity-85"></i>
                <span>Trader Mestre</span>
            </a>

            <div class="separator"></div>
            
            <a
                href="#"
                class="menu-item"
                :class="{ active: isAcademyActive }"
                @click.prevent="navigateAndClose('/academy')"
                data-text="Zenix Academy"
            >
                <i class="fa-solid fa-graduation-cap w-5 opacity-85"></i>
                <span>Zenix Academy</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isPlansActive }"
                @click.prevent="navigateAndClose('/plans')"
                data-text="Planos"
            >
                <i class="fa-solid fa-crown w-5 opacity-85"></i>
                <span>Planos</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isSettingsActive }"
                @click.prevent="navigateAndClose('/settings')"
                data-text="Configuração"
            >
                <i class="fa-solid fa-gear w-5 opacity-85"></i>
                <span>Configuração</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isSupportActive }"
                @click.prevent="navigateAndClose('/support')"
                data-text="Suporte"
            >
                <i class="fa-solid fa-headset w-5 opacity-85"></i>
                <span>Suporte</span>
            </a>

            <!-- Links de Administração (apenas para admins) -->
            <template v-if="isAdmin">
                <div class="separator"></div>
                
                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isAdminViewActive }"
                    @click.prevent="navigateAndClose('/Admin')"
                    data-text="Admin"
                >
                    <i class="fa-solid fa-shield-halved w-5 opacity-85"></i>
                    <span>Admin</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isStatsIAsActive }"
                    @click.prevent="navigateAndClose('/StatsIAs')"
                    data-text="Estatísticas IAs"
                >
                    <i class="fa-solid fa-chart-bar w-5 opacity-85"></i>
                    <span>Estatísticas IAs</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isExpertsActive }"
                    @click.prevent="navigateAndClose('/Experts')"
                    data-text="Experts"
                >
                    <i class="fa-solid fa-user-tie w-5 opacity-85"></i>
                    <span>Experts</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isClientesActive }"
                    @click.prevent="navigateAndClose('/Clientes')"
                    data-text="Clientes"
                >
                    <i class="fa-solid fa-users w-5 opacity-85"></i>
                    <span>Clientes</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isWebhooksActive }"
                    @click.prevent="navigateAndClose('/Webhooks')"
                    data-text="Webhooks"
                >
                    <i class="fa-solid fa-webhook w-5 opacity-85"></i>
                    <span>Webhooks</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isAcademyManagementActive }"
                    @click.prevent="navigateAndClose('/AcademyManagement')"
                    data-text="Gerenciar Academia"
                >
                    <i class="fa-solid fa-book w-5 opacity-85"></i>
                    <span>Gerenciar Academia</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isSupportItemsActive }"
                    @click.prevent="navigateAndClose('/SupportItems')"
                    data-text="Itens de Suporte"
                >
                    <i class="fa-solid fa-ticket w-5 opacity-85"></i>
                    <span>Itens de Suporte</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isMarkupActive }"
                    @click.prevent="navigateAndClose('/markup')"
                    data-text="Markup"
                >
                    <i class="fa-solid fa-percent w-5 opacity-85"></i>
                    <span>Markup</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isPlansManagementActive }"
                    @click.prevent="navigateAndClose('/PlansManagement')"
                    data-text="Gerenciar Planos"
                >
                    <i class="fa-solid fa-crown w-5 opacity-85"></i>
                    <span>Gerenciar Planos</span>
                </a>
            </template>

        </nav>
        <div class="status">
            <div class="footer-row">
                <span class="sair-text" @click="logout">Sair</span>
                <span class="version">v2.0</span>
            </div>
        </div>
    </aside>
</template>

<script>
// (Seu script Vue original mantido)
export default {
    name: 'AppSidebar',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        isCollapsed: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close-sidebar', 'toggle-collapse'],
    data() {
        return { 
            showUserMenu: false
        }
    },
    computed: {
        isDashboardActive() { return this.$route?.path === '/dashboard'; },
        isAcademyActive() { return this.$route?.path?.startsWith('/academy') || false; },
        isSupportActive() { return this.$route?.path === '/support'; },
        isSettingsActive() { return this.$route?.path === '/settings'; },
        isPlansActive() { return this.$route?.path === '/plans'; },
        isOperationActive() { return this.$route?.path === '/operation' },
        isCopyTradingActive() { return this.$route?.path === '/copy-trading' || this.$route?.path === '/copy-trader'; },
        isAutonomousAgentActive() { return this.$route?.path === '/agente-autonomo'; },
        isMarkupActive() { return this.$route?.path === '/markup'; },
        isStatsIAsActive() { return this.$route?.path === '/StatsIAs'; },
        isExpertsActive() { return this.$route?.path === '/Experts'; },
        isClientesActive() { return this.$route?.path === '/Clientes'; },
        isWebhooksActive() { return this.$route?.path === '/Webhooks'; },
        isAcademyManagementActive() { 
            return this.$route?.path === '/AcademyManagement' || 
                   this.$route?.path?.startsWith('/AcademyManagement/'); 
        },
        isAdminViewActive() { return this.$route?.path === '/Admin'; },
        isMasterTraderActive() { return this.$route?.path === '/MasterTrader' || this.$route?.path === '/tradermestre'; },
        isInvestmentIAActive() { return this.$route?.path === '/InvestmentIA'; },
        isSupportItemsActive() { return this.$route?.path === '/SupportItems'; },
        isPlansManagementActive() { return this.$route?.path === '/PlansManagement'; },
        isAdmin() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Verificar se o usuário tem role de admin
                // Pode ser 'role', 'roles', 'userRole', 'isAdmin', etc.
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                const isAdminFlag = payload.isAdmin || payload.is_admin;
                
                // Verificar se role contém 'admin' ou se isAdmin é true
                if (isAdminFlag === true || isAdminFlag === 'true') {
                    return true;
                }
                
                if (role) {
                    const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                    const result = roleStr.includes('admin') || roleStr === 'admin';
                    return result;
                }
                
                return false;
            } catch (error) {
                console.error('[Sidebar] Erro ao verificar se usuário é admin:', error);
                return false;
            }
        },
        canAccessCopyTrader() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Obter role do payload
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                
                if (!role) return false;
                
                // Verificar se role é master, admin ou trader
                const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                return roleStr === 'master' || roleStr === 'admin' || roleStr === 'trader' || 
                       roleStr.includes('master') || roleStr.includes('admin') || roleStr.includes('trader');
            } catch (error) {
                console.error('[Sidebar] Erro ao verificar acesso ao Copy Trader:', error);
                return false;
            }
        },
        isTrader() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Obter role do payload
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                
                if (!role) return false;
                
                // Verificar se role é trader
                const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                return roleStr === 'trader' || roleStr.includes('trader');
            } catch (error) {
                console.error('[Sidebar] Erro ao verificar se usuário é trader:', error);
                return false;
            }
        }
    },
    mounted() {
        // Verificação silenciosa de acesso admin (sem logs excessivos)
        // Os logs de debug foram removidos para reduzir poluição no console
    },
    methods: {
        close() { if (this.isOpen) { this.$emit('close-sidebar') } },
        toggleCollapse() { this.$emit('toggle-collapse') },
        navigateAndClose(route) { this.$router.push(route); this.close() },
        toggleUserMenu() { this.showUserMenu = !this.showUserMenu },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('deriv_connection');
            this.$router.push('/login');
        },
        goProfile() { this.$router.push('/profile'); }
    }
}
</script>

<style src="../assets/css/components/sidebar.css"></style>