<template>
    <div class="layout-copy-traders">
      <AppSidebar 
        :is-open="isSidebarOpen" 
        :is-collapsed="isSidebarCollapsed" 
        @toggle-collapse="toggleSidebarCollapse" 
      />
      <TopNavbar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        :balance="0"
        account-type="real"
      />
  
      <div class="box" style="margin-top: 60px;">
        <div class="header">
          <h1 v-if="hasActiveSession">Copy Trading — Acompanhar & Performance</h1>
          <h1 v-else>Copy Trading — Configuração Inicial</h1>
          <p v-if="hasActiveSession">Acompanhe suas operações e performance em tempo real.</p>
          <p v-else>Configure risco, alocação e proteção antes de iniciar o Copy automático.</p>
        </div>
      
        <div class="tabs" v-if="hasActiveSession || !loading">
          <button 
            :class="['tab', { active: activeTab === 'config' }]" 
            @click="switchToConfig"
            v-if="!hasActiveSession"
            :disabled="hasActiveSession"
          >
            Configurar
          </button>
          <button 
            :class="['tab', { active: activeTab === 'monitor' }]" 
            @click="switchToMonitor"
            v-if="hasActiveSession"
          >
            Acompanhar & Performance
          </button>
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
          v-else-if="activeTab === 'monitor' && hasActiveSession"
          :session="activeSession"
          @pause-copy="handlePauseCopy"
        />
      </div>
    </div>
  </template>
  
  <script>
  import AppSidebar from '../components/Sidebar.vue';
  import TopNavbar from '../components/TopNavbar.vue';
  import CopyTradingConfig from '../components/copy-traders/CopyTradingConfig.vue';
  import CopyTradingMonitor from '../components/copy-traders/CopyTradingMonitor.vue';
  
  export default {
    name: 'CopyTrading',
    components: {
      AppSidebar,
      TopNavbar,
      CopyTradingConfig,
      CopyTradingMonitor,
    },
    data() {
      return {
        activeTab: 'config',
        isSidebarOpen: true,
        isSidebarCollapsed: false,
        loading: true,
        hasActiveSession: false,
        activeSession: null,
      };
    },
    methods: {
      toggleSidebarCollapse() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
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
        if (this.hasActiveSession) {
          this.activeTab = 'monitor';
        }
      },
      async handleCopyActivated() {
        // Recarregar sessão ativa e redirecionar para monitoramento
        await this.checkActiveSession();
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
  }
  
  .box {
    width: 100%;
    padding: 20px;
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

  @media (max-width: 900px) {
    .layout-copy-traders {
      width: 100%;
      margin-left: 0;
      padding: 15px;
    }
  
    .header h1 {
      font-size: 20px;
    }
  
    .tabs {
      overflow-x: auto;
    }
  
    .tab {
      padding: 10px 16px;
      font-size: 14px;
      white-space: nowrap;
    }
  }
  </style>