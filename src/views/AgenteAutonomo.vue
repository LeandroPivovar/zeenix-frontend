<template>
    <div>
      <div
        class="layout-agente-autnomo"
        :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      >

  
        <AppSidebar
          :is-open="isSidebarOpen"
          :is-collapsed="isSidebarCollapsed"
          :is-mobile="isMobile"
          @close-sidebar="closeSidebar"
          @toggle-collapse="toggleSidebarCollapse"
        />
  
        <TopNavbar
          :is-sidebar-collapsed="isSidebarCollapsed"
          :balance="accountBalance"
          :account-type="isDemo ? 'demo' : 'real'"
          :currency="accountCurrency"
          :balances-by-currency-real="balancesByCurrencyReal"
          :balances-by-currency-demo="balancesByCurrencyDemo"
          @account-type-changed="handleAccountTypeChange"
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
          :active-service="'agent'"
          @close="isSettingsOpen = false"
          @account-type-changed="handleAccountTypeChange"
        />
  
        <div class="container-componentes">
          <component
            :is="componenteAtual"
            :agente-data="agenteData"
            :tempo-ativo="agenteData.tempoAtivo"
            :session-stats="sessionStats"
            :trade-history="tradeHistoryData"
            :user-id="currentUserId"
            :plan-features="planFeatures"
            :is-mobile="isMobile"
            @pausar-agente="toggleAgenteStatus('componenteAtivo')"
            @iniciar-agente="(configData) => toggleAgenteStatus('componenteInativo', configData)"
            @change-agent="handleChangeAgent"
            @live-balance-update="handleLiveBalanceUpdate"
          />
        </div>

        <DesktopBottomNav />
      </div>
    </div>
  </template>
  
  <script>
  import AppSidebar from "../components/Sidebar.vue";
  import TopNavbar from "../components/TopNavbar.vue";
  import AgenteAutonomoActive from "../components/autonomo/AgenteAutonomoActive.vue";
  import AgenteAutonomoInactive from "../components/autonomo/AgenteAutonomoInactive.vue";
  import SettingsSidebar from "../components/SettingsSidebar.vue";
  import DesktopBottomNav from "../components/DesktopBottomNav.vue";
  import { loadAccountBalance, reloadAccountBalance } from '../utils/balanceLoader';
  import { loadAvailableAccounts } from '../utils/accountsLoader';
  import accountBalanceMixin from '../mixins/accountBalanceMixin';

  export default {
    name: "AgenteAutonomoView",
    components: {
      AgenteAutonomoActive,
      AgenteAutonomoInactive,
      AppSidebar,
      TopNavbar,
      SettingsSidebar,
      DesktopBottomNav,
    },
    mixins: [accountBalanceMixin],
    data() {
      return {
        // Estado Principal
        agenteEstaAtivo: false,
  
        // Dados de Configuração Estáticos
        estrategia: "IA SENTINEL",
        mercado: "Volatility 100 Index", // ✅ Todos os agentes autônomos usam R_100
        risco: "Conservador-Adaptativo",
        goalValue: 50.0,
        stopValue: 25.0,
  
        // Dados Reativos e de Simulação
        dailyProfit: 0.0,
        dailyChange: 0.0,
        accumulatedLoss: 0.0,
        accumulatedChange: 0.0,
        lastExecutionTime: "00:00:00",
        tempoAtivo: "0h 0m 0s",
        operacoesHoje: 0,
        
        // Dados da API
        agentConfig: null,
        sessionStats: {
          totalTrades: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          totalProfit: 0,
          totalLoss: 0,
          netProfit: 0,
          totalCapital: 0,
          operationsToday: 0,
        },
        apiTradeHistory: [],
        pollingInterval: null,
        timeUpdateInterval: null,
  
        // Dados de simulação para o gráfico
        realTimeOperations: [
          { x: 0, y: 75, value: 0.0 },
          { x: 25, y: 75, value: 0.0 },
          { x: 50, y: 75, value: 0.0 },
          { x: 75, y: 75, value: 0.0 },
          { x: 100, y: 75, value: 0.0 },
        ],
  
        // Histórico de Operações
        operationHistory: [],
  
        // Ações do Agente
        agentActions: [],
  
        // Estado do Sidebar
        isSidebarOpen: false, // Começa fechado no mobile
        isSidebarCollapsed: false,
        isMobile: false,
  
        // Intervalos de Simulação
        chartInterval: null,
        profitInterval: null,
        timeAndMetricsInterval: null,
  
        // Dados de Header/Saldo
        accountBalance: 0, // Inicializar como 0 em vez de null para evitar problemas de reatividade
        accountCurrency: "USD",
        accountLoginid: null,
        isDemo: false,
        balanceUpdateInterval: null,
        preferredCurrency: "USD",
        balancesByCurrencyReal: {},
        balancesByCurrencyDemo: {},
        isSettingsOpen: false,
        availableAccounts: [],
        loadingAccounts: false,
      };
    },
    computed: {
      componenteAtual() {
        return this.agenteEstaAtivo
          ? "AgenteAutonomoActive"
          : "AgenteAutonomoInactive";
      },
  
      agenteData() {
        // Calcular tempo ativo baseado na data da sessão atual (sessionDate)
        // Se não houver sessionDate ou se for meia-noite (apenas data), usar createdAt como fallback
        let tempoAtivo = "0h 0m 0s";
        
        if (this.agentConfig && this.agenteEstaAtivo) {
          // SEMPRE usar sessionDate se tiver hora completa, senão usar createdAt
          let startDate = this.agentConfig.sessionDate;
          
          // Verificar se sessionDate é meia-noite (00:00:00) - se for, usar createdAt
          if (startDate) {
            const sessionDateStr = String(startDate);
            // Se contém T00:00:00, é meia-noite - usar createdAt
            if (sessionDateStr.includes('T00:00:00')) {
              startDate = this.agentConfig.createdAt;
            }
          }
          
          // Se ainda não tiver startDate, usar createdAt
          if (!startDate && this.agentConfig.createdAt) {
            startDate = this.agentConfig.createdAt;
          }
          
          if (startDate) {
            try {
              const startTime = new Date(startDate).getTime();
              const now = new Date().getTime();
              
              if (!isNaN(startTime) && !isNaN(now)) {
                const diffMs = now - startTime;
                
                if (diffMs > 0) {
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
                  tempoAtivo = `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
                }
              }
            } catch (error) {
              console.error('[AgenteAutonomo] Erro ao calcular tempo ativo:', error);
            }
          }
        }
        
        // Retornar objeto reativo com todas as propriedades
        
        // Usar dados do backend quando disponíveis
        // operationsToday inclui ai_trades + autonomous_agent_trades do dia de hoje
        // Priorizar sessionStats.operationsToday, depois operacoesHoje local, depois 0
        const operacoesHoje = (this.sessionStats?.operationsToday !== undefined && this.sessionStats?.operationsToday !== null) 
          ? this.sessionStats.operationsToday 
          : (this.operacoesHoje || 0);
        const dailyProfit = this.sessionStats?.netProfit !== undefined ? this.sessionStats.netProfit : (this.agentConfig?.dailyProfit || this.dailyProfit || 0);
        const dailyLoss = this.sessionStats?.totalLoss !== undefined ? this.sessionStats.totalLoss : (this.agentConfig?.dailyLoss || 0);
        
        // Debug: log apenas quando operacoesHoje mudar ou accountBalance mudar
        if (operacoesHoje > 0 || (this.accountBalance && this.accountBalance > 0)) {
          console.log('[AgenteAutonomo] agenteData computed - operacoesHoje:', operacoesHoje, 'sessionStats.operationsToday:', this.sessionStats?.operationsToday, 'accountBalance:', this.accountBalance);
        }
        
        // Garantir que accountBalance seja sempre um número válido
        let accountBalanceValue = 0;
        if (this.accountBalance !== null && this.accountBalance !== undefined) {
          if (typeof this.accountBalance === 'number') {
            accountBalanceValue = this.accountBalance;
          } else if (typeof this.accountBalance === 'object') {
            // Se for um objeto (retornado pelo balanceLoader), extrair o valor numérico
            const balanceObj = this.accountBalance;
            if (balanceObj.balance !== undefined && balanceObj.balance !== null) {
              accountBalanceValue = typeof balanceObj.balance === 'number' 
                ? balanceObj.balance 
                : parseFloat(String(balanceObj.balance)) || 0;
            } else if (balanceObj.value !== undefined && balanceObj.value !== null) {
              accountBalanceValue = typeof balanceObj.value === 'number' 
                ? balanceObj.value 
                : parseFloat(String(balanceObj.value)) || 0;
            } else {
              // Tentar converter o objeto inteiro para número (improvável, mas tenta)
              const parsed = parseFloat(String(this.accountBalance));
              accountBalanceValue = isNaN(parsed) ? 0 : parsed;
            }
          } else {
            // String ou outro tipo
            const parsed = parseFloat(String(this.accountBalance));
            accountBalanceValue = isNaN(parsed) ? 0 : parsed;
          }
        }
        
        // Log detalhado para debug (sempre logar quando houver valores ou quando sessionStats existir)
        if (this.sessionStats && (accountBalanceValue > 0 || this.accountBalance !== null)) {
          console.log('[AgenteAutonomo] 💰 agenteData computed - accountBalance:', {
            accountBalance: this.accountBalance,
            accountBalanceType: typeof this.accountBalance,
            accountBalanceValue: accountBalanceValue,
            sessionStatsNetProfit: this.sessionStats?.netProfit,
            operacoesHoje: operacoesHoje,
          });
        }
        
        return {
          id: this.agentConfig?.agentType 
            ? this.agentConfig.agentType.toLowerCase() 
            : (this.agentConfig?.strategy ? this.agentConfig.strategy.toLowerCase() : (this.selectedStrategy?.toLowerCase() || 'sentinel')),
          // ✅ Usar agentType se disponível, senão usar strategy
          estrategia: this.agentConfig?.agentType 
            ? this.getStrategyTitle(this.agentConfig.agentType) 
            : (this.agentConfig?.strategy ? this.getStrategyTitle(this.agentConfig.strategy) : this.estrategia),
          // ✅ Mercado sempre é "Volatility 100 Index"
          mercado: 'Volatility 100 Index',
          risco: this.agentConfig?.riskLevel ? this.getRiskTitle(this.agentConfig.riskLevel) : this.risco,
          goalValue: this.goalValue,
          stopValue: this.stopValue,
          dailyProfit: dailyProfit,
          dailyChange: 0, // Será calculado no componente filho com base no totalCapital
          accumulatedLoss: dailyLoss,
          accumulatedChange: 0, // Será calculado no componente filho com base no totalCapital
          lastExecutionTime: this.lastExecutionTime,
          tempoAtivo: tempoAtivo,
          operacoesHoje: operacoesHoje,
          realTimeOperations: this.realTimeOperations,
          operationHistory: this.operationHistory,
          agentActions: this.agentActions,
          agentStatus: this.agenteEstaAtivo ? "ATIVO" : "PAUSADO",
          accountBalance: accountBalanceValue, // Garantir que sempre seja um número válido
          sessionStatus: this.agentConfig?.sessionStatus || 'active', // ✅ Passar status da sessão para modais
        };
      },
      
      tradeHistoryData() {
        // Retornar histórico completo da API
        return this.apiTradeHistory || [];
      },
  
      formattedBalance() {
        if (this.accountBalance === null || this.accountBalance === undefined)
          return "---";
        const prefix = this.getCurrencyPrefix(this.preferredCurrency);
        return `${prefix}${this.accountBalance.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
  
      currencyPrefix() {
        return this.getCurrencyPrefix(this.preferredCurrency);
      },
      currentUserId() {
          return this.getUserId();
      },
    },
    methods: {
      handleAccountTypeChange(newAccountType) {
        console.log(
          "[AgenteAutonomo] Tipo de conta alterado via componente filho para:",
          newAccountType
        );
        this.isDemo = newAccountType === "demo";
        // NÃO chamar switchAccount() pois o componente filho (Sidebar/Navbar) já faz o reload.
      },

      async loadAvailableAccounts() {
        this.loadingAccounts = true;
        try {
          const accounts = await loadAvailableAccounts();
          this.availableAccounts = accounts;
        } catch (error) {
          console.error('[AgenteAutonomo] Erro ao carregar contas:', error);
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
            console.log(`[AgenteAutonomo] Sincronizando conta ${type} com token: ${matchingAccount.loginid}`);
            
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
              
              this.isDemo = isDemo;
              this.accountCurrency = tradeCurrency;
              
              console.log('[AgenteAutonomo] ✅ Conta e token sincronizados com sucesso');
              window.location.reload();
              return;
            }
          }

          // Fallback: se não encontrar conta específica ou falhar, tentar atualizar apenas a moeda
          console.warn('[AgenteAutonomo] ⚠️ Nenhuma conta correspondente encontrada ou falha no sync, tentando apenas moeda...');
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
            this.isDemo = isDemo;
            this.accountCurrency = tradeCurrency;
            window.location.reload();
          } else {
            throw new Error('Erro ao alterar conta');
          }
        } catch (error) {
          console.error('[AgenteAutonomo] Erro ao alterar moeda:', error);
          await alert('Erro ao alterar moeda. Tente novamente.');
        }
      },
      handleLiveBalanceUpdate(newBalance) {
        if (newBalance !== undefined && newBalance !== null) {
          // Mantendo compatibilidade com o mixin e TopNavbar
          console.log('[AgenteAutonomoView] 💰 Recebida atualização de saldo live:', newBalance);
          this.accountBalance = newBalance;
          
          if (this.info) {
              this.info.balance = newBalance;
              // Sincronizar também no balancesByCurrency do info se for USD
              const currency = this.accountCurrency || 'USD';
              if (this.info.balancesByCurrencyReal && !this.isDemo) {
                  this.info.balancesByCurrencyReal[currency] = newBalance;
              } else if (this.info.balancesByCurrencyDemo && this.isDemo) {
                  this.info.balancesByCurrencyDemo[currency] = newBalance;
              }
          }
        }
      },
  
      async handleChangeAgent(agentId) {
        console.log('[AgenteAutonomo] Trocando para o agente:', agentId);
        
        // 1. Atualizar a estratégia selecionada no estado (para que o Inactive carregue o certo)
        // Mapear agentId para o formato esperado (Ex: 'zeus' -> 'IA Zeus')
        const strategyMap = {
            'zeus': 'IA Zeus',
            'falcon': 'IA Falcon'
        };
        // Se preferir, pode salvar apenas o ID e o child component converte. 
        // Vamos salvar o ID em uma nova prop ou reutilizar as existentes.
        // O AgenteAutonomoInactive usa dados do 'agenteData'.
        // Vamos forçar a atualização do 'agentConfig' local temporariamente antes de desativar?
        // Melhor: apenas desativar e garantir que o 'selectedAgentType' seja passado.
        
        // Atualiza a estratégia padrão para quando cair na tela de config
        this.estrategia = strategyMap[agentId] || 'IA Sentinel';
        
        // 2. Parar o agente atual (isso vai trocar o componente para Inactive)
        await this.deactivateAgent();
        
        // 3. (Opcional) Poderíamos forçar um reload ou limpar filtros, mas o Inactive deve pegar o this.estrategia
      },

      async toggleAgenteStatus(source, configData = null) {
        console.log('[AgenteAutonomo] toggleAgenteStatus chamado:', { source, configData });
        if (source === 'componenteInativo') {
          // Iniciar agente com dados de configuração
          this.activateAgent(configData);
        } else if (source === 'componenteAtivo') {
          // Pausar agente
          console.log('[AgenteAutonomo] Chamando deactivateAgent...');
          await this.deactivateAgent();
        } else {
          console.warn('[AgenteAutonomo] toggleAgenteStatus chamado com source desconhecido:', source);
        }
      },
      
      async activateAgent(configData = null) {
        try {
          const userId = this.getUserId();
          if (!userId) {
            console.error('[AgenteAutonomo] Erro: Usuário não encontrado');
            return;
          }

          const derivToken = this.getDerivToken();
          if (!derivToken) {
            console.error('[AgenteAutonomo] Erro: Token Deriv não encontrado');
            return;
          }

          const connectionStr = localStorage.getItem("deriv_connection");
          let connection = {};
          try {
            connection = connectionStr ? JSON.parse(connectionStr) : {};
          } catch (error) {
            console.error('[AgenteAutonomo] Erro ao parsear deriv_connection:', error);
            connection = {};
          }
          const currency = connection.tradeCurrency || 'USD';

          // Mapear mercado para símbolo
          const marketToSymbol = {
            'volatility_10': 'R_10',
            'volatility_25': 'R_25',
            'volatility_50': 'R_50',
            'volatility_75': 'R_75',
            'volatility_100': 'R_100'
          };

          // Usar dados do configData se disponível, senão usar valores padrão
          const initialStake = configData?.initialStake || this.goalValue || 10.0;
          const dailyProfitTarget = configData?.goalValue || this.goalValue || 200.0;
          const dailyLossLimit = configData?.stopValue || this.stopValue || 240.0;
          const market = configData?.mercado || 'volatility_100';
          // ✅ FIX: Derive strategy from agentType if not explicitly provided
          let strategy = configData?.estrategia;
          if (!strategy && configData?.agentType) {
             strategy = configData.agentType; 
          }
          if (!strategy) strategy = 'arion'; // Fallback

          const riskLevel = configData?.risco || 'balanced';
          const stopLossType = configData?.stopLossType || 'normal'; // ✅ FIX: Include stopLossType
          const symbol = marketToSymbol[market] || 'R_100';
          
          // Usar saldo atual da conta como initialBalance (valor total da conta configurada)
          // Se accountBalance não estiver disponível, usar 0 (o backend tentará buscar o saldo)
          const initialBalance = this.accountBalance && typeof this.accountBalance === 'number' 
            ? this.accountBalance 
            : 0;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
          const url = `${apiBase}/autonomous-agent/activate`;
          const body = {
              userId,
              agentType: configData?.agentType || 'sentinel',
              initialStake,
              dailyProfitTarget,
              dailyLossLimit,
              initialBalance,
              derivToken,
              currency,
              symbol,
              strategy,
              riskLevel,
              stopLossType, // ✅ FIX: Pass to backend
            };
          console.log('[AgenteAutonomo] Sending POST request to:', url);
          console.log('[AgenteAutonomo] Request Body:', body);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(body),
          });

          console.log('[AgenteAutonomo] Activation Response Status:', response.status);

          const result = await response.json();
          if (result.success) {
            // ✅ Definir como ativo ANTES de carregar config (evita race condition)
            this.agenteEstaAtivo = true;
            this.startSimulations();
            this.startPolling();
            this.addSystemAction(
              "Agente Autônomo Iniciado",
              "Aguardando padrões de mercado...",
              "success"
            );
            
            // ✅ Aguardar um pouco antes de carregar config (dar tempo para o banco atualizar)
            await new Promise(resolve => setTimeout(resolve, 500));
            await this.loadAgentConfig();
            
            // ✅ Garantir que agenteEstaAtivo permaneça true após carregar config
            // (não sobrescrever se já estiver true)
            if (this.agenteEstaAtivo) {
              // Se já estava true, manter true mesmo se loadAgentConfig retornar false
              // (pode ser um delay no banco)
            } else if (this.agentConfig && this.agentConfig.isActive) {
              // Se loadAgentConfig confirmou que está ativo, definir como true
              this.agenteEstaAtivo = true;
            }
            
            // ✅ Forçar atualização dos gráficos com novos ticks (sessão limpa)
            // O componente AgenteAutonomoActive vai buscar os ticks automaticamente
            // quando detectar que o agente foi ativado
            
            this.$nextTick(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            });
          } else {
            console.error(`[AgenteAutonomo] Erro: ${result.message || 'Falha ao ativar agente'}`);
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao ativar agente:", error);
        }
      },
      
      async deactivateAgent() {
        console.log('[AgenteAutonomo] deactivateAgent chamado');
        try {
          const userId = this.getUserId();
          if (!userId) {
            console.error('[AgenteAutonomo] Erro: Usuário não encontrado');
            if (this.$root && this.$root.$toast) {
              this.$root.$toast.error('Erro: Usuário não encontrado');
            }
            return;
          }

          console.log('[AgenteAutonomo] Fazendo requisição para desativar agente...', { userId });
          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
          const url = `${apiBase}/autonomous-agent/deactivate`;
          console.log('[AgenteAutonomo] Sending POST request to:', url);
          console.log('[AgenteAutonomo] Request Body:', { userId });

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ userId }),
          });
          
          console.log('[AgenteAutonomo] Deactivation Response Status:', response.status);

          // Verificar se a resposta HTTP está ok
          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Erro ao desativar agente';
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
              errorMessage = `Erro ${response.status}: ${errorText || 'Falha na comunicação com o servidor'}`;
            }
            
            console.error(`[AgenteAutonomo] Erro HTTP ${response.status}:`, errorMessage);
            if (this.$root && this.$root.$toast) {
              this.$root.$toast.error(errorMessage);
            }
            
            // Mesmo em caso de erro, tentar atualizar o estado local para evitar estado inconsistente
            this.agenteEstaAtivo = false;
            this.stopSimulations();
            this.stopPolling();
            return;
          }

          const result = await response.json();
          if (result.success) {
            this.agenteEstaAtivo = false;
            this.stopSimulations();
            this.stopPolling();
            this.addSystemAction(
              "Agente Autônomo Pausado",
              "O sistema parou de analisar e operar.",
              "warning"
            );
            this.agentConfig = null;
            
            // Mostrar mensagem de sucesso
            if (this.$root && this.$root.$toast) {
              this.$root.$toast.success('Agente pausado com sucesso');
            }
          } else {
            const errorMessage = result.message || 'Falha ao desativar agente';
            console.error(`[AgenteAutonomo] Erro: ${errorMessage}`);
            if (this.$root && this.$root.$toast) {
              this.$root.$toast.error(errorMessage);
            }
            
            // Mesmo em caso de erro, tentar atualizar o estado local
            this.agenteEstaAtivo = false;
            this.stopSimulations();
            this.stopPolling();
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao desativar agente:", error);
          const errorMessage = error.message || 'Erro ao desativar agente. Tente novamente.';
          if (this.$root && this.$root.$toast) {
            this.$root.$toast.error(errorMessage);
          }
          
          // Mesmo em caso de erro, tentar atualizar o estado local
          this.agenteEstaAtivo = false;
          this.stopSimulations();
          this.stopPolling();
        }
      },
      
      async loadAgentConfig() {
        try {
          const userId = this.getUserId();
          if (!userId) return;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
          const url = `${apiBase}/autonomous-agent/config/${userId}`;
          console.log('[AgenteAutonomo] Fetching config from:', url);

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log('[AgenteAutonomo] Config Response Status:', response.status);

          const result = await response.json();
          if (result.success && result.data && typeof result.data === 'object' && result.data !== null) {
            // Garantir que agentConfig seja definido de forma segura
            try {
              this.agentConfig = result.data;
              // ✅ Só atualizar agenteEstaAtivo se o valor for explicitamente true
              // Não sobrescrever para false se já estiver true (pode ser delay no banco)
              if (result.data.isActive === true) {
                this.agenteEstaAtivo = true;
              } else if (result.data.isActive === false) {
                // Só definir como false se explicitamente for false
                this.agenteEstaAtivo = false;
              }
              // Se isActive não estiver definido, manter o estado atual
            } catch (error) {
              console.error('[AgenteAutonomo] Erro ao definir agentConfig:', error);
              this.agentConfig = {};
              // Não definir como false automaticamente em caso de erro
              // Manter o estado atual para evitar desativação acidental
            }
            
            // Debug: logar dados recebidos
            console.log('[AgenteAutonomo] Config carregado:', {
              isActive: result.data.isActive,
              sessionDate: result.data.sessionDate,
              createdAt: result.data.createdAt,
              sessionStatus: result.data.sessionStatus
            });
            
            // Atualizar dados locais
            if (result.data.dailyProfitTarget) {
              this.goalValue = result.data.dailyProfitTarget;
            }
            if (result.data.dailyLossLimit) {
              this.stopValue = result.data.dailyLossLimit;
            }
            
            // ✅ Mapear estratégia baseado no agentType (prioridade) ou strategy
            const strategyMap = {
              'orion': 'IA Orion',
              'sentinel': 'IA Sentinel',
              'falcon': 'IA Falcon',
              'arion': 'Arion', // Compatibilidade com versões antigas
              'cryptomax': 'CryptoMax',
              'orion_ultra': 'Orion Ultra',
              'metaflow': 'MetaFlow'
            };
            
            // Mapear nível de risco
            const riskMap = {
              'conservative': 'Conservador',
              'balanced': 'Equilibrado',
              'aggressive': 'Agressivo'
            };
            
            // ✅ Atualizar estratégia: usar agentType se disponível, senão usar strategy
            const agentTypeOrStrategy = result.data.agentType || result.data.strategy;
            if (agentTypeOrStrategy) {
              this.estrategia = strategyMap[agentTypeOrStrategy.toLowerCase()] || agentTypeOrStrategy;
            }
            
            // ✅ Mercado sempre é "Volatility 100 Index" (todos os agentes autônomos usam R_100)
            this.mercado = 'Volatility 100 Index';
            if (result.data.riskLevel) {
              this.risco = riskMap[result.data.riskLevel] || 'Equilibrado';
            }
            if (result.data.dailyLossLimit) {
              this.stopValue = result.data.dailyLossLimit;
            }
            // Atualizar dados de operações e lucro/perda do backend
            if (result.data.totalTrades !== undefined) {
              this.operacoesHoje = parseInt(result.data.totalTrades) || 0;
            }
            if (result.data.dailyProfit !== undefined) {
              this.dailyProfit = parseFloat(result.data.dailyProfit) || 0;
            }
            if (result.data.dailyLoss !== undefined) {
              // Armazenar perda acumulada para uso no agenteData
              if (!this.sessionStats) {
                this.sessionStats = {};
              }
              this.sessionStats.totalLoss = parseFloat(result.data.dailyLoss) || 0;
            }
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao carregar configuração:", error);
        }
      },
      
      async loadSessionStats() {
        try {
          const userId = this.getUserId();
          if (!userId) return;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
          const url = `${apiBase}/autonomous-agent/session-stats/${userId}`;
          console.log('[AgenteAutonomo] Fetching session stats from:', url);

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log('[AgenteAutonomo] Session Stats Response Status:', response.status);

          const result = await response.json();
          console.log('[AgenteAutonomo] 📊 Resposta completa do backend:', result);
          if (result.success && result.data) {
            console.log('[AgenteAutonomo] ✅ Session stats recebidas:', result.data);
            const operationsToday = parseInt(result.data.operationsToday) || 0;
            const netProfit = parseFloat(result.data.netProfit) || 0;
            console.log('[AgenteAutonomo] 💰 netProfit recebido:', netProfit, 'tipo:', typeof netProfit);
            this.sessionStats = {
              totalTrades: parseInt(result.data.totalTrades) || 0,
              wins: parseInt(result.data.wins) || 0,
              losses: parseInt(result.data.losses) || 0,
              winRate: parseFloat(result.data.winRate) || 0,
              totalProfit: parseFloat(result.data.totalProfit) || 0,
              totalLoss: parseFloat(result.data.totalLoss) || 0,
              netProfit: netProfit,
              totalCapital: parseFloat(result.data.totalCapital) || 0,
              operationsToday: operationsToday,
              evolution: result.data.evolution || [],
            };
            // Usar operationsToday que inclui ai_trades + autonomous_agent_trades
            this.operacoesHoje = operationsToday;
            this.dailyProfit = netProfit;
            console.log('[AgenteAutonomo] ✅ Operações hoje definidas:', this.operacoesHoje, 'operationsToday do backend:', operationsToday);
            console.log('[AgenteAutonomo] ✅ sessionStats atualizado:', this.sessionStats);
            console.log('[AgenteAutonomo] ✅ dailyProfit atualizado:', this.dailyProfit);
          } else {
            console.warn('[AgenteAutonomo] ⚠️ Resposta inválida ou sem dados:', result);
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao carregar estatísticas:", error);
        }
      },
      
      async loadTradeHistory() {
        try {
          const userId = this.getUserId();
          if (!userId) return;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
          const url = `${apiBase}/autonomous-agent/trade-history/${userId}?limit=50`;
          console.log('[AgenteAutonomo] Fetching trade history from:', url);
          
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log('[AgenteAutonomo] Trade History Response Status:', response.status);

          const result = await response.json();
          if (result.success && result.data && Array.isArray(result.data)) {
            // Armazenar histórico completo da API
            this.apiTradeHistory = result.data;
            
            // Converter histórico da API para o formato esperado pelo componente
            this.operationHistory = result.data.map(trade => {
              // Formatar timestamp de forma segura
              let formattedTime = '--';
              if (trade.createdAt) {
                try {
                  const date = new Date(trade.createdAt);
                  if (!isNaN(date.getTime())) {
                    formattedTime = date.toLocaleTimeString('pt-BR');
                  }
                } catch (error) {
                  formattedTime = '--';
                }
              }
              
              return {
                time: formattedTime,
                asset: trade.symbol || 'R_75',
                type: trade.contractType === 'RISE' || trade.contractType === 'HIGHER' ? 'CALL' : 'PUT',
                entry: parseFloat(trade.entryPrice) || 0,
                exit: parseFloat(trade.exitPrice) || 0,
                result: trade.profitLoss || 0,
              };
            });
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao carregar histórico:", error);
        }
      },
      
      async loadAgentLogs() {
        try {
          const userId = this.getUserId();
          if (!userId) return;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
          const url = `${apiBase}/autonomous-agent/logs/${userId}?limit=100`;
          console.log('[AgenteAutonomo] Fetching logs from:', url);
          
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log('[AgenteAutonomo] Logs Response Status:', response.status);

          const result = await response.json();
          if (result.success && result.data && Array.isArray(result.data)) {
            // Converter logs do banco para o formato esperado pelo OperationLogs
            const logEntries = result.data.map(log => {
              // Determinar tipo de log baseado no módulo e nível
              let logType = 'info';
              if (log.module === 'TRADER' || log.module === 'API') {
                if (log.level === 'ERROR' || log.message.toLowerCase().includes('loss') || log.message.toLowerCase().includes('lost') || log.message.toLowerCase().includes('perda')) {
                  logType = 'loss';
                } else if (log.message.toLowerCase().includes('profit') || log.message.toLowerCase().includes('won') || log.message.toLowerCase().includes('lucro') || log.message.toLowerCase().includes('ganho')) {
                  logType = 'gain';
                } else if (log.message.toLowerCase().includes('buy') || log.message.toLowerCase().includes('proposal') || log.message.toLowerCase().includes('comprando')) {
                  logType = 'purchase';
                }
              } else if (log.module === 'RISK') {
                logType = 'strategy';
              } else if (log.module === 'CORE') {
                // Logs do CORE são informativos sobre o status do agente
                if (log.message.toLowerCase().includes('ativo') || log.message.toLowerCase().includes('processando')) {
                  logType = 'info';
                }
              }
              
              // Formatar timestamp de forma segura
              let formattedTimestamp = '--';
              if (log.timestamp) {
                try {
                  const date = new Date(log.timestamp);
                  if (!isNaN(date.getTime())) {
                    // Formato: HH:mm:ss
                    formattedTimestamp = date.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    });
                  }
                } catch (error) {
                  formattedTimestamp = '--';
                }
              }
              
              // Limpar mensagem removendo prefixos duplicados
              let cleanMessage = log.message || '';
              // Remover prefixos como [CORE] - se já estiverem na mensagem
              cleanMessage = cleanMessage.replace(/^\[.*?\]\s*-\s*/g, '');
              
              return {
                id: log.id,
                timestamp: formattedTimestamp,
                type: logType,
                message: cleanMessage,
                module: log.module,
                level: log.level || log.logLevel,
              };
            });
            
            // ✅ Filtrar logs duplicados por ID e ordenar por timestamp (mais recentes primeiro)
            const uniqueLogs = logEntries.filter((log, index, self) => 
              index === self.findIndex(l => l.id === log.id)
            );
            
            // Adicionar aos agentActions para exibição (mais recentes primeiro)
            this.agentActions = uniqueLogs.slice(0, 20).map(log => {
              // Limpar título removendo caracteres especiais e vírgulas
              let title = log.message.split('.')[0] || log.message;
              title = title.substring(0, 50).trim();
              
              return {
                status: log.level === 'ERROR' ? 'error' : (log.level === 'WARN' ? 'warning' : (log.type === 'gain' ? 'success' : (log.type === 'loss' ? 'error' : 'info'))),
                title: title,
                description: log.message,
                timestamp: log.timestamp,
              };
            });
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao carregar logs:", error);
        }
      },
      
      startPolling() {
        // Carregar dados imediatamente
        this.loadAgentConfig();
        this.loadSessionStats();
        this.loadTradeHistory();
        this.loadAgentLogs();

        // Polling a cada 5 segundos se o agente estiver ativo
        this.pollingInterval = setInterval(() => {
          if (this.agenteEstaAtivo) {
            this.loadAgentConfig();
            this.loadSessionStats();
            this.loadTradeHistory();
            this.loadAgentLogs();
            this.fetchAccountBalance();
          }
        }, 5000);
        
        // Atualizar tempo ativo a cada segundo para mostrar tempo preciso com segundos
        this.timeUpdateInterval = setInterval(() => {
          if (this.agenteEstaAtivo && this.agentConfig) {
            // Força atualização do computed agenteData para recalcular tempo ativo
            this.$forceUpdate();
          }
        }, 1000); // A cada 1 segundo para atualizar segundos para atualização mais fluida
      },
      
      stopPolling() {
        if (this.pollingInterval) {
          clearInterval(this.pollingInterval);
          this.pollingInterval = null;
        }
        if (this.timeUpdateInterval) {
          clearInterval(this.timeUpdateInterval);
          this.timeUpdateInterval = null;
        }
      },
      
      getUserId() {
        // Tentar obter do localStorage primeiro
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.id || user.userId) {
              return user.id || user.userId;
            }
          } catch (error) {
            console.error("[AgenteAutonomo] Erro ao parsear user:", error);
          }
        }

        // Fallback: tentar decodificar do token JWT
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Tentar diferentes campos comuns do payload JWT
            if (payload.userId || payload.sub || payload.id) {
              const userId = payload.userId || payload.sub || payload.id;
              console.log("[AgenteAutonomo] userId obtido do token JWT:", userId);
              return userId;
            }
          } catch (error) {
            console.error("[AgenteAutonomo] Erro ao decodificar token JWT:", error);
          }
        }

        console.error("[AgenteAutonomo] Não foi possível obter userId");
        return null;
      },
  
      iniciarAgente() {
        const configData = {
          estrategia: this.getStrategyTitle(this.selectedStrategy),
          mercado: this.getMarketTitle(),
          risco: this.getRiskTitle(this.selectedRisk),
          goalValue: this.metaLucroNumero,
          stopValue: this.limitePerdaNumero,
        };
        this.$emit("iniciar-agente", configData);
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      },

      toggleSettingsModal() {
        this.isSettingsOpen = !this.isSettingsOpen;
      },
  
      updateTimeAndMetrics() {
        if (!this.agenteEstaAtivo) return;
        const now = new Date();
        this.lastExecutionTime = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
  
        const randomProfitChange = Math.random() * 5 - 2.5;
        this.dailyProfit = Math.max(
          -this.stopValue,
          Math.min(this.goalValue, this.dailyProfit + randomProfitChange)
        );
  
        const initialCapital = 1000;
        this.dailyChange = (this.dailyProfit / initialCapital) * 100;
      },
  
      updateRealTimeChart() {
        if (!this.agenteEstaAtivo) return;
  
        const newPoints = this.realTimeOperations.slice(1).map((p) => ({
          ...p,
          x: p.x - 25,
        }));
  
        const lastY =
          this.realTimeOperations[this.realTimeOperations.length - 1]?.y || 75;
        const newY = Math.max(50, Math.min(90, lastY + (Math.random() * 20 - 10)));
        const newValue = Math.abs(this.dailyProfit / 5 + (Math.random() * 5 - 2.5));
  
        newPoints.push({ x: 100, y: newY, value: newValue });
        this.realTimeOperations = newPoints;
  
        if (Math.random() > 0.8) {
          this.addNewOperation();
        }
      },
  
      addNewOperation() {
        const isProfit = Math.random() > 0.4;
        const result = isProfit
          ? Math.random() * 10 + 5
          : Math.random() * -10 - 5;
        const assetName = Math.random() > 0.5 ? "Volatility 75" : "Boom 1000";
        const type = Math.random() > 0.5 ? "CALL" : "PUT";
        const entry = 10.0;
        const exit = entry + result;
  
        this.operationHistory.unshift({
          time: this.lastExecutionTime,
          asset: assetName,
          type: type,
          entry: entry,
          exit: exit,
          result: result,
        });
  
        this.operacoesHoje++;
        this.dailyProfit += result;
        this.addSystemAction(
          "Operação finalizada",
          `${this.lastExecutionTime} - ${
            isProfit ? "Lucro" : "Prejuízo"
          } de $${Math.abs(result).toFixed(2)}`,
          isProfit ? "success" : "error"
        );
  
        if (this.operationHistory.length > 5) {
          this.operationHistory.pop();
        }
      },
  
      addSystemAction(title, description, status = "info") {
        this.agentActions.unshift({
          status: status,
          title: title,
          description: description,
        });
  
        if (this.agentActions.length > 5) {
          this.agentActions.pop();
        }
      },
  
      startSimulations() {
        this.timeAndMetricsInterval = setInterval(this.updateTimeAndMetrics, 1000);
        this.chartInterval = setInterval(this.updateRealTimeChart, 3000);
      },
  
      stopSimulations() {
        clearInterval(this.timeAndMetricsInterval);
        clearInterval(this.chartInterval);
        this.timeAndMetricsInterval = null;
        this.chartInterval = null;
      },
  
      toggleMobileSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
  
      closeSidebar() {
        this.isSidebarOpen = false;
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
  
      getPreferredCurrency() {
        try {
          const connectionStr = localStorage.getItem("deriv_connection");
          if (connectionStr) {
            const connection = JSON.parse(connectionStr);
            if (connection.tradeCurrency) {
              const currency = connection.tradeCurrency.toUpperCase();
              console.log("[AgenteAutonomo] Moeda preferida:", currency);
              return currency;
            }
          }
        } catch (error) {
          console.error(
            "[AgenteAutonomo] Erro ao parsear deriv_connection:",
            error
          );
        }
        return "USD";
      },
  
      getDerivToken() {
        console.log("[AgenteAutonomo] Buscando token Deriv...");
        let accountLoginid = null;
        let preferredCurrency = null;
  
        try {
          const connectionStr = localStorage.getItem("deriv_connection");
          if (connectionStr) {
            const connection = JSON.parse(connectionStr);
            accountLoginid = connection.loginid;
            preferredCurrency = connection.tradeCurrency;
          }
        } catch (error) {
          console.error(
            "[AgenteAutonomo] Erro ao parsear deriv_connection:",
            error
          );
        }
  
        const isDemoPreferred = preferredCurrency?.toUpperCase() === "DEMO";
  
        if (isDemoPreferred) {
          try {
            const tokensByLoginIdStr =
              localStorage.getItem("deriv_tokens_by_loginid") || "{}";
            const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
  
            for (const [loginid, token] of Object.entries(tokensByLoginId)) {
              if (loginid.startsWith("VRTC") || loginid.startsWith("VRT")) {
                console.log("[AgenteAutonomo] ✓ Token demo encontrado");
                return token;
              }
            }
          } catch (error) {
            console.error("[AgenteAutonomo] Erro ao buscar token demo:", error);
          }
        }
  
        if (accountLoginid) {
          try {
            const tokensByLoginIdStr =
              localStorage.getItem("deriv_tokens_by_loginid") || "{}";
            const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
            const specificToken = tokensByLoginId[accountLoginid];
  
            if (specificToken) {
              console.log("[AgenteAutonomo] ✓ Token específico encontrado");
              return specificToken;
            }
          } catch (error) {
            console.error(
              "[AgenteAutonomo] Erro ao buscar token específico:",
              error
            );
          }
        }
  
        const defaultToken = localStorage.getItem("deriv_token");
        if (!defaultToken) {
          console.error("[AgenteAutonomo] ERRO: Nenhum token encontrado!");
        }
        return defaultToken;
      },
  
      async fetchAccountBalance() {
        try {
          const balanceData = await loadAccountBalance();
          if (balanceData) {
            const oldBalance = this.accountBalance;
            // ✅ Garantir que accountBalance seja sempre um número
            let balanceValue = balanceData.balance;
            if (typeof balanceValue === 'object' && balanceValue !== null) {
              // Se for objeto, tentar extrair o valor
              balanceValue = balanceValue.balance || balanceValue.value || 0;
            }
            this.accountBalance = typeof balanceValue === 'number' ? balanceValue : (parseFloat(String(balanceValue)) || 0);
            this.accountCurrency = balanceData.currency;
            this.accountLoginid = balanceData.loginid;
            this.isDemo = balanceData.isDemo;
            this.preferredCurrency = this.getPreferredCurrency();
            this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
            this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};

            console.log("[AgenteAutonomo] ✅ Saldo atualizado:", {
              balance: this.accountBalance,
              balanceType: typeof this.accountBalance,
              oldBalance: oldBalance,
              balanceDataBalance: balanceData.balance,
              balanceDataBalanceType: typeof balanceData.balance,
              currency: this.accountCurrency,
              loginid: this.accountLoginid,
              isDemo: this.isDemo,
              preferredCurrency: this.preferredCurrency,
              balancesByCurrencyReal: this.balancesByCurrencyReal,
              balancesByCurrencyDemo: this.balancesByCurrencyDemo,
            });
            
            // Forçar atualização do computed agenteData quando o saldo mudar
            if (oldBalance !== this.accountBalance && this.accountBalance > 0) {
              this.$forceUpdate();
            }
          }
        } catch (error) {
          console.error(
            "[AgenteAutonomo] ❌ Erro ao buscar saldo da conta:",
            error
          );
        }
      },
  
      startBalanceUpdates() {
        this.fetchAccountBalance();
        this.balanceUpdateInterval = setInterval(() => {
          // Usar reloadAccountBalance para forçar atualização (ignora cache)
          reloadAccountBalance().then(balanceData => {
            if (balanceData) {
              const oldBalance = this.accountBalance;
              // ✅ Garantir que accountBalance seja sempre um número
              let balanceValue = balanceData.balance;
              if (typeof balanceValue === 'object' && balanceValue !== null) {
                // Se for objeto, tentar extrair o valor
                balanceValue = balanceValue.balance || balanceValue.value || 0;
              }
              this.accountBalance = typeof balanceValue === 'number' ? balanceValue : (parseFloat(String(balanceValue)) || 0);
              this.accountCurrency = balanceData.currency;
              this.accountLoginid = balanceData.loginid;
              this.isDemo = balanceData.isDemo;
              this.preferredCurrency = this.getPreferredCurrency();
              this.balancesByCurrencyReal = balanceData.balancesByCurrencyReal || {};
              this.balancesByCurrencyDemo = balanceData.balancesByCurrencyDemo || {};
              
              // Forçar atualização do computed agenteData quando o saldo mudar
              if (oldBalance !== balanceData.balance && balanceData.balance > 0) {
                this.$forceUpdate();
              }
            }
          }).catch(error => {
            console.error('[AgenteAutonomo] Erro ao atualizar saldo:', error);
          });
        }, 5000);
      },
  
      stopBalanceUpdates() {
        if (this.balanceUpdateInterval) {
          clearInterval(this.balanceUpdateInterval);
          this.balanceUpdateInterval = null;
        }
      },
  
      getMarketTitle() {
        // ✅ Todos os agentes autônomos sempre usam R_100
        return 'Volatility 100 Index';
      },
      
      getStrategyTitle(id) {
        const map = {
          'zeus': 'IA Zeus',
          'orion': 'IA Orion',
          'sentinel': 'IA Sentinel',
          'falcon': 'IA Falcon',
          'arion': 'Arion', // Compatibilidade com versões antigas
          'cryptomax': 'CryptoMax',
          'orion_ultra': 'Orion Ultra',
          'metaflow': 'MetaFlow'
        };
        return map[id?.toLowerCase()] || id;
      },
      
      getRiskTitle(id) {
        const map = {
          'conservative': 'Conservador',
          'balanced': 'Equilibrado',
          'aggressive': 'Agressivo'
        };
        return map[id] || id;
      },
      
      getCurrencyPrefix(currency) {
        switch ((currency || "").toUpperCase()) {
          case "USD":
            return "$";
          case "EUR":
            return "€";
          case "BTC":
            return "₿";
          case "DEMO":
            return "D$";
          default:
            return currency ? `${currency} ` : "";
        }
      },
    },
    async mounted() {
        // Carregar contas disponíveis
        this.loadAvailableAccounts();

        this.preferredCurrency = this.getPreferredCurrency();
        this.checkMobile();

        window.addEventListener("resize", this.checkMobile);
        window.addEventListener("refreshBalance", () => this.fetchAccountBalance());

        // Carregar saldo primeiro para que esteja disponível quando agenteData for computado
        await this.fetchAccountBalance();
        this.startBalanceUpdates();
        
        // Carregar configuração do agente ao montar
        await this.loadAgentConfig();
        await this.loadSessionStats();
        
        if (this.agenteEstaAtivo) {
          this.startPolling();
          // Usar dados reais da API, não simulações
        } else {
          // Atualizar última execução periodicamente
          this.timeAndMetricsInterval = setInterval(() => {
            this.lastExecutionTime = new Date().toLocaleTimeString('pt-BR');
          }, 1000);
        }
      },
    beforeUnmount() {
      this.stopSimulations();
      this.stopPolling();
      this.stopBalanceUpdates();
      window.removeEventListener("resize", this.checkMobile);
  
      if (this.timeAndMetricsInterval) {
        clearInterval(this.timeAndMetricsInterval);
      }
    },
  };
  </script>
  
  <style scoped>
  /* Layout Principal */
  .layout-agente-autnomo {
    background: linear-gradient(to bottom, #102018 0%, #020403 50%, #000100 100%);
    min-height: 100vh;
    transition: margin-left 1s cubic-bezier(0.16, 1, 0.3, 1), width 1s cubic-bezier(0.16, 1, 0.3, 1);
    padding-bottom: 80px;
    width: calc(100% - 280px);
    margin-left: 280px;
  }

  @media (min-width: 1025px) {
    .layout-agente-autnomo {
      padding-bottom: 40px;
      background: #0b0b0b;
    }

    /* Cards com background #0e0e0e no desktop */
    :deep(.option-card) {
      background: #0e0e0e !important;
    }

    :deep(.option-card:hover:not(.selected)) {
      background: #0e0e0e !important;
    }

    :deep(.option-card.selected) {
      background: #0e0e0e !important;
    }

    :deep(.status-card) {
      background: #0e0e0e !important;
    }

    :deep(.container-sections) {
      background: #0e0e0e !important;
    }
  }
  
  .layout-agente-autnomo.sidebar-collapsed {
  }
  
  .layout-agente-autnomo.sidebar-collapsed .top-header {
  }
  
  .container-componentes {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    margin: 0px;
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
    z-index: 998; /* Z-index MENOR que o da sidebar (1000) */
    backdrop-filter: blur(2px);
  }
  
  /* Top Header */
  .top-header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 40;
    background-color: #0e0e0e;
    border-bottom: 1px solid #1c1c1c;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
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
    color: #dfdfdf;
    margin: 0;
    line-height: 1.2;
  }
  
  .header-subtitle {
    font-size: 0.875rem;
    color: #a1a1a1;
    margin: 0;
    line-height: 1.4;
  }
  
  .balance-display-card {
    background-color: #0e0e0e;
    border: 1px solid #1c1c1c;
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
    color: #22c55e;
    font-size: 0.75rem;
  }
  
  .balance-info {
    display: flex;
    flex-direction: column;
  }
  
  .balance-label {
    font-size: 0.625rem;
    color: #7a7a7a;
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
    color: #dfdfdf;
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
    background-color: #22c55e;
    color: #000;
  }
  
  .real-btn:hover {
    background-color: #16a34a;
  }
  
  .demo-btn {
    background-color: #333;
    color: #a1a1a1;
  }
  
  .eye-toggle-btn {
    background: none;
    border: none;
    color: #a1a1a1;
    cursor: pointer;
    padding: 0.25rem;
    transition: color 0.2s;
  }
  
  .eye-toggle-btn:hover {
    color: #dfdfdf;
  }
  

  @media screen and (max-width: 1400px) {
    .footer-section[data-v-558ac89a] {   
        max-width: 200px !important;
     }
  }
  /* Responsividade Tablet */
  .container-componentes {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    margin: 20px 0;
    background: transparent;
    position: relative;
    z-index: 1;
  }
  
  /* Responsividade Tablet */
  @media screen and (max-width: 1024px) {
    .layout-agente-autnomo {
      width: 100% !important;
      margin-left: 0 !important;
    }
  
    .layout-agente-autnomo.sidebar-collapsed {
      width: 100% !important;
      margin-left: 0 !important;
    }
  
    .layout-agente-autnomo.sidebar-collapsed .top-header {
      left: 0;
      width: 100% !important;
    }
  
    .container-componentes {
      padding: 0 1rem 20px 1rem;
      margin-top: 50px;
    }
  
    .top-header {
      left: 0;
      width: 100% !important;
    }
  
  
    .sidebar-overlay {
      display: block; /* Permite que o overlay apareça (o v-if controla) */
    }
  
    /* * 👇 [ESTA É A CORREÇÃO] 👇
     * Usamos :deep() para forçar o estilo no componente <AppSidebar>
    */
  
    /* 1. Por padrão (mobile), a sidebar (classe .sidebar) fica escondida */
    :deep(.sidebar) {
      position: fixed;
      width: 280px !important; /* Largura total, sem colapsar */
      height: 100vh;
      z-index: 1000; /* Z-index ACIMA do overlay (998) */
      transform: translateX(-100%); /* Joga para fora da tela */
    }
  
    /* 2. Quando o AppSidebar tiver a classe .is-open, ela aparece */
    :deep(.sidebar.is-open) {
      transform: translateX(0); /* Traz de volta para a tela */
      z-index: 999999 !important; /* Z-index alto para ficar acima de tudo */
    }
  }
  
  /* Responsividade Mobile */
  @media screen and (max-width: 768px) {
    .layout-agente-autnomo {
      padding-bottom: 100px !important;
    }

    .container-componentes {
      padding: 4rem 1rem 20px 1rem !important;
      margin-top: 0;
      background: linear-gradient(180deg, transparent 50%, #000100) !important;
      background-blend-mode: normal;
      position: relative;
      min-height: calc(100vh - 50px);
    }

    .container-componentes::before {
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

    .container-componentes > * {
      position: relative;
      z-index: 1;
    }
    .header-content {
      padding: 1rem 15px 1rem 70px; /* Espaço para o hambúrguer */
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  
    .header-left-content {
      width: 100%;
    }
  
    .header-title {
      font-size: 1.25rem;
    }
  
    .header-subtitle {
      font-size: 0.8rem;
    }
  
    .balance-display-card {
      width: 100%;
    }
  
    /* Footer responsivo */
    #footer .grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  
    #footer .max-w-7xl {
      padding: 2rem 1rem;
    }
  }
  
  /* Responsividade Mobile Pequeno */
  @media screen and (max-width: 480px) {
  
    .header-content {
      padding: 0.75rem 12px 0.75rem 60px;
    }
  
    .header-title {
      font-size: 1.1rem;
    }
  
    .header-subtitle {
      font-size: 0.75rem;
    }
  
    .balance-value {
      font-size: 0.9rem;
    }
  
    .layout-agente-autnomo {
        background: linear-gradient(to bottom, #102018 0%, #020403 50%, #000100 100%);
    }
  }
  </style>