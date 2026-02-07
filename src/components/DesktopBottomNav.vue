<template>
  <nav v-if="isMobile" class="desktop-bottom-nav">
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
      to="/Investments-IA" 
      class="nav-item"
      :class="{ active: isActive('/Investments-IA') }"
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

    <!-- Copy Trading - Bloqueado ou Admin -->
    <router-link 
      v-if="isAdmin"
      to="/copy-trading" 
      class="nav-item"
      :class="{ active: isActive('/copy-trading') }"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="13" height="13" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="3" y="3" width="13" height="13" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Copy</span>
    </router-link>

    <div 
      v-else
      class="nav-item disabled"
      @click="openDevModal"
      title="Funcionalidade em desenvolvimento"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="13" height="13" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="3" y="3" width="13" height="13" rx="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Copy</span>
      <i class="fa-solid fa-lock text-[#EF4444] text-[10px] absolute top-1 right-2"></i>
    </div>

    <!-- Agente Autônomo -->
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

    <!-- Sinais (Operação Manual) - Bloqueado ou Admin -->
    <router-link 
      v-if="isAdmin"
      to="/operation" 
      class="nav-item"
      :class="{ active: isActive('/operation') }"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="2 12 4 12 6 8 8 16 10 4 12 20 14 8 16 16 18 12 20 12 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Sinais</span>
    </router-link>

    <div 
      v-else
      class="nav-item disabled"
      @click="openDevModal"
      title="Funcionalidade em desenvolvimento"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="2 12 4 12 6 8 8 16 10 4 12 20 14 8 16 16 18 12 20 12 22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">Sinais</span>
      <i class="fa-solid fa-lock text-[#EF4444] text-[10px] absolute top-1 right-2"></i>
    </div>

    <!-- Modal de Funcionalidade em Desenvolvimento -->
    <div v-if="showDevModal" class="dev-modal-overlay" @click.self="showDevModal = false">
      <div class="dev-modal-content">
        <div class="dev-modal-header">
          <i class="fa-solid fa-screwdriver-wrench text-2xl text-[#22C55E] mb-4"></i>
          <h2 class="text-white text-lg font-semibold mb-2">Funcionalidade em desenvolvimento</h2>
        </div>
        <div class="dev-modal-body">
          <p class="text-[#A1A1A1] text-sm">Para seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade.</p>
          <p class="mt-2 text-xs text-[#A1A1A1] opacity-70">Logo quando terminarmos você será avisado!</p>
        </div>
        <button class="dev-modal-button" @click="showDevModal = false">Entendi</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'DesktopBottomNav',
  data() {
    return {
      showDevModal: false,
      isMobile: false
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  computed: {
    isAdmin() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        // Decodificar JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verificar se o usuário tem role de admin
        const role = payload.role || payload.roles || payload.userRole || payload.user_role;
        const isAdminFlag = payload.isAdmin || payload.is_admin;
        
        // Verificar se role contém 'admin' ou se isAdmin é true
        if (isAdminFlag === true || isAdminFlag === 'true') {
            return true;
        }
        
        if (role) {
            const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
            const result = roleStr.includes('admin') || roleStr === 'admin';
            return result;
        }
        
        return false;
      } catch (error) {
        console.error('[DesktopBottomNav] Erro ao verificar se usuário é admin:', error);
        return false;
      }
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/');
    },
    openDevModal() {
      this.showDevModal = true;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024;
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
  position: relative;
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

/* Modal Styles */
.dev-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
}

.dev-modal-content {
  background: #111;
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px;
  padding: 30px;
  max-width: 350px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: modalAppear 0.3s ease-out;
}

.dev-modal-button {
  margin-top: 20px;
  background: #22C55E;
  color: #000;
  border: none;
  padding: 10px 30px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.dev-modal-button:hover {
  background: #1eb054;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

