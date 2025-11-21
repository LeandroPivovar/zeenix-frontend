<template>
    <aside class="sidebar" :class="{ 'is-open': isOpen, 'collapsed': isCollapsed }">
        <div class="brand">
            <div class="avatar">Z</div>
            <div class="brand-text">
                <div class="title">Zenix Black</div>
                <div class="subtitle">Futuristic Trading</div>
            </div>
            <button class="toggle-sidebar-btn" @click="toggleCollapse" :title="isCollapsed ? 'Expandir sidebar' : 'Ocultar sidebar'">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :transform="isCollapsed ? 'rotate(180 8 8)' : ''"/>
                </svg>
            </button>
        </div>
        <nav class="menu">
            <button
                class="menu-item"
                :class="{ active: isDashboardActive }"
                @click="navigateAndClose('/dashboard')"
                data-text="Dashboard"
            >
                <img src="../assets/icons/apps.svg" alt="" class="icon-sidebar">
                Dashboard
            </button>
            <button 
                class="menu-item" 
                :class="{ active: isStatsIAsActive }"
                @click="navigateAndClose('/StatsIAs')" 
                data-text="IAs de Investimento"
            >
                <img src="../assets/icons/core.svg" alt="" class="icon-sidebar">
                IA's de Investimento
            </button>
            <button 
                class="menu-item" 
                :class="{ active: isCopyTradingActive }"
                @click="navigateAndClose('/copy-trading')"
                data-text="Copy Trading"
            >
                <img src="../assets/icons/copy.svg" alt="" class="icon-sidebar">
                Copy Trading
            </button>
            <button 
                class="menu-item" 
                :class="{ active: isOperationActive }"
                @click="navigateAndClose('/operation')"
                data-text="Operação Manual"
            >
                <img src="../assets/icons/click.svg" alt="" class="icon-sidebar">
                Operação Manual
            </button>

            <button
                class="menu-item"
                :class="{ active: isAutonomousAgentActive }"
                @click="navigateAndClose('/agente-autonomo')"
                data-text="Agente Autônomo"
            >
            
            Agente Autonomo
            </button>
            

            <div class="separator"></div>
            
            <button
                class="menu-item"
                :class="{ active: isAcademyActive }"
                @click="navigateAndClose('/academy')"
                data-text="Zenix Academy"
            >
                <img src="../assets/icons/academy.svg" alt="" class="icon-sidebar">
                Zenix Academy
            </button>

            <button
                class="menu-item"
                :class="{ active: isSupportActive }"
                @click="navigateAndClose('/support')"
                data-text="Suporte"
            >
                <img src="../assets/icons/help.svg" alt="" class="icon-sidebar">
                Suporte
            </button>
            <button
                class="menu-item"
                :class="{ active: isSettingsActive }"
                @click="navigateAndClose('/settings')"
                data-text="Configurações"
            >
                <img src="../assets/icons/settings.svg" alt="" class="icon-sidebar">
                Configurações
            </button>
            
            <button
                class="menu-item"
                :class="{ active: isPlansActive }"
                @click="navigateAndClose('/plans')"
                data-text="Planos"
            >
                Planos
            </button>

            <button
                class="menu-item"
                :class="{ active: isMarkupActive }"
                @click="navigateAndClose('/markup')"
                data-text="Markup"
            >
                Markup
            </button>

            <button
                class="menu-item"
                :class="{ active: isExpertsActive }"
                @click="navigateAndClose('/Experts')"
                data-text="Experts"
            >
                Experts
            </button>

            <button
                class="menu-item"
                :class="{ active: isClientesActive }"
                @click="navigateAndClose('/Clientes')"
                data-text="Clientes"
            >
                Clientes
            </button>

            <button
                class="menu-item"
                :class="{ active: isWebhooksActive }"
                @click="navigateAndClose('/Webhooks')"
                data-text="Webhooks"
            >
                Webhooks
            </button>

            <button
                class="menu-item"
                :class="{ active: isAcademyManagementActive }"
                @click="navigateAndClose('/AcademyManagement')"
                data-text="Academy Management"
            >
                Academy Management
            </button>

            <button
                class="menu-item"
                :class="{ active: isAdminViewActive }"
                @click="navigateAndClose('/Admin')"
                data-text="Admin"
            >
                Admin
            </button>

            <button
                class="menu-item"
                :class="{ active: isInvestmentIAActive }"
                @click="navigateAndClose('/InvestmentIA')"
                data-text="InvestmentIA"
            >
                InvestmentIA
            </button>

            <button
                class="menu-item"
                :class="{ active: isMasterTraderActive }"
                @click="navigateAndClose('/MasterTrader')"
                data-text="Master Trader"
            >
                Master Trader
            </button>
        </nav>
        <div class="status">
            <div class="user" @click="toggleUserMenu">
                <div class="user-avatar">U</div>
                <div class="user-info">
                    <div class="user-name">Usuario</div>
                    <div class="user-badge">Conta Ativa</div>
                </div>
            </div>
            <div v-if="showUserMenu" class="user-menu">
                <button class="user-menu-item" @click.stop="goProfile">Ver perfil</button>
                <button class="user-menu-item danger" @click.stop="logout">Sair</button>
            </div>
            <div class="footer-row">
                <span class="online"></span>
                <span class="online-text">Online</span>
                <span class="version">v2.0</span>
            </div>
        </div>
    </aside>
</template>

<script>
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
        return { showUserMenu: false }
    },
    computed: {
        isDashboardActive() {
            return this.$route?.path === '/dashboard';
        },
        isAcademyActive() {
            return this.$route?.path?.startsWith('/academy') || false;
        },
        isSupportActive() {
            return this.$route?.path === '/support';
        },
        isSettingsActive() {
            return this.$route?.path === '/settings';
        },
        isPlansActive() {
            return this.$route?.path === '/plans';
        },
        isOperationActive() {
            return this.$route?.path === '/operation'
        },
        isCopyTradingActive() {
            return this.$route?.path === '/copy-trading';
        },

        // PROPRIEDADES DE ADMIN CORRIGIDAS
        isMarkupActive() {
            return this.$route?.path === '/markup';
        },
        isStatsIAsActive() {
            return this.$route?.path === '/StatsIAs';
        },
        isExpertsActive() {
            return this.$route?.path === '/Experts';
        },
        isClientesActive() {
            return this.$route?.path === '/Clientes';
        },
        isWebhooksActive() {
            return this.$route?.path === '/Webhooks';
        },
        isAcademyManagementActive() {
            return this.$route?.path === '/AcademyManagement';
        },
        isAdminViewActive() {
            return this.$route?.path === '/Admin';
        },
        isMasterTraderActive() {
            return this.$route?.path === '/MasterTrader';
        },
    },
    methods: {
        close() {
            if (this.isOpen) {
                this.$emit('close-sidebar')
            }
        },
        toggleCollapse() {
            this.$emit('toggle-collapse')
        },
        navigateAndClose(route) {
            this.$router.push(route)
            this.close()
        },
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


<style scoped src="../assets/css/components/sidebar.css"></style>