<template>
	<aside class="sidebar" :class="{ 'is-open': isOpen, 'collapsed': isCollapsed }">
		<div class="brand">
			<div class="avatar">Z</div>
			<div class="brand-text">
				<div class="title">Zenix Black</div>
				<div class="subtitle">Futuristic Trading</div>
			</div>
			<button class="toggle-sidebar-btn" @click="toggleCollapse" :title="isCollapsed ? 'Expandir sidebar' : 'Ocultar sidebar'">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :transform="isCollapsed ? 'rotate(180 8 8)' : ''"/>
				</svg>
			</button>
		</div>
		<nav class="menu">
			<button
				class="menu-item"
				:class="{ active: isDashboardActive }"
				@click="navigateAndClose('/dashboard')"
				data-text="Dashboard"
			>
				<img src="../assets/icons/apps.svg" alt="" class="icon-sidebar">
				Dashboard
			</button>
			<button class="menu-item" @click="close" data-text="IAs de Investimento">
				<img src="../assets/icons/core.svg" alt="" class="icon-sidebar">
				IAs de Investimento</button>
			<button 
				class="menu-item" 
				:class="{ active: isCopyTradingActive }"
				@click="navigateAndClose('/copy-trading')"
				data-text="Copy Trading"
			>
				<img src="../assets/icons/copy.svg" alt="" class="icon-sidebar">
				Copy Trading
			</button>
			<button 
				class="menu-item" 
				:class="{ active: isOperationActive }"
				@click="navigateAndClose('/operation')"
				data-text="Operação Manual"
			>
				<img src="../assets/icons/click.svg" alt="" class="icon-sidebar">
				Operação Manual
			</button>
			<button
				class="menu-item"
				:class="{ active: isAcademyActive }"
				@click="navigateAndClose('/academy')"
				data-text="Zenix Academy"
			>
				<img src="../assets/icons/academy.svg" alt="" class="icon-sidebar">
				Zenix Academy
			</button>
			<button class="menu-item" @click="close" data-text="Relatórios">
				<img src="../assets/icons/analytics.svg" alt="" class="icon-sidebar">
				Relatórios
			</button>
			<button
				class="menu-item"
				:class="{ active: isSupportActive }"
				@click="navigateAndClose('/support')"
				data-text="Suporte"
			>
				<img src="../assets/icons/help.svg" alt="" class="icon-sidebar">
				Suporte
			</button>
			<button
				class="menu-item"
				:class="{ active: isSettingsActive }"
				@click="navigateAndClose('/settings')"
				data-text="Configurações"
			>
				<img src="../assets/icons/settings.svg" alt="" class="icon-sidebar">
				Configurações
			</button>
			<button
				class="menu-item"
				:class="{ active: isPlansActive }"
				@click="navigateAndClose('/plans')"
				data-text="Planos"
			>
				Planos
			</button>

			<button
				class="menu-item"
				:class="{ active: isAdminActive }"
				@click="navigateAndClose('/markup')"
				data-text="Markup"
			>
				Markup
			</button>

			<button
				class="menu-item"
				:class="{ active: isAdminActive }"
				@click="navigateAndClose('/StatsIAs')"
				data-text="StatsIAs"
			>
				Estatisticas das IAs
			</button>

		<button
			class="menu-item"
			:class="{ active: isAdminActive }"
			@click="navigateAndClose('/Experts')"
			data-text="Experts"
		>
			Experts
		</button>
		</nav>
		<div class="status">
			<div class="user" @click="toggleUserMenu">
				<div class="user-avatar">U</div>
				<div class="user-info">
					<div class="user-name">Usuario</div>
					<div class="user-badge">Conta Ativa</div>
				</div>
			</div>
			<div v-if="showUserMenu" class="user-menu">
				<button class="user-menu-item" @click.stop="goProfile">Ver perfil</button>
				<button class="user-menu-item danger" @click.stop="logout">Sair</button>
			</div>
			<div class="footer-row">
				<span class="online"></span>
				<span class="online-text">Online</span>
				<span class="version">v2.0</span>
			</div>
		</div>
	</aside>
</template>

<script>
export default {
	name: 'AppSidebar',
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		isCollapsed: {
			type: Boolean,
			default: false
		}
	},
	emits: ['close-sidebar', 'toggle-collapse'],
	data() {
		return { showUserMenu: false }
	},
	computed: {
		isDashboardActive() {
			return this.$route?.path === '/dashboard';
		},
		isAcademyActive() {
			// Usa startsWith para cobrir /academy e /academy/course/:id
			return this.$route?.path?.startsWith('/academy') || false;
		},
		isSupportActive() {
			return this.$route?.path === '/support';
		},
		isSettingsActive() {
			return this.$route?.path === '/settings';
		},
		isPlansActive() {
			return this.$route?.path === '/plans';
		},
	// Corrigido para verificar a rota /operation
	isOperationActive() {
		// Se /operation não tiver sub-rotas, use ===
		return this.$route?.path === '/operation';
		// Se /operation tiver sub-rotas (ex: /operation/details), use:
		// return this.$route?.path?.startsWith('/operation'); 
	},
	isCopyTradingActive() {
		return this.$route?.path === '/copy-trading';
	},
	isAdminActive() {
		// Verifica se está em qualquer rota admin
		return this.$route?.path === '/markup' || 
			this.$route?.path === '/StatsIAs' || 
			this.$route?.path === '/Experts';
	}
},
	methods: {
		close() {
			if (this.isOpen) {
				this.$emit('close-sidebar')
			}
		},
		toggleCollapse() {
			this.$emit('toggle-collapse')
		},
		navigateAndClose(route) {
			this.$router.push(route)
			this.close()
		},
		toggleUserMenu() { this.showUserMenu = !this.showUserMenu },
		logout() {
			localStorage.removeItem('token');
			localStorage.removeItem('deriv_connection');
			this.$router.push('/login');
		},
		goProfile() { this.$router.push('/profile'); }
	}
}
</script>

<style scoped src="../assets/css/components/sidebar.css"></style>
