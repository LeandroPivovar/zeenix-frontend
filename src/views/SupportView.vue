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

        <!-- Support Items Section -->
        <section id="support-items-section" class="support-section mb-16">
          <h2 class="text-white text-2xl font-bold mb-8">Guias e Tutoriais</h2>
          
          <div v-if="loadingItems" class="text-center py-8 text-zenix-secondary">
            Carregando...
          </div>
          
          <div v-else-if="supportItemsError" class="text-center py-8 text-zenix-red">
            {{ supportItemsError }}
          </div>
          
          <div v-else-if="supportItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="item in supportItems" 
              :key="item.id"
              class="support-item-card bg-zenix-card border border-zenix-border rounded-xl overflow-hidden hover:border-zenix-green transition-all cursor-pointer"
              @click="toggleSupportItem(item.id)"
            >
              <div class="p-6">
                <h3 class="text-white text-lg font-bold mb-2">{{ item.title }}</h3>
                <div 
                  v-if="expandedSupportItems[item.id]"
                  class="support-item-content text-zenix-secondary text-sm mt-4"
                  v-html="formatSupportItemContent(item.subtitle)"
                ></div>
                <div v-else class="text-zenix-secondary text-sm line-clamp-2" v-html="getSupportItemPreview(item.subtitle)"></div>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-zenix-secondary text-xs">{{ formatDate(item.createdAt) }}</span>
                  <i 
                    :class="[
                      'fas text-zenix-green text-sm transition-transform duration-300',
                      expandedSupportItems[item.id] ? 'fa-chevron-up' : 'fa-chevron-down'
                    ]"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-zenix-secondary">
            Nenhum guia disponível no momento.
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
                class="w-full faq-button flex items-center justify-between text-left hover:bg-zenix-bg/30 transition-all"
              >
                <span class="text-white font-semibold text-base text-left">{{ faq.question }}</span>
                <i 
                  :class="[
                    'fas text-zenix-green text-sm transition-transform duration-300',
                    expandedFaqs[faq.id] ? 'fa-minus rotate-180' : 'fa-plus'
                  ]"
                ></i>
              </button>
              <div 
                :class="[
                  'faq-answer text-left',
                  expandedFaqs[faq.id] ? 'open' : ''
                ]"
              >
                <div v-if="Array.isArray(faq.answer)" class="text-zenix-secondary text-sm space-y-2 text-left">
                  <ul class="list-disc list-inside space-y-2 text-left">
                    <li v-for="(item, index) in faq.answer" :key="index" class="text-left">{{ item }}</li>
                  </ul>
                </div>
                <div v-else class="text-zenix-secondary text-sm text-left">
                  {{ faq.answer }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer id="footer" class="zenix-footer">
        <div class="footer-content">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="footer-logo-main">ZENIX</span>
                <span class="footer-logo-sub">PRO</span>
              </div>
              <p class="footer-description">
                Plataforma inteligente de investimentos com IA, copy trading e automação.
              </p>
              <div class="footer-social">
                <a href="#" class="social-icon"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-linkedin"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-youtube"></i></a>
              </div>
            </div>

            <div class="footer-column">
              <h3 class="footer-column-title">Produto</h3>
              <ul class="footer-links">
                <li><a href="#">IA de Investimento</a></li>
                <li><a href="#">Copy Trading</a></li>
                <li><a href="#">Agente Autônomo</a></li>
                <li><a href="#">Zenix Academy</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3 class="footer-column-title">Empresa</h3>
              <ul class="footer-links">
                <li><a href="#">Sobre Nós</a></li>
                <li><a href="#">Planos</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carreiras</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h3 class="footer-column-title">Suporte</h3>
              <ul class="footer-links">
                <li><a href="#">Central de Ajuda</a></li>
                <li><a href="#">Documentação</a></li>
                <li><a href="#">Status do Sistema</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p class="footer-copyright">© 2025 Zenix Pro. Todos os direitos reservados.</p>
            <div class="footer-legal">
              <a href="#">Política de Privacidade</a>
              <span class="footer-separator">|</span>
              <a href="#">Termos de Uso</a>
              <span class="footer-separator">|</span>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
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
      supportItems: [],
      expandedSupportItems: {},
      searchQuery: '',
      loading: true,
      loadingItems: true,
      error: null,
      supportItemsError: null,
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
    this.fetchSupportItems()
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
    },
    async fetchSupportItems() {
      this.loadingItems = true
      this.supportItemsError = null
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${apiBaseUrl}/support/items`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) throw new Error('Erro ao buscar itens de suporte')
        const data = await res.json()
        this.supportItems = data
      } catch (err) {
        console.error('Erro ao buscar itens de suporte:', err)
        this.supportItemsError = 'Não foi possível carregar os guias e tutoriais.'
        this.supportItems = []
      } finally {
        this.loadingItems = false
      }
    },
    toggleSupportItem(id) {
      this.expandedSupportItems = {
        ...this.expandedSupportItems,
        [id]: !this.expandedSupportItems[id]
      }
    },
    getSupportItemPreview(subtitle) {
      if (!subtitle) return 'Sem descrição'
      // Remove tags HTML e limita a 100 caracteres
      const text = subtitle.replace(/<[^>]*>/g, '').trim()
      return text.length > 100 ? text.substring(0, 100) + '...' : text
    },
    formatSupportItemContent(subtitle) {
      if (!subtitle) return 'Sem descrição'
      // Processar imagens para garantir URLs corretas
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      const apiBase = baseUrl.replace('/api', '')
      
      // Substituir caminhos relativos de imagens por URLs completas
      let content = subtitle.replace(/src="\/uploads\//g, `src="${apiBase}/uploads/`)
      
      // Garantir que imagens tenham estilo responsivo
      content = content.replace(/<img/g, '<img style="max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 4px;"')
      
      return content
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
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

.faq-button {
  padding: 1.25rem 2rem;
  text-align: left !important;
}

.faq-item button span {
  text-align: left !important;
  display: block;
  width: 100%;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  text-align: left !important;
  padding: 0 2rem 1.25rem 2rem;
}

.faq-answer.open {
  max-height: 500px;
  opacity: 1;
}

.faq-answer > div {
  text-align: left !important;
}

.faq-answer ul {
  text-align: left !important;
}

.faq-answer li {
  text-align: left !important;
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

/* Footer */
.zenix-footer {
  background-color: #0B0B0B;
  border-top: 1px solid #1C1C1C;
  margin-top: 3rem;
  width: 100%;
}

.footer-content {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 20px;
  box-sizing: border-box;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  grid-column: span 1;
}

.footer-logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.footer-logo-main {
  font-size: 1.125rem;
  font-weight: 600;
  color: #DFDFDF;
}

.footer-logo-sub {
  font-size: 0.75rem;
  color: #A1A1A1;
}

.footer-description {
  color: #A1A1A1;
  font-size: 0.75rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.social-icon {
  color: #A1A1A1;
  transition: color 0.2s;
  opacity: 0.5;
}

.social-icon:hover {
  color: #DFDFDF;
}

.footer-column-title {
  color: #DFDFDF;
  font-weight: 500;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer-links a {
  color: #A1A1A1;
  font-size: 0.75rem;
  text-decoration: none;
  transition: color 0.2s;
  opacity: 0.6;
}

.footer-links a:hover {
  color: #DFDFDF;
}

.footer-bottom {
  border-top: 1px solid #1A1A1A;
  padding-top: 2rem;
  opacity: 0.4;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer-copyright {
  color: #A1A1A1;
  font-size: 0.75rem;
}

.footer-legal {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.75rem;
}

.footer-legal a {
  color: #A1A1A1;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-legal a:hover {
  color: #DFDFDF;
}

.footer-separator {
  color: #1C1C1C;
}

/* Support Items Styles */
.support-item-card {
  transition: all 0.3s ease;
}

.support-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.1);
}

.support-item-content {
  animation: fadeIn 0.3s ease;
}

.support-item-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 10px 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Footer */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    padding: 2rem 15px;
  }
}
</style>
