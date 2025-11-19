<template>
    <div class="layout-ia-investment">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

        <main class="layout-content-investment">
            <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button> 
            
            <header class="header-investment">
                <div class="header-info-container">
                    
                    <div class="header-info-item balance-item">
                        <span class="info-label">saldo</span>
                        <div class="info-value-group">
                            <span class="info-value">{{ formattedBalance }}</span>
                            <span v-if="isDemo" class="badge demo-badge">Demo</span>
                            <span v-else class="badge real-badge">Real</span>
                        </div>
                    </div>
                    
                    <div class="header-info-item result-item">
                        <span class="info-label">resultado hoje</span>
                        <div class="info-value-group">
                            <span class="info-value result-value" :class="dailyProfitClass">{{ formattedDailyProfit }}</span>
                            <span class="result-percent" :class="dailyProfitClass">{{ formattedDailyProfitPercent }}</span>
                        </div>
                    </div>

                    <div class="header-info-item trades-item">
                        <span class="info-label">trades hoje</span>
                        <span class="info-value">{{ dailyStats.totalTrades }}</span>
                    </div>

                    <div class="header-info-item wins-item">
                        <span class="info-label">vitórias</span>
                        <span class="info-value text-zenix-green">{{ dailyStats.wins || 0 }}</span>
                    </div>

                    <div class="header-info-item losses-item">
                        <span class="info-label">derrotas</span>
                        <span class="info-value text-zenix-red" style="color: #f44336 !important;">{{ dailyStats.losses || 0 }}</span>
                    </div>

                    <div class="header-info-item status-item">
                        <span class="info-label">status</span>
                        <div class="info-value-group">
                            <span class="status-dot" :class="{ 'active': isInvestmentActive }"></span>
                            <span class="info-value status-text" :class="{ 'active': isInvestmentActive }">IA {{ isInvestmentActive ? 'Ativa' : 'Inativa' }}</span>
                        </div>
                    </div>
                </div>

                <div class="header-actions">
                    <button class="btn-action pause-btn" :class="{ 'active': isInvestmentActive, 'inactive': !isInvestmentActive }" @click="toggleInvestmentState">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="isInvestmentActive" d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="white"/>
                            <path v-else d="M8 5V19L19 12L8 5Z" fill="white"/>
                        </svg>
                        {{ isInvestmentActive ? 'Pausar IA' : 'Ativar IA' }}
                    </button>
                </div>
            </header>
            
            <div class="main-content-area">
                <InvestmentActive 
                    v-if="isInvestmentActive" 
                    :ticks="ticks" 
                    :current-price="currentPrice"
                    :entry-value-config="entryValue"
                    :profit-target-config="profitTarget"
                    :loss-limit-config="lossLimit"
                    :mode-config="mode"
                    :account-balance-prop="accountBalance"
                    :account-currency-prop="accountCurrency"
                />
                <InvestmentInactive 
                    v-else 
                    :ticks="ticks" 
                    :current-price="currentPrice"
                    :last-update-time="formattedLastUpdate"
                    @update:entryValue="entryValue = $event"
                    @update:profitTarget="profitTarget = $event"
                    @update:lossLimit="lossLimit = $event"
                    @update:mode="mode = $event"
                    @update:modoMartingale="modoMartingale = $event"
                />
            </div>
        </main>

        <footer class="zenix-footer">
            <div class="footer-inner">
                <div class="footer-grid">
                    <div class="footer-brand-section">
                        <div class="zenix-logo-text-footer">
                            <div class="logo-main-text">ZENIX</div>
                            <div class="logo-sub-text">PRO</div>
                        </div>
                        <p class="footer-description">
                            Plataforma inteligente de investimentos com IA, copy trading e automação para traders profissionais.
                        </p>
                        <div class="footer-social-links">
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-twitter text-sm"></i>
                            </a>
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-linkedin text-sm"></i>
                            </a>
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-instagram text-sm"></i>
                            </a>
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-youtube text-sm"></i>
                            </a>
                        </div>
                    </div>

                    <div v-for="section in footerSections" :key="section.title" class="footer-section">
                        <h3 class="footer-section-title">{{ section.title }}</h3>
                        <ul class="footer-links-list">
                            <li v-for="link in section.links" :key="link">
                                <a href="#" class="footer-link">{{ link }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom-bar">
                    <div class="footer-bottom-content">
                        <p class="footer-copyright">© 2025 Zenix Pro. Todos os direitos reservados.</p>
                        <div class="footer-legal-links">
                            <a href="#" class="footer-link-legal">Política de Privacidade</a>
                            <span class="footer-separator">|</span>
                            <a href="#" class="footer-link-legal">Termos de Uso</a>
                            <span class="footer-separator">|</span>
                            <a href="#" class="footer-link-legal">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
// Componentes e lógica mantidos
import AppSidebar from '../components/Sidebar.vue';
import InvestmentInactive from '@/components/Investments/InvestmentInactive.vue'; 
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';

export default {
    name: 'InvestmentIAView',
    components: {
        AppSidebar,
        InvestmentInactive,
        InvestmentActive
    },
    data() {
        return {
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            // ⭐️ Alterado para 'false' para iniciar no estado Inativo
            isInvestmentActive: false, 

            // Dados de ticks para o gráfico
            ticks: [],
            currentPrice: null,
            pollingInterval: null,

            // Parâmetros da IA (recebidos do componente filho)
            entryValue: 0.35, // Valor de entrada padrão (mínimo da Deriv)
            profitTarget: 100,
            lossLimit: 25,
            mode: 'veloz',
            modoMartingale: 'conservador', // Modo de martingale: conservador, moderado, agressivo

            // Dados da conta Deriv (para exibição no header)
            accountBalance: null,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            lastBalanceUpdate: null,
            balanceUpdateInterval: null,
            clockInterval: null, // Intervalo para atualizar horário
            
            // Estatísticas do dia
            dailyStats: {
                profitLoss: 0,
                profitLossPercent: 0,
                totalTrades: 0,
                winrate: 0,
                wins: 0,
                losses: 0
            },
            statsUpdateInterval: null,

            footerSections: [
                {
                    title: 'Produto',
                    links: ['IA de Investimento', 'Copy Trading', 'Agente Autônomo', 'Zenix Academy']
                },
                {
                    title: 'Empresa',
                    links: ['Sobre Nós', 'Planos', 'Blog', 'Carreiras']
                },
                {
                    title: 'Suporte',
                    links: ['Central de Ajuda', 'Documentação', 'Status do Sistema', 'Contato']
                }
            ]
        }
    },
    watch: {
        entryValue(newValue) {
            console.log('[InvestmentIAView] 💰 Valor de entrada atualizado:', newValue);
        },
        profitTarget(newValue) {
            console.log('[InvestmentIAView] 🎯 Meta de lucro atualizada:', newValue);
        },
        lossLimit(newValue) {
            console.log('[InvestmentIAView] 🛑 Limite de perda atualizado:', newValue);
        },
        mode(newValue) {
            console.log('[InvestmentIAView] ⚡ Modo atualizado:', newValue);
        }
    },
    computed: {
        // 💰 Formatar saldo com moeda
        formattedBalance() {
            if (this.accountBalance === null || this.accountBalance === undefined) {
                return '--';
            }
            return `${this.accountCurrency} ${this.accountBalance.toFixed(2)}`;
        },
        
        // ⏰ Formatar horário atual (sempre atualizado)
        formattedLastUpdate() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        
        // 📊 Estatísticas formatadas
        formattedDailyProfit() {
            const value = this.dailyStats.profitLoss || 0;
            const sign = value >= 0 ? '+' : '';
            return `${sign}${this.accountCurrency} ${Math.abs(value).toFixed(2)}`;
        },
        
        formattedDailyProfitPercent() {
            const value = this.dailyStats.profitLossPercent || 0;
            const sign = value >= 0 ? '+' : '';
            return `(${sign}${value.toFixed(2)}%)`;
        },
        
        dailyProfitClass() {
            return this.dailyStats.profitLoss >= 0 ? 'profit-positive' : 'profit-negative';
        }
    },
    methods: {
        // Método para alternar o estado da IA
        async toggleInvestmentState() {
            if (this.isInvestmentActive) {
                await this.deactivateIA();
            } else {
                await this.activateIA();
            }
        },

        // Ativar IA
        async activateIA() {
            try {
                console.log('[InvestmentIAView] ===== ATIVANDO IA =====');
                console.log('[InvestmentIAView] 💰 VALOR DE ENTRADA:', this.entryValue);
                console.log('[InvestmentIAView] Parâmetros configurados:', {
                    entryValue: this.entryValue,
                    profitTarget: this.profitTarget,
                    lossLimit: this.lossLimit,
                    mode: this.mode
                });

                // VALIDAÇÃO: Garantir que entryValue não seja menor que 0.35
                if (!this.entryValue || this.entryValue < 0.35) {
                    console.warn('[InvestmentIAView] ⚠️ Valor de entrada inválido:', this.entryValue);
                    return;
                }

                // Obter userId
                const userId = this.getUserId();
                if (!userId) {
                    console.error('[InvestmentIAView] ❌ Usuário não identificado');
                    return;
                }

                // Obter token Deriv
                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.error('[InvestmentIAView] ❌ Token Deriv não encontrado');
                    return;
                }

                // Obter moeda preferida
                const preferredCurrency = this.getPreferredCurrency();
                
                // Buscar saldo da conta ANTES de ativar a IA
                console.log('[InvestmentIAView] 💰 Verificando saldo da conta...');
                try {
                    const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                    const balanceResponse = await fetch(`${apiBase}/ai/deriv-balance`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ derivToken: derivToken }),
                    });
                    
                    const balanceResult = await balanceResponse.json();
                    if (balanceResult.success && balanceResult.data) {
                        const balance = balanceResult.data.balance;
                        const currency = balanceResult.data.currency;
                        const loginid = balanceResult.data.loginid;
                        
                        console.log('[InvestmentIAView] 💰 Saldo:', balance, currency);
                        console.log('[InvestmentIAView] 🔑 LoginID:', loginid);
                        
                        // Log de aviso se saldo for insuficiente
                        if (balance < this.entryValue) {
                            console.warn('[InvestmentIAView] ⚠️ Saldo insuficiente:', balance, 'necessário:', this.entryValue);
                        }
                    }
                } catch (balanceError) {
                    console.warn('[InvestmentIAView] ⚠️ Não foi possível verificar saldo:', balanceError);
                }

                // Usar os valores configurados pelo usuário
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/activate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        stakeAmount: this.entryValue,
                        derivToken: derivToken,
                        currency: preferredCurrency,
                        mode: this.mode.toLowerCase(),
                        profitTarget: this.profitTarget,
                        lossLimit: this.lossLimit,
                        modoMartingale: this.modoMartingale || 'conservador',
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    this.isInvestmentActive = true;
                    console.log('[InvestmentIAView] ✅ IA ativada com sucesso!');
                } else {
                    console.error('[InvestmentIAView] ❌ Erro ao ativar IA:', result.message);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao ativar IA:', error);
            }
        },

        // Desativar IA
        async deactivateIA() {
            try {
                console.log('[InvestmentIAView] Desativando IA...');

                const userId = this.getUserId();
                if (!userId) {
                    console.error('[InvestmentIAView] ❌ Usuário não identificado');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/deactivate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    this.isInvestmentActive = false;
                    console.log('[InvestmentIAView] ✅ IA desativada com sucesso!');
                } else {
                    console.error('[InvestmentIAView] ❌ Erro ao desativar IA:', result.message);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao desativar IA:', error);
            }
        },

        // Obter userId do token JWT
        getUserId() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.userId || payload.sub || payload.id) {
                        return payload.userId || payload.sub || payload.id;
                    }
                }

                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    if (userInfo.id || userInfo.userId) {
                        return userInfo.id || userInfo.userId;
                    }
                }

                console.warn('[InvestmentIAView] Não foi possível obter userId');
                return null;
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao obter userId:', error);
                return null;
            }
        },

        // Obter token Deriv
        getDerivToken() {
            console.log('[InvestmentIAView] Buscando token Deriv...');

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
                console.error('[InvestmentIAView] Erro ao parsear deriv_connection:', error);
            }

            // Se a moeda preferida for DEMO, buscar token de conta demo
            const isDemoPreferred = preferredCurrency?.toUpperCase() === 'DEMO';
            if (isDemoPreferred) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);

                    for (const [loginid, token] of Object.entries(tokensByLoginId)) {
                        if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
                            console.log('[InvestmentIAView] ✓ Token demo encontrado');
                            return token;
                        }
                    }
                } catch (error) {
                    console.error('[InvestmentIAView] Erro ao buscar token demo:', error);
                }
            }

            // Se temos um loginid específico, buscar o token correspondente
            if (accountLoginid) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);

                    const specificToken = tokensByLoginId[accountLoginid];
                    if (specificToken) {
                        console.log('[InvestmentIAView] ✓ Token específico encontrado');
                        return specificToken;
                    }
                } catch (error) {
                    console.error('[InvestmentIAView] Erro ao buscar token específico:', error);
                }
            }

            // Fallback: token padrão
            const defaultToken = localStorage.getItem('deriv_token');
            if (!defaultToken) {
                console.error('[InvestmentIAView] ERRO: Nenhum token encontrado!');
            }

            return defaultToken;
        },

        // Obter moeda preferida (IGUAL AO OperationChart)
        getPreferredCurrency() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    if (connection.tradeCurrency) {
                        const currency = connection.tradeCurrency.toUpperCase();
                        // NÃO converter DEMO para USD aqui - deixar o backend/Deriv API lidar
                        // A conta DEMO pode ter saldo em USD, mas precisamos do token da conta demo certa
                        console.log('[InvestmentIAView] Moeda preferida:', currency);
                        return currency;
                    }
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao parsear deriv_connection:', error);
            }

            return 'USD';
        },

        // 💰 Buscar saldo da conta Deriv
        async fetchAccountBalance() {
            try {
                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.warn('[InvestmentIAView] ❌ Token não disponível para buscar saldo');
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
                    this.lastBalanceUpdate = new Date();
                    
                    console.log('[InvestmentIAView] ✅ Saldo atualizado:', {
                        balance: this.accountBalance,
                        currency: this.accountCurrency,
                        loginid: this.accountLoginid,
                        isDemo: this.isDemo
                    });
                } else {
                    console.error('[InvestmentIAView] ❌ Erro ao buscar saldo:', result.message || 'Unknown error');
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar saldo da conta:', error);
            }
        },

        // ⏰ Iniciar atualização periódica do saldo
        startBalanceUpdates() {
            // Buscar saldo imediatamente
            this.fetchAccountBalance();
            
            // Atualizar a cada 30 segundos
            this.balanceUpdateInterval = setInterval(() => {
                this.fetchAccountBalance();
            }, 30000); // 30 segundos
        },

        // 🛑 Parar atualização periódica do saldo
        stopBalanceUpdates() {
            if (this.balanceUpdateInterval) {
                clearInterval(this.balanceUpdateInterval);
                this.balanceUpdateInterval = null;
            }
        },

        // ⏰ Iniciar relógio em tempo real
        startClock() {
            // Atualizar a cada segundo
            this.clockInterval = setInterval(() => {
                // Forçar reatividade atualizando lastBalanceUpdate
                this.lastBalanceUpdate = new Date();
            }, 1000); // 1 segundo
        },

        // 🛑 Parar relógio
        stopClock() {
            if (this.clockInterval) {
                clearInterval(this.clockInterval);
                this.clockInterval = null;
            }
        },
        
        // 📊 Buscar estatísticas do dia
        async fetchDailyStats() {
            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentIAView] ❌ UserId não disponível para buscar stats');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const url = `${apiBase}/ai/session-stats/${userId}`;
                
                console.log('[InvestmentIAView] 📊 Buscando estatísticas diárias:', url);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                console.log('[InvestmentIAView] 📦 Stats recebidas:', result);
                
                if (result.success && result.data) {
                    const profitLoss = parseFloat(result.data.profitLoss) || 0;
                    const totalVolume = parseFloat(result.data.totalVolume) || 1;
                    const profitLossPercent = (profitLoss / totalVolume) * 100;
                    
                    this.dailyStats = {
                        profitLoss: profitLoss,
                        profitLossPercent: profitLossPercent,
                        totalTrades: parseInt(result.data.totalTrades) || 0,
                        winrate: parseFloat(result.data.winrate) || 0,
                        wins: parseInt(result.data.wins) || 0,
                        losses: parseInt(result.data.losses) || 0
                    };
                    
                    console.log('[InvestmentIAView] ✅ Stats atualizadas:', this.dailyStats);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar estatísticas:', error);
            }
        },
        
        // ⏰ Iniciar atualização periódica das estatísticas
        startStatsUpdates() {
            // Buscar estatísticas imediatamente
            this.fetchDailyStats();
            
            // Atualizar a cada 10 segundos
            this.statsUpdateInterval = setInterval(() => {
                this.fetchDailyStats();
            }, 10000);
            
            console.log('[InvestmentIAView] ⏰ Atualizações de stats iniciadas');
        },
        
        // 🛑 Parar atualização periódica das estatísticas
        stopStatsUpdates() {
            if (this.statsUpdateInterval) {
                clearInterval(this.statsUpdateInterval);
                this.statsUpdateInterval = null;
                console.log('[InvestmentIAView] ⏹️ Atualizações de stats paradas');
            }
        },

        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },

        // ===== MÉTODOS PARA CARREGAR DADOS DA IA =====
        
        async startDataLoading() {
            try {
                console.log('[InvestmentIAView] ===== INICIANDO CARREGAMENTO DE DADOS =====');
                
                // Iniciar monitoramento no backend
                const response = await fetch('https://taxafacil.site/api/ai/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('[InvestmentIAView] Status da resposta:', response.status);
                const result = await response.json();
                console.log('[InvestmentIAView] Resultado:', result);

                if (result.success) {
                    console.log('[InvestmentIAView] ✅ Carregamento de dados iniciado');
                    
                    // Iniciar polling para buscar dados a cada 2 segundos
                    this.startPolling();
                } else {
                    console.warn('[InvestmentIAView] ⚠ Não foi possível iniciar:', result.message);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ ERRO ao iniciar carregamento:', error);
                console.error('[InvestmentIAView] Detalhes:', error.message);
            }
        },

        startPolling() {
            // Buscar dados imediatamente
            this.fetchTicks();

            // Continuar buscando a cada 2 segundos
            this.pollingInterval = setInterval(() => {
                this.fetchTicks();
            }, 2000);
        },

        stopPolling() {
            if (this.pollingInterval) {
                clearInterval(this.pollingInterval);
                this.pollingInterval = null;
            }
        },

        async fetchTicks() {
            try {
                console.log('[InvestmentIAView] Buscando ticks...');
                const response = await fetch('https://taxafacil.site/api/ai/ticks');
                const result = await response.json();

                console.log('[InvestmentIAView] Ticks recebidos:', {
                    success: result.success,
                    ticksCount: result.data?.ticks?.length || 0,
                    currentPrice: result.data?.currentPrice
                });

                if (result.success) {
                    this.ticks = result.data.ticks || [];
                    this.currentPrice = result.data.currentPrice;
                    console.log('[InvestmentIAView] ✅ Ticks atualizados:', this.ticks.length);
                }
            } catch (error) {
                console.error('[InvestmentIAView] ❌ Erro ao buscar ticks:', error);
            }
        },

        async checkAIStatus() {
            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.warn('[InvestmentIAView] userId não encontrado');
                    return;
                }

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/ai/config/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const result = await response.json();

                if (result.success && result.data) {
                    const config = result.data;
                    this.isInvestmentActive = config.isActive || false;
                    
                    if (config.isActive) {
                        console.log('[InvestmentIAView] ✅ IA JÁ ESTÁ ATIVA!');
                    } else {
                        console.log('[InvestmentIAView] IA está inativa');
                    }
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao verificar status da IA:', error);
            }
        }
    },

    async mounted() {
        // TESTE CRÍTICO - Sempre deve aparecer no console
        console.log('🚀 TESTE: InvestmentIAView mounted() foi chamado!');
        console.warn('⚠️ SE VOCÊ VÊ ESTA MENSAGEM, O COMPONENTE ESTÁ CARREGANDO!');
        
        // Verificar se a IA já está ativa
        await this.checkAIStatus();
        
        // Iniciar carregamento de dados
        console.log('[InvestmentIAView] Iniciando carregamento de dados...');
        this.startDataLoading();
        
        // 💰 Iniciar atualização de saldo
        console.log('[InvestmentIAView] Iniciando atualização de saldo...');
        this.startBalanceUpdates();
        
        // ⏰ Iniciar relógio
        console.log('[InvestmentIAView] Iniciando relógio em tempo real...');
        this.startClock();
        
        // 📊 Iniciar atualização de estatísticas
        console.log('[InvestmentIAView] Iniciando atualização de estatísticas...');
        this.startStatsUpdates();
    },

    beforeUnmount() {
        console.log('[InvestmentIAView] Limpando polling antes de desmontar...');
        this.stopPolling();
        
        // 💰 Parar atualização de saldo
        console.log('[InvestmentIAView] Parando atualização de saldo...');
        this.stopBalanceUpdates();
        
        // ⏰ Parar relógio
        console.log('[InvestmentIAView] Parando relógio...');
        this.stopClock();
        
        // 📊 Parar atualização de estatísticas
        console.log('[InvestmentIAView] Parando atualização de estatísticas...');
        this.stopStatsUpdates();
    }
}
</script>

<style scoped>
/* Variáveis de Cores (Sugestões para o estilo escuro) */
:root {
    --zenix-background: #1e1e1e; /* Fundo Escuro */
    --zenix-text: #ffffff; /* Texto Claro */
    --zenix-secondary: #aaaaaa; /* Texto Secundário (cinza claro) */
    --zenix-dark-border: #333333; /* Borda/Separador escuro */
    --zenix-green: #4CAF50; /* Verde principal para Ativo */
    --zenix-red: #f44336; /* Vermelho para Pausar/Inativo */
    --zenix-header-height: 80px; /* Altura aproximada do header */
}

/* ------------------ Layout Geral e Responsividade ------------------ */

.layout-ia-investment {
    min-height: 100vh;
    background-color: var(--zenix-background);
    color: var(--zenix-text);
    font-family: Arial, sans-serif;
    width: calc(100% - 240px);
    margin-left: 240px;
}

.layout-content-investment {
    width: 100%;
    padding: 0;
}

/* Compensação de altura para o header fixo */
.main-content-area {
    width: 100%;
    padding: 20px;
    padding-top: var(--zenix-header-height); /* Adiciona espaço no topo */
}

/* Ajuste para quando a sidebar estiver fechada ou no mobile (o CSS da sidebar controlaria isso) */
@media (max-width: 1024px) {
    .layout-ia-investment {
        width: 100%;
        margin-left: 0;
    }
    
    .header-investment {
        max-width: 100%; /* O header fixo ocupa a largura total no mobile */
    }
}

/* Botão hamburger (oculto em desktop) */
.hamburger-btn {
    display: none;
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 20;
    background: none;
    color: white;
}


/* ------------------ Header (Baseado na Imagem) ------------------ */

.header-investment {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    padding: 15px 20px;
    background-color: #0e0f0f; 
    border-bottom: 1px solid var(--zenix-dark-border);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    position: fixed; /* FIXO */
    top: 0;
    z-index: 10;
    max-width: calc(100% - 240px);
    height: var(--zenix-header-height);
}

.header-info-container {
    display: flex;
    gap: 20px; /* Espaçamento mais apertado como na imagem */
    align-items: center;
}

/* Removendo borda dos itens, mantendo apenas a separação */
.header-info-item {
    display: flex;
    flex-direction: column;
    white-space: nowrap; 
    text-align: left;
    padding-right: 20px; /* Espaçamento para o separador */
    border-right: 1px solid var(--zenix-dark-border); /* Separador vertical */
}

/* O último item não tem separador */
.header-info-item:last-child {
    border-right: none;
    padding-right: 0;
}

/* Ajuste para o item de Saldo, que é maior */
.balance-item {
     padding-right: 30px;
}


.info-label {
    font-size: 0.8rem;
    color: var(--zenix-secondary);
    margin-bottom: 3px;
    text-transform: uppercase;
    font-weight: 500;
}

.info-value-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-value {
    font-size: 1.2rem; /* Aumentado para melhor destaque */
    font-weight: 700;
}

.info-value.text-zenix-red {
    color: var(--zenix-red) !important;
}

.info-value.text-zenix-green {
    color: var(--zenix-green) !important;
}

.losses-item .info-value,
.header-info-item.losses-item .info-value,
.header-info-item.losses-item span.info-value {
    color: var(--zenix-red) !important;
}

.wins-item .info-value,
.header-info-item.wins-item .info-value,
.header-info-item.wins-item span.info-value {
    color: var(--zenix-green) !important;
}

/* Estilos Específicos */
.result-value {
    color: var(--zenix-green); 
}

.result-percent {
    font-size: 0.9rem;
    color: var(--zenix-green);
    font-weight: 500;
}

/* Cores dinâmicas de lucro/prejuízo */
.profit-positive {
    color: var(--zenix-green) !important;
}

.profit-negative {
    color: #ef4444 !important; /* Vermelho para prejuízo */
}

.text-zenix-green {
    color: var(--zenix-green);
}

.text-zenix-red {
    color: var(--zenix-red) !important;
}

.badge {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.real-badge {
    background-color: var(--zenix-green);
    color: #000000;
}

.demo-badge {
    background-color: #333333;
    color: var(--zenix-secondary);
}

.status-item .info-value-group {
    gap: 5px;
}

.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-dot {
    background-color: var(--zenix-red); /* Cor padrão inativa */
}

.status-dot.active {
    background-color: var(--zenix-green);
}

.status-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--zenix-red); /* Cor padrão inativa */
}

.status-text.active {
    color: var(--zenix-green);
}

/* Ações do Header */
.header-actions {
    display: flex;
    gap: 10px;
}

.btn-action {
    padding: 12px 20px; /* Aumentado um pouco */
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer ;
}

/* Estilo do botão de Pausa/Ativação */
.pause-btn.active {
    background-color: var(--zenix-green);
    color: white;
}
.pause-btn.active:hover {
    background-color: #3e8e41; /* Verde mais escuro no hover */
}

.pause-btn.inactive {
    background-color: var(--zenix-red); /* Exemplo para quando estiver Inativo (botão Ativar IA) */
    color: white;
}
.pause-btn.inactive:hover {
    background-color: #c0392b; /* Vermelho mais escuro no hover */
}

/* ------------------ Responsividade do Header ------------------ */

@media (max-width: 1024px) {
    .hamburger-btn {
        display: block; /* Mostra o botão hamburger no mobile */
    }

    .header-investment {
        max-width: 100%;
        padding-left: 60px; /* Espaço para o botão hamburger */
    }
}

@media (max-width: 900px) {
    .header-investment {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        height: auto; /* Altura flexível */
        position: relative; /* Deixa de ser fixo no topo em telas menores */
        padding-top: 60px; /* Mais espaço para o hamburger se estiver ativado */
    }
    
    .main-content-area {
        padding-top: 20px; /* Remove a compensação fixa de altura */
    }


    .header-info-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 colunas */
        gap: 20px 15px;
    }
    
    .header-info-item {
        border-right: none; /* Remove separador vertical */
        padding-right: 0;
        border-bottom: 1px solid var(--zenix-dark-border); /* Adiciona separador horizontal */
        padding-bottom: 10px;
    }

    .header-info-item:last-child {
        border-bottom: none;
    }
    
    .header-actions {
        width: 100%;
        justify-content: space-between;
        margin-top: 10px;
    }

    .btn-action {
        flex-grow: 1; 
        justify-content: center;
    }
}

@media (max-width: 500px) {
     .header-info-container {
        grid-template-columns: 1fr; /* 1 coluna em telas muito pequenas */
    }
}


/* ------------------ Footer Responsividade ------------------ */

/* Estilos de Footer mantidos (sem alterações aqui, pois já estavam bons) */

.zenix-footer {
    background-color: var(--zenix-background);
    border-top: 1px solid var(--zenix-dark-border);
    padding: 30px;
}

.footer-inner {
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
}

.footer-brand-section {
    grid-column: span 2;
}

/* Mobile: O footer vira 2 colunas */
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
    }

    .footer-brand-section {
        grid-column: span 2; 
    }

    .footer-section {
        grid-column: span 1; 
    }
}

/* Mobile Pequeno: O footer vira 1 coluna */
@media (max-width: 480px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .footer-brand-section, .footer-section {
        grid-column: span 1;
    }

    .footer-bottom-content {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .footer-legal-links {
        flex-wrap: wrap;
        justify-content: center;
    }

    .footer-separator:first-of-type {
        display: none; 
    }
}

.zenix-logo-text-footer {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 12px;
}

.logo-main-text {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.05em;
}

.logo-sub-text {
    font-size: 0.875rem;
    color: var(--zenix-secondary);
    font-weight: 700;
}

.footer-description {
    font-size: 0.875rem;
    color: var(--zenix-secondary);
    margin-bottom: 24px;
    text-align: left;
    max-width: 350px;
}

.footer-social-links {
    display: flex;
    gap: 16px;
}

.social-link {
    color: var(--zenix-secondary);
    transition: color 0.2s;
}
.social-link:hover {
    color: var(--zenix-green);
}

.footer-section-title {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 12px;
    text-align: left;

}

.footer-links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;

}

.footer-link {
    font-size: 0.875rem;
    color: var(--zenix-secondary);
    text-decoration: none;
    transition: color 0.2s;
}
.footer-link:hover {
    color: var(--zenix-text);
}

.footer-bottom-bar {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--zenix-dark-border);
}

.footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-copyright {
    font-size: 0.75rem;
    color: var(--zenix-secondary);
}

.footer-legal-links {
    display: flex;
    align-items: center;
    gap: 12px;
}

.footer-link-legal {
    font-size: 0.75rem;
    color: var(--zenix-secondary);
    text-decoration: none;
    transition: color 0.2s;
}
.footer-link-legal:hover {
    color: var(--zenix-text);
}

.footer-separator {
    color: rgba(141, 141, 141, 0.5);
    font-size: 0.75rem;
}

</style>
