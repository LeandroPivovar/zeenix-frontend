<template>
  <div class="zenix-layout">
    <!-- Sidebar -->
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <header class="top-header">
        <div class="header-content">
          <div class="header-left-content">
            <h1 class="header-title">Central de Suporte</h1>
            <p class="header-subtitle">Encontre respostas rápidas ou entre em contato com nossa equipe.</p>
          </div>
          <div class="header-actions-right">
            <div class="balance-display-card">
              <div class="balance-header">
                <i class="far fa-wallet"></i>
                <div class="balance-info">
                  <span class="balance-label">Saldo Atual</span>
                  <div class="balance-value-row">
                    <span id="balanceValue" class="balance-value" v-if="balanceVisible">{{ formattedBalance }}</span>
                    <span class="balance-value" v-else>••••••</span>
                    <button 
                      v-if="balanceVisible && !isDemo" 
                      class="account-type-btn real-btn"
                      @click="toggleBalanceVisibility"
                    >
                      Real
                    </button>
                    <button 
                      v-if="balanceVisible && isDemo" 
                      class="account-type-btn demo-btn"
                      @click="toggleBalanceVisibility"
                    >
                      Demo
                    </button>
                    <button class="eye-toggle-btn" @click="toggleBalanceVisibility" :title="balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'">
                      <i class="far fa-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <!-- Immediate Support Section -->
        <section id="immediate-support" class="support-section mb-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Chat Card -->
            <div class="support-card bg-zenix-card border border-zenix-border rounded-2xl p-8 min-h-[160px] flex flex-col">
              <div class="flex-1 flex flex-col">
                <div class="flex items-center space-x-3 mb-2">
                  <i class="far fa-comment-dots text-white text-2xl"></i>
                  <span class="px-2 py-1 bg-zenix-green/20 text-zenix-green text-[10px] font-bold rounded">Online agora</span>
                </div>
                <h3 class="text-white text-xl font-bold mb-1">Chat ao Vivo</h3>
                <p class="text-zenix-secondary text-sm mb-4">Suporte imediato com um atendente real</p>
              </div>
              <button 
                @click="startChat"
                class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3 rounded-lg transition-all mt-auto"
              >
                Iniciar Atendimento
              </button>
            </div>

            <!-- Ticket Card -->
            <div class="support-card bg-zenix-card border border-zenix-border rounded-2xl p-8 min-h-[160px] flex flex-col">
              <div class="flex-1 flex flex-col">
                <div class="mb-2">
                  <i class="far fa-life-ring text-white text-2xl"></i>
                </div>
                <h3 class="text-white text-xl font-bold mb-1">Abrir Ticket</h3>
                <p class="text-zenix-secondary text-sm mb-4">Resposta em até 24h úteis</p>
              </div>
              <button 
                @click="createTicket"
                class="w-full border-2 border-zenix-green text-zenix-green hover:bg-zenix-green hover:text-white font-semibold py-3 rounded-lg transition-all mt-auto"
              >
                Criar Ticket
              </button>
            </div>
          </div>
        </section>

        <!-- Search Section -->
        <section id="search-section" class="support-section mb-16">
          <div class="search-container relative">
            <div class="bg-zenix-card border border-zenix-border rounded-2xl overflow-hidden shadow-lg">
              <div class="flex items-center px-6 py-5">
                <i class="fas fa-search text-zenix-secondary mr-4 text-lg"></i>
                <input 
                  type="text" 
                  v-model="searchQuery"
                  @input="onSearchInput"
                  @focus="showSuggestions = true"
                  @blur="hideSuggestions"
                  placeholder="O que você precisa?" 
                  class="flex-1 bg-transparent text-white text-lg placeholder-zenix-secondary focus:outline-none"
                >
              </div>
            </div>
            
            <!-- Search Suggestions -->
            <div 
              v-if="showSuggestions && searchSuggestions.length > 0"
              class="search-suggestions absolute top-full left-0 right-0 mt-2 bg-zenix-card border border-zenix-border rounded-xl overflow-hidden z-10"
            >
              <a 
                v-for="(suggestion, index) in searchSuggestions" 
                :key="index"
                href="#" 
                @click.prevent="selectSuggestion(suggestion)"
                class="block px-6 py-3 text-zenix-text hover:bg-zenix-bg transition-all text-sm"
              >
                {{ suggestion }}
              </a>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq-section" class="support-section mb-16">
          <h2 class="text-white text-2xl font-bold mb-8">Perguntas Frequentes</h2>
          
          <div v-if="loading" class="text-center py-8 text-zenix-secondary">
            Carregando...
          </div>
          
          <div v-else-if="error" class="text-center py-8 text-zenix-red">
            {{ error }}
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="faq in faqs" 
              :key="faq.id"
              class="faq-item bg-zenix-card border border-zenix-border rounded-xl overflow-hidden"
            >
              <button 
                @click="toggleFaq(faq.id)"
                class="w-full px-8 py-5 flex items-center justify-between text-left hover:bg-zenix-bg/30 transition-all"
              >
                <span class="text-white font-semibold text-base">{{ faq.question }}</span>
                <i 
                  :class="[
                    'fas text-zenix-green text-sm transition-transform duration-300',
                    expandedFaqs[faq.id] ? 'fa-minus rotate-180' : 'fa-plus'
                  ]"
                ></i>
              </button>
              <div 
                :class="[
                  'faq-answer px-8 pb-5',
                  expandedFaqs[faq.id] ? 'open' : ''
                ]"
              >
                <div v-if="Array.isArray(faq.answer)" class="text-zenix-secondary text-sm space-y-2">
                  <ul class="list-disc list-inside space-y-2">
                    <li v-for="(item, index) in faq.answer" :key="index">{{ item }}</li>
                  </ul>
                </div>
                <div v-else class="text-zenix-secondary text-sm">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'

export default {
  name: 'SupportView',
  components: {
    AppSidebar
  },
  data() {
    return {
      faqs: [],
      expandedFaqs: {},
      searchQuery: '',
      loading: true,
      error: null,
      searchTimeout: null,
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isMobile: false,
      showSuggestions: false,
      accountBalance: 0,
      accountCurrency: 'USD',
      accountLoginid: null,
      isDemo: false,
      balanceVisible: true,
      balanceUpdateInterval: null,
      searchSuggestions: [
        'Conectar corretora',
        'Erro de operação',
        'Copy Trading não inicia',
        'Pagamento / Assinatura',
        'Zenix Academy'
      ]
    }
  },
  computed: {
    formattedBalance() {
      if (!this.accountBalance && this.accountBalance !== 0) return '0.00';
      return this.accountBalance.toFixed(2);
    }
  },
  mounted() {
    this.fetchFaqs()
    window.addEventListener('resize', this.checkMobile)
    this.checkMobile()
    this.fetchAccountBalance()
    this.startBalanceUpdates()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    this.stopBalanceUpdates()
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    getDerivToken() {
      try {
        const derivInfoStr = localStorage.getItem('deriv_info');
        if (derivInfoStr) {
          const derivInfo = JSON.parse(derivInfoStr);
          if (derivInfo.token) {
            return derivInfo.token;
          }
          if (derivInfo.raw && derivInfo.raw.token) {
            return derivInfo.raw.token;
          }
        }
        return null;
      } catch (error) {
        console.error('[SupportView] Erro ao obter token Deriv:', error);
        return null;
      }
    },
    async fetchAccountBalance() {
      try {
        const derivToken = this.getDerivToken();
        if (!derivToken) {
          console.warn('[SupportView] ❌ Token não disponível para buscar saldo');
          return;
        }

        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const response = await fetch(`${apiBase}/ai/deriv-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ derivToken: derivToken }),
        });

        const result = await response.json();
        if (result.success && result.data) {
          this.accountBalance = result.data.balance;
          this.accountCurrency = result.data.currency;
          this.accountLoginid = result.data.loginid;
          this.isDemo = result.data.loginid?.startsWith('VRTC') || result.data.loginid?.startsWith('VRT');
        }
      } catch (error) {
        console.error('[SupportView] ❌ Erro ao buscar saldo da conta:', error);
      }
    },
    startBalanceUpdates() {
      if (this.balanceUpdateInterval) {
        clearInterval(this.balanceUpdateInterval);
      }
      this.balanceUpdateInterval = setInterval(() => {
        this.fetchAccountBalance();
      }, 30000);
    },
    stopBalanceUpdates() {
      if (this.balanceUpdateInterval) {
        clearInterval(this.balanceUpdateInterval);
        this.balanceUpdateInterval = null;
      }
    },
    toggleBalanceVisibility() {
      this.balanceVisible = !this.balanceVisible;
    },
    hideSuggestions() {
      // Delay para permitir clique nos itens
      setTimeout(() => {
        this.showSuggestions = false
      }, 200)
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion
      this.showSuggestions = false
      this.searchFaqs()
    },
    async fetchFaqs() {
      this.loading = true
      this.error = null
      try {
        const query = this.searchQuery ? `?search=${encodeURIComponent(this.searchQuery)}` : ''
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${apiBaseUrl}/support/faqs${query}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Erro ao buscar FAQs')
        const data = await res.json()
        this.faqs = data
        // Se não houver dados da API, usar FAQs padrão
        if (data.length === 0) {
          this.faqs = this.getDefaultFaqs()
        }
      } catch (err) {
        console.error('Erro ao buscar FAQs:', err)
        this.error = 'Não foi possível carregar as perguntas frequentes.'
        // Em caso de erro, usar FAQs padrão
        this.faqs = this.getDefaultFaqs()
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    getDefaultFaqs() {
      return [
        {
          id: 'faq1',
          question: 'Como conectar minha conta Deriv?',
          answer: [
            'Acesse Dashboard → Conectar Corretora',
            'Insira suas credenciais Deriv (API Token)',
            'Confirme a conexão',
            'Processo seguro e instantâneo'
          ]
        },
        {
          id: 'faq2',
          question: 'Copy Trading não está iniciando, o que fazer?',
          answer: [
            'Verifique se sua conta está conectada',
            'Confirme se há saldo suficiente',
            'Verifique o status do trader copiado',
            'Reinicie a sessão se necessário'
          ]
        },
        {
          id: 'faq3',
          question: 'Minhas operações não estão sendo replicadas',
          answer: [
            'Verifique conexão com a internet',
            'Confirme permissões da API',
            'Verifique limites de risco configurados',
            'Entre em contato com suporte se persistir'
          ]
        },
        {
          id: 'faq4',
          question: 'Não consigo acessar o Zenix Academy',
          answer: [
            'Verifique se está conectado à internet',
            'Confirme se o navegador está atualizado',
            'Reinicie o navegador',
            'Entre em contato com suporte'
          ]
        }
      ]
    },
    toggleFaq(id) {
      this.expandedFaqs = {
        ...this.expandedFaqs,
        [id]: !this.expandedFaqs[id]
      }
    },
    onSearchInput() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.searchFaqs()
      }, 300)
    },
    searchFaqs() {
      this.fetchFaqs()
    },
    startChat() {
      this.$root.$toast.info('Funcionalidade de chat ao vivo será implementada em breve')
      // Aqui você pode integrar com um sistema de chat real
    },
    createTicket() {
      this.$root.$toast.info('Funcionalidade de criação de ticket será implementada em breve')
      // Aqui você pode abrir um modal ou redirecionar para criação de ticket
    }
  }
}
</script>

<style scoped src="../assets/css/views/supportView.css"></style>
<style scoped>
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Layout base igual ao da IA */
.zenix-layout {
  min-height: 100vh;
  background-color: #0B0B0B;
  color: #DFDFDF;
  font-family: 'Inter', sans-serif;
}

.main-content-wrapper {
  margin-left: 240px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  width: calc(100% - 240px);
  box-sizing: border-box;
}

.main-content-wrapper.sidebar-collapsed {
  margin-left: 0;
  width: 100%;
}

/* Top Header */
.top-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 240px;
  z-index: 40;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  width: calc(100% - 240px);
  box-sizing: border-box;
}

.main-content-wrapper.sidebar-collapsed .top-header {
  left: 0;
  width: 100%;
}

.header-content {
  padding: 1rem 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

.header-left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: center;
  align-items: flex-start;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #DFDFDF;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #A1A1A1;
  margin: 0;
  line-height: 1.4;
}

.balance-display-card {
  background-color: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.balance-display-card:hover {
  background: #111;
  transform: translateY(-1px);
}

.balance-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.balance-header i {
  color: #22C55E;
  font-size: 0.75rem;
}

.balance-info {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 0.625rem;
  color: #7A7A7A;
  font-weight: 500;
}

.balance-value-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.125rem;
}

.balance-value {
  font-size: 1rem;
  font-weight: bold;
  color: #DFDFDF;
}

.account-type-btn {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.real-btn {
  background-color: #22C55E;
  color: #000;
}

.real-btn:hover {
  background-color: #16A34A;
}

.demo-btn {
  background-color: #333;
  color: #A1A1A1;
}

.eye-toggle-btn {
  background: none;
  border: none;
  color: #A1A1A1;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.eye-toggle-btn:hover {
  color: #DFDFDF;
}

/* Main Content */
.main-content {
  margin-top: 70px;
  padding: 4rem 20px 1.5rem 20px;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

/* Support Section - ocupa máxima largura respeitando padding */
.support-section {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Search Container - ocupa máxima largura */
.search-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ajustes para cards ocuparem máxima largura */
#immediate-support .grid {
  width: 100% !important;
  max-width: 100% !important;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

#immediate-support .support-card {
  width: 100%;
  min-width: 0;
}

/* Barra de pesquisa ocupar toda largura */
#search-section .search-container {
  width: 100% !important;
  max-width: 100% !important;
}

#search-section .bg-zenix-card {
  width: 100% !important;
  max-width: 100% !important;
}

#search-section .flex {
  width: 100%;
}

#search-section input {
  width: 100%;
  flex: 1;
  min-width: 0;
}

/* Garantir que sections ocupem toda largura */
.support-section {
  width: 100%;
  max-width: 100%;
}

#faq-section {
  width: 100%;
  max-width: 100%;
}

/* Support Card Hover Effect */
.support-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.support-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* FAQ Item */
.faq-item {
  transition: all 0.3s ease;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.faq-answer.open {
  max-height: 500px;
  opacity: 1;
}

/* Search Suggestions */
.search-suggestions {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.search-suggestions.show {
  max-height: 300px;
  opacity: 1;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0E0E0E;
}

::-webkit-scrollbar-thumb {
  background: #1C1C1C;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2C2C2C;
}
</style>
