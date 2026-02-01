<template>
  <div class="zenix-layout">
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />

    <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }" style="padding-left: 0 !important;">
      <TopNavbar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        :balance="currentBalance?.balance || info?.balance"
        :account-type="accountType"
        @open-settings="toggleSettingsModal"
        @account-type-changed="handleAccountTypeChange"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        :currency-prefix="preferredCurrencyPrefix"
        @toggle-sidebar="handleHamburgerClick"
        @toggle-sidebar-collapse="toggleSidebarCollapse"
      />
      
      <!-- Settings Sidebar -->
      <SettingsSidebar
        :is-open="showSettingsModal"
        :balance="info?.balance"
        :account-type="accountType"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        :currency-prefix="preferredCurrencyPrefix"
        @close="closeSettingsModal"
        @account-type-changed="handleAccountTypeChange"
      />

      <main class="main-content">
        <!-- Mobile Header (only visible on mobile) -->
        <div class="mobile-header mobile-only">
          <h1 class="mobile-title">{{ mobileTitle }}</h1>
          <p class="mobile-subtitle">{{ mobileSubtitle }}</p>
        </div>

        <div class="desktop-only" style="text-align: left; padding: 10px 38px 0px 38px; width: 100%;">
          <h1 class="text-xl text-[#FAFAFA] font-bold">Operação Manual</h1>
          <p class="text-sm text-[#A1A1AA] mt-0 max-w-2xl">
            Opere manualmente com controle total. Use nossas ferramentas de análise para identificar padrões e executar estratégias com precisão.
          </p>
        </div>
        <div class="view-toggle-bar-wrapper">
          <div class="view-toggle-bar">
            <button
              class="px-6 py-3 bg-zenix-card text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300 desktop-only"
              :class="{ 'border-b-2 border-zenix-green text-zenix-text font-semibold shadow-[0_0_8px_rgba(0,0,0,0.25)]': currentView === 'OperationChart' && activeSubTab === 'chart', 'border-b-2 border-transparent text-[#7A7A7A]': currentView !== 'OperationChart' || activeSubTab !== 'chart' }"
              @click="changeView('OperationChart')"
            >
              <span class="desktop-text">Análise gráfica</span>
              <span class="mobile-text">Gráfico</span>
            </button>
            <button
              class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
              :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationChart' && activeSubTab === 'digits', 'border-b-2 border-transparent': currentView !== 'OperationChart' || activeSubTab !== 'digits' }"
              @click="changeView('OperationDigits')"
            >
              <span class="desktop-text">Análise de dígitos</span>
              <span class="mobile-text">Dígitos</span>
            </button>
            <button
              class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
              :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationLogs', 'border-b-2 border-transparent': currentView !== 'OperationLogs' }"
              @click="changeView('OperationLogs')"
            >
              <span class="desktop-text">Registro</span>
              <span class="mobile-text">Histórico</span>
            </button>
            <button
              class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
              :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationLastOrders', 'border-b-2 border-transparent': currentView !== 'OperationLastOrders' }"
              @click="changeView('OperationLastOrders')"
            >
              <span class="desktop-text">Últimas Ordens</span>
              <span class="mobile-text">Registros</span>
            </button>
          </div>
        </div>

        <div class="operation-content">
          <component
            :is="currentView"
            ref="operationComponent"
            :account-balance="accountBalanceFormatted"
            :account-balance-value="accountBalanceValue"
            :account-currency="accountCurrency"
            :preferred-currency="preferredCurrency"
            :account-loginid="accountLoginId"
            :order-config="orderConfig"
            :trade-results="lastOrdersFormatted"
            @trade-result="handleTradeResult"
            @tab-changed="activeSubTab = $event"
          ></component>
        </div>
      </main>
    </div>
    <DesktopBottomNav />
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import SettingsSidebar from '../components/SettingsSidebar.vue';
import OperationChart from '../components/OperationChart.vue';
import OperationDigits from '../components/OperationDigits.vue';
import OperationLogs from '../components/OperationLogs.vue';
import OperationLastOrders from '../components/OperationLastOrders.vue';
import DesktopBottomNav from '../components/DesktopBottomNav.vue';
import accountBalanceMixin from '../mixins/accountBalanceMixin';
import { loadAvailableAccounts } from '../utils/accountsLoader';

export default {
  name: 'OperationView',
  mixins: [accountBalanceMixin],
  components: {
    AppSidebar,
    TopNavbar,
    SettingsSidebar,
    OperationChart,
    OperationDigits,
    OperationLogs,
    OperationLastOrders,
    DesktopBottomNav
  },
  data() {
    return {
      currentView: 'OperationChart',
      accountBalanceValue: null,
      accountCurrency: null,
      preferredCurrency: 'USD',
      accountLoginId: null,
      orderConfig: {
        type: 'Up/Down',
        time: '1 Minuto',
        value: 10.0,
      },
      lastOrders: [],
      isSidebarOpen: false,
      isSidebarCollapsed: true, // Começa recolhido
      showDevModal: false,
      loadingConnection: false,
      accountType: 'real', // 'real' ou 'demo'
      isMobile: false,
      showSettingsModal: false,
      isComponentDestroyed: false, // Flag para verificar se componente foi destruído
      updateQueue: [], // Fila de atualizações pendentes
      isProcessingUpdates: false, // Flag para evitar processamento simultâneo
      balancesByCurrencyReal: {},
      balancesByCurrencyDemo: {},
      tradeCurrency: 'USD', // 'USD' ou 'DEMO'
      availableAccounts: [],
      loadingAccounts: false,
      activeSubTab: 'chart', // 'chart' ou 'digits'
    };
  },
  computed: {
    accountBalanceFormatted() {
      if (this.accountBalanceValue == null) return '---';
      return this.formatCurrency(this.accountBalanceValue, this.accountCurrency);
    },
    preferredCurrencyPrefix() {
      if (this.preferredCurrency === 'DEMO') {
        return 'D$';
      }
      return this.getCurrencyPrefix(this.accountCurrency || 'USD');
    },
    lastOrdersFormatted() {
      if (!this.lastOrders || !Array.isArray(this.lastOrders)) {
        return [];
      }
      return this.lastOrders.map(order => {
        const displayValue =
          order.buyPrice != null || order.entryPrice != null || order.price != null
            ? this.formatCurrency(order.buyPrice || order.entryPrice || order.price, order.currency || this.accountCurrency)
            : '--';
        const displayProfit =
          order.profit != null
            ? this.formatCurrency(order.profit, order.currency || this.accountCurrency)
            : '--';
        return {
          ...order,
          displayValue,
          displayProfit,
          value: displayValue,
          result: order.status || order.result || 'EXECUTED',
        };
      });
    },
    mobileTitle() {
      const titles = {
        'OperationChart': 'Operação Manual com Sinais',
        'OperationDigits': 'Operação Manual com Sinais',
        'OperationLogs': 'Histórico de Operações',
        'OperationLastOrders': 'Registros'
      };
      return titles[this.currentView] || 'Operação Manual com Sinais';
    },
    mobileSubtitle() {
      const subtitles = {
        'OperationChart': 'Análise gráfica e execução de operações manuais em tempo real.',
        'OperationDigits': 'Análise gráfica e execução de operações manuais em tempo real.',
        'OperationLogs': 'Últimas operações realizadas',
        'OperationLastOrders': 'Últimos eventos do sistema e do usuário'
      };
      return subtitles[this.currentView] || 'Análise gráfica e execução de operações manuais em tempo real.';
    },
  },
  methods: {
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleMobileSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    openDevModal() {
      this.showDevModal = true;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024;
      // Removido o switch forçado entre OperationChart e OperationDigits no mobile
      // pois agora a análise de dígitos está integrada no Gráfico.
    },
    handleAccountTypeChange(newAccountType) {
        console.log('[OperationView] Tipo de conta alterado via componente filho para:', newAccountType);
        this.accountType = newAccountType;
        // NÃO chamar switchAccount() pois o componente filho (Sidebar/Navbar) já faz o reload.
    },

    async loadAvailableAccounts() {
        this.loadingAccounts = true;
        try {
            const accounts = await loadAvailableAccounts();
            this.availableAccounts = accounts;
        } catch (error) {
            console.error('[OperationView] Erro ao carregar contas:', error);
            this.availableAccounts = [];
        } finally {
            this.loadingAccounts = false;
        }
    },

    async switchAccount(type) {
        try {
            const isDemo = type === 'demo';
            const tradeCurrency = isDemo ? 'DEMO' : 'USD';
            
            // Tentar encontrar uma conta correspondente no cache de contas disponíveis
            const matchingAccount = this.availableAccounts.find(acc => acc.isDemo === isDemo);
            
            const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
            const token = localStorage.getItem('token');
            
            if (matchingAccount) {
                console.log(`[OperationView] Sincronizando conta ${type} com token: ${matchingAccount.loginid}`);
                
                // Usar o endpoint unificado que salva token E moeda
                const response = await fetch(`${apiBase}/settings/deriv-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        token: matchingAccount.token,
                        tradeCurrency: tradeCurrency
                    })
                });

                if (response.ok) {
                    // Atualizar localStorage local para manter consistência imediata
                    localStorage.setItem('deriv_token', matchingAccount.token);
                    localStorage.setItem('trade_currency', tradeCurrency);
                    
                    this.tradeCurrency = tradeCurrency;
                    this.accountType = type;
                    
                    console.log('[OperationView] ✅ Conta e token sincronizados com sucesso');
                    window.location.reload();
                    return;
                }
            }

            // Fallback: se não encontrar conta específica ou falhar, tentar atualizar apenas a moeda
            console.warn('[OperationView] ⚠️ Nenhuma conta correspondente encontrada ou falha no sync, tentando apenas moeda...');
            const response = await fetch(`${apiBase}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tradeCurrency: tradeCurrency
                })
            });

            if (response.ok) {
                localStorage.setItem('trade_currency', tradeCurrency);
                this.tradeCurrency = tradeCurrency;
                this.accountType = type;
                window.location.reload();
            } else {
                throw new Error('Erro ao alterar conta');
            }
        } catch (error) {
            console.error('[OperationView] Erro ao alterar moeda:', error);
            await alert('Erro ao alterar moeda. Tente novamente.');
        }
    },
    formatCurrency(value, currency) {
      try {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'USD',
          minimumFractionDigits: currency === 'BTC' ? 8 : 2,
        }).format(Number(value));
      } catch (error) {
        return `${currency || 'USD'} ${Number(value).toFixed(2)}`;
      }
    },
    getCurrencyPrefix(currency) {
      switch ((currency || '').toUpperCase()) {
        case 'USD':
          return '$';
        case 'EUR':
          return '€';
        case 'BTC':
          return '₿';
        case 'DEMO':
          return 'D$';
        default:
          return currency ? `${currency} ` : '$';
      }
    },
    toggleSettingsModal() {
      this.showSettingsModal = !this.showSettingsModal;
    },
    closeSettingsModal() {
      this.showSettingsModal = false;
    },
    handleHamburgerClick() {
      if (this.isSidebarCollapsed) {
        // Se estiver colapsada, expandir
        this.isSidebarCollapsed = false;
      } else {
        // Se não estiver colapsada, abrir no modo mobile
        this.isSidebarOpen = true;
      }
    },
    // Helper para verificar se componente está montado e válido
    isComponentMounted() {
      if (this.isComponentDestroyed) {
        return false;
      }
      
      try {
        // Verificar se elemento DOM existe e está conectado
        if (!this.$el || !this.$el.isConnected) {
          return false;
        }
        
        // Verificar se componente Vue ainda está válido
        if (!this.$ || !this.$.vnode) {
          return false;
        }
        
        // Verificar se não está em processo de desmontagem
        if (this.$.vnode.component && this.$.vnode.component.isUnmounted) {
          return false;
        }
        
        // Verificar se o vnode tem um elemento e está conectado
        if (this.$.vnode.el && !this.$.vnode.el.isConnected) {
          return false;
        }
        
        return true;
      } catch (e) {
        return false;
      }
    },
    changeView(componentName) {
      // Verificar se componente ainda está montado antes de mudar view
      if (!this.isComponentMounted()) {
        return;
      }

      // Se o usuário quer análise de dígitos, garantimos que estamos no OperationChart e mudamos a aba interna
      if (componentName === 'OperationDigits') {
        this.activeSubTab = 'digits';
        if (this.currentView !== 'OperationChart') {
          this.currentView = 'OperationChart';
          this.$nextTick(() => {
            if (this.$refs.operationComponent && typeof this.$refs.operationComponent.setTab === 'function') {
              this.$refs.operationComponent.setTab('digits');
            }
          });
        } else if (this.$refs.operationComponent && typeof this.$refs.operationComponent.setTab === 'function') {
          this.$refs.operationComponent.setTab('digits');
        }
        return;
      }

      // Se mudar explicitamente para Chart, garantir que a aba correta esteja ativa
      if (componentName === 'OperationChart') {
        this.activeSubTab = 'chart';
        if (this.currentView !== 'OperationChart') {
          this.currentView = 'OperationChart';
          this.$nextTick(() => {
            if (this.$refs.operationComponent && typeof this.$refs.operationComponent.setTab === 'function') {
              this.$refs.operationComponent.setTab('chart');
            }
          });
        } else if (this.$refs.operationComponent && typeof this.$refs.operationComponent.setTab === 'function') {
          this.$refs.operationComponent.setTab('chart');
        }
        return;
      }

      try {
        this.currentView = componentName;
      } catch (error) {
        // Ignorar erros conhecidos relacionados a componentes desmontados
        const errorMsg = String(error?.message || error || '');
        if (!errorMsg.includes('Cannot destructure') && 
            !errorMsg.includes('bum') &&
            !errorMsg.includes('insertBefore') &&
            !errorMsg.includes('Symbol(_assign)')) {
          console.warn('[OperationView] Erro ao mudar view:', error);
        }
      }
    },
    async checkConnection(forceRefresh = false) {
      // Verificar se componente ainda está montado
      if (!this.isComponentMounted()) {
        console.warn('[OperationView] Componente desmontado, ignorando verificação de conexão');
        return;
      }

      console.log('[OperationView] ========== VERIFICANDO CONEXÃO ==========');
      console.log('[OperationView] forceRefresh:', forceRefresh);
      
      const saved = localStorage.getItem('deriv_connection');
      console.log('[OperationView] Conexão salva no localStorage:', saved ? 'Sim' : 'Não');
      
      // Sempre aplicar snapshot salvo primeiro para evitar mostrar saldo zerado
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('[OperationView] Aplicando conexão salva (cache) primeiro...');
          this.applyConnectionSnapshot(parsed);
          
          // Se não for refresh forçado, usar cache e retornar
          if (!forceRefresh) {
            console.log('[OperationView] Usando conexão salva (cache)');
            return;
          }
        } catch (error) {
          console.warn('[OperationView] Erro ao parsear conexão salva:', error);
          // ignore parsing issues
        }
      }

      this.loadingConnection = true;
      console.log('[OperationView] Buscando status atualizado do backend...');
      
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const requestBody = {
          token: localStorage.getItem('deriv_token') || undefined,
          appId: localStorage.getItem('deriv_app_id')
            ? Number(localStorage.getItem('deriv_app_id'))
            : undefined,
        };
        
        console.log('[OperationView] Requisição para /broker/deriv/status:', {
          url: `${apiBaseUrl}/broker/deriv/status`,
          body: requestBody
        });
        
        const res = await fetch(`${apiBaseUrl}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('[OperationView] Resposta do backend:', {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[OperationView] Erro na resposta:', errorText);
          throw new Error('Não foi possível atualizar o status da Deriv');
        }

        const data = await res.json();
        console.log('[OperationView] Dados recebidos do backend:', JSON.stringify(data, null, 2));
        
        // Verificar se componente ainda está montado antes de aplicar snapshot
        if (this.isComponentDestroyed || !this.$el) {
          console.warn('[OperationView] Componente desmontado durante requisição, ignorando resposta');
          return;
        }
        
        const snapshot = { ...data, timestamp: Date.now() };
        this.applyConnectionSnapshot(snapshot);
        localStorage.setItem('deriv_connection', JSON.stringify(snapshot));
        console.log('[OperationView] Conexão atualizada e salva no localStorage');
      } catch (error) {
        console.error('[OperationView] Erro ao verificar conexão:', error);
        if (saved) {
          console.log('[OperationView] Tentando restaurar conexão salva...');
          try {
            this.applyConnectionSnapshot(JSON.parse(saved));
          } catch (err) {
            console.warn('[OperationView] Falha ao restaurar conexão Deriv local:', err);
          }
        }
      } finally {
        this.loadingConnection = false;
        console.log('[OperationView] ========== VERIFICAÇÃO DE CONEXÃO FINALIZADA ==========');
      }
    },
    // Helper para atualizar dados reativos de forma segura
    safeUpdate(callback) {
      // Se componente foi destruído, ignorar
      if (this.isComponentDestroyed) {
        return;
      }
      
      // Adicionar à fila de atualizações
      if (typeof callback === 'function') {
        this.updateQueue.push(callback);
      }
      
      // Processar fila se não estiver processando
      if (!this.isProcessingUpdates) {
        this.processUpdateQueue();
      }
    },
    // Processar fila de atualizações de forma segura
    processUpdateQueue() {
      if (this.isProcessingUpdates || this.isComponentDestroyed) {
        return;
      }
      
      this.isProcessingUpdates = true;
      
      // Usar requestAnimationFrame + nextTick para garantir que estamos fora do ciclo de renderização
      requestAnimationFrame(() => {
        // Verificar se componente ainda está válido antes de usar nextTick
        if (!this.isComponentMounted()) {
          this.updateQueue = [];
          this.isProcessingUpdates = false;
          return;
        }
        
        // Agora usar nextTick para garantir que estamos em um ciclo seguro
        try {
          this.$nextTick(() => {
            try {
              // Verificar novamente se componente ainda está válido
              if (!this.isComponentMounted()) {
                this.updateQueue = [];
                this.isProcessingUpdates = false;
                return;
              }
              
                // Processar fila de atualizações
                while (this.updateQueue.length > 0 && this.isComponentMounted()) {
                  try {
                    const callback = this.updateQueue.shift();
                    if (typeof callback === 'function') {
                      callback();
                    }
                  } catch (callbackError) {
                    // Ignorar erros de callbacks individuais
                    const errorMsg = String(callbackError?.message || callbackError || '');
                    if (!errorMsg.includes('insertBefore') && 
                        !errorMsg.includes('Symbol(_assign)') &&
                        !errorMsg.includes('emitsOptions') &&
                        !errorMsg.includes('_assigning') &&
                        !errorMsg.includes('Cannot destructure')) {
                      console.warn('[OperationView] Erro em callback da fila:', callbackError);
                    }
                  }
                }
                
                this.isProcessingUpdates = false;
              } catch (nextTickError) {
                // Se nextTick falhar, limpar fila e resetar flag
                this.updateQueue = [];
                this.isProcessingUpdates = false;
              }
            });
        } catch (rafError) {
          // Se requestAnimationFrame falhar, limpar tudo
          this.updateQueue = [];
          this.isProcessingUpdates = false;
        }
      });
    },
    applyConnectionSnapshot(snapshot) {
      // Verificar se componente ainda está montado
      if (this.isComponentDestroyed || !this.$el) {
        console.warn('[OperationView] Componente desmontado, ignorando snapshot');
        return;
      }

      console.log('[OperationView] ========== APLICANDO SNAPSHOT DE CONEXÃO ==========');
      console.log('[OperationView] Snapshot completo:', JSON.stringify(snapshot, null, 2));
      
      if (!snapshot) {
        console.warn('[OperationView] Snapshot vazio ou null');
        return;
      }
      
      const balanceValue = snapshot?.balance?.value ?? snapshot.balanceAfter ?? null;
      const currency = snapshot?.currency ?? snapshot?.balance?.currency ?? this.accountCurrency;
      const preferredCurrency = snapshot?.preferredCurrency ?? 'USD';
      const loginid = snapshot?.loginid ?? null;
      const balancesByCurrencyReal = snapshot?.balancesByCurrencyReal ?? snapshot?.aggregatedBalances?.by_type?.deriv?.real ?? {};
      const balancesByCurrencyDemo = snapshot?.balancesByCurrencyDemo ?? snapshot?.aggregatedBalances?.by_type?.deriv?.demo ?? {};
      
      console.log('[OperationView] Valores extraídos:', {
        balanceValue,
        currency,
        preferredCurrency,
        loginid,
        balancesByCurrencyReal,
        balancesByCurrencyDemo
      });
      
      // Usar safeUpdate para atualizar estados reativos
      this.safeUpdate(() => {
        // Verificar se componente ainda está válido antes de continuar
        if (this.isComponentDestroyed || !this.$el || !this.$el.isConnected) {
          return;
        }
        
        // Usar nextTick adicional para garantir que estamos em um ciclo seguro
        try {
          this.$nextTick(() => {
            // Verificar novamente antes de fazer atualizações
            if (this.isComponentDestroyed || !this.$el || !this.$el.isConnected) {
              return;
            }
            
            try {
              if (balanceValue != null) {
                this.accountBalanceValue = Number(balanceValue);
                console.log('[OperationView] Saldo atualizado:', this.accountBalanceValue);
              }
              if (currency) {
                this.accountCurrency = currency.toUpperCase();
                console.log('[OperationView] Moeda da conta atualizada:', this.accountCurrency);
              }
              if (preferredCurrency) {
                this.preferredCurrency = preferredCurrency.toUpperCase();
                console.log('[OperationView] Moeda preferida atualizada:', this.preferredCurrency);
              }
              if (loginid) {
                this.accountLoginId = loginid;
                // Determinar tipo de conta (demo ou real) baseado no loginid
                this.accountType = (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) ? 'demo' : 'real';
                console.log('[OperationView] LoginID atualizado:', this.accountLoginId);
                console.log('[OperationView] Tipo de conta:', this.accountType);
              }
              
              // Atualizar saldos por moeda
              if (balancesByCurrencyReal && Object.keys(balancesByCurrencyReal).length > 0) {
                this.balancesByCurrencyReal = balancesByCurrencyReal;
                console.log('[OperationView] Saldos reais atualizados:', this.balancesByCurrencyReal);
              }
              if (balancesByCurrencyDemo && Object.keys(balancesByCurrencyDemo).length > 0) {
                this.balancesByCurrencyDemo = balancesByCurrencyDemo;
                console.log('[OperationView] Saldos demo atualizados:', this.balancesByCurrencyDemo);
              }
            } catch (updateError) {
              // Ignorar erros de atualização se componente está sendo desmontado
              const errorMsg = String(updateError?.message || updateError || '');
              if (!errorMsg.includes('insertBefore') && 
                  !errorMsg.includes('Symbol(_assign)') && 
                  !errorMsg.includes('emitsOptions') &&
                  !errorMsg.includes('_assigning') &&
                  !errorMsg.includes('Cannot destructure')) {
                console.warn('[OperationView] Erro ao atualizar propriedades:', updateError);
              }
            }
          });
        } catch (nextTickError) {
          // Se nextTick falhar, ignorar silenciosamente
        }
      });
      
      // Armazenar tokens retornados pelo backend no localStorage
      if (snapshot?.tokensByLoginId && Object.keys(snapshot.tokensByLoginId).length > 0) {
        console.log('[OperationView] Tokens recebidos do backend:', Object.keys(snapshot.tokensByLoginId));
        localStorage.setItem('deriv_tokens_by_loginid', JSON.stringify(snapshot.tokensByLoginId));
        console.log('[OperationView] Tokens armazenados no localStorage');
      } else {
        // Se o backend não retornou tokens, verificar se já existem no localStorage
        const existingTokens = localStorage.getItem('deriv_tokens_by_loginid');
        if (existingTokens) {
          try {
            const parsed = JSON.parse(existingTokens);
            if (Object.keys(parsed).length > 0) {
              console.log('[OperationView] Tokens não recebidos do backend, mas encontrados no localStorage:', Object.keys(parsed));
              console.log('[OperationView] Usando tokens existentes do localStorage');
            } else {
              console.warn('[OperationView] Tokens no localStorage estão vazios');
            }
          } catch (e) {
            console.warn('[OperationView] Erro ao parsear tokens do localStorage:', e);
          }
        } else {
          console.warn('[OperationView] Nenhum token encontrado no backend nem no localStorage');
          console.warn('[OperationView] O usuário precisa reconectar via OAuth para armazenar os tokens');
        }
      }
      
      console.log('[OperationView] Estado final:', {
        accountBalanceValue: this.accountBalanceValue,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginId: this.accountLoginId,
        hasTokensByLoginId: !!snapshot?.tokensByLoginId
      });
      console.log('[OperationView] ========== SNAPSHOT APLICADO ==========');
    },
    handleTradeResult(result) {
      console.log('[OperationView] ========== RESULTADO DA OPERAÇÃO RECEBIDO ==========');
      console.log('[OperationView] Resultado completo:', JSON.stringify(result, null, 2));
      console.log('[OperationView] Estado atual da view:', {
        accountBalanceValue: this.accountBalanceValue,
        accountCurrency: this.accountCurrency,
        preferredCurrency: this.preferredCurrency,
        accountLoginId: this.accountLoginId
      });
      
      if (result?.balanceAfter != null) {
        console.log('[OperationView] Atualizando saldo:', {
          anterior: this.accountBalanceValue,
          novo: Number(result.balanceAfter)
        });
        this.accountBalanceValue = Number(result.balanceAfter);
        this.persistConnectionBalance(
          result.balanceAfter,
          result.currency || this.accountCurrency,
        );
      }

      const timestamp = result.purchaseTime
        ? new Date(result.purchaseTime * 1000).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

      // Se o status for CLOSED e tiver contractId, tentar atualizar ordem existente
      if (result.status === 'CLOSED' && result.contractId) {
        const existingOrderIndex = this.lastOrders.findIndex(
          order => order.contractId === result.contractId
        );
        
        if (existingOrderIndex !== -1) {
          // Atualizar ordem existente com o profit
          this.lastOrders[existingOrderIndex].profit = result.profit != null ? Number(result.profit) : null;
          console.log('[OperationView] Ordem existente atualizada com lucro:', this.lastOrders[existingOrderIndex]);
          return;
        }
      }

      const orderEntry = {
        time: timestamp,
        type: result.direction || 'CALL',
        price: result.buyPrice != null ? Number(result.buyPrice) : null,
        profit: result.profit != null ? Number(result.profit) : null,
        currency: result.currency || this.accountCurrency,
        status: result.status || 'EXECUTED',
        longcode: result.longcode || '',
        contractId: result.contractId || null,
      };

      console.log('[OperationView] Adicionando ordem ao histórico:', orderEntry);
      this.lastOrders.unshift(orderEntry);
      this.lastOrders = this.lastOrders.slice(0, 10);
      console.log('[OperationView] Total de ordens no histórico:', this.lastOrders.length);
      console.log('[OperationView] ========== RESULTADO PROCESSADO ==========');
    },
    async loadTradeCurrency() {
      // Carrega o tradeCurrency do settings
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiBase}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.tradeCurrency = data.tradeCurrency || 'USD';
          // Atualizar accountType baseado no tradeCurrency
          this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
          console.log('[OperationView] TradeCurrency carregado:', this.tradeCurrency, 'AccountType:', this.accountType);
        }
      } catch (error) {
        console.error('[OperationView] Erro ao carregar tradeCurrency:', error);
        // Fallback: tentar pegar do deriv_connection
        try {
          const connectionStr = localStorage.getItem('deriv_connection');
          if (connectionStr) {
            const connection = JSON.parse(connectionStr);
            if (connection.tradeCurrency) {
              this.tradeCurrency = connection.tradeCurrency;
              this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
            }
          }
        } catch (e) {
          // Ignorar erro
        }
      }
    },
    async loadLastOrders() {
      console.log('[OperationView] Carregando últimas ordens do banco...');
      try {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        // Seguir o mesmo padrão usado em outros endpoints (sem /api duplicado)
        const res = await fetch(`${apiBaseUrl}/broker/deriv/trading/last-orders?limit=50`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error('[OperationView] Erro ao buscar últimas ordens:', res.status, res.statusText, errorText);
          return;
        }

        const orders = await res.json();
                console.log('[OperationView] Últimas ordens recebidas do backend:', orders);
                console.log('[OperationView] Número de ordens recebidas:', orders?.length || 0);
                if (orders && orders.length > 0) {
                  console.log('[OperationView] Primeira ordem exemplo:', {
                    id: orders[0].id,
                    entrySpot: orders[0].entrySpot,
                    exitSpot: orders[0].exitSpot,
                    entryValue: orders[0].entryValue,
                    exitValue: orders[0].exitValue,
                    symbol: orders[0].symbol,
                    status: orders[0].status
                  });
                }
        
        // Função para mapear símbolo para nome de mercado
        const getMarketName = (symbol) => {
          if (!symbol) return 'N/A';
          const marketMap = {
            'R_10': 'Volatility 10 Index',
            'R_25': 'Volatility 25 Index',
            'R_50': 'Volatility 50 Index',
            'R_75': 'Volatility 75 Index',
            'R_100': 'Volatility 100 Index',
            '1HZ10V': 'Volatility 10 (1s) Index',
            '1HZ25V': 'Volatility 25 (1s) Index',
            '1HZ50V': 'Volatility 50 (1s) Index',
            '1HZ75V': 'Volatility 75 (1s) Index',
            '1HZ100V': 'Volatility 100 (1s) Index',
            'cryBTCUSD': 'BTC/USD',
            'cryETHUSD': 'ETH/USD',
            'frxEURUSD': 'EUR/USD',
            'frxUSDJPY': 'USD/JPY',
            'frxGBPUSD': 'GBP/USD',
            'frxUSDCHF': 'USD/CHF',
            'frxAUDUSD': 'AUD/USD',
            'frxUSDCAD': 'USD/CAD',
            'frxNZDUSD': 'NZD/USD',
            'frxEURGBP': 'EUR/GBP',
            'frxEURJPY': 'EUR/JPY',
            'frxGBPJPY': 'GBP/JPY',
            'frxAUDCAD': 'AUD/CAD',
            'frxAUDJPY': 'AUD/JPY',
            'frxCHFJPY': 'CHF/JPY',
            'frxEURAUD': 'EUR/AUD',
            'frxGBPAUD': 'GBP/AUD',
            'frxUSDMXN': 'USD/MXN',
            'frxXAUUSD': 'XAU/USD',
            'frxXAGUSD': 'XAG/USD',
            'frxXPTUSD': 'XPT/USD',
            'frxXPDUSD': 'XPD/USD',
          };
          return marketMap[symbol] || symbol;
        };

        // Verificar se componente ainda está montado antes de atualizar
        if (this.isComponentDestroyed || !this.$el) {
          console.warn('[OperationView] Componente desmontado, ignorando atualização de ordens');
          return;
        }

        // Converter para o formato esperado pelo componente
        const formattedOrders = orders.map(order => ({
          time: new Date(order.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          type: order.contractType || 'CALL',
          direction: order.contractType || 'CALL',
          buyPrice: order.entryValue || null, // Valor investido (stake)
          entryPrice: order.entrySpot || null, // Preço de entrada (spot)
          sellPrice: order.exitValue || null, // Valor recebido na venda
          exitPrice: order.exitSpot || null, // Preço de saída (spot)
          profit: order.profit != null ? Number(order.profit) : null,
          currency: 'USD',
          status: this.mapStatus(order.status),
          contractId: order.derivTransactionId || null,
          market: getMarketName(order.symbol),
        }));

        // Usar safeUpdate para atualizar lastOrders de forma segura
        this.safeUpdate(() => {
          this.lastOrders = formattedOrders;
        });

        console.log('[OperationView] Últimas ordens formatadas:', this.lastOrders);
        console.log('[OperationView] Total de ordens formatadas:', this.lastOrders.length);
        if (this.lastOrders && this.lastOrders.length > 0) {
          console.log('[OperationView] Primeira ordem formatada exemplo:', {
            time: this.lastOrders[0].time,
            buyPrice: this.lastOrders[0].buyPrice,
            entryPrice: this.lastOrders[0].entryPrice,
            exitPrice: this.lastOrders[0].exitPrice,
            sellPrice: this.lastOrders[0].sellPrice,
            market: this.lastOrders[0].market,
            status: this.lastOrders[0].status
          });
        }
      } catch (error) {
        console.error('[OperationView] Erro ao carregar últimas ordens:', error);
        this.lastOrders = [];
      }
    },
    mapStatus(status) {
      if (!status) return 'PENDING';
      const statusLower = status.toLowerCase();
      // Mapear status do banco para exibição
      if (statusLower === 'won') return 'WON';
      if (statusLower === 'lost') return 'LOST';
      if (statusLower === 'pending') return 'PENDING';
      if (statusLower === 'expired') return 'CLOSED';
      if (statusLower === 'closed') return 'CLOSED';
      if (statusLower === 'sold') return 'CLOSED';
      // Se for um status em uppercase, manter
      return status.toUpperCase();
    },
    persistConnectionBalance(balanceValue, currency) {
      const saved = localStorage.getItem('deriv_connection');
      if (!saved) return;
      try {
        const parsed = JSON.parse(saved);
        parsed.balance = {
          value: Number(balanceValue),
          currency: currency || parsed.balance?.currency || 'USD',
        };
        parsed.timestamp = Date.now();
        localStorage.setItem('deriv_connection', JSON.stringify(parsed));
      } catch (error) {
        console.warn('Não foi possível atualizar cache da Deriv.', error);
      }
    },
  },
  created() {
    this.checkMobile();
    // Se for mobile, iniciar com OperationDigits ao invés de OperationChart
    if (this.isMobile) {
      this.currentView = 'OperationDigits';
    }
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    // Marcar componente como destruído PRIMEIRO
    this.isComponentDestroyed = true;
    
    // Limpar fila de atualizações pendentes
    this.updateQueue = [];
    this.isProcessingUpdates = false;
    
    // Limpar event listeners
    window.removeEventListener('resize', this.checkMobile);
    
    // Cancelar qualquer operação assíncrona pendente
    // (se houver timeouts ou promises pendentes, devem verificar isComponentDestroyed)
  },
  async mounted() {
    // Carregar contas disponíveis assim que a view montar
    this.loadAvailableAccounts();

    // Carregar tradeCurrency do settings primeiro
    await this.loadTradeCurrency();
    
    // Verificar se há saldo salvo no localStorage antes de buscar do backend
    const savedConnection = localStorage.getItem('deriv_connection');
    if (savedConnection) {
      try {
        const parsed = JSON.parse(savedConnection);
        if (parsed.balance?.value != null) {
          // Aplicar saldo salvo imediatamente para evitar mostrar zero
          this.accountBalanceValue = Number(parsed.balance.value);
          this.accountCurrency = parsed.currency || parsed.balance?.currency || 'USD';
          this.accountLoginId = parsed.loginid || null;
          
          // Aplicar saldos por moeda se disponíveis
          if (parsed.balancesByCurrencyReal) {
            this.balancesByCurrencyReal = parsed.balancesByCurrencyReal;
          }
          if (parsed.balancesByCurrencyDemo) {
            this.balancesByCurrencyDemo = parsed.balancesByCurrencyDemo;
          }
          if (this.accountLoginId) {
            this.accountType = (this.accountLoginId.startsWith('VRTC') || this.accountLoginId.startsWith('VRT')) ? 'demo' : 'real';
          }
          console.log('[OperationView] Saldo restaurado do cache:', this.accountBalanceValue);
        }
      } catch (error) {
        console.warn('[OperationView] Erro ao restaurar saldo do cache:', error);
      }
    }
    
    await this.checkConnection(true);
    await this.loadLastOrders();
  },
  watch: {
    '$route'(to, from) {
      // Verificar se realmente mudou de rota ou se estamos na mesma rota (forçar atualização)
      if (to.path === '/operation') {
        // Sempre recarregar quando estiver na rota de operação
        // Isso garante que a view seja atualizada mesmo quando já estamos na rota
        if (from.path !== '/operation') {
          // Primeira vez entrando na página
          this.checkConnection(true);
        } else {
          // Já estávamos na página, forçar atualização
          this.$nextTick(() => {
            if (this.isComponentMounted()) {
              this.checkConnection(true);
            }
          });
        }
      }
    },
  },
};
</script>

<style src="../assets/css/views/operationView.css"></style>
<style scoped>
/* Layout */
.zenix-layout {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #0B0B0B;
  color: #DFDFDF;
  font-family: 'Inter', sans-serif;
  width: 100%;
  overflow-x: hidden;
}

.content-wrapper {
  margin: 0;
  margin-left: 280px;
  padding: 0;
  min-height: 100vh;
  transition: margin-left 1s cubic-bezier(0.16, 1, 0.3, 1), width 1s cubic-bezier(0.16, 1, 0.3, 1);
  width: calc(100% - 280px);
  box-sizing: border-box;
}

.dashboard-content-wrapper.sidebar-collapsed {
  margin-left: 80px;
  width: calc(100% - 80px);
}

/* Top Header */
.top-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 28cap;
  z-index: 40;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-content-wrapper.sidebar-collapsed .top-header {
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

.header-actions-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Main Content */
.main-content {
  margin-top: 60px;
  padding: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  background-color: transparent !important;
}

.view-toggle-bar-wrapper {
  display: flex;
  gap: 1.5rem;
  padding: 0 38px;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}

.view-toggle-bar {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  justify-content: flex-start;
}

.view-toggle-bar .desktop-text {
  display: inline;
}

.view-toggle-bar .mobile-text {
  display: none;
}

/* Mobile/Desktop visibility classes */
.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

.operation-content {
  flex: 1;
  overflow: visible;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.operation-content > * {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}


@media (max-width: 768px) {
  .mobile-only {
    display: block !important;
  }

  .desktop-only {
    display: none !important;
  }

  .mobile-header {
    padding: 20px 16px 16px 16px;
    background: #0B0B0B;
    border-bottom: none;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
  }

  .mobile-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0 0 8px 0;
    line-height: 1.2;
    text-align: left;
  }

  .mobile-subtitle {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.5;
    text-align: left;
  }

  .content-wrapper {
    max-width: 100% !important;
  }

  .header-content {
    padding: 1rem 15px;
    flex-direction: column;
    gap: 1rem;
  }
  
  .top-header {
    left: 0;
    width: 100%;
  }
  
  .main-content {
    margin-top: 140px;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .view-toggle-bar-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding: 0 16px !important;
    box-sizing: border-box;
  }

  .view-toggle-bar {
    width: 100% !important;
    max-width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
    gap: 0 !important;
    box-sizing: border-box;
    overflow-x: hidden;
    border-bottom: none !important;
    align-items: stretch !important;
    padding: 8px 0 !important;
  }

  .view-toggle-bar button {
    flex: 1 1 0% !important;
    min-width: 0 !important;
    padding: 12px 4px !important;
    font-size: 0.8125rem !important;
    border-radius: 8px !important;
    background-color: transparent !important;
    border: 1px solid rgba(34, 197, 94, 0.3) !important;
    color: #7A7A7A !important;
    margin: 0 2px !important;
    box-sizing: border-box;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    text-align: center !important;
  }

  .view-toggle-bar button.border-b-2.border-zenix-green {
    background-color: rgba(34, 197, 94, 0.2) !important;
    color: #22C55E !important;
    border: 1px solid rgba(34, 197, 94, 0.5) !important;
    font-weight: 600 !important;
  }

  .view-toggle-bar button:hover {
    background-color: rgba(255, 255, 255, 0.02) !important;
    color: rgba(255, 255, 255, 0.8) !important;
  }

  .view-toggle-bar .desktop-text {
    display: none !important;
  }

  .view-toggle-bar .mobile-text {
    display: inline !important;
  }

  .operation-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .operation-content > * {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
  }
}

/* Desktop Styles */
@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: block !important;
  }
}
</style>