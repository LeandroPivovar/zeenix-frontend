<template>
    <div>
      <div
        class="layout-agente-autnomo"
        :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
      >
        <button
          class="hamburger-btn"
          @click="toggleMobileSidebar"
          :class="{ active: isSidebarOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
  
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
        />
  
        <div class="container-componentes">
          <component
            :is="componenteAtual"
            v-bind="agenteData"
            @pausar-agente="toggleAgenteStatus('componenteAtivo')"
            @iniciar-agente="toggleAgenteStatus('componenteInativo')"
          />
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  import AppSidebar from "../components/Sidebar.vue";
  import TopNavbar from "../components/TopNavbar.vue";
  import AgenteAutonomoActive from "../components/autonomo/AgenteAutonomoActive.vue";
  import AgenteAutonomoInactive from "../components/autonomo/AgenteAutonomoInactive.vue";
  
  export default {
    name: "AgenteAutonomoView",
    components: {
      AgenteAutonomoActive,
      AgenteAutonomoInactive,
      AppSidebar,
      TopNavbar,
    },
    data() {
      return {
        // Estado Principal
        agenteEstaAtivo: false,
  
        // Dados de Configuração Estáticos
        estrategia: "Arkon",
        mercado: "Índices Sintéticos",
        risco: "Equilibrado",
        goalValue: 50.0,
        stopValue: 25.0,
  
        // Dados Reativos e de Simulação
        dailyProfit: 0.0,
        dailyChange: 0.0,
        accumulatedLoss: 0.0,
        accumulatedChange: 0.0,
        lastExecutionTime: "00:00:00",
        tempoAtivo: "0h 0m",
        operacoesHoje: 0,
  
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
        return {
          estrategia: this.estrategia,
          mercado: this.mercado,
          risco: this.risco,
          goalValue: this.goalValue,
          stopValue: this.stopValue,
          dailyProfit: this.dailyProfit,
          dailyChange: this.dailyChange,
          accumulatedLoss: this.accumulatedLoss,
          accumulatedChange: this.accumulatedChange,
          lastExecutionTime: this.lastExecutionTime,
          tempoAtivo: this.tempoAtivo,
          operacoesHoje: this.operacoesHoje,
          realTimeOperations: this.realTimeOperations,
          operationHistory: this.operationHistory,
          agentActions: this.agentActions,
          agentStatus: this.agenteEstaAtivo ? "ATIVO" : "PAUSADO",
          accountBalance: this.accountBalance,
        };
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
  
      toggleAgenteStatus(source) {
        this.agenteEstaAtivo = !this.agenteEstaAtivo;
        if (this.agenteEstaAtivo) {
          this.startSimulations();
          this.addSystemAction(
            "Agente Autônomo Iniciado",
            "Aguardando padrões de mercado..."
          );
          this.$nextTick(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          });
        } else {
          this.stopSimulations();
          this.addSystemAction(
            "Agente Autônomo Pausado",
            "O sistema parou de analisar e operar."
          );
        }
        console.log(
          `[AgenteAutonomo] Status do Agente alterado. Acionado por: ${source}`
        );
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
    mounted() {
      this.addSystemAction(
        "Sistema carregado",
        "Aguardando o início do agente..."
      );
      this.preferredCurrency = this.getPreferredCurrency();
      this.startBalanceUpdates();
      this.checkMobile();
  
      window.addEventListener("resize", this.checkMobile);
  
      if (!this.agenteEstaAtivo) {
        this.timeAndMetricsInterval = setInterval(this.updateTimeAndMetrics, 1000);
      }
    },
    beforeUnmount() {
      this.stopSimulations();
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
    background-color: #0a0b0a;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
    padding-bottom: 40px;
    width: calc(100% - 280px);
    margin-left: 280px;
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
  
  /* Botão Hambúrguer */
  .hamburger-btn {
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1001; /* Z-index MAIOR que o da sidebar (1000) */
    background-color: #1c1c1c;
    border: 1px solid #2c2c2c;
    border-radius: 8px;
    width: 45px;
    height: 45px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .hamburger-btn:hover {
    background-color: #252525;
    border-color: #3c3c3c;
  }
  
  .hamburger-btn span {
    display: block;
    width: 22px;
    height: 2px;
    background-color: #dfdfdf;
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  
  .hamburger-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .hamburger-btn.active span:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger-btn.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
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
  
    .hamburger-btn {
      display: flex; /* Mostra o botão hambúrguer */
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
    }
  }
  
  /* Responsividade Mobile */
  @media screen and (max-width: 768px) {
    .container-componentes {
      padding: 0 1rem 20px 1rem;
      margin-top: 50px;
      background: linear-gradient(135deg, rgba(16, 26, 16, 0.95) 0%, rgba(10, 20, 10, 0.98) 50%, #0B0B0B 100%) !important;
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
    .hamburger-btn {
      width: 40px;
      height: 40px;
      top: 12px;
      left: 12px;
    }
  
    .hamburger-btn span {
      width: 20px;
    }
  
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
        background: #0b0b0b;
    }
  }
  </style>