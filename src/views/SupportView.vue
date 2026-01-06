<template>
  <div class="zenix-layout">
    <!-- Overlay para fechar sidebar em mobile -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'show': isMobileMenuOpen && isMobile }" 
      @click="closeMobileMenu"
    ></div>

    <!-- Sidebar -->
    <AppSidebar 
      :class="{ 'mobile-open': isMobileMenuOpen && isMobile }"
      :is-open="isSidebarOpen" 
      :is-collapsed="isSidebarCollapsed" 
      @toggle-collapse="toggleSidebarCollapse"
      @close-sidebar="closeMobileMenu"
    />

    <div class="main-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <TopNavbar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        :balance="accountBalance"
        :account-type="isDemo ? 'demo' : 'real'"
        :currency="accountCurrency"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        @account-type-changed="handleAccountTypeChange"
        @toggle-sidebar="toggleMobileMenu"
        @toggle-sidebar-collapse="toggleSidebarCollapse"
        @open-settings="toggleSettingsModal"
      />
      <SettingsSidebar
        :is-open="isSettingsOpen"
        :balance="accountBalance"
        :account-type="isDemo ? 'demo' : 'real'"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        @close="isSettingsOpen = false"
        @account-type-changed="handleAccountTypeChange"
      />
      <main class="main-content" style="margin-top: 60px;">
        <!-- Immediate Support Section -->
        <section id="immediate-support" class="support-section mb-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Chat Card -->
            <div class="support-card bg-zenix-card border border-zenix-border rounded-2xl p-8 min-h-[160px] flex flex-col mobile-card-gradient mobile-ticket-card">
              <div class="flex-1 flex flex-col desktop-layout">
                <div class="flex items-center space-x-3 mb-2">
                  <i class="far fa-comment-dots text-white text-2xl"></i>
                  <span class="px-2 py-1 bg-zenix-green/20 text-zenix-green text-[10px] font-bold rounded">Online agora</span>
                </div>
                <h3 class="text-white text-xl font-bold mb-1">Chat ao Vivo</h3>
                <p class="text-zenix-secondary text-sm mb-4">Suporte imediato com um atendente real.</p>
              </div>
              <div class="flex-1 flex flex-row items-center space-x-2.5 mobile-layout mobile-ticket-content">
                <div class="flex flex-col items-center">
                  <i class="far fa-comment-dots text-white text-3xl"></i>
                </div>
                <div class="flex-1 flex flex-col">
                  <h3 class="text-white text-lg font-bold text-left mobile-title-size">Chat ao Vivo</h3>
                  <p class="text-zenix-secondary text-sm text-left mobile-text-size">Suporte imediato com um atendente real.</p>
                </div>
              </div>
              <button 
                @click="startChat"
                class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3 rounded-lg transition-all mobile-chat-button mobile-ticket-button"
              >
                Iniciar Atendimento
              </button>
            </div>

            <!-- Ticket Card -->
            <div class="support-card bg-zenix-card border border-zenix-border rounded-2xl p-8 min-h-[160px] flex flex-col mobile-card-gradient mobile-ticket-card">
              <div class="flex-1 flex flex-col desktop-layout">
                <div class="mb-2">
                  <i class="far fa-file-alt text-white text-2xl"></i>
                </div>
                <h3 class="text-white text-xl font-bold mb-1">Abrir Ticket</h3>
                <p class="text-zenix-secondary text-sm mb-4">Resposta em até 24h úteis.</p>
              </div>
              <div class="flex-1 flex flex-row items-center space-x-2.5 mobile-layout mobile-ticket-content">
                <div class="flex flex-col items-center">
                  <i class="far fa-file-alt text-white text-3xl"></i>
                </div>
                <div class="flex-1 flex flex-col">
                  <h3 class="text-white text-lg font-bold text-left">Abrir Ticket</h3>
                  <p class="text-zenix-secondary text-sm text-left mobile-text-size">Resposta em até 24h úteis.</p>
                </div>
              </div>
              <button 
                @click="createTicket"
                class="w-full border-2 border-zenix-green text-zenix-green hover:bg-zenix-green hover:text-white font-semibold py-3 rounded-lg transition-all mobile-ticket-button"
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
          <h2 class="text-white text-2xl font-bold mb-8 mobile-faq-title">Perguntas Frequentes</h2>
          
          <div v-if="loading" class="text-center py-8 text-zenix-secondary">
            Carregando...
          </div>
          
          <div v-else-if="error" class="text-center py-8 text-zenix-red">
            {{ error }}
          </div>
          
          <div v-else class="space-y-4">
            <!-- Support Items (from support_items table) -->
            <div 
              v-for="item in supportItems" 
              :key="'item-' + item.id"
              class="faq-item bg-zenix-card border border-zenix-border rounded-xl overflow-hidden"
            >
              <button 
                @click="toggleFaq('item-' + item.id)"
                class="w-full faq-button flex items-center justify-between text-left hover:bg-zenix-bg/30 transition-all"
              >
                <span class="text-white font-semibold text-base text-left">{{ item.title }}</span>
                <i 
                  :class="[
                    'fas text-zenix-green text-sm transition-transform duration-300',
                    expandedFaqs['item-' + item.id] ? 'fa-minus rotate-180' : 'fa-plus'
                  ]"
                ></i>
              </button>
              <div 
                :class="[
                  'faq-answer text-left',
                  expandedFaqs['item-' + item.id] ? 'open' : ''
                ]"
              >
                <div 
                  v-if="item.subtitle" 
                  class="text-zenix-secondary text-sm text-left"
                  v-html="formatSupportItemContent(item.subtitle)"
                ></div>
                <div v-else class="text-zenix-secondary text-sm text-left">
                  Sem descrição disponível.
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </main>
    </div>
    <DesktopBottomNav />
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
  import TopNavbar from '../components/TopNavbar.vue'
  import SettingsSidebar from '../components/SettingsSidebar.vue'
  import { loadAccountBalance, reloadAccountBalance } from '../utils/balanceLoader'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'

export default {
  name: 'SupportView',
  components: {
    AppSidebar,
    TopNavbar,
    SettingsSidebar,
    DesktopBottomNav
  },
  data() {
    return {
      expandedFaqs: {},
      supportItems: [],
      searchQuery: '',
      loading: true,
      error: null,
      searchTimeout: null,
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isMobile: false,
      isMobileMenuOpen: false,
      showSuggestions: false,
      accountBalance: 0,
      accountCurrency: 'USD',
      accountLoginid: null,
      isDemo: false,
      balanceUpdateInterval: null,
      balancesByCurrencyReal: {},
      balancesByCurrencyDemo: {},
      searchSuggestions: [
        'Conectar corretora',
        'Erro de operação',
        'Copy Trading não inicia',
        'Pagamento / Assinatura',
        'Zenix Academy'
      ],
      isSettingsOpen: false
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
    handleAccountTypeChange(newAccountType) {
      // Alterna entre demo e real
      this.isDemo = newAccountType === 'demo';
      console.log('[SupportView] Tipo de conta alterado para:', this.isDemo ? 'demo' : 'real');
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },
    toggleSettingsModal() {
      this.isSettingsOpen = !this.isSettingsOpen
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
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
        const balanceData = await loadAccountBalance();
        if (balanceData) {
          this.accountBalance = balanceData.balance;
          this.accountCurrency = balanceData.currency;
          this.accountLoginid = balanceData.loginid;
          this.isDemo = balanceData.isDemo;
          this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
          this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
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
        // Usar reloadAccountBalance para forçar atualização (ignora cache)
        reloadAccountBalance().then(balanceData => {
          if (balanceData) {
            this.accountBalance = balanceData.balance;
            this.accountCurrency = balanceData.currency;
            this.accountLoginid = balanceData.loginid;
            this.isDemo = balanceData.isDemo;
            this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
            this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
          }
        }).catch(error => {
          console.error('[SupportView] Erro ao atualizar saldo:', error);
        });
      }, 30000);
    },
    stopBalanceUpdates() {
      if (this.balanceUpdateInterval) {
        clearInterval(this.balanceUpdateInterval);
        this.balanceUpdateInterval = null;
      }
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
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        
        // Buscar apenas Support Items
        const itemsRes = await fetch(`${apiBaseUrl}/support/items`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json()
          this.supportItems = itemsData || []
        } else {
          this.supportItems = []
        }
        
        // Não buscar mais FAQs
        this.faqs = []
      } catch (err) {
        console.error('Erro ao buscar itens de suporte:', err)
        this.error = 'Não foi possível carregar as perguntas frequentes.'
        this.faqs = []
        this.supportItems = []
        this.loading = false
      } finally {
        this.loading = false
      }
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
      // A busca também filtra os support items através do título
      // Os support items são buscados junto com os FAQs
    },
    startChat() {
      this.$root.$toast.info('Funcionalidade de chat ao vivo será implementada em breve')
      // Aqui você pode integrar com um sistema de chat real
    },
    createTicket() {
      this.$root.$toast.info('Funcionalidade de criação de ticket será implementada em breve')
      // Aqui você pode abrir um modal ou redirecionar para criação de ticket
    },
    formatSupportItemContent(subtitle) {
      if (!subtitle) return 'Sem descrição'
      // Processar imagens para garantir URLs corretas
      // O NestJS serve arquivos estáticos em /api/uploads/ devido ao prefixo global
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      
      // Substituir caminhos relativos de imagens por URLs completas
      // O baseUrl já inclui /api, então usamos diretamente
      let content = subtitle.replace(/src="\/uploads\//g, `src="${baseUrl}/uploads/`)
      
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
  margin: 0;
  padding: 0;
  background-color: #0B0B0B;
  color: #DFDFDF;
  font-family: 'Inter', sans-serif;
  width: 100%;
  overflow-x: hidden;
}

.main-content-wrapper {
  margin: 0;
  margin-left: 280px;
  padding: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease, width 0.3s ease;
  width: calc(100% - 280px);
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
  left: 280px;
  z-index: 40;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  width: 100%;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
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

/* Ajustes para cards ocuparem máxima largura - DESKTOP */
@media (min-width: 768px) {
  #immediate-support .grid {
    width: 100% !important;
    max-width: 100% !important;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
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
  max-height: none;
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

/* Support Items HTML Content Styles */
.faq-answer img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 10px 0;
  display: block;
}

.faq-answer p {
  margin: 8px 0;
}

.faq-answer ul, .faq-answer ol {
  margin: 8px 0;
  padding-left: 20px;
}

.faq-answer li {
  margin: 4px 0;
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

/* MOBILE MENU & RESPONSIVIDADE */
/* Botão Hambúrguer (Mobile Only) */

/* Overlay Escuro */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
  z-index: 45;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 768px) {
  /* Mostra hambúrguer */

  /* Conteúdo Principal expande 100% */
  .main-content-wrapper,
  .main-content-wrapper.sidebar-collapsed {
    margin-left: 0 !important;
    width: 100% !important;
  }

  /* Sidebar vira gaveta (Drawer) - APENAS NO MOBILE */
  .zenix-layout .sidebar {
    position: fixed !important;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 280px !important;
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
    background-color: #0B0B0B;
  }

  /* Classe ativa para abrir menu - APENAS NO MOBILE */
  .zenix-layout .sidebar.mobile-open {
    transform: translateX(0);
    z-index: 10000 !important;
  }

  /* Ajustes de padding no mobile - manter mesma posição */
  .main-content {
    padding: 1rem 15px !important;
    margin-top: 60px !important;
    padding-top: 1rem !important;
    background: linear-gradient(to bottom, #102018 0%, #020403 50%, #000100 100%) !important;
    background-blend-mode: normal;
    position: relative;
    min-height: calc(100vh - 60px);
    padding-bottom: 100px;
  }

  .main-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(10, 53, 25, 0.15) 0%, rgba(8, 36, 18, 0.05) 50%, transparent 80%);
    border-radius: 1rem;
    pointer-events: none;
    z-index: 0;
  }

  .main-content > * {
    position: relative;
    z-index: 1;
  }

  /* Garantir que os cards fiquem empilhados no mobile */
  #immediate-support .grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }

  /* Esconder layout desktop e mostrar mobile */
  .desktop-layout {
    display: none !important;
  }

  .mobile-layout {
    display: flex !important;
  }

  /* Esconder "Online agora" no mobile */
  .mobile-layout .fa-comment-dots {
    margin-bottom: 0 !important;
  }

  /* Remover margins das sections no mobile */
  .support-section {
    margin-bottom: 0 !important;
  }

  /* Espaçamento da seção search no mobile (deve vir depois para ter prioridade) */
  .mobile-search-section {
    margin-top: 1rem !important;
    margin-bottom: 2rem !important;
  }

  /* Garantir que a search section tenha o espaçamento correto, sobrescrevendo mb-16 */
  #search-section.mobile-search-section,
  #search-section.support-section {
    margin-top: 1rem !important;
    margin-bottom: 2rem !important;
  }

  /* Aumentar padding dos cards no mobile (10px a mais) */
  .support-card {
    padding: 1.5rem !important; /* 24px - aumentou 10px de 0.875rem (14px) */
    min-height: auto !important;
  }

  /* Aumentar margin-top e margin-bottom do card Abrir Ticket em 0.5rem */
  .mobile-ticket-card {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }

  /* Espaçamento entre texto e botão no card Abrir Ticket */
  .mobile-ticket-content {
    margin-bottom: 0.75rem !important;
  }

  .mobile-ticket-button {
    margin-top: 0.75rem !important;
  }

  /* Remover margin do título no mobile */
  .mobile-layout h3 {
    margin-bottom: 0 !important;
  }

  /* Aumentar bem pouco a fonte do texto no mobile */
  .mobile-text-size {
    font-size: 0.9375rem !important; /* 15px - um pouco maior que text-sm (14px) */
  }

  /* Aumentar um pouco a fonte de Perguntas Frequentes no mobile */
  .mobile-faq-title {
    font-size: 1.5rem !important; /* 24px - um pouco maior que text-2xl (20px) */
  }

  /* Gradiente nos cards no mobile (igual ao AgenteAutonomo) */
  .mobile-card-gradient {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
    position: relative;
  }

  /* Botão Iniciar Atendimento verde com texto preto no mobile */
  .mobile-chat-button {
    background-color: #22C55E !important;
    color: #000000 !important;
  }

  .mobile-chat-button:hover {
    background-color: #16A34A !important;
    color: #000000 !important;
  }
}

/* Desktop: manter layout original */
@media (min-width: 769px) {
  .desktop-layout {
    display: flex !important;
  }

  .mobile-layout {
    display: none !important;
  }
}

/* GARANTIR QUE NO DESKTOP O SIDEBAR CONTINUE NORMAL */
@media (min-width: 769px) {
  .zenix-layout .sidebar {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    transform: none !important;
    width: 280px !important;
  }
  
  .zenix-layout .sidebar.mobile-open {
    transform: none !important;
  }
  
  
  .sidebar-overlay {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }

  /* Remover gradiente e estilos mobile no desktop */
  .mobile-card-gradient {
    background: inherit !important;
  }

  .mobile-card-gradient::before {
    display: none !important;
  }

  .mobile-chat-button {
    background-color: #22C55E !important;
    color: #FFFFFF !important;
  }

  .mobile-chat-button:hover {
    background-color: #16A34A !important;
  }
}
</style>
