<template>
    <div>
      <div
        class="layout-agente-autnomo"
        :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      >
        <div
          v-if="isSidebarOpen && isMobile"
          class="sidebar-overlay"
          @click="closeSidebar"
        ></div>
  
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
          @account-type-changed="handleAccountTypeChange"
          @toggle-sidebar="toggleMobileSidebar"
          @toggle-sidebar-collapse="toggleSidebarCollapse"
        />
  
        <div class="container-componentes">
          <component
            :is="componenteAtual"
            v-bind="agenteData"
            :tempo-ativo="agenteData.tempoAtivo"
            :session-stats="sessionStats"
            :trade-history="tradeHistoryData"
            @pausar-agente="toggleAgenteStatus('componenteAtivo')"
            @iniciar-agente="(configData) => toggleAgenteStatus('componenteInativo', configData)"
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
  import DesktopBottomNav from "../components/DesktopBottomNav.vue";

  export default {
    name: "AgenteAutonomoView",
    components: {
      AgenteAutonomoActive,
      AgenteAutonomoInactive,
      AppSidebar,
      TopNavbar,
      DesktopBottomNav,
    },
    data() {
      return {
        // Estado Principal
        agenteEstaAtivo: false,
  
        // Dados de Configuração Estáticos
        estrategia: "IA SENTINEL",
        mercado: "Volatility 75 Index",
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
        accountBalance: null,
        accountCurrency: "USD",
        accountLoginid: null,
        isDemo: false,
        balanceUpdateInterval: null,
        preferredCurrency: "USD",
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
        
        // Debug: log apenas quando operacoesHoje mudar
        if (operacoesHoje > 0) {
          console.log('[AgenteAutonomo] agenteData computed - operacoesHoje:', operacoesHoje, 'sessionStats.operationsToday:', this.sessionStats?.operationsToday);
        }
        
        return {
          estrategia: this.agentConfig?.strategy ? this.getStrategyTitle(this.agentConfig.strategy) : this.estrategia,
          mercado: this.agentConfig?.symbol ? this.getMarketTitle(this.agentConfig.symbol) : this.mercado,
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
          accountBalance: this.accountBalance,
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
    },
    methods: {
      handleAccountTypeChange(newAccountType) {
        this.isDemo = newAccountType === "demo";
        console.log(
          "[AgenteAutonomo] Tipo de conta alterado para:",
          this.isDemo ? "demo" : "real"
        );
      },
  
      async       toggleAgenteStatus(source, configData = null) {
        if (source === 'componenteInativo') {
          // Iniciar agente com dados de configuração
          this.activateAgent(configData);
        } else if (source === 'componenteAtivo') {
          // Pausar agente
          this.deactivateAgent();
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
          const market = configData?.mercado || 'volatility_75';
          const strategy = configData?.estrategia || 'arion';
          const riskLevel = configData?.risco || 'balanced';
          const symbol = marketToSymbol[market] || 'R_75';

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/autonomous-agent/activate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              userId,
              initialStake,
              dailyProfitTarget,
              dailyLossLimit,
              derivToken,
              currency,
              symbol,
              strategy,
              riskLevel,
            }),
          });

          const result = await response.json();
          if (result.success) {
            this.agenteEstaAtivo = true;
            this.startSimulations();
            this.startPolling();
            this.addSystemAction(
              "Agente Autônomo Iniciado",
              "Aguardando padrões de mercado...",
              "success"
            );
            await this.loadAgentConfig();
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
        try {
          const userId = this.getUserId();
          if (!userId) {
            console.error('[AgenteAutonomo] Erro: Usuário não encontrado');
            return;
          }

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/autonomous-agent/deactivate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ userId }),
          });

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
          } else {
            console.error(`[AgenteAutonomo] Erro: ${result.message || 'Falha ao desativar agente'}`);
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao desativar agente:", error);
        }
      },
      
      async loadAgentConfig() {
        try {
          const userId = this.getUserId();
          if (!userId) return;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/autonomous-agent/config/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const result = await response.json();
          if (result.success && result.data) {
            this.agentConfig = result.data;
            this.agenteEstaAtivo = result.data.isActive || false;
            
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
            
            // Mapear símbolo para mercado
            const symbolToMarket = {
              'R_10': 'Volatility 10 Index',
              'R_25': 'Volatility 25 Index',
              'R_50': 'Volatility 50 Index',
              'R_75': 'Volatility 75 Index',
              'R_100': 'Volatility 100 Index'
            };
            
            // Mapear estratégia
            const strategyMap = {
              'arion': 'Arion',
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
            
            // Atualizar dados do agente
            if (result.data.symbol) {
              this.mercado = symbolToMarket[result.data.symbol] || 'Volatility 75 Index';
            }
            if (result.data.strategy) {
              this.estrategia = strategyMap[result.data.strategy] || 'Arion';
            }
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

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/autonomous-agent/session-stats/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const result = await response.json();
          if (result.success && result.data) {
            console.log('[AgenteAutonomo] Session stats recebidas:', result.data);
            const operationsToday = parseInt(result.data.operationsToday) || 0;
            this.sessionStats = {
              totalTrades: parseInt(result.data.totalTrades) || 0,
              wins: parseInt(result.data.wins) || 0,
              losses: parseInt(result.data.losses) || 0,
              winRate: parseFloat(result.data.winRate) || 0,
              totalProfit: parseFloat(result.data.totalProfit) || 0,
              totalLoss: parseFloat(result.data.totalLoss) || 0,
              netProfit: parseFloat(result.data.netProfit) || 0,
              totalCapital: parseFloat(result.data.totalCapital) || 0,
              operationsToday: operationsToday,
            };
            // Usar operationsToday que inclui ai_trades + autonomous_agent_trades
            this.operacoesHoje = operationsToday;
            this.dailyProfit = this.sessionStats.netProfit || 0;
            console.log('[AgenteAutonomo] Operações hoje definidas:', this.operacoesHoje, 'operationsToday do backend:', operationsToday, 'sessionStats:', this.sessionStats);
          }
        } catch (error) {
          console.error("[AgenteAutonomo] Erro ao carregar estatísticas:", error);
        }
      },
      
      async loadTradeHistory() {
        try {
          const userId = this.getUserId();
          if (!userId) return;

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/autonomous-agent/trade-history/${userId}?limit=50`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

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

          const apiBase = process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/autonomous-agent/logs/${userId}?limit=100`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const result = await response.json();
          if (result.success && result.data && Array.isArray(result.data)) {
            // Converter logs do banco para o formato esperado pelo OperationLogs
            const logEntries = result.data.map(log => {
              // Determinar tipo de log baseado no módulo e nível
              let logType = 'info';
              if (log.module === 'TRADER') {
                if (log.level === 'ERROR' || log.message.includes('loss') || log.message.includes('LOST')) {
                  logType = 'loss';
                } else if (log.message.includes('profit') || log.message.includes('WON')) {
                  logType = 'gain';
                } else if (log.message.includes('Buy') || log.message.includes('Proposal')) {
                  logType = 'purchase';
                }
              } else if (log.module === 'RISK') {
                logType = 'strategy';
              }
              
              // Formatar timestamp de forma segura
              let formattedTimestamp = '--';
              if (log.timestamp) {
                try {
                  const date = new Date(log.timestamp);
                  if (!isNaN(date.getTime())) {
                    formattedTimestamp = date.toLocaleString('pt-BR');
                  }
                } catch (error) {
                  formattedTimestamp = '--';
                }
              }
              
              return {
                id: log.id,
                timestamp: formattedTimestamp,
                type: logType,
                message: log.message,
                module: log.module,
                level: log.level,
              };
            });
            
            // Adicionar aos agentActions para exibição
            this.agentActions = logEntries.slice(0, 20).map(log => ({
              status: log.level === 'ERROR' ? 'error' : (log.level === 'WARN' ? 'warning' : (log.type === 'gain' ? 'success' : 'info')),
              title: log.message.split('.')[0] || log.message,
              description: log.message,
              timestamp: log.timestamp,
            }));
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
          mercado: this.getMarketTitle(this.selectedMarket),
          risco: this.getRiskTitle(this.selectedRisk),
          goalValue: this.metaLucroNumero,
          stopValue: this.limitePerdaNumero,
        };
        this.$emit("iniciar-agente", configData);
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
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
          const derivToken = this.getDerivToken();
          if (!derivToken) {
            console.warn(
              "[AgenteAutonomo] ❌ Token não disponível para buscar saldo"
            );
            return;
          }
  
          const apiBase =
            process.env.VUE_APP_API_BASE_URL || "https://taxafacil.site/api";
          const response = await fetch(`${apiBase}/ai/deriv-balance`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ derivToken: derivToken }),
          });
  
          const result = await response.json();
  
          if (result.success && result.data) {
            this.accountBalance = result.data.balance;
            this.accountCurrency = result.data.currency;
            this.accountLoginid = result.data.loginid;
            this.isDemo =
              result.data.loginid?.startsWith("VRTC") ||
              result.data.loginid?.startsWith("VRT");
            this.preferredCurrency = this.getPreferredCurrency();
  
            console.log("[AgenteAutonomo] ✅ Saldo atualizado:", {
              balance: this.accountBalance,
              currency: this.accountCurrency,
              loginid: this.accountLoginid,
              isDemo: this.isDemo,
              preferredCurrency: this.preferredCurrency,
            });
          } else {
            console.error(
              "[AgenteAutonomo] ❌ Erro ao buscar saldo:",
              result.message || "Unknown error"
            );
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
          this.fetchAccountBalance();
        }, 30000);
      },
  
      stopBalanceUpdates() {
        if (this.balanceUpdateInterval) {
          clearInterval(this.balanceUpdateInterval);
          this.balanceUpdateInterval = null;
        }
      },
  
      getMarketTitle(symbolOrId) {
        // Se for símbolo (R_10, R_75, etc), mapear para título
        const symbolMap = {
          'R_10': 'Volatility 10 Index',
          'R_25': 'Volatility 25 Index',
          'R_50': 'Volatility 50 Index',
          'R_75': 'Volatility 75 Index',
          'R_100': 'Volatility 100 Index'
        };
        
        // Se for ID de mercado (volatility_10, etc)
        const idMap = {
          'volatility_10': 'Volatility 10 Index',
          'volatility_25': 'Volatility 25 Index',
          'volatility_50': 'Volatility 50 Index',
          'volatility_75': 'Volatility 75 Index',
          'volatility_100': 'Volatility 100 Index'
        };
        
        return symbolMap[symbolOrId] || idMap[symbolOrId] || symbolOrId;
      },
      
      getStrategyTitle(id) {
        const map = {
          'arion': 'Arion',
          'cryptomax': 'CryptoMax',
          'orion_ultra': 'Orion Ultra',
          'metaflow': 'MetaFlow'
        };
        return map[id] || id;
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
        this.preferredCurrency = this.getPreferredCurrency();
        this.startBalanceUpdates();
        this.checkMobile();

        window.addEventListener("resize", this.checkMobile);

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
    transition: margin-left 0.3s ease, width 0.3s ease;
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
    width: 100%;
    margin-left: 0;
  }
  
  .layout-agente-autnomo.sidebar-collapsed .top-header {
    left: 0;
    width: 100% !important;
  }
  
  .container-componentes {
    padding-left: 60px;
    padding-right: 60px;
    padding-bottom: 20px;
    margin-top: 60px;
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
    transition: left 0.3s ease;
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
      padding: 0 2rem 20px 2rem;
      margin-top: 80px;

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
      transition: transform 0.3s ease-out;
    }
  
    /* 2. Quando o AppSidebar tiver a classe .is-open, ela aparece */
    :deep(.sidebar.is-open) {
      transform: translateX(0); /* Traz de volta para a tela */
      z-index: 10000 !important; /* Z-index alto para ficar acima de tudo */
    }
  }
  
  /* Responsividade Mobile */
  @media screen and (max-width: 768px) {
    .layout-agente-autnomo {
      padding-bottom: 100px !important;
    }

    .container-componentes {
      padding: 1px 1rem 20px 1rem !important;
      margin-top: 50px;
      background: linear-gradient(to bottom, 50%, #000100 100%) !important;
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
