<template>
	<div class="layout">
		<AppSidebar :is-open="isSidebarOpen" @close-sidebar="closeSidebar" />

		<button class="hamburger-menu" @click="toggleSidebar">
			<span class="line"></span>
			<span class="line"></span>
			<span class="line"></span>
		</button>
		
		<div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>
		
		<header class="top-header-fixed">
			<button class="back-btn" @click="$router.push('/dashboard')">
				<span>←</span> Voltar
			</button>
			<h1 class="header-title-fixed">Suporte</h1>
			<div class="header-placeholder"></div>
		</header>
		<main class="support-content">
			
			<div class="content-wrapper"> 
				
				<div class="central-header">
					
					<h2 class="title-main">Central de Suporte</h2>
					<div class="subtitle">Como podemos ajudar você hoje?</div>
				</div>
				
				<div class="search-section">
					<input 
						type="text" 
						class="search-input" 
						placeholder="Pesquisar nas FAQs..." 
						v-model="searchQuery"
						@input="onSearchInput"
					/>
					<button class="search-btn" @click="searchFaqs">
						<span class="search-icon"><img src="../assets/icons/search.svg" alt=""></span>
					</button>
				</div>

				<div v-if="loading" class="loading">Carregando...</div>
				<div v-else-if="error" class="error">{{ error }}</div>

				<div v-else class="faqs-section">
					<h2 class="faqs-title">Perguntas Frequentes</h2>
					<div class="faqs-list">
						<div 
							v-for="faq in faqs" 
							:key="faq.id" 
							class="faq-item"
							:class="{ expanded: expandedFaqs[faq.id] }"
						>
							<button class="faq-question" @click="toggleFaq(faq.id)">
								<span class="faq-text">{{ faq.question }}</span>
								<span class="faq-caret">▼</span>
							</button>
							<div v-if="expandedFaqs[faq.id]" class="faq-answer">
								{{ faq.answer }}
							</div>
						</div>
					</div>
				</div>

				<div class="support-cards">
					<div class="support-card chat-card">
						<img src="../assets/icons/Chat.svg" alt="Chat" width="30px">
						<h3 class="card-title"> Chat ao Vivo</h3>
						<div class="card-status">
							<span class="status-dot online"></span>
							<span>Nossa equipe está online</span>
						</div>
						<p class="card-description">
							Precisa de ajuda imediata? Fale com um de nossos especialistas agora.
						</p>
						<button class="card-button">Iniciar Chat</button>
					</div>

					<div class="support-card status-card">
						<div class="card-icon">
							<h3 class="card-title status-title"><img src="../assets/icons/help-green.svg" alt=""> Status do Sistema</h3>
						</div>
						<p class="card-description">
							Verifique a operacionalidade de nossos serviços em tempo real.
						</p>
						<div v-if="systemStatus" class="status-bar" :class="systemStatus.overall">
							<span class="status-icon">✓</span>
							<span class="status-text">{{ systemStatus.message }}</span>
						</div>
						<div v-else class="status-bar">
							<span class="status-text">Carregando...</span>
						</div>
					</div>
				</div>
			</div>
			</main>
	</div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'

export default {
	name: 'SupportView',
	components: { AppSidebar },
	data() {
		return {
			faqs: [],
			expandedFaqs: {},
			searchQuery: '',
			loading: true,
			error: null,
			systemStatus: null,
			searchTimeout: null,
			isSidebarOpen: false 
		}
	},
	mounted() {
		this.fetchFaqs()
		this.fetchSystemStatus()
	},
	methods: {
		toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen },
		closeSidebar() { this.isSidebarOpen = false },
		async fetchFaqs() {
			this.loading = true
			this.error = null
			try {
				const query = this.searchQuery ? `?search=${encodeURIComponent(this.searchQuery)}` : ''
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
				const res = await fetch(`${apiBaseUrl}/support/faqs${query}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})
				if (!res.ok) throw new Error('Erro ao buscar FAQs')
				const data = await res.json()
				this.faqs = data
				if (data.length > 0) {
					this.expandedFaqs[data[0].id] = true
				}
			} catch (err) {
				console.error('Erro ao buscar FAQs:', err)
				this.error = 'Não foi possível carregar as perguntas frequentes.'
			} finally {
				this.loading = false
			}
		},
		async fetchSystemStatus() {
			try {
				const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
				const res = await fetch(`${apiBaseUrl}/support/status`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json' }
				})
				if (res.ok) {
					this.systemStatus = await res.json()
				}
			} catch (err) {
				console.error('Erro ao buscar status:', err)
			}
		},
		toggleFaq(id) {
			this.expandedFaqs = {
				...this.expandedFaqs,
				[id]: !this.expandedFaqs[id]
			}
		},
		onSearchInput() {
			clearTimeout(this.searchTimeout)
			this.searchTimeout = setTimeout(() => {
				this.searchFaqs()
			}, 300)
		},
		searchFaqs() {
			this.fetchFaqs()
		}
	}
}
</script>

<style scoped src="../assets/css/views/supportView.css"></style>