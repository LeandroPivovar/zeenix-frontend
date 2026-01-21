  <template>
    <div class="layout-copy-traders" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div
        v-if="isSidebarOpen && isMobile"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <AppSidebar 
        :is-open="isSidebarOpen" 
        :is-collapsed="isSidebarCollapsed"
        @toggle-collapse="toggleSidebarCollapse"
        @close-sidebar="closeSidebar"
      />
      <TopNavbar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        :balance="accountBalance"
        :account-type="isDemo ? 'demo' : 'real'"
        :currency="accountCurrency"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        @toggle-sidebar="toggleMobileSidebar"
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
  
      <div class="box" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <!-- Header Copy Trading -->
        <!-- Mobile Header Copy Trading (Config Mode) -->
        <div class="mb-6 md:hidden px-1 mt-4" v-if="!hasActiveSession">
          <div class="flex items-center justify-between gap-4">
            <div class="text-left">
              <h1 class="text-xl font-bold text-white mb-1">Configuração do Copy Trading</h1>
              <p class="text-[#A1A1AA] text-sm">Escolha traders e IAs para copiar, configure proporção e filtros, e replique operações automaticamente.</p>
            </div>
            <div class="shrink-0">
              <i class="fas fa-users text-[#4ade80] text-2xl"></i>
            </div>
          </div>
        </div>
      
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Carregando dados do Copy Trading...</p>
        </div>
      
        <!-- AI Vision Panel for Copy Trading -->
        <section v-else-if="activeTab === 'config' && !hasActiveSession && !isMobile" class="fade-in" style="margin-bottom: 1.5rem;">
          <!-- Desktop: AI Vision Panel -->
          <div class="ai-vision-panel-desktop">
            <div class="bg-zenix-card border-2 border-zenix-border rounded-xl p-6 premium-card glow-green ai-vision-container">
              <!-- Header Desktop -->
              <div class="mb-6">
                <div class="text-left">
                  <h1 class="text-xl font-bold text-zenix-text mb-1">Configuração do Copy Trading</h1>
                  <p class="text-sm text-zenix-secondary">Escolha traders e IAs para copiar, configure proporção e filtros, e replique operações automaticamente.</p>
                </div>
              </div>
              <div class="grid grid-cols-12 gap-5">
                <!-- AI Visualization Area -->
                <div class="col-span-5 h-[220px] overflow-hidden rounded-xl bg-gradient-to-br from-zenix-green/10 to-transparent border-2 border-zenix-green/30 flex items-center justify-center relative ai-visualization-area">
                  <div class="absolute inset-0 bg-gradient-to-br from-zenix-green/5 via-transparent to-zenix-green/10"></div>
                  <!-- Animated Grid Background -->
                  <div class="absolute inset-0 opacity-20">
                    <div id="i9dlnn" class="absolute inset-0"></div>
                  </div>
                  <!-- Central AI Core -->
                  <div class="relative z-10 flex items-center justify-center ai-core-mobile" style="width: 100%; height: 100%;">
                    <!-- Outer Rotating Ring -->
                    <div id="irazem" class="absolute w-40 h-40 border-2 border-zenix-green/30 rounded-full ai-glow-ring" style="opacity: 1;"></div>
                    <!-- Middle Rotating Ring -->
                    <div id="i5uptv" class="absolute w-32 h-32 border-2 border-zenix-green/40 rounded-full" style="opacity: 1;"></div>
                    <!-- Inner Pulsing Core -->
                    <div class="absolute w-24 h-24 bg-zenix-green/20 rounded-full blur-xl ai-pulse" style="opacity: 1;"></div>
                    <!-- Central Brain Icon -->
                    <div class="relative z-30 ai-brain-glow" style="display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-users text-zenix-green text-5xl" style="opacity: 1 !important; display: block !important; visibility: visible !important; font-size: 3rem !important;"></i>
                    </div>
                    <!-- Orbiting Data Nodes -->
                    <div id="iyljui" class="absolute w-3 h-3 bg-zenix-green rounded-full" style="opacity: 1;"></div>
                    <div id="isxtjr" class="absolute w-2 h-2 bg-zenix-green/70 rounded-full" style="opacity: 1;"></div>
                    <div id="ijse57" class="absolute w-2.5 h-2.5 bg-zenix-green/80 rounded-full" style="opacity: 1;"></div>
                  </div>
                  <!-- Floating Particles -->
                  <div class="absolute inset-0 overflow-hidden">
                    <div id="iw45yh" class="absolute w-1 h-1 bg-zenix-green rounded-full"></div>
                    <div id="i2cpbj" class="absolute w-1.5 h-1.5 bg-zenix-green/70 rounded-full"></div>
                    <div id="ispbex" class="absolute w-1 h-1 bg-zenix-green/60 rounded-full"></div>
                    <div id="i7wi6r" class="absolute w-1.5 h-1.5 bg-zenix-green rounded-full"></div>
                  </div>
                  <!-- Data Stream Lines -->
                  <div class="absolute inset-0 overflow-hidden opacity-30">
                    <div id="ivhu5o" class="absolute h-px w-20 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
                    <div id="iybi4e" class="absolute h-px w-16 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
                    <div id="icjipi" class="absolute h-px w-24 bg-gradient-to-r from-transparent via-zenix-green to-transparent"></div>
                  </div>
                </div>
                <!-- Status Cards -->
                <div class="col-span-7 grid grid-cols-2 gap-4 status-cards-container">
                  <!-- Card 1: CÓPIA -->
                  <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center justify-center text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <i class="fas fa-users text-[#22C55E] text-lg"></i>
                      <p class="text-[10px] text-white uppercase font-bold status-label">CÓPIA</p>
                    </div>
                    <p class="text-xs text-white status-value">Traders e IAs</p>
                    <p class="text-xs text-zenix-label mt-1 status-description">Escolha quem copiar</p>
                  </div>
                  <!-- Card 2: DIVERSIFICAR -->
                  <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center justify-center text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <i class="fas fa-layer-group text-[#22C55E] text-lg"></i>
                      <p class="text-[10px] text-white uppercase font-bold status-label">DIVERSIFICAR</p>
                    </div>
                    <p class="text-xs text-white status-value">Múltiplas Fontes</p>
                    <p class="text-xs text-zenix-label mt-1 status-description">Copie 3+ traders simultaneamente</p>
                  </div>
                  <!-- Card 3: AJUSTAR -->
                  <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center justify-center text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <i class="fas fa-sliders-h text-[#22C55E] text-lg"></i>
                      <p class="text-[10px] text-white uppercase font-bold status-label">AJUSTAR</p>
                    </div>
                    <p class="text-xs text-white status-value">Proporcional ao Saldo</p>
                    <p class="text-xs text-zenix-label mt-1 status-description">Ou valor fixo por operação</p>
                  </div>
                  <!-- Card 4: PROTEGER -->
                  <div class="bg-zenix-bg border-2 border-zenix-border rounded-xl p-4 hover-lift status-card-mobile flex flex-col items-center justify-center text-center">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <i class="fas fa-shield-alt text-[#22C55E] text-lg"></i>
                      <p class="text-[10px] text-white uppercase font-bold status-label">PROTEGER</p>
                    </div>
                    <p class="text-xs text-white status-value">Cópia Inteligente</p>
                    <p class="text-xs text-zenix-label mt-1 status-description">Gestão otimizada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mobile: Simple Header -->
          <div class="mobile-simple-header">
            <h1 class="mobile-header-title">Configuração do Copy Trading</h1>
            <p class="mobile-header-subtitle">Escolha traders e IAs para copiar, configure proporção e filtros, e replique operações automaticamente.</p>
          </div>
        </section>

        <CopyTradingConfig 
          v-if="activeTab === 'config' && !hasActiveSession" 
          @copy-activated="handleCopyActivated"
        />
        <CopyTradingMonitor 
          v-else-if="activeTab === 'monitor'"
          :session="activeSession"
          @pause-copy="handlePauseCopy"
        />
      </div>
      <DesktopBottomNav />
    </div>
  </template>
  
  <script>
  import AppSidebar from '../components/Sidebar.vue';
  import TopNavbar from '../components/TopNavbar.vue';
  import SettingsSidebar from '../components/SettingsSidebar.vue';
  import CopyTradingConfig from '../components/copy-traders/CopyTradingConfig.vue';
  import CopyTradingMonitor from '../components/copy-traders/CopyTradingMonitor.vue';
  import DesktopBottomNav from '../components/DesktopBottomNav.vue';
  import { loadAccountBalance } from '../utils/balanceLoader';
  
  export default {
    name: 'CopyTrading',
    components: {
      AppSidebar,
      TopNavbar,
      SettingsSidebar,
      CopyTradingConfig,
      CopyTradingMonitor,
      DesktopBottomNav
    },
    data() {
      return {
        activeTab: 'config',
        isSidebarOpen: true,
        isSidebarCollapsed: false,
        isSettingsOpen: false,
        isMobile: false,
        loading: true,
        hasActiveSession: false,
        activeSession: null,
        accountBalance: 0,
        accountCurrency: 'USD',
        accountLoginid: null,
        isDemo: false,
        balancesByCurrencyReal: {},
        balancesByCurrencyDemo: {}
      };
    },
    methods: {
      toggleMobileSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      closeSidebar() {
        if (this.isMobile) {
          this.isSidebarOpen = false;
        }
      },
      toggleSidebarCollapse() {
        if (!this.isMobile) {
          this.isSidebarCollapsed = !this.isSidebarCollapsed;
        }
      },
      toggleSettingsModal() {
        this.isSettingsOpen = !this.isSettingsOpen;
      },
      handleAccountTypeChange(type) {
        // Se receber evento do SettingsSidebar, recarregar a página para efetivar a troca
        // O próprio SettingsSidebar já faz o gerenciamento do localStorage e reload, 
        // mas se precisar de lógica extra, pode ser colocada aqui.
        // Como o SettingsSidebar faz reload, esse método pode nem ser chamado se o reload for imediato.
        // Se for apenas atualização de estado local:
        this.isDemo = type === 'demo';
      },
      checkMobile() {
        this.isMobile = window.innerWidth <= 1024;
        if (this.isMobile) {
          this.isSidebarOpen = false;
          this.isSidebarCollapsed = false;
        } else {
          this.isSidebarOpen = true;
        }
      },
      async loadAccountBalance() {
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
          console.error('[CopyTradersView] Erro ao carregar saldo:', error);
        }
      },
      async checkActiveSession() {
        this.loading = true;
        try {
          const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
          const response = await fetch(`${apiBase}/copy-trading/session/active`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const result = await response.json();
          
          if (result.success && result.data) {
            this.hasActiveSession = true;
            this.activeSession = result.data;
            this.activeTab = 'monitor';
          } else {
            this.hasActiveSession = false;
            this.activeSession = null;
            this.activeTab = 'config';
          }
        } catch (error) {
          console.error('Erro ao verificar sessão ativa:', error);
          this.hasActiveSession = false;
          this.activeSession = null;
          this.activeTab = 'config';
        } finally {
          this.loading = false;
        }
      },
      switchToConfig() {
        this.activeTab = 'config';
      },
      switchToMonitor() {
        // Permitir mudar para monitoramento mesmo sem sessão ativa (sem funcionalidade por enquanto)
        this.activeTab = 'monitor';
        
        // Se não houver sessão ativa, criar uma temporária para exibir a tela
        if (!this.hasActiveSession) {
          this.hasActiveSession = true;
          this.activeSession = { 
            id: 'temp', 
            status: 'active',
            traderName: 'Aguardando dados...'
          };
        }
      },
      async handleCopyActivated() {
        console.log('🔄 [CopyTradersView] Copy ativado, recarregando sessão...');
        
        // Aguardar um pouco para garantir que a sessão foi criada no banco
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Recarregar sessão ativa da API
        await this.checkActiveSession();
        
        // Mudar para aba de monitoramento
        this.activeTab = 'monitor';
        
        if (this.hasActiveSession && this.activeSession) {
          console.log('✅ [CopyTradersView] Sessão ativa carregada:', this.activeSession);
        } else {
          console.warn('⚠️ [CopyTradersView] Nenhuma sessão ativa encontrada após ativação');
        }
      },
      async handlePauseCopy() {
        // Pausar copy e atualizar estado
        try {
          const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
          const response = await fetch(`${apiBase}/copy-trading/pause`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const result = await response.json();
          
          if (result.success) {
            // Recarregar para atualizar estado
            await this.checkActiveSession();
          }
        } catch (error) {
          console.error('Erro ao pausar copy:', error);
        }
      },
    },
    async mounted() {
      await this.checkActiveSession();
      this.checkMobile();
      window.addEventListener('resize', this.checkMobile);
      // Carregar saldo em background
      this.loadAccountBalance();
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.checkMobile);
    },
  };
  </script>
  
  <style scoped>
  .layout-copy-traders {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #0b0b0a;
    color: #f0f6fc;
    font-family: 'Inter', sans-serif;
    padding: 0;
    width: calc(100% - 280px);
    margin-left: 280px;
    position: relative;
    transition: margin-left 0.3s ease, width 0.3s ease;
  }

  .layout-copy-traders.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }

  /* Overlay */
  .sidebar-overlay {
    display: none;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    inset: 0 !important;
    background-color: rgba(0, 0, 0, 0.7) !important;
    z-index: 9998 !important;
    backdrop-filter: blur(2px);
  }
  
  .box {
    width: 100%;
    padding: 70px 20px 10px 20px;
    margin: 0;
  }
  
  /* DesktopBottomNav fixed no copy trading */
  :deep(.desktop-bottom-nav) {
    position: fixed !important;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  /* --- Header --- */
  .header {
    margin-bottom: 30px;
    text-align: left;
  }
  
  .header h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .header p {
    color: #888;
    font-size: 14px;
  }
  
  /* --- Tabs --- */
  .tabs {
    display: flex;
    gap: 0;
    margin-bottom: 30px;
    border-bottom: 1px solid #222;
  }
  
  .tab {
    background: none;
    border: none;
    color: #888;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 15px;
    position: relative;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
  }
  
  .tab.active {
    color: #fff;
    border-bottom-color: #4ade80;
  }
  
  .tab:hover:not(.active) {
    color: #aaa;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #888;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #222;
    border-top-color: #4ade80;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes gridMove {
    0% { background-position: 0 0; }
    100% { background-position: 20px 20px; }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes orbit1 {
    0% { transform: rotate(0deg) translateX(5rem) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(5rem) rotate(-360deg); }
  }

  @keyframes orbit2 {
    0% { transform: rotate(0deg) translateX(4rem) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(4rem) rotate(-360deg); }
  }

  @keyframes orbit3 {
    0% { transform: rotate(0deg) translateX(3rem) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(3rem) rotate(-360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes streamRight {
    0% { left: -20px; opacity: 0; }
    50% { opacity: 1; }
    100% { left: 100%; opacity: 0; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes brainPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.9; }
  }

  @keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1); }
    50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2); }
  }

  .ai-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .ai-brain-glow {
    animation: brainPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
  }

  .ai-glow-ring {
    animation: ringPulse 2s ease-in-out infinite;
  }

  #irazem { animation: rotate 8s linear infinite; }
  #i5uptv { animation: rotate 6s linear infinite reverse; }
  #iyljui { animation: orbit1 4s linear infinite; }
  #isxtjr { animation: orbit2 5s linear infinite; }
  #ijse57 { animation: orbit3 6s linear infinite; }
  
  #iw45yh { animation: float 3s ease-in-out infinite; }
  #i2cpbj { animation: float 4s ease-in-out infinite 0.5s; }
  #ispbex { animation: float 3.5s ease-in-out infinite 1s; }
  #i7wi6r { animation: float 4.5s ease-in-out infinite 1.5s; }

  #ivhu5o { animation: streamRight 2s linear infinite; }
  #iybi4e { animation: streamRight 2.5s linear infinite 0.5s; }
  #icjipi { animation: streamRight 3s linear infinite 1s; }

  @media (max-width: 1024px) {
    .layout-copy-traders {
      width: 100% !important;
      margin-left: 0 !important;
      padding: 0;
      background: linear-gradient(to bottom, #102018 0%, #020403 50%, #000100 100%);
      position: relative;
    }
    
    .layout-copy-traders::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(10, 53, 25, 0.15) 0%, rgba(8, 36, 18, 0.05) 50%, transparent 80%);
      pointer-events: none;
      z-index: 0;
    }
    
    .box {
      position: relative;
      z-index: 1;
    }


    .sidebar-overlay {
      display: block !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100% !important;
      height: 100% !important;
      inset: 0 !important;
    }

    /* Sidebar no mobile */
    :deep(.sidebar) {
      position: fixed;
      width: 280px !important;
      height: 100vh;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease-out;
    }

    :deep(.sidebar.is-open) {
      transform: translateX(0);
    }

    /* Desktop/Mobile Header Visibility */
    .ai-vision-panel-desktop {
        display: none;
    }
    
    .mobile-simple-header {
        display: block;
        padding: 0;
    }
  }

  @media (max-width: 768px) {
    .box {
      padding: 80px 20px 110px 20px;
      margin: 0;
    }

    .header {
      margin-bottom: 20px !important;
      padding: 0 !important;
    }

    .header h1 {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .header p {
      font-size: 13px;
    }

    .tabs {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .tab {
      padding: 10px 16px;
      font-size: 14px;
      white-space: nowrap;
    }
  }

  /* Desktop/Mobile Header Visibility */
  .ai-vision-panel-desktop {
      display: block;
  }

  .mobile-simple-header {
      display: none;
  }

  .mobile-header-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
      text-align: left;
  }

  .mobile-header-subtitle {
      font-size: 0.875rem;
      color: #A1A1A1;
      line-height: 1.5;
      text-align: left;
  }
  
  </style>