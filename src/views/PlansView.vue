<template>
	<div class="zenix-layout">
		<AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

		<div class="main-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<header class="top-header">
				<div class="header-content">
					<div class="header-left-content">
						<h1 class="header-title">Planos Zenix</h1>
						<p class="header-subtitle">Escolha seu plano e evolua dentro do ecossistema Zenix.</p>
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

			<main class="plans-content">
				<div class="max-w-7xl mx-auto w-full" style="width: 100%; max-width: 100%;">

				<div class="video-card-wrapper">
					<div class="video-thumbnail" @click="playVideo">
						<div class="video-overlay"></div>
						<div class="play-button-wrapper">
							<div v-if="!isPlaying" class="play-button">
								<i class="fas fa-play"></i>
							</div>
							<div v-else class="video-player-placeholder">
								<!-- Aqui iria o player real -->
								<p>Player de vídeo carregando...</p>
							</div>
						</div>
					</div>
					<div class="video-details">
						<div class="video-title-row">
							<h3 class="video-title">Marcos Explica os Planos Zenix</h3>
							<div class="video-duration-badge">
								<span>2 min</span>
							</div>
						</div>
						<p class="video-description">Assista e entenda qual plano se encaixa melhor no seu perfil de operações.</p>
					</div>
				</div>

				<div v-if="loading" class="loading">Carregando planos...</div>
				<div v-else-if="error" class="error">{{ error }}</div>
				
				<div v-else class="plans-grid">
					<!-- Card Starter -->
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

					<!-- Card Pro -->
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

					<!-- Card Black -->
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
						<button class="plan-btn btn-green-soft disabled" disabled>
							Plano atual
						</button>
					</div>
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

export default {
	name: 'PlansView',
	components: { AppSidebar },
	data() {
		return {
			plans: [], // Mantido para compatibilidade, mas layout está hardcoded por enquanto conforme pedido visual
			currentPlan: null,
			loading: false, // Forçando false para mostrar o layout estático
			error: null,
			activating: false,
			isPlaying: false,
			isSidebarOpen: true,
			isSidebarCollapsed: false,
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
		// Carregamento de fonte e ícones necessários para este layout específico
		this.loadDependencies();
		// this.fetchPlans() // Comentado para garantir visual estático fiel primeiro
		// this.fetchCurrentPlan()
		this.fetchAccountBalance();
		this.startBalanceUpdates();
	},
	beforeUnmount() {
		this.stopBalanceUpdates();
	},
	methods: {
		loadDependencies() {
			// FontAwesome já deve estar no projeto, mas garantindo
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
			// Lógica simplificada para o botão do starter
			this.$root.$toast.info(`Ação para o plano: ${plan.name}`);
		},
		toggleSidebarCollapse() {
			this.isSidebarCollapsed = !this.isSidebarCollapsed;
		},
		getDerivToken() {
			try {
				const derivInfoStr = localStorage.getItem('deriv_info');
				if (derivInfoStr) {
					const derivInfo = JSON.parse(derivInfoStr);
					// Tenta obter token real primeiro
					if (derivInfo.token) {
						return derivInfo.token;
					}
					// Tenta obter do raw
					if (derivInfo.raw && derivInfo.raw.token) {
						return derivInfo.raw.token;
					}
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
				if (!derivToken) {
					console.warn('[PlansView] ❌ Token não disponível para buscar saldo');
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
					
					console.log('[PlansView] ✅ Saldo atualizado:', {
						balance: this.accountBalance,
						currency: this.accountCurrency,
						loginid: this.accountLoginid,
						isDemo: this.isDemo
					});
				} else {
					console.error('[PlansView] ❌ Erro ao buscar saldo:', result.message || 'Unknown error');
				}
			} catch (error) {
				console.error('[PlansView] ❌ Erro ao buscar saldo da conta:', error);
			}
		},
		startBalanceUpdates() {
			// Atualiza o saldo a cada 30 segundos
			if (this.balanceUpdateInterval) {
				clearInterval(this.balanceUpdateInterval);
			}
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
		toggleBalanceVisibility() {
			this.balanceVisible = !this.balanceVisible;
		}
	}
}
</script>

<style scoped src="../assets/css/views/plansView.css"></style>
<style scoped>
/* Adicionando import da fonte Inter caso não esteja global */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>