<template>
	<div class="layout">
		<AppSidebar />
		<main class="plans-content">
			<div class="background-glow"></div>
			<div class="background-grid"></div>
			
			<!-- Header Section -->
			<div class="plans-header">
				<h1 class="main-title">
					<span class="crown-icon">👑</span>
					Planos Zenix
				</h1>
				<p class="header-subtitle">Escolha seu plano e evolua dentro do ecossistema Zenix.</p>
			</div>
			
			<div class="video-section">
				<div class="video-container">
					<div class="video-placeholder" @click="playVideo">
						<div v-if="!isPlaying" class="play-button">
							<span>▶</span>
						</div>
						<div v-else class="video-player">
							<p>Player de vídeo será integrado aqui</p>
						</div>
					</div>
				</div>
				<div class="video-info">
					<h2 class="video-title">Marcos Explica os Planos Zenix</h2>
					<div class="video-description-container">
						<p class="video-description">
							Assista e entenda qual plano se encaixa melhor no seu perfil de operações.
						</p>
						<span class="video-badge">2 min</span>
					</div>
				</div>
			</div>

			<div class="plans-section">

				<div v-if="loading" class="loading">Carregando planos...</div>
				<div v-else-if="error" class="error">{{ error }}</div>
				<div v-else class="plans-grid">
					<div 
						v-for="plan in plans" 
						:key="plan.id"
						class="plan-card"
						:class="{ popular: plan.isPopular, recommended: plan.isRecommended }"
					>
						<div v-if="plan.isPopular" class="plan-badge popular-badge">MAIS POPULAR</div>
						<div v-if="plan.isRecommended" class="plan-badge recommended-badge">RECOMENDADO</div>

						<!-- Ícones dos planos -->
						<div class="plan-icon">
							<span v-if="plan.slug === 'starter'" class="icon-rocket">🚀</span>
							<span v-else-if="plan.slug === 'pro'" class="icon-star">⭐</span>
							<span v-else-if="plan.slug === 'black'" class="icon-crown">👑</span>
						</div>

						<h3 class="plan-name">{{ getPlanDisplayName(plan) }}</h3>
						<div class="plan-price">
							<span v-if="plan.price === 0" class="price-free">Gratuito</span>
							<span v-else class="price-paid">
								<span class="currency">R$</span>
								<span class="amount">{{ plan.price }}</span>
								<span class="period">/mês</span>
							</span>
						</div>

						<ul class="plan-features">
							<li v-for="(value, key) in getPlanFeatures(plan)" :key="key" class="feature-item">
								<span 
									v-if="isFeatureEnabled(value)" 
									class="feature-icon check"
								>✓</span>
								<span 
									v-else-if="value === false" 
									class="feature-icon cross"
								>✗</span>
								
								<span class="feature-text">{{ key }}</span>
							</li>
						</ul>

						<button 
							class="plan-button"
							:class="{ 
								active: currentPlan?.id === plan.id,
								upgrade: plan.price > 0 && (!currentPlan || currentPlan.id !== plan.id)
							}"
							@click="handlePlanAction(plan)"
							:disabled="activating"
						>
							<span v-if="currentPlan?.id === plan.id">Plano atual</span>
							<span v-else-if="plan.price === 0">Ativar plano básico</span>
							<span v-else>Escolher plano</span>
						</button>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'

export default {
	name: 'PlansView',
	components: { AppSidebar },
	data() {
		return {
			plans: [],
			currentPlan: null,
			loading: true,
			error: null,
			activating: false,
			isPlaying: false
		}
	},
	mounted() {
		this.fetchPlans()
		this.fetchCurrentPlan()
	},
	methods: {
		async fetchPlans() {
			this.loading = true
			this.error = null
			try {
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
				const res = await fetch(`${apiBaseUrl}/plans`)
				
				if (!res.ok) {
					throw new Error('Erro ao buscar planos')
				}

				this.plans = await res.json()
			} catch (err) {
				console.error('Erro ao buscar planos:', err)
				this.error = 'Não foi possível carregar os planos.'
			} finally {
				this.loading = false
			}
		},
		async fetchCurrentPlan() {
			try {
				const token = localStorage.getItem('token')
				if (!token) return

				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
				const res = await fetch(`${apiBaseUrl}/plans/user/current`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				if (res.ok) {
					this.currentPlan = await res.json()
				}
			} catch (err) {
				console.warn('Erro ao buscar plano atual:', err)
			}
		},
		async handlePlanAction(plan) {
			if (this.currentPlan?.id === plan.id) {
				return // Já está ativo
			}

			if (plan.price === 0) {
				// Plano gratuito
				await this.activatePlan(plan.id)
			} else {
				// Plano pago - mostrar mensagem ou redirecionar para pagamento
				alert(`O plano ${plan.name} requer processamento de pagamento. Funcionalidade em desenvolvimento.`)
			}
		},
		async activatePlan(planId) {
			this.activating = true
			try {
				const token = localStorage.getItem('token')
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
				
				const res = await fetch(`${apiBaseUrl}/plans/activate`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ planId })
				})

				if (!res.ok) {
					const err = await res.json().catch(() => ({}))
					throw new Error(err.message || 'Erro ao ativar plano')
				}

				await this.fetchCurrentPlan()
				alert('Plano ativado com sucesso!')
			} catch (err) {
				alert(err.message || 'Erro ao ativar plano')
			} finally {
				this.activating = false
			}
		},
		
		getPlanDisplayName(plan) {
			if (plan.slug === 'starter') return 'Starter'
			if (plan.slug === 'pro') return 'Pro'
			if (plan.slug === 'black') return 'Zenix Black'
			return plan.name
		},
		
		getPlanFeatures(plan) {
			const features = {}
			if (plan.features?.orion_ai) {
				if (plan.features.orion_ai === 'limitada') {
					features['IA Orion limitada'] = true
				} else if (plan.features.orion_ai === 'completa') {
					features['IA Orion completa'] = true
				} else if (plan.features.orion_ai === 'black_module') {
					features['IA Orion Black Module'] = true
				}
			}
			if (plan.features?.signals_per_day !== undefined) {
				if (plan.features.signals_per_day === 10) {
					features['10 sinais/dia'] = true
				} else if (plan.features.signals_per_day === 'ilimitado') {
					// Não mostrar para Pro e Black, pois já tem Copy Trading ilimitado
				}
			}
			if (plan.features?.copy_trading !== undefined) {
				if (plan.features.copy_trading === false) {
					features['Sem Copy Trading'] = false
				} else if (plan.features.copy_trading === true || plan.features.copy_trading === 'premium') {
					features['Copy Trading ilimitado'] = true
				}
			}
			if (plan.features?.academy) {
				if (plan.features.academy === 'completa' || plan.features.academy === 'black_edition') {
					features['Zenix Academy completa'] = true
				}
			}
			if (plan.features?.support) {
				if (plan.features.support === 'email') {
					features['Suporte por e-mail'] = true
				} else if (plan.features.support === 'prioritario' || plan.features.support === '1on1') {
					features['Suporte prioritário'] = true
				}
			}
			return features
		},
		
		isFeatureEnabled(value) {
			return value !== false && value !== undefined && value !== null
		},

		playVideo() {
			this.isPlaying = true
		}
	}
}
</script>

<style scoped src="../assets/css/views/plansView.css"></style>
<style scoped>
.background-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
    radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
    radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
    rgba(9, 10, 12, 0.95);
  z-index: -2;
  pointer-events: none;
}

.background-grid {
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  z-index: -1;
  opacity: 0.6;
  pointer-events: none;
  animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
  0% {
    background-position: 0 0, 0 0;
  }
  100% {
    background-position: -48px -48px, -48px -48px;
  }
}
</style>