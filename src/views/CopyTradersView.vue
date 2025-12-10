  <template>
    <div class="layout-copy-traders">
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
        :balance="0"
        account-type="real"
        @toggle-sidebar="toggleMobileSidebar"
      />
  
      <div class="box">
        <div class="header">
          <h1 v-if="hasActiveSession">Copy Trading - Performance</h1>
          <h1 v-else>Copy Trading — Configuração Inicial</h1>
          <p v-if="hasActiveSession">Acompanhe a perfomance do seu copy em tempo real</p>
          <p v-else>Configure risco, alocação e proteção antes de iniciar o Copy automático.</p>
        </div>
      
      
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Carregando dados do Copy Trading...</p>
        </div>
      
        <CopyTradingConfig 
          v-else-if="activeTab === 'config' && !hasActiveSession" 
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
  import CopyTradingConfig from '../components/copy-traders/CopyTradingConfig.vue';
  import CopyTradingMonitor from '../components/copy-traders/CopyTradingMonitor.vue';
  import DesktopBottomNav from '../components/DesktopBottomNav.vue';
  
  export default {
    name: 'CopyTrading',
    components: {
      AppSidebar,
      TopNavbar,
      CopyTradingConfig,
      CopyTradingMonitor,
      DesktopBottomNav
    },
    data() {
      return {
        activeTab: 'config',
        isSidebarOpen: true,
        isSidebarCollapsed: false,
        isMobile: false,
        loading: true,
        hasActiveSession: false,
        activeSession: null,
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
      checkMobile() {
        this.isMobile = window.innerWidth <= 1024;
        if (this.isMobile) {
          this.isSidebarOpen = false;
          this.isSidebarCollapsed = false;
        } else {
          this.isSidebarOpen = true;
        }
      },
      async checkActiveSession() {
        this.loading = true;
        try {
          const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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
          const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 0;
    width: calc(100% - 280px);
    margin-left: 280px;
    position: relative;
    transition: margin-left 0.3s ease, width 0.3s ease;
  }

  /* Overlay */
  .sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 998;
    backdrop-filter: blur(2px);
  }
  
  .box {
    width: 100%;
    padding: 10px 20px;
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
    margin-bottom: 8px;
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
    
    .layout-copy-traders > * {
      position: relative;
      z-index: 1;
    }


    .sidebar-overlay {
      display: block;
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
  }

  @media (max-width: 768px) {
    .box {
      padding: 10px 20px;
      margin: 0;
    }

    .header {
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 20px;
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
  </style>