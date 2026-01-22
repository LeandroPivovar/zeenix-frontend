<template>
  <nav class="desktop-bottom-nav">
    <router-link 
      to="/dashboard" 
      class="nav-item"
      :class="{ active: isActive('/dashboard') }"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="10" y="14" width="4" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Início</span>
    </router-link>

    <router-link 
      to="/InvestmentIA" 
      class="nav-item"
      :class="{ active: isActive('/InvestmentIA') }"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="8" y="8" width="8" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="4" y1="12" x2="2" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="4" x2="12" y2="2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="nav-label">IA's</span>
    </router-link>

    <div 
      class="nav-item disabled"
      :title="'Funcionalidade em desenvolvimento.\n\nPara seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade, logo quando terminarmos você será avisado.'"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="13" height="13" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="3" y="3" width="13" height="13" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Copy</span>
    </div>

    <router-link 
      to="/agente-autonomo" 
      class="nav-item"
      :class="{ active: isActive('/agente-autonomo') }"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="13" width="10" height="8" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="10" cy="17" r="1" fill="currentColor"/>
        <circle cx="14" cy="17" r="1" fill="currentColor"/>
        <circle cx="12" cy="7" r="2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="4.5" x2="12" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="9.5" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="4.5" r="0.5" fill="currentColor"/>
      </svg>
      <span class="nav-label">Agente</span>
    </router-link>

    <router-link 
      to="/operation" 
      class="nav-item"
      :class="{ active: isActive('/operation') }"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="2 12 4 12 6 8 8 16 10 4 12 20 14 8 16 16 18 12 20 12 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Sinais</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'DesktopBottomNav',
  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/');
    }
  }
}
</script>

<style scoped>
.desktop-bottom-nav {
  display: flex; /* Mostrar no mobile por padrão */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0B0B0B;
  border-top: 1px solid #1C1C1C;
  padding: 12px 20px;
  z-index: 1000;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

@media (min-width: 1025px) {
  .desktop-bottom-nav {
    display: none; /* Oculto no desktop */
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #8D8D8D;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-item.disabled:hover {
  background: transparent;
  color: #8D8D8D;
}

.nav-item:hover {
  color: #DFDFDF;
  background: rgba(34, 197, 94, 0.05);
}

.nav-item.active {
  color: #22C55E;
}

.nav-item.active .nav-icon {
  color: #22C55E;
}

.nav-icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  fill: none;
  transition: all 0.3s ease;
}

.nav-label {
  font-size: 12px;
  font-weight: 400;
  color: inherit;
  transition: color 0.3s ease;
}

.nav-item.active .nav-label {
  color: #22C55E;
  font-weight: 500;
}
</style>

