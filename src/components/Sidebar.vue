<template>
    <aside class="sidebar" :class="{ 'is-open': isOpen, 'collapsed': isCollapsed }">
        <div class="brand">
            <div class="brand-text">
                <div class="title">ZENIX <span class="pro-badge">PRO</span></div>
            </div>
            <button class="toggle-sidebar-btn" @click="toggleCollapse" :title="isCollapsed ? 'Expandir sidebar' : 'Ocultar sidebar'" v-if="!isCollapsed">
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
                <svg class="icon-sidebar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
            </button>
            
            <button
                class="menu-item"
                :class="{ active: isStatsIAsActive }"
                @click="navigateAndClose('/StatsIAs')"
                data-text="IAs de Investimento"
            >
                <img src="../assets/icons/brain-2.svg" alt="" class="icon-sidebar">
                IA's de Investimento
            </button>

            <button
                class="menu-item"
                :class="{ active: isAutonomousAgentActive }"
                @click="navigateAndClose('/agente-autonomo')"
                data-text="Agente Autônomo"
            >
                <svg class="icon-sidebar" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M192 320C187.781 320 183.656 321.251 180.148 323.596C176.64 325.94 173.905 329.272 172.291 333.17C170.676 337.068 170.253 341.357 171.077 345.496C171.9 349.634 173.932 353.435 176.915 356.419C179.899 359.402 183.7 361.434 187.838 362.257C191.976 363.080 196.266 362.658 200.164 361.043C204.062 359.428 207.394 356.694 209.738 353.186C212.082 349.678 213.333 345.553 213.333 341.334C213.333 335.676 211.086 330.249 207.085 326.249C203.084 322.248 197.658 320 192 320ZM42.6666 298.667C37.0087 298.667 31.5825 300.915 27.5817 304.915C23.5809 308.916 21.3333 314.342 21.3333 320V362.667C21.3333 368.325 23.5809 373.751 27.5817 377.752C31.5825 381.753 37.0087 384 42.6666 384C48.3246 384 53.7508 381.753 57.7516 377.752C61.7524 373.751 64 368.325 64 362.667V320C64 314.342 61.7524 308.916 57.7516 304.915C53.7508 300.915 48.3246 298.667 42.6666 298.667ZM469.333 298.667C463.675 298.667 458.249 300.915 454.248 304.915C450.248 308.916 448 314.342 448 320V362.667C448 368.325 450.248 373.751 454.248 377.752C458.249 381.753 463.675 384 469.333 384C474.991 384 480.418 381.753 484.418 377.752C488.419 373.751 490.667 368.325 490.667 362.667V320C490.667 314.342 488.419 308.916 484.418 304.915C480.418 300.915 474.991 298.667 469.333 298.667ZM362.667 149.334H277.333V122.027C283.782 118.304 289.144 112.958 292.886 106.521C296.629 100.084 298.622 92.7796 298.667 85.3337C298.667 74.0178 294.171 63.1653 286.170 55.1638C278.168 47.1622 267.316 42.667 256 42.667C244.684 42.667 233.832 47.1622 225.830 55.1638C217.829 63.1653 213.333 74.0178 213.333 85.3337C213.378 92.7796 215.371 100.084 219.114 106.521C222.856 112.958 228.218 118.304 234.667 122.027V149.334H149.333C132.359 149.334 116.081 156.076 104.078 168.079C92.0762 180.081 85.3333 196.360 85.3333 213.334V405.334C85.3333 422.307 92.0762 438.586 104.078 450.588C116.081 462.591 132.359 469.334 149.333 469.334H362.667C379.641 469.334 395.919 462.591 407.921 450.588C419.924 438.586 426.667 422.307 426.667 405.334V213.334C426.667 196.360 419.924 180.081 407.921 168.079C395.919 156.076 379.641 149.334 362.667 149.334ZM292.693 192L282.027 234.667H229.973L219.307 192H292.693ZM384 405.334C384 410.992 381.752 416.418 377.752 420.419C373.751 424.419 368.325 426.667 362.667 426.667H149.333C143.675 426.667 138.249 424.419 134.248 420.419C130.248 416.418 128 410.992 128 405.334V213.334C128 207.676 130.248 202.249 134.248 198.249C138.249 194.248 143.675 192 149.333 192H175.36L192 261.12C193.168 265.854 195.922 270.044 199.804 272.994C203.685 275.944 208.460 277.476 213.333 277.334H298.667C303.540 277.476 308.315 275.944 312.196 272.994C316.078 270.044 318.832 265.854 320 261.12L336.64 192H362.667C368.325 192 373.751 194.248 377.752 198.249C381.752 202.249 384 207.676 384 213.334V405.334ZM320 320C315.781 320 311.656 321.251 308.148 323.596C304.640 325.940 301.905 329.272 300.291 333.170C298.676 337.068 298.253 341.357 299.077 345.496C299.900 349.634 301.932 353.435 304.915 356.419C307.899 359.402 311.700 361.434 315.838 362.257C319.976 363.080 324.266 362.658 328.164 361.043C332.062 359.428 335.394 356.694 337.738 353.186C340.082 349.678 341.333 345.553 341.333 341.334C341.333 335.676 339.086 330.249 335.085 326.249C331.084 322.248 325.658 320 320 320Z" fill="currentColor"/>
                </svg>
                Agente Autônomo
            </button>

            <button
                class="menu-item"
                :class="{ active: isCopyTradingActive }"
                @click="navigateAndClose('/copy-trader')"
                data-text="Copy Trading"
            >
                <svg class="icon-sidebar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="10" y="3" width="10" height="14" rx="2" ry="2"></rect>
                    <path d="M16 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"></path>
                </svg>
                Copy Trading
            </button>

            <button 
                class="menu-item" 
                :class="{ active: isOperationActive }"
                @click="navigateAndClose('/operation')"
                data-text="Operação Manual"
            >
                <svg class="icon-sidebar" viewBox="0 0 427 427" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M405.333 384H72.7467L164.693 292.053L172.8 308.267C174.243 311.126 176.312 313.624 178.853 315.575C181.394 317.526 184.342 318.879 187.477 319.535C190.613 320.191 193.856 320.132 196.965 319.363C200.075 318.594 202.971 317.135 205.440 315.093L298.667 237.44V256C298.667 261.658 300.914 267.084 304.915 271.085C308.916 275.086 314.342 277.333 320 277.333C325.658 277.333 331.084 275.086 335.085 271.085C339.086 267.084 341.333 261.658 341.333 256V192C341.282 189.670 340.850 187.364 340.053 185.173V183.467C339.251 181.853 338.247 180.348 337.067 178.987L335.360 177.280C334.065 176.114 332.632 175.111 331.093 174.293H328.960C326.290 172.415 323.225 171.174 320 170.667H256C250.342 170.667 244.916 172.914 240.915 176.915C236.914 180.916 234.667 186.342 234.667 192C234.667 197.658 236.914 203.084 240.915 207.085C244.916 211.086 250.342 213.333 256 213.333H261.12L199.040 264.960L189.653 246.400C188.151 243.387 185.956 240.773 183.250 238.770C180.543 236.768 177.401 235.435 174.080 234.880C170.734 234.329 167.305 234.583 164.078 235.622C160.850 236.661 157.916 238.454 155.520 240.853L42.6667 353.920V21.3333C42.6667 15.6754 40.4191 10.2492 36.4183 6.24839C32.4175 2.24761 26.9913 0 21.3333 0C15.6754 0 10.2492 2.24761 6.24839 6.24839C2.24761 10.2492 0 15.6754 0 21.3333V405.333C0 410.991 2.24761 416.417 6.24839 420.418C10.2492 424.419 15.6754 426.667 21.3333 426.667H405.333C410.991 426.667 416.417 424.419 420.418 420.418C424.419 416.417 426.667 410.991 426.667 405.333C426.667 399.675 424.419 394.249 420.418 390.248C416.417 386.248 410.991 384 405.333 384Z" fill="currentColor"/>
                </svg>
                Operação Manual
            </button>

            <button
                class="menu-item"
                :class="{ active: isMasterTraderActive }"
                @click="navigateAndClose('/MasterTrader')"
                data-text="Trader Mestre"
            >
                <svg class="icon-sidebar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <g v-if="masterTraderIcon === 'question'">
                        <path d="M9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.0827 14.5074 12.0831 13.619 12.7214C12.7306 13.3597 12 14.3364 12 15M12 17H12.01"/>
                    </g>
                    <g v-else>
                        <path d="M12 16V12M12 8H12.01"/>
                    </g>
                </svg>
                Trader Mestre
            </button>

            <button
                class="menu-item"
                :class="{ active: isSupportActive }"
                @click="navigateAndClose('/support')"
                data-text="Suporte"
            >
                <svg class="icon-sidebar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Suporte
            </button>

            <div class="separator"></div>
            
            <button
                class="menu-item"
                :class="{ active: isAcademyActive }"
                @click="navigateAndClose('/academy')"
                data-text="Zenix Academy"
            >
                <svg class="icon-sidebar" width="512" height="512" viewBox="0 0 512 512" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M489.6 180.267C489.6 182.4 488.533 188.8 482.133 192L249.6 280.534C246.4 281.6 243.2 281.6 241.067 280.534L8.53333 192C1.06667 188.8 0 182.4 0 180.267C0 178.134 1.06667 171.734 8.53333 168.534L241.067 80.0003C242.133 78.9336 244.267 78.9336 245.333 78.9336C246.4 78.9336 248.533 78.9336 249.6 80.0003L482.133 168.534C489.6 171.734 489.6 178.134 489.6 180.267ZM512 325.334V352C512 358.4 506.667 362.667 501.333 362.667C494.933 362.667 490.667 357.334 490.667 352V325.334C490.667 318.934 496 314.667 501.333 314.667C506.667 313.6 512 318.934 512 325.334Z" fill="currentColor"/>
                    <path d="M257.067 301.867L421.333 238.933V381.867C421.333 410.667 343.467 433.067 244.267 433.067C145.067 433.067 67.2 410.667 67.2 381.867V238.933L231.467 301.867C240 305.067 249.6 305.067 257.067 301.867ZM512 180.267V277.333C512 283.733 506.667 288 501.333 288C494.933 288 490.667 282.667 490.667 277.333V213.333C503.467 208 512 195.2 512 180.267Z" fill="currentColor"/>
                </svg>
                Zenix Academy
            </button>

            <button
                class="menu-item"
                :class="{ active: isPlansActive }"
                @click="navigateAndClose('/plans')"
                data-text="Planos"
            >
                <svg class="icon-sidebar" width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M460.4 143.2C436.8 143.6 417.2 164.4 418.4 188C418.8 201.2 425.2 212.4 434.8 220C385.2 286.4 334.8 291.6 276.4 181.6C297.2 171.2 308.8 144.8 293.6 118.4C286.4 105.6 271.6 99.2004 256.8 100C256.4 100 256.4 100 256 100C256 100 255.6 100 255.2 100C240.4 99.6004 226 105.6 218.4 118.4C203.2 144.8 214.8 171.2 235.6 181.6C177.2 291.6 126.8 286.4 77.2 220C86.8 212.4 93.2 200.8 93.6 188C94.4 164.4 75.2 143.6 51.6 143.2C27.2 142.8 7.59998 162 7.59998 186.4C7.59998 210 26.8 229.6 50.8 229.6C52.4 229.6 54.4 229.6 56 229.2L72.4 390C73.6 402.8 84.4 412.4 97.2 412.4H256H414.8C427.6 412.4 438.4 402.8 439.6 390L456 229.2C457.6 229.6 459.2 229.6 461.2 229.6C484.8 229.6 504.4 210.4 504.4 186.4C504.4 162 484.4 142.8 460.4 143.2Z" fill="currentColor"/>
                </svg>
                Planos
            </button>

            <button
                class="menu-item"
                :class="{ active: isSettingsActive }"
                @click="navigateAndClose('/settings')"
                data-text="Configuração"
            >
                <svg class="icon-sidebar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Configuração
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
                :class="{ active: isSupportItemsActive }"
                @click="navigateAndClose('/SupportItems')"
                data-text="Admin Suporte"
            >
                Admin Suporte
            </button>
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
            showUserMenu: false,
            masterTraderIcon: 'question', 
            masterTraderInterval: null,  
        }
    },
    computed: {
        isDashboardActive() { return this.$route?.path === '/dashboard'; },
        isAcademyActive() { return this.$route?.path?.startsWith('/academy') || false; },
        isSupportActive() { return this.$route?.path === '/support'; },
        isSettingsActive() { return this.$route?.path === '/settings'; },
        isPlansActive() { return this.$route?.path === '/plans'; },
        isOperationActive() { return this.$route?.path === '/operation' },
        isCopyTradingActive() { return this.$route?.path === '/copy-trader'; },
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
        goProfile() { this.$router.push('/profile'); },
        // Método para alternar o ícone
        toggleMasterTraderIcon() {
            this.masterTraderIcon = this.masterTraderIcon === 'question' ? 'exclamation' : 'question';
        }
    },
    // Adiciona o ciclo de vida para iniciar e limpar o intervalo
    mounted() {
        // Inicia o intervalo para alternar o ícone a cada 1 segundo (ajuste o valor se necessário)
        this.masterTraderInterval = setInterval(this.toggleMasterTraderIcon, 1000); 
    },
    beforeUnmount() {
        // Limpa o intervalo quando o componente é destruído para evitar vazamento de memória
        if (this.masterTraderInterval) {
            clearInterval(this.masterTraderInterval);
        }
    }
}
</script>

<style src="../assets/css/components/sidebar.css"></style>