<template>
    <div class="zenix-layout">
        <div 
            class="sidebar-overlay" 
            :class="{ 'show': isMobileMenuOpen }"
            @click="isMobileMenuOpen = false"
        ></div>

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
                :balances-by-currency-real="balancesByCurrencyReal"
                :balances-by-currency-demo="balancesByCurrencyDemo"
                @account-type-changed="handleAccountTypeChange"
                @toggle-sidebar="toggleMobileMenu"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="toggleSettingsModal"
            />
            
            <!-- Settings Sidebar -->
            <SettingsSidebar
              :is-open="showSettingsModal"
              :balance="accountBalance"
              :account-type="isDemo ? 'demo' : 'real'"
              :balances-by-currency-real="balancesByCurrencyReal"
              :balances-by-currency-demo="balancesByCurrencyDemo"
              :currency-prefix="isDemo ? 'D' : '$'"
              @close="closeSettingsModal"
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
                            <i :class="['fas', getPlanIcon(plan.slug)]"></i>
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
                        
                        <!-- Benefícios do Plano -->
                        <ul class="plan-features-list">
                            <li 
                                v-for="(benefit, index) in getPlanBenefits(plan)" 
                                :key="`benefit-${index}`" 
                                class="feature-item"
                            >
                                <span>{{ benefit }}</span>
                            </li>
                            
                            <!-- Mensagem se não houver benefícios -->
                            <li v-if="getPlanBenefits(plan).length === 0" class="feature-item">
                                <span style="color: #666; font-style: italic;">Nenhum benefício configurado</span>
                            </li>
                        </ul>
                        
                        <!-- Botão de Ação -->
                        <button 
                            class="plan-btn" 
                            :class="[
                                plan.slug === 'starter' ? 'btn-outline' : '',
                                plan.slug === 'pro' ? 'btn-green-soft btn-pro-green' : '',
                                plan.slug === 'black' ? 'btn-green-soft' : ''
                            ]"
                            @click="handlePlanAction(plan)"
                        >
                            {{ plan.price === 0 ? 'Ativar plano básico' : 'Assinar plano' }}
                        </button>
                    </div>
                </div>
            </main>
        </div>
        <DesktopBottomNav />
    </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import { loadAccountBalance, reloadAccountBalance } from '../utils/balanceLoader'

export default {
    name: 'PlansView',
    components: { AppSidebar, TopNavbar, SettingsSidebar, DesktopBottomNav },
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
            isMobile: false,
            isMobileMenuOpen: false,
            
            // Controle Settings Modal
            showSettingsModal: false,

            // Dados da Conta
            accountBalance: 0,
            accountCurrency: 'USD',
            accountLoginid: null,
            isDemo: false,
            balanceVisible: true,
            balanceUpdateInterval: null,
            balancesByCurrencyReal: {},
            balancesByCurrencyDemo: {}
        }
    },
    computed: {
        formattedBalance() {
            if (!this.accountBalance && this.accountBalance !== 0) return '0.00';
            return this.accountBalance.toFixed(2);
        }
    },
    created() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    mounted() {
        this.loadDependencies();
        this.fetchPlansFromAPI();
        this.fetchAccountBalance();
        this.startBalanceUpdates();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        this.stopBalanceUpdates();
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 1024;
        },
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
        toggleSettingsModal() {
            this.showSettingsModal = !this.showSettingsModal;
        },
        closeSettingsModal() {
            this.showSettingsModal = false;
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
                
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
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
        getPlanIcon(slug) {
            if (slug === 'starter') return 'fa-rocket';
            if (slug === 'pro') return 'fa-star';
            if (slug === 'black') return 'fa-crown';
            return '';
        },
        getPlanBenefits(plan) {
            // Extrair array de benefícios do features
            if (!plan.features) {
                console.log(`📦 [GetBenefits] ${plan.name} → Sem features`);
                return [];
            }
            
            // Se features for string, fazer parse
            let features = plan.features;
            if (typeof features === 'string') {
                try {
                    features = JSON.parse(features);
                    console.log(`📦 [GetBenefits] ${plan.name} → Features parseado:`, features);
                } catch (e) {
                    console.error('[PlansView] Erro ao fazer parse de features:', e);
                    return [];
                }
            }
            
            // Verificar se tem array de benefits
            if (features.benefits && Array.isArray(features.benefits)) {
                const benefits = features.benefits.filter(b => b && b.trim());
                console.log(`✅ [GetBenefits] ${plan.name} → ${benefits.length} benefícios:`, benefits);
                return benefits;
            }
            
            console.log(`⚠️ [GetBenefits] ${plan.name} → features.benefits não é array ou está vazio`);
            console.log('   Features completo:', features);
            return [];
        },
        async handlePlanAction(plan) {
            // Placeholder para ação do botão
            if (this.$toast) {
                this.$toast.info(`Ação para o plano: ${plan.name}`);
            } else {
                await alert(`Ação para o plano: ${plan.name}`);
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
                const balanceData = await loadAccountBalance();
                if (balanceData) {
                    this.accountBalance = balanceData.balance;
                    this.accountCurrency = balanceData.currency;
                    this.accountLoginid = balanceData.loginid;
                    this.isDemo = balanceData.isDemo;
                    this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
                    this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
                }
            } catch (error) {
                console.error('[PlansView] Erro ao buscar saldo da conta:', error);
            }
        },
        startBalanceUpdates() {
            if (this.balanceUpdateInterval) clearInterval(this.balanceUpdateInterval);
            this.balanceUpdateInterval = setInterval(() => {
                reloadAccountBalance().then(balanceData => {
                    if (balanceData) {
                        this.accountBalance = balanceData.balance;
                        this.accountCurrency = balanceData.currency;
                        this.accountLoginid = balanceData.loginid;
                        this.isDemo = balanceData.isDemo;
                        this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
                        this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
                    }
                }).catch(error => {
                    console.error('[PlansView] Erro ao atualizar saldo:', error);
                });
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