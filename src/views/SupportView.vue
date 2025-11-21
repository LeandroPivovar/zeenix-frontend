<template>
  <div class="bg-zenix-bg min-h-screen font-inter text-zenix-text">
    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarIsOpen && isMobile"
      class="fixed inset-0 bg-black/50 z-40"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <AppSidebar :is-open="sidebarIsOpen" @close-sidebar="closeSidebar" />

    <!-- Main Content -->
    <div class="lg:ml-[240px] min-h-screen flex flex-col transition-all duration-300">
      <main class="flex-1 py-16 px-4 lg:px-12">
        
        <!-- Immediate Support Section -->
        <section id="immediate-support" class="max-w-7xl mx-auto mb-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Chat Card -->
            <div class="support-card bg-zenix-card border border-zenix-border rounded-2xl p-8 h-[160px] flex flex-col justify-between">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-3 mb-2">
                    <i class="far fa-comment-dots text-white text-2xl"></i>
                    <span class="px-2 py-1 bg-zenix-green/20 text-zenix-green text-[10px] font-bold rounded">Online agora</span>
                  </div>
                  <h3 class="text-white text-xl font-bold mb-1">Chat ao Vivo</h3>
                  <p class="text-zenix-secondary text-sm">Suporte imediato com um atendente real</p>
                </div>
              </div>
              <button 
                @click="startChat"
                class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-semibold py-3 rounded-lg transition-all"
              >
                Iniciar Atendimento
              </button>
            </div>

            <!-- Ticket Card -->
            <div class="support-card bg-zenix-card border border-zenix-border rounded-2xl p-8 h-[160px] flex flex-col justify-between">
              <div class="flex items-start justify-between">
                <div>
                  <div class="mb-2">
                    <i class="far fa-life-ring text-white text-2xl"></i>
                  </div>
                  <h3 class="text-white text-xl font-bold mb-1">Abrir Ticket</h3>
                  <p class="text-zenix-secondary text-sm">Resposta em até 24h úteis</p>
                </div>
              </div>
              <button 
                @click="createTicket"
                class="w-full border-2 border-zenix-green text-zenix-green hover:bg-zenix-green hover:text-white font-semibold py-3 rounded-lg transition-all"
              >
                Criar Ticket
              </button>
            </div>
          </div>
        </section>

        <!-- Search Section -->
        <section id="search-section" class="max-w-7xl mx-auto mb-16">
          <div class="max-w-3xl mx-auto relative">
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
        <section id="faq-section" class="max-w-7xl mx-auto mb-16">
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
      sidebarIsOpen: false,
      isMobile: false,
      showSuggestions: false,
      searchSuggestions: [
        'Conectar corretora',
        'Erro de operação',
        'Copy Trading não inicia',
        'Pagamento / Assinatura',
        'Zenix Academy'
      ]
    }
  },
  mounted() {
    this.fetchFaqs()
    window.addEventListener('resize', this.checkMobile)
    this.checkMobile()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen
    },
    closeSidebar() {
      this.sidebarIsOpen = false
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
      alert('Funcionalidade de chat ao vivo será implementada em breve')
      // Aqui você pode integrar com um sistema de chat real
    },
    createTicket() {
      alert('Funcionalidade de criação de ticket será implementada em breve')
      // Aqui você pode abrir um modal ou redirecionar para criação de ticket
    }
  }
}
</script>

<style scoped>
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
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
