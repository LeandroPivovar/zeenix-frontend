<template>
  <div class="layout">
    <AppSidebar :is-open="isSidebarOpen" @close-sidebar="closeSidebar" />

    <button class="hamburger-menu" @click="toggleSidebar">
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </button>
    
    <div v-if="isSidebarOpen" class="mobile-overlay" @click="closeSidebar"></div>

    <main class="content" v-if="!connectedInfo && !loading">
      <div class="container">
        <h1 class="title">Bem-vindo ao Zenix Black</h1>
        <p class="subtitle">Antes de começar a operar, você precisa conectar sua conta Deriv ou criar uma nova.</p>

        <div class="video-card">
          <div class="video-placeholder">
            <div class="play">▶</div>
            <div class="video-text">Zenix Black Tutorial Video</div>
          </div>
          
        </div>
        <p class="text-video">Assista o video e entenda como conectar sua conta Deriv em menos de 2 minutos.</p>

        <div class="actions">
          <button class="primary" @click="openConnectModal">
            <img src="../assets/icons/Link.svg" alt="Conectar à Corretora" > 
            Conectar à Corretora
          </button>
          <button class="link-button">
            <img src="../assets/icons/add.svg" alt="Criar Conta na Deriv" >
            Criar Conta na Deriv
          </button>
        </div>

        <div class="note">Essa tela aparece apenas no primeiro acesso ou se sua conta Deriv estiver desconectada.</div>
      </div>
      <ConnectBrokerModal :visible="showConnectModal" @close="closeConnectModal" @connected="onConnected" />
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
import ConnectBrokerModal from '../components/ConnectBrokerModal.vue'
import DashboardConnected from './DashboardConnected.vue'

export default {
  name: 'HomeView',
  components: { AppSidebar, ConnectBrokerModal, DashboardConnected },
  data() {
    return { 
      showConnectModal: false, 
      connectedInfo: null,
      loading: true,
      // NOVO: Estado para controlar o sidebar no mobile
      isSidebarOpen: false
    }
  },
  methods: {
    // NOVOS MÉTODOS DE CONTROLE DO SIDEBAR
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    closeSidebar() {
      this.isSidebarOpen = false
    },
    // FIM DOS NOVOS MÉTODOS

    openConnectModal() { this.showConnectModal = true },
    closeConnectModal() { this.showConnectModal = false },
    onConnected(info) {
      this.connectedInfo = info
      // Salvar no localStorage para manter durante a sessão
      if (info && info.loginid) {
        localStorage.setItem('deriv_connection', JSON.stringify({
          loginid: info.loginid,
          currency: info.currency,
          balance: info.balance,
          timestamp: Date.now()
        }))
      }
    },
    async checkConnection() {
      // Primeiro verificar localStorage
      const saved = localStorage.getItem('deriv_connection')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Verificar se não é muito antigo (opcional, manter por até 1 hora)
          const maxAge = 60 * 60 * 1000 // 1 hora
          if (Date.now() - parsed.timestamp < maxAge) {
            this.connectedInfo = parsed
            this.loading = false
            return
          }
        } catch (e) {
          // Se houver erro ao parsear, continua para buscar do backend
        }
      }
      
      // Se não há no localStorage ou está expirado, buscar do backend
      try {
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/broker/deriv/status', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.loginid) {
            this.connectedInfo = data
            // Salvar no localStorage
            localStorage.setItem('deriv_connection', JSON.stringify({
              loginid: data.loginid,
              currency: data.currency,
              balance: data.balance,
              timestamp: Date.now()
            }))
          } else {
            // Se não há conexão no backend, limpar localStorage
            localStorage.removeItem('deriv_connection')
            this.connectedInfo = null
          }
        } else {
          this.connectedInfo = null
          localStorage.removeItem('deriv_connection')
        }
      } catch (e) {
        // Se falhar, tentar usar dados salvos mesmo que antigos
        if (saved) {
          try {
            this.connectedInfo = JSON.parse(saved)
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
    await this.checkConnection()
  },
  watch: {
    // Re-verificar quando voltar para esta rota
    '$route'(to) {
      if (to.path === '/dashboard') {
        this.checkConnection()
      }
    }
  }
}
</script>

<style scoped src="../assets/css/views/homeView.css"></style>