<template>
  <aside class="sidebar" :class="{ 'is-open': isOpen }">
    <div class="brand">
      <div class="avatar">Z</div>
      <div class="brand-text">
        <div class="title">Zenix Black</div>
        <div class="subtitle">Futuristic Trading</div>
      </div>
    </div>
    <nav class="menu">
      <button
        class="menu-item"
        :class="{ active: isDashboardActive }"
        @click="navigateAndClose('/dashboard')"
      >
      <img src="../assets/icons/apps.svg" alt="" class="icon-sidebar">
        Dashboard
      </button>
      <button class="menu-item" @click="close">IAs de Investimento</button>
      <button class="menu-item" @click="close">
        <img src="../assets/icons/copy.svg" alt="" class="icon-sidebar">
        Copy Trading
      </button>
      <button class="menu-item" @click="close">
        <img src="../assets/icons/click.svg" alt="" class="icon-sidebar">
        Operação Manual
      </button>
      <button
        class="menu-item"
        :class="{ active: isAcademyActive }"
        @click="navigateAndClose('/academy')"
      >
        Zenix Academy
      </button>
      <button class="menu-item" @click="close">
        <img src="../assets/icons/analytics.svg" alt="" class="icon-sidebar">
        Relatórios
      </button>
      <button
        class="menu-item"
        :class="{ active: isSupportActive }"
        @click="navigateAndClose('/support')"
      >
      <img src="../assets/icons/help.svg" alt="" class="icon-sidebar">
        Suporte
      </button>
      <button
        class="menu-item"
        :class="{ active: isSettingsActive }"
        @click="navigateAndClose('/settings')"
      >
      <img src="../assets/icons/settings.svg" alt="" class="icon-sidebar">
        Configurações
      </button>
      <button
        class="menu-item"
        :class="{ active: isPlansActive }"
        @click="navigateAndClose('/plans')"
      >
        Planos
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
    }
  },
  data() {
    return { showUserMenu: false }
  },
  computed: {
    isDashboardActive() {
      return this.$route?.path === '/dashboard';
    },
    isAcademyActive() {
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
    }
  },
  methods: {
    close() {
      if (this.isOpen) {
        this.$emit('close-sidebar')
      }
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