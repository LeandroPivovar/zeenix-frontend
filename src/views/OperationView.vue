<template>
  <div class="zenix-layout">
    <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @close-sidebar="closeSidebar" @toggle-collapse="toggleSidebarCollapse" />

    <div class="content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <TopNavbar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        :balance="accountBalanceValue"
        :account-type="accountType"
        :currency="accountCurrency"
      />

      <main class="main-content" style="margin-top: 60px;">
        <div class="view-toggle-bar">
          <button
            class="px-6 py-3 bg-zenix-card border-b-2 border-zenix-green text-zenix-text text-sm font-semibold rounded-t-xl transition-all duration-300 shadow-[0_0_8px_rgba(0,0,0,0.25)]"
            :class="{ 'border-b-2 border-zenix-green': currentView === 'OperationChart', 'border-b-2 border-transparent': currentView !== 'OperationChart' }"
            @click="changeView('OperationChart')"
          >
            Análise gráfica
          </button>
          <button
            class="px-6 py-3 bg-zenix-card text-[#7A7A7A] text-sm font-medium rounded-t-xl hover:text-zenix-text hover:bg-[#111] transition-all duration-300"
            :class="{ 'border-b-2 border-zenix-green text-zenix-text': currentView === 'OperationDigits', 'border-b-2 border-transparent': currentView !== 'OperationDigits' }"
            @click="changeView('OperationDigits')"
          >
            Análise de dígitos
          </button>
        </div>

        <div class="operation-content">
          <component
            :is="currentView"
            :account-balance="accountBalanceFormatted"
            :account-currency="accountCurrency"
            :preferred-currency="preferredCurrency"
            :account-loginid="accountLoginId"
            :order-config="orderConfig"
            :last-orders="lastOrdersFormatted"
            @trade-result="handleTradeResult"
          ></component>
        </div>
      </main>

      <!-- Footer -->
      <footer id="footer" class="zenix-footer">
        <div class="footer-content">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="footer-logo-main">ZENIX</span>
                <span class="footer-logo-sub">PRO</span>
              </div>
              <p class="footer-description">
                Plataforma inteligente de investimentos com IA, copy trading e automação.
              </p>
              <div class="footer-social">
                <a href="#" class="social-icon"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-linkedin"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" class="social-icon"><i class="fa-brands fa-youtube"></i></a>
              </div>
            </div>

            <div class="footer-column">
              <h3 class="footer-column-title">Produto</h3>
              <ul class="footer-links">
                <li><a href="#">IA de Investimento</a></li>
                <li><a href="#">Copy Trading</a></li>
                <li><a href="#">Agente Autônomo</a></li>
                <li><a href="#">Zenix Academy</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h3 class="footer-column-title">Empresa</h3>
              <ul class="footer-links">
                <li><a href="#">Sobre Nós</a></li>
                <li><a href="#">Planos</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Carreiras</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h3 class="footer-column-title">Suporte</h3>
              <ul class="footer-links">
                <li><a href="#">Central de Ajuda</a></li>
                <li><a href="#">Documentação</a></li>
                <li><a href="#">Status do Sistema</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p class="footer-copyright">© 2025 Zenix Pro. Todos os direitos reservados.</p>
            <div class="footer-legal">
              <a href="#">Política de Privacidade</a>
              <span class="footer-separator">|</span>
              <a href="#">Termos de Uso</a>
              <span class="footer-separator">|</span>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';
import TopNavbar from '../components/TopNavbar.vue';
import OperationChart from '../components/OperationChart.vue';
import OperationDigits from '../components/OperationDigits.vue';

export default {
  name: 'OperationView',
  components: {
    AppSidebar,
    TopNavbar,
    OperationChart,
    OperationDigits,
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
      isSidebarCollapsed: false,
      loadingConnection: false,
      accountType: 'real', // 'real' ou 'demo'
    };
  },
  computed: {
    accountBalanceFormatted() {
      if (this.accountBalanceValue == null) return '---';
      return this.formatCurrency(this.accountBalanceValue, this.accountCurrency);
    },
    lastOrdersFormatted() {
      return this.lastOrders.map(order => {
        const displayValue =
          order.price != null
            ? this.formatCurrency(order.price, order.currency || this.accountCurrency)
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
  },
  methods: {
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
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
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
    changeView(componentName) {
      this.currentView = componentName;
    },
    async checkConnection(forceRefresh = false) {
      console.log('[OperationView] ========== VERIFICANDO CONEXÃO ==========');
      console.log('[OperationView] forceRefresh:', forceRefresh);
      
      const saved = localStorage.getItem('deriv_connection');
      console.log('[OperationView] Conexão salva no localStorage:', saved ? 'Sim' : 'Não');
      
      if (!forceRefresh && saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log('[OperationView] Usando conexão salva (cache)');
          this.applyConnectionSnapshot(parsed);
          return;
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
    applyConnectionSnapshot(snapshot) {
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
      
      console.log('[OperationView] Valores extraídos:', {
        balanceValue,
        currency,
        preferredCurrency,
        loginid
      });
      
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
  async mounted() {
    await this.checkConnection(true);
  },
  watch: {
    '$route'(to) {
      if (to.path === '/operation') {
        this.checkConnection();
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
  transition: margin-left 0.3s ease;
  width: calc(100% - 280px);
  box-sizing: border-box;
}

.content-wrapper.sidebar-collapsed {
  margin-left: 72px;
  width: calc(100% - 72px);
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
  width: calc(100% - 280px);
  box-sizing: border-box;
}

.content-wrapper.sidebar-collapsed .top-header {
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
  margin-top: 70px;
  padding: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
}

.view-toggle-bar {
  display: flex;
  gap: 0.5rem;
  margin-left: 20px;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
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
  }
}
</style>