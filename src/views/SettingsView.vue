<template>
  <div class="layout">
    <AppSidebar />
    <main class="settings-content">
      <div class="header">
        <h1 class="title">Configurações de Perfil</h1>
        <button class="save-btn" @click="saveAll" :disabled="saving">
          <span v-if="saving">⏳</span>
          <span v-else>Salvar Alterações</span>
        </button>
      </div>

      <div v-if="loading" class="loading">Carregando configurações...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="settings-grid">
        <!-- Coluna Esquerda -->
        <div class="column">
          <!-- Card de Informações do Usuário -->
          <div class="settings-card">
            <div class="profile-section">
              <div class="profile-picture" v-if="settings.profilePictureUrl">
                <img :src="settings.profilePictureUrl" alt="Foto" />
              </div>
              <div class="profile-picture" v-else>
                {{ initials }}
              </div>
              <h2 class="profile-name">{{ settings.name || 'Usuário' }}</h2>
              <p class="profile-email">{{ settings.email }}</p>
              <p class="profile-date">Conta criada em: {{ formatDate(settings.createdAt) }}</p>
            </div>
            <div class="profile-actions">
              <button class="action-btn" @click="openEditNameModal">
                <span>✏️</span> Editar Nome
              </button>
              <button class="action-btn" @click="openEditEmailModal">
                <span>✉️</span> Alterar E-mail
              </button>
              <button class="action-btn" @click="openChangePhotoModal">
                <span>📷</span> Trocar Foto
              </button>
            </div>
          </div>

          <!-- Card de Idioma e Notificações -->
          <div class="settings-card">
            <h3 class="card-title">Idioma e Notificações</h3>
            <div class="form-group">
              <label>Idioma</label>
              <select v-model="settings.language" class="form-input">
                <option value="pt-BR">Português (BR)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español (ES)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fuso Horário</label>
              <select v-model="settings.timezone" class="form-input">
                <option value="America/Sao_Paulo">GMT -3 (Brasília)</option>
                <option value="America/New_York">GMT -5 (Nova York)</option>
                <option value="Europe/London">GMT +0 (Londres)</option>
                <option value="Asia/Tokyo">GMT +9 (Tóquio)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Notificações por e-mail</label>
              <div class="toggle-wrapper">
                <input 
                  type="checkbox" 
                  v-model="settings.emailNotifications" 
                  class="toggle"
                  id="email-notifications"
                />
                <label for="email-notifications" class="toggle-label"></label>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna Central -->
        <div class="column">
          <!-- Card de Segurança -->
          <div class="settings-card">
            <h3 class="card-title">Segurança da Conta</h3>
            <div class="security-item">
              <div class="security-info">
                <span class="security-label">Senha</span>
                <span class="security-value">••••••••</span>
              </div>
              <button class="security-btn" @click="openChangePasswordModal">
                <span>🔒</span> Alterar senha
              </button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <span class="security-label">Autenticação em duas etapas</span>
                <span class="security-status" :class="{ active: settings.twoFactorEnabled }">
                  <span class="status-dot"></span>
                  {{ settings.twoFactorEnabled ? 'Ativa' : 'Inativa' }}
                </span>
              </div>
              <button class="security-btn" @click="open2FAModal">
                <span>⚙️</span> Gerenciar
              </button>
            </div>
          </div>

          <!-- Card de Atividade Recente -->
          <div class="settings-card">
            <h3 class="card-title">Atividade Recente</h3>
            <div class="activity-item" v-if="lastLogin">
              <span class="activity-label">Último login</span>
              <span class="activity-value">{{ formatDateTime(lastLogin.date) }}</span>
            </div>
            <div class="activity-item" v-if="lastLogin">
              <span class="activity-label">Dispositivo</span>
              <span class="activity-value">{{ formatDevice(lastLogin.device, lastLogin.userAgent) }}</span>
            </div>
            <div class="activity-item">
              <span class="activity-label">Sessões ativas</span>
              <span class="activity-value">{{ activeSessions }}</span>
            </div>
            <button class="end-sessions-btn" @click="endAllSessions">
              <span>🔒</span> Encerrar todas as sessões
            </button>
          </div>

          <!-- Card de Conta e Privacidade -->
          <div class="settings-card">
            <h3 class="card-title">Conta e Privacidade</h3>
            <a href="#" class="privacy-link" @click.prevent="downloadPersonalData">
              Baixar meus dados pessoais
            </a>
            <a href="#" class="privacy-link">
              <span>📄</span> Termos de uso e política de privacidade
            </a>
            <button class="danger-btn" @click="openDeleteAccountModal">
              <span>⚠️</span> Excluir conta permanentemente
            </button>
          </div>
        </div>

        <!-- Coluna Direita -->
        <div class="column">
          <!-- Card de Histórico de Alterações -->
          <div class="settings-card">
            <h3 class="card-title">Histórico de Alterações</h3>
            <div class="history-list">
              <div 
                v-for="log in activityLogs" 
                :key="log.id" 
                class="history-item"
              >
                <span class="history-date">{{ formatLogDate(log.createdAt) }}</span>
                <span class="history-description">{{ log.description }}</span>
              </div>
              <div v-if="activityLogs.length === 0" class="no-history">
                Nenhuma alteração registrada ainda.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modais -->
      <EditNameModal 
        :visible="showEditNameModal" 
        :currentName="settings.name"
        @close="closeEditNameModal"
        @save="handleSaveName"
      />
      <EditEmailModal 
        :visible="showEditEmailModal" 
        :currentEmail="settings.email"
        @close="closeEditEmailModal"
        @save="handleSaveEmail"
      />
      <ChangePasswordModal 
        :visible="showChangePasswordModal"
        @close="closeChangePasswordModal"
        @save="handleSavePassword"
      />
      <ChangePhotoModal 
        :visible="showChangePhotoModal"
        @close="closeChangePhotoModal"
        @save="handleSavePhoto"
      />
    </main>
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
        twoFactorEnabled: false
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
      showChangePhotoModal: false
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
    }
  },
  mounted() {
    this.fetchSettings()
  },
  methods: {
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
          twoFactorEnabled: data.twoFactorEnabled || false
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
            emailNotifications: this.settings.emailNotifications
          })
        })

        if (!res.ok) {
          throw new Error('Erro ao salvar configurações')
        }

        await this.fetchSettings() // Recarregar para atualizar logs
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
      // Tentar extrair informações básicas do user agent
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
    }
  }
}
</script>

<style scoped src="../assets/css/views/settingsView.css"></style>

