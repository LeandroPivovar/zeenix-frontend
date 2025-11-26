<template>
    <aside class="sidebar" :class="{ 'is-open': isOpen, 'collapsed': isCollapsed }">
        <div class="brand">
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
                @click.prevent="navigateAndClose('/copy-trader')"
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