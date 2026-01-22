<template>
  <div class="layout-home">
    <!-- Fundo animado: luzes e partículas -->
    <div class="animated-light-primary"></div>
    <div class="animated-light-secondary"></div>
    <div class="particles">
      <span v-for="n in 12" :key="n" class="particle"></span>
    </div>
    <!-- Tela de Conexão (sem sidebar e header) -->
    <main class="content welcome-screen" :class="{ 'modal-open': showCreateAccountCard }" v-if="!connectedInfo && !loading">
      <!-- Indicador de Etapa (apenas mobile, todas as etapas) - fora do container para ocupar toda largura -->
      <div v-if="showCreateAccountCard" class="step-indicator">
        PASSO {{ currentAccountStep }}/3
      </div>
      <div class="container">
        
        <h1 v-if="!showCreateAccountCard || currentAccountStep === 1" class="title"> Bem-vindo, {{ firstName }}</h1>
        <p v-if="!showCreateAccountCard || currentAccountStep === 1" class="subtitle">Antes de começar a operar, você precisa<br class="mobile-br"> conectar sua conta Deriv ou criar uma nova.</p>
        
        <div class="box">
          <!-- Título e botão X fora do card (apenas mobile, etapas 2 e 3) -->
          <div v-if="showCreateAccountCard && currentAccountStep > 1" class="modal-header-external-wrapper">
            <div class="modal-header-external">
              <h3 class="title">Criar Conta na Deriv</h3>
              <button class="close-btn" @click="handleCloseAccountCard" :disabled="false">×</button>
            </div>
            <p v-if="currentAccountStep === 2" class="subtitle step2-instruction">Preencha o código enviado para seu e-mail.</p>
            
            <!-- Info box DEMO (apenas passo 3, mobile) -->
            <div v-if="currentAccountStep === 3" class="info-box-demo-external">
              <svg class="check-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#22C55E" opacity="0.4"/>
                <circle cx="12" cy="12" r="8" fill="#22C55E"/>
                <path d="M9 12l2 2 4-4" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
              <p>Conta <strong>DEMO</strong> liberada automaticamente após cadastro</p>
            </div>
          </div>
          
          <!-- Card de criação de conta (apenas mobile) -->
          <div v-if="showCreateAccountCard" class="create-account-card-mobile">
            <CreateDerivAccountModal 
              :visible="true"
              :inline="true"
              @close="handleCloseAccountCard"
              @success="handleAccountCreated"
              @step-change="currentAccountStep = $event"
            />
          </div>
          
          <!-- Video (oculto no mobile quando card está ativo) -->
          <div v-else class="video-card">
            <div class="video-placeholder">
              <div class="play">▶</div>
            </div>
            <div class="video-text">Zenix Black Tutorial Video</div>
          </div>
          <p v-if="!showCreateAccountCard" class="text-mobile-description">Assista o video e entenda como conectar sua conta Deriv em menos de 2 minutos.</p>
        </div>
      

        <div class="actions">
          <button v-if="!showCreateAccountCard || currentAccountStep !== 3" class="primary button-primary" @click="startBrokerConnection">
            <span>
                <img src="../assets/icons/Link.svg" alt="Conectar à Corretora" > 
                Conectar a corretora
            </span>
          </button>
          <button
            v-if="!showCreateAccountCard"
            class="link-button"
            @click="handleCreateAccountClick"
          >
              <img src="../assets/icons/add-home.svg" alt="Criar Conta na Deriv" width="10px" class="icon-home" >
              Criar Conta na Deriv
          </button>

          <button
            v-if="showCreateAccountCard && currentAccountStep !== 3"
            class="link-button"
            @click="handleCloseAccountCard"
          >
            <img src="../assets/icons/back.svg" alt="Voltar" width="10px" class="icon-home" >
            Voltar
          </button>
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
    
    <!-- Modal de Criação de Conta (apenas desktop) -->
    <CreateDerivAccountModal 
      v-if="!isMobile"
      :visible="showCreateAccountModal"
      :inline="false"
      @close="showCreateAccountModal = false"
      @success="handleAccountCreated"
    />

    <OnboardingModal 
      :visible="showOnboardingModal" 
      @finish="handleOnboardingFinish"
    />
  </div>
</template>

<script>
import DashboardConnected from './DashboardConnected.vue'
import CreateDerivAccountModal from '../components/CreateDerivAccountModal.vue'
import OnboardingModal from '../components/modals/OnboardingModal.vue'

export default {
  name: 'HomeView',
  components: { DashboardConnected, CreateDerivAccountModal, OnboardingModal },
  data() {
    return { 
      connectedInfo: null,
      loading: true,
      firstName: 'Usuário',
      showCreateAccountModal: false,
      showCreateAccountCard: false,
      showOnboardingModal: false,
      isMobile: false,
      currentAccountStep: 1
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
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
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
                  localStorage.setItem('user', JSON.stringify({ 
                    name: userData.name, 
                    email: userData.email,
                    firstAccess: userData.firstAccess
                  }))
                  
                  if (userData.firstAccess) {
                    this.showOnboardingModal = true
                  }
                  
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
        this.$root.$toast.error(error?.message || 'Falha ao iniciar OAuth. Tente novamente.')
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
            // Determinar isDemo baseado no loginid (mais confiável)
            const loginid = data.loginid || '';
            const isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT');
            
            localStorage.setItem('deriv_connection', JSON.stringify({
              ...data,
              loginid: loginid,
              isDemo: isDemo,
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
    },
    handleAccountCreated(result) {
      console.log('Conta criada com sucesso:', result);
      this.$root.$toast?.success?.('Contas criadas com sucesso! Verifique seu email para as credenciais.') || 
        alert('✅ Contas criadas com sucesso!\n\nConta DEMO: ' + (result.data?.demoAccountId || 'N/A') + '\nConta REAL: ' + (result.data?.realAccountId || 'N/A') + '\n\nVerifique seu email para as credenciais de acesso.');
      // Fechar card/modal
      this.showCreateAccountCard = false;
      this.showCreateAccountModal = false;
      // Recarregar status da conexão
      setTimeout(() => {
        this.checkConnection(true);
      }, 2000);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleCreateAccountClick() {
      if (this.isMobile) {
        this.showCreateAccountCard = true;
        this.currentAccountStep = 1;
      } else {
        this.showCreateAccountModal = true;
      }
    },
    handleCloseAccountCard() {
      this.showCreateAccountCard = false;
      this.currentAccountStep = 1;
    },
    handleOnboardingFinish() {
      this.showOnboardingModal = false;
      // Atualizar o primeiro acesso no localStorage
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        user.firstAccess = false;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  },
  async mounted() {
    this.checkMobile()
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
