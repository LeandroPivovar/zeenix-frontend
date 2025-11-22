<template>
    <div class="zenix-layout">
        <div class="content-wrapper">
            <header class="top-header">
                <div class="header-content">
                    <div class="header-left-content">
                        <h1 class="header-title">IA Orion – Operação Automática Ativa</h1>
                        <p class="header-subtitle">A IA está monitorando o mercado e executando operações conforme sua configuração.</p>
                    </div>
                    <div class="header-actions-right">
                        <div class="balance-display-card">
                            <div class="balance-header">
                                <i class="far fa-wallet"></i>
                                <div class="balance-info">
                                    <span class="balance-label">Saldo Atual</span>
                                    <div class="balance-value-row">
                                        <span id="balanceValue" class="balance-value" v-if="balanceVisible">{{ formattedBalance }}</span>
                                        <span class="balance-value" v-else>••••••</span>
                <button 
                                            v-if="balanceVisible && !isDemo" 
                                            class="account-type-btn real-btn"
                                            @click="toggleBalanceVisibility"
                                        >
                                            Real
                </button>
                <button 
                                            v-if="balanceVisible && isDemo" 
                                            class="account-type-btn demo-btn"
                                            @click="toggleBalanceVisibility"
                                        >
                                            Demo
                </button>
                            <button class="eye-toggle-btn" @click="toggleBalanceVisibility" :title="balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'">
                                            <i class="far fa-eye"></i>
                            </button>
                        </div>
                        </div>
                    </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="main-content">
                <!-- Configuration Cards Grid - Only show when IA is inactive -->
                <div class="config-grid" v-if="!isInvestmentActive">
                    <!-- Mercado & Estratégia -->
                    <div id="market-strategy-card" class="config-card premium-card">
                        <h3 class="card-title">
                            Mercado & Estratégia
                            <i class="fas fa-info-circle"></i>
                        </h3>
                        <div class="card-content">
                            <div class="form-group">
                                <label class="form-label">
                                    Selecione o mercado
                                    <i class="fas fa-question-circle"></i>
                                </label>
                                <select id="marketSelect" class="form-select" v-model="selectedMarket">
                                    <option value="vol10">Volatility 10 Index</option>
                                    <option value="vol25">Volatility 25 Index</option>
                                    <option value="vol50">Volatility 50 Index</option>
                                    <option value="vol75">Volatility 75 Index</option>
                                    <option value="vol100">Volatility 100 Index</option>
                                    <option value="vol10_1s">Volatility 10 (1s) Index</option>
                                    <option value="vol25_1s">Volatility 25 (1s) Index</option>
                                    <option value="vol50_1s">Volatility 50 (1s) Index</option>
                                    <option value="vol75_1s">Volatility 75 (1s) Index</option>
                                    <option value="vol100_1s">Volatility 100 (1s) Index</option>
                                    <option value="jump10">Jump 10 Index</option>
                                    <option value="jump25">Jump 25 Index</option>
                                    <option value="jump50">Jump 50 Index</option>
                                    <option value="jump75">Jump 75 Index</option>
                                    <option value="jump100">Jump 100 Index</option>
                                </select>
                                <p id="marketDescription" class="form-help">{{ marketDescription }}</p>
                        </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    Estratégia
                                    <i class="fas fa-question-circle"></i>
                                </label>
                                <select id="strategySelect" class="form-select" v-model="selectedStrategy">
                                    <option value="orion">IA Orion</option>
                                    <option value="vega">IA Vega</option>
                                    <option value="pulse">IA Pulse</option>
                                    <option value="nova">IA Nova</option>
                                    <option value="titan">IA Titan</option>
                                    <option value="phoenix">IA Phoenix</option>
                                    <option value="quantum">IA Quantum</option>
                                    <option value="nebula">IA Nebula</option>
                                    <option value="apex">IA Apex</option>
                                    <option value="zenith">IA Zenith</option>
                                </select>
                                <p id="strategyDescription" class="form-help">Análise técnica avançada com machine learning</p>
                    </div>

                            <div class="form-group">
                                <label class="form-label">Modo de Negociação</label>
                                <div class="mode-buttons">
                                    <button 
                                        id="modeVeloz" 
                                        :class="['mode-btn', { 'active': mode === 'veloz' }]"
                                        @click="mode = 'veloz'"
                                    >
                                        Veloz
                                    </button>
                                    <button 
                                        id="modeModerate" 
                                        :class="['mode-btn', { 'active': mode === 'moderado' }]"
                                        @click="mode = 'moderado'"
                                    >
                                        Moderado
                                    </button>
                                    <button 
                                        id="modeLento" 
                                        :class="['mode-btn', { 'active': mode === 'lento' }]"
                                        @click="mode = 'lento'"
                                    >
                                        Lento
                                    </button>
                                </div>
                                <p id="modeDescription" class="form-help">{{ modeDescription }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Parâmetros de Entrada -->
                    <div id="entry-params-card" class="config-card premium-card">
                        <h3 class="card-title">Parâmetros de Entrada</h3>
                        <div class="card-content">
                            <div class="form-group">
                                <label class="form-label">Valor de Entrada (USD)</label>
                                <input 
                                    type="number" 
                                    class="form-input" 
                                    v-model.number="entryValue"
                                    min="0.35"
                                    step="0.01"
                                >
                                <p class="form-help">{{ entryPercent }}% do saldo</p>
                    </div>

                            <div class="form-group">
                                <label class="form-label">Alvo de Lucro (USD)</label>
                                <input 
                                    type="number" 
                                    class="form-input" 
                                    v-model.number="profitTarget"
                                    min="0"
                                    step="0.01"
                                >
                                <p class="form-help">{{ profitPercent }}% do saldo</p>
                    </div>

                            <div class="form-group">
                                <label class="form-label">Limite de Perda (USD)</label>
                                <input 
                                    type="number" 
                                    class="form-input" 
                                    v-model.number="lossLimit"
                                    min="0"
                                    step="0.01"
                                >
                                <p class="form-help">{{ lossPercent }}% do saldo</p>
                        </div>
                    </div>
                </div>

                    <!-- Gerenciamento de Risco -->
                    <div id="risk-management-card" class="config-card premium-card">
                        <h3 class="card-title">Gerenciamento de Risco</h3>
                        <div class="card-content">
                            <div class="risk-buttons">
                                <button 
                                    :class="['risk-btn', { 'active': modoMartingale === 'fixo' }]"
                                    @click="modoMartingale = 'fixo'"
                                >
                                    Fixo
                                </button>
                                <button 
                                    :class="['risk-btn', { 'active': modoMartingale === 'conservador' }]"
                                    @click="modoMartingale = 'conservador'"
                                >
                                    Conservador
                                </button>
                                <button 
                                    :class="['risk-btn', { 'active': modoMartingale === 'moderado' }]"
                                    @click="modoMartingale = 'moderado'"
                                >
                                    Moderado
                                </button>
                                <button 
                                    :class="['risk-btn', { 'active': modoMartingale === 'agressivo' }]"
                                    @click="modoMartingale = 'agressivo'"
                                >
                                    Agressivo
                    </button>
                </div>
                            
                            <div class="risk-indicator">
                                <div class="risk-header">
                                    <span class="risk-label">Nível de Risco</span>
                                    <span id="riskLevelText" class="risk-level-text">{{ riskLevelText }}</span>
                                </div>
                                <div class="risk-bar-container">
                                    <div id="riskBar" class="risk-bar" :style="{ width: riskBarWidth }"></div>
                                </div>
                                <p id="riskDescription" class="risk-description">{{ riskDescriptionText }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Controle da IA -->
                    <div id="ai-control-card" class="config-card premium-card ai-control-card">
                        <div class="ai-control-bg">
                            <div class="animated-grid-ai"></div>
                            <div class="particles-ai">
                                <div class="particle-ai particle-ai-1"></div>
                                <div class="particle-ai particle-ai-2"></div>
                                <div class="particle-ai particle-ai-3"></div>
                                <div class="particle-ai particle-ai-4"></div>
                            </div>
                            <div class="data-streams-ai">
                                <div class="stream-ai stream-ai-1"></div>
                                <div class="stream-ai stream-ai-2"></div>
                                <div class="stream-ai stream-ai-3"></div>
                            </div>
                        </div>
                        
                        <div class="ai-control-content">
                            <div class="ai-status-control">
                                <div>
                                    <p class="ai-status-title">Status da IA</p>
                                    <p class="ai-status-subtitle">Controle de execução automática</p>
                                </div>
                                <div class="ai-status-toggle-wrapper">
                                    <span id="aiStatusText" class="ai-status-text" :class="{ 'active': isInvestmentActive }">
                                        {{ isInvestmentActive ? 'Ativada' : 'Desativada' }}
                                    </span>
                                    <label class="toggle-switch">
                                        <input 
                                            type="checkbox" 
                                            :checked="isInvestmentActive"
                                            @change="handleToggleChange"
                                        >
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="ai-status-note">
                                <p class="ai-note-text">Desativação manual pelo usuário</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chart Section - Only show when IA is active -->
                <section id="chart-section" class="chart-section" v-if="isInvestmentActive">
                <InvestmentActive 
                    :ticks="ticks" 
                    :current-price="currentPrice"
                    :entry-value-config="entryValue"
                    :profit-target-config="profitTarget"
                    :loss-limit-config="lossLimit"
                    :mode-config="mode"
                    :account-balance-prop="accountBalance"
                    :account-currency-prop="accountCurrency"
                        @deactivate="deactivateIA"
                />
                </section>

        </main>

            <!-- Footer -->
            <footer id="footer" class="zenix-footer">
                <div class="footer-content">
                <div class="footer-grid">
                        <div class="footer-brand">
                            <div class="footer-logo">
                                <span class="footer-logo-main">ZENIX</span>
                                <span class="footer-logo-sub">PRO</span>
                        </div>
                        <p class="footer-description">
                                Plataforma inteligente de investimentos com IA, copy trading e automação.
                            </p>
                            <div class="footer-social">
                                <a href="#" class="social-icon"><i class="fa-brands fa-twitter"></i></a>
                                <a href="#" class="social-icon"><i class="fa-brands fa-linkedin"></i></a>
                                <a href="#" class="social-icon"><i class="fa-brands fa-instagram"></i></a>
                                <a href="#" class="social-icon"><i class="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                        <div class="footer-column">
                            <h3 class="footer-column-title">Produto</h3>
                            <ul class="footer-links">
                                <li><a href="#">IA de Investimento</a></li>
                                <li><a href="#">Copy Trading</a></li>
                                <li><a href="#">Agente Autônomo</a></li>
                                <li><a href="#">Zenix Academy</a></li>
                        </ul>
                    </div>
                        
                        <div class="footer-column">
                            <h3 class="footer-column-title">Empresa</h3>
                            <ul class="footer-links">
                                <li><a href="#">Sobre Nós</a></li>
                                <li><a href="#">Planos</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Carreiras</a></li>
                            </ul>
                </div>

                        <div class="footer-column">
                            <h3 class="footer-column-title">Suporte</h3>
                            <ul class="footer-links">
                                <li><a href="#">Central de Ajuda</a></li>
                                <li><a href="#">Documentação</a></li>
                                <li><a href="#">Status do Sistema</a></li>
                                <li><a href="#">Contato</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p class="footer-copyright">© 2025 Zenix Pro. Todos os direitos reservados.</p>
                        <div class="footer-legal">
                            <a href="#">Política de Privacidade</a>
                            <span class="footer-separator">|</span>
                            <a href="#">Termos de Uso</a>
                            <span class="footer-separator">|</span>
                            <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
        </div>
    </div>
</template>

<script>
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';

export default {
    name: 'InvestmentIAView',
    components: {
        InvestmentActive
    },
    data() {
        return {
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            isInvestmentActive: false, 

            ticks: [],
            currentPrice: null,
            pollingInterval: null,

            entryValue: 0.35,
            profitTarget: 100,
            lossLimit: 25,
            mode: 'veloz',
            modoMartingale: 'conservador',

            selectedMarket: 'vol10',
            selectedStrategy: 'orion',
            
            accountBalance: null,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            lastBalanceUpdate: null,
            balanceVisible: true,
            balanceUpdateInterval: null,
            clockInterval: null,
            
            dailyStats: {
                profitLoss: 0,
                profitLossPercent: 0,
                totalTrades: 0,
                winrate: 0,
                wins: 0,
                losses: 0
            },
            statsUpdateInterval: null,

            marketDescriptions: {
                vol10: 'Volatilidade constante de 10% com um tique por segundo',
                vol25: 'Volatilidade constante de 25% com um tique por segundo',
                vol50: 'Volatilidade constante de 50% com um tique por segundo',
                vol75: 'Volatilidade constante de 75% com um tique por segundo',
                vol100: 'Volatilidade constante de 100% com um tique por segundo',
                vol10_1s: 'Volatilidade constante de 10% com um tique a cada 1 segundo',
                vol25_1s: 'Volatilidade constante de 25% com um tique a cada 1 segundo',
                vol50_1s: 'Volatilidade constante de 50% com um tique a cada 1 segundo',
                vol75_1s: 'Volatilidade constante de 75% com um tique a cada 1 segundo',
                vol100_1s: 'Volatilidade constante de 100% com um tique a cada 1 segundo',
                jump10: 'Volatilidade de 10% com saltos ocasionais de aproximadamente 30%',
                jump25: 'Volatilidade de 25% com saltos ocasionais de aproximadamente 60%',
                jump50: 'Volatilidade de 50% com saltos ocasionais de aproximadamente 100%',
                jump75: 'Volatilidade de 75% com saltos ocasionais de aproximadamente 150%',
                jump100: 'Volatilidade de 100% com saltos ocasionais de aproximadamente 200%'
            }
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
        },
        selectedMarket(newValue) {
            console.log('[InvestmentIAView] 📊 Mercado selecionado:', newValue);
        }
    },
    computed: {
        formattedBalance() {
            if (this.accountBalance === null || this.accountBalance === undefined) {
                return '$0,00';
            }
            return `$${this.accountBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
        
        formattedLastUpdate() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        
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
        },
        
        marketDescription() {
            return this.marketDescriptions[this.selectedMarket] || this.marketDescriptions.vol10;
        },
        
        modeDescription() {
            const descriptions = {
                'veloz': 'Mais negociações, menos precisão',
                'moderado': 'Negociações e precisão moderado',
                'lento': 'Menos operações, mais precisão'
            };
            return descriptions[this.mode] || descriptions.veloz;
        },
        
        entryPercent() {
            if (!this.accountBalance || this.accountBalance <= 0) return '0.00';
            return ((this.entryValue / this.accountBalance) * 100).toFixed(2);
        },
        
        profitPercent() {
            if (!this.accountBalance || this.accountBalance <= 0) return '0.00';
            return ((this.profitTarget / this.accountBalance) * 100).toFixed(2);
        },
        
        lossPercent() {
            if (!this.accountBalance || this.accountBalance <= 0) return '0.00';
            return ((this.lossLimit / this.accountBalance) * 100).toFixed(2);
        },
        
        riskLevelText() {
            const labels = {
                'fixo': 'Fixo',
                'conservador': 'Baixo',
                'moderado': 'Médio',
                'agressivo': 'Alto'
            };
            return labels[this.modoMartingale] || 'Baixo';
        },
        
        riskBarWidth() {
            const widths = {
                'fixo': '15%',
                'conservador': '25%',
                'moderado': '50%',
                'agressivo': '75%'
            };
            return widths[this.modoMartingale] || '25%';
        },
        
        riskDescriptionText() {
            const descriptions = {
                'fixo': 'Valor de entrada fixo sem variação',
                'conservador': 'Proteção máxima do capital com crescimento estável',
                'moderado': 'Equilíbrio entre proteção e crescimento',
                'agressivo': 'Maior exposição para potencial de retorno elevado'
            };
            return descriptions[this.modoMartingale] || descriptions.conservador;
        }
    },
    methods: {
        toggleBalanceVisibility() {
            this.balanceVisible = !this.balanceVisible;
            console.log('[InvestmentIAView] 👁️ Visibilidade do saldo:', this.balanceVisible ? 'visível' : 'oculto');
        },
        
        async handleToggleChange(event) {
            const isChecked = event.target.checked;
            console.log('[InvestmentIAView] 🔄 Toggle alterado:', isChecked ? 'Ativar' : 'Desativar');
            
            if (isChecked && !this.isInvestmentActive) {
                // Ativando IA
                await this.activateIA();
            } else if (!isChecked && this.isInvestmentActive) {
                // Desativando IA
                await this.deactivateIA();
            }
        },
        
        async toggleInvestmentState() {
            if (this.isInvestmentActive) {
                await this.deactivateIA();
            } else {
                await this.activateIA();
            }
        },

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

                if (!this.entryValue || this.entryValue < 0.35) {
                    console.warn('[InvestmentIAView] ⚠️ Valor de entrada inválido:', this.entryValue);
                    return;
                }

                const userId = this.getUserId();
                if (!userId) {
                    console.error('[InvestmentIAView] ❌ Usuário não identificado');
                    return;
                }

                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.error('[InvestmentIAView] ❌ Token Deriv não encontrado');
                    return;
                }

                const preferredCurrency = this.getPreferredCurrency();
                
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
                        
                        if (balance < this.entryValue) {
                            console.warn('[InvestmentIAView] ⚠️ Saldo insuficiente:', balance, 'necessário:', this.entryValue);
                        }
                    }
                } catch (balanceError) {
                    console.warn('[InvestmentIAView] ⚠️ Não foi possível verificar saldo:', balanceError);
                }

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

            const defaultToken = localStorage.getItem('deriv_token');
            if (!defaultToken) {
                console.error('[InvestmentIAView] ERRO: Nenhum token encontrado!');
            }

            return defaultToken;
        },

        getPreferredCurrency() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    if (connection.tradeCurrency) {
                        const currency = connection.tradeCurrency.toUpperCase();
                        console.log('[InvestmentIAView] Moeda preferida:', currency);
                        return currency;
                    }
                }
            } catch (error) {
                console.error('[InvestmentIAView] Erro ao parsear deriv_connection:', error);
            }

            return 'USD';
        },

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
        },

        startClock() {
            this.clockInterval = setInterval(() => {
                this.lastBalanceUpdate = new Date();
            }, 1000);
        },

        stopClock() {
            if (this.clockInterval) {
                clearInterval(this.clockInterval);
                this.clockInterval = null;
            }
        },
        
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
        
        startStatsUpdates() {
            this.fetchDailyStats();
            this.statsUpdateInterval = setInterval(() => {
                this.fetchDailyStats();
            }, 10000);
            
            console.log('[InvestmentIAView] ⏰ Atualizações de stats iniciadas');
        },
        
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
        
        async startDataLoading() {
            try {
                console.log('[InvestmentIAView] ===== INICIANDO CARREGAMENTO DE DADOS =====');
                
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
            this.fetchTicks();
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
        console.log('🚀 TESTE: InvestmentIAView mounted() foi chamado!');
        console.warn('⚠️ SE VOCÊ VÊ ESTA MENSAGEM, O COMPONENTE ESTÁ CARREGANDO!');
        
        await this.checkAIStatus();
        
        console.log('[InvestmentIAView] Iniciando carregamento de dados...');
        this.startDataLoading();
        
        console.log('[InvestmentIAView] Iniciando atualização de saldo...');
        this.startBalanceUpdates();
        
        console.log('[InvestmentIAView] Iniciando relógio em tempo real...');
        this.startClock();
        
        console.log('[InvestmentIAView] Iniciando atualização de estatísticas...');
        this.startStatsUpdates();
    },

    beforeUnmount() {
        console.log('[InvestmentIAView] Limpando polling antes de desmontar...');
        this.stopPolling();
        
        console.log('[InvestmentIAView] Parando atualização de saldo...');
        this.stopBalanceUpdates();
        
        console.log('[InvestmentIAView] Parando relógio...');
        this.stopClock();
        
        console.log('[InvestmentIAView] Parando atualização de estatísticas...');
        this.stopStatsUpdates();
    }
}
</script>

<style scoped>
/* Importando estilos do design fornecido */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
}

.zenix-layout {
    min-height: 100vh;
    background-color: #0B0B0B;
    color: #DFDFDF;
}

.main-content[data-v-6bc9cf2c]{
    margin: 0;
}
.content-wrapper {
    min-height: 100vh;
    transition: margin-left 0.3s ease;
    box-sizing: border-box;
    width: 100%;
}

.content-wrapper.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
}

/* Top Header */
.top-header {
    position: static;
    background-color: #0E0E0E;
    border-bottom: 1px solid #1C1C1C;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    transition: left 0.3s ease;
    box-sizing: border-box;
}

.content-wrapper.sidebar-collapsed .top-header {
    left: 0;
    width: 100%;
}

.header-content {
    padding: 1rem 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
}

.header-left-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    justify-content: center;
    align-items: flex-start;
}

.header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #DFDFDF;
    margin: 0;
    line-height: 1.2;
}

.header-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
    margin: 0;
    line-height: 1.4;
}

.balance-display-card {
    background-color: #0E0E0E;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 0.75rem;
    transition: all 0.3s ease;
}

.balance-display-card:hover {
    background: #111;
    transform: translateY(-1px);
}

.balance-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.balance-header i {
    color: #22C55E;
    font-size: 0.75rem;
}

.balance-info {
    display: flex;
    flex-direction: column;
}

.balance-label {
    font-size: 0.625rem;
    color: #7A7A7A;
    font-weight: 500;
}

.balance-value-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.125rem;
}

.balance-value {
    font-size: 1rem;
    font-weight: bold;
    color: #DFDFDF;
}

.account-type-btn {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
}

.real-btn {
    background-color: #22C55E;
    color: #000;
}

.real-btn:hover {
    background-color: #16A34A;
}

.demo-btn {
    background-color: #333;
    color: #A1A1A1;
}

.eye-toggle-btn {
    background: none;
    border: none;
    color: #A1A1A1;
    cursor: pointer;
    padding: 0.25rem;
    transition: color 0.2s;
}

.eye-toggle-btn:hover {
    color: #DFDFDF;
}

/* Main Content */
.main-content {
    margin-top: 70px;
    padding: 1.5rem 20px;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
}

/* AI Vision Panel */
#ai-vision-panel {
    margin-left: 0;
    margin-right: 0;
    margin-top: 1.5rem;
    width: 100%;
    box-sizing: border-box;
}

.ai-vision-card {
    background: radial-gradient(circle at top left, #101010 0%, #0E0E0E 100%);
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    width: 100%;
    box-sizing: border-box;
}

.premium-card {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    background: radial-gradient(circle at top left, #101010 0%, #0E0E0E 100%);
}

.glow-green {
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.06);
}

.fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ai-vision-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between; 
    margin-bottom: 1.5rem;
}

.ai-vision-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
}

.ai-vision-subtitle {
    font-size: 0.875rem;
    color: #A1A1A1;
}

.balance-card-header {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 0.75rem;
}

.balance-header-content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.balance-info-header {
    display: flex;
    flex-direction: column;
}

.balance-label-header {
    font-size: 0.625rem;
    color: #7A7A7A;
    font-weight: 500;
}

.balance-value-row-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.125rem;
}

.balance-value-header {
    font-size: 1rem;
    font-weight: bold;
    color: #DFDFDF;
}

.account-type-btn-header {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    border: none;
}

.real-btn-header {
    background-color: #22C55E;
    color: #000;
}

.demo-btn-header {
    background-color: #333;
    color: #A1A1A1;
}

.eye-toggle-btn-header {
    background: none;
    border: none;
    color: #A1A1A1;
    cursor: pointer;
}

/* AI Vision Grid */
.ai-vision-grid {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 1.25rem;
}

/* AI Brain Container */
.ai-brain-container {
    height: 220px;
    overflow: hidden;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%);
    border: 1px solid rgba(34, 197, 94, 0.3);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ai-brain-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 50%, rgba(34, 197, 94, 0.1) 100%);
}

.animated-grid {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: gridMove 20s linear infinite;
    opacity: 0.2;
}

@keyframes gridMove {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 20px 20px;
    }
}

.ai-core-wrapper {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ring-outer {
    position: absolute;
    width: 10rem;
    height: 10rem;
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 50%;
    animation: rotate 8s linear infinite;
}

.ring-middle {
    position: absolute;
    width: 8rem;
    height: 8rem;
    border: 2px solid rgba(34, 197, 94, 0.4);
    border-radius: 50%;
    animation: rotate 6s linear infinite reverse;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.core-pulse {
    position: absolute;
    width: 6rem;
    height: 6rem;
    background: rgba(34, 197, 94, 0.2);
    border-radius: 50%;
    filter: blur(1.5rem);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.ai-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.brain-icon {
    position: relative;
    z-index: 20;
    font-size: 3rem;
    color: #22C55E;
    animation: brainPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
}

@keyframes brainPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.3;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.6;
    }
}

.ai-brain-glow {
    animation: brainPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
}

.ai-glow-ring {
    animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
    0%, 100% {
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1);
    }
    50% {
        box-shadow: 0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2);
    }
}

.orbit-node {
    position: absolute;
    background: #22C55E;
    border-radius: 50%;
}

.orbit-1 {
    width: 0.75rem;
    height: 0.75rem;
    animation: orbit1 4s linear infinite;
}

.orbit-2 {
    width: 0.5rem;
    height: 0.5rem;
    background: rgba(34, 197, 94, 0.7);
    animation: orbit2 5s linear infinite;
}

.orbit-3 {
    width: 0.625rem;
    height: 0.625rem;
    background: rgba(34, 197, 94, 0.8);
    animation: orbit3 6s linear infinite;
}

@keyframes orbit1 {
    0% {
        transform: rotate(0deg) translateX(5rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(5rem) rotate(-360deg);
    }
}

@keyframes orbit2 {
    0% {
        transform: rotate(0deg) translateX(4rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(4rem) rotate(-360deg);
    }
}

@keyframes orbit3 {
    0% {
        transform: rotate(0deg) translateX(3rem) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(3rem) rotate(-360deg);
    }
}

.particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.particle {
    position: absolute;
    background: #22C55E;
    border-radius: 50%;
}

.particle-1 {
    width: 0.25rem;
    height: 0.25rem;
    top: 20%;
    left: 15%;
    animation: float 3s ease-in-out infinite;
}

.particle-2 {
    width: 0.375rem;
    height: 0.375rem;
    background: rgba(34, 197, 94, 0.7);
    top: 60%;
    left: 80%;
    animation: float 4s ease-in-out infinite 0.5s;
}

.particle-3 {
    width: 0.25rem;
    height: 0.25rem;
    background: rgba(34, 197, 94, 0.6);
    top: 80%;
    left: 30%;
    animation: float 3.5s ease-in-out infinite 1s;
}

.particle-4 {
    width: 0.375rem;
    height: 0.375rem;
    top: 40%;
    left: 70%;
    animation: float 4.5s ease-in-out infinite 1.5s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.data-streams {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.3;
}

.stream {
    position: absolute;
    height: 1px;
    background: linear-gradient(to right, transparent, #22C55E, transparent);
}

.stream-1 {
    width: 5rem;
    top: 30%;
    left: -20px;
    animation: streamRight 2s linear infinite;
}

.stream-2 {
    width: 4rem;
    top: 50%;
    left: -20px;
    animation: streamRight 2.5s linear infinite 0.5s;
}

.stream-3 {
    width: 6rem;
    top: 70%;
    left: -20px;
    animation: streamRight 3s linear infinite 1s;
}

@keyframes streamRight {
    0% {
        left: -20px;
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        left: 100%;
        opacity: 0;
    }
}

/* AI Status Grid */
.ai-status-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.status-info-card {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1rem;
    transition: all 0.3s ease;
}

.status-info-card:hover {
    background: #111;
    transform: translateY(-1px);
}

.status-info-label {
    font-size: 0.625rem;
    color: #A1A1A1;
    margin-bottom: 0.5rem;
}

.status-info-value {
    font-size: 1rem;
    font-weight: bold;
    color: #A1A1A1;
    margin-bottom: 0.25rem;
}

.status-info-value.active {
    color: #22C55E;
}

.status-info-detail {
    font-size: 0.625rem;
    color: #7A7A7A;
}

/* Config Grid */
.config-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    box-sizing: border-box;
}

.config-card {
    background: radial-gradient(circle at top left, #101010 0%, #0E0E0E 100%);
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    width: 100%;
    box-sizing: border-box;
}

.card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card-title i {
    color: #A1A1A1;
    font-size: 0.75rem;
    cursor: pointer;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-size: 0.75rem;
    color: #A1A1A1;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.form-label i {
    font-size: 0.75rem;
    color: #A1A1A1;
    cursor: pointer;
}

.form-select,
.form-input {
    width: 100%;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
    color: #DFDFDF;
    outline: none;
    transition: border-color 0.2s;
    margin: 0;
}

.form-select:focus,
.form-input:focus {
    border-color: #22C55E;
}

.form-help {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
    text-align: left;

}

/* Mode Buttons */
.mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
}

.mode-btn {
    padding: 0.5rem 0.75rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #A1A1A1;
    cursor: pointer;
    transition: all 0.2s;
}

.mode-btn:hover {
    border-color: #22C55E;
}

.mode-btn.active {
    background-color: #22C55E;
    color: white;
    border-color: #22C55E;
}

/* Risk Buttons */
.risk-buttons {
        display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.risk-btn {
    padding: 0.5rem 0.75rem;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #A1A1A1;
    cursor: pointer;
    transition: all 0.2s;
}

.risk-btn:hover {
    border-color: #22C55E;
}

.risk-btn.active {
    background-color: #22C55E;
    color: white;
    border-color: #22C55E;
}

/* Risk Indicator */
.risk-indicator {
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.5rem;
    padding: 1rem;
}

.risk-header {
    display: flex;
    align-items: center;
        justify-content: space-between;
    margin-bottom: 0.5rem;
}

.risk-label {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.risk-level-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #22C55E;
}

.risk-bar-container {
    width: 100%;
    background-color: #0E0E0E;
    border-radius: 9999px;
    height: 0.5rem;
    margin-bottom: 0.75rem;
}

.risk-bar {
    background-color: #22C55E;
    height: 0.5rem;
    border-radius: 9999px;
    transition: width 0.3s ease;
}

.risk-description {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
}

/* AI Control Card */
.ai-control-card {
    position: relative;
    overflow: hidden;
    border: 2px solid rgba(34, 197, 94, 0.2);
    box-shadow: 0 0 24px rgba(34, 197, 94, 0.08), 0 4px 16px rgba(0, 0, 0, 0.3);
    background: radial-gradient(circle at top left, #0C0C0C 0%, #0A0A0A 100%);
}

.ai-control-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.ai-control-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 50%, transparent 100%);
}

.animated-grid-ai {
    position: absolute;
    inset: 0;
    background-image: 
        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: gridMove 20s linear infinite;
    opacity: 0.2;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%, rgba(34, 197, 94, 0.05) 100%);
}

.particles-ai {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.particle-ai {
    position: absolute;
    background: #22C55E;
    border-radius: 50%;
}

.particle-ai-1 {
    width: 0.25rem;
    height: 0.25rem;
    top: 20%;
    left: 15%;
    animation: float 3s ease-in-out infinite;
}

.particle-ai-2 {
    width: 0.375rem;
    height: 0.375rem;
    background: rgba(34, 197, 94, 0.7);
    top: 60%;
    right: 20%;
    animation: float 4s ease-in-out infinite 0.5s;
}

.particle-ai-3 {
    width: 0.25rem;
    height: 0.25rem;
    background: rgba(34, 197, 94, 0.6);
    bottom: 20%;
    left: 30%;
    animation: float 3.5s ease-in-out infinite 1s;
}

.particle-ai-4 {
    width: 0.375rem;
    height: 0.375rem;
    top: 40%;
    right: 30%;
    animation: float 4.5s ease-in-out infinite 1.5s;
}

.data-streams-ai {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.3;
    pointer-events: none;
}

.stream-ai {
    position: absolute;
    height: 1px;
    background: linear-gradient(to right, transparent, #22C55E, transparent);
}

.stream-ai-1 {
    width: 5rem;
    top: 30%;
    left: -20px;
    animation: streamRight 2s linear infinite;
}

.stream-ai-2 {
    width: 4rem;
    top: 50%;
    left: -20px;
    animation: streamRight 2.5s linear infinite 0.5s;
}

.stream-ai-3 {
    width: 6rem;
    top: 70%;
    left: -20px;
    animation: streamRight 3s linear infinite 1s;
}

.ai-control-content {
    position: relative;
    z-index: 10;
}

.ai-status-control {
    display: flex;
        align-items: center;
    justify-content: space-between;
    background-color: #0B0B0B;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
}

.ai-status-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 0.25rem;
}

.ai-status-subtitle {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.ai-status-toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.ai-status-text {
    font-size: 0.875rem;
    font-weight: bold;
    color: #A1A1A1;
}

.ai-status-text.active {
    color: #22C55E;
}

/* Toggle Switch */
.toggle-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: relative;
    width: 4rem;
    height: 2rem;
    background-color: #0B0B0B;
    border: 2px solid #1C1C1C;
    border-radius: 9999px;
    transition: 0.3s;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 1.5rem;
    height: 1.5rem;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
    background-color: #22C55E;
    border-color: #22C55E;
}

.toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(2rem);
}

.ai-status-note {
    text-align: center;
}

.ai-note-text {
    font-size: 0.75rem;
    color: #A1A1A1;
    opacity: 0.6;
    font-style: italic;
}

/* Chart Section */
.chart-section {
    margin-bottom: 1.5rem;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    box-sizing: border-box;
}

/* Ensure all cards and divs occupy 100% width */
.ai-vision-card,
.config-card,
.config-grid,
.chart-section,
#ai-vision-panel {
    width: 100%;
    box-sizing: border-box;
}

/* Footer */
.zenix-footer {
    background-color: #0B0B0B;
    border-top: 1px solid #1C1C1C;
    margin-top: 3rem;
    width: 100%;
}

.footer-content {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 3rem 20px;
    box-sizing: border-box;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
    margin-bottom: 2rem;
}

.footer-brand {
    grid-column: span 1;
}

.footer-logo {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.footer-logo-main {
    font-size: 1.125rem;
    font-weight: 600;
    color: #DFDFDF;
}

.footer-logo-sub {
    font-size: 0.75rem;
    color: #A1A1A1;
}

.footer-description {
    color: #A1A1A1;
    font-size: 0.75rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.6;
}

.footer-social {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.social-icon {
    color: #A1A1A1;
    transition: color 0.2s;
    opacity: 0.5;
}

.social-icon:hover {
    color: #DFDFDF;
}

.footer-column-title {
    color: #DFDFDF;
    font-weight: 500;
    font-size: 0.75rem;
    margin-bottom: 1rem;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.footer-links a {
    color: #A1A1A1;
    font-size: 0.75rem;
    text-decoration: none;
    transition: color 0.2s;
    opacity: 0.6;
}

.footer-links a:hover {
    color: #DFDFDF;
}

.footer-bottom {
    border-top: 1px solid #1A1A1A;
    padding-top: 2rem;
    opacity: 0.4;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

@media (min-width: 768px) {
    .footer-bottom {
        flex-direction: row;
    justify-content: space-between;
    align-items: center;
    }
}

.footer-copyright {
    color: #A1A1A1;
    font-size: 0.75rem;
}

.footer-legal {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 0.75rem;
}

.footer-legal a {
    color: #A1A1A1;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-legal a:hover {
    color: #DFDFDF;
}

.footer-separator {
    color: #1C1C1C;
}

/* Responsive */
@media (max-width: 1024px) {
    .main-content-wrapper {
        margin-left: 0;
        width: 100%;
    }
    
    .top-header {
        left: 0;
        width: 100%;
    }
    
    .main-content {
        padding: 1.5rem 20px;
    }
    
    .config-grid {
        grid-template-columns: 1fr;
    }
    
    .ai-vision-grid {
        grid-template-columns: 1fr;
    }
    
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .ai-vision-card,
    .config-grid,
    .chart-section {
        margin-left: 0;
        margin-right: 0;
        width: 100%;
    }
}

@media (max-width: 768px) {
    .header-content {
        padding: 1rem 15px;
        flex-direction: column;
        gap: 1rem;
    }
    
    .header-left-content {
        width: 100%;
    }
    
    .header-title {
        font-size: 1.25rem;
    }
    
    .header-subtitle {
        font-size: 0.8rem;
    }
    
    .main-content {
        margin-top: 80px;
        padding: 1rem 15px;
    }
    
    .footer-grid {
        grid-template-columns: 1fr;
    }
    
    .risk-buttons {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .ai-vision-card,
    .config-grid,
    .chart-section {
        margin-left: 0;
        margin-right: 0;
        width: 100%;
    }
}
</style>