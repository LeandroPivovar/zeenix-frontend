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

                <div v-if="loading" class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Carregando planos...
                </div>
                <div v-else-if="error" class="error">
                    <i class="fas fa-exclamation-triangle"></i> {{ error }}
                </div>
                
                <div v-else class="plans-grid">
                    <div 
                        v-for="plan in plans" 
                        :key="plan.id"
                        class="plan-card"
                        :class="[
                            plan.slug === 'starter' ? 'starter-card' : '',
                            plan.slug === 'pro' ? 'pro-card' : '',
                            plan.slug === 'black' ? 'black-card' : ''
                        ]"
                    >
                        <!-- Badge Popular -->
                        <div v-if="plan.isPopular" class="plan-badge-popular">
                            <span>MAIS POPULAR</span>
                        </div>
                        
                        <!-- Badge Recomendado -->
                        <div v-if="plan.isRecommended" class="plan-badge-recommended">
                            <span>RECOMENDADO</span>
                        </div>
                        
                        <!-- Ícone do Plano -->
                        <div class="plan-icon-box" :class="{
                            'icon-box-green': plan.slug === 'pro',
                            'icon-box-gradient': plan.slug === 'black'
                        }">
                            <i :class="[
                                'fas',
                                plan.slug === 'starter' ? 'fa-rocket' : '',
                                plan.slug === 'pro' ? 'fa-star' : '',
                                plan.slug === 'black' ? 'fa-crown' : 'fa-gem'
                            ]"></i>
                        </div>
                        
                        <!-- Título -->
                        <h3 class="plan-title">{{ plan.name }}</h3>
                        
                        <!-- Preço -->
                        <div class="plan-price-wrapper">
                            <span class="plan-price-value">
                                {{ plan.price === 0 ? 'Gratuito' : `R$ ${plan.price.toFixed(0)}` }}
                            </span>
                            <span v-if="plan.price > 0" class="plan-price-period">
                                /{{ plan.billingPeriod === 'month' ? 'mês' : plan.billingPeriod }}
                            </span>
                        </div>
                        
                        <!-- Features -->
                        <ul class="plan-features-list" v-if="plan.features && typeof plan.features === 'object'">
                            <li v-for="(value, key) in plan.features" :key="key" class="feature-item">
                                <i :class="[
                                    'fas',
                                    value === false || value === 'false' || value === 'limitada' 
                                        ? 'fa-times feature-icon-cross' 
                                        : 'fa-check feature-icon-check'
                                ]"></i>
                                <span :class="{ 'text-secondary': value === false || value === 'false' }">
                                    {{ formatFeature(key, value) }}
                                </span>
                            </li>
                        </ul>
                        
                        <!-- Botão de Ação -->
                        <button 
                            class="plan-btn" 
                            :class="[
                                plan.slug === 'starter' ? 'btn-outline' : '',
                                plan.slug === 'pro' || plan.slug === 'black' ? 'btn-green-soft' : ''
                            ]"
                            @click="handlePlanAction(plan)"
                        >
                            {{ plan.price === 0 ? 'Ativar plano básico' : 'Assinar plano' }}
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
        this.fetchPlansFromAPI();
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
        async fetchPlansFromAPI() {
            try {
                this.loading = true;
                this.error = null;
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/plans`);
                
                if (!response.ok) {
                    throw new Error('Erro ao carregar planos');
                }
                
                const plans = await response.json();
                
                // Filtrar apenas planos ativos e ordenar
                this.plans = plans
                    .filter(plan => plan.isActive)
                    .sort((a, b) => a.displayOrder - b.displayOrder);
                
                console.log('✅ [PlansView] Planos carregados:', this.plans);
            } catch (error) {
                console.error('❌ [PlansView] Erro ao carregar planos:', error);
                this.error = 'Não foi possível carregar os planos. Tente novamente.';
                // Fallback para planos padrão em caso de erro
                this.plans = [];
            } finally {
                this.loading = false;
            }
        },
        formatFeature(key, value) {
            // Mapa de tradução de features
            const featureNames = {
                'orion_ai': 'IA Orion',
                'signals_per_day': 'Sinais por dia',
                'copy_trading': 'Copy Trading',
                'academy': 'Zenix Academy',
                'support': 'Suporte',
                'dashboards': 'Dashboards personalizados'
            };
            
            const featureName = featureNames[key] || key;
            
            // Se valor é false, retornar "Sem [feature]"
            if (value === false || value === 'false') {
                return `Sem ${featureName}`;
            }
            
            // Se valor é string, usar como sufixo
            if (typeof value === 'string') {
                const translations = {
                    'limitada': 'limitada',
                    'completa': 'completa',
                    'black_module': 'Black Module',
                    'black_edition': 'Black Edition',
                    'email': 'por e-mail',
                    'prioritario': 'prioritário',
                    '1on1': '1 on 1',
                    'premium': 'Premium',
                    'ilimitado': 'ilimitado'
                };
                return `${featureName} ${translations[value] || value}`;
            }
            
            // Se valor é número
            if (typeof value === 'number') {
                return `${featureName}: ${value}`;
            }
            
            // Padrão
            return value === true ? featureName : `${featureName}: ${value}`;
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