<template>
  <div class="layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'no-sidebar': !connectedInfo }">
    <!-- Sidebar e Header só aparecem quando conectado -->
    <template v-if="connectedInfo">
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
    </template>

    <!-- Tela de Conexão (sem sidebar e header) -->
    <main class="content welcome-screen" v-if="!connectedInfo && !loading">
      <div class="container">
        <h1 class="title">Seja Bem-vindo, {{ firstName }}</h1>
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
          <button class="primary button-primary" @click="startBrokerConnection">
              <span>
                  <img src="../assets/icons/Link.svg" alt="Conectar à Corretora" > 
                  Conectar à Corretora
              </span>
          </button>
            
          <a
            class="link-button"
            href="https://home.deriv.com/dashboard/signup"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../assets/icons/add-home.svg" alt="Criar Conta na Deriv" width="10px" class="icon-home" >
            Criar Conta na Deriv
          </a>
        </div>

        <div class="separator"></div>

        <div class="note">Essa tela aparece apenas no primeiro acesso ou se sua conta Deriv estiver desconectada.</div>
      </div>
    </main>

    <!-- Loading -->
    <main class="content loading-content" v-else-if="loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">Verificando status da conexão...</p>
    </main>

    <!-- Dashboard Conectado (com sidebar e header) -->
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
      isSidebarCollapsed: false,
      firstName: 'Usuário'
    }
  },
  computed: {
    userFirstName() {
      const userInfo = localStorage.getItem('user')
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo)
          if (user.name) {
            return user.name.split(' ')[0]
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e)
        }
      }
      return 'Usuário'
    }
  },
  created() {
    this.loadUserName()
  },
  methods: {
    async loadUserName() {
      // Tentar pegar do localStorage primeiro
      const userInfo = localStorage.getItem('user')
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo)
          if (user.name) {
            this.firstName = user.name.split(' ')[0]
            console.log('[HomeView] Nome carregado do localStorage:', this.firstName)
            return
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e)
        }
      }

      // Se não tiver no localStorage, tentar decodificar o JWT
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('[HomeView] Payload do token:', payload)
          
          // Tentar buscar o nome do usuário pela API
          if (payload.sub || payload.userId || payload.id) {
            try {
              const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
              const response = await fetch(`${apiBase}/auth/me`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
              
              if (response.ok) {
                const userData = await response.json()
                console.log('[HomeView] Dados do usuário da API:', userData)
                if (userData.name) {
                  this.firstName = userData.name.split(' ')[0]
                  localStorage.setItem('user', JSON.stringify({ name: userData.name, email: userData.email }))
                  console.log('[HomeView] Nome definido:', this.firstName)
                  return
                }
              }
            } catch (apiError) {
              console.error('[HomeView] Erro ao buscar dados do usuário:', apiError)
            }
          }
          
          // Fallback: tentar usar o campo name do payload se existir
          if (payload.name) {
            this.firstName = payload.name.split(' ')[0]
            localStorage.setItem('user', JSON.stringify({ name: payload.name, email: payload.email }))
            console.log('[HomeView] Nome do payload:', this.firstName)
            return
          }
        } catch (e) {
          console.error('[HomeView] Erro ao decodificar token:', e)
        }
      }

      // Se não conseguiu de nenhuma forma, manter "Usuário"
      console.log('[HomeView] Nome não encontrado, usando fallback')
      this.firstName = 'Usuário'
    },
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
    await this.loadUserName()
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