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
                
                <div v-if="tutorialVideo" class="video-card-wrapper animate-fade-in-up">
					<div class="video-box">
						<div v-if="!isPlaying" class="video-thumbnail" @click="playVideo">
                            <!-- Overlay com gradiente premium -->
							<div class="video-overlay"></div>
                            
                            <!-- Thumbnail placeholder ou customizada se tiver -->
                            <div class="thumbnail-bg"></div>

							<div class="play-button-wrapper">
                                <div class="play-button-ring"></div>
								<div class="play-button">
									<i class="fas fa-play"></i>
								</div>
							</div>
						</div>
                        
						<div v-else class="video-player-container">
                             <!-- Verifica o tipo de conteúdo para renderizar corretamente -->
                             
                             <!-- 1. Vídeo Uploaded (URL direto do backend) -->
                             <video 
                                v-if="isVideoFile(tutorialVideo.videoUrl)" 
                                :src="getSafeUrl(tutorialVideo.videoUrl)" 
                                controls 
                                autoplay 
                                class="video-player-element"
                            ></video>

                             <!-- 2. YouTube Link -->
                             <iframe 
                                v-else-if="isYoutube(tutorialVideo.contentLink) || isYoutube(tutorialVideo.videoUrl)"
                                :src="getYoutubeEmbed(tutorialVideo.contentLink || tutorialVideo.videoUrl)" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                class="video-player-element"
                            ></iframe>

                            <!-- 3. Vimeo Link -->
                            <iframe 
                                v-else-if="isVimeo(tutorialVideo.contentLink) || isVimeo(tutorialVideo.videoUrl)"
                                :src="getVimeoEmbed(tutorialVideo.contentLink || tutorialVideo.videoUrl)" 
                                frameborder="0" 
                                allow="autoplay; fullscreen; picture-in-picture" 
                                allowfullscreen
                                class="video-player-element"
                            ></iframe>

                            <!-- 4. Fallback (Link genérico ou erro) -->
                            <div v-else class="video-fallback">
                                <p>Não foi possível carregar o player diretamente.</p>
                                <a :href="tutorialVideo.contentLink || tutorialVideo.videoUrl" target="_blank" class="btn-open-link">
                                    Abrir vídeo externa <i class="fas fa-external-link-alt"></i>
                                </a>
                            </div>
						</div>
					</div>
                    <div class="video-details">
                        <div class="video-title-row">
                             <div class="video-badge">
                                <i class="fas fa-star"></i> Destaque
                            </div>
                            <h3 class="video-title">{{ tutorialVideo.title || 'Marcos Explica os Planos Zenix' }}</h3>
                        </div>
                        <p class="video-description">
                            {{ tutorialVideo.description || 'Assista e entenda qual plano se encaixa melhor no seu perfil de operações.' }}
                        </p>
                    </div>
                </div>

                <!-- Fallback estático caso não tenha vídeo cadastrado (Opcional, ou pode remover se quiser que suma) -->
                <div v-else class="video-card-wrapper">
					<div class="video-box">
						<div class="video-thumbnail no-video">
                            <i class="fas fa-film fa-3x" style="opacity: 0.3;"></i>
                            <p style="margin-top: 10px; opacity: 0.5;">Vídeo explicativo indisponível no momento</p>
						</div>
					</div>
                    <div class="video-details">
                        <div class="video-title-row">
                            <h3 class="video-title">Conheça os Planos Zenix</h3>
                        </div>
                        <p class="video-description">Escolha o plano ideal para alavancar suas operações.</p>
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
                            plan.slug === 'black' ? 'black-card' : '',
                            isCurrentPlan(plan) ? 'current-plan-card' : ''
                        ]"
                    >
                        <!-- Badge Plano Atual -->
                        <div v-if="isCurrentPlan(plan)" class="plan-badge-current">
                            <span>SEU PLANO ATUAL</span>
                        </div>
                        
                        <!-- Badge Popular -->
                        <div v-else-if="plan.isPopular" class="plan-badge-popular">
                            <span>MAIS POPULAR</span>
                        </div>
                        
                        <!-- Badge Recomendado -->
                        <div v-else-if="plan.isRecommended" class="plan-badge-recommended">
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
                                <div class="feature-check">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <span class="feature-text">{{ benefit }}</span>
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
            balancesByCurrencyDemo: {},

            // Tutorial Video
            tutorialVideo: null
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
        this.loadUserPlan();
    },
    mounted() {
        this.loadDependencies();
        this.fetchPlansFromAPI();
        this.fetchAccountBalance();
        this.startBalanceUpdates();
        this.fetchTutorialVideo();
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
            // Prioridade para a nova coluna dedicada 'benefits'
            if (plan.benefits && Array.isArray(plan.benefits) && plan.benefits.length > 0) {
                const benefits = plan.benefits.filter(b => b && b.trim());
                if (benefits.length > 0) return benefits;
            }

            // Fallback para a lógica antiga baseada em features.benefits
            if (!plan.features) return [];
            
            let features = plan.features;
            if (typeof features === 'string') {
                try {
                    features = JSON.parse(features);
                } catch (e) {
                    return [];
                }
            }
            
            if (features.benefits && Array.isArray(features.benefits)) {
                return features.benefits.filter(b => b && b.trim());
            }
            
            return [];
        },
        loadUserPlan() {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    this.currentPlan = user.planId || null;
                    console.log('[PlansView] Plano atual do usuário:', this.currentPlan);
                }
            } catch (error) {
                console.error('[PlansView] Erro ao carregar plano do usuário:', error);
            }
        },
        isCurrentPlan(plan) {
            return this.currentPlan && plan.id === this.currentPlan;
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
        },

        // --- Video Tutorial Logic ---
        async fetchTutorialVideo() {
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                // Buscar tipo 3 = Video de Planos
                const response = await fetch(`${apiBase}/courses/deriv-tutorial-video?type=3`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        this.tutorialVideo = data;
                        console.log('✅ [PlansView] Vídeo de tutorial carregado:', data);
                    }
                }
            } catch (error) {
                console.error('[PlansView] Erro ao carregar vídeo tutorial:', error);
            }
        },
        getSafeUrl(path) {
            if (!path) return '';
            if (path.startsWith('http')) return path;
            const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
            // Se for caminho relativo /uploads...
            const cleanPath = path.startsWith('/') ? path : `/${path}`;
            // Remover /api do base se já tiver (hack simples, ideal é ter uma base URL para assets separada)
            const baseUrl = apiBase.replace('/api', '');
            return `${baseUrl}${cleanPath}`;
        },
        isVideoFile(url) {
            return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.indexOf('/uploads/') > -1);
        },
        isYoutube(url) {
            return url && (url.includes('youtube.com') || url.includes('youtu.be'));
        },
        isVimeo(url) {
            return url && url.includes('vimeo.com');
        },
        getYoutubeEmbed(url) {
            if (!url) return '';
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
        },
        getVimeoEmbed(url) {
             if (!url) return '';
             // Logica simples para extrair ID vimeo
             const regExp = /vimeo.*\/(\d+)/i;
             const match = url.match(regExp);
             const id = match ? match[1] : null;
             return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : url;
        }
    }
}
</script>

<style scoped src="../assets/css/views/plansView.css"></style>

<style scoped>
/* Estilos Adicionais para Player Dinâmico (Sobrescreve ou complementar ao css importado) */

.video-player-container {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 12px;
    overflow: hidden;
}

.video-player-element {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.video-thumbnail {
    cursor: pointer;
    position: relative;
}

.thumbnail-bg {
    position: absolute;
    inset: 0;
    /* Imagem de fundo padrão ou gradiente premium */
    background: radial-gradient(circle at center, #1b3a2a 0%, #0a0f0c 100%);
    z-index: 1;
}

.video-overlay {
    z-index: 2;
    background: rgba(0,0,0,0.3);
}

.play-button-wrapper {
    z-index: 3;
}

.play-button-ring {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(34, 197, 94, 0.5);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.video-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(34, 197, 94, 0.2);
    border: 1px solid rgba(34, 197, 94, 0.4);
    color: #22c55e;
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 12px;
    margin-right: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Animate fade in */
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>