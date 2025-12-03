<template>
    <div class="zenix-layout">
        <div 
            class="sidebar-overlay" 
            :class="{ 'show': isMobileMenuOpen }"
            @click="isMobileMenuOpen = false"
        ></div>

        <button class="mobile-hamburger-btn" @click="toggleMobileMenu">
            <i class="fas fa-bars"></i>
        </button>

        <AppSidebar 
            class="app-sidebar"
            :class="{ 'mobile-open': isMobileMenuOpen }"
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @toggle-collapse="toggleSidebarCollapse" 
        />

        <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                :balance="accountBalance"
                :account-type="isDemo ? 'demo' : 'real'"
                :currency="accountCurrency"
                @account-type-changed="handleAccountTypeChange"
            />

            <main class="plans-content" style="margin-top: 60px;">
                
                <div class="video-card-wrapper">
					<div class="video-box">
						<div class="video-thumbnail" @click="playVideo">
							<div class="video-overlay"></div>
							<div class="play-button-wrapper">
								<div v-if="!isPlaying" class="play-button">
									<i class="fas fa-play"></i>
								</div>
								<div v-else class="video-player-placeholder">
									<p>Player de vídeo carregando...</p>
								</div>
							</div>
						</div>
					</div>
                    <div class="video-details">
                        <div class="video-title-row">
                            <h3 class="video-title">Marcos Explica os Planos Zenix</h3>
                        </div>
                        <p class="video-description">Assista e entenda qual plano se encaixa melhor no seu perfil de operações.</p>
                    </div>
                </div>

                <div v-if="loading" class="loading">Carregando planos...</div>
                <div v-else-if="error" class="error">{{ error }}</div>
                
                <div v-else class="plans-grid">
                    
                    <div class="plan-card starter-card">
                        <div class="plan-icon-box">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <h3 class="plan-title">Starter</h3>
                        <div class="plan-price-wrapper">
                            <span class="plan-price-value">Gratuito</span>
                        </div>
                        <ul class="plan-features-list">
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>IA Orion limitada</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>10 sinais/dia</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Suporte por e-mail</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-times feature-icon-cross"></i>
                                <span class="text-secondary">Sem Copy Trading</span>
                            </li>
                        </ul>
                        <button class="plan-btn btn-outline" @click="handlePlanAction({id: 'starter', price: 0, name: 'Starter'})">
                            Ativar plano básico
                        </button>
                    </div>

                    <div class="plan-card pro-card">
                        <div class="plan-badge-popular">
                            <span>MAIS POPULAR</span>
                        </div>
                        <div class="plan-icon-box icon-box-green">
                            <i class="fas fa-star"></i>
                        </div>
                        <h3 class="plan-title">Pro</h3>
                        <div class="plan-price-wrapper">
                            <span class="plan-price-value">R$ 67</span>
                            <span class="plan-price-period">/mês</span>
                        </div>
                        <ul class="plan-features-list">
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>IA Orion completa</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Copy Trading ilimitado</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Zenix Academy completa</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Suporte prioritário</span>
                            </li>
                        </ul>
                        <button class="plan-btn btn-green-soft disabled" disabled>
                            Plano atual
                        </button>
                    </div>

                    <div class="plan-card black-card">
                        <div class="plan-badge-recommended">
                            <span>RECOMENDADO</span>
                        </div>
                        <div class="plan-icon-box icon-box-gradient">
                            <i class="fas fa-crown"></i>
                        </div>
                        <h3 class="plan-title">Zenix Black</h3>
                        <div class="plan-price-wrapper">
                            <span class="plan-price-value">R$ 147</span>
                            <span class="plan-price-period">/mês</span>
                        </div>
                        <ul class="plan-features-list">
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>IA Orion Black Module</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Copy Trading ilimitado</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Zenix Academy completa</span>
                            </li>
                            <li class="feature-item">
                                <i class="fas fa-check feature-icon-check"></i>
                                <span>Suporte prioritário</span>
                            </li>
                        </ul>
                        <button class="plan-btn btn-green-soft disabled black-card-btn" disabled>
                            Plano atual
                        </button>
                    </div>
                </div>
            </main>
            
            <footer class="zenix-footer-mini">
                <div class="footer-content-right">
                    <p>Administrador: Marcos Costa / Online / Versão v2.0</p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'

export default {
    name: 'PlansView',
    components: { AppSidebar, TopNavbar },
    data() {
        return {
            plans: [],
            currentPlan: null,
            loading: false,
            error: null,
            activating: false,
            isPlaying: false,
            
            // Controle Sidebar Desktop
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            
            // Controle Menu Mobile
            isMobileMenuOpen: false,

            // Dados da Conta
            accountBalance: 0,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            balanceVisible: true,
            balanceUpdateInterval: null
        }
    },
    computed: {
        formattedBalance() {
            if (!this.accountBalance && this.accountBalance !== 0) return '0.00';
            return this.accountBalance.toFixed(2);
        }
    },
    mounted() {
        this.loadDependencies();
        this.fetchAccountBalance();
        this.startBalanceUpdates();
    },
    beforeUnmount() {
        this.stopBalanceUpdates();
    },
    methods: {
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        handleAccountTypeChange(newAccountType) {
            this.isDemo = newAccountType === 'demo';
            console.log('[PlansView] Tipo de conta alterado para:', this.isDemo ? 'demo' : 'real');
        },
        loadDependencies() {
            if (!document.getElementById('fa-script')) {
                const script = document.createElement('script');
                script.id = 'fa-script';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
                script.crossOrigin = 'anonymous';
                script.referrerPolicy = 'no-referrer';
                document.head.appendChild(script);
            }
        },
        playVideo() {
            this.isPlaying = true;
        },
        async handlePlanAction(plan) {
            // Placeholder para ação do botão
            if (this.$toast) {
                this.$toast.info(`Ação para o plano: ${plan.name}`);
            } else {
                alert(`Ação para o plano: ${plan.name}`);
            }
        },
        getDerivToken() {
            try {
                const defaultToken = localStorage.getItem('deriv_token');
                if (defaultToken) return defaultToken;

                const derivInfoStr = localStorage.getItem('deriv_info');
                if (derivInfoStr) {
                    const derivInfo = JSON.parse(derivInfoStr);
                    if (derivInfo.token) return derivInfo.token;
                    if (derivInfo.raw && derivInfo.raw.token) return derivInfo.raw.token;
                }

                const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
                if (tokensByLoginIdStr) {
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                    const firstToken = Object.values(tokensByLoginId)[0];
                    if (firstToken) return firstToken;
                }
                return null;
            } catch (error) {
                console.error('[PlansView] Erro ao obter token Deriv:', error);
                return null;
            }
        },
        async fetchAccountBalance() {
            try {
                const derivToken = this.getDerivToken();
                if (!derivToken) return;

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
                }
            } catch (error) {
                console.error('[PlansView] Erro ao buscar saldo da conta:', error);
            }
        },
        startBalanceUpdates() {
            if (this.balanceUpdateInterval) clearInterval(this.balanceUpdateInterval);
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
    }
}
</script>

<style scoped src="../assets/css/views/plansView.css"></style>