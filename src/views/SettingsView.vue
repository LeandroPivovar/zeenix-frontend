<template>
  <div class="bg-zenix-bg noise-bg gradient-glow min-h-screen font-inter text-zenix-text">
    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarIsOpen && isMobile"
      class="fixed inset-0 bg-black/50 z-40"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar (using existing AppSidebar component but wrapped or positioned if needed) -->
    <AppSidebar :is-open="sidebarIsOpen" @close-sidebar="closeSidebar" />

    <!-- Main Content -->
    <div class="lg:ml-[240px] min-h-screen flex flex-col transition-all duration-300">
      <!-- Header -->
      <header id="header" class="sticky top-0 z-30 glass-effect border-b border-zenix-border">
        <div class="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-4 lg:space-x-6">
            <!-- Mobile Toggle -->
            <button class="lg:hidden text-zenix-secondary hover:text-white" @click="toggleSidebar">
              <i class="fas fa-bars text-lg"></i>
            </button>
            
            <button class="text-zenix-secondary hover:text-white transition-all hidden lg:block" @click="$router.push('/dashboard')">
              <i class="fas fa-arrow-left text-lg"></i>
            </button>
            <div>
              <h1 class="text-lg lg:text-xl font-bold text-white">Configurações de Perfil</h1>
              <p class="text-xs text-zenix-secondary mt-0.5">Gerencie suas informações pessoais e preferências</p>
            </div>
          </div>
          <button 
            @click="saveAll" 
            :disabled="saving"
            class="bg-zenix-green hover:bg-zenix-green-hover text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving" class="mr-2"><i class="fas fa-spinner fa-spin"></i></span>
            <i v-else class="fas fa-save mr-2"></i>
            {{ saveButtonText }}
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8">
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-zenix-secondary">Carregando configurações...</div>
        </div>
        
        <div v-else-if="error" class="flex items-center justify-center h-64">
          <div class="text-red-500">{{ error }}</div>
        </div>

        <div v-else class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Column 1 -->
          <div class="space-y-8">
            <!-- Profile Card -->
            <div id="profile-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <div class="text-center mb-8">
                <div class="avatar-border w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden bg-zenix-bg">
                  <img v-if="settings.profilePictureUrl" :src="settings.profilePictureUrl" alt="Profile" class="w-full h-full rounded-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center bg-zenix-card">
                    <i class="fas fa-user text-4xl text-zenix-secondary"></i>
                  </div>
                </div>
                <h2 class="text-xl font-bold text-white mb-1">{{ settings.name || 'Usuário' }}</h2>
                <p class="text-zenix-secondary text-sm mb-1">{{ settings.email }}</p>
                <p class="text-zenix-secondary text-xs">Conta criada em {{ formatDate(settings.createdAt) }}</p>
              </div>

              <div class="space-y-3">
                <button @click="openEditNameModal" class="w-full bg-zenix-bg/70 hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm">
                  <i class="fas fa-edit mr-2"></i>
                  Editar Nome
                </button>
                <button @click="openEditEmailModal" class="w-full bg-zenix-bg/70 hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm">
                  <i class="fas fa-envelope mr-2"></i>
                  Alterar E-mail
                </button>
                <button @click="openChangePhotoModal" class="w-full bg-zenix-bg/70 hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm">
                  <i class="fas fa-image mr-2"></i>
                  Trocar Foto
                </button>
              </div>
            </div>

            <!-- General Settings Card -->
            <div id="general-settings-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <h3 class="text-lg font-bold text-white mb-6">Configurações Gerais</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-zenix-text mb-2">Idioma</label>
                  <select v-model="settings.language" class="w-full bg-zenix-bg border border-zenix-border rounded-xl px-4 py-3 text-zenix-text focus:outline-none focus:border-zenix-green transition-all appearance-none">
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-zenix-text mb-2">Fuso Horário</label>
                  <select v-model="settings.timezone" class="w-full bg-zenix-bg border border-zenix-border rounded-xl px-4 py-3 text-zenix-text focus:outline-none focus:border-zenix-green transition-all appearance-none">
                    <option value="America/Sao_Paulo">GMT-3 (São Paulo)</option>
                    <option value="America/New_York">GMT-5 (New York)</option>
                    <option value="Europe/London">GMT+0 (Londres)</option>
                    <option value="Asia/Tokyo">GMT+9 (Tóquio)</option>
                  </select>
                </div>

                 <div>
                  <label class="block text-sm font-medium text-zenix-text mb-2">Moeda padrão</label>
                  <select v-model="settings.tradeCurrency" class="w-full bg-zenix-bg border border-zenix-border rounded-xl px-4 py-3 text-zenix-text focus:outline-none focus:border-zenix-green transition-all appearance-none">
                    <option value="USD">USD (Real)</option>
                    <option value="BTC">BTC</option>
                    <option value="DEMO">DEMO (Conta virtual)</option>
                  </select>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-zenix-text">Notificações por e-mail</span>
                  <label class="switch">
                    <input type="checkbox" v-model="settings.emailNotifications">
                    <span class="slider"></span>
                  </label>
                </div>

                <!-- Placeholder for Push Notifications if needed in future -->
                <div class="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em breve">
                  <span class="text-sm font-medium text-zenix-text">Notificações push</span>
                  <label class="switch pointer-events-none">
                    <input type="checkbox" disabled>
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="pt-4 border-t border-zenix-border">
                  <a href="#" class="text-zenix-blue hover:text-zenix-blue/80 text-sm transition-all flex items-center">
                    <i class="fas fa-shield-alt mr-2"></i>
                    Gerenciar minhas permissões
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2 -->
          <div class="space-y-8">
            <div id="security-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <h3 class="text-lg font-bold text-white mb-6">Segurança da Conta</h3>
              
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm font-medium text-zenix-text block">Senha</span>
                    <p class="text-xs text-zenix-secondary">••••••••</p>
                  </div>
                  <button @click="openChangePasswordModal" class="bg-zenix-bg/70 hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 px-4 py-2 rounded-lg transition-all text-xs lg:text-sm">
                    Alterar senha
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm font-medium text-zenix-text block">Autenticação 2FA</span>
                    <p class="text-xs" :class="settings.twoFactorEnabled ? 'text-zenix-green' : 'text-zenix-secondary'">
                      {{ settings.twoFactorEnabled ? 'Ativa' : 'Inativa' }}
                    </p>
                  </div>
                  <button @click="open2FAModal" class="bg-zenix-bg/70 hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 px-4 py-2 rounded-lg transition-all text-xs lg:text-sm">
                    Gerenciar 2FA
                  </button>
                </div>
              </div>
            </div>

            <div id="activity-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <h3 class="text-lg font-bold text-white mb-6">Atividade Recente</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between" v-if="lastLogin">
                  <span class="text-sm text-zenix-secondary">Último login</span>
                  <span class="text-sm text-zenix-text">{{ formatDateTime(lastLogin.date) }}</span>
                </div>

                <div class="flex items-center space-x-3" v-if="lastLogin">
                  <i class="fab fa-chrome text-zenix-secondary"></i>
                  <span class="text-sm text-zenix-text">{{ formatDevice(lastLogin.device, lastLogin.userAgent) }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-zenix-secondary">Sessões ativas</span>
                  <span class="text-sm text-zenix-text font-semibold">{{ activeSessions }}</span>
                </div>

                <button @click="endAllSessions" class="w-full bg-transparent border border-zenix-border hover:border-zenix-red text-zenix-text hover:text-zenix-red py-3 rounded-xl transition-all text-sm">
                  Encerrar todas as sessões
                </button>
              </div>
            </div>

            <div id="privacy-card" class="bg-gradient-to-br from-zenix-red/20 to-zenix-red/5 border border-zenix-red/50 rounded-2xl p-6 lg:p-8 premium-card hover:border-zenix-red transition-colors">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center">
                <i class="fas fa-exclamation-triangle text-zenix-red mr-2"></i>
                Conta & Privacidade
              </h3>
              
              <div class="space-y-4">
                <a href="#" @click.prevent="downloadPersonalData" class="block text-zenix-blue hover:text-zenix-blue/80 text-sm transition-all flex items-center">
                  <i class="fas fa-download mr-2"></i>
                  Baixar meus dados
                </a>

                <a href="#" class="block text-zenix-blue hover:text-zenix-blue/80 text-sm transition-all flex items-center">
                  <i class="fas fa-file-contract mr-2"></i>
                  Termos de uso e privacidade
                </a>

                <div class="pt-4 border-t border-zenix-red/40">
                  <button @click="openDeleteAccountModal" class="w-full bg-zenix-red/20 hover:bg-zenix-red/30 border border-zenix-red/50 hover:border-zenix-red text-zenix-red py-3 rounded-xl transition-all font-semibold text-sm flex items-center justify-center">
                    <i class="fas fa-trash-alt mr-2"></i>
                    Excluir conta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3 -->
          <div class="space-y-8">
            <div id="history-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card h-full">
              <h3 class="text-lg font-bold text-white mb-6">Histórico de Alterações</h3>
              
              <div class="space-y-4 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
                <template v-for="(log, index) in activityLogs" :key="log.id">
                   <div class="activity-item p-4 border-l-2 border-transparent transition-all hover:bg-zenix-green/5 hover:border-zenix-green">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs text-zenix-secondary">{{ formatLogDate(log.createdAt) }}</span>
                    </div>
                    <p class="text-sm text-zenix-text">{{ log.description }}</p>
                  </div>
                  <div v-if="index < activityLogs.length - 1" class="border-t border-zenix-border"></div>
                </template>
                 <div v-if="activityLogs.length === 0" class="text-center py-8 text-zenix-secondary text-sm">
                    Nenhuma alteração registrada ainda.
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer id="footer" class="border-t border-zenix-border bg-zenix-card/50 mt-auto">
        <div class="max-w-7xl mx-auto px-8 py-8 text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-zenix-green rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">Z</span>
            </div>
            <span class="text-white font-bold">ZENIX</span>
          </div>
          <p class="text-zenix-secondary text-xs lg:text-sm">
            Plataforma de investimentos automatizados — Desde 2024 oferecendo soluções confiáveis
          </p>
        </div>
      </footer>
    </div>

    <!-- Modals (Existing) -->
    <EditNameModal :visible="showEditNameModal" :currentName="settings.name" @close="closeEditNameModal" @save="handleSaveName" />
    <EditEmailModal :visible="showEditEmailModal" :currentEmail="settings.email" @close="closeEditEmailModal" @save="handleSaveEmail" />
    <ChangePasswordModal :visible="showChangePasswordModal" @close="closeChangePasswordModal" @save="handleSavePassword" />
    <ChangePhotoModal :visible="showChangePhotoModal" @close="closeChangePhotoModal" @save="handleSavePhoto" />

  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
import EditNameModal from '../components/modals/EditNameModal.vue'
import EditEmailModal from '../components/modals/EditEmailModal.vue'
import ChangePasswordModal from '../components/modals/ChangePasswordModal.vue'
import ChangePhotoModal from '../components/modals/ChangePhotoModal.vue'

export default {
  name: 'SettingsView',
  components: {
    AppSidebar,
    EditNameModal,
    EditEmailModal,
    ChangePasswordModal,
    ChangePhotoModal
  },
  data() {
    return {
      settings: {
        name: '',
        email: '',
        createdAt: null,
        profilePictureUrl: null,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        emailNotifications: true,
        twoFactorEnabled: false,
        tradeCurrency: 'USD'
      },
      lastLogin: null,
      activeSessions: 0,
      activityLogs: [],
      loading: true,
      error: null,
      saving: false,
      showEditNameModal: false,
      showEditEmailModal: false,
      showChangePasswordModal: false,
      showChangePhotoModal: false,
      sidebarIsOpen: false,
      isMobile: false
    }
  },
  computed: {
    initials() {
      if (!this.settings.name) return 'U'
      const parts = this.settings.name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return this.settings.name.substring(0, 2).toUpperCase()
    },
    saveButtonText() {
      return this.isMobile ? 'Salvar' : 'Salvar alterações';
    }
  },
  mounted() {
    this.fetchSettings();
    window.addEventListener('resize', this.checkMobile);
    this.checkMobile();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024; // Adjusted for lg breakpoint
    },
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          throw new Error('Erro ao buscar configurações')
        }

        const data = await res.json()
        this.settings = {
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
          profilePictureUrl: data.profilePictureUrl,
          language: data.language || 'pt-BR',
          timezone: data.timezone || 'America/Sao_Paulo',
          emailNotifications: data.emailNotifications !== false,
          twoFactorEnabled: data.twoFactorEnabled || false,
          tradeCurrency: data.tradeCurrency || 'USD'
        }
        this.lastLogin = data.lastLogin
        this.activeSessions = data.activeSessions || 0
        this.activityLogs = data.activityLogs || []
      } catch (err) {
        console.error('Erro ao buscar configurações:', err)
        this.error = 'Não foi possível carregar as configurações.'
      } finally {
        this.loading = false
      }
    },
    async saveAll() {
      this.saving = true
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            language: this.settings.language,
            timezone: this.settings.timezone,
            emailNotifications: this.settings.emailNotifications,
            tradeCurrency: this.settings.tradeCurrency
          })
        })

        if (!res.ok) {
          throw new Error('Erro ao salvar configurações')
        }

        await this.fetchSettings()
        alert('Configurações salvas com sucesso!')
      } catch (err) {
        console.error('Erro ao salvar:', err)
        alert('Erro ao salvar configurações. Tente novamente.')
      } finally {
        this.saving = false
      }
    },
    async handleSaveName(newName) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/name`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ name: newName })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao atualizar nome')
        }

        await this.fetchSettings()
        this.closeEditNameModal()
        alert('Nome atualizado com sucesso!')
      } catch (err) {
        alert(err.message || 'Erro ao atualizar nome')
        throw err
      }
    },
    async handleSaveEmail(newEmail) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/email`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ email: newEmail })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao atualizar email')
        }

        await this.fetchSettings()
        this.closeEditEmailModal()
        alert('Email atualizado com sucesso!')
      } catch (err) {
        alert(err.message || 'Erro ao atualizar email')
        throw err
      }
    },
    async handleSavePassword(passwords) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            currentPassword: passwords.current,
            newPassword: passwords.new
          })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao alterar senha')
        }

        await this.fetchSettings()
        this.closeChangePasswordModal()
        alert('Senha alterada com sucesso!')
      } catch (err) {
        alert(err.message || 'Erro ao alterar senha')
        throw err
      }
    },
    async handleSavePhoto(photoUrl) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ profilePictureUrl: photoUrl })
        })

        if (!res.ok) {
          throw new Error('Erro ao atualizar foto')
        }

        await this.fetchSettings()
        this.closeChangePhotoModal()
        alert('Foto atualizada com sucesso!')
      } catch (err) {
        alert('Erro ao atualizar foto')
      }
    },
    async endAllSessions() {
      if (!confirm('Tem certeza que deseja encerrar todas as sessões?')) return

      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/sessions/end-all`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          throw new Error('Erro ao encerrar sessões')
        }

        await this.fetchSettings()
        alert('Todas as sessões foram encerradas')
      } catch (err) {
        alert('Erro ao encerrar sessões')
      }
    },
    downloadPersonalData() {
      alert('Funcionalidade de download de dados pessoais será implementada em breve')
    },
    open2FAModal() {
      alert('Funcionalidade de autenticação em duas etapas será implementada em breve')
    },
    openDeleteAccountModal() {
      if (confirm('Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.')) {
        alert('Funcionalidade de exclusão de conta será implementada em breve')
      }
    },
    openEditNameModal() { this.showEditNameModal = true },
    closeEditNameModal() { this.showEditNameModal = false },
    openEditEmailModal() { this.showEditEmailModal = true },
    closeEditEmailModal() { this.showEditEmailModal = false },
    openChangePasswordModal() { this.showChangePasswordModal = true },
    closeChangePasswordModal() { this.showChangePasswordModal = false },
    openChangePhotoModal() { this.showChangePhotoModal = true },
    closeChangePhotoModal() { this.showChangePhotoModal = false },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('pt-BR')
    },
    formatDateTime(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleString('pt-BR')
    },
    formatDevice(device, userAgent) {
      if (device) return device
      if (!userAgent) return 'Desconhecido'
      if (userAgent.includes('Chrome')) return 'Chrome • Windows'
      if (userAgent.includes('Firefox')) return 'Firefox • Windows'
      if (userAgent.includes('Safari')) return 'Safari • macOS'
      return userAgent.substring(0, 30) + '...'
    },
    formatLogDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = String(d.getFullYear()).slice(-2)
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen;
    },
    closeSidebar() {
      this.sidebarIsOpen = false;
    }
  }
}
</script>

<style scoped>
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0E0E0E; }
::-webkit-scrollbar-thumb { background: #1C1C1C; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #2C2C2C; }

/* Base Styles mimicking Tailwind if unavailable */
.font-inter { font-family: 'Inter', sans-serif; }
.text-zenix-text { color: #DFDFDF; }
.text-zenix-secondary { color: #AAAAAA; }
.text-zenix-green { color: #22C55E; }
.text-zenix-red { color: #FF4747; }
.text-zenix-blue { color: #0099FF; }
.bg-zenix-bg { background-color: #0B0B0B; }
.bg-zenix-card { background-color: #0E0E0E; }
.border-zenix-border { border-color: #1C1C1C; }
.border-zenix-green { border-color: #22C55E; }
.border-zenix-red { border-color: #FF4747; }

/* Utility Classes (simplified Tailwind) */
.min-h-screen { min-height: 100vh; }
.w-full { width: 100%; }
.h-full { height: 100%; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-3 > * + * { margin-left: 0.75rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-x-6 > * + * { margin-left: 1.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-8 > * + * { margin-top: 2rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mt-0.5 { margin-top: 0.125rem; }
.mt-auto { margin-top: auto; }
.mr-2 { margin-right: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }
.rounded-lg { border-radius: 0.5rem; }
.border { border-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-t { border-top-width: 1px; }
.border-l-2 { border-left-width: 2px; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-white { color: #ffffff; }
.bg-transparent { background-color: transparent; }
.sticky { position: sticky; }
.top-0 { top: 0; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.block { display: block; }
.hidden { display: none; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.opacity-50 { opacity: 0.5; }
.cursor-not-allowed { cursor: not-allowed; }
.pointer-events-none { pointer-events: none; }
.object-cover { object-fit: cover; }
.max-w-7xl { max-width: 80rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.grid { display: grid; }
.gap-8 { gap: 2rem; }

@media (min-width: 1024px) {
  .lg\:block { display: block; }
  .lg\:hidden { display: none; }
  .lg\:ml-\[240px\] { margin-left: 240px; }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:p-8 { padding: 2rem; }
  .lg\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .lg\:py-2\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
  .lg\:text-xl { font-size: 1.25rem; }
  .lg\:text-sm { font-size: 0.875rem; }
}

/* Custom Effects */
.premium-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.premium-card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
  border-color: #22C55E;
}

.glass-effect {
  background: rgba(11, 11, 11, 0.8);
  backdrop-filter: blur(20px);
}

.noise-bg {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
}

.gradient-glow {
  background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.06) 0%, transparent 60%),
              radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.04) 0%, transparent 60%), #0B0B0B;
}

.avatar-border {
  background: linear-gradient(45deg, #22C55E, #16A34A);
  padding: 3px;
  border-radius: 50%;
}

.activity-item {
  transition: all 0.3s ease;
}

/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #1C1C1C;
  transition: .4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: #AAAAAA;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider { background-color: #22C55E; }
input:checked + .slider:before {
  transform: translateX(26px);
  background-color: white;
}

/* Hover States that are complex in utility */
.hover\:text-zenix-green:hover { color: #22C55E; }
.hover\:bg-zenix-green\/10:hover { background-color: rgba(34, 197, 94, 0.1); }
.hover\:border-zenix-green\/40:hover { border-color: rgba(34, 197, 94, 0.4); }
.hover\:bg-zenix-green-hover:hover { background-color: #16A34A; }
.hover\:text-white:hover { color: white; }
.hover\:border-zenix-red:hover { border-color: #FF4747; }
.hover\:text-zenix-red:hover { color: #FF4747; }
.hover\:bg-zenix-red\/30:hover { background-color: rgba(255, 71, 71, 0.3); }
.hover\:text-zenix-blue\/80:hover { color: rgba(0, 153, 255, 0.8); }

</style>
