<template>
  <div class="layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />
    <header>
      <button class="hamburger-menu" @click="handleHamburgerClick">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </button>
      <h1 class="title">Zenix</h1>
      <button class="notify-btn">
        <img src="../assets/icons/notify.svg" alt="" width="20px">
      </button>
      <div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>
    </header>

    <main class="content" v-if="!connectedInfo && !loading">
      <div class="background-glow"></div>
      <div class="background-grid"></div>
      <div class="container">
        <h1 class="title">Bem-vindo ao <strong>Zenix Black</strong></h1>
        <p class="subtitle">Antes de começar a operar, você precisa conectar sua conta Deriv ou criar uma nova.</p>
        <div class="box">
          <div class="video-card">
            <div class="video-placeholder">
              <div class="play">▶</div>
              <div class="video-text">Zenix Black Tutorial Video</div>
            </div>
          </div>
          <h1 class="text-mobile">Zenix Black Tutorial Video</h1>
          <p class="text-video">Assista o video e entenda como conectar sua conta Deriv em menos de 2 minutos.</p>
        </div>

        <div class="actions">
          <button class="primary" @click="startBrokerConnection">
            <img src="../assets/icons/Link.svg" alt="Conectar à Corretora" > 
            Conectar à Corretora
          </button>
          <a
            class="link-button"
            href="https://home.deriv.com/dashboard/signup"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../assets/icons/add.svg" alt="Criar Conta na Deriv" >
            Criar Conta na Deriv
          </a>
        </div>

        <div class="note">Essa tela aparece apenas no primeiro acesso ou se sua conta Deriv estiver desconectada.</div>
      </div>
    </main>

    <main class="content loading-content" v-else-if="loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">Verificando status da conexão...</p>
    </main>

    <DashboardConnected v-else :info="connectedInfo" />
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
import DashboardConnected from './DashboardConnected.vue'

export default {
  name: 'HomeView',
  components: { AppSidebar, DashboardConnected },
  data() {
    return { 
      connectedInfo: null,
      loading: true,
      isSidebarOpen: false,
      isSidebarCollapsed: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    closeSidebar() {
      this.isSidebarOpen = false
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    handleHamburgerClick() {
      if (this.isSidebarCollapsed) {
        // Se estiver colapsada, expandir
        this.isSidebarCollapsed = false
      } else {
        // Se não estiver colapsada, abrir no modo mobile
        this.toggleSidebar()
      }
    },

    async startBrokerConnection() {
      try {
        const state = this.generateState()
        localStorage.setItem('deriv_oauth_state', state)
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${apiBase}/broker/deriv/oauth/url?state=${state}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.message || 'Não foi possível iniciar o OAuth')
        }
        const data = await res.json()
        if (!data?.url) {
          throw new Error('URL de OAuth não recebida')
        }
        window.location.href = data.url
      } catch (error) {
        console.error('[HomeView] Erro ao iniciar conexão:', error)
        alert(error?.message || 'Falha ao iniciar OAuth. Tente novamente.')
        localStorage.removeItem('deriv_oauth_state')
      }
    },
    generateState() {
      if (window.crypto?.getRandomValues) {
        const array = new Uint32Array(4)
        window.crypto.getRandomValues(array)
        return Array.from(array, value => value.toString(16)).join('')
      }
      return Math.random().toString(16).slice(2)
    },
    async checkConnection(forceRefresh = false) {
      // Verificar se há token válido antes de usar cache
      let hasToken = !!localStorage.getItem('deriv_token')
      if (!hasToken) {
        try {
          const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid')
          if (tokensByLoginId) {
            const parsed = JSON.parse(tokensByLoginId)
            hasToken = Object.keys(parsed).length > 0
          }
        } catch (e) {
          // Ignorar erro de parsing
        }
      }
      
      const saved = localStorage.getItem('deriv_connection')
      if (saved && !forceRefresh && hasToken) {
        try {
          const parsed = JSON.parse(saved)
          const maxAge = 60 * 60 * 1000 
          if (Date.now() - parsed.timestamp < maxAge) {
            this.connectedInfo = parsed
            if (parsed?.appId) {
              localStorage.setItem('deriv_app_id', String(parsed.appId))
            }
            this.loading = false
            return
          }
        } catch (e) {
          // Se houver erro ao parsear, continua para buscar do backend
        }
      }
      
      // Se não há token, limpar cache e mostrar tela de conexão
      if (!hasToken) {
        localStorage.removeItem('deriv_connection')
        this.connectedInfo = null
        this.loading = false
        return
      }
      
      try {
        const storedAppId = localStorage.getItem('deriv_app_id')
        const payload = {
          token: localStorage.getItem('deriv_token') || undefined,
          appId: storedAppId ? Number(storedAppId) : undefined
        }
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/broker/deriv/status', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.loginid) {
            this.connectedInfo = data
            if (data?.appId) {
              localStorage.setItem('deriv_app_id', String(data.appId))
            }
            localStorage.setItem('deriv_connection', JSON.stringify({
              ...data,
              timestamp: Date.now()
            }))
          } else {
            localStorage.removeItem('deriv_connection')
            this.connectedInfo = null
          }
        } else {
          this.connectedInfo = null
          localStorage.removeItem('deriv_connection')
        }
      } catch (e) {
        if (saved) {
          try {
            this.connectedInfo = JSON.parse(saved)
            if (this.connectedInfo?.appId) {
              localStorage.setItem('deriv_app_id', String(this.connectedInfo.appId))
            }
          } catch (e2) {
            this.connectedInfo = null
          }
        } else {
          this.connectedInfo = null
        }
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    await this.checkConnection(true)
  },
  watch: {
    '$route'(to) {
      if (to.path === '/dashboard') {
        this.checkConnection(true)
      }
    }
  }
}
</script>

<style scoped src="../assets/css/views/homeView.css"></style>
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