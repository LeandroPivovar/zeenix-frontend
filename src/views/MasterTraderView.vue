<template>
    <div class="layout-master-trader">    <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @toggle-collapse="toggleSidebarCollapse"
            @close-sidebar="closeSidebar"
        />
        
        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                :balance="currentBalance?.balance || info?.balance"
                :account-type="accountType"
                :balances-by-currency-real="balancesByCurrencyReal"
                :balances-by-currency-demo="balancesByCurrencyDemo"
                :currency-prefix="preferredCurrencyPrefix"
                @open-settings="toggleSettingsModal"
                @account-type-changed="switchAccount"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @toggle-sidebar="toggleSidebar"
            />
            
            <!-- Settings Sidebar -->
            <SettingsSidebar
                :is-open="showSettingsModal"
                :balance="info?.balance"
                :account-type="accountType"
                :balances-by-currency-real="balancesByCurrencyReal"
                :balances-by-currency-demo="balancesByCurrencyDemo"
                :currency-prefix="preferredCurrencyPrefix"
                @close="closeSettingsModal"
                @account-type-changed="switchAccount"
            />

            <!-- Layout Desktop -->
            <section class="master-trader-status-nav desktop-layout">
                <div class="top-status-bar">
                    <div class="status-cards-container">

                        <div class="status-card">
                            <div class="status-header">
                                <span class="status-label">Copiers</span>
                                <button type="button" class="visibility-toggle-btn" @click.stop="toggleCardVisibility('copiers')">
                                    <i :class="visibleCards.copiers ? 'fas fa-eye' : 'fas fa-eye-slash'" class="visibility-icon"></i>
                                </button>
                            </div>
                            <span class="status-value">{{ visibleCards.copiers ? copiersCount : '***' }}</span>
                        </div>

                        <div class="status-card">
                            <div class="status-header">
                                <span class="status-label">Gerenciado</span>
                                <button type="button" class="visibility-toggle-btn" @click.stop="toggleCardVisibility('managed')">
                                    <i :class="visibleCards.managed ? 'fas fa-eye' : 'fas fa-eye-slash'" class="visibility-icon"></i>
                                </button>
                            </div>
                            <span class="status-value">{{ visibleCards.managed ? formatCurrency(copierStats.managedBalance) : '***' }}</span>
                        </div>

                        <div class="status-card">
                            <div class="status-header">
                                <span class="status-label">Lucro Hoje</span>
                                <button type="button" class="visibility-toggle-btn" @click.stop="toggleCardVisibility('profit')">
                                    <i :class="visibleCards.profit ? 'fas fa-eye' : 'fas fa-eye-slash'" class="visibility-icon"></i>
                                </button>
                            </div>
                            <span class="status-value profit">{{ visibleCards.profit ? formatCurrency(copierStats.todayProfit) : '***' }}</span>
                        </div>

                        <div class="status-card">
                            <div class="status-header">
                                <span class="status-label">Volume</span>
                                <button type="button" class="visibility-toggle-btn" @click.stop="toggleCardVisibility('volume')">
                                    <i :class="visibleCards.volume ? 'fas fa-eye' : 'fas fa-eye-slash'" class="visibility-icon"></i>
                                </button>
                            </div>
                            <span class="status-value">{{ visibleCards.volume ? formatCurrency(copierStats.totalVolume) : '***' }}</span>
                        </div>
                    </div>
                </div>
                <nav class="master-trader-mode-nav">
                    <button 
                        class="mode-nav-item" 
                        :class="{ active: activeMode === 'Detalhes Copiadores' }" 
                        @click="selectMode('Detalhes Copiadores')"
                    >
                        <i class="icon-info"></i> Detalhes Copiadores
                    </button>
                    
                    <button 
                        class="mode-nav-item" 
                        :class="{ active: activeMode === 'IA de Investimento' }" 
                        @click="selectMode('IA de Investimento')"
                    >
                        <i class="icon-info"></i> IA de Investimento
                    </button>
                    
                    <button 
                        class="mode-nav-item" 
                        :class="{ active: activeMode === 'Agente Autônomo' }" 
                        @click="selectMode('Agente Autônomo')"
                    >
                        <i class="icon-info"></i> Agente Autônomo
                    </button>
                    
                    <button 
                        class="mode-nav-item" 
                        :class="{ active: activeMode === 'Operação Manual' }" 
                        @click="selectMode('Operação Manual')"
                    >
                        <i class="icon-info"></i> Operação Manual
                    </button>
                </nav>
            </section>

            <!-- Layout Mobile -->
            <div class="mobile-layout">
                <!-- Card combinado: Header + Métricas -->
                <div class="mobile-header-metrics-card">
                    <!-- Título e Descrição -->
                    <h1 class="mobile-main-title">Copy Trading Mestre</h1>
                    <p class="mobile-description">Execute suas operações e gerencie os copiadores conectados à sua conta.</p>
                </div>

                <!-- Seção Superior: Métricas em Grid 2x2 -->
                <div class="mobile-metrics-grid">
                    <div class="mobile-metric-card">
                        <div class="mobile-metric-header">
                            <span class="mobile-metric-label">Copiers</span>
                            <button type="button" class="mobile-visibility-toggle-btn" @click.stop="toggleCardVisibility('copiers')">
                                <i :class="visibleCards.copiers ? 'fas fa-eye' : 'fas fa-eye-slash'" class="mobile-visibility-icon"></i>
                            </button>
                        </div>
                        <span class="mobile-metric-value">{{ visibleCards.copiers ? copiersCount : '***' }}</span>
                    </div>
                    <div class="mobile-metric-card">
                        <div class="mobile-metric-header">
                            <span class="mobile-metric-label">Gerenciado</span>
                            <button type="button" class="mobile-visibility-toggle-btn" @click.stop="toggleCardVisibility('managed')">
                                <i :class="visibleCards.managed ? 'fas fa-eye' : 'fas fa-eye-slash'" class="mobile-visibility-icon"></i>
                            </button>
                        </div>
                        <span class="mobile-metric-value">{{ visibleCards.managed ? formatCurrency(copierStats.managedBalance) : '***' }}</span>
                    </div>
                    <div class="mobile-metric-card">
                        <div class="mobile-metric-header">
                            <span class="mobile-metric-label">Lucro Hoje</span>
                            <button type="button" class="mobile-visibility-toggle-btn" @click.stop="toggleCardVisibility('profit')">
                                <i :class="visibleCards.profit ? 'fas fa-eye' : 'fas fa-eye-slash'" class="mobile-visibility-icon"></i>
                            </button>
                        </div>
                        <span class="mobile-metric-value profit">{{ visibleCards.profit ? formatCurrency(copierStats.todayProfit) : '***' }}</span>
                    </div>
                    <div class="mobile-metric-card">
                        <div class="mobile-metric-header">
                            <span class="mobile-metric-label">Volume</span>
                            <button type="button" class="mobile-visibility-toggle-btn" @click.stop="toggleCardVisibility('volume')">
                                <i :class="visibleCards.volume ? 'fas fa-eye' : 'fas fa-eye-slash'" class="mobile-visibility-icon"></i>
                            </button>
                        </div>
                        <span class="mobile-metric-value">{{ visibleCards.volume ? formatCurrency(copierStats.totalVolume) : '***' }}</span>
                    </div>
                </div>

                <!-- Seção Inferior: Opções de Navegação em Grid 2x2 -->
                <div class="mobile-options-grid">
                    <button 
                        class="mobile-option-card"
                        :class="{ active: activeMode === 'Detalhes Copiadores' }"
                        @click="selectMode('Detalhes Copiadores')"
                    >
                        <div class="mobile-option-icon-wrapper">
                            <svg class="mobile-option-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9" cy="7" r="2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="15" cy="7" r="2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 21v-2a4 4 0 0 0-4-4h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="mobile-option-content">
                            <span class="mobile-option-title">Copiadores</span>
                            <span class="mobile-option-subtitle">Gerenciar</span>
                        </div>
                        <span class="mobile-option-arrow">></span>
                    </button>

                    <button 
                        class="mobile-option-card"
                        :class="{ active: activeMode === 'IA de Investimento' }"
                        @click="selectMode('IA de Investimento')"
                    >
                        <div class="mobile-option-icon-wrapper">
                            <svg class="mobile-option-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="7" y="13" width="10" height="8" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="10" cy="17" r="1" fill="currentColor"/>
                                <circle cx="14" cy="17" r="1" fill="currentColor"/>
                                <circle cx="12" cy="7" r="2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="12" y1="4.5" x2="12" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="12" y1="9.5" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <circle cx="12" cy="4.5" r="0.5" fill="currentColor"/>
                            </svg>
                        </div>
                        <div class="mobile-option-content">
                            <span class="mobile-option-title">IA's</span>
                            <span class="mobile-option-subtitle">Operar</span>
                        </div>
                        <span class="mobile-option-arrow">></span>
                    </button>

                    <button 
                        class="mobile-option-card"
                        :class="{ active: activeMode === 'Agente Autônomo' }"
                        @click="selectMode('Agente Autônomo')"
                    >
                        <div class="mobile-option-icon-wrapper">
                            <svg class="mobile-option-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <rect x="8" y="8" width="8" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <line x1="4" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="12" y1="4" x2="12" y2="2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="mobile-option-content">
                            <span class="mobile-option-title">Agente</span>
                            <span class="mobile-option-subtitle">Configurar</span>
                        </div>
                        <span class="mobile-option-arrow">></span>
                    </button>

                    <button 
                        class="mobile-option-card"
                        :class="{ active: activeMode === 'Operação Manual' }"
                        @click="selectMode('Operação Manual')"
                    >
                        <div class="mobile-option-icon-wrapper">
                            <svg class="mobile-option-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="2 12 4 12 6 8 8 16 10 4 12 20 14 8 16 16 18 12 20 12 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="mobile-option-content">
                            <span class="mobile-option-title">Manual</span>
                            <span class="mobile-option-subtitle">Operar</span>
                        </div>
                        <span class="mobile-option-arrow">></span>
                    </button>
                </div>
            </div>

            <main id="master-trader-portal-target" class="master-trader-main-content">
                <component 
                    :is="currentViewComponent" 
                    :is-mobile="isMobile"
                    :is-sidebar-collapsed="isSidebarCollapsed"
                    :show-title="currentViewComponent === 'AgenteAutonomoView' ? false : true"
                />
            </main>
            <DesktopBottomNav />
        </div>
    </div>
</template>

<script>
// Componentes necessários (crie estes arquivos .vue)
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import CopiersDetails from '../components/masterTrader/CopiersDetails.vue'
import AIInvestment from '../components/masterTrader/InvestmentComponent.vue'
import AgenteAutonomoView from '../components/masterTrader/AgentAutonomoComponent.vue'
import ManualOperation from '../components/masterTrader/ManualOperationComponent.vue'
import accountBalanceMixin from '../mixins/accountBalanceMixin'

export default {
    name: 'MasterTraderView',
    mixins: [accountBalanceMixin],
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        CopiersDetails,
        AIInvestment,
        ManualOperation,
        AgenteAutonomoView,
        DesktopBottomNav
    },
    data() {
        return {
            isSidebarOpen: false, 
            isSidebarCollapsed: true,
            showDevModal: false,
            showSettingsModal: false,
            // Variável de estado para controlar o modo ativo
            activeMode: 'Detalhes Copiadores',
            isMobile: false,
            // Dados do header
            accountBalance: null,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            balanceUpdateInterval: null,
            preferredCurrency: 'USD',
            balancesByCurrencyReal: {},
            balancesByCurrencyDemo: {},
            visibleCards: {
                copiers: true,
                managed: true,
                profit: true,
                volume: true
            },
            copiersCount: 0,
            copierStats: {
                managedBalance: 0,
                todayProfit: 0,
                totalVolume: 0
            }
        }
    },
    computed: {
        // Mapeia o nome do modo para o nome do componente a ser renderizado
        currentViewComponent() {
            switch (this.activeMode) {
                case 'Detalhes Copiadores':
                    return 'CopiersDetails'
                case 'IA de Investimento':
                    return 'AIInvestment'
                case 'Operação Manual':
                    return 'ManualOperation'
                case 'Agente Autônomo':
                default:
                    return 'AgenteAutonomoView' 
            }
        }
    },
    methods: {
        formatCurrency(value) {
            if (value === undefined || value === null) return '$0.00';
            const val = parseFloat(value);
            return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        toggleSettingsModal() {
            this.showSettingsModal = !this.showSettingsModal;
        },
        closeSettingsModal() {
            this.showSettingsModal = false;
        },
        // Método para trocar o modo
        selectMode(modeName) {
            this.activeMode = modeName
        },
        toggleCardVisibility(cardKey) {
            console.log(`[MasterTrader] Alterando visibilidade de: ${cardKey}`);
            this.visibleCards[cardKey] = !this.visibleCards[cardKey];
            localStorage.setItem('master_trader_cards_visibility', JSON.stringify(this.visibleCards));
        },
        handleAccountTypeChange(newAccountType) {
            this.isDemo = newAccountType === 'demo';
            console.log('[MasterTrader] Tipo de conta alterado para:', this.isDemo ? 'demo' : 'real');
        },
        getPreferredCurrency() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    if (connection.tradeCurrency) {
                        const currency = connection.tradeCurrency.toUpperCase();
                        return currency;
                    }
                }
            } catch (error) {
                console.error('[MasterTrader] Erro ao parsear deriv_connection:', error);
            }
            return 'USD';
        },
        getDerivToken() {
            let accountLoginid = null;
            let preferredCurrency = null;
            
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    accountLoginid = connection.loginid;
                    preferredCurrency = connection.tradeCurrency;
                }
            } catch (error) {
                console.error('[MasterTrader] Erro ao parsear deriv_connection:', error);
            }
            
            const isDemoPreferred = preferredCurrency?.toUpperCase() === 'DEMO';
            if (isDemoPreferred) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                    
                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
                            return token;
                        }
                    }
                } catch (error) {
                    console.error('[MasterTrader] Erro ao buscar token demo:', error);
                }
            }
            
            if (accountLoginid) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                    
                    const specificToken = tokensByLoginId[accountLoginid];
                    if (specificToken) {
                        return specificToken;
                    }
                } catch (error) {
                    console.error('[MasterTrader] Erro ao buscar token específico:', error);
                }
            }
            
            return localStorage.getItem('deriv_token');
        },
        async fetchAccountBalance() {
            try {
                await this.loadAccountBalanceInfo();
                if (this.info) {
                    this.accountBalance = this.info.balance;
                    this.accountCurrency = this.info.currency;
                    this.accountLoginid = this.info.loginid;
                    this.isDemo = this.info.isDemo;
                    this.preferredCurrency = this.getPreferredCurrency();
                    this.balancesByCurrencyReal = this.info.balancesByCurrencyReal || {};
                    this.balancesByCurrencyDemo = this.info.balancesByCurrencyDemo || {};
                }
            } catch (error) {
                console.error('[MasterTrader] ❌ Erro ao buscar saldo da conta:', error);
            }
        },
        startBalanceUpdates() {
            this.fetchAccountBalance();
        },
        stopBalanceUpdates() {
            if (this.balanceUpdateInterval) {
                clearInterval(this.balanceUpdateInterval);
                this.balanceUpdateInterval = null;
            }
        },
        async loadCopiersCount() {
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                const token = localStorage.getItem('token');
                
                const response = await fetch(`${apiBase}/copy-trading/copiers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const result = await response.json();
                if (result.success && result.data) {
                    this.copiersCount = result.data.length;
                    
                    if (result.summary) {
                        this.copierStats = {
                            managedBalance: result.summary.managedBalance || 0,
                            todayProfit: result.summary.todayProfit || 0,
                            totalVolume: result.summary.totalVolume || 0
                        };
                    }
                } else {
                    this.copiersCount = 0;
                    this.copierStats = { managedBalance: 0, todayProfit: 0, totalVolume: 0 };
                }
            } catch (error) {
                console.error('[MasterTrader] Erro ao carregar contagem de copiadores:', error);
                this.copiersCount = 0;
                this.copierStats = { managedBalance: 0, todayProfit: 0, totalVolume: 0 };
            }
        },
        openDevModal() {
            this.showDevModal = true;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        checkMobile() {
            this.isMobile = window.innerWidth <= 1024;
            if (this.isMobile) {
                this.isSidebarOpen = false;
                this.isSidebarCollapsed = false;
            }
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        const saved = localStorage.getItem('master_trader_cards_visibility');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    Object.assign(this.visibleCards, parsed);
                }
            } catch (e) {
                console.error('[MasterTrader] Erro ao carregar visibilidade:', e);
            }
        }
        this.startBalanceUpdates();
        this.loadCopiersCount();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        this.stopBalanceUpdates();
    }
}
</script>

<style>
.header-master-trader,
.header-content {
    position: static !important;
    top: auto !important;
    z-index: auto !important;
    width: 100% !important; 
}

.main-content {
    position: static !important;
    width: 100%;
}

.layout-master-trader .content-wrapper {
    overflow-y: auto;
    position: static; 
    padding: 0 !important;
    flex-grow: 1;
}

/* Esconde componentes internos redundantes quando renderizados dentro do MasterTraderView */
.layout-master-trader .zenix-layout > .sidebar,
.layout-master-trader .zenix-layout > .content-wrapper > .top-navbar,
.layout-master-trader .zenix-layout > .content-wrapper > .top-header,
.layout-master-trader .layout-agente-autnomo > .sidebar,
.layout-master-trader .layout-agente-autnomo > .top-navbar,
.layout-master-trader .layout-agente-autnomo > .top-header,
.layout-master-trader .agente-autonomo-header,
.layout-master-trader .top-header {
    display: none !important;
}

/* Ajusta o layout do componente de agente quando renderizado dentro do MasterTraderView */
.layout-master-trader .layout-agente-autnomo {
    display: block !important;
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 0 !important;
    min-height: auto !important;
    background: transparent !important;
    position: relative !important;
}

/* Garante que o conteúdo do agente autônomo seja visível */
.layout-master-trader .layout-agente-autnomo .container-componentes {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* Remove margens e ajusta largura dos wrappers internos dos componentes filhos */
.layout-master-trader .content-wrapper,
.layout-master-trader .layout-content-agent-autonomo,
.layout-master-trader .zenix-layout {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    padding: 0 !important;
    max-width: none !important;
}

.layout-master-trader .master-trader-main-content {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    padding: 0 20px !important;
    max-width: none !important;
}

/* Ajusta o container de componentes do agente autônomo */
.layout-master-trader .layout-agente-autnomo .container-componentes {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    padding: 0 !important;
    max-width: none !important;
    margin-top: 0 !important;
}

/* Exceção específica para o Agente Autônomo ter um respiro interno */
.layout-master-trader .layout-content-agent-autonomo {
    padding: 0 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    margin: 0 !important;
}

@media screen and (max-width: 768px) {
    .layout-master-trader .layout-content-agent-autonomo {
        margin: 0 !important;
    }
}

/* Garante que o master-trader-portal-target seja visível */
.layout-master-trader #master-trader-portal-target {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    min-height: 100px !important;
}

/* Garante que o conteúdo principal não tenha margem superior excessiva por causa dos headers ocultos e zera paddings */
.layout-master-trader .main-content {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
}

/* Remove padding de 6rem do componente de Operação Manual */
.layout-master-trader .zenix-layout .content-wrapper,
.layout-master-trader .zenix-layout .operation-content,
.layout-master-trader .zenix-layout .main-content {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

/* Remove padding de 6rem dos componentes filhos dentro do ManualOperation */
.layout-master-trader .zenix-layout .operation-content > * {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

/* Remove padding-bottom de 6rem dos componentes de operação */
.layout-master-trader .zenix-layout .operation-chart,
.layout-master-trader .zenix-layout .operation-logs,
.layout-master-trader .zenix-layout .operation-last-orders,
.layout-master-trader .zenix-layout .operation-digits {
    padding-bottom: 0 !important;
}



</style>

<style scoped>

.layout-master-trader {
    display: flex;
    min-height: 100vh;
    background: #0b0b0b;
    color: #f0f6fc; /* Texto principal claro */
}


.layout-master-trader .agente-autonomo-header {
  display: none !important; 
}

.layout{
    margin: 0;
}

.content-wrapper {
    flex-grow: 1; 
    padding: 0;
    margin-top: 60px;
    padding: 20px!important;
}

.header-master-trader,
.header-content,
.top-fix {
    position: static !important;
    top: auto !important;
    z-index: auto !important;
    width: 100% !important; 
}

/* --------------------
    Status/Nav (Barra de Status da Imagem)
    -------------------- */
.master-trader-status-nav {
    display: flex;
    flex-direction: column; 
    align-items: stretch;
    background-color: #0d0c0c;
    border-radius: 0;
    padding: 90px 20px;
    margin: 0; 
    border-bottom: 1px solid #30363d;
    position: sticky; 
    top: 0;
    z-index: 10;
}

.top-status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}

.status-cards-container {
    display: flex;
    gap: 20px;
    width: 100%;
}

.status-card {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    min-width: 120px;
    border-radius: 15px;
    justify-content: center;
    background: #0e0f0f;
    border: 1px solid #1d1e1f;
    width: 100%;
    text-align: left;
}


.status-label {
    font-size: 0.8rem;
    color: #8b949e;
    margin-bottom: 3px;
    text-align: left;
    padding-left: 0;
}

.status-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: #f0f6fc;
}

.status-card.active-copy-trading {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 10px 15px;
    justify-content: flex-start;
}

.status-card.active-copy-trading .status-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.active-copy-trading .status-icon-wrapper {
    width: 40px;
    height: 40px;
    background-color: rgba(35, 134, 54, 0.13);
    border-radius: 50%;
    border: 1px solid #238636;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.active-copy-trading .status-icon-wrapper i,
.active-copy-trading .status-icon-wrapper svg {
    font-size: 1.1rem;
    color: #238636 !important;
}

.status-card {
    cursor: default;
}

.visibility-toggle-btn,
.mobile-visibility-toggle-btn {
    background: none;
    border: none;
    padding: 10px;
    margin: -10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    transition: opacity 0.2s;
    position: relative;
    z-index: 10;
}

.visibility-toggle-btn:hover,
.mobile-visibility-toggle-btn:hover {
    opacity: 0.7;
}

.visibility-icon,
.mobile-visibility-icon {
    font-size: 0.8rem;
    color: #8b949e;
    pointer-events: none;
}

.active-label {
    color: #22c55e;
    font-weight: 600;
}

.status-card.visibility-toggle-card {
    display: none;
}

.status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 3px;
}

.visibility-icon {
    font-size: 0.8rem;
    color: #8b949e; /* Mesma cor do label */
    cursor: pointer;
    transition: color 0.2s;
}

.visibility-icon:hover {
    color: #8b949e;
}

.profit {
    color: #22c55e;
    font-weight: bold;
}

.status-actions {
    display: flex;
    gap: 15px;
    border-left: 1px solid #30363d;
    margin-left: 30px;
    padding-left: 20px;
}

.action-icon-btn {
    background: none;
    border: none;
    color: #f0f6fc;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    padding: 5px;
}

.action-icon-btn:hover {
    opacity: 0.8;
}

.action-icon-btn.active-user {
    color: #238636;
    opacity: 1;
}

/* Simulação de Ícones (use Font Awesome/Material Icons no projeto real) */
.icon-bell::before { content: '🔔'; }
.icon-user::before { content: '👤'; }

/* --------------------
    Navegação de Modo/Ações Principais
    -------------------- */
.master-trader-mode-nav {
    display: flex;
    gap: 15px;
    justify-content: flex-start;
    padding: 10px 0;
    margin: 0;
}

.mode-nav-item {
    background-color: transparent;
    color: #8b949e; 
    border: none; 
    padding: 12px 25px;
    border-radius: 0; 
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    position: relative;
    width: 100%;
    text-align: center;
}

.mode-nav-item i {
    display: none; 
}

.mode-nav-item:hover {
    color: #f0f6fc;
}

.mode-nav-item.active {
    background-color: transparent;
    color: #22c55e; 
    font-weight: 600;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.267);
    border-bottom: 2px solid #22c55e; 
    border-radius: 12px;
}

/* Simulação de Ícone de Informação */
.icon-info::before { content: 'ⓘ'; }

/* Estilo Básico para a Área Principal */
.master-trader-main-content {
    border-radius: 8px;
    padding: 0;
    min-height: 400px; 
}

/* --------------------
    Layout Mobile
    -------------------- */
.mobile-layout {
    display: none;
}

/* Card combinado: Header + Métricas */
.mobile-header-metrics-card {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%);
    border: 1px solid #1C1C1C;
    position: relative;
    border-radius: 12px;
    padding: 20px;
    overflow: hidden;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
}

.mobile-header-metrics-card > * {
    position: relative;
    z-index: 1;
}

/* Header Section Mobile */
.mobile-header-section {
    margin-bottom: 20px;
}

.mobile-main-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f0f6fc;
    margin: 0 0 8px 0;
    text-align: left;
}

.mobile-description {
    font-size: 0.9rem;
    color: #f0f6fc;
    margin: 0;
    text-align: left;
    line-height: 1.5;
}

/* Grid de Métricas Mobile */
.mobile-metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 0;
}

.mobile-metric-card {
    display: flex;
    flex-direction: column;
    padding: 12px 15px;
    border-radius: 12px;
    background: rgba(14, 15, 15, 0.6);
    border: 1px solid rgba(29, 30, 31, 0.5);
    text-align: left;
    backdrop-filter: blur(10px);
}

.mobile-metric-label {
    font-size: 0.75rem;
    color: #8b949e;
    margin-bottom: 4px;
}

.mobile-metric-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: #f0f6fc;
}

.mobile-metric-value.profit {
    color: #22c55e;
}

.mobile-metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    width: 100%;
}

.mobile-visibility-icon {
    font-size: 0.85rem;
    color: #8b949e;
}

/* Grid de Opções Mobile */
.mobile-options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px!important;
}

.mobile-option-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    background: #0e0f0f;
    border: none;
    border-top: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.mobile-option-card:hover {
    background: rgba(34, 197, 94, 0.05);
}

.mobile-option-card.active {
    border-top: 2px solid #22c55e;
}

.mobile-option-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 50%;
    background: rgb(32 162 80 / 27%);
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.mobile-option-icon {
    width: 24px;
    height: 24px;
    stroke: #22c55e;
    fill: none;
    transition: stroke 0.2s ease;
}

.mobile-option-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 2px;
}

.mobile-option-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #f0f6fc;
}

.mobile-option-subtitle {
    font-size: 0.8rem;
    color: #8b949e;
}

.mobile-option-arrow {
    font-size: 1.2rem;
    color: #8b949e;
    flex-shrink: 0;
}

/* --------------------
    Media Queries
    -------------------- */
/* Sidebar Overlay */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9998 !important;
    backdrop-filter: blur(2px);
}

@media (max-width: 1024px) {
    .layout-master-trader {
        background: linear-gradient(180deg, #0f1e14 0, #060706 50%, #050504);
        padding: 80px 20px;
        margin-left: 0;
        width: 100%;
    }

    /* Esconde layout desktop no mobile */
    .desktop-layout {
        display: none !important;
    }

    /* Mostra layout mobile */
    .mobile-layout {
        display: block;
    }

    .content-wrapper {
        padding: 0 16px 20px 16px;
    }

    /* Esconde a seta nas opções mobile */
    .mobile-option-arrow {
        display: none;
    }

    /* Sidebar no mobile */
    :deep(.sidebar) {
        position: fixed;
        width: 280px !important;
        height: 100vh;
        z-index: 10000 !important;
        transform: translateX(-100%);
        transition: transform 0.3s ease-out;
    }

    :deep(.sidebar.is-open) {
        transform: translateX(0);
        z-index: 999999 !important;
    }
}

@media (max-width: 768px) {
    .layout-master-trader {
        background: linear-gradient(180deg, #0f1e14 0, #060706 50%, #050504);
        padding: 80px 15px;
    }

    .master-trader-main-content {
        padding-bottom: 0;
    }
}

@media (min-width: 1025px) {
    /* Esconde layout mobile no desktop */
    .mobile-layout {
        display: none !important;
    }

    /* Mostra layout desktop */
    .desktop-layout {
        display: flex;
    }
}
</style>
