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
          <h1>Copy Trading — Configuração Inicial</h1>
          <p>Configure risco, alocação e proteção antes de iniciar o Copy automático.</p>
        </div>
      
        <div class="tabs">
          <button 
            :class="['tab', { active: activeTab === 'config' }]" 
            @click="activeTab = 'config'"
          >
            Configurar
          </button>
          <button 
            :class="['tab', { active: activeTab === 'monitor' }]" 
            @click="activeTab = 'monitor'"
          >
            Acompanhar & Performance
          </button>
        </div>
      
        <CopyTradingConfig v-if="activeTab === 'config'" />
        <CopyTradingMonitor v-if="activeTab === 'monitor'" />
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
      };
    },
    methods: {
      toggleSidebarCollapse() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      },
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
    width: calc(100% - 320px);
    margin-left: 320px;
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