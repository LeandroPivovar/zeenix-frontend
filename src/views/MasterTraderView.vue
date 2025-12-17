<template>
    <div class="layout-master-trader" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <div
            v-if="isSidebarOpen"
            class="sidebar-overlay"
            @click="closeSidebar"
        ></div>
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @toggle-collapse="toggleSidebarCollapse"
            @close-sidebar="closeSidebar"
        />
        
        <TopNavbar 
            :is-sidebar-collapsed="isSidebarCollapsed"
            :balance="accountBalance"
            :account-type="isDemo ? 'demo' : 'real'"
            :currency="accountCurrency"
            :balances-by-currency-real="balancesByCurrencyReal"
            :balances-by-currency-demo="balancesByCurrencyDemo"
            @account-type-changed="handleAccountTypeChange"
            @toggle-sidebar-collapse="toggleSidebarCollapse"
            @toggle-sidebar="toggleSidebar"
        />

        <div class="content-wrapper">
            <!-- Layout Desktop -->
            <section class="master-trader-status-nav desktop-layout">
                <div class="top-status-bar">
                    <div class="status-cards-container">
                        <div class="status-card active-copy-trading">
                            <i class="status-icon active"></i>
                            <div class="status-text">
                                <span class="status-label">Copy Trading</span>
                                <span class="status-value active-label">Ativo</span>
                            </div>
                        </div>

                        <div class="status-card">
                            <span class="status-label">Copiers</span>
                            <span class="status-value">25</span>
                        </div>

                        <div class="status-card">
                            <span class="status-label">Gerenciado</span>
                            <span class="status-value">$141.76</span>
                        </div>

                        <div class="status-card">
                            <span class="status-label">Lucro Hoje</span>
                            <span class="status-value profit">+$18.60</span>
                        </div>

                        <div class="status-card">
                            <span class="status-label">Volume</span>
                            <span class="status-value">$450</span>
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
                    <div class="mobile-header-section">
                        <h1 class="mobile-main-title">Copy Trading Mestre</h1>
                        <p class="mobile-description">Execute suas operações e gerencie os copiadores conectados à sua conta.</p>
                    </div>

                    <!-- Seção Superior: Métricas em Grid 2x2 -->
                    <div class="mobile-metrics-grid">
                        <div class="mobile-metric-card">
                            <span class="mobile-metric-label">Copiers</span>
                            <span class="mobile-metric-value">25</span>
                        </div>
                        <div class="mobile-metric-card">
                            <span class="mobile-metric-label">Gerenciado</span>
                            <span class="mobile-metric-value">$141.76</span>
                        </div>
                        <div class="mobile-metric-card">
                            <span class="mobile-metric-label">Lucro Hoje</span>
                            <span class="mobile-metric-value profit">+$18.60</span>
                        </div>
                        <div class="mobile-metric-card">
                            <span class="mobile-metric-label">Volume</span>
                            <span class="mobile-metric-value">$450</span>
                        </div>
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

            <main class="master-trader-main-content">
                <component :is="currentViewComponent" />
            </main>
        </div>
        <DesktopBottomNav />
    </div>
</template>

<script>
// Componentes necessários (crie estes arquivos .vue)
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import CopiersDetails from '../components/masterTrader/CopiersDetails.vue'
import AIInvestment from '../components/masterTrader/InvestmentComponent.vue'
import AgenteAutonomoView from '../components/masterTrader/AgentAutonomoComponent.vue'
import ManualOperation from '../components/masterTrader/ManualOperationComponent.vue'
import { loadAccountBalance, reloadAccountBalance } from '../utils/balanceLoader'

export default {
    name: 'MasterTraderView',
    components: {
        AppSidebar,
        TopNavbar,
        CopiersDetails,
        AIInvestment,
        ManualOperation,
        AgenteAutonomoView,
        DesktopBottomNav
    },
    data() {
        return {
            isSidebarOpen: false, 
            isSidebarCollapsed: false,
            // Variável de estado para controlar o modo ativo
            activeMode: 'Detalhes Copiadores',
            // Dados do header
            accountBalance: null,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            balanceUpdateInterval: null,
            preferredCurrency: 'USD',
            balancesByCurrencyReal: {},
            balancesByCurrencyDemo: {}
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
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen
        },
        closeSidebar() {
            this.isSidebarOpen = false
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed
        },
        // Método para trocar o modo
        selectMode(modeName) {
            this.activeMode = modeName
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
                const balanceData = await loadAccountBalance();
                if (balanceData) {
                    this.accountBalance = balanceData.balance;
                    this.accountCurrency = balanceData.currency;
                    this.accountLoginid = balanceData.loginid;
                    this.isDemo = balanceData.isDemo;
                    this.preferredCurrency = this.getPreferredCurrency();
                    this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
                    this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
                }
            } catch (error) {
                console.error('[MasterTrader] ❌ Erro ao buscar saldo da conta:', error);
            }
        },
        startBalanceUpdates() {
            this.fetchAccountBalance();
            this.balanceUpdateInterval = setInterval(() => {
                reloadAccountBalance().then(balanceData => {
                    if (balanceData) {
                        this.accountBalance = balanceData.balance;
                        this.accountCurrency = balanceData.currency;
                        this.accountLoginid = balanceData.loginid;
                        this.isDemo = balanceData.isDemo;
                        this.preferredCurrency = this.getPreferredCurrency();
                        this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
                        this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
                    }
                }).catch(error => {
                    console.error('[MasterTrader] Erro ao atualizar saldo:', error);
                });
            }, 30000);
        },
        stopBalanceUpdates() {
            if (this.balanceUpdateInterval) {
                clearInterval(this.balanceUpdateInterval);
                this.balanceUpdateInterval = null;
            }
        }
    },
    mounted() {
        this.preferredCurrency = this.getPreferredCurrency();
        this.startBalanceUpdates();
    },
    beforeUnmount() {
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
    padding: 0 20px 20px 20px; /* Mantém o padding do scoped CSS */
    flex-grow: 1;
}

/* Esconde o header duplicado (que pode estar vindo do componente Agente Autônomo) */
.layout-master-trader .agente-autonomo-header {
    display: none !important;
}



</style>

<style scoped>

.layout-master-trader {
    display: flex;
    min-height: 100vh;
    background: #0b0b0b;
    color: #f0f6fc; /* Texto principal claro */
    width: calc(100% - 280px);
    margin-left: 280px;
    transition: margin-left 0.3s ease, width 0.3s ease;
}

.layout-master-trader .agente-autonomo-header {
  display: none !important; 
}

.layout{
    margin: 0;
}

.content-wrapper {
    flex-grow: 1; 
    padding: 0 20px 20px 20px;
    margin-top: 60px;
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
    border-radius: 8px;
    padding: 10px 20px;
    margin-bottom: 0; 
    border-bottom: 1px solid #30363d;
    /* Certifica que o Nav também não tente ser fixo */
    position: sticky; 
    top: 0;
    z-index: 10;
}
.master-trader-status-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #0d0c0c;
    border-radius: 0;
    margin: 0 -20px 0 -20px; /* Estende para as bordas do content-wrapper */
    padding: 10px 20px;
    border-bottom: 1px solid #30363d;
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
    gap: 10px;
    padding: 0 15px;
    justify-content: flex-start;
}

.status-card.active-copy-trading .status-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.active-copy-trading .status-icon {
    width: 20px;
    height: 20px;
    background-color: #23863721;
    border-radius: 12px;
    border: 1px solid #238636;
    position: relative;
    padding: 18px;
    margin-left: 0.5rem;
}

/* Símbolo de Power/Ligar (Unicode) */
.active-copy-trading .status-icon::before {
    content: '⏻'; 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    color: #238636;
}

.active-label {
    color: #22c55e;
    font-weight: 600;
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
    margin-top: 15px;
    margin-bottom: 16px;
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
    font-size: 1.75rem;
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

/* Grid de Opções Mobile */
.mobile-options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
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
    background: rgba(34, 197, 94, 0.15);
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
        z-index: 10000 !important;
    }
}

@media (max-width: 768px) {
    .layout-master-trader {
        background: linear-gradient(to bottom, #0f1e14 0%, #060706 50%, #050504 100%);
    }

    .master-trader-main-content {
        padding-bottom: 80px;
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
