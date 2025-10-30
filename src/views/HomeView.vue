<template>
  <div class="layout">
    <AppSidebar />
    <main class="content" v-if="!connectedInfo">
      <div class="container">
        <h1 class="title">Bem-vindo ao Zenix Black</h1>
        <p class="subtitle">Antes de começar a operar, você precisa conectar sua conta Deriv ou criar uma nova.</p>

        <div class="video-card">
          <div class="video-placeholder">
            <div class="play">▶</div>
            <div class="video-text">Zenix Black Tutorial Video</div>
          </div>
        </div>

        <div class="actions">
          <button class="primary" @click="openConnectModal">
            Conectar à Corretora
          </button>
          <button class="link-button">Criar Conta na Deriv</button>
        </div>

        <div class="note">Essa tela aparece apenas no primeiro acesso ou se sua conta Deriv estiver desconectada.</div>
      </div>
      <ConnectBrokerModal :visible="showConnectModal" @close="closeConnectModal" @connected="onConnected" />
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
    return { showConnectModal: false, connectedInfo: null }
  },
  methods: {
    openConnectModal() { this.showConnectModal = true },
    closeConnectModal() { this.showConnectModal = false },
    onConnected(info) {
      this.connectedInfo = info
    }
  },
  async mounted() {
    try {
      const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/broker/deriv/status', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.loginid) this.connectedInfo = data
      }
    } catch (e) { /* ignore */ }
  }
}
</script>

<style scoped src="../assets/css/views/homeView.css"></style>


