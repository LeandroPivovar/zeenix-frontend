<template>
	<div class="layout">
		<AppSidebar />
		<main class="plans-content">
			<div class="max-w-7xl mx-auto w-full">
				<div class="header-section">
					<div class="header-title-wrapper">
						<img src="../assets/icons/trophy.svg" alt="Crown" class="header-icon" v-if="false"> <!-- Usando font-awesome no design original, aqui adaptado -->
						<i class="fas fa-crown text-zenix-green text-2xl header-icon-fa"></i>
						<h1 class="main-title">Planos Zenix</h1>
					</div>
					<p class="main-subtitle">Escolha seu plano e evolua dentro do ecossistema Zenix.</p>
				</div>

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
						<div>
							<h3 class="video-title">Marcos Explica os Planos Zenix</h3>
							<p class="video-description">Assista e entenda qual plano se encaixa melhor no seu perfil de operações.</p>
						</div>
						<div class="video-duration-badge">
							<span>2 min</span>
						</div>
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
			isPlaying: false
		}
	},
	mounted() {
		// Carregamento de fonte e ícones necessários para este layout específico
		this.loadDependencies();
		// this.fetchPlans() // Comentado para garantir visual estático fiel primeiro
		// this.fetchCurrentPlan()
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
			alert(`Ação para o plano: ${plan.name}`);
		}
	}
}
</script>

<style scoped src="../assets/css/views/plansView.css"></style>
<style scoped>
/* Adicionando import da fonte Inter caso não esteja global */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>