<template>
    <div class="layout-master-trader" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />
        
        <TopNavbar 
            :is-sidebar-collapsed="isSidebarCollapsed"
            :balance="accountBalance"
            :account-type="isDemo ? 'demo' : 'real'"
            :currency="accountCurrency"
            @account-type-changed="handleAccountTypeChange"
        />

        <div class="content-wrapper">
            <section class="master-trader-status-nav">
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

            <main class="master-trader-main-content">
                <component :is="currentViewComponent" />
            </main>
        </div>
    </div>
</template>

<script>
// Componentes necessários (crie estes arquivos .vue)
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
import CopiersDetails from '../components/masterTrader/CopiersDetails.vue'
import AIInvestment from '../components/masterTrader/InvestmentComponent.vue'
import AgenteAutonomoView from '../components/masterTrader/AgentAutonomoComponent.vue'
import ManualOperation from './OperationView.vue'

export default {
    name: 'MasterTraderView',
    components: {
        AppSidebar,
        TopNavbar,
        CopiersDetails,
        AIInvestment,
        ManualOperation,
        AgenteAutonomoView
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
            preferredCurrency: 'USD'
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
                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.warn('[MasterTrader] ❌ Token não disponível para buscar saldo');
                    return;
                }
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/deriv-balance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ derivToken: derivToken }),
                });
                
                const result = await response.json();
                if (result.success && result.data) {
                    this.accountBalance = result.data.balance;
                    this.accountCurrency = result.data.currency;
                    this.accountLoginid = result.data.loginid;
                    this.isDemo = result.data.loginid?.startsWith('VRTC') || result.data.loginid?.startsWith('VRT');
                    this.preferredCurrency = this.getPreferredCurrency();
                }
            } catch (error) {
                console.error('[MasterTrader] ❌ Erro ao buscar saldo da conta:', error);
            }
        },
        startBalanceUpdates() {
            this.fetchAccountBalance();
            this.balanceUpdateInterval = setInterval(() => {
                this.fetchAccountBalance();
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
    background-color: #0b0b0a; /* Fundo escuro principal */
    color: #f0f6fc; /* Texto principal claro */
    width: calc(100% - 280px);
    margin-left: 280px;
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
    background-color: #0e0f0f;
    color: #22c55e; 
    font-weight: 600;
    box-shadow: none;
    border: 1px solid #1d1e1f;
    border-bottom: 2px solid #22c55e;
    border-radius: 15px;
}

/* Simulação de Ícone de Informação */
.icon-info::before { content: 'ⓘ'; }

/* Estilo Básico para a Área Principal */
.master-trader-main-content {
    border-radius: 8px;
    padding: 20px;
    min-height: 400px; 
}

/* --------------------
    Media Queries
    -------------------- */
@media (max-width: 1024px) {
    .layout-master-trader {
        margin-left: 0;
        width: 100%;
    }
}
</style>

