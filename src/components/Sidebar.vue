<template>
  <aside class="sidebar">
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
        @click="$router.push('/dashboard')"
      >
        Dashboard
      </button>
      <button class="menu-item">IAs de Investimento</button>
      <button class="menu-item">Copy Trading</button>
      <button class="menu-item">Operação Manual</button>
      <button 
        class="menu-item" 
        :class="{ active: isAcademyActive }"
        @click="$router.push('/academy')"
      >
        Zenix Academy
      </button>
      <button class="menu-item">Relatórios</button>
      <button class="menu-item">Suporte</button>
      <button class="menu-item">Configurações</button>
    </nav>
    <div class="status">
      <div class="user" @click="toggleUserMenu">
        <div class="user-avatar">U</div>
        <div class="user-info">
          <div class="user-name">Usuário</div>
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
  data() {
    return { showUserMenu: false }
  },
  computed: {
    isDashboardActive() {
      return this.$route?.path === '/dashboard';
    },
    isAcademyActive() {
      return this.$route?.path?.startsWith('/academy') || false;
    }
  },
  methods: {
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


